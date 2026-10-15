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
  doc, getDoc, setDoc, getFirestore, collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { aviso } from "./confirmar.js";
import { avisarTelegram } from "./telegram.js";
import { soyInvitado, CLAVE_LOCAL } from "./invitado.js";
import { baseUrl } from "./config.js";

// Si no hay numero guardado, este. OJO: aqui el 0 SI es valido (ella puede
// regalar el favor), asi que no se comprueba "> 0" como en el 🛒 de los deseos.
const FAVOR_POR_DEFECTO = 15;

// Cuánto tiempo hay para cumplirlo una vez que se acepta. La FASE 3 lo saca de
// aquí y lo hace configurable en el 🛒 (decisión de Fredy, oct-2026). Por ahora
// es fijo: cambiarlo es cambiar este número.
const MINUTOS_FAVOR = 10;

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
let montado = null;

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
      width:54px; height:54px; border-radius:50%; border:none;
      font-size:1.5rem; line-height:1; cursor:pointer;
      background:linear-gradient(90deg, var(--coral), var(--teal));
      box-shadow:0 6px 18px rgba(0,0,0,.35);
      font-family:'Inter',sans-serif; }
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
 * Monta el botón flotante y su ventana. Se puede llamar en todas las pantallas;
 * si ya se montó en esta, no hace nada otra vez.
 * @param db  la base de la pareja (la misma que ya tiene la pantalla)
 */
export function montarFavor(db){
  if(yaMontado || typeof document === "undefined") return;
  if(!db) return;
  // Invitado: nunca. La sala de espera y todo lo que se abre como invitado
  // quedan fuera, sin tener que hacer una lista de pantallas.
  if(soyInvitado()) return;
  if(!yoLocal()) return;   // todavía no hay identidad: pantalla de elegir usuario

  yaMontado = true;
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
        precio = isFinite(n) ? n : FAVOR_POR_DEFECTO;
      }
      pareja = lista.find(u=> u && u.id !== yo.id && !u.invitado)
            || lista.find(u=> u && u.id !== yo.id);
    }catch(e){}
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
    }catch(e){}

    btnMandar.disabled = true;
    try{
      await addDoc(collection(db, "favoresExpress"), {
        de: { id: yo.id, nombre: yo.nombre },
        para: { id: pareja.id, nombre: pareja.nombre },
        texto: texto,
        precioBase: precio,
        precio: precio,
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
      }catch(e){}
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