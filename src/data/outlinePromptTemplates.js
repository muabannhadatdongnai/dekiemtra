/**
 * outlinePromptTemplates.js
 * Dựng prompt cho AI soạn "Đề cương Ôn tập" (Bước 2 / Nhóm B) - tái dùng subjectProfiles.js
 * (vai trò AI theo môn) đúng tinh thần promptTemplates.js/lessonPlanPromptTemplates.js, nhưng
 * schema JSON đầu ra khác hẳn: cấu trúc "3 Trụ cột" (xem outlineTemplates.js).
 *
 * Nguồn kiến thức: TÁI DÙNG NGUYÊN VẸN kho Markdown SGK (githubService.js) - đọc CÙNG 1 nguồn
 * với Đề kiểm tra/Giáo án, đảm bảo nội dung ôn tập nhất quán với 2 tính năng kia. Phạm vi có thể
 * gộp NHIỀU chương cùng lúc (ôn tập giữa/cuối kỳ) - khác Giáo án (luôn 1 bài/1 chương).
 *
 * Đầu ra KHÔNG dùng LaTeX (giống Giáo án, khác Đề kiểm tra): outlineExportService.js xuất Word
 * bằng Paragraph/TextRun thuần, KHÔNG có pipeline LaTeX -> MathML -> OMML như exportService.js,
 * nên mọi công thức/số liệu phải viết bằng ký hiệu toán học thông thường.
 */

import { getSubjectProfile } from "./subjectProfiles";
import { OUTLINE_LEVELS, OUTLINE_LEVEL_LABELS, OUTLINE_LEVEL_ORDER } from "./outlineTemplates";

export const OUTLINE_MODEL = "gemini-3.5-flash"; // đồng bộ LESSON_PLAN_MODEL (lessonPlanPromptTemplates.js)

function buildExerciseCountsBlock(exerciseCounts) {
  return OUTLINE_LEVEL_ORDER.map(
    (level) => `  - ${OUTLINE_LEVEL_LABELS[level]}: ${exerciseCounts[level] || 0} bài`
  ).join("\n");
}

function buildExerciseBankSchemaBlock(exerciseCounts) {
  return OUTLINE_LEVEL_ORDER.map((level) => {
    const count = exerciseCounts[level] || 0;
    return `    "${level}": [ ${count > 0 ? '{ "de": "...", "dapAn": "..." }' : ""} ]`;
  }).join(",\n");
}

export function buildOutlinePrompt({
  subject,
  grade,
  volume = 1,
  chapterLabel = "",
  sourceMarkdown = "",
  exerciseCounts,
  yeuCauDacBiet = "",
}) {
  const subjectProfile = getSubjectProfile(subject);
  const gradeLabel = `Lớp ${grade}`;

  const sourceBlock = sourceMarkdown
    ? `NGUỒN TÀI LIỆU SGK (bám sát nội dung này, KHÔNG bịa kiến thức ngoài chương trình):\n"""\n${sourceMarkdown}\n"""`
    : `⚠️ Không có tài liệu SGK cụ thể được cung cấp cho lượt soạn này - hãy dựa vào kiến thức chuẩn
chương trình phổ thông Việt Nam hiện hành cho ${gradeLabel}, môn ${subjectProfile.label}, phạm vi:
${chapterLabel || "(không rõ, tự xác định theo chương trình)"}.`;

  const extraBlock = yeuCauDacBiet
    ? `\nYÊU CẦU ĐẶC BIỆT TỪ GIÁO VIÊN (ưu tiên đáp ứng nếu không mâu thuẫn với các quy tắc bắt buộc\nở trên): ${yeuCauDacBiet}\n`
    : "";

  const outputSchema = `{
  "tenDeCuong": "Đề cương ôn tập ${subjectProfile.label} - ${gradeLabel}${chapterLabel ? ` - ${chapterLabel}` : ""}",
  "kienThucCotLoi": [
    { "tieuMuc": "...", "noiDung": "..." }
  ],
  "dangBai": [
    { "tenDang": "...", "luuY": "...", "baiMauDe": "...", "baiMauLoiGiai": "..." }
  ],
  "nganHangBaiTap": {
${buildExerciseBankSchemaBlock(exerciseCounts)}
  },
  "thuNgoPhuHuynh": "..."
}`;

  return `
BẠN LÀ ${subjectProfile.expertRole.toUpperCase()}, ĐỒNG THỜI LÀ CHUYÊN GIA BIÊN SOẠN ĐỀ CƯƠNG ÔN TẬP
GIÚP HỌC SINH TỰ HỌC Ở NHÀ.

THÔNG TIN ĐỀ CƯƠNG:
- Môn: ${subjectProfile.label}
- Cấp/Lớp: ${gradeLabel}
- Phạm vi ôn tập: ${chapterLabel || "(theo tài liệu cung cấp bên dưới)"}

QUY TẮC BẮT BUỘC - CẤU TRÚC "3 TRỤ CỘT":

1. "kienThucCotLoi" (Trụ cột 1 - Kiến thức cốt lõi): liệt kê CÁC TIỂU MỤC lý thuyết/công thức/quy
   tắc TRỌNG TÂM nhất trong phạm vi đã nêu, viết NGẮN GỌN, DỄ NHỚ (như "sổ tay ôn thi"), không lan
   man giảng lại nguyên văn SGK. Mỗi tiểu mục là 1 phần tử { "tieuMuc", "noiDung" }.

2. "dangBai" (Trụ cột 2 - Dạng bài + bài mẫu): liệt kê CÁC DẠNG BÀI thường gặp nhất trong phạm vi
   ôn tập (đúng những dạng hay xuất hiện trong đề kiểm tra), MỖI dạng gồm:
   - "tenDang": tên dạng bài (VD: "Dạng 1: Tính giá trị biểu thức có ngoặc").
   - "luuY": 1-2 câu mẹo/lưu ý khi làm dạng này (lỗi hay gặp, cách nhận diện dạng bài).
   - "baiMauDe" + "baiMauLoiGiai": 1 BÀI MẪU CỤ THỂ cho dạng này, "baiMauLoiGiai" PHẢI trình bày
     ĐẦY ĐỦ CÁC BƯỚC giải (không chỉ đáp số) để học sinh học được CÁCH LÀM, không chỉ học thuộc
     đáp án.

3. "nganHangBaiTap" (Trụ cột 3 - Ngân hàng bài tập 3 mức): bài tập để học sinh TỰ LUYỆN, chia
   đúng 3 mức độ tăng dần độ khó, đúng SỐ LƯỢNG giáo viên yêu cầu cho từng mức:
${buildExerciseCountsBlock(exerciseCounts)}
   Khác với bài mẫu ở Trụ cột 2: mỗi bài ở đây CHỈ có "de" (đề bài) và "dapAn" (ĐÁP SỐ NGẮN GỌN,
   KHÔNG giải thích các bước) - đây là bài tự luyện, không phải bài giảng mẫu.
   - Mức "${OUTLINE_LEVEL_LABELS[OUTLINE_LEVELS.CO_BAN]}": bài cơ bản, áp dụng trực tiếp kiến thức
     cốt lõi, không đánh đố.
   - Mức "${OUTLINE_LEVEL_LABELS[OUTLINE_LEVELS.NANG_CAO]}": kết hợp 2-3 kiến thức, cần suy luận
     thêm 1 bước so với mức cơ bản.
   - Mức "${OUTLINE_LEVEL_LABELS[OUTLINE_LEVELS.VAN_DUNG_CAO]}": bài thử thách, đòi hỏi vận dụng
     linh hoạt/liên hệ thực tế, dành cho học sinh khá giỏi muốn nâng cao.
   Nếu 1 mức được yêu cầu 0 bài, trả về mảng RỖNG "[]" cho đúng mức đó (không tự thêm bài ngoài
   yêu cầu).

4. "thuNgoPhuHuynh": viết 1 ĐOẠN THƯ NGỎ NGẮN (4-6 câu) gửi PHỤ HUYNH, giọng văn ẤM ÁP, GẦN GŨI
   (không phải văn phong hành chính) - giải thích ngắn gọn phạm vi con đang ôn tập, gợi ý CỤ THỂ
   cách phụ huynh có thể đồng hành tại nhà (VD: mỗi ngày cùng con làm 1-2 bài mức Cơ bản trước,
   kiểm tra qua đáp án, khuyến khích con thử sức mức Nâng cao/Vận dụng cao khi đã vững). KHÔNG
   nhắc lại nguyên văn nội dung kiến thức/bài tập ở trên, chỉ là lời nhắn đồng hành.

QUY TẮC CHUNG:
- Ngôn ngữ: Tiếng Việt chuẩn mực, phù hợp lứa tuổi ${gradeLabel}.
- Đầu ra CHỈ trả về JSON hợp lệ theo đúng schema, không kèm giải thích, không markdown code fence.
- ⚠️ TUYỆT ĐỐI KHÔNG dùng cú pháp LaTeX (KHÔNG dùng dấu $...$, $$...$$, và KHÔNG dùng dấu ngã "~"
  để ngăn cách chữ số) ở BẤT KỲ đâu, kể cả với môn Toán. Đây là tài liệu in trực tiếp (không qua
  công cụ hiển thị công thức), MỌI số liệu/công thức phải viết bằng CHỮ SỐ VÀ KÝ HIỆU TOÁN HỌC
  THÔNG THƯỜNG (VD: viết "3 + 4 = 7", KHÔNG viết "$3 + 4 = 7$").
${subject === "Toan" ? `\nQUY TẮC RIÊNG MÔN TOÁN (LƯU Ý: phần dưới đây có thể nhắc tới LaTeX vì vốn viết cho phần ra ĐỀ\nKIỂM TRA - khi soạn ĐỀ CƯƠNG vẫn áp dụng quy tắc nội dung/số liệu nhưng BỎ QUA hoàn toàn yêu cầu\ndùng LaTeX, luôn viết bằng ký hiệu thông thường như quy tắc bắt buộc ở trên):\n${subjectProfile.extraRules}` : ""}

${sourceBlock}
${extraBlock}
Hãy trả về JSON theo đúng schema sau (không thêm trường nào khác ngoài schema):
${outputSchema}
`.trim();
}
