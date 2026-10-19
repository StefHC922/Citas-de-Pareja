# Duelos - el cuarto modo de `Roles/` (oct-2026)

> **ESTE MODO YA EXISTE: se construyó el 17-oct-2026.** Está en `Roles/index.html`,
> en la misma caja de los otros tres modos, y se juega en las cuatro ramas
> (Pareja/Multi × un celular/cada quien en su suyo) y en las dos modalidades
> (**Turnos** y **Juntos**).
>
> **PROBADO EN VIVO (Fredy, oct-2026).** El chequeo de sintaxis pasa y las **ocho
> combinaciones se ejecutaron en el celular**, junto con los casos límite. Lo que
> se fue encontrando al probar ya está incorporado aquí y en `GUIA.md`, así que
> este archivo es lo que rige. La bitácora de la construcción quedó en
> `General/Plan-Duelo.md`.
>
> **Lo que sigue es el diseño**, acordado por Fredy, y se deja como referencia de
> **por qué** está hecho así. **Cómo se construyó, qué se apartó del plan y qué
> falta está en `General/Plan-Duelo.md`** (ese es el archivo de trabajo).
>
> **Nota (17-oct-2026):** en este archivo, "administrador" (y "ADMINISTRADOR")
> significa el **anfitrión de esa partida**, o sea **quien la inicia**, no el
> usuario `admin` de la app. Cualquiera de los dos puede iniciar, también el
> Duelo; el que inicia es el que marca y controla la partida.

El detalle del juego base (`Roles/`) está en la entrada de `Roles/` en
`General/GUIA.md`. Aquí solo vive el cuarto modo, que es lo único que se
partió aparte porque tiene cuatro caminos distintos y no caben en una
línea.

---

## 1. Qué es

Es un **cuarto modo de juego**, hermano de Clásico, Cambia de Bando y
Seleccionar. Entra en la misma fila, que queda con **cuatro pestañas en dos
renglones** (dos arriba, dos abajo).

**El nombre es "Duelo de seducción".** La pestaña larga (17 letras) sí cabe
en el 2x2: cada pestaña mide lo mismo y queda como a ~150 puntos de ancho.

**Su descripción** (la frase que va debajo del nombre, como las otras tres):
**"Sensualidad contra Erotismo, Quién Ganará ?"** (decisión de Fredy,
oct-2026).

**Los modos siguen siendo de uno en uno.** Solo uno puede estar activo. Eso
no se abre: la función que decide qué lista ve cada jugador los revisa uno
por uno, y si dos estuvieran activos solo aplicaría el primero.

**Lo que hace, en una frase:** se reparten R personajes de un solo lado y
**de cada uno se toma su contraparte cruzada** — el del médico contra la
paciente, de verdad, no dos cartas al azar.

---

## 2. Lo que es igual en las cuatro ramas

### El reparto amarro

1. Se pregunta **de quién son las cartas**: un desplegable, **usuario 1 o
   usuario 2**.
2. Se reparten **R tarjetas** de esa lista.
3. De cada una se busca **su contraparte cruzada**: si se tomó de U1, su
   contraparte está en **C2**; si se tomó de U2, está en **C1**. Las dos colas
   se arman **en el mismo orden** de selección.
4. **Quien es dueño de la lista original juega los originales, y el otro
   juega las contrapartes.**

> **Recuerdo de las contrapartes:** cada personaje de U1 tiene su contraparte
> en **C2**, y cada uno de U2 en **C1**. Ejemplo: el Doctor en U1, la
> Paciente en C2. Consecuencia de la línea cruzada: **la contraparte de un
> personaje tuyo se edita en la pestaña del otro.**

### Sin contraparte no cuenta (ni se ve)

Los personajes **sin contraparte asignada no entran a Duelo**: no salen en el
reparto **ni en la pantalla de selección**, simplemente no se ven. No se avisa
ni se bloquea la partida (decisión de Fredy, oct-2026).

Para que no parezca un error, al pie de la selección va una **nota discreta**
(propuesta): *"¿No ves un personaje? Puede que todavía no tenga contraparte."*

La caja **"REVISAR CONTRAPARTES"** del engrane sigue siendo el lugar para
verlos y arreglarlos. Con el contenido ya cargado (30 por lista) no debería
hacer falta.

### El emparejamiento por ronda no lo controla la app

En **Pareja** el reparto conserva el mismo orden en los dos lados, así que la
carta original k y su contraparte k caen en la misma ronda.

En **Multijugador** la app solo reparte las cartas de cada lado entre sus
jugadores: **quién hace duelo con quién en cada ronda es dinámica del grupo,
no una regla de la app** (decisión de Fredy, oct-2026).

### El anfitrión arma y marca

El que **inicia la partida** es el anfitrión y es el que marca las tarjetas,
también en "cada quien en su suyo", aunque el lado elegido sea el de la pareja.
Los demás solo ven. **Cualquiera de los dos usuarios puede iniciar** (no es cosa
solo del usuario `admin` de la app): el que inicia manda en esa partida.
(Decisión de Fredy, 17-oct-2026.)

### Siempre hay pantalla de escogimiento

Al elegir Duelo se pasa SIEMPRE por una pantalla de selección, como pasa con
Seleccionar. Pero es una distinta:

- La lista es **solo del lado elegido**, y **filtrada**: fuera los que no
  tienen contraparte.
- El anfitrión marca **tantas como rondas** haya.
- **Al marcar una, su contraparte se busca sola y el CONTADOR DEL OTRO LADO
  también sube.** Por eso los dos contadores **siempre van iguales** y nunca
  queda un "0" colgado.
- El otro lado **ve la lista entera y puede opinar** ("esa no, esa") — pero
  **no marca**.
- Se prende **"Jugar"** cuando el contador llega a R.

> **Los contadores no son dos números: son el mismo número.** Salen de la
> misma lista de R personajes escogidos, así que no se pueden desincronizar.
> Esa es también la regla de "todos listos": basta con que el contador llegue
> a R.

### "Tentación sin distinciones" (reparto alterno)

Además de marcar parejas a mano o con **"Sorpréndeme"**, la selección trae un
segundo atajo: **"Tentación sin distinciones"** (decisión de Fredy, 17-oct-2026).

- **Ignora por completo** lo que se haya marcado (o no).
- A **cada persona** (usuario 1 y sus invitados; usuario 2 y los suyos) le toca
  su propia mano de **R cartas al azar**, tomadas de las de **su lado**:
  `U1+C1` para el lado 1, `U2+C2` para el lado 2.
- Las manos salen **distintas** entre compañeros de lado si alcanzan las cartas;
  si no alcanzan, **se permite repetir**.
- **No hay parejas** original/contraparte: por eso, en este modo, la carta **no
  muestra "contra ..."** (en el Duelo normal sí).
- Sirve en **todas las combinaciones** menos **Multijugador + un celular**, donde
  el botón no se muestra (la dinámica de grupo manda).
- En **Juntos un celular** (solo Pareja) la carta de dos caras muestra **la de
  cada quien**: una cara es tu carta y la otra la del otro, y se voltea para verla.
- En la sesión se guarda `dueloTentacion:true` y **no** se guarda `dueloPares`.

### Esperar a la pareja antes de arrancar (solo Duelo)

En **"cada quien en su celular"**, el Duelo **no arranca** hasta que la otra
parte **entre**; mientras tanto, quien marca ve *"Esperando a que entre …"*. Si
la pareja no entra, al intentar arrancar se pregunta y el anfitrión puede
**"Comenzar igual"**. Se espera **solo a la pareja** (no a los invitados), y en
**"un solo celular"** no se espera a nadie (ahí están los dos).

Si alguien acepta **después** de que ya arrancó, entra **a la partida**, no a la
selección: eso quedó arreglado el 17-oct-2026 (antes caía en la pantalla de
selección ya muerta y quedaba atrapado).

### Las dos modalidades

Se pregunta **en la misma pantalla**, una debajo de otra, para que no se sienta
como dos pasos. Aparte del desplegable de usuario 1 / usuario 2.

**"Saltar turno" no existe en Duelo**, en ninguna de las dos modalidades
(decisión de Fredy, oct-2026): el botón se esconde. No hay reemplazo; si
alguien pierde la conexión, al anfitrión solo le queda **Terminar Partida**
(eso también es dinámica del grupo).

### Las variantes picantes

Entran como en los otros modos: se sortean **una sola vez al arrancar** entre
todos (usuarios e invitados), máximo una por ronda, y **solo le afectan a una
persona** (decisión de Fredy, oct-2026). La variante vive dentro de la carta de
esa persona: se ve en **su** cara. En la carta de dos caras (Juntos un
celular) sale en la cara de quien la tenga.

---

## 3. Las dos modalidades

### TURNOS — es el motor que ya existe

Idéntico al juego de hoy: se sortea de quién es el turno, ese turno ve su
carta, la voltea, lee, actúa y aprieta "Siguiente"; se vuelve a sortear
entre los que quedan; así hasta que se acaba la ronda, y luego igual hasta
que se acaba el juego.

**Cuesta cero.** No hay que escribir nada nuevo: el motor de turnos, el
sorteo, las rondas y la transacción de Firebase ya existen.
Lo único que cambia es **qué lista se reparte**.

### JUNTOS — este sí es nuevo

La unidad ya no es el turno: **es la pareja.** En las dos formas de jugar:

> **Los dos voltean, los dos juegan al mismo tiempo, y el ADMINISTRADOR
> aprieta "Siguiente".**

No hay turnos. Por eso el "Siguiente" **ya no está bloqueado**: lo aprieta
el administrador cuando quiera.

**El indicador que hace que las dos formas funcionen con el mismo texto es de
FASE, no de turno.** Tres estados, iguales en un celular y en compartida:

| Fase | Lo que se ve |
|---|---|
| 1 | La carta tapada: **"Voltea tu carta"** |
| 2 | Ya se ve: **"Jugando"**, y el administrador tiene **"Siguiente"** |
| 3 | Los demás ven: **"Esperando a que el anfitrión avance"** |

Arriba va el progreso: **"Ronda 1 de 3"**.

> **La fase 1 no aplica en Juntos un solo celular.** La carta de dos caras no
> tiene tapa (ver *Rama 1*): abre mostrando una cara y se voltea para ver la
> contraparte. El "Voltea tu carta" aplica donde cada quien tiene su carta
> tapada (Turnos, y Juntos cada quien en su celular).

> **Nadie mide si los demás ya voltearon.** El administrador avanza cuando le
> parece. Instrumentar eso sería un contador extra y **no hace falta** para
> que funcione.

---

## 4. Las cuatro ramas

| | **Un celular** | **Cada quien en su celular** |
|---|---|---|
| **Turnos** | Una carta, la del que está en turno. **Ya existe** | Una carta por persona, tapada, por turnos. **Ya existe, tal cual** |
| **Juntos** | **Carta de dos caras.** Nuevo | Una carta por persona, todas se voltean al tiempo, avanza el administrador. **Nuevo** |

> **La carta de dos caras solo hace falta en UNA combinación:** Juntos en un
> solo celular. En todo lo demás el duelo se reduce a cambiar la lista que se
> reparte, y en la casilla de abajo derecha no se toca nada.

---

### RAMA 1 — Jugar con pareja, un solo celular

- **Cabezas:** solo usuario 1 y usuario 2. Sin invitados.
- **Preparación:** el administrador elige el lado (U1/U2) y la modalidad, y
  marca las R tarjetas en la pantalla de escogimiento.
- **Reparto:** los originales van al dueño del lado elegido; las
  contrapartes, al otro.
- **SIN** QR, **SIN** "Agregar invitado", **SIN** panel de sala: en Pareja no
  hay a quién meter ni a quién esperar.

**Juntos:**
- Una **carta de dos caras**: de un lado el original (U1 o U2), y al voltearla
  aparece su **contraparte cruzada** (C2 o C1). Es **un solo objeto** que se
  voltea; no son dos cartas ni las dos caras a la vez.
- Cada quien lee **su** cara: se ve el original, se juega, se voltea y se ve la
  contraparte del otro.
- **No hay reverso de misterio** (el de la marca): las dos caras son contenido.
  Por eso "sin tapa" — aquí no hay nada que ocultar, ya se sabe que la
  contraparte es la del otro.
- El administrador aprieta **"Siguiente"** y viene la pareja siguiente. Hasta
  el final.

**Turnos:**
- Arranca el administrador y se sortea el turno de los demás.
- Al que le toca se le muestra **su** cara de la carta; la voltea, lee,
  actúa y aprieta "Siguiente".
- Se vuelve a sortear entre los que quedan, hasta acabar la ronda; luego
  siguiente ronda.
- **Sin "Saltar turno"**: en Duelo ese botón no existe, en ninguna modalidad
  (ver *Las dos modalidades*).

---

### RAMA 2 — Jugar con pareja, cada quien en su celular

- **Cabezas:** usuario 1 y usuario 2.
- Se escribe la sesión en Firebase y se publica la invitación apuntando a
  **`sesionRoles/actual`**.
- **Cada quien recibe UNA sola carta normal y tapada**, la que le toca. No
  hay carta de dos caras: en compartida cada persona solo tiene un personaje,
  así que no hay dos cosas que ver al mismo tiempo.

**Turnos:**
- **Es exactamente el juego de hoy.** Sorteo de turnos, cada quien voltea su
  carta, lee, actúa y aprieta "Siguiente". **No se toca nada.**

**Juntos:**
- Todos voltean **al mismo tiempo** y juegan.
- **El administrador aprieta "Siguiente"** y en los dos teléfonos aparece la
  pareja siguiente.
- Los que no son administrador ven "Esperando a que el anfitrión avance".

---

### RAMA 3 — Multijugador, un solo celular

- **Cabezas:** todos los usuarios, invitados incluidos.
- Cada invitado **pertenece** a usuario 1 o a usuario 2 (por `conQuien`), así
  que su carta sale de la lista del lado de su anfitrión.
- **Reparto:** los originales le tocan al dueño del lado elegido **y a sus
  invitados**; las contrapartes, al otro lado **y a los suyos**.
- **Coneltas:** el administrador sí tiene **QR** y **"Agregar invitado"**, y
  el **panel de sala** sale.

**Juntos:**
- Es una **sola carta de dos caras que ve todo el grupo**: aparece un
  personaje, se muestra a todos; se voltea y aparece su contraparte, y también
  la ven todos (decisión de Fredy, oct-2026).
- **No hay una carta por persona** en esta rama: es una sola, compartida. El
  administrador aprieta "Siguiente" y viene la pareja siguiente.

**Turnos:**
- Se sortea entre **todas** las cabezas. Al que le toca se le muestra su
  cara, la voltea, lee, actúa y aprieta "Siguiente".
- Cada quien actúa **una vez por ronda**.

---

### RAMA 4 — Multijugador, cada quien en su celular

- **Cabezas:** todos, invitados incluidos; la invitación apunta a
  **`sesionRoles/actual`**.
- Un invitado que entra a media partida entra a partir de la ronda siguiente,
  y se le agregan **las tarjetas que le falten del lado del usuario que lo
  invitó** (decisión de Fredy, oct-2026).

**Turnos:**
- **Es exactamente el juego de hoy**, entre todas las cabezas. **No se toca
  nada.**

**Juntos:**
- Cada persona recibe **una sola carta tapada**, la suya. Todos voltean al
  mismo tiempo y juegan; **el administrador** aprieta "Siguiente" y a todos
  les llega la pareja siguiente.

---

## 5. Lo que hay que construir

> **Todo esto está hecho (17-oct-2026).** La lista se queda como resumen de lo que
> hubo que tocar; el detalle de cada pieza está en `Plan-Duelo.md`, sección 5.

1. **La pestaña y el 2x2.** Cuarto modo en la fila, repartido en dos
   renglones. Ojo: las pestañas usan `flex:1`, así que hoy la fila está
   hecha para tres. Al pasarla a rejilla de dos columnas, **ese cambio no se
   puede hacer en el estilo general**, porque el mismo estilo se usa en las
   pestañas de la pantalla de selección, donde puede haber tres o cuatro
   jugadores y se verían torcidos. Lo correcto es un estilo nuevo que se le
   ponga **solo** a la fila de modos.
2. **El reparto amarro.** Una función propia: hoy `repartirTarjetas()` revuelve
   cada lado por separado y no sabe nada de `par`. La del duelo reparte una
   lista, busca la contraparte de cada carta y **conserva el mismo orden en
   los dos lados** (así la carta k y su contraparte k caen en la misma ronda
   en Pareja).
3. **La pantalla de escogimiento del duelo.** Lista filtrada (fuera los que no
   tienen contraparte), contadores derivados e iguales, y **todos los demás**
   (la pareja y los invitados) viendo sin poder marcar: en Duelo **solo marca
   el anfitrión** (quien inició la partida). Al pie, la nota de los personajes
   que no se ven.
4. **La modalidad Juntos:** el avance por parejas con "Siguiente" del
   anfitrión, y el indicador de tres fases.
5. **La carta de dos caras** — solo para Juntos en un celular.

Lo que **no** hay que tocar: el motor de turnos, el sorteo, las rondas, las
transacciones de Firebase, las invitaciones, la sala, el volteo de una carta
normal y el final de partida con fuegos.

El botón de **"Saltar turno" solo se esconde** en Duelo (en las dos
modalidades): su código no se toca.

---

## 6. Decisiones cerradas (oct-2026)

**Ya no queda nada pendiente.** Todo lo que se preguntó está definido:

- **La descripción de la pestaña** queda: **"Sensualidad contra Erotismo,
  Quién Ganará ?"** (ver la sección 1). Los puntos suspensivos de "Clásico"
  son intencionales; esta es una pregunta, que también abre en vez de cerrar.
- **La selección compartida y la regla de "todos listos" ya se probaron y
  funcionan.** La diferencia del Duelo es cuál es el reparto de tareas: en los
  otros modos cada quien marca lo suyo; **en Duelo solo marca el anfitrión**
  (quien inicia la partida), y la pareja y los invitados nada más ven. Ver
  *El anfitrión arma y marca*.
- **Las variantes picantes sí entran**, con el mismo mecanismo de siempre:
  una sola vez al arrancar, máximo una por ronda, y le toca a una sola
  persona. Ver *Las variantes picantes*.
- **Sin contraparte no cuenta (ni se ve)**, con la nota al pie de la
  selección. Ver *Sin contraparte no cuenta (ni se ve)*.
- **"Saltar turno" no existe en Duelo.** Ver *Las dos modalidades*.
- **El invitado a media partida** recibe las tarjetas que le falten del lado
  de quien lo invitó. Ver *Rama 4*.

## 7. Una nota de mantenimiento que salió al escribir esto

El **panel de sala** (quién está en la espera y quién ya está jugando) sale en
**multijugador**, y **da igual si se juega en un solo celular o cada quien en
el suyo**. Eso viene de `modoAdmiteInvitados()`, que solo mira si el modo es
`multi`, y es la regla de la casa: en Pareja no se muestra.

Había un comentario en `Roles/index.html` que decía que el panel salía "solo
en partida compartida". **Ese comentario estaba viejo**: no era lo que hacía
el código y contradecía la regla. Ya se corrigió (oct-2026) — solo era el
texto, no se cambió ningún comportamiento.