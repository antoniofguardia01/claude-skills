# Componentes del motor (`engine/deck.css`)

Lienzo 1600×900. Área útil: `padding: 104px 110px 118px`. Todo lo de abajo se anima si lleva `data-a`.

## Estructura de slide
```html
<section class="slide" data-titulo="Nombre corto" data-seccion data-trans="puertas">
  <div class="head">
    <span class="kicker" data-a="right">Etiqueta</span>          <!-- .kicker.red, .kicker.plain -->
    <h2 class="h-l" data-split>Título de la slide</h2>
  </div>
  … contenido …
</section>
```
Variantes: `.slide.center` (centrado), `.portal` (icono + título + botón), `.divisor` (sección). Títulos: `.h-hero .h-xl .h-l .h-m .h-s`; texto: `.lead .body .small .muted .accent .accent-2 .outline`.

## Layout
`.grid.g-2 | g-3 | g-4 | g-2-1 | g-1-2`, `.row`, `.col`, `.fill` (ocupa el resto), `.gap-s/.gap-l`, `.ai-c .jc-sb .jc-c`, `.mt-s/m/l/a`.

## Tarjetas
```html
<article class="card accent-top" data-a="up">   <!-- .accent-left, .tight, .hover -->
  <span class="big-num">01</span>                <!-- número gigante en contorno -->
  <span class="card-kicker">Tipo</span>
  <h3>Título</h3><p>Texto</p>
</article>
```

## Listas y pasos
```html
<ul class="list"><li>…</li></ul>                  <!-- .list.dense -->
<div class="steps">
  <div class="step" data-a="up"><span class="n">01</span><div><h3>…</h3><p>…</p></div></div>
</div>
<div class="keys"><div class="key"><span class="k">O</span>Sobresaliente</div></div>
<span class="pill">A.M.P.</span>  <span class="pill red">ACP</span>  <span class="pill sea">Mensual</span>
```

## Documentos / enlaces
```html
<div class="doc-list">                               <!-- .doc-list.dense (código ancho, 2 col con .grid.g-2) -->
  <a class="doc" data-a="up" target="_blank" rel="noopener" href="…">
    <span class="ic">4547</span><span class="t">Título<small>detalle</small></span>
    <svg class="go" width="22" height="22"><use href="#i-flecha"/></svg>
  </a>
</div>
<a class="btn" href="…">Abrir <svg><use href="#i-flecha"/></svg></a>   <!-- .btn.ghost -->
<button class="back" data-goto="4"><svg><use href="#i-atras"/></svg>Volver al organigrama</button>
```

## Figuras
```html
<figure class="figure" data-zoom data-a="zoom"><img src="img/s8-1.jpg" alt="…"></figure>  <!-- clic = lightbox -->
<a class="figure" href="…" target="_blank">…</a>      <!-- imagen que es enlace -->
<p class="caption">Fuente…</p>
```
Para que una figura llene su celda: contenedor grid con `grid-template-rows: minmax(0,1fr)` y `.figure{height:100%}`.

## Datos
```html
<div class="stat"><div class="v" data-count="36">0</div><div class="l">remolcadores</div></div>
<table class="table">…</table>
```

## Organigramas
Opción A — árbol automático (estructuras simples):
```html
<ul class="org"><li><div class="node lead-n"><b>Gerente</b></div>
  <ul><li><div class="node">A</div></li><li><div class="node red">B</div></li></ul>
</li></ul>
```
Opción B — lienzo absoluto (recomendado para reproducir un organigrama real): `.orgbox` (1380×640) con nodos `position:absolute` y un `<svg class="conn draw" viewBox="0 0 1380 640">` con `<path style="--len:N">` para los conectores (se dibujan al entrar). Columnas apiladas: `.rama` (flex column). Nodos: `.node` `.lead-n` `.red` `.red-soft` `.link` (+ `<span class="dot"></span>` pulso) con `data-goto="N"`.

## Navegación interna
`data-goto="N"` en cualquier elemento → va a la slide N (1-based, orden del HTML). `data-goto="back"` → vuelve a la anterior visitada. URL `#N` abre la slide N.

**Subdiapositivas** — `<section class="slide" data-oculta>`: fichas que dependen de otra slide (cargos de un organigrama, secciones de un índice). No aparecen al avanzar/retroceder, ni en la ruta de progreso, ni en la vista general, y el contador las excluye; solo se abren con un botón `data-goto`. Estando en una: → salta a la siguiente slide principal, ← vuelve a su padre (la visible anterior). Siempre dales un botón de regreso (`data-goto` al padre).

## Animación
- `data-a="up|down|left|right|fade|zoom|blur|mask|line"`; orden = orden DOM; `style="--i:3"` fuerza posición; `--d:300ms` retrasa.
- `data-split` en títulos: palabra por palabra (respeta `<br>` y `<span>` internos).
- `.draw` en `<svg>`/`<g>`: trazado de path/line/circle (define `--len` ≈ longitud).
- `.float`, `.float-slow`, `.spin-slow`, `.card::after` (brillo al entrar, automático).
- `data-trans="puertas"` en la slide destino: compuertas que cierran y abren (divisores, cierre).

## Interfaz (ya en la plantilla)
Marca + contador arriba, ruta de progreso con hitos (`data-seccion` = rombo) y marcador SVG abajo, botones (anterior/siguiente/vista/pantalla completa/ayuda), `#overview` (tecla O), `#lightbox`, `#ayuda` (tecla ?), `#puertas`. Configurar con:
```html
<script>window.DECK = { extremos: ["Atlántico", "Pacífico"], marcador: '<svg …>' };</script>
```

## Impresión
`Ctrl+P → Guardar como PDF` imprime una slide por página sin animaciones (el fondo animado se sustituye por un degradado).
