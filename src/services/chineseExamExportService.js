import { Document, Paragraph, AlignmentType } from "docx";
import {
  pageProperties,
  saveDocx,
  buildDocxBlob,
  printHtmlDocument,
  htmlHeading,
  htmlParagraph,
  createLanguageHelpers,
} from "./foreignLanguageDocBuilder";
import { computeExamMatrix } from "./specificationBuilder";
import { computeSpecificationRowsZh } from "./chineseSpecificationBuilder";
import {
  buildChineseSectionTitleParagraph,
  buildChineseMatrixTable,
  buildChineseSpecificationTable,
} from "./chineseSpecificationExportBuilders";

/**
 * chineseExamExportService.js
 * Bản TIẾNG TRUNG của englishExamExportService.js - xuất Word/PDF cho "Đề Kiểm tra" môn Tiếng
 * Trung (Ngoại ngữ 2). Nhận THẲNG `content` ({ questions, teacherRubric }) đã được AI sinh trực
 * tiếp bằng tiếng Trung (xem buildForeignLanguageOutputDirective() - foreignLanguageSubjects.js).
 * Bản gốc tiếng Việt (exportService.js) và bản tiếng Anh (englishExamExportService.js) giữ NGUYÊN
 * VẸN, không đổi.
 *
 * ⚠️ FONT: dùng createLanguageHelpers() với `eastAsia: "SimSun"` - xem
 * chineseLessonPlanExportService.js để biết lý do đầy đủ.
 */

const FONT_ZH = { ascii: "Times New Roman", hAnsi: "Times New Roman", cs: "Times New Roman", eastAsia: "SimSun" };
const PRINT_FONT_FAMILY_ZH = '"SimSun", "Microsoft YaHei", "PingFang SC", "Times New Roman", serif';

const { textRun, paragraph, heading } = createLanguageHelpers(FONT_ZH);

function metaLines(meta) {
  const lines = [];
  if (meta?.schoolName) lines.push(meta.schoolName);
  const line2 = [];
  if (meta?.subjectLabelEn) line2.push(`科目：${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") line2.push(`年级：${meta.grade}`);
  if (meta?.className) line2.push(`班级：${meta.className}`);
  if (line2.length) lines.push(line2.join("   |   "));
  const line3 = [];
  if (meta?.duration) line3.push(`时间：${meta.duration} 分钟`);
  if (meta?.academicYear) line3.push(`学年：${meta.academicYear}`);
  if (line3.length) lines.push(line3.join("   |   "));
  return lines;
}

function buildQuestionParagraphs({ questions, teacherRubric, includeAnswers }) {
  const children = [];
  (questions || []).forEach((q, idx) => {
    children.push(paragraph(`第 ${idx + 1} 题。${q.content || ""}`, { run: { bold: true } }));
    if (Array.isArray(q.options) && q.options.length) {
      children.push(...q.options.map((opt) => paragraph(opt)));
    }
    if (includeAnswers) {
      const rubric = teacherRubric?.[idx];
      if (q.correctAnswer) children.push(paragraph(`正确答案：${q.correctAnswer}`, { run: { bold: true } }));
      if (rubric?.detailedSolution) children.push(paragraph(`解析：${rubric.detailedSolution}`));
      if (rubric?.scoringGuide) children.push(paragraph(`评分标准：${rubric.scoringGuide}`));
    } else {
      children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    }
  });
  return children;
}

function buildFrontMatterElements({ questions, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  const elements = [];
  if (!includeMatrixAndSpec || !chaptersInfo?.length) return elements;

  const matrix = computeExamMatrix(questions, chaptersInfo, typeByLevel);
  const specRows = computeSpecificationRowsZh(questions, chaptersInfo, typeByLevel);

  if (matrix.rows.length > 0) {
    elements.push(buildChineseSectionTitleParagraph("考试双向细目表"));
    elements.push(buildChineseMatrixTable(matrix));
  }
  if (specRows.length > 0) {
    elements.push(new Paragraph({ text: "", pageBreakBefore: true }));
    elements.push(buildChineseSectionTitleParagraph("命题细目表"));
    elements.push(buildChineseSpecificationTable(specRows));
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
      children: [textRun(examMeta?.title || "中文测验", { bold: true, size: 30 })],
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
    children.push(paragraph(`测验目标：${examMeta.objective}`, { run: { italics: true } }));
  }

  children.push(heading(includeAnswers ? "参考答案" : "试题"));
  children.push(
    ...buildQuestionParagraphs({
      questions: translatedContent?.questions,
      teacherRubric: translatedContent?.teacherRubric,
      includeAnswers,
    })
  );

  return children;
}

export function buildChineseExamDocument(examMeta, translatedContent, { includeAnswers = false, ...rest } = {}) {
  return new Document({
    sections: [
      { properties: pageProperties, children: buildDocxSections(examMeta, translatedContent, { includeAnswers, ...rest }) },
    ],
  });
}

export async function buildChineseExamDocxBlob(examMeta, translatedContent, opts) {
  return buildDocxBlob(buildChineseExamDocument(examMeta, translatedContent, opts));
}

function fileBaseFor(examMeta) {
  return (examMeta?.title || "Chinese-Test").trim().replace(/\s+/g, "-").slice(0, 60);
}

export async function exportChineseExamToWord(
  examMeta,
  translatedContent,
  { chaptersInfo = [], typeByLevel = {}, includeMatrixAndSpec = true } = {}
) {
  const fileBase = fileBaseFor(examMeta);
  const hasRubric = translatedContent?.teacherRubric?.length > 0;

  await saveDocx(
    buildChineseExamDocument(examMeta, translatedContent, {
      includeAnswers: false,
      chaptersInfo,
      typeByLevel,
      includeMatrixAndSpec: includeMatrixAndSpec && !hasRubric,
    }),
    `${fileBase}-ZH-Student.docx`
  );

  if (hasRubric) {
    await saveDocx(
      buildChineseExamDocument(examMeta, translatedContent, {
        includeAnswers: true,
        chaptersInfo,
        typeByLevel,
        includeMatrixAndSpec,
      }),
      `${fileBase}-ZH-Teacher.docx`
    );
  }
}

function buildHtmlFrontMatter({ questions, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  if (!includeMatrixAndSpec || !chaptersInfo?.length) return "";
  const matrix = computeExamMatrix(questions, chaptersInfo, typeByLevel);
  const specRows = computeSpecificationRowsZh(questions, chaptersInfo, typeByLevel);
  let html = "";
  if (matrix.rows.length > 0) {
    html += htmlHeading("考试双向细目表");
    html += `<table><thead><tr><th>章节/主题</th>${matrix.levelKeys
      .map((lvl) => `<th>${lvl}</th>`)
      .join("")}<th>总计</th><th>分数</th></tr></thead><tbody>`;
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
    html += htmlHeading("命题细目表");
    html += `<table><thead><tr><th>序号</th><th>章节/主题</th><th>难度</th><th>题型</th><th>学习要求</th><th>题量</th><th>题号</th></tr></thead><tbody>`;
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
  html += `<h1>${examMeta?.title || "中文测验"}</h1>`;
  html += `<p class="doc-meta">${metaLines(examMeta).join("<br/>")}</p>`;
  if (examMeta?.objective) html += htmlParagraph(`测验目标：${examMeta.objective}`);
  html += htmlHeading(includeAnswers ? "参考答案" : "试题");

  (translatedContent?.questions || []).forEach((q, idx) => {
    html += `<p><strong>第 ${idx + 1} 题。</strong>${(q.content || "").replace(/\n/g, "<br/>")}</p>`;
    if (Array.isArray(q.options) && q.options.length) {
      html += `<ul>${q.options.map((o) => `<li>${o}</li>`).join("")}</ul>`;
    }
    if (includeAnswers) {
      const rubric = translatedContent?.teacherRubric?.[idx];
      if (q.correctAnswer) html += htmlParagraph(`正确答案：${q.correctAnswer}`);
      if (rubric?.detailedSolution) html += htmlParagraph(`解析：${rubric.detailedSolution}`);
      if (rubric?.scoringGuide) html += htmlParagraph(`评分标准：${rubric.scoringGuide}`);
    }
  });

  return html;
}

export function printChineseExam(
  examMeta,
  translatedContent,
  { chaptersInfo = [], typeByLevel = {}, includeMatrixAndSpec = true } = {}
) {
  const includeAnswers = translatedContent?.teacherRubric?.length > 0;
  printHtmlDocument({
    title: examMeta?.title || "中文测验",
    bodyHtml: buildHtmlBody(examMeta, translatedContent, {
      includeAnswers,
      chaptersInfo,
      typeByLevel,
      includeMatrixAndSpec,
    }),
    fontFamily: PRINT_FONT_FAMILY_ZH,
  });
}
