# El juego de Castigos — `Castigos/` ("El Precio del Placer")

Movido de `General/GUIA.md`. Contiene el detalle completo de la pantalla de castigos: vistas, colecciones, niveles, modos, Placer extremo, Imposiciones, flujo de partida, invitados e import/export.

---

**Qué es:** juego independiente con licencia propia (`castigos` en `packs`/taquilla, item `castigos`). Cada pareja crea sus propios castigos con acciones por nivel y lado, accesorios, medidas y tomas sugeridas. Los oficiales vienen del Panel (`Panel/castigos.html`, ids `ofc_...`) y se instalan como pack con licencia.

## Pantallas y vistas (`Castigos/index.html`, 3953 líneas)

| Vista | Qué hace |
|---|---|
| `vistaInicio` | Elige modo (Solo / Pareja / Invitados), cómo juegan (Un celular / Cada quien el Suyo), modalidad (Normal / Multiactividad), switches Imposiciones y Placer extremo, QR invitar, lista de castigos |
| `vistaBloqueo` | Sin licencia del juego: link al Centro de Adquisiciones |
| `vistaConfig` | Gestiona Castigos, Accesorios e Imposiciones (tres pestañas) |
| `vistaEditar` | Editor de un castigo: niveles × lados, acciones, accesorio/medida, tomas, Pegar/Exportar JSON |
| `vistaTomas` | Cuántas acciones por nivel y lado para la partida (editable) |
| `vistaPartida` | La partida: Imposición → Castigo → Recibir, con cronómetro, Saltar turno, Pausar, Terminar, QR, Agregar invitado, sala |
| `vistaEspera` | Sala de espera del invitado / pareja |

## Paso de tomas al iniciar la partida

Cuando se inicia una partida de Castigos, se muestra la vista `vistaTomas` ("Castigos por nivel") con el siguiente texto:

> Elija cuántos castigos de cada nivel quiere utilizar para su partida, considere a sus invitados.

Allí se elige cuántas acciones de cada nivel (básico, medio, avanzado, experto, alucinado) se usarán en la partida. En la modalidad **Multi**, las tomas son de la partida y no se guardan en los castigos.

## Modales

`modalUnir`, `modalAgregar` (invitado a media partida), `modalQR`, `modalSeguir` (continuar pausada), `modalQuienCastiga`, `modalImposiciones`, `modalPlacer`, `modalMultiConf`, `modalDetalle` (accesorio/medida de una acción).

## Colecciones de Firebase

| Colección | Documento | Qué guarda |
|---|---|---|
| `castigosExtra` | id automático (`addDoc`), ya NO el nombre (oct-2026) | `{ nombre, creadoEn }` |
| `nivelesCastigo` | id = el de `castigosExtra` (o `ofc_...` para oficiales) | `{ n: {basico:{A:[],B:[]},…}, titulo, oficial?, tomas, actualizadoEn }` |
| `accesoriosCastigo` | id automático (`addDoc`), ya NO el nombre (oct-2026) | `{ nombre, creadoEn }` |
| `imposicionesCastigo` | `actual` | `{ A:[…], B:[…] }` |
| `sesionCastigos` | `actual` | Sesión compartida (cada quien el suyo): cabezas, orden, turnos, ronda, pausa, terminada |

**Renombrar un castigo o un accesorio ya NO mueve ni recrea ningún documento**
(oct-2026, mismo arreglo que `actividadesExtra` en `Citas/`): solo se actualiza
el campo `nombre` en el documento existente. Antes se creaba un documento
nuevo con el nombre como id y se borraba el viejo (incluyendo
`nivelesCastigo`), lo que **borraba las acciones guardadas del castigo al
renombrarlo**. `accesoriosCastigo` no tiene hoy ninguna colección que dependa
de su id, así que ahí el cambio es preventivo (evita repetir la misma trampa
el día que algo cuelgue de ese id), no corrige una pérdida de datos actual.

**Migración de los castigos viejos (oct-2026).** Los castigos creados antes
tienen su nombre como id (`castigosExtra/{nombre}`, `nivelesCastigo/{nombre}`).
`migrarCastigosAId()` (`config.js`) los pasa a id automático al cargar la lista
de `Castigos/`. Un castigo es "viejo" si su id es igual a su nombre. Por cada uno:
1. Se reserva el id nuevo en `config/migracionCastigos` (transacción: dos
   celulares a la vez reciben el mismo id; ahí queda el `mapa` viejo → nuevo).
2. Las acciones y tomas se mueven de `nivelesCastigo/{nombre}` al id nuevo con
   la misma función de las actividades (mezcla si ya había algo; borra el viejo
   solo tras releer el nuevo).
3. Se crea `castigosExtra/{id nuevo}` con el mismo `nombre` y `creadoEn`.
4. Se borra el `castigosExtra` viejo.

Si algo falla, ese castigo se reintenta en la siguiente carga. Si queda un viejo
junto a su copia nueva (borrado a medias), la lista oculta el viejo. Las partidas
pausadas guardan el id viejo: `idVigente()` lo traduce con el `mapa` al leer
las acciones o guardar las tomas. Los oficiales (`ofc_...`) no se tocan.

## Niveles y lados

Niveles: `basico`, `medio`, `avanzado`, `experto`, `alucinado`. Lados: `A` y `B`. Tomas por defecto: `{basico:2, medio:2, avanzado:1, experto:1, alucinado:1}`. Texto de acción: máx. 75 caracteres; el campo del editor crece solo y el texto baja de renglón. Medida: `libre` / `tiempo` / `veces` + valor.

## Licencias

- Item `castigos` (ver `acceso.js`, `tengoAcceso("castigos")`).
- El invitado juega con el acceso del anfitrión (como Encuentros).
- Oficiales aprobados: `oficialesAprobados()` filtrados por `ruta === "Castigos"`, se muestran con 🏅. Las acciones oficiales se siembran en `nivelesCastigo` si la pareja no tiene acciones escritas (no se sobrescriben si ya hay contenido).
- `repararOficialCastigo()` recupera las acciones de un oficial si la copia local está vacía.

## Modos de juego

| Modo | Qué implica |
|---|---|
| Solo | Un solo jugador, un lado |
| Pareja | Admin (lado A) + pareja (lado B) |
| Invitados | Pareja + invitados registrados (lado de quien los invitó) |
| Un celular | Todo local, sin sesión compartida |
| Cada quien el Suyo | Sesión compartida en `sesionCastigos/actual`, turnos sincronizados |

## Modalidades

| Modalidad | Qué hace |
|---|---|
| Normal | Tomas por nivel/lado, reparto de acciones entre jugadores |
| Multi | Se eligen 3 castigos, reparto en rueda (una acción de cada castigo por turno hasta juntar las tomas; el castigo con menos acciones aporta todo lo que tiene). Las tomas son de la partida, no se guardan en los castigos. |

## Placer extremo (switch)

Juega **todas** las acciones de los niveles elegidos (avanzado/experto/alucinado), repartidas sin repetir entre los jugadores del lado. No usa tomas. Si no hay acciones suficientes en los niveles elegidos, se aborta con aviso.

## Imposiciones (switch)

Cada N rondas (configurable, 1 o más) se asigna una imposición al azar al turno de ese lado. Se reparten entre todos los usuarios, incluidos inactivos; si el turno no se juega, la imposición se pierde. Máximo una imposición por turno. Editable en Configuración → Imposiciones por lado.

## Flujo de la partida

1. Elige castigo (o 3 en Multi) → paso de tomas → `iniciarPartida()`.
2. Cada turno: **Imposición** (si está activa, el anfitrión la escribe) → **Castigo** (se muestra la acción + accesorio + medida; si es `tiempo` se inicia cronómetro) → **Listo** avanza al siguiente turno.
3. El que recibe ve solo su acción; los demás ven "Turno de X" sin la acción.
4. Al terminar: "¡Gracias por jugar!", fuegos (`encenderFuegos()`), fin de sesión si es compartida.

## Controles de partida

- **Saltar turno:** solo el anfitrión; consume imposición y castigo del turno.
- **Pausar / Reanudar:** solo el anfitrión; guarda estado en `localStorage` (`castigos_partida_pausada`) y en la sesión compartida.
- **Terminar Partida:** solo el anfitrión; termina para todos, `activa:false, terminada:true`.
- **Revivir:** switch del anfitrión; si está apagado, los turnos del lado no inicial se saltan.

## Invitados

- QR (`btnQR` / `btnQRInicio`) lleva la configuración de Firebase (mismo patrón que Encuentros).
- Sala de espera (`salaPanel`): "En la espera" (invitados no en cabezas) / "En el juego" (cabezas).
- **Agregar invitado a media partida:** se genera una acción **distinta** a la del compañero en cada ronda restante, respetando el nivel y lado. Si el compañero ya jugó esa ronda, el invitado recibe una acción diferente del mismo nivel/lado.
- El invitado no tiene salida (`pintarSalidas()` oculta el "Volver" cuando es invitado o hay partida activa).

## Import / Export de acciones

Desde el editor de un castigo:
- **Exportar:** baja un `.json` con `{ niveles: {basico:{A:[…],B:[…]},…} }`.
- **Pegar:** acepta JSON con niveles/lados, o lista plana de strings, o objeto con niveles. Recorta textos a 75 chars si se pasan. Pregunta antes de reemplazar si ya hay acciones.

## Apertura de pantalla

Al arrancar: pinta la vista de inicio inmediatamente (no queda en blanco si Firebase tarda), luego carga datos, verifica licencia (`tengoAcceso("castigos")`), verifica sesión compartida pausada, y si es invitado lo deja en `vistaEspera` revisando cada 4 segundos.

## Archivos relacionados

- `Panel/castigos.html` — pantalla del Panel para crear/editar/eliminar castigos oficiales (`ofc_…`), activar, ver tarjeta en el Centro.
- `General/Plan-Castigos/` — plan de desarrollo (8 etapas + pruebas en vivo).
