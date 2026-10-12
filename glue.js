// ============================================================================
//  Chorro de pegamento — modulo reutilizable
// ----------------------------------------------------------------------------
//  Un chorro de pegamento cae encima de la pantalla y va llenandola de charcos
//  SOLO. No es un juego ni un aviso: es para cuando alguien se queda mirando la
//  pantalla sin hacer nada.
//
//      import { glueSiEstaQuieto } from "./glue.js";
//      glueSiEstaQuieto(10);       // a los 10 segundos quieto, cae el chorro
//
//  Que hace, exacto:
//   - Cuenta los segundos SIN INTERACTUAR. Cualquier toque, scroll o tecla lo
//     reinicia, asi que si la persona esta usando la pantalla, no pasa nada.
//   - Cuando se cumplen los segundos, prende el chorro.
//   - El chorro se mantiene SOLO en bucle, y ADEMAS escurre agua desde arriba
//     por toda la pantalla.
//   - El PRIMER toque lo apaga al instante y borra el lienzo: no queda rastro.
//
//  Notas de seguridad (esto es lo importante):
//   - El lienzo va con `pointer-events:none`: NUNCA tapa un boton. Se puede
//     seguir usando la pagina con normalidad mientras corre.
//   - Al apagar, se quitan el lienzo, el bucle y los escuchas. Si algo falla,
//     la pagina sigue igual: por eso va aparte y no se mete en el juego.
//   - **Todo tiene tope**: 70 charcos (los viejos se desvanecen, no se borran de
//     golpe), 16 escurridos de agua y 34 puntos de estela. Ademas hay un
//     REDUCTOR AUTOMATICO: si el telefono baja de velocidad, el modulo se
//     achica solo (menos agua, menos charcos) y se vuelve a agrandar cuando se
//     recupera. Por eso puede correr todo el rato sin trabar el celular.
//   - Si la persona se cambia de pestana, se apaga sola (no gasta bateria).
//   - Se respeta la opcion "glue_mute" del almacenamiento local, que lo apaga
//     sin quitar nada mas de la pantalla.
// ============================================================================

const Z = 50;              // encima del contenido, DEBAJO de los modales (60)
const CLAVE_MUTE = "glue_mute";

// Tope de charcos "vivos". Los que se pasan de aqui NO se borran de golpe: se
// ponen a desvanecerse y desaparecen solos, que es lo que pedia Fredy (oct-2026).
// El tope sigue existiendo porque SIN el los charcos se acumulan sin limite y el
// celular se pone lento (y al final el navegador se cae).
const MAX_BLOBS = 70;
const DESVANECER = 1.2;         // segundos que tarda un charco viejo en irse
const GRAV = 2000;

// Reglas del agua que escurre desde arriba. Los topes son la red de seguridad:
// aun en el peor caso el telefono tiene que aguantar.
const MAX_ESCURRIDOS = 16;      // nunca mas de este many a la vez
const MAX_PUNTOS = 34;           // puntos de estela por escurrido (memoria)

let lienzo = null;
let ctx = null;
let W = 0, H = 0, dpr = 1;
let anterior = 0;
let rafId = 0;
let activo = false;
let temporizador = 0;
let temporizadorGlue = 0;
let temporizadorAgua = 0;
let escuchando = false;

let drops = [];
const blobs = [];
const escurridos = [];

// Red de seguridad del rendimiento: si el celu empieza a ir lento, se baja sola
// la cantidad de agua y de chorro. Se vuelve a subir cuando vuelve la velocidad.
// `calidad` va de 0 a 1 y multiplica topes, no cambia el dibujo.
let calidad = 1;
let acumCuadros = 0, acumTiempo = 0;

const rnd  = (a, b)=> a + Math.random() * (b - a);
const clamp = (v, a, b)=> v < a ? a : v > b ? b : v;
const easeOut = t=> 1 - Math.pow(1 - t, 3);

function estaMuteado(){
  try{ return localStorage.getItem(CLAVE_MUTE) === "1"; }catch(e){ return false; }
}

// ---------- lienzo ----------
function armarLienzo(){
  lienzo = document.createElement("canvas");
  lienzo.setAttribute("aria-hidden", "true");
  lienzo.style.cssText = "position:fixed; inset:0; pointer-events:none; z-index:" + Z + ";";
  ctx = lienzo.getContext("2d");
  document.body.appendChild(lienzo);
  ajustar();
}
function ajustar(){
  if(!lienzo) return;
  W = window.innerWidth; H = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  lienzo.width = W * dpr; lienzo.height = H * dpr;
  lienzo.style.width = W + "px"; lienzo.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ---------- gotas ----------
function makeDrop(x, delay, tx, ty){
  const y0 = H + rnd(30, 120);
  // velocidad inicial para que la gota llegue a 'ty' con vy ~ 0 (impacto suave)
  const vy0 = -Math.sqrt(Math.max(0, 2 * GRAV * Math.max(60, y0 - ty))) * rnd(0.94, 1.06);
  drops.push({
    x, y: y0, vy: vy0,
    vx: (tx - x) / Math.max(0.12, Math.abs(vy0) / GRAV),
    r: rnd(16, 30),
    w: rnd(0, Math.PI * 2),
    t: -delay,
    tx, ty,
    trail: []
  });
}
// El chorro va solo, de dos en dos y hacia puntos distintos de la pantalla.
function pour(count = 2){
  const ox = rnd(W * 0.08, W * 0.92);
  for(let i = 0; i < count; i++){
    const x0 = ox + rnd(-26, 26);
    const tx = rnd(W * 0.06, W * 0.94);
    const ty = rnd(H * 0.12, H * 0.78);
    makeDrop(x0, i === 0 ? 0 : rnd(0.05, 0.14), tx, ty);
  }
}

// ---------- charco ----------
function makeBlob(x, y, r){
  const n = 14 + Math.floor(rnd(0, 10));
  const verts = [];
  for(let i = 0; i < n; i++){
    const a = (i / n) * Math.PI * 2 + rnd(-0.12, 0.12);
    verts.push({
      a,
      r0: r * 0.18,
      r1: r * rnd(0.85, 1.7),
      d: i * rnd(0.005, 0.02) + rnd(0, 0.06)
    });
  }
  blobs.push({
    x, y,
    R: r * 1.95,
    lx: rnd(-0.45, -0.15),      // direccion de la luz (arriba-izquierda)
    ly: rnd(-0.6, -0.25),
    squash: rnd(0.42, 0.6),      // se aplasta al chocar
    life: 0, grow: 0, fadeIn: 0,
    muerte: 0, muriendo: false,   // se desvanece cuando se sobra de topes
    settle: rnd(0.35, 0.55),
    yOff: 0,
    verts,
    shine: rnd(0.25, 0.5),
    satellites: Array.from({ length: 3 + Math.floor(rnd(0, 6)) }, ()=>({
      a: rnd(0, Math.PI * 2),
      d: rnd(0.9, 2.0),
      r: r * rnd(0.14, 0.42)
    }))
  });
  // Cuando se pasa del tope NO se borra de golpe: el mas viejo se empieza a
  // desvanecer y se va solo. Solo si se junta demasiado (peor caso) se borra de
  // golpe el mas viejo de los que ya se estaban desvaneciendo, para no dejar que
  // la lista crezca sin freno.
  while(blobs.length > MAX_BLOBS){
    const vivo = blobs.find(b=> !b.muriendo);
    if(!vivo) break;
    vivo.muriendo = true;
  }
  if(blobs.length > MAX_BLOBS * 1.5){
    const viejo = blobs.find(b=> b.muriendo);
    if(viejo) blobs.splice(blobs.indexOf(viejo), 1);
  }
}

function blobPath(b, cx = b.x, cy = b.y + b.yOff){
  const p = new Path2D();
  const pts = [];
  for(const v of b.verts){
    const t = clamp((b.grow - v.d) / b.settle, 0, 1);
    const rr = v.r0 + (v.r1 - v.r0) * easeOut(t);
    pts.push({
      x: cx + Math.cos(v.a) * rr,
      y: cy + Math.sin(v.a) * rr * b.squash
    });
  }
  p.moveTo((pts[pts.length - 1].x + pts[0].x) / 2, (pts[pts.length - 1].y + pts[0].y) / 2);
  for(let i = 0; i < pts.length; i++){
    const cur = pts[i], nxt = pts[(i + 1) % pts.length];
    p.quadraticCurveTo(cur.x, cur.y, (cur.x + nxt.x) / 2, (cur.y + nxt.y) / 2);
  }
  p.closePath();
  return p;
}

// Paleta "color hueso": crema calido, no blanco puro
const HUESO = { luz:"#fffdf4", cuerpo:"#f2e9d8", medio:"#e0d4bd", borde:"#b3a184" };

function volumen(c, R, hx, hy){
  const g = c.createRadialGradient(hx, hy, R * 0.04, hx, hy, R * 1.2);
  g.addColorStop(0, HUESO.luz);
  g.addColorStop(0.30, HUESO.cuerpo);
  g.addColorStop(0.70, HUESO.medio);
  g.addColorStop(1, HUESO.borde);
  return g;
}

function drawBlobArt(c, b, cx, cy){
  const R = b.R;
  const path = blobPath(b, cx, cy);
  const hx = cx + b.lx * R;
  const hy = cy + b.ly * R * b.squash * 2.4;

  // sombra de contacto: separa el charco de la pantalla
  c.save();
  c.shadowColor = "rgba(35, 28, 18, .5)";
  c.shadowBlur = R * 0.5;
  c.shadowOffsetX = R * 0.1;
  c.shadowOffsetY = R * 0.22;
  c.fillStyle = "#000";
  c.fill(path);
  c.restore();

  // cuerpo con volumen
  c.fillStyle = volumen(c, R, hx, hy);
  c.fill(path);

  c.save();
  c.clip(path);

  const o = c.createRadialGradient(
    cx - b.lx * R * 0.6, cy - b.ly * R * 0.6, R * 0.3,
    cx - b.lx * R * 0.4, cy - b.ly * R * 0.4, R * 1.4
  );
  o.addColorStop(0, "rgba(86,70,48,0)");
  o.addColorStop(1, "rgba(86,70,48,.34)");
  c.fillStyle = o;
  c.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);

  const rl = c.createLinearGradient(cx, cy + R * 0.2, cx, cy + R);
  rl.addColorStop(0, "rgba(255,250,235,0)");
  rl.addColorStop(1, "rgba(255,250,235,.5)");
  c.fillStyle = rl;
  c.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);

  const sp = c.createRadialGradient(hx, hy, 0, hx, hy, R * 0.55);
  sp.addColorStop(0, "rgba(255,255,255,.9)");
  sp.addColorStop(0.4, "rgba(255,253,246,.32)");
  sp.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = sp;
  c.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);

  c.restore();

  // borde: engrosamiento de la masa
  c.save();
  c.globalAlpha = 0.3;
  c.strokeStyle = "rgba(84, 68, 46, .6)";
  c.lineWidth = Math.max(1, R * 0.06);
  c.stroke(path);
  c.restore();

  // salpicaduras alrededor, con el mismo volumen
  for(const st of b.satellites){
    const t = clamp((b.grow - 0.35) / 0.4, 0, 1);
    const rr = st.r * easeOut(t);
    if(rr < 0.4) continue;
    const sx = cx + Math.cos(st.a) * st.d * st.r * 3;
    const sy = cy + Math.sin(st.a) * st.d * st.r * 1.4;
    c.beginPath();
    c.ellipse(sx, sy, rr, rr * 0.8, 0, 0, Math.PI * 2);
    c.fillStyle = volumen(c, rr * 1.7, sx - rr * 0.55, sy - rr * 0.65);
    c.fill();
    c.beginPath();
    c.ellipse(sx - rr * 0.3, sy - rr * 0.35, rr * 0.32, rr * 0.22, 0, 0, Math.PI * 2);
    c.fillStyle = "rgba(255,255,255,.65)";
    c.fill();
  }
}

// El charco se dibuja una sola vez a un sprite y luego solo se pega.
function cacheSprite(b){
  const size = Math.ceil(b.R * 3.6);
  const cv = document.createElement("canvas");
  cv.width = size * dpr; cv.height = size * dpr;
  const c = cv.getContext("2d");
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.translate(size / 2, size / 2);
  drawBlobArt(c, b, 0, 0);
  return { cv, size };
}

function drawBlob(b){
  ctx.save();
  // fadeIn es la entrada; muerte es la salida de los que se sobran.
  ctx.globalAlpha = b.fadeIn * (1 - b.muerte);
  if(!b.sprite && b.grow >= 1.05) b.sprite = cacheSprite(b);
  if(b.sprite){
    const s = b.sprite.size;
    ctx.drawImage(b.sprite.cv, b.x - s / 2, b.y + b.yOff - s / 2, s, s);
  }else{
    drawBlobArt(ctx, b, b.x, b.y + b.yOff);
  }
  ctx.restore();
}

// ---------- agua que escurre desde arriba ----------
// Un escurrido es una columna de agua que baja desde el borde superior dejando
// una estela. No deja charco al llegar abajo (si no, llenaria la pantalla de
// golpe y se acabaria el tope solo): solo se va desvaneciendo al final.
function nuevoEscurrido(){
  escurridos.push({
    x: rnd(-8, W + 8),
    y: -20,
    ancho: rnd(3, 9),
    vel: rnd(240, 620),
    puntos: []
  });
}
function drawEscurrido(e){
  ctx.save();
  // la estela: puntos que se van afinando hacia arriba
  for(let i = e.puntos.length - 1; i >= 0; i--){
    const p = e.puntos[i];
    const t = (i + 1) / e.puntos.length;      // 1 = cabeza, 0 = cola
    ctx.globalAlpha = 0.55 * t * t;
    ctx.fillStyle = "#dfe7ea";
    ctx.beginPath();
    ctx.ellipse(e.x + Math.sin(i * 0.35) * 2.5, p.y, p.r * (0.35 + 0.65 * t), p.r * 2.1, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // la gota de la cabeza, con su brillo
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "#f2f7f8";
  ctx.beginPath();
  ctx.ellipse(e.x + Math.sin(e.puntos.length * 0.35) * 2.5, e.y, e.ancho * 0.9, e.ancho * 1.9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(e.x - e.ancho * 0.3 + Math.sin(e.puntos.length * 0.35) * 2.5, e.y - e.ancho * 0.5, e.ancho * 0.3, e.ancho * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------- red de seguridad del rendimiento ----------
// Si el telefono no da mas, se baja la calidad sola (menos agua, menos chorro) y
// se vuelve a subir cuando se recupera. Asi el chorro puede correr todo el rato
// sin que la pantalla se vuelva arrastrada.
function medirRendimiento(dt){
  acumCuadros++; acumTiempo += dt;
  if(acumCuadros < 45) return;
  const prom = acumTiempo / acumCuadros;
  let nueva = calidad;
  if(prom > 0.028) nueva = 0.4;        // ~35 fps o menos: bajamos fuerte
  else if(prom > 0.021) nueva = 0.7;   // ~47 fps o menos: bajamos un poco
  else nueva = 1;                      // va bien: calidad completa
  if(nueva !== calidad) calidad = nueva;
  acumCuadros = 0; acumTiempo = 0;
}
const topeEscurridos = ()=> Math.max(4, Math.round(MAX_ESCURRIDOS * calidad));

// ---------- bucle ----------
function cuadro(now){
  const dt = Math.min((now - anterior) / 1000, 0.033);
  anterior = now;
  ctx.clearRect(0, 0, W, H);
  medirRendimiento(dt);

  // ritmo del chorro (esto es lo que lo hace ciclico). Con el celu lento sale
  // una gota menos por tanda.
  temporizadorGlue += dt;
  if(temporizadorGlue > rnd(0.28, 0.6)){ temporizadorGlue = 0; pour(calidad >= 1 ? 2 : 1); }

  // ritmo del agua que escurre desde arriba
  temporizadorAgua += dt;
  if(temporizadorAgua > rnd(0.4, 1.2)){
    temporizadorAgua = 0;
    if(escurridos.length < topeEscurridos()) nuevoEscurrido();
  }
  const maxPuntos = Math.round(MAX_PUNTOS * calidad);
  for(let i = escurridos.length - 1; i >= 0; i--){
    const e = escurridos[i];
    e.y += e.vel * dt;
    e.puntos.unshift({ y: e.y, r: e.ancho });
    if(e.puntos.length > maxPuntos) e.puntos.pop();
    // se va al llegar abajo (con un desvanecido corto, no de golpe)
    if(e.y > H + 30) escurridos.splice(i, 1);
  }

  for(let i = drops.length - 1; i >= 0; i--){
    const d = drops[i];
    d.t += dt;
    if(d.t < 0) continue;
    d.vy += GRAV * dt;
    d.y += d.vy * dt;
    d.x += d.vx * dt;
    d.w += dt * 6;

    if(Math.random() < 0.85){
      d.trail.push({ x: d.x + rnd(-5, 5), y: d.y + rnd(-6, 18), r: rnd(3, 8) });
      if(d.trail.length > 48) d.trail.shift();
    }

    ctx.save();
    ctx.fillStyle = "#efe7d6";
    for(const p of d.trail){
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r, p.r * 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const sp = Math.hypot(d.vx, d.vy) || 1;
    const stretch = clamp(1 + sp / 900, 1, 3.4);
    ctx.translate(d.x, d.y);
    ctx.rotate(Math.atan2(d.vy, d.vx) - Math.PI / 2);
    ctx.beginPath();
    ctx.ellipse(0, 0, d.r / Math.sqrt(stretch), d.r * stretch, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if(d.y <= d.ty + d.r * 0.3){
      makeBlob(clamp(d.x, 10, W - 10), Math.min(d.ty + d.r * 0.3, H - 8), d.r);
      drops.splice(i, 1);
    }
  }

  for(const b of blobs){
    b.life += dt;
    b.grow = Math.min(b.grow + dt * 1.6, 2);
    b.fadeIn = Math.min(1, b.fadeIn + dt * 5);
    b.yOff += (b.settle * 40 - b.yOff) * Math.min(1, dt * 2.2);
    if(b.muriendo) b.muerte = Math.min(1, b.muerte + dt / DESVANECER);
  }
  // los que ya se desvanecieron por completo, fuera de la lista
  for(let i = blobs.length - 1; i >= 0; i--){
    if(blobs[i].muerte >= 1) blobs.splice(i, 1);
  }
  for(const b of blobs) drawBlob(b);

  // el agua va ENCIMA de los charcos ya pegados
  for(const e of escurridos) drawEscurrido(e);

  rafId = requestAnimationFrame(cuadro);
}

// ---------- prender y apagar ----------
export function glueEstaEncendido(){ return activo; }

export function encenderGlue(){
  if(activo || estaMuteado()) return;
  try{
    armarLienzo();
    drops.length = 0;
    blobs.length = 0;
    escurridos.length = 0;
    temporizadorGlue = 0;
    temporizadorAgua = 0;
    calidad = 1;
    acumCuadros = 0; acumTiempo = 0;
    anterior = performance.now();
    activo = true;
    window.addEventListener("resize", ajustar);
    rafId = requestAnimationFrame(cuadro);
  }catch(e){
    // Si algo falla, la pagina sigue igual: nada de dejar el lienzo a medias.
    apagarGlue();
  }
}

export function apagarGlue(){
  try{
    if(rafId) cancelAnimationFrame(rafId);
  }catch(e){}
  rafId = 0;
  activo = false;
  drops.length = 0;
  blobs.length = 0;
  escurridos.length = 0;
  try{ window.removeEventListener("resize", ajustar); }catch(e){}
  if(lienzo && lienzo.parentNode) lienzo.parentNode.removeChild(lienzo);
  lienzo = null;
  ctx = null;
}

// ---------- la espera quieto ----------
function hayMovimiento(){
  // Si hay chorro, el primer toque lo apaga. Si no hay, solo se reinicia la cuenta.
  if(activo) apagarGlue();
  if(!escuchando) return;
  clearTimeout(temporizador);
  temporizador = setTimeout(()=>{
    if(!estaMuteado()) encenderGlue();
  }, Math.max(1, SEGUNDOS) * 1000);
}

let SEGUNDOS = 10;

/**
 * Prende el chorro si la persona lleva `segundos` sin interactuar en la pagina.
 * Se vuelve a armar solo despues de cada toque, asi que puede volver a pasar.
 */
export function glueSiEstaQuieto(segundos = 10){
  SEGUNDOS = segundos;
  if(escuchando){ hayMovimiento(); return; }
  escuchando = true;
  // Cualquier interaccion cuenta. El lienzo lleva pointer-events:none, asi que
  // el toque le llega a la pagina normal y aqui solo se usa para apagar.
  ["pointerdown", "touchstart", "keydown", "wheel", "scroll"].forEach(ev=>{
    document.addEventListener(ev, hayMovimiento, { passive: true });
  });
  // Si se cambia de pestana se apaga sola: no gasta bateria.
  document.addEventListener("visibilitychange", ()=>{
    if(document.hidden) apagarGlue();
  });
  hayMovimiento();
}

/** Deja de vigilar (por ejemplo al salir de la pantalla donde se usa). */
export function glueOlvidado(){
  if(!escuchando) return;
  escuchando = false;
  clearTimeout(temporizador);
  ["pointerdown", "touchstart", "keydown", "wheel", "scroll"].forEach(ev=>{
    document.removeEventListener(ev, hayMovimiento);
  });
  apagarGlue();
}
