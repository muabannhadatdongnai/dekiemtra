import { Document, Paragraph, AlignmentType } from "docx";
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
 * ⚠️ GIỚI HẠN ĐÃ BIẾT (chưa mở rộng ở Phiên 35): các tích hợp/phụ lục KHÁC (Checklist NL-PC,
 * STEM, Timeline, Bài tập phân hoá, Phiếu học tập, Lời dẫn, Slide Outline...) CHƯA có bản render
 * tiếng Anh - nếu giáo viên bật các tích hợp này khi soạn giáo án môn Tiếng Anh, phần đó sẽ KHÔNG
 * xuất hiện trong file Word/PDF tiếng Anh (im lặng bỏ qua, không lỗi). Đây là giới hạn KẾ THỪA từ
 * kiến trúc dịch cũ (bản dịch trước Phiên 35 cũng chỉ xử lý các trường lõi, không xử lý tích hợp)
 * - xem mục "cần Hoan quyết định" #17 trong NEXT_STEPS.md nếu muốn mở rộng.
 */

function metaLine(meta) {
  const parts = [];
  if (meta?.subjectLabelEn) parts.push(`Subject: ${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") parts.push(`Grade: ${meta.grade}`);
  if (meta?.soTiet) parts.push(`Periods: ${meta.soTiet}`);
  return parts.join("   |   ");
}

function buildDocxSections(lessonPlan, meta) {
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
  (lessonPlan?.hoatDong || []).forEach((activity, idx) => {
    children.push(heading(`${idx + 1}. ${activity.ten || ""}`, 2));
    if (activity.mucTieu) {
      children.push(paragraph(`Objective: ${activity.mucTieu}`, { run: { italics: true } }));
    }

    const steps = Array.isArray(activity.tienTrinh) ? activity.tienTrinh : [];
    if (steps.length) {
      const headerRow = [
        cell("Teacher & Student Activities", 60, { bold: true }),
        cell("Expected Outcome", 40, { bold: true }),
      ];
      const bodyRows = steps.map((step) => [
        cell(step.hoatDongGVHS, 60),
        cell(step.sanPhamDuKien, 40),
      ]);
      children.push(twoColumnTable([headerRow, ...bodyRows]));
      children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    }
  });

  if (lessonPlan?.goiYHocLieuHinhAnh?.length) {
    children.push(heading("APPENDIX: Suggested Visual Material Prompts"));
    children.push(
      paragraph(
        "Keyword prompts teachers can use with image-generation tools (Canva, ChatGPT, Gemini) to create flashcards/visual aids:"
      )
    );
    children.push(...bulletList(lessonPlan.goiYHocLieuHinhAnh));
  }

  // ⚠️ Tin nhắn gửi phụ huynh LUÔN bằng tiếng Việt (xem docstring đầu file) - tiêu đề giữ nguyên
  // tiếng Việt để giáo viên nhận ra ngay đây là phần COPY-PASTE cho phụ huynh, không phải lỗi
  // thiếu dịch.
  if (lessonPlan?.tinNhanPhuHuynh) {
    children.push(heading("PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)"));
    children.push(
      new Paragraph({
        children: multilineTextRuns(lessonPlan.tinNhanPhuHuynh),
        spacing: { after: 120 },
      })
    );
  }

  return children;
}

export function buildEnglishLessonPlanDocument(lessonPlan, meta) {
  return new Document({
    sections: [{ properties: pageProperties, children: buildDocxSections(lessonPlan, meta) }],
  });
}

export async function buildEnglishLessonPlanDocxBlob(lessonPlan, meta) {
  return buildDocxBlob(buildEnglishLessonPlanDocument(lessonPlan, meta));
}

export async function exportEnglishLessonPlanToWord(lessonPlan, meta) {
  const fileBase = (lessonPlan?.tenBai || meta?.tenBai || "Lesson-Plan").trim().replace(/\s+/g, "-").slice(0, 60);
  await saveDocx(buildEnglishLessonPlanDocument(lessonPlan, meta), `Lesson-Plan-EN-${fileBase}.docx`);
}

function buildHtmlBody(lessonPlan, meta) {
  const yc = lessonPlan?.yeuCauCanDat || {};
  const dd = lessonPlan?.doDungDayHoc || {};
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
  (lessonPlan?.hoatDong || []).forEach((activity, idx) => {
    html += htmlHeading(`${idx + 1}. ${activity.ten || ""}`, 3);
    if (activity.mucTieu) html += htmlParagraph(`Objective: ${activity.mucTieu}`);
    const steps = Array.isArray(activity.tienTrinh) ? activity.tienTrinh : [];
    if (steps.length) {
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
    }
  });

  if (lessonPlan?.goiYHocLieuHinhAnh?.length) {
    html += htmlHeading("Appendix: Suggested Visual Material Prompts");
    html += htmlBulletList(lessonPlan.goiYHocLieuHinhAnh);
  }

  if (lessonPlan?.tinNhanPhuHuynh) {
    html += htmlHeading("PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)");
    html += htmlParagraph(lessonPlan.tinNhanPhuHuynh.replace(/\n/g, "<br/>"));
  }

  return html;
}

export function printEnglishLessonPlan(lessonPlan, meta) {
  printHtmlDocument({
    title: `Lesson Plan - ${lessonPlan?.tenBai || meta?.tenBai || ""}`,
    bodyHtml: buildHtmlBody(lessonPlan, meta),
  });
}
