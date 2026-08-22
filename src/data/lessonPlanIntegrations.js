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
  LOI_DAN: "loiDan",
  SLIDE_OUTLINE: "slideOutline",
  TICH_HOP_STEM: "tichHopSTEM",
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
  [INTEGRATION_KEYS.LOI_DAN]: {
    key: INTEGRATION_KEYS.LOI_DAN,
    label: "Lời dẫn (Teacher Script)",
    description: "Câu chuyển ý mẫu cho từng hoạt động, đọc trực tiếp trên lớp",
    isAiGenerated: true,
    jsonField: "loiDan",
    // ⚠️ ĐIỀU CHỈNH so với đề xuất gốc của giáo viên (xem KE_HOACH_GIAI_DOAN_10.md mục 2, đề xuất
    // #2): KHÔNG chèn thẳng vào Mục III bản chính (rủi ro bị đánh giá "không chuẩn form" khi BGH
    // duyệt CV2345) - luôn xuất ra dưới dạng field JSON riêng ("loiDan"), hiển thị ở bản xem trước
    // web dưới dạng PHỤ LỤC tách biệt, và khi xuất Word chỉ chèn nếu giáo viên chủ động bật cờ
    // "Bản đầy đủ có lời dẫn" (xem includeTeacherScript trong lessonPlanExportService.js/
    // LessonPlanExportActions.jsx) - mặc định xuất "Bản nộp chuẩn" KHÔNG có phụ lục này.
    buildPromptFragment: () =>
      `- Soạn thêm "Lời dẫn" (Teacher Script) - với MỖI hoạt động trong mảng "hoatDong" (Khởi động,\n` +
      `  Khám phá/..., Luyện tập, Vận dụng hoặc tên hoạt động Mầm non tương ứng), viết ĐÚNG 1 câu (hoặc\n` +
      `  tối đa 2 câu ngắn) LỜI DẪN DẮT/CHUYỂN Ý mà giáo viên có thể ĐỌC TO NGUYÊN VĂN trên lớp ngay\n` +
      `  TRƯỚC khi bắt đầu hoạt động đó (với hoạt động đầu tiên, đây là câu mở đầu tiết học; với các\n` +
      `  hoạt động sau, đây là câu chuyển ý từ hoạt động liền trước sang hoạt động này).\n` +
      `  Yêu cầu VĂN PHONG: đây là lời NÓI trực tiếp với học sinh (xưng "cô/thầy" - gọi "các con"/"các\n` +
      `  em" tuỳ cấp học), TỰ NHIÊN như giáo viên thật đang nói trên lớp - KHÔNG viết theo giọng văn\n` +
      `  bản giáo án hành chính (không dùng câu kiểu "Hoạt động này nhằm mục đích..."). Nếu giáo viên\n` +
      `  đã chọn "Phong cách soạn giáo án" (Sáng tạo/Nhẹ nhàng/Năng động/Tự do), lời dẫn PHẢI thể hiện\n` +
      `  ĐÚNG giọng văn của phong cách đó.\n` +
      `  Trả về trong trường JSON "loiDan": mảng object, ĐÚNG SỐ LƯỢNG PHẦN TỬ = số hoạt động trong\n` +
      `  "hoatDong" (không thừa/thiếu), theo ĐÚNG THỨ TỰ hoạt động, mỗi phần tử { "hoatDong": "<tên\n` +
      `  hoạt động, TRÙNG KHỚP với trường \\"ten\\" của hoạt động tương ứng>", "loiDan": "<câu dẫn dắt,\n` +
      `  không tự thêm dấu ngoặc kép>" }.`,
    schemaExample: `"loiDan": [ { "hoatDong": "...", "loiDan": "..." } ]`,
  },
  [INTEGRATION_KEYS.SLIDE_OUTLINE]: {
    key: INTEGRATION_KEYS.SLIDE_OUTLINE,
    label: "Slide Outline",
    description: "Dàn ý từng slide để dựng PowerPoint/Canva nhanh",
    isAiGenerated: true,
    jsonField: "slideOutline",
    // ⚠️ GIỚI HẠN PHẠM VI có chủ đích (xem KE_HOACH_GIAI_DOAN_10.md mục 2, đề xuất #3): CHỈ dàn ý
    // TEXT đơn giản (danh sách slide + nội dung gợi ý dạng gạch đầu dòng), KHÔNG tạo file .pptx
    // thật, KHÔNG hứa hẹn "hiệu ứng xuất hiện từng dòng"/animation hay bất kỳ điều gì ngoài khả
    // năng của 1 dàn ý text (rủi ro kỹ thuật không tương xứng lợi ích nếu làm file .pptx thật).
    buildPromptFragment: () =>
      `- Soạn thêm "Dàn ý Slide" (Slide Outline) - CHỈ là dàn ý VĂN BẢN THUẦN TÚY để giáo viên tự\n` +
      `  dựng PowerPoint/Canva NHANH HƠN (KHÔNG phải file trình chiếu thật, KHÔNG có hiệu ứng/hình\n` +
      `  ảnh/animation gì - chỉ liệt kê tiêu đề + gợi ý nội dung từng slide).\n` +
      `  Số lượng slide hợp lý theo tiến trình bài dạy (thường 6-10 slide tuỳ số hoạt động/số tiết):\n` +
      `  BẮT BUỘC có 1 slide "Trang bìa" đầu tiên (tên bài - lớp - môn) và slide cuối "Cảm ơn/Kết\n` +
      `  thúc" hoặc "Dặn dò", các slide ở giữa bám sát ĐÚNG THỨ TỰ 4 hoạt động đã soạn ở trên (có\n` +
      `  thể tách 1 hoạt động dài thành NHIỀU slide nếu nội dung nhiều, ví dụ hoạt động "Khám phá"\n` +
      `  có thể cần 2-3 slide).\n` +
      `  Mỗi slide gồm 1 tiêu đề ngắn gọn và 2-5 gạch đầu dòng gợi ý nội dung (mỗi gạch đầu dòng chỉ\n` +
      `  vài từ/1 cụm ý NGẮN GỌN như dàn ý thật - KHÔNG viết thành câu văn hoàn chỉnh dài dòng, giáo\n` +
      `  viên sẽ tự triển khai chi tiết khi dựng slide thật).\n` +
      `  Trả về trong trường JSON "slideOutline": mảng object theo ĐÚNG THỨ TỰ trình chiếu, mỗi phần\n` +
      `  tử { "tieuDe": "...", "noiDung": ["...", "..."] } - "noiDung" là mảng CHUỖI, mỗi phần tử 1\n` +
      `  gạch đầu dòng (hệ thống sẽ tự hiển thị dấu gạch đầu dòng, KHÔNG tự thêm "-" vào đầu chuỗi).`,
    schemaExample: `"slideOutline": [ { "tieuDe": "...", "noiDung": ["...", "..."] } ]`,
  },
  [INTEGRATION_KEYS.TICH_HOP_STEM]: {
    key: INTEGRATION_KEYS.TICH_HOP_STEM,
    label: "Tích hợp STEM",
    description: "Vận dụng làm sản phẩm thực tế thay bài tập giấy",
    isAiGenerated: true,
    jsonField: "stemActivity",
    // ⚠️ Đổi hẳn BẢN CHẤT hoạt động "Vận dụng" có sẵn (không phải thêm hoạt động thứ 5) - xem
    // getActivityLabels() trong lessonPlanTemplates.js: khi tích hợp này bật, "ten" của khối
    // "van_dung" được đổi thành đúng nhãn "[Vận dụng - Tích hợp STEM]" ngay trong ví dụ JSON
    // chính (buildActivitySchemaBlock), KHÔNG chỉ mô tả bằng lời ở đây.
    // Thời lượng: GIỮ NGUYÊN trần maxMinutes=12 của "van_dung" (không sửa lessonPlanTemplates.js/
    // computeMultiPeriodTimeline) - tại lớp chỉ giao nhiệm vụ + hướng dẫn nhanh, sản phẩm thật
    // hoàn thiện Ở NHÀ, đúng cách tích hợp NLS đã xử lý hoạt động cần thiết bị số.
    buildPromptFragment: () =>
      `- Hoạt động "Vận dụng" PHẢI đổi hẳn bản chất: KHÔNG giao bài tập làm trên giấy như thông\n` +
      `  thường, mà giao 1 nhiệm vụ theo định hướng GIÁO DỤC STEM - yêu cầu học sinh dùng ĐÚNG kiến\n` +
      `  thức vừa học trong bài này để Thiết kế, Vẽ, Lắp ráp, hoặc Chế tạo 1 SẢN PHẨM THỰC TẾ (VD:\n` +
      `  làm poster, làm mô hình, vẽ sơ đồ, làm sổ tay...) - sản phẩm PHẢI thể hiện rõ kiến thức bài\n` +
      `  học, không phải hoạt động thủ công chung chung không liên quan nội dung bài.\n` +
      `  Gợi ý mức độ phù hợp lứa tuổi: Mầm non/Lớp 1-2 ưu tiên hình thức ĐƠN GIẢN (vẽ, tô màu, dán -\n` +
      `  ít bước, không cần vật liệu nhỏ khó thao tác); Lớp 3-5 có thể phức tạp hơn (lắp ráp/chế tạo\n` +
      `  mô hình từ bìa, que, dây, vật liệu tái chế dễ tìm, rẻ tiền, an toàn với trẻ).\n` +
      `  ⚠️ VỀ THỜI LƯỢNG: tại lớp CHỈ đủ thời gian để nêu yêu cầu sản phẩm, hướng dẫn nhanh cách\n` +
      `  làm, chia nhóm/giao việc (vẫn trong khung thời lượng gợi ý đã nêu cho "Vận dụng", KHÔNG kéo\n` +
      `  dài thêm) - TUYỆT ĐỐI KHÔNG để học sinh làm sản phẩm hoàn chỉnh ngay tại lớp. Bước cuối của\n` +
      `  "tienTrinh" hoạt động này PHẢI ghi rõ: học sinh HOÀN THIỆN sản phẩm Ở NHÀ (có thể nhờ phụ\n` +
      `  huynh hỗ trợ) và mang nộp/trình bày/trưng bày vào buổi học sau.\n` +
      `  Đổi trường "ten" của hoạt động này thành đúng "[Vận dụng - Tích hợp STEM]" (đã thể hiện\n` +
      `  trong ví dụ schema JSON bên dưới).\n` +
      `  Trả về thêm nội dung CỤ THỂ trong trường JSON "stemActivity" (giáo viên in/gửi phụ huynh\n` +
      `  hướng dẫn con làm NGAY, không phải tự soạn thêm): { "tenSanPham": "...", "vatLieu": ["...",\n` +
      `  "..."], "cacBuoc": ["...", "..."], "tieuChiDanhGia": ["...", "..."] } - "vatLieu" là vật liệu\n` +
      `  dễ tìm/rẻ tiền cần chuẩn bị; "cacBuoc" là các bước thực hiện NGẮN GỌN theo đúng thứ tự (không\n` +
      `  tự đánh số trong chuỗi, hệ thống tự đánh số khi hiển thị); "tieuChiDanhGia" là 2-4 tiêu chí\n` +
      `  đơn giản để giáo viên/học sinh tự đánh giá sản phẩm khi nộp.`,
    schemaExample:
      `"stemActivity": { "tenSanPham": "...", "vatLieu": ["...", "..."], "cacBuoc": ["...", "..."], "tieuChiDanhGia": ["...", "..."] }`,
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
