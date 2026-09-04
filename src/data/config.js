/**
 * config.js
 * Hằng số dùng chung toàn hệ thống - gom về 1 nơi để dễ mở rộng (thêm Lớp/Môn học mới chỉ cần
 * sửa ở đây, không phải lục tìm rải rác trong nhiều component).
 */

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * ================== PHIÊN 33: mở rộng THPT (Lớp 10-12) ==================
 * TIẾP THEO Giai đoạn 32 (THCS Lớp 6-9). `GRADES` vẫn giữ 1-12 (không đổi từ đầu), SUBJECTS bên
 * dưới giờ khai báo ĐỦ Mầm non -> Lớp 12.
 *
 * ⚠️ ĐIỂM KHÁC BIỆT LỚN của THPT so với Tiểu học/THCS (chương trình GDPT 2018, giai đoạn "định
 * hướng nghề nghiệp"): không phải "học đủ mọi môn" mà có cơ cấu:
 *   - 8 môn/HĐGD BẮT BUỘC: Ngữ văn, Toán, Ngoại ngữ 1, Lịch sử, Giáo dục thể chất, Giáo dục quốc
 *     phòng và an ninh, Hoạt động trải nghiệm - hướng nghiệp, Nội dung giáo dục của địa phương.
 *   - 9 môn LỰA CHỌN (mỗi trường/học sinh chọn tối thiểu 4/9 theo định hướng nghề nghiệp): Địa lí,
 *     Giáo dục kinh tế và pháp luật, Vật lí, Hoá học, Sinh học, Công nghệ, Tin học, Âm nhạc, Mĩ thuật.
 *   - Cụm chuyên đề học tập (3 chuyên đề/môn, chọn trong số các môn lựa chọn hoặc Toán/Ngữ văn/
 *     Lịch sử) - CHƯA hỗ trợ trong hệ thống này (xem NEXT_STEPS.md, để dành phiên sau vì đây là nội
 *     dung RIÊNG ngoài SGK đại trà, không đơn thuần "thêm 1 khối lớp").
 * ⚠️ QUAN TRỌNG: cơ cấu "bắt buộc/lựa chọn" này là chuyện XẾP THỜI KHOÁ BIỂU của nhà trường/học
 * sinh (môn nào được HỌC), KHÔNG ảnh hưởng tới cách hệ thống này hoạt động - công cụ soạn 1 giáo
 * án/đề cương/đề kiểm tra tại 1 thời điểm LUÔN theo 1 môn học đã chọn sẵn (giáo viên dạy môn gì thì
 * chọn đúng môn đó), nên KHÔNG cần dựng UI "chọn tổ hợp 4/9 môn" - chỉ cần khai báo ĐỦ cả 17 môn/
 * HĐGD (8 bắt buộc + 9 lựa chọn) làm 17 lựa chọn RIÊNG BIỆT trong dropdown "Môn học" ở Lớp 10-12,
 * đúng như Tiểu học/THCS đang làm (đây chính là quyết định "KHÔNG cần dropdown riêng" đã tính toán
 * lại so với ghi chú cũ ở `NEXT_STEPS.md` mục #12 - dropdown vẫn dùng chung `getSubjectsForGrade`,
 * chỉ cần khai báo đủ dữ liệu môn).
 *
 * `modules` (mảng tuỳ chọn) - khai báo module nào (trong 3 module
 * Soạn giáo án/Đề cương Ôn tập/Đề kiểm tra) môn học này được phép xuất hiện. KHÔNG khai báo =
 * mặc định CẢ 3 (giữ đúng hành vi cũ, không phá dữ liệu môn Tiểu học đã có từ trước). Lý do cần
 * field này: 2 nhóm môn có quy tắc khác hẳn môn "học thuật" thông thường:
 *   1. Môn đánh giá bằng NHẬN XÉT, không kiểm tra định kỳ theo ma trận đề (GDTC, Âm nhạc, Mĩ
 *      thuật, Hoạt động trải nghiệm - hướng nghiệp) - CHỈ modules: ["lessonPlan"], vẫn cần giáo án
 *      nhưng không hợp lý để có "Đề cương Ôn tập"/"Đề kiểm tra" (đúng nguyên tắc đã áp dụng cho
 *      Tiểu học từ trước, nay áp dụng luôn cho THCS thay vì loại hẳn khỏi hệ thống).
 *   2. Ngữ văn (THCS): theo Công văn 3175/BGDĐT-GDTrH (2022, được nhấn mạnh lại ở Công văn
 *      3935/2024) - đề kiểm tra định kỳ Ngữ văn BẮT BUỘC dùng ngữ liệu MỚI ngoài SGK, cấu trúc đề
 *      (Đọc hiểu + Viết đoạn Nghị luận xã hội + Viết bài Nghị luận văn học) khác hẳn khuôn "ma
 *      trận trắc nghiệm/tự luận" chung hiện có VÀ khác 4 khối của "Đề Tiếng Việt Tiểu học" - cần 1
 *      module xuất đề RIÊNG (đã chốt để làm phiên sau, chưa thiết kế trong đợt này) nên TẠM THỜI
 *      modules: ["lessonPlan", "outline"] (không có "exam") - dropdown "Đề cương Ôn tập"/"Soạn
 *      giáo án" vẫn dùng Ngữ văn bình thường (2 module này không phụ thuộc cấu trúc đề kiểm tra).
 *
 * ⚠️ Danh sách môn Tiểu học (Lớp 1-5) chuẩn hoá theo ĐÚNG Thông tư 32/2018/TT-BGDĐT (chương trình
 * GDPT 2018 cấp Tiểu học: 10 môn học + 1 hoạt động giáo dục bắt buộc) và cách chia sách của bộ
 * Kết nối tri thức với cuộc sống (mỗi môn/phân môn = 1 đầu sách riêng):
 *
 *   Môn                      | Khối dạy    | Ghi chú
 *   ------------------------ | ----------- | ------------------------------------------------
 *   Tiếng Việt                | Lớp 1-5     |
 *   Toán                      | Lớp 1-5     |
 *   Đạo đức                   | Lớp 1-5     |
 *   Tiếng Anh (Ngoại ngữ 1)    | Lớp 1-5     | bắt buộc từ Lớp 3, tự chọn Lớp 1-2 -> không giới
 *                              |             |   hạn minGrade để vẫn chọn được ở Lớp 1-2 nếu trường
 *                              |             |   có dạy tự chọn.
 *   Tự nhiên và Xã hội         | Lớp 1-3     | tách thành Lịch sử và Địa lí + Khoa học từ Lớp 4.
 *   Lịch sử và Địa lí          | Lớp 4-5     | 1 môn gộp 2 phân môn (SGK Kết nối tri thức in
 *                              |             |   chung 1 cuốn) - KHÔNG dùng nhãn "Lịch sử" đơn lẻ
 *                              |             |   ở Tiểu học vì sai tên môn thật.
 *   Khoa học                   | Lớp 4-5     |
 *   Tin học                    | Lớp 3-5     | Kết nối tri thức in "Tin học" và "Công nghệ" thành
 *   Công nghệ                  | Lớp 3-5     |   2 đầu sách riêng dù chương trình gọi chung là
 *                              |             |   "Tin học và Công nghệ" - tách 2 môn để đúng với
 *                              |             |   cách giáo viên thực dạy/thực chấm theo từng sách.
 *
 * ⚠️ Danh sách môn THCS (Lớp 6-9) chuẩn hoá theo ĐÚNG Thông tư 32/2018/TT-BGDĐT, Mục 4 (sửa đổi,
 * bổ sung bởi khoản 1 Điều 1 Thông tư 13/2022/TT-BGDĐT) - 10 môn học bắt buộc + Hoạt động trải
 * nghiệm-hướng nghiệp, và cách chia sách Kết nối tri thức:
 *
 *   Môn                      | Khối dạy    | Ghi chú
 *   ------------------------ | ----------- | ------------------------------------------------
 *   Ngữ văn                   | Lớp 6-9     | NHÃN MỚI - Tiểu học gọi "Tiếng Việt", THCS trở lên
 *                              |             |   đổi tên "Ngữ văn" theo đúng thông tư, KHÔNG dùng
 *                              |             |   chung 1 giá trị với "Tieng_Viet" (2 subjectProfile
 *                              |             |   khác hẳn: THCS có Đọc hiểu/NLXH/NLVH, Tiểu học
 *                              |             |   không có).
 *   Toán, Tiếng Anh            | Lớp 6-9     | TÁI DÙNG entry đã có (không giới hạn minGrade/
 *                              |             |   maxGrade từ trước) - không cần sửa.
 *   Giáo dục công dân          | Lớp 6-9     | THAY "Đạo đức" (chỉ ở Tiểu học) - môn RIÊNG, không
 *                              |             |   dùng lại giá trị Dao_Duc (nội dung/độ khó khác hẳn:
 *                              |             |   có kiến thức pháp luật cơ bản, không còn thuần
 *                              |             |   giáo dục phẩm chất như Tiểu học).
 *   Khoa học tự nhiên          | Lớp 6-9     | MỚI - môn TÍCH HỢP Lý-Hoá-Sinh (khác "Khoa học" Tiểu
 *                              |             |   học vốn không dùng công thức/số liệu tính toán).
 *   Lịch sử và Địa lí          | Lớp 4-9     | MỞ RỘNG maxGrade từ entry đã có (Lớp 4-5) lên Lớp 9 -
 *                              |             |   vẫn là 1 môn gộp xuyên suốt Tiểu học->THCS, CHỈ
 *                              |             |   tách thành 2 môn riêng (Lịch sử / Địa lí) từ THPT.
 *   Tin học, Công nghệ         | Lớp 3-9     | MỞ RỘNG maxGrade từ entry đã có (Lớp 3-5) lên Lớp 9 -
 *                              |             |   vẫn đúng tên môn xuyên suốt, chỉ độ sâu nội dung
 *                              |             |   khác theo khối (xem subjectProfiles.js).
 *   GDTC, Âm nhạc, Mĩ thuật,   | Lớp 6-9     | MỚI - đánh giá bằng NHẬN XÉT, không kiểm tra định kỳ
 *   HĐTN-HN                    |             |   -> modules: ["lessonPlan"] (xem giải thích ở trên).
 *                              |             |   THCS gọi "Nghệ thuật" là 1 môn gộp Âm nhạc+Mĩ
 *                              |             |   thuật theo thông tư, nhưng Kết nối tri thức in 2
 *                              |             |   đầu sách riêng - tách 2 môn giống cách đã làm với
 *                              |             |   "Tin học và Công nghệ" ở Tiểu học, để khớp cách
 *                              |             |   giáo viên thực dạy/thực soạn theo từng sách.
 *
 * "Lịch sử" (không kèm "và Địa lí") là môn THẬT RIÊNG từ THPT (tách khỏi "Lịch sử và Địa lí" gộp
 * dùng xuyên suốt Tiểu học->THCS) - minGrade: 10. Theo Thông tư 13/2022/TT-BGDĐT (03/08/2022, sửa
 * đổi Thông tư 32/2018), Lịch sử chuyển từ môn LỰA CHỌN (nhóm Khoa học xã hội) thành môn BẮT BUỘC
 * cho mọi học sinh THPT, thời lượng 52 tiết/năm (phần cốt lõi) + có thêm chuyên đề học tập lựa
 * chọn riêng 35 tiết/năm cho học sinh chọn định hướng KHXH (chuyên đề CHƯA hỗ trợ - xem trên).
 *
 * ⚠️ Danh sách môn THPT (Lớp 10-12) chuẩn hoá theo ĐÚNG Thông tư 32/2018/TT-BGDĐT (mục "Giai đoạn
 * giáo dục định hướng nghề nghiệp"), ĐÃ ÁP DỤNG sửa đổi bởi Thông tư 13/2022/TT-BGDĐT (Lịch sử
 * thành bắt buộc), và Thông tư 22/2021/TT-BGDĐT (quy định đánh giá - xác định môn nào chỉ chấm
 * NHẬN XÉT để gán đúng `modules`):
 *
 *   Môn (BẮT BUỘC)            | Khối dạy    | Ghi chú
 *   ------------------------- | ----------- | ------------------------------------------------
 *   Ngữ văn, Toán, Tiếng Anh   | Lớp 10-12   | TÁI DÙNG entry đã có (mở maxGrade Ngữ văn lên 12,
 *                              |             |   Toán/Tiếng Anh vốn không giới hạn từ trước).
 *   Lịch sử                   | Lớp 10-12   | Xem giải thích Thông tư 13/2022 ở trên - môn RIÊNG,
 *                              |             |   KHÔNG dùng lại "Lịch sử và Địa lí".
 *   Giáo dục thể chất          | Lớp 10-12   | TÁI DÙNG entry THCS (mở maxGrade lên 12) - vẫn
 *                              |             |   nhận xét-only theo Thông tư 22 Điều 5 Khoản 3.
 *   Hoạt động trải nghiệm,     | Lớp 10-12   | TÁI DÙNG entry THCS (mở maxGrade lên 12) - nhận
 *   hướng nghiệp               |             |   xét-only, nội dung đổi trọng tâm sang hướng nghiệp.
 *   Giáo dục quốc phòng và an  | Lớp 10-12   | MỚI - ⚠️ theo Thông tư 22 Điều 5 Khoản 3, GDQP&AN
 *   ninh                       |             |   KHÔNG nằm trong nhóm "chỉ nhận xét" (khác GDTC) -
 *                              |             |   vẫn có điểm số, nên modules mặc định CẢ 3 (đủ Đề
 *                              |             |   kiểm tra/Đề cương phần lý thuyết, dù thực hành vẫn
 *                              |             |   cần đánh giá riêng ngoài hệ thống này).
 *   Nội dung giáo dục của địa  | Lớp 6-12    | MỚI - nhận xét-only theo Thông tư 22. Áp dụng chung
 *   phương                     |             |   THCS lẫn THPT (đúng Thông tư 32) - trước đây THCS
 *                              |             |   (Giai đoạn 32) BỎ SÓT môn này, bổ sung luôn ở đây.
 *
 *   Môn (LỰA CHỌN - chọn ≥4/9)| Khối dạy    | Ghi chú
 *   ------------------------- | ----------- | ------------------------------------------------
 *   Tin học, Công nghệ         | Lớp 3-12    | MỞ RỘNG maxGrade từ entry đã có (Lớp 3-9) lên 12.
 *   Âm nhạc, Mĩ thuật          | Lớp 6-12    | MỞ RỘNG maxGrade từ entry đã có (Lớp 6-9) lên 12 -
 *                              |             |   vẫn nhận xét-only ("Nghệ thuật" theo Thông tư 22).
 *   Vật lí, Hoá học, Sinh học  | Lớp 10-12   | MỚI - 3 phân môn TÁCH RIÊNG khỏi "Khoa học tự nhiên"
 *                              |             |   (môn tích hợp chỉ có ở THCS, dừng ở Lớp 9).
 *   Địa lí                     | Lớp 10-12   | MỚI - tách riêng khỏi "Lịch sử và Địa lí" gộp (môn
 *                              |             |   gộp dừng ở Lớp 9, xem entry Lich_Su_Dia_Li).
 *   Giáo dục kinh tế và pháp   | Lớp 10-12   | MỚI - kế thừa tinh thần "Giáo dục công dân" THCS
 *   luật                       |             |   nhưng có thêm kiến thức kinh tế cơ bản, môn RIÊNG
 *                              |             |   (không tái dùng Giao_Duc_Cong_Dan, dừng ở Lớp 9).
 *
 * 2 field TUỲ CHỌN `minGrade`/`maxGrade`: không khai báo = áp dụng MỌI khối (Toán/Tiếng Việt/
 * Tiếng Anh không cần giới hạn vì dạy xuyên suốt/tự chọn sớm).
 */
export const MODULE_KEYS = { LESSON_PLAN: "lessonPlan", OUTLINE: "outline", EXAM: "exam" };
const ALL_MODULES = [MODULE_KEYS.LESSON_PLAN, MODULE_KEYS.OUTLINE, MODULE_KEYS.EXAM];
const NO_EXAM_MODULES = [MODULE_KEYS.LESSON_PLAN]; // môn đánh giá bằng nhận xét, không kiểm tra định kỳ
const LESSON_PLAN_AND_OUTLINE_ONLY = [MODULE_KEYS.LESSON_PLAN, MODULE_KEYS.OUTLINE]; // Ngữ văn - chờ module đề riêng

export const SUBJECTS = [
  { value: "Tieng_Viet", label: "Tiếng Việt", maxGrade: 5 },
  { value: "Toan", label: "Toán" },
  { value: "Dao_Duc", label: "Đạo đức", minGrade: 1, maxGrade: 5 },
  { value: "Tieng_Anh", label: "Tiếng Anh" },

  // ================== Ngoại ngữ 2 (Lớp 6-12) - Phiên 38 ==================
  // Theo bộ Kết nối tri thức: Tiếng Trung/Tiếng Pháp/Tiếng Nhật được biên soạn làm "Ngoại ngữ 2"
  // (môn tự chọn, khác Tiếng Anh - "Ngoại ngữ 1" bắt buộc) - triển khai chính khoá từ Lớp 6 (THCS)
  // theo chủ trương chung "Ngoại ngữ 2" (Thông tư 32/2018, áp dụng từ năm học 2022-2023), kéo dài
  // xuyên suốt THPT. minGrade: 6 - KHÔNG áp dụng Tiểu học (khác Tieng_Anh vốn là Ngoại ngữ 1 dạy từ
  // Lớp 1/bắt buộc từ Lớp 3). modules: không khai báo = mặc định CẢ 3 (Soạn Giáo án/Đề cương Ôn
  // tập/Tạo Đề Kiểm tra), giống Tieng_Anh - AI sinh nội dung TRỰC TIẾP bằng đúng ngôn ngữ đó ngay
  // từ đầu (xem foreignLanguageSubjects.js, cùng kiến trúc Phiên 35 áp dụng cho Tiếng Anh).
  { value: "Tieng_Trung", label: "Tiếng Trung", minGrade: 6, maxGrade: 12 },
  { value: "Tieng_Nhat", label: "Tiếng Nhật", minGrade: 6, maxGrade: 12 },
  { value: "Tieng_Phap", label: "Tiếng Pháp", minGrade: 6, maxGrade: 12 },
  { value: "Tu_Nhien_Xa_Hoi", label: "Tự nhiên và Xã hội", minGrade: 1, maxGrade: 3 },
  { value: "Lich_Su_Dia_Li", label: "Lịch sử và Địa lí", minGrade: 4, maxGrade: 9 },
  { value: "Khoa_Hoc", label: "Khoa học", minGrade: 4, maxGrade: 5 },
  { value: "Tin_Hoc", label: "Tin học", minGrade: 3, maxGrade: 12 },
  { value: "Cong_Nghe", label: "Công nghệ", minGrade: 3, maxGrade: 12 },
  { value: "Lich_Su", label: "Lịch sử", minGrade: 10, maxGrade: 12 }, // THPT - bắt buộc, xem comment trên (Thông tư 13/2022)

  // ================== THCS (Lớp 6-9) - Giai đoạn 32 ==================
  { value: "Ngu_Van", label: "Ngữ văn", minGrade: 6, maxGrade: 12, modules: LESSON_PLAN_AND_OUTLINE_ONLY },
  { value: "Giao_Duc_Cong_Dan", label: "Giáo dục công dân", minGrade: 6, maxGrade: 9 },
  { value: "Khoa_Hoc_Tu_Nhien", label: "Khoa học tự nhiên", minGrade: 6, maxGrade: 9 },
  { value: "Giao_Duc_The_Chat", label: "Giáo dục thể chất", minGrade: 6, maxGrade: 12, modules: NO_EXAM_MODULES },
  { value: "Am_Nhac", label: "Âm nhạc", minGrade: 6, maxGrade: 12, modules: NO_EXAM_MODULES },
  { value: "My_Thuat", label: "Mĩ thuật", minGrade: 6, maxGrade: 12, modules: NO_EXAM_MODULES },
  {
    value: "Hoat_Dong_Trai_Nghiem_Huong_Nghiep",
    label: "Hoạt động trải nghiệm, hướng nghiệp",
    minGrade: 6,
    maxGrade: 12,
    modules: NO_EXAM_MODULES,
  },
  {
    value: "Noi_Dung_Giao_Duc_Dia_Phuong",
    label: "Nội dung giáo dục của địa phương",
    minGrade: 6,
    maxGrade: 12,
    modules: NO_EXAM_MODULES,
  }, // bổ sung cùng đợt THPT - THCS trước đây bỏ sót (xem comment trên)

  // ================== THPT (Lớp 10-12) - Phiên 33 ==================
  // 8 môn/HĐGD bắt buộc còn lại (Ngữ văn/Toán/Tiếng Anh/Lịch sử/GDTC/HĐTN-HN/Nội dung GD địa
  // phương đã tái dùng entry có sẵn ở trên) + 9 môn lựa chọn (Tin học/Công nghệ/Âm nhạc/Mĩ thuật
  // cũng đã tái dùng ở trên) - 6 entry MỚI dưới đây là phần còn thiếu.
  { value: "Giao_Duc_Quoc_Phong_An_Ninh", label: "Giáo dục quốc phòng và an ninh", minGrade: 10, maxGrade: 12 },
  { value: "Vat_Li", label: "Vật lí", minGrade: 10, maxGrade: 12 },
  { value: "Hoa_Hoc", label: "Hoá học", minGrade: 10, maxGrade: 12 },
  { value: "Sinh_Hoc", label: "Sinh học", minGrade: 10, maxGrade: 12 },
  { value: "Dia_Li", label: "Địa lí", minGrade: 10, maxGrade: 12 },
  {
    value: "Giao_Duc_Kinh_Te_Va_Phap_Luat",
    label: "Giáo dục kinh tế và pháp luật",
    minGrade: 10,
    maxGrade: 12,
  },
];

export function getSubjectLabel(value) {
  return SUBJECTS.find((s) => s.value === value)?.label || value;
}

/**
 * Trả về danh sách môn học PHÙ HỢP với khối lớp đang chọn (lọc theo minGrade/maxGrade nếu môn
 * có khai báo), và tuỳ chọn lọc thêm theo MODULE đang gọi (`moduleKey` - xem MODULE_KEYS) nếu môn
 * có khai báo `modules` (không khai báo = hiện ở CẢ 3 module, giữ đúng hành vi cũ). Dùng ở dropdown
 * "Môn học" của cả 3 tab (Soạn giáo án/Đề cương Ôn tập/Đề kiểm tra) thay vì render thẳng SUBJECTS -
 * tránh giáo viên chọn nhầm môn không tồn tại ở khối đó, hoặc chọn môn không hợp lệ cho module đó
 * (VD Âm nhạc không có "Đề kiểm tra", Ngữ văn THCS chưa có "Đề kiểm tra" - xem giải thích đầy đủ ở
 * đầu file).
 *
 * `grade` có thể là số (1-12, luồng Đề kiểm tra/Đề cương) hoặc chuỗi đặc biệt (VD "MAM_NON" bên
 * Soạn giáo án) - trường hợp không parse được thành số, trả về nguyên SUBJECTS (không lọc theo
 * khối, nhưng VẪN lọc theo module nếu `moduleKey` có truyền), vì các khối không phải số không
 * thuộc phạm vi minGrade/maxGrade đang xét.
 */
export function getSubjectsForGrade(grade, moduleKey) {
  const gradeNum = Number(grade);
  const gradeFiltered = Number.isFinite(gradeNum)
    ? SUBJECTS.filter((s) => {
        if (s.minGrade != null && gradeNum < s.minGrade) return false;
        if (s.maxGrade != null && gradeNum > s.maxGrade) return false;
        return true;
      })
    : SUBJECTS;

  if (!moduleKey) return gradeFiltered;
  return gradeFiltered.filter((s) => (s.modules || ALL_MODULES).includes(moduleKey));
}
