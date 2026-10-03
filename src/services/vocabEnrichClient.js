import { enrichVocabRequest } from "@/services/apiClient";

/**
 * vocabEnrichClient.js (Phiên 51b - tab "Soạn từ vựng", phía TRÌNH DUYỆT)
 * Chạy bước AI bổ sung phiên âm/loại từ/câu ví dụ và gộp kết quả vào bản soạn đang hiển thị. Dùng chung cho 2 nơi:
 *  - TỰ ĐỘNG ngay khi giáo viên bấm "Tạo bản soạn" (VocabForm.jsx) - Hoan góp ý: không phải bấm lần 2;
 *  - nút "Bổ sung lại" ở VocabExportActions.jsx (khi AI lỗi/hết lượt, hoặc sau khi giáo viên thêm từ mới).
 * An toàn khi giáo viên đang sửa: kết quả AI nhập vào qua setResult(prev => ...) NÊN dựa trên bảng HIỆN TẠI,
 * CHỈ điền ô còn TRỐNG theo id từ (ô giáo viên đã gõ trong lúc chờ AI được giữ nguyên, dòng đã xoá bị bỏ qua),
 * và bỏ qua hẳn nếu giáo viên đã tạo bản soạn khác (sheetId đổi).
 */

export function countMissing(words = []) {
  return words.filter((w) => w.word?.trim() && (!w.ipa?.trim() || !w.type?.trim() || !w.example?.trim())).length;
}

export function mergeAiIntoWords(words, aiWords) {
  const byId = new Map((aiWords || []).map((w) => [String(w.id), w]));
  return words.map((w) => {
    const ai = byId.get(String(w.id));
    if (!ai) return w;
    const next = { ...w };
    if (!w.ipa?.trim() && ai.ipa) { next.ipa = ai.ipa; next.aiIpa = true; }
    if (!w.type?.trim() && ai.type) { next.type = ai.type; next.aiType = true; }
    if (!w.example?.trim() && ai.example) { next.example = ai.example; next.aiExample = true; }
    return next;
  });
}

export async function runVocabEnrich({ sheetId, subject, words, grade = null, setResult }) {
  const needing = words.filter((w) => w.word?.trim() && (!w.ipa?.trim() || !w.type?.trim() || !w.example?.trim()));
  if (!needing.length) return;

  const patch = (fn) => setResult((prev) => (prev.sheetId === sheetId ? fn(prev) : prev));
  patch((prev) => ({ ...prev, enrich: { loading: true, message: "", error: "" } }));
  try {
    const data = await enrichVocabRequest({
      subject,
      grade,
      words: needing.map(({ id, word, ipa, type, meaning, example }) => ({ id, word, ipa, type, meaning, example })),
    });
    patch((prev) => ({
      ...prev,
      words: mergeAiIntoWords(prev.words, data.words),
      enrich: {
        loading: false,
        error: "",
        message: `AI đã điền ${data.filledIpa || 0} phiên âm, ${data.filledType || 0} loại từ và ${data.filledExample || 0} câu ví dụ (ô tô vàng) - vui lòng rà lại trước khi in.`,
      },
    }));
  } catch (err) {
    patch((prev) => ({
      ...prev,
      enrich: { loading: false, message: "", error: `${err.message} Bạn vẫn có thể tự gõ phiên âm/loại từ/ví dụ trên bảng.` },
    }));
  }
}
