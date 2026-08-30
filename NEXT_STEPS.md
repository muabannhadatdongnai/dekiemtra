# NEXT_STEPS.md — Phiếu Bài Tập: Mở rộng Lớp 3-5 + Chế độ in Màu/Đen trắng

> Trạng thái: **Lớp 5 (Toán) đã xong Đợt 1-4** (14 dạng bài) + **PHIÊN 16: đã sửa 3 lỗi sư phạm
> phản hồi thực tế (Trạm 6/7/12)** + **PHIÊN 17: đã sửa 3 lỗi phản hồi thực tế từ Lớp 4 (Bài
> 6/8/9)** + **PHIÊN 19: đã sửa 2/3 lỗi bản Word Lớp 1 phản hồi qua ảnh chụp (Bài 7/10/11/12)** +
> **PHIÊN 20: đã sửa nốt Bài 3 (icon line-art đen trắng, hướng (A) Hoan đã chọn) — Bài 3 XONG,
> KHÔNG còn mục nào tồn đọng từ chuỗi phản hồi Word Lớp 1** + **PHIÊN 21: rà soát chủ động TOÀN
> BỘ codebase (không riêng Phiếu Bài Tập) - phát hiện + sửa 1 lỗi thật (điểm câu hỏi có thể ra
> ÂM ở tính năng Ma trận đề với đề nhiều câu) - CẦN Hoan xác nhận việc nâng cấp Next.js để vá
> 3 lỗ hổng bảo mật mức HIGH (xem mục "CẦN XÁC NHẬN" ở đầu mục Phiên 21)** + **PHIÊN 24: sửa lỗi
> Bài 7 "so sánh độ dài" không hiện thanh đo trong Word (dangkhoa phát hiện qua file Word thực
> tế, ảnh PDF vẫn ổn) - nguyên nhân GỐC là ký tự Unicode hình khối (┆▬▭▪■⬭⬠⬡⏢) ép font Times New
> Roman, font này thiếu glyph nên Word hiện TRỐNG (PDF không lỗi vì trình duyệt tự fallback
> font). Đã rà soát rộng ra 2 chỗ khác dùng CÙNG pattern rủi ro (biểu đồ cột "Thu thập số liệu",
> "Nhận diện hình") và sửa cả 3 bằng ẢNH PNG (ImageRun) thay ký tự - XONG, 279/279 test PASS** +
> **PHIÊN 25: tính năng MỚI "gợi ý Bài theo Sách giáo viên" ở LessonPlanForm.jsx (soạn giáo
> án) - gõ/chọn "Tên bài soạn" tự gợi ý theo phụ lục JSON đọc từ kho GitHub kiến thức, kèm nút
> tự điền "Nội dung cốt lõi" - CẦN dangkhoa tự tạo file phụ lục thật cho từng Chương (xem mục
> Phiên 25 để biết cấu trúc + file ví dụ), tính năng KHÔNG hoạt động cho tới khi có file đó** +
> **PHIÊN 29: sửa 3 lỗi sư phạm Tiếng Việt Lớp 1 phản hồi qua phiếu in thật - (1) `khoanh_tu_loai`/
> `noi_tu_nhom` (dùng thuật ngữ "từ chỉ hoạt động/đặc điểm" - kiến thức Lớp 2-3) nâng `minGrade`
> lên LOP_2, không còn lộ ở Lớp 1; (2) sửa nhãn đề bài `noi_tu_nhom` sai logic (cam kết "từ chỉ
> hoạt động" dù generator không ràng buộc loại từ); (3) `dien_tu_cho_san` (dạng bài Tiếng Việt DUY
> NHẤT còn chạy ở Lớp 1) thêm `buildVietnameseGradeConstraintBlock()` ép câu ngắn 2-4 tiếng, cấm
> thuật ngữ ngữ pháp, cấm vần phức tạp, + `capitalizeFirstLetter()` viết hoa đầu câu bằng CODE
> (không chỉ dựa AI). 319/319 test PASS (313 cũ + 6 mới `test/worksheetTiengVietLop1Fix.test.js`),
> xem chi tiết mục "PHIÊN 29" trong PROJECT_SUMMARY.md** +
> **PHIÊN 26: rà soát chủ động theo yêu cầu Khoa "còn cần gì để hoàn thiện hơn" - đã làm 5 việc:
> (1) checklist "CẦN KHOA QUYẾT ĐỊNH" ngay dưới đây, (2) nâng Next.js 14→16.3.3 (vá xong cả 3 lỗ
> hổng HIGH), (3) script `npm run test:word-compat` tự động hoá kiểm tra Word thật bằng
> LibreOffice headless - PHÁT HIỆN + SỬA 2 lỗi thật (exportVietnameseExamToWord/
> exportReportCommentsToWord thiếu "return blob", rà soát chéo sửa luôn 4 hàm tương tự), (4) log
> giám sát hạn mức Upstash free tier ([UPSTASH_ERROR]/[UPSTASH_QUOTA?]/[UPSTASH_HEALTH] trong
> upstashClient.js), (5) Error Boundary tổng (`src/app/error.js` + `global-error.js`) - tránh
> màn hình trắng khi lỗi bất ngờ. 289/289 test PASS, build sạch, xem chi tiết mục "PHIÊN 26"** +
> **PHIÊN 27: xác nhận chế độ in Màu/Đen trắng + Lớp 3 "Thu thập số liệu" thực ra ĐÃ CODE XONG từ
> trước (chỉ thiếu tài liệu + test), viết test cho cả 2 (14 test mới), làm trang review icon
> line-art. 303/303 test PASS** + **PHIÊN 28: Soạn Giáo Án - (1) quy tắc tích hợp GDQP&AN không
> còn ép buộc vào bài học không liên quan (Lớp 1-3 học bảng chữ cái...), tự chuyển sang Đạo đức/
> Kỹ năng sống/Quyền Trẻ em khi phù hợp hơn, kèm nhãn hiển thị ĐỘNG (field mới
> `tichHopGDQPANNhan`, có fallback tương thích ngược); (2) phụ lục MỚI "Gợi ý thiết kế Học liệu" -
> tự động sinh 3 từ khoá tiếng Việt để giáo viên Lớp 1-3 copy-dán vào Canva/ChatGPT/Gemini tạo
> Flashcard, KHÔNG cần bật cờ riêng (field mới `goiYHocLieuHinhAnh`, chỉ Lớp 1-3). 313/313 test
> PASS (303 cũ + 10 mới), xem chi tiết mục "PHIÊN 28" trong PROJECT_SUMMARY.md**.
> File này để mang sang chat mới không mất ngữ cảnh.

---

## 🔴 CẦN KHOA QUYẾT ĐỊNH (đọc mục này trước, tách riêng khỏi log kỹ thuật bên dưới)

Danh sách ngắn các việc đang CHỜ Khoa chốt hướng — mỗi phiên Claude mới nên đọc mục này trước
tiên thay vì lục lại toàn bộ log để tìm xem còn gì tồn đọng. Khi Khoa quyết định xong 1 mục, xoá
dòng đó khỏi bảng (không cần giữ lại lịch sử ở đây — lịch sử đã có trong log kỹ thuật bên dưới).

| # | Việc cần quyết định | Vì sao cần Khoa (không tự quyết được) |
|---|---|---|
| 1 | Nâng cấp Next.js 14 → 16 | ✅ **Đã làm xong (Phiên 26)** — 16.3.3, build/test/audit sạch. Xem mục "PHIÊN 26" bên dưới. |
| 2 | Có kích hoạt tab "Coloring Page" (Tô màu) hay không? | Code đã đủ 4 tầng (form/preview/export/API) nhưng chưa nối vào `page.js` — đang "chết" trong kho. Cần Khoa xác nhận có muốn thêm thành tab thứ 8 không, hay xoá hẳn cho gọn. |
| 3 | Chế độ in Màu/Đen trắng cho TOÀN BỘ phiếu (không riêng icon Bài 3) | ✅ **Hoá ra ĐÃ CODE XONG từ trước** (không rõ phiên nào — comment trong code ghi "Phiên 23, phản hồi giáo viên dùng in dịch vụ photocopy"), chỉ là bảng này chưa được cập nhật nên vẫn treo "chưa code". Đã xác nhận + viết test ở Phiên 27 (xem mục "PHIÊN 27" bên dưới, `test/worksheetPrintModeBw.test.js`). KHÔNG còn tồn đọng. |
| 4 | Lớp 3 - "Thu thập/phân loại số liệu" (Đợt 3, đọc bảng/biểu đồ cột) | ✅ **Hoá ra ĐÃ CODE XONG từ trước** (đủ cả 4 tầng: generator/catalog/orchestrator/preview/Word export) - CÙNG kiểu lệch tài liệu như mục #3 ở trên, và giống hệt điều "CẦN xác nhận" đã ghi ở mục "Trên đường chân trời" cũ về `ThuThapSoLieuSection`. Đã xác nhận chạy thật end-to-end + viết test ở Phiên 27 (`test/worksheetLop3Dot3.test.js`). KHÔNG còn tồn đọng. |
| 5 | Tạo file `chuong_{n}_bai.json` cho tính năng "gợi ý Bài theo SGK" (Phiên 25) | Tính năng đã code xong nhưng KHÔNG hoạt động cho tới khi Khoa tự tạo dữ liệu thật trong kho GitHub kiến thức (xem `docs/vi-du-phu-luc-bai-hoc.example.js` để biết cấu trúc). Có thể làm dần theo Chương. |
| 6 | Lỗ hổng bảo mật `xlsx` (Prototype Pollution/ReDoS) | Nhà phát hành chưa có bản vá — chỉ cần Khoa biết để KHÔNG mở tính năng nhập Excel cho người dùng ẩn danh/công khai trong tương lai; chưa cần hành động ngay. |
| 7 | Icon line-art mới vẽ (Bài 3, Phiên 20) chưa qua mắt giáo viên/học sinh thật | Việc NÀY cần Khoa tự làm (Claude không thể tự đưa icon cho giáo viên/học sinh thật xem) - Phiên 27 đã xuất sẵn `lineart-icon-review-sheet.html` (16 icon lấy trực tiếp từ `scripts/lineArtIconDefs.js`, có ô tick "Đạt/Cần chỉnh sửa" + dòng ghi chú cho từng icon) để Khoa in ra hoặc gửi xem, dễ thu thập phản hồi hơn là mở thẳng file code. Khi có phản hồi, sửa trực tiếp ở `scripts/lineArtIconDefs.js` rồi chạy lại `scripts/render-line-art-icons.js`. |
| 8 | Test flaky (không nghiêm trọng) trong `test/worksheetLineArtIcons.test.js` | Phát hiện ở Phiên 26 khi nâng Next.js: khi random ra icon ⭐ cho bài "Đếm và viết số", nó trùng với ⭐ dùng cố định ở khối "Tự đánh giá" cuối phiếu, khiến assertion `!documentXml.includes(it.icon)` thỉnh thoảng báo sai (không phải bug sản phẩm thật - phiếu Word vẫn đúng). Cần sửa assertion để chỉ soi trong phạm vi `<w:drawing>` của đúng mục đó, hoặc đổi cách kiểm tra. |
| 9 | Thiết kế lại bài tập Tiếng Việt Lớp 1 kiểu "âm/vần" (Phiên 29) | Phiên 29 chỉ NÂNG `minGrade` của `khoanh_tu_loai`/`noi_tu_nhom` lên LOP_2 (ẩn khỏi Lớp 1) để hết lỗi vượt cấp trước mắt - CHƯA làm dạng bài THAY THẾ cho Lớp 1 mà giáo viên đề xuất (VD "Khoanh vào tiếng có âm a", "Nối từ với hình", "Điền âm a hoặc âm c"). Cần Khoa xác nhận có muốn đầu tư thêm 1-2 dạng bài ngữ âm RIÊNG cho Lớp 1 hay để trống mục Tiếng Việt AI-sinh ở Lớp 1 (hiện chỉ còn `dien_tu_cho_san` đã siết câu ngắn hơn). |

---

## ✅ MỚI NHẤT (Phiên 27) — Rà soát 3 việc Khoa yêu cầu "làm tiếp"

**Bối cảnh:** Khoa yêu cầu làm tiếp 3 mục #3, #4, #7 trong bảng "CẦN KHOA QUYẾT ĐỊNH" ở trên.
Rà soát code THẬT (không chỉ đọc tài liệu) trước khi viết bất kỳ dòng code mới nào - phát hiện
2/3 việc ĐÃ CODE XONG từ trước, bảng theo dõi chỉ đơn giản là chưa được cập nhật (đúng bài học
đã có với `ThuThapSoLieuSection`, xem "Còn cần xác nhận" trước Phiên 27).

**1) Chế độ in Màu/Đen trắng (mục #3):** Xác nhận `BW_PALETTE` + `getSectionVisualTheme(...,
bwMode)` (`worksheetLayoutTemplates.js`) đã phủ ĐỦ cả `WorksheetPreview.jsx` (bar biểu đồ dùng
vân sọc chéo thay tô đặc để tiết kiệm mực) LẪN `worksheetExportService.js`
(`buildWorksheetDocxBlob`/`exportWorksheetBothVersions` đều nhận `bwMode`), và đã có checkbox
thật ở `WorksheetExportActions.jsx` nối qua `page.js` (state `worksheetBwMode`) ảnh hưởng đồng
thời web xem trước + Word + PDF (PDF tự thừa hưởng qua bản in web). Trước Phiên 27 KHÔNG có test
tự động nào cho tính năng này - đã thêm `test/worksheetPrintModeBw.test.js` (5 test): xác nhận
`bwMode=true` luôn trả về đúng `BW_PALETTE` bất kể layout/index, `bwMode=false`/mặc định không bị
ảnh hưởng (không vô tình bật nhầm), và file Word xuất ra ở chế độ đen/trắng THẬT SỰ không còn sót
hex màu gốc nào (dò từng màu trong `COLOR_PALETTES`) mà chỉ dùng đúng mã đen/xám của `BW_PALETTE`.

**2) Lớp 3 - "Thu thập/phân loại số liệu" (mục #4):** Xác nhận đủ 4 tầng: generator
(`generateThuThapSoLieu` trong `worksheetSchemas.js`, đảm bảo max/min duy nhất để câu hỏi
"nhiều/ít nhất" luôn có 1 đáp án), catalog (giới hạn đúng `LOP_3`), orchestrator
(`worksheetGenerator.js`), preview (`ThuThapSoLieuSection` - biểu đồ cột NGANG, đã tối ưu bw ở
mục 1), Word export (`buildThuThapSoLieuParagraphs` - dùng ĐÚNG cách vẽ cột bằng ẢNH PNG tái sử
dụng từ bug Phiên 24, không dùng lại ký tự Unicode khối rủi ro). Đã chạy thử THẬT end-to-end qua
`generateWorksheet()` + `buildWorksheetDocxBlob()` (không chỉ đọc code) để xác nhận trước khi
viết test. Thêm `test/worksheetLop3Dot3.test.js` (9 test): cấu trúc dữ liệu, ràng buộc max/min
duy nhất, câu hỏi khớp đúng dữ liệu, catalog chỉ lộ ở Lớp 3, tích hợp `generateWorksheet()`, và
Word export (đúng tiêu đề/câu hỏi/đáp án ở bản giáo viên, KHÔNG lộ đáp án ở bản học sinh, có ảnh
PNG cột số liệu chứ không phải ký tự Unicode).

**3) Icon line-art chưa qua mắt giáo viên/học sinh thật (mục #7):** Việc này về bản chất là 1
bước KIỂM THỬ THỰC TẾ chỉ Khoa mới làm được (Claude không tiếp cận được giáo viên/học sinh thật).
Đã hỗ trợ bằng cách xuất `lineart-icon-review-sheet.html` - trang HTML độc lập liệt kê ĐỦ 16 icon
lấy trực tiếp từ `scripts/lineArtIconDefs.js` (không vẽ lại/đoán icon mới), mỗi icon có ô tick
"Đạt, giữ nguyên" / "Cần chỉnh sửa" + dòng ghi chú - in ra giấy hoặc gửi file để giáo viên/học
sinh xem và đánh dấu trực tiếp, dễ thu thập phản hồi có cấu trúc hơn hẳn việc mở thẳng file code.
Khi có phản hồi, sửa icon tương ứng trong `scripts/lineArtIconDefs.js` rồi chạy lại
`node scripts/render-line-art-icons.js` để tái tạo PNG dùng trong Word.

**Kết quả:** `npm test` 303/303 PASS (289 cũ + 14 test mới), `npm run build` sạch (Next.js 16,
không cảnh báo mới). Không sửa bất kỳ logic sản phẩm nào ở phiên này - chỉ XÁC NHẬN + TEST +
TÀI LIỆU + 1 công cụ hỗ trợ review (HTML) cho việc thật sự cần con người (icon).

---

## ✅ MỚI NHẤT (Phiên 26) — Rà soát chủ động theo yêu cầu Khoa "còn gì để hoàn thiện hơn"

**Bối cảnh:** Khoa hỏi thẳng "còn cần điều chỉnh/ý tưởng gì để đạt mức hoàn hảo hơn", rồi chọn 5
việc cụ thể để làm ngay trong phiên này (không phải Claude tự ý thêm việc). Toàn bộ đã build +
test thật (không chỉ sửa code lý thuyết).

**1) Checklist "CẦN KHOA QUYẾT ĐỊNH"** — xem đầu file này (mục 🔴 ngay trên "MỚI NHẤT"). Mục
đích: phiên Claude sau đọc 1 bảng ngắn thay vì phải lục cả nghìn dòng log để biết còn gì tồn đọng
đang chờ Khoa chốt hướng.

**2) Nâng cấp Next.js 14.2.35 → 16.3.3:**
- Rà soát trước: dự án KHÔNG dùng route `[param]` động, KHÔNG dùng `next/headers`/`next/image`/
  `next/font`, KHÔNG có middleware → rủi ro breaking-change thấp, React 18.3.1 vẫn tương thích
  (peer dep next@16 chấp nhận `^18.2.0`, không cần lên React 19).
- Lỗi thật gặp phải: Turbopack (mặc định ở Next 16) strict hơn CSS spec, báo lỗi ngay khi
  `@import` font Google đặt SAU `@tailwind` trong `globals.css` (bug CSS này tồn tại từ trước,
  Webpack cũ chỉ không báo mà thôi) → đã sửa: chuyển `@import` lên đầu file, kèm comment giải
  thích rõ để phiên sau không sửa nhầm chỗ khác.
- Thêm `"engines": {"node": ">=20.9.0"}` vào `package.json` (yêu cầu bắt buộc của Next 16) —
  tránh deploy nhầm trên Node cũ.
- `npm audit fix` dọn thêm 1 lỗ hổng `nanoid` (transitive qua `postcss`, không liên quan Next
  trực tiếp nhưng lộ ra cùng lúc khi cài lại `package-lock.json`).
- Kết quả: `npm run build` sạch, `npm test` 289/289 pass, `next start` + `curl` trang chủ trả về
  HTTP 200. `npm audit` chỉ còn `xlsx` (đã biết từ trước, nhà phát hành chưa có bản vá).

**3) Test tương thích Word thật bằng LibreOffice headless — `npm run test:word-compat`:**
- File mới: `scripts/check-word-compatibility.mjs`. Dựng `.docx` THẬT (gọi đúng hàm export
  production, không viết lại logic) cho cả 6 tính năng xuất Word (đề kiểm tra có công thức toán,
  phiếu bài tập gộp cả 4 dạng từng dính bug ảnh/Unicode của Phiên 20/24, giáo án, đề Tiếng Việt,
  đề cương ôn tập, nhận xét học bạ) → convert bằng `soffice --headless --convert-to pdf` →
  kiểm tra bằng `pdfinfo` (convert thành công + có trang + không rỗng).
- **PHÁT HIỆN + SỬA ĐƯỢC 2 LỖI THẬT** ngay lần chạy đầu tiên (không phải lý thuyết):
  `exportVietnameseExamToWord()` và `exportReportCommentsToWord()` thiếu `return blob` — cùng
  lỗi mà `exportLessonPlanToWord()` từng mắc và được vá ở phiên trước, nhưng phiên đó không rà
  soát chéo sang các hàm cùng họ. Không ảnh hưởng nút bấm thật (UI không dùng giá trị trả về),
  nhưng khiến bất kỳ code/test nào sau này cần lấy lại Blob sẽ nhận `undefined`. Đã rà soát CHÉO
  toàn bộ 10 hàm `export...ToWord`/`export...BothVersions` trong dự án và sửa nhất quán 6 hàm
  còn thiếu (`exportToWord`, `exportBothVersions`, `exportOutlineToWord`,
  `exportOutlineBothVersions`, `exportWorksheetToWord`, `exportWorksheetBothVersions`).
- Script tách riêng khỏi `npm test` mặc định (script riêng `test:word-compat`) vì phụ thuộc
  binary `soffice`/`pdfinfo` không chắc có sẵn ở mọi máy/CI — script tự phát hiện thiếu binary và
  dừng với hướng dẫn cài đặt rõ ràng, không làm hỏng `npm test` bình thường.
- ⚠️ Giới hạn trung thực (đã ghi rõ trong comment đầu script): LibreOffice KHÔNG PHẢI Microsoft
  Word thật — đây là phép thử proxy tốt cho lớp lỗi "XML/quan hệ file hỏng, ảnh không nhúng
  được", KHÔNG thay thế hoàn toàn việc thỉnh thoảng nhờ Khoa mở Word thật/in thử, đặc biệt sau
  khi đổi bố cục lớn.
- Phát hiện phụ (CHƯA sửa, xem mục #8 bảng checklist đầu file): 1 test flaky có sẵn từ trước
  (`worksheetLineArtIcons.test.js`) không liên quan Next.js — icon ⭐ random trùng icon ⭐ cố định
  ở khối "Tự đánh giá".

**4) Giám sát hạn mức Upstash free tier** (`src/services/upstashClient.js`):
- 7 module (`questionBankStore`, `reportCommentHistoryStore`, `geminiUsageTracker`,
  `activeSessionCounter`, `lessonPlanDiversityStore`, `teacherGenerateRateLimiter`,
  `teacherPreferenceStore`, `sampleAnalyzeRateLimiter`, `teacherPreferenceStore`) đều gọi chung
  `upstashCommand()` nhưng mỗi module tự try/catch + `console.warn` RIÊNG LẺ rồi fallback êm →
  nếu vượt hạn mức free tier, TOÀN BỘ tính năng phụ trợ âm thầm ngừng hoạt động mà không có tín
  hiệu rõ ràng nào nổi bật giữa hàng nghìn dòng log Vercel.
- Đã thêm logging TẠI ĐÚNG 1 ĐIỂM CHUNG (`upstashCommand`, không sửa từng module gọi nó):
  - `[UPSTASH_ERROR]` — mọi lỗi (mạng, cú pháp lệnh, hết hạn mức...), chỉ log TÊN lệnh Redis
    (VD "INCR"), KHÔNG log key/value đầy đủ (tránh lộ họ tên/nhận xét học sinh vào log server).
  - `[UPSTASH_QUOTA?]` — thêm dòng CẢNH BÁO RIÊNG khi câu lỗi khớp đúng câu chữ Upstash trả về
    lúc vượt hạn mức free tier (`/limit exceeded|quota/i`, xem docs Upstash "max daily request
    limit exceeded"), gợi ý Khoa vào Dashboard Upstash kiểm tra Usage/Billing.
  - `[UPSTASH_HEALTH]` — tóm tắt "X lệnh, Y lỗi" mỗi 200 lệnh (đếm trong bộ nhớ tiến trình, RESET
    khi cold start - đã ghi rõ hạn chế này trong comment, không phải bộ đếm bền vững 100%
    chính xác qua nhiều lần deploy, chỉ đủ dùng làm "chuông báo" định kỳ).
  - KHÔNG đổi bất kỳ hành vi throw/catch nào đang có ở 7 module gọi hàm này - chỉ thêm log.
- Test mới: `test/upstashClient.test.js` (5 test, mock `global.fetch`) — kiểm tra đúng cả 2 điều
  quan trọng nhất: (a) hành vi throw/trả kết quả KHÔNG đổi so với trước, (b) log đúng tiền tố
  đúng lúc.

**5) Error Boundary tổng** — 2 file mới theo ĐÚNG quy ước Next.js App Router:
- `src/app/error.js` — bắt lỗi render bất ngờ trong `page.js` và toàn bộ cây component con (nơi
  có mọi logic phức tạp: form, preview, gọi AI...), hiện màn hình thân thiện có nút "Thử lại"
  (gọi `reset()` theo API Next.js) và "Tải lại toàn bộ trang", THAY VÌ màn hình TRẮNG hoàn toàn
  không rõ nguyên nhân giữa buổi dạy.
- `src/app/global-error.js` — lưới an toàn CUỐI CÙNG cho lỗi xảy ra ngay tại `layout.js` (hiếm vì
  layout.js ở đây gần như không có logic, chỉ render `<html>/<body>` + import CSS, nhưng thêm
  gần như không tốn công). Theo yêu cầu bắt buộc của Next.js, file này TỰ RENDER LẠI đầy đủ
  `<html>/<body>` (không dùng chung CSS/component nào từ app - nếu hệ thống import/build đó là
  nguyên nhân gây lỗi thì global-error.js cũng lỗi theo, mất tác dụng lưới an toàn cuối).
- Đã kiểm chứng THẬT (không chỉ code xong là xong): tạo 1 route tạm cố ý `throw new Error(...)`
  với `export const dynamic = "force-dynamic"`, `npm run build` + `next start` + `curl` → xác
  nhận HTTP 500 đúng, server log ghi đúng lỗi + digest, payload phản hồi có tham chiếu đúng tới
  component error boundary (`"error":"$3"` cùng script chunk riêng) - đúng cơ chế Next.js kỳ
  vọng. Route tạm đã XOÁ SẠCH sau khi test xong (`src/app/smoketestboundary/` không còn tồn tại
  trong bản giao).
- ⚠️ Giới hạn: chỉ bắt lỗi RENDER phía React (throw trong render/effect) - KHÔNG bắt lỗi bất đồng
  bộ ngoài luồng React (setTimeout/event handler không được React quản lý, giới hạn CHUNG của cơ
  chế Error Boundary, không phải thiếu sót riêng), và KHÔNG thay thế try/catch đã có sẵn khi gọi
  API `/api/generate-...` (các *Form.jsx đã tự hiện lỗi ngay trong form).

**Kết quả cuối phiên:** 289/289 test PASS (284 gốc + 5 test Upstash mới), `npm run build` sạch,
`npm run test:word-compat` 6/6 kịch bản OK, `npm audit` chỉ còn `xlsx` (đã biết).

---

## (Phiên 25) — Gợi ý "Bài" theo Sách giáo viên khi soạn giáo án
dangkhoa muốn: khi giáo viên chọn Lớp 5, gõ "Bài 1" vào ô Tên bài soạn, app gợi ý tên bài + tự
điền "Nội dung cốt lõi" theo Sách giáo viên. Đã trao đổi hướng triển khai (lưu ở kho GitHub kiến
thức đang có sẵn, thay vì tạo nguồn dữ liệu song song trong code) và làm luôn pilot Toán Lớp 5.

**Kiến trúc:** tái dùng ĐÚNG pattern của `listChapters`/`/api/chapters` đã có sẵn (không phát
minh cơ chế mới) nhưng xuống granularity mức **Bài** thay vì **Chương**:
- `src/services/githubService.js`: thêm `fetchLessonIndex({grade, subject, volume, chapter})` -
  đọc file JSON `sach_giao_khoa/lop_{lớp}/{môn}_t{tập}/chuong_{n}_bai.json` (CẠNH file
  `chuong_{n}.md` đã có), trả về mảng `{soBai, tenBai, noiDungCotLoi}` đã chuẩn hoá (trim, lọc bỏ
  mục thiếu tenBai). File chưa tồn tại hoặc lỗi mạng → trả về `[]` (KHÔNG throw) - đây là tính
  năng gợi ý PHỤ TRỢ, thiếu dữ liệu không được cản trở soạn giáo án bằng cách gõ tay như trước.
- `src/app/api/lessons/route.js` (MỚI): route `GET /api/lessons?grade=&subject=&volume=&chapter=`,
  cùng mức `requireAuth` với `/api/chapters`.
- `src/services/apiClient.js`: thêm `fetchLessonsRequest(...)`.
- `src/components/LessonPlanForm.jsx`: khi chọn Chương, tự tải phụ lục bài qua `useEffect` mới;
  ô "Tên bài soạn" gắn `<datalist>` gợi ý dạng "Bài 1 - Ôn tập các số đến 100 000"; khi tenBai
  khớp đúng 1 gợi ý VÀ nội dung cốt lõi gợi ý khác nội dung đang gõ, hiện nút "Dùng nội dung cốt
  lõi gợi ý..." - bấm mới điền, KHÔNG tự động ghi đè để tránh mất nội dung giáo viên đã tự gõ.

**⚠️ QUAN TRỌNG - dangkhoa CẦN LÀM để tính năng chạy thật:** tạo file `chuong_{n}_bai.json` cho
từng Chương trong kho GitHub kiến thức (biến `GITHUB_KNOWLEDGE_REPO`). Xem cấu trúc + ví dụ mẫu
tại `docs/vi-du-phu-luc-bai-hoc.example.js` (file tham khảo, KHÔNG được app đọc trực tiếp). Nội
dung cốt lõi trong ví dụ chỉ minh hoạ cấu trúc, cần thay bằng nội dung thật từ Sách giáo viên
trước khi dùng cho giáo viên thật. Có thể làm dần theo Chương, không cần làm hết ngay.

**Test mới** `test/githubServiceLessonIndex.test.js` (5 test, mock `global.fetch`, set
`process.env.GITHUB_KNOWLEDGE_REPO` TRƯỚC khi import động module vì `REPO` đọc 1 lần lúc load
module): xác nhận chuẩn hoá đúng dữ liệu, lọc mục thiếu tenBai, trả `[]` khi 404/lỗi mạng/chưa
cấu hình REPO/Sách nâng cao (không chia theo bài, không gọi fetch). `npm test`: **284/284 PASS**
(279 cũ + 5 mới). `npm run build`: sạch, route `/api/lessons` lên đúng danh sách route động.


dangkhoa báo Bài 7 "so sánh độ dài" không nhìn ra thanh đo (line-art) trong file Word dù bản PDF
vẫn ổn - gửi kèm ảnh chụp + file Word thực tế `BÀI-TẬP-TOÁN-HocSinh.docx`.

**Nguyên nhân gốc:** Bài 7 vẽ thanh đo bằng cách LẶP LẠI ký tự Unicode hình khối (`┆▬▭▪`,
`LENGTH_KIND_GLYPHS` trong `worksheetExportService.js`) và ép font **Times New Roman**. Font này
KHÔNG có glyph cho các ký tự đó → Word hiện trống. Bản PDF (xuất qua trình duyệt/Chrome) không bị
vì trình duyệt tự động fallback sang font hệ thống khác có glyph khi Times New Roman thiếu - Word
mở trực tiếp thì không fallback đáng tin cậy như vậy.

**Rà soát chủ động** phát hiện thêm 2 chỗ dùng ĐÚNG pattern rủi ro này (glyph hiếm ép font):
biểu đồ cột "Thu thập số liệu" (`"■".repeat()`) và "Nhận diện hình" (`SHAPE_GLYPHS`: `⬭ ⬠ ⬡ ⏢`
là các glyph đặc biệt hiếm, rủi ro cao nhất).

**Đã sửa cả 3 bằng ẢNH PNG (ImageRun), CÙNG cơ chế SVG→PNG đã dùng thành công cho Bài 3 (Phiên 20)**
- không phụ thuộc font máy người dùng, đảm bảo Word/PDF/Web hiển thị giống hệt nhau:
1. `scripts/shapeIconDefs.js` (MỚI) - nguồn vẽ SVG cho 11 icon hình học (tròn, vuông, tam giác,
   chữ nhật, ngôi sao, trái tim, thoi, ê-líp, ngũ giác, lục giác, thang), cùng phong cách stroke
   đen `#1a1a1a` với `lineArtIconDefs.js` (Bài 3).
2. `scripts/render-word-assets.js` (MỚI) - script rasterize 1 lần, sinh:
   - `src/data/shapeIconPngs.js` - 11 icon PNG cố định (dùng cho "Nhận diện hình").
   - `src/data/barTilePng.js` - **1 ảnh thanh xám đặc DUY NHẤT**, KÉO GIÃN
     `transformation.width` lúc nhúng `ImageRun` để biểu diễn độ dài (Bài 7) hoặc số lượng
     (biểu đồ cột) bất kỳ - không cần vẽ lại ảnh cho từng giá trị.
3. `src/services/worksheetExportService.js`:
   - Thay `LENGTH_KIND_GLYPHS` + `.repeat(cm)` → `lengthBarImageRun(cm)` (Bài 7).
   - Thay `"■".repeat(d.value)` → `lengthBarImageRun(d.value)` (biểu đồ cột).
   - Thay `SHAPE_GLYPHS` → `shapeIconImageRun(shapeName, sizePx)` (Nhận diện hình + Khay hình
     "Đếm hình ứng dụng").
4. `src/data/worksheetSchemas.js`: export thêm `SHAPES` (trước đây chỉ dùng nội bộ) để test có
   thể xác nhận đủ 11/11 icon.

**Test mới** `test/worksheetWordAssetsPhien24.test.js` (5 test, build .docx THẬT bằng JSZip soi
`document.xml`, cùng tinh thần `worksheetLineArtIcons.test.js`): xác nhận KHÔNG còn ký tự Unicode
thô nào trong `document.xml`, đúng số thẻ `<w:drawing>`, ảnh PNG hợp lệ trong `word/media`.
`npm test`: **279/279 PASS** (274 cũ + 5 mới). `npm run build`: sạch, không lỗi.

**Việc còn tồn đọng (không phải lỗi, chỉ là quyết định thiết kế bỏ ngỏ):** trước đây các "kind"
khác nhau (band/rope/pencil/stick/ruler/road/tree/person) dùng ký tự KHÁC NHAU để có chút khác
biệt trực quan giữa các loại vật ở Bài 7. Giải pháp ảnh mới dùng CHUNG 1 thanh xám cho mọi kind
(đơn giản, chắc chắn không lỗi font) - đã BỎ sự khác biệt trực quan theo kind. Nếu dangkhoa muốn
khôi phục (VD: vài hoạ tiết PNG khác nhau: đặc/sọc/chấm), cần thêm 2-3 tile PNG nữa, gắn map
kind→tile trong `lengthBarImageRun()` - portable nhưng thêm việc, để dành nếu có phản hồi thật cần.


Hoan hỏi "còn gì chưa làm/cần bổ sung" - đã rà soát TOÀN BỘ dự án (không chỉ riêng module Phiếu Bài
Tập đã quen thuộc), gồm: audit dedupe 38 hàm sinh đề, `npm audit` bảo mật dependency, kiểm tra
secret/API key hardcode, và fuzz-test các hàm logic thuần chưa có test.

**Phát hiện quan trọng nhất - lỗi THẬT trong `computeScores()` (`scoringUtils.js`, dùng cho tính
năng "Ma trận đề kiểm tra"):** với đề nhiều câu (VD 12 câu), phần dư làm tròn 0.25đ trước đây dồn
hết vào câu CUỐI CÙNG, có thể kéo điểm câu đó xuống **0 hoặc ÂM** ("-0.25 điểm") - fuzz-test 20.000
tổ hợp cho thấy xảy ra ~5.2% trường hợp. ĐÃ SỬA: áp sàn 0.25đ cho mọi câu + rải drift theo nấc
0.25đ vào câu điểm cao nhất mỗi vòng (không dồn 1 chỗ). Test mới `worksheetScoringUtils.test.js`
(6 test, fuzz hàng nghìn tổ hợp) xác nhận hết lỗi. `npm test`: **274/274 PASS**. Chi tiết đầy đủ +
2 việc cần Hoan xác nhận (nâng cấp Next.js vá bảo mật, theo dõi lỗ hổng `xlsx` chưa có bản vá) xem
`PROJECT_SUMMARY.md` mục "PHIÊN 21".

## (Phiên 20) — Bài 3 "Đếm và viết số": icon line-art đen trắng (thay emoji màu), hướng (A) đã chọn
Hoan chọn hướng **(A)** trong 3 phương án Phiên 19 đưa ra: vẽ bộ icon SVG line-art tự vẽ.

1. Vẽ mới 16 icon line-art (nét đen trắng, khớp 1-1 kho `ICONS` cũ: táo, sao, ô tô, gà con, hoa
   hướng dương, bướm, cà rốt, cá, bóng bay, kẹo mút, tên lửa, rùa, gấu bông, bánh quy, hoa đào,
   ong). Nguồn vẽ DUY NHẤT: `scripts/lineArtIconDefs.js`.
2. Sinh 2 định dạng từ CÙNG nguồn (tránh vẽ 2 lần, tránh lệch icon giữa web/Word):
   - `src/data/lineArtIcons.js` (SVG, dùng cho web).
   - `src/data/lineArtIconPngs.js` (PNG base64 render sẵn, dùng cho Word - docx không đảm bảo
     tương thích SVG mọi phiên bản Word nên dùng PNG cho an toàn).
   - Script tái tạo (không chạy trong runtime app, không thêm dependency native vào bundle
     production): `scripts/render-line-art-icons.js`, cần cài tạm `@resvg/resvg-js` bằng
     `npm install --no-save` (KHÔNG có trong `package.json`).
3. Web: `WorksheetPreview.jsx` có component `LineArtIcon` mới (có fallback về emoji gốc nếu thiếu
   bản line-art - an toàn khi mở rộng kho `ICONS` sau này).
4. Word: `worksheetExportService.js` đổi `buildDemVaVietSoParagraphs()` từ `TextRun` emoji sang
   `ImageRun` PNG, chủ động xuống dòng 6 icon/dòng (cùng tinh thần fix Bài 10/11 Phiên 19).
5. **Không cần thêm cờ `printMode`** — icon line-art vốn đã đen trắng, rõ nét ở MỌI chế độ in nên
   mục "(B) Thêm `printMode: color/bw`" ở draft cũ bên dưới coi như KHÔNG cần làm nữa cho vấn đề
   icon Bài 3 (draft `printMode` vẫn còn giá trị nếu sau này Hoan muốn kiểm soát in màu/đen trắng
   cho các phần khác của phiếu, nhưng không còn liên quan tới Bài 3).
- Test mới: `test/worksheetLineArtIcons.test.js` (3 test, build `.docx` THẬT + giải nén JSZip xác
  nhận đủ 16/16 icon, không còn emoji màu thô trong `document.xml`, đúng số thẻ `<w:drawing>`, đáp
  số ẩn/hiện đúng). Đã sanity-check thêm bằng mắt: build 1 file docx demo, giải nén xem 1 icon
  nhúng thật, đúng icon mong muốn (không lệch icon do nhầm base64 key).
- `npm test`: **268/268 PASS** (265 cũ + 3 mới). `npm run build`: sạch, bundle trang chính tăng
  ~45KB (do nhúng 16 icon PNG base64) - chấp nhận được.

### ⚠️ Cần Hoan test thực tế (Phiên 20, sandbox không làm được)
1. Mở bản Word Bài 3 bằng Microsoft Word thật - icon line-art đúng vị trí/kích thước, không lệch
   dòng khi in A4 thật.
2. Xem bản web (`npm run dev`) - icon line-art đủ rõ/đẹp ở nhiều cỡ màn hình.
3. In thử Bài 3 ở CẢ 2 chế độ màu và đen trắng - xác nhận rõ nét ở cả 2 (đúng mục tiêu ban đầu).
4. Icon line-art là hình vẽ MỚI hoàn toàn, chưa qua mắt giáo viên/học sinh thật - nếu thấy icon
   nào chưa đẹp/chưa giống hình gốc, phản hồi lại để chỉnh (sửa ở `scripts/lineArtIconDefs.js` rồi
   chạy lại `node scripts/render-line-art-icons.js`, KHÔNG sửa tay 2 file tự sinh
   `lineArtIcons.js`/`lineArtIconPngs.js`).

## (Phiên 19) — Sửa lỗi bản Word Lớp 1 (phản hồi qua ảnh chụp trực tiếp từ file Word)

Hoan gửi 2 ảnh chụp file Word thật (Bài 7, Bài 10/11/12) + 1 ảnh tham khảo (Bài 3, không phải từ
app) chỉ ra 3 vấn đề. Đã sửa 2/3, còn 1 cần Hoan chốt hướng trước khi code.

1. **Bài 7 "So sánh độ dài" (`do_dai_so_sanh`) - bản Word không có gì để "quan sát" ngoài 2 con
   số** — SỬA: `buildDoDaiSoSanhParagraphs()` (`worksheetExportService.js`) giờ vẽ thêm 1 "thanh
   đo" bằng ký tự khối Unicode "▬" lặp lại ĐÚNG bằng số cm (không dùng Table - tránh đúng loại lỗi
   "nested table đè nền" đã cảnh báo ở đầu file) - học sinh giờ nhìn thấy 2 thanh dài/ngắn khác
   nhau như thước thật, in trên 2 dòng riêng thẳng hàng bên trái, rồi mới đến dòng điền dấu >,<,=.
2. **Bài 10 "Nhận diện hình" + Bài 11 "Đếm hình trong khay" + Bài 12 "Xem đồng hồ" - icon/glyph
   quá nhỏ vì dồn quá nhiều trên 1 dòng, Word tự ngắt dòng không kiểm soát** — SỬA cả 3 hàm
   (`buildNhanDienHinhParagraphs`, `buildDemHinhUngDungParagraphs`,
   `buildXemDongHoGioDungParagraphs`): chủ động xuống dòng theo số lượng cố định/dòng (2 hình/dòng
   cho Bài 10, 5 hình/dòng cho khay Bài 11, 2 đồng hồ/dòng cho Bài 12 - trước đây 4/dòng) THAY VÌ
   để Word tự ngắt, đồng thời tăng cỡ chữ glyph/emoji (28-30 -> 40) để đủ lớn khi in.
3. **Bài 3 (ảnh tham khảo Hoan gửi, không phải ảnh chụp từ app) - icon màu (🚀🦋🌻...) khó phân
   biệt khi in đen trắng, đề xuất dùng "line art"** — ứng với dạng bài `dem_va_viet_so` (đã sửa ở
   **Phiên 20**, hướng (A) - xem mục "MỚI NHẤT" ở đầu file).
- Đã kiểm tra bằng script build thật 1 file `.docx` chứa cả 4 dạng bài (7/10/11/12), mở bằng
  JSZip đọc `word/document.xml`, xác nhận đúng nội dung mong muốn (thanh "▬" tỉ lệ đúng cm, xuống
  dòng đúng số lượng/dòng đã đặt) trước khi giao - không chỉ tin code đọc bằng mắt.
- `npm test`: 265/265 PASS (không cần test mới - đây là thay đổi hiển thị Word thuần, không có
  logic sinh số mới cần kiểm chứng toán học). `npm run build`: sạch.

## (Phiên 17) — Sửa 3 lỗi phản hồi thực tế sau khi Hoan test phiếu Lớp 4 (Bài 6, 8, 9)
1. **Bài 9 "Góc và đơn vị đo góc" - bỏ hẳn số đo góc dạng chữ (VD "159°") khỏi bản Word** (cả
   Giáo viên lẫn Học sinh). 2 lý do gộp lại cùng 1 lần sửa:
   - **Sư phạm**: Lớp 4 chỉ dùng ê-ke để NHẬN BIẾT góc (nhọn/vuông/tù/bẹt) bằng mắt, KHÔNG dùng
     thước đo góc để đọc ra số đo cụ thể (kiến thức cấp 2) - in số đo ra dù chỉ ở bản Giáo viên
     vẫn dễ khiến giáo viên/phụ huynh dạy sai phương pháp.
   - **Kỹ thuật**: loại bỏ hẳn ký tự "°" khỏi output - cách AN TOÀN NHẤT để tránh mọi rủi ro hiển
     thị/ngắt chữ khi in ấn ở bất kỳ công cụ chuyển đổi nào phía người dùng, không cần biết chính
     xác công cụ nào đang gây lỗi.
   - `buildGocNhanBietParagraphs()` (`worksheetExportService.js`) giờ chỉ in `"1. Đây là góc
     nhọn"` (bản Giáo viên) hoặc `"1. Đây là góc ___"` + 1 dòng ghi chú nhắc xem hình vẽ ở bản
     web/PDF (bản Học sinh - vì Word không vẽ được SVG, trước đây "mượn" số đo làm gợi ý, giờ bỏ
     gợi ý đó nên cần ghi chú thay thế, tránh giáo viên tưởng bản Word đủ dùng độc lập).
   - Field `degrees` trong `generateGocNhanBiet()` (`worksheetSchemas.js`) giờ CHỈ dùng để vẽ SVG
     ở web (`AngleFigure`) - đã ghi rõ trong comment, cấm dùng lại dạng chữ ở bất kỳ đâu khác.
2. **Bài 6 "Rút gọn phân số" + Bài 8 "So sánh phân số" - lỗi "dính chữ" số thứ tự câu với phân số
   khi in/xuất PDF** (VD "1. 8/10" hiển thị dính thành "1.8 8/10"): số thứ tự câu giờ tách RIÊNG
   `<span>`/`TextRun` có margin/khoảng trắng tường minh (không còn dựa vào 1 ký tự khoảng trắng
   "nằm trơ trọi" giữa các node JSX/text run) - sửa ở CẢ 2 nơi:
   - Web: `PhanSoRutGonSection`/`PhanSoSoSanhSection` (`WorksheetPreview.jsx`).
   - Word: `buildPhanSoRutGonParagraphs`/`buildPhanSoSoSanhParagraphs` (`worksheetExportService.js`)
     - PHÁT HIỆN THÊM: 2 hàm này trước đây **hoàn toàn KHÔNG có số thứ tự câu** trong bản Word
       (chỉ có ở bản web) - đã thêm số thứ tự vào Word cho khớp bản web, tránh giáo viên đối
       chiếu 2 bản bị lệch.
3. **Xác nhận qua điều tra code**: nút "In / Tải PDF" hiện tại của app CHỈ in nguyên trạng bản xem
   trước trên web (`window.print()`, không có bước chuyển đổi PDF riêng nào khác, không dùng
   LibreOffice/puppeteer/jsPDF - đã grep xác nhận KHÔNG có lib nào như vậy trong `package.json`).
   Bản Word (.docx) là ĐẦU RA CUỐI CÙNG của quy trình app - nếu Hoan tạo "PDF" bằng cách mở file
   Word rồi tự in/chuyển đổi sang PDF (Word "Save as PDF", LibreOffice, hay công cụ khác), bước đó
   nằm NGOÀI phạm vi code của app, app không kiểm soát được. **CẦN HOAN XÁC NHẬN LẠI**: file PDF
   Hoan test đến từ nút "In / Tải PDF" trong app, hay từ việc tự chuyển đổi file Word? Nếu vẫn còn
   lỗi "dính chữ" ở nút "In / Tải PDF" của app sau khi kéo bản sửa này về test, cần Hoan gửi lại
   ảnh chụp/PDF cụ thể để điều tra tiếp (khả năng cao là lỗi nằm ở bước chuyển đổi ngoài app).
- Test mới: `test/worksheetPhien17BugFix.test.js` (5 test) - build .docx THẬT (không mock), giải
  nén bằng JSZip soi thẳng `document.xml`, cùng tinh thần `exportService.docx.test.js`.
- Sanity-check ĐỘC LẬP thêm (ngoài bộ test chính thức): dùng `mammoth` trích xuất text THẬT từ
  .docx vừa tạo - xác nhận bằng mắt Bài 6/8/9 hiển thị đúng, không dính chữ, không còn "°".
- `npm test`: 261/261 PASS (256 cũ + 5 mới). `npm run build`: sạch (exit 0).

### ⚠️ Cần Hoan test thực tế (chưa test được trong sandbox)
1. **Xác nhận lại cách tạo file PDF** đã mô tả ở mục 3 bên trên - quan trọng để biết lỗi "dính
   chữ" đã thực sự hết hay chỉ hết ở phần code app kiểm soát được.
2. In thử lại đúng Bài 9 (Góc) bằng nút "In / Tải PDF" của app - xác nhận hình vẽ góc (SVG) vẫn
   hiển thị đúng như trước (phần này KHÔNG bị đụng vào trong lần sửa này, chỉ sửa bản Word).
3. Mở thử bản Word Giáo viên/Học sinh mới cho Bài 9 - xem dòng ghi chú mới ("Em hãy xem hình vẽ...")
   ở bản Học sinh có tự nhiên/dễ hiểu không, hay cần diễn đạt lại.
4. Đối chiếu bản Word vs bản web cho Bài 6/8 - xác nhận số thứ tự câu giờ đã khớp giữa 2 bản.

## ✅ (Phiên 16) — Sửa 3 lỗi sư phạm phản hồi thực tế (Trạm 6, 7, 12)
Xem đầy đủ chi tiết kỹ thuật trong `PROJECT_SUMMARY.md` mục "PHIÊN 16". Tóm tắt:
1. **Trạm 12 - hình trụ lộ ra đề Tiểu học**: `generateDienTichXqTp()` từng trộn cả "hình trụ" (dùng
   π) vào dạng bài "diện tích xung quanh/toàn phần" - SGK Toán 5 KHÔNG dạy công thức này cho hình
   trụ (thuộc Toán 9 - THCS). Đã bỏ hẳn nhánh hình trụ, chỉ còn HHCN/lập phương (đồng bộ cả
   `WorksheetPreview.jsx` + `worksheetExportService.js`).
2. **Trạm 6 - "Đặt tính rồi tính" không đủ chỗ đặt tính hàng dọc**: thêm component `GridOLy` (khung
   ô ly 5 dòng) thay cho dòng ngang "= ô trống" quá chật - áp dụng cho `PhepChiaCoDuSection`,
   `SoThapPhanCongTruSection`, `SoThapPhanNhanChiaSection` (web). Bản Word bỏ dấu "=" hàng ngang ở
   bản học sinh, để khoảng trắng viết tay thay vào đó.
3. **Trạm 7 - lặp tỉ lệ % 2 câu liên tiếp**: `generateTiSoPhanTram()` giờ loại tỉ lệ % của câu
   THÀNH CÔNG ngay trước khỏi lần bốc kế tiếp. Phát hiện + sửa 1 bug thật qua test (lần sửa đầu vẫn
   fail vì cập nhật "lastPercent" cả với item bị huỷ do trùng dedupeKey - xem chi tiết trong
   PROJECT_SUMMARY.md).
4. **3 QUY TẮC SƯ PHẠM TOÁN LỚP 5 BẮT BUỘC** đã ghi thành comment tại đúng vị trí code liên quan
   (worksheetSchemas.js) để không bị quên ở phiên sau - xem nguyên văn 3 quy tắc trong mục "Quy tắc
   sư phạm bắt buộc" bên dưới.
- `npm test`: 256/256 PASS (255 cũ + 1 mới cho quy tắc đa dạng hoá %, 1 test cũ viết lại theo quy
  tắc "cấm hình trụ"). `npm run build`: sạch (exit 0). Sanity-check độc lập thêm: 500 lần
  `generateDienTichXqTp()` không thấy hình trụ; 2000 lần `generateTiSoPhanTram()` - 0 vi phạm lặp %.

### ⚠️ Cần Hoan test thực tế (chưa test được trong sandbox)
1. In thử lại đúng Trạm 6 (Phép chia có dư) trên trình duyệt thật - xem khung ô ly `GridOLy` có đủ
   rộng/cao để đặt tính chia dài thoải mái không, và có bị tràn khi in ở khổ giấy thực tế không.
2. Xem lại Trạm 12 (Diện tích xung quanh/toàn phần) - xác nhận không còn câu nào về hình trụ nữa.
3. Sinh thử nhiều phiếu "Tỉ số phần trăm" (Trạm 7) - xác nhận cảm giác đa dạng % rõ rệt hơn so với
   trước, không còn 2 câu liên tiếp cùng % nữa.
4. Bản Word xuất ra cho các dạng bài "Đặt tính rồi tính" (cộng/trừ/nhân/chia số thập phân, chia có
   dư) - xem khoảng trắng viết tay mới (thay cho dấu "=" cũ) có đủ dùng khi in ra giấy không.

### Quy tắc sư phạm bắt buộc (áp dụng cho MỌI dạng bài Toán Lớp 5 sau này)
1. **Giới hạn hình học không gian**: bài tập tính Diện tích xung quanh, Diện tích toàn phần, hoặc
   Thể tích CHỈ ĐƯỢC PHÉP dùng Hình Lập Phương và Hình Hộp Chữ Nhật. CẤM TUYỆT ĐỐI Hình Trụ, Hình
   Cầu (không dùng số Pi cho các hình này).
2. **Đa dạng hoá tỉ số phần trăm**: các câu hỏi phần trăm trong cùng 1 bài phải có số liệu đa dạng,
   KHÔNG lặp lại cùng 1 tỉ lệ % ở 2 câu liên tiếp.
3. **Từ khoá "đặt tính"**: khi đề bài yêu cầu "Đặt tính rồi tính", KHÔNG xuất dấu "=" theo hàng
   ngang - dùng khung ô ly (`GridOLy`, web) hoặc khoảng trắng viết tay (Word) để học sinh tự đặt
   phép tính hàng dọc.

## ✅ (Phiên 15) — Lớp 5, Đợt 4: 10 dạng bài còn lại (hoàn tất Lớp 5)
Xem đầy đủ chi tiết kỹ thuật trong `PROJECT_SUMMARY.md` mục "PHIÊN 15". Tóm tắt:
1. 10 dạng bài mới: `ti_so_phan_tram` (tỉ số phần trăm, 3 dạng con), `hinh_tam_giac_hinh_thang`
   (diện tích tam giác/hình thang + chu vi tam giác), `hinh_tron` (chu vi/diện tích, π≈3,14),
   `the_tich_hhcn_lp` (thể tích HHCN/lập phương), `doi_don_vi_the_tich` (đổi đơn vị m³/dm³/cm³),
   `dien_tich_xq_tp` (diện tích xung quanh/toàn phần HHCN/lập phương/hình trụ), `so_do_thoi_gian`
   (cộng/trừ giờ-phút), `van_toc_quang_duong_thoi_gian` (toán chuyển động đều), `phep_chia_co_du`
   (chia số tự nhiên có dư), `so_thap_phan_chia_nang_cao` (chia thập phân cho thập phân + chia ra
   thương thập phân - mảng còn thiếu của Đợt 3).
2. Component dùng CHUNG `WordProblemBlankSection`/`buildWordProblemBlankParagraphs` (web + Word)
   cho 6/10 dạng bài có cùng khuôn "câu văn + 1 ô trống điền đáp số" - tránh viết lặp lại.
3. Tái dùng THẲNG `DoiDonViSection`/`buildDoiDonViParagraphs` (Lớp 3) và `SoThapPhanNhanChiaSection`/
   `buildSoThapPhanNhanChiaParagraphs` (Lớp 5 Đợt 3) cho 2 dạng bài đúng cùng hình dạng dữ liệu.
4. Phát hiện + sửa 1 bug thật qua test: pool số "đẹp" của `ti_so_phan_tram` ban đầu lẫn vài giá trị
   không phải bội số của 20 (VD 50, 150) → có tổ hợp ra kết quả .5 không nguyên. Đã sửa pool chỉ
   gồm bội số của 20.
- `npm test`: 255/255 PASS (239 cũ + 16 mới). `npm run build`: sạch.

## ✅ (Phiên 14) — Lớp 5, Đợt 3: Nhân, chia số thập phân
Xem đầy đủ chi tiết kỹ thuật trong `PROJECT_SUMMARY.md` mục "PHIÊN 14". Tóm tắt:
1. `so_thap_phan_nhan` (Nhân số thập phân) - trộn nhân với số tự nhiên (~65%) và nhân 2 số thập
   phân với nhau (~35%), số chữ số thập phân của tích = tổng 2 thừa số.
2. `so_thap_phan_chia` (Chia số thập phân cho số tự nhiên) - phiên bản chia hết tuyệt đối (chưa
   làm chia có dư/chia thập phân cho thập phân), sinh ngược từ thương "đẹp".
3. Preview web + export Word dùng CHUNG component/hàm cho cả 2 dạng bài (cùng hình dạng dữ liệu).
- `npm test`: 240/240 PASS (232 cũ + 8 mới). `npm run build`: sạch. Đã sanity-check end-to-end
  qua `generateWorksheet()` thật.

## ✅ (Phiên 13) — Backfill tài liệu Lớp 5 Đợt 1 + Lớp 5 Đợt 2 (Cộng, trừ số thập phân)
Xem đầy đủ chi tiết kỹ thuật trong `PROJECT_SUMMARY.md` mục "PHIÊN 13". Tóm tắt:
1. **Phát hiện tài liệu bị lệch**: rà soát code trước khi làm phát hiện Lớp 5 Đợt 1 ("So sánh số
   thập phân") **đã được code xong hoàn chỉnh từ trước** (4 tầng đủ + test riêng) dù mục "Trạng
   thái Lớp 5" bên dưới (viết TRƯỚC phiên này) từng ghi "CHƯA BẮT ĐẦU" — cùng kiểu lệch tài liệu
   đã gặp ở Phiên 10 (tính năng "Thu thập số liệu" Lớp 3). Đã cập nhật lại phần "Trạng thái Lớp 5"
   cho khớp thực tế.
2. **Lớp 5, Đợt 2** — dạng bài mới: `so_thap_phan_cong_tru` (Cộng, trừ số thập phân), cho phép 2
   toán hạng lệch số chữ số thập phân (VD "3,4 + 5,72"), tính bằng số nguyên quy đổi để tránh sai
   số dấu phẩy động, phép trừ luôn đảm bảo không ra số âm.
- `npm test`: 232/232 PASS (225 cũ + 7 mới cho Lớp 5 Đợt 2). `npm run build`: sạch. Đã test
  end-to-end qua `generateWorksheet()` thật (không chỉ test generator riêng lẻ).

## ✅ (Phiên 12) — sửa lỗi "Phiên đăng nhập đã hết" (public) + mở Lớp 4 Đợt 2
Xem đầy đủ chi tiết kỹ thuật trong `PROJECT_SUMMARY.md` mục "PHIÊN 12". Tóm tắt:
1. **Sửa lỗi "Phiên đăng nhập đã hết" hiện SAI khi web đang public**: 4 form (`WorksheetForm`,
   `OutlineForm`, `ExamMatrixForm`, `LessonPlanForm`) tự gọi `getSession()` (đọc localStorage) rồi
   CHẶN request nếu không có session - nhưng chế độ public không bao giờ có session trong
   localStorage. Sửa: `getEffectiveSession()` mới trong `authService.js`, đổi cả 4 form dùng hàm
   này thay vì `getSession()` trần.
2. **Lớp 4, Đợt 2** - 3 dạng bài mới: `bieu_thuc_chu` (Biểu thức chữ), `phan_so_so_sanh` (So sánh
   phân số), `goc_nhan_biet` (Góc và đơn vị đo góc - vẽ SVG ở web, mô tả bằng số đo ở Word). Phát
   hiện + sửa 1 bug thật qua sanity-check (`bieu_thuc_chu` có thể ra kết quả âm khi giá trị tạm về
   0 giữa 2 bước trừ).
- `npm test`: 213/213 PASS (203 cũ + 10 mới cho Lớp 4 Đợt 2). `npm run build`: sạch. Đã test
  end-to-end qua `generateWorksheet()` thật (không chỉ test generator riêng lẻ).

### ⚠️ Cần Hoan test thực tế (chưa test được trong sandbox)
1. **Nút "Tạo phiếu bài tập"** trên trình duyệt thật - xác nhận lỗi "Phiên đăng nhập đã hết" đã
   biến mất hoàn toàn (kể cả sau khi tải lại trang nhiều lần, xoá cache trình duyệt).
2. **Hình vẽ góc (SVG)** trong dạng bài "Góc và đơn vị đo góc" - xem tỷ lệ/kích thước hiển thị có
   ổn trên các kích thước màn hình khác nhau (điện thoại, máy tính) hay không.
3. **Bản Word xuất ra** cho cả 3 dạng bài mới - đặc biệt "Góc và đơn vị đo góc" (bản Word mô tả
   bằng số đo, khác hẳn bản web có hình vẽ - cần xem có tự nhiên/dễ hiểu không).

## ✅ (Phiên 11) — public mặc định + sửa lỗi nút Chủ đề SGK + mở Lớp 4 Đợt 1
Xem đầy đủ chi tiết kỹ thuật trong `PROJECT_SUMMARY.md` mục "PHIÊN 11". Tóm tắt:
1. **Tắt đăng nhập VĨNH VIỄN (public mặc định)**: đảo mặc định của `NEXT_PUBLIC_DISABLE_LOGIN`
   trong `src/services/apiAuth.js` + `src/app/page.js` - giờ **KHÔNG đặt biến này = công khai**
   (trước đây phải CHỦ Ý đặt `=true` mới công khai, nên trên Vercel - nơi chưa cấu hình biến này -
   trang production vẫn bị chặn đăng nhập ngoài ý muốn). Muốn bật lại đăng nhập sau này: đặt
   `NEXT_PUBLIC_DISABLE_LOGIN=false` trên Vercel rồi deploy lại - KHÔNG cần sửa code. Đã cập nhật
   `.env.local.example` khớp theo.
2. **Sửa lỗi "không thể bấm chọn chức năng" (nút "Chủ đề SGK")**: xác nhận đây là lỗi UX (bấm vẫn
   cập nhật đúng số lượng dạng bài bên dưới) chứ KHÔNG phải lỗi logic - chỉ là không có phản hồi
   thị giác nên giáo viên tưởng nút không hoạt động. Đã sửa trong `WorksheetForm.jsx`: bấm nút ->
   tự cuộn tới khu vực "Chọn dạng bài + số lượng" + chớp sáng (flash, ~1.5s) các dòng vừa bật; nút
   tự đổi màu xanh đặc + dấu ✓ khi TOÀN BỘ dạng bài trong gói đã được bật (tính động từ
   `exerciseCounts` hiện tại, không phải cờ tạm - vẫn đúng kể cả sau khi giáo viên tự sửa số).
3. **Mở Lớp 4, Đợt 1** (nối đủ 4 tầng: catalog → generator → preview → export Word):
   - `WORKSHEET_GRADES.LOP_4` (maxNumber=1.000.000), `GRADE_ORDER` + dropdown form đã thêm LOP_4.
   - Mở `maxGrade` lên `LOP_4` cho 6 dạng bài "kỹ năng chung" đã có sẵn: `tinh_nham` (nhánh số
     tròn mở rộng thêm hàng trăm nghìn), `so_sanh`, `day_so` (bước 1000/10000/100000),
     `sap_xep_thu_tu`, `noi_phep_tinh` (cap riêng 10.000, giữ tính "nhẩm"), `giai_toan` (AI, tự
     dùng đúng `gradeConfig.label`/`maxNumber` của Lớp 4, không cần sửa prompt).
   - Dạng bài MỚI: **"Rút gọn phân số"** (`phan_so_rut_gon`) - hiển thị dạng chữ "tử/mẫu" (CHƯA
     dựng layout phân số nằm ngang có gạch ngang - để dành đợt sau nếu cần đẹp hơn).
   - `WORKSHEET_GRADE_TO_SGK_GRADE.LOP_4 = "4"` (dùng chung kho GitHub với Exam Generator, vốn đã
     hỗ trợ Lớp 4 - xem `gradeProfiles.js`) - **CHƯA XÁC NHẬN THỰC TẾ**, xem mục "Cần Hoan test"
     bên dưới.
- `npm test`: 203/203 PASS (không có test mới cho các thay đổi trên - xem mục "Cần Hoan test").
  `npm run build`: sạch (exit 0). Đã viết script sanity-check riêng (không nằm trong bộ test chính
  thức) xác nhận `generatePhanSoRutGon()` luôn rút gọn đúng toán học, và số liệu tính nhẩm/dãy số/
  nối phép tính Lớp 4 đều nằm trong phạm vi hợp lý.

### ⚠️ Cần Hoan test thực tế (chưa test được trong sandbox)
1. **Dropdown "Chủ đề SGK theo bài" cho Lớp 4** có tải được danh sách chương/bài không, hay báo lỗi
   rỗng? (phụ thuộc kho GitHub knowledge repo có đúng thư mục "4" hay không - chưa xác nhận được).
2. **Web công khai** sau khi deploy lại trên Vercel - vào thẳng trang chính không cần đăng nhập.
3. **Nút "Chủ đề SGK"** trên trình duyệt thật - xác nhận cuộn + chớp sáng + đổi màu nút hoạt động
   mượt (sandbox code không chạy được trình duyệt thật để xem trực tiếp).
4. Chưa viết test tự động riêng cho `generatePhanSoRutGon()`/Lớp 4 (mới chỉ sanity-check thủ công)
   - nên bổ sung vào bộ test chính thức (`test/*.test.js`) ở đợt sau.

## ✅ (Phiên 10) — đã sửa theo phản hồi thực tế sau khi test `dekiemtra-lop3-dot3.zip`
Xem đầy đủ chi tiết kỹ thuật trong `PROJECT_SUMMARY.md` mục "PHIÊN 10". Tóm tắt:
1. **Số kiểu Việt Nam (BẮT BUỘC)**: số tự nhiên từ 4 chữ số trở lên giờ LUÔN có dấu chấm phân
   cách hàng nghìn (VD `63880` → `63.880`) - hàm dùng chung MỚI `src/services/numberFormatUtils.js`
   (`formatSoTuNhien`/`formatSoTrongChuoi`), áp dụng cả web (WorksheetPreview.jsx) lẫn Word
   (worksheetExportService.js). Đã giải quyết đúng mục "Vấn đề kỹ thuật cần xử lý khi mở khối" bên
   dưới (không còn `toLocaleString("vi-VN")` rời rạc nữa).
2. **"Trạm 8" (Đổi đơn vị đo) + Tính nhẩm**: 3 cột → 2 cột (cả web lẫn Word), ô đáp án
   (`blankBox`) rộng từ 42px → tối thiểu 64px - không còn tràn số khi in số lớn (VD "19.000 ml").
3. **Tắt đăng nhập để test**: biến môi trường `NEXT_PUBLIC_DISABLE_LOGIN=true` (đặt trong
   `.env.local`, mặc định TẮT) - bỏ qua màn hình đăng nhập + kiểm tra token API, tiện giáo viên
   test nhanh. KHÔNG bật trên môi trường public/production - xem cảnh báo trong `.env.local.example`.
- `npm test`: 203/203 PASS. `npm run build`: sạch.
- **Lưu ý phát hiện được**: code hiện tại ĐÃ CÓ `ThuThapSoLieuSection`/`generateThuThapSoLieu`
  ("Thu thập, phân loại số liệu") dù mục "Trạng thái Lớp 3" bên dưới (viết TRƯỚC phiên này) ghi là
  "Đợt 3, CHƯA làm" - có vẻ đã được code ở 1 phiên khác chưa cập nhật lại file này. Hoan kiểm tra
  lại thực tế trên app xem tính năng này đã ĐỦ 4 tầng (catalog/generator/preview/export) hay chỉ
  mới 1 phần, trước khi coi đây là "đã xong".

## Bối cảnh
- Rà soát Phiếu Bài Tập phát hiện: (1) dạng bài Lớp 2 ít hơn Lớp 1; (2) Phiếu Bài Tập hiện chỉ hỗ trợ Mầm non-Lớp 2, cần mở lên Lớp 3-5 (nhóm giáo viên Tiểu học lớn nhất chưa được phục vụ); (3) khoảng cách nội dung lớn giữa Lớp 1-2 và Lớp 5 (số thập phân, số hàng triệu, km²/dm²); (4) vấn đề in màu tốn tiền học sinh vs in đen trắng làm nền/icon bị đen, không rõ.

## File liên quan (đã xác nhận qua code thật)
- Catalog dạng bài: `src/data/worksheetExerciseCatalog.js` — dùng `GRADE_ORDER`, `minGrade`/`maxGrade`, hàm `isGradeInRange()`. Hiện `GRADE_ORDER = ["MAM_NON","LOP_1","LOP_2","LOP_3","LOP_4"]` (cập nhật Phiên 11).
- Logic sinh bài: `src/data/worksheetSchemas.js`, orchestrator `src/services/worksheetGenerator.js`.
- Form nhập liệu: `src/components/WorksheetForm.jsx` (chọn "Khối lớp" tại dòng ~391).
- Hiển thị/preview: `src/components/WorksheetPreview.jsx` — dùng `background`/`accent` màu + emoji `mascot` trực tiếp, CHƯA có biến thể đen trắng.
- Xuất Word: `src/services/worksheetExportService.js`.

## Quyết định đã chốt
1. Cách làm: **chỉ khảo sát/thiết kế catalog trước, chưa code** → ĐÃ CHUYỂN SANG CODE (xem "Trạng thái Lớp 3" bên dưới).
2. Xử lý in Màu/Đen trắng: **thêm nút chọn chế độ in (Màu / Đen trắng)** — CHƯA LÀM, để sau khi Lớp 3 xong hẳn.
3. Ưu tiên nội dung mới: **Toán trước** — đang làm đúng thứ tự này.

## Trạng thái Lớp 3 (Toán) — ĐÃ CODE Đợt 1 + Đợt 2, CHƯA CHẠY THỬ THỰC TẾ TRÊN APP
File giao gần nhất: `dekiemtra-lop3-dot2.zip` (đã gồm cả Đợt 1).

**Đợt 1 (xong):** mở khối Lớp 3 (`GRADE_ORDER`, `WORKSHEET_GRADES.LOP_3` maxNumber=100000, mapping SGK, dropdown form); mở rộng maxGrade lên LOP_3 cho `tinh_nham` (nhánh riêng số tròn), `so_sanh`, `day_so` (bước 10/100/1000), `sap_xep_thu_tu`, `noi_phep_tinh` (cap max=1000), `giai_toan` (AI, thêm nhân/chia bảng cửu chương); dạng bài MỚI `nhan_chia_bang`.

**Đợt 2 (xong):** 5 dạng bài mới — `chu_vi_dien_tich` (hình vuông/HCN), `doi_don_vi_do` (độ dài/khối lượng/dung tích), `xem_dong_ho_gio_phut` (ClockFace mở rộng nhận `minute`; Word export dùng text vì Unicode không đủ độ chi tiết), `tien_viet_nam`, `kha_nang_xay_ra` (ngân hàng 15 câu Chắc chắn/Có thể/Không thể).

**Đã kiểm thử:** stress test 500 lượt (Đợt 1) + 200 lượt/dạng bài (Đợt 2), 0 lỗi; catalog trả đúng 12 dạng bài Toán Lớp 3; cả 5 dạng bài Đợt 2 đã nối đủ 4 tầng (catalog/generator/preview/export). **CHƯA chạy `npm run dev` thực tế trên trình duyệt** (môi trường code không có node_modules) — Hoan cần tự kéo về chạy thử trước khi merge.

**Còn lại (Đợt 3, CHƯA làm):** "Thu thập/phân loại số liệu" (đọc bảng/biểu đồ cột) — hoãn vì cần UI bảng/biểu đồ phức tạp hơn, không dồn cùng đợt với 5 dạng bài trên. Cân nhắc thêm "gói chủ đề" Lớp 3 (`worksheetTopicPackages.js`) để bật cả nhóm 1 lần thay vì bật rời rạc 12 dạng bài.

## Catalog Toán Lớp 3-5 — ĐÃ XÁC NHẬN theo đúng SGK Kết nối tri thức (KNTT, tra cứu thực tế qua nhiều nguồn đối chiếu, không suy đoán)
Trường CHỈ dùng 1 bộ SGK: **Kết nối tri thức** (đã xác nhận với Hoan).

- **Lớp 3** (16 chủ đề, 81 bài): số đến 100.000; bảng nhân/chia; nhân chia phạm vi 100 và 1000; đơn vị đo độ dài, khối lượng, dung tích, **nhiệt độ**; **chu vi, diện tích hình chữ nhật/hình vuông** (đã có từ Lớp 3, KHÔNG đợi Lớp 4); xem đồng hồ, tháng-năm, tiền Việt Nam; **thu thập/phân loại số liệu + khả năng xảy ra của một sự kiện** (thống kê & xác suất cơ bản — mảng mới, Lớp 1-2 chưa có); làm quen hình phẳng/hình khối, hình tròn (tâm/bán kính/đường kính), góc vuông/không vuông.
- **Lớp 4**: số có 6 chữ số, số đến 1.000.000; **góc và đơn vị đo góc** (góc nhọn/tù/bẹt — mảng hoàn toàn mới); **biểu thức chữ** (làm quen ẩn số — mới); phân số (rút gọn, tìm phân số của một số); giải toán 3 bước tính; dãy số liệu thống kê (mở rộng từ Lớp 3).
- **Lớp 5**: số thập phân (đọc/viết/so sánh/4 phép tính); tỉ số phần trăm; hình tam giác, hình thang, hình tròn (chu vi/diện tích); thể tích + đơn vị đo thể tích (cm³/dm³); diện tích xung quanh/toàn phần hình hộp chữ nhật, hình lập phương, hình trụ; số đo thời gian; vận tốc/quãng đường/thời gian (toán chuyển động đều).

Nguồn: PPCT + giải SGK Toán 3/4/5 KNTT (VietJack, VnDoc, tailieumoi.vn, lop3.vn) — đối chiếu nhiều nguồn, khớp nhau.

## Vấn đề kỹ thuật cần xử lý khi mở khối
- ✅ ĐÃ XONG (Phiên 10): định dạng số kiểu Việt Nam dùng dấu chấm phân cách hàng nghìn - hàm dùng
  chung `src/services/numberFormatUtils.js`, xem chi tiết mục "MỚI NHẤT" đầu file. Số thập phân
  (dấu phẩy) CHƯA cần vì Lớp 3 chưa học - sẽ mở rộng hàm này khi bắt đầu Lớp 4-5.
- Đơn vị đo diện tích/thể tích Lớp 4-5 phức tạp hơn nhiều — mỗi bài chỉ nên dùng 1 loại đơn vị, tránh trộn km² lẫn cm² trong cùng câu hỏi.
- `GRADE_ORDER` hiện tại: `["MAM_NON","LOP_1","LOP_2","LOP_3","LOP_4"]` — mở thêm LOP_5 chỉ cần thêm vào cuối mảng.

## Trạng thái Lớp 4 (Toán) — ĐÃ CODE Đợt 1, CHƯA CHẠY THỬ THỰC TẾ TRÊN APP
**Đợt 1 (xong, Phiên 11):** mở khối Lớp 4 (`GRADE_ORDER`, `WORKSHEET_GRADES.LOP_4` maxNumber=
1000000, mapping SGK `LOP_4:"4"` - CHƯA XÁC NHẬN kho GitHub có thư mục "4", dropdown form); mở
rộng maxGrade lên LOP_4 cho `tinh_nham` (nhánh số tròn mở rộng thêm hàng trăm nghìn), `so_sanh`,
`day_so` (bước 1000/10000/100000), `sap_xep_thu_tu`, `noi_phep_tinh` (cap riêng 10.000), `giai_toan`
(AI, tự dùng đúng gradeConfig của Lớp 4); dạng bài MỚI `phan_so_rut_gon` (Rút gọn phân số, hiển thị
dạng chữ "tử/mẫu", CHƯA có layout phân số nằm ngang).

**Đã kiểm thử:** sanity-check thủ công (không nằm trong bộ test chính thức) xác nhận rút gọn phân
số luôn đúng toán học + số liệu tính nhẩm/dãy số/nối phép tính nằm trong phạm vi hợp lý. `npm test`
203/203 PASS (bộ test CŨ, chưa có test riêng cho Lớp 4), `npm run build` sạch. **CHƯA chạy thử
thực tế trên trình duyệt** — Hoan cần tự kéo về chạy thử, đặc biệt xem dropdown "Chủ đề SGK theo
bài" cho Lớp 4 có tải được không.

**Còn lại cho Lớp 4 (theo catalog đã xác nhận SGK KNTT trong NEXT_STEPS.md, phần "Catalog Toán Lớp
3-5" bên dưới):**
- **Tìm phân số của một số** (VD "Tìm 2/3 của 18") — phần còn lại của "Phân số nâng cao", KHÁC với
  `phan_so_so_sanh` (đã làm ở Đợt 2, đó là so sánh 2 phân số chứ chưa phải "tìm phân số của 1 số").
- **Giải toán 3 bước tính** — có thể chỉ cần mở rộng prompt AI của `giai_toan` (đã dùng chung),
  không cần dạng bài mới riêng — cần kiểm tra thực tế prompt hiện tại có tự nhiên ra bài 3 bước
  khi grade=LOP_4 hay không.
- **Dãy số liệu thống kê** (mở rộng từ Lớp 3) — có thể mở `maxGrade` cho `thu_thap_so_lieu` lên
  LOP_4 nếu nội dung không đổi nhiều, cần xem lại generator có cứng số liệu Lớp 3 hay không.
- Cân nhắc thêm "gói chủ đề" Lớp 4 trong `worksheetTopicPackages.js` (như đã làm cho Lớp 1/Lớp 3)
  — giờ đã có 4 dạng bài Lớp 4 (`phan_so_rut_gon`, `bieu_thuc_chu`, `phan_so_so_sanh`,
  `goc_nhan_biet`), đủ để cân nhắc.

## ✅ (Phiên 12) — Lớp 4, Đợt 2 (xong)
Xem đầy đủ chi tiết kỹ thuật trong `PROJECT_SUMMARY.md` mục "PHIÊN 12". Tóm tắt: 3 dạng bài mới
`bieu_thuc_chu`/`phan_so_so_sanh`/`goc_nhan_biet`, nối đủ 4 tầng, có test tự động riêng
(`test/worksheetLop4Dot2.test.js`), đã test end-to-end qua `generateWorksheet()` thật.

## Trạng thái Lớp 5 (Toán) — Đợt 1-4 xong (14 dạng bài, xem PROJECT_SUMMARY.md "PHIÊN 15")
Khối lượng rất lớn, cần tách nhiều đợt như Lớp 3/Lớp 4. Nội dung cần (xem "Catalog Toán Lớp 3-5"
bên dưới): số thập phân (đọc/viết/so sánh/4 phép tính - **cần generator số thập phân RIÊNG**, khác
hẳn số nguyên hiện có); tỉ số phần trăm; hình tam giác/hình thang/hình tròn (chu vi/diện tích);
thể tích + đơn vị đo thể tích; diện tích xung quanh/toàn phần hình hộp chữ nhật/lập phương/trụ; số
đo thời gian; vận tốc-quãng đường-thời gian (toán chuyển động đều).

**Vấn đề kỹ thuật đã giải quyết (trước khi code Lớp 5):**
- ✅ `formatSoThapPhan()` (`numberFormatUtils.js`) - hàm RIÊNG cho số thập phân (khác
  `formatSoTuNhien()`), ép đúng số chữ số thập phân cố định bằng `toFixed()` thay vì dùng thẳng
  `toLocaleString` (vốn tự rút gọn số 0 vô nghĩa ở cuối, sai với bài toán "số thập phân bằng
  nhau" của SGK Lớp 5). Có test riêng xác nhận.
- ✅ `WORKSHEET_GRADES.LOP_5` + `GRADE_ORDER` đã thêm `"LOP_5"` vào cuối mảng.
- ✅ Các dạng bài Lớp 5 dùng nhánh xử lý số THẬP PHÂN RIÊNG (không tái dùng `maxNumber` số
  nguyên như đã làm cho Lớp 3/Lớp 4) - quy đổi qua số nguyên (`nhân 10^width`) trước khi
  so sánh/cộng/trừ rồi mới quy đổi ngược, tránh sai số dấu phẩy động JS.

**Đợt 1 (xong, Phiên không rõ - phát hiện qua rà soát code ở Phiên 13, xem mục "MỚI NHẤT" đầu
file):** dạng bài `so_thap_phan_so_sanh` (So sánh số thập phân) - phần nguyên 0-999, phần thập
phân 1-2 chữ số ngẫu nhiên, cố ý cho ~40% cặp lệch số chữ số thập phân (VD "3,5" vs "3,45") đúng
trọng tâm SGK. Test: `test/worksheetLop5Dot1.test.js` (8 test).

**Đợt 2 (xong, Phiên 13):** dạng bài `so_thap_phan_cong_tru` (Cộng, trừ số thập phân) - phần
nguyên 0-99, cố ý cho ~35% cặp lệch số chữ số thập phân, phép trừ luôn đảm bảo số bị trừ >= số
trừ (tự hoán đổi toán hạng nếu random ngược). Test: `test/worksheetLop5Dot2.test.js` (7 test).

**Đợt 3 (xong, Phiên 14):** 2 dạng bài mới, dùng CHUNG component/hàm hiển thị (cùng hình dạng dữ
liệu như Đợt 2):
- `so_thap_phan_nhan` (Nhân số thập phân) - trộn nhân với số tự nhiên (~65%, thừa số 2-9 kiểu
  "bảng nhân") và nhân 2 số thập phân với nhau (~35%). Số chữ số thập phân của tích = TỔNG số
  chữ số thập phân 2 thừa số (tính bằng cách quy MỖI thừa số về số nguyên theo width riêng rồi
  nhân, cộng 2 width lại làm width kết quả).
- `so_thap_phan_chia` (Chia số thập phân cho số tự nhiên) - phiên bản chia hết TUYỆT ĐỐI (không
  dư), sinh ngược từ thương "đẹp" rồi nhân lên ra số bị chia - đảm bảo chia hết 100%.
Test: `test/worksheetLop5Dot3.test.js` (8 test).

**Đợt 4 (xong, Phiên 15) — 10 dạng bài còn lại, xem "PHIÊN 15" trong PROJECT_SUMMARY.md:**
`ti_so_phan_tram`, `hinh_tam_giac_hinh_thang`, `hinh_tron`, `the_tich_hhcn_lp`,
`doi_don_vi_the_tich`, `dien_tich_xq_tp`, `so_do_thoi_gian`, `van_toc_quang_duong_thoi_gian`,
`phep_chia_co_du`, `so_thap_phan_chia_nang_cao`. Test: `test/worksheetLop5Dot4.test.js` (16 test).

**Còn lại cho Lớp 5 (không nhiều, chủ yếu là tinh chỉnh sau phản hồi thực tế):**
- Cân nhắc thêm dạng "giải toán có lời văn tổng hợp" (dùng AI `giai_toan`) riêng cho Lớp 5, phối
  hợp nhiều chủ đề trong 1 đề bài (VD vận tốc + số đo thời gian) - hiện Đợt 4 mới làm generator
  code thuần cho từng chủ đề tách biệt.
- Cân nhắc thêm "gói chủ đề" Lớp 5 (`worksheetTopicPackages.js`) nay đã có khá đầy đủ dạng bài
  (14 dạng) - nên làm sau khi có phản hồi thực tế từ giáo viên.
- Chế độ in Đen trắng (đã note ở các đợt trước, vẫn để dành - chưa làm cho Lớp 5).


## Thiết kế chế độ in Màu/Đen trắng (draft)
- Thêm field `printMode: "color" | "bw"` (mặc định `"color"`).
- Chế độ `"bw"`: bỏ `background` màu fill lớn, dùng nền trắng + viền đen/xám đậm để phân tách khối; giữ mascot emoji nguyên vẹn (vấn đề chính là nền màu lớn bị đen khi in, không phải icon nhỏ).
- Palette đen trắng là **bộ giá trị riêng song song**, không tính "làm nhạt màu" — theo đúng nguyên tắc isolation Hoan đã chọn.
- Cần đồng bộ ở CẢ 2 nơi: `WorksheetPreview.jsx` (xem web) và `worksheetExportService.js` (xuất Word) — vì giáo viên có thể in từ 1 trong 2 chỗ.
- Làm SAU khi có ít nhất 1 khối lớp mới hoàn chỉnh, để test trên dữ liệu thật.

## Quy trình triển khai đề xuất
1. Hoan xác nhận/chỉnh catalog Toán Lớp 3-5 ở trên.
2. Chốt thiết kế đơn vị đo + format số.
3. Chốt thiết kế chế độ in Màu/Đen trắng.
4. Code tuần tự: Lớp 3 → review → Lớp 4 → review → Lớp 5.
5. Làm chế độ in Màu/Đen trắng sau khi có ít nhất 1 khối lớp mới xong.

## Lưu ý chung của dự án (từ trước, vẫn áp dụng)
- Isolation over DRY: ưu tiên style/component tách riêng theo từng feature, chấp nhận trùng lặp code.
- Grep trước khi giả định phạm vi — luôn xác nhận số file thực tế trước khi sửa/xoá.
- Nhóm D (cải tiến nhỏ, làm trước Nhóm B) và Nhóm B (tính năng "Đề cương Ôn tập") vẫn đang chờ, độc lập với việc mở rộng Phiếu Bài Tập này.
