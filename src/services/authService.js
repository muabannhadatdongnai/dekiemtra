import users from "@/data/users.json";
import { verifyPassword } from "./passwordUtils";

/**
 * authService.js
 * - Xác thực dựa trên file tĩnh users.json (giáo viên tự thêm tài khoản thủ công).
 * - ⚠️ CẬP NHẬT BẢO MẬT: mật khẩu trong users.json giờ lưu dạng HASH (scrypt, xem
 *   passwordUtils.js), KHÔNG còn plaintext. Đăng nhập thành công -> server cấp session TOKEN
 *   đã ký (xem sessionToken.js), client lưu token này và gửi kèm mọi request sau đó qua header
 *   Authorization - KHÔNG còn gửi lại "username" trần để server tự tin theo kiểu cũ.
 *
 * ⚠️ CHỖ CẦN THAY ĐỔI: thêm tài khoản giáo viên mới bằng lệnh:
 *   node scripts/hash-password.js "mat_khau_moi"
 * rồi copy chuỗi "passwordHash" in ra vào src/data/users.json, dạng:
 *   { "username": { "passwordHash": "...", "fullName": "...", "role": "teacher" } }
 */

const STORAGE_KEY = "exam_generator_session";

/** Dùng ở server (API route /api/login) - KHÔNG import file này trong component client để tránh lộ users.json. */
export function verifyCredentials(username, password) {
  const user = users[username];
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return { username, fullName: user.fullName, role: user.role };
}

/** ================= Helpers phía CLIENT (localStorage) ================= */

/**
 * Lưu phiên đăng nhập: token đã ký + hạn dùng + thông tin hiển thị (fullName, role).
 * @param {{ token: string, expiresAt: number, user: { username, fullName, role } }} loginResponse
 */
export function saveSession({ token, expiresAt, user }) {
  if (typeof window === "undefined") return;
  const flat = { token, expiresAt, ...user };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(flat));
}

/**
 * Đọc phiên đăng nhập hiện tại. Tự xoá + trả về null nếu token đã hết hạn (client-side check,
 * chỉ để UI phản hồi nhanh gọn hơn - server VẪN tự verify lại chữ ký + hạn dùng ở mọi request,
 * không tin riêng việc kiểm tra này ở phía client).
 */
export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
