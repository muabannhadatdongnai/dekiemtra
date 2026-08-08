/**
 * lessonPlanSampleSchema.js
 * Định nghĩa "spec cấu trúc/trình bày" trích xuất từ 1 GIÁO ÁN MẪU do giáo viên upload
 * (docx/pdf/ảnh chụp) - dùng cho tính năng "Bám sát mẫu" / "Kết hợp mẫu + SGK" của module Soạn
 * giáo án. Cùng nguyên tắc thiết kế với sampleExamSchema.js/worksheetSampleSchema.js: AI CHỈ
 * được trả về mô tả PHONG CÁCH/CẤU TRÚC (không phải nội dung bài học cụ thể), code luôn tự
 * validate lại (sanitizeLessonPlanSampleSpec), không tin AI tuyệt đối.
 *
 * ⚠️ KHÁC VỚI sampleExamSchema.js: đề mẫu (đề kiểm tra) do NXB/người khác biên soạn nên phải né
 * hoàn toàn nội dung vì lý do bản quyền. Giáo án mẫu thường là CHÍNH giáo viên đang dùng (mẫu
 * trường/tổ chuyên môn quy định) - rủi ro bản quyền thấp hơn, nhưng vẫn giữ nguyên tắc AN TOÀN:
 * spec chỉ mô tả CẤU TRÚC/CÁCH TRÌNH BÀY (thứ tự mục, cách đánh số, có bảng 2 cột hay không,
 * thông tin phần đầu trang...), TUYỆT ĐỐI KHÔNG lưu lại nguyên văn nội dung bài dạy cụ thể của
 * giáo án mẫu - nội dung bài học mới vẫn phải do AI tự soạn theo "Nội dung cốt lõi"/SGK, spec
 * này chỉ định hình CÁCH TRÌNH BÀY.
 */

export const NUMBERING_STYLES = ["buoc_so_va_abcd", "chi_buoc_so", "chi_gach_dau_dong", "khong_ro"];

const MAX_FREE_TEXT_LENGTH = 400;
const MAX_HEADINGS = 10;
const MAX_HEADING_LENGTH = 60;

export const EMPTY_LESSON_PLAN_SAMPLE_SPEC = {
  sectionHeadings: [], // các đề mục quan sát thấy, ĐÚNG thứ tự (VD "I. Mục tiêu", "II. Chuẩn bị"...)
  numberingStyle: null, // "buoc_so_va_abcd" | "chi_buoc_so" | "chi_gach_dau_dong" | "khong_ro"
  useTwoColumnTable: null, // true/false/null (null = không xác định được từ mẫu)
  headerInfoHints: "", // thông tin xuất hiện ở đầu trang: trường, GV, lớp, ngày dạy... (mô tả ngắn)
  presentationNotes: "", // ghi chú khác về cách trình bày (font chữ đậm/nghiêng, căn lề, độ chi tiết...)
};

function clampText(value, maxLen = MAX_FREE_TEXT_LENGTH) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function clampHeadings(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v) => typeof v === "string" && v.trim())
    .slice(0, MAX_HEADINGS)
    .map((v) => v.trim().slice(0, MAX_HEADING_LENGTH));
}

/** "Làm sạch" spec do AI trả về - không bao giờ throw, luôn trả về object hợp lệ đúng shape. */
export function sanitizeLessonPlanSampleSpec(raw) {
  if (!raw || typeof raw !== "object") return { ...EMPTY_LESSON_PLAN_SAMPLE_SPEC };

  return {
    sectionHeadings: clampHeadings(raw.sectionHeadings),
    numberingStyle: NUMBERING_STYLES.includes(raw.numberingStyle) ? raw.numberingStyle : null,
    useTwoColumnTable: typeof raw.useTwoColumnTable === "boolean" ? raw.useTwoColumnTable : null,
    headerInfoHints: clampText(raw.headerInfoHints),
    presentationNotes: clampText(raw.presentationNotes),
  };
}

/** Có đủ thông tin hữu ích để áp dụng vào luồng soạn giáo án hay không - nếu không, bỏ qua thay
 * vì "ép" theo 1 spec gần như rỗng (giống isUsableSampleExamSpec/isUsableWorksheetSampleSpec). */
export function isUsableLessonPlanSampleSpec(spec) {
  return Boolean(
    spec?.sectionHeadings?.length ||
      spec?.numberingStyle ||
      spec?.headerInfoHints ||
      spec?.presentationNotes ||
      typeof spec?.useTwoColumnTable === "boolean"
  );
}
