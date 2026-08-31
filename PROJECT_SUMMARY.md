# PROJECT_SUMMARY.md — Lịch sử phát triển (rút gọn)

> File này là **changelog cô đọng**, không phải nhật ký chi tiết từng dòng code. Mỗi mục chỉ giữ:
> làm gì, vì sao (nếu là sửa lỗi thật), kết quả kiểm thử. Việc CÒN TỒN ĐỌNG nằm ở `NEXT_STEPS.md`,
> không lặp lại ở đây. Bản đầy đủ 3141 dòng trước khi rút gọn vẫn còn trong lịch sử Git nếu cần
> tra cứu chi tiết kỹ thuật (cách sửa từng dòng, số liệu debug đầy đủ).

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
