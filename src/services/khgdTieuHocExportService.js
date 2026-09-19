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
  convertMillimetersToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { PAGE_A4_LANDSCAPE_MM, PAGE_LANDSCAPE_MARGIN_MM } from "@/data/constants";
import { getSubjectLabel } from "@/data/config";

/**
 * khgdTieuHocExportService.js
 * Xuất Word (.docx) cho tab "Khung KHGD - Tiểu học" (Phụ lục 2, Công văn 2345/2021/BGDĐT-GDTH) -
 * file HOÀN TOÀN RIÊNG với khgdExportService.js (THCS/THPT, Phụ lục III/CV5512) - 2 mẫu văn bản
 * khác nhau theo quy định, KHÔNG dùng chung export builder dù cùng "họ" tab Khung KHGD.
 *
 * Cấu trúc bảng đối chiếu ĐÚNG file mẫu thật "KHDH CÁC MÔN LỚP 2-KNTT" (Phiên 47): Tuần/Chủ đề
 * (Mạch nội dung)/Tên bài/Tiết học (Thời lượng)/Tiết theo PPCT/Nội dung điều chỉnh cần thiết
 * (nếu có) - KHÔNG có Thiết bị dạy học/Địa điểm/SWD/NLS riêng (đã hỏi lại người dùng, chốt giữ
 * đúng mẫu thật). KHÔNG có bảng "Kiểm tra định kỳ" (chưa có mẫu thật cho phần này ở Tiểu học).
 *
 * ⚠️ Đơn giản hoá đã biết: cột "Chủ đề" lặp lại giá trị ở MỌI dòng thuộc chủ đề đó (không gộp ô
 * - "merge cell" - như bản Word gốc thường trình bày) - dễ đọc kém hơn 1 chút nhưng AN TOÀN hơn
 * (tránh lỗi rowSpan khi giáo viên tự thêm/xoá dòng) - có thể cải thiện sau nếu cần.
 */

const FONT = "Times New Roman";
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

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: 20, ...opts });
}

function cell(content, widthPercent, opts = {}) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: ALL_BORDERS,
    verticalAlign: VerticalAlign.TOP,
    children: [
      new Paragraph({ alignment: opts.alignment, children: [textRun(content, { bold: opts.bold })] }),
    ],
  });
}

function headerCell(text, widthPercent) {
  return cell(text, widthPercent, { bold: true, alignment: AlignmentType.CENTER });
}

const WIDTHS = { tuan: 6, chuDe: 12, tenBai: 40, soTiet: 8, tietPPCT: 8, dieuChinh: 26 };

function buildLessonTable(lessons) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      headerCell("Tuần, tháng", WIDTHS.tuan),
      headerCell("Chủ đề/Mạch nội dung", WIDTHS.chuDe),
      headerCell("Tên bài", WIDTHS.tenBai),
      headerCell("Tiết học/Thời lượng", WIDTHS.soTiet),
      headerCell("Tiết PPCT", WIDTHS.tietPPCT),
      headerCell("Nội dung điều chỉnh cần thiết (nếu có)", WIDTHS.dieuChinh),
    ],
  });

  const rows = lessons.map(
    (l) =>
      new TableRow({
        children: [
          cell(l.tuan || "", WIDTHS.tuan, { alignment: AlignmentType.CENTER }),
          cell(l.chuDe || "", WIDTHS.chuDe),
          cell(l.tenBai || "", WIDTHS.tenBai),
          cell(l.soTiet != null ? String(l.soTiet) : "", WIDTHS.soTiet, { alignment: AlignmentType.CENTER }),
          cell(l.tietPPCT != null ? String(l.tietPPCT) : "", WIDTHS.tietPPCT, { alignment: AlignmentType.CENTER }),
          cell(l.dieuChinh || "", WIDTHS.dieuChinh),
        ],
      })
  );

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...rows] });
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
          { bold: true, size: 25 }
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
