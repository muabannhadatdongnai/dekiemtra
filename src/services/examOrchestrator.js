import { generateFullExam } from "./geminiEngine";
import { getGradeProfile } from "@/data/gradeProfiles";
import { getSubjectProfile } from "@/data/subjectProfiles";
import { isUsableSampleExamSpec } from "@/data/sampleExamSchema";

/**
 * examOrchestrator.js
 * C2 (Phần B - Ý 1 "Router theo khối/họ"): lớp điều phối đứng giữa route.js và geminiEngine.js.
 *
 * Vì sao thêm lớp này (thay vì route.js gọi thẳng generateFullExam như trước)?
 * - Đây là nơi DUY NHẤT tra cứu gradeProfile (khối) + subjectProfile (môn) rồi quyết định cấu
 *   hình cuối cùng trước khi build prompt - "thay thế cho ý tưởng router riêng từng khối" mà
 *   KHÔNG cần nhân bản route theo từng khối×môn (xem B1 trong ROADMAP_TIEP_THEO.md).
 * - Vì generateFullExam ở geminiEngine.js gọi buildExamPrompt (đã tự tra gradeProfile bên trong
 *   promptTemplates.js kể từ C1) NÊN orchestrator không tính lại phần "guidance" đó - orchestrator
 *   chỉ xử lý các quyết định Ở TẦNG TRÊN prompt, việc mà bản thân promptTemplates.js không tự biết
 *   (ví dụ: một tuỳ chọn từ UI có thực sự hợp lý với khối đã chọn hay không).
 *
 * Quyết định #1 (C2): tự động BỎ QUA "useVisualQuestions" nếu khối đã chọn thuộc Họ B (Lớp
 * 6-12, allowVisual=false) - dù giáo viên có lỡ để tick chọn (mặc định BẬT trong
 * ExamMatrixForm.jsx, giáo viên đổi Lớp nhưng quên tắt lại).
 *
 * Quyết định #2 (C6 - đề mẫu): nếu giáo viên chọn chế độ "theo_de_mau" hoặc "ket_hop" nhưng
 * sampleExamSpec KHÔNG hợp lệ/rỗng (chưa phân tích, phân tích lỗi, hoặc AI trả về spec không
 * có gì hữu ích) - tự động fallback về "theo_chuong" (tạo đề CHỈ theo Ma trận Chương, bỏ qua
 * đề mẫu), KÈM cảnh báo rõ lý do. Đây chính là mục tiêu cốt lõi của Ý 3 đã chốt: "luồng phân
 * tích đề mẫu lỗi/hết quota KHÔNG được làm hỏng cả phiên tạo đề" - luồng tạo đề (bắt buộc) vẫn
 * luôn chạy được dù luồng phân tích mẫu (phụ) có thất bại.
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
  sampleMode = "theo_chuong",
  sampleExamSpec = null,
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

  let effectiveSampleMode = sampleMode;
  let effectiveSampleExamSpec = sampleExamSpec;

  if (sampleMode !== "theo_chuong" && !isUsableSampleExamSpec(sampleExamSpec)) {
    effectiveSampleMode = "theo_chuong";
    effectiveSampleExamSpec = null;
    orchestratorWarnings.push(
      `Không có đề mẫu hợp lệ để áp dụng (chưa phân tích thành công hoặc đề mẫu không đủ thông tin) - ` +
        `hệ thống đã tự động chuyển sang tạo đề CHỈ theo Ma trận Chương, bỏ qua đề mẫu cho lượt tạo đề này.`
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
    sampleMode: effectiveSampleMode,
    sampleExamSpec: effectiveSampleExamSpec,
  });

  return {
    questions,
    teacherRubric,
    warnings: [...orchestratorWarnings, ...warnings],
    gradeProfile,
    subjectProfile,
  };
}
