import { NextResponse } from "next/server";
import { orchestrateForeignLanguageTranslation } from "@/services/foreignLanguageOrchestrator";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";

/**
 * /api/translate-foreign-language
 * Route DUY NHẤT dùng chung cho cả 3 tab (Soạn Giáo Án / Đề Cương Ôn Tập / Đề Kiểm tra) khi giáo
 * viên bấm nút "Bản tiếng Anh" (xem ForeignLanguageExportButton.jsx) - nhận `subject` (để tra
 * đúng ngôn ngữ đích qua danh bạ foreignLanguageSubjects.js) + `data` (object JSON nội dung tiếng
 * Việt đã tạo sẵn ở màn hình, KHÔNG gọi lại luồng tạo nội dung) + `contentKindLabel` (mô tả ngắn
 * cho AI biết đây là loại tài liệu gì, chỉ ảnh hưởng chất lượng dịch, không ảnh hưởng cấu trúc).
 *
 * body: { subject, contentKindLabel, data }
 */
export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const limitError = await requireWithinTeacherGenerateLimit(auth.session.username);
    if (limitError) return limitError;

    const body = await request.json();
    const { subject, contentKindLabel = "tài liệu giáo dục", data } = body;

    if (!subject) {
      return NextResponse.json({ error: "Thiếu tham số: subject là bắt buộc." }, { status: 400 });
    }
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Thiếu tham số: data là bắt buộc." }, { status: 400 });
    }

    const { translated, languageConfig, quotaExhausted, serverOverloaded, error } =
      await orchestrateForeignLanguageTranslation({ subject, contentKindLabel, data });

    if (!translated) {
      if (quotaExhausted) {
        return NextResponse.json(
          { error: "Đã hết hạn mức Gemini hôm nay, vui lòng thử lại vào ngày mai hoặc thêm API key." },
          { status: 429 }
        );
      }
      if (serverOverloaded) {
        return NextResponse.json(
          { error: "Máy chủ Gemini đang quá tải, vui lòng thử lại sau ít phút." },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: error?.message || "Không thể dịch nội dung, vui lòng thử lại." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, translated, languageConfig });
  } catch (err) {
    console.error("[/api/translate-foreign-language] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi dịch nội dung." },
      { status: 500 }
    );
  }
}
