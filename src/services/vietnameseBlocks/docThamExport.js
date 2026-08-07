import { Paragraph, TextRun, AlignmentType } from "docx";

/**
 * docThamExport.js
 * Builder Word RIÊNG cho khối "Đọc thầm" - đúng khuôn "mỗi khối tự chứa toàn bộ logic của chính
 * nó" (prompt ở docThamBlock.js, hiển thị ở DocThamBlockView.jsx, xuất Word ở đây). Chỉ trả về
 * mảng `Paragraph` của thư viện `docx` - vietnameseExamExportService.js chỉ nối mảng này vào
 * `children` của Document, không biết bên trong khối viết gì.
 */

const FONT = "Times New Roman";

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: 24, ...opts });
}

export function buildDocThamDocxParagraphs(data) {
  if (!data?.nguLieu) return [];
  const { nguLieu, cauHoi = [] } = data;

  const paragraphs = [
    new Paragraph({
      children: [textRun("A. ĐỌC THẦM", { bold: true, size: 26 })],
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
      paragraphs.push(
        new Paragraph({
          children: [textRun("............................................................")],
          spacing: { after: 100 },
          indent: { left: 200 },
        })
      );
    }
  });

  return paragraphs;
}
