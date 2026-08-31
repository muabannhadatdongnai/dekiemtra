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
 *
 * ================== FIX (đánh số đề Tiếng Việt) ==================
 * TRƯỚC: mỗi khối tự in nhãn số của CHÍNH NÓ ("A. ĐỌC THÀNH TIẾNG", "A. ĐỌC THẦM", "B. CHÍNH TẢ",
 * "B. TẬP LÀM VĂN") ngay trong *BlockView.jsx/*Export.js - dẫn tới đề in ra có "A." lặp lại 2 lần
 * và "B." lặp lại 2 lần trông như lỗi đánh số, sai chuẩn sư phạm (đề Tiếng Việt Tiểu học đúng chuẩn
 * luôn chia 2 phần lớn "I. KIỂM TRA ĐỌC" / "II. KIỂM TRA VIẾT", mỗi phần có 2 mục nhỏ 1./2. bên
 * trong, không dùng chữ cái A/B để phân loại phần thi).
 *
 * SAU: `sectionKey`/`sectionLabel` là nguồn DUY NHẤT quyết định tiêu đề La Mã lớn (I./II.) -
 * VietnameseExamPreview.jsx và vietnameseExamExportService.js (2 "người điều phối" duy nhất biết
 * toàn bộ danh sách khối) chịu trách nhiệm chỉ in `sectionLabel` MỘT LẦN khi `sectionKey` đổi giữa
 * 2 khối liên tiếp CÓ dữ liệu - từng *BlockView.jsx/*Export.js không còn tự in tiêu đề lớn, CHỈ
 * nhận `subLabel` (nhãn số nhỏ "1."/"2." của chính khối đó) làm prop/tham số truyền vào, thay vì
 * hard-code chuỗi chữ. Giữ đúng nguyên tắc "khối tự chứa NỘI DUNG của nó" - chỉ tiêu đề phần lớn
 * (thứ cần biết về các khối khác) mới chuyển lên người điều phối.
 */

export const BLOCK_KEYS = {
  DOC_THANH_TIENG: "docThanhTieng",
  DOC_THAM: "docTham",
  CHINH_TA: "chinhTa",
  TAP_LAM_VAN: "tapLamVan",
};

export const SECTION_KEYS = { DOC: "doc", VIET: "viet" };

export const SECTION_LABELS = {
  [SECTION_KEYS.DOC]: "I. KIỂM TRA ĐỌC",
  [SECTION_KEYS.VIET]: "II. KIỂM TRA VIẾT",
};

export const VIETNAMESE_EXAM_BLOCKS = {
  [BLOCK_KEYS.DOC_THANH_TIENG]: {
    key: BLOCK_KEYS.DOC_THANH_TIENG,
    order: 1,
    sectionKey: SECTION_KEYS.DOC,
    sectionLabel: SECTION_LABELS[SECTION_KEYS.DOC],
    subLabel: "1. Đọc thành tiếng",
    label: "Đọc thành tiếng",
    description: "Hướng dẫn tĩnh cho giáo viên (không cần AI)",
    isAiGenerated: false,
    implemented: true,
  },
  [BLOCK_KEYS.DOC_THAM]: {
    key: BLOCK_KEYS.DOC_THAM,
    order: 2,
    sectionKey: SECTION_KEYS.DOC,
    sectionLabel: SECTION_LABELS[SECTION_KEYS.DOC],
    // Nhãn IN TRONG ĐỀ là "2. Đọc hiểu" (đúng thuật ngữ chuẩn sư phạm) dù key nội bộ/label ở form
    // vẫn giữ "Đọc thầm" (tên quen thuộc giáo viên hay gọi) - không đổi key để tránh phá dữ liệu
    // cũ (blockInputs lưu theo key "docTham").
    subLabel: "2. Đọc hiểu",
    label: "Đọc thầm",
    description: "AI sinh 1 đoạn văn/thơ ngữ liệu + 7-10 câu hỏi bám sát",
    isAiGenerated: true,
    implemented: true,
  },
  [BLOCK_KEYS.CHINH_TA]: {
    key: BLOCK_KEYS.CHINH_TA,
    order: 3,
    sectionKey: SECTION_KEYS.VIET,
    sectionLabel: SECTION_LABELS[SECTION_KEYS.VIET],
    subLabel: "1. Chính tả",
    label: "Chính tả",
    description: "Hướng dẫn tĩnh, trích 1 đoạn có sẵn trong SGK (không cần AI)",
    isAiGenerated: false,
    implemented: true,
  },
  [BLOCK_KEYS.TAP_LAM_VAN]: {
    key: BLOCK_KEYS.TAP_LAM_VAN,
    order: 4,
    sectionKey: SECTION_KEYS.VIET,
    sectionLabel: SECTION_LABELS[SECTION_KEYS.VIET],
    subLabel: "2. Tập làm văn",
    label: "Tập làm văn",
    description: "AI sinh 1 đề bài viết văn (AI nhẹ)",
    isAiGenerated: true,
    implemented: true,
  },
};

/** Trả về danh sách khối theo đúng thứ tự I. Đọc -> II. Viết (dùng cho UI + ráp kết quả cuối). */
export function listBlocks() {
  return Object.values(VIETNAMESE_EXAM_BLOCKS).sort((a, b) => a.order - b.order);
}

export function getBlock(key) {
  return VIETNAMESE_EXAM_BLOCKS[key] || null;
}
