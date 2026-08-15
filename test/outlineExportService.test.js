import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import {
  buildOutlineDocxBlob,
  buildParentFriendlyOutlineParagraphs,
} from "../src/services/outlineExportService.js";

/**
 * outlineExportService.test.js
 * ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY - dùng thật "docx", "jszip" (không mock), đúng khuôn
 * lessonPlanExportService.test.js/exportService.docx.test.js.
 *
 * Test cho Bước 2 (Nhóm B) - "Đề cương Ôn tập": xác nhận
 * 1. Bản "Học sinh" (showAnswers=false) KHÔNG lộ đáp án/lời giải, KHÔNG có phụ lục Thư ngỏ.
 * 2. Bản "GV-PH" (showAnswers=true) CÓ đủ đáp án/lời giải + phụ lục Thư ngỏ Phụ huynh ở đầu file.
 * 3. Kiến thức cốt lõi (Trụ cột 1) xuất hiện ở CẢ 2 bản (không phải "đáp án" cần giấu).
 *
 * Chạy: node --test test/outlineExportService.test.js
 */

function makeOutline(overrides = {}) {
  return {
    tenDeCuong: "Đề cương ôn tập Toán - Lớp 5",
    kienThucCotLoi: [
      { tieuMuc: "Phép chia có dư", noiDung: "Số bị chia = Số chia x Thương + Số dư." },
    ],
    dangBai: [
      {
        tenDang: "Dạng 1: Tính giá trị biểu thức",
        luuY: "Thực hiện trong ngoặc trước.",
        baiMauDe: "Tính: (3 + 4) x 2",
        baiMauLoiGiai: "Bước 1: 3 + 4 = 7. Bước 2: 7 x 2 = 14.",
      },
    ],
    nganHangBaiTap: {
      coBan: [{ de: "Tính 5 + 6", dapAn: "11" }],
      nangCao: [{ de: "Tính (5 + 6) x 2", dapAn: "22" }],
      vanDungCao: [],
    },
    thuNgoPhuHuynh: "Kính mong Quý Phụ huynh dành 10 phút mỗi ngày cùng con ôn lại các mức Cơ bản.",
    ...overrides,
  };
}

async function extractDocumentXml(blob) {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.ok(zip.file("word/document.xml"), "thiếu word/document.xml - file .docx không hợp lệ");
  return zip.file("word/document.xml").async("string");
}

test("bản Học sinh (showAnswers=false): có đề bài + kiến thức cốt lõi, KHÔNG có lời giải/đáp án/thư ngỏ", async () => {
  const outline = makeOutline();
  const blob = await buildOutlineDocxBlob({ outline, meta: { subject: "Toan", grade: 5 }, showAnswers: false });
  const xml = await extractDocumentXml(blob);

  assert.ok(xml.includes("Phép chia có dư"), "thiếu Kiến thức cốt lõi ở bản Học sinh");
  assert.ok(xml.includes("Tính: (3 + 4) x 2"), "thiếu đề bài mẫu ở bản Học sinh");
  assert.ok(!xml.includes("Bước 1: 3 + 4 = 7"), "bản Học sinh KHÔNG được lộ lời giải bài mẫu");
  assert.ok(!xml.includes("Đáp án: 11"), "bản Học sinh KHÔNG được lộ đáp án ngân hàng bài tập");
  assert.ok(!xml.includes("THƯ NGỎ"), "bản Học sinh KHÔNG được có phụ lục Thư ngỏ Phụ huynh");
});

test("bản GV-PH (showAnswers=true): đầy đủ lời giải/đáp án + phụ lục Thư ngỏ Phụ huynh", async () => {
  const outline = makeOutline();
  const blob = await buildOutlineDocxBlob({ outline, meta: { subject: "Toan", grade: 5 }, showAnswers: true });
  const xml = await extractDocumentXml(blob);

  assert.ok(xml.includes("Phép chia có dư"), "thiếu Kiến thức cốt lõi ở bản GV-PH");
  assert.ok(xml.includes("Bước 1: 3 + 4 = 7"), "bản GV-PH phải có lời giải bài mẫu");
  assert.ok(xml.includes("Đáp án: 11"), "bản GV-PH phải có đáp án ngân hàng bài tập mức Cơ bản");
  assert.ok(xml.includes("Đáp án: 22"), "bản GV-PH phải có đáp án ngân hàng bài tập mức Nâng cao");
  assert.ok(xml.includes("THƯ NGỎ"), "bản GV-PH phải có phụ lục Thư ngỏ Phụ huynh");
  assert.ok(
    xml.includes("dành 10 phút mỗi ngày"),
    "phụ lục Thư ngỏ Phụ huynh phải chứa đúng nội dung AI đã sinh"
  );
});

test("mức 'Vận dụng cao' rỗng (0 bài) -> không in nhãn mức đó ra Word", async () => {
  const outline = makeOutline();
  const blob = await buildOutlineDocxBlob({ outline, meta: {}, showAnswers: true });
  const xml = await extractDocumentXml(blob);
  assert.ok(!xml.includes("Vận dụng cao"), "không nên in nhãn mức độ khi mảng bài tập rỗng");
});

test("không có 'thuNgoPhuHuynh' -> buildParentFriendlyOutlineParagraphs() trả về mảng rỗng, không throw", () => {
  const paragraphs = buildParentFriendlyOutlineParagraphs("", { chapterLabel: "Chương 1" });
  assert.deepEqual(paragraphs, []);
});

test("file .docx sinh ra hợp lệ (có đủ [Content_Types].xml + word/document.xml)", async () => {
  const outline = makeOutline();
  const blob = await buildOutlineDocxBlob({ outline, meta: { subject: "Toan", grade: 5 }, showAnswers: true });
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.ok(zip.file("[Content_Types].xml"));
  assert.ok(zip.file("word/document.xml"));
});
