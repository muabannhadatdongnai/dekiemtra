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
} from "docx";
import { saveAs } from "file-saver";

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
 * Màu khung PHẢI đồng bộ với BOX_COLORS trong WorksheetPreview.jsx (xem trước trên web) -
 * nếu đổi màu ở 1 nơi, nhớ đổi cả nơi kia.
 */

// Đồng bộ với BOX_COLORS trong src/components/WorksheetPreview.jsx (bỏ dấu "#" vì docx cần hex thô)
const BOX_COLORS = [
  { border: "7DBEE8", badge: "378ADD", title: "0C447C", bg: "EFF7FD" },
  { border: "F2AE8E", badge: "D85A30", title: "712B13", bg: "FDF3EE" },
  { border: "B9D98A", badge: "5F9A2E", title: "33520F", bg: "F4F9EC" },
  { border: "E3AEDD", badge: "B24CA8", title: "5C1E56", bg: "FBF1FA" },
  { border: "F5CD79", badge: "D99A1B", title: "6B4C09", bg: "FDF7E9" },
];

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

function buildNhanDienHinhParagraphs(shapes) {
  return [
    {
      children: [new TextRun({ text: shapes.join("      "), font: FONT, size: 24 })],
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
function applyBoxStyling(rawOptions, colors) {
  const shading = { fill: colors.bg, type: ShadingType.CLEAR, color: "auto" };
  const side = { style: BorderStyle.SINGLE, size: 6, color: colors.border, space: 6 };

  return rawOptions.map((opts, i) => {
    const border = { left: side, right: side };
    if (i === 0) border.top = side;
    if (i === rawOptions.length - 1) border.bottom = side;
    return new Paragraph({ ...opts, shading, border });
  });
}

function buildSectionParagraphs(section, index, showAnswers) {
  const colors = BOX_COLORS[index % BOX_COLORS.length];
  const badge = CIRCLED_DIGITS[index] ?? `(${index + 1})`;

  const headerOptions = {
    children: [
      new TextRun({ text: `${badge}  `, bold: true, color: colors.badge, font: FONT, size: 26 }),
      new TextRun({ text: section.title, bold: true, color: colors.title, font: FONT, size: 26 }),
    ],
    spacing: { before: 80, after: 100 },
  };

  const contentOptions = buildSectionContentOptions(section, showAnswers);
  const boxed = applyBoxStyling([headerOptions, ...contentOptions], colors);

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

/** Dựng Blob .docx - hàm lõi dùng chung, KHÔNG tự tải file (không gọi saveAs), giống quy ước exportService.js. */
async function buildWorksheetDocxBlob({ worksheet, meta = {}, showAnswers = false }) {
  const headerParagraphs = buildHeaderParagraphs(meta.title);
  const sectionParagraphs = (worksheet?.sections || []).flatMap((section, i) =>
    buildSectionParagraphs(section, i, showAnswers)
  );

  const doc = new Document({
    sections: [{ properties: {}, children: [...headerParagraphs, ...sectionParagraphs] }],
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
