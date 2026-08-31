# NEXT_STEPS.md — Việc đang dở dang + nguyên tắc bắt buộc phải nhớ

> File này CHỈ giữ thông tin còn TÁC DỤNG cho lần sửa tiếp theo — không phải nhật ký. Lịch sử đầy
> đủ từng phiên nằm ở `PROJECT_SUMMARY.md`. Khi 1 việc trong bảng dưới đã xong, XOÁ dòng đó khỏi
> bảng (đừng giữ lại "lịch sử đã xong" ở đây — chuyển 1 dòng tóm tắt sang `PROJECT_SUMMARY.md`).

**Trạng thái tổng quát:** 7 tab đang hoạt động (Soạn Giáo án, Phiếu Bài Tập, Đề Tiếng Việt Tiểu
học, Đề Cương Ôn Tập, Tạo Đề Kiểm Tra, Nhận Xét Học Bạ, Hướng dẫn sử dụng). Toán Lớp 3-5 đã đủ
catalog Phiếu Bài Tập theo SGK KNTT. Chi tiết đầy đủ từng module xem `README.md`.

---

## 🔴 CẦN HOAN QUYẾT ĐỊNH / TỰ LÀM

| # | Việc | Vì sao cần Hoan |
|---|------|------------------|
| 1 | Kích hoạt hay xoá tab "Tô màu" (Coloring Page) | Code đã đủ 4 tầng nhưng chưa nối vào `page.js` — đang "chết" trong kho. Xoá thì xoá luôn 6 file liên quan + biến môi trường `COLORING_GEMINI_API_KEYS` trên Vercel cho gọn. |
| 2 | Tạo file `chuong_{n}_bai.json` cho tính năng "gợi ý Bài theo SGK" (Soạn giáo án) | Tính năng đã code xong nhưng KHÔNG hoạt động tới khi có dữ liệu thật trong kho GitHub kiến thức. Xem cấu trúc tại `docs/vi-du-phu-luc-bai-hoc.example.js`. Làm dần theo Chương, không cần làm hết ngay. |
| 3 | Tạo dữ liệu SGK thật cho 4 môn mới thêm gần đây: Tự nhiên và Xã hội (Lớp 1-3), Lịch sử và Địa lí (Lớp 4-5), Tin học (Lớp 3-5), Công nghệ (Lớp 3-5) | Code (`config.js`/`subjectProfiles.js`/3 form) đã sẵn sàng, nhưng dropdown "Chương" ở Soạn giáo án/Đề Cương Ôn Tập/Tạo Đề Kiểm Tra sẽ RỖNG cho tới khi có file `chuong_{n}.md` trong kho GitHub kiến thức theo đúng cấu trúc đang dùng cho Toán/Tiếng Việt. |
| 4 | Chạy `npm run build` + `npm test` thật sau khi merge patch chuẩn hoá môn học (Lớp 1-5) | Patch được viết/kiểm tra cú pháp trong sandbox không có `node_modules`/test đầy đủ của repo — cần Hoan xác nhận build/test thật không vỡ trước khi deploy. |
| 5 | Xác nhận có muốn thêm Giáo dục thể chất/Âm nhạc/Mĩ thuật/Hoạt động trải nghiệm vào hệ thống không | Cố ý CHƯA thêm — các môn này đánh giá bằng nhận xét, không có kiểm tra định kỳ theo ma trận đề, cấu trúc giáo án khác hẳn (thiên vận động/thực hành). Nếu muốn thêm cần thiết kế UI riêng, không gộp chung khuôn hiện tại. |
| 6 | Lỗ hổng bảo mật gói `xlsx` (Prototype Pollution/ReDoS) | Nhà phát hành chưa có bản vá — chỉ cần biết để KHÔNG mở tính năng nhập Excel cho người dùng ẩn danh/công khai; chưa cần hành động ngay. |
| 7 | Icon line-art (Phiếu Bài Tập, Bài 3) chưa qua mắt giáo viên/học sinh thật | Đã có sẵn `lineart-icon-review-sheet.html` để in/gửi thu thập phản hồi. Sửa trực tiếp `scripts/lineArtIconDefs.js` rồi chạy lại `scripts/render-line-art-icons.js` khi có phản hồi. |
| 8 | Thiết kế dạng bài Tiếng Việt Lớp 1 kiểu "âm/vần" thay thế | Đã ẩn 2 dạng bài vượt cấp (`khoanh_tu_loai`/`noi_tu_nhom`) khỏi Lớp 1, nhưng CHƯA có dạng bài thay thế đúng trình độ (VD "Khoanh vào tiếng có âm a", "Nối từ với hình"). Hiện Lớp 1 chỉ còn `dien_tu_cho_san`. |
| 9 | Chính tả: có nên thêm trường "đoạn trích nguyên văn" vào phụ lục Bài Tiếng Việt? | Hiện chỉ dùng mô tả ngắn để gợi nhớ, giáo viên vẫn tự gõ nguyên văn (đúng nguyên tắc chống bịa/vi phạm bản quyền). Nếu muốn tự động điền nguyên văn, cần Hoan tự thêm nội dung CHÍNH XÁC từ SGK thật vào JSON — không nên để AI tự sinh. |
| 10 | Test flaky trong `test/worksheetLineArtIcons.test.js` | Icon ⭐ random đôi khi trùng icon ⭐ cố định ở khối "Tự đánh giá", khiến assertion thỉnh thoảng báo sai (không phải lỗi sản phẩm thật). Cần thu hẹp phạm vi assertion về đúng `<w:drawing>` của mục đang xét. |
| 11 | Nhóm D còn lại (cải tiến hạ tầng nhỏ) | Cảnh báo lệch khối lớp trong `ExamMatrixForm.jsx`, style đậm nhất quán cho tiêu đề chính mọi tab, tách hàm style PDF thân thiện phụ huynh riêng theo từng tính năng. Chưa xác nhận trạng thái mới nhất — kiểm tra lại code thật trước khi báo "đã xong" hay "chưa làm". |
| 12 | Giữ hay xoá so sánh nhiều học kỳ trong lịch sử học bạ (Nhận Xét Học Bạ) | Giữ = cần thời gian lưu Upstash dài hơn (tốn quota free tier); xoá sau 1 giờ = đơn giản, ít rủi ro quota nhưng mất khả năng so sánh học kỳ trước. |

---

## Nguyên tắc sư phạm/kỹ thuật BẮT BUỘC — đọc trước khi code Phiếu Bài Tập/Đề mới

**Toán Lớp 5 — hình học không gian & số liệu:**
1. Bài tính Diện tích xung quanh/toàn phần/Thể tích CHỈ dùng Hình Lập Phương và Hình Hộp Chữ
   Nhật. CẤM TUYỆT ĐỐI Hình Trụ, Hình Cầu (không dùng số Pi cho các hình này ở Tiểu học).
2. Câu hỏi tỉ số phần trăm trong cùng 1 bài phải đa dạng số liệu, không lặp cùng 1 tỉ lệ % ở 2
   câu liên tiếp.
3. "Đặt tính rồi tính": KHÔNG xuất dấu "=" theo hàng ngang — dùng khung ô ly (web) hoặc khoảng
   trắng viết tay (Word) để học sinh tự đặt phép tính hàng dọc.

**Toán Lớp 4:** nhận diện góc (nhọn/tù/bẹt/vuông) CHỈ phân loại bằng trực quan/ê-ke, KHÔNG dùng số
đo độ cụ thể (học sinh chưa học thước đo độ). Số thứ tự câu hỏi đặt cạnh tử số phân số phải có
khoảng cách rõ, tránh nhìn nhầm thành số thập phân (học sinh Lớp 4 chưa học số thập phân).

**Xuất Word — không dùng ký tự Unicode hiếm để vẽ hình:** mọi hình minh hoạ lặp ký tự
(┆▬▭▪■⬭⬠⬡⏢...) phụ thuộc font máy người dùng, có thể hiện TRỐNG trong Word dù PDF vẫn ổn (PDF qua
trình duyệt tự fallback font, Word mở trực tiếp thì không). Luôn rasterize SVG → PNG rồi nhúng
`ImageRun`, không lặp ký tự đặc biệt.

**Chính tả (Đề Tiếng Việt):** KHÔNG để AI tự sinh nguyên văn ngữ liệu SGK — chỉ gợi nhớ bằng mô tả
ngắn (`noiDungCotLoi`), giáo viên tự gõ nguyên văn. Đọc thầm thì AI được viết ngữ liệu MỚI (không
copy nguyên văn SGK) dựa trên `referenceContext` trích từ chương.

**Môn học theo khối lớp:** trước khi thêm/sửa môn trong `config.js`, LUÔN tra cứu đúng Thông tư
32/2018/TT-BGDĐT + cách chia sách bộ Kết nối tri thức thật — không suy đoán. VD: Khoa học chỉ có
từ Lớp 4 (Lớp 1-3 là "Tự nhiên và Xã hội"); "Lịch sử" đơn lẻ chỉ đúng từ Lớp 6, Tiểu học phải là
"Lịch sử và Địa lí".

**Quy ước chung (không đổi qua nhiều phiên):**
- Isolation over DRY — mỗi tính năng/khối lớp code/data riêng, chấp nhận trùng lặp.
- 4 tầng bắt buộc cho dạng bài Phiếu Bài Tập mới: catalog → generator → preview → xuất Word.
- Grep trước khi giả định phạm vi — luôn xác nhận số file/chỗ dùng thật qua code, tài liệu cũ có
  thể đã lệch so với code thật (đã xảy ra nhiều lần, xem `PROJECT_SUMMARY.md`).
- Stress-test generator bằng 200-500+ lần lặp trước khi báo xong — bắt được lỗi số liệu không
  tròn/không đa dạng mà đọc code không thấy.

---

## Chỉ 1 bộ SGK

Trường chỉ dùng **Kết nối tri thức với cuộc sống** — không cần hỗ trợ đa bộ sách.
