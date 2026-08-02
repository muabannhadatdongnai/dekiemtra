// Khớp quy ước "node --test" đã dùng trong dự án (xem mục 11 PROJECT_SUMMARY) —
// không cần cài Jest/Vitest. Chạy: node --test test/topicActivityMap.test.js
import { test } from "node:test";
import assert from "node:assert/strict";

import { ACTIVITY_TYPES, getActivityById } from "../src/data/activityTypes.js";
import { TOPIC_REGISTRY_EXAMPLE, getTopicById } from "../src/data/topicRegistry.example.js";
import { TOPIC_ACTIVITY_MAP, getActivitiesForTopic } from "../src/data/topicActivityMap.js";
import { SAMPLE_WORKSHEET_OUTLINES } from "../src/data/sampleWorksheetOutlines.js";

test("activityTypes: id không trùng lặp", () => {
  const ids = ACTIVITY_TYPES.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("topicRegistry: id không trùng lặp", () => {
  const ids = TOPIC_REGISTRY_EXAMPLE.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("topicActivityMap: mọi activityId tham chiếu phải tồn tại trong activityTypes", () => {
  for (const [topicId, bindings] of Object.entries(TOPIC_ACTIVITY_MAP)) {
    for (const b of bindings) {
      assert.ok(
        getActivityById(b.activityId),
        `Topic "${topicId}" tham chiếu activityId "${b.activityId}" không tồn tại`
      );
    }
  }
});

test("topicActivityMap: mọi topicId trong map phải tồn tại trong topicRegistry (nếu là topic chính thức)", () => {
  for (const topicId of Object.keys(TOPIC_ACTIVITY_MAP)) {
    assert.ok(getTopicById(topicId), `topicActivityMap có key "${topicId}" nhưng topicRegistry không có`);
  }
});

// Đây là test QUAN TRỌNG NHẤT — chốt lại nguyên tắc sửa bug "Nhận diện hình trơ trọi":
// nếu 1 topic có activity "nhan_dien_hinh" thì BẮT BUỘC phải có "dem_va_to_mau" đi kèm,
// và cả 2 đều phải batBuoc: true. Nếu sau này ai đó thêm topic hình học mới mà quên áp
// nguyên tắc này, test sẽ đỏ ngay thay vì lặp lại lỗi cũ.
test("nguyên tắc: nhan_dien_hinh không được đứng một mình, luôn kèm dem_va_to_mau bắt buộc", () => {
  for (const [topicId, bindings] of Object.entries(TOPIC_ACTIVITY_MAP)) {
    const coNhanDienHinh = bindings.some((b) => b.activityId === "nhan_dien_hinh");
    if (!coNhanDienHinh) continue;

    const coDemToMauBatBuoc = bindings.some(
      (b) => b.activityId === "dem_va_to_mau" && b.batBuoc === true
    );
    assert.ok(
      coDemToMauBatBuoc,
      `Topic "${topicId}" có nhan_dien_hinh nhưng thiếu dem_va_to_mau bắt buộc đi kèm`
    );
  }
});

test("getActivitiesForTopic: topic chưa review vẫn trả về tối thiểu 2 dạng bài (không đơn điệu)", () => {
  const result = getActivitiesForTopic("topic_khong_ton_tai_vi_du");
  assert.ok(result.length >= 2);
});

test("getActivitiesForTopic: kết quả luôn sắp theo đúng thứ tự (thuTu tăng dần)", () => {
  const result = getActivitiesForTopic("lop2_toan_doi_don_vi_do_dai");
  const thuTuList = result.map((r) => r.thuTu);
  const sorted = [...thuTuList].sort((a, b) => a - b);
  assert.deepEqual(thuTuList, sorted);
});

test("sampleWorksheetOutlines: mọi activityId trong outline phải tồn tại trong activityTypes", () => {
  for (const outline of SAMPLE_WORKSHEET_OUTLINES) {
    for (const bai of outline.baiTap) {
      assert.ok(
        getActivityById(bai.activityId),
        `Outline "${outline.id}" bài ${bai.thuTu} dùng activityId "${bai.activityId}" không tồn tại`
      );
    }
  }
});
