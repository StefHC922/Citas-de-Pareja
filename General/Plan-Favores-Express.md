# Plan: Favores Express

> **oct-2026 · EN CONSTRUCCIÓN.** Esto empezó como plan y ya tiene **código**.
> La parte que **sí** existe va marcada como **FASE 1 (hecha)** abajo. Lo demás
> sigue siendo idea.
>
> **Qué se hace con este archivo:** se va llenando mientras se construye. Cuando
> la función esté terminada y probada, **se borra** y lo que valga pasa a
> `GUIA.md`. Es un archivo temporal a propósito.

## Cómo va la construcción

| Fase | Qué hace | Estado |
|---|---|---|
| **1** | El 🛒 con su número, el botón flotante, la ventana de **pedir**, y que el aviso llegue | **HECHA, sin probar en vivo** |
| **2** | La ventana de responder: **aceptar / cobrar otro precio / rechazar**, con los 4 estados | Pendiente |
| **3** | El reloj (10 min), el **"Recibí ✓"**, el pago con `runTransaction` y la sanción con tope cero | Pendiente |
| **4** | El registro: una pestaña más del Centro, con el historial escondido | Pendiente |
| **5** | El botón flotante en las 13 pantallas | Pendiente |

**Cada fase se puede probar sola**, y si se corta la sesión aquí queda escrito
qué sigue.

## FASE 1 (hecha oct-2026) — lo que existe

| Pieza | Dónde |
|---|---|
| **El número del 🛒** | `index.html`, el overlay de puntos: *"Precio de un Favor Express"*. Guarda como **`precioFavor`** en el usuario de `config/ajustes`. **Default 15** |
| **El módulo** | `favor.js`, en la raíz. Trae el botón flotante + la ventana de pedir |
| **Conectado en** | **Solo el menú** (`index.html`). Las otras 12 pantallas son la fase 5 |
| **La colección** | **`favoresExpress`** (un documento por favor) |
| **El aviso de campana** | **`invitosFavor/{id de quien manda}`** — por persona, no uno solo |

### El modelo del documento

```js
{
  de:    { id, nombre },   // QUIEN PIDE
  para:  { id, nombre },   // a quien se le pide (la pareja)
  texto: "...",            // el favor, texto libre
  precioBase: 15,          // del 🛒 de quien pide. NO se puede cambiar al pedir
  precio: 15,              // el precio vigente (lo mueve quien cumple)
  estado: "pedido",        // pendiente | contra | esperando | enCurso | cumplido | rechazado | vencido
  venceEn: null,           // el reloj NO arranca al pedir: arranca al aceptar
  creadoEn: serverTimestamp()
}
```

**Los estados** (para la fase 2):

| Estado | Quién lo ve | Qué falta |
|---|---|---|
| `pedido` | Ella | Aceptar / cobrar otro precio / rechazar |
| `contra` | Él | Aceptar su precio o no |
| `esperando` | Ella | Confirmar (solo pasa si hubo contra) |
| `enCurso` | Los dos | El reloj corre |
| `cumplido` | — | Ya se pagaron los puntos |
| `rechazado` / `vencido` | — | Se acabó, sin puntos |

### El precio: las reglas (decididas por Fredy, oct-2026)

| | |
|---|---|
| **Lo pone el 🛒** | Del que pide. Al pedir, el precio sale **escrito y no editable** |
| **Quien pidió** | **No lo toca.** Solo escribe qué favor quiere |
| **Quien va a cumplir** | **Sí lo cambia**: para arriba, o hasta **0** si lo regala |
| **Por qué puede bajar** | *"El beso es gratis, ¿qué voy a cobrar por eso?"* Y no es trampa: solo puede bajarlo quien hace el trabajo, y bajarlo le **perjudica a él** |
| **El saldo** | Nunca negativo, tope cero. Pero el botón **siempre aparece**: si no alcanza, avisa. **Es al revés que el Centro**, a propósito |

**Por qué NO se puso un campo "cobra extra":** porque la gente no lee. Quien
fuera, puso 20 pensando que era el precio final. La solución que sí quedó: el
número solo aparece si ella aprieta **"Otro precio"**, y el campo se llama
**"Precio final"**. Aceptar a 15 es un botón grande, de un solo toque.

### Lo que falta probar de la fase 1

1. Que el círculosito salga abajo a la derecha en el menú.
2. Que al abrirlo salga el precio del 🛒.
3. Que "Mandar" guarde y avise.
4. **Que el Telegram llegue a la pareja.**

**Si algo falla, casi siempre es el paso 4**, y la causa se ve en ⚙️ → Telegram,
que muestra el error guardado.

---

## Qué es

Un favor pedido entre los dos, que se cumple **en el momento** y se paga en
puntos. Piense en el **Centro de Adquisiciones sin la tienda**: en el Centro
compras algo que ya está en el estante; aquí **pides algo y la otra persona
decide si lo acepta**.

| | Centro de Adquisiciones | Favores Express |
|---|---|---|
| Qué se compra | Un deseo que ya está en la tienda | Lo que pidas, en ese momento |
| Quién lo pide | El que tiene el deseo en venta | **Los dos** |
| Precio | Lo fija quien puso el deseo | Lo propone quien pide, y **se puede contra-ofertar** |
| Cuándo se cumple | Sin prisa | **Rápido** (10 min de base) |
| Cuánto cuesta | Lo que diga el 🛒 | **Poquitos puntos**, con su propio número en el 🛒 |

## Lo que ya existe y se reutiliza

Casi todo. Esto **no es una pantalla desde cero**:

| Pieza | Dónde |
|---|---|
| Puntos con `runTransaction` | `Retos/centro.html` (comprar) y `finalizarRetosVencidos()` |
| Botón de "Recibí ✓" (marcar entregado) | `Retos/centro.html` |
| Las notificaciones de Telegram, campana, bip y cartelito | `pestana.js` + `avisarTelegram()` — **hecho hoy** |
| Los números del 🛒 en Usuarios | `Retos/centro.html`, `ptsActivar` y `precioCompra` |
| Colección de documentos con su historial | `comprasDeseos` |
| Las ventanas emergentes | El molde es `#modalDeseo` del Centro |

## El flujo

```
yo pido (con MI precio)  ──►  Telegram + campana + cartelito
                               │
                          ella ve el favor y EL PRECIO
                               │
        ┌──────────────────────┼──────────────────────┐
     ACEPTA                CONTRA-OFERTAR          RECHAZA
        │                       │                     │
   empieza el reloj        me llega a mí          MUERE
        │                       │
   cumple en tiempo      ACEPTO / NO ACEPTO
        │                       │
   yo lo marco           si ACEPTO ──► vuelve a ella ──► ACEPTA / NO
        │                                                       │
   se le pagan                                         si NO, MUERE
   los puntos, de los MÍOS
```

**El contra-precio es UNA ida y una vuelta, no un ciclo.** Si ella contra, yo
acepto y vuelve a ella, **ahí se decide**: acepta o no. Si alguien no acepta en
cualquier paso, el favor muere y no pasa nada.

## Decisiones que ya están tomadas

| Decisión | Detalle |
|---|---|
| **Los dos pueden pedir** | No es solo uno le pide al otro |
| **El precio SÍ se le muestra** | De entrada, en la notificación. Se discutió ocultarlo (para el sorpresa de "esto no vale N puntos") y se descartó: ella acepta a ciegas y no le pagan, se siente engañada |
| **El reloj arranca al aceptar**, no al pedir | Si arrancara al pedir, se vencería por estar ocupada, que es justo lo que pasa |
| **Expiración base: 10 minutos** | Cada pareja la ajusta. **Va en Usuarios**, junto a los otros números del 🛒 |
| **El saldo nunca queda negativo** | Tope cero. Si a alguien no le alcanza, **el botón igual aparece** y se le avisa que no tiene saldo |
| **Sanción si acepta y no cumple** | Se descuenta **hasta donde alcance**, y si no da, queda en cero. El costo de verdad no son los puntos: es no jugar con la pareja |
| **Las ventanas solo avisan y actuán** | El cartelito dice "tienes un favor nuevo" / "hay contra-oferta" / "aceptaron" / "no aceptaron". **Nada de historial en una ventana** |
| **El registro se guarda para siempre** | Ver abajo, es importante |
| **El precio del mismo para los dos** | Como el del Centro: es un número tuyo para todos tus favores |
| **Quien pidió NO toca el precio** | Sale escrito en la ventana y no se puede cambiar. Podría ofrecer pagar de más y no tiene sentido |
| **Quien cumple SÍ lo cambia** | Hacia arriba, o hasta **0** si lo regala. **Nadie puede bajar el precio y ganar algo**: solo lo baja quien hace el trabajo, y le sale peor |

## Por qué el registro NO se borra (importante)

**Este proyecto ya tiene ese problema, y está anotado** en `Modelo-Datos.md`
(P3): los puntos se mueven con `increment()` y **no hay de dónde vinieron**.

Si el favor se borra al cumplirse, el día que alguien pregunte *"¿por qué me
bajaron 15 puntos?"* no hay forma de saberlo, y **eso ya no tiene arreglo**.

Decidido: **el documento de cada favor se queda siempre**. Lo que sí se hace es
**esconder los resueltos** de la lista; se ven si buscas el historial. El estado
de cuenta mensual que se mencionó es **una vista**, no una limpieza: para eso
hacen falta los datos guardados.

## Dónde se vería (propuesta, no decidida)

- **Las ventanas**: el molde es `#modalDeseo` del Centro, con los botones
  Aceptar / Contra / Rechazar.
- **El registro**: **una pestaña más del Centro de Adquisiciones**, no una
  pantalla nueva. Es dinero entre los dos, usa los mismos puntos y los mismos
  números del 🛒. Decisión de Fredy pendiente.

## Relación con los retos de la IA

**Son cosas distintas.** El reto de la IA es "la IA te reta" y **no se puede
rechazar**. El Favor Express es "tú le pides algo a tu pareja" y **ella decide**.
Esa diferencia es lo que hace que el segundo no sea un menú.

## Lo que sigue SIN decidir

1. **Dónde vive el registro** (propuesta: pestaña del Centro) y cómo se llama.
2. **El texto** de la notificación y el de la ventana de responder.
3. **Si el 🛒 también avisa** del precio al_acceptar, como ya se hace con
   `ptsActivar` y `precioCompra` al comprar.
4. **Qué pasa si se cambia el 🛒 mientras hay una negociación viva**: el precio
   ya quedó guardado en el documento, así que **no la afecta**. Por decidir si
   además se avisa.
5. **Si el mismo puede pedir dos favores a la vez.** Ahora sí puede: cada pedido
   es un documento aparte.

## Cómo se pide: un botón flotante en toda la app

**No va en el menú.** Decisión de Fredy (oct-2026): sea un **botón flotante que
esté siempre encima**, en cualquier pantalla donde se vaya. Así el Favor Express
se pide sin tener que entrar a buscarlo.

### Es una excepción a una regla de la casa

Hoy está escrito que **los botones viven en las esquinas** ("Volver" arriba a la
derecha, engrane arriba a la izquierda, y *jamás hay dos en el mismo lado*). Un
botón flotante permanente **no sigue esa regla**, así que queda anotado aquí como
**decisión, no como descuido**.

### Cómo se hace

Un módulo nuevo, como `fuegos.js` y `pestana.js`: **se crea solo y se pega al
`body`**. En cada pantalla son **un import y una llamada**.

| | |
|---|---|
| **Posición** | `position:fixed`, **abajo a la derecha** (lejos del "Volver" y del engrane) |
| **Barrita del celular** | Respetar `env(safe-area-inset-bottom)`, o el botón queda debajo |
| **Encima de qué** | **Debajo de las ventanas.** `confirmar.js` va en Z95, el aviso de fin en Z80, los fuegos en Z70: el botón va tipo **Z60**, o tapa el "Aceptar" |
| **Si lo esconde el JavaScript** | **Nace oculto en el HTML** (regla de la casa) |

### Cuándo se ve

**La regla que lo cubre todo: se esconde mientras la persona está en modo
invitado (`soyInvitado()`), y se ve si no.** Eso resuelve de una vez los casos
diferentes, sin tener que hacer una lista de pantallas:

| | |
|---|---|
| Invitado en la sala de `Diablitos` | **Oculto** (está como invitado) |
| `Diablitos` desde el submenú Juegos | **Visible** (no está como invitado) |
| Cualquier pantalla, siendo invitado | **Oculto** |

Y además, aunque no esté como invitado:

| | |
|---|---|
| **Pantalla de elegir usuario** | **Oculto** (todavía no hay identidad) |
| **Lector de QR / registro de invitado** | **Oculto** |
| **Mientras se está jugando** | **Oculto** |
| **`Panel/` y `Tienda/`** | **Oculto.** Son pantallas de desarrollo, no de la pareja (decisión de Fredy) |
| `Privacidad/`, `Terminos/` | **Oculto** |

### Las 13 pantallas donde sí se pondría

`index.html` · `Chat/` · `Acompanante/` · `Citas/` (las 3) · `Retos/` (las 2) ·
`Guiadas/` · `Encuentros/` · `Opciones/` · `Diablitos/`

---

## Regla relacionada, pendiente para `GUIA.md`

**Los cambios de puntos deben requerir que los dos acepten.** Hoy **NO** está
hecho: los números del 🛒 se cambian libremente. Es lo que se está usando para
probar sin molestar a la esposa. Cuando esto se arme, aplica a **los dos
lugares**: el Centro y los Favores Express.

> Cuando se escriba en `GUIA.md`, sale de aquí. **Este archivo se borra.**