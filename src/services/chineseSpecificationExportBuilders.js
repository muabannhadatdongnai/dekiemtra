import { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, VerticalAlign } from "docx";
import { CHINESE_DIFFICULTY_LABELS } from "./chineseSpecificationBuilder";

/**
 * chineseSpecificationExportBuilders.js
 * Bản TIẾNG TRUNG của englishSpecificationExportBuilders.js - vẽ "考试双向细目表" (Ma trận đề) và
 * "命题细目表" (Bản đặc tả) dùng cho môn Tiếng Trung ở chineseExamExportService.js. Dữ liệu đầu vào
 * (`matrix` từ computeExamMatrix() - specificationBuilder.js, `specRows` từ
 * computeSpecificationRowsZh() - chineseSpecificationBuilder.js) TÁI DÙNG nguyên vẹn phần tính
 * toán số liệu, chỉ khác chữ hiển thị.
 *
 * ⚠️ FONT: "Times New Roman" không có glyph chữ Hán - mọi TextRun chữ Trung ở đây đều gắn thêm
 * `eastAsia: "SimSun"` (xem createLanguageHelpers() trong foreignLanguageDocBuilder.js để biết lý
 * do đầy đủ) để Word hiển thị đúng, không hiện ô vuông trống.
 */

const FONT_ZH = { ascii: "Times New Roman", hAnsi: "Times New Roman", cs: "Times New Roman", eastAsia: "SimSun" };
const TYPE_ABBR_ZH = { trac_nghiem: "选择题", tu_luan: "论述题" };
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
        children: [new TextRun({ text, bold: true, size: 22, font: FONT_ZH })],
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
        children: [new TextRun({ text: String(text ?? ""), bold, size: 22, font: FONT_ZH })],
      }),
    ],
  });
}

export function buildChineseSectionTitleParagraph(title) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: title, bold: true, size: 28, font: FONT_ZH })],
    spacing: { after: 200 },
  });
}

/** Bảng "考试双向细目表" (Ma trận đề) - đúng cấu trúc buildEnglishMatrixTable(), nhãn tiếng Trung. */
export function buildChineseMatrixTable(matrix) {
  const { levelKeys, rows, columnCountTotals, columnPointTotals, grandCount, grandPoints, typeByLevel } = matrix;
  const levelColWidth = Math.floor(60 / levelKeys.length);
  const firstColWidth = 100 - levelColWidth * levelKeys.length - 20;

  const headerRow = new TableRow({
    children: [
      headerCell("章节/主题", firstColWidth),
      ...levelKeys.map((lvl) =>
        headerCell(
          `${CHINESE_DIFFICULTY_LABELS[lvl] || lvl}（${TYPE_ABBR_ZH[typeByLevel[lvl]] || "选择题"}）`,
          levelColWidth
        )
      ),
      headerCell("题目总数", 10),
      headerCell("分数", 10),
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
      bodyCell("总计", firstColWidth, { bold: true }),
      ...levelKeys.map((lvl) => bodyCell(columnCountTotals[lvl], levelColWidth, { bold: true, align: AlignmentType.CENTER })),
      bodyCell(grandCount, 10, { bold: true, align: AlignmentType.CENTER }),
      bodyCell(grandPoints, 10, { bold: true, align: AlignmentType.CENTER }),
    ],
  });

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...bodyRows, totalRow] });
}

/** Bảng "命题细目表" (Bản đặc tả) - đúng cấu trúc buildEnglishSpecificationTable(), nhãn tiếng Trung. */
export function buildChineseSpecificationTable(specRows) {
  const headerRow = new TableRow({
    children: [
      headerCell("序号", 5),
      headerCell("章节/主题", 15),
      headerCell("难度", 12),
      headerCell("题型", 6),
      headerCell("学习要求", 40),
      headerCell("题量", 8),
      headerCell("题号", 14),
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
