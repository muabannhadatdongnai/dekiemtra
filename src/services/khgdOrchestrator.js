import { generateKhgdContent } from "./khgdEngine";

/**
 * khgdOrchestrator.js
 * Tương đương outlineOrchestrator.js: lớp điều phối đứng giữa route.js và khgdEngine.js.
 * KHÔNG cần tải Markdown SGK ở đây (khác outlineOrchestrator.js) - tên bài do giáo viên tự nhập/
 * chọn ở KhgdForm.jsx (gợi ý từ kho GitHub qua /api/lessons NGAY TỪ PHÍA CLIENT, xem
 * KhgdForm.jsx), server chỉ cần danh sách bài đã chốt để soạn SWD/NLS.
 */
export async function orchestrateKhgdGeneration({ subject, grade, lessons, enableSwd, enableNls }) {
  const warnings = [];

  let result;
  try {
    result = await generateKhgdContent({ subject, grade, lessons, enableSwd, enableNls });
  } catch (err) {
    warnings.push(
      `Không thể soạn nội dung lồng ghép SWD/NLS: ${err.message}. Vui lòng thử lại; nếu vẫn lỗi, hãy ` +
        `thử giảm bớt số bài học trong 1 lượt tạo.`
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
      `Máy chủ Gemini của Google đang quá tải tạm thời (nhu cầu tăng đột biến), không phải do hết ` +
        `hạn mức key của bạn. Vui lòng đợi khoảng 1-2 phút rồi bấm "Tạo Khung KHGD" lại.`
    );
    return { lessons: null, warnings };
  }

  return { lessons: result.lessons, warnings };
}
