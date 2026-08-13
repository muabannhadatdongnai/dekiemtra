import { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, VerticalAlign } from "docx";
import { DIFFICULTY_LEVELS } from "@/data/promptTemplates";

/**
 * specificationExportBuilders.js
 * Vẽ "Ma trận đề thi" và "Bản đặc tả" (chuẩn Thông tư 22) thành Table trong file Word,
 * dùng chung dữ liệu đã tính từ specificationBuilder.js (không tính toán lại, không gọi AI).
 */

const TYPE_ABBR = { trac_nghiem: "TN", tu_luan: "TL" };
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

/** Trang tiêu đề cho mỗi văn bản phụ (Ma trận / Đặc tả) - tách trang riêng, không lẫn với đề thi. */
export function buildSectionTitleParagraph(title) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: title, bold: true, size: 28, font: "Times New Roman" })],
    spacing: { after: 200 },
  });
}

/** Bảng Ma trận đề thi: Chương x Mức độ, kèm cột Tổng số câu + Điểm. */
export function buildMatrixTable(matrix) {
  const { levelKeys, rows, columnCountTotals, columnPointTotals, grandCount, grandPoints, typeByLevel } = matrix;
  const levelColWidth = Math.floor(60 / levelKeys.length);
  const firstColWidth = 100 - levelColWidth * levelKeys.length - 20;

  const headerRow = new TableRow({
    children: [
      headerCell("Chương/Chủ đề", firstColWidth),
      ...levelKeys.map((lvl) =>
        headerCell(`${DIFFICULTY_LEVELS[lvl].label} (${TYPE_ABBR[typeByLevel[lvl]] || "TN"})`, levelColWidth)
      ),
      headerCell("Tổng số câu", 10),
      headerCell("Điểm", 10),
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
      bodyCell("Tổng", firstColWidth, { bold: true }),
      ...levelKeys.map((lvl) => bodyCell(columnCountTotals[lvl], levelColWidth, { bold: true, align: AlignmentType.CENTER })),
      bodyCell(grandCount, 10, { bold: true, align: AlignmentType.CENTER }),
      bodyCell(grandPoints, 10, { bold: true, align: AlignmentType.CENTER }),
    ],
  });

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...bodyRows, totalRow] });
}

/** Bảng Bản đặc tả: 1 dòng / (chương, mức độ), kèm Yêu cầu cần đạt + số câu tương ứng trong đề. */
export function buildSpecificationTable(specRows) {
  const headerRow = new TableRow({
    children: [
      headerCell("STT", 5),
      headerCell("Chương/Chủ đề", 15),
      headerCell("Mức độ", 12),
      headerCell("Loại", 6),
      headerCell("Yêu cầu cần đạt", 40),
      headerCell("Số câu", 8),
      headerCell("Câu số", 14),
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
