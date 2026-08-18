import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import {
  saveReportCommentHistory,
  getPreviousComment,
  getFullCommentHistory,
  summarizeCommentForHistory,
} from "../src/services/reportCommentHistoryStore.js";

/**
 * reportCommentHistoryStore.test.js
 * Việc còn lại từ #8 (Bước 1, NEXT_STEPS.md) — test tự động cho reportCommentHistoryStore.js.
 * ⚠️ Giống questionBankStore.test.js: chỉ test được nhánh FILE JSON LOCAL (không có
 * UPSTASH_REDIS_REST_URL/TOKEN trong môi trường test). Nhánh Upstash dùng chung logic
 * lọc/gộp/parse phía trên, chỉ khác lệnh gọi HTTP — nên test thủ công 1 lần với Upstash thật
 * sau khi deploy (tạo nhận xét 2 lần liên tiếp cho cùng 1 học sinh, xem AI có tránh lặp câu chữ
 * lần trước không).
 */

const TEST_DATA_DIR = path.join(process.cwd(), ".data", "report-comment-history");
const TEST_USERNAME = "__test_teacher__";

after(async () => {
  try {
    const files = await fs.readdir(TEST_DATA_DIR);
    await Promise.all(
      files.filter((f) => f.includes("test_teacher")).map((f) => fs.unlink(path.join(TEST_DATA_DIR, f)))
    );
  } catch {
    // thư mục có thể chưa từng được tạo - bỏ qua
  }
});

test("summarizeCommentForHistory: gộp đủ các trường có giá trị, bỏ qua trường rỗng", () => {
  const text = summarizeCommentForHistory({
    phamChat: "Chăm ngoan",
    nangLuc: "Tự học tốt",
    nhanXetChung: "",
    monHoc: [
      { ten: "Toán", noiDung: "Làm bài tốt" },
      { ten: "Văn", noiDung: "" }, // thiếu noiDung -> bỏ qua
    ],
  });
  assert.ok(text.includes("Phẩm chất: Chăm ngoan"));
  assert.ok(text.includes("Năng lực: Tự học tốt"));
  assert.ok(!text.includes("Nhận xét chung"));
  assert.ok(text.includes("Toán: Làm bài tốt"));
  assert.ok(!text.includes("Văn:"));
});

test("summarizeCommentForHistory: comment rỗng/null trả về chuỗi rỗng, không throw", () => {
  assert.equal(summarizeCommentForHistory(null), "");
  assert.equal(summarizeCommentForHistory(undefined), "");
  assert.equal(summarizeCommentForHistory({}), "");
});

test("học sinh chưa từng lưu nhận xét -> getPreviousComment trả về null, không throw", async () => {
  const result = await getPreviousComment(TEST_USERNAME, "Học sinh chưa từng lưu", "1A");
  assert.equal(result, null);
});

test("lưu rồi đọc lại đúng nội dung vừa lưu (getPreviousComment)", async () => {
  const hoTen = "Nguyễn Văn A";
  const lop = "5A1";
  await saveReportCommentHistory(TEST_USERNAME, {
    hoTen,
    lop,
    comment: { nhanXetChung: "Tiến bộ rõ rệt trong học kỳ này" },
  });

  const result = await getPreviousComment(TEST_USERNAME, hoTen, lop);
  assert.equal(result, "Nhận xét chung: Tiến bộ rõ rệt trong học kỳ này");
});

test("comment rỗng (không có trường nào hợp lệ) -> KHÔNG lưu (trả về false)", async () => {
  const saved = await saveReportCommentHistory(TEST_USERNAME, {
    hoTen: "Học sinh rỗng",
    lop: "5A1",
    comment: {},
  });
  assert.equal(saved, false);

  const result = await getPreviousComment(TEST_USERNAME, "Học sinh rỗng", "5A1");
  assert.equal(result, null);
});

test("lưu nhiều lần liên tiếp -> getPreviousComment trả về lần MỚI NHẤT", async () => {
  const hoTen = "Trần Thị B";
  const lop = "5A2";
  await saveReportCommentHistory(TEST_USERNAME, {
    hoTen,
    lop,
    comment: { nhanXetChung: "Lần thứ nhất" },
  });
  await saveReportCommentHistory(TEST_USERNAME, {
    hoTen,
    lop,
    comment: { nhanXetChung: "Lần thứ hai" },
  });

  const result = await getPreviousComment(TEST_USERNAME, hoTen, lop);
  assert.equal(result, "Nhận xét chung: Lần thứ hai");
});

test("getFullCommentHistory trả về TOÀN BỘ lịch sử còn hạn, mới nhất TRƯỚC (đảo ngược thứ tự lưu)", async () => {
  const hoTen = "Lê Văn C";
  const lop = "5A3";
  await saveReportCommentHistory(TEST_USERNAME, { hoTen, lop, comment: { nhanXetChung: "Đợt 1" } });
  await saveReportCommentHistory(TEST_USERNAME, { hoTen, lop, comment: { nhanXetChung: "Đợt 2" } });
  await saveReportCommentHistory(TEST_USERNAME, { hoTen, lop, comment: { nhanXetChung: "Đợt 3" } });

  const history = await getFullCommentHistory(TEST_USERNAME, hoTen, lop);
  assert.equal(history.length, 3);
  assert.ok(history[0].text.includes("Đợt 3"), "phải là bản ghi mới nhất trước");
  assert.ok(history[2].text.includes("Đợt 1"), "bản ghi cũ nhất phải ở cuối");
});

test("chỉ giữ tối đa 6 bản ghi gần nhất/học sinh (MAX_HISTORY_PER_STUDENT)", async () => {
  const hoTen = "Phạm Thị D";
  const lop = "5A4";
  for (let i = 1; i <= 8; i++) {
    await saveReportCommentHistory(TEST_USERNAME, {
      hoTen,
      lop,
      comment: { nhanXetChung: `Lần thứ ${i}` },
    });
  }

  const history = await getFullCommentHistory(TEST_USERNAME, hoTen, lop);
  assert.equal(history.length, 6, "phải cắt bớt về đúng 6 bản ghi gần nhất");
  assert.ok(history[0].text.includes("Lần thứ 8"), "bản ghi mới nhất phải còn giữ lại");
  assert.ok(!history.some((h) => h.text.includes("Lần thứ 1")), "bản ghi cũ nhất (lần 1) phải đã bị cắt bỏ");
});

test("2 học sinh trùng tên nhưng khác lớp -> lịch sử TÁCH RIÊNG, không lẫn lộn", async () => {
  const hoTen = "Hoàng Văn E";
  await saveReportCommentHistory(TEST_USERNAME, {
    hoTen,
    lop: "5A5",
    comment: { nhanXetChung: "Nhận xét lớp 5A5" },
  });
  await saveReportCommentHistory(TEST_USERNAME, {
    hoTen,
    lop: "5A6",
    comment: { nhanXetChung: "Nhận xét lớp 5A6" },
  });

  const historyA5 = await getPreviousComment(TEST_USERNAME, hoTen, "5A5");
  const historyA6 = await getPreviousComment(TEST_USERNAME, hoTen, "5A6");
  assert.equal(historyA5, "Nhận xét chung: Nhận xét lớp 5A5");
  assert.equal(historyA6, "Nhận xét chung: Nhận xét lớp 5A6");
});

test("bản ghi đã lưu quá MAX_HISTORY_AGE_MS (1 giờ) bị LỌC BỎ, không trả về nữa (TTL 1 giờ)", async () => {
  const hoTen = "Vũ Thị F";
  const lop = "5A7";

  // Ghi thẳng 1 bản ghi ĐÃ QUÁ HẠN (savedAt cách đây hơn 1 giờ) trực tiếp vào file local,
  // mô phỏng đúng tình huống "lớp lọc phòng hờ" phải xử lý (xem giải thích "cơ chế xoá sớm (2
  // lớp)" ở đầu reportCommentHistoryStore.js) - vì saveReportCommentHistory() luôn ghi savedAt
  // = Date.now() nên không thể tạo bản ghi quá hạn bằng đường API công khai.
  await fs.mkdir(TEST_DATA_DIR, { recursive: true });
  // Lưu 1 bản ghi hợp lệ trước để tạo đúng file (đúng logic sanitize nội bộ của module), sau đó
  // ghi đè nội dung file đó thành bản ghi đã quá hạn.
  await saveReportCommentHistory(TEST_USERNAME, {
    hoTen,
    lop,
    comment: { nhanXetChung: "Sẽ bị ghi đè thành quá hạn" },
  });

  const files = await fs.readdir(TEST_DATA_DIR);
  const targetFile = files.find((f) => f.includes("test_teacher") && f.includes("vũ_thị_f"));
  assert.ok(targetFile, "phải tìm được file vừa lưu để mô phỏng bản ghi quá hạn");

  const staleEntry = JSON.stringify({
    text: "Nhận xét chung: Bản ghi đã quá hạn 1 giờ",
    kyHoc: null,
    savedAt: Date.now() - 61 * 60 * 1000, // quá 1 giờ 1 phút
  });
  await fs.writeFile(path.join(TEST_DATA_DIR, targetFile), JSON.stringify([staleEntry]), "utf8");

  const result = await getPreviousComment(TEST_USERNAME, hoTen, lop);
  assert.equal(result, null, "bản ghi quá hạn 1 giờ KHÔNG được trả về nữa");

  const fullHistory = await getFullCommentHistory(TEST_USERNAME, hoTen, lop);
  assert.deepEqual(fullHistory, []);
});

test("bản ghi VẪN CÒN trong hạn 1 giờ -> vẫn được trả về bình thường", async () => {
  const hoTen = "Đặng Văn G";
  const lop = "5A8";

  await saveReportCommentHistory(TEST_USERNAME, {
    hoTen,
    lop,
    comment: { nhanXetChung: "Bản ghi mới, còn trong hạn" },
  });

  const files = await fs.readdir(TEST_DATA_DIR);
  const targetFile = files.find((f) => f.includes("test_teacher") && f.includes("đặng_văn_g"));
  assert.ok(targetFile);

  // Ghi đè lại savedAt cho gần đúng 59 phút trước (vẫn trong hạn 1 giờ) để test rõ biên TTL.
  const freshEntry = JSON.stringify({
    text: "Nhận xét chung: Bản ghi 59 phút trước",
    kyHoc: null,
    savedAt: Date.now() - 59 * 60 * 1000,
  });
  await fs.writeFile(path.join(TEST_DATA_DIR, targetFile), JSON.stringify([freshEntry]), "utf8");

  const result = await getPreviousComment(TEST_USERNAME, hoTen, lop);
  assert.equal(result, "Nhận xét chung: Bản ghi 59 phút trước");
});
