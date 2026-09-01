/**
 * config.js
 * Hằng số dùng chung toàn hệ thống - gom về 1 nơi để dễ mở rộng (thêm Lớp/Môn học mới chỉ cần
 * sửa ở đây, không phải lục tìm rải rác trong nhiều component).
 */

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * ================== GIAI ĐOẠN 32: mở rộng THCS (Lớp 6-9) ==================
 * THPT (Lớp 10-12) CỐ Ý CHƯA làm đợt này (đã chốt với Hoan) - lý do THPT có cơ cấu "8 môn bắt
 * buộc + chọn 4 trong 9 môn lựa chọn theo định hướng nghề nghiệp" (khác hẳn kiểu "học đủ mọi môn"
 * của Tiểu học/THCS), cần thiết kế dropdown riêng - để dành cho phiên sau. `GRADES` vẫn giữ 1-12
 * (không đổi) nhưng SUBJECTS bên dưới chỉ khai báo tới Lớp 9 - chọn Lớp 10-12 ở bất kỳ module nào
 * hiện sẽ ra danh sách môn RỖNG (đúng ý, tránh hiện nhầm môn Tiểu học/THCS không tồn tại ở THPT).
 *
 * `modules` (mảng tuỳ chọn) - MỚI thêm trong Giai đoạn 32: khai báo module nào (trong 3 module
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
 * "Lịch sử" (không kèm "và Địa lí") giữ nguyên cho khối THPT (10-12, môn thật ở cấp đó, tách khỏi
 * "Lịch sử và Địa lí" từ Lớp 10) - minGrade: 10 (SỬA từ 6 - trước đây đặt nhầm 6, đúng ra ở Lớp
 * 6-9 vẫn dùng "Lịch sử và Địa lí" gộp, "Lịch sử" đơn lẻ chỉ có thật từ THPT). THPT chưa làm đợt
 * này nên entry này TẠM CHƯA hiện ở đâu (GRADES dropdown mọi module vẫn dừng dữ liệu ở Lớp 9).
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
  { value: "Tu_Nhien_Xa_Hoi", label: "Tự nhiên và Xã hội", minGrade: 1, maxGrade: 3 },
  { value: "Lich_Su_Dia_Li", label: "Lịch sử và Địa lí", minGrade: 4, maxGrade: 9 },
  { value: "Khoa_Hoc", label: "Khoa học", minGrade: 4, maxGrade: 5 },
  { value: "Tin_Hoc", label: "Tin học", minGrade: 3, maxGrade: 9 },
  { value: "Cong_Nghe", label: "Công nghệ", minGrade: 3, maxGrade: 9 },
  { value: "Lich_Su", label: "Lịch sử", minGrade: 10 }, // THPT - chưa làm đợt này, xem comment trên

  // ================== THCS (Lớp 6-9) - Giai đoạn 32 ==================
  { value: "Ngu_Van", label: "Ngữ văn", minGrade: 6, maxGrade: 9, modules: LESSON_PLAN_AND_OUTLINE_ONLY },
  { value: "Giao_Duc_Cong_Dan", label: "Giáo dục công dân", minGrade: 6, maxGrade: 9 },
  { value: "Khoa_Hoc_Tu_Nhien", label: "Khoa học tự nhiên", minGrade: 6, maxGrade: 9 },
  { value: "Giao_Duc_The_Chat", label: "Giáo dục thể chất", minGrade: 6, maxGrade: 9, modules: NO_EXAM_MODULES },
  { value: "Am_Nhac", label: "Âm nhạc", minGrade: 6, maxGrade: 9, modules: NO_EXAM_MODULES },
  { value: "My_Thuat", label: "Mĩ thuật", minGrade: 6, maxGrade: 9, modules: NO_EXAM_MODULES },
  {
    value: "Hoat_Dong_Trai_Nghiem_Huong_Nghiep",
    label: "Hoạt động trải nghiệm, hướng nghiệp",
    minGrade: 6,
    maxGrade: 9,
    modules: NO_EXAM_MODULES,
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
