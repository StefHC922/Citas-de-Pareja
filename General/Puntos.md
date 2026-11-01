# Sistema de puntos y registro de movimientos

> Sección nueva (nov-2026). Documenta cómo se mueven los puntos en toda la app
> y el historial de movimientos que se agregó para poder auditar cada cambio.

---

## Dónde viven los puntos

- El **saldo** de cada persona vive en `puntosUsuarios/{id}` con un solo campo:
  `balance`. Es el número que leen Retos, el Centro de Adquisiciones y `favor.js`.
- El **historial** vive en la subcolección `puntos/{id}/movimientos/{movId}`.
  Cada movimiento registra de dónde vino y a dónde fue un cambio de saldo, para
  que ya no sea un número "ciego" (era el problema P3 de `Modelo-Datos.md`).

## El historial de movimientos (`puntos/{id}/movimientos`)

Cada movimiento tiene estos campos:

| Campo | Qué guarda |
|---|---|
| `monto` | Cuántos puntos se movieron (positivo = ganó, negativo = perdió) |
| `motivo` | Por qué (`favor pagado`, `castigo cobrado`, `reto cumplido`, etc.) |
| `origen` | De dónde vino (`favores`, `retos`, `centro`, `usuarios`) |
| `referenciaId` | El id del favor, reto, deseo o compra que lo originó |
| `referenciaTexto` | Copia del texto, para que se siga entendiendo si se borra el origen |
| `saldoDespues` | El saldo que quedó después del movimiento |
| `fecha` | Timestamp de Firestore |

## Qué registra cada módulo

### Favores Express (`favor.js`)

| Movimiento | motivo | monto |
|---|---|---|
| Pagar un favor cumplido | `favor pagado` / `favor recibido` | −precio a quien pide, +precio a quien cumple |
| Cobrar un castigo | `castigo cobrado` | −castigo a quien incumplió, +castigo a quien pidió |

**Aviso nuevo (nov-2026):** si el castigo no se puede cobrar porque quien
incumplió no tiene puntos, ahora sale un aviso claro en pantalla y el mensaje
que le llega al otro también lo dice ("no se pudo porque no tienes puntos").
Antes se cerraba como "cobrado" en silencio, aunque no se hubiera cobrado nada.

### Retos (`Retos/index.html`)

| Movimiento | motivo | monto |
|---|---|---|
| "Cumplida +1" | `reto cumplido` | +1 a quien lo cumple |
| Reto de IA cumplido | `reto IA cumplido` | +valor a quien lo cumple |
| Reto eliminado en curso | `reto eliminado` | −conteo a quien lo tenía |
| Reto de IA vencido sin cumplir | `reto IA no cumplido` | −mitad al dueño, +diferencia a quien lo mandó |
| Reto normal vencido sin cumplir | `reto no cumplido (penalización)` | −penalización a quien lo tenía |

### Centro de Adquisiciones (`Retos/centro.html`)

| Movimiento | motivo | monto |
|---|---|---|
| Activar un deseo | `activar deseo` | −costo de activar |
| Comprar un deseo | `comprar deseo` | −precio de compra |

### Usuarios (`index.html`)

El ajuste manual de puntos ahora registra la **diferencia** (cuánto se movió),
no el número absoluto, con motivo `ajuste manual`.

## Cambio importante: el script diario ya NO mueve puntos

`recordatorio.py` (GitHub Actions) antes liquidaba retos vencidos y movía
puntos por su cuenta, con una lógica que se desfasó de la app (restaba la meta
cuando ya se había pagado de a uno, y no trataba distinto los retos de IA).

Ahora **solo avisa por Telegram** cuáles retos vencieron; **la app los liquida
al abrirse**. Así hay un solo lugar que mueve puntos y no se duplican lógicas.

## Nota técnica

Las funciones que mueven puntos en retos ahora usan `runTransaction` (antes
algunas usaban `writeBatch`), para que dos teléfonos no puedan sumar o restar
dos veces lo mismo. Dentro de cada transacción, las lecturas van **antes** de
las escrituras, como exige Firestore.

---

## Dónde se consulta el historial

El historial se ve en la pantalla **Usuarios** (⚙️ del menú → Usuarios). Cada
renglón de usuario trae un botón **📜** que abre una ventana con sus movimientos
(los últimos 50, ordenados del más reciente al más viejo).

- **Cada quien ve el suyo.**
- **El administrador ve el de los dos perfiles base** (él y su pareja); no el de
  los invitados.

La ventana muestra el saldo actual arriba y, por cada movimiento: cuánto se movió
(verde si ganó, rojo si perdió), por qué, el texto de referencia y la fecha.

## Regla para este sistema

- **Nunca** se mueve un saldo sin escribir su movimiento en `puntos/{id}/movimientos`.
- El saldo en `puntosUsuarios/{id}` se escribe siempre con `increment()` (o, en
  el ajuste manual, se lee el actual y se registra la diferencia).
- Si algo nuevo mueve puntos, hay que agregarlo aquí (y a su `origen`).
