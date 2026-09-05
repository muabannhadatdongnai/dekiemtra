# PROJECT_SUMMARY.md — Lịch sử phát triển (rút gọn)

> File này là **changelog cô đọng**, không phải nhật ký chi tiết từng dòng code. Mỗi mục chỉ giữ:
> làm gì, vì sao (nếu là sửa lỗi thật), kết quả kiểm thử. Việc CÒN TỒN ĐỌNG nằm ở `NEXT_STEPS.md`,
> không lặp lại ở đây. Bản đầy đủ 3141 dòng trước khi rút gọn vẫn còn trong lịch sử Git nếu cần
> tra cứu chi tiết kỹ thuật (cách sửa từng dòng, số liệu debug đầy đủ).

## Phiên 39 — Sửa regression 3 test THPT (Phiên 38) + hạt sạn tiếng Việt trong bản xem trước Soạn Giáo Án môn Ngoại ngữ 2

**Bối cảnh:** Đầu phiên, kiểm tra lại bằng cách tự chạy `npm install && npm test && npm run build`
thật trong repo (Phiên 38 tự ghi nhận CHƯA làm bước này, chỉ kiểm bằng bundler độc lập bên ngoài) -
phát hiện 3 test `thptSubjects.test.js` bị fail do thêm Ngoại ngữ 2. Hoan sau đó gửi ảnh chụp bản
xem trước Soạn Giáo Án môn Tiếng Trung Lớp 6: mọi khung/nhãn tĩnh xung quanh (tiêu đề mục, "Bước",
"Khởi động", bảng "Hoạt động của giáo viên và học sinh"...) vẫn hiển thị tiếng Việt dù nội dung bài
học AI sinh đã đúng tiếng Trung.

**Root cause #1 - regression 3 test THPT:** `config.js` thêm `Tieng_Trung`/`Tieng_Nhat`/`Tieng_Phap`
(`minGrade: 6, maxGrade: 12`, không giới hạn `modules`) khiến Lớp 10-12 có 20 môn thay vì đúng 17
môn/HĐGD chính thức (8 bắt buộc + 9 lựa chọn theo Thông tư 32/2018/TT13-2022) mà
`thptSubjects.test.js` khoá cứng. Ngoại ngữ 2 đúng là môn tự chọn THÊM, nằm NGOÀI cơ cấu chính thức
này (không phải lỗi thiết kế) → cập nhật lại test để phản ánh đúng ý đồ: 17 (chính thức) + 3 (Ngoại
ngữ 2) = 20 môn hợp lệ ở Lớp 10-12, thay vì coi việc thêm Ngoại ngữ 2 là phá vỡ cơ cấu.

**Root cause #2 - hạt sạn tiếng Việt trong bản xem trước:** `LessonPlanPreview.jsx` (từ Phiên 36)
chỉ có `LABELS_VI`/`LABELS_EN`, chọn theo `languageCode` của môn qua `pickLabels()` — môn có
`languageCode` chưa có bản dịch (`zh`/`ja`/`fr`) TỰ RƠI VỀ `LABELS_VI` (an toàn nhưng sai ý đồ, đúng
lỗi trong ảnh). Cùng nguyên nhân ở `lessonPlanTemplates.js`: `ACTIVITY_LABELS_BY_LANGUAGE` (4 nhãn
hoạt động chuẩn), `LESSON_TYPES[].activityLabelByLanguage`, `STEM_VAN_DUNG_LABEL_BY_LANGUAGE`, và
nhãn "Khởi động lại" (`computeMultiPeriodTimeline`, trước đây hardcode rẽ nhánh CHỈ cho `"en"`) đều
chưa có entry `zh`/`ja`/`fr`.

**Đã sửa:**
1. `test/thptSubjects.test.js` — cập nhật kỳ vọng 17 → 20 môn cho Lớp 10-12 (thêm nhóm
   `NGOAI_NGU_2`), giữ nguyên mọi test khác không đổi.
2. `lessonPlanTemplates.js` — thêm entry `zh`/`ja`/`fr` cho `ACTIVITY_LABELS_BY_LANGUAGE`,
   `LESSON_TYPES[].activityLabelByLanguage`, `STEM_VAN_DUNG_LABEL_BY_LANGUAGE`; tách hằng số
   `WARMUP_RECAP_LABEL_BY_LANGUAGE` thay cho rẽ nhánh hardcode `languageCode === "en"`.
3. **Tách `LessonPlanPreview.jsx` → `src/data/lessonPlanPreviewLabels.js`** (file `.js` thuần,
   không còn nằm trong component `.jsx`): thêm `LABELS_ZH`/`LABELS_JA`/`LABELS_FR` đầy đủ tất cả
   khoá như `LABELS_VI`/`LABELS_EN`. Lý do tách: `LessonPlanPreview.jsx` chứa JSX nên KHÔNG
   `import` được thẳng trong bộ test `node --test` thuần (không qua bundler/Babel) — tách ra để có
   thể viết test bảo vệ trực tiếp, tránh lặp lại lỗi "hạt sạn tiếng Việt" tương tự khi thêm ngôn
   ngữ mới sau này (đúng nguyên tắc Single source of truth đã áp dụng cho
   `ACTIVITY_LABELS_BY_LANGUAGE`).
4. **`tinNhanTitle` (PHỤ LỤC: Tin nhắn gửi phụ huynh - Zalo) CỐ Ý giữ nguyên tiếng Việt** ở cả
   `LABELS_ZH`/`LABELS_JA`/`LABELS_FR` (giống `LABELS_EN` từ Phiên 36) — phụ huynh học sinh Việt Nam
   đọc trực tiếp, không dịch. Nội dung do AI sinh cho phụ lục này ĐÃ tự động giữ tiếng Việt cho mọi
   ngôn ngữ từ trước (cơ chế `exemptJsonFields` trong `buildForeignLanguageOutputDirective()` gọi
   không điều kiện theo mọi `languageCode`, không cần sửa gì thêm) — chỉ tiêu đề tĩnh ở bản xem
   trước là còn thiếu, nay đã bổ sung.
5. Test mới `test/lessonPlanForeignLanguage2Labels.test.js` (24 test): khoá lại CẢ 2 chiều - mọi
   nhãn tĩnh của `zh`/`ja`/`fr` phải KHÁC tiếng Việt, ngoại trừ đúng 2 nhãn cố ý giữ nguyên
   (`tinNhanTitle`, `noDataHint`); đồng thời khoá `LABELS_ZH`/`LABELS_JA`/`LABELS_FR` có ĐỦ mọi khoá
   như `LABELS_VI` (không thiếu field khi thêm ngôn ngữ mới sau này).

**Kết quả kiểm thử:** `npm test` — 412 tests, 410 pass, 2 fail (2 fail còn lại là mục #17 AUDIO/IPA
Tiếng Anh đã biết từ trước, ngoài phạm vi phiên này). `npm run build` sạch, không lỗi TypeScript.

**Ngoài phạm vi (đã ghi nhận, chưa sửa):** Đề Cương Ôn Tập (`OutlinePreview.jsx`) và Đề Kiểm Tra
(`VietnameseExamPreview.jsx`) KHÔNG có xử lý theo `languageCode` ở bản xem trước — kể cả môn Tiếng
Anh (Phiên 35-36) cũng hiển thị nhãn tĩnh tiếng Việt ở 2 tab này. Đây là khoảng trống có SẴN TỪ
TRƯỚC Phiên 38 (không phải lỗi riêng của Ngoại ngữ 2), Hoan chưa yêu cầu sửa lần này — xem
`NEXT_STEPS.md`. Phần XUẤT FILE Word/PDF cho Ngoại ngữ 2 (mục 🟡 ở `NEXT_STEPS.md`) vẫn CHƯA LÀM,
chờ Hoan chọn hướng kiến trúc.

---

## Phiên 38 — Bắt đầu Ngoại ngữ 2 (Tiếng Trung/Nhật/Pháp, Lớp 6-12): tầng cấu hình + prompt XONG, tầng xuất file CHƯA LÀM

**Yêu cầu Hoan:** SGK Kết nối tri thức đã có Tiếng Trung/Tiếng Nhật/Tiếng Pháp làm "Ngoại ngữ 2"
cho THCS+THPT → thêm vào 3 tab Soạn Giáo Án/Đề Cương Ôn Tập/Tạo Đề Kiểm tra, giữ nguyên tắc chia
luồng riêng theo môn/khối, AI sinh nội dung bằng đúng ngôn ngữ riêng từng môn.

**Đã xác minh qua tìm kiếm:** Nhà xuất bản Giáo dục Việt Nam đã biên soạn SGK Kết nối tri thức
Tiếng Trung/Tiếng Pháp (Lớp 3-10), Tiếng Nhật (Lớp 3-9) làm Ngoại ngữ 2; Ngoại ngữ 2 triển khai
chính khoá THCS từ năm học 2022-2023. Quyết định phạm vi: `minGrade: 6, maxGrade: 12` (không áp
dụng Tiểu học, khác Tiếng Anh là Ngoại ngữ 1 dạy từ Lớp 1).

**Việc đã làm (kiểm chứng bằng script Node dựng thật từ code trong `src/`, không chỉ đọc code):**
1. `config.js` — thêm 3 entry `Tieng_Trung`/`Tieng_Nhat`/`Tieng_Phap` (`minGrade: 6, maxGrade: 12`,
   không giới hạn `modules` → hiện ở cả 3 tab).
2. `foreignLanguageSubjects.js` — thêm 3 entry vào `FOREIGN_LANGUAGE_SUBJECTS` (`languageCode`
   `zh`/`ja`/`fr`). Xác nhận `buildForeignLanguageOutputDirective()` được gọi KHÔNG ĐIỀU KIỆN ở cả
   3 file prompt nên KHÔNG cần sửa `promptTemplates.js`/`outlinePromptTemplates.js`/
   `lessonPlanPromptTemplates.js` — chỉ thêm entry là đủ để AI nhận đúng chỉ thị ngôn ngữ.
3. `subjectProfiles.js` — thêm 3 profile với `extraRules` nghiên cứu riêng đặc thù chữ viết/ngữ âm
   từng tiếng (Trung: giản thể + pinyin có thanh điệu, thang HSK; Nhật: hiragana/katakana ưu tiên +
   furigana cho Kanji + rômaji, thang JLPT; Pháp: đủ dấu phụ, hoà hợp giống-số, thì theo trình độ).
4. Script kiểm thử `harness2.mjs` (bundle bằng esbuild, import thẳng file thật trong `src/`) xác
   nhận: dropdown Lớp 6-12 có đủ 4 ngôn ngữ, Lớp 1-5 KHÔNG có 3 môn mới,
   `getSubjectProfile()`/`findForeignLanguageConfig()`/`buildForeignLanguageOutputDirective()` trả
   đúng dữ liệu.

**CHƯA LÀM (cố ý, tránh vội):** phần XUẤT FILE Word/PDF (9 file export service tương tự
`english*ExportService.js`, routing ở 3 component ExportActions, dịch nhãn tĩnh) — xem kế hoạch
chi tiết + 2 hướng kiến trúc đề xuất (nhân bản như Tiếng Anh vs. tách dictionary nhãn dùng chung để
giảm rủi ro lặp bug schema Word như Phiên 37) ở `NEXT_STEPS.md` mục "🟡 Ngoại ngữ 2". Chưa chạy
`npm run build`/`npm test` thật (đã kiểm bằng bundler độc lập, chưa chạy trong chính repo).

**Ngoài lề (chưa giải quyết):** Hoan gửi lại 1 file Word "mới" báo vẫn lỗi `<w:p>` lồng `<w:p>` y
hệt Phiên 37 — build lại đúng code Phiên 37 bằng docx.js thật xác nhận code KHÔNG còn lỗi, kết luận
file đó vẫn do bản CHƯA deploy Phiên 37 tạo ra — xem `NEXT_STEPS.md` mục 🔴 #18.

---

## Phiên 37 — Sửa file Word Tiếng Anh Soạn Giáo Án không mở được (`<w:p>` lồng `<w:p>`) + Thư ngỏ gửi Phụ huynh (Đề Cương) bị dịch nhầm sang tiếng Anh

**Báo lỗi Hoan:** (1) tải file Word tab Soạn Giáo Án/Đề Cương Ôn Tập/Đề Kiểm tra môn Tiếng Anh mở
lên Microsoft Word báo lỗi chung chung "Word experienced an error trying to open the file" (kèm
ảnh chụp màn hình + 1 file `.docx` lỗi thật - giáo án "Unit 1: Hobbies"); (2) "Thư ngỏ gửi Phụ
huynh" ở tab Đề Cương Ôn Tập phải dùng tiếng Việt (đang bị dịch sang tiếng Anh).

**Root cause #1 - file Word không mở được (chỉ ảnh hưởng Soạn Giáo Án, bài dạy NHIỀU TIẾT + chế độ
bảng 2 cột):** file `.docx` lỗi Hoan gửi VẪN LÀ zip hợp lệ (CRC đúng, không có byte thừa sau EOCD)
và VẪN LÀ XML "well-formed" (khớp thẻ mở/đóng đầy đủ) - `ElementTree`/`python-docx`/LibreOffice đều
mở được bình thường, ban đầu không phát hiện ra gì bất thường. Soi kỹ `word/document.xml` mới thấy
`<w:p><w:p>...</w:p></w:p>` tại đúng bảng "Hết Tiết" (period boundary) - một `<w:p>` (paragraph)
LỒNG bên trong `<w:p>` khác, VI PHẠM schema `CT_P` của WordprocessingML (paragraph không được chứa
paragraph con) dù vẫn "well-formed" theo nghĩa XML thuần. MS Word kiểm tra schema nghiêm ngặt hơn
hẳn 3 công cụ trên nên từ chối mở, không có gợi ý cụ thể. Nguồn gốc: `cell()`
(`foreignLanguageDocBuilder.js`) LUÔN tự bọc `opts.children` trong ĐÚNG 1 `new Paragraph({...})`
(kỳ vọng `opts.children` là mảng `TextRun`), nhưng `periodBoundaryTableRowEn()`
(`englishLessonPlanExportService.js`) lại truyền THẲNG 1 `new Paragraph({...})` làm `opts.children`
- khiến `cell()` lồng nguyên object `Paragraph` đó vào bên trong `Paragraph` bọc ngoài của chính nó.
Đã rà TOÀN BỘ codebase bằng script tự động (duyệt AST đơn giản mọi lời gọi `cell(...)`/mọi
`new Paragraph(...)` lồng nhau) - xác nhận đây là DUY NHẤT 1 chỗ bị lỗi, không lặp lại ở Đề Cương
Ôn Tập/Đề Kiểm tra (2 tab đó không dùng `cell()`/bảng qua đường này).

**Fix #1:** `periodBoundaryTableRowEn()` đổi sang truyền mảng `TextRun` trực tiếp + dùng
`opts.alignment` sẵn có của `cell()`, bỏ hẳn `new Paragraph` bọc thêm. Đã xác nhận bằng thực nghiệm:
build lại file `.docx` tối giản tái hiện đúng cấu trúc cũ/mới, so sánh `word/document.xml` - bản cũ
có `<w:p><w:p>`, bản mới không còn.

**Root cause #2 - Thư ngỏ gửi Phụ huynh bị dịch sang tiếng Anh:** `outlinePromptTemplates.js` gọi
`buildForeignLanguageOutputDirective(subject)` KHÔNG truyền `exemptJsonFields` (docstring cũ ghi
sai rằng Đề Cương Ôn Tập "không có phụ lục kiểu này" - thực ra trường `thuNgoPhuHuynh` giống hệt
bản chất với `tinNhanPhuHuynh` đã được ngoại lệ ở Soạn Giáo Án, chỉ là đặt tên khác). **Fix:** thêm
`exemptJsonFields: ["thuNgoPhuHuynh"]`, cập nhật docstring `buildForeignLanguageOutputDirective()`
(`foreignLanguageSubjects.js`) + mục 5 schema trong `outlinePromptTemplates.js` + comment đầu file
`englishOutlineExportService.js` cho khớp thực tế mới.

**Công cụ mới - `test/wordSchemaAssertions.js`:** phát hiện đúng LỚP LỖI "XML well-formed nhưng vi
phạm schema WordprocessingML" mà JSZip/ElementTree/python-docx/LibreOffice (kể cả
`test:word-compat`) đều khoan dung - dò cây thẻ XML bằng ngăn xếp, báo lỗi khi `<w:p>`/`<w:tbl>` bị
lồng bên trong 1 `<w:p>` chưa đóng. `assertValidParagraphNesting(xml)` dùng trong test cho MỌI file
`.docx` build ra (không riêng tính năng gây lỗi lần này) - lớp bảo vệ chung, không cần Word thật.

**Test:** `test/lessonPlanPhien37.test.js` (6 test: bảng "Hết Tiết" không còn lồng `<w:p>`, tự kiểm
tra hàm dò lỗi, prompt Đề Cương có đúng ngoại lệ `thuNgoPhuHuynh`, nội dung thư ngỏ tiếng Việt giữ
nguyên trong Word tiếng Anh, + lớp bảo vệ chung cho Đề Kiểm tra tiếng Anh). `npm run test:word-compat`
(LibreOffice headless) thêm 3 kịch bản tiếng Anh (`giao-an-tieng-anh-nhieu-tiet`,
`de-cuong-tieng-anh`, `de-thi-tieng-anh` - trước đây script này không có kịch bản tiếng Anh nào, dù
đây chính là lỗ hổng khiến bug #1 không bị bắt sớm hơn - LƯU Ý: LibreOffice VẪN khoan dung với lỗi
lồng `<w:p>`, các kịch bản này chỉ bổ sung lớp "mở được bằng OOXML engine khác", không thay thế
`wordSchemaAssertions.js`). Kết quả: `npm test` 388 test, 386 pass (2 fail còn lại là
`lessonPlanEnglishAudioIpa.test.js` đã biết từ trước, KHÔNG liên quan); `npm run build` sạch;
`npm run test:word-compat` 9/9 kịch bản OK.

## Phiên 36 — Hoàn thiện giáo án Tiếng Anh: sửa "hạt sạn tiếng Việt" trong tên hoạt động + render đủ 7 tích hợp còn thiếu + sửa nút In/Tải PDF

**Yêu cầu Hoan:** (1) hoàn thiện các tích hợp còn thiếu bản tiếng Anh (Checklist NL-PC, STEM,
Timeline, Bài tập phân hoá, Phiếu học tập, Lời dẫn, Slide Outline - tồn đọng từ Phiên 35); (2) sửa
"hạt sạn tiếng Việt" còn sót trong tiêu đề hoạt động/các bước, cả trên Word lẫn trình duyệt web;
(3) sửa nút "In/Tải PDF" không bấm được cho giáo án Tiếng Anh.

**Root cause #1 - "hạt sạn tiếng Việt" trong tên hoạt động:** `getActivityLabels()`
(`lessonPlanTemplates.js`) LUÔN trả về nhãn tiếng Việt ("Khởi động", "Luyện tập"...) bất kể môn
học, và các nhãn này được dùng làm GIÁ TRỊ VÍ DỤ CỤ THỂ (không phải placeholder) trong schema JSON
gửi cho AI (`buildActivitySchemaBlock` - `lessonPlanPromptTemplates.js`) - đúng nguyên tắc đã ghi ở
mục "Key learnings": ví dụ cụ thể "neo" hành vi AI mạnh hơn chỉ thị chung chung, nên AI vẫn trả về
tên hoạt động tiếng Việt dù `buildForeignLanguageOutputDirective()` đã yêu cầu tiếng Anh. Nặng hơn:
tích hợp STEM (`lessonPlanIntegrations.js`) còn CHỈ THỊ TRỰC TIẾP AI dùng đúng chuỗi cứng
`"[Vận dụng - Tích hợp STEM]"` cho trường "ten" - xung đột thẳng với chỉ thị ngôn ngữ.

**Fix:** thêm `ACTIVITY_LABELS_BY_LANGUAGE`/`STEM_VAN_DUNG_LABEL_BY_LANGUAGE`
(`lessonPlanTemplates.js`), `getActivityLabels(lessonType, integrations, languageCode='vi')` nhận
thêm tham số `languageCode` (mặc định "vi" - KHÔNG phá hành vi cũ cho các môn khác).
`buildLessonPlanPrompt()` tính `languageCode` từ `findForeignLanguageConfig(subject)` ngay đầu hàm,
dùng nó cho MỌI nơi từng hardcode tên hoạt động tiếng Việt (structureRule, stepClarityRule,
buildMultiPeriodGuidance, lessonTypeNote). `TICH_HOP_STEM.buildPromptFragment()` đổi sang dùng
`ctx.vanDungLabel` (được `buildLessonPlanPrompt()` truyền vào, đã tính đúng ngôn ngữ) thay vì
hardcode - môn Toán/các môn khác vẫn nhận đúng chuỗi tiếng Việt cũ (test riêng xác nhận không đổi
hành vi). `computeMultiPeriodTimeline()`/`computeActivityTimeline()` cũng nhận thêm `languageCode`
(mặc định "vi") để đồng bộ - `lessonPlanOrchestrator.js` truyền `languageCode` của môn ngoại ngữ vào
khi tính Timeline.

**Root cause #2 - nút "In/Tải PDF" không bấm được:** `foreignLanguageDocBuilder.js`'s
`printHtmlDocument()` gọi `window.open("", "_blank", "noopener,noreferrer")`. Theo đặc tả trình
duyệt (MDN), khi feature "noopener" (hoặc "noreferrer" - tự kèm "noopener") được truyền, trình
duyệt LUÔN trả về `null` cho `window.open()` NGAY CẢ KHI cửa sổ mở thành công - khiến điều kiện
`if (!printWindow) throw ...` luôn đúng, báo lỗi "trình duyệt đã chặn popup" dù popup KHÔNG hề bị
chặn, và không có tham chiếu để ghi HTML/gọi `print()`. **Fix:** bỏ "noopener,noreferrer" khỏi lời
gọi `window.open()`, giữ hiệu quả bảo mật tương đương bằng cách gán `printWindow.opener = null`
ngay sau khi có tham chiếu (không mất tham chiếu như truyền thẳng "noopener").

**`englishLessonPlanExportService.js` (Word + in/PDF) - mở rộng đủ 7 tích hợp còn thiếu:** Checklist
NL-PC (bảng 4 cột Criteria/Good/Satisfactory/Needs Improvement), STEM Guide, Timeline nhiều tiết
(dòng "Suggested time allocation by period"), Bài tập phân hoá 3 mức (Support/On-level/Advanced),
Phiếu học tập (Student Worksheet), Lời dẫn (Teacher Script - có cờ `includeTeacherScript` ẩn/hiện
giống bản tiếng Việt, mặc định KHÔNG kèm), Dàn ý Slide (Slide Outline). Thêm hỗ trợ ranh giới "Hết
Tiết..." (Period boundary tiếng Anh) trong bảng/đoạn văn hoạt động khi bài dạy nhiều tiết, và hỗ
trợ cả 2 chế độ 1 cột/2 cột (`columnMode`) - trước đây bản tiếng Anh luôn cứng 2 cột, không đồng bộ
với lựa chọn của giáo viên. "Tin nhắn gửi phụ huynh" vẫn giữ nguyên tiêu đề + nội dung tiếng Việt.
`LessonPlanExportActions.jsx`: hiện checkbox "Kèm phụ lục Lời dẫn" cho CẢ môn ngoại ngữ (trước đây
bị ẩn hẳn), truyền `includeTeacherScript`/`timeline`/`columnMode`/`lessonType` xuống đúng như luồng
tiếng Việt.

**`LessonPlanPreview.jsx` (bản xem trước web) - viết lại hoàn toàn:** trước đây 100% nhãn/tiêu đề
TĨNH (không phải nội dung do AI sinh, VD "I. YÊU CẦU CẦN ĐẠT", "Bước 1:", tiêu đề bảng 2 cột...)
hardcode tiếng Việt bất kể môn học - đây là nguồn "hạt sạn tiếng Việt" chính trên trình duyệt. Giờ
mọi nhãn tĩnh lấy từ `LABELS_VI`/`LABELS_EN`, chọn theo `findForeignLanguageConfig(meta?.subject)`
(ngôn ngữ chưa có bản dịch tự rơi về `LABELS_VI` an toàn - dễ mở rộng thêm ngôn ngữ khác sau này).
"Tin nhắn gửi phụ huynh" vẫn giữ tiêu đề tiếng Việt cố định (đúng thiết kế, không phải sót dịch).
Diff xác nhận file mới tham chiếu ĐÚNG BỘ field `lessonPlan.*` như file cũ (không rớt tính năng nào
trong lúc viết lại).

**Test:** thêm `test/lessonPlanPhien36.test.js` (12 test: nhãn hoạt động theo ngôn ngữ, prompt
không còn hardcode tên tiếng Việt cho môn ngoại ngữ, nhãn STEM động, môn khác không đổi hành vi,
render đủ 7 tích hợp trong Word tiếng Anh, cờ `includeTeacherScript`, `window.open()` không còn
"noopener"/"noreferrer", báo lỗi rõ ràng khi popup thực sự bị chặn). **Kết quả:** 383 test, 381
pass, đúng 2 fail tồn đọng cũ (`lessonPlanEnglishAudioIpa.test.js` - KHÔNG liên quan Phiên 36, xem
`NEXT_STEPS.md`). `npm run build` sạch.

## Phiên 35 — Đổi kiến trúc "Bản ngoại ngữ": sinh THẲNG bằng ngôn ngữ đích, bỏ bước dịch

**Yêu cầu Hoan:** môn Tiếng Anh phải MẶC ĐỊNH xuất bằng tiếng Anh (không cần bấm nút riêng), trừ
phụ lục "Tin nhắn gửi phụ huynh (Zalo)" LUÔN giữ tiếng Việt; bỏ hẳn khái niệm "dịch qua lại" - đây
là cấu trúc nền cho các môn ngoại ngữ khác (Tiếng Trung, Tiếng Pháp...) sau này.

**Đổi kiến trúc so với Phiên 34:** thay vì sinh tiếng Việt trước rồi dịch lại (route API riêng
`/api/translate-foreign-language`), giờ chèn 1 "chỉ thị ngôn ngữ" (`buildForeignLanguageOutputDirective()`
- `foreignLanguageSubjects.js`) THẲNG vào prompt sinh nội dung chính (`promptTemplates.js`/
`outlinePromptTemplates.js`/`lessonPlanPromptTemplates.js`) khi môn học nằm trong danh bạ
`FOREIGN_LANGUAGE_SUBJECTS` - AI trả JSON đã đúng ngôn ngữ đích ngay từ lượt gọi ĐẦU TIÊN, không
tốn thêm lượt gọi Gemini nào (tiết kiệm quota free tier so với kiến trúc cũ). Hỗ trợ ngoại lệ
`exemptJsonFields` (field JSON nào LUÔN giữ tiếng Việt bất kể phần còn lại) - dùng cho
`tinNhanPhuHuynh`, nhắc lại 2 lớp (chỉ thị chung + ngay trong `lessonPlanIntegrations.js`).

**Đã XOÁ HẲN kiến trúc dịch cũ:** `ForeignLanguageExportButton.jsx`, `foreignLanguageOrchestrator.js`,
`foreignLanguageTranslationEngine.js`, `foreignLanguagePromptTemplates.js`,
`api/translate-foreign-language/route.js`, hàm `translateForeignLanguageRequest()` trong
`apiClient.js`. `LessonPlanExportActions.jsx`/`OutlineExportActions.jsx`/`ExportActions.jsx`: bỏ
nút "Bản ngoại ngữ" riêng, nút "Tải Word"/"In PDF" DUY NHẤT tự route sang
`english*ExportService.js` khi `findForeignLanguageConfig(subject)` khớp.

**Ma trận đề + Bản đặc tả (Đề Kiểm tra) cũng chuyển tiếng Anh** (theo quyết định Hoan, khác Phiên
34 - trước đây 2 bảng này KHÔNG có trong bản tiếng Anh): thêm `englishSpecificationBuilder.js`
(tính `computeSpecificationRowsEn()`, nhãn mức độ `ENGLISH_DIFFICULTY_LABELS`) +
`englishSpecificationExportBuilders.js` (vẽ bảng docx tiếng Anh) - tái dùng nguyên
`computeExamMatrix()` gốc (đã trung lập ngôn ngữ), chỉ viết lại phần có nhãn/mẫu câu tiếng Việt
cứng. Nối vào `englishExamExportService.js` (cả Word lẫn in PDF/HTML).

**`englishLessonPlanExportService.js`:** thêm render phụ lục "Tin nhắn gửi phụ huynh" (tiêu đề +
nội dung tiếng Việt, không dịch). Giới hạn CÒN LẠI (kế thừa từ kiến trúc cũ, chưa mở rộng): các
tích hợp khác (Checklist NL-PC, STEM, Timeline, Bài tập phân hoá, Phiếu học tập, Lời dẫn, Slide
Outline) chưa có bản render tiếng Anh - xem `NEXT_STEPS.md` #18.

**Phát hiện phụ (KHÔNG liên quan Phiên 35):** `npm test` lộ ra `test/lessonPlanEnglishAudioIpa.test.js`
(2 test) đang FAIL từ trước - tính năng "gắn thẻ Audio + phiên âm IPA" cho giáo án Tiếng Anh có
test nhưng CHƯA từng được cài đặt trong code. Xem `NEXT_STEPS.md` #17 - cần Hoan quyết định.

**Kết quả:** 371 test (369 pass, 2 fail - đúng 2 test Audio/IPA nói trên, không phải do Phiên 35),
`npm run build` sạch (route `/api/translate-foreign-language` đã biến mất khỏi danh sách route,
đúng như mong đợi sau khi xoá).

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
