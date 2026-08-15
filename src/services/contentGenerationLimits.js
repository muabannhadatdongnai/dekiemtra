/**
 * contentGenerationLimits.js
 * ⚠️ RÀ SOÁT BẢO MẬT (xem PROJECT_SUMMARY.md, mục "chưa có trần tối đa số câu/bài mỗi lượt gọi"):
 * TRƯỚC ĐÂY các route sinh nội dung (`/api/generate`, `/api/generate-worksheet`) tin tưởng
 * tuyệt đối số lượng câu hỏi/bài tập do client tự gửi lên (`chapterMatrix`, `exerciseCounts`) -
 * KHÔNG có trần nào. `ExamMatrixForm.jsx`/`WorksheetForm.jsx` chỉ chặn số ÂM
 * (`Math.max(0, Number(value) || 0)`), không chặn số quá lớn. Ai gọi thẳng API (bỏ qua UI) có
 * thể gửi vd. `NHAN_BIET: 999999` cho 1 chương, hoặc `tinh_nham: 999999` cho phiếu bài tập, khiến
 * 1 lượt gọi duy nhất tốn RẤT nhiều lượt gọi Gemini (mỗi câu hỏi thường tốn 1 phần token đáng kể),
 * hoặc gây timeout/OOM khi build response quá lớn.
 *
 * Module này là NGUỒN DUY NHẤT khai báo trần cho từng loại nội dung sinh ra - route.js gọi hàm
 * clamp tương ứng NGAY SAU KHI đọc body, TRƯỚC khi gọi orchestrator/service sinh nội dung. Clamp
 * (cắt về đúng trần) thay vì từ chối thẳng cả request: giáo viên gửi hơi vượt trần (vd. gõ nhầm)
 * vẫn được phục vụ phần hợp lệ, không bị chặn toàn bộ chỉ vì 1 ô vượt trần - đúng tinh thần
 * "không tin dữ liệu client nhưng vẫn ưu tiên trải nghiệm" đã áp dụng ở worksheetGenerator.js
 * (`safeCounts`). Route LUÔN đính kèm cảnh báo (`warnings`) khi có clamp xảy ra để giáo viên biết
 * số thực tế đã tạo có thể ít hơn số đã nhập.
 *
 * Có thể chỉnh trần qua biến môi trường (không cần sửa code/redeploy lại nếu chỉ đổi số) - xem
 * từng hằng số bên dưới. Đọc process.env qua hàm (không đọc ở top-level module) để giá trị luôn
 * mới nhất kể cả khi test tự động set biến môi trường khác nhau giữa các test case.
 */

function envInt(name, fallback) {
  const raw = process.env[name];
  const n = Number(raw);
  return raw && Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

// ================== Đề kiểm tra (/api/generate) ==================
// Trần cho MỖI Ô trong chapterMatrix (1 chương × 1 mức độ), và trần TỔNG số câu cộng dồn mọi
// chương/mức độ trong 1 lượt gọi.
export function getExamMaxPerCell() {
  return envInt("EXAM_MAX_QUESTIONS_PER_CELL", 20);
}
export function getExamMaxTotalQuestions() {
  return envInt("EXAM_MAX_TOTAL_QUESTIONS", 60);
}

/**
 * Cắt (clamp) chapterMatrix về đúng trần, ĐÚNG THỨ TỰ chương đã gửi (không tự sắp xếp lại) -
 * clamp từng ô trước theo `maxPerCell`, sau đó nếu tổng vẫn vượt `maxTotal` thì cắt tiếp CÁC Ô
 * SAU CÙNG trước (giữ nguyên ưu tiên những chương/mức độ giáo viên khai báo trước).
 * @returns {{ matrix: object, wasClamped: boolean }}
 */
export function clampChapterMatrix(chapterMatrix) {
  const maxPerCell = getExamMaxPerCell();
  const maxTotal = getExamMaxTotalQuestions();
  let wasClamped = false;

  const matrix = {};
  for (const [chapterId, levels] of Object.entries(chapterMatrix || {})) {
    matrix[chapterId] = {};
    for (const [level, rawValue] of Object.entries(levels || {})) {
      const value = Math.max(0, Number(rawValue) || 0);
      const clamped = Math.min(value, maxPerCell);
      if (clamped !== value) wasClamped = true;
      matrix[chapterId][level] = clamped;
    }
  }

  let total = 0;
  for (const levels of Object.values(matrix)) {
    for (const level of Object.keys(levels)) total += levels[level];
  }

  if (total > maxTotal) {
    wasClamped = true;
    let excess = total - maxTotal;
    // Cắt từ ô CUỐI CÙNG (chương/mức độ khai báo sau cùng) ngược về đầu, giữ nguyên các chương
    // đầu danh sách nguyên vẹn nhất có thể - giáo viên thường liệt kê chương quan trọng trước.
    const chapterIds = Object.keys(matrix).reverse();
    for (const chapterId of chapterIds) {
      const levelKeys = Object.keys(matrix[chapterId]).reverse();
      for (const level of levelKeys) {
        if (excess <= 0) break;
        const cut = Math.min(matrix[chapterId][level], excess);
        matrix[chapterId][level] -= cut;
        excess -= cut;
      }
      if (excess <= 0) break;
    }
  }

  return { matrix, wasClamped };
}

// ================== Phiếu bài tập (/api/generate-worksheet) ==================
export function getWorksheetMaxPerExercise() {
  return envInt("WORKSHEET_MAX_PER_EXERCISE", 30);
}
export function getWorksheetMaxTotalExercises() {
  return envInt("WORKSHEET_MAX_TOTAL_EXERCISES", 80);
}

/**
 * Cắt (clamp) exerciseCounts về đúng trần - cùng chiến lược với clampChapterMatrix() (clamp
 * từng key trước, rồi cắt bớt các key CUỐI CÙNG nếu tổng vẫn vượt trần).
 * @returns {{ counts: object, wasClamped: boolean }}
 */
export function clampExerciseCounts(exerciseCounts) {
  const maxPerExercise = getWorksheetMaxPerExercise();
  const maxTotal = getWorksheetMaxTotalExercises();
  let wasClamped = false;

  const counts = {};
  for (const [key, rawValue] of Object.entries(exerciseCounts || {})) {
    const value = Math.max(0, Number(rawValue) || 0);
    const clamped = Math.min(value, maxPerExercise);
    if (clamped !== value) wasClamped = true;
    counts[key] = clamped;
  }

  let total = Object.values(counts).reduce((sum, v) => sum + v, 0);
  if (total > maxTotal) {
    wasClamped = true;
    let excess = total - maxTotal;
    const keys = Object.keys(counts).reverse();
    for (const key of keys) {
      if (excess <= 0) break;
      const cut = Math.min(counts[key], excess);
      counts[key] -= cut;
      excess -= cut;
    }
  }

  return { counts, wasClamped };
}

// ================== Giáo án (/api/generate-lesson-plan) ==================
// soTiet không phải "số câu" nhưng cùng bản chất (điều khiển độ lớn 1 lượt gọi AI) - 1 giáo án
// quá nhiều tiết vừa không thực tế (giáo viên thường soạn 1-3 tiết/lượt), vừa kéo dài nội dung
// AI phải sinh (hoatDong, tienTrinh...) tỉ lệ thuận, cùng rủi ro như câu hỏi/bài tập.
export function getLessonPlanMaxSoTiet() {
  return envInt("LESSON_PLAN_MAX_SO_TIET", 10);
}

export function clampSoTiet(soTiet) {
  const max = getLessonPlanMaxSoTiet();
  const value = Math.max(1, Number(soTiet) || 1);
  return Math.min(value, max);
}

// ================== Đề cương Ôn tập (/api/generate-outline, Bước 2/Nhóm B) ==================
// Cùng bản chất "Ngân hàng bài tập 3 mức" như exerciseCounts của Phiếu bài tập (3 key thay vì
// nhiều key tự do) - TÁI DÙNG ĐÚNG chiến lược clamp của clampExerciseCounts() ở trên (clamp từng
// mức trước, cắt bớt mức CUỐI CÙNG nếu tổng vẫn vượt trần) thay vì viết lại thuật toán.
export function getOutlineMaxPerLevel() {
  return envInt("OUTLINE_MAX_PER_LEVEL", 15);
}
export function getOutlineMaxTotalExercises() {
  return envInt("OUTLINE_MAX_TOTAL_EXERCISES", 30);
}

/**
 * Cắt (clamp) exerciseCounts của Đề cương Ôn tập (3 key: coBan/nangCao/vanDungCao - xem
 * OUTLINE_LEVELS trong outlineTemplates.js) về đúng trần.
 * @returns {{ counts: object, wasClamped: boolean }}
 */
export function clampOutlineExerciseCounts(exerciseCounts) {
  const maxPerLevel = getOutlineMaxPerLevel();
  const maxTotal = getOutlineMaxTotalExercises();
  let wasClamped = false;

  const counts = {};
  for (const [key, rawValue] of Object.entries(exerciseCounts || {})) {
    const value = Math.max(0, Number(rawValue) || 0);
    const clamped = Math.min(value, maxPerLevel);
    if (clamped !== value) wasClamped = true;
    counts[key] = clamped;
  }

  let total = Object.values(counts).reduce((sum, v) => sum + v, 0);
  if (total > maxTotal) {
    wasClamped = true;
    let excess = total - maxTotal;
    const keys = Object.keys(counts).reverse();
    for (const key of keys) {
      if (excess <= 0) break;
      const cut = Math.min(counts[key], excess);
      counts[key] -= cut;
      excess -= cut;
    }
  }

  return { counts, wasClamped };
}
