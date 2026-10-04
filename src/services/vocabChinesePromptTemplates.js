/**
 * vocabChinesePromptTemplates.js (Phiên 52 - tab "Soạn từ vựng", Tiếng Trung)
 * Prompt cho bước AI DUY NHẤT của bản soạn Tiếng Trung: bổ sung PINYIN, ÂM HÁN VIỆT, TỪ LOẠI và CÂU VÍ DỤ còn
 * thiếu. AI KHÔNG được đổi chữ Hán/nghĩa (lấy nguyên văn từ Markdown SGK) và KHÔNG thêm từ mới.
 * ĐỘC LẬP với vocabPromptTemplates.js (bản Tiếng Anh).
 */

export const VOCAB_ZH_MODEL = "gemini-3.5-flash"; // đồng bộ các tab khác; khai báo RIÊNG để tab độc lập

export const VOCAB_ZH_TYPE_CHOICES = [
  "Danh từ", "Động từ", "Tính từ", "Phó từ", "Số từ", "Lượng từ", "Đại từ", "Giới từ", "Liên từ", "Trợ từ",
  "Thán từ", "Phương vị từ", "Động từ năng nguyện", "Thành ngữ", "Cụm từ", "Tên riêng",
];

/**
 * @param items - [{ id, word, meaning, needPinyin, needHanViet, needType, needExample }]
 * @param grade - lớp (số) để chọn câu ví dụ đúng trình độ
 */
export function buildVocabChineseEnrichPrompt({ items, grade = null }) {
  const lines = items.map((it) => {
    const need = [it.needPinyin ? "pinyin" : null, it.needHanViet ? "hanViet" : null, it.needType ? "type" : null, it.needExample ? "example" : null]
      .filter(Boolean)
      .join("+");
    return JSON.stringify({ id: it.id, hanzi: it.word, meaning_vi: it.meaning || "", need });
  });

  return `Bạn là biên tập viên từ điển Hán - Việt cho sách giáo khoa Tiếng Trung của Việt Nam. Nhiệm vụ: với mỗi từ/cụm từ bên dưới, bổ sung CHỈ những trường được yêu cầu trong "need".

DỮ LIỆU (mỗi dòng 1 JSON):
${lines.join("\n")}

QUY TẮC BẮT BUỘC:
- "pinyin": phiên âm Pinyin CÓ DẤU THANH (VD "bàngōnglóu", "xiūshēn yǎngxìng"). Viết liền các âm tiết trong cùng một từ, cách nhau bằng dấu cách giữa các từ của một cụm. Thanh nhẹ không đánh dấu. Dùng "ü" (không dùng "v"). KHÔNG viết hoa chữ cái đầu trừ tên riêng.
- "hanViet": ÂM HÁN VIỆT của từng chữ, chữ thường, cách nhau bằng dấu cách (VD 办公楼 → "biện công lâu"). Nếu từ là phiên âm tên riêng/từ mượn không có âm Hán Việt thông dụng, hoặc bạn không chắc → để chuỗi rỗng "".
- "type": MỘT loại từ duy nhất, chọn trong: ${VOCAB_ZH_TYPE_CHOICES.join(", ")}. Dùng "meaning_vi" để xác định đúng loại từ khi từ có nhiều loại. Không chắc → "".
- "example": MỘT câu ví dụ tiếng Trung giản thể, ngắn (tối đa 15 chữ Hán), tự nhiên, CHỨA ĐÚNG từ/cụm từ "hanzi" (với từ có dạng "里 / 里面" hoặc "(…)" thì dùng dạng đầu tiên), ngữ cảnh đời thường ở trường/gia đình, từ vựng đơn giản phù hợp học sinh ${grade ? `lớp ${grade}` : "phổ thông"} học Ngoại ngữ 2. Chỉ viết câu tiếng Trung, KHÔNG kèm pinyin hay bản dịch trong trường này.
- "examplePinyin": Pinyin có dấu thanh của đúng câu trong "example" (chỉ điền khi bạn điền "example").
- Chỉ điền trường có trong "need"; trường không yêu cầu để chuỗi rỗng "".
- KHÔNG đổi, KHÔNG dịch lại, KHÔNG thêm từ mới. Mỗi "id" xuất hiện đúng 1 lần trong kết quả.
- Nếu KHÔNG chắc chắn về một trường, để chuỗi rỗng "" - giáo viên sẽ tự điền. Tuyệt đối không bịa.

TRẢ VỀ DUY NHẤT 1 JSON (không markdown, không giải thích):
{ "items": [ { "id": "...", "pinyin": "...", "hanViet": "...", "type": "...", "example": "...", "examplePinyin": "..." } ] }`;
}
