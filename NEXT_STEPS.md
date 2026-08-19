# NEXT_STEPS.md — Phiếu Bài Tập: Mở rộng Lớp 3-5 + Chế độ in Màu/Đen trắng

> Trạng thái: **GIAI ĐOẠN THIẾT KẾ — CHƯA CODE** (phần mở khối Lớp 4-5). File này để mang sang
> chat mới không mất ngữ cảnh.

## ✅ MỚI NHẤT (Phiên 10) — đã sửa theo phản hồi thực tế sau khi test `dekiemtra-lop3-dot3.zip`
Xem đầy đủ chi tiết kỹ thuật trong `PROJECT_SUMMARY.md` mục "PHIÊN 10". Tóm tắt:
1. **Số kiểu Việt Nam (BẮT BUỘC)**: số tự nhiên từ 4 chữ số trở lên giờ LUÔN có dấu chấm phân
   cách hàng nghìn (VD `63880` → `63.880`) - hàm dùng chung MỚI `src/services/numberFormatUtils.js`
   (`formatSoTuNhien`/`formatSoTrongChuoi`), áp dụng cả web (WorksheetPreview.jsx) lẫn Word
   (worksheetExportService.js). Đã giải quyết đúng mục "Vấn đề kỹ thuật cần xử lý khi mở khối" bên
   dưới (không còn `toLocaleString("vi-VN")` rời rạc nữa).
2. **"Trạm 8" (Đổi đơn vị đo) + Tính nhẩm**: 3 cột → 2 cột (cả web lẫn Word), ô đáp án
   (`blankBox`) rộng từ 42px → tối thiểu 64px - không còn tràn số khi in số lớn (VD "19.000 ml").
3. **Tắt đăng nhập để test**: biến môi trường `NEXT_PUBLIC_DISABLE_LOGIN=true` (đặt trong
   `.env.local`, mặc định TẮT) - bỏ qua màn hình đăng nhập + kiểm tra token API, tiện giáo viên
   test nhanh. KHÔNG bật trên môi trường public/production - xem cảnh báo trong `.env.local.example`.
- `npm test`: 203/203 PASS. `npm run build`: sạch.
- **Lưu ý phát hiện được**: code hiện tại ĐÃ CÓ `ThuThapSoLieuSection`/`generateThuThapSoLieu`
  ("Thu thập, phân loại số liệu") dù mục "Trạng thái Lớp 3" bên dưới (viết TRƯỚC phiên này) ghi là
  "Đợt 3, CHƯA làm" - có vẻ đã được code ở 1 phiên khác chưa cập nhật lại file này. Hoan kiểm tra
  lại thực tế trên app xem tính năng này đã ĐỦ 4 tầng (catalog/generator/preview/export) hay chỉ
  mới 1 phần, trước khi coi đây là "đã xong".

## Bối cảnh
- Rà soát Phiếu Bài Tập phát hiện: (1) dạng bài Lớp 2 ít hơn Lớp 1; (2) Phiếu Bài Tập hiện chỉ hỗ trợ Mầm non-Lớp 2, cần mở lên Lớp 3-5 (nhóm giáo viên Tiểu học lớn nhất chưa được phục vụ); (3) khoảng cách nội dung lớn giữa Lớp 1-2 và Lớp 5 (số thập phân, số hàng triệu, km²/dm²); (4) vấn đề in màu tốn tiền học sinh vs in đen trắng làm nền/icon bị đen, không rõ.

## File liên quan (đã xác nhận qua code thật)
- Catalog dạng bài: `src/data/worksheetExerciseCatalog.js` — dùng `GRADE_ORDER`, `minGrade`/`maxGrade`, hàm `isGradeInRange()`. Hiện `GRADE_ORDER = ["MAM_NON","LOP_1","LOP_2"]`.
- Logic sinh bài: `src/data/worksheetSchemas.js`, orchestrator `src/services/worksheetGenerator.js`.
- Form nhập liệu: `src/components/WorksheetForm.jsx` (chọn "Khối lớp" tại dòng ~391).
- Hiển thị/preview: `src/components/WorksheetPreview.jsx` — dùng `background`/`accent` màu + emoji `mascot` trực tiếp, CHƯA có biến thể đen trắng.
- Xuất Word: `src/services/worksheetExportService.js`.

## Quyết định đã chốt
1. Cách làm: **chỉ khảo sát/thiết kế catalog trước, chưa code** → ĐÃ CHUYỂN SANG CODE (xem "Trạng thái Lớp 3" bên dưới).
2. Xử lý in Màu/Đen trắng: **thêm nút chọn chế độ in (Màu / Đen trắng)** — CHƯA LÀM, để sau khi Lớp 3 xong hẳn.
3. Ưu tiên nội dung mới: **Toán trước** — đang làm đúng thứ tự này.

## Trạng thái Lớp 3 (Toán) — ĐÃ CODE Đợt 1 + Đợt 2, CHƯA CHẠY THỬ THỰC TẾ TRÊN APP
File giao gần nhất: `dekiemtra-lop3-dot2.zip` (đã gồm cả Đợt 1).

**Đợt 1 (xong):** mở khối Lớp 3 (`GRADE_ORDER`, `WORKSHEET_GRADES.LOP_3` maxNumber=100000, mapping SGK, dropdown form); mở rộng maxGrade lên LOP_3 cho `tinh_nham` (nhánh riêng số tròn), `so_sanh`, `day_so` (bước 10/100/1000), `sap_xep_thu_tu`, `noi_phep_tinh` (cap max=1000), `giai_toan` (AI, thêm nhân/chia bảng cửu chương); dạng bài MỚI `nhan_chia_bang`.

**Đợt 2 (xong):** 5 dạng bài mới — `chu_vi_dien_tich` (hình vuông/HCN), `doi_don_vi_do` (độ dài/khối lượng/dung tích), `xem_dong_ho_gio_phut` (ClockFace mở rộng nhận `minute`; Word export dùng text vì Unicode không đủ độ chi tiết), `tien_viet_nam`, `kha_nang_xay_ra` (ngân hàng 15 câu Chắc chắn/Có thể/Không thể).

**Đã kiểm thử:** stress test 500 lượt (Đợt 1) + 200 lượt/dạng bài (Đợt 2), 0 lỗi; catalog trả đúng 12 dạng bài Toán Lớp 3; cả 5 dạng bài Đợt 2 đã nối đủ 4 tầng (catalog/generator/preview/export). **CHƯA chạy `npm run dev` thực tế trên trình duyệt** (môi trường code không có node_modules) — Hoan cần tự kéo về chạy thử trước khi merge.

**Còn lại (Đợt 3, CHƯA làm):** "Thu thập/phân loại số liệu" (đọc bảng/biểu đồ cột) — hoãn vì cần UI bảng/biểu đồ phức tạp hơn, không dồn cùng đợt với 5 dạng bài trên. Cân nhắc thêm "gói chủ đề" Lớp 3 (`worksheetTopicPackages.js`) để bật cả nhóm 1 lần thay vì bật rời rạc 12 dạng bài.

## Catalog Toán Lớp 3-5 — ĐÃ XÁC NHẬN theo đúng SGK Kết nối tri thức (KNTT, tra cứu thực tế qua nhiều nguồn đối chiếu, không suy đoán)
Trường CHỈ dùng 1 bộ SGK: **Kết nối tri thức** (đã xác nhận với Hoan).

- **Lớp 3** (16 chủ đề, 81 bài): số đến 100.000; bảng nhân/chia; nhân chia phạm vi 100 và 1000; đơn vị đo độ dài, khối lượng, dung tích, **nhiệt độ**; **chu vi, diện tích hình chữ nhật/hình vuông** (đã có từ Lớp 3, KHÔNG đợi Lớp 4); xem đồng hồ, tháng-năm, tiền Việt Nam; **thu thập/phân loại số liệu + khả năng xảy ra của một sự kiện** (thống kê & xác suất cơ bản — mảng mới, Lớp 1-2 chưa có); làm quen hình phẳng/hình khối, hình tròn (tâm/bán kính/đường kính), góc vuông/không vuông.
- **Lớp 4**: số có 6 chữ số, số đến 1.000.000; **góc và đơn vị đo góc** (góc nhọn/tù/bẹt — mảng hoàn toàn mới); **biểu thức chữ** (làm quen ẩn số — mới); phân số (rút gọn, tìm phân số của một số); giải toán 3 bước tính; dãy số liệu thống kê (mở rộng từ Lớp 3).
- **Lớp 5**: số thập phân (đọc/viết/so sánh/4 phép tính); tỉ số phần trăm; hình tam giác, hình thang, hình tròn (chu vi/diện tích); thể tích + đơn vị đo thể tích (cm³/dm³); diện tích xung quanh/toàn phần hình hộp chữ nhật, hình lập phương, hình trụ; số đo thời gian; vận tốc/quãng đường/thời gian (toán chuyển động đều).

Nguồn: PPCT + giải SGK Toán 3/4/5 KNTT (VietJack, VnDoc, tailieumoi.vn, lop3.vn) — đối chiếu nhiều nguồn, khớp nhau.

## Vấn đề kỹ thuật cần xử lý khi mở khối
- ✅ ĐÃ XONG (Phiên 10): định dạng số kiểu Việt Nam dùng dấu chấm phân cách hàng nghìn - hàm dùng
  chung `src/services/numberFormatUtils.js`, xem chi tiết mục "MỚI NHẤT" đầu file. Số thập phân
  (dấu phẩy) CHƯA cần vì Lớp 3 chưa học - sẽ mở rộng hàm này khi bắt đầu Lớp 4-5.
- Đơn vị đo diện tích/thể tích Lớp 4-5 phức tạp hơn nhiều — mỗi bài chỉ nên dùng 1 loại đơn vị, tránh trộn km² lẫn cm² trong cùng câu hỏi.
- `GRADE_ORDER` hiện tại: `["MAM_NON","LOP_1","LOP_2","LOP_3"]` — mở thêm LOP_4/LOP_5 chỉ cần thêm vào cuối mảng.

## Thiết kế chế độ in Màu/Đen trắng (draft)
- Thêm field `printMode: "color" | "bw"` (mặc định `"color"`).
- Chế độ `"bw"`: bỏ `background` màu fill lớn, dùng nền trắng + viền đen/xám đậm để phân tách khối; giữ mascot emoji nguyên vẹn (vấn đề chính là nền màu lớn bị đen khi in, không phải icon nhỏ).
- Palette đen trắng là **bộ giá trị riêng song song**, không tính "làm nhạt màu" — theo đúng nguyên tắc isolation Hoan đã chọn.
- Cần đồng bộ ở CẢ 2 nơi: `WorksheetPreview.jsx` (xem web) và `worksheetExportService.js` (xuất Word) — vì giáo viên có thể in từ 1 trong 2 chỗ.
- Làm SAU khi có ít nhất 1 khối lớp mới hoàn chỉnh, để test trên dữ liệu thật.

## Quy trình triển khai đề xuất
1. Hoan xác nhận/chỉnh catalog Toán Lớp 3-5 ở trên.
2. Chốt thiết kế đơn vị đo + format số.
3. Chốt thiết kế chế độ in Màu/Đen trắng.
4. Code tuần tự: Lớp 3 → review → Lớp 4 → review → Lớp 5.
5. Làm chế độ in Màu/Đen trắng sau khi có ít nhất 1 khối lớp mới xong.

## Lưu ý chung của dự án (từ trước, vẫn áp dụng)
- Isolation over DRY: ưu tiên style/component tách riêng theo từng feature, chấp nhận trùng lặp code.
- Grep trước khi giả định phạm vi — luôn xác nhận số file thực tế trước khi sửa/xoá.
- Nhóm D (cải tiến nhỏ, làm trước Nhóm B) và Nhóm B (tính năng "Đề cương Ôn tập") vẫn đang chờ, độc lập với việc mở rộng Phiếu Bài Tập này.
