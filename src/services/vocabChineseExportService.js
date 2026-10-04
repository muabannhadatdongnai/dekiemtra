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
import { buildChineseTitleLines } from "@/data/vocabChineseResult";

/**
 * vocabChineseExportService.js (Phiên 52 - tab "Soạn từ vựng", Tiếng Trung)
 * Xuất Word (.docx) A4 DỌC cho bản soạn Tiếng Trung: dòng tiêu đề (Tuần / Chủ đề / Tiết - Bài - Trang)
 * → "I. Từ vựng (生词)" (7 cột: No. | Chữ Hán | Pinyin | Âm Hán Việt | Từ loại | Nghĩa tiếng Việt | Ví dụ)
 * → "II. Ngữ pháp (语言点)" (các bảng 3 cột).
 * ĐỘC LẬP với vocabExportService.js (bản Tiếng Anh) - Isolation over DRY, đúng ghi chú Phiên 51: cột khác nhau
 * nên KHÔNG rẽ nhánh trong file Tiếng Anh. Tiếng Nhật làm file riêng ở phiên sau.
 *
 * ⚠️ FONT: chữ Hán cần `eastAsia: "SimSun"` (docx@9 chỉ nhận shape { ascii, hAnsi, cs, eastAsia } - dùng `name`
 * sẽ bị bỏ qua eastAsia, xem engineering-learnings.md), giống chineseLessonPlanExportService.js.
 * Độ rộng bảng bằng TWIP cố định + layout FIXED (bài học Phiên 49: LibreOffice bỏ qua % nếu không có lưới cột).
 */

const FONT = { ascii: "Times New Roman", hAnsi: "Times New Roman", cs: "Times New Roman", eastAsia: "SimSun" };
const FONT_SIZE = 26; // 13pt
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

export const ZH_VOCAB_COLUMNS = [6, 14, 15, 11, 10, 20, 24]; // No. | Chữ Hán | Pinyin | Âm Hán Việt | Từ loại | Nghĩa | Ví dụ
const GRAMMAR_COLUMNS = [24, 46, 30];

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

export function buildChineseVocabularyTable(words = []) {
  const C = ZH_VOCAB_COLUMNS;
  const head = (t, i) => cell(t, C[i], { bold: true, align: AlignmentType.CENTER, shade: true });
  const header = new TableRow({
    tableHeader: true,
    children: [
      head("No.", 0),
      head("Chữ Hán", 1),
      head("Pinyin", 2),
      head("Âm Hán Việt", 3),
      head("Từ loại", 4),
      head("Nghĩa", 5),
      head("Ví dụ (例句)", 6),
    ],
  });
  const rows = words.map(
    (w, i) =>
      new TableRow({
        cantSplit: true,
        children: [
          cell(String(i + 1), C[0], { align: AlignmentType.CENTER }),
          cell(w.word ?? "", C[1], { bold: true, align: AlignmentType.CENTER }),
          cell(w.pinyin ?? "", C[2], { align: AlignmentType.CENTER }),
          cell(w.hanViet ?? "", C[3], { align: AlignmentType.CENTER }),
          cell(w.type ?? "", C[4], { align: AlignmentType.CENTER }),
          cell(w.meaning ?? "", C[5]),
          cell(w.example ?? "", C[6]),
        ],
      })
  );
  return fixedTable([header, ...rows], C);
}

export function buildChineseGrammarTable(table) {
  const headers = table?.headers?.length === 3 ? table.headers : ["Nội dung", "Giải thích", "Ví dụ (例句)"];
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

export function buildChineseGrammarSection(tables = []) {
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
    out.push(buildChineseGrammarTable(t));
    out.push(new Paragraph({ spacing: { after: 60 }, children: [] }));
  }
  return out;
}

export function buildChineseVocabDocument({ header, words, grammar }) {
  const titleLines = buildChineseTitleLines(header);
  const children = [
    ...titleLines.map(
      (line, i) =>
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: i === titleLines.length - 1 ? 160 : 40 },
          children: [run(line, { bold: true, size: i === 0 ? 26 : 28 })],
        })
    ),
    new Paragraph({ spacing: { before: 60, after: 80 }, children: [run("I. Từ vựng (生词)", { bold: true })] }),
    buildChineseVocabularyTable(words || []),
  ];

  if (grammar?.length) {
    children.push(
      new Paragraph({ spacing: { before: 240, after: 40 }, keepNext: true, children: [run("II. Ngữ pháp (语言点)", { bold: true })] }),
      ...buildChineseGrammarSection(grammar)
    );
  }

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: FONT_SIZE } } } },
    sections: [{ properties: pageProperties, children }],
  });
}

export async function exportChineseVocabToWord({ header, words, grammar, meta }) {
  const doc = buildChineseVocabDocument({ header, words, grammar });
  const blob = await Packer.toBlob(doc);
  const baiPart = (header?.baiHoc || "").match(/^(?:bài|课)\s*\d+/i)?.[0] || (header?.unit || "").split(":")[0].trim();
  const fileName = ["Soan-tu-vung", meta?.subjectLabel || "Tieng-Trung", meta?.grade ? `Lop-${meta.grade}` : "", baiPart]
    .filter(Boolean)
    .join("_")
    .replace(/\s+/g, "-");
  saveAs(blob, `${fileName}.docx`);
}
