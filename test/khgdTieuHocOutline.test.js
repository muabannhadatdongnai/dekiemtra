import { test } from "node:test";
import assert from "node:assert/strict";
import { Packer } from "docx";

/**
 * khgdTieuHocOutline.test.js  (Phiên 48b)
 * Bộ đọc Markdown SGK Tiếng Việt → dòng theo tiết cho tab Khung KHGD Tiểu học. Dùng dữ liệu MÔ PHỎNG
 * cấu trúc (không chép nội dung SGK) của 2 biến thể định dạng chương thật đã gặp ở Tiếng Việt Lớp 2:
 *   - Biến thể A (chuong_1.md): #### Bài k, hoạt động là mục danh sách in đậm, có dấu trích dẫn [n].
 *   - Biến thể B (chuong_2.md): ### BÀI K IN HOA, hoạt động là tiêu đề "I. HOẠT ĐỘNG ĐỌC"...
 */

const MD_A = `# CHỦ ĐỀ 1: EM LỚN LÊN TỪNG NGÀY (TUẦN 1 - TUẦN 4) [4]

Chủ đề **"Em lớn lên từng ngày"** là hành trình mở đầu cho chương trình [4].

---

## MỤC LỤC CHỦ ĐỀ 1 [4]

| Tuần | Bài học | Nội dung chính | Trang |
| :--- | :--- | :--- | :--- |
| **Tuần 1** | **Bài 1**: Tôi là học sinh lớp 2 | Mô tả ngắn [4, 9]. | 10 |
| | **Bài 2**: Ngày hôm qua đâu rồi? | Mô tả ngắn [4]. | 13 |

---

## CHI TIẾT CÁC BÀI HỌC VÀ HOẠT ĐỘNG KHÁM PHÁ

### TUẦN 1: BẮT ĐẦU NĂM HỌC MỚI [4]

#### Bài 1: Tôi là học sinh lớp 2 (Trang 10) [4]

*   **1. Đọc: "Tôi là học sinh lớp 2"** [9]
    *   *Nội dung*: Mô tả bài đọc [9].
    *   *Câu hỏi thảo luận*:
        1. Câu hỏi một? [9]
*   **2. Viết** [1]
    *   *Viết chữ hoa*: **A** [1].
    *   *Ứng dụng*: Câu ứng dụng [1].
*   **3. Nói và nghe: "Những ngày hè của em"** [1]
    *   *Nội dung*: Mô tả hoạt động nói [1].

---

#### Bài 2: Ngày hôm qua đâu rồi? (Trang 13) [4]

*   **1. Đọc: Bài thơ "Ngày hôm qua đâu rồi?"** [1]
    *   *Nội dung*: Mô tả bài thơ [7].
*   **2. Viết** [1]
    *   *Nghe - viết*: Bài thơ *"Ngày hôm qua đâu rồi?"* [1].
    *   *Bảng chữ cái*: Ôn luyện [7].
*   **3. Luyện tập** [1]
    *   *Từ ngữ & Câu*:
        *   Nhận diện từ ngữ chỉ sự vật [8].
    *   *Viết đoạn văn*: Viết một đoạn văn ngắn tự giới thiệu về bản thân (họ tên, trường lớp...) [9].
*   **4. Đọc mở rộng** [9]
    *   Tìm đọc một bài thơ về thiếu nhi [9].

---

## TỔNG KẾT CHỦ ĐỀ 1 [4, 9]

1.  **Lòng tự hào**: nội dung tổng kết [6].
`;

const MD_B = `# CHỦ ĐỀ 2: ĐI HỌC VUI SAO (Tuần 5 - Tuần 8)

Chủ đề **"Đi học vui sao"** đưa học sinh vào thế giới trường lớp.

---

## TUẦN 5

### BÀI 9: CÔ GIÁO LỚP EM

#### I. HOẠT ĐỘNG ĐỌC
##### 1. Văn bản thơ: "Cô giáo lớp em" (Tác giả)
Dòng thơ mô phỏng.
##### 2. Từ ngữ giải nghĩa
*   **Hương nhài**: Hương thơm nhẹ nhàng.

#### II. HOẠT ĐỘNG VIẾT
*   **Luyện viết chữ hoa**: Chữ hoa **D** (cỡ vừa và cỡ nhỏ).
*   **Viết câu ứng dụng**:
    > Câu ứng dụng mô phỏng.

---

#### III. HOẠT ĐỘNG NÓI VÀ NGHE: KỂ CHUYỆN "CẬU BÉ HAM HỌC"
*(Theo một tập truyện)*
##### 1. Nội dung tóm tắt câu chuyện
Tóm tắt mô phỏng.

---
---

### BÀI 10: THỜI KHOÁ BIỂU

#### I. HOẠT ĐỘNG ĐỌC
##### 1. Văn bản đọc: "Thời khoá biểu"
| Buổi | Tiết | Thứ Hai |
| :--- | :---: | :--- |
| **SÁNG** | **1** | Toán |

#### II. HOẠT ĐỘNG VIẾT & LUYỆN TỪ VÀ CÂU
##### 1. Nghe - viết
*   Nghe - viết một đoạn trong văn bản.
##### 2. Luyện từ và câu
*   **Tìm từ ngữ chỉ sự vật**: Học sinh, cô giáo...
##### 3. Luyện viết đoạn văn (Thời gian biểu)
*   Học sinh viết thời gian biểu cá nhân.

#### III. HOẠT ĐỘNG ĐỌC MỞ RỘNG
*   **Đọc bảng tin nhà trường**: Mô phỏng.
`;

async function loadParser() {
  return import("../src/services/khgdTieuHocTiengVietParser.js");
}

// ------------------------------------------------------------------ Chủ đề

test("extractChuDe (biến thể A): lấy tên chủ đề đúng chữ hoa/thường từ đoạn mở đầu, kèm khoảng tuần", async () => {
  const { extractChuDe } = await loadParser();
  const r = extractChuDe(MD_A);
  assert.equal(r.chuDe, "Em lớn lên từng ngày");
  assert.equal(r.so, 1);
  assert.equal(r.tuanTu, 1);
  assert.equal(r.tuanDen, 4);
});

test("extractChuDe (biến thể B, không có dấu trích dẫn, 'Tuần' viết thường)", async () => {
  const { extractChuDe } = await loadParser();
  const r = extractChuDe(MD_B);
  assert.equal(r.chuDe, "Đi học vui sao");
  assert.equal(r.tuanTu, 5);
  assert.equal(r.tuanDen, 8);
});

test("extractChuDe: không có đoạn in đậm thì đổi tiêu đề IN HOA về dạng câu", async () => {
  const { extractChuDe } = await loadParser();
  const r = extractChuDe("# CHỦ ĐỀ 3: NIỀM VUI TUỔI THƠ (TUẦN 9 - TUẦN 12) [4]\n\nĐoạn mở đầu không in đậm tên.\n");
  assert.equal(r.chuDe, "Niềm vui tuổi thơ");
});

test("extractChuDe: tiêu đề không phải 'CHỦ ĐỀ' (VD môn dùng 'Chương') → null để form giữ nhãn cũ", async () => {
  const { extractChuDe } = await loadParser();
  assert.equal(extractChuDe("# Chương 1: Số tự nhiên\n\nNội dung"), null);
  assert.equal(extractChuDe("Không có tiêu đề nào"), null);
  assert.equal(extractChuDe(""), null);
});

// ------------------------------------------------------------------ Bóc tách

test("parseTiengVietChapter (A): nhận đúng Bài, tên bài, tuần và loại hoạt động; bỏ qua bảng MỤC LỤC + phần TỔNG KẾT", async () => {
  const { parseTiengVietChapter } = await loadParser();
  const { bai } = parseTiengVietChapter(MD_A);
  assert.equal(bai.length, 2);
  assert.deepEqual(bai.map((b) => [b.soBai, b.tenBai, b.tuan]), [
    [1, "Tôi là học sinh lớp 2", 1],
    [2, "Ngày hôm qua đâu rồi?", 1],
  ]);
  assert.deepEqual(bai[0].hoatDong.map((a) => a.loai), ["doc", "viet", "noiNghe"]);
  assert.deepEqual(bai[1].hoatDong.map((a) => a.loai), ["doc", "viet", "luyenTuVaCau", "vietDoan", "docMoRong"]);
  assert.equal(bai[0].hoatDong[1].ten, "Chữ hoa A");
  assert.equal(bai[0].hoatDong[2].ten, "Những ngày hè của em");
  assert.equal(bai[1].hoatDong[1].kieu, "ngheViet");
  assert.equal(bai[1].hoatDong[3].ten, "Viết một đoạn văn ngắn tự giới thiệu về bản thân");
});

test("parseTiengVietChapter (B): tên Bài IN HOA đổi về dạng câu, tiêu đề 'I./II./III. HOẠT ĐỘNG' được nhận ra, bảng trong bài bị bỏ qua", async () => {
  const { parseTiengVietChapter } = await loadParser();
  const { bai } = parseTiengVietChapter(MD_B);
  assert.equal(bai.length, 2);
  assert.deepEqual(bai.map((b) => [b.soBai, b.tenBai, b.tuan]), [
    [9, "Cô giáo lớp em", 5],
    [10, "Thời khoá biểu", 5],
  ]);
  assert.deepEqual(bai[0].hoatDong.map((a) => a.loai), ["doc", "viet", "noiNghe"]);
  assert.equal(bai[0].hoatDong[1].ten, "Chữ hoa D", "bỏ phần '(cỡ vừa và cỡ nhỏ)'");
  assert.equal(bai[0].hoatDong[2].ten, "Kể chuyện Cậu bé ham học", "tên trong ngoặc kép IN HOA đổi về dạng câu");
  assert.deepEqual(bai[1].hoatDong.map((a) => a.loai), ["doc", "viet", "luyenTuVaCau", "vietDoan", "docMoRong"]);
  assert.equal(bai[1].hoatDong[3].ten, "Luyện viết đoạn văn (Thời gian biểu)");
});

test("parseTiengVietChapter: Markdown lạ định dạng → bai rỗng (KHÔNG lỗi), để caller quay về luồng cũ", async () => {
  const { parseTiengVietChapter } = await loadParser();
  const r = parseTiengVietChapter("# Tiêu đề lạ\n\nChỉ là một đoạn văn bình thường, không có Bài nào.\n");
  assert.deepEqual(r.bai, []);
});

test("chữ hoa nhiều chữ được nối bằng dấu phẩy ('E và Ê' / 'Ă, Â' → 'E, Ê' / 'Ă, Â'); nội dung không phải chữ cái giữ nguyên", async () => {
  const { parseTiengVietChapter } = await loadParser();
  const md = `## TUẦN 1\n### BÀI 1: THỬ\n#### II. HOẠT ĐỘNG VIẾT\n*   **Luyện viết chữ hoa**: Chữ hoa **E** và **Ê** (cỡ vừa).\n\n### BÀI 2: THỬ HAI\n#### II. HOẠT ĐỘNG VIẾT\n*   **Luyện viết chữ hoa**: Ôn tập viết hoa tên riêng của người.\n`;
  const { bai } = parseTiengVietChapter(md);
  assert.equal(bai[0].hoatDong[0].ten, "Chữ hoa E, Ê");
  assert.equal(bai[1].hoatDong[0].ten, "Ôn tập viết hoa tên riêng của người");
});

// ------------------------------------------------------------------ Dựng dòng theo tiết

test("buildTiengVietRows (A): Bài lẻ 4 tiết + Bài chẵn 6 tiết = 10 tiết/tuần, tên dòng đúng kiểu bản mẫu giáo viên", async () => {
  const { parseTiengVietChapter, buildTiengVietRows } = await loadParser();
  const rows = buildTiengVietRows(parseTiengVietChapter(MD_A));
  assert.deepEqual(
    rows.map((r) => r.tenBai),
    [
      "Đọc: Bài 1: Tôi là học sinh lớp 2 - Tiết 1",
      "Đọc: Bài 1: Tôi là học sinh lớp 2 - Tiết 2",
      "Viết: Chữ hoa A",
      "Nói và nghe: Những ngày hè của em",
      "Đọc: Bài 2: Ngày hôm qua đâu rồi? - Tiết 1",
      "Đọc: Bài 2: Ngày hôm qua đâu rồi? - Tiết 2",
      "Viết: Nghe - viết: Ngày hôm qua đâu rồi?",
      "Luyện từ và câu",
      "Viết một đoạn văn ngắn tự giới thiệu về bản thân - Tiết 1",
      "Viết một đoạn văn ngắn tự giới thiệu về bản thân - Tiết 2",
    ]
  );
  assert.equal(rows.length, 10);
  assert.ok(rows.every((r) => r.soTiet === 1), "mỗi dòng đúng 1 tiết");
  // Đọc Tiết 1+2 cùng nhóm; Viết đoạn văn Tiết 1+2 cùng nhóm KHÁC nhóm Đọc; dòng 1 tiết không có nhóm
  assert.equal(rows[0].nhomTiet, rows[1].nhomTiet);
  assert.notEqual(rows[0].nhomTiet, "");
  assert.equal(rows[2].nhomTiet, "");
  assert.equal(rows[8].nhomTiet, rows[9].nhomTiet);
  assert.notEqual(rows[8].nhomTiet, rows[0].nhomTiet);
  assert.notEqual(rows[4].nhomTiet, rows[0].nhomTiet, "Đọc của Bài khác nhau không được chung nhóm");
});

test("buildTiengVietRows (B): cùng quy tắc tiết, 'Đọc mở rộng' KHÔNG chiếm dòng riêng", async () => {
  const { parseTiengVietChapter, buildTiengVietRows } = await loadParser();
  const rows = buildTiengVietRows(parseTiengVietChapter(MD_B));
  assert.equal(rows.length, 10);
  assert.ok(!rows.some((r) => /mở rộng/i.test(r.tenBai)));
  assert.equal(rows[3].tenBai, "Nói và nghe: Kể chuyện Cậu bé ham học");
  assert.equal(rows[8].tenBai, "Luyện viết đoạn văn (Thời gian biểu) - Tiết 1");
});

test("buildTiengVietRows: tên bài trong chuong_{n}_bai.json (lessonIndex) được ưu tiên hơn tên bóc từ Markdown", async () => {
  const { parseTiengVietChapter, buildTiengVietRows } = await loadParser();
  const rows = buildTiengVietRows(parseTiengVietChapter(MD_B), [{ soBai: 9, tenBai: "Cô giáo lớp em (tên chuẩn)" }]);
  assert.equal(rows[0].tenBai, "Đọc: Bài 9: Cô giáo lớp em (tên chuẩn) - Tiết 1");
  assert.equal(rows[4].tenBai, "Đọc: Bài 10: Thời khoá biểu - Tiết 1", "bài không có trong lessonIndex vẫn dùng tên từ Markdown");
});

test("buildTiengVietRows: Bài không nhận ra hoạt động nào vẫn giữ 1 dòng (không mất bài)", async () => {
  const { parseTiengVietChapter, buildTiengVietRows } = await loadParser();
  const rows = buildTiengVietRows(parseTiengVietChapter("## TUẦN 1\n### BÀI 1: CHỈ CÓ TÊN\n\nKhông có hoạt động nào.\n"));
  assert.deepEqual(rows.map((r) => r.tenBai), ["Bài 1: Chỉ có tên"]);
});

// ------------------------------------------------------------------ Service gợi ý

test("buildKhgdTieuHocOutline: Tiếng Việt → có Chủ đề + dòng theo tiết (source = markdown)", async () => {
  const { buildKhgdTieuHocOutline } = await import("../src/services/khgdTieuHocOutlineService.js");
  const r = buildKhgdTieuHocOutline({ subject: "Tieng_Viet", markdown: MD_A });
  assert.equal(r.chuDe, "Em lớn lên từng ngày");
  assert.equal(r.source, "markdown");
  assert.equal(r.rows.length, 10);
});

test("buildKhgdTieuHocOutline: môn khác Tiếng Việt/Tiếng Anh dùng bộ đọc mức Bài (mỗi 'Bài k' 1 dòng, 1 tiết mặc định)", async () => {
  const { buildKhgdTieuHocOutline } = await import("../src/services/khgdTieuHocOutlineService.js");
  const r = buildKhgdTieuHocOutline({ subject: "Toan", markdown: MD_A });
  assert.equal(r.chuDe, "Em lớn lên từng ngày");
  assert.equal(r.source, "markdown");
  assert.deepEqual(r.rows.map((x) => x.tenBai), ["Bài 1: Tôi là học sinh lớp 2", "Bài 2: Ngày hôm qua đâu rồi?"]);
});

test("buildKhgdTieuHocOutline: Markdown không có Bài/Lesson nào → rows rỗng (source none) nhưng vẫn trả Chủ đề nếu có", async () => {
  const { buildKhgdTieuHocOutline } = await import("../src/services/khgdTieuHocOutlineService.js");
  const r = buildKhgdTieuHocOutline({ subject: "Toan", markdown: "# CHỦ ĐỀ 4: HÌNH HỌC\n\nChỉ có đoạn văn, không có Bài nào.\n" });
  assert.equal(r.chuDe, "Hình học");
  assert.deepEqual(r.rows, []);
  assert.equal(r.source, "none");
});

test("buildKhgdTieuHocOutline: Markdown rỗng/lạ không ném lỗi", async () => {
  const { buildKhgdTieuHocOutline } = await import("../src/services/khgdTieuHocOutlineService.js");
  assert.deepEqual(buildKhgdTieuHocOutline({ subject: "Tieng_Viet", markdown: "" }).rows, []);
  assert.equal(buildKhgdTieuHocOutline({ subject: "Tieng_Viet", markdown: "# Lạ\n\nabc" }).chuDe, null);
});

// ------------------------------------------------------------------ Gộp ô cột Tiết

test("computeTietMerge: nhóm cùng nhomTiet gộp thành 1 ô 'N tiết', dòng lẻ ghi '1 tiết'", async () => {
  const { computeTietMerge } = await import("../src/services/khgdTieuHocMergeUtils.js");
  const rows = [
    { soTiet: 1, nhomTiet: "g1" },
    { soTiet: 1, nhomTiet: "g1" },
    { soTiet: 1, nhomTiet: "" },
    { soTiet: 1, nhomTiet: "" },
  ];
  assert.deepEqual(computeTietMerge(rows), [
    { show: true, span: 2, label: "2 tiết" },
    { show: false, span: 0, label: "" },
    { show: true, span: 1, label: "1 tiết" },
    { show: true, span: 1, label: "1 tiết" },
  ]);
});

test("computeTietMerge: soTiet là chữ tự do (không phải số) thì giữ nguyên chữ, không ép thành 'NaN tiết'", async () => {
  const { computeTietMerge } = await import("../src/services/khgdTieuHocMergeUtils.js");
  const [a] = computeTietMerge([{ soTiet: "1 tiết + 1 tiết tự chọn", nhomTiet: "" }]);
  assert.equal(a.label, "1 tiết + 1 tiết tự chọn");
});

test("computeMergeInfo (dùng chung export + preview): chỉ gộp khi giá trị không rỗng", async () => {
  const { computeMergeInfo } = await import("../src/services/khgdTieuHocMergeUtils.js");
  const rows = [{ k: "A" }, { k: "A" }, { k: "" }, { k: "" }];
  assert.deepEqual(computeMergeInfo(rows, (r) => r.k), [
    { show: true, span: 2 },
    { show: false, span: 0 },
    { show: true, span: 1 },
    { show: true, span: 1 },
  ]);
});

// ------------------------------------------------------------------ File Word thật

async function docXmlFromOutline(md, meta = { subject: "Tieng_Viet", grade: 2 }) {
  const JSZip = (await import("jszip")).default;
  const { buildKhgdTieuHocOutline } = await import("../src/services/khgdTieuHocOutlineService.js");
  const { buildKhgdTieuHocDocument } = await import("../src/services/khgdTieuHocExportService.js");
  const outline = buildKhgdTieuHocOutline({ subject: "Tieng_Viet", markdown: md });
  let running = 0;
  const lessons = outline.rows.map((r, i) => {
    running += r.soTiet;
    return { id: `x${i}`, chuDe: outline.chuDe, tenBai: r.tenBai, tuan: `Tuần ${Math.ceil(running / 10)}`, soTiet: r.soTiet, tietPPCT: running, nhomTiet: r.nhomTiet, dieuChinh: "" };
  });
  const buffer = await Packer.toBuffer(buildKhgdTieuHocDocument({ lessons, meta }));
  const zip = await JSZip.loadAsync(buffer);
  return { xml: await zip.file("word/document.xml").async("string"), lessons };
}

test("Word: cột Tiết gộp ô '2 tiết' cho Đọc + Viết đoạn văn, dòng lẻ '1 tiết'; Chủ đề là tên SGK", async () => {
  const { xml } = await docXmlFromOutline(MD_A);
  const table = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/)[0];
  const rows = table.match(/<w:tr[ >][\s\S]*?<\/w:tr>/g);
  assert.equal(rows.length, 11, "1 hàng tiêu đề + 10 hàng dữ liệu");
  const text = (s) => (s.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, "")).join("");
  const data = rows.slice(1);

  // 3 nhóm 2 tiết (Đọc B1, Đọc B2, Viết đoạn văn B2): mỗi nhóm ghi "2 tiết" đúng 1 lần ở dòng đầu
  assert.equal(data.filter((r) => text(r).includes("2 tiết")).length, 3);
  // 4 dòng lẻ (Viết chữ hoa, Nói và nghe, Nghe - viết, Luyện từ và câu) ghi "1 tiết"
  assert.equal(data.filter((r) => text(r).includes("1 tiết")).length, 4);
  // Chủ đề = tên trong SGK (không phải "Chương 1"), gộp 1 ô cho cả 10 dòng
  assert.ok(text(data[0]).includes("Em lớn lên từng ngày"));
  assert.ok(!xml.includes("Chương 1"));
  assert.equal(data.filter((r) => text(r).includes("Em lớn lên từng ngày")).length, 1);
  // vMerge "continue" ở cột Tiết: đúng 3 ô (mỗi nhóm 2 dòng có 1 ô nối tiếp)
  const continues = data.map((r) => (r.match(/<w:vMerge w:val="continue"\/>/g) || []).length);
  // dòng nối tiếp của nhóm Tiết: dòng 2, 6, 10 (chỉ có vMerge của cột Tiết, cột Tuần/Chủ đề cũng nối tiếp ở mọi dòng trừ dòng 1)
  assert.equal(continues[0], 0);
  assert.equal(continues[1], 3, "dòng Tiết 2 của Đọc B1: nối tiếp Tuần + Chủ đề + Tiết");
  assert.equal(continues[2], 2, "dòng đơn: chỉ nối tiếp Tuần + Chủ đề");
});

// ------------------------------------------------------------------ Prompt AI

test("Prompt Khung KHGD Tiểu học dặn AI chỉ ghi lồng ghép ở dòng '- Tiết 1', để trống các dòng '- Tiết' tiếp theo", async () => {
  const mod = await import("../src/services/khgdTieuHocPromptTemplates.js");
  const build = mod.buildKhgdTieuHocPrompt || Object.values(mod).find((f) => typeof f === "function");
  const prompt = build({
    subject: "Tieng_Viet",
    grade: 2,
    lessons: [
      { id: "a", chuDe: "Em lớn lên từng ngày", tenBai: "Đọc: Bài 1: Tôi là học sinh lớp 2 - Tiết 1" },
      { id: "b", chuDe: "Em lớn lên từng ngày", tenBai: "Đọc: Bài 1: Tôi là học sinh lớp 2 - Tiết 2" },
    ],
  });
  assert.match(prompt, /- Tiết 2/);
  assert.match(prompt, /CHỈ ghi ở dòng "- Tiết 1"/);
});
