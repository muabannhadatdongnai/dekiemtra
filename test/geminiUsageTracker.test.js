import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { recordGeminiCall, getTodayUsageSummary, maskKey } from "../src/services/geminiUsageTracker.js";

/**
 * geminiUsageTracker.test.js
 * ⚠️ Test nhánh FILE JSON LOCAL (không có UPSTASH_REDIS_REST_URL/TOKEN trong môi trường test).
 * Nhánh Upstash dùng chung logic gộp/parse, chỉ khác lệnh gọi HTTP - nên test thủ công 1 lần
 * với Upstash thật sau khi cấu hình (xem test/README.md).
 */

const USAGE_FILE = path.join(process.cwd(), ".data", "gemini-usage.json");

after(async () => {
  try {
    await fs.unlink(USAGE_FILE);
  } catch {
    // file có thể chưa từng được tạo - bỏ qua
  }
});

test("maskKey chỉ giữ lại 4 ký tự cuối, không lộ toàn bộ key", () => {
  assert.equal(maskKey("AIzaSyABCDEFG1234"), "...1234");
  assert.equal(maskKey(""), "????");
  assert.equal(maskKey(null), "????");
});

test("ghi nhận 1 lượt gọi thành công -> đọc lại đúng tổng số", async () => {
  const maskedKey = maskKey("test-key-aaaa1111");
  await recordGeminiCall({ rawKey: "test-key-aaaa1111", outcome: "success" });

  const summary = await getTodayUsageSummary([maskedKey]);
  assert.equal(summary.unavailable, false);
  assert.ok(summary.total >= 1);
  assert.ok(summary.perKey[maskedKey] >= 1);
});

test("ghi nhận lỗi hết quota -> quotaErrors tăng, lỗi khác thì KHÔNG tăng quotaErrors", async () => {
  const before = await getTodayUsageSummary([]);
  const beforeQuotaErrors = before.quotaErrors;

  await recordGeminiCall({ rawKey: "test-key-bbbb2222", outcome: "quota_exhausted" });
  await recordGeminiCall({ rawKey: "test-key-bbbb2222", outcome: "other_error" });

  const after1 = await getTodayUsageSummary([]);
  assert.equal(after1.quotaErrors, beforeQuotaErrors + 1, "quotaErrors phải tăng đúng 1, không phải 2");
});

test("getTodayUsageSummary không throw khi truyền mảng key rỗng", async () => {
  const summary = await getTodayUsageSummary([]);
  assert.equal(summary.unavailable, false);
  assert.deepEqual(summary.perKey, {});
});

test("recordGeminiCall không throw dù outcome lạ / rawKey thiếu", async () => {
  await assert.doesNotReject(recordGeminiCall({ rawKey: undefined, outcome: "success" }));
  await assert.doesNotReject(recordGeminiCall({ rawKey: "abcd", outcome: "khong_hop_le" }));
});
