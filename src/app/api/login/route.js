import { NextResponse } from "next/server";
import { verifyCredentials } from "@/services/authService";

/**
 * API xác thực - chỉ kiểm tra username/password trên server (không lộ users.json ra client).
 * Client sẽ tự lưu kết quả trả về vào localStorage (xem authService.js: saveSession).
 */
export async function POST(request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu." },
      { status: 400 }
    );
  }

  const user = verifyCredentials(username, password);
  if (!user) {
    return NextResponse.json(
      { error: "Tên đăng nhập hoặc mật khẩu không đúng." },
      { status: 401 }
    );
  }

  return NextResponse.json({ user });
}
