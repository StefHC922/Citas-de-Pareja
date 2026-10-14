# -*- coding: utf-8 -*-
"""parte el GUIA.md en varios archivos (oct-2026).

Lo hace por renglones, sin reescribir nada: cada bloque sale tal cual, y en su
lugar queda una linea que dice donde esta.
"""
import io, os, sys

G = r"C:\Users\Fred\Documents\GitHub\Citas-de-Pareja\General"
GUIA = os.path.join(G, "GUIA.md")
HIST = os.path.join(G, "HISTORIA.md")

lineas = io.open(GUIA, encoding="utf-8").read().split("\n")


def bloque(desde, hasta):
    """Renglones [desde, hasta) -> texto."""
    return "\n".join(lineas[desde - 1:hasta - 1]).rstrip() + "\n"


def encabezado(titulo, porque, extra=""):
    return ("# %s\n\n"
            "> Seccion que vivia en `GUIA.md` y se movio aqui el oct-2026: **ya no\n"
            "> es lo que se lee a diario**, es el detalle de una pantalla o un\n"
            "> modulo. En `GUIA.md` quedo una linea que apunta aqui.\n\n"
            "> **Por que se movio:** %s\n%s\n---\n\n") % (titulo, porque, extra)


# (archivo nuevo, titulo, porque, [(desde, hasta), ...], donde queda en GUIA.md)
TRASPASOS = [
    ("Centro-Adquisiciones.md",
     "Centro de Adquisiciones Personal",
     "son 249 lineas de una sola pantalla y no se consultan al trabajar en el resto.",
     [(1596, 1845)],
     "el Centro de Adquisiciones"),
    ("IA-Acompanante.md",
     "La IA de `Acompanante/` y los retos que propone",
     "son 206 lineas de una sola pantalla, y ademas son texto que cambia con cada "
     "ajuste de la instruccion.",
     [(1974, 2180)],
     "la IA de `Acompanante/`"),
    ("Campana-Pestana.md",
     "La campana de la pestana: Chat y Retos",
     "son 184 lineas de un solo modulo (`pestana.js`), que se lee entero o no se lee.",
     [(744, 928)],
     "la campana de la pestana (Chat y Retos)"),
    ("Pegamento-y-Citas.md",
     "El chorro de pegamento y las pantallas de configuracion",
     "son detalle de pantallas concretas: el pegamento, la agenda de `Citas/` y las "
     "pantallas de Actividades y Accesorios.",
     [(1869, 1940), (1940, 1974), (2180, 2248)],
     "el pegamento, la agenda de `Citas/` y las pantallas de configuracion"),
]

# El bloque que va al diario, no a un archivo de especificacion.
DIARIO = (1845, 1869)

for archivo, titulo, porque, rangos, donde in TRASPASOS:
    cuerpo = "".join(bloque(a, b) for a, b in rangos)
    texto = encabezado(titulo, porque) + cuerpo
    io.open(os.path.join(G, archivo), "w", encoding="utf-8").write(texto)
    print("nuevo  %-32s %d lineas" % (archivo, texto.count("\n")))

# Al diario.
diario = bloque(*DIARIO)
h = io.open(HIST, encoding="utf-8").read()
if not h.endswith("\n"):
    h += "\n"
h += ("\n\n---\n\n"
      "## Lo que salio mal la primera vez con el Centro de Adquisiciones "
      "(oct-2026)\n\n"
      "La primera version **funcionaba pero se veia mal**, y hubo que senalarlo. "
      "Va aqui porque es relato, no regla vigente. Lo que quedo de eso son cuatro "
      "reglas, y esas estan en `AGENTS.md` y en el propio `Centro-Adquisiciones.md`:\n\n")
h += diario
io.open(HIST, "w", encoding="utf-8").write(h)
print("diario  HISTORIA.md  +%d lineas" % diario.count("\n"))

# Reconstruye el GUIA.md: cada bloque se sustituye por su linea que apunta.
reemplazos = []
for archivo, titulo, porque, rangos, donde in TRASPASOS:
    reemplazos.append((rangos[0][0], rangos[-1][1], archivo))
reemplazos.append((DIARIO[0], DIARIO[1], None))
reemplazos.sort(reverse=True)

salida = list(lineas)
for a, b, archivo in reemplazos:
    if archivo is None:
        puntero = ("> Lo que salio mal la primera vez con el Centro esta en\n"
                   "> `HISTORIA.md`, *Lo que salio mal la primera vez*. Aqui solo\n"
                   "> queda la regla que dejo: **pantalla nueva = copia de una "
                   "existente**.\n")
    else:
        puntero = "> El detalle esta en **`General/%s`** (%s).\n" % (archivo, donde)
    salida[a - 1:b - 1] = puntero.rstrip("\n").split("\n")

io.open(GUIA, "w", encoding="utf-8").write("\n".join(salida))
print("GUIA.md: %d -> %d lineas" % (len(lineas), len(salida)))