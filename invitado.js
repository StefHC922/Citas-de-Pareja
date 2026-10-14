// =====================================================
//  INVITADO — estado del modo invitado, en un solo lugar
// =====================================================
//  LA REGLA DE ESTE ARCHIVO:
//
//    El invitado solo está dentro mientras dura la partida.
//    Cuando termina, se le devuelve su información y sale.
//    No hay salida libre, en ningún juego.
//
//  Consecuencia: TENER COPIA no significa SER INVITADO.
//  La copia se toma al escanear el QR (para poder volver
//  atrás si algo sale mal). El significado de "ya eres
//  invitado de verdad" solo lo da la IDENTIDAD, que se
//  escribe hasta que te registran.
//
//  Antes estas reglas estaban repartidas en el inicio y en
//  Diablitos, y por eso "entrar a ver la opción" ya te
//  dejaba marcado como visitante. Aquí hay una sola copia.
// =====================================================

import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import firebaseConfigBase from "./firebase-config.js";
import { resolverFirebase } from "./config.js";

// Copia de lo tuyo, para poder restaurarlo al salir.
export const CLAVE_BACKUP = "invitado_respaldo";
// Quién eres ahora mismo.
export const CLAVE_LOCAL = "appPareja_quienSoy";
// La llave del autorizador NO se copia ni se borra: es del
// desarrollador, no del invitado ni de la pareja.
const LLAVE_PROPIA = "taquilla_priv";

// ---------- las dos preguntas que nunca hay que confundir ----------

/** Hay una copia guardada. NO significa que seas invitado. */
export function hayRespaldo(){
  try{ return !!localStorage.getItem(CLAVE_BACKUP); }catch(e){ return false; }
}

/** Eres invitado de verdad: solo cuando ya te registraron. */
export function soyInvitado(){
  try{
    const yo = JSON.parse(localStorage.getItem(CLAVE_LOCAL) || "null");
    return !!(yo && yo.invitado);
  }catch(e){ return false; }
}

/** Escaneaste un QR pero nunca te registraste. Hay que volver atrás. */
export function quedasteMedioCamino(){
  return hayRespaldo() && !soyInvitado();
}

/** La copia se toma justo antes de cambiar la base del anfitrión. */
export function respaldar(){
  try{
    const snap = {};
    for(let i = 0; i < localStorage.length; i++){
      const k = localStorage.key(i);
      if(k === LLAVE_PROPIA || k === CLAVE_BACKUP) continue;
      snap[k] = localStorage.getItem(k);
    }
    localStorage.setItem(CLAVE_BACKUP, JSON.stringify(snap));
    return true;
  }catch(e){ return false; }
}

/** Devuelve todo lo tuyo y borra la copia. */
export function restaurar(){
  try{
    const snap = JSON.parse(localStorage.getItem(CLAVE_BACKUP) || "null");
    if(!snap) return false;
    const priv = localStorage.getItem(LLAVE_PROPIA);
    localStorage.clear();
    if(priv) localStorage.setItem(LLAVE_PROPIA, priv);
    Object.keys(snap).forEach(k=>{ try{ localStorage.setItem(k, snap[k]); }catch(e){} });
    localStorage.removeItem(CLAVE_BACKUP);
    return true;
  }catch(e){ return false; }
}

/** Si quedaste a medio camino, se arregla solo y en silencio. */
export function recuperarMedioCamino(){
  if(!quedasteMedioCamino()) return false;
  return restaurar();
}

// ---------- salir de verdad ----------

/**
 * Te saca de la lista de invitados del anfitrión y te devuelve
 * lo tuyo. Devuelve true si sí había algo que deshacer.
 * @param db  base del anfitrión (opcional: si falta, solo restaura)
 */
export async function salirDeInvitado(db){
  if(!hayRespaldo()) return false;
  let quitado = false;
  try{
    let yo = null;
    try{ yo = JSON.parse(localStorage.getItem(CLAVE_LOCAL) || "null"); }catch(e){}
    const base = db || dbInvitado();
    if(base && yo && yo.invitado){
const ref = doc(base, "config", "ajustes");
    const snap = await conTiempo(getDoc(ref), 10000);
    const arr = (snap.exists() && Array.isArray(snap.data().usuarios)) ? snap.data().usuarios : [];
    await conTiempo(setDoc(ref, { usuarios: arr.filter(v=>!v || v.id !== yo.id), actualizadoEn: serverTimestamp() }, { merge: true }), 10000);
    // El saldo se pone en cero, NO se borra el documento (decision de Fredy,
    // oct-2026). Antes se quedaba guardado con el saldo que traia y nadie lo
    // volvia a leer jamas: al registrarse de nuevo el invitado trae otro id,
    // asi que ese saldo ya no le servia a nadie. Ponerlo en cero evita que se
    // junte basura.
    try{ await conTiempo(setDoc(doc(base, "puntosUsuarios", yo.id), { balance: 0 }, { merge: true }), 10000); }catch(e){}
    quitado = true;
    }
  }catch(e){}
  const ok = restaurar();
  return ok || quitado;
}

// ---------- base de datos ----------

// Si la red se queda colgada, no dejamos la pantalla esperando.
function conTiempo(promesa, ms){
  return Promise.race([
    promesa,
    new Promise((_, rechazar)=>setTimeout(()=>rechazar(new Error("timeout")), ms))
  ]);
}

function appActual(){
  const cfg = resolverFirebase(firebaseConfigBase);
  if(!cfg || !cfg.projectId) return null;
  try{ return getApp("invitado"); }
  catch(e){ try{ return initializeApp(cfg, "invitado"); }catch(x){ return null; } }
}
function dbInvitado(){
  try{ const a = appActual(); return a ? getFirestore(a) : null; }catch(e){ return null; }
}

/** La base que está configurada ahora mismo (la del anfitrión si eres invitado). */
export function dbActual(){
  try{ return getFirestore(getApp()); }catch(e){ return dbInvitado(); }
}

/** Tu id de usuario ahora mismo. */
export function miIdInvitado(){
  try{
    const yo = JSON.parse(localStorage.getItem(CLAVE_LOCAL) || "null");
    return (yo && yo.id) || "";
  }catch(e){ return ""; }
}

// =====================================================
//  INVITACIONES — el punto único donde se anuncian las
//  partidas que aceptan invitados.
//
//  Un juego NO tiene que saber nada de la sala: solo publica
//  su invitación y la retira cuando acaba. La sala escucha y
//  avisa. Así cada juego nuevo con invitados se conecta aquí
//  sin copiar lógica de nadie.
//
//  Documento: invitaciones/{idDelJuego}, en la base de la
//  pareja. Un documento por juego, no una lista que crezca.
// =====================================================
export const COLECCION_INV = "invitaciones";

/** La sala escucha. Entrega la lista de partidas a las que te invitaron. */
export function vigilarInvitaciones(hooks){
  const h = hooks || {};
  const db = dbActual();
  if(!db) return function(){ try{ h.cambio && h.cambio([]); }catch(e){} };
  let parar = null;
  let ultimo = 0;
  try{
    parar = onSnapshot(collection(db, COLECCION_INV), async (snap)=>{
      const marca = ++ultimo;
      const candidatas = [];
      try{
        const yo = miIdInvitado();
        snap.forEach(d=>{
          const v = d.data();
          if(!v || v.activa !== true) return;
          const partes = Array.isArray(v.participantes) ? v.participantes : null;
          if(partes && partes.length && yo && partes.indexOf(yo) < 0) return;
          candidatas.push(v);
        });
      }catch(e){}

      // Un aviso solo vale si LA PARTIDA QUE LO PUBLICO SIGUE VIVA.
      // El aviso es un documento aparte; sin esta comprobacion se quedaba
      // pegado (de una prueba anterior, o de una partida que se cerro sin
      // retirarlo) y le salia a quien llegara a la sala. Cada juego dice cual
      // es su documento de partida en el campo "sesion".
      const mias = [];
      for(const v of candidatas){
        // Sin "sesion" no hay forma de comprobar que la partida viva: NO se
        // muestra. Es lo que descarta los avisos viejos (de antes de existir
        // este campo), que si no se quedarian pegados para siempre.
        if(!v.sesion) continue;
        try{
          const p = String(v.sesion).split("/");
          const sd = await getDoc(doc(db, p[0], p[1]));
          const s = sd.exists() ? sd.data() : null;
          if(!s || s.activa !== true) continue;          // la partida ya no esta
          if(v.sid && s.sid && v.sid !== s.sid) continue; // es otra partida
        }catch(e){ continue; }
        mias.push(v);
      }
      if(marca !== ultimo) return;   // llego una actualizacion mas nueva
      try{ h.cambio && h.cambio(mias); }catch(e){}
    }, ()=>{ try{ h.cambio && h.cambio([]); }catch(e){} });
  }catch(e){}
  return function(){ try{ if(parar) parar(); }catch(e){} };
}

/**
 * Un juego anuncia que hay partida. La escribe una vez y la retira al acabar.
 * No necesita saber si alguien la vio.
 */
export async function publicarInvitacion(info){
  const i = info || {};
  if(!i.juego) return;
  try{
    const db = dbActual();
    if(!db) return;
    await setDoc(doc(db, COLECCION_INV, i.juego), {
      juego: i.juego,
      titulo: i.titulo || "",
      icono: i.icono || "",
      ruta: i.ruta || "",
      hostUid: i.hostUid || "",
      hostNombre: i.hostNombre || "",
      participantes: Array.isArray(i.participantes) ? i.participantes : [],
      // Donde vive la partida (ej. "sesionEncuentros/actual"). La sala la lee
      // para no mostrar avisos de partidas que ya no estan.
      sesion: i.sesion || "",
      activa: true,
      // En pausa no se puede entrar, pero la partida SIGUE EXISTIENDO. Por eso
      // no se retira el aviso (eso haria creer a la sala que se acabo y
      // expulsaria al invitado): solo se marca en pausa.
      pausada: false,
      sid: i.sid || "",
      actualizadaEn: serverTimestamp()
    }, { merge: true });
  }catch(e){}
}

/**
 * Un juego pausado: la partida sigue viva pero no se puede entrar.
 * Si se retirara el aviso, la sala creeria que la partida termino.
 */
export async function pausarInvitacion(juego, enPausa){
  if(!juego) return;
  try{
    const db = dbActual();
    if(!db) return;
    await setDoc(doc(db, COLECCION_INV, juego), {
      pausada: !!enPausa,
      actualizadaEn: serverTimestamp()
    }, { merge: true });
  }catch(e){}
}

/** El juego terminó: la sala lo ve al instante y expulsa a los invitados. */
export async function retirarInvitacion(juego){
  if(!juego) return;
  try{
    const db = dbActual();
    if(!db) return;
    await setDoc(doc(db, COLECCION_INV, juego), {
      activa: false,
      actualizadaEn: serverTimestamp()
    }, { merge: true });
  }catch(e){}
}