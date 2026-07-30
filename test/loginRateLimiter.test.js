import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
} from "../src/services/loginRateLimiter.js";

// ⚠️ Mỗi test dùng 1 "key" (giả lập IP) RIÊNG BIỆT để không ảnh hưởng lẫn nhau, vì
// attemptsStore là module-level Map dùng chung xuyên suốt cả file test này.

test("chưa có lần sai nào thì không bị giới hạn", () => {
  const key = "ip-test-1";
  assert.equal(isRateLimited(key), false);
});

test("sai dưới ngưỡng thì vẫn cho phép đăng nhập tiếp", () => {
  const key = "ip-test-2";
  for (let i = 0; i < 5; i++) recordFailedAttempt(key);
  assert.equal(isRateLimited(key), false);
});

test("sai đủ ngưỡng (8 lần) thì bị khoá tạm thời", () => {
  const key = "ip-test-3";
  for (let i = 0; i < 8; i++) recordFailedAttempt(key);
  assert.equal(isRateLimited(key), true);
});

test("clearAttempts (đăng nhập đúng) xoá hết lịch sử sai trước đó", () => {
  const key = "ip-test-4";
  for (let i = 0; i < 8; i++) recordFailedAttempt(key);
  assert.equal(isRateLimited(key), true);
  clearAttempts(key);
  assert.equal(isRateLimited(key), false);
});

test("các IP khác nhau không ảnh hưởng lẫn nhau", () => {
  const keyA = "ip-test-5a";
  const keyB = "ip-test-5b";
  for (let i = 0; i < 8; i++) recordFailedAttempt(keyA);
  assert.equal(isRateLimited(keyA), true);
  assert.equal(isRateLimited(keyB), false);
});
