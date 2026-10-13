// ============================================================================
//  La campana en la pestaña del navegador
// ----------------------------------------------------------------------------
//  Cuando alguien te invita al Chat, el ícono de la pestaña -la imagen chiquita
//  de arriba, junto a la dirección- se cambia por una campana 🔔.
//
//      import { vigilarInvitaciones } from "./pestana.js";
//      vigilarInvitaciones(db);                  // en el menu y pantallas
//      vigilarInvitaciones(db, { esChat:true });  // en Chat/
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
//   - En cualquier otra pantalla, al entrar a la pestaña sale un cartelito que
//     explica qué es. Sin el cartelito la campana prendida no significaba nada.
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
  doc, onSnapshot, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { aviso } from "./confirmar.js";

// Misma clave que usan todas las pantallas para saber quien eres.
const CLAVE_LOCAL = "appPareja_quienSoy";

// Pasados estos minutos, la invitación se deja de mirar. Fredy lo pidió en 30.
const MINUTOS_VIGENCIA = 30;

// El <link> que puso la campana. Se guarda aparte para poder quitar SOLO ese:
// si la página ya traía su propio ícono (el menú trae icon-192.png), ese nunca
// se toca y vuelve a ser el de la pestaña en cuanto quitamos la campana.
let linkCampana = null;
let refInv = null;
let hayPendiente = false;
let esChat = false;
let yaHuboTransicion = false;
// Cerrojo: `mostrarMenu()` del menú puede llamar esto dos veces (si se cambia
// de usuario), y sin esto se registraría el `visibilitychange` dos veces y el
// cartelito se abriría encimado dos veces.
let yaVigilado = false;
let relojVigencia = 0;

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
function programarVigencia(creadoEn){
  try{ clearTimeout(relojVigencia); }catch(e){}
  const queda = msRestantes(creadoEn);
  if(queda <= 0) return;
  relojVigencia = setTimeout(()=>{
    quitarCampana();
    hayPendiente = false;
  }, queda + 500);
}

function pintar(mia, creadoEn){
  hayPendiente = !!mia;
  if(hayPendiente){
    ponerCampana();
    programarVigencia(creadoEn);
    // Si la pestaña que se está viendo ES el Chat, la invitación ya se está
    // viendo: no tiene sentido dejar la campana en la propia pantalla del chat.
    // Esto también cubre abrir Chat con la pestaña ya a la vista, donde no hay
    // ningún `visibilitychange` que dispare nada.
    if(esChat && !document.hidden) marcarVista();
  }else{
    quitarCampana();
    try{ clearTimeout(relojVigencia); }catch(e){}
  }
}

// Dar por vista una invitación: se apaga la campana y se escribe `visto` en la
// base, para que el otro dispositivo tampoco la espere.
async function marcarVista(){
  quitarCampana();
  hayPendiente = false;
  try{ clearTimeout(relojVigencia); }catch(e){}
  if(!refInv) return;
  try{ await updateDoc(refInv, { visto:true, vistoEn:serverTimestamp() }); }catch(e){}
}

function avisarInvitacion(){
  aviso({
    titulo: "Te invitaron al Chat",
    texto: "Ve a Comunicaciones → Chat para platicar."
  });
}

/**
 * Empieza a vigilar las invitaciones al Chat.
 * @param db        la base de la pareja (la misma que ya tiene la pantalla)
 * @param opciones  `{ esChat:true }` si esta pantalla ES el Chat. Solo ahí se
 *                  apaga la campana al entrar; en el resto sale el cartelito.
 */
export function vigilarInvitaciones(db, opciones){
  if(yaVigilado) return;
  const yo = leerYo();
  if(!yo || !db) return;
  yaVigilado = true;
  esChat = !!(opciones && opciones.esChat);
  try{
    refInv = doc(db, "invitosChat", "actual");
    onSnapshot(refInv, (snap)=>{
      const d = snap.exists() ? snap.data() : null;
      const mia = !!(d && d.para === yo.id && !d.visto && msRestantes(d.creadoEn) > 0);
      pintar(mia, d && d.creadoEn);
    }, ()=>{});
  }catch(e){}
  document.addEventListener("visibilitychange", ()=>{
    if(document.hidden) return;
    // En la PRIMERA vez que la pestaña se ve no se avisa: si abres la app con
    // una invitación pendiente, el cartelito saltando de entrada avienta.
    // El cartelito es para cuando VOLVES a una pestaña que ya tenías abierta.
    const avisar = yaHuboTransicion;
    yaHuboTransicion = true;
    if(!hayPendiente) return;
    if(esChat) marcarVista();
    else if(avisar) avisarInvitacion();
  });
}
