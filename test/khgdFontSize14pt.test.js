import { test } from "node:test";
import assert from "node:assert/strict";
import { Packer } from "docx";
import JSZip from "jszip";
import { buildKhgdDocument } from "../src/services/khgdExportService.js";
import { buildKhgdTieuHocDocument } from "../src/services/khgdTieuHocExportService.js";
import { assertValidParagraphNesting } from "./wordSchemaAssertions.js";

/**
 * khgdFontSize14pt.test.js  (Phiên 49)
 * Hoan chốt: CẢ 2 tab Khung KHGD (THCS/THPT + Tiểu học) dùng chữ 14pt theo quy định của Bộ GD&ĐT.
 * `w:sz` của Word tính bằng NỬA-POINT → 14pt = 28. Test soi thẳng XML trong file .docx thật: MỌI run
 * (tiêu đề, bảng, chữ ký) phải là 28, không sót cỡ nhỏ nào (10pt/11pt/12pt/13pt cũ), và cỡ chữ mặc
 * định của tài liệu (docDefaults) cũng 28 để đoạn/ô rỗng không rơi về cỡ mặc định của Word.
 */

const meta = { subject: "Tieng_Anh", grade: 7, truong: "THCS Phú Túc", to: "Tiếng Anh", giaoVien: "Đỗ Thị Vân Trinh", namHoc: "2026-2027", enableSwd: true, enableNls: true };

async function readXml(doc, part) {
  const zip = await JSZip.loadAsync(await Packer.toBuffer(doc));
  return zip.file(part).async("string");
}

function runSizes(xml) {
  return [...xml.matchAll(/<w:sz w:val="(\d+)"\s*\/>/g)].map((m) => Number(m[1]));
}

test("THCS/THPT: MỌI run trong file Word là 14pt (w:sz=28) - tiêu đề, bảng bài học, bảng kiểm tra, chữ ký", async () => {
  const lessons = [
    { id: "l1", tenBai: "Unit 1. Hobbies - Getting started", soTiet: 2, tuan: "Tuần 1", thietBi: "Máy chiếu", diaDiem: "Phòng học", swd: ["Recognise the word 'dollhouse' with support."], nls: "Tạo áp phích số." },
    { id: "l2", tenBai: "Unit 1. Hobbies - A closer look 1", soTiet: 1, tuan: "Tuần 2", thietBi: "", diaDiem: "", swd: [], nls: "" },
  ];
  const kiemTra = [{ ten: "Giữa Học kỳ 1", thoiGian: "60 phút", thoiDiem: "Tuần 9", yeuCauCanDat: "Unit 1-3", hinhThuc: "Viết (giấy)" }];
  const doc = buildKhgdDocument({ lessons, kiemTraDinhKy: kiemTra, meta });

  const xml = await readXml(doc, "word/document.xml");
  assertValidParagraphNesting(xml);
  const sizes = runSizes(xml);
  assert.ok(sizes.length > 30, `phải có nhiều run để test có ý nghĩa (có ${sizes.length})`);
  assert.deepEqual([...new Set(sizes)], [28], `còn cỡ chữ khác 14pt: ${[...new Set(sizes)].join(", ")}`);

  const styles = await readXml(doc, "word/styles.xml");
  assert.match(styles, /<w:rPrDefault>[\s\S]*?<w:sz w:val="28"\s*\/>/, "cỡ chữ mặc định toàn tài liệu phải là 14pt");
});

test("Tiểu học: MỌI run trong file Word là 14pt (w:sz=28) kể cả khi có gộp ô Tuần/Chủ đề/Tiết", async () => {
  const lessons = [
    { id: "a", chuDe: "Em lớn lên từng ngày", tenBai: "Đọc: Bài 1: Tôi là học sinh lớp 2 - Tiết 1", tuan: "Tuần 1", soTiet: 1, nhomTiet: "b1-1", tietPPCT: 1, dieuChinh: "GD KNS: Biết giới thiệu bản thân." },
    { id: "b", chuDe: "Em lớn lên từng ngày", tenBai: "Đọc: Bài 1: Tôi là học sinh lớp 2 - Tiết 2", tuan: "Tuần 1", soTiet: 1, nhomTiet: "b1-1", tietPPCT: 2, dieuChinh: "" },
    { id: "c", chuDe: "Đi học vui sao", tenBai: "Nói và nghe: Những ngày hè của em", tuan: "Tuần 12", soTiet: 1, nhomTiet: "", tietPPCT: 350, dieuChinh: "" },
  ];
  const doc = buildKhgdTieuHocDocument({ lessons, meta: { ...meta, subject: "Tieng_Viet", grade: 2 } });

  const xml = await readXml(doc, "word/document.xml");
  assertValidParagraphNesting(xml);
  assert.match(xml, /w:rowSpan|w:vMerge/, "kịch bản phải có gộp ô để test có ý nghĩa");
  const sizes = runSizes(xml);
  assert.ok(sizes.length > 20, `phải có nhiều run (có ${sizes.length})`);
  assert.deepEqual([...new Set(sizes)], [28], `còn cỡ chữ khác 14pt: ${[...new Set(sizes)].join(", ")}`);

  const styles = await readXml(doc, "word/styles.xml");
  assert.match(styles, /<w:rPrDefault>[\s\S]*?<w:sz w:val="28"\s*\/>/);
});

test("Bảng có LƯỚI CỘT cố định (layout fixed + tblGrid) - LibreOffice bỏ qua % ô nên thiếu lưới sẽ chia đều mọi cột", async () => {
  const TABLE_TWIP = Math.round(((297 - 15 - 15) / 25.4) * 1440); // 267mm khổ A4 ngang trừ lề 2 bên
  const gridOf = (xml) => {
    const tbl = xml.match(/<w:tbl>[\s\S]*?<\/w:tblGrid>/)[0];
    assert.match(tbl, /<w:tblLayout w:type="fixed"\s*\/>/, "bảng phải dùng layout fixed");
    return [...tbl.matchAll(/<w:gridCol w:w="(\d+)"\s*\/>/g)].map((m) => Number(m[1]));
  };

  for (const [enableSwd, enableNls] of [[true, true], [true, false], [false, true], [false, false]]) {
    const doc = buildKhgdDocument({
      lessons: [{ id: "x", tenBai: "B", soTiet: 1, tuan: "T1", thietBi: "", diaDiem: "", swd: ["a"], nls: "b" }],
      kiemTraDinhKy: [],
      meta: { ...meta, enableSwd, enableNls },
    });
    const grid = gridOf(await readXml(doc, "word/document.xml"));
    const expectedCols = 6 + (enableSwd ? 1 : 0) + (enableNls ? 1 : 0);
    assert.equal(grid.length, expectedCols, `SWD=${enableSwd} NLS=${enableNls}: ${grid.length} cột`);
    const total = grid.reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(total - TABLE_TWIP) <= 12, `tổng lưới ${total} lệch khỏi bề rộng trang ${TABLE_TWIP}`);
    assert.ok(grid[0] / TABLE_TWIP >= 0.05, "cột STT phải >= 5% để số 2 chữ số (VD 12) cỡ 14pt không rớt dòng");
    if (enableSwd && enableNls) assert.ok(grid[6] > grid[0] * 4, "cột SWD phải rộng hơn hẳn cột STT (không bị chia đều)");
  }

  const tieuHoc = buildKhgdTieuHocDocument({
    lessons: [{ id: "x", chuDe: "C", tenBai: "B", tuan: "Tuần 12", soTiet: 1, nhomTiet: "", tietPPCT: 350, dieuChinh: "" }],
    meta: { ...meta, subject: "Tieng_Viet", grade: 2 },
  });
  const grid = gridOf(await readXml(tieuHoc, "word/document.xml"));
  assert.equal(grid.length, 6);
  assert.ok(Math.abs(grid.reduce((a, b) => a + b, 0) - TABLE_TWIP) <= 12);
  assert.ok(grid[2] > grid[0] * 3, "cột Tên bài phải rộng hơn hẳn cột Tuần (không bị chia đều)");
});
