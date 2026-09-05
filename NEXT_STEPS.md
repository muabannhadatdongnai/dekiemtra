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
trong danh bạ `src/data/foreignLanguageSubjects.js`. Phiên 38: đã thêm CẤU HÌNH (chưa xong XUẤT
FILE Word/PDF) cho 3 môn Ngoại ngữ 2 mới - Tiếng Trung/Tiếng Nhật/Tiếng Pháp, Lớp 6-12 (THCS+THPT,
theo bộ Kết nối tri thức). Phiên 39: sửa regression 3 test THPT do Ngoại ngữ 2 gây ra (đã cập nhật
`thptSubjects.test.js`: 17 → 20 môn hợp lệ ở Lớp 10-12), và sửa "hạt sạn tiếng Việt" ở BẢN XEM
TRƯỚC WEB (Soạn Giáo Án) cho 3 môn này (`LABELS_ZH`/`LABELS_JA`/`LABELS_FR` mới - xem
`src/data/lessonPlanPreviewLabels.js`) - xem mục "🟡 Ngoại ngữ 2" bên dưới để biết chính xác phần
nào xong/chưa xong (XUẤT FILE Word/PDF vẫn CHƯA LÀM). Riêng phụ lục "Tin nhắn gửi phụ huynh (Zalo)"
ở Soạn Giáo Án và "Thư ngỏ gửi Phụ huynh" ở Đề Cương Ôn Tập (từ Phiên 37) LUÔN giữ tiếng Việt - đã
xác nhận áp dụng đúng cho CẢ Ngoại ngữ 2 (tiêu đề tĩnh ở Phiên 39, nội dung AI sinh vốn đã đúng từ
Phiên 37 nhờ cơ chế `exemptJsonFields` generic). Chi tiết đầy đủ từng module xem `README.md`.

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
| 17 | Test có sẵn `test/lessonPlanEnglishAudioIpa.test.js` đang FAIL (2/2 test) - tính năng chưa từng được cài đặt | Phát hiện khi chạy `npm test` ở Phiên 35 (KHÔNG liên quan tới thay đổi Phiên 35/36) - test kỳ vọng giáo án Tiếng Anh có gắn thẻ `[AUDIO: Track_XX]` + phiên âm IPA, nhưng không tìm thấy logic này ở bất kỳ đâu trong `src/` - có thể là tính năng đã lên kế hoạch (viết test trước) nhưng chưa merge phần cài đặt. Cần Hoan quyết định: cài đặt tính năng thật, hay xoá test nếu không còn cần. |
| 18 | Xác nhận lại việc sửa `<w:p>` lồng `<w:p>` (Phiên 37) đã LÊN THẬT trên Vercel chưa | Hoan gửi 1 file `.docx` "mới" (Lesson-Plan-EN-Lesson-1...) sau khi Claude báo đã sửa xong, nhưng validate lại vẫn thấy ĐÚNG lỗi cũ, ĐÚNG vị trí (bảng "Hết Tiết"). Claude đã build lại chính xác `englishLessonPlanExportService.js`/`foreignLanguageDocBuilder.js` TRONG zip Phiên 37 bằng docx.js thật + validate schema → xác nhận code trong zip KHÔNG còn lỗi. Kết luận: file Word đó vẫn được tạo bởi bản CHƯA deploy code Phiên 37. Hoan cần kiểm tra deployment trên Vercel (đúng commit/thư mục chứa comment `// ⚠️ FIX (Phiên 37)` ở dòng ~90 file đó chưa) rồi tạo lại file Word MỚI để test lại. |

---

## 🟡 Ngoại ngữ 2 (Tiếng Trung/Tiếng Nhật/Tiếng Pháp, Lớp 6-12) — bắt đầu Phiên 38, tầng cấu hình + bản xem trước web ĐÃ XONG (Phiên 39), tầng XUẤT FILE CHƯA XONG

**Yêu cầu Hoan (Phiên 38):** SGK Kết nối tri thức đã có Tiếng Trung/Tiếng Nhật/Tiếng Pháp làm
"Ngoại ngữ 2" cho THCS+THPT → thêm vào cả 3 tab Soạn Giáo Án/Đề Cương Ôn Tập/Tạo Đề Kiểm tra, giữ
nguyên tắc "chia luồng riêng theo môn/khối" (isolation), và AI phải sinh nội dung bằng ĐÚNG ngôn
ngữ riêng của từng môn (giống kiến trúc Tiếng Anh từ Phiên 35 - sinh trực tiếp, không dịch lại).

**✅ ĐÃ XONG ở Phiên 38 (tầng cấu hình + prompt - rủi ro thấp, đã kiểm chứng bằng script Node thật):**
- `config.js`: thêm 3 môn `Tieng_Trung`/`Tieng_Nhat`/`Tieng_Phap`, `minGrade: 6, maxGrade: 12`
  (CHỈ THCS+THPT, không áp dụng Tiểu học - khác `Tieng_Anh` là Ngoại ngữ 1 dạy từ Lớp 1), không
  giới hạn `modules` (mặc định hiện ở cả 3 tab, giống Tiếng Anh).
- `foreignLanguageSubjects.js`: thêm 3 entry vào `FOREIGN_LANGUAGE_SUBJECTS` (languageCode
  `zh`/`ja`/`fr`, `docLabel` bằng chính ngôn ngữ đó: 中文版本/日本語版/VERSION FRANÇAISE). Vì
  `buildForeignLanguageOutputDirective()` được gọi KHÔNG ĐIỀU KIỆN ở cả 3 file prompt
  (`promptTemplates.js`/`outlinePromptTemplates.js`/`lessonPlanPromptTemplates.js`), KHÔNG cần sửa
  gì thêm ở 3 file đó - chỉ cần thêm entry là AI đã tự động nhận chỉ thị sinh đúng ngôn ngữ.
- `subjectProfiles.js`: thêm 3 profile (`expertRole` + `extraRules` riêng biệt) - đã nghiên cứu kỹ
  đặc thù CHỮ VIẾT/NGỮ ÂM từng tiếng để AI sinh đúng chuẩn sư phạm Ngoại ngữ 2 (không chỉ dịch máy):
  - Tiếng Trung: bắt buộc chữ GIẢN THỂ + kèm PINYIN có dấu thanh điệu, giới hạn độ khó theo
    thang HSK 1 (Lớp 6-9) → HSK 2-3 (Lớp 10-12).
  - Tiếng Nhật: ưu tiên Hiragana/Katakana, Kanji phải có Furigana, kèm Rômaji, giới hạn ngữ pháp
    theo thang JLPT N5 (Lớp 6-9) → cận N4 (Lớp 10-12), chỉ dùng thể lịch sự です/ます giai đoạn đầu.
  - Tiếng Pháp: bắt buộc đủ dấu phụ (é/è/ê/ë/à/ù/â/î/ô/û/ç), tuân thủ hoà hợp giống-số, giới hạn
    thì theo trình độ (présent → passé composé/futur proche → imparfait/futur simple).
- Đã kiểm chứng bằng script Node thật (dựng từ đúng code trong `src/`, không viết tay mô phỏng):
  dropdown Lớp 6-12 hiện đủ 4 ngôn ngữ (Anh/Trung/Nhật/Pháp), Lớp 1-5 KHÔNG có 3 môn mới (đúng yêu
  cầu chỉ THCS+THPT), `getSubjectProfile()`/`findForeignLanguageConfig()`/
  `buildForeignLanguageOutputDirective()` đều trả đúng dữ liệu cho cả 3 môn mới.

**✅ ĐÃ XONG ở Phiên 39 (2 lỗi phát sinh từ việc thêm Ngoại ngữ 2 ở Phiên 38, phát hiện qua tự chạy
`npm test` thật trong repo + ảnh chụp màn hình Hoan gửi):**
- Regression 3 test `thptSubjects.test.js` (Lớp 10-12 có 20 môn thay vì 17 do Ngoại ngữ 2 không
  giới hạn `modules`) — đã cập nhật lại kỳ vọng test cho đúng ý đồ (17 chính thức + 3 Ngoại ngữ 2).
- Hạt sạn tiếng Việt ở BẢN XEM TRƯỚC WEB (Soạn Giáo Án) - `LessonPlanPreview.jsx` chỉ có
  `LABELS_VI`/`LABELS_EN`, 3 môn mới rơi về `LABELS_VI` — đã thêm `LABELS_ZH`/`LABELS_JA`/`LABELS_FR`
  (tách sang file mới `src/data/lessonPlanPreviewLabels.js` để test được bằng `node --test` thuần,
  không qua JSX) + đồng bộ nhãn hoạt động/nhãn "Khởi động lại"/nhãn STEM trong
  `lessonPlanTemplates.js`. Tiêu đề "PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)" cố ý giữ tiếng Việt ở
  cả 3 ngôn ngữ mới, đúng như English. Xem test bảo vệ mới
  `test/lessonPlanForeignLanguage2Labels.test.js` (24 test, pass).
- **CHƯA rà bởi người bản ngữ** — bản dịch tiếng Trung/Nhật/Pháp cho các nhãn này do Claude dịch,
  cùng mức độ tin cậy như phần dịch nhãn Word ở mục 2 bên dưới (cần Hoan nhờ người biết tiếng kiểm
  tra lại khi có dịp, không phải việc phải chặn triển khai vì đây chỉ là nhãn khung/tiêu đề, không
  phải nội dung sư phạm do AI sinh).
- **Phát hiện thêm, GHI NHẬN chứ CHƯA sửa** (Hoan chưa yêu cầu, ngoài phạm vi Phiên 39): Đề Cương
  Ôn Tập (`OutlinePreview.jsx`) và Đề Kiểm Tra (`VietnameseExamPreview.jsx`) hoàn toàn KHÔNG có xử
  lý theo `languageCode` ở bản xem trước - hiển thị nhãn tĩnh tiếng Việt cho MỌI môn kể cả Tiếng
  Anh (khoảng trống có sẵn từ Phiên 35-36, không phải lỗi riêng của Ngoại ngữ 2). Nếu Hoan muốn sửa
  đồng bộ cho cả 2 tab này (áp dụng cho cả Tiếng Anh lẫn Ngoại ngữ 2), cần làm ở phiên riêng vì khối
  lượng tương đương lần sửa `LessonPlanPreview.jsx` này nhân đôi (2 component, có thể còn nhiều nhãn
  tĩnh hơn do cấu trúc đề cương/đề kiểm tra phức tạp hơn giáo án).

**❌ CHƯA LÀM (phần XUẤT FILE Word/PDF - việc lớn nhất, cố ý CHƯA làm vội để tránh lặp lại đúng lỗi
schema `<w:p>` lồng `<w:p>` như Phiên 37 nếu làm ẩu/vội cho 3 ngôn ngữ cùng lúc):**

1. **Quyết định kiến trúc trước khi viết code (Hoan chọn 1 trong 2 hướng dưới, hoặc để Claude đề
   xuất ở phiên sau sau khi cân nhắc thêm):**
   - **Hướng A - nhân bản như Tiếng Anh (đúng "isolation" nguyên bản):** tạo MỚI hoàn toàn 9 file
     (`chineseLessonPlanExportService.js`, `chineseOutlineExportService.js`,
     `chineseSpecificationBuilder.js` + `chineseSpecificationExportBuilders.js`, và tương tự cho
     `japanese*`/`french*`) - mỗi file ~700 dòng, chép khuôn từ `english*.js` tương ứng rồi dịch
     TOÀN BỘ tiêu đề tĩnh ("LESSON PLAN" → "教案"/"学習指導案"/"FICHE PÉDAGOGIQUE"...). Rủi ro: nhân
     3 lần khối lượng code + nhân 3 lần khả năng lặp lại bug schema Word (VD lỗi `<w:p>` lồng
     `<w:p>` của Phiên 37) nếu chép tay không cẩn thận ở cả 3 bản.
   - **Hướng B - tách riêng "nhãn tĩnh" khỏi "khung dựng file" (khuyến nghị của Claude, giảm rủi ro
     lặp bug):** tạo 1 file `foreignLanguageStaticLabels.js` chứa object tra theo `languageCode`
     (vd `{ en: { LESSON_PLAN: "LESSON PLAN", OBJECTIVES: "I. LEARNING OBJECTIVES", ... }, zh: {...},
     ja: {...}, fr: {...} }`), rồi sửa `englishLessonPlanExportService.js`/
     `englishOutlineExportService.js`/`englishSpecification*.js` (ĐỔI TÊN thành
     `foreignLanguageLessonPlanExportService.js`... hoặc giữ tên cũ, nhận thêm tham số
     `languageCode`) để tra nhãn từ dictionary đó thay vì hard-code tiếng Anh - KHÔNG cần nhân bản
     700 dòng x3, và SỬA LOGIC DỰNG DOCX (`cell()`/`periodBoundaryTableRowEn()`...) CHỈ Ở 1 NƠI DUY
     NHẤT (tránh lặp lại đúng bug Phiên 37 ở 3 file khác nhau). Đánh đổi: đi ngược nguyên tắc
     "isolation over DRY" đã áp dụng nhất quán cho các tính năng khác - cần Hoan xác nhận có chấp
     nhận ngoại lệ này không (Claude cho rằng ĐÁNG đánh đổi ở riêng lớp "khung dựng file Word" vì
     đây thuần là hạ tầng kỹ thuật/schema OOXML, không phải nội dung sư phạm - khác với lý do
     "isolation" ban đầu là tránh 1 sửa đổi ảnh hưởng chéo nội dung sư phạm giữa các môn/khối).
2. Dịch chính xác toàn bộ nhãn tĩnh sang cả 3 ngôn ngữ (tiêu đề "LESSON PLAN"/"I. LEARNING
   OBJECTIVES"/"II. TEACHING AIDS"/"III. LEARNING ACTIVITIES"/"IV. POST-LESSON ADJUSTMENTS", các
   phụ lục "APPENDIX: ..."/"STEM GUIDE"/"Student Worksheet"/"Consolidation - Quick Questions"/
   "Mind Map", nhãn bảng 2 cột "Teacher & Student Activities"/"Expected Outcome", dòng "Hết Tiết"
   ("── End of Period X (break) — Move to Period Y ──")...) - CẦN người biết tiếng Trung/Nhật/Pháp
   rà lại bản dịch (Claude dịch được nhưng không thay thế người bản ngữ/giáo viên thật kiểm tra).
3. Sửa routing ở 3 component xuất file: `LessonPlanExportActions.jsx`/`OutlineExportActions.jsx`/
   `ExportActions.jsx` hiện gọi CỨNG `exportEnglishLessonPlanToWord`/`printEnglishLessonPlan`/...
   bất kể `languageCode` gì (viết từ Phiên 35 khi mới có 1 ngôn ngữ) - phải đổi sang tra theo
   `foreignLanguageConfig.languageCode` để gọi đúng service (hoặc đúng tham số nếu theo Hướng B).
   File đặt tên tải xuống (`Lesson-Plan-EN-...`) cũng cần đổi tiền tố theo ngôn ngữ (`Lesson-Plan-
   ZH-...`/`Lesson-Plan-JA-...`/`Lesson-Plan-FR-...`).
4. Tab Tạo Đề Kiểm tra còn cần xuất bảng ma trận/đặc tả đề (`englishSpecificationBuilder.js`/
   `englishSpecificationExportBuilders.js`) - cũng cần bản tương ứng 3 ngôn ngữ mới (hoặc theo
   Hướng B ở trên).
5. Kiểm thử BẮT BUỘC trước khi coi là xong (đúng bài học Phiên 37 - "well-formed XML" KHÔNG đồng
   nghĩa "Word mở được"): viết test mới kiểu `test/foreignLanguageExport.test.js` áp dụng cho cả 3
   ngôn ngữ, chạy `assertValidParagraphNesting()` (`test/wordSchemaAssertions.js`) trên
   `document.xml` thật của cả 9 tổ hợp (3 ngôn ngữ x 3 tab), thêm kịch bản vào
   `npm run test:word-compat`, và Hoan click-through + MỞ THẬT bằng Microsoft Word (không chỉ xem
   trước/PDF) cho ít nhất 1 giáo án/1 đề cương/1 đề kiểm tra mỗi ngôn ngữ trước khi coi là hoàn tất.
6. Dữ liệu SGK thật (kho GitHub kiến thức) cho 3 môn mới - dropdown "Chương" sẽ RỖNG tới khi có file
   `chuong_{n}.md` đúng cấu trúc thư mục hiện dùng cho Tiếng Anh/Toán/Tiếng Việt (việc này độc lập
   với phần code, Hoan có thể làm dần theo Chương, không cần xong hết cùng lúc với code).

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
