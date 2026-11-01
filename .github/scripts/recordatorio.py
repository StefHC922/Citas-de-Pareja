"""Recordatorio de la mañana para App Pareja.
Lee citas y retos de Firestore, liquida vencidos y manda un
resumen a Telegram. Sin dependencias externas (solo stdlib).

Env:
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (requeridos para enviar)
  MODO_PRUEBA=1 -> no escribe ni envia, solo imprime.
"""
import json
import os
import sys
import urllib.request
import urllib.parse
from datetime import datetime, timedelta, timezone

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

TZ = timezone(timedelta(hours=-6))  # hora centro MX (sin horario de verano)
PROJECT = "TU_PROYECTO"  # Paso 3 del README
API_KEY = "TU_API_KEY"  # la de tu firebase-config.js (Paso 3 del README)
BASE = "https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents" % PROJECT
TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
CHAT = os.environ.get("TELEGRAM_CHAT_ID", "")
DRY = os.environ.get("MODO_PRUEBA", "0") == "1"


def http(url, data=None, method="GET"):
    req = urllib.request.Request(
        url + ("&key=" + API_KEY if "?" in url else "?key=" + API_KEY),
        data=json.dumps(data).encode() if data is not None else None,
        headers={
            "Content-Type": "application/json",
            # La llave API exige referer del sitio (restriccion web). Sin esto
            # Google responde 403 y el recordatorio no sale.
            "Referer": "PON_AQUI_URL_DE_TU_APP/"  # tu URL de Pages, con / al final (Paso 4),
        },
        method=method,
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def val(v):
    if not isinstance(v, dict) or len(v) != 1:
        return v
    k, x = next(iter(v.items()))
    if k == "stringValue":
        return x
    if k == "integerValue":
        return int(x)
    if k == "doubleValue":
        return float(x)
    if k == "booleanValue":
        return x
    if k == "nullValue":
        return None
    if k == "timestampValue":
        return x
    if k == "arrayValue":
        return [val(e) for e in x.get("values", [])]
    if k == "mapValue":
        return {kk: val(vv) for kk, vv in x.get("fields", {}).items()}
    return x


def docs(col):
    out = []
    try:
        data = http("%s/%s?pageSize=300" % (BASE, col))
    except Exception as e:
        print("ERROR leyendo %s: %s" % (col, e))
        return out
    for d in data.get("documents", []):
        item = {"_id": d["name"].split("/")[-1], "_ts": d.get("updateTime")}
        for k, v in d.get("fields", {}).items():
            item[k] = val(v)
        out.append(item)
    return out


def parse_ts(s):
    try:
        return datetime.fromisoformat(str(s).replace("Z", "+00:00"))
    except Exception:
        return None


def nombre(u):
    return (u or {}).get("nombre", "?") if isinstance(u, dict) else "?"


def enviar_telegram(texto):
    if DRY:
        print("--- MENSAJE (no enviado, MODO_PRUEBA) ---")
        print(texto)
        return True
    if not TOKEN or not CHAT:
        print("Falta TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID")
        return False
    try:
        http(
            "https://api.telegram.org/bot%s/sendMessage" % TOKEN,
            {"chat_id": CHAT, "text": texto},
            "POST",
        )
        return True
    except Exception as e:
        print("ERROR enviando a Telegram: %s" % e)
        return False


def main():
    ahora = datetime.now(TZ)
    hoy = ahora.strftime("%Y-%m-%d")
    print("Fecha: %s (hora centro)" % ahora.strftime("%Y-%m-%d %H:%M"))

    citas = docs("citas")
    retos = docs("retos")

    # --- citas de hoy ---
    de_hoy = [
        c for c in citas
        if str(c.get("fechaCita", ""))[:10] == hoy and c.get("estado") in ("pendiente", "confirmada")
    ]

    def fecha_corta(f):
        try:
            d = datetime.fromisoformat(str(f).replace("Z", "+00:00"))
            return d.strftime("%H:%M")
        except Exception:
            return str(f)[:16]

    # --- retos vigentes y propuestos ---
    en_curso = [r for r in retos if r.get("estado") == "enCurso"]
    propuestas = [r for r in retos if r.get("estado") == "propuesta"]

    # --- retos vencidos (SOLO AVISO: los liquida la app al abrirse) ---
    # La app es la unica que mueve puntos y cierra retos (oct-2026). Este script
    # ya no liquida: solo avisa, para no duplicar logica ni tocar saldos.
    vencidos = []
    for r in en_curso:
        fin = parse_ts(r.get("fechaFin"))
        if not fin or fin.timestamp() > ahora.timestamp():
            continue
        vencidos.append(("cobrada" if int(r.get("conteo") or 0) >= int(r.get("puntosMeta") or 0) else "noCumplido", r))

    # --- mensaje ---
    L = []
    L.append("☀️ Buenos días (%s)" % ahora.strftime("%d %b"))
    L.append("")
    if de_hoy:
        L.append("📅 Citas de hoy (%d):" % len(de_hoy))
        for c in sorted(de_hoy, key=lambda x: str(x.get("fechaCita"))):
            marca = "✅" if c.get("estado") == "confirmada" else "⏳"
            L.append("%s %s — %s (%s → %s)" % (
                marca, fecha_corta(c.get("fechaCita")), c.get("actividad"),
                c.get("proponenteNombre"), c.get("paraNombre")))
    else:
        L.append("📅 Sin citas hoy. 😉")
    L.append("")
    if en_curso:
        L.append("🏆 Retos en curso (%d):" % len(en_curso))
        for r in en_curso:
            L.append("• %s → %s (%s/%s pts)" % (
                r.get("actividad"), nombre(r.get("asignadoA")),
                r.get("conteo") or 0, r.get("puntosMeta") or 0))
    else:
        L.append("🏆 Sin retos en curso.")
    if propuestas:
        L.append("")
        L.append("📝 Propuestas sin autorizar (%d):" % len(propuestas))
        for r in propuestas:
            L.append("• %s → %s" % (r.get("actividad"), nombre(r.get("asignadoA"))))
    if vencidos:
        L.append("")
        L.append("⏳ Retos vencidos (se liquidan al abrir la app):")
        for est, r in vencidos:
            asig = nombre(r.get("asignadoA"))
            if est == "cobrada":
                L.append("🎉 %s cumplió %s. ¡A cobrar!%s" % (
                    asig, r.get("actividad"),
                    (" Recompensa: " + r.get("recompensa")) if r.get("recompensa") else ""))
            else:
                L.append("⚠️ %s no cumplió %s. Castigo: %s" % (
                    asig, r.get("actividad"), r.get("castigo") or "—"))
    L.append("")
    L.append("Que tengan bonito día ❤️")

    ok = enviar_telegram("\n".join(L))
    print("Enviado: %s" % ok)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
