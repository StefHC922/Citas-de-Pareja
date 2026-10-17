// ============================================================================
//  Cuadro de confirmacion — modulo reutilizable
// ----------------------------------------------------------------------------
//  Sustituye a la ventana del sistema (confirm/alert). Aquella era la UNICA
//  pantalla de la app que no usaba el diseno propio: salia la cajita gris del
//  navegador, con los botones del sistema, y se veia ajena al resto.
//
//      import { confirmar, aviso } from "../confirmar.js";
//
//      if(!await confirmar({
//        aviso:true,
//        titulo:"¿Eliminar a Mary?",
//        texto:"No se puede deshacer.",
//        ok:"Eliminar"
//      })) return;
//
//      await aviso("Sin conexión. Se jugará en este celular.");
//
//  Que acepta:
//    aviso  - true: circulito con ⚠️ arriba. Por omision false, para lo que da
//             algo y no borra.
//    titulo - la pregunta, en grande. Obligatorio.
//    texto  - la consecuencia, debajo, chiquita. Opcional.
//    ok     - el boton de adelante. Por omision "Aceptar".
//  El boton de atras siempre se llama "Cancelar".
//
//  Notas:
//   - El texto entra SIEMPRE con `textContent`, nunca con `innerHTML`: varios de
//     estos textos traen nombres, correos o accesorios que vienen de Firebase.
//   - Va en Z 95: encima de los modales normales (60) y de los fuegos (70).
//   - Si se pide otra confirmacion mientras esta abierta, la anterior se cierra
//     como "no": nunca quedan dos encimadas.
//   - Los colores se piden con `--card` y se caeen a `--tarjeta` (y asi con los
//     demas), porque cada pantalla les puso un nombre distinto y Diablitos usa la
//     otra serie.
// ============================================================================

const ESTILO = `
.cfCapa{ position:fixed; inset:0; z-index:95; background:rgba(0,0,0,.6);
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding:20px; }
.cfCaja{ width:100%; max-width:380px; text-align:center;
  background:var(--card, var(--tarjeta)); border:1px solid var(--teal);
  border-radius:16px; padding:22px 20px; }
.cfAviso{ width:44px; height:44px; border-radius:50%; margin:0 auto 12px;
  border:1px solid var(--coral); color:var(--coral);
  display:flex; align-items:center; justify-content:center; font-size:1.3rem; }
.cfTitulo{ font-family:'Chakra Petch',sans-serif; font-weight:700;
  font-size:1.1rem; line-height:1.4; color:var(--fg, var(--texto)); }
.cfTexto{ font-size:.85rem; line-height:1.5; margin-top:8px;
  color:var(--fg-muted, var(--apagado)); }
.cfOk{ width:100%; margin-top:16px; padding:16px; margin-bottom:10px; border:none;
  border-radius:16px; cursor:pointer; font-family:'Chakra Petch',sans-serif;
  font-weight:700; font-size:1.05rem; color:var(--bg, var(--fondo));
  background:linear-gradient(90deg, var(--coral), var(--teal)); }
.cfOk:active, .cfNo:active{ transform:scale(.97); }
.cfNo{ width:100%; padding:12px; background:none; border:none; cursor:pointer;
  font-family:inherit; font-size:.9rem; text-decoration:underline;
  color:var(--fg-muted, var(--apagado)); }
`;

let estiloPuesto = false;
let capa = null;
let resolverActual = null;

function ponerEstilo(){
  if(estiloPuesto || typeof document === "undefined") return;
  estiloPuesto = true;
  const e = document.createElement("style");
  e.textContent = ESTILO;
  document.head.appendChild(e);
}

function cerrar(quanto){
  if(resolverActual){ const r = resolverActual; resolverActual = null; r(quanto); }
  if(capa){ capa.remove(); capa = null; }
}

export function confirmar(op){
  return abrir(op || {}, true);
}

// Aviso sin pregunta: sale para decir UNA cosa, y no hay nada que cancelar.
// Adentro siempre va el circulito ⚠️. Acepta un texto suelto o {titulo, texto}.
export function aviso(op){
  const o = (typeof op === "string") ? { titulo: op } : (op || {});
  o.aviso = true;
  return abrir(o, false);
}

function abrir(o, conCancelar){
  ponerEstilo();
  // Nunca dos cajas encimadas: la que estaba abierta se cierra como "no".
  cerrar(false);

  return new Promise((resolve)=>{
    resolverActual = resolve;

    const c = document.createElement("div");
    c.className = "cfCapa";

    const caja = document.createElement("div");
    caja.className = "cfCaja";

    // El circulito va DENTRO de la caja, arriba del titulo. Si se colgara como
    // hermano de la caja se pondrian de lado y la caja se iba a la derecha.
    if(o.aviso){
      const av = document.createElement("div");
      av.className = "cfAviso";
      av.textContent = "⚠️";
      caja.appendChild(av);
    }

    const t = document.createElement("div");
    t.className = "cfTitulo";
    t.textContent = o.titulo || "";
    caja.appendChild(t);

    if(o.texto){
      const x = document.createElement("div");
      x.className = "cfTexto";
      x.textContent = o.texto;
      caja.appendChild(x);
    }

    const si = document.createElement("button");
    si.type = "button";
    si.className = "cfOk";
    si.textContent = o.ok || (conCancelar ? "Aceptar" : "Entendido");
    si.onclick = ()=>cerrar(true);
    caja.appendChild(si);

    if(conCancelar){
      const no = document.createElement("button");
      no.type = "button";
      no.className = "cfNo";
      no.textContent = "Cancelar";
      no.onclick = ()=>cerrar(false);
      caja.appendChild(no);
    }

    c.appendChild(caja);
    document.body.appendChild(c);
    capa = c;
  });
}