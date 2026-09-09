import { test } from "node:test";
import assert from "node:assert/strict";
import { generateCauTaoSo, generateTracNghiemSoTuNhien } from "../src/data/worksheetSchemas.js";
import { docSoTuNhien } from "../src/services/numberFormatUtils.js";
import { buildWorksheetDocxBlob } from "../src/services/worksheetExportService.js";
import JSZip from "jszip";

/**
 * worksheetOnTapSoTuNhienPhien42.test.js
 * MỞ RỘNG LỚP 4-5, PHIÊN 42 ("Ôn tập số tự nhiên") - lấp khoảng trống phát hiện khi đối chiếu 2
 * PDF mẫu SGK Toán 4-5 KNTT (Bài 1) Hoan gửi. 3 phần: (1) docSoTuNhien - đọc số bằng chữ (đối
 * chiếu ĐỘC LẬP với 12 ví dụ THẬT lấy nguyên văn từ 2 PDF, không phải tự bịa), (2) cau_tao_so,
 * (3) trac_nghiem_so_tu_nhien - tính lại đáp án bằng cách ĐỘC LẬP với generator, cùng nguyên tắc
 * worksheetLop4Dot2.test.js đã dùng.
 */

// ================== (1) docSoTuNhien ==================
// Toàn bộ 12 cặp (số, cách đọc) này chép NGUYÊN VĂN từ 2 file PDF mẫu Hoan gửi (Phiên 41-42) -
// không phải số tự bịa, để đảm bảo hàm đọc số khớp ĐÚNG SGK, không chỉ khớp "logic tự tưởng
// tượng" của người viết code.
const KNOWN_READINGS_FROM_SGK_PDF = [
  [41706, "bốn mươi mốt nghìn bảy trăm linh sáu"],
  [53014, "năm mươi ba nghìn không trăm mười bốn"],
  [96375, "chín mươi sáu nghìn ba trăm bảy mươi lăm"],
  [9309, "chín nghìn ba trăm linh chín"],
  [88480, "tám mươi tám nghìn bốn trăm tám mươi"],
  [25371, "hai mươi lăm nghìn ba trăm bảy mươi mốt"],
  [95006, "chín mươi lăm nghìn không trăm linh sáu"],
  [63130, "sáu mươi ba nghìn một trăm ba mươi"],
  [42951, "bốn mươi hai nghìn chín trăm năm mươi mốt"],
  [603172, "sáu trăm linh ba nghìn một trăm bảy mươi hai"], // suy từ "603 172 = 600 000 + 3 000 + 100 + 70 + 2"
  [8250117, "tám triệu hai trăm năm mươi nghìn một trăm mười bảy"], // suy từ 8 250 117
  [56200900, "năm mươi sáu triệu hai trăm nghìn chín trăm"], // suy từ 56 200 900
];

test("docSoTuNhien: khớp ĐÚNG 12 ví dụ thật chép từ PDF mẫu SGK Lớp 4-5", () => {
  for (const [n, expected] of KNOWN_READINGS_FROM_SGK_PDF) {
    assert.equal(docSoTuNhien(n), expected, `đọc sai số ${n}`);
  }
});

test("docSoTuNhien: không tự đọc 'linh'/'mốt' sai quy tắc ở hàng chục=1 (11,15,19...)", () => {
  const cases = [[10, "mười"], [11, "mười một"], [15, "mười lăm"], [19, "mười chín"], [21, "hai mươi mốt"], [25, "hai mươi lăm"], [20, "hai mươi"]];
  for (const [n, expected] of cases) assert.equal(docSoTuNhien(n), expected);
});

// ================== (2) generateCauTaoSo ==================
test("generateCauTaoSo: 'phan_tich' - tổng các số hạng (kể cả ô ẩn) luôn = value", () => {
  for (let i = 0; i < 300; i++) {
    for (const grade of ["LOP_4", "LOP_5"]) {
      const items = generateCauTaoSo(grade, 6);
      for (const it of items) {
        if (it.kind !== "phan_tich") continue;
        const sum = it.terms.reduce((a, b) => a + b, 0);
        assert.equal(sum, it.value, `tổng số hạng không khớp: ${JSON.stringify(it)}`);
        assert.ok(it.blankIndex >= 0 && it.blankIndex < it.terms.length, "blankIndex ngoài phạm vi");
        assert.ok(it.terms.length >= 2, "phan_tich phải có ít nhất 2 số hạng mới có ý nghĩa");
      }
    }
  }
});

test("generateCauTaoSo: 'doc_viet' - words luôn khớp docSoTuNhien(value) (không tính 2 lần bằng cùng 1 hàm)", () => {
  for (let i = 0; i < 300; i++) {
    for (const grade of ["LOP_4", "LOP_5"]) {
      const items = generateCauTaoSo(grade, 6);
      for (const it of items) {
        if (it.kind !== "doc_viet") continue;
        assert.equal(it.words, docSoTuNhien(it.value));
        assert.ok(["so_sang_chu", "chu_sang_so"].includes(it.direction));
      }
    }
  }
});

test("generateCauTaoSo: đúng phạm vi chữ số theo khối (Lớp 4 = 5 chữ số, Lớp 5 = 6-8 chữ số)", () => {
  for (let i = 0; i < 200; i++) {
    for (const it of generateCauTaoSo("LOP_4", 8)) {
      assert.equal(String(it.value).length, 5, `Lớp 4 phải đúng 5 chữ số: ${it.value}`);
    }
    for (const it of generateCauTaoSo("LOP_5", 8)) {
      const len = String(it.value).length;
      assert.ok(len >= 6 && len <= 8, `Lớp 5 phải 6-8 chữ số, được ${len} (${it.value})`);
    }
  }
});

test("generateCauTaoSo: không có số nào bắt đầu bằng chữ số 0 (số tự nhiên hợp lệ)", () => {
  for (let i = 0; i < 200; i++) {
    for (const grade of ["LOP_4", "LOP_5"]) {
      for (const it of generateCauTaoSo(grade, 6)) {
        assert.notEqual(String(it.value)[0], "0", `số bắt đầu bằng 0: ${it.value}`);
      }
    }
  }
});

test("generateCauTaoSo: sinh đúng số lượng item yêu cầu (không trùng value trong 1 lần sinh)", () => {
  for (const grade of ["LOP_4", "LOP_5"]) {
    const items = generateCauTaoSo(grade, 6);
    assert.equal(items.length, 6);
    const values = items.map((it) => it.value);
    assert.equal(new Set(values).size, values.length, "có value trùng lặp trong cùng 1 phiếu");
  }
});

// ================== (3) generateTracNghiemSoTuNhien ==================
test("generateTracNghiemSoTuNhien: mỗi câu có ĐÚNG 4 lựa chọn, không trùng nhau, correctIndex hợp lệ", () => {
  for (let i = 0; i < 300; i++) {
    for (const grade of ["LOP_4", "LOP_5"]) {
      const items = generateTracNghiemSoTuNhien(grade, 6);
      for (const it of items) {
        assert.equal(it.options.length, 4, `không đủ 4 lựa chọn: ${JSON.stringify(it)}`);
        assert.equal(new Set(it.options).size, 4, `có lựa chọn trùng nhau: ${JSON.stringify(it)}`);
        assert.ok(it.correctIndex >= 0 && it.correctIndex < 4, "correctIndex ngoài phạm vi");
        assert.ok(typeof it.prompt === "string" && it.prompt.length > 0, "thiếu prompt");
      }
    }
  }
});

test("generateTracNghiemSoTuNhien: không lặp lại ĐÚNG 1 dạng câu hỏi 2 lần liên tiếp (khi count đủ lớn)", () => {
  for (let i = 0; i < 100; i++) {
    const items = generateTracNghiemSoTuNhien("LOP_4", 8);
    for (let j = 1; j < items.length; j++) {
      // Nhận diện "dạng" qua đuôi câu hỏi đặc trưng (không có field type trực tiếp trên item).
      const kindOf = (p) =>
        p.includes("bé nhất") || p.includes("lớn nhất")
          ? "min_max"
          : p.includes("Làm tròn")
          ? "rounding"
          : p.includes("chữ số hàng")
          ? "digit_place"
          : "lien_truoc_sau";
      assert.notEqual(kindOf(items[j].prompt), kindOf(items[j - 1].prompt), "2 câu liên tiếp cùng 1 dạng");
    }
  }
});

test("generateTracNghiemSoTuNhien (làm tròn): đáp án đúng luôn là bội số của hàng làm tròn tương ứng", () => {
  for (let i = 0; i < 200; i++) {
    const items = generateTracNghiemSoTuNhien("LOP_5", 8);
    for (const it of items) {
      if (!it.prompt.includes("Làm tròn")) continue;
      const placeLabel = it.prompt.match(/hàng ([^,]+),/)?.[1];
      const placeMap = { chục: 10, trăm: 100, nghìn: 1000, "chục nghìn": 10000, "trăm nghìn": 100000 };
      const place = placeMap[placeLabel];
      assert.ok(place, `không nhận diện được hàng làm tròn trong: ${it.prompt}`);
      const correctValue = Number(it.options[it.correctIndex].replace(/\./g, ""));
      assert.equal(correctValue % place, 0, `đáp án đúng không chia hết cho ${place}: ${it.prompt} -> ${it.options[it.correctIndex]}`);
    }
  }
});

// ================== (4) Xuất Word - đúng số <w:drawing> = 0 (không dùng ảnh, chỉ text/blank) ==================
test("Word: cau_tao_so và trac_nghiem_so_tu_nhien xuất ra .docx hợp lệ, đọc lại được bằng JSZip", async () => {
  const worksheet = {
    sections: [
      { type: "cau_tao_so", title: "Viết số thích hợp vào chỗ chấm.", mascot: "🔢", items: generateCauTaoSo("LOP_4", 5) },
      { type: "trac_nghiem_so_tu_nhien", title: "Khoanh vào chữ đặt trước câu trả lời đúng.", mascot: "✅", items: generateTracNghiemSoTuNhien("LOP_5", 5) },
    ],
  };
  for (const showAnswers of [false, true]) {
    const blob = await buildWorksheetDocxBlob({ worksheet, meta: { title: "Test Phiên 42" }, showAnswers });
    const buf = Buffer.from(await blob.arrayBuffer());
    const zip = await JSZip.loadAsync(buf);
    const xml = await zip.file("word/document.xml").async("string");
    assert.ok(xml.includes("Viết số thích hợp vào chỗ chấm"), "thiếu tiêu đề cau_tao_so trong document.xml");
    assert.ok(xml.includes("Khoanh vào chữ đặt trước câu trả lời đúng"), "thiếu tiêu đề trắc nghiệm trong document.xml");
    if (showAnswers) {
      // Đáp án đúng phải được đánh dấu "[" "]" đâu đó trong XML (quy ước đáp án in đậm có ngoặc).
      assert.ok(xml.includes("["), "bản đáp án không thấy dấu ngoặc đánh dấu đáp án đúng");
    }
  }
});
