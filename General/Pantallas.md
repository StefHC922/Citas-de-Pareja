# Decisiones tomadas por pantalla

Movido de `General/GUIA.md`. Contiene las decisiones específicas de cada pantalla del proyecto.

---

## Decisiones tomadas (NO sobrescribir sin preguntar)

### Del proyecto Citas de Pareja

| Decision | Detalle |
|---|---|
| La app se manda desde GitHub Desktop | Fredy sube, espera 1-2 min (Pages) y prueba en incognito o `Ctrl+Shift+R` (`Cache-Control: max-age=600`) |
| Modo invitado sin salir de la app | Es una pantalla normal, no un modo aparte: el invitado **no puede registrarse** ni tiene menus que lo delaten |
| Al registrarse va directo a la sala | A `Diablitos/`, sin ventana de "Listo". Si el anfitrion aun no publico nada, ve "Esperando Invitacion..." |
| El invitado **no tiene salida** | Ni en la pantalla de espera ni durante la partida. Se queda hasta que termine |
| La pareja **no** se expulsa nunca por un corte de red | La salida automatica solo se aplica al abrir la app, no durante la partida |
| Al terminar, el invitado sale solo | Este o "Terminar Partida": mensaje, acepta, `salirModoInvitado()` |
| En toda la interfaz se dice **anfitrion** | No "administrador" |
| Aviso de fin solo en la transicion real | Exige `&& jugando`, para que un documento viejo no lo displays otra vez |
| **Al acabar una partida se prenden fuegos** | Modulo `fuegos.js` en la **raiz**. Sale en todos los modos (solo, pareja, multi, un celular o compartido) y tmbn si el anfitrion la termina. El aviso de fin **no** dice "La partida termino": dice "Gracias por jugar" y la pantalla se celebra con fuegos |
| El turno ajeno va en **recuadro** | Igual que en `Encuentros/` (`#actividadAhora`): fondo con degradado, borde, sombras y `border-radius:24px`. Por eso `#esperaTurno` se enciende con `display:"flex"` y **no** con `"block"**: si no, el estilo de linea manda y no se centra |
| **Panel de la sala** (`#salaPanel`) | Abajo de los botones. Izquierda **En la espera** = usuarios del grupo que NO estan en `cabezas`. Derecha **En el juego** = las cabezas de la partida. Se repinta en cada `pintarPaso()` y se apaga solo cuando ya no se esta jugando |
| **QR, "Agregar invitado" y panel: SOLO en Multijugador** | Regla en `modoAdmiteInvitados()` (`modoJuego === "multi"`), en `Opciones/`. En **Pareja** (de ahi en adelante, cada quien en el suyo o un solo celular) y en **Solo** NO se muestran: el encuentro es de los dos o de uno, no hay a quien meter. Da igual si se juega en un solo celular o compartido. Ojo: `modoJuego` **antes no se asignaba nunca** (se quedaba en `"multi"`); ahora `iniciar()` lo graba junto con `unCelular` |
| Invitar en **Encuentros** (oct-2026) | Copiado de `Opciones/`. Se agrego `<script>` de `qrcodejs`, `leerConfigGuardada` al import de `config.js`, modalQR + modalAgregar y `pintarSala()`. Sale en los **DOS** modos (`esAnfitrion()`), no solo en compartido. Ojo: las fichas del panel se llaman `.ficha`, **no** `.chip`, porque en este juego ya existe un `.chip` del editor |
| Botones de invitar en Encuentros | **Misma cuadricula 2x2 que `Opciones/`**: QR junto a "Pausar y Salir" y "Agregar invitado" junto a "Terminar Partida", con el panel de la sala debajo. Antes iban en una fila aparte y se veian distintos |
| **Hueco reservado de "Saltar turno"** (`.filaSaltar`) | Ese boton solo aparece cuando NO es tu turno. Sin el hueco reservado empujaba hacia abajo la fila 2x2 y el panel de la sala, y todo se encimaba. Va dentro de `<div class="filaSaltar">` con `min-height:44px`: el espacio esta siempre, Asi el layout no se mueve nunca |
| **"← Volver" de `Opciones/` va a `#juegos`** | El juego esta en el catalogo de **Juegos**, no de Experiencias: el enlace era `../index.html#experiencias` y abria "Experiencias en Pareja", que no es de donde se entro. El clic en `vistaConfig` sigue atrapado y regresa a `entrar()` |
| Fin de partida igual en los 3 juegos | `Encuentros/` y `Guiadas/` ahora importan `fuegos.js` y usan `encenderFuegos()`/`apagarFuegos()`, con `#modalFin` en `z-index:80` y `background:transparent` para que los fuegos (70) se vean. Todos dicen "¡Gracias por jugar!" + "Aceptar" (se quito la letrita "Toca la pantalla..."). **En `Guiadas/` el modal es NUEVO** (antes no existia: al ultimo paso solo volvia al inicio) y se creo **inline**, porque ese juego no tiene clase `.modal` |
| **El boton de silencio estaba tapado** | El aviso de fin es `z-index:80` y ocupa TODA la pantalla, y el boton de `fuegos.js` iba en `Z+1` (=71): quedaba debajo y no se podia oprimir. Arreglo en los dos lados: (1) el boton a `Z+20` (=90); (2) **`#modalFin` lleva `pointer-events:none` y `.caja` `pointer-events:auto`**, para que el fondo no se coma los toques y asi "tocar la pantalla" sirva en toda la superficie, no solo fuera del modal |
| Como se sabe que una cita TERMINO en `Guiadas/` | `avanzarSesion()` ahora escribe `terminada: (np >= lista.length)`. Sin esa bandera el `escucharSesion` no distinguia "se acabo" de una pausa o de "Terminar", y habria fuegos hasta al darle "Terminar". `mostrarPlayer()` reinicia `finMostrado`/`finEnLocal` para que una cita nueva vuelva a celebrar |
| **"Terminar" de `Guiadas/` no terminaba (arreglado oct-2026)** | Pasaba en los **DOS** modos y por el mismo motivo: "Terminar" no borraba el avance, solo salía de la cita. En compartido apagaba `activa`, pero `jugarDirecto()` al volver a la misma actividad ofrecía "¿Continuar?" mirando **solo** si quedaban pasos, **sin mirar `d.activa`**: daba igual que la cita estuviera terminada, y "Continuar" la resucitaba. En un solo celular era peor: ni siquiera apagaba nada, solo dejaba `guia_prog` ahi. En los dos se sentia como pausa. **Regla: si un documento tiene una bandera de "vivo", TODA consulta que lo use tiene que mirarla; y si un boton dice "terminar", tiene que borrar lo que deja el avance.** El arreglo: `!!d.activa && ...` en `tengoPendientes`, y `borrarProg()` en el "Terminar" de un solo celular |
| **Pausa, salto de turno y fin de cita en `Guiadas/` (oct-2026)** | En la cita compartida (`modoJuego === "compartido"`) hay tres botones, y el que antes decía "Terminar" ahora se mueve de nombre. Decisiones de Fredy, **no** las de `Encuentros/`, porque la dinamica es distinta (alla hay `cabezas` y anfitrion; aqui la lista ya esta armada): |

| Boton | Que hace | Solo sale |
|---|---|---|
| **"Pausar y Salir"** (antes decía "Terminar") | Deja la cita **viva** y se retoma donde iban. **Compartida:** escribe `pausada:true` + `pausadaPor:<nombre>` y la pareja **se queda esperando** (NO se apaga `activa`). **Un solo celular:** no hay nada que marcar, porque el avance ya se guarda en el cel con cada paso (`guardarProg()` → `guia_prog`), y al volver sale "¿Continuar?" | Siempre, en los dos modos |
| **"Saltar turno de X"** (`#btnSaltar`) | Avanza `paso` un paso **aunque no sea tu turno** (es la unica diferencia con `avanzarSesion()`). La accion del que se salta **se pierde**. Pregunta con `confirmar()` y usa transaccion, como el avance normal | Cuando **NO** es tu turno, y **lo pueden los DOS** (en `Encuentros/` solo el anfitrion) |
| **"Terminar"** / **"Terminar Partida"** (`#btnTerminarPartida`) | **Termina de verdad, no se retoma.** Compartida: `activa:false, terminada:true, pausada:false, porNombre:<quien>`; a la pareja le llega el fin diciendo **quien** lo termino y al aceptar sale a la lista de esta misma pantalla. Un solo celular: **borra el avance local** (`borrarProg()`). Siempre pregunta con `confirmar()` | Siempre, en los dos modos. El nombre cambia: "Terminar Partida" en compartido, "Terminar" en un solo celular |

| | |
|---|---|
| **En pausa no se puede entrar** | Igual que `Encuentros/`: `btnUnirme` avisa "X pausó la cita" y no mete a jugar. Si no, el que llega se metería y los dos a la vez. Quien puede reanudar es el que pausó: al volver a la actividad aparece "¿Continuar?" y `btnContinuar` escribe **`pausada:false`** |
| **Saltar turno avanza SIEMPRE el contador** | Si se saltara sin avanzar `paso`, la cita pediría un turno que nunca llega y **no terminaría nunca**. Es la misma trampa que se documentó en `Roles/`, pero aqui NO aplica lo de "quemar la carta": la dinamica es una lista de pasos ya armada, y lo que se pierde es la accion del turno saltado |
| **El nombre de quien pausa** | Se usa `pausadaPor`, **no** `hostNombre`: los dos pueden pausar, y el que espera puede ser el que inicio la cita |
| **Los dos botones nuevos NACEN ocultos** | `style="display:none"` en el HTML (regla de la casa) y `pintarPaso()` los enciende |
| **Al agregar un invitado en Encuentros** | Se cuela al **final** de `d.orden` y se le copia la lista del companero de su mismo lado. Dos razones: 1) `avanzarSesion()` avanza con `t+1 < d.cabezas.length`, asi que si se agrega a `cabezas` sin agregar a `orden` los indices se descuadran y `d.orden[d.turno]` sale `undefined`; 2) las acciones son las del encuentro y no hay de donde re-asortear sin romper el ritmo. `largo` **no** cambia: el invitado solo juega las rondas que faltaban |
| **Guiadas NO lleva nada de esto** (decision oct-2026) | Su sesion es `{lista:[{lado}], paso}`: una secuencia de pasos YA ARMADA con `paso` como indice. **No tiene `cabezas`, no importa `invitado.js` (no publica invitaciones) y no tiene `escucharGrupo()`.** Agregar a alguien a media partida obligaria a rehacer la lista entera y saltaria el turno de todos. Se decidio no portar QR/panel/"agregar invitado" ahi. **OJO: esto es solo lo de los INVITADOS. La pausa, el salto de turno y el fin de cita SI se agregaron (ver abajo)** |
| El selector de invitado solo muestra perfiles base | Nunca a otros invitados, para que no haya invitado-de-invitado |
| Sin caducidad por tiempo para el invitado | Si cierra la app, el chequeo no corre: el vencimiento nunca se aplicaria |
| La sala es **solo para invitados** | La pareja no la ve ni entra por su cuenta |
| Diablitos **sin candado**, fijo en el menu | Submenu **Juegos**, para todos |
| Se brinca al que ya no esta | En vez de parar la partida. Con el boton "Saltar turno" del anfitrion |
| Un aviso **solo vale si la partida vive** | La sala comprueba la sesion antes de mostrar nada |
| En pausa no se puede entrar, pero tampoco se expulsa | Se marca el aviso en pausa, no se retira |
| Entrar desde la sala es **directo** | `?entrar=1`; sin doble pregunta |
| "Inicio" en Diablitos **solo si no eres invitado** | El invitado sigue sin salida |
| Retos tiene **su propio submenú**, y **no** está en Experiencias | Antes estaba como tarjeta fija dentro de Experiencias y su submenú quedaba vacío (oct-2026) |
| El menu tiene **4 submenus** iguales: Experiencias, Juegos, Retos y **Comunicaciones** | Chat y Acompanante ya no son entradas sueltas, viven en Comunicaciones (oct-2026) |
| **Volver** siempre a la **derecha**, en toda la app | A la izquierda va el boton contextual de esa pantalla (oct-2026) |
| Retos: **Volver** a Retos especiales y **sin** "Cambiar usuario" | Igual que Citas. Se agrego `#extras` al arranque |
| Un aviso sin `sesion` **no se muestra** | Descarta los avisos publicados antes de existir el campo |
| El icono de Diablitos va **dibujado, no como emoji** | SVG en `SVG_DIABLITOS` (`index.html`). Se ve igual en todos los telefonos. Elegido por Fredy (oct-2026) |
| Su descripcion es `Diviertete picando diablitos traviesos` | Antes decia "la sala de espera", que era literal y comercialmente flojo |
| El boton de volver de un juego se llama **`Volver`** y va al submenu del que salio | Usa `#juegos` / `#experiencias`. Antes decia "Inicio" y se iba hasta el principio |
| El invitado **no ve la salida** en Encuentros | Se oculta siempre. Cumplía la regla de Fase 1 en todos lados menos ahí |
| El `Volver` de los submenus va **arriba a la derecha**, los tres | Clase `.volverSub`. Antes uno estaba a la izquierda y dos venian abajo |
| **Cambiar usuario** solo en **Usuarios**, arriba a la izquierda | Se quitó de `Citas/`: ya solo servia para pruebas |
| **Cambiar usuario** tiene **Volver** y al elegir regresa a **Usuarios** | Antes no se podia salir sin cambiar, y caia donde se le antojaba (oct-2026) |
| Los titulos con degradado llevan `width:fit-content` | Sin eso el color se reparte por toda la pantalla y se ve clarito |
| Los botones de esquina (engrane, carrito) son **solo del menu principal** | En submenus no salen. El engrane va arriba a la **izquierda** |
| **Los ejemplos usan los nombres de verdad**: la pareja es **Mary** y el administrador **Fredy** | Decisión de Fredy (17-oct-2026). En comentarios, en la documentación y en los textos de ejemplo se ponen esos dos nombres, no nombres inventados. **OJO: esto NO son datos de la app** — el nombre real de cada quien sale de la base (`nombreLado()` → `usuariosLista`), y el respaldo es el genérico `"Lado A"` / `"Lado B"`. No se hardcodea ningún nombre en el código |

## Textos de los modales de tomas (Encuentros y Guiadas)

Al iniciar una partida de Encuentros o Guiadas se abre una ventana emergente que pide especificar cuántas acciones de cada nivel quiere usar. Los textos son:

| Juego | Título del modal | Texto del aviso |
|---|---|---|
| Encuentros | ¿Cuántas acciones por nivel? | Anote cuántas acciones de cada nivel para su partida, considere a sus invitados |
| Guiadas | ¿Cuántas acciones por nivel? | Anote cuántas acciones de cada nivel quiere utilizar para su partida |

### De la forma de trabajar

| Decision | Detalle |
|---|---|
| **No se toca el repo sin que Fredy lo pida** | Ni un archivo ni una línea sin pedido. Si el pedido no está claro, se pregunta antes de escribir; si se ve que falta otra cosa, se dice y se pregunta, no se resuelve de una con un cambio. Es la regla 0 de `AGENTS.md` (18-oct-2026) |
| Fredy decide, el modelo ejecuta | Si algo es decision de producto, **preguntar antes** de aplicar |
| Explicar antes de programar | En espanol claro y sin codigo para el usuario |
| No inventar reglas nuevas de Firestore | Se reutiliza la base y las reglas que ya funcionan |
| No tocar algo que no tenga que ver con el pedido | Cambios minimos y verificables |
| Documentar en este archivo | Es la unica memoria del proyecto |
| Verificar antes de decir "listo" | Pruebas automaticas y, cuando se puede, prueba real en el celular |

---

## Estándares de tamaño de la interfaz

**Regla: lo nuevo se copia de la pantalla inicial (`index.html`).** No se inventan medidas ni se pregunta por ellas: ya están decididas.

| Qué | Medida |
|---|---|
| Ancho máximo del contenido | `max-width:380px` |
| Botón principal | `width:100%; padding:16px; border-radius:16px; margin-bottom:12px; font-size:1.05rem` |
| Botón secundario | `padding:12px` |
| Botón de icono (el circulito de arriba) | `font-size:1.6rem; padding:8px 10px; border-radius:12px` |
| Tarjeta de menú | `padding:24px 20px; border-radius:20px; margin-bottom:16px; gap:16px` |
| Icono de tarjeta | `2.4rem` en el menú, `2rem` en otras pantallas |
| Título de tarjeta | `1.25rem` en el menú, `1.1rem` en otras |
| Subtítulo de tarjeta | `.85rem` |
| Chevron de la tarjeta | `1.4rem` |
| Título de sección | `.8rem`, mayúsculas, con espacios entre letras |
| Radio de esquina | `12px` esquinas chicas, `16px` botones y tarjetas |
| Al tocarse | `transform: scale(.97)` |

**Nota honesta:** hoy hay botones viejos con `padding` de 12, 13 y 16px, y radios de 12, 14 y 16px. **No es un bug, pero lo nuevo va con la tabla de arriba.** Unificar los viejos se hace aparte, pantalla por pantalla, porque requiere verlos.

## Pantalla nueva = COPIAR una existente (regla dura)

**Antes de escribir una pantalla desde cero, abrir una que ya exista y copiarla.** No se diseña nada: se replica. Si la pantalla nueva no se ve igual que las demás, es un bug, aunque funcione.

**Hay DOS moldes en la app, y son distintos. El que pide Fredy para las pantallas de juego y con varias vistas es el de `Guiadas/index.html` (idéntico al de `Encuentros/`).** No confundirlo con el de `Citas/` o `Retos/`, que es otro.

### Molde A — el de `Guiadas/` y `Encuentros/` (el que se usa)

Varias vistas en la misma pantalla, una visible a la vez. **Este es el molde de referencia.**

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

| Qué | Medida / clase |
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

**Navegación:** se cambian las clases con una función `ver(id)` que quita `.ver` a todas y se la pone a una, y el **"Volver" es contextual** con `preventDefault()`: regresa a la pantalla anterior, y solo desde la vista principal sale al menú (`../index.html#submenu`). Con `history.pushState` + `popstate` para que el botón atrás del celular no se salga de la pantalla.

### El estilo de las LISTAS: el del engrane de `Opciones/`

Cuando la pantalla tenga **listas de cosas** (productos, deseos, opciones, pedidos), el molde de las listas **no** es el de `Guiadas/` sino el del **engrane de `Opciones/`** (Juegos → Elecciones Peligrosas → ⚙️ arriba a la izquierda). Se copian estas clases tal cual, con sus medidas:

| Clase | Qué es | Medida |
|---|---|---|
| `.tabs` / `.tab` / `.tab.activo` | Pestañas: dos botones en la misma línea | `.tab{flex:1; padding:12px; border-radius:12px; border:1px solid var(--card-border); background:var(--card); color:var(--fg-muted); font-family:'Chakra Petch'; font-weight:600; font-size:.9rem}` — `.activo` es el degradado coral→turquesa con `color:var(--bg)` |
| **`.tablaBox`** | **El recuadro que delimita la lista** | `width:100%; max-height:48dvh; overflow-y:auto; border:1px solid var(--card-border); border-radius:12px; background:var(--bg-2); padding:8px` |
| `.fila` + `.celda` + `.x` | Cada renglón | `.fila{display:flex; gap:8px; align-items:center; margin-bottom:6px}` · `.celda{flex:1; min-width:0; border:1px solid var(--card-border); background:var(--card); border-radius:10px; padding:10px; font-size:.85rem}` · `.x{background:none; border:none; color:var(--rojo); cursor:pointer; font-size:1rem; padding:6px 10px}` |
| `.filaAdd` | Fila de agregar: input + `+` | `display:flex; gap:8px` · input `flex:1; border-radius:12px; background:var(--bg); padding:12px` · botón con el degradado, `padding:12px 16px` |
| `.buscar` | El buscador | `width:100%; border-radius:12px; background:var(--card); padding:13px 14px; font-size:.95rem` |

**El esqueleto de una vista con lista** es siempre este, en este orden:

```
h1  +  p.desc
[ .tablaBox con los renglones ]      ← el recuadro delimita
[ .filaAdd  o  .btnPri ]             ← opcional
[ .tabs con las otras vistas ]       ← abajo del recuadro, en la misma línea
```

**El ✕ no borra de una:** abre el detalle para **editar, activar y borrar**, y ahí se pregunta con `confirmar()`. Un ✕ que borra sin avisar es una trampa.

### Molde B — el de `Citas/`, `Retos/` y `Opciones/`

Una sola vista, con `#app` + `#encabezado` (saludo con degradado + fecha) + `#contenido` (`max-width:560px`). **Solo se usa si la pantalla es de una sola vista.** Si tiene varias, es el molde A.

**Antes de decir "listo", chequear en una pantalla nueva:**
- `<div>` y `</div>` cuadran.
- No hay `id` repetidos.
- **Todos los `id` que usa el JS existen en el HTML.**
- El JS pasa `jscheck.py`.

## Estándar de navegación (botón atrás, submenús, historial)

**1. El botón "Volver" de un juego se llama `‹ Volver`, nunca "Inicio",** y regresa **al submenú del que salió el juego**, no a la pantalla inicial:

| Juego | Va a | Como |
|---|---|---|
| Diablitos | Juegos | `../index.html#juegos` |
| Un juego de Experiencias (Guiadas, Encuentros, Citas) | Experiencias | `../index.html#experiencias` |
| Retos | Retos | `../index.html#retos` |

**Los `#` tienen que estar soportados** en el `if(location.hash === ...)` de `index.html`. Si un juego apunta a un `#` que no está ahí, **no da error**: te manda al menú principal sin querer.

**Los tres submenús son de un solo nivel**, todos con la misma forma:

| Submenú | Lleva a | Llena desde |
|---|---|---|
| Juegos | Diablitos | `packsJuegos` (catálogo) |
| Experiencias | Citas, y lo del catálogo | `packsExp` (catálogo) |
| Retos | Retos | `packsRetos` (catálogo) |

`#extras` **ya no existe**: el submenú se llama Retos (`btnRetos`, `vistaRetos`, `packsRetos`). El código acepta `seccion:"retos"` y también `"extras"`, igual que los dos `#`, por si hay algo viejo en el catálogo.

**Un juego se pone en UN submenú, no en dos.** Retos estaba como tarjeta fija dentro de Experiencias y además tenía su propio submenú vacío (oct-2026). Por eso "Volver" lo dejaba en un lugar sin nada.

**1g. Una pantalla que cuelga de un submenú regresa a ESE submenú, no a la pantalla hermana.** El Centro de Adquisiciones cuelga del submenú Retos, así que su "Volver" va a `../index.html#retos` y **no** a `Retos/index.html`. Lo mismo aplica a cualquier pantalla nueva: se pregunta "¿de dónde salí?" y ahí se vuelve.

**1h. El orden de las tarjetas lo manda `orden`, no el alfabeto.** Las tarjetas de `packs` se ordenan por `orden` y, si empatan, por título. **Si no se pone `orden`, caen en `10` y se ordenan por nombre**: por eso "Centro de Adquisiciones" salía **antes** que "Retos" (oct-2026). **Cada tarjeta fija lleva su `orden` explícito y único.**

`index.html` lee el `#` al arrancar y abre esa subpantalla directo (`abrirJuegos()` / `abrirExp()`). Para agregar otro submenú: se agrega su `abrirX()` / `cerrarX()` junto a las demás y se añade su línea en ese `if`.

**1b. El "Volver" de los SUBMENÚS va arriba a la DERECHA**, siempre los tres (Juegos, Experiencias, Retos). Clase `.volverSub`, que ya trae la posición. No se pone cada uno por su lado: si se agrega un submenú, usa esa misma clase.

**1c. "Cambiar usuario" vive SOLO en la pantalla de Usuarios** (arriba a la izquierda, `#invCambiarUsu`). Se quitó de `Citas/` y de `Retos/`, donde solo servía para las pruebas del principio (oct-2026). Si aparece en otra pantalla, es que se coló otra vez: no pertenece ahí.

**1d. Un flujo SIEMPRE tiene salida.** "Cambiar usuario" abre la lista de usuarios y muestra un **"‹ Volver"** (`#idVolverCambiar`). Y al escoger, se vuelve a **Usuarios**, no al menú. Lo anterior no cumplía ninguna de las dos: no se podía salir sin cambiar, y al cambiar caía donde se le antojaba (fredy, oct-2026).

**Regla que salió de eso:** una acción que cambia la identidad **no borra nada antes de tiempo y no recarga a ciegas**. Primero muestra, deja cancelar, y solo al confirmar recarga — y avisa a dónde va.

**1e. Los cuatro submenús del menú son iguales:** Experiencias, Juegos, Retos y **Comunicaciones** (que trae Chat y Acompañante). Todos abren con un botón y se cierran con el mismo `.volverSub`. No hay entradas "sueltas" al menú: si algo nuevo entra, entra en un submenú.

**1f. "Volver" SIEMPRE arriba a la DERECHA** en toda la app: submenús del menú y pantallas de juego (Encuentros, Guiadas, Diablitos, Citas, Retos, **Chat y Acompañante**, que van a `#com`). Lo que vive en la esquina **izquierda** es el botón contextual de esa pantalla (el engrane), y **jamás hay dos en el mismo lado a la vez**: en cada pantalla se muestra solo uno.

En Guiadas y Encuentros el "← Volver" de arriba a la derecha es **contextual**: regresa a la pantalla anterior (del editor a la lista de configurar; de ahí a la lista de actividades/jugar). Solo desde la lista de actividades sale al menú. El único botón de arriba a la izquierda es el engrane ⚙️, y solo en la lista de actividades (oct-2026: se quitaron los "← Jugar"/"← Configurar").

**2. Los botones de la esquina (el ⚙️ de invitados y el 🛒 de adquisiciones) son del MENÚ PRINCIPAL.** En un submenú no se muestran: ahí solo vive el `‹ Volver`. El ⚙️ va arriba a la **izquierda** (a la derecha se encimaba con el 🛒 en el celular).

**3. El invitado NO tiene ninguna salida.** En `Encuentros/` el enlace "‹ Volver" se le oculta siempre (`pintarSalidas()`), porque la regla de Fase 1 dice que el invitado no se va por su cuenta. La pareja y el anfitrión sí lo ven, salvo durante la partida.

**4. Los títulos centrados con degradado llevan `width:fit-content`.** Sin eso el degradado se reparte por todo el ancho de la pantalla y sobre las letras solo cae una fracción: se ve clarito y sin color.

**4b. Los títulos de los submenús (`.subTitulo`) van CENTRADOS.** Con textos largos como "COMUNICACIÓN Y ALGO MÁS" se notaba que se quedaban pegados a la izquierda (oct-2026).

**4c. Al agregar o mover un bloque de `<div>` en el HTML: contar que el número de `<div>` y de `</div>` cuadre.** Pasó dos veces: un `</div>` de más cerró el contenedor `#menu` antes de tiempo y todo se amontonó a la izquierda, y un `packsRetos` quedó duplicado (los ids duplicados no dan error, solo hacen cosas raras). Se revisa con un conteo de `<div` / `</div>` por página, y buscando ids repetidos.

**5. El guardado de cada pantalla es `position:fixed` o `absolute` con `top:max(18px, env(safe-area-inset-top))`.** Nunca sin esa protección: en celulares con notch los botones se esconden bajo la barra.

## Degradado en los títulos

Los `h1` llevan `width:fit-content`. Sin eso la caja ocupa todo el ancho y el degradado de 90° solo pinta una franja sobre las letras, que se ve clarita y sin color.

## Botones de volver y de esquina

El estándar está arriba, en las decisiones de navegación, y también en `AGENTS.md`.

En `index.html` los submenús se abren con funciones (`abrirJuegos()`, `cerrarExp()`, …) y **no** con `onclick` en línea. Razón: al arrancar se comprueba `location.hash` y se llama a la misma función. Si fueran `onclick` en línea, esa llamada del arranque podría no encontrar el manejador todavía.

Con `#juegos` el submenú de Juegos se abre directo al volver de un juego, sin pasar por la pantalla inicial.

---
