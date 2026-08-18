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
  checkSampleAnalyzeLimit,
} from "../src/services/sampleAnalyzeRateLimiter.js";

/**
 * sampleAnalyzeRateLimiter.test.js
 * Việc còn lại đã xác định khi rà soát dự án: 3 route `/api/analyze-*` (phân tích file mẫu) chưa
 * có rate-limit, khác với 5 route `/api/generate*` (đã có teacherGenerateRateLimiter.js). File
 * test này theo ĐÚNG khuôn teacherGenerateRateLimiter.test.js (kiến trúc 2 lớp giống hệt), chỉ
 * đổi tên module/khoá quota vì đây là quota RIÊNG, không dùng chung với sinh nội dung chính.
 *
 * ⚠️ Test nhánh FILE JSON LOCAL (không có UPSTASH_REDIS_REST_URL/TOKEN trong môi trường test).
 * ⚠️ Mỗi test dùng 1 "username" RIÊNG BIỆT để không ảnh hưởng lẫn nhau.
 */

const USAGE_FILE = path.join(process.cwd(), ".data", "sample-analyze-usage.json");

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
  assert.equal(isBurstLimited("gv-analyze-burst-1"), false);
});

test("gọi dưới ngưỡng burst thì vẫn cho phép tiếp", () => {
  const username = "gv-analyze-burst-2";
  for (let i = 0; i < 5; i++) recordBurstCall(username);
  assert.equal(isBurstLimited(username), false);
});

test("gọi đủ ngưỡng burst (6 lượt/phút) thì bị chặn tạm", () => {
  const username = "gv-analyze-burst-3";
  for (let i = 0; i < 6; i++) recordBurstCall(username);
  assert.equal(isBurstLimited(username), true);
});

test("2 giáo viên khác nhau không ảnh hưởng burst-limit lẫn nhau", () => {
  const teacherA = "gv-analyze-burst-4a";
  const teacherB = "gv-analyze-burst-4b";
  for (let i = 0; i < 6; i++) recordBurstCall(teacherA);
  assert.equal(isBurstLimited(teacherA), true);
  assert.equal(isBurstLimited(teacherB), false);
});

// ================== Lớp 2: Daily (bền vững, nhánh local file) ==================

test("chưa gọi lần nào thì getDailyCallCount trả về 0", async () => {
  const count = await getDailyCallCount("gv-analyze-daily-chua-tung-goi");
  assert.equal(count, 0);
});

test("getDailyCallCount không throw khi file .data chưa tồn tại / dữ liệu lạ", async () => {
  await assert.doesNotReject(getDailyCallCount("gv-analyze-daily-bat-ky"));
});

// ================== checkSampleAnalyzeLimit (kết hợp cả 2 lớp) ==================

test("còn hạn mức -> allowed=true, đã ghi nhận đúng 1 lượt gọi mới", async () => {
  const username = "gv-analyze-check-1";
  const before = await getDailyCallCount(username);
  const result = await checkSampleAnalyzeLimit(username);

  assert.equal(result.allowed, true);
  assert.equal(result.reason, null);

  const after1 = await getDailyCallCount(username);
  assert.equal(after1, before + 1, "phải ghi nhận đúng 1 lượt gọi sau khi allowed=true");
});

test("vượt ngưỡng burst -> allowed=false, reason='burst', KHÔNG cộng thêm lượt daily", async () => {
  const username = "gv-analyze-check-burst";
  for (let i = 0; i < 6; i++) recordBurstCall(username);

  const before = await getDailyCallCount(username);
  const result = await checkSampleAnalyzeLimit(username);

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "burst");
  assert.ok(result.message);

  const after1 = await getDailyCallCount(username);
  assert.equal(after1, before, "bị chặn ở lớp burst thì KHÔNG được tính vào hạn mức ngày");
});

test("vượt trần theo ngày -> allowed=false, reason='daily'", async () => {
  const username = "gv-analyze-check-daily";
  process.env.SAMPLE_ANALYZE_DAILY_LIMIT = "3";
  try {
    assert.equal(getDailyLimit(), 3);

    // 3 lượt đầu hợp lệ (dưới burst-limit vì 3 < 6)
    for (let i = 0; i < 3; i++) {
      const r = await checkSampleAnalyzeLimit(username);
      assert.equal(r.allowed, true, `lượt thứ ${i + 1} phải còn trong hạn mức`);
    }

    // Lượt thứ 4 vượt trần ngày (chưa chạm burst-limit vì mới gọi 3 lần)
    const result = await checkSampleAnalyzeLimit(username);
    assert.equal(result.allowed, false);
    assert.equal(result.reason, "daily");
    assert.equal(result.dailyRemaining, 0);
  } finally {
    delete process.env.SAMPLE_ANALYZE_DAILY_LIMIT;
  }
});

test("getDailyLimit mặc định 20 khi không cấu hình biến môi trường (thấp hơn hạn mức sinh nội dung chính)", () => {
  delete process.env.SAMPLE_ANALYZE_DAILY_LIMIT;
  assert.equal(getDailyLimit(), 20);
});

test("getDailyLimit bỏ qua giá trị không hợp lệ (0, âm, không phải số) -> dùng mặc định", () => {
  for (const invalid of ["0", "-5", "abc", ""]) {
    process.env.SAMPLE_ANALYZE_DAILY_LIMIT = invalid;
    assert.equal(getDailyLimit(), 20, `giá trị "${invalid}" phải bị bỏ qua`);
  }
  delete process.env.SAMPLE_ANALYZE_DAILY_LIMIT;
});

test("quota tách RIÊNG với teacherGenerateRateLimiter.js - không dùng chung file usage", async () => {
  const generateUsageFile = path.join(process.cwd(), ".data", "teacher-generate-usage.json");
  const before = await fs
    .readFile(generateUsageFile, "utf8")
    .then((raw) => raw)
    .catch(() => null);

  await checkSampleAnalyzeLimit("gv-analyze-isolation");

  const after1 = await fs
    .readFile(generateUsageFile, "utf8")
    .then((raw) => raw)
    .catch(() => null);

  assert.equal(after1, before, "gọi checkSampleAnalyzeLimit KHÔNG được ghi vào file usage của teacherGenerateRateLimiter.js");
});
