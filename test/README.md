# Test tự động

Dùng **`node --test`** — test runner có sẵn trong Node.js (từ v18+), **KHÔNG cần cài thêm
Jest/Vitest/mocha gì cả** (giữ đúng tinh thần "$0 chi phí, ít phụ thuộc" của dự án).

## Chạy toàn bộ

```bash
npm test
```

## Chạy 1 file riêng

```bash
node --test test/xmlEscapeUtils.test.js
```

## Danh sách file test

| File | Cần `npm install` trước? | Test gì |
|---|---|---|
| `xmlEscapeUtils.test.js` | ❌ Không (chỉ dùng JS thuần) | Regex escape `<m:t>` — chỗ đã phá hỏng file Word **2 lần liên tiếp**. Đây là test quan trọng nhất, luôn chạy được kể cả khi chưa cài package nào. |
| `passwordUtils.test.js` | ❌ Không (chỉ dùng `crypto` built-in) | Hash/verify mật khẩu. **Chính test này đã bắt được 1 lỗi bảo mật thật** lúc viết: `Buffer.from(hex_hỏng, "hex")` không throw mà âm thầm cắt ngắn thành buffer rỗng, khiến `verifyPassword` trả `true` sai cho dữ liệu hash bị hỏng — đã sửa trong `passwordUtils.js`. |
| `sessionToken.test.js` | ❌ Không (chỉ dùng `crypto` built-in) | Ký/verify session token, chống giả mạo (sửa 1 ký tự trong token phải fail), token rác không được throw. |
| `loginRateLimiter.test.js` | ❌ Không | Chặn brute-force `/api/login` sau N lần sai, reset đúng khi đăng nhập thành công. |
| `questionBankStore.test.js` | ❌ Không (test nhánh file JSON local) | Ngân hàng câu hỏi bền vững: lưu/đọc lại đúng, cộng dồn qua nhiều lần gọi (không ghi đè), gộp nhiều chương, bỏ qua item thiếu dữ liệu. **Chỉ test được nhánh local** - nhánh Upstash thật cần test thủ công sau khi cấu hình (xem ghi chú trong file test). |
| `geminiUsageTracker.test.js` | ❌ Không (test nhánh file JSON local) | Thống kê mức dùng Gemini: che key đúng, đếm lượt gọi + lỗi hết quota đúng, không throw khi input thiếu/lạ. **Chỉ test được nhánh local**, tương tự `questionBankStore.test.js`. |
| `exportService.docx.test.js` | ✅ **Có** — cần `npm install` (dùng thật `docx`, `temml`, `mathml2omml`, `jszip`) | Test tích hợp toàn bộ pipeline LaTeX→OMML→.docx với **cả phân số LẪN bất đẳng thức trong CÙNG 1 lần tạo file** — đúng kịch bản đã lọt 2 bug trước đây. Soi thẳng `word/document.xml` bên trong file .docx để đảm bảo không có ký tự XML chưa escape lọt vào node `<m:t>`. |
| `lessonPlanExportService.test.js` | ✅ **Có** — cần `npm install` (dùng thật `docx`, `jszip`) | **Test riêng cho Giai đoạn 10, Việc 6/7** (phụ lục "Lời dẫn"/"Dàn ý Slide" trong giáo án Word) — viết THÊM sau khi rà soát tổng thể phát hiện 2 tính năng này bị "thất lạc" vào 2 thư mục mồ côi ở gốc repo (xem PROJECT_SUMMARY.md). Kiểm tra: cờ `includeTeacherScript` ẩn/hiện đúng phụ lục Lời dẫn; phụ lục Dàn ý Slide LUÔN hiện nếu có dữ liệu (không có cờ); dữ liệu rỗng thì KHÔNG tự vẽ phụ lục trống; cả 2 phụ lục cùng lúc không xung đột nhau. |
| `contentGenerationLimits.test.js` | ❌ Không (chỉ dùng JS thuần) | Trần tối đa số câu (đề kiểm tra)/số bài (phiếu bài tập)/số tiết (giáo án) mỗi lượt gọi API sinh nội dung — clamp đúng từng ô/dạng bài lẫn tổng cộng dồn, không throw với dữ liệu client gửi lên bất thường (âm, chuỗi, thiếu). |
| `teacherGenerateRateLimiter.test.js` | ❌ Không (test nhánh file JSON local) | Rate-limit theo giáo viên cho các API sinh nội dung: chặn "burst" (quá nhiều lượt/phút, trong bộ nhớ) và trần lượt/ngày (bền vững). **Chỉ test được nhánh local**, tương tự `questionBankStore.test.js`/`geminiUsageTracker.test.js` — nhánh Upstash cần test thủ công sau khi cấu hình. |

## ⚠️ Lưu ý quan trọng khi sửa `exportService.js` / `xmlEscapeUtils.js`

Bất kỳ lần nào sửa pipeline xuất Word — dù chỉ đổi 1 dòng trong regex hay cách xử lý OMML —
**BẮT BUỘC chạy `npm test` trước khi coi là xong**, đặc biệt là
`exportService.docx.test.js`. Cả 2 bug Word trước đây đều lọt qua vì chỉ test thủ công 1
trường hợp tại 1 thời điểm (chỉ phân số HOẶC chỉ bất đẳng thức, không phải cùng lúc) rồi quên
test lại lần sau.

## Việc còn thiếu (gợi ý mở rộng tiếp)

- Chưa có test cho `specificationBuilder.js` (tính Ma trận đề thi / Bản đặc tả)
- Chưa có test cho `worksheetSchemas.js` generator (dù đã stress-test thủ công 1500 lần — nên
  biến việc đó thành 1 test tự động chạy trong CI thay vì chỉ chạy 1 lần rồi thôi)
- Chưa có test dựng file `.docx` thật rồi convert sang PDF bằng LibreOffice headless để so
  sánh ảnh chụp (visual regression) — cách làm thủ công đã dùng trước đây, nên tự động hoá
- Chưa có GitHub Actions workflow chạy `npm test` tự động mỗi lần push (free tier đủ dùng cho
  dự án nhỏ này)
- Chưa có test tự động cho `security headers` trong `next.config.js` (cần khởi động server thật
  và gọi `fetch()` kiểm tra header response - `next --test` thuần không làm được, cần thêm 1
  bước `next build && next start` trong CI trước khi test) - hiện chỉ xác nhận bằng mắt qua
  DevTools sau khi deploy.
- `.gitignore` — file này (và `.env.local.example`) đã bị THẤT LẠC HOÀN TOÀN trong bản zip trước
  khi rà soát lần này (không tồn tại ở bất kỳ đâu, đã kiểm tra `find . -iname ".gitignore*"`) -
  đã tạo lại ở gốc repo, nhưng **BẮT BUỘC bạn tự xác nhận trên repo GitHub thật** rằng file đã
  được commit và `.env.local`/`.data/` KHÔNG xuất hiện trong lịch sử commit (xem cảnh báo đầy đủ
  ngay trong `.gitignore`) - việc này không thể tự động hoá bằng `npm test` vì cần truy cập
  GitHub thật.
