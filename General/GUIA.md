# GUIA - Citas de Pareja (documento maestro)

**Este es el documento con el detalle técnico del proyecto: lo que es cierto HOY.**
Vive **dentro del repo** a propósito: así, cualquier persona o cualquier modelo
que abra `Citas-de-Pareja` lo encuentra, sin que nadie tenga que acordarse.

Además el repo tiene `AGENTS.md`, que le ordena a cualquier modelo leer este
archivo antes de tocar nada. Ese es el mecanismo que evita rehacer trabajo.

**Lo que NO está aquí:** el relato con fecha de cómo se fue arreglando cada cosa.
Eso está en **`General/HISTORIA.md`**, y solo se lee cuando la tarea toca una de
esas áreas (está la lista al principio de los dos).

> **Si algo en `HISTORIA.md` contradice a este archivo, manda este archivo.**
> Allá solo se cuenta cómo se llegó; lo que rige hoy está aquí.

## Cómo se usa

**Empieza siempre por arriba.** Estas son las secciones, en orden de urgencia.
**Busca por nombre, no por número:** el número solo es para ordenar.

| | Sección | Qué hay |
|---|---|---|
| **1** | **Estado de las reglas de Firebase** | Cerradas el 6-oct-2026. **No inventar reglas nuevas** |
| **2** | **Decisiones tomadas** | **No sobrescribir sin preguntar** |
| **3** | **Pendientes, límites y mantenimiento** | Lo que falta, y lo que ya se sabe que no se arregla |
| **4** | **Navegación con el botón atrás** | El arreglo de los submenús y las pantallas |
| **5** | **Módulos y pantallas de detalle (archivos aparte)** | `Pantallas`, `Modo-Invitado`, `Diablitos`, `Telegram`, `Catalogo`, `Usuarios`, `Modulo-Acceso`, `Autorizar`, `Favores-Express`, `Castigos`, `fuegos`, `confirmar`, `Opciones`, `Roles` |

Y los documentos aparte:

| Si quieres... | Lee |
|---|---|
| **El detalle de una pantalla concreta** | **El archivo de esa pantalla**, en la tabla del final |
| **Cómo se está guardada la base, qué está mal y cómo normalizarla** | **`Modelo-Datos.md`** |
| **Por qué se hizo cada cosa** (el porqué de un arreglo viejo) | **`HISTORIA.md`**, solo si la tarea toca esas áreas |
| **Detalle del módulo `acceso.js` (licencias)** | **`General/Modulo-Acceso.md`** |
| **Detalle de `Autorizar/` (aprobar y revocar licencias)** | **`General/Autorizar.md`** |
| **Detalle de Favores Express (`favor.js`)** | **`General/Favores-Express.md`** |
| **Detalle del juego de Castigos (`Castigos/`)** | **`General/Castigos.md`** |
| **Detalle de pantallas, navegación, estándares y moldes A/B** | **`General/Pantallas.md`** |
| **Detalle del modo invitado** | **`General/Modo-Invitado.md`** |
| **Detalle de iconos SVG (Diablitos)** | **`General/Diablitos.md`** |
| **Detalle del módulo `telegram.js`** | **`General/Telegram.md`** |
| **Detalle del aviso de "nuevo" (catálogo)** | **`General/Catalogo.md`** |
| **Detalle de la pantalla de Usuarios** | **`General/Usuarios.md`** |
| **Detalle de fuegos artificiales (`fuegos.js`)** | **`General/fuegos.md`** |
| **Detalle de `confirmar.js` y `aviso()`** | **`General/confirmar.md`** |
| **Detalle del juego `Opciones/` (Elecciones Peligrosas)** | **`General/Opciones.md`** |
| **Detalle del juego `Roles/` (modos, duelo, personajes)** | **`General/Roles.md`** |

## Nota (oct-2026): se retiró el arnés de pruebas

El arnés de pruebas con Chrome y sus scripts **se eliminaron** del repo: eran
lentos y poco fiables (Chrome sin ventana devolvía volcados vacíos). Lo que queda
es el **chequeo de sintaxis** en `herramientas/sintaxis/` (`revisar.py`) y la
**prueba en vivo** (Pages y el celular de Fredy).

Las menciones a "arnés", `Temp\opencode`, `undef.py`, `expcheck.py`,
`argcheck.py`, `dupcheck.py`, `build_*.py`, `inject_*.py`, `final.py`,
`run_*.py`, `instalador/` y demás que aparezcan más abajo son **registro
histórico** de cómo se verificó en su momento: **esos archivos ya no existen** y
no deben buscarse ni correrse. El único chequeo que queda es el de sintaxis.

**Ojo:** `jscheck.py` **no** saca los `<script>` de los HTML. Si se le pasa un
`.html` a mano, cuenta también las llaves del CSS y dice "OK" **por casualidad**.
Hay que pasarle el `.js` que dejó `extract.py`. Por eso existe `revisar.py`, que
hace las dos cosas en el orden correcto y revisa **todo** el repo. Le pasa un
`.html` a `jscheck.py` = **no se revisó nada** (ya pasó, oct-2026).

## Regla de escritura (evita copias y doble escritura)

- **Lo que rige hoy y aplica a toda la app** -> **aquí** (`General/GUIA.md`).
- **El detalle de UNA pantalla o UN módulo** -> el archivo de esa pantalla, en la
  tabla del final. Son cuatro, y se llaman solos.
- **El porqué de las cosas viejas** -> `General/HISTORIA.md`.
- **Acuerdos de trabajo y panorama de proyectos** ->
  `Documents\Default Project\General\GUIA-PROYECTOS.md`.
- Si algo aplica a dos, va **una línea que apunta** al otro, nunca una copia.
  Ese fue el origen de la duplicación que se limpió el oct-2026.

**Regla para pantallas y módulos nuevos (obligatorio):**

Cuando se cree o se modifique una pantalla, un módulo o un juego, **la
documentación de detalle va directamente a su propio archivo en
`General/`**, nunca a `GUIA.md`. Ejemplos:

- Pantalla nueva `X/` -> crear `General/X.md` con el detalle de esa pantalla.
- Módulo nuevo `modulo.js` -> crear `General/Modulo.md` con el detalle de ese módulo.
- Juego nuevo `Juego/` -> crear `General/Juego.md` con el detalle de ese juego.

En `GUIA.md` solo se deja **una línea de apunte** que apunte al archivo
correspondiente, en la tabla de documentos de detalle al final de este archivo.

**Nunca** se agrega detalle de una pantalla o módulo dentro de `GUIA.md`.
Si algo empieza con "antes se hacía X" o lleva una fecha de hace meses, va a
`General/HISTORIA.md`, no aquí.


## Estado de las reglas de Firebase (cerrado y revisado)

**Las reglas de `solicitudes` estan CERRADAS y fueron revisadas el 6-oct-2026.**
El aviso anterior de este documento decia que estaban abiertas: **era falso**.

Se cerro lo que si estaba abierto:

1. **Nadie puede crear una solicitud con el correo de otro.** Era la forma de
   "echar" a un cliente (el listener borra codigos con `estado:"revocado"` sin
   validar firma). Ahora `create` exige el correo verificado de quien pide.
2. **La lista de correos que publican ya no es publica.**

Sigue abierto **a proposito y por arquitectura**: el menu y los juegos leen
`solicitudes` **sin internet y sin sesion**, asi que `read` no puede cerrarse
sin romper el modo sin conexion. Por eso los correos de clientes son legibles.
Ese es el trabajo pendiente, no un descuido.

**Texto integro de las reglas vigentes y de las anteriores de respaldo:
`General/reglas-firebase-taquilla.txt`.**

**Si alguien toca las reglas, hay que probar 4 cosas** (pedir, aprobar, revocar
y el Panel). La razon en el archivo, seccion 5.

Todo lo demas de la Fase 1 (modo invitado, sala, `Encuentros/`) esta **cerrado,
verificado y probado por Fredy**, con **una excepcion ya encontrada**: la vuelta
automatica del invitado al abrir la app **nunca se ejecutaba** (oct-2026, ver
*El invitado vuelve solo al abrir la app*). Su relato esta en `HISTORIA.md`,
Partes 1 y 2.

---

> Licencias, acceso.js y el catálogo -> ve General/Modulo-Acceso.md (detalle del módulo de licencias, qué exporta y cómo quedó cada página)
> Autorizar/: aprobar y revocar licencias -> ve General/Autorizar.md (detalle de la pantalla de licencias, login de Google y llave privada)
> **Decisiones tomadas por pantalla** → ve `General/Pantallas.md` (detalle de decisiones específicas de cada pantalla: Citas, Encuentros, Guiadas, Retos, Roles, Opciones, Diablitos, Usuarios)

> oct-2026: el estado de la base de datos (que colecciones hay, que campos, que
> esta duplicado, que esta mal y cual es el plan para normalizarlo) esta en
> **`General/Modelo-Datos.md`**. Es una **propuesta, no un cambio aplicado.**
> Ahi tambien estan 3 fallas verificadas con numero de linea que conviene mirar
> antes de tocar Retos o el modo invitado.

**Que hay en esta seccion, y en que orden leerla:**

| Si quieres... | Busca |
|---|---|
| **Los pendientes** (lo que falta) | *Pendientes de licencias* y *Otros pendientes* |
| **El invitado que entra con la partida empezada** | *Invitado a media partida: acciones distintas* |
| **Lo que ya se sabe que no se arregla** | *Limites conocidos* |
| **Las medidas oficiales** de botones, tarjetas y titulos | *Estándares de tamaño de la interfaz* |
| **A donde regresa cada boton** | *Dónde va cada "Volver"* y *Botones de volver y de esquina* |
| **Los acuerdos que NO se tocan** | *La base de cada PAREJA* y *Reglas de `solicitudes`* |
| **La campana del Chat** y el boton Invitar | *Invitar al Chat* |
| **Los modulos que usa toda la app** | *Los cuadros de la app: `confirmar.js`*, *fuegos artificiales*, *chorro de pegamento* |
| **Las pantallas de configuracion** | *Pantallas de configuracion: Actividades y Accesorios* |

Lo que esta mas abajo de esta seccion son **especificaciones de una pantalla**
(fuegos, pegamento, IA de Acompanante, Centro de Adquisiciones). Son_current, si
tocas esa pantalla, las necesitas. Si solo buscas una regla o un pendiente, esta
todo arriba.

### La base de cada PAREJA: reglas ABIERTAS a proposito (no tocar)

Los proyectos de cada pareja se instalan con `allow read, write: if true`
(`README.md`, paso 2). **Es una decision, no un descuido, y no se cambia.**

**Por que:** la app de la pareja **no inicia sesion** contra su propia base.
Ninguna pagina se autentica (el import de auth en `Guiadas/` esta de adorno y no
se usa). Sin login, las reglas **no pueden** distinguir a nadie: cerrarlas rompe
la app entera.

**La proteccion real (login + reglas por correo) llega con el rediseno de
arquitectura, DESPUES** de terminar y probar la app. Es un proyecto aparte, no un
cambio de reglas.

**Consecuencia que hay que saber:** quien tenga la configuracion de una pareja
(por ejemplo un invitado, o quien escanee su QR) puede leer y escribir toda su
base, incluidas las actividades y el contenido personalizado. Lo unico que la
protege hoy es que la configuracion se comparta con gente de confianza.

**Lo que SI seria seguro, pero tampoco se hace sin preguntar:** limitar las
reglas a las 13 rutas que la app usa
(`config/ajustes`, `nivelesActividad`, `actividadesExtra`, `accesoriosExtra`,
`presetsActividad`, `citas`, `retos`, `puntosUsuarios`, `chat`, `presencia`,
`invitaciones`, `sesionEncuentros`, `sesionGuiada`). Hoy esta abierto "cualquier
ruta". Eso **no** protege el contenido, solo cierra lo que no se usa.

**Esto ya se propuso una vez sin estar escrito** (oct-2026), y Fredy tuvo que
recordar el acuerdo. Si alguien -persona o modelo- propone cerrar estas reglas o
ponerle candado a `Citas/actividades.html`, **que avise primero.**

### Reglas de `solicitudes`: cerrado (resuelto 6-oct-2026)

**Lo que se cerro:**
- `create` ya no acepta una solicitud con el correo de otro cliente (era la
  forma de "echar" a un cliente). Exige el correo verificado de quien pide.
- `config/permisos` ya no es legible por cualquiera.

**Lo que sigue abierto, y por que esta bien:**
- `read: if true` en `solicitudes`. El menu y los juegos leen esa coleccion
  **sin internet y sin sesion de Google**. Cerrarla rompia el modo sin
  conexion. Por eso los correos de los clientes siguen siendo legibles: es el
  precio consciente de que el juego funcione offline.

**Como volver atras:** `General/reglas-firebase-taquilla.txt` tiene el texto
vigente y el anterior completo. Pegar el anterior y listo.

**Como no romperlo:** si se tocan las reglas, probar las 4 cosas de la
seccion 5 del archivo (pedir, aprobar, revocar, Panel). Y probar "pedir" con
una cuenta que **no** sea publicador, o la prueba no vale.

**El trabajo de arquitectura que queda:** mover el correo del cliente a otra
coleccion (3 archivos: `Tienda`, `Autorizar`, `acceso.js`) y, mas adelante,
aislar cada cliente en su propia ruta. Requiere el permiso de `borrar`, que
hoy no esta en las reglas. Ver `GUIA.md`, *Licencias, `acceso.js` y el catálogo*,
sección 6.

### Estado de las revocaciones (oct-2026, verificado)

**Lo que YA funciona, y funciona "en vivo":** `escucharItem()` / `escucharCatalogo()`
(`acceso.js`) están conectados en **6 pantallas**: el menú, la tienda y los cuatro
juegos con licencia (`guiadas`, `encuentros`, `opciones`, `roles`). Cuando en
`Autorizar/` se aprieta **Revocar**, el documento viaja solo al celular: se borra el
código local y el juego **enseguida** muestra la pantalla de bloqueo, el menú quita
la tarjeta y la tienda lo desmarca. Sin que el cliente recargue nada.

**Los dos huecos, y por qué NO se arreglan hoy:**

| Hueco | Por qué no importa / por qué se espera |
|---|---|
| **Sin internet**, el código guardado en el celular sigue firmado y válido | **No es un hueco real: el juego NO se puede jugar sin internet.** Las opciones, los personajes y las acciones se leen de Firestore al jugar; en el celular no hay copia. Sin red no hay nada que jugar. |
| **Alguien a quien revocan puede seguir jugando hasta cerrar y reabrir la app** | Es el único que queda. Al reabrir, el menú lo bloquea. Se cierra en caliente cuando exista login (ver *La base de cada PAREJA*), y hoy no se toca. |

> **OJO, dato que NO hay que suponer (oct-2026):** el escuchador de
> revocaciones **solo se prende en la pantalla de BLOQUEO** (`escucharAprobacion()`
> se llama justo después de `ver("vistaBloqueo")`, en los cuatro juegos). **Una vez
> que entraste, no se queda vigilando.** No se debe decir "le salta al instante
> mientras juega": no es así.

### Pendientes de licencias — **EN ESPERA HASTA EL CAMBIO DE ARQUITECTURA**

> **Decisión de Fredy (oct-2026): estos CINCO pasos no se hacen ahora.** No son un
> descuido ni un olvido. Casi todos cuelgan de la **misma pregunta, "¿quién es
> cada quien?"**, y eso es exactamente lo que responde el cambio de arquitectura
> (login + reglas por correo). Hacerlos hoy sería tirar el trabajo a la basura:
> - El **código en el celular** desaparece cuando la licencia se consulta al servidor
>   con identidad real (pasos 3 y 5).
> - La **cola de solicitudes** deja de ser una colección pública de correos y pasa a
>   ser una lista de cuentas (pasos 1 y 4).
> - **La revocación en caliente** la resuelven las reglas, sin una verificación en
>   cada pantalla (paso 2).
>
> **El permiso de `borrar` en `solicitudes`** va aquí también: es para el rediseño
> de la cola, o sea, viene después. Es **manual, en la consola de Firebase**, y hay
> que probar las 4 cosas (pedir, aprobar, revocar, Panel), pidiendo con una cuenta
> que **no** sea publicador.

| # | Paso | Por qué espera |
|---|---|---|
| 1 | ~~Revisar las reglas de Firebase~~ **[HECHO: revisadas y cerradas. Ver `General/reglas-firebase-taquilla.txt`.]** | — |
| 2 | Revocación al entrar en cada página | La cierran las reglas del login |
| 3 | Catálogo marcando lo que ya tienes | Se consulta al servidor, no al celular |
| 4 | Cola con acuse + revocaciones persistentes | Necesita identidad real |
| 5 | Doc por ítem + cortesía a local | Se borra elalmacén local del celular |

> **ANTES DE VENDER (oct-2026):** con la familia probando esto da igual, pero al
> vender ya no son conocidos y son clientes. **Hay que revisar el hueco de la
> revocación** (el de "sigue jugando hasta cerrar y reabrir"). No antes de vender:
> tampoco urge cambiar la arquitectura todavía.

### Otros pendientes

- **Reparto parejo en Multi (IMPLEMENTADO oct-2026, pendiente prueba en vivo):** el reparto **en rueda** (tomar una acción de cada actividad por turnos hasta juntar las tomas, sin repetir hasta agotar el pool; la actividad con menos acciones aporta todo lo que tiene) ya lo usa el juego nuevo, y **Guiadas y Encuentros ya tienen el código** (reemplaza el mínimo de Guiadas y el pool proporcional de Encuentros) y Guiadas ya tiene el paso de tomas de Encuentros. **Falta probarlo en vivo** en los tres.
- **Juego “El Precio del Placer” (castigos) — IMPLEMENTADO (oct-2026), pendiente solo la prueba en vivo:** juego independiente, con colecciones propias (`castigosExtra`, `nivelesCastigo`, `accesoriosCastigo`, `imposicionesCastigo` por lado y su sesión). Incluye una **pantalla nueva en `Panel/`** para crear los **castigos oficiales** (`ofc_...`, pack/licencia propio como los `of_...` de actividades): acciones por nivel y lado, tomas sugeridas y medidas sugeridas; **sin accesorios** (los asigna cada pareja). Los oficiales salen como **tarjeta en el Centro**, como las actividades oficiales. Checklist de pruebas en **`General/Plan-Castigos/08-Pruebas-En-Vivo.md`**.
- ~~Rotar la llave expuesta~~ **REVISADO oct-2026: no hay ninguna llave
  expuesta.** Lo que decía esto era el marcador `PON_AQUI_TU_KEY` de
  `Default Project\General\README.md`: un espacio reservado, no una llave real, así
  que **no hay nada que rotar**. Se reviso el repo entero buscando llaves con
  forma de secreto (`AIza...`, `-----BEGIN`, `sk-...`) y lo único que hay es la
  API key de Firebase de `taquilla-juegos` y la mitad **pública** del par de
  licencias: **las dos van al repo por diseño**. La mitad privada no esta en
  ningún archivo (solo en `localStorage` del aparato del desarrollador).
  **Lo que sí queda para la arquitectura nueva** es el login con reglas por
  correo, que es lo que protege de verdad la base de cada pareja (ver *La base de
  cada PAREJA*). **Único cuidado de aquí en adelante:** no pegar una llave real
  en ese `README.md`, porque esa carpeta se lee en cada conversación.
- **Probar la vuelta automatica del invitado al abrir la app** (arreglo oct-2026,
  ver *El invitado vuelve solo al abrir la app*): un invitado con QR y partida en
  curso NO debe ser expulsado; uno sin partida debe volver solo.
  ~~**PROBADO EN VIVO: las dos pasaron.**~~
- **Favores Express** — **construida y probada en vivo** (Fredy, oct-2026). El modulo
  es `favor.js` y tiene su propia seccion mas abajo, en
  **Favores Express (`favor.js`)**. El plan de desarrollo ya **no existe**: se
  borro al quedar probado, y lo que valia se paso aqui.
- **Los cambios de puntos se hacen libres, y es A PROPOSITO** (decision de Fredy):
  los numeros del 🛒 se cambian sin que el otro acepte, que es lo que se usa para
  probar sin molestar. **No es un pendiente ni un descuido.** Lo que queda es
  quitarlo cuando llegue el rediseno de arquitectura (login + reglas por correo),
  y entonces aplicara al Centro **y** a los Favores Express. **No "arreglarlo"
  antes de eso.**
- Sala de espera: **PROBADA EN VIVO** con dos telefonos reales (Fredy, oct-2026).
- Sesion de Encuentros en `sesionEncuentros/actual`: la lista de TODOS los
  participantes (incluidos invitados) vive en un solo documento. Confirmar en la
  consola que ese path no queda abierto a lectura ajena.

> Invitado a media partida: acciones distintas -> ve General/Invitado-a-media-partida.md (regla vigente para invitado que entra con partida empezada)
### Limites conocidos (no bloquean)

| Limite | Nota |
|---|---|
| Invitado apaga el celular o pierde red | Sigue en el turno. Mitigacion: "Saltar turno" del anfitrion |
| **Sin internet**, el invitado no se expulsa al abrir | Deliberado: no se expulsa a nadie de una partida en curso por un corte de red |
| Invitado que nunca recibe invitacion | Espera indefinidamente en la sala. Cerrar la app lo resuelve |
| Escaneo y se salio | Se pierde el QR y hay que escanear de nuevo. Si **todavía no se ha jugado nada**, volver a escanear devuelve la misma ficha y sus puntos (oct-2026). **Si ya jugó y lo expulsaron**, vuelve como ficha nueva y en 0: el registro es temporal (ver *Registrarse por QR otra vez*) |
| Varios juegos con invitación a la vez | **Resuelto (oct-2026):** la sala muestra **una sola carta**, la **más reciente que se pueda entrar** (se ordena por `actualizadaEn`). Antes ganaba la primera del listado, y esa sale por **orden alfabético** del nombre interno (`encuentros` < `opciones`), o sea siempre la misma. Importante: si la más reciente está **en pausa no gana**, para que el invitado no se quede sin poder entrar a ninguna |
| Datos viejos de "invitado de invitado" | No se limpian (ya estaba en pendientes) |
| El retorno del invitado se evalua **solo en el inicio** | Si abre `Encuentros/` por link guardado, el chequeo no corre |
| Doble `getDocs` de `escucharCatalogo()` | No es bug, solo gasto extra |
| Una sesion vieja marcada `activa: true` sigue contando | El aviso nuevo si se ata a la sesion, pero una partida vieja abierta no se autodetecta |

### Estándares de tamaño de la interfaz

**Regla: lo nuevo se copia de la pantalla inicial (`index.html`).** No se inventan
medidas ni se pregunta por ellas: ya están decididas. Están también en
`AGENTS.md`, que se carga solo al abrir el proyecto.

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

**Por qué existe esta tabla:** Fredy tenía que pedir repetidamente que los
botones de menú y submenús salieran del mismo tamaño. Oct-2026.

**Lo que hay hoy (desorden heredado, no se arreglar de golpe):**

| Archivo | Relleno | Redondeo |
|---|---|---|
| `index.html` `.btnUsuario` (pantalla inicial) | 16px | 16px |
| `Guiadas` `.btnPri` / `.btnAct` | 16px | 14px |
| `Guiadas` `.btnSec` | 12px | 14px |
| `Tienda` `.btn` | 13px | 12px |
| `Panel` `.btn` | 12px 18px | 12px |
| `Panel/catalogo` `.btn` | 12px 14px | 12px |

Unificar los viejos es trabajo aparte, pantalla por pantalla, porque requiere
verlos. **Lo que si se aplica desde ya: todo lo nuevo usa la tabla.**

### Comunicaciones: el cuarto submenú

**Antes** el menú tenía cinco entradas, y dos eran casos especiales: **Chat** y
**Acompañante** salían directo como enlaces, sin submenú. Los otros tres
(Experiencias, Juegos, Retos) eran submenús de verdad.

**Ahora (oct-2026)** los cuatro son iguales:

| Menú | Lleva a |
|---|---|
| Experiencias en Pareja | Citas + lo del catálogo |
| Juegos | Diablitos + lo del catálogo |
| Retos | Retos + lo del catálogo |
| **Comunicaciones** 💬 | Chat y Acompañante |

El botón **Comunicaciones** va **al final** del menú, con la descripción
"Chate en vivo y algo más", y dentro la pantalla se llama **"Comunicación y
algo más 😉"**.

Chat y Acompañante tienen su "Volver" y van a `#com`, como todos los demás.

**Las piezas:** `#btnCom`, `#vistaCom`, `abrirCom()` / `cerrarCom()`, y el hash
`#com`. Es el mismo molde que los otros tres submenús.

**Los títulos de los submenús van centrados** (`.subTitulo{ text-align:center }`).
Con "COMUNICACIÓN Y ALGO MÁS", que es largo, se notaba que se quedaba pegado a
la izquierda.

**Y aplicó la lección del bug de Retos:** `#btnCom` **nace visible** y
`renderPacksDeVerdad()` no lo toca. Un submenú con tarjetas escritas a mano no
puede depender del catálogo para que su botón aparezca.

> La campana, el bip y el cartelito del Chat y de los Retos estan en
> **`General/Campana-Pestana.md`**.

### Dónde va cada "Volver"

**Todos a la derecha.** Antes estaban repartidos:

| Pantalla | Antes | Ahora |
|---|---|---|
| Encuentros | izquierda | **derecha** |
| Guiadas | izquierda | **derecha** |
| Diablitos | derecha, pero a 8px/10px | **derecha**, a 20px y con `env(safe-area-inset-top)` |
| Citas, Retos | derecha (en el header) | derecha |
| **Tienda** (secciones Experiencias/Juegos/Extras) | enlace de **texto** arriba ("‹ Centro de Adquisiciones") y, en el Centro, `← Inicio` | **`‹ Volver` en la esquina superior derecha** (`#btnCasa` contextual), como toda la app. Se quitó el enlace de texto. En una sección vuelve al Centro; en el Centro, al menú |

**Lo que se mueve a la izquierda** es el botón **contextual** de cada pantalla:
el engrane, "Jugar", "Configurar". En Guiadas funcionan bien porque **nunca
salen dos juntos**: `#btnCfg` solo en `vistaLista`, `#btnAtras` solo en
`vistaConfig`, `#btnAtrasEd` solo en `vistaEditar`.

> Retos: sale de Experiencias y tiene submenú propio -> ve General/Retos.md (detalle del juego de Retos y su navegación)

**Lo que reportaba Fredy:** al usar el botón de regresar del navegador, las
pantallas se comportaban de una forma muy rara. Pasaba sobre todo en Retos, pero
el defecto era de **los cuatro submenús** (Experiencias, Juegos, Retos,
Comunicaciones), porque es el mismo código.

**La causa era una sola, y era de fondo:** los submenús **no eran pasos del
historial**. `abrirRetos()` etc. solo encendían y apagaban un `display`, sin
`pushState` ni tocar la dirección. El navegador no tenía idea de que ahí había
habido un avance. Y el `#retos` de la barra de direcciones se usaba **solo para
abrir un submenú al entrar**, nunca para registrar la navegación ni para saber de
dónde venías.

**Los cinco síntomas concretos:**

| # | Qué pasaba | Por qué |
|---|---|---|
| 1 | El botón atrás dentro de un submenú no hacía nada (o sacaba de la app) | No había entrada en el historial que deshacer |
| 2 | Volver de Retos al menú y luego regresar de otra pantalla **reabría el submenú solo** | `cerrarRetos()` no borraba el `#retos` de la dirección |
| 3 | Atrás desde `index.html#retos` devolvía a la pantalla anterior de verdad (el Centro de Adquisiciones), no al menú | El "Volver" de la app y el del navegador contaban historias distintas |
| 4 | Al llegar con atrás al menú, **⚙️ y 🛒 desaparecían** | El `hashchange` mostraba el menú pero no devolvía los dos botones que los submenús apagan (`index.html:1051-1054`); solo lo hacía `mostrarMenu()`, al que nunca llamaba |
| 5 | En `Retos/centro.html`, de la Tienda con atrás salías en **Deseos** | `navTienda` llamaba `ver("vistaCatalogo", false)` y ese `false` **no guardaba el paso** |

**Lo que quedó (decidido por Fredy):** un submenú abierto **es** un paso real del
historial, guardado con `pushState` y deshecho con `history.back()` — el mismo
patrón que ya usaban `Encuentros/`, `Guiadas/` y el propio `centro.html`. Así el
botón atrás del celular y el "‹ Volver" hacen **lo mismo**, y el botón "adelante"
también sirve.

**El engrane del menú (⚙️) se corrigió igual (oct-2026).** Invitados, Usuarios,
Telegram y "Cambiar usuario" también son **pasos del historial**:
`{gear:"root"}`, `{gear:"inv"|"usu"|"tg"}` y `{gear:"cambiar"}`. Así el botón
atrás del celular y el "‹ Volver" regresan al mismo lugar: de una subpantalla a
las 3 tarjetas, y de ahí al menú (`mostrarGear()` / `cerrarGear()`). Sus tres
botones dicen **"‹ Volver"** (antes decían "Invitados" / "Atrás").

**La Tienda (`Tienda/index.html`) también (oct-2026):** su `‹ Volver` usa
`history.back()` cuando se llegó desde otra pantalla del sitio, y cae a la ruta
fija si se entró directo (`volverAtras()`), para que el botón y el atrás del
celular no se desincronicen.

| Pieza | Qué hace |
|---|---|
| `verMenu()` | El menú principal + sus dos botones de la esquina. **Nueva**: la necesitaban tres caminos (`mostrarMenu`, el "‹ Volver" y el `popstate`) y por eso el 4 se rompía |
| `hashActual()` | Lee el `#` normalizado (`#extras` → `retos`) |
| `abrirSegunHash(h)` | Abre el submenú que diga el `#`, o el menú si no dice ninguno |
| `abrirSub(h)` | El botón del submenú: `pushState({sub:id}, "", "#"+id)` y lo muestra |
| `cerrarSub()` | El "‹ Volver": `history.back()`. Si el paso **no** es nuestro (se llegó por el "Volver" de un juego o por la dirección escrita a mano), quita el `#` a mano en vez de saltar de vuelta a la partida |
| `popstate` | Nuevo. Obedece al historial en vez de adivinar por el `#` |

**El detalle del paso "fijo".** Al entrar por un enlace (`../index.html#retos`
desde `Retos/index.html`) esa entrada **no la guardamos nosotros**. Por eso
`mostrarMenu()` la marca con `{sub:h, fijo:true}`: así el "‹ Volver" del submenú
**cierra aquí** y no devuelve al usuario a la partida de donde vino. Sin esa
distinción, el "Volver" de un juego y el "‹ Volver" del submenú se peleaban por el
mismo paso.

**Y en `Retos/centro.html`:** `navTienda` ya guarda su paso (`ver("vistaCatalogo")`
sin el `false`), y al salir por el enlace "← Volver" se hace
`replaceState` con la vista que se está viendo. Sin eso, al volver con atrás se
entraba a una vista que ya se había cerrado.

**Regla que queda:** **una pantalla que se apaga y enciende sin cambiar la
dirección es invisible para el historial.** Si el botón atrás del celular tiene que
hacer algo, hay que guardar el paso (`pushState`) — y si la pantalla llega por un
enlace, hay que distinguir ese paso de los que se guardaron a mano (`fijo`).
Lo mismo aplicaba a `Opciones/index.html`, que tenia la misma forma: **ya quedo
arreglado** (oct-2026) y hoy usa `pushState` igual que los demas.

> Flujo de Cambiar usuario y editar nombres/puntos -> ve General/Usuarios.md (detalle de la pantalla de Usuarios)
### Degradado en los títulos

Los `h1` llevan `width:fit-content`. Sin eso la caja ocupa todo el ancho y el
degradado de 90° solo pinta una franja thereof sobre las letras, que se ve
clarita y sin color.

### Botones de volver y de esquina

El estándar está arriba, en las decisiones, y también en `AGENTS.md`.

En `index.html` los submenús se abren con funciones (`abrirJuegos()`,
`cerrarExp()`, …) y **no** con `onclick` en línea. Razón: al arrancar se
comprueba `location.hash` y se llama a la misma función. Si fueran `onclick`
en línea, esa llamada del arranque podría no encontrar el manejador todavía.


Con `#juegos` el submenú de Juegos se abre directo al volver de un juego, sin
pasar por la pantalla inicial.

> Modo invitado: sin salida, vuelve solo al abrir, registrarse por QR -> ve General/Modo-Invitado.md (detalle del modo invitado)
> Iconos dibujados (SVG) en vez de emoji -> ve General/Diablitos.md (detalle visual del juego Diablitos)
> avisarTelegram() vive en telegram.js -> ve General/Telegram.md (detalle del módulo de avisos por Telegram)

> El aviso de 'nuevo' -> ve General/Catalogo.md (detalle del aviso de packs nuevos en el carrito y Centro)

### Notas de mantenimiento

- **Acentos duplicados al guardar texto en Windows:** la causa es que el archivo
  se escribio dos veces (UTF-8 guardado como Windows-1252 y vuelto a guardar).
  A mano no se arregla: hay que deshacer la doble conversion. Se uso
  `Temp\opencode\fixencoding.py` (respaldo en `GUIA-PROYECTOS.md.bak`).
  Al revisar documentos, buscar caracteres CJK: senal de doble conversion.
- **No hay `firestore.rules` en el repo:** las reglas viven en la consola de
  Firebase. Por eso "revisar las reglas" es siempre una accion manual.
- **Verificación:** el arnés con Chrome se retiró (oct-2026). Hoy lo único
  automático es el **chequeo de sintaxis** en `herramientas/sintaxis/`
  (`extract.py` + `jscheck.py`); el resto se prueba **en vivo**. Ver la nota al
  inicio de este documento.

> Notas de mantenimiento de pantallas específicas -> ve `General/Pegamento-y-Citas.md` (editor de actividades, tomas, Elecciones Peligrosas)
> Juego Elecciones Peligrosas (`Opciones/`) -> ve `General/Opciones.md` (detalle del juego de opciones)
> Juego de Roles (`Roles/`) -> ve `General/Roles.md` (detalle del juego de Roles, duelo, personajes)
> Fuegos artificiales al final de la partida -> ve `General/fuegos.md` (detalle del módulo de fuegos)
> Los cuadros de la app: `confirmar.js` -> ve `General/confirmar.md` (detalle de confirmar() y aviso())
> Los botones de anfitrión tienen que NACER ocultos -> ve `General/Opciones.md` (regla de botones de anfitrión en Opciones y Encuentros)
> La meta de un reto se calcula sola -> ve `General/Retos.md` (detalle del cálculo de metas de Retos)
> Completar un reto NUNCA descuenta puntos -> ve `General/Retos.md` (detalle de puntuación de Retos)

---

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

---

## Tabla de documentos de detalle

| Documento | Que tiene | Cuando se lee |
|---|---|---|
| `General/Pantallas.md` | Decisiones específicas de cada pantalla (Citas, Encuentros, Guiadas, Retos, Roles, Opciones, Diablitos, Usuarios) | Solo si la tarea toca decisiones de una pantalla concreta |
| `General/Modo-Invitado.md` | Modo invitado: sin salida, vuelve solo al abrir, registro por QR | Solo si la tarea toca el modo invitado |
| `General/Diablitos.md` | Iconos dibujados (SVG) del juego Diablitos | Solo si la tarea toca el icono de Diablitos |
| `General/Telegram.md` | `avisarTelegram()`: módulo central de avisos por Telegram | Solo si la tarea toca avisos por Telegram |
| `General/Catalogo.md` | Aviso de "nuevo": packs nuevos en el carrito y Centro | Solo si la tarea toca el aviso de packs nuevos |
| `General/Usuarios.md` | Pantalla de Usuarios: Cambiar usuario, editar nombres y puntos | Solo si la tarea toca Usuarios |
| `General/Modulo-Acceso.md` | `acceso.js`: módulo central de licencias, qué exporta y cómo quedó cada página | Solo si la tarea toca licencias o `acceso.js` |
| `General/Autorizar.md` | `Autorizar/`: aprobar y revocar licencias, login de Google, llave privada | Solo si la tarea toca la pantalla de licencias |
| `General/Favores-Express.md` | `favor.js`: favores expresos, precios del 🛒 y reglas de decisión | Solo si la tarea toca favores |
| `General/Castigos.md` | `Castigos/`: "El Precio del Placer", editor, partida, multi, placer extremo, imposiciones, invitados | Solo si la tarea toca el juego de castigos |
| `General/fuegos.md` | `fuegos.js`: fuegos artificiales al final de la partida | Solo si la tarea toca fuegos artificiales |
| `General/confirmar.md` | `confirmar.js`: cuadros modales de confirmar() y aviso() | Solo si la tarea toca los cuadros de confirmación |
| `General/Opciones.md` | `Opciones/`: Elecciones Peligrosas, modos, reparto, lista de opciones | Solo si la tarea toca el juego de opciones |
| `General/Roles.md` | `Roles/`: Juego de Roles, modos, duelo, personajes | Solo si la tarea toca el juego de Roles |
| `General/duelos.md` | El cuarto modo de `Roles/` (Duelo de seducción): las 4 ramas y sus 2 modalidades | Solo si la tarea toca el modo de duelo |

---

> **Regla:** si lo que se toca es el detalle de una de esas pantallas, se lee
> **ese** archivo. Si es una regla general, esta aqui. Lo que va en uno de esos
> archivos **no** se copia aqui: solo la linea que apunta.
