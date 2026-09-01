/**
 * gradeProfiles.js
 * C1 (Phần B - Ý 1 "Router theo khối/họ"): quy tắc RIÊNG cho từng khối lớp khi sinh đề bằng AI,
 * mở rộng chiều "khối" - đúng mô hình subjectProfiles.js đang mở rộng chiều "môn". KHÔNG nhân
 * bản route theo từng khối×môn: chỉ 1 route xử lý chung (xem generate/route.js), cấu hình khác
 * nhau qua file này.
 *
 * 2 "họ" logic (không phải 12 khối riêng):
 *  - Họ A - Mầm non → Lớp 5: có thể có câu hỏi trực quan (đặt tính, sơ đồ, hình đếm...).
 *  - Họ B - Lớp 6 → Lớp 12: câu hỏi text thuần, không có visual, độ khó theo chương trình THCS/THPT.
 *
 * ⚠️ SỬA LỖI PHÁT HIỆN Ở PHIÊN 33 (mở rộng THPT): `buildBaseRules()` ở promptTemplates.js ghép
 * `gradeProfile.guidance` KHÔNG ĐIỀU KIỆN vào prompt của MỌI môn học, không riêng Toán. Bản CŨ của
 * `guidance` lại viết theo CHỦ ĐỀ TOÁN cụ thể ("có thể dùng đạo hàm", "tập hợp, lượng giác"...) -
 * vô hại khi hệ thống mới chỉ có ít môn, nhưng sẽ SAI HẲN khi áp cho Vật lí/Hoá học/Sinh học/Địa
 * lí/Tiếng Anh/Tiếng Việt/Đạo đức... (VD prompt Sinh học Lớp 11 sẽ bị nhét thêm dòng "có thể dùng
 * đạo hàm cơ bản" vô nghĩa). ĐÃ SỬA: `guidance` ở đây giờ CHỈ còn phần TRUNG LẬP theo môn (mức độ
 * nhận thức/độ phức tạp bối cảnh chung phù hợp lứa tuổi khối đó), KHÔNG nhắc chủ đề học thuật cụ
 * thể của bất kỳ môn nào. Phần "độ sâu kiến thức theo khối" ĐẶC THÙ từng môn (số liệu Toán, công
 * thức Vật lí, chủ đề Hoá học...) chuyển vào ĐÚNG subjectProfiles.js của môn đó (xem vd Toan/
 * Vat_Li/Hoa_Hoc/Sinh_Hoc/Lich_Su_Dia_Li/Cong_Nghe/Tin_Hoc trong subjectProfiles.js) - đúng
 * nguyên tắc "môn nào lo môn nấy", tránh lặp lại lỗi này khi thêm môn mới sau này.
 *
 * `numberRange`/`visualTypes`: 2 field THAM KHẢO/MÔ TẢ, hiện KHÔNG được code nào đọc trực tiếp
 * (chỉ `family`/`allowVisual`/`guidance` được dùng thật - xem promptTemplates.js/examOrchestrator.js)
 * - giữ lại làm tài liệu tham chiếu nhanh khi cần bật lại visual cho khối nào đó, không xoá để
 * tránh mất ngữ cảnh, nhưng đừng nhầm tưởng đây là cấu hình đang có hiệu lực.
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
      "Khối đầu cấp Tiểu học. Câu hỏi PHẢI cực kỳ đơn giản, 1 yêu cầu/1 bước duy nhất, không có " +
      "bối cảnh nhiều lớp thông tin, câu chữ ngắn gọn, từ ngữ quen thuộc gần gũi với học sinh 6 " +
      "tuổi. Xem thêm quy tắc riêng theo môn ở trên để biết phạm vi kiến thức/số liệu cụ thể.",
  },
  2: {
    family: "A",
    label: "Lớp 2",
    numberRange: { max: 100 },
    allowVisual: true,
    visualTypes: ["verticalArithmetic", "numberTriangle", "barModel", "visualCounting"],
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng"],
    guidance:
      "Đầu cấp Tiểu học. Câu hỏi vẫn đơn giản, có thể có 1 bối cảnh ngắn gần gũi đời sống học " +
      "sinh, câu chữ ngắn gọn, dễ hiểu. Xem thêm quy tắc riêng theo môn ở trên để biết phạm vi " +
      "kiến thức/số liệu cụ thể.",
  },
  3: {
    family: "A",
    label: "Lớp 3",
    numberRange: { max: 1000 },
    allowVisual: true,
    visualTypes: ["verticalArithmetic", "numberTriangle", "barModel"],
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng"],
    guidance:
      "Giữa cấp Tiểu học. Bối cảnh câu hỏi có thể có 1-2 bước suy luận/tính toán liên tiếp. Xem " +
      "thêm quy tắc riêng theo môn ở trên để biết phạm vi kiến thức/số liệu cụ thể.",
  },
  4: {
    family: "A",
    label: "Lớp 4",
    numberRange: { max: 100000 },
    allowVisual: true,
    visualTypes: ["barModel", "numberTriangle"],
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Cuối cấp Tiểu học (giai đoạn đầu). Bối cảnh câu hỏi phức tạp hơn, có thể có nhiều bước suy " +
      "luận/tính toán liên tiếp. Xem thêm quy tắc riêng theo môn ở trên để biết phạm vi kiến " +
      "thức/số liệu cụ thể.",
  },
  5: {
    family: "A",
    label: "Lớp 5",
    numberRange: { max: 1000000 },
    allowVisual: true,
    visualTypes: ["barModel"],
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Cuối cấp Tiểu học. Bối cảnh câu hỏi có thể nhiều bước, đòi hỏi kết hợp nhiều dữ kiện - đây " +
      "là khối cuối cùng trước khi chuyển cấp, độ khó nên tiệm cận (nhưng KHÔNG vượt) yêu cầu vào " +
      "THCS. Xem thêm quy tắc riêng theo môn ở trên để biết phạm vi kiến thức/số liệu cụ thể.",
  },
  6: {
    family: "B",
    label: "Lớp 6",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Khối đầu cấp THCS - chương trình mới bắt đầu, tránh dùng ký hiệu/khái niệm chưa học ở Lớp " +
      "6, KHÔNG giả định học sinh đã có nền tảng kiến thức THCS từ trước. Xem thêm quy tắc riêng " +
      "theo môn ở trên để biết đúng phạm vi kiến thức của khối này.",
  },
  7: {
    family: "B",
    label: "Lớp 7",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Giữa cấp THCS. Xem thêm quy tắc riêng theo môn ở trên để biết đúng phạm vi kiến thức của " +
      "khối này.",
  },
  8: {
    family: "B",
    label: "Lớp 8",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Giữa cấp THCS. Xem thêm quy tắc riêng theo môn ở trên để biết đúng phạm vi kiến thức của " +
      "khối này.",
  },
  9: {
    family: "B",
    label: "Lớp 9",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Khối cuối cấp THCS - độ khó nên tiệm cận (nhưng KHÔNG vượt) yêu cầu vào THPT. Xem thêm quy " +
      "tắc riêng theo môn ở trên để biết đúng phạm vi kiến thức của khối này.",
  },
  10: {
    family: "B",
    label: "Lớp 10",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Khối đầu cấp THPT (giai đoạn giáo dục định hướng nghề nghiệp theo Chương trình GDPT 2018) " +
      "- chương trình các môn lựa chọn (Vật lí/Hoá học/Sinh học/Địa lí/GDKT&PL/Công nghệ/Tin " +
      "học/Âm nhạc/Mĩ thuật) mới tách riêng từ khối này, tránh giả định học sinh đã có nền tảng " +
      "kiến thức THPT từ trước. Xem thêm quy tắc riêng theo môn ở trên để biết đúng phạm vi kiến " +
      "thức của khối này.",
  },
  11: {
    family: "B",
    label: "Lớp 11",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Giữa cấp THPT. Xem thêm quy tắc riêng theo môn ở trên để biết đúng phạm vi kiến thức của " +
      "khối này.",
  },
  12: {
    family: "B",
    label: "Lớp 12",
    allowVisual: false,
    difficultyLabels: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"],
    guidance:
      "Khối cuối cấp THPT, học sinh chuẩn bị thi tốt nghiệp THPT - có thể tăng độ phân hoá ở mức " +
      "\"Vận dụng cao\" (câu hỏi phân loại học sinh giỏi) rõ nét hơn các khối dưới. Xem thêm quy " +
      "tắc riêng theo môn ở trên để biết đúng phạm vi kiến thức của khối này.",
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
