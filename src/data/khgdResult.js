/**
 * khgdResult.js
 * Gộp toàn bộ dữ liệu sau khi tạo "Khung KHGD" (Phụ lục III) thành 1 object DUY NHẤT - cùng
 * triết lý outlineResult.js/examResult.js, tránh nhiều useState() rời rạc trong page.js.
 *
 * @typedef {Object} KhgdResult
 * @property {Array|null} lessons - danh sách bài học SAU KHI gộp lại kết quả AI (swd/nls) vào
 *   đúng từng dòng giáo viên đã nhập ở KhgdForm.jsx (khớp theo "id")
 * @property {Array} kiemTraDinhKy - bảng Kiểm tra, đánh giá định kỳ (giáo viên tự nhập, không
 *   qua AI - xem khgdBlueprint.js)
 * @property {Array<string>} warnings
 * @property {Object|null} meta - subject/grade/truong/to/giaoVien/namHoc/enableSwd/enableNls...
 */

export const EMPTY_KHGD_RESULT = {
  lessons: null,
  kiemTraDinhKy: [],
  warnings: [],
  meta: null,
};

/**
 * Gộp kết quả AI (mảng { id, swd, nls }) vào ĐÚNG danh sách bài học gốc giáo viên đã nhập (khớp
 * theo "id") - giữ nguyên tenBai/soTiet/tuan/thietBi/diaDiem do giáo viên tự gõ, KHÔNG để AI ghi
 * đè các trường đó (AI chỉ được phép trả về "swd"/"nls").
 */
export function buildKhgdResult(apiResponse, meta, originalLessons = []) {
  const aiById = new Map((apiResponse.lessons || []).map((l) => [l.id, l]));
  const lessons = originalLessons.map((lesson) => {
    const ai = aiById.get(lesson.id);
    return {
      ...lesson,
      swd: ai?.swd || [],
      nls: ai?.nls || "",
    };
  });

  return {
    lessons,
    kiemTraDinhKy: apiResponse.kiemTraDinhKy || meta?.kiemTraDinhKy || [],
    warnings: apiResponse.warnings || [],
    meta,
  };
}
