import { generateContentWithFailover } from "../geminiKeyPool";

/**
 * tapLamVanBlock.js
 * Khối "Tập làm văn" - AI NHẸ (chỉ sinh 1 đề bài viết văn + gợi ý dàn ý ngắn, không sinh cả bài
 * văn mẫu - đúng như đã chốt "chỉ cần sinh 1 đề bài viết văn"). TỰ CHỨA toàn bộ logic của chính
 * nó, không dùng chung prompt với docThamBlock.js dù cùng gọi generateContentWithFailover().
 */

const TAP_LAM_VAN_MODEL = "gemini-3.5-flash"; // đồng bộ DOC_THAM_MODEL/LESSON_PLAN_MODEL

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const THE_LOAI_GOI_Y_LABEL = {
  ta_canh: "Tả cảnh",
  ta_nguoi: "Tả người",
  ke_chuyen: "Kể chuyện",
  viet_thu: "Viết thư",
};

function buildTapLamVanPrompt({ grade, theLoaiGoiY, chuDe }) {
  const theLoaiLine = THE_LOAI_GOI_Y_LABEL[theLoaiGoiY]
    ? `THỂ LOẠI GIÁO VIÊN YÊU CẦU: "${THE_LOAI_GOI_Y_LABEL[theLoaiGoiY]}".`
    : `Tự chọn 1 thể loại phù hợp Lớp ${grade} trong số: tả cảnh, tả người, kể chuyện, viết thư.`;
  const chuDeLine =
    chuDe && chuDe.trim() ? `CHỦ ĐỀ GIÁO VIÊN YÊU CẦU: "${chuDe.trim()}".` : "Tự chọn 1 chủ đề gần gũi, quen thuộc với học sinh Tiểu học.";

  return `
BẠN LÀ MỘT GIÁO VIÊN TIẾNG VIỆT TIỂU HỌC GIÀU KINH NGHIỆM, CHUYÊN RA ĐỀ PHẦN "TẬP LÀM VĂN".

NHIỆM VỤ: Soạn ĐÚNG 1 đề bài Tập làm văn phù hợp học sinh Lớp ${grade}, kèm 1 dàn ý gợi ý NGẮN
(3-4 ý chính, KHÔNG viết thành bài văn mẫu hoàn chỉnh - chỉ là khung gợi ý cho học sinh tự triển khai).

${theLoaiLine}
${chuDeLine}

QUY TẮC BẮT BUỘC:
- Đề bài phải rõ ràng, đúng 1 câu, đúng thể loại, phù hợp lứa tuổi và vốn sống của học sinh Tiểu học.
- Dàn ý gợi ý CHỈ liệt kê 3-4 ý chính ngắn gọn (VD: "Giới thiệu...", "Tả bao quát...", "Tả chi
  tiết...", "Nêu cảm nghĩ...") - KHÔNG viết sẵn câu văn hoàn chỉnh, tránh học sinh chép nguyên.
- Đầu ra CHỈ trả về JSON hợp lệ theo đúng schema bên dưới, không kèm giải thích, không markdown
  code fence, không thêm trường nào khác ngoài schema.

Hãy trả về JSON theo đúng schema sau:
{
  "theLoai": "Tả cảnh",
  "deBai": "...",
  "danYGoiY": ["...", "...", "..."]
}
`.trim();
}

function isValidTapLamVanResult(parsed) {
  return (
    parsed &&
    typeof parsed.deBai === "string" &&
    parsed.deBai.trim().length > 0 &&
    Array.isArray(parsed.danYGoiY)
  );
}

/**
 * generateTapLamVanBlock({ grade, input: { theLoaiGoiY, chuDe } }) -> { theLoai, deBai, danYGoiY }
 * Cùng cơ chế retry + phân biệt lỗi hết quota/quá tải như docThamBlock.js.
 */
export async function generateTapLamVanBlock({ grade, input = {} }) {
  const { theLoaiGoiY = "", chuDe = "" } = input;
  const maxRetries = 2;
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const prompt = buildTapLamVanPrompt({ grade, theLoaiGoiY, chuDe });
    try {
      const result = await generateContentWithFailover({
        model: TAP_LAM_VAN_MODEL,
        contents: prompt,
        config: { temperature: 0.7, responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(result.text);
      if (!isValidTapLamVanResult(parsed)) {
        throw new Error("Thiếu đề bài trong JSON trả về.");
      }
      return parsed;
    } catch (err) {
      lastError = err;
      if (err.allKeysExhausted) {
        const quotaError = new Error(`Hết hạn mức Gemini cho khối "Tập làm văn" (${err.message}).`);
        quotaError.quotaExhausted = true;
        throw quotaError;
      }
      if (err.allKeysOverloaded) {
        if (attempt === maxRetries) {
          const overloadError = new Error(
            `Máy chủ Gemini đang quá tải tạm thời khi tạo khối "Tập làm văn" (${err.message}).`
          );
          overloadError.serverOverloaded = true;
          throw overloadError;
        }
        await sleep(1500 * (attempt + 1));
      }
      attempt++;
    }
  }

  throw new Error(
    `Không thể tạo khối "Tập làm văn" sau ${maxRetries + 1} lần thử. ` +
      `(Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}
