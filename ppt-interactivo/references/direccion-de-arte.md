# Dirección de arte

## Tono: cuánto movimiento y cuánta personalidad

| Tono | Cuándo | Qué cambia |
|---|---|---|
| `formal` | Gobierno, legal, auditoría, salud, finanzas, directorio, informes oficiales | Animaciones cortas (18px), parallax mínimo, sin pings de sonar; tipografía sobria; 1 solo ornamento discreto; paleta de marca estricta |
| `equilibrado` | Institucional, inducción de personal, capacitación, universidad, informes internos | Default. Ornamentos temáticos en portada y divisores, transición "puertas" en secciones |
| `expresivo` | Marketing, lanzamientos, eventos, colegio, ferias | Más distancia y stagger, parallax fuerte, más elementos en el fondo, títulos contorno/hero más grandes |

"Cool pero profesional" = `equilibrado` con paleta de marca, ornamentos en línea fina (no ilustraciones cartoon), fondo oscuro profundo, tarjetas de vidrio y movimiento suave. Nada de emojis como iconos, degradados morados/neón genéricos, sombras de colores, ni texto con efecto arcoíris.

## Fondos disponibles (`data-fondo`)

| Motor | Qué dibuja | Temas ideales |
|---|---|---|
| `oceano` | Carta náutica (retícula con coordenadas, isobatas), costa, buques portacontenedores / tanqueros / remolcadores con estela, boyas rojas y verdes que destellan, olas en líneas, rosa de los vientos, sonar | Canal de Panamá, puertos, marina, logística, pesca, turismo costero, oceanografía |
| `red` | Constelación de nodos conectados | Corporativo, tecnología, telecom, organizaciones, redes, datos |
| `ondas` | Líneas sedosas en movimiento | Finanzas, salud, bienestar, RR.HH., educación, genérico elegante |
| `rejilla` | Rejilla en perspectiva tipo plano técnico | Ingeniería, construcción, industria, energía, TI, manufactura |
| `particulas` | Bokeh suave | Eventos, cultura, humanidades, presentaciones sociales |

La cámara se desplaza con cada slide: el público "viaja" por el fondo. Si el tema es otro (espacio, selva, ciudad, química…), crea un motor nuevo siguiendo el patrón de `fondos.js` en vez de forzar uno que no encaja.

## Paleta
Declara en `:root` del `index.html`: `--bg-0` (más profundo), `--bg-1`, `--ink`, `--ink-2`, `--ink-3`, `--accent` (color de marca, aclarado ~10% para que brille sobre oscuro), `--accent-2` (color temático: agua, verde, cobre…), `--glass`.
- Toma la marca de `deck.json` (`fill` más repetidos, colores de títulos).
- Legibilidad: `--glass` con alfa ≥ .72 cuando el fondo tiene elementos brillantes.
- Rojo/verde de navegación, semáforos, etc. solo como señal puntual.

## Tipografía (Google Fonts)
- Default del motor: **Archivo** (display, eje de ancho: `font-stretch` 110–125% para portadas), **IBM Plex Sans** (texto), **IBM Plex Mono** (etiquetas, coordenadas, números de formulario).
- Alternativas según tono: legal/histórico → *Fraunces* o *Newsreader* + *Inter Tight*; tecnológico → *Space Grotesk* + *JetBrains Mono*; educativo cálido → *Bricolage Grotesque* + *Nunito Sans*. Cambia `--font-display/body/mono`.
- Escala: hero 148–200px, `h-xl` 96, `h-l` 58 (50 en slides densas), cuerpo 19–22px. Nada por debajo de 15px en contenido.

## Ornamentos temáticos
- Línea fina (1–1.5px), color `--ink` con opacidad o `--accent-2`; nunca compiten con el texto.
- Uno principal en la portada (dibujo técnico animado, mapa, pieza del tema) sobre una "lámina" oscura para no chocar con el fondo.
- Iconos de línea en un `<symbol>` sprite (ver plantilla) para tarjetas y portales; crea los que el tema necesite (ancla, timón, casco, microscopio, balanza…).
- Movimiento: `.float`, `.spin-slow`, `.draw` (trazado), animaciones propias con `@keyframes` en el `<style>` del deck.
- Ejemplos del canal: esclusa en planta con compuertas que se abren y un buque entrando con remolcadores; remolcador como marcador de progreso de Atlántico a Pacífico; boyas con destello; coordenadas `9°04′ N · 79°40′ W`.

## Qué transformar en interactivo
- Enlaces entre slides del PPT (organigramas → fichas) → nodos clicables con pulso + "volver" + escalera de "estás aquí".
- Imágenes densas (BPMN, tablas escaneadas, planos) → figura con lightbox.
- Slides que solo son un título con hipervínculo → portal con botón.
- Listas de documentos → lista de documentos con código, flecha y hover.
- Números clave → `data-count` (cuenta animada). Niveles → barras que se llenan. Frecuencias → tiras de calendario.
