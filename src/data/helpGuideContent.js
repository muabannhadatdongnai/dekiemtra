/**
 * helpGuideContent.js
 * =============================================================================
 * NỘI DUNG CHO TAB "❓ Hướng dẫn sử dụng" (xem HelpGuideView.jsx + mode HELP trong page.js).
 *
 * MỤC ĐÍCH FILE NÀY:
 * - Đây là "nguồn dữ liệu DUY NHẤT" cho tab Hướng dẫn - component HelpGuideView.jsx CHỈ lo việc
 *   RENDER (accordion/list), KHÔNG chứa nội dung chữ nào cứng trong JSX. Nhờ vậy, mỗi khi thêm/
 *   sửa 1 tính năng ở nơi khác trong app, chỉ cần sửa ĐÚNG 1 chỗ trong file này để cập nhật tài
 *   liệu hướng dẫn - không phải mò trong component React.
 * - Đây là tài liệu dành cho 2 đối tượng đọc KHÁC NHAU, phân biệt rõ qua 2 field riêng trong mỗi
 *   mục (feature): "detail" (dành cho GIÁO VIÊN - mô tả bằng lời thường, không thuật ngữ code) và
 *   phần "devNotes" ở cấp module (dành cho LẬP TRÌNH VIÊN/AI ở phiên sau - trỏ đúng tên file/hàm
 *   liên quan trong source code để dễ tìm khi cần sửa/nâng cấp).
 *
 * QUY ƯỚC CẤU TRÚC (đọc kỹ trước khi thêm mục mới):
 * - `GUIDE_SECTIONS`: mảng các "module" lớn, đúng theo 6 tab chức năng hiện có trong `page.js`
 *   (`MODES`) + 1 mục đầu tiên "Tổng quan" (không phải tab thật, chỉ để giới thiệu chung) + 1 mục
 *   cuối "Hạ tầng dùng chung" (không phải tab thật, gom các cơ chế nền chạy NGẦM phía sau mọi tab:
 *   đăng nhập, giới hạn lượt tạo, bộ nhớ đệm, định dạng số...).
 * - Mỗi module có `id` (PHẢI trùng khớp giá trị `MODES.*` tương ứng trong `page.js` nếu module đó
 *   ứng với 1 tab thật - dùng để sau này có thể tự động liên kết "xem thêm" nếu cần, hiện tại chưa
 *   dùng tới nhưng giữ đúng quy ước để không lệch).
 * - `steps`: các bước sử dụng theo đúng THỨ TỰ thao tác thực tế trên giao diện (không phải thứ tự
 *   quan trọng) - viết ngắn gọn, xưng hô với giáo viên bằng "bạn".
 * - `features`: liệt kê CÁC TÍNH NĂNG CỤ THỂ đã có trong code (không viết chung chung "AI thông
 *   minh" - phải mô tả ĐÚNG cái gì bấm/chọn được, ra kết quả gì) - đây là phần dài nhất, cũng là
 *   phần cần cập nhật thường xuyên nhất mỗi khi có tính năng mới.
 * - `notes`: lưu ý/giới hạn giáo viên nên biết trước khi dùng (KHÔNG phải lỗi, là hành vi có chủ
 *   đích - ví dụ "chỉ hỗ trợ đến Lớp 5", "mặc định không kèm phụ lục X khi xuất Word"...).
 * - `devNotes`: dành cho lập trình viên/AI phiên sau - tên file chính + gợi ý "muốn thêm 1 X mới
 *   thì sửa ở đâu". KHÔNG hiển thị cho giáo viên bình thường (xem cờ `audience` trong
 *   HelpGuideView.jsx - mặc định giao diện chỉ hiện phần giáo viên, có nút "Hiện ghi chú kỹ thuật"
 *   để bật thêm phần devNotes khi cần).
 *
 * KHI THÊM 1 TÍNH NĂNG MỚI VÀO APP (ví dụ: thêm 1 tích hợp giáo án mới, 1 dạng bài Phiếu bài tập
 * mới, 1 tab mới...), NÊN CẬP NHẬT LUÔN FILE NÀY như 1 bước trong quy trình hoàn thành việc đó -
 * giống cách PROJECT_SUMMARY.md/NEXT_STEPS.md đã được cập nhật sau mỗi phiên làm việc.
 * =============================================================================
 */

// Mỗi module gắn 1 icon lucide-react (tên component, KHÔNG phải emoji) để đồng bộ hình ảnh với
// icon đã dùng trên nút chuyển tab trong page.js (page.js hiện dùng emoji trên nút, còn ở đây
// dùng icon lucide-react cho khung nội dung - 2 bộ hình ảnh khác nhau CÓ CHỦ Ý, tab dùng emoji
// cho gọn, trang hướng dẫn dùng icon lucide-react cho đồng bộ với phần còn lại của UI).
export const GUIDE_SECTIONS = [
  // ===========================================================================================
  // 0. TỔNG QUAN — không phải 1 tab thật, chỉ giới thiệu chung
  // ===========================================================================================
  {
    id: "overview",
    icon: "BookOpen",
    emoji: "📚",
    title: "Tổng quan hệ thống",
    audienceSummary:
      "Công cụ tạo nội dung dạy học bằng AI dành cho giáo viên: đề kiểm tra, phiếu bài tập, giáo án, đề Tiếng Việt, đề cương ôn tập, nhận xét học bạ.",
    description:
      "Đây là bộ công cụ giúp giáo viên tạo nhanh 6 loại nội dung dạy học bằng AI (Gemini), " +
      "xem trước ngay trên trình duyệt theo đúng khổ giấy A4, rồi tải về dưới dạng Word (.docx) " +
      "và/hoặc in trực tiếp ra PDF. Mục tiêu vận hành: chi phí $0 (miễn phí), không cần cài đặt " +
      "phần mềm gì thêm ngoài trình duyệt.",
    steps: [
      "Vào trang chính, chọn 1 trong các tab chức năng ở hàng nút phía trên (Soạn giáo án, Phiếu bài tập, Đề Tiếng Việt Tiểu học, Đề cương Ôn tập, Đề kiểm tra, Nhận xét học bạ).",
      "Điền thông tin ở khung bên trái (môn học, khối lớp, bài/chương, số lượng...) rồi bấm nút tạo nội dung.",
      "Xem kết quả hiện ra ngay ở khung bên phải, đúng như khi in ra giấy A4.",
      "Bấm nút tải Word hoặc \"In / Tải PDF\" để lấy file mang đi dùng.",
    ],
    features: [
      {
        name: "6 công cụ tạo nội dung, mỗi công cụ 1 tab riêng",
        detail:
          "Mỗi tab là 1 công cụ độc lập, không ảnh hưởng lẫn nhau: dữ liệu bạn nhập/tạo ở tab này " +
          "vẫn còn nguyên khi bạn chuyển sang tab khác rồi quay lại (trừ khi bạn đăng xuất).",
      },
      {
        name: "Xem trước đúng khổ A4 trước khi tải",
        detail:
          "Khung bên phải hiển thị đúng như trang giấy sẽ in ra (kể cả màu sắc, khung viền, chia " +
          "cột...) - bạn có thể yên tâm kiểm tra trước khi tải file, không cần mở thử Word.",
      },
      {
        name: "Xuất Word (.docx) và/hoặc In trực tiếp ra PDF",
        detail:
          "Hầu hết các tab đều có nút tải file Word về máy để chỉnh sửa thêm nếu cần, và/hoặc nút " +
          "\"In / Tải PDF\" (dùng chức năng In của trình duyệt) để in ngay hoặc lưu thành PDF.",
      },
      {
        name: "Theo dõi số lượt đã dùng trong ngày",
        detail:
          "Khung nhỏ \"Lượt dùng hôm nay\" ở cuối bảng điều khiển bên trái cho biết bạn đã tạo bao " +
          "nhiêu lượt trong ngày và còn lại bao nhiêu (mỗi giáo viên có hạn mức riêng theo ngày, " +
          "để tránh 1 người dùng hết tài nguyên chung của cả trường).",
      },
    ],
    notes: [
      "Ứng dụng dùng chung 1 tài khoản AI cho toàn trường (không phải tài khoản cá nhân) - vì vậy có giới hạn số lượt tạo/ngày cho mỗi giáo viên, tránh 1 người dùng hết phần của người khác.",
      "Một số trường học đã tắt hẳn màn hình đăng nhập (chế độ công khai) để tiện dùng thử - nếu trường bạn vẫn yêu cầu đăng nhập, dùng tài khoản do quản trị viên cấp.",
    ],
    devNotes: {
      summary:
        "Điểm vào chính: src/app/page.js (hằng số MODES, state mode, layout 2 cột trái-phải dùng chung id=\"print-area\").",
      pointers: [
        "Muốn thêm 1 tab MỚI: xem mục \"Hạ tầng dùng chung\" ở cuối trang này, phần \"Cách thêm 1 tab chức năng mới\".",
        "6 tab hiện có đều theo đúng 1 khuôn kiến trúc: Form (nhập liệu) → Blueprint (hợp đồng dữ liệu client↔server, src/data/*Blueprint.js) → API route (src/app/api/*) → Orchestrator (src/services/*Orchestrator.js) → Engine (gọi AI, src/services/*Engine.js) → PromptTemplates (dựng prompt, src/data/*PromptTemplates.js) → Preview (xem trước web) → ExportActions/ExportService (xuất Word).",
        "Nguyên tắc xuyên suốt dự án: \"Isolation over DRY\" - mỗi tính năng thường có style/component RIÊNG, chấp nhận trùng lặp code thay vì dùng chung 1 hàm cho nhiều tính năng khác bản chất (xem PROJECT_SUMMARY.md/NEXT_STEPS.md, mục \"Lưu ý chung của dự án\").",
      ],
    },
  },

  // ===========================================================================================
  // 1. SOẠN GIÁO ÁN — MODES.LESSON_PLAN = "lessonPlan"
  // ===========================================================================================
  {
    id: "lessonPlan",
    icon: "NotebookPen",
    emoji: "📘",
    title: "Soạn giáo án",
    audienceSummary: "Soạn giáo án theo khung mẫu CV2345, có thể bật thêm nhiều phụ lục tuỳ chọn.",
    description:
      "Soạn 1 giáo án hoàn chỉnh theo đúng khung 4 mục chuẩn (Mục tiêu → Đồ dùng dạy học → Tiến " +
      "trình dạy học gồm Khởi động/Khám phá/Luyện tập/Vận dụng → ...), dùng cho Mầm non đến Lớp 5, " +
      "hỗ trợ giáo án 1 tiết hoặc nhiều tiết liên tiếp.",
    steps: [
      "Chọn Môn học, Khối lớp, nhập Tên bài học.",
      "Chọn Loại bài (Bài mới / Ôn tập-Luyện tập / Thực hành-Trải nghiệm) để AI đổi giọng văn và tên hoạt động cho đúng bản chất tiết học.",
      "Nhập Số tiết nếu bài dạy trong nhiều tiết liên tục - hệ thống sẽ tự chèn vạch \"Hết Tiết N\" đúng chỗ.",
      "(Tuỳ chọn) Bật các \"Tích hợp\" cần dùng ở phần \"Tuỳ chọn nâng cao\" - xem danh sách đầy đủ bên dưới.",
      "(Tuỳ chọn) Chọn 1 \"Phong cách soạn giáo án\" nếu muốn đổi giọng văn/kiểu ví dụ minh hoạ.",
      "(Tuỳ chọn) Tải lên 1 giáo án mẫu (Word/PDF/ảnh chụp) nếu muốn bám theo đúng cách trình bày quen thuộc của trường.",
      "Bấm \"Soạn giáo án\", xem kết quả bên phải, tải Word khi ưng ý.",
    ],
    features: [
      {
        name: "Khung 4 mục chuẩn CV2345",
        detail:
          "Mục I (Yêu cầu cần đạt: Năng lực + Phẩm chất), Mục II (Đồ dùng dạy học), Mục III (Tiến " +
          "trình dạy học: Khởi động → Khám phá/Hệ thống hoá → Luyện tập → Vận dụng), Mục IV. Mỗi " +
          "bước trong tiến trình được đánh số \"Bước 1/Bước 2...\" tự động, nhất quán giữa bản xem " +
          "trước và file Word.",
      },
      {
        name: "3 loại bài, đổi tên hoạt động cho đúng bản chất",
        detail:
          "Bài mới / Ôn tập-Luyện tập / Thực hành-Trải nghiệm - khi chọn \"Ôn tập\", hoạt động thứ " +
          "2 tự đổi tên thành \"Hệ thống hoá kiến thức\" thay vì \"Khám phá\" (tránh giọng văn " +
          "\"khám phá điều mới\" cho 1 bài ôn tập).",
      },
      {
        name: "Giáo án nhiều tiết, tự chia thời lượng + đánh dấu ranh giới tiết",
        detail:
          "Nhập số tiết (VD 2), hệ thống tự phân bổ đúng số phút mỗi hoạt động theo từng tiết " +
          "(không lệch phút do làm tròn) và tự chèn đúng 1 vạch \"── Hết Tiết N (nghỉ giải lao) — " +
          "Chuyển sang Tiết N+1 ──\" ở đúng vị trí, cả trên web lẫn file Word.",
      },
      {
        name: "12 \"Tích hợp\" tuỳ chọn (bật/tắt độc lập bằng checkbox)",
        detail:
          "Tích hợp NLS (Năng lực số), Khởi động sôi nổi, Phương pháp (dạy học tích cực), Củng cố " +
          "(câu hỏi ôn nhanh cuối bài), Tích hợp GDQP&AN, Tích hợp HSKT (học sinh khuyết tật), " +
          "Timeline (dòng thời gian trực quan), InfoGraphic - Mindmap, Phiếu học tập (4-8 bài tập " +
          "cụ thể kèm theo, BẬT SẴN mặc định), Tin nhắn phụ huynh (đoạn tin nhắn Zalo sẵn sàng " +
          "copy-paste, có nút \"Sao chép\"), Checklist NL-PC (bảng rubric Tốt/Đạt/Cần cố gắng theo " +
          "Thông tư 27/2020), Bài tập phân hoá 3 mức (Hỗ trợ/Đạt chuẩn/Nâng cao cùng 1 nội dung, " +
          "khác độ khó), Lời dẫn - Teacher Script (câu nói mẫu cho từng hoạt động, mặc định KHÔNG " +
          "kèm khi tải Word - phải tự tick \"Bản đầy đủ có lời dẫn\"), Slide Outline (dàn ý 6-10 " +
          "slide trình chiếu, chỉ là văn bản gợi ý, KHÔNG tạo file PowerPoint thật), Tích hợp STEM " +
          "(đổi hoạt động Vận dụng thành làm sản phẩm STEM thực tế, gợi ý mức độ theo khối lớp).",
      },
      {
        name: "4 phong cách soạn giáo án (chọn 1)",
        detail:
          "Sáng tạo (giàu hình ảnh/liên tưởng), Nhẹ nhàng (ân cần, ví dụ đời thường), Năng động " +
          "(nhiều vận động/thi đua), hoặc Tự do (bạn tự mô tả trong 150 ký tự). Phong cách chỉ đổi " +
          "giọng văn/ví dụ, KHÔNG đụng khung mục/thời lượng/yêu cầu chuyên môn. Có thể bấm \"Lưu " +
          "phong cách này\" để lần soạn sau tự động dùng lại.",
      },
      {
        name: "Chống trùng lặp ý tưởng mở bài giữa các lần soạn",
        detail:
          "Hệ thống tự nhớ \"ý tưởng mở bài\" (hoạt động Khởi động) của các lần soạn trước CHO ĐÚNG " +
          "tổ hợp Khối + Môn + Bài đó - nếu lần soạn mới ra ý tưởng quá giống lần trước, sẽ có cảnh " +
          "báo nhắc bạn cân nhắc tạo lại (không tự động chặn/sinh lại, bạn tự quyết).",
      },
      {
        name: "Tải lên giáo án mẫu tham khảo (Word/PDF/ảnh)",
        detail:
          "2 chế độ: \"Bám sát mẫu\" (ưu tiên đúng cách trình bày của mẫu) hoặc \"Kết hợp mẫu + " +
          "SGK\" (áp cách trình bày của mẫu nhưng vẫn giữ khung mục chuẩn). Hệ thống CHỈ học CÁCH " +
          "TRÌNH BÀY từ mẫu (thứ tự đề mục, cách đánh số bước...), KHÔNG copy nội dung bài học của mẫu.",
      },
      {
        name: "2 file Word: bản nộp chuẩn và bản đầy đủ (nếu có Lời dẫn)",
        detail:
          "Nếu đã bật tích hợp \"Lời dẫn\", khi tải Word sẽ có thêm 1 checkbox \"Kèm phụ lục Lời " +
          "dẫn\" (mặc định KHÔNG tick) - tick vào sẽ tải bản có thêm phụ lục lời dẫn dắt, tên file " +
          "tự thêm hậu tố \"-day-du-loi-dan\" để không lẫn với bản nộp chuẩn.",
      },
    ],
    notes: [
      "Các phụ lục (Phiếu học tập, Tin nhắn phụ huynh, Checklist NL-PC, Bài tập phân hoá, Slide Outline) luôn được đặt SAU khung 4 mục chuẩn, không chèn xen vào giữa - không ảnh hưởng cấu trúc mà Ban Giám hiệu quen duyệt.",
      "Riêng \"Lời dẫn\" mặc định KHÔNG xuất hiện trong file Word tải về, kể cả khi đã bật tích hợp lúc soạn - phải tự tick thêm ở bước tải, để tránh nộp nhầm bản có lời dẫn cho Ban Giám hiệu.",
      "\"Slide Outline\" chỉ là dàn ý văn bản (tiêu đề + gạch đầu dòng mỗi slide), KHÔNG tạo ra file PowerPoint thật.",
    ],
    devNotes: {
      summary:
        "File chính: src/data/lessonPlanIntegrations.js (registry 12 tích hợp), src/data/lessonPlanStyles.js (4 phong cách), src/services/lessonPlanDiversityStore.js (chống trùng), src/services/lessonPlanEngine.js + lessonPlanOrchestrator.js, src/data/lessonPlanPromptTemplates.js, src/components/LessonPlanForm.jsx + LessonPlanPreview.jsx, src/services/lessonPlanExportService.js.",
      pointers: [
        "Muốn thêm 1 TÍCH HỢP mới: chỉ cần thêm 1 entry vào LESSON_PLAN_INTEGRATIONS trong lessonPlanIntegrations.js (key + buildPromptFragment + schemaExample) - LessonPlanForm.jsx (checkbox), lessonPlanPromptTemplates.js (chèn prompt + schema), và lessonPlanOrchestrator.js (cảnh báo nếu AI quên trả field) đều TỰ ĐỘNG nhận diện qua listIntegrations()/collectIntegrationSchemaExamples() - không cần sửa 3 file đó. Chỉ cần thêm hiển thị ở LessonPlanPreview.jsx (component *Block mới) và lessonPlanExportService.js (hàm build*Paragraphs mới) nếu muốn phụ lục xuất hiện ở web/Word.",
        "Muốn thêm 1 PHONG CÁCH mới: SỬA CÓ CHỦ Ý - đã CHỐT chỉ 3 preset (Sáng tạo/Nhẹ nhàng/Năng động) + Tự do, có 1 test canh gác (\"test canh gác quyết định\") sẽ FAIL nếu thêm preset thứ 4 mà không cập nhật lại test đó trước - xem test/lessonPlanFixes.test.js.",
        "Cơ chế \"cờ ẩn/hiện khi xuất Word\" (như Lời dẫn) khác với \"luôn xuất hiện khi bật tích hợp\" (như Phiếu học tập) - xem tham số includeTeacherScript trong buildLessonPlanDocxSections()/exportLessonPlanToWord() (lessonPlanExportService.js) làm mẫu nếu cần thêm phụ lục nào đó cũng cần cờ ẩn/hiện riêng lúc xuất.",
      ],
    },
  },

  // ===========================================================================================
  // 2. PHIẾU BÀI TẬP — MODES.WORKSHEET = "worksheet"
  // ===========================================================================================
  {
    id: "worksheet",
    icon: "PencilRuler",
    emoji: "🧮",
    title: "Phiếu bài tập",
    audienceSummary: "Tạo phiếu bài tập Toán (và 1 số dạng Tiếng Việt) cho Mầm non đến Lớp 5, phần lớn không cần AI.",
    description:
      "Tạo phiếu bài tập luyện tập cho Mầm non đến Lớp 5, chủ yếu môn Toán (đã phủ khá đầy đủ " +
      "chương trình SGK Kết nối tri thức từ Lớp 3-5) - phần lớn số liệu được SINH TRỰC TIẾP BẰNG " +
      "CODE (không gọi AI, nên KHÔNG tốn lượt/quota AI), chỉ riêng mục \"Giải toán có lời văn\" mới cần AI.",
    steps: [
      "Chọn Khối lớp và Môn học.",
      "Chọn từng dạng bài muốn đưa vào phiếu + số lượng câu mỗi dạng, HOẶC bấm nhanh 1 \"Gói chủ đề\" (VD \"📏 Độ dài\", \"⏰ Thời gian\") để tự động chọn cả nhóm dạng bài liên quan.",
      "(Tuỳ chọn) Tải lên 1 phiếu bài tập mẫu - hệ thống tự đọc và ÁP DỤNG NGAY cấu trúc (số câu mỗi dạng) theo mẫu, có banner xác nhận + nút đổi lại cấu hình mặc định nếu không ưng.",
      "(Tuỳ chọn) Chọn bố cục hiển thị (1 cột / 2 cột) và bảng màu.",
      "Bấm \"Tạo phiếu bài tập\", xem trước, tải Word (có sẵn bản Giáo viên + bản Học sinh) hoặc \"In / Tải PDF\".",
    ],
    features: [
      {
        name: "Phủ chương trình Toán Lớp 3-5 (SGK Kết nối tri thức)",
        detail:
          "Lớp 3: bảng nhân/chia, đo lường (độ dài/khối lượng/dung tích/nhiệt độ), chu vi-diện tích " +
          "HCN/hình vuông, xem đồng hồ, tiền Việt Nam, thu thập-phân loại số liệu, khả năng xảy ra " +
          "của 1 sự kiện, hình học cơ bản. Lớp 4: góc và đơn vị đo góc, biểu thức chữ, phân số (rút " +
          "gọn/so sánh), giải toán nhiều bước. Lớp 5: số thập phân (so sánh/cộng-trừ-nhân-chia), tỉ " +
          "số phần trăm, tam giác/hình thang/hình tròn, thể tích, diện tích xung quanh-toàn phần, " +
          "số đo thời gian, vận tốc-quãng đường-thời gian.",
      },
      {
        name: "\"Gói chủ đề\" - bấm 1 nút bật cả nhóm dạng bài liên quan (Lớp 1)",
        detail:
          "VD gói \"📏 Độ dài\" tự bật cả 2 dạng bài \"So sánh độ dài\" + \"Sắp xếp độ dài\" cùng " +
          "lúc, xếp cạnh nhau trong phiếu cho liền mạch chủ đề - bấm gói CHỈ CỘNG DỒN vào lựa chọn " +
          "hiện có, không xoá các dạng bài khác bạn đã chọn trước đó.",
      },
      {
        name: "Tự động áp dụng cấu trúc từ phiếu mẫu tải lên",
        detail:
          "Ngay sau khi phân tích xong file mẫu, hệ thống TỰ ĐỘNG đặt lại số câu mỗi dạng bài theo " +
          "đúng mẫu (không cần bấm thêm nút phụ), có banner \"✅ Đã áp dụng cấu trúc từ phiếu mẫu\" " +
          "kèm nút đổi lại cấu hình mặc định nếu bạn muốn.",
      },
      {
        name: "Luôn có sẵn 2 phiên bản: Giáo viên (có đáp án) và Học sinh (để trống)",
        detail:
          "Tải Word ra 2 file cùng lúc - bản Giáo viên có đủ đáp án để chấm nhanh, bản Học sinh chỉ " +
          "có đề bài + ô trống/khung ô ly để làm bài.",
      },
      {
        name: "Bố cục 1 cột / 2 cột + nhiều bảng màu trang trí",
        detail:
          "Chọn số cột hiển thị và 1 trong nhiều bảng màu (xanh, hồng, vàng, cam, xanh lá, tím, " +
          "nâu, đỏ...) - phiếu luôn có khung trang trí kiểu \"tấm thiệp\" nổi trên nền, không phải " +
          "layout in sát mép giấy.",
      },
      {
        name: "Đa số dạng bài KHÔNG cần AI (miễn phí, không tốn lượt)",
        detail:
          "Số liệu được code tự sinh ngẫu nhiên có kiểm soát (đúng phạm vi số theo khối lớp, đáp án " +
          "luôn tính đúng bằng công thức toán học thật) - chỉ riêng \"Giải toán có lời văn\" (nếu " +
          "chọn) mới gọi AI để viết đề bài tự luận.",
      },
    ],
    notes: [
      "Toàn bộ nội dung trong phiếu (trừ ô trống) đều là để in ra giấy cho học sinh viết/tô bằng bút - đây không phải bài tập tương tác bấm-chọn-trên-máy, cả 17 dạng bài đều hoạt động theo đúng nguyên tắc này.",
      "Nếu mở file PDF bằng phần mềm đọc PDF có \"chế độ tối/Night mode\" (VD Foxit), nền có thể hiển thị SAI thành màu đen dù file gốc là nền sáng - đây là do phần mềm đọc PDF đổi màu hiển thị, không phải lỗi của file. Nên kiểm tra lại bằng cách tắt chế độ tối đó hoặc mở bằng trình duyệt.",
      "Khi in/lưu PDF từ trình duyệt, nên chọn mục \"Margins/Lề\" = \"None/Không có\" trong hộp thoại in để không bị cộng dồn lề (CSS phiếu đã tự có lề an toàn 20mm/18mm, không cần trình duyệt thêm lề riêng nữa).",
      "Chưa có chế độ in Đen trắng riêng (bỏ nền màu, giữ khung viền đậm) - đang để dành làm sau, xem NEXT_STEPS.md.",
    ],
    devNotes: {
      summary:
        "File chính: src/data/worksheetSchemas.js (~38 hàm generate*() sinh số liệu), src/data/worksheetExerciseCatalog.js (catalog + minGrade/maxGrade), src/data/worksheetTopicPackages.js (gói chủ đề), src/services/worksheetGenerator.js (orchestrator, DEFAULT_SECTION_ORDER), src/components/WorksheetPreview.jsx (1 Section component/dạng bài), src/services/worksheetExportService.js (1 hàm build*Paragraphs/dạng bài cho Word).",
      pointers: [
        "Muốn thêm 1 DẠNG BÀI mới: nối đủ 4 tầng - (1) worksheetSchemas.js: hàm generateXxx(count), (2) worksheetExerciseCatalog.js: đăng ký entry (minGrade/maxGrade/skillGroup/defaultCount/mascot), (3) worksheetGenerator.js: thêm case trong buildSimpleSection() + vị trí trong DEFAULT_SECTION_ORDER, (4) WorksheetPreview.jsx (component *Section) + worksheetExportService.js (hàm build*Paragraphs). Xem PROJECT_SUMMARY.md các mục \"PHIÊN 13-21\" để có ví dụ đầy đủ từng bước.",
        "Nguyên tắc chống sai số dấu phẩy động khi có số thập phân: LUÔN quy đổi qua số nguyên (nhân 10^width) trước khi cộng/trừ/nhân/chia rồi mới quy đổi ngược - xem numberFormatUtils.js (formatSoTuNhien/formatSoThapPhan) và các hàm generateSoThapPhan*() làm mẫu.",
        "3 QUY TẮC SƯ PHẠM TOÁN LỚP 5 bắt buộc (đã ghi trong code, xem NEXT_STEPS.md mục \"Quy tắc sư phạm bắt buộc\"): cấm hình trụ/hình cầu ở bài diện tích-thể tích, không lặp % 2 câu liên tiếp, không dùng dấu \"=\" hàng ngang cho \"Đặt tính rồi tính\".",
      ],
    },
  },

  // ===========================================================================================
  // 3. ĐỀ TIẾNG VIỆT TIỂU HỌC — MODES.VIETNAMESE_EXAM = "vietnameseExam"
  // ===========================================================================================
  {
    id: "vietnameseExam",
    icon: "BookText",
    emoji: "📖",
    title: "Đề Tiếng Việt Tiểu học",
    audienceSummary: "Tạo đề kiểm tra Tiếng Việt Lớp 1-5 gồm 4 khối: Đọc thành tiếng, Đọc thầm, Chính tả, Tập làm văn.",
    description:
      "Tạo đề kiểm tra môn Tiếng Việt cho Lớp 1-5, đủ 4 khối theo đúng cấu trúc đề thi Tiếng Việt " +
      "Tiểu học thường gặp.",
    steps: [
      "Chọn Khối lớp.",
      "Bấm tạo đề - hệ thống tự soạn đủ 4 khối: A. Đọc thành tiếng, A. Đọc thầm (kèm câu hỏi), B. Chính tả, B. Tập làm văn (đề bài + dàn ý).",
      "Xem trước, tải Word hoặc in.",
    ],
    features: [
      {
        name: "4 khối đề, mỗi khối 1 cách xử lý riêng phù hợp bản chất",
        detail:
          "Đọc thành tiếng: đoạn văn tĩnh có sẵn (không cần AI). Đọc thầm: đoạn văn + câu hỏi do AI " +
          "soạn theo khối lớp. Chính tả: đoạn văn tĩnh (CỐ Ý không dùng AI, tránh vấn đề bản quyền " +
          "và đảm bảo đúng mục tiêu luyện viết chính tả). Tập làm văn: AI chỉ viết đề bài + dàn ý " +
          "gợi ý, KHÔNG viết sẵn 1 bài văn mẫu hoàn chỉnh (tránh học sinh chép nguyên văn).",
      },
    ],
    notes: [
      "Phần Chính tả dùng ngân hàng đoạn văn có sẵn trong code, không phải AI tự sáng tác mỗi lần.",
    ],
    devNotes: {
      summary:
        "File chính: src/data/vietnameseExamBlocks.js (danh bạ 4 khối), src/services/vietnameseExamOrchestrator.js (điều phối), src/services/vietnameseBlocks/*.js (logic riêng từng khối), src/components/vietnameseBlocks/*.jsx (hiển thị riêng từng khối), src/components/VietnameseExamPreview.jsx.",
      pointers: [
        "Mỗi khối tự chứa trong 1 cặp file services/vietnameseBlocks/*.js + components/vietnameseBlocks/*.jsx riêng - muốn thêm 1 khối mới thì làm theo đúng khuôn của 1 trong 4 khối hiện có, không sửa chung 1 file lớn.",
      ],
    },
  },

  // ===========================================================================================
  // 4. ĐỀ CƯƠNG ÔN TẬP — MODES.OUTLINE = "outline"
  // ===========================================================================================
  {
    id: "outline",
    icon: "Compass",
    emoji: "🧭",
    title: "Đề cương Ôn tập",
    audienceSummary: "Soạn đề cương ôn tập theo \"3 Trụ cột\": Kiến thức cốt lõi, Dạng bài + bài mẫu, Ngân hàng bài tập 3 mức.",
    description:
      "Soạn 1 bộ đề cương ôn tập gộp NHIỀU chương/bài SGK cùng lúc (khác Giáo án - luôn chỉ 1 bài), " +
      "có cấu trúc \"3 Trụ cột\" rõ ràng, kèm nhiều phụ lục hỗ trợ học sinh tự học ở nhà.",
    steps: [
      "Chọn Môn học, Khối lớp, Tập (nếu SGK có chia tập).",
      "Chọn NHIỀU chương/bài muốn ôn - có thể bấm nhanh \"Học kỳ I\" / \"Học kỳ II\" / \"Cả năm\" để chọn nhanh 1 nhóm chương (chỉ là gợi ý chia tạm, bạn vẫn tự chỉnh tay được).",
      "Nhập số bài mong muốn cho từng mức: Cơ bản / Nâng cao / Vận dụng cao.",
      "Nhập Số ngày ôn tập (dùng để tạo \"Lộ trình Ôn tập\" theo checklist từng ngày).",
      "(Tuỳ chọn) Nhập Yêu cầu đặc biệt.",
      "Bấm tạo, xem trước, tải Word (2 bản: Học sinh và Giáo viên-Phụ huynh).",
    ],
    features: [
      {
        name: "Cấu trúc \"3 Trụ cột\"",
        detail:
          "Trụ cột 1 (Kiến thức cốt lõi - lý thuyết tóm tắt), Trụ cột 2 (Dạng bài + Bài mẫu có lời " +
          "giải chi tiết, kèm góc \"⚠️ Lỗi sai thường gặp\" ngay dưới mỗi bài mẫu), Trụ cột 3 (Ngân " +
          "hàng bài tập tự luyện, chia đúng 3 mức Cơ bản/Nâng cao/Vận dụng cao).",
      },
      {
        name: "Thư ngỏ gửi Phụ huynh (tự động, chỉ có ở bản Giáo viên-Phụ huynh)",
        detail:
          "1 đoạn thư ngắn gọn, dễ hiểu, tóm tắt nội dung ôn tập và cách phụ huynh có thể hỗ trợ con " +
          "ở nhà - đặt ngay ở ĐẦU file Word (trước cả 3 Trụ cột) để đọc/gửi ngay không cần lật trang.",
      },
      {
        name: "Lộ trình Ôn tập - checklist theo từng ngày",
        detail:
          "Danh sách nhiệm vụ mỗi ngày (☐ Ngày 1: ..., ☐ Ngày 2: ...) theo đúng số ngày bạn nhập, độ " +
          "khó tăng dần qua các ngày (đầu ưu tiên lý thuyết, cuối ưu tiên ôn tổng hợp) - có ở CẢ 2 " +
          "bản Word, đặt ngay sau Thư ngỏ Phụ huynh.",
      },
      {
        name: "Bảng Tự đánh giá (chỉ có ở bản Học sinh, trang cuối)",
        detail:
          "Bảng liệt kê lại từng \"Dạng bài\" đã ôn, học sinh tự chấm mức độ tự tin bằng 3 biểu " +
          "tượng 😃/😐/😥.",
      },
      {
        name: "Phụ lục Đáp án tách riêng trang cuối (chỉ bản Giáo viên-Phụ huynh)",
        detail:
          "Đáp án của Ngân hàng bài tập (Trụ cột 3) KHÔNG in ngay dưới từng câu - gom hết vào 1 " +
          "\"PHỤ LỤC: ĐÁP ÁN\" ở trang cuối tài liệu, tách theo 3 mức, để tránh lộ đáp án câu kế " +
          "tiếp khi phụ huynh dùng bản này cho con tự làm bài.",
      },
    ],
    notes: [
      "Lời giải của \"Bài mẫu\" (Trụ cột 2) LUÔN hiển thị ở CẢ 2 bản (Học sinh và Giáo viên-Phụ huynh) - đây là nội dung DẠY CÁCH LÀM, không phải đáp án cần giấu, khác với đáp án của Ngân hàng bài tập tự luyện (Trụ cột 3) chỉ có ở bản Giáo viên-Phụ huynh.",
      "2 nút \"Học kỳ I/II\" chỉ là quy ước chia tạm danh sách chương làm đôi, KHÔNG PHẢI phân phối chương trình chính thức của trường - bạn nên tự kiểm tra/chỉnh lại danh sách chương sau khi bấm.",
    ],
    devNotes: {
      summary:
        "File chính: src/data/outlineTemplates.js (3 mức, chia học kỳ), src/data/outlinePromptTemplates.js (prompt 3 Trụ cột + các trường mở rộng), src/services/outlineEngine.js + outlineOrchestrator.js, src/services/outlineExportService.js (2 luồng Word riêng), src/components/OutlineForm.jsx + OutlinePreview.jsx.",
      pointers: [
        "Đáp án Bài mẫu (Trụ cột 2) và đáp án Ngân hàng bài tập (Trụ cột 3) dùng 2 CƠ CHẾ ẨN/HIỆN KHÁC NHAU - đã từng là nguồn bug thật (Phiên 8-9, xem PROJECT_SUMMARY.md): buildDangBaiParagraphs() (Trụ cột 2, lời giải LUÔN hiện) không nhận tham số showAnswers nữa, còn buildNganHangBaiTapParagraphs() (Trụ cột 3) không in đáp án inline mà đẩy qua buildAnswerKeyAppendixParagraphs() riêng ở cuối file.",
      ],
    },
  },

  // ===========================================================================================
  // 5. ĐỀ KIỂM TRA — MODES.EXAM = "exam"
  // ===========================================================================================
  {
    id: "exam",
    icon: "FileCheck2",
    emoji: "📝",
    title: "Đề kiểm tra",
    audienceSummary: "Tạo đề kiểm tra theo ma trận đề (số câu × mức độ nhận thức), Lớp 1-12, đủ mọi môn học.",
    description:
      "Tính năng gốc, đầy đủ và ổn định nhất của hệ thống - tạo đề kiểm tra theo ĐÚNG ma trận đề " +
      "(chọn số câu cho từng ô \"Chương × Mức độ nhận thức\"), hỗ trợ Lớp 1-12, có công thức Toán/" +
      "Lý/Hoá hiển thị đẹp (LaTeX), có thể xuất 4 mã đề khác nhau từ cùng 1 đề gốc.",
    steps: [
      "Chọn Môn học, Khối lớp.",
      "Chọn Chương/Bài (lấy từ kho kiến thức SGK) để đề bám sát đúng nội dung đã dạy.",
      "Điền số câu cho từng ô trong \"Ma trận đề\" (mỗi ô = 1 chương × 1 mức độ: Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao).",
      "(Tuỳ chọn) Tải lên 1 đề mẫu tham khảo để bám theo văn phong/độ khó quen thuộc.",
      "Bấm tạo đề, xem trước (có công thức Toán/Lý/Hoá hiển thị đẹp), tải Word hoặc in.",
      "(Tuỳ chọn) Bấm \"Tạo 4 Mã Đề\" để có thêm 4 phiên bản xáo trộn câu hỏi/đáp án (không tốn thêm lượt gọi AI).",
    ],
    features: [
      {
        name: "Ma trận đề chính xác theo mức độ nhận thức",
        detail:
          "Bạn kiểm soát chính xác số câu mỗi mức độ (Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao) " +
          "cho từng chương, đúng yêu cầu kiểm tra định kỳ theo quy định.",
      },
      {
        name: "Công thức Toán/Lý/Hoá hiển thị đẹp (không phải chữ thô)",
        detail:
          "Dùng LaTeX để AI viết công thức, hệ thống tự chuyển thành công thức toán học hiển thị " +
          "đẹp cả trên web lẫn trong file Word (không hiện những ký hiệu $ $ thô).",
      },
      {
        name: "Tạo 4 Mã Đề (A/B/C/D) không tốn thêm lượt AI",
        detail:
          "Xáo trộn thứ tự câu hỏi + thứ tự đáp án trắc nghiệm ngay trên trình duyệt từ đề gốc đã " +
          "có, không cần gọi lại AI nên không tốn thêm lượt trong ngày.",
      },
      {
        name: "3 lớp chống trùng lặp câu hỏi trong 1 lượt tạo",
        detail:
          "Hạn chế tối đa việc AI vô tình sinh 2 câu hỏi nội dung gần giống nhau trong cùng 1 đề.",
      },
      {
        name: "Tải lên đề mẫu tham khảo",
        detail: "Giúp AI bám theo đúng văn phong/độ khó/cách trình bày quen thuộc của trường.",
      },
    ],
    notes: [],
    devNotes: {
      summary:
        "File chính: src/services/geminiEngine.js (3 lớp chống trùng), src/services/examOrchestrator.js, src/data/promptTemplates.js, src/services/latexUtils.js (LaTeX → OMML cho Word), src/components/ExamMatrixForm.jsx + A4LivePreview.jsx, src/services/exportService.js + specificationExportBuilders.js.",
      pointers: [
        "Đây là luồng LÂU ĐỜI NHẤT và có pipeline LaTeX→MathML→OMML - các tab MỚI hơn (Giáo án, Đề cương...) CỐ Ý KHÔNG dùng LaTeX vì không có pipeline này, nên khi thêm quy tắc/prompt liên quan công thức toán, phải xác nhận đúng tab nào có pipeline trước khi copy quy tắc \"$...$\" sang tab khác (đã từng là nguồn bug thật ở Giáo án - xem PROJECT_SUMMARY.md mục 3.1).",
      ],
    },
  },

  // ===========================================================================================
  // 6. NHẬN XÉT HỌC BẠ — MODES.REPORT_COMMENT = "reportComment"
  // ===========================================================================================
  {
    id: "reportComment",
    icon: "ClipboardList",
    emoji: "🗒️",
    title: "Nhận xét học bạ",
    audienceSummary: "Viết nhận xét học bạ cho nhiều học sinh cùng lúc, theo đúng Thông tư 27/2020 hoặc 22/2021.",
    description:
      "Viết nhận xét học bạ (phẩm chất, năng lực, nhận xét chung, từng môn học) cho NHIỀU học sinh " +
      "cùng lúc, đúng đúng khung Thông tư tương ứng cấp học.",
    steps: [
      "Chọn cấp học (Tiểu học dùng Thông tư 27/2020, THCS/THPT dùng Thông tư 22/2021).",
      "Nhập danh sách học sinh (tên, lớp) + thông tin/từ khoá nhận xét cho từng em (có thể nhập tay từng em hoặc nhập hàng loạt qua Excel).",
      "Bấm tạo, xem từng thẻ nhận xét hiện ra, có thể SỬA TRỰC TIẾP trên màn hình nếu muốn chỉnh câu chữ.",
      "Tải Word, Excel, hoặc \"Tải PDF (bản phụ huynh)\", hoặc bấm Sao chép để dán trực tiếp vào phần mềm quản lý học bạ khác.",
    ],
    features: [
      {
        name: "Viết nhận xét cho nhiều học sinh trong 1 lượt",
        detail: "Nhập cả danh sách lớp, hệ thống viết nhận xét riêng cho từng em trong 1 lần tạo.",
      },
      {
        name: "Sửa trực tiếp trên màn hình trước khi tải",
        detail: "Mỗi thẻ nhận xét có thể chỉnh sửa câu chữ ngay tại chỗ, không cần tải Word rồi sửa lại.",
      },
      {
        name: "Nhập hàng loạt qua Excel",
        detail: "Có thể tải lên 1 file Excel danh sách học sinh + ghi chú thay vì gõ tay từng em.",
      },
      {
        name: "4 định dạng xuất: Word, Excel, PDF (bản phụ huynh), Sao chép",
        detail:
          "\"Tải PDF (bản phụ huynh)\" dùng văn phong thư ngỏ thân thiện, khác hẳn khung \"chuẩn Bộ " +
          "GD&ĐT\" dùng cho Đề kiểm tra - phù hợp gửi thẳng cho phụ huynh đọc.",
      },
      {
        name: "Nhớ nhận xét đợt gần nhất của mỗi học sinh trong tối đa 1 giờ",
        detail:
          "Nếu bạn tạo lại nhận xét cho cùng 1 học sinh trong vòng 1 giờ (VD sửa lại ngay sau khi " +
          "vừa tạo), hệ thống có thể tham chiếu bản gần nhất - dữ liệu này tự xoá sau 1 giờ, KHÔNG " +
          "lưu lâu dài để so sánh giữa các kỳ học bạ.",
      },
    ],
    notes: [
      "Lịch sử nhận xét chỉ giữ trong 1 giờ (không phải để so sánh học kỳ trước/sau) - đây là quyết định có chủ đích để đơn giản và an toàn dữ liệu, xem PROJECT_SUMMARY.md mục \"BƯỚC 1, VIỆC #7+#8\".",
    ],
    devNotes: {
      summary:
        "File chính: src/services/reportCommentHistoryStore.js (TTL 1 giờ), src/services/reportCommentExportService.js (buildParentFriendlyReportSections), src/components/ReportCommentPdfView.jsx (khung in riêng, ẩn màn hình - dùng .report-pdf-only CSS), src/components/ReportCommentPreview.jsx.",
      pointers: [
        "⚠️ tailwind.config.js chỉ scan src/app/** và src/components/** - hàm trong src/services/**  KHÔNG ĐƯỢC trả về/định nghĩa class Tailwind (sẽ bị purge mất khi build production). Style của PDF bản phụ huynh phải nằm ở globals.css (CSS thuần) hoặc trong .jsx.",
      ],
    },
  },

  // ===========================================================================================
  // 7. HẠ TẦNG DÙNG CHUNG — không phải 1 tab, chạy ngầm phía sau mọi tab
  // ===========================================================================================
  {
    id: "shared",
    icon: "Settings2",
    emoji: "⚙️",
    title: "Hạ tầng dùng chung (chạy ngầm phía sau mọi tab)",
    audienceSummary: "Đăng nhập, giới hạn lượt tạo/ngày, bộ nhớ đệm phân tích file mẫu, định dạng số kiểu Việt Nam.",
    description:
      "Các cơ chế nền không thuộc riêng 1 tab nào nhưng ảnh hưởng đến TẤT CẢ tab - hữu ích để biết " +
      "khi gặp thông báo lỗi hoặc muốn hiểu vì sao hệ thống hoạt động theo 1 cách nào đó.",
    steps: [],
    features: [
      {
        name: "Đăng nhập / Chế độ công khai",
        detail:
          "Trường có thể bật đăng nhập (mỗi giáo viên 1 tài khoản) hoặc tắt hẳn (ai cũng vào dùng " +
          "được ngay, không cần tài khoản) - tuỳ cấu hình của quản trị viên, không phải giáo viên " +
          "tự chọn được.",
      },
      {
        name: "Giới hạn số lượt tạo/ngày cho mỗi giáo viên",
        detail:
          "Mỗi giáo viên có hạn mức lượt tạo/ngày riêng (mặc định 40 lượt/ngày cho các tính năng " +
          "chính) + hạn mức \"burst\" (tối đa 6 lượt/phút) để tránh spam dồn dập - xem số lượt còn " +
          "lại ở khung \"Lượt dùng hôm nay\" cạnh nút tạo.",
      },
      {
        name: "Trần số lượng mỗi lượt tạo (chống gửi số bất thường lớn)",
        detail:
          "Mỗi lượt tạo có giới hạn tối đa (VD tối đa 60 câu hỏi/đề, tối đa 80 bài/phiếu bài tập, " +
          "tối đa 10 tiết/giáo án) để tránh 1 lượt tạo dùng hết tài nguyên chung của cả trường - " +
          "nếu bạn nhập số vượt trần, hệ thống tự CẮT BỚT về đúng trần và báo cảnh báo, KHÔNG từ chối cả lượt tạo.",
      },
      {
        name: "Bộ nhớ đệm khi phân tích file mẫu (tránh gọi AI lặp lại)",
        detail:
          "Khi tải lên cùng 1 file mẫu (đề/phiếu bài tập/giáo án) nhiều lần, hệ thống nhận diện file " +
          "trùng và dùng lại kết quả phân tích cũ (trong vòng 24 giờ) thay vì gọi AI phân tích lại " +
          "từ đầu - giúp tiết kiệm hạn mức lượt dùng trong ngày.",
      },
      {
        name: "Định dạng số kiểu Việt Nam",
        detail:
          "Số tự nhiên từ 4 chữ số trở lên luôn có dấu chấm phân cách hàng nghìn (VD 63880 → " +
          "63.880), số thập phân dùng dấu phẩy (VD 15,6 thay vì 15.6), đơn vị đo có số mũ dùng ký " +
          "hiệu Unicode thật (km², cm³) - áp dụng nhất quán ở mọi nơi có số liệu.",
      },
    ],
    notes: [],
    devNotes: {
      summary:
        "File chính: src/services/authService.js + apiAuth.js (đăng nhập/DISABLE_LOGIN), src/services/teacherGenerateRateLimiter.js + sampleAnalyzeRateLimiter.js (rate-limit), src/services/contentGenerationLimits.js (trần số lượng/lượt, đều chỉnh qua biến môi trường), src/services/*SampleCache.js (bộ nhớ đệm phân tích mẫu), src/services/numberFormatUtils.js (định dạng số).",
      pointers: [
        "Trần số lượng mỗi lượt tạo đều đọc qua biến môi trường (EXAM_MAX_*, WORKSHEET_MAX_*, LESSON_PLAN_MAX_SO_TIET, OUTLINE_MAX_*) - xem .env.local.example để biết đầy đủ tên biến và giá trị mặc định, đổi số không cần sửa code/redeploy lại logic, chỉ cần đổi biến môi trường trên Vercel.",
        "=== CÁCH THÊM 1 TAB CHỨC NĂNG MỚI (như tab Hướng dẫn sử dụng này) ===\n" +
          "1) Thêm 1 giá trị mới vào hằng số MODES trong src/app/page.js.\n" +
          "2) Thêm 1 nút bấm chuyển tab (copy đúng khuôn 1 nút cũ, đổi label/mode).\n" +
          "3) Thêm 1 nhánh điều kiện `mode === MODES.XXX` trong phần render - nếu tab MỚI cần layout " +
          "2 cột trái-phải (Form + Preview) như 6 tab cũ thì đặt trong <aside>/<section> theo đúng " +
          "khuôn; nếu tab chỉ hiển thị nội dung tĩnh không cần Form/AI (như tab Hướng dẫn) thì render " +
          "TOÀN CHIỀU RỘNG, bỏ qua <aside>, không cần đụng đến id=\"print-area\"/UsageWidget.\n" +
          "4) Nếu tab mới CÓ gọi AI: làm theo đúng khuôn kiến trúc 7 tầng đã nêu ở mục \"Tổng quan\" " +
          "phía trên (Form → Blueprint → API route → Orchestrator → Engine → PromptTemplates → " +
          "Preview/Export).",
        "=== FILE NÀY (helpGuideContent.js) LÀ VÍ DỤ CỤ THỂ ===\n" +
          "Tab \"Hướng dẫn sử dụng\" (MODES.HELP) đã áp dụng đúng bước (3) ở trên: KHÔNG dùng layout " +
          "2 cột, không gọi AI, không có id=\"print-area\" riêng (không cần in) - chỉ render " +
          "HelpGuideView.jsx đọc dữ liệu từ chính file này. Khi thêm/sửa 1 tính năng bất kỳ ở nơi " +
          "khác trong app, NÊN cập nhật luôn đúng mục tương ứng trong file này (thêm feature mới " +
          "vào mảng `features`, ghi chú giới hạn mới vào `notes`...) như 1 bước trong quy trình " +
          "hoàn thành việc đó, giống cách PROJECT_SUMMARY.md/NEXT_STEPS.md vẫn được cập nhật.",
      ],
    },
  },
];

// Danh sách rút gọn dùng cho mục lục/tìm nhanh trong HelpGuideView.jsx (id + title + emoji) -
// tách riêng để component không phải map lại toàn bộ GUIDE_SECTIONS chỉ để lấy 3 trường này.
export const GUIDE_TOC = GUIDE_SECTIONS.map((s) => ({ id: s.id, title: s.title, emoji: s.emoji }));
