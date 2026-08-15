import { buildOutlinePrompt, OUTLINE_MODEL } from "@/data/outlinePromptTemplates";
import { generateContentWithFailover } from "./geminiKeyPool";

/**
 * outlineEngine.js
 * Lớp gọi AI DUY NHẤT cho module "Đề cương Ôn tập" - đúng khuôn lessonPlanEngine.js (đơn giản
 * hơn geminiEngine.js bên đề thi vì không cần chống trùng nhiều câu hỏi cùng lúc).
 *
 * maxRetries: thử lại nếu AI trả JSON lỗi hoặc thiếu 1 trong 3 trụ cột bắt buộc - KHÔNG throw
 * ngay, giáo viên không nên mất cả lượt soạn chỉ vì 1 lần AI trả JSON hỏng.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateOutlineContent({
  subject,
  grade,
  volume,
  chapterLabel,
  sourceMarkdown,
  exerciseCounts,
  yeuCauDacBiet,
  soNgayOnTap,
  maxRetries = 2,
}) {
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const prompt = buildOutlinePrompt({
      subject,
      grade,
      volume,
      chapterLabel,
      sourceMarkdown,
      exerciseCounts,
      yeuCauDacBiet,
      soNgayOnTap,
    });

    try {
      const result = await generateContentWithFailover({
        model: OUTLINE_MODEL,
        contents: prompt,
        config: { temperature: 0.6, responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(result.text);
      if (
        !Array.isArray(parsed.kienThucCotLoi) ||
        parsed.kienThucCotLoi.length === 0 ||
        !Array.isArray(parsed.dangBai) ||
        parsed.dangBai.length === 0 ||
        !parsed.nganHangBaiTap ||
        typeof parsed.nganHangBaiTap !== "object" ||
        !Array.isArray(parsed.loTrinhOnTap) ||
        parsed.loTrinhOnTap.length === 0
      ) {
        throw new Error(
          "Thiếu 1 trong các phần bắt buộc (Kiến thức cốt lõi/Dạng bài/Ngân hàng bài tập/Lộ trình " +
            "Ôn tập) trong JSON trả về."
        );
      }
      return { outline: parsed, quotaExhausted: false };
    } catch (err) {
      lastError = err;
      if (err.allKeysExhausted) {
        return { outline: null, quotaExhausted: true, serverOverloaded: false, error: err };
      }
      if (err.allKeysOverloaded) {
        if (attempt === maxRetries) {
          return { outline: null, quotaExhausted: false, serverOverloaded: true, error: err };
        }
        await sleep(1500 * (attempt + 1));
      }
      attempt++;
    }
  }

  throw new Error(
    `Không thể soạn đề cương ôn tập sau ${maxRetries + 1} lần thử. Vui lòng thử lại sau ít phút. ` +
      `(Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}
