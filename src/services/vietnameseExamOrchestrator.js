import { getBlock } from "@/data/vietnameseExamBlocks";
import { generateDocThamBlock } from "./vietnameseBlocks/docThamBlock";

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
  // docThanhTieng, chinhTa, tapLamVan: chưa có hàm sinh - xem `implemented: false` trong
  // vietnameseExamBlocks.js, thêm dòng tương ứng ở đây khi triển khai xong từng khối.
};

export async function orchestrateVietnameseExamGeneration({ grade, selectedBlocks = [], blockInputs = {} }) {
  const warnings = [];
  const results = {};
  let quotaExhausted = false;
  let serverOverloaded = false;

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

    try {
      results[key] = await generate({ grade, input: blockInputs[key] || {} });
    } catch (err) {
      if (err.quotaExhausted) quotaExhausted = true;
      if (err.serverOverloaded) serverOverloaded = true;
      warnings.push(`Không thể tạo khối "${blockDef.label}": ${err.message}`);
    }
  }

  return { results, warnings, quotaExhausted, serverOverloaded };
}
