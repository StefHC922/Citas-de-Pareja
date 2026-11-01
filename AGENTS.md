# AGENTS.md - Citas de Pareja

## Antes de hacer cualquier cosa

**Lee `General/GUIA.md` primero.** Es el documento maestro del proyecto:
contiene el modo invitado, la sala de espera, la decision de por que las
invitaciones se atan a la partida, `acceso.js`/licencias, `Autorizar/` y las
reglas de Firebase.

Sin leerlo se repiten errores ya resueltos y se rehacen cambios a medias.
Ese fallo ya ocurrio una vez: un trabajo completo se descarto porque nadie
tenia el contexto a la mano.

### Los documentos, y cuando se lee cada uno

| Documento | Que es | Cuando se lee |
|---|---|---|
| `AGENTS.md` | Como trabajar en este repo | **Siempre**, es lo primero |
| `General/GUIA.md` | **Lo que es cierto HOY** y aplica a toda la app | Cuando la tarea toca codigo |
| `General/Centro-Adquisiciones.md` | El Centro: deseos, tienda y pedidos | Solo si la tarea toca `Retos/centro.html` |
| `General/IA-Acompanante.md` | `Acompanante/`: el tono de la IA, los ajustes y los retos que propone | Solo si la tarea toca `Acompanante/` o los retos de la IA |
| `General/Campana-Pestana.md` | `pestana.js`: campana, bip y cartelito (Chat y Retos) | Solo si la tarea toca los avisos de la campana |
| `General/Pegamento-y-Citas.md` | El pegamento, la agenda de `Citas/` y las pantallas de Actividades y Accesorios | Solo si la tarea toca esas pantallas |
| `General/Modulo-Acceso.md` | Detalle del módulo `acceso.js` (licencias, qué exporta, cómo quedó cada página) | Solo si la tarea toca licencias o `acceso.js` |
| `General/Autorizar.md` | Detalle de `Autorizar/` (aprobar y revocar licencias, login, llave privada) | Solo si la tarea toca la pantalla de licencias |
| `General/Favores-Express.md` | Detalle del módulo `favor.js` (favores expresos, precios del 🛒, reglas) | Solo si la tarea toca favores |
| `General/Castigos.md` | Detalle del juego `Castigos/` ("El Precio del Placer", editor, partida, multi) | Solo si la tarea toca el juego de castigos |
| `General/duelos.md` | El cuarto modo de `Roles/` (Duelo de seducción): las 4 ramas y sus 2 modalidades. **Construido y probado en vivo (oct-2026)** | Solo si la tarea toca el modo de duelo |
| `General/Plan-Duelo.md` | El plan de desarrollo del Duelo: fases, funciones, modelo de datos y pruebas | Solo si la tarea es **construir** el duelo |
| `General/Modelo-Datos.md` | Como esta guardada la base y como normalizarla | Antes de migrar datos |
| `General/HISTORIA.md` | **El por que**: relato con fecha de cada arreglo | **Solo** en los casos de abajo |

**Regla para documentación de pantallas y módulos nuevos:**

Cuando se cree o modifique una pantalla, un módulo o un juego, la documentación
de detalle **va directamente a su propio archivo en `General/`**, nunca a
`GUIA.md`. En `GUIA.md` solo queda una línea de apunte que apunte a ese archivo.

**NO se agrega detalle de pantalla o módulo dentro de `GUIA.md`.** Si se ve
que falta el archivo de detalle de una pantalla, se crea en `General/` y se
agrega la línea de apunte en `GUIA.md` y en esta tabla de `AGENTS.md`.

**Los cuatro del medio se partieron del `GUIA.md` el oct-2026** (pasó de 2,274
a 1,417 líneas). Son **detalle de una sola pantalla o un solo modulo**: se leen
enteros o no se leen, y estorban al leer lo de todos los dias. **Si la tarea no
los toca, no se abren** — y su regla general esta resumida en `GUIA.md`.

**`General/HISTORIA.md` es un diario, NO son instrucciones vigentes.** Antes
estaba todo junto en `GUIA.md` (3,000 lineas) y el problema no era el tamano:
era que mas de la mitad era relato con fecha, y se leia como si mandara. Si algo
de `HISTORIA.md` contradice a `GUIA.md`, **manda `GUIA.md`**.

**Léelo SOLO si la tarea toca alguno de estos:**

- Modo invitado, copia de seguridad, salir de la invitacion.
- Sala de espera (`Diablitos/`), invitaciones de los juegos.
- Avisos de fin de partida, pausa, "Saltar turno", el anfitrion.
- `acceso.js`, licencias, catalogo, el limite de 30 solicitudes.
- Retos de la IA de `Acompanante/`, `Retos/`, `Retos/centro.html`.
- `Citas/` y el centro de Adquisiciones.

**NO lo necesitas para:** estilos, agregar o quitar un boton, el menu y sus
submenus, el Chat, la campana de la pestana, `confirmar.js`, `fuegos.js`,
`glue.js`, el Asistente, o las reglas de Firebase (esas estan arriba de
`GUIA.md`, en la parte que dice "Estado de las reglas").

**Criterio honesto:** si tienes duda de si algo aplica, **no lo leas**. Casi todo
el trabajo diario cae en la lista de "NO lo necesitas", y `GUIA.md` tiene
1,417 lineas (se leen enteras).

## Como trabajar en este repo

- Todo el codigo es **HTML estatico con JavaScript adentro**. No hay build, no
  hay npm, no hay framework. Se edita el archivo y ya.
- Los modulos compartidos viven **en la raiz** (`acceso.js`, `invitado.js`,
  `config.js`, `firebase-config.js`, `taquilla.js`, `fuegos.js`, `confirmar.js`,
  `pestana.js`, `telegram.js`) y se importan por ruta relativa al **modulo**, no
  al archivo que lo importa.
- **`avisarTelegram()` ya NO se copia** (oct-2026): vive en `telegram.js`. Si
  necesitas mandar un aviso por Telegram, **importalo**; no lo pegues otra vez.
- **Reglas de Firestore:** no estan en el repo. Viven en la consola de Firebase.
  Cualquier tarea sobre permisos es manual y hay que decirlo.
- **No hay `git` disponible en el entorno de trabajo.** Para revisar cambios se
  leen los archivos directamente; Fredy es quien sube con GitHub Desktop.
- **Verificación por sintaxis (rápida, sin navegador).** Es el único chequeo
  automático que queda: `herramientas/sintaxis/`. El orden es: extraer, luego
  revisar.

  ```powershell
  cd herramientas\sintaxis
  python revisar.py
  ```

  `revisar.py` hace las dos cosas y revisa **todo** el repo. Sale con `1` si algo
  falla.

  **OJO, error que ya se cometió (oct-2026):** `jscheck.py` **no** saca los
  `<script>` de los HTML. Si se le pasa un `.html` a mano, cuenta también las
  llaves del CSS y da "OK" **por casualidad**. Hay que pasarle el `.js` que
  dejó `extract.py`, que vive en `Temp\opencode\extracted`. Por eso conviene
  `revisar.py` y nunca llamar a `jscheck.py` con un `.html`.

  `extract.py` no revisa solo lo que este en su lista: `Diablitos/index.html`,
  `invitado.js` y `confirmar.js` se agregaron en oct-2026 porque **no estaban**
  y por eso nadie los revisaba. Si agregas una pantalla o un modulo nuevo,
  **registralo en `extract.py`**, o queda sin revisar para siempre.

- **No hay arnés con Chrome.** Se retiró en oct-2026: era lento y poco fiable
  (Chrome sin ventana devolvía volcados vacíos). **La verificación de verdad es
  en vivo**, en Pages y en el celular de Fredy.

## Cuándo dejar de insistir (regla dura)

Aplica a cualquier forma de verificar, también a la prueba en vivo.

**Máximo 3 intentos por forma de probar.** Si a la tercera no sale:

1. **Para.** No lo intentes una cuarta vez "a ver si ahora sí".
2. **Cambia de forma**: otra manera de probar, o revisión leyendo el código.
3. **Anótalo** como "pendiente de probar a mano" y **dilo en tu respuesta**.
4. Pasa a lo siguiente.

Nunca dejes a la persona esperando en silencio mientras repites lo mismo. Si algo
se atora, **dilo de inmediato** y di qué harás en su lugar.

**Prefiere menos pruebas y más rápido** antes que una prueba atascada. El valor de
probarla no justifica el rato perdido.

## Que las pruebas no se coman la sesión (regla dura, oct-2026)

**El trabajo es escribir código, no probarlo.** Ya pasó una vez: se acumularon
arneses y scripts de prueba, cada cambio disparaba corridas largas, y las
sesiones se acababan en pruebas en vez de en avance. Se borraron (ver la nota al
inicio de `GUIA.md`). **Que no vuelva a pasar:**

- **No se deja NINGÚN arnés en el repo.** Ni scripts, ni carpetas, ni páginas de
  prueba. Lo de probar vive en `Temp\opencode` y se borra al terminar. Si de
  verdad tiene que ir dentro del repo (porque sus `import` son relativos), se
  crea, se usa y **se borra en la misma sesión**, y se avisa.
- **La única prueba automática es `revisar.py`.** Tarda un segundo: se corre
  después de cada cambio, siempre.
- **Una sola inspección visual por cambio, y solo si el aspecto importa** (un
  diseño nuevo, algo que se ve raro). Nunca para comprobar un texto.
- **No se repite una prueba que ya falló.** Dos intentos por forma de probar y se
  suelta: se anota como pendiente y se sigue (ya lo dice la sección de arriba).
- **Si un tema se vuelve caro de comprobar, se avisa ANTES de gastar**, no
  después.
- **Lo que solo se puede ver en el celular de Fredy o en su base real, se le pasa
  a él de una vez**, diciendo qué mirar y por qué. No se simula, y no se le manda
  una lista larga de tareas.
- **Trampa conocida (oct-2026):** si se abre una página con Chrome sin ventana
  (`--virtual-time-budget`), **los `setTimeout` NO se disparan** cuando hay una
  petición de red pendiente (el SDK de Firebase la deja abierta y el reloj
  virtual se detiene). Se perdieron 3 intentos con eso. Para probar algo después
  de que cargue, hay que meter la llamada **sin temporizador**, justo después
  del punto que interesa.

## Reglas de la casa

0. **No se toca el repo sin que Fredy lo pida.** Ni un archivo, ni una linea: no
   se "de paso" un arreglo, no se completa algo que se ve que falta y no se
   anticipa la segunda mitad de un trabajo. **Primero se pregunta, despues se
   aplica.**
   - Si el pedido esta claro: se aplica **lo pedido**, nada mas.
   - Si el pedido no esta claro: **se pregunta antes de escribir.**
   - Si se ve que falta otra cosa: **se dice y se pregunta.** No se resuelve de
     una con un cambio.

   *(18-oct-2026: se escribio porque faltaba. Fredy pidio "un boton para jalar
   todas las acciones con un JSON" y el modelo.anticipo y metio tambien "Exportar",
   que nadie habia pedido. La regla de mas abajo, "No tocar algo que no tenga que
   ver con el pedido", no cubria esto: esa habla del alcance, no de si hay pedido.)*

1. Si la decision es de producto (que se ve, quien puede salir, que pasa al
   pausar), **preguntar antes de aplicar**.
2. Explicar en espanol claro y sin codigo. El usuario no programa.
3. No inventar reglas nuevas de Firestore: se reutiliza lo que ya funciona.
4. No agregar reglas de seguridad que rompan el modo invitado (nada de "solo el
   anfitrion escribe", porque el invitado escribe su identidad).
4b. **No se usa `confirm()` ni `alert()` del sistema.** Todo pasa por
   `confirmar.js`: `confirmar()` para preguntar (se espera) y `aviso()` para
   decir una cosa (no se espera; el `return` va despues).
5. Cambios minimos, y **verificar antes de decir "listo"**.
5b. **Un boton que JavaScript tiene que ocultar, nace oculto en el HTML**
   (`style="display:none"`). Si nace a la vista, hay un rato en que se ve aunque
   no deba.
6. Documentar en `General/GUIA.md` lo que se decida o se descubra. Ese archivo
   es la unica memoria del proyecto.
6b. **Pero `GUIA.md` tiene que poder leerse de arriba a abajo.** Si lo que vas a
   escribir empieza con "antes se hacía X" o lleva una fecha de hace meses, **va
   a `General/HISTORIA.md`**, no ahi. `GUIA.md` es lo que rige hoy;
   `HISTORIA.md` es el por que. Si se mezclan, `GUIA.md` se vuelve ilegible y
   este repo pierde su memoria otra vez (oct-2026).
7. **Los ejemplos usan los nombres de verdad: la pareja es `Mary` y el
   administrador `Fredy`.** En comentarios, documentacion y textos de ejemplo no
   se inventan nombres (decidio Fredy, 17-oct-2026). Ojo: **eso NO es un dato
   de la app.** El nombre real de cada quien sale de la base (`nombreLado()`), y
   ningun nombre se hardcodea en el codigo. Ver `General/GUIA.md`, seccion de
   decisiones.

8. **Ortografía:** todo texto que se escriba en la app (títulos, botones, avisos, etiquetas, mensajes, placeholders, descripciones, etc.) debe ir **con ortografía correcta** (acentos, tildes, mayúsculas, puntuación). Corríjalo de entrada, sin que se lo pidan cada vez. Si una frase tiene una falta obvia o suena mal, réparla antes de decir "listo". Esto aplica también a los textos de ejemplo y a la documentación en `General/`.

## La llave del `Panel/` — NUNCA al repo

`Panel/` y `Autorizar/` piden una **llave privada JWK** (`{"kty":"EC",...}`).
**No es una API key de Firebase**: es la mitad privada de un par
**ECDSA P-256** para **firmar licencias**.

- La **pública** vive en `taquilla.js` (`TAQUILLA_PUBLICA`) y **si** va al repo:
  solo verifica.
- La **privada** vive **solo en el aparato del desarrollador**, en `localStorage`
  bajo `taquilla_priv`. **Jamás la subas ni la escribas en ningun archivo del
  repo ni en la guia.**
- Ambos usan la **misma** clave de `localStorage` y el **mismo** origen: pegarla
  una vez abre los dos.
- Si se pierde, se genera un par nuevo (con `crypto.subtle`, igual que la app),
  se cambia `TAQUILLA_PUBLICA` y **las licencias viejas dejan de validar**.

Ver `General/GUIA.md`, seccion del autorizador.

## Riesgo conocido (importante, NO urgente)

- **Las reglas de `solicitudes` SI estan cerradas** (6-oct-2026, revisadas por
  Fredy y probadas: pedir, aprobar, revocar y el Panel). Lo unico que sigue
  abierto es `allow read`, **a proposito**: el menu y los juegos leen esa
  coleccion sin sesion y sin internet, y cerrarla rompe el modo sin conexion.
  El texto vigente esta en `General/reglas-firebase-taquilla.txt`.
  **No lo trates como una urgencia ni intentes cerrarlo por tu cuenta.**
- **`Autorizar/index.html` ya esta subido** y su login de Google funciona:
  Fredy probo pedir, aprobar y revocar el 6-oct-2026 y todo respondio normal.
- **Si las compras dejan de funcionar, la causa mas probable es la lista de los
  7 campos** de `create` en las reglas. Lo dice la seccion 3 del archivo de
  reglas, con la forma de comprobarlo.

**Lo que si esta pendiente** es el **permiso de `borrar` en `solicitudes`**: hoy
solo lo tiene el publicador, y el rediseno de la cola lo necesita. Cambiar
reglas es **siempre manual, en la consola**, y hay que probar las 4 cosas de la
seccion 5 de `reglas-firebase-taquilla.txt`.

> **OJO: este permiso esta EN ESPERA (decision de Fredy, oct-2026), no se hace
> ahora.** Como los cinco pasos de licencias, cuelga del cambio de arquitectura
> (login + reglas por correo). Ver `General/GUIA.md`, seccion *Pendientes de
> licencias*.

Ver `General/GUIA.md`, sección "`Autorizar/`: aprobar y revocar licencias".

## La base de cada PAREJA: reglas ABIERTAS a proposito

Los proyectos de cada pareja se instalan con `allow read, write: if true` (asi lo
dice `README.md`, paso 2). **Eso es una decision, no un descuido**, y **no se
cambia**.

**Por que:** la app de la pareja **no inicia sesion** contra su propia base. Lo
verifico Fredy y se confirmo en el codigo: ninguna pagina se autentica (el import
de auth en `Guiadas/` esta de adorno, no se usa). Sin login, las reglas **no
pueden** distinguir a nadie: cerrarlas rompe la app entera.

**La proteccion real (login + reglas por correo) llega con el rediseno de
arquitectura, DESPUES** de terminar y probar la app. Es un proyecto aparte, no un
cambio de reglas.

**Si alguien -persona o modelo- propone "cerrar las reglas de la pareja" o
"ponerle candado a `Citas/actividades.html`": que avise antes.** Ya paso una vez
(oct-2026): sin estar escrito, se propuso cerrarlas y Fredy tuvo que recordar el
acuerdo.

Unico cambio que SI es seguro y no afecta la app: limitar las reglas a las rutas
que la app usa (hoy esta abierto "cualquier ruta"). Eso no protege el contenido,
solo cierra lo que no se usa. **Aun asi, no se hace sin preguntarle a Fredy.**

---

## 📄 Índice de documentación de detalle

Todo el detalle de **pantallas, navegación, estándares de tamaño y moldes A/B** vive en:

**`General/Pantallas.md`**

Consulta ese archivo para:
- Estándares de tamaño de la interfaz (botones, tarjetas, títulos, radios)
- Pantalla nueva = COPIAR una existente (molde A y B, clases CSS)
- Estándar de navegación (botón Volver, submenús, pushState, popstate, hash)
- Dónde va cada "Volver"
- Degradado en los títulos
- Botones de volver y de esquina

Aquí en `AGENTS.md` solo están las **reglas de trabajo** (no tocar sin pedir, máximo 3 intentos, no inventar reglas de Firestore, etc.).
