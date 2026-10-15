// ============================================================================
//  Favores Express — botón flotante y ventana de pedir  (oct-2026)
// ----------------------------------------------------------------------------
//  Un favor se pide SIN entrar a buscarlo: hay un botón flotante que está en
//  todas las pantallas. Lo abre una ventana: escribes QUÉ favor quieres y se
//  manda con el precio del 🛒.
//
//      import { montarFavor } from "./favor.js";        // en la raíz
//      import { montarFavor } from "../favor.js";       // en una carpeta
//      montarFavor(dbActual());
//
//  FASE 1 (esto es lo que hay ahora): el botón, la ventana de PEDIR, y que el
//  aviso llegue. Aceptar / contra-ofertar / pagar todavía NO: es la fase 2.
//
//  El modelo (decisiones de Fredy, oct-2026 — ver General/Plan-Favores-Express.md):
//   - El precio lo pone el 🛒 de QUIEN PIDE, y no se puede cambiar al pedir.
//   - Quien va a CUMPLIR sí puede ajustarlo: para arriba, o hasta 0 si lo regala.
//     (Eso es la fase 2.)
//   - El saldo nunca queda negativo: tope cero. Y el botón SIEMPRE aparece, solo
//     que avisa que no alcanza. OJO: es al revés que en el Centro de
//     Adquisiciones, donde el botón "Comprar" ni aparece sin saldo.
// ============================================================================

import {
  doc, getDoc, setDoc, collection, addDoc, serverTimestamp,
  onSnapshot, runTransaction, increment, query, where, getDocs, Timestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { aviso } from "./confirmar.js";
import { avisarTelegram } from "./telegram.js";
import { soyInvitado, CLAVE_LOCAL, dbActual } from "./invitado.js";
import { baseUrl } from "./config.js";
import { vigilarFavores } from "./pestana.js";

// Si no hay numero guardado, este. OJO: aqui el 0 SI es valido (ella puede
// regalar el favor), asi que no se comprueba "> 0" como en el 🛒 de los deseos.
const FAVOR_POR_DEFECTO = 15;

// Minutos para cumplir, y qué porcentaje del precio es el castigo si no se
// cumple. Los dos salen del 🛒 de QUIEN PIDE (son su exigencia) y se congelan
// al crear el favor: cambiar el 🛒 despues NO cambia lo que ya esta pactado.
//
// El castigo SIEMPRE se cobra a mano: al vencerse, quien pidió decide si lo cobra
// o lo deja pasar. Nunca se descuenta solo (decisión de Fredy, oct-2026: que el
// castigo no espante de aceptar favores).
const PCT_CASTIGO_POR_DEFECTO = 50;
const MINUTOS_POR_DEFECTO = 10;

// Cuánto tiempo hay para cumplirlo una vez que se acepta. La FASE 3 lo saca de
// aquí y lo hace configurable en el 🛒 (decisión de Fredy, oct-2026). Por ahora
// es fijo: cambiarlo es cambiar este número.

// Los estados en los que todavía se puede responder algo. En cuanto el favor
// pasa de aquí, la ventana se deja de abrir.
const ESTADOS_VIVOS = ["pedido", "contra", "esperando"];

// Un aviso puede llegar mientras haya un cartelito de `confirmar.js` en
// pantalla. Encimarse no se ve bien, asi que se espera a que se cierre.
function hayCajaAbierta(){
  try{ return !!document.querySelector(".cfCapa"); }catch(e){ return false; }
}

let estiloPuesto = false;
let yaMontado = false;
let esperandoIdentidad = false;
let montado = null;
// La base guardada a nivel de MODULO, no como parametro.
//
// OJO: esto no es cosmetico. Las ventanas (`mostrarRespuesta`, `mostrarPropio`,
// `abrirVentanaFavor`) son funciones aparte que necesitan la base para escribir.
// Antes usaban un `db` "suelto" que solo existia como parametro de
// `montarFavor()`: al apretar Aceptar / Rechazar / Cancelar salia un
// ReferenceError y **no pasaba nada, en silencio** (lo reporto Fredy probando,
// oct-2026). "Ahora no" si funcionaba porque no usa la base.
let dbBase = null;

// Los colores se piden con `--card` y caen a `--tarjeta`, porque cada pantalla
// les puso un nombre distinto y `Diablitos/` usa la otra serie. Mismo truco que
// `confirmar.js` (oct-2026).
function ponerEstilo(){
  if(estiloPuesto || typeof document === "undefined") return;
  estiloPuesto = true;
  const e = document.createElement("style");
  e.textContent = `
    .fvFlotante{ position:fixed; right:18px;
      bottom:calc(18px + env(safe-area-inset-bottom));
      z-index:60; display:none;
      width:54px; height:54px; border-radius:50%;
      border:1px solid var(--card-border, var(--borde));
      background:var(--card, var(--tarjeta));
      font-size:1.5rem; line-height:1; cursor:pointer; padding:0;
      box-shadow:0 4px 14px rgba(0,0,0,.3); }
    .fvFlotante:active{ transform:scale(.97); }
    .fvCapa{ position:fixed; inset:0; background:rgba(0,0,0,.62); display:none;
      align-items:center; justify-content:center; padding:20px; z-index:100; }
    .fvCapa.ver{ display:flex; }
    .fvCaja{ width:100%; max-width:360px; background:var(--card, var(--tarjeta));
      border:1px solid var(--card-border, var(--borde));
      border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:10px; }
    .fvNombre{ font-family:'Chakra Petch',sans-serif; font-weight:700;
      font-size:1.15rem; color:var(--coral); }
    .fvPrecio{ font-size:.8rem; color:var(--fg-muted, var(--apagado)); }
    .fvTexto{ font-size:.88rem; color:var(--fg, var(--texto)); white-space:pre-wrap; }
    .fvAlta{ display:flex; flex-direction:column; gap:8px; width:100%; }
    .fvAlta textarea{ width:100%; min-height:74px; border-radius:12px;
      border:1px solid var(--card-border, var(--borde)); background:var(--bg);
      color:var(--fg, var(--texto)); padding:12px; font-size:.9rem;
      font-family:'Inter',sans-serif; resize:vertical; }
    .fvMsg{ font-size:.8rem; color:var(--rojo); min-height:18px; }
  `;
  document.head.appendChild(e);
}

function yoLocal(){
  try{ return JSON.parse(localStorage.getItem(CLAVE_LOCAL) || "null"); }catch(e){ return null; }
}

/**
 * Monta el botón flotante y su ventana. Se puede llamar en TODAS las pantallas.
 *
 *   try{ montarFavor(); }catch(e){}
 *
 * @param db        opcional. Si no se pasa, se saca sola con `dbActual()` de
 *                  invitado.js, que es lo mismo que usan el resto de la app.
 * @param intentos  interno: reintentos mientras no haya identidad.
 *
 * **No hay que buscar dónde poner la llamada.** En varias pantallas la
 * identidad se lee de Firestore y llega DESPUÉS de que la página ya arrancó, así
 * que al principio todavía no hay quién es. En vez de colgar el botón de un
 * hook distinto en cada pantalla, se espera un poco y se reintenta.
 */
export function montarFavor(db, intentos){
  if(yaMontado || typeof document === "undefined") return;
  const base = db || dbActual();
  // Invitado: nunca. La sala de espera y todo lo que se abre como invitado
  // quedan fuera, sin tener que hacer una lista de pantallas.
  if(soyInvitado()) return;
  // Ni la base ni la identidad estan listas todavia en varias pantallas (se
  // arma al arrancar). Se espera un poco y se reintenta.
  if(!base || !yoLocal()){
    const veces = (intentos === undefined) ? 25 : intentos;
    if(veces <= 0 || esperandoIdentidad) return;
    esperandoIdentidad = true;
    setTimeout(()=>{ esperandoIdentidad = false; montarFavor(base, veces - 1); }, 500);
    return;
  }
  esperandoIdentidad = false;
  db = base;
  dbBase = base;
  // La campana y el aviso de los favores se prenden en TODAS las pantallas donde
  // se monta el boton, no solo en el menu. Antes solo el menu los prendia: en el
  // resto de pantallas no salia aviso y la ventana se abria SOLA, asi que cada
  // dispositivo se comportaba distinto y los mensajes parecian atrasados (lo
  // reporto Fredy probando, oct-2026). Con esto el aviso es la puerta en todas.
  try{
    usarAvisoFavores();
    vigilarFavores(base, { alTerminar: abrirFavorPendiente });
  }catch(e){ console.error("Favor Express: no se pudo vigilar los avisos", e); }
  ponerEstilo();

  const btn = document.createElement("button");
  btn.className = "fvFlotante";
  btn.type = "button";
  btn.textContent = "\u{1F6CE}";
  btn.setAttribute("aria-label", "Pedir un Favor Express");
  btn.title = "Favor Express";

  const capa = document.createElement("div");
  capa.className = "fvCapa";
  capa.innerHTML = '<div class="fvCaja">'
    + '<div class="fvNombre">Favor Express</div>'
    + '<div class="fvPrecio" id="fvPrecio"></div>'
    + '<div class="fvAlta">'
    + '<textarea id="fvTexto" maxlength="240" placeholder="&#191;Qu&#233; favor le pides?"></textarea>'
    + '<div class="fvMsg" id="fvMsg"></div>'
    + '</div>'
    + '<button class="btnPri" id="fvMandar">Mandar</button>'
    + '<button class="btnSec" id="fvCerrar">Cancelar</button>'
    + '</div>';
  btn.setAttribute("data-fv-bd", "1");
  capa.setAttribute("data-fv-bd", "1");

  const $ = (id)=> capa.querySelector("#" + id);
  const precioEl = $("fvPrecio"), textoEl = $("fvTexto"), msgEl = $("fvMsg");
  const btnMandar = $("fvMandar");

  let precio = FAVOR_POR_DEFECTO;
  let pctCastigo = PCT_CASTIGO_POR_DEFECTO;
  let minutos = MINUTOS_POR_DEFECTO;
  let pareja = null;

  function cerrar(){ capa.classList.remove("ver"); }

  capa.addEventListener("click", (e)=>{ if(e.target === capa) cerrar(); });
  $("fvCerrar").onclick = cerrar;

  function pintarPrecio(){
    precioEl.textContent = "Precio: " + precio + " pts. Lo paga quien pide; "
      + "quien lo cumpla puede cobrar m\u00e1s, o dejarlo en 0.";
    btnMandar.textContent = "Mandar \u00b7 " + precio + " pts";
  }

  btn.onclick = async ()=>{
    msgEl.textContent = "";
    // OJO: el precio se relee CADA vez que se abre el pedido, no una sola vez al
    // crear el boton. Antes se leia solo al montar y su error estaba tragado en un
    // `catch` mudo, asi que si la base todavia no estaba lista el precio se
    // quedaba clavado en 15 para siempre: cambiar ⚙️ 🛒 a 5 no Change nada y el
    // boton seguia diciendo "Mandar · 15 pts" (lo reporto Fredy probando,
    // oct-2026).
    try{ await preparar(); }catch(e){ console.error("Favor Express: no se pudo leer el precio", e); }
    pintarPrecio();
    textoEl.value = "";
    capa.classList.add("ver");
    try{ textoEl.focus(); }catch(e){}
  };

  async function preparar(){
    // El precio y la pareja se leen FRESCOS de `config/ajustes`, no de la copia
    // local de la identidad: asi lo que cambies en ⚙️ → 🛒 se ve sin recargar.
    // Mismo criterio que el Centro de Adquisiciones.
    try{
      const snap = await getDoc(doc(db, "config", "ajustes"));
      const lista = (snap.exists() && Array.isArray(snap.data().usuarios)) ? snap.data().usuarios : [];
      const yo = yoLocal();
      const mio = lista.find(u=> u && u.id === yo.id);
      if(mio){
        const n = parseInt(mio.precioFavor, 10);
        precio = (isFinite(n) && n >= 0) ? n : FAVOR_POR_DEFECTO;
        const pc = parseInt(mio.pctCastigo, 10);
        pctCastigo = isFinite(pc) ? pc : PCT_CASTIGO_POR_DEFECTO;
        const mn = parseInt(mio.minutosFavor, 10);
        minutos = (isFinite(mn) && mn > 0) ? mn : MINUTOS_POR_DEFECTO;
      }else{
        // Sin registro no se aventa el 15 en silencio: se dice, porque asi se
        // perdio horas de prueba sin entender por que (oct-2026).
        console.warn("Favor Express: tu usuario no esta en config/ajustes; se usa el precio por defecto (" + FAVOR_POR_DEFECTO + "). Revisa ⚙️ → 🛒.");
      }
      pareja = lista.find(u=> u && u.id !== yo.id && !u.invitado)
            || lista.find(u=> u && u.id !== yo.id);
    }catch(e){
      // Este catch NO puede quedar vacio otra vez: aqui se escondia el fallo
      // que dejaba el precio siempre en 15 (oct-2026).
      console.error("Favor Express: fallo la lectura de config/ajustes", e);
    }
    pintarPrecio();
  }
  preparar();

  btnMandar.onclick = async ()=>{
    const texto = textoEl.value.trim();
    if(!texto){ msgEl.textContent = "Escribe qu\u00e9 favor le pides."; return; }
    if(!pareja){ msgEl.textContent = "No encontr\u00e9 a tu pareja en la app."; return; }
    const yo = yoLocal();
    if(!yo) return;

    // El saldo nunca queda negativo, pero el boton SIEMPRE sale: si no alcanza
    // se le avisa. (Al reves que en el Centro, a proposito: decision de Fredy.)
    try{
      const s = await getDoc(doc(db, "puntosUsuarios", yo.id));
      const bal = (s.exists() ? (s.data().balance || 0) : 0);
      if(precio > 0 && bal < precio){
        msgEl.textContent = "No te alcanzan " + precio + " pts (tienes " + bal + ").";
        return;
      }
    }catch(e){
      // Si no se pudo leer el saldo NO se bloquea el pedido (preferible dejar
      // pasar a bloquear sin querer), pero se avisa: un fallo silenciado aqui
      // es como se escondieron los otros (oct-2026).
      console.error("Favor Express: no se pudo leer el saldo", e);
    }

    btnMandar.disabled = true;
    try{
      await addDoc(collection(db, "favoresExpress"), {
        de: { id: yo.id, nombre: yo.nombre },
        para: { id: pareja.id, nombre: pareja.nombre },
        texto: texto,
        precioBase: precio,
        precio: precio,
        // El % de castigo queda congelado aqui. Si despues ella contradice otro
        // precio, el castigo se recalcula solo (es un % del precio final).
        tasaCastigo: pctCastigo,
        // Los minutos que le doy a mi pareja para cumplirlo. Tambien se congelan.
        minutos: minutos,
        estado: "pedido",
        // El reloj NO arranca aqui: arranca cuando ella ACEPTA (decision de
        // Fredy, oct-2026). Si arrancara al pedir, se venceria por estar
        // ocupada, que es justo lo que pasa.
        venceEn: null,
        creadoEn: serverTimestamp()
      });
      // El aviso para la campana va en un documento POR QUIEN MANDA, no en uno
      // solo: si los dos piden a la vez, con uno solo el segundo pisa al
      // primero y quien lo mando nunca se entera (le paso con `invitosRetos`).
      try{
        await setDoc(doc(db, "invitosFavor", yo.id), {
          para: pareja.id,
          de: yo.id,
          deNombre: yo.nombre,
          texto: texto,
          precio: precio,
creadoEn: serverTimestamp(),
        visto: false
      }, { merge: true });
    }catch(e){ console.error("Favor Express: no se pudo dejar el aviso", e); }
      await avisarTelegram(
        "\u{1F3F8} " + yo.nombre + " te pidi\u00f3 un favor: " + texto
        + " \u00b7 " + precio + " pts", baseUrl() + "Retos/"
      );
      cerrar();
      aviso("Mandado. " + pareja.nombre + " lo va a ver.");
    }catch(e){
      msgEl.textContent = "No se pudo mandar. Revisa tu conexi\u00f3n.";
    }finally{
      btnMandar.disabled = false;
    }
  };

  document.body.appendChild(btn);
  document.body.appendChild(capa);
  btn.style.display = "block";
  montado = { btn, capa };
  // La otra mitad: escuchar lo que me tienen que responder y abrir su ventana.
  escucharRespuestas(db, Yo());
}

/** Por si alguna pantalla necesita apagarlo (jugando, por ejemplo). */
export function ocultarBotonFavor(){
  if(montado && montado.btn) montado.btn.style.display = "none";
}
export function mostrarBotonFavor(){
  if(montado && montado.btn) montado.btn.style.display = "block";
}

// Registro de TODOS los favores que llegan por el snapshot, en cualquier estado.
//
// Antes `abrirVentanaFavor()` solo buscaba en las colas, que son las de los
// favores "pendientes". Por eso al tocar un favor en curso en el Centro salia
// "Ese favor todavia no se ha cargado" (lo reporto Fredy probando, oct-2026):
// el favor estaba ahi, pero no en ninguna cola.
let todosLosFavores = {};

// Cuando esta pantalla SI tiene el aviso de la campana para los favores, las
// ventanas dejan de abrirse solas: el aviso es la puerta (ver `abrirFavorPendiente`).
// Lo prende la pantalla que llama a `vigilarFavores(...)`.
let avisoFavoresActivo = false;
export function usarAvisoFavores(){ avisoFavoresActivo = true; }

// Lo que se abre SOLO, sin que nadie toque nada: lo que acaba de cambiar hace
// poco. Si no, cada vez que se navega a otra pantalla se volveria a abrir la
// misma ventana y el aviso se repetiria eternamente (oct-2026).
const RECIENTE_MS = 10 * 60 * 1000;
function esReciente(f){
  if(!f || !f.d) return false;
  const t = (f.d.actualizadoEn) ? f.d.actualizadoEn : f.d.creadoEn;
  if(!t) return false;
  const ms = (typeof t.toDate === "function") ? t.toDate().getTime() : Number(t);
  return (ms > 0) && ((Date.now() - ms) < RECIENTE_MS);
}

// Para que otra pantalla (el Centro) pueda abrir la ventana de un favor concreto
// al tocar su renglon. Ahi NO se repiten las acciones: solo se llama a la ventana
// que ya existe.
export function abrirVentanaFavor(id){
  const yo = Yo();
  if(!yo || !id) return false;
  cola = []; colaPropia = [];
  // Primero lo que le toca responder; si no, cualquier otro estado.
  const f = todosLosFavores[id];
  if(f){
    if(leTocaResponder(f.d, yo.id)) mostrarRespuesta(f);
    else mostrarPropio(f);
    return true;
  }
  // No esta en la cola (todavia no ha llegado el snapshot): se avisa y ya.
  aviso("Ese favor todavía no se ha cargado.");
  return false;
}

// ============================================================================
//  FASE 2 — la ventana de RESPONDER: aceptar / cobrar otro precio / rechazar
// ----------------------------------------------------------------------------
//  Se escucha `favoresExpress` entera y se filtra en el cliente: la coleccion es
//  de dos personas, no vale la pena una consulta con `where`.
// ============================================================================

const Yo = ()=> yoLocal();

let cola = [];        // los favores que me tocan responder
let mostrando = false;
// Que ventana esta abierta ahorita, para poder cerrarla sola si su favor deja de
// estar en un estado que me toque (la otra persona contesto, se cancelo, etc).
let mostrandoAbierta = null;
let cerrarRespondida = ()=>{};
let hayAlgoQueHacer = false;

// Favores que esta persona YA DIJO "ahora no" en ESTE estado.
//
// OJO: se guarda el estado junto al id, a proposito. Antes solo se guardaba el
// id y eso hacia que el favor no volviera a salir NUNCA mas en esa sesion: ella
// countero, el estado cambio a "contra" y el mensaje no llego hasta que se
// recargo la pantalla (lo reporto Fredy probando, oct-2026). "Ahora no" quiere
// decir "no me lo muestres EN ESTE estado"; si el estado avanza, se vuelve a
// avisar, porque es una respuesta nueva a lo que tu yo respondiste.
const descartados = {};
function fueDescartado(id, estado){
  const previo = descartados[id];
  return !!previo && previo.estado === estado;
}
function descartar(id, estado){
  try{ descartados[id] = { estado: estado, t: Date.now() }; }catch(e){}
}
function olvidarDescartados(){
  const viejo = Date.now() - (10 * 60000);
  for(const k in descartados){ if(descartados[k].t < viejo) delete descartados[k]; }
}

function cuandoMil(f){
  try{
    const t = f && f.creadoEn;
    if(t && t.toDate) return t.toDate().getTime();
    if(typeof t === "number") return t;
  }catch(e){}
  return 0;
}

function siguiente(){
  if(mostrando || !cola.length) return;
  // Un aviso puede llegar mientras haya un cartelito de `confirmar.js` en
  // pantalla. Encimarse no se ve bien, asi que se espera a que se cierre.
  if(hayCajaAbierta()){ setTimeout(siguiente, 400); return; }
  olvidarDescartados();
  cola.sort((a,b)=> cuandoMil(b) - cuandoMil(a));
  // Se brincan solo los que esta persona ya cerro en el MISMO estado.
  while(cola.length && fueDescartado(cola[0].id, cola[0].d.estado)) cola.shift();
  if(!cola.length) return;
  const f = cola[0];
  cola = cola.slice(1);
  mostrarRespuesta(f);
}

// QUIÉN le toca responder, que NO es siempre el mismo. Ojo, aquí estuvo un bug
// (oct-2026): la ventana se abría solo a quien va dirigido el favor, o sea solo
// a quien cumple. Pero cuando hay contra-oferta el que tiene que contestar es el
// que PIDIO el favor, y ese paso se quedaba colgado sin que nadie lo viera.
//
//   pedido    -> quien cumple (para)
//   contra    -> quien PIDIO (de)
//   esperando -> quien cumple (para)
function leTocaResponder(d, miId){
  if(!d) return false;
  if(d.estado === "contra") return !!(d.de && d.de.id === miId);
  return !!(d.para && d.para.id === miId);
}

function escucharRespuestas(db, yo){
  if(!yo) return;
  try{
    onSnapshot(collection(db, "favoresExpress"), (snap)=>{
      // Primero se liquida lo que ya se vencio: nadie va a estar mirando la app
      // en el minuto exacto, y si los dos la tuvieron cerrada el paso del tiempo
      // tiene que recuperarse al abrir.
      liquidarVencidos(db, snap);
      const accionablesPropios = encolarPropios(snap, yo);
      let hayResponder = 0;
      const nuevos = [];
      snap.forEach(ds=>{
        const d = ds.data();
        if(!d) return;
        if(ESTADOS_VIVOS.indexOf(d.estado) < 0) return;
        if(!leTocaResponder(d, yo.id)) return;
        hayResponder++;
        // Solo lo RECIENTE entra a la cola de auto-abrir; lo viejo se ve al
        // tocarlo en Centro -> Favores. Pero para el "hay algo que hacer" SI
        // cuenta lo viejo: si no, se apagaria la campana teniendo algo pendiente.
        if(esReciente({ id: ds.id, d })) nuevos.push({ id: ds.id, d });
      });
      cola = nuevos;
      // Si el favor que esta mostrando ya no esta en un estado que me toque
      // (la otra persona contesto, o se cancelo/cobro), se cierra la ventana:
      // si no se quedaba congelada mostrando "Esperando..." para siempre, que
      // fue lo que paso en la prueba del 24-oct (reportado por Fredy).
      if(mostrandoAbierta && !nuevos.some(x=> x.id === mostrandoAbierta.id)){
        try{ cerrarRespondida(); }catch(e){}
      }
      // Barrido del aviso de la campana: si ya no hay nada que hacer, se apaga.
      hayAlgoQueHacer = (hayResponder > 0) || (accionablesPropios > 0);
      try{ barrerAvisoHuerfano(db, yo, hayAlgoQueHacer); }catch(e){}
      // Las ventanas se abren solas SOLO en las pantallas que NO tienen el aviso
      // de la campana para favores (es el respaldo de siempre). Donde la campana
      // SI avisa, el aviso es la puerta y la ventana sale al dar "Entendido": si
      // no, los dos cuadros salian encimados y el usuario caia directo en las
      // opciones sin leer nada (lo reporto Fredy probando, oct-2026).
      if(!avisoFavoresActivo){
        siguiente();
        siguientePropio();
      }
      }, (err)=>{ console.error("Favor Express: fallo el listener", err); });
    // OJO: este catch NO se queda vacio. Un `catch(e){}` aqui se comio el error
    // de `onSnapshot` sin importarlo y la ventana NUNCA salio, sin ningun aviso
    // en pantalla (oct-2026). Si algo falla, que se vea en la consola.
    }catch(e){ console.error("Favor Express: no se pudo escuchar", e); }
}

let capaRespuesta = null;
function laCapaRespuesta(){
  if(capaRespuesta) return capaRespuesta;
  const c = document.createElement("div");
  c.className = "fvCapa";
  c.innerHTML = '<div class="fvCaja">'
    + '<div class="fvNombre" id="vrTitulo"></div>'
    + '<div class="fvTexto" id="vrTexto"></div>'
    + '<div class="fvPrecio" id="vrPrecio"></div>'
    + '<div class="fvMsg" id="vrMsg"></div>'
    + '<div id="vrOtro" style="display:none;">'
    + '<input type="number" id="vrPrecioFinal" min="0" step="1" '
    + 'style="width:100%;border-radius:12px;border:1px solid var(--card-border, var(--borde));'
    + 'background:var(--bg);color:var(--fg, var(--texto));padding:12px;font-size:.9rem;margin-bottom:8px;">'
    + '<button class="btnPri" id="vrMandarOtro">Ofrecer este precio</button>'
    + '</div>'
    + '<button class="btnPri" id="vrAceptar"></button>'
    + '<button class="btnSec" id="vrOtroBtn" style="display:none;">Otro precio</button>'
    + '<button class="btnSec" id="vrRechazar" style="color:var(--rojo);">Rechazar</button>'
    + '<button class="btnSec" id="vrCerrar">Ahora no</button>'
    + '</div>';
  document.body.appendChild(c);
  capaRespuesta = c;
  return c;
}

// Cuando se abre la ventana de un favor, ese aviso ya se vio: hay que apagar la
// campana y marcar `visto` en la base, o el cartelito seguia saliendo cada vez
// que se entraba a la pantalla aunque el favor ya estuviera resuelto (lo
// reporto Fredy probando, oct-2026). OJO: para los Retos esto lo hace
// `Retos/index.html` con `vigilarRetos(db, {esEsta:true})`; los Favores se
// pueden abrir en CUALQUIER pantalla, asi que se marca desde aqui.
// Barrido: si el aviso de la campana sigue "pendiente" pero NO hay ningun favor
// que de verdad me toque, se marca como visto.
//
// Sin esto el cartelito se quedaba repitiendo "No aceptaron tu favor" cada vez
// que se entraba a una pantalla, aunque el favor ya estuviera en el historial y
// no hubiera nada que hacer (lo reporto Fredy probando, oct-2026). Pasa porque
// la campana solo se apagaba al ABRIR la ventana del favor: si esa ventana no
// llegaba a salir (porque ya estaba descartada, o porque se navegó a otra
// pantalla), el aviso se quedaba ahi para siempre.
async function barrerAvisoHuerfano(db, yo, hayAlgoQueHacer){
  // Si hay algo pendiente de verdad, la campana DEBE seguir prendida.
  if(hayAlgoQueHacer) return;
  await marcarAvisosVistos(db, yo);
}

// ==============================================================================
//  AVISO DE LA CAMPANA — el error de raiz (oct-2026)
// -----------------------------------------------------------------------------
//  El aviso se guarda en `invitosFavor/{id de QUIEN MANDA}`, con `para` apuntando
//  a quien lo recibe. O sea que:
//
//      tu/device escribe  invitosFavor/{SU id}   ->  para: TU id
//      su/device escribe  invitosFavor/{TU id}   ->  para: SU id
//
//  O sea que el documento que te toca a TI **esta con el nombre de EL**, no con
//  el tuyo. Este codigo antes marcaba `invitosFavor/{miId}`, o sea el documento
//  de la OTRA persona: marcaba visto un aviso que no era mio y dejaba sin marcar
//  el mio. Por eso el cartelito ("No aceptaron tu favor") se repetia en cada
//  entrada y no se apagaba nunca, aunque no hubiera nada que hacer.
//
//  La regla: para "dar por visto lo que meodia a mi" hay que buscar el documento
//  cuya `para` SOY YO, no el que lleva mi nombre.
// ==============================================================================
async function marcarAvisosVistos(db, yo){
  if(!db || !yo || !yo.id) return;
  try{
    const q = query(collection(db, "invitosFavor"), where("para", "==", yo.id));
    const snap = await getDocs(q);
    snap.forEach(ds=>{
      const d = ds.data();
      if(!d || d.visto) return;
      setDoc(doc(db, "invitosFavor", ds.id), {
        visto: true, vistoEn: serverTimestamp()
      }, { merge: true }).catch((e)=>{
        console.error("Favor Express: no se pudo apagar la campana", e);
      });
    });
  }catch(e){ console.error("Favor Express: fallo el apagado de la campana", e); }
}

function marcarAvisoVisto(db, yo){
  marcarAvisosVistos(db, yo);
}

function mostrarRespuesta(f){
  const yo = Yo();
  const d = f.d;
  const otro = (d.para.id === yo.id) ? d.de : d.para;
  const c = laCapaRespuesta();
  const $ = (id)=> c.querySelector("#" + id);
  const btnAceptar = $("vrAceptar"), btnOtroBtn = $("vrOtroBtn"), btnRechazar = $("vrRechazar");
  const cajaOtro = $("vrOtro"), msg = $("vrMsg");
  // Al abrir de nuevo, el campo del contra-precio se esconde otra vez.
  cajaOtro.style.display = "none";
  msg.textContent = "";
  $("vrTexto").textContent = d.texto || "";
  $("vrPrecioFinal").value = d.precio;

  const cents = (n)=> (n > 0) ? (n + " pts") : "gratis";

  if(d.estado === "pedido"){
    // Soy quien tiene que cumplirlo.
    $("vrTitulo").textContent = otro.nombre + " te pide un favor";
    $("vrPrecio").textContent = "Precio: " + cents(d.precio) + ". Lo paga " + d.de.nombre
      + ". Puedes cobrar más, o dejarlo en 0. Al aceptar te da " + minutosDe(d) + " minutos.";
    btnOtroBtn.style.display = "block";
  }else if(d.estado === "contra"){
    // Soy quien pidió el favor: me contestan con otro precio. (Este paso casi se
    // pierde en el bug de `leTocaResponder`.)
    $("vrTitulo").textContent = otro.nombre + " te contesta";
    $("vrPrecio").textContent = "Quiere cobrar " + cents(d.precio) + " por: " + (d.texto || "")
      + ". Si aceptas, falta que confirme.";
    btnOtroBtn.style.display = "none";
  }else{
    // Soy quien cumple y me confirman el precio. Ahora sí arranca el reloj.
    $("vrTitulo").textContent = d.de.nombre + " confirmó el precio";
    $("vrPrecio").textContent = cents(d.precio) + " por: " + (d.texto || "")
      + ". Al aceptar te quedan " + minutosDe(d) + " minutos.";
    btnOtroBtn.style.display = "none";
  }
  btnAceptar.textContent = "Aceptar · " + cents(d.precio);
  btnRechazar.style.display = "block";

const cerrar = ()=>{
    c.classList.remove("ver");
    mostrando = false;
    mostrandoAbierta = null;
    descartar(f.id, f.d.estado);
    setTimeout(siguiente, 250);
  };
  cerrarRespondida = cerrar;
  mostrandoAbierta = { id: f.id };

  btnAceptar.onclick = async ()=>{
    btnAceptar.disabled = true;
    await responder(dbBase, f, "aceptar");
    btnAceptar.disabled = false;
    cerrar();
  };
  btnRechazar.onclick = async ()=>{
    btnRechazar.disabled = true;
    await responder(dbBase, f, "rechazar");
    btnRechazar.disabled = false;
    cerrar();
  };
  btnOtroBtn.onclick = ()=>{ cajaOtro.style.display = "block"; };
  $("vrMandarOtro").onclick = async ()=>{
    const n = parseInt($("vrPrecioFinal").value, 10);
    if(!isFinite(n) || n < 0){ msg.textContent = "El precio tiene que ser 0 o más."; return; }
    await responder(dbBase, f, "contra", n);
    cerrar();
  };
  // Cancelar: solo si el favor es MIO (lo pedi yo) y todavia no esta en curso.
  // Una vez en "enCurso" ya no se cancela: se cumple o se cobra el castigo.
  const btnCancelar = document.createElement("button");
  btnCancelar.className = "btnSec";
  btnCancelar.style.color = "var(--rojo)";
  btnCancelar.textContent = "Cancelar el favor";
  if(d.de.id === yo.id){
    btnCancelar.style.display = "block";
    btnCancelar.onclick = async ()=>{
      btnCancelar.disabled = true;
      await cerrarFavor(dbBase, f, "cancelado", {});
      btnCancelar.disabled = false;
      cerrar();
    };
  }else{
    btnCancelar.style.display = "none";
  }
  c.querySelector(".fvCaja").appendChild(btnCancelar);
  $("vrCerrar").onclick = cerrar;
  c.addEventListener("click", (e)=>{ if(e.target === c) cerrar(); });

  mostrando = true;
  c.classList.add("ver");
  marcarAvisoVisto(dbBase, yo);
}

// El estado que sigue depende de DONDE ESTAMOS y de lo que se hizo. El
// contra-precio es UNA ida y una vuelta: si yo contra-oferteo y el otro acepta,
// vuelve al que controla y ahi se decide. Nunca hay mas de un rodeo.
function siguienteEstado(d, accion, nuevoPrecio){
  if(accion === "rechazar") return { estado:"rechazado" };
  if(d.estado === "pedido"){
    if(accion === "contra") return { estado:"contra", precio: nuevoPrecio };
    return { estado:"enCurso" };               // aceptó directo: arranca el reloj
  }
  if(d.estado === "contra"){
    if(accion === "contra") return null;       // no se puede volver a contra: se acabó
    return { estado:"esperando" };            // quien pidió aceptó el precio nuevo
  }
  // estaba en "esperando": ya no hay a quién responderle. Se acepta y arranca.
  return { estado:"enCurso" };
}

function textoParaElOtro(d, sig, miNombre){
  if(sig.estado === "rechazado") return "\u274C " + miNombre + " no acept\u00f3 tu favor: " + (d.texto || "");
  if(sig.estado === "contra") return "\u{1F3B2} " + miNombre + " quiere cobrar " + sig.precio + " pts por: " + (d.texto || "");
  if(sig.estado === "esperando") return "\u{1F3B2} " + miNombre + " acept\u00f3 tu precio de " + d.precio + " pts. Falta que confirme.";
  return "\u2705 " + miNombre + " acept\u00f3: " + (d.texto || "")
      + ". Te quedan " + minutosDe(d) + " minutos para cumplirlo.";
}

async function responder(db, f, accion, nuevoPrecio){
  const yo = Yo();
  const d = f.d;
  if(!yo) return false;
  const sig = siguienteEstado(d, accion, nuevoPrecio);
  if(!sig) return false;
  const otro = (d.para.id === yo.id) ? d.de : d.para;
  try{
    const cambios = Object.assign({ actualizadoEn: serverTimestamp() }, sig);
    // El reloj arranca SOLO cuando el favor queda en "enCurso", o sea cuando ya
    // esta aceptado por los dos. Si arrancara al pedir, se venceria por estar
    // ocupada: es justo lo que dijo Fredy (oct-2026).
    if(sig.estado === "enCurso"){
      // OJO: esto se guarda como FECHA de Firebase (Timestamp), no como numero
      // suelto. Con un numero, todo el codigo que lo lee buscando `.toDate()` no
      // lo encuentra y la cuenta regresiva salia en cero desde el segundo uno:
      // "le falta: se acabo el tiempo" apenas se aceptaba (lo reporto Fredy
      // probando, oct-2026).
      cambios.venceEn = Timestamp.fromMillis(Date.now() + (minutosDe(d) * 60000));
      cambios.aceptadoPor = yo.id;
      cambios.aceptadoEn = serverTimestamp();
    }
    if(sig.estado === "rechazado"){
      cambios.rechazadoPor = yo.id;
      cambios.rechazadoEn = serverTimestamp();
    }
    if(sig.estado === "contra" || sig.estado === "esperando"){
      cambios.respondidoEn = serverTimestamp();
    }
    await setDoc(doc(db, "favoresExpress", f.id), cambios, { merge: true });
    await avisarAlOtro(db, yo, otro, d, sig);
    return true;
  }catch(e){
    console.error("Favor Express: no se pudo responder", e);
    return false;
  }
}

async function avisarAlOtro(db, yo, otro, d, sig){
  const texto = textoParaElOtro(d, sig, yo.nombre);
  try{
    await setDoc(doc(db, "invitosFavor", yo.id), {
      para: otro.id,
      de: yo.id,
      deNombre: yo.nombre,
      titulo: sig.estado === "rechazado" ? "No aceptaron tu favor"
           : sig.estado === "enCurso" ? "Aceptaron tu favor"
           : sig.estado === "vencido" ? "No te cumplió a tiempo"
           : sig.estado === "cobrado" ? "Se cobró el castigo"
           : sig.estado === "perdonado" ? "Lo dejaste pasar"
           : sig.estado === "cancelado" ? "Cancelaste el favor"
           : sig.estado === "cumplido" ? "Favor cumplido"
           : "Contestaron tu favor",
      aviso: texto,
      creadoEn: serverTimestamp(),
      visto: false
    }, { merge: true });
  }catch(e){}
  await avisarTelegram(texto, baseUrl() + "Retos/");
}

// ============================================================================
//  FASE 3 (parte 2) — la ventana de MI favor: cancelar, cobrar, perdonar
// ----------------------------------------------------------------------------
//  Se abre solo para quien PIDIO el favor, y solo en los estados donde hay algo
//  que hacer. En `contra` y `esperando`, si es mi turno, la ventanita de
//  responder trae su propio "Cancelar": así nunca se abren dos encimadas.
// ============================================================================

let colaPropia = [];
let mostrandoPropio = false;

function siguientePropio(){
  if(mostrandoPropio || !colaPropia.length) return;
  if(hayCajaAbierta()){ setTimeout(siguientePropio, 400); return; }
  olvidarDescartados();
  colaPropia.sort((a,b)=> cuandoMil(b) - cuandoMil(a));
  while(colaPropia.length && fueDescartado(colaPropia[0].id, colaPropia[0].d.estado)) colaPropia.shift();
  if(!colaPropia.length) return;
  const f = colaPropia[0];
  colaPropia = colaPropia.slice(1);
  mostrarPropio(f);
}

let capaPropia = null;
function laCapaPropia(){
  if(capaPropia) return capaPropia;
  const c = document.createElement("div");
  c.className = "fvCapa";
  c.innerHTML = '<div class="fvCaja">'
    + '<div class="fvNombre" id="vpTitulo"></div>'
    + '<div class="fvTexto" id="vpTexto"></div>'
    + '<div class="fvPrecio" id="vpPrecio"></div>'
    + '<div class="fvMsg" id="vpMsg"></div>'
    + '<button class="btnPri" id="vpOk"></button>'
    + '<button class="btnSec" id="vpSec"></button>'
    + '<button class="btnSec" id="vpCancelar" style="color:var(--rojo);">Cancelar favor</button>'
    + '<button class="btnSec" id="vpCerrar">Ahora no</button>'
    + '</div>';
  document.body.appendChild(c);
  capaPropia = c;
  return c;
}

// `venceEn` puede venir como FECHA de Firebase (Timestamp) o como numero
// suelto (los favores que se crearon antes de arreglar esto, oct-2026). Si solo
// se aceptara el formato de fecha, los numeros caian en 0 y el reloj arrancaba
// en "se acabo el tiempo" de inmediato.
function milisRestantes(venceEn){
  if(!venceEn) return 0;
  const ms = (typeof venceEn.toDate === "function")
    ? venceEn.toDate().getTime()
    : Number(venceEn);
  return (ms > 0 && isFinite(ms)) ? ms : 0;
}

function faltaEn(ms){
  if(!ms || ms <= 0) return "se acabó el tiempo";
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? (m + " min " + (s % 60) + " s") : (s + " s");
}

function mostrarPropio(f){
  const yo = Yo();
  const d = f.d;
  const otro = (d.para && d.para.id === yo.id) ? d.de : d.para;
  const c = laCapaPropia();
  const $ = (id)=> c.querySelector("#" + id);
  const ok = $("vpOk"), sec = $("vpSec"), btnCancelar = $("vpCancelar"), msg = $("vpMsg");
  msg.textContent = "";
  $("vpTexto").textContent = d.texto || "";

  const cerrar = ()=>{
    clearInterval(reloj);
    c.classList.remove("ver");
    mostrandoPropio = false;
    descartar(f.id, f.d.estado);
    setTimeout(siguientePropio, 250);
  };
  const btnCerrar = $("vpCerrar");
  btnCerrar.onclick = cerrar;
  c.addEventListener("click", (e)=>{ if(e.target === c) cerrar(); });

  // El reloj de la ventana no suelta el pago ni el castigo: solo pinta lo que
  // falta. El pago y el castigo se aprietan a mano, siempre.
  let reloj = 0;

  if(d.estado === "enCurso" && d.de.id !== yo.id){
    // Lo esta CUMPLIENDO la otra persona. Este boton ("Recibí ✓" / cobrar) es
    // solo de quien PIDIO el favor: si apareciera aqui, el que cumple podria
    // cobrarse a si mismo (lo reporto Fredy probando, oct-2026).
    // Solo se mira: no hay nada que hacer, unicamente "Ahora no".
    ok.style.display = "none"; sec.style.display = "none"; btnCancelar.style.display = "none";
    $("vpTitulo").textContent = "Estás cumpliendo";
    $("vpPrecio").textContent = (d.texto || "") + " · " + cents(d.precio)
      + ". Te pidió " + otro.nombre + ". Cuando termines, él te paga.";
    const ms = milisRestantes(d.venceEn);
    const pintarEspera = ()=>{
      const t = milisRestantes(d.venceEn) - Date.now();
      $("vpPrecio").textContent = (d.texto || "") + " · " + cents(d.precio)
        + ". Le falta: " + faltaEn(t);
    };
    pintarEspera();
    reloj = setInterval(pintarEspera, 1000);
    void ms;
  }else if(d.estado === "enCurso"){
    ok.style.display = "block"; sec.style.display = "none"; btnCancelar.style.display = "none";
    ok.textContent = "Recib\u00ed \u2713 \u00b7 " + cents(d.precio);
    const pintar = ()=>{
      const ms = milisRestantes(d.venceEn) - Date.now();
      $("vpTitulo").textContent = otro.nombre + " est\u00e1 cumpliendo";
      $("vpPrecio").textContent = "Pactado: " + cents(d.precio) + ". Le falta: " + faltaEn(ms);
    };
    pintar();
    reloj = setInterval(pintar, 1000);
    ok.onclick = async ()=>{ ok.disabled = true; const r = await pagarFavor(dbBase, f); ok.disabled = false; if(r) cerrar(); };
  }else if(d.estado === "vencido"){
    ok.style.display = "block"; sec.style.display = "block"; btnCancelar.style.display = "none";
    const multa = castigoDe(d);
    $("vpTitulo").textContent = "No te cumpli\u00f3 a tiempo";
    $("vpPrecio").textContent = "Se acab\u00f3 el tiempo por: " + (d.texto || "")
      + ". Si le cobras, paga " + cents(multa) + " (" + ((d.tasaCastigo != null ? d.tasaCastigo : PCT_CASTIGO_POR_DEFECTO)) + "% de " + cents(d.precio) + ").";
    ok.textContent = "Cobrar el castigo \u00b7 " + cents(multa);
    sec.textContent = "Dejarlo pasar";
    ok.onclick = async ()=>{ ok.disabled = true; const r = await cobrarCastigo(dbBase, f); ok.disabled = false; if(r) cerrar(); };
    sec.onclick = async ()=>{ sec.disabled = true; const r = await cerrarFavor(dbBase, f, "perdonado", {}); sec.disabled = false; if(r) cerrar(); };
  }else{
    // Todavia no lo ha aceptado: se puede cancelar.
    ok.style.display = "none"; sec.style.display = "none"; btnCancelar.style.display = "block";
    $("vpTitulo").textContent = "Esperando a " + otro.nombre;
    $("vpPrecio").textContent = "Le pediste: " + (d.texto || "") + " \u00b7 " + cents(d.precio)
      + ". Todav\u00eda no lo acepta.";
    btnCancelar.onclick = async ()=>{
      btnCancelar.disabled = true;
      const r = await cerrarFavor(dbBase, f, "cancelado", {});
      btnCancelar.disabled = false;
      if(r) cerrar();
    };
  }

  mostrandoPropio = true;
  c.classList.add("ver");
  marcarAvisoVisto(dbBase, Yo());
}

// Se engancha al mismo snapshot que las de responder.
function encolarPropios(snap, yo){
  colaPropia = [];
  let accionables = 0;
  snap.forEach(ds=>{
    const d = ds.data();
    if(!d) return;
    todosLosFavores[ds.id] = { id: ds.id, d };
    if(!d.de || d.de.id !== yo.id) return;
    if(["pedido","enCurso","vencido"].indexOf(d.estado) < 0) return;
    accionables++;
    if(esReciente({ id: ds.id, d })) colaPropia.push({ id: ds.id, d });
  });
  // Devuelve cuantos favores Mios hay que hacer, sin importar la antiguedad: eso
  // lo usa el barrido para NO apagar la campana si todavia queda algo pendiente.
  return accionables;
}

// Lo que se llama cuando el usuario ya le dio "Entendido" al aviso de la
// campana: se abre la ventana del favor que le toca. Y solo ese favor: si hay
// mas de uno pendiente, el resto se abre desde Centro -> Favores.
export function abrirFavorPendiente(){
  const yo = Yo();
  if(!yo || !yo.id) return false;
  cola = []; colaPropia = [];
  let elegido = null;
  Object.keys(todosLosFavores).forEach(id=>{
    const f = todosLosFavores[id];
    if(!f || !f.d) return;
    if(leTocaResponder(f.d, yo.id)){
      if(!elegido || (cuandoMil(f) > cuandoMil(elegido))) elegido = f;
      return;
    }
    if(f.d.de && f.d.de.id === yo.id && ["enCurso","vencido"].indexOf(f.d.estado) >= 0){
      if(!elegido || (cuandoMil(f) > cuandoMil(elegido))) elegido = f;
    }
  });
  if(!elegido) return false;
  if(leTocaResponder(elegido.d, yo.id)) mostrarRespuesta(elegido);
  else mostrarPropio(elegido);
  return true;
}

// ============================================================================
//  FASE 3 — el reloj, el pago y el castigo
// ----------------------------------------------------------------------------
//  - El reloj NO es una alarma: nadie va a estar mirando la app en el minuto
//    exacto. Se revisa al abrir, y lo que se vencio mientras tanto se liquida.
//  - El castigo NO es automatico: le toca a quien PIDIO decidir si lo cobra.
//  - Los puntos SIEMPRE se mueven con `runTransaction`, que relee los saldos
//    adentro: dos celulares apretando a la vez no pueden gastar dos veces lo
//    que no hay.
// ============================================================================

// Los minutos que da el que pide, congelados al crear el favor.
function minutosDe(d){
  const m = parseInt(d && d.minutos, 10);
  return (isFinite(m) && m > 0) ? m : MINUTOS_POR_DEFECTO;
}

// Cuanto es el castigo de este favor. Es un PORCENTAJE del precio final, asi
// que si el otro ofrece otro precio el castigo se ajusta solo.
function castigoDe(d){
  const pct = parseInt(d && d.tasaCastigo, 10);
  const tasa = isFinite(pct) ? pct : PCT_CASTIGO_POR_DEFECTO;
  const precio = (d && typeof d.precio === "number") ? d.precio : 0;
  return Math.floor(precio * tasa / 100);
}

function cents(n){ return (n > 0) ? (n + " pts") : "gratis"; }

// Marca como vencido lo que ya paso de tiempo. No cobra nada: solo deja el
// favor en "vencido" para que quien pidio decida.
async function liquidarVencidos(db, snap){
  const yo = Yo();
  const ahora = Date.now();
  snap.forEach(ds=>{
    const d = ds.data();
    if(!d || d.estado !== "enCurso") return;
    if(!d.venceEn) return;
    const ms = milisRestantes(d.venceEn);
    if(!ms || ms > ahora) return;
    // Que lo marque UNA sola vez: se hace aqui y no con un reloj, porque si los
    // dos tienen la app cerrada puede pasar el tiempo sin que nadie lo note.
    setDoc(doc(db, "favoresExpress", ds.id), {
      estado: "vencido",
      liquidadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp()
    }, { merge: true }).catch(()=>{});
  });
}

// ---- mover puntos ----

// El que pide le paga el precio a quien cumplio.
async function pagarFavor(db, f){
  const yo = Yo();
  const d = f.d;
  if(!yo || !d || d.de.id !== yo.id) return false;
  const aPagar = (typeof d.precio === "number") ? d.precio : 0;
  if(aPagar <= 0){ return cerrarFavor(dbBase, f, "cumplido", { pagado: 0 }); }
  try{
    await runTransaction(db, async (t)=>{
      const refMio = doc(db, "puntosUsuarios", yo.id);
      const s = await t.get(refMio);
      const mio = (s.exists() ? (s.data().balance || 0) : 0);
      if(mio < aPagar) throw new Error("saldo");
      t.update(refMio, { balance: increment(-aPagar) });
      t.set(doc(db, "puntosUsuarios", d.para.id), { balance: increment(aPagar) }, { merge: true });
    });
  }catch(e){
    if(e && e.message === "saldo"){
      aviso("No te alcanzan " + aPagar + " pts. Revisa tu saldo antes de marcar.");
      return false;
    }
    aviso("No se pudo pagar. Revisa tu conexi\u00f3n.");
    return false;
  }
  return cerrarFavor(dbBase, f, "cumplido", { pagado: aPagar });
}

// El castigo. NUNCA se descuenta solo: quien pide aprieta el boton. Y se
// descuenta HASTA donde alcance, con tope cero (decision de Fredy, oct-2026).
async function cobrarCastigo(db, f){
  const yo = Yo();
  const d = f.d;
  if(!yo || !d || d.de.id !== yo.id) return false;
  const multa = castigoDe(d);
  let cobrado = 0;
  if(multa > 0){
    try{
      await runTransaction(db, async (t)=>{
        const refSuyo = doc(db, "puntosUsuarios", d.para.id);
        const s = await t.get(refSuyo);
        const suyo = (s.exists() ? (s.data().balance || 0) : 0);
        cobrado = Math.min(multa, Math.max(0, suyo));
        if(cobrado > 0){
          t.update(refSuyo, { balance: increment(-cobrado) });
          t.set(doc(db, "puntosUsuarios", yo.id), { balance: increment(cobrado) }, { merge: true });
        }
      });
    }catch(e){
      aviso("No se pudo cobrar el castigo. Revisa tu conexi\u00f3n.");
      return false;
    }
  }
  return cerrarFavor(dbBase, f, "cobrado", { castigo: multa, cobrado: cobrado });
}

async function cerrarFavor(db, f, estado, extra){
  const yo = Yo();
  const d = f.d;
  if(!yo) return false;
  try{
    const cambios = Object.assign({
      estado: estado,
      cerradoPor: yo.id,
      cerradoEn: serverTimestamp(),
      // OJO: `actualizadoEn` tiene que ir en CADA cambio. Si falta, todo lo que
      // decide "esto es reciente" cae al `creadoEn` viejo y el cambio se ve como
      // si fuera cosa del pasado: los mensajes llegaban desfasados (lo reporto
      // Fredy probando, oct-2026).
      actualizadoEn: serverTimestamp()
    }, extra || {});
    await setDoc(doc(db, "favoresExpress", f.id), cambios, { merge: true });
    const otro = (d.para.id === yo.id) ? d.de : d.para;
    let texto = "";
    if(estado === "cumplido"){
      texto = "\u2B50 " + yo.nombre + " marc\u00f3 tu favor como hecho. " + cents((extra && extra.pagado) || 0) + " para ti.";
    }else if(estado === "cobrado"){
      texto = "\u26A0 " + yo.nombre + " te cobr\u00f3 el castigo por: " + (d.texto || "");
    }else if(estado === "perdonado"){
      texto = "\u1F49A " + yo.nombre + " te dej\u00f3 pasar el favor: " + (d.texto || "");
    }else if(estado === "cancelado"){
      texto = "\u274C " + yo.nombre + " cancel\u00f3 el favor: " + (d.texto || "");
    }
    if(texto){
      try{
        await setDoc(doc(db, "invitosFavor", yo.id), {
          para: otro.id, de: yo.id, deNombre: yo.nombre,
          titulo: "Cerraron tu favor", aviso: texto,
          creadoEn: serverTimestamp(), visto: false
        }, { merge: true });
      }catch(e){}
      await avisarTelegram(texto, baseUrl() + "Retos/");
    }
    return true;
  }catch(e){
    console.error("Favor Express: no se pudo cerrar", e);
    return false;
  }
}