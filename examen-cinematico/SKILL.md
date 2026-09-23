---
name: examen-cinematico
description: Crea prácticas/exámenes de repaso interactivos con estética cinematográfica — una sola página HTML con portada animada a pantalla completa, fondo animado temático (células, fibras musculares, moléculas, estrellas, código, mapas, cuaderno…), tipografía display llamativa y transiciones, más secciones de selección única, verdadero/falso, completar espacios, ordenar los pasos de un proceso (en biología), pareo columna A/B con líneas que conectan y desarrollo con respuesta modelo y autoevaluación, con resultados, nota y "repetir falladas". Por defecto arma **práctica libre sin cronómetro** con filtros de tema y tipo de pregunta arriba y un botón de **Modo examen** arriba a la derecha para entrar a un simulacro cuando quieras, más botón de pantalla completa. Antes de generar nada, pregunta qué tipos de pregunta y qué diseño quieres (con opciones sugeridas según el contenido, y opción de que tú lo definas). Úsala cuando el usuario pida "usa la skill de examen", "hazme un examen cool/animado/bonito", "un examen interactivo de <tema>", "examen con pareo y desarrollo", "quiero repasar para el examen de <tema>" con algo visual, o pase apuntes/PDF/temas y quiera un examen para practicar que se vea profesional. Si pide además una guía de estudio en Word, combínala con exam-prep-kit.
---

# Examen cinemático

Genera **un solo archivo HTML** (vanilla, sin dependencias salvo Google Fonts) con:

1. **Portada** a pantalla completa en una sola vista: título gigante que entra línea a línea, marco que se dibuja, datos reales del examen (preguntas, secciones, puntos, tiempo), botón circular giratorio **Comenzar examen**, accesos a **Modo repaso** y **Por secciones**, y cinta de términos clave en movimiento.
2. **Fondo animado temático** en canvas que reacciona al mouse (10 motores, ver `references/temas.md`), grano de película, viñeta, cursor personalizado, botones magnéticos y botón de **pantalla completa** arriba a la derecha (entra y sale, se oculta si el navegador no lo permite).
3. **Examen** por secciones con barra superior fija (navegación por sección con progreso, cronómetro o cuenta regresiva, entregar), portadas de sección con número gigante y título con efecto "scramble", transiciones de barrido a pantalla completa entre secciones.
4. **Tipos de sección**: `seleccion`, `completar`, `pareo`, `desarrollo` y `ordenar` (este último **solo en exámenes de biología**, ver abajo). También existe `vf` (verdadero/falso), pero **no se usa por defecto**: solo inclúyelo si el usuario lo pide explícitamente (ver paso 2).
5. **Tres modos**: *Examen* (sin feedback hasta entregar), *Repaso* (feedback inmediato por pregunta), *Revisión* (todo corregido con explicaciones).
6. **Resultados**: porcentaje animado, veredicto, puntos, nota en escala configurable, barras por sección, explosión de glifos si aprueba, **Repetir falladas** (arma un repaso solo con lo que se falló), nuevo intento (rebaraja), mejor puntaje guardado.

La plantilla ya está resuelta y probada. **Tu trabajo es el contenido y la dirección de arte, no la fontanería.**

## Flujo

### 1. Reúne el material
- Si el usuario pasa apuntes, PDFs, fotos, guías o talleres: léelos completos (usa las skills `pdf`/`docx`/`pptx` si hace falta). Cada pregunta debe salir de ese material; conserva la terminología del profesor. No inventes datos que el material no respalde.
- Si pasa un examen anterior del profesor, imita sus tipos de pregunta, redacción de instrucciones y puntajes.
- Si solo da un tema ("hazme un examen de la Revolución Francesa"), escribe con conocimiento sólido y de nivel escolar/universitario según el contexto, y dilo en una línea al entregar.

### 2. Pregunta antes de construir
Antes de escribir una sola pregunta, usa `AskUserQuestion` (dos preguntas, una sola vez) — **no lo saltes aunque haya material**, salvo que el usuario ya haya dicho explícitamente qué tipos y qué estilo quiere en su pedido:

- **Tipos de pregunta**: propone 3–4 combinaciones concretas ya pensadas para *ese* contenido (no una lista genérica de los seis tipos). Ejemplos de cómo derivarlas del material: si hay procesos con pasos (mitosis, digestión, sinapsis) ofrece una combinación que incluya `ordenar`; si hay mucho vocabulario/definiciones, una con `pareo` + `completar` fuertes; si el profesor pide argumentar, una con `desarrollo`; siempre incluye una opción "de todo un poco" (`seleccion`, `completar`, `pareo`, `desarrollo` y `ordenar` si aplica, balanceados). **No ofrezcas `vf` (verdadero/falso) como parte de ninguna combinación por defecto**; solo aparece si el usuario lo escribe explícitamente en la opción de texto libre. Última opción siempre: que el usuario escriba lo que quiere en texto libre.
- **Diseño**: propone 2–3 motores/paletas concretos de `references/temas.md` que encajen con el tema *específico* del contenido (no solo la materia general), describiendo en una frase corta qué se ve (ej. "`fibras` — fibras musculares que se contraen al pasar el mouse"). Última opción: que el usuario describa el estilo que quiere.
- **Formato**: a menos que el usuario ya haya pedido un examen fijo cronometrado, asume que quiere **práctica infinita sin cronómetro** (`banco`, ver 4b) como modo principal, con el interruptor de **Modo examen** en la barra superior para entrar a un simulacro cuando quiera — es el formato por defecto de esta skill. Solo pregunta si hay ambigüedad real entre "quiero practicar" y "quiero un examen fijo para entregar/tomar una sola vez".

Con las respuestas, sigue sin volver a preguntar el resto del proceso.

### 3. Dirige el arte
Lee `references/temas.md`. Elige el **motor** que mejor represente el tema *concreto*, no solo la materia (ej.: sistema circulatorio → `pulso`; células → `celulas`; músculos y huesos → `fibras`; Guerra Fría → `brasas`; ecosistemas marinos → `flujo`). Parte del preset y **personaliza**:
- `glifos` con símbolos del tema (siempre).
- Acento/paleta si el tema lo pide (ej.: fotosíntesis → verde clorofila en `celulas`; Egipto → oro/arena en `brasas`).
- `tituloLineas` para cortar el título con intención (2–3 líneas; la última se pinta con el acento por defecto; `estiloUltimaLinea: "ol"` la hace contorno).
- `terminos`: 8–14 conceptos clave para la cinta de la portada.
- `descripcion`: 1–2 frases con voz propia, concretas al tema. Nada de "¡Pon a prueba tus conocimientos!" ni frases genéricas.

No reescribas el CSS de la plantilla para "hacerlo más bonito": el diseño ya evita los clichés de IA (degradados morados, tarjetas redondeadas con emoji, sombras de colores). Solo toca `assets/template.html` si falta una capacidad real (ver *Extender*).

### 4. Escribe el JSON del examen
Crea `<carpeta-de-salida>/examen.json` con `{ "tema": {...}, "examen": {...} }`. Ejemplo completo y válido: `assets/ejemplo-musculoesqueletico.json`.

```jsonc
"examen": {
  "materia": "Biología XII",              // esquina superior izq.
  "curso": "Unidad 3 · Sistema circulatorio", // opcional, debajo de materia
  "etiqueta": "Parcial de repaso",        // centro superior (opcional)
  "titulo": "Sistema Circulatorio",
  "tituloLineas": ["Sistema", "Circulatorio"], // opcional
  "descripcion": "…",
  "duracion": 40,                         // minutos, opcional → cuenta regresiva y auto-entrega
  "escala": {"min": 1, "max": 5, "aprobado": 3}, // opcional → muestra nota
  "barajar": true,                        // baraja preguntas y opciones en cada intento (default true)
  "terminos": ["…"],
  "textoBoton": "Comenzar examen",        // opcional
  "secciones": [
    {"tipo": "seleccion", "titulo": "Selección única", "instrucciones": "…", "puntos": 1,
     "items": [{"pregunta": "…", "opciones": ["…","…","…","…"], "correcta": 0, "explicacion": "…", "tema": "Subtema", "imagen": "img/fig1.png"}]},
    {"tipo": "vf", "items": [{"afirmacion": "…", "respuesta": false, "explicacion": "…"}]},
    {"tipo": "completar", "banco": true, "distractores": ["…"],
     "items": [{"texto": "El ___ bombea sangre hacia la ___.", "respuestas": [["corazón","corazon"], ["aorta"]]}]},
    {"tipo": "ordenar", "puntos": 2,       // SOLO biología: procesos con pasos en secuencia
     "items": [{"enunciado": "Ordene los pasos de la sinapsis.", "pasos": ["Primer paso…", "Segundo paso…", "Tercero…"], "explicacion": "…"}]},
    {"tipo": "pareo", "instrucciones": "…", "pares": [{"a": "Concepto", "b": "Definición"}], "distractores": ["Definición que sobra"]},
    {"tipo": "desarrollo", "puntos": 3,
     "items": [{"pregunta": "…", "respuesta": "Respuesta modelo completa…", "claves": ["idea 1", "sinónimo a|sinónimo b"], "pista": "opcional"}]}
  ]
}
```

`titulo`, `instrucciones` y `puntos` de cada sección son opcionales (hay textos por defecto; `puntos` = 1, 2 en ordenar, 3 en desarrollo). Puedes repetir tipos (dos secciones de selección sobre subtemas distintos, dos pareos).

**Calidad del contenido — lo que hace que el repaso sirva:**
- **Cantidad**: un examen normal ≈ 20–40 ítems en 4–5 secciones. Sigue el formato del profesor si hay uno. Incluye todos los tipos que pidió el usuario; por defecto: selección, pareo, completar y desarrollo (sin V/F, ver paso 2).
- **Selección**: 4 opciones plausibles del mismo tipo gramatical y longitud parecida; distractores con los errores reales que cometen los estudiantes (términos que se confunden), nunca opciones absurdas. Varía la posición de la correcta (igual se baraja). Evita "todas las anteriores" (se rompe al barajar).
- **V/F** (solo si el usuario lo pide explícitamente): ~mitad falsas; las falsas cambian un solo detalle clave. `explicacion` obligatoria en las falsas, diciendo lo correcto.
- **Ordenar (solo biología)**: úsalo **solo si el examen es de biología** —y solo para procesos que de verdad tienen una secuencia: potencial de acción, sinapsis, mitosis y meiosis, fotosíntesis, digestión, coagulación, respuesta inmune, ciclo celular, recorrido de la sangre o del estímulo nervioso. En cualquier otra materia no lo incluyas. El alumno toca los pasos en el orden en que ocurren y se puntúa por pasos en su lugar, así que: 4–6 pasos (nunca más de 8), cada paso una frase corta y autocontenida, **`pasos` va en el orden correcto** (la plantilla los baraja sola y nunca los muestra ya resueltos), sin dos pasos intercambiables y sin pistas de orden dentro del texto ("primero…", "después…"). Si el material trae el proceso numerado (apuntes, diagrama o video), respeta esa numeración. Vale un `ordenar` por proceso; 1–3 en todo el examen.
- **Pareo**: 5–8 pares por bloque + 1–3 `distractores` del mismo campo. Columna A corta (término), B descriptiva. Un bloque por subtema.
- **Completar**: un espacio (`___`, 3+ guiones bajos) por concepto clave; `respuestas` con variantes aceptables (sin tilde, singular/plural). La corrección ya ignora mayúsculas, tildes y puntuación, pero no sinónimos. `banco: true` muestra las palabras (útil si el profesor lo hace así).
- **Desarrollo**: `respuesta` modelo como la escribiría un estudiante de 10; 4–9 `claves` (ideas que el profesor buscaría), cada una con alternativas `|` sin tildes ni mayúsculas necesarias (`"acetilcolina|ach"`). La nota sugerida sale de cuántas claves aparecen; el estudiante la confirma con Completa/Parcial/Me faltó.
- **`explicacion`**: añádela donde el error es común; es lo que convierte el examen en repaso.
- `imagen` acepta rutas relativas: copia las imágenes a la carpeta de salida (fondo blanco, se muestran con marco).

### 4b. Modo infinito (banco + filtros + simulacro)
Es el **formato por defecto** de esta skill (ver paso 2): práctica sin cronómetro con modo examen opcional. Úsalo también cuando el usuario lo pida explícitamente con "infinito", "con muchas preguntas" o "que pueda escoger tipo y tema". En vez de `secciones`, el JSON lleva:

```jsonc
"examen": {
  "...": "mismos metadatos de arriba",
  "temas": [{"id": "somatotipos", "nombre": "Somatotipos"}, ...],
  "accesos": [{"texto": "Movimientos articulares", "detalle": "Solo la tabla ↗", "temas": ["mov-..."], "tipos": ["pareo"]}], // atajos en la portada (opcional)
  "tituloLibre": "Entrena", "subtituloLibre": "sin reloj",
  "simulacro": {"pesos": {"seleccion": .40, "completar": .22, "ordenar": .14, "pareo": .16, "desarrollo": .08}}, // opcional; agrega "vf" solo si el usuario lo pidió
  "banco": {
    "seleccion": [{"tema": "somatotipos", "pregunta": "…", "opciones": [...], "correcta": 0, "explicacion": "…", "imagen": "img/x.jpg"}],
    "completar": [{"tema": "…", ...}], "desarrollo": [{"tema": "…", ...}], // "vf" también existe pero no se usa por defecto
    "ordenar": [{"tema": "…", "enunciado": "…", "pasos": ["…", "…", "…"], "explicacion": "…"}], // solo biología
    "pareo": [{"tema": "…", "titulo": "Imagen ↔ movimiento", "instrucciones": "…", "max": 6,
               "pares": [{"a": "Texto"}|{"imagen": "img/x.jpg", "a": ""}, "b": "…"], "distractores": ["…"]}]
  }
}
```
- **Práctica libre**: una tarjeta a la vez, sin reloj, feedback inmediato, racha y precisión. Chips para elegir tipos y temas (se recuerdan en el navegador). Cada pareo del banco es un *pool*: se sacan hasta `max` pares al azar y las B sobrantes sirven de distractores.
  - **Los filtros aplican al instante**: cada cambio de chip reemplaza la pregunta de turno por una de la mezcla nueva (con un pequeño retardo para agrupar clics seguidos). Si la pregunta no se había respondido, se descarta y no cuenta como vista; si ya se respondió, queda en el historial (← Anterior).
  - **Repetir** (botón siempre visible en la tarjeta): vuelve a plantear la misma pregunta desde cero, rebarajando opciones (en pareo, los mismos pares). Si ya se había respondido, ese intento cuenta en las estadísticas antes de repetir.
  - **Sin repeticiones hasta agotar la mezcla**: no sale una pregunta ya vista mientras queden sin ver con esos filtros; el panel muestra "vistas X de N". Cuando se acaban, la siguiente tarjeta muestra el aviso *Mezcla completada* (y un toast) y empieza una nueva vuelta.
- **Modo examen**: interruptor en la barra superior (siempre visible) o botón en la portada. Arma un examen al azar con los tipos/temas elegidos, largo (15/30/50) y tiempo opcional (sin tiempo/20/40/60). Resultados con nota, revisión, repetir falladas y "otro examen".
- **Volumen**: "infinito" = exprime el material. Para tablas (músculos, fechas, fórmulas) escribe un pequeño generador en Python dentro del proyecto (`tools/generar_banco.py`) que produzca familias de preguntas (dato→concepto, concepto→dato, opuestos, imagen→concepto) y revisa una muestra impresa buscando errores gramaticales antes de compilar.
- **Imágenes del PDF**: recórtalas con PyMuPDF usando los rectángulos de `page.get_image_rects()` (no la celda de la tabla, que arrastra bordes) a 220 dpi y guárdalas en `img/`. Úsalas en `seleccion.imagen` y en pares de pareo con `imagen`.
- Para probar con imágenes relativas, sirve la carpeta por HTTP (la vista de `file://` del navegador integrado no las carga).

### 5. Compila y valida
```bash
node ~/.claude/skills/examen-cinematico/scripts/build_exam.mjs examen.json index.html
```
El script valida estructura (índices, espacios vs. respuestas, distractores que coinciden con respuestas, motores y colores), **comprueba contraste WCAG** de la paleta e inyecta el JSON en la plantilla. Corrige cada error y vuelve a compilar. Atiende los avisos ⚠ salvo que tengas una razón.

### 6. Verifica en el navegador
Abre `index.html` en el navegador integrado (`preview_start` con `url` file:///…; la carpeta debe estar dentro del proyecto). Si una captura sale solo con el fondo, la pestaña estaba en segundo plano: tráela al frente (`tabs_select`) y recarga. Revisa:
- Portada: el título cabe completo (tildes visibles), nada se superpone con el botón circular, se ve el fondo animado.
- Entra al examen, responde algo en cada tipo (en pareo une 2–3 pares y confirma que aparecen las líneas; en ordenar toca los pasos y comprueba que se numeran y que "Reiniciar" los limpia), entrega y mira resultados y revisión.
- Repite la portada y una sección con `resize_window` preset `mobile`; al terminar vuelve a `desktop`.
- `read_console_messages` sin errores.

### 7. Entrega
- Deja `index.html` (+ `examen.json` y las imágenes) en una carpeta con nombre del tema, en el lugar que diga el usuario o en el directorio de trabajo.
- Resume en 2–4 líneas: secciones y cantidad de preguntas, motor/estilo elegido y por qué encaja con el tema, y cualquier contenido que escribiste sin material de respaldo.
- Ofrece publicarlo. No hagas push ni publiques sin que lo pida.
- **Si pide GitHub + Vercel**: `git init -b main`, commit, `gh repo create <usuario>/<nombre> --private --source=. --remote=origin --push`. Luego en la carpeta: `npx vercel@latest link --yes --project <nombre>` y `npx vercel@latest git connect <url-del-repo> --yes`; cada push a `main` despliega a producción (`https://<nombre>.vercel.app`). Si el conector MCP de Vercel da 403 de *scope*, usa la CLI (tiene la sesión del usuario). Añade `.vercel` y `.env.local` al `.gitignore`.

## Extender
- **Nuevo motor de fondo**: agrega una función en el objeto `ENG` de `assets/template.html` (patrón `nombre(){let estado; return {init(){…}, frame(t,k){…}}}`; `k` = factor de frame ≈1 a 60 fps; colores con `col(A1|A2|INK|BG, alfa)`; mouse en `mouse.x/y`, suavizado en `mouse.sx/sy` 0–1), añádelo a `MOTORES` en el build y documéntalo en `temas.md`.
- **Nuevo tipo de pregunta**: añade el caso en `unitHTML` (render), `score` (puntaje) y el manejador `data-act` en `wireApp`, además de la validación en el build. Mantén el vocabulario visual: `.opt` / `.sel` / `.ok` / `.bad` / `.dim` y `fb()` para el feedback.
- Si el usuario quiere práctica infinita con filtros por subtema en vez de un examen fijo, eso es `exam-prep-kit`.
