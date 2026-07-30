import { generateFullExam } from "./geminiEngine";
import { getGradeProfile } from "@/data/gradeProfiles";
import { getSubjectProfile } from "@/data/subjectProfiles";
import { isUsableSampleExamSpec } from "@/data/sampleExamSchema";
import { getBankEntries, appendBankEntries } from "./questionBankStore";

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
 * Quyết định #3 (ngân hàng câu hỏi bền vững): TRƯỚC khi tạo, đọc thêm các câu hỏi đã lưu từ
 * NHỮNG LẦN TẠO TRƯỚC ĐÓ (`getBankEntries`, xem questionBankStore.js) cho đúng các chương đang
 * tạo, gộp vào existingQuestions để 3 lớp chống trùng trong geminiEngine.js coi những câu đó
 * như "đã tồn tại" - không chỉ chống trùng TRONG 1 lần tạo như trước, mà XUYÊN SUỐT NHIỀU LẦN
 * tạo đề khác nhau (kể cả sau khi đóng app / deploy lại). SAU khi tạo xong, lưu các câu MỚI
 * (đã qua chống trùng) trở lại ngân hàng (`appendBankEntries`) để lần tạo SAU nữa lại chống
 * trùng được với lần này. Lỗi ở bước đọc/ghi ngân hàng KHÔNG BAO GIỜ làm hỏng việc tạo đề
 * (xem try/catch nuốt lỗi ngay trong questionBankStore.js) - luồng chính (tạo đề) luôn ưu
 * tiên hơn luồng phụ (ghi nhớ để chống trùng dài hạn).
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

  // Đọc câu hỏi đã lưu từ NHỮNG LẦN TẠO TRƯỚC (ngân hàng bền vững) cho đúng các chương đang
  // tạo, gộp với existingQuestions của phiên hiện tại (client gửi lên, nếu có).
  const bankEntries = await getBankEntries({
    subject,
    grade,
    chapterIds: Object.keys(chapterMatrix),
  });
  const mergedExistingQuestions = [...(existingQuestions || []), ...bankEntries];

  const { questions, teacherRubric, warnings } = await generateFullExam({
    grade,
    subject,
    chaptersInfo,
    chapterMatrix,
    typeByLevel,
    includeAnswers,
    useVisualQuestions: effectiveUseVisualQuestions,
    existingQuestions: mergedExistingQuestions,
    sampleMode: effectiveSampleMode,
    sampleExamSpec: effectiveSampleExamSpec,
  });

  // Lưu lại các câu MỚI vừa tạo (đã qua chống trùng) vào ngân hàng bền vững, để lần tạo SAU
  // (dù cách xa hàng tuần/tháng) vẫn chống trùng được với lần này. Await (không "fire-and-
  // forget") vì hàm serverless có thể bị dừng ngay sau khi trả response - not-awaited work
  // dễ bị cắt ngang giữa chừng trên Vercel, mất dữ liệu ghi.
  await appendBankEntries({ subject, grade, questions });

  return {
    questions,
    teacherRubric,
    warnings: [...orchestratorWarnings, ...warnings],
    gradeProfile,
    subjectProfile,
  };
}
