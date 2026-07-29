#!/usr/bin/env node
/**
 * scripts/hash-password.js
 * Công cụ dòng lệnh tạo "passwordHash" để thêm tài khoản giáo viên mới hoặc đổi mật khẩu
 * trong src/data/users.json. Viết bằng CommonJS thuần (require, không import) + chỉ dùng
 * module "crypto" có sẵn của Node để chạy trực tiếp bằng `node`, không cần qua bước build
 * của Next.js (logic hash giống hệt src/services/passwordUtils.js - nếu sửa 1 nơi, nhớ sửa
 * cả 2 để không bị lệch định dạng).
 *
 * CÁCH DÙNG:
 *   node scripts/hash-password.js "mat_khau_moi"
 *
 * Sau đó copy dòng "passwordHash" in ra vào src/data/users.json, dạng:
 *   {
 *     "ten_dang_nhap_moi": {
 *       "passwordHash": "<dán chuỗi in ra ở đây>",
 *       "fullName": "Tên hiển thị",
 *       "role": "teacher"
 *     }
 *   }
 */

const crypto = require("crypto");

const KEY_LENGTH = 64;
const SALT_BYTES = 16;

function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const hash = crypto.scryptSync(plainPassword, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

const password = process.argv[2];

if (!password) {
  console.error("Thiếu mật khẩu. Cách dùng: node scripts/hash-password.js \"mat_khau_moi\"");
  process.exit(1);
}

if (password.length < 6) {
  console.warn("⚠️ Mật khẩu khá ngắn (dưới 6 ký tự) - nên đặt dài hơn để khó đoán/dò hơn.");
}

console.log("\npasswordHash:");
console.log(hashPassword(password));
console.log("\n(Copy chuỗi trên vào field \"passwordHash\" trong src/data/users.json)\n");
