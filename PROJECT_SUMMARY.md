# AI Exam Generator — Tóm tắt dự án (để mang sang chat mới)

## 1. Tổng quan
Next.js 14 app tạo đề kiểm tra tự động bằng AI cho giáo viên Việt Nam, chi phí duy trì **$0**.
- Repo GitHub code: `dekiemtra` (dưới tài khoản `muabannhadatdongnai`)
- Repo kiến thức (markdown SGK): riêng biệt, cấu trúc `sach_giao_khoa/lop_X/{mon}_tY/chuong_Z.md`
- Deploy: Vercel
- File zip code mới nhất đã gửi: `/mnt/user-data/outputs/ai-exam-generator.zip` (trong chat cũ)

## 2. Tech stack
- Next.js 14 App Router, Tailwind CSS, localStorage-based auth (không JWT, `users.json` chứa tài khoản GV)
- **AI: `gemini-3.5-flash`** qua SDK **`@google/genai`** (SDK cũ `@google/generative-ai` đã bị Google khai tử 31/8/2025, KHÔNG dùng lại)
  - Lý do chỉ dùng 1 model: Google không có free tier cho bất kỳ model Pro nào (kể cả `gemini-3.1-pro-preview`)
  - Multi API key: `GEMINI_API_KEYS` (phân tách dấu phẩy) qua `geminiKeyPool.js`, tự thử lần lượt ngẫu nhiên khi 1 key hết quota (429)
- Xuất Word: `docx.js` + pipeline `temml` (LaTeX→MathML) → `mathml2omml` (→OMML) → tự inject vào `document.xml` sau `Packer.toBlob()`
- Hiển thị công thức web: KaTeX

## 3. Cấu trúc thư mục chính
```
src/
├── app/
│   ├── page.js                          # Trang chính, split-screen 40/60
│   └── api/{login,chapters,generate,generate-worksheet}/route.js
├── components/
│   ├── Header.jsx, LoginForm.jsx        # ĐÃ CÓ BRANDING RIÊNG của người dùng - không ghi đè
│   ├── ExamMatrixForm.jsx               # Form tạo đề (ma trận Chương × Mức độ)
│   ├── A4LivePreview.jsx                # Preview đề thi + Ma trận + Đặc tả + Rubric
│   ├── ExportActions.jsx                # Nút xuất Word/PDF/4 mã đề
│   ├── WorksheetForm.jsx, WorksheetPreview.jsx  # MỚI - đang làm dở, xem mục 6
│   └── visuals/                         # VerticalArithmetic, NumberTriangle, BarModel,
│                                         # VisualCounting, ScratchGrid, QuestionVisual (dispatcher)
├── services/
│   ├── apiClient.js                     # Gom fetch API (login, chapters, generate, generate-worksheet)
│   ├── authService.js                   # verify server-side + localStorage session
│   ├── githubService.js                 # fetchChaptersSeparately, fetchAdvancedBook...
│   ├── geminiEngine.js                  # Sinh câu hỏi theo Ma trận Chương, dedup 3 lớp
│   ├── geminiKeyPool.js                 # Multi-key failover
│   ├── exportService.js                 # Xuất Word/PDF đề thi (buildExamDocxBlob dùng chung)
│   ├── visualExportBuilders.js          # Vẽ visual trong Word (Table-based)
│   ├── specificationBuilder.js          # Tính Ma trận đề thi + Bản đặc tả (không cần AI)
│   ├── specificationExportBuilders.js   # Vẽ 2 bảng đó trong Word
│   ├── scoringUtils.js                  # Tính điểm (HIỆN KHÔNG DÙNG - giáo viên yêu cầu bỏ hiển thị)
│   ├── worksheetGenerator.js            # MỚI - đang làm dở
│   └── latexUtils.js
└── data/
    ├── config.js                        # GRADES, SUBJECTS
    ├── subjectProfiles.js               # Quy tắc + vai trò AI riêng từng môn (Toán/Văn/Anh/Sử)
    ├── promptTemplates.js               # buildExamPrompt (theo chapterMatrix, hỗ trợ nhiều chương/lượt)
    ├── visualSchemas.js                 # Schema 4 loại câu hỏi trực quan + validate + tính đáp án
    ├── worksheetSchemas.js              # MỚI - đang làm dở
    ├── examBlueprint.js, examResult.js  # Định nghĩa cấu trúc input/output
    └── users.json
```

## 4. Các giai đoạn đã hoàn thành (đề kiểm tra Lớp 1-12)
1. **Nền tảng**: Next.js + Gemini + GitHub RAG + xuất Word/PDF + đăng nhập
2. **Câu hỏi trực quan** (Tiểu học): đặt tính rồi tính, cây số/tam giác quan hệ, sơ đồ đoạn thẳng, hình đếm trực quan — **nguyên tắc cốt lõi: AI CHỈ sinh số liệu, code tự vẽ + tự validate + tự tính đáp án (không tin AI tính toán)**
3. **Multi API key** (xoay vòng ngẫu nhiên, fallback khi 429)
4. **Giai đoạn 1**: Ma trận theo Chương (mỗi câu có `chapterRef`, sinh/retry riêng từng chương)
5. **Giai đoạn 2**: Ma trận đề thi + Bản đặc tả (chuẩn Thông tư 22) — tính từ `questions` đã có, KHÔNG gọi thêm AI
6. **Giai đoạn 3**: Xuất trọn bộ 1 lần — bật "Tạo đáp án" thì tự động tải 2 file (Học sinh sạch / Giáo viên có đáp án) từ cùng 1 dữ liệu
7. **Giai đoạn 4**: Tái cấu trúc (`config.js`, `apiClient.js`, `subjectProfiles.js`, `examBlueprint.js`, `examResult.js`)

## 5. Các bug nghiêm trọng đã sửa (rất quan trọng nếu code lại)
- **[MỚI - Giai đoạn 2] "Nhận diện hình" đứng trơ trọi, không có hoạt động ứng dụng**: đây là
  bug gốc giáo viên phản ánh đầu tiên. Nguyên nhân: `nhan_dien_hinh` là dạng bài DUY NHẤT trong
  `worksheetSchemas.js`/`worksheetExerciseCatalog.js` không có hoạt động ứng dụng đi kèm - chỉ
  liệt kê 6 hình + tô màu rồi dừng. Đã sửa bằng cách thêm dạng bài mới **`dem_hinh_ung_dung`**
  (Đếm hình theo yêu cầu) trong `worksheetSchemas.js`, khai báo trong catalog với
  `hiddenFromForm: true` (KHÔNG phải ô chọn riêng giáo viên có thể quên bật), và
  `worksheetGenerator.js` TỰ ĐỘNG thêm khối này ngay sau `nhan_dien_hinh` mỗi khi được chọn,
  dùng CHUNG danh sách hình đã sinh để 2 khối liên kết với nhau. Có renderer cả web
  (`WorksheetPreview.jsx`) lẫn Word (`worksheetExportService.js`).
- **[MỚI - Giai đoạn 2] `EXERCISE_LABELS` hard-code trong `WorksheetForm.jsx` là dead-code trùng
  lặp với `worksheetExerciseCatalog.js`**: form không hề dùng `listAvailableExercises()` đã viết
  sẵn từ trước, khiến catalog's `minGrade`/`maxGrade` (VD "Đếm và viết số" chỉ tới Lớp 1, "Nối
  phép tính" chỉ từ Lớp 1) CHƯA TỪNG được áp dụng - form hiện đủ cả 7 ô cho MỌI khối lớp bất kể
  catalog khai báo gì. Đã sửa: `WorksheetForm.jsx` giờ dựng checkbox ĐỘNG từ
  `getSelectableCatalogFor(grade)` (import trực tiếp từ `worksheetExerciseCatalog.js` - module dữ
  liệu thuần, AN TOÀN phía client, KHÔNG import từ `worksheetGenerator.js` vì file đó có
  `geminiKeyPool.js` đọc biến môi trường server). Thêm 1 lớp phòng thủ ở
  `worksheetGenerator.js`: dù client gửi gì lên `/api/generate-worksheet`, server tự lọc lại
  `exerciseCounts` theo đúng catalog + khối lớp trước khi sinh (biến `safeCounts`), không tin
  tưởng dữ liệu client tuyệt đối.
- **[MỚI - Giai đoạn 1] Word xuất ra không phải khổ A4**: `exportService.js`, `worksheetExportService.js`, `lessonPlanExportService.js` cả 3 đều tạo `new Document({ sections: [{ properties: {} }] })` — `properties` RỖNG khiến docx.js dùng mặc định khổ **Letter** (8.5×11 inch, 12240×15840 twips) chứ KHÔNG PHẢI A4, margin mặc định 1 inch. Đây là nguyên nhân THẬT của việc giáo viên báo "margin không full khổ A4" — không phải lỗi CSS. Đã sửa cả 3 file dùng chung `PAGE_A4_MM`/`PAGE_MARGIN_MM` mới thêm ở `src/data/constants.js` (20mm/20mm/18mm/18mm), qua `convertMillimetersToTwip()` của docx.js. Đã verify bằng cách sinh thật 1 file .docx và soi `word/document.xml`: ra đúng `<w:pgSz w:w="11905" w:h="16837"/>` — khớp chuẩn A4 của Word. Có test `test/pageLayout.test.js` chống tái phát (cần `npm install` để có package `docx` thật rồi mới chạy được, vì test import trực tiếp từ `docx`).
- **[MỚI - Giai đoạn 1] Lệch margin giữa preview màn hình và bản in/PDF**: `.a4-page` (padding màn hình) dùng `20mm 18mm` nhưng `@page` (CSS in ấn, `globals.css`) lại dùng `15mm 16mm` — 2 giá trị không khớp nên bản xem trước và bản in thật lệch nhau. Đã thống nhất về `20mm 18mm` ở CẢ 3 nơi: `.a4-page`, `@page`, và `PAGE_MARGIN_MM` trong `constants.js`. **Đổi margin sau này thì phải sửa cả 3 nơi** — CSS không import được hằng số JS.

## 5b. Dạng bài mới thêm ở Giai đoạn 2 (đa dạng hoá hoạt động)
- **`sap_xep_thu_tu`** (Sắp xếp thứ tự bé→lớn) - dạng bài MỚI, chọn được, mọi khối lớp. Lấp
  khoảng trống skillGroup "nhan_biet_so" trước đây chỉ có 1 dạng (`dem_va_viet_so`). Cảm hứng từ
  bài 3 trong ảnh mẫu "Toán lớp 2" giáo viên gửi ban đầu (dù bản gốc dùng đơn vị đo, bản này
  dùng số thuần - hệ thống hiện tại chưa có khái niệm "đơn vị đo" trong phiếu bài tập).
- **`dem_hinh_ung_dung`** (Đếm hình theo yêu cầu) - dạng bài MỚI, ẨN khỏi form
  (`hiddenFromForm: true`), TỰ ĐỘNG bắt buộc kèm `nhan_dien_hinh`. Xem giải thích đầy đủ ở mục 5.
- Cả 2 đã stress-test 500 lượt/khối (3000 lượt tổng, xem cách stress test tương tự mục 11) +
  test end-to-end qua `generateWorksheet()` thật (không mock, chỉ stub `geminiKeyPool` vì sandbox
  không có `@google/genai`/mạng) - xác nhận thứ tự section, tính đúng đắn số liệu, và việc lọc
  theo khối lớp đều hoạt động chính xác trước khi giao.
- **Việc CHƯA làm** (còn treo lại, làm sau nếu cần): dạng bài "Tiếng Việt" vẫn ở mức `"planned"`
  (chưa có generator thật); chưa có khái niệm "chủ đề SGK" (topic) liên kết với chương/bài học cụ
  thể - vẫn là generic theo skillGroup (so_hoc/nhan_biet_so/quy_luat/hinh_hoc/van_dung), KHÔNG
  gắn với 1 chủ đề như phiếu mẫu ảnh gốc (5 bài đều xoay quanh CÙNG "đổi đơn vị đo độ dài"). Đây
  vẫn là roadmap Giai đoạn 4-5 cũ (outline-extraction + liên kết SGK) - CHƯA triển khai, không
  nhầm với "Giai đoạn 0-4" nội bộ trong code (đánh số riêng, khác roadmap 7 giai đoạn ban đầu).

## 5c. Giai đoạn 3 (bên ngoài) - "Công thức đề" theo khối lớp, mở rộng hạ tầng có sẵn
- **LƯU Ý PHÂN BIỆT**: code đã có sẵn 1 "GIAI ĐOẠN 3" nội bộ (đánh số riêng, KHÁC roadmap 7
  bước bên ngoài) - đó là phần lưu `favoriteLayoutId` (bố cục/màu sắc yêu thích) qua
  `teacherPreferenceStore.js` + `/api/worksheet-preference`. Việc MỚI làm ở đây là mở rộng
  ĐÚNG hạ tầng đó (không viết hệ thống song song) để thêm "công thức đề" - tổ hợp dạng bài +
  số lượng câu, LƯU RIÊNG THEO TỪNG KHỐI LỚP (vì dạng bài khả dụng khác nhau theo khối).
- `teacherPreferenceStore.js`: `getWorksheetPreference()` giờ trả thêm `favoriteExerciseCounts:
  { [grade]: {key: count} }`. `setWorksheetPreference()` đổi từ "ghi đè toàn bộ" sang "đọc-gộp-
  ghi" (nhận `updates` MỘT PHẦN, tự đọc giá trị cũ rồi gộp) - để lưu công thức 1 khối KHÔNG làm
  mất `favoriteLayoutId` hay công thức của khối khác đã lưu trước đó. Đã test kỹ 5 bước liên
  tiếp (lưu layout -> lưu công thức Lớp 1 -> lưu công thức Lớp 2 -> cập nhật lại công thức Lớp
  1) xác nhận không phần nào bị mất/ghi đè nhầm, và cập nhật lại là THAY THẾ (không cộng dồn).
- `/api/worksheet-preference` (POST): nhận thêm `gradeExerciseCounts: { grade, counts }`, tự
  validate `grade` thuộc 1 trong 3 khối hợp lệ + lọc `counts` chỉ giữ số không âm (không tin
  dữ liệu client tuyệt đối).
- `WorksheetForm.jsx`: thêm nút "⭐ Lưu công thức đề này cho [khối lớp]" (không cần đã tạo phiếu
  trước đó, khác nút "Lưu bố cục" cần `lastLayoutId`) + banner "Dùng công thức đã lưu" hiện khi
  khối lớp đang chọn có công thức đã lưu từ trước - giáo viên CHỦ ĐỘNG bấm mới áp dụng (không tự
  động âm thầm ghi đè số liệu giáo viên vừa chỉnh tay, tránh bực mình).
- **Việc CHƯA làm** (cân nhắc thêm nếu giáo viên thấy cần, chưa làm vì tăng độ phức tạp UI mà
  chưa có phản hồi thực tế cần thiết): chọn theo TỈ LỆ độ khó thay vì số lượng cứng từng dạng;
  "khoá" 1 dạng bài bắt buộc không cho xoá khi random; nhiều công thức đặt tên khác nhau cho
  cùng 1 khối (hiện tại mỗi khối chỉ lưu ĐÚNG 1 công thức, ghi đè khi lưu lại - không phải danh
  sách nhiều công thức).

## 5d. Giai đoạn 4 (bên ngoài) - Content-aware theo mẫu thật
- **LƯU Ý PHÂN BIỆT**: code đã có sẵn 2 "GIAI ĐOẠN 4" nội bộ (đánh số riêng, khác roadmap 7 bước
  bên ngoài) - (1) heroMascot xuyên suốt cho layout "adventure_map", (2) đáp số bài toán lời văn
  mã hoá vào QR. Việc MỚI làm ở đây được đánh dấu "GIAI ĐOẠN 4 MỚI" trong code để phân biệt.
- **CHẨN ĐOÁN GỐC**: giáo viên phản ánh "Phiếu mẫu tham khảo dường như chỉ làm theo kiểu mẫu
  (layout) mà không bám theo đề toán mẫu trong ảnh". Đọc kỹ `worksheetSampleSchema.js` +
  `worksheetGenerator.js` xác nhận ĐÚNG: `sampleSpec` (phân tích từ file mẫu upload) TRƯỚC ĐÂY
  chỉ ảnh hưởng (1) chọn layout/màu sắc (`pickLayoutFromSampleSpec`) và (2) ngữ cảnh chủ đề cho
  AI soạn "giải toán có lời văn" - KHÔNG hề ảnh hưởng dạng bài nào xuất hiện, số lượng câu, hay
  THỨ TỰ các khối. `exerciseTypeHints` (6 tag tự do AI trích ra) chỉ hiện cho giáo viên ĐỌC THAM
  KHẢO ("Dạng bài quan sát thấy: ...") chứ KHÔNG map được vào catalog thật nên không tự động áp
  dụng được vào phiếu sinh ra - đúng như giáo viên cảm nhận.
- **Đã sửa - `worksheetSampleSchema.js`**: thêm `detectedExercises: [{key, approxCount}]` - CÓ
  CẤU TRÚC, `key` CHỈ ĐƯỢC PHÉP là 1 trong các key thật của `worksheetExerciseCatalog.js` (validate
  ở `sanitizeWorksheetSampleSpec`, loại bỏ key bịa/trùng lặp/`hiddenFromForm`, ép `approxCount` về
  1-15), giữ ĐÚNG thứ tự xuất hiện trong phiếu mẫu.
- **Đã sửa - `worksheetSampleAnalyzer.js`**: prompt AI giờ đưa ĐÚNG danh sách "key - nhãn" thật từ
  catalog (closed-set, xem `buildDetectedExercisesKeyList()`), yêu cầu AI CHỈ chọn trong danh sách
  này, không tự bịa - tăng độ chính xác map vào catalog thay vì tag tự do trước đây.
- **Đã sửa - `worksheetGenerator.js`** (refactor quan trọng nhất): tách phần build sections khỏi
  chuỗi if cố định cũ, chuyển thành: `computeSectionOrder(safeCounts, sampleSpec)` (tính THỨ TỰ,
  ưu tiên đúng thứ tự `detectedExercises` cho các dạng giáo viên CŨNG đã chọn, dạng nào giáo viên
  chọn thêm mà mẫu không có thì xếp CUỐI theo `DEFAULT_SECTION_ORDER` - GIỮ NGUYÊN thứ tự cũ khi
  không có sampleSpec) + `buildSimpleSection(key, ctx)` (build 1 khối, dùng `switch` tra cứu theo
  key) + vòng lặp chính xử lý riêng "nhan_dien_hinh" (auto-pair) và "giai_toan" (async + answerKey).
  Áp dụng THỨ TỰ là NGẦM (không cần giáo viên bấm gì, giống cách sampleSpec đã ngầm ảnh hưởng
  layout từ trước) - KHÁC với SỐ LƯỢNG câu (`exerciseCounts`), vẫn đòi hỏi giáo viên chủ động bấm,
  không tự động ghi đè số liệu đang chỉnh tay.
- **Đã sửa - `WorksheetForm.jsx`**: thêm nút "Áp dụng cấu trúc từ phiếu mẫu (N dạng bài)" ngay
  dưới phần tóm tắt phân tích mẫu - bấm vào sẽ THAY THẾ (không cộng dồn) toàn bộ `exerciseCounts`
  bằng đúng `detectedExercises` (chỉ áp cho key có trong khối lớp đang chọn, an toàn nếu mẫu có
  dạng bài khối lớp hiện tại không hỗ trợ).
- **Đã test kỹ** (không chỉ đọc code): (1) `sanitizeWorksheetSampleSpec` với dữ liệu AI giả lập
  chứa key bịa/trùng lặp/số vô lý - xác nhận lọc đúng, giữ đúng thứ tự lần xuất hiện đầu tiên; (2)
  4 kịch bản hồi quy + tính năng mới cho `generateWorksheet()`: hành vi CŨ không đổi khi không có
  sampleSpec (bao gồm cả lọc khối lớp + auto-pairing hình từ Giai đoạn 2), thứ tự ĐÚNG theo mẫu
  khi có sampleSpec hữu ích, thứ tự mặc định giữ nguyên khi sampleSpec rỗng, và QUAN TRỌNG: không
  tự ý thêm dạng bài giáo viên chưa chọn dù mẫu có dạng đó - `exerciseCounts` (an toàn phía
  server, `safeCounts`) vẫn là nguồn sự thật duy nhất về dạng nào XUẤT HIỆN, sampleSpec chỉ quyết
  định THỨ TỰ.
- **Cache**: `worksheetSampleCache.js` là cache TRONG BỘ NHỚ (module-level Map), KHÔNG sống qua
  cold start/deploy mới -> không có rủi ro trả về spec "phiên bản cũ" (thiếu `detectedExercises`)
  sau khi đưa bản này lên, tự động sạch khi deploy.
- **Việc CHƯA làm** (còn treo lại, ngoài phạm vi "content-aware theo mẫu THẬT" của giai đoạn này):
  liên kết với SGK markdown theo chương/bài học cụ thể (roadmap Giai đoạn 5 cũ, vẫn CHƯA làm) -
  giai đoạn này chỉ giải quyết việc bám theo 1 FILE MẪU giáo viên tự upload, chưa phải bám theo
  CHƯƠNG TRÌNH SGK chính thức.

- **`mathml2omml` không escape XML đúng**: thư viện giải mã `&lt;` thành `<` nhưng quên escape lại → phá file Word bất kỳ khi nào công thức có `<`, `>`, `&` (bất đẳng thức). Đã viết `escapeMathTextNodes()` trong `exportService.js` để tự escape lại.
- **Bug thứ 2 trong chính hàm sửa trên**: regex `<m:t[^>]*>` khớp NHẦM với `<m:type .../>` (thẻ đánh dấu phân số) vì "type" cũng bắt đầu bằng "t" sau "m:". Đã sửa thành `<m:t(?:\s[^>]*)?>` (bắt buộc ranh giới rõ ràng). **Đây là lỗi dễ tái phát nếu sửa lại regex này — luôn test với cả phân số LẪN bất đẳng thức cùng lúc.**
- **`position: fixed` cho `#print-area`**: từng dùng để sửa "trang trắng đầu PDF" nhưng gây lỗi NẶNG HƠN — nội dung lặp lại trên mọi trang khi in (fixed bị in lại mỗi trang). Đã revert về `position: absolute`. Nguyên nhân THẬT của trang trắng đầu: trang đầu tiên (MatrixPage) bị ép `page-break-before` một cách vô lý — đã sửa bằng cách chỉ trang THỨ 2 trở đi mới ngắt trang.
- **`Packer.toBuffer()` vs `Packer.toBlob()`**: toBuffer là API Node.js, code chạy browser phải dùng toBlob(), dùng nhầm tạo file Word hỏng.
- **Subject bị mặc định "Toán"**: trước đây prompt luôn nói AI là "chuyên gia Toán" và hiện "Môn: Toan" (không dấu) dù đang tạo đề Sử/Văn/Anh. Đã sửa bằng `subjectProfiles.js`.
- **BarModel nhãn chênh lệch chèn vào ô**: do tính sai vị trí X (tưởng có khoảng trống nhưng bar A luôn trải hết chiều rộng). Đã sửa đặt nhãn hẳn ra ngoài mép phải.

## 5e. Giai đoạn 5 (bên ngoài) - Liên kết SGK markdown
- **Tái dùng hạ tầng có sẵn, không làm mới**: hệ thống "Giáo án" (`lessonPlanOrchestrator.js`)
  đã có sẵn ĐÚNG pattern cần thiết - tải markdown SGK best-effort qua `githubService.js`
  (`fetchMarkdownFromGitHub`/`fetchAdvancedBook`), lỗi không chặn đứng cả lượt tạo mà chỉ đẩy
  vào mảng `warnings`. `/api/chapters` (route liệt kê chương, dùng chung cho Đề thi + Giáo án)
  cũng đã đủ tổng quát để tái dùng thẳng cho Phiếu bài tập, không cần route mới.
- **`src/data/constants.js`**: thêm `WORKSHEET_GRADE_TO_SGK_GRADE` - map mã khối phiếu bài tập
  (MAM_NON/LOP_1/LOP_2) sang số lớp SGK (`lop_1`, `lop_2`...). CHỈ có LOP_1/LOP_2 (Mầm non không
  có SGK theo chương chính thức, giống nguyên tắc `isPreschoolGrade` bên Giáo án).
- **`src/services/worksheetGenerator.js`**: thêm `resolveSgkChapterContext()` (best-effort, try/
  catch quanh `fetchMarkdownFromGitHub`/`fetchAdvancedBook`, lỗi -> warning chứ không throw) +
  2 tham số mới `sgkVolume`/`sgkChapterId`. Nội dung chương SGK được ưu tiên **CAO NHẤT** làm
  ngữ cảnh cho AI soạn "giải toán có lời văn" (cao hơn cả `referenceContext` từ file mẫu upload -
  chọn đúng chương đang dạy là tín hiệu rõ ràng/chính thống hơn 1 file mẫu ngẫu nhiên). Hàm trả
  về thêm `warnings: string[]` và `sgkChapterLabel: string|null`.
- **`/api/generate-worksheet/route.js`**: pass-through `sgkVolume`/`sgkChapterId`, không có logic
  gì thêm (đúng tinh thần route mỏng, mọi orchestration nằm trong service).
- **`WorksheetForm.jsx`**: thêm 2 dropdown "Tập" + "Bài/Chương SGK (tuỳ chọn)", COPY Y NGUYÊN
  pattern UI + `fetchChaptersRequest()` đã dùng ở `LessonPlanForm.jsx` (đã kiểm định, không phát
  minh lại). Chỉ hiện khi `WORKSHEET_GRADE_TO_SGK_GRADE[grade]` tồn tại (ẩn cho Mầm non). Thêm
  hiển thị `warnings` dạng banner vàng (phân biệt với `error` đỏ - đây là cảnh báo "mềm", phiếu
  vẫn tạo được bình thường).
- **Đã test kỹ, đặc biệt tình huống THẬT của sandbox này** (chưa cấu hình
  `GITHUB_KNOWLEDGE_REPO`): (1) chọn chương SGK khi chưa cấu hình repo -> phiếu VẪN được tạo bình
  thường, có `warnings` đúng nội dung lỗi; (2) gửi `sgkChapterId` cho MAM_NON (mô phỏng gọi thẳng
  API bỏ qua UI) -> im lặng bỏ qua, KHÔNG sinh warning (không phải lỗi, chỉ là không áp dụng
  được); (3) không chọn chương SGK -> hành vi giống hệt trước Giai đoạn 5 (hồi quy sạch); (4) test
  tích hợp CẢ 3 giai đoạn cùng lúc (SGK + sampleSpec + exerciseCounts) không xung đột nhau.
- **Việc CHƯA làm** (ngoài phạm vi giai đoạn này, có thể cân nhắc sau nếu cần):
  - Chỉ ảnh hưởng NGỮ CẢNH cho "giải toán có lời văn" (dạng bài duy nhất dùng AI) - CÁC DẠNG BÀI
    THUẦN CODE khác (tính nhẩm, so sánh, dãy số...) vẫn sinh số ngẫu nhiên theo PHẠM VI CHUNG của
    cả khối lớp (VD Lớp 2 = 0-100), KHÔNG tự thu hẹp theo đúng nội dung chương đã chọn (VD chương
    "phép cộng có nhớ trong phạm vi 100" thực ra nên loại các phép tính không nhớ). Muốn làm được
    việc này cần 1 hệ thống lớn hơn nhiều - ánh xạ TỪNG chương SGK sang tham số sinh số cụ thể
    (phạm vi, có nhớ/không nhớ, loại phép tính...) - đây chính là ý tưởng `topicRegistry.js`/
    `topicActivityMap.js` đã phác thảo ở Giai đoạn 0 (bản thiết kế ĐẦU TIÊN, riêng, CHƯA merge
    vào code thật - xem file `giai-doan-0.zip` đã gửi lượt đầu) nhưng chưa triển khai thật.
  - Chưa hiện `sgkChapterLabel` lên phiếu đã tạo (VD ghi chú nhỏ "Bám theo Chương 3 - SGK Toán
    Lớp 2 Tập 1" trên `WorksheetPreview.jsx`/Word) - dữ liệu đã có sẵn ở kết quả trả về, chỉ chưa
    hiển thị, có thể bổ sung nhanh nếu giáo viên thấy cần.


## 6. Tính năng ĐANG LÀM DỞ — "Phiếu bài tập" (Mầm non - Lớp 2)
⚠️ **MỤC NÀY ĐÃ LỖI THỜI** (viết từ giai đoạn code còn chưa build/test lần nào) - danh sách
"CHƯA XONG" bên dưới hầu hết ĐÃ XONG từ lâu (đã build/test/đóng gói zip nhiều lần, xem mục
5b/5c/5d/5e để biết trạng thái THẬT hiện tại). Giữ lại nguyên văn để biết bối cảnh ban đầu, nhưng
**đừng tin danh sách "CHƯA XONG" bên dưới** - luôn ưu tiên đối chiếu với mục 5b-5e.

**Bối cảnh**: người dùng gửi mẫu phiếu bài tập tô màu, có mascot gấu/thỏ (nhà xuất bản làm). Đã thống nhất: **KHÔNG vẽ nhân vật** (tốn công, lo bản quyền) mà **dùng emoji có sẵn** (🍎⭐🚗🐥...) — đủ sinh động, miễn phí, Word/web đều render được. Đã duyệt 1 bản mockup 2 bài mẫu (khung bo góc màu + số tròn + emoji) qua Visualizer, người dùng ĐỒNG Ý.

**Phạm vi đã chốt**: Phiếu bài tập chỉ làm cho **Mầm non/Lớp 1/Lớp 2**. Lớp 3-5 dùng lại hệ thống đề thi hiện có (không cần làm thêm).

**Nguyên tắc thiết kế**: đa số dạng bài **KHÔNG cần AI** — code tự sinh số ngẫu nhiên đúng phạm vi từng khối (rẻ hơn, đáng tin cậy hơn). Chỉ "Giải toán có lời văn" cần gọi AI (cần biến hoá ngôn ngữ).

**7 dạng bài đã thiết kế** (`worksheetSchemas.js`): Tính nhẩm, Đếm và viết số, So sánh, Dãy số cách đều, Nối phép tính, Giải toán có lời văn (AI), Nhận diện hình.

**Đã xong và đã test:**
- `src/data/worksheetSchemas.js` — 3 khối lớp (MAM_NON max 10, LOP_1 max 20, LOP_2 max 100), generator thuần code cho 6/7 dạng. **Đã stress-test 500 lượt × 3 khối = 1500 lần, không lỗi (không số âm, không sai phạm vi).**
- `src/services/worksheetGenerator.js` — điều phối, gọi AI riêng cho "giải toán có lời văn" (lỗi AI không làm hỏng cả phiếu, các dạng khác vẫn còn)
- `src/app/api/generate-worksheet/route.js`
- `generateWorksheetRequest()` trong `apiClient.js`
- `src/components/WorksheetForm.jsx` — chọn khối lớp + số lượng từng dạng bài
- `src/components/WorksheetPreview.jsx` — xem trước A4, khung màu bo góc, số tròn màu (5 màu xoay vòng), dùng emoji

**CHƯA XONG (việc cần làm tiếp trong chat mới):**
1. ❌ **Chưa nối vào `page.js`** — chưa có cách chuyển đổi giữa "Đề kiểm tra" (flow cũ) và "Phiếu bài tập" (flow mới). Cần thêm mode toggle.
2. ❌ **Chưa có xuất Word cho phiếu bài tập** — cần viết `worksheetExportService.js` (dùng docx.js Table với shading màu nền, vì Word không bo góc được như CSS)
3. ❌ **Chưa build, chưa test, chưa đóng gói zip mới** — code hiện tại CHƯA CHẠY THỬ LẦN NÀO
4. ❌ Chưa kiểm tra `.a4-page`, `#print-area` trong `WorksheetPreview.jsx` có tương thích CSS in ấn hiện có không

## 7. ⚠️ LƯU Ý VẬN HÀNH QUAN TRỌNG NHẤT
**Sandbox bị reset giữa các lần trò chuyện** — mất hết code trong container. Trước khi code tiếp trong chat mới, **PHẢI khôi phục project từ file zip cuối cùng đã gửi cho người dùng** (tải lại file họ upload, hoặc nếu còn trong `/mnt/user-data/outputs/`, giải nén ra). Việc này đã xảy ra 1 lần trong phiên vừa rồi — phát hiện kịp thời nhờ kiểm tra `find` trước khi sửa file.

## 8. Bảo mật cần nhớ
- Người dùng từng lộ `GEMINI_API_KEY` thật + `GITHUB_KNOWLEDGE_REPO` sai định dạng lên **repo GitHub Public** qua file `.env.local` bị commit nhầm (thiếu `.gitignore`). Đã hướng dẫn revoke key + thêm `.gitignore`. Cần nhắc lại nếu thấy dấu hiệu tương tự.
- **[ĐÃ SỬA] Lỗ hổng auth nghiêm trọng**: trước đây MỌI API route (`generate`, `generate-worksheet`, `analyze-sample`) chỉ kiểm tra `users[username]` có tồn tại — KHÔNG xác thực mật khẩu ở các lần gọi sau, ai cũng gọi thẳng API với `{"username":"admin"}` mà không cần mật khẩu; `/api/chapters` còn public 100% không check gì. Đã sửa bằng cơ chế session token ký HMAC (`src/services/sessionToken.js`), verify qua `requireAuth()` (`src/services/apiAuth.js`) ở ĐẦU cả 4 route, client gửi kèm header `Authorization: Bearer <token>` (`apiClient.js`). Mật khẩu trong `users.json` đổi từ plaintext sang hash scrypt (`passwordHash`, xem `src/services/passwordUtils.js`) — dùng `node scripts/hash-password.js "mat_khau"` để tạo/đổi tài khoản. Thêm rate-limit chống brute-force cho `/api/login` (`src/services/loginRateLimiter.js`, best-effort vì serverless không share bộ nhớ giữa instance). **BẮT BUỘC** đặt biến môi trường `SESSION_SECRET` (xem `.env.local.example`) trước khi deploy — chưa đặt thì token ký bằng secret mặc định KHÔNG AN TOÀN (có cảnh báo console).
- Tài khoản mẫu hiện tại: `admin`/`admin123`, `gv.toan01`/`toan123` — **nên đổi mật khẩu thật trước khi đưa cho giáo viên dùng** bằng script `hash-password.js` ở trên.

## 11. Test tự động (mới thêm)
Dùng `node --test` (built-in, không cần cài Jest/Vitest) — chạy `npm test`. Chi tiết đầy đủ xem `test/README.md`. Điểm quan trọng:
- `test/xmlEscapeUtils.test.js`, `passwordUtils.test.js`, `sessionToken.test.js`, `loginRateLimiter.test.js`, `questionBankStore.test.js` — chạy được ngay, KHÔNG cần `npm install` (đã tự chạy và pass 28/28 trong lúc viết).
- **`passwordUtils.test.js` đã bắt được 1 lỗi bảo mật thật lúc viết**: `Buffer.from(hex_hỏng, "hex")` không throw mà âm thầm cắt ngắn thành buffer rỗng → `verifyPassword` trả `true` sai cho dữ liệu hash bị hỏng. Đã sửa (kiểm tra `storedBuffer.length !== KEY_LENGTH` trước khi so sánh).
- `test/exportService.docx.test.js` — test tích hợp pipeline LaTeX→OMML→.docx thật (cả phân số LẪN bất đẳng thức cùng lúc, đúng kịch bản đã lọt 2 bug trước đây). **CẦN `npm install` trước khi chạy được** — sandbox lúc viết không có mạng nên CHƯA verify chạy thật lần nào, cần tự chạy `npm test` để xác nhận trước khi tin tưởng.
- Đã tách `escapeMathTextNodes()` từ `exportService.js` sang `src/services/xmlEscapeUtils.js` (module thuần, không phụ thuộc `docx`/`temml`) để test được độc lập, và export thêm `buildExamDocxBlob` từ `exportService.js` (trước đó không export) để test gọi thẳng, không phải đi qua `exportToWord()` (dùng `saveAs`, chỉ chạy được ở browser).

## 12. Ngân hàng câu hỏi bền vững (mới thêm)
Giải quyết tồn đọng ở mục 9: "chưa có ngân hàng câu hỏi lưu trữ xuyên suốt nhiều lần tạo".
- File mới: `src/services/questionBankStore.js`. 2 backend tự động chọn theo cấu hình:
  - **Upstash Redis REST API** (khuyến nghị, free tier) — gọi thẳng bằng `fetch()`, KHÔNG cần cài `@upstash/redis` SDK. Cấu hình bằng `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (xem `.env.local.example`).
  - **File JSON local** (`.data/question-bank/`, đã thêm vào `.gitignore`) — fallback tự động khi chưa cấu hình Upstash. ⚠️ CHỈ dùng để test ở máy cá nhân, KHÔNG bền vững trên Vercel serverless.
- Nối vào `examOrchestrator.js`: đọc `getBankEntries()` TRƯỚC khi gọi `generateFullExam` (gộp vào `existingQuestions` để 3 lớp chống trùng trong `geminiEngine.js` coi các câu đã lưu từ NHỮNG LẦN TẠO TRƯỚC như đã tồn tại), ghi `appendBankEntries()` SAU khi tạo xong (await, không fire-and-forget, vì hàm serverless có thể bị dừng ngay sau khi trả response).
- Đã test nhánh local file (`test/questionBankStore.test.js`, 5/5 pass). **CHƯA test nhánh Upstash thật** (cần tài khoản Upstash thật + mạng) — nên test thủ công 1 lần sau khi cấu hình: tạo đề 2 lần liên tiếp cho CÙNG 1 chương, xem lần 2 có tự tránh trùng ý tưởng với lần 1 không.
- Giới hạn: mỗi (môn+lớp+chương) chỉ giữ tối đa 300 câu gần nhất (FIFO), tránh phình to vô hạn.

## 13. Cảnh báo mức dùng quota Gemini (mới thêm)
- File mới: `src/services/geminiUsageTracker.js` (dùng chung backend Upstash/local với `questionBankStore.js` qua `src/services/upstashClient.js` mới tách ra) + `src/app/api/usage/route.js` + `src/components/UsageWidget.jsx` (hiển thị trong sidebar trang chính, dưới form tạo đề).
- **CHỦ Ý không hiển thị "còn lại bao nhiêu % quota"** so với 1 con số hạn mức Google cố định — hạn mức free tier của Google từng bị âm thầm cắt giảm (xem mục 5), so với số có thể đã lỗi thời sẽ gây hiểu lầm. Thay vào đó hiển thị: tổng lượt gọi hôm nay, số lượt/từng key, và **số lần bị từ chối do hết hạn mức thật** (429/RESOURCE_EXHAUSTED) - tín hiệu đáng tin hơn nhiều.
- `geminiKeyPool.js`: mỗi lần gọi (thành công lẫn thất bại) đều gọi `recordGeminiCall()` (không throw, không làm chậm luồng chính đáng kể). Khi TOÀN BỘ key trong pool cùng hết quota ở 1 lượt gọi, lỗi ném ra được gắn cờ `err.allKeysExhausted = true`.
- `geminiEngine.js`: bắt cờ `allKeysExhausted` này (trước đây bị "nuốt" âm thầm trong vòng lặp retry, chỉ ra warning chung chung "do trùng lặp nhiều hoặc lỗi API") → giờ cảnh báo CỤ THỂ "do TẤT CẢ API key Gemini đã hết hạn mức hôm nay" khi đúng là nguyên nhân đó, giáo viên biết ngay cần chờ qua ngày mai hoặc thêm key mới thay vì đoán mò.
- Test: `test/geminiUsageTracker.test.js` (nhánh local, 5/5 pass). Route `/api/usage` yêu cầu đăng nhập (dùng `requireAuth`), không cần quyền admin riêng (nhóm giáo viên nhỏ, tin cậy).

## 9. Đánh giá còn tồn đọng (đã trao đổi với người dùng)
- Chưa có bộ test tự động cố định cho `exportService.js` (mọi lần test đều làm bằng sandbox tạm rồi xoá — đây là lý do 2 bug Word liên tiếp lọt qua)
- Chưa test thật đề Lịch sử/Tiếng Anh/Tiếng Việt (mới sửa xong bug subject, chưa ai tạo đề thật)
- Chưa có ngân hàng câu hỏi lưu trữ xuyên suốt nhiều lần tạo (chỉ chống trùng trong 1 lần tạo)

**⚠️ Ghi chú soát lại (chat sau)**: khi review code trong zip, mục 6/9/10 bên dưới có phần đã LỖI THỜI — thực tế trong zip `page.js` ĐÃ có mode toggle Đề thi/Phiếu bài tập, `worksheetExportService.js` ĐÃ được viết khá đầy đủ (đồng bộ màu với `WorksheetPreview.jsx`). Trước khi làm tiếp theo checklist mục 10, hãy tự kiểm tra lại code hiện có trong zip TRƯỚC, đừng mặc định các mục "CHƯA XONG" bên dưới vẫn còn đúng.

## 10. Việc cần làm ngay khi tiếp tục ở chat mới
1. Khôi phục project từ zip cuối cùng (xem mục 7)
2. Áp lại các file `worksheetSchemas.js`, `worksheetGenerator.js`, route `generate-worksheet`, `WorksheetForm.jsx`, `WorksheetPreview.jsx`, `apiClient.js` đã cập nhật (nếu chưa có trong zip khôi phục — nhiều khả năng CHƯA vì các file này được tạo SAU zip cuối cùng)
3. Viết `worksheetExportService.js`
4. Thêm mode toggle trong `page.js`
5. Build + test (LibreOffice convert PDF để kiểm tra Word thật, giống cách đã làm mọi lần trước)
6. Đóng gói zip mới, gửi người dùng
