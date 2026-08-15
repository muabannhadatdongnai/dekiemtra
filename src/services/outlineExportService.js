import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ShadingType,
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
 * 2 LUỒNG TẢI (đúng yêu cầu NEXT_STEPS.md Bước 2):
 *  - Bản "Học sinh" (showAnswers=false): CÓ đề bài Trụ cột 2/3, KHÔNG có lời giải/đáp án (chừa
 *    dòng trống để tự làm) - vẫn giữ nguyên "Kiến thức cốt lõi" (Trụ cột 1) vì đó là lý thuyết
 *    tham khảo, không phải "đáp án" cần giấu.
 *  - Bản "GV-PH" (showAnswers=true): ĐẦY ĐỦ lời giải/đáp án + PHỤ LỤC "Thư ngỏ gửi Phụ huynh" ở
 *    ĐẦU file (Giáo viên in kèm bản này để gửi kèm cho phụ huynh, hoặc dùng làm bản chấm/đối
 *    chiếu) - bản Học sinh KHÔNG có phụ lục này (tránh lộ đáp án kèm thư ngỏ khi đưa cho học sinh).
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

/** Trụ cột 2 - Dạng bài + bài mẫu: "baiMauLoiGiai" CHỈ hiện khi showAnswers=true. */
function buildDangBaiParagraphs(items, showAnswers) {
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
        border: { left: border, right: border, bottom: showAnswers ? undefined : border },
        shading: { type: ShadingType.CLEAR, fill: "EEF2FF" },
        children: [
          new TextRun({ text: "Bài mẫu: ", bold: true, size: 22, font: FONT }),
          new TextRun({ text: it.baiMauDe || "", size: 22, font: FONT }),
        ],
        spacing: { after: showAnswers ? 20 : 120 },
      })
    );
    if (showAnswers) {
      paragraphs.push(
        new Paragraph({
          border: { left: border, right: border, bottom: border },
          shading: { type: ShadingType.CLEAR, fill: "EEF2FF" },
          children: [
            new TextRun({ text: "Lời giải: ", bold: true, size: 22, font: FONT }),
            new TextRun({ text: it.baiMauLoiGiai || "", size: 22, font: FONT }),
          ],
          spacing: { after: 120 },
        })
      );
    }
  });
  return paragraphs;
}

/**
 * Trụ cột 3 - Ngân hàng bài tập 3 mức: mỗi bài đánh số trong đúng mức của nó. "dapAn" CHỈ hiện
 * khi showAnswers=true (bản Học sinh chừa dòng trống để tự làm bài, giống mạch WorksheetExportService).
 */
function buildNganHangBaiTapParagraphs(nganHangBaiTap, showAnswers) {
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

    items.forEach((ex, i) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `${i + 1}. ${ex.de || ""}`, size: 22, font: FONT })],
          spacing: { after: 20 },
        })
      );
      paragraphs.push(
        new Paragraph({
          children: showAnswers
            ? [new TextRun({ text: `   Đáp án: ${ex.dapAn || ""}`, size: 20, font: FONT, color: "166534" })]
            : [new TextRun({ text: "   Bài làm: .......................................................................", size: 20, font: FONT, color: "94A3B8" })],
          spacing: { after: 100 },
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

/** Dựng Blob .docx - hàm lõi dùng chung, KHÔNG tự tải file, cùng quy ước
 * buildWorksheetDocxBlob()/buildLessonPlanDocxSections(). */
export async function buildOutlineDocxBlob({ outline, meta = {}, showAnswers = false }) {
  const headerParagraphs = buildHeaderParagraphs(outline, meta);
  const parentLetterParagraphs = showAnswers
    ? buildParentFriendlyOutlineParagraphs(outline?.thuNgoPhuHuynh, meta)
    : [];
  const kienThucParagraphs = buildKienThucCotLoiParagraphs(outline?.kienThucCotLoi);
  const dangBaiParagraphs = buildDangBaiParagraphs(outline?.dangBai, showAnswers);
  const nganHangParagraphs = buildNganHangBaiTapParagraphs(outline?.nganHangBaiTap, showAnswers);

  const doc = new Document({
    sections: [
      {
        properties: pageProperties,
        children: [
          ...headerParagraphs,
          ...parentLetterParagraphs,
          ...kienThucParagraphs,
          ...dangBaiParagraphs,
          ...nganHangParagraphs,
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
}

/**
 * Xuất ĐỒNG THỜI 2 file từ CÙNG 1 dữ liệu đã tạo (không sinh lại), đúng khuôn
 * exportWorksheetBothVersions()/exportBothVersions():
 *   - Bản Học sinh: không lời giải/đáp án, chừa dòng trống để tự làm.
 *   - Bản GV-PH: đầy đủ lời giải/đáp án + phụ lục Thư ngỏ Phụ huynh ở đầu file.
 */
export async function exportOutlineBothVersions({ outline, meta }) {
  const fileBase = slugifyTitle(outline?.tenDeCuong);

  const studentBlob = await buildOutlineDocxBlob({ outline, meta, showAnswers: false });
  saveAs(studentBlob, `${fileBase}-HocSinh.docx`);

  const teacherBlob = await buildOutlineDocxBlob({ outline, meta, showAnswers: true });
  saveAs(teacherBlob, `${fileBase}-GiaoVien-PhuHuynh.docx`);
}
