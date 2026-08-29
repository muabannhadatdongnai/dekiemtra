import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ShadingType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  convertMillimetersToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { PAGE_A4_MM, PAGE_MARGIN_MM } from "@/data/constants";
import { OUTLINE_LEVEL_ORDER, OUTLINE_LEVEL_LABELS } from "@/data/outlineTemplates";
import { getSubjectLabel } from "@/data/config";

/**
 * outlineExportService.js (Bước 2 / Nhóm B - "Đề cương Ôn tập")
 * Xuất Word (.docx) - ĐỘC LẬP HOÀN TOÀN với các module export khác (không tái dùng
 * buildLessonPlanDocxSections()/buildWorksheetDocxBlob() dù cùng dùng thư viện "docx") vì bố cục
 * "3 Trụ cột" của đề cương khác hẳn khung mục I-IV của giáo án hay các "khối màu theo dạng bài"
 * của phiếu bài tập.
 *
 * 2 LUỒNG TẢI (đã cập nhật ở Bước 3/Nhóm E theo phản hồi thực tế sau khi test - xem NEXT_STEPS.md):
 *  - Bản "Học sinh" (showAnswers=false):
 *      + CÓ đề bài + LỜI GIẢI ĐẦY ĐỦ của Bài mẫu (Trụ cột 2) - ⚠️ SỬA LỖI NGHIÊM TRỌNG (Bước 3
 *        Việc E1): TRƯỚC ĐÂY lời giải Bài mẫu bị ẩn nhầm ở bản này, khiến học sinh đọc đề mẫu mà
 *        không có gì tham chiếu để tự làm Ngân hàng bài tập. Lời giải Bài mẫu KHÔNG PHẢI "đáp án"
 *        cần giấu - đây là nội dung DẠY CÁCH LÀM, phải hiển thị ở CẢ 2 bản.
 *      + KHÔNG có đáp án Ngân hàng bài tập (Trụ cột 3) - chừa dòng trống "Bài làm: ..." để tự làm.
 *      + Vẫn giữ nguyên "Kiến thức cốt lõi" (Trụ cột 1) - lý thuyết tham khảo, không phải đáp án.
 *      + CÓ "⚠️ Lỗi sai thường gặp" dưới mỗi Bài mẫu (Việc E3a) - nội dung dạy/nhắc nhở, không
 *        phải đáp án, nên hiển thị ở CẢ 2 bản giống Bài mẫu/Lời giải.
 *      + CÓ "Lộ trình Ôn tập" checklist theo ngày (Việc E3b) - đặt gần đầu file (không có Thư ngỏ
 *        ở bản này nên đặt ngay sau tiêu đề).
 *      + CÓ bảng "Tự đánh giá" (Việc E3c) ở CUỐI file - CHỈ bản Học sinh (công cụ tự nhận thức của
 *        học sinh, không cần thiết ở bản Giáo viên/Phụ huynh).
 *      + KHÔNG có phụ lục đáp án (đáp án hoàn toàn vắng mặt ở bản này).
 *  - Bản "GV-PH" (showAnswers=true):
 *      + PHỤ LỤC "Thư ngỏ gửi Phụ huynh" ở ĐẦU file (giữ nguyên từ Bước 2).
 *      + "Lộ trình Ôn tập" ngay SAU Thư ngỏ (Việc E3b - đúng yêu cầu gốc "đặt ngay sau Thư ngỏ").
 *      + Bài mẫu + Lời giải + "⚠️ Lỗi sai thường gặp" - GIỐNG HỆT bản Học sinh (nội dung dạy học,
 *        không phải đáp án cần giấu - xem giải thích ở trên).
 *      + Ngân hàng bài tập (Trụ cột 3): CHỈ đề bài + dòng trống "Bài làm: ..." - GIỐNG bản Học
 *        sinh, KHÔNG in đáp án ngay dưới câu hỏi nữa - ⚠️ THAY ĐỔI so với Bước 2 (Việc E2, "chống
 *        xem trộm": trước đây đáp án nằm ngay dưới câu hỏi, phụ huynh đưa file này cho con làm bài
 *        thì con dễ nhìn thấy đáp án câu kế tiếp).
 *      + "PHỤ LỤC: ĐÁP ÁN NGÂN HÀNG BÀI TẬP" ở TRANG CUỐI - TÁCH RIÊNG THEO TỪNG MỨC (Cơ bản/Nâng
 *        cao/Vận dụng cao, ĐÃ CHỐT với người dùng ở Bước 3), đánh số lại khớp với thứ tự bài ở
 *        mục III để giáo viên/phụ huynh dễ tra cứu - CHỈ bản này mới có phụ lục đáp án.
 *
 * ⚠️ buildParentFriendlyOutlineParagraphs() bên dưới CỐ Ý tách ĐỘC LẬP khỏi
 * buildParentFriendlyReportSections() (reportCommentExportService.js, Bước 1 Việc #8) - 2 tính
 * năng có nội dung/bố cục khác hẳn nhau (thư ngỏ theo ĐỀ CƯƠNG ÔN TẬP >< theo TỪNG HỌC SINH), gộp
 * chung sẽ phải rẽ nhánh if/else liên tục. Hàm này trả về mảng Paragraph của "docx" (KHÔNG phải
 * JSX/class Tailwind) nên KHÔNG bị ảnh hưởng bởi giới hạn Tailwind content scan (đã ghi chú trong
 * reportCommentExportService.js: chỉ áp dụng cho hàm trả JSX/CSS class, không áp dụng cho hàm chỉ
 * dựng đối tượng "docx" thuần như ở đây) - vẫn giữ nguyên tắc "hàm thuần, test được bằng Node" để
 * nhất quán với buildParentFriendlyReportSections().
 */

const FONT = "Times New Roman";

const LEVEL_SHADING = {
  coBan: "E8F8ED",
  nangCao: "FEF6E0",
  vanDungCao: "FDECEC",
};

const pageProperties = {
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

function buildHeaderParagraphs(outline, meta) {
  const subtitleParts = [];
  if (meta?.subject) subtitleParts.push(`Môn: ${getSubjectLabel(meta.subject)}`);
  if (meta?.grade) subtitleParts.push(`Lớp ${meta.grade}`);
  if (meta?.chapterLabel) subtitleParts.push(`Phạm vi: ${meta.chapterLabel}`);

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: (outline?.tenDeCuong || "ĐỀ CƯƠNG ÔN TẬP").toUpperCase(), bold: true, size: 32, font: FONT }),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: subtitleParts.join(" — "), size: 22, font: FONT, color: "475569" })],
      spacing: { after: 240 },
    }),
  ];
}

function sectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 26, font: FONT })],
    spacing: { before: 200, after: 100 },
  });
}

/** Trụ cột 1 - Kiến thức cốt lõi: LUÔN xuất hiện ở cả 2 bản (không phải "đáp án" cần giấu). */
function buildKienThucCotLoiParagraphs(items) {
  if (!items?.length) return [];
  const paragraphs = [sectionHeading("I. KIẾN THỨC CỐT LÕI")];
  items.forEach((it) => {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: it.tieuMuc || "", bold: true, size: 23, font: FONT })],
        spacing: { before: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: it.noiDung || "", size: 22, font: FONT })],
        spacing: { after: 60 },
      })
    );
  });
  return paragraphs;
}

/**
 * Trụ cột 2 - Dạng bài + bài mẫu: "baiMauLoiGiai" (Việc E1 - đã sửa) và "canhBaoBayLoi" (Việc
 * E3a) LUÔN hiển thị, KHÔNG phụ thuộc showAnswers - đây là nội dung DẠY CÁCH LÀM, không phải đáp
 * án cần giấu (khác hẳn "dapAn" ở Trụ cột 3 - xem buildNganHangBaiTapParagraphs()).
 */
function buildDangBaiParagraphs(items) {
  if (!items?.length) return [];
  const paragraphs = [sectionHeading("II. DẠNG BÀI + BÀI MẪU")];
  const border = { style: BorderStyle.SINGLE, size: 4, color: "A5B4FC", space: 6 };

  items.forEach((it, i) => {
    paragraphs.push(
      new Paragraph({
        border: { top: border, left: border, right: border },
        shading: { type: ShadingType.CLEAR, fill: "EEF2FF" },
        children: [new TextRun({ text: it.tenDang || `Dạng ${i + 1}`, bold: true, size: 23, font: FONT, color: "3730A3" })],
        spacing: { before: 120, after: 20 },
      })
    );
    if (it.luuY) {
      paragraphs.push(
        new Paragraph({
          border: { left: border, right: border },
          shading: { type: ShadingType.CLEAR, fill: "EEF2FF" },
          children: [new TextRun({ text: `💡 Lưu ý: ${it.luuY}`, italics: true, size: 21, font: FONT, color: "4338CA" })],
          spacing: { after: 20 },
        })
      );
    }
    paragraphs.push(
      new Paragraph({
        border: { left: border, right: border },
        shading: { type: ShadingType.CLEAR, fill: "EEF2FF" },
        children: [
          new TextRun({ text: "Bài mẫu: ", bold: true, size: 22, font: FONT }),
          new TextRun({ text: it.baiMauDe || "", size: 22, font: FONT }),
        ],
        spacing: { after: 20 },
      })
    );
    paragraphs.push(
      new Paragraph({
        border: { left: border, right: border, bottom: it.canhBaoBayLoi ? undefined : border },
        shading: { type: ShadingType.CLEAR, fill: "EEF2FF" },
        children: [
          new TextRun({ text: "Lời giải: ", bold: true, size: 22, font: FONT }),
          new TextRun({ text: it.baiMauLoiGiai || "", size: 22, font: FONT }),
        ],
        spacing: { after: it.canhBaoBayLoi ? 20 : 120 },
      })
    );
    if (it.canhBaoBayLoi) {
      paragraphs.push(
        new Paragraph({
          border: { left: border, right: border, bottom: border },
          shading: { type: ShadingType.CLEAR, fill: "FEF3C7" },
          children: [
            new TextRun({ text: "⚠️ Lỗi sai thường gặp: ", bold: true, size: 21, font: FONT, color: "92400E" }),
            new TextRun({ text: it.canhBaoBayLoi, size: 21, font: FONT, color: "92400E" }),
          ],
          spacing: { after: 120 },
        })
      );
    }
  });
  return paragraphs;
}

/**
 * Ghi nhãn "[NGÀY N]" ngay trước bài đầu tiên của mỗi ngày trong 1 mức độ, dựa vào trường "ngay"
 * (số nguyên, do AI gán trực tiếp trên từng bài - xem outlinePromptTemplates.js) - KHÔNG dựa vào
 * việc dò/đối chiếu câu chữ tự do ở "loTrinhOnTap", để tránh lệch giữa Lộ trình và Ngân hàng bài
 * tập (Bug đối chiếu Lộ trình, phản hồi thực tế). Bài không có "ngay" hợp lệ (thiếu/0/NaN) thì bỏ
 * qua nhãn, giữ nguyên hành vi cũ (không chặn xuất file nếu AI lỡ thiếu trường mới này).
 */
function dayLabelParagraph(ngay) {
  return new Paragraph({
    children: [new TextRun({ text: `[NGÀY ${ngay}]`, bold: true, italics: true, size: 20, font: FONT, color: "334155" })],
    spacing: { before: 100, after: 40 },
  });
}

/**
 * Trụ cột 3 - Ngân hàng bài tập 3 mức: mỗi bài đánh số trong đúng mức của nó. Việc E2 (Bước 3) -
 * ĐÃ SỬA: "dapAn" KHÔNG còn in ngay dưới câu hỏi ở BẤT KỲ bản nào nữa (kể cả bản GV-PH) - luôn
 * chừa dòng trống "Bài làm: ..." ở đây, đáp án chuyển hẳn sang phụ lục riêng cuối tài liệu (xem
 * buildAnswerKeyAppendixParagraphs()) chỉ có ở bản GV-PH - lý do "chống xem trộm" (phụ huynh dùng
 * bản GV-PH cho con làm bài thì con không còn nhìn thấy đáp án câu kế tiếp ngay dưới câu hỏi).
 *
 * Sửa "đứt gãy đối chiếu Lộ trình" (phản hồi thực tế): chèn thêm nhãn "[NGÀY N]" ngay trước bài
 * đầu tiên mỗi khi "ngay" đổi giá trị, để học sinh/phụ huynh biết ngay bài nào ứng với ngày nào
 * trong Lộ trình mà KHÔNG phải tự đếm 1, 2, 3... rồi lật lên đối chiếu.
 */
function buildNganHangBaiTapParagraphs(nganHangBaiTap) {
  if (!nganHangBaiTap) return [];
  const paragraphs = [sectionHeading("III. NGÂN HÀNG BÀI TẬP (3 MỨC ĐỘ)")];

  OUTLINE_LEVEL_ORDER.forEach((level) => {
    const items = nganHangBaiTap[level] || [];
    if (items.length === 0) return;

    paragraphs.push(
      new Paragraph({
        shading: { type: ShadingType.CLEAR, fill: LEVEL_SHADING[level] },
        children: [new TextRun({ text: OUTLINE_LEVEL_LABELS[level], bold: true, size: 22, font: FONT })],
        spacing: { before: 140, after: 60 },
      })
    );

    let lastNgay = null;
    items.forEach((ex, i) => {
      const ngay = Number(ex.ngay) > 0 ? Number(ex.ngay) : null;
      if (ngay !== null && ngay !== lastNgay) {
        paragraphs.push(dayLabelParagraph(ngay));
        lastNgay = ngay;
      }
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `${i + 1}. ${ex.de || ""}`, size: 22, font: FONT })],
          spacing: { after: 20 },
        })
      );
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: "   Bài làm: .......................................................................", size: 20, font: FONT, color: "94A3B8" })],
          spacing: { after: 100 },
        })
      );
    });
  });

  return paragraphs;
}

/**
 * "PHỤ LỤC: ĐÁP ÁN NGÂN HÀNG BÀI TẬP" (Việc E2, Bước 3) - CHỈ chèn ở bản GV-PH, đặt ở TRANG CUỐI
 * tài liệu (dùng pageBreakBefore để luôn bắt đầu 1 trang mới, tách biệt hẳn với nội dung câu hỏi
 * phía trên). ĐÃ CHỐT với người dùng: tách riêng theo TỪNG MỨC (Cơ bản/Nâng cao/Vận dụng cao),
 * đánh số lại trong từng mức khớp đúng thứ tự bài ở mục III (không đánh số liên tục xuyên suốt).
 */
function buildAnswerKeyAppendixParagraphs(nganHangBaiTap) {
  if (!nganHangBaiTap) return [];
  const hasAnyItem = OUTLINE_LEVEL_ORDER.some((level) => (nganHangBaiTap[level] || []).length > 0);
  if (!hasAnyItem) return [];

  const paragraphs = [
    new Paragraph({
      pageBreakBefore: true,
      children: [new TextRun({ text: "PHỤ LỤC: ĐÁP ÁN NGÂN HÀNG BÀI TẬP", bold: true, size: 26, font: FONT })],
      spacing: { before: 100, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "(Đáp án được tách riêng ở đây để tránh lộ ra ngay dưới câu hỏi khi dùng bản này cho con tự làm bài)",
          italics: true,
          size: 20,
          font: FONT,
          color: "64748B",
        }),
      ],
      spacing: { after: 160 },
    }),
  ];

  OUTLINE_LEVEL_ORDER.forEach((level) => {
    const items = nganHangBaiTap[level] || [];
    if (items.length === 0) return;

    paragraphs.push(
      new Paragraph({
        shading: { type: ShadingType.CLEAR, fill: LEVEL_SHADING[level] },
        children: [new TextRun({ text: OUTLINE_LEVEL_LABELS[level], bold: true, size: 22, font: FONT })],
        spacing: { before: 140, after: 60 },
      })
    );

    let lastNgay = null;
    items.forEach((ex, i) => {
      const ngay = Number(ex.ngay) > 0 ? Number(ex.ngay) : null;
      if (ngay !== null && ngay !== lastNgay) {
        paragraphs.push(dayLabelParagraph(ngay));
        lastNgay = ngay;
      }
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${i + 1}. `, bold: true, size: 21, font: FONT }),
            new TextRun({ text: ex.dapAn || "", size: 21, font: FONT, color: "166534" }),
          ],
          spacing: { after: 40 },
        })
      );
    });
  });

  return paragraphs;
}

/**
 * buildParentFriendlyOutlineParagraphs() - xem giải thích lý do tách độc lập ở đầu file.
 * Chỉ chèn khi có dữ liệu "thuNgoPhuHuynh" - đặt ở ĐẦU bản GV-PH (trước cả 3 Trụ cột) để giáo
 * viên đọc/gửi ngay không cần lật tới cuối file.
 */
export function buildParentFriendlyOutlineParagraphs(thuNgoPhuHuynh, meta) {
  if (!thuNgoPhuHuynh) return [];
  const border = { style: BorderStyle.DASHED, size: 6, color: "FBBF24", space: 8 };

  return [
    new Paragraph({
      border: { top: border, bottom: border, left: border, right: border },
      shading: { type: ShadingType.CLEAR, fill: "FFFBEB" },
      children: [new TextRun({ text: "💌 THƯ NGỎ GỬI PHỤ HUYNH", bold: true, size: 24, font: FONT, color: "B45309" })],
      spacing: { before: 100, after: 60 },
    }),
    new Paragraph({
      border: { left: border, right: border, bottom: border },
      shading: { type: ShadingType.CLEAR, fill: "FFFBEB" },
      children: [
        new TextRun({
          text: `Kính gửi Quý Phụ huynh${meta?.chapterLabel ? ` — Phạm vi ôn tập: ${meta.chapterLabel}` : ""},`,
          italics: true,
          size: 22,
          font: FONT,
        }),
      ],
      spacing: { after: 40 },
    }),
    new Paragraph({
      border: { left: border, right: border, bottom: border },
      shading: { type: ShadingType.CLEAR, fill: "FFFBEB" },
      children: [new TextRun({ text: thuNgoPhuHuynh, size: 22, font: FONT })],
      spacing: { after: 200 },
    }),
  ];
}

/**
 * "Lộ trình Ôn tập" (Việc E3b, Bước 3) - checklist theo NGÀY (số ngày do giáo viên tự nhập qua
 * "soNgayOnTap", xem outlinePromptTemplates.js) - CÓ Ở CẢ 2 BẢN (nội dung dạy/hướng dẫn tự học,
 * không phải đáp án cần giấu). Đặt gần đầu file (ngay sau Thư ngỏ ở bản GV-PH đúng yêu cầu gốc;
 * bản Học sinh không có Thư ngỏ nên đặt ngay sau tiêu đề).
 */
function buildStudyPlanParagraphs(loTrinhOnTap) {
  if (!loTrinhOnTap?.length) return [];
  const border = { style: BorderStyle.SINGLE, size: 4, color: "93C5FD", space: 6 };

  const paragraphs = [
    new Paragraph({
      border: { top: border, left: border, right: border },
      shading: { type: ShadingType.CLEAR, fill: "EFF6FF" },
      children: [new TextRun({ text: "🗓️ LỘ TRÌNH ÔN TẬP", bold: true, size: 24, font: FONT, color: "1D4ED8" })],
      spacing: { before: 100, after: 60 },
    }),
  ];

  loTrinhOnTap.forEach((item, i) => {
    const isLast = i === loTrinhOnTap.length - 1;
    paragraphs.push(
      new Paragraph({
        border: { left: border, right: border, bottom: isLast ? border : undefined },
        shading: { type: ShadingType.CLEAR, fill: "EFF6FF" },
        children: [
          new TextRun({ text: "☐ ", bold: true, size: 22, font: FONT }),
          new TextRun({ text: `${item.ngay || `Ngày ${i + 1}`}: `, bold: true, size: 22, font: FONT, color: "1D4ED8" }),
          new TextRun({ text: item.nhiemVu || "", size: 22, font: FONT }),
        ],
        spacing: { after: isLast ? 200 : 40 },
      })
    );
  });

  return paragraphs;
}

/**
 * Bảng "Tự đánh giá" (Việc E3c, Bước 3) - CHỈ ở bản Học sinh (công cụ tự nhận thức của học sinh),
 * đặt ở TRANG CUỐI. KHÔNG cần AI sinh thêm dữ liệu mới - tự động lấy danh sách "tenDang" đã có sẵn
 * từ Trụ cột 2 (mỗi Dạng bài đã soạn tương ứng 1 dòng để học sinh tự chấm mức độ hiểu bài).
 */
function buildSelfReflectionParagraphs(dangBai) {
  if (!dangBai?.length) return [];

  const paragraphs = [
    new Paragraph({
      pageBreakBefore: true,
      children: [new TextRun({ text: "📊 TỰ ĐÁNH GIÁ MỨC ĐỘ HIỂU BÀI", bold: true, size: 26, font: FONT })],
      spacing: { before: 100, after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Sau khi ôn xong mỗi dạng bài, con hãy khoanh tròn mức độ hiểu bài của mình nhé:",
          italics: true,
          size: 21,
          font: FONT,
          color: "475569",
        }),
      ],
      spacing: { after: 140 },
    }),
  ];

  const rows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: "E2E8F0" },
          children: [new Paragraph({ children: [new TextRun({ text: "Dạng bài", bold: true, size: 21, font: FONT })] })],
        }),
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: "E2E8F0" },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "Mức độ tự đánh giá", bold: true, size: 21, font: FONT })],
            }),
          ],
        }),
      ],
    }),
  ];

  dangBai.forEach((it) => {
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: it.tenDang || "", size: 21, font: FONT })] })],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "😃 Rất hiểu     -     😐 Hơi băn khoăn     -     😥 Cần cô giảng lại", size: 20, font: FONT }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  });

  paragraphs.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
    })
  );

  return paragraphs;
}

/** Dựng Blob .docx - hàm lõi dùng chung, KHÔNG tự tải file, cùng quy ước
 * buildWorksheetDocxBlob()/buildLessonPlanDocxSections(). */
export async function buildOutlineDocxBlob({ outline, meta = {}, showAnswers = false }) {
  const headerParagraphs = buildHeaderParagraphs(outline, meta);
  const parentLetterParagraphs = showAnswers
    ? buildParentFriendlyOutlineParagraphs(outline?.thuNgoPhuHuynh, meta)
    : [];
  const studyPlanParagraphs = buildStudyPlanParagraphs(outline?.loTrinhOnTap);
  const kienThucParagraphs = buildKienThucCotLoiParagraphs(outline?.kienThucCotLoi);
  const dangBaiParagraphs = buildDangBaiParagraphs(outline?.dangBai);
  const nganHangParagraphs = buildNganHangBaiTapParagraphs(outline?.nganHangBaiTap);
  const answerKeyParagraphs = showAnswers ? buildAnswerKeyAppendixParagraphs(outline?.nganHangBaiTap) : [];
  const selfReflectionParagraphs = showAnswers ? [] : buildSelfReflectionParagraphs(outline?.dangBai);

  const doc = new Document({
    sections: [
      {
        properties: pageProperties,
        children: [
          ...headerParagraphs,
          ...parentLetterParagraphs,
          ...studyPlanParagraphs,
          ...kienThucParagraphs,
          ...dangBaiParagraphs,
          ...nganHangParagraphs,
          ...answerKeyParagraphs,
          ...selfReflectionParagraphs,
        ],
      },
    ],
  });

  // ⚠️ Chạy phía browser nên PHẢI dùng Packer.toBlob(), KHÔNG dùng toBuffer() (API Node.js) -
  // giống lưu ý đã rút ra ở Giai đoạn 11 (lessonPlanExportService.js quên "return blob").
  return Packer.toBlob(doc);
}

function slugifyTitle(title) {
  return (title || "De-cuong-on-tap").trim().replace(/\s+/g, "-");
}

/** Xuất 1 file .docx duy nhất - bản "sạch" cho học sinh (mặc định). */
export async function exportOutlineToWord({ outline, meta }) {
  const blob = await buildOutlineDocxBlob({ outline, meta, showAnswers: false });
  saveAs(blob, `${slugifyTitle(outline?.tenDeCuong)}-HocSinh.docx`);
  // ⚠️ FIX (Phiên 26): xem comment tại exportToWord() (exportService.js) - cùng họ hàm bị thiếu return.
  return blob;
}

/**
 * Xuất ĐỒNG THỜI 2 file từ CÙNG 1 dữ liệu đã tạo (không sinh lại), đúng khuôn
 * exportWorksheetBothVersions()/exportBothVersions() - xem chi tiết đầy đủ 2 bản ở comment đầu
 * file (Bước 3/Nhóm E): Bản Học sinh có lời giải Bài mẫu nhưng KHÔNG có đáp án Ngân hàng bài tập
 * (chừa dòng trống + có bảng Tự đánh giá cuối file); Bản GV-PH có phụ lục Thư ngỏ + phụ lục đáp
 * án riêng cuối file (KHÔNG còn in đáp án ngay dưới câu hỏi).
 */
export async function exportOutlineBothVersions({ outline, meta }) {
  const fileBase = slugifyTitle(outline?.tenDeCuong);

  const studentBlob = await buildOutlineDocxBlob({ outline, meta, showAnswers: false });
  saveAs(studentBlob, `${fileBase}-HocSinh.docx`);

  const teacherBlob = await buildOutlineDocxBlob({ outline, meta, showAnswers: true });
  saveAs(teacherBlob, `${fileBase}-GiaoVien-PhuHuynh.docx`);
  // ⚠️ FIX (Phiên 26): xem comment tại exportToWord() (exportService.js) - cùng họ hàm bị thiếu return.
  return { studentBlob, teacherBlob };
}
