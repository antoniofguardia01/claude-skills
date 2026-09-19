---
name: exam-prep-kit
description: Builds an exam study kit — a Word study guide plus an infinite, filterable interactive HTML practice exam — from a student's class notes/PDFs. Use whenever someone uploads notes, a textbook chapter, or slides and asks to prepare for a test, exam, "parcial", quiz, or similar, especially if they want a study guide AND something to practice/drill with. If they also upload a past exam, graded exam, or example test from their teacher (even scanned/handwritten, even on a different topic), mine it for the teacher's exact format — question types, structure, wording, point values — and reproduce that format for the new topic instead of a generic quiz. Trigger on requests like "ayúdame a estudiar para mi examen", "haz una guía de estudio", "hazme un examen de práctica", "quiero practicar para el parcial", "study guide and practice quiz", or equivalent in any language.
---

# Exam Prep Kit

Turns class notes into two deliverables: a **study guide** (.docx) and an **infinite interactive practice exam** (single-file .html). When the student shares a real past exam from their teacher, the practice exam mimics that teacher's exact question formats instead of a generic multiple-choice quiz — this is what makes practice actually resemble the real test.

## Workflow

1. **Read the uploaded material.** Read every note/PDF/slide on the exam topic (use the `pdf`/`docx`/`pptx`/`file-reading` skills as needed to extract content). Build a mental outline of the topics, subtopics, and key facts — definitions, comparisons, sequences, numbers, exceptions. This is the source of truth for every question you write; don't invent facts not supported by the notes.

2. **If a sample/past exam was uploaded, mine it for format.** Read `references/exam_format_patterns.md` first — it catalogs the question types this skill supports and the conventions to look for (point values, instruction phrasing, table layouts, banco de palabras codes, distractor rows, etc.). Identify which of those patterns the teacher actually uses, and note any deviations. If no sample exam is available, default to a balanced mix of the four core types described there (selección única, pareo, llenar espacios, ordenar) and say so briefly to the user.

3. **Build the study guide (.docx).** View `/mnt/skills/public/docx/SKILL.md` first — this skill only supplies structure/content guidance, not the docx mechanics. Use `assets/study_guide_template.js` as a starting point: it's a working docx-generation script (Node + the `docx` package) with reusable helpers (`h1`, `h2`, `table`, `bullet`, `boldInline`, etc.) and a color palette. Copy it, replace the placeholder content with sections for each topic, keep tables for anything comparative (X vs Y), and always end with a "puntos que suelen aparecer en examen" / common-traps section calling out easily-confused pairs (similar-sounding terms, opposite mechanisms, off-by-one sequences). Render to PDF and visually spot-check 2-3 pages before finalizing (see `references/qa_checklist.md`).

4. **Build the practice exam (.html).** Use `assets/exam_template.html` as the base — it is a complete, working single-file app with:
   - Four question engines (selección única, pareo con banco de códigos, llenar espacios, ordenar con distractores) — see `references/exam_format_patterns.md` for what each expects structurally.
   - A **topic tag** on every question/set (`topics: [...]`) and a **type+topic filter UI** (chips, multi-select, "seleccionar todo"/"limpiar") that narrows what gets drawn.
   - A shuffle-queue engine so questions don't repeat until the whole (filtered) pool is exhausted — this is what makes it feel "infinite" rather than a fixed-length quiz.
   - A scoreboard (total, correct, accuracy, streak) and per-question check/next flow.

   Do the content work, not the plumbing: keep the CSS/JS engine as-is unless the sample exam needs a format this template doesn't cover (see step 5), and replace the four data arrays (`SELECCION`, `PAREO_SETS`, `FILLBLANK`, `ORDER_EXERCISES`) and the `TOPICS` list with content for the new subject. Guidelines:
   - Aim big — dozens of selección questions, several pareo sets, dozens of fill-blanks, a handful of ordering sequences. More is better as long as every item is grounded in the notes. There's no fixed target; keep going until you've covered the material thoroughly, then keep going a bit more so repeats feel fresh.
   - Every item needs at least one entry in `topics` matching an id in `TOPICS`. Pick topic ids that mirror the natural sections of the study guide (one id per major heading is usually right).
   - For pareo sets: include a couple of unused/distractor bank terms when the sample exam does this ("los términos pueden repetirse o no utilizarse").
   - For ordering exercises: include 1-2 distractor steps that don't belong in the sequence when the sample exam does this.
   - For fill-blank: give an array of acceptable answers per item (accents optional, common synonyms) since the checker normalizes case/accents but not paraphrase.
   - Match the teacher's actual phrasing/instruction style where you learned it from the sample (e.g. "Lea el enunciado y seleccione la letra que corresponde a la respuesta correcta").

5. **If the sample exam uses a format the template doesn't cover** (e.g. a clinical-case table to fill, a labeling-a-diagram exercise), don't force it into the four existing engines if it clearly doesn't fit. Either adapt the closest existing engine (a case-with-table often works as a themed set of `fill` items, or a small `pareo` set) or add a new question-type block following the same pattern as the existing four (data array + render function + check function + a CSS block) — keep it consistent with the existing visual language (see the CSS custom properties at the top of the template).

6. **Validate before delivering.** Run `scripts/validate_question_bank.js` against the finished HTML — it extracts the four data arrays and checks: every pareo `code` referenced by an item exists in that set's `banco`; no duplicate codes within a bank; every `a` (answer index) in `SELECCION` is within range of `opts`; every question/set/item has a non-empty `topics` array whose ids all exist in `TOPICS`. Fix anything it flags before presenting the file. Also run `node --check` on the extracted `<script>` contents to catch syntax errors.

7. **Deliver both files** to `/mnt/user-data/outputs/` and call `present_files` with both. In your reply, briefly tell the student what's covered and, if you mimicked their teacher's exam format, say so explicitly (e.g. "armé el examen con el mismo formato de pareo con banco de códigos que vi en tu parcial anterior").

## Notes

- Keep the whole HTML as **one self-contained file** — no external JS/CSS dependencies besides an optional Google Fonts link, since the student will open it directly as a downloaded file, possibly offline.
- This skill is language-agnostic in mechanism but the default target audience is Spanish-language secondary/university courses (Panama-style "parciales" with selección única, pareo, and complete-los-espacios were the motivating case) — keep UI copy in the same language as the student's notes/request.
- If the topic is large enough to need more than ~120 total items across all types, it's still fine to keep everything in one HTML file; the shuffle-queue engine scales without any changes.
