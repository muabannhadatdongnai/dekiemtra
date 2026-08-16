/**
 * lessonPlanPromptTemplates.js
 * Dựng prompt cho AI soạn "Kế hoạch bài dạy" (giáo án) - tái dùng subjectProfiles.js (vai trò AI
 * theo môn) giống promptTemplates.js bên đề thi, nhưng schema JSON đầu ra khác hẳn (giáo án
 * không phải câu hỏi thi).
 *
 * Nguồn kiến thức: TÁI DÙNG NGUYÊN VẸN kho Markdown SGK đã có (githubService.js) - giáo án và đề
 * kiểm tra CÙNG đọc 1 nguồn duy nhất, đảm bảo nội dung nhất quán giữa 2 tính năng. Với Mầm non
 * (không có "chương SGK"), bỏ qua bước tải Markdown, chỉ dựa vào "Nội dung cốt lõi" giáo viên gõ
 * + kiến thức chung về Chương trình Giáo dục Mầm non.
 */

import { getSubjectProfile } from "./subjectProfiles";
import {
  getCircularForGrade,
  isPreschoolGrade,
  getActivityLabels,
  computeMultiPeriodTimeline,
} from "./lessonPlanTemplates";
import { buildIntegrationsPromptBlock, collectIntegrationSchemaExamples } from "./lessonPlanIntegrations";
import { buildLessonPlanStylePromptFragment } from "./lessonPlanStyles";
import { generateAntiDuplicationSeed } from "./promptTemplates";

export const LESSON_PLAN_MODEL = "gemini-3.5-flash"; // đồng bộ FREE_TIER_MODEL bên promptTemplates.js

// multiPeriod=true -> mỗi bước trong "tienTrinh" cần thêm trường "tiet" (số tiết bước đó diễn ra),
// xem buildMultiPeriodGuidance() để biết lý do (đủ 2 tiết trở lên cần ranh giới rõ ràng giữa các tiết).
function buildActivitySchemaBlock(activities, multiPeriod) {
  const stepExample = multiPeriod
    ? `{ "tiet": 1, "hoatDongGVHS": "...", "sanPhamDuKien": "..." }`
    : `{ "hoatDongGVHS": "...", "sanPhamDuKien": "..." }`;
  return activities
    .map((a) => `      { "ten": "${a.label}", "mucTieu": "...", "tienTrinh": [ ${stepExample} ] }`)
    .join(",\n");
}



const NUMBERING_STYLE_LABELS = {
  buoc_so_va_abcd: 'có đủ cả "Bước 1/2/3..." và tiểu mục "a)/b)/c)..."',
  chi_buoc_so: 'chỉ đánh số "Bước 1/2/3...", không có tiểu mục a)/b)/c)',
  chi_gach_dau_dong: "chỉ dùng gạch đầu dòng, không đánh số bước",
  khong_ro: "không có cấu trúc bước rõ ràng",
};

/**
 * buildLessonPlanSampleGuidance()
 * Đúng tinh thần buildSampleExamGuidance() bên promptTemplates.js (đề kiểm tra): mô tả CÁCH
 * TRÌNH BÀY của giáo án mẫu giáo viên upload, KHÔNG chèn nội dung bài học cụ thể của mẫu vào đây
 * (xem nguyên tắc an toàn đầy đủ trong lessonPlanSampleSchema.js).
 *
 * 2 chế độ (khớp SAMPLE_MODES phía LessonPlanForm.jsx):
 *  - "theo_mau": ƯU TIÊN bám sát cấu trúc/cách trình bày của mẫu hơn khung CV2345/5512 mặc định.
 *  - "ket_hop": áp dụng cách trình bày của mẫu NHƯNG vẫn giữ đủ khung mục I-IV chuẩn + vẫn ưu
 *    tiên bám sát SGK (sourceMarkdown) cho phần NỘI DUNG - mẫu chỉ ảnh hưởng HÌNH THỨC.
 * "theo_chuong"/null: không dùng mẫu, giữ nguyên hành vi cũ (trả về "").
 */
function buildLessonPlanSampleGuidance(sampleMode, sampleSpec, referenceText) {
  if (!sampleMode || sampleMode === "theo_chuong" || !sampleSpec) return "";

  const parts = [];
  if (sampleSpec.sectionHeadings?.length) {
    parts.push(`- Thứ tự các đề mục lớn trong mẫu: ${sampleSpec.sectionHeadings.join(" → ")}`);
  }
  if (sampleSpec.numberingStyle && NUMBERING_STYLE_LABELS[sampleSpec.numberingStyle]) {
    parts.push(`- Cách đánh số các bước trong mẫu: ${NUMBERING_STYLE_LABELS[sampleSpec.numberingStyle]}`);
  }
  if (typeof sampleSpec.useTwoColumnTable === "boolean") {
    parts.push(
      sampleSpec.useTwoColumnTable
        ? "- Mẫu trình bày phần hoạt động dạy học dạng BẢNG 2 cột (Hoạt động GV-HS / Sản phẩm dự kiến)."
        : "- Mẫu trình bày phần hoạt động dạy học liền mạch, KHÔNG dùng bảng 2 cột."
    );
  }
  if (sampleSpec.headerInfoHints) parts.push(`- Thông tin đầu trang trong mẫu: ${sampleSpec.headerInfoHints}`);
  if (sampleSpec.presentationNotes) parts.push(`- Ghi chú trình bày khác: ${sampleSpec.presentationNotes}`);
  if (parts.length === 0) return "";

  const priorityNote =
    sampleMode === "theo_mau"
      ? "Hãy ƯU TIÊN bám sát CÁCH TRÌNH BÀY của giáo án mẫu này hơn khung mục mặc định đã nêu ở trên " +
        "(vẫn giữ đủ nội dung yêu cầu chuyên môn, chỉ đổi HÌNH THỨC trình bày cho khớp mẫu)."
      : "Hãy áp dụng CÁCH TRÌNH BÀY của giáo án mẫu này (đánh số, bố cục, thông tin đầu trang) NHƯNG " +
        "vẫn giữ đủ khung mục I-IV chuẩn đã nêu ở trên, và vẫn ưu tiên bám sát NGUỒN TÀI LIỆU SGK cho " +
        "phần nội dung kiến thức (mẫu chỉ ảnh hưởng hình thức, không thay thế nguồn kiến thức).";

  const referenceBlock =
    sampleMode === "theo_mau" && referenceText
      ? `\n\nĐOẠN TRÍCH THAM KHẢO CÁCH HÀNH VĂN TỪ GIÁO ÁN MẪU (chỉ để cảm nhận VĂN PHONG/CÁCH DIỄN ĐẠT,\nTUYỆT ĐỐI KHÔNG chép lại nguyên văn bất kỳ câu nào, không dùng lại nội dung bài học cụ thể trong\nđoạn này cho bài dạy MỚI đang soạn):\n"""\n${referenceText}\n"""`
      : "";

  return `
CÁCH TRÌNH BÀY GIÁO ÁN MẪU (do giáo viên cung cấp - chế độ "${
    sampleMode === "theo_mau" ? "Bám sát mẫu" : "Kết hợp mẫu + SGK"
  }"):
${parts.join("\n")}
${priorityNote}${referenceBlock}
`;
}

/**
 * buildMultiPeriodGuidance()
 * Cung cấp cho AI "khung thời lượng" đã tính SẴN THUẦN CODE theo từng tiết học (xem
 * computeMultiPeriodTimeline() trong lessonPlanTemplates.js) - LUÔN đưa vào prompt (không phụ
 * thuộc tuỳ chọn "Timeline" có bật hiển thị hay không), để nội dung AI viết ra thực tế/khả thi
 * ngay cả khi giáo viên không bật hiển thị số phút. Khắc phục 2 phản ánh của giáo viên:
 * 1. Hoạt động "Khởi động" quá dài (11 phút) do trước đây không có trần thời lượng hợp lý.
 * 2. Bài dạy nhiều tiết bị gộp thành 1 mạch, không rõ điểm dừng giữa các tiết.
 */
function buildMultiPeriodGuidance(soTiet, grade, lessonType) {
  const periods = computeMultiPeriodTimeline(soTiet, grade, lessonType);
  const multiPeriod = periods.length > 1;
  const secondActivityLabel = getActivityLabels(lessonType).find((a) => a.key === "kham_pha")?.label || "Khám phá";
  const lines = periods.map(
    (p) =>
      `  Tiết ${p.period} (${p.totalMinutes} phút): ` +
      p.segments.map((s) => `${s.label} ~${s.minutes}'`).join(" → ")
  );

  if (!multiPeriod) {
    return {
      multiPeriod: false,
      text: `- Gợi ý phân bổ thời lượng cho tiết học (KHÔNG bắt buộc viết số phút vào nội dung, nhưng nội
  dung từng hoạt động PHẢI vừa đủ trong khoảng thời gian này, đặc biệt KHÔNG thiết kế "Khởi động"
  dài quá 7 phút dù là trò chơi hấp dẫn thế nào):
${lines.join("\n")}`,
    };
  }

  return {
    multiPeriod: true,
    text: `- ⚠️ BÀI DẠY NÀY CÓ ${periods.length} TIẾT - PHẢI CHIA RÕ RANH GIỚI GIỮA CÁC TIẾT, KHÔNG viết dồn
  thành 1 mạch liên tục như 1 tiết duy nhất. Gợi ý phân bổ hoạt động/thời lượng THEO TỪNG TIẾT
  (nội dung viết ra phải vừa đủ trong khoảng thời gian này):
${lines.join("\n")}
- Mỗi bước trong mảng "tienTrinh" của MỌI hoạt động PHẢI có thêm trường số nguyên "tiet" (1..${periods.length})
  cho biết bước đó diễn ra ở tiết thứ mấy - dựa theo gợi ý phân bổ ở trên (VD nếu "Luyện tập" được
  gợi ý vừa có ở Tiết 1 vừa có ở Tiết 2, hãy tách "tienTrinh" của hoạt động "Luyện tập" thành các
  bước có "tiet":1 (bài tập dễ/khởi đầu) và các bước có "tiet":2 (bài tập khó hơn/tổng hợp) - KHÔNG
  để tất cả các bước cùng dồn vào 1 tiết).
- "Khởi động" ở Tiết 1 là khởi động CHÍNH (đầy đủ, tạo hứng thú vào bài). "Khởi động" ở các tiết
  SAU đó (nếu "tienTrinh" của hoạt động "Khởi động" có bước với "tiet" > 1) PHẢI là "khởi động lại"
  RẤT NGẮN GỌN (trò chơi nhỏ/câu hỏi nhanh nhắc lại tiết trước), TUYỆT ĐỐI KHÔNG lặp lại y hệt nội
  dung khởi động của Tiết 1.
- Hoạt động "Vận dụng" CHỈ đặt ở tiết cuối cùng (tienTrinh chỉ có "tiet": ${periods.length}).
- ⚠️ QUAN TRỌNG NHẤT - "tiet" PHẢI TĂNG DẦN (KHÔNG BAO GIỜ GIẢM) khi đọc TUẦN TỰ từ bước đầu tiên
  của hoạt động "Khởi động" tới bước cuối cùng của hoạt động "Vận dụng" (đúng thứ tự 4 khối hoạt
  động sẽ hiển thị trong văn bản: Khởi động → ${secondActivityLabel} → Luyện tập → Vận dụng). Hãy
  hình dung TOÀN BỘ ${periods.length} tiết như 1 DÒNG THỜI GIAN DUY NHẤT chảy xuyên suốt cả 4 hoạt
  động, KHÔNG PHẢI 4 dòng thời gian riêng của từng hoạt động: nếu hoạt động đứng TRƯỚC (vd
  ${secondActivityLabel}) đã có bước với "tiet": 2, thì MỌI bước của hoạt động đứng NGAY SAU nó
  (vd Luyện tập) PHẢI có "tiet" ≥ 2, TUYỆT ĐỐI KHÔNG được quay lại "tiet": 1 (lỗi này khiến văn
  bản xuất ra bị chèn lặp dòng "Hết Tiết 1" nhiều lần dù Tiết 1 chỉ kết thúc 1 lần duy nhất, làm
  giáo viên đọc không hiểu mạch bài dạy).`,
  };
}

/**
 * GIAI ĐOẠN 10, Việc 3/7 - Lớp Prompt-level của cơ chế chống trùng liên giáo viên (xem
 * lessonPlanDiversityStore.js để biết đầy đủ bối cảnh + phạm vi đã chốt). Chỉ chèn block này khi
 * CÓ ít nhất 1 ý tưởng mở bài đã lưu trước đó cho ĐÚNG tổ hợp khối+môn+bài - nếu đây là lượt soạn
 * ĐẦU TIÊN cho tổ hợp này thì không có gì để "tránh trùng", trả về "" (không làm phình prompt vô ích).
 */
function buildDiversityGuidance(existingOpeningIdeas = []) {
  const ideas = existingOpeningIdeas.filter(Boolean);
  if (ideas.length === 0) return "";

  const seed = generateAntiDuplicationSeed();
  const list = ideas
    .slice(0, 15)
    .map((idea, i) => `${i + 1}. ${idea.slice(0, 150)}`)
    .join("\n");

  return `
CHỐNG TRÙNG LẶP GIỮA CÁC LẦN SOẠN (RẤT QUAN TRỌNG - bài học này đã từng được soạn trước đây, có
thể bởi giáo viên khác dùng cùng SGK): dưới đây là các Ý TƯỞNG MỞ BÀI/KHỞI ĐỘNG đã dùng cho ĐÚNG
bài học này ở những lượt soạn TRƯỚC ĐÓ - PHẢI nghĩ ra ý tưởng KHỞI ĐỘNG KHÁC, KHÔNG lặp lại tình
huống/trò chơi/ví dụ giống các ý tưởng dưới đây (có thể đổi hẳn hình thức: nếu ý tưởng cũ là trò
chơi, hãy đổi sang kể chuyện/câu đố/tình huống thực tế khác, hoặc ngược lại):
${list}
Mã định danh ngẫu nhiên riêng cho lượt soạn này (dùng làm "hạt giống" đa dạng hoá, KHÔNG in ra
trong nội dung giáo án): ${seed}
`;
}

export function buildLessonPlanPrompt({
  tenBai,
  grade,
  subject,
  soTiet = 1,
  noiDungCotLoi = "",
  sourceMarkdown = "", // "" nếu Mầm non hoặc không tải được - vẫn tạo được, chỉ kém bám sát SGK hơn
  chapterLabel = "",
  integrations = [],
  lessonType = "bai_moi", // "bai_moi" | "on_tap" | "thuc_hanh" - xem LESSON_TYPES (lessonPlanTemplates.js)
  sampleMode = "theo_chuong", // "theo_chuong" | "theo_mau" | "ket_hop"
  sampleSpec = null,
  sampleReferenceText = null,
  lessonPlanStyle = null, // { styleId, customStyleText } | null - xem lessonPlanStyles.js (GĐ10 Việc 2)
  existingOpeningIdeas = [], // string[] - GĐ10 Việc 3, xem lessonPlanDiversityStore.js
}) {
  const preschool = isPreschoolGrade(grade);
  const circular = getCircularForGrade(grade);
  const subjectProfile = preschool ? null : getSubjectProfile(subject);
  const gradeLabel = preschool ? "Mầm non" : `Lớp ${grade}`;
  const activities = getActivityLabels(lessonType);
  const secondActivityLabel = activities.find((a) => a.key === "kham_pha")?.label || "Khám phá";
  const multiPeriodGuidance = buildMultiPeriodGuidance(soTiet, grade, lessonType);

  const roleLine = preschool
    ? "BẠN LÀ MỘT CHUYÊN GIA THIẾT KẾ HOẠT ĐỘNG GIÁO DỤC MẦM NON GIÀU KINH NGHIỆM."
    : `BẠN LÀ ${subjectProfile.expertRole.toUpperCase()}, ĐỒNG THỜI LÀ CHUYÊN GIA SOẠN KẾ HOẠCH BÀI DẠY (GIÁO ÁN) THEO ĐÚNG ${circular.label.toUpperCase()}.`;

  const lessonTypeNote =
    !preschool && lessonType !== "bai_moi"
      ? `- ⚠️ Đây là bài "${
          lessonType === "on_tap" ? "Ôn tập/Luyện tập" : "Thực hành/Trải nghiệm"
        }", KHÔNG PHẢI bài hình thành kiến thức mới: hoạt động "${secondActivityLabel}" phải tập trung
  NHẮC LẠI/HỆ THỐNG HOÁ/CỦNG CỐ kiến thức học sinh ĐÃ HỌC trước đó, KHÔNG giới thiệu khái niệm/kiến
  thức hoàn toàn mới, KHÔNG dùng giọng văn kiểu "khám phá điều mới lạ".`
      : "";

  const structureRule = preschool
    ? `- Kế hoạch hoạt động Mầm non gồm: Mục tiêu, Chuẩn bị (đồ dùng/học liệu), Tiến trình hoạt động
  (Ổn định - gây hứng thú / Hoạt động trọng tâm / Kết thúc - nhận xét, tuyên dương), sử dụng cùng
  cấu trúc "hoatDong" như schema bên dưới (đặt tên hoạt động phù hợp Mầm non thay vì 4 tên chuẩn
  Tiểu học).`
    : `- Kế hoạch bài dạy PHẢI có đủ 4 hoạt động chuẩn theo Mục III của ${circular.label}: Khởi động,
  ${secondActivityLabel}, Luyện tập, Vận dụng - đúng tên gọi, đúng thứ tự, không gộp hay bỏ bớt hoạt
  động nào.
${lessonTypeNote}
- Mục "Yêu cầu cần đạt" PHẢI tách rõ 3 nhóm: Kiến thức, Năng lực (năng lực chung + năng lực đặc thù
  môn học), Phẩm chất - đúng định hướng phát triển năng lực-phẩm chất của chương trình GDPT 2018.`;

  const stepClarityRule = `- Mỗi hoạt động PHẢI chia thành NHIỀU BƯỚC RÕ RÀNG trong mảng "tienTrinh" (hệ thống sẽ tự đánh
  số "Bước 1", "Bước 2"... khi hiển thị/xuất - AI KHÔNG cần tự viết chữ "Bước..." vào đầu
  "hoatDongGVHS", chỉ cần tách đúng ranh giới từng bước). Với hoạt động "${secondActivityLabel}"/"Luyện
  tập", nên chia theo đúng tinh thần 4 bước quen thuộc: (1) Giao nhiệm vụ, (2) Thực hiện nhiệm vụ,
  (3) Báo cáo - thảo luận, (4) Kết luận - nhận định (có thể gộp bớt với hoạt động ngắn như
  "Khởi động"/"Vận dụng", không bắt buộc đủ 4 bước ở mọi hoạt động).
- Trong nội dung "hoatDongGVHS" của 1 bước, nếu có NHIỀU Ý/THAO TÁC khác nhau (VD giáo viên vừa
  chiếu hình ảnh, vừa đặt câu hỏi, vừa yêu cầu học sinh làm việc nhóm), hãy viết rõ từng ý bằng
  gạch đầu dòng "- " ở đầu mỗi câu (xuống dòng bằng \\n giữa các ý) thay vì viết dồn thành 1 đoạn
  văn dài liền mạch, để giáo viên đọc và làm theo dễ dàng, tương tự cách trình bày giáo án chuẩn
  nộp cho Ban Giám hiệu.
${multiPeriodGuidance.text}`;

  const sourceBlock = sourceMarkdown
    ? `NGUỒN TÀI LIỆU SGK (bám sát nội dung này, KHÔNG bịa kiến thức ngoài chương trình):\n"""\n${sourceMarkdown}\n"""`
    : `⚠️ Không có tài liệu SGK cụ thể được cung cấp cho lượt soạn này - hãy dựa vào "Nội dung cốt lõi"
giáo viên cung cấp bên dưới và kiến thức chuẩn chương trình phổ thông Việt Nam hiện hành.`;

  const integrationsBlock = buildIntegrationsPromptBlock(integrations);
  const styleBlock = buildLessonPlanStylePromptFragment(lessonPlanStyle);
  const diversityBlock = buildDiversityGuidance(existingOpeningIdeas);
  const sampleGuidanceBlock = buildLessonPlanSampleGuidance(sampleMode, sampleSpec, sampleReferenceText);

  // ⚠️ Trước đây các field do tích hợp thêm vào (VD "mindmap") CHỈ được mô tả bằng lời trong
  // integrationsBlock, KHÔNG xuất hiện trong ví dụ JSON chính bên dưới - khiến AI hay quên trả
  // về field đó dù đã đọc yêu cầu. Giờ nối THẲNG các "schemaExample" của tích hợp đang bật vào
  // đây, để ví dụ JSON luôn phản ánh ĐẦY ĐỦ hình dạng dữ liệu mong muốn (xem
  // collectIntegrationSchemaExamples() trong lessonPlanIntegrations.js).
  const integrationSchemaLines = collectIntegrationSchemaExamples(integrations);
  const integrationSchemaBlock = integrationSchemaLines.length
    ? `,\n  ${integrationSchemaLines.join(",\n  ")}`
    : "";

  const outputSchema = `{
  "tenBai": "${tenBai || "..."}",
  "yeuCauCanDat": { "kienThuc": ["..."], "nangLuc": ["..."], "phamChat": ["..."] },
  "doDungDayHoc": { "giaoVien": ["..."], "hocSinh": ["..."] },
  "hoatDong": [
${buildActivitySchemaBlock(activities, multiPeriodGuidance.multiPeriod)}
  ]${integrationSchemaBlock}
}`;

  return `
${roleLine}

THÔNG TIN BÀI DẠY:
- Tên bài soạn: ${tenBai}
- Cấp/Lớp: ${gradeLabel}
${!preschool ? `- Môn: ${subjectProfile.label}` : ""}
${chapterLabel ? `- Bài/Chương trong SGK: ${chapterLabel}` : ""}
- Số tiết: ${soTiet}
- Nội dung cốt lõi giáo viên yêu cầu: ${noiDungCotLoi || "(không có, tự xác định theo tài liệu/chương trình)"}

QUY TẮC BẮT BUỘC:
${structureRule}
${stepClarityRule}
- Mục "tienTrinh" của mỗi hoạt động là 1 MẢNG các bước, mỗi bước gồm "hoatDongGVHS" (hoạt động cụ
  thể của giáo viên và học sinh) và "sanPhamDuKien" (kết quả/sản phẩm học sinh cần đạt sau bước đó)
  - viết ĐỦ CẢ 2 trường này cho MỌI bước dù giáo viên chọn hiển thị 1 cột hay 2 cột (phía hiển thị
  tự quyết định cách trình bày, AI luôn phải cung cấp đầy đủ dữ liệu).
- Ngôn ngữ: Tiếng Việt chuẩn mực, đúng thuật ngữ sư phạm, phù hợp lứa tuổi ${gradeLabel}.
- Đầu ra CHỈ trả về JSON hợp lệ theo đúng schema, không kèm giải thích, không markdown code fence.
- ⚠️ TUYỆT ĐỐI KHÔNG dùng cú pháp LaTeX (KHÔNG dùng dấu $...$, $$...$$, và KHÔNG dùng dấu ngã "~"
  để ngăn cách chữ số) ở BẤT KỲ đâu trong giáo án, kể cả khi ví dụ/số liệu liên quan đến Toán học.
  Đây là giáo án dùng để đọc/in trực tiếp (không qua công cụ hiển thị công thức), nên MỌI số liệu
  và công thức phải viết bằng CHỮ SỐ VÀ KÝ HIỆU TOÁN HỌC THÔNG THƯỜNG (VD: viết "504 842" hoặc
  "504.842", KHÔNG viết "$504~842$"; viết "3 + 4 = 7", KHÔNG viết "$3 + 4 = 7$").
${!preschool && subjectProfile ? `\nQUY TẮC RIÊNG MÔN ${subjectProfile.label.toUpperCase()} (LƯU Ý: mục dưới đây có thể nhắc tới LaTeX vì\nvốn được viết cho phần ra ĐỀ KIỂM TRA - khi soạn GIÁO ÁN vẫn áp dụng các quy tắc nội dung/số liệu\nbên dưới nhưng BỎ QUA hoàn toàn phần yêu cầu dùng LaTeX, luôn viết số liệu/công thức bằng ký hiệu\nthông thường như quy tắc bắt buộc ở trên):\n${subjectProfile.extraRules}` : ""}

${sourceBlock}
${diversityBlock}${integrationsBlock}${styleBlock}${sampleGuidanceBlock}
Hãy trả về JSON theo đúng schema sau (không thêm trường nào khác ngoài schema và các trường tích
hợp đã liệt kê ở trên nếu có):
${outputSchema}
`.trim();
}
