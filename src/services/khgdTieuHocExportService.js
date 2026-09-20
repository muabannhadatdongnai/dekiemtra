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
import { computeMergeInfo, computeTietMerge } from "./khgdTieuHocMergeUtils";

/**
 * khgdTieuHocExportService.js
 * Xuất Word (.docx) cho tab "Khung KHGD - Tiểu học" (Phụ lục 2, Công văn 2345/2021/BGDĐT-GDTH) -
 * file HOÀN TOÀN RIÊNG với khgdExportService.js (THCS/THPT, Phụ lục III/CV5512) - 2 mẫu văn bản
 * khác nhau theo quy định, KHÔNG dùng chung export builder dù cùng "họ" tab Khung KHGD.
 *
 * Cấu trúc bảng đối chiếu ĐÚNG file mẫu thật "KHDH CÁC MÔN LỚP 2-KNTT" (Phiên 47): Tuần/Chủ đề
 * (Mạch nội dung)/Tên bài/Tiết học (Thời lượng)/Nội dung điều chỉnh cần thiết (nếu có)/Ghi chú
 * (tiết theo PPCT, chạy suốt năm) - KHÔNG có Thiết bị dạy học/Địa điểm/SWD/NLS riêng (đã hỏi lại
 * người dùng, chốt giữ đúng mẫu thật). KHÔNG có bảng "Kiểm tra định kỳ" (chưa có mẫu thật cho
 * phần này ở Tiểu học).
 *
 * ⚠️ "Ghi chú" LUÔN là cột CUỐI CÙNG (sửa Phiên 48b theo phản hồi test file Word thật + ảnh mẫu
 * của giáo viên) - trước đó nằm trước "Nội dung điều chỉnh". Field nội bộ vẫn tên `tietPPCT`.
 *
 * ⚠️ Cột "Tuần" và "Chủ đề" được GỘP Ô (rowSpan) cho các dòng liên tiếp cùng giá trị - đúng cách
 * trình bày bản mẫu thật (bổ sung Phiên 48 sau phản hồi test thật của giáo viên, xem
 * khgdTieuHocMergeUtils.js) - CHỈ gộp khi giá trị không rỗng, tránh gộp nhầm các dòng còn trống
 * thành 1 ô lớn gây hiểu lầm. Phiên 48b: cột "Tiết học/Thời lượng" cũng gộp theo `nhomTiet` (VD
 * Đọc Tiết 1 + Tiết 2 → 1 ô "2 tiết") và luôn ghi dạng "N tiết" như bản mẫu.
 */

const FONT = "Times New Roman";
// ⚠️ Cỡ chữ 14pt (Phiên 49, Hoan chốt: đúng quy định của Bộ GD&ĐT) cho TOÀN BỘ văn bản. `size` của docx
// tính bằng NỬA-POINT → 14pt = 28. KHÔNG hạ cỡ chữ để "cho vừa trang".
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

// ⚠️ Độ rộng bảng tính bằng TWIP CỐ ĐỊNH (Phiên 49) - xem giải thích ở khgdExportService.js: LibreOffice
// bỏ qua độ rộng % của ô khi không có lưới cột (mọi cột đều nhau), layout FIXED + columnWidths cho ra
// cùng 1 bố cục ở Word và LibreOffice. cell()/headerCell() vẫn nhận PHẦN TRĂM.
const TABLE_WIDTH_TWIP = convertMillimetersToTwip(
  PAGE_A4_LANDSCAPE_MM.width - PAGE_LANDSCAPE_MARGIN_MM.left - PAGE_LANDSCAPE_MARGIN_MM.right
);
const pctToTwip = (pct) => Math.round((TABLE_WIDTH_TWIP * pct) / 100);

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: FONT_SIZE, ...opts });
}

function cell(content, widthPercent, opts = {}) {
  return new TableCell({
    width: { size: pctToTwip(widthPercent), type: WidthType.DXA },
    borders: ALL_BORDERS,
    verticalAlign: VerticalAlign.TOP,
    shading: opts.shading,
    rowSpan: opts.rowSpan,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: [
      new Paragraph({ alignment: opts.alignment, children: [textRun(content, { bold: opts.bold })] }),
    ],
  });
}

function headerCell(text, widthPercent) {
  return cell(text, widthPercent, { bold: true, alignment: AlignmentType.CENTER, shading: { fill: "E5E7EB" } });
}

// Phiên 49: chữ 14pt to hơn 10pt cũ nên nới cột Tuần/Tiết học/Ghi chú (số 2-3 chữ số như "Tuần 12", "350"
// không được rớt dòng), bù lại bớt ở cột Tên bài (tổng vẫn = 100).
const WIDTHS = { tuan: 8, chuDe: 13, tenBai: 33, soTiet: 10, dieuChinh: 26, tietPPCT: 10 };

function buildLessonTable(lessons) {
  // ⚠️ KHÔNG đặt `tableHeader: true` (Phiên 48b): Word sẽ LẶP LẠI hàng tiêu đề ở đầu mỗi trang
  // tiếp theo - giáo viên phản hồi bảng nhảy về "phần head của trang 1" thay vì nối tiếp phần
  // dòng của trang trước (bản mẫu giáo viên gửi cũng không lặp tiêu đề). Chỉ hàng tiêu đề đầu
  // tiên xuất hiện 1 lần ở trang 1.
  const headerRow = new TableRow({
    children: [
      headerCell("Tuần, tháng", WIDTHS.tuan),
      headerCell("Chủ đề/Mạch nội dung", WIDTHS.chuDe),
      headerCell("Tên bài", WIDTHS.tenBai),
      headerCell("Tiết học/Thời lượng", WIDTHS.soTiet),
      headerCell("Nội dung điều chỉnh cần thiết (nếu có)", WIDTHS.dieuChinh),
      headerCell("Ghi chú", WIDTHS.tietPPCT),
    ],
  });

  const tuanMerge = computeMergeInfo(lessons, (l) => l.tuan || "");
  const chuDeMerge = computeMergeInfo(lessons, (l) => l.chuDe || "");
  const tietMerge = computeTietMerge(lessons);

  const rows = lessons.map((l, i) => {
    const children = [];
    if (tuanMerge[i].show) {
      children.push(cell(l.tuan || "", WIDTHS.tuan, { alignment: AlignmentType.CENTER, rowSpan: tuanMerge[i].span > 1 ? tuanMerge[i].span : undefined }));
    }
    if (chuDeMerge[i].show) {
      children.push(cell(l.chuDe || "", WIDTHS.chuDe, { bold: true, rowSpan: chuDeMerge[i].span > 1 ? chuDeMerge[i].span : undefined }));
    }
    children.push(cell(l.tenBai || "", WIDTHS.tenBai));
    if (tietMerge[i].show) {
      children.push(
        cell(tietMerge[i].label, WIDTHS.soTiet, {
          alignment: AlignmentType.CENTER,
          rowSpan: tietMerge[i].span > 1 ? tietMerge[i].span : undefined,
        })
      );
    }
    children.push(cell(l.dieuChinh || "", WIDTHS.dieuChinh));
    children.push(cell(l.tietPPCT != null ? String(l.tietPPCT) : "", WIDTHS.tietPPCT, { alignment: AlignmentType.CENTER }));
    return new TableRow({ children });
  });

  return new Table({
    width: { size: TABLE_WIDTH_TWIP, type: WidthType.DXA },
    columnWidths: [WIDTHS.tuan, WIDTHS.chuDe, WIDTHS.tenBai, WIDTHS.soTiet, WIDTHS.dieuChinh, WIDTHS.tietPPCT].map(pctToTwip),
    layout: TableLayoutType.FIXED,
    rows: [headerRow, ...rows],
  });
}

function buildHeaderParagraphs(meta) {
  const subtitle = [
    meta?.truong ? `TRƯỜNG: ${meta.truong.toUpperCase()}` : null,
    meta?.to ? `TỔ: ${meta.to.toUpperCase()}` : null,
  ].filter(Boolean);

  return [
    ...subtitle.map((line) => new Paragraph({ children: [textRun(line, { bold: true })], spacing: { after: 20 } })),
    meta?.giaoVien &&
      new Paragraph({ children: [textRun(`Họ và tên giáo viên: ${meta.giaoVien}`)], spacing: { after: 120 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        textRun(
          `KẾ HOẠCH DẠY HỌC CÁC MÔN HỌC, HOẠT ĐỘNG GIÁO DỤC LỚP ${meta?.grade || ""} - MÔN: ${(
            getSubjectLabel(meta?.subject) || ""
          ).toUpperCase()}`,
          { bold: true }
        ),
      ],
      spacing: { after: 40 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun(`CT GDPT 2018${meta?.namHoc ? ` - Năm học ${meta.namHoc}` : ""}`, { italics: true })],
      spacing: { after: 200 },
    }),
  ].filter(Boolean);
}

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function buildSignatureParagraphs(meta) {
  const col = (paragraphs) =>
    new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: NO_BORDERS, children: paragraphs });

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

export function buildKhgdTieuHocDocument({ lessons, meta }) {
  return new Document({
    // Mặc định toàn văn bản 14pt/Times New Roman: phủ luôn các đoạn KHÔNG có TextRun riêng (đoạn trống
    // giữ chỗ, ô bảng rỗng, ký hiệu gạch đầu dòng) để không rơi về cỡ mặc định nhỏ hơn của Word.
    styles: { default: { document: { run: { font: FONT, size: FONT_SIZE } } } },
    sections: [
      {
        properties: pageProperties,
        children: [...buildHeaderParagraphs(meta), buildLessonTable(lessons || []), ...buildSignatureParagraphs(meta)],
      },
    ],
  });
}

export async function exportKhgdTieuHocToWord({ lessons, meta }) {
  const doc = buildKhgdTieuHocDocument({ lessons, meta });
  const blob = await Packer.toBlob(doc);
  const subjectLabel = getSubjectLabel(meta?.subject) || "";
  const fileName = `Khung-KHGD-Tieu-Hoc_${subjectLabel}_Lop-${meta?.grade || ""}`.replace(/\s+/g, "-");
  saveAs(blob, `${fileName}.docx`);
}
