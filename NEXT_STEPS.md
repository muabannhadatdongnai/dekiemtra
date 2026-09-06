# NEXT_STEPS.md — Việc đang dở dang + nguyên tắc bắt buộc phải nhớ

> File này CHỈ giữ thông tin còn TÁC DỤNG cho lần sửa tiếp theo — không phải nhật ký. Lịch sử đầy
> đủ từng phiên nằm ở `PROJECT_SUMMARY.md`. Khi 1 việc trong bảng dưới đã xong, XOÁ dòng đó khỏi
> bảng (đừng giữ lại "lịch sử đã xong" ở đây — chuyển 1 dòng tóm tắt sang `PROJECT_SUMMARY.md`).

**Trạng thái tổng quát:** 7 tab đang hoạt động (Soạn Giáo án, Phiếu Bài Tập, Đề Tiếng Việt Tiểu
học, Đề Cương Ôn Tập, Tạo Đề Kiểm Tra, Nhận Xét Học Bạ, Hướng dẫn sử dụng). Soạn Giáo án/Đề Cương
Ôn Tập/Tạo Đề Kiểm Tra đã hỗ trợ ĐỦ Mầm non → Lớp 12 (Tiểu học + THCS + THPT, xem Phiên 33 - THPT
khai báo đủ 17 môn/HĐGD: 8 bắt buộc + 9 lựa chọn theo Thông tư 32/2018 sửa đổi Thông tư 13/2022,
KHÔNG cần dropdown "chọn tổ hợp" riêng vì công cụ soạn theo 1 môn/1 lúc). Toán Lớp 3-5 đã đủ
catalog Phiếu Bài Tập theo SGK KNTT. Môn Tiếng Anh ở 3 tab Soạn Giáo Án/Đề Cương Ôn Tập/Tạo Đề
Kiểm Tra: từ Phiên 35, AI sinh nội dung TRỰC TIẾP bằng tiếng Anh ngay từ đầu (không còn sinh tiếng
Việt rồi dịch lại) - nút "Tải Word"/"In PDF" DUY NHẤT tự động xuất bằng tiếng Anh khi môn học nằm
trong danh bạ `src/data/foreignLanguageSubjects.js`. Phiên 38-40: thêm ĐỦ 3 môn Ngoại ngữ 2 mới -
Tiếng Trung/Tiếng Nhật/Tiếng Pháp, Lớp 6-12 (THCS+THPT, theo bộ Kết nối tri thức) - cấu hình/prompt
(Phiên 38), bản xem trước web (Phiên 39), và XUẤT FILE Word/PDF (Phiên 40, xem
`foreignLanguageExportRegistry.js`) - xem mục "🟢 Ngoại ngữ 2" bên dưới để biết chi tiết + phần còn
tồn đọng (rà bởi người bản ngữ, xác nhận mở bằng Word thật). Riêng phụ lục "Tin nhắn gửi phụ huynh
(Zalo)" ở Soạn Giáo Án và "Thư ngỏ gửi Phụ huynh" ở Đề Cương Ôn Tập (từ Phiên 37) LUÔN giữ tiếng
Việt - đã xác nhận áp dụng đúng cho CẢ bản xem trước web lẫn file xuất ra của Ngoại ngữ 2. Chi tiết
đầy đủ từng module xem `README.md`.

---

## 🔴 CẦN HOAN QUYẾT ĐỊNH / TỰ LÀM

| # | Việc | Vì sao cần Hoan |
|---|------|------------------|
| 1 | Kích hoạt hay xoá tab "Tô màu" (Coloring Page) | Code đã đủ 4 tầng nhưng chưa nối vào `page.js` — đang "chết" trong kho. Xoá thì xoá luôn 6 file liên quan + biến môi trường `COLORING_GEMINI_API_KEYS` trên Vercel cho gọn. |
| 2 | Tạo file `chuong_{n}_bai.json` cho tính năng "gợi ý Bài theo SGK" (Soạn giáo án) | Tính năng đã code xong nhưng KHÔNG hoạt động tới khi có dữ liệu thật trong kho GitHub kiến thức. Xem cấu trúc tại `docs/vi-du-phu-luc-bai-hoc.example.js`. Làm dần theo Chương, không cần làm hết ngay. |
| 3 | Tạo dữ liệu SGK thật cho 4 môn mới thêm gần đây: Tự nhiên và Xã hội (Lớp 1-3), Lịch sử và Địa lí (Lớp 4-5), Tin học (Lớp 3-5), Công nghệ (Lớp 3-5) | Code (`config.js`/`subjectProfiles.js`/3 form) đã sẵn sàng, nhưng dropdown "Chương" ở Soạn giáo án/Đề Cương Ôn Tập/Tạo Đề Kiểm Tra sẽ RỖNG cho tới khi có file `chuong_{n}.md` trong kho GitHub kiến thức theo đúng cấu trúc đang dùng cho Toán/Tiếng Việt. |
| 4 | ~~Chạy `npm run build` + `npm test` thật sau khi merge patch chuẩn hoá môn học (Lớp 1-5)~~ | ĐÃ CHẠY THẬT (Phiên 39) — `npm test`: 412 tests, 410 pass (2 fail còn lại là mục #17 đã biết trước), `npm run build` sạch. |
| 5 | ~~Xác nhận có muốn thêm Giáo dục thể chất/Âm nhạc/Mĩ thuật/Hoạt động trải nghiệm~~ | ĐÃ THÊM (Phiên 32 THCS, Phiên 33 mở rộng THPT) — dùng `modules: NO_EXAM_MODULES` (chỉ Soạn Giáo án, không có Đề kiểm tra/Đề cương) đúng tinh thần "nhận xét-only" của Thông tư 22/2021. |
| 6 | Lỗ hổng bảo mật gói `xlsx` (Prototype Pollution/ReDoS) | Nhà phát hành chưa có bản vá — chỉ cần biết để KHÔNG mở tính năng nhập Excel cho người dùng ẩn danh/công khai; chưa cần hành động ngay. |
| 7 | Icon line-art (Phiếu Bài Tập, Bài 3) chưa qua mắt giáo viên/học sinh thật | Đã có sẵn `lineart-icon-review-sheet.html` để in/gửi thu thập phản hồi. Sửa trực tiếp `scripts/lineArtIconDefs.js` rồi chạy lại `scripts/render-line-art-icons.js` khi có phản hồi. |
| 8 | Thiết kế dạng bài Tiếng Việt Lớp 1 kiểu "âm/vần" thay thế | Đã ẩn 2 dạng bài vượt cấp (`khoanh_tu_loai`/`noi_tu_nhom`) khỏi Lớp 1, nhưng CHƯA có dạng bài thay thế đúng trình độ (VD "Khoanh vào tiếng có âm a", "Nối từ với hình"). Hiện Lớp 1 chỉ còn `dien_tu_cho_san`. |
| 9 | Chính tả: có nên thêm trường "đoạn trích nguyên văn" vào phụ lục Bài Tiếng Việt? | Hiện chỉ dùng mô tả ngắn để gợi nhớ, giáo viên vẫn tự gõ nguyên văn (đúng nguyên tắc chống bịa/vi phạm bản quyền). Nếu muốn tự động điền nguyên văn, cần Hoan tự thêm nội dung CHÍNH XÁC từ SGK thật vào JSON — không nên để AI tự sinh. |
| 10 | Nhóm D còn lại (cải tiến hạ tầng nhỏ) | Cảnh báo lệch khối lớp trong `ExamMatrixForm.jsx`, style đậm nhất quán cho tiêu đề chính mọi tab, tách hàm style PDF thân thiện phụ huynh riêng theo từng tính năng. Chưa xác nhận trạng thái mới nhất — kiểm tra lại code thật trước khi báo "đã xong" hay "chưa làm". |
| 11 | Giữ hay xoá so sánh nhiều học kỳ trong lịch sử học bạ (Nhận Xét Học Bạ) | Giữ = cần thời gian lưu Upstash dài hơn (tốn quota free tier); xoá sau 1 giờ = đơn giản, ít rủi ro quota nhưng mất khả năng so sánh học kỳ trước. |
| 12 | Tạo dữ liệu SGK thật (kho GitHub kiến thức) cho 6 môn THPT mới thêm ở Phiên 33 | Code (`config.js`/`subjectProfiles.js`/3 form) đã sẵn sàng cho Vật lí, Hoá học, Sinh học, Địa lí, Giáo dục kinh tế và pháp luật, Giáo dục quốc phòng và an ninh (Lớp 10-12) — nhưng dropdown "Chương" sẽ RỖNG cho tới khi có file `chuong_{n}.md` đúng cấu trúc thư mục `sach_giao_khoa/lop_{10,11,12}/{ten_mon_slug}/`. |
| 13 | Module Đề kiểm tra Ngữ văn THCS/THPT riêng | Ngữ văn hiện CHỈ có ở Soạn giáo án/Đề cương Ôn tập (xem `modules` trong `config.js`), CHƯA có "Đề kiểm tra" vì cấu trúc khác hẳn (Đọc hiểu + Viết đoạn Nghị luận xã hội + Viết bài Nghị luận văn học) và theo Công văn 3175/BGDĐT-GDTrH (2022, nhấn mạnh lại ở CV3935/2024) BẮT BUỘC ngữ liệu Đọc hiểu phải MỚI, không được lấy lại từ SGK - cần thiết kế module riêng kiểu "khối độc lập" giống Đề Tiếng Việt Tiểu học nhưng nội dung khác hẳn, không gộp vào ma trận Tạo Đề Kiểm Tra chung. Áp dụng CHUNG cho cả THCS lẫn THPT (đã xác nhận Công văn 3175 không tách riêng cấp). |
| 14 | Xác nhận lại "Nghệ thuật" (Âm nhạc + Mĩ thuật) THCS/THPT đã tách đúng 2 đầu sách theo bộ Kết nối tri thức | Đã tách theo ĐÚNG tinh thần "Tin học và Công nghệ" ở Tiểu học (tách 2 môn vì SGK in 2 cuốn riêng dù thông tư gọi gộp) - suy luận hợp lý nhưng CHƯA xác nhận trực tiếp với bộ sách thật, Hoan kiểm tra lại nếu có SGK thật trong tay. |
| 15 | Cụm chuyên đề học tập THPT (3 chuyên đề/môn, 105 tiết/năm) | CỐ Ý CHƯA làm ở Phiên 33 — đây là nội dung RIÊNG ngoài chương trình cốt lõi đại trà (học sinh chọn 3 trong số các môn lựa chọn hoặc Toán/Ngữ văn/Lịch sử để học chuyên đề sâu hơn theo định hướng nghề nghiệp), không có SGK dùng chung dễ tái sử dụng cấu trúc hiện tại — cần thiết kế riêng nếu Hoan muốn làm tiếp. |
| 16 | Kiểm tra thật trên trình duyệt việc AI sinh trực tiếp tiếng Anh (Soạn Giáo Án/Đề Cương Ôn Tập/Đề Kiểm tra, môn Tiếng Anh) | Phiên 35: đã đổi kiến trúc (sinh thẳng tiếng Anh, bỏ bước dịch); Phiên 36: đã SỬA 2 lỗi (hạt sạn tiếng Việt trong tên hoạt động; nút In/Tải PDF báo lỗi popup); Phiên 37: đã SỬA 2 lỗi tiếp theo phát hiện qua file `.docx` lỗi thật Hoan gửi - xem PROJECT_SUMMARY.md Phiên 37 (file Word tiếng Anh Soạn Giáo Án không mở được do `<w:p>` lồng `<w:p>` ở bảng "Hết Tiết"; "Thư ngỏ gửi Phụ huynh" Đề Cương Ôn Tập bị dịch nhầm sang tiếng Anh). Code + test (`test/foreignLanguageExport.test.js`, `test/lessonPlanPhien36.test.js`, `test/lessonPlanPhien37.test.js`, `test/wordSchemaAssertions.js`) + `npm run test:word-compat` (nay có 3 kịch bản tiếng Anh) đều pass, build sạch, nhưng VẪN CHƯA test thật với Gemini API key thật (sandbox không có `GEMINI_API_KEYS`) để xác nhận AI TUÂN THỦ chỉ thị `buildForeignLanguageOutputDirective()` với nội dung bài học thật (không chỉ cấu trúc/tên hoạt động) - Hoan click-through lại 1 lượt, kèm MỞ THẬT file Word bằng Microsoft Word (không chỉ xem trước/PDF) để xác nhận triệt để trước khi coi là xong hẳn.
| 18 | Xác nhận lại việc sửa `<w:p>` lồng `<w:p>` (Phiên 37) đã LÊN THẬT trên Vercel chưa | Hoan gửi 1 file `.docx` "mới" (Lesson-Plan-EN-Lesson-1...) sau khi Claude báo đã sửa xong, nhưng validate lại vẫn thấy ĐÚNG lỗi cũ, ĐÚNG vị trí (bảng "Hết Tiết"). Claude đã build lại chính xác `englishLessonPlanExportService.js`/`foreignLanguageDocBuilder.js` TRONG zip Phiên 37 bằng docx.js thật + validate schema → xác nhận code trong zip KHÔNG còn lỗi. Kết luận: file Word đó vẫn được tạo bởi bản CHƯA deploy code Phiên 37. Hoan cần kiểm tra deployment trên Vercel (đúng commit/thư mục chứa comment `// ⚠️ FIX (Phiên 37)` ở dòng ~90 file đó chưa) rồi tạo lại file Word MỚI để test lại. |

---

## 🟢 Ngoại ngữ 2 (Tiếng Trung/Tiếng Nhật/Tiếng Pháp, Lớp 6-12) — bắt đầu Phiên 38, HOÀN TẤT ở Phiên 40 (cấu hình + bản xem trước web + XUẤT FILE Word/PDF)

**Yêu cầu Hoan (Phiên 38):** SGK Kết nối tri thức đã có Tiếng Trung/Tiếng Nhật/Tiếng Pháp làm
"Ngoại ngữ 2" cho THCS+THPT → thêm vào cả 3 tab Soạn Giáo Án/Đề Cương Ôn Tập/Tạo Đề Kiểm tra, giữ
nguyên tắc "chia luồng riêng theo môn/khối" (isolation), và AI phải sinh nội dung bằng ĐÚNG ngôn
ngữ riêng của từng môn (giống kiến trúc Tiếng Anh từ Phiên 35 - sinh trực tiếp, không dịch lại).

**Tóm tắt Phiên 38-39 (cấu hình/prompt + bản xem trước web - chi tiết đầy đủ đã chuyển sang
`PROJECT_SUMMARY.md`):** `config.js`/`foreignLanguageSubjects.js`/`subjectProfiles.js` đã thêm 3
môn (`zh`/`ja`/`fr`, Lớp 6-12, không giới hạn `modules`), AI sinh nội dung TRỰC TIẾP bằng đúng ngôn
ngữ (không dịch lại), có `expertRole`/`extraRules` riêng theo đặc thù HSK/JLPT/dấu phụ Pháp ngữ.
`LessonPlanPreview.jsx` đã có `LABELS_ZH`/`LABELS_JA`/`LABELS_FR` (bản xem trước web, KHÁC xuất
file). **CHƯA rà bởi người bản ngữ** - xem cảnh báo tương tự ở phần XUẤT FILE Phiên 40 bên dưới,
gộp chung 1 việc cần làm.
- **Kế thừa, GHI NHẬN chứ CHƯA sửa** (ngoài phạm vi): Đề Cương Ôn Tập (`OutlinePreview.jsx`) và Đề
  Kiểm Tra (`VietnameseExamPreview.jsx`) hoàn toàn KHÔNG có xử lý theo `languageCode` ở BẢN XEM
  TRƯỚC WEB (khác XUẤT FILE - Phiên 40 đã xong) - hiển thị nhãn tĩnh tiếng Việt cho MỌI môn kể cả
  Tiếng Anh (khoảng trống có sẵn từ Phiên 35-36). Cần phiên riêng nếu Hoan muốn đồng bộ.

**✅ ĐÃ XONG ở Phiên 40 (XUẤT FILE Word/PDF - Hướng A, Hoan chọn giữ nguyên "isolation over DRY"):**
- 15 file dịch vụ mới (5 file × 3 ngôn ngữ, đúng khuôn `english*.js`):
  `{chinese,japanese,french}LessonPlanExportService.js`,
  `{chinese,japanese,french}OutlineExportService.js`,
  `{chinese,japanese,french}ExamExportService.js`,
  `{chinese,japanese,french}SpecificationBuilder.js`,
  `{chinese,japanese,french}SpecificationExportBuilders.js`.
- `foreignLanguageDocBuilder.js` thêm `createLanguageHelpers(font)` (bộ helper riêng gắn font
  `eastAsia` cho Tiếng Trung/Nhật) + tham số `fontFamily` cho `printHtmlDocument()`. Tiếng Pháp
  dùng thẳng helper mặc định (Latinh, Times New Roman đủ).
- `foreignLanguageExportRegistry.js` (MỚI) - bảng tra `languageCode` → đúng bộ hàm
  `exportToWord`/`print` mỗi loại tài liệu; `LessonPlanExportActions.jsx`/
  `OutlineExportActions.jsx`/`ExportActions.jsx` đã đổi sang gọi qua registry này thay vì gọi CỨNG
  bản tiếng Anh. Tên file tải xuống đổi tiền tố theo ngôn ngữ (`Lesson-Plan-ZH-...`/`-JA-...`/
  `-FR-...`, `{title}-ZH-Student.docx`/`-Teacher.docx`...).
- **Bắt được 1 lỗi thật lúc phát triển**: shape `{ name, eastAsia }` truyền vào `TextRun.font` của
  `docx@9` bị ÂM THẦM BỎ QUA `eastAsia` (docx coi là `IFontOptions`, không phải
  `IFontAttributesProperties`) - chữ Hán/Kana ban đầu vẫn đọc "Times New Roman" dù code trông đúng.
  Chỉ phát hiện được nhờ soi trực tiếp `word/document.xml` sinh ra. Đã sửa thành đúng shape
  `{ ascii, hAnsi, cs, eastAsia }` - xem chi tiết trong `createLanguageHelpers()`.
- Kiểm thử 3 lớp (đúng bài học Phiên 37 - "well-formed XML" ≠ "Word mở được"):
  1. `test/foreignLanguage2Export.test.js` (24 test MỚI) - dựng `.docx` thật, soi XML bằng JSZip,
     `assertValidParagraphNesting()` cho mọi file (kể cả kịch bản bảng 2 cột nhiều tiết - đúng
     đường code từng gây lỗi Phiên 37), kiểm tra `w:eastAsia="SimSun"`/`"MS Mincho"` có trong XML
     thật, và tin nhắn/thư ngỏ phụ huynh vẫn giữ tiếng Việt.
  2. `npm run test:word-compat` (LibreOffice headless) - thêm 9 kịch bản mới, cả 18/18 (kể cả cũ)
     convert PDF thành công.
  3. Xem TRỰC QUAN bằng mắt: xuất 1 file `.docx` tiếng Trung → PDF → PNG - chữ Hán hiện đúng,
     không ô vuông trống. (Tiếng Nhật CHƯA tự xem ảnh riêng, xem mục còn lại bên dưới.)
  - `npm test`: 436 tests, 434 pass (2 fail còn lại vẫn là mục #17 lúc đó - không liên quan). `npm
    run build`: sạch. (Mục #17 đã được cài đặt ở Phiên 41, xem PROJECT_SUMMARY.md - `npm test` hiện
    tại là 436/436 PASS, không còn fail nào.)

**❌ CÒN LẠI (không thuộc phạm vi Phiên 40, không chặn triển khai):**
1. **Rà bởi người bản ngữ** - toàn bộ nhãn tĩnh tiếng Trung/Nhật/Pháp (cả bản xem trước web Phiên
   39 lẫn 15 file xuất file Phiên 40) do Claude dịch, CẦN người biết tiếng kiểm tra lại khi có dịp.
2. Xem ảnh PNG trực quan riêng cho 1 file tiếng Nhật (đã làm cho tiếng Trung) để chắc chắn
   `MS Mincho` hiển thị đúng Kanji/Hiragana/Katakana.
3. Mở THẬT bằng Microsoft Word (không chỉ LibreOffice headless) - đặc biệt xác nhận máy Windows của
   giáo viên có sẵn `SimSun`/`MS Mincho` (thường có sẵn với Office tiêu chuẩn).
4. Dữ liệu SGK thật (kho GitHub kiến thức) cho 3 môn mới - dropdown "Chương" sẽ RỖNG tới khi có file
   `chuong_{n}.md` đúng cấu trúc thư mục hiện dùng cho Tiếng Anh/Toán/Tiếng Việt.

---

## Nguyên tắc sư phạm/kỹ thuật BẮT BUỘC — đọc trước khi code Phiếu Bài Tập/Đề mới

**Toán Lớp 5 — hình học không gian & số liệu:**
1. Bài tính Diện tích xung quanh/toàn phần/Thể tích CHỈ dùng Hình Lập Phương và Hình Hộp Chữ
   Nhật. CẤM TUYỆT ĐỐI Hình Trụ, Hình Cầu (không dùng số Pi cho các hình này ở Tiểu học).
2. Câu hỏi tỉ số phần trăm trong cùng 1 bài phải đa dạng số liệu, không lặp cùng 1 tỉ lệ % ở 2
   câu liên tiếp.
3. "Đặt tính rồi tính": KHÔNG xuất dấu "=" theo hàng ngang — dùng khung ô ly (web) hoặc khoảng
   trắng viết tay (Word) để học sinh tự đặt phép tính hàng dọc.

**Toán Lớp 4:** nhận diện góc (nhọn/tù/bẹt/vuông) CHỈ phân loại bằng trực quan/ê-ke, KHÔNG dùng số
đo độ cụ thể (học sinh chưa học thước đo độ). Số thứ tự câu hỏi đặt cạnh tử số phân số phải có
khoảng cách rõ, tránh nhìn nhầm thành số thập phân (học sinh Lớp 4 chưa học số thập phân).

**Xuất Word — không dùng ký tự Unicode hiếm để vẽ hình:** mọi hình minh hoạ lặp ký tự
(┆▬▭▪■⬭⬠⬡⏢...) phụ thuộc font máy người dùng, có thể hiện TRỐNG trong Word dù PDF vẫn ổn (PDF qua
trình duyệt tự fallback font, Word mở trực tiếp thì không). Luôn rasterize SVG → PNG rồi nhúng
`ImageRun`, không lặp ký tự đặc biệt.

**Xuất Word — "well-formed XML" KHÔNG đồng nghĩa "Word mở được" (bài học Phiên 37):** `JSZip` +
`ElementTree`/`python-docx` + LibreOffice (kể cả `npm run test:word-compat`) đều CHỈ kiểm tra XML
khớp thẻ mở/đóng, KHÔNG kiểm tra đúng schema WordprocessingML (VD: `<w:p>` chứa `<w:p>` con vẫn là
XML "well-formed" nhưng MS Word từ chối mở với lỗi chung chung "Word experienced an error trying
to open the file" — không có gợi ý nào chỉ đúng chỗ sai). Khi viết helper docx MỚI (`cell()`,
`paragraph()`...), LUÔN gọi `assertValidParagraphNesting()` (`test/wordSchemaAssertions.js`) trên
`document.xml` thật trong test — đặc biệt khi 1 hàm helper tự động bọc `Paragraph` quanh
`opts.children`: `opts.children` PHẢI là mảng `TextRun`, KHÔNG BAO GIỜ được truyền nguyên 1
`Paragraph` khác vào đó (lỗi gốc Phiên 37 - xem `periodBoundaryTableRowEn()` trong
`englishLessonPlanExportService.js`).

**Chính tả (Đề Tiếng Việt):** KHÔNG để AI tự sinh nguyên văn ngữ liệu SGK — chỉ gợi nhớ bằng mô tả
ngắn (`noiDungCotLoi`), giáo viên tự gõ nguyên văn. Đọc thầm thì AI được viết ngữ liệu MỚI (không
copy nguyên văn SGK) dựa trên `referenceContext` trích từ chương.

**Môn học theo khối lớp:** trước khi thêm/sửa môn trong `config.js`, LUÔN tra cứu đúng Thông tư
32/2018/TT-BGDĐT + cách chia sách bộ Kết nối tri thức thật — không suy đoán. VD: Khoa học chỉ có
từ Lớp 4 (Lớp 1-3 là "Tự nhiên và Xã hội"); "Lịch sử" đơn lẻ chỉ đúng từ Lớp 6, Tiểu học phải là
"Lịch sử và Địa lí".

**Quy ước chung (không đổi qua nhiều phiên):**
- Isolation over DRY — mỗi tính năng/khối lớp code/data riêng, chấp nhận trùng lặp.
- 4 tầng bắt buộc cho dạng bài Phiếu Bài Tập mới: catalog → generator → preview → xuất Word.
- Grep trước khi giả định phạm vi — luôn xác nhận số file/chỗ dùng thật qua code, tài liệu cũ có
  thể đã lệch so với code thật (đã xảy ra nhiều lần, xem `PROJECT_SUMMARY.md`).
- Stress-test generator bằng 200-500+ lần lặp trước khi báo xong — bắt được lỗi số liệu không
  tròn/không đa dạng mà đọc code không thấy.

---

## Chỉ 1 bộ SGK

Trường chỉ dùng **Kết nối tri thức với cuộc sống** — không cần hỗ trợ đa bộ sách.
