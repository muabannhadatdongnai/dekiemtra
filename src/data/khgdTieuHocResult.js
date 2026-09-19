/**
 * khgdTieuHocResult.js
 * Gộp kết quả sau khi tạo "Khung KHGD - Tiểu học" - cùng triết lý khgdResult.js (THCS/THPT)
 * nhưng KHÔNG có "kiemTraDinhKy" (Tiểu học không dùng bảng đó ở đây - xem khgdTieuHocBlueprint.js).
 */

export const EMPTY_KHGD_TIEU_HOC_RESULT = {
  lessons: null,
  warnings: [],
  meta: null,
};

/** Gộp kết quả AI (mảng { id, dieuChinh }) vào ĐÚNG danh sách bài học gốc giáo viên đã nhập. */
export function buildKhgdTieuHocResult(apiResponse, meta, originalLessons = []) {
  const aiById = new Map((apiResponse.lessons || []).map((l) => [l.id, l]));
  const lessons = originalLessons.map((lesson) => {
    const ai = aiById.get(lesson.id);
    return { ...lesson, dieuChinh: ai?.dieuChinh || "" };
  });

  return { lessons, warnings: apiResponse.warnings || [], meta };
}
