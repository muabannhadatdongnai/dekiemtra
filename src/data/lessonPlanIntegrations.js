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
 *  - schemaExample: đoạn JSON MẪU (dạng chuỗi, sẽ nối vào object schema chính) minh hoạ CỤ THỂ
 *    hình dạng field này - xem giải thích lý do thêm trường này trong buildLessonPlanPrompt()
 *    (lessonPlanPromptTemplates.js): trước đây field như "mindmap" CHỈ được mô tả bằng lời trong
 *    buildPromptFragment(), không xuất hiện trong ví dụ JSON chính -> AI hay quên trả về field
 *    này dù đã đọc yêu cầu, vì ví dụ cụ thể luôn "neo" hành vi mô hình tốt hơn mô tả bằng lời.
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
  PHIEU_HOC_TAP: "phieuHocTap",
  TIN_NHAN_PHU_HUYNH: "tinNhanPhuHuynh",
  CHECKLIST_NLPC: "checklistNLPC",
  BAI_TAP_PHAN_HOA: "baiTapPhanHoa",
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
      `  ⚠️ BẮT BUỘC ưu tiên phương án KHẢ THI với điều kiện cơ sở vật chất phổ biến ở trường Tiểu học/Mầm\n` +
      `  non Việt Nam hiện nay: MẶC ĐỊNH thiết kế theo hướng "giáo viên trình chiếu/thao tác trên 1 màn\n` +
      `  hình/máy chiếu chung cho cả lớp cùng quan sát", KHÔNG mặc định mỗi học sinh có sẵn máy tính bảng/\n` +
      `  điện thoại riêng để tự thao tác tại lớp (trừ khi "Nội dung cốt lõi" giáo viên nêu rõ tiết học diễn\n` +
      `  ra tại phòng Tin học/phòng máy). Nếu hoạt động cần học sinh TỰ thao tác trên thiết bị số, hãy gợi ý\n` +
      `  chuyển thành nhiệm vụ ở phần "Vận dụng" để thực hiện Ở NHÀ dưới sự hướng dẫn của phụ huynh, thay vì\n` +
      `  bắt buộc thực hiện ngay tại lớp.\n` +
      `  Trả về trong trường JSON "tichHopNLS" (dạng đoạn văn ngắn, KHÔNG lặp lại y hệt nội dung hoạt động chính).`,
    schemaExample: `"tichHopNLS": "..."`,
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
      `  khởi động dưới dạng hỏi-đáp khô khan thông thường. Vẫn PHẢI gọn trong khoảng thời gian gợi ý\n` +
      `  (thường 5-7 phút) - trò chơi sôi nổi không đồng nghĩa với kéo dài, tránh "cháy giáo án".`,
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
    schemaExample: `"cungCoQuestions": [ { "cauHoi": "...", "dapAn": "..." } ]`,
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
    schemaExample: `"tichHopGDQPAN": "..."`,
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
    schemaExample: `"tichHopHSKT": "..."`,
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
      `  Trả về trong trường JSON "mindmap": { "chuDe": "...", "nhanh": [ { "nhan": "...", "y": ["...", "..."] } ] }.\n` +
      `  BẮT BUỘC phải có trường "mindmap" này trong JSON trả về - đây KHÔNG phải trường tuỳ chọn.`,
    schemaExample:
      `"mindmap": { "chuDe": "...", "nhanh": [ { "nhan": "...", "y": ["...", "..."] }, { "nhan": "...", "y": ["...", "..."] } ] }`,
  },
  [INTEGRATION_KEYS.PHIEU_HOC_TAP]: {
    key: INTEGRATION_KEYS.PHIEU_HOC_TAP,
    label: "Phiếu học tập",
    description: "Đính kèm phụ lục để photo dùng ngay",
    isAiGenerated: true,
    jsonField: "phieuHocTap",
    buildPromptFragment: () =>
      `- Soạn CỤ THỂ nội dung "Phiếu học tập" đính kèm cuối giáo án (KHÔNG chỉ ghi "giao phiếu học tập"\n` +
      `  mà không có nội dung phiếu) - giáo viên cần in/photo ra dùng NGAY, không phải tự soạn thêm.\n` +
      `  Phiếu gồm 4-8 bài tập/câu hỏi ngắn bám sát đúng nội dung bài học (không lấy lại nguyên văn ví dụ\n` +
      `  đã dùng ở phần Luyện tập trên lớp - nên đổi số liệu/ngữ cảnh để học sinh tự làm được), phù hợp\n` +
      `  để học sinh viết trực tiếp câu trả lời vào phiếu (không yêu cầu vẽ hình phức tạp hay tra cứu).\n` +
      `  Trả về trong trường JSON "phieuHocTap": { "tieuDe": "Phiếu học tập số 1", "huongDan": "...",\n` +
      `  "baiTap": ["...", "..."] } - "baiTap" là mảng CHUỖI, mỗi phần tử là 1 đề bài/câu hỏi hoàn chỉnh\n` +
      `  (không đánh số thứ tự trong chuỗi, hệ thống sẽ tự đánh số khi hiển thị/in).`,
    schemaExample: `"phieuHocTap": { "tieuDe": "Phiếu học tập số 1", "huongDan": "...", "baiTap": ["...", "..."] }`,
  },
  [INTEGRATION_KEYS.TIN_NHAN_PHU_HUYNH]: {
    key: INTEGRATION_KEYS.TIN_NHAN_PHU_HUYNH,
    label: "Tin nhắn phụ huynh",
    description: "Mẫu Zalo copy-paste ngay",
    isAiGenerated: true,
    jsonField: "tinNhanPhuHuynh",
    buildPromptFragment: () =>
      `- Soạn thêm 1 "Tin nhắn gửi phụ huynh" đính kèm cuối giáo án, giáo viên chỉ việc COPY-PASTE\n` +
      `  nguyên văn vào Zalo nhóm lớp, KHÔNG cần chỉnh sửa gì thêm. Nội dung gồm ĐỦ 3 phần, viết liền\n` +
      `  mạch như 1 tin nhắn thật (không đánh số 1/2/3, không dùng đầu mục):\n` +
      `  (1) 1 câu chào phụ huynh thân thiện;\n` +
      `  (2) tóm tắt NGẮN GỌN nội dung con vừa học hôm nay bằng NGÔN NGỮ ĐỜI THƯỜNG, DỄ HIỂU với phụ\n` +
      `      huynh không có chuyên môn sư phạm - TUYỆT ĐỐI KHÔNG dùng thuật ngữ chuyên môn kiểu "yêu\n` +
      `      cầu cần đạt", "năng lực", "phẩm chất", "hoạt động khởi động/luyện tập/vận dụng";\n` +
      `  (3) gợi ý ĐÚNG 1 hoạt động đơn giản phụ huynh có thể cùng con làm ở nhà để ôn lại bài (không\n` +
      `      cần dụng cụ đặc biệt, không tốn nhiều thời gian, phù hợp thực hiện ngay trong buổi tối).\n` +
      `  Độ dài khoảng 60-120 từ (vừa đủ 1 tin nhắn Zalo, KHÔNG viết dài như 1 đoạn văn báo cáo). Có\n` +
      `  thể dùng tối đa 1-2 emoji phù hợp (VD 📚, 🏠, 👋) để thân thiện, KHÔNG lạm dụng emoji.\n` +
      `  Kết thúc bằng 1 câu cảm ơn ngắn, KHÔNG cần ký tên cụ thể (để giáo viên tự điền tên khi gửi).\n` +
      `  Trả về trong trường JSON "tinNhanPhuHuynh" (1 chuỗi văn bản duy nhất, không xuống dòng đầu mục).`,
    schemaExample: `"tinNhanPhuHuynh": "..."`,
  },
  [INTEGRATION_KEYS.CHECKLIST_NLPC]: {
    key: INTEGRATION_KEYS.CHECKLIST_NLPC,
    label: "Checklist NL-PC",
    description: "Bảng tiêu chí quan sát, đánh giá theo Thông tư 27/2020",
    isAiGenerated: true,
    jsonField: "checklistNLPC",
    buildPromptFragment: () =>
      `- Thêm 1 "Checklist đánh giá Năng lực - Phẩm chất" đính kèm cuối giáo án, giúp giáo viên quan\n` +
      `  sát nhanh học sinh NGAY TRONG TIẾT HỌC (không phải phiếu tự luận, không cần chấm điểm số).\n` +
      `  BẮT BUỘC: mỗi dòng checklist phải ỨNG VỚI ĐÚNG 1 tiêu chí đã liệt kê trong "yeuCauCanDat.nangLuc"\n` +
      `  hoặc "yeuCauCanDat.phamChat" của CHÍNH giáo án này (giữ nguyên tinh thần/nội dung tiêu chí đó,\n` +
      `  có thể viết gọn lại) - KHÔNG bịa thêm tiêu chí nằm ngoài 2 danh sách đó, và KHÔNG bỏ sót tiêu\n` +
      `  chí nào trong 2 danh sách (đủ số dòng = tổng số phần tử của nangLuc + phamChat).\n` +
      `  Với MỖI tiêu chí, viết 3 mô tả biểu hiện CỤ THỂ, NGẮN GỌN, QUAN SÁT ĐƯỢC TRỰC TIẾP trong tiết\n` +
      `  học (không viết chung chung kiểu "hiểu bài"/"tích cực"), theo đúng tinh thần 3 mức của Thông tư\n` +
      `  27/2020/TT-BGDĐT (đánh giá học sinh Tiểu học) - với Mầm non hiểu tương ứng theo mức độ đạt được\n` +
      `  ở lĩnh vực phát triển liên quan:\n` +
      `  + "tot": biểu hiện ở mức Tốt (chủ động, thành thạo, có thể giúp bạn khác).\n` +
      `  + "dat": biểu hiện ở mức Đạt (hoàn thành yêu cầu cơ bản, có thể cần nhắc/hỗ trợ đôi chỗ).\n` +
      `  + "canCoGang": biểu hiện ở mức Cần cố gắng (chưa hoàn thành, cần giáo viên hỗ trợ nhiều).\n` +
      `  Trả về trong trường JSON "checklistNLPC": mảng các object { "tieuChi": "...",\n` +
      `  "loai": "nang_luc" | "pham_chat", "tot": "...", "dat": "...", "canCoGang": "..." }.`,
    schemaExample:
      `"checklistNLPC": [ { "tieuChi": "...", "loai": "nang_luc", "tot": "...", "dat": "...", "canCoGang": "..." } ]`,
  },
  [INTEGRATION_KEYS.BAI_TAP_PHAN_HOA]: {
    key: INTEGRATION_KEYS.BAI_TAP_PHAN_HOA,
    label: "Bài tập phân hoá",
    description: "3 mức: Hỗ trợ - Đạt chuẩn - Nâng cao",
    isAiGenerated: true,
    jsonField: "baiTapPhanHoa",
    buildPromptFragment: () =>
      `- Soạn thêm "Bài tập phân hoá theo 3 mức độ" đính kèm phụ lục cuối giáo án, PHỤC VỤ dạy học\n` +
      `  phân hoá theo năng lực học sinh trong CÙNG 1 lớp (không phải 3 phiếu tách rời cho 3 lớp khác\n` +
      `  nhau) - giáo viên phát đúng nhóm bài phù hợp cho từng nhóm học sinh trong tiết Luyện tập/Vận\n` +
      `  dụng, hoặc dùng làm bài tập về nhà phân hoá.\n` +
      `  BẮT BUỘC cả 3 mức đều XOAY QUANH ĐÚNG 1 NỘI DUNG KIẾN THỨC của bài học này (không lạc đề\n` +
      `  sang kiến thức khác), CHỈ khác nhau về ĐỘ KHÓ/YÊU CẦU, theo đúng tinh thần:\n` +
      `  + "hoTro" (Hỗ trợ - dành cho học sinh CHƯA ĐẠT yêu cầu cần đạt): 2-3 bài tập ở MỨC NHẬN BIẾT\n` +
      `    đơn giản nhất, có thể kèm gợi ý/làm mẫu 1 phần, số liệu/ngữ liệu ít và quen thuộc.\n` +
      `  + "datChuan" (Đạt chuẩn - dành cho ĐA SỐ học sinh): 2-3 bài tập ĐÚNG mức yêu cầu cần đạt cơ\n` +
      `    bản của bài học, không kèm gợi ý làm mẫu.\n` +
      `  + "nangCao" (Nâng cao - dành cho học sinh học TỐT/NHANH hơn): 2-3 bài tập có yêu cầu VẬN\n` +
      `    DỤNG/tư duy cao hơn (kết hợp nhiều bước, tình huống thực tế, mở rộng nhẹ - KHÔNG vượt quá\n` +
      `    xa chương trình, vẫn phải giải được bằng đúng kiến thức bài học này).\n` +
      `  ⚠️ 3 mức PHẢI thực sự khác biệt rõ rệt về độ khó (không chỉ đổi số liệu qua loa) - đây là\n` +
      `  điểm mấu chốt để giáo viên phân hoá thật sự, không phải 3 bản sao gần giống nhau.\n` +
      `  Trả về trong trường JSON "baiTapPhanHoa": { "hoTro": ["...", "..."], "datChuan": ["...", "..."],\n` +
      `  "nangCao": ["...", "..."] } - mỗi mức là mảng CHUỖI, mỗi phần tử là 1 đề bài/câu hỏi hoàn\n` +
      `  chỉnh (không tự đánh số thứ tự trong chuỗi, hệ thống sẽ tự đánh số khi hiển thị/in).`,
    schemaExample:
      `"baiTapPhanHoa": { "hoTro": ["..."], "datChuan": ["..."], "nangCao": ["..."] }`,
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

/**
 * Gộp các đoạn "schemaExample" của những tích hợp đang BẬT có field riêng (jsonField) - dùng để
 * chèn TRỰC TIẾP vào ví dụ JSON chính trong buildLessonPlanPrompt(), giúp AI thấy được hình dạng
 * CỤ THỂ của field thay vì chỉ đọc mô tả bằng lời (xem giải thích đầy đủ trong JSDoc đầu file).
 * Trả về mảng các dòng string, KHÔNG phải 1 chuỗi đã nối, để nơi gọi tự quyết định cách nối dấu
 * phẩy/xuống dòng cho khớp với phần còn lại của object JSON mẫu.
 */
export function collectIntegrationSchemaExamples(selectedKeys = []) {
  return selectedKeys
    .map((key) => getIntegration(key))
    .filter((i) => i && i.isAiGenerated && i.jsonField && i.schemaExample)
    .map((i) => i.schemaExample);
}
