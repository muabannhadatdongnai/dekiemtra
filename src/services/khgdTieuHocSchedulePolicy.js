/**
 * khgdTieuHocSchedulePolicy.js  (Phiên 50)
 * CHÍNH SÁCH xếp lịch Ôn tập/Kiểm tra định kì riêng cho tab "Khung KHGD - Tiểu học" (truyền vào
 * khgdSchedule.planSemester). File RIÊNG với khgdSchedulePolicy.js (THCS/THPT) - đúng nguyên tắc
 * "isolation over DRY": Tiểu học đánh giá theo Thông tư 27/2020, THCS/THPT theo Thông tư 22/2021.
 *
 * Căn cứ (đã đối chiếu văn bản, KHÔNG suy diễn):
 *   - Thông tư 27/2020/TT-BGDĐT Điều 7 khoản 1: đánh giá định kì vào GIỮA HK I, CUỐI HK I, GIỮA HK II và
 *     CUỐI NĂM HỌC (cả 4 mốc, mọi môn/hoạt động giáo dục - giáo viên đánh giá theo mức, không nhất thiết có bài viết).
 *   - Điều 7 khoản 1b: BÀI KIỂM TRA định kì chỉ có vào CUỐI HK I và CUỐI NĂM HỌC, với các môn bắt buộc Tiếng Việt, Toán,
 *     Ngoại ngữ 1, Lịch sử và Địa lí, Khoa học, Tin học và Công nghệ; riêng LỚP 4, LỚP 5 thêm bài kiểm tra Tiếng Việt và
 *     Toán vào GIỮA HK I và GIỮA HK II. Các môn còn lại (Đạo đức, Tự nhiên và Xã hội, GDTC, Âm nhạc, Mĩ thuật, HĐTN...)
 *     KHÔNG có bài kiểm tra định kì → không thêm dòng "Kiểm tra" cho các môn đó.
 *   - Khung thời gian năm học của Bộ GD&ĐT: 35 tuần = HK I 18 tuần + HK II 17 tuần (khgdSchedule.js).
 *
 * ⚠️ KHÔNG có quy định số tiết cho bài kiểm tra Tiểu học (thời gian làm bài do nhà trường quyết định) nên mặc định
 * 1 tiết/bài kiểm tra, giáo viên sửa được ở bảng. Số tiết ÔN TẬP không lấy từ quy định mà từ QUỸ TIẾT còn lại của
 * học kì (xem khgdSchedule.js) hoặc, khi còn bài chưa chốt tiết, quy tắc ½ tuần (giữa kì) / 1 tuần (cuối kì).
 */

/**
 * Số tiết/tuần gợi ý - CHỈ điền các trường hợp đã có căn cứ; môn/khối khác để trống cho giáo viên tự nhập
 * (trước Phiên 50 mặc định cứng 10 tiết/tuần → sai với mọi môn ngoài Tiếng Việt Lớp 2, xem NEXT_STEPS #26).
 *   Tiếng Việt Lớp 2: 350 tiết/năm = 10 tiết/tuần (PPCT giáo viên gửi, Phiên 47-48).
 *   Tiếng Việt Lớp 3: 245 tiết/năm = 7 tiết/tuần; Toán Lớp 3: 175 tiết/năm = 5 tiết/tuần (CTGDPT 2018, lớp 3).
 *   Tiếng Việt Lớp 5: 245 tiết/năm = 7 tiết/tuần (KHDH khối 5 của trường - PPCT đối chiếu).
 */
export const TIEU_HOC_TIET_PER_WEEK_DEFAULTS = {
  "Tieng_Viet:2": 10,
  "Tieng_Viet:3": 7,
  "Tieng_Viet:5": 7,
  "Toan:3": 5,
};

/** @returns {number|null} - null = chưa có căn cứ, giáo viên tự nhập. */
export function getTieuHocDefaultTietPerWeek(subject, grade) {
  return TIEU_HOC_TIET_PER_WEEK_DEFAULTS[`${subject}:${Number(grade)}`] ?? null;
}

// Môn có BÀI KIỂM TRA định kì cuối HK I / cuối năm (Thông tư 27 Điều 7.1b). "Tin học và Công nghệ" là 1 môn trong
// Thông tư nhưng dự án tách 2 môn (Tin_Hoc/Cong_Nghe) → cả 2 đều có.
const KT_CUOI_SUBJECTS = new Set(["Tieng_Viet", "Toan", "Lich_Su_Dia_Li", "Khoa_Hoc", "Tin_Hoc", "Cong_Nghe"]);

/**
 * Số tiết bài kiểm tra định kì theo mốc (0 = không có bài kiểm tra riêng).
 * @returns {{ giua: number, cuoi: number }}
 */
export function getTieuHocKiemTraTiet(subject, grade) {
  const g = Number(grade);
  const cuoiCoKt = KT_CUOI_SUBJECTS.has(subject) || (subject === "Tieng_Anh" && g >= 3); // Ngoại ngữ 1 bắt buộc từ lớp 3
  const giuaCoKt = g >= 4 && (subject === "Tieng_Viet" || subject === "Toan");
  return { giua: giuaCoKt ? 1 : 0, cuoi: cuoiCoKt ? 1 : 0 };
}

const ROMAN = { 1: "I", 2: "II" };

function mocText(moc, hocKi) {
  if (moc === "giua") return `giữa học kì ${ROMAN[hocKi]}`;
  return hocKi === 2 ? "cuối năm học" : "cuối học kì I";
}

/** Ôn tập giữa kì ≈ ½ tuần, cuối kì ≈ 1 tuần (chỉ dùng khi còn bài chưa chốt số tiết). */
export function tieuHocOnTapDefault(tietPerWeek, moc) {
  const tpw = Number(tietPerWeek) || 0;
  return moc === "giua" ? Math.floor(tpw / 2) : Math.round(tpw);
}

/** @returns policy cho khgdSchedule.planSemester */
export function buildTieuHocSchedulePolicy({ subject, grade }) {
  return {
    kiemTraTiet: getTieuHocKiemTraTiet(subject, grade),
    onTapDefault: tieuHocOnTapDefault,
    labels: {
      onTap: (moc, hocKi, coKiemTra) => (coKiemTra ? `Ôn tập và đánh giá ${mocText(moc, hocKi)}` : `Ôn tập ${mocText(moc, hocKi)}`),
      kiemTra: (moc, hocKi) => `Kiểm tra định kì ${mocText(moc, hocKi)}`,
    },
    rowDefaults: () => ({ chuDe: "", nhomTiet: "", dieuChinh: "" }),
  };
}
