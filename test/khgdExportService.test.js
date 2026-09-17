import { test } from "node:test";
import assert from "node:assert/strict";
import { Packer } from "docx";
import { buildKhgdDocument } from "../src/services/khgdExportService.js";

/**
 * khgdExportService.test.js
 * ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY - dùng thật "docx" (không mock), đúng khuôn
 * outlineExportService.test.js/lessonPlanExportService.test.js.
 * Chạy: node --test test/khgdExportService.test.js
 */

function makeLessons() {
  return [
    {
      id: "l1",
      tenBai: "Unit 1. Hobbies - Getting started",
      soTiet: 3,
      tuan: "Tuần 1",
      thietBi: "Cassette, CDs, S.mềm",
      diaDiem: "Phòng học 7",
      swd: [
        "Recognise some basic words related to hobbies through pictures and videos.",
        "Participate in simple pair activities with support.",
      ],
      nls: "Học sinh tạo 1 video ngắn giới thiệu sở thích của mình.",
    },
    {
      id: "l2",
      tenBai: "Unit 1. Hobbies - A closer look 1",
      soTiet: 1,
      tuan: "Tuần 1",
      thietBi: "Cassette, CDs, S.mềm",
      diaDiem: "Phòng học 7",
      swd: ["Match words with pictures."],
      nls: "",
    },
  ];
}

function makeKiemTra() {
  return [
    {
      ten: "Giữa Học kỳ 1",
      thoiGian: "60 phút",
      thoiDiem: "Tuần 9, Tiết 26,27",
      yeuCauCanDat: "Kiểm tra kiến thức/kỹ năng Unit 1-3.",
      hinhThuc: "Viết (giấy)",
    },
  ];
}

function makeMeta(overrides = {}) {
  return {
    subject: "Tieng_Anh",
    grade: 7,
    truong: "THCS Phú Túc",
    to: "Tiếng Anh",
    giaoVien: "Đỗ Thị Vân Trinh",
    namHoc: "2026-2027",
    enableSwd: true,
    enableNls: true,
    ...overrides,
  };
}

test("buildKhgdDocument tạo được file Word hợp lệ (không lỗi) với đủ SWD+NLS", async () => {
  const doc = buildKhgdDocument({ lessons: makeLessons(), kiemTraDinhKy: makeKiemTra(), meta: makeMeta() });
  const blob = await Packer.toBlob(doc);
  assert.ok(blob.size > 0, "File .docx phải có nội dung (size > 0)");
});

test("buildKhgdDocument vẫn chạy được khi tắt cả SWD lẫn NLS (không rơi bảng rỗng)", async () => {
  const meta = makeMeta({ enableSwd: false, enableNls: false });
  const lessons = makeLessons().map((l) => ({ ...l, swd: [], nls: "" }));
  const doc = buildKhgdDocument({ lessons, kiemTraDinhKy: makeKiemTra(), meta });
  const blob = await Packer.toBlob(doc);
  assert.ok(blob.size > 0, "File .docx vẫn phải tạo được khi tắt cả 2 công tắc lồng ghép");
});

test("buildKhgdDocument chạy được với danh sách bài học rỗng (chưa nhập gì)", async () => {
  const doc = buildKhgdDocument({ lessons: [], kiemTraDinhKy: [], meta: makeMeta() });
  const blob = await Packer.toBlob(doc);
  assert.ok(blob.size > 0, "File .docx vẫn phải tạo được (chỉ còn dòng tiêu đề) khi chưa có bài học nào");
});
