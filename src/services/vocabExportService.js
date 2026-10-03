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
 * dòng tiêu đề (WEEK / UNIT / PERIOD) → "I. Vocabulary" (6 cột: No. | New words | IPA | Từ loại (P.O.S) | Meaning |
 * Ví dụ (Example)) → "II. Grammar" (các bảng 3 cột). Phiên 51d: đổi A./B. thành I./II. để không trùng chữ "A." của
 * nhóm từ vựng trong tên bài học, thêm tiêu đề cột loại từ + cột Ví dụ. ĐỘC LẬP với mọi module export khác (Isolation over DRY).
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

const VOCAB_COLUMNS = [6, 19, 17, 11, 22, 25]; // No. | New words | IPA | Từ loại (P.O.S) | Meaning | Ví dụ (Example) (Phiên 51d)
const GRAMMAR_COLUMNS = [24, 46, 30]; // cột 1 (Nội dung/Dạng câu) | cột 2 (Giải thích/Cấu trúc) | Example (Phiên 51c: bảng 3 cột như mẫu)

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
      cell("No.", VOCAB_COLUMNS[0], { bold: true, align: AlignmentType.CENTER, shade: true }),
      cell("New words", VOCAB_COLUMNS[1], { bold: true, align: AlignmentType.CENTER, shade: true }),
      cell("IPA", VOCAB_COLUMNS[2], { bold: true, align: AlignmentType.CENTER, shade: true }),
      cell("Từ loại (P.O.S)", VOCAB_COLUMNS[3], { bold: true, align: AlignmentType.CENTER, shade: true }),
      cell("Meaning", VOCAB_COLUMNS[4], { bold: true, align: AlignmentType.CENTER, shade: true }),
      cell("Ví dụ (Example)", VOCAB_COLUMNS[5], { bold: true, align: AlignmentType.CENTER, shade: true }),
    ],
  });
  const rows = words.map(
    (w, i) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(String(i + 1), VOCAB_COLUMNS[0], { align: AlignmentType.CENTER }),
          cell(w.word ?? "", VOCAB_COLUMNS[1], { bold: true }),
          cell(w.ipa ?? "", VOCAB_COLUMNS[2], { align: AlignmentType.CENTER }),
          cell(formatType(w.type), VOCAB_COLUMNS[3], { align: AlignmentType.CENTER }),
          cell(w.meaning ?? "", VOCAB_COLUMNS[4]),
          cell(w.example ?? "", VOCAB_COLUMNS[5]),
        ],
      })
  );
  return fixedTable([header, ...rows], VOCAB_COLUMNS);
}

/** 1 bảng ngữ pháp 3 cột; tiêu đề cột lấy từ table.headers (giáo viên sửa được ở bản xem trước). */
export function buildGrammarTable(table) {
  const headers = table?.headers?.length === 3 ? table.headers : ["Content", "Explanation", "Example"];
  const header = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(h, GRAMMAR_COLUMNS[i], { bold: true, align: AlignmentType.CENTER, shade: true })),
  });
  const rows = (table?.rows || []).map(
    (g) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(g.left ?? "", GRAMMAR_COLUMNS[0], { bold: true }),
          cell(g.right ?? "", GRAMMAR_COLUMNS[1]),
          cell(g.example ?? "", GRAMMAR_COLUMNS[2]),
        ],
      })
  );
  return fixedTable([header, ...rows], GRAMMAR_COLUMNS);
}

/** Danh sách đoạn văn + bảng của mục II. Grammar: tiêu đề chủ điểm đánh số 1., 2. → tên bảng con → bảng. */
export function buildGrammarSection(tables = []) {
  const out = [];
  let topicNo = 0;
  for (const t of tables) {
    if (t.heading?.trim()) {
      topicNo += 1;
      out.push(new Paragraph({ spacing: { before: 200, after: 60 }, keepNext: true, children: [run(`${topicNo}. ${t.heading.trim()}`, { bold: true })] }));
    }
    if (t.title?.trim()) {
      out.push(new Paragraph({ spacing: { before: t.heading?.trim() ? 0 : 160, after: 60 }, keepNext: true, children: [run(t.title.trim(), { bold: true, italics: true })] }));
    }
    out.push(buildGrammarTable(t));
    out.push(new Paragraph({ spacing: { after: 60 }, children: [] }));
  }
  return out;
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
    new Paragraph({ spacing: { before: 60, after: 80 }, children: [run("I. Vocabulary", { bold: true })] }),
    buildVocabularyTable(words || []),
  ];

  if (grammar?.length) {
    children.push(
      new Paragraph({ spacing: { before: 240, after: 40 }, keepNext: true, children: [run("II. Grammar", { bold: true })] }),
      ...buildGrammarSection(grammar)
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
