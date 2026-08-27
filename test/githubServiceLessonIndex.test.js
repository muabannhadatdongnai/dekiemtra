import { test } from "node:test";
import assert from "node:assert/strict";

/**
 * githubServiceLessonIndex.test.js
 * Kiểm tra fetchLessonIndex - phụ lục "Bài" trong 1 Chương (gợi ý Tên bài + Nội dung cốt lõi ở
 * LessonPlanForm.jsx). REPO đọc từ process.env tại thời điểm import module nên phải set biến
 * môi trường TRƯỚC khi import động (dynamic import), không import tĩnh ở đầu file.
 */

test("fetchLessonIndex: trả về mảng đã chuẩn hoá khi file JSON tồn tại và hợp lệ", async () => {
  process.env.GITHUB_KNOWLEDGE_REPO = "test-owner/test-repo";
  const { fetchLessonIndex } = await import("../src/services/githubService.js?t=" + Date.now());

  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    assert.ok(url.includes("lop_5/toan_t1/chuong_1_bai.json"), `URL sai đường dẫn: ${url}`);
    return {
      ok: true,
      json: async () => [
        { soBai: 1, tenBai: "  Ôn tập các số đến 100 000  ", noiDungCotLoi: "Ôn đọc, viết, so sánh." },
        { soBai: 2, tenBai: "Ôn tập phép cộng, phép trừ", noiDungCotLoi: "Củng cố kỹ thuật tính." },
        { tenBai: "", noiDungCotLoi: "Bị bỏ qua vì tenBai rỗng" },
        { soBai: 4, noiDungCotLoi: "Bị bỏ qua vì thiếu tenBai" },
      ],
    };
  };

  try {
    const lessons = await fetchLessonIndex({ grade: 5, subject: "Toan", volume: 1, chapter: "1" });
    assert.equal(lessons.length, 2, "phải lọc bỏ 2 mục thiếu/rỗng tenBai");
    assert.equal(lessons[0].tenBai, "Ôn tập các số đến 100 000", "phải trim() khoảng trắng thừa");
    assert.equal(lessons[0].soBai, 1);
    assert.equal(lessons[1].noiDungCotLoi, "Củng cố kỹ thuật tính.");
  } finally {
    global.fetch = originalFetch;
  }
});

test("fetchLessonIndex: trả về [] (KHÔNG throw) khi chưa có file phụ lục (HTTP 404)", async () => {
  process.env.GITHUB_KNOWLEDGE_REPO = "test-owner/test-repo";
  const { fetchLessonIndex } = await import("../src/services/githubService.js?t=" + Date.now());

  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: false, status: 404 });

  try {
    const lessons = await fetchLessonIndex({ grade: 5, subject: "Toan", volume: 1, chapter: "1" });
    assert.deepEqual(lessons, [], "chưa có phụ lục -> [] chứ không phải lỗi");
  } finally {
    global.fetch = originalFetch;
  }
});

test("fetchLessonIndex: trả về [] khi lỗi mạng (KHÔNG throw, không cản trở soạn giáo án)", async () => {
  process.env.GITHUB_KNOWLEDGE_REPO = "test-owner/test-repo";
  const { fetchLessonIndex } = await import("../src/services/githubService.js?t=" + Date.now());

  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error("network down");
  };

  try {
    const lessons = await fetchLessonIndex({ grade: 5, subject: "Toan", volume: 1, chapter: "1" });
    assert.deepEqual(lessons, []);
  } finally {
    global.fetch = originalFetch;
  }
});

test("fetchLessonIndex: trả về [] ngay lập tức với Sách nâng cao (không chia theo bài) - không gọi fetch", async () => {
  process.env.GITHUB_KNOWLEDGE_REPO = "test-owner/test-repo";
  const { fetchLessonIndex } = await import("../src/services/githubService.js?t=" + Date.now());
  const { ADVANCED_BOOK_MARKER } = await import("../src/data/constants.js");

  const originalFetch = global.fetch;
  let fetchCalled = false;
  global.fetch = async () => {
    fetchCalled = true;
    return { ok: true, json: async () => [] };
  };

  try {
    const lessons = await fetchLessonIndex({ grade: 5, subject: "Toan", volume: 1, chapter: ADVANCED_BOOK_MARKER });
    assert.deepEqual(lessons, []);
    assert.equal(fetchCalled, false, "không nên gọi fetch cho Sách nâng cao");
  } finally {
    global.fetch = originalFetch;
  }
});

test("fetchLessonIndex: trả về [] khi CHƯA cấu hình GITHUB_KNOWLEDGE_REPO", async () => {
  const previousRepo = process.env.GITHUB_KNOWLEDGE_REPO;
  delete process.env.GITHUB_KNOWLEDGE_REPO;
  try {
    const { fetchLessonIndex } = await import("../src/services/githubService.js?t=" + Date.now());
    const lessons = await fetchLessonIndex({ grade: 5, subject: "Toan", volume: 1, chapter: "1" });
    assert.deepEqual(lessons, []);
  } finally {
    if (previousRepo !== undefined) process.env.GITHUB_KNOWLEDGE_REPO = previousRepo;
  }
});
