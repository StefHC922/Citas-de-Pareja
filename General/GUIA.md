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
| **4** | **Licencias, `acceso.js` y el catálogo** | Lo que exporta `acceso.js` y cómo funcionan las licencias |
| **5** | **`Autorizar/`** | Aprobar y revocar, y la llave privada |
| **6** | **Navegación con el botón atrás** | El arreglo de los submenús y las pantallas |

Y los documentos aparte:

| Si quieres... | Lee |
|---|---|
| **El detalle de una pantalla concreta** | **El archivo de esa pantalla**, en la tabla del final |
| **Cómo se está guardada la base, qué está mal y cómo normalizarla** | **`Modelo-Datos.md`** |
| **Por qué se hizo cada cosa** (el porqué de un arreglo viejo) | **`HISTORIA.md`**, solo si la tarea toca esas áreas |

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

**Y una regla más, que salió de esto mismo (oct-2026):** este archivo tiene que
poder leerse de arriba a abajo **sin que se le expire el contexto**. Si al
agregar algo lo conviertes en un diario fechado, **ese texto va a
`HISTORIA.md`**, no aquí. La señal es sencilla: si empieza con "antes se hacía X"
o con una fecha de hace meses, es diario.

**Y la otra, del mismo día (oct-2026):** si un renglón describe **una sola
pantalla** y no lo vas a leer seguido, **no crece aquí**: se va a su archivo. No
porque `GUIA.md` se pasara de tamaño, sino porque lo que se lee todos los días
se tiene que poder leer completo. Cuando se partió, `GUIA.md` pasó de 2,274 a
1,417 líneas.

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

## Licencias, `acceso.js` y el catálogo

> Origen: `Modulo-Accesos.md` (04/10/2026), conservado literal. El modulo
> `acceso.js` centraliza la logica de licencias que antes estaba copiada en 4
> paginas. **Nada de esto existia en la Fase 1** (ver `HISTORIA.md`).


#### 1. Qué se hizo

Antes, la lógica de licencias estaba **copiada** en 4 páginas. La consulta
problemática (`solicitudes` con `limit(30)`) estaba escrita **8 veces**.

Ahora las 4 páginas importan todo de un solo archivo: **`acceso.js`**.

**Este refactor NO cambia el comportamiento.** La app debe seguir
funcionando exactamente igual. Solo se eliminó la duplicación.

Motivo real del refactor: con la lógica en 8 lugares, cualquier corrección
del límite de 30 había que aplicarla 8 veces, y era fácil olvidar una. Con
el módulo, es una sola vez.

#### 2. Qué exporta `acceso.js`

| Export | Qué hace |
|---|---|
| `miProyecto()` | ProjectId de la pareja. **Se lee en cada llamada**, no al cargar el módulo, porque el Asistente puede escribir el config en `localStorage` después de que la página cargó |
| `appTaq()` | Instancia de la base de taquilla (nombre `"taquilla"`), creada una sola vez |
| `leerLicencias()` | Lee `localStorage["licencias"]` → `{ [item]: "codigo.firma" }` |
| `guardarLicencias(obj)` | Sobrescribe el objeto completo |
| `guardarLicencia(item, cod)` | Guarda un código para un item |
| `quitarLicencia(item)` | Borra el código de un item, sin tocar los demás |
| `tieneCodigoValido(item)` | Verifica firma + item + para + vencimiento |
| `tengoAcceso(item)` | Atajo de `tieneCodigoValido` |
| `oficialesAprobados()` | Packs oficiales que el usuario ya tiene autorizados |
| `escucharItem(item, hooks)` | Escucha **un** item. `hooks.revocado()` / `hooks.aprobado()`. Devuelve la función para cancelar |
| `escucharCatalogo(hooks)` | Revisa **todo** el catálogo. `hooks.cambio(licencias)` |
| `graciasDisponibles()` | Mapa `"item\|email"` → `true` de cortesías sin usar |
| `nuevosSinPedir(packs)` | Mapa `{idDelPack: true}` de lo que está **nuevo Y sin pedir**. Ver *El aviso de "nuevo"* |

##### Decisión de diseño: los nombres

Se conservaron los nombres que el código **ya usaba** (`miProyecto`, `appTaq`,
`leerLicencias`, `quitarLicencia`…), no nombres nuevos más claros. Motivo:
así **casi ninguna llamada cambia** y el diff es mínimo, que es lo que hace
seguro un refactor de este tipo.

Excepción: en Tienda e index el lector local se llamaba `leerLic()`; se
estandarizó a `leerLicencias()` (9 call sites, cambio mecánico).

##### Decisión de diseño: las rutas

`acceso.js` está en la **raíz** y hace sus propios imports con rutas relativas
a sí mismo (`./firebase-config.js`, `./config.js`, `./taquilla.js`).

Las rutas de un módulo se resuelven contra la **ubicación del módulo**, no
contra el archivo que lo importa. Por eso el mismo archivo funciona igual
desde el índice (`./acceso.js`) que desde una carpeta (`../acceso.js`), sin
duplicarlo.

#### 3. Cómo quedó cada archivo

##### `acceso.js` (nuevo, 227 líneas)

Contiene toda la lógica compartida, comentada. Incluye las dos consultas
antes repetidas y el `TOPE = 30` en una sola constante con la advertencia
del problema documentada.

##### `index.html` (menú) — 1149 → ~1055 líneas

| Antes | Ahora |
|---|---|
| `leerLic()` local (3 líneas) | importa `leerLicencias()` |
| `getApp("taquilla-menu")` + `initializeApp` en 3 sitios | `appTaq()` del módulo |
| `gracias` armado a mano (líneas 501-513, con `limit(30)`) | `await graciasDisponibles()` |
| `escucharRevocadosMenu()` (42 líneas, con `limit(30)`) | `escucharCatalogo({ cambio(){ renderPacks(); } })` |

Lo que **quedó aquí**: `tarjetaPack()`, el dibujado del catálogo, el Asistente,
el modo invitado y la pantalla de identidad. Nada de eso se tocó.

##### `Tienda/index.html` — 404 → ~334 líneas

| Antes | Ahora |
|---|---|
| `appTaq()`, `miProyecto()`, `leerLic()`, `guardarLic()`, `CLAVE_LIC` | importados del módulo |
| `licenciaValida(item)` (6 líneas) | `tieneCodigoValido(item)` del módulo |
| `escuchar()` (49 líneas, 2× `limit(30)`) | `escucharCatalogo({ cambio(){ pintar(); } })` |

Lo que **quedó aquí**: el pintado de tarjetas, el buscador, el login con
Google, la petición del item (`addDoc`) y el flujo de re-pedido.

##### `Guiadas/index.html` — 1367 → ~1258 líneas

| Antes | Ahora |
|---|---|
| `CLAVE_LIC`, `miProyecto()`, `leerLicencias()`, `tengoAcceso()` (17 líneas) | importados |
| `appTaq()` | importado |
| `quitarLicencia()` | importado |
| `escucharAprobacion()` (53 líneas, con `limit(30)`) | `escucharItem(ITEM_ID, { revocado, aprobado })` — 11 líneas |
| `oficialesAprobados()` (17 líneas) | importado |
| `localStorage.setItem(CLAVE_LIC, …)` en 2 sitios | `guardarLicencia(ITEM_ID, cod)` |

Lo que **quedó aquí**: todo el juego (niveles, lados A/B, tomas, MultiActividades,
sesión compartida, editor de actividades).

##### `Encuentros/index.html` — 1016 → ~921 líneas

Migración **idéntica** a Guiadas (era una copia de ese mismo bloque).

| Antes | Ahora |
|---|---|
| `CLAVE_LIC`, `miProyecto()`, `leerLicencias()`, `tengoAcceso()` | importados |
| `appTaq()`, `quitarLicencia()` | importados |
| `escucharAprobacion()` (50 líneas, con `limit(30)`) | `escucharItem(...)` |
| `oficialesAprobados()` | importado |

Lo que **quedó aquí**: la generación de listas por cabeza, los turnos por
rondas, `runTransaction`, las tomas, el modo local sin internet.

#### 4. Lo que NO se tocó, y por qué

##### Las 4 consultas que siguen en las páginas

| Archivo | Línea | Por qué no se centralizó |
|---|---|---|
| `Guiadas/index.html` | 299 | La cortesía necesita **escribir** `graciaUsada` en el documento |
| `Encuentros/index.html` | 373 | Ídem |
| `Tienda/index.html` | 164 | Ídem |
| `Tienda/index.html` | 279 | Evita pedidos duplicados: necesita comparar con las **solicitudes previas** |

No se movieron porque no son solo lectura: dependen del `doc.id` para poder
escribir. Centralizarlas exigiría un rediseño (la cola con acuse de
`Soluciones.txt`), no un simple traslado.

##### Detalle de la instancia de Firebase

Antes `index.html` usaba el nombre `"taquilla-menu"` y las otras tres
páginas `"taquilla"`. Ahora **todas usan `"taquilla"`** (la constante
`APP_TAQ` del módulo). Misma configuración, así que es equivalente, pero
hay una instancia menos.

##### Diferencia de comportamiento menor (intencional)

`escucharCatalogo()` hace una lectura extra (`getDocs`) cada vez que se
dispara el listener, porque fusionó las dos versiones que existían (la del
índice usaba solo el snapshot, la de Tienda re-leía). Lee los mismos datos;
solo cambia quién los pide.

#### 5. Verificación hecha

Como no hay Node en la máquina, se escribieron verificadores en Python
(`Temp\opencode\`):

- **`jscheck.py`** — equilibrio de `{}[]()`, ignorando strings, comentarios y
  regex literales. Los 7 archivos pasan.
- **`undef.py`** — detecta funciones llamadas pero no definidas ni importadas
  (la causa clásica de pantalla en blanco). Los 7 archivos pasan.
- **`expcheck.py`** — comprueba que **todo lo que las páginas importan de
  `acceso.js` exista de verdad**. Esto es crítico: en módulos ES, importar un
  nombre inexistente rompe la página entera.
- **`argcheck.py`** — que las llamadas a las funciones de `acceso.js` lleven los
  argumentos correctos.
- **`dupcheck.py`** — que no haya nombres declarados dos veces en un mismo
  archivo. Esto detectó dos fallas reales durante el refactor.

Estado: los 6 avisos restantes del verificador son falsos positivos
preexistentes (identificados **antes** de tocar los archivos).

##### Verificación en el celular — HECHA (oct-2026)

No hay navegador ni celular en este entorno, así que esta lista se pasó para
que la probara Fredy. **Las 4 quedaron probadas y funcionando:**

| # | Prueba | Resultado |
|---|---|---|
| 1 | Abrir el **menú** en incógnito → cargan las tarjetas y un producto con acceso aparece | OK |
| 2 | Entrar a **Citas Guiadas** y a **Encuentros** → no sale la pantalla de acceso bloqueado | OK |
| 3 | En la **Tienda**, pedir algo desde otro navegador → se activa solo | OK |
| 4 | Revocar desde **Autorizar** → la tarjeta desaparece del menú | OK |

**Con esto el refactor de `acceso.js` queda cerrado: no rompió nada.**

Si alguna vez una de las 4 falla, el error más probable es una ruta de import
mal escrita: se ve en blanco la pantalla y la consola dice "Failed to resolve
module specifier".

#### 6. El límite de 30 — ELIMINADO (oct-2026)

**Resuelto.** Cuando se escribió este documento, el tope seguía puesto a
propósito (ese paso era solo centralizar). Después se quitó.

##### Por qué se quitó, y por qué NO se usó `orderBy`

La primera idea fue `orderBy("fecha","desc")` para que entraran las 30 más
recientes. Se descartó por dos razones:

1. **No arregla el caso peligroso.** Sigue devolviendo solo 30. Una revocación
   antigua podía seguir sin verse.
2. **Exige crear un índice compuesto** (`para` + `fecha`) en la consola.

Y el motivo para cortar desapareció al revisar el diseño: **la lista no crece
sola.** La Tienda reutiliza la misma solicitud por (correo + producto), así que
hay como máximo un documento por producto y usuario —unas decenas por pareja,
no miles—.

##### Qué se cambió

Se quitaron los 6 topes y la constante `TOPE`:

| Dónde | Qué era |
|---|---|
| `acceso.js` → `consultaSolicitudes()` | Cubre `escucharItem` y `escucharCatalogo` |
| `acceso.js` → `graciasDisponibles()` | El mapa de cortesías |
| `Tienda/index.html` | El control de duplicados y la cortesía |
| `Guiadas/index.html` | La cortesía |
| `Encuentros/index.html` | La cortesía |

Ahora cada consulta lee **todas** las solicitudes de la pareja. Efectos:

- Las aprobaciones nuevas siempre se ven (el usuario no se queda bloqueado)
- Las revocaciones antiguas también se ven (el revocado no sigue jugando)
- El control de duplicados vuelve a funcionar → la lista deja de crecer

##### Costo

Bajo, porque la lista es chica por diseño. Firestore cobra por documento leído;
una pareja normal tiene unas decenas, contra una capa gratis de 50,000 lecturas
al día **por proyecto**. ~~El detalle está en `General/Escala-Millones.md`.~~
**Ojo: ese archivo nunca existió en el repo** (oct-2026, revisado). Si algún
día hace falta el cálculo, se hace aquí y se deja escrito.

##### Lo que NO se tocó

El Panel (`Autorizar/`) ya leía todas las solicitudes (usa `orderBy` sin tope),
así que no necesitó cambios.

##### Verificación

Los 5 verificadores pasan: sintaxis, referencias, argumentos, imports y
nombres duplicados.

#### 7. Siguiente paso

 Según lo acordado, el orden es:

1. **Revisar las reglas de Firebase** en la consola — bloqueante, porque el
   rediseño necesita que la app pueda **borrar** en `solicitudes`.
2. Revocación al entrar en cada página (cierra el acceso por URL directo).
3. Catálogo marcando lo que ya tienes desde local.
4. Cola con acuse (aprobaciones) + revocaciones persistentes.
5. Doc por item + cortesía a local.

Todo está detallado en `Descargas\Soluciones.txt` y los pendientes en
`Descargas\Problemas 2.txt`.

---

## `Autorizar/`: aprobar y revocar licencias

> Origen: `Modulo-Accesos.md` (04/10/2026), conservado literal.
> **Esta es la unica parte que no existia en ningun otro documento.** Sin ella se
> perdia el hallazgo del login y el estado en que quedaron las reglas.
>
> **Estado (oct-2026):** el login de `Autorizar/` ya esta escrito, pendiente de
> subir. Las reglas siguen abiertas **a proposito y por decision de Fredy**: se
> ### ESTADO REAL (6-oct-2026) - esto sustituye lo que dice el texto de abajo
>
> Las reglas **NO estan abiertas**. Fredy ya las reviso y las dejo cerradas
> (`allow create`, `update` y `delete` con condiciones). El texto original de
> esta parte decia "temporalmente regresadas a `solicitudes: if true`" y
> "`Autorizar/` no se ha subido": **eso era falso** y ya se corrigio.
>
> Lo que quedo abierto de verdad, y **ya se cerro el 6-oct-2026**:
>
> 1. **`create: if true`** permitia crear una solicitud con el correo de otro
>    cliente. Como el listener de `acceso.js` borra el codigo local de quien
>    ve un documento con `estado: "revocado"` **sin validar firma**, eso
>    permitia "echar" a un cliente real. Ahora `create` exige el correo
>    verificado de quien pide y estado `pendiente`.
> 2. **`config/permisos` era legible por cualquiera**, dejando la lista de
>    correos publicadores a la vista. Ahora solo la ven los publicadores.
>
> **Reglas vigentes completas (y las anteriores de respaldo) en
> `General/reglas-firebase-taquilla.txt`.**
>
> Sigue abierto **por decision de arquitectura**: `allow read: if true` en
> `solicitudes`. No se puede cerrar sin romper el modo sin conexion, porque el
> menu y los juegos leen esa coleccion sin sesion. Por eso los correos de los
> clientes siguen siendo legibles. Ver *Licencias, `acceso.js` y el catálogo*,
> sección 6.


#### 8. El inicio de sesión de `Autorizar/` (oct-2026)

##### El hallazgo

Al cerrar las reglas de `solicitudes` (para que solo el publicador pudiera
modificar y borrar), **aprobar y revocar dejaron de funcionar**, sin ningún
error visible.

La causa no era la lista de publicadores ni el correo del dueño. Era que
**`Autorizar/index.html` nunca iniciaba sesión con Google**: no tenía
`getAuth`, ni `signInWithPopup`, ni nada. Otras páginas del Panel sí lo tienen.

Entonces, con las reglas cerradas:

| Regla | Qué pasaba |
|---|---|
| `request.auth` | Siempre `null` (la página nunca se firmaba) |
| `esPublicador()` | Siempre `false` |
| `update` / `delete` | **Siempre rechazados** |
| `create` (pedir) | Funcionaba: no pide sesión |
| `read` | Funcionaba: está abierto |

Y como los botones Aprobar, Revocar y Negar hacían `await updateDoc(...)`
**sin `catch`**, el rechazo no se mostraba. El código aparecía y "desaparecía"
sin ninguna pista.

##### Por qué las reglas viejas estaban abiertas

`solicitudes: if true` no era un descuido. **Era obligatorio**, precisamente
porque `Autorizar/` no tenía forma de identificarse. Al cerrar las reglas se
le pidió ser publicador a una pantalla que nunca inicia sesión.

> **Hoy ya no aplica:** `Autorizar/` **sí** inicia sesión. Esa fue la causa del
> problema y ya está resuelta (ver *El cambio hecho*, abajo).

##### El cambio hecho

En `Autorizar/index.html`:

1. **Botón "Entrar con Google"** + `onAuthStateChanged`, copiando el patrón de
   `Panel/permisos.html`. Ahora `request.auth` sí se llena.
2. **`catch` en Aprobar, Revocar y Negar**, con `alert()` visible. Antes
   cualquier rechazo de reglas era invisible.

Se usó `alert()` y no el `#msg` de la página, porque ese mensaje vive dentro
de la caja de la llave privada, y esa caja se oculta cuando la llave ya está
guardada.

##### La llave del autorizador (y por qué NO está en el repo)

El `Panel/` y el `Autorizar/` piden una **llave privada** en formato JWK
(`{"kty":"EC","crv":"P-256","x":...,"y":...,"d":...}`). **No es una API key de
Firebase**: es la mitad privada de un par **ECDSA P-256** que sirve para
**firmar las licencias** de la tienda.

| Mitad | Dónde | Para qué |
|---|---|---|
| **Pública** | `taquilla.js` (`TAQUILLA_PUBLICA`) | **Verificar** los códigos. Viaja en el repo a propósito |
| **Privada** | **Solo en el aparato del desarrollador** | **Firmar**. Se pega en `Panel/` y `Autorizar/` |

Nunca se sube al repo: quien tenga la privada puede **fabricar licencias**. Se
guarda en `localStorage` bajo la clave `taquilla_priv`, así que **queda solo en
ese navegador y ese dispositivo**.

`Panel/` y `Autorizar/` usan **la misma clave de `localStorage` y el mismo
origen**, asi que **pegarla una vez abre los dos**.

**Rotacion (oct-2026):** la pareja anterior se habia perdido, asi que se genero
un par nuevo con el mismo WebCrypto que usa la app (`crypto.subtle`), y se
cambio `TAQUILLA_PUBLICA` en `taquilla.js`. **Las licencias firmadas con la
llave anterior dejan de validar** (quedan invalidas, no se pueden "arreglar").

Al rotar hay que: 1) cambiar `TAQUILLA_PUBLICA`, 2) pegar la nueva privada en
`Panel/` y `Autorizar/`, 3) volver a firmar los codigos que sigan valiendo.

##### Estado

> **TEXTO VIEJO (oct-2026), ya no es cierto.** Se conserva porque explica el
> orden en que se resolvio. Hoy: **las reglas estan cerradas** (salvo `read`, a
> proposito) y **`Autorizar/` ya esta subido y funcionando**.

- ~~Las reglas están **temporalmente regresadas** a `solicitudes: if true`~~
  ~~(el agujero está abierto otra vez: cualquiera puede leer los correos y
  echar usuarios).~~ -> Cerradas el 6-oct-2026. Ver *Estado de las reglas*.
- ~~`Autorizar/` ya tiene el inicio de sesión, pero **no se ha subido todavía**.~~
  -> **Subido.** Fredy probo pedir, aprobar y revocar: todo normal.

##### La secuencia para cerrar las reglas

1. Subir `Autorizar/index.html` con GitHub Desktop.
2. Abrir `Autorizar/` y tocar **"Entrar con Google"**. Debe aparecer
   `✅ <correo>`.
3. **Solo si el paso 2 funcionó**, volver a poner las reglas cerradas
   en la consola.
4. Probar aprobar y revocar. Si algo falla, ahora sale un aviso.

##### Lección

Al cerrar reglas de Firebase en una app sin login, hay que revisar **cada
pantalla que escribe**, no solo la que se está tocando. `Autorizar/` era la
única del Panel que escribía sin autenticarse, y por eso rompió.

> Regla práctica: **todo botón que escriba en Firestore necesita `catch` con
> aviso visible.** El de Eliminar ya lo tenía; los otros tres no, y eso costó
> un buen rato de diagnóstico.
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
| **Al agregar un invitado en Encuentros** | Se cuela al **final** de `d.orden` y se le copia la lista del companero de su mismo lado. Dos razones: 1) `avanzarSesion()` avanza con `t+1 < d.cabezas.length`, asi que si se agrega a `cabezas` sin agregar a `orden` los indices se descuadran y `d.orden[d.turno]` sale `undefined`; 2) las acciones son las del encuentro y no hay de donde re-asortear sin romper el ritmo. `largo` **no** cambia: el invitado solo juega las rondas que faltaban |
| **Guiadas NO lleva nada de esto** (decision oct-2026) | Su sesion es `{lista:[{lado}], paso}`: una secuencia de pasos YA ARMADA con `paso` como indice. **No tiene `cabezas`, no importa `invitado.js` (no publica invitaciones) y no tiene `escucharGrupo()`.** Agregar a alguien a media partida obligaria a rehacer la lista entera y saltaria el turno de todos. Se decidio no portar QR/panel/"agregar invitado" ahi |
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

### De la forma de trabajar

| Decision | Detalle |
|---|---|
| Fredy decide, el modelo ejecuta | Si algo es decision de producto, **preguntar antes** de aplicar |
| Explicar antes de programar | En espanol claro y sin codigo para el usuario |
| No inventar reglas nuevas de Firestore | Se reutiliza la base y las reglas que ya funcionan |
| No tocar algo que no tenga que ver con el pedido | Cambios minimos y verificables |
| Documentar en este archivo | Es la unica memoria del proyecto |
| Verificar antes de decir "listo" | Pruebas automaticas y, cuando se puede, prueba real en el celular |

---

## Pendientes, límites y mantenimiento

> oct-2026: el estado de la base de datos (que colecciones hay, que campos, que
> esta duplicado, que esta mal y cual es el plan para normalizarlo) esta en
> **`General/Modelo-Datos.md`**. Es una **propuesta, no un cambio aplicado.**
> Ahi tambien estan 3 fallas verificadas con numero de linea que conviene mirar
> antes de tocar Retos o el modo invitado.

**Que hay en esta seccion, y en que orden leerla:**

| Si quieres... | Busca |
|---|---|
| **Los pendientes** (lo que falta) | *Pendientes de licencias* y *Otros pendientes* |
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

### Pendientes de licencias (`GUIA.md`, *Licencias, `acceso.js` y el catálogo*, "Siguiente paso")

1. ~~Revisar las reglas de Firebase~~ **[HECHO oct-2026: revisadas y cerradas.**
   Ver `General/reglas-firebase-taquilla.txt`. Falta solo el permiso de `borrar`
   para el rediseño de la cola.]
2. Revocacion al entrar en cada pagina (cierra el acceso por URL directo).
3. Catalogo marcando lo que ya tienes desde local.
4. Cola con acuse (aprobaciones) + revocaciones persistentes.
5. Doc por item + cortesia a local.

### Otros pendientes

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
- **Favores Express** — idea de Fredy, oct-2026, **NO está construida**. El plan
  completo (flujo, decisiones ya tomadas y lo que falta) está en
  **`General/Plan-Favores-Express.md`**. Ese archivo es **temporal**: cuando la
  función esté probada se borra y lo que valga pasa aquí.
- **Los cambios de puntos deben requerir que los dos acepten.** **Hoy NO está
  hecho**: los números del 🛒 se cambian libremente, que es lo que se usa para
  probar sin molestar. Cuando se arme, aplica al Centro **y** a los Favores
  Express.
- Sala de espera: **falta la prueba con dos telefonos reales** (en vivo).
- Sesion de Encuentros en `sesionEncuentros/actual`: la lista de TODOS los
  participantes (incluidos invitados) vive en un solo documento. Confirmar en la
  consola que ese path no queda abierto a lectura ajena.

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

**Lo que se mueve a la izquierda** es el botón **contextual** de cada pantalla:
el engrane, "Jugar", "Configurar". En Guiadas funcionan bien porque **nunca
salen dos juntos**: `#btnCfg` solo en `vistaLista`, `#btnAtras` solo en
`vistaConfig`, `#btnAtrasEd` solo en `vistaEditar`.

### Retos: sale de Experiencias y tiene submenú propio

**El problema (hallazgo de Fredy, oct-2026).** Retos estaba como **tarjeta fija
dentro de Experiencias** y además existía un submenú "Retos especiales" que
**nunca tenía nada**, porque ningún catálogo usaba `seccion:"extras"`. El botón
"Volver" apuntaba a ese submenú vacío: se veía bien, pero caías en un lugar sin
nada.

**Lo que quedó:**

| | |
|---|---|
| Retos dentro de Experiencias | **Fuera** |
| Submenú "Retos especiales" | Renombrado a **"Retos"**, al mismo nivel que Juegos |
| Submenú de Retos | Con la tarjeta de Retos + lo que llegue del catálogo |
| "Volver" de Retos | A `#retos`, o sea a su submenú |

**Renombres en el código** (oct-2026): `btnExtras`→`btnRetos`,
`btnExtrasVolver`→`btnRetosVolver`, `vistaExtras`→`vistaRetos`,
`packsExtras`→`packsRetos`, `abrirExtras`→`abrirRetos`,
`cerrarExtras`→`cerrarRetos`.

**Por seguridad se aceptan las dos claves** en el catálogo y en el `#`:
`seccion` puede ser `"retos"` **o** `"extras"`, y el `#` puede ser `#retos` **o**
`#extras`. Así, si hay algo viejo dado de alta en el catálogo, sigue apareciendo
en su sitio en vez de desaparecer en silencio.

**Lección:** un juego va en **un** submenú. Si aparece en dos lados, uno de los
dos queda vacío y el botón "Volver" miente.

**El bug queBZ salió de eso (y que casi se va sin ver).** Al poner la tarjeta de
Retos a mano dentro del submenú, el botón **"Retos" desapareció del menú
principal**: `btnRetos` nace oculto y `renderPacksDeVerdad()` solo lo enciende
si la lista de su submenú tiene algo. Esa lista solo se llenaba con el catálogo,
y Retos no viene del catálogo. Resultado: **no se podía entrar a Retos** (lo
reportó Fredy).

**El arreglo fue mover Retos al mismo mecanismo que Diablitos:** está en la lista
`packs` con `seccion:"retos"` y `libre:true`, y en `FIJOS`. Así el botón se
enciende solo y la tarjeta se pinta como las demás.

**Regla que quedó:** si un submenú tiene algo escrito a mano, **ese submenú no
puede depender del catálogo para mostrarse**. O todo pasa por `packs`, o el botón
se enciende siempre.

**Y por eso el `menu` ahora comprueba los tres submenús** (`btnExp`, `btnJuegos`,
`btnRetos`) y que el de Retos traiga su tarjeta. Antes las pruebas pasaban
iguales con el menú roto: nadie miraba esos botones.

### El botón "atrás" del navegador y los submenús (corregido oct-2026)

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

### El flujo de "Cambiar usuario" (y lo que se aprendió)

**Cómo quedó:**

1. En Usuarios, arriba a la izquierda, "Cambiar usuario".
2. Abre la lista de usuarios en la misma pantalla, con **"‹ Volver"** arriba a
   la derecha. Ahí se puede salir sin cambiar nada.
3. Al escoger, recarga (para que la app entera tome la identidad nueva) pero
   deja una marca en `sessionStorage` (`ir_a_usuarios`) y **aterriza de vuelta
   en Usuarios**, no en el menú.

**Lo que estaba mal y por qué importa (hallazgo de Fredy, oct-2026):**

La primera versión **borraba la identidad y recargaba**. De ahí salían dos
molestias:

- **No se podía salir sin cambiar.** Tenías que escoger a alguien.
- **Caías donde se te antojaba.** Al recargar, la app decide según quién eras:
  si el último usuario era invitado, te mandaba a su base; si no, al menú. Por
  eso a veces aparecía Diablitos, a veces el menú de juegos, a veces la
  pantalla inicial.

**La lección, escrita como regla:** una acción que cambia la identidad **no
borra nada antes de tiempo ni recarga a ciegas**. Primero muestra, deja
cancelar, y solo al confirmar recarga — y dice a dónde va.

Las piezas en el código: `modoCambiar`, `CLAVE_IR_USU`, `abrirPanelUsuarios()`.

### Botones de volver, de esquina y "cambiar usuario"

| Botón | Dónde | Nombre |
|---|---|---|
| Volver de un submenú | Arriba a la **derecha**, los tres | `volverSub` |
| Engrane (invitados) | Menú principal, arriba a la **izquierda** | `gearBtn` |
| Carrito (adquisiciones) | Menú principal, arriba a la derecha | `menuBtn` |
| Volver de un juego | Cada juego, dentro de la pantalla | varía |
| Cambiar usuario | Pantalla **Usuarios**, arriba a la izquierda | `invCambiarUsu` |
| Cambiar usuario | **Solo** en Usuarios, no en ninguna otra |

Retos también quedó igual que Citas (oct-2026): **Volver** a Retos especiales (`#extras`) y **sin** "Cambiar usuario".

**Cuidado con los `#`:** si un juego apunta a un `#` que no está en el `if(location.hash)` de `index.html`, **no da error**: simplemente te manda al menú principal. Pasó con `#extras`.

`invCambiarUsu` **no borra nada ni recarga**: abre la lista de usuarios en la misma
pantalla, con un **"< Volver"** para salirse sin cambiar. Al escoger, ahí sí
recarga (marca `ir_a_usuarios` en `sessionStorage`) para que la app entera tome
la identidad nueva, y **aterriza de vuelta en Usuarios**. Antes estaba en
`Citas/` y en `Retos/` (`btnCambiarUsuario`), y ya no existe en ninguno de los dos.

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

### El invitado no tiene salida (`pintarSalidas`)

En `Encuentros/index.html`, `pintarSalidas()` decide si el enlace "‹ Volver" se ve.
Se esconde cuando:

- se está **durante la partida** (para nadie se sale a medias), o
- la persona **es invitada** (`esInvitadoFlag`), siempre, en cualquier pantalla.

Se llama desde dos lugares a propósito:

1. en `ver(id)`, cada vez que se cambia de vista;
2. al final de `cargarIdentidad()`, porque ahí es donde se descubre que la
   persona es invitada. Si solo se llamara en `ver()`, y la identidad carga
   después, el invitado vería la salida un instante.

**Cómo se verificó:** en el arnés (**ya retirado**, ver la nota al inicio), `invitado&respaldo=1` y
`invitado&flag=pausa&respaldo=1` (el invitado es `u3`) reportan `lnkInicio`
**oculto**; los escenarios del anfitrión y `invitado&como=u2&flag=natural`
(que en realidad juega como **la pareja**, no como invitado) reportan
**visible**. Esa distinción importa: `u2` es la pareja, `u3` el invitado.

**Ojo al agregar escenarios:** hay casos llamados `invitado` que en realidad
actúan como la pareja, porque se fuerzan con `&como=u2`. La comprobación
distingue por la bandera `invitado` de la identidad, no por el nombre del
escenario.

### El invitado vuelve solo al abrir la app (arreglado oct-2026)

`volverSiInvitadoSinPartida()` (`index.html`) revisa si el invitado tiene una
partida viva en `sesionEncuentros/actual`. Si no la tiene, `salirDeInvitado()`
lo devuelve a su propio espacio y lo saca de la lista de quien lo invitó.

**Lo que estaba roto:** la ruta se escribia como **un solo pedazo**,
`doc(db, "sesionEncuentros/actual")`. En el SDK eso devuelve una *coleccion*,
no un documento; `getDoc` truena y el `catch` de la linea siguiente se lo come.
`leido` se quedaba en `false`, asi que la linea de guarda cortaba siempre: **la
funcion no podia devolver `true` nunca**. En la practica, **el invitado nunca
volvia solo al abrir la app**.

El juego (`Encuentros/index.html:509`) y la sala (`invitado.js:196`) ya usaban
los dos pedazos correctos. **Solo esta lectura estaba mal** y por eso no se
notaba: las otras dos dan el mismo resultado y nunca fallaban en voz alta.

> **Ojo con lo que dice este mismo archivo:** la Fase 1 del modo invitado
> estaba escrita como "cerrada, verificada y probada por Fredy". **En este
> punto no era cierto**: el criterio se daba por cumplido y nunca se ejecuto.
> Sirve de regla: *probado* significa que se ejecuto, no que se reviso el
> codigo.

**PROBADO EN VIVO (Fredy, oct-2026):** las dos pruebas, las dos pasaron. Un
invitado con partida en curso no es expulsado; uno sin ella vuelve solo a su
propio espacio y sale de la lista de quien lo invitó.

**Al expulsar a un invitado se le pone el saldo en cero** (oct-2026, decisión de
Fredy). `salirDeInvitado()` ya borraba su ficha de la lista del anfitrión; ahora
además deja `puntosUsuarios/{id}` en `0` (**no borra el documento**). Antes ese
saldo se quedaba ahí guardado y **nadie lo volvía a leer jamás**, porque al
registrarse de nuevo el invitado trae otro id. Los saldos que **ya** quedaron
antes de este cambio no se limpian: quedan ahí y se dejan.

### Registrarse por QR otra vez ya no duplica al invitado (arreglado oct-2026)

El registro de invitado (`index.html`, botón "Confirmar") tiene **tres reglas** que
se respetan juntas:

1. **Si esa persona SIGUE en la lista, se entra con SU MISMA ficha.** No se
   crea otra y no sale ningún aviso.

> **Ojo, esto tiene fecha de caducidad:** la ficha **solo existe mientras el
> invitado no haya sido expulsado**. Al terminar el juego, `salirDeInvitado()`
> **lo borra de la lista del anfitrión**. O sea:
>
> | Cuándo | Qué pasa al volver a escanear |
> |---|---|
> | Escaneó, quedó esperando y **vuelve a escanear sin haber jugado** | Misma ficha, **conserva sus puntos**, sin duplicado |
> | **Jugó y lo expulsaron** | Ficha nueva, id nuevo y **0 puntos**. Igual que antes de este cambio |
>
> Los puntos que dejó la ficha vieja **se quedan guardados** en
> `puntosUsuarios/{idViejo}`, pero ya nadie los vuelve a usar.
2. Solo reutiliza una ficha que sea **de invitado** y **del mismo anfitrión**, y
   solo si hay **una sola** con ese nombre. Si hubiera dos "Luis", **no se
   adivina**: se crea una nueva. Nunca puede "&iquo;colarse&iquo;" en la cuenta
   de la pareja.
3. El nombre se compara **sin mayúsculas y sin acentos**: "Jose" y "José" son la
   misma persona (`normalizaNombre()`).

**Lo que estaba roto (dos cosas, de la misma causa):**

| | |
|---|---|
| **Nombre interno repetible** | Se calculaba "el siguiente número disponible", pero el invitado que crea el ⚙️ usa un código con hora y azar que el buscador no veía. Con dos registros en el mismo instante, los dos podían salir con el mismo nombre interno |
| **Se pisaban entre ellos** *(esto no estaba anotado en ningún lado)* | El leer-calcular-guardar iba suelto, sin protección. **Dos personas registrando por QR al mismo tiempo: la segunda escritura borraba a la primera de la lista.** No daba error, el invitado simplemente desaparecía |

**El arreglo:** el identificador nuevo lleva hora y azar (igual que el del
engrane), y todo el leer-calcular-guardar va **dentro de una transacción**, que
vuelve a leer la lista antes de escribir. Si entran dos a la vez, Firestore las
corre una detrás de otra y **las dos quedan**.

**Por qué el identificador con hora puede coexistir con los viejos:** el único
lugar del programa que daba por hecho el formato `u1`, `u2`, `u3` era **esta misma
línea que se cambió**. Ninguna otra parte lee, ordena ni compara ese código
interno: la app siempre muestra el **nombre**. Los usuarios que ya existen no se
tocan.

**PROBADO EN VIVO (Fredy, oct-2026):** las tres pasaron. Volver a escanear con
el mismo nombre devuelve la misma ficha (tambien **sin acentos**: "Jose" y
"José" son la misma persona) y no crea un segundo nombre en la lista; y dos
personas registrándose al mismo tiempo **quedan las dos**, no se pisan.

### Iconos dibujados (SVG) en vez de emoji

`index.html` trae `const SVG_DIABLITOS = '...'`: el diablito malo con risita
maligna. Se inserta con `ic.innerHTML`, pero **solo** para ese juego y **solo**
con el dibujo que esta en el propio archivo.

**Por que asi:**
- Un emoji se ve distinto en cada telefono (el de Diablitos salia morado en
  unos y de otro color en otros). Dibujado, se ve igual en todos.
- El tamano va en el `width` del propio SVG. Ahora es `1.35em`, que es lo que lo deja
  del mismo tamano que los emojis de las otras tarjetas (2.4rem). Ojo: el dibujo solo
  ocupa el 75% del cuadrito, por eso el numero no es 1. Para cambiarlo se toca ese
  unico numero; para cambiar la forma, las coordenadas del dibujo.
- **No se mete nada de la base de datos con `innerHTML`.** La tarjeta de la sala
  (`Diablitos/index.html`) sigue usando `textContent`, a proposito: ese texto
  viene de Firestore.

**Como cambiarlo:** editar las rutas dentro de `SVG_DIABLITOS`. Para hacerlo
mas grande o mas pequeno, cambiar los numeros del `viewBox`, **no** el `width`.
Para cambiar el color, cambiar los `fill`.

**Como volver al emoji:** en `tarjetaPack()`, dejar la linea del `if` y en la
definicion del pack poner el emoji en `icono`.

### `avisarTelegram()` vive en `telegram.js` (hecho oct-2026)

**Antes:** la función estaba **copiada en 5 archivos** y **ya se había
deformado**: eran **4 versiones distintas**, y una estaba **rota**.

| Archivo | ¿Revisaba que Telegram hubiera aceptado? |
|---|---|
| `Retos/centro.html` | **NO — se tragaba el error** |
| `Chat/`, `Acompanante/`, `Citas/`, `Retos/` | Sí |

**Por qué la del Centro estaba rota y eso importaba:** un token malo responde
**HTTP 200 con `ok:false`**. El `fetch` **no falla nunca**, así que sin revisar la
respuesta la función creía que el aviso salió y **se perdía en silencio**. Las
otras cuatro sí revisaban, y dejaban la pista en el celular.

**Ahora:** `telegram.js`, en la raíz, exporta `avisarTelegram(texto, url)` y saca
el token sola con `resolverTelegram()` de `config.js`. Los 5 archivos la
importan. **Las 24 llamadas no se tocaron.**

| Regla | |
|---|---|
| **La llave de la pista** | El error se guarda con **`pareja_tg_error`** y el ⚙️ de Telegram del menú la lee. **No cambiar esa llave.** (`telegram.js` la exporta como `CLAVE_TG_ERROR`, y `index.html` tiene la suya propia: mismo texto) |
| **El token se lee en cada llamada**, no al cargar el módulo | Para que un cambio hecho en el ⚙️ sirva de inmediato. Es el mismo criterio que `miProyecto()` en `acceso.js` |
| **Nunca lanza** | Un fallo de Telegram no debe tumbar la pantalla que lo llamó |
| **Registrado en `extract.py`** | Si no, el chequeo de sintaxis no lo revisa |

**Lo que NO cambió:** lo que ve el usuario. Solo se dejó de tener el mismo texto
cinco veces.

**Pendiente de probar en vivo:** que **sigan llegando** los Telegram desde los
5 sitios — un reto nuevo, una cita nueva, una compra en el Centro, el botón
"Invitar" del Chat y un reto de la IA.

---

### El aviso de "nuevo" (oct-2026)

**Dos lugares** avisan de que hay algo nuevo, y los dos usan **el mismo
criterio**, que vive en **un solo lugar** (`acceso.js` → `nuevosSinPedir()`):

| Dónde | Qué se ve |
|---|---|
| El **carrito** del menú principal (la 🛒 de arriba a la derecha) | Un **punto rojo** |
| Las **secciones del Centro** (Experiencias / Juegos / Extras) | La pastilla **`NUEVO`** en la esquina de su botón |

**Y el criterio son DOS condiciones juntas**, no una (decisión de Fredy):

1. el pack trae **fecha "Nuevo" viva** (`nuevoHasta` > hoy, se pone en el Panel), **y**
2. **todavía no se ha pedido**: no hay solicitud suya en estado `pendiente` ni
   `aprobado`.

Así que **el aviso se apaga** cuando falla cualquiera de las dos: si se vence la
fecha (aunque no lo hayas pedido) o si ya lo pediste (aunque siga la fecha).
Una solicitud **revocada o negada NO cuenta**: eso se puede volver a pedir, así
que el aviso puede reaparecer.

**Lo que NO se hace, a propósito:** no se meten fichas de lo que no tienes dentro
de los submenús del menú (Experiencias / Juegos / Retos). Se probó y se descartó:
llenaría los submenús de cosas ajenas. **Los submenús siguen mostrando solo lo
que ya tienes**; lo nuevo sin pedir se ve **solo** en el carrito y en las
secciones del Centro, y de ahí se entra a ver todo el catálogo.

#### Notas de implementación

- El **criterio vive en `acceso.js`**, no copiado en cada página: lo importan
  `index.html` (el menú) y `Tienda/index.html` (el Centro). Si algún día cambia,
  **se cambia en un solo lado**.
- El punto del carrito lo pone `renderPacksDeVerdad()` (en `index.html`), y la
  pastilla de las secciones la pone `marcarSecNuevas()` (en `Tienda/index.html`).
- Los dos nacen **apagados**: el punto es una clase (`conNuevo`) y la pastilla se
  crea con JavaScript. Nada se ve si no hay algo nuevo.
- **Pendiente de probar en vivo:** el punto rojo del carrito no se pudo ver desde
  el entorno (el menú no se dibuja sin una configuración real). La pastilla de
  las secciones **sí** se comprobó con una captura.

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
- **Engrane de configuración en Encuentros (oct-2026):** Encuentros ahora tiene
  el mismo engrane ⚙️ que Citas Guiadas (arriba a la izquierda, solo en la
  pantalla de elegir actividad). Abre la lista de actividades y el editor de
  acciones por nivel y lado (A = administrador, B = pareja, con sus **nombres**),
  la rejilla de tomas y el botón **"Jugar ▶"** (arranca un Encuentro de esa
  actividad con esas tomas, respetando "¿Cómo van a Jugar hoy?"). **No** tiene
  "Eliminar actividad". En Guiadas se quitó ese botón: borrar actividades se
  hace en `Citas/actividades.html`.
- **Navegación del editor (Guiadas y Encuentros, oct-2026):** el **"← Volver"**
  de arriba a la derecha regresa a la pantalla **anterior** (del editor a la
  lista de configurar; de ahí a la lista de actividades/jugar). Solo desde la
  lista sale al menú. En estas pantallas **no** hay botón de regreso arriba a la
  izquierda (se quitaron los "← Jugar"/"← Configurar"). En Encuentros, además,
  las **tomas del editor se precargan** al elegir la actividad desde la lista.
- **El campo de "Nueva acción" va ARRIBA y la lista al revés (oct-2026):**
  En `pintarEditor()` de **Encuentros y Guiadas** (mismo patrón), cada bloque de
  nivel+lado dibujaba `.chips` y luego `.filaAdd`. Como las chips crecen, el
  campo se iba hacia abajo y en el celular se perdía de vista. Ahora:
  1. Se agrega **primero** `.filaAdd` y luego `.chips`: el campo no se mueve.
  2. Las chips se dibujan **al revés** (bucle `for` de `length-1` a `0`), así la
     **última acción agregada queda arriba**, pegada al campo.
  El orden guardado **no se toca**: los dos juegos revuelven las acciones al
  armar la ronda (`mezclar`), así que el orden del arreglo no afecta la partida.
- **Borrar acciones es por TEXTO, no por posición (oct-2026) — no cambiar:**
  `quitarItemEd()` (Encuentros) y `quitarItem()` (Guiadas) reciben **el texto** de
  la acción, no su índice. La "✕" lleva pegado el string y se borra con
  `indexOf(texto)`; si devuelve `-1`, **no borra nada**. Es obligatorio porque la
  lista se dibuja al revés: con un índice, la "✕" se llevaría **otra** acción.
  Es seguro porque ambos juegos **bloquean repetidos** por nivel+lado
  (`some(t => t.toLowerCase() === texto.toLowerCase())`), así que el texto es
  único dentro de su lista. El "volver a enfocar" el campo
  (`querySelectorAll("#nivelesBox .filaAdd input")[li]`) **sigue igual**: mover
  `.filaAdd` dentro del bloque no cambia el orden entre bloques.
- **La rejilla de tomas usa los NOMBRES, no "A y B" (oct-2026):** el rótulo de
  cada nivel decía `" (A y B)"`. Ahora usa `nombreLado("A")` y `nombreLado("B")`,
  o sea el nombre real de cada usuario de la app (A = administrador, B = pareja;
  si no hay nombre, cae a "Lado A"/"Lado B" como antes). Son **tres** lugares y
  hay que cambiarlos juntos: el editor de **Encuentros** (`tomasGridEncEd`), el
  editor de **Guiadas** (`tomasGrid`) y el modal de MultiActividades de
  **Guiadas** (`multiTomasGrid`). En Encuentros el modal de MultiActividades
  (`tomasGridEncuentros`) usa solo el nombre del nivel: ahí no aplica.
- **Juego nuevo "Elecciones Peligrosas" (`Opciones/`, oct-2026):** traído de
  "Juego Opciones". Es el "esto o aquello": se muestran 2 opciones y al elegir
  una se elimina (la otra sigue), hasta que a cada quien le queda 1. Los datos
  viven en **Firebase** (`opcionesJuego/actual` = `{A:[...], B:[...]}`), **nunca**
  en un JSON del repo (contenido íntimo + repo público). Listas por lado: A =
  administrador, B = pareja; los invitados heredan la lista de quien los invitó
  (`conQuien`). **Número de rondas** (campo principal): cada quien recibe esa
  cantidad de opciones al azar de su lista (sin repetir si alcanza; se permite
  repetir si no). Una ronda = cada jugador pasa una vez, en orden aleatorio. Se
  juegan **exactamente R rondas** (cada opción se consume; no queda nada y no se
  muestra resultado): en la última ronda cada quien quita su última opción y sale
  el aviso "La partida terminó". Modos (tres botones): "Jugar
  solo" (pregunta qué lista), "Jugar con Pareja" (tú + pareja) y "Multijugador"
  (con invitados); los dos últimos preguntan "Un solo Celular" / "Cada quien en
  el suyo" (sesión `sesionOpciones/actual` + invitaciones, igual que Encuentros).
  Engrane ⚙️ arriba-izquierda (solo admin) para editar las dos listas:
  **pestañas** por usuario, lista en **tabla** con scroll acotado y **buscador**,
  edición en línea, borrar (✕) a la derecha, y **pegar lista completa**. Al
  terminar, aviso a todos y regreso; invitados expulsados. Pausar/continuar/
  terminar/saltar turno/sacar invitados como Encuentros. Licencia: item
  **`opciones`**. En el catálogo (`packs`): ruta **`Opciones`**, sección
  **`experiencias`**. El mecanismo de **agregar invitado a media partida**
  (reutilizable para otros juegos) está documentado aparte en
  **`General/Invitado-a-media-partida.md`**.
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
     es común. **El orden de la pantalla de inicio (decisión de Fredy, oct-2026):**
arriba **Número de rondas**, luego la caja **"Elige Tu Modo de Juego"** (las
    cuatro pestañas en 2x2, con la descripción del modo debajo), luego **"¿Cómo vas a jugar
   hoy?"** con los **solo dos** botones —**Jugar con Pareja** y **Multijugador**,
   en el mismo renglón—, y al final la caja **"Variantes Picantes, Te atreves ?"**
   con el interruptor y su "¿Cuántas veces?". Abajo de todo, el botón del QR y el
   remate del engrane. El detalle del modelo y de las tres
   colecciones está en **`General/Modelo-Datos.md`**, sección **1b**.

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
  ronda). En la pantalla de escogimiento del duelo **solo marca el administrador**:
  la pareja y los invitados ven la lista y el contador, pero no marcan. "Saltar
  turno" **no existe** en duelo. **El detalle completo de las cuatro ramas, el
  modelo de datos y las cuatro funciones del reparto están en
  `General/duelos.md`** — ese es el archivo que se lee, no esta nota. Cómo se
  construyó y qué falta está en **`General/Plan-Duelo.md`**.

  **Ojo: está construido pero PENDIENTE de la prueba en vivo** (17-oct-2026). El
  chequeo de sintaxis pasa, pero las ocho combinaciones de la matriz todavía **no se
  han probado en un celular**: hasta que se prueben, esto vale como código escrito,
  no como algo verificado. La lista de lo que falta está en `Plan-Duelo.md`,
  sección 10.

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
  - **En el Duelo hay "Sorpréndeme, elige por mí"** (`#btnSelAzar`, 17-oct-2026):
    el administrador lo toca y se marcan **R parejas al azar** (el orden al azar
    es el orden de las rondas), suben los dos contadores y se enciende "Jugar".
    Se puede volver a tocar para re-sortear. Solo lo ve el administrador, y es
    solo del Duelo (en la selección normal no se muestra).
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
  - **Arriba del reproductor del Duelo** va la modalidad y quiénes juegan
    ("Juntos · Pareja" / "Turnos · Multijugador") y **debajo** "Ronda X de R".
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
- **Un resumen de conversacion no lee estos archivos.** Si una sesion se corta
  por limite de tokens, lo que se pierde es el detalle fino. Este archivo es la
  red de seguridad: cualquier sesion nueva debe empezar leyendolo.

### Fuegos artificiales al final de la partida (`fuegos.js`, oct-2026)

`fuegos.js` esta en la **raiz** y es un modulo ES reutilizable. Venia de
`Default Project/fuegos-artificiales/index.html`, que se deja como esta: es la
copia de trabajo.

```js
import { encenderFuegos, apagarFuegos, fuegosEncendidos } from "../fuegos.js";
encenderFuegos();   // aparece y se dispara solo
apagarFuegos();     // se quita y se detiene (no gasta bateria)
```

Decisiones que hay que respetar si se vuelve a tocar:

- El lienzo se crea solo, se pega al `body` y va con **`pointer-events:none`**
  y `z-index:70`. **Nunca** puede tapa un boton de la pagina.
- Los toques se escuchan en el `document`, y **se ignoran los que caen sobre
  `button`, `a`, `input`, `label`**: por eso "Aceptar" sigue sirviendo y el resto
  de la pantalla lanza mas fuegos.
- `#modalFin` tiene `z-index:80` y **`background:transparent`**, para que los
  fuegos (70) se vean completos y solo la caja opaquita tape el centro.
- El sonido usa WebAudio y **solo arranca con el primer toque** (los
  navegadores no dejan sonar nada sin que el usuario toque algo). Se respeta
  `localStorage["fuegos_mute"]`.
- El **boton de silencio** (`#fuegosSonido`, esquina inferior derecha, `z-index:71`)
  se crea y se borra junto con los fuegos: sale al prenderlos y se oculta al
  apagarlos. Muestra el iconito de Bocina con ondas (con sonido) o tachado (sin
  sonido). **El primer toque en el boton solo PRENDE el sonido** (no lo apaga):
  asi de verdad se oye la celebracion; despues de ahi, cada toque alterna.
  Mientras el sonido no ha arrancado, el boton **late** como pista. Ojo: es un
  `<button>`, asi que el handler global de toques lo salta y no lanza fuegos.
- Todos los caminos de fin pasan por `abrirFin(texto)` en `Opciones/`, que
  enciende los fuegos y abre el aviso. Se llama desde `finPartida()` (se acabo
  sola) y desde el listener de la sesion (la termino el anfitrion). El boton
  "Aceptar" (`btnFinOk`) apaga los fuegos antes de salir.
- Si se quiere en otro juego: importar el modulo y llamar `encenderFuegos()`
  en su aviso de fin. **Recordar subir el `z-index` de su modal** para que el
  aviso quede por encima de los fuegos.

### Los cuadros de la app: `confirmar.js` (oct-2026)

**Ya no hay ni una ventana del sistema en la app.** Antes, cada "¿estas seguro?"
era un `confirm()` del navegador y cada "no lo puedes hacer" era un `alert()`:
la cajita gris, con los botones del sistema, que era la **unica** pantalla que no
usaba el diseno de la app y se veia ajena al resto.

Ahora hay **una sola pieza** en `confirmar.js` (raiz), con el mismo molde de los
modales que ya usaba cada juego: fondo oscurecido, caja con borde turquesa,
titulo en Chakra Petch, circulito ⚠️ cuando hace falta, boton grande con el
degradado coral→turquesa y "Cancelar" debajo.

**Dos funciones, segun lo que se tenga que decir:**

```js
import { confirmar, aviso } from "../confirmar.js";   // o "./confirmar.js" en la raiz

// 1) PREGUNTA: hay algo que confirmar o cancelar. Devuelve una promesa.
if(!await confirmar({
  aviso:true,                                  // circulito ⚠️ (por omision false)
  titulo:"¿Eliminar a Ana?",                   // la pregunta, en grande
  texto:"No se puede deshacer.",               // la consecuencia, chica (opcional)
  ok:"Eliminar"                                // el boton de adelante
})) return;

// 2) AVISO: se dice UNA cosa y no hay nada que cancelar. Un solo boton,
//    "Entendido", y SIEMPRE con ⚠️. NO se espera: se llama y ya.
if(!esAnfitrion()){ aviso("Terminar la partida es cosa del anfitrión."); return; }
```

**Por que `aviso()` no se espera y `confirmar()` si:** con `alert()` el codigo
se paraba hasta que le dieras OK, y habia que respetarlo (los candados hacen
`aviso(...); return;`, asi que se cortan igual). Con la caja, `aviso()` pinta y
el codigo sigue: **los candados siguen funcionando porque el `return` viene
despues**. **Regla: si cambias un `alert()` por `aviso()`, el `return` (o el
`return null`) tiene que quedarse donde estaba.**

**Decisiones que hay que respetar si se vuelve a tocar:**

- **El texto entra siempre con `textContent`**, nunca con `innerHTML`: varios de
  estos textos traen nombres, correos o accesorios que **vienen de Firebase**.
- Va en **Z 95**: encima de los modales normales (60) y de los fuegos (70).
- **Nunca dos cajas encimadas**: si se pide otra confirmacion con una abierta,
  la anterior se cierra como "no".
- Los colores se piden con `--card` y **caen a `--tarjeta`** (y asi con los
  demas), porque cada pantalla les puso un nombre distinto: **Diablitos** usa la
  otra serie (`--fondo`, `--tarjeta`, `--texto`, `--apagado`). Sin ese fallback,
  la caja salia sin fondo ni texto en Diablitos.
- **Cambiar un `confirm()` por este obliga a que la funcion sea `async`.** Ya se
  hizo en dos que no lo eran: `volverAlOriginal()` en `Diablitos/` y el
  `onclick` de "vaciar chat" en `Acompanante/`.
- **El circulito ⚠️ va DENTRO de la caja, no afuera como hermano.** Afuera se
  ponian de lado: el circulito empujaba la caja a la derecha y el par se salia
  del borde en los angostos (lo reporto Fredy, oct-2026). Por eso la capa lleva
  `flex-direction:column`: si alguna vez se cuelga un elemento suelto, se apila
  y se centra, en vez de correrse a un lado. **Regla general: cuando una capa es
  `display:flex` y le cuelgas hijos "de adorno", revisa que ninguno sea hermano
  de la caja.**
- **La regla de la casa: no se vuelve a usar `confirm()` ni `alert()` del
  sistema.** Si toca, es `confirmar()` o `aviso()`.

**Los 59 lugares** (se cambiaron todos de golpe, en dos rondas):

| Pantalla | Que es |
|---|---|
| `Opciones/`, `Encuentros/` | Saltar turno |
| `Diablitos/` | Volver a los originales |
| Inicio ⚙️ Usuarios | ~~Salir de modo invitado~~ · ~~eliminar a alguien~~ |
| `Citas/`, `Citas/accesorios.html` | Eliminar cita · eliminar accesorio |
| `Acompanante/` | Eliminar la conversacion |
| `Retos/` | Rechazar · retirar · eliminar · dar un punto · cobrar · aplicar castigo |
| `Panel/catalogo.html`, `Panel/oficiales.html`, `Panel/permisos.html` | Eliminar del catalogo · quitar publicador |
| `Autorizar/` | Revocar · negar · eliminar solicitud |

| | Donde |
|---|---|
| **20 preguntas** (`confirmar()`) | las de la tabla de arriba |
| **39 avisos** (`aviso()`) | `Acompanante/` 1 · `Autorizar/` 8 · `Encuentros/` 11 · `Guiadas/` 4 · `Opciones/` 11 · `Retos/` 4 |

Los 39 avisos son de tres familias: **"eso no lo puedes hacer"** (los 10 de
*"…es cosa del anfitrión"*), **"te falta algo"** (no hay acciones, la lista esta
vacia, muy pocas opciones) y **fallos** (*"revisa conexión"*). Los tres van con
⚠️ y un solo botón.

**Un texto que se acorto (decision de Fredy, oct-2026):** el de **salir de modo
invitado** era largo y avisaba lo que mas se necesita saber:
*"¿Salir de invitado y volver a tu base? **Tambien te borro de sus usuarios.**"*
Quedo solo **"¿Salir de modo invitado?"**. El invitado ya **no ve ahi** que
tambien se le borra de la lista de quien lo invito. Si alguna vez molesta, se
devuelve con `texto:`.

### Los botones de anfitrion tienen que NACER ocultos (oct-2026)

**Lo que reporto Fredy:** jugando como la pareja, en `Opciones/` le aparecio el
boton de "Terminar Partida", lo apachaba y le salia *"Terminar la partida es
cosa del anfitrión"*. El candado hizo bien su trabajo (no termino nada), pero el
boton **no debia estar a la vista**.

**Por que se le quedaba pegado:** `btnTerminar`, `btnQR` y `btnTerminarPartida`
**no traian `style="display:none"` en el HTML**, a diferencia de `btnSaltar` y
`btnAgregarInv`, que si lo traen. O sea: dependian 100% de que se ejecutara
`mostrarBotonesAdmin()`... y ese refresco **solo corria al entrar** a la partida.
Dentro del juego, `pintarPaso()` solo refrescaba `btnSaltar`.

**El arreglo (dos partes, las dos hacen falta):**

1. Los tres botones **nacen con `display:none`**, igual que sus dos hermanos.
2. `pintarPaso()` ahora llama a `mostrarBotonesAdmin()` **en cada pasada**, al
   lado de donde ya refrescaba la sala. Va **antes** del corte `if(!jugando)`
   porque **al pausar los botones NO deben desaparecer**: al reanudar tienen
   que volver.

**Regla que sale de aqui:** un boton que depende de JavaScript para estar
oculto **tiene que nacer oculto en el HTML**. Si nace a la vista, hay un
instante —o una ruta entera— en que se ve aunque no deba. Y si su estado cambia
durante el juego, el refresco va **en la pasada que ya se corre en cada jugada**,
no solo al entrar.

**Donde se aplico (los 3 que lo tenian):** `Opciones/` y `Encuentros/`. En los
dos, los botones de anfitrion (`btnTerminar`, `btnTerminarPartida`, `btnQR`,
`btnSaltar`) ahora nacen con `display:none`, y `pintarPaso()` llama a
`mostrarBotonesAdmin()` en cada pasada.

**`Guiadas/` NO lo tenía, y no se tocó (a proposito).** Alli `btnTerminar`
("Terminar") **no tiene candado**: no hay `esAnfitrion()`, ni `mostrarBotonesAdmin()`,
ni sala, ni invitados. El `soyHost` que hay es una variable suelta dentro de la
escucha, que solo decide si se ofrece "Continuar cita anterior?" o "Unirme".
Es decir, ese boton **debe** verse siempre, para todos: esconderlo al nacer
habria sido un error. Esto viene de la decision de oct-2026 de no portar a
Guiadas el bloque de anfitrion/QR/sala. **Si alguna vez se le pone un candado de
anfitrion ahi, entonces si aplica la regla de nacer oculto.**

### La meta de un reto se calcula sola (oct-2026)

En `Retos/`, al proponer un reto hay tres campos pegados: "veces al día",
"duración (días)" y "puntos para cumplir". La meta es **`veces × días`**, y eso
**ya no se escribe a mano**: se calcula solo y el campo queda **de solo lectura**
(se ve apagado, con borde punteado). Debajo dice la cuenta: *"Se calcula solo:
2 × 7 = 14 puntos."*

**El arreglo tiene dos partes, y las dos hacen falta:**

**1. El campo obedecía una sola vez.** La función se llamaba
`rellenarMetaSiVacio()`: rellenaba **solo si estaba vacío**. En cuanto tenía un
número, ya no volvía a hacer nada. O sea: escribías los días, se llenaba una vez,
y si después cambiabas los días **la meta se quedaba congelada**. Y al **editar
un reto viejo** (que ya traía su número guardado) **nunca** se recalculaba. Por
eso el campo era editable: era el rodeo para poder escribir un número que sí se
alcanzara. Ahora es `calcularMeta()` y sigue a los dos campos siempre.

**2. La cuenta daba un desfase de horas.** El vencimiento era
`ahora + duracionDias × 86400000`, o sea **a la misma hora en que se apachó el
botón**. Ejemplo: propones lunes a las 4 de la tarde, 2 al día durante 7 días → la
meta pedía 14 puntos, pero el reto vencía lunes siguiente a las 4 de la tarde:
había **6 días completos y un medio**, y 14 era casi imposible. Peor: a las 11 de
la noche sí se alcanzaba y a las 4 de la tarde no. **Dependía de la hora.**

**Ahora el reto vive hasta el FINAL de su último día** (`finDeUltimoDia()`): se
pone a las 11:59:59 de la noche del día N y se suma `N - 1` días. Así "7 días"
son 7 días de verdad, da igual a qué hora se proponga. Ojo: **esto mueve la
fecha de vencimiento de los retos nuevos** (terminan unas horas después, que es
justo lo que se busca). Los que ya están guardados conservan su `fechaFin` y no
se tocan.

**Los retos ya guardados no se recalculan (decisión de Fredy, oct-2026).** Al
abrir uno viejo, el campo trae **el número que ya tenía** aunque no cuadre con
sus días, y debajo lo avisa: *"Este reto ya traía su propia meta. No se
recalcula."* Es lo que hace la bandera `metaLibre`: en `true` la meta no se
toca, y en `false` (reto nuevo) se calcula sola. **Los datos que ya existen no
se cambian por sorpresa.**

**Y el contador de "Tiempo restante" (`diasRestantes()`) cuenta días de
calendario, no horas.** Antes dividía las horas que faltaban entre 24; como el
reto vence a las 11:59 de la noche, eso daba **un día de menos** (decía 6
cuando eran 7). Ahora usa `duración − días que ya van`, a partir de
`fechaInicio`. El mínimo es 1 mientras el reto siga vivo, para que el último día
no se vea como "0 días".

**Comprobado con números** (reto de 2 al día durante 7 días, propuesto lunes a
las 4 de la tarde): 7 → 6 → 4 → 1 → 1 → 0 días. Y los retos viejos muestran
exactamente lo mismo que antes.

**Ojo, pendiente y NO se ha tocado:** `Retos/index.html` tiene un
`id="formBotones"` **repetido** (el del formulario y el de "definir recompensa",
L332 y L353; oct-2026: antes decia 326 y 347, ya corrieron). Hoy no rompe nada
porque ningún JavaScript lo usa —solo el CSS—, pero es una bomba de tiempo. Se
arregla aparte.

### Completar un reto NUNCA descuenta puntos (regla, oct-2026)

Un reto normal se paga así: cada **"Cumplida +1"** suma **+1** al que lo tiene
que hacer (`asignadoA`), y **nada más**. Al llegar a la meta el reto pasa a
`"cobrada"` y **no se resta absolutamente nada**. Solo se descuenta cuando
**no** se cumple, y entonces es `penalizacionPuntos`.

**Antes (oct-2026) sí se restaba** y por eso completaba un reto no dejaba nada
acumulado. Se quitó por decisión de Fredy. Ojo: **`puntosMeta` hoy es el número
de veces que hay que apretar**, no una cantidad que se cobre.

> **Por qué esto importa:** el cambio se hizo en la lógica y se dejó un texto
> viejo en la tarjeta (`Retos/index.html`, la nota `nota warn` del reto en
> curso) que todavía decía *"y se descuentan 5 pts"*. El usuario veía que le
> advertían de un descuento que ya no existía. Ya se quitó esa frase: ahora solo
> dice qué pasa **si no** se cumple, que es el único caso con descuento.

**El botón "Cumplida +1" solo lo ve quien propuso el reto** (`soyProponente`,
en la lista de acciones). La pareja no lo ve. Por eso el doble toque
simultáneo es improbable: solo pasaría si el mismo aprieta desde dos lugares a
la vez. La falta de transacción queda anotada como pendiente de bajo riesgo.

> **El detalle de una pantalla concreta esta en su propio archivo.** Se movio
> aqui el oct-2026 para que este archivo se pudiera leer de arriba a abajo:
>
> | Documento | Que tiene |
> |---|---|
> | `General/Centro-Adquisiciones.md` | La pantalla del Centro de Adquisiciones (deseos, tienda, pedidos) |
> | `General/IA-Acompanante.md` | `Acompanante/`: el tono de la IA, los ajustes, y los retos que propone |
> | `General/Campana-Pestana.md` | `pestana.js`: la campana de la pestana, el bip y el cartelito, para el Chat y para los Retos |
> | `General/Pegamento-y-Citas.md` | El chorro de pegamento, la agenda de `Citas/` y las pantallas de Actividades y Accesorios |
>
> **Regla:** si lo que se toca es el detalle de una de esas pantallas, se lee
> **ese** archivo. Si es una regla general, esta aqui. Lo que va en uno de esos
> archivos **no** se copia aqui: solo la linea que apunta.