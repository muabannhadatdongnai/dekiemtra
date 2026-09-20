import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  TableLayoutType,
  convertMillimetersToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { PAGE_A4_LANDSCAPE_MM, PAGE_LANDSCAPE_MARGIN_MM } from "@/data/constants";
import { getSubjectLabel } from "@/data/config";

/**
 * khgdExportService.js
 * Xuất Word (.docx) cho tab "Khung KHGD" (Phụ lục III, CV 5512/BGDĐT-GDTrH) - ĐỘC LẬP HOÀN TOÀN
 * với các module export khác (đúng nguyên tắc "Isolation over DRY" của dự án - xem
 * foreignLanguageExportRegistry.js), dù cùng dùng thư viện "docx".
 *
 * ⚠️ DÙNG CHUNG 1 BỘ CHO MỌI MÔN HỌC (khác foreignLanguageExportRegistry.js vốn tách theo ngôn
 * ngữ) - đã thống nhất với người dùng: bố cục bảng Phụ lục III GIỐNG HỆT nhau bất kể môn học
 * (chuẩn theo CV 5512), chỉ nội dung (do khgdSubjectDefaults.js + AI cung cấp) khác nhau theo
 * môn. Nếu sau này có môn cần bố cục khác hẳn (VD thêm cột riêng), tách file export riêng cho
 * đúng môn đó - KHÔNG rẽ nhánh if/else môn học trong CÙNG 1 file này.
 *
 * Khổ giấy: A4 NGANG (297x210mm, xem PAGE_A4_LANDSCAPE_MM trong constants.js) - nhiều cột hơn
 * khổ dọc thông thường, đúng khổ giấy văn bản mẫu Bộ GDĐT gửi kèm.
 */

const FONT = "Times New Roman";
// ⚠️ Cỡ chữ 14pt (Phiên 49, Hoan chốt: đúng quy định của Bộ GD&ĐT) cho TOÀN BỘ văn bản: tiêu đề, bảng,
// chữ ký. Đơn vị `size` của docx là NỬA-POINT → 14pt = 28. KHÔNG hạ cỡ chữ để "cho vừa trang".
const FONT_SIZE = 28;
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: "444444" };
const ALL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };

const pageProperties = {
  page: {
    size: {
      width: convertMillimetersToTwip(PAGE_A4_LANDSCAPE_MM.width),
      height: convertMillimetersToTwip(PAGE_A4_LANDSCAPE_MM.height),
    },
    margin: {
      top: convertMillimetersToTwip(PAGE_LANDSCAPE_MARGIN_MM.top),
      bottom: convertMillimetersToTwip(PAGE_LANDSCAPE_MARGIN_MM.bottom),
      left: convertMillimetersToTwip(PAGE_LANDSCAPE_MARGIN_MM.left),
      right: convertMillimetersToTwip(PAGE_LANDSCAPE_MARGIN_MM.right),
    },
  },
};

// ⚠️ Độ rộng bảng tính bằng TWIP CỐ ĐỊNH (Phiên 49) thay vì % - LibreOffice bỏ qua độ rộng % của ô khi
// bảng không khai báo lưới cột (mọi cột thành đều nhau → cột SWD/NLS bị bóp hẹp, chữ 14pt rớt từng
// chữ cái), còn Word có thể co giãn theo nội dung. Khai báo `columnWidths` + layout FIXED cho ra CÙNG
// 1 bố cục ở cả Word lẫn LibreOffice. Các hàm cell()/headerCell() vẫn nhận PHẦN TRĂM cho dễ chỉnh.
const TABLE_WIDTH_TWIP = convertMillimetersToTwip(
  PAGE_A4_LANDSCAPE_MM.width - PAGE_LANDSCAPE_MARGIN_MM.left - PAGE_LANDSCAPE_MARGIN_MM.right
);
const pctToTwip = (pct) => Math.round((TABLE_WIDTH_TWIP * pct) / 100);

/** Bảng độ rộng cố định theo danh sách % cột (thứ tự trái → phải, chỉ gồm cột đang hiển thị). */
function fixedTable(rows, columnPercents) {
  return new Table({
    width: { size: TABLE_WIDTH_TWIP, type: WidthType.DXA },
    columnWidths: columnPercents.map(pctToTwip),
    layout: TableLayoutType.FIXED,
    rows,
  });
}

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: FONT_SIZE, ...opts });
}

function multilineTextRuns(text, opts = {}) {
  const lines = String(text ?? "").split("\n");
  return lines.flatMap((line, i) => (i === 0 ? [textRun(line, opts)] : [textRun(line, { ...opts, break: 1 })]));
}

/** 1 ô bảng, có thể truyền sẵn danh sách Paragraph (`children`) thay vì 1 đoạn text đơn. */
function cell(content, widthPercent, opts = {}) {
  const paragraphs = opts.children
    ? opts.children
    : [
        new Paragraph({
          alignment: opts.alignment,
          children: multilineTextRuns(content, { bold: opts.bold }),
        }),
      ];
  return new TableCell({
    width: { size: pctToTwip(widthPercent), type: WidthType.DXA },
    borders: ALL_BORDERS,
    verticalAlign: VerticalAlign.TOP,
    columnSpan: opts.columnSpan,
    shading: opts.shading,
    children: paragraphs,
  });
}

function headerCell(text, widthPercent) {
  return cell(text, widthPercent, { bold: true, alignment: AlignmentType.CENTER, shading: { fill: "E5E7EB" } });
}

/** Cột "SWD"/"NLS" hiển thị dạng gạch đầu dòng (khớp bản mẫu Bộ GDĐT: "SWD: – ... – ..."). */
function bulletCell(label, items, widthPercent) {
  const lines = Array.isArray(items) ? items.filter(Boolean) : items ? [items] : [];
  if (lines.length === 0) {
    return cell("", widthPercent);
  }
  const paragraphs = [
    new Paragraph({ children: [textRun(`${label}:`, { bold: true })], spacing: { after: 40 } }),
    ...lines.map((line) => new Paragraph({ bullet: { level: 0 }, children: multilineTextRuns(`${line}`) })),
  ];
  return cell(null, widthPercent, { children: paragraphs });
}

/**
 * Tính % chiều rộng cột "SWD"/"NLS" tuỳ theo 2 công tắc bật/tắt - phần trăm CÒN LẠI (sau 6 cột cố
 * định: STT/Bài học/Số tiết/Thời điểm/Thiết bị/Địa điểm = 55%) được chia cho SWD/NLS nếu bật,
 * hoặc dồn hết về cột "Bài học" nếu cả 2 đều tắt (không để bảng có khoảng trắng thừa vô nghĩa).
 */
function computeColumnWidths(enableSwd, enableNls) {
  // Phiên 49: chữ 14pt to hơn 10pt cũ nên cột STT/Số tiết/Thời điểm được nới ra (STT 2 chữ số như "12"
  // không được rớt dòng), bù lại bớt chút ở cột SWD/NLS.
  const base = { stt: 5, baiHoc: 17, soTiet: 6, thoiDiem: 8, thietBi: 11, diaDiem: 8 }; // = 55
  const remaining = 100 - Object.values(base).reduce((s, v) => s + v, 0); // = 45

  if (enableSwd && enableNls) return { ...base, swd: 27, nls: remaining - 27 };
  if (enableSwd) return { ...base, swd: remaining, nls: 0 };
  if (enableNls) return { ...base, swd: 0, nls: remaining };
  return { ...base, baiHoc: base.baiHoc + remaining, swd: 0, nls: 0 };
}

function buildHeaderParagraphs(meta) {
  const subtitle = [
    meta?.truong ? `TRƯỜNG: ${meta.truong.toUpperCase()}` : null,
    meta?.to ? `TỔ: ${meta.to.toUpperCase()}` : null,
  ].filter(Boolean);

  return [
    ...subtitle.map(
      (line) =>
        new Paragraph({ children: [textRun(line, { bold: true })], spacing: { after: 20 } })
    ),
    meta?.giaoVien &&
      new Paragraph({
        children: [textRun(`Họ và tên giáo viên: ${meta.giaoVien}`)],
        spacing: { after: 120 },
      }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun("KẾ HOẠCH GIÁO DỤC CỦA GIÁO VIÊN", { bold: true })],
      spacing: { after: 40 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        textRun(
          `MÔN HỌC/HOẠT ĐỘNG GIÁO DỤC ${(getSubjectLabel(meta?.subject) || "").toUpperCase()}, LỚP ${
            meta?.grade || ""
          }${meta?.namHoc ? ` (Năm học ${meta.namHoc})` : ""}`,
          { bold: true }
        ),
      ],
      spacing: { after: 200 },
    }),
  ].filter(Boolean);
}

function buildLessonTable(lessons, widths) {
  // ⚠️ KHÔNG đặt `tableHeader: true` (Phiên 48b, Hoan chốt): Word sẽ lặp lại hàng tiêu đề ở đầu mỗi
  // trang tiếp theo - giáo viên phản hồi bảng "nhảy về phần head của trang 1" thay vì nối tiếp.
  // Áp dụng cho CẢ 2 bảng của tab này (bài học + kiểm tra định kỳ) và bản Tiểu học.
  const headerRow = new TableRow({
    children: [
      headerCell("STT", widths.stt),
      headerCell("Bài học", widths.baiHoc),
      headerCell("Số tiết", widths.soTiet),
      headerCell("Thời điểm", widths.thoiDiem),
      headerCell("Thiết bị dạy học", widths.thietBi),
      headerCell("Địa điểm dạy học", widths.diaDiem),
      ...(widths.swd ? [headerCell("Nội dung lồng ghép (SWD)", widths.swd)] : []),
      ...(widths.nls ? [headerCell("Biểu hiện Năng lực số", widths.nls)] : []),
    ],
  });

  const rows = lessons.map(
    (lesson, i) =>
      new TableRow({
        children: [
          cell(String(i + 1), widths.stt, { alignment: AlignmentType.CENTER }),
          cell(lesson.tenBai, widths.baiHoc, { bold: true }),
          cell(lesson.soTiet != null ? String(lesson.soTiet) : "", widths.soTiet, {
            alignment: AlignmentType.CENTER,
          }),
          cell(lesson.tuan || "", widths.thoiDiem, { alignment: AlignmentType.CENTER }),
          cell(lesson.thietBi || "", widths.thietBi),
          cell(lesson.diaDiem || "", widths.diaDiem),
          ...(widths.swd ? [bulletCell("SWD", lesson.swd, widths.swd)] : []),
          ...(widths.nls ? [cell(lesson.nls || "", widths.nls)] : []),
        ],
      })
  );

  const columnPercents = [
    widths.stt,
    widths.baiHoc,
    widths.soTiet,
    widths.thoiDiem,
    widths.thietBi,
    widths.diaDiem,
    ...(widths.swd ? [widths.swd] : []),
    ...(widths.nls ? [widths.nls] : []),
  ];
  return fixedTable([headerRow, ...rows], columnPercents);
}

function buildKiemTraTable(kiemTraDinhKy) {
  const headerRow = new TableRow({
    children: [
      headerCell("Bài kiểm tra, đánh giá", 20),
      headerCell("Thời gian", 12),
      headerCell("Thời điểm", 16),
      headerCell("Yêu cầu cần đạt", 34),
      headerCell("Hình thức", 18),
    ],
  });

  const rows = (kiemTraDinhKy || []).map(
    (mốc) =>
      new TableRow({
        children: [
          cell(mốc.ten || "", 20, { bold: true }),
          cell(mốc.thoiGian || "", 12, { alignment: AlignmentType.CENTER }),
          cell(mốc.thoiDiem || "", 16),
          cell(mốc.yeuCauCanDat || "", 34),
          cell(mốc.hinhThuc || "", 18),
        ],
      })
  );

  return fixedTable([headerRow, ...rows], [20, 12, 16, 34, 18]);
}

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

/**
 * Khối ký tên "TỔ TRƯỞNG" / "GIÁO VIÊN" đặt CẠNH NHAU - dùng Table 2 cột KHÔNG VIỀN thay vì
 * tabStops (docx@9 yêu cầu enum TabStopType cho `type`, dễ sai lệch/không tương thích giữa các
 * phiên bản - Table không viền là cách AN TOÀN đã dùng sẵn ở exportService.js:buildOptionsTable()).
 */
function buildSignatureParagraphs(meta) {
  const col = (paragraphs) =>
    new TableCell({
      width: { size: 50, type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      children: paragraphs,
    });

  return [
    new Paragraph({ spacing: { before: 300 } }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [textRun("......................, ngày ..... tháng ..... năm .....")],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      rows: [
        new TableRow({
          children: [
            col([
              new Paragraph({ alignment: AlignmentType.CENTER, children: [textRun("TỔ TRƯỞNG", { bold: true })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [textRun("(Ký và ghi rõ họ tên)")] }),
            ]),
            col([
              new Paragraph({ alignment: AlignmentType.CENTER, children: [textRun("GIÁO VIÊN", { bold: true })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [textRun("(Ký và ghi rõ họ tên)")] }),
            ]),
          ],
        }),
        new TableRow({
          children: [
            col([new Paragraph({ spacing: { before: 500 } })]),
            col([
              new Paragraph({ spacing: { before: 500 } }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [textRun(meta?.giaoVien || "")] }),
            ]),
          ],
        }),
      ],
    }),
  ];
}

export function buildKhgdDocument({ lessons, kiemTraDinhKy, meta }) {
  const widths = computeColumnWidths(!!meta?.enableSwd, !!meta?.enableNls);

  return new Document({
    // Mặc định toàn văn bản 14pt/Times New Roman: phủ luôn các đoạn KHÔNG có TextRun riêng (đoạn trống
    // giữ chỗ, ô bảng rỗng, ký hiệu gạch đầu dòng) để không rơi về cỡ mặc định nhỏ hơn của Word.
    styles: { default: { document: { run: { font: FONT, size: FONT_SIZE } } } },
    sections: [
      {
        properties: pageProperties,
        children: [
          ...buildHeaderParagraphs(meta),
          new Paragraph({
            children: [textRun("II. Kế hoạch dạy học", { bold: true })],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [textRun("1. Phân phối chương trình", { bold: true, italics: true })],
            spacing: { after: 80 },
          }),
          buildLessonTable(lessons || [], widths),
          new Paragraph({
            children: [textRun("2. Kiểm tra, đánh giá định kỳ", { bold: true, italics: true })],
            spacing: { before: 200, after: 80 },
          }),
          buildKiemTraTable(kiemTraDinhKy),
          ...buildSignatureParagraphs(meta),
        ],
      },
    ],
  });
}

export async function exportKhgdToWord({ lessons, kiemTraDinhKy, meta }) {
  const doc = buildKhgdDocument({ lessons, kiemTraDinhKy, meta });
  const blob = await Packer.toBlob(doc);
  const subjectLabel = getSubjectLabel(meta?.subject) || "";
  const fileName = `Khung-KHGD_${subjectLabel}_Lop-${meta?.grade || ""}`.replace(/\s+/g, "-");
  saveAs(blob, `${fileName}.docx`);
}
