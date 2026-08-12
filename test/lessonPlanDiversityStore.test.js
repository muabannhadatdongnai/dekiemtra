import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import {
  getDiversityEntries,
  appendDiversityEntry,
  DIVERSITY_SIMILARITY_WARNING_THRESHOLD,
} from "../src/services/lessonPlanDiversityStore.js";

/**
 * lessonPlanDiversityStore.test.js
 * GIAI ĐOẠN 10, Việc 3/7 - cùng khuôn với questionBankStore.test.js (test nhánh FILE JSON LOCAL,
 * vì môi trường test không có UPSTASH_REDIS_REST_URL/TOKEN - xem giải thích đầy đủ ở đó).
 */

const TEST_DATA_DIR = path.join(process.cwd(), ".data", "lesson-plan-diversity");
const TEST_SUBJECT = "__test_subject__";
const TEST_GRADE = "__test_grade__";

after(async () => {
  try {
    const files = await fs.readdir(TEST_DATA_DIR);
    await Promise.all(
      files.filter((f) => f.includes("__test_subject__")).map((f) => fs.unlink(path.join(TEST_DATA_DIR, f)))
    );
  } catch {
    // thư mục có thể chưa từng được tạo - bỏ qua
  }
});

test("tổ hợp chưa từng lưu ý tưởng nào -> trả về mảng rỗng, không throw", async () => {
  const entries = await getDiversityEntries({ subject: TEST_SUBJECT, grade: TEST_GRADE, tenBai: "Bài chưa từng có" });
  assert.deepEqual(entries, []);
});

test("lưu 1 ý tưởng -> đọc lại đúng nội dung + styleId", async () => {
  const tenBai = "Phép cộng trong phạm vi 10";
  await appendDiversityEntry({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    tenBai,
    openingIdea: "Trò chơi đố vui về con vật",
    styleId: "nang_dong",
  });
  const entries = await getDiversityEntries({ subject: TEST_SUBJECT, grade: TEST_GRADE, tenBai });
  assert.equal(entries.length, 1);
  assert.equal(entries[0].openingIdea, "Trò chơi đố vui về con vật");
  assert.equal(entries[0].styleId, "nang_dong");
});

test("2 cách gõ tên bài khác biệt (hoa/thường/khoảng trắng thừa) vẫn map về ĐÚNG 1 tổ hợp lưu trữ", async () => {
  const tenBai = "Phép trừ trong phạm vi 10";
  await appendDiversityEntry({
    subject: TEST_SUBJECT,
    grade: TEST_GRADE,
    tenBai,
    openingIdea: "Kể chuyện về chú thỏ",
  });
  const variant = "   phép TRỪ  trong phạm vi 10   ";
  const entries = await getDiversityEntries({ subject: TEST_SUBJECT, grade: TEST_GRADE, tenBai: variant });
  assert.equal(entries.length, 1);
  assert.equal(entries[0].openingIdea, "Kể chuyện về chú thỏ");
});

test("khác khối hoặc khác môn -> KHÔNG lẫn dữ liệu giữa các tổ hợp", async () => {
  const tenBai = "Bài kiểm tra tách biệt tổ hợp";
  await appendDiversityEntry({ subject: TEST_SUBJECT, grade: TEST_GRADE, tenBai, openingIdea: "Ý tưởng gốc" });

  const differentGrade = await getDiversityEntries({ subject: TEST_SUBJECT, grade: "__khac_khoi__", tenBai });
  assert.equal(differentGrade.length, 0);

  const differentSubject = await getDiversityEntries({ subject: "__khac_mon__", grade: TEST_GRADE, tenBai });
  assert.equal(differentSubject.length, 0);
});

test("không truyền openingIdea (rỗng) -> appendDiversityEntry bỏ qua, không lưu entry rác", async () => {
  const tenBai = "Bài test entry rỗng";
  await appendDiversityEntry({ subject: TEST_SUBJECT, grade: TEST_GRADE, tenBai, openingIdea: "" });
  const entries = await getDiversityEntries({ subject: TEST_SUBJECT, grade: TEST_GRADE, tenBai });
  assert.equal(entries.length, 0);
});

test("DIVERSITY_SIMILARITY_WARNING_THRESHOLD là hằng số hợp lệ trong khoảng (0, 1)", () => {
  assert.ok(DIVERSITY_SIMILARITY_WARNING_THRESHOLD > 0 && DIVERSITY_SIMILARITY_WARNING_THRESHOLD < 1);
});
