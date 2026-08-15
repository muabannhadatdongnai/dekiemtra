# NEXT STEPS — AI Exam Generator (cập nhật phiên 6, thay thế mọi bản trước)

> File này CHỈ chứa việc cần làm HIỆN TẠI, không phải nhật ký lịch sử. Nhật ký đầy đủ nằm ở
> `PROJECT_SUMMARY.md` (không cần dán file đó vào chat trừ khi cần tra lại quyết định cũ chi
> tiết). Mỗi khi mở chat mới: **chỉ cần dán zip code + file NEXT_STEPS.md này** là đủ.
>
> Sau khi hoàn thành việc nào, XOÁ mục đó khỏi đây và thêm 1 dòng tương ứng vào cuối
> `PROJECT_SUMMARY.md` (giữ đúng thói quen cũ), rồi cập nhật lại file NEXT_STEPS.md này cho gọn.

## Thứ tự làm việc đã chốt

### Bước 0 — Hạ tầng (làm 1 lần, không phụ thuộc tính năng nào)
- [ ] Xác nhận Upstash đã hoạt động đúng trên Vercel (đã có hướng dẫn cấu hình ở phiên 5 — người
      dùng tự làm, không cần code).
- [ ] Thêm file `.github/workflows/test.yml` chạy tự động `npm test` + `npm run build` mỗi lần
      push — Claude viết sẵn, người dùng không cần thao tác gì.

### Bước 1 — Nhóm D (3 việc nhỏ còn lại, làm trước Nhóm B)
Đã xong #6 → #9 → #5 → #7 → #8 (phiên 6) theo đúng thứ tự đã chốt trước đó — xem chi tiết #7/#8
(kèm quyết định "lịch sử nhận xét học bạ ưu tiên xoá sớm" đã chốt) trong `PROJECT_SUMMARY.md`
mục "BƯỚC 1 (Nhóm D), VIỆC #7 + #8".

- [ ] **Việc còn lại từ #8**: chưa viết test tự động cho `reportCommentHistoryStore.js` (TTL 1
      giờ) và `buildParentFriendlyReportSections()`, chưa tự bấm thử nút "Tải PDF (bản phụ
      huynh)" trên trình duyệt thật (đặc biệt kiểm tra ngắt trang giữa các học sinh khi có từ 2
      học sinh trở lên) — không cấp bách, làm khi rảnh trước khi coi Bước 1 là ổn định hoàn toàn.

## Bước 2 — Nhóm B: tính năng "Đề cương Ôn tập" (thiết kế đã chốt, làm sau khi xong việc còn lại ở Bước 1)
- [ ] Thêm tab mới, sắp xếp lại thứ tự 6 tab: Soạn Giáo án → Phiếu Bài Tập → Đề Tiếng Việt Tiểu
      học → **Đề Cương Ôn Tập (mới)** → Tạo Đề Kiểm Tra → Nhận Xét Học Bạ.
- [ ] Cấu trúc "3 Trụ cột" (Kiến thức cốt lõi / Dạng bài + bài mẫu / Ngân hàng bài tập 3 mức).
- [ ] Input: Môn/Lớp/Phạm vi (map kỳ → khoảng chương, dùng kho GitHub RAG hiện có)/Yêu cầu đặc biệt.
- [ ] Trần tối đa mỗi lượt gọi, cùng kiến trúc `contentGenerationLimits.js`.
- [ ] Component xuất file MỚI HOÀN TOÀN: `OutlineExportActions.jsx` + `outlineExportService.js`,
      2 luồng tải (học sinh không đáp án / GV-PH có đáp án đầy đủ) + Thư ngỏ Phụ huynh tự động +
      hàm style "thân thiện phụ huynh" riêng — ĐỘC LẬP với `buildParentFriendlyReportSections()`
      của Nhận xét học bạ (2 tính năng bố cục khác nhau, không gộp chung). ⚠️ Nhớ: hàm này KHÔNG
      được dùng class Tailwind (file trong `src/services/` không nằm trong danh sách Tailwind
      `content` scan ở `tailwind.config.js` → class sẽ bị purge mất khi build) — style phải nằm ở
      CSS thuần (`globals.css`) hoặc trong file `.jsx`.

## Đã tạm gác lại (KHÔNG còn trong backlog chủ động — người dùng xác nhận chưa cần)
Phản hồi 👍/👎 chất lượng AI; tự phục vụ đăng ký tài khoản giáo viên; phân tích kết quả lớp sau
khi chấm bài. Nếu sau này muốn làm lại, xem chi tiết gợi ý trong lịch sử hội thoại phiên 4-5 hoặc
`PROJECT_SUMMARY.md`.

## Nhóm A — Việc CẦN BẠN TỰ LÀM (ngoài phạm vi Claude tự động hoá được)
- `npm install && npm test && npm run build` thật trên máy có mạng, xác nhận sạch trước khi coi
  các thay đổi gần nhất là ổn định (phiên 6: đã tự chạy trong sandbox có mạng, 114/114 PASS +
  build sạch — nhưng bạn nên tự chạy lại 1 lần trên máy/CI thật của bạn cho chắc).
- Tự kiểm tra lịch sử commit GitHub thật xem `.env.local`/`.data/` có từng lọt vào không.
- Xem bằng mắt + gọi Gemini thật để duyệt văn phong Lời dẫn/Slide Outline (Giai đoạn 10).
- Cấu hình Upstash trên Vercel theo hướng dẫn phiên 5 ở trên.
- Tự bấm thử nút "Tải PDF (bản phụ huynh)" (Nhận xét học bạ) trên trình duyệt thật — xem mục
  "Việc còn lại từ #8" ở Bước 1 phía trên.

## Chưa quyết (không gấp, để riêng)
CSP (Content-Security-Policy); rate-limit cho 3 route `/api/analyze-*`; Giai đoạn 9 (Phiếu bài
tập, còn dở) — người dùng chọn thời điểm quay lại sau khi xong Bước 0-2 ở trên.

---
## Quy trình mở chat mới
1. Upload zip code mới nhất + file `NEXT_STEPS.md` này (KHÔNG cần `PROJECT_SUMMARY.md` trừ khi
   cần tra cứu lý do/chi tiết 1 quyết định cũ).
2. Trả lời mục "⚠️ Cần bạn quyết định" ở đầu file nếu còn treo (hiện KHÔNG còn mục nào treo).
3. Nói rõ đang làm Bước nào (0/1/2) — nên đi tuần tự, không nhảy cóc.
4. Xong việc nào, xoá dòng đó khỏi `NEXT_STEPS.md`, thêm 1 mục mới vào cuối `PROJECT_SUMMARY.md`.
