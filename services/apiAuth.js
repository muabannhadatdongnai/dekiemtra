import { NextResponse } from "next/server";
import { verifySessionToken } from "./sessionToken";

/**
 * apiAuth.js
 * Dùng ở ĐẦU mỗi API route cần đăng nhập (generate, generate-worksheet, analyze-sample,
 * chapters). Đọc token từ header "Authorization: Bearer <token>", verify chữ ký + hạn dùng.
 *
 * ⚠️ NGUYÊN TẮC QUAN TRỌNG: KHÔNG bao giờ tin "username" do client tự gửi trong body/formData
 * (đây chính là lỗi bảo mật trước đây). Username xác thực LUÔN lấy từ `auth.session.username`
 * (đã verify qua token) - route KHÔNG được đọc lại `body.username` để quyết định danh tính.
 *
 * Cách dùng trong 1 route:
 *   export async function POST(request) {
 *     const auth = requireAuth(request);
 *     if (auth.error) return auth.error;       // đã là NextResponse 401, trả về luôn
 *     const { username, role } = auth.session;  // danh tính đã được xác thực thật sự
 *     ...
 *   }
 */
export function requireAuth(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  const session = verifySessionToken(token);
  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại." },
        { status: 401 }
      ),
    };
  }

  return { session, error: null };
}
