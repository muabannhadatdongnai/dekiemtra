import { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, VerticalAlign } from "docx";
import { JAPANESE_DIFFICULTY_LABELS } from "./japaneseSpecificationBuilder";

/**
 * japaneseSpecificationExportBuilders.js
 * Bản TIẾNG NHẬT của englishSpecificationExportBuilders.js/chineseSpecificationExportBuilders.js -
 * vẽ "出題範囲表（マトリクス）" (Ma trận đề) và "出題仕様書" (Bản đặc tả) dùng cho môn Tiếng Nhật ở
 * japaneseExamExportService.js.
 *
 * ⚠️ FONT: "Times New Roman" không có glyph Kanji/Hiragana/Katakana - mọi TextRun ở đây gắn thêm
 * `eastAsia: "MS Mincho"` (xem createLanguageHelpers() trong foreignLanguageDocBuilder.js).
 */

const FONT_JA = { ascii: "Times New Roman", hAnsi: "Times New Roman", cs: "Times New Roman", eastAsia: "MS Mincho" };
const TYPE_ABBR_JA = { trac_nghiem: "選択式", tu_luan: "記述式" };
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
        children: [new TextRun({ text, bold: true, size: 22, font: FONT_JA })],
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
        children: [new TextRun({ text: String(text ?? ""), bold, size: 22, font: FONT_JA })],
      }),
    ],
  });
}

export function buildJapaneseSectionTitleParagraph(title) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: title, bold: true, size: 28, font: FONT_JA })],
    spacing: { after: 200 },
  });
}

/** Bảng "出題範囲表（マトリクス）" - đúng cấu trúc buildEnglishMatrixTable(), nhãn tiếng Nhật. */
export function buildJapaneseMatrixTable(matrix) {
  const { levelKeys, rows, columnCountTotals, columnPointTotals, grandCount, grandPoints, typeByLevel } = matrix;
  const levelColWidth = Math.floor(60 / levelKeys.length);
  const firstColWidth = 100 - levelColWidth * levelKeys.length - 20;

  const headerRow = new TableRow({
    children: [
      headerCell("単元/テーマ", firstColWidth),
      ...levelKeys.map((lvl) =>
        headerCell(
          `${JAPANESE_DIFFICULTY_LABELS[lvl] || lvl}（${TYPE_ABBR_JA[typeByLevel[lvl]] || "選択式"}）`,
          levelColWidth
        )
      ),
      headerCell("問題数", 10),
      headerCell("配点", 10),
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
      bodyCell("合計", firstColWidth, { bold: true }),
      ...levelKeys.map((lvl) => bodyCell(columnCountTotals[lvl], levelColWidth, { bold: true, align: AlignmentType.CENTER })),
      bodyCell(grandCount, 10, { bold: true, align: AlignmentType.CENTER }),
      bodyCell(grandPoints, 10, { bold: true, align: AlignmentType.CENTER }),
    ],
  });

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...bodyRows, totalRow] });
}

/** Bảng "出題仕様書" - đúng cấu trúc buildEnglishSpecificationTable(), nhãn tiếng Nhật. */
export function buildJapaneseSpecificationTable(specRows) {
  const headerRow = new TableRow({
    children: [
      headerCell("番号", 5),
      headerCell("単元/テーマ", 15),
      headerCell("難易度", 12),
      headerCell("形式", 6),
      headerCell("学習到達目標", 40),
      headerCell("問題数", 8),
      headerCell("問題番号", 14),
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
