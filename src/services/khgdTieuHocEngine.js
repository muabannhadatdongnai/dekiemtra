import { buildKhgdTieuHocPrompt, KHGD_TIEU_HOC_MODEL } from "./khgdTieuHocPromptTemplates";
import { generateContentWithFailover } from "./geminiKeyPool";
import { chunkLessons, getKhgdTieuHocAiBatchSize } from "./contentGenerationLimits";

/**
 * khgdTieuHocEngine.js
 * Lớp gọi AI DUY NHẤT cho tab "Khung KHGD - Tiểu học" - cùng khuôn khgdEngine.js (THCS/THPT),
 * CHỈ khác schema trả về (1 trường "dieuChinh" thay vì "swd"/"nls").
 *
 * Phiên 50: chia danh sách bài thành LÔ (mặc định 60 bài/lần gọi, xem getKhgdTieuHocAiBatchSize) -
 * TRƯỚC ĐÓ gửi HẾT trong 1 lần gọi, sinh lỗi khi danh sách dài (Tiếng Việt Lớp 2 cả học kì ~160-170
 * dòng): JSON trả về nhiều phần tử dễ bị cắt giữa chừng hoặc mất quá lâu → trình duyệt nhận về dữ
 * liệu không hợp lệ khi `res.json()` (xem apiClient.js). Mỗi lô có vòng thử lại riêng; 1 lô hết
 * quota/quá tải thì cả lượt báo lỗi (giữ nguyên ngữ nghĩa cũ: hoặc đủ kết quả, hoặc báo lỗi rõ ràng).
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateBatch({ subject, grade, lessons, maxRetries }) {
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const prompt = buildKhgdTieuHocPrompt({ subject, grade, lessons });

    try {
      const result = await generateContentWithFailover({
        model: KHGD_TIEU_HOC_MODEL,
        contents: prompt,
        config: { temperature: 0.6, responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(result.text);
      if (!Array.isArray(parsed.lessons) || parsed.lessons.length === 0) {
        throw new Error('Thiếu mảng "lessons" trong JSON trả về.');
      }
      return { lessons: parsed.lessons, quotaExhausted: false };
    } catch (err) {
      lastError = err;
      if (err.allKeysExhausted) {
        return { lessons: null, quotaExhausted: true, serverOverloaded: false, error: err };
      }
      if (err.allKeysOverloaded) {
        if (attempt === maxRetries) {
          return { lessons: null, quotaExhausted: false, serverOverloaded: true, error: err };
        }
        await sleep(1500 * (attempt + 1));
      }
      attempt++;
    }
  }

  throw new Error(
    `Không thể soạn "Nội dung điều chỉnh" sau ${maxRetries + 1} lần thử. Vui lòng thử lại sau ít ` +
      `phút. (Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}

export async function generateKhgdTieuHocContent({ subject, grade, lessons, enableDieuChinh, maxRetries = 2 }) {
  if (!enableDieuChinh) {
    return { lessons: lessons.map((l) => ({ id: l.id, dieuChinh: "" })), quotaExhausted: false };
  }

  const merged = [];
  for (const batch of chunkLessons(lessons, getKhgdTieuHocAiBatchSize())) {
    const result = await generateBatch({ subject, grade, lessons: batch, maxRetries });
    if (!result.lessons) return result; // hết quota / quá tải: dừng, báo lỗi cho cả lượt
    merged.push(...result.lessons);
  }
  return { lessons: merged, quotaExhausted: false };
}
