# AI Exam Generator — Tóm tắt dự án (bản cập nhật sau PHIÊN 28: Soạn Giáo Án — quy tắc tích hợp GDQP&AN có điều kiện + phụ lục "Gợi ý thiết kế Học liệu" tự động cho Lớp 1-3)

## PHIÊN 28 — Soạn Giáo Án: GDQP&AN không ép buộc + phụ lục "Gợi ý thiết kế Học liệu" (Lớp 1-3)

**Bối cảnh**: Khoa phản ánh 2 vấn đề ở tab Soạn Giáo Án: (1) tích hợp GDQP&AN bị AI lồng ghép
gượng ép vào cả những bài học quá cơ bản (VD học bảng chữ cái Lớp 1-3) không có liên kết logic
nào với Quốc phòng - An ninh; (2) Lớp 1/2/3 học chủ yếu bằng hình ảnh nhưng giáo án chưa có gợi ý
học liệu trực quan nào cho giáo viên tự tạo Flashcard bằng công cụ AI.

**a) Quy tắc tích hợp GDQP&AN có điều kiện** (`src/data/lessonPlanIntegrations.js`,
entry `TICH_HOP_GDQPAN`):
- `buildPromptFragment()` đổi từ hàm không tham số sang nhận `ctx = { grade }` (theo đúng pattern
  đã có ở `TICH_HOP_STEM`/`buildStemGradeGuidance()`).
- Prompt giờ cho AI 2 lựa chọn rõ ràng: (1) GIỮ GDQP&AN nếu bài học thực sự liên kết logic (biển
  đảo, truyền thống, kỷ luật, an toàn cộng đồng...); (2) nếu bài học quá cơ bản/không liên kết rõ
  ràng — chuyển sang 1 trong 3 hướng thay thế: Giáo dục Đạo đức / Giáo dục Kỹ năng sống / Giáo dục
  Quyền Trẻ em. Với `grade <= 3` có thêm 1 đoạn nhấn mạnh riêng (các bài học cơ bản ở khối này hầu
  như không liên kết được với GDQP&AN).
- ⚠️ **Vấn đề nhãn hiển thị**: nội dung field JSON vẫn CHUNG 1 trường `"tichHopGDQPAN"` như cũ
  (không đổi hình dạng dữ liệu), nhưng nội dung thực tế giờ có thể là Đạo đức/Kỹ năng sống/Quyền
  trẻ em — nếu vẫn hiển thị cứng nhãn `"Tích hợp GDQP&AN:"` như trước sẽ SAI với nội dung. Giải
  quyết bằng field phụ **`"tichHopGDQPANNhan"`** (AI tự khai báo ĐÃ CHỌN hướng nào, giới hạn đúng
  4 giá trị cố định) — `LessonPlanPreview.jsx` và `lessonPlanExportService.js` giờ dùng
  `lessonPlan.tichHopGDQPANNhan || "Tích hợp GDQP&AN"` (fallback an toàn nếu AI không trả về, VD
  tương thích với giáo án cũ đã lưu trước phiên này).
- `schemaExample` cập nhật thành `"tichHopGDQPAN": "...", "tichHopGDQPANNhan": "..."` để AI luôn
  thấy đủ hình dạng 2 field trong ví dụ JSON chính (đúng lý do đã giải thích ở đầu file
  `lessonPlanIntegrations.js`: ví dụ cụ thể "neo" hành vi AI tốt hơn mô tả bằng lời).

**b) Phụ lục "Gợi ý thiết kế Học liệu" tự động Lớp 1-3** (`src/data/lessonPlanPromptTemplates.js`):
- Hàm mới `buildVisualHocLieuGuidance(grade)` — **TỰ ĐỘNG** kích hoạt khi `grade` là số và `<= 3`,
  KHÔNG qua cơ chế "tích hợp" tuỳ chọn (`lessonPlanIntegrations.js`) vì Khoa yêu cầu luôn có sẵn
  cho đúng 3 khối lớp này, giáo viên không cần tự bật cờ nào. Lớp 4-5 và Mầm non: không thêm.
- Yêu cầu AI trả về đúng 3 từ khoá (prompt) tiếng Việt, phong cách hoạt hình/flashcard dễ thương,
  bám sát nội dung bài học, để giáo viên copy-dán thẳng vào Canva/ChatGPT/Gemini — field JSON mới
  `"goiYHocLieuHinhAnh"` (mảng 3 chuỗi). Vì đây không phải 1 "tích hợp" trong registry, ví dụ JSON
  của field này được nối trực tiếp vào `integrationSchemaLines` ngay trong
  `buildLessonPlanPrompt()` (không qua `collectIntegrationSchemaExamples()`), vẫn giữ đúng nguyên
  tắc "luôn có ví dụ JSON cụ thể" như các field tích hợp khác.
- Hiển thị: thêm `HocLieuHinhAnhBlock` (`LessonPlanPreview.jsx`) và
  `buildHocLieuHinhAnhParagraphs()` (`lessonPlanExportService.js`) — đúng pattern phụ lục "Dàn ý
  Slide" liền trước, đặt cuối cùng trong danh sách phụ lục, KHÔNG có cờ ẩn/hiện riêng (không đụng
  khung mục I-IV chuẩn CV2345 nên không có rủi ro "sai form" khi BGH duyệt).

**Test mới**: `test/lessonPlanPhien28.test.js` (10 test) — quy tắc điều kiện GDQP&AN có đủ nội
dung + ghi chú riêng đúng khối lớp; nhãn động hiển thị đúng khi có/không có `tichHopGDQPANNhan`
(bao gồm test fallback tương thích ngược); phụ lục Học liệu tự động đúng Lớp 1-3, KHÔNG xuất hiện
ở Lớp 4-5/Mầm non, cả ở prompt lẫn khi xuất Word.

**Kết quả**: `npm test` 313/313 PASS (303 cũ + 10 mới), `npm run build` sạch. Không sửa hình dạng
dữ liệu của field `tichHopGDQPAN` hiện có (chỉ thêm field phụ) nên KHÔNG ảnh hưởng giáo án đã lưu
trước đó — `tichHopGDQPANNhan` chỉ là field bổ sung, có fallback an toàn khi thiếu.

---

## PHIÊN 27 — Xác nhận 2 tính năng tưởng "chưa code" đã xong từ trước + phiếu review icon

**Bối cảnh**: Khoa yêu cầu làm tiếp 3 mục treo trong bảng "CẦN KHOA QUYẾT ĐỊNH": (1) chế độ in
Màu/Đen trắng toàn phiếu, (2) Lớp 3 "Thu thập/phân loại số liệu" Đợt 3, (3) icon line-art Bài 3
chưa qua mắt giáo viên/học sinh thật. Rà soát code THẬT trước khi viết gì mới.

**Phát hiện chính**: (1) và (2) **ĐÃ CODE XONG HOÀN CHỈNH từ trước** (đủ 4 tầng
generator/catalog/orchestrator/preview/Word export cho mục 2; đủ preview + Word export + UI
checkbox + wiring `page.js` cho mục 1) — chỉ là `NEXT_STEPS.md` chưa được cập nhật, đúng kiểu
lệch tài liệu đã từng gặp với `ThuThapSoLieuSection`. Đã chạy thử THẬT (không chỉ đọc code) qua
`generateWorksheet()` + `buildWorksheetDocxBlob()` để xác nhận trước khi viết test.

**Việc thực sự làm trong phiên này:**
1. `test/worksheetPrintModeBw.test.js` (5 test) — `getSectionVisualTheme(bwMode)` luôn trả đúng
   `BW_PALETTE` bất kể layout/index; `bwMode=false`/mặc định không bị ảnh hưởng; Word xuất ra ở
   chế độ đen/trắng không còn sót hex màu gốc nào của `COLOR_PALETTES`.
2. `test/worksheetLop3Dot3.test.js` (9 test) — cấu trúc dữ liệu `generateThuThapSoLieu`, ràng
   buộc max/min duy nhất, câu hỏi khớp dữ liệu, catalog chỉ lộ ở Lớp 3, tích hợp
   `generateWorksheet()`, Word export đúng nội dung/đáp án + không lộ đáp án bản học sinh + dùng
   ảnh PNG (không phải ký tự Unicode rủi ro).
3. `lineart-icon-review-sheet.html` — trang HTML độc lập liệt kê đủ 16 icon từ
   `scripts/lineArtIconDefs.js` kèm ô tick "Đạt/Cần chỉnh sửa" + ghi chú, để Khoa đưa giáo
   viên/học sinh thật xem (việc mục #7 vốn cần con người, Claude không tự làm thay được).
4. Cập nhật bảng "CẦN KHOA QUYẾT ĐỊNH" trong `NEXT_STEPS.md` — đánh dấu xong mục #3, #4; ghi rõ
   công cụ hỗ trợ cho mục #7.

**Kết quả**: `npm test` 303/303 PASS (289 cũ + 14 mới), `npm run build` sạch. Không sửa logic
sản phẩm nào - chỉ xác nhận, viết test, và làm công cụ hỗ trợ review cho việc cần con người.

---

## PHIÊN 26 — Rà soát chủ động: nâng Next.js, test Word thật, giám sát Upstash, Error Boundary

**Bối cảnh**: Khoa hỏi thẳng "còn cần điều chỉnh/ý tưởng gì để đạt mức hoàn hảo hơn", Claude rà
soát toàn bộ codebase và đề xuất 1 danh sách; Khoa chọn 5 việc cụ thể để làm ngay. Chi tiết đầy đủ
từng việc (kèm code trước/sau, lý do kỹ thuật) nằm ở mục "MỚI NHẤT (Phiên 26)" đầu `NEXT_STEPS.md`
— mục này ở đây chỉ tóm tắt để không trùng lặp.

**Tóm tắt 5 việc đã làm (tất cả đều build + test THẬT, không chỉ sửa lý thuyết):**

1. **Checklist "CẦN KHOA QUYẾT ĐỊNH"** — bảng ngắn dán đầu `NEXT_STEPS.md`, tách riêng khỏi log
   kỹ thuật, để phiên Claude sau đọc nhanh thay vì lục cả nghìn dòng log.

2. **Nâng Next.js 14.2.35 → 16.3.3**: rủi ro breaking-change thấp (không dùng route động,
   `next/headers`, `next/image`, middleware). Sửa 1 lỗi CSS thật lộ ra khi build bằng Turbopack
   (`@import` đặt sai vị trí trong `globals.css` — bug CSS tồn tại từ trước, Webpack cũ không báo).
   Thêm `engines.node: ">=20.9.0"`. Vá xong cả 3 lỗ hổng HIGH của Next.js + 1 lỗ hổng `nanoid` phụ.
   `npm audit` giờ chỉ còn `xlsx` (đã biết, chưa có bản vá).

3. **`npm run test:word-compat`** (file mới `scripts/check-word-compatibility.mjs`): dựng `.docx`
   thật cho cả 6 tính năng xuất Word, convert bằng LibreOffice headless (`soffice --headless
   --convert-to pdf`), kiểm tra bằng `pdfinfo`. **Phát hiện + sửa 2 lỗi thật ngay lần chạy đầu**:
   `exportVietnameseExamToWord()`/`exportReportCommentsToWord()` thiếu `return blob` (cùng lỗi
   `exportLessonPlanToWord()` từng mắc ở phiên trước) — rà soát chéo sửa nhất quán thêm 4 hàm
   cùng họ (`exportToWord`, `exportBothVersions`, `exportOutlineToWord`,
   `exportOutlineBothVersions`, `exportWorksheetToWord`, `exportWorksheetBothVersions`). Script
   tách riêng khỏi `npm test` mặc định vì phụ thuộc binary ngoài (`soffice`/`pdfinfo`).

4. **Giám sát hạn mức Upstash** (`src/services/upstashClient.js`, điểm giao duy nhất mà 7-8 module
   lưu trữ đều đi qua): thêm log `[UPSTASH_ERROR]`/`[UPSTASH_QUOTA?]`/`[UPSTASH_HEALTH]` (tóm tắt
   mỗi 200 lệnh), không đổi hành vi throw/fallback êm hiện có. Test mới `test/upstashClient.test.js`
   (5 test, mock `fetch`).

5. **Error Boundary tổng**: `src/app/error.js` (bắt lỗi render trong `page.js` và cây con, hiện
   UI thân thiện + nút "Thử lại"/"Tải lại trang") và `src/app/global-error.js` (lưới an toàn cuối
   cho lỗi ngay tại `layout.js`, tự render lại `<html>/<body>` theo đúng yêu cầu Next.js). Đã kiểm
   chứng bằng route tạm cố ý throw lỗi + `next start` + `curl` → HTTP 500 đúng, đã XOÁ route tạm.

**Kết quả cuối phiên**: 289/289 test PASS, `npm run build` sạch, `npm run test:word-compat` 6/6 OK.

**⚠️ Phát hiện phụ CHƯA sửa** (xem mục #8 bảng checklist đầu `NEXT_STEPS.md`): test flaky có sẵn
từ trước trong `worksheetLineArtIcons.test.js`, không liên quan Next.js — icon ⭐ random cho bài
"Đếm và viết số" thỉnh thoảng trùng icon ⭐ cố định ở khối "Tự đánh giá" cuối phiếu, khiến 1
assertion báo sai (không phải bug sản phẩm thật, phiếu Word vẫn đúng).

---

## PHIÊN 24 — Sửa lỗi ký tự Unicode (line-art Bài 7, biểu đồ cột, Nhận diện hình) hiện TRỐNG trong Word

**Bối cảnh**: dangkhoa gửi ảnh chụp + file Word thật (`BÀI-TẬP-TOÁN-HocSinh.docx`) báo Bài 7 "So
sánh độ dài" không nhìn ra các thanh line-art trong Word, dù bản PDF vẫn ổn. Đây CHÍNH XÁC là rủi
ro đã ghi ở mục "⚠️ Cần Hoan tự xem lại" #1 cuối PHIÊN 23 (line-art mới + `LENGTH_KIND_GLYPHS`
chưa được xem thật trên Word).

**Chẩn đoán (mở trực tiếp file Word dangkhoa gửi để xác nhận, không đoán):** `LENGTH_KIND_GLYPHS`
(Phiên 23 thêm) dùng ký tự Unicode hình khối (`┆ ▬ ▭ ▪`) LẶP LẠI, ép font **Times New Roman**
(hằng số `FONT` toàn file). Font này KHÔNG có glyph cho các ký tự đó → Word hiện TRỐNG. Bản PDF
không lỗi vì PDF xuất qua trình duyệt (Chrome) - trình duyệt tự động fallback sang font hệ thống
khác có glyph khi Times New Roman thiếu; Word mở trực tiếp thì không có cơ chế fallback đáng tin
cậy tương tự.

**Rà soát chủ động** (theo đúng nguyên tắc "generator bugs tend to cluster" đã rút ra từ các phiên
trước) phát hiện thêm 2 chỗ dùng ĐÚNG pattern rủi ro "glyph hiếm ép font cứng" này:
- Biểu đồ cột "Thu thập số liệu": `"■".repeat(d.value)`.
- "Nhận diện hình": `SHAPE_GLYPHS` — trong đó `⬭ ⬠ ⬡ ⏢` (ê-líp, ngũ giác, lục giác, hình thang)
  là glyph đặc biệt hiếm, rủi ro cao nhất trong cả 3 chỗ.

**Giải pháp: chuyển cả 3 sang ẢNH PNG (`ImageRun`)**, dùng lại đúng pipeline SVG→PNG đã chứng minh
hoạt động tốt ở Bài 3 (Phiên 20) — ảnh không phụ thuộc font máy người dùng nên Word/PDF/Web luôn
hiển thị giống hệt nhau, dứt điểm cả LỚP lỗi chứ không chỉ 1 điểm lỗi:
- **`scripts/shapeIconDefs.js`** (MỚI): nguồn vẽ SVG 11 icon hình học (tròn, vuông, tam giác, chữ
  nhật, ngôi sao, trái tim, thoi, ê-líp, ngũ giác, lục giác, thang), cùng phong cách stroke đen
  `#1a1a1a` với `lineArtIconDefs.js` (Bài 3) để nhất quán hình ảnh toàn bộ phiếu.
- **`scripts/render-word-assets.js`** (MỚI, script 1 lần, không chạy trong runtime): rasterize
  SVG→PNG bằng `@resvg/resvg-js`, sinh ra:
  - `src/data/shapeIconPngs.js` — 11 icon PNG cố định kích thước (dùng cho "Nhận diện hình" +
    "Đếm hình ứng dụng").
  - `src/data/barTilePng.js` — **1 ảnh thanh xám đặc DUY NHẤT**. Điểm khác biệt quan trọng so với
    icon Bài 3: đây KHÔNG phải bộ ảnh cố định theo giá trị, mà 1 ảnh gốc được KÉO GIÃN
    `transformation.width` lúc nhúng `ImageRun` để biểu diễn độ dài (Bài 7, 1-20cm) hoặc số lượng
    (biểu đồ cột, 3-15) bất kỳ — tránh phải tiền-render hàng chục ảnh cho từng giá trị có thể có.
- **`src/services/worksheetExportService.js`**:
  - `LENGTH_KIND_GLYPHS` + `.repeat(cm)` → hàm mới `lengthBarImageRun(cm)` (Bài 7).
  - `"■".repeat(d.value)` → `lengthBarImageRun(d.value)` (biểu đồ cột, dùng CHUNG hàm với Bài 7 vì
    cùng bản chất "thanh dài tỉ lệ theo số").
  - `SHAPE_GLYPHS` → hàm mới `shapeIconImageRun(shapeName, sizePx)` (Nhận diện hình + Khay hình).
- **`src/data/worksheetSchemas.js`**: export thêm `SHAPES` (trước đây `const` nội bộ không export)
  để test xác nhận được đủ 11/11 icon có ảnh tương ứng, tránh lệch âm thầm nếu sau này thêm hình
  mới mà quên vẽ icon Word.

**Đánh đổi có chủ ý:** trước đây mỗi "kind" ở Bài 7 (băng giấy/dây/bút chì/que tính/thước/đường/
cây/người) dùng ký tự KHÁC NHAU để có chút khác biệt trực quan trong Word. Giải pháp ảnh mới dùng
CHUNG 1 thanh xám cho MỌI kind — ưu tiên "chắc chắn không lỗi font" hơn "đa dạng hoạ tiết theo
kind trong Word" (bản web `LengthFigure` vẫn giữ nguyên đủ 8 kiểu SVG khác nhau, KHÔNG bị ảnh
hưởng — chỉ riêng bản Word đơn giản hoá). Nếu dangkhoa muốn khôi phục khác biệt trực quan ở Word,
cần thêm 2-3 tile PNG hoạ tiết (đặc/sọc/chấm) + map kind→tile trong `lengthBarImageRun()`.

### Đã tự verify thật (không chỉ đọc code)
- Mở trực tiếp file `BÀI-TẬP-TOÁN-HocSinh.docx` dangkhoa gửi bằng `python-docx` để xác nhận ĐÚNG
  nguyên nhân trước khi sửa (không đoán) — thấy rõ run text chứa `┆`, `▭` với `font.name` rỗng/kế
  thừa `Times New Roman` từ style.
- Test mới `test/worksheetWordAssetsPhien24.test.js` (5 test, build `.docx` THẬT bằng `docx` +
  giải nén `JSZip` soi thẳng `document.xml`, đúng tinh thần `worksheetLineArtIcons.test.js`):
  xác nhận KHÔNG còn ký tự Unicode thô (`┆▬▭▪■⬭⬠⬡⏢`) trong `document.xml`, đúng số thẻ
  `<w:drawing>` (bằng số thanh/icon kỳ vọng), ảnh PNG trong `word/media` giải mã hợp lệ (magic
  byte PNG đúng).
- `npm test`: **279/279 PASS** (274 cũ + 5 mới), chạy lại 5 lần liên tiếp không flaky.
- `npm run build`: sạch, exit 0, không lỗi import alias `@/data/...` cho 2 file mới.

### ⚠️ Cần dangkhoa tự xem lại
1. Độ rộng thanh Bài 7 (`CM_TO_PX = 16`, thanh 20cm ≈ 320px) — chưa xem thật trên Word/trình in để
   xác nhận thanh dài nhất vẫn nằm gọn trong bề rộng trang A4 (trừ lề), có thể cần chỉnh hằng số
   này nếu bị tràn hoặc quá nhỏ khi in.
2. Việc bỏ khác biệt trực quan theo `kind` trong Word (xem "Đánh đổi có chủ ý" ở trên) — nếu quan
   trọng với giáo viên, báo lại để làm thêm hoạ tiết.
3. Icon 11 hình học mới vẽ tay lần đầu (chưa có trong bất kỳ phản hồi giáo viên nào trước đây) —
   cần xem thật để xác nhận rõ nét, dễ nhận diện ở cỡ nhỏ khi in.

---



**Bối cảnh**: Hoan gửi 3 ảnh chụp phiếu bài tập thật + 4 yêu cầu cụ thể:
1. Bài "So sánh độ dài" (Bài 7 trong ảnh): đổi sang kiểu line-art, đa dạng vật minh hoạ (con
   đường, cây thước, cái cây, người cao người thấp) thay vì chỉ có "băng giấy".
2. Bài 11/12 (đếm hình, xem đồng hồ): icon mascot trong file Word quá nhỏ, khó nhìn bằng mắt thường.
3. Mục tiêu sử dụng: giáo viên in phiếu qua **dịch vụ photocopy** - cần tối ưu TẤT CẢ phiếu bài
   tập để in đen trắng tốt (không chỉ đẹp trên màn hình).
4. Bài "Tách - gộp số" (Bài 2 trong ảnh): 4 sơ đồ xếp lệch 3+1 thay vì 2 hàng x 2 cột cân đối.

### 1. Line-art đa dạng cho "So sánh độ dài" (`do_dai_so_sanh`, Lớp 1)
- **`src/data/worksheetSchemas.js`**: thay `LENGTH_BAND_NAMES` (chỉ có "băng giấy") bằng
  `LENGTH_VISUAL_KINDS` — 8 kiểu minh hoạ: băng giấy, sợi dây, bút chì, que tính, cây thước, con
  đường (`orientation: "horizontal"` - so **độ dài**) và cây, người (`orientation: "vertical"` -
  so **chiều cao**). `generateDoDaiSoSanh()` random ĐỘC LẬP 1 kiểu/câu, trả thêm field `kind`,
  `orientation`, `unitLabel` ("dài"/"cao").
- **`src/components/WorksheetPreview.jsx`**: thêm `LengthFigure` — vẽ SVG **line-art thuần** (chỉ
  viền `stroke`, `fill="none"`, KHÔNG tô đặc) theo đúng `kind` (rope=đường lượn sóng, pencil=hình
  bút chì có đầu vát, ruler=có vạch chia, road=viền + vạch giữa đứt nét, tree=tán lá + thân cây,
  person=hình que). `DoDaiSoSanhSection` viết lại: vật `vertical` đặt CẠNH NHAU chung 1 đường đáy
  (so chiều cao trực quan), vật `horizontal` vẫn xếp chồng 2 dòng như cũ.
- **`src/services/worksheetExportService.js`**: `buildDoDaiSoSanhParagraphs` bỏ hẳn màu xanh lá/
  cam cũ (giờ 1 màu xám đậm duy nhất, B&W-friendly), thêm `LENGTH_KIND_GLYPHS` (ký tự đại diện
  từng kiểu vì Word không vẽ được SVG), đổi "dài"/"cao" theo `it.unitLabel`.

### 2. Icon mascot Bài 11/12 trong Word quá nhỏ
- **`src/services/worksheetExportService.js`**: `mascotRun` (icon 🐿️/🦉... cạnh số thứ tự bài) —
  `size: 30` (15pt) → **`size: 40`** (20pt), ĐÚNG mức đã từng sửa cho icon đồng hồ trong cùng file
  vì lý do y hệt (icon cùng cỡ chữ tiêu đề thì bị "chìm", không nổi bật).

### 3. "🖨️ Tối ưu in đen trắng" (MỚI - toàn bộ Phiếu bài tập)
- **Thiết kế**: 1 công tắc HIỂN THỊ/XUẤT FILE thuần tuý (`bwMode`), KHÔNG phải tuỳ chọn lúc TẠO
  phiếu — giáo viên bật/tắt bất kỳ lúc nào ở khu vực nút tải, không cần tạo lại phiếu.
- **`src/data/worksheetLayoutTemplates.js`**: thêm `BW_PALETTE` (nền trắng tinh, viền/chữ đen
  tuyệt đối) + tham số `bwMode` cho `getSectionVisualTheme()` — đây là nguồn palette DUY NHẤT dùng
  chung cho cả web và Word, nên sửa 1 chỗ là cả 2 nơi đều đổi theo. **CHỦ Ý KHÔNG dùng CSS
  `filter: grayscale()`** vì màu pastel chuyển xám vẫn là 1 mảng xám nhạt — dễ mất nét/rỗ đốm khi
  photocopy hàng loạt (đặc biệt máy đời cũ); nền trắng + viền đen tuyệt đối mới in rõ, đúng mục
  tiêu "tối ưu cho photocopy".
- **`src/components/WorksheetPreview.jsx`**: nhận prop `bwMode`, thêm `FRAME_STYLES_BW` (khung
  ngoài đổi màu, giữ nguyên kiểu nét), `effectivePalette` thay `layout.palette`. `ThuThapSoLieuSection`
  (biểu đồ cột) đổi cột tô đặc sang **vân sọc chéo đen/trắng** khi bwMode (đọc được vẫn so sánh
  được độ dài cột, giảm ~50% lượng mực, không bị "cán phẳng" như khối tô đặc khi photocopy).
- **`src/app/globals.css`**: thêm `.worksheet-bw` đè các phần tử màu hard-code trong CSS (title-
  badge, rainbow bar, info-pill) — những chỗ theme JS không với tới được.
- **`src/services/worksheetExportService.js`**: thread `bwMode` xuyên suốt
  `buildWorksheetDocxBlob`/`buildSectionParagraphs`/`getTheme` → `exportWorksheetToWord`/
  `exportWorksheetBothVersions` đều nhận thêm tham số `bwMode`.
- **`src/components/WorksheetExportActions.jsx`**: thêm checkbox "🖨️ Tối ưu in đen trắng".
- **`src/app/page.js`**: state `worksheetBwMode` (lift lên vì cần dùng ở cả `WorksheetPreview` lẫn
  `WorksheetExportActions`), truyền `bwMode`/`onToggleBwMode` xuống 2 nơi.
- **Phạm vi hiện tại**: MỚI áp dụng cho tab Phiếu bài tập (đúng phạm vi Hoan yêu cầu qua ảnh chụp).
  Các tab khác (Giáo án, Đề kiểm tra...) CHƯA có công tắc này — nếu Hoan muốn mở rộng, báo lại.

### 4. Sơ đồ "Tách - gộp" (Bài 2) xếp lệch 3+1 → 2 hàng x 2 cột cân đối
- **`src/components/WorksheetPreview.jsx`**: `TachGopSection` đổi từ `flexWrap: "wrap"` (số ô/
  hàng phụ thuộc bề rộng khung chứa còn dư, dễ ra 3+1 lệch) sang **CSS Grid cố định 2 cột**
  (`gridTemplateColumns: "repeat(2, 132px)"`) — LUÔN chia đúng 2 sơ đồ/hàng bất kể bề rộng, ra
  đúng 2x2 cân đối với 4 sơ đồ mặc định.

### Đã tự verify thật
- Viết 3 script "smoke test" tạm thời (đã xoá sau khi chạy) gọi trực tiếp
  `generateDoDaiSoSanh`/`generateTachGop` + `buildWorksheetDocxBlob` (cả `bwMode: true/false`) để
  xác nhận không lỗi cú pháp/runtime — cả 2 chế độ xuất file Word thành công, dữ liệu random đúng
  đủ cả 8 kiểu minh hoạ độ dài và cả 2 orientation (ngang/đứng).
- `npm test`: **274/274 PASS** (không có test cũ nào phụ thuộc cấu trúc dữ liệu đã đổi của
  `generateDoDaiSoSanh`/`LENGTH_BAND_NAMES`, xác nhận qua grep trước khi sửa).
- `npm run build`: sạch, exit 0.
- Đã cập nhật `src/data/helpGuideContent.js` (tab Hướng dẫn sử dụng, thêm ở PHIÊN 22) theo đúng
  quy ước "mỗi khi thêm tính năng, cập nhật luôn tài liệu hướng dẫn" — thêm 2 feature mới + 3
  devNotes pointer mới vào mục "Phiếu bài tập".

### ⚠️ Cần Hoan tự xem lại (chưa xem được trên trình duyệt thật)
1. Hình line-art mới (đặc biệt "road"/"tree"/"person" - lần đầu thêm, cần xem thật trên trình
   duyệt để chỉnh tỉ lệ nếu cần) và bản Word tương ứng (ký tự đại diện LENGTH_KIND_GLYPHS).
2. Giao diện checkbox "Tối ưu in đen trắng" + thử in thật (PDF hoặc giấy) để đánh giá đúng mục
   tiêu "không mất nét khi photocopy" - sandbox không in được ra giấy thật để tự kiểm chứng khâu
   cuối này.
3. Cỡ icon mascot Word 40 (20pt) đã đủ to chưa, hay cần to hơn nữa - dễ chỉnh (1 số) nếu chưa vừa ý.
4. Sơ đồ Tách-gộp 2x2 mới - nếu giáo viên đổi số lượng thành số LẺ (VD 5), hàng cuối sẽ chỉ còn 1
   ô (không tự động căn giữa) - chấp nhận được vì defaultCount mặc định luôn là số chẵn (4), nhưng
   cần Hoan xác nhận có cho giáo viên tự đổi số lẻ ở dạng bài này không.

---

## PHIÊN 22 — Thêm tab MỚI "📚 Hướng dẫn sử dụng" (7 tab, không phải 6)

**Bối cảnh**: Hoan yêu cầu thêm 1 tab hướng dẫn sử dụng, mô tả các chức năng/cách dùng bộ công cụ
trong source code, viết sao cho DỄ CHỈNH SỬA khi sau này nâng cấp thêm tính năng.

**Thiết kế đã chọn**: tách RIÊNG dữ liệu (nội dung chữ) khỏi giao diện (cách hiển thị) - đúng
nguyên tắc "1 nguồn dữ liệu duy nhất" đã dùng ở nhiều nơi khác trong dự án (VD `LESSON_PLAN_INTEGRATIONS`).

1. **`src/data/helpGuideContent.js` (MỚI)** — file dữ liệu THUẦN (không JSX), chứa toàn bộ nội
   dung hướng dẫn dưới dạng mảng `GUIDE_SECTIONS`. Mỗi phần tử là 1 "module" (khớp đúng 1 tab thật
   trong `MODES`, + 2 mục không phải tab thật: "Tổng quan" ở đầu và "Hạ tầng dùng chung" ở cuối),
   gồm: `description` (mô tả chung), `steps` (các bước thao tác theo đúng thứ tự trên UI),
   `features` (danh sách tính năng cụ thể, có `name`+`detail`), `notes` (lưu ý/giới hạn giáo viên
   cần biết), và `devNotes` (RIÊNG cho lập trình viên/AI phiên sau - trỏ đúng tên file/hàm liên
   quan, kèm hướng dẫn "muốn thêm 1 X mới thì sửa ở đâu"). Nội dung được viết dựa trên đối chiếu
   THẬT với code + toàn bộ lịch sử trong `PROJECT_SUMMARY.md`/`NEXT_STEPS.md` (không suy đoán).
2. **`src/components/HelpGuideView.jsx` (MỚI)** — component CHỈ LO RENDER (accordion mở/đóng từng
   mục, ô tìm nhanh lọc theo từ khoá, checkbox "Hiện ghi chú kỹ thuật" để bật/tắt phần `devNotes`
   dành cho dev - mặc định TẮT, giáo viên bình thường không bị rối bởi tên file/hàm code). KHÔNG
   chứa bất kỳ nội dung chữ nào cứng trong JSX - toàn bộ đọc từ `helpGuideContent.js`.
3. **`src/app/page.js`**: thêm `MODES.HELP = "help"` (mục 7, sau `REPORT_COMMENT`) + 1 nút tab
   "📚 Hướng dẫn sử dụng". Tab này **KHÁC BẢN CHẤT** 6 tab cũ: không gọi AI, không có Form nhập
   liệu, không tham gia in ấn (không dùng `id="print-area"`) — nên được render **TOÀN CHIỀU RỘNG**
   (tách khỏi khối `<div className="grid ...">` 2 cột trái-phải của 6 tab kia), qua 1 nhánh
   `mode === MODES.HELP ? <HelpGuideView /> : ( ...grid 2 cột cũ... )` bọc ngoài toàn bộ khối grid.

**Vì sao dễ chỉnh sửa sau này**: mọi thay đổi nội dung hướng dẫn (thêm tính năng mới, sửa mô tả,
thêm lưu ý...) chỉ cần sửa ĐÚNG 1 file `helpGuideContent.js` (dữ liệu thuần, có comment hướng dẫn
quy ước ngay đầu file) — không phải đụng vào JSX của `HelpGuideView.jsx`. File dữ liệu cũng tự làm
mẫu cho việc "thêm 1 tab chức năng mới" (xem mục cuối `GUIDE_SECTIONS`, id `"shared"`, phần
`devNotes.pointers` có hướng dẫn từng bước cụ thể tham chiếu chính tab Hướng dẫn này làm ví dụ).

**Phát hiện phụ khi rà soát để viết tài liệu (không sửa, chỉ ghi nhận)**: có sẵn 1 bộ tính năng
"Tạo tranh tô màu" hoàn chỉnh trong code (`src/components/ColoringPageForm.jsx` + `ColoringPagePreview.jsx`
+ `ColoringExportActions.jsx` + route `/api/generate-coloring-page`) nhưng **KHÔNG được gắn vào
`MODES`/nút tab nào trong `page.js`** — không rõ đây là tính năng đang xây dở hay đã cố ý tạm ẩn.
KHÔNG đụng vào (ngoài phạm vi yêu cầu lần này) — nếu Hoan muốn bật tính năng này thành 1 tab thứ 8,
báo lại để làm riêng theo đúng khuôn "cách thêm 1 tab mới" đã ghi trong `helpGuideContent.js`.

### Đã tự verify thật
- `npm install` (221 packages) + `npm test`: **274/274 PASS** (không đổi số test — tab mới không
  cần test tự động vì không có logic sinh số/gọi AI, chỉ hiển thị nội dung tĩnh).
- `npm run build`: sạch, exit 0. Bundle trang chính tăng nhẹ 526kB → 540kB (nội dung text mới).
- Đã tự đọc lại cấu trúc JSX (nhánh `mode === MODES.HELP ? ... : ( grid cũ )`) qua build sạch +
  test suite pass để xác nhận không phá vỡ cú pháp/logic của 6 tab cũ.

### ⚠️ Cần Hoan tự xem lại (chưa xem được trên trình duyệt thật)
1. Giao diện tab mới trên trình duyệt thật (accordion mở/đóng, ô tìm nhanh, checkbox "Hiện ghi chú
   kỹ thuật") — sandbox không có trình duyệt để tự bấm thử.
2. Đọc lại nội dung mô tả từng tab xem có đúng/đủ theo cách Hoan hiểu không — nếu thấy thiếu hoặc
   sai chỗ nào, chỉ cần báo lại tên tính năng, sẽ sửa đúng 1 chỗ trong `helpGuideContent.js`.

---

## PHIÊN 21 — Rà soát chủ động toàn bộ codebase (Hoan yêu cầu "xem còn gì chưa làm") + phát hiện
## + sửa 1 lỗi thật trong tính điểm ma trận đề (chưa từng được báo qua phản hồi giáo viên)

**Phạm vi rà soát** (không chỉ riêng module Phiếu Bài Tập như các phiên trước):
1. Audit lại TOÀN BỘ 38 hàm `generate*()` trong `worksheetSchemas.js` theo đúng nguyên tắc
   "dedupe bằng `used` Set" đã chốt ở Phiên 19 — kết quả: các hàm KHÔNG dùng `used` Set đều đã
   được kiểm tra thủ công và xác nhận KHÔNG có rủi ro trùng lặp thực tế (phạm vi số đủ rộng, hoặc
   dùng cơ chế shuffle-slice/Set khác đã đảm bảo tính duy nhất theo cách phù hợp với từng dạng bài)
   - KHÔNG có bug mới nào ở nhóm này.
2. `npm audit`: 4 lỗ hổng mức HIGH — 3 lỗi thuộc `next@14.2.35` (có bản vá qua nâng cấp lên
   `next@16.3.2`, nhưng đây là BREAKING CHANGE, CHƯA làm vì cần Hoan xác nhận trước khi nâng major
   version Next.js) + 1 lỗi ở `xlsx` (Prototype Pollution/ReDoS, dùng thật ở tính năng xuất/nhập
   Excel hàng loạt Nhận xét học bạ - `reportCommentExportService.js`/`reportCommentBulkParser.js`
   - KHÔNG có bản vá từ nhà phát hành `xlsx`, cần theo dõi tiếp, chưa có hướng xử lý ngay).
3. Không có secret/API key hardcode trong code - toàn bộ đọc qua `process.env.*` đúng chuẩn.
4. **PHÁT HIỆN 1 LỖI THẬT qua fuzz-test chủ động** (không phải do giáo viên phản hồi) ở
   `scoringUtils.js` (`computeScores()` - dùng cho tính năng "Ma trận đề kiểm tra", tự động gán
   điểm từng câu theo mức độ NHẬN BIẾT/THÔNG HIỂU/VẬN DỤNG/VẬN DỤNG CAO sao cho tổng = 10):
   - **Lỗi**: phần dư do làm tròn 0.25đ (drift) trước đây bị dồn HẾT vào câu CUỐI CÙNG bất kể câu
     đó vốn đáng bao nhiêu điểm - với đề nhiều câu (VD 12 câu), câu cuối có thể chỉ đáng 0.5đ, drift
     âm dồn vào kéo điểm xuống **0 hoặc ÂM (VD "-0.25 điểm")** - vô lý trên 1 đề kiểm tra thật.
   - **Đã xác nhận bằng fuzz-test**: chạy 20.000 tổ hợp ngẫu nhiên (1-15 câu, mức độ ngẫu nhiên) -
     **1.042/20.000 lần** (~5.2%) ra ít nhất 1 câu có điểm <= 0.
   - **SỬA**: đổi cơ chế rải drift - (1) áp SÀN tối thiểu 0.25đ cho MỌI câu ngay từ đầu (không câu
     nào được 0đ); (2) drift còn lại được rải theo TỪNG NẤC 0.25đ vào câu đang có điểm CAO NHẤT
     tại mỗi vòng (chọn lại sau mỗi lần rải), bỏ qua câu đã chạm sàn - vừa đảm bảo tổng luôn CHÍNH
     XÁC = 10, vừa không câu nào bị âm/0 điểm.
   - **Test mới**: `test/worksheetScoringUtils.test.js` (6 test, gồm fuzz 3000+3000+1000 tổ hợp) -
     xác nhận: không câu nào <= 0, tổng luôn chính xác 10, mọi điểm là bội số 0.25, thứ tự điểm
     tăng theo độ khó, và test lại ĐÚNG case đã gây lỗi cụ thể tìm được (12 câu như trên).
- `npm test`: **274/274 PASS** (268 cũ + 6 mới). `npm run build`: sạch.

### ⚠️ Cần Hoan xác nhận
1. **Nâng cấp Next.js 14.2.35 -> 16.3.2** để vá 3/4 lỗ hổng bảo mật mức HIGH - là breaking change
   (Next 15/16 đổi 1 số API async params/searchParams, có thể cần sửa vài route) - CHƯA làm, cần
   Hoan xác nhận có muốn nâng cấp ở phiên riêng không (rủi ro thấp cho app nội bộ ít người dùng,
   nhưng nên cân nhắc nếu public-facing).
2. Lỗ hổng `xlsx` (Prototype Pollution/ReDoS) hiện KHÔNG có bản vá từ nhà phát hành - rủi ro thấp
   vì app chỉ dùng để giáo viên tự nhập/xuất file Excel nhận xét học bạ của chính họ (không xử lý
   file từ nguồn không tin cậy), nhưng nên tránh mở tính năng này cho người dùng ẩn danh/công khai
   tải file Excel bất kỳ lên trong tương lai.



**Bối cảnh**: Phiên 19 phát hiện Bài 3 (`dem_va_viet_so`) dùng icon emoji màu (🍎⭐🚗...) khó phân
biệt khi máy in tự chuyển sang thang xám, nhưng chưa sửa vì cần Hoan chốt hướng trước (3 phương
án A/B/C, xem NEXT_STEPS.md). Hoan chọn **hướng (A)**: vẽ bộ icon SVG line-art tự vẽ, thay hẳn
emoji ở cả 2 tầng hiển thị.

**Đã làm:**
1. **Vẽ mới 16 icon line-art** (nét vẽ đen trắng, `stroke-width` đồng bộ) khớp 1-1 với 16 emoji
   trong kho `ICONS` (`worksheetSchemas.js`): táo, sao, ô tô, gà con, hoa hướng dương, bướm, cà
   rốt, cá, bóng bay, kẹo mút, tên lửa, rùa, gấu bông, bánh quy, hoa đào, ong. Nguồn vẽ DUY NHẤT:
   `scripts/lineArtIconDefs.js`.
2. **1 nguồn, 2 định dạng xuất** — tránh vẽ lại 2 lần cho web/Word:
   - `src/data/lineArtIcons.js` — SVG markup (dùng cho web, component `LineArtIcon` mới trong
     `WorksheetPreview.jsx`, render bằng `dangerouslySetInnerHTML` + `viewBox`).
   - `src/data/lineArtIconPngs.js` — PNG base64 RENDER SẴN từ CÙNG SVG (dùng cho Word, `ImageRun`
     trong `worksheetExportService.js`) - lý do dùng PNG thay vì SVG thẳng cho Word: docx/Word
     không đảm bảo tương thích SVG ở mọi phiên bản, PNG là lựa chọn an toàn nhất.
   - Script tạo lại (không chạy trong runtime app, không thêm dependency native vào bundle
     production): `scripts/render-line-art-icons.js`, dùng `@resvg/resvg-js` (cài tạm bằng
     `npm install --no-save`, KHÔNG có trong `package.json`).
3. **Web** (`WorksheetPreview.jsx`): `DemVaVietSoSection` đổi từ in chuỗi emoji sang render mảng
   `<LineArtIcon>` (có fallback về emoji gốc nếu 1 icon nào đó thiếu bản line-art - an toàn khi mở
   rộng kho `ICONS` sau này quên vẽ icon mới).
4. **Word** (`worksheetExportService.js`): `buildDemVaVietSoParagraphs()` đổi từ `TextRun` emoji
   sang `ImageRun` (PNG 30x30), xuống dòng CHỦ ĐỘNG 6 icon/dòng (`DEM_ICON_ROW_SIZE`, cùng tinh
   thần fix Bài 10/11 ở Phiên 19 - tránh để Word tự ngắt dòng ngẫu nhiên). Có helper
   `base64ToUint8Array()` (dùng `atob()`, an toàn cho môi trường browser - file này chạy client-side).
5. **KHÔNG thêm cờ `printMode` riêng** (khác draft cũ ở mục "Thiết kế chế độ in Màu/Đen trắng") -
   icon line-art vốn đã trung tính màu sắc (chỉ có 1 màu đen), rõ nét ở MỌI chế độ in mà không cần
   logic rẽ nhánh theo chế độ.
- **Test mới**: `test/worksheetLineArtIcons.test.js` (3 test) - build .docx THẬT, giải nén JSZip
  xác nhận: (1) đủ 16/16 icon có bản line-art cả web lẫn Word; (2) document.xml KHÔNG còn emoji
  màu thô, có đủ số thẻ `<w:drawing>` = tổng số icon đếm được; (3) đáp số vẫn ẩn/hiện đúng theo
  `showAnswers`. Phát hiện + xử lý qua test: docx dedupe ảnh TRÙNG BYTE thành 1 file `/media` dùng
  chung (không phải bug - hành vi bình thường của thư viện `docx`, đã sửa lại assertion cho đúng).
- Sanity-check độc lập thêm: build 1 file `.docx` demo thật, giải nén xem trực tiếp 1 ảnh PNG nhúng
  bằng mắt - xác nhận đúng icon mong muốn (không lệch icon do nhầm base64 key).
- `npm test`: 268/268 PASS (265 cũ + 3 mới). `npm run build`: sạch (exit 0), bundle trang chính
  tăng ~45KB (480KB → 525KB) do nhúng 16 icon PNG base64 - chấp nhận được, không ảnh hưởng dependency
  production (`@resvg/resvg-js` chỉ dùng lúc chạy script tạo icon, không nằm trong `package.json`).

### ⚠️ Cần Hoan test thực tế (chưa test được trong sandbox)
1. Mở thử bản Word Bài 3 bằng Microsoft Word thật (không chỉ soi XML) - xác nhận icon line-art
   hiển thị đúng vị trí/kích thước, không bị lệch dòng khi in trên khổ giấy A4 thật.
2. Xem bản web (`npm run dev`) - icon line-art có đủ rõ/đẹp ở các cỡ màn hình khác nhau không.
3. In thử Bài 3 ở CẢ 2 chế độ (màu và đen trắng) - xác nhận icon rõ nét ở cả 2, đúng mục tiêu ban
   đầu của việc sửa lỗi này.
4. Nếu thấy 1 icon nào chưa đẹp/chưa giống hình thật (icon line-art là hình vẽ mới hoàn toàn, chưa
   qua mắt giáo viên/học sinh thật) - phản hồi lại để chỉnh, sửa ở `scripts/lineArtIconDefs.js` rồi
   chạy lại `node scripts/render-line-art-icons.js` (không sửa tay 2 file tự động sinh).

## PHIÊN 19 — Sửa lỗi bản Word "Phiếu Bài Tập" Lớp 1 (Bài 7/10/11/12), phản hồi qua ảnh chụp

**Bối cảnh**: Hoan gửi ảnh chụp trực tiếp từ file Word đã xuất (Bài 7, Bài 10-11-12) + 1 ảnh tham
khảo minh hoạ mong muốn cho Bài 3 (không phải ảnh chụp từ app).

**1) Bài 7 "So sánh độ dài" (`do_dai_so_sanh`) - bản Word chỉ có số, không có gì để "quan sát".**
- Trước: `buildDoDaiSoSanhParagraphs()` in đúng 1 dòng `"tên: 17 cm  ○  tên: 15 cm"` - đúng số
  liệu nhưng không có "thước" nào để nhìn, trái tinh thần bài "quan sát số đo".
- Sau: vẽ thêm 1 "thanh đo" xấp xỉ tỉ lệ thật bằng ký tự khối Unicode `"▬"` lặp lại ĐÚNG bằng số
  cm (1 ký tự ~ 1cm) - in trên 2 dòng riêng (mỗi băng giấy 1 dòng, thẳng hàng bên trái) rồi mới
  đến dòng điền dấu so sánh. KHÔNG dùng `Table` của docx để vẽ thanh (dù có thể tạo thanh đẹp hơn
  bằng cell width/shading) - giữ đúng nguyên tắc đã ghi ở đầu `worksheetExportService.js`: tránh
  nested Table vì dễ bị nền trắng bảng con đè lên nền màu bảng cha (lỗi đã từng gặp, xem mục 5).

**2) Bài 10/11/12 - icon/glyph quá nhỏ do Word tự ngắt dòng không kiểm soát.**
- Trước: `buildNhanDienHinhParagraphs` in TẤT CẢ hình chung 1 Paragraph (Word tự ngắt dòng theo bề
  rộng trang); `buildDemHinhUngDungParagraphs` in TOÀN BỘ khay hình (15-20+ glyph) chung 1
  Paragraph tương tự; `buildXemDongHoGioDungParagraphs` cố định 4 đồng hồ/dòng
  (`chunkArray(items, 4)`) - cả 3 đều khiến glyph/emoji bị nhỏ khi in A4.
- Sau: cả 3 hàm chủ động xuống dòng theo số lượng CỐ ĐỊNH/dòng (không để Word tự ngắt) + tăng cỡ
  chữ (28-30 → 40): Bài 10 = 2 hình/dòng, Bài 11 (khay) = 5 hình/dòng (hằng số `TRAY_ROW_SIZE`),
  Bài 12 = 2 đồng hồ/dòng (giảm từ 4).
- Đã kiểm chứng bằng script build `.docx` THẬT (không mock) cho cả 4 dạng bài cùng lúc, đọc lại
  `word/document.xml` qua JSZip, xác nhận đúng số ký tự "▬"/cm và đúng số item/dòng trước khi
  giao - không chỉ đọc code bằng mắt.
- Không cần test tự động mới: thay đổi thuần về hiển thị/layout Word, không có logic sinh số/toán
  học mới cần kiểm chứng bằng test (đã kiểm bằng script build thật ở trên).
- `npm test`: 265/265 PASS (không đổi số test - không có logic mới cần unit test riêng).
  `npm run build`: sạch.

**3) Bài 3 (icon màu 🚀🦋🌻... khó phân biệt khi in đen trắng) - CHƯA SỬA, cần Hoan chốt hướng.**
- Ứng với dạng bài `dem_va_viet_so` ("Đếm và viết số") - dùng kho `ICONS` (16 emoji màu) trong
  `worksheetSchemas.js`, in trực tiếp bằng `buildDemVaVietSoParagraphs()` (không qua glyph outline
  như Bài 10/11 vì các icon này không có Unicode outline glyph tương đương phù hợp - táo, gà con,
  bóng bay... không giống hình/chữ cái đơn giản).
- Đây là quyết định về ASSET/kiến trúc (cần vẽ icon SVG line-art mới, hoặc thêm hẳn `printMode`
  "color"/"bw" đổi bộ icon, hoặc tạm giữ nguyên) - không phải chỉnh câu lệnh/cỡ chữ đơn thuần như
  2 mục trên, nên KHÔNG tự chọn thay Hoan. Xem đầy đủ 3 phương án (A/B/C) trong `NEXT_STEPS.md`
  mục "CẦN QUYẾT ĐỊNH" - Hoan chọn hướng rồi mới code ở phiên tới.

## PHIÊN 18 — Sửa layout "Bài tập phân hoá" (3 cột → xếp dọc) + phân hoá STEM theo khối lớp

**Bối cảnh**: 2 phản hồi thực tế từ Hoan sau khi dùng thử PHIÊN 17.

**1) Layout "Bài tập phân hoá theo 3 mức độ" bị ép 3 cột ngang, chữ khó đọc trên khổ A4.**
- Nguyên nhân: `BaiTapPhanHoaBlock` (`LessonPlanPreview.jsx`) dùng `display: flex` + `flexWrap:
  "wrap"` với mỗi khối `flex: "1 1 220px"` → trên khổ A4 (khi in/PDF) 3 khối Mức 1/2/3 nằm cạnh
  nhau, mỗi cột chỉ còn ~200px khiến chữ bị ép rất khó đọc. Phần export Word (`buildBaiTapPhanHoaParagraphs`
  trong `lessonPlanExportService.js`) vốn đã xếp dọc tuần tự từ trước (không phải bảng), KHÔNG bị
  lỗi này - chỉ sửa bản preview web/PDF.
- **Sửa**: đổi `BaiTapPhanHoaBlock` sang `flexDirection: "column"`, bỏ `flex`/`minWidth`/
  `flexWrap` của từng khối - mỗi mức (`Mức 1 - Hỗ trợ`, `Mức 2 - Đạt chuẩn`, `Mức 3 - Nâng cao`)
  giờ chiếm TRỌN chiều rộng, xếp lần lượt từ trên xuống, đúng QUY TẮC TRÌNH BÀY PHỤ LỤC Hoan đã
  nêu: liệt kê theo chiều dọc với tiêu đề rõ ràng, không dùng bảng/lưới 3 cột.

**2) Hướng dẫn STEM (PHIÊN 17) trước đây dùng 1 mức độ chung cho mọi khối lớp - SAI về tâm lý lứa
tuổi.** Đã phân hoá lại theo đúng yêu cầu:
- **Mầm non - Lớp 3**: thủ công đơn giản dạng 2D (cắt, dán, vẽ, tô màu, gấp giấy) - ít bước, không
  cần vật liệu nhỏ khó thao tác.
- **Lớp 4-5**: TUYỆT ĐỐI CẤM thủ công đơn giản - PHẢI là "dự án thu nhỏ" thử thách tư duy cao hơn:
  (a) mô hình 3D có chuyển động (ống khoá mật mã, máy bắn đá mini), (b) mô hình sa bàn quy hoạch
  có ngân sách ảo, (c) trò chơi giải mã (Escape Room) gắn kiến thức bài học.
- **THCS/THPT**: Hoan có nêu nhưng dự án hiện CHỈ hỗ trợ Mầm non → Lớp 5 (xem phạm vi đã chốt ở
  đầu `lessonPlanTemplates.js`) - CHƯA áp dụng, để dành khi mở rộng khối lớp.

**Thay đổi kỹ thuật:**
- `lessonPlanIntegrations.js`: thêm hàm `buildStemGradeGuidance(grade)` chọn đúng đoạn hướng dẫn
  theo khối lớp (Mầm non/1-3 vs 4-5, có fallback an toàn nếu không xác định được `grade`).
  `buildPromptFragment` của `TICH_HOP_STEM` giờ nhận `ctx = { grade }` thay vì không tham số.
  `buildIntegrationsPromptBlock(selectedKeys, ctx)` thêm tham số `ctx` (mặc định `{}`), truyền
  xuyên qua cho mọi tích hợp - các tích hợp khác không dùng `ctx` vẫn hoạt động bình thường (hàm
  của chúng không khai báo tham số nên bỏ qua).
- `lessonPlanPromptTemplates.js`: `buildLessonPlanPrompt()` gọi `buildIntegrationsPromptBlock(integrations,
  { grade })` (trước đây không truyền `grade`).
- `LessonPlanPreview.jsx`: `BaiTapPhanHoaBlock` đổi layout như trên.
- Test: +1 test cho layout xếp dọc (gián tiếp qua snapshot cấu trúc không cần thiết vì đây là thay
  đổi CSS/style, không có test riêng cho style flex - đã kiểm tra bằng mắt qua code review), +1
  test lớn `buildLessonPlanPrompt: hướng dẫn STEM phải PHÂN HOÁ theo khối lớp` kiểm tra đủ 5 mốc
  (Lớp 2, Lớp 3, Lớp 4, Lớp 5, Mầm non) đúng nhóm nội dung, có ví dụ cụ thể (ống khoá mật mã, ngân
  sách ảo, Escape Room) và Lớp 2/3 không lẫn nội dung dành cho Lớp 4-5.

**Kiểm thử**: `npm test` **265/265 PASS** (264 cũ + 1 mới). `npm run build`: sạch (exit 0). Diff
zip gốc vs zip sửa: đúng 6 file code + `PROJECT_SUMMARY.md`, không lệch ngoài ý muốn.

---

## PHIÊN 17 — Implement "Tích hợp STEM" cho hoạt động Vận dụng (Soạn giáo án)

**Bối cảnh**: Hoan muốn hoạt động "Vận dụng" trong giáo án (mục III, khung CV2345) có thể chuyển
từ dạng bài tập giấy sang 1 hoạt động định hướng Giáo dục STEM (học sinh Thiết kế/Vẽ/Lắp ráp/Chế
tạo 1 sản phẩm thực tế: poster, mô hình, sơ đồ, sổ tay...). Trước khi code, đã trao đổi để chốt
thiết kế do có ảnh hưởng tới kiến trúc "tích hợp" (`lessonPlanIntegrations.js`) và trần thời lượng
hoạt động Vận dụng (`STANDARD_ACTIVITIES.maxMinutes = 12`) đã có sẵn.

**3 quyết định đã chốt với Hoan:**
1. **Tuỳ chọn (checkbox), KHÔNG bắt buộc mọi giáo án** — thêm 1 entry mới `TICH_HOP_STEM` vào
   `LESSON_PLAN_INTEGRATIONS` (`lessonPlanIntegrations.js`), hiển thị trong lưới "Tuỳ chọn nâng
   cao" của `LessonPlanForm.jsx` giống các tích hợp hiện có (Phiếu học tập, Tích hợp NLS...).
2. **Xử lý thời lượng: giao nhiệm vụ tại lớp + hoàn thiện/nộp ở nhà** — GIỮ NGUYÊN trần
   `maxMinutes: 12` của hoạt động Vận dụng (không sửa `lessonPlanTemplates.js`/
   `computeMultiPeriodTimeline`). Trong khung 12 phút tại lớp, AI chỉ cần: nêu yêu cầu sản phẩm +
   hướng dẫn nhanh + chia nhóm/giao việc; phần "làm sản phẩm" thực tế diễn ra ở nhà, tương tự cách
   tích hợp NLS đã xử lý hoạt động cần thiết bị số (đẩy sang làm ở nhà có phụ huynh hỗ trợ).
3. **Có phụ lục JSON riêng** (không chỉ sửa chữ trong `tienTrinh`) — theo đúng mô hình "Phiếu học
   tập"/"Bài tập phân hoá": AI trả về 1 trường JSON có cấu trúc (tên sản phẩm, vật liệu cần chuẩn
   bị, các bước thực hiện, tiêu chí đánh giá/nghiệm thu ngắn gọn) để xuất thành 1 mục riêng, giáo
   viên dùng in/gửi phụ huynh ngay, không phải tự soạn thêm.

**Đã implement đúng 6 bước đã chốt:**
1. `lessonPlanIntegrations.js`: thêm entry `INTEGRATION_KEYS.TICH_HOP_STEM` (`"tichHopSTEM"`) —
   `jsonField: "stemActivity"`, `isAiGenerated: true`, `buildPromptFragment()` yêu cầu đổi bản
   chất hoạt động Vận dụng thành làm sản phẩm thực tế (Thiết kế/Vẽ/Lắp ráp/Chế tạo), gợi ý mức độ
   theo khối lớp (Mầm non/Lớp 1-2 đơn giản; Lớp 3-5 phức tạp hơn), ghi rõ tại lớp chỉ giao nhiệm vụ
   + hướng dẫn, sản phẩm hoàn thiện Ở NHÀ, và đổi `ten` hoạt động. `schemaExample`:
   `"stemActivity": { "tenSanPham": "...", "vatLieu": [...], "cacBuoc": [...], "tieuChiDanhGia": [...] }`.
2. `lessonPlanTemplates.js`: mở rộng `getActivityLabels(lessonType, integrations = [])` — thêm
   tham số thứ 2 (mặc định `[]`, KHÔNG phá vỡ các lời gọi cũ như `computeMultiPeriodTimeline`/
   `computeActivityTimeline`) — đổi `label` của khối `van_dung` thành `"[Vận dụng - Tích hợp
   STEM]"` khi `integrations` chứa `TICH_HOP_STEM`, theo đúng cơ chế đã có để đổi tên `kham_pha`
   theo `lessonType`. Import `INTEGRATION_KEYS` từ `lessonPlanIntegrations.js` (không có circular
   import - file kia không import ngược lại).
3. `lessonPlanPromptTemplates.js`: `buildLessonPlanPrompt()` gọi `getActivityLabels(lessonType,
   integrations)` (trước đây chỉ truyền `lessonType`) → `outputSchema`/`buildActivitySchemaBlock()`
   tự động phản ánh đúng `ten` đã đổi. Đồng thời sửa `structureRule` (trước đây hardcode chữ "Vận
   dụng") dùng biến `vanDungLabel` động, để quy tắc "PHẢI có đủ 4 hoạt động chuẩn..." không mâu
   thuẫn với tên hoạt động đã đổi khi tích hợp bật.
4. `LessonPlanPreview.jsx` (web) + `lessonPlanExportService.js` (Word): thêm `StemActivityBlock`/
   `buildStemActivityParagraphs()` hiển thị phụ lục "Hướng dẫn STEM" (Vật liệu / Các bước thực
   hiện / Tiêu chí đánh giá) đọc từ `stemActivity`, đúng pattern đã có của `phieuHocTap`/
   `baiTapPhanHoa` (không hiện gì nếu không có dữ liệu, tránh chèn trang thừa khi xuất Word).
5. `LessonPlanForm.jsx`: không cần sửa - `listIntegrations()` tự động hiển thị checkbox "Tích hợp
   STEM" trong lưới "Tuỳ chọn nâng cao" có sẵn.
6. Test mới trong `test/lessonPlanFixes.test.js` (+3 test, tổng 264):
   - `getActivityLabels`: bật STEM đổi đúng `ten` Vận dụng, không bật/không truyền tham số giữ
     nguyên hành vi cũ.
   - `buildLessonPlanPrompt`: bật STEM có đủ hướng dẫn + `"ten": "[Vận dụng - Tích hợp STEM]"` +
     field `"stemActivity"` trong ví dụ schema; không bật thì không có gì trong số đó.
   - `buildLessonPlanDocxSections`: có `stemActivity` thì Word có đúng phụ lục (vật liệu/các bước/
     tiêu chí), không có thì không chèn trang thừa.

**Kiểm thử**: `npm test` **264/264 PASS** (261 cũ + 3 mới). `npm run build`: sạch (exit 0). Diff
zip gốc vs zip sửa: đúng 6 file thay đổi (`lessonPlanIntegrations.js`, `lessonPlanTemplates.js`,
`lessonPlanPromptTemplates.js`, `LessonPlanPreview.jsx`, `lessonPlanExportService.js`,
`test/lessonPlanFixes.test.js`), không có thay đổi ngoài ý muốn.

**Chưa làm** (ngoài phạm vi đã thống nhất, để dành khi Hoan cần):
- Không mở rộng đổi tên `van_dung` trong `computeMultiPeriodTimeline`/`computeActivityTimeline`
  (label hiển thị trong dòng "Gợi ý phân bổ theo tiết" ở preview/prompt vẫn là "Vận dụng" thường
  kể cả khi bật STEM) - có chủ đích không đổi để giữ nguyên trần `maxMinutes=12` và không phải
  truyền `integrations` xuyên suốt nhiều lời gọi UI không liên quan.
- Chưa có ví dụ minh hoạ sản phẩm STEM theo từng môn cụ thể (hiện dựa hoàn toàn vào AI tự đề xuất
  theo "Nội dung cốt lõi" + gợi ý mức độ theo khối lớp trong prompt).

---

## PHIÊN 16 — Sửa 3 lỗi sư phạm phản hồi thực tế (Trạm 6, 7, 12) + chốt 3 QUY TẮC SƯ PHẠM bắt buộc

**Bối cảnh**: Hoan gửi phản hồi thực tế sau khi in phiếu Lớp 5 (đính kèm ảnh chụp Trạm 6 và Trạm
12) + 1 nhận xét bằng lời về Trạm 7. Cả 3 đều là lỗi thật trong code Đợt 4 (PHIÊN 15), không phải
lỗi hiển thị/in ấn đơn thuần. Hoan đặt ra 3 QUY TẮC SƯ PHẠM TOÁN LỚP 5 BẮT BUỘC — đã ghi trực tiếp
thành comment tại đúng vị trí code liên quan để không bị quên/lặp lại ở phiên sau.

### 1. Trạm 12 — Hình trụ lộ ra đề Tiểu học (Kiến thức Toán 5 CẤM dùng Pi cho hình không gian)
`generateDienTichXqTp()` (Diện tích xung quanh/toàn phần) trước đây trộn NGẪU NHIÊN cả "hình trụ"
(`pick(["hhcn", "lap_phuong", "hinh_tru"])`) — SGK Toán 5 hiện hành KHÔNG dạy công thức Sxq/Stp/thể
tích hình trụ/hình cầu (kiến thức Toán lớp 9 - THCS). Đã sửa: bỏ hẳn nhánh `"hinh_tru"`, chỉ còn
`pick(["hhcn", "lap_phuong"])`. Đồng bộ sửa cả `WorksheetPreview.jsx` (bỏ nhánh mô tả hình trụ
trong `describe()` của `DienTichXqTpSection`) và `worksheetExportService.js`
(`buildDienTichXqTpParagraphs`) — xoá code chết liên quan hình trụ ở cả 2 nơi. Đổi luôn mascot 🥫
(lon nước — hình trụ) sang 🧊 trong catalog để tránh gợi ý sai hình.
**QUY TẮC CHỐT**: CẤM TUYỆT ĐỐI hình trụ/hình cầu (không dùng Pi) ở BẤT KỲ dạng bài "diện tích xung
quanh/diện tích toàn phần/thể tích" nào của Lớp 5 sau này — CHỈ hình lập phương + hình hộp chữ
nhật. Pi chỉ được dùng ở đúng 1 dạng bài riêng "Chu vi, diện tích hình tròn" (`generateHinhTron()`
— hình tròn PHẲNG, có trong SGK Toán 5, khác hẳn hình trụ/hình cầu là hình không gian).

### 2. Trạm 6 — "Đặt tính rồi tính" không đủ chỗ đặt tính hàng dọc
Các dạng bài yêu cầu "Đặt tính rồi tính" (cộng/trừ/nhân/chia số thập phân, chia số thập phân nâng
cao, phép chia có dư) trước đây hiển thị 1 DÒNG NGANG DUY NHẤT kiểu `"2.396 : 3 = ___ (dư ___)"` —
học sinh không có chỗ đặt phép tính hàng dọc (chia dài nhiều bước, nhân nhiều chữ số...) vào 1 ô
trống ngắn cuối dòng. Đã sửa: thêm component dùng chung MỚI `GridOLy` trong `WorksheetPreview.jsx`
— khung ô ly (lưới ô vuông nhỏ, mặc định 5 dòng) thay cho `blankBox()` 1 dòng ngang. Áp dụng cho
`PhepChiaCoDuSection`, `SoThapPhanCongTruSection`, `SoThapPhanNhanChiaSection` (dùng chung cho nhân/
chia/chia nâng cao) — mỗi câu giờ hiển thị "đề bài" (KHÔNG còn dấu "=") rồi khung ô ly bên dưới để
nháp. Bản Word (`worksheetExportService.js`) không vẽ được lưới ô ly nên đổi tương ứng: bản học
sinh bỏ dấu "=" hàng ngang + để khoảng trắng rộng hơn phía dưới đề bài viết tay; bản đáp án
(showAnswers=true) vẫn giữ nguyên "= kết quả" đầy đủ (bản giáo viên đối chiếu nhanh, không cần chỗ
đặt tính).
**QUY TẮC CHỐT**: khi đề bài dùng "Đặt tính rồi tính", KHÔNG xuất dấu "=" theo hàng ngang — dùng
khung ô ly (`GridOLy` ở web) hoặc khoảng trắng viết tay (ở Word) thay vào đó.

### 3. Trạm 7 — Tỉ số phần trăm lặp cùng 1 tỉ lệ % ở 2 câu liên tiếp
`generateTiSoPhanTram()` trước đây bốc `p = pick(PERCENTS)` hoàn toàn độc lập mỗi lần, không quan
tâm câu trước đã dùng tỉ lệ % nào — có thể ra 2-3 câu liên tiếp cùng "50%" làm bài mất tính phân
loại. Đã sửa: thêm `pickPercentCandidate()` loại bỏ `lastPercent` (tỉ lệ % của câu THÀNH CÔNG ngay
trước) khỏi danh sách trước khi bốc. **Phát hiện + sửa 1 bug thật qua test** (test ban đầu vẫn FAIL
sau lần sửa đầu): nếu cập nhật `lastPercent` NGAY khi vừa bốc `p` (kể cả khi item đó sau đó bị
`continue` bỏ qua do trùng dedupeKey), item bị huỷ đó vô tình "dùng hộ" 1 tỉ lệ % rồi biến mất, khiến
lần bốc kế tiếp lại được phép quay VỀ ĐÚNG tỉ lệ % của item thành công ngay trước — vẫn ra 2 item
liền kề trong mảng kết quả cùng lặp tỉ lệ %. Sửa đúng: chỉ commit `lastPercent = p` SAU KHI item đã
vượt qua kiểm tra `dedupeKey` và thực sự được `push`.
**QUY TẮC CHỐT**: các câu hỏi phần trăm trong cùng 1 bài phải đa dạng tỉ lệ %, không lặp lại cùng 1
tỉ lệ % ở 2 câu liên tiếp.

### 4. Kiểm thử
- Cập nhật `test/worksheetLop5Dot4.test.js`: đổi test `generateDienTichXqTp` để khẳng định KHÔNG
  BAO GIỜ sinh hình trụ (thay vì test công thức hình trụ cũ); thêm test mới khẳng định
  `generateTiSoPhanTram` không có 2 item liền kề nào cùng tỉ lệ % qua 100 lần sinh.
- Sanity-check độc lập thêm (ngoài bộ test chính thức): 500 lần `generateDienTichXqTp()` không thấy
  hình trụ lần nào; 2000 lần `generateTiSoPhanTram()` — 0 vi phạm lặp tỉ lệ % liền kề.
- `npm test`: **256/256 PASS** (255 cũ + 1 mới, 1 test cũ được viết lại theo quy tắc mới).
  `npm run build`: sạch (exit 0).

---

## PHIÊN 15 — Lớp 5, Đợt 4: 10 dạng bài còn lại (hoàn tất Lớp 5)

**Bối cảnh**: Hoan yêu cầu làm tiếp toàn bộ phần còn lại của Lớp 5 trong 1 lần: tỉ số phần trăm;
hình tam giác/hình thang/hình tròn; thể tích + đơn vị đo thể tích; diện tích xung quanh/toàn phần
hình hộp chữ nhật/lập phương/trụ; số đo thời gian; vận tốc-quãng đường-thời gian; chia có dư/chia
thập phân cho thập phân (nâng cao hơn). Khối lượng lớn (10 dạng bài) nên tách RIÊNG từng dạng thay
vì gộp chung "hình học Lớp 5" mơ hồ — đúng nguyên tắc isolation xuyên suốt dự án, dễ bật/tắt riêng
từng dạng cho giáo viên.

### 1. Quyết định thiết kế quan trọng: KHÔNG vẽ hình (SVG) cho hình học
Tam giác/hình thang/hình tròn/hình hộp/hình trụ đều trình bày bằng MÔ TẢ VĂN BẢN ("Hình tam giác có
đáy 12 cm, chiều cao 8 cm...") thay vì vẽ SVG — đúng phong cách `ChuViDienTichSection` đã có sẵn từ
Lớp 3, và tránh khối lượng công việc vẽ hình rất lớn (5 hình khác nhau) trong khi giá trị sư phạm
tăng thêm không rõ ràng bằng so với "Góc và đơn vị đo góc" (Lớp 4) — dạng đó BẮT BUỘC phải vẽ vì
bài toán chính là "đọc số đo từ hình vẽ", còn ở đây số liệu đã cho sẵn bằng số.

### 2. 10 dạng bài mới (`src/data/worksheetSchemas.js`)
1. **`ti_so_phan_tram`** (Tỉ số phần trăm) — trộn 3 dạng con SGK dạy liên tiếp: tìm tỉ số % của 2
   số, tìm giá trị % của 1 số, tìm 1 số biết giá trị % của nó. Sinh NGƯỢC từ % "đẹp" (bội số của 5)
   × số "đẹp" (bội số của 20) — đảm bảo luôn ra số nguyên tuyệt đối, không cần làm tròn %.
   **Bug thật phát hiện qua test**: pool số "đẹp" ban đầu lẫn 50 và 150 (không phải bội số của 20)
   → tổ hợp (b=150, p=75%) ra 112,5 không nguyên. Đã sửa pool chỉ gồm bội số của 20 đúng nghĩa.
2. **`hinh_tam_giac_hinh_thang`** — diện tích tam giác (~45%), diện tích hình thang (~45%), chu vi
   tam giác (~10%, ôn tập). Chủ động ép đáy×chiều cao luôn CHẴN để diện tích luôn là số nguyên
   (dạng bài này chưa trộn số thập phân — số thập phân đã có 4 dạng bài riêng ở Đợt 1-3/4).
3. **`hinh_tron`** — cho sẵn bán kính hoặc đường kính (luôn số chẵn), hỏi chu vi hoặc diện tích,
   dùng π ≈ 3,14. Viết hàm `piTimesToDecimal()` nhân bằng SỐ NGUYÊN (× 314 rồi ÷ 100) — tránh HOÀN
   TOÀN sai số dấu phẩy động JS, tự rút gọn số 0 vô nghĩa cuối phần thập phân (VD 31,40 → "31,4")
   giống cách SGK trình bày đáp số. Tái dùng `piTimesToDecimal()` cho cả hình trụ ở mục 5.
4. **`the_tich_hhcn_lp`** — thể tích hình hộp chữ nhật (dài×rộng×cao) và lập phương (cạnh³), số đo
   nhỏ (3-15 cm) đúng phạm vi luyện tập SGK.
5. **`doi_don_vi_the_tich`** — đổi đơn vị m³↔dm³↔cm³ (tỉ lệ 1000). Tách RIÊNG khỏi bảng đơn vị
   dung tích (l/ml) của Lớp 3 — thể tích và dung tích là 2 khái niệm khác nhau dù có liên hệ.
6. **`dien_tich_xq_tp`** — trộn 3 hình (HHCN/lập phương/hình trụ), mỗi hình random hỏi xung quanh
   hoặc toàn phần. Hình trụ: nhân π MỘT LẦN DUY NHẤT cho cả tổng (Sxq = π×2rh, Stp = π×(2rh+2r²))
   thay vì nhân π riêng cho từng số hạng rồi cộng — tránh cộng dồn sai số làm tròn giữa 2 lần nhân.
7. **`so_do_thoi_gian`** — cộng/trừ giờ-phút (chưa làm giây). Phép trừ LUÔN đảm bảo số bị trừ ≥ số
   trừ (tự hoán đổi nếu random ngược, cùng nguyên tắc phép trừ số thập phân ở Đợt 2).
8. **`van_toc_quang_duong_thoi_gian`** — toán chuyển động đều v=s:t. Sinh NGƯỢC từ v và t "đẹp" rồi
   NHÂN ra s — đảm bảo khi hỏi ngược lại t (từ v và s) luôn chia hết tuyệt đối, không ra thập phân.
9. **`phep_chia_co_du`** — ôn tập nâng cao (số bị chia 100-9999, lớn hơn hẳn "bảng chia" Lớp 3),
   CỐ Ý luôn có dư (cộng thêm 1-vài đơn vị nếu random ra chia hết).
10. **`so_thap_phan_chia_nang_cao`** — mảng còn thiếu của Đợt 3: trộn (a) chia SỐ TỰ NHIÊN cho SỐ
    TỰ NHIÊN ra THƯƠNG THẬP PHÂN (~40%) và (b) chia SỐ THẬP PHÂN cho SỐ THẬP PHÂN (~60%, khó hơn).
    Tái dùng `decimalToNormalized()`/`normalizedToDecimal()` — sinh NGƯỢC y hệt nguyên tắc
    `generateSoThapPhanNhan()` (Đợt 3): thương "đẹp" × số chia = số bị chia, chỉ đổi vai trò hiển
    thị (phép NHÂN lúc sinh → phép CHIA lúc hiển thị đề) — chia hết tuyệt đối 100%.

### 3. Preview web (`WorksheetPreview.jsx`) + Export Word (`worksheetExportService.js`)
- **`WordProblemBlankSection`** (web) / **`buildWordProblemBlankParagraphs()`** (Word): component
  DÙNG CHUNG cho 6/10 dạng bài có cùng khuôn "câu văn mô tả đề bài + Bài giải: ô trống + đơn vị"
  (tỉ số phần trăm, tam giác/hình thang, hình tròn, thể tích, diện tích xq/tp, vận tốc) — nhận vào
  hàm `describe(it)` riêng cho mỗi dạng để build câu văn, tránh viết lặp lại 6 component gần giống
  hệt nhau (đúng nguyên tắc tái dùng đã áp dụng cho `SoThapPhanNhanChiaSection` ở Đợt 3).
- **`doi_don_vi_the_tich`** tái dùng THẲNG `DoiDonViSection`/`buildDoiDonViParagraphs()` (Lớp 3) —
  đúng cùng hình dạng dữ liệu (`value/fromUnit/toUnit`), không viết lại.
- **`so_thap_phan_chia_nang_cao`** tái dùng THẲNG `SoThapPhanNhanChiaSection`/
  `buildSoThapPhanNhanChiaParagraphs()` (Lớp 5 Đợt 3) — đúng cùng hình dạng dữ liệu.
- **`so_do_thoi_gian`** và **`phep_chia_co_du`** cần component RIÊNG (2 ô trống mỗi bài, khác khuôn
  "1 phép tính = 1 ô trống" của các dạng khác): `SoDoThoiGianSection`/`buildSoDoThoiGianParagraphs()`
  (ô trống giờ + ô trống phút) và `PhepChiaCoDuSection`/`buildPhepChiaCoDuParagraphs()` (ô trống
  thương + ô trống dư).

### 4. `worksheetGenerator.js` (tầng orchestrator)
Thêm 10 case mới vào `buildSimpleSection()`, xếp vào `DEFAULT_SECTION_ORDER` ngay sau
`so_thap_phan_chia` (Đợt 3) theo ĐÚNG thứ tự chủ đề PPCT SGK Toán 5 KNTT: chia nâng cao → chia có
dư → tỉ số % → hình học → đo lường/vận tốc, vẫn xếp TRƯỚC `giai_toan` (AI luôn cuối cùng). Không
cần sửa `safeCounts`/`WorksheetForm.jsx` vì cả 2 đều đã tự động lấy dữ liệu từ
`getSelectableCatalogFor()` (catalog-driven, thiết kế từ các đợt trước).

**Đã kiểm thử**: `test/worksheetLop5Dot4.test.js` (16 test mới) — đáp án mỗi dạng bài tính lại ĐỘC
LẬP bằng công thức toán thông thường (không gọi lại logic nội bộ generator), chạy lặp 100-300 lần
mỗi test để phủ hết các nhánh ngẫu nhiên (VD "tỉ số %" đủ cả 3 dạng con, "chia nâng cao" đủ cả 2
dạng con). Xác nhận: dạng bài chỉ lộ đúng khối Lớp 5 (không lộ Lớp 1-4); công thức tam giác/hình
thang/HHCN/lập phương/thể tích/diện tích xq-tp đúng; phép nhân π bằng số nguyên (`piTimesToDecimal`)
khớp kết quả tính tay; số đo thời gian cộng/trừ không bao giờ âm; v×t=s luôn đúng; phép chia có dư
luôn thực sự có dư (0 < dư < số chia); chia nâng cao chia hết tuyệt đối. `npm test`: 255/255 PASS
(239 cũ + 16 mới). `npm run build`: sạch.

### Lớp 5 hiện đã ĐẦY ĐỦ 14 dạng bài (Đợt 1-4)
Còn lại chỉ là tinh chỉnh sau phản hồi thực tế từ giáo viên (xem "Còn lại cho Lớp 5" trong
`NEXT_STEPS.md`): cân nhắc "giải toán có lời văn tổng hợp" bằng AI phối hợp nhiều chủ đề, gói chủ
đề (`worksheetTopicPackages.js`), và chế độ in Đen trắng (để dành từ các đợt trước).

## PHIÊN 14 — Lớp 5, Đợt 3: Nhân số thập phân + Chia số thập phân cho số tự nhiên

**Bối cảnh**: Hoan yêu cầu làm tiếp Lớp 5, chọn đúng hướng đã đề xuất cuối Phiên 13: nhân/chia số
thập phân.

### 1. "Nhân số thập phân" (`so_thap_phan_nhan`)
Trộn 2 mức độ: **nhân với số tự nhiên** (~65%, thừa số tự nhiên 2-9 kiểu "bảng nhân", mức cơ bản
SGK dạy trước) và **nhân 2 số thập phân với nhau** (~35%, mức nâng cao hơn). Số chữ số thập phân
của TÍCH = TỔNG số chữ số thập phân của 2 thừa số — đúng quy tắc SGK Toán 5 KNTT. Tính bằng cách
quy MỖI thừa số về số nguyên theo ĐÚNG width riêng của nó rồi nhân 2 số nguyên (tái dùng
`decimalToNormalized()`/`normalizedToDecimal()` đã viết ở Đợt 2, nhưng dùng cho mục đích khác:
Đợt 2 quy 2 số về 1 width CHUNG để cộng/trừ thẳng hàng; Đợt 3 giữ width RIÊNG từng thừa số rồi
CỘNG 2 width lại làm width của tích) — tránh hoàn toàn sai số dấu phẩy động JS. Số tự nhiên biểu
diễn qua `rightDec = ""` (decimals=0), `formatSoThapPhan()` tự hiểu là số nguyên không dấu phẩy.

### 2. "Chia số thập phân cho số tự nhiên" (`so_thap_phan_chia`)
Phiên bản **chia hết tuyệt đối** (không dư) — chưa làm "chia có dư"/"chia số thập phân cho số
thập phân" (để dành đợt sau). Sinh NGƯỢC: chọn THƯƠNG "đẹp" trước rồi nhân lên ra SỐ BỊ CHIA, đảm
bảo chia hết 100% không cần thử-sai — cùng nguyên tắc `generateNhanChiaBang()` (Lớp 3) đã dùng
cho phép chia hết số tự nhiên trong bảng cửu chương.

### 3. Preview web + Export Word — dùng CHUNG 1 component/1 hàm cho cả 2 dạng bài
`SoThapPhanNhanChiaSection` (web) và `buildSoThapPhanNhanChiaParagraphs()` (Word) — vì "nhân" và
"chia" có CÙNG hình dạng dữ liệu (`leftInt/leftDec/rightInt/rightDec/operator/answerInt/answerDec`)
như "Cộng, trừ" ở Đợt 2, chỉ khác operator và cách sinh số. Tránh viết lặp lại logic hiển thị.

**Đã kiểm thử**: `test/worksheetLop5Dot3.test.js` (8 test mới) — đáp án tính lại ĐỘC LẬP bằng phép
nhân/chia Number thường (làm tròn theo đúng số chữ số thập phân kỳ vọng để né sai số dấu phẩy
động), xác nhận: số chữ số thập phân của tích = tổng 2 thừa số; phép chia luôn chia hết tuyệt đối
(kiểm bằng modulo trên số nguyên quy đổi); số chia luôn 2-9; không trùng lặp phép tính; dạng bài
chỉ lộ đúng khối Lớp 5. Đã sanity-check end-to-end qua `generateWorksheet()` thật (không chỉ test
generator riêng lẻ), xác nhận vài phép tính mẫu đúng toán học (VD "49,51 × 6,2 = 306,962",
"118,50 ÷ 5 = 23,70"). `npm test`: 240/240 PASS (232 cũ + 8 mới). `npm run build`: sạch.

### Còn lại cho Lớp 5
Tỉ số phần trăm; hình tam giác/hình thang/hình tròn (chu vi/diện tích); thể tích + đơn vị đo thể
tích (cm³/dm³); diện tích xung quanh/toàn phần hình hộp chữ nhật/lập phương/trụ; số đo thời gian;
vận tốc-quãng đường-thời gian (toán chuyển động đều); "chia có dư"/"chia số thập phân cho số thập
phân" (nâng cao hơn "chia hết tuyệt đối" đã làm ở Đợt 3, cân nhắc làm sau khi có phản hồi thực tế
từ giáo viên về mức độ hiện tại).

## PHIÊN 13 — Backfill tài liệu Lớp 5 Đợt 1 + Lớp 5 Đợt 2 (Cộng, trừ số thập phân)

**Bối cảnh**: Hoan yêu cầu "làm tiếp lớp 5". Rà soát code thật trước khi code (đúng nguyên tắc
"Audit before building") phát hiện `NEXT_STEPS.md` vẫn ghi "Trạng thái Lớp 5 (Toán) — CHƯA BẮT
ĐẦU", nhưng code thực tế **đã có sẵn** Lớp 5 Đợt 1 hoàn chỉnh (`WORKSHEET_GRADES.LOP_5`,
`GRADE_ORDER` đã thêm `LOP_5`, `formatSoThapPhan()`, dạng bài "So sánh số thập phân"
`so_thap_phan_so_sanh` nối đủ 4 tầng, kèm `test/worksheetLop5Dot1.test.js` 8 test) — lặp lại đúng
kiểu lệch tài liệu đã gặp ở PHIÊN 10 (tính năng "Thu thập số liệu" Lớp 3). Không rõ được code ở
phiên chat nào trước đó chưa cập nhật lại `NEXT_STEPS.md`.

### 1. Backfill tài liệu cho Lớp 5 Đợt 1 (không đổi code, chỉ cập nhật NEXT_STEPS.md cho khớp thực tế)
Xác nhận qua code + chạy test rằng Lớp 5 Đợt 1 ("So sánh số thập phân") đã hoàn chỉnh, nối đủ 4
tầng (catalog/generator/preview/export Word), có test tự động riêng, `npm test` xanh. Cập nhật
lại mục "Trạng thái Lớp 5 (Toán)" trong `NEXT_STEPS.md` từ "CHƯA BẮT ĐẦU" thành đúng thực tế.

### 2. Lớp 5, Đợt 2 — dạng bài mới "Cộng, trừ số thập phân" (`so_thap_phan_cong_tru`)
Nối đủ 4 tầng theo đúng khuôn Đợt 1:
- **Catalog** (`worksheetExerciseCatalog.js`): `minGrade=maxGrade=LOP_5`, `skillGroup:
  "so_thap_phan"` (cùng nhóm với "So sánh số thập phân").
- **Generator** (`worksheetSchemas.js`, hàm `generateSoThapPhanCongTru()`): cho phép 2 số có SỐ
  CHỮ SỐ THẬP PHÂN KHÁC NHAU (VD "3,4 + 5,72") — đúng trọng tâm SGK Toán 5 KNTT (học sinh phải tự
  nhận ra cần thêm số 0 khi đặt tính cột dọc). Toàn bộ phép cộng/trừ quy đổi qua SỐ NGUYÊN (nhân
  `10^width`) trước khi tính rồi mới quy đổi ngược — tránh HOÀN TOÀN sai số dấu phẩy động JS,
  cùng nguyên tắc `generateSoThapPhanSoSanh()` đã dùng ở Đợt 1. Phép trừ luôn đảm bảo số bị trừ >=
  số trừ (tự hoán đổi toán hạng nếu random ra ngược, né riêng trường hợp kết quả = 0).
- **Preview web** (`WorksheetPreview.jsx`, `SoThapPhanCongTruSection`): lưới 2 cột "a op b = ___",
  cùng bố cục `TinhNhamSection` của các khối số tự nhiên, dùng `formatSoThapPhan()` theo đúng số
  chữ số thập phân gốc từng toán hạng.
- **Export Word** (`worksheetExportService.js`, `buildSoThapPhanCongTruParagraphs()`): cùng khuôn
  `buildTinhNhamParagraphs()`, đáp án ghép từ `answerInt`/`answerDec` đã tính sẵn (không tính lại
  bằng phép cộng Number thô để tránh sai số).

**Đã kiểm thử**: `test/worksheetLop5Dot2.test.js` (7 test mới) — đáp án tính lại ĐỘC LẬP bằng
`toFixed(2)` (không gọi lại logic quy đổi số nguyên bên trong generator, giống cách Đợt 1 đã kiểm
chứng), xác nhận phép trừ không ra số âm/kết quả 0, không trùng lặp phép tính, dạng bài chỉ lộ ra
đúng khối Lớp 5. Đã chạy sanity-check end-to-end qua `generateWorksheet()` thật (không chỉ test
generator riêng lẻ) — xác nhận 3 phép tính mẫu đúng toán học. `npm test`: 232/232 PASS (225 cũ +
7 mới). `npm run build`: sạch (exit 0).

### Còn lại cho Lớp 5 (theo catalog đã xác nhận SGK KNTT trong `NEXT_STEPS.md`)
Nhân/chia số thập phân; tỉ số phần trăm; hình tam giác/hình thang/hình tròn (chu vi/diện tích);
thể tích + đơn vị đo thể tích (cm³/dm³); diện tích xung quanh/toàn phần hình hộp chữ nhật/lập
phương/trụ; số đo thời gian; vận tốc-quãng đường-thời gian (toán chuyển động đều). Cân nhắc "gói
chủ đề" Lớp 5 (`worksheetTopicPackages.js`) sau khi có thêm vài dạng bài nữa (hiện mới 2/nhiều).

## PHIÊN 12 — Sửa lỗi "Phiên đăng nhập đã hết" (chế độ public) + Lớp 4 Đợt 2

**Bối cảnh**: Hoan test thực tế thấy lỗi "Phiên đăng nhập đã hết, vui lòng tải lại trang" khi bấm
"Tạo phiếu bài tập" (có ảnh chụp màn hình kèm theo), đồng thời yêu cầu làm tiếp Lớp 4 (góc & đơn
vị đo góc, biểu thức chữ, phân số nâng cao) và toàn bộ Lớp 5.

### 1. Sửa lỗi "Phiên đăng nhập đã hết" hiện SAI trong chế độ public
**Nguyên nhân thật (đã xác nhận qua code, KHÔNG phải lỗi hiểu nhầm)**: web đang chạy ở chế độ
công khai (`NEXT_PUBLIC_DISABLE_LOGIN` mặc định = public kể từ PHIÊN 11), nên `page.js` tự gán
"phiên test" và KHÔNG hiện màn hình đăng nhập — nhưng cả 4 form (`WorksheetForm.jsx`,
`OutlineForm.jsx`, `ExamMatrixForm.jsx`, `LessonPlanForm.jsx`) đều tự gọi thẳng `getSession()`
(đọc localStorage) trước khi gửi request rồi CHẶN request nếu không có session. Ở chế độ public,
giáo viên không bao giờ đăng nhập nên localStorage không bao giờ có session -> mọi lượt "Tạo
phiếu bài tập"/"Tạo đề"/"Soạn giáo án"/"Tạo đề cương" (và cả upload file mẫu) đều bị chặn ngay
trên trình duyệt, dù server (`apiAuth.js`) đã bỏ qua xác thực từ trước.

**Sửa**: thêm `DISABLE_LOGIN`/`TEST_SESSION`/`getEffectiveSession()` DUY NHẤT 1 nơi trong
`src/services/authService.js` (cùng logic với `apiAuth.js`) - trả về session test cố định ngay
khi đang public (không cần đọc localStorage), hoặc `getSession()` như cũ khi đăng nhập vẫn bật.
Đổi cả 4 form sang dùng `getEffectiveSession()` thay vì `getSession()` trần ở đúng chỗ dùng để
chặn submit + lấy `username` gửi kèm request. Đồng bộ hoá `page.js` để import `DISABLE_LOGIN`/
`TEST_SESSION` từ `authService.js` thay vì khai lại (tránh lệch nhau lần sau).

### 2. Lớp 4, Đợt 2 — 3 dạng bài mới (nối đủ 4 tầng: catalog → generator → preview → export Word)
Đúng mạch nội dung SGK Toán 4 KNTT đã xác nhận trong NEXT_STEPS.md ("Catalog Toán Lớp 3-5"):
- **`bieu_thuc_chu`** ("Biểu thức chữ") — biểu thức 1-2 bước tính với 1 chữ `a`, cho giá trị `a`,
  học sinh tính kết quả. `generateBieuThucChu()` trong `worksheetSchemas.js`. **Bug thật phát
  hiện qua sanity-check 5000 lượt** (không phải chỉ lý thuyết): khi giá trị tạm thời về 0 giữa 2
  bước tính, nhánh trừ cũ vẫn ép trừ tiếp -> ra kết quả ÂM (VD "a - 6 - 1" khi a=6 -> -1, sai vì
  Lớp 4 chưa học số âm). Đã sửa: loại hẳn phép trừ khỏi lựa chọn khi giá trị tạm <= 0.
- **`phan_so_so_sanh`** ("So sánh phân số") — so sánh 2 phân số (nhánh cùng mẫu/cùng tử), tính
  đáp án bằng so sánh chéo (n1×d2 vs n2×d1) nên ĐÚNG toán học trong mọi trường hợp. Khác
  `phan_so_rut_gon` (đã có từ Đợt 1, dạng RÚT GỌN chứ không phải SO SÁNH).
- **`goc_nhan_biet`** ("Góc và đơn vị đo góc") — CHỈ yêu cầu nhận biết/phân loại góc (nhọn/vuông/
  tù/bẹt) theo số đo cho sẵn, KHÔNG yêu cầu tự đo bằng thước đo góc (dụng cụ vật lý, không phù
  hợp phiếu tự động). Bản web (`AngleFigure` trong `WorksheetPreview.jsx`) vẽ 2 tia bằng SVG theo
  đúng số đo (không hiện số bằng chữ, buộc học sinh quan sát hình). Bản Word (không vẽ được SVG,
  giống cách "Xem đồng hồ" đã xử lý trước đây) mô tả góc bằng SỐ ĐO trực tiếp thay vì hình vẽ.

`blankBox()` (WorksheetPreview.jsx) thêm tham số `minWidth` tuỳ chọn (mặc định vẫn 64px như cũ,
không đổi hành vi các dạng bài khác) để dùng ô hẹp hơn cho dấu so sánh phân số.

### Đã tự verify
- Sanity-check thủ công 5000 lượt/dạng bài (tự tính lại đáp án bằng công thức ĐỘC LẬP với
  generator, không gọi lại chính hàm đang test) - phát hiện + sửa đúng 1 bug thật (mục trên).
- Test tự động MỚI `test/worksheetLop4Dot2.test.js` (10 test, cùng nguyên tắc tính lại đáp án độc
  lập như `worksheetTachGop.test.js`).
- `npm test`: 213/213 PASS (203 cũ + 10 mới). `npm run build`: sạch, không lỗi.
- Test end-to-end thật qua `generateWorksheet({ grade: "LOP_4", exerciseCounts: {...} })` (không
  phải chỉ test generator riêng lẻ) - xác nhận cả 4 dạng bài Lớp 4 (`phan_so_rut_gon`,
  `bieu_thuc_chu`, `phan_so_so_sanh`, `goc_nhan_biet`) chạy đúng qua orchestrator thật, đúng thứ
  tự `DEFAULT_SECTION_ORDER`, đúng cấu trúc dữ liệu từng section.
- **CHƯA chạy thử thực tế trên trình duyệt** (môi trường code không có UI) - Hoan cần tự kéo về
  bấm thử, đặc biệt xem hình vẽ góc (SVG) hiển thị đúng tỷ lệ trên nhiều kích thước màn hình.

### CHƯA làm (để lại cho phiên sau)
- **Toàn bộ Lớp 5** — khối lượng rất lớn (số thập phân, tỉ số phần trăm, hình tam giác/thang/
  tròn, thể tích, vận tốc-quãng đường-thời gian...), CHƯA bắt đầu, cần tách thành nhiều đợt như
  Lớp 3/Lớp 4 đã làm. Xem mục "Catalog Toán Lớp 3-5" trong NEXT_STEPS.md để biết nội dung cần.
- "Giải toán 3 bước tính" (Lớp 4) — có thể chỉ cần mở rộng prompt AI của `giai_toan`, chưa kiểm
  tra thực tế.
- "Dãy số liệu thống kê" mở rộng từ Lớp 3 lên Lớp 4 — chưa xem lại generator có cứng số liệu Lớp
  3 hay không.
- Gói chủ đề Lớp 4 (`worksheetTopicPackages.js`) — giờ đã có 4 dạng bài Lớp 4, đủ để cân nhắc
  thêm gói chủ đề như Lớp 1/Lớp 3.



**Bối cảnh**: Hoan yêu cầu 3 việc trong 1 lượt: (1) tắt hẳn màn hình đăng nhập, cho truy cập công
khai (giữ nguyên cơ chế, có thể bật lại sau); (2) báo lỗi "không thể bấm chọn chức năng" kèm ảnh
chụp nút "Chủ đề SGK (tuỳ chọn)"; (3) làm tiếp Lớp 4 và Lớp 5.

### 1. Public mặc định (đảo mặc định `NEXT_PUBLIC_DISABLE_LOGIN`)
Trước đây: mặc định (không đặt biến) = yêu cầu đăng nhập; phải CHỦ Ý đặt `=true` mới công khai.
Vấn đề: Vercel production thường KHÔNG có sẵn biến `NEXT_PUBLIC_DISABLE_LOGIN` trong cấu hình, nên
trang thật vẫn bị chặn đăng nhập dù ý định là công khai ngay từ đầu.
Sửa: đảo điều kiện thành `process.env.NEXT_PUBLIC_DISABLE_LOGIN !== "false"` ở CẢ 2 nơi
(`src/services/apiAuth.js` phía server, `src/app/page.js` phía client) - giờ mặc định (không đặt
gì) = công khai; muốn bật lại đăng nhập chỉ cần đặt biến này = `"false"` trên Vercel rồi deploy
lại, không đổi code. Cơ chế đăng nhập cũ (username/password, session token HMAC...) giữ nguyên
100%, chỉ đổi giá trị mặc định của cờ bật/tắt. Đã cập nhật `.env.local.example` khớp (mặc định
`true`, kèm cảnh báo cách bật lại).

### 2. Sửa lỗi UX nút "Chủ đề SGK (tuỳ chọn)"
Điều tra: trace toàn bộ chuỗi `WorksheetForm.jsx` → `worksheetTopicPackages.js` →
`worksheetExerciseCatalog.js` - xác nhận `applyTopicPackage()` cập nhật ĐÚNG `exerciseCounts`, các
exerciseKeys trong gói đều khớp key thật trong catalog. KHÔNG có lỗi logic. Lỗi thực tế: bấm nút
không có bất kỳ phản hồi thị giác nào (không đổi màu, không cuộn tới, không có dấu hiệu "đã bật")
nên giáo viên tưởng nút không hoạt động dù bên dưới đã đổi số lượng đúng.
Sửa trong `WorksheetForm.jsx`:
- Thêm `exerciseListRef` (gắn vào khu vực "Chọn dạng bài + số lượng") + `flashKeys` state - bấm
  nút chủ đề -> tự cuộn mượt tới khu vực đó, các dòng dạng bài vừa được bật đổi màu nền
  xanh nhạt trong ~1.5s rồi tự tắt (dùng CSS transition, không cần thư viện animation).
- Thêm `isTopicPackageApplied(topic)` - tính TOÀN BỘ exerciseKeys của gói có count > 0 hay không,
  tính LẠI mỗi lần render từ `exerciseCounts` thật (không phải cờ tạm lưu lúc bấm) - nút tự đổi
  màu xanh đặc (`bg-teal-600`) + icon `CheckCircle2` khi gói đã được áp dụng, tự đổi lại màu nhạt
  nếu giáo viên tự xoá hết số lượng sau đó. Cách này ĐÚNG kể cả sau khi đổi khối lớp/tải lại trang
  (state được suy ra từ dữ liệu thật, không phụ thuộc lịch sử thao tác).

### 3. Mở Lớp 4, Đợt 1
Theo đúng khuôn mẫu đã dùng khi mở Lớp 3 (xem PHIÊN cũ hơn, mục "MỞ RỘNG LỚP 3 ĐỢT 1"):
- `src/data/worksheetSchemas.js`: thêm `WORKSHEET_GRADES.LOP_4 = { maxNumber: 1000000 }`. Mở rộng
  `generateTinhNham()`: nhánh "số tròn theo hàng" (đã có cho LOP_3) giờ áp dụng CẢ LOP_3 và LOP_4,
  thêm hàng `100000` vào `magnitudePool` (tự lọc theo `max` nên không cần nhánh code riêng cho
  LOP_4). `generateDaySo()`: thêm bước nhảy `[1000, 10000, 100000]` cho LOP_4 (LOP_3 vẫn
  `[10,100,1000]`). `generateNoiPhepTinh()`: cap riêng `10000` cho LOP_4 (LOP_3 vẫn `1000`) - giữ
  đúng tính "nhẩm được", không đặt tính cột dọc số quá lớn.
- `src/data/worksheetExerciseCatalog.js`: thêm `"LOP_4"` vào cuối `GRADE_ORDER`. Mở `maxGrade` từ
  `"LOP_3"` lên `"LOP_4"` cho 6 entries: `tinh_nham`, `so_sanh`, `day_so`, `sap_xep_thu_tu`,
  `noi_phep_tinh`, `giai_toan` (đều là dạng bài "kỹ năng chung" không cần logic mới cho việc mở
  khối, chỉ dùng thẳng `WORKSHEET_GRADES[grade].maxNumber` sẵn có).
- `src/data/constants.js`: thêm `WORKSHEET_GRADE_TO_SGK_GRADE.LOP_4 = "4"` - dùng chung kho GitHub
  knowledge repo với tính năng "Đề kiểm tra" (Exam Generator), nơi Lớp 4 đã được hỗ trợ từ trước
  (xem `src/data/gradeProfiles.js`) - suy luận hợp lý nhưng **CHƯA XÁC NHẬN THỰC TẾ** kho GitHub có
  đúng thư mục "4" hay không (sandbox không truy cập được kho đó để kiểm tra trực tiếp).
- `src/components/WorksheetForm.jsx`: thêm `{ value: "LOP_4", label: "Lớp 4" }` vào mảng `GRADES`.

**Dạng bài mới: "Rút gọn phân số" (`phan_so_rut_gon`)** — riêng Lớp 4 (`minGrade`=`maxGrade`=
`LOP_4`), nối đủ 4 tầng:
- `worksheetSchemas.js`: `generatePhanSoRutGon(count)` - chọn 1 phân số tối giản có sẵn trong kho
  `SIMPLE_FRACTIONS` (mẫu số 2-9), nhân cả tử/mẫu với hệ số ngẫu nhiên 2-6 để ra đề bài (phân số
  chưa tối giản), đáp án là phân số gốc. Có chống trùng trong cùng 1 lượt sinh (`used` Set).
- `worksheetExerciseCatalog.js`: entry mới `phan_so_rut_gon`, `skillGroup: "phan_so"`, 3 câu lệnh
  đề bài xen kẽ, mascot 🍕🍰🧩.
- `worksheetGenerator.js`: import `generatePhanSoRutGon`, thêm vào `DEFAULT_SECTION_ORDER` (ngay
  sau `thu_thap_so_lieu`, trước `nhan_dien_hinh`), thêm `case "phan_so_rut_gon"` trong switch.
- `WorksheetPreview.jsx`: component mới `PhanSoRutGonSection` - hiển thị dạng chữ "tử/mẫu = ☐"
  (CHỦ Ý CHƯA dựng layout phân số nằm ngang có gạch ngang - giữ đơn giản cho đợt mở khối đầu
  tiên, giống cách "Xem đồng hồ giờ phút" từng dùng text cho bản Word ở Lớp 3 Đợt 2).
- `worksheetExportService.js`: hàm mới `buildPhanSoRutGonParagraphs` - 2 cột/dòng như `doi_don_vi_do`,
  bản đáp án hiện `tử/mẫu = tử_gốc/mẫu_gốc`, bản học sinh hiện `tử/mẫu = ☐`.

**Đã kiểm thử:**
- `npm test`: 203/203 PASS (bộ test HIỆN CÓ - chưa viết test riêng cho các thay đổi Phiên 11, xem
  mục "Cần Hoan test" trong `NEXT_STEPS.md`).
- `npm run build`: sạch, exit code 0.
- Script sanity-check độc lập (chạy tay, KHÔNG nằm trong bộ test chính thức `test/*.test.js`) xác
  nhận: `generatePhanSoRutGon(8)` luôn rút gọn đúng toán học (kiểm bằng UCLN độc lập); `GRADE_ORDER`
  và `WORKSHEET_GRADES.LOP_4` đúng như thiết kế; `getSelectableCatalogFor("LOP_4","TOAN")` trả đúng
  7 dạng bài (6 dạng mở rộng + `phan_so_rut_gon`); `generateTinhNham("LOP_4",...)` ra số tròn hàng
  hợp lý (VD `38000 - 12000`, `300000 - 100000`); `generateDaySo`/`generateNoiPhepTinh` cho LOP_4
  đều nằm đúng phạm vi đã thiết kế.
- **CHƯA chạy `npm run dev` thực tế trên trình duyệt** (môi trường sandbox không có UI trình
  duyệt để bấm thử) - Hoan cần tự kéo về chạy thử, đặc biệt: dropdown "Chủ đề SGK theo bài" cho
  Lớp 4 (phụ thuộc kho GitHub, xem lưu ý ở trên), và hiệu ứng cuộn/chớp sáng của nút "Chủ đề SGK".

---

# AI Exam Generator — Tóm tắt dự án (bản cập nhật sau khi rà soát tổng thể "việc dở dang" theo yêu
# cầu giáo viên, phiên 10)

## 0.-8. MỚI NHẤT — Rà soát tổng thể "việc dở dang" theo yêu cầu giáo viên (phiên 10): 4 việc kỹ
## thuật + 2 việc hạ tầng bị thiếu, cộng thêm phát hiện quan trọng về tài liệu bị lệch với code

**Bối cảnh**: giáo viên yêu cầu "rà soát lại những việc đang còn dang dở, những lỗi... để hoàn
thiện hơn" — không có báo lỗi cụ thể nào, nên đã tự chủ động: cài `npm install` + chạy thật
`npm test`/`npm run build` trong sandbox có mạng, đối chiếu `NEXT_STEPS.md`/`PROJECT_SUMMARY.md`
với code thật, rồi báo cáo phát hiện trước khi sửa (giáo viên duyệt làm cả 4 việc kỹ thuật).

### Phát hiện quan trọng nhất: tài liệu bị lệch sau so với code — "GIAI ĐOẠN F"

`PROJECT_SUMMARY.md`/`NEXT_STEPS.md` (sửa lần cuối trước phiên 10) hoàn toàn KHÔNG nhắc đến 1 đợt
việc đã code XONG HẲN cho "Phiếu bài tập": dạng bài mới **"Tách - Gộp số"** (number bond, Lớp 1),
tính năng **"Storytelling theme"** (giáo viên tự nhập 1 chủ đề xuyên suốt cả phiếu qua
`storytellingTheme`), và dạng bài đếm/điền **ngày trong tuần** (`generateDaySo`/`daySoDifficulty`).
Đã kiểm tra: cả 3 tính năng này nối dây ĐẦY ĐỦ (catalog `worksheetExerciseCatalog.js`/
`worksheetSchemas.js` → `worksheetGenerator.js` → `worksheetExportService.js` →
`WorksheetPreview.jsx`/`WorksheetForm.jsx`), có test riêng (`test/worksheetTachGop.test.js` và các
test khác), TẤT CẢ ĐỀU PASS trước khi phiên 10 bắt đầu — tức đây KHÔNG phải code dở dang, chỉ là
tài liệu tiến độ chưa cập nhật theo kịp. Đã ghi nhận lại đầy đủ trong `NEXT_STEPS.md` (mục "Chưa
quyết") để không ai nhầm tưởng "Phiếu bài tập" vẫn còn dở như ghi chú cũ.

### Việc #1 — Test tự động cho `reportCommentHistoryStore.js` (nốt phần còn lại của Việc #8 cũ)

Thêm `test/reportCommentHistoryStore.test.js` (11 test, nhánh file JSON local — giống ghi chú
"nhánh Upstash dùng chung logic" ở các test store khác): `summarizeCommentForHistory()` gộp/lọc
trường rỗng đúng; lưu/đọc lại đúng nội dung; comment rỗng không lưu; lưu nhiều lần trả về bản MỚI
NHẤT; `getFullCommentHistory()` trả đúng thứ tự mới→cũ; cắt đúng tối đa 6 bản ghi/học sinh
(`MAX_HISTORY_PER_STUDENT`); 2 học sinh trùng tên khác lớp không lẫn lịch sử; và **quan trọng
nhất — test TTL 1 giờ** (`MAX_HISTORY_AGE_MS`): ghi thẳng 1 bản ghi có `savedAt` giả lập quá hạn
61 phút vào file JSON local (mô phỏng "cơ chế xoá sớm 2 lớp" đã có sẵn trong module), xác nhận bị
lọc bỏ hoàn toàn khỏi cả `getPreviousComment()` lẫn `getFullCommentHistory()`; ngược lại bản ghi
mới 59 phút (còn trong hạn) vẫn được trả về bình thường.

### Việc #2 — Test tự động cho `buildParentFriendlyReportSections()`

Thêm `test/reportCommentExportService.test.js` (9 test): đủ 3 mục Phẩm chất/Năng lực/Nhận xét
chung + môn học cho Tiểu học; nhãn hiển thị THÂN THIỆN ("Về phẩm chất"...), không lộ tên trường kỹ
thuật thô (`phamChat`...); cấp THCS/THPT ra đúng `circularLabel` riêng (Thông tư 22/2021 thay vì
27/2020); bỏ qua phần tử lỗi/không có comment, trường/môn học rỗng; giữ đúng thứ tự nhiều học
sinh; `lop` thiếu trả về chuỗi rỗng (không phải `undefined`); `cap` không hợp lệ không throw.

### Việc #3 — Mở rộng quy tắc số thập phân/đơn vị đo kiểu Việt Nam

- **Đề kiểm tra** (`src/data/promptTemplates.js`, `buildBaseRules()`): bổ sung đúng 2 quy tắc đã
  có ở Đề cương ôn tập (dấu phẩy thập phân, ký hiệu số mũ trên `km²`/`m²`), CỘNG THÊM 1 quy tắc
  MỚI mà Đề cương ôn tập chưa cần vì không xuất công thức LaTeX phức tạp bằng: môn Toán ở Đề kiểm
  tra dùng LaTeX (`$...$`) cho công thức, mà dấu phẩy thường `,` trong LaTeX bị hiểu là ký tự phân
  cách danh sách, tạo khoảng trắng thừa quanh số thập phân (VD `$15,6$` hiển thị lệch) — nên bổ
  sung hướng dẫn riêng: viết dấu phẩy trong cặp ngoặc nhọn `{,}` (VD `15{,}6`) khi ở trong LaTeX.
  Áp dụng cho MỌI môn (không chỉ Toán) vì `buildBaseRules()` dùng chung cho tất cả. Test khoá lại:
  `test/promptTemplatesVietnameseFormatting.test.js` (4 test).
- **Phiếu bài tập**: đã RÀ SOÁT và xác nhận KHÔNG áp dụng — catalog hiện chỉ hỗ trợ Lớp 1-2
  (`maxGrade` cao nhất trong `worksheetExerciseCatalog.js` là `"LOP_2"`), chương trình Toán Lớp 1-2
  chưa dạy số thập phân lẫn đơn vị đo có số mũ (không có dạng bài diện tích/thể tích nào trong
  catalog) — thêm quy tắc này vào sẽ chỉ gây nhiễu prompt không cần thiết. Ghi chú lý do ngay
  trong file test để phiên sau không hiểu nhầm đây là việc còn sót.

### Việc #4 — Rate-limit cho 3 route `/api/analyze-*` (đã ghi trong "Chưa quyết" từ trước)

Phát hiện: 3 route phân tích file mẫu (`analyze-sample` - đề, `analyze-lesson-plan-sample` - giáo
án, `analyze-worksheet-sample` - phiếu bài tập) đều gọi Gemini nhưng KHÔNG có rate-limit, khác với
5 route `/api/generate*` đã có `teacherGenerateRateLimiter.js` từ phiên 6 (Việc #7 cũ).

Tạo mới `src/services/sampleAnalyzeRateLimiter.js`: kiến trúc 2 lớp GIỐNG HỆT
`teacherGenerateRateLimiter.js` (Lớp 1 Burst trong bộ nhớ: tối đa 6 lượt/phút; Lớp 2 Daily bền
vững: Upstash hoặc file JSON local fallback, mặc định 20 lượt/ngày qua biến môi trường
`SAMPLE_ANALYZE_DAILY_LIMIT`) — nhưng CỐ Ý dùng **quota RIÊNG** (không dùng chung key/file với
`teacherGenerateRateLimiter.js`), vì bản chất 2 nhóm route khác nhau: `/api/generate*` là hành
động CHÍNH cần hạn mức cao (40/ngày), còn `/api/analyze-*` là hành động PHỤ (chỉ cần phân tích 1
file mẫu ĐÚNG 1 LẦN nhờ có cache theo hash nội dung file ở `sampleExamCache.js`/
`lessonPlanSampleCache.js`/`worksheetSampleCache.js`), nên cần hạn mức thấp hơn và KHÔNG nên trừ
vào hạn mức tạo nội dung thật nếu giáo viên lỡ thử nhiều file mẫu khác nhau trong 1 ngày.

Thêm hàm `requireWithinSampleAnalyzeLimit()` vào `src/services/apiAuth.js` (theo đúng khuôn
`requireWithinTeacherGenerateLimit()` đã có), gọi ngay sau `requireAuth()` ở đầu cả 3 route, TRƯỚC
khi đọc file/gọi Gemini. Test: `test/sampleAnalyzeRateLimiter.test.js` (12 test, theo đúng khuôn
`teacherGenerateRateLimiter.test.js`, thêm 1 test riêng xác nhận quota KHÔNG dùng chung file với
`teacherGenerateRateLimiter.js`).

### Ngoài 4 việc trên — 2 việc hạ tầng phát hiện thêm khi rà soát

- **`.github/workflows/test.yml`**: `NEXT_STEPS.md` (Bước 0) đã ghi việc này từ lâu ("Claude viết
  sẵn") nhưng chưa từng thực sự tạo file. Đã thêm workflow chạy `npm ci` + `npm test` +
  `npm run build` tự động mỗi lần push/PR, không cần biến môi trường thật (test chỉ chạy nhánh
  local, build không gọi API thật).
- **`.gitignore`**: PHÁT HIỆN BỊ THIẾU HOÀN TOÀN trong zip đưa qua rà soát, dù mục "0.-6." bên
  dưới ghi đã hoàn tất file này ở phiên trước — có thể do lỗi khi đóng gói zip trước đó, hoặc file
  chưa từng thực sự được thêm vào repo GitHub thật. Đã tạo lại đầy đủ (`node_modules/`, `.next/`,
  `.env*.local`, `.data/`...). **⚠️ Giáo viên CẦN tự kiểm tra lịch sử commit GitHub thật** xem các
  commit TRƯỚC thời điểm này có lỡ chứa `.env.local`/`.data/` không, vì thiếu `.gitignore` nghĩa
  là những file đó có thể ĐÃ bị commit nhầm trước đây dù thêm `.gitignore` bây giờ cũng không xoá
  được khỏi lịch sử cũ.

**Test**: `npm test` **183/183 PASS** (132 gốc + 36 test mới của phiên 10: 11 + 9 + 4 + 12, cộng
vài test lẻ khác đã có sẵn trong repo mà tài liệu trước đó chưa đếm hết). `npm run build` sạch, 3
route `analyze-*` vẫn đúng kiểu "ƒ Dynamic" (dùng `request.headers` để đọc token, giống các route
generate khác) — không có lỗi build thật, chỉ có log "Dynamic server usage" bình thường của
Next.js App Router.

**Việc còn lại (không code được, để giáo viên tự làm)**: xem mục "Nhóm A" trong `NEXT_STEPS.md`.

---

## 0.-7. Sửa lỗi "Hết Tiết 1" bị chèn lặp 2 lần trong Giáo án nhiều tiết (rối loạn dòng
## thời gian) + lỗi số thập phân/đơn vị đo không đúng chuẩn Việt Nam trong Đề cương ôn tập

**Bối cảnh**: giáo viên phản hồi 2 lỗi cụ thể sau khi dùng thật:
1. Giáo án 2 tiết ("Bài 1: Ôn tập số tự nhiên") xuất ra dòng "── Hết Tiết 1 (nghỉ giải lao) —
   Chuyển sang Tiết 2 ──" **HAI LẦN** (1 lần giữa hoạt động "Khởi động", 1 lần giữa hoạt động
   "Luyện tập") dù Tiết 1 chỉ kết thúc đúng 1 lần trong thực tế — mạch kịch bản đọc bị đứt gãy,
   không biết điểm dừng thật sự ở đâu.
2. Đề cương ôn tập Toán Lớp 5 viết số thập phân theo chuẩn quốc tế (dấu chấm, VD "15.6", "12.34")
   thay vì chuẩn Việt Nam (dấu phẩy, VD "15,6") — học sinh dễ bị trừ điểm nếu áp dụng đúng cách
   viết này khi làm bài thi thật; đơn vị diện tích cũng viết "km2"/"m2" thay vì "km²"/"m²".

### 1. Lỗi "rối loạn dòng thời gian" ở Giáo án nhiều tiết (nguyên nhân gốc + cách sửa)

**Nguyên nhân gốc (đã xác nhận, không phải AI "ảo giác" ngẫu nhiên)**: Mục III của giáo án LUÔN
trình bày theo 4 khối HOẠT ĐỘNG cố định (Khởi động → Hệ thống hoá → Luyện tập → Vận dụng — đúng
khung CV2345), KHÔNG trình bày theo tiết; ranh giới tiết được đánh dấu NGAY BÊN TRONG từng hoạt
động qua trường `tiet` ở mỗi bước (`tienTrinh[].tiet`), và `PeriodBoundary`
(`LessonPlanPreview.jsx`)/`periodBoundaryParagraph` (`lessonPlanExportService.js`) chỉ so sánh
`tiet` với bước liền trước **TRONG CÙNG 1 HOẠT ĐỘNG** (biến `lastTiet` reset về `null` mỗi khi bắt
đầu 1 `ActivityBlock` mới). Vì AI soạn `tienTrinh` của từng hoạt động có phần ĐỘC LẬP với nhau
(không theo dõi trạng thái tiết xuyên suốt toàn bài), hoạt động đứng SAU (VD "Luyện tập") có thể
tự gán lại `tiet: 1` cho bước đầu dù hoạt động đứng NGAY TRƯỚC nó ("Hệ thống hoá") đã ở `tiet: 2`
— tạo ra 1 ranh giới "Hết Tiết 1" GIẢ, SAI VỊ TRÍ, khiến người đọc thấy Tiết 1 "kết thúc" 2 lần.

**Cách sửa — 2 lớp, ưu tiên lớp code (đáng tin cậy tuyệt đối, không phụ thuộc AI có tuân thủ
prompt hay không):**
- **Lớp code (chính, MỚI thêm `src/data/lessonPlanTemplates.js`)**:
  - `normalizeActivitiesTiet(hoatDong)`: duyệt TOÀN BỘ các bước theo ĐÚNG thứ tự sẽ hiển thị (đúng
    thứ tự hoạt động → đúng thứ tự bước trong từng hoạt động), ép `tiet` của bước sau KHÔNG BAO
    GIỜ nhỏ hơn bước ngay trước đó trong dòng thời gian chung (chỉ sửa khi AI "lùi thời gian", giữ
    nguyên nếu AI đã gán đúng thứ tự không giảm).
  - `computeActivityStartTiets(normalizedHoatDong)`: tính "tiết đang diễn ra" NGAY TRƯỚC KHI mỗi
    hoạt động bắt đầu, dùng làm mốc `lastTiet` BAN ĐẦU khi trình bày hoạt động đó — thay vì `null`
    như cũ (cách cũ còn 1 lỗ hổng khác: nếu ranh giới tiết rơi ĐÚNG vào lúc chuyển từ hoạt động
    này sang hoạt động kia, thì KHÔNG có "Hết Tiết..." nào được chèn — bị bỏ sót hoàn toàn).
  - Áp dụng ĐỒNG BỘ ở CẢ 2 nơi hiển thị để không bị lệch nhau: `LessonPlanPreview.jsx` (bản xem
    trước web — `ActivityBlock` nhận thêm prop `startTiet`) và `lessonPlanExportService.js` (bản
    xuất Word — `buildTwoColumnActivityTable`/`buildOneColumnActivityParagraphs`/
    `buildActivitySection` đều nhận thêm tham số `startTiet`).
- **Lớp prompt (phòng ngừa, `lessonPlanPromptTemplates.js` → `buildMultiPeriodGuidance()`)**: bổ
  sung đoạn hướng dẫn tường minh yêu cầu AI hình dung TOÀN BỘ các tiết như 1 DÒNG THỜI GIAN DUY
  NHẤT chảy xuyên suốt cả 4 hoạt động (không phải 4 dòng thời gian riêng), `tiet` phải tăng dần
  không bao giờ giảm khi đọc tuần tự — giảm khả năng lớp code phía trên phải "vá" thường xuyên.

**Test**: `test/lessonPlanFixes.test.js` — bổ sung fixture tái hiện ĐÚNG lỗi thật (hoạt động "Hệ
thống hoá" đứng sau "Khởi động" đã sang Tiết 2 nhưng vẫn bị gán `tiet: 1`), assert dòng
"Hết Tiết 1" xuất hiện ĐÚNG 1 LẦN DUY NHẤT trong file Word xuất ra (trước khi sửa sẽ là 2 lần).

### 2. Lỗi số thập phân/đơn vị đo ở Đề cương ôn tập (`src/data/outlinePromptTemplates.js`)

Bổ sung 3 quy tắc bắt buộc vào khối "QUY TẮC CHUNG" của `buildOutlinePrompt()`:
- Số thập phân BẮT BUỘC dùng dấu phẩy (`,`) ngăn cách phần nguyên/thập phân theo đúng chuẩn Toán
  học Việt Nam (VD viết "15,6", TUYỆT ĐỐI KHÔNG viết "15.6") — áp dụng cho MỌI nơi trong đề cương
  (kiến thức cốt lõi, bài mẫu, lời giải, ngân hàng bài tập, đáp án...). Dấu chấm chỉ còn được dùng
  để phân tách nhóm 3 chữ số ở SỐ NGUYÊN lớn (VD "1.000.000"), không dùng cho số thập phân.
- Đơn vị đo có số mũ (diện tích, thể tích...) PHẢI dùng ký hiệu số mũ trên Unicode thật (`km²`,
  `m²`, `cm³`), KHÔNG viết số thường ngay sau chữ cái (`km2`, `m2`, `cm3`) — vì tính năng này xuất
  Word bằng Paragraph/TextRun thuần (không có pipeline LaTeX→OMML như Đề kiểm tra), nên đây là
  cách duy nhất để hiển thị số mũ đúng mà không cần định dạng ký tự phức tạp.
- Phân số giữ nguyên dạng "tử số/mẫu số" (VD "3/4") — xác nhận đây là lựa chọn AN TOÀN nhất khi
  chưa có công cụ hiển thị công thức, không cần đổi.

**Test**: `test/outlinePromptTemplates.test.js` (MỚI) — khoá lại 2 quy tắc trên bằng cách assert
prompt sinh ra PHẢI chứa đúng câu chữ + ví dụ minh hoạ ("15,6", "km²"...).

### Đã tự xác minh thật (trong giới hạn môi trường)
- `npx esbuild` (transform, không bundle) sạch trên toàn bộ 5 file đã sửa: `lessonPlanTemplates.js`,
  `LessonPlanPreview.jsx`, `lessonPlanExportService.js`, `lessonPlanPromptTemplates.js`,
  `outlinePromptTemplates.js`.
- Viết script tái hiện thủ công đúng kịch bản lỗi thật (hoạt động sau bị gán lùi `tiet`), xác nhận
  `normalizeActivitiesTiet()`/`computeActivityStartTiets()` cho ra ĐÚNG 1 ranh giới thay vì 2.
- Chạy THẬT `npm test` (132 test, gồm 2 test MỚI) sau khi `npm install` — **132/132 PASS**, không
  có test cũ nào bị phá vỡ (đã rà toàn bộ nơi dùng `lessonPlan.hoatDong` để đảm bảo không sót chỗ
  cần sửa tương tự).

### ⚠️ Việc CHƯA làm / cần giáo viên tự kiểm tra
- Lớp code (`normalizeActivitiesTiet`) chỉ sửa được trường `tiet` (dữ liệu có cấu trúc) — nếu AI
  lỡ viết CÂU CHỮ tường thuật sai bên trong `hoatDongGVHS` (VD nhắc "chuyển sang tiết 2" ngay
  trong nội dung 1 bước dù trường `tiet` của bước đó vẫn đúng), lớp code KHÔNG tự sửa được nội
  dung câu chữ này — giáo viên vẫn nên đọc lướt lại phần "Khởi động lại" ở tiết sau trước khi dạy.
- Quy tắc số thập phân/đơn vị đo mới CHỈ áp dụng cho "Đề cương ôn tập" (đúng phạm vi giáo viên
  phản ánh) — CHƯA rà soát các tính năng khác (Đề kiểm tra, Phiếu bài tập) xem có cùng lỗi hay
  không; nếu giáo viên gặp lỗi tương tự ở nơi khác, cần báo riêng để sửa đúng chỗ.

## 0.-6. Hoàn tất rate-limit theo giáo viên, trần số câu/bài/tiết mỗi lượt gọi,
## security headers, .gitignore + .env.local.example, và test tự động cho Việc 6/7

**Bối cảnh**: tiếp nối đúng 4 việc liệt kê ở mục "⚠️ Việc CHƯA làm" của lần rà soát trước (mục
0.-5. bên dưới): (a) rate-limit/quota theo giáo viên ở endpoint sinh nội dung, (b) trần tối đa số
câu/bài mỗi lượt gọi, (c) xác nhận `.gitignore` trên GitHub thật, (d) security headers cơ bản, và
thêm yêu cầu mới: viết test tự động riêng cho Việc 6/7 (Lời dẫn/Slide Outline) để tránh tái diễn
lỗi "thất lạc".

### 1. Rate-limit theo giáo viên (`src/services/teacherGenerateRateLimiter.js`, MỚI)
2 lớp chặn độc lập, gắn vào ĐẦU cả 5 route sinh nội dung (`/api/generate`,
`/api/generate-worksheet`, `/api/generate-lesson-plan`, `/api/generate-vietnamese-exam`,
`/api/generate-coloring-page`) qua `requireWithinTeacherGenerateLimit()` (thêm vào `apiAuth.js`,
dùng ngay sau `requireAuth()`, TRƯỚC khi gọi Gemini/GitHub tốn kém):
- **Burst**: tối đa 6 lượt/phút/giáo viên - đếm trong bộ nhớ (module-level Map), best-effort,
  cùng tinh thần `loginRateLimiter.js` (không chia sẻ giữa các serverless instance, nhưng vẫn
  chặn được spam dồn dập rơi vào 1 instance "ấm").
- **Daily**: mặc định 40 lượt/ngày/giáo viên (chỉnh qua `TEACHER_DAILY_GENERATE_LIMIT`) - bền
  vững qua Upstash Redis hoặc file JSON local `.data/teacher-generate-usage.json`, ĐÚNG kiến
  trúc dual-backend đã có sẵn trong `geminiUsageTracker.js`/`questionBankStore.js` (tái dùng
  `upstashClient.js` chung, không viết lại logic gọi Upstash).
- Vượt hạn mức -> route trả `429` kèm `error`/`reason` (`"burst"` hoặc `"daily"`)/`dailyLimit`.

### 2. Trần tối đa số câu/bài/tiết mỗi lượt gọi (`src/services/contentGenerationLimits.js`, MỚI)
TRƯỚC ĐÂY: `ExamMatrixForm.jsx`/`WorksheetForm.jsx` chỉ chặn số ÂM phía client
(`Math.max(0, ...)`), KHÔNG có trần phía server - gọi thẳng API (bỏ qua UI) có thể gửi số câu/bài
bất thường lớn (vd. `NHAN_BIET: 999999`), tốn rất nhiều quota Gemini 1 lượt gọi duy nhất.
- **Đề kiểm tra** (`/api/generate`): tối đa 20 câu/ô (1 chương × 1 mức độ), tổng tối đa 60
  câu/lượt tạo — clamp `chapterMatrix` NGAY SAU khi đọc body, trước khi gọi
  `orchestrateExamGeneration`.
- **Phiếu bài tập** (`/api/generate-worksheet`): tối đa 30 bài/1 dạng bài, tổng tối đa 80
  bài/lượt tạo — clamp `exerciseCounts`.
- **Giáo án** (`/api/generate-lesson-plan`): tối đa 10 tiết/lượt soạn — clamp `soTiet`.
- **Đề Tiếng Việt Tiểu học**: KHÔNG cần thêm trần mới - `docThamBlock.js` đã tự
  `Math.min(10, Math.max(7, soCauHoi))` sẵn từ trước.
- Chiến lược: **clamp (cắt về đúng trần)**, KHÔNG từ chối thẳng cả request - giữ đúng tinh thần
  "không tin dữ liệu client nhưng vẫn ưu tiên trải nghiệm" đã dùng ở `safeCounts` trong
  `worksheetGenerator.js`. Route LUÔN đính kèm cảnh báo vào `warnings` khi có clamp xảy ra.
- Cả 5 hằng số trần đều CHỈNH ĐƯỢC qua biến môi trường (xem `.env.local.example` MỚI), không cần
  sửa code/redeploy chỉ để đổi số.

### 3. Security headers cơ bản (`next.config.js`)
Thêm `headers()` áp dụng cho mọi route: `X-Frame-Options: DENY` (chống clickjacking),
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy` (tắt camera/microphone/geolocation không dùng tới), `X-XSS-Protection: 0`
(khuyến nghị OWASP hiện tại, thay vì "1; mode=block" đã lỗi thời). **CHƯA thêm CSP** (Content-
Security-Policy) - cần liệt kê chính xác mọi domain script/style/font đang dùng, dễ chặn nhầm
app đang chạy nếu làm vội; để dành 1 lượt riêng có thời gian test kỹ.

### 4. `.gitignore` + `.env.local.example` (CẢ 2 đều THẤT LẠC HOÀN TOÀN trong bản zip)
Xác nhận bằng `find . -iname ".gitignore*"` (không kết quả nào) và đối chiếu README.md (dòng
`cp .env.local.example .env.local`) với thực tế repo: **CẢ 2 FILE ĐỀU KHÔNG TỒN TẠI** ở bất kỳ
đâu trong bản zip đã đóng gói - không phải chỉ thiếu 1 dòng, mà thiếu HẲN cả file.
- Đã tạo lại `.gitignore` ở gốc repo (loại trừ `.env`/`.env.local`, `.data/`, `node_modules/`,
  `.next/`, `.vercel`, log/OS/editor file thường gặp) - có ghi rõ trong chính file: **BẮT BUỘC
  bạn tự kiểm tra trên repo GitHub THẬT** xem `.env.local`/`.data/` có từng lọt vào lịch sử
  commit hay không (sandbox không có mạng để tự xác nhận thay bạn) - nếu CÓ, coi như
  `GEMINI_API_KEYS`/`SESSION_SECRET`/`GITHUB_TOKEN` đã lộ, phải thu hồi/tạo mới ngay.
- Đã tạo lại `.env.local.example` dựa trên danh sách CHÍNH XÁC các biến `process.env.*` mà code
  thật sự đọc (`grep -rhoE "process\.env\.[A-Z_]+" src scripts`), không suy đoán tên biến - gồm
  cả 2 biến MỚI vừa thêm ở mục 1/2 (`TEACHER_DAILY_GENERATE_LIMIT`, 5 biến trần
  `EXAM_MAX_*`/`WORKSHEET_MAX_*`/`LESSON_PLAN_MAX_SO_TIET`).

### 5. Test tự động riêng cho Việc 6/7 Giai đoạn 10 (đúng yêu cầu, tránh tái diễn "thất lạc")
- `test/lessonPlanExportService.test.js` (MỚI, cần `npm install`): dựng file `.docx` thật bằng
  `exportLessonPlanToWord()`, giải nén bằng JSZip, soi `word/document.xml` — xác nhận
  `includeTeacherScript` ẩn/hiện ĐÚNG phụ lục "LỜI DẪN"; phụ lục "DÀN Ý SLIDE" LUÔN xuất hiện nếu
  có dữ liệu (không có cờ); dữ liệu rỗng thì KHÔNG tự vẽ phụ lục trống; CẢ HAI phụ lục cùng lúc
  không xung đột nhau (đúng kịch bản đã "thất lạc" trước đây - phải test cả 2 CÙNG LÚC, không
  tách riêng, giống bài học đã rút ra ở `exportService.docx.test.js`).
- `test/contentGenerationLimits.test.js` (MỚI, JS thuần) + `test/teacherGenerateRateLimiter.test.js`
  (MỚI, JS thuần) cho 2 tính năng mới ở mục 1/2.

### Đã tự xác minh thật (trong giới hạn môi trường)
- `node --check` (syntax) sạch trên TOÀN BỘ file mới/đã sửa (route.js × 5, `apiAuth.js`,
  `next.config.js`, `contentGenerationLimits.js`, `teacherGenerateRateLimiter.js`, 3 file test).
- Chạy THẬT `node --test test/contentGenerationLimits.test.js test/teacherGenerateRateLimiter.test.js`
  (2 file KHÔNG cần `npm install`, chỉ dùng module built-in) - **23/23 pass**.
- **CHƯA chạy được** `test/lessonPlanExportService.test.js` (cần `docx`/`jszip` thật) lẫn
  `npm run build`/`npm test` đầy đủ: sandbox lần này bị chặn mạng (`npm install` trả `403
  Forbidden` khi gọi `registry.npmjs.org`) - khác lần rà soát trước (mục 0.-5.) có mạng để tự cài
  đặt và verify đầy đủ 83/83 test + build.

### ⚠️ Việc CHƯA làm (giới hạn môi trường lần này + để ngỏ có chủ đích)
1. **BẮT BUỘC bạn tự chạy `npm install && npm test && npm run build`** trên máy có mạng trước
   khi coi các thay đổi trong PROJECT_SUMMARY.md, mục 0.-6. là "đã verify đầy đủ" - đặc biệt chú
   ý `lessonPlanExportService.test.js` (test mới, hoàn toàn chưa chạy thật lần nào) và toàn bộ
   83+ test cũ (đảm bảo 4 thay đổi lần này không làm hỏng gì đã có).
2. **`.gitignore` trên GitHub thật vẫn cần bạn tự xác nhận** (xem mục 4 ở trên, chi tiết đầy đủ
   nằm ngay trong file `.gitignore`) - đây là việc DUY NHẤT trong 4 yêu cầu lần này không thể tự
   động hoá được, kể cả khi có mạng.
3. **Chưa thêm CSP** (Content-Security-Policy) vào security headers - để ngỏ có chủ đích, xem
   giải thích ở mục 3.
4. **Chưa áp rate-limit cho 3 route `/api/analyze-*`** (phân tích đề/phiếu/giáo án mẫu) - các
   route này ĐÃ có cache theo hash nội dung file (giảm rủi ro gọi AI lặp lại cùng 1 file), rủi ro
   thấp hơn nhóm `/api/generate*` nên tạm để ngoài phạm vi yêu cầu lần này; có thể thêm sau bằng
   đúng `requireWithinTeacherGenerateLimit()` đã có sẵn nếu cần.
5. Test cho security headers (`next.config.js`) chưa tự động hoá được bằng `node --test` thuần -
   cần `next build && next start` thật rồi `fetch()` kiểm tra response header (xem
   `test/README.md`, mục "Việc còn thiếu").

---


## 0.-5. MỚI NHẤT — Rà soát tổng thể (bảo mật + bug) theo yêu cầu người dùng, phát hiện 2 lỗi
## nghiêm trọng KHÔNG nằm trong bất kỳ kế hoạch nào trước đó

**Bối cảnh**: người dùng yêu cầu rà soát lại toàn bộ code tìm lỗi/tối ưu/bảo mật. Đã đọc trực
tiếp toàn bộ cấu trúc thư mục + các file lõi (auth, session, key pool, rate limiter, export
service, integrations registry) — không suy đoán. Phát hiện 2 vấn đề nghiêm trọng:

### 1. `KE_HOACH_GIAI_DOAN_10.md` SAI khi ghi "chưa code gì" — thực ra Việc 6/7 ĐÃ được viết
nhưng LẠC vào 2 thư mục mồ côi `services/`, `data/` ở GỐC repo (ngang hàng `src/`), KHÔNG phải
`src/services/`, `src/data/` — trong khi `jsconfig.json` khai báo alias `"@/*": ["./src/*"]`, nên
toàn bộ app thật (kể cả `next build`) CHỈ đọc `src/`, không bao giờ đụng tới 2 thư mục gốc đó.
Hậu quả xác nhận qua đọc code: `src/components/LessonPlanExportActions.jsx` và
`LessonPlanPreview.jsx` ĐÃ SẴN SÀNG đọc `lessonPlan.loiDan`/`lessonPlan.slideOutline` (kể cả
checkbox "Bản đầy đủ có lời dẫn") nhưng `src/data/lessonPlanIntegrations.js` (bản app thật dùng)
THIẾU hẳn 2 entry `LOI_DAN`/`SLIDE_OUTLINE` nên AI không bao giờ được yêu cầu sinh 2 trường này,
và `src/services/lessonPlanExportService.js` thật cũng thiếu `buildLoiDanParagraphs`/
`buildSlideOutlineParagraphs` nên dù có dữ liệu cũng không xuất được ra Word — tính năng bị
"treo lửng" không có exception nào báo lỗi.

**Đã sửa**: copy đúng 2 entry integrations (`LOI_DAN`, `SLIDE_OUTLINE`) + 2 hàm export
(`buildLoiDanParagraphs`, `buildSlideOutlineParagraphs`) + cập nhật chữ ký
`buildLessonPlanDocxSections()`/`exportLessonPlanToWord()` nhận `includeTeacherScript` từ bản mồ
côi vào ĐÚNG vị trí trong `src/`. Sau đó **xoá hẳn 2 thư mục gốc `services/`, `data/`** để không
còn ai (kể cả AI ở phiên sau) vô tình sửa nhầm bản chết.

**Đã tự verify bằng script gọi hàm trực tiếp** (đã xoá sau khi verify, không nằm trong repo):
build `buildLessonPlanDocxSections()` với dữ liệu `loiDan`/`slideOutline` giả, giải nén `.docx`
sinh ra bằng JSZip, xác nhận: (a) `includeTeacherScript=false` → KHÔNG có phụ lục "LỜI DẪN"
nhưng CÓ phụ lục "DÀN Ý SLIDE" (đúng thiết kế: Slide Outline không có cờ ẩn/hiện); (b)
`includeTeacherScript=true` → CÓ CẢ HAI phụ lục, nội dung câu lời dẫn + tiêu đề slide xuất hiện
đúng trong `word/document.xml`.

### 2. `package.json` GỐC bị rỗng — chỉ còn `{"type": "module"}`, KHÔNG còn `name`/`version`/
`scripts`/`dependencies`/`devDependencies` — trong khi `package-lock.json` vẫn còn nguyên vẹn dữ
liệu dependency đầy đủ. Hậu quả xác nhận bằng cách tự cài đặt thử trong sandbox: `npm install`
không cài được gì (không có `dependencies` để đọc), `npm run build`/`npm test` báo lỗi "missing
script" — **project ở trạng thái KHÔNG THỂ BUILD/DEPLOY như trong file zip đã đóng gói**, dù mọi
tài liệu (README, DEPLOY.md, `test/README.md`) đều mô tả các lệnh này hoạt động bình thường →
xác nhận đây là lỗi phát sinh khi đóng gói/lưu lại project (không phải lỗi cố ý), KHÔNG phải lỗi
logic nghiệp vụ.

**Đã sửa**: khôi phục lại `name`/`version`/`scripts`/`dependencies`/`devDependencies` cho
`package.json` gốc, dựa trên dữ liệu CHÍNH XÁC còn nguyên trong `package-lock.json` (không suy
đoán số phiên bản). ⚠️ Phát hiện thêm 1 chi tiết khi khôi phục: **KHÔNG được thêm `"type":
"module"` vào package.json GỐC** — `next.config.js`/`tailwind.config.js`/`postcss.config.js` ở
gốc đều dùng cú pháp CommonJS (`module.exports`), nếu root ở chế độ ESM thì `next build` lập tức
lỗi `ReferenceError: module is not defined`. Cấu trúc ĐÚNG: root package.json KHÔNG có "type"
(mặc định CommonJS cho các file config), còn `src/package.json` và `test/package.json` (đã có
sẵn, không đổi) mới là nơi khoanh vùng riêng `"type": "module"` cho code ứng dụng/test.

**Đã tự verify thật**: `npm install` (212 packages, không lỗi) → `npm test` (**83/83 pass**,
KHÔNG có test nào hỏng sau khi sửa 2 lỗi trên) → `npm run build` (`✓ Compiled successfully`, đủ
17 route bao gồm toàn bộ `/api/*`) — chạy LẠI TOÀN BỘ pipeline này 1 lần nữa SAU KHI xoá 2 thư
mục mồ côi `services/`/`data/` để xác nhận chắc chắn không có chỗ nào âm thầm phụ thuộc vào 2
thư mục đó (kết quả: vẫn 83/83 pass, build vẫn sạch).

### ⚠️ Việc CHƯA làm (giới hạn môi trường + để ngỏ có chủ đích)
1. **Chưa xác nhận UI thật trên trình duyệt**: 2 tính năng Lời dẫn/Slide Outline giờ đã sinh dữ
   liệu + xuất Word đúng theo test tự động, nhưng sandbox không có trình duyệt/Word thật — cần tự
   bật tích hợp "Lời dẫn (Teacher Script)" và "Slide Outline" khi soạn giáo án thật (cần
   `GEMINI_API_KEYS` thật, sandbox không có) để xác nhận bằng mắt.
2. **Chưa xử lý các lỗ hổng bảo mật khác đã nêu khi rà soát** (chưa làm ở lượt này, người dùng
   sẽ quyết định thứ tự tiếp theo): (a) chưa có rate-limit/giới hạn quota theo giáo viên ở các
   endpoint sinh nội dung (chỉ `/api/login` có); (b) chưa có trần tối đa số lượng câu hỏi/bài tập
   mỗi lượt gọi; (c) chưa xác nhận `.gitignore` loại trừ `.env.local`/`.data/` trên repo GitHub
   thật; (d) chưa thêm security headers cơ bản vào `next.config.js`.
3. Chưa viết test tự động riêng cho Việc 6/7 vào `test/*.test.js` (mới verify bằng script thủ
   công, đã xoá sau khi verify) — nên cân nhắc thêm 1 file `lessonPlanExportService.test.js` ở
   lượt sau để bảo vệ lâu dài khỏi tái diễn đúng loại lỗi "thất lạc" này.
4. Chưa quyết định làm tiếp Giai đoạn 9 hay phần còn lại của rà soát bảo mật (Mục 2 ở trên) —
   để người dùng chủ động chọn ở phiên tiếp theo.

---



> ⚠️ Bản này thay thế mọi bản `PROJECT_SUMMARY.md` cũ hơn (kể cả bản đóng gói sẵn trong
> `ai-exam-generator-giaidoan9-buoc2-lop1.zip` trước lần sửa này). Dùng bản này làm nguồn tin cậy
> khi mở chat mới.

## 0.-4. MỚI NHẤT — SỬA 3 lỗi giáo viên phản ánh sau khi test thật catalog Lớp 1 (web/Word/PDF)

**Bối cảnh**: sau khi đóng gói Bước 2 - ĐỢT 1 (mục "0.-3." bên dưới), giáo viên test thật cả 3
bản (Web, Word, PDF) và gửi: 1 ảnh chụp mục 6 "So sánh độ dài" trên Web (đẹp, có 2 thanh màu minh
hoạ), 1 file Word đã xuất, 1 file PDF đã xuất, kèm đánh giá: "Web đẹp - Word rất tệ (icon nhỏ,
layout xô lệch) - PDF tương đối ổn nhưng vẫn mất layout ở mục 6 giống ảnh Web". Đã đọc trực tiếp
code + GIẢI NÉN THẬT cả 2 file Word/PDF giáo viên gửi (không chỉ đọc code) để xác nhận đúng gốc rễ
trước khi sửa.

### 1. PDF mất 2 thanh màu minh hoạ ở mục "So sánh độ dài" (ĐÃ SỬA)
**Gốc rễ xác nhận qua đối chiếu XML/HTML thật**: "PDF" của phiếu bài tập KHÔNG dùng thư viện PDF
riêng - chỉ là `window.print()` in thẳng HTML/CSS (xem `exportService.js`). `DoDaiSoSanhSection`
(`WorksheetPreview.jsx`) vẽ 2 thanh màu bằng `background: accent` (CSS background-color thuần) -
đây CHÍNH LÀ loại thuộc tính mà trình duyệt **mặc định KHÔNG in ra** khi in trang (để tiết kiệm
mực), trừ khi người dùng tự tay tick "Background graphics" trong hộp thoại in - dễ bị bỏ sót và
ứng dụng không có cách nào tự bật hộ qua JavaScript. Border thì KHÔNG bị ảnh hưởng (không tính là
"background") - đúng lý do khung viền màu mục 1-13 vẫn lên PDF bình thường, chỉ riêng 2 thanh màu
(dùng `background`, không phải `border`) bị mất, để lại đúng 3 dòng chữ trần trụi - khớp 100% với
ảnh giáo viên gửi.

**Đã sửa** (`src/app/globals.css`): thêm rule `@media print` ép TOÀN BỘ phần tử trong `#print-area`
LUÔN in nền (`-webkit-print-color-adjust: exact` / `print-color-adjust: exact` / `color-adjust:
exact`, có `!important`) - đây là cách chuẩn để "khoá" hành vi in nền, trình duyệt sẽ in đúng như
trên màn hình dù người dùng có tick "Background graphics" hay không. Phòng luôn các mảng màu nền
khác (dải cầu vồng, khung tiêu đề...) khỏi gặp lại đúng loại lỗi này, không chỉ riêng mục 6.

### 2. Word: "icon nhỏ" ở huy hiệu số thứ tự mỗi khối bài (ĐÃ SỬA)
**Gốc rễ xác nhận qua giải nén thật file `.docx` giáo viên gửi**: số thứ tự (①②③...) + mascot chỉ
là CHỮ THƯỜNG cùng cỡ/cùng dòng với tiêu đề (13pt, không tô nền/không nổi bật) - khác hẳn bản Web
có hẳn 1 "huy hiệu" hình tròn nền màu đậm, chữ trắng, đổ bóng (`ExerciseBox` trong
`WorksheetPreview.jsx`). Word không vẽ được hình tròn/box-shadow, nhưng CÓ hỗ trợ tô nền riêng cho
1 đoạn chữ (run-level shading, khác `shading` của cả khung) - đã tự xác nhận bằng script build thử
`docx` v9.0.2 rằng tính năng này hoạt động đúng trước khi dùng.

**Đã sửa** (`worksheetExportService.js`, `buildSectionParagraphs()`): số thứ tự giờ là 1 "viên
thuốc" (pill) nền màu đậm CÙNG MÀU badge của khối (`colors.badge`), chữ trắng đậm, cỡ 16pt (to hơn
hẳn 13pt cũ) - nổi bật rõ như 1 icon/huy hiệu thay vì lẫn vào chữ thường. Mascot (emoji) tách
RIÊNG khỏi run có `rFonts="Times New Roman"` (Times New Roman không có glyph màu cho emoji) để
Word tự chọn đúng font thay thế, tránh lệch baseline giữa glyph màu và chữ thường.

### 3. Word: "layout xô lệch" ở các mục "Nối" (bản học sinh) (ĐÃ SỬA)
**Gốc rễ xác nhận qua đọc code + tính toán lại**: 2 mục "Nối phép tính" (Toán) và "Nối từ theo
nhóm" (Tiếng Việt) dùng `TabStopPosition.MAX` của thư viện `docx` để đẩy cột đáp án xáo trộn sát
lề phải - nhưng đây là 1 **hằng số CỨNG 9026 twip (~15.93cm)**, tính theo khổ giấy/lề MẶC ĐỊNH của
thư viện, KHÔNG PHẢI khổ giấy/lề THẬT của phiếu (A4 210mm, lề trái/phải 18mm -> vùng chữ thật rộng
~174mm ≈ 9864 twip, RỘNG HƠN gần 8mm). Hệ quả: cột đáp án bị dừng SỚM khoảng 8mm, lơ lửng cách
viền khung phải thay vì áp sát như bản Web (dùng CSS flex đẩy đúng sát mép) - đúng loại "xô lệch"
giáo viên phản ánh. **Lỗi này CHỈ LỘ RA ở bản học sinh** (`showAnswers=false`) - bản giáo viên in
thẳng "biểu thức = kết quả" trên 1 dòng, không dùng tab-stop nên không bị ảnh hưởng (giải thích vì
sao file giáo viên gửi kiểm tra không thấy rõ lỗi này qua mắt thường nếu chỉ xem bản có đáp án).

**Đã sửa**: thay `TabStopPosition.MAX` bằng hằng số MỚI `CONTENT_WIDTH_TWIP` tự tính từ CHÍNH
`PAGE_A4_MM`/`PAGE_MARGIN_MM` đang dùng (không phụ thuộc giá trị mặc định của thư viện) - áp dụng
cho cả 2 chỗ dùng tab-stop trong file (`buildNoiPhepTinhParagraphs`, `buildNoiTuNhomParagraphs`).

### Đã tự xác minh thật (không chỉ đọc code)
- `npm run build`: build sạch, không lỗi type/lint.
- `npm test`: vẫn **47/47 pass**.
- Giải nén THẬT 2 file `.docx`/`.pdf` giáo viên gửi để xác nhận đúng gốc rễ TRƯỚC khi sửa (không
  đoán) - xem "Gốc rễ xác nhận" ở mỗi mục trên.
- Sau khi sửa, gọi thẳng `generateWorksheet()` + `buildWorksheetDocxBlob()` qua
  `test/register-loader.mjs`, giải nén lại `.docx` MỚI sinh ra bằng JSZip, soi `word/document.xml`:
  (1) xác nhận run huy hiệu số thứ tự CÓ THẬT `<w:shd w:fill="..."/>` bên trong `<w:rPr>` (tô nền
  RIÊNG cho run đó, khác `shd` của cả khung), cỡ chữ `32` (16pt, to hơn cỡ cũ `26`), màu chữ
  `FFFFFF`, fill TRÙNG đúng mã màu badge của khối; (2) xác nhận tab-stop mới có `w:pos="9864"` (khớp
  đúng tính toán từ khổ giấy/lề thật) THAY VÌ `9026` cũ, và CHỈ xuất hiện ở bản `showAnswers=false`
  (đúng như phân tích - bản giáo viên không dùng tab-stop).
- Đã xuất thử 2 file `.docx` mẫu (bản giáo viên + bản học sinh, đủ các dạng bài Lớp 1 mới) gửi kèm
  để giáo viên tự mở bằng Word thật kiểm tra bằng mắt (xem "Việc CHƯA làm" bên dưới).

### ⚠️ Việc CHƯA làm được (giới hạn môi trường - QUAN TRỌNG, cần bạn tự làm)
1. **Sandbox không có trình duyệt lẫn Word thật** nên CHƯA thể tự xác nhận bằng mắt: (a) 2 thanh
   màu mục 6 có thực sự lên PDF sau khi thêm CSS `print-color-adjust` hay không - CSS này là kỹ
   thuật chuẩn/được hỗ trợ rộng rãi (Chrome, Edge, Firefox mới) nhưng KHÔNG loại trừ khả năng 1 số
   trình duyệt/phiên bản cũ vẫn cần người dùng tự tick "Background graphics" thủ công thêm; (b)
   huy hiệu số thứ tự dạng "viên thuốc" mới trong Word có thực sự trông giống 1 icon nổi bật/không
   bị vỡ dòng hay không; (c) cột đáp án mục "Nối" ở bản học sinh có thực sự áp sát viền khung phải
   sau khi sửa tab-stop hay không. Đã gửi kèm 2 file `.docx` mẫu (mau-giao-vien.docx,
   mau-hoc-sinh.docx) - **bắt buộc mở bằng Word thật để xác nhận cả 3 điểm trên**, và thử lại "In
   / Tải PDF" trên trình duyệt thật với 1 phiếu có mục "So sánh độ dài" để xác nhận PDF không còn
   mất thanh màu.
2. Phiếu mẫu gửi kèm KHÔNG có mục "Giải toán có lời văn" hiển thị đầy đủ - sandbox không có
   `GEMINI_API_KEYS` nên mục này bị lỗi khi sinh thử (đã thấy dòng cảnh báo trong log khi tạo file
   mẫu) - không liên quan gì đến 3 lỗi vừa sửa, đây là giới hạn môi trường đã biết từ trước.
3. Chưa viết test tự động (`node --test`) riêng cho 3 việc sửa lần này vào bộ `test/*.test.js` -
   mới verify bằng script gọi hàm thủ công trong phiên làm việc (đã xoá sau khi verify xong, không
   nằm trong repo).
4. `.gitignore` - vẫn cần bạn tự xác nhận đã có trên máy/repo GitHub thật hay chưa (nhắc lại từ
   nhiều phiên trước, vẫn ưu tiên cao nếu chưa làm).

---


## 0.-3. MỚI NHẤT (giai đoạn 9, Bước 2/3 — Tầng B, ĐỢT 1: Lớp 1) — Catalog "Phiếu bài tập" theo
## CHỦ ĐỀ SGK thay vì chỉ "kỹ năng chung"

**Bối cảnh**: theo đúng kế hoạch đã thống nhất ở mục 0.5 (bên dưới), Bước 2 mở rộng catalog Phiếu
bài tập theo MẠCH NỘI DUNG SGK thật (đo lường, thời gian, tiền tệ...) thay vì chỉ luyện "kỹ năng
chung" (tính nhẩm, so sánh số trần trụi...) như trước. Trước khi code, đã thống nhất lại với giáo
viên: (1) dùng đúng danh sách chủ đề đã đề xuất (Lớp 1: Độ dài + Thời gian; Lớp 2: Đo lường +
Tiền Việt Nam + Thời gian + Hình học có số đo - xem đầy đủ ở mục 0.5), (2) làm **Lớp 1 trước**
(đơn giản hơn, làm nhanh) - Lớp 2 sẽ làm ở 1 lượt Bước 2 kế tiếp.

### 1. 4 dạng bài MỚI (thuần code, không cần AI) - đúng 2 mạch nội dung Lớp 1 trong chương trình
### GDPT 2018 ("Độ dài và đo độ dài", "Thời gian, giờ và lịch")
- **`do_dai_so_sanh`** (chủ đề Độ dài) - so sánh độ dài 2 "băng giấy" đã ghi sẵn số đo (cm, phạm
  vi 3-20 khớp đúng phạm vi số Lớp 1), điền dấu >, <, =. Web: vẽ 2 thanh màu có độ rộng tỉ lệ thô
  minh hoạ (KHÔNG cần đúng tỉ lệ vật lý tuyệt đối - đây là bài đọc/so sánh số đã cho sẵn, không
  phải tự đo bằng thước thật trên giấy in, tránh rủi ro sai lệch khi in/PDF không giữ đúng tỉ lệ
  mm mong muốn). Word: liệt kê tên + số đo bằng văn bản thuần.
- **`do_dai_sap_xep`** (chủ đề Độ dài) - sắp xếp 3 số đo (cm) theo thứ tự. **Tái dùng NGUYÊN
  `SapXepThuTuSection`/`buildSapXepThuTuParagraphs` đã có** (cùng khuôn dữ liệu
  numbers/sortedAnswer/direction, chỉ thêm field `unit: "cm"` hiển thị kèm mỗi số nếu có) - không
  viết component mới, giảm trùng lặp code.
- **`xem_dong_ho_gio_dung`** (chủ đề Thời gian) - xem đồng hồ CHỈ giờ đúng (đúng mức độ chương
  trình Lớp 1, giờ-phút để dành Lớp 2). Web: `ClockFace` - mặt đồng hồ SVG vẽ bằng lượng giác
  (tính toán vị trí kim giờ/kim phút/12 số NGAY TẠI thời điểm render theo tham số `hour`, không
  hardcode toạ độ như `ShapeIcon`, vì mỗi đồng hồ cần góc kim khác nhau tuỳ dữ liệu). Word: dùng
  ĐÚNG emoji Unicode "đồng hồ chỉ giờ" có sẵn (🕐-🕛, mỗi emoji ứng với ĐÚNG 1 giờ tròn) - chính
  xác 100%, không cần tự vẽ.
- **`cac_ngay_trong_tuan`** (chủ đề Thời gian) - điền (đúng 1) ngày còn thiếu trong 1 đoạn liên
  tiếp 4-6 ngày của tuần (không ẩn ngày đầu/cuối - còn đầu mối suy luận thứ tự). Cùng khuôn dữ
  liệu với `day_so` (sequence có `null` = chỗ trống) nhưng chứa TÊN NGÀY thay vì SỐ.
- Cả 4 dạng đăng ký trong `worksheetExerciseCatalog.js` với **`minGrade=maxGrade="LOP_1"`** (CHỦ
  Ý không mở rộng sang Lớp 2 - Lớp 2 cần dạng bài phức tạp hơn hẳn, đổi đơn vị dm/m/km, giờ-phút,
  sẽ có generator RIÊNG ở lượt Bước 2 kế tiếp, không dùng chung 4 dạng đơn giản này).

### 2. "Gói chủ đề" (`src/data/worksheetTopicPackages.js`, MỚI) - bấm 1 nút bật cả nhóm dạng bài
- 2 gói cho Lớp 1/Toán: **"📏 Độ dài"** (`do_dai_so_sanh` + `do_dai_sap_xep`), **"⏰ Thời gian"**
  (`xem_dong_ho_gio_dung` + `cac_ngay_trong_tuan`).
- `WorksheetForm.jsx`: thêm dãy nút tròn "Chủ đề SGK (tuỳ chọn)" ngay sau ô "Bài/Chương SGK" -
  bấm 1 nút sẽ **CỘNG DỒN** (đặt = defaultCount) các dạng bài trong gói vào `exerciseCounts` hiện
  tại, **KHÔNG ghi đè/xoá** các dạng bài khác giáo viên đã chọn trước đó (khác hẳn cơ chế "Áp
  dụng cấu trúc từ phiếu mẫu" ở Bước 1 - phiếu mẫu là tín hiệu CHẮC CHẮN nên ghi đè hợp lý, còn
  bấm 1 gói chủ đề chỉ là "tôi muốn THÊM phần này", ghi đè sẽ gây bất ngờ khó chịu).
- `DEFAULT_SECTION_ORDER` trong `worksheetGenerator.js`: xếp 2 dạng bài cùng 1 gói ĐỨNG CẠNH NHAU
  (đã tự xác nhận qua script) - để khi giáo viên bấm cả gói, phiếu ra vẫn có cảm giác "1 chủ đề
  liền mạch" chứ không bị dạng bài khác chen giữa.

### 3. ⚠️ QUYẾT ĐỊNH CÓ CHỦ Ý: KHÔNG làm tự động dò khớp "Bài/Chương SGK" ↔ "gói chủ đề" đợt này
Kế hoạch gốc (mục 0.5) có ghi "Ô 'Bài/Chương SGK' hiện có sẽ thực sự điều khiển catalog nào hiện
ra". Đã đọc code `githubService.js`/`WorksheetForm.jsx` để đánh giá tính khả thi: ô "Bài/Chương
SGK" hiển thị nhãn `Chương/Bài ${c.chapter}`, trong đó `c.chapter` là 1 SLUG được trích từ TÊN
FILE markdown trong 1 **repo GitHub RIÊNG TƯ bên ngoài** (biến môi trường `GITHUB_KNOWLEDGE_REPO`
- KHÔNG cấu hình trong sandbox này, và mình không có quyền truy cập để xem thật tên file/nội dung
bên trong). Xây dựng logic "dò từ khoá" khớp slug này với chủ đề SGK trong tình trạng KHÔNG BIẾT
định dạng thật của dữ liệu là **đoán mò, rủi ro cao** (có thể không khớp gì do slug không chứa từ
khoá tiếng Việt có dấu, hoặc khớp sai) - tốn công viết mà không chắc chạy đúng, đúng loại "lãng
phí công sức" cần tránh. Quyết định: làm "gói chủ đề" thành 1 bộ chọn ĐỘC LẬP (mục 2 ở trên), vẫn
mang lại đúng giá trị cốt lõi (bấm 1 phát ra cả nhóm bài liên quan) mà KHÔNG phụ thuộc dữ liệu
không kiểm chứng được. Nếu giáo viên muốn nối 2 ô này thật sự, cần cho biết CHÍNH XÁC văn bản hiện
ra trong ô "Bài/Chương SGK" (chụp ảnh dropdown) để biết đúng định dạng slug thật rồi mới viết logic
khớp đáng tin cậy.

### Đã tự xác minh thật (không chỉ đọc code)
- `npm run build`: build sạch, không lỗi type/lint.
- `npm test`: vẫn **47/47 pass** - không có test cũ nào bị hỏng.
- 4 script riêng, chạy `node --import ./test/register-loader.mjs` (đã xoá sau khi verify xong,
  không nằm trong repo):
  1. **4 generator mới**: `generateDoDaiSoSanh(20)` - đáp án >,<,= đúng 100% khi đối chiếu lại
     bằng tay, đủ cả 3 loại dấu xuất hiện trong mẫu lớn, cm luôn trong 3-20, 2 tên băng giấy luôn
     khác nhau. `generateDoDaiSapXep(30)` - 3 số luôn PHÂN BIỆT, cm trong 3-30, `sortedAnswer`
     khớp đúng thứ tự thật khi tự sắp xếp lại độc lập để đối chiếu, luôn có `unit="cm"`.
     `generateXemDongHoGioDung`: count≤12 → giờ luôn PHÂN BIỆT (không lặp), count=20 (>12) vẫn an
     toàn không lỗi. `generateCacNgayTrongTuan(30)`: luôn ẩn ĐÚNG 1 vị trí, không ẩn đầu/cuối, và
     XÁC NHẬN CHẶT chuỗi (kể cả phần bị ẩn) đúng là 1 đoạn LIÊN TIẾP THẬT trong `DAYS_OF_WEEK` khi
     đối chiếu lại bằng `indexOf`/`slice` độc lập (không chỉ tin dữ liệu do generator tự khai).
  2. **Tích hợp catalog + generateWorksheet + topic packages**: 4 dạng bài mới CHỈ hiện cho LOP_1
     (không có ở LOP_2/MAM_NON); đúng 2 gói chủ đề cho LOP_1/TOAN, 0 gói cho LOP_2; mọi
     `exerciseKeys` trong 2 gói đều tồn tại thật trong catalog (không lỗi tham chiếu "key ma");
     gọi `generateWorksheet()` thật sinh đủ cả 4 dạng bài, đúng số câu theo `exerciseCounts`, và
     **xác nhận 2 dạng bài cùng gói "Độ dài" đứng NGAY CẠNH NHAU** trong `sections` sinh ra; gửi
     thẳng `do_dai_so_sanh` cho `grade=LOP_2` (không hợp lệ) → xác nhận bị LỌC BỎ hoàn toàn, không
     lọt lỗ hổng an toàn phía server (đúng cơ chế đã có từ trước, chỉ verify vẫn hoạt động đúng
     với dạng bài mới); `listAvailableExercises()` cũng thấy đủ 4 dạng bài mới.
  3. **Công thức lượng giác `ClockFace`**: mô phỏng lại chính xác công thức trong component (vì
     không thể render JSX trực tiếp trong Node thuần - xem lý do ở Bước 1) để kiểm tra ĐỘC LẬP:
     giờ 12/3/6/9 → kim giờ chỉ đúng hướng (lên/phải/xuống/trái); kim phút (giờ đúng) LUÔN chỉ
     thẳng lên bất kể giờ nào; số "12" trên mặt đồng hồ nằm đúng ở đỉnh.
  4. **Xuất Word THẬT** (`buildWorksheetDocxBlob()`, giải nén bằng JSZip soi `word/document.xml`,
     cùng kỹ thuật đã dùng ở giai đoạn 8): bản giáo viên (showAnswers=true) chứa ĐÚNG số đo cm của
     câu so sánh độ dài đầu tiên, ĐÚNG emoji đồng hồ + text giờ của câu xem đồng hồ đầu tiên, ĐÚNG
     đáp án ngày bị ẩn của câu "các ngày trong tuần" đầu tiên - tất cả đối chiếu bằng cách ĐỌC LẠI
     dữ liệu gốc từ `worksheet.sections`, không suy đoán. **Quan trọng nhất**: xác nhận bản HỌC
     SINH (showAnswers=false) KHÔNG LỘ đáp án ngày bị ẩn khi đáp án đó không trùng với ngày khác
     đã hiện sẵn trong chuỗi - tránh đúng loại lỗi "lộ đáp án qua khe hở logic" dễ bị bỏ sót nếu
     chỉ đọc code mà không test bằng dữ liệu thật.

### Việc CHƯA làm — cần bạn tự làm ở phiên tiếp theo
1. **Chưa xem bằng mắt trên trình duyệt thật** - đặc biệt: (a) mặt đồng hồ SVG có đẹp/rõ ràng với
   trẻ Lớp 1 không (form dáng số, độ dày kim...), dù công thức toán đã xác nhận đúng; (b) dãy nút
   "Chủ đề SGK" mới có gây rối bố cục form không, có rõ ràng là "cộng dồn" (không phải ghi đè)
   không; (c) 2 thanh màu minh hoạ độ dài trong `DoDaiSoSanhSection` có nhìn dễ hiểu/không bị vỡ
   layout ở màn hình nhỏ/khi in không.
2. **Chưa in PDF thật** với các dạng bài mới - đặc biệt đồng hồ SVG (nhiều mặt đồng hồ xếp
   `flex-wrap` trong 1 khối) cần xác nhận không tái diễn đúng loại lỗi tràn/đè đã sửa ở "0.-2." vì
   đây là nội dung SVG dày đặc mới, khác hẳn hình học đơn giản đã test trước đó.
3. **Bước 2 - ĐỢT 2 (Lớp 2): Đo lường (dm/m/km, kg, lít) + Tiền Việt Nam + Thời gian (giờ-phút,
   ngày-tháng) + Hình học có số đo (chu vi) CHƯA làm** - đây là phần LỚN HƠN nhiều so với đợt 1
   (Lớp 1), cần thêm generator riêng cho từng chủ đề, làm ở lượt kế tiếp theo đúng thứ tự đã thống
   nhất.
4. **Bước 3 (Tiếng Việt) CHƯA làm** - theo đúng thứ tự đã thống nhất (làm SAU Bước 2 để tái dùng
   khuôn kiến trúc đã kiểm chứng), chưa đến lượt.
5. Chưa viết test tự động (`node --test`) chính thức cho 4 generator + tích hợp mới vào bộ
   `test/*.test.js` - mới verify bằng 4 script gọi hàm thủ công trong phiên làm việc (đã xoá sau
   khi verify xong, không nằm trong repo).
6. `.gitignore` - vẫn cần bạn tự xác nhận đã có trên máy/repo GitHub thật hay chưa (nhắc lại từ
   nhiều phiên trước, vẫn ưu tiên cao nếu chưa làm).

---

## 0.-2. MỚI NHẤT — SỬA LỖI CHỮ ĐÈ LÊN NHAU KHI XUẤT PDF (phát hiện qua test thực tế lần 2, SAU
## khi đã đóng gói Bước 1/3 - Tầng A)

**Bối cảnh**: sau khi làm xong 5 việc ở Bước 1 (mục "0.-1." bên dưới), giáo viên test lại bằng
cách tạo phiếu + xuất PDF thật, gửi 2 ảnh chụp: 1 ảnh bản Web (đẹp, không lỗi) và 1 ảnh bản PDF
(chữ ở nhiều vị trí bị ĐÈ LÊN NHAU - giáo viên khoanh đỏ) + 1 file PDF khác (trường hợp phiếu ngắn,
không lỗi vì vừa đủ 1 trang). **Đây là 1 LỖI MỚI phát sinh TỪ chính phần sửa layout 2 cột ở Bước 1
(mục "1." bên dưới) - không phải lỗi cũ tái xuất hiện.**

### Gốc rễ đã xác nhận qua đọc code (không phải đoán)
`WorksheetExportActions.jsx` cho thấy nút "In / Tải PDF" gọi `exportToPDF()` trong
`exportService.js`, và hàm này **CHỈ gọi `window.print()`** - ứng dụng KHÔNG dùng thư viện PDF
riêng cho phiếu bài tập (khác Word, dùng thư viện `docx`), nghĩa là "PDF" ở đây chính là trình
duyệt tự in trang HTML/CSS thật ra PDF, ngắt trang hoàn toàn dựa vào cách trình duyệt paginate
HTML khi in.

Ở Bước 1, lỗi vỡ layout 2 cột được sửa bằng cách đổi từ CSS `column-count: 2` sang `display: flex`
(2 `<div>` flex ngang, mỗi cột 1 mảng con riêng của `sections`). Cách này sửa ĐÚNG lỗi tràn ngang
biên cột (lỗi cũ), nhưng lộ ra vấn đề khác: **`display: flex` (và tương tự `display: grid`) có hỗ
trợ ngắt trang khi IN rất không ổn định giữa các trình duyệt** - khi nội dung phiếu dài hơn 1
trang A4, 2 cột flex có thể bị ngắt trang KHÔNG đồng bộ với nhau (cột này đã sang trang 2, cột kia
vẫn còn ở trang 1, hoặc ngược lại), khiến phần chữ của trang sau bị in đè lên phần chưa hết của
trang trước - đúng hiện tượng giáo viên chụp ảnh. Đây là lý do phiếu NGẮN (đủ gọn trong 1 trang,
như file PDF thứ 2 giáo viên gửi) KHÔNG bị lỗi - lỗi chỉ lộ ra khi phiếu dài hơn 1 trang, đúng buộc
phải ngắt trang thật.

### Đã sửa: đổi từ `flex` sang `float` (kỹ thuật CSS 2 cột cổ điển, CHỦ Ý dùng lại)
`WorksheetPreview.jsx`: khối chia 2 cột đổi từ `display: flex` sang `float: left` / `float: right`
(mỗi cột `width: 47%`, khối bọc ngoài có `overflow: hidden` để "clear" 2 cột float, tránh phần QR
đáp án/footer bị đẩy đè lên cột). **Lý do chọn `float` thay vì quay lại `column-count` (kỹ thuật
gốc) hay đổi sang `grid`**: trong 3 kỹ thuật CSS chia cột (`column-count`/`flex`/`grid`/`float`),
`float` + `width` cố định là kỹ thuật DUY NHẤT được các trình duyệt hỗ trợ ngắt trang khi in ỔN
ĐỊNH qua nhiều trang - đây là kỹ thuật tiêu chuẩn cho báo cáo/tài liệu in nhiều cột từ trước khi
flexbox/grid ra đời (`column-count` có đúng lỗi tràn ngang biên cột ở lần sửa trước; `flex`/`grid`
có đúng lỗi ngắt trang không đồng bộ vừa phát hiện lần này). Cách CHIA DỮ LIỆU (2 mảng con của
`sections`, mỗi `ExerciseBox` luôn nằm trọn trong đúng 1 cột) giữ NGUYÊN như Bước 1 - chỉ đổi kỹ
thuật CSS hiển thị.

### Đã tự xác minh (trong giới hạn môi trường - xem "Việc CHƯA làm")
- `npm run build`: build sạch, không lỗi type/lint (Next.js SWC compile JSX thành công, xác nhận
  cú pháp JSX hợp lệ).
- `npm test`: vẫn **47/47 pass**.
- Kiểm tra trực tiếp mã nguồn: xác nhận KHÔNG còn `columnCount:`/`display: "flex"` nào ở khối chia
  cột (chỉ còn trong comment lịch sử, không phải code thật đang chạy), có đủ `float: "left"`,
  `float: "right"`, `overflow: "hidden"` đúng vị trí.

### ⚠️ Việc CHƯA làm được (giới hạn môi trường - QUAN TRỌNG, cần bạn tự làm)
**Sandbox này KHÔNG có trình duyệt (Chromium/Chrome) và mạng bị giới hạn domain nên KHÔNG cài được
Puppeteer/Playwright để tự động hoá việc in thử** - nghĩa là lần sửa này **CHƯA được tự kiểm chứng
bằng 1 lượt in PDF thật nào cả**, chỉ dựa trên hiểu biết đúng đắn về hành vi ngắt trang CSS của
trình duyệt (float là kỹ thuật đã được kiểm chứng rộng rãi trong ngành cho in ấn nhiều cột, không
phải phỏng đoán) + code compile/build sạch. **Bắt buộc phải test lại thật**: tạo 1 phiếu ĐỦ DÀI
(để chắc chắn tràn quá 1 trang, giống trường hợp lỗi lần này) với layout 2 cột
(`classic_2col_dotted`/`learning_stations`/`adventure_map` - 3 layout có `columns: 2`), bấm "In /
Tải PDF", kiểm tra kỹ: (1) không còn chữ đè lên nhau ở ranh giới trang, (2) không có box nào bị cắt
ngang giữa chừng (lỗi gốc ban đầu), (3) không bị tràn ngang biên cột. Nếu vẫn còn vấn đề, cần chụp
ảnh gửi lại kèm rõ ĐÚNG trang/vị trí lỗi để tiếp tục chẩn đoán.

---

## 0.-1. MỚI NHẤT (giai đoạn 9, Bước 1/3 — Tầng A) — ĐÃ SỬA 5 việc "sửa nhanh, không đổi kiến
## trúc" theo đúng thứ tự đã thống nhất ở mục 0.5 (đọc lại phần LỊCH SỬ mục 0 bên dưới để hiểu bối
## cảnh ĐÁNH GIÁ dẫn tới các việc này). Bước 2 (catalog theo chủ đề SGK) và Bước 3 (Tiếng Việt)
## CHƯA làm - xem "Việc CHƯA làm" bên dưới.

### 1. Sửa vỡ layout 2 cột (`WorksheetPreview.jsx`)
Thay CSS `column-count: 2` (kiểu "đổ chữ như báo", có thể cắt ngang giữa 1 khối bài tập) bằng chia
**2 cột thật**: `worksheet.sections` được tách thành 2 mảng con (`splitIntoTwoColumns()` - nửa đầu
cột trái, nửa sau cột phải, kiểu đọc báo truyền thống) và render bằng 2 `<div>` flex riêng biệt -
mỗi `ExerciseBox` giờ LUÔN nằm trọn vẹn trong đúng 1 cột, không thể bị cắt ngang như bug cũ (đúng
hiện tượng ảnh giáo viên gửi: khối "Nhận diện hình" tràn ra ngoài mép phải khung A4). Tách phần
render 1 `ExerciseBox` thành component `RenderedExerciseBox` dùng chung cho cả 2 nhánh (1 cột/2
cột) để không lặp code.

### 2. Mở rộng kho hình (mục 7 "Nhận diện hình" / mục 8 "Đếm hình") — sửa lỗi luôn lặp y hệt
**Gốc rễ đã xác nhận ở giai đoạn 9**: kho `SHAPES` cũ có ĐÚNG 6 phần tử, trùng khớp `defaultCount`
mặc định (cũng 6) → `slice(0, 6)` trên mảng 6 phần tử luôn lấy hết cả mảng, random chỉ đảo thứ tự
chứ không đổi nội dung.
- `src/data/worksheetSchemas.js`: `SHAPES` mở rộng 6 → **14** (thêm: Hình thoi, Hình ê-líp, Hình
  ngũ giác, Hình lục giác, Hình bán nguyệt, Hình thang, Hình mũi tên, Hình đám mây).
- `src/data/worksheetExerciseCatalog.js`: `defaultCount` của `nhan_dien_hinh` đổi 6 → **5** (nhỏ
  hơn hẳn kích thước kho mới) - đảm bảo LUÔN có hình "vắng mặt" mỗi lần tạo phiếu, tạo khác biệt
  thật thay vì chỉ đảo thứ tự. `generateNhanDienHinh()` vẫn giữ `Math.min(count, SHAPES.length)`
  để an toàn tuyệt đối dù giáo viên tự gõ số lớn hơn kho.
- `generateDemHinhUngDung()` (mục 8): thêm cơ chế trộn **1-2 hình gây nhiễu** (khoảng 50% số lần
  tạo phiếu) vào khay đếm, lấy từ phần kho KHÔNG nằm trong danh sách mục 7 - hình nhiễu CHỈ xuất
  hiện trong khay, KHÔNG có câu hỏi "Có bao nhiêu Hình X?" tương ứng - giúp học sinh phải thực sự
  phân biệt hình đúng thay vì đếm máy móc mọi thứ trong khay.
- `ShapeIcon` (`WorksheetPreview.jsx`, web) và `SHAPE_GLYPHS` (`worksheetExportService.js`, Word)
  đều đã thêm đủ 8 hình mới (SVG path cho web, glyph Unicode cho Word: ◇ ⬭ ⬠ ⬡ ◠ ⏢ ➤ ☁).

### 3. Mở rộng kho icon đếm số (mục 2 "Đếm và viết số")
`ICONS` trong `worksheetSchemas.js` mở rộng 7 → **16** (thêm 🐟🎈🍭🚀🐢🧸🍪🌸🐝), export ra
`AVAILABLE_ICONS` giữ nguyên tên cũ (không phá vỡ chỗ dùng khác nếu có).

### 4. Sửa bài toán có lời văn (mục 9) bị "công thức hoá" (mô-típ thỏ+cà rốt+gà lặp lại)
`worksheetGenerator.js` thêm `WORD_PROBLEM_THEME_BANK` (24 tổ hợp nhân vật+bối cảnh đa dạng: con
vật, con người, đồ vật, bối cảnh khác nhau - không chỉ động vật nông trại). **CODE (không phải
AI) chọn ngẫu nhiên** đúng N chủ đề PHÂN BIỆT (hàm `pickWordProblemThemes()`, export để test được)
TRƯỚC khi gọi AI - đảm bảo phân bố đều, không lệ thuộc "thói quen" của AI khi tự chọn. Prompt
(`buildWordProblemPrompt()`, cũng export để test) giờ liệt kê ĐÚNG danh sách chủ đề đã chọn sẵn
theo thứ tự, yêu cầu AI **BẮT BUỘC** viết bài toán thứ i theo đúng chủ đề thứ i (không đổi chéo,
không tự ý thay chủ đề khác), kèm câu nhắc rõ tránh quay lại mô-típ thỏ ăn cà rốt/gà con nếu chủ
đề không yêu cầu.

### 5. Sửa hành vi "phiếu mẫu tham khảo" — tự động áp dụng cấu trúc mẫu, không còn chờ bấm nút phụ
**Gốc rễ đã xác nhận ở giai đoạn 9**: `detectedExercises` đã có sẵn nhưng TRƯỚC ĐÂY giáo viên phải
tự bấm 1 nút phụ "Áp dụng cấu trúc từ phiếu mẫu" - quên bấm thì phiếu vẫn sinh theo cấu hình mặc
định cũ, không liên quan gì mẫu vừa tải lên.
- Tách logic thuần (không đụng React state) ra module mới **`src/services/worksheetSampleStructureUtils.js`**
  (`defaultCountsFor()`, `applyDetectedExercisesToCounts()`) - để có thể tự verify bằng script gọi
  hàm trực tiếp (file `WorksheetForm.jsx` có cú pháp JSX, không import thẳng vào Node script được).
- `WorksheetForm.jsx`: ngay sau khi phân tích phiếu mẫu xong (`handleSampleFileChange`), nếu
  `sampleSpec.detectedExercises.length > 0` → **tự động áp dụng NGAY** (ghi đè hẳn `exerciseCounts`,
  KHÔNG cộng dồn), đồng thời lưu snapshot `exerciseCounts` TRƯỚC đó vào `preSampleExerciseCounts`
  để có thể đảo lại chính xác.
- UI hiện banner rõ ràng: "✅ Đã áp dụng cấu trúc từ phiếu mẫu (N dạng bài)" kèm nút "Dùng cấu hình
  mặc định thay vào đó" (gọi `revertToDefaultStructure()` - đảo lại đúng snapshot, hoặc
  `defaultCountsFor()` nếu không có snapshot). Nếu giáo viên đã đảo lại nhưng đổi ý, có nút "Áp
  dụng lại cấu trúc từ phiếu mẫu" (`reapplySampleStructure()`) để bật lại.
- Bỏ chọn file mẫu (`clearSample()`) → nếu vừa tự động áp dụng cấu trúc mẫu, tự đảo lại đúng
  `exerciseCounts` trước đó, tránh giáo viên bối rối vì số liệu trên form không còn liên quan gì
  đến file vừa bỏ.
- **LƯU Ý**: hành vi cũ "thứ tự khối bài tự động theo mẫu NGẦM" (`computeSectionOrder()` trong
  `worksheetGenerator.js`) giữ nguyên KHÔNG đổi - việc sửa lần này chỉ liên quan đến SỐ LƯỢNG câu
  mỗi dạng bài (`exerciseCounts`), là phần trước đây cần bấm nút phụ.

### Đã tự xác minh thật (không chỉ đọc code) cho cả 5 việc trên
- `npm run build` (Next.js 14.2.35): build sạch, không lỗi type/lint, route mới không ảnh hưởng.
- `npm test`: vẫn **47/47 pass** - không có test cũ nào bị hỏng bởi các thay đổi lần này.
- Viết 5 script riêng, gọi hàm trực tiếp qua `node --import ./test/register-loader.mjs` (không
  chỉ đọc code), đã chạy PASS rồi mới báo hoàn thành:
  1. `generateNhanDienHinh(5)` gọi 200 lần → **191/200 tổ hợp hình KHÁC NHAU** (trước đây luôn ra
     đúng 1 tổ hợp duy nhất - đảo thứ tự); `generateNhanDienHinh(999)` (vượt kho) trả đúng 14, an
     toàn không lỗi. `generateDemHinhUngDung()` gọi 200 lần → **94/200 lần có hình nhiễu** (~50%,
     đúng thiết kế), và xác nhận CHẶT: không có câu hỏi nào hỏi về hình KHÔNG nằm trong mục 7.
  2. `AVAILABLE_ICONS.length = 16`; gọi `generateDemVaVietSo()` 100 lần → 16/16 icon khác nhau đều
     xuất hiện (đúng toàn bộ kho được dùng tới, không icon nào "chết").
  3. `pickWordProblemThemes(5)` → 5 chủ đề phân biệt; gọi 50 lần → 21 giá trị "chủ đề đầu tiên"
     khác nhau (đủ ngẫu nhiên, không lặp lại 1 bộ cố định); `pickWordProblemThemes(30)` (> kích
     thước kho 24) vẫn trả đúng 30, không lỗi. `buildWordProblemPrompt()` với 3 chủ đề mẫu → xác
     nhận prompt CHỨA ĐỦ cả 3 chủ đề, CÓ câu lệnh "BẮT BUỘC"/"KHÔNG được đổi chéo", CÓ nhắc tránh
     mô-típ "thỏ ăn cà rốt"; gọi với `themes=[]` không crash.
  4. `applyDetectedExercisesToCounts()`: ghi đè đúng số lượng theo spec mẫu (VD tinh_nham=8,
     so_sanh=3), CÁC dạng bài không có trong mẫu tự động về 0 (xác nhận ghi đè hoàn toàn, không
     cộng dồn); key lạ trong spec bị bỏ qua an toàn không lỗi; `spec=null` → tất cả về 0 không
     throw; `defaultCountsFor()` khớp đúng `defaultCount` khai báo trong catalog.
  5. Gọi thẳng `generateWorksheet()` với `layoutId: "classic_2col_dotted"` (columns=2), đủ các
     dạng bài code-sinh (không gọi AI, tránh phụ thuộc `GEMINI_API_KEYS` không có trong sandbox) →
     xác nhận `layout.columns === 2`; mô phỏng lại đúng `splitIntoTwoColumns()` trên kết quả thật
     → **không mất/lặp mục nào** giữa 2 cột (tổng khớp, index không trùng); `dem_hinh_ung_dung`
     vẫn đứng ngay sau `nhan_dien_hinh` (hành vi cũ giữ nguyên); `nhan_dien_hinh` sinh ra đúng 5
     hình (không phải 14 - xác nhận defaultCount mới có hiệu lực thật, không chỉ khai báo suông).

### Việc CHƯA làm — cần làm ở phiên tiếp theo
1. **Chưa xem bằng mắt trên trình duyệt thật** - đặc biệt layout 2 cột mới (khác cơ chế multi-
   column cũ, cần xác nhận cảm giác thị giác/căn chỉnh chiều cao 2 cột không đều nhau có ổn không)
   và banner mới "Đã áp dụng cấu trúc từ phiếu mẫu" (vị trí, không bị rối với các banner khác).
2. **Chưa gọi Gemini THẬT** cho bài toán có lời văn (mục 9) - sandbox không có `GEMINI_API_KEYS`.
   Cần bạn tự chạy `npm run dev` với key thật, tạo nhiều phiếu liên tiếp có "Giải toán có lời văn",
   kiểm tra AI có thực sự TUÂN THỦ đúng chủ đề đã ép theo `themeListBlock` hay vẫn "lách" quay về
   mô-típ quen thuộc bất chấp chỉ dẫn (tỉ lệ tuân thủ thực tế qua nhiều lần sinh, không thể biết
   chắc chỉ bằng đọc prompt).
3. **Chưa test thật với 1 phiếu mẫu ảnh/PDF thật** cho luồng tự động áp dụng cấu trúc (mục 5) -
   script verify chỉ test hàm logic thuần với spec giả lập, chưa xác nhận toàn bộ luồng thật từ
   upload file → gọi AI phân tích (`analyzeWorksheetSampleRequest`) → nhận `detectedExercises` →
   tự động áp dụng → hiển thị banner đúng trên UI thật.
4. Chưa viết test tự động (`node --test`) riêng cho 5 việc sửa lần này vào bộ `test/*.test.js` -
   mới verify bằng 5 script gọi hàm thủ công trong phiên làm việc (đã xoá sau khi verify xong,
   không nằm trong repo) - nếu muốn các thay đổi này được bảo vệ khỏi hồi quy về sau, cần viết lại
   thành test chính thức.
5. **Bước 2 (Tầng B - catalog theo chủ đề SGK cho Toán) và Bước 3 (áp dụng cho Tiếng Việt) CHƯA
   làm** - đây là việc kiến trúc lớn hơn nhiều so với Bước 1, cần thống nhất riêng danh sách chủ đề
   ưu tiên theo đúng thứ tự SGK Lớp 1/Lớp 2 hiện hành trước khi bắt tay code (xem lại mục 0.5 bên
   dưới - phần "Bước 2"/"Bước 3" - để nhớ đúng kế hoạch đã thống nhất với giáo viên).
6. `.gitignore` - vẫn cần bạn tự xác nhận đã có trên máy/repo GitHub thật hay chưa (nhắc lại từ
   nhiều phiên trước, vẫn ưu tiên cao nếu chưa làm).

---

## 0. LỊCH SỬ (giai đoạn 9, phần ĐÁNH GIÁ ban đầu) — ĐÁNH GIÁ (chưa code lúc đó) module "📝 Phiếu
## bài tập" sau khi giáo viên test thật + gửi PDF phiếu đã tạo + 1 phiếu mẫu tham khảo ngoài đời
## (cô Hồng Đây, lớp 2) — TOÀN BỘ nội dung mục 0.x bên dưới đây là NGUYÊN VĂN đánh giá gốc (giữ lại
## để hiểu bối cảnh/gốc rễ từng lỗi) - phần ĐÃ SỬA thật cho Bước 1 nằm ở mục "0.-1." phía trên.


**⚠️ QUAN TRỌNG: phiên này CHỈ ĐÁNH GIÁ, CHƯA SỬA CODE GÌ.** Mọi phát hiện dưới đây đã được xác
minh bằng cách đọc trực tiếp code liên quan (không đoán) + đối chiếu với 3 file PDF thật giáo
viên gửi (`toan_1.pdf`, `toan_2.pdf`, `toan_3.pdf`) và 2 ảnh chụp UI/phiếu mẫu tham khảo. Việc
SỬA sẽ làm ở phiên tiếp theo, theo đúng trình tự đã thống nhất ở mục 0.5 bên dưới.

### 0.1. Lỗi 1 — Mục "Nhận diện hình" (mục 7) và "Đếm hình" (mục 8) LUÔN lặp lại y hệt
**Xác nhận bằng cách đọc code, không phải suy đoán xác suất:**
```js
// src/data/worksheetSchemas.js
const SHAPES = ["Hình tròn","Hình vuông","Hình tam giác","Hình chữ nhật","Hình ngôi sao","Hình trái tim"]; // ĐÚNG 6 hình
export function generateNhanDienHinh(count = 6) {
  return [...SHAPES].sort(() => Math.random() - 0.5).slice(0, count); // count mặc định = 6 = toàn bộ kho
}
```
Kho hình có ĐÚNG 6 phần tử, `count` mặc định cũng là 6 → `slice(0, 6)` trên mảng 6 phần tử luôn
lấy hết cả mảng. Random ở đây chỉ đảo THỨ TỰ, không đảo NỘI DUNG — với thiết lập mặc định, mục 7
không có khả năng ra hình khác. Đối chiếu 3 PDF: cả 3 phiếu đều hiện đúng 6/6 hình (Tròn, Vuông,
Tam giác, Chữ nhật, Ngôi sao, Trái tim), chỉ khác thứ tự + màu viền theo theme phiếu — khớp 100%
với nguyên nhân code trên.

Mục 8 (`generateDemHinhUngDung`) nhận `shapes` CHÍNH LÀ output của mục 7 làm input → khay hình
mục 8 cũng luôn gồm y hệt 6 hình đó, chỉ số lượng mỗi loại (2-5) và câu hỏi là random.

### 0.2. Lỗi 2 — Bài toán có lời văn (mục 9) bị "công thức hoá" ngữ cảnh (AI, không phải kho cố định)
Đối chiếu 3 PDF, mô-típ **thỏ + cà rốt + gà** lặp lại xuyên suốt cả 3 phiếu (thỏ ăn cà rốt / thỏ
nâu ăn cà rốt / thỏ bố nhổ cà rốt; gà con chạy chuồng / trứng gà / gà). AI có "vùng an toàn" từ
vựng hẹp khi tự sáng tác ngữ cảnh cho mầm non/lớp 1 — khó sửa bằng cách mở mảng đơn giản như lỗi
1, cần ép AI bốc ngẫu nhiên từ 1 "ngân hàng chủ đề/nhân vật/đơn vị đếm" đa dạng trước khi viết đề.

### 0.3. Lỗi 3 — Phiếu mẫu tham khảo: chỉ lấy style, bỏ qua cấu trúc bài tập mẫu (đã có hạ tầng,
### nhưng KÍCH HOẠT SAI CÁCH)
Hệ thống ĐÃ CÓ `detectedExercises` (đọc từ mẫu: dạng bài nào + số lượng khoảng bao nhiêu câu, key
thật khớp `worksheetExerciseCatalog.js`) nhưng **không tự áp dụng** — giáo viên phải tự bấm nút
phụ "Áp dụng cấu trúc từ phiếu mẫu" (`WorksheetForm.jsx` dòng ~297-499); nếu quên bấm, phiếu vẫn
sinh theo `exerciseCounts` mặc định cũ (khởi tạo sẵn cho Lớp 1/Toán), không liên quan gì đến mẫu
vừa tải lên. Đây đúng là điều giáo viên phản ánh "hệ thống phớt lờ mẫu tôi đưa vào" — gốc rễ là
hành vi kích hoạt (default = im lặng chờ bấm) sai, không phải thiếu tính năng.

### 0.4. Lỗi 4 (MỚI phát hiện qua ảnh UI) — Vỡ layout khi bật 2 cột
**Xác nhận qua đọc code:** `WorksheetPreview.jsx` dùng CSS `column-count: 2` (kiểu "đổ chữ như
báo") để chia 2 cột khi `layout.columns === 2`:
```js
style={ layout.columns === 2 ? { columnCount: 2, columnGap: 22 } : undefined }
```
`column-count` không đảm bảo 1 khối HTML giữ nguyên hình dạng — khi cột báo cắt ngang qua giữa
khối "Nhận diện hình"/"Đếm hình" (chứa nhiều icon SVG nhỏ xếp `flex-wrap`), khối bị tràn ra ngoài
biên cột/khỏi trang. Ảnh giáo viên gửi cho thấy đúng hiện tượng này: hộp mục 6 tràn hẳn ra ngoài
mép phải khung A4. Đã kiểm tra CSS `.a4-page` (padding/kích thước 210mm) hoàn toàn đúng chuẩn —
cảm giác "không full khổ giấy A4" giáo viên nói CHỈ LÀ HỆ QUẢ THỊ GIÁC của lỗi tràn cột này, không
phải lỗi khổ giấy thật. Hướng sửa: thay `column-count` bằng CSS Grid 2 cột thật
(`grid-template-columns: 1fr 1fr`) để mỗi ô luôn là 1 khối trọn vẹn, không bị cắt ngang.

### 0.5. Phát hiện QUAN TRỌNG NHẤT (kiến trúc, không phải bug nhỏ) — catalog "kỹ năng chung" ≠
### nhu cầu thật "bám sát chủ đề/bài học SGK theo từng thời điểm năm học"
Giáo viên gửi 1 phiếu mẫu tham khảo thật đang dùng ngoài đời ("Đổi đơn vị đo độ dài" - lớp 2, cô
Hồng Đây): toàn bộ 5 mục trong phiếu (điền số đổi đơn vị m/dm/cm, so sánh, sắp xếp, giải toán,
nối) đều xoay quanh ĐÚNG 1 chủ đề SGK cụ thể, kèm khung "Ghi nhớ" công thức. Đối chiếu hệ thống
hiện tại:
- Ô "Bài/Chương SGK (tuỳ chọn)" đã tồn tại trong `WorksheetForm.jsx` nhưng **chỉ ảnh hưởng ngữ
  cảnh của riêng mục "Giải toán có lời văn"** (xem `worksheetGenerator.js: resolveSgkChapterContext`)
  — 8/9 dạng bài còn lại (Tính nhẩm, So sánh, Dãy số, Sắp xếp, Nối phép tính, Nhận diện hình...)
  là catalog KỸ NĂNG CHUNG cố định, hoàn toàn không đổi dù chọn chương/bài nào.
- **Phần "📖 Đề Tiếng Việt Tiểu học" cũng bị đúng vấn đề tương tự** (giáo viên xác nhận, đã kiểm
  tra: `VietnameseExamForm.jsx` không có bất kỳ ô chọn SGK/chương/bài nào) — 4 khối (Đọc thành
  tiếng/Đọc thầm/Chính tả/Tập làm văn) sinh theo khối lớp chung chung, không bám theo tiến độ dạy
  thực tế (bài/chủ điểm cụ thể trong SGK Tiếng Việt).

**Kết luận đã thống nhất với giáo viên**: đây LÀ vấn đề kiến trúc thật (giáo viên đồng ý), không
phải thiếu đa dạng ngẫu nhiên. Kiến trúc hiện tại dừng ở tầng "luyện kỹ năng nền tảng" (hợp Mầm
non/đầu Lớp 1), chưa theo kịp mạch nội dung SGK Lớp 1-2 thật (đo lường đơn vị, tiền Việt Nam, thời
gian, hình học có số đo, và bên Tiếng Việt là các chủ điểm/bài đọc cụ thể theo từng tuần/chương).

### QUY TRÌNH THỰC HIỆN Ở PHIÊN TIẾP THEO (đã thống nhất với giáo viên, làm theo đúng thứ tự,
### KHÔNG nhảy cóc — mỗi bước xong mới sang bước sau, có xác nhận lại trước khi đi tiếp)

**Bước 1 — Tầng A: sửa nhanh, không đổi kiến trúc (làm trước, để có bản dùng được ngay)**
1. Sửa lỗi vỡ layout 2 cột: đổi `column-count` → CSS Grid 2 cột thật trong `WorksheetPreview.jsx`.
2. Mở rộng kho hình (Toán, mục 7/8): 6 → ~14-16 hình (thêm SVG: thoi, ê-líp, ngũ giác, lục giác,
   bán nguyệt, hình thang, mũi tên, đám mây...); đổi mặc định chỉ chọn 4-5/kho lớn (không phải
   toàn bộ kho) để đảm bảo luôn có phần hình "vắng mặt" tạo khác biệt thật giữa các lần tạo; khay
   đếm (mục 8) thỉnh thoảng trộn thêm 1-2 hình gây nhiễu ngoài danh sách mục 7.
3. Mở rộng kho icon đếm số (mục 2, hiện chỉ 7 icon cố định).
4. Sửa bài toán có lời văn (mục 9): xây "ngân hàng chủ đề/nhân vật/đơn vị đếm" đa dạng, ép AI bốc
   ngẫu nhiên 1 tổ hợp trước khi viết đề, tránh AI tự co về thỏ/cà rốt/gà.
5. Sửa hành vi phiếu mẫu tham khảo: tự động áp dụng `detectedExercises` NGAY sau khi phân tích
   xong (không chờ bấm nút phụ), ghi đè hẳn `exerciseCounts` mặc định cũ (không cộng dồn); hiện
   banner rõ ràng "Đã áp dụng cấu trúc từ phiếu mẫu (N dạng bài)" kèm nút "Dùng cấu hình mặc định
   thay vào đó" để đảo lại nếu giáo viên muốn.
6. Sau khi xong: tự verify bằng script gọi hàm thủ công (như các phiên trước) + báo cáo lại trước
   khi sang Bước 2.

**Bước 2 — Tầng B: mở rộng catalog "Phiếu bài tập" theo CHỦ ĐỀ SGK (việc lớn, kiến trúc mới)**
> ✅ ĐỢT 1 (Lớp 1: "Độ dài" + "Thời gian") ĐÃ LÀM - xem mục "0.-3." ở đầu file. ĐỢT 2 (Lớp 2: Đo
> lường + Tiền Việt Nam + Thời gian + Hình học có số đo) CHƯA làm - còn nguyên kế hoạch gốc bên
> dưới, làm ở lượt kế tiếp.
- Thêm nhóm "dạng bài theo chủ đề" mới cho môn Toán, đi theo tiến độ SGK Lớp 1-2 thật, ví dụ: Đo
  lường (đổi đơn vị độ dài m/dm/cm, khối lượng kg/g, dung tích l/ml), Tiền Việt Nam (đọc/đổi mệnh
  giá, tính tiền mua-bán đơn giản), Thời gian (xem đồng hồ, ngày-tháng, thứ trong tuần), Hình học
  có số đo (chu vi hình đơn giản). Mỗi chủ đề là 1 "gói" gồm nhiều dạng bài nhỏ xoay quanh nó
  (giống đúng cấu trúc phiếu mẫu cô Hồng Đây), thay vì giáo viên tự chọn rời rạc từng kỹ năng.
- Ô "Bài/Chương SGK" hiện có sẽ thực sự điều khiển catalog nào hiện ra (không chỉ ảnh hưởng riêng
  mục giải toán như hiện tại).
- Trước khi code Bước 2: cần thống nhất RIÊNG 1 danh sách chủ đề ưu tiên theo đúng thứ tự SGK
  Lớp 1/Lớp 2 hiện hành (Kết nối tri thức / Cánh diều / Chân trời sáng tạo - tuỳ bộ sách giáo viên
  đang dùng) trước khi bắt tay viết generator cho từng chủ đề.

**Bước 3 — Áp dụng cùng logic "bám sát chủ đề SGK" cho phần "📖 Đề Tiếng Việt Tiểu học"**
- Giáo viên xác nhận phần này cũng thiếu liên kết SGK/chương/bài y hệt Toán.
- Làm SAU Bước 2 (Toán) để tái dùng lại đúng khuôn kiến trúc đã kiểm chứng, tránh làm 2 lần theo
  2 cách khác nhau. Cụ thể hoá danh sách chủ điểm/bài đọc theo SGK Tiếng Việt sẽ bàn ở phiên riêng
  khi tới bước này.

**Lưu ý xuyên suốt**: mỗi bước nhỏ trong Bước 1 sau khi sửa xong đều cần tự verify bằng script gọi
hàm trực tiếp (không chỉ đọc code) trước khi báo hoàn thành — đúng tinh thần đã áp dụng nhất quán
ở các giai đoạn trước với module giáo án.

---

## 0.6. LỊCH SỬ — giai đoạn 8: sửa 5 phản ánh giáo viên sau khi DẠY THỬ giáo án AI sinh ra
Bối cảnh: khác các phiên trước (giáo viên test tay, nhìn giao diện), lần này giáo viên đã ĐEM GIÁO
ÁN RA DẠY THỬ THẬT và phản hồi rất cụ thể theo từng phần I/II/III/IV. Tóm tắt 5 vấn đề + cách sửa:

**a) Lỗi cộng sai thời lượng + gộp nhiều tiết thành 1 mạch (ĐÃ SỬA - lỗi nghiêm trọng nhất)**
Xác nhận đúng: bài 2 tiết x 40 phút = 80 phút, nhưng `computeActivityTimeline()` cũ dùng
`Math.round()` ĐỘC LẬP cho từng hoạt động (11.43→11, 34.28→34, 22.86→23, 11.43→11) → tổng 79, lệch
1 phút. Đã viết lại bằng thuật toán "largest remainder" (`distributeMinutesExact()` trong
`lessonPlanTemplates.js`) - tổng LUÔN khớp chính xác. Đồng thời thêm `computeMultiPeriodTimeline()`:
tính phân bổ RIÊNG cho TỪNG TIẾT (mỗi tiết tự đủ đúng số phút/tiết), theo đúng tinh thần giáo viên
đề xuất (Tiết 1: Khởi động + Khám phá/Hệ thống hoá + Luyện tập phần đầu; Tiết cuối: Khởi động lại
ngắn + Luyện tập phần sau + Vận dụng). AI được yêu cầu gắn trường `"tiet"` cho mỗi bước trong
`tienTrinh`; `LessonPlanPreview.jsx`/`lessonPlanExportService.js` THUẦN CODE chèn vạch "── Hết Tiết
N (nghỉ giải lao) — Chuyển sang Tiết N+1 ──" ngay tại điểm "tiet" tăng lên, cả trên web lẫn file
Word xuất ra - giáo viên giờ nhìn thấy rõ điểm dừng để chèn giải lao giữa các tiết.

**b) Tên hoạt động "Khám phá" chưa đúng bản chất với bài Ôn tập (ĐÃ SỬA)**
Thêm `LESSON_TYPES` (Bài mới / Ôn tập-Luyện tập / Thực hành-Trải nghiệm) trong
`lessonPlanTemplates.js` + `getActivityLabels(lessonType)`. Khi chọn "Ôn tập", hoạt động thứ 2 tự
đổi tên thành "Hệ thống hoá kiến thức" (không còn cứng "Khám phá" cho MỌI bài như trước) - và
prompt nhắc rõ AI KHÔNG được viết giọng "khám phá điều mới lạ" cho bài ôn tập. Đã nối UI chọn "Loại
bài" trong `LessonPlanForm.jsx` (ẩn với Mầm non) xuyên suốt blueprint → route → orchestrator →
engine → prompt.

**c) Khởi động quá dài (11 phút) + Tích hợp Năng lực số thiếu khả thi (ĐÃ SỬA)**
Hệ quả trực tiếp của lỗi (a): `computeMultiPeriodTimeline()` áp trần 7 phút (tiết đầu) / 6 phút
(tiết sau) cho MỖI LẦN xuất hiện của "Khởi động" (không phụ thuộc tổng số tiết như thuật toán cũ) -
phần dư dồn sang Luyện tập/Khám phá, tổng vẫn khớp chính xác. Đồng thời sửa hướng dẫn "Tích hợp
NLS" trong `lessonPlanIntegrations.js`: MẶC ĐỊNH thiết kế theo hướng giáo viên trình chiếu/thao tác
trên 1 máy chiếu chung, KHÔNG mặc định mỗi học sinh có máy tính bảng riêng tại lớp (trừ khi rõ ràng
học ở phòng Tin học) - hoặc chuyển thành nhiệm vụ Vận dụng làm ở nhà cùng phụ huynh.

**d) Thiếu nội dung cụ thể của "Phiếu học tập" đính kèm (ĐÃ SỬA)**
Thêm integration mới `phieuHocTap` (bật MẶC ĐỊNH cho user mới) trong `lessonPlanIntegrations.js`:
AI soạn CỤ THỂ 4-8 bài tập/câu hỏi (đổi số liệu/ngữ cảnh so với ví dụ đã dùng trên lớp, không lặp
lại y hệt), trả về `phieuHocTap: { tieuDe, huongDan, baiTap: [...] }`. Hiển thị thành phụ lục có
dòng kẻ chấm để học sinh viết trực tiếp (web: `PhieuHocTapBlock` trong `LessonPlanPreview.jsx`; Word:
phần "PHỤ LỤC: ..." ngắt trang riêng trong `lessonPlanExportService.js`) - giáo viên photo dùng
ngay, không cần tự soạn thêm.

### Đã tự xác minh thật (không chỉ đọc code)
- `npm run build` (Next.js 14.2.35): build sạch, không lỗi type/lint.
- `npm test`: **47/47 pass** (38 test cũ không hỏng + 9 test MỚI viết riêng cho phiên này trong
  `test/lessonPlanFixes.test.js` - đã đưa vào bộ chạy lại được mỗi lần `npm test`, khác các phiên
  trước chỉ verify bằng script gọi hàm thủ công một lần).
- Test mới bao phủ: (1) tổng `computeActivityTimeline()` khớp chính xác nhiều tổ hợp
  tiết/khối lớp; (2) mỗi tiết trong `computeMultiPeriodTimeline()` tự đủ đúng phút, Khởi động không
  vượt trần, chỉ tiết đầu có Khám phá/chỉ tiết cuối có Vận dụng, tiết sau là "Khởi động lại"; (3)
  `getActivityLabels()` đổi tên đúng theo lessonType; (4) `buildLessonPlanPrompt()` có/không có
  hướng dẫn ranh giới tiết đúng theo soTiet, tên hoạt động đúng theo lessonType, vẫn giữ quy tắc cấm
  LaTeX; (5) `buildLessonPlanDocxSections()` sinh file `.docx` THẬT (giải nén bằng JSZip, soi XML)
  có vạch "Hết Tiết 1", có phụ lục "PHỤ LỤC: Phiếu học tập số 1", không còn `\n` thô (có `<w:br/>`
  thật), và bài 1 tiết thì KHÔNG có vạch ranh giới thừa.

### Việc CHƯA làm — cần bạn tự làm ở phiên tiếp theo hoặc khi có API key thật
1. **Chưa gọi Gemini THẬT** với "Loại bài"/nhiều tiết/Phiếu học tập - sandbox không có
   `GEMINI_API_KEYS`. Cần bạn tự chạy `npm run dev` với key thật, thử bài "Ôn tập số tự nhiên" 2
   tiết, kiểm tra: (a) AI có thực sự gắn đúng trường `"tiet"` cho các bước hay bỏ qua yêu cầu (đã
   có cảnh báo tự động trong `lessonPlanOrchestrator.js` nếu AI bỏ qua, nhưng cần xem tỉ lệ tuân
   thủ thực tế qua nhiều lần sinh); (b) nội dung "Khởi động lại" ở tiết 2 có thực sự ngắn gọn/khác
   khởi động chính không; (c) nội dung Phiếu học tập có bám sát bài học và KHÔNG trùng y hệt ví dụ
   đã dùng ở Luyện tập không.
2. Chưa xem bằng mắt trên trình duyệt thật - form giờ có thêm ô "Loại bài" và mặc định bật thêm
   tích hợp "Phiếu học tập", cần xác nhận giao diện/luồng chọn không bị rối.
3. Ranh giới "Hết Tiết" hiện được chèn dựa vào trường `"tiet"` AI tự gắn theo từng BƯỚC trong TỪNG
   HOẠT ĐỘNG riêng lẻ (không phải sắp xếp lại toàn bộ tài liệu theo trình tự thời gian thực tế giữa
   4 khối hoạt động) - đây là lựa chọn có chủ đích để giữ đúng cấu trúc 4 mục I/II/III/IV chuẩn
   CV2345 mà Ban Giám hiệu quen thuộc, thay vì đảo lộn thành "Tiết 1 / Tiết 2" ở cấp cao nhất. Nếu
   giáo viên phản hồi vẫn muốn cấu trúc theo tiết ở cấp cao nhất (khác chuẩn CV2345), đây là điểm
   cần bàn lại kiến trúc, không phải sửa nhỏ.
4. `.gitignore` - vẫn cần bạn tự xác nhận đã có trên máy/repo GitHub thật hay chưa (nhắc lại từ các
   phiên trước, vẫn ưu tiên cao nếu chưa làm).

---

## 1. Tổng quan
Next.js 14 (App Router) app tạo đề kiểm tra + phiếu bài tập + giáo án bằng AI cho giáo viên Việt
Nam, mục tiêu chi phí vận hành **$0**. Deploy Vercel. AI backbone: Gemini (`gemini-3.5-flash`, SDK
`@google/genai`) qua pool nhiều API key.

**4 mode trong `page.js`**, chỉ 1 mount tại 1 thời điểm (dùng chung `id="print-area"`):
1. **📝 Đề kiểm tra** (Lớp 1-12) — luồng gốc, đầy đủ nhất, ổn định nhất.
2. **🧮 Phiếu bài tập** (Mầm non - Lớp 2) — sinh số liệu chủ yếu thuần code, không cần AI.
3. **📘 Soạn giáo án** (Mầm non - Lớp 5) — 8 "tích hợp" tuỳ chọn kiểu plugin
   (`lessonPlanIntegrations.js`) + giờ có thêm **giáo án mẫu** (xem mục 3 bên dưới).
4. **📖 Đề Tiếng Việt Tiểu học** (Lớp 1-5) — 4 khối A. Đọc thành tiếng / A. Đọc thầm / B. Chính tả /
   B. Tập làm văn, đủ 4/4 khối đã implement (xem mục 4).

## 2. Cấu trúc thư mục (đã cập nhật với các file MỚI của phiên làm việc này)
```
src/
├── app/{page.js, api/{login,chapters,generate,generate-worksheet,generate-lesson-plan,
│        generate-vietnamese-exam,usage,analyze-sample,analyze-worksheet-sample,
│        analyze-lesson-plan-sample [MỚI],worksheet-preference}}
├── components/{Header,LoginForm,UsageWidget,ExamMatrixForm,A4LivePreview,ExportActions,
│        WorksheetForm,WorksheetPreview,WorksheetExportActions,
│        LessonPlanForm (sửa),LessonPlanPreview (sửa),LessonPlanExportActions,
│        VietnameseExamForm,VietnameseExamPreview,vietnameseBlocks/*,
│        visuals/{VerticalArithmetic,NumberTriangle,BarModel,VisualCounting,ScratchGrid,QuestionVisual}}
├── services/{apiClient (sửa),authService,apiAuth,sessionToken,passwordUtils,loginRateLimiter,
│        githubService,geminiEngine,geminiKeyPool,geminiUsageTracker,examOrchestrator,
│        exportService,visualExportBuilders,specificationBuilder,specificationExportBuilders,
│        xmlEscapeUtils,latexUtils,worksheetGenerator,worksheetExportService,
│        worksheetSampleAnalyzer,worksheetSampleCache,worksheetSampleStructureUtils [MỚI - GĐ9
│        Bước 1],sampleExamAnalyzer,sampleExamCache,
│        teacherPreferenceStore,questionBankStore,upstashClient,
│        lessonPlanEngine (sửa),lessonPlanOrchestrator (sửa),lessonPlanExportService (sửa),
│        lessonPlanSampleAnalyzer [MỚI],lessonPlanSampleCache [MỚI],
│        fileTextExtractors,scoringUtils(không dùng),
│        vietnameseExamOrchestrator,vietnameseBlocks/*}
└── data/{config,constants,gradeProfiles,subjectProfiles,promptTemplates,visualSchemas,
        sampleExamSchema,worksheetSampleSchema,worksheetSchemas,worksheetExerciseCatalog,
        worksheetTopicPackages [MỚI - GĐ9 Bước 2],
        worksheetLayoutTemplates,lessonPlanBlueprint (sửa),lessonPlanResult,
        lessonPlanTemplates,lessonPlanPromptTemplates (sửa),lessonPlanIntegrations (sửa),
        lessonPlanSampleSchema [MỚI],examBlueprint,examResult,vietnameseExamBlocks,
        vietnameseExamBlueprint,vietnameseExamResult,users.json}
```

## 3. ✅ MỚI (phiên này) — 4 vấn đề module "Soạn giáo án" giáo viên phản ánh sau khi test thực tế

Bối cảnh: giáo viên test tay và gửi 2 ảnh chụp - ảnh 1 cho thấy cú pháp LaTeX kiểu `$504~842$`
in thô ra giáo án (đáng lẽ phải hiện là "504 842"); ảnh 2 là ảnh mẫu tham khảo cấu trúc giáo án
chuẩn (mục a) Mục tiêu, b) Nội dung..., có Bước 1/Bước 2 rõ ràng) để đối chiếu.

### 3.1. Lỗi `$...$` và `~` in thô ra giáo án — ĐÃ SỬA
**Nguyên nhân xác nhận qua đọc code**: `subjectProfiles.js` có `extraRules` cho môn Toán yêu cầu
"công thức phải viết bằng LaTeX `$...$`" - quy tắc này viết RIÊNG cho luồng ra ĐỀ KIỂM TRA (nơi
CÓ pipeline `latexUtils.js` + KaTeX/OMML để render LaTeX thành công thức đẹp). Nhưng
`lessonPlanPromptTemplates.js` lại TÁI DÙNG NGUYÊN VẸN `extraRules` này cho giáo án, trong khi
`LessonPlanPreview.jsx`/`lessonPlanExportService.js` **không hề có pipeline đọc LaTeX** (đã ghi rõ
trong comment cũ: "giáo án hiếm khi có công thức phức tạp, không cần pipeline LaTeX->OMML") - kết
quả: AI vẫn viết số theo "thói quen" LaTeX (`$504~842$`), bị in thô ra vì không ai "dịch" nó.

**Đã sửa** trong `lessonPlanPromptTemplates.js`: thêm quy tắc bắt buộc cấm tuyệt đối `$`, `$$`,
dấu ngã `~` trong giáo án, yêu cầu viết số bằng ký hiệu thông thường; đồng thời ghi chú rõ ràng
ngay trước đoạn `subjectProfile.extraRules` để AI hiểu phần "phải dùng LaTeX" trong đó KHÔNG áp
dụng cho giáo án (chỉ áp dụng quy tắc nội dung/số liệu khác của môn học).

### 3.2. InfoGraphic/Mindmap "không hoạt động" — ĐÃ SỬA (tăng độ tin cậy)
**Nguyên nhân xác nhận qua đọc code**: field `"mindmap"` (và các field tích hợp khác như
`tichHopNLS`, `cungCoQuestions`...) TRƯỚC ĐÂY chỉ được MÔ TẢ BẰNG LỜI trong đoạn hướng dẫn tích
hợp (`buildIntegrationsPromptBlock`), KHÔNG xuất hiện trong VÍ DỤ JSON SCHEMA CHÍNH gửi cho AI -
mô hình ngôn ngữ thường "neo" hành vi theo ví dụ cụ thể tốt hơn nhiều so với mô tả bằng lời, nên
hay quên trả field này dù đã đọc đúng yêu cầu ở trên. Code hiển thị (`MindmapBlock` trong
`LessonPlanPreview.jsx`) hoàn toàn không có bug - vấn đề nằm ở việc AI không trả field, không phải
lỗi render.

**Đã sửa**: thêm thuộc tính `schemaExample` cho từng tích hợp trong `lessonPlanIntegrations.js`
(mindmap, cungCoQuestions, tichHopNLS, tichHopGDQPAN, tichHopHSKT), và hàm mới
`collectIntegrationSchemaExamples()` nối các đoạn ví dụ này TRỰC TIẾP vào object JSON mẫu trong
`buildLessonPlanPrompt()` - giờ AI luôn thấy hình dạng dữ liệu cụ thể (không chỉ đọc mô tả), kèm
câu nhấn mạnh "BẮT BUỘC phải có trường mindmap - đây KHÔNG phải trường tuỳ chọn".

### 3.3. Mục III chưa rõ ràng Bước 1/Bước 2/a)/b) — ĐÃ SỬA
- Đánh số **"Bước N:"** trước mỗi bước trong `tienTrinh` giờ làm **THUẦN CODE** (không phụ thuộc
  AI viết đúng hay không) ở cả `LessonPlanPreview.jsx` (màn hình xem trước) và
  `lessonPlanExportService.js` (file Word xuất ra) - đảm bảo LUÔN nhất quán, không phụ thuộc AI.
- Thêm quy tắc `stepClarityRule` trong prompt: yêu cầu AI tách rõ NHIỀU BƯỚC cho mỗi hoạt động
  (gợi ý tinh thần 4 bước quen thuộc: Giao nhiệm vụ / Thực hiện nhiệm vụ / Báo cáo-thảo luận /
  Kết luận-nhận định, không bắt buộc đủ 4 bước với hoạt động ngắn), và trong nội dung mỗi bước nếu
  có nhiều ý/thao tác thì viết gạch đầu dòng "- " xuống dòng riêng thay vì dồn thành 1 đoạn dài.
- Xử lý xuống dòng đúng cách ở CẢ 2 nơi: `white-space: pre-line` cho web preview,
  `TextRun({ break: 1 })` thật cho Word (KHÔNG in ký tự `\n` thô ra file - đã tự kiểm tra bằng
  cách giải nén `.docx` thật, xác nhận có `<w:br/>` thật, không còn chuỗi `\n` nào trong XML).

### 3.4. Upload giáo án mẫu (Word/PDF/ảnh), 2 chế độ "Bám sát mẫu" / "Kết hợp mẫu + SGK" — ĐÃ XONG
Tái dùng ĐÚNG khuôn đã có (`sampleExamAnalyzer.js` bên đề kiểm tra, `worksheetSampleAnalyzer.js`
bên phiếu bài tập, `fileTextExtractors.js` dùng chung cho cả 3 luồng):

- **`src/data/lessonPlanSampleSchema.js`** — spec CHỈ mô tả CẤU TRÚC/CÁCH TRÌNH BÀY (thứ tự đề
  mục, kiểu đánh số bước - đóng gói thành 1 trong 4 giá trị enum, có dùng bảng 2 cột hay không,
  thông tin đầu trang, ghi chú trình bày khác) - TUYỆT ĐỐI KHÔNG lưu nội dung bài học cụ thể của
  mẫu (dù rủi ro bản quyền thấp hơn đề mẫu NXB vì đây thường là mẫu trường/tổ chuyên môn, vẫn giữ
  nguyên tắc an toàn: mẫu chỉ định hình HÌNH THỨC, nội dung bài mới do AI tự soạn theo SGK/nội
  dung cốt lõi). `sanitizeLessonPlanSampleSpec()` không bao giờ throw, luôn trả object hợp lệ.
- **`src/services/lessonPlanSampleAnalyzer.js`** — đọc file mẫu, gọi Gemini ĐÚNG 1 LẦN
  (`priority="analyze"`), dùng `fileTextExtractors.js` để trích text thô TRƯỚC (docx/pdf không
  scan - miễn phí, không tốn AI), chỉ chuyển sang vision (ảnh/PDF scan) khi cần. Trả thêm
  `referenceText` (đoạn trích thô, giới hạn 3000 ký tự) để dùng làm ngữ cảnh văn phong khi ở chế
  độ "Bám sát mẫu".
- **`src/services/lessonPlanSampleCache.js`** — cache trong bộ nhớ theo (username + hash file),
  TTL 24h, y hệt kiến trúc `sampleExamCache.js` (best-effort, không sống qua cold start Vercel).
- **`src/app/api/analyze-lesson-plan-sample/route.js`** — route riêng, kiểm tra cache trước khi
  gọi AI, cùng khuôn `/api/analyze-sample`.
- **`lessonPlanPromptTemplates.js`**: thêm `buildLessonPlanPrompt({ sampleMode, sampleSpec,
  sampleReferenceText })` + hàm `buildLessonPlanSampleGuidance()` mới. 2 chế độ:
  - `"theo_mau"`: ưu tiên bám sát CÁCH TRÌNH BÀY của mẫu hơn khung mặc định (vẫn giữ đủ yêu cầu
    chuyên môn), có kèm đoạn trích văn phong tham khảo (chỉ để cảm nhận cách hành văn, cấm chép
    nguyên văn).
  - `"ket_hop"`: áp dụng cách trình bày của mẫu NHƯNG vẫn giữ đủ khung mục I-IV chuẩn + vẫn ưu
    tiên bám sát SGK cho nội dung (mẫu chỉ ảnh hưởng hình thức) - KHÔNG kèm đoạn trích văn phong.
  - `"theo_chuong"` (mặc định): không dùng mẫu, hành vi giữ nguyên như trước (đã tự xác nhận
    `buildLessonPlanPrompt()` không có sampleMode trả về prompt giống hệt bản cũ).
- **`lessonPlanEngine.js` → `lessonPlanOrchestrator.js` → `lessonPlanBlueprint.js` → route →
  `LessonPlanForm.jsx`**: nối xuyên suốt cả chuỗi, cùng pattern `sampleMode`/`sampleExamSpec` bên
  `examOrchestrator.js` - kể cả cơ chế fallback an toàn: nếu chọn chế độ dùng mẫu nhưng spec không
  đủ dùng (`isUsableLessonPlanSampleSpec()` trả false), tự động chuyển về "theo_chuong" kèm cảnh
  báo, KHÔNG chặn đứng cả lượt soạn giáo án.
- **`apiClient.js`**: thêm `analyzeLessonPlanSampleRequest()`.
- **`LessonPlanForm.jsx`**: thêm UI chọn 3 chế độ (mirror UI "Đề mẫu" của `ExamMatrixForm.jsx`) +
  upload file + hiển thị kết quả phân tích (đề mục, ghi chú trình bày) + chặn submit sớm ở client
  nếu chưa phân tích xong.

### Đã tự xác minh thật cho CẢ 4 việc (không chỉ đọc code)
- `npm run build` (Next.js 14.2.35): build sạch, route `/api/analyze-lesson-plan-sample` được
  nhận diện đúng trong danh sách route.
- `npm test`: vẫn **38/38 pass** - không có test cũ nào bị hỏng.
- Gọi thẳng `buildLessonPlanPrompt()` qua loader hook (`test/register-loader.mjs`) với nhiều tổ
  hợp tham số → xác nhận: (1) có dòng cấm LaTeX rõ ràng cho MỌI môn kể cả Toán; (2) `"mindmap":` và
  `"cungCoQuestions":` xuất hiện thật trong ví dụ JSON khi bật tích hợp tương ứng; (3) có nhắc quy
  tắc đánh số bước tự động; (4) chế độ `"theo_mau"` có đủ đoạn mô tả đề mục + đoạn trích văn phong,
  chế độ `"ket_hop"` có mô tả đề mục nhưng KHÔNG có đoạn trích văn phong (đúng thiết kế) + vẫn nhắc
  giữ khung mục chuẩn; (5) không truyền `sampleMode` → prompt không có đoạn "CÁCH TRÌNH BÀY GIÁO ÁN
  MẪU" (đúng hành vi cũ, không đổi).
- Gọi thẳng `buildLessonPlanDocxSections()` với dữ liệu mẫu có bước chứa nhiều dòng (`\n`) + có
  mindmap → giải nén `.docx` thật, soi `word/document.xml` → xác nhận CÓ THẬT: "Bước 1:", "Bước 2:"
  đứng trước đúng nội dung, xuống dòng bằng `<w:br/>` THẬT (đếm được 2 thẻ `<w:br/>`, 0 ký tự `\n`
  thô còn sót trong XML), và mục "Sơ đồ tư duy" hiển thị đúng.
- Gọi thẳng `sanitizeLessonPlanSampleSpec()` với input rác (`null`, field sai kiểu, enum bịa) →
  xác nhận không throw, luôn trả object hợp lệ theo đúng shape rỗng an toàn.
- Gọi thẳng `getCachedLessonPlanSampleSpec()`/`setCachedLessonPlanSampleSpec()` → xác nhận cache
  hit đúng sau khi set, và cách ly đúng theo username (2 "giáo viên" khác nhau dùng cùng 1 file
  mẫu không bị lẫn cache của nhau).

### Việc CHƯA làm — cần bạn tự làm ở phiên tiếp theo hoặc khi có API key thật
1. **Chưa gọi Gemini THẬT** cho toàn bộ luồng giáo án (kể cả trước phiên này) lẫn phần phân tích
   giáo án mẫu mới - sandbox không có `GEMINI_API_KEYS` và mạng bị giới hạn domain. Cần bạn tự
   chạy `npm run dev` với API key thật, thử soạn giáo án môn Toán (kiểm tra hết hẳn `$`/`~`), bật
   tích hợp Mindmap nhiều lần liên tiếp xem tỉ lệ AI trả về field này có cải thiện rõ rệt không, và
   thử cả 2 chế độ "Bám sát mẫu"/"Kết hợp mẫu + SGK" với 1 giáo án mẫu thật (docx/pdf/ảnh) để đánh
   giá AI có bắt chước đúng cấu trúc mẫu hay không.
2. Chưa xem bằng mắt trên trình duyệt thật - form giờ dài hơn (thêm khối "Giáo án mẫu"), cần xác
   nhận giao diện không bị rối, đặc biệt là khi vừa bật nhiều "Tuỳ chọn nâng cao" vừa bật "Giáo án
   mẫu" cùng lúc.
3. Mindmap hiện hiển thị dạng khối chữ nhật đơn giản (không phải sơ đồ cây/hình ảnh thật) - nếu
   giáo viên muốn hình ảnh trực quan hơn (dạng cây phân nhánh thật) thì đây là việc làm thêm sau,
   coi như đã tách bạch rõ 2 vấn đề khác nhau: "AI không trả dữ liệu" (đã sửa) vs "cách hiển thị dữ
   liệu" (vẫn ở dạng đơn giản, có thể nâng cấp sau nếu cần).
4. Chưa viết test tự động (`node --test`) riêng cho 4 việc sửa lần này - mới verify bằng script gọi
   hàm thủ công trong phiên làm việc, chưa có trong bộ `test/*.test.js` chạy lại được mỗi lần
   `npm test` sau này.
5. `.gitignore` (đã tạo ở phiên trước) - vẫn cần bạn tự xác nhận file này có tồn tại trên máy/repo
   GitHub thật hay không, đây vẫn là việc ưu tiên cao nếu chưa làm.

---

## 4. Mode "📖 Đề Tiếng Việt Tiểu học": đủ 4/4 khối, CHƯA test Gemini thật
*(Không đổi so với bản trước - xem lại lịch sử trò chuyện nếu cần chi tiết đầy đủ. Tóm tắt: cấu
trúc "danh bạ khối" (`vietnameseExamBlocks.js`) + "người điều phối" (`vietnameseExamOrchestrator.js`
+ `VietnameseExamPreview.jsx` + `vietnameseExamExportService.js`), mỗi khối tự chứa trong
`services/vietnameseBlocks/` + `components/vietnameseBlocks/`. Đủ 4 khối: Đọc thành tiếng (tĩnh),
Đọc thầm (AI), Chính tả (tĩnh - CỐ Ý không AI vì lý do bản quyền/mục đích bài tập), Tập làm văn
(AI nhẹ, chỉ đề bài + dàn ý, không sinh bài văn mẫu hoàn chỉnh). Đã tự verify bằng script gọi hàm
trực tiếp (không chỉ đọc code) nhưng CHƯA gọi Gemini thật cho 2 khối cần AI - vẫn là việc ưu tiên
cao nhất cần làm khi có API key thật.)*

## 5. Vấn đề kiến trúc đang chờ xử lý — VẪN CÒN NGUYÊN
`allowVisual` trong `gradeProfiles.js` vẫn chỉ gate theo khối lớp (không xét môn học) - dùng ở
đúng 1 chỗ (`examOrchestrator.js`) - chưa ai sửa, vẫn là quyết định cần chốt nếu muốn mở rộng thêm.

---

# GIAI ĐOẠN 10 — Nâng cấp module "📘 Soạn Giáo Án" theo góp ý giáo viên

> Kế hoạch đầy đủ (6 đề xuất gốc, đánh giá/điều chỉnh, thứ tự 7 việc, nguyên tắc kỹ thuật) nằm ở
> file riêng `KE_HOACH_GIAI_DOAN_10.md` - mục này chỉ ghi lại NHỮNG GÌ ĐÃ LÀM THẬT, không lặp lại
> toàn bộ kế hoạch. **Quyết định đã chốt đầu phiên**: làm Giai đoạn 10 TRƯỚC, để nguyên Giai đoạn 9
> (Phiếu bài tập, mục 0.-3. phía trên) dở dang đúng như hiện trạng - không đụng vào.

## Việc 1/7 — Tin nhắn Zalo phụ huynh — ĐÃ XONG

**Cơ chế**: tái dùng ĐÚNG khuôn "plugin" đã có sẵn ở `lessonPlanIntegrations.js`
(`LESSON_PLAN_INTEGRATIONS` registry) - y hệt cách các tích hợp cũ (Mindmap, Củng cố, Phiếu học
tập...) đã hoạt động. Nhờ vậy **chỉ cần thêm 1 entry mới** vào registry, KHÔNG phải sửa
`lessonPlanPromptTemplates.js` hay `LessonPlanForm.jsx` - cả 2 nơi này đều tự động "nhìn thấy"
tích hợp mới qua `listIntegrations()` (UI tự có thêm checkbox), `buildIntegrationsPromptBlock()` +
`collectIntegrationSchemaExamples()` (prompt tự có thêm hướng dẫn + ví dụ JSON), và
`lessonPlanOrchestrator.js` (cảnh báo tự động nếu AI quên trả field, dựa theo `jsonField`).

- **`lessonPlanIntegrations.js`**: thêm key `TIN_NHAN_PHU_HUYNH: "tinNhanPhuHuynh"` +
  entry đầy đủ (`buildPromptFragment`, `schemaExample`). Nội dung yêu cầu AI viết: 1 tin nhắn liền
  mạch (không đầu mục) gồm lời chào + tóm tắt bài học bằng NGÔN NGỮ ĐỜI THƯỜNG (cấm dùng thuật ngữ
  sư phạm như "yêu cầu cần đạt"/"năng lực"/"phẩm chất") + đúng 1 gợi ý hoạt động ở nhà đơn giản,
  dài khoảng 60-120 từ, tối đa 1-2 emoji, sẵn sàng copy-paste thẳng vào Zalo.
- **`LessonPlanPreview.jsx`**: thêm `TinNhanPhuHuynhBlock` - hiển thị dạng phụ lục (đặt SAU mục IV
  chuẩn, đúng nguyên tắc "phụ lục có thể bật/tắt, không chèn xen giữa Mục I-IV"), có nút **"Sao
  chép"** riêng (Clipboard API + fallback `execCommand` cho trình duyệt/webview cũ), nút này bọc
  `className="no-print"` nên không xuất hiện khi in/xuất PDF.
- **`lessonPlanExportService.js`** (`buildLessonPlanDocxSections`): thêm phụ lục tương ứng trong
  file Word, tách trang riêng (`pageBreakBefore: true`) như `phieuHocTap`, dùng lại
  `multilineTextRuns()` sẵn có để xuống dòng thật (`<w:br/>`) thay vì in ký tự `\n` thô.
- **`test/lessonPlanFixes.test.js`**: thêm 2 test mới (prompt bật/tắt đúng nội dung + schema;
  docx có/không có phụ lục đúng, không chèn phụ lục rỗng, đứng đúng vị trí sau Phiếu học tập nếu
  cả 2 cùng bật).

### Đã tự verify thật (không chỉ đọc code) - LƯU Ý QUAN TRỌNG về giới hạn sandbox phiên này
Sandbox phiên này **KHÔNG có mạng** (kể cả `npm install`/`registry.npmjs.org` cũng bị chặn hẳn,
khác các phiên trước vẫn tải được gói) → **KHÔNG chạy được `npm test` thật** (thiếu gói `docx`,
`jszip` chưa cài). Đã tự viết 2 script xác minh độc lập, KHÔNG dùng npm, chạy thẳng bằng
`node` + cùng cơ chế resolve alias `@/...` có sẵn (`test/resolve-alias-hooks.mjs`):

1. **Verify phần prompt** (gọi thẳng `buildLessonPlanPrompt()`, không cần gói ngoài vì
   `subjectProfiles.js`/`lessonPlanTemplates.js`/`lessonPlanIntegrations.js` đều thuần JS nội bộ):
   xác nhận bật `"tinNhanPhuHuynh"` → prompt có đủ hướng dẫn + `"tinNhanPhuHuynh":` trong schema
   JSON mẫu + có câu cấm thuật ngữ chuyên môn; KHÔNG bật → hoàn toàn không có 2 thứ trên (5/5 PASS).
2. **Verify phần xuất Word** (gọi thẳng `buildLessonPlanDocxSections()`): vì gói `docx` thật không
   cài được, đã viết 1 SHIM tối giản (chỉ lưu lại object graph, không tạo XML thật) để tự kiểm tra
   LOGIC JS - xác nhận: có đúng paragraph tiêu đề phụ lục + `pageBreakBefore: true`; nội dung tin
   nhắn nhiều dòng được tách đúng thành nhiều `TextRun` với `break: 1` (không phải 1 khối `\n` thô);
   KHÔNG bật thì không tự chèn phụ lục rỗng; khi bật cùng lúc với Phiếu học tập thì cả 2 phụ lục
   đều còn nguyên và đúng thứ tự (Tin nhắn PH đứng sau) (11/11 PASS).
3. **Verify registry**: `listIntegrations()` có entry mới (UI Form tự động thấy checkbox, đúng cơ
   chế `listIntegrations().map()` có sẵn trong `LessonPlanForm.jsx`), không trùng `key` với entry
   nào khác, `collectIntegrationSchemaExamples()` trả đúng schema khi bật (4/4 PASS).
4. Các script/shim verify tạm thời (`verify_*.mjs`, thư mục `verify-shims/`) đã **XOÁ sau khi xong**
   - không nằm trong zip đóng gói, chỉ dùng để tự kiểm chứng ngay trong phiên làm việc này.

**Việc CHƯA làm được do giới hạn sandbox (cần bạn tự làm)**:
- Chưa chạy được `npm test` thật với gói `docx`/`jszip` thật (để soi XML `.docx` thật như các test
  cũ vẫn làm) - cần bạn tự chạy trên máy có mạng để có xác nhận đầy đủ nhất (2 test mới đã viết sẵn
  trong `test/lessonPlanFixes.test.js`, chỉ cần `npm install && npm test`).
- Chưa gọi Gemini thật để xem AI có thực sự tuân thủ đúng văn phong "tin nhắn Zalo" (ngắn gọn,
  không thuật ngữ chuyên môn, đúng 60-120 từ) hay không - cần thử trên `npm run dev` với API key
  thật, bật tuỳ chọn "Tin nhắn phụ huynh" và đọc kết quả bằng mắt.
- Chưa xem bằng mắt trên trình duyệt thật: nút "Sao chép" (đổi trạng thái/màu khi bấm, hoạt động
  đúng trên Clipboard API) và giao diện phụ lục màu xanh lá trong bản xem trước.
- Mặc định KHÔNG tự bật sẵn tuỳ chọn "Tin nhắn phụ huynh" trong `selectedIntegrations` của
  `LessonPlanForm.jsx` (giáo viên cần tự tick) - nếu muốn mặc định bật sẵn (giống `phieuHocTap`),
  đây là 1 dòng sửa rất nhỏ, có thể làm ngay khi cần.

## Việc 2/7 — Phong cách soạn giáo án (3 preset + tự do) — ĐÃ XONG

**Thiết kế**: 1 file registry MỚI `lessonPlanStyles.js` (cùng khuôn "registry" với
`lessonPlanIntegrations.js`/`subjectProfiles.js`, nhưng đây là LỰA CHỌN DUY NHẤT - radio, không
phải checkbox bật/tắt nhiều cái như integrations) + mở rộng `teacherPreferenceStore.js` (namespace
Redis/file HOÀN TOÀN RIÊNG với phần Phiếu bài tập cũ) + 1 API route mới + luồng chèn vào prompt.

- **`lessonPlanStyles.js`** (MỚI): 3 preset ĐÃ CHỐT - Sáng tạo/Nhẹ nhàng/Năng động (mỗi preset có
  `buildPromptFragment()` riêng: giọng văn, cách chọn ví dụ, kiểu hoạt động Khởi động/Luyện tập) +
  1 tuỳ chọn "Tự do" (giáo viên tự mô tả, giới hạn `CUSTOM_STYLE_MAX_LENGTH = 150` ký tự - ĐÃ CHỐT).
  Hàm `buildLessonPlanStylePromptFragment()` LUÔN chèn kèm 1 câu "khoanh phạm vi" CỐ ĐỊNH (áp dụng
  cho MỌI phong cách, kể cả tự do): phong cách CHỈ được đổi giọng văn/ví dụ/kiểu khởi động, TUYỆT
  ĐỐI KHÔNG được đụng khung mục I-IV/thời lượng/yêu cầu chuyên môn - đúng giới hạn phạm vi đã chốt
  ở mục 4 kế hoạch. Không chọn gì / chọn "Tự do" nhưng để trống → trả về `""`, không phá hành vi cũ.
- **`lessonPlanPromptTemplates.js`**: thêm tham số `lessonPlanStyle`, chèn `styleBlock` ngay sau
  `integrationsBlock`, trước `sampleGuidanceBlock`. Không truyền gì → prompt giữ nguyên y hệt trước
  khi có tính năng này (đã test riêng để đảm bảo tương thích ngược).
- **`lessonPlanEngine.js` / `lessonPlanOrchestrator.js`**: threading tham số `lessonPlanStyle`
  xuyên suốt, giống cách `integrations`/`sampleMode` đã được truyền từ trước.
- **`generate-lesson-plan/route.js`**: thêm `sanitizeLessonPlanStyle()` - validate `styleId` phải
  nằm trong 4 giá trị hợp lệ (không tin client tuyệt đối, đúng nguyên tắc đã áp dụng ở
  `worksheet-preference/route.js`), và CẮT PHÒNG THÂN `customStyleText` về đúng 150 ký tự ở phía
  SERVER (không chỉ tin giới hạn `maxLength` phía client, phòng trường hợp gọi thẳng API).
- **`teacherPreferenceStore.js`**: thêm `getLessonPlanPreference()`/`setLessonPlanPreference()` -
  namespace RIÊNG hoàn toàn (Redis key `teacher_pref:lessonplan:*` + thư mục file local
  `.data/teacher-preference-lessonplan/`, KHÁC với `teacher_pref:worksheet:*` của Phiếu bài tập) -
  đã tự verify xác nhận lưu phong cách giáo án KHÔNG xoá/đè dữ liệu Phiếu bài tập của cùng giáo
  viên (xem mục verify bên dưới).
- **`lesson-plan-preference/route.js`** (MỚI): GET/POST lưu bền vững theo giáo viên (dùng token
  đăng nhập, không tin username client gửi) - cùng khuôn `worksheet-preference/route.js`.
- **`apiClient.js`**: thêm `getLessonPlanPreferenceRequest()`/`saveLessonPlanPreferenceRequest()`.
- **`lessonPlanBlueprint.js`**: thêm field `lessonPlanStyle` vào "1 nguồn duy nhất" định nghĩa input.
- **`LessonPlanForm.jsx`**: thêm khối UI "Phong cách soạn giáo án (tuỳ chọn)" - 3 nút preset + nút
  "Tự do" (hiện textarea giới hạn 150 ký tự kèm bộ đếm khi chọn) + nút "Bỏ chọn" + nút "Lưu phong
  cách này" (giống nút "Lưu bố cục"/"Lưu công thức đề" bên Phiếu bài tập) + tự tải phong cách đã
  lưu khi mở form (giống `favoriteLayoutId`). KHÔNG ép buộc giáo viên phải chọn - mặc định `null`,
  hành vi soạn giáo án giữ nguyên như trước nếu giáo viên không đụng vào mục này.
- **`test/lessonPlanFixes.test.js`**: thêm 5 test mới, trong đó có 1 **test "canh gác quyết định"**
  cố ý kiểm tra CHÍNH XÁC 3 preset + không được thêm/bớt - nếu sau này ai vô tình thêm preset thứ 4
  (trái với "ĐÃ CHỐT" ở mục 7 kế hoạch), test này sẽ FAIL ngay để cảnh báo.

### Đã tự verify thật (không chỉ đọc code) - CÙNG giới hạn sandbox không mạng như Việc 1
Đã viết 3 script xác minh độc lập bằng `node` thuần (không cần npm), xoá sau khi dùng xong:
1. **`lessonPlanStyles.js` + tích hợp vào prompt** (15/15 PASS): đúng 3 preset không hơn không kém,
   `CUSTOM_STYLE_MAX_LENGTH=150`, không chọn → `""`, mỗi preset/tự do đều có câu khoanh phạm vi,
   tự do bị cắt đúng 150 ký tự dù truyền chuỗi 500 ký tự, `buildLessonPlanPrompt()` có/không có
   block phong cách đúng theo tham số truyền vào, KHÔNG truyền gì → prompt y hệt trước đây.
2. **`teacherPreferenceStore.js`** (9/9 PASS, dùng file JSON local thật - ép `UPSTASH_REDIS_REST_URL=""`
   để test fallback, không cần Upstash thật): lưu/đọc preset đúng, lưu/đọc tự do đúng, "Bỏ chọn"
   ghi đè về `null` đúng, và **quan trọng nhất**: lưu phong cách giáo án cho 1 giáo viên KHÔNG làm
   mất `favoriteLayoutId` (Phiếu bài tập) đã lưu trước đó của CHÍNH giáo viên đó - xác nhận 2
   namespace hoàn toàn độc lập như thiết kế.
3. **Hàm `sanitizeLessonPlanStyle()` trong route.js** (7/7 PASS) - verify bằng cách TRÍCH ĐÚNG
   NGUYÊN VĂN hàm từ file thật (không gõ lại tay, dùng script Python đọc file + regex trích hàm),
   rồi import và test độc lập (route.js đầy đủ không import được vì dây chuyền phụ thuộc tới gói
   `@google/genai` chưa cài) - xác nhận: chặn đúng `styleId` lạ, giữ nguyên preset hợp lệ, tự do
   rỗng → `null`, tự do hợp lệ → trim đúng, tự do quá dài → cắt đúng 150 ký tự.

**Việc CHƯA làm được do giới hạn sandbox (cần bạn tự làm)** - giống hệt lưu ý ở Việc 1:
- Chưa chạy được `npm test` thật (thiếu `docx`/`jszip`/`@google/genai` chưa cài do sandbox không
  có mạng) - 5 test mới đã viết sẵn trong `test/lessonPlanFixes.test.js`, cần bạn tự chạy
  `npm install && npm test` trên máy có mạng.
- Chưa gọi Gemini thật để xem AI có thực sự tuân thủ đúng "giọng văn" theo từng preset hay không
  (VD phong cách "Năng động" ra giáo án có thực sự nhiều hoạt động vận động hơn "Nhẹ nhàng" không)
  - cần thử trên `npm run dev` với API key thật, so sánh 2-3 lần soạn với các phong cách khác nhau.
- Chưa xem bằng mắt trên trình duyệt thật: UI chọn phong cách (đổi màu khi chọn, textarea + bộ đếm
  ký tự khi chọn "Tự do", nút "Lưu phong cách này"/"Bỏ chọn" hoạt động đúng, tự tải lại phong cách
  đã lưu khi mở form lại).
- **CHƯA làm phần "vai trò kép (b)" ở mục 4 kế hoạch** - "phong cách góp phần giảm trùng lặp giữa
  các giáo viên khác phong cách" - đây là hệ quả TỰ NHIÊN một phần (2 giáo viên chọn phong cách
  khác nhau sẽ ra giáo án khác nhau hơn), nhưng CƠ CHẾ CHỐNG TRÙNG THẬT SỰ (ngân hàng đa dạng, lưu
  lịch sử theo tổ hợp khối+môn+bài) vẫn là Việc 3 riêng, CHƯA làm - đúng thứ tự đã chốt.

## Việc 3/7 — Cơ chế chống trùng liên giáo viên/liên phiên — ĐÃ XONG

**Vấn đề gốc** (đã xác minh lại bằng cách đọc code thật ở đầu Giai đoạn 10): `lessonPlanEngine.js`
trước Việc này HOÀN TOÀN không có cơ chế chống trùng nào, kể cả giữa 2 lần CHÍNH 1 giáo viên tự
tạo lại cho cùng 1 bài - khác `geminiEngine.js` (đề kiểm tra) đã có "3 lớp chống trùng" nhưng chỉ
trong phạm vi 1 lượt gọi.

**Thiết kế đã CHỐT phạm vi (tránh hiểu nhầm là bản sao y hệt 3-lớp chống trùng đề kiểm tra)**:
- CHỈ lưu/so sánh **"Ý TƯỞNG MỞ BÀI"** (nội dung hoạt động ĐẦU TIÊN trong `hoatDong` - luôn là
  "Khởi động"/tương đương Mầm non theo đúng cấu trúc chuẩn) - KHÔNG lưu toàn bộ giáo án. Trích
  theo VỊ TRÍ (hoatDong[0]) chứ không so tên nhãn, để không phụ thuộc AI có đặt đúng chữ "Khởi
  động" hay không (đặc biệt với Mầm non, tên hoạt động do AI tự đặt phù hợp).
- KHÔNG có vòng lặp "tự sinh lại nếu trùng" như `geminiEngine.js` (batch nhiều câu hỏi/lượt nên
  retry rẻ) - ở đây mỗi giáo án chỉ sinh 1 lần/lượt gọi, tự động retry sẽ tốn thêm 1 lượt gọi AI
  mỗi khi phát hiện giống. Thay vào đó: (a) CHÈN GỢI Ý vào prompt để AI tự tránh trùng ngay từ đầu,
  và (b) sau khi sinh xong, nếu VẪN giống thì CẢNH BÁO cho giáo viên tự quyết định tạo lại hay
  không - KHÔNG tự ý chặn/sinh lại thay giáo viên.
- Khoá lưu trữ theo tổ hợp **KHỐI + MÔN + BÀI** (KHÔNG có "trường") - đúng kết luận đã chốt ở mục 3
  kế hoạch. `tenBai` là text tự do giáo viên gõ nên được CHUẨN HOÁ (bỏ dấu, hạ chữ thường, gộp
  khoảng trắng) trước khi làm khoá - đã verify 2 cách gõ hơi khác nhau vẫn map đúng 1 tổ hợp.

- **`lessonPlanDiversityStore.js`** (MỚI): kiến trúc 2-backend TÁI DÙNG ĐÚNG khuôn
  `questionBankStore.js` (Upstash Redis + fallback file JSON local `.data/lesson-plan-diversity/`)
  - namespace Redis riêng (`lp_diversity:*`), không đụng `qbank:*`/`teacher_pref:*`. Export:
  `getDiversityEntries()`, `appendDiversityEntry()`, `extractOpeningIdea()`, `jaccardSimilarity()`
  (n-gram, cùng công thức `geminiEngine.js` nhưng viết lại độc lập, không import chéo domain đề
  kiểm tra), hằng số `DIVERSITY_SIMILARITY_WARNING_THRESHOLD = 0.5`.
- **`lessonPlanPromptTemplates.js`**: thêm `buildDiversityGuidance()` - chỉ chèn block "CHỐNG
  TRÙNG LẶP GIỮA CÁC LẦN SOẠN" khi CÓ ít nhất 1 ý tưởng cũ (lượt đầu tiên cho 1 tổ hợp thì không
  chèn gì, không phình prompt vô ích); TÁI DÙNG `generateAntiDuplicationSeed()` có sẵn từ
  `promptTemplates.js` (đề kiểm tra) làm "hạt giống" đa dạng hoá thay vì viết lại logic mới. Đặt
  ngay trước block Phong cách (Việc 2) trong prompt - đã verify 2 block cùng tồn tại không đè nhau.
- **`lessonPlanEngine.js` / `lessonPlanOrchestrator.js`**: threading `existingOpeningIdeas` xuyên
  suốt. Orchestrator: **fetch TRƯỚC khi sinh** (đưa vào prompt), **sau khi sinh xong** trích ý
  tưởng mở bài mới, tính Jaccard similarity với toàn bộ ý tưởng cũ đã fetch → vượt ngưỡng thì đẩy
  cảnh báo vào mảng `warnings` có sẵn (tái dùng đúng cơ chế cảnh báo đã có, không tạo cơ chế mới) →
  LUÔN lưu ý tưởng mới vào ngân hàng (dù trùng hay không) kèm `styleId` đã dùng (Việc 2) để phục vụ
  phân tích sau này - đúng ý "kết hợp cùng Phong cách ở bước 2" trong kế hoạch.
- **`test/lessonPlanDiversityStore.test.js`** (MỚI, 6 test) - cùng khuôn `questionBankStore.test.js`
  (test nhánh file JSON local, tự dọn dẹp sau khi chạy bằng `after()`).
- **`test/lessonPlanFixes.test.js`**: thêm 4 test (extractOpeningIdea, jaccardSimilarity, prompt có/
  không block chống trùng, kết hợp đồng thời với block Phong cách).

**Không cần sửa `LessonPlanForm.jsx`/UI** - Việc 3 hoàn toàn ở phía backend, không cần input mới từ
giáo viên (subject/grade/tenBai đã có sẵn từ trước; cảnh báo hiển thị qua đúng cơ chế `warnings`
sẵn có trong UI).

### Đã tự verify thật (không chỉ đọc code) - lần này verify SÂU HƠN Việc 1-2: chạy được **THẬT** cả 1 file test bằng chính `node --test` (không cần shim)
- **`test/lessonPlanDiversityStore.test.js` chạy THẬT 100%** bằng đúng lệnh `node --test` (không
  cần shim/loader gì, vì file này chỉ phụ thuộc `fs`/`path` built-in) - **6/6 PASS thật**, tự dọn
  dẹp sạch sau khi chạy (đã xác nhận `.data/` không còn rác của test).
- Phần còn lại vẫn dùng script verify độc lập bằng `node` thuần (xoá sau khi dùng) do
  `lessonPlanFixes.test.js` cần gói `docx`/`jszip` chưa cài được (thiếu mạng):
  - **`extractOpeningIdea`/`jaccardSimilarity`** (9/9 PASS): trích đúng hoạt động đầu tiên, không
    lấy nhầm hoạt động khác, an toàn với `{}`/`null`, cắt đúng 400 ký tự, similarity đúng tính chất
    toán học (giống hệt=1, khác hẳn thấp, rỗng không lỗi chia 0).
  - **Tích hợp vào `buildLessonPlanPrompt()`** (11/11 PASS): không có ý tưởng cũ → không chèn gì;
    có ý tưởng cũ → chèn đúng danh sách + seed; lọc bỏ giá trị rỗng/null; kết hợp đồng thời với
    block Phong cách (Việc 2), đúng thứ tự đã thiết kế.
  - **End-to-end TOÀN BỘ pipeline thật** (7/7 PASS) - verify SÂU NHẤT trong 3 Việc đã làm: viết 1
    shim tối giản cho gói `@google/genai` (trả về 1 giáo án JSON giả lập cố định), rồi chạy THẬT
    `orchestrateLessonPlanGeneration()` → `generateLessonPlanContent()` → `buildLessonPlanPrompt()`
    → `lessonPlanDiversityStore.js` không qua bất kỳ mock nội bộ nào khác - xác nhận: lượt 1 cho 1
    tổ hợp mới không cảnh báo + tự lưu vào ngân hàng; lượt 2 CÙNG tổ hợp (AI giả lập trả lại y hệt
    ý tưởng) → CÓ cảnh báo trùng + ngân hàng cộng dồn đúng (không ghi đè); tổ hợp KHÁC hoàn toàn
    không bị ảnh hưởng.
  - Tổng cộng phiên này: **34/34 kiểm tra verify PASS** (script tạm, đã xoá) + **6/6 test thật PASS**
    (file chính thức, chạy được ngay bằng `node --test`, không cần shim).

**Việc CHƯA làm được do giới hạn sandbox (cần bạn tự làm)** - vẫn 1 điểm CHƯA đổi từ Việc 1-2:
- `test/lessonPlanFixes.test.js` (bao gồm 4 test mới của Việc 3 + toàn bộ test cũ) vẫn CẦN
  `npm install` gói `docx`/`jszip` thật để chạy - cần bạn tự `npm install && npm test` trên máy có
  mạng. Riêng `test/lessonPlanDiversityStore.test.js` (Việc 3) đã tự chạy PASS thật ngay trong
  sandbox này, không cần chờ bạn xác nhận lại phần đó.
- **Ngưỡng cảnh báo `DIVERSITY_SIMILARITY_WARNING_THRESHOLD = 0.5`** mới là ước lượng hợp lý ban
  đầu (dựa theo mức "0.55" đề kiểm tra đang dùng, hạ nhẹ vì bản chất văn bản khác nhau) - CHƯA có
  dữ liệu thật từ nhiều giáo viên để tinh chỉnh; có thể cần điều chỉnh sau khi dùng thật 1 thời
  gian (quá nhạy → báo động giả nhiều làm giáo viên khó chịu; quá lỏng → bỏ lọt trùng lặp thật).
- Chưa thử với Upstash Redis thật (chỉ verify nhánh file JSON local) - nên test thủ công 1 lần với
  Upstash thật sau khi deploy (tạo giáo án 2 lần liên tiếp cho cùng 1 bài, xem lần 2 có cảnh báo
  đúng không) - đúng khuyến nghị đã ghi trong `questionBankStore.test.js`.
- Chưa xem bằng mắt trên `npm run dev` với API key Gemini thật: prompt "CHỐNG TRÙNG LẶP GIỮA CÁC
  LẦN SOẠN" có thực sự khiến AI đổi ý tưởng mở bài khác biệt rõ rệt hay không (khác với việc giả
  lập cố định trong shim `@google/genai` chỉ chứng minh ĐÚNG LOGIC ĐIỀU PHỐI, không chứng minh AI
  THẬT có tuân thủ tốt hay không).

## Việc 4/7 — Checklist đánh giá Năng lực - Phẩm chất (NL-PC) — ĐÃ XONG

**Cơ chế**: tiếp tục tái dùng ĐÚNG khuôn "plugin" `LESSON_PLAN_INTEGRATIONS` (giống hệt cách làm
Việc 1 - Tin nhắn phụ huynh) - chỉ thêm 1 entry mới `CHECKLIST_NLPC: "checklistNLPC"`, KHÔNG phải
sửa `lessonPlanPromptTemplates.js`/`LessonPlanForm.jsx`.

- **`lessonPlanIntegrations.js`**: thêm entry `checklistNLPC`. Nội dung yêu cầu AI: mỗi dòng
  checklist phải ỨNG VỚI ĐÚNG 1 tiêu chí đã có sẵn trong CHÍNH `yeuCauCanDat.nangLuc`/`phamChat`
  của giáo án đó (không bịa thêm, không bỏ sót - đủ số dòng = tổng 2 mảng) - đây là điểm THIẾT KẾ
  QUAN TRỌNG NHẤT: checklist không phải 1 nội dung AI tự nghĩ độc lập, mà PHẢI bám sát đúng những
  gì chính giáo án đã liệt kê ở mục I.2/I.3, để giáo viên không phải đối chiếu 2 danh sách lệch
  nhau. Với mỗi tiêu chí, AI viết 3 biểu hiện CỤ THỂ/QUAN SÁT ĐƯỢC NGAY TRONG TIẾT HỌC (không viết
  chung chung kiểu "hiểu bài") theo đúng 3 mức của **Thông tư 27/2020/TT-BGDĐT** (đánh giá học
  sinh Tiểu học - mức Tốt/Đạt/Cần cố gắng), có ghi chú Mầm non hiểu tương ứng theo lĩnh vực phát
  triển. Trả JSON `"checklistNLPC": [ { "tieuChi", "loai": "nang_luc"|"pham_chat", "tot", "dat",
  "canCoGang" } ]`.
- **`LessonPlanPreview.jsx`**: thêm `ChecklistNLPCBlock` - hiển thị dạng PHỤ LỤC (đặt SAU Phiếu
  học tập, TRƯỚC Tin nhắn phụ huynh - đúng nguyên tắc phụ lục có thể bật/tắt độc lập, không chèn
  xen giữa mục I-IV chuẩn), render thành BẢNG THẬT 4 cột (Tiêu chí | Tốt | Đạt | Cần cố gắng, có
  nhãn nhỏ "Năng lực"/"Phẩm chất" phía trên mỗi tên tiêu chí) - đây là 1 bảng RUBRIC để giáo viên
  tự đối chiếu khi quan sát học sinh trong tiết học, KHÔNG phải danh sách theo tên học sinh cụ thể
  (hệ thống không có sẵn danh sách lớp để tự điền tên - giữ đúng phạm vi dữ liệu thực sự có).
- **`lessonPlanExportService.js`** (`buildLessonPlanDocxSections`): thêm phụ lục tương ứng trong
  Word, tách trang riêng (`pageBreakBefore: true`, giống `phieuHocTap`/`tinNhanPhuHuynh`), dựng
  bảng thật bằng `Table`/`TableRow`/`TableCell` (tái dùng đúng hàm `cell()` đã có sẵn cho bảng
  hoạt động GV-HS ở mục III, không viết lại logic dựng bảng từ đầu).
- **`test/lessonPlanFixes.test.js`**: thêm 2 test mới (prompt bật/tắt đúng nội dung + schema, có
  nhắc đúng "yeuCauCanDat.nangLuc"/"yeuCauCanDat.phamChat" + căn cứ Thông tư 27/2020; docx có/không
  có phụ lục bảng đúng, render `<w:tbl>` thật, có đủ tên tiêu chí Năng lực lẫn Phẩm chất trong
  bảng, không tự chèn phụ lục rỗng khi không bật).

### Đã tự verify thật (không chỉ đọc code) — LẦN NÀY sandbox CÓ MẠNG (khác Việc 1-3 trước đó)
Khác hẳn 3 Việc trước (sandbox không mạng, phải viết shim thủ công) - phiên này `npm install` chạy
được bình thường, nên đã verify được **ĐẦY ĐỦ NHƯ CÁC GIAI ĐOẠN SỚM HƠN**, không cần shim tạm:
- `npm test` chạy THẬT bằng đúng lệnh chính thức (`node --import ./test/register-loader.mjs --test
  test/*.test.js`): **66/66 PASS** (64 test cũ không hỏng + 2 test mới của Việc 4), bao gồm cả việc
  giải nén `.docx` THẬT bằng `jszip` thật (gói `docx` thật, không phải shim).
- `npm run build` (Next.js 14.2.35): **build sạch, không lỗi type/lint**, xác nhận cú pháp JSX của
  `ChecklistNLPCBlock` hợp lệ (phát hiện + tự sửa 1 lỗi gõ nhầm: chuỗi trong JSX bị lẫn dấu `\"`
  thừa khi soạn thảo, đã dùng `npm test`/kiểm tra assertion để lộ ra rồi sửa lại bằng ký tự `"`
  thường trước khi build, không phải để lọt bug này sang phiên sau).
- Ngoài bộ test chính thức, còn tự chạy thêm 1 script verify độc lập (`node` thuần, xoá sau khi
  dùng) gọi thẳng `buildLessonPlanDocxSections()` với 3 tiêu chí thật (2 Năng lực + 1 Phẩm chất),
  giải nén `.docx` sinh ra bằng `jszip`, xác nhận: có `<w:tbl>` thật (không phải đoạn văn giả bảng
  bằng khoảng trắng), đủ tên cả 3 tiêu chí, đủ 2 nhãn "Năng lực"/"Phẩm chất", đúng 4 hàng bảng
  (1 header + 3 tiêu chí, không thừa/thiếu hàng).

**Việc CHƯA làm được (cần bạn tự làm)**:
- Chưa gọi Gemini THẬT để xem AI có thực sự tuân thủ ĐÚNG SỐ LƯỢNG tiêu chí (bám khớp hoàn toàn
  `nangLuc`/`phamChat` mà chính nó vừa viết ra trong cùng 1 lượt JSON) hay có xu hướng viết thừa/
  thiếu dòng - đây là yêu cầu "tự tham chiếu trong cùng 1 lần sinh" phức tạp hơn các tích hợp
  trước (vốn chỉ cần AI viết 1 đoạn độc lập), cần thử nhiều lần với `npm run dev` + API key thật
  để đánh giá tỉ lệ tuân thủ.
- Chưa xem bằng mắt trên trình duyệt thật: bảng 4 cột trong bản xem trước web có bị chật/tràn khi
  nội dung mô tả dài không (khác Word có thể tự ngắt trang, web preview cố định khổ A4).
- Mặc định KHÔNG tự bật sẵn tuỳ chọn "Checklist NL-PC" trong `selectedIntegrations` của
  `LessonPlanForm.jsx` (giáo viên cần tự tick, giống phần lớn tích hợp khác trừ `phieuHocTap`).

## Việc 5/7 — Bài tập phân hoá theo 3 mức độ (Hỗ trợ - Đạt chuẩn - Nâng cao) — ĐÃ XONG

**Cơ chế**: tiếp tục tái dùng ĐÚNG khuôn "plugin" `LESSON_PLAN_INTEGRATIONS` (giống hệt Việc 1/4) -
chỉ thêm 1 entry mới `BAI_TAP_PHAN_HOA: "baiTapPhanHoa"`, KHÔNG phải sửa `lessonPlanPromptTemplates.js`
hay `LessonPlanForm.jsx` (UI tự động có thêm checkbox qua `listIntegrations()` sẵn có).

- **`lessonPlanIntegrations.js`**: thêm entry `baiTapPhanHoa`. Yêu cầu AI soạn 3 nhóm bài tập
  (mỗi nhóm 2-3 bài) BẮT BUỘC cùng xoay quanh ĐÚNG 1 nội dung kiến thức của bài học (không lạc
  đề sang kiến thức khác) - CHỈ khác nhau về độ khó, theo đúng tinh thần dạy học phân hoá 3 nhóm
  đối tượng học sinh trong CÙNG 1 lớp (không phải 3 phiếu tách rời cho 3 lớp khác nhau):
  - `"hoTro"` (Hỗ trợ - học sinh chưa đạt yêu cầu cần đạt): mức Nhận biết đơn giản nhất, có thể
    kèm gợi ý/làm mẫu 1 phần.
  - `"datChuan"` (Đạt chuẩn - đa số học sinh): đúng mức yêu cầu cần đạt cơ bản, không kèm gợi ý.
  - `"nangCao"` (Nâng cao - học sinh học tốt/nhanh hơn): mức Vận dụng cao hơn (kết hợp nhiều
    bước, tình huống thực tế), không vượt quá xa chương trình.
  Có câu nhấn mạnh 3 mức PHẢI khác biệt rõ rệt về độ khó (không chỉ đổi số liệu qua loa) - đây là
  điểm mấu chốt để phân hoá thật sự, tránh AI trả về 3 bản sao gần giống nhau. Trả JSON
  `"baiTapPhanHoa": { "hoTro": [...], "datChuan": [...], "nangCao": [...] }` (mỗi mức là mảng chuỗi).
- **`LessonPlanPreview.jsx`**: thêm `BaiTapPhanHoaBlock` - hiển thị dạng PHỤ LỤC (đặt SAU Phiếu
  học tập, TRƯỚC Checklist NL-PC - đúng nguyên tắc phụ lục bật/tắt độc lập, không chèn xen giữa
  mục I-IV), render **3 khối màu khác nhau đặt CẠNH NHAU** (flex-wrap, mỗi khối 1 màu: xanh dương
  nhạt = Hỗ trợ, xanh lá = Đạt chuẩn, vàng = Nâng cao) để giáo viên nhìn thấy NGAY sự khác biệt độ
  khó giữa 3 nhóm khi lướt mắt qua, mỗi khối tự ẩn nếu rỗng (VD AI chỉ trả về 1-2/3 mức vẫn hiển
  thị đúng, không vỡ layout).
- **`lessonPlanExportService.js`** (`buildLessonPlanDocxSections`): thêm phụ lục tương ứng trong
  Word, tách trang riêng (`pageBreakBefore: true`, giống các phụ lục khác), mỗi mức là 1 đoạn tiêu
  đề màu (dùng `color` giống bản web) + danh sách đánh số riêng, dùng lại `multilineTextRuns()` có
  sẵn để xuống dòng thật.
- **`test/lessonPlanFixes.test.js`**: thêm 3 test mới (prompt bật/tắt đúng nội dung + schema 3
  field; docx có/không có phụ lục 3 nhóm đúng, không chèn phụ lục rỗng; và 1 test riêng cho
  trường hợp AI chỉ trả về 1/3 mức - xác nhận vẫn xuất đúng phụ lục, không lỗi/không render nhãn
  "Mức 2"/"Mức 3" thừa khi không có dữ liệu tương ứng).

### Đã tự verify thật (không chỉ đọc code) — sandbox phiên này CÓ MẠNG (giống Việc 4)
- `npm install` chạy bình thường (212 packages), không cần shim/script tạm như Việc 1-3.
- `npm test` chạy THẬT bằng đúng lệnh chính thức: **69/69 PASS** (66 test cũ không hỏng + 3 test
  mới của Việc 5), bao gồm giải nén `.docx` THẬT bằng `jszip` thật (gói `docx` thật).
- `npm run build` (Next.js 14.2.35): **build sạch, không lỗi type/lint**, cú pháp JSX của
  `BaiTapPhanHoaBlock` hợp lệ, route `/api/generate-lesson-plan` không đổi kích thước bất thường.
- Đã tự soi log test fail đầu tiên (do dùng regex ký tự đại diện `.` sai chỗ để né dấu tiếng Việt
  trong assertion, khiến 1 test ban đầu FAIL oan dù code đúng) → sửa lại bằng `xml.includes(...)`
  so khớp CHÍNH XÁC chuỗi Unicode thật thay vì regex - đã chạy lại xác nhận PASS đúng nghĩa (không
  phải nới lỏng test để né lỗi thật).

**Việc CHƯA làm được (cần bạn tự làm)**:
- Chưa gọi Gemini THẬT để xem AI có thực sự tạo ra 3 mức ĐỘ KHÓ KHÁC BIỆT RÕ RỆT hay có xu hướng
  chỉ đổi số liệu qua loa (đây là yêu cầu định tính khó đánh giá bằng test tự động, cần đọc bằng
  mắt nhiều lần sinh thử với `npm run dev` + API key thật, thử cả môn Toán lẫn môn khác như Tiếng
  Việt/Tự nhiên Xã hội để xem độ phân hoá có hợp lý theo từng môn không).
- Chưa xem bằng mắt trên trình duyệt thật: 3 khối màu cạnh nhau trong bản xem trước web có bị vỡ
  layout ở màn hình hẹp không (dù đã dùng `flexWrap`), và cảm giác thị giác 3 màu có dễ phân biệt/
  không gây rối mắt so với các phụ lục màu khác đã có (Tin nhắn phụ huynh màu xanh lá, Checklist
  không màu nền) hay không.
- Mặc định KHÔNG tự bật sẵn tuỳ chọn "Bài tập phân hoá" trong `selectedIntegrations` của
  `LessonPlanForm.jsx` (giáo viên cần tự tick, giống phần lớn tích hợp khác trừ `phieuHocTap`).

## Việc 6/7 — Lời dẫn (Teacher Script) — ĐÃ XONG

**Cơ chế**: tiếp tục tái dùng ĐÚNG khuôn "plugin" `LESSON_PLAN_INTEGRATIONS` (giống Việc 1/4/5) -
chỉ thêm 1 entry mới `LOI_DAN: "loiDan"`, KHÔNG phải sửa `lessonPlanPromptTemplates.js` hay
`LessonPlanForm.jsx` (UI tự động có thêm checkbox qua `listIntegrations()` sẵn có).

**Điểm khác biệt quan trọng so với Việc 1/4/5** (đúng quyết định đã chốt ở
`KE_HOACH_GIAI_DOAN_10.md` mục 2, đề xuất #2 - ĐIỀU CHỈNH so với đề xuất gốc của giáo viên): các
phụ lục trước đây (Tin nhắn PH, Checklist, Phân hoá) LUÔN xuất hiện trong file Word một khi tích
hợp được bật. Lời dẫn thì KHÔNG - vì rủi ro bị Ban Giám hiệu đánh giá "không đúng chuẩn form
CV2345" nếu vô tình có mặt trong bản nộp, nên đây là phụ lục có **"cờ ẩn-hiện" RIÊNG ở bước xuất
Word**, tách biệt với việc tích hợp có bật ở bước soạn hay không:
- Bước soạn (bật tích hợp "Lời dẫn"): AI vẫn luôn sinh ra dữ liệu `loiDan` như các tích hợp khác.
- Bản xem trước web: LUÔN hiển thị phụ lục này nếu có dữ liệu (không có rủi ro "sai form" vì đây
  không phải bản nộp).
- Xuất Word: **mặc định KHÔNG chèn** ("Bản nộp chuẩn") - giáo viên phải tự tick checkbox mới có
  ("Bản đầy đủ có lời dẫn"). Đây là lựa chọn tại thời điểm XUẤT, độc lập với lựa chọn tại thời
  điểm SOẠN, đúng tinh thần "cờ ẩn-hiện" đã chốt trong kế hoạch.

- **`lessonPlanIntegrations.js`**: thêm entry `loiDan`. Yêu cầu AI: với MỖI hoạt động trong mảng
  `hoatDong`, viết đúng 1 câu (tối đa 2 câu ngắn) lời dẫn dắt/chuyển ý mà giáo viên ĐỌC TO NGUYÊN
  VĂN trên lớp ngay trước khi bắt đầu hoạt động đó (hoạt động đầu tiên = câu mở đầu tiết học; các
  hoạt động sau = câu chuyển ý từ hoạt động liền trước). Văn phong PHẢI là lời NÓI trực tiếp với
  học sinh (xưng "cô/thầy" - gọi "các con"/"các em"), KHÔNG viết giọng văn hành chính của giáo án;
  nếu giáo viên đã chọn "Phong cách soạn giáo án" (Việc 2) thì lời dẫn PHẢI theo đúng giọng văn đó
  - tận dụng ĐÚNG hạ tầng Phong cách đã có từ Việc 2, không phát minh cơ chế riêng. Trả JSON
  `"loiDan"`: mảng object, ĐÚNG SỐ LƯỢNG = số hoạt động, ĐÚNG THỨ TỰ, mỗi phần tử
  `{ "hoatDong": "<tên hoạt động, trùng "ten">", "loiDan": "<câu dẫn dắt>" }`.
- **`lessonPlanExportService.js`**: thêm hàm `buildLoiDanParagraphs()` (mỗi hoạt động 1 đoạn tên
  in đậm + 1 đoạn lời dẫn in nghiêng trong ngoặc kép). `buildLessonPlanDocxSections()` nhận thêm
  tham số `includeTeacherScript = false` - CHỈ gọi `buildLoiDanParagraphs()` khi
  `includeTeacherScript === true` VÀ `lessonPlan.loiDan?.length` (logic "ẩn/hiện" nằm DUY NHẤT ở
  đây, không lặp lại ở nơi khác để tránh lệch nhau). Phụ lục tách trang riêng
  (`pageBreakBefore: true`, giống các phụ lục khác), có ghi chú nhỏ "(... phần THAM KHẢO, không
  thuộc khung mẫu CV2345 chuẩn)". `exportLessonPlanToWord()` nhận + truyền tiếp tham số này, và
  thêm hậu tố `-day-du-loi-dan` vào TÊN FILE khi bật (giúp giáo viên phân biệt 2 phiên bản bằng
  mắt, tránh nộp nhầm bản có lời dẫn).
- **`LessonPlanExportActions.jsx`**: thêm checkbox "Kèm phụ lục Lời dẫn khi tải Word (Bản đầy đủ -
  không dùng để nộp Ban Giám hiệu)" - CHỈ hiển thị khi giáo án thật sự có dữ liệu `loiDan` (tích
  hợp đã được bật lúc soạn), mặc định **KHÔNG tick** (an toàn - nút "Tải Word" mặc định luôn ra
  "Bản nộp chuẩn"), state cục bộ trong component (không cần thay đổi gì ở `page.js`).
- **`LessonPlanPreview.jsx`**: thêm `LoiDanBlock` - hiển thị dạng PHỤ LỤC (đặt sau Checklist NL-PC,
  trước Tin nhắn phụ huynh), mỗi hoạt động 1 khối màu vàng nhạt gồm tên hoạt động + câu lời dẫn in
  nghiêng trong ngoặc kép, có ghi chú nhỏ nhắc giáo viên rằng mặc định KHÔNG kèm khi xuất Word.
- **`test/lessonPlanFixes.test.js`**: thêm 4 test mới - (1) prompt bật/tắt đúng nội dung + schema
  `"loiDan":`/`"hoatDong":`; (2) có `loiDan` nhưng `includeTeacherScript` mặc định/`false` tường
  minh → KHÔNG có phụ lục trong Word (đúng "Bản nộp chuẩn"); (3) `includeTeacherScript=true` VÀ có
  `loiDan` → CÓ phụ lục đúng nội dung (tên hoạt động + câu dẫn) trong Word (đúng "Bản đầy đủ");
  (4) `includeTeacherScript=true` nhưng KHÔNG có `loiDan` → không chèn phụ lục rỗng.

**Không cần sửa** `lessonPlanPromptTemplates.js`, `lessonPlanEngine.js`, `lessonPlanOrchestrator.js`
(đã xác nhận: 2 file engine/orchestrator không lọc/whitelist field JSON nào, object AI trả về đi
thẳng qua nguyên vẹn - `loiDan` tự động "sống sót" tới UI giống mọi field tích hợp khác), hay
`page.js` (state checkbox nằm gọn trong `LessonPlanExportActions.jsx`).

### Đã tự verify thật (không chỉ đọc code) — sandbox phiên này CÓ MẠNG (giống Việc 4-5)
- `npm install` chạy bình thường (212 packages), không cần shim/script tạm.
- `npm test` chạy THẬT bằng đúng lệnh chính thức: **73/73 PASS** (69 test cũ không hỏng + 4 test
  mới của Việc 6), bao gồm giải nén `.docx` THẬT bằng `jszip` thật (gói `docx` thật).
- `npm run build` (Next.js 14.2.35): **build sạch, không lỗi type/lint**, cú pháp JSX của
  `LoiDanBlock` và checkbox mới trong `LessonPlanExportActions.jsx` hợp lệ.
- Đã tự phát hiện + sửa 1 lỗi ở CHÍNH bộ test mới viết (không phải lỗi code sản phẩm): 2 test ban
  đầu FAIL OAN vì dữ liệu test tự đặt `tenBai: "Bài test lời dẫn"` → tiêu đề giáo án viết hoa
  thành "BÀI TEST LỜI DẪN" tình cờ chứa sẵn chuỗi con "LỜI DẪN" khiến assertion
  `!xml.includes("LỜI DẪN")` sai dù code đúng - đã viết 1 test debug tạm (`node --test`, xoá ngay
  sau khi dùng) in ra đúng vị trí chuỗi khớp để xác nhận nguyên nhân, rồi sửa assertion so khớp
  CHÍNH XÁC tiêu đề phụ lục `"PHỤ LỤC: LỜI DẪN"` thay vì chuỗi con chung chung - chạy lại xác nhận
  PASS đúng nghĩa (không phải nới lỏng test để né lỗi thật).

**Việc CHƯA làm được (cần bạn tự làm)**:
- Chưa gọi Gemini THẬT để xem AI có thực sự viết lời dẫn ĐÚNG VĂN PHONG "lời nói trực tiếp trên
  lớp" (không lẫn giọng văn hành chính của giáo án) hay không, và có bám đúng "Phong cách soạn
  giáo án" đã chọn (Việc 2) hay không - đây là yêu cầu định tính, cần đọc bằng mắt nhiều lần sinh
  thử với `npm run dev` + API key thật, thử cả 4 phong cách (3 preset + tự do).
- Chưa xem bằng mắt trên trình duyệt thật: checkbox "Kèm phụ lục Lời dẫn..." trong
  `LessonPlanExportActions.jsx` có hiển thị/ẩn đúng lúc không (chỉ hiện khi có `loiDan`), tick/bỏ
  tick có đổi đúng tên file tải về (`-day-du-loi-dan`) và nội dung file Word tương ứng không.
- Mặc định KHÔNG tự bật sẵn tuỳ chọn "Lời dẫn" trong `selectedIntegrations` của
  `LessonPlanForm.jsx` (giáo viên cần tự tick, giống phần lớn tích hợp khác trừ `phieuHocTap`).

## Việc 7/7 — Slide Outline — ĐÃ XONG (HOÀN TẤT GIAI ĐOẠN 10, 7/7 việc)

**Cơ chế**: tái dùng đúng khuôn "plugin" `LESSON_PLAN_INTEGRATIONS` - thêm entry
`SLIDE_OUTLINE: "slideOutline"`, không sửa `lessonPlanPromptTemplates.js`/`LessonPlanForm.jsx`.

**Giới hạn phạm vi có chủ đích** (đúng quyết định đã chốt ở `KE_HOACH_GIAI_DOAN_10.md` mục 2, đề
xuất #3 - ĐIỀU CHỈNH so với đề xuất gốc của giáo viên): CHỈ dàn ý VĂN BẢN thuần tuý (danh sách
slide + gạch đầu dòng nội dung gợi ý), **KHÔNG** tạo file `.pptx` thật, **KHÔNG** hứa hẹn hiệu ứng
trình chiếu/animation như ví dụ giáo viên từng đưa ra ban đầu (ngoài khả năng kiểm soát, rủi ro kỹ
thuật không tương xứng lợi ích). Có test riêng canh gác việc prompt KHÔNG được nhắc tới `.pptx`.

**Khác với Lời dẫn (Việc 6)**: phụ lục này KHÔNG cần "cờ ẩn-hiện" khi xuất Word - vì đây chỉ là
dàn ý tham khảo, không đụng khung mục I-IV chuẩn CV2345 nên không có rủi ro "sai form" khi BGH
duyệt. Luôn xuất hiện trong Word một khi tích hợp được bật, giống Tin nhắn PH/Checklist/Phân hoá.

- **`lessonPlanIntegrations.js`**: thêm entry `slideOutline`. Yêu cầu AI: dàn ý 6-10 slide theo
  tiến trình bài dạy, BẮT BUỘC có slide "Trang bìa" đầu tiên và slide "Kết thúc/Dặn dò" cuối cùng,
  các slide giữa bám ĐÚNG THỨ TỰ 4 hoạt động (có thể tách 1 hoạt động dài thành nhiều slide). Mỗi
  slide: 1 tiêu đề + 2-5 gạch đầu dòng NGẮN GỌN (không viết câu văn hoàn chỉnh dài dòng). Trả JSON
  `"slideOutline": [ { "tieuDe": "...", "noiDung": ["...", "..."] } ]`.
- **`lessonPlanExportService.js`**: thêm `buildSlideOutlineParagraphs()` (mỗi slide 1 đoạn tiêu đề
  đánh số "Slide N: ..." in đậm + danh sách gạch đầu dòng thật của `docx`). Chèn phụ lục tách
  trang (`pageBreakBefore: true`) khi `lessonPlan.slideOutline?.length` - LUÔN chèn nếu có dữ liệu
  (không có tham số cờ như `includeTeacherScript` của Việc 6).
- **`LessonPlanPreview.jsx`**: thêm `SlideOutlineBlock` - hiển thị dạng "storyboard" đơn giản, mỗi
  slide 1 thẻ màu tím nhạt xếp cạnh nhau (flex-wrap) gồm số thứ tự + tiêu đề + danh sách gạch đầu
  dòng, đặt sau `TinNhanPhuHuynhBlock` (cuối cùng trong danh sách phụ lục).
- **`test/lessonPlanFixes.test.js`**: thêm 2 test mới - (1) prompt bật/tắt đúng nội dung + schema
  `"slideOutline":`/`"tieuDe":`/`"noiDung":`, kèm assertion riêng xác nhận prompt KHÔNG nhắc tới
  `.pptx` (canh gác đúng quyết định giới hạn phạm vi); (2) docx có/không có phụ lục dàn ý slide
  đúng, kèm kiểm tra đánh số "Slide 1:"/"Slide 2:" và nội dung gợi ý.

**Không cần sửa** `lessonPlanPromptTemplates.js`, `lessonPlanEngine.js`, `lessonPlanOrchestrator.js`,
`page.js` - cùng lý do đã xác nhận ở Việc 6 (object AI trả về đi thẳng qua nguyên vẹn, không có
whitelist field nào chặn `slideOutline`).

### Đã tự verify thật (không chỉ đọc code) — sandbox phiên này CÓ MẠNG (giống Việc 4-6)
- `npm install` chạy bình thường (212 packages).
- `npm test` chạy THẬT bằng đúng lệnh chính thức: **75/75 PASS** (73 test cũ không hỏng + 2 test
  mới của Việc 7), bao gồm giải nén `.docx` THẬT bằng `jszip` thật.
- `npm run build` (Next.js 14.2.35): **build sạch, không lỗi type/lint**, cú pháp JSX của
  `SlideOutlineBlock` hợp lệ.

**Việc CHƯA làm được (cần bạn tự làm)**:
- Chưa gọi Gemini THẬT để xem AI có thực sự chia slide hợp lý (không quá nhiều/quá ít chữ mỗi
  gạch đầu dòng, có tách hợp lý hoạt động dài thành nhiều slide hay không) - cần đọc bằng mắt
  nhiều lần sinh thử với `npm run dev` + API key thật.
- Chưa xem bằng mắt trên trình duyệt thật: các thẻ slide màu tím cạnh nhau có bị vỡ layout ở màn
  hình hẹp không, và có dễ phân biệt với các phụ lục màu khác đã có hay không.
- Mặc định KHÔNG tự bật sẵn tuỳ chọn "Slide Outline" trong `selectedIntegrations` của
  `LessonPlanForm.jsx` (giáo viên cần tự tick, giống phần lớn tích hợp khác trừ `phieuHocTap`).

---

## TỔNG KẾT GIAI ĐOẠN 10 (7/7 việc đã hoàn thành)

Toàn bộ 7 việc trong `KE_HOACH_GIAI_DOAN_10.md` đã hoàn thành theo đúng thứ tự đã chốt: (1) Tin
nhắn Zalo phụ huynh, (2) Phong cách soạn giáo án, (3) Chống trùng liên giáo viên, (4) Checklist
NL-PC, (5) Bài tập phân hoá 3 mức, (6) Lời dẫn (Teacher Script), (7) Slide Outline. Tất cả đều
dùng chung 1 khuôn "plugin" `LESSON_PLAN_INTEGRATIONS` (trừ Việc 2/3 là hạ tầng nền tảng riêng),
không phá vỡ khung mẫu CV2345 chuẩn (Mục I-IV), mọi phụ lục đều bật/tắt độc lập. Bộ test hiện có
**75/75 PASS**. Các bước kiểm tra bằng mắt/gọi AI thật còn lại (liệt kê ở từng mục Việc 1-7 phía
trên) cần bạn tự thực hiện với `npm run dev` + API key thật trước khi đưa vào sử dụng thực tế cho
giáo viên. Giai đoạn 9 (Phiếu bài tập, còn dở) vẫn để nguyên như đã thống nhất từ đầu.

---

## GIAI ĐOẠN 11 — Rà soát tổng thể sau phản ánh giáo viên (PDF Phiếu bài tập Toán bị nền đen +
lề chưa full A4 + mục "Xem đồng hồ" không bấm chọn được)

Giáo viên gửi file `toan_1.pdf` (xuất từ "Phiếu bài tập") kèm ảnh chụp Foxit PDF Reader: trang 1
hiển thị NỀN ĐEN (chữ/khung màu vẫn đọc được), phản ánh thêm 2 việc: (a) phiếu "chưa full tờ giấy
A4, bị margin 4 phía", (b) mục 11 "Xem đồng hồ" (thời gian) "không bấm chọn được". Yêu cầu rà soát
tổng thể xem còn sai sót gì khác không.

### 11.1. Đã tự verify thật (không chỉ đọc code) — sandbox phiên này CÓ MẠNG
- `npm install`: chạy sạch, 221 packages.
- `npm test` (LẦN ĐẦU, trước khi sửa gì): **107/114 PASS, 7 FAIL** — toàn bộ 7 test fail đều nằm
  trong `test/lessonPlanExportService.test.js` (phụ lục Lời dẫn/Slide Outline của Giai đoạn 10,
  Việc 6-7), lỗi giống hệt nhau: `Cannot read properties of undefined (reading 'arrayBuffer')`.
  → Đây là **lỗi thật, không liên quan gì đến "Phiếu bài tập"** giáo viên đang phản ánh, nhưng vì
  yêu cầu là "kiểm tra tổng thể" nên đã tìm ra và sửa luôn (xem 11.2 bên dưới).
- `npm run build` (Next.js 14.2.35): build sạch, không lỗi type/lint. Các dòng
  `Dynamic server usage: ... couldn't be rendered statically because it used request.headers` in
  ra trong log là BÌNH THƯỜNG (các route `/api/*` cố ý dùng `request.headers` để đọc token đăng
  nhập, Next.js chỉ đang giải thích lý do không prerender tĩnh được — không phải lỗi build).
- `npm test` (SAU khi sửa): **114/114 PASS**.
- Đọc toàn bộ `WorksheetPreview.jsx` (953 dòng), `globals.css` (khối `.worksheet-*` +
  `@media print`), `worksheetLayoutTemplates.js` (bảng màu `COLOR_PALETTES`), `constants.js`
  (`PAGE_A4_MM`, `PAGE_MARGIN_MM`) để xác nhận **không có màu đen/tối nào trong toàn bộ hệ thống
  màu của "Phiếu bài tập"** — 9 bảng màu trong `COLOR_PALETTES` đều là tông sáng (xanh, hồng,
  vàng, cam, xanh lá, tím, nâu, đỏ), nền `.worksheet-outer`/`.worksheet-inner` là trắng/kem
  (`#fffefb`, `#fff`). Kết luận ở 11.3.

### 11.2. Bug thật tìm thấy khi rà soát tổng thể — ĐÃ SỬA: `exportLessonPlanToWord()` không
`return blob`
- **File**: `src/services/lessonPlanExportService.js`.
- **Lỗi**: hàm dựng xong file `.docx` (`Packer.toBlob(doc)`), gọi `saveAs(blob, ...)` để tải file
  nhưng **không `return blob`** ở cuối hàm (khác với khuôn mẫu `buildExamDocxBlob()` trong
  `exportService.js` — hàm đó LUÔN return blob). Hệ quả: bất kỳ đoạn code nào `await
  exportLessonPlanToWord(...)` để lấy lại blob (VD test tự giải nén `.docx` ra kiểm tra nội dung)
  chỉ nhận về `undefined`.
- **Vì sao KHÔNG ảnh hưởng giáo viên khi dùng bình thường**: `LessonPlanExportActions.jsx` (nút
  "Tải Word" của giáo án) gọi hàm này nhưng KHÔNG dùng giá trị trả về (`saveAs()` bên trong hàm đã
  tự tải file rồi) → giáo viên tải file giáo án bình thường vẫn ra file `.docx` đúng, không lỗi gì
  thấy được trên UI. Đây đúng kiểu lỗi "im lặng" chỉ lộ ra khi có test tự động giải nén file thật
  để kiểm tra nội dung — lý do `npm test` bắt được còn test tay qua UI 1-2 lần thì không.
- **Sửa**: thêm `return blob;` vào cuối hàm (sau dòng `saveAs(...)`) — không đổi hành vi tải file
  hiện có, chỉ bổ sung giá trị trả về. Đã verify: 7/7 test trong
  `test/lessonPlanExportService.test.js` chuyển từ FAIL sang PASS, không có test nào khác bị ảnh
  hưởng (114/114 PASS toàn bộ suite).

### 11.3. Nền đen khi xuất/xem PDF — KHÔNG PHẢI lỗi code, nghi nhiều nhất do "Night mode"/"chế độ
tối" của Foxit PDF Reader
- Cơ chế xuất PDF của app (`exportToPDF()` trong `exportService.js`) chỉ gọi `window.print()` —
  KHÔNG dùng thư viện tạo PDF riêng, tức PDF thật ra là trình duyệt tự "in" đúng HTML/CSS đang
  hiển thị trên `#print-area` ra file. Đã đọc lại toàn bộ màu sắc dùng trong `.worksheet-*`
  (globals.css) và `COLOR_PALETTES` (9 bảng màu) — **không có bất kỳ giá trị màu đen/tối nào**
  được gán làm nền cho trang hay khung phiếu, kể cả khi ép `print-color-adjust: exact` (khối CSS ở
  dòng ~296-317 globals.css, được thêm từ Giai đoạn 9 để sửa lỗi MẤT màu nền khi in — không phải
  nguyên nhân sinh ra màu đen, chỉ giữ đúng màu nền ĐÃ CÓ, mà ở đây các nền đều sáng).
  → Với dữ liệu này, nguyên nhân hợp lý nhất nằm ở NGOÀI code: ảnh chụp màn hình bạn gửi ghi rõ
  "Foxit PDF Reader" — phần mềm này có tính năng **"Night Reading"/chế độ đọc ban đêm** hay bị bật
  nhầm (đảo màu nền sáng ⇄ tối để đỡ chói mắt khi đọc, KHÔNG sửa lại file PDF thật, chỉ đổi cách
  HIỂN THỊ) — khớp chính xác với hiện tượng bạn mô tả: khung viền màu, chữ vẫn đọc được bình
  thường, chỉ riêng phần NỀN bị đổi thành đen.
- **Cách kiểm tra nhanh để xác nhận** (không cần sửa code):
  1. Mở lại đúng file `toan_1.pdf` bằng phần mềm khác (trình duyệt Chrome/Edge, hoặc Microsoft
     Edge PDF viewer) — nếu nền lại thành trắng bình thường thì chắc chắn lỗi nằm ở Foxit, không
     phải ở file.
  2. Trong Foxit: menu **View → Color Mode** (hoặc icon "Night Reading"/mặt trăng ở thanh công cụ)
     → chọn lại **"Normal"/"Original Colors"** rồi mở lại file.
  3. Nếu vẫn xuất hiện nền đen ngay TRÊN TRÌNH DUYỆT lúc bấm "In / Tải PDF" (chưa mở bằng Foxit) —
     kiểm tra máy tính có đang bật "Force Dark Mode"/"Dark theme for web contents" trong
     `chrome://flags` không (tính năng thử nghiệm, ép mọi trang web hiển thị tối, có thể ảnh hưởng
     cả nội dung in) — tắt cờ này nếu có.
  → Nếu làm đủ 3 bước trên mà nền VẪN đen, báo lại kèm bạn đã thử phần mềm/cách nào, khi đó mới
  cần đào sâu thêm ở phía code (khả năng rất thấp dựa trên bằng chứng đã có).

### 11.4. Phiếu "chưa full A4, bị margin 4 phía" — ĐÚNG NHƯ THIẾT KẾ (không phải bug), nhưng CÓ 1
điểm giáo viên cần tự chỉnh khi in để tránh lề bị NHÂN ĐÔI
- Trang phiếu có 2 lớp "lề" CHỒNG lên nhau, cả 2 đều CHỦ Ý, không phải lỗi:
  1. **Lề vật lý trang in** (`@page { margin: 20mm 18mm }` trong `globals.css`, khớp
     `PAGE_MARGIN_MM` trong `constants.js`) — lề an toàn bắt buộc phải có để máy in không cắt mất
     nội dung sát mép giấy, đã thống nhất giá trị này ở CẢ 3 nơi (CSS `.a4-page`/`@page` + JS
     `constants.js`) từ Giai đoạn 1, xác nhận lại lần này vẫn khớp, không lệch.
  2. **"Khung thẻ" trang trí bên trong** (`.worksheet-outer` viền trắng dày 10px + đổ bóng, rồi
     mới tới `.worksheet-inner` viền chấm màu + padding 30px/26px) — đây là hiệu ứng "tờ giấy dán
     nổi trên nền" CHỦ Ý của thiết kế phiếu (giống 1 tấm thiệp/khung ảnh), khiến phần nội dung
     thực tế bị "lùi vào" thêm 1 lớp nữa so với mép trang, CỘNG DỒN với lề vật lý ở trên → tổng lề
     nhìn thấy lớn hơn 20mm/18mm khá nhiều, đúng cảm giác "chưa full A4" bạn thấy.
  → Đây là lựa chọn thẩm mỹ (matting/khung ảnh) đã có từ đầu dự án, áp dụng ĐỀU cho mọi phiếu bài
  tập, không phải lỗi phát sinh riêng ở file này.
- **Điểm cần giáo viên tự kiểm tra khi in/lưu PDF** (rất hay bị bỏ sót, làm lề nhìn còn to hơn cả
  2 lớp trên cộng lại): hộp thoại in của trình duyệt (Chrome/Edge) có mục **"Margins/Lề"** riêng
  của trình duyệt, KHÁC với `@page` margin trong CSS — nếu để **"Default/Mặc định"**, trình duyệt
  sẽ CHÈN THÊM lề của riêng nó ĐÈ LÊN lề đã khai báo trong CSS (2 lớp lề cộng dồn); phải chọn
  **"None/Không có"** trong mục Margins của hộp thoại in thì lề thực tế mới đúng CHÍNH XÁC 20mm/
  18mm như CSS đã định, không bị nhân đôi. Đây là hành vi tiêu chuẩn của Chrome khi in trang web
  bất kỳ (không riêng app này) và JS không có cách nào tự động chọn hộ mục này vì lý do bảo mật
  trình duyệt.
- Nếu SAU KHI đã chọn Margins = "None" mà giáo viên vẫn muốn phiếu "sát mép" hơn nữa (giảm hẳn lớp
  khung thẻ trắng/viền chấm cho gần full-bleed) thì đó là 1 thay đổi THIẾT KẾ thật sự (không phải
  sửa lỗi) — cần bạn xác nhận muốn đổi trước khi làm, vì sẽ ảnh hưởng đồng loạt mọi phiếu bài tập,
  không chỉ riêng đề Toán này.

### 11.5. Mục 11 "Xem đồng hồ" không bấm chọn được — ĐÚNG NHƯ THIẾT KẾ, giống HỆT mọi mục khác
trong "Phiếu bài tập" (không phải lỗi riêng của mục này)
- Đã đọc kỹ toàn bộ `WorksheetPreview.jsx`: **không có bất kỳ `onClick`/`contentEditable`/input
  tương tác nào** trong cả 953 dòng, ở TẤT CẢ 17 dạng bài (kể cả mục 3 "Điền dấu >, <, =" trông
  giống nút tròn có thể bấm, hay mục 8 "Nối phép tính" trông giống có thể kéo-nối) — toàn bộ khung
  xem trước chỉ gồm `<div>`/`<span>` tĩnh vẽ hình khung/vòng tròn/ô trống RỖNG để học sinh **tự
  viết/tô bằng bút sau khi in ra giấy**, không phải 1 bài tập tương tác làm trực tiếp trên máy.
  → Mục 11 "Xem đồng hồ" (kim đồng hồ SVG + ô trống ghi giờ) hoạt động ĐÚNG Y HỆT logic này, không
  hề bị thiếu tính năng so với các mục khác — cả phiếu vốn KHÔNG mục nào bấm chọn được.
- Nếu ý bạn là **muốn có 1 phiên bản làm bài tương tác trên máy** (bấm chọn đáp án, kéo-nối, tô
  màu bằng chuột...) thay vì chỉ để in ra giấy, đây sẽ là 1 TÍNH NĂNG MỚI cần thiết kế riêng (đổi
  hẳn cách hiển thị + cần lưu trạng thái bài làm), không phải sửa lỗi — báo lại nếu đây đúng là điều
  bạn cần, để lên kế hoạch riêng cho việc này.

### Tổng kết Giai đoạn 11
- **1 bug thật đã sửa**: `exportLessonPlanToWord()` thiếu `return blob` (không liên quan phiếu bài
  tập, phát hiện khi rà soát tổng thể qua `npm test`).
- **3 phản ánh về "Phiếu bài tập Toán"**: cả 3 đều XÁC NHẬN không phải lỗi trong code hiện tại của
  riêng file/đợt tạo này — 2 việc (nền đen, lề) nhiều khả năng do môi trường/thao tác khi in-xem
  PDF (xem hướng dẫn kiểm tra ở 11.3/11.4), 1 việc (đồng hồ không bấm được) là hành vi THIẾT KẾ
  nhất quán của toàn bộ tính năng "Phiếu bài tập" (chỉ để in, không tương tác).
- Test: **114/114 PASS**. Build: sạch.
- **Việc CHƯA làm — cần bạn tự làm**: thử in/lưu PDF THẬT với Margins="None" trong hộp thoại in +
  kiểm tra file bằng phần mềm đọc PDF khác ngoài Foxit theo đúng 3 bước ở mục 11.3, rồi báo lại kết
  quả — nếu nền đen/lề vẫn sai SAU KHI làm đúng các bước đó thì mới cần bạn gửi lại để đào sâu thêm
  phía code.

---

## BƯỚC 1 (Nhóm D), VIỆC #7 + #8 — Rà soát tiêu đề in đậm + PDF thân thiện phụ huynh — ĐÃ XONG
(phiên 6, kèm chốt quyết định "lịch sử nhận xét học bạ" đang treo từ NEXT_STEPS.md)

### Quyết định đã chốt: lịch sử nhận xét học bạ ưu tiên XOÁ SỚM (không giữ so sánh kỳ trước)
- Chọn hướng (b) thay vì (a): `reportCommentHistoryStore.js` viết lại để dữ liệu mỗi học sinh tự
  xoá trong vòng TỐI ĐA 1 GIỜ kể từ lần lưu đầu tiên (2 lớp bảo vệ: Upstash `EXPIRE 3600` đặt 1
  LẦN DUY NHẤT khi TTL chưa có + lọc `savedAt` phòng hờ ở cả 2 backend khi đọc/ghi).
- Hệ quả: KHÔNG còn tính năng "so sánh với kỳ trước" (các kỳ cách nhau hàng tháng, xa hơn 1 giờ
  rất nhiều) — vì vậy KHÔNG cần làm việc chuẩn hoá giá trị "Lớp" (VD "1A" vs "Lớp 1A") như hướng
  (a) từng yêu cầu. AI chỉ còn "nhớ" nhận xét cùng học sinh TRONG CÙNG 1 đợt chấm bài liên tục.
- File sửa: `src/services/reportCommentHistoryStore.js` (viết lại toàn bộ, giữ nguyên chữ ký hàm
  export `getPreviousComment`/`getFullCommentHistory`/`saveReportCommentHistory` nên KHÔNG cần
  sửa 2 nơi gọi ở `src/app/api/generate-report-comment/route.js` và
  `src/app/api/report-comment-history/route.js`).

### Việc #7 — Rà soát tiêu đề in đậm nhất quán (Word + A4 preview, cả 4-5 tab) — KHÔNG TÌM THẤY LỖI
- Đã rà từng tab: `exportService.js`/`A4LivePreview.jsx` (Đề kiểm tra — `.gdt-exam-title` bold
  700), `worksheetExportService.js`/`WorksheetPreview.jsx` (Phiếu bài tập — `.worksheet-title-badge`
  font-weight 800), `lessonPlanExportService.js`/`LessonPlanPreview.jsx` (Giáo án — bold true size
  30 khớp `<h1 style={{fontWeight:700}}>`), `vietnameseExamExportService.js`/`VietnameseExamPreview.jsx`
  (Đề Tiếng Việt — tiêu đề cố định, bold cả 2 nơi), `reportCommentExportService.js`/`ReportCommentPreview.jsx`
  (tên học sinh — bold true size 28 khớp `font-bold` trên StudentCard).
- Cũng kiểm tra `exportBothVersions()`/`generateFourExamVariants()` (4 Mã Đề) — đều tái dùng
  `buildExamDocxBlob()` nên thừa hưởng đúng style bold, không có nhánh riêng lệch chuẩn.
- Kết luận: tiêu đề chính đã in đậm nhất quán ở CẢ Word lẫn A4 preview từ trước — không có thay
  đổi code nào cho việc này, chỉ xác nhận qua rà soát.

### Việc #8 — PDF "thân thiện phụ huynh" cho Nhận xét học bạ — ĐÃ LÀM (phần Nhận xét học bạ; phần
`outlineExportService.js` của Đề cương Ôn tập để dành cho Bước 2/Nhóm B vì tab đó CHƯA tồn tại)
- Trước đây "reportComment" KHÔNG có in/PDF (chỉ Word/Excel/Sao chép) — theo đúng ghi chú cũ trong
  `page.js`. Giờ thêm 1 luồng PDF riêng, văn phong THƯ NGỎ gửi phụ huynh (khác hẳn khung "chuẩn Bộ
  GD&ĐT" `.a4-page`/`.gdt-*` dùng cho Đề kiểm tra), dùng lại ĐÚNG kỹ thuật `window.print()` +
  `id="print-area"` đã có sẵn (0 thư viện PDF mới, giữ tinh thần "$0 chi phí, ít phụ thuộc").
- File mới: `src/components/ReportCommentPdfView.jsx` (khung in, ẩn màn hình bằng CSS
  `.report-pdf-only { display:none }` + `@media print { display:block }`, chỉ hiện khi in).
- Hàm mới TÁCH RIÊNG (không gộp outline): `buildParentFriendlyReportSections()` trong
  `reportCommentExportService.js` — hàm THUẦN (không JSX/CSS), test được bằng Node thuần, chỉ
  chuẩn bị dữ liệu cho `ReportCommentPdfView.jsx` map ra JSX.
- CSS mới: nhóm `.report-pdf-*` trong `globals.css` (không dùng lại `.a4-page`/`.gdt-*`) — kế thừa
  MIỄN PHÍ 2 rule chung sẵn có qua cùng `id="print-area"` (ẩn phần tử khác khi in, ép in màu nền).
- Nút mới: "Tải PDF (bản phụ huynh)" trong `ReportCommentExportActions.jsx`, gọi `window.print()`.
- ⚠️ LƯU Ý QUAN TRỌNG cho ai đọc lại sau: `Tailwind content` trong `tailwind.config.js` CHỈ scan
  `src/app/**` và `src/components/**` — KHÔNG scan `src/services/**`. Vì vậy hàm
  `buildParentFriendlyReportSections()` (nằm trong services/) KHÔNG được phép trả về/định nghĩa
  class Tailwind (sẽ bị purge mất khi build production) — mọi style của PDF thân thiện phụ huynh
  phải nằm ở CSS thuần (`globals.css`) hoặc trong `.jsx` (được Tailwind scan), không được đặt ở
  `.js` service. Nếu sau này viết `outlineExportService.js` (Bước 2/Nhóm B) cũng phải nhớ đúng
  ràng buộc này.
- Cập nhật lại chú thích cũ trong `page.js` (dòng giải thích `MODES`) — trước ghi "reportComment
  không dùng in ấn A4", giờ không còn đúng nữa.

### Đã tự verify thật (không chỉ đọc code) — sandbox phiên này CÓ MẠNG
- `npm install` thật (221 packages) + `npm test`: **114/114 PASS** (không có test nào riêng cho
  `reportCommentHistoryStore.js`/PDF thân thiện phụ huynh — CHƯA VIẾT test mới, xem "Chưa làm" bên
  dưới) + `npm run build`: **sạch, exit code 0**, `✓ Compiled successfully`, 20/20 static page.
- 2 dòng "Dynamic server usage" cho `/api/report-comment-history` và `/api/report-comment-template`
  trong log build là HÀNH VI CÓ SẴN TỪ TRƯỚC (route dùng `request.headers`, Next.js coi là route
  động — đúng bản chất, KHÔNG PHẢI lỗi mới phát sinh từ việc sửa lần này).

### Việc CHƯA làm — để bạn tự quyết định thời điểm quay lại
- CHƯA viết test tự động cho `reportCommentHistoryStore.js` (TTL 1 giờ) và
  `buildParentFriendlyReportSections()` — cả 2 đều là hàm thuần, có thể test bằng `node --test`
  không cần mạng, nên làm được bất kỳ lúc nào rảnh (không cấp bách, không phải blocker).
- CHƯA tự bấm nút "Tải PDF (bản phụ huynh)" trên trình duyệt thật để xem bằng mắt (sandbox không
  có UI trình duyệt) — nên tự thử 1 lần trước khi coi là ổn định, đặc biệt kiểm tra ngắt trang
  giữa các học sinh (`.report-pdf-page-break`) có đúng khi có từ 2 học sinh trở lên hay không.

---

## Quy trình khi mở chat mới
1. Upload lại zip code mới nhất (sandbox reset giữa các phiên) + file `PROJECT_SUMMARY.md` này (+
   `KE_HOACH_GIAI_DOAN_10.md` nếu đang làm tiếp Giai đoạn 10).
2. Nói rõ đang muốn tiếp tục việc gì (VD: "làm tiếp Việc 2 Giai đoạn 10 - Phong cách soạn giáo án"
   hoặc "đã test Gemini thật, ổn rồi, làm tiếp [việc X]" hoặc "review lại lần nữa", hoặc "đã thử in
   Margins=None rồi mà vẫn nền đen/lề sai - đây là kết quả...").
3. Sau khi hoàn thành, yêu cầu cập nhật lại chính `PROJECT_SUMMARY.md` trước khi đóng gói zip mới.

---

## BƯỚC 2 (NHÓM B) — TÍNH NĂNG "ĐỀ CƯƠNG ÔN TẬP" — ĐÃ XONG (phiên 7)

Tab MỚI thứ 6, đặt đúng thứ tự đã chốt trong NEXT_STEPS.md: Soạn Giáo án → Phiếu Bài Tập → Đề
Tiếng Việt Tiểu học → **Đề Cương Ôn Tập** → Tạo Đề Kiểm Tra → Nhận Xét Học Bạ (`page.js`, hằng số
`MODES` đã sắp lại đúng thứ tự này, nút bấm + nhánh nội dung ternary cũng theo đúng thứ tự).

### Kiến trúc (đúng khuôn "form → blueprint → API route → orchestrator → engine → prompt → AI"
đã dùng cho Giáo án/Đề kiểm tra, KHÔNG tái dùng code của 2 tính năng đó - chỉ tái dùng
`githubService.js` làm nguồn kiến thức SGK chung)
- `src/data/outlineTemplates.js`: 3 mức `OUTLINE_LEVELS` (`coBan`/`nangCao`/`vanDungCao`),
  `splitChaptersBySemester()` - quy ước chia đôi TẠM THỜI danh sách chương cho 2 nút bấm nhanh
  "Học kỳ I/II" (KHÔNG PHẢI phân phối chương trình chính thức - kho kiến thức hiện tại không có
  nguồn nào khác để tham chiếu, giáo viên vẫn tự chỉnh tay được sau khi bấm).
- `src/data/outlinePromptTemplates.js`: dựng prompt AI cho cấu trúc "3 Trụ cột" (Kiến thức cốt
  lõi / Dạng bài + bài mẫu / Ngân hàng bài tập 3 mức) + trường `thuNgoPhuHuynh` (thư ngỏ tự động
  gửi phụ huynh). KHÔNG dùng LaTeX (giống Giáo án, khác Đề kiểm tra) vì `outlineExportService.js`
  KHÔNG có pipeline LaTeX → MathML → OMML.
- `src/services/outlineEngine.js`/`outlineOrchestrator.js`: đúng khuôn `lessonPlanEngine.js`/
  `lessonPlanOrchestrator.js` (retry + backoff khi quá tải, KHÔNG chặn cả lượt soạn nếu 1/nhiều
  chương SGK tải lỗi - dùng `Promise.allSettled()` trên `fetchChaptersSeparately()` sẵn có trong
  `githubService.js`, gộp nội dung nhiều chương thành 1 khối).
- `src/app/api/generate-outline/route.js`: `requireAuth` + `requireWithinTeacherGenerateLimit` +
  clamp `exerciseCounts` (xem bên dưới) đúng khuôn `/api/generate-lesson-plan`.
- `src/data/outlineBlueprint.js`/`outlineResult.js`: contract client↔server, đúng khuôn
  `lessonPlanBlueprint.js`/`lessonPlanResult.js`.
- `src/services/contentGenerationLimits.js`: thêm `getOutlineMaxPerLevel()` (mặc định 15),
  `getOutlineMaxTotalExercises()` (mặc định 30), `clampOutlineExerciseCounts()` - TÁI DÙNG đúng
  thuật toán `clampExerciseCounts()` (clamp từng mức trước, cắt bớt mức CUỐI CÙNG nếu tổng vẫn
  vượt trần), áp dụng cho 3 key cố định thay vì nhiều key tự do.
- `src/components/OutlineForm.jsx`: Môn/Lớp/Tập + chọn NHIỀU chương (khác Giáo án - luôn 1
  chương) + 3 nút bấm nhanh "Học kỳ I/II/Cả năm" + 3 ô nhập số bài/mức + "Yêu cầu đặc biệt".
- `src/components/OutlinePreview.jsx`: khung `.a4-page` hiển thị đủ 3 Trụ cột + khối "Thư ngỏ gửi
  Phụ huynh" màu vàng nhạt ở cuối trang.

### Xuất file - `OutlineExportActions.jsx` + `outlineExportService.js` (MỚI HOÀN TOÀN, ĐỘC LẬP)
- 2 luồng tải ĐỒNG THỜI (đúng khuôn `exportWorksheetBothVersions()`, không có checkbox vì luôn có
  đủ đáp án tin cậy, khác Giáo án/Nhận xét học bạ):
  - **Bản Học sinh** (`showAnswers=false`): có Kiến thức cốt lõi + đề bài mẫu/đề ngân hàng bài
    tập, KHÔNG có lời giải bài mẫu/đáp án ngân hàng bài tập (bản Học sinh vẫn giữ NGUYÊN Kiến thức
    cốt lõi vì đó là lý thuyết tham khảo, không phải "đáp án" cần giấu) - KHÔNG có phụ lục Thư ngỏ.
  - **Bản GV-Phụ huynh** (`showAnswers=true`): đầy đủ lời giải/đáp án + phụ lục "THƯ NGỎ GỬI PHỤ
    HUYNH" chèn Ở ĐẦU file (trước cả 3 Trụ cột) - giáo viên đọc/gửi ngay không cần lật tới cuối.
- `buildParentFriendlyOutlineParagraphs(thuNgoPhuHuynh, meta)`: hàm "style thân thiện phụ huynh"
  riêng theo đúng yêu cầu NEXT_STEPS.md, ĐỘC LẬP với `buildParentFriendlyReportSections()` (Nhận
  xét học bạ) - 2 tính năng bố cục khác hẳn (thư ngỏ theo ĐỀ CƯƠNG >< theo TỪNG HỌC SINH). Hàm
  này trả về mảng `Paragraph` của thư viện "docx" (KHÔNG PHẢI JSX/class Tailwind) nên không bị
  ảnh hưởng bởi giới hạn Tailwind `content` scan đã ghi chú ở Bước 1 Việc #8 - giới hạn đó chỉ áp
  dụng cho hàm trả JSX/CSS class; vẫn giữ nguyên tắc "hàm thuần, test được bằng Node" để nhất quán.
- ⚠️ Quyết định phạm vi: KHÔNG làm thêm 1 pipeline PDF-in-riêng kiểu `ReportCommentPdfView.jsx`
  (khung `.report-pdf-only` ẩn/hiện khi in) cho tính năng này - vì Đề cương Ôn tập ĐÃ CÓ sẵn bản
  xem A4 chuẩn (`OutlinePreview.jsx`, `id="print-area"`) nên nút "In / Tải PDF" hoạt động trực
  tiếp qua `exportToPDF()` (dùng lại nguyên hàm `window.print()` có sẵn trong `exportService.js`),
  khác Nhận xét học bạ (vốn KHÔNG có bản A4 preview, phải dựng thêm khung in riêng). "Thư ngỏ Phụ
  huynh" hiển thị ngay trong `OutlinePreview.jsx` (khối màu vàng cuối trang) - in trực tiếp cùng
  cả trang, không cần tách trang riêng.

### Đã tự verify thật (không chỉ đọc code) — sandbox phiên này CÓ MẠNG
- `npm install` thật (221 packages, không đổi so với phiên 6 - không thêm dependency mới).
- `npm test` chạy THẬT bằng đúng lệnh chính thức: **123/123 PASS** (114 test cũ không hỏng + 9
  test mới: 5 test `outlineExportService.test.js` giải nén `.docx` THẬT bằng `jszip` thật xác
  nhận đúng bản Học sinh/GV-PH tách bạch đáp án + phụ lục Thư ngỏ, 4 test `clampOutlineExerciseCounts`
  bổ sung vào `contentGenerationLimits.test.js`).
- `npm run build` (Next.js 14.2.35): **build sạch, không lỗi type/lint**, route
  `/api/generate-outline` xuất hiện đúng trong danh sách route đã build (kiểu `ƒ` - dynamic, đúng
  bản chất route cần `requireAuth`). Dòng "Dynamic server usage" cho 2 route report-comment-* là
  hành vi CÓ SẴN TỪ TRƯỚC (Giai đoạn 11), KHÔNG PHẢI lỗi mới phát sinh từ Bước 2.

**Việc CHƯA làm được (cần bạn tự làm)** - xem chi tiết đầy đủ trong `NEXT_STEPS.md` mục "Nhóm A":
chưa tự bấm nút trên trình duyệt thật với API key thật để xem bằng mắt (a) 2 nút Học kỳ I/II có
chọn đúng nhóm chương hợp lý cho MÔN/LỚP thật của bạn không, (b) văn phong "Thư ngỏ Phụ huynh" AI
sinh ra, (c) vị trí phụ lục Thư ngỏ trong file Word GV-PH, (d) đề cương gộp nhiều chương có phân
bổ đều nội dung cho tất cả chương hay chỉ tập trung 1-2 chương đầu.

## PHIÊN 8 — Fix tab mặc định + tiếp nhận phản hồi thực tế sau khi test "Đề cương Ôn tập"

### Đã làm: Fix tab mặc định khi mới vào web
Trước đó lỡ để `mode` khởi tạo mặc định là `MODES.EXAM` ("Đề kiểm tra") dù tab "📘 Soạn giáo án"
đã ở vị trí nút bấm đầu tiên (từ Bước 2/phiên 7) — 2 chỗ không khớp nhau. Đã sửa `src/app/page.js`:
- Khởi tạo `useState(MODES.LESSON_PLAN)` thay vì `useState(MODES.EXAM)`.
- `handleLogout()` cũng trả về `MODES.LESSON_PLAN` (trước đó trả về `MODES.EXAM`), để tránh sau khi
  đăng xuất/đăng nhập lại bị lệch pha với lần đầu vào web.
- Đã tự verify: `npm test` 123/123 PASS, `npm run build` sạch (sandbox có mạng, phiên này).

### Phản hồi thực tế sau khi bấm thử "Đề cương Ôn tập" trên trình duyệt thật — CHƯA SỬA, đã ghi
### nhận đầy đủ vào `NEXT_STEPS.md` mục "BƯỚC 3 (NHÓM E)" để làm ở phiên sau
Người dùng đã hoàn thành đúng mục còn treo ở Nhóm A phiên 7 (tự bấm thử Đề cương Ôn tập với API
key thật) và gửi phản hồi chi tiết. Tóm tắt các điểm chính (đầy đủ xem `NEXT_STEPS.md`):

1. **Bug nghiêm trọng nhất (E1)**: bản Học sinh đang bị xoá mất toàn bộ "Lời giải" của các "Bài
   mẫu" (mục II) — chỉ còn đề bài, học sinh không có gì tham chiếu để làm mục III. Đúng ra bản Học
   sinh phải giữ NGUYÊN lời giải Bài mẫu, chỉ xoá đáp án + chừa dòng trống "Bài làm: ..." ở mục III
   (Ngân hàng bài tập). Nghi ngờ nguyên nhân: đang dùng chung 1 cờ ẩn/hiện đáp án cho cả Bài mẫu
   lẫn Ngân hàng bài tập, cần tách 2 luồng riêng (cả ở prompt AI lẫn ở `outlineExportService.js`).
2. **Bố cục đáp án bản GV-Phụ huynh (E2)**: đáp án mục III đang in ngay dưới từng câu → cần gom
   thành 1 "PHỤ LỤC ĐÁP ÁN" tách riêng ở trang cuối tài liệu (lý do sư phạm: "chống xem trộm" - nếu
   phụ huynh dùng bản này cho con làm bài, con dễ nhìn thấy đáp án câu kế tiếp khi đáp án nằm ngay
   dưới câu hỏi).
3. **3 mục nội dung mới muốn thêm (E3)**:
   - Góc "⚠️ Lỗi sai thường gặp" (Common Pitfalls) ngay dưới mỗi Bài mẫu.
   - "Lộ trình Ôn tập" dạng checklist theo ngày (Micro-learning), đặt ngay sau Thư ngỏ Phụ huynh.
   - Bảng "Tự đánh giá" (Self-Reflection Rubric, 😃/😐/😥) ở trang cuối bản Học sinh.
4. **Ghi nhận, KHÔNG sửa ngay**: định dạng phân số dạng gạch chéo "a/b" — người dùng tự xác nhận
   khó tránh ở tầng văn bản thuần, để dành cho nâng cấp pipeline export sau nếu cần.

Toàn bộ phạm vi ảnh hưởng: CHỈ tính năng "Đề cương Ôn tập" (`outlinePromptTemplates.js`,
`outlineExportService.js`, `OutlinePreview.jsx`) — không đụng tới Giáo án/Đề kiểm tra/Phiếu bài
tập/Đề Tiếng Việt/Nhận xét học bạ.

## PHIÊN 9 — BƯỚC 3 (NHÓM E): sửa lỗi + nâng cấp "Đề cương Ôn tập" theo phản hồi thực tế

Đã làm ĐỦ 5 việc theo đúng thứ tự ưu tiên đã chốt ở NEXT_STEPS.md phiên 8 (E1 → E2 → E3a → E3b →
E3c), phạm vi ảnh hưởng CHỈ tính năng "Đề cương Ôn tập" - không đụng các tab khác.

### E1 (nghiêm trọng nhất) — Bản Học sinh mất lời giải Bài mẫu
Nguyên nhân: `buildDangBaiParagraphs()` (outlineExportService.js) trước đây nhận tham số
`showAnswers` và CHỈ in đoạn "Lời giải" khi `showAnswers=true` - dùng NHẦM chung 1 cờ với mục III
(Ngân hàng bài tập, nơi `showAnswers` đúng ra chỉ nên ẩn/hiện "dapAn" tự luyện). Đã sửa: bỏ tham số
`showAnswers` khỏi hàm này hoàn toàn - "Bài mẫu" + "Lời giải" giờ LUÔN in ở CẢ 2 bản (đây là nội
dung DẠY CÁCH LÀM, không phải "đáp án" cần giấu, đúng góp ý của người dùng).

### E2 — Đáp án Ngân hàng bài tập chuyển thành phụ lục riêng (tách theo 3 mức, ĐÃ CHỐT)
- `buildNganHangBaiTapParagraphs()`: bỏ hẳn nhánh in "Đáp án: ..." ngay dưới câu hỏi - giờ CẢ 2 bản
  đều chỉ in đề bài + dòng trống "Bài làm: ...." (giống hệt nhau ở mục III).
- Hàm MỚI `buildAnswerKeyAppendixParagraphs()`: in "PHỤ LỤC: ĐÁP ÁN NGÂN HÀNG BÀI TẬP" ở TRANG CUỐI
  (dùng `pageBreakBefore: true`), tách riêng 3 khối theo mức Cơ bản/Nâng cao/Vận dụng cao, đánh số
  lại khớp đúng thứ tự bài ở mục III. CHỈ chèn khi `showAnswers=true` (bản GV-PH).

### E3a — Góc "⚠️ Lỗi sai thường gặp"
- Thêm trường mới `canhBaoBayLoi` vào schema AI (mỗi phần tử `dangBai`, Trụ cột 2) trong
  `outlinePromptTemplates.js` - BẮT BUỘC AI phải điền cho MỌI dạng bài, giọng văn gần gũi như lời
  cô giáo dặn dò.
- `buildDangBaiParagraphs()`: in ngay dưới "Lời giải", nền vàng nhạt (FEF3C7), LUÔN hiện ở CẢ 2 bản
  (cùng lý do với Lời giải - nội dung dạy, không phải đáp án).
- `OutlinePreview.jsx` (`DangBaiBlock`): thêm khối hiển thị tương ứng trên màn hình xem trước.

### E3b — "Lộ trình Ôn tập" checklist theo ngày (ĐÃ CHỐT: giáo viên tự nhập số ngày)
- Luồng dữ liệu MỚI xuyên suốt: `OutlineForm.jsx` (ô nhập "Số ngày ôn tập", mặc định 7 -
  `DEFAULT_OUTLINE_STUDY_DAYS` trong `outlineTemplates.js`) → `outlineBlueprint.js` (`soNgayOnTap`)
  → `route.js` (`/api/generate-outline`, clamp qua `clampOutlineStudyDays()` MỚI trong
  `contentGenerationLimits.js`, trần mặc định 30 ngày qua biến môi trường `OUTLINE_MAX_STUDY_DAYS`)
  → `outlineOrchestrator.js` → `outlineEngine.js` → `outlinePromptTemplates.js` (`buildOutlinePrompt`
  nhận `soNgayOnTap`, yêu cầu AI trả về ĐÚNG số phần tử trong "loTrinhOnTap").
- Schema AI thêm trường mới `loTrinhOnTap`: mảng `{ ngay, nhiemVu }`, AI phải phân bổ TĂNG DẦN độ
  khó qua các ngày (đầu ưu tiên lý thuyết/bài mẫu, giữa/cuối ưu tiên luyện tập, ngày cuối ôn tổng
  hợp). `outlineEngine.js` đã thêm validate bắt buộc (giống 3 Trụ cột cũ): thiếu `loTrinhOnTap` hợp
  lệ (mảng rỗng/không phải mảng) sẽ khiến AI thử lại.
- `outlineExportService.js`: hàm MỚI `buildStudyPlanParagraphs()` - checklist có ô vuông "☐", LUÔN
  hiện ở CẢ 2 bản (nội dung hướng dẫn tự học, không phải đáp án). Vị trí: NGAY SAU Thư ngỏ Phụ
  huynh ở bản GV-PH (đúng yêu cầu gốc "ngay sau Thư ngỏ"); bản Học sinh không có Thư ngỏ nên đặt
  ngay sau tiêu đề.
- `OutlinePreview.jsx`: thêm `LoTrinhOnTapBlock`, hiển thị SAU khối Thư ngỏ trên màn hình xem trước.

### E3c — Bảng "Tự đánh giá" (Self-Reflection Rubric)
- KHÔNG cần AI sinh thêm dữ liệu mới - tự động lấy danh sách `tenDang` có sẵn từ Trụ cột 2 (mỗi
  Dạng bài đã soạn → 1 dòng trong bảng, 3 mức tự chấm 😃/😐/😥) - quyết định kỹ thuật này giúp giảm
  rủi ro schema AI, không cần validate thêm.
- `outlineExportService.js`: hàm MỚI `buildSelfReflectionParagraphs()` dùng `Table/TableRow/
  TableCell` của thư viện "docx" (đã thêm import), đặt ở TRANG CUỐI (`pageBreakBefore: true`), CHỈ
  chèn khi `showAnswers=false` (bản Học sinh - công cụ tự nhận thức, không cần ở bản GV-PH).
- `OutlinePreview.jsx`: thêm `TuDanhGiaBlock` (bảng HTML thường), hiển thị cuối cùng.

### Quyết định thiết kế đã tự đưa ra khi triển khai (không hỏi lại vì không ảnh hưởng lớn)
- Vị trí "Lộ trình Ôn tập" trên `OutlinePreview.jsx` (bản xem trước MÀN HÌNH, dùng chung cho nút
  "In/Tải PDF") CỐ Ý đặt SAU khối Thư ngỏ (cuối trang) thay vì đầu trang như file .docx xuất ra -
  vì bản xem trước này LUÔN hiển thị ĐẦY ĐỦ (kể cả đáp án inline ở mục III) như 1 bản tham chiếu
  tổng hợp cho giáo viên tự xem/in, KHÔNG phải bản đưa trực tiếp cho học sinh nên không cần đổi bố
  cục để né "chống xem trộm" - đã ghi rõ trong comment đầu `OutlinePreview.jsx`.
- Bảng "Tự đánh giá" và "Lỗi sai thường gặp" cũng được thêm vào `OutlinePreview.jsx` dù bản xem
  trước không tách biệt Học sinh/GV-PH, để giáo viên xem trước được TOÀN BỘ nội dung sẽ có trong 2
  file .docx trước khi tải về.

### Đã tự verify
`npm test`: 130/130 PASS (123 cũ + 7 mới: 5 test outline export mới thay thế 5 test cũ, đã sửa để
đúng hành vi mới + 3 test `clampOutlineStudyDays`). `npm run build`: sạch, không lỗi.

### CHƯA làm (đúng như đã ghi nhận, không cấp bách)
Định dạng phân số "a/b" gạch chéo - người dùng tự xác nhận không sửa, để dành nâng cấp export sau.

### Việc còn lại (Nhóm A, người dùng tự làm)
CHƯA tự bấm thử Bước 3 trên trình duyệt thật với API key thật - xem chi tiết 6 điểm cần kiểm tra
bằng mắt (a-f) trong `NEXT_STEPS.md` mục "Nhóm A".

## PHIÊN 10 — LỚP 3, ĐỢT 3: format số kiểu Việt Nam, sửa "Trạm 8" (Đổi đơn vị đo), 3 cột → 2 cột, tắt đăng nhập để test

Phạm vi: CHỈ "Phiếu bài tập" (WorksheetPreview.jsx, worksheetExportService.js) + cơ chế đăng
nhập toàn app (apiAuth.js, page.js) - không đụng các mode khác.

### 1. Hàm format số kiểu Việt Nam DÙNG CHUNG (đúng ghi chú còn treo trong NEXT_STEPS.md)
- File MỚI `src/services/numberFormatUtils.js`: `formatSoTuNhien(n)` (1 số) + `formatSoTrongChuoi(str)`
  (chuỗi biểu thức, VD "73428 + 19205" -> "73.428 + 19.205") - dùng `toLocaleString("vi-VN")`.
  Quy tắc: số từ 4 chữ số trở lên BẮT BUỘC có dấu chấm phân cách hàng nghìn, dưới 1000 giữ nguyên.
- Áp dụng ở CẢ 2 nơi (web + Word) cho mọi dạng bài Lớp 3 có số lớn: `tinh_nham`, `so_sanh`, `day_so`,
  `sap_xep_thu_tu`, `noi_phep_tinh`, `doi_don_vi_do`. `tien_viet_nam` trước đây tự gọi
  `.toLocaleString("vi-VN")` rời rạc 2 nơi - nay gộp về dùng chung `formatSoTuNhien()`, đúng tinh
  thần "1 hàm dùng chung" NEXT_STEPS.md đã nêu (ngoại lệ so với nguyên tắc isolation của dự án).
- Test mới `test/numberFormatUtils.test.js` (8 test, bao gồm biên 4 chữ số, số string, null/undefined).

### 2. "Trạm 8" (Đổi đơn vị đo) + "tính nhẩm": 3 cột → 2 cột, ô đáp án rộng hơn
- Phản hồi thực tế: 3 cột dồn quá chật, số lớn (VD 19000, 14000) tràn ra ngoài ô khi in.
- `DoiDonViSection`/`TinhNhamSection` (WorksheetPreview.jsx): `gridTemplateColumns` từ
  `repeat(3, 1fr)` → `repeat(2, 1fr)`, tăng gap.
- `buildDoiDonViParagraphs`/`buildTinhNhamParagraphs` (worksheetExportService.js): `chunkArray(items, 3)`
  → `chunkArray(items, 2)` để bản Word khớp đúng bố cục bản web.
- `blankBox()` (ô trống điền đáp án, WorksheetPreview.jsx): rộng từ 42px → tối thiểu 64px (+padding)
  để chứa được số đã format dấu chấm (VD "19.000") mà không tràn.

### 3. Tắt đăng nhập để test (biến môi trường, KHÔNG xoá cơ chế đăng nhập)
- 1 biến `NEXT_PUBLIC_DISABLE_LOGIN` dùng CHUNG cho cả server (`apiAuth.js` - `requireAuth()` trả
  thẳng 1 session giả cố định, bỏ qua verify token) VÀ client (`page.js` - bỏ qua màn hình
  `LoginForm`, tự gán user test) - tránh phải khai 2 biến rồi lo lệch nhau.
- Mặc định KHÔNG bật (`false`/bỏ trống) - hành vi cũ (bắt đăng nhập) giữ nguyên trên production.
  Đã thêm hướng dẫn + cảnh báo rõ trong `.env.local.example`.
- Rate-limit/lịch sử theo giáo viên (teacherGenerateRateLimiter.js, teacherPreferenceStore.js...)
  vẫn hoạt động bình thường khi bật, chỉ dồn hết vào 1 username cố định `giao_vien_test`.

### Đã tự verify
`npm test`: 203/203 PASS (195 cũ + 8 mới). `npm run build`: sạch, không lỗi (các dòng "Dynamic
server usage" cho `/api/report-comment-history` và `/api/report-comment-template` là cảnh báo
CŨ, không liên quan thay đổi phiên này - 2 route này vốn đọc `request.headers` nên Next.js không
thể prerender tĩnh, vẫn hoạt động bình thường ở runtime). Đã tự kiểm tra `requireAuth()` với
`NEXT_PUBLIC_DISABLE_LOGIN=true` trả đúng session giả.

### CHƯA làm (đúng phạm vi yêu cầu, để lại đúng như đã ghi trong NEXT_STEPS.md)
- Chế độ in Màu/Đen trắng: CHƯA làm, chờ theo đúng quyết định đã chốt trước đó.
- "Thu thập/phân loại số liệu" Đợt 3 (đọc bảng/biểu đồ cột): đã thấy đã có `ThuThapSoLieuSection`
  trong code hiện tại (khác NEXT_STEPS.md ghi "hoãn") - không đụng vào phần này trong phiên này vì
  không nằm trong yêu cầu, chỉ ghi nhận sự khác biệt để Hoan biết khi mở chat mới.
