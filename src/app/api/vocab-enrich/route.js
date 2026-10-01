import { NextResponse } from "next/server";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";
import { enrichEnglishVocab, VOCAB_MAX_WORDS_PER_REQUEST } from "@/services/vocabEngine";

/**
 * POST /api/vocab-enrich  (Phiên 51 - tab "Soạn từ vựng")
 * body: { subject: "Tieng_Anh", words: [{ id, word, ipa, type, meaning }] }
 * AI CHỈ bổ sung IPA/loại từ còn TRỐNG, giữ nguyên từ/nghĩa/giá trị đã có. Client không đáng tin →
 * ép kiểu + cắt độ dài + giới hạn số từ/lượt ở đây (cùng nguyên tắc contentGenerationLimits.js).
 */
export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const limitError = await requireWithinTeacherGenerateLimit(auth.session.username);
    if (limitError) return limitError;

    const body = await request.json();
    const { subject = "Tieng_Anh", words = [] } = body;
    if (subject !== "Tieng_Anh") {
      return NextResponse.json({ error: "Hiện chỉ hỗ trợ bổ sung phiên âm cho Tiếng Anh." }, { status: 400 });
    }
    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: "Danh sách từ vựng không được rỗng." }, { status: 400 });
    }

    const warnings = [];
    let safeWords = words
      .filter((w) => w && typeof w.word === "string" && w.word.trim())
      .map((w, i) => ({
        id: String(w.id ?? i).slice(0, 40),
        word: w.word.trim().slice(0, 80),
        ipa: typeof w.ipa === "string" ? w.ipa.trim().slice(0, 80) : "",
        type: typeof w.type === "string" ? w.type.trim().slice(0, 20) : "",
        meaning: typeof w.meaning === "string" ? w.meaning.trim().slice(0, 200) : "",
      }));
    if (safeWords.length > VOCAB_MAX_WORDS_PER_REQUEST) {
      safeWords = safeWords.slice(0, VOCAB_MAX_WORDS_PER_REQUEST);
      warnings.push(`Chỉ xử lý ${VOCAB_MAX_WORDS_PER_REQUEST} từ đầu tiên trong 1 lượt, vui lòng bổ sung thêm lượt khác cho các từ còn lại.`);
    }

    const result = await enrichEnglishVocab({ words: safeWords });
    if (result.quotaExhausted) {
      return NextResponse.json({ error: "Đã hết lượt gọi AI trong ngày. Bạn vẫn có thể tự gõ phiên âm/loại từ trên bảng." }, { status: 429 });
    }
    if (result.serverOverloaded) {
      return NextResponse.json({ error: "Máy chủ AI đang quá tải, vui lòng thử lại sau ít phút." }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      words: result.words,
      filledIpa: result.filledIpa,
      filledType: result.filledType,
      warnings,
    });
  } catch (err) {
    console.error("[/api/vocab-enrich] error:", err);
    return NextResponse.json({ error: err.message || "Đã có lỗi xảy ra khi bổ sung phiên âm." }, { status: 500 });
  }
}
