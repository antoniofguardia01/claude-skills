---
name: pdf-study-summary
description: Build a polished, unified study-guide PDF from one or more files the user sends (PDFs, docx, pptx, xlsx, images of notes) — class notes, guías, apuntes, past exams, slides. Use this whenever the user asks for a "resumen", "guía de estudio", "guía unificada", study guide, exam-prep summary, or wants their notes/PDFs consolidated into one document to study from — especially when they mention an upcoming exam/parcial/quiz. Trigger even if they don't say "PDF" explicitly; PDF is the default deliverable for this kind of request unless the user asks for Word/docx instead. Do NOT use this for a quick one-off question about a file's content, or when the user just wants the raw extracted text — this is specifically for turning source material into a designed, exam-ready study guide.
---

# PDF Study Summary

Turn one or more source files into a single, well-designed study-guide PDF —
the same visual style as the guide the user previously said "me quedó muy
bien": colored section banners, shaded formula callouts, tinted tip boxes,
striped tables, and a checklist at the end.

## Why this exists

A generic "summary" is just compressed text. What actually helps someone
study the night before an exam is: material reorganized by topic (not just
concatenated in source order), the key formulas pulled out and highlighted,
worked examples, and a self-check list at the end. This skill encodes that
shape so every guide comes out consistent and exam-ready, and it bundles the
ReportLab styling code so you don't have to rebuild it (and re-discover its
gotchas) from scratch each time.

## Workflow

### 1. Get every source file into Markdown first

For each input file (PDF, docx, pptx, xlsx, scanned notes, etc.), convert it
to Markdown with `markitdown` before reading it — this is the user's standing
preference to save tokens (see memory), and it applies here too:

```bash
python -m markitdown "<file>" -o "<file>.md"
```

If the `markitdown[pdf]`/`[docx]`/etc. optional dependency is missing, `pip
install --user 'markitdown[all]'` once and retry. Read the resulting `.md`
files, not the originals. Do not send these intermediate `.md` files back to
the user unless they explicitly ask for them.

### 2. Synthesize — don't concatenate

Read across *all* the converted files together and figure out the real
topic structure. Merge overlapping material (two files often cover the same
concept from different angles — combine them into one coherent explanation
rather than repeating it twice). Reorder into a logical teaching sequence,
even if the source files weren't in that order. Pull out every formula,
definition, and worked example that looks exam-relevant.

Standard shape for the guide (adapt section count/order to the actual
material — this is a pattern, not a rigid template):

1. **Title block** — guide title, subtitle naming the topics covered, and a
   small "source" line crediting the original documents/professor if named.
2. **One H1 section per major topic**, each with:
   - A plain-language explanation (not just copied source text).
   - Any formulas in a `formula_block` callout.
   - Definitions/lists as bullets.
   - A worked example or exam-style question where the source material has
     one (translate practice problems into a "how to solve it" walkthrough,
     not just the raw numbers).
3. **A comparison/reference table** wherever the source has parallel data
   (conditions vs. outcomes, steps, conjugate pairs, formulas — whatever fits
   the subject).
4. **A final "Resumen Rápido" section** with a table of every key
   formula/fact, plus a **checklist** ("Checklist para el examen") the
   student can tick through — this is the single most useful part, so don't
   skip it even for a short guide.

Use `tip_block` for exam tricks/warnings ("truco:", "importante:") — these
are what made the last guide land well; look for anything in the source that
reads like a gotcha or a common mistake and surface it there.

### 3. Build the PDF with the bundled styling module

Don't hand-roll ReportLab styling — import the helpers from
`scripts/pdf_guide_builder.py` (this skill's directory) and write a short
per-task script that just calls them with your content:

```python
import sys
sys.path.insert(0, r"<this-skill-dir>/scripts")
from pdf_guide_builder import (
    title_block, heading_block, subheading, formula_block, tip_block,
    bullet_list, numbered_list, table, page_break, spacer, render, P,
)

story = []
title_block(story, "Guía Unificada — <Topic>", "<subtitle: topics covered>",
            "Fuente: <course/professor/doc names if known>")

heading_block(story, "1. <Section title>")
story.append(P("Explanation text. Chemistry/math symbols like H₃O⁺, x² or "
               "10⁻⁷ can be typed directly — fix() converts them. Use "
               "**text** for bold."))
formula_block(story, "pH = -log [H₃O⁺]")
bullet_list(story, ["First point.", "Second point with **emphasis**."])
table(story, [["Header 1", "Header 2"], ["row", "row"]], col_widths_cm=[7, 7])

page_break(story)
heading_block(story, "Resumen Rápido — Fórmulas Clave")
table(story, [["Concepto", "Fórmula"], ["...", "..."]], col_widths_cm=[6.5, 7.5])
subheading(story, "Checklist para el examen")
bullet_list(story, ["Sé explicar X.", "Puedo calcular Y."])

render(story, r"<Desktop-or-output-path>\Guia_<Topic>.pdf", pdf_title="Guía - <Topic>")
```

Key things the module already handles for you (don't reinvent these):

- **Sub/superscripts**: type chemistry/math naturally (`H₃O⁺`, `x²`, `10⁻¹⁴`)
  in any string passed to `P()`, `table()`, `formula_block()`, etc. — the
  module's `fix()` converts Unicode sub/superscript characters into real
  ReportLab `<sub>`/`<super>` tags. **Never leave raw Unicode sub/superscript
  characters in text that bypasses these helpers** (e.g. `Table()` cells
  built by hand instead of via `table()`) — ReportLab's built-in fonts render
  those as solid black boxes, which is a real bug users will notice.
  If you write any new formula/table content outside the provided helpers,
  route the text through `fix()` yourself first.
- `**bold**` markers work anywhere text passes through `P()`/`table()`.
- Tables auto-stripe and auto-wrap `Paragraph` cells (so long cell text
  wraps instead of overflowing).
- Reuse the palette constants (`NAVY`, `TEAL`, `GOLD`) if a table or section
  wants a different accent color for a specific block (e.g. gold header for
  the final summary table, as in the reference guide).

Ensure `reportlab` is installed (`pip install --user reportlab` if the
import fails) before running the script.

### 4. Verify and deliver

Run the script, confirm the PDF was created without errors, and send only
the final PDF to the user with `SendUserFile` (not the intermediate `.md`
files or the build script). If the user separately asks for a Word version,
rebuild the same content with `python-docx`, mirroring the same section
structure — see the `anthropic-skills:docx` skill for its
sub/superscript-handling gotchas (same underlying issue: Word's default
fonts don't render raw Unicode sub/superscript glyphs either, so route
chemistry/math text through explicit `run.font.subscript`/`superscript`
flags rather than the raw Unicode characters).

## When there's ambiguity

If the user sends files without saying what to focus on, default to
covering everything in the files at a level of detail suited to exam review
(not exhaustive textbook detail). If they mention a specific exam date/topic
scope, prioritize accordingly. If it's unclear whether they want one unified
guide or separate guides per file, default to one unified guide — that was
the format that worked well — but ask if the files look like they cover
clearly unrelated subjects.
