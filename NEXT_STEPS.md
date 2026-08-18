# NEXT STEPS — AI Exam Generator (cập nhật phiên 10, thay thế mọi bản trước)

> File này CHỈ chứa việc cần làm HIỆN TẠI, không phải nhật ký lịch sử. Nhật ký đầy đủ nằm ở
> `PROJECT_SUMMARY.md` (không cần dán file đó vào chat trừ khi cần tra lại quyết định cũ chi
> tiết). Mỗi khi mở chat mới: **chỉ cần dán zip code + file NEXT_STEPS.md này** là đủ.
>
> Sau khi hoàn thành việc nào, XOÁ mục đó khỏi đây và thêm 1 dòng tương ứng vào cuối
> `PROJECT_SUMMARY.md` (giữ đúng thói quen cũ), rồi cập nhật lại file NEXT_STEPS.md này cho gọn.

## Thứ tự làm việc đã chốt

### Bước 0 — Hạ tầng (làm 1 lần, không phụ thuộc tính năng nào) — ĐÃ XONG (phiên 10)
- [x] Thêm file `.github/workflows/test.yml` chạy tự động `npm test` + `npm run build` mỗi lần
      push/PR — không cần biến môi trường thật (chỉ test nhánh local, build không gọi API thật).
- [x] Thêm file `.gitignore` (bị thiếu — PROJECT_SUMMARY phiên trước ghi đã có nhưng thực tế
      không tồn tại trong repo, xem ghi chú ở mục "PHIÊN 10" trong `PROJECT_SUMMARY.md`).
- [ ] Xác nhận Upstash đã hoạt động đúng trên Vercel (đã có hướng dẫn cấu hình ở phiên 5 — người
      dùng tự làm, không cần code).

### Bước 1 — Nhóm D — ĐÃ XONG HOÀN TOÀN (phiên 10)
Đã xong #6 → #9 → #5 → #7 → #8 (phiên 6), và nốt phần test tự động còn thiếu của #8 (phiên 10):
test cho `reportCommentHistoryStore.js` (bao gồm test TTL 1 giờ) + `buildParentFriendlyReportSections()`.
Chỉ còn phần THỦ CÔNG (không code được) — xem mục "Việc còn lại từ #8" trong Nhóm A bên dưới.

## Bước 2 — Nhóm B: tính năng "Đề cương Ôn tập" — ĐÃ XONG (phiên 7)
Đã hoàn thành đúng thiết kế đã chốt. Xem chi tiết đầy đủ trong `PROJECT_SUMMARY.md` mục
"BƯỚC 2 (NHÓM B) — TÍNH NĂNG ĐỀ CƯƠNG ÔN TẬP". Người dùng đã tự bấm thử trên trình duyệt thật với
API key thật (đúng mục Nhóm A còn treo ở phiên 7) và gửi phản hồi chi tiết → xem Bước 3 ngay dưới.

## Bước 2.5 — Fix nhanh: tab mặc định khi vào web — ĐÃ XONG (phiên 8)
Mặc định `mode` bị lệch (đang là `MODES.EXAM` dù nút "Soạn giáo án" đã ở vị trí đầu) → đã sửa
`src/app/page.js` (`useState` khởi tạo + `handleLogout()`) về `MODES.LESSON_PLAN`. Đã tự verify
`npm test` 123/123 PASS + `npm run build` sạch. Chi tiết xem `PROJECT_SUMMARY.md` mục "PHIÊN 8".

## Bước 3 — Nhóm E: sửa lỗi + nâng cấp "Đề cương Ôn tập" theo phản hồi thực tế — ĐÃ XONG (phiên 9)
Đã làm ĐỦ CẢ 6 việc (E1, E2, E3a, E3b, E3c + ghi nhận không sửa vụ phân số). Chi tiết đầy đủ trong
`PROJECT_SUMMARY.md` mục "BƯỚC 3 (NHÓM E)". Đã tự verify: `npm test` 130/130 PASS (thêm 7 test mới:
5 test outline export + 3 test clampOutlineStudyDays - đúng 7 test được kỳ vọng), `npm run build`
sạch. Việc còn lại (không cấp bách, để bạn tự làm khi rảnh) đã liệt kê trong Nhóm A bên dưới.

## Bước 4 — Rà soát tổng thể + dọn việc dở dang — ĐÃ XONG (phiên 10)
Giáo viên yêu cầu "rà soát những việc còn dang dở, những lỗi..." → đã kiểm tra toàn bộ code
(chạy thật `npm test`/`npm run build`), đối chiếu với tài liệu, và làm xong 4 việc:
1. Test tự động cho `reportCommentHistoryStore.js` (11 test, gồm cả TTL 1 giờ) + phát hiện GIAI
   ĐOẠN F (Tách-Gộp/Storytelling/Đếm ngày ở Phiếu bài tập) đã code xong từ trước nhưng CHƯA từng
   được ghi vào `NEXT_STEPS.md`/`PROJECT_SUMMARY.md` — nay đã ghi nhận đầy đủ (xem mục "GIAI ĐOẠN
   F" trong `PROJECT_SUMMARY.md`).
2. Test tự động cho `buildParentFriendlyReportSections()` (9 test).
3. Mở rộng quy tắc số thập phân (dấu phẩy)/đơn vị đo (km², m²) từ Đề cương Ôn tập sang Đề kiểm tra
   (`promptTemplates.js`, có test khoá lại) — RIÊNG với Phiếu bài tập: đã rà soát và xác nhận
   KHÔNG cần mở rộng (chỉ hỗ trợ Lớp 1-2, chương trình chưa dạy số thập phân/đơn vị mũ).
4. Thêm rate-limit cho 3 route `/api/analyze-*` (`sampleAnalyzeRateLimiter.js`, quota RIÊNG với
   `/api/generate*`, mặc định 20 lượt/ngày, có 12 test).
5. (Ngoài 4 việc trên, phát hiện thêm khi rà soát) Thêm `.github/workflows/test.yml` và
   `.gitignore` còn thiếu (xem Bước 0 ở trên).

Đã tự verify: `npm test` 183/183 PASS, `npm run build` sạch. Chi tiết đầy đủ xem
`PROJECT_SUMMARY.md` mục "PHIÊN 10".

## Đã tạm gác lại (KHÔNG còn trong backlog chủ động — người dùng xác nhận chưa cần)
Phản hồi 👍/👎 chất lượng AI; tự phục vụ đăng ký tài khoản giáo viên; phân tích kết quả lớp sau
khi chấm bài. Nếu sau này muốn làm lại, xem chi tiết gợi ý trong lịch sử hội thoại phiên 4-5 hoặc
`PROJECT_SUMMARY.md`.

## Nhóm A — Việc CẦN BẠN TỰ LÀM (ngoài phạm vi Claude tự động hoá được)
- `npm install && npm test && npm run build` thật trên máy có mạng, xác nhận sạch trước khi coi
  các thay đổi gần nhất là ổn định (phiên 10: đã tự chạy trong sandbox có mạng, 183/183 PASS +
  build sạch — nhưng bạn nên tự chạy lại 1 lần trên máy/CI thật của bạn cho chắc).
- Đẩy code (kèm `.github/workflows/test.yml` mới) lên GitHub, xác nhận tab "Actions" chạy xanh.
- Tự kiểm tra lịch sử commit GitHub thật xem `.env.local`/`.data/` có từng lọt vào không (phiên
  10 phát hiện file `.gitignore` bị thiếu trong zip trước đó dù ghi chú là đã có — nếu repo GitHub
  thật của bạn cũng thiếu, các commit CŨ trước khi thêm `.gitignore` này có thể đã lỡ chứa
  `.env.local`/`.data/` — nên kiểm tra kỹ và cân nhắc xoá khỏi lịch sử commit nếu có).
- Xem bằng mắt + gọi Gemini thật để duyệt văn phong Lời dẫn/Slide Outline (Giai đoạn 10).
- Cấu hình Upstash trên Vercel theo hướng dẫn phiên 5 ở trên.
- Tự bấm thử nút "Tải PDF (bản phụ huynh)" (Nhận xét học bạ) trên trình duyệt thật — đặc biệt
  kiểm tra ngắt trang giữa các học sinh khi có từ 2 học sinh trở lên (phần test tự động đã xong ở
  phiên 10, đây chỉ còn phần xem bằng mắt trên trình duyệt thật).
- Cân nhắc chỉnh `SAMPLE_ANALYZE_DAILY_LIMIT` (mặc định 20/ngày, biến môi trường Vercel) nếu thấy
  giáo viên hay cần thử nhiều file mẫu trong 1 ngày — xem `sampleAnalyzeRateLimiter.js`.
- **Bước 3 (Đề cương Ôn tập, phiên 9)**: CHƯA tự bấm thử trên trình duyệt thật với API key thật —
  cần xem bằng mắt SAU KHI làm xong Bước 3: (a) bản Học sinh (.docx) có đủ lời giải Bài mẫu +
  KHÔNG có đáp án Ngân hàng bài tập ở bất kỳ đâu; (b) bản GV-Phụ huynh (.docx) đáp án đã chuyển hẳn
  vào "PHỤ LỤC: ĐÁP ÁN NGÂN HÀNG BÀI TẬP" ở trang cuối, tách đúng 3 khối theo mức, không còn nằm
  dưới câu hỏi; (c) văn phong "⚠️ Lỗi sai thường gặp" và "Lộ trình Ôn tập" AI sinh ra có tự nhiên,
  vừa sức lứa tuổi không; (d) ô nhập "Số ngày ôn tập" trên form hoạt động đúng, AI có chia đúng số
  ngày đã nhập không (thử với vài giá trị khác nhau, VD 3 ngày và 14 ngày); (e) bảng "Tự đánh giá"
  cuối bản Học sinh hiển thị đúng danh sách Dạng bài, không bị lỗi bố cục khi in; (f) 4 nút "📌 Học
  kỳ I/II/Cả năm" chọn đúng nhóm chương hợp lý (quy ước chia đôi TẠM THỜI, xem ghi chú trong
  `outlineTemplates.js`) — mục này vẫn chưa xem lại từ phiên 7.

## Chưa quyết (không gấp, để riêng)
Giai đoạn 9/F (Phiếu bài tập): phần "Tách-Gộp/Storytelling/Đếm ngày" đã xong (phiên 10 mới phát
hiện và ghi nhận lại) — người dùng chọn thời điểm quay lại nếu muốn thêm dạng bài mới khác.

---
## Quy trình mở chat mới
1. Upload zip code mới nhất + file `NEXT_STEPS.md` này (KHÔNG cần `PROJECT_SUMMARY.md` trừ khi
   cần tra cứu lý do/chi tiết 1 quyết định cũ).
2. Trả lời mục "⚠️ Cần bạn quyết định" ở đầu file nếu còn treo (hiện KHÔNG còn mục nào treo).
3. Nói rõ đang làm Bước nào — nên đi tuần tự, không nhảy cóc.
4. Xong việc nào, xoá dòng đó khỏi `NEXT_STEPS.md`, thêm 1 mục mới vào cuối `PROJECT_SUMMARY.md`.

