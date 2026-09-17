/**
 * khgdPromptTemplates.js
 * Dựng prompt cho AI soạn phần "lồng ghép" trong tab Khung KHGD (Phụ lục III, CV 5512) -
 * KHÁC HẲN outlinePromptTemplates.js/lessonPlanPromptTemplates.js ở chỗ: AI KHÔNG soạn toàn bộ
 * tài liệu, CHỈ soạn 2 trường "swd" (SWD - Students with Disabilities, mục tiêu lồng ghép khuyết
 * tật) và "nls" (Biểu hiện Năng lực số) cho TỪNG bài trong danh sách giáo viên đã nhập sẵn (tên
 * bài/số tiết/tuần/thiết bị/địa điểm - xem khgdBlueprint.js). Việc tách bạch này giúp AI KHÔNG
 * BAO GIỜ được phép tự sửa số tiết/tuần - đúng yêu cầu đã chốt với người dùng.
 *
 * Tái dùng getSubjectProfile() (subjectProfiles.js) để lấy "vai trò chuyên gia" theo môn, và
 * buildForeignLanguageOutputDirective() (foreignLanguageSubjects.js) để môn Ngoại ngữ (Tiếng
 * Anh/Trung/Nhật/Pháp) viết "swd" bằng CHÍNH ngôn ngữ đó - đúng văn phong bản mẫu Bộ GDĐT (Phụ
 * lục III môn Tiếng Anh viết SWD bằng tiếng Anh). "nls" LUÔN viết bằng tiếng Việt bất kể môn học
 * nào (đây là mô tả 1 hoạt động ứng dụng công nghệ - năng lực CHUNG, không phải ngữ liệu học
 * thuật của môn ngoại ngữ) - dùng exemptJsonFields: ["nls"] để loại trừ đúng trường này khỏi chỉ
 * thị ngôn ngữ ngoại ngữ.
 */

import { getSubjectProfile } from "@/data/subjectProfiles";
import { buildForeignLanguageOutputDirective } from "@/data/foreignLanguageSubjects";

export const KHGD_MODEL = "gemini-3.5-flash"; // đồng bộ OUTLINE_MODEL/LESSON_PLAN_MODEL

function buildLessonListBlock(lessons) {
  return lessons
    .map((l, i) => `${i + 1}. [id="${l.id}"] "${l.tenBai}" - Số tiết: ${l.soTiet || "?"}`)
    .join("\n");
}

export function buildKhgdPrompt({ subject, grade, lessons, enableSwd, enableNls }) {
  const subjectProfile = getSubjectProfile(subject);
  const gradeLabel = `Lớp ${grade}`;
  const languageDirective = buildForeignLanguageOutputDirective(subject, { exemptJsonFields: ["nls"] });

  const swdInstruction = enableSwd
    ? `- "swd": mảng 3-5 CÂU NGẮN, mô tả MỤC TIÊU/YÊU CẦU CẦN ĐẠT ĐÃ ĐƯỢC ĐIỀU CHỈNH ĐƠN GIẢN HOÁ dành
  cho học sinh khuyết tật (SWD - Students with Disabilities) khi học bài này, PHÙ HỢP với nội dung
  bài (không sao chép mục tiêu của học sinh đại trà) - VÍ DỤ văn phong (không sao chép nguyên
  văn): "Recognise some basic words related to the topic through pictures and videos.",
  "Participate in simple pair activities with support.". Mỗi câu là 1 hành động QUAN SÁT ĐƯỢC
  (dùng động từ như Recognise/Identify/Listen and repeat/Answer/Participate/Complete... hoặc động
  từ tiếng Việt tương đương "Nhận biết/Nhận diện/Nghe và nhắc lại/Trả lời/Tham gia/Hoàn thành..."
  tuỳ ngôn ngữ đầu ra), độ khó THẤP HƠN RÕ RỆT so với học sinh đại trà, luôn có ít nhất 1 câu về
  "tham gia hoạt động CÓ HỖ TRỢ (with support/có sự hỗ trợ)".`
    : "";

  const nlsInstruction = enableNls
    ? `- "nls": 1 đoạn NGẮN (1-3 câu, TIẾNG VIỆT, bất kể môn học gì) mô tả 1 HOẠT ĐỘNG ỨNG DỤNG CÔNG
  NGHỆ SỐ gắn với bài học này (VD: tạo video/slide trình bày bằng công cụ số, tìm kiếm & đánh giá
  độ tin cậy nguồn thông tin trên Internet, lập bảng tính thống kê, thiết kế poster/infographic
  bằng phần mềm, khảo sát online, hợp tác chia sẻ tài liệu nhóm...) - CHỈ NÊN gán cho những bài
  THỰC SỰ phù hợp để tích hợp hoạt động số (thường là bài "Getting started" mở đầu 1 chủ đề/chương,
  hoặc bài "Looking back/Project/Ôn tập" cuối chủ đề) - PHẦN LỚN các bài còn lại (bài luyện tập từ
  vựng/ngữ pháp/kỹ năng thông thường) để "nls": "" (CHUỖI RỖNG, KHÔNG bịa hoạt động số gượng ép cho
  mọi bài). Ước tính hợp lý: khoảng 1 bài có "nls" không rỗng trên mỗi 6-8 bài liên tiếp.`
    : "";

  const fieldsSchema = [enableSwd ? `"swd": ["...", "..."]` : null, enableNls ? `"nls": "..."` : null]
    .filter(Boolean)
    .join(", ");

  return `
BẠN LÀ ${subjectProfile.expertRole.toUpperCase()}, ĐANG HỖ TRỢ GIÁO VIÊN HOÀN THIỆN "KHUNG KẾ HOẠCH
GIÁO DỤC CỦA GIÁO VIÊN" (Phụ lục III, Công văn 5512/BGDĐT-GDTrH) - PHẦN "LỒNG GHÉP GIÁO DỤC HỌC
SINH KHUYẾT TẬT (SWD)" ${enableNls ? 'VÀ "BIỂU HIỆN NĂNG LỰC SỐ (NLS)"' : ""} cho danh sách bài học
dưới đây.

THÔNG TIN CHUNG:
- Môn: ${subjectProfile.label}
- Lớp: ${gradeLabel}

⚠️ QUAN TRỌNG NHẤT: bạn KHÔNG được thay đổi/tự đoán lại tên bài, số tiết, tuần dạy - CHỈ soạn
thêm đúng (các) trường được yêu cầu bên dưới cho MỖI bài trong danh sách. Danh sách bài học (giáo
viên đã tự biên soạn phân phối chương trình, số tiết do giáo viên tự quyết định):
${buildLessonListBlock(lessons)}

YÊU CẦU ĐẦU RA CHO MỖI BÀI:
${swdInstruction}
${nlsInstruction}
${languageDirective}

ĐỊNH DẠNG JSON TRẢ VỀ (BẮT BUỘC, KHÔNG kèm giải thích/markdown ngoài JSON):
{
  "lessons": [
    { "id": "(chép lại ĐÚNG id đã cho ở trên)", ${fieldsSchema} }
  ]
}
Mảng "lessons" PHẢI có ĐỦ ${lessons.length} phần tử, ĐÚNG THỨ TỰ và ĐÚNG "id" như danh sách đã
cho ở trên - KHÔNG được bỏ sót, KHÔNG được thêm bài ngoài danh sách.
`;
}
