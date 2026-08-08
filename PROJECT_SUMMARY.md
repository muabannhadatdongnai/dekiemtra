# AI Exam Generator — Tóm tắt dự án (bản cập nhật sau khi rà soát zip `ai-exam-generator-giaidoan6.zip`)

> ⚠️ Bản `PROJECT_SUMMARY.md` từng đóng gói SẴN trong zip giaidoan6 đã LỖI THỜI khá nhiều so với
> nội dung dưới đây (nó vẫn còn nhắc "Phiếu bài tập CHƯA nối vào page.js" — thực ra đã xong từ
> lâu). Bản này là bản ĐÚNG NHẤT tính đến thời điểm rà soát — dùng bản này làm nguồn tin cậy khi
> mở chat mới, không dùng bản cũ đóng gói sẵn trong zip.

## 1. Tổng quan
Next.js 14 (App Router) app tạo đề kiểm tra + phiếu bài tập + giáo án bằng AI cho giáo viên Việt
Nam, mục tiêu chi phí vận hành **$0**. Deploy Vercel. AI backbone: Gemini (`gemini-3.5-flash`, SDK
`@google/genai`) qua pool nhiều API key.

**3 mode trong `page.js`**, chỉ 1 mount tại 1 thời điểm (dùng chung `id="print-area"`):
1. **📝 Đề kiểm tra** (Lớp 1-12) — luồng gốc, đầy đủ nhất, ổn định nhất.
2. **🧮 Phiếu bài tập** (Mầm non - Lớp 2) — sinh số liệu chủ yếu thuần code, không cần AI.
3. **📘 Soạn giáo án** (Mầm non - Lớp 5) — 8 "tích hợp" tuỳ chọn kiểu plugin (`lessonPlanIntegrations.js`).

*(Mode thứ 4 "📖 Đề Tiếng Việt Tiểu học" — xem PHẦN B bên dưới — **CHƯA có dòng code nào**, vẫn
đang ở giai đoạn lên kế hoạch.)*

## 2. Cấu trúc thư mục (đã đối chiếu thực tế với zip giaidoan6, không đổi so với giaidoan4)
```
src/
├── app/{page.js, api/{login,chapters,generate,generate-worksheet,generate-lesson-plan,usage,
│        analyze-sample,analyze-worksheet-sample,worksheet-preference}}
├── components/{Header,LoginForm,UsageWidget,ExamMatrixForm,A4LivePreview,ExportActions,
│        WorksheetForm,WorksheetPreview,WorksheetExportActions,
│        LessonPlanForm,LessonPlanPreview,LessonPlanExportActions,
│        visuals/{VerticalArithmetic,NumberTriangle,BarModel,VisualCounting,ScratchGrid,QuestionVisual}}
├── services/{apiClient,authService,apiAuth,sessionToken,passwordUtils,loginRateLimiter,
│        githubService,geminiEngine,geminiKeyPool,geminiUsageTracker,examOrchestrator,
│        exportService,visualExportBuilders,specificationBuilder,specificationExportBuilders,
│        xmlEscapeUtils,latexUtils,worksheetGenerator,worksheetExportService,
│        worksheetSampleAnalyzer,worksheetSampleCache,sampleExamAnalyzer,sampleExamCache,
│        teacherPreferenceStore,questionBankStore,upstashClient,
│        lessonPlanEngine,lessonPlanOrchestrator,lessonPlanExportService,
│        fileTextExtractors,scoringUtils(không dùng)}
└── data/{config,constants,gradeProfiles,subjectProfiles,promptTemplates,visualSchemas,
        sampleExamSchema,worksheetSampleSchema,worksheetSchemas,worksheetExerciseCatalog,
        worksheetLayoutTemplates,lessonPlanBlueprint,lessonPlanResult,lessonPlanTemplates,
        lessonPlanPromptTemplates,lessonPlanIntegrations,examBlueprint,examResult,users.json}
```

## 3. Tính năng "Soạn giáo án" (Mầm non - Lớp 5) — như bản mô tả trước, không đổi
Xem chi tiết đầy đủ trong lịch sử trước đó (input, 8 tích hợp, phân biệt lỗi 429 vs 503,
`lessonPlanOrchestrator.js` không chặn cả giáo án nếu SGK tải lỗi). **Vẫn CHƯA có ghi chú xác
nhận đã gọi Gemini thật cho luồng này** — cần người dùng xác nhận đã test tay chưa.

## 4. Phân tích đề/phiếu mẫu upload — như bản mô tả trước, không đổi
`sampleExamAnalyzer.js` / `worksheetSampleAnalyzer.js`, gọi Gemini đúng 1 lần, `priority="analyze"`,
prompt cấm chép nguyên văn, đã nối vào `examOrchestrator.js` (fallback về Ma trận Chương nếu spec
không hợp lệ).

## 5. Vấn đề kiến trúc đang chờ xử lý — VẪN CÒN NGUYÊN (đã tự kiểm chứng lại lần nữa hôm nay)
`allowVisual` trong `gradeProfiles.js` **vẫn chỉ gate theo khối lớp** (Họ A = Mầm non-Lớp5 = true,
Họ B = Lớp6-12 = false), dùng ở đúng 1 chỗ (`examOrchestrator.js` dòng ~52), **hoàn toàn không xét
môn học**. Chưa có dòng code nào thay đổi việc này — vẫn là quyết định cần chốt trước Phần B/mục D.

## 6. ✅ MỚI — Kết quả rà soát code + tự chạy test thật ngày hôm nay

### 6.1. `npm test` TRƯỚC ĐÂY thực ra KHÔNG chạy được gì cả trên Node 22 — đã sửa
Phát hiện quan trọng nhất: lệnh `"test": "node --test test/"` trong `package.json` — khi tự cài
đặt (`npm install`, 212 packages, không lỗi) và tự chạy `npm test` trên Node v22.22.2 — **báo
`0 pass / 1 fail`, không nhận diện được bất kỳ file test nào trong thư mục `test/`**. Đã cô lập
lỗi lại bằng thư mục demo trống để xác nhận: đây là hành vi thật của `node --test <thư_mục>/` trên
bản Node 22 này (không liên quan gì đến code của dự án), không phải như ghi nhớ trước đây rằng
"36/37 test pass, chỉ 1 bài lỗi alias" — con số đó thực ra chưa từng được xác nhận trên Node 22.
**Đã sửa**: đổi script test sang liệt kê glob rõ ràng `node --test test/*.test.js` — cách này
chạy đúng trên Node 22, và vẫn tương thích ngược với các bản Node cũ hơn.

### 6.2. `exportService.docx.test.js` — bài test QUAN TRỌNG NHẤT — lần đầu tiên chạy PASS thật
Ghi nhớ cũ nói bài test này lỗi vì alias `@/data` không resolve được. Sau khi đào sâu, hoá ra có
**3 lớp lỗi resolve xếp chồng lên nhau** (không phải chỉ 1) khiến Node ESM thuần (không qua
Next.js/webpack) không chạy nổi `exportService.js`:
1. Alias `@/data/constants` — Next.js hiểu qua `jsconfig.json`, Node thuần thì không biết.
2. Import tương đối BỎ ĐUÔI FILE kiểu `./latexUtils` (không phải `./latexUtils.js`) — Next.js/
   webpack cho phép, Node ESM thuần bắt buộc phải có đuôi rõ ràng.
3. Gói `file-saver` là UMD/CJS, không có "named export" mà Node ESM hiểu được (`import { saveAs }`
   thất bại) — chỉ chạy được qua bundler như webpack.

**Đã sửa bằng cách thêm 1 Node loader hook CHỈ DÙNG KHI TEST** (`test/resolve-alias-hooks.mjs` +
`test/register-loader.mjs`, nạp qua cờ `--import` trong script `test`), **KHÔNG sửa bất kỳ dòng
import nào trong code production** (`exportService.js` vẫn giữ nguyên `@/data/constants`,
`./latexUtils`, `saveAs` từ `file-saver` — Next.js build thật không bị ảnh hưởng gì):
- Hook tự đổi `@/...` → đường dẫn thật trong `src/`.
- Hook thử resolve bình thường trước, nếu thiếu file mới thử lại với `.js` phía sau (không cần
  biết trước specifier nào thiếu đuôi).
- Riêng `file-saver` được trỏ sang 1 shim nội bộ `test/shims/file-saver.mjs` (hàm `saveAs()`
  no-op) — vì hàm này vốn chỉ có tác dụng ở trình duyệt (kích hoạt tải file), không liên quan gì
  đến logic đang được test (`buildExamDocxBlob` chỉ cần trả về đúng buffer .docx).

**Kết quả sau khi sửa cả 2 việc trên: `npm test` chạy sạch 38/38 pass** (tăng từ 37 lên 38 vì bài
test docx tách thành 2 test case con giờ đều chạy, trước đây bị đếm gộp là 1 "not ok" duy nhất).
Đây là lần đầu tiên pipeline LaTeX→OMML→.docx (chính bài test được viết ra để bắt lại 2 bug Word
đã từng lọt trước đây) thực sự được xác minh chạy đúng bằng test tự động, không phải chỉ đọc code.

**File mới cần đưa vào zip lần sau**: `test/register-loader.mjs`, `test/resolve-alias-hooks.mjs`,
`test/shims/file-saver.mjs`, và `package.json` đã sửa dòng script `test`.

### 6.3. `.gitignore` — hoàn toàn KHÔNG CÓ trong zip giaidoan6
Đã kiểm tra kỹ: zip `ai-exam-generator-giaidoan6.zip` **không chứa file `.gitignore` nào**, kể cả
ở gốc project. Đây là đúng loại lỗ hổng đã từng gây ra sự cố lộ `GEMINI_API_KEY` thật lên GitHub
Public trước đây (xem mục bảo mật ở các bản tóm tắt trước) — nếu thư mục hiện tại của người dùng
trên máy thật CŨNG thiếu file này (không chỉ do lỗi đóng gói zip), commit tiếp theo có nguy cơ lộ
`.env.local` lần nữa. Đã tự tạo lại `.gitignore` (che `.env`, `.env.local`, `/node_modules`,
`/.next/`, `/.data/` — thư mục ngân hàng câu hỏi local, `/out/`) và đính kèm trong bản cập nhật.
**Việc cần làm ngay**: người dùng tự kiểm tra xem `.gitignore` có tồn tại trên máy/repo GitHub
thật hay không — nếu KHÔNG, đây là ưu tiên cao nhất trước khi commit bất cứ thứ gì tiếp theo.

### 6.4. Đã xác nhận LẠI (không đổi so với ghi nhớ cũ)
- `allowVisual` vẫn chỉ gate theo khối, không theo môn (mục 5) — vẫn đúng, chưa ai sửa.
- Không có secret thật (API key dạng `AIza...`, token GitHub...) bị lộ trong `.env.local.example`.

---

# PHẦN B — Kế hoạch mở rộng "Đề kiểm tra"

*(Giữ nguyên nội dung đầy đủ mục A–E đã thống nhất ở phiên thảo luận trước — 3 khoảng trống đã
xác nhận so với đề mẫu thật: ô "Nội dung kiến thức" + "Yêu cầu bổ sung", ô "Mục tiêu", và cấu trúc
4-khối riêng cho đề Tiếng Việt Tiểu học (Đọc thành tiếng [tĩnh] / Đọc thầm [AI] / Chính tả [tĩnh] /
Tập làm văn [AI nhẹ]). Nguyên tắc thiết kế: mỗi khối = 1 file độc lập, giống khuôn đã dùng thành
công cho `lessonPlanIntegrations.js` và `components/visuals/`. Tách thành mode thứ 4 riêng, không
sửa luồng "Đề kiểm tra" hiện tại đang ổn định. Lộ trình: Giai đoạn 1 (3 việc nhỏ trong luồng cũ) →
Giai đoạn 2 (dựng khung mode mới → khối "Đọc thầm" trước → 3 khối còn lại sau). Xem bản đầy đủ
trong lịch sử trò chuyện nếu cần tra lại nguyên văn — không rút gọn thêm ở đây để tránh mất chi
tiết khi mở chat mới.)*

## ✅ Giai đoạn 1 — ĐÃ XONG (3/3 việc, đã tự build + test thật, không chỉ đọc code)

### 1. Ô "Nội dung kiến thức" — xong
Free-text, giáo viên gõ tay, SONG SONG với chọn Chương (không bắt buộc, không thay thế
`chapterMatrix`). CÓ gửi lên AI. Luồng đi qua:
`ExamMatrixForm.jsx` (state `knowledgeContent` + textarea, đặt ngay trên "Chương / Bài học") →
`examBlueprint.js` (`buildExamBlueprint`) → `/api/generate/route.js` → `examOrchestrator.js`
(chỉ đi xuyên qua, không có quyết định tầng trên nào áp dụng cho trường này) → `geminiEngine.js`
(`generateFullExam` → `generateQuestionsForLevel`) → `promptTemplates.js`
(`buildKnowledgeContentGuidance`, chèn ngay sau khối "THÔNG TIN ĐỀ", trước nguồn tài liệu từng
chương — vai trò: "trọng tâm hoá" thêm, KHÔNG thay nguồn kiến thức).

### 2. Ô "Yêu cầu bổ sung" — xong
Free-text, chèn Ở CUỐI prompt (giống cách `buildSampleExamGuidance` đã làm cho phong cách đề
mẫu) — dặn dò áp dụng cho toàn bộ đề. Cùng luồng file như mục 1, thêm state `extraRequirements`
+ textarea trong `ExamMatrixForm.jsx` (đặt ngay trên 2 checkbox "câu hỏi trực quan"/"tạo đáp án"),
hàm `buildExtraRequirementsGuidance` trong `promptTemplates.js`.

### 3. Ô "Mục tiêu" — xong
Free-text, giáo viên tự gõ, **KHÔNG gửi lên AI** (đúng như đã chốt — tránh AI tự bịa câu chữ hành
chính). Chỉ đi qua `meta` (giống `schoolName`/`className`, KHÔNG qua `examBlueprint.js`):
`ExamMatrixForm.jsx` (state `examObjective` + textarea trong "Thông tin chung", gán vào
`meta.objective` khi build `ExamResult`) → hiển thị ở `A4LivePreview.jsx`
(`.gdt-exam-objective`, in ngay dưới tên trường trong header) → xuất Word ở `exportService.js`
(`buildExamDocxBlob` nhận `objective`, in thành 1 đoạn in nghiêng ngay dưới tên trường) —
truyền qua bởi `ExportActions.jsx` (`params.objective = examMeta?.objective`).

### Đã tự xác minh thật (không chỉ đọc code)
- `npm install` + `npm run build` (Next.js 14.2.35): **build sạch, không lỗi cú pháp/type**.
- `npm test`: vẫn **38/38 pass** — không có test nào bị hỏng bởi thay đổi này (không đụng vào
  logic chống trùng/export cũ, chỉ thêm field mới có default rỗng = hành vi cũ y nguyên khi không
  điền gì).
- Tự viết 1 script gọi thẳng `buildExamPrompt()` (qua đúng loader hook `test/register-loader.mjs`
  có sẵn) với `knowledgeContent`/`extraRequirements` có giá trị → xác nhận cả 2 đoạn hướng dẫn
  xuất hiện đúng vị trí trong prompt thật; gọi lại KHÔNG truyền gì → xác nhận prompt giống hệt
  hành vi cũ (không có đoạn rỗng thừa).
- Tự gọi thẳng `buildExamDocxBlob()` với `objective` có giá trị → giải nén blob `.docx` thật ra,
  soi `word/document.xml` → xác nhận dòng "Mục tiêu" CÓ THẬT trong XML (không chỉ nằm trong code
  chưa chạy).

### Việc CHƯA làm, cần giáo viên tự kiểm tra thêm
- Chưa test bằng mắt trên trình duyệt thật (`npm run dev`) — 3 ô mới đặt ở vị trí nào trong form,
  chữ tiếng Việt có xuống dòng/hiển thị đẹp trên điện thoại hay không, mới chỉ xác nhận qua build +
  script gọi hàm trực tiếp, chưa qua UI thật.
- Chưa gọi Gemini thật với `knowledgeContent`/`extraRequirements` có giá trị để xem AI có tuân thủ
  đúng hướng dẫn hay không (mới xác nhận ĐÚNG NỘI DUNG PROMPT được build ra, chưa xác nhận AI phản
  hồi lại đúng ý — cần `GEMINI_API_KEYS` thật để test bước này).

**Trạng thái**: Giai đoạn 1 xong cả 3/3 mục. Sẵn sàng bắt đầu Giai đoạn 2 (mode thứ 4 "📖 Đề Tiếng
Việt Tiểu học") trong lần làm tiếp theo — bắt đầu từ việc dựng khung mode mới + "danh bạ khối" +
"người điều phối" rỗng, sau đó làm khối "Đọc thầm" trước tiên.

---

## ✅ Giai đoạn 2 — ĐỦ 4/4 KHỐI (Bước 1 + Bước 2 + Bước 3 đều xong, CHƯA test Gemini thật)

### Bước 1 — Dựng khung mode thứ 4 "📖 Đề Tiếng Việt Tiểu học" — xong
Đúng nguyên tắc đã chốt ("mỗi khối 1 file độc lập, ghép tuỳ ý"), theo khuôn `lessonPlanIntegrations.js`
(registry) + `components/visuals/` + `QuestionVisual.jsx` (dispatcher hiển thị):

- **`src/data/vietnameseExamBlocks.js`** — "danh bạ khối": 4 entry (`docThanhTieng`, `docTham`,
  `chinhTa`, `tapLamVan`), mỗi entry tự khai báo `label`, `description`, `isAiGenerated`,
  `implemented`. Thêm khối mới = thêm 1 entry ở đây, không sửa nơi khác.
- **`src/services/vietnameseExamOrchestrator.js`** — "người điều phối": đọc danh bạ, gọi đúng hàm
  sinh trong `BLOCK_GENERATORS` cho từng khối đã chọn, gom kết quả theo key. **Không biết và không
  cần biết bên trong từng khối viết gì** (đúng yêu cầu đã chốt) — lỗi 1 khối không làm hỏng khối
  khác (try/catch riêng từng khối).
- **`src/components/VietnameseExamPreview.jsx`** — "người điều phối" hiển thị, y hệt tinh thần
  `QuestionVisual.jsx`: duyệt danh bạ theo thứ tự A. Đọc → B. Viết, khối nào có dữ liệu thì gọi
  đúng component riêng (`BLOCK_VIEWS`).
- **`src/services/vietnameseExamExportService.js`** — "người điều phối" xuất Word, cùng tinh thần:
  duyệt danh bạ, khối nào có dữ liệu thì gọi đúng builder riêng (`BLOCK_EXPORTERS`), nối các mảng
  `Paragraph` lại. Dùng chung `PAGE_A4_MM`/`PAGE_MARGIN_MM` từ `constants.js` (khớp khổ giấy A4 với
  3 luồng kia).
- **`src/data/vietnameseExamBlueprint.js`** / **`vietnameseExamResult.js`** — cùng triết lý
  `examBlueprint.js`/`examResult.js`: 1 nơi duy nhất định nghĩa input/output, gộp toàn bộ dữ liệu
  thành 1 object duy nhất thay vì nhiều `useState()` rời rạc.
- **`src/app/api/generate-vietnamese-exam/route.js`** — route mới, cùng khuôn
  `generate-lesson-plan/route.js` (auth, validate input, phân biệt lỗi hết quota/quá tải).
- **`src/components/VietnameseExamForm.jsx`** — form mới: chọn Lớp (1-5) + tick chọn khối (đọc
  TRỰC TIẾP từ danh bạ — khối `implemented: false` hiển thị mờ + nhãn "sắp có", không cho tick).
- **`src/app/page.js`** — thêm mode thứ 4 `VIETNAMESE_EXAM` vào `MODES`, tab "📖 Đề Tiếng Việt Tiểu
  học", state `vietnameseExamResult` riêng biệt (không đụng 3 luồng cũ).

### Bước 2 — Khối "Đọc thầm" (khối đầu tiên, phép thử cho cách thiết kế) — xong
- **`src/services/vietnameseBlocks/docThamBlock.js`** — TỰ CHỨA toàn bộ: prompt riêng (không dùng
  chung `buildExamPrompt()`/`buildLessonPlanPrompt()`), gọi `generateContentWithFailover()` trực
  tiếp, validate + retry + phân biệt lỗi hết quota (429)/quá tải (503) y hệt `geminiEngine.js`/
  `lessonPlanEngine.js`. AI tự viết ngữ liệu MỚI (120-220 chữ, không chép nguyên văn tác phẩm có
  bản quyền) + 7-10 câu hỏi trải đều 3 mức độ (nhận biết/thông hiểu/vận dụng), đa số trắc nghiệm
  4 lựa chọn, xen 1-2 câu tự luận ở mức vận dụng.
- **`src/components/vietnameseBlocks/DocThamBlockView.jsx`** — hiển thị riêng, chỉ nhận
  `data = results.docTham`, không biết `results` đầy đủ chứa gì.
- **`src/services/vietnameseBlocks/docThamExport.js`** — builder Word riêng, chỉ trả về mảng
  `Paragraph`, không tự dựng `Document` (việc đó là của `vietnameseExamExportService.js`).
- Trong `VietnameseExamForm.jsx`, khi tick "Đọc thầm" thì hiện thêm 2 ô riêng của khối này: "Chủ
  đề" (tuỳ chọn) + "Số câu hỏi" (7-10) — 2 ô này CHỈ thuộc về khối Đọc thầm, khối khác sau này tự
  thêm ô riêng của nó mà không đụng vào đây.

### Đã tự xác minh thật (không chỉ đọc code)
- `npm run build` (Next.js 14.2.35): **build sạch**, route `/api/generate-vietnamese-exam` được
  nhận diện đúng trong danh sách route.
- `npm test`: vẫn **38/38 pass** — không đụng gì tới 3 luồng cũ (Đề kiểm tra/Phiếu bài tập/Giáo án
  hoàn toàn tách biệt, state riêng trong `page.js`).
- Tự gọi thẳng `listBlocks()`/`getBlock()` → xác nhận đúng 4 khối, đúng thứ tự A→B, đúng cờ
  `implemented` (chỉ `docTham` = true).
- Tự gọi thẳng `orchestrateVietnameseExamGeneration()` với 1 khối đã triển khai (`docTham`) + 1
  khối chưa triển khai (`chinhTa`) + 1 khối không tồn tại (`khoiKhongTonTai`) → xác nhận: khối
  chưa triển khai và khối không tồn tại đều bị bỏ qua kèm cảnh báo tiếng Việt rõ ràng, KHÔNG làm
  crash cả lượt tạo; khối `docTham` gọi đúng đường (prompt dựng xong, gọi tới `geminiKeyPool`) và
  khi thiếu `GEMINI_API_KEYS` (đúng tình trạng sandbox hiện tại) trả về lỗi tiếng Việt dễ hiểu thay
  vì crash hoặc lộ lỗi kỹ thuật thô.
- Tự gọi thẳng `buildVietnameseExamDocxSections()` với dữ liệu mẫu mô phỏng đúng schema AI trả về
  (ngữ liệu + câu hỏi trắc nghiệm + câu tự luận) → giải nén blob `.docx` thật, soi
  `word/document.xml` → xác nhận CÓ THẬT: tiêu đề đề thi, tiêu đề+nội dung ngữ liệu, câu hỏi trắc
  nghiệm, đủ 4 lựa chọn A/B/C/D, dòng chấm cho câu tự luận.

### Bước 3 — 3 khối còn lại: "Đọc thành tiếng", "Chính tả", "Tập làm văn" — xong (đủ 4/4 khối)

- **`docThanhTiengBlock.js`** (TĨNH, không AI) — giáo viên chỉ cần nhập "Tên bài tập đọc", hệ
  thống định dạng lại thành 1 khối có hướng dẫn giám thị cố định (bốc thăm đọc ~90-100 tiếng + trả
  lời 1 câu hỏi miệng). Có validate: thiếu tên bài → báo lỗi rõ ràng, không tạo ra khối rỗng.
- **`chinhTaBlock.js`** (TĨNH, không AI - **CỐ Ý**) — khác với "Đọc thầm"/"Tập làm văn", khối này
  **KHÔNG dùng AI để viết nội dung** vì mục đích bài chính tả là kiểm tra nghe/nhớ ĐÚNG NGUYÊN VĂN
  1 đoạn có sẵn trong SGK - để AI tự "sáng tác lại" sẽ sai mục đích bài tập VÀ có rủi ro tái tạo
  văn bản có bản quyền của NXB Giáo dục. Giáo viên tự gõ/dán "Tên bài" + "Nội dung đoạn chính tả"
  (nguyên văn từ SGK họ đang dùng), hệ thống chỉ hiển thị/xuất lại nguyên vẹn - đã ghi rõ lý do
  này ngay trong comment đầu file `chinhTaBlock.js` để không ai (kể cả AI ở phiên sau) vô tình
  "cải tiến" bằng cách thêm AI vào khối này.
- **`tapLamVanBlock.js`** (AI NHẸ) — CHỈ sinh 1 đề bài (1 câu) + gợi ý dàn ý ngắn 3-4 ý (KHÔNG sinh
  bài văn mẫu hoàn chỉnh, tránh học sinh chép nguyên) - đúng như đã chốt "AI nhẹ". Giáo viên có thể
  chỉ định trước "Thể loại" (tả cảnh/tả người/kể chuyện/viết thư) + "Chủ đề", hoặc để AI tự chọn.
  Cùng cơ chế retry + phân biệt lỗi hết quota/quá tải như `docThamBlock.js`.
- Mỗi khối có đủ 3 phần TỰ CHỨA đúng nguyên tắc: hàm sinh (`services/vietnameseBlocks/`), hiển thị
  riêng (`components/vietnameseBlocks/*BlockView.jsx`), builder Word riêng
  (`services/vietnameseBlocks/*Export.js`) - đã nối cả 3 vào danh bạ/2 "người điều phối"
  (`vietnameseExamOrchestrator.js` + `VietnameseExamPreview.jsx` + `vietnameseExamExportService.js`)
  bằng đúng 1 dòng mỗi nơi, không sửa logic điều phối đã có.
- `vietnameseExamBlocks.js`: cả 4 khối giờ `implemented: true`.
- `VietnameseExamForm.jsx`: mặc định tick sẵn cả 4 khối (đúng cấu trúc đề Tiếng Việt Tiểu học đầy
  đủ thật: A. Đọc + B. Viết) - giáo viên tự bỏ tick khối không cần. Mỗi khối có ô input riêng, có
  validate ở client trước khi gửi (VD: thiếu "Tên bài tập đọc" hoặc "Nội dung chính tả" thì báo lỗi
  ngay, không tốn lượt gọi API).

### Đã tự xác minh thật (không chỉ đọc code) - LẦN 2
- `npm run build` + `npm test`: vẫn build sạch, vẫn **38/38 pass**.
- Gọi thẳng `orchestrateVietnameseExamGeneration()` với 2 khối TĨNH (`docThanhTieng` + `chinhTa`,
  không cần Gemini) → xác nhận chạy thành công thật, trả đúng dữ liệu, `warnings` rỗng.
- Gọi lại với `docThanhTieng` thiếu "Tên bài" → xác nhận báo lỗi tiếng Việt rõ ràng, không crash,
  `results` rỗng (đúng hành vi mong muốn: validate chặn trước khi tạo ra khối vô nghĩa).
- Gọi với ĐỦ CẢ 4 khối cùng lúc (2 khối AI sẽ fail vì sandbox thiếu `GEMINI_API_KEYS`, 2 khối tĩnh
  phải vẫn thành công) → xác nhận ĐÚNG: `results` chỉ có 2 khối tĩnh, đúng 2 cảnh báo cho 2 khối
  AI - **xác nhận thật nguyên tắc "lỗi 1 khối không làm hỏng khối khác"**, không phải chỉ đọc code.
- Gọi thẳng `buildVietnameseExamDocxSections()` với dữ liệu mẫu ĐỦ CẢ 4 khối → giải nén `.docx`
  thật, soi `word/document.xml` → xác nhận: cả 4 khối đều CÓ THẬT trong file Word, và **đúng thứ tự
  A. Đọc thành tiếng → A. Đọc thầm → B. Chính tả → B. Tập làm văn** (kiểm tra bằng vị trí index
  trong XML thật, không suy đoán).

### Việc CHƯA làm — quan trọng nhất, cần làm ở phiên tiếp theo hoặc khi có API key thật
1. **Chưa gọi Gemini THẬT** cho cả 2 khối cần AI ("Đọc thầm" + "Tập làm văn") — sandbox này không
   có `GEMINI_API_KEYS` cấu hình VÀ mạng bị giới hạn domain (không có quyền gọi
   `generativelanguage.googleapis.com`), nên chỉ xác nhận được ĐƯỜNG ĐI đúng (prompt dựng đúng, lỗi
   được bắt đúng, không crash), CHƯA xác nhận được CHẤT LƯỢNG nội dung AI trả về thật (ngữ liệu Đọc
   thầm có hay/đúng lứa tuổi không, câu hỏi có bám sát đoạn văn không, đề Tập làm văn có phù hợp
   không, JSON có đúng schema 100% qua nhiều lần thử không). **Đây là việc quan trọng nhất cần bạn
   tự làm** — chạy `npm run dev` với `GEMINI_API_KEYS` thật, thử cả 4 khối, đọc kỹ nội dung AI trả
   về xem có ổn không trước khi coi là "xong" thật sự.
2. Chưa xem bằng mắt trên trình duyệt thật (`npm run dev`) — form dài hơn hẳn giờ có đủ 4 khối, cần
   xác nhận: giao diện có rối không, tick/bỏ tick khối có mượt không, chữ tiếng Việt trong ô
   "Nội dung đoạn chính tả" (textarea) có hiển thị đẹp không, và đặc biệt **trang preview/Word có
   bị tràn trang khi đủ cả 4 khối cùng lúc không** (mới test qua script gọi hàm, chưa xem bản in
   thật).
3. Chưa quyết định "4 mã đề" (A/B/C/D) cho mode này, chưa quyết định chống trùng ngữ liệu Đọc thầm/
   đề Tập làm văn qua nhiều lần tạo (giống ngân hàng câu hỏi ở luồng "Đề kiểm tra" chính) — đúng
   như đã ghi trong kế hoạch gốc, để bàn sau khi có kết quả test Gemini thật (mục 1).
4. Chưa khảo sát THCS/THPT Ngữ Văn có cần cấu trúc tương tự không — vẫn để sau như kế hoạch gốc.
5. Chưa viết test tự động (`node --test`) riêng cho 4 khối này — mới verify bằng script gọi hàm thủ
   công trong phiên làm việc này, chưa có trong bộ `test/*.test.js` chạy lại được mỗi lần `npm test`
   sau này. Nên cân nhắc thêm ở phiên sau để không phải verify thủ công lại từ đầu mỗi lần sửa.

---

## Quy trình khi mở chat mới
1. Upload lại zip code mới nhất (sandbox reset giữa các phiên) + file `PROJECT_SUMMARY.md` này.
2. Nói rõ đang muốn tiếp tục việc gì (VD: "đã test cả 4 khối với Gemini thật, ổn rồi, làm tiếp
   [việc X]" hoặc "review lại lần nữa" hoặc "viết test tự động cho 4 khối Tiếng Việt").
3. Sau khi hoàn thành, yêu cầu cập nhật lại chính `PROJECT_SUMMARY.md` trước khi đóng gói zip mới.
