# Centro de Adquisiciones Personal

> Seccion que vivia en `GUIA.md` y se movio aqui el oct-2026: **ya no
> es lo que se lee a diario**, es el detalle de una pantalla o un
> modulo. En `GUIA.md` quedo una linea que apunta aqui.

> **Por que se movio:** son 249 lineas de una sola pantalla y no se consultan al trabajar en el resto.

---

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
| Borrar un deseo | **Solo si es secreto.** Si ya está **a la venta, aquí no se puede borrar** (decisión de Fredy, oct-2026): la ✕ no se dibuja y el botón de la ventana tampoco sale. **No hay forma de quitar un deseo de la tienda**, así que los puntos de activación no se devuelven nunca |
| Desactivar un deseo | **No existe, a propósito.** Decidido lo mismo que el borrado: si está en la tienda, no se quita. Fredy dejó abierta la posibilidad de un lugar aparte más adelante, pero **hoy no hay ninguno** |
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
| `.alta` | La cajita de alta de un deseo: **nombre + descripción** + botón "Agregar deseo" |
| `.btnMini` | Botón chico pegado a la derecha de un renglón (**Comprar**, **Recibí ✓**) |
| `.tag` | El chipito de estado ("Secreto", "En venta", "Pendiente", "Entregado") |

**Cómo quedó el Centro (3 vistas, las tres con el mismo esqueleto):**

```
h1  +  p.desc
[ recuadro .tablaBox con los datos ]      ← SIEMPRE dibujado, con altura fija
[ .btnPri "Agregar deseo" (solo en deseos) ]
[ .tabs con las otras dos vistas ]       ← pegados a su recuadro (ya no se alinean entre vistas)
```

- **Tienda:** los deseos que activaste. El **nombre del producto va en coral** y
  cada uno trae su botón **Comprar** (un botón de verdad, a la derecha).
- **Mis deseos:** tus deseos. **Tocar el deseo abre una ventana emergente** con
  solo **Activar** (y abajo **Borrar deseo**); la **✕** roja borra directo (con
  confirmación). Para **anotar uno nuevo** hay un botón **"Agregar deseo"** debajo
  del recuadro que abre **otra ventana** (nombre + descripción + Agregar); dentro,
  el botón se ve **apagado** mientras falten campos y, **al tocarlo así**, sale el
  aviso rojo *"Completa el nombre y Descripcion"*.
- **Mis pedidos:** pestañas **"Los que yo compré"** / **"Los que me compraron"**,
  cada lista en su propio recuadro. En la de los que compraste, a la **derecha**
  hay un botón verde **"Recibí ✓"** para **marcar entregado**. **Cada pedido trae
  su ✕ roja** (en las dos pestañas) para **borrarlo**, con confirmación.

**Cambios de interfaz del Centro (oct-2026):** el detalle con "Guardar cambios"
se quitó; la descripción ahora se pide al dar de alta (no se edita después), y al
tocar un deseo sale la ventana emergente. Los números de activar/precio los lee
**frescos** de `config/ajustes` (no de la copia local de la identidad), así que lo
que cambies en ⚙️ Usuarios → 🛒 se ve sin recargar.

- El botón **Comprar** / **Recibí ✓** (`.btnMini`) va `align-self:stretch`: queda
  del **mismo alto** que el producto/pedido.
- **El alta de deseo es una ventana** (`#modalAdd`), que abre el botón **"Agregar
  deseo"** debajo del recuadro: así la pantalla de Mis deseos no se llena de
  campos (pedido de Fredy, oct-2026).
- **Cada pedido trae su ✕ roja** (`.x`) para **borrarlo**, en las dos pestañas de
  "Mis pedidos", con la misma confirmación de borrar un deseo.
- En "Mis deseos", el aviso rojo **"Completa el nombre y Descripcion"** solo sale
  **al tocar "Agregar deseo" con campos faltantes**. El botón **no** se deshabilita
  (un botón deshabilitado no deja detectar el toque): se ve apagado con la clase
  `.apagado`. El aviso se esconde al completar nombre y descripción.
- **Se quitaron las copias invisibles (`.filaHueco`).** La alineación de los
  botones de abajo entre las tres vistas era **solo del diseño inicial** (pedido
  de Fredy, oct-2026). Ahora los botones de **Tienda** y **Mis pedidos** van
  **pegados a su recuadro**, sin reservar el hueco del alta de deseos.
- **Bug corregido (oct-2026):** `pestana()` ponía `display:"flex"` en el recuadro
  de pedidos. Cuando había renglones, eso volvía el recuadro una **fila
  horizontal** y los pedidos salían encimados al centro. Ahora se quita el
  `display` en línea y manda el CSS (`.tablaBox` = bloque; `.tablaBox.vacia` =
  columna centrada).

**El recuadro NUNCA se oculta y tiene altura FIJA** (`height:48dvh`, no solo
`max-height`), y el texto de "vacío" va **centrado DENTRO** de él, no debajo. Esto
es por pedido de Fredy (oct-2026): así **los botones de abajo quedan siempre en el
mismo lugar** y no se mueven cada vez que añades o borras algo.

Se hace con dos clases: `.tablaBox.vacia` (centra el texto) y una función
`pintaCaja(idCaja, nodoVacio, filas)` que mete los renglones o, si no hay, el texto
de vacío. **Cada recuadro lleva su propio texto de vacío adentro**, así que en
"Mis pedidos" nunca salen los dos textos a la vez: el de "no te han comprado" solo
aparece en su pestaña.

**Los botones de abajo van pegados a su recuadro.** Antes se alineaban entre las
tres vistas con copias invisibles (`.filaHueco`), pero eso era **solo del diseño
inicial**: al crecer el alta de deseos, empujaba muy abajo los de Tienda y Mis
pedidos. **Ya no** (oct-2026): cada vista pone sus botones justo debajo de su
recuadro.
- "Mis pedidos" sí conserva que tiene **una pestaña ARRIBA** que las otras no, así
  que a su recuadro se le **descuesta el alto real de esa pestaña**:
  `ajustarAlturaPedidos()` mide `tabsPedidos.offsetHeight` y pone
  `height: calc(48dvh - Npx)`. Se mide de verdad, no se estima a ojo, y se vuelve
  a medir al cambiar de tamaño de pantalla.

**Texto de las vistas:** la Tienda dice **"Catálogo"**, y Mis deseos dice **"Anota
tus deseos más secretos que quieres hacer realidad"**.

**Un deseo a la venta ya no se borra (decisión de Fredy, oct-2026).** Antes se
podía, con un aviso que decía *"se quita de ahí y no se devuelven los
puntos"*. **Ahora no se puede**, y por eso el botón no se dibuja:

| Dónde | Qué hace |
|---|---|
| La **✕** de "Mis deseos" | **No aparece** si el deseo ya está en venta. Un botón que no hace nada es una trampa |
| El **"Borrar deseo"** de la ventana | Tampoco sale |
| La **ventana** del deseo | Dice *"En venta · N pts · tus puntos: N · **aquí no se puede borrar**"* |
| `borrarDeseo()` | Red de seguridad: si se llega, sale el aviso y no borra |

**Lo que hay que saber:** `enVenta` **nunca vuelve a `false`** en todo el
programa — se pone en `true` al activar y ya. Por eso **no existe manera de
sacar un deseo de la tienda**, y por eso los puntos de activación no se
devuelven: no hay caso en que aplique.

**Ojo con los datos que ya existen:** antes de este cambio sí se podía borrar
un deseo en venta. Si alguien lo hizo y había pedidos comprados, **los pedidos
siguen vivos** (son documentos aparte, en `comprasDeseos`, con el nombre del
deseo copiado dentro) y **quien lo tenía que entregar lo sigue teniendo que
entregar**. No se rompe nada, pero puede haber un pedido de un deseo que ya no
está.

**Un apunte sobre el flujo de los pedidos** (lo aclaró Fredy al preguntar): el
que **compra** puede ser la misma persona que puso el deseo. Si tú lo compras
para que tu pareja te lo entregue, el pedido le cae a **ella** y aparece en su
pestaña **"Los que me compraron"**, con el texto *"te lo compró. **Tú lo
entregas.**"*. El botón **"Recibí ✓"**, en cambio, **solo lo ve el que compró**
(la pestaña "Los que yo compré"): **entregar es de ella, dar por recibido es
tuyo**.

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
