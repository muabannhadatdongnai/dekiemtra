import { enrichVocabRequest } from "@/services/apiClient";

/**
 * vocabChineseEnrichClient.js (Phiên 52, phía TRÌNH DUYỆT)
 * Chạy bước AI bổ sung pinyin / âm Hán Việt / từ loại / ví dụ cho bản soạn Tiếng Trung và gộp vào bảng đang hiển thị.
 * Cùng nguyên tắc an toàn với vocabEnrichClient.js: dựa trên bảng HIỆN TẠI (setResult(prev => ...)), CHỈ điền ô
 * TRỐNG theo id, dòng đã xoá bị bỏ qua, bỏ qua hẳn nếu giáo viên đã tạo bản soạn khác (sheetId đổi).
 */

const missing = (w) => !w.pinyin?.trim() || !w.hanViet?.trim() || !w.type?.trim() || !w.example?.trim();

export function countMissingChinese(words = []) {
  return words.filter((w) => w.word?.trim() && missing(w)).length;
}

export function mergeAiIntoChineseWords(words, aiWords) {
  const byId = new Map((aiWords || []).map((w) => [String(w.id), w]));
  return words.map((w) => {
    const ai = byId.get(String(w.id));
    if (!ai) return w;
    const next = { ...w };
    if (!w.pinyin?.trim() && ai.pinyin) { next.pinyin = ai.pinyin; next.aiPinyin = true; }
    if (!w.hanViet?.trim() && ai.hanViet) { next.hanViet = ai.hanViet; next.aiHanViet = true; }
    if (!w.type?.trim() && ai.type) { next.type = ai.type; next.aiType = true; }
    if (!w.example?.trim() && ai.example) { next.example = ai.example; next.aiExample = true; }
    return next;
  });
}

export async function runChineseVocabEnrich({ sheetId, words, grade = null, setResult }) {
  const needing = words.filter((w) => w.word?.trim() && missing(w));
  if (!needing.length) return;

  const patch = (fn) => setResult((prev) => (prev.sheetId === sheetId ? fn(prev) : prev));
  patch((prev) => ({ ...prev, enrich: { loading: true, message: "", error: "" } }));
  try {
    const data = await enrichVocabRequest({
      subject: "Tieng_Trung",
      grade,
      words: needing.map(({ id, word, pinyin, hanViet, type, meaning, example }) => ({ id, word, pinyin, hanViet, type, meaning, example })),
    });
    patch((prev) => ({
      ...prev,
      words: mergeAiIntoChineseWords(prev.words, data.words),
      enrich: {
        loading: false,
        error: "",
        message: `AI đã điền ${data.filledPinyin || 0} pinyin, ${data.filledHanViet || 0} âm Hán Việt, ${data.filledType || 0} từ loại và ${data.filledExample || 0} câu ví dụ (ô tô vàng) - vui lòng rà lại trước khi in.`,
      },
    }));
  } catch (err) {
    patch((prev) => ({
      ...prev,
      enrich: { loading: false, message: "", error: `${err.message} Bạn vẫn có thể tự gõ pinyin/âm Hán Việt/ví dụ trên bảng.` },
    }));
  }
}
