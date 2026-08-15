# AI Exam Generator — Tóm tắt dự án (bản cập nhật sau khi hoàn tất 4 việc bảo mật còn thiếu +
# viết test riêng cho Việc 6/7 Giai đoạn 10 — theo đúng "Việc CHƯA làm" ghi ở mục 0.-5. bên dưới)

## 0.-6. MỚI NHẤT — Hoàn tất rate-limit theo giáo viên, trần số câu/bài/tiết mỗi lượt gọi,
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
