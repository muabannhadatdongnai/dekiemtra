/**
 * vocabPromptTemplates.js (Phiên 51 - tab "Soạn từ vựng")
 * Prompt cho bước AI DUY NHẤT của tab: bổ sung PHIÊN ÂM (IPA) và LOẠI TỪ còn thiếu cho từ vựng
 * Tiếng Anh. AI KHÔNG được đổi từ/nghĩa (lấy nguyên văn từ Markdown SGK) và KHÔNG thêm từ mới.
 */

export const VOCAB_MODEL = "gemini-3.5-flash"; // đồng bộ các tab khác; khai báo RIÊNG để tab độc lập

export const VOCAB_TYPE_CHOICES = ["n", "v", "adj", "adv", "prep", "conj", "pron", "det", "exclam", "np", "vp", "phr v", "idiom", "proper n"];

/**
 * @param items - [{ id, word, meaning, needIpa, needType }]
 */
export function buildVocabEnrichPrompt({ items, languageNameEn = "English" }) {
  const lines = items.map((it) => {
    const need = [it.needIpa ? "ipa" : null, it.needType ? "type" : null].filter(Boolean).join("+");
    return JSON.stringify({ id: it.id, word: it.word, meaning_vi: it.meaning || "", need });
  });

  return `Bạn là biên tập viên từ điển ${languageNameEn} cho sách giáo khoa Việt Nam. Nhiệm vụ: với mỗi từ/cụm từ bên dưới, bổ sung CHỈ những trường được yêu cầu trong "need".

DỮ LIỆU (mỗi dòng 1 JSON):
${lines.join("\n")}

QUY TẮC BẮT BUỘC:
- "ipa": phiên âm quốc tế IPA theo giọng Anh-Anh (như Cambridge/Oxford), đặt giữa 2 dấu gạch chéo, VD "/ˈkɪtʃ.ən/". Cụm từ nhiều chữ: phiên âm cả cụm. Có dấu trọng âm ˈ ˌ khi từ có từ 2 âm tiết trở lên.
- "type": MỘT mã loại từ duy nhất, chọn trong: ${VOCAB_TYPE_CHOICES.join(", ")}. Dùng "meaning_vi" để xác định đúng loại từ khi từ có nhiều loại (VD "shower"). Cụm danh từ → "np"; tên riêng → "proper n".
- Chỉ điền trường có trong "need"; trường không yêu cầu để chuỗi rỗng "".
- KHÔNG đổi, KHÔNG dịch lại, KHÔNG thêm từ mới. Mỗi "id" xuất hiện đúng 1 lần trong kết quả.
- Nếu KHÔNG chắc chắn về một trường, để chuỗi rỗng "" - giáo viên sẽ tự điền. Tuyệt đối không bịa phiên âm.

TRẢ VỀ DUY NHẤT 1 JSON (không markdown, không giải thích):
{ "items": [ { "id": "...", "ipa": "...", "type": "..." } ] }`;
}
