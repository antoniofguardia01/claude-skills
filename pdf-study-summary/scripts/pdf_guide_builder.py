# -*- coding: utf-8 -*-
r"""
Reusable ReportLab building blocks for polished study-guide PDFs.

Import this module from a short per-task script, build a `story` list with
the helpers below, then call `render(story, out_path)`.

Example:

    from pdf_guide_builder import (
        P, title_block, heading_block, subheading, formula_block, tip_block,
        table, bullet_list, numbered_list, render, NAVY, TEAL, GOLD,
    )

    story = []
    title_block(story, "Guía Unificada — Tema X", "Subtítulo")
    heading_block(story, "1. Sección uno")
    story.append(P("Texto con **negritas** y fórmulas como H₃O⁺ o x²."))
    formula_block(story, "pH = -log [H₃O⁺]")
    render(story, r"C:\path\to\output.pdf", pdf_title="Guía - Tema X")
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    ListFlowable, ListItem, PageBreak, HRFlowable,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# ---------------------------------------------------------------------------
# Palette — swap these three accent colors to re-theme every guide at once.
# ---------------------------------------------------------------------------
NAVY = colors.HexColor("#1b3a5c")
TEAL = colors.HexColor("#1f7a6c")
GOLD = colors.HexColor("#c98a1f")
LIGHTGRAY = colors.HexColor("#f2f4f6")
DARKGREY = colors.HexColor("#333333")
GREY = colors.HexColor("#555555")

_styles = getSampleStyleSheet()

TITLE = ParagraphStyle("TitleStyle", parent=_styles["Title"], fontSize=20,
                        textColor=NAVY, spaceAfter=4, alignment=TA_CENTER)
SUBTITLE = ParagraphStyle("SubtitleStyle", parent=_styles["Normal"], fontSize=11,
                           textColor=GREY, alignment=TA_CENTER, spaceAfter=14)
H1 = ParagraphStyle("H1", parent=_styles["Heading1"], fontSize=15, textColor=colors.white,
                     backColor=NAVY, spaceBefore=14, spaceAfter=10, leftIndent=6,
                     borderPadding=(6, 6, 6, 6))
H2 = ParagraphStyle("H2", parent=_styles["Heading2"], fontSize=12.5, textColor=TEAL,
                     spaceBefore=10, spaceAfter=6)
BODY = ParagraphStyle("Body", parent=_styles["Normal"], fontSize=10.3, leading=14.5,
                       spaceAfter=6, alignment=TA_LEFT)
FORMULA = ParagraphStyle("Formula", parent=_styles["Normal"], fontSize=11.5, leading=16,
                          spaceAfter=8, alignment=TA_CENTER, textColor=NAVY,
                          backColor=LIGHTGRAY, borderPadding=(8, 8, 8, 8),
                          fontName="Helvetica-Bold")
TIP = ParagraphStyle("Tip", parent=_styles["Normal"], fontSize=9.8, leading=13.5,
                      spaceAfter=6, textColor=colors.HexColor("#5c4400"),
                      backColor=colors.HexColor("#fff6df"), borderPadding=(8, 8, 8, 8))
SMALL = ParagraphStyle("Small", parent=_styles["Normal"], fontSize=8.5, textColor=colors.grey,
                        alignment=TA_CENTER)
CELL = ParagraphStyle("Cell", parent=_styles["Normal"], fontSize=9.6, leading=12.5)
CELL_HEAD = ParagraphStyle("CellHead", parent=_styles["Normal"], fontSize=10, leading=13,
                            textColor=colors.white, fontName="Helvetica-Bold")

# ---------------------------------------------------------------------------
# ReportLab's built-in fonts have NO glyphs for Unicode sub/superscript chars
# (H₃O⁺, x², 10⁻¹⁴, ...) — they silently render as solid black boxes. `fix()`
# rewrites any such characters into real <sub>/<super> XML tags so Paragraph
# renders them correctly. Always write chemistry/math text with the natural
# Unicode characters (H₃O⁺, CH₃COOH, x², 10⁻⁷) and let fix() handle it — do
# not hand-write <sub>/<super> tags yourself.
# ---------------------------------------------------------------------------
_SUPER_MAP = {
    "\u207a": "+", "\u207b": "-",
    "\u2070": "0", "\u00b9": "1", "\u00b2": "2", "\u00b3": "3",
    "\u2074": "4", "\u2075": "5", "\u2076": "6", "\u2077": "7",
    "\u2078": "8", "\u2079": "9",
}
_SUB_MAP = {
    "\u208a": "+", "\u208b": "-",
    "\u2080": "0", "\u2081": "1", "\u2082": "2", "\u2083": "3",
    "\u2084": "4", "\u2085": "5", "\u2086": "6", "\u2087": "7",
    "\u2088": "8", "\u2089": "9",
}
_KIND = {ch: "super" for ch in _SUPER_MAP}
_KIND.update({ch: "sub" for ch in _SUB_MAP})


def fix(text):
    """Convert unicode sub/superscript runs into <sub>/<super> tags."""
    out = []
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        kind = _KIND.get(ch)
        if kind:
            mapping = _SUPER_MAP if kind == "super" else _SUB_MAP
            j = i
            run = []
            while j < n and _KIND.get(text[j]) == kind:
                run.append(mapping[text[j]])
                j += 1
            tag = "super" if kind == "super" else "sub"
            out.append(f"<{tag}>{''.join(run)}</{tag}>")
            i = j
        else:
            out.append(ch)
            i += 1
    return "".join(out)


def _bold_markup(text):
    """Turn **bold** markers into <b>bold</b> so callers can write plain markdown-ish text."""
    parts = text.split("**")
    return "".join(p if i % 2 == 0 else f"<b>{p}</b>" for i, p in enumerate(parts))


def P(text, style=BODY):
    """Build a Paragraph, auto-fixing sub/superscripts and **bold** markers."""
    return Paragraph(fix(_bold_markup(text)), style)


def heading_block(story, text):
    """A big colored section-banner heading (use for major sections: '1. Topic')."""
    story.append(P(text, H1))


def subheading(story, text):
    """A smaller teal subheading within a section."""
    story.append(P(text, H2))


def formula_block(story, text):
    """Centered, shaded, bold callout — use for key equations/formulas."""
    story.append(P(text, FORMULA))


def tip_block(story, text):
    """Yellow highlighted callout — use for exam tips, warnings, tricks."""
    story.append(P(text, TIP))


def bullet_list(story, items):
    """items: list of strings (markdown-ish, may include **bold** and sub/superscripts)."""
    story.append(ListFlowable(
        [ListItem(P(t)) for t in items], bulletType="bullet", leftIndent=14
    ))


def numbered_list(story, items):
    story.append(ListFlowable(
        [ListItem(P(t)) for t in items], bulletType="1", leftIndent=14
    ))


def page_break(story):
    story.append(PageBreak())


def spacer(story, height=8):
    story.append(Spacer(1, height))


def hrule(story, color=GOLD):
    story.append(HRFlowable(width="100%", thickness=1, color=color))


def table(story, rows, col_widths_cm, header_color=NAVY):
    """rows: list of lists of strings; first row is the header."""
    data = []
    for r_idx, row in enumerate(rows):
        st = CELL_HEAD if r_idx == 0 else CELL
        data.append([Paragraph(fix(_bold_markup(cell)), st) for cell in row])
    t = Table(data, colWidths=[w * cm for w in col_widths_cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), header_color),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHTGRAY]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cccccc")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t)


def title_block(story, title_text, subtitle_text=None, source_text=None):
    story.append(P(title_text, TITLE))
    if subtitle_text:
        story.append(P(subtitle_text, SUBTITLE))
    if source_text:
        story.append(P(source_text, SMALL))
    spacer(story, 10)
    hrule(story)
    spacer(story, 10)


def render(story, out_path, pdf_title="Guía de Estudio"):
    doc = SimpleDocTemplate(
        out_path, pagesize=letter,
        topMargin=1.6 * cm, bottomMargin=1.6 * cm,
        leftMargin=1.8 * cm, rightMargin=1.8 * cm,
        title=pdf_title,
    )
    doc.build(story)
    return out_path
