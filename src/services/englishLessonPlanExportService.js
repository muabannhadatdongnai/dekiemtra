import { Document, Paragraph, AlignmentType, Table, TableRow, WidthType } from "docx";
import {
  pageProperties,
  heading,
  paragraph,
  bulletList,
  cell,
  twoColumnTable,
  textRun,
  multilineTextRuns,
  saveDocx,
  buildDocxBlob,
  printHtmlDocument,
  htmlHeading,
  htmlParagraph,
  htmlBulletList,
} from "./foreignLanguageDocBuilder";
import {
  LESSON_PLAN_COLUMN_MODES,
  computeMultiPeriodTimeline,
  normalizeActivitiesTiet,
  computeActivityStartTiets,
} from "@/data/lessonPlanTemplates";

/**
 * englishLessonPlanExportService.js
 * Xuất Word/PDF HOÀN TOÀN bằng TIẾNG ANH cho "Kế hoạch bài dạy" (Soạn Giáo Án) môn Tiếng Anh - từ
 * Phiên 35, nhận THẲNG object `lessonPlan` đã được AI SINH TRỰC TIẾP bằng tiếng Anh (cùng khoá với
 * bản gốc lessonPlanExportService.js: tenBai, yeuCauCanDat, doDungDayHoc, hoatDong,
 * goiYHocLieuHinhAnh - xem lessonPlanPromptTemplates.js), KHÔNG còn bước dịch lại như trước (xem
 * lịch sử ở PROJECT_SUMMARY.md Phiên 34). KHÔNG đụng tới/không tái dùng lessonPlanExportService.js
 * (bản tiếng Việt gốc giữ NGUYÊN VẸN, dùng cho mọi môn học khác).
 *
 * ⚠️ Phụ lục "Tin nhắn gửi phụ huynh" (`lessonPlan.tinNhanPhuHuynh`) LUÔN được AI viết bằng TIẾNG
 * VIỆT dù giáo án còn lại bằng tiếng Anh (xem exemptJsonFields ở buildForeignLanguageOutputDirective
 * - foreignLanguageSubjects.js) - nên render Ở ĐÂY vẫn giữ tiêu đề tiếng Việt, không dịch.
 *
 * ⚠️ Phiên 36: ĐÃ MỞ RỘNG (trước đây chỉ hỗ trợ các trường lõi + Timeline nhiều tiết + Tin nhắn
 * phụ huynh + Gợi ý học liệu hình ảnh - xem NEXT_STEPS.md mục #18 lịch sử cũ) - giờ render ĐỦ cả 7
 * tích hợp còn thiếu, ĐÚNG THỨ TỰ và cấu trúc phụ lục như bản tiếng Việt gốc
 * (lessonPlanExportService.js), chỉ khác nhãn tiêu đề dịch sang tiếng Anh: Checklist NL-PC, STEM,
 * Bài tập phân hoá, Phiếu học tập, Lời dẫn (Teacher Script, có cờ ẩn/hiện `includeTeacherScript`
 * giống bản tiếng Việt), Dàn ý Slide. Cũng thêm hỗ trợ ranh giới "Hết Tiết..." (Period boundary)
 * khi bài dạy nhiều tiết + chế độ 1 cột/2 cột (columnMode), đúng parity với bản tiếng Việt.
 */

function metaLine(meta) {
  const parts = [];
  if (meta?.subjectLabelEn) parts.push(`Subject: ${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") parts.push(`Grade: ${meta.grade}`);
  if (meta?.soTiet) parts.push(`Periods: ${meta.soTiet}`);
  return parts.join("   |   ");
}

// ============================= "PHỤ LỤC"/tiêu đề dùng chung =============================

function appendixTitleParagraph(text) {
  return new Paragraph({
    pageBreakBefore: true,
    alignment: AlignmentType.CENTER,
    children: [textRun(text, { bold: true, size: 26 })],
    spacing: { before: 100, after: 60 },
  });
}

function appendixNoteParagraph(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [textRun(text, { italics: true, size: 20, color: "64748B" })],
    spacing: { after: 120 },
  });
}

// ============================= Period boundary (nhiều tiết) =============================

function periodBoundaryParagraphEn(tiet) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      textRun(`── End of Period ${tiet - 1} (break) — Move to Period ${tiet} ──`, {
        bold: true,
        size: 20,
        color: "9A3412",
      }),
    ],
    spacing: { before: 120, after: 120 },
  });
}

// ⚠️ FIX (Phiên 37) - lỗi "Word experienced an error trying to open the file" khi tải file Word
// tiếng Anh tab Soạn Giáo Án (bài dạy nhiều tiết): cell() (foreignLanguageDocBuilder.js) LUÔN tự
// bọc `opts.children` trong ĐÚNG 1 `new Paragraph({...})` - tức opts.children phải là mảng các
// TextRun, KHÔNG PHẢI một Paragraph. Trước đây hàm này truyền `children: [new Paragraph({...})]`
// khiến cell() lồng nguyên object Paragraph đó vào bên trong Paragraph bọc ngoài, sinh ra XML
// `<w:p><w:p>...</w:p></w:p>` (một paragraph lồng trong paragraph) - VI PHẠM schema OOXML thật sự.
// Lỗi này vẫn là XML "well-formed" (thẻ đóng/mở khớp nhau) nên các công cụ khoan dung như
// LibreOffice/python-docx mở được bình thường và không phát hiện ra, nhưng MS Word kiểm tra schema
// nghiêm ngặt hơn nên từ chối mở file. Sửa: truyền thẳng mảng TextRun + dùng `alignment` có sẵn của
// cell() thay vì bọc thêm 1 Paragraph nữa.
function periodBoundaryTableRowEn(tiet) {
  return new TableRow({
    children: [
      cell(null, 100, {
        columnSpan: 2,
        alignment: AlignmentType.CENTER,
        children: [
          textRun(`── End of Period ${tiet - 1} (break) — Move to Period ${tiet} ──`, {
            bold: true,
            size: 20,
            color: "9A3412",
          }),
        ],
      }),
    ],
  });
}

// ============================= Hoạt động (Activities) =============================

function buildTwoColumnActivityTableEn(steps, startTiet) {
  const headerRow = [
    cell("Teacher & Student Activities", 60, { bold: true }),
    cell("Expected Outcome", 40, { bold: true }),
  ];
  let lastTiet = startTiet || null;
  const rowsWithBoundaries = [];
  (steps || []).forEach((s, i) => {
    const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
    lastTiet = s.tiet || lastTiet;
    if (showBoundary) rowsWithBoundaries.push(periodBoundaryTableRowEn(s.tiet));
    rowsWithBoundaries.push(
      new TableRow({
        children: [
          cell(null, 60, {
            children: [textRun(`Step ${i + 1}: `, { bold: true }), ...multilineTextRuns(s.hoatDongGVHS)],
          }),
          cell(s.sanPhamDuKien, 40),
        ],
      })
    );
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: headerRow }), ...rowsWithBoundaries],
  });
}

function buildOneColumnActivityParagraphsEn(steps, startTiet) {
  let lastTiet = startTiet || null;
  return (steps || []).flatMap((s, i) => {
    const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
    lastTiet = s.tiet || lastTiet;
    return [
      ...(showBoundary ? [periodBoundaryParagraphEn(s.tiet)] : []),
      new Paragraph({
        children: [textRun(`Step ${i + 1}: `, { bold: true }), ...multilineTextRuns(s.hoatDongGVHS)],
        spacing: { after: 40 },
      }),
      ...(s.sanPhamDuKien
        ? [
            new Paragraph({
              children: [textRun(`Expected outcome: ${s.sanPhamDuKien}`, { italics: true })],
              spacing: { after: 120 },
              indent: { left: 200 },
            }),
          ]
        : []),
    ];
  });
}

function buildActivitySectionEn(activity, columnMode, minutes, startTiet) {
  const titleSuffix = minutes ? ` (~${minutes} min)` : "";
  const children = [
    new Paragraph({
      children: [textRun(`${activity.ten || ""}${titleSuffix}`, { bold: true, size: 24 })],
      spacing: { before: 150, after: 60 },
    }),
  ];
  if (activity.mucTieu) {
    children.push(
      new Paragraph({ children: [textRun(`Objective: ${activity.mucTieu}`, { italics: true })], spacing: { after: 80 } })
    );
  }
  const steps = Array.isArray(activity.tienTrinh) ? activity.tienTrinh : [];
  if (steps.length) {
    if (columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN) {
      children.push(buildTwoColumnActivityTableEn(steps, startTiet));
      children.push(new Paragraph({ text: "" }));
    } else {
      children.push(...buildOneColumnActivityParagraphsEn(steps, startTiet));
    }
  }
  return children;
}

// ============================= Checklist NL-PC (Competency-Quality) =============================

const LOAI_LABEL_EN = { nang_luc: "Competency", pham_chat: "Quality" };

function buildChecklistNLPCTableEn(items) {
  const headerRow = new TableRow({
    children: [
      cell("Criteria", 28, { bold: true }),
      cell("Good", 24, { bold: true }),
      cell("Satisfactory", 24, { bold: true }),
      cell("Needs Improvement", 24, { bold: true }),
    ],
  });
  const bodyRows = (items || []).map((it) => {
    const loaiLine = it.loai && LOAI_LABEL_EN[it.loai] ? LOAI_LABEL_EN[it.loai] : null;
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

// ============================= STEM Activity Guide =============================

function buildStemActivityParagraphsEn(data) {
  const children = [];
  const vatLieu = data?.vatLieu || [];
  const cacBuoc = data?.cacBuoc || [];
  const tieuChi = data?.tieuChiDanhGia || [];
  if (vatLieu.length > 0) {
    children.push(
      new Paragraph({ children: [textRun("Materials Needed", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
    );
    children.push(...bulletList(vatLieu));
  }
  if (cacBuoc.length > 0) {
    children.push(
      new Paragraph({ children: [textRun("Steps", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
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
      new Paragraph({ children: [textRun("Assessment Criteria", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
    );
    children.push(...bulletList(tieuChi));
  }
  return children;
}

// ============================= Differentiated Exercises (3 levels) =============================

const PHAN_HOA_GROUPS_EN = [
  { key: "hoTro", label: "Level 1 — Support", color: "0369A1" },
  { key: "datChuan", label: "Level 2 — On-level", color: "15803D" },
  { key: "nangCao", label: "Level 3 — Advanced", color: "B45309" },
];

function buildBaiTapPhanHoaParagraphsEn(data) {
  const children = [];
  PHAN_HOA_GROUPS_EN.forEach((g) => {
    const items = data?.[g.key] || [];
    if (items.length === 0) return;
    children.push(
      new Paragraph({ children: [textRun(g.label, { bold: true, size: 22, color: g.color })], spacing: { before: 120, after: 60 } })
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

// ============================= Lời dẫn (Teacher Script) =============================

function buildLoiDanParagraphsEn(items) {
  const children = [];
  (items || []).forEach((it) => {
    if (!it?.loiDan) return;
    if (it.hoatDong) {
      children.push(new Paragraph({ children: [textRun(it.hoatDong, { bold: true })], spacing: { before: 100, after: 20 } }));
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

// ============================= Slide Outline =============================

function buildSlideOutlineParagraphsEn(slides) {
  const children = [];
  (slides || []).forEach((s, i) => {
    if (!s?.tieuDe && !(s?.noiDung || []).length) return;
    children.push(new Paragraph({ children: [textRun(`Slide ${i + 1}: ${s.tieuDe || ""}`, { bold: true })], spacing: { before: 100, after: 20 } }));
    (s.noiDung || []).forEach((line) => {
      children.push(
        new Paragraph({ bullet: { level: 0 }, children: [textRun(line)], spacing: { after: 20 }, indent: { left: 200 } })
      );
    });
  });
  return children;
}

// ================================== DOCX ==================================

function buildDocxSections(lessonPlan, meta, { includeTeacherScript = false } = {}) {
  const columnMode = meta?.columnMode || LESSON_PLAN_COLUMN_MODES.ONE_COLUMN;
  const timeline = Array.isArray(meta?.timeline) ? meta.timeline : [];
  const minutesByKey = Object.fromEntries(timeline.map((t) => [t.key, t.minutes]));
  const activityKeyByIndex = ["khoi_dong", "kham_pha", "luyen_tap", "van_dung"];
  // Cùng logic chuẩn hoá ranh giới tiết như bản tiếng Việt (lessonPlanExportService.js) - PHẢI
  // dùng chung để tránh lệch/lặp "Hết Tiết..." (xem normalizeActivitiesTiet() trong
  // lessonPlanTemplates.js).
  const normalizedHoatDong = normalizeActivitiesTiet(lessonPlan?.hoatDong);
  const activityStartTiets = computeActivityStartTiets(normalizedHoatDong);

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun("LESSON PLAN", { bold: true, size: 32 })],
      spacing: { after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun(lessonPlan?.tenBai || meta?.tenBai || "", { bold: true, size: 26 })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun(metaLine(meta), { italics: true, size: 22 })],
      spacing: { after: 200 },
    }),
  ];

  const yc = lessonPlan?.yeuCauCanDat || {};
  children.push(heading("I. LEARNING OBJECTIVES"));
  if (yc.kienThuc?.length) {
    children.push(paragraph("1. Knowledge", { run: { bold: true } }));
    children.push(...bulletList(yc.kienThuc));
  }
  if (yc.nangLuc?.length) {
    children.push(paragraph("2. Competencies", { run: { bold: true } }));
    children.push(...bulletList(yc.nangLuc));
  }
  if (yc.phamChat?.length) {
    children.push(paragraph("3. Qualities", { run: { bold: true } }));
    children.push(...bulletList(yc.phamChat));
  }

  const dd = lessonPlan?.doDungDayHoc || {};
  if (dd.giaoVien?.length || dd.hocSinh?.length) {
    children.push(heading("II. TEACHING AIDS"));
    if (dd.giaoVien?.length) {
      children.push(paragraph("Teacher:", { run: { bold: true } }));
      children.push(...bulletList(dd.giaoVien));
    }
    if (dd.hocSinh?.length) {
      children.push(paragraph("Student:", { run: { bold: true } }));
      children.push(...bulletList(dd.hocSinh));
    }
  }

  children.push(heading("III. LEARNING ACTIVITIES"));
  if (meta?.soTiet > 1) {
    children.push(
      new Paragraph({
        children: [
          textRun(
            `Suggested time allocation by period: ${computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType, "en")
              .map((p) => `Period ${p.period} (${p.totalMinutes}')`)
              .join(" — ")}`,
            { italics: true, size: 20, color: "9A3412" }
          ),
        ],
        spacing: { after: 80 },
      })
    );
  }
  normalizedHoatDong.forEach((activity, idx) => {
    children.push(...buildActivitySectionEn(activity, columnMode, minutesByKey[activityKeyByIndex[idx]], activityStartTiets[idx]));
  });

  if (lessonPlan?.tichHopNLS) children.push(paragraph(`Digital Competency Integration: ${lessonPlan.tichHopNLS}`));
  if (lessonPlan?.tichHopGDQPAN) {
    children.push(paragraph(`${lessonPlan.tichHopGDQPANNhan || "Integration"}: ${lessonPlan.tichHopGDQPAN}`));
  }
  if (lessonPlan?.tichHopHSKT) {
    children.push(paragraph(`Accommodations for Students with Disabilities: ${lessonPlan.tichHopHSKT}`));
  }

  if (lessonPlan?.cungCoQuestions?.length) {
    children.push(heading("Consolidation - Quick Questions"));
    lessonPlan.cungCoQuestions.forEach((q, i) => {
      children.push(paragraph(`${i + 1}. ${q.cauHoi} (Answer: ${q.dapAn})`));
    });
  }

  if (lessonPlan?.mindmap?.chuDe) {
    children.push(heading(`Mind Map: ${lessonPlan.mindmap.chuDe}`));
    (lessonPlan.mindmap.nhanh || []).forEach((n) => {
      children.push(paragraph(n.nhan, { run: { bold: true } }));
      children.push(...bulletList(n.y));
    });
  }

  children.push(heading("IV. POST-LESSON ADJUSTMENTS"));
  children.push(paragraph("............................................................................"));
  children.push(paragraph("............................................................................"));

  if (lessonPlan?.phieuHocTap?.tieuDe || lessonPlan?.phieuHocTap?.baiTap?.length) {
    children.push(appendixTitleParagraph(`APPENDIX: ${lessonPlan.phieuHocTap.tieuDe || "Student Worksheet"}`));
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
        new Paragraph({ children: [textRun(`${i + 1}. `, { bold: true }), ...multilineTextRuns(bai)], spacing: { after: 40 } })
      );
      children.push(paragraph("...................................................................................."));
      children.push(paragraph("...................................................................................."));
    });
  }

  const hasStemActivity = !!lessonPlan?.stemActivity?.tenSanPham || (lessonPlan?.stemActivity?.cacBuoc || []).length > 0;
  if (hasStemActivity) {
    children.push(
      appendixTitleParagraph(`APPENDIX: STEM GUIDE${lessonPlan.stemActivity.tenSanPham ? ` — ${lessonPlan.stemActivity.tenSanPham}` : ""}`)
    );
    children.push(appendixNoteParagraph("Students complete the product at home - teachers may print/send this section to parents."));
    children.push(...buildStemActivityParagraphsEn(lessonPlan.stemActivity));
  }

  const hasPhanHoa = PHAN_HOA_GROUPS_EN.some((g) => (lessonPlan?.baiTapPhanHoa?.[g.key] || []).length > 0);
  if (hasPhanHoa) {
    children.push(appendixTitleParagraph("APPENDIX: DIFFERENTIATED EXERCISES (3 LEVELS)"));
    children.push(...buildBaiTapPhanHoaParagraphsEn(lessonPlan.baiTapPhanHoa));
  }

  if (lessonPlan?.checklistNLPC?.length) {
    children.push(appendixTitleParagraph("APPENDIX: COMPETENCY - QUALITY ASSESSMENT CHECKLIST"));
    children.push(appendixNoteParagraph("(Teachers observe and mark directly during the lesson.)"));
    children.push(buildChecklistNLPCTableEn(lessonPlan.checklistNLPC));
    children.push(new Paragraph({ text: "" }));
  }

  // ⚠️ Tin nhắn gửi phụ huynh LUÔN bằng tiếng Việt (xem docstring đầu file) - tiêu đề giữ nguyên
  // tiếng Việt để giáo viên nhận ra ngay đây là phần COPY-PASTE cho phụ huynh, không phải lỗi
  // thiếu dịch.
  if (lessonPlan?.tinNhanPhuHuynh) {
    children.push(appendixTitleParagraph("PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)"));
    children.push(new Paragraph({ children: multilineTextRuns(lessonPlan.tinNhanPhuHuynh), spacing: { after: 120 } }));
  }

  // Chỉ chèn khi giáo viên chủ động bật cờ "Bản đầy đủ có lời dẫn" - PARITY với bản tiếng Việt
  // (lessonPlanExportService.js) - logic ẩn/hiện nằm DUY NHẤT ở đây.
  if (includeTeacherScript && lessonPlan?.loiDan?.length) {
    children.push(appendixTitleParagraph("APPENDIX: TEACHER SCRIPT"));
    children.push(appendixNoteParagraph("(Suggested transition lines for each activity - reference only.)"));
    children.push(...buildLoiDanParagraphsEn(lessonPlan.loiDan));
  }

  if (lessonPlan?.slideOutline?.length) {
    children.push(appendixTitleParagraph("APPENDIX: SLIDE OUTLINE"));
    children.push(appendixNoteParagraph("(Text outline to help build PowerPoint/Canva slides - not an actual slide file.)"));
    children.push(...buildSlideOutlineParagraphsEn(lessonPlan.slideOutline));
  }

  if (lessonPlan?.goiYHocLieuHinhAnh?.length) {
    children.push(heading("APPENDIX: Suggested Visual Material Prompts"));
    children.push(
      paragraph(
        "Keyword prompts teachers can use with image-generation tools (Canva, ChatGPT, Gemini) to create flashcards/visual aids:"
      )
    );
    children.push(...bulletList(lessonPlan.goiYHocLieuHinhAnh));
  }

  return children;
}

export function buildEnglishLessonPlanDocument(lessonPlan, meta, options = {}) {
  return new Document({
    sections: [{ properties: pageProperties, children: buildDocxSections(lessonPlan, meta, options) }],
  });
}

export async function buildEnglishLessonPlanDocxBlob(lessonPlan, meta, options = {}) {
  return buildDocxBlob(buildEnglishLessonPlanDocument(lessonPlan, meta, options));
}

export async function exportEnglishLessonPlanToWord(lessonPlan, meta, options = {}) {
  const fileBase = (lessonPlan?.tenBai || meta?.tenBai || "Lesson-Plan").trim().replace(/\s+/g, "-").slice(0, 60);
  const suffix = options.includeTeacherScript ? "-with-teacher-script" : "";
  await saveDocx(buildEnglishLessonPlanDocument(lessonPlan, meta, options), `Lesson-Plan-EN-${fileBase}${suffix}.docx`);
}

// ================================== HTML/PDF ==================================

function htmlAppendixTitle(text) {
  return `<h2 class="section-break">${text}</h2>`;
}

function htmlChecklistTable(items) {
  if (!items?.length) return "";
  const rows = items
    .map((it) => {
      const loaiLine = it.loai && LOAI_LABEL_EN[it.loai] ? `<div style="font-size:10pt;color:#94a3b8;">${LOAI_LABEL_EN[it.loai]}</div>` : "";
      return `<tr><td>${loaiLine}<strong>${it.tieuChi || ""}</strong></td><td>${it.tot || ""}</td><td>${it.dat || ""}</td><td>${
        it.canCoGang || ""
      }</td></tr>`;
    })
    .join("");
  return `<table><thead><tr><th>Criteria</th><th>Good</th><th>Satisfactory</th><th>Needs Improvement</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function htmlStemActivity(data) {
  if (!data) return "";
  let html = "";
  const vatLieu = data.vatLieu || [];
  const cacBuoc = data.cacBuoc || [];
  const tieuChi = data.tieuChiDanhGia || [];
  if (vatLieu.length) html += htmlHeading("Materials Needed", 3) + htmlBulletList(vatLieu);
  if (cacBuoc.length) html += htmlHeading("Steps", 3) + `<ol>${cacBuoc.map((b) => `<li>${(b || "").replace(/\n/g, "<br/>")}</li>`).join("")}</ol>`;
  if (tieuChi.length) html += htmlHeading("Assessment Criteria", 3) + htmlBulletList(tieuChi);
  return html;
}

function htmlBaiTapPhanHoa(data) {
  if (!data) return "";
  return PHAN_HOA_GROUPS_EN.map((g) => {
    const items = data[g.key] || [];
    if (!items.length) return "";
    return htmlHeading(g.label, 3) + `<ol>${items.map((it) => `<li>${(it || "").replace(/\n/g, "<br/>")}</li>`).join("")}</ol>`;
  }).join("");
}

function htmlLoiDan(items) {
  if (!items?.length) return "";
  return items
    .filter((it) => it?.loiDan)
    .map((it) => (it.hoatDong ? `<p><strong>${it.hoatDong}</strong><br/><em>"${it.loiDan}"</em></p>` : `<p><em>"${it.loiDan}"</em></p>`))
    .join("");
}

function htmlSlideOutline(slides) {
  if (!slides?.length) return "";
  return slides
    .filter((s) => s?.tieuDe || (s?.noiDung || []).length)
    .map((s, i) => `<h3>Slide ${i + 1}: ${s.tieuDe || ""}</h3>` + htmlBulletList(s.noiDung))
    .join("");
}

function buildHtmlBody(lessonPlan, meta, { includeTeacherScript = false } = {}) {
  const yc = lessonPlan?.yeuCauCanDat || {};
  const dd = lessonPlan?.doDungDayHoc || {};
  const columnMode = meta?.columnMode || LESSON_PLAN_COLUMN_MODES.ONE_COLUMN;
  const normalizedHoatDong = normalizeActivitiesTiet(lessonPlan?.hoatDong);

  let html = `<h1>LESSON PLAN</h1><p class="doc-meta"><strong>${lessonPlan?.tenBai || meta?.tenBai || ""}</strong><br/>${metaLine(
    meta
  )}</p>`;

  html += htmlHeading("I. Learning Objectives");
  if (yc.kienThuc?.length) html += htmlHeading("1. Knowledge", 3) + htmlBulletList(yc.kienThuc);
  if (yc.nangLuc?.length) html += htmlHeading("2. Competencies", 3) + htmlBulletList(yc.nangLuc);
  if (yc.phamChat?.length) html += htmlHeading("3. Qualities", 3) + htmlBulletList(yc.phamChat);

  if (dd.giaoVien?.length || dd.hocSinh?.length) {
    html += htmlHeading("II. Teaching Aids");
    if (dd.giaoVien?.length) html += htmlHeading("Teacher", 3) + htmlBulletList(dd.giaoVien);
    if (dd.hocSinh?.length) html += htmlHeading("Student", 3) + htmlBulletList(dd.hocSinh);
  }

  html += htmlHeading("III. Learning Activities");
  if (meta?.soTiet > 1) {
    html += htmlParagraph(
      `Suggested time allocation by period: ${computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType, "en")
        .map((p) => `Period ${p.period} (${p.totalMinutes}')`)
        .join(" — ")}`,
      "doc-meta"
    );
  }
  normalizedHoatDong.forEach((activity, idx) => {
    html += htmlHeading(`${idx + 1}. ${activity.ten || ""}`, 3);
    if (activity.mucTieu) html += htmlParagraph(`Objective: ${activity.mucTieu}`);
    const steps = Array.isArray(activity.tienTrinh) ? activity.tienTrinh : [];
    if (steps.length) {
      if (columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN) {
        html += `<table><thead><tr><th>Teacher & Student Activities</th><th>Expected Outcome</th></tr></thead><tbody>`;
        html += steps
          .map(
            (s) =>
              `<tr><td>${(s.hoatDongGVHS || "").replace(/\n/g, "<br/>")}</td><td>${(s.sanPhamDuKien || "").replace(
                /\n/g,
                "<br/>"
              )}</td></tr>`
          )
          .join("");
        html += `</tbody></table>`;
      } else {
        html += steps
          .map(
            (s, i) =>
              `<p><strong>Step ${i + 1}:</strong> ${(s.hoatDongGVHS || "").replace(/\n/g, "<br/>")}${
                s.sanPhamDuKien ? ` — <em>Expected outcome: ${s.sanPhamDuKien}</em>` : ""
              }</p>`
          )
          .join("");
      }
    }
  });

  if (lessonPlan?.tichHopNLS) html += htmlParagraph(`Digital Competency Integration: ${lessonPlan.tichHopNLS}`);
  if (lessonPlan?.tichHopGDQPAN) html += htmlParagraph(`${lessonPlan.tichHopGDQPANNhan || "Integration"}: ${lessonPlan.tichHopGDQPAN}`);
  if (lessonPlan?.tichHopHSKT) html += htmlParagraph(`Accommodations for Students with Disabilities: ${lessonPlan.tichHopHSKT}`);

  if (lessonPlan?.cungCoQuestions?.length) {
    html += htmlHeading("Consolidation - Quick Questions", 3);
    html += `<ol>${lessonPlan.cungCoQuestions.map((q) => `<li>${q.cauHoi} <strong>(Answer: ${q.dapAn})</strong></li>`).join("")}</ol>`;
  }

  if (lessonPlan?.mindmap?.chuDe) {
    html += htmlHeading(`Mind Map: ${lessonPlan.mindmap.chuDe}`, 3);
    (lessonPlan.mindmap.nhanh || []).forEach((n) => {
      html += htmlParagraph(n.nhan) + htmlBulletList(n.y);
    });
  }

  html += htmlHeading("IV. Post-Lesson Adjustments");
  html += htmlParagraph("....................................................................................");

  if (lessonPlan?.phieuHocTap?.tieuDe || lessonPlan?.phieuHocTap?.baiTap?.length) {
    html += htmlAppendixTitle(`APPENDIX: ${lessonPlan.phieuHocTap.tieuDe || "Student Worksheet"}`);
    if (lessonPlan.phieuHocTap.huongDan) html += htmlParagraph(lessonPlan.phieuHocTap.huongDan);
    html += `<ol>${(lessonPlan.phieuHocTap.baiTap || [])
      .map((b) => `<li>${(b || "").replace(/\n/g, "<br/>")}</li>`)
      .join("")}</ol>`;
  }

  const hasStemActivity = !!lessonPlan?.stemActivity?.tenSanPham || (lessonPlan?.stemActivity?.cacBuoc || []).length > 0;
  if (hasStemActivity) {
    html += htmlAppendixTitle(`APPENDIX: STEM GUIDE${lessonPlan.stemActivity.tenSanPham ? ` — ${lessonPlan.stemActivity.tenSanPham}` : ""}`);
    html += htmlParagraph("Students complete the product at home - teachers may print/send this section to parents.");
    html += htmlStemActivity(lessonPlan.stemActivity);
  }

  const hasPhanHoa = PHAN_HOA_GROUPS_EN.some((g) => (lessonPlan?.baiTapPhanHoa?.[g.key] || []).length > 0);
  if (hasPhanHoa) {
    html += htmlAppendixTitle("APPENDIX: DIFFERENTIATED EXERCISES (3 LEVELS)");
    html += htmlBaiTapPhanHoa(lessonPlan.baiTapPhanHoa);
  }

  if (lessonPlan?.checklistNLPC?.length) {
    html += htmlAppendixTitle("APPENDIX: COMPETENCY - QUALITY ASSESSMENT CHECKLIST");
    html += htmlChecklistTable(lessonPlan.checklistNLPC);
  }

  if (lessonPlan?.tinNhanPhuHuynh) {
    html += htmlAppendixTitle("PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)");
    html += htmlParagraph(lessonPlan.tinNhanPhuHuynh);
  }

  if (includeTeacherScript && lessonPlan?.loiDan?.length) {
    html += htmlAppendixTitle("APPENDIX: TEACHER SCRIPT");
    html += htmlLoiDan(lessonPlan.loiDan);
  }

  if (lessonPlan?.slideOutline?.length) {
    html += htmlAppendixTitle("APPENDIX: SLIDE OUTLINE");
    html += htmlSlideOutline(lessonPlan.slideOutline);
  }

  if (lessonPlan?.goiYHocLieuHinhAnh?.length) {
    html += htmlHeading("Appendix: Suggested Visual Material Prompts");
    html += htmlBulletList(lessonPlan.goiYHocLieuHinhAnh);
  }

  return html;
}

export function printEnglishLessonPlan(lessonPlan, meta, options = {}) {
  printHtmlDocument({
    title: `Lesson Plan - ${lessonPlan?.tenBai || meta?.tenBai || ""}`,
    bodyHtml: buildHtmlBody(lessonPlan, meta, options),
  });
}
