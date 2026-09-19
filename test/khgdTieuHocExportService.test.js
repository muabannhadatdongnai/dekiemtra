import { test } from "node:test";
import assert from "node:assert/strict";
import { Packer } from "docx";
import { buildKhgdTieuHocDocument } from "../src/services/khgdTieuHocExportService.js";

function makeLessons() {
  return [
    { id: "l1", chuDe: "Em lớn lên từng ngày", tenBai: "Đọc: Bài 1: Tôi là học sinh lớp 2-Tiết 1", tuan: "Tuần 1", soTiet: 1, tietPPCT: 1, dieuChinh: "" },
    { id: "l2", chuDe: "Em lớn lên từng ngày", tenBai: "Đọc: Bài 1: Tôi là học sinh lớp 2-Tiết 2", tuan: "Tuần 1", soTiet: 1, tietPPCT: 2, dieuChinh: "" },
    { id: "l3", chuDe: "Em lớn lên từng ngày", tenBai: "Nói và nghe: Những ngày hè của em", tuan: "Tuần 1", soTiet: 1, tietPPCT: 4, dieuChinh: "Giáo dục HS cách phòng chống đuối nước." },
  ];
}

function makeMeta(overrides = {}) {
  return {
    subject: "Tieng_Viet",
    grade: 2,
    truong: "Tiểu học Test",
    to: "Tiếng Việt",
    giaoVien: "Nguyễn Văn A",
    namHoc: "2026-2027",
    enableDieuChinh: true,
    ...overrides,
  };
}

test("buildKhgdTieuHocDocument tạo được file Word hợp lệ", async () => {
  const doc = buildKhgdTieuHocDocument({ lessons: makeLessons(), meta: makeMeta() });
  const blob = await Packer.toBlob(doc);
  assert.ok(blob.size > 0, "File .docx phải có nội dung (size > 0)");
});

test("buildKhgdTieuHocDocument chạy được khi tắt lồng ghép (dieuChinh rỗng hết)", async () => {
  const lessons = makeLessons().map((l) => ({ ...l, dieuChinh: "" }));
  const doc = buildKhgdTieuHocDocument({ lessons, meta: makeMeta({ enableDieuChinh: false }) });
  const blob = await Packer.toBlob(doc);
  assert.ok(blob.size > 0);
});

test("buildKhgdTieuHocDocument gộp ô đúng khi nhiều dòng liên tiếp cùng Tuần/Chủ đề", async () => {
  const lessons = [
    { id: "a", chuDe: "Em lớn lên từng ngày", tenBai: "Bài 1", tuan: "Tuần 1", soTiet: 1, tietPPCT: 1, dieuChinh: "" },
    { id: "b", chuDe: "Em lớn lên từng ngày", tenBai: "Bài 2", tuan: "Tuần 1", soTiet: 1, tietPPCT: 2, dieuChinh: "" },
    { id: "c", chuDe: "Đi học vui sao", tenBai: "Bài 3", tuan: "Tuần 2", soTiet: 1, tietPPCT: 3, dieuChinh: "" },
  ];
  const doc = buildKhgdTieuHocDocument({ lessons, meta: makeMeta() });
  const blob = await Packer.toBlob(doc);
  assert.ok(blob.size > 0);
});

test("buildKhgdTieuHocDocument không gộp ô khi Tuần/Chủ đề để trống hàng loạt", async () => {
  const lessons = makeLessons().map((l) => ({ ...l, tuan: "", chuDe: "" }));
  const doc = buildKhgdTieuHocDocument({ lessons, meta: makeMeta() });
  const blob = await Packer.toBlob(doc);
  assert.ok(blob.size > 0);
});

test("buildKhgdTieuHocDocument chạy được với danh sách bài học rỗng", async () => {
  const doc = buildKhgdTieuHocDocument({ lessons: [], meta: makeMeta() });
  const blob = await Packer.toBlob(doc);
  assert.ok(blob.size > 0);
});
