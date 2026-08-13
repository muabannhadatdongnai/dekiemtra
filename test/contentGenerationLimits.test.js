import { test } from "node:test";
import assert from "node:assert/strict";
import {
  clampChapterMatrix,
  clampExerciseCounts,
  clampSoTiet,
  getExamMaxPerCell,
  getExamMaxTotalQuestions,
  getWorksheetMaxPerExercise,
  getWorksheetMaxTotalExercises,
  getLessonPlanMaxSoTiet,
} from "../src/services/contentGenerationLimits.js";

// ================== clampChapterMatrix (/api/generate) ==================

test("chapterMatrix trong hạn mức -> giữ nguyên, wasClamped=false", () => {
  const input = { chuong_1: { NHAN_BIET: 3, THONG_HIEU: 2, VAN_DUNG: 1, VAN_DUNG_CAO: 0 } };
  const { matrix, wasClamped } = clampChapterMatrix(input);
  assert.deepEqual(matrix, input);
  assert.equal(wasClamped, false);
});

test("1 ô vượt trần per-cell -> bị cắt về đúng trần, các ô khác giữ nguyên", () => {
  const maxPerCell = getExamMaxPerCell();
  const input = { chuong_1: { NHAN_BIET: maxPerCell + 50, THONG_HIEU: 2 } };
  const { matrix, wasClamped } = clampChapterMatrix(input);
  assert.equal(matrix.chuong_1.NHAN_BIET, maxPerCell);
  assert.equal(matrix.chuong_1.THONG_HIEU, 2);
  assert.equal(wasClamped, true);
});

test("nhiều chương/ô hợp lệ riêng lẻ nhưng TỔNG vượt trần -> bị cắt bớt để tổng <= trần", () => {
  const maxPerCell = getExamMaxPerCell();
  const maxTotal = getExamMaxTotalQuestions();
  // Dựng đủ số chương để mỗi ô dưới trần per-cell nhưng tổng vượt hẳn maxTotal.
  const perChapter = Math.max(1, Math.floor(maxPerCell / 2));
  const chapterCount = Math.ceil((maxTotal + perChapter * 2) / perChapter);
  const input = {};
  for (let i = 0; i < chapterCount; i++) {
    input[`chuong_${i}`] = { NHAN_BIET: perChapter };
  }

  const { matrix, wasClamped } = clampChapterMatrix(input);
  const total = Object.values(matrix).reduce(
    (sum, levels) => sum + Object.values(levels).reduce((s, v) => s + v, 0),
    0
  );
  assert.ok(total <= maxTotal, `tổng sau clamp (${total}) phải <= trần (${maxTotal})`);
  assert.equal(wasClamped, true);
});

test("clampChapterMatrix không throw với giá trị âm/chuỗi/undefined lẫn trong dữ liệu", () => {
  assert.doesNotThrow(() => {
    clampChapterMatrix({ chuong_1: { NHAN_BIET: -5, THONG_HIEU: "abc", VAN_DUNG: undefined } });
  });
  const { matrix } = clampChapterMatrix({ chuong_1: { NHAN_BIET: -5, THONG_HIEU: "abc" } });
  assert.equal(matrix.chuong_1.NHAN_BIET, 0);
  assert.equal(matrix.chuong_1.THONG_HIEU, 0);
});

test("clampChapterMatrix với input rỗng/null -> trả về matrix rỗng, không throw", () => {
  assert.deepEqual(clampChapterMatrix(null).matrix, {});
  assert.deepEqual(clampChapterMatrix(undefined).matrix, {});
  assert.equal(clampChapterMatrix(null).wasClamped, false);
});

// ================== clampExerciseCounts (/api/generate-worksheet) ==================

test("exerciseCounts trong hạn mức -> giữ nguyên", () => {
  const input = { tinh_nham: 5, dem_va_viet_so: 3 };
  const { counts, wasClamped } = clampExerciseCounts(input);
  assert.deepEqual(counts, input);
  assert.equal(wasClamped, false);
});

test("1 dạng bài vượt trần per-exercise -> bị cắt về đúng trần", () => {
  const maxPerExercise = getWorksheetMaxPerExercise();
  const { counts, wasClamped } = clampExerciseCounts({ tinh_nham: maxPerExercise + 100 });
  assert.equal(counts.tinh_nham, maxPerExercise);
  assert.equal(wasClamped, true);
});

test("nhiều dạng bài hợp lệ riêng lẻ nhưng TỔNG vượt trần -> bị cắt bớt để tổng <= trần", () => {
  const maxPerExercise = getWorksheetMaxPerExercise();
  const maxTotal = getWorksheetMaxTotalExercises();
  const perType = Math.max(1, Math.floor(maxPerExercise / 2));
  const typeCount = Math.ceil((maxTotal + perType * 2) / perType);
  const input = {};
  for (let i = 0; i < typeCount; i++) input[`dang_bai_${i}`] = perType;

  const { counts, wasClamped } = clampExerciseCounts(input);
  const total = Object.values(counts).reduce((s, v) => s + v, 0);
  assert.ok(total <= maxTotal, `tổng sau clamp (${total}) phải <= trần (${maxTotal})`);
  assert.equal(wasClamped, true);
});

test("clampExerciseCounts không âm dù input âm", () => {
  const { counts } = clampExerciseCounts({ tinh_nham: -10 });
  assert.equal(counts.tinh_nham, 0);
});

// ================== clampSoTiet (/api/generate-lesson-plan) ==================

test("soTiet trong hạn mức -> giữ nguyên", () => {
  assert.equal(clampSoTiet(2), 2);
});

test("soTiet vượt trần -> bị cắt về đúng trần", () => {
  const max = getLessonPlanMaxSoTiet();
  assert.equal(clampSoTiet(max + 1000), max);
});

test("soTiet <= 0 hoặc không hợp lệ -> tối thiểu 1", () => {
  assert.equal(clampSoTiet(0), 1);
  assert.equal(clampSoTiet(-5), 1);
  assert.equal(clampSoTiet("khong_phai_so"), 1);
  assert.equal(clampSoTiet(undefined), 1);
});
