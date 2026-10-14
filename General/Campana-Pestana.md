# La campana de la pestana: Chat y Retos

> Seccion que vivia en `GUIA.md` y se movio aqui el oct-2026: **ya no
> es lo que se lee a diario**, es el detalle de una pantalla o un
> modulo. En `GUIA.md` quedo una linea que apunta aqui.

> **Por que se movio:** son 184 lineas de un solo modulo (`pestana.js`), que se lee entero o no se lee.

---

### Invitar al Chat, y la campana en la pestaña del navegador (nuevo, oct-2026)

**PROBADO Y FUNCIONANDO en computadora con Chrome (Fredy, oct-2026):** la campana
se prende, el cartelito sale al entrar a la pestaña, y el bip suena. Sigue sin
probarse con la app cerrada (eso lo cubre Telegram) ni en celular (ahí no hay
campana, por diseño).

**Lo que pidió Fredy:** un botón **"Invitar"** en verde en Chat que mande un
aviso a la pareja, y que la otra computadora **se entere aunque la pestaña esté
en segundo plano**.

**Por qué el ícono de la pestaña y no un aviso dentro de la página.** Una pestaña
escondida **no se ve**: una pancarta se dibuja detrás y no se nota hasta que
cambias a esa pestaña. El ícono de la pestaña es lo único que se ve **siempre**,
esté o no a la vista. Por eso el camino elegido es ese y no un aviso en pantalla.

**Las dos mitades, y por qué hacen falta las dos:**

| | Para qué |
|---|---|
| **Telegram** | Le avisa aunque tenga la app **cerrada** |
| **La base** (`invitosChat/actual`) | Le enciende la 🔔 en la pestaña si tiene la app **abierta en otra pestaña** |

Si se mandara solo el Telegram, la app no tendría nada que saber y la campana no
podría existir.

**Lo que quedó:**

| Pieza | Qué hace |
|---|---|
| `#btnInvitar` (verde, junto a "← Volver") | Escribe la invitación y manda el Telegram. **Sin preguntar** (decisión de Fredy): manda directo |
| Mensaje | `💬 {nombre} te está esperando en el Chat` |
| Botón del Telegram | `Abrir 👀` → la dirección de `Chat/` |
| `pestana.js` (nuevo, en la raíz) | `vigilarInvitaciones(db, {esChat})`: escucha `invitosChat/actual` y maneja la campana |
| `index.html` y `Chat/index.html` | Lo llaman; `Chat/` es el que pasa `esChat:true` |

**El hueco que había, y cómo quedó (decisión de Fredy, oct-2026).**

La campana se apagaba cuando **cualquier** pestaña pasaba a verse. El problema:
**ver la pestaña no es ver la invitación.** Si ella tenía la app en segundo plano
en el **menú**, la campana se apagaba al entrar y lo que aparecía era el menú: la
invitación quedaba marcada como vista y **no volvía a salir nunca**.

Se corrigió con dos cosas a la vez:

| | Qué hace |
|---|---|
| **La campana se apaga SOLO en Chat** | En el menú o en cualquier otra pantalla, entrar **no** la apaga. Sigue ahí hasta que abra el Chat de verdad |
| **El cartelito** | Al entrar a una pestaña que **no** es Chat, sale un aviso: *"Te invitaron al Chat — Ve a Comunicaciones → Chat"*. Sin él, una campana prendida no significaba nada |

### La campana ahora avisa de los retos de la IA, no solo del Chat (oct-2026)

**El hueco que había:** cuando la IA te mandaba un reto, **no te enterabas de
nada** si no abrias `Retos/` por tu cuenta. Ahora llega por **las cuatro
vías**, igual que el Chat:

| Vía | Dónde |
|---|---|
| **Telegram** | La única que llega con la app **cerrada**. La manda `Acompanante/` al crear el reto |
| **Campana + bip** | Si tienes la app abierta en otra pestaña, en computadora |
| **Cartelito** | Al abrir o volver a la app: *"Hay un reto nuevo — Ve a Retos para verlo"* |
| **Pancarta** | Si ya estabas dentro de `Retos/`. **Esto ya existía** |

**Cómo quedó armado:**

| Pieza | Qué |
|---|---|
| `invitosRetos/actual` (en la base de la pareja) | El aviso. Misma forma que el del Chat: `para`, `titulo`, `creadoEn`, `visto` |
| `pestana.js` | Antes solo sabía vigilar **un** documento (variables sueltas: `esChat`, `refInv`, `hayPendiente`…). Ahora tiene un **`canal` por tipo** en un objeto `canales`. La campana y el bip son **compartidos**: si hay algo pendiente de cualquiera de los dos, quedan prendidos, y se apagan cuando ya no queda ninguno |
| `vigilarRetos(db, opciones)` | Atajo. `vigilarInvitaciones(db)` **sigue funcionando igual** (`esChat` se traduce a `esEsta`) |
| `index.html` | Vigila los dos, con el mismo `try` que ya tenía |
| `Retos/index.html` | `vigilarRetos(db, {esEsta:true})` — **aquí se apaga**, igual que el Chat apaga el suyo al abrirse |

**Las reglas del cartelito del Chat se copiaron tal cual** para los retos: 30
minutos de vigencia, se dice **una vez**, solo con la pestaña visible, y si la
pantalla que se abre **es** esa misma (`Retos/`) se da por visto sin decir nada.

**Ojo con la ruta del documento:** `TIPOS[tipo].coleccion` es **solo el nombre
de la colección** (`"invitosRetos"`), y el `"actual"` se agrega aparte. Escribir
`"invitosRetos/actual"` en un solo pedazo devuelve una *colección*, no un
documento, y `onSnapshot` truena en silencio — es el mismo error que se corrigió
en `index.html` (ver *El invitado vuelve solo al abrir la app*).

**Lo que sigue igual:** la campana **solo funciona en computadora con Chrome o
Edge**. En celular no hay ícono de pestaña; ahí llegan el cartelito, la pancarta
y el Telegram.

### 🐞 El cartelito no salía — bug reportado por Fredy (corregido oct-2026)

**Lo que pasó:** la campana sí se prendía, pero al entrar a la pestaña **no salía
el cartelito**. Fredy lo probó 3 veces y las 3 fue la primera vez que entraba a esa
pestaña.

**La causa:** había puesto una barrera, `yaHuboTransicion`, para que el cartelito
**no** saltara al abrir la app (un cartelito de entrada se avienta). El problema es
que esa barrera tapaba **precisamente el caso bueno**: si la invitación llega con
la pestaña en segundo plano y el usuario entra a ella **por primera vez**, no se
decía nada. La barrera no distinguía "abrir la app" de "volver a una pestaña que ya
tenías abierta", y son cosas distintas.

**El arreglo:** quitar la barrera y cambiar la regla a algo que sí distingue las
dos. El cartelito sale cuando la invitación **se vuelve visible**, y visible son
las dos cosas:

| Cuándo | Qué pasa |
|---|---|
| Llega la invitación **con la pestaña ya a la vista** | Cartelito ahí mismo, sin esperar a nada |
| La pestaña **pasa a verse** y hay algo pendiente | Cartelito |
| La pestaña está escondida | **No hay cartelito**: no se vería. Para eso está la campana |
| Es el Chat | No hay cartelito: ahí ya la está viendo, y se marca como vista |
| Ya se dijo en esta invitación | No se repite (`cartelitoYaSalio`) |

**El cartelito se dice UNA vez por invitación.** Al apretar "Entendido" **no** se
marca como vista: la campana sigue prendida hasta que abra el Chat. Es a propósito;
si se marcara al leer el cartelito, volvería el hueco que se estaba tapando.

**Regla que queda:** **antes de poner una barrera "solo la primera vez", pregúntate
si el caso que tapa es el caso que se quiere tapar.** Aquí las dos cosas se
parecían y no lo eran.

### El bip de la invitación (oct-2026)

**Fredy lo pidió a prueba:** "lo probamos y si no gusta se le quita". Es el mismo
sonido y la misma forma que `bip()` de `Citas/` y `Retos/` (un oscilador, no un
archivo de audio), y respeta **el mismo silencio** que los fuegos artificiales
(`fuegos_mute`): si ese botón está apagado, aquí tampoco suena.

**Lo que hay que saber antes de probarlo:** Chrome **no deja sonar nada** si el
usuario nunca ha tocado esa página. El contexto de audio arranca *suspended* y solo
se abre con un toque previo. Por eso `abrirSonido()` se engancha al primer
`pointerdown`/`keydown`/`wheel`/`touchstart`. **Si la pestaña se abrió y nadie la
tocó nunca, no hay bip.** Es el navegador, no un error.

Además: suena en **todas** las pestañas de la app que estén pendientes, y si esa
pestaña está silenciada en Chrome no se oye.

**Suena una sola vez**: `pintar()` compara si la invitación *acaba* de pasar de
"nada" a "pendiente". Sin eso, cada aviso de la base lo volvería a tocar.

**Vigencia de 30 minutos.** Si nadie abre el Chat, la invitación **se ignora**
después de 30 minutos, para que la campana no salga cada vez que se abra la app
con algo pendiente eternamente. Sin fecha legible la campana **no** se prende:
mejor no inventar una invitación vieja que sí se vaya sola.

**OJO: los 30 minutos necesitan un reloj, no solo la comparación.** El
`onSnapshot` solo dispara cuando el documento **cambia**, y si nadie manda otra
invitación no vuelve a disparar: comparando nada más, la campana se quedaba
prendida pasada la hora. Por eso hay un `setTimeout` (`programarVigencia()`) que
apaga la campana solo cuando se acaba el tiempo. **Ese reloj no escribe nada en
la base**: marcar `visto:true` sería mentir, porque nadie la llegó a ver.

**El cerrojo `yaVigilado`.** `mostrarMenu()` del menú puede llamar
`vigilarInvitaciones()` dos veces (si se cambia de usuario). Sin el cerrojo se
registraba el `visibilitychange` dos veces y el cartelito se abría encimado dos
veces (`confirmar.js` cierra el anterior, pero el efecto era raro).

**Detalle de Chat:** si abres el Chat con la pestaña ya a la vista, **no** hay
ningún `visibilitychange` que dispare nada, así que la campana se quedaría
prendida en la propia pantalla del chat. Por eso `pintar()` revisa eso aparte.

**El ícono se cambia con un `<link rel="icon">` nuevo**, dibujado en un canvas.
Lleva `data-campana="1"` y **solo se borra ese**: si la página ya traía su propio
ícono (`index.html` trae `icon-192.png`), ese nunca se toca y vuelve a ser el de
la pestaña al quitar la campana.

**Lo que NO hace, y está dicho en `pestana.js` para que no se prometa:**

- **Solo en Chrome/Edge de computadora.** En Android y iPhone los navegadores no
  permiten cambiar el ícono de la pestaña. No hay forma.
- **No avisa con la app cerrada.** Haría falta un *service worker* y claves de
  push, que este repo **no tiene** (y Fredy dijo que no le interesa).
- **Solo está en `index.html` y `Chat/`.** En las demás pantallas no se prende.
  Agregarlo es **una línea por pantalla** (el import y la llamada).

**El botón "Invitar" quedó a la IZQUIERDA de "← Volver"**, no a la derecha como
se pidió, para que **"Volver" siga en la esquina**: es regla de la casa (ver
"Botones de volver y de esquina"). Si se prefiere al revés, se invierte el orden
dentro de `.filaDer` y ya.

**OJO con `confirmar.js`:** `abrir()` cierra el cartelito anterior como "no". Si
ella tiene el menú y el Chat abiertos en dos pestañas, el cartelito solo le sale
en la **última** que abra. La campana sí le sale en las dos. No rompe nada, pero
no es "siempre".
