/**
 * lessonPlanStyles.js
 * "Phong cách soạn giáo án" - GIAI ĐOẠN 10, Việc 2/7 (xem KE_HOACH_GIAI_DOAN_10.md mục 4).
 * Cùng khuôn "registry" với lessonPlanIntegrations.js/subjectProfiles.js, nhưng đây KHÔNG phải
 * 1 "tích hợp" bật/tắt độc lập - phong cách là LỰA CHỌN DUY NHẤT (radio, không phải checkbox) áp
 * dụng cho TOÀN BỘ giáo án, nên KHÔNG có "isAiGenerated"/"jsonField" như integrations - phong
 * cách chỉ chèn 1 đoạn hướng dẫn vào prompt, KHÔNG thêm field JSON riêng vào kết quả AI trả về.
 *
 * ⚠️ PHẠM VI ẢNH HƯỞNG BỊ GIỚI HẠN CỐ Ý (đã chốt trong kế hoạch, mục 4): phong cách CHỈ được phép
 * tác động "hình thức mềm" (giọng văn, kiểu hoạt động khởi động, cách chọn ví dụ minh hoạ) -
 * TUYỆT ĐỐI KHÔNG được đụng khung chuẩn CV2345 (Mục I-IV, phân bổ thời lượng, yêu cầu chuyên môn
 * theo môn học/khối lớp). Câu "khoanh vùng phạm vi" này được chèn CỐ ĐỊNH ở buildLessonPlanStyle-
 * PromptFragment() bên dưới, ÁP DỤNG CHO MỌI phong cách (kể cả tự do) - không để lọt qua chỉ vì
 * giáo viên chọn "tự do" và tự ý mô tả sai phạm vi.
 *
 * 3 preset ĐÃ CHỐT, KHÔNG THÊM (xem mục 7 kế hoạch): Sáng tạo / Nhẹ nhàng / Năng động.
 */

export const LESSON_PLAN_STYLE_IDS = {
  SANG_TAO: "sang_tao",
  NHE_NHANG: "nhe_nhang",
  NANG_DONG: "nang_dong",
  TU_DO: "tu_do",
};

// ĐÃ CHỐT: ~150 ký tự (khoảng 1 câu) cho ô "tự mô tả phong cách riêng" - xem mục 7 kế hoạch.
export const CUSTOM_STYLE_MAX_LENGTH = 150;

export const LESSON_PLAN_STYLES = {
  [LESSON_PLAN_STYLE_IDS.SANG_TAO]: {
    id: LESSON_PLAN_STYLE_IDS.SANG_TAO,
    label: "Sáng tạo",
    hint: "Giàu liên tưởng, ví dụ độc đáo, khuyến khích ý tưởng riêng của học sinh",
    buildPromptFragment: () =>
      `- Giọng văn giàu hình ảnh, liên tưởng bất ngờ, thú vị; ưu tiên ví dụ minh hoạ độc đáo/mới lạ\n` +
      `  thay vì ví dụ quen thuộc, khuôn mẫu.\n` +
      `- Hoạt động "Khởi động" nên gợi mở bằng 1 tình huống/câu hỏi kích thích trí tò mò, KHÔNG đi\n` +
      `  thẳng vào nội dung ngay.\n` +
      `- Trong "Luyện tập", khuyến khích học sinh tự đề xuất cách làm/ý tưởng riêng của mình (thay vì\n` +
      `  chỉ làm theo đúng 1 khuôn mẫu duy nhất), miễn vẫn bám sát yêu cầu chuyên môn của bài học.`,
  },
  [LESSON_PLAN_STYLE_IDS.NHE_NHANG]: {
    id: LESSON_PLAN_STYLE_IDS.NHE_NHANG,
    label: "Nhẹ nhàng",
    hint: "Giọng văn ân cần, chậm rãi, ví dụ gần gũi đời sống hằng ngày",
    buildPromptFragment: () =>
      `- Giọng văn nhẹ nhàng, ân cần, chậm rãi, gần gũi - tránh câu chữ hối thúc/gấp gáp.\n` +
      `- Ví dụ minh hoạ nên lấy từ đời sống hằng ngày quen thuộc, thân thương với học sinh (gia đình,\n` +
      `  lớp học, đồ vật gần gũi...), tránh tình huống ồn ào/căng thẳng/thi đua gay gắt.\n` +
      `- Hoạt động "Khởi động" KHÔNG dùng trò chơi vận động mạnh/thi đua căng thẳng giữa các nhóm -\n` +
      `  ưu tiên hình thức nhẹ nhàng như kể chuyện ngắn, hát, xem tranh, trò chuyện thân mật.`,
  },
  [LESSON_PLAN_STYLE_IDS.NANG_DONG]: {
    id: LESSON_PLAN_STYLE_IDS.NANG_DONG,
    label: "Năng động",
    hint: "Sôi nổi, ví dụ gắn vận động/thi đua, học sinh tương tác nhiều",
    buildPromptFragment: () =>
      `- Giọng văn sôi nổi, hào hứng, nhịp độ nhanh; ưu tiên ví dụ minh hoạ gắn với vận động, trò\n` +
      `  chơi, thi đua giữa các nhóm/cá nhân.\n` +
      `- Hoạt động "Khởi động" và "Luyện tập" nên thiết kế để học sinh DI CHUYỂN/TƯƠNG TÁC NHIỀU\n` +
      `  (đứng lên trả lời, chơi trò chơi tiếp sức, thi đua theo đội...), hạn chế hoạt động ngồi yên\n` +
      `  nghe giảng kéo dài. Vẫn PHẢI gọn trong thời lượng gợi ý, không kéo dài quá giờ vì mải chơi.`,
  },
};

export function listLessonPlanStyles() {
  return Object.values(LESSON_PLAN_STYLES);
}

export function getLessonPlanStyle(id) {
  return LESSON_PLAN_STYLES[id] || null;
}

/**
 * buildLessonPlanStylePromptFragment()
 * @param {{ styleId?: string|null, customStyleText?: string|null }} style
 * @returns {string} đoạn chèn vào prompt, hoặc "" nếu không có phong cách nào được chọn/hợp lệ.
 *
 * Trả về "" (KHÔNG chèn gì) khi: không có styleId, hoặc styleId="tu_do" nhưng customStyleText rỗng
 * sau khi trim - để giáo án soạn ra vẫn bình thường như trước đây nếu giáo viên chưa chọn phong
 * cách nào, KHÔNG ép buộc phải chọn.
 */
export function buildLessonPlanStylePromptFragment(style) {
  const styleId = style?.styleId;
  if (!styleId) return "";

  let detailLines;
  if (styleId === LESSON_PLAN_STYLE_IDS.TU_DO) {
    const trimmed = String(style?.customStyleText || "").trim();
    if (!trimmed) return "";
    // Cắt phòng thân ở đây (double-check) dù phía client/route đã giới hạn độ dài - không để 1
    // đoạn văn dài lọt qua nếu có nơi nào đó gọi hàm này trực tiếp mà bỏ qua bước validate.
    const safeText = trimmed.slice(0, CUSTOM_STYLE_MAX_LENGTH);
    detailLines = `- Giáo viên tự mô tả phong cách riêng: "${safeText}" - hãy thể hiện ĐÚNG tinh thần\n  mô tả này trong giọng văn/cách chọn ví dụ/kiểu hoạt động, trong phạm vi cho phép nêu trên.`;
  } else {
    const preset = getLessonPlanStyle(styleId);
    if (!preset) return "";
    detailLines = preset.buildPromptFragment();
  }

  return `
PHONG CÁCH SOẠN GIÁO ÁN (do giáo viên chọn - CHỈ ẢNH HƯỞNG "HÌNH THỨC MỀM": giọng văn, kiểu hoạt
động khởi động, cách chọn ví dụ minh hoạ. TUYỆT ĐỐI KHÔNG được vì phong cách này mà thay đổi khung
mục I-IV chuẩn, phân bổ thời lượng, hay yêu cầu chuyên môn theo môn học/khối lớp đã nêu ở trên):
${detailLines}
`;
}
