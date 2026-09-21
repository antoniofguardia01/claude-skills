#!/usr/bin/env node
// Uso: node build_exam.mjs <examen.json> <salida.html>
// Valida el JSON { tema, examen } y lo inyecta en assets/template.html.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('Uso: node build_exam.mjs <examen.json> <salida.html>');
  process.exit(2);
}

const data = JSON.parse(readFileSync(resolve(inPath), 'utf8'));
const errors = [];
const warns = [];
const err = (m) => errors.push(m);

const MOTORES = ['gimnasio', 'celulas', 'fibras', 'neuronas', 'pulso', 'constelacion', 'moleculas', 'cuadricula', 'flujo', 'brasas', 'codigo', 'tinta'];
const TIPOS = ['seleccion', 'vf', 'completar', 'ordenar', 'pareo', 'desarrollo'];
const HEX = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;

const { tema, examen } = data;
if (!tema) err('Falta "tema".');
if (!examen) err('Falta "examen".');

if (tema) {
  if (!MOTORES.includes(tema.motor)) err(`tema.motor "${tema.motor}" no existe. Opciones: ${MOTORES.join(', ')}`);
  const c = tema.colores || {};
  for (const k of ['fondo', 'panel', 'tinta', 'suave', 'acento', 'acento2', 'tintaAcento', 'bien', 'mal']) {
    if (!c[k]) err(`tema.colores.${k} es obligatorio.`);
    else if (!HEX.test(c[k])) err(`tema.colores.${k} debe ser hex (#rrggbb): "${c[k]}"`);
  }
  const f = tema.fuentes || {};
  for (const k of ['href', 'display', 'body', 'mono']) if (!f[k]) err(`tema.fuentes.${k} es obligatorio.`);
  if (f.href && !f.href.startsWith('https://fonts.googleapis.com/css2?')) warns.push('tema.fuentes.href no es una URL css2 de Google Fonts.');
  if (['cuadricula', 'codigo', 'tinta'].includes(tema.motor) && !(tema.glifos && tema.glifos.length >= 4))
    warns.push(`El motor "${tema.motor}" se ve mucho mejor con al menos 4-12 "glifos" del tema.`);

  // contraste WCAG básico
  const lum = (h) => {
    h = h.replace('#', ''); if (h.length === 3) h = [...h].map((x) => x + x).join('');
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const checks = [['tinta', 'fondo', 4.5], ['suave', 'fondo', 4.5], ['tintaAcento', 'acento', 4.5], ['acento', 'fondo', 3], ['bien', 'fondo', 3], ['mal', 'fondo', 3], ['tinta', 'panel', 4.5]];
  for (const [a, b, min] of checks) {
    if (HEX.test(c[a] || '') && HEX.test(c[b] || '')) {
      const r = ratio(c[a], c[b]);
      if (r < min) err(`Contraste bajo ${a} sobre ${b}: ${r.toFixed(2)}:1 (mínimo ${min}:1).`);
    }
  }
}

let items = 0, pts = 0;
if (examen) {
  if (!examen.titulo) err('examen.titulo es obligatorio.');
  const hasBank = examen.banco && typeof examen.banco === 'object';
  if (!hasBank && (!Array.isArray(examen.secciones) || !examen.secciones.length)) err('examen necesita "secciones" (examen fijo) o "banco" (práctica infinita).');
  if (examen.escala) {
    const e = examen.escala;
    if (typeof e.min !== 'number' || typeof e.max !== 'number' || e.max <= e.min) err('examen.escala necesita min < max numéricos.');
  }
  const checkPareo = (s, at) => {
    if (!Array.isArray(s.pares) || s.pares.length < 2) { err(`${at}: "pares" necesita al menos 2 pares.`); return false; }
    s.pares.forEach((x, i) => { if (!(x.a || x.imagen) || !x.b) err(`${at} pares[${i}]: faltan "a"/"imagen" o "b".`); });
    const as = s.pares.map((x) => x.a || x.imagen);
    if (new Set(as).size !== as.length) err(`${at}: hay elementos repetidos en la columna A.`);
    if ((s.distractores || []).some((d) => s.pares.some((x) => x.b === d))) err(`${at}: un distractor coincide con una respuesta real.`);
    return true;
  };
  const checkItem = (tipo, it, w) => {
    if (tipo === 'seleccion') {
      if (!it.pregunta) err(`${w}: falta "pregunta".`);
      if (!Array.isArray(it.opciones) || it.opciones.length < 2) err(`${w}: "opciones" necesita 2 o más.`);
      else if (!Number.isInteger(it.correcta) || it.correcta < 0 || it.correcta >= it.opciones.length) err(`${w}: "correcta" fuera de rango.`);
      else if (new Set(it.opciones.map((o) => String(o).trim().toLowerCase())).size !== it.opciones.length) err(`${w}: opciones repetidas.`);
    } else if (tipo === 'vf') {
      if (!it.afirmacion) err(`${w}: falta "afirmacion".`);
      if (typeof it.respuesta !== 'boolean') err(`${w}: "respuesta" debe ser true/false.`);
    } else if (tipo === 'completar') {
      const blanks = (String(it.texto || '').match(/_{3,}/g) || []).length;
      if (!blanks) err(`${w}: "texto" necesita al menos un ___ .`);
      if (!Array.isArray(it.respuestas) || it.respuestas.length !== blanks) err(`${w}: hay ${blanks} espacios pero ${(it.respuestas || []).length} respuestas.`);
    } else if (tipo === 'ordenar') {
      if (!it.enunciado) err(`${w}: falta "enunciado".`);
      if (!Array.isArray(it.pasos) || it.pasos.length < 3) err(`${w}: "pasos" necesita 3 o más, en el orden correcto.`);
      else {
        if (it.pasos.some((x) => typeof x !== 'string' || !x.trim())) err(`${w}: hay pasos vacíos o que no son texto.`);
        if (new Set(it.pasos.map((x) => String(x).trim().toLowerCase())).size !== it.pasos.length) err(`${w}: hay pasos repetidos.`);
        if (it.pasos.length > 8) warns.push(`${w}: ${it.pasos.length} pasos es mucho para ordenar; 4-6 funciona mejor.`);
      }
    } else if (tipo === 'desarrollo') {
      if (!it.pregunta) err(`${w}: falta "pregunta".`);
      if (!it.respuesta) err(`${w}: falta "respuesta" modelo.`);
      if (!Array.isArray(it.claves) || it.claves.length < 2) warns.push(`${w}: agrega 3-6 "claves" para la sugerencia automática de nota.`);
    }
  };
  (examen.secciones || []).forEach((s, si) => {
    const at = `secciones[${si}] (${s.tipo})`;
    if (!TIPOS.includes(s.tipo)) { err(`${at}: tipo inválido. Opciones: ${TIPOS.join(', ')}`); return; }
    const p = s.puntos ?? (s.tipo === 'desarrollo' ? 3 : s.tipo === 'ordenar' ? 2 : 1);
    if (s.tipo === 'pareo') {
      if (!checkPareo(s, at)) return;
      if (s.pares.length > 12) warns.push(`${at}: ${s.pares.length} pares es mucho para un solo bloque; considera dividirlo.`);
      items += s.pares.length; pts += s.pares.length * p;
      return;
    }
    if (!Array.isArray(s.items) || !s.items.length) { err(`${at}: "items" vacío.`); return; }
    s.items.forEach((it, i) => checkItem(s.tipo, it, `${at} items[${i}]`));
    items += s.items.length; pts += s.items.length * p;
  });
  if (hasBank) {
    const ids = new Set((examen.temas || []).map((t) => t.id));
    if (!ids.size) err('Con "banco" necesitas "temas": [{ "id", "nombre" }].');
    const seenText = new Map();
    for (const [tipo, arr] of Object.entries(examen.banco)) {
      if (!TIPOS.includes(tipo)) { err(`banco.${tipo}: tipo inválido.`); continue; }
      if (!Array.isArray(arr)) { err(`banco.${tipo} debe ser una lista.`); continue; }
      arr.forEach((it, i) => {
        const w = `banco.${tipo}[${i}]`;
        if (!ids.has(it.tema)) err(`${w}: tema "${it.tema}" no existe en "temas".`);
        if (tipo === 'pareo') { if (checkPareo(it, w)) items += it.pares.length; return; }
        checkItem(tipo, it, w); items += 1;
        const txt = String(it.pregunta || it.afirmacion || it.texto || it.enunciado || '').trim().toLowerCase() + (it.imagen || '');
        if (seenText.has(txt)) warns.push(`${w}: enunciado duplicado de ${seenText.get(txt)}.`); else seenText.set(txt, w);
      });
    }
    for (const t of examen.temas || []) {
      const n = Object.values(examen.banco).flat().filter((it) => it.tema === t.id).length;
      if (!n) warns.push(`Tema "${t.id}" no tiene preguntas.`);
    }
    for (const [i, pt] of (examen.partes || []).entries()) {
      if (!pt.id || !pt.nombre || !Array.isArray(pt.temas) || !pt.temas.length) err(`partes[${i}]: necesita id, nombre y temas.`);
      (pt.temas || []).forEach((id) => { if (!ids.has(id)) err(`partes[${i}]: tema "${id}" no existe.`); });
    }
    for (const [i, a] of (examen.accesos || []).entries()) (a.temas || []).forEach((id) => { if (!ids.has(id)) err(`accesos[${i}]: tema "${id}" no existe.`); });
  }
}

for (const w of warns) console.warn('⚠ ' + w);
if (errors.length) {
  console.error(`\n✗ ${errors.length} error(es):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

const tpl = readFileSync(join(here, '..', 'assets', 'template.html'), 'utf8');
const BS = String.fromCharCode(92); // escapa "<" y U+2028/2029 para que el JSON no cierre el <script>
const json = JSON.stringify(data).replace(new RegExp('[<' + String.fromCharCode(0x2028, 0x2029) + ']', 'g'), (c) => BS + 'u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const re = /(<script id="exam-data" type="application\/json">)[\s\S]*?(<\/script>)/;
if (!re.test(tpl)) { console.error('La plantilla no tiene el bloque exam-data.'); process.exit(1); }
let out = tpl.replace(re, (_, a, b) => `${a}\n${json}\n${b}`);
out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(examen.titulo + (examen.materia ? ' — ' + examen.materia : ''))}</title>`);
out = out.replace('<link id="fontlink" rel="stylesheet" href="">', `<link id="fontlink" rel="stylesheet" href="${escHtml(tema.fuentes.href)}">`);
if (examen.descripcion) out = out.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n<meta name="description" content="${escHtml(examen.descripcion)}">`);
writeFileSync(resolve(outPath), out);
const summary = examen.banco ? `banco infinito · ${(examen.temas || []).length} temas` : `${(examen.secciones || []).length} secciones · ${pts} pts`;
console.log(`✓ ${outPath}` + String.fromCharCode(10) + `  ${summary} · ${items} preguntas · motor "${tema.motor}"`);
