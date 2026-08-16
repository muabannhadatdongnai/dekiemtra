/**
 * worksheetSchemas.js
 * "Phiếu bài tập" (Mầm non - Lớp 2) - khác với đề kiểm tra: đa số dạng bài KHÔNG cần AI,
 * code tự sinh số ngẫu nhiên đúng phạm vi từng khối lớp - rẻ hơn, nhanh hơn, không lo AI tính sai.
 * Chỉ dùng AI cho "giải toán có lời văn" (cần biến hoá ngôn ngữ tự nhiên).
 */

export const WORKSHEET_GRADES = {
  MAM_NON: { key: "MAM_NON", label: "Mầm non (chuẩn bị vào lớp 1)", maxNumber: 10 },
  LOP_1: { key: "LOP_1", label: "Lớp 1", maxNumber: 20 },
  LOP_2: { key: "LOP_2", label: "Lớp 2", maxNumber: 100 },
};

export const EXERCISE_TYPES = {
  TINH_NHAM: "tinh_nham",
  DEM_VA_VIET_SO: "dem_va_viet_so",
  SO_SANH: "so_sanh",
  DAY_SO: "day_so",
  NOI_PHEP_TINH: "noi_phep_tinh",
  GIAI_TOAN: "giai_toan", // duy nhất cần AI
  NHAN_DIEN_HINH: "nhan_dien_hinh",
  SAP_XEP_THU_TU: "sap_xep_thu_tu", // GIAI ĐOẠN 2
  DEM_HINH_UNG_DUNG: "dem_hinh_ung_dung", // GIAI ĐOẠN 2 - hoạt động ứng dụng đi kèm NHAN_DIEN_HINH
};

// ================== GIAI ĐOẠN 9 (mở rộng kho icon đếm số - mục 2) ==================
// TRƯỚC ĐÂY chỉ 7 icon cố định -> generateDemVaVietSo() (slice ngẫu nhiên) hay trùng lặp icon
// giữa các lần tạo phiếu. Mở rộng lên 16 icon, đa dạng chủ đề (trái cây, con vật, đồ vật, đồ ăn).
const ICONS = [
  "🍎", "⭐", "🚗", "🐥", "🌻", "🦋", "🥕",
  "🐟", "🎈", "🍭", "🚀", "🐢", "🧸", "🍪", "🌸", "🐝",
];

// ================== GIAI ĐOẠN 9 (sửa lỗi "Nhận diện hình"/"Đếm hình" luôn lặp y hệt) ==================
// TRƯỚC ĐÂY kho có ĐÚNG 6 hình, trùng khớp defaultCount=6 -> slice(0,6) trên mảng 6 phần tử luôn
// lấy hết cả mảng, random chỉ đảo thứ tự chứ không đổi nội dung. Mở rộng lên 14 hình + đổi
// defaultCount xuống 5 (xem worksheetExerciseCatalog.js) để LUÔN có phần hình "vắng mặt", tạo
// khác biệt thật giữa các lần tạo phiếu.
// GIAI ĐOẠN F2: bỏ "Hình bán nguyệt"/"Hình mũi tên"/"Hình đám mây" khỏi kho - giáo viên phản ánh
// đây là những hình "ngớ ngẩn", không phù hợp với bối cảnh nhận diện hình học cơ bản (mũi tên
// không phải hình học, bán nguyệt/đám mây dễ gây nhầm lẫn cho học sinh nhỏ tuổi). Còn lại 11 hình.
const SHAPES = [
  "Hình tròn",
  "Hình vuông",
  "Hình tam giác",
  "Hình chữ nhật",
  "Hình ngôi sao",
  "Hình trái tim",
  "Hình thoi",
  "Hình ê-líp",
  "Hình ngũ giác",
  "Hình lục giác",
  "Hình thang",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

/** Tính nhẩm: phép + hoặc - đơn giản, kết quả để trống cho học sinh điền. */
export function generateTinhNham(grade, count = 6) {
  const max = WORKSHEET_GRADES[grade].maxNumber;
  const items = [];
  for (let i = 0; i < count; i++) {
    const operator = Math.random() < 0.5 ? "+" : "-";
    let a, b;
    if (operator === "+") {
      a = randInt(1, max - 1);
      b = randInt(1, max - a);
    } else {
      a = randInt(2, max);
      b = randInt(1, a - 1);
    }
    items.push({ operandA: a, operandB: b, operator, answer: operator === "+" ? a + b : a - b });
  }
  return items;
}

/** Đếm và viết số: hiện N icon, học sinh đếm và viết số vào ô trống. */
export function generateDemVaVietSo(grade, count = 4) {
  const max = Math.min(WORKSHEET_GRADES[grade].maxNumber, 12); // đếm quá 12 icon sẽ rối mắt
  const items = [];
  const usedIcons = [...ICONS].sort(() => Math.random() - 0.5).slice(0, count);
  for (const icon of usedIcons) {
    items.push({ icon, count: randInt(2, max), answer: undefined }); // answer = count (đã biết)
  }
  return items.map((it) => ({ ...it, answer: it.count }));
}

/** So sánh: 2 số hoặc 2 phép tính đơn giản, điền dấu >, <, =. */
export function generateSoSanh(grade, count = 6) {
  const max = WORKSHEET_GRADES[grade].maxNumber;
  const items = [];
  for (let i = 0; i < count; i++) {
    const useExpr = grade !== "MAM_NON" && Math.random() < 0.4;
    const left = useExpr ? buildSimpleExpr(max) : { display: String(randInt(0, max)), value: 0 };
    if (!useExpr) left.value = Number(left.display);
    const right = useExpr && Math.random() < 0.5 ? buildSimpleExpr(max) : { display: String(randInt(0, max)), value: 0 };
    if (right.value === 0 && !right.display.includes("+") && !right.display.includes("-")) {
      right.value = Number(right.display);
    }
    const answer = left.value > right.value ? ">" : left.value < right.value ? "<" : "=";
    items.push({ left: left.display, right: right.display, answer });
  }
  return items;
}

function buildSimpleExpr(max) {
  const a = randInt(1, max - 1);
  const b = randInt(1, max - a);
  return { display: `${a} + ${b}`, value: a + b };
}

/** Dãy số cách đều: 1 vài số bị ẩn, học sinh điền theo quy luật (bước +1, +2, -1...). */
export function generateDaySo(grade, count = 4) {
  const max = WORKSHEET_GRADES[grade].maxNumber;
  const items = [];
  const steps = grade === "MAM_NON" ? [1] : grade === "LOP_1" ? [1, 2] : [1, 2, 5, 10];
  for (let i = 0; i < count; i++) {
    const step = pick(steps) * (Math.random() < 0.3 ? -1 : 1);
    const length = 6;
    const start = step > 0 ? randInt(1, Math.max(1, max - step * (length - 1))) : randInt(step * (length - 1) * -1 + 1, max);
    const sequence = Array.from({ length }, (_, idx) => start + step * idx);
    const hideIndex = randInt(1, length - 2); // không ẩn số đầu/cuối để còn suy luận quy luật
    const answer = sequence[hideIndex];
    const display = sequence.map((n, idx) => (idx === hideIndex ? null : n));
    items.push({ sequence: display, hideIndex, answer, step });
  }
  return items;
}

/** Nối phép tính với kết quả đúng - vế trái là phép tính, vế phải là kết quả bị xáo trộn. */
export function generateNoiPhepTinh(grade, count = 5) {
  const max = WORKSHEET_GRADES[grade].maxNumber;
  const pairs = [];
  const usedResults = new Set();
  for (let i = 0; i < count; i++) {
    let a, b, operator, result;
    do {
      operator = Math.random() < 0.5 ? "+" : "-";
      if (operator === "+") {
        a = randInt(1, max - 1);
        b = randInt(1, max - a);
        result = a + b;
      } else {
        a = randInt(2, max);
        b = randInt(1, a - 1);
        result = a - b;
      }
    } while (usedResults.has(result));
    usedResults.add(result);
    pairs.push({ expr: `${a} ${operator} ${b}`, result });
  }
  const shuffledResults = [...pairs.map((p) => p.result)].sort(() => Math.random() - 0.5);
  return { pairs, shuffledResults };
}

/** Nhận diện hình - chọn ngẫu nhiên 1 tập con hình cơ bản để học sinh gọi tên + tô màu.
 * GIAI ĐOẠN 9: `count` giờ LUÔN nhỏ hơn kích thước kho (mặc định 5/14, xem defaultCount trong
 * worksheetExerciseCatalog.js) nên slice() không còn khả năng lấy trọn cả kho như bug cũ - vẫn
 * chốt Math.min ở đây để an toàn tuyệt đối dù giáo viên tự gõ số lớn hơn kho vào ô số lượng. */
export function generateNhanDienHinh(count = 5) {
  const safeCount = Math.min(count, SHAPES.length);
  return [...SHAPES].sort(() => Math.random() - 0.5).slice(0, safeCount);
}

/**
 * ================== GIAI ĐOẠN 2 (đa dạng hoá dạng hoạt động) ==================
 * Sắp xếp thứ tự: mỗi bộ gồm 3 số phân biệt trong phạm vi của khối, hiển thị xáo trộn,
 * học sinh viết lại theo thứ tự. Đổi chiều bé->lớn / lớn->bé NGẪU NHIÊN theo từng bộ (không
 * cố định 1 chiều suốt phiếu) để bớt đơn điệu - khớp tinh thần bài mẫu "Sắp xếp các số đo độ
 * dài theo thứ tự từ bé đến lớn" trong phiếu lớp 2 giáo viên gửi làm nguồn cảm hứng ban đầu.
 */
export function generateSapXepThuTu(grade, count = 3) {
  const max = WORKSHEET_GRADES[grade].maxNumber;
  const sets = [];
  for (let i = 0; i < count; i++) {
    const numbers = new Set();
    while (numbers.size < 3) numbers.add(randInt(0, max));
    const ascending = [...numbers].sort((a, b) => a - b);
    const direction = Math.random() < 0.5 ? "asc" : "desc";
    const sortedAnswer = direction === "asc" ? ascending : [...ascending].reverse();
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    sets.push({ numbers: shuffled, sortedAnswer, direction });
  }
  return sets;
}

/**
 * ================== GIAI ĐOẠN 2 (sửa bug "Nhận diện hình" đứng trơ trọi) ==================
 * Đếm hình theo yêu cầu - hoạt động ỨNG DỤNG luôn đi kèm BẮT BUỘC ngay sau "Nhận diện hình"
 * (xem worksheetGenerator.js - không phải dạng bài giáo viên tự bật/tắt riêng, vì mục đích là
 * đảm bảo "Nhận diện hình" không bao giờ đứng một mình chỉ để liệt kê + tô màu như trước).
 *
 * QUAN TRỌNG: nhận `shapes` là CHÍNH danh sách hình đã chọn cho "Nhận diện hình" (không tự
 * chọn hình khác) - để 2 khối bài liên kết với nhau (hình bé vừa gọi tên/tô màu ở trên, giờ
 * đếm lại đúng những hình đó trong 1 "khay hình" trộn lẫn), không phải 2 hoạt động rời rạc.
 *
 * ================== GIAI ĐOẠN 9 (thêm hình gây nhiễu trong khay đếm) ==================
 * Khoảng 50% số lần tạo phiếu, trộn thêm 1-2 hình KHÔNG nằm trong `shapes` (lấy từ phần còn lại
 * của kho SHAPES) vào khay - CHỈ xuất hiện trong khay, KHÔNG có câu hỏi "Có bao nhiêu Hình X?"
 * tương ứng (không tính vào questions/answer) - giúp học sinh phải thực sự phân biệt đúng hình
 * cần đếm thay vì đếm máy móc mọi thứ có trong khay.
 */
export function generateDemHinhUngDung(shapes, count = 3) {
  const targets = [...shapes].sort(() => Math.random() - 0.5).slice(0, Math.min(count, shapes.length));
  const tray = shapes.map((shape) => ({ shape, qty: randInt(2, 5) }));

  const distractorPool = SHAPES.filter((s) => !shapes.includes(s));
  if (distractorPool.length > 0 && Math.random() < 0.5) {
    const distractorCount = randInt(1, Math.min(2, distractorPool.length));
    const distractors = [...distractorPool].sort(() => Math.random() - 0.5).slice(0, distractorCount);
    for (const shape of distractors) {
      tray.push({ shape, qty: randInt(1, 3) });
    }
  }

  const trayIcons = tray.flatMap(({ shape, qty }) => Array(qty).fill(shape)).sort(() => Math.random() - 0.5);
  const questions = targets.map((shape) => ({
    shape,
    answer: tray.find((t) => t.shape === shape)?.qty ?? 0,
  }));
  return { trayIcons, questions };
}

/** Danh sách icon dùng chung (để component render dùng lại, tránh lệch giữa các hàm sinh). */
export const AVAILABLE_ICONS = ICONS;

/**
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (Tầng B - catalog theo chủ đề SGK) ==================
 * Trước đây catalog chỉ có các dạng bài "kỹ năng chung" (tính nhẩm, so sánh...) không bám theo
 * MẠCH NỘI DUNG thật của SGK (đo lường, tiền tệ, thời gian...) - xem PROJECT_SUMMARY.md mục 0.5
 * để rõ bối cảnh. Bước 2 bắt đầu với 2 chủ đề Lớp 1 (đơn giản hơn, làm trước theo yêu cầu giáo
 * viên): "Độ dài" và "Thời gian" - đúng 2 mạch nội dung Lớp 1 có trong chương trình GDPT 2018
 * (Lớp 1 CHƯA học "Tiền Việt Nam" hay "chu vi hình", những chủ đề đó dành cho Lớp 2 - làm ở lượt
 * sau). Toàn bộ vẫn sinh THUẦN BẰNG CODE (không cần AI), giữ đúng triết lý "rẻ, nhanh, không lo
 * AI tính sai" của cả file này.
 */

// ===== Chủ đề "Độ dài" =====

/** Tên gọi các "băng giấy"/đoạn thẳng minh hoạ cho bài so sánh độ dài - dùng chữ cái để không
 * lẫn với số đo (khác hẳn phong cách "Băng A/Băng B" khô khan, gần với cách gọi trong SGK thật:
 * "băng giấy màu xanh/băng giấy màu đỏ" v.v.) */
const LENGTH_BAND_NAMES = [
  ["băng giấy xanh", "băng giấy đỏ"],
  ["băng giấy vàng", "băng giấy tím"],
  ["sợi dây xanh", "sợi dây cam"],
  ["cây bút chì xanh", "cây bút chì đỏ"],
  ["que tính xanh", "que tính vàng"],
];

/** So sánh độ dài 2 "băng giấy" (có ghi sẵn số đo cm) - điền dấu >, <, =. Phạm vi 3-20cm khớp
 * đúng phạm vi số Lớp 1 đã học (WORKSHEET_GRADES.LOP_1.maxNumber = 20). */
export function generateDoDaiSoSanh(count = 4) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const [nameA, nameB] = pick(LENGTH_BAND_NAMES);
    const cmA = randInt(3, 20);
    // Khoảng 20% số câu ra kết quả BẰNG NHAU (cmB = cmA) - còn lại random độc lập, để không lúc
    // nào cũng có dấu > hoặc < (đa dạng cả 3 loại dấu như bài "so_sanh" gốc).
    const cmB = Math.random() < 0.2 ? cmA : randInt(3, 20);
    const answer = cmA === cmB ? "=" : cmA > cmB ? ">" : "<";
    items.push({ nameA, cmA, nameB, cmB, answer });
  }
  return items;
}

/** Sắp xếp 3 "băng giấy" theo thứ tự độ dài (bé -> lớn hoặc lớn -> bé) - CÙNG khuôn dữ liệu với
 * generateSapXepThuTu() (numbers/sortedAnswer/direction) để tái dùng được nguyên xi
 * SapXepThuTuSection (web) / buildSapXepThuTuParagraphs (Word) mà KHÔNG cần viết component mới -
 * chỉ khác đơn vị hiển thị là "cm" đi kèm mỗi số (xử lý ở tầng hiển thị, xem WorksheetPreview.jsx/
 * worksheetExportService.js). */
export function generateDoDaiSapXep(count = 3) {
  const sets = [];
  for (let i = 0; i < count; i++) {
    const cmSet = new Set();
    while (cmSet.size < 3) cmSet.add(randInt(3, 30));
    const ascending = [...cmSet].sort((a, b) => a - b);
    const direction = Math.random() < 0.5 ? "asc" : "desc";
    const sortedAnswer = direction === "asc" ? ascending : [...ascending].reverse();
    const shuffled = [...cmSet].sort(() => Math.random() - 0.5);
    sets.push({ numbers: shuffled, sortedAnswer, direction, unit: "cm" });
  }
  return sets;
}

// ===== Chủ đề "Thời gian" =====

/** Xem đồng hồ - CHỈ giờ đúng (phút luôn chỉ số 12) - đúng mức độ chương trình Lớp 1 ("Thời
 * gian, giờ và lịch" chỉ dạy giờ đúng, giờ-phút để dành Lớp 2). `count` giờ PHÂN BIỆT lấy từ
 * 1-12 (xáo trộn rồi cắt, giống generateNhanDienHinh) - tránh lặp y hệt 1 giờ nhiều lần trong
 * cùng 1 phiếu khi count <= 12. */
export function generateXemDongHoGioDung(count = 4) {
  const allHours = Array.from({ length: 12 }, (_, i) => i + 1);
  const shuffled = [...allHours].sort(() => Math.random() - 0.5);
  if (count <= shuffled.length) return shuffled.slice(0, count).map((hour) => ({ hour }));
  // count > 12 (hiếm khi giáo viên cần nhiều vậy) - lặp lại sau khi hết 1 vòng, vẫn an toàn.
  const hours = [...shuffled];
  while (hours.length < count) hours.push(...[...allHours].sort(() => Math.random() - 0.5));
  return hours.slice(0, count).map((hour) => ({ hour }));
}

export const DAYS_OF_WEEK = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

/** Điền (các) ngày còn thiếu trong 1 đoạn liên tiếp của tuần - CÙNG khuôn dữ liệu với
 * generateDaySo() (sequence có null = chỗ trống, answer = giá trị đúng) để tái dùng được
 * DaySoSection/buildDaySoParagraphs, chỉ khác sequence chứa TÊN NGÀY (string) thay vì SỐ. Chỉ hỗ
 * trợ ẩn ĐÚNG 1 vị trí/câu (khác generateDaySo cho phép nhiều cấu hình) vì chuỗi 7 ngày trong
 * tuần ngắn, ẩn nhiều vị trí cùng lúc dễ làm bài mất hết đầu mối suy luận thứ tự. */
export function generateCacNgayTrongTuan(count = 3) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const length = randInt(4, 6); // đoạn liên tiếp dài 4-6 ngày (không wrap qua Chủ Nhật -> Thứ Hai, giữ đơn giản)
    const maxStart = DAYS_OF_WEEK.length - length;
    const start = randInt(0, maxStart);
    const sequence = DAYS_OF_WEEK.slice(start, start + length);
    const hideIndex = randInt(1, length - 2); // không ẩn ngày đầu/cuối - còn đầu mối suy luận
    const answer = sequence[hideIndex];
    const display = sequence.map((d, idx) => (idx === hideIndex ? null : d));
    items.push({ sequence: display, hideIndex, answer });
  }
  return items;
}

