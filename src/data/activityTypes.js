/**
 * activityTypes.js
 * -----------------
 * Trục 1 trong schema Giai đoạn 0: đăng ký các "dạng hoạt động" (CÁCH hỏi).
 * Đây KHÔNG phải chủ đề — 1 activity type có thể dùng cho nhiều chủ đề khác nhau
 * (VD "so_sanh" dùng được cho cả "so sánh số" lẫn "so sánh đơn vị đo").
 *
 * Kế thừa 7 dạng đã có trong worksheetSchemas.js, có điều chỉnh:
 *  - Tách "day_so_cach_deu" (dãy số +1,+2 đều đặn) và "tim_quy_luat" (quy luật giảm dần,
 *    xen kẽ...) thành 2 activity riêng — 2 file PDF mẫu cho thấy đây là 2 độ khó khác nhau
 *    (PDF 1 "Điền số còn thiếu" vs PDF 2 "Tìm quy luật rồi điền số").
 *  - Thêm "dem_va_to_mau" — hoạt động ỨNG DỤNG đi kèm "nhan_dien_hinh", để không còn
 *    tình trạng "Nhận biết hình" đứng một mình không có gì để làm ngoài liệt kê.
 *
 * @typedef {Object} ActivityType
 * @property {string} id                 - mã định danh duy nhất, dùng làm key tra cứu
 * @property {string} ten                - tên hiển thị cho giáo viên
 * @property {string[]} monApDung        - ['toan', 'tieng_viet', ...] — môn dùng được
 * @property {string[]} khoiApDung       - ['mam_non','lop1','lop2'] — khối áp dụng
 * @property {boolean} canAI             - true nếu bắt buộc gọi AI (không đoán bằng code)
 * @property {string} moTa               - mô tả ngắn cho UI/log
 * @property {string[]} thamSoCoTheChinh - tên các tham số mà topicActivityMap có thể override
 *                                          (VD: phamViSo, donVi, soLuongCau, doKho)
 * @property {number} soCauMacDinh       - số câu mặc định nếu topic không override
 */

/** @type {ActivityType[]} */
export const ACTIVITY_TYPES = [
  {
    id: "dien_so",
    ten: "Điền số thích hợp",
    monApDung: ["toan"],
    khoiApDung: ["mam_non", "lop1", "lop2"],
    canAI: false,
    moTa: "Điền số/kết quả còn thiếu vào chỗ trống, tái hiện kiến thức vừa học.",
    thamSoCoTheChinh: ["phamViSo", "donVi", "soLuongCau"],
    soCauMacDinh: 8,
  },
  {
    id: "so_sanh",
    ten: "So sánh (>, <, =)",
    monApDung: ["toan"],
    khoiApDung: ["mam_non", "lop1", "lop2"],
    canAI: false,
    moTa: "Điền dấu so sánh giữa 2 giá trị/2 số đo (có thể khác đơn vị).",
    thamSoCoTheChinh: ["phamViSo", "donVi", "choPhepKhacDonVi", "soLuongCau"],
    soCauMacDinh: 6,
  },
  {
    id: "sap_xep_thu_tu",
    ten: "Sắp xếp thứ tự (bé → lớn / lớn → bé)",
    monApDung: ["toan"],
    khoiApDung: ["lop1", "lop2"],
    canAI: false,
    moTa: "Sắp xếp 1 bộ 3-4 giá trị/số đo theo thứ tự tăng hoặc giảm dần.",
    thamSoCoTheChinh: ["phamViSo", "donVi", "soBoSapXep", "chieuSapXep"],
    soCauMacDinh: 3,
  },
  {
    id: "day_so_cach_deu",
    ten: "Điền số còn thiếu vào dãy (cách đều)",
    monApDung: ["toan"],
    khoiApDung: ["mam_non", "lop1", "lop2"],
    canAI: false,
    moTa: "Dãy số tăng/giảm đều 1 bước cố định, điền 1 số còn thiếu ở giữa hoặc cuối dãy.",
    thamSoCoTheChinh: ["phamViSo", "buocNhay", "soLuongCau"],
    soCauMacDinh: 4,
  },
  {
    id: "tim_quy_luat",
    ten: "Tìm quy luật rồi điền số",
    monApDung: ["toan"],
    khoiApDung: ["lop1", "lop2"],
    canAI: false,
    moTa: "Quy luật phức tạp hơn dãy cách đều: giảm dần, bước nhảy đổi chiều, xen kẽ.",
    thamSoCoTheChinh: ["phamViSo", "kieuQuyLuat", "soLuongCau"],
    soCauMacDinh: 4,
  },
  {
    id: "noi_phep_tinh",
    ten: "Nối phép tính / phép đổi với kết quả đúng",
    monApDung: ["toan"],
    khoiApDung: ["mam_non", "lop1", "lop2"],
    canAI: false,
    moTa: "Nối 2 cột — vế trái là phép tính hoặc phép đổi đơn vị, vế phải là kết quả đúng.",
    thamSoCoTheChinh: ["phamViSo", "donVi", "soCap"],
    soCauMacDinh: 5,
  },
  {
    id: "giai_toan_loi_van",
    ten: "Giải toán có lời văn",
    monApDung: ["toan"],
    khoiApDung: ["lop1", "lop2"],
    canAI: true,
    moTa: "Cần AI để biến hoá ngôn ngữ/tình huống — không đoán bằng code như các dạng khác.",
    thamSoCoTheChinh: ["phamViSo", "donVi", "phepTinh", "boiCanh", "soLuongCau"],
    soCauMacDinh: 2,
  },
  {
    id: "dem_va_viet_so",
    ten: "Đếm và viết số",
    monApDung: ["toan"],
    khoiApDung: ["mam_non", "lop1"],
    canAI: false,
    moTa: "Đếm số lượng emoji/hình rồi ghi số vào ô trống.",
    thamSoCoTheChinh: ["phamViSo", "loaiEmoji", "soLuongCau"],
    soCauMacDinh: 3,
  },
  {
    id: "nhan_dien_hinh",
    ten: "Nhận biết hình",
    monApDung: ["toan"],
    khoiApDung: ["mam_non", "lop1", "lop2"],
    canAI: false,
    moTa: "Liệt kê + tô màu các hình cơ bản. LƯU Ý: theo topicActivityMap, dạng này BẮT " +
      "BUỘC phải đi kèm ít nhất 1 activity ứng dụng (dem_va_to_mau) — không dùng đơn độc.",
    thamSoCoTheChinh: ["danhSachHinh"],
    soCauMacDinh: 6,
  },
  {
    id: "dem_va_to_mau",
    ten: "Đếm hình theo yêu cầu rồi tô màu",
    monApDung: ["toan"],
    khoiApDung: ["mam_non", "lop1", "lop2"],
    canAI: false,
    moTa: "VD: 'Đếm xem có bao nhiêu hình tam giác rồi tô màu đỏ', 'Khoanh vào hình có " +
      "4 cạnh bằng nhau'. Đây là hoạt động ỨNG DỤNG đi kèm nhan_dien_hinh, sinh ra để sửa " +
      "lỗi 'chỉ liệt kê hình, không có gì khác'.",
    thamSoCoTheChinh: ["danhSachHinh", "soLuongCauUngDung"],
    soCauMacDinh: 3,
  },
];

export function getActivityById(id) {
  return ACTIVITY_TYPES.find((a) => a.id === id) || null;
}

export function getActivitiesForKhoi(khoi) {
  return ACTIVITY_TYPES.filter((a) => a.khoiApDung.includes(khoi));
}
