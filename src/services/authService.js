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

/**
 * ================== SỬA LỖI (Phiên 12): "Phiên đăng nhập đã hết" hiện SAI khi web đang ở
 * chế độ CÔNG KHAI (NEXT_PUBLIC_DISABLE_LOGIN không đặt = "false", tức public mặc định - xem
 * apiAuth.js/page.js) ==================
 * Nguyên nhân: `WorksheetForm.jsx`/`OutlineForm.jsx`/`ExamMatrixForm.jsx`/`LessonPlanForm.jsx`
 * đều tự gọi thẳng `getSession()` (đọc localStorage) trước khi gửi request, rồi báo lỗi + CHẶN
 * request nếu không có session - nhưng ở chế độ public, giáo viên KHÔNG bao giờ đăng nhập nên
 * localStorage KHÔNG BAO GIỜ có session -> mọi lượt "Tạo phiếu bài tập" (và upload phiếu mẫu)
 * đều bị chặn ngay trên trình duyệt, dù server (`apiAuth.js`) đã bỏ qua xác thực. Trong khi đó
 * `page.js` xử lý ĐÚNG (tự gán TEST_USER khi DISABLE_LOGIN) nên màn hình đăng nhập không hiện ra
 * - khiến giáo viên vào thẳng được trang chính rồi mới dính lỗi lúc bấm nút, dễ gây nhầm lẫn.
 *
 * Cách sửa: thêm `DISABLE_LOGIN`/`TEST_SESSION` NGAY TẠI ĐÂY (cùng logic với `apiAuth.js`/
 * `page.js`) + hàm `getEffectiveSession()` = phiên thật sự nên dùng để gọi API, trả về
 * `TEST_SESSION` ngay khi đang ở chế độ public (không cần localStorage), hoặc `getSession()` như
 * cũ khi đăng nhập vẫn đang bật. 4 form trên đổi từ `getSession()` sang `getEffectiveSession()`
 * ở đúng những chỗ dùng để CHẶN submit + lấy `username` gửi kèm request.
 */
export const DISABLE_LOGIN = process.env.NEXT_PUBLIC_DISABLE_LOGIN !== "false";
export const TEST_SESSION = {
  username: "giao_vien_test",
  fullName: "Giáo viên (chế độ test)",
  role: "teacher",
};

export function getEffectiveSession() {
  if (DISABLE_LOGIN) return TEST_SESSION;
  return getSession();
}
