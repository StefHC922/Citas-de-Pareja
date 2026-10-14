# La IA de `Acompanante/` y los retos que propone

> Seccion que vivia en `GUIA.md` y se movio aqui el oct-2026: **ya no
> es lo que se lee a diario**, es el detalle de una pantalla o un
> modulo. En `GUIA.md` quedo una linea que apunta aqui.

> **Por que se movio:** son 206 lineas de una sola pantalla, y ademas son texto que cambia con cada ajuste de la instruccion.

---

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

### ⏳ PENDIENTE DE DEFINIR — los retos de la IA (pedido por Fredy oct-2026)

> **ESTO NO ESTÁ ACABADO. Antes de seguir metiendo mano a los retos de la IA,
> hay que decidir estos tres puntos.** Fredy lo pidió expressly que se le
> Masteringara.

1. **El botón "Reto picarón"** — ¿queda y dice "mándale un reto a [nombre]"?
   ¿Se quita de los dos lados? (Lo acordado hasta ahora: **que el reto sea del
   que NO está en el chat**, para que no pueda rechazarlo.)
2. **¿Cómo se entera la pareja?** ~~Si no tiene la app abierta, el reto no le
   llega. Hoy las notificaciones solo salen con `Retos/` abierto. **¿Tiene que
   llegar aunque esté fuera de la app?**~~ **RESUELTO (oct-2026): ahora llega por
   las cuatro vías** — Telegram (la única con la app cerrada), campana y bip, el
   cartelito al abrir la app, y la pancarta si ya estaba en `Retos/`. Ver *La
   campana ahora avisa de los retos de la IA*.
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

### El nombre de la IA en el campo de escritura (oct-2026)

El campo del chat tenía el texto fijo *"Escríbele a Chispa..."*, aunque el nombre
se puede cambiar en la esquina superior derecha (`pareja_ai_nombre` en
`localStorage`, por omisión "Aitana"). Ahora el placeholder se arma con
`NOMBRE_AI` al arrancar. **Como guardar el nombre recarga la página, con ponerlo
una vez al inicio basta.**

### Los ajustes de Acompañante: de panel en el encabezado a caja flotante (oct-2026)

**Lo que reportó Fredy:** al apretar el engrane de arriba a la derecha, el panel
"**distorsionaba toda la pantalla**".

**La causa:** `#panelCfgAI` estaba **dentro de `#encabezado`**. Al abrirse, ese
`<div>` ocupaba lugar y **empujaba el chat hacia abajo**: no era un efecto visual,
era que el contenido de verdad se recorría. Por eso "se destorsionaba".

**Lo que quedó:** una caja flotante en el centro (`#modalCfg`), con la misma pinta
que las de `confirmar.js`, y el chat de atrás **no se mueve ni un píxel**.

| | Antes | Ahora |
|---|---|---|
| Dónde vive | Dentro de `#encabezado` | Capa fija sobre toda la pantalla (`z-index:95`) |
| Botón de guardar | "Guardar nombre" | **"Aceptar"** (el degradado grande, como toda la app) |
| Salida sin guardar | **No había** | **"Cancelar"** |
| Vaciar chat | En el mismo panel | Sigue en la caja, **pregunta primero** y cierra |
| Botón atrás del celular | Sacaba de la pantalla | **Cierra la caja** |

**Reglas que se siguieron:**

- **La caja y sus botones NACEN ocultos en el HTML** (`#modalCfg` sin `display`
  en línea y el CSS pone `display:none`; el JS lo cambia a `flex`). Si naciera a
  la vista, habría un instante en que se ve antes de tiempo.
- **Las clases llevan prefijo `acCfg`, NO `cf`.** `confirmar.js` mete sus propias
  reglas al vuelo (`ponerEstilo()`), y usar los mismos nombres las invadiría.
- **Sin `alert()` ni `confirm()`:** el nombre vacío sale con `aviso()` y el borrado
  sigue con `confirmar()`.
- El botón atrás usa el patrón del menú y de las vistas de los juegos:
  `abrirCfg()` guarda un paso (`pushState`), `cerrarCfg()` lo deshace
  (`history.back()`) y el `popstate` cierra la caja si se aprieta atrás con ella
  abierta. La bandera `cfgAbierto` evita que el `popstate` de `cerrarCfg()` la
  cierre dos veces.

**LA RECARGA AL GUARDAR EL NOMBRE SE CONSERVA (decisión de Fredy, oct-2026).** Se
propuso quitarla para que "Aceptar" no parpadeara, y Fredy la quiere. La razón de
que exista: `NOMBRE_AI` se lee **una sola vez** al arrancar y va metido dentro de
`PERSONA`, que es lo que se le manda a la IA en cada llamada. Sin recargar, el
nombre se guardaría pero la instrucción seguiría con el viejo. **Con la recarga,
el nombre se vuelve a leer del almacenamiento y queda igual en toda la pantalla,
incluida la instrucción.** Quien quiera quitarlo después, tiene que actualizar
`NOMBRE_AI`, el placeholder, el encabezado y `PERSONA` a mano.

**Lo que NO cambió:** los mensajes viejos siguen guardando el texto que escribió
la IA ("Hola, soy Aitana"), así que ese texto conserva el nombre viejo. Lo que sí
se actualiza, igual que antes, es la etiqueta de quién habló. No es una regresión
de este cambio.

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
