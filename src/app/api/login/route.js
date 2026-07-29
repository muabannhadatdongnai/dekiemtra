import { NextResponse } from "next/server";
import { verifyCredentials } from "@/services/authService";
import { createSessionToken } from "@/services/sessionToken";
import {
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
  getClientKey,
} from "@/services/loginRateLimiter";

/**
 * API xác thực - kiểm tra username/password trên server, cấp session TOKEN đã ký (xem
 * sessionToken.js) nếu đúng. Client lưu token này và gửi kèm mọi request sau đó qua header
 * "Authorization: Bearer <token>" (xem authService.js + apiClient.js).
 *
 * Có rate-limit theo IP (xem loginRateLimiter.js) để chặn bot dò mật khẩu liên tục -
 * best-effort, không tuyệt đối 100% (xem giới hạn ghi trong loginRateLimiter.js).
 */
export async function POST(request) {
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút." },
      { status: 429 }
    );
  }

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu." },
      { status: 400 }
    );
  }

  const user = verifyCredentials(username, password);
  if (!user) {
    recordFailedAttempt(clientKey);
    return NextResponse.json(
      { error: "Tên đăng nhập hoặc mật khẩu không đúng." },
      { status: 401 }
    );
  }

  clearAttempts(clientKey);
  const { token, expiresAt } = createSessionToken(user);

  return NextResponse.json({ user, token, expiresAt });
}

/**
 * Đăng xuất: token được ký stateless (không lưu server-side) nên KHÔNG có gì để "thu hồi" ở
 * đây - client tự xoá token khỏi localStorage (xem authService.js: clearSession). Route này
 * chỉ để apiClient.js gọi cho đủ vòng đời request mà không bị lỗi 404/405 ở console, và để dễ
 * nâng cấp sau này (ví dụ thêm blacklist token nếu chuyển sang lưu trữ có trạng thái).
 */
export async function DELETE() {
  return NextResponse.json({ success: true });
}
