import { Document, Paragraph, AlignmentType, Table, TableRow, WidthType } from "docx";
import {
  pageProperties,
  saveDocx,
  buildDocxBlob,
  printHtmlDocument,
  htmlHeading,
  htmlParagraph,
  htmlBulletList,
  createLanguageHelpers,
} from "./foreignLanguageDocBuilder";
import {
  LESSON_PLAN_COLUMN_MODES,
  computeMultiPeriodTimeline,
  normalizeActivitiesTiet,
  computeActivityStartTiets,
} from "@/data/lessonPlanTemplates";

/**
 * chineseLessonPlanExportService.js
 * Xuất Word/PDF HOÀN TOÀN bằng TIẾNG TRUNG (giản thể) cho "Kế hoạch bài dạy" (Soạn Giáo Án) môn
 * Tiếng Trung (Ngoại ngữ 2) - nhân bản ĐÚNG cấu trúc englishLessonPlanExportService.js (Phiên 35-37),
 * nhận THẲNG object `lessonPlan` đã được AI SINH TRỰC TIẾP bằng tiếng Trung (cùng khoá bản gốc:
 * tenBai, yeuCauCanDat, doDungDayHoc, hoatDong, goiYHocLieuHinhAnh - xem lessonPlanPromptTemplates.js),
 * KHÔNG dịch lại. KHÔNG đụng tới lessonPlanExportService.js (tiếng Việt) hay
 * englishLessonPlanExportService.js (tiếng Anh) - đúng nguyên tắc Isolation over DRY của dự án
 * (Hoan đã chọn Hướng A ở Phiên 40 - nhân bản riêng từng ngôn ngữ, chấp nhận trùng lặp code để
 * tránh rủi ro sửa 1 nơi ảnh hưởng ngược lại các ngôn ngữ khác).
 *
 * ⚠️ FONT (khác bản tiếng Anh/Pháp): dùng `createLanguageHelpers()` (foreignLanguageDocBuilder.js)
 * thay vì import thẳng textRun/paragraph/heading/bulletList/cell - vì "Times New Roman" không có
 * glyph chữ Hán, phải gắn thêm `eastAsia: "SimSun"` để Word hiển thị đúng (không hiện ô vuông
 * trống). Bản in PDF (`printHtmlDocument`) cũng truyền `fontFamily` riêng có font hệ thống chữ Hán.
 *
 * ⚠️ Phụ lục "Tin nhắn gửi phụ huynh" (`lessonPlan.tinNhanPhuHuynh`) LUÔN được AI viết bằng TIẾNG
 * VIỆT dù giáo án còn lại bằng tiếng Trung (xem exemptJsonFields ở buildForeignLanguageOutputDirective
 * - foreignLanguageSubjects.js) - tiêu đề phụ lục này GIỮ NGUYÊN tiếng Việt (không dịch), đúng quy
 * ước đã áp dụng cho bản tiếng Anh.
 */

const FONT_ZH = { ascii: "Times New Roman", hAnsi: "Times New Roman", cs: "Times New Roman", eastAsia: "SimSun" };
const PRINT_FONT_FAMILY_ZH = '"SimSun", "Microsoft YaHei", "PingFang SC", "Times New Roman", serif';

const { textRun, multilineTextRuns, paragraph, heading, bulletList, cell } = createLanguageHelpers(FONT_ZH);

function metaLine(meta) {
  const parts = [];
  if (meta?.subjectLabelEn) parts.push(`科目：${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") parts.push(`年级：${meta.grade}`);
  if (meta?.soTiet) parts.push(`课时数：${meta.soTiet}`);
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

function periodBoundaryParagraphZh(tiet) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      textRun(`── 第 ${tiet - 1} 课时结束（课间休息）— 进入第 ${tiet} 课时 ──`, {
        bold: true,
        size: 20,
        color: "9A3412",
      }),
    ],
    spacing: { before: 120, after: 120 },
  });
}

// Đúng khuôn periodBoundaryTableRowEn() (englishLessonPlanExportService.js, sửa Phiên 37) -
// opts.children PHẢI là mảng TextRun, KHÔNG BAO GIỜ truyền nguyên 1 Paragraph vào cell() (tránh
// lặp lại lỗi "<w:p>" lồng "<w:p>" khiến MS Word từ chối mở file).
function periodBoundaryTableRowZh(tiet) {
  return new TableRow({
    children: [
      cell(null, 100, {
        columnSpan: 2,
        alignment: AlignmentType.CENTER,
        children: [
          textRun(`── 第 ${tiet - 1} 课时结束（课间休息）— 进入第 ${tiet} 课时 ──`, {
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

function buildTwoColumnActivityTableZh(steps, startTiet) {
  const headerRow = [
    cell("教师与学生活动", 60, { bold: true }),
    cell("预期成果", 40, { bold: true }),
  ];
  let lastTiet = startTiet || null;
  const rowsWithBoundaries = [];
  (steps || []).forEach((s, i) => {
    const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
    lastTiet = s.tiet || lastTiet;
    if (showBoundary) rowsWithBoundaries.push(periodBoundaryTableRowZh(s.tiet));
    rowsWithBoundaries.push(
      new TableRow({
        children: [
          cell(null, 60, {
            children: [textRun(`步骤 ${i + 1}：`, { bold: true }), ...multilineTextRuns(s.hoatDongGVHS)],
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

function buildOneColumnActivityParagraphsZh(steps, startTiet) {
  let lastTiet = startTiet || null;
  return (steps || []).flatMap((s, i) => {
    const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
    lastTiet = s.tiet || lastTiet;
    return [
      ...(showBoundary ? [periodBoundaryParagraphZh(s.tiet)] : []),
      new Paragraph({
        children: [textRun(`步骤 ${i + 1}：`, { bold: true }), ...multilineTextRuns(s.hoatDongGVHS)],
        spacing: { after: 40 },
      }),
      ...(s.sanPhamDuKien
        ? [
            new Paragraph({
              children: [textRun(`预期成果：${s.sanPhamDuKien}`, { italics: true })],
              spacing: { after: 120 },
              indent: { left: 200 },
            }),
          ]
        : []),
    ];
  });
}

function buildActivitySectionZh(activity, columnMode, minutes, startTiet) {
  const titleSuffix = minutes ? `（约 ${minutes} 分钟）` : "";
  const children = [
    new Paragraph({
      children: [textRun(`${activity.ten || ""}${titleSuffix}`, { bold: true, size: 24 })],
      spacing: { before: 150, after: 60 },
    }),
  ];
  if (activity.mucTieu) {
    children.push(
      new Paragraph({ children: [textRun(`目标：${activity.mucTieu}`, { italics: true })], spacing: { after: 80 } })
    );
  }
  const steps = Array.isArray(activity.tienTrinh) ? activity.tienTrinh : [];
  if (steps.length) {
    if (columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN) {
      children.push(buildTwoColumnActivityTableZh(steps, startTiet));
      children.push(new Paragraph({ text: "" }));
    } else {
      children.push(...buildOneColumnActivityParagraphsZh(steps, startTiet));
    }
  }
  return children;
}

// ============================= Checklist NL-PC (Competency-Quality) =============================

const LOAI_LABEL_ZH = { nang_luc: "能力", pham_chat: "品质" };

function buildChecklistNLPCTableZh(items) {
  const headerRow = new TableRow({
    children: [
      cell("评价标准", 28, { bold: true }),
      cell("优秀", 24, { bold: true }),
      cell("达标", 24, { bold: true }),
      cell("待努力", 24, { bold: true }),
    ],
  });
  const bodyRows = (items || []).map((it) => {
    const loaiLine = it.loai && LOAI_LABEL_ZH[it.loai] ? LOAI_LABEL_ZH[it.loai] : null;
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

function buildStemActivityParagraphsZh(data) {
  const children = [];
  const vatLieu = data?.vatLieu || [];
  const cacBuoc = data?.cacBuoc || [];
  const tieuChi = data?.tieuChiDanhGia || [];
  if (vatLieu.length > 0) {
    children.push(
      new Paragraph({ children: [textRun("所需材料", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
    );
    children.push(...bulletList(vatLieu));
  }
  if (cacBuoc.length > 0) {
    children.push(
      new Paragraph({ children: [textRun("步骤", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
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
      new Paragraph({ children: [textRun("评价标准", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
    );
    children.push(...bulletList(tieuChi));
  }
  return children;
}

// ============================= Differentiated Exercises (3 levels) =============================

const PHAN_HOA_GROUPS_ZH = [
  { key: "hoTro", label: "第一层 — 辅助", color: "0369A1" },
  { key: "datChuan", label: "第二层 — 达标", color: "15803D" },
  { key: "nangCao", label: "第三层 — 提高", color: "B45309" },
];

function buildBaiTapPhanHoaParagraphsZh(data) {
  const children = [];
  PHAN_HOA_GROUPS_ZH.forEach((g) => {
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

function buildLoiDanParagraphsZh(items) {
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

function buildSlideOutlineParagraphsZh(slides) {
  const children = [];
  (slides || []).forEach((s, i) => {
    if (!s?.tieuDe && !(s?.noiDung || []).length) return;
    children.push(new Paragraph({ children: [textRun(`幻灯片 ${i + 1}：${s.tieuDe || ""}`, { bold: true })], spacing: { before: 100, after: 20 } }));
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
  const normalizedHoatDong = normalizeActivitiesTiet(lessonPlan?.hoatDong);
  const activityStartTiets = computeActivityStartTiets(normalizedHoatDong);

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun("教案", { bold: true, size: 32 })],
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
  children.push(heading("一、学习目标"));
  if (yc.kienThuc?.length) {
    children.push(paragraph("1. 知识", { run: { bold: true } }));
    children.push(...bulletList(yc.kienThuc));
  }
  if (yc.nangLuc?.length) {
    children.push(paragraph("2. 能力", { run: { bold: true } }));
    children.push(...bulletList(yc.nangLuc));
  }
  if (yc.phamChat?.length) {
    children.push(paragraph("3. 品质", { run: { bold: true } }));
    children.push(...bulletList(yc.phamChat));
  }

  const dd = lessonPlan?.doDungDayHoc || {};
  if (dd.giaoVien?.length || dd.hocSinh?.length) {
    children.push(heading("二、教学准备"));
    if (dd.giaoVien?.length) {
      children.push(paragraph("教师：", { run: { bold: true } }));
      children.push(...bulletList(dd.giaoVien));
    }
    if (dd.hocSinh?.length) {
      children.push(paragraph("学生：", { run: { bold: true } }));
      children.push(...bulletList(dd.hocSinh));
    }
  }

  children.push(heading("三、学习活动"));
  if (meta?.soTiet > 1) {
    children.push(
      new Paragraph({
        children: [
          textRun(
            `各课时建议时间分配：${computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType, "zh")
              .map((p) => `第 ${p.period} 课时（${p.totalMinutes} 分钟）`)
              .join(" — ")}`,
            { italics: true, size: 20, color: "9A3412" }
          ),
        ],
        spacing: { after: 80 },
      })
    );
  }
  normalizedHoatDong.forEach((activity, idx) => {
    children.push(...buildActivitySectionZh(activity, columnMode, minutesByKey[activityKeyByIndex[idx]], activityStartTiets[idx]));
  });

  if (lessonPlan?.tichHopNLS) children.push(paragraph(`数字素养融入：${lessonPlan.tichHopNLS}`));
  if (lessonPlan?.tichHopGDQPAN) {
    children.push(paragraph(`${lessonPlan.tichHopGDQPANNhan || "融入"}：${lessonPlan.tichHopGDQPAN}`));
  }
  if (lessonPlan?.tichHopHSKT) {
    children.push(paragraph(`残障学生教学调整：${lessonPlan.tichHopHSKT}`));
  }

  if (lessonPlan?.cungCoQuestions?.length) {
    children.push(heading("巩固练习 - 快速问答"));
    lessonPlan.cungCoQuestions.forEach((q, i) => {
      children.push(paragraph(`${i + 1}. ${q.cauHoi}（答案：${q.dapAn}）`));
    });
  }

  if (lessonPlan?.mindmap?.chuDe) {
    children.push(heading(`思维导图：${lessonPlan.mindmap.chuDe}`));
    (lessonPlan.mindmap.nhanh || []).forEach((n) => {
      children.push(paragraph(n.nhan, { run: { bold: true } }));
      children.push(...bulletList(n.y));
    });
  }

  children.push(heading("四、课后调整"));
  children.push(paragraph("............................................................................"));
  children.push(paragraph("............................................................................"));

  if (lessonPlan?.phieuHocTap?.tieuDe || lessonPlan?.phieuHocTap?.baiTap?.length) {
    children.push(appendixTitleParagraph(`附录：${lessonPlan.phieuHocTap.tieuDe || "学生学习单"}`));
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
      appendixTitleParagraph(`附录：STEM 活动指南${lessonPlan.stemActivity.tenSanPham ? ` — ${lessonPlan.stemActivity.tenSanPham}` : ""}`)
    );
    children.push(appendixNoteParagraph("学生在家完成作品 - 教师可打印/发送此部分给家长。"));
    children.push(...buildStemActivityParagraphsZh(lessonPlan.stemActivity));
  }

  const hasPhanHoa = PHAN_HOA_GROUPS_ZH.some((g) => (lessonPlan?.baiTapPhanHoa?.[g.key] || []).length > 0);
  if (hasPhanHoa) {
    children.push(appendixTitleParagraph("附录：分层练习（三个层次）"));
    children.push(...buildBaiTapPhanHoaParagraphsZh(lessonPlan.baiTapPhanHoa));
  }

  if (lessonPlan?.checklistNLPC?.length) {
    children.push(appendixTitleParagraph("附录：能力-品质评价表"));
    children.push(appendixNoteParagraph("（教师在课堂中直接观察并打分。）"));
    children.push(buildChecklistNLPCTableZh(lessonPlan.checklistNLPC));
    children.push(new Paragraph({ text: "" }));
  }

  // ⚠️ Tin nhắn gửi phụ huynh LUÔN bằng tiếng Việt (xem docstring đầu file) - tiêu đề giữ nguyên
  // tiếng Việt, KHÔNG dịch sang tiếng Trung.
  if (lessonPlan?.tinNhanPhuHuynh) {
    children.push(appendixTitleParagraph("PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)"));
    children.push(new Paragraph({ children: multilineTextRuns(lessonPlan.tinNhanPhuHuynh), spacing: { after: 120 } }));
  }

  if (includeTeacherScript && lessonPlan?.loiDan?.length) {
    children.push(appendixTitleParagraph("附录：教师讲稿"));
    children.push(appendixNoteParagraph("（各环节参考过渡语，仅供参考。）"));
    children.push(...buildLoiDanParagraphsZh(lessonPlan.loiDan));
  }

  if (lessonPlan?.slideOutline?.length) {
    children.push(appendixTitleParagraph("附录：幻灯片大纲"));
    children.push(appendixNoteParagraph("（用于制作 PowerPoint/Canva 幻灯片的文字大纲，非实际幻灯片文件。）"));
    children.push(...buildSlideOutlineParagraphsZh(lessonPlan.slideOutline));
  }

  if (lessonPlan?.goiYHocLieuHinhAnh?.length) {
    children.push(heading("附录：配图关键词建议"));
    children.push(
      paragraph("教师可使用以下关键词与 AI 绘图工具（Canva、ChatGPT、Gemini）制作识字卡/教具图片：")
    );
    children.push(...bulletList(lessonPlan.goiYHocLieuHinhAnh));
  }

  return children;
}

export function buildChineseLessonPlanDocument(lessonPlan, meta, options = {}) {
  return new Document({
    sections: [{ properties: pageProperties, children: buildDocxSections(lessonPlan, meta, options) }],
  });
}

export async function buildChineseLessonPlanDocxBlob(lessonPlan, meta, options = {}) {
  return buildDocxBlob(buildChineseLessonPlanDocument(lessonPlan, meta, options));
}

export async function exportChineseLessonPlanToWord(lessonPlan, meta, options = {}) {
  const fileBase = (lessonPlan?.tenBai || meta?.tenBai || "Lesson-Plan").trim().replace(/\s+/g, "-").slice(0, 60);
  const suffix = options.includeTeacherScript ? "-with-teacher-script" : "";
  await saveDocx(buildChineseLessonPlanDocument(lessonPlan, meta, options), `Lesson-Plan-ZH-${fileBase}${suffix}.docx`);
}

// ================================== HTML/PDF ==================================

function htmlAppendixTitle(text) {
  return `<h2 class="section-break">${text}</h2>`;
}

function htmlChecklistTable(items) {
  if (!items?.length) return "";
  const rows = items
    .map((it) => {
      const loaiLine = it.loai && LOAI_LABEL_ZH[it.loai] ? `<div style="font-size:10pt;color:#94a3b8;">${LOAI_LABEL_ZH[it.loai]}</div>` : "";
      return `<tr><td>${loaiLine}<strong>${it.tieuChi || ""}</strong></td><td>${it.tot || ""}</td><td>${it.dat || ""}</td><td>${
        it.canCoGang || ""
      }</td></tr>`;
    })
    .join("");
  return `<table><thead><tr><th>评价标准</th><th>优秀</th><th>达标</th><th>待努力</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function htmlStemActivity(data) {
  if (!data) return "";
  let html = "";
  const vatLieu = data.vatLieu || [];
  const cacBuoc = data.cacBuoc || [];
  const tieuChi = data.tieuChiDanhGia || [];
  if (vatLieu.length) html += htmlHeading("所需材料", 3) + htmlBulletList(vatLieu);
  if (cacBuoc.length) html += htmlHeading("步骤", 3) + `<ol>${cacBuoc.map((b) => `<li>${(b || "").replace(/\n/g, "<br/>")}</li>`).join("")}</ol>`;
  if (tieuChi.length) html += htmlHeading("评价标准", 3) + htmlBulletList(tieuChi);
  return html;
}

function htmlBaiTapPhanHoa(data) {
  if (!data) return "";
  return PHAN_HOA_GROUPS_ZH.map((g) => {
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
    .map((s, i) => `<h3>幻灯片 ${i + 1}：${s.tieuDe || ""}</h3>` + htmlBulletList(s.noiDung))
    .join("");
}

function buildHtmlBody(lessonPlan, meta, { includeTeacherScript = false } = {}) {
  const yc = lessonPlan?.yeuCauCanDat || {};
  const dd = lessonPlan?.doDungDayHoc || {};
  const columnMode = meta?.columnMode || LESSON_PLAN_COLUMN_MODES.ONE_COLUMN;
  const normalizedHoatDong = normalizeActivitiesTiet(lessonPlan?.hoatDong);

  let html = `<h1>教案</h1><p class="doc-meta"><strong>${lessonPlan?.tenBai || meta?.tenBai || ""}</strong><br/>${metaLine(
    meta
  )}</p>`;

  html += htmlHeading("一、学习目标");
  if (yc.kienThuc?.length) html += htmlHeading("1. 知识", 3) + htmlBulletList(yc.kienThuc);
  if (yc.nangLuc?.length) html += htmlHeading("2. 能力", 3) + htmlBulletList(yc.nangLuc);
  if (yc.phamChat?.length) html += htmlHeading("3. 品质", 3) + htmlBulletList(yc.phamChat);

  if (dd.giaoVien?.length || dd.hocSinh?.length) {
    html += htmlHeading("二、教学准备");
    if (dd.giaoVien?.length) html += htmlHeading("教师", 3) + htmlBulletList(dd.giaoVien);
    if (dd.hocSinh?.length) html += htmlHeading("学生", 3) + htmlBulletList(dd.hocSinh);
  }

  html += htmlHeading("三、学习活动");
  if (meta?.soTiet > 1) {
    html += htmlParagraph(
      `各课时建议时间分配：${computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType, "zh")
        .map((p) => `第 ${p.period} 课时（${p.totalMinutes} 分钟）`)
        .join(" — ")}`,
      "doc-meta"
    );
  }
  normalizedHoatDong.forEach((activity, idx) => {
    html += htmlHeading(`${idx + 1}. ${activity.ten || ""}`, 3);
    if (activity.mucTieu) html += htmlParagraph(`目标：${activity.mucTieu}`);
    const steps = Array.isArray(activity.tienTrinh) ? activity.tienTrinh : [];
    if (steps.length) {
      if (columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN) {
        html += `<table><thead><tr><th>教师与学生活动</th><th>预期成果</th></tr></thead><tbody>`;
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
              `<p><strong>步骤 ${i + 1}：</strong>${(s.hoatDongGVHS || "").replace(/\n/g, "<br/>")}${
                s.sanPhamDuKien ? ` — <em>预期成果：${s.sanPhamDuKien}</em>` : ""
              }</p>`
          )
          .join("");
      }
    }
  });

  if (lessonPlan?.tichHopNLS) html += htmlParagraph(`数字素养融入：${lessonPlan.tichHopNLS}`);
  if (lessonPlan?.tichHopGDQPAN) html += htmlParagraph(`${lessonPlan.tichHopGDQPANNhan || "融入"}：${lessonPlan.tichHopGDQPAN}`);
  if (lessonPlan?.tichHopHSKT) html += htmlParagraph(`残障学生教学调整：${lessonPlan.tichHopHSKT}`);

  if (lessonPlan?.cungCoQuestions?.length) {
    html += htmlHeading("巩固练习 - 快速问答", 3);
    html += `<ol>${lessonPlan.cungCoQuestions.map((q) => `<li>${q.cauHoi} <strong>（答案：${q.dapAn}）</strong></li>`).join("")}</ol>`;
  }

  if (lessonPlan?.mindmap?.chuDe) {
    html += htmlHeading(`思维导图：${lessonPlan.mindmap.chuDe}`, 3);
    (lessonPlan.mindmap.nhanh || []).forEach((n) => {
      html += htmlParagraph(n.nhan) + htmlBulletList(n.y);
    });
  }

  html += htmlHeading("四、课后调整");
  html += htmlParagraph("....................................................................................");

  if (lessonPlan?.phieuHocTap?.tieuDe || lessonPlan?.phieuHocTap?.baiTap?.length) {
    html += htmlAppendixTitle(`附录：${lessonPlan.phieuHocTap.tieuDe || "学生学习单"}`);
    if (lessonPlan.phieuHocTap.huongDan) html += htmlParagraph(lessonPlan.phieuHocTap.huongDan);
    html += `<ol>${(lessonPlan.phieuHocTap.baiTap || [])
      .map((b) => `<li>${(b || "").replace(/\n/g, "<br/>")}</li>`)
      .join("")}</ol>`;
  }

  const hasStemActivity = !!lessonPlan?.stemActivity?.tenSanPham || (lessonPlan?.stemActivity?.cacBuoc || []).length > 0;
  if (hasStemActivity) {
    html += htmlAppendixTitle(`附录：STEM 活动指南${lessonPlan.stemActivity.tenSanPham ? ` — ${lessonPlan.stemActivity.tenSanPham}` : ""}`);
    html += htmlParagraph("学生在家完成作品 - 教师可打印/发送此部分给家长。");
    html += htmlStemActivity(lessonPlan.stemActivity);
  }

  const hasPhanHoa = PHAN_HOA_GROUPS_ZH.some((g) => (lessonPlan?.baiTapPhanHoa?.[g.key] || []).length > 0);
  if (hasPhanHoa) {
    html += htmlAppendixTitle("附录：分层练习（三个层次）");
    html += htmlBaiTapPhanHoa(lessonPlan.baiTapPhanHoa);
  }

  if (lessonPlan?.checklistNLPC?.length) {
    html += htmlAppendixTitle("附录：能力-品质评价表");
    html += htmlChecklistTable(lessonPlan.checklistNLPC);
  }

  if (lessonPlan?.tinNhanPhuHuynh) {
    html += htmlAppendixTitle("PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)");
    html += htmlParagraph(lessonPlan.tinNhanPhuHuynh);
  }

  if (includeTeacherScript && lessonPlan?.loiDan?.length) {
    html += htmlAppendixTitle("附录：教师讲稿");
    html += htmlLoiDan(lessonPlan.loiDan);
  }

  if (lessonPlan?.slideOutline?.length) {
    html += htmlAppendixTitle("附录：幻灯片大纲");
    html += htmlSlideOutline(lessonPlan.slideOutline);
  }

  if (lessonPlan?.goiYHocLieuHinhAnh?.length) {
    html += htmlHeading("附录：配图关键词建议");
    html += htmlBulletList(lessonPlan.goiYHocLieuHinhAnh);
  }

  return html;
}

export function printChineseLessonPlan(lessonPlan, meta, options = {}) {
  printHtmlDocument({
    title: `教案 - ${lessonPlan?.tenBai || meta?.tenBai || ""}`,
    bodyHtml: buildHtmlBody(lessonPlan, meta, options),
    fontFamily: PRINT_FONT_FAMILY_ZH,
  });
}
