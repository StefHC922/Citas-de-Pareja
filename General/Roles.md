- **Juego nuevo "Juego de Roles" (`Roles/`, oct-2026):** hijo de `Opciones/`
  (misma entrada por catálogo, misma licencia, mismos modos de jugar, mismas
  salas, mismos invitados, mismos botones). **Lo único que cambia es el turno:**
  en vez de dos opciones para escoger, **a cada quien le sale una tarjeta de
  personaje** (situación, atractivo, derechos, acción) que se **lee** y se pasa
  con **"Siguiente"**. No hay eliminación: cada quien recibe una tarjeta por
  ronda y las juega todas. El contenido vive en **Firebase**
  (`personajesJuego/actual` = `{U1,U2,C1,C2,ESP}`), **nunca** en un JSON del
  repo (contenido íntimo + repo público). La sesión es
  **`sesionRoles/actual`** y **no tiene `pares{}` ni `eliminadas{}`**: `listas{}`
  es la **cola de tarjetas que le faltan** a cada jugador, y cada elemento es el
objeto `personaje` completo. Modes: **Clásico** (sale de `U1`/`U2`), **Cambia
    de Bando** (sale de las contrapartes `C1`/`C2`), **Seleccionar** (la lista
    completa del lado, escogida a mano) y **Duelo de seducción** (lista de un solo
    lado, con su contraparte cruzada; ver abajo). **Variantes Picantes NO es un
    modo**: es un
    interruptor que se prende encima de cualquiera de los cuatro, con "¿cuántas
    veces?" (K, máximo una por ronda), y el sorteo se hace **una sola vez al
    arrancar** y se guarda en la sesión como `especiales[]`. La carta sale **boca
    abajo** y se revela al tocarla (tocar otra vez la tapa, para poder pasar el
   celular). **Ojo con dos
  campos parecidos:** `modoJuego` es **quiénes juega** (pareja/multi) y
`modoBase` es el modo del juego (normal/espejo/seleccionar/duelo). **Ojo con los
    nombres: lo que se ve y lo que se guarda NO son lo mismo.** En pantalla los
    modos son **Clásico / Cambia de Bando / Seleccionar / Duelo de seducción** y el
    interruptor es
    **Variantes Picantes**, pero en el código y en la base siguen siendo `normal` /
    `espejo` / `seleccionar` / `duelo` y `especial` / `especialK` / `especiales`. Los
   nombres se renombraron (oct-2026) **solo en el texto**: no se tocan los
   valores, o se rompen las partidas ya empezadas. Licencia: item
  **`roles`**. En el catálogo (`packs`): ruta **`Roles`**, sección
  **`juegos`**, y **sin** marcar `oficial` (el menú salta los `oficial:true`).
  Engrane ⚙️ con **una pestaña por usuario** (no cinco): cada quien solo ve su
  lado y el administrador tiene un botón para ver el del otro; dentro, dos
sub-pestañas Personajes / Contrapartes; y una tercera, **Variantes Picantes**, que
es común. **El orden de la pantalla de inicio (decisión de Fredy, oct-2026;
     rediseño completo el 17-oct-2026):** arriba **Número de rondas**, luego la
     caja **"Elige Tu Modo de Juego"** (las cuatro pestañas en 2x2, con la
     descripción del modo debajo), **luego en medio el interruptor de
     Variantes Picantes**, y después **"¿Cómo vas a jugar hoy?"** con los **solo
    dos** botones —**Jugar con Pareja** y **Multijugador**, en el mismo
    renglón—. Abajo de todo el remate del engrane y, **debajo de él**, el botón
    del QR (el orden de esos dos se invirtió el 17-oct-2026: antes el QR iba
    primero). El detalle del modelo y de las tres
    colecciones está en **`General/Modelo-Datos.md`**, sección **1b**.

  - **El rediseño de la pantalla de inicio de `Roles/` (17-oct-2026, aprobado por
    Fredy):** se armó primero en **una maqueta suelta fuera del repo** (una sola
    página con el CSS copiado, para ver y ajustar sin tocar la app) y después se
    pasó a `Roles/index.html`. Lo que quedó, todo con su regla en el CSS:
    - **"Número de rondas"** es una tarjeta de **la mitad de ancho, centrada**
      (`#cajaRondas`). **El input NO se encoge**: sigue al 100% de la tarjeta, así
      que el número se ve igual de ancho y lo compacto es el bloque.
    - **"Elige Tu Modo de juego"** juntada con la de arriba y más chica por
      dentro; los cuatro botones se quedaron como estaban (`padding:10px`,
      letra `.82rem`).
    - **Variantes Picantes perdió su recuadro** (ni tarjeta ni interruptor con
      borde) y **se movió a en medio**, entre el modo de juego y "¿Cómo vas a
      jugar hoy?" (antes iba al final, dentro de una caja). **Ojo con el texto,
      que se movió de lugar:** la frase **"Variantes Picantes, Te atreves ?"**
      **dejó de ser el título de arriba y pasó a ser la etiqueta del
      interruptor**, en coral. Ya **no existe** la frase "Ponle un toque
      personal a tu juego". El "¿Cuántas veces?" **ya no es un recuadro: es una
      ventana emergente** (ver la nota siguiente).
    - **"¿Cómo vas a jugar hoy?"** más chica, con los **botones más arriba**, y su
      **título más grande** (`1.1rem`). **Ojo: quedó más grande que los otros
      dos títulos de caja y eso NO es un descuido** — se dejó así porque a Fredy le
      gustó más así (se avisó y se dejó). Los otros dos siguen en su tamaño.
    - **"Diviértete más"** un poco más grande, **pero SOLO en la vista de
      inicio**: se puso `#vistaInicio p.desc`, porque **`p.desc` a secas es
      global** y esa misma clase la usan el engrane, la selección y la pantalla
      de continuar, que **no** se tocaron.
    - **Trampa de CSS que se pasó por alto y sigue ahí:** se quiso subir el
      espacio entre los cuatro botones de `gap:8px` a `12px` y **NO se aplicó**,
      porque la regla que manda es **`.tabs.tabsModos`** (dos clases) y le gana
      a un `.tabsModos` suelto. **Se dejó en 8px** porque es lo que se aprobó en
      la maqueta. Para cambiar esa separación hay que editar **`.tabs.tabsModos`**,
      no `.tabsModos`. Lo mismo aplica para cualquier ajuste de esa fila.

  - **El "¿Cuántas veces?" pasó a ser una VENTANA EMERGENTE (17-oct-2026).**
    Antes era un recuadro que se abría **debajo** del interruptor, y en el
    celular **la pantalla no cabía**: hubo que hacer un **ajuste de alto** (achicar
    las tres tarjetas, quitar relleno y juntar espacios, con los títulos pegados
    al borde de arriba de su tarjeta) **y de paso sacar ese recuadro**. Para
    volver a tocarlo:
    - La ventana es **`#modalEsp`** y usa el **molde `.modal .caja` de la app**
      (el mismo del formulario de personajes), **NO** un `confirmar()`: ese es de
      "¿sí o no?" y esto es un formulario. Se abre y se cierra con los
      **`abrirModal(id)` / `cerrarModal(id)` que ya existían** — no se redeclaran.
    - **`#inpEspecial` y `#espNota` se MOVIERON dentro de la ventana, no se
      duplicaron.** Por eso `especialK()` y `pintarEspecial()` no cambiaron de
      nombre ni de referencia. **Prohibido crear un segundo campo de K**: serían
      dos números que se pueden desincronizar.
    - **`Cancelar` es VOLVER ATRÁS**: apaga el interruptor y cierra la ventana,
      para no dejar prendido un modo al que nunca se le dijo cuántas veces.
      **Aceptar** solo cierra. Poner `.checked = false` a mano **no** dispara el
      evento `change`, así que no hay ciclo.
    - **El texto va HASTA ABAJO**, debajo de los dos botones, y los botones se
      van al fondo con **`margin-top:auto`** dentro de una caja en columna: así
      quedan pegados a la línea de abajo sin importar cuánto ocupe el texto.
    - **El aviso de "no tienes variantes" (`#espAviso`) NO se movió a la
      ventana**, y a propósito: habla de la configuración ("agrégalas en el
      engrane"), no de K, y tiene que verse sin abrir nada.
    - El texto de la nota pasó a **"En X de las Y rondas, alguien tendrá una
      sorpresa."** (antes decía "a alguien le toca una variante"). El aviso de
      `K > R` en coral se mantiene.

  - **Al acabar la partida se reinicia SOLO el interruptor de Variantes Picantes
    (decisión de Fredy, 17-oct-2026).** `reiniciarVariantes()` apaga la casilla y
    vuelve a poner "¿Cuántas veces?" en 1. Se llama en los **dos** caminos donde
    la partida se acabó de verdad: el **"Aceptar"** del fin y **"Terminar
    Partida"** del anfitrión.
    - **El número de rondas y el modo de juego NO se reinician**, a propósito: se
      dejan como estaban para poder volver a jugar igual de rápido la segunda vez.
      Antes de esto **no reiniciaba nada**; ahora es el único ajuste que sí vuelve
      a su valor inicial.
    - **OJO: NO va en "Pausar y Salir", y esa es la parte que no hay que
     -meter**: esa partida **se puede retomar** (`roles_partida_local`), así que la
      casilla tiene que seguir diciendo la verdad sobre lo que quedó guardado. Si
      se apagara ahí, al retomar se vería apagada **mientras el juego sí tiene
      variantes**, y el que jugara después creería que no. Ese desajuste es
      peor que el que se arregla.
    - Poner `.checked = false` a mano **no** dispara el evento `change`, así que
      no se abre la ventana sola. `reiniciarVariantes()` llama a `pintarEspecial()`
      al final, que es lo que limpia el aviso y el texto de la nota.

  > **PROBADO EN VIVO (Fredy, 17-oct-2026):** el rediseño de la pantalla de
  > inicio y la ventana de "¿Cuántas veces?" quedaron **subidos y probados en el
  > celular**: la pantalla ya **cabe sin bajar**, la ventana sale con el borde
  > turquesa y el texto abajo, **Aceptar** cierra y deja el interruptor prendido,
  > **Cancelar** apaga todo, y al arrancar la partida las variantes caen en las
  > rondas que se pusieron. **También probado en una partida COMPARTIDA con
  > invitados (Fredy, oct-2026):** el interruptor reparte las rondas en cada
  > teléfono.

**Los textos de los modos NO son instrucciones, son PERMISOS (decisión de Fredy,
  oct-2026) — no reescribirlos sin preguntar.** La pestaña dice el nombre y la
  descripción dice lo que el jugador gana: `Clásico` → *"Interpreta, Aprovecha y
  ......"* · `Cambia de Bando` → *"La Lealtad y las Intenciones Cambian de
  Bando"* · `Seleccionar` → *"Selecciona tus personajes favoritos."*
  · `Duelo de seducción` → *"Sensualidad contra Erotismo, Quién Ganará ?"*
  **Los puntos suspensivos de "Clásico" son intencionales y NO se completan:** la
  frase deja la puerta abierta para que cada quien la rellene con su imaginación.
  Por eso ahí **no** cabe una palabra como "Disfruta": es un verbo de
  *sentimiento*, dice qué hay que sentir al terminar y **topa** las opciones.
  `Interpreta` y `Aprovecha` son verbos de *permiso*: abren. **El criterio para
  estas descripciones es que ABRA, no que diga qué hacer ni qué sentir.** El
  subtítulo de la pantalla ("Diviértete más") y las etiquetas de cada tarjeta en
  la selección ("Normal" / "Contraparte") se dejan como están: no tienen nada que
ver con el nombre de los modos.

**Duelo de seducción: el cuarto modo de `Roles/` (construido 17-oct-2026).** Está
  en la misma caja de los otros tres, en **2x2** (dos pestañas arriba, dos abajo).
  Se reparte una lista de **un solo lado** y **de cada carta se toma su contraparte
  cruzada** (U1 → C2, U2 → C1); los personajes sin contraparte no cuentan ni se ven.
  El dueño de la lista juega los originales y el otro las contrapartes. Se juega en
  dos modalidades (**Turnos**, que es el motor de siempre, y **Juntos**, donde no
  hay turnos: la pareja juega al mismo tiempo y el anfitrión aprieta "Siguiente") y
  tiene **cuatro caminos** según se juegue con pareja o en multijugador, y en un
  celular o cada quien en el suyo. Lo que se guarda en la sesión: `modoBase:"duelo"`,
  `dueloLado`, `dueloModalidad` y **`dueloPares[]`** (las parejas en orden de
  ronda). En la pantalla de escogimiento del duelo **solo marca el anfitrión**
  (quien inicia la partida): la pareja y los invitados ven la lista y el
  contador, pero no marcan. Cualquiera de los dos puede iniciar, también el
  Duelo; el que inicia es el anfitrión. "Saltar
  turno" **no existe** en duelo. **El detalle completo de las cuatro ramas, el
  modelo de datos y las cuatro funciones del reparto están en
  `General/duelos.md`** — ese es el archivo que se lee, no esta nota. Cómo se
  construyó está en **`General/Plan-Duelo.md`**.

  **PROBADO EN VIVO (Fredy, oct-2026):** las **ocho combinaciones de la matriz** y
  los casos límite **ya se ejecutaron en el celular**. El Duelo **no** es solo
  código escrito: está verificado. Lo que se fue encontrando al probar está anotado
  como reglas más abajo y en `General/duelos.md`.

  **Y estas son las reglas del juego en sí (Clásico, Cambia de Bando, Seleccionar y
  Duelo) que salieron de las pruebas en vivo (oct-2026) — no romper:**
  - **Saltar turno QUEMA la tarjeta** de esa persona: pierde el turno *con*
    tarjeta. Si solo se le saltara el turno, la partida pediría turnos de más, la
    ronda se pasaría de R y **no terminaría**. Usa el mismo `avanzarTarjeta()` que
    "Siguiente", para que un salto y un paso normal no puedan comportarse distinto.
    (En **Duelo** el botón no existe, así que la regla no aplica.)
  - **No se puede dar "Siguiente" con la carta boca abajo.** El botón se ve
    apagado y, al tocarlo, sale un aviso discreto (*"Voltea la carta para poder
    seguir."*). No se **deshabilita**: un botón deshabilitado no avisa nada. **En el
    duelo *Juntos* esto NO aplica**: ahí el botón no se apaga, porque todos juegan
    al mismo tiempo y el anfitrión avanza cuando le parece.
  - **La carta del personaje tiene tope de alto** (`max-height:min(56dvh,520px)`):
    la foto es un banner 16/9 (no un cuadro) y lo que sobra de la info se desliza
    **dentro** de la carta, para que "Siguiente" quede siempre cerca. Es la misma
    carta en todos los modos de `Roles/` y en las dos caras del duelo. (17-oct-2026)
  - **El invitado no sale de la pantalla de selección**: se le oculta el "‹ Volver"
    y el botón atrás del celular queda bloqueado, igual que durante el juego.
  - **La pantalla de selección tiene buscador** (`#selBuscar`, 17-oct-2026):
    filtra la lista que se está viendo, sin mayúsculas y sin acentos ("jose"
    encuentra a "José"). Sirve igual para la selección normal y para la del
    Duelo, que comparten pantalla.
  - **El "Volver" de la pantalla de selección va ARRIBA A LA DERECHA**, no
    abajo: el botón de abajo (`#btnSelVolver`) se quedó en el código pero
    **oculto**, porque el enlace de arriba llama a su función para cancelar.
  - **En el Duelo hay dos atajos** (17-oct-2026), solo para quien inicia:
    - **"Sorpréndeme, elige por mí"** (`#btnSelAzar`): marca **R parejas al azar**
      (el orden al azar es el orden de las rondas), suben los dos contadores y se
      enciende "Jugar". Se puede repetir para re-sortear.
    - **"Tentación sin distinciones"** (`#btnSelTentacion`): **ignora lo marcado**
      y reparte a **cada persona** (usuario 1 y sus invitados; usuario 2 y los
      suyos) su propia mano de **R cartas al azar de `U+C` de su lado**, distintas
      entre compañeros si alcanzan y con repetición si no. **No hay parejas**, así
      que en este modo **no sale "contra ..."**. Sirve en todas las combinaciones
      **menos Multijugador + un celular** (ahí el botón no se muestra). En Juntos
      un celular (solo Pareja) la carta de dos caras muestra la de cada quien.
    Ninguno de los dos sale en la selección normal.
  - **"Sorpréndeme" también está en el modo "Seleccionar"** (17-oct-2026): marca
    **R tarjetas al azar de `U+C` de la lista que se está viendo**, distintas
    (el pool siempre alcanza). En **"cada quien"** cada teléfono solo lo hace en
    su propia lista; en **"un solo celular"**, en la pestaña que se esté viendo.
    "Tentación sin distinciones" sigue siendo solo del Duelo.
  - **El Duelo "cada quien" espera a la pareja** (17-oct-2026): no arranca hasta
    que la otra parte entra ("Esperando a que entre …"), y si no entra se puede
    **"Comenzar igual"**. Espera **solo a la pareja**, no a los invitados, y no
    aplica en "un solo celular". Si alguien acepta después de que ya arrancó,
    entra **a la partida**, no a la selección muerta.
  - **"Pausar y Salir" se puede retomar.** En **"cada quien en su celular"** la
    partida vive en `sesionRoles/actual`. En **"un solo celular"** se guarda en el
    propio teléfono (`localStorage`, clave `roles_partida_local`) y, al volver,
    sale "¿Continuar partida anterior?" con **Continuar / Partida nueva**. Esa
    copia local **no manda invitación ni se expone a nadie**, y se borra al
    empezar una partida nueva, al dar "Terminar Partida" o al aceptar el fin.
    (17-oct-2026)
  - **La selección del Duelo en solo lectura** (la pareja y los invitados ven,
    no marcan) usa un **checkbox propio**: teal con check oscuro, también
    deshabilitado. El nativo pintaba el check blanco sobre blanco y no se veía.
  - **Invitado a media partida en Duelo/Juntos:** entra en la **misma ronda** que
    se está jugando y recibe la pareja actual + las que restan. En **Turnos**
    sigue entrando a la ronda siguiente (no tiene turno en la actual).
  - **Mensajes de fase del Duelo** (`#faseDuelo`) y el **"Toca para revelar el
    personaje"** del reverso van con letra más grande y degradado coral→turquesa.
  - **"Variantes Picantes, Te atreves ?"** (la etiqueta del interruptor de
    Variantes Picantes) va en **coral** (`var(--coral)`), para que resalte.
    **Antes esa frase era el título de la caja** y en coral decía "Ponle un toque
    personal a tu juego"; el 17-oct-2026 el interruptor se quedo sin recuadro, se
    movio a en medio y **las dos frases se intercambiaron de lugar**: ahora el
    titulo es la etiqueta y la frase en coral se fue.
  - **Arriba del reproductor del Duelo** va el **modo de juego y la modalidad**
    ("Pareja · Juntos" / "Multijugador · Turnos") y **debajo** "Ronda X de R".
    Antes estaba al revés y no decía Pareja/Multijugador.
  - **Cartas del Duelo:** debajo del personaje dicen **"contra [la contraparte]"**.
    En la carta de dos caras, cada cara muestra a la del otro. En los otros modos
    ese texto no sale. (17-oct-2026)
  - **El invitado también carga el contenido** (`cargarPersonajes()`); si no, su
    lista de selección sale **vacía**. Y no se dibuja la selección sin contenido
    (`asegurarPersonajes()`).
  - **"Pegar lista completa" es tolerante, pero NO adivina.** Acepta: un arreglo
    JSON, un objeto suelto, **un pedazo de arreglo sin los corchetes** (`{...}, {...},`
    — con o sin la coma final), el formato envuelto (`{"U1":[...]}`), **comillas
    tipográficas** (`“ ”`) y texto, uno por línea. Y si el JSON está **mal escrito,
    avisa y no pega nada**, con la **pista del navegador** (que trae **la línea y
    la columna** del error), para poder arreglarlo a mano. Antes, si el texto no
    empezaba con `[`, se caía a "un renglón = un personaje" **en silencio** y
    metía cada línea como un personaje, con todo el texto como nombre (le pasó a
    Fredy al pegar los personajes de un usuario en Contrapartes).
  - **"Exportar lista" descarga la lista que se está viendo (17-oct-2026).** Va
    **pareado con "Pegar lista completa"**, en la misma línea de dos botones al
    final del engrane (`#btnExportar`, función `exportarLista()`). **NO va en la
    esquina superior derecha**: ahí vive el "‹ Volver" y en toda la app hay **un
    solo botón por esquina** (ver `AGENTS.md`, regla 1f). Exporta **lo que se
    tiene seleccionado en ese momento** — la pestaña de usuario + la sub-pestaña
    (Personajes / Contrapartes), o **Variantes Picantes** — y en esa pestaña el
    texto se renombra solo ("Exportar variantes"). Tres reglas:
    - **Lo que se exporta es un arreglo pelado**, el mismo formato que acepta
      "Pegar lista completa": el archivo se puede volver a pegar tal cual.
    - **No le hace caso al buscador.** El buscador es para buscar, no para
      achicar un respaldo: si respetara el filtro, un archivo que dice "todos los
      personajes" podría salir con la mitad y nadie lo notaría.
    - El nombre del archivo sale del **nombre real del usuario**
      (`limpiarParaArchivo()` lo limpia de `/ \ : * ? " < > |` y le acorta los
      espacios, porque el nombre viene de la base y un `/` rompería la descarga;
      si queda vacío cae a `usuario1` / `usuario2`). Ejemplo:
      `roles-Fredy-personajes.json`.
    Con lista vacía **no baja nada**: avisa con `aviso()`.
  - **Las contrapartes van CRUZADAS** (decisión de Fredy, oct-2026): la lista de
    contrapartes de un usuario son las contrapartes de los personajes **del otro**.
    O sea, **`C1` ↔ `U2`** y **`C2` ↔ `U1`**. Por eso el desplegable "Contraparte
    de" de una contraparte de `C1` lista los personajes de `U2`, y los avisos de
    correspondencia van cruzados igual. *(Antes era del mismo dueño —`C1` ↔ `U1`— y
    estaba al revés; lo reportó Fredy jugando.)*
  - **Cada quien escoge solo de su lado**: en "cada quien en el suyo" el teléfono
    muestra **solo su pestaña** (y por eso solo puede escribir sus marcas); en "un
    solo celular" salen todas. El lado del invitado sale de `conQuien`.
  - **Mientras se escoge, el aviso de la sala apunta al documento de la
    SELECCIÓN** (`sesion:"seleccionRoles/actual"` **con el mismo `sid`**), no a la
    partida. Hace falta porque durante la selección **todavía no hay partida**, y
    la sala exige que el documento apuntado esté `activa`. Al cancelar se
    **retira** el aviso; al arrancar, lo reemplaza el de la partida. **Y quien
    acaba de escoger no recibe "¿Unirse?" otra vez** (`selYaEntre`): entra directo.
  - **El diseño de la carta vive en el código** (`Roles/index.html`, el CSS de
    `#tarjeta` y `#reverso`): no se copia aquí para que no se separe de la
    realidad. Lo que **no** se ve en el CSS: las etiquetas visibles son
    **SITUACIÓN / ATRACTIVO / DERECHOS / ACCIÓN** y los campos **no** se renombran
    (siguen siendo `situacion`, `gancho`, `derechos`, `si_quieres`); el **mosaico
    va solo en el reverso**; y el **emoji del remate va FUERA** del degradado,
    porque con `background-clip:text` el emoji también sale transparente. El bloque
    de la variante que va dentro de la carta se rotula **"Variante picante"**.
  - **La foto del personaje NO se vuelve a crear si la URL no cambió**
    (`pintarFotoEn()` la guarda en `data-foto`). Si se recreara en cada repintado,
    en el celular la carga se cancela y el `onerror` deja el marcador 🖼️ (en la PC
    carga tan rápido que no se nota). La foto va con **`object-fit:contain`**: se ve
    completa dentro del recuadro.
- **Trampa de la dirección de un juego (oct-2026) — costó dos rondas de
  diagnóstico:** los juegos importan los módulos de la raíz con `../acceso.js` y
  compañía. Eso **solo funciona si la dirección es la CARPETA** (`/Roles/`). Si se
  abre como `/Roles/index.html`, el `..` **no sube**: quita el nombre del archivo
  y se queda dentro de `/Roles/`, así que **los ocho imports dan 404, el módulo no
  carga y la pantalla queda en blanco con todos los botones muertos** — y **sin un
  solo error de JavaScript** (por eso no se veía la causa). La causa típica es el
  campo **`Ruta`** del pack mal escrito en el Panel: tiene que ser **`Roles`** a
  secas, **sin** diagonal y **sin** `index.html` (con `Roles/` el enlace queda
  `/Roles//`; con `Roles/index.html`, se abre el archivo). Un fallo de carga de
  módulo **no lo ve `window.onerror`**: hay que escuchar el `error` del elemento
  `<script>`.
- **El QR y el remate del engrane, en la pantalla de inicio (oct-2026):** en
  **`Roles/` y en `Opciones/`** la pantalla de inicio ahora trae, abajo de todo,
  un botón **"QR Invita a Alguien"** y el remate **"Personaliza tu experiencia
  en... ⚙️"** (que **abre el engrane de esa misma pantalla**). Sirve para
  registrar invitados **sin tener que entrar a la partida**. El QR es **una sola
  función** (`abrirQR()`), la usan el botón de adentro del juego y el del inicio:
  no está copiada. **"Agregar invitado" NO se puso ahí**: en el inicio todavía no
  hay partida, y los invitados ya registrados entran solos.
- **Y `Opciones/` tenía el mismo defecto del blanco (oct-2026):** esperaba a
  Firebase **antes** de pintar (`await cargarOpciones()`), así que la pantalla se
  quedaba vacía mientras cargaba. Se le aplicó el **mismo arreglo que a `Roles/`**:
  primero se pinta, después se carga, y se refresca sola. **`Opciones/` se agregó
  a `extract.py`** (no estaba: nunca se revisaba de sintaxis).
- **Quién puede iniciar partida (Encuentros y Elecciones Peligrosas, oct-2026):**
  la pantalla de inicio la ve **cualquier usuario que no sea invitado** (el
  administrador **y** la pareja), cada quien con su **propia identidad**. Antes
  solo el administrador la veía y a la pareja se la mandaba directo a la pantalla
  de espera (por eso "no podía entrar sola" en ninguno de los dos juegos). Los
  invitados siguen esperando la invitación. El **anfitrión** de cada partida es
  quien la inició (en compartida, `hostUid`): los botones de Pausar/Terminar/QR/
  Agregar invitado y "saltar turno" son de ese anfitrión (`esAnfitrion()`).
  `esAnfitrion()` es la bandera **`soyHost`** (se pone al iniciar o reanudar la
  partida, o al entrar a una que yo inicié) y **no** depende de `jugando`: si
  dependiera, al pausar se ocultarían los botones y no volverían al reanudar.
  El engrane de configuración (⚙️) lo tienen **los dos** (es su app en cada
  teléfono, aunque compartan datos); el "solo administrador" era para el control
  de invitados, no para la pareja.
## Diseño de la tarjeta de personaje (registro actual)

**Altura fija:** la tarjeta mide `min(56dvh, 520px)` de alto, para que el botón
"Siguiente" quede siempre cerca y no haya que bajar toda la pantalla. Lo que
sobra de la información se desliza **dentro** de la carta (`.info` tiene su
propio scroll).

**Foto del personaje:** es un banner 16/9 (no cuadrada), con `object-fit:contain`
para que se vea completa dentro del recuadro. En la esquina de la foto sale un
**dedo 👆 que pulsa** (solo cuando hay imagen): indica que se puede tocar para
ampliarla en la ventana emergente, sin tapar la imagen. Sin imagen no sale.

**Bloques de información:** SITUACIÓN / ATRACTIVO / DERECHOS / ACCIÓN (este
último con borde izquierdo teal). Los textos salen de Firebase y nunca se
usan `innerHTML` con datos de la base, solo `textContent`.

**Nombre:** con degradado coral→turquesa y `width:fit-content` para que el
degradado se vea entero.

**"contra [contraparte]":** debajo del nombre, solo sale en las cartas del
Duelo de seducción. En los otros modos el elemento nace oculto.

**Bloque "Variante picante":** solo se muestra si la ronda tiene una variante
especial asignada. Vive dentro de la carta, así se voltea con ella.

**Reverso:** la carta arranca boca abajo (reverso visible). Al tocarla se
revela. El reverso tiene el mismo tamaño que el frente (`visibility` y no
`display` para que el alto no salte).

**Volteo e imagen grande (igual en todos los modos):** al tocar la carta (boca
abajo ↔ boca arriba) se revela toda la información. Al tocar la foto con la
carta boca arriba se abre una **ventana emergente** (`modalImagenCarta`) con la
imagen del personaje a tamaño grande. Si se toca "Siguiente" con la carta
todavía boca abajo, sale el aviso discreto: "Voltea la carta para poder
seguir." (En el duelo *Juntos* el botón no se apaga: el anfitrión avanza cuando
le parece.)

**Estandarizado el 1-nov-2026:** antes "cada quien en su celular" usaba un
ciclo de 3 toques (reverso → solo imagen grande *dentro* de la carta → toda la
info). Ese paso intermedio se quitó: ahora la imagen grande se ve siempre en la
ventana emergente, en cualquier modo.

**Texto de estado debajo de la carta:** "Toca para revelar el personaje" (boca
abajo) y "Toca la foto para ampliar" (boca arriba), en todos los modos.

- **Un resumen de conversacion no lee estos archivos.** Si una sesion se corta
  por limite de tokens, lo que se pierde es el detalle fino. Este archivo es la
  red de seguridad: cualquier sesion nueva debe empezar leyendolo.
