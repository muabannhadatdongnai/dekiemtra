# NEXT_STEPS.md — Việc đang dở dang + nguyên tắc bắt buộc phải nhớ

> File này CHỈ giữ thông tin còn TÁC DỤNG cho lần sửa tiếp theo — không phải nhật ký. Lịch sử đầy
> đủ từng phiên nằm ở `PROJECT_SUMMARY.md`. Khi 1 việc trong bảng dưới đã xong, XOÁ dòng đó khỏi
> bảng (đừng giữ lại "lịch sử đã xong" ở đây — chuyển 1 dòng tóm tắt sang `PROJECT_SUMMARY.md`).

**Trạng thái tổng quát:** 9 tab đang hoạt động (Soạn Giáo án, Phiếu Bài Tập, Đề Tiếng Việt Tiểu
học, Đề Cương Ôn Tập, Tạo Đề Kiểm Tra, Nhận Xét Học Bạ, Khung KHGD, Khung KHGD Tiểu học, Hướng dẫn
sử dụng). Soạn Giáo án/Đề Cương
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
| 16 | Kiểm tra thật trên trình duyệt việc AI sinh trực tiếp tiếng Anh (Soạn Giáo Án/Đề Cương Ôn Tập/Đề Kiểm tra, môn Tiếng Anh) | Phiên 35: đã đổi kiến trúc (sinh thẳng tiếng Anh, bỏ bước dịch); Phiên 36: đã SỬA 2 lỗi (hạt sạn tiếng Việt trong tên hoạt động; nút In/Tải PDF báo lỗi popup); Phiên 37: đã SỬA 2 lỗi tiếp theo phát hiện qua file `.docx` lỗi thật Hoan gửi (file Word tiếng Anh Soạn Giáo Án không mở được do `<w:p>` lồng `<w:p>` ở bảng "Hết Tiết"; "Thư ngỏ gửi Phụ huynh" Đề Cương Ôn Tập bị dịch nhầm sang tiếng Anh) — Phiên 43: Hoan đã XÁC NHẬN mở được file Word thật bằng Microsoft Word, bản deploy Vercel đã lên đúng code fix. Phần CÒN LẠI: vẫn CHƯA test thật với Gemini API key thật (sandbox không có `GEMINI_API_KEYS`) để xác nhận AI TUÂN THỦ chỉ thị `buildForeignLanguageOutputDirective()` với nội dung bài học thật (không chỉ cấu trúc/tên hoạt động).
| 17 | Cân nhắc thêm dòng disclaimer "Nội dung do AI tạo, giáo viên cần kiểm tra lại" lên UI | Phiên 44: Luật Trí tuệ nhân tạo 2025 (số 134/2025/QH15, hiệu lực 1/3/2026) yêu cầu nhà cung cấp dịch vụ AI có cơ chế để người dùng nhận biết đang tương tác với AI (Điều 11) - dự án vốn đã tên là công cụ AI + có nút "Sinh bằng AI" rõ ràng nên có thể đã đủ, nhưng đây là luật rất mới và Claude không phải luật sư nên không tự ý thêm/diễn giải - Hoan tự cân nhắc có cần bổ sung disclaimer rõ hơn hay không.
| 18 | Brainstorm sáng tạo/đổi mới cấu trúc ra đề, soạn bài (nếu Hoan vẫn muốn) | Phiên 44: Hoan có nhắc tới "sự sáng tạo, đổi mới trong cấu trúc ra đề, soạn bài" khi yêu cầu rà soát pháp lý, nhưng lượt trả lời gần nhất tập trung vào phần pháp lý/chuẩn mực trước - phần brainstorm cấu trúc mới CHƯA làm, cần Hoan nói rõ muốn đổi mới cho môn/dạng bài cụ thể nào ở phiên sau.
| 19 | Khung KHGD (Phụ lục III): tạo dữ liệu SGK thật cho các môn/khối chưa có trong kho GitHub kiến thức | Phiên 46: đã tạo sẵn bộ mẫu THẬT cho Tiếng Anh Lớp 7 (12 Unit × .md + .json, lấy tên bài từ chính PPCT Hoan gửi Phiên 44) tại `docs/khgd-sample-data/` — Hoan tự copy vào kho GitHub riêng theo hướng dẫn trong `docs/khgd-sample-data/README.md`. Các môn/khối KHÁC vẫn CHƯA có — nút "Nạp gợi ý tên bài từ SGK" chỉ báo "chưa có gợi ý sẵn", giáo viên vẫn tạo được bình thường bằng cách tự gõ tay (KHÔNG bị chặn tính năng). Muốn có thêm môn/khối nào, gửi PPCT/mục lục SGK thật cho Claude ở phiên sau (KHÔNG tự bịa tên bài khi chưa có nguồn). |
| 20 | Khung KHGD: CHƯA test thật với Gemini API key thật | Sandbox không có `GEMINI_API_KEYS` — mới xác nhận được: build sạch (`next build`), 455/455 `npm test` pass, và LibreOffice mở được cả 2 file `.docx` xuất ra (script `check-word-compatibility.mjs`, entry `khung-khgd-phu-luc-3` + `khung-khgd-tieu-hoc-phu-luc-2`, 20/20 kịch bản OK). CHƯA xác nhận AI thật trả JSON đúng schema + văn phong SWD/NLS/"Nội dung điều chỉnh" giống bản mẫu Bộ GDĐT với môn/bài học thật. |
| 21 | Khung KHGD: mở rộng sang Tiểu học | ✅ ĐÃ LÀM ở Phiên 47, ĐÃ SỬA lỗi thực tế ở Phiên 48 (cột Tuần bị bỏ trống + thiếu định dạng) sau khi Hoan test file Word thật — xem mục #23/#24 (nay đã đóng) và section "🟢 Khung KHGD - Tiểu học" bên dưới. |
| 22 | Khung KHGD: chưa hỗ trợ "In/Tải PDF" trực tiếp từ trình duyệt | Cố ý bỏ qua ở Phiên 45 vì khổ A4 NGANG (297x210mm) xung đột với rule `@page` toàn cục (khổ dọc, dùng chung `id="print-area"` với 6 tab kia — xem giải thích trong `globals.css`/`KhgdPreview.jsx`). Áp dụng cho CẢ 2 tab Khung KHGD (THCS/THPT lẫn Tiểu học) — hiện chỉ có nút "Tải Word" (đã đúng khổ ngang, sẵn sàng in trực tiếp từ Word).
| 23 | ~~Khung KHGD Tiểu học: chưa có bảng "Kiểm tra, đánh giá định kỳ"~~ | Vẫn CHƯA làm — cần Hoan gửi mẫu thật nếu trường có bảng tương ứng, tránh tự bịa cấu trúc (không phải lỗi, chỉ là tính năng chưa làm). |
| 24 | ~~Khung KHGD Tiểu học: cột "Chủ đề" chưa gộp ô~~ | ✅ ĐÃ SỬA Phiên 48 — cả cột "Tuần" lẫn "Chủ đề" nay đều GỘP Ô (rowSpan) cho các dòng liên tiếp cùng giá trị, đúng bản mẫu tham khảo Hoan gửi ảnh chụp — xem `computeMergeInfo()` trong `khgdTieuHocExportService.js`/`KhgdTieuHocPreview.jsx`. |
| 25 | Khung KHGD Tiểu học: môn Âm nhạc/Mĩ thuật/GDTC/HĐTN chưa có trong `config.js` cho Lớp 1-5 | Phát hiện ở Phiên 47 khi đối chiếu `getSubjectsForGrade()` — các môn này hiện chỉ khai báo `minGrade: 6` (THCS trở lên) dù thực tế Tiểu học cũng dạy. Đây là gap CÓ SẴN TỪ TRƯỚC (không phải lỗi mới của Khung KHGD), ảnh hưởng CẢ 3 tab khác (Soạn giáo án/Đề cương/Đề kiểm tra) nếu chọn Tiểu học + 1 trong 4 môn này — CHƯA sửa vì ngoài phạm vi yêu cầu Phiên 47, cần Hoan xác nhận trước khi đụng vào `config.js` (ảnh hưởng nhiều tab cùng lúc).
| 26 | Khung KHGD Tiểu học: "Số tiết/tuần" mặc định cứng 10, có thể sai với môn/khối khác | Phiên 48: thêm ô "Số tiết/tuần" ở `KhgdTieuHocForm.jsx` để tự tính cột Tuần/Ghi chú (mặc định 10, đúng Tiếng Việt Lớp 2 KNTT: 350 tiết/35 tuần) — giáo viên PHẢI tự đổi số này cho đúng môn/khối khác (VD Toán Lớp 2 thường 5 tiết/tuần) TRƯỚC KHI nhập bảng, vì đổi số sau khi đã nhập sẽ tính lại TOÀN BỘ bảng (ghi đè mọi chỉnh sửa tay ở cột Tuần/Ghi chú trước đó). Chưa có cơ chế tự nhận diện số tiết/tuần theo môn — để giáo viên tự nhập cho linh hoạt.

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

## 🟢 Khung KHGD — Tiểu học — Phụ lục 2 (CV 2345/2021/BGDĐT-GDTH) — Phiên 47, sửa lỗi thật ở Phiên 48

**Cập nhật Phiên 48:** Hoan tự test tab này (tạo file Word thật + chụp ảnh 1 mẫu KHGD Tiểu học
khác tham khảo từ giáo viên) và phát hiện 3 vấn đề: (1) cột "Tuần" bị bỏ trống hoàn toàn — thiết
kế cũ để giáo viên gõ tay nhưng không ai gõ; (2) cột cuối đặt tên "Tiết PPCT" thay vì đúng "Ghi
chú" như bản mẫu thật; (3) bảng xuất Word "quá sơ sài" — thiếu tô nền tiêu đề + không gộp ô
Tuần/Chủ đề như bản mẫu tham khảo. ĐÃ SỬA CẢ 3:
- `KhgdTieuHocForm.jsx`: thêm ô "Số tiết/tuần" (mặc định 10, đúng Tiếng Việt Lớp 2 KNTT) —
  `recomputeTietPPCT()` giờ tự tính CẢ "Tuần" (`Tuần ${Math.ceil(tietPPCT / tietPerWeek)}`) lẫn
  "Ghi chú" (tiết PPCT chạy suốt năm), không còn bắt giáo viên gõ tay từng dòng. Đổi "Số tiết/tuần"
  sẽ tính lại TOÀN BỘ bảng (ghi đè sửa tay trước đó — đánh đổi chấp nhận được, xem mục #26 bảng
  trên).
- `khgdTieuHocExportService.js` + `KhgdTieuHocPreview.jsx`: đổi nhãn cột cuối thành "Ghi chú";
  thêm `computeMergeInfo()` GỘP Ô (rowSpan/HTML rowSpan) cho "Tuần" và "Chủ đề" khi nhiều dòng
  liên tiếp cùng giá trị (CHỈ gộp giá trị không rỗng, tránh gộp nhầm các dòng trống thành 1 ô to);
  thêm tô nền tiêu đề (`shading: { fill: "E5E7EB" }` — bị THIẾU ở bản Phiên 47, một oversight khi
  copy code từ `khgdExportService.js` sang) + margin trong ô cho dễ đọc hơn.
- Đã TEST TRỰC QUAN bằng LibreOffice thật (convert .docx -> .pdf -> .png, xem ảnh render) trước
  khi giao — xác nhận gộp ô hiển thị đúng, không lỗi layout.


**Yêu cầu Hoan:** gửi file mẫu thật "KHDH CÁC MÔN LỚP 2-KNTT" (Kế hoạch dạy học môn Tiếng Việt,
Lớp 2, sách Kết nối tri thức) để đối chiếu trước khi mở rộng Khung KHGD sang Tiểu học — ĐÚNG tinh
thần đã cam kết ở Phiên 46 (không tự dựng mẫu theo suy đoán cho hồ sơ chuyên môn thật).

**Phát hiện quan trọng khi đối chiếu (đã hỏi lại Hoan qua 3 câu hỏi trước khi code, Hoan trả lời
"tiếp tục" — nghĩa là đồng ý để Claude tự chọn phương án AN TOÀN NHẤT/sát mẫu thật nhất):**
Mẫu Tiểu học (Phụ lục 2, CV2345) **KHÁC HẲN** Phụ lục III (THCS/THPT, CV5512) đang có:
- Cột bảng: **Tuần, tháng | Chủ đề/Mạch nội dung | Tên bài | Tiết học/Thời lượng | Tiết PPCT |
  Nội dung điều chỉnh cần thiết (nếu có)** — hoàn toàn KHÔNG có Thiết bị dạy học/Địa điểm dạy
  học/cột SWD/cột NLS riêng như THCS.
- "Tiết PPCT": dãy số chạy suốt cả năm (1→350 với Tiếng Việt Lớp 2) — xác nhận khớp đúng tổng số
  tiết cả năm, đã cài đặt **tự động tính cộng dồn** theo "Số tiết" từng dòng ở `KhgdTieuHocForm.jsx`
  (giáo viên vẫn sửa tay được nếu cần).
- CHỈ 1 công tắc lồng ghép DUY NHẤT ("Nội dung điều chỉnh cần thiết") gộp MỌI loại tích hợp (GD
  KNS, GDĐP, GD bảo vệ môi trường, Tích hợp tư tưởng HCM, GD kĩ năng công dân số, Quyền con người,
  GDQPAN, liên môn...) — KHÁC THCS tách riêng SWD/NLS thành 2 công tắc.
- KHÔNG có bảng "Kiểm tra, đánh giá định kỳ" trong mẫu thật đã đối chiếu — CỐ Ý bỏ qua bảng này ở
  Phiên 47 (xem mục #23 bảng trên), Tiểu học đánh giá theo Thông tư 27, khác hẳn kiểu THCS/THPT.

**Kiến trúc:** tách **tab RIÊNG HOÀN TOÀN** `MODES.KHGD_TIEU_HOC` ("🧒 Khung KHGD (Tiểu học)"),
KHÔNG dùng chung bất kỳ file nào với tab `MODES.KHGD` (THCS/THPT) ngoài 2 hằng số khổ giấy
(`PAGE_A4_LANDSCAPE_MM`/`PAGE_LANDSCAPE_MARGIN_MM`, constants.js) và class CSS `.khgd-a4-page`
(globals.css) — đúng nguyên tắc "mỗi cấp 1 router riêng" đã thống nhất từ đầu dự án. File mới:
`khgdTieuHocBlueprint.js`, `khgdTieuHocResult.js`, `khgdTieuHocPromptTemplates.js`,
`khgdTieuHocEngine.js`, `khgdTieuHocOrchestrator.js`, `khgdTieuHocExportService.js`,
`app/api/generate-khgd-tieu-hoc/route.js`, `KhgdTieuHocForm.jsx`, `KhgdTieuHocPreview.jsx`,
`KhgdTieuHocExportActions.jsx`, `test/khgdTieuHocExportService.test.js`. Sửa thêm:
`contentGenerationLimits.js` (`clampKhgdTieuHocLessons`, trần 200 bài/lượt — cao hơn THCS vì
Tiểu học có nhiều tiết/năm hơn), `apiClient.js` (`generateKhgdTieuHocRequest`), `page.js` (tab
mới). Subject/grade dùng THẲNG `getSubjectsForGrade(grade)` có sẵn (Lớp 1-5: Tiếng Việt, Toán,
Đạo đức, Tiếng Anh, Tự nhiên và Xã hội, Lịch sử và Địa lí, Khoa học, Tin học, Công nghệ) — không
cần data mới, nhưng phát hiện gap có sẵn (mục #25 bảng trên: thiếu Âm nhạc/Mĩ thuật/GDTC/HĐTN cho
Tiểu học trong `config.js`).

**✅ ĐÃ XÁC NHẬN Ở PHIÊN 47:** `next build` sạch; `npm test` 455/455 pass (3 test mới
`khgdTieuHocExportService.test.js`); LibreOffice headless mở được **CẢ 2** file `.docx` (THCS/THPT
+ Tiểu học), 20/20 kịch bản `check-word-compatibility.mjs` OK — kịch bản Tiểu học dùng dữ liệu
THẬT trích từ file mẫu Hoan gửi (Tuần 1, chủ đề "Em lớn lên từng ngày").

**❌ CHƯA LÀM:** xem mục #23-25 ở bảng "🔴 CẦN HOAN QUYẾT ĐỊNH" phía trên (bảng Kiểm tra định kỳ,
gộp ô "Chủ đề", gap môn Âm nhạc/Mĩ thuật/GDTC/HĐTN Tiểu học trong `config.js`).

---

## 🟢 Khung KHGD — Phụ lục III (CV 5512/BGDĐT-GDTrH) — Phiên 45 (THCS), mở rộng THPT ở Phiên 46

**Cập nhật Phiên 46:** đã mở rộng sang **THPT (Lớp 10-12)** — CV5512/BGDĐT-GDTrH áp dụng CHUNG cho
GDTrH (gồm cả THCS+THPT), Phụ lục III KHÔNG đổi cấu trúc giữa 2 cấp, nên chỉ cần mở dải khối
(`KHGD_GRADES` trong `KhgdForm.jsx`, nay là `[6,7,8,9,10,11,12]`) + bổ sung 7 entry môn CHỈ có ở
THPT vào `khgdSubjectDefaults.js` (Lịch sử, Vật lí, Hoá học, Sinh học, Địa lí, GDKT&PL, GDQPAN) —
KHÔNG cần sửa export/preview/prompt vì kiến trúc vốn đã dùng chung `getSubjectsForGrade(grade)`.
Đã ĐỐI CHIẾU/XÁC NHẬN Tiểu học KHÔNG dùng được kiến trúc này (dùng CV2345/2021, Phụ lục 2 hoàn
toàn khác) — xem mục #21, `NEXT_STEPS.md`, CẦN Hoan gửi mẫu thật trước khi làm.

**Yêu cầu Hoan (Phiên 45):** thêm 1 tab riêng soạn "Khung Kế hoạch giáo dục của giáo viên" (Phụ
lục III, CV 5512) — bảng Phân phối chương trình có lồng ghép SWD (giáo dục học sinh khuyết tật) +
Biểu hiện Năng lực số (NLS), cùng bảng Kiểm tra đánh giá định kỳ, khổ giấy A4 NGANG. Đã chốt 3
quyết định trước khi code: (1) tên bài lấy gợi ý từ kho GitHub có sẵn, AI CHỈ soạn SWD/NLS; (2)
làm luôn cho TẤT CẢ môn THCS ngay từ đợt 1 (không chỉ 1 môn mẫu); (3) 2 công tắc lồng ghép SWD/NLS
bật/tắt riêng theo TỪNG LOẠI (không phải bật/tắt từng dòng bài học).

**⚠️ QUYẾT ĐỊNH QUAN TRỌNG NHẤT (khác mọi tab khác trong app): Số tiết + Thời điểm (tuần) của MỖI
bài học do GIÁO VIÊN TỰ GÕ TAY, AI KHÔNG ĐƯỢC PHÉP TỰ TÍNH/ĐOÁN** — vì mỗi trường/giáo viên phân
phối chương trình khác nhau. `khgdPromptTemplates.js` chỉ gửi lên AI: tên bài + số tiết ĐÃ CÓ (chỉ
để AI hiểu ngữ cảnh viết SWD phù hợp độ dài bài), và CHỈ yêu cầu AI trả về đúng 2 trường
`swd`/`nls` khớp lại theo `id` — `khgdResult.js:buildKhgdResult()` LUÔN giữ nguyên
tenBai/soTiet/tuan/thietBi/diaDiem gốc do giáo viên nhập, không cho phép AI ghi đè.

**Kiến trúc (đọc file nào trước khi sửa gì):**
- `src/data/khgdBlueprint.js` — shape dữ liệu gửi lên `/api/generate-khgd`.
- `src/data/khgdResult.js` — gộp kết quả AI vào ĐÚNG danh sách bài gốc (khớp theo `id`).
- `src/data/khgdSubjectDefaults.js` — Thiết bị dạy học/Địa điểm GỢI Ý theo từng môn (chỉ pre-fill
  form, không gửi AI) — mỗi môn 1 entry riêng, dễ sửa từng môn độc lập (đúng "Isolation over
  DRY"), THIẾU môn nào cứ thêm entry mới, không cần sửa hàm chung.
- `src/services/khgdPromptTemplates.js` + `khgdEngine.js` + `khgdOrchestrator.js` — lớp AI, tái
  dùng `getSubjectProfile()` (subjectProfiles.js, lấy `expertRole`) và
  `buildForeignLanguageOutputDirective()` (foreignLanguageSubjects.js, môn Tiếng Anh/Trung/Nhật/
  Pháp viết "swd" bằng CHÍNH ngôn ngữ đó, "nls" LUÔN tiếng Việt qua `exemptJsonFields: ["nls"]`).
- `src/app/api/generate-khgd/route.js` — có `clampKhgdLessons()` (contentGenerationLimits.js,
  trần mặc định 80 bài/lượt, đổi qua env `KHGD_MAX_LESSONS`) chặn client gửi danh sách khổng lồ.
- `src/services/khgdExportService.js` — DÙNG CHUNG 1 bộ xuất Word cho MỌI môn (khác
  `foreignLanguageExportRegistry.js` tách theo ngôn ngữ) vì bố cục Phụ lục III giống hệt nhau theo
  CV 5512 bất kể môn học — chỉ NỘI DUNG khác theo môn. Khổ A4 NGANG
  (`PAGE_A4_LANDSCAPE_MM`/`PAGE_LANDSCAPE_MARGIN_MM`, constants.js) — ĐÃ test bằng LibreOffice
  headless thật (`scripts/check-word-compatibility.mjs`, entry `khung-khgd-phu-luc-3`), mở được,
  ra đúng số trang.
- `src/components/KhgdForm.jsx`/`KhgdPreview.jsx`/`KhgdExportActions.jsx` — form nhập bảng bài học
  (nút "Nạp gợi ý tên bài từ SGK" tái dùng `/api/lessons` có sẵn, giống LessonPlanForm.jsx) + bản
  xem trước web + xuất Word. `.khgd-a4-page` (globals.css) là class CSS RIÊNG (khổ ngang), CỐ Ý
  KHÔNG dùng `id="print-area"` — xem mục #22 ở bảng "CẦN HOAN QUYẾT ĐỊNH" phía trên (chưa hỗ trợ
  In/Tải PDF trình duyệt, chỉ có "Tải Word").

**✅ ĐÃ XÁC NHẬN Ở PHIÊN 45:** `next build` sạch; `npm test` 452/452 pass (thêm mới 3 test ở
`test/khgdExportService.test.js`); LibreOffice headless mở được file `.docx` xuất ra, convert PDF
2 trang không lỗi.

**❌ CHƯA LÀM / CẦN HOAN XÁC NHẬN TIẾP:** xem mục #19-22 ở bảng "🔴 CẦN HOAN QUYẾT ĐỊNH" phía trên
(dữ liệu SGK GitHub cho môn chưa có, test AI thật, mở rộng Tiểu học/THPT, hỗ trợ PDF/in trình
duyệt).

---



## 🟢 Phiếu Bài Tập Toán Lớp 4-5 — "Ôn tập số tự nhiên" + gói chủ đề (Phiên 42)

Phản hồi Hoan qua file `.docx` thật (Phiên 41): (1) Bài "so sánh độ dài" hiện nền đen trong Word
thật dù PDF vẫn ổn, (2) Bài "xem đồng hồ" không thấy kim bằng mắt thường, (3) đối chiếu 2 PDF mẫu
SGK Toán 4-5 KNTT phát hiện catalog thiếu hẳn mảng "Ôn tập đầu năm" (Bài 1 mọi SGK), (4) khung chọn
bài Lớp 4/5 "cứng nhắc" vì chưa có gói chủ đề. Đã xử lý cả 4:

1. **Sửa "so sánh độ dài" (Bài 7):** thay 1 ảnh 40×40 bị co giãn PHI TỈ LỆ (`transformation`
   16:1 với thanh 20cm) bằng LẶP LẠI ảnh gốc N lần, mỗi ảnh giữ ĐÚNG tỉ lệ vuông gốc — không còn
   phụ thuộc hành vi co giãn cực đoan của Word thật. Xem `lengthBarImageRuns()` trong
   `worksheetExportService.js`.
2. **Sửa "xem đồng hồ giờ đúng" (Bài 12):** thay emoji Unicode 🕐-🕛 (kim mờ, phụ thuộc font máy)
   bằng 12 ảnh PNG rasterize đúng hình học `ClockFace` (bản web) — xem
   `scripts/render-clock-face-pngs.js` + `src/data/clockFacePngs.js` (chạy lại script này nếu cần
   đổi hình học đồng hồ, ĐỪNG sửa tay file PNG base64).
3. **Thêm hàm `docSoTuNhien()`** (`numberFormatUtils.js`) — đọc số tự nhiên thành chữ, đã đối
   chiếu khớp 100% với ví dụ thật trong SGK (test `worksheetOnTapSoTuNhienPhien42.test.js`). Đây
   là tiện ích còn thiếu đã ghi nhận từ Phiên 41.
4. **Thêm 2 dạng bài mới** (Lớp 4-5): `cau_tao_so` (đọc/viết số + phân tích cấu tạo hàng) và
   `trac_nghiem_so_tu_nhien` (trắc nghiệm A/B/C/D: làm tròn, so sánh, giá trị chữ số theo hàng, số
   liền trước/sau) — đủ 4 tầng catalog → generator → preview → xuất Word. Lớp 4 dùng số 5 chữ số
   (đến 100 000), Lớp 5 dùng 6-8 chữ số (đến hàng chục triệu — SỬA 1 giả định cũ trong
   `worksheetSchemas.js` tưởng Lớp 5 không cần số tự nhiên lớn hơn Lớp 4, sai với phần "ôn tập đầu
   năm").
5. **Thêm 9 gói chủ đề** (`worksheetTopicPackages.js`): 3 gói Lớp 4, 6 gói Lớp 5 — trước Phiên 42
   CHỈ Lớp 1/3 có gói, Lớp 4/5 giáo viên phải tự bật rời rạc từng dòng.

Đã build docx thật + convert PDF (LibreOffice) xác nhận trực quan cả 5 mục trên đúng như kỳ vọng,
và `npm test`: 449/449 pass (thêm 13 test mới, không vỡ test cũ nào).

**Còn tồn đọng:** chưa mở bằng Microsoft Word thật (chỉ LibreOffice) để xác nhận 100% hết lỗi
"nền đen"/"kim mờ" gốc; layout `trac_nghiem_so_tu_nhien` trong Word hiện 4 lựa chọn trên 1 dòng
(khác bản web 2x2) — CHỦ Ý (đỡ tốn giấy in) nhưng Hoan nên xem thử có ổn không.

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
