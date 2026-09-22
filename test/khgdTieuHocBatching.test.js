import { test } from "node:test";
import assert from "node:assert/strict";
import { chunkLessons, getKhgdTieuHocAiBatchSize } from "../src/services/contentGenerationLimits.js";

/**
 * khgdTieuHocBatching.test.js  (Phiên 50 - sửa lỗi)
 * Bối cảnh: Hoan báo lỗi "JSON.parse: unexpected character at line 1 column 1 of the JSON data"
 * khi bấm "Tạo Khung KHGD Tiểu học" sau khi dùng nút "Tự tính số tiết" (nạp đủ các chương của cả
 * học kì rồi mới tạo 1 lượt - Tiếng Việt Lớp 2 lên tới ~160-170 dòng). Nguyên nhân: khgdTieuHocEngine.js
 * TRƯỚC ĐÓ gửi HẾT danh sách bài trong 1 lần gọi AI (không chia lô như khgdEngine.js/THCS-THPT), JSON
 * trả về nhiều phần tử dễ bị cắt giữa chừng hoặc mất quá lâu → trình duyệt nhận về dữ liệu không hợp
 * lệ. Đã thêm chia lô (getKhgdTieuHocAiBatchSize/chunkLessons) - không mock Gemini thật (đúng quy ước
 * hiện có của repo, không có test nào mock generateContentWithFailover) nhưng test phần NỐI DÂY thuần:
 * batch size hợp lý + chunkLessons chia đúng, không mất/lặp bài.
 */

test("getKhgdTieuHocAiBatchSize: có giá trị dương hợp lý, đổi được qua env KHGD_TIEU_HOC_AI_BATCH_SIZE", () => {
  const original = process.env.KHGD_TIEU_HOC_AI_BATCH_SIZE;
  try {
    delete process.env.KHGD_TIEU_HOC_AI_BATCH_SIZE;
    assert.equal(getKhgdTieuHocAiBatchSize(), 60);

    process.env.KHGD_TIEU_HOC_AI_BATCH_SIZE = "25";
    assert.equal(getKhgdTieuHocAiBatchSize(), 25);
  } finally {
    if (original === undefined) delete process.env.KHGD_TIEU_HOC_AI_BATCH_SIZE;
    else process.env.KHGD_TIEU_HOC_AI_BATCH_SIZE = original;
  }
});

test("Tiếng Việt Lớp 2 cả học kì (~170 dòng) được chia thành nhiều lô, giữ đúng thứ tự và đủ số dòng", () => {
  const lessons = Array.from({ length: 170 }, (_, i) => ({ id: `l${i}`, tenBai: `Bài ${i}` }));
  const batches = chunkLessons(lessons, getKhgdTieuHocAiBatchSize());
  assert.ok(batches.length > 1, "170 dòng phải chia thành NHIỀU lô, không gửi hết 1 lần như trước Phiên 50");
  assert.ok(batches.every((b) => b.length <= getKhgdTieuHocAiBatchSize() && b.length > 0));
  assert.deepEqual(
    batches.flat().map((l) => l.id),
    lessons.map((l) => l.id)
  );
});

test("Danh sách ngắn (1 chương, vài dòng) vẫn chỉ tốn 1 lần gọi như hành vi cũ", () => {
  const lessons = Array.from({ length: 8 }, (_, i) => ({ id: `l${i}` }));
  const batches = chunkLessons(lessons, getKhgdTieuHocAiBatchSize());
  assert.equal(batches.length, 1);
  assert.equal(batches[0].length, 8);
});

// ---------------------------------------------------------------------------------------------
// apiClient.handleResponse: không còn crash với lỗi trình duyệt khó hiểu khi server trả về dữ
// liệu KHÔNG PHẢI JSON hợp lệ (rớt kết nối, lỗi hạ tầng 502/504, phản hồi rỗng).
// ---------------------------------------------------------------------------------------------

async function freshApiClient() {
  // Query string ngẫu nhiên: mock global.fetch riêng cho từng test, không ảnh hưởng module đã cache
  // (cùng kỹ thuật test/upstashClient.test.js).
  return import(`../src/services/apiClient.js?t=${Date.now()}-${Math.random()}`);
}

test("generateKhgdTieuHocRequest: server trả về HTML/rỗng (không phải JSON) → lỗi tiếng Việt dễ hiểu, không lộ lỗi gốc của trình duyệt", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response("<html>502 Bad Gateway</html>", { status: 502, headers: { "content-type": "text/html" } });
  try {
    const { generateKhgdTieuHocRequest } = await freshApiClient();
    await assert.rejects(() => generateKhgdTieuHocRequest({ lessons: [] }), (err) => {
      assert.match(err.message, /Máy chủ trả về dữ liệu không hợp lệ \(HTTP 502\)/);
      assert.doesNotMatch(err.message, /JSON\.parse|Unexpected token|column \d/i, "không lộ lỗi gốc khó hiểu của trình duyệt");
      return true;
    });
  } finally {
    global.fetch = originalFetch;
  }
});

test("generateKhgdTieuHocRequest: server trả JSON lỗi hợp lệ vẫn báo đúng nội dung message cũ (không đổi hành vi khi JSON hợp lệ)", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response(JSON.stringify({ error: "Hết hạn mức Gemini hôm nay." }), { status: 502, headers: { "content-type": "application/json" } });
  try {
    const { generateKhgdTieuHocRequest } = await freshApiClient();
    await assert.rejects(() => generateKhgdTieuHocRequest({ lessons: [] }), /Hết hạn mức Gemini hôm nay\./);
  } finally {
    global.fetch = originalFetch;
  }
});

test("generateKhgdTieuHocRequest: phản hồi thành công vẫn trả đúng dữ liệu như trước", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({ success: true, lessons: [{ id: "l1", dieuChinh: "" }] }), { status: 200 });
  try {
    const { generateKhgdTieuHocRequest } = await freshApiClient();
    const data = await generateKhgdTieuHocRequest({ lessons: [{ id: "l1" }] });
    assert.deepEqual(data, { success: true, lessons: [{ id: "l1", dieuChinh: "" }] });
  } finally {
    global.fetch = originalFetch;
  }
});
