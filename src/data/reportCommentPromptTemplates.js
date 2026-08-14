/**
 * reportCommentPromptTemplates.js
 * Dựng prompt cho AI "dịch" ý thô của giáo viên về 1 học sinh thành nhận xét học bạ chuẩn mực,
 * đúng tinh thần Thông tư (27/2020 Tiểu học, 22/2021 THCS-THPT): KHÔNG dùng từ ngữ tiêu cực/quy
 * chụp/so sánh học sinh, nhưng VẪN giữ chi tiết cụ thể của từng em (chống sáo rỗng hàng loạt -
 * đây là rủi ro thiết kế số 1 đã lường trước, xem tom-tat-tinh-nang-nhan-xet-hoc-ba.md mục 2).
 *
 * Khác biệt schema đầu ra theo cấp học (đúng REPORT_COMMENT_LEVEL_CONFIG.structure):
 *  - "3-phan" (Tiểu học): { phamChat, nangLuc, monHoc: [{ten, noiDung}] }
 *  - "doan-van" (THCS/THPT): { nhanXetChung, monHoc: [{ten, noiDung}] }
 */

import {
  REPORT_COMMENT_LEVELS,
  getReportCommentLevelConfig,
  getReportCommentLengthConfig,
  NANG_LUC_CHUNG_TT27,
  PHAM_CHAT_TT27,
  BANNED_NEGATIVE_WORDS,
} from "./reportCommentConfig";

export const REPORT_COMMENT_MODEL = "gemini-3.5-flash"; // đồng bộ LESSON_PLAN_MODEL, FREE_TIER_MODEL

function buildBannedWordsBlock() {
  return (
    `TUYỆT ĐỐI KHÔNG dùng các từ/cụm từ tiêu cực, quy chụp, xúc phạm sau đây (và các biến thể ` +
    `gần nghĩa của chúng) trong bất kỳ câu nào: ${BANNED_NEGATIVE_WORDS.join(", ")}. ` +
    `KHÔNG so sánh học sinh này với học sinh khác hoặc với "mặt bằng chung của lớp".`
  );
}

function buildAntiClicheGuidance() {
  return (
    "QUAN TRỌNG - chống nhận xét sáo rỗng/giống nhau hàng loạt: PHẢI giữ lại các CHI TIẾT CỤ THỂ " +
    "mà giáo viên đã ghi (môn học, tình huống, biểu hiện, hành vi cụ thể...) - chỉ được đổi CÁCH " +
    "DÙNG TỪ (từ tiêu cực -> trung tính/xây dựng) và CÁCH DIỄN ĐẠT (chê thẳng -> gợi mở hướng cải " +
    "thiện), KHÔNG được thay chi tiết cụ thể bằng câu chung chung kiểu 'em cần cố gắng hơn trong " +
    "học tập'. Ví dụ: 'làm toán sai bét' KHÔNG viết thành 'cần cố gắng môn Toán' một cách mơ hồ, mà " +
    "nên giữ rõ là học sinh còn hay tính toán nhầm/sai kết quả, cần luyện tập thêm kỹ năng tính toán."
  );
}

function buildPreviousCommentBlock(previousComment) {
  if (!previousComment) return "";
  return `
NHẬN XÉT KỲ TRƯỚC của chính học sinh này (để tham chiếu, ghi nhận SỰ TIẾN BỘ theo đúng tinh thần
"đánh giá vì sự tiến bộ của học sinh" - TUYỆT ĐỐI KHÔNG lặp lại nguyên văn các câu chữ dưới đây,
chỉ dùng để biết học sinh đã cải thiện gì / còn tồn tại gì so với trước):
"""
${previousComment}
"""
`;
}

function buildSubjectListBlock(monHocList) {
  if (!Array.isArray(monHocList) || monHocList.length === 0) return "";
  const lines = monHocList
    .map((m) => `  - Môn "${m.ten}": ${m.ghiChu?.trim() || "(giáo viên không ghi chú riêng, hãy nhận xét chung dựa trên thông tin đã cho ở trên)"}`)
    .join("\n");
  return `\nGhi chú thô theo từng môn học:\n${lines}\n`;
}

function buildTieuHocSchemaBlock() {
  return `{
  "phamChat": "...",
  "nangLuc": "...",
  "monHoc": [ { "ten": "Toán", "noiDung": "..." }, { "ten": "Tiếng Việt", "noiDung": "..." } ]
}`;
}

function buildDoanVanSchemaBlock() {
  return `{
  "nhanXetChung": "...",
  "monHoc": [ { "ten": "Toán", "noiDung": "..." }, { "ten": "Ngữ văn", "noiDung": "..." } ]
}`;
}

/**
 * @param cap - 1 trong REPORT_COMMENT_LEVELS (tieu_hoc/thcs/thpt)
 * @param hoTen, lop - thông tin học sinh (chỉ để AI xưng hô đúng, KHÔNG phải dữ liệu nhạy cảm)
 * @param doDai - 1 trong REPORT_COMMENT_LENGTHS
 * @param ghiChuPhamChat, ghiChuNangLuc - ý thô của GV (CHỈ dùng cho Tiểu học)
 * @param monHocList - [{ten, ghiChu}] ý thô theo từng môn (dùng cho mọi cấp)
 * @param nhanXetChungTho - ý thô về ý thức học tập chung (CHỈ dùng cho THCS/THPT)
 * @param previousComment - text nhận xét kỳ trước (optional, để tham chiếu tiến bộ)
 */
export function buildReportCommentPrompt({
  cap,
  hoTen,
  lop,
  doDai,
  ghiChuPhamChat = "",
  ghiChuNangLuc = "",
  monHocList = [],
  nhanXetChungTho = "",
  previousComment = null,
}) {
  const levelConfig = getReportCommentLevelConfig(cap) || getReportCommentLevelConfig(REPORT_COMMENT_LEVELS.TIEU_HOC);
  const lengthConfig = getReportCommentLengthConfig(doDai);
  const isTieuHoc = levelConfig.structure === "3-phan";

  const role = isTieuHoc
    ? "Bạn là một giáo viên chủ nhiệm tiểu học giàu kinh nghiệm, tận tâm, am hiểu Thông tư 27/2020/TT-BGDĐT về đánh giá học sinh tiểu học."
    : "Bạn là một giáo viên chủ nhiệm giàu kinh nghiệm, tận tâm, am hiểu Thông tư 22/2021/TT-BGDĐT về đánh giá học sinh THCS-THPT.";

  const task =
    `Nhiệm vụ: giáo viên đã gõ NHANH, THÔ những ý cần nhận xét về học sinh "${hoTen}"` +
    (lop ? ` (lớp ${lop})` : "") +
    `. Hãy VIẾT LẠI thành nhận xét học bạ chuẩn mực, mang tính XÂY DỰNG, ĐÚNG tinh thần ` +
    `${levelConfig.circularCode}, PHÙ HỢP để đưa vào học bạ hoặc nhắn cho phụ huynh.`;

  const styleByLevel = isTieuHoc
    ? "Giọng văn nhẹ nhàng, gần gũi, phù hợp với học sinh tiểu học và cách phụ huynh nhỏ tuổi đọc hiểu."
    : "Giọng văn nghiêm túc, rõ ràng, phù hợp với học sinh THCS/THPT, vẫn giữ sự tôn trọng và khích lệ.";

  const lengthLine = `Độ dài: ${lengthConfig.guidance}.`;

  let schemaBlock;
  let contentBlock;

  if (isTieuHoc) {
    schemaBlock = buildTieuHocSchemaBlock();
    contentBlock = `
Ý THÔ giáo viên đã ghi:
- Về PHẨM CHẤT (tham khảo danh mục TT27: ${PHAM_CHAT_TT27.join(", ")}): "${ghiChuPhamChat || "(không có ghi chú riêng, hãy suy ra hợp lý từ các ý khác nếu có thể, nếu không có gì để viết thì để nhận xét chung chung tích cực, ngắn gọn)"}"
- Về NĂNG LỰC (tham khảo danh mục TT27: ${NANG_LUC_CHUNG_TT27.join(", ")}): "${ghiChuNangLuc || "(không có ghi chú riêng)"}"
${buildSubjectListBlock(monHocList)}
Yêu cầu đầu ra JSON đúng 3 phần (phamChat, nangLuc, monHoc) - "monHoc" PHẢI có đủ và CHỈ CÓ đúng
các môn đã liệt kê ở trên, theo ĐÚNG THỨ TỰ đã cho, không tự thêm hoặc bỏ bớt môn.`;
  } else {
    schemaBlock = buildDoanVanSchemaBlock();
    contentBlock = `
Ý THÔ giáo viên đã ghi:
- Về Ý THỨC/THÁI ĐỘ HỌC TẬP CHUNG: "${nhanXetChungTho || "(không có ghi chú riêng, hãy viết 1 nhận xét chung tích cực, ngắn gọn dựa trên các ý ở phần môn học)"}"
${buildSubjectListBlock(monHocList)}
Yêu cầu đầu ra JSON đúng 2 phần (nhanXetChung, monHoc) - "monHoc" PHẢI có đủ và CHỈ CÓ đúng các
môn đã liệt kê ở trên, theo ĐÚNG THỨ TỰ đã cho, không tự thêm hoặc bỏ bớt môn.`;
  }

  return `${role}

${task}
${styleByLevel} ${lengthLine}

${buildBannedWordsBlock()}

${buildAntiClicheGuidance()}
${buildPreviousCommentBlock(previousComment)}
${contentBlock}

CHỈ trả về JSON hợp lệ theo đúng cấu trúc sau, KHÔNG kèm markdown, KHÔNG kèm giải thích, KHÔNG
kèm dấu backtick:
${schemaBlock}`;
}

export { REPORT_COMMENT_LEVELS };
