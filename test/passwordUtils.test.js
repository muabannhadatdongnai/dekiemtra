import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/services/passwordUtils.js";

test("hashPassword sinh ra chuỗi dạng salt:hash", () => {
  const stored = hashPassword("mat_khau_123");
  const parts = stored.split(":");
  assert.equal(parts.length, 2);
  assert.ok(parts[0].length > 0, "thiếu salt");
  assert.ok(parts[1].length > 0, "thiếu hash");
});

test("verifyPassword trả về true với đúng mật khẩu", () => {
  const stored = hashPassword("mat_khau_123");
  assert.equal(verifyPassword("mat_khau_123", stored), true);
});

test("verifyPassword trả về false với sai mật khẩu", () => {
  const stored = hashPassword("mat_khau_123");
  assert.equal(verifyPassword("mat_khau_sai", stored), false);
});

test("2 lần hash CÙNG 1 mật khẩu ra 2 chuỗi khác nhau (salt ngẫu nhiên mỗi lần)", () => {
  const a = hashPassword("cung_mat_khau");
  const b = hashPassword("cung_mat_khau");
  assert.notEqual(a, b);
  // nhưng cả 2 vẫn verify đúng với chính mật khẩu gốc
  assert.equal(verifyPassword("cung_mat_khau", a), true);
  assert.equal(verifyPassword("cung_mat_khau", b), true);
});

test("verifyPassword không throw với input rác/thiếu định dạng salt:hash", () => {
  assert.equal(verifyPassword("bat_ky", ""), false);
  assert.equal(verifyPassword("bat_ky", null), false);
  assert.equal(verifyPassword("bat_ky", undefined), false);
  assert.equal(verifyPassword("bat_ky", "khong_co_dau_hai_cham"), false);
  assert.equal(verifyPassword("bat_ky", "salt_khong_hop_le_zzz:cung_khong_hop_le"), false);
});

test("mật khẩu plaintext KHÔNG xuất hiện trong chuỗi đã hash", () => {
  const stored = hashPassword("admin123");
  assert.ok(!stored.includes("admin123"), "mật khẩu gốc bị lộ ra trong chuỗi hash!");
});
