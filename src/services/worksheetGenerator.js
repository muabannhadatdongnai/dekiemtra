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
import { pickInstructionVariant, pickMascot, getImplementedCatalogFor } from "@/data/worksheetExerciseCatalog";
import { pickRandomLayout, getLayoutById, pickLayoutFromSampleSpec, pickLayoutWithPreference } from "@/data/worksheetLayoutTemplates";
import { isUsableWorksheetSampleSpec } from "@/data/worksheetSampleSchema";

/**
 * worksheetGenerator.js
 * "Phiếu bài tập" Mầm non - Lớp 2. Đa số dạng bài sinh HOÀN TOÀN bằng code (xem
 * worksheetSchemas.js) - không gọi AI, không tốn credit, không lo tính sai. CHỈ dạng
 * "giải toán có lời văn" cần gọi AI (1 lần cho cả phiếu) vì cần biến hoá ngôn ngữ tự nhiên.
 *
 * ⚠️ GIAI ĐOẠN 0+1 (chống lặp khuôn): mỗi section lấy title + mascot NGẪU NHIÊN từ
 * worksheetExerciseCatalog.js (thay vì 1 câu/1 icon cố định) và cả phiếu được gắn 1 "layout"
 * ngẫu nhiên từ worksheetLayoutTemplates.js. WorksheetPreview.jsx (web) và
 * worksheetExportService.js (Word) đều đã đọc field "layout"/"mascot" này để thực sự đổi
 * màu/mascot/kiểu khung mỗi lần tạo phiếu - không còn 1 bố cục cố định duy nhất như trước.
 */

const WORD_PROBLEM_MODEL = "gemini-3.5-flash";

function buildWordProblemPrompt({ gradeLabel, maxNumber, count, includeAnswers, referenceContext }) {
  return `
Bạn là giáo viên Tiểu học Việt Nam giàu kinh nghiệm, soạn bài toán có lời văn cho học sinh ${gradeLabel}.

YÊU CẦU:
- Soạn ĐÚNG ${count} bài toán có lời văn, mức độ 1 PHÉP TÍNH duy nhất (cộng hoặc trừ), số liệu trong
  phạm vi 0-${maxNumber}, kết quả không âm.
- Bối cảnh gần gũi, đa dạng (đồ chơi, hoa quả, con vật, sách vở...), MỖI bài 1 bối cảnh khác nhau.
- Ngôn ngữ đơn giản, câu ngắn, đúng lứa tuổi.
- Số liệu "đẹp" (số nguyên, kết quả tròn, dễ tính nhẩm).
${includeAnswers ? "- Kèm đáp số cuối cùng cho mỗi bài." : ""}
${
  referenceContext
    ? `- GIAI ĐOẠN 2: giáo viên có cung cấp 1 đoạn TÀI LIỆU THAM KHẢO bên dưới (ngữ cảnh) - hãy để ý
  ĐỀ TÀI/CHỦ ĐỀ/TỪ VỰNG xuất hiện trong đó và ưu tiên dùng bối cảnh tương tự cho bài toán, giúp
  bài tập gắn liền với những gì học sinh đang học. TUYỆT ĐỐI KHÔNG chép nguyên văn câu chữ từ tài
  liệu tham khảo, chỉ lấy CẢM HỨNG chủ đề/từ vựng.\n\nTÀI LIỆU THAM KHẢO:\n${referenceContext}`
    : ""
}

Trả về JSON đúng schema (không thêm trường khác):
{
  "problems": [
    { "content": "Đề bài toán có lời văn"${includeAnswers ? ', "answer": "Đáp số ngắn gọn, có đơn vị"' : ""} }
  ]
}
`.trim();
}

async function generateWordProblems({ grade, count, includeAnswers, referenceContext }) {
  if (count <= 0) return [];
  const gradeConfig = WORKSHEET_GRADES[grade];
  const prompt = buildWordProblemPrompt({
    gradeLabel: gradeConfig.label,
    maxNumber: gradeConfig.maxNumber,
    count,
    includeAnswers,
    referenceContext,
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
 * @param config.layoutId  (tuỳ chọn) giáo viên tự chọn 1 layout cụ thể (xem listLayouts() trong
 *   worksheetLayoutTemplates.js). Bỏ trống -> hệ thống tự chọn ngẫu nhiên (hoặc theo sampleSpec
 *   nếu có, xem bên dưới).
 * @param config.previousLayoutId  (tuỳ chọn) layoutId của LẦN TẠO GẦN NHẤT (client tự lưu &
 *   gửi lên) - dùng để tránh random trúng lại đúng layout vừa dùng, cho cảm giác đa dạng hơn
 *   giữa các lần bấm tạo liên tiếp. Bỏ qua nếu đã chỉ định layoutId thủ công.
 * @param config.sampleSpec  (GIAI ĐOẠN 2, tuỳ chọn) spec đã phân tích từ phiếu mẫu giáo viên
 *   upload (xem worksheetSampleAnalyzer.js) - dùng để CHỌN layout gần giống phong cách phiếu
 *   mẫu (qua pickLayoutFromSampleSpec()) thay vì random hoàn toàn. Bỏ qua nếu đã chỉ định layoutId.
 * @param config.referenceContext  (GIAI ĐOẠN 2, tuỳ chọn) đoạn text trích từ tài liệu tham khảo
 *   (SGK/đề cương riêng giáo viên upload) - làm ngữ cảnh chủ đề khi AI soạn "giải toán có lời văn".
 * @param config.favoriteLayoutId  (GIAI ĐOẠN 3, tuỳ chọn) layoutId giáo viên đã lưu làm yêu
 *   thích (xem teacherPreferenceStore.js) - được ưu tiên THẤP HƠN sampleSpec (nếu giáo viên vừa
 *   upload phiếu mẫu ở lần này, ý định "theo phiếu mẫu" rõ ràng hơn ý thích lưu từ trước), và
 *   CHỈ áp dụng CÓ XÁC SUẤT (xem pickLayoutWithPreference()) để không quay lại vấn đề lặp khuôn.
 */
export async function generateWorksheet({
  grade,
  includeAnswers = false,
  exerciseCounts,
  layoutId = null,
  previousLayoutId = null,
  sampleSpec = null,
  referenceContext = null,
  favoriteLayoutId = null,
}) {
  if (!WORKSHEET_GRADES[grade]) throw new Error(`Khối lớp không hợp lệ: ${grade}`);

  let layout;
  if (layoutId) {
    layout = getLayoutById(layoutId) || pickRandomLayout(previousLayoutId);
  } else if (isUsableWorksheetSampleSpec(sampleSpec)) {
    layout = pickLayoutFromSampleSpec(sampleSpec, previousLayoutId);
  } else if (favoriteLayoutId) {
    layout = pickLayoutWithPreference(favoriteLayoutId, previousLayoutId);
  } else {
    layout = pickRandomLayout(previousLayoutId);
  }

  // Ngữ cảnh chủ đề cho bài toán: ưu tiên đoạn text trích thô (referenceContext, chính xác hơn),
  // nếu không có thì dùng themeHints do AI suy luận từ ảnh/PDF scan (kém chi tiết hơn nhưng vẫn
  // hữu ích hơn là không có gì).
  const wordProblemContext = referenceContext || sampleSpec?.themeHints || null;

  const sections = [];

  if (exerciseCounts.tinh_nham > 0) {
    sections.push({
      type: "tinh_nham",
      title: pickInstructionVariant("tinh_nham") || "Tính nhẩm.",
      mascot: pickMascot("tinh_nham"),
      items: generateTinhNham(grade, exerciseCounts.tinh_nham),
    });
  }
  if (exerciseCounts.dem_va_viet_so > 0) {
    sections.push({
      type: "dem_va_viet_so",
      title: pickInstructionVariant("dem_va_viet_so") || "Đếm và viết số thích hợp vào ô trống.",
      mascot: pickMascot("dem_va_viet_so"),
      items: generateDemVaVietSo(grade, exerciseCounts.dem_va_viet_so),
    });
  }
  if (exerciseCounts.so_sanh > 0) {
    sections.push({
      type: "so_sanh",
      title: pickInstructionVariant("so_sanh") || "So sánh. Điền dấu >, <, = thích hợp.",
      mascot: pickMascot("so_sanh"),
      items: generateSoSanh(grade, exerciseCounts.so_sanh),
    });
  }
  if (exerciseCounts.day_so > 0) {
    sections.push({
      type: "day_so",
      title: pickInstructionVariant("day_so") || "Viết số thích hợp vào ô trống.",
      mascot: pickMascot("day_so"),
      items: generateDaySo(grade, exerciseCounts.day_so),
    });
  }
  if (exerciseCounts.noi_phep_tinh > 0) {
    sections.push({
      type: "noi_phep_tinh",
      title: pickInstructionVariant("noi_phep_tinh") || "Nối phép tính với kết quả đúng.",
      mascot: pickMascot("noi_phep_tinh"),
      data: generateNoiPhepTinh(grade, exerciseCounts.noi_phep_tinh),
    });
  }
  if (exerciseCounts.nhan_dien_hinh > 0) {
    sections.push({
      type: "nhan_dien_hinh",
      title: pickInstructionVariant("nhan_dien_hinh") || "Bé nhận biết hình và tô màu.",
      mascot: pickMascot("nhan_dien_hinh"),
      shapes: generateNhanDienHinh(exerciseCounts.nhan_dien_hinh),
    });
  }
  if (exerciseCounts.giai_toan > 0) {
    const problems = await generateWordProblems({
      grade,
      count: exerciseCounts.giai_toan,
      includeAnswers,
      referenceContext: wordProblemContext,
    });
    sections.push({
      type: "giai_toan",
      title: pickInstructionVariant("giai_toan") || "Giải bài toán.",
      mascot: pickMascot("giai_toan"),
      items: problems,
    });
  }

  return { sections, layout };
}

/** Danh sách dạng bài ĐÃ TRIỂN KHAI (source khác "planned") cho 1 khối lớp - để form dựng
 * động danh sách checkbox từ catalog thay vì hard-code EXERCISE_LABELS như trước. */
export function listAvailableExercises(grade, subject = "TOAN") {
  return getImplementedCatalogFor(grade, subject).map(({ key, label, skillGroup, source }) => ({
    key,
    label,
    skillGroup,
    source,
  }));
}
