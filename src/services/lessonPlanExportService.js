import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  VerticalAlign,
  HeadingLevel,
  convertMillimetersToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { LESSON_PLAN_COLUMN_MODES } from "@/data/lessonPlanTemplates";
import { getSubjectLabel } from "@/data/config";
import { PAGE_A4_MM, PAGE_MARGIN_MM } from "@/data/constants";

/**
 * lessonPlanExportService.js
 * Xuất Word (.docx) cho "Kế hoạch bài dạy" (Giáo án) - dùng Table thật (không phải mô phỏng
 * bằng Paragraph border như worksheetExportService.js) vì đây là bảng dữ liệu 2 cột thật sự
 * (Hoạt động GV-HS / Sản phẩm dự kiến), giống cách specificationExportBuilders.js đã làm cho
 * Ma trận đề thi. KHÔNG cần pipeline LaTeX->OMML (giáo án hiếm khi có công thức phức tạp;
 * nếu môn Toán cần công thức, phần "content" vẫn hiển thị dạng text thường trong Word - có thể
 * bổ sung sau nếu giáo viên phản hồi cần).
 */

const FONT = "Times New Roman";
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: "444444" };
const ALL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: 24, ...opts });
}

function paragraph(text, opts = {}) {
  return new Paragraph({ children: [textRun(text, opts.run)], spacing: { after: 100 }, ...opts.paragraph });
}

function heading(text) {
  return new Paragraph({
    children: [textRun(text, { bold: true, size: 26 })],
    spacing: { before: 200, after: 100 },
  });
}

function bulletList(items) {
  return (items || []).map(
    (it) =>
      new Paragraph({
        bullet: { level: 0 },
        children: [textRun(it)],
        spacing: { after: 40 },
      })
  );
}

function cell(text, widthPercent, opts = {}) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: ALL_BORDERS,
    verticalAlign: VerticalAlign.TOP,
    children: [new Paragraph({ children: [textRun(text, { bold: opts.bold })] })],
  });
}

function buildTwoColumnActivityTable(steps) {
  const headerRow = new TableRow({
    children: [
      cell("Hoạt động của giáo viên và học sinh", 60, { bold: true }),
      cell("Sản phẩm dự kiến", 40, { bold: true }),
    ],
  });
  const bodyRows = (steps || []).map(
    (s) => new TableRow({ children: [cell(s.hoatDongGVHS, 60), cell(s.sanPhamDuKien, 40)] })
  );
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...bodyRows] });
}

function buildOneColumnActivityParagraphs(steps) {
  return (steps || []).flatMap((s) => [
    paragraph(s.hoatDongGVHS),
    ...(s.sanPhamDuKien
      ? [
          new Paragraph({
            children: [textRun(`Sản phẩm dự kiến: ${s.sanPhamDuKien}`, { italics: true })],
            spacing: { after: 120 },
            indent: { left: 200 },
          }),
        ]
      : []),
  ]);
}

function buildActivitySection(activity, columnMode, minutes) {
  const titleSuffix = minutes ? ` (~${minutes} phút)` : "";
  const children = [
    new Paragraph({
      children: [textRun(`${activity.ten}${titleSuffix}`, { bold: true, size: 24 })],
      spacing: { before: 150, after: 60 },
    }),
  ];
  if (activity.mucTieu) {
    children.push(
      new Paragraph({ children: [textRun(`Mục tiêu: ${activity.mucTieu}`, { italics: true })], spacing: { after: 80 } })
    );
  }
  if (columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN) {
    children.push(buildTwoColumnActivityTable(activity.tienTrinh));
    children.push(new Paragraph({ text: "" }));
  } else {
    children.push(...buildOneColumnActivityParagraphs(activity.tienTrinh));
  }
  return children;
}

export function buildLessonPlanDocxSections({ lessonPlan, timeline, meta }) {
  const columnMode = meta?.columnMode || LESSON_PLAN_COLUMN_MODES.ONE_COLUMN;
  const minutesByKey = Object.fromEntries((timeline || []).map((t) => [t.key, t.minutes]));
  const activityKeyByIndex = ["khoi_dong", "kham_pha", "luyen_tap", "van_dung"];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun((lessonPlan.tenBai || meta?.tenBai || "").toUpperCase(), { bold: true, size: 30 })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        textRun(
          `${meta?.subject ? `Môn: ${getSubjectLabel(meta.subject)} — ` : ""}${
            meta?.grade === "MAM_NON" ? "Mầm non" : `Lớp ${meta?.grade}`
          } — Số tiết: ${meta?.soTiet || 1}${meta?.circularLabel ? ` — Theo ${meta.circularLabel}` : ""}`,
          { italics: true, size: 22 }
        ),
      ],
      spacing: { after: 200 },
    }),

    heading("I. YÊU CẦU CẦN ĐẠT"),
    ...(lessonPlan.yeuCauCanDat?.kienThuc?.length ? [paragraph("1. Kiến thức", { run: { bold: true } }), ...bulletList(lessonPlan.yeuCauCanDat.kienThuc)] : []),
    ...(lessonPlan.yeuCauCanDat?.nangLuc?.length ? [paragraph("2. Năng lực", { run: { bold: true } }), ...bulletList(lessonPlan.yeuCauCanDat.nangLuc)] : []),
    ...(lessonPlan.yeuCauCanDat?.phamChat?.length ? [paragraph("3. Phẩm chất", { run: { bold: true } }), ...bulletList(lessonPlan.yeuCauCanDat.phamChat)] : []),

    heading("II. ĐỒ DÙNG DẠY HỌC"),
    ...(lessonPlan.doDungDayHoc?.giaoVien?.length ? [paragraph("Giáo viên", { run: { bold: true } }), ...bulletList(lessonPlan.doDungDayHoc.giaoVien)] : []),
    ...(lessonPlan.doDungDayHoc?.hocSinh?.length ? [paragraph("Học sinh", { run: { bold: true } }), ...bulletList(lessonPlan.doDungDayHoc.hocSinh)] : []),

    heading("III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU"),
    ...(lessonPlan.hoatDong || []).flatMap((a, i) =>
      buildActivitySection(a, columnMode, minutesByKey[activityKeyByIndex[i]])
    ),
  ];

  if (lessonPlan.tichHopNLS) children.push(paragraph(`Tích hợp Năng lực số: ${lessonPlan.tichHopNLS}`));
  if (lessonPlan.tichHopGDQPAN) children.push(paragraph(`Tích hợp GDQP&AN: ${lessonPlan.tichHopGDQPAN}`));
  if (lessonPlan.tichHopHSKT) children.push(paragraph(`Điều chỉnh cho học sinh khuyết tật hoà nhập: ${lessonPlan.tichHopHSKT}`));

  if (lessonPlan.cungCoQuestions?.length) {
    children.push(heading("Củng cố - Bộ câu hỏi nhanh"));
    lessonPlan.cungCoQuestions.forEach((q, i) => {
      children.push(paragraph(`${i + 1}. ${q.cauHoi} (Đáp án: ${q.dapAn})`));
    });
  }

  if (lessonPlan.mindmap?.chuDe) {
    children.push(heading(`Sơ đồ tư duy: ${lessonPlan.mindmap.chuDe}`));
    (lessonPlan.mindmap.nhanh || []).forEach((n) => {
      children.push(paragraph(n.nhan, { run: { bold: true } }));
      children.push(...bulletList(n.y));
    });
  }

  children.push(heading("IV. ĐIỀU CHỈNH SAU BÀI DẠY"));
  children.push(paragraph("............................................................................"));
  children.push(paragraph("............................................................................"));

  return children;
}

// ================== GIAI ĐOẠN 1 (sửa lỗi layout/in ấn) ==================
// Cùng bug với exportService.js/worksheetExportService.js: properties:{} rỗng -> khổ Letter
// mặc định thay vì A4. Dùng chung PAGE_A4_MM/PAGE_MARGIN_MM từ constants.js để 3 nơi luôn khớp.
const LESSON_PLAN_PAGE_PROPERTIES = {
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

export async function exportLessonPlanToWord({ lessonPlan, timeline, meta }) {
  const children = buildLessonPlanDocxSections({ lessonPlan, timeline, meta });
  const doc = new Document({ sections: [{ properties: LESSON_PLAN_PAGE_PROPERTIES, children }] });
  const blob = await Packer.toBlob(doc);
  const fileNameBase = (lessonPlan.tenBai || meta?.tenBai || "giao-an").replace(/[^\p{L}\p{N}]+/gu, "-");
  saveAs(blob, `Giao-an-${fileNameBase}.docx`);
}
