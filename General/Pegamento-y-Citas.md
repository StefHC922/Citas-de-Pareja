# El chorro de pegamento y las pantallas de configuracion

> Seccion que vivia en `GUIA.md` y se movio aqui el oct-2026: **ya no
> es lo que se lee a diario**, es el detalle de una pantalla o un
> modulo. En `GUIA.md` quedo una linea que apunta aqui.

> **Por que se movio:** son detalle de pantallas concretas: el pegamento, la agenda de `Citas/` y las pantallas de Actividades y Accesorios.

---

### Chorro de pegamento si te quedas quieto (`glue.js`, oct-2026)

**Modulo en la raiz**, igual que `fuegos.js`. Si alguien entra al submenú
**Experiencias en Pareja** y se queda **15 segundos sin tocar nada**, cae un chorro
de pegamento encima de la pantalla y se va llenando de charcos. **Al primer toque
se apaga al instante** y no queda rastro.

```js
import { glueSiEstaQuieto, glueOlvidado } from "./glue.js";
glueSiEstaQuieto(15);   // abre la espera; en cerrarExp() va glueOlvidado()
```

**Ajuste (oct-2026):** la espera bajo a **15 segundos**, y los chorros ahora
salen **a la mitad de seguido** (uno cada .56–1.2 s) y **mas delgados** que antes:
la gota se quedo a la **mitad entre lo original (16–30) y la version delgada
(8–15)**, o sea **12–22**. El ajuste siguiente puede mover ese rango, es una
sola linea en `makeDrop` (la gota) y en el `trail` (las gotitas del rastro).

**El comportamiento exacto (decidido por Fredy, oct-2026):**

| Que | Como |
|---|---|
| Cuando cae | A los **15 segundos sin interactuar**. Cualquier toque, scroll o tecla **reinicia** la cuenta |
| Ciclo | El chorro **se mantiene solo en bucle**, todo el tiempo que haga falta |
| Cuando se para | **Al primer toque**, en cualquier parte. Se borra el lienzo y ya |
| Si vuelve a pasar | Si se queda quieto otros 15 segundos, **vuelve a caer**. La espera se rearma sola en cada toque |
| Cuándo se para solo | Si se cambia de pestaña (`visibilitychange`): no gasta batería |

**Lo importante para que no rompa nada:**

- **El lienzo va con `pointer-events:none`**: NUNCA tapa un botón. Se puede seguir
  usando la pagina con normalidad mientras corre; el toque apaga el chorro **y**
  hace lo que tenía que hacer.
- Va en **su propio módulo**, no metido en el codigo del submenú. Si algo falla,
  la pantalla sigue exactamente igual.
- Si se cambia de pestaña, **se apaga sola** (`visibilitychange`): no gasta batería.
- Se respeta `localStorage["glue_mute"] = "1"` para apagarlo sin quitar nada mas.
- **Solo está en Experiencias por ahora.** Para ponerlo en otra pantalla: llamar
  `glueSiEstaQuieto(N)` al abrirla y `glueOlvidado()` al cerrarla.

### Los topes del chorro, y por qué los charcos se desvanecen (oct-2026)

**Lo que preguntó Fredy:** por qué se veían charcos que **desaparecían de golpe**.

**Era el tope viejo:** `MAX_BLOBS = 55` con `blobs.shift()`, o
sea, al llegar el charco 56 **se echaba el más antiguo**. El tope hace falta (sin él
los charcos se acumulan sin límite y el celular se vuelve lento), pero **desaparecer
de golpe se veía raro**.

**Lo que quedó:**

| Que | Decisión |
|---|---|
| Tope de charcos | **70** |
| Los que se sobran | **NO se borran de golpe**: el más viejo se pone a **desvanecerse** en 1.2 s (`muerte` + `muriendo`) y se va solo |
| Peor caso | Si aun así se juntan más de 70×1.5, se borra de golpe el más viejo de los que ya se desvanecían, para que la lista no crezca sin freno |

**Los topes y la red de seguridad:**

| Tope | Valor |
|---|---|
| Charcos | 70 (los viejos desvanecen) |
| **`medirRendimiento()`** | Cada 60 cuadros mide el tiempo promedio. Si baja de ~32 fps la calidad cae a 0.4; de ~40 fps a 0.7; si va bien, 1 |

La calidad multiplica **topes**, no cambia el dibujo: el chorro nunca desaparece,
solo sale una gota menos por tanda cuando el celular va lento. **Por eso puede correr
todo el rato sin arrastrar la pantalla.**

**Verificado:** sintaxis OK en `glue.js` e `index.html`; `glue.js` quedó registrado
en `herramientas/sintaxis/extract.py`. **Falta la prueba en vivo.**
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
