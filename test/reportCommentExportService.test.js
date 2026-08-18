import { test } from "node:test";
import assert from "node:assert/strict";
import { buildParentFriendlyReportSections } from "../src/services/reportCommentExportService.js";

/**
 * reportCommentExportService.test.js
 * Việc còn lại từ #8 (Bước 1, NEXT_STEPS.md) — test tự động cho buildParentFriendlyReportSections()
 * (dữ liệu ĐÃ CHUẨN HOÁ cho PDF "thân thiện phụ huynh" - Bước 1, Việc #8). Hàm này KHÔNG biết gì
 * về React/CSS, chỉ chuẩn bị dữ liệu, nên test bằng Node thuần (không cần jsdom).
 */

test("buildParentFriendlyReportSections: 1 học sinh Tiểu học -> đủ 3 mục Phẩm chất/Năng lực/Nhận xét chung + môn học", () => {
  const sections = buildParentFriendlyReportSections({
    cap: "tieu_hoc",
    results: [
      {
        hoTen: "Nguyễn Văn A",
        lop: "5A1",
        comment: {
          phamChat: "Chăm ngoan, lễ phép",
          nangLuc: "Tự học tốt, biết hợp tác nhóm",
          nhanXetChung: "Có nhiều tiến bộ trong học kỳ này",
          monHoc: [{ ten: "Toán", noiDung: "Nắm vững kiến thức cơ bản" }],
        },
      },
    ],
  });

  assert.equal(sections.length, 1);
  const s = sections[0];
  assert.equal(s.hoTen, "Nguyễn Văn A");
  assert.equal(s.lop, "5A1");
  assert.equal(s.circularLabel, "Bám sát Thông tư 27/2020/TT-BGDĐT");
  assert.deepEqual(s.items, [
    { label: "Về phẩm chất", text: "Chăm ngoan, lễ phép" },
    { label: "Về năng lực", text: "Tự học tốt, biết hợp tác nhóm" },
    { label: "Nhận xét chung", text: "Có nhiều tiến bộ trong học kỳ này" },
    { label: "Môn Toán", text: "Nắm vững kiến thức cơ bản" },
  ]);
});

test("buildParentFriendlyReportSections: dùng nhãn THÂN THIỆN, khác nhãn kỹ thuật (không lộ 'phamChat'/'nangLuc' thô)", () => {
  const sections = buildParentFriendlyReportSections({
    cap: "tieu_hoc",
    results: [
      { hoTen: "B", lop: "1A", comment: { phamChat: "Tốt", nangLuc: "Khá" } },
    ],
  });
  const labels = sections[0].items.map((i) => i.label);
  assert.deepEqual(labels, ["Về phẩm chất", "Về năng lực"]);
  assert.ok(!labels.includes("phamChat"));
  assert.ok(!labels.includes("nangLuc"));
});

test("buildParentFriendlyReportSections: THCS/THPT (cấu trúc 'đoạn-văn') vẫn ra đúng circularLabel riêng", () => {
  const sections = buildParentFriendlyReportSections({
    cap: "thcs",
    results: [
      {
        hoTen: "Trần Thị C",
        lop: "8A2",
        comment: {
          nhanXetChung: "Ý thức học tập tốt",
          monHoc: [{ ten: "Ngữ văn", noiDung: "Viết văn mạch lạc" }],
        },
      },
    ],
  });
  assert.equal(sections[0].circularLabel, "Bám sát Thông tư 22/2021/TT-BGDĐT");
  assert.deepEqual(sections[0].items, [
    { label: "Nhận xét chung", text: "Ý thức học tập tốt" },
    { label: "Môn Ngữ văn", text: "Viết văn mạch lạc" },
  ]);
});

test("buildParentFriendlyReportSections: bỏ qua phần tử có error/không có comment (giống buildAllCommentsPlainText)", () => {
  const sections = buildParentFriendlyReportSections({
    cap: "tieu_hoc",
    results: [
      { hoTen: "Học sinh lỗi", lop: "1A", error: "Gemini lỗi", comment: null },
      { hoTen: "Học sinh hợp lệ", lop: "1A", comment: { nhanXetChung: "Ổn" } },
    ],
  });
  assert.equal(sections.length, 1);
  assert.equal(sections[0].hoTen, "Học sinh hợp lệ");
});

test("buildParentFriendlyReportSections: bỏ qua trường/môn học rỗng, không tạo mục rác", () => {
  const sections = buildParentFriendlyReportSections({
    cap: "tieu_hoc",
    results: [
      {
        hoTen: "D",
        lop: "1A",
        comment: {
          phamChat: "",
          nangLuc: "Tốt",
          monHoc: [
            { ten: "Toán", noiDung: "" }, // thiếu noiDung -> bỏ qua
            { ten: "", noiDung: "Có nội dung nhưng thiếu tên môn" }, // thiếu ten -> bỏ qua
            { ten: "Tiếng Việt", noiDung: "Đọc trôi chảy" },
          ],
        },
      },
    ],
  });
  assert.deepEqual(sections[0].items, [
    { label: "Về năng lực", text: "Tốt" },
    { label: "Môn Tiếng Việt", text: "Đọc trôi chảy" },
  ]);
});

test("buildParentFriendlyReportSections: mảng results rỗng/null -> trả về mảng rỗng, không throw", () => {
  assert.deepEqual(buildParentFriendlyReportSections({ cap: "tieu_hoc", results: [] }), []);
  assert.deepEqual(buildParentFriendlyReportSections({ cap: "tieu_hoc", results: null }), []);
});

test("buildParentFriendlyReportSections: nhiều học sinh -> giữ đúng thứ tự, mỗi em 1 phần tử độc lập", () => {
  const sections = buildParentFriendlyReportSections({
    cap: "tieu_hoc",
    results: [
      { hoTen: "Em 1", lop: "1A", comment: { nhanXetChung: "Nhận xét 1" } },
      { hoTen: "Em 2", lop: "1A", comment: { nhanXetChung: "Nhận xét 2" } },
      { hoTen: "Em 3", lop: "1A", comment: { nhanXetChung: "Nhận xét 3" } },
    ],
  });
  assert.deepEqual(
    sections.map((s) => s.hoTen),
    ["Em 1", "Em 2", "Em 3"]
  );
});

test("buildParentFriendlyReportSections: thiếu 'lop' -> lop trả về chuỗi rỗng, không phải undefined/null", () => {
  const sections = buildParentFriendlyReportSections({
    cap: "tieu_hoc",
    results: [{ hoTen: "Không có lớp", comment: { nhanXetChung: "Ổn" } }],
  });
  assert.equal(sections[0].lop, "");
});

test("buildParentFriendlyReportSections: cap không hợp lệ -> circularLabel rỗng, không throw", () => {
  const sections = buildParentFriendlyReportSections({
    cap: "cap_khong_ton_tai",
    results: [{ hoTen: "A", lop: "1A", comment: { nhanXetChung: "Ổn" } }],
  });
  assert.equal(sections[0].circularLabel, "");
});
