import crypto from "crypto";

/**
 * passwordUtils.js
 * Hash + verify mật khẩu bằng scrypt (module "crypto" có sẵn trong Node - KHÔNG cần thêm
 * dependency như bcrypt, giữ đúng tinh thần "$0 chi phí, ít phụ thuộc" của dự án).
 *
 * ⚠️ TRƯỚC ĐÂY: users.json lưu mật khẩu PLAINTEXT (vd "password": "admin123"). Nếu file này
 * lỡ lộ ra ngoài (commit nhầm lên GitHub Public - đã từng xảy ra 1 lần với GEMINI_API_KEY,
 * xem PROJECT_SUMMARY.md mục 8) thì mật khẩu của TẤT CẢ giáo viên bị lộ ngay lập tức, không
 * có gì để cứu vãn. Từ giờ users.json CHỈ lưu "passwordHash" dạng "salt:hash" - không thể suy
 * ngược ra mật khẩu gốc.
 *
 * Định dạng lưu trữ: "<salt_hex>:<hash_hex>" - salt ngẫu nhiên MỖI mật khẩu (kể cả 2 giáo viên
 * lỡ đặt trùng mật khẩu thì hash lưu trong file vẫn khác nhau hoàn toàn).
 */

const KEY_LENGTH = 64;
const SALT_BYTES = 16;

/** Dùng khi TẠO tài khoản mới hoặc đổi mật khẩu (xem scripts/hash-password.js). */
export function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const hash = crypto.scryptSync(plainPassword, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * So khớp mật khẩu người dùng nhập với hash đã lưu. Dùng crypto.timingSafeEqual để tránh
 * "timing attack" (so sánh chuỗi thường bằng === có thể lộ thông tin qua thời gian phản hồi).
 */
export function verifyPassword(plainPassword, storedHash) {
  if (!storedHash || typeof storedHash !== "string" || !storedHash.includes(":")) {
    return false;
  }
  const [salt, hashHex] = storedHash.split(":");
  if (!salt || !hashHex) return false;

  try {
    const storedBuffer = Buffer.from(hashHex, "hex");

    // ⚠️ PHÁT HIỆN QUA TEST TỰ ĐỘNG (xem test/passwordUtils.test.js): Buffer.from(str, "hex")
    // của Node KHÔNG throw khi gặp ký tự không hợp lệ trong hex - nó ÂM THẦM CẮT NGẮN, có thể
    // ra buffer 0 byte (vd hashHex bị hỏng/ghi sai). Nếu không chặn ở đây, storedBuffer rỗng
    // sẽ khiến scryptSync bên dưới cũng trả về buffer rỗng, và timingSafeEqual(rỗng, rỗng) =
    // true MỘT CÁCH SAI LẦM - tức BẤT KỲ mật khẩu nào cũng "verify đúng" nếu dữ liệu hash bị
    // hỏng. Hash hợp lệ LUÔN đúng KEY_LENGTH byte - sai độ dài là dữ liệu hỏng, từ chối ngay.
    if (storedBuffer.length !== KEY_LENGTH) return false;

    const candidateBuffer = crypto.scryptSync(plainPassword, salt, storedBuffer.length);
    return crypto.timingSafeEqual(storedBuffer, candidateBuffer);
  } catch {
    return false;
  }
}
