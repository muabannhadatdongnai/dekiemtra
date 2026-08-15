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
 * Test cho Bước 3 (Nhóm E) - sửa lỗi + nâng cấp "Đề cương Ôn tập" theo phản hồi thực tế:
 * 1. E1: bản Học sinh PHẢI có lời giải Bài mẫu (trước đây bị ẩn nhầm - lỗi nghiêm trọng nhất).
 * 2. E2: đáp án Ngân hàng bài tập KHÔNG còn in ngay dưới câu hỏi ở bất kỳ bản nào - chỉ xuất hiện
 *    trong "PHỤ LỤC: ĐÁP ÁN NGÂN HÀNG BÀI TẬP" ở bản GV-PH, tách theo từng mức.
 * 3. E3a: "⚠️ Lỗi sai thường gặp" xuất hiện ở CẢ 2 bản.
 * 4. E3b: "Lộ trình Ôn tập" xuất hiện ở CẢ 2 bản.
 * 5. E3c: bảng "Tự đánh giá" CHỈ xuất hiện ở bản Học sinh.
 * 6. Kiến thức cốt lõi (Trụ cột 1) xuất hiện ở CẢ 2 bản (không phải "đáp án" cần giấu).
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
        canhBaoBayLoi: "Nhiều bạn hay quên làm trong ngoặc trước, các con nhớ cẩn thận nhé!",
      },
    ],
    nganHangBaiTap: {
      coBan: [{ de: "Tính 5 + 6", dapAn: "11" }],
      nangCao: [{ de: "Tính (5 + 6) x 2", dapAn: "22" }],
      vanDungCao: [],
    },
    loTrinhOnTap: [
      { ngay: "Ngày 1", nhiemVu: "Đọc lý thuyết Chương 1 + làm 3 bài Mức Cơ bản." },
      { ngay: "Ngày 2", nhiemVu: "Chinh phục bài tập Nâng cao." },
    ],
    thuNgoPhuHuynh: "Kính mong Quý Phụ huynh dành 10 phút mỗi ngày cùng con ôn lại các mức Cơ bản.",
    ...overrides,
  };
}

async function extractDocumentXml(blob) {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.ok(zip.file("word/document.xml"), "thiếu word/document.xml - file .docx không hợp lệ");
  return zip.file("word/document.xml").async("string");
}

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

test("E1 - bản Học sinh (showAnswers=false): CÓ lời giải Bài mẫu + kiến thức cốt lõi, KHÔNG có đáp án/thư ngỏ", async () => {
  const outline = makeOutline();
  const blob = await buildOutlineDocxBlob({ outline, meta: { subject: "Toan", grade: 5 }, showAnswers: false });
  const xml = await extractDocumentXml(blob);

  assert.ok(xml.includes("Phép chia có dư"), "thiếu Kiến thức cốt lõi ở bản Học sinh");
  assert.ok(xml.includes("Tính: (3 + 4) x 2"), "thiếu đề bài mẫu ở bản Học sinh");
  assert.ok(xml.includes("Bước 1: 3 + 4 = 7"), "E1: bản Học sinh PHẢI giữ nguyên lời giải Bài mẫu");
  assert.ok(!xml.includes("Đáp án"), "bản Học sinh KHÔNG được có bất kỳ đáp án nào (kể cả phụ lục)");
  assert.ok(!xml.includes("THƯ NGỎ"), "bản Học sinh KHÔNG được có phụ lục Thư ngỏ Phụ huynh");
});

test("E3a - '⚠️ Lỗi sai thường gặp' xuất hiện ở CẢ 2 bản", async () => {
  const outline = makeOutline();
  const studentBlob = await buildOutlineDocxBlob({ outline, meta: {}, showAnswers: false });
  const teacherBlob = await buildOutlineDocxBlob({ outline, meta: {}, showAnswers: true });
  const studentXml = await extractDocumentXml(studentBlob);
  const teacherXml = await extractDocumentXml(teacherBlob);

  assert.ok(studentXml.includes("Lỗi sai thường gặp"), "thiếu cảnh báo lỗi sai ở bản Học sinh");
  assert.ok(studentXml.includes("quên làm trong ngoặc trước"), "nội dung cảnh báo lỗi sai không đúng ở bản Học sinh");
  assert.ok(teacherXml.includes("Lỗi sai thường gặp"), "thiếu cảnh báo lỗi sai ở bản GV-PH");
});

test("E3b - 'Lộ trình Ôn tập' xuất hiện ở CẢ 2 bản, đúng nội dung từng ngày", async () => {
  const outline = makeOutline();
  const studentBlob = await buildOutlineDocxBlob({ outline, meta: {}, showAnswers: false });
  const teacherBlob = await buildOutlineDocxBlob({ outline, meta: {}, showAnswers: true });
  const studentXml = await extractDocumentXml(studentBlob);
  const teacherXml = await extractDocumentXml(teacherBlob);

  assert.ok(studentXml.includes("LỘ TRÌNH ÔN TẬP"), "thiếu Lộ trình Ôn tập ở bản Học sinh");
  assert.ok(studentXml.includes("Đọc lý thuyết Chương 1"), "thiếu nội dung Ngày 1 ở bản Học sinh");
  assert.ok(studentXml.includes("Chinh phục bài tập Nâng cao"), "thiếu nội dung Ngày 2 ở bản Học sinh");
  assert.ok(teacherXml.includes("LỘ TRÌNH ÔN TẬP"), "thiếu Lộ trình Ôn tập ở bản GV-PH");
});

test("E3c - bảng 'Tự đánh giá' CHỈ xuất hiện ở bản Học sinh", async () => {
  const outline = makeOutline();
  const studentBlob = await buildOutlineDocxBlob({ outline, meta: {}, showAnswers: false });
  const teacherBlob = await buildOutlineDocxBlob({ outline, meta: {}, showAnswers: true });
  const studentXml = await extractDocumentXml(studentBlob);
  const teacherXml = await extractDocumentXml(teacherBlob);

  assert.ok(studentXml.includes("TỰ ĐÁNH GIÁ"), "thiếu bảng Tự đánh giá ở bản Học sinh");
  assert.ok(studentXml.includes("Rất hiểu"), "thiếu nội dung mức tự đánh giá ở bản Học sinh");
  assert.ok(!teacherXml.includes("TỰ ĐÁNH GIÁ"), "bản GV-PH KHÔNG được có bảng Tự đánh giá");
});

test("E2 - bản GV-PH (showAnswers=true): đáp án CHỈ xuất hiện trong Phụ lục cuối tài liệu, tách theo từng mức", async () => {
  const outline = makeOutline();
  const blob = await buildOutlineDocxBlob({ outline, meta: { subject: "Toan", grade: 5 }, showAnswers: true });
  const xml = await extractDocumentXml(blob);

  assert.ok(xml.includes("Bước 1: 3 + 4 = 7"), "bản GV-PH phải có lời giải bài mẫu");
  assert.ok(xml.includes("PHỤ LỤC: ĐÁP ÁN NGÂN HÀNG BÀI TẬP"), "thiếu tiêu đề Phụ lục đáp án");
  assert.ok(xml.includes("THƯ NGỎ"), "bản GV-PH phải có phụ lục Thư ngỏ Phụ huynh");
  assert.ok(
    xml.includes("dành 10 phút mỗi ngày"),
    "phụ lục Thư ngỏ Phụ huynh phải chứa đúng nội dung AI đã sinh"
  );

  // Đáp án "11" và "22" mỗi cái CHỈ xuất hiện đúng 1 lần (trong Phụ lục) - không còn lặp lại ngay
  // dưới câu hỏi ở mục III nữa (khác hành vi CŨ trước Bước 3).
  assert.equal(countOccurrences(xml, ">11<"), 1, "đáp án '11' chỉ được xuất hiện 1 lần (trong Phụ lục)");
  assert.equal(countOccurrences(xml, ">22<"), 1, "đáp án '22' chỉ được xuất hiện 1 lần (trong Phụ lục)");

  // Mục III (Ngân hàng bài tập) vẫn phải chừa dòng trống "Bài làm" giống bản Học sinh.
  assert.ok(xml.includes("Bài làm:"), "mục III bản GV-PH vẫn phải chừa dòng trống 'Bài làm' giống bản Học sinh");
});

test("mức 'Vận dụng cao' rỗng (0 bài) -> không in nhãn mức đó ở mục III lẫn Phụ lục đáp án", async () => {
  const outline = makeOutline();
  const blob = await buildOutlineDocxBlob({ outline, meta: {}, showAnswers: true });
  const xml = await extractDocumentXml(blob);
  assert.ok(!xml.includes("Vận dụng cao"), "không nên in nhãn mức độ khi mảng bài tập rỗng");
});

test("không có 'thuNgoPhuHuynh' -> buildParentFriendlyOutlineParagraphs() trả về mảng rỗng, không throw", () => {
  const paragraphs = buildParentFriendlyOutlineParagraphs("", { chapterLabel: "Chương 1" });
  assert.deepEqual(paragraphs, []);
});

test("không có 'nganHangBaiTap' nào có bài -> Phụ lục đáp án trả về rỗng, không throw", async () => {
  const outline = makeOutline({ nganHangBaiTap: { coBan: [], nangCao: [], vanDungCao: [] } });
  const blob = await buildOutlineDocxBlob({ outline, meta: {}, showAnswers: true });
  const xml = await extractDocumentXml(blob);
  assert.ok(!xml.includes("PHỤ LỤC: ĐÁP ÁN"), "không nên in tiêu đề Phụ lục đáp án khi không có bài tập nào");
});

test("file .docx sinh ra hợp lệ (có đủ [Content_Types].xml + word/document.xml)", async () => {
  const outline = makeOutline();
  const blob = await buildOutlineDocxBlob({ outline, meta: { subject: "Toan", grade: 5 }, showAnswers: true });
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.ok(zip.file("[Content_Types].xml"));
  assert.ok(zip.file("word/document.xml"));
});
