# AGENTS.md - Citas de Pareja

## Antes de hacer cualquier cosa

**Lee `General/GUIA.md` primero.** Es el documento maestro del proyecto:
contiene el modo invitado, la sala de espera, la decision de por que las
invitaciones se atan a la partida, `acceso.js`/licencias, `Autorizar/` y las
reglas de Firebase.

Sin leerlo se repiten errores ya resueltos y se rehacen cambios a medias.
Ese fallo ya ocurrio una vez: un trabajo completo se descarto porque nadie
tenia el contexto a la mano.

### Los documentos, y cuando se lee cada uno

| Documento | Que es | Cuando se lee |
|---|---|---|
| `AGENTS.md` | Como trabajar en este repo | **Siempre**, es lo primero |
| `General/GUIA.md` | **Lo que es cierto HOY** y aplica a toda la app | Cuando la tarea toca codigo |
| `General/Centro-Adquisiciones.md` | El Centro: deseos, tienda y pedidos | Solo si la tarea toca `Retos/centro.html` |
| `General/IA-Acompanante.md` | `Acompanante/`: el tono de la IA, los ajustes y los retos que propone | Solo si la tarea toca `Acompanante/` o los retos de la IA |
| `General/Campana-Pestana.md` | `pestana.js`: campana, bip y cartelito (Chat y Retos) | Solo si la tarea toca los avisos de la campana |
| `General/Pegamento-y-Citas.md` | El pegamento, la agenda de `Citas/` y las pantallas de Actividades y Accesorios | Solo si la tarea toca esas pantallas |
| `General/duelos.md` | El cuarto modo de `Roles/` (Duelo de seducción): las 4 ramas y sus 2 modalidades. **Construido 17-oct-2026, pendiente de la prueba en vivo** | Solo si la tarea toca el modo de duelo |
| `General/Plan-Duelo.md` | El plan de desarrollo del Duelo: fases, funciones, modelo de datos y pruebas | Solo si la tarea es **construir** el duelo |
| `General/Modelo-Datos.md` | Como esta guardada la base y como normalizarla | Antes de migrar datos |
| `General/HISTORIA.md` | **El por que**: relato con fecha de cada arreglo | **Solo** en los casos de abajo |
| `General/Plan-Favores-Express.md` | Un plan de desarrollo **que no existe todavia** | Solo si la tarea es sobre Favores Express |

**Los cuatro del medio se partieron del `GUIA.md` el oct-2026** (pasó de 2,274
a 1,417 líneas). Son **detalle de una sola pantalla o un solo modulo**: se leen
enteros o no se leen, y estorban al leer lo de todos los dias. **Si la tarea no
los toca, no se abren** — y su regla general esta resumida en `GUIA.md`.

**`General/HISTORIA.md` es un diario, NO son instrucciones vigentes.** Antes
estaba todo junto en `GUIA.md` (3,000 lineas) y el problema no era el tamano:
era que mas de la mitad era relato con fecha, y se leia como si mandara. Si algo
de `HISTORIA.md` contradice a `GUIA.md`, **manda `GUIA.md`**.

**Léelo SOLO si la tarea toca alguno de estos:**

- Modo invitado, copia de seguridad, salir de la invitacion.
- Sala de espera (`Diablitos/`), invitaciones de los juegos.
- Avisos de fin de partida, pausa, "Saltar turno", el anfitrion.
- `acceso.js`, licencias, catalogo, el limite de 30 solicitudes.
- Retos de la IA de `Acompanante/`, `Retos/`, `Retos/centro.html`.
- `Citas/` y el centro de Adquisiciones.

**NO lo necesitas para:** estilos, agregar o quitar un boton, el menu y sus
submenus, el Chat, la campana de la pestana, `confirmar.js`, `fuegos.js`,
`glue.js`, el Asistente, o las reglas de Firebase (esas estan arriba de
`GUIA.md`, en la parte que dice "Estado de las reglas").

**Criterio honesto:** si tienes duda de si algo aplica, **no lo leas**. Casi todo
el trabajo diario cae en la lista de "NO lo necesitas", y `GUIA.md` tiene
1,417 lineas (se leen enteras).

## Como trabajar en este repo

- Todo el codigo es **HTML estatico con JavaScript adentro**. No hay build, no
  hay npm, no hay framework. Se edita el archivo y ya.
- Los modulos compartidos viven **en la raiz** (`acceso.js`, `invitado.js`,
  `config.js`, `firebase-config.js`, `taquilla.js`, `fuegos.js`, `confirmar.js`,
  `pestana.js`, `telegram.js`) y se importan por ruta relativa al **modulo**, no
  al archivo que lo importa.
- **`avisarTelegram()` ya NO se copia** (oct-2026): vive en `telegram.js`. Si
  necesitas mandar un aviso por Telegram, **importalo**; no lo pegues otra vez.
- **Reglas de Firestore:** no estan en el repo. Viven en la consola de Firebase.
  Cualquier tarea sobre permisos es manual y hay que decirlo.
- **No hay `git` disponible en el entorno de trabajo.** Para revisar cambios se
  leen los archivos directamente; Fredy es quien sube con GitHub Desktop.
- **Verificación por sintaxis (rápida, sin navegador).** Es el único chequeo
  automático que queda: `herramientas/sintaxis/`. El orden es: extraer, luego
  revisar.

  ```powershell
  cd herramientas\sintaxis
  python revisar.py
  ```

  `revisar.py` hace las dos cosas y revisa **todo** el repo. Sale con `1` si algo
  falla.

  **OJO, error que ya se cometió (oct-2026):** `jscheck.py` **no** saca los
  `<script>` de los HTML. Si se le pasa un `.html` a mano, cuenta también las
  llaves del CSS y da "OK" **por casualidad**. Hay que pasarle el `.js` que
  dejó `extract.py`, que vive en `Temp\opencode\extracted`. Por eso conviene
  `revisar.py` y nunca llamar a `jscheck.py` con un `.html`.

  `extract.py` no revisa solo lo que este en su lista: `Diablitos/index.html`,
  `invitado.js` y `confirmar.js` se agregaron en oct-2026 porque **no estaban**
  y por eso nadie los revisaba. Si agregas una pantalla o un modulo nuevo,
  **registralo en `extract.py`**, o queda sin revisar para siempre.

- **No hay arnés con Chrome.** Se retiró en oct-2026: era lento y poco fiable
  (Chrome sin ventana devolvía volcados vacíos). **La verificación de verdad es
  en vivo**, en Pages y en el celular de Fredy.

## Cuándo dejar de insistir (regla dura)

Aplica a cualquier forma de verificar, también a la prueba en vivo.

**Máximo 3 intentos por forma de probar.** Si a la tercera no sale:

1. **Para.** No lo intentes una cuarta vez "a ver si ahora sí".
2. **Cambia de forma**: otra manera de probar, o revisión leyendo el código.
3. **Anótalo** como "pendiente de probar a mano" y **dilo en tu respuesta**.
4. Pasa a lo siguiente.

Nunca dejes a la persona esperando en silencio mientras repites lo mismo. Si algo
se atora, **dilo de inmediato** y di qué harás en su lugar.

**Prefiere menos pruebas y más rápido** antes que una prueba atascada. El valor de
probarla no justifica el rato perdido.

## Que las pruebas no se coman la sesión (regla dura, oct-2026)

**El trabajo es escribir código, no probarlo.** Ya pasó una vez: se acumularon
arneses y scripts de prueba, cada cambio disparaba corridas largas, y las
sesiones se acababan en pruebas en vez de en avance. Se borraron (ver la nota al
inicio de `GUIA.md`). **Que no vuelva a pasar:**

- **No se deja NINGÚN arnés en el repo.** Ni scripts, ni carpetas, ni páginas de
  prueba. Lo de probar vive en `Temp\opencode` y se borra al terminar. Si de
  verdad tiene que ir dentro del repo (porque sus `import` son relativos), se
  crea, se usa y **se borra en la misma sesión**, y se avisa.
- **La única prueba automática es `revisar.py`.** Tarda un segundo: se corre
  después de cada cambio, siempre.
- **Una sola inspección visual por cambio, y solo si el aspecto importa** (un
  diseño nuevo, algo que se ve raro). Nunca para comprobar un texto.
- **No se repite una prueba que ya falló.** Dos intentos por forma de probar y se
  suelta: se anota como pendiente y se sigue (ya lo dice la sección de arriba).
- **Si un tema se vuelve caro de comprobar, se avisa ANTES de gastar**, no
  después.
- **Lo que solo se puede ver en el celular de Fredy o en su base real, se le pasa
  a él de una vez**, diciendo qué mirar y por qué. No se simula, y no se le manda
  una lista larga de tareas.
- **Trampa conocida (oct-2026):** si se abre una página con Chrome sin ventana
  (`--virtual-time-budget`), **los `setTimeout` NO se disparan** cuando hay una
  petición de red pendiente (el SDK de Firebase la deja abierta y el reloj
  virtual se detiene). Se perdieron 3 intentos con eso. Para probar algo después
  de que cargue, hay que meter la llamada **sin temporizador**, justo después
  del punto que interesa.

## Reglas de la casa

0. **No se toca el repo sin que Fredy lo pida.** Ni un archivo, ni una linea: no
   se "de paso" un arreglo, no se completa algo que se ve que falta y no se
   anticipa la segunda mitad de un trabajo. **Primero se pregunta, despues se
   aplica.**
   - Si el pedido esta claro: se aplica **lo pedido**, nada mas.
   - Si el pedido no esta claro: **se pregunta antes de escribir.**
   - Si se ve que falta otra cosa: **se dice y se pregunta.** No se resuelve de
     una con un cambio.

   *(18-oct-2026: se escribio porque faltaba. Fredy pidio "un boton para jalar
   todas las acciones con un JSON" y el modelo.anticipo y metio tambien "Exportar",
   que nadie habia pedido. La regla de mas abajo, "No tocar algo que no tenga que
   ver con el pedido", no cubria esto: esa habla del alcance, no de si hay pedido.)*

1. Si la decision es de producto (que se ve, quien puede salir, que pasa al
   pausar), **preguntar antes de aplicar**.
2. Explicar en espanol claro y sin codigo. El usuario no programa.
3. No inventar reglas nuevas de Firestore: se reutiliza lo que ya funciona.
4. No agregar reglas de seguridad que rompan el modo invitado (nada de "solo el
   anfitrion escribe", porque el invitado escribe su identidad).
4b. **No se usa `confirm()` ni `alert()` del sistema.** Todo pasa por
   `confirmar.js`: `confirmar()` para preguntar (se espera) y `aviso()` para
   decir una cosa (no se espera; el `return` va despues).
5. Cambios minimos, y **verificar antes de decir "listo"**.
5b. **Un boton que JavaScript tiene que ocultar, nace oculto en el HTML**
   (`style="display:none"`). Si nace a la vista, hay un rato en que se ve aunque
   no deba.
6. Documentar en `General/GUIA.md` lo que se decida o se descubra. Ese archivo
   es la unica memoria del proyecto.
6b. **Pero `GUIA.md` tiene que poder leerse de arriba a abajo.** Si lo que vas a
   escribir empieza con "antes se hacía X" o lleva una fecha de hace meses, **va
   a `General/HISTORIA.md`**, no ahi. `GUIA.md` es lo que rige hoy;
   `HISTORIA.md` es el por que. Si se mezclan, `GUIA.md` se vuelve ilegible y
   este repo pierde su memoria otra vez (oct-2026).
7. **Los ejemplos usan los nombres de verdad: la pareja es `Mary` y el
   administrador `Fredy`.** En comentarios, documentacion y textos de ejemplo no
   se inventan nombres (decidio Fredy, 17-oct-2026). Ojo: **eso NO es un dato
   de la app.** El nombre real de cada quien sale de la base (`nombreLado()`), y
   ningun nombre se hardcodea en el codigo. Ver `General/GUIA.md`, seccion de
   decisiones.

## Estándares de tamaño (no inventar otros)

Estos numeros son **los de la pantalla inicial** (`index.html`) y son el
referente. Cuando se agregue un boton, una tarjeta o un titulo en CUALQUIER
pantalla, se copian de aqui. No se inventan medidas nuevas, y no se pregunta
por ellas: ya estan decididas.

| Que | Medida |
|---|---|
| Ancho maximo del contenido | `max-width:380px` |
| Boton principal | `width:100%; padding:16px; border-radius:16px; margin-bottom:12px; font-size:1.05rem` |
| Boton secundario | `padding:12px` |
| Boton de icono (el circulito de arriba) | `font-size:1.6rem; padding:8px 10px; border-radius:12px` |
| Tarjeta de menu | `padding:24px 20px; border-radius:20px; margin-bottom:16px; gap:16px` |
| Icono de tarjeta | `2.4rem` en el menu, `2rem` en otras pantallas |
| Titulo de tarjeta | `1.25rem` en el menu, `1.1rem` en otras |
| Subtitulo de tarjeta | `.85rem` |
| Chevron de la tarjeta | `1.4rem` |
| Titulo de seccion | `.8rem`, mayusculas, con espacios entre letras |
| Radio de esquina, general | `12px` (esquinas chicas), `16px` (botones y tarjetas) |
| Al tocarse un boton | `transform: scale(.97)` |

**Nota honesta:** hoy hay botones viejos con `padding` de 12, 13 y 16px, y
radios de 12, 14 y 16px. **No es un bug, pero lo nuevo va con la tabla de
arriba.** Unificar los viejos se hace aparte, pantalla por pantalla, porque
tocarlos todos de golpe es Riesgoso sin verlos.

## Pantalla nueva = COPIAR una existente (regla dura)

**Antes de escribir una pantalla desde cero, abrir una que ya exista y copiarla.**
No se diseña nada: se replica. Si la pantalla nueva no se ve igual que las demás,
es un bug, aunque funcione.

**Hay DOS moldes en la app, y son distintos. El que pide Fredy para las pantallas
de juego y con varias vistas es el de `Guiadas/index.html` (idéntico al de
`Encuentros/`).** No confundirlo con el de `Citas/` o `Retos/`, que es otro.

### Molde A — el de `Guiadas/` y `Encuentros/` (el que se usa)

Varias vistas en la misma pantalla, una visible a la vez. **Este es el molde de
referencia.**

```html
<body>                                  <!-- una columna, centrada -->
  <a class="back" id="lnkInicio" href="../index.html#submenu">← Volver</a>
  <div class="eyebrow">Nombre de la sección</div>
  <div class="vista ver" id="vistaX">
    <h1>Título</h1>
    <p class="desc">Subtítulo centrado.</p>
    ...
  </div>
</body>
```

Se copia tal cual:

| Que | Medida / clase |
|---|---|
| `body` | `display:flex; flex-direction:column; align-items:center; padding:max(66px, calc(env(safe-area-inset-top) + 30px)) 20px max(28px, env(safe-area-inset-bottom));` |
| **"Volver"** | clase `.back`, `position:absolute; top:max(20px, env(safe-area-inset-top)); right:20px` |
| `.eyebrow` | `.8rem`, mayúsculas, `letter-spacing:.3em`, apagado |
| `h1` | `1.8rem`, Chakra Petch, **centrado y con degradado coral→turquesa** |
| `p.desc` | `.88rem`, apagado, `max-width:360px`, centrado |
| `.vista` | `display:none; width:100%; max-width:520px; flex-direction:column; align-items:center` |
| `.vista.ver` | `display:flex` (la vista visible) |
| Botón principal | `.btnPri` — degradado, `padding:16px`, `border-radius:14px` |
| Botón secundario | `.btnSec` — sin fondo, apagado, subrayado, `padding:12px` |
| Recuadro con scroll | `.caja` — `max-height:55dvh; overflow-y:auto; border-radius:16px; background:var(--bg-2)` |
| Tarjeta | `.ficha` — `background:var(--card); border-radius:16px; padding:16px` |

**Navegación:** se cambian las clases con una función `ver(id)` que quita `.ver` a
todas y se la pone a una, y el **"Volver" es contextual** con `preventDefault()`:
regresa a la pantalla anterior, y solo desde la vista principal sale al menú
(`../index.html#submenu`). Con `history.pushState` + `popstate` para que el botón
atrás del celular no se salga de la pantalla.

### El estilo de las LISTAS: el del engrane de `Opciones/`

Cuando la pantalla tenga **listas de cosas** (productos, deseos, opciones,
pedidos), el molde de las listas **no** es el de `Guiadas/` sino el del **engrane de
`Opciones/`** (Juegos → Elecciones Peligrosas → ⚙️ arriba a la izquierda). Se copian
estas clases tal cual, con sus medidas:

| Clase | Qué es | Medida |
|---|---|---|
| `.tabs` / `.tab` / `.tab.activo` | Pestañas: dos botones en la misma línea | `.tab{flex:1; padding:12px; border-radius:12px; border:1px solid var(--card-border); background:var(--card); color:var(--fg-muted); font-family:'Chakra Petch'; font-weight:600; font-size:.9rem}` — `.activo` es el degradado coral→turquesa con `color:var(--bg)` |
| **`.tablaBox`** | **El recuadro que delimita la lista** | `width:100%; max-height:48dvh; overflow-y:auto; border:1px solid var(--card-border); border-radius:12px; background:var(--bg-2); padding:8px` |
| `.fila` + `.celda` + `.x` | Cada renglón | `.fila{display:flex; gap:8px; align-items:center; margin-bottom:6px}` · `.celda{flex:1; min-width:0; border:1px solid var(--card-border); background:var(--card); border-radius:10px; padding:10px; font-size:.85rem}` · `.x{background:none; border:none; color:var(--rojo); cursor:pointer; font-size:1rem; padding:6px 10px}` |
| `.filaAdd` | Fila de agregar: input + **+** | `display:flex; gap:8px` · input `flex:1; border-radius:12px; background:var(--bg); padding:12px` · botón con el degradado, `padding:12px 16px` |
| `.buscar` | El buscador | `width:100%; border-radius:12px; background:var(--card); padding:13px 14px; font-size:.95rem` |

**El esqueleto de una vista con lista** es siempre este, en este orden:

```
h1  +  p.desc
[ .tablaBox con los renglones ]      ← el recuadro delimita
[ .filaAdd  o  .btnPri ]             ← opcional
[ .tabs con las otras vistas ]       ← abajo del recuadro, en la misma línea
```

**El ✕ no borra de una:** abre el detalle para **editar, activar y borrar**, y ahí
sí se pregunta con `confirmar()`. Un ✕ que borra sin avisar es una trampa.

### Molde B — el de `Citas/`, `Retos/` y `Opciones/`

Una sola vista, con `#app` + `#encabezado` (saludo con degradado + fecha) +
`#contenido` (`max-width:560px`). **Solo se usa si la pantalla es de una sola
vista.** Si tiene varias, es el molde A.

**Antes de decir "listo", chequear en una pantalla nueva:**
- `<div>` y `</div>` cuadran.
- No hay `id` repetidos.
- **Todos los `id` que usa el JS existen en el HTML.**
- El JS pasa `jscheck.py`.

## Estándar de navegación (botones de volver y esquinas)

**1. El botón "Volver" de un juego se llama `‹ Volver`, nunca "Inicio",** y
regresa **al submenú del que salió el juego**, no a la pantalla inicial:

| Juego | Va a | Como |
|---|---|---|
| Diablitos | Juegos | `../index.html#juegos` |
| Un juego de Experiencias (Guiadas, Encuentros, Citas) | Experiencias | `../index.html#experiencias` |
| Retos | Retos | `../index.html#retos` |

**Los `#` tienen que estar soportados** en el `if(location.hash === ...)` de
`index.html`. Si un juego apunta a un `#` que no está ahí, **no da error**: te
manda al menú principal sin querer. Ya pasó dos veces con Retos (oct-2026).

**Los tres submenús son de un solo nivel**, todos con la misma forma:

| Submenú | Lleva a | Llena desde |
|---|---|---|
| Juegos | Diablitos | `packsJuegos` (catálogo) |
| Experiencias | Citas, y lo del catálogo | `packsExp` (catálogo) |
| Retos | Retos | `packsRetos` (catálogo) |

`#extras` **ya no existe**: el submenú se llama Retos (`btnRetos`,
`vistaRetos`, `packsRetos`). El código acepta `seccion:"retos"` y también
`"extras"`, igual que los dos `#`, por si hay algo viejo en el catálogo.

**Un juego se pone en UN submenú, no en dos.** Retos estaba como tarjeta fija
dentro de Experiencias y además tenía su propio submenú vacío (oct-2026). Por eso
"Volver" lo dejaba en un lugar sin nada.

**1g. Una pantalla que cuelga de un submenú regresa a ESE submenú, no a la
pantabra hermana.** El Centro de Adquisiciones cuelga del submenú Retos, así que su
"Volver" va a `../index.html#retos` y **no** a `Retos/index.html`. Lo mismo aplica a
cualquier pantalla nueva: se pregunta "¿de dónde salí?" y ahí se vuelve.

**1h. El orden de las tarjetas lo manda `orden`, no el alfabeto.** Las tarjetas de
`packs` se ordenan por `orden` y, si empatan, por título. **Si no se pone `orden`,
caen en `10` y se ordenan por nombre**: por eso "Centro de Adquisiciones" salía
**antes** que "Retos" (oct-2026). **Cada tarjeta fija lleva su `orden` explícito y
único.**

`index.html` lee el `#` al arrancar y abre esa subpantalla directo
(`abrirJuegos()` / `abrirExp()`). Para agregar otro submenú: se agrega su
`abrirX()` / `cerrarX()` junto a las demás y se añade su línea en ese `if`.

**1b. El "Volver" de los SUBMENÚS va arriba a la DERECHA**, siempre los tres
(Juegos, Experiencias, Retos). Clase `.volverSub`, que ya trae la posición. No
se pone cada uno por su lado: si se agrega un submenú, usa esa misma clase.

**1c. "Cambiar usuario" vive SOLO en la pantalla de Usuarios** (arriba a la
izquierda, `#invCambiarUsu`). Se quitó de `Citas/` y de `Retos/`, donde solo
servía para las pruebas del principio (oct-2026). Si aparece en otra pantalla,
es que se coló otra vez: no pertenece ahí.

**1d. Un flujo SIEMPRE tiene salida.** "Cambiar usuario" abre la lista de
usuarios y muestra un **"‹ Volver"** (`#idVolverCambiar`). Y al escoger, se
vuelve a **Usuarios**, no al menú. Lo anterior no cumplía ninguna de las dos: no
se podía salir sin cambiar, y al cambiar caía en un sitio distinto cada vez
(fredy, oct-2026).

**Regla que salió de eso:** una acción que cambia la identidad **no borra nada
antes de tiempo y no recarga a ciegas**. Primero muestra, deja cancelar, y solo
al confirmar recarga — y avisa a dónde va.

**1e. Los cuatro submenús del menú son iguales:** Experiencias, Juegos,
Retos y **Comunicaciones** (que trae Chat y Acompañante). Todos abren con un
botón y se cierran con el mismo `.volverSub`. No hay entradas "sueltas" al
menú: si algo nuevo entra, entra en un submenú.

**1f. "Volver" SIEMPRE arriba a la DERECHA** en toda la app: submenús del menú y
pantallas de juego (Encuentros, Guiadas, Diablitos, Citas, Retos, **Chat y
Acompañante**, que van a `#com`). Lo que viva
en la esquina **izquierda** es el botón contextual de esa pantalla (el engrane),
y **jamás hay dos en el mismo lado a la vez**: en cada pantalla se muestra solo
uno.

En Guiadas y Encuentros el "← Volver" de arriba a la derecha es **contextual**:
regresa a la pantalla anterior (del editor a la lista de configurar; de ahí a la
lista de actividades/jugar). Solo desde la lista de actividades sale al menú. El
único botón de arriba a la izquierda es el engrane ⚙️, y solo en la lista de
actividades (oct-2026: se quitaron los "← Jugar"/"← Configurar").

**2. Los botones de la esquina (el ⚙️ de invitados y el 🛒 de adquisiciones)
son del MENÚ PRINCIPAL.** En un submenú no se muestran: ahí solo vive el
`‹ Volver`. El ⚙️ va arriba a la **izquierda** (a la derecha se encimaba con el
🛒 en el celular).

**3. El invitado NO tiene ninguna salida.** En `Encuentros/` el enlace "‹
Volver" se le oculta siempre (`pintarSalidas()`), porque la regla de Fase 1 dice
que el invitado no se va por su cuenta. La pareja y el anfitrión sí lo ven,
salvo durante la partida.

**4. Los títulos centrados con degradado llevan `width:fit-content`.** Sin eso
el degradado se reparte por todo el ancho de la pantalla y sobre las letras solo
cae una fracción: se ve clarito y sin color.

**4b. Los títulos de los submenús (`.subTitulo`) van CENTRADOS.** Con textos
largos como "COMUNICACIÓN Y ALGO MÁS" se notaba que se quedaban pegados a la
izquierda (oct-2026).

**4c. Al agregar o mover un bloque de `<div>` en el HTML: contar que el número
de `<div>` y de `</div>` cuadre.** Pasó dos veces: un `</div>` de más cerró el
contenedor `#menu` antes de tiempo y todo se amontonó a la izquierda, y un
`packsRetos` quedó duplicado (los ids duplicados no dan error, solo hacen
cosas raras). Se revisa con un conteo de `<div` / `</div>` por página, y
buscando ids repetidos.

**5. El guardado de cada pantalla es `position:fixed` o `absolute` con
`top:max(18px, env(safe-area-inset-top))`.** Nunca sin esa protección: en
celulares con notch los botones se esconden bajo la barra.

## El contenido de fabrica: los JSON son SOLO el instalador

Antes (oct-2026) `Citas/actividades.json` y `Citas/accesorios.json` se mezclaban con
lo de la pareja en **cada carga**. Como lo de fabrica no estaba en la base, **no se
podia renombrar ni borrar**: lo borrabas y volvia en el instante siguiente.

**Ahora los JSON son solo el instalador.** La primera vez, `config.js` los copia a la
base y a partir de ahi **manda la base**: todo, tambien lo de fabrica, se renombra y
se borra de verdad.

- `asegurarFabrica(db, {actividades, accesorios})` vive en `config.js`. Corre en las
  5 pantallas: `Citas/actividades.html`, `Citas/accesorios.html`, `Citas/index.html`,
  `Guiadas/index.html`, `Encuentros/index.html`. Las 5 leen **los dos** JSON, porque
  corre una sola vez y la que abra primero debe sembrar todo.
- La banderita es el doc **`config/fabrica`** y guarda **que nombres** ya se
  instalaron. Por eso **lo que borras no vuelve** (su nombre sigue anotado como
  instalado) y en cambio **una actividad nueva que agregues despues al JSON si entra**.
- Si no se puede escribir (reglas cerradas o sin conexion) devuelve `false` y cada
  pantalla conserva el JSON como lista de respaldo: se ve igual de antes, no se rompe.
- `unirConFabrica(base, fabrica)` solo se usa en ese caso de respaldo.
- Los presets `<Actividad>.json` siguen siendo respaldo de `presetsActividad`
  (mismo patron que `usuarios.json`). Si el nombre cambia, el JSON ya no aplica.
- El JSON tambien es el **respaldo**: no lo borres.

Al agregar o quitar algo del JSON de fabrica hay que subir `VERSION_FABRICA` en
`config.js`, o las instalaciones nuevas no lo reciben.

## La llave del `Panel/` — NUNCA al repo

`Panel/` y `Autorizar/` piden una **llave privada JWK** (`{"kty":"EC",...}`).
**No es una API key de Firebase**: es la mitad privada de un par
**ECDSA P-256** para **firmar licencias**.

- La **pública** vive en `taquilla.js` (`TAQUILLA_PUBLICA`) y **si** va al repo:
  solo verifica.
- La **privada** vive **solo en el aparato del desarrollador**, en `localStorage`
  bajo `taquilla_priv`. **Jamás la subas ni la escribas en ningun archivo del
  repo ni en la guia.**
- Ambos usan la **misma** clave de `localStorage` y el **mismo** origen: pegarla
  una vez abre los dos.
- Si se pierde, se genera un par nuevo (con `crypto.subtle`, igual que la app),
  se cambia `TAQUILLA_PUBLICA` y **las licencias viejas dejan de validar**.

Ver `General/GUIA.md`, seccion del autorizador.

## Riesgo conocido (importante, NO urgente)

- **Las reglas de `solicitudes` SI estan cerradas** (6-oct-2026, revisadas por
  Fredy y probadas: pedir, aprobar, revocar y el Panel). Lo unico que sigue
  abierto es `allow read`, **a proposito**: el menu y los juegos leen esa
  coleccion sin sesion y sin internet, y cerrarla rompe el modo sin conexion.
  El texto vigente esta en `General/reglas-firebase-taquilla.txt`.
  **No lo trates como una urgencia ni intentes cerrarlo por tu cuenta.**
- **`Autorizar/index.html` ya esta subido** y su login de Google funciona:
  Fredy probo pedir, aprobar y revocar el 6-oct-2026 y todo respondio normal.
- **Si las compras dejan de funcionar, la causa mas probable es la lista de los
  7 campos** de `create` en las reglas. Lo dice la seccion 3 del archivo de
  reglas, con la forma de comprobarlo.

**Lo que si esta pendiente** es el **permiso de `borrar` en `solicitudes`**: hoy
solo lo tiene el publicador, y el rediseno de la cola lo necesita. Cambiar
reglas es **siempre manual, en la consola**, y hay que probar las 4 cosas de la
seccion 5 de `reglas-firebase-taquilla.txt`.

Ver `General/GUIA.md`, sección "`Autorizar/`: aprobar y revocar licencias".

## La base de cada PAREJA: reglas ABIERTAS a proposito

Los proyectos de cada pareja se instalan con `allow read, write: if true` (asi lo
dice `README.md`, paso 2). **Eso es una decision, no un descuido**, y **no se
cambia**.

**Por que:** la app de la pareja **no inicia sesion** contra su propia base. Lo
verifico Fredy y se confirmo en el codigo: ninguna pagina se autentica (el import
de auth en `Guiadas/` esta de adorno, no se usa). Sin login, las reglas **no
pueden** distinguir a nadie: cerrarlas rompe la app entera.

**La proteccion real (login + reglas por correo) llega con el rediseno de
arquitectura, DESPUES** de terminar y probar la app. Es un proyecto aparte, no un
cambio de reglas.

**Si alguien -persona o modelo- propone "cerrar las reglas de la pareja" o
"ponerle candado a `Citas/actividades.html`": que avise antes.** Ya paso una vez
(oct-2026): sin estar escrito, se propuso cerrarlas y Fredy tuvo que recordar el
acuerdo.

Unico cambio que SI es seguro y no afecta la app: limitar las reglas a las rutas
que la app usa (hoy esta abierto "cualquier ruta"). Eso no protege el contenido,
solo cierra lo que no se usa. **Aun asi, no se hace sin preguntarle a Fredy.**
