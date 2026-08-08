/**
 * vietnameseExamBlocks.js
 * "Danh bạ khối" cho mode thứ 4 "📖 Đề Tiếng Việt Tiểu học" - đúng nguyên tắc thiết kế đã chốt
 * trong PROJECT_SUMMARY.md (Phần B, mục B): mỗi khối là 1 mảnh ĐỘC LẬP, tự khai báo đủ mọi thứ nó
 * cần, người điều phối (vietnameseExamOrchestrator.js) và giao diện (VietnameseExamForm.jsx) chỉ
 * ĐỌC danh sách này, KHÔNG hard-code tên/số lượng khối ở đâu khác.
 *
 * Cùng khuôn với lessonPlanIntegrations.js (8 "tích hợp" giáo án) - MỞ RỘNG bằng cách thêm 1 entry
 * vào VIETNAMESE_EXAM_BLOCKS, không phải sửa rải rác nhiều nơi.
 *
 * `implemented: false` = khối đã có trong danh bạ (đúng cấu trúc đề thật) nhưng CHƯA có code sinh
 * nội dung/hiển thị/xuất Word phía sau - UI vô hiệu hoá (disabled) khối này, người điều phối bỏ
 * qua an toàn nếu lỡ được yêu cầu. Đặt `implemented: true` NGAY KHI đã nối xong đủ 3 phần: hàm
 * sinh (services/vietnameseBlocks/), hiển thị (components/vietnameseBlocks/), xuất Word (cùng
 * service file) cho khối đó - không bật cờ này sớm.
 */

export const BLOCK_KEYS = {
  DOC_THANH_TIENG: "docThanhTieng",
  DOC_THAM: "docTham",
  CHINH_TA: "chinhTa",
  TAP_LAM_VAN: "tapLamVan",
};

export const VIETNAMESE_EXAM_BLOCKS = {
  [BLOCK_KEYS.DOC_THANH_TIENG]: {
    key: BLOCK_KEYS.DOC_THANH_TIENG,
    order: 1,
    section: "A. ĐỌC",
    label: "Đọc thành tiếng",
    description: "Hướng dẫn tĩnh cho giáo viên (không cần AI)",
    isAiGenerated: false,
    implemented: true,
  },
  [BLOCK_KEYS.DOC_THAM]: {
    key: BLOCK_KEYS.DOC_THAM,
    order: 2,
    section: "A. ĐỌC",
    label: "Đọc thầm",
    description: "AI sinh 1 đoạn văn/thơ ngữ liệu + 7-10 câu hỏi bám sát",
    isAiGenerated: true,
    implemented: true,
  },
  [BLOCK_KEYS.CHINH_TA]: {
    key: BLOCK_KEYS.CHINH_TA,
    order: 3,
    section: "B. VIẾT",
    label: "Chính tả",
    description: "Hướng dẫn tĩnh, trích 1 đoạn có sẵn trong SGK (không cần AI)",
    isAiGenerated: false,
    implemented: true,
  },
  [BLOCK_KEYS.TAP_LAM_VAN]: {
    key: BLOCK_KEYS.TAP_LAM_VAN,
    order: 4,
    section: "B. VIẾT",
    label: "Tập làm văn",
    description: "AI sinh 1 đề bài viết văn (AI nhẹ)",
    isAiGenerated: true,
    implemented: true,
  },
};

/** Trả về danh sách khối theo đúng thứ tự A. Đọc -> B. Viết (dùng cho UI + ráp kết quả cuối). */
export function listBlocks() {
  return Object.values(VIETNAMESE_EXAM_BLOCKS).sort((a, b) => a.order - b.order);
}

export function getBlock(key) {
  return VIETNAMESE_EXAM_BLOCKS[key] || null;
}
