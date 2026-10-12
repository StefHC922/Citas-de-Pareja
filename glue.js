// ============================================================================
//  Chorro de pegamento — modulo reutilizable
// ----------------------------------------------------------------------------
//  Un chorro de pegamento cae encima de la pantalla y va llenandola de charcos
//  SOLO. No es un juego ni un aviso: es para cuando alguien se queda mirando la
//  pantalla sin hacer nada.
//
//      import { glueSiEstaQuieto, glueOlvidado } from "./glue.js";
//      glueSiEstaQuieto(15);       // a los 15 segundos quieto, cae el chorro
//
//  Que hace, exacto:
//   - Cuenta los segundos SIN INTERACTUAR. Cualquier toque, scroll o tecla lo
//     reinicia, asi que si la persona esta usando la pantalla, no pasa nada.
//   - Cuando se cumplen los segundos, prende el chorro.
//   - El chorro se mantiene SOLO en bucle: gotas que caen y charcos que se van
//     pegando a la pantalla.
//   - El PRIMER toque lo apaga al instante y borra el lienzo: no queda rastro.
//
//  Notas de seguridad (esto es lo importante):
//   - El lienzo va con `pointer-events:none`: NUNCA tapa un boton. Se puede
//     seguir usando la pagina con normalidad mientras corre.
//   - Al apagar, se quitan el lienzo, el bucle y los escuchas. Si algo falla,
//     la pagina sigue igual: por eso va aparte y no se mete en el juego.
//   - **Todo tiene tope**: 70 charcos (los viejos se desvanecen, no se borran de
//     golpe). Ademas hay un REDUCTOR AUTOMATICO: si el telefono baja de
//     velocidad, se sueltan menos gotas por tanda y se vuelve a subir cuando se
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

let lienzo = null;
let ctx = null;
let W = 0, H = 0, dpr = 1;
let anterior = 0;
let rafId = 0;
let activo = false;
let temporizador = 0;
let temporizadorGlue = 0;
let escuchando = false;
let drops = [];
const blobs = [];

// Red de seguridad del rendimiento: si el celu empieza a ir lento, se sueltan
// menos gotas por tanda. Se vuelve a subir cuando vuelve la velocidad.
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
    r: rnd(12, 22),
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

// Si el telefono no da mas, se suelta menos chorro (menos gotas por tanda) y se
// recupera solo cuando vuelve la velocidad. Nunca desaparece el efecto.
function medirRendimiento(dt){
  acumCuadros++; acumTiempo += dt;
  if(acumCuadros < 60) return;
  const prom = acumTiempo / acumCuadros;   // segundos por cuadro
  if(prom > 1 / 32) calidad = 0.4;         // ~32 fps o menos: bajamos fuerte
  else if(prom > 1 / 40) calidad = 0.7;    // ~40 fps o menos: bajamos tantito
  else calidad = 1;                        // va bien: calidad completa
  acumCuadros = 0; acumTiempo = 0;
}

// ---------- bucle ----------
function bucle(now){
  rafId = requestAnimationFrame(bucle);
  const dt = Math.min((now - anterior) / 1000, 0.033);
  anterior = now;

  ctx.clearRect(0, 0, W, H);

  // ritmo del chorro: una gota menos por tanda si el celular va lento.
  // La mitad de seguido que antes (oct-2026): sale un chorro cada .56-1.2 s.
  temporizadorGlue += dt;
  if(temporizadorGlue > rnd(0.56, 1.2)){
    temporizadorGlue = 0;
    pour(calidad >= 1 ? 2 : 1);
  }

  // gotas
  for(let i = drops.length - 1; i >= 0; i--){
    const d = drops[i];
    d.t += dt;
    if(d.t < 0) continue;
    d.vy += GRAV * dt;
    d.y += d.vy * dt;
    d.x += d.vx * dt;
    d.w += dt * 6;

    // rastro: chorro continuo de gotas que deja la gota principal
    if(Math.random() < 0.85){
      d.trail.push({ x: d.x + rnd(-5, 5), y: d.y + rnd(-6, 18), r: rnd(2.5, 6) });
      if(d.trail.length > 48) d.trail.shift();
    }

    ctx.save();
    ctx.fillStyle = "#efe7d6";
    for(const p of d.trail){
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r, p.r * 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // gota principal: se estira en la direccion del movimiento
    const sp = Math.hypot(d.vx, d.vy) || 1;
    const stretch = clamp(1 + sp / 900, 1, 3.4);
    ctx.translate(d.x, d.y);
    ctx.rotate(Math.atan2(d.vy, d.vx) - Math.PI / 2);
    ctx.beginPath();
    ctx.ellipse(0, 0, d.r / Math.sqrt(stretch), d.r * stretch, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // impacto con la pantalla
    if(d.y <= d.ty + d.r * 0.3){
      makeBlob(clamp(d.x, 10, W - 10), Math.min(d.ty + d.r * 0.3, H - 8), d.r);
      drops.splice(i, 1);
    }
  }

  // charcos: crecen y se asientan; los que se sobran se desvanecen y se van.
  for(const b of blobs){
    b.life += dt;
    b.grow = Math.min(b.grow + dt * 1.6, 2);
    b.fadeIn = Math.min(1, b.fadeIn + dt * 5);
    b.yOff += (b.settle * 40 - b.yOff) * Math.min(1, dt * 2.2);
    if(b.muriendo) b.muerte = Math.min(1, b.muerte + dt / DESVANECER);
  }
  for(let i = blobs.length - 1; i >= 0; i--){
    if(blobs[i].muerte >= 1) blobs.splice(i, 1);
  }
  for(const b of blobs) drawBlob(b);   // orden de llegada: el ultimo queda encima

  medirRendimiento(dt);
}

// ---------- prender y apagar ----------
function encenderGlue(){
  if(activo || estaMuteado()) return;
  try{
    activo = true;
    armarLienzo();
    drops.length = 0;
    blobs.length = 0;
    temporizadorGlue = 0;
    calidad = 1;
    acumCuadros = 0; acumTiempo = 0;
    anterior = performance.now();
    window.addEventListener("resize", ajustar);
    rafId = requestAnimationFrame(bucle);
  }catch(e){
    apagarGlue();
  }
}

export function apagarGlue(){
  try{ if(rafId) cancelAnimationFrame(rafId); }catch(e){}
  rafId = 0;
  activo = false;
  drops.length = 0;
  blobs.length = 0;
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

let SEGUNDOS = 30;

/**
 * Prende el chorro si la persona lleva `segundos` sin interactuar en la pagina.
 * Se vuelve a armar solo despues de cada toque, asi que puede volver a pasar.
 */
export function glueSiEstaQuieto(segundos = 30){
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
