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
- **`mathml2omml` không escape XML đúng**: thư viện giải mã `&lt;` thành `<` nhưng quên escape lại → phá file Word bất kỳ khi nào công thức có `<`, `>`, `&` (bất đẳng thức). Đã viết `escapeMathTextNodes()` trong `exportService.js` để tự escape lại.
- **Bug thứ 2 trong chính hàm sửa trên**: regex `<m:t[^>]*>` khớp NHẦM với `<m:type .../>` (thẻ đánh dấu phân số) vì "type" cũng bắt đầu bằng "t" sau "m:". Đã sửa thành `<m:t(?:\s[^>]*)?>` (bắt buộc ranh giới rõ ràng). **Đây là lỗi dễ tái phát nếu sửa lại regex này — luôn test với cả phân số LẪN bất đẳng thức cùng lúc.**
- **`position: fixed` cho `#print-area`**: từng dùng để sửa "trang trắng đầu PDF" nhưng gây lỗi NẶNG HƠN — nội dung lặp lại trên mọi trang khi in (fixed bị in lại mỗi trang). Đã revert về `position: absolute`. Nguyên nhân THẬT của trang trắng đầu: trang đầu tiên (MatrixPage) bị ép `page-break-before` một cách vô lý — đã sửa bằng cách chỉ trang THỨ 2 trở đi mới ngắt trang.
- **`Packer.toBuffer()` vs `Packer.toBlob()`**: toBuffer là API Node.js, code chạy browser phải dùng toBlob(), dùng nhầm tạo file Word hỏng.
- **Subject bị mặc định "Toán"**: trước đây prompt luôn nói AI là "chuyên gia Toán" và hiện "Môn: Toan" (không dấu) dù đang tạo đề Sử/Văn/Anh. Đã sửa bằng `subjectProfiles.js`.
- **BarModel nhãn chênh lệch chèn vào ô**: do tính sai vị trí X (tưởng có khoảng trống nhưng bar A luôn trải hết chiều rộng). Đã sửa đặt nhãn hẳn ra ngoài mép phải.

## 6. Tính năng ĐANG LÀM DỞ — "Phiếu bài tập" (Mầm non - Lớp 2)
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
