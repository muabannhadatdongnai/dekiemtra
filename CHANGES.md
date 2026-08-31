# Chuẩn hoá danh sách môn học Lớp 1-5 (fix dư thừa Lịch sử ở Lớp 1 + bổ sung môn thiếu)

## Cách áp dụng
Copy đè `src/data/config.js` và `src/data/subjectProfiles.js` vào repo (2 file này thay thế bản
đã gửi ở lượt trước — không cần áp lại 4 file kia, chúng không đổi thêm lần này).

Vẫn CHƯA chạy được `npm run build`/`npm test` thật (thiếu package.json/node_modules đầy đủ trong
sandbox) — đã tự kiểm tra bằng cách chạy trực tiếp `getSubjectsForGrade()` cho cả 12 khối để xác
nhận logic lọc đúng (xem bảng kết quả bên dưới), và `esbuild` xác nhận 3 form JSX vẫn build sạch.
Hoan vẫn nên `npm run build` + `npm test` trên máy trước khi merge.

## Vấn đề đã sửa
`SUBJECTS` cũ không có giới hạn khối lớp cho môn "Lịch sử" → hiện ở TẤT CẢ Lớp 1-12, kể cả Lớp 1
(sai, vì Tiểu học không có môn "Lịch sử" đứng riêng). Đồng thời thiếu 4 môn bắt buộc theo Thông tư
32/2018: Tự nhiên và Xã hội, Lịch sử và Địa lí, Tin học, Công nghệ.

## Căn cứ
Thông tư 32/2018/TT-BGDĐT (chương trình GDPT 2018 cấp Tiểu học, 10 môn + 1 hoạt động bắt buộc) và
cách chia sách bộ Kết nối tri thức:

| Môn                     | Khối dạy | Ghi chú |
|-------------------------|----------|---------|
| Tiếng Việt              | 1-5      | không đổi |
| Toán                    | 1-5      | không đổi |
| Đạo đức                 | 1-5      | đã thêm ở lượt trước |
| Tiếng Anh (Ngoại ngữ 1) | 1-5      | không đổi (bắt buộc từ Lớp 3, tự chọn Lớp 1-2 nên không giới hạn minGrade) |
| Tự nhiên và Xã hội      | 1-3      | **MỚI** |
| Lịch sử và Địa lí       | 4-5      | **MỚI** (thay cho nhãn "Lịch sử" sai tên ở Tiểu học) |
| Khoa học                | 4-5      | đã thêm ở lượt trước |
| Tin học                 | 3-5      | **MỚI** — Kết nối tri thức in "Tin học" và "Công nghệ" thành 2 đầu sách riêng dù chương trình gọi chung "Tin học và Công nghệ" |
| Công nghệ               | 3-5      | **MỚI** |
| Lịch sử (THCS/THPT)     | 6-12     | **SỬA**: thêm `minGrade: 6` — môn thật đúng ở Lớp 6-12, không còn hiện nhầm ở Tiểu học nữa |

**Kết quả sau khi sửa (đã chạy thử `getSubjectsForGrade()` thật cho cả 12 khối):**
```
Lớp 1: Tiếng Việt, Toán, Đạo đức, Tiếng Anh, Tự nhiên và Xã hội
Lớp 2: Tiếng Việt, Toán, Đạo đức, Tiếng Anh, Tự nhiên và Xã hội
Lớp 3: Tiếng Việt, Toán, Đạo đức, Tiếng Anh, Tự nhiên và Xã hội, Tin học, Công nghệ
Lớp 4: Tiếng Việt, Toán, Đạo đức, Tiếng Anh, Lịch sử và Địa lí, Khoa học, Tin học, Công nghệ
Lớp 5: Tiếng Việt, Toán, Đạo đức, Tiếng Anh, Lịch sử và Địa lí, Khoa học, Tin học, Công nghệ
Lớp 6-12: Tiếng Việt, Toán, Tiếng Anh, Lịch sử   (không đổi so với trước, ngoài phạm vi yêu cầu)
```

Đã thêm `SUBJECT_PROFILES` (vai trò AI + quy tắc riêng môn, dùng chung 3 tab) cho cả 4 môn mới —
mỗi môn có lưu ý riêng để tránh sai kiến thức (VD Tự nhiên và Xã hội không dùng thuật ngữ trừu
tượng của Khoa học Lớp 4-5; Lịch sử và Địa lí tách rõ 2 phân môn không trộn lẫn; Tin học không yêu
cầu viết mã lập trình văn bản; Công nghệ ưu tiên câu hỏi quy trình/công dụng).

## Quyết định CHỦ ĐỘNG — cần Hoan xác nhận nếu muốn mở rộng thêm
**KHÔNG** thêm Giáo dục thể chất, Âm nhạc, Mĩ thuật, Hoạt động trải nghiệm vào lần này. Lý do:
các môn/hoạt động này đánh giá bằng NHẬN XÉT, không có bài kiểm tra định kỳ theo ma trận đề như
8 môn ở trên, và giáo án của chúng thiên về vận động/thực hành/trải nghiệm — cấu trúc rất khác so
với dạng "chương-bài trong SGK" mà 3 tab hiện dùng. Nếu Hoan muốn thêm, nên làm thành 1 việc riêng
(cần bàn cấu trúc UI khác, không nên gộp chung khuôn hiện tại) — kiến trúc `minGrade`/`maxGrade`
đã sẵn sàng hỗ trợ khi cần.

## Vẫn cần Hoan tự bổ sung (giống lượt trước, giờ nhân thêm 4 môn mới)
Dữ liệu SGK thật trong kho GitHub kiến thức cho `Tu_Nhien_Xa_Hoi` (Lớp 1-3), `Lich_Su_Dia_Li`
(Lớp 4-5), `Tin_Hoc` (Lớp 3-5), `Cong_Nghe` (Lớp 3-5) — không có thì dropdown "Chương" rỗng, đúng
hành vi an toàn sẵn có, không phải lỗi.
