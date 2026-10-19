// =====================================================
//  CONFIG COMPARTIDA — Citas de Pareja (template)
//  Prioridad: 1) Asistente (localStorage)  2) firebase-config.js
//  Compatible con futura capa multi-pareja: los usuarios
//  viven en Firestore `config/ajustes` ({usuarios:[...]}),
//  con copia local y JSON como respaldos.
// =====================================================

import {
  doc, getDoc, setDoc, collection, getDocs, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

export const CLAVE_CONFIG = "pareja_config";
export const CLAVE_USUARIOS = "pareja_usuarios";

export const PH = {
  token: "PON_AQUI_TU_TOKEN",
  chat: "PON_AQUI_TU_CHAT_ID",
  app: "PON_AQUI_URL_DE_TU_APP/",
};

function leerJSON(clave){
  try{
    const t = localStorage.getItem(clave);
    return t ? JSON.parse(t) : null;
  }catch(e){ return null; }
}

export function leerConfigGuardada(){
  return leerJSON(CLAVE_CONFIG);
}

export function guardarConfig(cfg){
  localStorage.setItem(CLAVE_CONFIG, JSON.stringify(cfg));
}

/** Firebase efectivo: lo guardado manda; si no, la base del repo. */
export function resolverFirebase(base){
  const g = leerConfigGuardada();
  return (g && g.firebase) ? g.firebase : base;
}

/** Telegram efectivo: lo guardado manda; si no, placeholders (avisos apagados). */
export function resolverTelegram(){
  const g = leerConfigGuardada();
  if(g && g.telegram) return g.telegram;
  return { token: PH.token, chat: PH.chat };
}

/**
 * Un reto vive hasta el FINAL de su último día, no a la misma hora en que se
 * propuso. Antes se vencía con `ahora + días × 86400000`, o sea a la misma hora,
 * y como la meta de un reto es "veces × días", quedaban unas horas menos de las
 * que la cuenta prometía: 2 al día durante 7 días pedía 14 puntos pero había 6
 * días completos y un medio. Peor: a las 11 de la noche sí se alcanzaba y a las
 * 4 de la tarde no. Dependía de la hora en que se apretó el botón.
 *
 * Con esto "7 días" son 7 días de verdad, sin importar la hora. Vive aquí y no
 * en cada juego porque Retos/ y Acompanante/ lo necesitan.
 */
export function finDeUltimoDia(base, dias){
  const f = new Date(base.getTime());
  f.setHours(23, 59, 59, 999);
  f.setDate(f.getDate() + (dias - 1));
  return f;
}

/** Raíz de la app calculada de la URL actual (sirve en Pages, local y file). */
export function baseUrl(){  try{
    let u = location.href.split("?")[0].split("#")[0];
    u = u.replace(/[^/]+\.html?$/i, "");
    if(!/\/$/.test(u)) u += "/";
    // Todas las pantallas viven a UN nivel: /Carpeta/index.html. Se quita la
    // ultima carpeta de la RUTA. Antes solo se quitaba si se llamaba Citas o
    // Retos, y desde Chat/, Acompanante/... el enlace quedaba apuntando a una
    // carpeta que no existe (el boton "Abrir" del Telegram no abria nada).
    //
    // OJO: hay que separar el dominio de la ruta ANTES de quitar nada. Si se
    // intenta con una regla normal, "https://app.com/" tambien parece una
    // carpeta y se comeria el dominio.
    const m = u.match(/^([a-z]+:\/\/[^/]*\/)(.*)$/i);
    if(m && m[2]){
      const padre = m[2].split("/").filter(x=> x.length).slice(0, -1);
      u = m[1] + (padre.length ? padre.join("/") + "/" : "");
    }
    return u;
  }catch(e){ return PH.app; }
  }

/** Usuarios: copia local rápida del asistente. */
export function guardarUsuariosLocal(usuarios){
  try{ localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios)); }catch(e){}
}

export function leerUsuariosLocal(){
  const u = leerJSON(CLAVE_USUARIOS);
  return Array.isArray(u) && u.length ? u : null;
}

/** Lee usuarios en orden: Firestore ajustes > local > JSON dado. Nunca revienta. */
export async function cargarUsuarios(db, getDocFn, docFn, respaldoJSON){
  // 1) Firestore (con tope para no colgar sin config)
  try{
    const snap = await conTiempo(getDocFn(docFn(db, "config", "ajustes")), 8000);
    const arr = snap.exists() ? snap.data().usuarios : null;
    if(Array.isArray(arr) && arr.length){
      guardarUsuariosLocal(arr);
      return arr;
    }
  }catch(e){}
  // 2) copia local del asistente
  const loc = leerUsuariosLocal();
  if(loc) return loc;
  // 3) JSON del repo
  return respaldoJSON;
}

function conTiempo(promesa, ms){
  return Promise.race([
    promesa,
    new Promise((_, rechazar)=>setTimeout(()=>rechazar(new Error("timeout")), ms))
  ]);
}

// =====================================================
//  INSTALADOR DE FABRICA
//  Que pasa: al empezar el proyecto el contenido inicial se metio en archivos
//  del repo (actividades.json / accesorios.json) y las pantallas los mezclaban
//  con lo de la pareja en CADA carga. Como lo de fabrica no estaba en la base,
//  no se podia renombrar ni borrar: reaparecia al instante.
//  Que se hace ahora: esos JSON son solo el INSTALADOR. La primera vez se copian
//  a la base de la pareja y a partir de ahi manda la base, asi que todo --
//  tambien lo de fabrica-- se puede renombrar y borrar de verdad.
//  Como no se repite: la banderita config/fabrica guarda QUE nombres de fabrica
//  ya se instalaron. Si borras uno, no vuelve a aparecer, porque su nombre sigue
//  anotado como instalado. Si despues el repo agrega una actividad nueva a
//  actividades.json, esa si entra (no estaba en la lista de instalados).
// =====================================================

// Sube esto solo si cambia de verdad el contenido de los JSON del repo.
export const VERSION_FABRICA = 1;

function normFab(s){
  return (s || "").trim().toLowerCase();
}

function comoLista(v){
  return Array.isArray(v) ? v.filter(x=>x) : [];
}

/**
 * Instala lo de fabrica que falte y anota que ya quedo.
 * @param yaInstalados  Set con los nombres de fabrica ya puestos (no se repiten)
 * @param yaEnBase      Set con los nombres que ya existen en la base
 * @returns {Promise<boolean>} true si hay que guardar la banderita
 */
async function sembrarColeccion(items, yaInstalados, yaEnBase, docNuevo){
  let cambios = false;
  for(const n of items){
    const k = normFab(n);
    if(!k) continue;
    // Ya se instalo antes (puede que despues lo hayas borrado): no se toca.
    if(yaInstalados.has(k)) continue;
    // Ya lo tenias tu de antes: se anota como instalado y no se duplica.
    if(yaEnBase.has(k)){
      yaInstalados.add(k);
      cambios = true;
      continue;
    }
    await docNuevo(n);
    yaEnBase.add(k);
    yaInstalados.add(k);
    cambios = true;
  }
  return cambios;
}

async function nombresEnBase(db, nombreCol){
  const out = new Set();
  try{
    const snap = await getDocs(collection(db, nombreCol));
    snap.forEach(d=>{
      const n = d.data().nombre;
      if(n) out.add(normFab(n));
    });
  }catch(e){}
  return out;
}

/**
 * Deja la fabrica en la base, una unica vez.
 * Importa solo lo que falte, nunca borra nada y nunca pisa lo tuyo.
 * @param db       Firestore de la pareja
 * @param fabrica  {actividades:[...], accesorios:[...]} leido de los JSON
 * @returns {Promise<boolean>} true  = la base ya es duena del contenido
 *                           false = no se pudo (sin permiso o sin conexion);
 *                                   en ese caso la pantalla mantiene el JSON
 *                                   como lista de respaldo y nada se rompe.
 */
export async function asegurarFabrica(db, fabrica){
  const acts = Array.isArray(fabrica && fabrica.actividades) ? fabrica.actividades : [];
  const accs = Array.isArray(fabrica && fabrica.accesorios) ? fabrica.accesorios : [];
  try{
    const bandera = await getDoc(doc(db, "config", "fabrica"));
    const prev = bandera.exists() ? (bandera.data() || {}) : {};

    const instaladosActs = new Set(comoLista(prev.actividades).map(normFab));
    const instaladosAccs  = new Set(comoLista(prev.accesorios).map(normFab));

    const yaAct = await nombresEnBase(db, "actividadesExtra");
    const yaAcc = await nombresEnBase(db, "accesoriosExtra");

    let cambios = false;
    if(acts.length && await sembrarColeccion(acts, instaladosActs, yaAct,
        n => addDoc(collection(db, "actividadesExtra"), { nombre: n, origen: "fabrica" }))){
      cambios = true;
    }
    if(accs.length && await sembrarColeccion(accs, instaladosAccs, yaAcc,
        n => addDoc(collection(db, "accesoriosExtra"), { nombre: n, origen: "fabrica" }))){
      cambios = true;
    }

    // Solo se escribe si algo cambio o si la banderita no existia: ya instalado,
    // no se vuelve a escribir nada en cada carga.
    if(cambios || !bandera.exists()){
      await setDoc(doc(db, "config", "fabrica"), {
        version: VERSION_FABRICA,
        fecha: serverTimestamp(),
        actividades: Array.from(instaladosActs),
        accesorios: Array.from(instaladosAccs)
      });
    }
    return true;
  }catch(e){
    return false;
  }
}

/**
 * Une la base con la fabrica SOLO mientras la siembra no ha ocurrido.
 * Si la base ya es duena (asegurarFabrica dio true), devuelve solo lo tuyo:
 * por eso un borrado se queda borrado y un renombrado no deja duplicado.
 */
export function unirConFabrica(base, fabrica){
  const salida = (Array.isArray(base) ? base.slice() : []);
  const yaHay = new Set(salida.map(normFab));
  for(const n of (Array.isArray(fabrica) ? fabrica : [])){
    const k = normFab(n);
    if(k && !yaHay.has(k)){
      yaHay.add(k);
      salida.push(n);
    }
  }
  return salida;
}

// =====================================================
//  MIGRACION: ACTIVIDADES POR ID (oct-2026)
//  Que pasa: nivelesActividad y presetsActividad se guardan con el NOMBRE de
//  la actividad como id del documento. actividadesExtra, en cambio, ya tiene
//  un id de verdad (el que da addDoc). Usar el nombre como llave obliga a
//  mover documentos cada vez que se renombra o se borra una actividad, y si
//  un nombre borrado se reutiliza, puede heredar datos de una actividad que
//  no tiene nada que ver.
//  Que se hace: copiar lo que haya guardado bajo el NOMBRE hacia el mismo
//  documento bajo el ID, sin borrar el original. Las pantallas (Guiadas,
//  Encuentros) empiezan a buscar por id; si un dato viejo todavia no se
//  copio, lo siguen encontrando por nombre como respaldo.
//  Como no se repite: la banderita config/migracionActividades guarda que
//  ids ya se revisaron, para no releer en cada carga.
// =====================================================

// Cuantas actividades se revisan A LA VEZ. No es por cuota (Firestore aguanta
// de sobra): es para que una pareja con muchas actividades no se quede
// esperando una por una, una detras de otra, la primera vez que abre la app.
const LOTE_MIGRACION = 15;

async function migrarUnaActividad(db, col, a){
  try{
    const porId = await getDoc(doc(db, col, a.id));
    if(porId.exists()) return; // ya estaba copiado, no se pisa
    const porNombre = await getDoc(doc(db, col, a.nombre));
    if(porNombre.exists()){
      await setDoc(doc(db, col, a.id), porNombre.data());
    }
  }catch(e){}
}

/**
 * Copia nivelesActividad y presetsActividad de NOMBRE a ID, una vez por
 * actividad. Nunca borra el documento viejo (sirve de respaldo y de forma de
 * volver atras a mano si algo sale mal). Revisa varias actividades a la vez
 * (de a `LOTE_MIGRACION`), para que la primera corrida no se sienta lenta
 * aunque haya cientos de actividades.
 * @param db          Firestore de la pareja
 * @param actividades [{id, nombre}] ya leido de actividadesExtra
 * @returns {Promise<boolean>} true si se pudo revisar (o no hacia falta)
 */
export async function migrarActividadesAId(db, actividades){
  try{
    const bandera = await getDoc(doc(db, "config", "migracionActividades"));
    const prev = bandera.exists() ? (bandera.data() || {}) : {};
    const yaMigrados = new Set(comoLista(prev.ids));

    const pendientes = (Array.isArray(actividades) ? actividades : [])
      .filter(a => a && a.id && a.nombre && !yaMigrados.has(a.id));

    for(let i = 0; i < pendientes.length; i += LOTE_MIGRACION){
      const lote = pendientes.slice(i, i + LOTE_MIGRACION);
      await Promise.all(lote.flatMap(a =>
        ["nivelesActividad", "presetsActividad"].map(col => migrarUnaActividad(db, col, a))
      ));
      lote.forEach(a => yaMigrados.add(a.id));
    }

    if(pendientes.length || !bandera.exists()){
      await setDoc(doc(db, "config", "migracionActividades"), {
        version: 1,
        fecha: serverTimestamp(),
        ids: Array.from(yaMigrados)
      });
    }
    return true;
  }catch(e){
    return false;
  }
}
