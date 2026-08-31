import { Paragraph, TextRun, AlignmentType } from "docx";

/**
 * docThamExport.js
 * Builder Word RIÊNG cho khối "Đọc thầm" - đúng khuôn "mỗi khối tự chứa toàn bộ logic của chính
 * nó" (prompt ở docThamBlock.js, hiển thị ở DocThamBlockView.jsx, xuất Word ở đây). Chỉ trả về
 * mảng `Paragraph` của thư viện `docx` - vietnameseExamExportService.js chỉ nối mảng này vào
 * `children` của Document, không biết bên trong khối viết gì.
 *
 * `subLabel` ("2. Đọc hiểu") do vietnameseExamExportService.js truyền vào từ danh bạ
 * vietnameseExamBlocks.js - xem comment fix đánh số trong file danh bạ đó. Tiêu đề lớn
 * "I. KIỂM TRA ĐỌC" do vietnameseExamExportService.js tự in riêng, không thuộc khối này.
 */

const FONT = "Times New Roman";

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: 24, ...opts });
}

// FIX (khoảng trống câu tự luận): trước đây câu hỏi KHÔNG phải trắc nghiệm chỉ có ĐÚNG 1 dòng chấm
// - quá ngắn cho câu hỏi vận dụng cuối bài. Đổi sang 3 dòng chấm (đúng khuôn với DocThamBlockView.jsx
// bản xem trước web) - số dòng cố định theo quy tắc trình bày, không phụ thuộc AI.
const ESSAY_ANSWER_LINE_COUNT = 3;
const ESSAY_ANSWER_LINE = "............................................................";

function buildEssayAnswerParagraphs() {
  return Array.from({ length: ESSAY_ANSWER_LINE_COUNT }).map(
    (_, i) =>
      new Paragraph({
        children: [textRun(ESSAY_ANSWER_LINE)],
        spacing: { after: i === ESSAY_ANSWER_LINE_COUNT - 1 ? 100 : 60 },
        indent: { left: 200 },
      })
  );
}

export function buildDocThamDocxParagraphs(data, subLabel) {
  if (!data?.nguLieu) return [];
  const { nguLieu, cauHoi = [] } = data;

  const paragraphs = [
    new Paragraph({
      children: [textRun(subLabel, { bold: true, size: 26 })],
      spacing: { before: 200, after: 100 },
    }),
  ];

  if (nguLieu.tieuDe) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [textRun(nguLieu.tieuDe, { bold: true })],
        spacing: { after: 60 },
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      alignment: nguLieu.theLoai === "tho" ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [textRun(nguLieu.noiDung, { italics: nguLieu.theLoai === "tho" })],
      spacing: { after: 160 },
    })
  );

  paragraphs.push(
    new Paragraph({ children: [textRun("Câu hỏi:", { bold: true })], spacing: { after: 80 } })
  );

  cauHoi.forEach((q, i) => {
    paragraphs.push(
      new Paragraph({
        children: [textRun(`${i + 1}. ${q.cauHoi}`)],
        spacing: { after: 40 },
      })
    );
    if (q.loai === "trac_nghiem" && Array.isArray(q.luaChon) && q.luaChon.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [textRun(q.luaChon.join("     "))],
          spacing: { after: 100 },
          indent: { left: 200 },
        })
      );
    } else {
      paragraphs.push(...buildEssayAnswerParagraphs());
    }
  });

  return paragraphs;
}
