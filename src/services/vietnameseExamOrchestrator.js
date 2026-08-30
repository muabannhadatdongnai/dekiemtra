import { getBlock, BLOCK_KEYS } from "@/data/vietnameseExamBlocks";
import { generateDocThamBlock } from "./vietnameseBlocks/docThamBlock";
import { generateDocThanhTiengBlock } from "./vietnameseBlocks/docThanhTiengBlock";
import { generateChinhTaBlock } from "./vietnameseBlocks/chinhTaBlock";
import { generateTapLamVanBlock } from "./vietnameseBlocks/tapLamVanBlock";
import { fetchMarkdownFromGitHub } from "./githubService";

/**
 * vietnameseExamOrchestrator.js
 * "Người điều phối" cho mode thứ 4 "📖 Đề Tiếng Việt Tiểu học" - tương đương examOrchestrator.js/
 * lessonPlanOrchestrator.js nhưng ĐƠN GIẢN HƠN NHIỀU về mặt cấu trúc, đúng nguyên tắc đã chốt:
 * "người điều phối KHÔNG biết và KHÔNG cần biết bên trong từng khối viết gì". Nhiệm vụ duy nhất
 * của file này: với mỗi khối trong `selectedBlocks`, tra danh bạ (vietnameseExamBlocks.js) rồi
 * gọi ĐÚNG hàm sinh tương ứng trong BLOCK_GENERATORS, gom kết quả lại theo key.
 *
 * Thêm khối mới (VD "docThanhTieng") CHỈ cần: viết file services/vietnameseBlocks/xxxBlock.js
 * riêng, import vào đây, thêm 1 dòng vào BLOCK_GENERATORS, đổi `implemented: true` trong
 * vietnameseExamBlocks.js - KHÔNG sửa gì khác trong file này.
 *
 * Lỗi ở 1 khối KHÔNG làm hỏng các khối còn lại (mỗi khối generate độc lập trong try/catch riêng) -
 * ví dụ khối "Tập làm văn" lỗi thì "Đọc thầm" vẫn trả về bình thường, giáo viên vẫn dùng được phần
 * đã tạo thành công thay vì mất trắng cả lượt.
 */
const BLOCK_GENERATORS = {
  docTham: generateDocThamBlock,
  docThanhTieng: generateDocThanhTiengBlock,
  chinhTa: generateChinhTaBlock,
  tapLamVan: generateTapLamVanBlock,
};

const MAX_SGK_CONTEXT_LENGTH = 4000; // khớp MAX_SGK_CONTEXT_LENGTH trong worksheetGenerator.js

/**
 * ================== PHIÊN 30 (liên kết SGK Tiếng Việt thật cho khối "Đọc thầm") ==================
 * Tải nội dung 1 chương SGK Tiếng Việt (best-effort, KHÔNG làm hỏng cả lượt tạo đề nếu lỗi) - TÁI
 * DÙNG đúng nguyên tắc resolveSgkChapterContext() đã kiểm định trong worksheetGenerator.js. Khác
 * 1 điểm: mode này grade đã SẴN LÀ số 1-5 khớp thẳng SGK (không cần mapping WORKSHEET_GRADE_TO_SGK_GRADE
 * như Phiếu bài tập), và môn LUÔN LÀ "Tieng_Viet" (mode này chỉ có 1 môn duy nhất).
 *
 * Trả về { context, warning } - `context` = null nếu không chọn chương hoặc tải lỗi (khối "Đọc
 * thầm" vẫn tạo bình thường, chỉ là ngữ liệu AI tự viết sẽ kém bám sát chủ đề/từ vựng SGK hơn).
 */
async function resolveVietnameseSgkReferenceContext({ grade, sgkVolume, sgkChapterId }) {
  if (!sgkChapterId) return { context: null, warning: null };
  try {
    const markdown = await fetchMarkdownFromGitHub(grade, "Tieng_Viet", sgkVolume || 1, sgkChapterId);
    return { context: markdown.slice(0, MAX_SGK_CONTEXT_LENGTH), warning: null };
  } catch (err) {
    return {
      context: null,
      warning: `Không tải được tài liệu SGK Tiếng Việt cho Chương/Bài đã chọn (${err.message}) - khối "Đọc thầm" vẫn được tạo bình thường, nhưng ngữ liệu có thể kém bám sát chủ đề SGK hơn.`,
    };
  }
}

export async function orchestrateVietnameseExamGeneration({
  grade,
  selectedBlocks = [],
  blockInputs = {},
  sgkVolume = null,
  sgkChapterId = null,
}) {
  const warnings = [];
  const results = {};
  let quotaExhausted = false;
  let serverOverloaded = false;

  // Chỉ resolve khi khối "Đọc thầm" thực sự được chọn - tránh gọi GitHub vô ích nếu giáo viên
  // chỉ tạo các khối tĩnh (Đọc thành tiếng/Chính tả) dù có lỡ chọn sẵn Chương SGK trên form.
  let sgkReferenceContext = null;
  if (selectedBlocks.includes(BLOCK_KEYS.DOC_THAM) && sgkChapterId) {
    const resolved = await resolveVietnameseSgkReferenceContext({ grade, sgkVolume, sgkChapterId });
    sgkReferenceContext = resolved.context;
    if (resolved.warning) warnings.push(resolved.warning);
  }

  for (const key of selectedBlocks) {
    const blockDef = getBlock(key);
    if (!blockDef) {
      warnings.push(`Khối "${key}" không có trong danh bạ, đã bỏ qua.`);
      continue;
    }
    if (!blockDef.implemented) {
      warnings.push(`Khối "${blockDef.label}" chưa được triển khai, đã bỏ qua.`);
      continue;
    }
    const generate = BLOCK_GENERATORS[key];
    if (!generate) {
      warnings.push(`Khối "${blockDef.label}" chưa có hàm sinh nội dung, đã bỏ qua.`);
      continue;
    }

    // Chỉ khối "Đọc thầm" nhận thêm referenceContext - các khối khác giữ nguyên input như cũ.
    const input =
      key === BLOCK_KEYS.DOC_THAM
        ? { ...(blockInputs[key] || {}), referenceContext: sgkReferenceContext }
        : blockInputs[key] || {};

    try {
      results[key] = await generate({ grade, input });
    } catch (err) {
      if (err.quotaExhausted) quotaExhausted = true;
      if (err.serverOverloaded) serverOverloaded = true;
      warnings.push(`Không thể tạo khối "${blockDef.label}": ${err.message}`);
    }
  }

  return { results, warnings, quotaExhausted, serverOverloaded };
}
