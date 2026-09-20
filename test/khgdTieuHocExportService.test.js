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

// ==================== PHIÊN 48b - phản hồi test file Word thật (thứ tự cột + lặp tiêu đề) ====================
// Các test dưới đây MỞ XML THẬT của .docx (JSZip) thay vì chỉ kiểm blob.size > 0 - đúng nguyên tắc
// "bug Word chỉ lộ ra khi xem raw XML" đã ghi ở ways-of-working.

async function readDocumentXml(lessons) {
  const JSZip = (await import("jszip")).default;
  const doc = buildKhgdTieuHocDocument({ lessons, meta: makeMeta() });
  const buffer = await Packer.toBuffer(doc);
  const zip = await JSZip.loadAsync(buffer);
  return zip.file("word/document.xml").async("string");
}

/** Lấy văn bản các ô của hàng đầu tiên của bảng đầu tiên (hàng tiêu đề). */
function firstRowCellTexts(xml) {
  const firstTable = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/)[0];
  const firstRow = firstTable.match(/<w:tr[ >][\s\S]*?<\/w:tr>/)[0];
  const cells = firstRow.match(/<w:tc>[\s\S]*?<\/w:tc>/g) || [];
  return cells.map((c) => (c.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, "")).join(""));
}

test("Phiên 48b: cột 'Ghi chú' là cột CUỐI CÙNG của hàng tiêu đề (sau 'Nội dung điều chỉnh')", async () => {
  const xml = await readDocumentXml(makeLessons());
  const headers = firstRowCellTexts(xml);
  assert.deepEqual(headers, [
    "Tuần, tháng",
    "Chủ đề/Mạch nội dung",
    "Tên bài",
    "Tiết học/Thời lượng",
    "Nội dung điều chỉnh cần thiết (nếu có)",
    "Ghi chú",
  ]);
});

test("Phiên 48b: dòng dữ liệu đặt 'Nội dung điều chỉnh' TRƯỚC, số tiết PPCT (Ghi chú) CUỐI CÙNG", async () => {
  const lessons = [
    { id: "x", chuDe: "Em lớn lên từng ngày", tenBai: "Nói và nghe: Những ngày hè của em", tuan: "Tuần 1", soTiet: 1, tietPPCT: 4, dieuChinh: "GD KNS: Biết quý trọng thời gian." },
  ];
  const xml = await readDocumentXml(lessons);
  const firstTable = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/)[0];
  const rows = firstTable.match(/<w:tr[ >][\s\S]*?<\/w:tr>/g);
  assert.equal(rows.length, 2, "1 hàng tiêu đề + 1 hàng dữ liệu");
  const dataCells = rows[1].match(/<w:tc>[\s\S]*?<\/w:tc>/g).map((c) =>
    (c.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, "")).join("")
  );
  assert.equal(dataCells.length, 6);
  assert.equal(dataCells[4], "GD KNS: Biết quý trọng thời gian.", "cột 5 phải là Nội dung điều chỉnh");
  assert.equal(dataCells[5], "4", "cột 6 (cuối) phải là Ghi chú = số tiết PPCT");
});

test("Phiên 48b: KHÔNG đánh dấu hàng tiêu đề lặp lại ở mỗi trang (không có <w:tblHeader/>)", async () => {
  const xml = await readDocumentXml(makeLessons());
  assert.ok(!xml.includes("w:tblHeader"), "bảng Tiểu học không được lặp hàng tiêu đề ở trang sau");
});

test("Phiên 49: độ rộng 6 cột theo đúng thứ tự (Tuần 8 / Chủ đề 13 / Tên bài 33 / Tiết học 10 / Nội dung điều chỉnh 26 / Ghi chú 10 - %)", async () => {
  // Phiên 49: chuyển từ % sang twip cố định (LibreOffice bỏ qua % khi thiếu lưới cột) + nới cột cho chữ 14pt
  // (trước đó Phiên 48b: 6/12/40/8/26/8). Đọc lại độ rộng từng ô hàng tiêu đề, quy về % bề rộng bảng.
  const xml = await readDocumentXml(makeLessons());
  const firstTable = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/)[0];
  const firstRow = firstTable.match(/<w:tr[ >][\s\S]*?<\/w:tr>/)[0];
  const twips = [...firstRow.matchAll(/<w:tcW[^>]*w:w="(\d+)"[^>]*w:type="dxa"|<w:tcW[^>]*w:type="dxa"[^>]*w:w="(\d+)"/g)].map((m) =>
    Number(m[1] ?? m[2])
  );
  assert.equal(twips.length, 6);
  const total = twips.reduce((a, b) => a + b, 0);
  const pct = twips.map((t) => Math.round((t / total) * 100));
  assert.deepEqual(pct, [8, 13, 33, 10, 26, 10]);
  assert.equal(pct.reduce((a, b) => a + b, 0), 100);
});
