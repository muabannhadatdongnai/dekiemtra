import { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, VerticalAlign } from "docx";
import { FRENCH_DIFFICULTY_LABELS } from "./frenchSpecificationBuilder";

/**
 * frenchSpecificationExportBuilders.js
 * Bản TIẾNG PHÁP của englishSpecificationExportBuilders.js - vẽ "Grille d'évaluation (matrice)" và
 * "Spécification de l'épreuve" dùng cho môn Tiếng Pháp ở frenchExamExportService.js. Dữ liệu đầu
 * vào (`matrix` từ computeExamMatrix() - specificationBuilder.js, `specRows` từ
 * computeSpecificationRowsFr() - frenchSpecificationBuilder.js) TÁI DÙNG nguyên vẹn phần tính toán
 * số liệu, chỉ khác chữ hiển thị. Dùng "Times New Roman" thường (không cần eastAsia - Latinh).
 */

const TYPE_ABBR_FR = { trac_nghiem: "QCM", tu_luan: "Rédaction" };
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: "444444" };
const ALL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };

function headerCell(text, widthPercent) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: ALL_BORDERS,
    shading: { fill: "F1F5F9" },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, size: 22, font: "Times New Roman" })],
      }),
    ],
  });
}

function bodyCell(text, widthPercent, { bold = false, align = AlignmentType.LEFT } = {}) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: ALL_BORDERS,
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: align,
        children: [new TextRun({ text: String(text ?? ""), bold, size: 22, font: "Times New Roman" })],
      }),
    ],
  });
}

export function buildFrenchSectionTitleParagraph(title) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: title, bold: true, size: 28, font: "Times New Roman" })],
    spacing: { after: 200 },
  });
}

/** Bảng "Grille d'évaluation (matrice)" - đúng cấu trúc buildEnglishMatrixTable(), nhãn tiếng Pháp. */
export function buildFrenchMatrixTable(matrix) {
  const { levelKeys, rows, columnCountTotals, columnPointTotals, grandCount, grandPoints, typeByLevel } = matrix;
  const levelColWidth = Math.floor(60 / levelKeys.length);
  const firstColWidth = 100 - levelColWidth * levelKeys.length - 20;

  const headerRow = new TableRow({
    children: [
      headerCell("Chapitre/Thème", firstColWidth),
      ...levelKeys.map((lvl) =>
        headerCell(
          `${FRENCH_DIFFICULTY_LABELS[lvl] || lvl} (${TYPE_ABBR_FR[typeByLevel[lvl]] || "QCM"})`,
          levelColWidth
        )
      ),
      headerCell("Total questions", 10),
      headerCell("Points", 10),
    ],
  });

  const bodyRows = rows.map(
    (r) =>
      new TableRow({
        children: [
          bodyCell(r.label, firstColWidth),
          ...levelKeys.map((lvl) => bodyCell(r.counts[lvl] || "", levelColWidth, { align: AlignmentType.CENTER })),
          bodyCell(r.rowCount, 10, { bold: true, align: AlignmentType.CENTER }),
          bodyCell(r.rowPoints, 10, { bold: true, align: AlignmentType.CENTER }),
        ],
      })
  );

  const totalRow = new TableRow({
    children: [
      bodyCell("Total", firstColWidth, { bold: true }),
      ...levelKeys.map((lvl) => bodyCell(columnCountTotals[lvl], levelColWidth, { bold: true, align: AlignmentType.CENTER })),
      bodyCell(grandCount, 10, { bold: true, align: AlignmentType.CENTER }),
      bodyCell(grandPoints, 10, { bold: true, align: AlignmentType.CENTER }),
    ],
  });

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...bodyRows, totalRow] });
}

/** Bảng "Spécification de l'épreuve" - đúng cấu trúc buildEnglishSpecificationTable(), nhãn tiếng Pháp. */
export function buildFrenchSpecificationTable(specRows) {
  const headerRow = new TableRow({
    children: [
      headerCell("N°", 5),
      headerCell("Chapitre/Thème", 15),
      headerCell("Niveau", 12),
      headerCell("Type", 6),
      headerCell("Objectif d'apprentissage", 40),
      headerCell("Nombre", 8),
      headerCell("N° de question", 14),
    ],
  });

  const bodyRows = specRows.map(
    (row) =>
      new TableRow({
        children: [
          bodyCell(row.stt, 5, { align: AlignmentType.CENTER }),
          bodyCell(row.chapterLabel, 15),
          bodyCell(row.levelLabel, 12),
          bodyCell(row.typeLabel, 6, { align: AlignmentType.CENTER }),
          bodyCell(row.requirement, 40),
          bodyCell(row.count, 8, { align: AlignmentType.CENTER }),
          bodyCell(row.questionNumbers, 14, { align: AlignmentType.CENTER }),
        ],
      })
  );

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...bodyRows] });
}
