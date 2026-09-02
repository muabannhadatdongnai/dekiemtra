import { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, VerticalAlign } from "docx";
import { ENGLISH_DIFFICULTY_LABELS } from "./englishSpecificationBuilder";

/**
 * englishSpecificationExportBuilders.js
 * Bản TIẾNG ANH của specificationExportBuilders.js - vẽ "Exam Matrix" và "Test Specification"
 * (2 bảng chuẩn Thông tư 22, dịch nhãn sang tiếng Anh) dùng cho môn Tiếng Anh ở
 * englishExamExportService.js. Dữ liệu đầu vào (`matrix` từ computeExamMatrix() -
 * specificationBuilder.js, `specRows` từ computeSpecificationRowsEn() - englishSpecificationBuilder.js)
 * TÁI DÙNG nguyên vẹn phần tính toán số liệu, chỉ khác chữ hiển thị.
 */

const TYPE_ABBR_EN = { trac_nghiem: "MC", tu_luan: "Essay" };
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

export function buildEnglishSectionTitleParagraph(title) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: title, bold: true, size: 28, font: "Times New Roman" })],
    spacing: { after: 200 },
  });
}

/** Bảng "Exam Matrix" - đúng cấu trúc buildMatrixTable() (specificationExportBuilders.js), nhãn tiếng Anh. */
export function buildEnglishMatrixTable(matrix) {
  const { levelKeys, rows, columnCountTotals, columnPointTotals, grandCount, grandPoints, typeByLevel } = matrix;
  const levelColWidth = Math.floor(60 / levelKeys.length);
  const firstColWidth = 100 - levelColWidth * levelKeys.length - 20;

  const headerRow = new TableRow({
    children: [
      headerCell("Chapter/Topic", firstColWidth),
      ...levelKeys.map((lvl) =>
        headerCell(
          `${ENGLISH_DIFFICULTY_LABELS[lvl] || lvl} (${TYPE_ABBR_EN[typeByLevel[lvl]] || "MC"})`,
          levelColWidth
        )
      ),
      headerCell("Total Questions", 10),
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

/** Bảng "Test Specification" - đúng cấu trúc buildSpecificationTable(), nhãn tiếng Anh. */
export function buildEnglishSpecificationTable(specRows) {
  const headerRow = new TableRow({
    children: [
      headerCell("No.", 5),
      headerCell("Chapter/Topic", 15),
      headerCell("Level", 12),
      headerCell("Type", 6),
      headerCell("Learning Outcome", 40),
      headerCell("Count", 8),
      headerCell("Question No.", 14),
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
