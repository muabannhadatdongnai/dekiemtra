/**
 * lessonPlanPromptTemplates.js
 * Dựng prompt cho AI soạn "Kế hoạch bài dạy" (giáo án) - tái dùng subjectProfiles.js (vai trò AI
 * theo môn) giống promptTemplates.js bên đề thi, nhưng schema JSON đầu ra khác hẳn (giáo án
 * không phải câu hỏi thi).
 *
 * Nguồn kiến thức: TÁI DÙNG NGUYÊN VẸN kho Markdown SGK đã có (githubService.js) - giáo án và đề
 * kiểm tra CÙNG đọc 1 nguồn duy nhất, đảm bảo nội dung nhất quán giữa 2 tính năng. Với Mầm non
 * (không có "chương SGK"), bỏ qua bước tải Markdown, chỉ dựa vào "Nội dung cốt lõi" giáo viên gõ
 * + kiến thức chung về Chương trình Giáo dục Mầm non.
 */

import { getSubjectProfile } from "./subjectProfiles";
import { getCircularForGrade, isPreschoolGrade, STANDARD_ACTIVITIES } from "./lessonPlanTemplates";
import { buildIntegrationsPromptBlock, collectIntegrationSchemaExamples } from "./lessonPlanIntegrations";

export const LESSON_PLAN_MODEL = "gemini-3.5-flash"; // đồng bộ FREE_TIER_MODEL bên promptTemplates.js

function buildActivitySchemaBlock() {
  return STANDARD_ACTIVITIES.map(
    (a) => `      { "ten": "${a.label}", "mucTieu": "...", "tienTrinh": [ { "hoatDongGVHS": "...", "sanPhamDuKien": "..." } ] }`
  ).join(",\n");
}

const NUMBERING_STYLE_LABELS = {
  buoc_so_va_abcd: 'có đủ cả "Bước 1/2/3..." và tiểu mục "a)/b)/c)..."',
  chi_buoc_so: 'chỉ đánh số "Bước 1/2/3...", không có tiểu mục a)/b)/c)',
  chi_gach_dau_dong: "chỉ dùng gạch đầu dòng, không đánh số bước",
  khong_ro: "không có cấu trúc bước rõ ràng",
};

/**
 * buildLessonPlanSampleGuidance()
 * Đúng tinh thần buildSampleExamGuidance() bên promptTemplates.js (đề kiểm tra): mô tả CÁCH
 * TRÌNH BÀY của giáo án mẫu giáo viên upload, KHÔNG chèn nội dung bài học cụ thể của mẫu vào đây
 * (xem nguyên tắc an toàn đầy đủ trong lessonPlanSampleSchema.js).
 *
 * 2 chế độ (khớp SAMPLE_MODES phía LessonPlanForm.jsx):
 *  - "theo_mau": ƯU TIÊN bám sát cấu trúc/cách trình bày của mẫu hơn khung CV2345/5512 mặc định.
 *  - "ket_hop": áp dụng cách trình bày của mẫu NHƯNG vẫn giữ đủ khung mục I-IV chuẩn + vẫn ưu
 *    tiên bám sát SGK (sourceMarkdown) cho phần NỘI DUNG - mẫu chỉ ảnh hưởng HÌNH THỨC.
 * "theo_chuong"/null: không dùng mẫu, giữ nguyên hành vi cũ (trả về "").
 */
function buildLessonPlanSampleGuidance(sampleMode, sampleSpec, referenceText) {
  if (!sampleMode || sampleMode === "theo_chuong" || !sampleSpec) return "";

  const parts = [];
  if (sampleSpec.sectionHeadings?.length) {
    parts.push(`- Thứ tự các đề mục lớn trong mẫu: ${sampleSpec.sectionHeadings.join(" → ")}`);
  }
  if (sampleSpec.numberingStyle && NUMBERING_STYLE_LABELS[sampleSpec.numberingStyle]) {
    parts.push(`- Cách đánh số các bước trong mẫu: ${NUMBERING_STYLE_LABELS[sampleSpec.numberingStyle]}`);
  }
  if (typeof sampleSpec.useTwoColumnTable === "boolean") {
    parts.push(
      sampleSpec.useTwoColumnTable
        ? "- Mẫu trình bày phần hoạt động dạy học dạng BẢNG 2 cột (Hoạt động GV-HS / Sản phẩm dự kiến)."
        : "- Mẫu trình bày phần hoạt động dạy học liền mạch, KHÔNG dùng bảng 2 cột."
    );
  }
  if (sampleSpec.headerInfoHints) parts.push(`- Thông tin đầu trang trong mẫu: ${sampleSpec.headerInfoHints}`);
  if (sampleSpec.presentationNotes) parts.push(`- Ghi chú trình bày khác: ${sampleSpec.presentationNotes}`);
  if (parts.length === 0) return "";

  const priorityNote =
    sampleMode === "theo_mau"
      ? "Hãy ƯU TIÊN bám sát CÁCH TRÌNH BÀY của giáo án mẫu này hơn khung mục mặc định đã nêu ở trên " +
        "(vẫn giữ đủ nội dung yêu cầu chuyên môn, chỉ đổi HÌNH THỨC trình bày cho khớp mẫu)."
      : "Hãy áp dụng CÁCH TRÌNH BÀY của giáo án mẫu này (đánh số, bố cục, thông tin đầu trang) NHƯNG " +
        "vẫn giữ đủ khung mục I-IV chuẩn đã nêu ở trên, và vẫn ưu tiên bám sát NGUỒN TÀI LIỆU SGK cho " +
        "phần nội dung kiến thức (mẫu chỉ ảnh hưởng hình thức, không thay thế nguồn kiến thức).";

  const referenceBlock =
    sampleMode === "theo_mau" && referenceText
      ? `\n\nĐOẠN TRÍCH THAM KHẢO CÁCH HÀNH VĂN TỪ GIÁO ÁN MẪU (chỉ để cảm nhận VĂN PHONG/CÁCH DIỄN ĐẠT,\nTUYỆT ĐỐI KHÔNG chép lại nguyên văn bất kỳ câu nào, không dùng lại nội dung bài học cụ thể trong\nđoạn này cho bài dạy MỚI đang soạn):\n"""\n${referenceText}\n"""`
      : "";

  return `
CÁCH TRÌNH BÀY GIÁO ÁN MẪU (do giáo viên cung cấp - chế độ "${
    sampleMode === "theo_mau" ? "Bám sát mẫu" : "Kết hợp mẫu + SGK"
  }"):
${parts.join("\n")}
${priorityNote}${referenceBlock}
`;
}

export function buildLessonPlanPrompt({
  tenBai,
  grade,
  subject,
  soTiet = 1,
  noiDungCotLoi = "",
  sourceMarkdown = "", // "" nếu Mầm non hoặc không tải được - vẫn tạo được, chỉ kém bám sát SGK hơn
  chapterLabel = "",
  integrations = [],
  sampleMode = "theo_chuong", // "theo_chuong" | "theo_mau" | "ket_hop"
  sampleSpec = null,
  sampleReferenceText = null,
}) {
  const preschool = isPreschoolGrade(grade);
  const circular = getCircularForGrade(grade);
  const subjectProfile = preschool ? null : getSubjectProfile(subject);
  const gradeLabel = preschool ? "Mầm non" : `Lớp ${grade}`;

  const roleLine = preschool
    ? "BẠN LÀ MỘT CHUYÊN GIA THIẾT KẾ HOẠT ĐỘNG GIÁO DỤC MẦM NON GIÀU KINH NGHIỆM."
    : `BẠN LÀ ${subjectProfile.expertRole.toUpperCase()}, ĐỒNG THỜI LÀ CHUYÊN GIA SOẠN KẾ HOẠCH BÀI DẠY (GIÁO ÁN) THEO ĐÚNG ${circular.label.toUpperCase()}.`;

  const structureRule = preschool
    ? `- Kế hoạch hoạt động Mầm non gồm: Mục tiêu, Chuẩn bị (đồ dùng/học liệu), Tiến trình hoạt động
  (Ổn định - gây hứng thú / Hoạt động trọng tâm / Kết thúc - nhận xét, tuyên dương), sử dụng cùng
  cấu trúc "hoatDong" như schema bên dưới (đặt tên hoạt động phù hợp Mầm non thay vì 4 tên chuẩn
  Tiểu học).`
    : `- Kế hoạch bài dạy PHẢI có đủ 4 hoạt động chuẩn theo Mục III của ${circular.label}: Khởi động,
  Khám phá (Hình thành kiến thức mới), Luyện tập, Vận dụng - đúng tên gọi, đúng thứ tự, không gộp
  hay bỏ bớt hoạt động nào.
- Mục "Yêu cầu cần đạt" PHẢI tách rõ 3 nhóm: Kiến thức, Năng lực (năng lực chung + năng lực đặc thù
  môn học), Phẩm chất - đúng định hướng phát triển năng lực-phẩm chất của chương trình GDPT 2018.`;

  const stepClarityRule = `- Mỗi hoạt động PHẢI chia thành NHIỀU BƯỚC RÕ RÀNG trong mảng "tienTrinh" (hệ thống sẽ tự đánh
  số "Bước 1", "Bước 2"... khi hiển thị/xuất - AI KHÔNG cần tự viết chữ "Bước..." vào đầu
  "hoatDongGVHS", chỉ cần tách đúng ranh giới từng bước). Với hoạt động "Khám phá"/"Luyện tập",
  nên chia theo đúng tinh thần 4 bước quen thuộc: (1) Giao nhiệm vụ, (2) Thực hiện nhiệm vụ,
  (3) Báo cáo - thảo luận, (4) Kết luận - nhận định (có thể gộp bớt với hoạt động ngắn như
  "Khởi động"/"Vận dụng", không bắt buộc đủ 4 bước ở mọi hoạt động).
- Trong nội dung "hoatDongGVHS" của 1 bước, nếu có NHIỀU Ý/THAO TÁC khác nhau (VD giáo viên vừa
  chiếu hình ảnh, vừa đặt câu hỏi, vừa yêu cầu học sinh làm việc nhóm), hãy viết rõ từng ý bằng
  gạch đầu dòng "- " ở đầu mỗi câu (xuống dòng bằng \\n giữa các ý) thay vì viết dồn thành 1 đoạn
  văn dài liền mạch, để giáo viên đọc và làm theo dễ dàng, tương tự cách trình bày giáo án chuẩn
  nộp cho Ban Giám hiệu.`;

  const sourceBlock = sourceMarkdown
    ? `NGUỒN TÀI LIỆU SGK (bám sát nội dung này, KHÔNG bịa kiến thức ngoài chương trình):\n"""\n${sourceMarkdown}\n"""`
    : `⚠️ Không có tài liệu SGK cụ thể được cung cấp cho lượt soạn này - hãy dựa vào "Nội dung cốt lõi"
giáo viên cung cấp bên dưới và kiến thức chuẩn chương trình phổ thông Việt Nam hiện hành.`;

  const integrationsBlock = buildIntegrationsPromptBlock(integrations);
  const sampleGuidanceBlock = buildLessonPlanSampleGuidance(sampleMode, sampleSpec, sampleReferenceText);

  // ⚠️ Trước đây các field do tích hợp thêm vào (VD "mindmap") CHỈ được mô tả bằng lời trong
  // integrationsBlock, KHÔNG xuất hiện trong ví dụ JSON chính bên dưới - khiến AI hay quên trả
  // về field đó dù đã đọc yêu cầu. Giờ nối THẲNG các "schemaExample" của tích hợp đang bật vào
  // đây, để ví dụ JSON luôn phản ánh ĐẦY ĐỦ hình dạng dữ liệu mong muốn (xem
  // collectIntegrationSchemaExamples() trong lessonPlanIntegrations.js).
  const integrationSchemaLines = collectIntegrationSchemaExamples(integrations);
  const integrationSchemaBlock = integrationSchemaLines.length
    ? `,\n  ${integrationSchemaLines.join(",\n  ")}`
    : "";

  const outputSchema = `{
  "tenBai": "${tenBai || "..."}",
  "yeuCauCanDat": { "kienThuc": ["..."], "nangLuc": ["..."], "phamChat": ["..."] },
  "doDungDayHoc": { "giaoVien": ["..."], "hocSinh": ["..."] },
  "hoatDong": [
${buildActivitySchemaBlock()}
  ]${integrationSchemaBlock}
}`;

  return `
${roleLine}

THÔNG TIN BÀI DẠY:
- Tên bài soạn: ${tenBai}
- Cấp/Lớp: ${gradeLabel}
${!preschool ? `- Môn: ${subjectProfile.label}` : ""}
${chapterLabel ? `- Bài/Chương trong SGK: ${chapterLabel}` : ""}
- Số tiết: ${soTiet}
- Nội dung cốt lõi giáo viên yêu cầu: ${noiDungCotLoi || "(không có, tự xác định theo tài liệu/chương trình)"}

QUY TẮC BẮT BUỘC:
${structureRule}
${stepClarityRule}
- Mục "tienTrinh" của mỗi hoạt động là 1 MẢNG các bước, mỗi bước gồm "hoatDongGVHS" (hoạt động cụ
  thể của giáo viên và học sinh) và "sanPhamDuKien" (kết quả/sản phẩm học sinh cần đạt sau bước đó)
  - viết ĐỦ CẢ 2 trường này cho MỌI bước dù giáo viên chọn hiển thị 1 cột hay 2 cột (phía hiển thị
  tự quyết định cách trình bày, AI luôn phải cung cấp đầy đủ dữ liệu).
- Ngôn ngữ: Tiếng Việt chuẩn mực, đúng thuật ngữ sư phạm, phù hợp lứa tuổi ${gradeLabel}.
- Đầu ra CHỈ trả về JSON hợp lệ theo đúng schema, không kèm giải thích, không markdown code fence.
- ⚠️ TUYỆT ĐỐI KHÔNG dùng cú pháp LaTeX (KHÔNG dùng dấu $...$, $$...$$, và KHÔNG dùng dấu ngã "~"
  để ngăn cách chữ số) ở BẤT KỲ đâu trong giáo án, kể cả khi ví dụ/số liệu liên quan đến Toán học.
  Đây là giáo án dùng để đọc/in trực tiếp (không qua công cụ hiển thị công thức), nên MỌI số liệu
  và công thức phải viết bằng CHỮ SỐ VÀ KÝ HIỆU TOÁN HỌC THÔNG THƯỜNG (VD: viết "504 842" hoặc
  "504.842", KHÔNG viết "$504~842$"; viết "3 + 4 = 7", KHÔNG viết "$3 + 4 = 7$").
${!preschool && subjectProfile ? `\nQUY TẮC RIÊNG MÔN ${subjectProfile.label.toUpperCase()} (LƯU Ý: mục dưới đây có thể nhắc tới LaTeX vì\nvốn được viết cho phần ra ĐỀ KIỂM TRA - khi soạn GIÁO ÁN vẫn áp dụng các quy tắc nội dung/số liệu\nbên dưới nhưng BỎ QUA hoàn toàn phần yêu cầu dùng LaTeX, luôn viết số liệu/công thức bằng ký hiệu\nthông thường như quy tắc bắt buộc ở trên):\n${subjectProfile.extraRules}` : ""}

${sourceBlock}
${integrationsBlock}${sampleGuidanceBlock}
Hãy trả về JSON theo đúng schema sau (không thêm trường nào khác ngoài schema và các trường tích
hợp đã liệt kê ở trên nếu có):
${outputSchema}
`.trim();
}
