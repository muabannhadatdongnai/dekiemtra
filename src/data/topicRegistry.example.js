/**
 * topicRegistry.example.js
 * -------------------------
 * Trục 2 trong schema Giai đoạn 0: đăng ký "chủ đề" (NỘI DUNG mà giáo viên đã dạy).
 *
 * ⚠️ Đây là file .example — chứa 3 chủ đề gõ TAY để minh hoạ đúng format, trích từ
 * 3 file bạn gửi (2 PDF mẫu mầm non/lớp1 + 1 ảnh lớp2). Ở bản thật, file này
 * (`topicRegistry.json`) nên được SINH TỰ ĐỘNG bằng script quét
 * `sach_giao_khoa/lop_X/{mon}_tY/chuong_Z.md` qua `githubService.js` đã có sẵn
 * (`fetchChaptersSeparately`) — xem mục 5 trong README-giai-doan-0.md.
 *
 * @typedef {Object} TopicEntry
 * @property {string} id                - mã định danh, dùng làm khoá tra cứu topicActivityMap
 * @property {string} ten               - tên chủ đề hiển thị cho giáo viên
 * @property {string} mon               - 'toan' | 'tieng_viet' | ...
 * @property {string} khoi              - 'mam_non' | 'lop1' | 'lop2'
 * @property {string|null} duongDanSGK  - đường dẫn tới file markdown SGK tương ứng
 *                                         (null nếu chủ đề chỉ có ở mẫu sưu tầm, chưa map SGK)
 * @property {string[]} tuKhoa          - từ khoá để đối chiếu/tìm kiếm & gợi ý activity phù hợp
 * @property {Object} phamViMacDinh     - phạm vi số/kiến thức mặc định cho khối này
 *                                         (dùng làm input cho activity generator)
 */

/** @type {TopicEntry[]} */
export const TOPIC_REGISTRY_EXAMPLE = [
  {
    id: "lop2_toan_doi_don_vi_do_dai",
    ten: "Đổi đơn vị đo độ dài (m, dm, cm)",
    mon: "toan",
    khoi: "lop2",
    // ví dụ đường dẫn theo đúng quy ước mục 1 PROJECT_SUMMARY — cần đối chiếu tên file thật
    duongDanSGK: "sach_giao_khoa/lop_2/toan_t1/chuong_do_luong.md",
    tuKhoa: ["đơn vị đo", "độ dài", "mét", "đề-xi-mét", "xăng-ti-mét", "m", "dm", "cm"],
    phamViMacDinh: {
      donViChoPhep: ["m", "dm", "cm"],
      quyDoi: { m: 100, dm: 10, cm: 1 }, // quy về cm để so sánh/tính toán nội bộ
      phamViSo: { min: 1, max: 100 },
    },
  },
  {
    id: "lop1_toan_cong_tru_pham_vi_20",
    ten: "Cộng, trừ trong phạm vi 20 (không nhớ)",
    mon: "toan",
    khoi: "lop1",
    duongDanSGK: "sach_giao_khoa/lop_1/toan_t1/chuong_cong_tru_20.md",
    // trích từ 2 file PDF mẫu: "4 + 11 =", "16 + 4 =", "8 - 3 ="...
    tuKhoa: ["cộng", "trừ", "phạm vi 20", "tính nhẩm"],
    phamViMacDinh: {
      phamViSo: { min: 0, max: 20 },
      chophepKetQuaAm: false,
    },
  },
  {
    id: "mam_non_toan_nhan_biet_hinh",
    ten: "Nhận biết các hình cơ bản",
    mon: "toan",
    khoi: "mam_non",
    duongDanSGK: null, // chủ đề mầm non thường không có SGK markdown chính thức
    // trích từ 2 file PDF mẫu: hình vuông, tròn, ngôi sao, trái tim, chữ nhật, tam giác
    tuKhoa: ["hình vuông", "hình tròn", "hình tam giác", "hình chữ nhật", "hình ngôi sao", "hình trái tim"],
    phamViMacDinh: {
      danhSachHinh: ["vuong", "tron", "tam_giac", "chu_nhat", "ngoi_sao", "trai_tim"],
    },
  },
];

export function getTopicById(id) {
  return TOPIC_REGISTRY_EXAMPLE.find((t) => t.id === id) || null;
}

export function getTopicsForKhoiMon(khoi, mon) {
  return TOPIC_REGISTRY_EXAMPLE.filter((t) => t.khoi === khoi && t.mon === mon);
}
