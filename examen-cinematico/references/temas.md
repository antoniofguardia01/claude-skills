# Catálogo de temas

Cada tema = **motor de fondo** (animación canvas) + **fuentes** + **paleta**. Elige el preset más cercano a la materia del examen y luego **personalízalo** para ese tema concreto: cambia `glifos`, ajusta el acento, a veces la fuente display. Dos exámenes de la misma materia pueden compartir motor, pero no deberían verse idénticos.

Todas las URLs de fuentes están verificadas (responden 200). Si cambias una fuente, verifica la URL con `curl -s -o /dev/null -w '%{http_code}' "<url>"` antes de compilar: Google Fonts devuelve error para TODO el CSS si un peso no existe.

## Motores

| motor | Qué se ve | Materias típicas | Reacción al mouse |
|---|---|---|---|
| `gimnasio` | Mancuernas, barras, pesas rusas y discos haciendo repeticiones, polvo de magnesio, cinta amarilla de seguridad y suelo de caucho | Educación física, deporte, entrenamiento, biomecánica, atletismo | El equipo cercano gira |
| `fibras` | Haces musculares estriados que se contraen con pulsos | Anatomía, sistema muscular/esquelético, educación física, fisiología | Las fibras cerca del cursor se contraen |
| `celulas` | Células con membrana ondulante, núcleo y organelos; vesículas que suben | Biología celular, genética, microbiología, ecología microscópica | Las células se apartan |
| `pulso` | Electrocardiograma con brillo + barrido de escáner + retícula clínica | Sistema circulatorio, salud, enfermería, primeros auxilios, nutrición | — |
| `constelacion` | Estrellas con paralaje, constelaciones, estrellas fugaces | Física, astronomía, sistema solar, óptica, química nuclear | Paralaje + líneas más brillantes cerca |
| `moleculas` | Moléculas (anillos y cadenas) girando con símbolos atómicos | Química orgánica/inorgánica, bioquímica, materiales | La molécula cercana gira más rápido y se ilumina |
| `cuadricula` | Suelo en perspectiva, curva de función con coordenadas vivas, símbolos flotando | Matemáticas, cálculo, estadística, física mecánica, economía | El punto de fuga sigue al cursor |
| `flujo` | Campo de corrientes tipo viento/océano con estelas | Geografía, clima, océanos, ecología, ciencias de la tierra | Remolino alrededor del cursor |
| `brasas` | Brasas que suben sobre curvas de nivel de mapa antiguo | Historia, sociales, civilizaciones, cívica, filosofía, religión | — |
| `codigo` | Lluvia de caracteres por columnas | Informática, programación, tecnología, robótica, lógica | Los caracteres cerca del cursor cambian a acento2 |
| `tinta` | **Tema claro**: cuaderno rayado, letras gigantes flotando, manchas de tinta | Español, literatura, idiomas, arte, música, redacción | Rastro de tinta que sigue al cursor |

`glifos` alimenta a `cuadricula` (símbolos flotando), `codigo` (caracteres que caen), `tinta` (letras gigantes), el separador de la cinta de términos, el efecto “scramble” de los títulos y la explosión de celebración. Úsalos siempre, con símbolos del tema: `["∫","∑","π","√"]` para cálculo, `["Å","ß","Ñ","¿"]` para idiomas, `["{","}","<>","01","λ"]` para programación, `["Fe","Na","Cl","H₂O"]` para química, etc.

## Reglas de paleta

- `fondo`/`panel` oscuros casi-negros teñidos del color del tema (nunca `#000` puro, nunca gris neutro). Para `tinta` usa papel claro.
- **Un solo acento dominante** (`acento`) y un secundario más suave (`acento2`). Evita el degradado morado-azul genérico de IA.
- `tintaAcento` = color del texto sobre botones de `acento` (normalmente el fondo muy oscuro).
- `bien`/`mal` deben distinguirse claramente del `acento` (si el acento es rojo, `mal` no puede ser rojo: usa rosa/magenta).
- El script de build comprueba contraste WCAG y falla si algo no pasa.

## Presets

### Educación física / gimnasio / deporte — `gimnasio`
```json
{"motor":"gimnasio","fuentes":{"href":"https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;1,800;1,900&family=Barlow:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap","display":"Barlow Condensed","body":"Barlow","mono":"JetBrains Mono","displayPeso":900,"displayMayus":true,"displayItalica":true,"displayTracking":"-.015em"},
 "colores":{"fondo":"#0d0d0c","panel":"#181816","tinta":"#f4f2ec","suave":"#a6a399","acento":"#ffd400","acento2":"#ff5a1f","tintaAcento":"#1a1600","bien":"#45e08a","mal":"#ff4f7b"},
 "glifos":["✚","●","■","▲"],"atenuarFondo":0.4}
```

### Anatomía / sistema músculo-esquelético — `fibras`
```json
{"motor":"fibras","fuentes":{"href":"https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap","display":"Anton","body":"Archivo","mono":"JetBrains Mono","displayPeso":400,"displayMayus":true},
 "colores":{"fondo":"#0b0707","panel":"#160e0e","tinta":"#f4ece6","suave":"#a89590","acento":"#ff4b3e","acento2":"#f2e3d0","tintaAcento":"#1a0503","bien":"#7cf2a8","mal":"#ff6b9a"},
 "glifos":["✚","◆","✳","◐"],"atenuarFondo":0.45}
```

### Biología celular / genética — `celulas`
```json
{"motor":"celulas","fuentes":{"href":"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap","display":"Bricolage Grotesque","body":"Instrument Sans","mono":"JetBrains Mono","displayPeso":800},
 "colores":{"fondo":"#04110d","panel":"#0a1c17","tinta":"#e8f5ee","suave":"#8fb3a4","acento":"#b6ff3b","acento2":"#3bf0c8","tintaAcento":"#0b1a00","bien":"#6ee7a8","mal":"#ff7a8a"},
 "glifos":["◉","⬡","∿","✦"]}
```

### Salud / sistema circulatorio — `pulso`
```json
{"motor":"pulso","fuentes":{"href":"https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap","display":"Big Shoulders Display","body":"Archivo","mono":"JetBrains Mono","displayPeso":900,"displayMayus":true},
 "colores":{"fondo":"#070b0e","panel":"#10171c","tinta":"#eaf0f2","suave":"#8b98a0","acento":"#5eead4","acento2":"#ff5c7a","tintaAcento":"#04211c","bien":"#4ade80","mal":"#fb7185"},
 "glifos":["✚","♥","◎","⌁"]}
```

### Física / astronomía — `constelacion`
```json
{"motor":"constelacion","fuentes":{"href":"https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap","display":"Syne","body":"Space Grotesk","mono":"Space Mono","displayPeso":800,"displayTracking":"-.04em"},
 "colores":{"fondo":"#05060b","panel":"#0d0f1a","tinta":"#eef0ff","suave":"#9097b8","acento":"#ffe66d","acento2":"#7aa2ff","tintaAcento":"#1a1500","bien":"#5eead4","mal":"#ff6b8b"},
 "glifos":["✦","☉","☾","✺"]}
```

### Química — `moleculas`
```json
{"motor":"moleculas","fuentes":{"href":"https://fonts.googleapis.com/css2?family=Unbounded:wght@500;800&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap","display":"Unbounded","body":"Manrope","mono":"IBM Plex Mono","displayPeso":800,"displayTracking":"-.03em"},
 "colores":{"fondo":"#0d0c0b","panel":"#181614","tinta":"#f3efe8","suave":"#a39b90","acento":"#ff6a1a","acento2":"#ffd166","tintaAcento":"#1f0c00","bien":"#6ee7a8","mal":"#ff5c8a"},
 "glifos":["⌬","Fe","Na","H₂O"]}
```

### Matemáticas — `cuadricula`
```json
{"motor":"cuadricula","fuentes":{"href":"https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Sora:wght@400;500;600;700&family=Fira+Code:wght@400;600&display=swap","display":"DM Serif Display","body":"Sora","mono":"Fira Code","displayPeso":400,"displayItalica":true,"displayTracking":"-.02em"},
 "colores":{"fondo":"#0a0a0c","panel":"#141418","tinta":"#f2ede3","suave":"#9d9a93","acento":"#ff3d2e","acento2":"#f2e8cf","tintaAcento":"#1a0200","bien":"#67e8a9","mal":"#ff79b0"},
 "glifos":["∑","π","∫","√","Δ","∞","θ","≈","ƒ(x)","±"]}
```

### Historia / sociales — `brasas`
```json
{"motor":"brasas","fuentes":{"href":"https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,700&family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap","display":"Fraunces","body":"Figtree","mono":"IBM Plex Mono","displayPeso":900,"displayTracking":"-.035em"},
 "colores":{"fondo":"#120b07","panel":"#1d140e","tinta":"#f4e9d8","suave":"#b09c84","acento":"#ff8a3d","acento2":"#e9d8b4","tintaAcento":"#1f0e00","bien":"#8be28b","mal":"#ff6f91"},
 "glifos":["✠","☙","⚜","Ⅻ"]}
```

### Geografía / ecología / clima — `flujo`
```json
{"motor":"flujo","fuentes":{"href":"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Familjen+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap","display":"Bebas Neue","body":"Familjen Grotesk","mono":"DM Mono","displayPeso":400,"displayMayus":true,"displayTracking":".005em"},
 "colores":{"fondo":"#03141c","panel":"#0a2029","tinta":"#e6f6f8","suave":"#86aab3","acento":"#4de1ff","acento2":"#9bffb0","tintaAcento":"#00202a","bien":"#9bffb0","mal":"#ff8fa3"},
 "glifos":["≋","◭","☀","⌖"]}
```

### Informática / tecnología — `codigo`
```json
{"motor":"codigo","fuentes":{"href":"https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap","display":"Chakra Petch","body":"IBM Plex Sans","mono":"JetBrains Mono","displayPeso":700,"displayMayus":true,"displayTracking":"-.01em"},
 "colores":{"fondo":"#050807","panel":"#0c1210","tinta":"#e4f5ec","suave":"#83a394","acento":"#39ff88","acento2":"#ff2e88","tintaAcento":"#002010","bien":"#39ff88","mal":"#ff5ca8"},
 "glifos":["0","1","{","}","<",">","/","λ","#","=",";","&"],"atenuarFondo":0.35}
```
Nota: en `codigo` el acento verde y `bien` pueden coincidir; está bien porque `mal` es magenta.

### Lengua / literatura / idiomas / arte — `tinta` (claro)
```json
{"motor":"tinta","claro":true,"fuentes":{"href":"https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap","display":"Instrument Serif","body":"Instrument Sans","mono":"DM Mono","displayPeso":400,"displayItalica":true,"displayTracking":"-.02em"},
 "colores":{"fondo":"#f3ede2","panel":"#fbf7f0","tinta":"#16130f","suave":"#5f574c","acento":"#c8261c","acento2":"#2f5fb3","tintaAcento":"#fff8f0","bien":"#1d7a45","mal":"#b3126a"},
 "glifos":["Á","ñ","¿","&","«","§","a","R"],"atenuarFondo":0.6}
```

## Campos opcionales del tema

- `atenuarFondo` (0–1, default 0.5): opacidad del fondo animado mientras se responde (en la portada siempre es 1). Baja a 0.3–0.4 si el motor es muy activo.
- `video`: `{"src":"fondo.mp4","opacidad":0.35,"mezcla":"screen","filtro":"saturate(.8)","poster":"poster.jpg"}`. Se pone debajo del canvas. Úsalo solo si el usuario da un video o una URL directa a un .mp4/.webm que pueda usar; guarda el archivo junto al HTML y usa una ruta relativa. `mezcla` `screen` para fondos oscuros, `multiply` para `tinta`. El canvas sigue encima, así que el video debe ser tenue.
