# Modelo de datos — propuesta de normalizacion

> oct-2026 · repo `Documents\GitHub\Citas-de-Pareja`
> **Esto es una PROPUESTA, no un cambio aplicado.** Ningun archivo de codigo fue
> tocado. Fredy decide que fases se hacen.

---

## 0. Alcance: que se pudo leer y que no

**No se pudo entrar a la consola de Firebase.** El unico servidor MCP de este
entorno es el de dispositivos Tuya; no hay cliente de Firebase disponible. Asi
que **el proyecto `pareja-test` no se pudo abrir directamente** y este documento
NO describe lo que hay guardado ahora mismo en esa base.

Lo que si se hizo: **recorrer las 48 fuentes del repo y extraer, literalmente,
cada `doc()`, `collection()`, lectura y escritura.** Eso da el esquema que la app
*usa*, que es lo relevante: si un campo no aparece en el codigo, nadie lo
consulta.

**Lo que falta para cerrar el analisis:** confirmar en la consola que el esquema
de `pareja-test` coincide con el del codigo (sobre todo documentos viejos de
sesiones anteriores y datos de prueba). Eso es manual, lo hace Fredy.

**Aviso de seguridad:** `firebase-config.js` tiene los valores de ejemplo
(`TU_PROYECTO`). Los datos reales de cada pareja viajan en `localStorage`. Quien
tiene la config puede leer y escribir la base entera. Es a proposito y esta
documentado en `AGENTS.md`; no se toca aqui.

---

## 1. Inventario actual (lo que hay)

**Dos bases:** la de la pareja (todo lo de abajo) y la de la taquilla
(`packs`, `solicitudes`).

| Ruta | Forma | Campos |
|---|---|---|
| `config/ajustes` | doc | `usuarios[]`, `actualizadoEn` |
| `config/fabrica` | doc | `version`, `fecha`, `actividades[]`, `accesorios[]` |
| `config/permisos` | doc (taquilla) | `correos[]`, `actualizadoEn` |
| `actividadesExtra` | col | `nombre`, `creadoEn`, `origen` |
| `accesoriosExtra` | col | `nombre`, `creadoEn`, `origen` |
| `nivelesActividad` | col (id = nombre) | `n{[nivel]:{A[],B[]}}`, `actualizadoEn`, `titulo?`, `oficial?` |
| `presetsActividad` | col (id = nombre) | `accesorios[]`, `actualizadoEn` |
| `citas` | col | `proponenteId/Nombre`, `paraId/Nombre`, `fechaCita`(str), `actividad`, `descripcion`, `accesorios[]`(nombres), `estado`, `creadoEn`, `actualizadoEn`, `ultimaAccionPorId/Nombre` |
| `retos` | col | `actividad`, `asignadoPor{}`, `asignadoA{}`, `vecesAlDia`, `duracionDias`, `puntosMeta`, `penalizacionPuntos`, `castigo`, `recompensa`, `conteo`, `estado`, `creadoEn`, `fechaInicio?`, `fechaFin?`, `autorizadaPor?`, `ultimaAccionPor?`, `cumplidaEn?`, `liquidadoEn?`, `recompensaCobrada?`, `castigoAplicado?` |
| `chat` | col | `texto`, `autorId`, `autorNombre`, `creadoEn` |
| `presencia` | col (id = usuario) | `nombre`, `visto` |
| `puntosUsuarios` | col (id = usuario) | `balance` |
| `opcionesJuego/actual` | doc | `A[]`, `B[]`, `actualizadoEn` |
| `sesionEncuentros/actual` | doc | `activa`, `pausada`, `terminada`, `porAdmin`, `sid`, `hostUid`, `hostNombre`, `modo`, `actividades[]`, `titulo`, `cabezas[]`, `listas{}`, `largo`, `ronda`, `turno`, `orden[]`, `empezadaEn`, `actualizadaEn` |
| `sesionGuiada/actual` | doc | `activa`, `sid`, `hostUid`, `hostNombre`, `modo`, `titulo`, `actividades[]`, `lista[]`, `paso`, `terminada`, `reanudada`, `empezadaEn`, `actualizadaEn` |
| `sesionOpciones/actual` | doc | `cabezas[]`, `listas{}`, `pares{}`, `eliminadas{}`, `orden[]`, `turno`, `ronda`, `terminada`, `activa`, `pausada`, `porAdmin`, `sid`, `hostUid`, `hostNombre`, `modo`, `unCelular`, `rondas`, `ladoSolo`, `reanudada`, `empezadaEn`, `actualizadaEn` |
| `invitaciones` | col (id = juego) | `juego`, `titulo`, `icono`, `ruta`, `hostUid`, `hostNombre`, `participantes[]`, `sesion`, `activa`, `pausada`, `sid`, `actualizadaEn` |
| `packs` | col (taquilla) | `titulo`, `icono`, `desc`, `ruta`, `seccion`, `orden`, `activo`, `actualizadoEn`, `nuevoHasta`, `oficial?`, `niveles?`, `tomasSugeridas?` |
| `solicitudes` | col (taquilla) | `para`, `item`, `quien`, `email`, `estado`, `fecha`, `intentos`, `pideDesrevocar`, `codigo?`, `vence?`, `dias?`, `aprobadoEn?`, `revocadoEn?`, `graciaUsada?`, `graciaFecha?` |

**17 colecciones + 3 documentos sueltos. Tres bases de datos distintas
(Encuentros, Guiadas, Opciones) con el MISMO nombre de campo `listas` y
estructuras incompatibles.**

---

## 2. Diagnostico: los 7 problemas

### P1. El nombre de una actividad es llave en 5 sitios

`actividadesExtra` (doc), `presetsActividad` (id), `nivelesActividad` (id),
`citas.actividad`, `retos.actividad`. Renombrar obliga a mover los cinco, y
`GUIA.md` ya lo dice: *"El nombre de una actividad es la llave de casi todo"*,
con la tabla de los cinco y la advertencia de que *"la última es la que se
escapa fácil"*.

El motivo de fondo: **falta un identificador estable.** El nombre es un atributo
que el usuario cambia; se esta usando como llave primaria. Es la causa raiz de
la mayoria de los avisos que ya hay en la guia.

### P2. El nombre de un usuario esta copiado en 22 campos

En `usuarios[]`, `citas` (x4), `retos` (x4, dentro de objetos `{id,nombre}`),
`chat`, `presencia`, las 3 sesiones (`cabezas[]`, `hostNombre`),
`invitaciones`, `nivelesActividad.titulo`, `packs.titulo`.

No se nota porque **la app no tiene forma de renombrar a un usuario.** Si se
agrega, quedan 22 lugares desincronizados y el chatDiría un nombre que el chat ya
no tiene.

### P3. El saldo de puntos no tiene historial — es irreversible

`puntosUsuarios/{id}` tiene **un solo campo**: `balance`, y siempre escrito con
`increment()`. No hay de dónde vino ni a dónde fue.

Consecuencias concretas: si a alguien se le descuenta mal, **no hay forma de
saber por qué ni de auditarlo**; el arreglo es escribir un numero a mano y se
pierde el rastro; y borrar el reto que loMappings causo (`Retos:938`) **destruye
la evidencia**. Es el unico dato de la app donde un error no se puede recuperar.

### P4. Las partidas son un solo documento que crece

`sesionEncuentros/actual` guarda `cabezas[]` + `orden[]` + `listas{}` (las
acciones de cada jugador). Con 8 personas x 5 rondas x 15 acciones son ~600
objetos.

Dos consecuencias medibles:

1. **Techo duro de 1 MiB por documento** de Firestore.
2. **Amplificacion de lectura:** `onSnapshot` esta suscrito al documento
   COMPLETO (`Encuentros:702`). Cuando cambia `turno`, **baja otra vez todas las
   acciones de todos los jugadores**, a cada telefono, en cada turno.

Aclaracion importante: **la escritura de cada turno es barata** (son 4 campos:
`ronda`, `turno`, `orden`, `actualizadaEn`, en `Encuentros:802`). El costo esta
en la lectura repetida, no en la escritura. La escritura grande ocurre **una
vez**, al crear la partida.

### P5. Tres bases de datos con el mismo nombre de campo y estructuras distintas

| | `sesionGuiada` | `sesionEncuentros` | `sesionOpciones` |
|---|---|---|---|
| las acciones | `lista[]: {nivel,lado,texto}` | `listas{}: {id: [...]}` | `listas{}: {id: string[]}` |
| el turno | `paso` (indice) | `turno` + `orden[]` | `turno` + `orden[]` |
| participantes | **no tiene** | `cabezas[]` | `cabezas[]` |
| publica invitacion | **no** | si | si |

Son el mismo concepto con tres esquemas. Por eso `invitado.js` existe como
modulo aparte (bien hecho), pero `publicarInvitacion()` se sigue copiando a mano
en cada juego nuevo, y el bug del "aviso pegado" (ya documentado y corregido en
`invitado.js:193`) es consecuencia directa de que el aviso viva **separado** de
la partida y necesite un `getDoc` cruzado para validité.

### P6. Tipos mezclados y campos con tres valores

- `citas.fechaCita` es **string**; `retos.fechaFin` es **`Date` nativo**. Dos
  Representation del mismo concepto, dos funciones para leerlo.
- `solicitudes.graciaUsada` se escribe con **tres valores**: `true` (4 pantallas),
  `false` (solo siFinite) y `null` (si la licencia es infinita). La logica busca
  exactamente `=== false`. Funciona, pero es una bomba de tiempo: cualquier
  `if(d.graciaUsada)` mal escrito da el resultado opuesto.
- `retos.estado` tiene **cinco valores en dos vocabularios**: `"cobrada"` en
  `retos` significa lo mismo que `terminada` en las sesiones.
- `usuarios[].id` tiene **dos formatos**: `"u1","u2"` (secuencial) y
  `"u"+base36(fecha)` (aleatorio, el que crea el engrane).

### P7. Ya hay JOINs manuales, y por eso existen workarounds

`Citas/actividades.html:730` recorre **todas las citas buscando las de una
actividad** (`where("actividad","==",viejo)`) solo para poder renombrarla. Eso es
un JOIN hecho a mano. Y `invitado.js:196` hace un `getDoc` a la sesion desde el
aviso. Y `Opciones` resuelve los nombres de las listas "contra Quien" porque
`conQuien` es una copia que nunca se actualiza.

---

## 3. Decision de arquitectura

### Las tres opciones y por que se descartan dos

**Opcion A — Relacional puro (3FN, cero duplicacion).** Descartada.
Todo por id, el nombre se consulta una vez. Suena correcto y aqui no funciona:
para pintar la lista de citas habria que leer citas + usuarios + actividades +
accesorios. En Firestore **no hay joins**, eso son N lecturas por pantalla. Y
peor: **la app tiene que funcionar sin internet** (esta escrito en varios
sitios: `modoLocal`, `conTiempo()`, el respaldo de fabrica). Sin red no se puede
resolver ninguna referencia, asi que habria que construir un espejo local
completo — o sea, reimplementar la base de datos en `localStorage`. Es mas caro
y mas fragile que lo que hay.

**Opcion B — Snowflake puro.** Descartado como forma total.
Nombres centralizados en una tabla de dimensiones y todo apuntando por id. Es la
tecnica correcta para un atributo que casi no cambia... pero tiene el mismo
problema: sin red no se resuelve la referencia, y la app necesita **leer rapido**
y leer sin conexion. Ademas, las partidas necesitan *literalmente* los textos de
las acciones en memoria para pintar la pantalla; un modelo que obliga a
resolverlos uno por uno rompe el caso de uso principal.

**Opcion C — Nucleo normalizado + vistas de partida desechables. RECOMENDADA.**

La idea, en una frase: **normalizar todo lo que es identidad, y desnormalizar
unicamente lo que es "estado de una partida", que es temporal y se puede tirar y
reconstruir.**

Regla que gobierna el diseno:

> **La desnormalizacion en Firestore no es un defecto: es el precio de la
> velocidad de lectura y del modo sin conexion. Pero solo se paga donde compra
> algo. En todas partes es deuda.**

Donde si compra: las acciones de una partida (hay que verlas al instante, sin
red, N veces por turno). Donde no compra: el nombre de un usuario, el nombre de
una actividad, el saldo de puntos. Ahi es deuda pura.

Consecuencia practica: **`invitaciones` deja de necesitar el `getDoc` cruzado.**
Si el aviso guarda `partidaId` y la partida es un doc con su id, la sala puede
preguntarle a la partida por su id. Se va el bug del "aviso pegado" por
construccion, no por una comprobacion defensiva.

Es "relacional" en el diseno (ids y referencias, sin duplicar) y "documental"
en la materializacion (subcolecciones que traen lo necesario junto). No es una
sola de las dos: es la unica que sobrevive a Firestore + offline.

---

## 4. El modelo propuesto

### Base de la pareja

```
usuarios/{uid}
  { nombre, rol, invitadoDe|null, creadoEn, actualizadoEn, activo }
  rol: "admin" | "pareja" | "invitado"      <- reemplaza admin:bool + invitado:bool
  invitadoDe: uid|null                       <- reemplaza conQuien:string

actividades/{actId}                         actId = id automatico, estable
  { nombre, origen, creadoEn, actualizadoEn, activa }
  actividades/{actId}/accesorios/{accId}     { nombre, creadoEn }
  actividades/{actId}/acciones/{accId}       { nivel, lado, texto, creadoEn }
  actividades/{actId}/tomas/{nivelId}        { valor:number }

citas/{citaId}
  { propuestaPor:uid, para:uid, fecha:Timestamp, actividadId, descripcion,
    accesoriosIds[], estado, creadoEn, actualizadoEn, ultimaAccionPor:uid }

retos/{retoId}
  { titulo, actividadId, asignadoPor:uid, asignadoA:uid, vecesAlDia, duracionDias,
    puntosMeta, penalizacionPuntos, castigo, recompensa, estado, creadoEn, fechaFin }
  retos/{retoId}/cumplimientos/{cId}         { por:uid, cuando:Timestamp }
  retos/{retoId}/liquidaciones/{lqId}        { por:uid, delta, motivo, cuando }

puntos/{uid}                                { saldo }        <- cache, se recalcula
  puntos/{uid}/movimientos/{movId}           { delta, motivo, ref, cuando }  <- verdad

chat/{msgId}                                 { autorId, texto, creadoEn }
presencia/{uid}                              { visto }

partidas/{partidaId}
  { juego, estado, hostId, modo, unCelular, params:{...}, sid,
    empezadaEn, actualizadaEn, participantesIds[] }
  partidas/{partidaId}/turnos/{tid}          { indice, jugadorId, estado }
  partidas/{partidaId}/acciones/{aid}        { jugadorId, nivel, lado, texto, ronda }

invitaciones/{juego}                         { partidaId, participantesIds[], estado, pausada }
```

### Base de la taquilla

```
packs/{packId}                     { titulo, icono, desc, ruta, seccion, orden,
                                     activo, actualizadoEn, nuevoHasta, oficial?,
                                     niveles?, tomasSugeridas? }

solicitudes/{solId}                { clienteId, packId, estado, intentos,
                                     pideDesrevocar, fecha, ... }
clientes/{clienteId}               { email, nombre }      <- SEPARADO (ver abajo)
```

### Que cambia y por que

| Hoy | Propuesto | Por que |
|---|---|---|
| `actividadesExtra` con nombre como llave | `actividades/{actId}` con `nombre` como atributo | **Renombrar pasa de 5 escrituras a 1.** Se va la tabla de la guia. |
| `nivelesActividad` con `n{}` anidado | `actividades/{id}/acciones/` — 1 doc por accion | Se puede editar y borrar una accion suelta; hoy hay que reescribir las 10 claves. |
| `presetsActividad/{nombre}` | `actividades/{id}/accesorios/` | Se va la segunda llave por nombre. |
| `citas.actividad` (string) | `citas.actividadId` | Se va el `where` de `actividades.html` y el renombrado deja de tocar citas. |
| `citas.fechaCita` (string) | `fecha:Timestamp` | Ordenar y comparar de verdad. |
| `citas.proponenteNombre` etc. | solo ids | 4 campos menos por cita. |
| `retos.asignadoPor{id,nombre}` | `asignadoPor:uid` | 8 objetos `{id,nombre}` en la coleccion. |
| `puntosUsuarios.balance` | `puntos/{uid}/movimientos/` + saldo como cache | **Se puede auditar y corregir.** Es el problema P3. |
| 3 documentos `sesion*` | 1 coleccion `partidas/` con subcolecciones | P5: un solo esquema, tres juegos encima. |
| `invitaciones.sesion` (string) | `invitaciones.partidaId` | Se va el `getDoc` cruzado y el aviso pegado. |
| `config/ajustes.usuarios[]` | `usuarios/{uid}` | **Fase 5, la mas riesgosa.** Ver abajo. |
| `solicitudes.email` | `clientes/{id}.email` | Es el problema que ya esta documentado: el correo del cliente es legible sin sesion. Separarlo lo hace atacable con reglas. |

### Lo que NO se toca (a proposito)

- **`rol` no es una tabla de permisos.** Sigue sin haber login, y sin login las
  reglas siguen abiertas. Esto **no cambia la seguridad de nada**; solo deja el
  dato en un lugar donde, cuando llegue el login, ya esta donde debe.
- **`presencia.nombre` y `chat.autorNombre` se pueden quitar, pero no hace falta.**
  En un registro de mensajes es correcto guardar el nombre como foto: si el
  usuario se borra, el historial sigue siendo legible. Eso es snowflake
  **intencional**, no deuda. Se documenta como decision para que nadie lo
  "arregle" despues.

---

## 5. Orden de migracion (de menor a mayor riesgo)

**No hay git en este entorno.** Cualquier migracion tiene que ser *aditiva*
(escribir el dato nuevo junto al viejo) y reversible a mano, porque no hay
`git revert`. Fredy prueba en vivo antes de continuar.

### Fase 1 — Arreglos puntuales. Riesgo bajo. **Empezar aqui.**
- Corregir la ruta mal escrita de `sesionEncuentros/actual` (ver B1)
- Arreglar la fuga de puntos al eliminar un reto (ver B2)
- Poner `marcarCumplida` en transaccion (ver B3)
- Unificar los tipos de fecha y `graciaUsada`

Ninguna de estas cambia el esquema. Se pueden hacer y probar por separado.

### Fase 2 — Id estable en actividades. Riesgo medio. **El mayor beneficio.**
`actividades/{actId}` + ids en `citas` y `retos`. **Elimina la tabla de "mover
cinco cosas"** de la guia, que es la fuente de advertencias que ya existem.
Requiere migrar los docs que ya estan en `pareja-test`.

### Fase 3 — Historial de puntos. Riesgo medio.
`puntos/{uid}/movimientos/`. El saldo pasa a ser una cache recalculable. Se
puede hacer **en paralelo** con la 2 (no se tocan).

### Fase 4 — Partidas unificadas. Riesgo alto.
Un solo esquema para los tres juegos + `partidaId` en `invitaciones`. Es la que
mas codigo toca (tres juegos completos) y la que mas riesgo de romper turnos.

### Fase 5 — Identidad. Riesgo alto. **Va al final, con el login.**
`config/ajustes` → `usuarios/`. Toca el modo invitado, el respaldo, y el
`localStorage` de respaldo. **Es parte del "rediseño de arquitectura" que ya
esta planeado**, y no se puede hacer antes: sin login no cambia la seguridad y
solo agrega riesgo.

---

## 6. Fallas verificadas durante el analisis

No son hipotesis: estan en el codigo, con linea.

### B1. La expulsion automatica del invitado NUNCA se ejecuta

`index.html:870`
```js
const sd = await conTiempo(getDoc(doc(db, "sesionEncuentros/actual")), 8000);
```
Un solo segmento de ruta. `doc()` con un numero impar de segmentos devuelve una
**coleccion**, no un documento; `getDoc()` sobre una coleccion lanza error, y el
`catch` de la linea 874 se lo come. `leido` se queda en `false`, y la linea 876
sale temprano **siempre**.

Efecto: la funcion `volverSiInvitadoSinPartida()` **no puede devolver `true`
nunca**. El invitado nunca vuelve solo a su base. Es exactamente el criterio A de
`GUIA.md` §5.2, que aparece como *"probado por Fredy, funciona bien"*.

El modo correcto, como en el resto del archivo, son dos segmentos:
`doc(db, "sesionEncuentros", "actual")`.

> A confirmar a mano: abrir la consola del navegador en el celular con un
> invitado registrado y ver si aparece el error silenciado.

### B2. Eliminar un reto ya cobrado descuenta puntos de mas

`Retos/index.html:935-943`
```js
const conteo = (reto.estado === "enCurso") ? (reto.conteo || 0) : 0;
if(conteo > 0){ ... increment(-conteo) ... }
```
Cuando se alcanza la meta, `marcarCumplida` liquida con `delta = 1 - puntosMeta`
(por ejemplo meta 5: acumula +4 y liquida -4, **quedando en 0**). Pero al
eliminar ese mismo reto, `eliminarReto` revierte `-conteo` = **-5**, dejando el
saldo en **-5**.

Y como ademas hace `batch.delete` del reto, **no queda registro de por que se
desconto nada**. El arreglo del P3 (historial de movimientos) vuelve este error
imposible de cometer en silencio.

Ademas `eliminarReto` no revisa el estado, mientras que
`finalizarRetosVencidos` si lo hace (`data.estado !== "enCurso"`).

### B3. Marcar cumplida no esta en transaccion: doble penalizacion

`Retos/index.html:951-976`

`conteo` usa `increment()` (atomico, bien), pero **`metaAlcanzada` y `delta` se
calculan del `reto` que se tiene en memoria**, no del documento. Dos celulares
tocando "cumplida" al mismo tiempo, con `conteo` en `meta-1`:

- A calcula `nuevoConteo = meta`, `delta = 1 - meta`
- B calcula lo mismo (leyo el mismo dato viejo)

Los dos escriben. `conteo` queda en `meta+1` y el saldo recibe **dos veces la
penalizacion**. El guardado local (`suprimir(id)`) solo protege a un dispositivo.

El mismo archivo ya tiene el patron correcto en `finalizarRetosVencidos`
(linea 1012), que **si** usa `runTransaction` y vuelve a leer el documento
dentro. `marcarCumplida` deberia hacer lo mismo.

### B4. Dos invitados pueden terminar con el mismo id

`index.html:1424-1426`
```js
arr.forEach(u=>{ const m = /^u(\d+)$/.exec(u.id || ""); if(m) n = Math.max(n, +m[1] + 1); });
const yo = { id: "u" + n, ... };
```
El id que crea el engrane es `"u" + Date.now().toString(36)` (linea 1081), que
lleva **letras**, asi que no cumple el patron y no cuenta para el maximo. Si la
base tiene un invitado del engrane y ningun `uN` numerico, el siguiente
registrado por QR recibe `u1`, que puede estar ocupado.

### B5. Como se dispersa el modelo de partida

Ya descrito en P4. No es una falla Today's: es el techo de 1 MiB y la
amplificacion de lectura de `onSnapshot` sobre el documento completo. Vale la
pena verlo antes de que haya partidas grandes de verdad.

---

## 7. Lo que este documento NO hace

- **No cambia reglas de Firebase.** `solicitudes` y las reglas de la pareja
  siguen como estan, por decision de Fredy (ver `AGENTS.md`).
- **No propone login ni autenticacion.** Eso es el rediseño de arquitectura, ya
  planeado aparte.
- **No toca la llave de `taquilla.js`.**
- **No se aplica nada.** Las fases son propuesta; cada una se prueba en vivo
  antes de la siguiente.

### Pendiente de Fredy (no se puede hacer desde aqui)

1. Abrir `pareja-test` en la consola y **comparar con la seccion 1** de este
   documento: confirmar que no hay colecciones o campos viejos que el codigo ya
   no usa.
2. **Probar B1** en el celular (invitado registrado, abrir la app sin partida).
3. **Probar B2** con un reto de meta 5 y ver el saldo antes y despues de
   eliminarlo.