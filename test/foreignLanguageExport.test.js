import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import {
  FOREIGN_LANGUAGE_SUBJECTS,
  findForeignLanguageConfig,
  supportsForeignLanguageExport,
} from "../src/data/foreignLanguageSubjects.js";
import { buildForeignLanguageTranslationPrompt } from "../src/data/foreignLanguagePromptTemplates.js";
import { buildEnglishLessonPlanDocxBlob } from "../src/services/englishLessonPlanExportService.js";
import { buildEnglishOutlineDocxBlob } from "../src/services/englishOutlineExportService.js";
import { buildEnglishExamDocxBlob } from "../src/services/englishExamExportService.js";

/**
 * foreignLanguageExport.test.js
 * Test cho tính năng "Bản ngoại ngữ" (Soạn Giáo Án/Đề Cương Ôn Tập/Đề Kiểm tra môn Tiếng Anh) -
 * ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY - dùng thật "docx"/"jszip" (không mock), đúng khuôn
 * lessonPlanExportService.test.js/outlineExportService.test.js.
 *
 * Chạy: node --test test/foreignLanguageExport.test.js
 */

async function extractDocumentXml(blob) {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.ok(zip.file("word/document.xml"), "thiếu word/document.xml - file .docx không hợp lệ");
  return zip.file("word/document.xml").async("string");
}

// ---------- 1. Danh bạ foreignLanguageSubjects.js ----------

test("findForeignLanguageConfig: khớp theo GIÁ TRỊ thô (vd Soạn Giáo Án/Đề Cương lưu 'Tieng_Anh')", () => {
  const cfg = findForeignLanguageConfig("Tieng_Anh");
  assert.ok(cfg, "phải tìm thấy cấu hình cho Tieng_Anh");
  assert.equal(cfg.languageCode, "en");
  assert.equal(cfg.languageNameEn, "English");
});

test("findForeignLanguageConfig: khớp theo NHÃN tiếng Việt (vd Đề Kiểm tra lưu sẵn 'Tiếng Anh')", () => {
  const cfg = findForeignLanguageConfig("Tiếng Anh");
  assert.ok(cfg, "phải tìm thấy cấu hình khi tra theo nhãn hiển thị");
  assert.equal(cfg.subjectValue, "Tieng_Anh");
});

test("findForeignLanguageConfig: môn không hỗ trợ (Toán) hoặc rỗng -> trả về null", () => {
  assert.equal(findForeignLanguageConfig("Toan"), null);
  assert.equal(findForeignLanguageConfig(null), null);
  assert.equal(findForeignLanguageConfig(undefined), null);
  assert.equal(findForeignLanguageConfig(""), null);
});

test("supportsForeignLanguageExport: đúng boolean tương ứng", () => {
  assert.equal(supportsForeignLanguageExport("Tieng_Anh"), true);
  assert.equal(supportsForeignLanguageExport("Toan"), false);
});

test("danh bạ dễ mở rộng: mỗi entry có đủ field bắt buộc (subjectValue/subjectLabelVi/languageCode/languageNameEn/buttonLabel)", () => {
  FOREIGN_LANGUAGE_SUBJECTS.forEach((entry) => {
    assert.ok(entry.subjectValue, "thiếu subjectValue");
    assert.ok(entry.subjectLabelVi, "thiếu subjectLabelVi");
    assert.ok(entry.languageCode, "thiếu languageCode");
    assert.ok(entry.languageNameEn, "thiếu languageNameEn");
    assert.ok(entry.buttonLabel, "thiếu buttonLabel");
  });
});

// ---------- 2. Prompt dịch ----------

test("buildForeignLanguageTranslationPrompt: chứa dữ liệu gốc + tên ngôn ngữ đích + quy tắc giữ nguyên cấu trúc JSON", () => {
  const prompt = buildForeignLanguageTranslationPrompt({
    data: { tenBai: "Ôn tập Unit 1" },
    languageNameEn: "English",
    contentKindLabel: "a lesson plan (kế hoạch bài dạy)",
  });

  assert.ok(prompt.includes("Ôn tập Unit 1"), "prompt phải chứa nguyên văn dữ liệu JSON đầu vào");
  assert.ok(prompt.includes("English"), "prompt phải nêu rõ ngôn ngữ đích");
  assert.match(prompt, /GIỮ NGUYÊN 100% cấu trúc JSON/, "phải có quy tắc giữ nguyên cấu trúc/khoá JSON");
  assert.match(prompt, /CHỈ trả về JSON hợp lệ/, "phải có quy tắc chỉ trả JSON, không kèm markdown/lời dẫn");
});

// ---------- 3. englishLessonPlanExportService.js ----------

function makeLessonPlan(overrides = {}) {
  return {
    tenBai: "Unit 1: My New School",
    yeuCauCanDat: {
      kienThuc: ["Understand new vocabulary about school."],
      nangLuc: ["Develop listening and speaking skills."],
      phamChat: ["Be responsible in group work."],
    },
    doDungDayHoc: { giaoVien: ["Flashcards, speaker"], hocSinh: ["Textbook, notebook"] },
    hoatDong: [
      {
        ten: "Warm-up",
        mucTieu: "Activate prior knowledge.",
        tienTrinh: [{ hoatDongGVHS: "Teacher greets students and asks warm-up questions.", sanPhamDuKien: "Students respond in English." }],
      },
    ],
    goiYHocLieuHinhAnh: ["a bright classroom with students"],
    ...overrides,
  };
}

test("buildEnglishLessonPlanDocxBlob: dựng .docx hợp lệ, chứa tiêu đề tiếng Anh + đúng nội dung đã dịch", async () => {
  const blob = await buildEnglishLessonPlanDocxBlob(makeLessonPlan(), { grade: 6, soTiet: 2, subjectLabelEn: "English" });
  const xml = await extractDocumentXml(blob);

  assert.ok(xml.includes("LESSON PLAN"), "phải có tiêu đề LESSON PLAN");
  assert.ok(xml.includes("Unit 1: My New School"), "phải chứa tên bài đã dịch");
  assert.ok(xml.includes("LEARNING OBJECTIVES"), "phải có mục Learning Objectives");
  assert.ok(xml.includes("Understand new vocabulary about school"), "phải chứa nội dung kiến thức đã dịch");
  assert.ok(xml.includes("Warm-up"), "phải chứa tên hoạt động");
  assert.ok(xml.includes("Teacher greets students"), "phải chứa nội dung tiến trình hoạt động");
  assert.ok(xml.includes("a bright classroom with students"), "phải chứa phụ lục gợi ý học liệu hình ảnh");
});

test("buildEnglishLessonPlanDocxBlob: KHÔNG lỗi khi thiếu field tuỳ chọn (goiYHocLieuHinhAnh)", async () => {
  const { goiYHocLieuHinhAnh, ...withoutSuggestions } = makeLessonPlan();
  const blob = await buildEnglishLessonPlanDocxBlob(withoutSuggestions, { grade: 6 });
  const xml = await extractDocumentXml(blob);
  assert.ok(xml.includes("Unit 1: My New School"));
});

// ---------- 4. englishOutlineExportService.js ----------

function makeOutline(overrides = {}) {
  return {
    tenDeCuong: "English Study Outline - Grade 6",
    kienThucCotLoi: [{ tieuMuc: "Present simple tense", noiDung: "Used for habits and facts." }],
    dangBai: [
      {
        tenDang: "Type 1: Fill in the blank",
        luuY: "Pay attention to subject-verb agreement.",
        baiMauDe: "She ___ (go) to school every day.",
        baiMauLoiGiai: "She goes to school every day.",
        canhBaoBayLoi: "Students often forget the -s ending.",
      },
    ],
    nganHangBaiTap: {
      coBan: [{ de: "He ___ (play) football.", dapAn: "plays" }],
      nangCao: [],
      vanDungCao: [],
    },
    loTrinhOnTap: [{ ngay: "Day 1", nhiemVu: "Review Unit 1 vocabulary." }],
    thuNgoPhuHuynh: "Dear parents, please spend 10 minutes a day helping your child review.",
    ...overrides,
  };
}

test("buildEnglishOutlineDocxBlob: dựng .docx hợp lệ, chứa tiêu đề + đủ 5 mục + nội dung đã dịch", async () => {
  const blob = await buildEnglishOutlineDocxBlob(makeOutline(), { grade: 6, subjectLabelEn: "English" });
  const xml = await extractDocumentXml(blob);

  assert.ok(xml.includes("STUDY OUTLINE"));
  assert.ok(xml.includes("English Study Outline - Grade 6"));
  assert.ok(xml.includes("Present simple tense"));
  assert.ok(xml.includes("Fill in the blank"));
  assert.ok(xml.includes("She goes to school every day"));
  assert.ok(xml.includes("Common mistake"));
  assert.ok(xml.includes("Basic"), "phải dịch nhãn mức 'Cơ bản' -> 'Basic'");
  assert.ok(xml.includes("Review Unit 1 vocabulary"));
  assert.ok(xml.includes("Dear parents"));
});

// ---------- 5. englishExamExportService.js ----------

function makeExamContent(overrides = {}) {
  return {
    questions: [
      {
        content: "Choose the correct answer: I ___ to school every day.",
        options: ["A. go", "B. goes", "C. going", "D. went"],
        correctAnswer: "A",
      },
    ],
    teacherRubric: [
      { correctAnswer: "A", detailedSolution: "Present simple with 'I' uses the base form.", scoringGuide: "1 point for correct answer." },
    ],
    ...overrides,
  };
}

test("buildEnglishExamDocxBlob (includeAnswers=false): bản Học sinh có câu hỏi, KHÔNG có đáp án/lời giải", async () => {
  const blob = await buildEnglishExamDocxBlob(
    { title: "English Test - Grade 6", grade: 6, duration: 45, subjectLabelEn: "English" },
    makeExamContent(),
    { includeAnswers: false }
  );
  const xml = await extractDocumentXml(blob);

  assert.ok(xml.includes("English Test - Grade 6"));
  assert.ok(xml.includes("Choose the correct answer"));
  assert.ok(xml.includes("A. go"));
  assert.ok(!xml.includes("Present simple with"), "bản Học sinh KHÔNG được có lời giải chi tiết");
});

test("buildEnglishExamDocxBlob (includeAnswers=true): bản Giáo viên có đủ đáp án + lời giải + biểu điểm", async () => {
  const blob = await buildEnglishExamDocxBlob(
    { title: "English Test - Grade 6", grade: 6 },
    makeExamContent(),
    { includeAnswers: true }
  );
  const xml = await extractDocumentXml(blob);

  assert.ok(xml.includes("ANSWER KEY"));
  assert.ok(xml.includes("Present simple with"), "bản Giáo viên phải có lời giải chi tiết");
  assert.ok(xml.includes("1 point for correct answer"), "bản Giáo viên phải có biểu điểm");
});
