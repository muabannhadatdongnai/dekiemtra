/**
 * visualSchemas.js
 * Định nghĩa các dạng "câu hỏi trực quan" đặc trưng Toán Tiểu học VN (Lớp 1-5):
 * đặt tính rồi tính, cây số/tam giác quan hệ, sơ đồ đoạn thẳng, hình đếm trực quan.
 *
 * TRIẾT LÝ THIẾT KẾ QUAN TRỌNG: AI (Gemini) CHỈ sinh ra SỐ LIỆU (visualData), KHÔNG bao giờ
 * yêu cầu AI "vẽ" hình bằng text/ASCII. Việc vẽ hình do CODE của chúng ta đảm nhiệm 100%
 * (component SVG cho preview/PDF, Table cho Word) - vừa đáng tin cậy tuyệt đối (không lo AI
 * vẽ sai/lệch), vừa rẻ hơn nhiều lần so với việc bắt AI mô tả hình ảnh bằng ngôn ngữ.
 */

export const VISUAL_TYPES = {
  VERTICAL_ARITHMETIC: "vertical_arithmetic",
  NUMBER_TRIANGLE: "number_triangle",
  BAR_MODEL: "bar_model",
  VISUAL_COUNTING: "visual_counting",
};

/**
 * Mô tả từng dạng để nhúng vào prompt cho AI hiểu cách sinh visualData đúng định dạng,
 * kèm ví dụ JSON cụ thể AI có thể bắt chước.
 */
export const VISUAL_TYPE_PROMPT_GUIDE = `
CÁC DẠNG CÂU HỎI TRỰC QUAN (dùng khi phù hợp với Lớp 1-5, KHÔNG bắt buộc mọi câu):

1. Đặt tính rồi tính (vertical_arithmetic) - cho phép tính +,-,×,: cần trình bày cột dọc:
{
  "visualType": "vertical_arithmetic",
  "visualData": { "operandA": 37, "operandB": 56, "operator": "+" }
}
(operator chỉ nhận "+", "-", "x", hoặc ":")

2. Cây số / tam giác quan hệ (number_triangle) - 3 đỉnh có quan hệ cộng/trừ, 1 đỉnh ẩn:
{
  "visualType": "number_triangle",
  "visualData": { "top": 73, "left": 27, "right": 46, "hidden": "top" }
}
(BẮT BUỘC: top = left + right phải đúng về mặt toán học; "hidden" là đỉnh sẽ bị ẩn để học sinh tìm, nhận giá trị "top"|"left"|"right")

3. Sơ đồ đoạn thẳng so sánh hơn-kém (bar_model) - minh hoạ bài toán có lời văn dạng "hơn/kém":
{
  "visualType": "bar_model",
  "visualData": {
    "barA": { "label": "Gạo nếp", "value": 255 },
    "barB": { "label": "Gạo tẻ", "value": null },
    "differenceValue": 24,
    "unit": "bao"
  }
}
(barA.value luôn là số đã biết; barB.value luôn là null (ẩn số, chính là đáp án); differenceValue là
phần hơn/kém giữa 2 đại lượng; đảm bảo barA.value > differenceValue để kết quả dương)

4. Hình đếm trực quan cho phân số (visual_counting) - dùng minh hoạ khái niệm phân số bằng vật đếm được:
{
  "visualType": "visual_counting",
  "visualData": {
    "totalItems": 16,
    "rows": [7, 6, 3],
    "icon": "star",
    "fractionNumerator": 1,
    "fractionDenominator": 4
  }
}
(rows phải cộng lại đúng bằng totalItems; totalItems BẮT BUỘC chia hết cho fractionDenominator;
icon chỉ nhận "star", "circle", hoặc "square")

QUY TẮC CHUNG:
- Trường "visualType" và "visualData" là TUỲ CHỌN - chỉ thêm vào khi câu hỏi thực sự phù hợp
  để minh hoạ trực quan (ví dụ: đừng gắn visual cho câu hỏi lý thuyết thuần tuý).
- KHÔNG bịa thêm trường nào ngoài đúng cấu trúc ví dụ ở trên cho từng loại.
- Nội dung "content" của câu hỏi vẫn phải có đầy đủ đề bài bằng chữ như bình thường, visualData
  chỉ là dữ liệu BỔ SUNG để hệ thống vẽ hình minh hoạ đi kèm.

KHUNG KẺ Ô NHÁP (needsScratchSpace):
- Với câu tự luận cần học sinh tính toán nhiều bước trên giấy (đặc biệt: đặt tính rồi tính,
  bài toán có lời văn nhiều bước), thêm trường "needsScratchSpace": true (boolean) vào câu hỏi
  đó để hệ thống tự chừa khung giấy kẻ ô trống bên dưới cho học sinh làm bài - KHÔNG tự vẽ
  khung này bằng text.
`;

/** Tính đáp án đúng một cách xác định (không phụ thuộc vào AI tính đúng hay sai) từ visualData. */
export function computeVisualAnswer(visualType, data) {
  switch (visualType) {
    case VISUAL_TYPES.VERTICAL_ARITHMETIC: {
      const { operandA, operandB, operator } = data;
      switch (operator) {
        case "+":
          return operandA + operandB;
        case "-":
          return operandA - operandB;
        case "x":
          return operandA * operandB;
        case ":":
          return operandA / operandB;
        default:
          return null;
      }
    }
    case VISUAL_TYPES.NUMBER_TRIANGLE: {
      const { top, left, right, hidden } = data;
      if (hidden === "top") return left + right;
      if (hidden === "left") return top - right;
      if (hidden === "right") return top - left;
      return null;
    }
    case VISUAL_TYPES.BAR_MODEL: {
      const { barA, differenceValue } = data;
      // barA luôn là giá trị đã biết, barB (ẩn) = barA - differenceValue (mô hình "hơn kém")
      return barA.value - differenceValue;
    }
    case VISUAL_TYPES.VISUAL_COUNTING: {
      const { totalItems, fractionNumerator, fractionDenominator } = data;
      return (totalItems * fractionNumerator) / fractionDenominator;
    }
    default:
      return null;
  }
}

/**
 * Kiểm tra visualData có hợp lệ về mặt toán học không (vd rows cộng đúng totalItems,
 * kết quả chia hết, số dương...). Trả về true/false - nếu false, ta bỏ qua visual đó
 * (fallback về câu hỏi text thường) thay vì hiển thị hình sai cho học sinh.
 */
export function isValidVisualData(visualType, data) {
  try {
    switch (visualType) {
      case VISUAL_TYPES.VERTICAL_ARITHMETIC: {
        const { operandA, operandB, operator } = data;
        if (typeof operandA !== "number" || typeof operandB !== "number") return false;
        if (!["+", "-", "x", ":"].includes(operator)) return false;
        if (operator === ":" && (operandB === 0 || operandA % operandB !== 0)) return false;
        if (operator === "-" && operandA < operandB) return false;
        return true;
      }
      case VISUAL_TYPES.NUMBER_TRIANGLE: {
        const { top, left, right, hidden } = data;
        if (![top, left, right].every((n) => typeof n === "number")) return false;
        if (!["top", "left", "right"].includes(hidden)) return false;
        return top === left + right;
      }
      case VISUAL_TYPES.BAR_MODEL: {
        const { barA, barB, differenceValue } = data;
        if (typeof barA?.value !== "number" || typeof differenceValue !== "number") return false;
        if (barB?.value !== null && barB?.value !== undefined) return false; // barB phải là ẩn số
        return barA.value > differenceValue && differenceValue > 0;
      }
      case VISUAL_TYPES.VISUAL_COUNTING: {
        const { totalItems, rows, fractionNumerator, fractionDenominator } = data;
        if (!Array.isArray(rows) || rows.reduce((a, b) => a + b, 0) !== totalItems) return false;
        if (totalItems % fractionDenominator !== 0) return false;
        if (fractionNumerator >= fractionDenominator) return false;
        return true;
      }
      default:
        return false;
    }
  } catch {
    return false;
  }
}
