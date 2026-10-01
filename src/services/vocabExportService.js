import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  TableLayoutType,
  ShadingType,
  convertMillimetersToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { PAGE_A4_MM, PAGE_MARGIN_MM } from "@/data/constants";
import { buildVocabTitleLines } from "@/data/vocabResult";

/**
 * vocabExportService.js (Phiên 51 - tab "Soạn từ vựng")
 * Xuất Word (.docx) A4 DỌC cho bản soạn từ vựng + ngữ pháp, đúng bố cục mẫu giáo viên đang dùng:
 * dòng tiêu đề (WEEK / UNIT / PERIOD) → "A. Vocabulary" (4 cột: New words | Transcription | loại từ | Meaning)
 * → "B. Grammar" (bảng 2 cột tự do). ĐỘC LẬP với mọi module export khác (Isolation over DRY).
 * Tiếng Trung/Nhật dùng file export riêng ở phiên sau (cột khác: Hán tự | Pinyin | ...), KHÔNG rẽ nhánh ở đây.
 *
 * Độ rộng bảng tính bằng TWIP cố định + layout FIXED (cùng bài học Phiên 49 ở khgdExportService.js:
 * LibreOffice bỏ qua độ rộng % nếu bảng không khai báo lưới cột).
 */

const FONT = "Times New Roman";
const FONT_SIZE = 26; // 13pt (đơn vị docx là nửa-point)
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 6, color: "000000" };
const ALL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };

const pageProperties = {
  page: {
    size: { width: convertMillimetersToTwip(PAGE_A4_MM.width), height: convertMillimetersToTwip(PAGE_A4_MM.height) },
    margin: {
      top: convertMillimetersToTwip(PAGE_MARGIN_MM.top),
      bottom: convertMillimetersToTwip(PAGE_MARGIN_MM.bottom),
      left: convertMillimetersToTwip(PAGE_MARGIN_MM.left),
      right: convertMillimetersToTwip(PAGE_MARGIN_MM.right),
    },
  },
};

const TABLE_WIDTH_TWIP = convertMillimetersToTwip(PAGE_A4_MM.width - PAGE_MARGIN_MM.left - PAGE_MARGIN_MM.right);
const pctToTwip = (pct) => Math.round((TABLE_WIDTH_TWIP * pct) / 100);

const VOCAB_COLUMNS = [27, 25, 11, 37]; // New words | Transcription | loại từ | Meaning
const GRAMMAR_COLUMNS = [38, 62];

function run(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: FONT_SIZE, ...opts });
}

function cell(text, widthPct, { bold = false, align = AlignmentType.LEFT, shade = false } = {}) {
  const lines = String(text ?? "").split(/\r?\n/);
  return new TableCell({
    width: { size: pctToTwip(widthPct), type: WidthType.DXA },
    borders: ALL_BORDERS,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 40, bottom: 40, left: 90, right: 90 },
    ...(shade ? { shading: { type: ShadingType.CLEAR, fill: "EDEDED", color: "auto" } } : {}),
    children: lines.map((l) => new Paragraph({ alignment: align, children: [run(l, { bold })] })),
  });
}

function fixedTable(rows, columnPercents) {
  return new Table({
    width: { size: TABLE_WIDTH_TWIP, type: WidthType.DXA },
    columnWidths: columnPercents.map(pctToTwip),
    layout: TableLayoutType.FIXED,
    rows,
  });
}

function formatType(type) {
  const t = String(type ?? "").trim();
  return t ? `(${t})` : "";
}

export function buildVocabularyTable(words = []) {
  const header = new TableRow({
    tableHeader: true,
    children: [
      cell("New words", VOCAB_COLUMNS[0], { bold: true, align: AlignmentType.CENTER, shade: true }),
      cell("Transcription", VOCAB_COLUMNS[1], { bold: true, align: AlignmentType.CENTER, shade: true }),
      cell("", VOCAB_COLUMNS[2], { bold: true, align: AlignmentType.CENTER, shade: true }),
      cell("Meaning", VOCAB_COLUMNS[3], { bold: true, align: AlignmentType.CENTER, shade: true }),
    ],
  });
  const rows = words.map(
    (w, i) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(`${i + 1}. ${w.word ?? ""}`, VOCAB_COLUMNS[0]),
          cell(w.ipa ?? "", VOCAB_COLUMNS[1], { align: AlignmentType.CENTER }),
          cell(formatType(w.type), VOCAB_COLUMNS[2], { align: AlignmentType.CENTER }),
          cell(w.meaning ?? "", VOCAB_COLUMNS[3]),
        ],
      })
  );
  return fixedTable([header, ...rows], VOCAB_COLUMNS);
}

export function buildGrammarTable(grammar = []) {
  const header = new TableRow({
    tableHeader: true,
    children: [
      cell("Cấu trúc / Nội dung", GRAMMAR_COLUMNS[0], { bold: true, align: AlignmentType.CENTER, shade: true }),
      cell("Giải thích / Ví dụ", GRAMMAR_COLUMNS[1], { bold: true, align: AlignmentType.CENTER, shade: true }),
    ],
  });
  const rows = grammar.map(
    (g) =>
      new TableRow({
        cantSplit: true,
        children: [cell(g.left ?? "", GRAMMAR_COLUMNS[0], { bold: true }), cell(String(g.right ?? "").replace(/\s*\|\s*/g, "\n"), GRAMMAR_COLUMNS[1])],
      })
  );
  return fixedTable([header, ...rows], GRAMMAR_COLUMNS);
}

export function buildVocabDocument({ header, words, grammar }) {
  const titleLines = buildVocabTitleLines(header);
  const children = [
    ...titleLines.map(
      (line, i) =>
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: i === titleLines.length - 1 ? 160 : 40 },
          children: [run(line, { bold: true, size: i === 0 ? 26 : 28 })],
        })
    ),
    new Paragraph({ spacing: { before: 60, after: 80 }, children: [run("A. Vocabulary", { bold: true })] }),
    buildVocabularyTable(words || []),
  ];

  if (grammar?.length) {
    children.push(
      new Paragraph({ spacing: { before: 240, after: 80 }, children: [run("B. Grammar", { bold: true })] }),
      buildGrammarTable(grammar)
    );
  }

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: FONT_SIZE } } } },
    sections: [{ properties: pageProperties, children }],
  });
}

export async function exportVocabToWord({ header, words, grammar, meta }) {
  const doc = buildVocabDocument({ header, words, grammar });
  const blob = await Packer.toBlob(doc);
  const unitPart = (header?.unit || "").split(":")[0].trim();
  const fileName = ["Soan-tu-vung", meta?.subjectLabel || "Tieng-Anh", meta?.grade ? `Lop-${meta.grade}` : "", unitPart]
    .filter(Boolean)
    .join("_")
    .replace(/\s+/g, "-");
  saveAs(blob, `${fileName}.docx`);
}
