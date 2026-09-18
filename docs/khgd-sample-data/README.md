# Bộ dữ liệu mẫu — Tiếng Anh Lớp 7 (Global Success), cho nút "Nạp gợi ý tên bài từ SGK"

Thư mục này chứa 24 file (12 Unit × 2 file `.md` + `.json`) lấy ĐÚNG tên Unit + 7 dạng bài chuẩn
(Getting started/A closer look 1-2/Communication/Skills 1-2/Looking back & Project) từ chính PPCT
Tiếng Anh 7 bạn đã gửi ở Phiên 44 (`Phụ_lục_III__LOP_7_ĐÃ_LỒNG_GHÉP_KHUYET_TAT_LOP_7.pdf`).

## Cách dùng

Copy TOÀN BỘ nội dung thư mục `lop_7/` bên trong đây vào ĐÚNG vị trí `sach_giao_khoa/` trong kho
GitHub kiến thức riêng của bạn (biến `GITHUB_KNOWLEDGE_REPO` trong `.env.local`), sao cho đường
dẫn cuối cùng là:

```
sach_giao_khoa/lop_7/tieng_anh_t1/chuong_1.md
sach_giao_khoa/lop_7/tieng_anh_t1/chuong_1_bai.json
... (đến chuong_6, Tập 1)
sach_giao_khoa/lop_7/tieng_anh_t2/chuong_1.md
... (đến chuong_6, Tập 2 = Unit 7-12)
```

Sau khi copy, nút "Nạp gợi ý tên bài từ SGK" ở tab Khung KHGD (chọn Môn = Tiếng Anh, Lớp = 7) sẽ
hiện đủ 12 nút Unit, bấm vào sẽ nạp 7 dòng bài học/Unit vào bảng.

## ⚠️ Giới hạn CẦN BIẾT trước khi dùng thật

- Mỗi file `.md` CHỈ liệt kê khung 7 dạng bài + 1 câu mô tả CHỨC NĂNG chung của từng dạng bài
  (kiến thức sư phạm phổ biến của SGK Global Success, áp dụng như nhau cho mọi Unit) - **KHÔNG
  có** từ vựng/ngữ pháp/ngữ liệu bài đọc cụ thể của từng Unit, vì Claude không có quyền truy cập
  nguyên văn SGK và không nên bịa nội dung học thuật cụ thể.
- Nếu bạn muốn dùng chính các file này cho tab **Soạn Giáo án/Đề Cương Ôn Tập** (2 tab đó CẦN nội
  dung SGK thật, chi tiết hơn nhiều để AI soạn đúng), bạn cần tự bổ sung thêm nội dung chi tiết
  thật vào file `.md` — file hiện tại chỉ đủ dùng cho tab Khung KHGD (chỉ cần TÊN BÀI).
- Số tiết mỗi bài KHÔNG có trong các file này — đúng thiết kế: tab Khung KHGD để giáo viên tự gõ
  tay số tiết/tuần (xem `NEXT_STEPS.md` mục "Khung KHGD").
- 3 mốc kiểm tra/ôn tập xen giữa các Unit (Review 1/2/3, Kiểm tra giữa kỳ...) KHÔNG có trong bộ
  dữ liệu này (không thuộc riêng Unit nào) — bạn tự thêm các dòng đó bằng tay ở bảng PPCT như bình
  thường, giống cách đã làm với file mẫu Phiên 44.

## Muốn làm cho môn/khối khác?

Lặp lại đúng cấu trúc này (`sach_giao_khoa/lop_{khối}/{môn}_t{tập}/chuong_{n}.md` +
`chuong_{n}_bai.json`) — nhưng bạn cần tự cung cấp tên bài thật của môn/khối đó (từ PPCT nhà
trường hoặc mục lục SGK thật), gửi cho Claude ở phiên sau để tạo file tương tự, tránh Claude tự
bịa tên bài cho môn không có nguồn.
