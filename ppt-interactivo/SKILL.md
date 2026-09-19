---
name: ppt-interactivo
description: Convierte presentaciones PowerPoint (.pptx) sencillas en slides web interactivos (HTML/CSS/JS sin build) listos para subir a GitHub y publicar en Vercel — con fondo animado temático (mar y barcos, red corporativa, ondas, rejilla técnica, partículas), ornamentos SVG animados, transiciones, organigramas clicables, zoom de diagramas, vista general y ruta de progreso, conservando TODO el contenido, enlaces e imágenes del PPT y respetando el nivel de formalidad del trabajo. Úsala cuando el usuario pase un .pptx (o un PDF de slides) y pida "hazlo interactivo", "pásalo a HTML/web", "slides cool/animadas", "para subir a Vercel/GitHub", "que se vea moderno pero profesional", "adáptalo visualmente", o use /ppt-interactivo, aunque no diga "HTML".
---

# PPT → slides web interactivos

Resultado: una carpeta estática (`index.html` + `engine/` + `img/` + `vercel.json` + `README.md`) que se sube tal cual a un repo y Vercel la publica sin configuración.

**Regla de oro:** el contenido es sagrado; el diseño es tuyo. Cada texto, dato, imagen y enlace del PPT llega a la web (corregir tildes/erratas obvias está bien). No inventes datos, cifras, fechas ni afirmaciones que no estén en el PPT. Lo que sí puedes añadir: etiquetas cortas de navegación (*kicker*), iconos, ornamentos y microcopias de interfaz ("Toca el diagrama para ampliarlo").

El motor (`assets/engine/`) ya resuelve navegación, escalado, animaciones, fondos y UI. **Tu trabajo es la dirección de arte y el maquetado de cada slide**, no la fontanería.

## Flujo

### 1. Extraer
```bash
python ~/.claude/skills/ppt-interactivo/scripts/extract_pptx.py "<archivo.pptx>" "<scratchpad>/extract" --previews
```
- Lee **`deck.md`** primero (resumen compacto: textos por slide, negritas, enlaces externos, enlaces internos `→ slide N`, imágenes con tamaño). Consulta `deck.json` solo si necesitas posiciones/colores exactos.
- Mira los **previews** (`previews/NN.png`, render real de PowerPoint/LibreOffice) armando hojas de contacto de 15 slides con Pillow para ver el diseño original con pocos tokens.
- Objetos incrustados (Excel/OLE, SmartArt, EMF) se recortan automáticamente del render → aparecen como imagen. Si no hubo render, avísalo.
- Iconitos diminutos marcados `decorativo` (p. ej. "indicador pulsante" de hipervínculo) no se copian: su función la cumple el diseño (botón, flecha, pulso).
- Si el usuario da un PDF en vez de PPTX, extrae texto e imágenes con la skill `pdf` y sigue igual.

### 2. Decidir tono y dirección de arte
Lee `references/direccion-de-arte.md`. Decide y **declara en una línea al usuario** antes de maquetar:
- **Tono** (`data-tono`): `formal` (gobierno, legal, corporativo, médico), `equilibrado` (institucional/educativo, el default), `expresivo` (marketing, eventos, escolar creativo). El usuario manda: si dice "formal", "serio", "profesional", respétalo aunque pida "cool".
- **Fondo** (`data-fondo`): `oceano` · `red` · `ondas` · `rejilla` · `particulas` (ver tabla en la referencia). Si el tema pide algo que ningún motor cubre bien, añade un motor nuevo a `fondos.js` siguiendo el patrón (ver *Extender*).
- **Paleta**: parte de los colores de marca del PPT (en `deck.json` → `fill` de formas, colores de runs). Fondo oscuro profundo + 1 acento de marca + 1 acento temático.
- **Ornamentos**: 1–3 motivos SVG del tema (en el ejemplo del canal: esclusa en planta con compuertas que se abren, remolcador en la ruta, timón, rosa de los vientos).
- **Metáfora de progreso**: `window.DECK.extremos` y `marcador` (ej. Atlántico → Pacífico con un remolcador; Inicio → Meta; Q1 → Q4).

### 3. Crear el proyecto
```bash
python ~/.claude/skills/ppt-interactivo/scripts/nuevo_proyecto.py "<scratchpad>/extract" "<carpeta-destino>" "<Título>"
```
Por defecto la carpeta destino es `<directorio de trabajo>/<slug-del-titulo>-slides`. Copia el motor, las imágenes útiles, `vercel.json`, `.gitignore` y `README.md`. Borra después imágenes que no uses (fondos de plantilla, duplicados).

Logos de marca sobre fondo oscuro: genera una versión clara con Pillow (pixeles oscuros/azules → blanco, conservar el color de acento) en vez de ponerlos en una caja blanca.

### 4. Escribir `index.html`
Parte de `assets/plantilla.html` (esqueleto completo: capas, sprite de iconos, UI, scripts). **Mira `assets/ejemplo-canal/index.html`** como implementación de referencia terminada (30 slides reales, tono formal-equilibrado, fondo `oceano`).

- Una `<section class="slide">` por slide del PPT, **en el mismo orden y cantidad** (los enlaces internos dependen del número). Solo fusiona o divide slides si el usuario lo pide.
- Maqueta cada slide con los componentes de `references/componentes.md` eligiendo la forma según el contenido — no copies la disposición del PPT:
  - lista de enlaces → `.doc-list` con código/número en `.ic`
  - 3–6 ítems con título+texto → `.grid.g-3` de `.card`
  - pasos o responsabilidades numeradas → `.steps`
  - organigrama → `.orgbox` absoluto con conectores SVG `.draw` (o `.org` en árbol si es simple)
  - diagramas/tablas-imagen densos → `.figure[data-zoom]` (lightbox)
  - slide que solo es un título con hipervínculo → `.portal` con icono grande + `.btn`
  - separadores de sección → `.divisor` con `data-trans="puertas"`
  - escalas/niveles → barras `.escala`; frecuencias → tira de meses; reglas por casos → tabla `.matriz`
- Slides a las que el PPT solo llega por hipervínculo desde otra (fichas de un organigrama, secciones de un índice con "Regresar") → márcalas `data-oculta`: el recorrido lineal las salta y solo se abren con su botón. Si no está claro, pregunta.
- Hipervínculos: todo `href` del PPT se conserva (`target="_blank" rel="noopener"`, `&` → `&amp;`). Los enlaces internos (`→ slide N`) pasan a `data-goto="N"`; los "Volver al …" a `data-goto="N"` explícito.
- Animación: `data-a="up|left|right|fade|zoom|blur|mask|line"` en los bloques (el motor escalona en orden DOM); `data-split` en títulos (entrada palabra por palabra); `.draw` en SVG para trazado. No animes cada palabra de un párrafo.
- `data-seccion` marca hitos en la ruta de progreso (inicio de cada bloque temático); `data-titulo` da nombre corto en ruta/vista general.
- Lienzo fijo 1600×900: puedes posicionar en absoluto con confianza. El contenido debe caber entre `--pad-top` (104px) y `--pad-bottom` (118px); si no cabe, compacta (2 columnas, `.dense`, menos padding) — nunca uses scroll dentro de una slide.
- Estilos específicos del deck en el `<style>` de `index.html`. No edites `engine/` del proyecto; si algo del motor falla, arréglalo en la skill (`assets/engine/`) y vuelve a copiar.
- Cache-busting: referencia `engine/*.css|js?v=N` y sube N si cambias el motor.

### 5. Verificar en el navegador (obligatorio)
- Sirve la carpeta (`.claude/launch.json` con `python -m http.server <puerto> --directory <carpeta>` + `preview_start`; abrir el archivo directo como `data:` rompe las rutas relativas).
- Viewport 1440×810: recorre **todas** las slides (`/#N`), espera ~3 s a que terminen las animaciones y haz captura. Revisa: nada tapado por la barra inferior, textos legibles sobre el fondo (el horizonte o motivos brillantes detrás del texto son el fallo típico → más opacidad en `--glass` o tarjeta detrás), organigramas alineados, sin desbordes.
- Prueba: clic en un nodo enlazado, "volver", zoom de una figura, tecla `O`, y una transición `puertas`.
- Móvil (`preset: mobile`): la slide debe verse centrada y escalada; revisa la consola sin errores.
- Resetea el viewport al terminar.

### 6. Entregar
Resumen corto: carpeta creada, tono/fondo elegidos y por qué (1 línea), qué se transformó de forma interactiva, y los pasos de publicación (del README). Menciona si hay enlaces internos de una intranet (SharePoint, etc.) que solo abrirán para usuarios con acceso, y que al publicarse en Vercel el sitio es público salvo que activen *Deployment Protection*. **No** hagas `git push` ni despliegues sin que el usuario lo pida explícitamente; si lo pide, usa `gh` / la integración de Vercel.

## Extender
- **Nuevo motor de fondo**: en `assets/engine/fondos.js` crea un objeto `{ init(), frame(dt) }`, regístralo en `motores`, usa `C.*` (colores de las variables CSS), `camX` (avanza con cada slide → sensación de viaje), `smx/smy` (parallax del mouse, escalado por `PARALLAX`) y `VEL`. En gradientes de canvas usa colores **opacos** (`mix()`), no `rgba` con alfa distinto entre paradas: la interpolación produce bandas brillantes.
- **Nuevo componente**: si lo vas a reutilizar, añádelo a `deck.css` y documéntalo en `references/componentes.md`.
- Tras cambiar el motor, vuelve a copiarlo al proyecto y actualiza el ejemplo si aplica.
