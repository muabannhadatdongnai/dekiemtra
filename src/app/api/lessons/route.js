import { NextResponse } from "next/server";
import { fetchLessonIndex } from "@/services/githubService";
import { requireAuth } from "@/services/apiAuth";

// Cùng mức bảo vệ với /api/chapters (route.js) - tránh public 100% cho phép dò cấu trúc kho
// GitHub kiến thức hoặc spam làm cạn rate-limit GitHub API.
export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const grade = searchParams.get("grade");
  const subject = searchParams.get("subject") || "Toan";
  const volume = searchParams.get("volume") || "1";
  const chapter = searchParams.get("chapter");

  if (!grade || !chapter) {
    return NextResponse.json({ error: "Thiếu tham số grade hoặc chapter." }, { status: 400 });
  }

  try {
    // fetchLessonIndex tự trả về [] khi chưa có phụ lục cho chương này (KHÔNG throw) - đây là
    // tính năng gợi ý phụ trợ, thiếu dữ liệu không phải lỗi.
    const lessons = await fetchLessonIndex({ grade, subject, volume, chapter });
    return NextResponse.json({ lessons });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
