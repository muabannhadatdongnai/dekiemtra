import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getActivityLabels,
  computeMultiPeriodTimeline,
  STEM_VAN_DUNG_LABEL_BY_LANGUAGE,
} from "../src/data/lessonPlanTemplates.js";
import { FOREIGN_LANGUAGE_SUBJECTS } from "../src/data/foreignLanguageSubjects.js";
import { INTEGRATION_KEYS } from "../src/data/lessonPlanIntegrations.js";
import { LABELS_VI, LABELS_ZH, LABELS_JA, LABELS_FR, pickLabels } from "../src/data/lessonPlanPreviewLabels.js";

/**
 * lessonPlanForeignLanguage2Labels.test.js (Phiên 38)
 * Khoá lại lỗi "hạt sạn tiếng Việt" giáo viên phản ánh (kèm ảnh chụp màn hình) khi soạn giáo án
 * môn Tiếng Trung/Nhật/Pháp (Ngoại ngữ 2, thêm ở Phiên 38): bản xem trước web VẪN hiển thị nhãn/
 * tiêu đề tĩnh bằng TIẾNG VIỆT (VD "I. YÊU CẦU CẦN ĐẠT" thay vì "一、学习目标") dù nội dung bài học
 * do AI sinh đã đúng ngôn ngữ đích - nguyên nhân do pickLabels()/getActivityLabels() trước đó chỉ
 * nhận diện "en", 3 ngôn ngữ mới rơi về mặc định tiếng Việt.
 *
 * ⚠️ RIÊNG "tinNhanTitle" (PHỤ LỤC: Tin nhắn gửi phụ huynh - Zalo) PHẢI CỐ Ý giữ nguyên tiếng Việt
 * cho MỌI ngôn ngữ (phụ huynh học sinh Việt Nam đọc trực tiếp) - test dưới đây kiểm tra ĐÚNG cả 2
 * chiều: mọi nhãn khác phải KHÁC tiếng Việt, nhưng "tinNhanTitle" (và "noDataHint" - hướng dẫn thao
 * tác UI cho giáo viên) thì PHẢI giống hệt tiếng Việt.
 *
 * Chạy: node --test test/lessonPlanForeignLanguage2Labels.test.js
 */

const NGOAI_NGU_2_CODES = ["zh", "ja", "fr"];
const LABELS_BY_CODE = { zh: LABELS_ZH, ja: LABELS_JA, fr: LABELS_FR };

// Các nhãn TĨNH CỐ Ý giống tiếng Việt ở mọi ngôn ngữ (không phải lỗi bỏ sót dịch).
const INTENTIONALLY_VIETNAMESE_KEYS = ["noDataHint", "tinNhanTitle"];

test("foreignLanguageSubjects.js: cả 3 môn Ngoại ngữ 2 (Tiếng Trung/Nhật/Pháp) đã có trong danh bạ", () => {
  const codes = FOREIGN_LANGUAGE_SUBJECTS.map((c) => c.languageCode);
  for (const code of NGOAI_NGU_2_CODES) {
    assert.ok(codes.includes(code), `Thiếu languageCode "${code}" trong FOREIGN_LANGUAGE_SUBJECTS`);
  }
});

for (const code of NGOAI_NGU_2_CODES) {
  test(`LessonPlanPreview.jsx: pickLabels("${code}") KHÔNG còn hạt sạn tiếng Việt (trừ 2 nhãn cố ý giữ nguyên)`, () => {
    const L = pickLabels(code);
    assert.notEqual(L, LABELS_VI, `pickLabels("${code}") không được rơi về LABELS_VI`);
    for (const key of Object.keys(LABELS_VI)) {
      if (INTENTIONALLY_VIETNAMESE_KEYS.includes(key)) continue;
      if (typeof LABELS_VI[key] === "function") continue; // periodBoundary - so sánh riêng bên dưới
      if (Array.isArray(LABELS_VI[key])) continue; // phanHoaGroups - so sánh riêng bên dưới
      assert.notEqual(
        L[key],
        LABELS_VI[key],
        `Nhãn "${key}" của ngôn ngữ "${code}" vẫn còn là tiếng Việt ("${LABELS_VI[key]}") - hạt sạn chưa được dịch`
      );
    }
  });

  test(`LessonPlanPreview.jsx: pickLabels("${code}").tinNhanTitle PHẢI giữ nguyên tiếng Việt (phụ huynh đọc trực tiếp)`, () => {
    const L = pickLabels(code);
    assert.equal(L.tinNhanTitle, LABELS_VI.tinNhanTitle, `"tinNhanTitle" của ngôn ngữ "${code}" không được dịch`);
  });

  test(`LessonPlanPreview.jsx: pickLabels("${code}") - periodBoundary() và phanHoaGroups đã dịch, không còn tiếng Việt`, () => {
    const L = pickLabels(code);
    assert.notEqual(L.periodBoundary(3), LABELS_VI.periodBoundary(3), `periodBoundary() của "${code}" vẫn còn tiếng Việt`);
    L.phanHoaGroups.forEach((g, i) => {
      assert.notEqual(
        g.label,
        LABELS_VI.phanHoaGroups[i].label,
        `phanHoaGroups[${i}].label của "${code}" vẫn còn tiếng Việt`
      );
    });
  });

  test(`LessonPlanPreview.jsx: LABELS_${code.toUpperCase()} export đúng bản dịch tương ứng`, () => {
    assert.equal(pickLabels(code), LABELS_BY_CODE[code]);
  });

  test(`lessonPlanTemplates.js: getActivityLabels(..., "${code}") trả về đủ 4 nhãn hoạt động KHÔNG phải tiếng Việt`, () => {
    const activities = getActivityLabels("bai_moi", [], code);
    assert.equal(activities.length, 4);
    const viLabels = getActivityLabels("bai_moi", [], "vi").map((a) => a.label);
    activities.forEach((a, i) => {
      assert.notEqual(a.label, viLabels[i], `Hoạt động "${a.key}" của ngôn ngữ "${code}" vẫn còn tiếng Việt`);
    });
  });

  test(`lessonPlanTemplates.js: getActivityLabels(..., "${code}") với STEM bật -> nhãn "Vận dụng" đúng ngôn ngữ đích`, () => {
    const activities = getActivityLabels("bai_moi", [INTEGRATION_KEYS.TICH_HOP_STEM], code);
    const vanDung = activities.find((a) => a.key === "van_dung");
    assert.equal(vanDung.label, STEM_VAN_DUNG_LABEL_BY_LANGUAGE[code]);
    assert.notEqual(vanDung.label, STEM_VAN_DUNG_LABEL_BY_LANGUAGE.vi);
  });

  test(`lessonPlanTemplates.js: computeMultiPeriodTimeline(..., "${code}") - nhãn "Khởi động lại" ở tiết 2 đúng ngôn ngữ đích`, () => {
    const periods = computeMultiPeriodTimeline(2, 6, "bai_moi", code);
    const khoiDongLaiTiet2 = periods[1].segments.find((s) => s.key === "khoi_dong");
    assert.ok(khoiDongLaiTiet2, `Tiết 2 phải có phân đoạn "khoi_dong"`);
    assert.notEqual(khoiDongLaiTiet2.label, "Khởi động lại", `Nhãn "Khởi động lại" của ngôn ngữ "${code}" chưa được dịch`);
  });
}

test('LessonPlanPreview.jsx: pickLabels("vi")/pickLabels(undefined) vẫn trả về LABELS_VI (không phá hành vi cũ)', () => {
  assert.equal(pickLabels("vi"), LABELS_VI);
  assert.equal(pickLabels(undefined), LABELS_VI);
  assert.equal(pickLabels("xx-chua-ho-tro"), LABELS_VI);
});

test("LessonPlanPreview.jsx: LABELS_ZH/LABELS_JA/LABELS_FR có ĐỦ mọi khoá như LABELS_VI (không thiếu field khi thêm ngôn ngữ mới)", () => {
  const viKeys = Object.keys(LABELS_VI).sort();
  for (const [code, labels] of Object.entries(LABELS_BY_CODE)) {
    assert.deepEqual(Object.keys(labels).sort(), viKeys, `LABELS_${code.toUpperCase()} thiếu/thừa khoá so với LABELS_VI`);
  }
});
