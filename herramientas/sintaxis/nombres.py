# -*- coding: utf-8 -*-
"""Revisa que no se use ningun nombre que no este importado o definido.

Por que existe (oct-2026): `jscheck.py` solo mira que llaves y parenteses
cuadren. **NO mira si algo este importado.** Se colaron dos errores de ese tipo:

  - `favor.js` usaba `onSnapshot()` sin importarlo. En un modulo ES eso es un
    ReferenceError al vuelo, y como la llamada estaba dentro de un `try{}` con
    catch vacio, **fallaba en silencio**: no habia cartelito ni ventana y no
    aparecia ningun error en pantalla. Eso sexture zo.
  - `pestana.js` y `chat` que usan `aviso`.

Este script marca lo que se USA como funcion y NO esta ni importado ni definido
en el archivo, mas los globales del navegador que no son obvious. Si marca algo,
revisalo: puede ser un bug de verdad o un nombre global mal puesto en la lista.
"""
import io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = r"C:\Users\Fred\AppData\Local\Temp\opencode\extracted"

# Globales del navegador y de JS. NO hace falta importarlos.
NATIVOS = set("""
Array Boolean Date Error EvalError Function JSON Map Math Number Object
Promise Proxy RangeError ReferenceError Reflect RegExp Set String Symbol
SyntaxError TypeError URIError WeakMap WeakSet Uint8Array Int8Array
Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array
Float32Array Float64Array BigInt64Array BigUint64Array ArrayBuffer
DataView TextDecoder TextEncoder URL URLSearchParams Intl WebAssembly
atob btoa clearInterval clearTimeout console crypto decodeURI
decodeURIComponent encodeURI encodeURIComponent fetch isFinite isNaN
parseFloat parseInt queueMicrotask requestAnimationFrame
cancelAnimationFrame setInterval setTimeout structuredClone
undefined NaN Infinity
window document navigator location history localStorage sessionStorage
alert prompt focus blur open close print getComputedStyle matchMedia
DOMParser Image XMLHttpRequest FormData Blob File FileReader
Path2D CanvasRenderingContext2D OffscreenCanvas
HTMLCanvasElement HTMLElement Node Element Event CustomEvent
MutationObserver IntersectionObserver ResizeObserver
performance requestIdleCallback
addEventListener removeEventListener dispatchEvent
""".split())

# Vienen de <script> externos en el HTML (CDN), no de un import.
EXTERNOS = set("QRCode Html5Qrcode".split())

# Palabras que se这篇文章 leen "como funcion" pero son sintaxis o texto.
CONTROL = set("""
if for while switch catch return typeof delete void throw function class
super this else do in of new await async yield import export from as
""".split())


def quitar_comentarios_y_cadenas(src):
    """Deja el codigo sin comentarios ni dentro de cadenas, respetando los
    `//` que NO son comentarios (los de https://)."""
    out = []
    i, n = 0, len(src)
    while i < n:
        c = src[i]
        d = src[i + 1] if i + 1 < n else ""
        if c == "/" and d == "*":
            fin = src.find("*/", i + 2)
            i = n if fin < 0 else fin + 2
            out.append(" ")
            continue
        if c == "/" and d == "/":
            # solo es comentario si lo de atras NO es ':' (o sea, no es una URL)
            if i == 0 or src[i - 1] != ":":
                fin = src.find("\n", i)
                i = n if fin < 0 else fin
                out.append(" ")
                continue
        if c in "\"'`":
            q, i = c, i + 1
            while i < n:
                if src[i] == "\\":
                    i += 2
                    continue
                if src[i] == q:
                    i += 1
                    break
                if src[i] == "\n" and q != "`":
                    break
                i += 1
            out.append('""')
            continue
        out.append(c)
        i += 1
    return "".join(out)


def nombres_declarados(limpio):
    props = set()
    patrones = (
        r"(?m)^\s*(?:export\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)",
        r"(?m)^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)",
        r"(?m)^\s*(?:export\s+)?class\s+([A-Za-z_$][\w$]*)",
        r"(?<![.\w$])(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=",
        r"(?<![.\w$])([A-Za-z_$][\w$]*)\s*=>",
        r"(?<![.\w$])(?:async\s+)?([A-Za-z_$][\w$]*)\s*\([^()]*\)\s*\{",
        r"catch\s*\(\s*([A-Za-z_$][\w$]*)",
        # `window.algo = algo` declara el nombre para TODO el archivo (asi se
        # expone `window.cerrarCfg` en Diablitos, oct-2026)
        r"window\.([A-Za-z_$][\w$]*)\s*=",
    )
    for pat in patrones:
        for m in re.finditer(pat, limpio):
            props.add(m.group(1))

    # PARAMETROS: todo `(...)` que va seguido de `=>` o de `){` es una lista de
    # argumentos. Sin esto salian "rechazar", "res", "docFn"... que SI existen.
    for m in re.finditer(r"\(([^()]*)\)\s*(?:=>|\{)", limpio):
        dentro = m.group(1)
        # fuera los valores con `=`
        dentro = re.sub(r"=[^,]*", " ", dentro)
        for p in re.findall(r"(?<![.\w$])([A-Za-z_$][\w$]*)", dentro):
            if p not in CONTROL:
                props.add(p)
    return props


# Casos que se han detectado y se aceptan. Si alguno se Arregla, se borra de aqui.
#   Diablitos/ tiene DOS scripts: uno normal (con alcance cerrado) y uno modulo.
#   Los dos comparten el `document` pero NO el alcance, y aun asi hay nombres que
#   uno usa y el otro no declara. Se anotan para que la senal siga limpia.
CONOCIDOS = {
    "acompanante_1.js": {"pintar"},
    "diablitos_1.js": {"confirmar"},
    "diablitos_2.js": {"cerrarCfg"},
}


def revisar(path):
    src = io.open(path, encoding="utf-8-sig", errors="replace").read()
    limpio = quitar_comentarios_y_cadenas(src)

    conocidos = nombres_declarados(limpio) | NATIVOS | EXTERNOS | CONTROL
    for m in re.finditer(r"import\s*\{([^}]*)\}\s*from", limpio, re.S):
        for x in m.group(1).split(","):
            x = x.strip()
            if x:
                conocidos.add(x.split(" as ")[-1].strip())
    for m in re.finditer(r"import\s+([A-Za-z_$][\w$]*)\s*(?:,|from)", limpio):
        conocidos.add(m.group(1))
    # desestructuras: const { a, b } = ...
    for m in re.finditer(r"(?:const|let|var)\s*\{([^}]*)\}\s*=", limpio):
        for x in m.group(1).split(","):
            x = x.strip()
            if x:
                conocidos.add(x)

    usados = set()
    for m in re.finditer(r"(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(", limpio):
        usados.add(m.group(1))

    faltan = sorted(u for u in usados if u not in conocidos)
    aceptados = CONOCIDOS.get(os.path.basename(path), set())
    faltan = [u for u in faltan if u not in aceptados]
    if faltan:
        print("  FALLA %s" % os.path.basename(path))
        for f in faltan:
            print("        usa '%s' y no esta importado ni definido" % f)
        return False
    return True


if __name__ == "__main__":
    archivos = sys.argv[1:]
    if not archivos:
        if not os.path.isdir(OUT):
            print("No hay nada extraido. Corre antes extract.py.")
            sys.exit(1)
        archivos = [os.path.join(OUT, f) for f in sorted(os.listdir(OUT))
                    if f.endswith(".js")]
    archivos = [p for p in archivos if os.path.exists(p)]
    malos = 0
    for p in archivos:
        if not revisar(p):
            malos += 1
    print("  Revisados %d archivos." % len(archivos))
    if malos:
        print("  %d archivo(s) usan nombres que no tienen." % malos)
        sys.exit(1)
    print("  Todo bien: ningun nombre perdido.")