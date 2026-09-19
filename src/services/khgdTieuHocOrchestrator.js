import { generateKhgdTieuHocContent } from "./khgdTieuHocEngine";

/** khgdTieuHocOrchestrator.js - tương đương khgdOrchestrator.js (THCS/THPT), schema đơn giản hơn. */
export async function orchestrateKhgdTieuHocGeneration({ subject, grade, lessons, enableDieuChinh }) {
  const warnings = [];

  let result;
  try {
    result = await generateKhgdTieuHocContent({ subject, grade, lessons, enableDieuChinh });
  } catch (err) {
    warnings.push(
      `Không thể soạn nội dung "Điều chỉnh": ${err.message}. Vui lòng thử lại; nếu vẫn lỗi, hãy thử ` +
        `giảm bớt số bài học trong 1 lượt tạo.`
    );
    return { lessons: null, warnings };
  }

  if (result.quotaExhausted) {
    warnings.push(
      `Không thể soạn nội dung do TẤT CẢ API key Gemini đã hết hạn mức hôm nay (${result.error?.message || ""}). ` +
        `Vui lòng thử lại sau hoặc bổ sung thêm API key.`
    );
    return { lessons: null, warnings };
  }

  if (result.serverOverloaded) {
    warnings.push(
      `Máy chủ Gemini của Google đang quá tải tạm thời. Vui lòng đợi khoảng 1-2 phút rồi bấm "Tạo ` +
        `Khung KHGD" lại.`
    );
    return { lessons: null, warnings };
  }

  return { lessons: result.lessons, warnings };
}
