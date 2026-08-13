/**
 * gradeProfiles.js
 * C1 (Phần B - Ý 1 "Router theo khối/họ"): quy tắc RIÊNG cho từng khối lớp khi sinh đề bằng AI,
 * mở rộng chiều "khối" - đúng mô hình subjectProfiles.js đang mở rộng chiều "môn". KHÔNG nhân
 * bản route theo từng khối×môn: chỉ 1 route xử lý chung (xem generate/route.js), cấu hình khác
 * nhau qua file này.
 *
 * 2 "họ" logic (không phải 12 khối riêng):
 *  - Họ A - Mầm non → Lớp 5: có thể có câu hỏi trực quan (đặt tính, sơ đồ, hình đếm...), số liệu
 *    tự sinh/kiểm soát theo phạm vi phù hợp lứa tuổi từng khối.
 *  - Họ B - Lớp 6 → Lớp 12: câu hỏi text thuần, không có visual, độ khó theo chương trình THCS/THPT.
 *
 * ⚠️ QUAN TRỌNG: file này CHỈ áp dụng cho luồng "Đề kiểm tra" (ExamMatrixForm, grade = số 1-12,
 * xem src/data/config.js -> GRADES). KHÔNG liên quan đến luồng "Phiếu bài tập" (Mầm non/Lớp 1/Lớp 2)
 * - luồng đó đã có hệ thống khối lớp RIÊNG trong worksheetSchemas.js (MAM_NON/LOP_1/LOP_2), vì phiếu
 * bài tập sinh số liệu thuần code (không dùng AI), không cần đọc profile này.
 *
 * C1 CHỈ thêm nền tảng dữ liệu + đọc thêm vào prompt (xem cách dùng trong promptTemplates.js) -
 * KHÔNG đổi hành vi hiện tại của UI (ExamMatrixForm vẫn cho chọn đủ 4 mức độ mọi khối, vẫn để
 * giáo viên tự bật/tắt "useVisualQuestions" thủ công) - profile ở đây chỉ BỔ SUNG hướng dẫn cho AI,
 * an toàn để test song song với hệ thống cũ mà không sợ vỡ luồng đang chạy ổn định.
 *
 * Thêm khối mới (ví dụ sau này "Lớp 13 - luyện thi ĐGNL") = thêm 1 entry vào GRADE_PROFILES,
 * không cần sửa route hay promptTemplates.js.
 */

export const GRADE_FAMILY = {
  1: "A",
  2: "A",
  3: "A",
  4: "A",
  5: "A",
  6: "B",
  7: "B",
  8: "B",
  9: "B",
  10: "B",
  11: "B",
  12: "B",
};

export const GRADE_PROFILES = {
  1: {
    family: "A",
    label: "Lớp 1",
    numberRange: { max: 20 },
    allowVisual: true,
    visualTypes: ["verticalArithmetic", "numberTriangle", "barModel", "visualCounting"],
    // Lớp 1 chưa cần "Vận dụng cao" trong chương trình - chỉ mang tính THAM KHẢO cho AI,
    // KHÔNG chặn ở tầng UI/API (giáo viên vẫn có thể yêu cầu nếu thực sự cần).
    difficultyLabels: ["Nhận biết", "Thông hiểu"],
    guidance:
      "Số liệu trong phạm vi 0-20. Ưu tiên phép cộng/trừ không nhớ, đếm số lượng, so sánh số. " +
      "Câu hỏi PHẢI cực kỳ đơn giản, 1 bước tính duy nhất, không có bối cảnh nhiều lớp thông tin.",
  },
  2: {
    family: "A",
    label: "Lớp 2",
    numberRange: { max: 100 },
    allowVisual: true,
    visualTypes: ["verticalArithmetic", "numberTriangle", "barModel", "visualCounting"],
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng"],
    guidance:
      "Số liệu trong phạm vi 0-100. Có thể có phép cộng/trừ có nhớ, bài toán có lời văn 1 bước tính.",
  },
  3: {
    family: "A",
    label: "Lớp 3",
    numberRange: { max: 1000 },
    allowVisual: true,
    visualTypes: ["verticalArithmetic", "numberTriangle", "barModel"],
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng"],
    guidance:
      "Số liệu trong phạm vi 0-1000. Bắt đầu có phép nhân/chia đơn giản (bảng cửu chương), " +
      "bài toán có lời văn 1-2 bước tính.",
  },
  4: {
    family: "A",
    label: "Lớp 4",
    numberRange: { max: 100000 },
    allowVisual: true,
    visualTypes: ["barModel", "numberTriangle"],
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Có thể dùng số có nhiều chữ số, phân số đơn giản (cùng mẫu số), phép tính 2-3 bước. " +
      "Kết quả cuối cùng vẫn phải là số tròn, dễ kiểm tra.",
  },
  5: {
    family: "A",
    label: "Lớp 5",
    numberRange: { max: 1000000 },
    allowVisual: true,
    visualTypes: ["barModel"],
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Có thể dùng phân số khác mẫu số, số thập phân, tỉ số phần trăm, bài toán có lời văn nhiều " +
      "bước tính. Vẫn tránh số vô tỉ hoặc thập phân vô hạn tuần hoàn.",
  },
  6: {
    family: "B",
    label: "Lớp 6",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance: "Chương trình THCS mới bắt đầu - tránh dùng ký hiệu/khái niệm chưa học ở Lớp 6.",
  },
  7: {
    family: "B",
    label: "Lớp 7",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance: "Chương trình THCS - có thể dùng số hữu tỉ, biểu thức đại số đơn giản.",
  },
  8: {
    family: "B",
    label: "Lớp 8",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance: "Chương trình THCS - có thể dùng hằng đẳng thức, phương trình bậc nhất 1 ẩn.",
  },
  9: {
    family: "B",
    label: "Lớp 9",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance: "Chương trình THCS (năm cuối) - có thể dùng căn thức, hệ phương trình, hàm số bậc nhất/bậc hai đơn giản.",
  },
  10: {
    family: "B",
    label: "Lớp 10",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance: "Chương trình THPT - có thể dùng tập hợp, hàm số, lượng giác cơ bản, vector.",
  },
  11: {
    family: "B",
    label: "Lớp 11",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance: "Chương trình THPT - có thể dùng dãy số, giới hạn, đạo hàm cơ bản, xác suất.",
  },
  12: {
    family: "B",
    label: "Lớp 12",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance: "Chương trình THPT (năm cuối, ôn thi TN THPT) - có thể dùng nguyên hàm/tích phân, số phức, không gian Oxyz.",
  },
};

/**
 * Trả về profile theo khối lớp, LUÔN an toàn (không bao giờ throw/undefined):
 * - Khối không xác định -> mặc định về Lớp 12 (Họ B, text thuần) vì đây là cấu hình "ít giả định
 *   nhất" (không tự ý bật visual cho 1 khối lạ chưa được kiểm chứng phù hợp hay không).
 */
export function getGradeProfile(grade) {
  return GRADE_PROFILES[grade] || GRADE_PROFILES[12];
}

export function getGradeFamily(grade) {
  return getGradeProfile(grade).family;
}
