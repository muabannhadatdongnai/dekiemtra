import { Document, Paragraph, AlignmentType } from "docx";
import {
  pageProperties,
  heading,
  paragraph,
  textRun,
  saveDocx,
  buildDocxBlob,
  printHtmlDocument,
  htmlHeading,
  htmlParagraph,
} from "./foreignLanguageDocBuilder";
import { computeExamMatrix } from "./specificationBuilder";
import { computeSpecificationRowsEn } from "./englishSpecificationBuilder";
import {
  buildEnglishSectionTitleParagraph,
  buildEnglishMatrixTable,
  buildEnglishSpecificationTable,
} from "./englishSpecificationExportBuilders";

/**
 * englishExamExportService.js
 * Xuất Word/PDF HOÀN TOÀN bằng TIẾNG ANH cho "Đề Kiểm tra" môn Tiếng Anh - từ Phiên 35, nhận
 * THẲNG `content` ({ questions, teacherRubric }) đã được AI SINH TRỰC TIẾP bằng tiếng Anh (xem
 * chỉ thị buildForeignLanguageOutputDirective() - foreignLanguageSubjects.js), KHÔNG còn bước dịch
 * lại như trước (xem lịch sử ở PROJECT_SUMMARY.md Phiên 34). Bản gốc tiếng Việt (exportService.js)
 * giữ NGUYÊN VẸN, không đổi - dùng cho mọi môn học khác.
 */

function metaLines(meta) {
  const lines = [];
  if (meta?.schoolName) lines.push(meta.schoolName);
  const line2 = [];
  if (meta?.subjectLabelEn) line2.push(`Subject: ${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") line2.push(`Grade: ${meta.grade}`);
  if (meta?.className) line2.push(`Class: ${meta.className}`);
  if (line2.length) lines.push(line2.join("   |   "));
  const line3 = [];
  if (meta?.duration) line3.push(`Time: ${meta.duration} minutes`);
  if (meta?.academicYear) line3.push(`School year: ${meta.academicYear}`);
  if (line3.length) lines.push(line3.join("   |   "));
  return lines;
}

function buildQuestionParagraphs({ questions, teacherRubric, includeAnswers }) {
  const children = [];
  (questions || []).forEach((q, idx) => {
    children.push(paragraph(`Question ${idx + 1}. ${q.content || ""}`, { run: { bold: true } }));
    if (Array.isArray(q.options) && q.options.length) {
      children.push(...q.options.map((opt) => paragraph(opt)));
    }
    if (includeAnswers) {
      const rubric = teacherRubric?.[idx];
      if (q.correctAnswer) children.push(paragraph(`Correct answer: ${q.correctAnswer}`, { run: { bold: true } }));
      if (rubric?.detailedSolution) children.push(paragraph(`Solution: ${rubric.detailedSolution}`));
      if (rubric?.scoringGuide) children.push(paragraph(`Scoring guide: ${rubric.scoringGuide}`));
    } else {
      children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    }
  });
  return children;
}

// Đúng khuôn Giai đoạn 2 (exportService.js): Ma trận + Bản đặc tả đứng THÀNH TRANG RIÊNG, TRƯỚC đề
// - chỉ khác nhãn tiếng Anh (buildEnglishMatrixTable/buildEnglishSpecificationTable).
function buildFrontMatterElements({ questions, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  const elements = [];
  if (!includeMatrixAndSpec || !chaptersInfo?.length) return elements;

  const matrix = computeExamMatrix(questions, chaptersInfo, typeByLevel);
  const specRows = computeSpecificationRowsEn(questions, chaptersInfo, typeByLevel);

  if (matrix.rows.length > 0) {
    elements.push(buildEnglishSectionTitleParagraph("EXAM MATRIX"));
    elements.push(buildEnglishMatrixTable(matrix));
  }
  if (specRows.length > 0) {
    elements.push(new Paragraph({ text: "", pageBreakBefore: true }));
    elements.push(buildEnglishSectionTitleParagraph("TEST SPECIFICATION"));
    elements.push(buildEnglishSpecificationTable(specRows));
  }
  return elements;
}

function buildDocxSections(examMeta, translatedContent, { includeAnswers, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  const frontMatterElements = buildFrontMatterElements({
    questions: translatedContent?.questions,
    chaptersInfo,
    typeByLevel,
    includeMatrixAndSpec,
  });
  const hasFrontMatter = frontMatterElements.length > 0;

  const children = [
    ...frontMatterElements,
    new Paragraph({
      alignment: AlignmentType.CENTER,
      pageBreakBefore: hasFrontMatter,
      children: [textRun(examMeta?.title || "ENGLISH TEST", { bold: true, size: 30 })],
      spacing: { after: 60 },
    }),
    ...metaLines(examMeta).map(
      (l) =>
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [textRun(l, { italics: true, size: 22 })],
          spacing: { after: 40 },
        })
    ),
    new Paragraph({ text: "", spacing: { after: 120 } }),
  ];

  if (examMeta?.objective) {
    children.push(paragraph(`Objective: ${examMeta.objective}`, { run: { italics: true } }));
  }

  children.push(heading(includeAnswers ? "ANSWER KEY" : "QUESTIONS"));
  children.push(
    ...buildQuestionParagraphs({
      questions: translatedContent?.questions,
      teacherRubric: translatedContent?.teacherRubric,
      includeAnswers,
    })
  );

  return children;
}

export function buildEnglishExamDocument(examMeta, translatedContent, { includeAnswers = false, ...rest } = {}) {
  return new Document({
    sections: [
      { properties: pageProperties, children: buildDocxSections(examMeta, translatedContent, { includeAnswers, ...rest }) },
    ],
  });
}

export async function buildEnglishExamDocxBlob(examMeta, translatedContent, opts) {
  return buildDocxBlob(buildEnglishExamDocument(examMeta, translatedContent, opts));
}

function fileBaseFor(examMeta) {
  return (examMeta?.title || "English-Test").trim().replace(/\s+/g, "-").slice(0, 60);
}

/**
 * Đúng khuôn exportBothVersions() bản tiếng Việt: nếu có teacherRubric thì xuất ĐỒNG THỜI 2 file
 * (bản Học sinh sạch + bản Giáo viên có đáp án); nếu không có rubric (includeAnswers=false lúc
 * tạo đề) thì chỉ xuất 1 file câu hỏi.
 */
export async function exportEnglishExamToWord(
  examMeta,
  translatedContent,
  { chaptersInfo = [], typeByLevel = {}, includeMatrixAndSpec = true } = {}
) {
  const fileBase = fileBaseFor(examMeta);
  const hasRubric = translatedContent?.teacherRubric?.length > 0;

  // Ma trận/Bản đặc tả chỉ có ý nghĩa với giáo viên - CHỈ chèn vào bản Giáo viên (đúng khuôn
  // exportBothVersions() bản tiếng Việt: bản Học sinh luôn "sạch"), nếu không có rubric thì bản
  // Học sinh (file duy nhất) mới kèm theo.
  await saveDocx(
    buildEnglishExamDocument(examMeta, translatedContent, {
      includeAnswers: false,
      chaptersInfo,
      typeByLevel,
      includeMatrixAndSpec: includeMatrixAndSpec && !hasRubric,
    }),
    `${fileBase}-EN-Student.docx`
  );

  if (hasRubric) {
    await saveDocx(
      buildEnglishExamDocument(examMeta, translatedContent, {
        includeAnswers: true,
        chaptersInfo,
        typeByLevel,
        includeMatrixAndSpec,
      }),
      `${fileBase}-EN-Teacher.docx`
    );
  }
}

function buildHtmlFrontMatter({ questions, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  if (!includeMatrixAndSpec || !chaptersInfo?.length) return "";
  const matrix = computeExamMatrix(questions, chaptersInfo, typeByLevel);
  const specRows = computeSpecificationRowsEn(questions, chaptersInfo, typeByLevel);
  let html = "";
  if (matrix.rows.length > 0) {
    html += htmlHeading("Exam Matrix");
    html += `<table><thead><tr><th>Chapter/Topic</th>${matrix.levelKeys
      .map((lvl) => `<th>${lvl}</th>`)
      .join("")}<th>Total</th><th>Points</th></tr></thead><tbody>`;
    html += matrix.rows
      .map(
        (r) =>
          `<tr><td>${r.label}</td>${matrix.levelKeys
            .map((lvl) => `<td>${r.counts[lvl] || ""}</td>`)
            .join("")}<td>${r.rowCount}</td><td>${r.rowPoints}</td></tr>`
      )
      .join("");
    html += `</tbody></table>`;
  }
  if (specRows.length > 0) {
    html += htmlHeading("Test Specification");
    html += `<table><thead><tr><th>No.</th><th>Chapter/Topic</th><th>Level</th><th>Type</th><th>Learning Outcome</th><th>Count</th><th>Question No.</th></tr></thead><tbody>`;
    html += specRows
      .map(
        (row) =>
          `<tr><td>${row.stt}</td><td>${row.chapterLabel}</td><td>${row.levelLabel}</td><td>${row.typeLabel}</td><td>${row.requirement}</td><td>${row.count}</td><td>${row.questionNumbers}</td></tr>`
      )
      .join("");
    html += `</tbody></table>`;
  }
  return html;
}

function buildHtmlBody(examMeta, translatedContent, { includeAnswers, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  let html = buildHtmlFrontMatter({
    questions: translatedContent?.questions,
    chaptersInfo,
    typeByLevel,
    includeMatrixAndSpec,
  });
  html += `<h1>${examMeta?.title || "ENGLISH TEST"}</h1>`;
  html += `<p class="doc-meta">${metaLines(examMeta).join("<br/>")}</p>`;
  if (examMeta?.objective) html += htmlParagraph(`Objective: ${examMeta.objective}`);
  html += htmlHeading(includeAnswers ? "Answer Key" : "Questions");

  (translatedContent?.questions || []).forEach((q, idx) => {
    html += `<p><strong>Question ${idx + 1}.</strong> ${(q.content || "").replace(/\n/g, "<br/>")}</p>`;
    if (Array.isArray(q.options) && q.options.length) {
      html += `<ul>${q.options.map((o) => `<li>${o}</li>`).join("")}</ul>`;
    }
    if (includeAnswers) {
      const rubric = translatedContent?.teacherRubric?.[idx];
      if (q.correctAnswer) html += htmlParagraph(`Correct answer: ${q.correctAnswer}`);
      if (rubric?.detailedSolution) html += htmlParagraph(`Solution: ${rubric.detailedSolution}`);
      if (rubric?.scoringGuide) html += htmlParagraph(`Scoring guide: ${rubric.scoringGuide}`);
    }
  });

  return html;
}

export function printEnglishExam(
  examMeta,
  translatedContent,
  { chaptersInfo = [], typeByLevel = {}, includeMatrixAndSpec = true } = {}
) {
  const includeAnswers = translatedContent?.teacherRubric?.length > 0;
  printHtmlDocument({
    title: examMeta?.title || "English Test",
    bodyHtml: buildHtmlBody(examMeta, translatedContent, {
      includeAnswers,
      chaptersInfo,
      typeByLevel,
      includeMatrixAndSpec,
    }),
  });
}
