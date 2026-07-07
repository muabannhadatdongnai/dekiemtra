/**
 * promptTemplates.js
 * Ma trận prompt theo 4 mức độ (thang Bloom rút gọn - chuẩn Bộ GD&ĐT):
 *  Tất cả 4 mức độ (Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao) -> gemini-3.5-flash
 *
 * ⚠️ VÌ SAO DÙNG 1 MODEL DUY NHẤT (không tách Flash/Pro như thiết kế ban đầu):
 * Google KHÔNG có gói miễn phí cho bất kỳ model Pro nào hiện tại (gemini-3.1-pro-preview
 * yêu cầu bật billing mới gọi được, dù chỉ 1 request). Vì đây là dự án miễn phí 100%,
 * gemini-3.5-flash là lựa chọn tốt nhất: Google mô tả model này "gần bằng chất lượng Pro"
 * dù thuộc dòng Flash, có gói miễn phí ổn định (10 RPM / 1500 RPD tại thời điểm viết),
 * và chưa có thông báo shutdown.
 *
 * ⚠️ LƯU Ý QUAN TRỌNG VỀ VÒNG ĐỜI MODEL GEMINI:
 * Google thường xuyên khai tử (shutdown) các model cũ - khi model bị shutdown, MỌI request
 * gửi đến sẽ nhận lỗi 404, khiến toàn bộ đề bị tạo ra 0 câu ở mọi mức độ (không phải do
 * trùng lặp như thông báo cảnh báo có thể gây hiểu lầm). Nếu sau này bạn gặp lại lỗi
 * "chỉ tạo được 0/N câu" ở TẤT CẢ các mức độ cùng lúc, khả năng cao là do model đã bị
 * Google khai tử HOẶC không còn free tier -> kiểm tra:
 *   - https://ai.google.dev/gemini-api/docs/deprecations (model còn tồn tại?)
 *   - https://ai.google.dev/gemini-api/docs/pricing (model còn free tier?)
 * rồi cập nhật lại giá trị "model" bên dưới.
 *
 * Tích hợp sẵn 2/3 lớp chống trùng đề ở tầng prompt (lớp 3 - hash/similarity nằm ở geminiEngine.js):
 *  - Seed & Timestamp Injection: buộc AI "quên" pattern câu hỏi mặc định giữa các lần gọi.
 *  - Random Sampling Prompt: yêu cầu AI chọn ngẫu nhiên phân vùng kiến thức trong tài liệu.
 */

const FREE_TIER_MODEL = "gemini-3.5-flash";

export const DIFFICULTY_LEVELS = {
  NHAN_BIET: {
    key: "NHAN_BIET",
    label: "Nhận biết",
    model: FREE_TIER_MODEL,
    description:
      "Câu hỏi tái hiện trực tiếp định nghĩa, công thức, dữ liệu có sẵn trong tài liệu. Không yêu cầu suy luận nhiều bước.",
  },
  THONG_HIEU: {
    key: "THONG_HIEU",
    label: "Thông hiểu",
    model: FREE_TIER_MODEL,
    description:
      "Câu hỏi yêu cầu diễn giải, so sánh, áp dụng công thức ở mức đơn giản, 1-2 bước biến đổi.",
  },
  VAN_DUNG: {
    key: "VAN_DUNG",
    label: "Vận dụng",
    model: FREE_TIER_MODEL,
    description:
      "Câu hỏi yêu cầu kết hợp nhiều kiến thức, nhiều bước giải, có tình huống thực tế đơn giản.",
  },
  VAN_DUNG_CAO: {
    key: "VAN_DUNG_CAO",
    label: "Vận dụng cao",
    model: FREE_TIER_MODEL,
    description:
      "Câu hỏi phân hoá học sinh giỏi: tình huống phức tạp, nhiều bước lập luận, kết hợp liên chương, đòi hỏi sáng tạo. Ưu tiên khai thác phần 'Vận dụng cao' nếu tài liệu Markdown có đề cập.",
  },
};

/** Sinh 1 seed ngẫu nhiên duy nhất cho mỗi lần gọi -> Lớp chống trùng #1 (Prompt-level). */
export function generateAntiDuplicationSeed() {
  return `Seed_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const BASE_RULES = `
BẠN LÀ MỘT CHUYÊN GIA RA ĐỀ THI MÔN TOÁN CHUẨN BỘ GIÁO DỤC VIỆT NAM.

QUY TẮC BẮT BUỘC:
- Chỉ sử dụng kiến thức có trong NGUỒN TÀI LIỆU được cung cấp bên dưới, KHÔNG bịa thêm kiến thức ngoài chương trình.
- Công thức Toán học phải viết bằng LaTeX, đặt trong dấu $...$ (inline) hoặc $$...$$ (block).
- Mỗi câu hỏi trắc nghiệm phải có: đề bài, 4 phương án A/B/C/D chỉ có 1 đáp án đúng.
- Mỗi câu hỏi tự luận phải có: đề bài rõ ràng, đủ dữ liệu để giải.
- Ngôn ngữ: Tiếng Việt, chuẩn mực, phù hợp lứa tuổi học sinh của lớp được chỉ định.
- SỐ LIỆU PHẢI "ĐẸP" VÀ PHÙ HỢP LỨA TUỔI: với Lớp 1-5, ưu tiên số nguyên hoặc phân số/thập phân
  hữu hạn, kết quả cuối cùng phải là số tròn, dễ kiểm tra (tránh số vô tỉ, thập phân vô hạn,
  phân số quá phức tạp). Với Lớp 6 trở lên có thể dùng căn thức/số vô tỉ nếu phù hợp chương trình,
  nhưng vẫn phải đảm bảo có lời giải "sạch", không sai số làm tròn khó chịu.
- Đầu ra CHỈ trả về JSON hợp lệ theo đúng schema, không kèm giải thích, không markdown code fence.

CHỐNG TRÙNG LẶP (RẤT QUAN TRỌNG):
- Hãy TRÍCH XUẤT VÀ CHỌN NGẪU NHIÊN các phân vùng kiến thức khác nhau trong tài liệu Markdown
  được cung cấp cho mỗi câu hỏi (không tập trung vào 1 ví dụ mẫu duy nhất).
- TUYỆT ĐỐI KHÔNG lặp lại form bài mẫu mặc định/kinh điển hay xuất hiện y hệt trong sách giáo khoa.
  Hãy thay đổi bối cảnh bài toán (tên riêng, số liệu, tình huống thực tế) mỗi lần sinh câu hỏi.
- Đây là một lượt sinh đề độc lập, mang mã định danh ngẫu nhiên riêng (xem SEED bên dưới) -
  hãy dùng SEED này như một "hạt giống" ngẫu nhiên để đa dạng hoá cấu trúc số liệu, KHÔNG in SEED
  ra trong nội dung câu hỏi.
`;

export function buildExamPrompt({
  grade,
  subject = "Toán",
  chapter,
  sourceMarkdown,
  difficulty,
  questionType = "trac_nghiem",
  numberOfQuestions = 5,
  excludeQuestionsSummary = "",
}) {
  const level = DIFFICULTY_LEVELS[difficulty];
  if (!level) throw new Error(`Mức độ không hợp lệ: ${difficulty}`);

  const seed = generateAntiDuplicationSeed();
  const isEssay = questionType === "tu_luan";

  const questionSchemaExample = isEssay
    ? `{
      "content": "Đề bài tự luận, có thể chứa LaTeX",
      "correctAnswer": "Đáp số cuối cùng, ngắn gọn"
    }`
    : `{
      "content": "Đề bài câu hỏi, có thể chứa LaTeX",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A|B|C|D"
    }`;

  return `
${BASE_RULES}

SEED: ${seed}

THÔNG TIN ĐỀ:
- Lớp: ${grade}
- Môn: ${subject}
- Chương/Chủ đề: ${chapter}
- Mức độ: ${level.label} (${level.description})
- Dạng câu hỏi: ${isEssay ? "Tự luận" : "Trắc nghiệm 4 lựa chọn"}
- Số lượng câu cần tạo: ${numberOfQuestions}

NGUỒN TÀI LIỆU (Markdown, trích từ kho kiến thức GitHub):
"""
${sourceMarkdown}
"""

${
  excludeQuestionsSummary
    ? `CÁC CÂU HỎI ĐÃ TỒN TẠI TRONG NGÂN HÀNG ĐỀ (KHÔNG ĐƯỢC TẠO TRÙNG Ý TƯỞNG, TRÙNG SỐ LIỆU HOẶC TRÙNG CÁCH HỎI):\n${excludeQuestionsSummary}\n`
    : ""
}

QUY TẮC GHÉP NỐI QUAN TRỌNG:
- Mảng "teacher_rubric" PHẢI có ĐÚNG cùng số lượng phần tử và ĐÚNG cùng thứ tự với mảng "questions"
  (phần tử thứ i của "teacher_rubric" luôn là đáp án/lời giải của phần tử thứ i trong "questions").
  KHÔNG bỏ sót, KHÔNG đổi thứ tự, KHÔNG gộp nhiều câu vào 1 rubric.

Hãy trả về JSON theo đúng schema sau (không thêm trường nào khác ngoài schema):
{
  "questions": [
    ${questionSchemaExample}
  ],
  "teacher_rubric": [
    {
      "correctAnswer": "đáp án đúng, lặp lại để tiện đối chiếu",
      "detailedSolution": "Lời giải chi tiết từng bước, có thể chứa LaTeX",
      "scoringGuide": "Thang điểm/barem chi tiết theo từng bước (đặc biệt quan trọng với câu tự luận)"
    }
  ]
}
`.trim();
}
