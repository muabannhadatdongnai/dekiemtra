import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import {
  isBurstLimited,
  recordBurstCall,
  __resetBurstStoreForTests,
  getDailyLimit,
  getDailyCallCount,
  checkTeacherGenerateLimit,
} from "../src/services/teacherGenerateRateLimiter.js";

/**
 * teacherGenerateRateLimiter.test.js
 * ⚠️ Test nhánh FILE JSON LOCAL (không có UPSTASH_REDIS_REST_URL/TOKEN trong môi trường test) -
 * cùng ghi chú như geminiUsageTracker.test.js: nhánh Upstash dùng chung logic, chỉ khác lệnh gọi
 * HTTP, test thủ công riêng sau khi cấu hình Upstash thật.
 *
 * ⚠️ Mỗi test dùng 1 "username" RIÊNG BIỆT (giả lập giáo viên khác nhau) để không ảnh hưởng lẫn
 * nhau, giống hệt tinh thần loginRateLimiter.test.js - cả burstStore (Map trong bộ nhớ) LẪN file
 * JSON local đều là state DÙNG CHUNG xuyên suốt file test này.
 */

const USAGE_FILE = path.join(process.cwd(), ".data", "teacher-generate-usage.json");

beforeEach(() => {
  __resetBurstStoreForTests();
});

after(async () => {
  try {
    await fs.unlink(USAGE_FILE);
  } catch {
    // file có thể chưa từng được tạo - bỏ qua
  }
});

// ================== Lớp 1: Burst (trong bộ nhớ) ==================

test("chưa gọi lần nào thì không bị burst-limit", () => {
  assert.equal(isBurstLimited("gv-burst-1"), false);
});

test("gọi dưới ngưỡng burst thì vẫn cho phép tiếp", () => {
  const username = "gv-burst-2";
  for (let i = 0; i < 5; i++) recordBurstCall(username);
  assert.equal(isBurstLimited(username), false);
});

test("gọi đủ ngưỡng burst (6 lượt/phút) thì bị chặn tạm", () => {
  const username = "gv-burst-3";
  for (let i = 0; i < 6; i++) recordBurstCall(username);
  assert.equal(isBurstLimited(username), true);
});

test("2 giáo viên khác nhau không ảnh hưởng burst-limit lẫn nhau", () => {
  const teacherA = "gv-burst-4a";
  const teacherB = "gv-burst-4b";
  for (let i = 0; i < 6; i++) recordBurstCall(teacherA);
  assert.equal(isBurstLimited(teacherA), true);
  assert.equal(isBurstLimited(teacherB), false);
});

// ================== Lớp 2: Daily (bền vững, nhánh local file) ==================

test("chưa gọi lần nào thì getDailyCallCount trả về 0", async () => {
  const count = await getDailyCallCount("gv-daily-chua-tung-goi");
  assert.equal(count, 0);
});

test("getDailyCallCount không throw khi file .data chưa tồn tại / dữ liệu lạ", async () => {
  await assert.doesNotReject(getDailyCallCount("gv-daily-bat-ky"));
});

// ================== checkTeacherGenerateLimit (kết hợp cả 2 lớp) ==================

test("còn hạn mức -> allowed=true, đã ghi nhận đúng 1 lượt gọi mới", async () => {
  const username = "gv-check-1";
  const before = await getDailyCallCount(username);
  const result = await checkTeacherGenerateLimit(username);

  assert.equal(result.allowed, true);
  assert.equal(result.reason, null);

  const after1 = await getDailyCallCount(username);
  assert.equal(after1, before + 1, "phải ghi nhận đúng 1 lượt gọi sau khi allowed=true");
});

test("vượt ngưỡng burst -> allowed=false, reason='burst', KHÔNG cộng thêm lượt daily", async () => {
  const username = "gv-check-burst";
  for (let i = 0; i < 6; i++) recordBurstCall(username);

  const before = await getDailyCallCount(username);
  const result = await checkTeacherGenerateLimit(username);

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "burst");
  assert.ok(result.message);

  const after1 = await getDailyCallCount(username);
  assert.equal(after1, before, "bị chặn ở lớp burst thì KHÔNG được tính vào hạn mức ngày");
});

test("vượt trần theo ngày -> allowed=false, reason='daily'", async () => {
  const username = "gv-check-daily";
  process.env.TEACHER_DAILY_GENERATE_LIMIT = "3";
  try {
    assert.equal(getDailyLimit(), 3);

    // 3 lượt đầu hợp lệ (dưới burst-limit vì 3 < 6)
    for (let i = 0; i < 3; i++) {
      const r = await checkTeacherGenerateLimit(username);
      assert.equal(r.allowed, true, `lượt thứ ${i + 1} phải còn trong hạn mức`);
    }

    // Lượt thứ 4 vượt trần ngày (chưa chạm burst-limit vì mới gọi 3 lần)
    const result = await checkTeacherGenerateLimit(username);
    assert.equal(result.allowed, false);
    assert.equal(result.reason, "daily");
    assert.equal(result.dailyRemaining, 0);
  } finally {
    delete process.env.TEACHER_DAILY_GENERATE_LIMIT;
  }
});

test("getDailyLimit mặc định 40 khi không cấu hình biến môi trường", () => {
  delete process.env.TEACHER_DAILY_GENERATE_LIMIT;
  assert.equal(getDailyLimit(), 40);
});

test("getDailyLimit bỏ qua giá trị không hợp lệ (0, âm, không phải số) -> dùng mặc định", () => {
  for (const invalid of ["0", "-5", "abc", ""]) {
    process.env.TEACHER_DAILY_GENERATE_LIMIT = invalid;
    assert.equal(getDailyLimit(), 40, `giá trị "${invalid}" phải bị bỏ qua`);
  }
  delete process.env.TEACHER_DAILY_GENERATE_LIMIT;
});
