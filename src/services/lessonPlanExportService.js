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
import {
  LESSON_PLAN_COLUMN_MODES,
  computeMultiPeriodTimeline,
  normalizeActivitiesTiet,
  computeActivityStartTiets,
} from "@/data/lessonPlanTemplates";
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

// Chuyển 1 chuỗi có thể chứa "\n" (do AI viết nhiều ý gạch đầu dòng trong 1 bước, xem
// stepClarityRule trong lessonPlanPromptTemplates.js) thành mảng TextRun có ngắt dòng thật
// trong Word (dùng "break", KHÔNG in ký tự "\n" thô ra file - lỗi này từng gặp ở nơi khác).
function multilineTextRuns(text, opts = {}) {
  const lines = String(text ?? "").split("\n");
  return lines.flatMap((line, i) => (i === 0 ? [textRun(line, opts)] : [textRun(line, { ...opts, break: 1 })]));
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
    children: [new Paragraph({ children: opts.children || [textRun(text, { bold: opts.bold })] })],
  });
}

// Ranh giới giữa 2 tiết học (paragraph) - dùng ở chế độ 1 cột; giáo viên phản ánh trước đây bài
// dạy nhiều tiết bị in liền mạch, không rõ điểm dừng của từng tiết để chèn giải lao.
function periodBoundaryParagraph(tiet) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    border: {
      top: { style: BorderStyle.DASHED, size: 6, color: "FB923C" },
      bottom: { style: BorderStyle.DASHED, size: 6, color: "FB923C" },
    },
    children: [
      textRun(`── Hết Tiết ${tiet - 1} (nghỉ giải lao) — Chuyển sang Tiết ${tiet} ──`, {
        bold: true,
        size: 20,
        color: "9A3412",
      }),
    ],
    spacing: { before: 120, after: 120 },
  });
}

// Ranh giới giữa 2 tiết học (1 hàng bảng, gộp 2 cột) - dùng ở chế độ 2 cột.
function periodBoundaryTableRow(tiet) {
  return new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.DASHED, size: 6, color: "FB923C" },
          bottom: { style: BorderStyle.DASHED, size: 6, color: "FB923C" },
          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              textRun(`── Hết Tiết ${tiet - 1} (nghỉ giải lao) — Chuyển sang Tiết ${tiet} ──`, {
                bold: true,
                size: 20,
                color: "9A3412",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ⚠️ Đánh số "Bước N:" THUẦN CODE (không phụ thuộc AI) cho từng bước trong "tienTrinh" - giáo
// viên phản ánh mục III (CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU) trước đây không rõ ràng ranh giới giữa
// các bước. Đảm bảo LUÔN đánh số nhất quán dù AI trả về bao nhiêu bước.
// Đồng thời chèn "ranh giới tiết" (periodBoundary*) THUẦN CODE ngay trước bước đầu tiên có "tiet"
// lớn hơn bước liền trước - xem giải thích đầy đủ trong buildMultiPeriodGuidance() (data/
// lessonPlanPromptTemplates.js) và PeriodBoundary trong LessonPlanPreview.jsx (bản xem trước web).
function buildTwoColumnActivityTable(steps, startTiet) {
  const headerRow = new TableRow({
    children: [
      cell("Hoạt động của giáo viên và học sinh", 60, { bold: true }),
      cell("Sản phẩm dự kiến", 40, { bold: true }),
    ],
  });
  // startTiet: mốc "tiết đang diễn ra" ngay trước khi hoạt động này bắt đầu - xem
  // computeActivityStartTiets() (lessonPlanTemplates.js) + giải thích lỗi "rối loạn dòng thời
  // gian" tại normalizeActivitiesTiet() cùng file. KHÔNG dùng null như trước (bỏ sót ranh giới
  // tiết xảy ra ngay ở bước đầu tiên của hoạt động).
  let lastTiet = startTiet || null;
  const bodyRows = (steps || []).flatMap((s, i) => {
    const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
    lastTiet = s.tiet || lastTiet;
    const row = new TableRow({
      children: [
        cell(null, 60, {
          children: [textRun(`Bước ${i + 1}: `, { bold: true }), ...multilineTextRuns(s.hoatDongGVHS)],
        }),
        cell(s.sanPhamDuKien, 40),
      ],
    });
    return showBoundary ? [periodBoundaryTableRow(s.tiet), row] : [row];
  });
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...bodyRows] });
}

function buildOneColumnActivityParagraphs(steps, startTiet) {
  let lastTiet = startTiet || null;
  return (steps || []).flatMap((s, i) => {
    const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
    lastTiet = s.tiet || lastTiet;
    return [
      ...(showBoundary ? [periodBoundaryParagraph(s.tiet)] : []),
      new Paragraph({
        children: [textRun(`Bước ${i + 1}: `, { bold: true }), ...multilineTextRuns(s.hoatDongGVHS)],
        spacing: { after: 40 },
      }),
      ...(s.sanPhamDuKien
        ? [
            new Paragraph({
              children: [textRun(`Sản phẩm dự kiến: ${s.sanPhamDuKien}`, { italics: true })],
              spacing: { after: 120 },
              indent: { left: 200 },
            }),
          ]
        : []),
    ];
  });
}

const LOAI_LABEL = { nang_luc: "Năng lực", pham_chat: "Phẩm chất" };

// Bảng "Checklist đánh giá Năng lực - Phẩm chất" (phụ lục) - 4 cột: Tiêu chí | Tốt | Đạt | Cần cố
// gắng, mỗi hàng ứng đúng 1 tiêu chí đã liệt kê ở mục I.2/I.3 (yeuCauCanDat.nangLuc/phamChat) -
// xem giải thích đầy đủ trong lessonPlanIntegrations.js (INTEGRATION_KEYS.CHECKLIST_NLPC).
function buildChecklistNLPCTable(items) {
  const headerRow = new TableRow({
    children: [
      cell("Tiêu chí", 28, { bold: true }),
      cell("Tốt", 24, { bold: true }),
      cell("Đạt", 24, { bold: true }),
      cell("Cần cố gắng", 24, { bold: true }),
    ],
  });
  const bodyRows = (items || []).map((it) => {
    const loaiLine = it.loai && LOAI_LABEL[it.loai] ? LOAI_LABEL[it.loai] : null;
    return new TableRow({
      children: [
        cell(null, 28, {
          children: [
            ...(loaiLine ? [textRun(loaiLine, { italics: true, size: 18, color: "94A3B8" }), textRun("", { break: 1 })] : []),
            textRun(it.tieuChi, { bold: true }),
          ],
        }),
        cell(it.tot, 24),
        cell(it.dat, 24),
        cell(it.canCoGang, 24),
      ],
    });
  });
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...bodyRows] });
}

// Phụ lục "Hướng dẫn STEM" - đúng pattern phần "Phiếu học tập" ngay phía trên (xem
// buildLessonPlanDocxSections() bên dưới): tiêu đề PHỤ LỤC + tên sản phẩm, rồi lần lượt 3 khối
// Vật liệu / Các bước thực hiện / Tiêu chí đánh giá - xem giải thích đầy đủ trong
// lessonPlanIntegrations.js (INTEGRATION_KEYS.TICH_HOP_STEM) và StemActivityBlock
// (LessonPlanPreview.jsx, bản web).
function buildStemActivityParagraphs(data) {
  const children = [];
  const vatLieu = data?.vatLieu || [];
  const cacBuoc = data?.cacBuoc || [];
  const tieuChi = data?.tieuChiDanhGia || [];
  if (vatLieu.length > 0) {
    children.push(
      new Paragraph({
        children: [textRun("Vật liệu cần chuẩn bị", { bold: true, size: 22, color: "0F766E" })],
        spacing: { before: 120, after: 60 },
      })
    );
    children.push(...bulletList(vatLieu));
  }
  if (cacBuoc.length > 0) {
    children.push(
      new Paragraph({
        children: [textRun("Các bước thực hiện", { bold: true, size: 22, color: "0F766E" })],
        spacing: { before: 120, after: 60 },
      })
    );
    cacBuoc.forEach((b, i) => {
      children.push(
        new Paragraph({
          children: [textRun(`${i + 1}. `, { bold: true }), ...multilineTextRuns(b)],
          spacing: { after: 60 },
          indent: { left: 200 },
        })
      );
    });
  }
  if (tieuChi.length > 0) {
    children.push(
      new Paragraph({
        children: [textRun("Tiêu chí đánh giá", { bold: true, size: 22, color: "0F766E" })],
        spacing: { before: 120, after: 60 },
      })
    );
    children.push(...bulletList(tieuChi));
  }
  return children;
}

const PHAN_HOA_GROUPS = [
  { key: "hoTro", label: "Mức 1 — Hỗ trợ", color: "0369A1" },
  { key: "datChuan", label: "Mức 2 — Đạt chuẩn", color: "15803D" },
  { key: "nangCao", label: "Mức 3 — Nâng cao", color: "B45309" },
];

// Phụ lục "Bài tập phân hoá theo 3 mức độ" - 3 khối liên tiếp (Hỗ trợ/Đạt chuẩn/Nâng cao), mỗi
// khối là 1 danh sách đánh số riêng - xem giải thích đầy đủ trong lessonPlanIntegrations.js
// (INTEGRATION_KEYS.BAI_TAP_PHAN_HOA) và BaiTapPhanHoaBlock (LessonPlanPreview.jsx, bản web).
function buildBaiTapPhanHoaParagraphs(data) {
  const children = [];
  PHAN_HOA_GROUPS.forEach((g) => {
    const items = data?.[g.key] || [];
    if (items.length === 0) return;
    children.push(
      new Paragraph({
        children: [textRun(g.label, { bold: true, size: 22, color: g.color })],
        spacing: { before: 120, after: 60 },
      })
    );
    items.forEach((it, i) => {
      children.push(
        new Paragraph({
          children: [textRun(`${i + 1}. `, { bold: true }), ...multilineTextRuns(it)],
          spacing: { after: 60 },
          indent: { left: 200 },
        })
      );
    });
  });
  return children;
}

// Phụ lục "Lời dẫn (Teacher Script)" - GIAI ĐOẠN 10, Việc 6/7 (xem KE_HOACH_GIAI_DOAN_10.md mục
// 2, đề xuất #2). CHỦ ĐỘNG ĐIỀU CHỈNH so với đề xuất gốc: KHÔNG chèn thẳng vào Mục III bản chính
// (rủi ro bị đánh giá "không chuẩn form" khi BGH duyệt CV2345) - đây LUÔN là 1 phụ lục tách trang
// riêng, và hàm buildLessonPlanDocxSections() CHỈ gọi hàm này khi includeTeacherScript===true
// ("Bản đầy đủ có lời dẫn") - mặc định xuất "Bản nộp chuẩn" KHÔNG có phụ lục này (xem lời gọi bên
// dưới + LessonPlanExportActions.jsx là nơi giáo viên chủ động bật cờ này).
function buildLoiDanParagraphs(items) {
  const children = [];
  (items || []).forEach((it) => {
    if (!it?.loiDan) return;
    if (it.hoatDong) {
      children.push(
        new Paragraph({
          children: [textRun(it.hoatDong, { bold: true })],
          spacing: { before: 100, after: 20 },
        })
      );
    }
    children.push(
      new Paragraph({
        children: [textRun(`"${it.loiDan}"`, { italics: true })],
        spacing: { after: 80 },
        indent: { left: 200 },
      })
    );
  });
  return children;
}

// Phụ lục "Dàn ý Slide" (Slide Outline) - GIAI ĐOẠN 10, Việc 7/7 (xem KE_HOACH_GIAI_DOAN_10.md
// mục 2, đề xuất #3). KHÔNG có "cờ ẩn-hiện" như Lời dẫn (Việc 6) - đây CHỈ là dàn ý văn bản tham
// khảo, không đụng khung mục I-IV chuẩn CV2345 nên không có rủi ro "sai form" khi BGH duyệt, vẫn
// luôn xuất hiện trong file Word như các phụ lục khác (Tin nhắn PH/Checklist/Phân hoá) một khi
// tích hợp được bật lúc soạn.
function buildSlideOutlineParagraphs(slides) {
  const children = [];
  (slides || []).forEach((s, i) => {
    if (!s?.tieuDe && !(s?.noiDung || []).length) return;
    children.push(
      new Paragraph({
        children: [textRun(`Slide ${i + 1}: ${s.tieuDe || ""}`, { bold: true })],
        spacing: { before: 100, after: 20 },
      })
    );
    (s.noiDung || []).forEach((line) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [textRun(line)],
          spacing: { after: 20 },
          indent: { left: 200 },
        })
      );
    });
  });
  return children;
}

function buildActivitySection(activity, columnMode, minutes, startTiet) {
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
    children.push(buildTwoColumnActivityTable(activity.tienTrinh, startTiet));
    children.push(new Paragraph({ text: "" }));
  } else {
    children.push(...buildOneColumnActivityParagraphs(activity.tienTrinh, startTiet));
  }
  return children;
}

export function buildLessonPlanDocxSections({ lessonPlan, timeline, meta, includeTeacherScript = false }) {
  const columnMode = meta?.columnMode || LESSON_PLAN_COLUMN_MODES.ONE_COLUMN;
  const minutesByKey = Object.fromEntries((timeline || []).map((t) => [t.key, t.minutes]));
  const activityKeyByIndex = ["khoi_dong", "kham_pha", "luyen_tap", "van_dung"];
  // Sửa lỗi "rối loạn dòng thời gian" (ranh giới "Hết Tiết..." bị chèn sai chỗ/chèn lặp khi xuất
  // Word) - PHẢI dùng chung logic chuẩn hoá với bản xem trước web (LessonPlanPreview.jsx), xem
  // giải thích đầy đủ tại normalizeActivitiesTiet()/computeActivityStartTiets() (lessonPlanTemplates.js).
  const normalizedHoatDong = normalizeActivitiesTiet(lessonPlan.hoatDong);
  const activityStartTiets = computeActivityStartTiets(normalizedHoatDong);

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
    ...(meta?.soTiet > 1
      ? [
          new Paragraph({
            children: [
              textRun(
                `Gợi ý phân bổ theo tiết: ${computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType)
                  .map((p) => `Tiết ${p.period} (${p.totalMinutes}')`)
                  .join(" — ")}`,
                { italics: true, size: 20, color: "9A3412" }
              ),
            ],
            spacing: { after: 80 },
          }),
        ]
      : []),
    ...normalizedHoatDong.flatMap((a, i) =>
      buildActivitySection(a, columnMode, minutesByKey[activityKeyByIndex[i]], activityStartTiets[i])
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

  if (lessonPlan.phieuHocTap?.tieuDe || lessonPlan.phieuHocTap?.baiTap?.length) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        children: [textRun(`PHỤ LỤC: ${lessonPlan.phieuHocTap.tieuDe || "Phiếu học tập"}`, { bold: true, size: 26 })],
        spacing: { before: 100, after: 60 },
      })
    );
    if (lessonPlan.phieuHocTap.huongDan) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [textRun(lessonPlan.phieuHocTap.huongDan, { italics: true })],
          spacing: { after: 160 },
        })
      );
    }
    (lessonPlan.phieuHocTap.baiTap || []).forEach((bai, i) => {
      children.push(
        new Paragraph({
          children: [textRun(`${i + 1}. `, { bold: true }), ...multilineTextRuns(bai)],
          spacing: { after: 40 },
        })
      );
      // Dòng chấm để học sinh viết câu trả lời trực tiếp vào phiếu (photo dùng ngay).
      children.push(paragraph("...................................................................................."));
      children.push(paragraph("...................................................................................."));
    });
  }

  const hasStemActivity =
    !!lessonPlan.stemActivity?.tenSanPham || (lessonPlan.stemActivity?.cacBuoc || []).length > 0;
  if (hasStemActivity) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        children: [
          textRun(
            `PHỤ LỤC: HƯỚNG DẪN STEM${lessonPlan.stemActivity.tenSanPham ? ` — ${lessonPlan.stemActivity.tenSanPham}` : ""}`,
            { bold: true, size: 26 }
          ),
        ],
        spacing: { before: 100, after: 60 },
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [textRun("Học sinh hoàn thiện sản phẩm ở nhà - giáo viên có thể in/gửi phụ huynh mục này.", { italics: true })],
        spacing: { after: 100 },
      })
    );
    children.push(...buildStemActivityParagraphs(lessonPlan.stemActivity));
  }

  const hasPhanHoa = PHAN_HOA_GROUPS.some((g) => (lessonPlan.baiTapPhanHoa?.[g.key] || []).length > 0);
  if (hasPhanHoa) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        children: [textRun("PHỤ LỤC: BÀI TẬP PHÂN HOÁ THEO 3 MỨC ĐỘ", { bold: true, size: 26 })],
        spacing: { before: 100, after: 60 },
      })
    );
    children.push(...buildBaiTapPhanHoaParagraphs(lessonPlan.baiTapPhanHoa));
  }

  if (lessonPlan.checklistNLPC?.length) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        children: [textRun("PHỤ LỤC: CHECKLIST ĐÁNH GIÁ NĂNG LỰC - PHẨM CHẤT", { bold: true, size: 26 })],
        spacing: { before: 100, after: 40 },
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          textRun(
            "(Theo tinh thần Thông tư 27/2020/TT-BGDĐT - giáo viên quan sát và đánh dấu trực tiếp trong tiết học)",
            { italics: true, size: 20, color: "64748B" }
          ),
        ],
        spacing: { after: 120 },
      })
    );
    children.push(buildChecklistNLPCTable(lessonPlan.checklistNLPC));
    children.push(new Paragraph({ text: "" }));
  }

  if (lessonPlan.tinNhanPhuHuynh) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        children: [textRun("PHỤ LỤC: TIN NHẮN GỬI PHỤ HUYNH (ZALO)", { bold: true, size: 26 })],
        spacing: { before: 100, after: 120 },
      })
    );
    children.push(
      new Paragraph({
        children: multilineTextRuns(lessonPlan.tinNhanPhuHuynh),
        spacing: { after: 100 },
      })
    );
  }

  // Chỉ chèn khi giáo viên chủ động bật cờ "Bản đầy đủ có lời dẫn" - xem giải thích đầy đủ ở
  // buildLoiDanParagraphs() phía trên. KHÔNG kiểm tra riêng includeTeacherScript ở LessonPlan-
  // ExportActions.jsx - để logic "ẩn/hiện" nằm DUY NHẤT ở đây, tránh 2 nơi có thể lệch nhau.
  if (includeTeacherScript && lessonPlan.loiDan?.length) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        children: [textRun("PHỤ LỤC: LỜI DẪN (TEACHER SCRIPT)", { bold: true, size: 26 })],
        spacing: { before: 100, after: 40 },
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          textRun(
            "(Câu dẫn dắt/chuyển ý mẫu cho từng hoạt động - phần THAM KHẢO, không thuộc khung mẫu CV2345 chuẩn)",
            { italics: true, size: 20, color: "64748B" }
          ),
        ],
        spacing: { after: 120 },
      })
    );
    children.push(...buildLoiDanParagraphs(lessonPlan.loiDan));
  }

  if (lessonPlan.slideOutline?.length) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        children: [textRun("PHỤ LỤC: DÀN Ý SLIDE", { bold: true, size: 26 })],
        spacing: { before: 100, after: 40 },
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          textRun(
            "(Dàn ý văn bản tham khảo để dựng PowerPoint/Canva - không phải file trình chiếu thật)",
            { italics: true, size: 20, color: "64748B" }
          ),
        ],
        spacing: { after: 120 },
      })
    );
    children.push(...buildSlideOutlineParagraphs(lessonPlan.slideOutline));
  }

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

export async function exportLessonPlanToWord({ lessonPlan, timeline, meta, includeTeacherScript = false }) {
  const children = buildLessonPlanDocxSections({ lessonPlan, timeline, meta, includeTeacherScript });
  const doc = new Document({ sections: [{ properties: LESSON_PLAN_PAGE_PROPERTIES, children }] });
  const blob = await Packer.toBlob(doc);
  const fileNameBase = (lessonPlan.tenBai || meta?.tenBai || "giao-an").replace(/[^\p{L}\p{N}]+/gu, "-");
  // Hậu tố tên file để giáo viên phân biệt rõ 2 phiên bản (không lỡ nộp nhầm bản có lời dẫn) -
  // xem quyết định "cờ ẩn-hiện" ở KE_HOACH_GIAI_DOAN_10.md mục 2, đề xuất #2.
  const suffix = includeTeacherScript ? "-day-du-loi-dan" : "";
  saveAs(blob, `Giao-an-${fileNameBase}${suffix}.docx`);
  // ⚠️ FIX (rà soát tổng thể): trước đây hàm KHÔNG return blob -> mọi lời gọi await
  // exportLessonPlanToWord(...) chỉ nhận về undefined. UI thực tế (LessonPlanExportActions.jsx)
  // không dùng giá trị trả về nên không lộ lỗi khi dùng bình thường, nhưng test/lessonPlanExportService.js
  // (giải nén lại .docx thật để kiểm tra nội dung phụ lục LỜI DẪN/DÀN Ý SLIDE) cần blob thật ->
  // 7/7 test trong file đó FAIL với "Cannot read properties of undefined (reading 'arrayBuffer')".
  // Trả blob về vừa sửa lỗi test, vừa cho phép code khác tái sử dụng blob (VD xuất đồng thời
  // nhiều bản như exportBothVersions() trong exportService.js) nếu cần sau này.
  return blob;
}
