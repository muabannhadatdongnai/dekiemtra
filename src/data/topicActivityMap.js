/**
 * topicActivityMap.js
 * --------------------
 * Nối 2 trục (activityTypes × topicRegistry). Đây là phần TRẢ LỜI TRỰC TIẾP vấn đề bạn nêu:
 * "Nhận diện hình chỉ có hình, không có gì khác" — vì trước đây không có bảng này, hệ thống
 * áp activity đơn lẻ mà không biết nó cần đi kèm gì.
 *
 * Quy tắc thiết kế:
 *  - Mỗi topic có 1 danh sách `hoatDong`, mỗi phần tử là 1 activity + độ ưu tiên + có bắt
 *    buộc hay không + tham số override riêng cho topic đó.
 *  - `batBuoc: true` -> activity này LUÔN phải có mặt khi sinh phiếu cho topic này (dù giáo
 *    viên chọn số lượng bài ít đến đâu). Dùng để chặn tình trạng "chỉ có 1 dạng bài" tái diễn.
 *  - `capNhatThamSo` -> override thamSoCoTheChinh khai báo trong activityTypes.js, biến 1
 *    activity chung chung (VD "so_sanh") thành đúng ngữ cảnh topic (so sánh ĐƠN VỊ ĐO thay vì
 *    số trơn) — đây chính là cách tái dùng activity mà không cần viết lại generator.
 *
 * @typedef {Object} TopicActivityBinding
 * @property {string} activityId
 * @property {number} thuTu           - thứ tự xuất hiện trong phiếu (dễ -> khó, giống mẫu sưu tầm)
 * @property {boolean} batBuoc
 * @property {Object} capNhatThamSo
 */

/** @type {Record<string, TopicActivityBinding[]>} */
export const TOPIC_ACTIVITY_MAP = {
  // Khớp ví dụ ảnh "Đổi đơn vị đo độ dài" lớp 2 — 5 bài đều bám 1 chủ đề, đúng thứ tự mẫu
  lop2_toan_doi_don_vi_do_dai: [
    {
      activityId: "dien_so",
      thuTu: 1,
      batBuoc: true,
      capNhatThamSo: { donVi: ["m", "dm", "cm"], soLuongCau: 8 },
    },
    {
      activityId: "so_sanh",
      thuTu: 2,
      batBuoc: true,
      capNhatThamSo: { donVi: ["m", "dm", "cm"], choPhepKhacDonVi: true, soLuongCau: 6 },
    },
    {
      activityId: "sap_xep_thu_tu",
      thuTu: 3,
      batBuoc: false,
      capNhatThamSo: { donVi: ["m", "dm", "cm"], soBoSapXep: 3 },
    },
    {
      activityId: "giai_toan_loi_van",
      thuTu: 4,
      batBuoc: true,
      capNhatThamSo: { donVi: "cm", phepTinh: "tru", soLuongCau: 2 },
    },
    {
      activityId: "noi_phep_tinh",
      thuTu: 5,
      batBuoc: false,
      capNhatThamSo: { donVi: ["m", "dm", "cm"], soCap: 4 },
    },
  ],

  lop1_toan_cong_tru_pham_vi_20: [
    { activityId: "dien_so", thuTu: 1, batBuoc: true, capNhatThamSo: { phamViSo: { min: 0, max: 20 }, soLuongCau: 6 } },
    { activityId: "so_sanh", thuTu: 2, batBuoc: false, capNhatThamSo: { phamViSo: { min: 0, max: 20 } } },
    { activityId: "day_so_cach_deu", thuTu: 3, batBuoc: false, capNhatThamSo: { phamViSo: { min: 0, max: 20 } } },
    { activityId: "noi_phep_tinh", thuTu: 4, batBuoc: true, capNhatThamSo: { phamViSo: { min: 0, max: 20 }, soCap: 5 } },
    { activityId: "giai_toan_loi_van", thuTu: 5, batBuoc: false, capNhatThamSo: { phamViSo: { min: 0, max: 20 } } },
  ],

  // Đây là chỗ sửa trực tiếp bug bạn báo cáo: nhan_dien_hinh KHÔNG được đứng một mình,
  // luôn kèm dem_va_to_mau (batBuoc: true) để có hoạt động ứng dụng.
  mam_non_toan_nhan_biet_hinh: [
    {
      activityId: "nhan_dien_hinh",
      thuTu: 1,
      batBuoc: true,
      capNhatThamSo: { danhSachHinh: ["vuong", "tron", "tam_giac", "chu_nhat", "ngoi_sao", "trai_tim"] },
    },
    {
      activityId: "dem_va_to_mau",
      thuTu: 2,
      batBuoc: true, // <- chốt lại nguyên tắc: nhan_dien_hinh luôn phải có bạn đồng hành
      capNhatThamSo: { danhSachHinh: ["vuong", "tron", "tam_giac"], soLuongCauUngDung: 3 },
    },
  ],
};

/**
 * Trả về danh sách hoạt động cho 1 topic, đã sắp xếp theo thứ tự mẫu.
 * Nếu topic chưa có trong map (VD topic mới lấy từ SGK, chưa ai review), trả về activity
 * mặc định an toàn theo môn để hệ thống KHÔNG BAO GIỜ sinh phiếu chỉ có 1 dạng bài đơn độc.
 */
export function getActivitiesForTopic(topicId) {
  const binding = TOPIC_ACTIVITY_MAP[topicId];
  if (binding && binding.length > 0) {
    return [...binding].sort((a, b) => a.thuTu - b.thuTu);
  }
  return DEFAULT_FALLBACK_BINDING;
}

// Dùng khi topic mới (từ SGK tự động quét) chưa được giáo viên/người thiết kế review —
// đảm bảo tối thiểu 3 dạng bài đa dạng thay vì mặc định về "dien_so" đơn điệu.
const DEFAULT_FALLBACK_BINDING = [
  { activityId: "dien_so", thuTu: 1, batBuoc: true, capNhatThamSo: {} },
  { activityId: "so_sanh", thuTu: 2, batBuoc: true, capNhatThamSo: {} },
  { activityId: "giai_toan_loi_van", thuTu: 3, batBuoc: false, capNhatThamSo: {} },
];
