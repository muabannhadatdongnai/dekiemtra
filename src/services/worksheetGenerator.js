import { generateContentWithFailover } from "./geminiKeyPool";
import {
  WORKSHEET_GRADES,
  generateTinhNham,
  generateDemVaVietSo,
  generateSoSanh,
  generateDaySo,
  generateNoiPhepTinh,
  generateNhanDienHinh,
  generateSapXepThuTu,
  generateDemHinhUngDung,
} from "@/data/worksheetSchemas";
import { pickInstructionVariant, pickMascot, getSelectableCatalogFor } from "@/data/worksheetExerciseCatalog";
import { pickRandomLayout, getLayoutById, pickLayoutFromSampleSpec, pickLayoutWithPreference } from "@/data/worksheetLayoutTemplates";
import { isUsableWorksheetSampleSpec } from "@/data/worksheetSampleSchema";
import { ADVANCED_BOOK_MARKER, WORKSHEET_GRADE_TO_SGK_GRADE } from "@/data/constants";
import { fetchMarkdownFromGitHub, fetchAdvancedBook } from "./githubService";

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

const MAX_SGK_CONTEXT_LENGTH = 4000; // khớp MAX_REFERENCE_CONTEXT_LENGTH trong worksheetSampleAnalyzer.js

/**
 * ================== GIAI ĐOẠN 5 (liên kết SGK markdown) ==================
 * Tải nội dung 1 chương/bài SGK (best-effort, KHÔNG làm hỏng cả lượt tạo phiếu nếu lỗi) - TÁI
 * DÙNG đúng nguyên tắc `lessonPlanOrchestrator.js` đã kiểm định (try/catch quanh
 * fetchMarkdownFromGitHub/fetchAdvancedBook, lỗi -> đẩy vào `warnings`, KHÔNG throw). Trả về
 * { context, label, warning } - `context` = null nếu không chọn chương hoặc tải lỗi (luồng gọi
 * vẫn hoạt động bình thường, chỉ là "giải toán có lời văn" sẽ kém bám sát SGK hơn).
 */
async function resolveSgkChapterContext({ grade, sgkVolume, sgkChapterId }) {
  if (!sgkChapterId) return { context: null, label: null, warning: null };

  const sgkGrade = WORKSHEET_GRADE_TO_SGK_GRADE[grade];
  if (!sgkGrade) {
    // Mầm non hoặc khối chưa map -> im lặng bỏ qua, KHÔNG coi là lỗi (UI vốn đã ẩn phần chọn
    // chương SGK cho các khối này, xem WorksheetForm.jsx - nếu vẫn nhận được sgkChapterId ở đây
    // thì có thể do gọi thẳng API bỏ qua form, không tin dữ liệu client tuyệt đối).
    return { context: null, label: null, warning: null };
  }

  try {
    const markdown =
      sgkChapterId === ADVANCED_BOOK_MARKER
        ? await fetchAdvancedBook(sgkGrade, "Toan")
        : await fetchMarkdownFromGitHub(sgkGrade, "Toan", sgkVolume || "1", sgkChapterId);
    const label = sgkChapterId === ADVANCED_BOOK_MARKER ? "Sách nâng cao (toàn bộ)" : `Chương/Bài ${sgkChapterId}`;
    return { context: markdown.slice(0, MAX_SGK_CONTEXT_LENGTH), label, warning: null };
  } catch (err) {
    return {
      context: null,
      label: null,
      warning: `Không tải được tài liệu SGK cho bài đã chọn (${err.message}) - phiếu vẫn được tạo bình thường, nhưng "giải toán có lời văn" có thể kém bám sát SGK hơn.`,
    };
  }
}

// ================== GIAI ĐOẠN 4 MỚI (content-aware theo mẫu thật) ==================
// Thứ tự MẶC ĐỊNH khi KHÔNG có sampleSpec hữu ích (giữ NGUYÊN thứ tự cũ trước đây, để hành vi
// không đổi khi giáo viên không upload mẫu).
const DEFAULT_SECTION_ORDER = [
  "tinh_nham",
  "dem_va_viet_so",
  "so_sanh",
  "day_so",
  "sap_xep_thu_tu",
  "noi_phep_tinh",
  "nhan_dien_hinh",
  "giai_toan",
];

/**
 * TRƯỚC ĐÂY thứ tự khối bài trong phiếu LUÔN CỐ ĐỊNH (DEFAULT_SECTION_ORDER ở trên) bất kể
 * phiếu mẫu giáo viên upload có thứ tự khác - đây là 1 phần nguyên nhân "chỉ bắt chước layout/
 * màu sắc mà không bám theo đề toán mẫu trong ảnh" (phản hồi ban đầu của giáo viên). Giờ nếu
 * `sampleSpec.detectedExercises` hữu ích (xem worksheetSampleAnalyzer.js), các dạng bài VỪA
 * xuất hiện trong mẫu VỪA được giáo viên chọn (safeCounts > 0) sẽ đứng theo ĐÚNG thứ tự xuất
 * hiện trong mẫu; dạng bài nào giáo viên chọn thêm mà KHÔNG có trong mẫu thì xếp SAU CÙNG theo
 * thứ tự mặc định (không bị bỏ sót, chỉ xếp cuối).
 *
 * Áp dụng NGẦM, không cần giáo viên bấm gì thêm - giống cách sampleSpec đã ngầm ảnh hưởng layout/
 * màu sắc từ trước (pickLayoutFromSampleSpec). KHÁC với việc đổi SỐ LƯỢNG câu mỗi dạng
 * (exerciseCounts) - việc đó vẫn cần giáo viên chủ động bấm "Áp dụng cấu trúc từ phiếu mẫu" ở
 * WorksheetForm.jsx, vì ghi đè số liệu giáo viên đang chỉnh tay là hành động "nặng" hơn nhiều so
 * với chỉ đổi thứ tự hiển thị - không nên làm âm thầm.
 */
function computeSectionOrder(safeCounts, sampleSpec) {
  const selectedKeys = DEFAULT_SECTION_ORDER.filter((key) => safeCounts[key] > 0);
  const detectedKeys = isUsableWorksheetSampleSpec(sampleSpec)
    ? (sampleSpec?.detectedExercises || []).map((d) => d.key)
    : [];

  const fromSample = [];
  const seen = new Set();
  for (const key of detectedKeys) {
    if (selectedKeys.includes(key) && !seen.has(key)) {
      fromSample.push(key);
      seen.add(key);
    }
  }
  const remaining = selectedKeys.filter((key) => !seen.has(key));
  return [...fromSample, ...remaining];
}

/** Các dạng bài "đơn giản" (1 khối, không cần async, không cần logic đặc biệt) - tra cứu theo
 * key để dùng trong vòng lặp bên trong generateWorksheet(). "nhan_dien_hinh" (tự động kèm
 * "dem_hinh_ung_dung") và "giai_toan" (cần gọi AI bất đồng bộ + gom answerKeyText) được xử lý
 * RIÊNG trong vòng lặp chính, không nằm trong bảng này. */
function buildSimpleSection(key, { grade, safeCounts, mascotFor }) {
  switch (key) {
    case "tinh_nham":
      return {
        type: "tinh_nham",
        title: pickInstructionVariant("tinh_nham") || "Tính nhẩm.",
        mascot: mascotFor("tinh_nham"),
        items: generateTinhNham(grade, safeCounts.tinh_nham),
      };
    case "dem_va_viet_so":
      return {
        type: "dem_va_viet_so",
        title: pickInstructionVariant("dem_va_viet_so") || "Đếm và viết số thích hợp vào ô trống.",
        mascot: mascotFor("dem_va_viet_so"),
        items: generateDemVaVietSo(grade, safeCounts.dem_va_viet_so),
      };
    case "so_sanh":
      return {
        type: "so_sanh",
        title: pickInstructionVariant("so_sanh") || "So sánh. Điền dấu >, <, = thích hợp.",
        mascot: mascotFor("so_sanh"),
        items: generateSoSanh(grade, safeCounts.so_sanh),
      };
    case "day_so":
      return {
        type: "day_so",
        title: pickInstructionVariant("day_so") || "Viết số thích hợp vào ô trống.",
        mascot: mascotFor("day_so"),
        items: generateDaySo(grade, safeCounts.day_so),
      };
    case "sap_xep_thu_tu":
      return {
        type: "sap_xep_thu_tu",
        title: pickInstructionVariant("sap_xep_thu_tu") || "Sắp xếp các số theo thứ tự từ bé đến lớn.",
        mascot: mascotFor("sap_xep_thu_tu"),
        items: generateSapXepThuTu(grade, safeCounts.sap_xep_thu_tu),
      };
    case "noi_phep_tinh":
      return {
        type: "noi_phep_tinh",
        title: pickInstructionVariant("noi_phep_tinh") || "Nối phép tính với kết quả đúng.",
        mascot: mascotFor("noi_phep_tinh"),
        data: generateNoiPhepTinh(grade, safeCounts.noi_phep_tinh),
      };
    default:
      return null;
  }
}

/**
 * Sinh toàn bộ phiếu bài tập theo cấu hình giáo viên chọn.
 * @param config { grade, includeAnswers, exerciseCounts: { tinh_nham, dem_va_viet_so, so_sanh,
 *   day_so, sap_xep_thu_tu, noi_phep_tinh, giai_toan, nhan_dien_hinh } } - số lượng từng dạng,
 *   0 = không chọn. LƯU Ý: "dem_hinh_ung_dung" KHÔNG nằm trong exerciseCounts - đây là hoạt
 *   động tự động, luôn được thêm kèm khi nhan_dien_hinh > 0 (xem Giai đoạn 2 bên dưới).
 * @param config.layoutId  (tuỳ chọn) giáo viên tự chọn 1 layout cụ thể (xem listLayouts() trong
 *   worksheetLayoutTemplates.js). Bỏ trống -> hệ thống tự chọn ngẫu nhiên (hoặc theo sampleSpec
 *   nếu có, xem bên dưới).
 * @param config.previousLayoutId  (tuỳ chọn) layoutId của LẦN TẠO GẦN NHẤT (client tự lưu &
 *   gửi lên) - dùng để tránh random trúng lại đúng layout vừa dùng, cho cảm giác đa dạng hơn
 *   giữa các lần bấm tạo liên tiếp. Bỏ qua nếu đã chỉ định layoutId thủ công.
 * @param config.sampleSpec  (GIAI ĐOẠN 2, tuỳ chọn) spec đã phân tích từ phiếu mẫu giáo viên
 *   upload (xem worksheetSampleAnalyzer.js) - dùng để CHỌN layout gần giống phong cách phiếu
 *   mẫu (qua pickLayoutFromSampleSpec()) thay vì random hoàn toàn, VÀ (GIAI ĐOẠN 4 MỚI) để sắp
 *   xếp THỨ TỰ khối bài theo đúng mẫu (xem computeSectionOrder() ở trên). Bỏ qua layout nếu đã
 *   chỉ định layoutId.
 * @param config.referenceContext  (GIAI ĐOẠN 2, tuỳ chọn) đoạn text trích từ tài liệu tham khảo
 *   (SGK/đề cương riêng giáo viên upload) - làm ngữ cảnh chủ đề khi AI soạn "giải toán có lời văn".
 * @param config.favoriteLayoutId  (GIAI ĐOẠN 3, tuỳ chọn) layoutId giáo viên đã lưu làm yêu
 *   thích (xem teacherPreferenceStore.js) - được ưu tiên THẤP HƠN sampleSpec (nếu giáo viên vừa
 *   upload phiếu mẫu ở lần này, ý định "theo phiếu mẫu" rõ ràng hơn ý thích lưu từ trước), và
 *   CHỈ áp dụng CÓ XÁC SUẤT (xem pickLayoutWithPreference()) để không quay lại vấn đề lặp khuôn.
 * @param config.sgkVolume, config.sgkChapterId  (GIAI ĐOẠN 5, tuỳ chọn) Tập + Chương/Bài SGK giáo
 *   viên chọn (qua /api/chapters, xem WorksheetForm.jsx) - nội dung chương này được tải server-
 *   side (best-effort, xem resolveSgkChapterContext()) và ưu tiên CAO NHẤT làm ngữ cảnh chủ đề
 *   cho AI soạn "giải toán có lời văn" (cao hơn cả referenceContext từ file mẫu upload, vì đây là
 *   tín hiệu "giáo viên đang dạy đúng bài này" rõ ràng và chính thống hơn). Chỉ áp dụng cho
 *   LOP_1/LOP_2 (Mầm non không có SGK theo chương, xem WORKSHEET_GRADE_TO_SGK_GRADE).
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
  sgkVolume = null,
  sgkChapterId = null,
}) {
  if (!WORKSHEET_GRADES[grade]) throw new Error(`Khối lớp không hợp lệ: ${grade}`);

  // ================== GIAI ĐOẠN 2 (an toàn phía server) ==================
  // WorksheetForm.jsx giờ chỉ hiện đúng dạng bài phù hợp khối lớp (getSelectableCatalogFor),
  // NHƯNG đó là lọc phía CLIENT - ai gọi thẳng /api/generate-worksheet (bỏ qua form) vẫn có thể
  // gửi 1 key không hợp lệ với khối lớp (VD "noi_phep_tinh" cho MAM_NON, catalog khai báo
  // minGrade LOP_1). Lọc lại 1 lần nữa ở đây cho chắc - không tin tưởng dữ liệu từ client.
  const eligibleKeys = new Set(getSelectableCatalogFor(grade).map((item) => item.key));
  const safeCounts = Object.fromEntries(
    Object.entries(exerciseCounts || {}).map(([key, value]) => [key, eligibleKeys.has(key) ? value : 0])
  );

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

  // ================== GIAI ĐOẠN 5 (liên kết SGK markdown) ==================
  const warnings = [];
  const { context: sgkContext, label: sgkLabel, warning: sgkWarning } = await resolveSgkChapterContext({
    grade,
    sgkVolume,
    sgkChapterId,
  });
  if (sgkWarning) warnings.push(sgkWarning);

  // Ngữ cảnh chủ đề cho bài toán: ƯU TIÊN chương SGK giáo viên vừa chọn (sgkContext - tín hiệu
  // "đang dạy đúng bài này" rõ ràng, chính thống nhất), sau đó đến đoạn text trích thô từ file
  // mẫu upload (referenceContext, chính xác nhưng có thể không phải bài đang dạy), cuối cùng mới
  // đến themeHints do AI suy luận từ ảnh/PDF scan (kém chi tiết nhất, chỉ còn hơn không có gì).
  const wordProblemContext = sgkContext || referenceContext || sampleSpec?.themeHints || null;

  // ================== GIAI ĐOẠN 4 ==================
  // Layout "adventure_map" (bản đồ phiêu lưu) được MÔ TẢ là "mascot chính dẫn dắt xuyên suốt
  // phiếu, không đổi mascot giữa chừng" (xem worksheetLayoutTemplates.js) - trước đây mô tả này
  // CHƯA thực sự được code hoá, mỗi khối vẫn random mascot độc lập như các layout khác. Giờ
  // chốt 1 "heroMascot" DUY NHẤT ngay từ đầu và dùng xuyên suốt mọi khối trong phiếu, đúng như
  // lời hứa trong mô tả layout - tạo cảm giác 1 câu chuyện liền mạch thay vì rời rạc.
  const heroMascot = layout.id === "adventure_map" ? pickMascot("tinh_nham") : null;
  function mascotFor(key) {
    return heroMascot || pickMascot(key);
  }

  // ================== GIAI ĐOẠN 4 MỚI (content-aware theo mẫu thật) ==================
  // Xây dựng sections THEO ĐÚNG THỨ TỰ computeSectionOrder() đã tính - KHÁC bản cũ (luôn build
  // theo 1 chuỗi if cố định đúng DEFAULT_SECTION_ORDER, không thể đổi thứ tự dù có sampleSpec).
  const sections = [];
  let answerKeyText = null;

  const orderedKeys = computeSectionOrder(safeCounts, sampleSpec);

  for (const key of orderedKeys) {
    if (key === "nhan_dien_hinh") {
      const shapes = generateNhanDienHinh(safeCounts.nhan_dien_hinh);
      sections.push({
        type: "nhan_dien_hinh",
        title: pickInstructionVariant("nhan_dien_hinh") || "Bé nhận biết hình và tô màu.",
        mascot: mascotFor("nhan_dien_hinh"),
        shapes,
      });

      // ================== GIAI ĐOẠN 2 (sửa bug "Nhận diện hình" đứng trơ trọi) ==================
      // TRƯỚC ĐÂY "Nhận diện hình" là dạng bài DUY NHẤT không có hoạt động ứng dụng đi kèm - chỉ
      // liệt kê hình + tô màu rồi dừng lại, đúng vấn đề giáo viên phản ánh ("chỉ có các hình đó
      // và không có gì khác"). Giờ LUÔN tự động thêm khối "Đếm hình theo yêu cầu" ngay sau, dùng
      // CHUNG danh sách `shapes` vừa sinh ở trên - KHÔNG đọc từ exerciseCounts (không phải ô chọn
      // riêng, xem catalog "dem_hinh_ung_dung" hiddenFromForm:true) nên giáo viên không cần nhớ
      // bật thêm gì, và không thể vô tình bỏ sót hoạt động ứng dụng như bản cũ.
      const demHinh = generateDemHinhUngDung(shapes, Math.min(3, shapes.length));
      sections.push({
        type: "dem_hinh_ung_dung",
        title: pickInstructionVariant("dem_hinh_ung_dung") || "Đếm xem có bao nhiêu hình mỗi loại rồi viết số vào ô trống.",
        mascot: mascotFor("dem_hinh_ung_dung"),
        data: demHinh,
      });
      continue;
    }

    if (key === "giai_toan") {
      const problems = await generateWordProblems({
        grade,
        count: safeCounts.giai_toan,
        includeAnswers,
        referenceContext: wordProblemContext,
      });
      sections.push({
        type: "giai_toan",
        title: pickInstructionVariant("giai_toan") || "Giải bài toán.",
        mascot: mascotFor("giai_toan"),
        items: problems,
      });

      // ================== GIAI ĐOẠN 4 (nội bộ, đã có từ trước) ==================
      // Đáp số các bài "giải toán có lời văn" (CHỈ dạng này cần đáp án dạng câu chữ tự do do AI
      // sinh - các dạng bài code-sinh khác như tính nhẩm/so sánh có đáp số tính trực tiếp từ số
      // liệu, học sinh/phụ huynh tự đối chiếu dễ dàng, không cần QR) -> gộp thành 1 đoạn text
      // ngắn để mã hoá vào QR "chấm nhanh" (xem WorksheetPreview.jsx / worksheetExportService.js).
      if (includeAnswers && problems.some((p) => p.answer)) {
        answerKeyText = problems.map((p, i) => `Bài ${i + 1}: ${p.answer || "?"}`).join("\n");
      }
      continue;
    }

    const section = buildSimpleSection(key, { grade, safeCounts, mascotFor });
    if (section) sections.push(section);
  }

  return { sections, layout, answerKeyText, warnings, sgkChapterLabel: sgkLabel };
}

/** Danh sách dạng bài ĐÃ TRIỂN KHAI VÀ CHỌN ĐƯỢC (bỏ "planned" và "hiddenFromForm") cho 1
 * khối lớp - để form dựng động danh sách checkbox từ catalog thay vì hard-code EXERCISE_LABELS
 * như trước. GIAI ĐOẠN 2: WorksheetForm.jsx import trực tiếp getSelectableCatalogFor() từ
 * worksheetExerciseCatalog.js (module dữ liệu thuần, an toàn phía client) thay vì hàm này, vì
 * hàm này nằm trong worksheetGenerator.js - file có import geminiKeyPool.js (đọc biến môi
 * trường phía server) nên KHÔNG nên import trực tiếp từ component "use client". Giữ hàm này lại
 * để dùng phía server nếu sau này cần 1 API route liệt kê dạng bài. */
export function listAvailableExercises(grade, subject = "TOAN") {
  return getSelectableCatalogFor(grade, subject).map(({ key, label, skillGroup, source, defaultCount }) => ({
    key,
    label,
    skillGroup,
    source,
    defaultCount,
  }));
}
