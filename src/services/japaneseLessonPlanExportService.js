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
 * japaneseLessonPlanExportService.js
 * Xuất Word/PDF HOÀN TOÀN bằng TIẾNG NHẬT cho "Kế hoạch bài dạy" (Soạn Giáo Án) môn Tiếng Nhật
 * (Ngoại ngữ 2) - nhân bản ĐÚNG cấu trúc englishLessonPlanExportService.js/
 * chineseLessonPlanExportService.js, nhận THẲNG object `lessonPlan` đã được AI SINH TRỰC TIẾP bằng
 * tiếng Nhật (cùng khoá bản gốc: tenBai, yeuCauCanDat, doDungDayHoc, hoatDong,
 * goiYHocLieuHinhAnh), KHÔNG dịch lại. KHÔNG đụng tới các bản ngôn ngữ khác - đúng nguyên tắc
 * Isolation over DRY (Hoan chọn Hướng A ở Phiên 40).
 *
 * ⚠️ FONT: dùng `createLanguageHelpers()` (foreignLanguageDocBuilder.js) với
 * `eastAsia: "MS Mincho"` - "Times New Roman" không có glyph Kanji/Hiragana/Katakana. Bản in PDF
 * (`printHtmlDocument`) cũng truyền `fontFamily` riêng có font hệ thống tiếng Nhật.
 *
 * ⚠️ Phụ lục "Tin nhắn gửi phụ huynh" (`lessonPlan.tinNhanPhuHuynh`) LUÔN được AI viết bằng TIẾNG
 * VIỆT (xem exemptJsonFields - foreignLanguageSubjects.js) - tiêu đề phụ lục GIỮ NGUYÊN tiếng Việt.
 */

const FONT_JA = { ascii: "Times New Roman", hAnsi: "Times New Roman", cs: "Times New Roman", eastAsia: "MS Mincho" };
const PRINT_FONT_FAMILY_JA = '"MS Mincho", "Yu Mincho", "Hiragino Mincho ProN", "Times New Roman", serif';

const { textRun, multilineTextRuns, paragraph, heading, bulletList, cell } = createLanguageHelpers(FONT_JA);

function metaLine(meta) {
  const parts = [];
  if (meta?.subjectLabelEn) parts.push(`教科：${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") parts.push(`学年：${meta.grade}`);
  if (meta?.soTiet) parts.push(`時数：${meta.soTiet}`);
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

function periodBoundaryParagraphJa(tiet) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      textRun(`── 第${tiet - 1}時限終了（休憩）— 第${tiet}時限へ ──`, {
        bold: true,
        size: 20,
        color: "9A3412",
      }),
    ],
    spacing: { before: 120, after: 120 },
  });
}

// Đúng khuôn periodBoundaryTableRowEn()/periodBoundaryTableRowZh() (sửa lỗi Phiên 37) -
// opts.children PHẢI là mảng TextRun, KHÔNG BAO GIỜ truyền nguyên 1 Paragraph vào cell().
function periodBoundaryTableRowJa(tiet) {
  return new TableRow({
    children: [
      cell(null, 100, {
        columnSpan: 2,
        alignment: AlignmentType.CENTER,
        children: [
          textRun(`── 第${tiet - 1}時限終了（休憩）— 第${tiet}時限へ ──`, {
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

function buildTwoColumnActivityTableJa(steps, startTiet) {
  const headerRow = [
    cell("教師と生徒の活動", 60, { bold: true }),
    cell("期待される成果", 40, { bold: true }),
  ];
  let lastTiet = startTiet || null;
  const rowsWithBoundaries = [];
  (steps || []).forEach((s, i) => {
    const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
    lastTiet = s.tiet || lastTiet;
    if (showBoundary) rowsWithBoundaries.push(periodBoundaryTableRowJa(s.tiet));
    rowsWithBoundaries.push(
      new TableRow({
        children: [
          cell(null, 60, {
            children: [textRun(`ステップ${i + 1}：`, { bold: true }), ...multilineTextRuns(s.hoatDongGVHS)],
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

function buildOneColumnActivityParagraphsJa(steps, startTiet) {
  let lastTiet = startTiet || null;
  return (steps || []).flatMap((s, i) => {
    const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
    lastTiet = s.tiet || lastTiet;
    return [
      ...(showBoundary ? [periodBoundaryParagraphJa(s.tiet)] : []),
      new Paragraph({
        children: [textRun(`ステップ${i + 1}：`, { bold: true }), ...multilineTextRuns(s.hoatDongGVHS)],
        spacing: { after: 40 },
      }),
      ...(s.sanPhamDuKien
        ? [
            new Paragraph({
              children: [textRun(`期待される成果：${s.sanPhamDuKien}`, { italics: true })],
              spacing: { after: 120 },
              indent: { left: 200 },
            }),
          ]
        : []),
    ];
  });
}

function buildActivitySectionJa(activity, columnMode, minutes, startTiet) {
  const titleSuffix = minutes ? `（約${minutes}分）` : "";
  const children = [
    new Paragraph({
      children: [textRun(`${activity.ten || ""}${titleSuffix}`, { bold: true, size: 24 })],
      spacing: { before: 150, after: 60 },
    }),
  ];
  if (activity.mucTieu) {
    children.push(
      new Paragraph({ children: [textRun(`目標：${activity.mucTieu}`, { italics: true })], spacing: { after: 80 } })
    );
  }
  const steps = Array.isArray(activity.tienTrinh) ? activity.tienTrinh : [];
  if (steps.length) {
    if (columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN) {
      children.push(buildTwoColumnActivityTableJa(steps, startTiet));
      children.push(new Paragraph({ text: "" }));
    } else {
      children.push(...buildOneColumnActivityParagraphsJa(steps, startTiet));
    }
  }
  return children;
}

// ============================= Checklist NL-PC (Competency-Quality) =============================

const LOAI_LABEL_JA = { nang_luc: "能力", pham_chat: "資質・態度" };

function buildChecklistNLPCTableJa(items) {
  const headerRow = new TableRow({
    children: [
      cell("評価基準", 28, { bold: true }),
      cell("よくできる", 24, { bold: true }),
      cell("できる", 24, { bold: true }),
      cell("要努力", 24, { bold: true }),
    ],
  });
  const bodyRows = (items || []).map((it) => {
    const loaiLine = it.loai && LOAI_LABEL_JA[it.loai] ? LOAI_LABEL_JA[it.loai] : null;
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

function buildStemActivityParagraphsJa(data) {
  const children = [];
  const vatLieu = data?.vatLieu || [];
  const cacBuoc = data?.cacBuoc || [];
  const tieuChi = data?.tieuChiDanhGia || [];
  if (vatLieu.length > 0) {
    children.push(
      new Paragraph({ children: [textRun("必要な材料", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
    );
    children.push(...bulletList(vatLieu));
  }
  if (cacBuoc.length > 0) {
    children.push(
      new Paragraph({ children: [textRun("手順", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
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
      new Paragraph({ children: [textRun("評価基準", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
    );
    children.push(...bulletList(tieuChi));
  }
  return children;
}

// ============================= Differentiated Exercises (3 levels) =============================

const PHAN_HOA_GROUPS_JA = [
  { key: "hoTro", label: "レベル1 — 支援", color: "0369A1" },
  { key: "datChuan", label: "レベル2 — 標準", color: "15803D" },
  { key: "nangCao", label: "レベル3 — 発展", color: "B45309" },
];

function buildBaiTapPhanHoaParagraphsJa(data) {
  const children = [];
  PHAN_HOA_GROUPS_JA.forEach((g) => {
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

function buildLoiDanParagraphsJa(items) {
  const children = [];
  (items || []).forEach((it) => {
    if (!it?.loiDan) return;
    if (it.hoatDong) {
      children.push(new Paragraph({ children: [textRun(it.hoatDong, { bold: true })], spacing: { before: 100, after: 20 } }));
    }
    children.push(
      new Paragraph({
        children: [textRun(`「${it.loiDan}」`, { italics: true })],
        spacing: { after: 80 },
        indent: { left: 200 },
      })
    );
  });
  return children;
}

// ============================= Slide Outline =============================

function buildSlideOutlineParagraphsJa(slides) {
  const children = [];
  (slides || []).forEach((s, i) => {
    if (!s?.tieuDe && !(s?.noiDung || []).length) return;
    children.push(new Paragraph({ children: [textRun(`スライド${i + 1}：${s.tieuDe || ""}`, { bold: true })], spacing: { before: 100, after: 20 } }));
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
      children: [textRun("学習指導案", { bold: true, size: 32 })],
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
  children.push(heading("一、学習目標"));
  if (yc.kienThuc?.length) {
    children.push(paragraph("1. 知識", { run: { bold: true } }));
    children.push(...bulletList(yc.kienThuc));
  }
  if (yc.nangLuc?.length) {
    children.push(paragraph("2. 能力", { run: { bold: true } }));
    children.push(...bulletList(yc.nangLuc));
  }
  if (yc.phamChat?.length) {
    children.push(paragraph("3. 資質・態度", { run: { bold: true } }));
    children.push(...bulletList(yc.phamChat));
  }

  const dd = lessonPlan?.doDungDayHoc || {};
  if (dd.giaoVien?.length || dd.hocSinh?.length) {
    children.push(heading("二、教具・教材"));
    if (dd.giaoVien?.length) {
      children.push(paragraph("教師：", { run: { bold: true } }));
      children.push(...bulletList(dd.giaoVien));
    }
    if (dd.hocSinh?.length) {
      children.push(paragraph("生徒：", { run: { bold: true } }));
      children.push(...bulletList(dd.hocSinh));
    }
  }

  children.push(heading("三、学習活動"));
  if (meta?.soTiet > 1) {
    children.push(
      new Paragraph({
        children: [
          textRun(
            `時限ごとの時間配分（目安）：${computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType, "ja")
              .map((p) => `第${p.period}時限（${p.totalMinutes}分）`)
              .join(" — ")}`,
            { italics: true, size: 20, color: "9A3412" }
          ),
        ],
        spacing: { after: 80 },
      })
    );
  }
  normalizedHoatDong.forEach((activity, idx) => {
    children.push(...buildActivitySectionJa(activity, columnMode, minutesByKey[activityKeyByIndex[idx]], activityStartTiets[idx]));
  });

  if (lessonPlan?.tichHopNLS) children.push(paragraph(`情報活用能力の統合：${lessonPlan.tichHopNLS}`));
  if (lessonPlan?.tichHopGDQPAN) {
    children.push(paragraph(`${lessonPlan.tichHopGDQPANNhan || "統合"}：${lessonPlan.tichHopGDQPAN}`));
  }
  if (lessonPlan?.tichHopHSKT) {
    children.push(paragraph(`障がいのある生徒への配慮：${lessonPlan.tichHopHSKT}`));
  }

  if (lessonPlan?.cungCoQuestions?.length) {
    children.push(heading("まとめ - 確認問題"));
    lessonPlan.cungCoQuestions.forEach((q, i) => {
      children.push(paragraph(`${i + 1}. ${q.cauHoi}（答え：${q.dapAn}）`));
    });
  }

  if (lessonPlan?.mindmap?.chuDe) {
    children.push(heading(`マインドマップ：${lessonPlan.mindmap.chuDe}`));
    (lessonPlan.mindmap.nhanh || []).forEach((n) => {
      children.push(paragraph(n.nhan, { run: { bold: true } }));
      children.push(...bulletList(n.y));
    });
  }

  children.push(heading("四、授業後の振り返り"));
  children.push(paragraph("............................................................................"));
  children.push(paragraph("............................................................................"));

  if (lessonPlan?.phieuHocTap?.tieuDe || lessonPlan?.phieuHocTap?.baiTap?.length) {
    children.push(appendixTitleParagraph(`資料：${lessonPlan.phieuHocTap.tieuDe || "学習プリント"}`));
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
      appendixTitleParagraph(`資料：STEM活動ガイド${lessonPlan.stemActivity.tenSanPham ? ` — ${lessonPlan.stemActivity.tenSanPham}` : ""}`)
    );
    children.push(appendixNoteParagraph("生徒は家庭で作品を完成させます。教師はこの部分を印刷して保護者に配布できます。"));
    children.push(...buildStemActivityParagraphsJa(lessonPlan.stemActivity));
  }

  const hasPhanHoa = PHAN_HOA_GROUPS_JA.some((g) => (lessonPlan?.baiTapPhanHoa?.[g.key] || []).length > 0);
  if (hasPhanHoa) {
    children.push(appendixTitleParagraph("資料：習熟度別練習問題（3段階）"));
    children.push(...buildBaiTapPhanHoaParagraphsJa(lessonPlan.baiTapPhanHoa));
  }

  if (lessonPlan?.checklistNLPC?.length) {
    children.push(appendixTitleParagraph("資料：資質・能力評価チェックリスト"));
    children.push(appendixNoteParagraph("（授業中に教師が観察し、直接記入します。）"));
    children.push(buildChecklistNLPCTableJa(lessonPlan.checklistNLPC));
    children.push(new Paragraph({ text: "" }));
  }

  // ⚠️ Tin nhắn gửi phụ huynh LUÔN bằng tiếng Việt (xem docstring đầu file) - tiêu đề giữ nguyên
  // tiếng Việt, KHÔNG dịch sang tiếng Nhật.
  if (lessonPlan?.tinNhanPhuHuynh) {
    children.push(appendixTitleParagraph("PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)"));
    children.push(new Paragraph({ children: multilineTextRuns(lessonPlan.tinNhanPhuHuynh), spacing: { after: 120 } }));
  }

  if (includeTeacherScript && lessonPlan?.loiDan?.length) {
    children.push(appendixTitleParagraph("資料：教師用スクリプト"));
    children.push(appendixNoteParagraph("（各活動の参考となる声かけ例です。参考用。）"));
    children.push(...buildLoiDanParagraphsJa(lessonPlan.loiDan));
  }

  if (lessonPlan?.slideOutline?.length) {
    children.push(appendixTitleParagraph("資料：スライド構成案"));
    children.push(appendixNoteParagraph("（PowerPoint/Canvaのスライド作成を助ける文章構成案です。実際のスライドファイルではありません。）"));
    children.push(...buildSlideOutlineParagraphsJa(lessonPlan.slideOutline));
  }

  if (lessonPlan?.goiYHocLieuHinhAnh?.length) {
    children.push(heading("資料：教材画像用キーワード例"));
    children.push(
      paragraph("教師がCanva、ChatGPT、Geminiなどの画像生成ツールでフラッシュカードや教材を作成する際に使えるキーワード：")
    );
    children.push(...bulletList(lessonPlan.goiYHocLieuHinhAnh));
  }

  return children;
}

export function buildJapaneseLessonPlanDocument(lessonPlan, meta, options = {}) {
  return new Document({
    sections: [{ properties: pageProperties, children: buildDocxSections(lessonPlan, meta, options) }],
  });
}

export async function buildJapaneseLessonPlanDocxBlob(lessonPlan, meta, options = {}) {
  return buildDocxBlob(buildJapaneseLessonPlanDocument(lessonPlan, meta, options));
}

export async function exportJapaneseLessonPlanToWord(lessonPlan, meta, options = {}) {
  const fileBase = (lessonPlan?.tenBai || meta?.tenBai || "Lesson-Plan").trim().replace(/\s+/g, "-").slice(0, 60);
  const suffix = options.includeTeacherScript ? "-with-teacher-script" : "";
  await saveDocx(buildJapaneseLessonPlanDocument(lessonPlan, meta, options), `Lesson-Plan-JA-${fileBase}${suffix}.docx`);
}

// ================================== HTML/PDF ==================================

function htmlAppendixTitle(text) {
  return `<h2 class="section-break">${text}</h2>`;
}

function htmlChecklistTable(items) {
  if (!items?.length) return "";
  const rows = items
    .map((it) => {
      const loaiLine = it.loai && LOAI_LABEL_JA[it.loai] ? `<div style="font-size:10pt;color:#94a3b8;">${LOAI_LABEL_JA[it.loai]}</div>` : "";
      return `<tr><td>${loaiLine}<strong>${it.tieuChi || ""}</strong></td><td>${it.tot || ""}</td><td>${it.dat || ""}</td><td>${
        it.canCoGang || ""
      }</td></tr>`;
    })
    .join("");
  return `<table><thead><tr><th>評価基準</th><th>よくできる</th><th>できる</th><th>要努力</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function htmlStemActivity(data) {
  if (!data) return "";
  let html = "";
  const vatLieu = data.vatLieu || [];
  const cacBuoc = data.cacBuoc || [];
  const tieuChi = data.tieuChiDanhGia || [];
  if (vatLieu.length) html += htmlHeading("必要な材料", 3) + htmlBulletList(vatLieu);
  if (cacBuoc.length) html += htmlHeading("手順", 3) + `<ol>${cacBuoc.map((b) => `<li>${(b || "").replace(/\n/g, "<br/>")}</li>`).join("")}</ol>`;
  if (tieuChi.length) html += htmlHeading("評価基準", 3) + htmlBulletList(tieuChi);
  return html;
}

function htmlBaiTapPhanHoa(data) {
  if (!data) return "";
  return PHAN_HOA_GROUPS_JA.map((g) => {
    const items = data[g.key] || [];
    if (!items.length) return "";
    return htmlHeading(g.label, 3) + `<ol>${items.map((it) => `<li>${(it || "").replace(/\n/g, "<br/>")}</li>`).join("")}</ol>`;
  }).join("");
}

function htmlLoiDan(items) {
  if (!items?.length) return "";
  return items
    .filter((it) => it?.loiDan)
    .map((it) => (it.hoatDong ? `<p><strong>${it.hoatDong}</strong><br/><em>「${it.loiDan}」</em></p>` : `<p><em>「${it.loiDan}」</em></p>`))
    .join("");
}

function htmlSlideOutline(slides) {
  if (!slides?.length) return "";
  return slides
    .filter((s) => s?.tieuDe || (s?.noiDung || []).length)
    .map((s, i) => `<h3>スライド${i + 1}：${s.tieuDe || ""}</h3>` + htmlBulletList(s.noiDung))
    .join("");
}

function buildHtmlBody(lessonPlan, meta, { includeTeacherScript = false } = {}) {
  const yc = lessonPlan?.yeuCauCanDat || {};
  const dd = lessonPlan?.doDungDayHoc || {};
  const columnMode = meta?.columnMode || LESSON_PLAN_COLUMN_MODES.ONE_COLUMN;
  const normalizedHoatDong = normalizeActivitiesTiet(lessonPlan?.hoatDong);

  let html = `<h1>学習指導案</h1><p class="doc-meta"><strong>${lessonPlan?.tenBai || meta?.tenBai || ""}</strong><br/>${metaLine(
    meta
  )}</p>`;

  html += htmlHeading("一、学習目標");
  if (yc.kienThuc?.length) html += htmlHeading("1. 知識", 3) + htmlBulletList(yc.kienThuc);
  if (yc.nangLuc?.length) html += htmlHeading("2. 能力", 3) + htmlBulletList(yc.nangLuc);
  if (yc.phamChat?.length) html += htmlHeading("3. 資質・態度", 3) + htmlBulletList(yc.phamChat);

  if (dd.giaoVien?.length || dd.hocSinh?.length) {
    html += htmlHeading("二、教具・教材");
    if (dd.giaoVien?.length) html += htmlHeading("教師", 3) + htmlBulletList(dd.giaoVien);
    if (dd.hocSinh?.length) html += htmlHeading("生徒", 3) + htmlBulletList(dd.hocSinh);
  }

  html += htmlHeading("三、学習活動");
  if (meta?.soTiet > 1) {
    html += htmlParagraph(
      `時限ごとの時間配分（目安）：${computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType, "ja")
        .map((p) => `第${p.period}時限（${p.totalMinutes}分）`)
        .join(" — ")}`,
      "doc-meta"
    );
  }
  normalizedHoatDong.forEach((activity, idx) => {
    html += htmlHeading(`${idx + 1}. ${activity.ten || ""}`, 3);
    if (activity.mucTieu) html += htmlParagraph(`目標：${activity.mucTieu}`);
    const steps = Array.isArray(activity.tienTrinh) ? activity.tienTrinh : [];
    if (steps.length) {
      if (columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN) {
        html += `<table><thead><tr><th>教師と生徒の活動</th><th>期待される成果</th></tr></thead><tbody>`;
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
              `<p><strong>ステップ${i + 1}：</strong>${(s.hoatDongGVHS || "").replace(/\n/g, "<br/>")}${
                s.sanPhamDuKien ? ` — <em>期待される成果：${s.sanPhamDuKien}</em>` : ""
              }</p>`
          )
          .join("");
      }
    }
  });

  if (lessonPlan?.tichHopNLS) html += htmlParagraph(`情報活用能力の統合：${lessonPlan.tichHopNLS}`);
  if (lessonPlan?.tichHopGDQPAN) html += htmlParagraph(`${lessonPlan.tichHopGDQPANNhan || "統合"}：${lessonPlan.tichHopGDQPAN}`);
  if (lessonPlan?.tichHopHSKT) html += htmlParagraph(`障がいのある生徒への配慮：${lessonPlan.tichHopHSKT}`);

  if (lessonPlan?.cungCoQuestions?.length) {
    html += htmlHeading("まとめ - 確認問題", 3);
    html += `<ol>${lessonPlan.cungCoQuestions.map((q) => `<li>${q.cauHoi} <strong>（答え：${q.dapAn}）</strong></li>`).join("")}</ol>`;
  }

  if (lessonPlan?.mindmap?.chuDe) {
    html += htmlHeading(`マインドマップ：${lessonPlan.mindmap.chuDe}`, 3);
    (lessonPlan.mindmap.nhanh || []).forEach((n) => {
      html += htmlParagraph(n.nhan) + htmlBulletList(n.y);
    });
  }

  html += htmlHeading("四、授業後の振り返り");
  html += htmlParagraph("....................................................................................");

  if (lessonPlan?.phieuHocTap?.tieuDe || lessonPlan?.phieuHocTap?.baiTap?.length) {
    html += htmlAppendixTitle(`資料：${lessonPlan.phieuHocTap.tieuDe || "学習プリント"}`);
    if (lessonPlan.phieuHocTap.huongDan) html += htmlParagraph(lessonPlan.phieuHocTap.huongDan);
    html += `<ol>${(lessonPlan.phieuHocTap.baiTap || [])
      .map((b) => `<li>${(b || "").replace(/\n/g, "<br/>")}</li>`)
      .join("")}</ol>`;
  }

  const hasStemActivity = !!lessonPlan?.stemActivity?.tenSanPham || (lessonPlan?.stemActivity?.cacBuoc || []).length > 0;
  if (hasStemActivity) {
    html += htmlAppendixTitle(`資料：STEM活動ガイド${lessonPlan.stemActivity.tenSanPham ? ` — ${lessonPlan.stemActivity.tenSanPham}` : ""}`);
    html += htmlParagraph("生徒は家庭で作品を完成させます。教師はこの部分を印刷して保護者に配布できます。");
    html += htmlStemActivity(lessonPlan.stemActivity);
  }

  const hasPhanHoa = PHAN_HOA_GROUPS_JA.some((g) => (lessonPlan?.baiTapPhanHoa?.[g.key] || []).length > 0);
  if (hasPhanHoa) {
    html += htmlAppendixTitle("資料：習熟度別練習問題（3段階）");
    html += htmlBaiTapPhanHoa(lessonPlan.baiTapPhanHoa);
  }

  if (lessonPlan?.checklistNLPC?.length) {
    html += htmlAppendixTitle("資料：資質・能力評価チェックリスト");
    html += htmlChecklistTable(lessonPlan.checklistNLPC);
  }

  if (lessonPlan?.tinNhanPhuHuynh) {
    html += htmlAppendixTitle("PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)");
    html += htmlParagraph(lessonPlan.tinNhanPhuHuynh);
  }

  if (includeTeacherScript && lessonPlan?.loiDan?.length) {
    html += htmlAppendixTitle("資料：教師用スクリプト");
    html += htmlLoiDan(lessonPlan.loiDan);
  }

  if (lessonPlan?.slideOutline?.length) {
    html += htmlAppendixTitle("資料：スライド構成案");
    html += htmlSlideOutline(lessonPlan.slideOutline);
  }

  if (lessonPlan?.goiYHocLieuHinhAnh?.length) {
    html += htmlHeading("資料：教材画像用キーワード例");
    html += htmlBulletList(lessonPlan.goiYHocLieuHinhAnh);
  }

  return html;
}

export function printJapaneseLessonPlan(lessonPlan, meta, options = {}) {
  printHtmlDocument({
    title: `学習指導案 - ${lessonPlan?.tenBai || meta?.tenBai || ""}`,
    bodyHtml: buildHtmlBody(lessonPlan, meta, options),
    fontFamily: PRINT_FONT_FAMILY_JA,
  });
}
