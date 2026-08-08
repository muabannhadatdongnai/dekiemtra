import { Paragraph, TextRun } from "docx";

const FONT = "Times New Roman";
const KIEU_BAI_LABEL = {
  nghe_viet: "Nghe – viết",
  nho_viet: "Nhớ – viết",
};

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: 24, ...opts });
}

/**
 * chinhTaExport.js
 * Builder Word RIÊNG cho khối "Chính tả" - in nguyên văn đoạn giáo viên đã tự nhập.
 */
export function buildChinhTaDocxParagraphs(data) {
  if (!data?.tenBai) return [];

  return [
    new Paragraph({
      children: [
        textRun(`B. CHÍNH TẢ (${KIEU_BAI_LABEL[data.kieuBai] || "Nghe – viết"})`, { bold: true, size: 26 }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [textRun("Bài: ", { bold: true }), textRun(data.tenBai, { bold: true })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [textRun(data.noiDung)],
      spacing: { after: 160 },
    }),
  ];
}
