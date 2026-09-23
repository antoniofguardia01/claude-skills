---
name: examen-cinematico
description: Crea una práctica de repaso interactiva con estética cinematográfica — una sola página HTML con portada animada a pantalla completa, fondo animado temático (células, fibras musculares, moléculas, estrellas, código, mapas, cuaderno…), tipografía display llamativa y transiciones. Por defecto es práctica libre sin cronómetro (una tarjeta a la vez, feedback inmediato, racha), con filtros de tema y tipo de pregunta arriba, botón de pantalla completa arriba a la derecha y un botón "Modo examen" (también arriba a la derecha) para armar un simulacro cronometrado cuando el usuario quiera. Antes de construir, pregunta qué tipos de pregunta quiere (selección única, verdadero/falso, completar espacios, pareo columna A/B, desarrollo con autoevaluación y, solo en biología, ordenar los pasos de un proceso) y qué diseño prefiere, sugiriendo opciones según el contenido. Úsala cuando el usuario pida "usa la skill de examen", "hazme un examen cool/animado/bonito", "un examen interactivo de <tema>", "quiero practicar/repasar para el examen de <tema>" con algo visual, o pase apuntes/PDF/temas y quiera practicar con un diseño que se vea profesional. Si pide además una guía de estudio en Word, combínala con exam-prep-kit.
---

# Examen cinemático

Genera **un solo archivo HTML** (vanilla, sin dependencias salvo Google Fonts) con:

1. **Portada** a pantalla completa en una sola vista: título gigante que entra línea a línea, marco que se dibuja, datos reales de la práctica (preguntas, tipos, temas), botón circular giratorio **Entrenar ahora** que entra directo a la práctica libre, accesos a **Modo examen** y **Por temas**, y cinta de términos clave en movimiento.
2. **Fondo animado temático** en canvas que reacciona al mouse (12 motores, ver `references/temas.md`), grano de película, viñeta, cursor personalizado, botones magnéticos y botón de **pantalla completa** fijo arriba a la derecha (entra y sale, se oculta si el navegador no lo permite).
3. **Práctica libre por defecto, sin cronómetro**: una tarjeta a la vez, feedback inmediato, racha y precisión, con chips de **tema** (en el orden en que se estudian) y **tipo de pregunta** arriba para filtrar al instante, y sin repetir preguntas hasta agotar la mezcla filtrada.
4. **Botón "Modo examen" arriba a la derecha**, siempre visible: arma al vuelo un simulacro realista (largo y tiempo a elegir, o sin tiempo) con los tipos/temas que el usuario tenga filtrados, sin feedback hasta entregar.
5. **Seis tipos de pregunta**: `seleccion`, `vf`, `completar`, `pareo`, `desarrollo` y `ordenar` (este último **solo en exámenes de biología**, ver abajo) — el usuario elige cuáles quiere antes de construir (paso 2 del flujo).
6. **Resultados** (al entregar un Modo examen): porcentaje animado, veredicto, puntos, nota en escala configurable, barras por sección, explosión de glifos si aprueba, **Repetir falladas** (arma un repaso solo con lo que se falló), nuevo intento (rebaraja), mejor puntaje guardado.

La plantilla ya está resuelta y probada. **Tu trabajo es el contenido y la dirección de arte, no la fontanería.**

## Flujo

### 1. Reúne el material
- Si el usuario pasa apuntes, PDFs, fotos, guías o talleres: léelos completos (usa las skills `pdf`/`docx`/`pptx` si hace falta). Cada pregunta debe salir de ese material; conserva la terminología del profesor. No inventes datos que el material no respalde.
- Si pasa un examen anterior del profesor, imita sus tipos de pregunta, redacción de instrucciones y puntajes.
- Si solo da un tema ("hazme un examen de la Revolución Francesa"), escribe con conocimiento sólido y de nivel escolar/universitario según el contexto, y dilo en una línea al entregar.
- Si no está claro el nivel o el alcance y no hay material, pregunta una sola vez; si hay material, no preguntes: decide tú.

### 2. Pregunta tipos y diseño antes de construir
Con el material ya leído (o el tema entendido), **antes de escribir el JSON o tocar la plantilla**, lanza con `AskUserQuestion` dos preguntas en una sola llamada. Sáltate la que el usuario ya haya contestado en su pedido original (p. ej. si ya dijo "quiero pareo y desarrollo", no vuelvas a preguntar tipos).

1. **Tipos de pregunta** (multiSelect): ofrece como opciones los tipos que de verdad encajan con *ese* material —no la lista completa por rutina—, y di por qué en la descripción de cada opción (ej.: "Pareo — tu apunte trae varias tablas término↔definición", "Ordenar — el proceso de coagulación tiene pasos numerados", "Desarrollo — hay preguntas de razonamiento en el examen de muestra"). 4 opciones como máximo; dejas fuera lo que no aplica (no ofrezcas `ordenar` si no es biología o si nada tiene secuencia). El usuario puede escribir su propia combinación con "Otro".
2. **Diseño** (single select): arma 2–3 presets concretos a partir de `references/temas.md`, ya personalizados al tema exacto (motor + acento + un detalle de `glifos` o paleta), y descríbelos en una frase visual, no con el nombre técnico del motor (ej.: "Rojo músculo sobre fibras que se contraen al pasar el mouse" en vez de "fibras"). Incluye siempre una cuarta opción tipo "Descríbemelo tú" para que el usuario proponga su propia dirección de arte en vez de elegir un preset.

Espera las dos respuestas antes de seguir: determinan qué secciones del `banco` escribes en el paso 4 y qué preset aplicas en el paso 3.

### 3. Dirige el arte
Con el diseño ya elegido (preset sugerido o descripción propia del usuario), lee `references/temas.md` si no lo hiciste para armar las opciones. Elige el **motor** que mejor represente el tema *concreto*, no solo la materia (ej.: sistema circulatorio → `pulso`; células → `celulas`; músculos y huesos → `fibras`; Guerra Fría → `brasas`; ecosistemas marinos → `flujo`). Parte del preset y **personaliza**:
- `glifos` con símbolos del tema (siempre).
- Acento/paleta si el tema lo pide (ej.: fotosíntesis → verde clorofila en `celulas`; Egipto → oro/arena en `brasas`).
- `tituloLineas` para cortar el título con intención (2–3 líneas; la última se pinta con el acento por defecto; `estiloUltimaLinea: "ol"` la hace contorno).
- `terminos`: 8–14 conceptos clave para la cinta de la portada.
- `descripcion`: 1–2 frases con voz propia, concretas al tema. Nada de "¡Pon a prueba tus conocimientos!" ni frases genéricas.

No reescribas el CSS de la plantilla para "hacerlo más bonito": el diseño ya evita los clichés de IA (degradados morados, tarjetas redondeadas con emoji, sombras de colores). Solo toca `assets/template.html` si falta una capacidad real (ver *Extender*).

### 4. Escribe el JSON del examen — práctica infinita (`banco`, formato por defecto)
Todo examen nuevo se construye así salvo que el usuario pida explícitamente el formato fijo de una sola pasada (ver 4b). Ejemplo completo y válido: `assets/ejemplo-banco-inmune.json` (sistema inmune, los 6 tipos, 3 temas en orden). El JSON lleva:

```jsonc
"examen": {
  "...": "mismos metadatos que en 4b (materia, curso, etiqueta, titulo, tituloLineas, descripcion, escala, barajar, terminos, textoBoton); omite 'duracion' — en práctica no hay cronómetro, el tiempo se elige al entrar a Modo examen",
  "temas": [{"id": "somatotipos", "nombre": "Somatotipos"}, ...],
  "accesos": [{"texto": "Movimientos articulares", "detalle": "Solo la tabla ↗", "temas": ["mov-..."], "tipos": ["pareo"]}], // atajos en la portada (opcional)
  "tituloLibre": "Entrena", "subtituloLibre": "sin reloj",
  "simulacro": {"pesos": {"seleccion": .36, "vf": .22, "completar": .18, "ordenar": .14, "pareo": .16, "desarrollo": .08}}, // opcional
  "banco": {
    "seleccion": [{"tema": "somatotipos", "pregunta": "…", "opciones": [...], "correcta": 0, "explicacion": "…", "imagen": "img/x.jpg"}],
    "vf": [{"tema": "…", ...}], "completar": [{"tema": "…", ...}], "desarrollo": [{"tema": "…", ...}],
    "ordenar": [{"tema": "…", "enunciado": "…", "pasos": ["…", "…", "…"], "explicacion": "…"}], // solo biología
    "pareo": [{"tema": "…", "titulo": "Imagen ↔ movimiento", "instrucciones": "…", "max": 6,
               "pares": [{"a": "Texto"}|{"imagen": "img/x.jpg", "a": ""}, "b": "…"], "distractores": ["…"]}]
  }
}
```

`temas` define el orden de los chips de filtro y del picker "Por temas" arriba de la práctica: ponlos **en el mismo orden en que la unidad los enseña** (el orden del temario/índice), no alfabético ni al azar. Escribe `banco.<tipo>` solo para los tipos que el usuario eligió en el paso 2 (puedes repetir tipo con distinto `tema`; no hay límite de ítems, cuantos más mejor).

**Calidad del contenido — lo que hace que el repaso sirva** (aplica igual aquí que a `secciones[].items` en 4b):
- **Cantidad**: exprime el material — cuantos más ítems por tipo/tema, mejor "se siente" infinita la práctica. Sigue el formato del profesor si hay uno. Cubre los tipos que el usuario eligió en el paso 2.
- **Selección**: 4 opciones plausibles del mismo tipo gramatical y longitud parecida; distractores con los errores reales que cometen los estudiantes (términos que se confunden), nunca opciones absurdas. Varía la posición de la correcta (igual se baraja). Evita "todas las anteriores" (se rompe al barajar).
- **V/F**: ~mitad falsas; las falsas cambian un solo detalle clave. `explicacion` obligatoria en las falsas, diciendo lo correcto.
- **Ordenar (solo biología)**: úsalo **solo si el examen es de biología** —y solo para procesos que de verdad tienen una secuencia: potencial de acción, sinapsis, mitosis y meiosis, fotosíntesis, digestión, coagulación, respuesta inmune, ciclo celular, recorrido de la sangre o del estímulo nervioso. En cualquier otra materia no lo incluyas. El alumno toca los pasos en el orden en que ocurren y se puntúa por pasos en su lugar, así que: 4–6 pasos (nunca más de 8), cada paso una frase corta y autocontenida, **`pasos` va en el orden correcto** (la plantilla los baraja sola y nunca los muestra ya resueltos), sin dos pasos intercambiables y sin pistas de orden dentro del texto ("primero…", "después…"). Si el material trae el proceso numerado (apuntes, diagrama o video), respeta esa numeración.
- **Pareo**: cada bloque del banco es un *pool* de 5–8+ pares del mismo subtema + 1–3 `distractores` del mismo campo. Columna A corta (término), B descriptiva. Un bloque por subtema.
- **Completar**: un espacio (`___`, 3+ guiones bajos) por concepto clave; `respuestas` con variantes aceptables (sin tilde, singular/plural). La corrección ya ignora mayúsculas, tildes y puntuación, pero no sinónimos. `banco: true` en el ítem muestra las palabras (útil si el profesor lo hace así).
- **Desarrollo**: `respuesta` modelo como la escribiría un estudiante de 10; 4–9 `claves` (ideas que el profesor buscaría), cada una con alternativas `|` sin tildes ni mayúsculas necesarias (`"acetilcolina|ach"`). La nota sugerida sale de cuántas claves aparecen; el estudiante la confirma con Completa/Parcial/Me faltó.
- **`explicacion`**: añádela donde el error es común; es lo que convierte el examen en repaso.
- `imagen` acepta rutas relativas: copia las imágenes a la carpeta de salida (fondo blanco, se muestran con marco).

**Cómo se juega:**
- **Práctica libre** (siempre lo que se ve primero, sin cronómetro): una tarjeta a la vez, feedback inmediato, racha y precisión. Arriba, los filtros de **tipo de pregunta** y **tema** (chips, en el orden de `temas`) se recuerdan en el navegador. Cada pareo del banco es un *pool*: se sacan hasta `max` pares al azar y las B sobrantes sirven de distractores.
  - **Los filtros aplican al instante**: cada cambio de chip reemplaza la pregunta de turno por una de la mezcla nueva (con un pequeño retardo para agrupar clics seguidos). Si la pregunta no se había respondido, se descarta y no cuenta como vista; si ya se respondió, queda en el historial (← Anterior).
  - **Repetir** (botón siempre visible en la tarjeta): vuelve a plantear la misma pregunta desde cero, rebarajando opciones (en pareo, los mismos pares). Si ya se había respondido, ese intento cuenta en las estadísticas antes de repetir.
  - **Sin repeticiones hasta agotar la mezcla**: no sale una pregunta ya vista mientras queden sin ver con esos filtros; el panel muestra "vistas X de N". Cuando se acaban, la siguiente tarjeta muestra el aviso *Mezcla completada* (y un toast) y empieza una nueva vuelta.
- **Modo examen, a demanda**: el botón **arriba a la derecha** de la barra superior (y el acceso en la portada) deja entrar a un simulacro cronometrado cuando el usuario quiera — la práctica en sí nunca tiene cronómetro. Arma un examen al azar con los tipos/temas elegidos, largo (15/30/50) y tiempo opcional (sin tiempo/20/40/60). Resultados con nota, revisión, repetir falladas y "otro examen". No hay que configurar nada aparte para habilitarlo: funciona en cuanto hay `banco`.
- El botón de **pantalla completa** (arriba a la derecha, fijo) y la vuelta a la portada están siempre visibles, en la práctica y en cualquier modo.
- **Imágenes del PDF**: recórtalas con PyMuPDF usando los rectángulos de `page.get_image_rects()` (no la celda de la tabla, que arrastra bordes) a 220 dpi y guárdalas en `img/`. Úsalas en `seleccion.imagen` y en pares de pareo con `imagen`.
- Para probar con imágenes relativas, sirve la carpeta por HTTP (la vista de `file://` del navegador integrado no las carga).

### 4b. Formato alternativo: examen fijo de una sola pasada (`secciones`)
El formato **por defecto** para cualquier examen nuevo es la práctica infinita del paso 4 (`banco`), no este. Usa `secciones` **solo** si el usuario pide explícitamente un examen de una sola pasada —para imprimir, entregar tal cual o cronometrar de punta a punta— sin práctica libre ni filtros por tema/tipo.

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

`titulo`, `instrucciones` y `puntos` de cada sección son opcionales (hay textos por defecto; `puntos` = 1, 2 en ordenar, 3 en desarrollo). Puedes repetir tipos (dos secciones de selección sobre subtemas distintos, dos pareos). La calidad de cada ítem sigue las mismas reglas que arriba en el paso 4 (cantidad, distractores, V/F, pareo, completar, desarrollo, `explicacion`).

### 5. Compila y valida
```bash
node ~/.claude/skills/examen-cinematico/scripts/build_exam.mjs examen.json index.html
```
El script valida estructura (índices, espacios vs. respuestas, distractores que coinciden con respuestas, motores y colores), **comprueba contraste WCAG** de la paleta e inyecta el JSON en la plantilla. Corrige cada error y vuelve a compilar. Atiende los avisos ⚠ salvo que tengas una razón.

### 6. Verifica en el navegador
Abre `index.html` en el navegador integrado (`preview_start` con `url` file:///…; la carpeta debe estar dentro del proyecto). Si una captura sale solo con el fondo, la pestaña estaba en segundo plano: tráela al frente (`tabs_select`) y recarga. Revisa:
- Portada: el título cabe completo (tildes visibles), nada se superpone con el botón circular, se ve el fondo animado.
- Entra a la práctica libre: confirma que arriba salen los chips de **tema** (en el orden de `temas`) y de **tipo de pregunta**, que no hay cronómetro corriendo, y que el botón de **pantalla completa** (arriba a la derecha, fijo) funciona.
- Pulsa el botón **Modo examen** de la barra superior, arma un simulacro corto y confirma que ahí sí aparece el cronómetro (si eliges tiempo) y que "Entregar" lleva a resultados.
- Responde algo en cada tipo (en pareo une 2–3 pares y confirma que aparecen las líneas; en ordenar toca los pasos y comprueba que se numeran y que "Reiniciar" los limpia).
- Repite la portada y la práctica con `resize_window` preset `mobile`; al terminar vuelve a `desktop`.
- `read_console_messages` sin errores.

### 7. Entrega
- Deja `index.html` (+ `examen.json` y las imágenes) en una carpeta con nombre del tema, en el lugar que diga el usuario o en el directorio de trabajo.
- Resume en 2–4 líneas: tipos de pregunta y cantidad de preguntas (los que se eligieron en el paso 2), motor/estilo elegido y por qué encaja con el tema, y cualquier contenido que escribiste sin material de respaldo.
- Ofrece publicarlo. No hagas push ni publiques sin que lo pida.
- **Si pide GitHub + Vercel**: `git init -b main`, commit, `gh repo create <usuario>/<nombre> --private --source=. --remote=origin --push`. Luego en la carpeta: `npx vercel@latest link --yes --project <nombre>` y `npx vercel@latest git connect <url-del-repo> --yes`; cada push a `main` despliega a producción (`https://<nombre>.vercel.app`). Si el conector MCP de Vercel da 403 de *scope*, usa la CLI (tiene la sesión del usuario). Añade `.vercel` y `.env.local` al `.gitignore`.

## Extender
- **Nuevo motor de fondo**: agrega una función en el objeto `ENG` de `assets/template.html` (patrón `nombre(){let estado; return {init(){…}, frame(t,k){…}}}`; `k` = factor de frame ≈1 a 60 fps; colores con `col(A1|A2|INK|BG, alfa)`; mouse en `mouse.x/y`, suavizado en `mouse.sx/sy` 0–1), añádelo a `MOTORES` en el build y documéntalo en `temas.md`.
- **Nuevo tipo de pregunta**: añade el caso en `unitHTML` (render), `score` (puntaje) y el manejador `data-act` en `wireApp`, además de la validación en el build. Mantén el vocabulario visual: `.opt` / `.sel` / `.ok` / `.bad` / `.dim` y `fb()` para el feedback.
