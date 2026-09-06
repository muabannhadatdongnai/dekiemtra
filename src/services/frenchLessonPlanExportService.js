import { Document, Paragraph, AlignmentType, Table, TableRow, WidthType } from "docx";
import {
  pageProperties,
  textRun,
  multilineTextRuns,
  paragraph,
  heading,
  bulletList,
  cell,
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
 * frenchLessonPlanExportService.js
 * Xuất Word/PDF HOÀN TOÀN bằng TIẾNG PHÁP cho "Kế hoạch bài dạy" (Soạn Giáo Án) môn Tiếng Pháp
 * (Ngoại ngữ 2) - nhân bản ĐÚNG cấu trúc englishLessonPlanExportService.js, nhận THẲNG object
 * `lessonPlan` đã được AI SINH TRỰC TIẾP bằng tiếng Pháp, KHÔNG dịch lại. KHÔNG đụng tới các bản
 * ngôn ngữ khác - đúng nguyên tắc Isolation over DRY (Hoan chọn Hướng A ở Phiên 40).
 *
 * Tiếng Pháp dùng bảng chữ Latinh (có dấu phụ: é, è, ê, à, ç...) - "Times New Roman" hiển thị đầy
 * đủ, nên dùng THẲNG textRun/paragraph/heading/bulletList/cell từ foreignLanguageDocBuilder.js
 * (giống bản tiếng Anh), KHÔNG cần createLanguageHelpers()/eastAsia như bản tiếng Trung/Nhật.
 *
 * ⚠️ Phụ lục "Tin nhắn gửi phụ huynh" (`lessonPlan.tinNhanPhuHuynh`) LUÔN được AI viết bằng TIẾNG
 * VIỆT (xem exemptJsonFields - foreignLanguageSubjects.js) - tiêu đề phụ lục GIỮ NGUYÊN tiếng Việt.
 */

function metaLine(meta) {
  const parts = [];
  if (meta?.subjectLabelEn) parts.push(`Matière : ${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") parts.push(`Niveau : ${meta.grade}`);
  if (meta?.soTiet) parts.push(`Séances : ${meta.soTiet}`);
  return parts.join("   |   ");
}

// ============================= "ANNEXE"/tiêu đề dùng chung =============================

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

function periodBoundaryParagraphFr(tiet) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      textRun(`── Fin de la séance ${tiet - 1} (pause) — Passage à la séance ${tiet} ──`, {
        bold: true,
        size: 20,
        color: "9A3412",
      }),
    ],
    spacing: { before: 120, after: 120 },
  });
}

// Đúng khuôn periodBoundaryTableRowEn() (sửa lỗi Phiên 37) - opts.children PHẢI là mảng TextRun,
// KHÔNG BAO GIỜ truyền nguyên 1 Paragraph vào cell().
function periodBoundaryTableRowFr(tiet) {
  return new TableRow({
    children: [
      cell(null, 100, {
        columnSpan: 2,
        alignment: AlignmentType.CENTER,
        children: [
          textRun(`── Fin de la séance ${tiet - 1} (pause) — Passage à la séance ${tiet} ──`, {
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

function buildTwoColumnActivityTableFr(steps, startTiet) {
  const headerRow = [
    cell("Activités de l'enseignant et des élèves", 60, { bold: true }),
    cell("Résultat attendu", 40, { bold: true }),
  ];
  let lastTiet = startTiet || null;
  const rowsWithBoundaries = [];
  (steps || []).forEach((s, i) => {
    const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
    lastTiet = s.tiet || lastTiet;
    if (showBoundary) rowsWithBoundaries.push(periodBoundaryTableRowFr(s.tiet));
    rowsWithBoundaries.push(
      new TableRow({
        children: [
          cell(null, 60, {
            children: [textRun(`Étape ${i + 1} : `, { bold: true }), ...multilineTextRuns(s.hoatDongGVHS)],
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

function buildOneColumnActivityParagraphsFr(steps, startTiet) {
  let lastTiet = startTiet || null;
  return (steps || []).flatMap((s, i) => {
    const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
    lastTiet = s.tiet || lastTiet;
    return [
      ...(showBoundary ? [periodBoundaryParagraphFr(s.tiet)] : []),
      new Paragraph({
        children: [textRun(`Étape ${i + 1} : `, { bold: true }), ...multilineTextRuns(s.hoatDongGVHS)],
        spacing: { after: 40 },
      }),
      ...(s.sanPhamDuKien
        ? [
            new Paragraph({
              children: [textRun(`Résultat attendu : ${s.sanPhamDuKien}`, { italics: true })],
              spacing: { after: 120 },
              indent: { left: 200 },
            }),
          ]
        : []),
    ];
  });
}

function buildActivitySectionFr(activity, columnMode, minutes, startTiet) {
  const titleSuffix = minutes ? ` (environ ${minutes} min)` : "";
  const children = [
    new Paragraph({
      children: [textRun(`${activity.ten || ""}${titleSuffix}`, { bold: true, size: 24 })],
      spacing: { before: 150, after: 60 },
    }),
  ];
  if (activity.mucTieu) {
    children.push(
      new Paragraph({ children: [textRun(`Objectif : ${activity.mucTieu}`, { italics: true })], spacing: { after: 80 } })
    );
  }
  const steps = Array.isArray(activity.tienTrinh) ? activity.tienTrinh : [];
  if (steps.length) {
    if (columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN) {
      children.push(buildTwoColumnActivityTableFr(steps, startTiet));
      children.push(new Paragraph({ text: "" }));
    } else {
      children.push(...buildOneColumnActivityParagraphsFr(steps, startTiet));
    }
  }
  return children;
}

// ============================= Checklist NL-PC (Competency-Quality) =============================

const LOAI_LABEL_FR = { nang_luc: "Compétence", pham_chat: "Qualité" };

function buildChecklistNLPCTableFr(items) {
  const headerRow = new TableRow({
    children: [
      cell("Critère", 28, { bold: true }),
      cell("Très bien", 24, { bold: true }),
      cell("Satisfaisant", 24, { bold: true }),
      cell("À améliorer", 24, { bold: true }),
    ],
  });
  const bodyRows = (items || []).map((it) => {
    const loaiLine = it.loai && LOAI_LABEL_FR[it.loai] ? LOAI_LABEL_FR[it.loai] : null;
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

function buildStemActivityParagraphsFr(data) {
  const children = [];
  const vatLieu = data?.vatLieu || [];
  const cacBuoc = data?.cacBuoc || [];
  const tieuChi = data?.tieuChiDanhGia || [];
  if (vatLieu.length > 0) {
    children.push(
      new Paragraph({ children: [textRun("Matériel nécessaire", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
    );
    children.push(...bulletList(vatLieu));
  }
  if (cacBuoc.length > 0) {
    children.push(
      new Paragraph({ children: [textRun("Étapes", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
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
      new Paragraph({ children: [textRun("Critères d'évaluation", { bold: true, size: 22, color: "0F766E" })], spacing: { before: 120, after: 60 } })
    );
    children.push(...bulletList(tieuChi));
  }
  return children;
}

// ============================= Differentiated Exercises (3 levels) =============================

const PHAN_HOA_GROUPS_FR = [
  { key: "hoTro", label: "Niveau 1 — Soutien", color: "0369A1" },
  { key: "datChuan", label: "Niveau 2 — Standard", color: "15803D" },
  { key: "nangCao", label: "Niveau 3 — Avancé", color: "B45309" },
];

function buildBaiTapPhanHoaParagraphsFr(data) {
  const children = [];
  PHAN_HOA_GROUPS_FR.forEach((g) => {
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

function buildLoiDanParagraphsFr(items) {
  const children = [];
  (items || []).forEach((it) => {
    if (!it?.loiDan) return;
    if (it.hoatDong) {
      children.push(new Paragraph({ children: [textRun(it.hoatDong, { bold: true })], spacing: { before: 100, after: 20 } }));
    }
    children.push(
      new Paragraph({
        children: [textRun(`« ${it.loiDan} »`, { italics: true })],
        spacing: { after: 80 },
        indent: { left: 200 },
      })
    );
  });
  return children;
}

// ============================= Slide Outline =============================

function buildSlideOutlineParagraphsFr(slides) {
  const children = [];
  (slides || []).forEach((s, i) => {
    if (!s?.tieuDe && !(s?.noiDung || []).length) return;
    children.push(new Paragraph({ children: [textRun(`Diapositive ${i + 1} : ${s.tieuDe || ""}`, { bold: true })], spacing: { before: 100, after: 20 } }));
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
      children: [textRun("PLAN DE COURS", { bold: true, size: 32 })],
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
  children.push(heading("I. OBJECTIFS D'APPRENTISSAGE"));
  if (yc.kienThuc?.length) {
    children.push(paragraph("1. Connaissances", { run: { bold: true } }));
    children.push(...bulletList(yc.kienThuc));
  }
  if (yc.nangLuc?.length) {
    children.push(paragraph("2. Compétences", { run: { bold: true } }));
    children.push(...bulletList(yc.nangLuc));
  }
  if (yc.phamChat?.length) {
    children.push(paragraph("3. Qualités", { run: { bold: true } }));
    children.push(...bulletList(yc.phamChat));
  }

  const dd = lessonPlan?.doDungDayHoc || {};
  if (dd.giaoVien?.length || dd.hocSinh?.length) {
    children.push(heading("II. MATÉRIEL PÉDAGOGIQUE"));
    if (dd.giaoVien?.length) {
      children.push(paragraph("Enseignant :", { run: { bold: true } }));
      children.push(...bulletList(dd.giaoVien));
    }
    if (dd.hocSinh?.length) {
      children.push(paragraph("Élève :", { run: { bold: true } }));
      children.push(...bulletList(dd.hocSinh));
    }
  }

  children.push(heading("III. ACTIVITÉS D'APPRENTISSAGE"));
  if (meta?.soTiet > 1) {
    children.push(
      new Paragraph({
        children: [
          textRun(
            `Répartition du temps suggérée par séance : ${computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType, "fr")
              .map((p) => `Séance ${p.period} (${p.totalMinutes} min)`)
              .join(" — ")}`,
            { italics: true, size: 20, color: "9A3412" }
          ),
        ],
        spacing: { after: 80 },
      })
    );
  }
  normalizedHoatDong.forEach((activity, idx) => {
    children.push(...buildActivitySectionFr(activity, columnMode, minutesByKey[activityKeyByIndex[idx]], activityStartTiets[idx]));
  });

  if (lessonPlan?.tichHopNLS) children.push(paragraph(`Intégration des compétences numériques : ${lessonPlan.tichHopNLS}`));
  if (lessonPlan?.tichHopGDQPAN) {
    children.push(paragraph(`${lessonPlan.tichHopGDQPANNhan || "Intégration"} : ${lessonPlan.tichHopGDQPAN}`));
  }
  if (lessonPlan?.tichHopHSKT) {
    children.push(paragraph(`Aménagements pour élèves en situation de handicap : ${lessonPlan.tichHopHSKT}`));
  }

  if (lessonPlan?.cungCoQuestions?.length) {
    children.push(heading("Consolidation - Questions rapides"));
    lessonPlan.cungCoQuestions.forEach((q, i) => {
      children.push(paragraph(`${i + 1}. ${q.cauHoi} (Réponse : ${q.dapAn})`));
    });
  }

  if (lessonPlan?.mindmap?.chuDe) {
    children.push(heading(`Carte mentale : ${lessonPlan.mindmap.chuDe}`));
    (lessonPlan.mindmap.nhanh || []).forEach((n) => {
      children.push(paragraph(n.nhan, { run: { bold: true } }));
      children.push(...bulletList(n.y));
    });
  }

  children.push(heading("IV. AJUSTEMENTS APRÈS LA LEÇON"));
  children.push(paragraph("............................................................................"));
  children.push(paragraph("............................................................................"));

  if (lessonPlan?.phieuHocTap?.tieuDe || lessonPlan?.phieuHocTap?.baiTap?.length) {
    children.push(appendixTitleParagraph(`ANNEXE : ${lessonPlan.phieuHocTap.tieuDe || "Fiche d'exercices"}`));
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
      appendixTitleParagraph(`ANNEXE : GUIDE D'ACTIVITÉ STEM${lessonPlan.stemActivity.tenSanPham ? ` — ${lessonPlan.stemActivity.tenSanPham}` : ""}`)
    );
    children.push(appendixNoteParagraph("Les élèves réalisent le projet à la maison - l'enseignant peut imprimer/envoyer cette section aux parents."));
    children.push(...buildStemActivityParagraphsFr(lessonPlan.stemActivity));
  }

  const hasPhanHoa = PHAN_HOA_GROUPS_FR.some((g) => (lessonPlan?.baiTapPhanHoa?.[g.key] || []).length > 0);
  if (hasPhanHoa) {
    children.push(appendixTitleParagraph("ANNEXE : EXERCICES DIFFÉRENCIÉS (3 NIVEAUX)"));
    children.push(...buildBaiTapPhanHoaParagraphsFr(lessonPlan.baiTapPhanHoa));
  }

  if (lessonPlan?.checklistNLPC?.length) {
    children.push(appendixTitleParagraph("ANNEXE : GRILLE D'ÉVALUATION COMPÉTENCES - QUALITÉS"));
    children.push(appendixNoteParagraph("(L'enseignant observe et note directement pendant la leçon.)"));
    children.push(buildChecklistNLPCTableFr(lessonPlan.checklistNLPC));
    children.push(new Paragraph({ text: "" }));
  }

  // ⚠️ Tin nhắn gửi phụ huynh LUÔN bằng tiếng Việt (xem docstring đầu file) - tiêu đề giữ nguyên
  // tiếng Việt, KHÔNG dịch sang tiếng Pháp.
  if (lessonPlan?.tinNhanPhuHuynh) {
    children.push(appendixTitleParagraph("PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)"));
    children.push(new Paragraph({ children: multilineTextRuns(lessonPlan.tinNhanPhuHuynh), spacing: { after: 120 } }));
  }

  if (includeTeacherScript && lessonPlan?.loiDan?.length) {
    children.push(appendixTitleParagraph("ANNEXE : SCRIPT DE L'ENSEIGNANT"));
    children.push(appendixNoteParagraph("(Phrases de transition suggérées pour chaque activité - à titre indicatif seulement.)"));
    children.push(...buildLoiDanParagraphsFr(lessonPlan.loiDan));
  }

  if (lessonPlan?.slideOutline?.length) {
    children.push(appendixTitleParagraph("ANNEXE : PLAN DES DIAPOSITIVES"));
    children.push(appendixNoteParagraph("(Plan textuel pour aider à créer des diapositives PowerPoint/Canva - ce n'est pas un fichier de diapositives réel.)"));
    children.push(...buildSlideOutlineParagraphsFr(lessonPlan.slideOutline));
  }

  if (lessonPlan?.goiYHocLieuHinhAnh?.length) {
    children.push(heading("ANNEXE : Suggestions de mots-clés pour le matériel visuel"));
    children.push(
      paragraph(
        "Mots-clés que les enseignants peuvent utiliser avec des outils de génération d'images (Canva, ChatGPT, Gemini) pour créer des cartes mémoire/supports visuels :"
      )
    );
    children.push(...bulletList(lessonPlan.goiYHocLieuHinhAnh));
  }

  return children;
}

export function buildFrenchLessonPlanDocument(lessonPlan, meta, options = {}) {
  return new Document({
    sections: [{ properties: pageProperties, children: buildDocxSections(lessonPlan, meta, options) }],
  });
}

export async function buildFrenchLessonPlanDocxBlob(lessonPlan, meta, options = {}) {
  return buildDocxBlob(buildFrenchLessonPlanDocument(lessonPlan, meta, options));
}

export async function exportFrenchLessonPlanToWord(lessonPlan, meta, options = {}) {
  const fileBase = (lessonPlan?.tenBai || meta?.tenBai || "Lesson-Plan").trim().replace(/\s+/g, "-").slice(0, 60);
  const suffix = options.includeTeacherScript ? "-with-teacher-script" : "";
  await saveDocx(buildFrenchLessonPlanDocument(lessonPlan, meta, options), `Lesson-Plan-FR-${fileBase}${suffix}.docx`);
}

// ================================== HTML/PDF ==================================

function htmlAppendixTitle(text) {
  return `<h2 class="section-break">${text}</h2>`;
}

function htmlChecklistTable(items) {
  if (!items?.length) return "";
  const rows = items
    .map((it) => {
      const loaiLine = it.loai && LOAI_LABEL_FR[it.loai] ? `<div style="font-size:10pt;color:#94a3b8;">${LOAI_LABEL_FR[it.loai]}</div>` : "";
      return `<tr><td>${loaiLine}<strong>${it.tieuChi || ""}</strong></td><td>${it.tot || ""}</td><td>${it.dat || ""}</td><td>${
        it.canCoGang || ""
      }</td></tr>`;
    })
    .join("");
  return `<table><thead><tr><th>Critère</th><th>Très bien</th><th>Satisfaisant</th><th>À améliorer</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function htmlStemActivity(data) {
  if (!data) return "";
  let html = "";
  const vatLieu = data.vatLieu || [];
  const cacBuoc = data.cacBuoc || [];
  const tieuChi = data.tieuChiDanhGia || [];
  if (vatLieu.length) html += htmlHeading("Matériel nécessaire", 3) + htmlBulletList(vatLieu);
  if (cacBuoc.length) html += htmlHeading("Étapes", 3) + `<ol>${cacBuoc.map((b) => `<li>${(b || "").replace(/\n/g, "<br/>")}</li>`).join("")}</ol>`;
  if (tieuChi.length) html += htmlHeading("Critères d'évaluation", 3) + htmlBulletList(tieuChi);
  return html;
}

function htmlBaiTapPhanHoa(data) {
  if (!data) return "";
  return PHAN_HOA_GROUPS_FR.map((g) => {
    const items = data[g.key] || [];
    if (!items.length) return "";
    return htmlHeading(g.label, 3) + `<ol>${items.map((it) => `<li>${(it || "").replace(/\n/g, "<br/>")}</li>`).join("")}</ol>`;
  }).join("");
}

function htmlLoiDan(items) {
  if (!items?.length) return "";
  return items
    .filter((it) => it?.loiDan)
    .map((it) => (it.hoatDong ? `<p><strong>${it.hoatDong}</strong><br/><em>« ${it.loiDan} »</em></p>` : `<p><em>« ${it.loiDan} »</em></p>`))
    .join("");
}

function htmlSlideOutline(slides) {
  if (!slides?.length) return "";
  return slides
    .filter((s) => s?.tieuDe || (s?.noiDung || []).length)
    .map((s, i) => `<h3>Diapositive ${i + 1} : ${s.tieuDe || ""}</h3>` + htmlBulletList(s.noiDung))
    .join("");
}

function buildHtmlBody(lessonPlan, meta, { includeTeacherScript = false } = {}) {
  const yc = lessonPlan?.yeuCauCanDat || {};
  const dd = lessonPlan?.doDungDayHoc || {};
  const columnMode = meta?.columnMode || LESSON_PLAN_COLUMN_MODES.ONE_COLUMN;
  const normalizedHoatDong = normalizeActivitiesTiet(lessonPlan?.hoatDong);

  let html = `<h1>PLAN DE COURS</h1><p class="doc-meta"><strong>${lessonPlan?.tenBai || meta?.tenBai || ""}</strong><br/>${metaLine(
    meta
  )}</p>`;

  html += htmlHeading("I. Objectifs d'apprentissage");
  if (yc.kienThuc?.length) html += htmlHeading("1. Connaissances", 3) + htmlBulletList(yc.kienThuc);
  if (yc.nangLuc?.length) html += htmlHeading("2. Compétences", 3) + htmlBulletList(yc.nangLuc);
  if (yc.phamChat?.length) html += htmlHeading("3. Qualités", 3) + htmlBulletList(yc.phamChat);

  if (dd.giaoVien?.length || dd.hocSinh?.length) {
    html += htmlHeading("II. Matériel pédagogique");
    if (dd.giaoVien?.length) html += htmlHeading("Enseignant", 3) + htmlBulletList(dd.giaoVien);
    if (dd.hocSinh?.length) html += htmlHeading("Élève", 3) + htmlBulletList(dd.hocSinh);
  }

  html += htmlHeading("III. Activités d'apprentissage");
  if (meta?.soTiet > 1) {
    html += htmlParagraph(
      `Répartition du temps suggérée par séance : ${computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType, "fr")
        .map((p) => `Séance ${p.period} (${p.totalMinutes} min)`)
        .join(" — ")}`,
      "doc-meta"
    );
  }
  normalizedHoatDong.forEach((activity, idx) => {
    html += htmlHeading(`${idx + 1}. ${activity.ten || ""}`, 3);
    if (activity.mucTieu) html += htmlParagraph(`Objectif : ${activity.mucTieu}`);
    const steps = Array.isArray(activity.tienTrinh) ? activity.tienTrinh : [];
    if (steps.length) {
      if (columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN) {
        html += `<table><thead><tr><th>Activités de l'enseignant et des élèves</th><th>Résultat attendu</th></tr></thead><tbody>`;
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
              `<p><strong>Étape ${i + 1} : </strong>${(s.hoatDongGVHS || "").replace(/\n/g, "<br/>")}${
                s.sanPhamDuKien ? ` — <em>Résultat attendu : ${s.sanPhamDuKien}</em>` : ""
              }</p>`
          )
          .join("");
      }
    }
  });

  if (lessonPlan?.tichHopNLS) html += htmlParagraph(`Intégration des compétences numériques : ${lessonPlan.tichHopNLS}`);
  if (lessonPlan?.tichHopGDQPAN) html += htmlParagraph(`${lessonPlan.tichHopGDQPANNhan || "Intégration"} : ${lessonPlan.tichHopGDQPAN}`);
  if (lessonPlan?.tichHopHSKT) html += htmlParagraph(`Aménagements pour élèves en situation de handicap : ${lessonPlan.tichHopHSKT}`);

  if (lessonPlan?.cungCoQuestions?.length) {
    html += htmlHeading("Consolidation - Questions rapides", 3);
    html += `<ol>${lessonPlan.cungCoQuestions.map((q) => `<li>${q.cauHoi} <strong>(Réponse : ${q.dapAn})</strong></li>`).join("")}</ol>`;
  }

  if (lessonPlan?.mindmap?.chuDe) {
    html += htmlHeading(`Carte mentale : ${lessonPlan.mindmap.chuDe}`, 3);
    (lessonPlan.mindmap.nhanh || []).forEach((n) => {
      html += htmlParagraph(n.nhan) + htmlBulletList(n.y);
    });
  }

  html += htmlHeading("IV. Ajustements après la leçon");
  html += htmlParagraph("....................................................................................");

  if (lessonPlan?.phieuHocTap?.tieuDe || lessonPlan?.phieuHocTap?.baiTap?.length) {
    html += htmlAppendixTitle(`ANNEXE : ${lessonPlan.phieuHocTap.tieuDe || "Fiche d'exercices"}`);
    if (lessonPlan.phieuHocTap.huongDan) html += htmlParagraph(lessonPlan.phieuHocTap.huongDan);
    html += `<ol>${(lessonPlan.phieuHocTap.baiTap || [])
      .map((b) => `<li>${(b || "").replace(/\n/g, "<br/>")}</li>`)
      .join("")}</ol>`;
  }

  const hasStemActivity = !!lessonPlan?.stemActivity?.tenSanPham || (lessonPlan?.stemActivity?.cacBuoc || []).length > 0;
  if (hasStemActivity) {
    html += htmlAppendixTitle(`ANNEXE : GUIDE D'ACTIVITÉ STEM${lessonPlan.stemActivity.tenSanPham ? ` — ${lessonPlan.stemActivity.tenSanPham}` : ""}`);
    html += htmlParagraph("Les élèves réalisent le projet à la maison - l'enseignant peut imprimer/envoyer cette section aux parents.");
    html += htmlStemActivity(lessonPlan.stemActivity);
  }

  const hasPhanHoa = PHAN_HOA_GROUPS_FR.some((g) => (lessonPlan?.baiTapPhanHoa?.[g.key] || []).length > 0);
  if (hasPhanHoa) {
    html += htmlAppendixTitle("ANNEXE : EXERCICES DIFFÉRENCIÉS (3 NIVEAUX)");
    html += htmlBaiTapPhanHoa(lessonPlan.baiTapPhanHoa);
  }

  if (lessonPlan?.checklistNLPC?.length) {
    html += htmlAppendixTitle("ANNEXE : GRILLE D'ÉVALUATION COMPÉTENCES - QUALITÉS");
    html += htmlChecklistTable(lessonPlan.checklistNLPC);
  }

  if (lessonPlan?.tinNhanPhuHuynh) {
    html += htmlAppendixTitle("PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)");
    html += htmlParagraph(lessonPlan.tinNhanPhuHuynh);
  }

  if (includeTeacherScript && lessonPlan?.loiDan?.length) {
    html += htmlAppendixTitle("ANNEXE : SCRIPT DE L'ENSEIGNANT");
    html += htmlLoiDan(lessonPlan.loiDan);
  }

  if (lessonPlan?.slideOutline?.length) {
    html += htmlAppendixTitle("ANNEXE : PLAN DES DIAPOSITIVES");
    html += htmlSlideOutline(lessonPlan.slideOutline);
  }

  if (lessonPlan?.goiYHocLieuHinhAnh?.length) {
    html += htmlHeading("ANNEXE : Suggestions de mots-clés pour le matériel visuel");
    html += htmlBulletList(lessonPlan.goiYHocLieuHinhAnh);
  }

  return html;
}

export function printFrenchLessonPlan(lessonPlan, meta, options = {}) {
  printHtmlDocument({
    title: `Plan de cours - ${lessonPlan?.tenBai || meta?.tenBai || ""}`,
    bodyHtml: buildHtmlBody(lessonPlan, meta, options),
  });
}
