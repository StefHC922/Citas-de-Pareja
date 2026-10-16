# Plan: Juego de Roles (Roleplay)

> **oct-2026 · NADA CONSTRUIDO TODAVÍA.** Este es el plan de trabajo, por tareas.
> Mientras se desarrolla, este archivo manda. Cuando el juego esté probado en
> vivo, **se borra** y lo que valga pasa a `GUIA.md` (igual que se hizo con
> `Plan-Favores-Express.md`).
>
> **Este archivo es autosuficiente.** Si una sesión se corta por límite de
> tokens, la siguiente persona/modelo debe poder continuar leyendo **solo esto**
> (más `AGENTS.md` y `General/GUIA.md`).

---

## Cómo retomar (para la sesión siguiente)

1. Lee `AGENTS.md` y `General/GUIA.md` (es la regla de la casa: van primero).
2. Lee este archivo completo.
3. Mira **"Estado de las tareas"** (abajo) y sigue por la primera tarea `[ ]`.
4. **No vuelvas a preguntar** nada de la sección **"Decisiones tomadas"**.
5. Lo que esté en **"Pendiente de decidir"** sí se pregunta antes de aplicarlo
   (es decisión de producto).
6. Verifica con `herramientas/sintaxis/revisar.py` antes de decir "listo".

### Estado de las tareas

| Fase | Qué | Estado |
|---|---|---|
| **0** | Calco de `Opciones/` a `Roles/` y navegación | **`[x]` HECHA (oct-2026).** `revisar.py` → `0`. Sin probar en vivo (aún no hay pack `roles`, ver sección 11) |
| **1** | Contenido en Firebase + engrane ⚙️ (5 pestañas) | **`[x]` HECHA (oct-2026).** Ojo: la estructura la cambió Fredy (ver abajo). `revisar.py` → `0`. **Sin probar en vivo** |
| **2** | El turno: la tarjeta de personaje (modo Normal) | **`[x]` HECHA (oct-2026).** `revisar.py` → `0`. **Sin probar en vivo.** Ver sección 15 |
| **3** | Modos base: Normal, Espejo, Seleccionar personajes | **`[x]` HECHA (oct-2026).** `revisar.py` → `0`. **Sin probar en vivo.** Ver sección 16 |
| **4** | Multijugador e invitados a media partida | **`[x]` HECHA (oct-2026).** `revisar.py` → `0`. **Sin probar en vivo.** Ver sección 17 |
| **5** | Modo Especial (interruptor) | **`[x]` HECHA (oct-2026).** `revisar.py` → `0`. **Sin probar en vivo.** Ver sección 18 |
| **6** | Cierre: sintaxis, docs, prueba en vivo | **`[ ]` a medias.** Sintaxis y docs **hechos**; falta **la prueba en vivo** (sección 19) y borrar este plan |

**Definición de terminado:** fases 0 a 6 hechas, `revisar.py` en `0`, y la prueba
en vivo (T6.4) pasada. Entonces **se borra este plan** y lo que valga pasa a
`GUIA.md`.

> **Estado real a hoy: las fases 0 a 5 están escritas y pasan `revisar.py`.
> NADA se ha probado en vivo.** Todo lo que se sabe del juego sale de leer el
> código, no de verlo funcionar. La sección 19 tiene la lista de lo que hay que
> probar a mano.

---

## 1. Qué es

Un juego nuevo de roleplay para pareja, **hijo de `Opciones/` (Elecciones
Peligrosas)**: misma entrada por catálogo, misma licencia, mismos modos de jugar,
mismas salas, mismos invitados, mismos botones.

**Lo único que cambia es el turno.** En Elecciones Peligrosas te salen 2 opciones
y eliges una. Aquí, **a cada quien le sale una tarjeta de personaje** (con
`situacion`, `gancho`, `derechos`, `si_quieres`), tantas como rondas. No hay
eliminación: cada persona recibe **una tarjeta por ronda** y las juega todas.

| Dato | Valor |
|---|---|
| Nombre visible | **Juego de Roles** |
| Carpeta | **`Roles/`** |
| Archivo | **`Roles/index.html`** |
| Item de licencia | **`roles`** |
| Id del pack en catálogo | **`roles`** (tiene que ser igual al item) |
| Id de invitación (`juego`) | **`roles`** |
| Submenú | **Juegos** → "← Volver" a `../index.html#juegos` |
| Botón "Ir a Centro" | `../Tienda/?sec=juegos` |
| Base | Copia de `Opciones/index.html` (molde A + player) |

---

## 2. Decisiones tomadas (NO volver a preguntar)

| Decisión | Detalle |
|---|---|
| **Base del juego** | Se copia `Opciones/index.html` completo y se adapta |
| **Mapeo de personajes** | En el turno de la **persona 1** sale una tarjeta del archivo **de la persona 1**, y ella la personifica. Igual con la persona 2 |
| **Modos base (uno)** | **Normal**, **Espejo (contraparte)** y **Seleccionar personajes** |
| **Modo Especial** | **Interruptor** que se prende/apaga encima de cualquiera de los 3 modos base (no es un modo aparte) |
| **Interacción del turno** | La tarjeta se **lee** y se toca **"Siguiente"**. No se elige ni se descarta |
| **Efectos Especiales** | **Solo texto**: se muestran junto con la tarjeta. No cambian reglas del juego |
| **Contrapartes** | Viven en **el mismo documento**, ligadas por el campo `par` |
| **`par` (Opción A)** | **El `par` de una contraparte = el `id` de su normal.** El engrane lo rellena con un desplegable; el sistema **avisa** (no bloquea) si falta o sobra contraparte |
| **Imágenes** | **Opcionales, por enlace (URL)**. NO se pega la imagen dentro de la base |
| **Engrane** | **Una sola pantalla con 5 pestañas**: `Personajes 1`, `Personajes 2`, `Contrapartes 1`, `Contrapartes 2`, `Especiales` |
| **Seleccionar personajes** | Se pregunta **Número de rondas (R)**; cada quien marca **exactamente R**. Arranca solo cuando **todos** tienen R |
| **Seleccionar: qué se muestra** | Las listas muestran **normales y contrapartes** (persona 1 elige de `U1`+`C1`; persona 2 de `U2`+`C2`), con una etiqueta de cuál es cada una |
| **Reparto** | **Normal/Espejo:** se reparten R tarjetas al azar de la lista del lado (sin repetir si alcanza; si no, se permite repetir). **Seleccionar:** R tarjetas elegidas a mano |
| **Botón "Jugar solo"** | ~~EN DESARROLLO~~ **QUITADO del todo (oct-2026).** Ya no existe el botón. Quedan **solo dos**: `Jugar con Pareja` y `Multijugador`, **en el mismo renglón** |
| **La carta empieza BOCA ABAJO** | En cada turno sale primero el **reverso** (mosaico del icono) y se revela **tocando la carta**. Tocar otra vez la tapa, para poder pasar el celular sin que el otro la lea. Decidido por Fredy (oct-2026) |
| **"Jugar con Pareja"** | Uno a uno; **se esconden** QR/"Agregar invitado"/panel (solo salen en Multijugador). Siguen pausar/terminar y "un celular / cada quien el suyo" |
| **Multijugador** | Todo lo de invitados |
| **Diseño de la tarjeta** | **Opción A elegida** ("Carta con foto"): marco degradado coral→turquesa, sombra festiva, nombre en degradado. Distinto a Opciones (que no se vea copy/paste) |
| **Etiquetas de la tarjeta** | `SITUACIÓN`, **`ATRACTIVO`** (el campo `gancho`), `DERECHOS`, **`ACCIÓN`** (el campo `si_quieres`). Los **nombres internos** de los campos NO cambian: siguen siendo `gancho` y `si_quieres` |
| **Foto** | Arriba, **grande y cuadrada** (`aspect-ratio:1/1`), con marcador mientras no haya imagen |
| **Info con scroll** | El bloque de textos tiene **scroll interno** (`max-height` + `overflow-y:auto`) por si el texto no cupo. La foto queda fija arriba |
| **En la tarjeta NO se muestran** | El `id` ni el `par` (control interno) |
| **Fondo mosaico** | El **icono de la app** repetido (los que quepan) llena **solo el reverso** de la carta. En el frente **no** va: no se alcanzaba a ver y solo recargaba |
| **Carta boca abajo** | Sí. **Mismo tamaño** que la de adelante. **Se gira tocando cualquier parte** de la carta (también el texto), con guarda para no estorbar el scroll; y el botón "Voltear carta" es interruptor |
| **Contenido** | Vive **en Firebase** (no en un JSON del repo): es contenido íntimo y el repo es público |
| **Icono de la invitación** | **`🎭`** (máscaras de teatro), en `anunciarInvitacion()`. Lo elige Fredy (oct-2026). Antes era el dado `🎲` del juego original |
| **Textos de arranque** | `eyebrow` = "Cada quien su personaje"; subtítulo = "Cada quien recibe sus personajes". "A gusto" (lo decía la T0.2), se pueden cambiar |

---

## 3. Barrido: qué se toca y qué NO

### Se toca (poco)

| Pieza | Qué |
|---|---|
| `Roles/index.html` (nuevo) | El juego completo |
| `herramientas/sintaxis/extract.py` | **Agregar `("Roles/index.html", "roles")`** a `targets`, o queda sin revisar |
| `General/Modelo-Datos.md` | Documentar 2 colecciones nuevas |
| `General/GUIA.md` | Nota de mantenimiento del juego (al final) |
| `General/Roleplay.md` | Este archivo (se borra al terminar) |
| `packs` (dato, no código) | El pack del catálogo lo crea Fredy |

### NO se toca (y por qué)

| Pieza | Por qué queda intacta |
|---|---|
| `index.html` (menú) | Lee `packs` de la taquilla y muestra/oculta por la licencia del `id`. Con el pack `roles` sale solo. El `#juegos` ya existe |
| `Tienda/index.html` | Genérica: lista por `seccion` y "Abrir" usa `../ruta/`. Sale sola |
| `Autorizar/` y `Panel/` | Aprueban cualquier `item`; el catálogo lo llena Fredy |
| `acceso.js`, `taquilla.js` | Genéricos por item |
| `invitado.js`, `Diablitos/` (sala) | Genéricos: el juego publica `{juego:"roles", ruta:"Roles", sesion:"sesionRoles/actual"}` |
| `fuegos.js`, `confirmar.js`, `favor.js` | Se importan como en Opciones (el botón flotante de la esquina) |
| `config.js`, `firebase-config.js` | No se siembra fábrica; el contenido vive en la pareja |
| **Reglas de Firebase** | **NO se tocan.** La base de la pareja está abierta a propósito (`if true`) y ahí viven las colecciones nuevas. La taquilla no cambia |
| Service worker / caché | **No existe**; no hay lista de archivos que actualizar |
| `.github/` | Solo el recordatorio; no aplica |

### Hallazgos del barrido

1. No hay colisión con el nombre `roles` (revisado en todo el repo).
2. **`Opciones/index.html` tampoco está en `extract.py`** — hoy nadie lo revisa de
   sintaxis. Agregar `Roles` es **obligatorio**; agregar `Opciones` es aparte y
   opcional.
3. `Panel/catalogo.html`: el menú **salta los packs con `oficial:true`**
   (`index.html` línea ~742). El pack `roles` **NO** debe marcarse `oficial`.

---

## 4. Datos (Firebase de la pareja)

**La base de la pareja está abierta (`allow read, write: if true`), así que no hay
que tocar reglas.** Todo esto vive en ella (no en la taquilla).

### 4.1 Contenido — `personajesJuego/actual`

```
personajesJuego/actual = {
  U1: [ personaje, ... ],   // normales que personifica la persona 1
  U2: [ personaje, ... ],   // normales que personifica la persona 2
  C1: [ personaje, ... ],   // contrapartes de la persona 1
  C2: [ personaje, ... ],   // contrapartes de la persona 2
  ESP: [ { texto: "..." }, ... ],   // variantes especiales
  actualizadoEn
}
```

Un `personaje`:

```json
{
  "id": 1,
  "par": 1,
  "personaje": "El Fotógrafo",
  "situacion": "Es su sesión de fotos privada y ella es la única que está contigo.",
  "gancho": "Como fotógrafo tú decides qué pose le pones, cuánta ropa sobra y hasta dónde llega la sesión.",
  "derechos": "Tienes derecho a dirigirle cada pose con las manos y a quitarle lo que sobre…",
  "si_quieres": "Haz que pose desnuda frente a ti…",
  "imagen": ""
}
```

- `imagen` es **opcional** y es una **URL** (no base64).
- Regla **Opción A**: en `C1`/`C2`, `par` = el `id` del normal de `U1`/`U2` al que
  corresponde. El engrane lo pone solo con un desplegable.

### 4.2 Partida — `sesionRoles/actual`

Misma forma que `sesionOpciones/actual` (ver `Modelo-Datos.md`), con estos cambios:

| Campo | Uso |
|---|---|
| `listas{}` | Por jugador: la **cola de tarjetas que le faltan** (cada una es el objeto `personaje` completo). Se consume de a una en cada turno |
| `orden[]`, `turno`, `ronda`, `rondas` | Igual que Opciones (turnos aleatorios que se revuelven al dar la vuelta) |
| `modoJuego` | **Quiénes juegan**: `"solo"` \| `"pareja"` \| `"multi"`. Es el `modo` del juego original, solo que con el nombre aclarado (ver 4.2b) |
| `modoBase` | El modo del juego: `"normal"` \| `"espejo"` \| `"seleccionar"`. La FASE 2 lo escribe siempre `"normal"` |
| `especiales[]` | `[{ ronda, jugador, texto }]`, calculado **al arrancar**. Máximo **uno por ronda** |
| `especial` | `true/false` (el interruptor) |
| `seleccion` | `true/false` (el modo arrancó eligiendo a mano) |
| `activa`, `pausada`, `terminada`, `porAdmin`, `sid`, `hostUid`, `hostNombre`, `unCelular`, `reanudada`, `empezadaEn`, `actualizadaEn` | Igual que Opciones |

> **Ya NO existen** `pares` ni `eliminadas`: aquí no se escoge nada. Ver la
> sección 15.

#### 4.2b Por qué se|Partió `modo` en dos (decisión de la FASE 2, oct-2026)

El calco de `Opciones/` traía un `modo` que significaba **quiénes juegan**
(`solo`/`pareja`/`multi`), y el plan pedía usar ese mismo nombre para **otro
coso**: el modo base (`normal`/`espejo`/`seleccionar`). Dos cosas distintas con
un solo nombre es exactamente como se mezclan los datos.

| Campo | Significa | Valores |
|---|---|---|
| `modoJuego` | Quiénes juegan | `solo` / `pareja` / `multi` |
| `modoBase` | Cómo se reparten las tarjetas | `normal` / `espejo` / `seleccionar` |

**Regla para la FASE 3:** el botón de la pantalla de inicio sigue siendo el
`modoJuego` de siempre; el modo base viaja en `modoBase`. **No se volvió a usar
el nombre `modo`.**

> **Ojo con el tamaño del documento:** cada tarjeta es un objeto con texto. Con la
> pareja (2 jugadores) y rondas normales son unas decenas: cabe. Si algún día se
> juega con muchos invitados y muchas rondas, revisar el límite de 1 MiB por
> documento (ver P4 en `Modelo-Datos.md`).

### 4.3 Selección (solo modo Seleccionar, "cada quien en el suyo")

```
seleccionRoles/actual = {
  activa, sid, hostUid, rondas,          // R
  cabezas: [ {id, nombre, lado}, ... ],
  sel: { idJugador: [ idPersonaje, ... ] },  // lo que cada quien marca
  actualizadaEn
}
```

- Cada teléfono escribe **solo su** `sel[id]` y escucha el documento.
- El anfitrión ve **contadores** por jugador y enciende **Jugar** cuando todos
  tienen exactamente `rondas`.
- En **un solo celular** no hace falta: la selección es local.

### 4.4 Invitaciones — `invitaciones/roles`

Genérico (lo maneja `invitado.js`). El juego publica con:

```js
publicarInvitacion({
  juego: "roles", titulo: "Juego de Roles", icono: "<el del pack>",
  ruta: "Roles", hostUid: miId, hostNombre,
  participantes: [ids...], sesion: "sesionRoles/actual", sid
});
```

---

## 5. Diseño de la tarjeta — DEFINITIVO (Opción A)

> **Aprobado por Fredy (oct-2026). Es el diseño final; no se cambia sin preguntar.**
>
> **Esta sección es la fuente de la verdad del diseño.** La vista previa de
> trabajo (`Temp\opencode\roles-vista-previa.html`) es **desechable**: aunque se
> borre, con lo de aquí se reconstruye idéntico. El HTML y el CSS de abajo son
> **los aprobados, tal cual** (solo cambia la ruta del icono: en el juego es
> `../icon-512.png`, en la vista previa era `icon-512.png`).

### 5.1 Forma general

- **Marco**: borde **degradado coral→turquesa** y sombra festiva.
- **Foto arriba, grande y cuadrada** (`aspect-ratio:1/1`); mientras no haya
  imagen, un recuadro con marcador (`🖼️ Imagen del personaje`).
- **Nombre del personaje** debajo de la foto, grande, en degradado (Chakra Petch).
- Luego los **bloques de texto**, cada uno con su etiqueta en mayúsculas:
  - **SITUACIÓN** → campo `situacion`
  - **ATRACTIVO** → campo `gancho` *(se muestra "Atractivo"; el campo NO se renombra)*
  - **DERECHOS** → campo `derechos`
  - **ACCIÓN** → campo `si_quieres` *(se muestra "Acción"; el campo NO se renombra)*
    — lleva un **acento turquesa a la izquierda**.
- **La info tiene scroll interno** (`max-height` + `overflow-y:auto`); la foto
  queda fija arriba.
- **NO** se muestran `id` ni `par`.
- Fuera de la carta: **"Turno de *nombre*"** arriba y el botón **Siguiente** abajo.

### 5.2 Estructura (HTML) — el frente y el reverso en el MISMO recuadro

```html
<div class="flipwrap">
  <!-- FRENTE -->
  <div id="tarjeta">
    <div class="foto"><span>🖼️</span><small>Imagen del personaje</small></div>
    <div class="nombre">El Fotógrafo</div>
    <div class="info">
      <div class="bloque"><b>Situación</b><p>…</p></div>
      <div class="bloque"><b>Atractivo</b><p>…</p></div>
      <div class="bloque"><b>Derechos</b><p>…</p></div>
      <div class="bloque accion"><b>Acción</b><p>…</p></div>
    </div>
  </div>

  <!-- REVERSO (tapa al frente; mismo tamaño) -->
  <div id="reverso">
    <div class="tile"></div>                       <!-- mosaico del icono -->
    <div class="velo"></div>                       <!-- brillo radial -->
    <div class="contenido">
      <img class="marca" src="../icon-512.png" alt="Icono de la app">
      <div class="marcaTxt">Juego de Roles</div>
      <small>Toca para revelar el personaje</small>
    </div>
  </div>
</div>
```

### 5.3 Estilos (CSS) — copiar tal cual

Tokens de color de la app:

```
--bg:#120e1c; --bg-2:#1a1428; --card:#201933; --card-border:#322a4a;
--fg:#f4f1fb; --fg-muted:#a599c7; --coral:#ff6a5c; --teal:#2fd9c7; --rojo:#ff5c7a;
```

Frente:

```css
.flipwrap{ position:relative; width:100%; }

#tarjeta{ width:100%; border-radius:22px; padding:14px; display:flex; flex-direction:column;
  gap:12px; cursor:pointer; border:2px solid transparent;
  background:linear-gradient(var(--card),var(--card)) padding-box,
             linear-gradient(135deg,var(--coral),var(--teal)) border-box;
  box-shadow:0 18px 50px rgba(0,0,0,.5), 0 0 30px rgba(47,217,199,.10); }

.foto{ width:100%; aspect-ratio:1/1; border-radius:16px;
  background:linear-gradient(135deg,#2b2144,var(--bg-2)); border:1px dashed var(--card-border);
  display:flex; flex-direction:column; gap:6px; align-items:center; justify-content:center;
  color:var(--fg-muted); }
.foto span{ font-size:3rem; opacity:.5; } .foto small{ font-size:.72rem; }

.nombre{ font-family:'Chakra Petch',sans-serif; font-weight:700; font-size:1.55rem; text-align:center;
  background:linear-gradient(90deg,var(--coral),var(--teal)); -webkit-background-clip:text;
  background-clip:text; color:transparent; width:fit-content; align-self:center; }

.info{ display:flex; flex-direction:column; gap:10px;
  max-height:min(38dvh, 290px); overflow-y:auto; padding-right:6px; }
.bloque b{ display:block; font-family:'Chakra Petch',sans-serif; font-size:.66rem; letter-spacing:.16em;
  text-transform:uppercase; color:var(--fg-muted); margin-bottom:3px; }
.bloque p{ margin:0; font-size:.9rem; line-height:1.5; color:var(--fg); }
.bloque.accion{ border-left:2px solid var(--teal); padding-left:9px; }
.bloque.accion p{ color:#c9f6ef; }
```

Reverso (mismo recuadro, con el mosaico del icono):

```css
#reverso{ position:absolute; inset:0; border-radius:22px; cursor:pointer; display:none;
  overflow:hidden; border:2px solid transparent;
  background:linear-gradient(var(--bg-2),var(--bg-2)) padding-box,
             linear-gradient(135deg,var(--coral),var(--teal)) border-box;
  box-shadow:0 18px 50px rgba(0,0,0,.5); }

.tile{ position:absolute; inset:0; z-index:0;
  background-image:url(../icon-512.png); background-repeat:repeat; background-position:center;
  background-size:64px 64px; opacity:.17; }

.velo{ position:absolute; inset:0; z-index:0;
  background:radial-gradient(circle at 50% 42%, rgba(47,217,199,.22), rgba(18,14,28,.66) 68%); }

.contenido{ position:absolute; inset:0; z-index:1; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:14px; color:var(--fg-muted); }
.marca{ width:34%; max-width:150px; border-radius:22px;
  filter:drop-shadow(0 12px 30px rgba(0,0,0,.6)); }
.marcaTxt{ font-family:'Chakra Petch',sans-serif; font-size:.72rem; letter-spacing:.28em;
  text-transform:uppercase; color:#eae6f6; }
#reverso small{ font-size:.78rem; text-align:center; padding:0 24px; color:#d9d2ee; }
```

El botón **Siguiente** usa el estándar de la app: `width:100%; padding:16px;
border-radius:14px; degradado coral→turquesa; color:var(--bg); Chakra Petch 700;
font-size:1rem`.

### 5.4 El volteo (JS) — interruptor en los dos sentidos

```js
var bocaAbajo = false, ignoraClick = false, tScroll = null;

// Al deslizar la info se marca; el clic inmediato NO voltea.
info.addEventListener("scroll", function(){
  ignoraClick = true;
  clearTimeout(tScroll);
  tScroll = setTimeout(function(){ ignoraClick = false; }, 320);
});

// Toca CUALQUIER parte de la carta para voltear (respetando el scroll de la info).
tarjeta.addEventListener("click", function(){ if(ignoraClick) return; voltear(); });
reverso.onclick = voltear;          // reverso -> revela
// botón "Voltear carta" = mismo interruptor

function voltear(){ bocaAbajo = !bocaAbajo; pintar(); }

function pintar(){
  if(bocaAbajo){
    tarjeta.style.visibility = "hidden";   // deja el alto (mismo tamaño)
    reverso.style.display = "block";
  }else{
    tarjeta.style.visibility = "visible";
    reverso.style.display = "none";
  }
}
```

**Por qué `visibility` y no `display` en el frente:** así el frente **sigue
definiendo el alto** y el reverso (`inset:0`) queda **exactamente del mismo
tamaño**. Si se ocultara con `display:none`, el recuadro se encogería.

### 5.5 Estados

- **Tu turno:** la carta (o el reverso, si está boca abajo) + botón **Siguiente**.
- **Turno ajeno:** se ve solo **"Turno de *nombre*…"** (reusar `#esperaTurno` de
  `Opciones/`: recuadro con degradado, borde y `border-radius:24px`; se enciende
  con `display:"flex"`, no `"block"`).
- **Fin:** el modal de fin con fuegos (heredado de Opciones).

### 5.6 Reglas y notas

- Los campos en Firebase **conservan sus nombres** (`gancho`, `si_quieres`); solo
  cambia la **etiqueta visible**.
- El **frente NO lleva mosaico** (no se veía y recargaba): el mosaico es **solo
  del reverso**.
- En el **reverso** el mosaico va con opacidad **~0.17** + velo radial turquesa;
  al centro, el icono de marca + "Juego de Roles" + "Toca para revelar el
  personaje".
- El icono es el de la app que ya existe: **`icon-512.png`** en la raíz. Desde
  `Roles/` la ruta es **`../icon-512.png`**.

---

## 6. Tareas, una por una

> Cada tarea: qué, en qué archivo, cómo se sabe que quedó y cómo se verifica.
> Copiar/editar `Roles/index.html`; **no hay build, no hay npm** (ver `AGENTS.md`).

### FASE 0 — Calco y navegación

- [x] **T0.1 Crear la carpeta.** Copiar `Opciones/index.html` a `Roles/index.html`.
  - Verificación: `Roles/` tiene `index.html` con el juego completo.
- [x] **T0.2 Renombrar lo de licencia/sesión/login.** Dentro de `Roles/index.html`:
  - `<title>` → `Juego de Roles`; encabezado/`eyebrow` a gusto.
  - `const ITEM_ID = "roles";` y `const JUEGO_INV = "roles";`
  - `opcionesRef()` → doc `personajesJuego/actual` (renombrar a `personajesRef()`).
  - `sesionRef()` → doc `sesionRoles/actual`.
  - `anunciarInvitacion`: `ruta:"Roles"`, `titulo:"Juego de Roles"`,
    `sesion:"sesionRoles/actual"`.
  - `JUEGO_TITULO` → `Juego de Roles`.
  - `console.error("Opciones arranque"…)` → `"Roles arranque"`.
  - Verificación: busca en el archivo `Opciones`, `opcionesJuego`, `sesionOpciones`
    y **no deben quedar**.
- [x] **T0.3 Navegación.**
  - "← Volver" → `href="../index.html#juegos"`.
  - Botón "Ir a Centro de Adquisiciones" (`btnTienda`) → `../Tienda/?sec=juegos`.
  - Verificación: se ve el enlace correcto en el HTML.
- [x] **T0.4 Registrar en el chequeo de sintaxis.**
  - En `herramientas/sintaxis/extract.py`, agregar dentro de `targets`:
    `("Roles/index.html", "roles"),`
  - Verificación: `python revisar.py` lo lista.
- [x] **T0.5 Correr sintaxis.**
  - `cd herramientas\sintaxis` → `python revisar.py` → debe salir `0`.
- [x] **T0.6 Conservar imports y helpers de Opciones.** No borrar (se siguen
  usando): `../acceso.js`, `../invitado.js`, `../fuegos.js`, `../confirmar.js`,
  `../favor.js` (y su llamada `try{ montarFavor(); }catch(e){}`), `../config.js`,
  `../taquilla.js`, `../firebase-config.js`, los helpers `abrirModal`/`cerrarModal`
  y el bloque de licencia/cortesía. Solo se **cambian** los nombres/rutas de la
  T0.2; el resto queda igual.

#### Lo que seagrego en la FASE 0, y por que

La T0.2 pide buscar `Opciones` y que **no quede nada**. Para que el chequeo de la
sesion siguiente sea de fiar (y no encuentre una parede de falsos positivos), se
renombraron tambien los **nombres de funcion** que llevaban el nombre del juego
original, sin cambiar su comportamiento:

| Antes | Ahora |
|---|---|
| `opcionesRef()` | `personajesRef()` |
| `cargarOpciones()` | `cargarContenido()` |
| `guardarOpciones()` | `guardarContenido()` |
| `repartirOpciones()` | `repartirCartas()` |

**Lo que NO se renombro (y es lo reemplaza la FASE 1, no la 0):** la variable
`opciones` y la forma `{ A:[], B:[] }`. Siguen siendo el modelo del juego
original, porque en la Fase 0 todavia no existe el modelo de personajes. En
`Roles/index.html` hay un comentario que lo dice, junto a la variable, para que
nadie lo tome por el modelo final.

> **Al escribir el codigo, usar acentos solo dentro de texto visible.** Los
> nombres (`personajesJuego`, `sesionRoles`, `personajesRef`…) van **sin
> acentos y sin mayusculas**: son los mismos que usa la base de datos y los
> campos del objeto `personaje` (`gancho`, `si_quieres`), que **tampoco** se
> renombran aunque en la carta se lean "ATTRACTIVO" y "ACCION".

**Icono de la invitacion:** quedo **`"🎭"`** (mascaras de teatro), elegido por
Fredy, en `anunciarInvitacion()` dentro de `Roles/index.html`. Antes era el dado
`"🎲"` del juego original. Ese es el icono que ve el invitado en la sala.

**Lo que falta para verlo en vivo:** el pack `roles` en el catalogo (seccion 11).
Mientras Fredy no lo cree, `Roles/index.html` existe pero **no aparece en el
menu** y no se puede abrir desde la app.

### FASE 1 — Contenido y engrane ⚙️

> **OJO: la estructura que pide este plan (5 pestañas) NO es la que quedó.**
> Fredy la cambió el oct-2026 antes de que se escribiera una línea. Ver
> *"El engrane: como quedo al final"* mas abajo, que es lo que manda.

- [x] **T1.1 Modelo y carga/guardado.**
  - Variable `personajes = { U1:[], U2:[], C1:[], C2:[], ESP:[] }`.
  - `cargarPersonajes()` / `guardarPersonajes()` sobre `personajesJuego/actual`.
  - Verificación: se guarda y se vuelve a leer.
- [ ] **T1.2 Engrane de 5 pestañas.** Reusar el estilo de pestañas/tabla de Opciones
  (`Opciones/index.html` líneas ~236-252 y CSS `.tabs/.tab/.tablaBox`).
  - Pestañas: `Personajes 1`, `Personajes 2`, `Contrapartes 1`, `Contrapartes 2`,
    `Especiales`.
  - Verificación: se cambia de pestaña y cambia la lista.
- [ ] **T1.3 Fila + detalle del personaje.**
  - Cada fila muestra **solo el `personaje`** y un botón que abre un **detalle**
    (modal) con los 8 campos: `personaje`, `situacion`, `gancho`, `derechos`,
    `si_quieres`, `imagen`, `par`, `id`.
  - El `id` se asigna solo (no se teclea). El `par` es un **desplegable** que
    lista los normales del mismo dueño (`C1` ↔ `U1`; `C2` ↔ `U2`).
  - **Borrar** con `confirmar()` (regla de la casa: el ✕ no borra de una).
  - Verificación: crear, editar, borrar y que se guarde.
- [ ] **T1.4 Buscador, agregar y "Pegar lista completa".**
  - Copiar el patrón de Opciones (`.buscar`, `.filaAdd`, `.pegarBox`).
  - "Pegar": acepta un arreglo JSON de objetos (los 8 campos) **o** texto; en las
    pestañas de contrapartes el `par` sale del JSON o del desplegable.
  - En `ESP`, "Pegar" acepta strings (una variante por línea) o `{texto}`.
  - Verificación: pegar un JSON de prueba llena la tabla.
- [ ] **T1.5 Avisos de correspondencia (Opción A).** Solo **avisar**, no bloquear:
  - una contraparte cuyo `par` no existe como normal del mismo dueño;
  - un normal sin contraparte, o con más de una.
  - Verificación: con datos incompletos, sale el aviso.
- [ ] **T1.6 Pestaña Especiales.** Filas de texto (como las opciones de Opciones),
  agregar/editar/borrar. Verificación: se guarda en `ESP`.

### FASE 2 — El turno: la tarjeta (modo Normal)

- [x] **T2.1 Reparto de tarjetas.** `repartirTarjetas(cabezasIn, fuente, R)`:
  - Normal/Espejo: por lado, R tarjetas al azar de `U1`/`U2` (o `C1`/`C2`). Sin
    repetir si alcanza; si no, se permite repetir. Se guardan en `listas[jugador]`
    como cola.
  - **Tope de rondas (igual que Opciones):** `R` es mínimo 2 y **no puede pasar de
    la lista más corta** que se vaya a usar; si se pasa, sale `aviso(...)`. Cada
    lista del lado necesita **al menos 2** tarjetas.
  - Verificación: cada jugador trae R tarjetas.
- [x] **T2.2 Pantalla de la tarjeta.** Reemplazar `.cards`/`.pickRow` (par A/B) por
  la **tarjeta** de la **Opción A** (sección 5): foto cuadrada arriba + info con
  scroll, etiquetas SITUACIÓN / ATRACTIVO / DERECHOS / ACCIÓN. Muestra la
  **primera** tarjeta de `listas[quienTieneElTurno]`.
  - No muestra `id` ni `par`. Botón **Siguiente**.
- [x] **T2.3 Lógica del turno.** `avanzarTarjeta()`:
  - quita la tarjeta jugada (`listas[id].shift()`), avanza turno (reusar
    `siguienteTurno()` de Opciones: revuelve el orden al dar la vuelta y sube
    `ronda`).
  - Si el jugador no tiene más tarjetas, queda fuera del ciclo.
  - Si **todos** se quedaron sin tarjetas → `terminada = true` → fin con fuegos.
  - Verificación: se juega una partida Normal de principio a fin (un celular).
- [x] **T2.4 Turno ajeno.** En vez de la tarjeta del otro, mostrar "Turno de
  *nombre*…" (y, si el diseño lo pide, la carta boca abajo). Reusar `#esperaTurno`.

### FASE 3 — Modos base

- [x] **T3.1 Espejo (contraparte).** Igual que Normal pero el reparto sale de
  `C1`/`C2`. La tarjeta muestra el mismo diseño.
  - Verificación: modo Espejo completo.
- [x] **T3.2 Seleccionar personajes (un celular).**
  - Pantalla de selección con **pestañas por jugador/ invitado**; cada lista
    muestra `U*`+`C*` con **etiqueta** de normal/contraparte y una casilla.
  - Botón **Jugar** apagado (`display:none`/disabled) hasta que **todos** tengan
    exactamente `R` marcados.
  - Al arrancar, `listas[j]` = las R elegidas.
- [x] **T3.3 Seleccionar (cada quien en el suyo).**
  - Documento `seleccionRoles/actual` (sección 4.3). Cada teléfono escribe su
    `sel[id]`; el anfitrión ve contadores y habilita Jugar cuando todos tienen R.
  - Verificación: dos celulares marcan y el admin ve los números cuadrar.

### FASE 4 — Multijugador e invitados

- [x] **T4.1 Salas e invitaciones.** Verificar que la publicada usa
  `juego:"roles"`, `ruta:"Roles"`, `sesion:"sesionRoles/actual"` y que la sala
  (`Diablitos/`) muestra la carta y el `?entrar=1` deja entrar (todo heredado).
- [x] **T4.2 Agregar invitado a media partida (automático).**
  - Regla base (ver `General/Invitado-a-media-partida.md`): **no juega la ronda en
    curso**; entra con `R − ronda` tarjetas y **no** se mete al `orden` actual
    (entra cuando el orden se revuelve).
  - Normal/Espejo: se le reparten `R − ronda` al azar de la lista de **su lado**
    (`conQuien`).
- [x] **T4.3 Invitado en Seleccionar.** Se le muestra **su** lista (`U*`+`C*`) y
  **él marca** `R − ronda` tarjetas; eso forma su `listas[id]`.

### FASE 5 — Especial (interruptor)

- [x] **T5.1 Interruptor + número.** En la pantalla de inicio, un interruptor
  "Especial"; al prenderlo, preguntar **"¿cuántas veces?"** (K).
  - Validar `1 ≤ K ≤ R` (máximo una por ronda).
- [x] **T5.2 Reparto.** Al arrancar, elegir **K rondas distintas** al azar y, en
  cada una, **un jugador** que participe en esa ronda; guardar
  `especiales: [{ronda, jugador, texto}]` en la sesión (así todos ven lo mismo).
  - Un invitado que entra **a media partida** no alcanza especiales ya sorteados.
    Es correcto y no rompe nada (solo aplica de ahí en adelante si se quisiera).
- [x] **T5.3 Mostrar.** En el turno de ese jugador en esa ronda, la variante sale
  **junto con la tarjeta**, claramente marcada (solo texto).
- Verificación: con K=2 y 4 rondas, salen 2 variantes, nunca 2 en la misma ronda.

### FASE 6 — Cierre

- [x] **T6.1 Sintaxis.** `python revisar.py` (en `herramientas\sintaxis`) → `0`.
  **Repetido al cerrar cada fase:** 22 archivos, ninguno con problemas.
- [x] **T6.2 Documentar.** Agregadas las 3 colecciones a
  `General/Modelo-Datos.md` (**sección 1b**, nueva) y la nota del juego a
  `General/GUIA.md` (*Notas de mantenimiento*, junto a la de `Opciones/`).
- [ ] **T6.3 Borrar este plan** cuando el juego esté probado.
  **NO se borra: el juego no se ha probado todavía.** Solo se borra cuando toda
  la lista de la sección 19 tenga palomita.
- [ ] **T6.4 Prueba en vivo** (Pages + celulares de Fredy). **No se puede hacer
  desde el entorno**: no hay navegador ni celular. Los pasos van en la
  **sección 19**.

---

## 7. Cómo verificar (sin navegador)

- **Sintaxis (lo único automático):** `herramientas/sintaxis/`, orden
  `extract.py` → `jscheck.py`. Se usa `revisar.py`, que hace las dos cosas:
  ```powershell
  cd herramientas\sintaxis
  python revisar.py
  ```
  **Nunca** pasarle un `.html` a `jscheck.py` (cuenta también el CSS y da "OK" por
  casualidad). Ver `AGENTS.md`.
- **Lo demás es en vivo** (Pages y el celular). Regla dura: **máximo 3 intentos**
  por forma de probar; si no sale, se cambia de forma o se anota como pendiente.

## 8. Pendiente de decidir (preguntar antes de aplicar)

1. **¿Avisos por Telegram** al invitar/empezar? (Opciones no manda; propuesta: no).
2. ~~¿La carta empieza boca abajo en cada turno…?~~ **RESUELTO (oct-2026):**
   **sí, boca abajo**, se revela al tocarla. Ver "Decisiones tomadas". El
   volteo es un interruptor en los dos sentidos.
3. ~~La pantalla de inicio~~ **RESUELTO (oct-2026):** Fredy confirmó el
   orden — **quiénes juegan arriba, rondas en medio, modos abajo** (sección 16) —
   y que el interruptor de **Especial va abajo de todo**, después de los modos
   (sección 18). **Nada más pendiente en esta pantalla.**
4. **¿Agregar también `Opciones/index.html` a `extract.py`?** (hoy no se revisa).
   **No se hizo en la FASE 0**: es un cambio aparte, del juego viejo, y la regla
   de "cambios mínimos" manda. Queda abierto.
5. ~~El icono del pack en el catálogo~~ **RESUELTO a medias (oct-2026):** el
   icono de la **invitación** ya es **`🎭`** (decidido por Fredy). Lo que sigue
   en manos de Fredy es el **emoji del pack en el Panel** y el texto de la
   descripción: que sean el mismo o no, es cosa suya (sección 11).
6. Textos exactos de los encabezados de las 5 pestañas del engrane.

## 9. Recordatorios de la casa (no olvidar)

- Reglas de la casa en `AGENTS.md`: **preguntar** lo de producto, **cambios
  mínimos**, **verificar antes de decir "listo"**, y **documentar** en `GUIA.md`.
- **No** `confirm()` ni `alert()`: todo por `confirmar()` / `aviso()`.
- Un botón que JS oculta **nace oculto** (`style="display:none"`).
- **No** tocar las reglas de Firebase ni el modo invitado.
- Un juego va en **un** submenú; "Volver" siempre **arriba a la derecha**.

---

## 10. Pantalla de inicio y elección de modo

> **OJO: esta propuesta fue CORREGIDA por Fredy (oct-2026) y ya no manda.**
> Confirmó otro orden: **quiénes juegan arriba, rondas en medio, modos abajo**,
> con las rondas en tamaño mediano. Ver la **sección 16**. Lo que sigue se
> conserva solo para entender de dónde salió.

Hoy `Opciones/` tiene: **Número de rondas** + botones **Jugar solo / Jugar con
Pareja / Multijugador**. Para Roleplay hay **tres ejes** que elegir:

1. **Quiénes juegan:** Solo / Pareja / Multijugador (igual que Opciones).
2. **Modo base:** Normal / Espejo / Seleccionar personajes (**uno solo**).
3. **Especial:** interruptor + **"¿cuántas veces?"** (K).

**Propuesta de orden en pantalla:**

- Arriba: **Número de rondas (R)**.
- En medio: **Modo** — 3 botones tipo pestaña (`Normal` · `Espejo` · `Seleccionar`).
- Debajo: interruptor **Especial**; si se prende, aparece un campo chico
  **"¿cuántas veces?"** (K).
- Abajo: los 3 botones de quiénes juegan:
  - **Jugar solo** → `aviso("…en desarrollo")` y **no** arranca.
  - **Jugar con Pareja** → ventana "un celular / cada quien" y arranca.
  - **Multijugador** → ventana "un celular / cada quien" y arranca.

Si el modo es **Seleccionar**, después de elegir quiénes juegan va la pantalla de
selección (T3.2 / T3.3) antes de la partida.

> **Pendiente de confirmar** con Fredy (sección 8). El resto del plan **no**
> cambia según el orden que se elija.
>
> **Ya confirmado: esto ya no manda.** Ver sección 16. Lo único que sigue
> abierto de esta pantalla es **dónde va el interruptor de Especial** (Fase 5).

---

## 11. Lo que hace Fredy en el Panel (manual, sin código)

En **Panel → Catálogo → Juegos**, crear el pack:

| Campo | Valor |
|---|---|
| **ID** | `roles` (tiene que ser igual al item del juego) |
| **Título** | `Juego de Roles` |
| **Icono** | el que elija de la lista de Juegos |
| **Descripción** | una corta, a gusto |
| **Ruta** | `Roles` |
| **Sección** | `Juegos` |
| **Orden** | el que quiera |
| **Activo** | sí |
| **`oficial`** | **NO** marcarlo (el menú salta los packs `oficial:true`) |

Luego, para probarlo: **pedir el acceso** desde el Centro (sección Juegos) y
**aprobarlo** en `Autorizar/`. Con el pack `roles` y la licencia del item `roles`,
la tarjeta aparece sola en el submenú Juegos.

---

## 12. Primer paso sugerido (para arrancar)

1. Hacer **toda la FASE 0** (T0.1 → T0.6) y correr `revisar.py` → `0`. Queda un
   "clon" de Opciones que abre con licencia, sin features nuevas.
2. Seguir con **FASE 1** (contenido + engrane), que es la que destraba lo demás.

---

## 13. El engrane: cómo quedó al final (decisión de Fredy, oct-2026)

> **Esto sustituye a la T1.2 del plan.** El plan pedía **5 pestañas** para
> todos: `Personajes 1`, `Personajes 2`, `Contrapartes 1`, `Contrapartes 2`,
> `Especiales`. **No se hizo así.** Fredy lo pidió distinto antes de que se
> escribiera una línea, y así quedo.

### Cómo quedó

```
[ <nombre del usuario> ]   [ Especiales ]
      (solo el administrador:)
      [ Ver los de <el otro> ]
      (dentro del usuario:)
      [ Personajes ]   [ Contrapartes ]
      🔍 buscador
      tabla con scroll
      [ + agregar ]
      Pegar lista completa
      [ avisos de contrapartes ]
```

| Pieza | Qué es |
|---|---|
| Las dos pestañas de arriba | El **usuario** (con su nombre real, no "1"/"2") y **Especiales** |
| `btnCambiarLado` | **Solo el administrador.** Le deja ver el lado del otro para dejar todo listo desde un solo celular. Los demás usuarios del grupo **no lo ven** y no tocan el contenido ajeno |
| Las dos sub-pestañas | **Personajes** (`U1`/`U2`) y **Contrapartes** (`C1`/`C2`) |
| `subCfg` | `"U"` o `"C"` |
| `ladoCfg` | `"1"` (administrador) o `"2"` (pareja) |
| `claveCfg()` | Devuelve la lista que se está viendo: `"U1"`, `"U2"`, `"C1"`, `"C2"` o `"ESP"` |

**El reparto de lados** es el del juego original: **lado A = administrador =
usuario 1**, **lado B = pareja = usuario 2**. Es el mismo `nombreLado("A")` /
`nombreLado("B")` y el mismo `construirCabezas()` que ya traía el calco.

**Cada persona arma lo suyo**, y el administrador puede cambiar de lado.

### Lo demás que se decidió aquí

| Decisión | Detalle |
|---|---|
| **La fila NO se edita en la fila** | Muestra solo el nombre. Se abre el **detalle** tocando la caja o el lapicito ✎ |
| **El ✕ no borra de una** | En Especiales el ✕ pregunta con `confirmar()`. En personajes el borrado está **dentro del detalle**, también con `confirmar()` |
| **Agregar abre el detalle** | El `+` crea al personaje con el nombre escrito y abre el detalle para completar los otros campos. Si se cancela, el nombre queda |
| **`par` solo en contrapartes** | El desplegable lista los normales **del mismo dueño** (`C1` ↔ `U1`, `C2` ↔ `U2`). En un personaje normal ese campo ni aparece |
| **Los `id` no se teclean** | Se asignan solos. Al pegar un JSON, un `id` repetido se corre al siguiente libre en vez de pisar |
| **Los avisos de `par` NO bloquean** | Son una caja al pie del engrane (`#cfgAvisos`), que nace oculta |
| **Los duplicados se ignoran** | Al escribir y al pegar, sin distinguir mayúsculas |

### Lo que NO se pudo comprobar

- **Nada se probó con la base de verdad.** No hay navegador en el entorno: el
  engrane está verificado por `revisar.py`, por revisar el código a mano y por
  contar `<div>`/`</div>` y ids repetidos. **Que escriba y vuelva a leer es lo
  primero que hay que probar** (T1.1), y conviene probarlo **antes** de seguir
  con la FASE 2, para no amontonar fases encima de un bug de esta.
- **El pack `roles` en el catálogo** lo crea Fredy (sección 11). Sin eso la
  pantalla no aparece en el menú y no hay forma de abrirla desde la app.

---

## 14. Estado al terminar la FASE 1 (qué quedó y qué falta)

| Tarea | Estado |
|---|---|
| T1.1 Modelo, carga y guardado | `[x]` escrito, **sin probar** |
| T1.2 Engrane | `[x]` escrito, con la estructura nueva de la sección 13 |
| T1.3 Fila + detalle (los 8 campos) | `[x]` |
| T1.4 Buscador, agregar y pegar | `[x]` |
| T1.5 Avisos de correspondencia | `[x]` (solo avisan, nunca bloquean) |
| T1.6 Pestaña Especiales | `[x]` |

**Verificación automática:** `python revisar.py` → `0` (22 archivos).
**Verificación a mano (al cerrar la FASE 1):** `<div>`/`</div>` cuadrados
(72/72), 0 ids repetidos, 0 ids que usa el JS y no existen, y los botones que
el JS esconde **nacen ocultos**.

### El puente con el juego (a quién le toca)

`cargarContenido()` le armaba sus dos listas de texto plano a partir de `U1` y
`U2` para que la partida todavía arrancara. **La FASE 2 borró ese puente**: la
partida ya reparte la tarjeta entera desde `U1`/`U2`. Ese puente **no hay que
volverlo a escribir** en la FASE 3.

---

## 15. FASE 2 — Lo que cambió en el turno (oct-2026)

### Lo que se borró del juego anterior

`pares` y `eliminadas` **desaparecieron** de la sesión y de la memoria. En el
juego viejo cada ronda armaba una pareja de opciones y se escogía una; aquí **no
se elige nada**, se lee la tarjeta y se pasa. `listas` pasó de ser una lista de
**textos** a ser la **cola de tarjetas** de cada quien, y cada elemento es el
objeto `personaje` completo.

Con eso se fueron: `parDe()`, `aplicarPick()`, `pickSesion()`, `#cardsRow`,
`#opA`, `#opB`, `#pickRow`, `#btnPickA`, `#btnPickB` y la variable `opciones`
(junto con `cargarContenido()`, el puente de la FASE 1).

`siguienteTurno()` **se quedó tal cual** y ya servía: su `alive` miraba
`listas[id].length > 0`, que en el juego viejo significaba "le queda más de una
opción" y aquí significa "le queda alguna tarjeta". Sin cambios.

### Lo nuevo

| Pieza | Qué hace |
|---|---|
| `fuenteDeModo(modo)` | Devuelve `{A, B}` con la lista de la que se reparte. Hoy solo `"normal"` (sale de `U1`/`U2`); la FASE 3 mete `"espejo"` y `"seleccionar"`. **Ojo con los dos "modos":** en la sesión, `modoJuego` es **quiénes juegan** (pareja/multi, lo que ya traía el calco) y el modo base se llama **`modoBase`**. **No se reutilizó el nombre `modo`** |
| `repartirTarjetas()` | El reparto de R tarjetas por lado (el que antes era `repartirCartas`) |
| `avanzarTarjeta(d, headId)` | Quita la jugada (`shift()`) y pasa el turno. Si no queda nadie con tarjetas → `terminada` |
| `siguienteSesion()` | La escritura compartida (era `pickSesion`): dentro de `runTransaction` |
| `pintarTarjeta(p)` / `pintarFoto(p)` | Llena la carta. Si el enlace de la imagen falla, cae al marcador 🖼️ (con `onerror`) |
| `resetCarta(nueva)` / `voltear()` / `pintarVolteo()` | El volteo, como interruptor en los dos sentidos |
| `#btnSig` | El botón **Siguiente** |
| `#tarjetaVacio` | Lo que sale cuando te toca pero ya no tienes tarjetas |

### El volteo: el detalle que casi sale mal

`resetCarta()` se llama en **cada repintado** (llega lo del otro teléfono, se
repinta la sala, etc.). La primera versión le pasaba `true` a mano, y eso
significaba que **cualquier repintado volvía a tapar la carta que estabas
leyendo**. La versión correcta solo toca el interruptor **cuando la clave de la
tarjeta cambia** (`jugadorId + ":" + idPersonaje`); si no cambia, respeta el
interruptor.

`iniciar()` pone `cartaActual = null`, para que una partida nueva no arranque
con la carta de la partida anterior ya volteada.

### Un detalle ya resuelto que conviene no romper

La regla de la casa de "un botón que JavaScript tiene que ocultar **nace
oculto**" también aplica a la tarjeta. `#flipwrap`, `#btnSig` y `#tarjetaVacio`
nacen con `display:none`. `#reverso` **no**: se oculta por CSS (`display:none` en
su regla), que es exactamente como viene en el diseño aprobado de la sección 5.

### Lo que NO se probó

Nada se ha visto en un navegador. En concreto falta confirmar:

- Que la carta se vea bien y que el scroll de la info **no** voltee la carta.
- Que el reverso quede **exactamente** del mismo tamaño que el frente (de eso
  depende el `visibility:hidden` en vez de `display:none`).
- Que una partida Normal se juegue completa en **un celular**, de principio a
  fin, con fuegos al final.
- El icono del reverso: sale `../icon-512.png`, o sea desde la raíz.

### Lo que le toca a la FASE 3

- Meter los otros dos modos en `fuenteDeModo()` y en la pantalla de inicio.
  **Hecho en la FASE 3**: `fuenteDeModo()` ya no existe; lo reemplaza
  `listaDeLado()`. Ver la sección 16.
- En modo **Seleccionar**, `listas` deja de salir de `repartirTarjetas()` y pasa
  a ser lo que la gente marque a mano. **Hecho en la FASE 3.**
- `iniciar()` hoy tiene `modoBase: MODO_NORMAL` fijo: ahí se cambia. **Hecho en
  la FASE 3.**

---

## 16. FASE 3 — Los tres modos (oct-2026)

### La pantalla de inicio: el orden que confirmaste

**No es el del plan.** Fredy lo confirmó así el oct-2026:

```
¿CÓMO VAS A JUGAR HOY?
  [Jugar con Pareja]  [Multijugador]      ← los dos en el mismo renglón

NÚMERO DE RONDAS
        ( 3 )            ← tamaño MEDIANO

MODO
  [ Normal ] [ Espejo ] [ Seleccionar ]
  (una frase centrada que explica qué hace ese modo)

ESPECIAL
  [ ] Ponle un toque personal a tu juego
```

> El plan (sección 10) ponía el orden al revés. **Manda esto.** El interruptor
> de **Especial** sigue sin poner: es de la FASE 5, y lo más lógico con este
> orden es **abajo de todo**, después de los modos (ver sección 8, punto 3).

| Cambio | Detalle |
|---|---|
| **Rondas más chicas** | `.rondasInput` pasó de `2.2rem` a **`1.4rem`**, porque ya no es lo más importante de la pantalla (arriba está "quiénes juegan"). Es una excepción a la tabla de medidas de `AGENTS.md`, **pedida por Fredy** |
| **Se quitó la clase `.cajaBotones`** | Era el recuadro al 66% de ancho que usaba solo la caja de "quiénes juegan". Con los tres recuadros del mismo ancho se veía raro |
| **"Jugar solo" ya no abre ventana** | Avisa `aviso("Jugar solo todavía no está disponible.")` y **no** arranca. Se borró `#modalSolo` con sus tres botones; quedó un comentario en el HTML que dice dónde está el original. **(Hoy el botón ya no existe: se quitó del todo en la sección 24.)** |
| **Aparece una descripción del modo** | `#descModo`, una frase que cambia con la pestaña: normal / espejo / seleccionar |

### Los tres modos, y de dónde sale cada lista

`listaDeLado(lado, modoBase)` quedó como la **única** fuente:

| Modo | De dónde sale | Qué ve el jugador |
|---|---|---|
| `normal` | `U1` / `U2` | Su personaje y lo hace suyo |
| `espejo` | `C1` / `C2` | La contraparte de su personaje |
| `seleccionar` | `U` + `C` del mismo dueño | Las dos, con etiqueta, y él escoge |

Reemplaza a `fuenteDeModo()`, que solo sabía dos modos.

### El flujo cambió: `preparar()` va antes que `iniciar()`

```
[quiénes juegan] → modal "un celular / cada quien" → preparar()
                                                        │
                          ┌─────────────────────────────┴──────────────┐
                    modo normal/espejo                    modo seleccionar
                          │                                        │
                     iniciar()                        un celular → abrirSeleccionLocal()
                                                       cada quien → abrirSeleccionCompartida()
```

`preparar()` hace lo que antes hacía `iniciar()` de entrada: carga personajes,
revisa que cada lista tenga **2 como mínimo** y que **R no pase de la lista más
corta** (en "seleccionar" la más corta es `U + C`). Si falta algo, avisa y no
arranca. Después `iniciar()` recibe un cuarto argumento: **`poolsListos`**, que
son las tarjetas ya escogidas. Cuando viene, **se saltan las dos revisiones**,
porque la pantalla de selección ya dejó R tarjetas a cada quien.

`iniciar()` **sigue validando** cuando no le pasan `poolsListos`, para no romper
ningún otro camino que la llame.

### La pantalla de selección (`#vistaSeleccion`)

| Pieza | Qué hace |
|---|---|
| `#selTabs` | Una pestaña **por jugador**, todas a la vista (decidido por Fredy). En un solo celular hay que armar la de los dos, así que ninguna se esconde |
| `#selBox` | La lista de esa persona: normales y contrapartes con su etiqueta (`Normal` / `Contraparte`) y una casilla |
| `#selCuenta` | El contador: `Ana 3/3 · Luis 1/3` (turquesa cuando ya está, coral si falta) |
| `#btnSelJugar` | **Nace oculto.** Solo aparece cuando **todos** tienen exactamente R. Solo quien inició puede apretarlo: el resto ve "Esperando a quien inició…" |
| `#btnSelVolver` | Regresa a la pantalla de inicio. En la selección compartida **borra** `activa:false` (si no, los demásPhones se quedan pegados ahí) |

**Un solo celular** (`selLocal`): todo en memoria, no se escribe nada.
**Cada quien en el suyo** (`seleccionRoles/actual`): cada teléfono escribe
**solo su `sel[id]`** y escucha el documento. Quien no es anfitrión **nunca
escribe el documento**: solo el suyo.

`escucharSeleccion()` se arranca desde `entrar()`, así que un teléfono que abre
la app con una selección en curso cae en esa pantalla solo —**nunca** si ya está
jugando, y solo cambia de vista si estaba en Inicio, Espera o la propia
Selección (para no sacarlo del engrane si está editando).

### Un detalle: "Cada quién en el suyo" SIEMPRE es partida compartida

En el modo seleccionar **no hay opción de un solo celular con reparto
automático**: o escoge todo en un aparato, o cada quien escoge en el suyo. Por
eso `arrancarSeleccion()` llama a `iniciar(..., pools)` **siempre** con
`unCelular = false`.

### Lo que NO se probó

- Que las pestañas de la selección se vean bien con **muchos** jugadores (con
  dos está bien; con cinco se aprietan).
- Que el checkbox se sienta bien con el dedo (es un `<input type=checkbox>`
  nativo, no un botón de la app).
- La selección compartida con **dos celulares de verdad**: que cada uno escriba
  su `sel[id]` y que el anfitrión vea los contadores cuadrar.
- Si un invitado abre la app **en medio de una selección**, cae en la pantalla
  de selección. **Eso es lo que hace ahora**, pero no se probó y la FASE 4 (T4.1
  y T4.3) es lo que debe arreglarlo bien.

---

## 17. FASE 4 — Multijugador e invitados (oct-2026)

### T4.1 — No hizo falta código

La sala (`invitado.js` y `Diablitos/`) es **genérica**: lee el documento
`invitaciones/{idDelJuego}` y el juego solo publica `{juego, titulo, icono,
ruta, participantes, sesion, sid}`. Se revisó el repo y **no hay ningún juego
escrito a mano** en la sala ni en el menú.

Lo único que este juego tiene que publicar (ya lo hace desde la FASE 0):

```js
juego: "roles",  ruta: "Roles",  sesion: "sesionRoles/actual"
```

### T4.2 — Agregar invitado a media partida (Normal y Espejo)

La regla base de `General/Invitado-a-media-partida.md` se respetó tal cual:

- entra con **`R − ronda`** tarjetas, así termina junto con los demás;
- **no** se mete al `orden` actual: entra cuando la ronda da la vuelta y el orden
  se revuelve con los que siguen vivos.

Dos cambios sobre lo que traía el calco:

| Cambio | Por qué |
|---|---|
| `modoBaseDePartida()` | La lista de la que se reparte depende del **modo con el que arrancó ESA partida** (`estado.modo`, que viene de `modoBase` en la sesión), **no** del modo que ahora esté marcado en la pantalla de inicio. Si no, en Espejo se le darían personajes normales |
| Se revuelve **por invitado** | Antes se revolvía una vez y se repartía por turnos: si entraban dos invitados seguidos, podían recibir **las mismas tarjetas**. Ahora cada invitado recibe su propio revolto |

### T4.3 — Invitado en modo Seleccionar

Aquí **no se le reparta nada**: se le encarece que **él** escoja sus tarjetas, y
eso es lo que forma su `listas`. Se hace con el **mismo documento** de la
selección (`seleccionRoles/actual`) pero con un campo más:

```
modo: "agregar"
agregar: { id, nombre, lado, necesidad }   // necesidad = R − ronda
sel: { [id]: [idPersonaje...] }
anfitrionUid, anfitrionNombre
```

| Quien | Qué ve | Qué escribe |
|---|---|---|
| **El invitado** | `#vistaSeleccion`, con **una sola pestaña: la suya**, y `R − ronda` casillas | **Solo su `sel[id]`** |
| **El anfitrión** | `#modalMeterInv`: un contador y el botón "Meterlo a la partida" | Nada en el doc hasta apretarlo; al apretarlo, la transacción en la sesión |

Al apretar "Meterlo": se resuelve cada `id` a su objeto `personaje`, se mete al
invitado en `cabezas` y en `listas` (y **no** en `orden`), se **vuelve a
publicar la invitación** para que su sala le muestre "Entrar", y se apaga el
documento de selección.

**El documento se apaga antes de la transacción**, a propósito: si algo falla,
el invitado ya no queda viendo una pantalla que nadie va a contestar.

### El detalle que casi rompe: el invitado y el botón atrás

El invitado **no tiene pantalla de inicio** (la suya es la de espera, sin
menús). El `popstate` del calco hacía `ver("vistaInicio")` sin más, y el
"‹ Volver" de la selección también iba a `vistaInicio`. Con un invitado en medio
de una selección, el botón atrás del celular lo habría mandado **al menú**.

Se corrigió con `vistaDeInicio()`, que devuelve `vistaEspera` si es invitado.
Además, mientras `selEsAgregado` está activo, el botón atrás **no lo mueve**: lo
primero es que el anfitrión lo meta o lo cancele.

### Reglas que se respetaron (y conviene no romper)

- **Nadie más escribe el documento de selección.** Solo el invitado escribe su
  `sel[id]` y solo el anfitrión hace la transacción de la sesión. Los demás
  únicamente miran.
- **Si no alcanza**: cuando la lista del lado del invitado no da para
  `R − ronda` tarjetas, se avisa y **no** se le pide nada.
- Un botón que depende de JavaScript **nace oculto**: `btnMeterInv` y
  `btnSelJugar` los dos.
- Todo el texto del invitado entra con `textContent`, nunca con `innerHTML`.

### Lo que NO se probó

**Nada de esta fase se ha probado en vivo**, y es la fase que más necesita dos
celulares de verdad:

- Que la sala muestre la carta del juego y que el `?entrar=1` entre bien.
- Agregar un invitado **con la partida andando** en Normal y en Espejo.
- El ida y vuelta del invitado en modo Seleccionar: él marca, el anfitrión ve el
  contador, "Meterlo" se enciende, entra, y a la siguiente ronda ya le toca.
- Que el invitado que cancela (o a quien el anfitrión cancela) vuelva a la
  pantalla de espera y no se quede pegado.

---

## 18. FASE 5 — El interruptor de Especial (oct-2026)

### Dónde quedó

**Abajo de todo**, después de los tres modos (decisión de Fredy). Con esto queda
cerrada la pantalla de inicio y **ya no queda nada pendiente de decidir** en la
sección 8.

```
¿QUIÉNES JUEGAN?
NÚMERO DE RONDAS
MODO  [ Normal ] [ Espejo ] [ Seleccionar ]
ESPECIAL  [ ] Sacar una variante especial en algunas rondas
              ¿cuántas veces?  [ 1 ]     ← solo si el interruptor está prendido
```

### Cómo funciona

**No es un modo.** Es un interruptor que se prende **encima** de cualquiera de
los tres. Por eso el juego tiene ahora **dos cosas que se llaman distinto**:

| | |
|---|---|
| `modoBase` | normal / espejo / seleccionar |
| `especial` | `true` / `false` (+ `especialK`) |

| Pieza | Qué hace |
|---|---|
| `#chkEspecial` | El interruptor |
| `#cajaEspecial` | El campo "¿cuántas veces?". **Nace oculto** |
| `#espNota` | Dice si K cabe: "Máximo una por ronda: con 3 rondas, el máximo es 3." Se actualiza **solo**, al cambiar las rondas o el K |
| `#espAviso` | Si no hay variantes en la pestaña Especiales, avisa en la misma caja |
| `revisarEspecial(R)` | La revisión final antes de arrancar. Con el interruptor apagado **siempre pasa** |

**Validación `1 ≤ K ≤ R`**, en dos lugares: en vivo (`pintarEspecial()`, que solo
pinta la nota) y al arrancar (`revisarEspecial()`, que avisa y **no** sigue).
Máximo una por ronda, como pedía el plan.

### El sorteo

`repartirEspeciales(cabezas, R, K)` corre **una sola vez, al arrancar**, y se
guarda en la sesión:

```
especiales: [ { ronda: 2, jugador: "u1", texto: "..." }, ... ]
```

- Se eligen **K rondas DISTINTAS** al azar, así que **nunca hay dos variantes en
  la misma ronda**.
- En cada una, un **jugador al azar** de los que empiezan. Como todos arrancan
  con R tarjetas y juegan exactamente R rondas, **todos juegan todas las rondas**:
  no hace falta filtrar.
- El texto sale al azar de la lista `ESP`.
- Al escribirse en la sesión, **todos los celulares ven lo mismo**.

Un invitado que entra a media partida **no alcanza** los ya sorteados: su `id`
no está en ninguno de los `especiales`. Es lo que dice el plan y es correcto.

### Dónde se muestra

`#blqueEspecial` va **dentro de `#tarjeta`**, entre el nombre del personaje y los
cuatro bloques de texto. Se marca con recuadro turquesa y la etiqueta
"VARIANTE ESPECIAL", para que no se confunda con los bloques de la tarjeta.

`pintarTarjeta(p, esp)` lo enciende o lo apaga **siempre**, así que nunca se
queda pegado de un turno al siguiente.

> **Si algún día quieres que la variante se vea ANTES de voltear la carta**, es
> mover ese `<div>` de dentro de `#tarjeta` a `#flipwrap`, antes de `#tarjeta`.
> Ahora se voltea con ella, porque el plan decía "junto con la tarjeta".

### Lo que NO se probó

- Que la variante salga en la ronda correcta y **con el jugador correcto** (no hay
  forma de probarlo sin dos celulares, o al menos una partida completa).
- El aviso de K inválido en vivo.
- Que la caja del interruptor no se salga de la pantalla en un celular chico:
  **la pantalla de inicio ya tiene cuatro recuadros** y con el interruptor
  prendido se abre un quinto con un campo dentro. **Es lo más sospechoso que
  quedó sin ver.**

### T5.1–T5.3: hechos. Falta

Nada del código. Solo la prueba en vivo (T6.4).

---

## 19. La prueba en vivo (T6.4) — la lista para hacer a mano

> **Esto no se puede hacer desde el entorno**: no hay navegador ni celular. Va en
> **orden**, porque las primeras cosas son las que más romper tienen. **Si algo
> falla, se anota y se sigue** (regla dura: máximo 3 intentos por forma de
> probar, y si no sale, se anota como pendiente y se sigue adelante).
>
> Se sube con GitHub Desktop, se espera 1-2 min (Pages), y se abre en incógnito o
> `Ctrl+Shift+R`.

### Antes de nada (en el Panel, lo hace Fredy)

1. Crear el pack **`roles`** en `Panel → Catálogo → Juegos` (sección 11):
   id `roles`, título "Juego de Roles", ruta `Roles`, sección `Juegos`,
   activo, **sin `oficial`**.
2. Pedir el acceso desde el **Centro** (sección Juegos) y **aprobarlo** en
   `Autorizar/`.

### A. Que se abra

- [ ] **A1** La tarjeta sale en el submenú **Juegos**, con la flecha a la
      **derecha** y "← Volver" de vuelta al submenú.
- [ ] **A2** Con otro navegador (sin licencia) sale "Acceso 🔒" y "Ir a Centro
      de Adquisiciones" **va a la sección Juegos**, no a Experiencias.
- [ ] **A3** Al aprobarlo, la pantalla de acceso se quita sola.

### B. El engrane ⚙️ — **lo primero que hay que probar de verdad**

> Si esto falla, es un bug de la FASE 1 y son 2 líneas. **Mejor ahora que con
> 5 fases encima.**

- [ ] **B1** Entrar al ⚙️. Salen **dos pestañas** con **tu nombre** y
      "Especiales", y abajo dos sub-pestañas "Personajes"/"Contrapartes".
- [ ] **B2** Escribir un nombre en el campo de abajo y apretar **+**. Se crea y
      **se abre el detalle solo**.
- [ ] **B3** Llenar los cuatro textos, poner un **enlace** de imagen y guardar.
      Salir del detalle: la fila debe mostrar **solo el nombre**.
- [ ] **B4** **Cerrar el ⚙️ y volver a abrirlo.** ¿Sigue ahí? — *esto es el
      T1.1: guardar y volver a leer.*
- [ ] **B5** Ir a "Contrapartes" y agregar una. En su fila debe verse "sin
      contraparte" en coral, y abajo la caja de avisos debeavisar.
- [ ] **B6** Tocar la casilla ✎, elegir el normal en el desplegable y guardar.
      El aviso debe desaparecer.
- [ ] **B7** Dejar un normal **sin** contraparte: debe salir el aviso "no tiene
      contraparte", pero **el juego debe dejar jugar igual**.
- [ ] **B8** "Pegar lista completa" con un **arreglo JSON** de 3 personajes. Debe
      llenar la tabla. Con texto plano, una por línea, también.
- [ ] **B9** La pestaña **Especiales**: agregar y editar texto de a hilera,
      borrar con el ✕ (**debe preguntar antes**).
- [ ] **B10** Como **administrador**, el botón "Ver los de *el otro*" cambia de
      lado. Como **la pareja**, **ese botón no aparece** y solo se ve su lista.

### C. El turno

- [ ] **C1** Modo **Normal**, "Jugar con Pareja" → **un solo celular** → jugar.
      Sale la **carta boca abajo** (el mosaico del icono).
- [ ] **C2** Tocar la carta: se voltea. **Tocar otra vez: se tapa.**
- [ ] **C3** Con un texto largo, **deslizar la info** y verificar que la carta
      **NO** se voltea sola al soltar.
- [ ] **C4** Aprieta **Siguiente** varias rondas. Debe cambiar de jugador y la ronda avanza.
      **Ojo:** con la carta **boca abajo**, "Siguiente" tiene que estar **apagado** (no deja pasar).

- [ ] **C5** Jugar **completo**, hasta el final: **fuegos + "¡Gracias por jugar!"**.
- [ ] **C6** El **reverso** debe medir **exactamente** lo mismo que la cara de
      adelante (ni una rayita más).
- [ ] **C7** Con un **enlace de imagen que no exista**, debe salir el marcador
      🖼️ y no una imagen rota.

### D. Los otros modos

- [ ] **D1** Modo **Espejo**: las tarjetas deben salir de las **contrapartes**.
- [ ] **D2** Modo **Seleccionar** → **un solo celular**: pestañas por jugador,
      etiquetas "Normal"/"Contraparte". El botón **Jugar no debe aparecer**
      hasta que los dos tengan exactamente R.
- [ ] **D3** **Seleccionar** → **cada quien en el suyo**: en dos celulares, cada
      uno marca lo suyo, el anfitrión ve los contadores, y "Jugar" se enciende.
- [ ] **D4** Modo **Seleccionar**: la lista del invitado muestra **U y C** juntas.

### E. Especial

- [ ] **E1** Prender el interruptor (abajo de todo). Aparece "¿cuántas veces?".
- [ ] **E2** Poner K más grande que R: debe decir "Máximo una por ronda" y al
      arrancar **no debe arrancar**.
- [ ] **E3** Prenderlo sin ninguna variante en Especiales: avisa.
- [ ] **E4** Con **K=2 y R=4**: en la partida salen **2** variantes, **nunca dos
      en la misma ronda**, y le toca **al jugador de esa ronda**.
- [ ] **E5** La variante sale en la tarjeta, marcada, y **se voltea con ella**.

### F. La pantalla de inicio

- [x] **F1** ~~Aprieta "Jugar solo": avisa y no arranca nada.~~ **El botón ya no
      existe** (se quitó, sección 24). Ahora en la caja de arriba solo salen
      **Jugar con Pareja** y **Multijugador**, en el mismo renglón.

### G. Multijugador e invitados (lo que más necesita dos celulares)

- [ ] **G1** Multijugador → cada quien en el suyo → **QR**. El invitado escanea,
      se registra y ve la sala con **la carta de "Juego de Roles" 🎭**.
- [ ] **G2** Entra a la partida y le toca jugar una tarjeta.
- [ ] **G3** Con la partida andando, **Agregar invitado** (Normal): entra con
      `R − ronda` tarjetas y **no** juega la ronda en curso.
- [ ] **G4** Lo mismo en **Espejo**.
- [ ] **G5** En modo **Seleccionar**, agregar invitado: **él marca sus
      `R − ronda` tarjetas**, al anfitrión se le enciende **"Meterlo a la
      partida"**, y entra. **A la siguiente ronda ya le toca.**
- [ ] **G6** Cancelar esa espera: el invitado **vuelve a la sala** y no se
      queda pegado en la pantalla de selección.

### H. Botones de anfitrión

- [ ] **H1** Como anfitrión: Pausar, QR, Agregar invitado y Terminar **sí** se
      ven. Como la pareja o el invitado: **ninguno** se ve (ni siquiera un
      instante).
- [ ] **H2** "Saltar turno" solo aparece cuando **no** es tu turno, y solo es
      del anfitrión.

### I. Lo que más conviene mirar (nada de esto se puede ver desde el código)

- [ ] **I1** **La pantalla de inicio con el interruptor prendido**, en un celular
      chico: son cinco recuadros. ¿Se sale algo de la pantalla?
- [ ] **I2** El **botón atrás del celular** en cada pantalla: no debe sacar de la
      app ni mandarle al invitado al menú.

### J. Y lo que se arregló en la revisión — **esto es lo más frágil ahora**

> Estos 6 puntos salen de la revisión de la sección 21: eran los 9 bugs. Ya están
> corregidos, pero **corregido y sin probar no es lo mismo que funcionando**. Si
> algo se rompe, es por aquí.

- [ ] **J1** **Modo Seleccionar + UN SOLO CELULAR**: al arrancar la partida,
      **el otro teléfono NO debe recibir ninguna invitación** (ni "¿quieres
      unirte?" ni carta en la sala). Antes sí la mandaba.
- [ ] **J2** **Modo Seleccionar + cada quien en el suyo**: en el celular que
      **no** es el anfitrión, aprieta **"‹ Volver"** y luego **recarga la
      página**. **No debe regresarte a la pantalla de selección.**
- [ ] **J3** **Modo Seleccionar + agregar invitado**: que el invitado apriete
      **"‹ Volver"**. Debe quedar en la sala de espera, **no** volver a caer en
      la pantalla de selección.
- [ ] **J4** **Unirse a una partida de PAREJA** desde otro teléfono: **no debe
      aparecer el panel de la sala** ("En la espera / En el juego"), que es solo
      de Multijugador.
- [ ] **J5** **El número de ronda** con un invitado agregado a media partida: al
      invitado le debe decir **la ronda que de verdad va**, no una corrida.
- [ ] **J6** En **Pareja + Seleccionar**, que el anfitrión **recargue** a media
      selección: la partida debe arrancar en **Pareja** (sin QR ni "Agregar
      invitado"), no en Multijugador.

---

## 20. Si algo falla

| Síntoma | Dónde mirar primero |
|---|---|
| Pantalla en blanco al abrir | Un `import` mal escrito: se ve en la consola del navegador como "Failed to resolve module specifier". Corre `revisar.py` |
| El ⚙️ no guarda nada | `cargarPersonajes()` / `guardarPersonajes()` y el doc `personajesJuego/actual` |
| La partida no arranca | `preparar()`: avisa "Cada lista necesita al menos 2 personajes" si la lista está vacía |
| "Cada lista necesita al menos 2" | Falta contenido en **la pestaña del usuario que se está usando**. Ojo: cada quien solo ve su lado |
| Se ve el menu a un invitado | `esInvitadoFlag` mal leído, o `pintarSalidas()` |
| Un invitado no entra | `invitaciones/roles`: que tenga `sesion`, `participantes` con su id, y `ruta:"Roles"` |
| La variante especial no sale | Que la ronda del jugador coincida con `especiales[].ronda` |

---

## 21. Revisión completa del código (oct-2026)

> Fredy pidió revisar **de principio a fin** lo que se escribió en las fases 0 a 6,
> **sin haberlo probado**. Se leyó `Roles/index.html` entero (2,626 líneas) y se
> comparó contra este plan. **Se encontraron 9 fallas reales y 3 cosméticas:
> las 12 se corrigieron.** Al final, `revisar.py` → `0`.

### Lo que estaba BIEN (y conviene no romper)

- El **diseño de la tarjeta** está calcado del aprobado (sección 5): el degradado
  del marco, la foto cuadrada, el scroll de la info, el reverso con el mosaico, y
  el `visibility:hidden` en vez de `display:none` para que el reverso mida igual.
- **`siguienteTurno()`** funciona tal cual venía: su `alive` servía para el juego
  viejo y sirve aquí sin cambios.
- El **reparto** (`repartirTarjetas`), el **avance** (`avanzarTarjeta`), el
  **sorteo de especiales** y los **avisos de contrapartes**: la lógica es correcta.
- **Ningún `alert()` ni `confirm()` del sistema.** Todo por `confirmar()` / `aviso()`.
- **Todos los botones que el JS esconde nacen ocultos.**
- La **licencia, las invitaciones, la sala y los fuegos** no se tocaron.

### Las 9 fallas reales (todas corregidas)

| # | Qué pasaba | Arreglo |
|---|---|---|
| 1 | **"Un solo celular" en modo Seleccionar creaba partida COMPARTIDA**: escribía la sesión y publicaba invitación, así que al otro teléfono le salía "¿unirte?" aunque estuvieran jugando en uno solo | Nueva variable `selUnCelular`, que se recuerda al armar la selección y se le pasa a `iniciar()` |
| 2 | **El invitado no veía su propia pestaña**: `const primera = !selDoc` se leía **después** de asignar `selDoc`, así que siempre daba falso | Se lee antes de asignar |
| 3 | **Un documento de selección que quedaba vivo atrapaba al teléfono**: al recargar volvía a caer en la selección, y "‹ Volver" no servía | `selSalioSid`: se recuerda de cuál se salió y no vuelve a caer. Una selección nueva trae otro `sid` y esa sí lo llama |
| 4 | **`modoJuego` no se leía de la sesión**: quien se unía a una partida de Pareja le salía el panel de la sala (que es solo de Multijugador) | `cargarEstado()` ahora lo lee de la sesión |
| 5 | **El número de ronda salía corrido** con un invitado que entra a media partida (él trae menos tarjetas) | Se usa `d.ronda`, que es exacto, en vez de restar tarjetas |
| 6 | **Una variable local llamada `aviso` tapaba la función `aviso()`** importada de `confirmar.js`. Hoy no rompía, pero cualquier aviso que se agregara ahí tronaba | Se llama `avisoEl` |
| 7 | Si el anfitrión **recargaba** en medio de una selección de Pareja, la partida se armaba como **Multijugador** (`modoPendiente` vive en memoria y su valor por omisión es "multi") | El modo se guarda en el documento de la selección (`modo`) y se lee de ahí |
| 8 | **Cuatro escrituras a Firestore se tragaban el error**: "Siguiente", "Saltar turno", "Agregar invitado" y "Meterlo" podían quedarse muertos sin decir nada. **Es contra una regla de la casa** (`AGENTS.md`: todo botón que escribe necesita aviso visible) | Las cuatro avisan cuando fallan |
| 9 | **Al invitado que salía de "agregar" lo volvían a jalar**: ese documento no tenía `sid` con qué recordar que ya se había salido (la falla 3 otra vez, por otro camino) | El documento de "agregar" ahora lleva `sid`, y la revisión de `selSalioSid` va **antes** de las dos ramas |

### Las 3 cosméticas

| # | Qué era |
|---|---|
| 10 | Un comentario salió corrupto: *"con los dosinio de Pegar lista completa"* |
| 11 | Quedó un comentario huérfano `// sesión compartida` encima del bloque del Especial |
| 12 | El manejador del enlace "‹ Volver" terminaba en `}});`, que funciona pero se lee mal |

### Y una decisión que hay que saber

El plan (sección 4.2) pedía un campo **`seleccion`** en la sesión
(`true/false`: "el modo arrancó eligiendo a mano"). **No se escribió**, porque
dice exactamente lo mismo que **`modoBase === "seleccionar"`**: dos campos para
la misma cosa es como se mezclan los datos. Si algún día hace falta, se agrega.

### Lo que esta revisión NO cambia

**Sigue sin haberse probado en vivo.** La revisión es leer el código: encuentra
errores de lógica, de nombres y de conexiones, pero **no** puede ver si algo se
ve bien, si un botón responde al dedo, ni si Firestore acepta la escritura. Eso
es la sección 19.

---

## 22. Primer hallazgo de la prueba en vivo (oct-2026)

> **Lo reportó Fredy en su primera prueba:** *"cuando entro a Juego de Roles no me
> despliega nada en pantalla y el botón engrane no funciona; oprimí Volver y ya
> desplegó la pantalla"*. **Ya está corregido.**

### Qué pasaba

`entrar()` hacía, en este orden:

```
await cargarPersonajes();   ← llama a Firebase y ESPERA
pintarInicio();
ver("vistaInicio");         ← hasta aquí, la pantalla estaba EN BLANCO
```

**La pantalla no se pintaba hasta que Firebase contestaba.** En el celular, la
primera conexión tarda unos segundos, así que se veía el vacío y parecía que
nada servía.

Y el engrane pasaba lo mismo: `abrirCfg()` también hacía
`await cargarPersonajes()` antes de pintar. Entonces pasaba esto:

1. Abres el juego: pantalla en blanco, esperando a Firebase.
2. Tocas el engrane: `abrirCfg()` también se pone a esperar.
3. Las dos esperas terminan **casi al mismo tiempo**: se abre el engrane, y un
   instante después `entrar()` remata con `ver("vistaInicio")` y **te saca del
   engrane**. Por eso parecía que el engrane no servía.
4. Si vuelves a tocar el engrane, ya funciona (Firebase ya contestó).

### El arreglo (y es una regla, no un parche)

**Primero se pinta, después se carga.** Se invirtió el orden en los tres
lugares: `entrar()`, la cortesía, y `abrirCfg()`. El contenido se carga **en
paralelo** y la pantalla se refresca sola en cuanto llega:

```js
pintarInicio();
ver("vistaInicio", false);                                   // ya se ve
cargarPersonajes().then(()=>{ try{ pintarInicio(); }catch(e){} });   // refresca
```

**Regla que sale de aquí, y aplica a cualquier pantalla nueva:**
> **Nunca se espera a Firebase para pintar.** Si la pantalla depende de una
> lectura, se pinta primero con lo que haya en memoria y se refresca cuando
> llegue. Esperar deja al usuario viendo la nada, y peor: si toca algo mientras
> tanto, el `ver()` que llega tarde le tira encima la pantalla y cree que su
> botón no sirve.

### Y una red de seguridad

Al final del arranque se agregó:

```js
// Pase lo que pase, NUNCA se deja la pantalla en blanco.
if(!document.querySelector(".vista.ver")){
  document.getElementById(vistaDeInicio()).classList.add("ver");
}
```

Si algo falla, **se ve una pantalla** (y entonces se puede abrir la consola y
leer el error) en vez de nada. Un error con pantalla en blanco es casi imposible
de diagnosticar.

### Lo que NO se pudo hacer para diagnosticar esto

Se intentó **3 veces** sacar el error con Chrome y Edge sin ventana (`--dump-dom`),
sirviendo el repo por HTTP: **las 3 devolvieron vacío**. Es exactamente lo que
avisa `GUIA.md` de por qué se retiró el arnés de Chrome. Ahí se paró, como manda
la regla de la casa. Por eso el arreglo salió de **leer el código**, no de un
volcado.

### Pendiente de confirmar

- Que ya **no** se quede en blanco y que el engrane abra **a la primera**.
- Si volviera a pasar, hay que abrir la consola del navegador (F12 → Console) y
  leer el error: eso dice la causa exacta, y el código ya no lo esconde.

---

## 23. LA CAUSA REAL del blanco: la dirección (oct-2026)

> Lo encontró **Fredy**, con la consola abierta. Esta sección existe para que
> nadie vuelva a perder el tiempo aquí.

### Qué decía la consola

```
Failed to load resource: 404   /Citas-de-Pareja/Roles/acceso.js
Failed to load resource: 404   /Citas-de-Pareja/Roles/config.js
Failed to load resource: 404   /Citas-de-Pareja/Roles/invitado.js
... (los ocho módulos, más icon-512.png y favicon)
```

**El navegador buscaba los módulos DENTRO de `/Roles/`**, no en la raíz.

### Por qué

Los `import` del juego son `../acceso.js`, `../config.js`, etc. Ese `../` **solo
sube a la raíz si la dirección es la CARPETA**:

| Dirección | A dónde va `../acceso.js` | Resultado |
|---|---|---|
| `.../Citas-de-Pareja/Roles/` | `/Citas-de-Pareja/acceso.js` | ✅ existe |
| `.../Citas-de-Pareja/Roles/index.html` | `/Citas-de-Pareja/Roles/acceso.js` | ❌ 404 |

Con la dirección larga, `..` **no sube**: quita `index.html` y se queda dentro de
`/Roles/`. Entonces **los ocho archivos dan 404, el módulo no carga, y la pantalla
queda en blanco** —con el engrane muerto, porque su código vive en ese módulo.

**Por eso `Opciones` sí entraba:** su dirección termina en `/Opciones/`. El menú
arma el enlace así (`index.html:607`), con la ruta **como carpeta**:

```js
a.href = /\.html?$/i.test(p.ruta || "") ? p.ruta : (p.ruta || "") + "/";
```

### El campo `Ruta` del pack tiene que decir exactamente `Roles`

| Si dice | El enlace queda | Resultado |
|---|---|---|
| `Roles` | `/Roles/` | ✅ |
| `Roles/` | `/Roles//` | ❌ |
| `Roles/index.html` | `/Roles/index.html` | ❌ |
| `Roles/Roles` | `/Roles/Roles/` | ❌ |

**Los tres malos dan EXACTAMENTE los mismos 404.**

### Los blindajes se QUITARON (decisión de Fredy, oct-2026)

Durante el diagnóstico se agregaron tres cosas, y **Fredy pidió quitarlas para
dejar el código limpio**. **Ya no están:**

| Se quitó | Qué hacía |
|---|---|
| El **medidor** en pantalla | Mostraba hasta dónde llegaba el arranque |
| El **aviso de carga** | Un recuadro que salía si los archivos no bajaban |
| El **auto-arreglo de la dirección** | Si entrabas como `.../Roles/index.html`, te pasaba a `.../Roles/` |
| La **red de seguridad** del arranque | Encendía una pantalla si ninguna quedaba encendida |

**Consecuencia que hay que tener presente:** si el campo `Ruta` del pack vuelve a
quedar mal, el juego se verá **otra vez en blanco, sin decir nada** (los `import`
dan 404, el módulo no carga, y el engrane queda muerto). **El código ya no lo
avisa.** Si vuelve a pasar, la causa está en esta sección: revisa el `Ruta`.

**Lo que SÍ se dejó (porque es arreglo, no parche):** pintar la pantalla **antes**
de esperar a Firebase, en `entrar()` y en `abrirCfg()`. Ver la sección 22.

### Y de paso: un defecto del verificador

`herramientas/sintaxis/extract.py` **no limpiaba su carpeta de salida**, así que
un `.js` de una corrida vieja se quedaba y `revisar.py` lo seguía revisando como
si fuera el actual. Con eso, el conteo salía en **23** en vez de **22** (sobraba
`roles_2.js`, de cuando el HTML tenía dos `<script>`). **Corregido:** ahora
`extract.py` borra los `.js` de la carpeta antes de extraer. Si no, el chequeo
puede aprobar (o acusar) un archivo que ya no existe.

### Y una regla que sale de aquí

> **Un juego nuevo NO puede depender de que la dirección traiga la diagonal
> final.** El `../` de sus `import` depende de eso, y un `Ruta` mal escrito en el
> Panel lo rompe todo **sin un solo error de JavaScript** — solo 404 y pantalla
> en blanco. La causa costó dos rondas de diagnóstico; el aviso de carga ya
> existe para que la próxima vez se vea de inmediato.

### Lo que estaba mal en MI diagnóstico

- Dije que "la caché" lo explicaba. **Falso:** el medidor apareció, así que el
  archivo nuevo sí estaba cargado.
- Dije que `../` funcionaba igual con y sin `index.html`. **Falso:** con el
  nombre del archivo, `..` no sube.

---

## 24. La segunda prueba en vivo (oct-2026)

> Fredy probó el carrito, las invitaciones y los submenús: **todo bien**. Y
> encontró **tres bugs** en la partida y **un orden** que estaba al revés. Los
> cuatro están corregidos.

### 1. "Saltar turno" no hacía nada (y en compartido desfasaba)

Eran **dos cosas** en la misma función:

| | |
|---|---|
| **No funcionaba en "un solo celular"** | `saltarTurno()` leía `sesionActual`, que **en un solo celular no existe** (no hay sesión en Firebase). Así que el botón se veía (en la pantalla del anfitrión, cuando el turno es de otro) pero al tocarlo salía *"Solo el anfitrión puede saltar un turno"*. **Ahora funciona en los dos modos**: en un solo celular mueve `estado` en memoria, igual que "Siguiente" |
| **En compartido se desfasaba y no terminaba** | Saltar turno **le dejaba la tarjeta** al jugador. Como la partida acaba cuando todos se quedan sin tarjetas, cada salto pedía **un turno de más**: la ronda se pasaba de R, el marcador decía *"Ronda 5 de 4"* y la partida no acababa cuando debía |

**La regla que quedó: saltar turno QUEMA la tarjeta de esa persona.** Su turno
se pierde *con* tarjeta, no solo el turno. Así la partida sigue siendo de R
rondas y termina cuando tiene que terminar. La ventana de confirmación ya lo
dice: *"Esa persona pierde su turno y esa tarjeta"*.

Se reusa **`avanzarTarjeta()`** (el mismo que usa "Siguiente"), así que el salto
y el paso normal no pueden comportarse distinto.

### 2. Se podía dar "Siguiente" sin voltear la tarjeta

No había ninguna condición que lo impidiera. **Ahora, mientras la carta está boca
abajo, "Siguiente" queda apagado** (`disabled` + opacidad).

Se apaga, **no se esconde**: si desapareciera, la pantalla saltaría de lugar al
voltear. El estado se sincroniza en `pintarVolteo()`, que ya se llama en cada
repintado y en cada volteo.

### 3. En Seleccionar, el orden estaba al revés

Antes: los dos **escogían** tarjetas, el anfitrión apretaba Jugar, y **entonces**
a la pareja le salía "¿Unirse?". *"Si no quiere jugar, para qué escoge tarjetas"*
(Fredy).

**Ahora es al revés:** cuando el anfitrión arma la selección, al otro teléfono le
sale la ventana **"¿Entras a escoger tus personajes?"** con Unirme / Ahora no, y
**hasta que acepta no ve la selección**. Si dice "Ahora no", no se le vuelve a
preguntar por esa misma (se recuerda el `sid`; una selección nueva sí lo llama).

| Variable | Para qué |
|---|---|
| `selSidAceptado` | El `sid` de la selección que ya acepté. Quien la arma queda como aceptada |
| `selInvitando` | Marca que la ventana abierta es la de la **selección** (y no la de una partida), para que "Unirme" lleve a escoger tarjetas |

### 4. Lo que se decidió NO tocar

**Las invitaciones se quedan como están.** Fredy preguntó si convenía que el
aviso le llegara a la pareja en cualquier pantalla de la app; al ver lo que
costaba (meter el aviso en todas las páginas, con más código repetido) **decidió
dejarlo así**: el aviso vive en la pantalla del juego.

### 5. En Seleccionar, cada quien podía marcar de la lista del otro

**Lo reportó Fredy:** en modo Seleccionar (pareja **o** multijugador) salían las
pestañas de **todos** en **todos** los teléfonos, así que cada quien podía
marcar tarjetas del otro. Tenía que ser cada quien de la suya.

**El arreglo:** en **"cada quien en el suyo"** el teléfono muestra **solo su
pestaña** (`selSoloMia`), y por lo tanto **solo puede escribir sus propias
marcas**. En **"un solo celular"** sí salen todas, porque hay que armar la de
los dos en el mismo aparato. Si hay una sola pestaña, la fila de pestañas se
esconde.

**Los invitados quedan bien solos:** su `lado` se calcula por `conQuien` (quien
los invitó) en `construirCabezas()`, así que un invitado del usuario 1 escoge de
`U1`+`C1` y uno del usuario 2 de `U2`+`C2`.

Los **contadores** siguen mostrando a todos ("Ana 0/2 · Luis 0/2"): el anfitrión
necesita ver cómo van los demás para saber cuándo se enciende "Jugar".

### Pendiente de probar (otra vez, lo que solo se ve con dos celulares)

- Saltar turno en **compartido**: que el salto no desfase y que la partida
  **termine** cuando toca.
- Saltar turno en **un solo celular** (en la pantalla del anfitrión, cuando el
  turno es de la otra persona).
- Que **no** deje dar "Siguiente" sin voltear, y que al voltear se encienda.
  - En **Seleccionar**: que la pareja reciba el "¿Entras?" **antes** de escoger, y
    que al decir "Ahora no" no se le repita.

---

## 25. La pantalla de inicio, pulida (oct-2026)

Pedido de Fredy, antes de seguir probando:

| Cambio | Detalle |
|---|---|
| **Se quitó "Jugar solo"** | Ya no existe el botón. Se fueron con él: su `onclick`, el aviso de "en desarrollo" y la rama `modo === "solo"` de `construirCabezasModo()`. También se quitó la variable suelta `ladoSolo`, que nadie leía |
| **Pareja y Multijugador en el mismo renglón** | Con `filaBotones` (la clase de dos columnas que ya existía en el propio juego para los botones del anfitrión). No se inventaron medidas |
| **Textos de los modos** | `Espejo` → *"Juega con el Espejo/Contraparte de tu personaje."* · `Seleccionar` → *"Selecciona tus personajes favoritos."* (se corrigió la ortografía) |
| **Las dos frases van centradas** | `#descModo` con `text-align:center` |

**Y quedó más limpio de lo que parece:** `quiereCompartido` ya no necesita
preguntar por `"solo"`, porque ese modo no puede llegar. Ojo, la **variable**
`ladoSolo` que sigue en la sesión (`sesionRoles/actual`) es otra cosa: es un
campo del documento, y se deja como está.

### Un glitch que apareció de paso

Al correr `revisar.py` dentro de un comando encadenado salió **`EXIT=2`** una vez
y luego 0 tres veces seguidas. Se revisó: **el chequeo está bien**; el `2` venía
de mi propio comando encadenado, no de `revisar.py`. Para que un resultado no
engañe: **`revisar.py` se corre solo**, no pegado a otros comandos.







