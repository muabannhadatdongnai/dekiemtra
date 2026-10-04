import { NextResponse } from "next/server";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";
import { enrichEnglishVocab, VOCAB_MAX_WORDS_PER_REQUEST } from "@/services/vocabEngine";
import { enrichChineseVocab, VOCAB_ZH_MAX_WORDS_PER_REQUEST } from "@/services/vocabChineseEngine";

/**
 * POST /api/vocab-enrich  (Phiên 51 - tab "Soạn từ vựng")
 * body: { subject: "Tieng_Anh", grade?, words: [{ id, word, ipa, type, meaning, example }] }
 *       { subject: "Tieng_Trung" (Phiên 52), grade?, words: [{ id, word, pinyin, hanViet, type, meaning, example }] }
 * Mỗi môn đi 1 engine RIÊNG (vocabEngine.js / vocabChineseEngine.js). AI CHỈ bổ sung IPA|pinyin/âm Hán Việt/loại từ/câu ví dụ còn TRỐNG, giữ nguyên từ/nghĩa/giá trị đã có. Client không đáng tin →
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
    const gradeNum = Number(body.grade);
    const grade = Number.isInteger(gradeNum) && gradeNum >= 1 && gradeNum <= 12 ? gradeNum : null;
    if (subject !== "Tieng_Anh" && subject !== "Tieng_Trung") {
      return NextResponse.json({ error: "Hiện chỉ hỗ trợ bổ sung phiên âm cho Tiếng Anh và Tiếng Trung." }, { status: 400 });
    }
    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: "Danh sách từ vựng không được rỗng." }, { status: 400 });
    }

    const warnings = [];
    const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
    const base = (w, i) => ({
      id: String(w.id ?? i).slice(0, 40),
      word: w.word.trim().slice(0, 80),
      type: str(w.type, 30),
      meaning: str(w.meaning, 200),
      example: str(w.example, 200),
    });
    const valid = words.filter((w) => w && typeof w.word === "string" && w.word.trim());

    if (subject === "Tieng_Trung") {
      let safeWords = valid.map((w, i) => ({ ...base(w, i), pinyin: str(w.pinyin, 80), hanViet: str(w.hanViet, 60) }));
      if (safeWords.length > VOCAB_ZH_MAX_WORDS_PER_REQUEST) {
        safeWords = safeWords.slice(0, VOCAB_ZH_MAX_WORDS_PER_REQUEST);
        warnings.push(`Chỉ xử lý ${VOCAB_ZH_MAX_WORDS_PER_REQUEST} từ đầu tiên trong 1 lượt, vui lòng bổ sung thêm lượt khác cho các từ còn lại.`);
      }
      const result = await enrichChineseVocab({ words: safeWords, grade });
      if (result.quotaExhausted) {
        return NextResponse.json({ error: "Đã hết lượt gọi AI trong ngày. Bạn vẫn có thể tự gõ pinyin/âm Hán Việt/ví dụ trên bảng." }, { status: 429 });
      }
      if (result.serverOverloaded) {
        return NextResponse.json({ error: "Máy chủ AI đang quá tải, vui lòng thử lại sau ít phút." }, { status: 503 });
      }
      return NextResponse.json({
        success: true,
        words: result.words,
        filledPinyin: result.filledPinyin,
        filledHanViet: result.filledHanViet,
        filledType: result.filledType,
        filledExample: result.filledExample,
        warnings,
      });
    }

    let safeWords = valid.map((w, i) => ({ ...base(w, i), ipa: str(w.ipa, 80) }));
    if (safeWords.length > VOCAB_MAX_WORDS_PER_REQUEST) {
      safeWords = safeWords.slice(0, VOCAB_MAX_WORDS_PER_REQUEST);
      warnings.push(`Chỉ xử lý ${VOCAB_MAX_WORDS_PER_REQUEST} từ đầu tiên trong 1 lượt, vui lòng bổ sung thêm lượt khác cho các từ còn lại.`);
    }

    const result = await enrichEnglishVocab({ words: safeWords, grade });
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
      filledExample: result.filledExample || 0,
      warnings,
    });
  } catch (err) {
    console.error("[/api/vocab-enrich] error:", err);
    return NextResponse.json({ error: err.message || "Đã có lỗi xảy ra khi bổ sung phiên âm." }, { status: 500 });
  }
}
