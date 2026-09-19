/*
 * PLANTILLA — assets/study_guide_template.js (exam-prep-kit skill)
 *
 * Script Node.js (usa el paquete `docx`) que genera la guía de estudio
 * en Word. Trae funciones auxiliares (h1, h2, table, bullet, boldInline,
 * subBullet, spacer) para no reescribir el boilerplate de docx en cada
 * proyecto.
 *
 * Cómo usar:
 * 1. Copia este archivo a tu carpeta de trabajo.
 * 2. Antes de tocar nada, lee /mnt/skills/public/docx/SKILL.md — esta
 *    plantilla solo cubre estructura/contenido, no los detalles de la
 *    librería docx.
 * 3. Reemplaza el contenido dentro de `sections[0].children` con las
 *    secciones reales de la materia (una h1 por tema principal, tablas
 *    para todo lo comparativo, termina con una sección de "errores
 *    comunes de examen").
 * 4. node study_guide_template.js  → genera Guia_Estudio.docx
 * 5. Conviértelo a PDF y revisa 2-3 páginas con `view` antes de entregar
 *    (ver references/qa_checklist.md).
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, PageBreak, LevelFormat
} = require("docx");

// Paleta — cambia estos 3 colores para adaptar a otra materia/colegio.
const NAVY = "1F3864";
const CRIMSON = "9C2B2B";
const GREY = "595959";

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    shading: { type: ShadingType.CLEAR, fill: NAVY },
    children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 26 })],
  });
}
function h2(text, color = CRIMSON) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, color, size: 22 })],
    border: { bottom: { color, space: 2, style: BorderStyle.SINGLE, size: 6 } },
  });
}
function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text, size: 21, ...opts })] });
}
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 21, ...opts })],
  });
}
function subBullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 1 },
    spacing: { after: 50 },
    children: [new TextRun({ text, size: 20 })],
  });
}
function boldInline(label, rest) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: [
      new TextRun({ text: label, bold: true, size: 21, color: NAVY }),
      new TextRun({ text: rest, size: 21 }),
    ],
  });
}
function spacer(h = 100) {
  return new Paragraph({ spacing: { after: h }, children: [] });
}
function cell(text, opts = {}) {
  const { header = false, width, shade } = opts;
  return new TableCell({
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: shade
      ? { type: ShadingType.CLEAR, fill: shade }
      : header
      ? { type: ShadingType.CLEAR, fill: NAVY }
      : undefined,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: header, color: header ? "FFFFFF" : "000000", size: 20 })] })],
  });
}
function table(headers, rows, widths) {
  const totalWidth = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((hText, i) => cell(hText, { header: true, width: widths[i] })) }),
      ...rows.map((r, ri) => new TableRow({ children: r.map((c, i) => cell(c, { width: widths[i], shade: ri % 2 === 1 ? "F2F2F2" : undefined })) })),
    ],
  });
}

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: "●", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 260 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "○", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 260 } } } },
      ],
    }],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
    children: [
      // ---- PORTADA ----
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "[NOMBRE DEL COLEGIO / CURSO]", size: 20, color: GREY, bold: true })] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Guía de Estudio: [TEMA]", bold: true, size: 40, color: NAVY })] }),
      new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: "Preparada para el examen — repasa cada sección y usa el examen interactivo para practicar.", size: 21, italics: true, color: GREY })] }),

      // ---- SECCIÓN DE EJEMPLO (repetir el patrón h1/h2/table/bullet por cada tema real) ----
      h1("1. [Nombre del primer tema]"),
      table(
        ["Término", "Definición"],
        [["[Término de ejemplo]", "[Definición de ejemplo — reemplazar con contenido real de los apuntes]"]],
        [2600, 6800]
      ),
      spacer(),
      p("[Texto introductorio o lista de puntos clave del tema.]", { bold: true }),
      bullet("[Punto clave 1]"),
      bullet("[Punto clave 2]"),
      boldInline("[Concepto importante]: ", "[explicación breve — usar boldInline para pares término/definición dentro de una lista]"),

      h2("[Subsección comparativa — usar h2 + table para X vs Y]"),
      table(["[Columna A]", "[Columna B]"], [["[valor]", "[valor]"]], [4700, 4700]),

      new Paragraph({ children: [new PageBreak()] }),

      // ---- SECCIÓN FINAL: ERRORES COMUNES DE EXAMEN (no omitir) ----
      h1("Puntos que suelen aparecer en examen"),
      boldInline("No confundas: ", "[par de términos fáciles de confundir #1]"),
      boldInline("No confundas: ", "[par de términos fáciles de confundir #2]"),
      boldInline("Recuerda el orden: ", "[secuencia que suele invertirse o recordarse mal]"),
      spacer(200),
      p("Cuando termines de repasar, practica con el examen interactivo (HTML) — tiene selección única, pareo con banco de códigos, completar espacios y ejercicios de ordenar.", { italics: true, color: GREY }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  require("fs").writeFileSync("Guia_Estudio.docx", buf);
  console.log("done");
});
