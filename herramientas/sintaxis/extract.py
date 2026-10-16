import os
import re, io, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = r"C:\Users\Fred\AppData\Local\Temp\opencode\extracted"
os.makedirs(OUT, exist_ok=True)

# Se limpia la carpeta antes de sacar nada. Si no, un .js de una corrida vieja
# se queda y `revisar.py` lo sigue revisando como si fuera el actual: da un
# conteo equivocado y puede "aprobar" (o acusar) algo que ya no existe.
# Ya paso el oct-2026 con `roles_2.js`, que sobro cuando un HTML paso de tener
# dos <script> a uno.
for _f in os.listdir(OUT):
    if _f.endswith(".js"):
        os.remove(os.path.join(OUT, _f))

targets = [
    ("Encuentros/index.html", "encuentros"),
    ("Citas/index.html", "citas"),
    ("index.html", "raiz"),
    ("Guiadas/index.html", "guiadas"),
    ("Tienda/index.html", "tienda"),
    ("Acompanante/index.html", "acompanante"),
    ("Chat/index.html", "chat"),
    ("Retos/index.html", "retos"),
    ("Retos/centro.html", "centro"),
    ("Diablitos/index.html", "diablitos"),
    ("Roles/index.html", "roles"),
    # Opciones/ se agrego en oct-2026: no estaba y por eso NUNCA se revisaba de
    # sintaxis (el plan de Roles ya lo tenia anotado como pendiente). Se agrego
    # al tocarlo para meterle el QR y el remate del engrane.
    ("Opciones/index.html", "opciones"),
]

pat = re.compile(r'<script([^>]*)>(.*?)</script>', re.S | re.I)

for rel, tag in targets:
    p = os.path.join(REPO, rel.replace("/", os.sep))
    if not os.path.exists(p):
        print("FALTA  " + rel)
        continue
    src = io.open(p, encoding="utf-8-sig").read()
    n = 0
    for m in pat.finditer(src):
        attrs = m.group(1) or ""
        body = m.group(2)
        if not body.strip():
            continue
        n += 1
        name = "%s_%d.js" % (tag, n)
        with io.open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(body)
        kind = "module" if "module" in attrs else "clásico"
        print("OK  %-22s %-10s %-24s %d bytes" % (rel, kind, name, len(body.encode("utf-8"))))

# archivos .js sueltos
for f in ("acceso.js", "taquilla.js", "config.js", "firebase-config.js", "glue.js",
          "pestana.js", "invitado.js", "confirmar.js", "telegram.js", "favor.js"):
    p = os.path.join(REPO, f)
    if os.path.exists(p):
        src = io.open(p, encoding="utf-8-sig").read()
        with io.open(os.path.join(OUT, f), "w", encoding="utf-8") as g:
            g.write(src)
        print("OK  %-22s %-10s %-24s %d bytes" % (f, "modulo", f, len(src.encode("utf-8"))))