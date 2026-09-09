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

/**
 * ================== MỞ RỘNG LỚP 4-5, PHIÊN 42 ("Ôn tập số tự nhiên") ==================
 * Đọc số tự nhiên thành chữ (0 -> "chín trăm chín mươi chín triệu..."). Trước Phiên 42 dự án
 * CHƯA có hàm này (đã ghi trong NEXT_STEPS.md là việc tồn đọng) - cần cho dạng bài "cau_tao_so"
 * (bảng đọc/viết số theo cấu tạo hàng, xem worksheetSchemas.js) để sinh ĐÚNG đáp án "đọc số" thay
 * vì chỉ có thể yêu cầu học sinh tự đọc miệng (không chấm được).
 *
 * QUY TẮC ĐỌC (đã đối chiếu khớp từng ví dụ thật trong SGK "Kết nối tri thức với cuộc sống"
 * Toán 4-5, Bài 1 "Ôn tập các số..."):
 *  - Nhóm 3 chữ số từ phải sang trái, đơn vị nhóm: "" / "nghìn" / "triệu" / "tỷ".
 *  - Nhóm TOÀN SỐ 0 (không phải nhóm đầu) -> BỎ QUA HẲN, không đọc "không nghìn"/"không triệu"
 *    (VD 1 000 000 -> "một triệu", KHÔNG phải "một triệu không nghìn").
 *  - Nhóm có hàng trăm = 0 nhưng KHÔNG PHẢI nhóm đầu tiên (nhóm cao nhất) của toàn bộ số -> phải
 *    thêm "không trăm" (VD 95 006 -> "chín mươi lăm nghìn KHÔNG TRĂM linh sáu" - khớp đúng PDF mẫu
 *    Lớp 4 Hoan gửi Phiên 41).
 *  - Hàng chục-đơn vị chỉ có đơn vị (chục = 0): thêm "linh" NẾU phía trước đã có hàng trăm hoặc
 *    không phải nhóm đầu (VD "ba trăm linh chín"); nếu là nhóm đầu và không có hàng trăm thì đọc
 *    trần trụi (VD số "9" đứng đầu nhóm nghìn -> "chín nghìn", không phải "linh chín nghìn").
 *  - "mười" (không phải "một mươi") khi hàng chục = 1; "mười một" (không "mười mốt") khi vừa
 *    hàng chục = 1 vừa hàng đơn vị = 1; "X mươi mốt"/"X mươi lăm" (không "một"/"năm") khi hàng
 *    chục >= 2.
 * Phạm vi: an toàn tới hàng tỷ (999 999 999 999) - vượt xa nhu cầu Tiểu học (tối đa Lớp 5 dạy tới
 * lớp triệu), đủ dư cho mọi random hiện tại.
 */
const DIGIT_WORDS_VI = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const GROUP_SUFFIX_VI = ["", " nghìn", " triệu", " tỷ"];

function readTwoDigitsVi(tens, ones) {
  if (tens === 0 && ones === 0) return "";
  if (tens === 0) return DIGIT_WORDS_VI[ones];
  if (tens === 1) {
    if (ones === 0) return "mười";
    if (ones === 5) return "mười lăm";
    return `mười ${DIGIT_WORDS_VI[ones]}`; // "mười một", không phải "mười mốt"
  }
  let onesWord = "";
  if (ones === 1) onesWord = " mốt";
  else if (ones === 5) onesWord = " lăm";
  else if (ones !== 0) onesWord = ` ${DIGIT_WORDS_VI[ones]}`;
  return `${DIGIT_WORDS_VI[tens]} mươi${onesWord}`;
}

function readThreeDigitGroupVi(n, isLeadingGroup) {
  const hundreds = Math.floor(n / 100);
  const rem = n % 100;
  const tens = Math.floor(rem / 10);
  const ones = rem % 10;
  const parts = [];
  if (hundreds > 0) {
    parts.push(`${DIGIT_WORDS_VI[hundreds]} trăm`);
  } else if (!isLeadingGroup && n > 0) {
    parts.push("không trăm");
  }
  if (rem > 0) {
    if (tens === 0) {
      const needLinh = hundreds > 0 || !isLeadingGroup;
      parts.push(`${needLinh ? "linh " : ""}${DIGIT_WORDS_VI[ones]}`);
    } else {
      parts.push(readTwoDigitsVi(tens, ones));
    }
  }
  return parts.join(" ");
}

export function docSoTuNhien(n) {
  const numeric = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(numeric)) return "";
  const isNegative = numeric < 0;
  const num = Math.trunc(Math.abs(numeric));
  if (num === 0) return "không";
  const groups = [];
  let rest = num;
  while (rest > 0) {
    groups.unshift(rest % 1000);
    rest = Math.floor(rest / 1000);
  }
  const totalGroups = groups.length;
  const parts = [];
  let leadingDone = false;
  groups.forEach((g, idx) => {
    if (g === 0) return; // bỏ qua hẳn nhóm toàn số 0 (không phải nhóm đầu, vì num!==0)
    const suffixIdx = totalGroups - 1 - idx;
    parts.push(readThreeDigitGroupVi(g, !leadingDone) + GROUP_SUFFIX_VI[suffixIdx]);
    leadingDone = true;
  });
  const result = parts.join(" ").replace(/\s+/g, " ").trim();
  return isNegative ? `âm ${result}` : result;
}
