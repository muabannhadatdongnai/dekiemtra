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
