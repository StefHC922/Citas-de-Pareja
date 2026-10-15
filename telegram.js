// ============================================================================
//  Avisos por Telegram  (modulo compartido, oct-2026)
// ----------------------------------------------------------------------------
//  Antes esta funcion estaba COPIADA en 5 archivos y ya se habian deformado:
//  eran 4 versiones distintas, y la de `Retos/centro.html` se tragaba los
//  errores. Eso importa por una razon muy concreta: un token malo responde
//  HTTP 200 con `ok:false`, o sea que el `fetch` NO falla nunca. Sin revisar la
//  respuesta, la funcion creia que el aviso salio y se perdia en silencio.
//
//      import { avisarTelegram } from "./telegram.js";    // en la raiz
//      import { avisarTelegram } from "../telegram.js";   // en una carpeta
//      await avisarTelegram("Ya llegaste", "https://.../Retos/");
//
//  Lo que hace:
//   - Si no hay token o chat ID (o siguen siendo los de ejemplo), no hace nada.
//   - Si le pasas una `url`, manda un boton "Abrir" debajo del texto.
//   - Si Telegram RECHAZA el aviso, guarda la razon en el celular con la llave
//     `pareja_tg_error`. OJO: no cambiar esa llave, porque el engrane de Telegram
//     la lee para poder mostrar por que no llegan los avisos.
//   - Nunca lanza: un fallo aqui no debe tumbar la pantalla que lo llamo.
// ============================================================================

import { resolverTelegram } from "./config.js";

// Misma llave de siempre (oct-2026). Si se cambia, el engrane de Telegram deja
// de poder mostrar los errores.
export const CLAVE_TG_ERROR = "pareja_tg_error";

/**
 * Manda un aviso por Telegram. Devuelve una promesa que nunca rechaza.
 * @param texto  lo que se lee en el chat de Telegram
 * @param url    (opcional) donde debe llevar el boton "Abrir"
 */
export async function avisarTelegram(texto, url){
  try{
    // El token se lee EN CADA LLAMADA, no al cargar el modulo: se puede cambiar
    // desde el engrane de Telegram y asi el cambio sirve de inmediato, sin
    // tener que recargar. Es el mismo criterio que `miProyecto()` en acceso.js.
    const tg = resolverTelegram() || {};
    const token = tg.token;
    const chat = tg.chat;
    if(!token || !chat) return;
    // Los de ejemplo ("PON_AQUI...") no son llaves: si siguen puestos, no hay
    // nada configurado y no se intenta nada.
    if(String(token).indexOf("PON_AQUI") === 0) return;
    if(String(chat).indexOf("PON_AQUI") === 0) return;

    const cuerpo = { chat_id: chat, text: texto };
    if(url) cuerpo.reply_markup = { inline_keyboard: [[{ text: "Abrir 👀", url: url }]] };

    const r = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    }).then(x=>x.json());

    // Un token/chat ID malo responde 200 con ok:false: hay que leerlo, o el
    // aviso se pierde sin que nadie sepa por que.
    if(r && r.ok === false) throw new Error(r.description || "Telegram rechazo el aviso");
  }catch(e){
    try{ localStorage.setItem(CLAVE_TG_ERROR, String((e && e.message) || e)); }catch(x){}
  }
}