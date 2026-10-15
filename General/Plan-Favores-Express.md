# Plan: Favores Express

> **oct-2026 · NO ESTÁ CONSTRUIDO.** Esto es un **plan de desarrollo**, no una
> pantalla existente. Nadie debe buscar `favoresExpress` en el código: **ahí no
> está.**
>
> **Qué se hace con este archivo:** se va llenando mientras se piensa. Cuando la
> función esté construida y probada, **se borra** y lo que valga pasa a
> `GUIA.md`. Es un archivo temporal a propósito, para no hacer crecer `GUIA.md`
> con algo que todavía no existe.

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
| **El precio SÍ se le muestra** | De entrada, en la notificación. Se Discussió ocultarlo (para el sorpresa de "esto no vale N puntos") y se descartó: ella acepta a ciegas y no le pagan, se siente engañada |
| **El reloj arranca al aceptar**, no al pedir | Si arrancara al pedir, se vencería por estar ocupada, que es justo lo que pasa |
| **Expiración base: 10 minutos** | Cada pareja la ajusta. **Va en Usuarios**, junto a los otros números del 🛒 |
| **El saldo nunca queda negativo** | Tope cero. Si a alguien no le alcanza, **el botón igual aparece** y se le avisa que no tiene saldo |
| **Sanción si acepta y no cumple** | Se descuenta **hasta donde alcance**, y si no da, queda en cero. El costo de verdad no son los puntos: es no jugar con la pareja |
| **Las ventanas solo avisan y actuán** | El cartelito dice "tienes un favor nuevo" / "hay contra-oferta" / "aceptaron" / "no aceptaron". **Nada de historial en una ventana** |
| **El registro se guarda para siempre** | Ver abajo, es importante |
| **El precio del mismo para los dos** | Como el del Centro: es un número tuyo para todos tus favores |

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

1. **Dónde vive exactamente** (propuesta: pestaña del Centro) y cómo se llama.
2. **La colección** en la base: se propone `favoresExpress`.
3. **El texto** de la notificación y el de la ventana.
4. **Si también se avisa por el 🛒 de Usuarios** el número de cada quien, como ya
   se hace con `ptsActivar` y `precioCompra`.
5. **Qué pasa con el 🛒** cuando se ajusta a medio reto: ¿se puede cambiar el
   precio mientras hay una negociación viva?
6. **Qué pone el botón flotante** y qué pasa si lo aprietas sin saldo (ya está
   decidido que **te avisa**, pero falta el texto).
7. **El botón flotante en sí**: dónde va, cómo se arma y qué se importa en cada
   pantalla. Ya está decided arriba, pero **no se ha construido nada**.

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