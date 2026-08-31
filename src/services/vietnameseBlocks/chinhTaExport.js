import { Paragraph, TextRun, BorderStyle } from "docx";

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
 * `subLabel` ("1. Chính tả") do vietnameseExamExportService.js truyền vào từ danh bạ
 * vietnameseExamBlocks.js. Tiêu đề lớn "II. KIỂM TRA VIẾT" do vietnameseExamExportService.js tự
 * in riêng, không thuộc khối này.
 *
 * FIX (thiếu giấy để chép chính tả trong bản Word): trước đây đề chỉ in xong đoạn văn mẫu là hết -
 * không có dòng kẻ nào cho học sinh viết lại. Thêm các Paragraph RỖNG có `border.bottom` (docx HỖ
 * TRỢ vẽ đường kẻ trực tiếp trên Paragraph, không cần dựng cả Table chỉ để có 1 đường kẻ) - mỗi
 * Paragraph rỗng = 1 dòng kẻ thật trong file Word, KHÁC với các khối Toán (worksheetExportService.js)
 * trước đây chỉ để khoảng trắng suông vì bài toán đó cần đặt tính thẳng cột chứ không cần dòng kẻ.
 * Số dòng ước lượng theo ĐỘ DÀI đoạn chính tả (~50 ký tự/dòng viết tay khổ A4) + 1 dòng dư, tối
 * thiểu 4 dòng - đúng cách tính dùng ở ChinhTaBlockView.jsx (bản xem trước web), giữ nhất quán số
 * dòng giữa bản xem trước và bản Word xuất ra.
 */
const CHARS_PER_LINE_ESTIMATE = 50;
const MIN_CHINH_TA_LINES = 4;

function estimateChinhTaLineCount(noiDung) {
  const raw = Math.ceil((noiDung?.length || 0) / CHARS_PER_LINE_ESTIMATE) + 1;
  return Math.max(MIN_CHINH_TA_LINES, raw);
}

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

export function buildChinhTaDocxParagraphs(data, subLabel) {
  if (!data?.tenBai) return [];

  return [
    new Paragraph({
      children: [textRun(`${subLabel} (${KIEU_BAI_LABEL[data.kieuBai] || "Nghe – viết"})`, { bold: true, size: 26 })],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [textRun("Bài: ", { bold: true }), textRun(data.tenBai, { bold: true })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [textRun(data.noiDung)],
      spacing: { after: 100 },
    }),
    ...buildRuledLineParagraphs(estimateChinhTaLineCount(data.noiDung)),
  ];
}
