import { NextResponse } from "next/server";
import { fetchMarkdownFromGitHub, fetchLessonIndex } from "@/services/githubService";
import { requireAuth } from "@/services/apiAuth";
import { buildKhgdOutline } from "@/services/khgdOutlineService";
import { ADVANCED_BOOK_MARKER } from "@/data/constants";

/**
 * GET /api/khgd-outline?grade&subject&volume&chapter  (Phiên 49)
 * Đọc Markdown 1 chương SGK → trả { chuong, rows[{ tenBai, noiDung }], source } cho tab Khung KHGD
 * (THCS/THPT, Phụ lục III). `noiDung` là đoạn trích ngắn từ chính Markdown của từng bài, form giữ
 * lại rồi gửi kèm lên /api/generate-khgd để AI soạn SWD/NLS bám sát nội dung SGK.
 * Mọi lỗi tải/bóc tách (thiếu file, Markdown lạ định dạng...) → trả 200 với rows rỗng để form tự
 * quay về luồng cũ (nạp `_bai.json`), KHÔNG chặn giáo viên - đây là tính năng gợi ý phụ trợ.
 * Cùng mức bảo vệ với /api/chapters, /api/lessons: bắt buộc đăng nhập (khi bật đăng nhập).
 * Tương đương /api/khgd-tieu-hoc-outline (Tiểu học) - 2 route RIÊNG, không dùng chung bộ đọc.
 */
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

  const empty = { chuong: null, rows: [], source: "none" };
  if (chapter === ADVANCED_BOOK_MARKER) return NextResponse.json(empty);

  try {
    const [markdown, lessonIndex] = await Promise.all([
      fetchMarkdownFromGitHub(grade, subject, volume, chapter),
      fetchLessonIndex({ grade, subject, volume, chapter }), // tự trả [] khi thiếu file, không throw
    ]);
    return NextResponse.json(buildKhgdOutline({ subject, markdown, lessonIndex }));
  } catch {
    return NextResponse.json(empty);
  }
}
