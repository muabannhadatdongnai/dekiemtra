import { NextResponse } from "next/server";
import { listChapters } from "@/services/githubService";
import { requireAuth } from "@/services/apiAuth";

// ⚠️ Trước đây route này KHÔNG có bước xác thực nào - public 100%, ai cũng gọi được để dò
// cấu trúc kho GitHub hoặc spam làm cạn rate-limit GitHub API. Giờ bắt buộc phải đăng nhập.
export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const grade = searchParams.get("grade");
  const subject = searchParams.get("subject") || "Toan";
  const volume = searchParams.get("volume") || "1";

  if (!grade) {
    return NextResponse.json({ error: "Thiếu tham số grade." }, { status: 400 });
  }

  try {
    const chapters = await listChapters({ grade, subject, volume });
    return NextResponse.json({ chapters });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
