/**
 * sampleWorksheetOutlines.js
 * ----------------------------
 * "Hạt giống" đầu tiên cho tính năng đã bàn ở vòng trước: trích outline có cấu trúc từ
 * phiếu mẫu sưu tầm (PDF/ảnh), thay vì để hệ thống chỉ bắt chước layout/màu sắc.
 *
 * 3 outline dưới đây trích TAY từ đúng 3 file bạn đã upload — dùng làm ví dụ đối chiếu khi
 * viết script tự động trích outline từ PDF/ảnh mới sau này (Giai đoạn 4 kế hoạch cũ).
 *
 * @typedef {Object} SampleOutline
 * @property {string} id
 * @property {string} nguonFile        - tên file gốc, để truy vết
 * @property {string} khoi
 * @property {string} mon
 * @property {string|null} topicIdGoiY - topic khớp gần nhất trong topicRegistry (null nếu
 *                                        mẫu pha trộn nhiều chủ đề, không map 1-1 được)
 * @property {Object[]} baiTap         - từng bài trong phiếu mẫu, đúng thứ tự xuất hiện
 */

/** @type {SampleOutline[]} */
export const SAMPLE_WORKSHEET_OUTLINES = [
  {
    id: "sample_lop2_doi_don_vi_do_dai",
    nguonFile: "toán_lớp_2.jpg",
    khoi: "lop2",
    mon: "toan",
    topicIdGoiY: "lop2_toan_doi_don_vi_do_dai",
    baiTap: [
      { thuTu: 1, activityId: "dien_so", soLuongCau: 8, ghiChu: "1 m = ... dm, 1 dm = ... cm..." },
      { thuTu: 2, activityId: "so_sanh", soLuongCau: 6, ghiChu: "2m ⬜ 200cm, khác đơn vị 2 vế" },
      { thuTu: 3, activityId: "sap_xep_thu_tu", soLuongCau: 3, ghiChu: "3 bộ, mỗi bộ 3 số đo khác đơn vị" },
      { thuTu: 4, activityId: "giai_toan_loi_van", soLuongCau: 2, ghiChu: "phép trừ, ngữ cảnh dây/ruy băng" },
      { thuTu: 5, activityId: "noi_phep_tinh", soLuongCau: 4, ghiChu: "nối phép đổi đúng, 2 cột 4 cặp" },
    ],
  },
  {
    id: "sample_lop1_cong_tru_20_bo1",
    nguonFile: "Tạo_đề_kiểm_tra_tự_động.pdf",
    khoi: "lop1",
    mon: "toan",
    topicIdGoiY: "lop1_toan_cong_tru_pham_vi_20",
    baiTap: [
      { thuTu: 1, activityId: "dien_so", soLuongCau: 6, ghiChu: "tính nhanh: 4+11=, 9-4=..." },
      { thuTu: 2, activityId: "dem_va_viet_so", soLuongCau: 3, ghiChu: "đếm emoji cà rốt/ô tô/sao" },
      { thuTu: 3, activityId: "so_sanh", soLuongCau: 6, ghiChu: "16+4 ⬜ 18, có cả phép tính 2 vế" },
      { thuTu: 4, activityId: "day_so_cach_deu", soLuongCau: 4, ghiChu: "dãy giảm dần & tăng dần xen kẽ" },
      { thuTu: 5, activityId: "noi_phep_tinh", soLuongCau: 5, ghiChu: "nối phép cộng với kết quả" },
      {
        thuTu: 6,
        activityId: "nhan_dien_hinh",
        soLuongCau: 6,
        ghiChu: "6 hình cơ bản — LƯU Ý: mẫu gốc CŨNG chỉ liệt kê hình, không có hoạt động " +
          "ứng dụng đi kèm. Đây là bằng chứng cho thấy chính mẫu sưu tầm gốc cũng có nhược " +
          "điểm này — nên khi build outline mới, chủ động chèn thêm dem_va_to_mau dù mẫu " +
          "không có, thay vì sao chép y nguyên nhược điểm của mẫu.",
      },
      { thuTu: 7, activityId: "giai_toan_loi_van", soLuongCau: 2, ghiChu: "bút chì màu, thước kẻ" },
    ],
  },
  {
    id: "sample_lop1_cong_tru_20_bo2",
    nguonFile: "Tạo_đề_kiểm_tra_tự_động_2.pdf",
    khoi: "lop1",
    mon: "toan",
    topicIdGoiY: "lop1_toan_cong_tru_pham_vi_20",
    baiTap: [
      { thuTu: 1, activityId: "dien_so", soLuongCau: 6, ghiChu: "tính nhẩm: 8-3=, 16+4=..." },
      { thuTu: 2, activityId: "dem_va_viet_so", soLuongCau: 3, ghiChu: "đếm hoa hướng dương/sao/cà rốt" },
      { thuTu: 3, activityId: "so_sanh", soLuongCau: 6, ghiChu: "14 ⬜ 3, 12+3 ⬜ 10+1" },
      { thuTu: 4, activityId: "tim_quy_luat", soLuongCau: 4, ghiChu: "9 8 7 ⬜ 5 4 — quy luật giảm dần" },
      { thuTu: 5, activityId: "noi_phep_tinh", soLuongCau: 5, ghiChu: "nối phép tính với kết quả" },
      { thuTu: 6, activityId: "nhan_dien_hinh", soLuongCau: 6, ghiChu: "6 hình — cùng nhược điểm như trên" },
      { thuTu: 7, activityId: "giai_toan_loi_van", soLuongCau: 2, ghiChu: "nhãn vở, thước kẻ" },
    ],
  },
];

export function getOutlineById(id) {
  return SAMPLE_WORKSHEET_OUTLINES.find((o) => o.id === id) || null;
}
