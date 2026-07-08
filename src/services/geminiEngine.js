import { buildExamPrompt, DIFFICULTY_LEVELS } from "@/data/promptTemplates";
import { generateContentWithFailover } from "./geminiKeyPool";
import { isValidVisualData, computeVisualAnswer } from "@/data/visualSchemas";
import crypto from "crypto";

// ⚠️ CHỖ CẦN THAY ĐỔI: đặt GEMINI_API_KEYS (nhiều key, phân tách dấu phẩy) hoặc GEMINI_API_KEY
// (1 key) trong .env.local - lấy free tại aistudio.google.com. Xem chi tiết cơ chế xoay vòng
// nhiều key trong geminiKeyPool.js.
// ⚠️ Dùng SDK chính thức hiện hành @google/genai (SDK cũ @google/generative-ai đã bị Google
// khai tử từ 31/8/2025, không còn được cập nhật hay hỗ trợ).

/**
 * ================== 3 LỚP CHỐNG TRÙNG ĐỀ ==================
 * Lớp 1 (Prompt-level, trong promptTemplates.js): Seed injection + Random sampling prompt.
 * Lớp 2 (Hash-level): băm nội dung câu hỏi (đã chuẩn hoá, bỏ dấu) để chặn trùng tuyệt đối.
 * Lớp 3 (Similarity-level): Jaccard similarity trên n-gram để chặn câu "đổi số liệu nhưng ý tưởng giống nhau".
 * =============================================================
 */

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hashQuestion(content) {
  return crypto.createHash("sha256").update(normalizeText(content)).digest("hex");
}

function ngrams(text, n = 3) {
  const words = normalizeText(text).split(" ");
  const grams = new Set();
  for (let i = 0; i <= words.length - n; i++) grams.add(words.slice(i, i + n).join(" "));
  return grams;
}

function jaccardSimilarity(a, b) {
  const setA = ngrams(a);
  const setB = ngrams(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const gram of setA) if (setB.has(gram)) intersection++;
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

/**
 * Lọc bỏ các CẶP (câu hỏi + rubric tương ứng) bị trùng hash tuyệt đối hoặc tương tự cao.
 *
 * ⚠️ SỬA LỖI QUAN TRỌNG: Bản trước ghép "questions" với "teacher_rubric" bằng cách so khớp
 * chuỗi id do chính AI tự sinh ra ở 2 mảng JSON riêng biệt. Trên thực tế LLM thường KHÔNG
 * giữ id nhất quán tuyệt đối giữa 2 mảng (sai chính tả, tự đổi định dạng...), khiến rubric
 * bị rớt âm thầm -> giáo viên nhận đề thiếu đáp án mà không hề biết.
 * Bản sửa này ghép theo VỊ TRÍ (positional pairing) trong cùng 1 lượt gọi, đảm bảo mỗi câu
 * hỏi luôn có đúng 1 rubric đi kèm (hoặc rõ ràng là không có, không bao giờ "rớt lặng lẽ").
 */
function pairAndFilterDuplicates(batchQuestions, batchRubric, existingContents, similarityThreshold = 0.55) {
  const existingHashes = new Set(existingContents.map(hashQuestion));
  const keptContents = [];
  const pairs = [];

  batchQuestions.forEach((q, i) => {
    if (!q?.content) return;
    const hash = hashQuestion(q.content);
    if (existingHashes.has(hash)) return;

    const isSimilar = [...existingContents, ...keptContents].some(
      (old) => jaccardSimilarity(old, q.content) >= similarityThreshold
    );
    if (isSimilar) return;

    existingHashes.add(hash);
    keptContents.push(q.content);
    pairs.push({ question: q, rubric: batchRubric[i] || null });
  });

  return pairs;
}

function summarizeForPrompt(existingQuestions = [], limit = 30) {
  return existingQuestions
    .slice(0, limit)
    .map((q, i) => `${i + 1}. ${q.slice(0, 120)}`)
    .join("\n");
}

/**
 * Kiểm tra + "làm sạch" 1 câu hỏi có gắn visualType/visualData:
 * - Nếu visualData không hợp lệ về mặt toán học (vd rows không cộng đúng tổng, tam giác sai
 *   quan hệ cộng/trừ...) -> BỎ visualType/visualData, giữ lại câu hỏi dạng text thường
 *   (an toàn hơn là hiển thị hình sai cho học sinh).
 * - Nếu hợp lệ -> ghi đè correctAnswer bằng giá trị TỰ TÍNH (computeVisualAnswer), KHÔNG bao
 *   giờ tin vào correctAnswer do AI tự tính cho các dạng có công thức xác định rõ ràng này.
 */
function sanitizeVisualQuestion(question, includeAnswers) {
  if (!question.visualType || !question.visualData) return question;

  if (!isValidVisualData(question.visualType, question.visualData)) {
    console.warn(
      `[geminiEngine] visualData không hợp lệ (${question.visualType}), bỏ visual, giữ câu hỏi dạng text.`
    );
    const { visualType, visualData, ...rest } = question;
    return rest;
  }

  if (!includeAnswers) return question;

  const computedAnswer = computeVisualAnswer(question.visualType, question.visualData);
  return { ...question, correctAnswer: String(computedAnswer) };
}

/**
 * Gọi Gemini để sinh câu hỏi + rubric cho 1 mức độ cụ thể.
 * Model: dùng chung gemini-3.5-flash cho mọi mức độ (xem giải thích trong promptTemplates.js) -
 * vẫn giữ cấu trúc "levelConfig.model" để dễ tách lại nếu Google mở free tier cho Pro sau này.
 */
export async function generateQuestionsForLevel({
  grade,
  subject,
  chapter,
  sourceMarkdown,
  difficulty,
  questionType,
  numberOfQuestions,
  includeAnswers = false,
  useVisualQuestions = false,
  existingQuestions = [],
  maxRetries = 2,
}) {
  const levelConfig = DIFFICULTY_LEVELS[difficulty];
  if (!levelConfig) throw new Error(`Mức độ không hợp lệ: ${difficulty}`);

  if (numberOfQuestions <= 0) {
    return { questions: [], rubric: [], requested: 0, fulfilled: 0 };
  }

  let collectedPairs = [];
  let attempt = 0;
  const poolExisting = existingQuestions.map((q) => q.content || q);

  while (collectedPairs.length < numberOfQuestions && attempt <= maxRetries) {
    const remaining = numberOfQuestions - collectedPairs.length;
    const prompt = buildExamPrompt({
      grade,
      subject,
      chapter,
      sourceMarkdown,
      difficulty,
      questionType,
      numberOfQuestions: remaining,
      includeAnswers,
      useVisualQuestions,
      excludeQuestionsSummary: summarizeForPrompt([
        ...poolExisting,
        ...collectedPairs.map((p) => p.question.content),
      ]),
    });

    let rawText;
    try {
      const result = await generateContentWithFailover({
        model: levelConfig.model,
        contents: prompt,
        config: {
          temperature: 0.75,
          responseMimeType: "application/json",
        },
      });
      rawText = result.text;
    } catch (err) {
      console.error(`[geminiEngine] Lỗi gọi API (${difficulty}, lần thử ${attempt + 1}):`, err.message);
      attempt++;
      continue;
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      attempt++;
      continue; // JSON lỗi -> thử lại với seed mới ở vòng sau
    }

    const batchQuestions = (Array.isArray(parsed.questions) ? parsed.questions : []).map((q) =>
      sanitizeVisualQuestion(q, includeAnswers)
    );
    const batchRubric = Array.isArray(parsed.teacher_rubric) ? parsed.teacher_rubric : [];

    const newPairs = pairAndFilterDuplicates(batchQuestions, batchRubric, [
      ...poolExisting,
      ...collectedPairs.map((p) => p.question.content),
    ]);

    collectedPairs = [...collectedPairs, ...newPairs];
    attempt++;
  }

  const finalPairs = collectedPairs.slice(0, numberOfQuestions);

  // ⚠️ Tự sinh ID nội bộ (KHÔNG dựa vào id do AI trả về) để đảm bảo liên kết
  // question <-> rubric luôn đúng 1-1, tuyệt đối không lệch.
  const finalQuestions = [];
  const finalRubric = [];

  finalPairs.forEach(({ question, rubric }) => {
    const internalId = crypto.randomUUID();
    finalQuestions.push({
      ...question,
      id: internalId,
      level: difficulty,
      type: questionType,
      modelUsed: levelConfig.model,
    });
    if (rubric) {
      finalRubric.push({ ...rubric, questionId: internalId });
    }
  });

  return {
    questions: finalQuestions,
    rubric: finalRubric,
    requested: numberOfQuestions,
    fulfilled: finalQuestions.length,
  };
}

/**
 * Sinh toàn bộ đề thi theo ma trận độ khó.
 *  - matrix: { NHAN_BIET: n, THONG_HIEU: n, VAN_DUNG: n, VAN_DUNG_CAO: n }
 *  - typeByLevel: { NHAN_BIET: "trac_nghiem"|"tu_luan", ... } (giáo viên chọn riêng cho từng mức độ,
 *    vì thực tế đề Toán Việt Nam thường có phần Trắc nghiệm cho câu Dễ/Trung bình và Tự luận cho câu Khó)
 * Trả về { questions, teacherRubric, warnings } - warnings liệt kê các mức độ bị thiếu câu do
 * hết lượt thử lại (giáo viên cần biết để bổ sung thủ công, không bị "mất câu" âm thầm).
 */
export async function generateFullExam({
  grade,
  subject,
  chapter,
  sourceMarkdown,
  matrix,
  typeByLevel = {},
  includeAnswers = false,
  useVisualQuestions = false,
  existingQuestions = [],
}) {
  const levels = Object.keys(matrix).filter((k) => matrix[k] > 0);

  const results = await Promise.all(
    levels.map((difficulty) =>
      generateQuestionsForLevel({
        grade,
        subject,
        chapter,
        sourceMarkdown,
        difficulty,
        questionType: typeByLevel[difficulty] || "trac_nghiem",
        numberOfQuestions: matrix[difficulty],
        includeAnswers,
        useVisualQuestions,
        existingQuestions,
      })
    )
  );

  const questions = results.flatMap((r) => r.questions);
  const teacherRubric = results.flatMap((r) => r.rubric);

  const warnings = results
    .filter((r) => r.fulfilled < r.requested)
    .map((r, i) => {
      const level = DIFFICULTY_LEVELS[levels[i]];
      return `Mức "${level?.label}" chỉ tạo được ${r.fulfilled}/${r.requested} câu (do trùng lặp nhiều hoặc lỗi API). Vui lòng thử tạo thêm hoặc bổ sung chương kiến thức.`;
    });

  // (Đã bỏ tính năng tự động gán điểm/thang điểm theo yêu cầu giáo viên - xem scoringUtils.js
  // nếu muốn bật lại trong tương lai, chỉ cần gọi computeScores(questions) ở đây.)

  return { questions, teacherRubric, warnings };
}
