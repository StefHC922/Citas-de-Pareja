# HISTORIA - Citas de Pareja (el diario)

**Este NO es el documento maestro.** Ese es `GUIA.md`, y es el que hay que leer
primero. Este aqui es el **por que**: el relato con fecha de como se fue
arreglando cada cosa.

---

# ⛔ NO ARREGLAR ESTO

**Lo único de este diario que vale la pena tener a mano.**

Cada fila de esta tabla **parece un bug y es una decisión de Fredy**. Si alguien
la "arregla" sin preguntar, rompe algo que sí funcionaba. Esta lista se distilló
de 1,000 líneas de diario en octubre-2026, y es la razón de que el diario exista.

| Qué se ve | Por qué se queda así |
|---|---|
| **El tag de nivel no se ve nunca** | Fredy lo pidió **escondido a propósito**. El texto sí se escribe; el atributo `hidden` no se quita. Es el error nº1 que alguien "corrige" (detalle en *Parte 1, 3.1*) |
| **Las reglas de cada pareja están abiertas** (`allow read, write: if true`) | La app **no inicia sesión** contra su propia base, así que las reglas **no pueden distinguir a nadie**: cerrarlas rompe la app entera. Es arquitectura, no descuido (`GUIA.md`, *La base de cada PAREJA*) |
| **`solicitudes` se puede leer sin sesión** | El menú y los juegos leen esa colección **sin internet y sin sesión**. Cerrar el `read` rompe el modo sin conexión. Por eso los correos de clientes son legibles |
| **El invitado no tiene ninguna salida** | Regla de Fase 1: entra cuando se registra y sale cuando acaba la partida. El "‹ Volver" se le oculta siempre (`pintarSalidas()`) |
| **Al invitado se le sobrescribe su config de Firebase** | **Ese es el objetivo**: es la protección de los datos. Al salir se le restaura. Si se "corrige", el teléfono queda apuntando a la base de otra persona |
| **Tener copia de seguridad no significa ser invitado** | Son dos cosas distintas y confundirlas causó casi todos los bugs de la Fase 1. Estar de visita empieza **al registrarte**, no al hacer la copia |
| **Salir del modo invitado a medio camino no pregunta nada** | Decisión de Fredy: si te sales, se deshace todo en silencio |
| **Sin internet, a nadie se expulsa de una partida** | No se echa a nadie de una partida en curso por un corte de red. Solo afecta al reinicio |
| **En Diablitos, "‹ Inicio" solo sale si no eres invitado** | El invitado no se pasea por los datos del anfitrión |
| **No hay arnés de pruebas** | Se retiró en oct-2026 a propósito: era lento y poco fiable. Lo que queda es el chequeo de sintaxis y la prueba en vivo |
| **No hay *service worker* ni push** | Decisión de oct-2026. La app avisa por Telegram y por la campana de la pestaña; **no se acordó agregar push** |
| **La campana no funciona en el celular** | Android y iPhone **no permiten** cambiar el ícono de la pestaña. No hay forma, no es que falte código |
| **El bip solo suena si el usuario ya tocó esa página** | Chrome no abre el audio sin un toque previo. Es el navegador, no un error de la app |
| **El 🛒 ⚙️ de la esquina solo es del menú principal** | En un submenú no se muestran: ahí solo vive el "‹ Volver" |

**Regla que resume esta tabla:** antes de "arreglar" algo que parece roto,
preguntarse **¿está esto escrito como decisión en algún lado?** Si sí, no se
toca. Si no está escrito, probablemente **sí** sea un bug, y se pregunta.

---

## Cuando leerlo, y cuando NO

**Léelo solo si** la tarea es sobre alguno de estos:

- El **modo invitado** (entrar como invitado, la copia de seguridad, salir).
- La **sala de espera** (`Diablitos/`, invitaciones de los juegos).
- Los **avisos de fin de partida**, la pausa y el "Saltar turno".
- **`acceso.js`**, las licencias, el catalogo o el **limite de 30** solicitudes.
- Los **retos de la IA** de `Acompanante/` y sus mecanismos.
- **Retos/** y `Retos/centro.html` (Centro de Adquisiciones).
- La **sala, el anfitrion y las citas** de `Citas/`.

**NO lo necesitas para:** tocar estilos, agregar o quitar un boton, corregir el
menu o sus submenus, el Chat, la campana de la pestana, `confirmar.js`, los
fuegos artificiales, `glue.js`, el Asistente, o las reglas de Firebase
(esas estan al principio de `GUIA.md`).

## Por que esta separado

Antes todo estaba junto en `GUIA.md`, y eran 3,000 lineas. El problema no era el
tamano: era que **mas de la mitad era un diario con fecha**, y un modelo lo leia
como si fueran instrucciones vigentes. Separlo deja lo importante arriba.

**Regla: si algo esta aqui y contradice a `GUIA.md`, manda `GUIA.md`.** Aqui solo
se cuenta como se llego; lo que mando hoy esta alla.

---


## Parte 1 - Fase 1: Encuentros Guiados, modo invitado y sala de espera

oct-2026 · repo `Documents\GitHub\Citas-de-Pareja`

Qué se hizo en esta ronda y por qué, para que cualquier chat siga sin perder
contexto.

Alcance: **corrección de lo que ya existía** + **un lugar común para las
partidas con invitados**.

Estado: **hecho y verificado con 26 pruebas automáticas. Pendiente de probar en
el celular por Fredy. NO se ha subido todavía.**

---

### 1. La regla que resume todo

> **El invitado solo está dentro mientras dura la partida. Cuando termina, se le
> devuelve su información y sale. No hay salida libre, en ningún juego.**

Consecuencia que costó aprender: **tener copia de seguridad NO significa ser
invitado.** Son dos cosas distintas, y antes el código las confundía. Esa
confusión era el origen de casi todo lo que se arregló aquí.

---

### 2. Modo invitado

#### 2.1 Lo que estaba mal

Al apretar "Entrar modo invitado 📷" se guardaba la copia de seguridad **antes
de escanear nada**, y esa copia era lo que decidía si el invitado "estaba de
visita". Encadenado:

| Dónde se notaba | Síntoma |
|---|---|
| Pantalla de Invitados | Decía "Estás de visita" y ofrecía el botón "Salir modo invitado" |
| Ese botón | Preguntaba *"También te borro de sus usuarios"* sin haberse registrado nunca |
| **Diablitos** | **Escondía el engrane**, porque pregunta por la misma copia |

Es decir: entrar a ver la opción y salirse ya te dejaba marcado.

#### 2.2 Y un problema más serio

Al **escanear un QR válido** la app sobrescribe la configuración de Firebase con
la del anfitrión, pero la identidad seguía siendo la propia y **nunca se te
registraba** en su lista de usuarios. Si te salías en ese punto, el teléfono
quedaba apuntando a la base de datos de otra persona: se podía **leer y escribir
en la base de alguien que no te había invitado**.

Por eso la copia se toma **en el momento exacto de escanear** (es lo último
antes de cambiar la base) y no antes.

#### 2.3 Lo que quedó

| Momento | Qué dice la app | Botón de salir | Diablitos |
|---|---|---|---|
| Solo miraste la opción | "Entra a otra base como invitado…" | no sale | engrane normal |
| Escaneaste, estás escribiendo tu nombre | **"Solicitando Acceso"** | no sale | engrane normal |
| **Ya te registraste** | "Estás de visita. Al salir vuelves a tu base." | **sí sale** | engrane oculto |
| Escaneaste y te saliste | Vuelve todo a como estaba, **solo y sin preguntar** | — | — |
| Cerraste la app a medio camino | Al abrir, restaura **antes de conectarse a nada** | — | — |

"Salir sin preguntar" es a propósito (decisión de Fredy): si te sales a medio
camino, se deshace todo en silencio.

**Ese es el momento exacto en que se es invitado: cuando te registraste.**

Al registrarte **no aparece ninguna ventana**: se va directo a la sala de
espera. Se usa `location.replace` y no `href`, para que el botón atrás del
celular no devuelva al formulario de registro de otra persona.

#### 2.4 Lo que queda en el teléfono mientras eres invitado

| Qué | Qué tan grave |
|---|---|
| Lista de nombres de usuarios del anfitrión | Bajo, son nombres |
| Config de Firebase del anfitrión (la "dirección" de su base) | Bajo |
| **Códigos de acceso del anfitrión** | **Eliminado (ver sección 4)** |

Cuando se te expulsa, tu copia restaura todo y esos datos desaparecen.

---

### 3. Encuentros Guiados — los 5 problemas

#### 3.1 El tag de nivel nunca se veía — **NO ERA UN BUG**

`Encuentros/index.html:123` traía `<div id="nivelTag" hidden>` y el código solo
hacía `tag.style.display = ""`, que **borra** la declaración en línea pero no
quita el atributo `hidden`. Se preguntó y **Fredy confirmó que el nivel se
pidió escondido a propósito**: se queda así. El texto se escribe igual, pero no
se muestra.

Ojo: el mismo patrón está en `Guiadas/index.html:171`. Si algún día se quiere
mostrar, hay que quitar el `hidden` o poner `tag.hidden = false`.

#### 3.2 Se podía salir de la partida sin querer — **ARREGLADO**

Había **tres** salidas automáticas y solo dos eran las oficiales
("Pausar y Salir" y "Terminar Partida"):

| # | Cómo se salía | ¿Quedaba registrada la salida? |
|---|---|---|
| 1 | Botón "← Lista" (arriba a la derecha) | no |
| 2 | **Gesto de atrás del celular** | no |
| 3 | Enlace "← Inicio" (arriba a la izquierda) | no |

Regla de Fredy: **durante la partida nadie sale**. Ahora las tres están cerradas:
el botón se borró, "← Inicio" se oculta mientras juegas, y el gesto de atrás no
hace nada (se devuelve al estado del juego en vez de dejarte salir). Los dos
botones oficiales siguen igual.

**Consecuencia:** el invitado también queda atrapado en la partida. Se queda
hasta que la partida acaba, y entonces el juego lo expulsa.

#### 3.3 La partida se trababa si alguien ya no estaba — **ARREGLADO**

`avanzarSesion()` exige `d.orden[d.turno] === miId`. Si ese jugador ya no
existe, **nadie puede avanzar nunca** y la partida queda congelada. Se reprodujo:
4 clics, ronda sin avanzar.

Causa: al salir del modo invitado se borraba al usuario de `config/ajustes` pero
**no de `sesionEncuentros/actual.cabezas/orden`**. Quedaba fantasma.

**Decisión de Fredy: se brinca y siguen los que quedan.** Se implementó
`sanearSesion()`: quita a los que ya no están de `cabezas`, `orden` y `listas`,
y si le tocaba a uno de ellos ahora le toca al siguiente que quede. Se aplica al
retomar, al unirse, **y en vivo** (una escucha de `config/ajustes` recalcula el
turno en el momento). De paso, **las acciones del que se va se borran del
documento**.

#### 3.4 A los invitados les llegaban acciones de otro nivel — **ARREGLADO**

Eran dos fallas separadas:

1. **Injusticia**: el pool de cada nivel se repartía "el que llega primero", y
   el anfitrión se lo llevaba entero.
2. **Faltan datos**: con tomas `básico:3` y 2 personas del mismo lado se
   necesitan 6 y solo hay 3. Eso no es un bug, es que no hay suficientes.

Arreglo: reparto por posición (en cada una, **todos los del mismo lado sacan
del mismo nivel**) y, cuando el nivel no alcanza, **se repite una de ese mismo
nivel** antes de mezclar niveles. La mezcla de niveles solo ocurre si la
actividad **no tiene ninguna** acción de ese nivel.

Comprobado con tomas `2,2,1,1,1` y 3 jugadores: **los tres reciben exactamente
`Básico > Básico > Medio > Medio > Avanzado > Experto > Alucinado`**.

#### 3.5 El anfitrión nunca veía el aviso de fin — **ARREGLADO**

El aviso "¡Se acabó la partida!" solo le llegaba a los invitados; el anfitrión y
la pareja caían mudos a la lista. `#finMsg` ("¡Encuentro completo! 🔥") era
**código muerto**: solo se alcanzaba jugando sin internet.

Ahora les llega a los tres. Ojo: cuando **el anfitrión aprieta "Terminar
Partida"** no le sale a nadie, porque él mismo lo decidió.

#### 3.6 Botón "Saltar turno" (nuevo, solo anfitrión)

Para cuando a alguien se le **cae la red o se le apaga el celular**: sigue en el
turno y el juego lo espera para siempre.

- Solo el anfitrión lo ve.
- Solo aparece cuando **no es su turno**.
- El texto dice a quién: "Saltar turno de Pareja".
- Pide confirmación.
- Si el saltado era el último de la ronda, la ronda avanza y se revuelve el
  orden.

---

### 4. Fuga de códigos de acceso (corregida)

**El hallazgo más delicado de la ronda.**

Mientras eres invitado, la configuración del teléfono es la del anfitrión. La
app escucha el catálogo de esa base y, sin protección, **guardaba en el teléfono
del invitado los códigos de acceso del anfitrión**, de forma automática al
volver a abrir la app.

Comprobado de las dos formas:

| | Contenido de `licencias` en el teléfono del invitado |
|---|---|
| **Sin** protección | `{"guided":"COD-MIO", "encuentros":"encuentros\|host\|host@ejemplo.mx"}` |
| **Con** protección | `{"guided":"COD-MIO"}` |

Choca con lo que ya decía la guía ("las licencias NO viajan al modo invitado").
Arreglo en `acceso.js`: mientras la identidad diga invitado, se revisa el
catálogo del anfitrión pero **no se guarda ningún código nuevo**. Al expulsarse,
`restaurar()` deja las licencias como estaban.

**Nota sobre las pruebas:** la primera versión de esta prueba daba "OK" aunque la
protección no estuviera — estaba mal planteada. Hubo que rehacerla y comprobar
que **sin** la protección **falla**. Regla que queda: si una prueba da verde,
hay que verificarla **quitando lo que se acaba de arreglar**.

---

### 5. La sala de espera (`Diablitos`)

#### 5.1 Qué era y qué es

`Diablitos` ya se llamaba "Sala de Espera" pero era solo eso: un juego local
tocar-diablitos. No tenía salida a ningún lado, no usaba internet y no tenía
forma de enterarse de una partida.

Ahora es **el lugar donde espera el invitado**. Sin salida, a propósito: el
invitado no puede pasearse por los datos del anfitrión. Al terminar de
registrarse, el invitado **cae aquí directo**: no hay ninguna ventana que
confirmar.

#### 5.2 El patrón, para que se repita en cada juego nuevo

```
Un juego arranca   →  publica su invitación en un documento compartido
La sala la escucha →  le sale la tarjeta con "Entrar"
El invitado entra  →  se queda ahí hasta que la partida acaba
La partida acaba   →  la sala lo expulsa sola y le devuelve su información
```

Un juego con invitados **no copia nada de lógica**: solo publica su invitación.
Ese es el motivo de centralizarlo en `invitado.js`.

#### 5.3 Dónde viven las invitaciones

Documento `invitaciones/{idDelJuego}` en la base de la pareja. **Uno por juego**,
no una lista que crezca:

```js
{ juego:"encuentros", titulo, icono, ruta, hostUid, hostNombre,
  participantes:[ids], sesion:"sesionEncuentros/actual", activa:true, pausada:false, sid }
```

- Un juego publica con `publicarInvitacion()` al arrancar y al **retomar**; con
  `retirarInvitacion()` al **acabar** (natural o "Terminar Partida").
- **Al pausar NO se retira**, se marca en pausa con `pausarInvitacion()`. Es
  importante: si se retirara, la sala creería que la partida terminó y
  **expulsaría al invitado** que está esperando.
- La sala escucha con `vigilarInvitaciones()` y **comprueba que la partida siga
  viva**: lee el documento de `sesion` y exige `activa:true` y el mismo `sid`.

**Por qué esa comprobación (hallazgo de Fredy, oct-2026).** El aviso es un
documento aparte, así que **se quedaba pegado**: una partida que se cerró sin
retirarlo (una prueba, o el anfitrión cerrando la app a media partida) dejaba el
aviso vivo, y se lo comía el siguiente invitado que llegara a la sala. Ahora un
aviso solo vale si **la partida que lo publicó sigue corriendo**.

**Nada de esto necesita reglas nuevas de Firestore**: es un documento más en la
base de la pareja, con las mismas reglas de siempre.

#### 5.4 Qué se ve en la sala

| Estado | Qué aparece |
|---|---|
| No eres invitado (entraste por el menú) | Nada de la sala. El juego normal, su engrane, y un **"‹ Inicio"** arriba a la derecha |
| Eres invitado, sin partida | "Esperando Invitación…" |
| Eres invitado, **con la partida en pausa** | "La partida está en pausa…" (no se puede entrar todavía, y **no se expulsa**) |
| Eres invitado, con partida | Tarjeta con icono, título y "Anfitrión te está esperando" + botón **Entrar** |
| La partida termina (de verdad) | Expulsión automática y regreso a su propia base |
| Aviso de una partida que ya no existe | Se ignora (ver 5.3) |

**El botón "Sala" y el juego van juntos:** al apretar **Entrar**, la sala manda a
`{ruta}/?entrar=1`, y el juego con eso **entra directo al juego**, sin volver a
preguntar "¿quieres unirte?". Antes preguntaba en la sala y otra vez en el juego
(hallazgo de Fredy, oct-2026).

**Regresar (hallazgo de Fredy, oct-2026):** el "‹ Inicio" de arriba a la derecha
**solo sale si NO eres invitado**. El invitado no tiene salida, a propósito.

**La sala es SOLO para invitados** (decisión de Fredy, oct-2026). La pareja no
es invitada: no ve el panel ni entra aquí por su cuenta.

**Al pausar el anfitrión** (quien ve el aviso de pausa):
- **El invitado** va a la sala. La partida está PAUSADA, no terminada, así que
  **no se le expulsa**: la invitación sigue viva y desde la sala puede volver a
  entrar con "Entrar" cuando el anfitrión retome.
- **La pareja** se queda en la pantalla de espera de Encuentros, que es suya.

Al terminar la partida (no al pausar) la invitación se retira y el invitado sale
solo, esté donde esté.

#### 5.5 Lo importante: la sala NO puede romper el juego

El bloque que escucha invitaciones va **aparte**, en un `<script type="module">`
propio. El juego de diablitos sigue siendo un `<script>` normal sin internet:

- Si no hay internet, o la configuración falla, o algo se cae → el bloque se
  queda callado y **el juego funciona exactamente igual que antes**.
- No se le importó nada de Firebase al juego.

#### 5.6 Dónde aparece Diablitos en el menú

**Fijo para todos, sin candado** (decisión de Fredy, oct-2026). No va por el
catálogo: está escrito en `renderPacksDeVerdad()` con `libre: true`, que salta la
comprobación de licencia. Así el submenú **🎮 Juegos** aparece siempre y
Diablitos se ve sin pedir acceso.

Los demás juegos siguen **armándose solos** desde el catálogo (`packs`), con su
candado. `FIJOS` es la lista de los que no se leen del catálogo (`guiadas` y
`diablitos`), para que no se dupliquen si algún día alguien los da de alta ahí.

---

### 6. Archivos tocados

| Archivo | Qué cambió |
|---|---|
| **`invitado.js`** | **Nuevo.** Un solo lugar para: cuándo eres invitado de verdad, copiar/restaurar, salir, y **publicar/retirar/pausar/vigilar invitaciones**. `vigilarInvitaciones()` comprueba que la partida siga viva |
| `index.html` | Usa `invitado.js`; el modo invitado solo empieza al registrarse; "Solicitando Acceso"; salidas en silencio; recuperación al abrir; **el invitado registrado va a la sala** (antes a Encuentros); **Diablitos fijo en el menú, sin candado** |
| `acceso.js` | `soyInvitadoAhora()` + guarda en `escucharCatalogo` para no guardar códigos siendo invitado |
| `Encuentros/index.html` | Secciones 3.2 a 3.6 + publicar/retirar/pausar su invitación + al pausar, el invitado vuelve a la sala + **entrar directo con `?entrar=1`** |
| `Diablitos/index.html` | Panel de la sala (espera / en pausa / tarjeta / entrada / expulsión) + `esModoInvitado()` corregido + **"‹ Inicio" solo si no eres invitado** + el botón Entrar manda a `?entrar=1` |

Se borraron del inicio las copias de `hayRespaldo()` / `respaldarSesion()` /
`restaurarSesion()`: quedan en un solo lugar, que es la razón por la que este
repo ya tiene `acceso.js` y ahora también `invitado.js`.

---

### 7. Cómo se verificó

Con un arnés propio (`Temp\opencode\`; **ya retirado**, ver la nota al inicio):
**Firestore simulado en memoria + Chrome headless**. No es "se ve bien", es la
app corriendo de verdad.

| Suite | Casos |
|---|---|
| **Encuentros** (13) | niveles · invitación · **entrar directo** · anfitrión · botón saltar · fin · invitación al invitado · pareja · pausa · fin con limpieza · se fue un invitado · multi · partida vieja · sin licencia |
| **Inicio** (6) | nada · escaneo a medio camino · registro completo · recuperación al abrir · invitado ya registrado con códigos · menú (Diablitos sin candado) |
| **Sala** (7) | no eres invitado (con regresar) · invitado esperando · con invitación (Entrar directo) · **en pausa** · **aviso de partida muerta** · **aviso viejo sin `sesion`** · expulsión al acabar |

**26 casos, todos sin errores de JavaScript.**

Lo que se comprobó de la sala, en orden:

```
invitado, sin partida  -> "Esperando Invitación…", sin tarjeta
con invitación        -> tarjeta con título/icono/anfitrión, Entrar -> Encuentros
la invitación se retira -> expulsión solo: respaldo borrado, base y identidad propias
el juego de diablitos   -> arranca en los 4 escenarios, con y sin internet
```

---

### 8. Cómo volver a probarlo

1. Fredy sube con **GitHub Desktop**.
2. Espera 1–2 min.
3. Incógnito o **Ctrl+Shift+R**.

**Encuentros**
1. Arma partida con invitado; confirma que **todos** reciben el mismo orden de niveles.
2. Intenta salir con gesto de atrás y con "← Inicio": **no te deja**.
3. Cuando le toque a tu pareja, sale "Saltar turno de [nombre]".
4. Termina la última ronda: les llega el mensaje a ti y a tu pareja.
5. Desde el ⚙️ borras a un invitado en pleno juego: el turno **se brinca solo**.
6. **Pausa**: el invitado vuelve a la **sala** y ahí ve *"La partida está en pausa…"* (sin tarjeta y **sin salir del modo invitado**); tu pareja se queda en la pantalla de espera de Encuentros. Al **retomar**, en la sala del invitado reaparece la tarjeta.

**Menú**
7. En el inicio debe estar el botón **🎮 Juegos** y, dentro, **Diablitos** sin candado. Al entrar por el menú, arriba a la derecha debe salir **"‹ Inicio"**.

**Modo invitado**
8. ⚙️ → Invitados → "Entrar modo invitado" y **te sales sin escanear**: todo igual, sin rastro.
9. Escanea un QR y te sales: **todo se restaura solo**.
10. Escanea y **te registras**: **te manda directo a la sala** (sin ventana de "Listo" que aplastar), ves "Esperando Invitación…", y si abres el ⚙️ dice "Estás de visita" con su botón de salir.
11. Con la partida en curso, **borra al invitado** desde el ⚙️: al volver a abrir la app se expulsa solo.

**Sala (necesita dos teléfonos)**
12. Teléfono A: entra como invitado, llega a Diablitos, ve "Esperando Invitación…".
13. Teléfono B: anfitrión arma una partida en Encuentros.
14. En A debe salir la tarjeta. Al apretar **Entrar** debe caer **directo en el juego** (sin volver a preguntar).
15. Al terminar la partida, A debe salir solo del modo invitado y volver a su base.

**Pendiente por falta de una segunda persona:** el paso 10–13 completo con dos
teléfonos reales. Hasta esa prueba, la sala queda a medio validar.

---

### 9. Límites conocidos que dejó esta ronda

| Límite | Nota |
|---|---|
| Invitado apaga el celular o pierde red | Sigue en el turno. Mitigación: botón "Saltar turno" del anfitrión |
| **Sin internet**, el invitado no se expulsa al abrir | Deliberado y viejo: no se expulsa a nadie de una partida en curso por un corte de red. Solo afecta al reinicio |
| Invitado que nunca recibe invitación | Espera indefinidamente en la sala. Cerrar la app lo resuelve |
| Escaneó y se salió | Se pierde el QR y hay que escanear de nuevo. Preferible a quedar pegado a una base ajena |
| Varios juegos con invitación a la vez | La sala muestra el primero. Falta decidir el orden |
| Datos viejos de "invitado de invitado" | No se limpian (ya estaba en pendientes antes de esta ronda) |

---

### 10. Decisiones tomadas

**Decidido por Fredy (oct-2026):**

| Decisión | Detalle |
|---|---|
| Al registrarse, **directo a la sala** | Sin ventana de "¡Listo!". Con `location.replace` para que atrás no regrese al formulario de otra persona |
| **Diablitos NO lleva candado, y va en el menú** | Fijo en el submenú **🎮 Juegos** para todos (ver 5.6). El resto de juegos se sigue armando solo desde el catálogo |
| **Un aviso sin `sesion` no se muestra** | Descarta los avisos publicados antes de existir el campo (el caso que le salió al probar) |
| **La sala es solo para invitados** | La pareja no es invitada: no ve el panel ni entra por su cuenta |
| **Al pausar**: el invitado va a la sala, la pareja se queda | Ver 5.4. Al *terminar* (no al pausar) el invitado sale solo, esté donde esté |
| **Se brinca al que ya no está** | En vez de parar la partida (sección 3.3) |
| **Nivel escondido** | El tag de nivel se pidió oculto: no es bug (sección 3.1) |
| **El aviso solo vale si la partida vive** | La sala comprueba la `sesion` antes de mostrar nada (sección 5.3) |
| **En pausa no se puede entrar, pero tampoco se expulsa** | Se marca el aviso en pausa, no se retira (sección 5.3) |
| **Entrar desde la sala es directo** | `?entrar=1`; sin doble pregunta (sección 5.4) |
| **"‹ Inicio" en Diablitos solo si no eres invitado** | El invitado sigue sin salida (sección 5.4) |

**Pendiente de Fredy (no de código):**

- **Probar la sala con dos teléfonos reales.** Es lo único del flujo de la sala
  que no se ha validado en vivo (todo lo demás se probó con la app simulada).
- Cuando haya más juegos con invitados, **ver dónde posicionarlos** en el
  submenú Juegos (hoy Diablitos está fijo; el resto sale del catálogo).

---

### 11. Nota de mantenimiento

- **`General/` es la consolidada.** Cualquier cambio de esta fase debe
  reflejarse en `GUIA-PROYECTOS.md` (estado general + pendientes) con el formato
  `Hecho (mes, publicado): ...`, cuando se suba.
- Al guardar texto en Windows, si un archivo sale con los acentos duplicados la
  causa es doble conversión UTF-8. Ver `GUIA-PROYECTOS.md` §10.

---

## Parte 2 - Detalle de `Encuentros/` y del modo invitado (verificado oct-2026)

> Origen: `Encuentros-y-Modo-Invitado.md` (04/10/2026), conservado literal.
> Aqui esta el detalle fino, con numeros de linea, el "por que" de cada
> correccion y la lista de verificacion. La Parte 1 lo resume; esto lo respalda.


#### 1. Resumen de la ronda

| Tema | Qué quedó |
|---|---|
| Continuación | Se retoma **la actividad que se estaba jugando**, no la última abierta |
| Pausa | El anfitrión pausa y sale; los demás reciben un aviso |
| Terminación | El anfitrión puede terminar la partida; los invitados reciben el aviso de fin y salen del modo invitado |
| Datos del anfitrión | Si el invitado abre la app **sin partida activa**, vuelve **en silencio** a su propio espacio |
| Aviso de fin | Ya no se repite al volver a entrar a jugar |
| Selector de invitado | Solo muestra los perfiles base (admin y pareja), nunca a otros invitados |

#### 2. Cómo está guardado el estado de la partida

Todo vive en **un** documento: `sesionEncuentros/actual` (en la base de la
pareja). Campos que se agregaron o se usan hoy:

| Campo | Para qué |
|---|---|
| `activa` | La partida está corriendo |
| `pausada` | El anfitrión pausó y salió |
| `terminada` | La partida se acabó (por ronda o por el anfitrión) |
| `porAdmin` | La terminó el anfitrión, no se llegó al final |
| `sid` / `reanudada` | Identifica la partida y marca que se retomó |
| `ronda` / `turno` | A quién le toca en este momento |
| `cabezas` | Quiénes participan (admin, pareja e invitados) |

`terminada` **no se borra**: se sobrescribe cuando el anfitrión inicia una
partida nueva (`generarYIniciar` la vuelve a dejar en `false`). Por eso una
partida vieja puede seguir marcada con `terminada: true` — de ahí el cuidado del
punto 6.1.

#### 3. Continuación por actividad

`chequearPendiente(esMulti, actividad)` (`Encuentros/index.html:384`) se llama
al tocar una actividad (`410`) y al abrir MultiActividades (`725`).

- La búsqueda filtra **por la actividad elegida**, no "la última abierta".
- Si hay partida pendiente **de esa misma actividad**, se ofrece continuar.
- **No** hay aviso automático al abrir la página: si el usuario no toca esa
  actividad, no se le interrumpe.
- El botón **"Encuentro nuevo"** (`137`) reinicia esa misma actividad desde
  cero, sin volver al selector.
- Mientras corre, el que espera ve **"Turno de {nombre}"** (`937`).

Al continuar, la sesión se reactiva con `sid` nuevo y `reanudada: true`
(`995`), que es lo que hace que el otro lado reciba el aviso de que la partida
se retomó.

#### 4. Pausa y terminación

| Botón | Quién lo ve | Qué escribe |
|---|---|---|
| **Pausar y Salir** (`127`) | solo anfitrión | `pausada: true` (`958`) |
| **Terminar Partida** (`128`) | solo anfitrión | `activa: false, terminada: true, porAdmin: true` (`969`) |

- Los dos botones **se ocultan a los invitados** en `mostrarBotonesAdmin()`
  (`899`): no es que fallen, es que no existen para ellos.
- Cuando el anfitrión pausa, los demás que.no son él ven el modal de pausa
  (`471-472`: `d.pausada && d.hostUid !== miId`).
- Cuando la partida termina de forma natural, el avance de ronda escribe
  `terminada: true` (`538`).
- El texto del aviso de fin distingue los dos casos (`496-497`):
  - `porAdmin` → "La partida fue terminada por el anfitrión."
  - natural → "¡Se acabó la partida! Gracias por jugar."
- En ambos casos el invitado acepta y se ejecuta `salirModoInvitado()` (`253`).
- En toda la interfaz se dice **anfitrión**, no "administrador".

#### 4.1 Cómo van a jugar: un solo celular o cada quien en el suyo (oct-2026)

En la pantalla de elegir actividad hay un recuadro **"¿Cómo van a Jugar hoy?"**
con dos casillas exclusivas (mismo patrón que Citas Guiadas):

- **Cada quien en el suyo** (por defecto): es el comportamiento de siempre. Se
  escribe `sesionEncuentros/actual`, se invita a pareja e invitados y cada quien
  ve su turno en su propio celular.
- **Acciones en un Celular**: se juega **todo en el teléfono del anfitrión**,
  respetando los turnos y mostrando el nombre de quien toca. **No** se escribe
  sesión ni se invita a nadie; pareja e invitados participan viendo el celular
  del anfitrión.

El estado interno es la bandera `jugandoCompartido` (`Encuentros/index.html`):
en `true` manda la sesión compartida; en `false` todo es local (esa misma ruta
sirve de respaldo cuando no hay internet). Mientras se juega en un solo celular,
el listener de la sesión compartida no toca la pantalla.

#### 5. Modo invitado: que no se queden datos ajenos

##### 5.1 Salida explícita (`salirModoInvitado`, `254`)

1. Quita al invitado de los usuarios del anfitrión (`config/ajustes`).
2. Restaura su respaldo: `invitado_respaldo` (config, usuarios, identidad).
   Se conserva `taquilla_priv` porque es **la llave de la pareja**, no del
   invitado.
3. Borra el respaldo y regresa al inicio.

Lo que el invitado usó (lo prestado) se queda en la base del anfitrión, que es
lo correcto.

##### 5.2 Criterio A — volver solo si no hay partida

`volverSiInvitadoSinPartida(db)` (`index.html:739`), llamado desde `iniciar()`
(`731`) **antes** de entrar a la app:

1. Solo aplica si hay respaldo y la identidad tiene `invitado`.
2. Lee `sesionEncuentros/actual`.
3. Si **no** hay partida activa en la que participe → sale en silencio: quita
   al invitado de los usuarios, restaura su config y recarga.
4. Si **hay** partida activa → se queda como invitado, para poder seguir.
5. Si **no se pudo confirmar** (sin internet) → **se queda como invitado**. No
   se expulsa a nadie de una partida en curso por un corte de red.

##### Por qué A y no la opción B (vencimiento por tiempo)

Se evaluó agregar una caducidad (por ejemplo 12 horas) y se descartó: si el
invitado **cierra la app**, el código que revisa el tiempo no vuelve a correr,
así que el vencimiento **nunca se aplicaría**. A no depende de que el usuario
vuelva a abrir la app, y por eso **fuerza** la limpieza.

Que la configuración del anfitrión **se sobrescriba** en el teléfono del
invitado es justamente el objetivo: es la protección de los datos. No es una
pérdida, es el comportamiento deseado.

##### Límite conocido

La revisión ocurre en el **inicio**. Si el invitado abre `Encuentros/` directo
por un link guardado, el chequeo no corre hasta que pase por el inicio.

#### 6. Correcciones de esta ronda

##### 6.1 El aviso de fin salía repetido al volver a jugar

** Síntoma:** al terminar la partida, el invitado salía del modo invitado
(correcto). Luego entraba de nuevo como invitado, aceptaba el "¡Listo!", y
**de inmediato** le volvía a salir con "Se acabó la partida".

**Causa:** el documento conserva `terminada: true` hasta que el anfitrión inicia
otra partida. Al abrir `Encuentros/` por primera vez, el listener detectaba ese
documento viejo y, como no miraba si el invitado **estaba jugando**, lo sacaba
como si la partida acabara de terminar.

**Arreglo:** la condición del aviso de fin ahora exige `&& jugando` (`492`).
Es decir, el aviso sale **solo en la transición real** (estaba jugando y la
partida terminó), nunca por un documento viejo.

**Estado:** probado por Fredy, funciona bien.

##### 6.2 El selector "de quién eres invitado" mostraba a los invitados

**Síntoma:** el primer invitado veía correctamente solo a la pareja, pero del
segundo invitado en adelante el selector también listaba a los invitados
anteriores, permitiendo **ser invitado de un invitado**.

**Causa:** la lista se llenaba con `usuariosEfectivos()`, que devuelve **todos**
los usuarios de la base del anfitrión, invitados de sesiones anteriores
incluidos.

**Arreglo:** se filtra a los que **no** son invitados
(`index.html:1078`), dejando solo los perfiles base (admin y pareja).

**Nota:** el filtro aplica a partir de ahora. Si algún invitado ya registrado
antes eligió "invitado de invitado", ese dato viejo permanece en la base; no
afecta el funcionamiento.

#### 7. Archivos tocados en esta ronda

| Archivo | Qué cambió |
|---|---|
| `Encuentros/index.html` | Continuación por actividad, indicador de turno, "Encuentro nuevo", pausa/terminación, avisos, `salirModoInvitado()`, guarda `&& jugando` en el aviso de fin |
| `index.html` | `volverSiInvitadoSinPartida()` + llamada en `iniciar()`; filtro del selector de invitado; redirección del invitado a `Encuentros/` al aceptar |

#### 8. Verificación

##### 8.1 Estática (sin navegador)

Scripts en `Temp\opencode\`, sobre los archivos con `<script>` embebido:

| Script | Qué revisa |
|---|---|
| `jscheck.py` | Equilibrio de `{}[]()`, ignorando strings, comentarios y regex |
| `undef.py` | Funciones llamadas pero no definidas ni importadas (pantalla en blanco) |
| `expcheck.py` | Que todo lo importado de `acceso.js` exista de verdad |
| `argcheck.py` | Argumentos de las funciones de `acceso.js` |
| `dupcheck.py` | Nombres declarados dos veces |

Los 5 pasan. Falsos positivos conocidos (preexistentes, no de estos cambios):
`Error`, `Invitado`, `button`, `completo`, `rechazar`, `URLSearchParams`.

##### 8.2 Manual, en el celular (Fredy) — TODO PROBADO

Probado y **confirmado funcionando en el celular**:

- Pedir → Aprobar → Revocar desde `Autorizar/`.
- Continuar la partida de **la actividad elegida**.
- Pausa del anfitrión y aviso a los demás.
- Terminar partida y el aviso de fin con salida del invitado.
- Volver a entrar como invitado **sin** que salte el aviso de fin.
- El invitado vuelve solo a su propio espacio cuando abre la app sin partida
  activa (criterio A).
- El selector "de quién eres invitado" muestra **solo** la pareja, también en
  el segundo invitado y en adelante (ya no hay invitados de invitados).

**Estado: la ronda queda cerrada y verificada (oct-2026).**

##### 8.3 Cómo volver a probar

1. Fredy sube con **GitHub Desktop**.
2. Espera **1–2 minutos** (Pages).
3. Entra en **incógnito** o con **Ctrl+Shift+R** (`Cache-Control: max-age=600`).

#### 9. Límites conocidos (no bloquean)

- El retorno automático del invitado se evalúa **solo en el inicio** (5.2).
- Datos viejos de "invitado de invitado" **no se limpian** (6.2). Solo afecta a
  registros anteriores al arreglo; no rompe nada.
- El doble `getDocs` de `escucharCatalogo()` sigue ahí (leer el mismo dato dos
  veces). No es un bug, solo gasto extra.

#### 10. Nota de mantenimiento

- `GUIA-PROYECTOS.md` **ya quedó reparado** (oct-2026). Estaba doble-codificado:
  el texto se guardó ya convertido en una segunda pasada UTF-8, así que los
  acentos y los emojis aparecían como caracteres raros (dos letras deforme en
  lugar de una, y el guion largo partido en tres). Se deskodificó con el script
  `Temp\opencode\fixencoding.py` (respaldo en `GUIA-PROYECTOS.md.bak`) y se
  verificó que el texto sin acentos quedó idéntico al original. Los demás
  archivos de `General/` y de `Downloads/` se revisaron y están sanos.

> Al guardar texto en Windows, si un archivo sale con los acentos duplicados,
> la causa es que se escribió dos veces: UTF-8 guardado como si fuera
> Windows-1252 y luego vuelto a guardar como UTF-8. A mano no se arregla: hay
> que deshacer la doble conversión.

- No hay `firestore.rules` en el repo: las reglas viven en la consola. La
  revisión de esos paths sigue pendiente (está en `GUIA-PROYECTOS.md`).

---


---

## De "no se puede borrar" a "es tuyo" (oct-2026)

**El problema.** El contenido inicial se metio en archivos del repo
(`Citas/actividades.json`, `Citas/accesorios.json`) y las pantallas lo mezclaban con
lo de la pareja en **cada carga**: `baseActs.concat(extrasActs.map(...))`. Como lo de
fabrica no vivia en la base, no existia `buscarExtraAct()` para el, asi que no tenia
boton de borrar ni renombrar. Y aunque lo tuviera, el JSON lo reponia en cada
recarga.

**La regla de ahora: los JSON son solo el instalador.** La base manda.

| Antes | Ahora |
|---|---|
| `fabrica.concat(base)` en cada carga | `asegurarFabrica()` una vez; despues solo la base |
| Lo de fabrica no se podia borrar | **Todo** se borra y se renombra |
| Borrar no servia de nada | Lo borrado se queda borrado |
| Sin lista de "ocultos" | No hace falta: no hay merge |

**Como funciona** (`config.js`):

1. Se lee `config/fabrica`. Si existe, no se hace nada mas.
2. Se siembra lo que falte en `actividadesExtra` y `accesoriosExtra`, con
   `{nombre, origen:"fabrica"}`. Se respeta lo que ya tenia: no se pisa ni se duplica.
3. Se escribe la banderita con **los nombres instalados**
   (`actividades:[...]`, `accesorios:[...]`) y `VERSION_FABRICA`.

El paso 3 es lo que hace que **lo borrado no regrese**: el nombre sigue en la lista de
instalados, asi que las siguientes cargas lo saltan. Y si el repo **agrega** una
actividad nueva a `actividades.json`, esa si entra, porque su nombre no estaba en la
lista.

**Si no se puede escribir** (reglas cerradas, sin conexion) `asegurarFabrica()`
devuelve `false` y cada pantalla conserva el JSON como lista de respaldo, tal como
antes. Nada se rompe: se ve la fabrica pero sin poder editarla.

**Las 5 pantallas** hacen exactamente lo mismo:

| Pantalla | Que hace |
|---|---|
| `Citas/actividades.html` | `asegurarFabrica(...)`; si sembro, `baseActs=[]` y `catalogoAcc=[]` |
| `Citas/accesorios.html` | idem con `catalogo=[]` |
| `Citas/index.html` | `unirConFabrica(extras, fabrica)` solo si **no** sembro |
| `Guiadas/index.html` | idem, sobre `actividadesExtra` |
| `Encuentros/index.html` | idem, sobre `actividadesExtra` |

Las 5 leen **los dos** JSON aunque no usen los dos: el instalador corre una sola vez y
la pantalla que abra primero tiene que sembrar todo.

**Ojo con `nivelesActividad` y `presetsActividad`:** sus IDs siguen siendo el nombre
de la actividad (ver la tabla de arriba). Un item recien sembrado no tiene doc de
niveles: eso es igual que antes. Y los presets `<Actividad>.json` se conservan como
respaldo de `presetsActividad`, igual que `usuarios.json` con los usuarios.

**Pruebas:** esto se verificó en su momento con el arnés (**ya retirado**, ver la
nota al inicio); hoy se prueba **en vivo** sobre las 5 pantallas reales.

**Al ELIMINAR** se borran las cuatro primeras. **Las citas NO se tocan** (decision
de Fredy, oct-2026): la cita ya agendada sigue existiendo aunque su actividad
desaparezca de la lista.

**Ojo:** estas dos pantallas **no las cubren las pruebas automaticas** (necesitan
Firebase). Se revisa sintaxis, ids y `<div>` cuadrados, pero **el
funcionamiento lo prueba Fredy a mano**.

### Documentos que se archivaron (contenido volcado aqui)

Los documentos de abajo se movieron a
`Default Project\General\archivo\` el oct-2026. **Todo su contenido esta aqui o
en `GUIA.md`**, sin recortes.

- `Fase-1.md` -> Parte 1 (de este archivo)
- `Encuentros-y-Modo-Invitado.md` -> Parte 2 (de este archivo)
- `Modulo-Accesos.md` -> *Licencias, `acceso.js` y el catálogo* + *`Autorizar/`*
  (las dos en `GUIA.md`)


---

## Relatos que estaban en GUIA.md y se bajaron aqui (oct-2026)

Estas secciones eran **relato con fecha**: cuentan un cambio ya hecho, no una
regla que rija. Se bajaron para que `GUIA.md` se pueda leer de arriba a abajo.
**Lo que hace falta saber hoy esta en `GUIA.md`, no aqui.**

### Autorizar un reto fallaba con "Revisa tu conexión" (corregido oct-2026)

**Lo reportó Fredy:** en el celular, capturar y proponer un reto iba bien, pero al
**autorizarlo** salía *"Error al guardar. Revisa tu conexión."* con internet
perfecto.

**La causa no era la conexión:** en `Retos/index.html`, la rama de `autorizar`
escribía `fechaInicio: ahora` y `fechaFin: finDeUltimoDia(ahora, …)`, pero
**`ahora` no existía en esa rama**. Esa variable solo se declaraba dentro de la
rama de **"nueva"** (`const ahora = new Date();`). Al no estar, JavaScript lanzaba
un error, el `catch` lo atrapaba y mostraba el mensaje de conexión.

**El arreglo:** declarar `const ahora = new Date();` también dentro de la rama de
`autorizar`, antes del `updateDoc`. **Un error real de programación, no de red** —
por eso "revisa tu conexión" engañaba.

**Regla que deja:** el `catch` genérico *"Revisa tu conexión"* **oculta cualquier
fallo**, no solo los de red. Cuando un mensaje así sale con buena conexión, casi
siempre el error está en el código y hay que mirar la consola, no el módem.


### Los puntos de los retos cumplidos no acumulaban (corregido oct-2026)

**Lo reportó Fredy:** los puntos de los retos cumplidos no se acumulaban.

**La causa estaba en `marcarCumplida`** (`Retos/index.html`, retos **normales**).
Cada "Cumplida +1" sumaba un punto a quien tenía que cumplir, pero **en el último
+1** (cuando se alcanzaba la meta) el código hacía una cosa rara:

```js
const delta = metaAlcanzada ? (1 - (reto.puntosMeta || 0)) : 1;
```

Es decir, en vez de `+1` daba `1 - meta`, que es **negativo y se lleva todo lo
acumulado**. Con una meta de 7: los +1 dan +6 y el último clic mete `-6` →
**neto 0**. Con cualquier meta el resultado era siempre 0: **los puntos se
perdían justo al completar el reto**.

**El arreglo (decisión de Fredy, oct-2026):** ahora cada "Cumplida +1" suma un
punto y **no se descuenta nada al llegar a la meta** (`const delta = 1;`). Un reto
normal de meta 7 deja a quien lo cumplió con **+7 pts**, que es lo esperable.

**También se quitó el segundo lugar con la misma idea:** en
`finalizarRetosVencidos()`, cuando un reto normal se liquidaba ya cumplido, se le
restaba la meta (`increment(-puntosMeta)`). **Completar un reto nunca resta.**
Ese camino casi no se disparaba (al llegar a la meta el reto ya pasa a
`cobrada`), pero se quitó para que la regla sea limpia.

**No se tocaron** los retos de la IA (ya daban bien el valor entero) ni la
penalización de los retos **no cumplidos** (esa resta es a propósito).


### Descartar un reto de la IA, y que los retos dejen de ser aburridos (oct-2026)

**1. Faltaba el "no".** El reto que propone la IA salía con **un solo botón**,
"➕ Crear este reto (N pts)". No había forma de decir que no, y el botón **se
quedaba ahí para siempre** en los mensajes viejos: uno lo apachaba sin querer y
se creaba un reto que nadie había pedido.

Ahora hay **fila de dos**: "➕ Crear este reto" y **"Descartar"**. Descartar **no
borra nada de la base y no crea nada**: solo marca `retoDescartado` en el mensaje
de ese chat, esconde los dos botones y pone *"Reto descartado"* en su lugar. La
marca se guarda con el historial, así que sigue descartado aunque recargues.

**2. Los retos salían demasiado típicos ("tomar café").** La instrucción decía
"atrevido", "picarón", "coqueteo intenso": **adjetivos**, y un modelo no obedece
adjetivos. Se cambió por **ejemplos con contraste**, que es lo que sí funciona:

- **ESTO SÍ es reto tuyo:** "dile al oído algo que nunca le hayas dicho", "que se
  vista pensando en ti y tú no dices nada hasta la cena", "déjale una nota a
  medio día que solo tenga sentido cuando llegue a casa"…
- **ESTO NO es reto tuyo y NUNCA lo propones:** "tomar café", "caminar por el
  parque", "salir a cenar", "ver una película", "hacer ejercicio", "relajarse".

Y la definición de arriba: *un reto es una acción concreta que obliga a alguien a
**exponerse** un poco. Nada de planes lindos.*

**3. Los ejemplos iban dirigidos a la pareja, no al abstracto (oct-2026).** Los
primeros ejemplos eran retos "de hacer algo" (ir a un lugar, poner música) y
salían neutros. Fredy pidió que el registro fuera **dirigido a la pareja y de
doble sentido**. Así quedó:

> un reto tuyo es una acción concreta, con nombre y apellido, **que le haces A TU
> PAREJA** y que lo obliga a EXPONERSE un poco. Tu especialidad es el **DOBLE
> SENTIDO**: insinúas, insinúas fuerte, pero nunca cuentas qué va a pasar. Un
> reto bueno **se entiende con la cabeza y se siente con otra cosa**.

Ejemplos: *"acaríciala por donde sabes que le gusta, y por donde a ti más te
gusta, sin decir una sola palabra"*, *"quítale la ropa despacio, como si
tuvieras todo el tiempo del mundo, y deja que se relaje"*, *"masaje en la espalda
que poco a poco se vaya convirtiendo en otra cosa; cuando llegue, no explicas
nada"*.

**El límite sigue siendo el mismo:** doble sentido y sugerencia, **nunca
describir el acto**. Esa línea está aparte en la instrucción y no se tocó.

**Ojo: esto es dirección, no un botón.** No se puede garantizar qué genera el
modelo. Si aun así salen retos planos, el siguiente escalón es un filtro en
`extraerReto()` (una lista de palabras prohibidas que avise "ese reto no sirve" y
pida otro), y eso ya sería decisión de producto.


### La variedad de los retos de la IA (oct-2026)

**Lo que existía:** los botones mandaban **siempre la misma frase** al modelo
(`", proponme un reto picarón de hoy 😏"`). Con la misma entrada, el modelo devuelve
el mismo reto con otro nombre. Fredy lo notó: *"todos son prácticamente lo mismo,
solo hace un juego de palabras o moviendo el lugar"*.

**El arreglo que de verdad mueve la aguja no son los ejemplos: es la entrada.**
Los botones ahora eligen al azar entre varias peticiones distintas:

```js
const PEDIROS_RETO = [ ", proponme un reto picarón de hoy 😏",
                       ", dame un reto de esos que dan vergüenza pedir 😏", ... ];
const pedirAlAzar = (lista)=> lista[Math.floor(Math.random() * lista.length)];
document.getElementById("btnIdea").onclick = ()=>enviar(NOMBRE_AI + pedirAlAzar(PEDIROS_RETO));
```

**6 peticiones para retos y 5 para planes.** Distinta entrada → respuesta de
verdad distinta. Esto es lo que quitó el patrón; los ejemplos solo lo acompañan.

**Además se amplió la instrucción:**

- Se pasaron de 5 a **10 ejemplos de retos**, variando la acción, el lugar y
  **quién manda** (a veces ella, a veces tú), y se agregó al final: *"OJO: no te
  repitas. Cada reto es distinto de los demás en la acción, en el lugar y en
  quién manda. Si se te ocurre uno que se parece a otro, ese no lo mandes."*
- **Los planes tenían cero guía**, y por eso salían tipo "cena romántica". Ahora
  tienen su propio bloque, con 5 ejemplos del mismo registro de doble sentido, y
  su propia lista de prohibidos.

**El límite sigue igual:** doble sentido y sugerencia, **nunca se cuenta qué va a
pasar**. Esa instrucción no se tocó en esta ronda.


### La instrucción de la IA se reescribió completa (oct-2026)

Fredy detectó que la instrucción de `PERSONA` (en `Acompanante/`) **tenía contradicciones internas**, y tenía razón: eran la razón de que los retos salieran siempre parecidos.

**El texto vive en un archivo aparte, editable:**
`Documents\Default Project\instruccion-IA.txt` (texto plano, sin código).
Ahí se edita a gusto con el Bloc de notas y se pasa por
`Temp\opencode\aplicar_persona.py`, que lo mete en `Acompanante/index.html`
cambiando `{SU_NOMBRE}` por `${NOMBRE_AI}` y **escapando las comillas
invertidas** (van dentro de un template literal; sin escapar rompen el archivo).

**Las cinco cosas que estaban mal y cómo quedaron:**

| Antes | Ahora |
|---|---|
| *"Solo cosas **verificables dentro de la app**"* — contradecía todos los ejemplos (un masaje no se verifica en un celular) | Se quitó. Quedó *"NUNCA pidas fotos, videos, audios ni capturas"* |
| El límite era solo "nunca explícito", y los ejemplos **ya se pasaban de la raya** | **Dos lados explícitos**: PUEDES (ropa, cuerpo, piel, excitación, el cebo) / NO PUEDES (describir el acto, decir paso a paso, palabras crudas) |
| 9 ejemplos, **6 de la misma forma** → por eso repetía | Repartidos entre las **5 formas** (A: tú le haces · B: te lo hace · C: los dos · D: al azar o regla · E: cebo) |
| Nada decía de días | *"Hay retos de una sola noche que dan 1 punto, y retos que se repiten cada día y dan más"*, **con ejemplo en el bloque**: `"puntos":1,"dias":1` |
| Todo en femenino, contra su propia regla de no suponer el género | **"tu pareja"** en los ejemplos. Los dos "ella" que quedan están en la regla que lo prohíbe, y es lo correcto |

**Ojo, dos cosas que se supieron en el camino:**

- **"Hotel de paso" NO es pagar por compañía.** Es un hotel por hora para que
  la pareja tenga privacidad. Fredy loquitó porque **era justo el ejemplo que más
  le gustaba**, y yo lo habíaiator marcado por una confusión mía. **No volver a
  plantear esa duda.**
- **No hay candado de "una vez al día" en el juego.** `marcarCumplida()` solo suma
  1 al contador, sin mirar la fecha (revisado en el código). Así que un reto de
  una sola noche **sí** se completa apretando las veces necesarias.

**Regla para cuando se toque este texto:** la instrucción y sus ejemplos se
validan **contra sí mismos**. Si la instrucción dice cinco formas y los ejemplos
muestran una, gana el ejemplo y el modelo repite. Siempre van juntos.


### El reto se tenía que VER antes de mandarlo (oct-2026)

**Lo que pasó:** el reto de la IA venía dentro de un bloque de texto técnico que
`textoLimpio()` **borra del mensaje**. Lo único que se veía era el preámbulo
coquetito, y el botón decía "Crear este reto". **O sea: se apachaba sin saber
qué se mandaba.**

Con el botón nuevo ("Mandárselo a tu pareja") pasó a ser peor: **le mandabas a tu
pareja algo que ni tú habías leído**. Si|resultaba decir algo que no querías, ya
se había ido.

**El arreglo, dos partes:**

1. **La ficha del reto se pinta antes del botón** (`.fichaReto`): el reto, el
   castigo y la recompensa, con el mismo estilo de la app. Todo con
   `textContent`, nunca `innerHTML`: el texto lo escribe la IA y no se le da
   permiso de meter HTML.

2. **En el texto de la IA:** primero va el reto escrito en normal, y el bloque
   al final. Con instrucción explícita de que si el bloque es lo único que dice
   qué es el reto, quien lo manda no llega a leerlo.

**También:** los dos retos que|gf|reportó Fredy no eran retos, eran coqueteo
suelto (*"ese nerviosismo bien canalizado es la mejor previa"* no dice quién hace
qué). Se agregó a la instrucción que un reto es una **instrucción concreta de lo
que hay que hacer**, y se puso ese ejemplo como ejemplo de lo que **no** es.

**Ojo,Near miss evitado:** al pintar la ficha se usó `esc()`, que **no existe en
`Acompanante/`** (sí existe en `Retos/`). Habría sido pantalla en blanco. Se
detectó revisando antes de correr. Regla: en `Acompanante/` **todo va con
`textContent`**, porque no hay función de escape ahí.


### El reto de la IA: se ve qué hacer, sale el botón y dice quién lo mandó (oct-2026)

**Tres arreglos alrededor de los retos de la IA.** Pedido de Fredy.

**1. En `Retos/` no se sabía qué hacer.** La tarjeta solo guardaba el
`actividad`, que la IA escribe como **título corto**; la instrucción completa
(*"muéstrale todo tu cuerpo…"*) se quedaba nada más en el chat y nunca se
guardaba en el reto. Ahora `crearReto()` (en `Acompanante/`) guarda también
**`descripcion`** = el texto del reto tal cual se generó, y la tarjeta lo muestra
**abajo del título**. Se muestra **solo si `ia: true` y hay `descripcion`**: los
retos manuales y los viejos no traen el campo y no cambian en nada.

**2. A veces no salía el botón "Mandárselo a tu pareja".** El botón dependía de
que la IA terminara con el bloque exacto ` ```reto {...}```. Cuando lo escribía
de otra forma, o no lo escribía, el reto se perdía (el bloque, si venía mal, se
borraba del texto y no quedaba botón). **Es la IA desobedeciendo el formato, no
el chat.** Se arregló en dos niveles:
- **Tolerancia** (`bloqueRetoBruto` + `parsearJson`): acepta ` ```reto`, ` ```json`,
  sin las tres comillas, comillas curvas, comas sobrantes y saltos de línea
  reales dentro del texto.
- **Reserva** (`retoDeReserva`): si de plano no hubo bloque pero **lo que se
  pidió era un reto** (el botón, o la palabra "reto" en lo que se escribió), el
  chat **arma el reto solo** con el texto como descripción y valores de reserva
  (valor 5, castigo y recompensa de fábrica). El único hueco que queda es pedir
  un reto **sin usar la palabra "reto"** (p. ej. "sorpréndeme"): ahí no hay
  reserva. **No se toca la instrucción de la IA ni los retos ya guardados.**

**3. Decía que lo había mandado la pareja.** En un reto de la IA quien lo manda
no es la pareja, es la IA. Ahora la tarjeta dice **"[nombre de la IA] IA le mandó
el reto para [X]"** (`iaNombre`, que **ya se guardaba** con el reto; no se agregó
nada a la base). Los retos manuales siguen diciendo "[pareja] propuso para [X]".

**Verificado:** sintaxis (`herramientas/sintaxis/`) en los dos archivos. **Falta
la prueba en vivo** (Fredy, en Pages), por ser cambio de datos del reto.


### Cerrado (oct-2026): la IA ya no suelta retos sola, y castigo/recompensa bien escritos

**1. Por qué ofrecía retos sin que se los pidieran.** El texto se contradecía
solo, y **ganaba la versión equivocada**:

| | |
|---|---|
| **Arriba:** *"Tu misión: conversar… **y proponer RETOS picarones**"* | le decía que es parte de su trabajo |
| **Abajo:** *"JAMÁS ofrezcas retos por tu cuenta"* | le decía que nunca lo haga |

Los modelos **leen más fuerte lo que está al principio**, y "tu misión" suena a
instrucción principal. Entonces ganaba la de arriba: por eso soltaba retos
(aclarado). **El arreglo:** la regla de "nunca ofrezcas" **subió ARRIBA del todo**,
justo antes de la misión, y la misión cambió a *"los retos picarones son una
habilidad tuya… pero solo la usas si te los piden"*. Así la capacidad se queda,
pero la contradicción desaparece.

**Ojo: NO se quitó de la misión.** Si se quitara entera, ella leería "tu misión
es conversar" y más abajo tiene **diez párrafos** de manual de retos: podría
darlos más planos justo cuando sí los piden. Con la condición se corrige la
conducta sin apagarle la habilidad.

**2. El castigo y la recompensa mal redactados.** Salían **tal cual los escribía la IA**, y a
veces mezclaban **quién manda el reto con quién lo tiene que cumplir**. El
ejemplo que reportó Fredy: *"Si se le olvida o lo ignora, te debe el capricho
más pesado que se le ocurra pedirte mañana"* — inventa una deuda y además da a
entender que el que "debe" es el otro.

**El arreglo (en el texto, no en el código):** castigo y recompensa se escriben
**siempre desde el mismo punto de vista**, el de quien tiene que cumplir, y
prohibido el "te debe / le debes / me debe". Además tienen que ir **del mismo
tono del reto**.

**Ojo, esto solo cambiaba el texto que manda la IA.** Los retos **ya guardados**
en la base conservan el castigo malo que les tocó; no se reescriben solas.



---

## Lo que salio mal la primera vez con el Centro de Adquisiciones (oct-2026)

La primera version **funcionaba pero se veia mal**, y hubo que senalarlo. Va aqui porque es relato, no regla vigente. Lo que quedo de eso son cuatro reglas, y esas estan en `AGENTS.md` y en el propio `Centro-Adquisiciones.md`:

### Lo que salió mal la primera vez (y la regla que dejó)

La primera versión del Centro **funcionaba pero se veía mal**, y Fredy tuvo que
señalarlo. Cuatro cosas, todas por no haber copiado el estándar de una pantalla
que ya existe:

| Fallo | Por qué | Regla |
|---|---|---|
| Las vistas de deseos y pedidos se veían **de lado a lado**, y el catálogo centrado | Solo `#contenido` tenía ancho; `#contenidoDeseos` y `#contenidoPedidos` no existían en el CSS | **Todas las vistas de una pantalla comparten el mismo contenedor** |
| El encabezado no era como los demás | Se inventó uno ("Centro de …") en vez de copiar el de `Retos/` | **Pantalla nueva = copia de una existente.** El molde vive en `AGENTS.md` |
| La tarjeta salía **arriba** de "Retos" | Sin `orden`, todo cae en `10` y el listado se ordena alfabéticamente: "Centro…" < "Retos" | **Cada tarjeta fija lleva `orden` explícito y único** |
| "Volver" mandaba a la pantalla de Retos | Se puso `index.html` a ojo | **Preguntarse "¿de dónde salí?" y volver ahí** (aquí: al submenú, `#retos`) |

**La regla general está en `AGENTS.md`, sección "Pantalla nueva = COPIAR una
existente (regla dura)".** Ahí están **los dos moldes** (el de `Guiadas/` para
pantallas de varias vistas y el de `Citas/`/`Retos/` para las de una sola), con las
medidas exactas de cada uno, y los 4 chequeos que hay que correr antes de decir
"listo" (`<div>` cuadrados, sin ids repetidos, **todos los ids del JS existen**, y
`jscheck.py`).

**Lo que de verdad salió mal fue de método, no de código:** se maquetó la pantalla
sin abrir primero la que había que copiar, y se copió la equivocada. Todo el
tiempo perdido fue por no leer dos archivos que ya tenían la respuesta.
