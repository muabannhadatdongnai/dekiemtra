import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import {
  FOREIGN_LANGUAGE_SUBJECTS,
  findForeignLanguageConfig,
  supportsForeignLanguageExport,
  buildForeignLanguageOutputDirective,
} from "../src/data/foreignLanguageSubjects.js";
import { INTEGRATION_KEYS } from "../src/data/lessonPlanIntegrations.js";
import { buildEnglishLessonPlanDocxBlob } from "../src/services/englishLessonPlanExportService.js";
import { buildEnglishOutlineDocxBlob } from "../src/services/englishOutlineExportService.js";
import { buildEnglishExamDocxBlob } from "../src/services/englishExamExportService.js";

/**
 * foreignLanguageExport.test.js
 * Test cho tính năng "Môn ngoại ngữ sinh nội dung trực tiếp bằng đúng ngôn ngữ đó" (Soạn Giáo
 * Án/Đề Cương Ôn Tập/Đề Kiểm tra môn Tiếng Anh) - ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY - dùng thật
 * "docx"/"jszip" (không mock), đúng khuôn lessonPlanExportService.test.js/outlineExportService.test.js.
 *
 * ⚠️ Phiên 35: ĐỔI TÊN Ý NGHĨA - trước đây file này test luồng DỊCH (Gemini dịch lại JSON đã sinh
 * tiếng Việt). Từ Phiên 35, kiến trúc dịch (foreignLanguageOrchestrator.js/
 * foreignLanguageTranslationEngine.js/foreignLanguagePromptTemplates.js/ForeignLanguageExportButton.jsx)
 * ĐÃ BỊ XOÁ - AI sinh nội dung TRỰC TIẾP bằng ngôn ngữ đích ngay từ đầu (xem
 * buildForeignLanguageOutputDirective() bên dưới), nên phần test "prompt dịch" cũ đã được thay
 * bằng test cho chỉ thị ngôn ngữ mới. Phần test 3 file englishLessonPlanExportService.js/
 * englishOutlineExportService.js/englishExamExportService.js GIỮ NGUYÊN Ý NGHĨA (vẫn nhận đúng
 * schema JSON như cũ, chỉ khác nguồn gốc dữ liệu đầu vào - trước là bản dịch, giờ là bản sinh
 * thẳng - không ảnh hưởng tới cách các file này dựng .docx).
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

// ---------- 2. Chỉ thị ngôn ngữ đầu ra (buildForeignLanguageOutputDirective) ----------

test("buildForeignLanguageOutputDirective: môn ngoại ngữ -> nêu rõ tên ngôn ngữ đích + quy tắc số thập phân quốc tế", () => {
  const directive = buildForeignLanguageOutputDirective("Tieng_Anh");
  assert.ok(directive.includes("English"), "phải nêu rõ ngôn ngữ đích");
  assert.match(directive, /DẤU CHẤM/, "phải yêu cầu số thập phân dùng dấu chấm kiểu quốc tế");
});

test("buildForeignLanguageOutputDirective: môn KHÔNG phải ngoại ngữ (vd Toán) -> trả về chuỗi rỗng", () => {
  assert.equal(buildForeignLanguageOutputDirective("Toan"), "");
  assert.equal(buildForeignLanguageOutputDirective(null), "");
});

test("buildForeignLanguageOutputDirective: có exemptJsonFields -> nêu rõ field ngoại lệ vẫn giữ tiếng Việt", () => {
  const directive = buildForeignLanguageOutputDirective("Tieng_Anh", {
    exemptJsonFields: [INTEGRATION_KEYS.TIN_NHAN_PHU_HUYNH],
  });
  assert.ok(directive.includes(INTEGRATION_KEYS.TIN_NHAN_PHU_HUYNH), "phải nêu tên field ngoại lệ");
  assert.match(directive, /TIẾNG VIỆT/, "phải nêu rõ field ngoại lệ giữ tiếng Việt");
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

test("buildEnglishLessonPlanDocxBlob: dựng .docx hợp lệ, chứa tiêu đề tiếng Anh + đúng nội dung", async () => {
  const blob = await buildEnglishLessonPlanDocxBlob(makeLessonPlan(), { grade: 6, soTiet: 2, subjectLabelEn: "English" });
  const xml = await extractDocumentXml(blob);

  assert.ok(xml.includes("LESSON PLAN"), "phải có tiêu đề LESSON PLAN");
  assert.ok(xml.includes("Unit 1: My New School"), "phải chứa tên bài");
  assert.ok(xml.includes("LEARNING OBJECTIVES"), "phải có mục Learning Objectives");
  assert.ok(xml.includes("Understand new vocabulary about school"), "phải chứa nội dung kiến thức");
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

test("buildEnglishLessonPlanDocxBlob: 'Tin nhắn gửi phụ huynh' LUÔN giữ tiêu đề + nội dung tiếng Việt", async () => {
  const lessonPlan = makeLessonPlan({
    tinNhanPhuHuynh: "Kính gửi quý phụ huynh, hôm nay con đã học Unit 1 rất tốt ạ.",
  });
  const blob = await buildEnglishLessonPlanDocxBlob(lessonPlan, { grade: 6 });
  const xml = await extractDocumentXml(blob);
  assert.ok(xml.includes("PH\u1EE4 L\u1EE4C"), "phải có tiêu đề PHỤ LỤC (tiếng Việt)");
  assert.ok(xml.includes("Kính gửi quý phụ huynh"), "phải giữ nguyên nội dung tiếng Việt, không dịch");
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

test("buildEnglishOutlineDocxBlob: dựng .docx hợp lệ, chứa tiêu đề + đủ 5 mục + nội dung", async () => {
  const blob = await buildEnglishOutlineDocxBlob(makeOutline(), { grade: 6, subjectLabelEn: "English" });
  const xml = await extractDocumentXml(blob);

  assert.ok(xml.includes("STUDY OUTLINE"));
  assert.ok(xml.includes("English Study Outline - Grade 6"));
  assert.ok(xml.includes("Present simple tense"));
  assert.ok(xml.includes("Fill in the blank"));
  assert.ok(xml.includes("She goes to school every day"));
  assert.ok(xml.includes("Common mistake"));
  assert.ok(xml.includes("Basic"), "phải hiển thị nhãn mức 'Basic'");
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
        chapterRef: "unit1",
        level: "NHAN_BIET",
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

test("buildEnglishExamDocxBlob: includeMatrixAndSpec=true -> có 'EXAM MATRIX' + 'TEST SPECIFICATION' bằng tiếng Anh", async () => {
  const blob = await buildEnglishExamDocxBlob(
    { title: "English Test - Grade 6", grade: 6 },
    makeExamContent(),
    {
      includeAnswers: false,
      chaptersInfo: [{ chapterId: "unit1", label: "Unit 1" }],
      typeByLevel: { NHAN_BIET: "trac_nghiem" },
      includeMatrixAndSpec: true,
    }
  );
  const xml = await extractDocumentXml(blob);
  assert.ok(xml.includes("EXAM MATRIX"), "phải có bảng Ma trận đề bằng tiếng Anh");
  assert.ok(xml.includes("TEST SPECIFICATION"), "phải có bảng Bản đặc tả bằng tiếng Anh");
  assert.ok(xml.includes("Knowledge"), "phải có nhãn mức độ tiếng Anh (Knowledge = Nhận biết)");
});

