# Plan de desarrollo — Duelo de seducción (`Roles/`)

> **Estado: CONSTRUIDO el 17-oct-2026. PENDIENTE la prueba en vivo.**
> El código está en `Roles/index.html`; el resumen de lo hecho y lo que falta
> está en la sección 10. El diseño y las decisiones de producto están en
> **`General/duelos.md`**.
> Este archivo se conserva como el plan de ejecución y la bitácora.

## 0. Cómo usar este plan

1. Leer, en este orden: `AGENTS.md` → `General/GUIA.md` → `General/duelos.md`
   → este archivo.
2. Trabajar **una fase a la vez**. Al terminar cada fase:
   - correr `herramientas/sintaxis/revisar.py`;
   - marcar los checkboxes de la fase;
   - actualizar la sección **Estado de avance** al final de este archivo.
3. **Verificación real = en vivo**, en Pages y en el celular de Fredy.
   No hay arnés, no hay Chrome sin ventana, no hay scripts de prueba en el repo.
4. Regla de los 3 intentos: si una forma de probar falla 3 veces, se anota como
   “pendiente de probar a mano” y se sigue.
5. Si hay pocos tokens: hacer primero **Fase 1 + Fase 2** (Pareja, Turnos).
   Eso ya es un duelo jugable. Después Juntos y después multijugador.

---

## 1. Qué se va a construir

Un **cuarto modo base** de `Roles/`, hermano de Clásico, Cambia de Bando y
Seleccionar:

- Nombre de la pestaña: **Duelo de seducción**.
- Descripción: **“Sensualidad contra Erotismo, Quién Ganará ?”**.
- Se reparten **R personajes de UN solo lado**; de cada uno se toma su
  **contraparte cruzada**. El dueño de la lista juega los originales; el otro
  juega las contrapartes.
- Dos modalidades: **Turnos** (motor actual) y **Juntos** (nuevo).
- Dos formas: **un solo celular** y **cada quien en su celular**.
- Cuatro ramas: Pareja/Turnos, Pareja/Juntos, Multi/Turnos, Multi/Juntos.

### Lo que NO se toca

- El motor de Turnos (`siguienteTurno`, `avanzarTarjeta`, `siguienteSesion`).
- El sorteo, las rondas, las transacciones existentes, las invitaciones, la
  sala, el volteo de una carta normal y el final con fuegos.
- Los modos Clásico, Cambia de Bando y Seleccionar.
- Las reglas de Firebase.

---

## 2. Decisiones cerradas (vienen de `duelos.md`)

| Tema | Decisión |
|---|---|
| Lado | El admin elige de quién son las cartas: usuario 1 o usuario 2. El dueño juega originales; el otro, contrapartes. |
| Sin contraparte | No aparece ni en la selección ni en el reparto. Nota al pie: “¿No ves un personaje? Puede que todavía no tenga contraparte.” |
| Selección | **Solo el administrador marca.** La pareja y los invitados ven y opinan, pero no marcan. |
| Contadores | Un solo arreglo de R elegidos; los dos lados muestran el mismo número. “Jugar” se prende al llegar a R. |
| Variantes picantes | Entran. Se sortean una vez al arrancar, máximo una por ronda, y le tocan a **una** persona. Se ven en **su** cara. |
| “Saltar turno” | **No existe en Duelo.** Se esconde en las dos modalidades. Su código no se toca. |
| Emparejamiento | En Pareja se conserva el orden: carta k con contraparte k. En Multijugador, quién hace duelo con quién es **dinámica del grupo**. |
| Invitado a media partida | Recibe las tarjetas que le falten **del lado del usuario que lo invitó**. |
| Juntos un celular | **Una sola carta de dos caras**: una cara = original; al voltearla = su contraparte. La ven todos. |
| Juntos cada quien | Cada persona recibe su carta tapada. Todos voltean; **el administrador** aprieta “Siguiente”. |

---

## 3. Mapa del código actual que se reutiliza

Rutas y nombres actuales (las líneas se mueven al editar; buscar por función).

| Pieza | Dónde | Qué hace | ¿Se toca? |
|---|---|---|---|
| Constantes de modo | `Roles/index.html`, ~738-748 | `MODO_NORMAL`, `MODO_ESPEJO`, `MODO_SELECCIONAR`, `DESC_MODO` | **Sí**: agregar `MODO_DUELO` y su descripción |
| `listaDeLado(lado, modoBase)` | ~753 | De dónde sale la lista de un lado | **Sí**: rama para duelo (o no usarla) |
| `repartirTarjetas()` | ~1704 | Reparte R por jugador, por lado | **No**: se crea otra función para duelo |
| `preparar()` | ~1730 | Valida listas y lanza reparto o selección | **Sí**: rama duelo |
| `iniciar()` | ~1763 | Crea estado y sesión | **Sí**: parámetro/opciones de duelo |
| `iniciarEstado()` | ~785 | Arma `{cabezas, listas, orden, turno, ronda}` | **No** |
| `siguienteTurno()` / `avanzarTarjeta()` | ~793 / ~808 | Motor de Turnos | **No** |
| `siguienteSesion()` | ~1095 | Transacción de “Siguiente” en Turnos | **No** |
| `saltarTurno()` | ~1122 | Salta un turno | **No** (solo se esconde) |
| `pintarPaso()` | ~1342 | Pinta el turno actual | **Sí**: rama Juntos |
| `pintarTarjeta()` | ~1326 | Llena la carta normal | **No** (se reutiliza en Turnos y Juntos cada quien) |
| `resetCarta()` / `voltear()` | ~1300 / ~1275 | Tapa/voltea la carta normal | **No** |
| Carta HTML `#tarjeta` / `#reverso` | ~341-365 | Carta normal | **No** (se agrega una carta de duelo) |
| `btnSig.onclick` | ~1444 | “Siguiente” | **Sí**: rama Juntos |
| `mostrarBotonesAdmin()` | ~1202 | Muestra/oculta botones de anfitrión | **Sí**: esconder “Saltar turno” en duelo |
| `pintarSala()` | ~1221 | Panel de sala en multijugador | **No** |
| `agregarInvitado()` | ~1502 | Mete a alguien a media partida | **Sí**: rama duelo |
| Selección | ~1847-2166 | Pantalla de selección de tarjetas | **Sí**: rama duelo |
| `escucharSeleccion()` | ~2066 | Escucha la selección compartida | **Sí**: rama `modo:"duelo"` |
| `cargarEstado()` | ~964 | Copia la sesión a `estado` | **Sí**: campos de duelo |
| `modoBaseDePartida()` | ~1497 | Modo de la partida en curso | **No** (ya devuelve `estado.modo`) |
| `entrarAlJuego()` / `continuarPartida()` | ~2226 / ~2195 | Entrar/reanudar | **No** (funcionan si `cargarEstado` trae los campos) |
| Especiales | ~950 / ~984 | Sorteo y consulta por ronda/jugador | **No** |

**Imports ya presentes** (`~555-566`): `runTransaction`, `serverTimestamp`,
`confirmar`, `aviso`, `publicarInvitacion`, `retirarInvitacion`, `fuegos`.
No hace falta agregar imports.

---

## 4. Modelo de datos

### 4.1 Sesión `sesionRoles/actual`

Se agregan estos campos (los demás no cambian):

```js
{
  // ...campos actuales: activa, pausada, terminada, porAdmin, sid, hostUid,
  // hostNombre, modoJuego, modoBase, unCelular, rondas, ronda, cabezas,
  // listas, orden, turno, especial, especialK, especiales, empezadaEn...

  modoBase: "duelo",              // en vez de "normal" | "espejo" | "seleccionar"
  dueloLado: "A" | "B",            // lado cuyas cartas se repartieron
  dueloModalidad: "turnos" | "juntos",
  dueloPares: [                    // en ORDEN de selección
    { o: 12, c: 45 },              // o = id del original; c = id de su contraparte
    ...
  ]
}
```

- `listas[id]` sigue siendo la **cola de tarjetas** de cada cabeza.
- En duelo, cada cabeza recibe **R tarjetas de su lado**, en el orden de
  `dueloPares`. Si hay varias cabezas en el mismo lado, **todas reciben la
  misma secuencia** (copias independientes). Esto es una **decisión técnica**
  para que la ronda k de un lado coincida con la ronda k del otro. Los
  personajes repetidos entre cabezas del mismo lado son intencionales.
- `orden` y `turno` se siguen llenando (el motor y `sanearSesion` los usan),
  aunque en Juntos no gobiernan la partida.

### 4.2 Selección `seleccionRoles/actual`

Para la selección del duelo se usa el mismo documento, con:

```js
{
  activa: true,
  modo: "duelo",                 // distingue de la selección normal y de "agregar"
  modoJuego: "pareja" | "multi", // quiénes juegan (antes iba en `modo`)
  dueloLado: "A" | "B",
  dueloModalidad: "turnos" | "juntos",
  dueloSel: [idsOriginales],     // SOLO lo escribe el administrador
  rondas: R,
  cabezas: [...],
  sid, hostUid, hostNombre,
  actualizadaEn
}
```

- El invitado/pareja **lee** `dueloSel` y ve la lista; no escribe.
- El administrador escribe `dueloSel` con `setDoc(..., { merge:true })`.
- No se usa `sel[id]` para el duelo. `sel` sigue siendo de la selección normal.

### 4.3 Invariantes que no se pueden romper

1. **Los ids son únicos** en las cuatro listas; por eso `par` se busca por id.
2. **Pareja cruzada:** original en `U1` → contraparte en `C2`; original en
   `U2` → contraparte en `C1`. La contraparte correcta es la que tiene
   `c.par === original.id`.
3. **Exactamente una contraparte.** Si hay 0, el original no aparece. Si hay
   más de 1, tampoco aparece (es ambiguo); “REVISAR CONTRAPARTES” ya lo avisa.
4. **`dueloPares` manda.** El orden de ese arreglo es el orden de las rondas.
5. **R tarjetas por cabeza.** No se recorta la cola de nadie.
6. **En Juntos la ronda sube una vez por “Siguiente”**, no una vez por persona.
7. **El invitado no tiene salida** durante selección ni partida (regla actual).

---

## 5. Cambios por archivo

### 5.1 `Roles/index.html`

#### 5.1.1 Constantes y textos

- Agregar `const MODO_DUELO = "duelo";` junto a los otros tres (~740).
- Agregar a `DESC_MODO`:
  `"duelo": "Sensualidad contra Erotismo, Quién Ganará ?"`.
- Helper nuevo:
  ```js
  function esModoDuelo(){ return modoBaseDePartida() === MODO_DUELO; }
  function dueloEsJuntos(){
    return esModoDuelo() && dueloModalidadDePartida() === "juntos";
  }
  ```
- `dueloLadoDePartida()` y `dueloModalidadDePartida()` leen de `estado` y, si
  falta, de `sesionActual`.
- `ladoDeCabeza(id)` busca la cabeza en `estado.cabezas`/`sesionActual.cabezas`.

No cambiar los valores guardados de los otros modos (`normal`, `espejo`,
`seleccionar`): hay partidas viejas.

#### 5.1.2 Pestañas: 4 modos en 2x2

- HTML (~270-274): agregar
  `<button class="tab" id="tabDuelo">Duelo de seducción</button>`.
- La fila de modos queda con `class="tabs tabsModos"`.
- CSS nuevo, **después** de `.tab.activo` (~94), sin tocar `.tabs`:
  ```css
  .tabs.tabsModos{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .tabsModos .tab{ font-size:.82rem; padding:10px 8px; }
  ```
  **No** cambiar `.tabs` global: la usan la selección y el engrane, donde hay
  3-4 pestañas de jugadores y se verían torcidas.
- `pintarModo()` (~885): incluir `["tabDuelo", MODO_DUELO]` en el arreglo.
- `tabDuelo.onclick = ()=>{ modoBaseCfg = MODO_DUELO; pintarModo(); };`
- `DESC_MODO` ya cubre el texto de abajo.

#### 5.1.3 Modal del duelo (lado + modalidad)

Flujo:

```
Pareja / Multijugador
  → modalModo (Un solo Celular / Cada quien en el suyo)   [se reutiliza]
  → si modoBaseCfg === MODO_DUELO: modalDuelo (lado + Turnos/Juntos)
  → preparar(...)
```

- `btnModoLocal` / `btnModoComp` (~902-903): si `modoBaseCfg === MODO_DUELO`,
  guardar `dueloUnCelular = true/false`, cerrar `modalModo`, abrir
  `modalDuelo`; si no, seguir con `preparar(...)` como hoy.
- HTML nuevo, después de `modalModo`:
  ```html
  <div class="modal" id="modalDuelo">
    <div class="caja">
      <div ...>Duelo de seducción</div>
      <div>¿De quién son las cartas?</div>
      <div class="tabs">
        <button class="tab" id="dueloLadoA">Nombre del usuario 1</button>
        <button class="tab" id="dueloLadoB">Nombre del usuario 2</button>
      </div>
      <button class="btnPri" id="dueloTurnos">Turnos</button>
      <button class="btnPri" id="dueloJuntos">Juntos</button>
      <button class="btnSec" id="dueloNo">Cancelar</button>
    </div>
  </div>
  ```
  Los nombres salen de `nombreLado("A")` y `nombreLado("B")`; si no hay,
  “Usuario 1” / “Usuario 2”. No mostrar “U1/U2” (choca con las listas).
- Estado del modal: `dueloLadoPendiente = "A"|"B"`, `dueloUnCelular = bool`.
  Los dos botones de lado alternan `.activo`.
- `dueloTurnos.onclick` / `dueloJuntos.onclick`:
  cerrar `modalDuelo` y llamar
  `preparar(modoPendiente, { lado: dueloLadoPendiente, modalidad: "turnos"|"juntos" }, dueloUnCelular)`.
- `dueloNo.onclick`: cerrar.
- **No** preguntar la modalidad en otra pantalla: el doc pide lado y modalidad
  juntos.

#### 5.1.4 Selección del duelo

Se reutiliza `vistaSeleccion` con banderas nuevas (no duplicar pantalla):

```js
let selDuelo = false;
let selLadoDuelo = "A";
let selModalidadDuelo = "turnos";
let selDueloIds = [];        // ids de originales marcados
let selModoJuego = "pareja"; // pareja | multi (antes iba en selModo)
```

**Abrir local** (`abrirSeleccionDueloLocal(cabezasIn, R, lado, modalidad, modoJuego)`):

- setea las banderas, `selUnCelular = true`, `selCompartida = false`,
  `selSoyHost = true`, `selDueloIds = []`;
- `pintarSeleccion()`, `ver("vistaSeleccion")`.

**Abrir compartida** (`abrirSeleccionDueloCompartida(...)`):

- setea banderas, `selUnCelular = false`, `selCompartida = true`,
  `selSoyHost = true`, `selDueloIds = []`;
- escribe `seleccionRoles/actual` con el modelo de la sección 4.2;
- publica invitación apuntando a `seleccionRoles/actual` (mismo patrón que
  `abrirSeleccionCompartida`, ~2031);
- `pintarSeleccion()`, `ver("vistaSeleccion")`, `escucharSeleccion()`.

**`pintarSeleccion()`** (~1893): rama al inicio:

```js
if(selDuelo){ pintarSeleccionDuelo(); return; }
```

`pintarSeleccionDuelo()`:

- `selTabs.style.display = "none"`.
- `selDesc`: “Marca exactamente R tarjetas de [nombreLado(lado)]. [nombreLado(otro)] juega las contrapartes.”
- Lista = `paresDisponibles(selLadoDuelo)` (solo originales con **exactamente
  una** contraparte). Cada fila: checkbox + nombre + etiqueta “Normal”.
  - `checkbox.disabled = !selSoyHost` (la pareja y los invitados solo ven).
  - `checked = selDueloIds.includes(p.id)`.
  - `onchange` → `cambiarMarcaDuelo(p.id, checked)`.
- Contador: dos números derivados del **mismo** arreglo:
  “[lado A] n/R · [lado B] n/R”. Ambos iguales siempre.
- `btnSelJugar`: `selSoyHost && selDueloIds.length === selR`.
- `btnSelVolver`: visible salvo `esInvitadoFlag` (regla actual).
- `#selNota` (nuevo): visible solo en duelo, con
  “¿No ves un personaje? Puede que todavía no tenga contraparte.”
- No usar `selPoolDe()` ni `selMarcosDe()` en esta rama.

**`cambiarMarcaDuelo(id, marcado)`**:

- si `!selSoyHost`, no hace nada;
- si marca y ya hay R, `aviso("Solo puedes marcar R tarjetas.")` y repinta;
- si marca, agrega al final de `selDueloIds`; si desmarca, lo quita;
- si es compartida, `setDoc(seleccionRef(), { dueloSel: selDueloIds, actualizadaEn: serverTimestamp() }, { merge:true })`;
- repinta.

**`escucharSeleccion()`** (~2066): antes de la rama `"agregar"`, agregar:

```js
if(d.modo === "duelo"){
  // setear selDuelo, selLadoDuelo, selModalidadDuelo, selModoJuego,
  // selR = d.rondas, selCabezas = d.cabezas, selDueloIds = d.dueloSel || []
  // selSoyHost = (d.hostUid === miId)
  // si no soy host y no acepté: modalUnir (mismo flujo actual)
  // asegurarPersonajes(); pintarSeleccion(); ver("vistaSeleccion") si aplica
  return;
}
```

Mantener el flujo actual de “primero acepto, después veo la selección”
(`selSidAceptado`, `selInvitando`, `selYaEntre`). No cambiar esa regla.

**`arrancarSeleccion()`** (~2044): rama duelo antes de la normal:

1. Candado: si compartida y no host → `aviso("Solo quien inició la selección puede empezar.")`.
2. Si `selDueloIds.length !== selR` → aviso.
3. Construir `dueloPares` en el orden marcado:
   ```js
   const n = selLadoDuelo === "A" ? "1" : "2";
   const pares = selDueloIds.map(id=>{
     const o = listaSegura("U"+n).find(p=>p && p.id === id);
     const c = contraparteDe(id, selLadoDuelo);   // exactamente una
     return (o && c) ? { o:o.id, c:c.id } : null;
   }).filter(Boolean);
   ```
4. Si `pares.length !== selR`: aviso (“Algún personaje ya no tiene contraparte”).
5. Construir `pools` (sección 5.1.5) con `selCabezas`.
6. Apagar la selección compartida (`activa:false`).
7. `await iniciar(selModoJuego, null, selUnCelular, pools, { duelo:true, lado: selLadoDuelo, modalidad: selModalidadDuelo, pares })`.

**`btnSelVolver`** (~2152): el duelo usa el mismo comportamiento; no tocar.

#### 5.1.5 Reparto del duelo

Funciones nuevas (no tocar `repartirTarjetas`):

```js
function otroLadoDuelo(l){ return l === "A" ? "B" : "A"; }
function buscarPersonaje(id){ /* busca en U1,U2,C1,C2 */ }
function contraparteDe(idOriginal, ladoOriginal){
  const n = ladoOriginal === "A" ? "1" : "2";
  const lista = listaSegura("C" + (n === "1" ? "2" : "1"));
  const hits = lista.filter(c=> c && c.par === idOriginal);
  return hits.length === 1 ? hits[0] : null;   // 0 o >1 => no cuenta
}
function paresDisponibles(lado){
  const n = lado === "A" ? "1" : "2";
  return listaSegura("U"+n)
    .map(p=> ({ o:p, c:contraparteDe(p.id, lado) }))
    .filter(x=> x.o && x.c);
}
function poolsDuelo(cabezasIn, pares, lado){
  const porLado = {};
  porLado[lado] = pares.map(x=> buscarPersonaje(x.o)).filter(Boolean);
  porLado[otroLadoDuelo(lado)] = pares.map(x=> buscarPersonaje(x.c)).filter(Boolean);
  const pools = {};
  cabezasIn.forEach(c=>{
    pools[c.id] = (porLado[c.lado] || []).slice();   // R tarjetas, mismo orden
  });
  return pools;
}
```

- **Pareja:** una cabeza por lado → cada una recibe R cartas en orden.
- **Multijugador:** todas las cabezas de un lado reciben **la misma secuencia**
  (copias). Es intencional: la ronda k de A y la k de B son pareja. Las
  personas deciden entre ellas quién lee qué; la app no empareja personas.
- Si un lado no tiene cabezas, no se reparte nada para ese lado (no ocurre en
  las ramas previstas).

#### 5.1.6 `preparar()` e `iniciar()`

**`preparar(modo, opcionesDuelo, unCelularFlag)`** (~1730):

- Al inicio, después de cargar personajes/usuarios y leer R:
  ```js
  if(modoBaseCfg === MODO_DUELO){
    await prepararDuelo(modo, unCelularFlag, opcionesDuelo);
    return;
  }
  ```
- `prepararDuelo`:
  1. `const { lado, modalidad } = opcionesDuelo || {};` si falta → volver.
  2. `const pares = paresDisponibles(lado);`
  3. Si `pares.length < 2` → `aviso("Ese lado no tiene suficientes personajes con contraparte.")`.
  4. Si `R > pares.length` → `aviso("El número de rondas no puede pasar de X (personajes con contraparte).")`.
  5. `if(!revisarEspecial(R)) return;`
  6. Si `unCelularFlag` → `abrirSeleccionDueloLocal(...)`; si no →
     `abrirSeleccionDueloCompartida(...)`. **Siempre hay selección.**
- **No** ejecutar las validaciones de `listaDeLado` para duelo.

**`iniciar(modo, ladoSoloElegido, unCelularFlag, poolsListos, dueloCfg)`**
(~1763):

- Nuevo 5.º parámetro opcional; las llamadas actuales siguen funcionando.
- `const mb = (dueloCfg && dueloCfg.duelo) ? MODO_DUELO : modoBaseCfg;`
- Si `dueloCfg`, no repetir las validaciones de listas (los pools ya vienen).
- `const pools = poolsListos || ...` (para duelo siempre llega `poolsListos`).
- `const nueva = { ...camposActuales, modoBase: mb, ...(dueloCfg ? {
      dueloLado: dueloCfg.lado,
      dueloModalidad: dueloCfg.modalidad,
      dueloPares: dueloCfg.pares
  } : {}) };`
- Para Juntos, `orden`/`turno` se llenan igual (compatibilidad), pero la
  partida no los usa.
- El resto del arranque (sesión, invitación, `ver("vistaPlayer")`,
  `pintarPaso()`) queda igual.

#### 5.1.7 `cargarEstado()`

Agregar al objeto `estado` (~964):

```js
dueloLado: d.dueloLado || null,
dueloModalidad: d.dueloModalidad || null,
dueloPares: Array.isArray(d.dueloPares) ? d.dueloPares.slice() : []
```

Así `continuarPartida()`, `entrarAlJuego()` y el invitado que se une ven el
duelo sin tocar esas funciones.

#### 5.1.8 Motor de Turnos (sin cambios)

- Cada cabeza tiene R cartas de su lado, en orden.
- `siguienteTurno()` sortea y hace que cada quien actúe una vez por ronda.
- `avanzarTarjeta()` quita una carta y avanza.
- `siguienteSesion()` sigue igual para compartido.
- **No** tocar ninguna de las tres.
- “Saltar turno” se esconde (sección 5.1.10).

#### 5.1.9 Motor de Juntos

**Función local:**

```js
function avanzarDueloJuntosLocal(d){
  const ids = (d.cabezas || []).map(c=> c.id);
  ids.forEach(id=>{
    d.listas[id] = (d.listas[id] || []).slice();
    d.listas[id].shift();
  });
  d.ronda = (d.ronda || 1) + 1;
  if(d.ronda > d.rondas || ids.every(id=> !(d.listas[id] || []).length)){
    d.terminada = true;
  }
}
```

**Función compartida** `siguienteDueloJuntos()`:

- Si `!jugando || !estado || estado.terminada` → salir.
- Si `jugandoCompartido` y `!esAnfitrion()` → salir.
- Local: `avanzarDueloJuntosLocal(estado); pintarPaso();` y si terminó,
  `finPartida()` una sola vez.
- Compartida: `runTransaction`:
  1. leer `sesionRoles/actual`;
  2. si no `activa`/`terminada`/`hostUid !== miId`, salir;
  3. hacer el mismo avance sobre `d.listas` de todas las cabezas, subir
     `d.ronda`, calcular `d.terminada`;
  4. `tx.update(ref, { listas, ronda, terminada, activa: !terminada, actualizadaEn: serverTimestamp() })`;
  5. si terminó, `retirarInvitacion(JUEGO_INV)`.
- Igual que `siguienteSesion()`, si falla la transacción → `aviso("No se pudo pasar. Revisa conexión.")`.
- El `onSnapshot` existente se encarga de repintar a todos.

**`pintarPaso()`** (~1342):

- Calcular `esJuntos = dueloEsJuntos()`.
- Después de `pintarSala()` y `mostrarBotonesAdmin()`, y después del corte
  `if(!jugando || !d) return;`:
  ```js
  if(esJuntos){ pintarPasoDueloJuntos(d); return; }
  ```
- En la rama normal (Turnos y modos actuales), ocultar `#tarjetaDuelo` y
  `#faseDuelo` para que no queden restos de una partida anterior.

**`pintarPasoDueloJuntos(d)`**:

- Si `d.terminada`: igual que el final actual (ocultar carta/botones, mostrar
  `#finMsg`).
- `#progreso`: `"Ronda X de R"`.
- `#btnSaltar`: `display:none`.
- `#faseDuelo`: visible.
- **Un solo celular** (`!jugandoCompartido`):
  - ocultar `#flipwrap` normal y mostrar `#tarjetaDuelo`;
  - `const par = d.dueloPares[d.ronda-1]`;
  - pintar las dos caras con `pintarDueloPar(par, d.ronda)`;
  - `#turnoNombre` = “Juntos”;
  - `#faseDuelo` = “Una cara es el original; voltéenla para ver la contraparte.”;
  - `#btnSig` visible (el anfitrión es quien tiene el teléfono);
  - `#esperaTurno` oculto.
- **Cada quien en su celular**:
  - ocultar `#tarjetaDuelo`; mostrar `#flipwrap`;
  - `const p = (d.listas[miId] || [])[0]`;
  - si hay carta: `pintarTarjeta(p, especialDe(d.ronda, miId))` y
    `resetCarta(miId + ":" + d.ronda + ":" + (p.id || ""))`;
  - si no: mostrar `#tarjetaVacio`;
  - `#turnoNombre` = “Juntos”;
  - `#faseDuelo` = `bocaAbajo` ? “Voltea tu carta.” :
    (`esAnfitrion()` ? “Jugando” : “Esperando a que el anfitrión avance.”);
  - `#btnSig` visible solo si `esAnfitrion()`;
  - `#esperaTurno` oculto.

**`btnSig.onclick`** (~1444):

```js
if(dueloEsJuntos()){
  if(!esAnfitrion()) return;
  siguienteDueloJuntos();
  return;
}
if(bocaAbajo){ ...aviso actual...; return; }
siguiente();
```

- En Juntos **no** se exige voltear la carta para avanzar.
- En Turnos se mantiene la regla actual.

#### 5.1.10 “Saltar turno” y botones

- `mostrarBotonesAdmin()` (~1202): al final, si `esModoDuelo()`, forzar
  `btnSaltar.style.display = "none"`.
- En `pintarPaso()` (rama normal), donde hoy se decide `btnSaltar`
  (~1406 y ~1415), agregar `&& !esModoDuelo()`.
- El botón ya nace oculto en el HTML (`style="display:none"`). No cambiar eso.
- `btnTerminar`, `btnTerminarPartida`, `btnQR`, `btnAgregarInv` siguen igual:
  solo anfitrión, solo multijugador para los de invitados.

#### 5.1.11 Carta de dos caras (Juntos un celular)

**HTML:** agregar dentro de `#vistaPlayer` (después de `#flipwrap`):

```html
<div id="tarjetaDuelo" style="display:none;width:100%;"></div>
<div id="faseDuelo" style="display:none;font-size:.8rem;color:var(--fg-muted);text-align:center;margin-top:8px;"></div>
```

**CSS:** cambiar el selector de la carta normal para compartir estilos:

```css
#tarjeta, .tarjetaCara { ...lo que hoy tiene #tarjeta... }
```

Así las caras del duelo usan el mismo diseño aprobado. No duplicar medidas.

**JS nuevo:**

- `caraDuelo = 0` (0 = original, 1 = contraparte).
- `pintarDueloPar(par, ronda)`:
  - `const o = buscarPersonaje(par.o)`, `const c = buscarPersonaje(par.c)`;
  - `pintarCaraDuelo(contA, o, especialDeLado(ronda, dueloLadoDePartida()), "Original")`;
  - `pintarCaraDuelo(contB, c, especialDeLado(ronda, otroLadoDuelo(dueloLadoDePartida())), "Contraparte")`;
  - `caraDuelo = 0`; `mostrarCaraDuelo()`.
- `pintarCaraDuelo(cont, p, esp, etiqueta)`:
  - construir con `document.createElement` y **`textContent`** (nunca
    `innerHTML` con datos de Firebase);
  - reutilizar clases `.foto`, `.nombre`, `.blqueEspecial` (o una copia con
    la misma clase), `.info`, `.bloque`, `.accion`;
  - usar `pintarFotoEn(el, p)`; para eso refactorizar `pintarFoto()`:
    ```js
    function pintarFotoEn(el, p){ /* el cuerpo actual, con el `el` recibido */ }
    function pintarFoto(p){ pintarFotoEn(document.getElementById("fotoPersonaje"), p); }
    ```
  - mostrar la etiqueta “Original” / “Contraparte” en un `.selTag`.
- `mostrarCaraDuelo()`: enseña `#tarjetaDueloA` o `#tarjetaDueloB`.
- `voltearDuelo()`: `caraDuelo = 1 - caraDuelo; mostrarCaraDuelo();`.
- `#tarjetaDuelo.onclick = ()=>{ if(dueloEsJuntos() && !jugandoCompartido) voltearDuelo(); };`
- `especialDeLado(ronda, lado)`:
  ```js
  function especialDeLado(ronda, lado){
    const lista = (estado && estado.especiales) || [];
    return lista.find(x=> x && Number(x.ronda) === Number(ronda) &&
      ladoDeCabeza(x.jugador) === lado) || null;
  }
  ```
- No se usa `bocaAbajo` en esta carta. “Siguiente” no depende del volteo.
- Al cambiar de ronda se reinicia `caraDuelo = 0`.

#### 5.1.12 Invitado a media partida

`agregarInvitado()` (~1502): rama duelo **antes** de `MODO_SELECCIONAR`:

```js
if(mb === MODO_DUELO){
  const pares = (estado && estado.dueloPares) || [];
  const lado = (estado && estado.dueloLado) || "A";
  const pool = pares.slice(ronda)   // ronda = ronda actual; entra a la siguiente
    .map(par => buscarPersonaje(cab.lado === lado ? par.o : par.c))
    .filter(Boolean);
  if(!pool.length){ aviso("Ya no quedan rondas para que entre."); return; }
  // ...mismo bloque de transacción/local que ya existe, usando `pool`
  return;
}
```

- `restantes` ya se calculó arriba (`R - ronda`); `pool.length` debe coincidir.
- El invitado **no** se mete a `orden` en la ronda actual (regla actual); en
  Turnos entra cuando el orden se revuelve. En Juntos da igual: su cola existe
  y `pintarPasoDueloJuntos` lo incluye desde la siguiente ronda.
- En multijugador, después de agregarlo, se vuelve a publicar la invitación
  (código actual).

#### 5.1.13 Especiales

- `repartirEspeciales()` no cambia: elige rondas distintas y una cabeza por
  ronda.
- Turnos: `especialDe(d.ronda, cur)` (igual que hoy).
- Juntos cada quien: `especialDe(d.ronda, miId)`.
- Juntos un celular: `especialDeLado(ronda, lado)`; se pinta en la cara de ese
  lado. Como máximo hay una especial por ronda, nunca salen dos.
- La variante sigue viviendo **dentro** de la carta/ cara.

#### 5.1.14 Reanudar, pausar y fin

- `continuarPartida()` y `entrarAlJuego()` no cambian: `cargarEstado()` ya
  trae los campos del duelo y `pintarPaso()` decide la rama.
- Pausar/terminar: igual que hoy. En Juntos compartido, la transacción de
  pausa no toca `listas`; al reanudar se conserva la ronda.
- Fin: `avanzarDueloJuntosLocal`/la transacción dejan `terminada:true`; el
  `onSnapshot` existente muestra el aviso y los fuegos.
- `btnFinOk` no cambia.

### 5.2 Documentación

- `General/duelos.md`: al terminar, cambiar el aviso de arriba de
  “ESTE MODO NO EXISTE TODAVÍA” a “YA EXISTE” y anotar la fecha; dejar el
  diseño como referencia. Agregar el puntero a este plan.
- `General/GUIA.md`, entrada de `Roles/` (~1237-1324): al terminar, agregar
  que el modo **Duelo de seducción** ya existe, con su descripción y las dos
  modalidades, y apuntar a `duelos.md` para el detalle. No copiar el detalle.
- `AGENTS.md`: este plan se agrega a la tabla de documentos (hecho).
- `General/HISTORIA.md`: solo si aparece un arreglo no obvio durante la
  construcción; no es obligatorio para una función nueva.

---

## 6. Fases de trabajo

### Fase 1 — Pestaña, modal y selección

**Objetivo:** poder elegir Duelo, lado y modalidad; llegar a la selección
filtrada; que solo el admin marque.

Tareas:

- [x] Constantes, `DESC_MODO`, helpers `esModoDuelo`/`dueloEsJuntos`.
- [x] Pestaña 2x2 con CSS aislado.
- [x] `modalDuelo` (lado + Turnos/Juntos) y el paso desde `modalModo`.
- [x] `prepararDuelo` con validación de parejas y R.
- [x] `paresDisponibles`, `contraparteDe`, `buscarPersonaje`.
- [x] Selección local y compartida del duelo.
- [x] `pintarSeleccionDuelo`, `cambiarMarcaDuelo`, `#selNota`.
- [x] `escucharSeleccion` rama `modo:"duelo"`.
- [x] `arrancarSeleccion` rama duelo (todavía puede no arrancar partida).

**Aceptación:**

- El 4.º modo se ve en 2x2 y no deforma las otras pestañas.
- Al elegir Pareja + Duelo + un celular, se pregunta lado y modalidad.
- La selección muestra solo personajes con contraparte.
- Solo el admin puede marcar; la pareja/ invitados ven el contador subir.
- El contador no pasa de R; “Jugar” se prende exactamente en R.
- La nota al pie se ve.
- `revisar.py` pasa.

### Fase 2 — Reparto + Turnos (las cuatro ramas de Turnos)

**Objetivo:** duelo jugable en Turnos, Pareja y Multijugador, un celular y
cada quien.

Tareas:

- [x] `poolsDuelo` y paso de `dueloPares` a `iniciar`.
- [x] Campos de sesión y `cargarEstado`.
- [x] `iniciar` con `dueloCfg`.
- [x] Esconder "Saltar turno" en duelo.
- [x] Verificar que la carta y el volteo normales funcionan (por código; falta en vivo).
- [x] Reanudar una partida de duelo (por código; falta en vivo).

**Aceptación:**

- Pareja/Turnos un celular: A ve originales, B contrapartes, en orden.
- Pareja/Turnos cada quien: cada teléfono ve su cara; el turno rota.
- Multi/Turnos: los invitados heredan el lado de quien los invitó; la sala
  sale; no hay “Saltar turno”.
- Las R rondas terminan solas; fuegos y “¡Gracias por jugar!”.
- Pausar, salir, volver a entrar y reanudar conserva `dueloPares` y la ronda.

### Fase 3 — Juntos cada quien

**Objetivo:** la modalidad nueva sin la carta de dos caras.

Tareas:

- [x] `avanzarDueloJuntosLocal` y `siguienteDueloJuntos` (transacción).
- [x] `pintarPasoDueloJuntos` para cada quien.
- [x] `#faseDuelo` con los tres textos.
- [x] `btnSig` sin candado de volteo, solo anfitrión.
- [x] `resetCarta` con la ronda en la llave.

**Aceptación:**

- Todos ven su carta tapada; al voltear, “Jugando”.
- Solo el anfitrión ve “Siguiente”; al apretarlo, todos pasan a la ronda
  siguiente (misma pareja k en ambos lados).
- La ronda sube una vez por “Siguiente”, no por persona.
- Termina después de R rondas, con fuegos.
- El que no es anfitrión ve “Esperando a que el anfitrión avance”.

### Fase 4 — Juntos un celular (carta de dos caras)

**Objetivo:** la única combinación que necesita la carta nueva.

Tareas:

- [x] `#tarjetaDuelo`, `#faseDuelo` y CSS compartido.
- [x] `pintarCaraDuelo`, `pintarDueloPar`, `mostrarCaraDuelo`,
  `voltearDuelo`.
- [x] Refactor mínimo de `pintarFoto` → `pintarFotoEn`.
- [x] Rama local de `pintarPasoDueloJuntos`.
- [x] Especiales por lado.
- [x] Evitar restos de `#tarjetaDuelo` al volver a Turnos u otros modos.

**Aceptación:**

- En Juntos un celular se ve una sola carta; una cara es el original y al
  tocarla aparece la contraparte.
- Los dos personajes se ven completos (foto, nombre, situación, atractivo,
  derechos, acción).
- La variante picante sale solo en la cara que le toca.
- “Siguiente” avanza a la pareja siguiente; no hay “Saltar turno”.
- En Turnos y en los otros modos la carta normal sigue igual.

### Fase 5 — Invitado a media partida y casos límite

**Objetivo:** cerrar lo que falta para que no queden cabos.

Tareas:

- [x] `agregarInvitado` rama duelo (Turnos y Juntos, local y compartido).
- [x] Invitado que entra en Juntos cada quien: recibe la cola restante.
- [x] Invitado que entra en Juntos un celular: entra a la sala y participa.
- [x] Sin contraparte: no aparece; nota al pie (hecho en la Fase 1).
- [x] R mayor que las parejas: aviso con el máximo (hecho en la Fase 1).
- [x] Dos contrapartes para el mismo original: ese original no aparece (hecho en la Fase 1).
- [x] Pausa/terminar durante Juntos (por código; falta en vivo).
- [x] Regresión de Clásico, Cambia de Bando y Seleccionar (por código; falta en vivo).
- [x] Regresión de la selección normal y de “agregar invitado” (por código; falta en vivo).

**Aceptación:**

- Un invitado que entra a media partida termina con los demás.
- Nada de lo viejo se rompió.

### Fase 6 — Documentación y cierre

- [x] `duelos.md` marcado como construido y con la fecha.
- [x] `AGENTS.md` con la etiqueta del archivo al día (ya no dice "AÚN NO CONSTRUIDO").
- [x] `GUIA.md` con el cuarto modo en la entrada de `Roles/`.
- [x] `Plan-Duelo.md` con el estado final y las notas de lo que cambió.
- [x] `revisar.py` en verde.
- [ ] **Prueba en vivo completa de la matriz.** ← **LO QUE FALTA**

---

## 7. Matriz de pruebas (en vivo)

Marcar cada casilla en el celular de Fredy. No simular.

| # | Rama | Modalidad | Qué mirar |
|---|---|---|---|
| 1 | Pareja | Turnos | Un celular: A originales, B contrapartes, orden |
| 2 | Pareja | Turnos | Cada quien: cada teléfono su cara; turnos |
| 3 | Pareja | Juntos | Un celular: carta de dos caras; voltear; Siguiente |
| 4 | Pareja | Juntos | Cada quien: tapada, voltear, esperar al anfitrión |
| 5 | Multi | Turnos | Un celular: invitados heredan lado; sala; sin saltar |
| 6 | Multi | Turnos | Cada quien: invitación; turnos entre todos |
| 7 | Multi | Juntos | Un celular: una carta compartida; todos ven |
| 8 | Multi | Juntos | Cada quien: todos voltean; avanza el anfitrión |

Además:

- [ ] Sin contraparte: no aparece en la lista; nota al pie.
- [ ] R = máximo de parejas; R = máximo + 1 avisa.
- [ ] Solo el admin marca; la pareja ve el contador subir.
- [ ] Variante picante en una sola cara/ persona.
- [ ] Invitado a media partida en las cuatro ramas.
- [ ] Pausar, terminar, reanudar, salir y volver.
- [ ] Fin con fuegos y “¡Gracias por jugar!”.
- [ ] Los tres modos viejos siguen funcionando.
- [ ] La selección normal sigue funcionando.
- [ ] `revisar.py` pasa.

---

## 8. Riesgos y trampas

1. **`.tabs` global.** No cambiar `display:flex` de `.tabs`: la selección y el
   engrane lo usan con 3-4 pestañas. El 2x2 va en `.tabs.tabsModos`.
2. **`pintarPaso()` se llama desde muchos lados.** La rama Juntos debe tolerar
   `estado` nulo y `jugando` falso; va después de los cortes actuales.
3. **`resetCarta` en Juntos.** La llave debe incluir la ronda; si no, la carta
   se queda destapada entre rondas.
4. **`siguienteSesion` no sirve para Juntos.** No reutilizarla: avanza una
   sola cabeza. Juntos necesita su propia transacción que mueva todas.
5. **`sanearSesion` exige `orden` no vacío.** `iniciarEstado` lo sigue
   creando; no lo quites aunque Juntos no lo use.
6. **`modoBaseCfg` se pierde al recargar.** `arrancarSeleccion` debe pasar
   `dueloCfg` a `iniciar`; no confiar en la pestaña activa.
7. **La selección normal y la del duelo comparten globals.** Usar banderas
   `selDuelo*` y limpiarlas al abrir/cerrar; no reutilizar `sel[id]`.
8. **Solo el admin escribe `dueloSel`.** Si un invitado escribe, se rompe la
   regla y la selección se vuelve impredecible.
9. **No usar `innerHTML` con datos de Firebase.** `pintarCaraDuelo` debe usar
   `textContent` (nombres, situaciones, etc. vienen de la base).
10. **`btnSaltar` debe nacer oculto y quedarse oculto.** No basta con
    esconderlo en `pintarPaso`: también en `mostrarBotonesAdmin`.
11. **Carta de dos caras y modos viejos.** Al salir de Juntos, ocultar
    `#tarjetaDuelo` y `#faseDuelo`; si no, quedan restos.
12. **R por lado.** En multijugador todas las cabezas del mismo lado reciben
    la misma secuencia (copias). Es para que la ronda k coincida. No
    “optimizar” compartiendo el mismo arreglo: `avanzarTarjeta` hace `slice()`,
    pero conviene no depender de eso.
13. **Pocos tokens.** Si se acaba el contexto, dejar el estado en la sección 10
    y no empezar una fase nueva a medias. Las fases 1-2 ya dan un duelo
    jugable.
14. **Doble toque en "Siguiente" (Juntos).** Hay **dos** candados y ninguno se
    quita: `dueloPasando` (no dos transacciones a la vez) y `rondaEsperada`
    (no avanzar dos veces si la pantalla todavía no se enteró). Sin el segundo,
    dos toques seguidos se saltaban una pareja.
15. **Quién marca en Duelo.** Es el **usuario `admin`** (`esAdminFlag`), no el
    anfitrión de la partida. No volver a `selSoyHost` en la pantalla de
    escogimiento: si la pareja inicia el duelo en su teléfono, no debe poder
    marcar ni arrancar.

---

## 9. Definición de terminado

- Las 8 combinaciones de la matriz pasan en vivo.
- No hay “Saltar turno” en Duelo.
- La selección es solo del admin; los demás ven sin marcar.
- Sin contraparte no aparece; nota al pie.
- La contraparte correcta es siempre la cruzada (`par`).
- Turnos usa el motor actual sin cambios.
- Juntos avanza todas las colas y sube la ronda una vez.
- La carta de dos caras solo existe en Juntos un celular.
- Especiales salen en la cara correcta.
- Invitado a media partida funciona en las cuatro ramas.
- `revisar.py` pasa.
- `duelos.md` y `GUIA.md` actualizados.
- Ningún modo viejo se rompió.

---

## 10. Estado de avance

Actualizar al terminar cada fase. Formato: fecha + qué quedó + qué falta.

| Fase | Estado | Notas |
|---|---|---|
| 0. Lectura y diseño | Hecho | `duelos.md` cerrado |
| 1. Pestaña/modal/selección | Hecho (17-oct-2026) | La partida todavía NO arranca: eso es Fase 2 |
| 2. Reparto + Turnos | Hecho (17-oct-2026) | Las 4 ramas de Turnos; falta probarlas en vivo |
| 3. Juntos cada quien | Hecho (17-oct-2026) | En un solo celular todavía no (Fase 4) |
| 4. Juntos un celular | Hecho (17-oct-2026) | Carta de dos caras lista |
| 5. Invitado y casos límite | Hecho (17-oct-2026) | Por código; falta la prueba en vivo |
| 6. Documentación | Hecho (17-oct-2026) | Written as "built, pending live test" |

### LO QUE NO SE HA PROBADO (pendiente de Fredy, 17-oct-2026)

**El código de las 6 fases está completo y `revisar.py` pasa. NADA de esto se ha
ejecutado en un navegador ni en un celular.** En este repo "probado" significa que
se ejecutó, no que se revisó: hasta que se haga la matriz, el Duelo es **código
escrito, no algo verificado**.

**1. La matriz de las 8 ramas (sección 7). Las ocho están sin hacer:**

| # | Rama | Modalidad | Sin probar |
|---|---|---|---|
| 1 | Pareja | Turnos | Un celular: A originales, B contrapartes, en orden |
| 2 | Pareja | Turnos | Cada quien: cada teléfono su cara; turnos |
| 3 | Pareja | Juntos | Un celular: carta de dos caras; voltear; Siguiente |
| 4 | Pareja | Juntos | Cada quien: tapada, voltear, esperar al anfitrión |
| 5 | Multi | Turnos | Un celular: invitados heredan lado; sala; sin saltar |
| 6 | Multi | Turnos | Cada quien: invitación; turnos entre todos |
| 7 | Multi | Juntos | Un celular: una carta compartida; todos ven |
| 8 | Multi | Juntos | Cada quien: todos voltean; avanza el anfitrión |

**2. La lista de la sección 7 (debajo de la matriz). Las nueve, sin hacer:**

- Sin contraparte: que no aparezca en la lista y que se vea la nota al pie.
- R = máximo de parejas, y R = máximo + 1 (que avise con el número).
- Solo el admin marca; la pareja ve el contador subir y su casilla no se mueve.
- Variante picante en una sola cara (Juntos un celular) o en una sola persona.
- Invitado a media partida en las cuatro ramas (que termine con los demás).
- Pausar, terminar, reanudar, salir y volver.
- Continuar una partida de **un solo celular** (pausar, volver, y que salga
  "Continuar / Partida nueva"; "Partida nueva" descarta la guardada).
- Los cinco ajustes del 17-oct: checkbox de solo lectura visible, invitado en
  la **misma ronda** en Duelo/Juntos, mensajes de fase y "Toca para revelar"
  con degradado, encabezado "modalidad · quiénes" arriba de la ronda, y
  **"contra [contraparte]"** en las cartas del Duelo.
- Fin con fuegos y "¡Gracias por jugar!".
- **Los tres modos viejos siguen funcionando** (Clásico, Cambia de Bando,
  Seleccionar): es la regresión más importante, porque se tocaron sus funciones.
- La selección normal sigue funcionando, y "Agregar invitado" también.

**3. Lo que NO se pudo comprobar sin un navegador, y quedó a ojo:**

| Qué | Por qué no se comprobó | Dónde está |
|---|---|---|
| La fila 2x2 no se ve torcida en un celular angosto | requiere pantalla | `.tabs.tabsModos` en el CSS |
| La carta de dos caras cabe bien y no se ve rareta | requiere pantalla | `#tarjetaDuelo` / `.tarjetaCara` |
| La carta no se voltea al soltar el dedo después de desplazar el texto | requiere toque real | el listener de scroll de `#tarjetaDuelo` |
| Los fuegos y el aviso de fin en las 8 ramas | requiere partida completa | `abrirFin()` |
| La sala muestra al invitado a media partida | requiere dos teléfonos | `pintarSala()` |
| La carta más baja deja "Siguiente" a la vista | requiere pantalla | `#tarjeta` / `.tarjetaCara` |
| El buscador filtra la lista en las dos selecciones | requiere teclear | `#selBuscar` / `pintarSeleccion` |
| Retomar una partida de un solo celular | requiere pausar y volver | `continuarPartidaLocal()` / `roles_partida_local` |

**4. Lo único automático que se corrió:** `revisar.py` (sintaxis y nombres, exit 0
en las 6 fases) y, a mano, `<div>`/`</div>` cuadran, sin `id` repetidos y todo `id`
que pide el JS existe en el HTML.

**Bitácora:**

- (fecha) — se escribió este plan. Nada de código tocado.
- **17-oct-2026 — Fase 1 TERMINADA** (solo `Roles/index.html`; no se tocó nada más).
  **Qué se hizo:**
  - `MODO_DUELO = "duelo"` + su línea en `DESC_MODO`
    ("Sensualidad contra Erotismo, Quién Ganará ?"). Los tres modos viejos
    quedaron igual de nombre en el código (`normal`/`espejo`/`seleccionar`).
  - La fila de modos pasó a `class="tabs tabsModos"` y se le agregó `#tabDuelo`
    ("Duelo de seducción"). El CSS nuevo (`.tabs.tabsModos` + `.tabsModos .tab`)
    va **después** de `.tab.activo` y **no toca `.tabs` global**, como pide el
    riesgo 1.
  - `modalDuelo` (lado + Turnos/Juntos) y el paso desde `modalModo`: si
    `modoBaseCfg === MODO_DUELO`, "Un solo Celular"/"Cada quien en el suyo" ya no
    llaman a `preparar` sino que abren esa ventana. Los nombres de los dos lados
    salen de `nombreLado("A"/"B")`.
  - `preparar(modo, opcionesDuelo, unCelularFlag)`: el 2.º argumento **cambió de
    significado** (antes era `ladoSoloElegido` y **siempre era `null`**; las dos
    llamadas que existían lo pasaban en `null`, así que no cambia nada de lo
    viejo). Rama `MODO_DUELO` → `prepararDuelo()`, que valida parejas y R y
    **siempre** abre la selección (local o compartida).
  - `otroLadoDuelo`, `buscarPersonaje`, `contraparteDe`, `paresDisponibles`.
  - `esModoDuelo`, `dueloLadoDePartida`, `dueloModalidadDePartida`,
    `dueloEsJuntos`, `ladoDeCabeza` (junto a `modoBaseDePartida`). Casi todas las
    usan las fases siguientes; en la 1 solo se agregaron.
  - Selección del duelo reutilizando `vistaSeleccion`: banderas `selDuelo`,
    `selLadoDuelo`, `selModalidadDuelo`, `selDueloIds`; `pintarSeleccionDuelo()`,
    `cambiarMarcaDuelo()`, `abrirSeleccionDueloLocal()`,
    `abrirSeleccionDueloCompartida()`, `#selNota`, y la rama `d.modo === "duelo"`
    en `escucharSeleccion()` (antes de la de "agregar").
  - `arrancarSeleccion()` tiene su rama de duelo: valida, arma `pares[]` en el
    orden marcado y lo deja en `dueloParesListos`. **NO llama a `iniciar()`**: es
    la Fase 2, y el plan lo autoriza ("todavía puede no arrancar partida").
  - Las banderas del duelo se limpian al abrir la selección normal
    (`abrirSeleccionLocal`/`Compartida`), al cancelar (`btnSelVolver`) y cuando
    el documento de selección se apaga dentro de `escucharSeleccion`. **Eso último
    es una adición de la Fase 1** que el plan no pedía: sin ella, un teléfono que
    vio una selección de duelo y luego entra a un "agregar" se pintaría con la
    lista del duelo (riesgo 7).

  **Lo que NO está hecho todavía (importante para probar en vivo):** apretar
  "Jugar ▶" en la selección del duelo **no arranca nada todavía**. No es un bug:
  es que `poolsDuelo()` y el `dueloCfg` de `iniciar()` son de la Fase 2. La
  pareja y los invitados sí ven la lista y el contador subir; solo falta que la
  partida empiece.

  **Desviaciones del plan (manda el código):**
  1. El plan renombra `selModo` a `selModoJuego`. **No se renombró**, para no
     tocar la selección normal. Lo que sí se respetó es el **documento**: la
     selección del duelo guarda `modo:"duelo"` y `modoJuego:"pareja"|"multi"`
     (sección 4.2), y `arrancarSeleccion` usará `selModo`, que en el duelo vale lo
     mismo.
  2. El plan dice que el nombre del lado cae a "Usuario 1"/"Usuario 2". Se usa
     `nombreLado()`, que cae a **"Lado A"/"Lado B"** (es lo que ya usa toda la app
     y no choca con nada). Lo importante del plan —no mostrar "U1"/"U2"— sí se
     cumple.
  3. `arrancarSeleccion` (duelo) **no** repite el `if(pares.length !== selR)` del
     paso 4 del plan: el `for` de arriba ya devuelve el aviso en cuanto un personaje
     no tiene contraparte, así que el segundo `if` no podía cumplirse nunca.
  4. `selFuente()/selMarcosDe()/selPoolDe()` **no se usan** en la rama de duelo
     (como pide el plan). El doc de la selección del duelo **no lleva `sel`**.
  5. `prepararDuelo` devuelve en silencio si le llegan `{lado, modalidad}` con
     valores que no existen (no avisa): es un caso que solo puede dar el código.

  **Verificación hecha:** `python herramientas\sintaxis\revisar.py` en verde
  (exit 0, 23 archivos). A mano: `<div>`/`</div>` cuadran (109/109), sin `id`
  repetidos y todo `id` que pide el JS existe en el HTML. **Nada se probó en el
  navegador**: eso es la prueba en vivo de Fredy (matriz de la sección 7).

- **17-oct-2026 — Fase 2 TERMINADA** (otra vez solo `Roles/index.html`).
  **Qué se hizo:**
  - `poolsDuelo(cabezasIn, pares, lado)`: cada cabeza recibe las **R tarjetas de
    su lado, en el MISMO orden** que la otra (para que la pareja k sea la ronda k).
    Las cabezas del mismo lado reciben **copias independientes** a propósito.
  - `iniciar(modo, ladoSoloElegido, unCelularFlag, poolsListos, dueloCfg)`: 5.º
    parámetro **opcional**, así que las dos llamadas viejas siguen igual. Con
    `dueloCfg`: `modoBase` sale de `MODO_DUELO` (**no** de `modoBaseCfg`, que se
    puede haber cambiado — riesgo 6), se saltan las revisiones de listas y la
    sesión guarda `dueloLado`, `dueloModalidad` y `dueloPares` (en orden).
    Si alguien lo llamara sin `poolsListos`, los arma con `poolsDuelo`: así no
    hay ningún camino en el que un duelo se reparta por `listaDeLado`.
  - `cargarEstado()` copia `dueloLado`, `dueloModalidad` y `dueloPares`. Con eso
    `continuarPartida()`, `entrarAlJuego()` y el invitado que se une ya ven el
    duelo **sin tocar esas funciones**.
  - `arrancarSeleccion()` (duelo) ya **arranca la partida**: arma `pares` en el
    orden marcado, llama `poolsDuelo` y pasa a `iniciar` con `dueloCfg`. Se quitó
    la variable `dueloParesListos`, que en la Fase 1 solo guardaba el resultado.
  - "Saltar turno" escondido en duelo en los **dos** lados: en
    `mostrarBotonesAdmin()` (que `pintarPaso` corre en cada pasada) y en las dos
    líneas de `pintarPaso` que lo encienden. `saltarTurno()` **no se tocó**.
  - **El motor de Turnos, el sorteo, las rondas, `siguienteSesion()`,
    `sanearSesion()`, la carta normal y el volteo NO se tocaron.** Duelo en Turnos
    es el juego de hoy con otra lista repartida.

  **Lo que NO está hecho todavía (para la prueba en vivo):**
  - **Juntos** no existe: si en el modal se elige "Juntos", la partida arranca pero
    se juega **como Turnos** (el motor no sabe todavía que no hay turnos). Eso es la
    Fase 3. **No pruebes "Juntos" todavía.**
  - **"Agregar invitado" a media partida en Duelo todavía reparte mal**: cae en el
    camino viejo, que usa `listaDeLado`, y en un duelo el lado contrario juega las
    **contrapartes**, no `U1`/`U2`. Es la casilla de la **Fase 5**; no se quiso
    inventar un texto de aviso, así que **no pruebes "Agregar invitado" en duelo
    todavía** (el QR para registrar invitados sí sirve).
  - La carta de dos caras (Juntos en un celular) es Fase 4.

  **Desviaciones del plan (manda el código):** ninguna en esta fase. Lo que sí se
  apartó de lo escrito, en la Fase 1, sigue en la nota de arriba.

  **Verificación hecha:** `revisar.py` en verde (exit 0, 23 archivos); `<div>`/
  `</div>` 109/109, sin `id` repetidos, todos los `id` del JS existen. Se repasó a
  mano el camino de las 4 ramas de Turnos leyendo el código. **Nada se probó en el
  navegador**: la matriz de la sección 7 es la prueba de verdad.

- **17-oct-2026 — Fase 3 TERMINADA** (otra vez solo `Roles/index.html`).
  **Qué se hizo:**
  - `#faseDuelo` en `#vistaPlayer` (nace oculto) + `pintarFaseDuelo()`, que da los
    **tres textos** y se repinta al voltear (el texto depende de `bocaAbajo`).
  - `avanzarDueloJuntosLocal(d)`: le quita **una** carta a **todas** las cabezas y
    sube la ronda **una** vez. Termina al pasarse de R, o cuando a nadie le queda
    nada.
  - `siguienteDueloJuntos()`: en un celular en memoria; en compartido con una
    transacción que mueve todas las colas de una vez y **no toca `orden`/`turno`**
    (en Juntos no gobiernan, pero `sanearSesion()` los necesita enteros). Si la
    partida acaba, retira la invitación de la sala.
  - `pintarPasoDueloJuntos(d)`: "Ronda X de R", `Juntos`, la carta de uno, y
    **"Siguiente" solo del anfitrión**. Los demás ven
    *"Esperando a que el anfitrión avance."*
  - `btnSig` en Juntos: **sin candado de volteo** y con `esAnfitrion()`; en Turnos
    sigue igual (con el aviso de "voltea la carta").
  - `pintarVolteo()`: en Juntos el botón ya **no se apaga** al estar boca abajo.
  - `resetCarta(miId + ":" + ronda + ":" + id)`: la ronda va en la llave, o la carta
    se quedaba destapada de la ronda anterior (riesgo 3).

  **Dos cosas que se apartaron del plan, y por qué:**
  1. **Candado anti-doble-toque** (`dueloPasando`) en `siguienteDueloJuntos()`, que
     el plan no pedía. Sin él, dos toques seguidos del anfitrión avanzaban **dos**
     rondas y se saltaba una pareja entera. Rompía el invariante 4.3-6 ("en Juntos
     la ronda sube una vez por Siguiente").
  2. **El modal NO ofrece "Juntos" en "un solo celular"**: ahí se necesita la carta
     de dos caras, que es la Fase 4, y no hay forma honesta de fingirla. Se
     esconde el botón con `dueloUnCelular` y **se quita esa línea en la Fase 4**.
     El plan daba los dos botones siempre; se prefirió no dejar un botón que
     entra a una pantalla vacía.

  **Lo que NO está hecho todavía (para la prueba en vivo):**
  - **Juntos en un solo celular** (Fase 4). En ese camino el modal solo ofrece
    "Turnos".
  - La carta de dos caras, por lo tanto, tampoco existe en **Multijugador un solo
    celular** (Fase 4).
  - "Agregar invitado" a media partida en duelo sigue repartiendo mal: es la
    casilla de la **Fase 5** (ver la nota de la Fase 2).

  **Verificación hecha:** `revisar.py` en verde (exit 0, 23 archivos); `<div>`/
  `</div>` 110/110, sin `id` repetidos, todos los `id` del JS existen (se agregó
  `faseDuelo`). Se siguió a mano el camino completo de Pareja/Juntos/cada quien:
  armar → marcar → arrancar → voltear → "Siguiente" → ronda 2 → fin. **Nada se
  probó en el navegador.**

- **17-oct-2026 — Fase 4 TERMINADA** (otra vez solo `Roles/index.html`).
  **Qué se hizo:**
  - `#tarjetaDuelo` con sus dos caras (`#tarjetaDueloA` / `#tarjetaDueloB`), dentro
    de `#vistaPlayer` y después de `#flipwrap`. Nace oculta.
  - **CSS compartido, sin duplicar medidas:** el selector de la carta normal pasó
    a `#tarjeta, .tarjetaCara{...}`, y el bloque de la variante picante a
    `#blqueEspecial, .bloqueEsp{...}` (`.bloqueEsp` es la misma cosa con clase,
    porque las caras nuevas no pueden llevar el id de la carta normal).
  - `pintarFoto` → `pintarFotoEn(el, p)`: la foto se pinta en la caja que recibe
    el que llama. `pintarFoto(p)` quedó como una línea que llama a la de la carta
    normal, así que **la carta normal no cambió de comportamiento**.
  - `pintarCaraDuelo(cont, p, esp, etiqueta)`: construye la cara con
    `createElement` + `textContent` (**nunca `innerHTML` con datos de la base**),
    con la etiqueta "Original"/"Contraparte" y los cuatro bloques (situación,
    atractivo, derechos, acción).
  - `pintarDueloPar(par, ronda)`, `mostrarCaraDuelo()`, `voltearDuelo()`,
    `caraDuelo`. La carta abre mostrando **el original** y al tocarla sale la
    contraparte; al cambiar de ronda vuelve al original.
  - `especialDeLado(ronda, lado)`: la variante picante se busca **por lado**, que
    es lo que decide a qué cara va cuando la carta es compartida.
  - `pintarPasoDueloJuntos()` ya tiene las dos ramas: la de cada quien (una carta
    normal tapada) y la de un solo celular (la carta de dos caras, sin tapa, con el
    aviso "Una cara es el original; voltéenla para ver la contraparte.").
  - La rama normal de `pintarPaso` apaga `#tarjetaDuelo`, así que no quedan restos
    al volver a Turnos o a los otros modos.
  - **El modal volvió a ofrecer "Juntos" en un solo celular** (se quitó la
    restricción que se puso en la Fase 3).

  **Una cosa que se apartó del plan:** la carta de dos caras respeta el scroll
  como la normal (si la persona estaba desplazando el texto de la acción, el toque
  final **no** voltea la carta). El plan no lo pedía, pero la carta normal ya lo
  tiene por una razón igual, y sin esto la carta se volteaba sola al soltar el
  dedo después de leer.

  **Lo que NO está hecho todavía:**
  - **"Agregar invitado" a media partida en duelo sigue repartiendo mal** (usa la
    lista normal en vez de las parejas). Es la casilla de la **Fase 5**.
  - Nada de esto se ha probado en el navegador.

  **Verificación hecha:** `revisar.py` en verde (exit 0, 23 archivos); `<div>`/
  `</div>` 113/113, sin `id` repetidos, todos los `id` del JS existen (se
  agregaron `tarjetaDuelo`, `tarjetaDueloA`, `tarjetaDueloB`). Se siguió a mano el
  camino de Pareja/Juntos/un celular y de Multi/Juntos/un celular.

- **17-oct-2026 — Fase 5 TERMINADA** (otra vez solo `Roles/index.html`).
  **Qué se hizo:**
  - `agregarInvitado()`: se armó `pool` según el modo y se dejó el resto del
    bloque (la transacción, republicar la invitación y el caso de un solo
    celular) **tal cual**, para no tocar el camino viejo. En DUELO el invitado
    recibe **las parejas que faltan, en orden**: `dueloPares.slice(ronda)`, y de
    cada una se toma `par.o` o `par.c` según de qué lado está él (el lado sale de
    `conQuien`, que `construirCabezas()` ya resuelve). Con eso entra a partir de
    la ronda siguiente y su cola dura exactamente hasta la última.
    **En el camino viejo (`seleccionar` y `normal`/`espejo`) no cambió nada**: la
    lista se revuelve igual y se repite si no alcanza.
  - Se confirmó por código lo demás de la fase: los tres casos límite (sin
    contraparte, R mayor que las parejas, dos contrapartes para el mismo original)
    ya venían de la Fase 1; pausa y terminar en Juntos **no tocan `listas` ni
    `dueloPares`** (solo escriben `pausada`, o `activa`/`terminada`/`porAdmin`),
    y al reanudar `cargarEstado()` los devuelve; en Juntos un celular el invitado
    participa sin más, porque la carta es la del grupo.

  **Regresión (por código, falta en vivo):** se repasó punto por punto todo lo
  que se tocó y que es de los modos viejos. Lo que cambió para ellos es **solo
  un `if` que da falso**: `pintarFaseDuelo()` apaga `#faseDuelo` (nace oculto),
  `#tarjetaDuelo` se apaga (nace oculto), `&& !esModoDuelo()` en las dos líneas de
  "Saltar turno", y en `pintarVolteo()` el botón solo se apaga cuando NO es
  duelo. El selector CSS de la carta pasó a `#tarjeta, .tarjetaCara` con las
  mismas medidas, y `pintarFoto()` quedó como una línea que llama a
  `pintarFotoEn()`. La selección normal y "agregar invitado" no se tocaron; lo
  único es que se limpian las banderas `selDuelo*` al abrirlas.

  **Lo que NO se ha hecho:** nada del código. **Falta la prueba en vivo** de la
  matriz de la sección 7 y de la lista de abajo, que es la única verificación que
  vale aquí.

  **Verificación hecha:** `revisar.py` en verde (exit 0, 23 archivos); `<div>`/
  `</div>` 113/113, sin `id` repetidos, todos los `id` del JS existen. Se siguió a
  mano la entrada de un invitado en ronda 2 de 4 en las cuatro ramas.

- **17-oct-2026 — Fase 6 TERMINADA (documentación).**
  - `General/duelos.md`: el aviso de arriba pasó de "ESTE MODO NO EXISTE TODAVÍA"
    a **"YA EXISTE, construido 17-oct-2026"**, con la advertencia de que **falta la
    prueba en vivo**. El diseño se queda como referencia de por qué. La lista de
    "lo que hay que construir" (sección 5) quedó marcada como hecha.
  - `General/GUIA.md`, entrada de `Roles/`: ahora dice que el cuarto modo existe,
    con su descripción, sus dos modalidades, los campos de sesión (`dueloPares` y
    los demás), que **solo marca el administrador**, que "Saltar turno" no existe,
    y los punteros a `duelos.md` y `Plan-Duelo.md`. **Con la misma advertencia de
    que está pendiente de probar.** Se ajustaron los tres puntos que quedaban
    diciendo "los tres modos": la lista de modos, el interruptor de variantes
    ("cualquiera de los cuatro") y "las cuatro pestañas en 2x2". También se
    aclaró la regla de "no se puede dar Siguiente con la carta boca abajo": **en
    duelo Juntos no aplica**, para que nadie la "arregle" después.
  - `AGENTS.md`: la tabla de documentos ya no dice "AÚN NO CONSTRUIDO" del duelo
    (decía una cosa y la otra).
  - Este plan: la Fase 6 quedó con todo marcado **menos la prueba en vivo**, que es
    justo lo único que falta. Se escribió arriba la lista completa de lo que NO se
    ha probado.
  - **Decisión que se le preguntó a Fredy y como se resolvió:** el plan pedía poner
    "YA EXISTE". Se escribió **"construido, pendiente de prueba en vivo"**, porque
    el repo tiene escrito que *probado* significa que se ejecutó, no que se revisó
    (ver `GUIA.md`, *El invitado vuelve solo al abrir la app*), y decir "ya existe"
    sin haber corrido una sola partida en un celular sería mentirle al que lea el
    archivo después.

- **17-oct-2026 — Ajustes de la revisión final (2), decididos por Fredy.**
  - **Candado de RONDA en `siguienteDueloJuntos()`.** El candado `dueloPasando`
    evitaba dos transacciones a la vez, pero no dos toques seguidos si el segundo
    llegaba antes de que la pantalla se enterara del primero: eso podía saltarse
    una pareja. Ahora la transacción solo avanza si la sesión sigue en la ronda
    que este teléfono está mostrando (`rondaEsperada`).
  - **El Duelo lo arma y marca SOLO el usuario `admin` de la app**, no el
    anfitrión ocasional. Si la pareja intenta arrancarlo, sale
    *"El Duelo lo arma el administrador."* (`bloqueaDueloSinAdmin()` en los
    botones, y la misma red en `abrirModalDuelo()` y `prepararDuelo()`).
    La pantalla de escogimiento pasa a `esAdminFlag` en `chk.disabled`,
    `cambiarMarcaDuelo()` y el botón "Jugar ▶". El candado de
    `arrancarSeleccion()` se movió **después** de la rama del duelo, para que el
    admin pueda arrancar aunque no sea quien inició la selección.
  - `revisar.py` en verde (exit 0, 23 archivos) después de los dos cambios. Sigue
    **pendiente la prueba en vivo**.

- **17-oct-2026 — La carta bajó de alto (todas las pantallas de `Roles/`).**
  `#tarjeta`/`.tarjetaCara` ya no pasan de `max-height:min(56dvh,520px)`; la
  foto dejó de ser cuadrada y es un **banner 16/9** (`max-height:min(20dvh,140px)`),
  y la info se desliza **dentro** de la carta en vez de mandar un alto fijo de
  290px. El motivo: "Siguiente" quedaba muy abajo. Es la **misma** carta en
  Clásico, Cambia de Bando, Seleccionar y las dos modalidades del Duelo, así que
  aplica a todas. **Falta verlo en el celular** (sobre todo en un teléfono
  angosto y en la carta de dos caras).

- **17-oct-2026 — Buscador en la pantalla de selección.** Se agregó `#selBuscar`
  (clase `.buscar`) arriba de la lista, con filtro sin mayúsculas ni acentos
  (`normSel()`), y se limpia al abrir/cancelar cada selección (`limpiarFiltroSel()`).
  Sirve para la **selección normal y la del Duelo**, que comparten pantalla.
  Lo pidió Fredy jugando el Duelo. **Falta verlo en el celular.**

- **17-oct-2026 — Selección: "Volver" de abajo oculto y botón de azar.**
  El "‹ Volver" de abajo quedó **oculto** (`#btnSelVolver` sigue en el DOM
  porque el enlace de arriba a la derecha llama a su función para cancelar).
  En el Duelo, abajo de la nota, se agregó **"Sorpréndeme, elige por mí"**
  (`#btnSelAzar`): solo lo ve el administrador; marca **R parejas al azar**
  (el orden al azar es el orden de las rondas), suben los dos contadores y se
  enciende "Jugar"; se puede tocar otra vez para re-sortear. En la selección
  normal no se muestra. **Falta verlo en vivo.**

- **17-oct-2026 — "Un solo celular" ya se puede continuar.** Antes, "Pausar y
  Salir" solo guardaba la partida cuando era "cada quien en su celular" (la
  sesión de Firebase); en "un solo celular" no quedaba nada y al volver no salía
  el aviso de continuar. Ahora, al pausar en un solo celular, el estado se guarda
  en el **propio teléfono** (`localStorage`, clave `roles_partida_local`); al
  volver, `conPendiente()` lo detecta y ofrece **Continuar / Partida nueva**
  (`continuarPartidaLocal()`). Es local: no manda invitación ni se expone. Se
  borra al empezar una partida nueva, al "Terminar Partida" y al aceptar el fin.
  `buscarPersonaje()` tiene un respaldo que busca en las colas de la partida,
  para que la carta de dos caras de Juntos salga bien al reanudar sin conexión.
  **Falta probarlo en el celular** (pausar, volver, continuar, y que "Partida
  nueva" descarte la guardada).

- **17-oct-2026 — Cinco ajustes de la prueba en vivo (los pidió Fredy).**
  1. **Checkbox de solo lectura visible** en la selección del Duelo: se cambió
     el nativo por uno propio (teal con check oscuro) porque el deshabilitado
     pintaba el check blanco sobre blanco.
  2. **Invitado en Duelo/Juntos** entra en la **misma ronda**: `agregarInvitado`
     toma `dueloPares.slice(ronda - 1)` y permite entrar hasta la última ronda.
     En **Turnos** sigue entrando a la siguiente (`slice(ronda)`), porque no
     tiene turno en la actual.
  3. **Mensajes de fase** (`#faseDuelo`) con letra más grande y degradado
     coral→turquesa; igual el "Toca para revelar el personaje" del reverso.
  4. **Encabezado del reproductor:** `#modoPartida` ("Juntos/Turnos · Pareja/
     Multijugador") **arriba** de `#progreso` ("Ronda X de R"). En los otros
     modos queda oculto.
  5. **"contra [contraparte]"** debajo del personaje en las cartas del Duelo:
     `#contraPersonaje` en la carta normal y `.contraDuelo` en las dos caras;
     `contraDeRonda()` decide quién es el otro según el lado y la ronda.
  `revisar.py` en verde (23 archivos); `<div>`/`</div>` 115/115; sin ids
  duplicados; todos los ids del JS existen. **Falta verlo en el celular.**

**Resumen de las 6 fases:** el código del Duelo está completo en `Roles/index.html`
y `revisar.py` pasa. **Lo que falta es probarlo** (sección de arriba). No se
modificó nada más del repo: ni las reglas de Firebase, ni Clásico, ni Cambia de
Bando, ni Seleccionar, ni los JSON de fábrica, ni el catálogo.

---

## 11. Cómo retomar (para otro modelo)

Si llegas nuevo:

1. Lee `AGENTS.md` y `General/GUIA.md` (obligatorio).
2. Lee `General/duelos.md` (diseño y decisiones) y este archivo.
3. Abre `Roles/index.html` y ubica por nombre: `MODO_*`, `DESC_MODO`,
   `preparar`, `iniciar`, `cargarEstado`, `pintarPaso`, `btnSig`,
   `agregarInvitado`, `abrirSeleccionCompartida`, `pintarSeleccion`,
   `arrancarSeleccion`, `escucharSeleccion`.
4. Mira la sección **Estado de avance** y continúa desde la primera fase
   pendiente. No rehagas fases marcadas como hechas.
5. Antes de tocar: `python herramientas\sintaxis\revisar.py` para tener una
   línea base.
6. Después de cada cambio: `python herramientas\sintaxis\revisar.py`.
7. No dejes arneses ni scripts de prueba en el repo. Lo temporal vive en
   `C:\Users\Fred\AppData\Local\Temp\opencode` y se borra.
8. Si una decisión de producto no está en `duelos.md`, **pregunta a Fredy**;
   no la inventes.
9. Si te quedas sin tokens: actualiza la bitácora y deja dicho exactamente en
   qué función y línea te quedaste.

### Prompt de traspaso (copiar y pegar)

> Trabaja en `C:\Users\Fred\Documents\GitHub\Citas-de-Pareja`.
>
> **Antes de escribir una línea, lee completos y en este orden:**
> 1. `AGENTS.md`
> 2. `General/GUIA.md`
> 3. `General/duelos.md`
> 4. `General/Plan-Duelo.md` (este es tu plan de trabajo)
> 5. En `Roles/index.html`, ubica **por nombre de función** las piezas que el
>    plan cita. No confíes en los números de línea: se mueven.
>
> **Qué hacer:**
> - Implementa **solo la primera fase pendiente** de la sección
>   *Estado de avance*. No empieces Juntos si Turnos no está terminado.
> - Sigue el orden de fases: 1 → 2 → 3 → 4 → 5 → 6.
> - Al terminar cada fase: corre
>   `python herramientas\sintaxis\revisar.py`, marca los checkboxes, y
>   escribe en la bitácora qué hiciste y qué falta.
> - Si te quedas sin tokens a media fase: **no empieces otra**, actualiza la
>   bitácora y di exactamente en qué función te quedaste.
>
> **Reglas duras:**
> - No toques Clásico, Cambia de Bando ni Seleccionar.
> - No toques las reglas de Firebase.
> - No inventes decisiones de producto: si falta una, pregunta a Fredy.
> - No dejes scripts, arneses ni páginas de prueba en el repo.
> - La verificación real es en vivo (Pages y el celular de Fredy).
>
> **Lo que este plan NO trae:** el código completo. Trae el diseño, las
> funciones a tocar y los invariantes; el código se lee del archivo real.
> Si algo no cuadra entre el plan y el código, **manda el código actual** y
> anótalo en la bitácora.
