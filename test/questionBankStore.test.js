import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { getBankEntries, appendBankEntries } from "../src/services/questionBankStore.js";

/**
 * questionBankStore.test.js
 * ⚠️ Test này chạy nhánh FILE JSON LOCAL (vì không có UPSTASH_REDIS_REST_URL/TOKEN trong môi
 * trường test) - không test được nhánh Upstash thật ở đây (cần mạng + database thật). Nhánh
 * Upstash dùng CHUNG logic gộp/trim/parse phía trên `upstashAppend`/`upstashReadAll`, chỉ
 * khác lệnh gọi HTTP - rủi ro lệch hành vi thấp nhưng không phải bằng 0. Nên test thủ công 1
 * lần với Upstash thật (tạo đề 2 lần liên tiếp cho cùng 1 chương, xem lần 2 có bị lặp ý tưởng
 * câu hỏi lần 1 không) sau khi deploy thật, xem README trong thư mục test/.
 */

const TEST_DATA_DIR = path.join(process.cwd(), ".data", "question-bank");

// Dùng subject/grade riêng biệt cho test, không đụng dữ liệu thật, dễ dọn dẹp sau khi chạy.
const TEST_SUBJECT = "__test_subject__";
const TEST_GRADE = "__test_grade__";

after(async () => {
  // Dọn sạch dữ liệu test tạo ra, không để lại rác trong .data/
  try {
    const files = await fs.readdir(TEST_DATA_DIR);
    await Promise.all(
      files
        .filter((f) => f.includes("__test_subject__"))
        .map((f) => fs.unlink(path.join(TEST_DATA_DIR, f)))
    );
  } catch {
    // thư mục có thể chưa từng được tạo - bỏ qua
  }
});

test("chương chưa từng lưu câu hỏi nào -> trả về mảng rỗng, không throw", async () => {
  const entries = await getBankEntries({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    chapterIds: ["chuong_khong_ton_tai"],
  });
  assert.deepEqual(entries, []);
});

test("appendBankEntries rồi getBankEntries phải đọc lại đúng nội dung vừa lưu", async () => {
  const chapterId = "chuong_1";
  const questions = [
    { chapterRef: chapterId, content: "Câu hỏi test số 1", level: "NHAN_BIET", type: "trac_nghiem" },
    { chapterRef: chapterId, content: "Câu hỏi test số 2", level: "THONG_HIEU", type: "tu_luan" },
  ];

  await appendBankEntries({ subject: TEST_SUBJECT, grade: TEST_GRADE, questions });

  const entries = await getBankEntries({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    chapterIds: [chapterId],
  });

  assert.ok(entries.includes("Câu hỏi test số 1"));
  assert.ok(entries.includes("Câu hỏi test số 2"));
});

test("lưu 2 lần liên tiếp phải CỘNG DỒN (không ghi đè), đúng tinh thần bền vững", async () => {
  const chapterId = "chuong_2";

  await appendBankEntries({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    questions: [{ chapterRef: chapterId, content: "Lần tạo thứ nhất", level: "NHAN_BIET" }],
  });
  await appendBankEntries({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    questions: [{ chapterRef: chapterId, content: "Lần tạo thứ hai", level: "VAN_DUNG" }],
  });

  const entries = await getBankEntries({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    chapterIds: [chapterId],
  });

  assert.ok(entries.includes("Lần tạo thứ nhất"), "mất dữ liệu lần tạo trước - không bền vững!");
  assert.ok(entries.includes("Lần tạo thứ hai"));
});

test("câu hỏi thiếu chapterRef hoặc content bị bỏ qua, không lưu rác", async () => {
  const chapterId = "chuong_3";
  await appendBankEntries({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    questions: [
      { chapterRef: chapterId, content: "" }, // thiếu content
      { content: "Không có chapterRef" }, // thiếu chapterRef
      { chapterRef: chapterId, content: "Câu hợp lệ duy nhất" },
    ],
  });

  const entries = await getBankEntries({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    chapterIds: [chapterId],
  });

  assert.deepEqual(entries, ["Câu hợp lệ duy nhất"]);
});

test("gộp câu hỏi từ NHIỀU chương cùng lúc khi gọi getBankEntries", async () => {
  await appendBankEntries({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    questions: [
      { chapterRef: "chuong_multi_a", content: "Câu ở chương A" },
      { chapterRef: "chuong_multi_b", content: "Câu ở chương B" },
    ],
  });

  const entries = await getBankEntries({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    chapterIds: ["chuong_multi_a", "chuong_multi_b"],
  });

  assert.ok(entries.includes("Câu ở chương A"));
  assert.ok(entries.includes("Câu ở chương B"));
});
