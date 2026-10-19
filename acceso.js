// =====================================================
//  ACCESOS — lógica compartida de licencias y taquilla
//  Este archivo es el ÚNICO lugar donde se decide qué tiene
//  un usuario. Antes esa lógica estaba copiada en el índice,
//  la Tienda, Guiadas y Encuentros, con la misma consulta
//  escrita 7 veces. Ahora las páginas la importan de aquí.
//  Este refactor NO cambia el comportamiento: solo-centraliza.
// =====================================================
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import firebaseConfigBase from "./firebase-config.js";
import { resolverFirebase } from "./config.js";
import { TAQUILLA_FIREBASE, verificarCodigo } from "./taquilla.js";

// Clave de localStorage donde viven los códigos firmados, indexados por item.
export const CLAVE_LIC = "licencias";
// Nombre de la instancia de Firebase para la base de la taquilla.
const APP_TAQ = "taquilla";
const COLECCION_SOL = "solicitudes";
// Sin tope a propósito. Las consultas leen TODAS las solicitudes de la pareja.
// Antes había un tope de 30, pero sin orderBy Firebase devolvía las 30 más
// ANTIGUAS, así que las aprobaciones y revocaciones nuevas quedaban fuera y no
// se aplicaban (el usuario se quedaba bloqueado, o el revocado seguía jugando).
// La lista no crece sola: hay un documento por (pareja + producto + correo),
// así que traerla completa son unas decenas de documentos, no miles.

// ---------- quién está mirando ----------

// Mientras la identidad diga "invitado", la configuración del teléfono es la
// del anfitrión. El catálogo que se escucha entonces es el DE ÉL, y guardar
// ahí sus códigos de acceso sería poner el producto comercial en un teléfono
// prestado. Mientras seas invitado no se guarda ningún código nuevo.
function soyInvitadoAhora(){
  try{
    const yo = JSON.parse(localStorage.getItem("appPareja_quienSoy") || "null");
    return !!(yo && yo.invitado);
  }catch(e){ return false; }
}

// ---------- proyectos y conexión ----------

// ProjectId de la pareja. Se lee en cada llamada y no al cargar el módulo
// porque el Asistente puede escribir el config en localStorage después de
// que la página ya se haya cargado.
export function miProyecto(){
  try{ return resolverFirebase(firebaseConfigBase).projectId || ""; }catch(e){ return ""; }
}

// Instancia de la base de taquilla, creada una sola vez.
export function appTaq(){
  try{ return getApp(APP_TAQ); }
  catch(e){ return initializeApp(TAQUILLA_FIREBASE, APP_TAQ); }
}

function dbTaq(){ return getFirestore(appTaq()); }

// Compara correos sin depender de mayúsculas ni espacios.
function mismoEmail(a, b){
  return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
}

// ---------- códigos en el teléfono ----------

// Lee todos los códigos guardados: { [item]: "codigo.firma" }
export function leerLicencias(){
  try{ return JSON.parse(localStorage.getItem(CLAVE_LIC) || "{}"); }
  catch(e){ return {}; }
}

// Sobrescribe el objeto completo de códigos.
export function guardarLicencias(obj){
  try{ localStorage.setItem(CLAVE_LIC, JSON.stringify(obj || {})); }catch(e){}
}

// Guarda un código para un item.
export function guardarLicencia(item, cod){
  const lic = leerLicencias();
  lic[item] = String(cod || "").trim();
  guardarLicencias(lic);
}

// Borra el código de un item. No toca los demás.
export function quitarLicencia(item){
  const lic = leerLicencias();
  if(!(item in lic)) return;
  delete lic[item];
  guardarLicencias(lic);
}

// ---------- verificación ----------

// ¿El código guardado es válido para este item y para esta pareja?
// Verifica firma, item, para y vencimiento (no revocación: eso vive en
// la base, se revisa con escucharItem / escucharCatalogo).
export async function tieneCodigoValido(item){
  const cod = leerLicencias()[item];
  if(!cod) return false;
  const pay = await verificarCodigo(cod);
  return !!(pay && pay.item === item && pay.para === miProyecto());
}

// Atajo: ¿esta persona tiene acceso a este item?
export async function tengoAcceso(item){
  try{ return await tieneCodigoValido(item); }catch(e){ return false; }
}

// Packs oficiales que esta persona ya tiene autorizados.
// Se usa para traer actividades oficiales al banco de la pareja.
export async function oficialesAprobados(){
  const out = [];
  try{
    const lic = leerLicencias();
    const snap = await getDocs(collection(dbTaq(), "packs"));
    for(const d of snap.docs){
      const p = Object.assign({ id: d.id }, d.data());
      if(!p.oficial || p.activo === false) continue;
      const cod = lic[p.id];
      if(!cod) continue;
      const pay = await verificarCodigo(cod);
      if(pay && pay.item === p.id && pay.para === miProyecto()) out.push(p);
    }
  }catch(e){}
  return out;
}

// ---------- escuchas ----------

// Los documentos llegan sin orden de Firebase, así que aquí se ordenan
// por fecha. De más reciente a más antiguo.
function ordenarPorFecha(docs){
  return docs.slice().sort((a, b)=>{
    const fa = a.data().fecha, fb = b.data().fecha;
    const ta = fa && fa.toDate ? fa.toDate().getTime() : 0;
    const tb = fb && fb.toDate ? fb.toDate().getTime() : 0;
    return tb - ta;
  });
}

function consultaSolicitudes(){
  return query(collection(dbTaq(), COLECCION_SOL),
    where("para", "==", miProyecto()));
}

// ¿Qué del catálogo está NUEVO y todavía no se ha pedido?
// Alimenta el punto rojo del carrito (menú) y el distintivo NUEVO de las
// secciones del Centro. "Nuevo" son DOS condiciones juntas (decidido por Fredy,
// oct-2026):
//   1) el pack trae fecha "Nuevo hasta" VIVA, y
//   2) TODAVÍA no se ha pedido: no hay solicitud suya en estado pendiente ni
//      aprobado. Revocada o negada NO cuentan, para que se pueda volver a pedir.
// Recibe la lista de packs (cada uno con id, nuevoHasta y seccion) y devuelve
// un objeto { idDelPack: true } con los que cumplen las dos.
// Nunca lanza: sin conexión devuelve vacío (mejor no avisar que romper).
export async function nuevosSinPedir(packs){
  const out = {};
  try{
    const snap = await getDocs(consultaSolicitudes());
    const pedidos = {};
    snap.forEach(dd=>{
      const s = dd.data() || {};
      const est = s.estado || "pendiente";
      if(est === "revocado" || est === "negado") return;
      if(s.item) pedidos[s.item] = true;
    });
    (packs || []).forEach(p=>{
      if(!p || !p.id) return;
      if(p.libre || p.oficial) return;          // los fijos no son del catálogo
      if(pedidos[p.id]) return;                  // ya se pidió
      const t = p.nuevoHasta && p.nuevoHasta.toDate ? p.nuevoHasta.toDate().getTime() : 0;
      if(t && Date.now() < t) out[p.id] = true;  // sigue siendo nuevo por fecha
    });
  }catch(e){}
  return out;
}

// Escucha UN item (el de esta página).
// Es lo que usan Guiadas y Encuentros: una sola vez que el admin aprueba,
// la app guarda el código sola; y si te revocan, te lo quita.
// Devuelve la función para cancelar la escucha.
//   hooks.revocado()  → me revocaron: la página muestra el bloqueo
//   hooks.aprobado()   → me aprobaron: la página entra
export function escucharItem(item, hooks){
  const h = hooks || {};
  let parar = null;
  try{
    parar = onSnapshot(consultaSolicitudes(), async (snap)=>{
      const docs = ordenarPorFecha(snap.docs);

      // 1) ¿Revocaron el código que tengo guardado ahora mismo?
      try{
        const cod = leerLicencias()[item];
        if(cod){
          const mio = await verificarCodigo(cod);
          if(mio){
            const rev = docs.find(d=>{
              const s = d.data();
              return s.item === item
                && mismoEmail(s.email, mio.email)
                && (s.estado === "revocado" || s.estado === "negado");
            });
            if(rev){
              quitarLicencia(item);
              try{ if(parar) parar(); }catch(e){}
              try{ h.revocado && h.revocado(); }catch(e){}
              return;
            }
          }
        }
      }catch(e){}

      // 2) ¿Hay una aprobación mía para este item?
      for(const d of docs){
        const s = d.data();
        if(s.item !== item || s.estado !== "aprobado" || !s.codigo) continue;
        const pay = await verificarCodigo(s.codigo);
        if(pay && pay.item === item && pay.para === miProyecto()){
          guardarLicencia(item, s.codigo);
          try{ if(parar) parar(); }catch(e){}
          try{ h.aprobado && h.aprobado(); }catch(e){}
          return;
        }
      }
    }, ()=>{});
  }catch(e){}
  return function(){ try{ if(parar) parar(); }catch(e){} };
}

// Revisa TODO el catálogo de una sola vez. Es lo que usan el índice (para
// quitar la tarjeta del menú) y la Tienda (para marcar "ya tienes").
//   hooks.cambio(licencias)  → el objeto de códigos cambió: redibujar
export function escucharCatalogo(hooks){
  const h = hooks || {};
  let parar = null;
  try{
    parar = onSnapshot(consultaSolicitudes(), async ()=>{
      const antes = JSON.stringify(leerLicencias());
      const lic = leerLicencias();
      let cambio = false;
      let snap;
      try{ snap = await getDocs(consultaSolicitudes()); }
      catch(e){ return; }
      const docs = ordenarPorFecha(snap.docs);
      // De visita: se revisa lo del anfitrión pero NO se guarda nada suyo en
      // este teléfono. Al salir de invitado, restaurar() deja las licencias
      // como estaban, así que aquí tampoco se borra nada propio.
      const deVisita = soyInvitadoAhora();

      for(const d of docs){
        const s = d.data();

        // Revocado/negado: quitar los códigos locales de ese correo+item.
        if((s.estado === "revocado" || s.estado === "negado") && s.email){
          try{
            for(const k of Object.keys(lic)){
              const pay = await verificarCodigo(lic[k]);
              if(pay && mismoEmail(pay.email, s.email) && pay.item === s.item){
                delete lic[k];
                cambio = true;
              }
            }
          }catch(e){}
          continue;
        }

        // Aprobado: guardar el código si no hay uno válido para ese item.
        if(deVisita) continue;
        if(s.estado !== "aprobado" || !s.codigo) continue;
        const pay = await verificarCodigo(s.codigo);
        if(pay && pay.para === miProyecto()
          && !(lic[pay.item] && (await verificarCodigo(lic[pay.item])))){
          lic[pay.item] = String(s.codigo).trim();
          cambio = true;
        }
      }

      if(cambio || JSON.stringify(lic) !== antes){
        guardarLicencias(lic);
        if(cambio){ try{ h.cambio && h.cambio(lic); }catch(e){} }
      }
    }, ()=>{});
  }catch(e){}
  return function(){ try{ if(parar) parar(); }catch(e){} };
}

// Mapa de cortesías disponibles: "item|email" -> true.
// Se usa para mostrar en el menú a los que ya vencieron su acceso pero
// tienen una cortesía sin usar. La consume el índice.
export async function graciasDisponibles(){
  const out = {};
  try{
    const miId = miProyecto();
    if(!miId) return out;
    const snap = await getDocs(query(collection(dbTaq(), COLECCION_SOL),
      where("para", "==", miId)));
    snap.forEach(d=>{
      const s = d.data();
      if(s.estado === "aprobado" && s.graciaUsada === false && s.item){
        out[s.item + "|" + String(s.email || "").toLowerCase()] = true;
      }
    });
  }catch(e){}
  return out;
}