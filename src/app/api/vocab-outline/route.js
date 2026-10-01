import { NextResponse } from "next/server";
import { fetchMarkdownFromGitHub } from "@/services/githubService";
import { requireAuth } from "@/services/apiAuth";
import { parseVocabularyByLanguage } from "@/services/vocabParserRegistry";
import { ADVANCED_BOOK_MARKER } from "@/data/constants";

/**
 * GET /api/vocab-outline?grade&subject&volume&chapter  (Phiên 51 - tab "Soạn từ vựng")
 * Đọc Markdown 1 chương SGK → trả { chuong, vocabGroups[], grammarGroups[], supported } để form cho
 * giáo viên chọn nhóm từ vựng/ngữ pháp đưa vào bản soạn. Từ + nghĩa lấy NGUYÊN VĂN từ Markdown (không AI).
 * Mọi lỗi tải/bóc tách → trả 200 với danh sách rỗng (form báo "chưa đọc được", giáo viên tự thêm tay),
 * cùng tinh thần /api/khgd-outline. Cùng mức bảo vệ: bắt buộc đăng nhập (khi bật đăng nhập).
 */
export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const grade = searchParams.get("grade");
  const subject = searchParams.get("subject") || "Tieng_Anh";
  const volume = searchParams.get("volume") || "1";
  const chapter = searchParams.get("chapter");

  if (!grade || !chapter) {
    return NextResponse.json({ error: "Thiếu tham số grade hoặc chapter." }, { status: 400 });
  }

  const empty = { chuong: null, vocabGroups: [], grammarGroups: [], supported: true };
  if (chapter === ADVANCED_BOOK_MARKER) return NextResponse.json(empty);

  try {
    const markdown = await fetchMarkdownFromGitHub(grade, subject, volume, chapter);
    const parsed = parseVocabularyByLanguage(subject, markdown);
    if (!parsed) return NextResponse.json({ ...empty, supported: false });
    return NextResponse.json({ ...parsed, supported: true });
  } catch {
    return NextResponse.json(empty);
  }
}
