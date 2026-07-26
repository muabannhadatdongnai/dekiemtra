import { generateFullExam } from "./geminiEngine";
import { getGradeProfile } from "@/data/gradeProfiles";
import { getSubjectProfile } from "@/data/subjectProfiles";

/**
 * examOrchestrator.js
 * C2 (Phần B - Ý 1 "Router theo khối/họ"): lớp điều phối đứng giữa route.js và geminiEngine.js.
 *
 * Vì sao thêm lớp này (thay vì route.js gọi thẳng generateFullExam như trước)?
 * - Đây là nơi DUY NHẤT tra cứu gradeProfile (khối) + subjectProfile (môn) rồi quyết định cấu
 *   hình cuối cùng trước khi build prompt - "thay thế cho ý tưởng router riêng từng khối" mà
 *   KHÔNG cần nhân bản route theo từng khối×môn (xem B1 trong ROADMAP_TIEP_THEO.md).
 * - Dọn đường cho C4-C6 (đề mẫu - sampleExamSpec): khi nối luồng phân tích đề mẫu vào luồng tạo
 *   đề chính, CHỈ cần sửa file này (đọc sampleExamSpec từ cache, gộp vào tham số gọi geminiEngine)
 *   - KHÔNG phải sửa lại route.js lần nữa.
 * - Vì generateFullExam ở geminiEngine.js gọi buildExamPrompt (đã tự tra gradeProfile bên trong
 *   promptTemplates.js kể từ C1) NÊN orchestrator không tính lại phần "guidance" đó - orchestrator
 *   chỉ xử lý các quyết định Ở TẦNG TRÊN prompt, việc mà bản thân promptTemplates.js không tự biết
 *   (ví dụ: một tuỳ chọn từ UI có thực sự hợp lý với khối đã chọn hay không).
 *
 * Quyết định đầu tiên đưa vào orchestrator (C2): tự động BỎ QUA "useVisualQuestions" nếu khối đã
 * chọn thuộc Họ B (Lớp 6-12, allowVisual=false) - dù giáo viên có lỡ để tick chọn (mặc định BẬT
 * trong ExamMatrixForm.jsx, giáo viên đổi Lớp nhưng quên tắt lại). Trước C2, hệ thống vẫn gửi
 * VISUAL_TYPE_PROMPT_GUIDE cho AI dù đang ra đề Lớp 6-12 - không sai nghiêm trọng (AI vẫn ra đề
 * text bình thường vì Họ B không có chương trình phù hợp cho các visualType hiện có) nhưng lãng
 * phí token vô ích. Có cảnh báo (warning) rõ ràng để giáo viên biết vì sao, không âm thầm đổi.
 */
export async function orchestrateExamGeneration({
  grade,
  subject,
  chaptersInfo,
  chapterMatrix,
  typeByLevel,
  includeAnswers,
  useVisualQuestions,
  existingQuestions,
}) {
  const gradeProfile = getGradeProfile(grade);
  const subjectProfile = getSubjectProfile(subject);

  const orchestratorWarnings = [];
  let effectiveUseVisualQuestions = useVisualQuestions;

  if (useVisualQuestions && !gradeProfile.allowVisual) {
    effectiveUseVisualQuestions = false;
    orchestratorWarnings.push(
      `Câu hỏi trực quan chỉ áp dụng cho Mầm non - Lớp 5 (Họ A). Lớp ${grade} thuộc Họ B nên ` +
        `hệ thống đã tự động bỏ qua tuỳ chọn "câu hỏi trực quan" cho lượt tạo đề này.`
    );
  }

  const { questions, teacherRubric, warnings } = await generateFullExam({
    grade,
    subject,
    chaptersInfo,
    chapterMatrix,
    typeByLevel,
    includeAnswers,
    useVisualQuestions: effectiveUseVisualQuestions,
    existingQuestions,
  });

  return {
    questions,
    teacherRubric,
    warnings: [...orchestratorWarnings, ...warnings],
    // Trả kèm 2 profile đã tra cứu - route.js hiện chưa cần dùng, nhưng để sẵn cho C6 (UI chọn
    // chế độ Theo chương/Theo đề mẫu/Kết hợp) tránh phải tra cứu lại lần 2 ở tầng route.
    gradeProfile,
    subjectProfile,
  };
}
