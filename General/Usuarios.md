# Pantalla de Usuarios — Cambiar usuario y editar nombres/puntos

Movido de `General/GUIA.md`. Contiene el detalle de la pantalla de Usuarios: flujo de cambiar usuario, editar nombres, administrador y puntos.

---

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

### Editar nombres, administrador y puntos (botón al final de Usuarios, oct-2026)

Al final de la pantalla de **Usuarios** (⚙️ → Usuarios) hay un botón **"✏️ Editar
nombres y administrador"** (`#invEditar`) que abre una **ventana emergente**
(`#invOverlayUsu`, mismo molde que la de Puntos). Dentro salen **todos los
usuarios**, y en cada renglón un **campo de puntos**:

**Candado (decidido por Fredy, oct-2026):** el botón **nace oculto** y solo se
muestra **si el usuario actual NO es invitado** (o sea, uno de los dos base); a
los invitados también se les **oculta "Cambiar usuario"** (`#invCambiarUsu`), que
si no servía para ponerse como la pareja y entrar igual. La visibilidad la
resuelve `pintarInvUsuarios()` con `soyInvitado()`, y `abrirEdUsuarios()` **vuelve
a comprobar** que no sea invitado. Además, al tocar el botón **pide una clave** en
una ventana de la app (`#invOverlayPin`, nada de `prompt()` del sistema).

- La clave está **fija en el código**: en `index.html` se guarda su **hash
  SHA-256** (`PIN_EDITAR_HASH`), no el PIN. **Para cambiarla** hay que recalcular
  `sha256("<nuevo pin>")` en hexadecimal y reemplazar la constante. El PIN de
  pruebas es `9966**`.
- Esto es **para las pruebas de la pareja**, no es seguridad real: el repo es
  público y la base está abierta, así que quien lea el código o la base puede
  saltárselo. La protección de verdad es el login (rediseño de arquitectura).

- **Los dos perfiles base** (admin y pareja, o sea `!invitado`): campo de nombre
  **editable** y un **radio "Admin"**. **Solo hay un administrador.**
- **Los invitados**: solo salen para editarles los puntos; su nombre se muestra
  **de solo lectura**.

**Los nombres y el admin** se guardan en `config/ajustes.usuarios` —lo mismo que
ya usaban el asistente y "agregar invitado"— con `setDoc(..., {merge:true})` y
`guardarUsuariosLocal()`. Si alguien se renombra a sí mismo (o le cambia el
admin), su copia local (`CLAVE_LOCAL`, `appPareja_quienSoy`) también se actualiza.

**Los puntos** se escriben **directos** (el número exacto) en el campo **`balance`
de `puntosUsuarios/{id}`**, que es donde viven (no en `config/ajustes`, y **no**
son los precios del 🛒). Se leen de una sola vez con `getDocs` y, si el documento
no existe, el saldo se toma como **0** (igual que `Retos` y `favor.js`). Como esas
pantallas escuchan la colección, el cambio se refleja solo. Tiene que ser un
número **de 0 o más**.

> **Desde nov-2026, el ajuste de puntos registra la diferencia** (cuánto se movió)
> en el historial `puntos/{id}/movimientos`, no el número absoluto. Ver
> `General/Puntos.md`.

**El historial de movimientos (botón 📜):** cada renglón de usuario trae un botón
**📜** que abre su historial de puntos (de solo lectura, los últimos 50). **Cada
quien ve el suyo; el administrador ve el de los dos perfiles base.** Ver
`General/Puntos.md`.

**Aviso que hay que recordar:** en toda la app **el admin es el lado A y la pareja
el lado B** (`nombreLado()`, `armando()`), y hay contenido guardado **por lado**
(acciones de `nivelesActividad`, `opcionesJuego/actual {A,B}`, `personajesJuego`
`U1/U2`…). Por eso **cambiar de admin intercambia esos lados**: el contenido que
estaba de un lado se ve del otro. Se decidió permitirlo así (decisión de Fredy,
oct-2026). Cualquier usuario puede abrir el botón, porque la app no tiene login.

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
