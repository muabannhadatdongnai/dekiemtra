import { generateContentWithFailover } from "./geminiKeyPool";
import {
  WORKSHEET_GRADES,
  generateTinhNham,
  generateDemVaVietSo,
  generateSoSanh,
  generateDaySo,
  generateNoiPhepTinh,
  generateNhanDienHinh,
} from "@/data/worksheetSchemas";

/**
 * worksheetGenerator.js
 * "Phiếu bài tập" Mầm non - Lớp 2. Đa số dạng bài sinh HOÀN TOÀN bằng code (xem
 * worksheetSchemas.js) - không gọi AI, không tốn credit, không lo tính sai. CHỈ dạng
 * "giải toán có lời văn" cần gọi AI (1 lần cho cả phiếu) vì cần biến hoá ngôn ngữ tự nhiên.
 */

const WORD_PROBLEM_MODEL = "gemini-3.5-flash";

function buildWordProblemPrompt({ gradeLabel, maxNumber, count, includeAnswers }) {
  return `
Bạn là giáo viên Tiểu học Việt Nam giàu kinh nghiệm, soạn bài toán có lời văn cho học sinh ${gradeLabel}.

YÊU CẦU:
- Soạn ĐÚNG ${count} bài toán có lời văn, mức độ 1 PHÉP TÍNH duy nhất (cộng hoặc trừ), số liệu trong
  phạm vi 0-${maxNumber}, kết quả không âm.
- Bối cảnh gần gũi, đa dạng (đồ chơi, hoa quả, con vật, sách vở...), MỖI bài 1 bối cảnh khác nhau.
- Ngôn ngữ đơn giản, câu ngắn, đúng lứa tuổi.
- Số liệu "đẹp" (số nguyên, kết quả tròn, dễ tính nhẩm).
${includeAnswers ? "- Kèm đáp số cuối cùng cho mỗi bài." : ""}

Trả về JSON đúng schema (không thêm trường khác):
{
  "problems": [
    { "content": "Đề bài toán có lời văn"${includeAnswers ? ', "answer": "Đáp số ngắn gọn, có đơn vị"' : ""} }
  ]
}
`.trim();
}

async function generateWordProblems({ grade, count, includeAnswers }) {
  if (count <= 0) return [];
  const gradeConfig = WORKSHEET_GRADES[grade];
  const prompt = buildWordProblemPrompt({
    gradeLabel: gradeConfig.label,
    maxNumber: gradeConfig.maxNumber,
    count,
    includeAnswers,
  });

  try {
    const result = await generateContentWithFailover({
      model: WORD_PROBLEM_MODEL,
      contents: prompt,
      config: { temperature: 0.85, responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(result.text);
    const problems = Array.isArray(parsed.problems) ? parsed.problems : [];
    return problems.slice(0, count);
  } catch (err) {
    console.error("[worksheetGenerator] Lỗi sinh bài toán có lời văn:", err.message);
    return []; // lỗi AI không làm hỏng cả phiếu - các dạng bài khác (code sinh) vẫn có đủ
  }
}

/**
 * Sinh toàn bộ phiếu bài tập theo cấu hình giáo viên chọn.
 * @param config { grade, includeAnswers, exerciseCounts: { tinh_nham, dem_va_viet_so, so_sanh,
 *   day_so, noi_phep_tinh, giai_toan, nhan_dien_hinh } } - số lượng từng dạng, 0 = không chọn
 */
export async function generateWorksheet({ grade, includeAnswers = false, exerciseCounts }) {
  if (!WORKSHEET_GRADES[grade]) throw new Error(`Khối lớp không hợp lệ: ${grade}`);

  const sections = [];

  if (exerciseCounts.tinh_nham > 0) {
    sections.push({ type: "tinh_nham", title: "Tính nhẩm.", items: generateTinhNham(grade, exerciseCounts.tinh_nham) });
  }
  if (exerciseCounts.dem_va_viet_so > 0) {
    sections.push({
      type: "dem_va_viet_so",
      title: "Đếm và viết số thích hợp vào ô trống.",
      items: generateDemVaVietSo(grade, exerciseCounts.dem_va_viet_so),
    });
  }
  if (exerciseCounts.so_sanh > 0) {
    sections.push({
      type: "so_sanh",
      title: "So sánh. Điền dấu >, <, = thích hợp.",
      items: generateSoSanh(grade, exerciseCounts.so_sanh),
    });
  }
  if (exerciseCounts.day_so > 0) {
    sections.push({
      type: "day_so",
      title: "Viết số thích hợp vào ô trống.",
      items: generateDaySo(grade, exerciseCounts.day_so),
    });
  }
  if (exerciseCounts.noi_phep_tinh > 0) {
    sections.push({
      type: "noi_phep_tinh",
      title: "Nối phép tính với kết quả đúng.",
      data: generateNoiPhepTinh(grade, exerciseCounts.noi_phep_tinh),
    });
  }
  if (exerciseCounts.nhan_dien_hinh > 0) {
    sections.push({
      type: "nhan_dien_hinh",
      title: "Bé nhận biết hình và tô màu.",
      shapes: generateNhanDienHinh(exerciseCounts.nhan_dien_hinh),
    });
  }
  if (exerciseCounts.giai_toan > 0) {
    const problems = await generateWordProblems({ grade, count: exerciseCounts.giai_toan, includeAnswers });
    sections.push({ type: "giai_toan", title: "Giải bài toán.", items: problems });
  }

  return { sections };
}
