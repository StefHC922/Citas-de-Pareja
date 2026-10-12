# GUIA - Citas de Pareja (documento maestro)

**Este es el unico documento con el detalle tecnico del proyecto.**
Vive **dentro del repo** a proposito: asi, cualquier persona o cualquier modelo
que abra `Citas-de-Pareja` lo encuentra, sin que nadie tenga que acordarse.

Ademas el repo tiene `AGENTS.md`, que le ordena a cualquier modelo leer este
archivo antes de tocar nada. Ese es el mecanismo que evita rehacer trabajo.

## Nota (oct-2026): se retiró el arnés de pruebas

El arnés de pruebas con Chrome y sus scripts **se eliminaron** del repo: eran
lentos y poco fiables (Chrome sin ventana devolvía volcados vacíos). Lo que queda
es el **chequeo de sintaxis** en `herramientas/sintaxis/` (`extract.py` +
`jscheck.py`) y la **prueba en vivo** (Pages y el celular de Fredy).

Las menciones a "arnés", `Temp\opencode`, `undef.py`, `expcheck.py`,
`argcheck.py`, `dupcheck.py`, `build_*.py`, `inject_*.py`, `final.py`,
`run_*.py`, `instalador/` y demás que aparezcan más abajo son **registro
histórico** de cómo se verificó en su momento: **esos archivos ya no existen** y
no deben buscarse ni correrse. El único chequeo que queda es el de sintaxis.

## Como se usa

| Si quieres... | Lee |
|---|---|
| Como funciona el modo invitado, la sala o el juego | Parte 1 |
| El detalle fino con numeros de linea, el "por que" y la lista de pruebas | Parte 2 |
| Licencias, `acceso.js`, catalogo, el limite de 30 | Parte 3 |
| `Autorizar/` y las reglas de Firebase | Parte 4 |
| Decisiones ya tomadas (no sobrescribir sin preguntar) | Parte 5 |
| Pendientes, limites conocidos y notas de mantenimiento | Parte 6 |
| Como esta guardada la base, que esta mal y como normalizarla | **`Modelo-Datos.md`** |

## Regla de escritura (evita copias y doble escritura)

- **Detalle de codigo** de este proyecto -> **solo aqui** (`General/GUIA.md`).
- **Acuerdos de trabajo y panorama de proyectos** ->
  `Documents\Default Project\General\GUIA-PROYECTOS.md`.
- Si algo aplica a los dos, en `GUIA-PROYECTOS.md` va **una linea que apunta
  aqui**, nunca una copia. Ese fue el origen de la duplicacion que se limpio
  el oct-2026.

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

Todo lo demas de la Parte 1 esta **cerrado, verificado y probado por Fredy**.

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

## Parte 3 - Licencias, `acceso.js` y catalogo (oct-2026)

> Origen: `Modulo-Accesos.md` (04/10/2026), conservado literal. El modulo
> `acceso.js` centraliza la logica de licencias que antes estaba copiada en 4
> paginas. **Nada de esto existia en la Parte 1.**


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
al día **por proyecto**. El detalle está en `General/Escala-Millones.md`.

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

## Parte 4 - `Autorizar/` y reglas de Firebase (oct-2026) - **revisado y cerrado**

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
> clientes siguen siendo legibles. Ver Parte 3, seccion 6.


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
porque `Autorizar/` no tiene forma de identificarse. Al cerrar las reglas se
le pidió ser publicador a una pantalla que nunca inicia sesión.

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

- Las reglas están **temporalmente regresadas** a `solicitudes: if true`
  (el agujero está abierto otra vez: cualquiera puede leer los correos y
  echar usuarios).
- `Autorizar/` ya tiene el inicio de sesión, pero **no se ha subido todavía**.

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

## Parte 5 - Decisiones (no sobrescribir sin preguntar)

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

## Parte 6 - Pendientes, limites y mantenimiento

> oct-2026: el estado de la base de datos (que colecciones hay, que campos, que
> esta duplicado, que esta mal y cual es el plan para normalizarlo) esta en
> **`General/Modelo-Datos.md`**. Es una **propuesta, no un cambio aplicado.**
> Ahi tambien estan 3 fallas verificadas con numero de linea que conviene mirar
> antes de tocar Retos o el modo invitado.

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
L326 y L347). Hoy no rompe nada porque ningún JavaScript lo usa —solo el CSS—,
pero es una bomba de tiempo. Se arregla aparte.

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

### Centro de Adquisiciones Personal (nuevo, oct-2026)

Cada persona tiene un **Centro de Adquisiciones**: su lista secreta de deseos y la
tienda donde su pareja puede "comprar" lo que esa persona quiere que cumpla. Se
entra desde el **submenú Retos** del menú principal, como una tarjeta más ahí
junto a "Retos": **"Centro de Adquisiciones de [nombre]"** (el nombre de quien
**no** eres tú).

**Ojo dónde vive:** la tarjeta está en el **submenú `Retos`** de `index.html`, que
se arma desde la lista `packs` fija (como Retos y Diablitos), **no** dentro de la
pantalla `Retos/index.html`. Se puso primero en la pantalla de Retos y ahí no se ve
bien (decisión de Fredy, oct-2026): lo natural es entrar al submenú y elegir.

**El nombre de la pareja es dinámico:** se arma con `nombreParejaMenu()` (usa la
copia local de usuarios y solo cae a Firestore si está vacía). Si no hay pareja
registrada, la tarjeta **no se muestra** (el Centro es de dos).

**Cómo funciona (tú = el que paga en los dos pasos):**

1. Anotas un deseo en tu lista secreta (nombre + descripción).
2. Pulsas **Activar**: se te descuentan **500** pts y el deseo aparece en la tienda
   de tu pareja. Los 500 se cobran **una sola vez**; el deseo se queda en tu lista
   marcado "En venta".
3. En la tienda de tu pareja lo **compras** por el **precio** (**100** pts), las
   veces que quieras. Cada compra es **un pedido que tu pareja tiene que entregar**.
4. Cuando te lo da, **tú** (el que compró) marcas **"Entregado"**.

Los dos pagos los hace **la misma persona**, con **sus** puntos: cada quien gasta
solo de su saldo. Los puntos son los mismos de `puntosUsuarios` que dan los retos.

**Decisiones (no sobrescribir sin preguntar):**

| Decisión | Detalle |
|---|---|
| Precio **por usuario**, no por deseo | Los 100 son **un número tuyo** para todos tus deseos. Si cambias el número, se le cambia a todos, ya vendidos incluidos |
| Botón bloqueado sin saldo | No se compra "a debt": si no llegas al precio, el botón ni aparece. En retos sí se puede quedar negativo |
| Borrar un deseo | Sí se puede desde ahorita, y **no devuelve** los 500 |
| Desactivar un deseo | **No contemplado.** Queda pendiente decidir |
| Al entregar no hay puntos | Quien entrega no gana nada: el pago ya fue al comprar |
| Quién marca "Entregado" | **El que compró** (el cliente), no quien entrega |
| Aviso | La compra avisa por **Telegram**, como los retos |
| Colecciones | `deseos` (los deseos) y `comprasDeseos` (las compras) |

**Archivos:**

| Archivo | Qué lleva |
|---|---|
| **`Retos/centro.html`** | **(nuevo)** La pantalla completa: 3 vistas, lectura en vivo, activar/comprar/borrar/entregar, navegación |
| `index.html` | La tarjeta del Centro en el **submenú Retos** (lista `packs` fija, id `centro`, `seccion:"retos"`, `libre:true`, y en `FIJOS`) + `nombreParejaMenu()` + el ajuste de `tarjetaPack()` para rutas con `.html` |
| `index.html` | El botón **🛒** por usuario en Usuarios y el overlay de los 2 números (`ptsActivar`, `precioCompra`) |
| `herramientas/sintaxis/extract.py` | Se registró `Retos/centro.html` para que pase la revisión |

**Encabezado y estructura: el molde es `Guiadas/` (NO `Citas/`).** Hay dos moldes
en la app y se confundieron (oct-2026):

| Molde | Cuándo | Cómo se ve |
|---|---|---|
| **`Guiadas/` y `Encuentros/`** | **Pantallas con varias vistas (este caso)** | `.vista` con clase `.ver`, `.back` arriba a la derecha, `.eyebrow`, `h1` con degradado, `p.desc` |
| `Citas/`, `Retos/`, `Opciones/` | Pantallas de **una sola** vista | `#app` + `#encabezado` (saludo + fecha) + `#contenido` (`max-width:560px`) |

**El estilo de LAS LISTAS es el del engrane de `Opciones/` (Juegos → Elecciones
Peligrosas → ⚙️).** Se copiaron sus clases tal cual:

| Clase | Qué es |
|---|---|
| `.tabs` / `.tab` / `.tab.activo` | Las pestañas: dos botones en la misma línea, el activo con el degradado |
| `.tablaBox` | **El recuadro que delimita la lista**: `max-height:48dvh; overflow-y:auto; border-radius:12px; background:var(--bg-2)` |
| `.fila` + `.celda` + `.x` | Cada renglón: la pastilla con el texto a la izquierda y la ✕ (roja) a la derecha |
| `.filaAdd` | La fila de agregar: input + botón **+** |
| `.tag` | El chipito de estado ("Secreto", "En venta", "Pendiente", "Entregado") |

**Cómo quedó el Centro (3 vistas, las tres con el mismo esqueleto):**

```
h1  +  p.desc
[ recuadro .tablaBox con los datos ]      ← SIEMPRE dibujado, con altura fija
[ .filaAdd (solo en deseos)  o  .btnPri ]
[ .tabs con las otras dos vistas ]       ← abajo del recuadro, misma línea
```

- **Tienda:** los deseos que activaste, cada uno con su botón **Comprar**.
- **Mis deseos:** tus deseos, cada uno con su **✕** que abre el detalle (editar,
  activar y borrar). Abajo la fila `.filaAdd` para **anotar un deseo**.
- **Mis pedidos:** pestañas **"Los que yo compré"** / **"Los que me compraron"**,
  cada lista en su propio recuadro. En la de los que compraste, el botón es un ✓
  verde para **marcar entregado**.

**El recuadro NUNCA se oculta y tiene altura FIJA** (`height:48dvh`, no solo
`max-height`), y el texto de "vacío" va **centrado DENTRO** de él, no debajo. Esto
es por pedido de Fredy (oct-2026): así **los botones de abajo quedan siempre en el
mismo lugar** y no se mueven cada vez que añades o borras algo.

Se hace con dos clases: `.tablaBox.vacia` (centra el texto) y una función
`pintaCaja(idCaja, nodoVacio, filas)` que mete los renglones o, si no hay, el texto
de vacío. **Cada recuadro lleva su propio texto de vacío adentro**, así que en
"Mis pedidos" nunca salen los dos textos a la vez: el de "no te han comprado" solo
aparece en su pestaña.

**Los botones de abajo caen en el MISMO lugar en las tres vistas.** Para lograrlo:
- Las vistas que **no** tienen la fila de agregar (Tienda, Mis pedidos) llevan una
  **copia invisible** de esa misma fila: `<div class="filaAdd filaHueco">` con un
  input y un botón sin id. Con `visibility:hidden` ocupa el mismo espacio exacto
  (mismo input, mismo botón) pero no se ve.
- "Mis pedidos" además tiene **una pestaña ARRIBA** que las otras no, así que a su
  recuadro se le **descuesta el alto real de esa pestaña**:
  `ajustarAlturaPedidos()` mide `tabsPedidos.offsetHeight` y pone
  `height: calc(48dvh - Npx)`. Se mide de verdad, no se estima a ojo, y se vuelve
  a medir al cambiar de tamaño de pantalla.

**Texto de las vistas:** la Tienda dice **"Catálogo"**, y Mis deseos dice **"Anota
tus deseos más secretos que quieres hacer realidad"**.

**Ojo, un bug que costó un rato (oct-2026):** los textos de vacío se agarran **una
sola vez, al arrancar**, en `VACIO_CAT`, `VACIO_DES`, `VACIO_COM` y `VACIO_REC`.
**No se pueden volver a buscar con `el()` dentro de `pintaCaja()`**: la función
borra el recuadro con `innerHTML = ""`, que se lleva el texto, y entonces
`appendChild(null)` revienta. Como `pintaCaja()` se llama desde `pintarTodo()`, el
error **cortaba el pintado entero**: el catálogo salía sin su texto y **los deseos
nunca se veían**. Menos mal que estos dos fallos eran el mismo.

**Las pestañas de abajo** se marcan solas con `marcarNav()`: la de la vista
actual queda `.activo`. Por eso hay dos juegos de botones (`navDeseos`/`navDeseos2`,
etc.), porque cada vista lleva el suyo debajo de su recuadro.

**"Volver" es contextual**, como en `Guiadas/`: del detalle → a Mis deseos; de las
dos vistas → a la Tienda; **solo desde la Tienda se sale al submenú Retos**
(`../index.html#retos`). Con `pushState` + `popstate` para el botón atrás.

**Antes de escribir una pantalla hay que abrir la que se va a copiar.** La regla
completa está en `AGENTS.md`, sección "Pantalla nueva = COPIAR una existente".

**Orden de la tarjeta:** el "Centro" lleva `orden: 20` (Retos lleva `10`), porque el
listado se ordena por `orden` y luego alfabéticamente: sin eso, "Centro..." caía
**antes** que "Retos".

**"Volver" del catálogo** va a `../index.html#retos` (el **submenú** Retos del
menú), no a la pantalla de Retos: el Centro cuelga de ese submenú, así que se
regresa al submenú. En las otras dos vistas solo vuelve al catálogo.

**Un detalle de `tarjetaPack()`:** armaba `href = ruta + "/"`, que sirve para las
carpetas ("Retos" → "Retos/") pero rompía con un archivo suelto
("Retos/centro.html/" no existe). Ahora, si la ruta ya trae `.html`, se usa tal cual.

**Las vistas** (un solo archivo, no páginas separadas): **Tienda** (recuadro con
scroll, más recientes primero) · **Mis deseos** · **Mis pedidos** (dos pestañas).

**Nota de método:** esta pantalla recibió el **tercer** intento de diseño, y las
dos primeras fallaron por no copiar la pantalla correcta. Lo que al final funcionó
fue mirar el **engrane de `Opciones/`**, que es donde están las pestañas y el
recuadro delimitador. **Ese es el estilo de las listas en esta app.**

**Los dos números** (`ptsActivar` = 500 y `precioCompra` = 100) se editan por
usuario en la pantalla **Usuarios** (el ⚙️ del inicio), botón 🛒. Si no hay número
guardado, el Centro usa 500 y 100.

**Se quitó el tachón de eliminar usuario** de esa misma pantalla (decisión de Fredy,
oct-2026): borrar a alguien dejaba datos colgados en varias colecciones y rompía la
app. De paso el tachón solo salía en las filas de los **demás**, así que las filas
quedaban de distinto tamaño y los iconos de la derecha no alineaban. Ahora **todas**
las filas traen nombre + carrito y quedan iguales. El 🛒 fue en vez de un 🎁 porque
el regalo se leía como "un regalito" y el carrito da más pista de que ahí está la
tienda.

**Ojo, si algún día hay que quitar a alguien:** ya **no** se puede desde Usuarios.
Habría que hacerlo editando `config/ajustes` en la consola, y **revisar antes** sus
deseos, compras y retos, porque quedan huérfanos.

**Dos cosas honestas:**

1. **La lista NO es secreta de verdad.** El ✅ se aplicó: solo el dueño la ve en la
   interfaz. Pero la base de la pareja tiene las reglas abiertas a propósito (ver
   más abajo "La base de cada PAREJA"), así que técnicamente alguien con la
   configuración de la base podría leerla. Secreto real llega con el **rediseño con
   login**, que va después.
2. **El precio sale de tu configuración, no del deseo.** Por eso, si un día quieres
   que un deseo viejo conserve su precio, hay que guardarlo dentro del deseo.

**Los puntos se descuentan con `runTransaction`**, que relee el saldo dentro de la
transacción: dos celulares apretando "Comprar" al mismo tiempo no pueden gastar dos
veces lo que no hay (el bug B3 de `Modelo-Datos.md`, pero aquí sí prevenido).
**Verificado:** sintaxis OK en los 3 archivos; `<div>` cuadrados (33/33), sin ids
repetidos y sin ids de JS inexistentes en `centro.html`. **Falta la prueba en
vivo** (Fredy, en Pages y con los dos celulares).

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

### Una cita no se agenda en el pasado (oct-2026)

En `Citas/`, al agendar solo se comprobaba que el campo de fecha **no estuviera
vacío**: una cita del martes pasado se guardaba sin que nadie dijera nada.

**Son dos cosas, y hacen falta las dos:**

1. **`fCampoFecha` lleva `min`.** Como es `type="datetime-local"`, el `min` va en ese mismo formato (`"AAAA-MM-DDTHH:MM"`) y en **hora local**, no en UTC. Por eso se calcula restando el desfase:

   ```js
   const d = new Date();
   d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
   fCampoFecha.min = d.toISOString().slice(0,16);
   ```

   Con eso el calendario del celular **pinta en gris** lo que ya pasó. Ojo: si
   se hiciera con `toISOString()` a secas, saldría corrido (en Ciudad de México
   saldría 6 horas adelantado) y el `min` dejaría de tener sentido.

2. **`esEnPasado()` en `btnGuardarCita.onclick`**, que es la que de verdad
   impide guardar. Si la fecha no se entiende (`NaN`) **no bloquea**: que no
   deje agendar nada por un problema de formato es peor que dejar pasar una
   fecha rara.

**Al MODIFICAR una cita NO se bloquea, y el `min` se quita.** Una cita vieja puede
estar en el pasado a propósito (un recuerdo, una cita ya vivida) y hay que poder
corregirle una palabra sin que el campo la rechace. Si algún día se quiere
apretar esa regla también al modificar, es una línea: quitar el `!editandoId &&`.

**Nota de formato:** el valor del campo llega como `"AAAA-MM-DDTHH:MM"`, sin zona.
`new Date()` lo interpreta como **hora local**, que es justo lo que hay que
comparar contra `Date.now()`. El mismo parseo ya lo usa `formatearFecha()`, así
que no se inventó nada.

### Los retos que propone la IA de Acompanante (oct-2026)

**La pareja le pide un reto a la IA, lo acepta, y este se crea en la colección
`retos`. Antes salía a medias, con tres problemas:**

**1. El reto nunca avanzaba.** Los retos de la IA se guardan con
`asignadoPor: { id: "ai" }`, y en `Retos/` el botón **"Cumplida +1"** solo le
sale a `soyProponente` (es decir, a quien lo propuso). Como `"ai"` no es el id de
nadie, **no le salía a ninguno de los dos**: el reto se veía con todos sus datos
y nunca podía avanzar. **Ahora lo marca el OTRO**: si el reto es de Fulano, lo
marca su pareja, y al revés (decisión de Fredy, oct-2026).

```js
const esDeLaIA = !!(c.asignadoPor && c.asignadoPor.id === "ai");
if(soyProponente || (esDeLaIA && !soyAsignado)){ ... }
```

**Ojo: los retos viejos que ya hizo la IA siguen sin botón.** No se les puso el
`id` a nadie y no se van a editar a mano. Si hace falta que esos también sirvan,
habría que corregirles el documento en la consola.

**2. Se guardaban sin `fechaInicio`.** Es el campo que usa `diasRestantes()` para
calcular el "tiempo restante", así que esos retos se quedaban **sin ese renglón**.
Por eso `crearReto()` ahora lo guarda.

**3. Usaban la fecha de vencimiento vieja** (`Date.now() + días × 86400000`), o
sea a la hora en que le diste "aceptar". Ahora usan `finDeUltimoDia()`, igual que
los retos propuestos a mano. **Esa función se movió a `config.js`** porque ahora la
necesitan los dos lados; no debe copiarse en cada archivo.

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

### ⏳ PENDIENTE DE DEFINIR — los retos de la IA (pedido por Fredy oct-2026)

> **ESTO NO ESTÁ ACABADO. Antes de seguir metiendo mano a los retos de la IA,
> hay que decidir estos tres puntos.** Fredy lo pidió expressly que se le
> Masteringara.

1. **El botón "Reto picarón"** — ¿queda y dice "mándale un reto a [nombre]"?
   ¿Se quita de los dos lados? (Lo acordado hasta ahora: **que el reto sea del
   que NO está en el chat**, para que no pueda rechazarlo.)
2. **¿Cómo se entera la pareja?** Si no tiene la app abierta, el reto no le
   llega. Hoy las notificaciones solo salen con `Retos/` abierto. **¿Tiene que
   llegar aunque esté fuera de la app?**
3. **Si el que está en el chat puede apretarlo de una vez** — o sea, si la
   pareja pide el reto a la IA y el reto le toca a ti que ya estás en el chat,
   ¿se cuenta al instante o también tiene que esperar?

**Por qué quedó así:** el reto que escoge uno mismo no es un reto, es un menú
(Fredy: *"eso le quita todo el significado a reto"*). Por eso el dueño del reto
tiene que ser **el que no está en el chat**.

### Retos de la IA: mecánica nueva (oct-2026)

**El problema que la motivó:** un reto que escoge uno mismo no es un reto, es un
menú (Fredy: *"eso le quita todo el significado a reto"*). Y como la persona
podía pedirlo, leerlo y **Descartarlo**, el botón de descartar se convirtió en un
menú con "siguiente".

**La regla nueva, y de ahí sale todo lo demás:**

> **El reto es del que NO está en el chat.** Quien lo pide se lo manda a su
> pareja, y como esa persona no está ahí, **no puede rechazarlo**. Se acabaron
> "48 horas para<'_descartar". Esto solo aplica a los retos de la IA.

| | Quién |
|---|---|
| **Cumple el reto** | El que **no** está en el chat (no lo escogió) |
| **Aprieta "Cumplida"** | El que **sí** está en el chat (lo mandó y lo vio pasar) |
| **Se lleva los puntos** | El que lo cumplió |

**Los puntos ya no cuentan veces: son el VALOR del reto** (qué tan atrevido es,
1 a 10. Antes `puntosMeta` hacía dos trabajos: contar los "Cumplida +1" y
decir cuánto se descuenta. Ahora en los de la IA solo es el valor.

**Cómo se distinguen en el código:** por el campo **`ia: true`** que pone
`crearReto()`. Los retos viejos (que no lo tienen) siguen con la mecánica de
siempre, sin tocar nada. Ojo: **los retos de la IA que ya estaban en la base se
quedaron a medias** — tienen `asignadoPor.id = "ai"` y `puntosMeta` como contador,
y no son ni una cosa ni la otra. No se corrigen solos; si los quieren, hay
que editarlos en la consola o borrarlos.

**El camino feliz:** el botón dice **"Cumplida (N pts)"** (no "+1") y al
apretarlo el dueño recibe **los N puntos de una vez**, el reto pasa a "Terminado"
y se apaga el botón. La recompensa se cobra aparte, igual que hoy.

**El camino mal:**

| | |
|---|---|
| Se vencieron las 48 horas | El dueño **pierde la mitad, redondeada hacia abajo** |
| | El otro **gana la diferencia** |

Ejemplo con un reto de **7**: pierde **3**, el otro gana **7 − 3 = 4**. Con un
reto de 8: pierden 4 y gana 4. El redondeo es `Math.floor(valor/2)`: si la
mitad da `.5` baja, si da más de `.5` sube (decisión de Fredy, oct-2026).

**Las 48 horas** son exactas desde que se crea (`ahora + 48×3600000`): 24 para
cumplirlo y 24 para marcarlo. El botón **no se apaga antes**: se apaga al
cumplirse las 48, cuando se liquida. Los retos normales **no** usan esto, siguen
con su duración de días.

**El castigo también lo aprieta el otro.** Antes el botón "Aplicar castigo"
solo le salía a quien propuso el reto, y como los de la IA los proponía "ai"
(no es nadie), **no se lo mostraba a nadie**. Como ahora `asignadoPor` es la
persona que lo mandó, le sale solo a ella. Ya quedó bien sin tocarlo.

**Y la tarjeta cambia:** los de la IA **no muestran barra de progreso** (no hay
contador), dicen *"Vale N pts para Fulano"*, y en vez de "Veces al día" y
"Duración" muestran "Valor" y el plazo de 48 horas.

**En el texto de la IA:** los puntos se reparten en escala
(1-3 fácil · 4-6 hay que animarse · 7-10 da pena hasta pensarlo), `"dias"` siempre
1, y se le dice que el reto es para la pareja, no para quien pregunta.

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

### ⏳ PENDIENTE (oct-2026): redacción del castigo y la recompensa de la IA

El castigo y la recompensa de un reto de la IA llegan **tal cual los escribe el
modelo**: la app no los reescribe. A veces salen **mal redactados**, cambiando de
persona y mezclando a quien manda el reto con quien lo tiene que cumplir (ejemplo
que reportó Fredy: *"Si se le olvida o lo ignora, te debe el capricho más pesado
que se le ocurra pedirte mañana."*).

**Pendiente al próximo cambio de `Acompanante/`:** ajustar la instrucción de
`PERSONA` para que el castigo y la recompensa vayan en un **solo punto de vista**
(el de quien tiene que cumplir el reto) y en un tono parejo. Ojo: el texto de la
instrucción vive en `Documents\Default Project\instruccion-IA.txt` y se mete con
`Temp\opencode\aplicar_persona.py` (ver más abajo). **No se toca ahora** (decisión
de Fredy, oct-2026).

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

### El nombre de la IA en el campo de escritura (oct-2026)

El campo del chat tenía el texto fijo *"Escríbele a Chispa..."*, aunque el nombre
se puede cambiar en la esquina superior derecha (`pareja_ai_nombre` en
`localStorage`, por omisión "Aitana"). Ahora el placeholder se arma con
`NOMBRE_AI` al arrancar. **Como guardar el nombre recarga la página, con ponerlo
una vez al inicio basta.**

### El tono de la IA (oct-2026)

El `PERSONA` de `Acompanante/` tenía prohibido el tema sexual: si se lo pedían,
"declinaba con humor y redirigía a algo pícaro-sano". Ahora el límite es otro,
mucho más alto pero igual de firme (decisión de Fredy, oct-2026):

> **NUNCA describes el sexo.** No lo nombras, no lo narras y tampoco lo insinúas
> de forma que se entienda exactamente qué va a pasar. Lo que haces es dejarle
> todo el trabajo a la imaginación: pones la escena, el lugar, la hora, la ropa,
> la luz, la tensión y el clima... y ahí te quedas. El resultado es SIEMPRE la
> invitación y nunca la escena ejecutada.

También se quitan las dos frases que tenían el tope viejo ("coqueta sana" →
"coqueta y sensual"). **El resto de las reglas NO se tocaron**: sigue sin pedir
fotos, videos ni audios, sigue sin meterse con terceros sin consentimiento, y
**sigue sin ofrecer retos por su cuenta**: solo cuando los piden directo o con
los botones.

### Pantallas de configuracion: Actividades y Accesorios (oct-2026)

Estan en `Citas/actividades.html` y `Citas/accesorios.html`, y se llega por el
enlace **"Personaliza tus Actividades"** (abajo de la fecha) o por el ⚙️ de
Experiencias.

**Lo que se arreglo en esta ronda:**

- **Boton "Agregar" apagado** hasta que haya texto y no este repetido. Antes
  estaba siempre encendido y avisaba despues de tocar.
- **Cambiar el nombre de una actividad** (dentro del editor), que antes no
  existia.
- **Eliminar una actividad**, con confirmacion que pide **escribir el nombre** y
  avisa que se borra todo para siempre.
- **El editor ya no se encima**: reemplaza la lista en su lugar. Antes era una
  capa flotante translucida y se veia la lista detras.
- **Accesorios**: confirmacion al borrar, y **tocar uno pone su nombre en el
  campo** para que aparezca el boton de Eliminar.
- **Texto mas grande** en las dos (1.02rem, como la lista de Guiadas).

**Se quito el boton "Eliminar Accesorios"** que estaba en medio de Guardar y
Cerrar. Era una trampa: escribia encima de los accesorios ya guardados y no se
podia deshacer. Ahora, para dar de alta o modificar un accesorio se usa el boton
**"Administrar accesorios"**, que esta en el mismo editor (debajo de la lista de
accesorios de la actividad).

**Ese botón va y vuelve sin perder el hilo:** `actividades.html` guarda en
`sessionStorage` la clave `citasIrAccesorios` con `{ n: actividad, t: hora }` y
salta a `accesorios.html`; alla aparece arriba el enlace **"‹ Volver a la
actividad «X»"**. Al regresar, `actividades.html` borra la nota y reabre el
**mismo editor** con los accesorios frescos (por si se agregaron nuevos). La nota
se descarta si pasaron mas de 6 horas, para que no salga en una visita normal.
Antes de irse se guarda **solo lo que haya cambiado** (`hayCambiosSinGuardar()`),
así que no se pierde nada marcado ni se "personaliza" una actividad que no se toco.

**La pestaña "Actividades" se apaga con el editor abierto.** Antes se podia
oprimir y la lista de actividades aparecia ARRIBA con el editor de accesorios
PEGADO ABAJO, y se podia guardar sobre la actividad equivocada. Ahora
`abrirEditor()` hace `tabLista.disabled = true` y `cerrarEditor()` lo vuelve a
  encender; ademas `tabLista.onclick` tiene un guardia por si se dispara igual.
  La pestaña "Accesorios" de arriba, con el editor abierto, pasa por
  `irAAccesorios()` (guarda lo marcado y deja la nota de regreso) en vez de irse
  sin guardar.

  **OJO con ese guardia (bug oct-2026, ya corregido):** preguntaba
  `editorWrap.style.display !== "none"`. Al abrir la pagina ese **estilo de linea
  esta vacio** (el `display:none` lo pone el CSS), asi que `"" !== "none"` daba
  verdadero y el guardia cortaba **desde el arranque**: la lista de actividades
  NUNCA se mostraba (se daban de alta y se validaban, pero no se veian).
  Ahora hay una bandera de verdad, `editorAbierto`, que ponen `abrirEditor()` y
  `cerrarEditor()`. **Regla: nunca preguntar por `element.style.algo` cuando el
  valor real lo pone una hoja de estilos; usar una variable o `getComputedStyle`.**


**LO IMPORTANTE: el nombre de una actividad es la llave de casi todo.** Al
**renombrar**, hay que mover las cinco cosas juntas o quedan huerfanas:

| Que | Donde |
|---|---|
| La actividad | `actividadesExtra` (campo `nombre`) |
| Sus accesorios | `presetsActividad/{nombre}` |
| Sus acciones de Guiadas | `nivelesActividad/{nombre}` |
| Sus tomas | `guia_tomas_{nombre}` (localStorage, de ese telefono) |
| **Las citas ya agendadas** | coleccion `citas`, campo `actividad` |

La ultima es la que se escapa facil: si no se actualiza, esas citas quedan
apuntando a un nombre que ya no existe, y **al editarlas se cambiarian solas**.

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
hoy no esta en las reglas. Ver Parte 3, seccion 6.

### Pendientes de licencias (Parte 3, "Siguiente paso")

1. ~~Revisar las reglas de Firebase~~ **[HECHO oct-2026: revisadas y cerradas.**
   Ver `General/reglas-firebase-taquilla.txt`. Falta solo el permiso de `borrar`
   para el rediseño de la cola.]
2. Revocacion al entrar en cada pagina (cierra el acceso por URL directo).
3. Catalogo marcando lo que ya tienes desde local.
4. Cola con acuse (aprobaciones) + revocaciones persistentes.
5. Doc por item + cortesia a local.

### Otros pendientes

- Rotar la llave expuesta en `Default Project\General\README.md` y sacarla de ahi.
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
| Escaneo y se salio | Se pierde el QR y hay que escanear de nuevo |
| Varios juegos con invitacion a la vez | La sala muestra el primero. Falta decidir el orden |
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
### Documentos que se archivaron (contenido volcado aqui)

Los documentos de abajo se movieron a
`Default Project\General\archivo\` el oct-2026. **Todo su contenido esta en
las Partes 1 a 4 de este archivo**, sin recortes.

- `Fase-1.md` -> Parte 1
- `Encuentros-y-Modo-Invitado.md` -> Parte 2
- `Modulo-Accesos.md` -> Partes 3 y 4
