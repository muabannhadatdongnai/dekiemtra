import { Paragraph, TextRun } from "docx";

const FONT = "Times New Roman";

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: 24, ...opts });
}

/**
 * docThanhTiengExport.js
 * Builder Word RIÊNG cho khối "Đọc thành tiếng" - tĩnh, chỉ in tên bài + hướng dẫn giám thị.
 */
export function buildDocThanhTiengDocxParagraphs(data) {
  if (!data?.tenBai) return [];

  return [
    new Paragraph({
      children: [textRun("A. ĐỌC THÀNH TIẾNG", { bold: true, size: 26 })],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [textRun("Bài: ", { bold: true }), textRun(data.tenBai, { bold: true })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [textRun(data.huongDan, { italics: true, size: 22 })],
      spacing: { after: 160 },
    }),
  ];
}
