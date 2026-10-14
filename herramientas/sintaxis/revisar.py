# -*- coding: utf-8 -*-
"""Revisa la sintaxis de TODO el repo en un solo paso.

Por que existe (oct-2026): `jscheck.py` NO saca los <script> de los HTML, los
revisa tal cual. Si se le pasa un `.html`, cuenta tambien las llaves del CSS y
los `</script>`, y da "OK" por casualidad, no porque el JavaScript este bien.
Pasarle el HTML engano una vez: los archivos "pasaron" sin haberse revisado.

Este script hace las dos cosas en el orden correcto:
  1. `extract.py` deja los scripts sueltos en Temp/opencode/extracted
  2. `jscheck.py` revisa ESOS .js, que es lo que hay que revisar

Uso:  python revisar.py
Sale con codigo 1 si algo fallo.
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = r"C:\Users\Fred\AppData\Local\Temp\opencode\extracted"


def correr(nombre, argumentos):
    print("\n== %s ==" % nombre)
    r = subprocess.run([sys.executable, os.path.join(HERE, nombre)] + argumentos,
                       cwd=HERE)
    return r.returncode


if correr("extract.py", []) != 0:
    sys.exit(1)

# Todo lo que extract.py dejo, en el orden en que lo genero.
archivos = []
for f in sorted(os.listdir(OUT)):
    if f.endswith(".js"):
        archivos.append(os.path.join(OUT, f))

if not archivos:
    print("No hay nada que revisar.")
    sys.exit(1)

print("\n== jscheck.py (%d archivos) ==" % len(archivos))
malos = 0
for p in archivos:
    r = subprocess.run([sys.executable, os.path.join(HERE, "jscheck.py"), p])
    if r.returncode != 0:
        malos += 1

if malos:
    print("\n%d archivo(s) con problemas." % malos)
    sys.exit(1)
print("\nTodo bien: %d archivos." % len(archivos))