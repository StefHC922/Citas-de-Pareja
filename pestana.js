// ============================================================================
//  La campana en la pestaña del navegador
// ----------------------------------------------------------------------------
//  Cuando alguien te invita al Chat, el ícono de la pestaña -la imagen chiquita
//  de arriba, junto a la dirección- se cambia por una campana 🔔.
//
//      import { vigilarInvitaciones, vigilarRetos } from "./pestana.js";
//      vigilarInvitaciones(db);                  // en el menu y pantallas
//      vigilarInvitaciones(db, { esChat:true });  // en Chat/
//      vigilarRetos(db);                         // los retos de la IA (oct-2026)
//
//  Para qué sirve: para enterarte SIN abrir la pestaña. Si la tienes en segundo
//  plano el ícono se ve igual, y eso es justo lo que un aviso dentro de la
//  página NO puede hacer: una pestaña escondida no se ve.
//
//  Cómo funciona (decisiones de Fredy, oct-2026):
//   - Escucha el documento `invitosChat/actual` de la base de la pareja.
//   - Si dice `para: miId`, `visto: false` y tiene menos de 30 minutos, prende
//     la campana. Pasados los 30 minutos se ignora, para que no se quede
//     colgada para siempre si nadie abre el Chat.
//   - La campana se apaga SOLO en Chat, y solo con la pestaña a la vista: entrar
//     al menu NO la apaga, porque ver la pestaña no es ver la invitación.
//   - El cartelito sale cuando la invitación se hace visible, y visible quiere
//     decir las dos cosas: que la página está a la vista AHORA, o que la
//     invitación acaba de llegar con la página ya a la vista. Antes solo se
//     decía en el segundo caso y con una barrera que tapaba el primero: la
//     campana salía y al entrar a la pestaña no pasaba nada (lo reportó Fredy).
//   - Con la invitación entrando, suena un bip. Chrome solo lo deja si el
//     usuario ya tocó esa página alguna vez; si nunca la tocó, no hay bip.
//
//  Lo que NO hace, y conviene saberlo antes de prometerlo:
//   - SOLO en computadora con Chrome o Edge. En el celular los navegadores no
//     dejan cambiar el ícono de la pestaña: no hay forma de hacerlo.
//   - No avisa con la app CERRADA. Para eso haría falta el "ayudante de fondo"
//     (service worker) y unas claves de push, que este repo no tiene.
//   - Quien manda la invitación NO ve la campana: el documento lleva `para` con
//     el otro id, y aquí solo se marca si `para` soy yo.
// ============================================================================

import {
  doc, collection, onSnapshot, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { aviso } from "./confirmar.js";

// Misma clave que usan todas las pantallas para saber quien eres.
const CLAVE_LOCAL = "appPareja_quienSoy";

// Pasados estos minutos, la invitación se deja de mirar. Fredy lo pidió en 30.
const MINUTOS_VIGENCIA = 30;

// Qué se puede vigilar. Cada tipo tiene su propio documento y su propio cartelito.
// El de los retos se agregó en oct-2026: cuando la IA (o la pareja) te manda un
// reto, suena lo mismo que te invitan al Chat.
const TIPOS = {
  chat: {
    coleccion: "invitosChat",
    // UN documento fijo: "invitosChat/actual". Da igual quien invite, porque la
    // invitación al chat es simétrica.
    unoSolo: true,
    titulo: "Te invitaron al Chat",
    texto: "Ve a Comunicaciones → Chat para platicar."
  },
  retos: {
    coleccion: "invitosRetos",
    // Un documento POR QUIEN MANDA: "invitosRetos/{id}". Con uno solo los dos se
    // pisan: si cada uno pide un reto, el segundo sobrescribe al primero y quien
    // lo mandó nunca se entera (bug encontrado en la revisión de oct-2026).
    unoSolo: false,
    titulo: "Hay un reto nuevo",
    texto: "Ve a Retos para verlo."
  }
};

// Un "canal" por tipo vigilado. Antes esto eran variables sueltas (refInv,
// hayPendiente, esChat...), que solo permitian UN documento: para agregar los
// retos habria que haberlas duplicado todas con otros nombres.
const canales = {};

// El <link> que puso la campana. Se guarda aparte para poder quitar SOLO ese:
// si la página ya traía su propio ícono (el menú trae icon-192.png), ese nunca
// se toca y vuelve a ser el de la pestaña en cuanto quitamos la campana.
let linkCampana = null;
let ctxSonido = null;

function leerYo(){
  try{ return JSON.parse(localStorage.getItem(CLAVE_LOCAL)); }catch(e){ return null; }
}

// ---------- el ícono de la pestaña ----------

// La campana se dibuja en un canvas y se convierte en imagen. Chrome acepta un
// data: URL como ícono de la pestaña, que es lo único que hay para cambiarlo sin
// tener un archivo de verdad.
function iconoCampana(){
  try{
    const c = document.createElement("canvas");
    c.width = 64; c.height = 64;
    const x = c.getContext("2d");
    if(!x) return "";
    x.clearRect(0, 0, 64, 64);
    // Se piden las tres fuentes de emoji porque cada sistema tiene la suya; si
    // falta una, el navegador prueba la siguiente.
    x.font = '52px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("🔔", 32, 34);
    return c.toDataURL("image/png");
  }catch(e){ return ""; }
}

function ponerCampana(){
  if(linkCampana) return;
  const url = iconoCampana();
  if(!url) return;
  try{
    const l = document.createElement("link");
    l.rel = "icon";
    l.type = "image/png";
    l.setAttribute("data-campana", "1");
    l.href = url;
    document.head.appendChild(l);
    linkCampana = l;
  }catch(e){}
}

function quitarCampana(){
  if(!linkCampana) return;
  try{ linkCampana.remove(); }catch(e){}
  linkCampana = null;
}

// ---------- la invitación ----------

// La campana es UNA sola, pero puede haber varios canales con algo pendiente: si
// hay uno pendiente se prende, y solo se apaga cuando NO queda ninguno.
function algunoPendiente(){
  for(const k in canales){ if(canales[k].pendiente) return true; }
  return false;
}

// Sin fecha legible NO se prende la campana. El documento lo escribe el botón
// "Invitar" y siempre lleva `creadoEn`, así que una fecha que no se lee es algo
// roto: mejor no inventar una invitación vieja que sí se vaya sola.
// Devuelve los milisegundos que LE QUEDAN de vida (negativo = ya venció).
function msRestantes(creadoEn){
  try{
    const ms = creadoEn && creadoEn.toDate ? creadoEn.toDate().getTime() : 0;
    if(!ms) return 0;
    return (ms + (MINUTOS_VIGENCIA * 60000)) - Date.now();
  }catch(e){ return 0; }
}

// OJO: la vigencia no se revisa sola. El `onSnapshot` solo dispara cuando el
// documento CAMBIA, y si nadie manda otra invitación no vuelve a disparar: la
// campana se quedaría prendida pasada la hora. Por eso se pone un reloj que
// apaga la campana solo cuando se acaba el tiempo, sin escribir nada en la base
// (marcar `visto` sería mentir: nadie la vio).
function programarVigencia(canal, creadoEn){
  try{ clearTimeout(canal.reloj); }catch(e){}
  const queda = msRestantes(creadoEn);
  if(queda <= 0) return;
  canal.reloj = setTimeout(()=>{
    canal.pendiente = false;
    ponerQuitarCampana();
  }, queda + 500);
}

// La campana se apaga solo cuando ningun canal tiene ya nada pendiente.
function ponerQuitarCampana(){
  if(algunoPendiente()) ponerCampana();
  else quitarCampana();
}

function pintar(canal, mia, creadoEn){
  const antes = canal.pendiente;
  canal.pendiente = !!mia;
  if(canal.pendiente){
    ponerCampana();
    programarVigencia(canal, creadoEn);
    // Si la invitación llega con la pestaña YA a la vista, se dice ahí mismo:
    // no hay nada que esperar a que vuelva. Antes solo se decía al cambiar de
    // pestaña, y con una barrera que lo tapaba la PRIMERA vez (bug que reportó
    // Fredy: la campana salía, pero al entrar a la pestaña no pasaba nada).
    avisarInvitacion(canal);
    // Si la pestaña que se está viendo ES esa pantalla (el Chat, o Retos), lo
    // que se está viendo ya ES la invitación: no tiene sentido dejar la campana
    // ahí. También cubre abrirla con la pestaña ya a la vista, donde no hay
    // ningún `visibilitychange` que dispare nada.
    if(canal.esEsta && !document.hidden) marcarVista(canal);
    // El bip solo cuando la invitación ACABABA de aparecer, no en cada aviso
    // que llegue de la base (si no, sonaría repetido).
    if(!antes) bipInvitacion();
  }else{
    canal.cartelitoYaSalio = false;
    try{ clearTimeout(canal.reloj); }catch(e){}
    ponerQuitarCampana();
  }
}

// Dar por vista una invitación: se apaga la campana (si no queda nada pendiente
// en ningun otro canal) y se escribe `visto` en la base, para que el otro
// dispositivo tampoco la espere.
async function marcarVista(canal){
  canal.pendiente = false;
  try{ clearTimeout(canal.reloj); }catch(e){}
  ponerQuitarCampana();
  if(!canal.ref) return;
  try{ await updateDoc(canal.ref, { visto:true, vistoEn:serverTimestamp() }); }catch(e){}
}

function avisarInvitacion(canal){
  // Se dice solo si: hay algo pendiente, la pestaña se PUEDE ver (si está
  // escondida el cartelito no serviría de nada: para eso está la campana), la
  // pantalla NO es esta misma (ahí ya lo está viendo) y no se dijo antes en esta
  // invitación.
  if(!canal.pendiente || document.hidden || canal.esEsta || canal.cartelitoYaSalio) return;
  canal.cartelitoYaSalio = true;
  const t = TIPOS[canal.tipo] || TIPOS.chat;
  aviso({ titulo: t.titulo, texto: t.texto });
}

// ---------- el bip ----------
// Chrome NO deja sonar nada si el usuario nunca ha tocado esa página: el
// contexto de audio arranca "suspendido" y solo se abre con un toque previo.
// Por eso se intenta abrir con el PRIMER toque, tecla o rueda de la página.
// Si nunca hubo ninguno, no hay bip: es el navegador, no un error.
function abrirSonido(){
  try{
    if(ctxSonido) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    ctxSonido = new AC();
    if(ctxSonido.state === "suspended") ctxSonido.resume();
  }catch(e){ ctxSonido = null; }
}
["pointerdown", "keydown", "wheel", "touchstart"].forEach(ev=>{
  window.addEventListener(ev, abrirSonido, { once:true, passive:true });
});

// Mismo sonido que usan Citas/ y Retos/, y con el MISMO silencio que los fuegos
// artificiales (`fuegos_mute`): si ese botón está apagado, aquí tampoco suena.
function bipInvitacion(){
  try{ if(localStorage.getItem("fuegos_mute") === "1") return; }catch(e){}
  try{
    if(!ctxSonido || ctxSonido.state !== "running") return;
    const t = ctxSonido.currentTime;
    const o = ctxSonido.createOscillator(), g = ctxSonido.createGain();
    o.connect(g); g.connect(ctxSonido.destination);
    o.type = "sine"; o.frequency.value = 880;
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.start(t); o.stop(t + 0.5);
  }catch(e){}
}

/**
 * Empieza a vigilar un tipo de invitación (Chat, Retos...). Se puede llamar una
 * vez por tipo: cada uno tiene su documento, su cartelito y su reloj.
 * @param db        la base de la pareja (la misma que ya tiene la pantalla)
 * @param opciones  `{ esEsta:true }` si ESTA pantalla es la que avisa (el Chat
 *                  con el chat, `Retos/` con los retos). Solo ahí se apaga la
 *                  campana al entrar; en el resto sale el cartelito.
 *
 * Las llamadas viejas siguen sirviendo: `vigilarInvitaciones(db)` vigila el
 * Chat, y `vigilarInvitaciones(db, {esChat:true})` marca que la pantalla es el
 * Chat. Para los retos: `vigilarInvitaciones(db, {tipo:"retos"})`.
 */
export function vigilarInvitaciones(db, opciones){
  const o = opciones || {};
  const tipo = o.tipo || "chat";
  if(!TIPOS[tipo]) return;
  const yo = leerYo();
  if(!yo || !db) return;
  // Cerrojo por tipo: `mostrarMenu()` del menú puede llamar esto dos veces (si
  // se cambia de usuario), y sin esto se registraría el `visibilitychange` dos
  // veces y el cartelito se abriría encimado dos veces.
  if(canales[tipo]) return;
  const canal = canales[tipo] = {
    tipo, ref:null, pendiente:false, esEsta:false,
    cartelitoYaSalio:false, reloj:0
  };
  canal.esEsta = !!(o.esEsta ?? (tipo === "chat" ? o.esChat : o.esRetos));
  const t = TIPOS[tipo];
  const esMia = (d)=> !!(d && d.para === yo.id && !d.visto && msRestantes(d.creadoEn) > 0);
  try{
    if(t.unoSolo){
      canal.ref = doc(db, t.coleccion, "actual");
      onSnapshot(canal.ref, (snap)=>{
        const d = snap.exists() ? snap.data() : null;
        pintar(canal, esMia(d), d && d.creadoEn);
      }, ()=>{});
    }else{
      // Uno por quien manda: de todos los documentos se toma el mas reciente que
      // vaya dirigido a MI. Si llegan varios a la vez (los dos pidieron), la
      // campana es una sola y no puede avisar de dos cosas: gana el mas nuevo.
      onSnapshot(collection(db, t.coleccion), (snap)=>{
        let mine = null;
        snap.forEach(ds=>{
          const d = ds.data();
          if(!esMia(d)) return;
          if(!mine){ mine = { id: ds.id, creadoEn: d.creadoEn }; return; }
          const a = (d.creadoEn && d.creadoEn.toDate) ? d.creadoEn.toDate().getTime() : 0;
          const b = (mine.creadoEn && mine.creadoEn.toDate) ? mine.creadoEn.toDate().getTime() : 0;
          if(a > b) mine = { id: ds.id, creadoEn: d.creadoEn };
        });
        canal.ref = mine ? doc(db, t.coleccion, mine.id) : null;
        pintar(canal, !!mine, mine && mine.creadoEn);
      }, ()=>{});
    }
  }catch(e){}
  document.addEventListener("visibilitychange", ()=>{
    if(document.hidden) return;
    if(canal.esEsta && canal.pendiente) marcarVista(canal);
    else avisarInvitacion(canal);
  });
}

/** Atajo para los retos: `vigilarRetos(db)` / `vigilarRetos(db, {esEsta:true})`. */
export function vigilarRetos(db, opciones){
  return vigilarInvitaciones(db, Object.assign({}, opciones || {}, { tipo:"retos" }));
}
