import {
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  VerticalAlign,
  convertMillimetersToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { PAGE_A4_MM, PAGE_MARGIN_MM } from "@/data/constants";

/**
 * foreignLanguageDocBuilder.js
 * Bộ hàm dựng file DÙNG CHUNG cho cả 3 export service "Bản ngoại ngữ"
 * (englishLessonPlanExportService.js/englishOutlineExportService.js/englishExamExportService.js) -
 * tránh lặp lại các hàm tiện ích docx (textRun/paragraph/heading/cell...) 3 lần, và tránh lặp lại
 * cách mở PDF 3 lần. Đặt tên hàm KHÔNG gắn "english" (chỉ file gọi nó mới gắn "english") để dùng
 * lại được nguyên vẹn khi thêm ngôn ngữ mới (Tiếng Trung/Tiếng Pháp) - xem foreignLanguageSubjects.js.
 *
 * ⚠️ VÌ SAO PDF không dùng chung id="print-area" như bản tiếng Việt (LessonPlanPreview.jsx/
 * OutlinePreview.jsx/A4LivePreview.jsx): mỗi trang đó ĐÃ dùng id="print-area" cho CHÍNH bản xem
 * trước tiếng Việt đang hiển thị trên màn hình - không thể gắn thêm 1 khung "print-area" thứ 2 ẩn
 * bên cạnh (2 phần tử trùng id, CSS @media print sẽ cố hiện CẢ HAI cùng lúc khi in). Thay vào đó,
 * "Bản ngoại ngữ" mở 1 CỬA SỔ TRÌNH DUYỆT MỚI chứa HTML+CSS in ấn độc lập rồi tự gọi print() trong
 * cửa sổ đó - hoàn toàn tách biệt khỏi #print-area của trang chính, không đụng chạm/rủi ro phá vỡ
 * luồng PDF tiếng Việt hiện có, và tự nhiên hỗ trợ MỞ RỘNG (mỗi ngôn ngữ mới chỉ cần gọi lại đúng
 * hàm này với HTML khác).
 */

export const FONT = "Times New Roman";
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: "444444" };
export const ALL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };

export const pageProperties = {
  page: {
    size: {
      width: convertMillimetersToTwip(PAGE_A4_MM.width),
      height: convertMillimetersToTwip(PAGE_A4_MM.height),
    },
    margin: {
      top: convertMillimetersToTwip(PAGE_MARGIN_MM.top),
      bottom: convertMillimetersToTwip(PAGE_MARGIN_MM.bottom),
      left: convertMillimetersToTwip(PAGE_MARGIN_MM.left),
      right: convertMillimetersToTwip(PAGE_MARGIN_MM.right),
    },
  },
};

export function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: 24, ...opts });
}

// Chuyển chuỗi có "\n" thành các TextRun ngắt dòng thật trong Word (không in ký tự "\n" thô) -
// cùng lý do như multilineTextRuns() trong lessonPlanExportService.js.
export function multilineTextRuns(text, opts = {}) {
  const lines = String(text ?? "").split("\n");
  return lines.flatMap((line, i) => (i === 0 ? [textRun(line, opts)] : [textRun(line, { ...opts, break: 1 })]));
}

export function paragraph(text, opts = {}) {
  return new Paragraph({ children: multilineTextRuns(text, opts.run), spacing: { after: 100 }, ...opts.paragraph });
}

export function heading(text, level = 1) {
  return new Paragraph({
    children: [textRun(text, { bold: true, size: level === 1 ? 28 : 24 })],
    spacing: { before: 220, after: 120 },
  });
}

export function bulletList(items) {
  return (items || []).map(
    (it) =>
      new Paragraph({
        bullet: { level: 0 },
        children: multilineTextRuns(it),
        spacing: { after: 40 },
      })
  );
}

export function cell(text, widthPercent, opts = {}) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: ALL_BORDERS,
    verticalAlign: VerticalAlign.TOP,
    columnSpan: opts.columnSpan,
    shading: opts.shading,
    children: [
      new Paragraph({
        alignment: opts.alignment,
        children: opts.children || multilineTextRuns(text, { bold: opts.bold }),
      }),
    ],
  });
}

export function twoColumnTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((r) => new TableRow({ children: r })),
  });
}

/**
 * createLanguageHelpers(font) — Phiên 40 (Ngoại ngữ 2).
 * `textRun()`/`paragraph()`/`heading()`/`bulletList()`/`cell()` ở trên LUÔN dùng CỨNG
 * FONT = "Times New Roman" - đủ cho tiếng Anh/tiếng Pháp (bảng chữ Latinh, kể cả có dấu phụ) nhưng
 * KHÔNG đủ cho tiếng Trung/tiếng Nhật: "Times New Roman" không có glyph chữ Hán/Kana - Microsoft
 * Word có thể fallback sang font khác NHƯNG không đảm bảo (có trường hợp hiện ô vuông trống "tofu"
 * dù file mở được bình thường, không phải lỗi "well-formed" nên các phép kiểm schema hiện có
 * (assertValidParagraphNesting) không bắt được lỗi kiểu này - cùng bài học "PDF ổn nhưng Word thiếu
 * chữ" đã gặp ở Phiên 24-25 với hình vẽ Unicode, chỉ khác nguyên nhân).
 *
 * Hàm này trả về 1 bộ helper GIỐNG HỆT chữ ký (textRun/paragraph/heading/bulletList/cell) nhưng
 * gắn thêm `eastAsia` (đọc bởi Word khi ký tự thuộc dải Unicode CJK) bên cạnh `ascii`/`hAnsi`/`cs`
 * gốc (Word vẫn dùng Times New Roman cho phần chữ số/dấu câu Latinh xen kẽ, chỉ chữ Hán/Kana/
 * Hiragana/Katakana mới đọc font `eastAsia`) - dùng cho chineseLessonPlanExportService.js/
 * japaneseLessonPlanExportService.js (và Outline/Exam tương ứng). Tiếng Anh/Pháp KHÔNG cần gọi hàm
 * này, tiếp tục dùng thẳng textRun/paragraph/heading/bulletList/cell ở trên (Times New Roman đủ).
 *
 * ⚠️ LƯU Ý QUAN TRỌNG về shape của `font` truyền vào createLanguageHelpers(): docx@9 định nghĩa
 * `TextRun.font` là `string | { name, hint } | { ascii, hAnsi, cs, eastAsia, hint }` (xem
 * `IFontAttributesProperties` trong node_modules/docx/dist/index.d.ts) - KHÔNG có field `name` khi
 * muốn set `eastAsia` cùng lúc (nếu truyền `{ name, eastAsia }`, docx coi đây là `IFontOptions` và
 * ÂM THẦM BỎ QUA `eastAsia`, dẫn tới toàn bộ chữ Hán/Kana vẫn đọc "Times New Roman" - lỗi ĐÃ xảy ra
 * thật trong lúc phát triển Phiên 40 trước khi phát hiện qua kiểm tra XML thực tế, xem
 * foreignLanguageFontRendering.test.js). PHẢI truyền đủ `{ ascii: "Times New Roman", hAnsi: "Times
 * New Roman", cs: "Times New Roman", eastAsia: "SimSun" }` (hoặc "MS Mincho") thay vì `{ name, eastAsia }`.
 *
 * Không đổi các hàm export gốc phía trên để KHÔNG ảnh hưởng ngược lại englishLessonPlanExportService.js/
 * englishOutlineExportService.js/englishExamExportService.js đang chạy ổn định (đúng nguyên tắc
 * Isolation over DRY của dự án).
 */
export function createLanguageHelpers(font) {
  function textRunL(text, opts = {}) {
    return new TextRun({ text: String(text ?? ""), font, size: 24, ...opts });
  }

  function multilineTextRunsL(text, opts = {}) {
    const lines = String(text ?? "").split("\n");
    return lines.flatMap((line, i) => (i === 0 ? [textRunL(line, opts)] : [textRunL(line, { ...opts, break: 1 })]));
  }

  function paragraphL(text, opts = {}) {
    return new Paragraph({ children: multilineTextRunsL(text, opts.run), spacing: { after: 100 }, ...opts.paragraph });
  }

  function headingL(text, level = 1) {
    return new Paragraph({
      children: [textRunL(text, { bold: true, size: level === 1 ? 28 : 24 })],
      spacing: { before: 220, after: 120 },
    });
  }

  function bulletListL(items) {
    return (items || []).map(
      (it) =>
        new Paragraph({
          bullet: { level: 0 },
          children: multilineTextRunsL(it),
          spacing: { after: 40 },
        })
    );
  }

  function cellL(text, widthPercent, opts = {}) {
    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      borders: ALL_BORDERS,
      verticalAlign: VerticalAlign.TOP,
      columnSpan: opts.columnSpan,
      shading: opts.shading,
      children: [
        new Paragraph({
          alignment: opts.alignment,
          children: opts.children || multilineTextRunsL(text, { bold: opts.bold }),
        }),
      ],
    });
  }

  return {
    textRun: textRunL,
    multilineTextRuns: multilineTextRunsL,
    paragraph: paragraphL,
    heading: headingL,
    bulletList: bulletListL,
    cell: cellL,
  };
}

export async function saveDocx(doc, filename) {
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
  return blob;
}

export async function buildDocxBlob(doc) {
  return Packer.toBlob(doc);
}

// Escape tối thiểu để chèn text an toàn vào HTML in PDF (chống lỗi vỡ layout nếu nội dung AI
// dịch lỡ chứa ký tự "<"/"&"...) - KHÔNG escape dấu nháy đơn/kép (không cần trong text node).
function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function htmlParagraph(text, className = "") {
  const lines = escapeHtml(text).split("\n").join("<br/>");
  return `<p class="${className}">${lines}</p>`;
}

export function htmlBulletList(items, className = "") {
  if (!items?.length) return "";
  return `<ul class="${className}">${items.map((it) => `<li>${escapeHtml(it)}</li>`).join("")}</ul>`;
}

export function htmlHeading(text, level = 2) {
  return `<h${level}>${escapeHtml(text)}</h${level}>`;
}

/**
 * Mở 1 cửa sổ mới, ghi HTML in ấn (khổ A4, font Times New Roman) rồi tự gọi window.print() ngay
 * khi tải xong - "PDF" ở đây LÀ bản in trình duyệt, đúng nguyên tắc "không thêm thư viện PDF nào"
 * đã áp dụng cho toàn hệ thống (xem exportService.js:exportToPDF).
 *
 * ⚠️ FIX (Phiên 36) - lỗi "Không thể bấm chọn in/tải PDF": trước đây gọi
 * `window.open("", "_blank", "noopener,noreferrer")`. Theo đặc tả (MDN): khi feature "noopener"
 * (hoặc "noreferrer" - tự động bật kèm "noopener") được truyền vào, trình duyệt LUÔN trả về `null`
 * cho `window.open()` NGAY CẢ KHI cửa sổ đã mở thành công (đây là cơ chế an toàn có chủ đích của
 * trình duyệt, không phải bị chặn popup) - khiến điều kiện `if (!printWindow) throw ...` bên dưới
 * LUÔN đúng, báo lỗi "trình duyệt đã chặn popup" ngay cả khi popup KHÔNG hề bị chặn, và vì không
 * giữ được tham chiếu `printWindow` nên cũng KHÔNG thể ghi HTML/gọi print() vào cửa sổ đó - nút
 * "In/Tải PDF" vì vậy không bao giờ hoạt động được cho môn ngoại ngữ. Sửa: bỏ hẳn cặp
 * "noopener,noreferrer" khỏi lời gọi `window.open()` để LẤY LẠI được tham chiếu cửa sổ thật (bắt
 * buộc phải có tham chiếu này để ghi HTML in ấn vào). Rủi ro bảo mật "noopener" vốn nhằm ngăn
 * KHÔNG cho trang MỚI MỞ RA truy cập lại `window.opener` trỏ về trang gốc - áp dụng "vá tay" tương
 * đương bằng cách gán `printWindow.opener = null` NGAY SAU khi có tham chiếu, vẫn giữ được hiệu
 * quả bảo mật tương tự "noopener" mà KHÔNG mất tham chiếu cần thiết để ghi nội dung.
 */
// Font mặc định (tiếng Anh/tiếng Pháp - Latinh) - Phiên 40: cho phép truyền `fontFamily` riêng khi
// gọi từ chineseLessonPlanExportService.js/japaneseLessonPlanExportService.js (và Outline/Exam
// tương ứng), vì "Times New Roman" không có glyph chữ Hán/Kana (xem createLanguageHelpers() ở
// trên - cùng vấn đề, áp dụng cho nhánh in HTML/PDF thay vì Word).
const DEFAULT_PRINT_FONT_FAMILY = '"Times New Roman", Times, serif';

export function printHtmlDocument({ title, bodyHtml, fontFamily = DEFAULT_PRINT_FONT_FAMILY }) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error(
      "Trình duyệt đã chặn cửa sổ bật lên (popup) - vui lòng cho phép popup cho trang này rồi thử lại."
    );
  }
  try {
    // Tương đương hiệu quả bảo mật của "noopener" (ngăn cửa sổ mới thao tác ngược lại trang gốc
    // qua window.opener) nhưng KHÔNG làm mất tham chiếu printWindow như truyền thẳng "noopener"
    // vào window.open() (xem giải thích đầy đủ ở JSDoc phía trên).
    printWindow.opener = null;
  } catch {
    // Một số trình duyệt cũ có thể chặn gán thuộc tính này - bỏ qua, không ảnh hưởng luồng in.
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 20mm 18mm; }
  * { box-sizing: border-box; }
  body {
    font-family: ${fontFamily};
    font-size: 13pt;
    line-height: 1.5;
    color: #1f2933;
    margin: 0;
    padding: 0;
  }
  h1 { font-size: 16pt; text-align: center; margin: 0 0 4pt; }
  h2 { font-size: 14pt; margin: 16pt 0 6pt; border-bottom: 1px solid #999; padding-bottom: 2pt; }
  h3 { font-size: 13pt; margin: 10pt 0 4pt; }
  p { margin: 0 0 8pt; }
  ul { margin: 0 0 8pt; padding-left: 20pt; }
  li { margin-bottom: 3pt; }
  table { width: 100%; border-collapse: collapse; margin: 6pt 0 12pt; }
  th, td { border: 1px solid #444; padding: 6pt 8pt; vertical-align: top; text-align: left; }
  th { background: #f1f1f1; }
  .doc-meta { text-align: center; margin-bottom: 14pt; color: #444; }
  .doc-badge {
    display: inline-block; border: 1px solid #444; border-radius: 999px;
    padding: 2pt 10pt; font-size: 10pt; margin-bottom: 8pt; letter-spacing: 0.5px;
  }
  .section-break { break-before: page; page-break-before: always; }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // Chờ trình duyệt render xong (ảnh/font) trước khi gọi print(), tránh in ra trang trắng do gọi
  // quá sớm - cùng vấn đề đã gặp với window.print() ở luồng chính (xem A4LivePreview.jsx).
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
