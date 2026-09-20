import { test } from "node:test";
import assert from "node:assert/strict";

/**
 * khgdTieuHocOutlineSubjects.test.js  (Phiên 48b)
 * Gợi ý Khung KHGD Tiểu học cho Toán / Tiếng Anh / Đạo đức / Tự nhiên và Xã hội - dữ liệu MÔ PHỎNG
 * cấu trúc (giữ nguyên các dòng tiêu đề thật, lược nội dung SGK) của 4 file Markdown thật Lớp 2 mà
 * Hoan gửi ở Phiên 48b. Mỗi môn 1 định dạng khác nhau - đây là lý do bộ đọc viết riêng theo môn.
 */

const MD_TOAN = `# Chủ đề 1: ÔN TẬP VÀ BỔ SUNG

## Bài 1: ÔN TẬP CÁC SỐ ĐẾN 100

### Luyện tập

**1. Hoàn thành bảng sau (theo mẫu).**

| Chục | Đơn vị | Viết số | Đọc số |
|---|---|---|---|
| 3 | 4 | 34 | ba mươi tư |

### Luyện tập

**1. Số?**
* $35 = 30 + 5$

## Bài 2: TIA SỐ. SỐ LIỀN TRƯỚC, SỐ LIỀN SAU

### Khám phá

**a) Đây là tia số.**

### Hoạt động

**1. Số?**

## Bài 3: CÁC THÀNH PHẦN CỦA PHÉP CỘNG, PHÉP TRỪ

### Khám phá

## Bài 4: HƠN, KÉM NHAU BAO NHIÊU

## Bài 5: ÔN TẬP PHÉP CỘNG, PHÉP TRỪ (không nhớ) TRONG PHẠM VI 100

## Bài 6: LUYỆN TẬP CHUNG

### Trò chơi

**ĐƯA ONG VỀ TỔ**
`;

const MD_ANH = `# Unit 1: At My Birthday Party (Chủ đề 1: Tại bữa tiệc sinh nhật của tớ)

## 1. Thông tin chung (Overview)
* **Chủ đề:** At my birthday party [4, 6]
* **Từ vựng (Vocabulary):**
  * **pasta** (mì ống, mì sợi) [4, 6]

---

## 2. Chi tiết các bài học (Lessons)

### Lesson 1
* **Hoạt động 1: Listen and repeat (Nghe và nhắc lại) - Track 2** [6]
* **Hoạt động 2: Point and say (Chỉ và nói)** [6]

### Lesson 2
* **Hoạt động 3: Listen and chant (Nghe và đọc theo nhịp) - Track 3** [7]

### Lesson 3
* **Hoạt động 6: Listen and repeat (Nghe và nhắc lại) - Track 5** [8]
`;

const MD_DAODUC = `# CHỦ ĐỀ 1: QUÊ HƯƠNG EM

## BÀI 1: VẺ ĐẸP QUÊ HƯƠNG EM (Trang 5)

### I. MỤC TIÊU
* Nêu được địa chỉ quê hương.

### II. KHỞI ĐỘNG
* Em cùng các bạn nghe/hát bài **"Quê hương tươi đẹp"**.

---
---

## BÀI 2: EM YÊU QUÊ HƯƠNG (Trang 9)

### I. MỤC TIÊU
* Thực hiện được việc làm thiết thực. [9]
`;

const MD_TNXH = `# CHỦ ĐỀ 1: GIA ĐÌNH
*(Trích xuất chi tiết từ Sách giáo khoa Tự nhiên và Xã hội lớp 2 - Bộ sách Kết nối tri thức với cuộc sống)*

---

## BÀI 1: CÁC THẾ HỆ TRONG GIA ĐÌNH (Trang 6 - 9)

### 1. Hoạt động mở đầu (Trang 6)

## BÀI 2: NGHỀ NGHIỆP CỦA NGƯỜI LỚN TRONG GIA ĐÌNH (Trang 10 - 13)

## BÀI 3: PHÒNG TRÁNH NGỘ ĐỘC KHI Ở NHÀ (Trang 14 - 17)

## BÀI 4: GIỮ SẠCH NHÀ Ở (Trang 18 - 21)

## BÀI 5: ÔN TẬP CHỦ ĐỀ GIA ĐÌNH (Trang 22 - 23)

---
### BẢNG TỰ ĐÁNH GIÁ CHỦ ĐỀ 1
- [x] Làm được một số việc.
`;

async function outline(subject, markdown, lessonIndex) {
  const { buildKhgdTieuHocOutline } = await import("../src/services/khgdTieuHocOutlineService.js");
  return buildKhgdTieuHocOutline({ subject, markdown, lessonIndex });
}

// ------------------------------------------------------------------ Chủ đề: cả 4 tiêu đề H1 thật

test("Chủ đề lấy đúng từ tiêu đề H1 của cả 4 môn (kể cả 'Chủ đề' viết thường và 'Unit n: ... (Chủ đề n: ...)')", async () => {
  assert.equal((await outline("Toan", MD_TOAN)).chuDe, "Ôn tập và bổ sung");
  assert.equal((await outline("Tieng_Anh", MD_ANH)).chuDe, "Unit 1: At My Birthday Party");
  assert.equal((await outline("Dao_Duc", MD_DAODUC)).chuDe, "Quê hương em");
  assert.equal((await outline("Tu_Nhien_Xa_Hoi", MD_TNXH)).chuDe, "Gia đình");
});

// ------------------------------------------------------------------ Toán

test("Toán: 6 Bài → 6 dòng; tên IN HOA về dạng câu; ngoặc đơn giữ nguyên; mặc định 1 tiết/bài", async () => {
  const r = await outline("Toan", MD_TOAN);
  assert.equal(r.source, "markdown");
  assert.deepEqual(r.rows.map((x) => x.tenBai), [
    "Bài 1: Ôn tập các số đến 100",
    "Bài 2: Tia số. Số liền trước, số liền sau",
    "Bài 3: Các thành phần của phép cộng, phép trừ",
    "Bài 4: Hơn, kém nhau bao nhiêu",
    "Bài 5: Ôn tập phép cộng, phép trừ (không nhớ) trong phạm vi 100",
    "Bài 6: Luyện tập chung",
  ]);
  assert.ok(r.rows.every((x) => x.soTiet === 1 && x.nhomTiet === ""));
});

test("Toán: tiêu đề mục con (### Luyện tập/Khám phá/Hoạt động/Trò chơi) KHÔNG bị nhầm thành Bài", async () => {
  const r = await outline("Toan", MD_TOAN);
  assert.equal(r.rows.length, 6);
});

// ------------------------------------------------------------------ Đạo đức & TNXH

test("Đạo đức: bỏ '(Trang n)', bỏ mục I./II. bên trong Bài; không nhầm '---' hay mục MỤC TIÊU/KHỞI ĐỘNG thành dòng", async () => {
  const r = await outline("Dao_Duc", MD_DAODUC);
  assert.deepEqual(r.rows.map((x) => x.tenBai), ["Bài 1: Vẻ đẹp quê hương em", "Bài 2: Em yêu quê hương"]);
});

test("Tự nhiên và Xã hội: bỏ '(Trang 6 - 9)'; phần 'BẢNG TỰ ĐÁNH GIÁ' cuối chủ đề không thành dòng", async () => {
  const r = await outline("Tu_Nhien_Xa_Hoi", MD_TNXH);
  assert.deepEqual(r.rows.map((x) => x.tenBai), [
    "Bài 1: Các thế hệ trong gia đình",
    "Bài 2: Nghề nghiệp của người lớn trong gia đình",
    "Bài 3: Phòng tránh ngộ độc khi ở nhà",
    "Bài 4: Giữ sạch nhà ở",
    "Bài 5: Ôn tập chủ đề gia đình",
  ]);
});

test("Mức Bài: ghi '(N tiết)' vào tiêu đề Bài trong Markdown thì bộ đọc dùng số đó thay cho mặc định 1", async () => {
  const md = "# CHỦ ĐỀ 1: THỬ\n\n## Bài 1: ÔN TẬP CÁC SỐ ĐẾN 100 (3 tiết)\n\n## Bài 2: TIA SỐ (Trang 9) (2 tiết)\n\n## Bài 3: KHÔNG GHI TIẾT\n";
  const r = await outline("Toan", md);
  assert.deepEqual(r.rows.map((x) => [x.tenBai, x.soTiet]), [
    ["Bài 1: Ôn tập các số đến 100", 3],
    ["Bài 2: Tia số", 2],
    ["Bài 3: Không ghi tiết", 1],
  ]);
});

test("Mức Bài: tên trong chuong_{n}_bai.json (lessonIndex) được ưu tiên hơn tên bóc từ Markdown", async () => {
  const r = await outline("Dao_Duc", MD_DAODUC, [{ soBai: 2, tenBai: "Em yêu quê hương (tên chuẩn)" }]);
  assert.equal(r.rows[0].tenBai, "Bài 1: Vẻ đẹp quê hương em");
  assert.equal(r.rows[1].tenBai, "Bài 2: Em yêu quê hương (tên chuẩn)");
});

// ------------------------------------------------------------------ Tiếng Anh

test("Tiếng Anh: mỗi 'Lesson k' 1 dòng dạng 'Unit 1: ... - Lesson k', mặc định 1 tiết; mục 'Hoạt động' KHÔNG thành dòng", async () => {
  const r = await outline("Tieng_Anh", MD_ANH);
  assert.equal(r.source, "markdown");
  assert.deepEqual(r.rows.map((x) => x.tenBai), [
    "Unit 1: At My Birthday Party - Lesson 1",
    "Unit 1: At My Birthday Party - Lesson 2",
    "Unit 1: At My Birthday Party - Lesson 3",
  ]);
  assert.ok(r.rows.every((x) => x.soTiet === 1));
});

test("Tiếng Anh: '### Lesson 2 (2 tiết)' đổi số tiết; thiếu Unit hoặc Lesson → rows rỗng (không lỗi)", async () => {
  const md = "# Unit 3: My Toys (Chủ đề 3: Đồ chơi của tớ)\n\n### Lesson 1\n\n### Lesson 2 (2 tiết)\n";
  const r = await outline("Tieng_Anh", md);
  assert.deepEqual(r.rows.map((x) => x.soTiet), [1, 2]);
  assert.deepEqual((await outline("Tieng_Anh", "# Unit 1: Chỉ có tiêu đề\n\nKhông có Lesson.\n")).rows, []);
  assert.deepEqual((await outline("Tieng_Anh", "### Lesson 1\n\nKhông có tiêu đề Unit.\n")).rows, []);
});

// ------------------------------------------------------------------ Chuẩn hoá tiêu đề

test("normalizeTitle: sau dấu kết câu viết hoa lại; tiêu đề đã đúng chữ hoa/thường thì giữ nguyên", async () => {
  const { normalizeTitle } = await import("../src/services/khgdTieuHocTiengVietParser.js");
  assert.equal(normalizeTitle("TIA SỐ. SỐ LIỀN TRƯỚC, SỐ LIỀN SAU"), "Tia số. Số liền trước, số liền sau");
  assert.equal(normalizeTitle("Ngày hôm qua đâu rồi?"), "Ngày hôm qua đâu rồi?");
  assert.equal(normalizeTitle("ÔN TẬP PHÉP CỘNG, PHÉP TRỪ (không nhớ) TRONG PHẠM VI 100"), "Ôn tập phép cộng, phép trừ (không nhớ) trong phạm vi 100");
});
