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
import { buildIntegrationsPromptBlock } from "./lessonPlanIntegrations";

export const LESSON_PLAN_MODEL = "gemini-3.5-flash"; // đồng bộ FREE_TIER_MODEL bên promptTemplates.js

function buildActivitySchemaBlock() {
  return STANDARD_ACTIVITIES.map(
    (a) => `      { "ten": "${a.label}", "mucTieu": "...", "tienTrinh": [ { "hoatDongGVHS": "...", "sanPhamDuKien": "..." } ] }`
  ).join(",\n");
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

  const sourceBlock = sourceMarkdown
    ? `NGUỒN TÀI LIỆU SGK (bám sát nội dung này, KHÔNG bịa kiến thức ngoài chương trình):\n"""\n${sourceMarkdown}\n"""`
    : `⚠️ Không có tài liệu SGK cụ thể được cung cấp cho lượt soạn này - hãy dựa vào "Nội dung cốt lõi"
giáo viên cung cấp bên dưới và kiến thức chuẩn chương trình phổ thông Việt Nam hiện hành.`;

  const integrationsBlock = buildIntegrationsPromptBlock(integrations);

  const outputSchema = `{
  "tenBai": "${tenBai || "..."}",
  "yeuCauCanDat": { "kienThuc": ["..."], "nangLuc": ["..."], "phamChat": ["..."] },
  "doDungDayHoc": { "giaoVien": ["..."], "hocSinh": ["..."] },
  "hoatDong": [
${buildActivitySchemaBlock()}
  ]
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
- Mục "tienTrinh" của mỗi hoạt động là 1 MẢNG các bước, mỗi bước gồm "hoatDongGVHS" (hoạt động cụ
  thể của giáo viên và học sinh) và "sanPhamDuKien" (kết quả/sản phẩm học sinh cần đạt sau bước đó)
  - viết ĐỦ CẢ 2 trường này cho MỌI bước dù giáo viên chọn hiển thị 1 cột hay 2 cột (phía hiển thị
  tự quyết định cách trình bày, AI luôn phải cung cấp đầy đủ dữ liệu).
- Ngôn ngữ: Tiếng Việt chuẩn mực, đúng thuật ngữ sư phạm, phù hợp lứa tuổi ${gradeLabel}.
- Đầu ra CHỈ trả về JSON hợp lệ theo đúng schema, không kèm giải thích, không markdown code fence.
${!preschool && subjectProfile ? `\nQUY TẮC RIÊNG MÔN ${subjectProfile.label.toUpperCase()}:\n${subjectProfile.extraRules}` : ""}

${sourceBlock}
${integrationsBlock}
Hãy trả về JSON theo đúng schema sau (không thêm trường nào khác ngoài schema và các trường tích
hợp đã liệt kê ở trên nếu có):
${outputSchema}
`.trim();
}
