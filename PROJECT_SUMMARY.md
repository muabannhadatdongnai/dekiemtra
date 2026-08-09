# AI Exam Generator — Tóm tắt dự án (bản cập nhật sau khi sửa 5 phản ánh THỰC TẾ của giáo viên
# khi dạy thử giáo án AI sinh ra — giai đoạn 8)

> ⚠️ Bản này thay thế mọi bản `PROJECT_SUMMARY.md` cũ hơn (kể cả bản đóng gói sẵn trong
> `ai-exam-generator-giaidoan7.zip`). Dùng bản này làm nguồn tin cậy khi mở chat mới.

## 0. MỚI NHẤT (giai đoạn 8) — sửa 5 phản ánh giáo viên sau khi DẠY THỬ giáo án AI sinh ra
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
│        worksheetSampleAnalyzer,worksheetSampleCache,sampleExamAnalyzer,sampleExamCache,
│        teacherPreferenceStore,questionBankStore,upstashClient,
│        lessonPlanEngine (sửa),lessonPlanOrchestrator (sửa),lessonPlanExportService (sửa),
│        lessonPlanSampleAnalyzer [MỚI],lessonPlanSampleCache [MỚI],
│        fileTextExtractors,scoringUtils(không dùng),
│        vietnameseExamOrchestrator,vietnameseBlocks/*}
└── data/{config,constants,gradeProfiles,subjectProfiles,promptTemplates,visualSchemas,
        sampleExamSchema,worksheetSampleSchema,worksheetSchemas,worksheetExerciseCatalog,
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

## Quy trình khi mở chat mới
1. Upload lại zip code mới nhất (sandbox reset giữa các phiên) + file `PROJECT_SUMMARY.md` này.
2. Nói rõ đang muốn tiếp tục việc gì (VD: "đã test Gemini thật với giáo án mẫu, ổn rồi, làm tiếp
   [việc X]" hoặc "review lại lần nữa" hoặc "viết test tự động cho phần giáo án mẫu").
3. Sau khi hoàn thành, yêu cầu cập nhật lại chính `PROJECT_SUMMARY.md` trước khi đóng gói zip mới.
