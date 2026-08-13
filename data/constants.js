/**
 * constants.js
 * Các hằng số dùng chung giữa client và server, KHÔNG chứa logic phụ thuộc process.env
 * hay fetch, để có thể import an toàn từ cả component client lẫn service phía server.
 */

/**
 * Giá trị đặc biệt đại diện cho "Sách nâng cao (toàn bộ)" trong danh sách chapters -
 * khác với chapter thường (vốn là số chương), sách nâng cao được lấy nguyên văn 1 file
 * duy nhất, KHÔNG chia nhỏ theo chương, và KHÔNG phụ thuộc Tập (dùng chung cho cả năm học).
 */
export const ADVANCED_BOOK_MARKER = "__NANG_CAO__";

/**
 * ================== GIAI ĐOẠN 1 (sửa lỗi layout/in ấn) ==================
 * NGUỒN DUY NHẤT cho khổ giấy A4 + margin, dùng chung cho:
 *  - exportService.js (đề kiểm tra) và worksheetExportService.js (phiếu bài tập) qua
 *    convertMillimetersToTwip() của docx.js
 *  - globals.css (@page margin trong src/app/globals.css) - CSS không import được JS nên
 *    phải tự tay giữ 2 nơi khớp nhau, xem comment trong globals.css trỏ ngược lại đây.
 *
 * TRƯỚC ĐÂY: cả 2 file export Word đều tạo Document với `properties: {}` rỗng -> docx.js
 * dùng mặc định khổ Letter (8.5x11 inch, KHÔNG PHẢI A4) + margin mặc định 1 inch. Đây là
 * nguyên nhân THẬT của "margin không full khổ A4" mà giáo viên phản ánh - không phải lỗi CSS.
 *
 * Giá trị chọn: khớp với padding màn hình cũ của .a4-page (20mm 18mm) trong globals.css,
 * thay vì giữ nguyên margin in ấn cũ (15mm 16mm) - 2 giá trị này TRƯỚC ĐÂY lệch nhau, khiến
 * bản xem trước trên màn hình và bản in/PDF thật không khớp. Giờ thống nhất về 1 giá trị.
 */
export const PAGE_A4_MM = { width: 210, height: 297 };
export const PAGE_MARGIN_MM = { top: 20, bottom: 20, left: 18, right: 18 };

/**
 * ================== GIAI ĐOẠN 5 (liên kết SGK markdown) ==================
 * "Phiếu bài tập" dùng mã khối riêng (MAM_NON/LOP_1/LOP_2 - xem WORKSHEET_GRADES trong
 * worksheetSchemas.js), trong khi repo SGK (githubService.js) dùng SỐ LỚP thô (lop_1, lop_2...,
 * xem quy ước "sach_giao_khoa/lop_{grade}/..."). Mapping này nối 2 hệ thống lại - CHỈ có
 * LOP_1/LOP_2 (Mầm non KHÔNG có SGK theo chương chính thức, giống cách lessonPlanTemplates.js
 * xử lý "isPreschoolGrade" cho Giáo án - tái dùng đúng nguyên tắc đó).
 */
export const WORKSHEET_GRADE_TO_SGK_GRADE = {
  LOP_1: "1",
  LOP_2: "2",
};
