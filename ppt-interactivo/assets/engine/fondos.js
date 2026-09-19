/* ==========================================================================
   ppt-interactivo · fondos.js
   Fondos animados en <canvas id="fondo">. Se elige con <body data-fondo="…">
   y la intensidad con <body data-tono="formal|equilibrado|expresivo">.
   Colores: lee las variables CSS --bg-0, --bg-1, --ink, --accent, --accent-2.
   Motores: oceano · red · ondas · rejilla · particulas
   La cámara avanza con cada slide (evento "slidechange") → sensación de viaje.
   ========================================================================== */
(() => {
  const cv = document.getElementById("fondo");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const body = document.body;
  const motor = body.dataset.fondo || "ondas";
  const tono = body.dataset.tono || "equilibrado";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const VEL = { formal: .6, equilibrado: 1, expresivo: 1.4 }[tono] || 1;
  const PARALLAX = tono === "formal" ? .35 : tono === "expresivo" ? 1.4 : .8;

  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const C = { bg0: css("--bg-0"), bg1: css("--bg-1"), ink: css("--ink"), acc: css("--accent"), acc2: css("--accent-2") };
  const rgb = hex => { hex = hex.replace("#", ""); if (hex.length === 3) hex = [...hex].map(c => c + c).join(""); const n = parseInt(hex, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const mix = (h1, h2, k) => { const a = rgb(h1), b = rgb(h2); return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`; };
  const rgba = (hex, a) => { try { const [r, g, b] = rgb(hex); return `rgba(${r},${g},${b},${a})`; } catch { return `rgba(255,255,255,${a})`; } };

  let W = 0, H = 0, DPR = 1, t = 0, last = performance.now();
  let camX = 0, camTarget = 0, mx = 0, my = 0, smx = 0, smy = 0;
  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 1.6);
    W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    motores[motor]?.init?.();
  }
  addEventListener("mousemove", e => { mx = e.clientX / W - .5; my = e.clientY / H - .5; });
  document.addEventListener("slidechange", e => { camTarget = e.detail.index * 140; });

  /* ---------- utilidades ---------- */
  const rnd = (a, b) => a + Math.random() * (b - a);
  function sea(x, z, tt) { // altura de ola compuesta
    return Math.sin(x * .012 + tt * 1.1 + z) * .55 + Math.sin(x * .027 - tt * .8 + z * 2.1) * .3 + Math.sin(x * .061 + tt * 1.7 + z * .7) * .15;
  }

  /* ======================= MOTOR: OCÉANO ======================= */
  const oceano = (() => {
    let barcos = [], luces = [], motas = [], pings = [], colinas = [];
    const horizonte = () => H * .6;

    function init() {
      // colinas lejanas (costa)
      colinas = [];
      let x = -200; while (x < W + 2400) { colinas.push({ x, h: rnd(18, 70), w: rnd(160, 420) }); x += rnd(120, 300); }
      // barcos: tipo, profundidad (0 lejos → 1 cerca), velocidad
      barcos = [
        { tipo: "portacontenedores", x: W * .15, z: .25, v: 6 },
        { tipo: "remolcador", x: W * .62, z: .55, v: 12 },
        { tipo: "tanquero", x: W * .9, z: .12, v: 4 },
        { tipo: "remolcador", x: W * .35, z: .38, v: 9 },
      ];
      if (tono === "expresivo") barcos.push({ tipo: "portacontenedores", x: W * .5, z: .7, v: 10 });
      // luces de navegación (boyas): rojas a babor, verdes a estribor
      luces = [];
      for (let i = 0; i < 9; i++) luces.push({ x: rnd(0, W * 3), z: rnd(.05, .5), c: i % 2 ? "#3ddc84" : "#ff4d5a", ph: rnd(0, 6), per: rnd(2.5, 4.5) });
      motas = Array.from({ length: Math.round(W / 22) }, () => ({ x: rnd(0, W), y: rnd(0, H), r: rnd(.4, 1.4), v: rnd(4, 14), a: rnd(.08, .35) }));
    }

    function cielo() {
      const hz = horizonte();
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, C.bg0);
      g.addColorStop(hz / H * .85, C.bg1);
      g.addColorStop(hz / H, mix(C.bg1, C.acc2, .14));   // colores opacos: evita bandas brillantes
      g.addColorStop(Math.min(1, hz / H + .02), C.bg1);
      g.addColorStop(1, C.bg0);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // resplandor del horizonte
      const r = ctx.createRadialGradient(W * .5, hz, 0, W * .5, hz, W * .6);
      r.addColorStop(0, rgba(C.acc2, .035)); r.addColorStop(1, rgba(C.acc2, 0));
      ctx.fillStyle = r; ctx.fillRect(0, hz - H * .3, W, H * .6);
    }

    function carta(ox) { // retícula de carta náutica + etiquetas de coordenadas
      const paso = 160;
      ctx.lineWidth = 1; ctx.strokeStyle = rgba(C.ink, .045);
      ctx.font = `10px ${css("--font-mono") || "monospace"}`; ctx.fillStyle = rgba(C.ink, .16);
      const off = -(ox * .15) % paso;
      for (let x = off - paso; x < W + paso; x += paso) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        const lon = 79 + ((x - off) / paso + Math.floor(ox * .15 / paso)) * 0.05;
        ctx.fillText(`${lon.toFixed(2)}°W`, x + 6, 16);
      }
      for (let y = paso / 2; y < H; y += paso) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        ctx.fillText(`${(9.4 - y / paso * .05).toFixed(2)}°N`, 8, y - 6);
      }
      // isobatas (curvas de profundidad) punteadas
      ctx.setLineDash([2, 7]); ctx.strokeStyle = rgba(C.acc2, .09);
      for (let k = 0; k < 5; k++) {
        ctx.beginPath();
        const y0 = H * (.1 + k * .09);
        for (let x = 0; x <= W; x += 12) {
          const X = x + ox * .1;
          const y = y0 + Math.sin(X * .004 + k * 1.7) * 40 + Math.sin(X * .011 + k) * 14 + Math.sin(t * .1 + k) * 4;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    function costa(ox) {
      const hz = horizonte();
      ctx.fillStyle = rgba(C.bg0, .55);
      ctx.beginPath(); ctx.moveTo(0, hz);
      const o = ox * .08 % 2400;
      for (const c of colinas) {
        const x = c.x - o; if (x > W + 500) break;
        ctx.quadraticCurveTo(x + c.w * .5, hz - c.h, x + c.w, hz);
      }
      ctx.lineTo(W, hz); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(C.acc2, .08); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, hz + .5); ctx.lineTo(W, hz + .5); ctx.stroke();
    }

    function barco(b, ox) {
      const hz = horizonte();
      const esc = .35 + b.z * 1.1;
      const y = hz + b.z * H * .25;
      let x = ((b.x + t * b.v * VEL * esc - ox * (.1 + b.z * .5)) % (W + 600) + W + 600) % (W + 600) - 300;
      const bob = Math.sin(t * 1.3 + b.x) * 1.5 * esc, rock = Math.sin(t * .9 + b.x) * .015;
      ctx.save(); ctx.translate(x, y + bob); ctx.rotate(rock); ctx.scale(esc, esc);
      const casco = rgba(C.bg0, .95), sup = rgba(C.ink, .10 + b.z * .12), filo = rgba(C.ink, .18 + b.z * .25);
      ctx.lineWidth = 1 / esc;
      // estela
      ctx.strokeStyle = rgba(C.ink, .08 + b.z * .1);
      for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(-10, 2); ctx.quadraticCurveTo(-60 * i, 4 + i * 2, -110 * i, 3 + i * 3); ctx.stroke(); }
      ctx.fillStyle = casco; ctx.strokeStyle = filo;
      if (b.tipo === "portacontenedores") {
        ctx.beginPath(); ctx.moveTo(-160, -14); ctx.lineTo(150, -14); ctx.lineTo(172, -26); ctx.lineTo(160, 4); ctx.lineTo(-150, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
        // contenedores
        const cols = [C.acc, C.acc2, C.ink, C.acc2, C.ink, C.acc];
        for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++) {
          ctx.fillStyle = rgba(cols[(i + j) % cols.length], .10 + b.z * .14);
          ctx.fillRect(-120 + i * 20, -26 - j * 11, 18, 10);
        }
        ctx.fillStyle = casco; ctx.fillRect(-150, -52, 22, 38); ctx.strokeRect(-150, -52, 22, 38); // puente
        ctx.fillStyle = sup; ctx.fillRect(-147, -48, 16, 4);
      } else if (b.tipo === "tanquero") {
        ctx.beginPath(); ctx.moveTo(-170, -10); ctx.lineTo(160, -10); ctx.lineTo(178, -20); ctx.lineTo(166, 4); ctx.lineTo(-160, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillRect(-160, -40, 30, 30); ctx.strokeRect(-160, -40, 30, 30);
        ctx.beginPath(); ctx.moveTo(-120, -14); ctx.lineTo(140, -14); ctx.strokeStyle = sup; ctx.stroke();
        for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(-100 + i * 30, -12, 6, Math.PI, 0); ctx.stroke(); }
      } else { // remolcador
        ctx.beginPath(); ctx.moveTo(-42, -8); ctx.lineTo(36, -8); ctx.quadraticCurveTo(50, -8, 48, 4); ctx.lineTo(-40, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillRect(-14, -24, 30, 16); ctx.strokeRect(-14, -24, 30, 16);
        ctx.fillRect(-6, -36, 18, 12); ctx.strokeRect(-6, -36, 18, 12);
        ctx.fillStyle = sup; ctx.fillRect(-3, -33, 12, 4);
        ctx.fillStyle = rgba(C.acc, .5 + b.z * .3); ctx.fillRect(-20, -18, 5, 10); // chimenea con franja
        ctx.strokeStyle = filo; ctx.beginPath(); ctx.moveTo(4, -36); ctx.lineTo(4, -46); ctx.stroke();
        // defensa de proa
        ctx.fillStyle = rgba(C.ink, .12); ctx.beginPath(); ctx.arc(44, -2, 5, 0, Math.PI * 2); ctx.fill();
      }
      // luz de tope parpadeante
      const on = (Math.sin(t * 2 + b.x) + 1) / 2;
      ctx.fillStyle = rgba("#ffffff", .25 + on * .5);
      ctx.beginPath(); ctx.arc(b.tipo === "remolcador" ? 4 : -140, b.tipo === "remolcador" ? -47 : -56, 1.8 / esc + 1, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    function olas(ox) {
      const hz = horizonte(), filas = tono === "formal" ? 18 : 24;
      for (let i = 0; i < filas; i++) {
        const z = i / filas;                         // 0 = horizonte, 1 = primer plano
        const y0 = hz + Math.pow(z, 1.6) * (H - hz) + 6;
        const amp = 2 + z * z * 16;
        const par = ox * (.1 + z * .9) + smx * 60 * PARALLAX * z;
        ctx.beginPath();
        for (let x = -20; x <= W + 20; x += 10) {
          const y = y0 + sea(x + par, i * .7, t * VEL) * amp;
          x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rgba(i % 5 === 3 ? C.acc2 : C.ink, .03 + z * .09);
        ctx.lineWidth = .6 + z * 1.1; ctx.stroke();
      }
    }

    function boyas(ox) {
      const hz = horizonte();
      for (const l of luces) {
        const x = ((l.x - ox * (.1 + l.z * .6)) % (W * 3) + W * 3) % (W * 3) - W * .5;
        if (x < -20 || x > W + 20) continue;
        const y = hz + l.z * (H - hz) * .5 + Math.sin(t * 1.4 + l.ph) * 2;
        const f = Math.max(0, Math.sin((t / l.per) * Math.PI * 2 + l.ph)) ** 6;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 18);
        g.addColorStop(0, rgba(l.c, .25 + f * .6)); g.addColorStop(1, rgba(l.c, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = rgba(l.c, .5 + f * .5); ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
        // reflejo
        ctx.fillStyle = rgba(l.c, .08 + f * .12); ctx.fillRect(x - .5, y + 4, 1, 14 + f * 10);
      }
    }

    function sonar(dt) {
      if (tono !== "formal" && Math.random() < dt * .08) pings.push({ x: rnd(W * .1, W * .9), y: rnd(horizonte() + 30, H * .95), r: 0 });
      pings = pings.filter(p => p.r < 220);
      for (const p of pings) {
        p.r += dt * 60;
        ctx.strokeStyle = rgba(C.acc2, .18 * (1 - p.r / 220)); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, p.r * .28, 0, 0, Math.PI * 2); ctx.stroke();
      }
    }

    function rosa() { // rosa de los vientos gigante, muy tenue, esquina inferior derecha
      const R = Math.min(W, H) * .42, cx = W - R * .35, cy = H - R * .25;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * .01 + camX * .0004);
      ctx.strokeStyle = rgba(C.ink, .05); ctx.lineWidth = 1;
      for (const rr of [R, R * .82, R * .5]) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.stroke(); }
      for (let i = 0; i < 72; i++) {
        const a = i / 72 * Math.PI * 2, l = i % 9 === 0 ? 18 : 7;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * R, Math.sin(a) * R); ctx.lineTo(Math.cos(a) * (R - l), Math.sin(a) * (R - l)); ctx.stroke();
      }
      ctx.fillStyle = rgba(C.ink, .035);
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * Math.PI * 2, L = i % 2 ? R * .45 : R * .8;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a - .08) * L * .25, Math.sin(a - .08) * L * .25);
        ctx.lineTo(Math.cos(a) * L, Math.sin(a) * L); ctx.lineTo(Math.cos(a + .08) * L * .25, Math.sin(a + .08) * L * .25); ctx.fill();
      }
      ctx.restore();
    }

    function spray(dt) {
      for (const m of motas) {
        m.y -= m.v * dt * VEL; m.x += Math.sin(t + m.y * .01) * .1;
        if (m.y < -5) { m.y = H + 5; m.x = rnd(0, W); }
        ctx.fillStyle = rgba(C.ink, m.a); ctx.beginPath(); ctx.arc(m.x + smx * 20 * PARALLAX, m.y, m.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    return {
      init,
      frame(dt) {
        cielo(); carta(camX); rosa(); costa(camX);
        const orden = [...barcos].sort((a, b) => a.z - b.z);
        orden.filter(b => b.z < .3).forEach(b => barco(b, camX));
        boyas(camX); olas(camX);
        orden.filter(b => b.z >= .3).forEach(b => barco(b, camX));
        sonar(dt); spray(dt);
      }
    };
  })();

  /* ======================= MOTOR: RED (constelación corporativa) ======================= */
  const red = (() => {
    let p = [];
    return {
      init() { p = Array.from({ length: Math.round(W * H / 16000) }, () => ({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-.2, .2), vy: rnd(-.2, .2), z: rnd(.3, 1) })); },
      frame() {
        const g = ctx.createRadialGradient(W * .7, H * .2, 0, W * .5, H * .5, Math.max(W, H));
        g.addColorStop(0, C.bg1); g.addColorStop(1, C.bg0); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        for (const a of p) { a.x = (a.x + a.vx * VEL + W) % W; a.y = (a.y + a.vy * VEL + H) % H; }
        const off = n => (camX * .2 * n.z + smx * 40 * PARALLAX * n.z);
        for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) {
          const a = p[i], b = p[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < 140 * 140) { ctx.strokeStyle = rgba(C.acc2, .12 * (1 - Math.sqrt(d) / 140)); ctx.beginPath(); ctx.moveTo((a.x - off(a) + W * 2) % W, a.y); ctx.lineTo((b.x - off(b) + W * 2) % W, b.y); ctx.stroke(); }
        }
        for (const a of p) { ctx.fillStyle = rgba(C.ink, .25 * a.z); ctx.beginPath(); ctx.arc((a.x - off(a) + W * 2) % W, a.y, 1.4 * a.z, 0, 7); ctx.fill(); }
      }
    };
  })();

  /* ======================= MOTOR: ONDAS (líneas sedosas, sobrio) ======================= */
  const ondas = {
    init() {},
    frame() {
      const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, C.bg0); g.addColorStop(1, C.bg1);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let k = 0; k < 40; k++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 14) {
          const X = x + camX * .3;
          const y = H * .55 + Math.sin(X * .003 + t * .3 * VEL + k * .12) * H * .16 + Math.sin(X * .007 - t * .2 + k * .05) * 40 + k * 6 + smy * 30 * PARALLAX;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = rgba(k % 8 === 0 ? C.acc : C.acc2, .02 + (k % 8 === 0 ? .06 : .035)); ctx.lineWidth = 1; ctx.stroke();
      }
    }
  };

  /* ======================= MOTOR: REJILLA (ingeniería / tecnología) ======================= */
  const rejilla = {
    init() {},
    frame() {
      ctx.fillStyle = C.bg0; ctx.fillRect(0, 0, W, H);
      const hz = H * .55, vp = W / 2 + smx * 80 * PARALLAX;
      ctx.strokeStyle = rgba(C.acc2, .1); ctx.lineWidth = 1;
      for (let i = -30; i <= 30; i++) { ctx.beginPath(); ctx.moveTo(vp + i * 8, hz); ctx.lineTo(vp + i * 160, H); ctx.stroke(); }
      const sh = (t * 30 * VEL + camX) % 60;
      for (let k = 0; k < 20; k++) { const z = (k * 60 + sh) / 1200, y = hz + Math.pow(z, 2) * (H - hz) * 1.8; if (y > H) break; ctx.globalAlpha = Math.min(1, z * 3); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.globalAlpha = 1;
      const r = ctx.createLinearGradient(0, hz - 200, 0, hz); r.addColorStop(0, rgba(C.acc2, 0)); r.addColorStop(1, rgba(C.acc2, .08));
      ctx.fillStyle = r; ctx.fillRect(0, hz - 200, W, 200);
    }
  };

  /* ======================= MOTOR: PARTÍCULAS (bokeh suave) ======================= */
  const particulas = (() => {
    let p = [];
    return {
      init() { p = Array.from({ length: 36 }, () => ({ x: rnd(0, W), y: rnd(0, H), r: rnd(20, 120), v: rnd(3, 12), c: Math.random() < .3 ? C.acc : C.acc2, a: rnd(.03, .09) })); },
      frame(dt) {
        const g = ctx.createRadialGradient(W * .3, H * .3, 0, W * .5, H * .5, Math.max(W, H)); g.addColorStop(0, C.bg1); g.addColorStop(1, C.bg0);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        for (const b of p) {
          b.y -= b.v * dt * VEL; if (b.y < -b.r) { b.y = H + b.r; b.x = rnd(0, W); }
          const x = b.x - camX * .05 * (b.r / 60) + smx * 30 * PARALLAX;
          const gr = ctx.createRadialGradient(x, b.y, 0, x, b.y, b.r); gr.addColorStop(0, rgba(b.c, b.a)); gr.addColorStop(1, rgba(b.c, 0));
          ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, 7); ctx.fill();
        }
      }
    };
  })();

  const motores = { oceano, red, ondas, rejilla, particulas };
  const M = motores[motor] || ondas;

  function loop(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    t += dt;
    camX += (camTarget - camX) * Math.min(1, dt * 1.6);
    smx += (mx - smx) * dt * 2; smy += (my - smy) * dt * 2;
    M.frame(dt);
    if (!reduce) requestAnimationFrame(loop);
  }
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => { last = performance.now(); });
  if (reduce) addEventListener("resize", () => M.frame(0));
  resize();
  requestAnimationFrame(loop);
})();
