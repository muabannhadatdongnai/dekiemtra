import { Paragraph, TextRun } from "docx";

const FONT = "Times New Roman";

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: 24, ...opts });
}

/**
 * tapLamVanExport.js
 * Builder Word RIÊNG cho khối "Tập làm văn" - đề bài + dàn ý gợi ý ngắn.
 */
export function buildTapLamVanDocxParagraphs(data) {
  if (!data?.deBai) return [];

  const paragraphs = [
    new Paragraph({
      children: [textRun(`B. TẬP LÀM VĂN${data.theLoai ? ` (${data.theLoai})` : ""}`, { bold: true, size: 26 })],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [textRun("Đề bài: ", { bold: true }), textRun(data.deBai, { bold: true })],
      spacing: { after: 100 },
    }),
  ];

  if (Array.isArray(data.danYGoiY) && data.danYGoiY.length > 0) {
    paragraphs.push(
      new Paragraph({ children: [textRun("Gợi ý dàn ý:", { italics: true, size: 22 })], spacing: { after: 40 } })
    );
    data.danYGoiY.forEach((y) => {
      paragraphs.push(
        new Paragraph({
          children: [textRun(`- ${y}`, { italics: true, size: 22 })],
          spacing: { after: 20 },
          indent: { left: 200 },
        })
      );
    });
  }

  return paragraphs;
}
