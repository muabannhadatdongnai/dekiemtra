import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ShadingType,
  TabStopType,
  TabStopPosition,
  ImageRun,
  convertMillimetersToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { getSectionVisualTheme, getDefaultLayout } from "@/data/worksheetLayoutTemplates";
import { PAGE_A4_MM, PAGE_MARGIN_MM } from "@/data/constants";

/**
 * worksheetExportService.js
 * Xuất Word (.docx) cho "Phiếu bài tập" (Mầm non - Lớp 2).
 *
 * Khác với exportService.js (đề kiểm tra):
 * - KHÔNG cần pipeline LaTeX -> MathML -> OMML: phiếu bài tập chỉ có số nguyên đơn giản,
 *   không có công thức Toán phức tạp cần Equation OOXML.
 * - Word KHÔNG hỗ trợ border-radius (bo góc) như CSS trong WorksheetPreview.jsx, nên mỗi
 *   "khung màu" được mô phỏng bằng NHIỀU Paragraph liên tiếp CÙNG chung {shading, border}
 *   (không dùng Table lồng Table) - Word tự động gộp các paragraph liền kề có border giống
 *   hệt nhau thành 1 khung liền mạch. Cách này an toàn hơn nest Table: nest Table trong docx
 *   dễ bị nền trắng của bảng con đè lên màu nền của bảng cha, đúng loại lỗi mà dự án đã từng
 *   gặp phải với các thành phần Word khác (xem mục 5 PROJECT_SUMMARY.md).
 * - Chỉ paragraph ĐẦU của khung mới có border-top, chỉ paragraph CUỐI mới có border-bottom -
 *   nếu để border-bottom/top ở tất cả sẽ tạo ra các đường kẻ ngang thừa giữa các dòng.
 *
 * ================== GIAI ĐOẠN 1 (chống lặp khuôn) ==================
 * Màu + mascot của từng khối giờ lấy từ getSectionVisualTheme() trong worksheetLayoutTemplates.js
 * - NGUỒN DUY NHẤT dùng chung với WorksheetPreview.jsx (bản xem trước web). Không còn định
 *   nghĩa BOX_THEMES riêng ở đây nữa nên KHÔNG còn rủi ro "sửa 1 nơi quên nơi kia" như trước.
 * - Word không hỗ trợ layout nhiều cột đáng tin cậy cho các khung có border/shading phức tạp
 *   (dễ vỡ khung khi Word tự ngắt cột giữa chừng 1 khối), nên bản Word CHỦ Ý giữ 1 cột dọc dù
 *   bản web có thể hiển thị 2 cột - đổi lại, kiểu viền khung (border style) vẫn biến hoá theo
 *   layout.frameStyle để bản in ra giấy cũng không bị rập khuôn.
 */

const FRAME_BORDER_STYLE = {
  dotted_border_thick_card: BorderStyle.SINGLE,
  soft_rounded_border: BorderStyle.SINGLE,
  notebook_lines: BorderStyle.DASHED,
  adventure_border: BorderStyle.DASHED,
};

function getTheme(layout, section, index) {
  const t = getSectionVisualTheme(layout, section, index);
  // docx cần mã hex KHÔNG có dấu "#"
  return {
    border: t.border.replace("#", ""),
    badge: t.badge.replace("#", ""),
    title: t.title.replace("#", ""),
    bg: t.bg.replace("#", ""),
    mascot: t.mascot,
  };
}

const CIRCLED_DIGITS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

const FONT = "Times New Roman";
const BLANK = "................";      // chỗ trống cho học sinh điền số
const BLANK_CIRCLE = "○";              // chỗ trống cho học sinh điền dấu >, <, =
const WRITING_LINE = "..............................................................";

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// =========================== NỘI DUNG TỪNG DẠNG BÀI (trả về mảng "Paragraph options") ===========================

function buildTinhNhamParagraphs(items, showAnswers) {
  return chunkArray(items, 3).map((row) => ({
    children: row.flatMap((it, idx) => {
      const text = `${it.operandA} ${it.operator} ${it.operandB} = ${showAnswers ? it.answer : BLANK}`;
      const run = new TextRun({ text, font: FONT, size: 24 });
      return idx < row.length - 1 ? [run, new TextRun({ text: "      ", font: FONT, size: 24 })] : [run];
    }),
    spacing: { after: 100 },
  }));
}

function buildDemVaVietSoParagraphs(items, showAnswers) {
  return items.map((it) => ({
    children: [
      new TextRun({ text: Array(it.count).fill(it.icon).join("  ") + "   ", size: 26 }),
      new TextRun({ text: `→  Số: ${showAnswers ? it.answer : BLANK}`, font: FONT, size: 24 }),
    ],
    spacing: { after: 120 },
  }));
}

function buildSoSanhParagraphs(items, showAnswers) {
  return chunkArray(items, 2).map((row) => ({
    children: row.flatMap((it, idx) => {
      const text = `${it.left}   ${showAnswers ? it.answer : BLANK_CIRCLE}   ${it.right}`;
      const run = new TextRun({ text, font: FONT, size: 24 });
      return idx < row.length - 1 ? [run, new TextRun({ text: "      ", font: FONT, size: 24 })] : [run];
    }),
    spacing: { after: 100 },
  }));
}

function buildDaySoParagraphs(items, showAnswers) {
  return items.map((it) => ({
    children: [
      new TextRun({
        text: it.sequence.map((n) => (n === null ? (showAnswers ? it.answer : BLANK) : n)).join(",   "),
        font: FONT,
        size: 24,
      }),
    ],
    spacing: { after: 120 },
  }));
}

/**
 * "Nối phép tính": Word không vẽ được đường nối tay như trên phiếu in - giữ đúng tinh thần
 * bài tập (học sinh tự nối bằng bút khi in ra giấy), dùng tab-stop RIGHT để đẩy cột kết quả
 * xáo trộn ra sát lề phải, mô phỏng bố cục 2 cột trái/phải giống WorksheetPreview.jsx.
 * Bản giáo viên (showAnswers=true) in thẳng luôn cặp đã ghép đúng, không cần đoán.
 */
function buildNoiPhepTinhParagraphs(data, showAnswers) {
  if (showAnswers) {
    return data.pairs.map((p) => ({
      children: [new TextRun({ text: `${p.expr} = ${p.result}`, font: FONT, size: 24 })],
      spacing: { after: 100 },
    }));
  }

  return data.pairs.map((p, i) => ({
    children: [
      new TextRun({ text: `${p.expr}   ●`, font: FONT, size: 24 }),
      new TextRun({ text: "\t", font: FONT, size: 24 }),
      new TextRun({ text: `●   ${data.shuffledResults[i]}`, font: FONT, size: 24 }),
    ],
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    spacing: { after: 100 },
  }));
}

// Ký tự Unicode dạng VIỀN NÉT (không tô đặc) đứng trước tên hình, để bản Word cũng gợi ý
// hình dáng cho bé tô màu, chứ không chỉ có chữ - khớp tên với SHAPES trong worksheetSchemas.js.
const SHAPE_GLYPHS = {
  "Hình tròn": "○",
  "Hình vuông": "□",
  "Hình tam giác": "△",
  "Hình chữ nhật": "▭",
  "Hình ngôi sao": "☆",
  "Hình trái tim": "♡",
};

function buildNhanDienHinhParagraphs(shapes) {
  return [
    {
      children: [
        new TextRun({
          text: shapes.map((s) => `${SHAPE_GLYPHS[s] || "○"} ${s}`).join("      "),
          font: FONT,
          size: 28,
        }),
      ],
      spacing: { after: 100 },
    },
  ];
}

function buildGiaiToanParagraphs(items, showAnswers) {
  return items.flatMap((it) => {
    const paras = [
      {
        children: [new TextRun({ text: it.content, font: FONT, size: 24 })],
        spacing: { after: 60 },
      },
      {
        children: [new TextRun({ text: WRITING_LINE, font: FONT, size: 24 })],
        spacing: { after: showAnswers && it.answer ? 60 : 120 },
      },
    ];
    if (showAnswers && it.answer) {
      paras.push({
        children: [new TextRun({ text: `Đáp số: ${it.answer}`, bold: true, italics: true, font: FONT, size: 24 })],
        spacing: { after: 120 },
      });
    }
    return paras;
  });
}

// =========================== GHÉP 1 "KHUNG MÀU" (header + nội dung) ===========================

function buildSectionContentOptions(section, showAnswers) {
  switch (section.type) {
    case "tinh_nham":
      return buildTinhNhamParagraphs(section.items, showAnswers);
    case "dem_va_viet_so":
      return buildDemVaVietSoParagraphs(section.items, showAnswers);
    case "so_sanh":
      return buildSoSanhParagraphs(section.items, showAnswers);
    case "day_so":
      return buildDaySoParagraphs(section.items, showAnswers);
    case "noi_phep_tinh":
      return buildNoiPhepTinhParagraphs(section.data, showAnswers);
    case "nhan_dien_hinh":
      return buildNhanDienHinhParagraphs(section.shapes);
    case "giai_toan":
      return buildGiaiToanParagraphs(section.items, showAnswers);
    default:
      return [];
  }
}

/**
 * Gộp mảng "Paragraph options" thành Paragraph thật, chỉ gắn border-top cho cái ĐẦU và
 * border-bottom cho cái CUỐI (xem giải thích ở đầu file) - toàn bộ đều có shading + border
 * trái/phải giống nhau để Word render liền thành 1 khung.
 */
function applyBoxStyling(rawOptions, colors, frameStyle) {
  const borderType = FRAME_BORDER_STYLE[frameStyle] || BorderStyle.SINGLE;
  const shading = { fill: colors.bg, type: ShadingType.CLEAR, color: "auto" };
  const side = { style: borderType, size: 6, color: colors.border, space: 6 };

  return rawOptions.map((opts, i) => {
    const border = { left: side, right: side };
    if (i === 0) border.top = side;
    if (i === rawOptions.length - 1) border.bottom = side;
    return new Paragraph({ ...opts, shading, border });
  });
}

function buildSectionParagraphs(section, index, showAnswers, layout) {
  const colors = getTheme(layout, section, index);
  const badge = CIRCLED_DIGITS[index] ?? `(${index + 1})`;

  const headerOptions = {
    children: [
      new TextRun({ text: `${badge} ${colors.mascot}  `, bold: true, color: colors.badge, font: FONT, size: 26 }),
      new TextRun({ text: section.title, bold: true, color: colors.title, font: FONT, size: 26 }),
    ],
    spacing: { before: 80, after: 100 },
  };

  const contentOptions = buildSectionContentOptions(section, showAnswers);
  const boxed = applyBoxStyling([headerOptions, ...contentOptions], colors, layout?.frameStyle);

  // Khoảng trống SAU khung, không border - tách các khung với nhau
  const spacer = new Paragraph({ text: "", spacing: { after: 200 } });

  return [...boxed, spacer];
}

// =========================== DỰNG TÀI LIỆU HOÀN CHỈNH ===========================

function buildHeaderParagraphs(title) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title || "BÀI TẬP TOÁN", bold: true, size: 32, font: FONT })],
      spacing: { after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Họ và tên: ..................................................................   Lớp: ..............",
          font: FONT,
          size: 24,
        }),
      ],
      spacing: { after: 240 },
    }),
  ];
}

/**
 * ================== GIAI ĐOẠN 4 ==================
 * Footer "Tự đánh giá / Nhận xét của thầy cô / Ghi nhớ" - bản Word đơn giản hơn bản web (không
 * dàn 3 cột cạnh nhau vì Word không có CSS grid đáng tin cậy cho khối có border như đã giải
 * thích ở đầu file), thay bằng 3 đoạn nối tiếp có viền riêng, vẫn đủ chỗ để học sinh tự đánh
 * dấu và giáo viên viết tay nhận xét khi in ra giấy.
 */
function buildFooterParagraphs() {
  const side = { style: BorderStyle.DASHED, size: 4, color: "94A3B8", space: 6 };
  const border = { top: side, bottom: side, left: side, right: side };

  return [
    new Paragraph({ text: "", spacing: { before: 200 } }),
    new Paragraph({
      border,
      children: [new TextRun({ text: "⭐ TỰ ĐÁNH GIÁ:  Học chăm ⭐⭐⭐   Làm tốt ⭐⭐⭐   Cố gắng hơn ⭐⭐⭐", font: FONT, size: 21 })],
      spacing: { before: 80, after: 80 },
    }),
    new Paragraph({
      border,
      children: [new TextRun({ text: "💬 NHẬN XÉT CỦA THẦY/CÔ: .................................................................................", font: FONT, size: 21 })],
      spacing: { before: 80, after: 80 },
    }),
    new Paragraph({
      border,
      children: [new TextRun({ text: "📌 GHI NHỚ: Ôn lại kiến thức ✔️  Làm bài cẩn thận ✔️  Kiểm tra kết quả ✔️", font: FONT, size: 21 })],
      spacing: { before: 80, after: 200 },
    }),
  ];
}

/** data:URL (base64) -> Uint8Array, KHÔNG dùng Buffer (API Node.js) vì file này chạy ở browser -
 * atob() có sẵn ở cả 2 môi trường (browser native, Node.js >= 16). */
function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * QR "chấm nhanh" cho đáp số bài giải toán - CHỈ chèn vào bản GIÁO VIÊN (showAnswers=true),
 * không chèn vào bản học sinh (tránh lộ đáp số ngay trên phiếu học sinh đang làm bài).
 */
async function buildAnswerQrParagraphs(answerKeyText) {
  if (!answerKeyText) return [];
  try {
    const QRCode = (await import("qrcode")).default;
    const dataUrl = await QRCode.toDataURL(answerKeyText, { width: 96, margin: 1 });
    const bytes = dataUrlToUint8Array(dataUrl);
    return [
      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new ImageRun({ type: "png", data: bytes, transformation: { width: 96, height: 96 } }),
        ],
      }),
      new Paragraph({
        children: [new TextRun({ text: "📱 Mã QR đáp số bài giải toán (chỉ có ở bản Giáo viên)", italics: true, size: 18, font: FONT })],
        spacing: { after: 160 },
      }),
    ];
  } catch (err) {
    console.warn("[worksheetExportService] Không sinh được QR đáp số, bỏ qua:", err.message);
    return [];
  }
}

/** Dựng Blob .docx - hàm lõi dùng chung, KHÔNG tự tải file (không gọi saveAs), giống quy ước exportService.js. */
async function buildWorksheetDocxBlob({ worksheet, meta = {}, showAnswers = false }) {
  const layout = worksheet?.layout || getDefaultLayout();
  const headerParagraphs = buildHeaderParagraphs(meta.title);
  const sectionParagraphs = (worksheet?.sections || []).flatMap((section, i) =>
    buildSectionParagraphs(section, i, showAnswers, layout)
  );
  const qrParagraphs = showAnswers ? await buildAnswerQrParagraphs(worksheet?.answerKeyText) : [];
  const footerParagraphs = buildFooterParagraphs();

  // ================== GIAI ĐOẠN 1 (sửa lỗi layout/in ấn) ==================
  // Cùng bug với exportService.js: properties:{} rỗng -> docx.js dùng mặc định khổ Letter
  // (8.5x11 inch), KHÔNG PHẢI A4. Đây là nguyên nhân THẬT của "margin không full khổ A4" ở
  // phiếu bài tập. Dùng chung PAGE_A4_MM/PAGE_MARGIN_MM từ constants.js để khớp với đề kiểm
  // tra và giáo án - 3 loại tài liệu xuất ra đều cùng 1 khổ giấy, không lệch nhau nữa.
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

  const doc = new Document({
    sections: [
      {
        properties: pageProperties,
        children: [...headerParagraphs, ...sectionParagraphs, ...qrParagraphs, ...footerParagraphs],
      },
    ],
  });

  // ⚠️ Giống exportService.js: chạy phía browser nên PHẢI dùng Packer.toBlob(), KHÔNG dùng
  // toBuffer() (API Node.js) - dùng nhầm sẽ tạo file .docx hỏng, Word không mở được.
  return Packer.toBlob(doc);
}

function slugifyTitle(title) {
  return (title || "Phieu-bai-tap").trim().replace(/\s+/g, "-");
}

/** Xuất 1 file .docx duy nhất - bản "sạch" cho học sinh (mặc định, dùng khi bấm nút xuất Word thường). */
export async function exportWorksheetToWord({ worksheet, meta }) {
  const blob = await buildWorksheetDocxBlob({ worksheet, meta, showAnswers: false });
  saveAs(blob, `${slugifyTitle(meta?.title)}.docx`);
}

/**
 * Xuất ĐỒNG THỜI 2 file từ CÙNG 1 dữ liệu đã tạo (không sinh lại), giống Giai đoạn 3 của
 * đề kiểm tra (exportBothVersions trong exportService.js):
 *   - Bản học sinh: các ô trống (BLANK/BLANK_CIRCLE/WRITING_LINE) để điền tay.
 *   - Bản giáo viên: điền sẵn đáp án (riêng "giải toán có lời văn" chỉ có đáp số nếu giáo
 *     viên đã bật "Kèm đáp số" lúc tạo phiếu - nếu không, dòng đáp số được bỏ qua thay vì
 *     hiện "undefined").
 */
export async function exportWorksheetBothVersions({ worksheet, meta }) {
  const fileBase = slugifyTitle(meta?.title);

  const studentBlob = await buildWorksheetDocxBlob({ worksheet, meta, showAnswers: false });
  saveAs(studentBlob, `${fileBase}-HocSinh.docx`);

  const teacherBlob = await buildWorksheetDocxBlob({ worksheet, meta, showAnswers: true });
  saveAs(teacherBlob, `${fileBase}-GiaoVien.docx`);
}
