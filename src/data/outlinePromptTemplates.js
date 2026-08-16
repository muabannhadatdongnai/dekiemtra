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
 *
 * Bước 3/Nhóm E (phản hồi thực tế sau khi test, đã sửa): schema thêm "canhBaoBayLoi" (mỗi dạng
 * bài, Trụ cột 2) và "loTrinhOnTap" (checklist theo NGÀY, số ngày do giáo viên tự nhập qua
 * "soNgayOnTap" - KHÔNG để AI tự ước lượng, đã chốt với người dùng). "baiMauLoiGiai" (lời giải
 * bài mẫu) giờ LUÔN hiển thị ở CẢ 2 phiên bản xuất file (xem outlineExportService.js) - trước đây
 * bị ẩn nhầm ở bản Học sinh, đây là lỗi nghiêm trọng nhất trong phản hồi Bước 3.
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
  soNgayOnTap,
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
    { "tenDang": "...", "luuY": "...", "baiMauDe": "...", "baiMauLoiGiai": "...", "canhBaoBayLoi": "..." }
  ],
  "nganHangBaiTap": {
${buildExerciseBankSchemaBlock(exerciseCounts)}
  },
  "loTrinhOnTap": [
    { "ngay": "Ngày 1", "nhiemVu": "..." }
  ],
  "thuNgoPhuHuynh": "..."
}`;

  return `
BẠN LÀ ${subjectProfile.expertRole.toUpperCase()}, ĐỒNG THỜI LÀ CHUYÊN GIA BIÊN SOẠN ĐỀ CƯƠNG ÔN TẬP
GIÚP HỌC SINH TỰ HỌC Ở NHÀ.

THÔNG TIN ĐỀ CƯƠNG:
- Môn: ${subjectProfile.label}
- Cấp/Lớp: ${gradeLabel}
- Phạm vi ôn tập: ${chapterLabel || "(theo tài liệu cung cấp bên dưới)"}
- Số ngày ôn tập giáo viên yêu cầu: ${soNgayOnTap} ngày

QUY TẮC BẮT BUỘC - CẤU TRÚC "3 TRỤ CỘT" + LỘ TRÌNH ÔN TẬP:

1. "kienThucCotLoi" (Trụ cột 1 - Kiến thức cốt lõi): liệt kê CÁC TIỂU MỤC lý thuyết/công thức/quy
   tắc TRỌNG TÂM nhất trong phạm vi đã nêu, viết NGẮN GỌN, DỄ NHỚ (như "sổ tay ôn thi"), không lan
   man giảng lại nguyên văn SGK. Mỗi tiểu mục là 1 phần tử { "tieuMuc", "noiDung" }.

2. "dangBai" (Trụ cột 2 - Dạng bài + bài mẫu): liệt kê CÁC DẠNG BÀI thường gặp nhất trong phạm vi
   ôn tập (đúng những dạng hay xuất hiện trong đề kiểm tra), MỖI dạng gồm:
   - "tenDang": tên dạng bài (VD: "Dạng 1: Tính giá trị biểu thức có ngoặc").
   - "luuY": 1-2 câu mẹo/lưu ý khi làm dạng này (lỗi hay gặp, cách nhận diện dạng bài).
   - "baiMauDe" + "baiMauLoiGiai": 1 BÀI MẪU CỤ THỂ cho dạng này, "baiMauLoiGiai" PHẢI trình bày
     ĐẦY ĐỦ CÁC BƯỚC giải (không chỉ đáp số) để học sinh học được CÁCH LÀM, không chỉ học thuộc
     đáp án. ⚠️ "baiMauLoiGiai" LUÔN được hiển thị cho học sinh (không bị ẩn ở bất kỳ phiên bản
     nào) - vì vậy PHẢI viết đủ chi tiết, tự thân đọc hiểu được mà không cần thêm giải thích khác.
   - "canhBaoBayLoi": 1 câu CẢNH BÁO LỖI SAI HỌC SINH HAY MẮC PHẢI khi làm dạng bài này (VD: sai
     dấu, nhầm đơn vị, đặt tính lệch cột, quên đổi đơn vị...) - viết giọng gần gũi, nhắc nhở nhẹ
     nhàng như lời cô giáo dặn dò (VD: "Khi cộng số thập phân, nhiều bạn hay đặt các chữ số cuối
     cùng thẳng cột thay vì đặt dấu phẩy thẳng cột. Các con nhớ cẩn thận nhé!"). BẮT BUỘC có cho
     MỌI dạng bài, không được để trống.

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

4. "loTrinhOnTap" (Lộ trình Ôn tập - checklist theo ngày): chia TOÀN BỘ khối lượng ôn tập (Kiến
   thức cốt lõi + Dạng bài + Ngân hàng bài tập ở trên) thành ĐÚNG ${soNgayOnTap} NHIỆM VỤ theo
   ngày (mảng "loTrinhOnTap" PHẢI có ĐÚNG ${soNgayOnTap} phần tử, mỗi phần tử 1 ngày, KHÔNG được
   nhiều hơn hoặc ít hơn). Mỗi phần tử { "ngay": "Ngày N", "nhiemVu": "..." }:
   - "ngay": ghi đúng "Ngày 1", "Ngày 2", ... "Ngày ${soNgayOnTap}" theo thứ tự.
   - "nhiemVu": 1 CÂU nhiệm vụ CỤ THỂ, VỪA SỨC cho ngày đó (VD: "Đọc hiểu Lý thuyết Chương 1 + Làm
     3 bài Mức Cơ bản Dạng 1"), phân bổ HỢP LÝ và TĂNG DẦN độ khó qua các ngày (những ngày đầu ưu
     tiên Kiến thức cốt lõi + bài mẫu, những ngày giữa/cuối ưu tiên luyện Ngân hàng bài tập, ngày
     cuối cùng nên là ôn tập tổng hợp/luyện đề). KHÔNG lặp lại nguyên văn nội dung đã liệt kê ở
     Trụ cột 1-3, chỉ NHẮC TÊN việc cần làm.

5. "thuNgoPhuHuynh": viết 1 ĐOẠN THƯ NGỎ NGẮN (4-6 câu) gửi PHỤ HUYNH, giọng văn ẤM ÁP, GẦN GŨI
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
- ⚠️ SỐ THẬP PHÂN BẮT BUỘC dùng DẤU PHẨY (,) để ngăn cách phần nguyên và phần thập phân, đúng
  chuẩn trình bày Toán học Việt Nam (VD: viết "15,6" và "12,34", TUYỆT ĐỐI KHÔNG viết "15.6" hay
  "12.34" kiểu dấu chấm quốc tế) - áp dụng cho MỌI số thập phân xuất hiện ở bất kỳ đâu trong đề
  cương (kiến thức cốt lõi, bài mẫu, lời giải, ngân hàng bài tập, đáp án...). Dấu chấm (.) CHỈ
  được dùng để phân tách nhóm ba chữ số ở SỐ NGUYÊN lớn nếu cần (VD: "1.000.000"), KHÔNG dùng cho
  số thập phân.
- Đơn vị đo có số mũ (diện tích, thể tích...) PHẢI viết bằng ký hiệu số mũ trên thật (Unicode
  superscript, VD: "km²", "m²", "cm³"), KHÔNG viết số thường ngay sau chữ cái (KHÔNG viết "km2",
  "m2", "cm3").
- Phân số viết theo dạng "tử số/mẫu số" (VD: "3/4", "1 và 1/4" cho hỗn số) - đây là cách trình bày
  AN TOÀN nhất khi không có công cụ hiển thị công thức, KHÔNG cần viết dạng phân số nằm dọc.
${subject === "Toan" ? `\nQUY TẮC RIÊNG MÔN TOÁN (LƯU Ý: phần dưới đây có thể nhắc tới LaTeX vì vốn viết cho phần ra ĐỀ\nKIỂM TRA - khi soạn ĐỀ CƯƠNG vẫn áp dụng quy tắc nội dung/số liệu nhưng BỎ QUA hoàn toàn yêu cầu\ndùng LaTeX, luôn viết bằng ký hiệu thông thường như quy tắc bắt buộc ở trên):\n${subjectProfile.extraRules}` : ""}

${sourceBlock}
${extraBlock}
Hãy trả về JSON theo đúng schema sau (không thêm trường nào khác ngoài schema):
${outputSchema}
`.trim();
}
