# Patrones de formato de examen

Catálogo de los tipos de pregunta que el motor de práctica (`assets/exam_template.html`) sabe reproducir, más las convenciones típicas que se han observado en exámenes reales (parciales de biología de secundaria en Panamá, formato "Colegio San Agustín / Depto. de Ciencias Naturales", pero generalizable). Cuando el estudiante sube un examen de muestra, compara contra estos patrones para identificar cuáles usa su profesor y con qué convenciones exactas.

## 1. Selección única

**Qué es:** opción múltiple clásica, normalmente 3-4 alternativas (A/B/C o A/B/C/D).

**Convenciones observadas:**
- Tabla de dos columnas: casilla a la izquierda para escribir la letra en mayúscula, enunciado + opciones a la derecha.
- Instrucción típica: *"Lea el enunciado, seleccione la letra que corresponde a la respuesta correcta, encierre en un círculo la letra y escriba la letra mayúscula en el espacio a la izquierda."*
- Puntaje por pregunta suele ser uniforme dentro de esa sección (ej. 20 preguntas ÷ 20 puntos = 1 punto c/u).
- Las opciones casi siempre incluyen un distractor "cercano" (término que se confunde fácilmente con la respuesta correcta) — vale la pena replicar ese nivel de dificultad, no usar distractores obviamente absurdos.

**Estructura de datos (`SELECCION`):**
```js
{q:"texto de la pregunta", opts:["A","B","C","D"], a:0, topics:["id_tema"]}
```
`a` es el índice (0-based) de la opción correcta dentro de `opts`. El motor baraja el orden de las opciones en cada render, así que no depende de la posición.

## 2. Pareo (matching) con banco de códigos

**Qué es:** una columna de enunciados/descripciones a la izquierda, y un "banco de palabras" con códigos (normalmente 2 letras, ej. `RT`, `MH`, `SK`) que representan términos. El estudiante escribe el código que corresponde a cada enunciado.

**Convenciones observadas:**
- El banco se presenta en un bloque separado arriba de la lista, con formato `CÓDIGO. Término` repetido en línea o en cuadrícula.
- Instrucción típica: *"Lea los enunciados de la tabla y escoja los términos que se relacionan del banco de palabras. Escriba en el espacio a la izquierda las letras en mayúscula que corresponden a los términos descritos. Términos del banco de palabras pueden repetirse o no utilizarse."*
- Es clave incluir **algunos códigos del banco que no se usan** en ningún enunciado (distractores) — esto es parte del formato real, no un detalle opcional.
- Los códigos no necesitan seguir un orden lógico (no es A, B, C…) — de hecho lucen más auténticos si son códigos de 2 letras aparentemente arbitrarios.

**Estructura de datos (`PAREO_SETS`):**
```js
{
  titulo:"Nombre del set",
  topics:["id_tema"],
  banco:[{code:"RT", term:"..."}, ...],       // incluir 1-3 códigos "de más" sin usar
  items:[{desc:"enunciado", code:"RT"}, ...]  // code debe existir en banco
}
```
El motor baraja tanto el orden del banco como el de los enunciados en cada render.

## 3. Complete los espacios (llenar espacios)

**Qué es:** frases con un espacio en blanco a completar con el término correcto. En los exámenes reales a veces aparece como tabla con sub-incisos (a, b, c) o pidiendo "mencione 3 ejemplos de…", o como un cuadro a completar con columnas (ej. Hallazgo / Etapa afectada / Causa).

**Convenciones observadas:**
- Puntaje suele ser más alto que selección única (ej. 55-95 puntos repartidos entre menos ítems), reflejando que no hay pistas de opciones.
- Preguntas de "mencione 2/3 elementos de X" son comunes — para el motor de práctica, lo más simple es convertir cada elemento esperado en su propio ítem de llenar-espacio individual en vez de un solo campo con 3 respuestas.
- Cuadros a completar con varias columnas (como en el caso clínico de la nefrona) se pueden modelar como una serie de ítems de `fill` cortos, uno por celda, agrupados bajo el mismo `topics`.

**Estructura de datos (`FILLBLANK`):**
```js
{sent:"Frase con un ___ para completar.", ans:["respuesta", "sinonimo aceptado"], topics:["id_tema"]}
```
El checker normaliza minúsculas/acentos/espacios extra, así que en `ans` no hace falta listar variantes de tilde — sí conviene listar sinónimos reales (ej. `["helicobacter pylori","h. pylori"]`).

## 4. Ordenar (secuencia)

**Qué es:** una lista de pasos/eventos desordenados que el estudiante debe numerar en el orden correcto. El formato real casi siempre incluye **opciones que no se usan** (no pertenecen a la secuencia) para evitar que se pueda adivinar por eliminación.

**Convenciones observadas:**
- Instrucción típica: *"Ordene, iniciando con el 1, los componentes que permiten el proceso. IMPORTANTE: hay opciones que no se usan."*
- Buenos candidatos: ciclos biológicos (ciclo de vida de un virus, ciclo cardíaco), rutas de una sustancia por el cuerpo (ej. CO₂ desde un capilar hasta ser exhalado), mecanismos fisiológicos con pasos claros (fiebre, coagulación, respuesta alérgica), progresión de una enfermedad.
- No conviertas en "ordenar" algo sin una secuencia real y objetivamente correcta — si el orden es discutible, es mejor como selección única o llenar-espacios.

**Estructura de datos (`ORDER_EXERCISES`):**
```js
{
  titulo:"Nombre del ejercicio",
  nota:"Ordena del 1 al N los pasos correctos. Hay opciones que no se usan.",
  topics:["id_tema"],
  correct:["paso 1", "paso 2", ...],      // en el orden correcto
  distractors:["opción que no pertenece", ...]
}
```

## Otros formatos vistos que NO tienen motor dedicado (aún)

- **Casos clínicos con cuadro a completar** (ej. tabla Hallazgo/Etapa/Segmento/Causa): modelar como un mini-set de `fill` con `topics` compartido, o como un `pareo` pequeño si las respuestas son términos cortos de una lista cerrada.
- **Desarrollo/análisis de ideas** (respuesta abierta de varias líneas, ej. "explique la relación anatómica y fisiológica entre..."): no se presta bien a autocalificación en un HTML de práctica. Si aparece en el examen de muestra, es mejor incluirlo como pregunta de repaso en la **guía de estudio** (con la respuesta esperada) en vez de forzarlo al examen interactivo.
- **Etiquetar un diagrama**: fuera de alcance por ahora; si es central al examen, avisa al estudiante que ese tipo de pregunta no está cubierto por la práctica interactiva y refuérzalo en la guía con una descripción textual detallada de la imagen.
