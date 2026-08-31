import { test } from "node:test";
import assert from "node:assert/strict";
import { buildLessonPlanPrompt } from "../src/data/lessonPlanPromptTemplates.js";

/**
 * lessonPlanEnglishAudioIpa.test.js
 * Test cho 2 quy tắc riêng GIÁO ÁN môn Tiếng Anh theo yêu cầu thực tế của giáo viên Tiếng Anh:
 * a) Gắn thẻ Audio [AUDIO: Track_XX] tại các bước có hoạt động Nghe.
 * b) Kèm phiên âm quốc tế IPA khi giới thiệu từ vựng mới ở hoạt động "Khám phá".
 * CHỈ áp dụng cho GIÁO ÁN môn Tiếng Anh (không phải Mầm non, không rò rỉ sang môn khác hay sang
 * phần ra ĐỀ KIỂM TRA vì buildEnglishLessonPlanGuidance() không đụng tới subjectProfiles.js).
 */

const baseArgs = {
  tenBai: "Animals",
  grade: 3,
  soTiet: 1,
  noiDungCotLoi: "Từ vựng về động vật",
};

test("buildLessonPlanPrompt (Tieng_Anh): phải có quy tắc gắn thẻ [AUDIO: Track_XX]", () => {
  const prompt = buildLessonPlanPrompt({ ...baseArgs, subject: "Tieng_Anh" });
  assert.match(prompt, /\[AUDIO: Track_XX\]/);
  assert.match(prompt, /yêu cầu học sinh NGHE/);
});

test("buildLessonPlanPrompt (Tieng_Anh): phải có quy tắc phiên âm IPA kèm ví dụ", () => {
  const prompt = buildLessonPlanPrompt({ ...baseArgs, subject: "Tieng_Anh" });
  assert.match(prompt, /phiên âm quốc\s+tế IPA/);
  assert.match(prompt, /dolphin \/ˈdɒlfɪn\//);
});

test("buildLessonPlanPrompt: KHÔNG rò rỉ quy tắc Audio/IPA sang môn khác (VD Toán)", () => {
  const prompt = buildLessonPlanPrompt({ ...baseArgs, subject: "Toan" });
  assert.doesNotMatch(prompt, /\[AUDIO: Track_XX\]/);
  assert.doesNotMatch(prompt, /phiên âm quốc\s+tế IPA/);
});

test("buildLessonPlanPrompt: KHÔNG áp dụng quy tắc Audio/IPA cho Mầm non dù chọn Tiếng Anh", () => {
  const prompt = buildLessonPlanPrompt({ ...baseArgs, subject: "Tieng_Anh", grade: "MAM_NON" });
  assert.doesNotMatch(prompt, /\[AUDIO: Track_XX\]/);
  assert.doesNotMatch(prompt, /phiên âm quốc\s+tế IPA/);
});
