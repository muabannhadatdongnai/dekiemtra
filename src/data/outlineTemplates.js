/**
 * outlineTemplates.js
 * Hằng số dùng chung cho tính năng "Đề cương Ôn tập" (Bước 2 / Nhóm B) - tab MỚI, đặt giữa
 * "Đề Tiếng Việt Tiểu học" và "Tạo Đề Kiểm Tra" theo đúng thứ tự đã chốt trong NEXT_STEPS.md.
 *
 * Cấu trúc "3 Trụ cột" (đã chốt trong thiết kế):
 *  1. Kiến thức cốt lõi - tóm tắt lý thuyết/công thức trọng tâm theo từng tiểu mục.
 *  2. Dạng bài + bài mẫu - liệt kê các dạng bài thường gặp, mỗi dạng có 1 bài mẫu có lời giải
 *     minh hoạ cách làm (khác "Ngân hàng bài tập" ở chỗ CÓ lời giải chi tiết từng bước).
 *  3. Ngân hàng bài tập 3 mức - bài tập để học sinh tự luyện, chia 3 mức độ tăng dần, MỖI bài
 *     chỉ có đáp số ngắn gọn (không giải thích dài như bài mẫu ở Trụ cột 2).
 */

export const OUTLINE_LEVELS = {
  CO_BAN: "coBan",
  NANG_CAO: "nangCao",
  VAN_DUNG_CAO: "vanDungCao",
};

export const OUTLINE_LEVEL_LABELS = {
  [OUTLINE_LEVELS.CO_BAN]: "Cơ bản (bắt buộc nắm vững)",
  [OUTLINE_LEVELS.NANG_CAO]: "Nâng cao (nên luyện thêm)",
  [OUTLINE_LEVELS.VAN_DUNG_CAO]: "Vận dụng cao (thử thách)",
};

export const OUTLINE_LEVEL_ORDER = [
  OUTLINE_LEVELS.CO_BAN,
  OUTLINE_LEVELS.NANG_CAO,
  OUTLINE_LEVELS.VAN_DUNG_CAO,
];

/**
 * Mặc định số bài/mức khi giáo viên mở form lần đầu - nhẹ nhàng, giáo viên có thể tăng lên tới
 * trần cho phép (xem contentGenerationLimits.js -> getOutlineMaxPerLevel/getOutlineMaxTotalExercises).
 */
export const DEFAULT_OUTLINE_EXERCISE_COUNTS = {
  [OUTLINE_LEVELS.CO_BAN]: 6,
  [OUTLINE_LEVELS.NANG_CAO]: 4,
  [OUTLINE_LEVELS.VAN_DUNG_CAO]: 2,
};

/**
 * "Lộ trình Ôn tập" (Bước 3/Nhóm E, phản hồi thực tế sau khi test) - giáo viên tự nhập số ngày
 * muốn ôn (ĐÃ CHỐT: không để AI tự ước lượng), AI chia khối lượng ôn tập thành nhiệm vụ nhỏ theo
 * đúng số ngày này. Mặc định 7 ngày (1 tuần) khi mở form lần đầu - xem trần tối đa ở
 * contentGenerationLimits.js -> getOutlineMaxStudyDays().
 */
export const DEFAULT_OUTLINE_STUDY_DAYS = 7;

/**
 * "Phạm vi" theo Học kỳ - giáo viên bấm 1 nút để tự động chọn NHÓM chương tương ứng, thay vì
 * phải tự tick từng chương một (đặc biệt hữu ích khi ôn tập giữa/cuối kỳ, cần gộp NHIỀU chương).
 * Quy ước ĐƠN GIẢN (không có nguồn phân phối chương trình chính thức theo kỳ trong repo kiến
 * thức hiện tại): chia đôi danh sách chương theo THỨ TỰ đã liệt kê trong kho GitHub - nửa đầu =
 * Học kỳ I, nửa sau = Học kỳ II. "Sách nâng cao" (nếu có) KHÔNG tự động gộp vào Kỳ nào - giáo
 * viên tự tick riêng nếu cần, vì sách nâng cao dùng chung cả năm, không thuộc kỳ nào cụ thể.
 * ⚠️ Đây là ước lượng tiện dụng, KHÔNG PHẢI phân phối chương trình chính thức - giáo viên vẫn có
 * thể bỏ chọn/thêm bớt chương thủ công sau khi bấm nút này trước khi tạo đề cương.
 */
export const OUTLINE_SEMESTER_SHORTCUTS = [
  { value: "ky1", label: "Học kỳ I" },
  { value: "ky2", label: "Học kỳ II" },
  { value: "ca_nam", label: "Cả năm" },
];

/** @param chapters - mảng trả về từ listChapters() (githubService.js), có thể lẫn "Sách nâng cao" */
export function splitChaptersBySemester(chapters) {
  const normalChapters = (chapters || []).filter((c) => !c.isAdvancedBook);
  const mid = Math.ceil(normalChapters.length / 2);
  return {
    ky1: normalChapters.slice(0, mid).map((c) => c.chapter),
    ky2: normalChapters.slice(mid).map((c) => c.chapter),
    ca_nam: normalChapters.map((c) => c.chapter),
  };
}
