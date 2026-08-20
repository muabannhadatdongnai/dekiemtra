/**
 * numberFormatUtils.js
 * ================== PHIẾU BÀI TẬP - LỚP 3, ĐỢT 3 ==================
 * Hàm format số DÙNG CHUNG cho "Phiếu bài tập" - cả bản xem trước web (WorksheetPreview.jsx) VÀ
 * bản xuất Word (worksheetExportService.js) đều gọi ĐÚNG hàm này, đúng như NEXT_STEPS.md đã ghi
 * chú "cần 1 hàm format số DÙNG CHUNG (ngoại lệ so với nguyên tắc isolation)" - số vẫn là 1 khái
 * niệm DUY NHẤT xuyên suốt bài (không phải 1 style/component tách riêng theo từng dạng bài), nên
 * CHỦ Ý không tách bản sao riêng cho từng dạng bài như các phần khác của dự án.
 *
 * QUY TẮC (Hoan đã chốt): số tự nhiên từ 4 chữ số trở lên BẮT BUỘC có dấu chấm phân cách hàng
 * nghìn (63880 -> "63.880"), khớp đúng cách viết số kiểu Việt Nam. Dưới 1000 giữ nguyên, không
 * cần phân cách (đúng cách viết thông thường, thêm dấu chấm vào số 3 chữ số trở xuống sẽ kỳ cục).
 *
 * `toLocaleString("vi-VN")` tự động: dùng "." làm dấu phân cách hàng nghìn, "," làm dấu thập
 * phân - ĐÚNG chuẩn Việt Nam sẵn có trong JS, không cần tự viết lại logic chèn dấu chấm thủ công.
 * (Lớp 3 chưa học số thập phân nên trong thực tế mọi số qua đây đều là số nguyên, nhưng hàm vẫn
 * xử lý đúng nếu sau này Lớp 4-5 cần số thập phân.)
 */
export function formatSoTuNhien(n) {
  if (n === null || n === undefined) return n;
  const num = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(num)) return n;
  return num.toLocaleString("vi-VN");
}

/**
 * Dùng cho các chuỗi hiển thị dạng "biểu thức" (VD "73428 + 19205", "500 - 300") thay vì 1 số
 * đơn lẻ - tìm MỌI dãy chữ số trong chuỗi rồi format riêng từng dãy, giữ nguyên phần còn lại
 * (dấu +, -, khoảng trắng...). An toàn cho cả chuỗi chỉ có 1 số đơn (hoạt động giống hệt
 * formatSoTuNhien) lẫn chuỗi nhiều số.
 */
export function formatSoTrongChuoi(str) {
  if (str === null || str === undefined) return str;
  return String(str).replace(/\d+/g, (match) => formatSoTuNhien(Number(match)));
}

/**
 * ================== MỞ RỘNG LỚP 5, ĐỢT 1 ==================
 * `formatSoTuNhien()` (dựa trên `toLocaleString("vi-VN")`) đã tự đổi dấu phẩy thập phân đúng
 * chuẩn Việt Nam (VD 3.5 -> "3,5") NHƯNG tự rút gọn số 0 vô nghĩa ở cuối (VD 3.10 -> "3,1"),
 * SAI với bài toán số thập phân Lớp 5 (SGK cần giữ đúng số chữ số thập phân đề bài đã cho, VD
 * "3,10" khác "3,1" khi đang dạy khái niệm "số thập phân bằng nhau"). Hàm riêng này ép đúng số
 * chữ số thập phân cố định bằng `toFixed()` trước khi áp dấu phẩy Việt Nam, rồi tự chèn dấu chấm
 * phân cách hàng nghìn vào phần nguyên (không dùng thẳng `toLocaleString` vì nó tự rút gọn số 0).
 */
export function formatSoThapPhan(n, decimals = 1) {
  if (n === null || n === undefined) return n;
  const num = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(num)) return n;
  const fixed = num.toFixed(decimals); // VD "3.10", "-2.50"
  const negative = fixed.startsWith("-");
  const [intPart, decPart] = (negative ? fixed.slice(1) : fixed).split(".");
  const intWithDots = Number(intPart).toLocaleString("vi-VN"); // chỉ phần nguyên -> luôn an toàn
  const result = decPart ? `${intWithDots},${decPart}` : intWithDots;
  return negative ? `-${result}` : result;
}
