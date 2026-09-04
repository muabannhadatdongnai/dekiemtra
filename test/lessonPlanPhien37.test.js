import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { buildEnglishLessonPlanDocxBlob } from "../src/services/englishLessonPlanExportService.js";
import { buildEnglishOutlineDocxBlob } from "../src/services/englishOutlineExportService.js";
import { buildEnglishExamDocxBlob } from "../src/services/englishExamExportService.js";
import { buildLessonPlanPrompt } from "../src/data/lessonPlanPromptTemplates.js";
import { buildOutlinePrompt } from "../src/data/outlinePromptTemplates.js";
import { LESSON_PLAN_COLUMN_MODES } from "../src/data/lessonPlanTemplates.js";
import { assertValidParagraphNesting, findInvalidParagraphNesting } from "./wordSchemaAssertions.js";

/**
 * lessonPlanPhien37.test.js
 * Test cho 2 fix của Phiên 37 (báo lỗi thực tế từ Khoa, kèm ảnh chụp màn hình + file .docx lỗi thật):
 *
 * a) "Word experienced an error trying to open the file" khi tải file Word tiếng Anh tab Soạn
 *    Giáo Án (bài dạy NHIỀU TIẾT + chế độ bảng 2 cột) - root cause: periodBoundaryTableRowEn()
 *    (englishLessonPlanExportService.js) truyền cả 1 `new Paragraph({...})` làm `opts.children`
 *    cho `cell()` (foreignLanguageDocBuilder.js) - hàm này LUÔN tự bọc `opts.children` trong 1
 *    Paragraph khác -> sinh XML `<w:p><w:p>...</w:p></w:p>` (paragraph lồng paragraph), VI PHẠM
 *    schema CT_P dù vẫn là XML "well-formed" (JSZip/ElementTree/python-docx/LibreOffice đều
 *    KHOAN DUNG với lỗi này nên các lớp test cũ không bắt được - chỉ MS Word thật mới từ chối mở).
 *    Xem test/wordSchemaAssertions.js để biết cách phát hiện lớp lỗi này mà không cần Word thật.
 *
 * b) "Thư ngỏ gửi Phụ huynh" (`outline.thuNgoPhuHuynh`) ở tab Đề Cương Ôn Tập môn Tiếng Anh trước
 *    đây bị dịch/viết sang tiếng Anh do buildForeignLanguageOutputDirective() không truyền
 *    exemptJsonFields cho trường này - phụ huynh không đọc được. Nay đúng khuôn "Tin nhắn gửi phụ
 *    huynh" đã áp dụng cho Soạn Giáo Án: LUÔN giữ tiếng Việt.
 */

// ============================= (a) Fix lồng thẻ w:p trong bảng "Hết Tiết" =============================

function buildMultiPeriodEnglishLessonPlan() {
  return {
    tenBai: "Unit 1: Hobbies",
    yeuCauCanDat: { kienThuc: ["Distinguish target sounds."] },
    doDungDayHoc: { giaoVien: ["Audio"], hocSinh: ["Textbook"] },
    hoatDong: [
      {
        ten: "Warm-up",
        mucTieu: "Engage students.",
        tienTrinh: [{ tiet: 1, hoatDongGVHS: "Greet students, play warm-up game.", sanPhamDuKien: "Students engaged." }],
      },
      {
        ten: "Presentation",
        mucTieu: "New vocabulary.",
        // Bước đầu vẫn ở Tiết 1, bước sau đã sang Tiết 2 -> PHẢI chèn ranh giới "Hết Tiết 1" ở
        // đúng khối "Presentation" (đây chính xác là kịch bản gây lỗi trong file .docx thật đã
        // upload: bảng 2 cột 4 hoạt động, "Homework" nằm cuối Tiết 2).
        tienTrinh: [
          { tiet: 1, hoatDongGVHS: "Introduce /ə/ and /3:/ sounds.", sanPhamDuKien: "Students repeat sounds." },
          { tiet: 2, hoatDongGVHS: "Move to Period 2: review + new vocabulary.", sanPhamDuKien: "Students note vocabulary." },
        ],
      },
      {
        ten: "Practice",
        mucTieu: "Practice.",
        tienTrinh: [{ tiet: 2, hoatDongGVHS: "Do Worksheet 1.", sanPhamDuKien: "Completed worksheet." }],
      },
      {
        ten: "Application",
        mucTieu: "Apply.",
        tienTrinh: [{ tiet: 2, hoatDongGVHS: "Homework: complete Worksheet 1.", sanPhamDuKien: "Homework noted." }],
      },
    ],
  };
}

test("buildEnglishLessonPlanDocxBlob: bài dạy NHIỀU TIẾT + chế độ bảng 2 cột -> XML KHÔNG được lồng <w:p> trong <w:p> (fix lỗi Word không mở được file)", async () => {
  const lessonPlan = buildMultiPeriodEnglishLessonPlan();
  const blob = await buildEnglishLessonPlanDocxBlob(lessonPlan, {
    tenBai: lessonPlan.tenBai,
    grade: 6,
    soTiet: 2,
    subjectLabelEn: "English",
    columnMode: LESSON_PLAN_COLUMN_MODES.TWO_COLUMN,
  });
  const buffer = Buffer.from(await blob.arrayBuffer());
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml").async("string");

  // Phải THỰC SỰ chèn được ranh giới "Hết Tiết" trong bảng (nếu không, test không kiểm tra đúng
  // nhánh code đã gây lỗi - periodBoundaryTableRowEn() chỉ chạy khi có boundary thật).
  assert.ok(xml.includes("End of Period 1"), "Phải chèn ranh giới 'End of Period 1' trong bảng 2 cột");
  assert.ok(!xml.includes("<w:p><w:p>"), "KHÔNG được có <w:p> lồng trực tiếp trong <w:p> khác");
  assertValidParagraphNesting(xml, "englishLessonPlanExportService (multi-period, 2-column)");
});

test("findInvalidParagraphNesting: tự kiểm tra hàm dò lỗi bắt đúng trường hợp lồng sai (dương tính giả/âm tính giả)", () => {
  const bad = "<w:tbl><w:tr><w:tc><w:p><w:p><w:r><w:t>x</w:t></w:r></w:p></w:p></w:tc></w:tr></w:tbl>";
  const good = "<w:tbl><w:tr><w:tc><w:p><w:r><w:t>x</w:t></w:r></w:p></w:tc></w:tr></w:tbl>";
  assert.equal(findInvalidParagraphNesting(bad).length, 1, "Phải bắt được 1 lỗi ở trường hợp lồng sai");
  assert.equal(findInvalidParagraphNesting(good).length, 0, "KHÔNG được báo lỗi ở XML hợp lệ");
});

// ============================= (b) Thư ngỏ gửi Phụ huynh giữ tiếng Việt (Đề Cương Ôn Tập) =============================

test("buildOutlinePrompt: chỉ thị AI cho môn Tiếng Anh phải NGOẠI LỆ trường 'thuNgoPhuHuynh' (giữ tiếng Việt)", () => {
  const prompt = buildOutlinePrompt({
    subject: "Tieng_Anh",
    grade: 5,
    volume: null,
    chapterId: null,
    exerciseCounts: { coBan: 2, nangCao: 1, vanDungCao: 0 },
    soNgayOnTap: 3,
  });
  assert.match(prompt, /NGOẠI LỆ DUY NHẤT.*"thuNgoPhuHuynh"/s, "Prompt phải nêu ngoại lệ cho trường thuNgoPhuHuynh");
  assert.match(prompt, /"thuNgoPhuHuynh".*PHẢI viết bằng TIẾNG VIỆT/s);
});

test("buildEnglishOutlineDocxBlob: Thư ngỏ gửi Phụ huynh (thuNgoPhuHuynh) được giữ NGUYÊN VĂN tiếng Việt trong file Word tiếng Anh", async () => {
  const outline = {
    tenDeCuong: "Study Outline - Unit 3",
    kienThucCotLoi: [{ tieuMuc: "Vocabulary", noiDung: "Words about hobbies." }],
    thuNgoPhuHuynh:
      "Kính gửi quý phụ huynh, đây là đề cương ôn tập giúp con nắm vững từ vựng về sở thích.",
  };
  const blob = await buildEnglishOutlineDocxBlob(outline, { subjectLabelEn: "English", grade: 5 });
  const buffer = Buffer.from(await blob.arrayBuffer());
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml").async("string");

  assert.ok(
    xml.includes("Kính gửi quý phụ huynh, đây là đề cương ôn tập giúp con nắm vững từ vựng về sở thích."),
    "Nội dung Thư ngỏ gửi Phụ huynh (tiếng Việt) phải xuất hiện NGUYÊN VĂN trong file Word"
  );
  assertValidParagraphNesting(xml, "englishOutlineExportService");
});

// ============================= Lớp bảo vệ chung: các docx tiếng Anh khác cũng không được lồng sai =============================

test("buildEnglishExamDocxBlob: XML không được lồng <w:p>/<w:tbl> sai schema", async () => {
  const examMeta = { title: "English Test", grade: 5 };
  const translatedContent = {
    questions: [{ content: "Choose the correct answer.", options: ["A. cat", "B. dog"], correctAnswer: "A" }],
  };
  const blob = await buildEnglishExamDocxBlob(examMeta, translatedContent, { includeMatrixAndSpec: false });
  const buffer = Buffer.from(await blob.arrayBuffer());
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml").async("string");
  assertValidParagraphNesting(xml, "englishExamExportService");
});
