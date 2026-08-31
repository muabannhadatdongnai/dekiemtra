import { Paragraph, TextRun, BorderStyle } from "docx";

const FONT = "Times New Roman";

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: 24, ...opts });
}

/**
 * tapLamVanExport.js
 * Builder Word RIÊNG cho khối "Tập làm văn" - đề bài + dàn ý gợi ý ngắn.
 * `subLabel` ("2. Tập làm văn") do vietnameseExamExportService.js truyền vào từ danh bạ
 * vietnameseExamBlocks.js. Tiêu đề lớn "II. KIỂM TRA VIẾT" do vietnameseExamExportService.js tự in
 * riêng, không thuộc khối này.
 *
 * FIX (thiếu giấy để viết bài văn): trước đây đề chỉ in đề bài + dàn ý gợi ý rồi hết, không còn chỗ
 * viết cả bài văn. Thêm dòng kẻ (Paragraph rỗng có `border.bottom`, cùng kỹ thuật với
 * chinhTaExport.js) - số dòng KHÔNG tính theo độ dài 1 đoạn có sẵn (Tập làm văn không có "đáp án
 * mẫu" để đo) mà lấy mức cố định theo Lớp, ĐÚNG khớp số dòng dùng ở TapLamVanBlockView.jsx (bản
 * xem trước web) để bản Word và bản xem trước nhất quán.
 */
const TAP_LAM_VAN_LINE_COUNT_BY_GRADE = { 1: 10, 2: 12, 3: 16, 4: 18, 5: 20 };
const DEFAULT_TAP_LAM_VAN_LINE_COUNT = 18;

function buildRuledLineParagraphs(lineCount) {
  return Array.from({ length: lineCount }).map(
    (_, i) =>
      new Paragraph({
        children: [textRun("")],
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" } },
        spacing: { before: 220, after: i === lineCount - 1 ? 160 : 0 },
      })
  );
}

export function buildTapLamVanDocxParagraphs(data, subLabel, grade) {
  if (!data?.deBai) return [];
  const lineCount = TAP_LAM_VAN_LINE_COUNT_BY_GRADE[Number(grade)] || DEFAULT_TAP_LAM_VAN_LINE_COUNT;

  const paragraphs = [
    new Paragraph({
      children: [textRun(`${subLabel}${data.theLoai ? ` (${data.theLoai})` : ""}`, { bold: true, size: 26 })],
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

  paragraphs.push(...buildRuledLineParagraphs(lineCount));

  return paragraphs;
}
