# PROJECT_SUMMARY.md — Lịch sử phát triển (rút gọn)

> File này là **changelog cô đọng**, không phải nhật ký chi tiết từng dòng code. Mỗi mục chỉ giữ:
> làm gì, vì sao (nếu là sửa lỗi thật), kết quả kiểm thử. Việc CÒN TỒN ĐỌNG nằm ở `NEXT_STEPS.md`,
> không lặp lại ở đây. Bản đầy đủ 3141 dòng trước khi rút gọn vẫn còn trong lịch sử Git nếu cần
> tra cứu chi tiết kỹ thuật (cách sửa từng dòng, số liệu debug đầy đủ).

## Phiên 34 — "Bản ngoại ngữ" (Tiếng Anh) cho Soạn Giáo Án + Đề Cương Ôn Tập + Đề Kiểm tra

Thêm nút "🇬🇧 Bản tiếng Anh" (Word + PDF, HOÀN TOÀN bằng tiếng Anh) ở 3 tab, chỉ hiện khi môn học
đang chọn là Tiếng Anh — song song, KHÔNG thay thế bản Word/PDF tiếng Việt gốc (giữ nguyên vẹn,
không sửa 1 dòng nào ở `lessonPlanExportService.js`/`outlineExportService.js`/`exportService.js`).

**Quyết định kiến trúc:** dịch NGUYÊN KHỐI JSON nội dung đã tạo sẵn bằng tiếng Việt sang tiếng Anh
(qua Gemini, giữ nguyên cấu trúc/khoá) thay vì sinh lại nội dung từ đầu bằng 1 lượt AI riêng — đảm
bảo bản Anh/Việt khớp 1-1 nội dung, và không phải viết lại 3 prompt sinh nội dung vốn đã gắn chặt
Thông tư/Công văn tiếng Việt. 1 route API dùng chung (`/api/translate-foreign-language`) + 1 prompt
dịch dùng chung (`foreignLanguagePromptTemplates.js`) cho cả 3 tab.

**Thiết kế MỞ RỘNG được (yêu cầu gốc: "còn có Tiếng Trung, Tiếng Pháp..."):** toàn bộ hệ thống đọc
cấu hình ngôn ngữ từ 1 danh bạ DUY NHẤT `src/data/foreignLanguageSubjects.js` — thêm ngôn ngữ mới
sau này CHỈ cần thêm 1 entry vào danh bạ, không sửa service/component nào khác (translation engine,
prompt, doc builder đều tổng quát theo `languageNameEn`, không hard-code "English"/"tiếng Anh").

**PDF không dùng chung `#print-area`:** mỗi trang Preview tiếng Việt (Lesson Plan/Outline/Exam) đã
tự chiếm `id="print-area"` cho bản xem trước đang hiển thị — không thể gắn thêm 1 khung ẩn thứ 2
cùng id (sẽ hiện cả 2 khi in, đúng vấn đề ReportCommentPdfView.jsx từng tránh bằng cách KHÔNG gắn
`#print-area` lên preview chính). Giải pháp: "Bản ngoại ngữ" tự mở 1 CỬA SỔ TRÌNH DUYỆT MỚI với
HTML/CSS in ấn độc lập rồi tự `window.print()` trong cửa sổ đó (`printHtmlDocument()` trong
`foreignLanguageDocBuilder.js`) — tách biệt hoàn toàn, không đụng luồng PDF tiếng Việt hiện có.

**File mới:** `foreignLanguageSubjects.js` (danh bạ), `foreignLanguagePromptTemplates.js` (prompt
dịch dùng chung), `foreignLanguageTranslationEngine.js` (gọi Gemini, retry theo khuôn
`lessonPlanEngine.js`), `foreignLanguageOrchestrator.js`, `api/translate-foreign-language/route.js`,
`foreignLanguageDocBuilder.js` (helper docx/PDF dùng chung), `englishLessonPlanExportService.js`,
`englishOutlineExportService.js`, `englishExamExportService.js`, `ForeignLanguageExportButton.jsx`
(nút dùng chung, tự ẩn nếu môn không hỗ trợ). Nối vào `LessonPlanExportActions.jsx`/
`OutlineExportActions.jsx`/`ExportActions.jsx` + thêm `translateForeignLanguageRequest()` vào
`apiClient.js`.

**Kiểm thử:** `test/foreignLanguageExport.test.js` (11 test: danh bạ tra cứu theo cả giá trị thô
lẫn nhãn hiển thị — vì Soạn Giáo Án/Đề Cương lưu `meta.subject` khác định dạng với Đề Kiểm tra; nội
dung prompt dịch; 3 hàm dựng .docx đọc lại XML thật qua JSZip, xác nhận đủ mọi mục + tiêu đề tiếng
Anh + phân biệt đúng bản Học sinh/Giáo viên ở Đề Kiểm tra). `npm test`: 365/367 pass (2 fail còn
lại thuộc `lessonPlanEnglishAudioIpa.test.js`, KHÔNG liên quan — đã tồn tại từ trước, không đụng
tới ở phiên này). `npm run build`: sạch, exit 0, route `/api/translate-foreign-language` lên đúng.

**Chưa làm (xem `NEXT_STEPS.md` #16):** chưa test thật với Gemini API key thật (sandbox không có
`GEMINI_API_KEYS`) và chưa test thật hành vi mở popup cửa sổ PDF trên trình duyệt thật.

---

## Phiên 33 — Mở rộng THPT (Lớp 10-12) cho Soạn giáo án + Đề cương Ôn tập + Đề kiểm tra
Tiếp nối Phiên 32 (THCS). Tra cứu lại Thông tư 32/2018 (Mục "Giai đoạn định hướng nghề nghiệp"),
Thông tư 13/2022 (Lịch sử chuyển thành môn BẮT BUỘC, không còn là môn lựa chọn KHXH), và Thông tư
22/2021 Điều 5 (xác nhận GDQP&AN CÓ điểm số, KHÔNG thuộc nhóm "chỉ nhận xét" - khác GDTC/Nghệ
thuật/HĐTN-HN/Nội dung GD địa phương).

**Quyết định kiến trúc quan trọng nhất:** THPT có cơ cấu "8 môn/HĐGD bắt buộc + chọn tối thiểu 4
trong 9 môn lựa chọn theo định hướng nghề nghiệp" — nhưng cơ cấu này chỉ ảnh hưởng THỜI KHOÁ BIỂU
nhà trường/học sinh (môn nào ĐƯỢC HỌC), KHÔNG ảnh hưởng luồng công cụ (giáo viên soạn 1 môn/1 lúc).
Vì vậy KHÔNG cần dựng UI "chọn tổ hợp 4/9 môn" như ghi chú cũ ở `NEXT_STEPS.md` #12 dự tính — chỉ
cần khai báo đủ cả 17 môn/HĐGD (8 + 9) làm 17 lựa chọn riêng trong dropdown "Môn học" y hệt Tiểu
học/THCS đang làm, dùng lại đúng `getSubjectsForGrade()` sẵn có.

**`config.js`:** thêm 6 môn hoàn toàn mới (Vật lí, Hoá học, Sinh học, Địa lí, Giáo dục kinh tế và
pháp luật, Giáo dục quốc phòng và an ninh - đều `minGrade:10, maxGrade:12`) + mở rộng `maxGrade`
lên 12 cho 7 môn tái dùng được từ THCS (Tin học, Công nghệ, Âm nhạc, Mĩ thuật, Ngữ văn, Giáo dục
thể chất, Hoạt động trải nghiệm-hướng nghiệp). Bổ sung "Nội dung giáo dục của địa phương"
(`minGrade:6, maxGrade:12`, nhận xét-only) - phát hiện THCS (Phiên 32) bị BỎ SÓT môn này dù Thông
tư 32 yêu cầu bắt buộc cả 2 cấp, tiện sửa luôn. Kết quả: `getSubjectsForGrade(10-12, LESSON_PLAN)`
trả về đúng 17 môn/HĐGD (8 bắt buộc + 9 lựa chọn), `getSubjectsForGrade(10-12, EXAM)` trả về 11
môn có điểm số (loại 6 môn nhận xét-only).

**`subjectProfiles.js`:** thêm 6 profile mới cho môn THPT, mở rộng ghi chú "ĐỘ SÂU KIẾN THỨC THEO
KHỐI" cho 7 profile tái dùng (VD Tin học THPT tách 2 định hướng "Tin học ứng dụng"/"Khoa học máy
tính", Công nghệ THPT tách "Công nghệ công nghiệp"/"Công nghệ nông nghiệp").

**Sửa lỗi rò rỉ dữ liệu phát hiện khi mở rộng (`gradeProfiles.js`):** `buildBaseRules()` ở
`promptTemplates.js` ghép field `guidance` của `gradeProfiles.js` KHÔNG ĐIỀU KIỆN vào prompt của
MỌI môn học khi tạo đề kiểm tra — bản cũ của `guidance` lại viết theo CHỦ ĐỀ TOÁN cụ thể ("có thể
dùng đạo hàm", "tập hợp, lượng giác"...). Vô hại khi hệ thống ít môn, nhưng sẽ SAI HẲN khi thêm 6
môn THPT mới (VD đề Sinh học Lớp 11 sẽ bị nhét nhầm dòng "có thể dùng đạo hàm cơ bản"). Sửa tại
gốc: chuyển toàn bộ ghi chú độ sâu Toán theo khối (Lớp 1-12) vào ĐÚNG `subjectProfiles.js` (đúng
nguyên tắc "môn nào lo môn nấy" đã áp dụng cho các môn khác), `gradeProfiles.js` giờ chỉ giữ phần
TRUNG LẬP theo khối (mức độ nhận thức/độ phức tạp bối cảnh chung, không nhắc chủ đề học thuật cụ
thể của bất kỳ môn nào).

**`lessonPlanTemplates.js`:** thêm 3 entry Lớp 10-12 vào `LESSON_PLAN_GRADES` - `getCircularForGrade()`/
`getMinutesPerLesson()` không cần sửa (đã viết tổng quát theo điều kiện `gradeNum >= 6` từ Phiên
32, tự động đúng cho THPT).

**`ExamMatrixForm.jsx`:** placeholder ô "Tên trường" giờ đổi theo cấp học đang chọn ("Trường THPT
..." / "Trường THCS ..." / "Trường Tiểu học ...") thay vì cố định "Trường THCS ..." trước đây.

**Test:** thêm `test/thptSubjects.test.js` (28 test case mới) khoá lại: đủ 17 môn/HĐGD mỗi khối
10-12, đúng 11 môn hỗ trợ Đề kiểm tra, GDQP&AN CÓ hỗ trợ Đề kiểm tra (khác GDTC), Ngữ văn vẫn CHỈ
hỗ trợ Soạn giáo án/Đề cương, mọi môn đều có subjectProfile đầy đủ, `gradeProfiles.js` không còn rò
rỉ từ khoá Toán sang môn khác, CV5512/45 phút/tiết áp dụng đúng cho Lớp 10-12. Kết quả: 354/356 pass
(2 fail còn lại có sẵn từ trước, không liên quan - tính năng Audio/IPA Tiếng Anh, xem Phiên 32).
`npm run build` (Next.js 16, Turbopack) compile sạch, không lỗi TypeScript/route.

**PHẠM VI CHƯA LÀM (để phiên sau, xem `NEXT_STEPS.md` #12-15):** dữ liệu SGK thật (kho GitHub kiến
thức) cho 6 môn THPT mới; module Đề kiểm tra Ngữ văn riêng (áp dụng chung THCS/THPT); cụm chuyên đề
học tập THPT (3 chuyên đề/môn, 105 tiết/năm - nội dung riêng ngoài chương trình cốt lõi đại trà).

## Phiên 32 — Mở rộng THCS (Lớp 6-9) cho Soạn giáo án + Đề cương Ôn tập + Đề kiểm tra
Tra cứu lại đúng Thông tư 32/2018/TT-BGDĐT (Mục 4, sửa đổi bởi Thông tư 13/2022/TT-BGDĐT) để lấy
CHÍNH XÁC danh sách 10 môn bắt buộc + Hoạt động trải nghiệm-hướng nghiệp cấp THCS, và xác nhận
Công văn 5512/BGDĐT-GDTrH (2020, vẫn hiệu lực năm học 2025-2026) là khung "Kế hoạch bài dạy" đúng
cho THCS/THPT - kiến trúc `lessonPlanTemplates.js` HOÁ RA đã dự trù sẵn CV5512 từ trước (stub
`comingSoon:true`), chỉ cần kích hoạt, không phải viết schema JSON mới (4 hoạt động Khởi động/Hình
thành kiến thức mới/Luyện tập/Vận dụng dùng CHUNG giữa CV2345 và CV5512).

**`config.js` (nguồn dữ liệu môn học DUY NHẤT):** thêm field `modules` (mảng module được phép:
lessonPlan/outline/exam, mặc định cả 3) - giải quyết đúng 2 nhóm môn đặc biệt: (1) GDTC/Âm nhạc/Mĩ
thuật/HĐTN-HN đánh giá bằng nhận xét → chỉ `["lessonPlan"]` (giữ nguyên tắc đã áp dụng cho Tiểu
học, mở rộng cho THCS thay vì loại hẳn); (2) Ngữ văn THCS theo Công văn 3175/2022 (nhấn mạnh lại ở
CV3935/2024) cần module đề kiểm tra RIÊNG (Đọc hiểu + NLXH + NLVH, ngữ liệu bắt buộc ngoài SGK) -
tạm `["lessonPlan","outline"]`, chờ module chuyên biệt ở phiên sau. `getSubjectsForGrade(grade,
moduleKey)` giờ lọc theo cả 2 trục (khối lớp + module) - Toán/Tiếng Anh/Lịch sử và Địa lí/Tin
học/Công nghệ MỞ RỘNG xuyên suốt Lớp 4-9 hoặc không giới hạn (tái dùng entry cũ). Sửa luôn 1 lỗi
dữ liệu cũ: "Lịch sử" đơn lẻ trước đây `minGrade:6` (sai - ở Lớp 6-9 vẫn dùng "Lịch sử và Địa lí"
gộp, "Lịch sử" tách riêng chỉ có thật từ THPT) → sửa `minGrade:10`.

**`subjectProfiles.js`:** thêm 7 profile mới (Ngữ văn, GDCD, KHTN, GDTC, Âm nhạc, Mĩ thuật, HĐTN-
HN), mở rộng 3 profile cũ (Lịch sử và Địa lí, Tin học, Công nghệ) với ghi chú ĐỘ SÂU KIẾN THỨC
khác nhau rõ rệt giữa Tiểu học và THCS (VD Tin học Tiểu học cấm lập trình dạng văn bản, THCS được
phép Scratch nâng cao/Python cơ bản).

**3 form (`LessonPlanForm.jsx`/`OutlineForm.jsx`/`ExamMatrixForm.jsx`):** truyền đúng `moduleKey`
tương ứng vào `getSubjectsForGrade()`. `ExamMatrixForm.jsx`: checkbox "câu hỏi trực quan" (đặt
tính/sơ đồ - đặc trưng Tiểu học) giờ TỰ ĐỘNG tắt + ẨN hẳn khi chọn Lớp 6 trở lên, không còn dựa vào
giáo viên tự nhớ tắt.

**`lessonPlanTemplates.js`:** `getCircularForGrade()` chọn CV5512 cho Lớp 6+; `getMinutesPerLesson()`
sửa đúng 45 phút/tiết cho THCS/THPT (trước đây lỡ dùng chung 40 phút với Lớp 3-5 Tiểu học).

**PHẠM VI CHƯA LÀM (đã chốt với Hoan, để phiên sau):** THPT (Lớp 10-12, cơ cấu "8 môn bắt buộc +
chọn 4/9 môn lựa chọn" khác hẳn kiểu "học đủ mọi môn"); module Đề kiểm tra Ngữ văn THCS/THPT
riêng (Đọc hiểu + NLXH + NLVH, ngữ liệu ngoài SGK theo CV3175).

324/324 test PASS. Build production sạch. Đã kiểm chứng thủ công: dropdown Lớp 6/8 ra đúng 12 môn
Soạn giáo án / 8 môn Đề cương / 7 môn Đề kiểm tra (đúng như thiết kế); prompt sinh ra đúng "Công
văn 5512" + vai trò AI đúng môn cho cả Toán, Ngữ văn, Khoa học tự nhiên Lớp 8.

## Phiên 31 — Sửa 2 lỗi đề Tiếng Việt (đánh số A/B lặp, thiếu khoảng giấy viết tay) + dứt điểm test flaky
**Lỗi 1 (đánh số):** 4 khối (Đọc thành tiếng/Đọc thầm/Chính tả/Tập làm văn) trước đây MỖI khối tự
in tiêu đề CỦA CHÍNH NÓ ("A. ĐỌC THÀNH TIẾNG", "A. ĐỌC THẦM", "B. CHÍNH TẢ", "B. TẬP LÀM VĂN") độc
lập ở 8 chỗ (4 *BlockView.jsx + 4 *Export.js) → in ra đề nhìn như "A."/"B." bị lặp lại 2 lần, sai
chuẩn sư phạm. Sửa: `vietnameseExamBlocks.js` (danh bạ) giờ là NGUỒN DUY NHẤT giữ `sectionLabel`
("I. KIỂM TRA ĐỌC"/"II. KIỂM TRA VIẾT") + `subLabel` ("1. Đọc thành tiếng", "2. Đọc hiểu", "1.
Chính tả", "2. Tập làm văn") - 2 "người điều phối" (`VietnameseExamPreview.jsx` bản xem trước web,
`vietnameseExamExportService.js` bản xuất Word) chịu trách nhiệm in `sectionLabel` ĐÚNG 1 LẦN khi
đổi khối lớn, còn `subLabel` truyền xuống cho từng khối tự in - từng khối không còn hard-code
chuỗi tiêu đề.

**Lỗi 2 (thiếu khoảng giấy viết tay):** câu tự luận cuối phần Đọc hiểu chỉ có 1 dòng chấm ngắn
(18px) - không đủ viết 2-3 câu. Chính tả/Tập làm văn HOÀN TOÀN không có dòng kẻ nào cho học sinh
viết - chỉ dừng ở đoạn văn mẫu/đề bài rồi hết trang. Sửa: câu tự luận → 3 dòng chấm (cố định, không
cần AI tự chèn mã đánh dấu - số dòng là quy tắc trình bày tất định). Chính tả → khung kẻ ngang số
dòng ước lượng theo ĐỘ DÀI đoạn chính tả (~50 ký tự/dòng, tối thiểu 4 dòng). Tập làm văn → khung kẻ
ngang cố định theo Lớp (Lớp 1-2: 10-12 dòng, Lớp 3-5: 16-20 dòng). Bản Word dùng `Paragraph`
rỗng + `border.bottom` (docx hỗ trợ vẽ đường kẻ trực tiếp trên Paragraph) - dòng kẻ THẬT trong file
Word, không chỉ để khoảng trắng suông như cách làm cũ ở khối Toán.

**Dứt điểm test flaky (`test/worksheetLineArtIcons.test.js`, đã treo từ Phiên 30):** nguyên nhân
thật là icon "⭐" (U+2B50) nằm trong kho 16 icon đếm hình ngẫu nhiên của "Đếm và viết số" TRÙNG với
"⭐" cố định ở khối "Tự đánh giá" (footer mọi Phiếu bài tập) - khi random chọn trúng "⭐" để đếm,
`document.xml` chứa "⭐" 2 lần vì 2 lý do khác nhau khiến test tưởng nhầm là bug. Đổi icon "Tự đánh
giá" sang "★" (U+2605, khác hẳn) - loại bỏ tận gốc khả năng đụng độ, không phải vá test. Chạy lại
30 lần liên tục không còn fail.

324/324 test PASS (chạy lặp lại nhiều lần để xác nhận hết flaky). Build production sạch.

## Phiên 30 — Liên kết SGK Tiếng Việt thật cho tab "Đề Tiếng Việt Tiểu học"
Thêm khối "Liên kết SGK Tiếng Việt (tuỳ chọn)" vào `VietnameseExamForm.jsx`, tái dùng nguyên
`/api/chapters` + `/api/lessons` đã có. Khối Đọc thành tiếng/Chính tả có gợi ý Tên bài + hiện mô
tả đoạn văn gợi nhớ khi khớp bài — Chính tả CỐ Ý không tự điền nội dung (chống bịa/vi phạm bản
quyền). Khối Đọc thầm có nút trích chương SGK làm `referenceContext` cho AI viết ngữ liệu MỚI
(không copy nguyên văn). 324/324 test PASS.

## Phiên 29 — Sửa 3 lỗi sư phạm Tiếng Việt Lớp 1 (phản hồi qua phiếu in thật)
`khoanh_tu_loai`/`noi_tu_nhom` dùng thuật ngữ ngữ pháp vượt cấp (Lớp 2-3) → nâng `minGrade`, ẩn
khỏi Lớp 1. `dien_tu_cho_san` (dạng bài Tiếng Việt duy nhất còn ở Lớp 1) thêm ràng buộc câu ngắn
2-4 tiếng, cấm thuật ngữ ngữ pháp/vần phức tạp, viết hoa đầu câu bằng CODE (không chỉ dựa AI).
319/319 test PASS.

## Phiên 28 — Soạn Giáo án: GDQP&AN không ép buộc + phụ lục "Gợi ý thiết kế Học liệu"
Tích hợp GDQP&AN tự chuyển sang Đạo đức/Kỹ năng sống/Quyền Trẻ em khi bài học không liên quan
(thay vì ép buộc), nhãn hiển thị động. Phụ lục mới tự sinh 3 từ khoá tiếng Việt để giáo viên
Lớp 1-3 dùng với Canva/ChatGPT/Gemini tạo Flashcard. 313/313 test PASS.

## Phiên 26-27 — Rà soát chủ động toàn hệ thống + xác nhận 2 việc tưởng "chưa code"
Nâng Next.js 14→16.3.3 (vá 3 lỗ hổng bảo mật mức HIGH). Script `test:word-compat` dựng `.docx`
thật rồi convert PDF bằng LibreOffice headless để kiểm tra — phát hiện + sửa 2 lỗi thật (2 hàm
export Word thiếu `return blob`, rà soát chéo sửa luôn 6 hàm cùng họ). Thêm log giám sát hạn mức
Upstash free tier tại 1 điểm chung (`upstashCommand`). Thêm Error Boundary tổng
(`src/app/error.js` + `global-error.js`), đã kiểm chứng thật bằng route lỗi tạm rồi xoá. Xác nhận
2 tính năng (chế độ in Màu/Đen trắng toàn phiếu; Lớp 3 "Thu thập/phân loại số liệu") thực ra ĐÃ
code xong từ trước, chỉ thiếu tài liệu/test — viết test bổ sung. 303/303 test PASS.

## Phiên 24-25 — Sửa lỗi ảnh Word (Unicode → PNG) + gợi ý Bài theo Sách giáo viên
Bài 7 "so sánh độ dài" hiện TRỐNG trong Word (không lỗi PDF) — nguyên nhân gốc: vẽ bằng lặp ký tự
Unicode hình khối ép font Times New Roman thiếu glyph. Rà soát phát hiện 2 chỗ khác cùng rủi ro
(biểu đồ cột, Nhận diện hình). Sửa cả 3 bằng ảnh PNG rasterize từ SVG (`ImageRun`), không phụ
thuộc font máy người dùng. 279/279 test PASS.
Tính năng mới: gợi ý "Bài" theo Sách giáo viên ở Soạn giáo án — đọc `chuong_{n}_bai.json` từ kho
GitHub kiến thức (CẦN Hoan tự tạo dữ liệu thật, xem `NEXT_STEPS.md`). 284/284 test PASS.

## Phiên 20-21 — Icon line-art đen trắng + rà soát toàn bộ phát hiện lỗi tính điểm
Bài 3 đổi icon emoji màu → line-art đen trắng (hướng đã chọn). Rà soát chủ động toàn dự án (không
riêng Phiếu Bài Tập): phát hiện lỗi THẬT trong `computeScores()` — đề nhiều câu, phần dư làm tròn
0.25đ dồn hết vào câu cuối, có thể ra điểm ÂM (~5,2% trường hợp qua fuzz-test 20.000 tổ hợp). Đã
sửa: áp sàn 0.25đ + rải drift theo nấc vào câu điểm cao nhất mỗi vòng. 274/274 test PASS.

## Phiên 16-19 — Sửa lỗi sư phạm Toán Lớp 5 (Trạm 6/7/12) + lỗi Word Lớp 1 (Bài 7/10/11/12)
Chốt 3 quy tắc sư phạm bắt buộc cho Toán Lớp 5 (cấm hình trụ/hình cầu tính diện tích-thể tích, đa
dạng hoá tỉ số phần trăm, "đặt tính" không xuất dấu "="; xem `NEXT_STEPS.md`). Sửa loạt lỗi Word
Lớp 1 phản hồi qua ảnh chụp thực tế.

## Phiên 12-15 — Mở Lớp 4, hoàn tất Lớp 5 (Toán, 14 dạng bài)
Xác nhận catalog Toán Lớp 3-5 theo đúng SGK KNTT (tra cứu đối chiếu nhiều nguồn, không suy đoán).
Lớp 4: góc/đơn vị đo góc, biểu thức chữ, phân số, giải toán 3 bước. Lớp 5: số thập phân, tỉ số
phần trăm, hình tam giác/thang/tròn, thể tích, vận tốc-quãng đường-thời gian — đủ 14 dạng bài.

## Phiên 9-11 — Mở Lớp 3 (Toán), sửa lỗi đăng nhập public
Mở khối Lớp 3 (12 dạng bài: 4 dạng cũ mở rộng + `nhan_chia_bang`, `chu_vi_dien_tich`,
`doi_don_vi_do`, `xem_dong_ho_gio_phut`, `tien_viet_nam`, `kha_nang_xay_ra`). Đổi mặc định chế độ
public, sửa lỗi UX nút "Chủ đề SGK". Định dạng số kiểu Việt Nam (`numberFormatUtils.js`).

## Giai đoạn 10 — Nâng cấp Soạn Giáo án (7 việc theo góp ý giáo viên)
Tin nhắn Zalo phụ huynh (tái dùng khuôn plugin `lessonPlanIntegrations.js`), 3 phong cách soạn
giáo án (preset + tự do), cơ chế chống trùng lặp giữa các lần soạn liên tiếp/liên giáo viên,
checklist đánh giá Năng lực-Phẩm chất (NL-PC).

## Giai đoạn 9 — Phiếu Bài Tập: catalog theo CHỦ ĐỀ SGK thay vì "kỹ năng chung"
Phát hiện kiến trúc quan trọng: giáo viên cần bám sát chủ đề/bài học SGK theo thời điểm năm học,
không phải danh sách "kỹ năng chung" rời rạc. Làm lại theo 3 bước (Tầng A sửa nhanh không đổi
kiến trúc → Tầng B catalog theo chủ đề SGK, Đợt 1 Lớp 1 → mở rộng Lớp 2-5). Thêm "gói chủ đề"
(`worksheetTopicPackages.js`) — bật 1 nút cho cả nhóm dạng bài thay vì bật rời rạc từng dạng.

## Giai đoạn 8 và trước — Nền tảng ban đầu
Xây dựng 4 mode gốc (Đề kiểm tra Ma trận, Phiếu Bài Tập, Soạn Giáo án, Đề Tiếng Việt Tiểu học),
hạ tầng bảo mật cơ bản (rate-limit theo giáo viên, trần số câu/bài/tiết mỗi lượt gọi, security
headers, `.env.local.example`), test tự động cho các service lõi, sửa lỗi "rối loạn dòng thời
gian" trong Giáo án nhiều tiết, mở rộng quy tắc số thập phân/đơn vị đo kiểu Việt Nam trong Đề
cương ôn tập.

---

## Chuẩn hoá môn học Lớp 1-5 (gần đây nhất, chưa đánh số Phiên)
Thêm 6 môn còn thiếu vào `config.js`/`subjectProfiles.js` (dùng chung Soạn Giáo án/Đề Cương Ôn
Tập/Tạo Đề Kiểm Tra), đúng Thông tư 32/2018/TT-BGDĐT: Đạo đức (1-5), Khoa học (4-5), Tự nhiên và
Xã hội (1-3), Lịch sử và Địa lí (4-5, thay nhãn "Lịch sử" sai tên ở Tiểu học), Tin học (3-5),
Công nghệ (3-5). Sửa lỗi môn "Lịch sử" hiện dư thừa ở Lớp 1 (giới hạn `minGrade: 6`, đúng cho
THCS/THPT). Sửa kèm 1 bug thật phát hiện được: `outlinePromptTemplates.js` trước đây chỉ áp dụng
`extraRules` riêng môn cho Toán, bỏ sót mọi môn khác ở tab Đề Cương Ôn Tập — đã sửa áp dụng cho
mọi môn. Chưa chạy `npm run build`/`npm test` thật (xem `NEXT_STEPS.md` mục 🔴 #4). Chi tiết đầy
đủ nằm trong lịch sử chat, không lặp lại ở đây.

---

## README.md mới + rút gọn NEXT_STEPS.md/PROJECT_SUMMARY.md
Tạo `README.md` mô tả đầy đủ chức năng hiện tại (7 tab, kiến trúc, quy ước, cách chạy dự án).
`NEXT_STEPS.md` rút từ 723 dòng xuống còn phần việc tồn đọng + nguyên tắc bắt buộc phải nhớ.
`PROJECT_SUMMARY.md` rút từ 3141 dòng xuống bản changelog cô đọng này — nội dung chi tiết gốc vẫn
truy được qua lịch sử Git, không mất thông tin, chỉ không còn nằm trong 2 file continuity chính.
