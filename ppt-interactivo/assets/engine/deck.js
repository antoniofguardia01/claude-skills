/* ==========================================================================
   ppt-interactivo · deck.js
   Navegación, escalado, animaciones, organigramas enlazados, vista general,
   lightbox, ruta de progreso y transición "puertas".
   Config opcional: window.DECK = { extremos: ["Inicio","Fin"], marcador: "<svg…>" }
   Subdiapositivas: <section class="slide" data-oculta> no aparecen al avanzar/retroceder,
   ni en la ruta ni en la vista general; solo se abren con data-goto (botones).
   ========================================================================== */
(() => {
  const cfg = Object.assign({ extremos: null, marcador: null }, window.DECK || {});
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const stage = $("#stage");
  const slides = $$(".slide", stage);
  const N = slides.length;
  let cur = -1, busy = false, historial = [];

  /* Diapositivas visibles en el recorrido lineal (las data-oculta se saltan) */
  const oculta = k => slides[k].hasAttribute("data-oculta");
  const visibles = slides.map((_, k) => k).filter(k => !oculta(k));
  const NV = visibles.length;
  const padreDe = k => { while (k > 0 && oculta(k)) k--; return k; };   // visible anterior
  const orden = k => visibles.indexOf(padreDe(k));                        // posición 0..NV-1

  /* ---------- Escalado del lienzo 1600x900 ---------- */
  function escalar() {
    const s = Math.min(innerWidth / 1600, innerHeight / 900);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
    document.documentElement.style.setProperty("--escala", s);
  }
  addEventListener("resize", escalar); escalar();

  /* ---------- Preparar slides ---------- */
  slides.forEach((sl, k) => {
    sl.dataset.n = k + 1;
    let i = 0;
    $$("[data-a], .card, .draw", sl).forEach(el => {
      if (!el.style.getPropertyValue("--i")) el.style.setProperty("--i", el.dataset.i ?? i++);
    });
    $$("[data-split]", sl).forEach(el => {
      let wi = 0;
      const walk = node => {
        [...node.childNodes].forEach(ch => {
          if (ch.nodeType === 3) {
            const frag = document.createDocumentFragment();
            ch.textContent.split(/(\s+)/).forEach(tok => {
              if (!tok) return;
              if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
              const w = document.createElement("span"); w.className = "w";
              const s = document.createElement("span"); s.textContent = tok;
              w.style.setProperty("--wi", wi++); w.appendChild(s); frag.appendChild(w);
            });
            ch.replaceWith(frag);
          } else if (ch.nodeType === 1 && ch.tagName !== "BR") walk(ch);
        });
      };
      walk(el);
      $$(".w", el).forEach(w => w.firstChild.style.setProperty("--wi", w.style.getPropertyValue("--wi")));
    });
  });

  /* ---------- UI: ruta de progreso ---------- */
  const ruta = $(".ruta");
  if (ruta) {
    ruta.innerHTML = `<div class="track"></div><div class="done"></div>` +
      (cfg.extremos ? `<span class="ext l">${cfg.extremos[0]}</span><span class="ext r">${cfg.extremos[1]}</span>` : "");
    visibles.forEach(k => {
      const sl = slides[k];
      const h = document.createElement("button");
      h.className = "hito" + (sl.hasAttribute("data-seccion") ? " sec" : "");
      h.dataset.k = k;
      h.style.left = pos(k) + "%";
      h.setAttribute("aria-label", `Ir a la diapositiva ${orden(k) + 1}`);
      h.innerHTML = `<span class="tip">${orden(k) + 1} · ${titulo(sl)}</span>`;
      h.addEventListener("click", () => ir(k));
      ruta.appendChild(h);
    });
    if (cfg.marcador) {
      const m = document.createElement("div"); m.className = "marca"; m.innerHTML = cfg.marcador; ruta.appendChild(m);
    }
  }
  function pos(k) { return NV > 1 ? (orden(k) / (NV - 1)) * 100 : 0; }
  function titulo(sl) {
    return sl.dataset.titulo || ($("h1, h2, h3", sl)?.textContent || "").replace(/\s+/g, " ").trim() || `Diapositiva ${orden(+sl.dataset.n - 1) + 1}`;
  }

  /* ---------- Navegación ---------- */
  const puertas = $("#puertas");
  function ir(k, opts = {}) {
    k = Math.max(0, Math.min(N - 1, k));
    if (k === cur || busy) return;
    const destino = slides[k];
    const usarPuertas = puertas && !matchMedia("(prefers-reduced-motion: reduce)").matches &&
      (destino.dataset.trans === "puertas") && cur !== -1 && !opts.sinTrans;
    if (!opts.sinHistorial && cur !== -1) historial.push(cur);
    if (usarPuertas) {
      busy = true;
      puertas.className = "cerrar";
      setTimeout(() => { mostrar(k, true); puertas.className = "abrir"; setTimeout(() => { puertas.className = ""; busy = false; }, 800); }, 540);
    } else mostrar(k);
  }
  function mostrar(k, instant) {
    const prev = cur; cur = k;
    slides.forEach((sl, j) => {
      sl.classList.toggle("active", j === k);
      sl.classList.toggle("is-prev", j < k);
      if (instant) { sl.style.transition = "none"; requestAnimationFrame(() => sl.style.transition = ""); }
    });
    // reiniciar animaciones de la slide que entra
    const sl = slides[k];
    sl.classList.remove("active"); void sl.offsetWidth; sl.classList.add("active");
    $$("[data-count]", sl).forEach(contar);
    const c = $(".ui-count b"); if (c) c.textContent = String(orden(k) + 1).padStart(2, "0");
    const t = $(".ui-count span"); if (t) t.textContent = "/ " + String(NV).padStart(2, "0");
    document.body.classList.toggle("en-sub", oculta(k));
    if (ruta) {
      $(".done", ruta).style.width = pos(k) + "%";
      const m = $(".marca", ruta); if (m) m.style.left = pos(k) + "%";
      $$(".hito", ruta).forEach(h => h.classList.toggle("on", +h.dataset.k <= padreDe(k)));
    }
    history.replaceState(null, "", "#" + (k + 1));
    document.body.dataset.slide = k + 1;
    document.dispatchEvent(new CustomEvent("slidechange", { detail: { index: k, total: N, prev, slide: sl } }));
    $$(".ov-item").forEach(o => o.classList.toggle("cur", +o.dataset.k === padreDe(k)));
  }
  // avanzar/retroceder recorre solo las visibles: desde una subdiapositiva, → sigue tras su grupo y ← vuelve a su padre
  const sig = () => { const n = visibles.find(v => v > cur); if (n !== undefined) ir(n); };
  const ant = () => { const p = [...visibles].reverse().find(v => v < cur); if (p !== undefined) ir(p); };

  function contar(el) {
    const fin = parseFloat(el.dataset.count), dec = (el.dataset.count.split(".")[1] || "").length;
    const t0 = performance.now(), dur = 1600;
    const paso = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = (fin * e).toLocaleString("es", { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  /* Enlaces internos: data-goto="5" | "back" */
  document.addEventListener("click", e => {
    const g = e.target.closest("[data-goto]");
    if (g) {
      e.preventDefault();
      if (g.dataset.goto === "back") { const h = historial.pop(); ir(h ?? cur - 1, { sinHistorial: true }); }
      else ir(parseInt(g.dataset.goto, 10) - 1);
      return;
    }
    const z = e.target.closest("[data-zoom]");
    if (z) {
      const src = z.dataset.zoom || $("img", z)?.src;
      if (src) { $("#lightbox img").src = src; $("#lightbox").classList.add("on"); }
    }
  });
  $("#lightbox")?.addEventListener("click", () => $("#lightbox").classList.remove("on"));

  /* Teclado */
  addEventListener("keydown", e => {
    const tg = e.target instanceof Element ? e.target : document.body;
    if (tg.closest("input, textarea")) return;
    if ((e.key === " " || e.key === "Enter") && tg.closest("button, a")) return; // activa el botón enfocado
    const lb = $("#lightbox.on"), ov = $("#overview.on");
    if (e.key === "Escape") { lb?.classList.remove("on"); ov?.classList.remove("on"); $("#ayuda")?.classList.remove("on"); return; }
    if (lb) return;
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key) && !ov) { e.preventDefault(); sig(); }
    else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key) && !ov) { e.preventDefault(); ant(); }
    else if (e.key === "Home") ir(visibles[0]);
    else if (e.key === "End") ir(visibles[NV - 1]);
    else if (e.key.toLowerCase() === "o") toggleOverview();
    else if (e.key.toLowerCase() === "f") pantallaCompleta();
    else if (e.key === "?" || e.key.toLowerCase() === "h") $("#ayuda")?.classList.toggle("on");
    else if (/^[0-9]$/.test(e.key)) { // escribir número + Enter no es necesario: 2 dígitos rápidos
      numBuf += e.key; clearTimeout(numT); numT = setTimeout(() => { const v = visibles[parseInt(numBuf, 10) - 1]; if (v !== undefined) ir(v); numBuf = ""; }, 600);
    }
  });
  let numBuf = "", numT;

  /* Táctil */
  let tx = 0, ty = 0;
  addEventListener("touchstart", e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? sig : ant)();
  }, { passive: true });

  /* Botones */
  $("[data-accion=ant]")?.addEventListener("click", ant);
  $("[data-accion=sig]")?.addEventListener("click", sig);
  $("[data-accion=vista]")?.addEventListener("click", toggleOverview);
  $("[data-accion=full]")?.addEventListener("click", pantallaCompleta);
  $("[data-accion=ayuda]")?.addEventListener("click", () => $("#ayuda")?.classList.toggle("on"));

  function pantallaCompleta() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  /* Vista general */
  const ov = $("#overview");
  if (ov) {
    ov.innerHTML = `<h2>Vista general · ${NV} diapositivas</h2><div class="ov-grid"></div>`;
    visibles.forEach(k => {
      const sl = slides[k];
      const b = document.createElement("button");
      b.className = "ov-item" + (sl.hasAttribute("data-seccion") ? " sec" : "");
      b.dataset.k = k;
      b.innerHTML = `<span class="n">${String(orden(k) + 1).padStart(2, "0")}</span><span class="t">${titulo(sl)}</span>`;
      b.addEventListener("click", () => { ov.classList.remove("on"); ir(k, { sinTrans: true }); });
      $(".ov-grid", ov).appendChild(b);
    });
  }
  function toggleOverview() { ov?.classList.toggle("on"); }

  /* Ocultar controles en reposo */
  let idleT;
  const despertar = () => { document.body.classList.remove("idle"); clearTimeout(idleT); idleT = setTimeout(() => document.body.classList.add("idle"), 2800); };
  addEventListener("mousemove", despertar); despertar();

  /* Aviso en móvil vertical */
  if (matchMedia("(orientation: portrait) and (max-width: 760px)").matches) {
    const a = document.createElement("div"); a.className = "girar"; a.textContent = "Gira el teléfono para ver mejor la presentación";
    document.body.appendChild(a); setTimeout(() => a.remove(), 5000);
  }

  /* Arranque */
  const h = parseInt(location.hash.slice(1), 10);
  mostrar(Number.isFinite(h) && h >= 1 && h <= N ? h - 1 : 0);
  addEventListener("hashchange", () => { const n = parseInt(location.hash.slice(1), 10); if (n - 1 !== cur) ir(n - 1); });
  window.deck = { ir: k => ir(k - 1), sig, ant, get actual() { return cur + 1; }, total: N, visibles: visibles.map(k => k + 1) };
})();
