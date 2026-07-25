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
};

const ICONS = ["🍎", "⭐", "🚗", "🐥", "🌻", "🦋", "🥕"];
const SHAPES = ["Hình tròn", "Hình vuông", "Hình tam giác", "Hình chữ nhật", "Hình ngôi sao", "Hình trái tim"];

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

/** Nhận diện hình - chọn ngẫu nhiên 1 tập con hình cơ bản để học sinh gọi tên + tô màu. */
export function generateNhanDienHinh(count = 6) {
  return [...SHAPES].sort(() => Math.random() - 0.5).slice(0, count);
}

/** Danh sách icon dùng chung (để component render dùng lại, tránh lệch giữa các hàm sinh). */
export const AVAILABLE_ICONS = ICONS;
