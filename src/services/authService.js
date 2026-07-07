import users from "@/data/users.json";

/**
 * authService.js
 * - Xác thực dựa trên file tĩnh users.json (giáo viên tự thêm tài khoản thủ công).
 * - KHÔNG dùng JWT phức tạp: chỉ verify server-side (không lộ password ra client),
 *   sau đó lưu trạng thái đăng nhập ở localStorage phía client (đủ dùng cho quy mô nội bộ).
 *
 * ⚠️ CHỖ CẦN THAY ĐỔI: thêm tài khoản giáo viên tại src/data/users.json, dạng:
 *   { "username": { "password": "...", "fullName": "...", "role": "teacher" } }
 */

const STORAGE_KEY = "exam_generator_session";

/** Dùng ở server (API route) - KHÔNG import file này trong component client để tránh lộ users.json. */
export function verifyCredentials(username, password) {
  const user = users[username];
  if (!user) return null;
  if (user.password !== password) return null;
  return { username, fullName: user.fullName, role: user.role };
}

/** ================= Helpers phía CLIENT (localStorage) ================= */

export function saveSession(user) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
