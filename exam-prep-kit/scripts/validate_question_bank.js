#!/usr/bin/env node
/*
 * scripts/validate_question_bank.js (exam-prep-kit skill)
 *
 * Extracts the four data arrays (SELECCION, PAREO_SETS, FILLBLANK,
 * ORDER_EXERCISES) and TOPICS from a finished exam HTML file and checks
 * them for structural problems that the browser won't catch on its own:
 *
 *   - every SELECCION.a is a valid index into that question's opts
 *   - every PAREO item.code exists in that set's banco (no dangling refs)
 *   - no duplicate codes within a single pareo banco
 *   - every item/question/set/exercise has a non-empty `topics` array
 *   - every topic id referenced anywhere exists in TOPICS
 *   - basic size sanity (arrays aren't empty)
 *
 * Usage:
 *   node validate_question_bank.js path/to/exam.html
 *
 * Exits non-zero and prints problems if anything is wrong; prints a
 * summary and exits 0 if everything checks out. Run this before
 * presenting the exam file to the student.
 */

const fs = require("fs");
const path = require("path");

const target = process.argv[2];
if (!target) {
  console.error("Usage: node validate_question_bank.js path/to/exam.html");
  process.exit(1);
}

const html = fs.readFileSync(target, "utf8");
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) {
  console.error("No <script> block found in the file.");
  process.exit(1);
}
const fullScript = scriptMatch[1];

// Only eval the data-definition portion (before the engine starts), so we
// don't need a DOM. The engine section begins at "const TYPE_META".
const cutoff = fullScript.indexOf("const TYPE_META");
if (cutoff === -1) {
  console.error("Could not find the engine boundary ('const TYPE_META') — is this the exam template?");
  process.exit(1);
}
const dataScript = fullScript.substring(0, cutoff);

const sandboxFile = path.join(require("os").tmpdir(), "exam_data_" + Date.now() + ".js");
fs.writeFileSync(
  sandboxFile,
  dataScript + "\nmodule.exports = { TOPICS, SELECCION, PAREO_SETS, FILLBLANK, ORDER_EXERCISES };"
);

let data;
try {
  data = require(sandboxFile);
} catch (e) {
  console.error("Failed to evaluate the data block — likely a JS syntax error:");
  console.error(e.message);
  process.exit(1);
} finally {
  fs.unlinkSync(sandboxFile);
}

const { TOPICS, SELECCION, PAREO_SETS, FILLBLANK, ORDER_EXERCISES } = data;
const problems = [];
const topicIds = new Set(TOPICS.map((t) => t.id));

function checkTopics(label, item) {
  if (!item.topics || item.topics.length === 0) {
    problems.push(`${label}: missing or empty "topics" array`);
    return;
  }
  item.topics.forEach((t) => {
    if (!topicIds.has(t)) problems.push(`${label}: topic id "${t}" not found in TOPICS`);
  });
}

if (!SELECCION || SELECCION.length === 0) problems.push("SELECCION is empty");
(SELECCION || []).forEach((q, i) => {
  const label = `SELECCION[${i}]`;
  checkTopics(label, q);
  if (typeof q.a !== "number" || q.a < 0 || q.a >= (q.opts || []).length) {
    problems.push(`${label}: answer index "a"=${q.a} is out of range for opts.length=${(q.opts || []).length}`);
  }
});

if (!PAREO_SETS || PAREO_SETS.length === 0) problems.push("PAREO_SETS is empty");
(PAREO_SETS || []).forEach((set, si) => {
  const label = `PAREO_SETS[${si}] ("${set.titulo}")`;
  checkTopics(label, set);
  const codes = (set.banco || []).map((b) => b.code);
  const dupes = codes.filter((c, i) => codes.indexOf(c) !== i);
  if (dupes.length) problems.push(`${label}: duplicate codes in banco: ${[...new Set(dupes)].join(", ")}`);
  (set.items || []).forEach((it, ii) => {
    if (!codes.includes(it.code)) {
      problems.push(`${label}.items[${ii}]: code "${it.code}" not found in banco`);
    }
  });
});

if (!FILLBLANK || FILLBLANK.length === 0) problems.push("FILLBLANK is empty");
(FILLBLANK || []).forEach((f, i) => {
  const label = `FILLBLANK[${i}]`;
  checkTopics(label, f);
  if (!f.sent || !f.sent.includes("___")) problems.push(`${label}: sentence is missing the "___" blank marker`);
  if (!f.ans || f.ans.length === 0) problems.push(`${label}: no accepted answers listed`);
});

if (!ORDER_EXERCISES || ORDER_EXERCISES.length === 0) problems.push("ORDER_EXERCISES is empty");
(ORDER_EXERCISES || []).forEach((ex, i) => {
  const label = `ORDER_EXERCISES[${i}] ("${ex.titulo}")`;
  checkTopics(label, ex);
  if (!ex.correct || ex.correct.length < 2) problems.push(`${label}: needs at least 2 steps in "correct"`);
});

// Report
console.log(`SELECCION: ${(SELECCION || []).length} preguntas`);
console.log(`PAREO_SETS: ${(PAREO_SETS || []).length} sets`);
console.log(`FILLBLANK: ${(FILLBLANK || []).length} preguntas`);
console.log(`ORDER_EXERCISES: ${(ORDER_EXERCISES || []).length} ejercicios`);
console.log(`TOPICS: ${TOPICS.length}`);
console.log("");

if (problems.length) {
  console.log(`❌ ${problems.length} problema(s) encontrado(s):`);
  problems.forEach((p) => console.log("  - " + p));
  process.exit(1);
} else {
  console.log("✅ Todo válido — sin referencias rotas ni temas huérfanos.");
  process.exit(0);
}
