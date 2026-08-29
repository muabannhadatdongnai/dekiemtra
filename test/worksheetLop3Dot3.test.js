import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { generateThuThapSoLieu, EXERCISE_TYPES } from "../src/data/worksheetSchemas.js";
import { getSelectableCatalogFor } from "../src/data/worksheetExerciseCatalog.js";
import { generateWorksheet } from "../src/services/worksheetGenerator.js";
import { buildWorksheetDocxBlob } from "../src/services/worksheetExportService.js";

/**
 * worksheetLop3Dot3.test.js
 * MỞ RỘNG LỚP 3, ĐỢT 3 - "Thu thập, phân loại số liệu" (đọc bảng/biểu đồ cột).
 *
 * ⚠️ BỐI CẢNH: generator (`generateThuThapSoLieu`), catalog, orchestrator
 * (`worksheetGenerator.js`), preview (`ThuThapSoLieuSection`) và Word export
 * (`buildThuThapSoLieuParagraphs`) đã được code từ trước (NEXT_STEPS.md từng đánh dấu nhầm là
 * "còn thiếu"/"cần làm" - đúng như tình huống `ThuThapSoLieuSection` đã ghi nhận), nhưng CHƯA hề
 * có test tự động nào xác nhận. File này lấp khoảng trống đó, không viết lại logic.
 */

test("EXERCISE_TYPES có key thu_thap_so_lieu", () => {
  assert.equal(EXERCISE_TYPES.THU_THAP_SO_LIEU, "thu_thap_so_lieu");
});

test("thu_thap_so_lieu chỉ xuất hiện trong catalog Lớp 3, không lộ ra khối lớp khác", () => {
  for (const grade of ["MAM_NON", "LOP_1", "LOP_2", "LOP_4", "LOP_5"]) {
    const catalog = getSelectableCatalogFor(grade, "TOAN");
    assert.ok(
      !catalog.some((item) => item.key === "thu_thap_so_lieu"),
      `"thu_thap_so_lieu" lộ ra ở khối ${grade}`
    );
  }
  const lop3Catalog = getSelectableCatalogFor("LOP_3", "TOAN");
  assert.ok(lop3Catalog.some((item) => item.key === "thu_thap_so_lieu"), "thiếu ở Lớp 3");
});

test("generateThuThapSoLieu trả về đúng cấu trúc {title, data, questions} và đúng số câu hỏi yêu cầu", () => {
  for (let i = 0; i < 30; i++) {
    const survey = generateThuThapSoLieu(4);
    assert.equal(typeof survey.title, "string");
    assert.ok(survey.title.length > 0);
    assert.ok(Array.isArray(survey.data));
    assert.ok(survey.data.length >= 4 && survey.data.length <= 5, "số hạng mục phải trong khoảng 4-5");
    for (const d of survey.data) {
      assert.equal(typeof d.label, "string");
      assert.ok(Number.isInteger(d.value) && d.value >= 3 && d.value <= 15, `giá trị "${d.value}" ngoài phạm vi 3-15`);
    }
    assert.equal(survey.questions.length, 4);
    for (const q of survey.questions) {
      assert.equal(typeof q.text, "string");
      assert.equal(typeof q.answer, "string");
    }
  }
});

test("generateThuThapSoLieu đảm bảo giá trị lớn nhất/nhỏ nhất DUY NHẤT (câu hỏi nhiều nhất/ít nhất luôn có 1 đáp án đúng)", () => {
  for (let i = 0; i < 50; i++) {
    const { data } = generateThuThapSoLieu(4);
    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    assert.equal(values.filter((v) => v === max).length, 1, "có >1 hạng mục cùng giá trị lớn nhất");
    assert.equal(values.filter((v) => v === min).length, 1, "có >1 hạng mục cùng giá trị nhỏ nhất");
  }
});

test("generateThuThapSoLieu: câu hỏi 'nhiều nhất/ít nhất/tổng' khớp đúng dữ liệu bảng đi kèm", () => {
  for (let i = 0; i < 30; i++) {
    const { data, questions } = generateThuThapSoLieu(4);
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const maxItem = data.reduce((a, b) => (b.value > a.value ? b : a));
    const minItem = data.reduce((a, b) => (b.value < a.value ? b : a));

    for (const q of questions) {
      if (q.text.endsWith("nhiều bạn yêu thích nhất?")) {
        assert.equal(q.answer, maxItem.label);
      } else if (q.text.endsWith("ít bạn yêu thích nhất?")) {
        assert.equal(q.answer, minItem.label);
      } else if (q.text === "Có tất cả bao nhiêu bạn tham gia khảo sát?") {
        assert.equal(q.answer, `${total} bạn`);
      } else {
        const match = data.find((d) => q.text === `Có bao nhiêu bạn yêu thích ${d.label}?`);
        if (match) assert.equal(q.answer, `${match.value} bạn`);
      }
    }
  }
});

test("generateWorksheet (Lớp 3) tạo đúng section type thu_thap_so_lieu với dữ liệu hợp lệ", async () => {
  const worksheet = await generateWorksheet({
    grade: "LOP_3",
    subject: "TOAN",
    exerciseCounts: { thu_thap_so_lieu: 3 },
  });
  const section = worksheet.sections.find((s) => s.type === "thu_thap_so_lieu");
  assert.ok(section, "không tìm thấy section thu_thap_so_lieu trong phiếu");
  assert.equal(typeof section.surveyTitle, "string");
  assert.ok(Array.isArray(section.data) && section.data.length > 0);
  assert.equal(section.questions.length, 3);
  assert.ok(typeof section.mascot === "string" && section.mascot.length > 0);
});

test("generateWorksheet: nếu count=0 hoặc key không hợp lệ với khối lớp thì không sinh ra section thu_thap_so_lieu", async () => {
  const worksheet = await generateWorksheet({
    grade: "LOP_1", // khối không hợp lệ cho key này - phải bị lọc ở server dù client gửi lên
    subject: "TOAN",
    exerciseCounts: { thu_thap_so_lieu: 4, tinh_nham: 3 },
  });
  assert.ok(!worksheet.sections.some((s) => s.type === "thu_thap_so_lieu"));
});

test("buildWorksheetDocxBlob: xuất Word hợp lệ cho phiếu có thu_thap_so_lieu, chứa đúng tiêu đề khảo sát và câu hỏi", async () => {
  const worksheet = await generateWorksheet({
    grade: "LOP_3",
    subject: "TOAN",
    exerciseCounts: { thu_thap_so_lieu: 4 },
  });
  const section = worksheet.sections.find((s) => s.type === "thu_thap_so_lieu");

  const blob = await buildWorksheetDocxBlob({ worksheet, meta: { title: "TEST" }, showAnswers: true });
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.ok(zip.file("word/document.xml"), "file .docx không hợp lệ - thiếu document.xml");

  const xml = await zip.file("word/document.xml").async("string");
  assert.ok(xml.includes(section.surveyTitle), "thiếu tiêu đề khảo sát trong Word");
  for (const q of section.questions) {
    assert.ok(xml.includes(q.text.replace(/&/g, "&amp;")), `thiếu câu hỏi "${q.text}" trong Word`);
    // Bản giáo viên (showAnswers=true) phải có sẵn đáp án, không phải chỗ trống.
    assert.ok(xml.includes(q.answer), `thiếu đáp án "${q.answer}" trong bản giáo viên`);
  }

  // Cột số liệu phải dùng ẢNH (ImageRun tái sử dụng CÙNG 1 file PNG gốc, chỉ đổi
  // transformation.width theo giá trị - docx.js dedupe theo nội dung byte nên chỉ ra 1 file
  // media, không phải mỗi hạng mục 1 file riêng), KHÔNG phải ký tự Unicode hình khối - đúng
  // bài học Phiên 24 ("ký tự Unicode hình khối ép font Times New Roman gây trống ô trong Word
  // thật", đã sửa bằng ẢNH PNG cho cả biểu đồ cột "Thu thập số liệu").
  const mediaFiles = Object.keys(zip.files).filter((f) => f.startsWith("word/media/") && f.endsWith(".png"));
  assert.ok(mediaFiles.length >= 1, "thiếu ảnh cột số liệu (media PNG) trong file Word");
});

test("buildWorksheetDocxBlob: bản học sinh (showAnswers=false) KHÔNG lộ đáp án thu_thap_so_lieu", async () => {
  const worksheet = await generateWorksheet({
    grade: "LOP_3",
    subject: "TOAN",
    exerciseCounts: { thu_thap_so_lieu: 4 },
  });
  const section = worksheet.sections.find((s) => s.type === "thu_thap_so_lieu");

  const blob = await buildWorksheetDocxBlob({ worksheet, meta: { title: "TEST" }, showAnswers: false });
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  const xml = await zip.file("word/document.xml").async("string");

  for (const q of section.questions) {
    // So khớp CHÍNH XÁC cụm "Trả lời: <đáp án>" (không chỉ tìm đáp án như 1 chuỗi con rời rạc -
    // các giá trị số liệu 3-15 có thể trùng substring lẫn nhau, VD "3 bạn" là chuỗi con của
    // "13 bạn", dễ báo sai nếu so khớp thô).
    assert.ok(
      !xml.includes(`Trả lời: ${q.answer}`),
      `đáp án "${q.answer}" bị lộ ra ở bản học sinh (câu: "${q.text}")`
    );
  }
});
