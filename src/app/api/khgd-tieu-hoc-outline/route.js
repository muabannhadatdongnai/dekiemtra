import { NextResponse } from "next/server";
import { fetchMarkdownFromGitHub, fetchLessonIndex } from "@/services/githubService";
import { requireAuth } from "@/services/apiAuth";
import { buildKhgdTieuHocOutline } from "@/services/khgdTieuHocOutlineService";
import { ADVANCED_BOOK_MARKER } from "@/data/constants";

/**
 * GET /api/khgd-tieu-hoc-outline?grade&subject&volume&chapter  (Phiên 48b)
 * Đọc Markdown 1 chương SGK → trả { chuDe, rows[], source } cho tab Khung KHGD Tiểu học.
 * Mọi lỗi tải/bóc tách (thiếu file, Markdown lạ định dạng...) → trả 200 với rows rỗng để form tự
 * quay về luồng cũ (nạp `_bai.json`), KHÔNG chặn giáo viên - đây là tính năng gợi ý phụ trợ.
 * Cùng mức bảo vệ với /api/chapters, /api/lessons: bắt buộc đăng nhập.
 */
export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const grade = searchParams.get("grade");
  const subject = searchParams.get("subject") || "Tieng_Viet";
  const volume = searchParams.get("volume") || "1";
  const chapter = searchParams.get("chapter");

  if (!grade || !chapter) {
    return NextResponse.json({ error: "Thiếu tham số grade hoặc chapter." }, { status: 400 });
  }

  const empty = { chuDe: null, tuanTu: null, tuanDen: null, rows: [], source: "none" };
  if (chapter === ADVANCED_BOOK_MARKER) return NextResponse.json(empty);

  try {
    const [markdown, lessonIndex] = await Promise.all([
      fetchMarkdownFromGitHub(grade, subject, volume, chapter),
      fetchLessonIndex({ grade, subject, volume, chapter }), // tự trả [] khi thiếu file, không throw
    ]);
    return NextResponse.json(buildKhgdTieuHocOutline({ subject, markdown, lessonIndex }));
  } catch {
    return NextResponse.json(empty);
  }
}
