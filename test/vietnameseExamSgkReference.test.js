import { test } from "node:test";
import assert from "node:assert/strict";

/**
 * vietnameseExamSgkReference.test.js
 * PHIÊN 30 - liên kết SGK Tiếng Việt thật cho tab "📖 Đề Tiếng Việt Tiểu học": gợi ý Tên bài (tái
 * dùng phụ lục "Bài" đã có) cho khối Đọc thành tiếng/Chính tả, và trích ngữ liệu chương SGK làm
 * "referenceContext" cho khối Đọc thầm tự viết ngữ liệu MỚI (không copy nguyên văn). Xem chi tiết
 * trong VietnameseExamForm.jsx + vietnameseExamOrchestrator.js + docThamBlock.js mục "PHIÊN 30".
 */

test("buildDocThamPrompt: KHÔNG có khối tài liệu tham khảo khi referenceContext rỗng/không truyền (giữ hành vi cũ)", async () => {
  const { buildDocThamPrompt } = await import("../src/services/vietnameseBlocks/docThamBlock.js");
  const prompt = buildDocThamPrompt({ grade: 5, chuDe: "", soCauHoi: 8 });
  assert.ok(!prompt.includes("TÀI LIỆU THAM KHẢO"), "không truyền referenceContext thì không được có khối tài liệu tham khảo");
});

test("buildDocThamPrompt: có khối tài liệu tham khảo + dặn KHÔNG chép nguyên văn khi có referenceContext", async () => {
  const { buildDocThamPrompt } = await import("../src/services/vietnameseBlocks/docThamBlock.js");
  const prompt = buildDocThamPrompt({ grade: 3, chuDe: "Tình bạn", soCauHoi: 8, referenceContext: "Nội dung chương 1 SGK..." });
  assert.ok(prompt.includes("TÀI LIỆU THAM KHẢO"), "phải có khối tài liệu tham khảo khi có referenceContext");
  assert.ok(prompt.includes("Nội dung chương 1 SGK..."), "phải nhúng đúng nội dung referenceContext vào prompt");
  assert.ok(prompt.includes("KHÔNG"), "phải có dặn dò cấm chép nguyên văn (chống vi phạm bản quyền)");
});

test("orchestrateVietnameseExamGeneration: KHÔNG gọi fetchMarkdownFromGitHub nếu không chọn sgkChapterId (giữ hành vi cũ)", async () => {
  process.env.GITHUB_KNOWLEDGE_REPO = "test-owner/test-repo";
  const { orchestrateVietnameseExamGeneration } = await import("../src/services/vietnameseExamOrchestrator.js?t=" + Date.now());

  const originalFetch = global.fetch;
  let fetchCalled = false;
  global.fetch = async () => {
    fetchCalled = true;
    return { ok: true, text: async () => "nội dung chương" };
  };

  try {
    const { results } = await orchestrateVietnameseExamGeneration({
      grade: 5,
      selectedBlocks: ["docThanhTieng"],
      blockInputs: { docThanhTieng: { tenBai: "Cây gạo ngoài bến sông" } },
      sgkVolume: 1,
      sgkChapterId: null,
    });
    assert.equal(fetchCalled, false, "không chọn Chương thì không được gọi GitHub");
    assert.ok(results.docThanhTieng, "khối Đọc thành tiếng vẫn phải tạo được bình thường");
  } finally {
    global.fetch = originalFetch;
  }
});

test("orchestrateVietnameseExamGeneration: KHÔNG gọi fetchMarkdownFromGitHub nếu khối Đọc thầm không được chọn (dù có sgkChapterId)", async () => {
  process.env.GITHUB_KNOWLEDGE_REPO = "test-owner/test-repo";
  const { orchestrateVietnameseExamGeneration } = await import("../src/services/vietnameseExamOrchestrator.js?t=" + Date.now());

  const originalFetch = global.fetch;
  let fetchCalled = false;
  global.fetch = async () => {
    fetchCalled = true;
    return { ok: true, text: async () => "nội dung chương" };
  };

  try {
    await orchestrateVietnameseExamGeneration({
      grade: 5,
      selectedBlocks: ["docThanhTieng"], // KHÔNG có "docTham"
      blockInputs: { docThanhTieng: { tenBai: "Cây gạo ngoài bến sông" } },
      sgkVolume: 1,
      sgkChapterId: "1",
    });
    assert.equal(fetchCalled, false, "khối Đọc thầm không được chọn thì không cần tải chương SGK");
  } finally {
    global.fetch = originalFetch;
  }
});

test("orchestrateVietnameseExamGeneration: tải đúng URL chương SGK Tiếng Việt và không làm hỏng lượt tạo nếu tải lỗi", async () => {
  process.env.GITHUB_KNOWLEDGE_REPO = "test-owner/test-repo";
  const { orchestrateVietnameseExamGeneration } = await import("../src/services/vietnameseExamOrchestrator.js?t=" + Date.now());

  const originalFetch = global.fetch;
  let calledUrl = null;
  global.fetch = async (url) => {
    calledUrl = url;
    return { ok: false, status: 404 };
  };

  try {
    const { results, warnings } = await orchestrateVietnameseExamGeneration({
      grade: 3,
      selectedBlocks: ["docTham"],
      blockInputs: { docTham: { chuDe: "", soCauHoi: 8 } },
      sgkVolume: 2,
      sgkChapterId: "5",
    });
    assert.ok(calledUrl.includes("lop_3/tieng_viet_t2/chuong_5.md"), `URL sai đường dẫn: ${calledUrl}`);
    // Tải lỗi (404) -> chỉ đẩy cảnh báo, KHÔNG throw - lượt tạo vẫn phải chạy tiếp (nhưng khối
    // "docTham" trong test này sẽ tự lỗi vì không có Gemini key thật trong môi trường test, nên
    // chỉ assert có warning về SGK, không assert results.docTham thành công).
    assert.ok(
      warnings.some((w) => w.includes("Không tải được tài liệu SGK Tiếng Việt")),
      "phải có cảnh báo tải SGK lỗi (không throw)"
    );
  } finally {
    global.fetch = originalFetch;
  }
});
