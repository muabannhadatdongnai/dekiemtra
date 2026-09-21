import { getKhgdSubjectDefaults } from "@/data/khgdSubjectDefaults";

/**
 * khgdSchedulePolicy.js  (Phiên 50)
 * CHÍNH SÁCH xếp lịch Ôn tập/Kiểm tra định kì riêng cho tab "Khung KHGD" THCS/THPT (Phụ lục III, CV5512) -
 * truyền vào khgdSchedule.planSemester. File RIÊNG với khgdTieuHocSchedulePolicy.js (isolation over DRY).
 *
 * Căn cứ (đã đối chiếu văn bản, KHÔNG suy diễn):
 *   - Thông tư 22/2021/TT-BGDĐT Điều 7: mỗi học kì, mỗi môn có 1 lần đánh giá GIỮA KÌ và 1 lần CUỐI KÌ (không áp dụng
 *     cụm chuyên đề học tập); thực hiện qua bài kiểm tra (giấy/máy tính), bài thực hành hoặc dự án học tập.
 *   - Thời gian làm bài kiểm tra: môn ≤ 70 tiết/năm → 45 phút; môn > 70 tiết/năm → 60-90 phút. 1 tiết THCS/THPT
 *     = 45 phút → 45 phút = 1 tiết, 60-90 phút = 2 tiết.
 *   - Khung thời gian năm học: HK I 18 tuần + HK II 17 tuần = 35 tuần (khgdSchedule.js).
 * Số tiết ÔN TẬP không có quy định → lấy từ QUỸ TIẾT còn lại, hoặc quy tắc ½ tuần (giữa kì) / 1 tuần (cuối kì).
 */

/**
 * Số tiết/tuần gợi ý theo CT GDPT 2018 - CHỈ các môn đã đối chiếu được; môn khác để trống cho giáo viên tự nhập
 * (theo KHGD nhà trường) - KHÔNG tự bịa số.
 *   THCS: Ngữ văn/Toán/Khoa học tự nhiên 140 tiết/năm (4/tuần); Ngoại ngữ 1 và Lịch sử và Địa lí 105 tiết/năm (3/tuần).
 *   THPT: Ngữ văn/Toán/Ngoại ngữ 1 105 tiết/năm (3/tuần); Giáo dục thể chất, Địa lí, Công nghệ 70 tiết/năm (2/tuần).
 */
export const KHGD_TIET_PER_WEEK_DEFAULTS = {
  THCS: { Ngu_Van: 4, Toan: 4, Khoa_Hoc_Tu_Nhien: 4, Tieng_Anh: 3, Lich_Su_Dia_Li: 3 },
  THPT: { Ngu_Van: 3, Toan: 3, Tieng_Anh: 3, Giao_Duc_The_Chat: 2, Dia_Li: 2, Cong_Nghe: 2 },
};

/** @returns {number|null} - null = chưa có căn cứ, giáo viên tự nhập. */
export function getKhgdDefaultTietPerWeek(subject, grade) {
  const band = Number(grade) >= 10 ? "THPT" : "THCS";
  return KHGD_TIET_PER_WEEK_DEFAULTS[band][subject] ?? null;
}

/** Môn/hoạt động đánh giá BẰNG NHẬN XÉT (dự án gắn `modules: NO_EXAM_MODULES` trong config.js) - không có bài kiểm tra viết. */
export const KHGD_NHAN_XET_SUBJECTS = new Set([
  "Giao_Duc_The_Chat",
  "Am_Nhac",
  "My_Thuat",
  "Hoat_Dong_Trai_Nghiem_Huong_Nghiep",
  "Noi_Dung_Giao_Duc_Dia_Phuong",
]);

/** Thời gian làm bài kiểm tra mặc định (phút): môn ≤ 70 tiết/năm → 45; > 70 tiết/năm → 60 (quy định 60-90, giáo viên nâng lên 90 nếu cần). */
export function getKhgdKiemTraMinutes(tietPerWeek, subject) {
  if (KHGD_NHAN_XET_SUBJECTS.has(subject)) return 45;
  const tietPerYear = (Number(String(tietPerWeek).replace(",", ".")) || 0) * 35;
  return tietPerYear > 70 ? 60 : 45;
}

/** 45 phút = 1 tiết; 60-90 phút = 2 tiết. */
export function kiemTraTietFromMinutes(minutes) {
  const m = Number(minutes);
  return Number.isFinite(m) && m > 0 ? Math.max(1, Math.ceil(m / 45)) : 1;
}

/** Ôn tập giữa kì ≈ ½ tuần, cuối kì ≈ 1 tuần (chỉ dùng khi còn bài chưa chốt số tiết). */
export function khgdOnTapDefault(tietPerWeek, moc) {
  const tpw = Number(tietPerWeek) || 0;
  return moc === "giua" ? Math.floor(tpw / 2) : Math.round(tpw);
}

const mocWord = (moc) => (moc === "giua" ? "giữa" : "cuối");

/** @returns policy cho khgdSchedule.planSemester */
export function buildKhgdSchedulePolicy({ subject, tietPerWeek, minutes }) {
  const nhanXet = KHGD_NHAN_XET_SUBJECTS.has(subject);
  const mins = Number(minutes) > 0 ? Number(minutes) : getKhgdKiemTraMinutes(tietPerWeek, subject);
  const ktTiet = nhanXet ? 1 : kiemTraTietFromMinutes(mins);
  const defaults = getKhgdSubjectDefaults(subject);

  return {
    kiemTraTiet: { giua: ktTiet, cuoi: ktTiet },
    onTapDefault: khgdOnTapDefault,
    labels: {
      onTap: (moc, hocKi, coKiemTra) => (coKiemTra ? `Ôn tập và đánh giá ${mocWord(moc)} Học kỳ ${hocKi}` : `Ôn tập ${mocWord(moc)} Học kỳ ${hocKi}`),
      kiemTra: (moc, hocKi) => `${nhanXet ? "Đánh giá" : "Kiểm tra"} ${mocWord(moc)} Học kỳ ${hocKi}`,
    },
    rowDefaults: (loai) => ({
      chuong: "",
      noiDung: "",
      thietBi: loai === "kiemTra" ? (nhanXet ? defaults.device : "Đề kiểm tra") : defaults.device,
      diaDiem: loai === "kiemTra" && !nhanXet ? "Phòng học" : defaults.location,
    }),
  };
}

// ---------------------------------------------------------------------------------------------
// Đổ kết quả xếp lịch vào bảng "Kiểm tra, đánh giá định kỳ" (Thời gian / Thời điểm / Yêu cầu cần đạt)
// ---------------------------------------------------------------------------------------------

const KT_DEFAULT_VALUES = { thoiGian: "60 phút", hinhThuc: "Viết (giấy)" };

function foldVN(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}

/** "Giữa Học kỳ 1" → { moc: "giua", hocKi: 1 }; tên lạ → null. */
export function parseKiemTraName(ten) {
  const f = foldVN(ten);
  const moc = f.includes("giua") ? "giua" : f.includes("cuoi") ? "cuoi" : null;
  const m = f.match(/(?:ky|ki)\s*(1|2|i|ii)\b/);
  if (!moc || !m) return null;
  return { moc, hocKi: m[1] === "2" || m[1] === "ii" ? 2 : 1 };
}

function coverageText(cov) {
  if (!cov) return "";
  return cov.from === cov.to ? cov.from : `Từ ${cov.from} đến hết ${cov.to}`;
}

/**
 * Cập nhật danh sách kiemTraDinhKy theo kết quả `planYear().summaries`. CHỈ ghi đè ô còn trống hoặc còn đúng
 * giá trị TỰ ĐỘNG lần trước/mặc định ban đầu - ô giáo viên đã tự gõ được giữ nguyên.
 */
export function applyScheduleToKiemTra(kiemTraDinhKy, summaries, { minutes, nhanXet = false } = {}) {
  return (kiemTraDinhKy || []).map((k) => {
    const parsed = parseKiemTraName(k.ten);
    const sum = parsed ? summaries?.[parsed.hocKi] : null;
    const ms = sum?.milestones?.[parsed?.moc];
    if (!ms || !ms.tuan) return k;

    const auto = k._auto || {};
    const next = {
      thoiGian: `${minutes || 45} phút`,
      thoiDiem: `${ms.tuan}${ms.tiet ? `, Tiết ${ms.tiet}` : ""}`,
      yeuCauCanDat: coverageText(ms.coverage),
      hinhThuc: nhanXet ? "Thực hành/Nhận xét" : KT_DEFAULT_VALUES.hinhThuc,
    };
    const updated = { ...k, _auto: { ...auto } };
    for (const field of Object.keys(next)) {
      const cur = k[field] ?? "";
      const overwritable = cur === "" || cur === auto[field] || cur === KT_DEFAULT_VALUES[field];
      if (overwritable && next[field]) {
        updated[field] = next[field];
        updated._auto[field] = next[field];
      }
    }
    return updated;
  });
}
