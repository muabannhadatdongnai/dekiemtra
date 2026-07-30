/**
 * lessonPlanIntegrations.js
 * Registry các "tích hợp"/tuỳ chọn nâng cao khi soạn giáo án - đúng mô hình subjectProfiles.js/
 * gradeProfiles.js: MỞ RỘNG bằng cách thêm 1 entry vào LESSON_PLAN_INTEGRATIONS, KHÔNG phải sửa
 * lessonPlanPromptTemplates.js hay LessonPlanForm.jsx mỗi khi Bộ ra thêm 1 công văn tích hợp mới.
 *
 * Mỗi entry là 1 "plugin" độc lập, tự khai báo:
 *  - jsonField: tên trường sẽ xuất hiện thêm trong JSON trả về của AI (chỉ khi bật)
 *  - buildPromptFragment(): đoạn hướng dẫn chèn vào prompt khi bật
 *  - isAiGenerated: true nếu cần AI sinh nội dung; false nếu xử lý thuần code (ví dụ Timeline)
 */

export const INTEGRATION_KEYS = {
  TICH_HOP_NLS: "tichHopNLS",
  KHOI_DONG_SOI_NOI: "khoiDongSoiNoi",
  PHUONG_PHAP_TICH_CUC: "phuongPhapTichCuc",
  CUNG_CO: "cungCo",
  TICH_HOP_GDQPAN: "tichHopGDQPAN",
  TICH_HOP_HSKT: "tichHopHSKT",
  TIMELINE: "timeline",
  INFOGRAPHIC_MINDMAP: "infographicMindmap",
};

export const LESSON_PLAN_INTEGRATIONS = {
  [INTEGRATION_KEYS.TICH_HOP_NLS]: {
    key: INTEGRATION_KEYS.TICH_HOP_NLS,
    label: "Tích hợp NLS",
    description: "Thông tư 02/2025 & CV3456/BGDĐT (Năng lực số)",
    isAiGenerated: true,
    jsonField: "tichHopNLS",
    buildPromptFragment: () =>
      `- Thêm mục "Tích hợp Năng lực số" (theo Thông tư 02/2025 & Công văn 3456/BGDĐT): đề xuất 1-2 hoạt \n` +
      `  động cụ thể trong bài có ứng dụng công nghệ số/kỹ năng số phù hợp lứa tuổi (tra cứu thông tin an \n` +
      `  toàn, dùng phần mềm/app học tập phù hợp, kỹ năng gõ phím, nhận biết thông tin đúng-sai trên mạng...).\n` +
      `  Trả về trong trường JSON "tichHopNLS" (dạng đoạn văn ngắn, KHÔNG lặp lại y hệt nội dung hoạt động chính).`,
  },
  [INTEGRATION_KEYS.KHOI_DONG_SOI_NOI]: {
    key: INTEGRATION_KEYS.KHOI_DONG_SOI_NOI,
    label: "Khởi động",
    description: "Sôi nổi",
    isAiGenerated: true,
    jsonField: null, // không thêm field riêng - chỉ điều chỉnh CÁCH viết hoạt động Khởi động có sẵn
    buildPromptFragment: () =>
      `- Hoạt động "Khởi động" PHẢI thiết kế dưới dạng trò chơi/hoạt động sôi nổi, vui nhộn (hát, đố vui,\n` +
      `  trò chơi vận động ngắn, thi đua theo nhóm...) để thu hút sự chú ý ngay đầu tiết học, KHÔNG viết\n` +
      `  khởi động dưới dạng hỏi-đáp khô khan thông thường.`,
  },
  [INTEGRATION_KEYS.PHUONG_PHAP_TICH_CUC]: {
    key: INTEGRATION_KEYS.PHUONG_PHAP_TICH_CUC,
    label: "Phương pháp",
    description: "Tích cực",
    isAiGenerated: true,
    jsonField: null,
    buildPromptFragment: () =>
      `- TOÀN BỘ tiến trình dạy học phải ưu tiên các phương pháp dạy học tích cực (học sinh làm trung tâm):\n` +
      `  thảo luận nhóm, giải quyết vấn đề, học qua trải nghiệm, trình bày sáng tạo - hạn chế tối đa hình\n` +
      `  thức thuyết trình một chiều từ giáo viên.`,
  },
  [INTEGRATION_KEYS.CUNG_CO]: {
    key: INTEGRATION_KEYS.CUNG_CO,
    label: "Củng cố",
    description: "Bộ câu hỏi",
    isAiGenerated: true,
    jsonField: "cungCoQuestions",
    buildPromptFragment: () =>
      `- Thêm 1 bộ 3-5 câu hỏi củng cố nhanh cuối bài (trắc nghiệm hoặc hỏi nhanh), kèm đáp án ngắn gọn.\n` +
      `  Trả về trong trường JSON "cungCoQuestions": mảng các object { "cauHoi": "...", "dapAn": "..." }.`,
  },
  [INTEGRATION_KEYS.TICH_HOP_GDQPAN]: {
    key: INTEGRATION_KEYS.TICH_HOP_GDQPAN,
    label: "Tích hợp GDQP&AN",
    description: "Thông tư 08/2024",
    isAiGenerated: true,
    jsonField: "tichHopGDQPAN",
    buildPromptFragment: () =>
      `- Thêm mục "Tích hợp Giáo dục Quốc phòng và An ninh" (theo Thông tư 08/2024/TT-BGDĐT): lồng ghép\n` +
      `  NGẮN GỌN 1 nội dung phù hợp với bài học (tinh thần yêu nước, ý thức bảo vệ Tổ quốc, kỷ luật, an\n` +
      `  toàn cộng đồng...), KHÔNG biến bài học thành 1 tiết Giáo dục Quốc phòng riêng biệt.\n` +
      `  Trả về trong trường JSON "tichHopGDQPAN".`,
  },
  [INTEGRATION_KEYS.TICH_HOP_HSKT]: {
    key: INTEGRATION_KEYS.TICH_HOP_HSKT,
    label: "Tích hợp HSKT",
    description: "Thông tư 03/2018",
    isAiGenerated: true,
    jsonField: "tichHopHSKT",
    buildPromptFragment: () =>
      `- Thêm mục "Điều chỉnh cho học sinh khuyết tật học hoà nhập" (theo Thông tư 03/2018/TT-BGDĐT): gợi ý\n` +
      `  ngắn gọn cách điều chỉnh mục tiêu/phương pháp/hình thức đánh giá cho phù hợp với học sinh khuyết\n` +
      `  tật học hoà nhập trong lớp (ví dụ: giảm yêu cầu, tăng hỗ trợ trực quan, cho thêm thời gian...).\n` +
      `  Trả về trong trường JSON "tichHopHSKT".`,
  },
  [INTEGRATION_KEYS.TIMELINE]: {
    key: INTEGRATION_KEYS.TIMELINE,
    label: "Timeline",
    description: "Gợi ý phân bổ thời gian",
    isAiGenerated: false, // THUẦN CODE - xem computeActivityTimeline() trong lessonPlanTemplates.js
    jsonField: null,
    buildPromptFragment: () => "",
  },
  [INTEGRATION_KEYS.INFOGRAPHIC_MINDMAP]: {
    key: INTEGRATION_KEYS.INFOGRAPHIC_MINDMAP,
    label: "InfoGraphic - Mindmap",
    description: "Khái quát nội dung kiến thức",
    isAiGenerated: true,
    jsonField: "mindmap",
    buildPromptFragment: () =>
      `- Thêm 1 sơ đồ tư duy (mindmap) tóm tắt kiến thức trọng tâm của bài, dạng 1 chủ đề trung tâm và\n` +
      `  2-5 nhánh chính, mỗi nhánh có 2-4 ý phụ NGẮN GỌN (vài từ, không viết thành câu dài).\n` +
      `  Trả về trong trường JSON "mindmap": { "chuDe": "...", "nhanh": [ { "nhan": "...", "y": ["...", "..."] } ] }.`,
  },
};

/** Trả về danh sách entry hiển thị lên UI (đúng thứ tự trong ảnh mẫu). */
export function listIntegrations() {
  return Object.values(LESSON_PLAN_INTEGRATIONS);
}

export function getIntegration(key) {
  return LESSON_PLAN_INTEGRATIONS[key] || null;
}

/** Gộp các đoạn prompt của những tích hợp đang BẬT (selectedKeys: string[]). */
export function buildIntegrationsPromptBlock(selectedKeys = []) {
  const fragments = selectedKeys
    .map((key) => getIntegration(key))
    .filter((i) => i && i.isAiGenerated && i.buildPromptFragment())
    .map((i) => i.buildPromptFragment());
  if (fragments.length === 0) return "";
  return `\nTÍCH HỢP/NÂNG CAO ĐƯỢC GIÁO VIÊN YÊU CẦU THÊM (BẮT BUỘC tuân thủ đầy đủ):\n${fragments.join("\n")}\n`;
}
