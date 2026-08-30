import { generateContentWithFailover } from "./geminiKeyPool";
import {
  WORKSHEET_GRADES,
  generateTinhNham,
  generateTachGop,
  generateDemVaVietSo,
  generateSoSanh,
  generateDaySo,
  generateNoiPhepTinh,
  generateNhanDienHinh,
  generateSapXepThuTu,
  generateDemHinhUngDung,
  generateDoDaiSoSanh,
  generateDoDaiSapXep,
  generateXemDongHoGioDung,
  generateCacNgayTrongTuan,
  generateNhanChiaBang,
  generateChuViDienTich,
  generateDoiDonVi,
  generateXemDongHoGioPhut,
  generateTienVietNam,
  generateKhaNangXayRa,
  generateThuThapSoLieu,
  generatePhanSoRutGon,
  generateBieuThucChu,
  generatePhanSoSoSanh,
  generateGocNhanBiet,
  generateSoThapPhanSoSanh,
  generateSoThapPhanCongTru,
  generateSoThapPhanNhan,
  generateSoThapPhanChia,
  generateTiSoPhanTram,
  generateHinhTamGiacHinhThang,
  generateHinhTron,
  generateTheTichHopLapPhuong,
  generateDoiDonViTheTich,
  generateDienTichXqTp,
  generateSoDoThoiGian,
  generateVanTocQuangDuongThoiGian,
  generatePhepChiaCoDu,
  generateSoThapPhanChiaNangCao,
} from "@/data/worksheetSchemas";
import { pickInstructionVariant, pickMascot, getSelectableCatalogFor } from "@/data/worksheetExerciseCatalog";
import { pickRandomLayout, getLayoutById, pickLayoutFromSampleSpec, pickLayoutWithPreference } from "@/data/worksheetLayoutTemplates";
import { isUsableWorksheetSampleSpec } from "@/data/worksheetSampleSchema";
import { ADVANCED_BOOK_MARKER, WORKSHEET_GRADE_TO_SGK_GRADE } from "@/data/constants";
import { fetchMarkdownFromGitHub, fetchAdvancedBook } from "./githubService";

/**
 * worksheetGenerator.js
 * "Phiếu bài tập" Mầm non - Lớp 2. Đa số dạng bài sinh HOÀN TOÀN bằng code (xem
 * worksheetSchemas.js) - không gọi AI, không tốn credit, không lo tính sai. CHỈ dạng
 * "giải toán có lời văn" cần gọi AI (1 lần cho cả phiếu) vì cần biến hoá ngôn ngữ tự nhiên.
 *
 * ⚠️ GIAI ĐOẠN 0+1 (chống lặp khuôn): mỗi section lấy title + mascot NGẪU NHIÊN từ
 * worksheetExerciseCatalog.js (thay vì 1 câu/1 icon cố định) và cả phiếu được gắn 1 "layout"
 * ngẫu nhiên từ worksheetLayoutTemplates.js. WorksheetPreview.jsx (web) và
 * worksheetExportService.js (Word) đều đã đọc field "layout"/"mascot" này để thực sự đổi
 * màu/mascot/kiểu khung mỗi lần tạo phiếu - không còn 1 bố cục cố định duy nhất như trước.
 */

const WORD_PROBLEM_MODEL = "gemini-3.5-flash";

/**
 * ================== GIAI ĐOẠN 9 (sửa bài toán có lời văn bị "công thức hoá") ==================
 * TRƯỚC ĐÂY prompt chỉ dặn chung chung "bối cảnh đa dạng" -> AI có "vùng an toàn" từ vựng hẹp khi
 * tự sáng tác cho mầm non/lớp 1, dẫn đến mô-típ thỏ+cà rốt+gà lặp lại xuyên suốt nhiều phiếu (xác
 * nhận qua đối chiếu 3 PDF thật giáo viên gửi).
 *
 * Giải pháp: CODE (không phải AI) chọn ngẫu nhiên - đảm bảo phân bố đều, không lệ thuộc "thói
 * quen" của AI - đúng `count` chủ đề PHÂN BIỆT từ 1 ngân hàng đủ đa dạng (đồ vật, con vật, con
 * người, bối cảnh khác nhau), rồi BẮT BUỘC AI viết đúng theo từng chủ đề đã chọn sẵn, chỉ tự do
 * ở số liệu/câu chữ - không còn để AI tự "bốc" chủ đề (dễ lặp lại lối mòn quen thuộc).
 */
// ================== GIAI ĐOẠN F (lồng ghép đời sống VN / giáo dục tài chính / môi trường) ======
// TRƯỚC ĐÂY ngân hàng chủ đề thiên về đồ vật/con vật chung chung (xoài, bi, thuyền giấy...) -
// giáo viên phản ánh muốn bài toán GẦN GŨI ĐỜI SỐNG HẰNG NGÀY của trẻ em Việt Nam hơn, và thỉnh
// thoảng lồng ghép NHẸ NHÀNG 2 chủ đề giáo dục: "giáo dục tài chính" (tiết kiệm, mua bán bằng
// tiền) và "môi trường" (tái chế, tiết kiệm điện/nước, trồng cây) - KHÔNG bắt buộc mọi bài đều có
// 2 yếu tố này (dễ gượng ép, mất tự nhiên), chỉ cần CÓ MẶT trong ngân hàng để random tự nhiên
// trúng vào một số bài. Bổ sung ~10 chủ đề mới theo đúng 2 hướng này, GIỮ NGUYÊN các chủ đề cũ.
const WORD_PROBLEM_THEME_BANK = [
  "bạn An và bạn Bình xếp ghế trong buổi lễ chào cờ ở sân trường",
  "chú thợ mộc đóng những chiếc ghế gỗ nhỏ trong xưởng",
  "cô bán hàng bày những quả xoài lên kệ ở chợ",
  "đàn cá heo bơi tung tăng ngoài biển",
  "bạn Minh gấp những chiếc thuyền giấy để thả ở hồ nước",
  "bác nông dân thu hoạch những trái bí ngô trong vườn",
  "chị Hoa cắm những bông hoa hướng dương vào lọ",
  "đàn chim cánh cụt đứng thành hàng trên tảng băng",
  "bạn Tùng xếp những viên bi màu vào hộp",
  "mẹ mua những quả trứng ở siêu thị",
  "các bạn nhỏ thả diều trên bãi cỏ công viên",
  "chú voi con tha những khúc gỗ nhỏ trong rừng",
  "bà làm những chiếc bánh cho cả nhà nhân dịp lễ",
  "bạn Hà dán những ngôi sao giấy trang trí lớp học",
  "đàn kiến tha những hạt gạo về tổ",
  "chú hải cẩu bắt được những con cá trong hồ nuôi",
  "bạn Lam sưu tầm những chiếc lá khô mùa thu",
  "cô giáo phát những quyển vở mới cho học sinh",
  "chú sóc nhỏ nhặt những hạt dẻ trong rừng",
  "các bạn xếp những chiếc ô tô đồ chơi vào giá",
  "bạn Phương tưới nước cho những chậu cây trên ban công",
  "đàn ong bay đi lấy mật ở vườn hoa",
  "bạn Khoa xếp những cuốn truyện tranh lên giá sách",
  "chú thủy thủ xếp những thùng hàng lên tàu ở bến cảng",
  // ---- Môi trường (tái chế, bảo vệ thiên nhiên) ----
  "bạn An và bạn Bình nhặt những vỏ chai nhựa ở sân trường đem đi tái chế",
  "các bạn nhỏ phân loại những tờ giấy báo cũ để gom tái chế",
  "bạn Nam trồng những cây con trong vườn trường vào dịp Tết trồng cây",
  "bạn Hương gom những vỏ lon để mang đến điểm thu gom tái chế",
  "cô giáo cùng cả lớp nhặt rác trên bãi biển trong buổi ngoại khoá",
  // ---- Giáo dục tài chính (tiết kiệm, mua bán bằng tiền) ----
  "bạn Bống bỏ những đồng tiền xu vào heo đất tiết kiệm mỗi ngày",
  "bạn Long dùng tiền lì xì Tết mua những quyển truyện tranh",
  "mẹ đưa tiền cho bạn Mai đi chợ mua những mớ rau",
  "bạn Tâm để dành tiền tiêu vặt mua những chiếc bút chì màu",
  "ông bà cho bạn Su những tờ tiền lì xì đầu năm để bỏ ống heo",
];

/** GIAI ĐOẠN F (storytelling): trả về chủ đề DUY NHẤT dùng xuyên suốt cả phiếu khi giáo viên bật
 * storytelling. Ưu tiên chủ đề giáo viên tự gõ (customTheme) - nếu bỏ trống/toàn khoảng trắng,
 * random 1 chủ đề từ CHÍNH WORD_PROBLEM_THEME_BANK (dùng lại ngân hàng đã có, không cần ngân
 * hàng riêng vì mỗi phần tử trong đó vốn đã là 1 "nhân vật + bối cảnh" đủ để kể chuyện nhiều bài). */
export function pickStorytellingTheme(customTheme) {
  const trimmed = (customTheme || "").trim();
  if (trimmed) return trimmed;
  return WORD_PROBLEM_THEME_BANK[Math.floor(Math.random() * WORD_PROBLEM_THEME_BANK.length)];
}

/** Chọn ngẫu nhiên đúng `count` chủ đề PHÂN BIỆT từ ngân hàng (nếu count > kích thước ngân
 * hàng, cho phép lặp lại sau khi đã dùng hết 1 lượt, vẫn xáo trộn để không theo thứ tự cố định).
 * Export (dù chỉ dùng nội bộ) để có thể tự verify bằng script gọi hàm trực tiếp - cùng tinh thần
 * buildLessonPlanPrompt() bên module giáo án. */
export function pickWordProblemThemes(count) {
  const shuffled = [...WORD_PROBLEM_THEME_BANK].sort(() => Math.random() - 0.5);
  if (count <= shuffled.length) return shuffled.slice(0, count);
  const themes = [...shuffled];
  while (themes.length < count) {
    themes.push(...[...WORD_PROBLEM_THEME_BANK].sort(() => Math.random() - 0.5));
  }
  return themes.slice(0, count);
}

export function buildWordProblemPrompt({
  gradeLabel,
  maxNumber,
  count,
  includeAnswers,
  referenceContext,
  themes,
  storytellingTheme = null,
  grade = null,
}) {
  // ================== MỞ RỘNG LỚP 3 (Đợt 1) ==================
  // TRƯỚC ĐÂY luôn chỉ cho phép cộng/trừ (đúng với Mầm non-Lớp 2, SGK các khối này CHƯA có bài
  // toán lời văn nhân/chia). Lớp 3 học nhân/chia trong bảng NGAY từ đầu năm (chủ đề 2 "Bảng nhân,
  // bảng chia") nên bài toán lời văn Lớp 3 THƯỜNG là nhân/chia, không chỉ cộng/trừ - cho phép cả
  // 4 phép tính nhưng giới hạn RIÊNG thừa số nhân/chia trong phạm vi bảng cửu chương (2-9) để AI
  // không tự bịa phép nhân số lớn (không đúng mức Lớp 3, dễ vượt quá khả năng tính của học sinh).
  const operationInstruction =
    grade === "LOP_3"
      ? `mức độ 1 PHÉP TÍNH duy nhất (cộng, trừ, NHÂN hoặc CHIA HẾT) - nếu là phép cộng/trừ thì số liệu
  trong phạm vi 0-${maxNumber}; nếu là phép nhân/chia thì các thừa số phải trong PHẠM VI BẢNG CỬU
  CHƯƠNG (2-9), không dùng số lớn hơn`
      : `mức độ 1 PHÉP TÍNH duy nhất (cộng hoặc trừ), số liệu trong phạm vi 0-${maxNumber}`;
  // ================== GIAI ĐOẠN F (storytelling theo chủ đề) ==================
  // TRƯỚC ĐÂY (và mặc định vẫn giữ nguyên khi giáo viên KHÔNG bật storytelling): mỗi bài toán 1
  // chủ đề NGẪU NHIÊN riêng biệt (themes[i]) - đúng mục tiêu chống lặp mô-típ (xem GIAI ĐOẠN 9 ở
  // trên) nhưng KHÔNG có cảm giác 1 câu chuyện xuyên suốt, các bài rời rạc không liên quan nhau.
  //
  // Khi giáo viên chủ động bật storytelling (storytellingTheme có giá trị): TOÀN BỘ phiếu dùng
  // CHUNG 1 chủ đề/nhân vật duy nhất xuyên suốt mọi bài toán - tạo cảm giác 1 câu chuyện liền
  // mạch, giống hero mascot đã làm ở layout "adventure_map" (xem GIAI ĐOẠN 4 trong
  // generateWorksheet()). Prompt yêu cầu AI GIỮ ĐÚNG nhân vật/bối cảnh nhưng để các bài nối
  // tiếp nhau như 1 câu chuyện nhỏ có diễn biến (không lặp y hệt tình huống bài trước).
  const themeInstructionBlock = storytellingTheme
    ? `- TOÀN BỘ ${count} bài toán PHẢI xoay quanh CHUNG 1 chủ đề/nhân vật xuyên suốt sau đây (kiểu
  kể chuyện nhiều tập, không phải ${count} bài rời rạc): "${storytellingTheme}".
  Mỗi bài là 1 tình huống/diễn biến MỚI tiếp nối câu chuyện (VD: bài 1 nhân vật bắt đầu làm gì,
  bài 2 xảy ra tiếp theo, bài 3 kết thúc...), KHÔNG lặp lại y hệt tình huống của bài trước, KHÔNG
  đổi sang nhân vật/bối cảnh khác ngoài chủ đề đã cho. Chỉ được TỰ DO sáng tạo số liệu cụ thể và
  diễn biến câu chuyện cho từng bài.`
    : `- Dưới đây là ĐÚNG ${count} CHỦ ĐỀ đã được chọn NGẪU NHIÊN SẴN cho từng bài theo thứ tự - bài toán
  thứ i BẮT BUỘC phải dùng ĐÚNG nhân vật/bối cảnh của chủ đề thứ i, KHÔNG được đổi chéo, KHÔNG
  được thay bằng chủ đề khác ngoài danh sách, KHÔNG được quay lại các mô-típ quen thuộc (thỏ ăn cà rốt,
  gà con...) nếu chủ đề không yêu cầu. Chỉ được TỰ DO sáng tạo thêm số liệu cụ thể và cách
  hành văn cho từng bài:\n${themes.map((theme, i) => `${i + 1}. ${theme}`).join("\n")}`;

  return `
Bạn là giáo viên Tiểu học Việt Nam giàu kinh nghiệm, soạn bài toán có lời văn cho học sinh ${gradeLabel}.

YÊU CẦU:
- Soạn ĐÚNG ${count} bài toán có lời văn, ${operationInstruction}, kết quả không âm.
${themeInstructionBlock}
- Ngôn ngữ đơn giản, câu ngắn, đúng lứa tuổi.
- Số liệu "đẹp" (số nguyên, kết quả tròn, dễ tính nhẩm).
- Bối cảnh nên gần gũi ĐỜI SỐNG HẰNG NGÀY của trẻ em Việt Nam. Một vài chủ đề trong danh sách/chủ
  đề trên đã sẵn có yếu tố "giáo dục tài chính" (tiết kiệm, mua bán bằng tiền) hoặc "môi trường"
  (tái chế, trồng cây, bảo vệ thiên nhiên) - nếu bài toán rơi vào các chủ đề đó thì lồng ghép NHẸ
  NHÀNG, TỰ NHIÊN đúng tinh thần chủ đề, KHÔNG cần cố nhồi nhét vào những chủ đề khác không liên quan.
${includeAnswers ? "- Kèm đáp số cuối cùng cho mỗi bài." : ""}
${
  referenceContext
    ? `- GIAI ĐOẠN 2: giáo viên có cung cấp 1 đoạn TÀI LIỆU THAM KHẢO bên dưới (ngữ cảnh) - nếu có
  thể lồng ghép TỪ VỰNG liên quan vào bài toán mà KHÔNG làm sai lệch chủ đề đã chọn ở trên thì ưu
  tiên làm vậy, nhưng chủ đề của từng bài vẫn phải đúng danh sách/chủ đề đã cho ở trên. TUYỆT ĐỐI
  KHÔNG chép nguyên văn câu chữ từ tài liệu tham khảo.\n\nTÀI LIỆU THAM KHẢO:\n${referenceContext}`
    : ""
}

Trả về JSON đúng schema (không thêm trường khác):
{
  "problems": [
    { "content": "Đề bài toán có lời văn"${includeAnswers ? ', "answer": "Đáp số ngắn gọn, có đơn vị"' : ""} }
  ]
}
`.trim();
}

async function generateWordProblems({ grade, count, includeAnswers, referenceContext, storytellingTheme }) {
  if (count <= 0) return [];
  const gradeConfig = WORKSHEET_GRADES[grade];
  // storytellingTheme != null -> bỏ qua việc chọn N chủ đề phân biệt (không cần thiết, cả phiếu
  // chỉ dùng 1 chủ đề duy nhất) - themes rỗng, buildWordProblemPrompt tự chuyển sang nhánh
  // storytelling khi thấy storytellingTheme có giá trị.
  const themes = storytellingTheme ? [] : pickWordProblemThemes(count);
  const prompt = buildWordProblemPrompt({
    gradeLabel: gradeConfig.label,
    maxNumber: gradeConfig.maxNumber,
    count,
    includeAnswers,
    referenceContext,
    themes,
    storytellingTheme,
    grade,
  });

  try {
    const result = await generateContentWithFailover({
      model: WORD_PROBLEM_MODEL,
      contents: prompt,
      config: { temperature: 0.85, responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(result.text);
    const problems = Array.isArray(parsed.problems) ? parsed.problems : [];
    return problems.slice(0, count);
  } catch (err) {
    console.error("[worksheetGenerator] Lỗi sinh bài toán có lời văn:", err.message);
    return []; // lỗi AI không làm hỏng cả phiếu - các dạng bài khác (code sinh) vẫn có đủ
  }
}

const MAX_SGK_CONTEXT_LENGTH = 4000; // khớp MAX_REFERENCE_CONTEXT_LENGTH trong worksheetSampleAnalyzer.js

/**
 * ================== GIAI ĐOẠN 6 (mở rộng sang Tiếng Việt) ==================
 * 4 dạng bài Tiếng Việt (LOP_1/LOP_2) - TẤT CẢ đều cần AI (từ vựng/câu văn không tính toán được
 * bằng code như Toán, xem worksheetExerciseCatalog.js). Theo ĐÚNG pattern generateWordProblems()
 * ở trên: 1 prompt riêng/dạng, gọi generateContentWithFailover() 1 LẦN/dạng, validate CHẶT kết
 * quả JSON trả về (AI có thể trả thiếu field/sai kiểu - KHÔNG tin tuyệt đối), lỗi -> trả mảng
 * rỗng/null (KHÔNG throw, không làm hỏng các dạng bài khác trong cùng phiếu, giống nguyên tắc
 * generateWordProblems()).
 */
const VIETNAMESE_MODEL = "gemini-3.5-flash";

function vietnameseGradeLabel(grade) {
  return WORKSHEET_GRADES[grade]?.label || grade;
}

function buildReferenceContextBlock(referenceContext) {
  return referenceContext
    ? `\n\nGiáo viên có cung cấp 1 đoạn TÀI LIỆU THAM KHẢO (ngữ cảnh/chủ đề đang dạy) - ưu tiên dùng
từ vựng/chủ đề tương tự nếu phù hợp, TUYỆT ĐỐI KHÔNG chép nguyên văn câu chữ:\n\nTÀI LIỆU THAM KHẢO:\n${referenceContext}`
    : "";
}

/**
 * ================== PHIÊN 29 (sửa lỗi sư phạm phản hồi qua phiếu Lớp 1 in thật) ==================
 * Giáo viên phản hồi phiếu "Điền từ thích hợp vào chỗ trống" ở Lớp 1 dùng câu dài, từ vựng phức
 * tạp vượt quá khả năng đọc của học sinh Lớp 1 (giai đoạn mới đánh vần), VD "Mái tóc của bà đã
 * bạc trắng vì tuổi già" - học sinh Lớp 1 KHÔNG đọc hiểu nổi câu này.
 *
 * Đây là "Master Prompt" RIÊNG cho Lớp 1 - chỉ áp dụng khi grade === "LOP_1", các khối Lớp 2 trở
 * lên KHÔNG bị ảnh hưởng (giữ nguyên hành vi cũ). Áp dụng cho MỌI dạng bài Tiếng Việt AI-sinh còn
 * mở cho Lớp 1 (hiện chỉ còn "dien_tu_cho_san" sau khi khoanh_tu_loai/noi_tu_nhom đã nâng
 * minGrade lên LOP_2 - xem worksheetExerciseCatalog.js).
 */
export function buildVietnameseGradeConstraintBlock(grade) {
  if (grade !== "LOP_1") return "";
  return `

QUY TẮC BẮT BUỘC RIÊNG CHO LỚP 1 (học sinh mới học đánh vần, HK1 chưa học hết bảng chữ cái):
- TUYỆT ĐỐI CẤM dùng thuật ngữ ngữ pháp (như "từ chỉ hoạt động", "từ chỉ đặc điểm", "từ chỉ sự
  vật", "danh từ", "động từ", "tính từ") ở BẤT KỲ đâu trong nội dung.
- Mỗi câu/cụm từ CHỈ 2-4 TIẾNG, cực kỳ ngắn gọn, đúng dạng câu SGK Lớp 1 (VD: "Bà có quả na.",
  "Bé ca hát.", "Ba bế bé."). KHÔNG dùng câu dài, câu ghép, hay câu có nhiều mệnh đề.
- KHÔNG dùng từ có vần phức tạp (như "oang", "uynh", "iếc", "uyên"...) - chỉ dùng từ vựng quen
  thuộc, dễ đánh vần, xoay quanh chủ đề gần gũi: gia đình, con vật, đồ vật quen thuộc.
- Chữ cái đầu tiên của MỖI câu/cụm từ BẮT BUỘC viết hoa.`;
}

/** Viết hoa chữ cái đầu tiên của chuỗi (post-process CODE, không chỉ dựa vào AI làm đúng theo
 * prompt) - phòng trường hợp AI quên viết hoa dù đã dặn, VD giáo viên phản hồi câu "bố sửa lại
 * chiếc xe đạp..." thiếu viết hoa đầu câu. Bỏ qua chuỗi rỗng/không phải string. */
export function capitalizeFirstLetter(str) {
  if (typeof str !== "string" || !str) return str;
  // Tìm ký tự chữ/số ĐẦU TIÊN (bỏ qua khoảng trắng đầu nếu có) để viết hoa đúng vị trí, không
  // đụng vào các trường hợp câu bắt đầu bằng dấu câu/khoảng trắng thừa.
  const match = str.match(/^(\s*)(\S)(.*)$/s);
  if (!match) return str;
  const [, leading, firstChar, rest] = match;
  return `${leading}${firstChar.toLocaleUpperCase("vi")}${rest}`;
}

/** "Khoanh từ chỉ hoạt động / đặc điểm" - mỗi câu có 1 từ mục tiêu (động từ hoặc tính từ) để học
 * sinh khoanh tròn trên bản in. wordType chỉ dùng nội bộ (đáp án), KHÔNG hiện ra đề bài. */
async function generateKhoanhTuLoai({ grade, count, referenceContext }) {
  if (count <= 0) return [];
  // PHIÊN 29: khoanh_tu_loai nay minGrade="LOP_2" (xem worksheetExerciseCatalog.js) nên grade ở
  // đây KHÔNG còn thể là "LOP_1" trong luồng bình thường - vẫn giữ buildVietnameseGradeConstraintBlock()
  // ở đây (trả "" nếu không phải LOP_1) để phòng thủ nếu sau này có nơi gọi trực tiếp với LOP_1.
  const prompt = `
Bạn là giáo viên Tiểu học Việt Nam dạy Tiếng Việt cho học sinh ${vietnameseGradeLabel(grade)}.
Soạn ĐÚNG ${count} câu văn NGẮN (6-10 chữ), MỖI câu chứa ĐÚNG 1 từ chỉ HOẠT ĐỘNG (động từ) hoặc 1
từ chỉ ĐẶC ĐIỂM (tính từ) làm từ mục tiêu để học sinh khoanh tròn. Trộn đều cả 2 loại. Từ mục tiêu
phải xuất hiện NGUYÊN VẸN, KHÔNG chia tách trong câu (để học sinh khoanh đúng 1 từ). Chữ cái đầu
tiên của MỖI câu BẮT BUỘC viết hoa.${buildReferenceContextBlock(referenceContext)}${buildVietnameseGradeConstraintBlock(grade)}

Trả về JSON đúng schema (không thêm trường khác):
{ "items": [ { "sentence": "câu văn đầy đủ", "targetWord": "từ mục tiêu xuất hiện y hệt trong câu", "wordType": "hoat_dong" | "dac_diem" } ] }
`.trim();

  try {
    const result = await generateContentWithFailover({
      model: VIETNAMESE_MODEL,
      contents: prompt,
      config: { temperature: 0.85, responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(result.text);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    // Validate CHẶT: câu phải có chứa ĐÚNG targetWord (không thì học sinh không khoanh được gì) -
    // loại bỏ item nào AI trả thiếu field hoặc targetWord không thực sự nằm trong sentence.
    return items
      .filter(
        (it) =>
          it &&
          typeof it.sentence === "string" &&
          typeof it.targetWord === "string" &&
          it.targetWord.trim() &&
          it.sentence.includes(it.targetWord) &&
          (it.wordType === "hoat_dong" || it.wordType === "dac_diem")
      )
      .slice(0, count)
      // PHIÊN 29: viết hoa đầu câu bằng CODE, không chỉ dựa vào AI làm đúng theo prompt.
      .map((it) => ({ ...it, sentence: capitalizeFirstLetter(it.sentence) }));
  } catch (err) {
    console.error("[worksheetGenerator] Lỗi sinh khoanh_tu_loai:", err.message);
    return [];
  }
}

/** "Nối từ với nhóm thích hợp" - trả { pairs: [{left, right}], shuffledRight: [...] } - CÙNG
 * hình dạng dữ liệu với generateNoiPhepTinh() (pairs + shuffled) để tái dùng bố cục 2 cột-nối
 * quen thuộc, chỉ khác nội dung là CHỮ thay vì SỐ. */
async function generateNoiTuNhom({ grade, count, referenceContext }) {
  if (count <= 0) return { pairs: [], shuffledRight: [] };
  const prompt = `
Bạn là giáo viên Tiểu học Việt Nam dạy Tiếng Việt cho học sinh ${vietnameseGradeLabel(grade)}.
Soạn ĐÚNG ${count} cặp "từ - nhóm/đặc điểm thích hợp" để học sinh nối, VD "con mèo" nối với "con
vật", hoặc "bông hoa" nối với "màu đỏ". MỖI cặp 1 chủ đề khác nhau (đồ vật, con vật, cây cối, màu
sắc, cảm xúc...), KHÔNG lặp lại "right" giữa các cặp (để chỉ có 1 đáp án đúng khi nối).${buildReferenceContextBlock(referenceContext)}${buildVietnameseGradeConstraintBlock(grade)}

Trả về JSON đúng schema (không thêm trường khác):
{ "pairs": [ { "left": "từ/cụm từ", "right": "nhóm/đặc điểm thích hợp, NGẮN GỌN (1-3 chữ)" } ] }
`.trim();

  try {
    const result = await generateContentWithFailover({
      model: VIETNAMESE_MODEL,
      contents: prompt,
      config: { temperature: 0.85, responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(result.text);
    const rawPairs = Array.isArray(parsed.pairs) ? parsed.pairs : [];
    const pairs = rawPairs
      .filter((p) => p && typeof p.left === "string" && p.left.trim() && typeof p.right === "string" && p.right.trim())
      .slice(0, count);
    // Loại "right" trùng lặp (nếu AI lỡ lặp dù đã dặn) - trùng sẽ khiến bài có nhiều đáp án đúng.
    const seenRight = new Set();
    const dedupedPairs = pairs.filter((p) => {
      const key = p.right.trim().toLowerCase();
      if (seenRight.has(key)) return false;
      seenRight.add(key);
      return true;
    });
    const shuffledRight = [...dedupedPairs.map((p) => p.right)].sort(() => Math.random() - 0.5);
    return { pairs: dedupedPairs, shuffledRight };
  } catch (err) {
    console.error("[worksheetGenerator] Lỗi sinh noi_tu_nhom:", err.message);
    return { pairs: [], shuffledRight: [] };
  }
}

/** "Điền từ thích hợp vào chỗ trống" - 1 "ngân hàng từ" DÙNG CHUNG cho cả khối câu (giống mẫu in
 * sẵn thường thấy: khung từ ở trên, câu có chỗ trống ở dưới), mỗi từ trong ngân hàng dùng ĐÚNG 1
 * lần (validate: số câu phải khớp số từ, mỗi answer phải nằm trong wordBank). */
async function generateDienTuChoSan({ grade, count, referenceContext }) {
  if (count <= 0) return { wordBank: [], sentences: [] };
  const prompt = `
Bạn là giáo viên Tiểu học Việt Nam dạy Tiếng Việt cho học sinh ${vietnameseGradeLabel(grade)}.
Soạn ĐÚNG ${count} câu văn có 1 CHỖ TRỐNG (đánh dấu bằng "___"), cùng 1 "ngân hàng từ" gồm ĐÚNG
${count} từ để điền - MỖI từ trong ngân hàng CHỈ DÙNG CHO ĐÚNG 1 câu (không thừa, không thiếu,
không trùng nhau). Chữ cái đầu tiên của MỖI câu (kể cả phần trước "___" nếu chỗ trống không nằm ở
đầu câu) BẮT BUỘC viết hoa.${buildReferenceContextBlock(referenceContext)}${buildVietnameseGradeConstraintBlock(grade)}

Trả về JSON đúng schema (không thêm trường khác):
{
  "wordBank": ["từ 1", "từ 2", ...],
  "sentences": [ { "template": "câu có ___ ở giữa", "answer": "từ đúng, PHẢI xuất hiện y hệt trong wordBank" } ]
}
`.trim();

  try {
    const result = await generateContentWithFailover({
      model: VIETNAMESE_MODEL,
      contents: prompt,
      config: { temperature: 0.85, responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(result.text);
    const wordBank = Array.isArray(parsed.wordBank) ? parsed.wordBank.filter((w) => typeof w === "string" && w.trim()) : [];
    const rawSentences = Array.isArray(parsed.sentences) ? parsed.sentences : [];
    // Validate CHẶT: template phải có "___" và answer phải THỰC SỰ nằm trong wordBank - nếu
    // không, câu đó không thể làm được (học sinh không có từ để chọn) -> loại bỏ.
    const sentences = rawSentences
      .filter(
        (s) =>
          s &&
          typeof s.template === "string" &&
          s.template.includes("___") &&
          typeof s.answer === "string" &&
          wordBank.includes(s.answer)
      )
      .slice(0, count)
      // PHIÊN 29: viết hoa đầu câu bằng CODE (không chỉ dựa vào AI) - phản hồi thực tế phát hiện
      // câu "bố sửa lại chiếc xe đạp..." thiếu viết hoa đầu câu dù prompt cũ đã có dặn chung chung.
      .map((s) => ({ ...s, template: capitalizeFirstLetter(s.template) }));
    // Ngân hàng từ chỉ giữ lại từ THỰC SỰ được dùng (phòng AI liệt kê dư) + xáo trộn để không lộ
    // thứ tự trùng với thứ tự câu (dễ đoán mò).
    const usedWords = new Set(sentences.map((s) => s.answer));
    const trimmedWordBank = [...wordBank.filter((w) => usedWords.has(w))].sort(() => Math.random() - 0.5);
    return { wordBank: trimmedWordBank, sentences };
  } catch (err) {
    console.error("[worksheetGenerator] Lỗi sinh dien_tu_cho_san:", err.message);
    return { wordBank: [], sentences: [] };
  }
}

/** "Đặt câu theo mẫu" - chỉ cần MẪU CÂU + 1 VÍ DỤ minh hoạ (KHÔNG có "đáp án" cố định - học sinh
 * tự sáng tạo câu riêng, không chấm đúng/sai theo 1 câu duy nhất). */
async function generateDatCauTheoMau({ grade, count, referenceContext }) {
  if (count <= 0) return [];
  const prompt = `
Bạn là giáo viên Tiểu học Việt Nam dạy Tiếng Việt cho học sinh ${vietnameseGradeLabel(grade)}.
Soạn ĐÚNG ${count} MẪU CÂU khác nhau (VD "Ai làm gì?", "Ai/cái gì/con gì thế nào?", "Ở đâu có
gì?") phù hợp Tiểu học, MỖI mẫu kèm 1 CÂU VÍ DỤ minh hoạ đúng mẫu đó.${buildReferenceContextBlock(referenceContext)}

Trả về JSON đúng schema (không thêm trường khác):
{ "items": [ { "pattern": "tên mẫu câu, VD: Ai làm gì?", "example": "câu ví dụ đúng mẫu" } ] }
`.trim();

  try {
    const result = await generateContentWithFailover({
      model: VIETNAMESE_MODEL,
      contents: prompt,
      config: { temperature: 0.85, responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(result.text);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    return items
      .filter((it) => it && typeof it.pattern === "string" && it.pattern.trim() && typeof it.example === "string" && it.example.trim())
      .slice(0, count)
      // PHIÊN 29: viết hoa đầu câu ví dụ bằng CODE, đồng bộ với các dạng bài Tiếng Việt khác.
      .map((it) => ({ ...it, example: capitalizeFirstLetter(it.example) }));
  } catch (err) {
    console.error("[worksheetGenerator] Lỗi sinh dat_cau_theo_mau:", err.message);
    return [];
  }
}

/**
 * ================== GIAI ĐOẠN 5 (liên kết SGK markdown) ==================
 * Tải nội dung 1 chương/bài SGK (best-effort, KHÔNG làm hỏng cả lượt tạo phiếu nếu lỗi) - TÁI
 * DÙNG đúng nguyên tắc `lessonPlanOrchestrator.js` đã kiểm định (try/catch quanh
 * fetchMarkdownFromGitHub/fetchAdvancedBook, lỗi -> đẩy vào `warnings`, KHÔNG throw). Trả về
 * { context, label, warning } - `context` = null nếu không chọn chương hoặc tải lỗi (luồng gọi
 * vẫn hoạt động bình thường, chỉ là "giải toán có lời văn" sẽ kém bám sát SGK hơn).
 */
async function resolveSgkChapterContext({ grade, subject, sgkVolume, sgkChapterId }) {
  if (!sgkChapterId) return { context: null, label: null, warning: null };

  const sgkGrade = WORKSHEET_GRADE_TO_SGK_GRADE[grade];
  if (!sgkGrade) {
    // Mầm non hoặc khối chưa map -> im lặng bỏ qua, KHÔNG coi là lỗi (UI vốn đã ẩn phần chọn
    // chương SGK cho các khối này, xem WorksheetForm.jsx - nếu vẫn nhận được sgkChapterId ở đây
    // thì có thể do gọi thẳng API bỏ qua form, không tin dữ liệu client tuyệt đối).
    return { context: null, label: null, warning: null };
  }

  // GIAI ĐOẠN 6: subject SGK dùng đúng giá trị đã có trong config.js (SUBJECTS), KHÔNG hard-code
  // "Toan" như trước Giai đoạn 6 (khi hệ thống còn chỉ có 1 môn duy nhất).
  const sgkSubject = subject === "TIENG_VIET" ? "Tieng_Viet" : "Toan";

  try {
    const markdown =
      sgkChapterId === ADVANCED_BOOK_MARKER
        ? await fetchAdvancedBook(sgkGrade, sgkSubject)
        : await fetchMarkdownFromGitHub(sgkGrade, sgkSubject, sgkVolume || "1", sgkChapterId);
    const label = sgkChapterId === ADVANCED_BOOK_MARKER ? "Sách nâng cao (toàn bộ)" : `Chương/Bài ${sgkChapterId}`;
    return { context: markdown.slice(0, MAX_SGK_CONTEXT_LENGTH), label, warning: null };
  } catch (err) {
    return {
      context: null,
      label: null,
      warning: `Không tải được tài liệu SGK cho bài đã chọn (${err.message}) - phiếu vẫn được tạo bình thường, nhưng nội dung có thể kém bám sát SGK hơn.`,
    };
  }
}

// ================== GIAI ĐOẠN 4 MỚI (content-aware theo mẫu thật) ==================
// Thứ tự MẶC ĐỊNH khi KHÔNG có sampleSpec hữu ích (giữ NGUYÊN thứ tự cũ trước đây, để hành vi
// không đổi khi giáo viên không upload mẫu).
const DEFAULT_SECTION_ORDER = [
  "tinh_nham",
  "nhan_chia_bang", // MỞ RỘNG LỚP 3 - cùng nhóm so_hoc, xếp ngay cạnh "tinh_nham"
  "tach_gop", // GIAI ĐOẠN F - cùng nhóm so_hoc với tinh_nham, xếp ngay cạnh nhau
  "dem_va_viet_so",
  "so_sanh",
  "day_so",
  "sap_xep_thu_tu",
  // ================== GIAI ĐOẠN 9, BƯỚC 2 (chủ đề "Độ dài"/"Thời gian", Lớp 1) ==================
  // Xếp gần "sap_xep_thu_tu" (cùng nhóm so sánh/sắp xếp) và ngay trước "giai_toan" (cùng nhóm
  // thời gian/vận dụng) để khi giáo viên bấm áp dụng CẢ 1 "gói chủ đề" cùng lúc, các dạng bài
  // cùng chủ đề vẫn đứng gần nhau trong phiếu thay vì bị các dạng bài khác chen giữa.
  "do_dai_so_sanh",
  "do_dai_sap_xep",
  "noi_phep_tinh",
  // ================== MỞ RỘNG LỚP 3, ĐỢT 2 ==================
  // 5 dạng bài mới - xếp SAU "noi_phep_tinh" (vẫn cùng mạch "kỹ năng số học" của phiếu) và TRƯỚC
  // "nhan_dien_hinh" (mạch hình học/trực quan), theo đúng thứ tự chủ đề xuất hiện trong PPCT SGK
  // Toán 3 KNTT (đơn vị đo -> hình học/chu vi-diện tích -> thời gian/tiền tệ -> thống kê).
  "chu_vi_dien_tich",
  "doi_don_vi_do",
  "tien_viet_nam",
  "kha_nang_xay_ra",
  // ================== MỞ RỘNG LỚP 3, ĐỢT 3 ==================
  // Xếp ngay sau "kha_nang_xay_ra" - cùng nhóm "thống kê, xác suất" trong PPCT SGK Toán 3 KNTT.
  "thu_thap_so_lieu",
  // ================== MỞ RỘNG LỚP 4, ĐỢT 1 ==================
  // "phan_so_rut_gon" xếp sau khối Lớp 3, trước "nhan_dien_hinh" - vẫn cùng mạch "kỹ năng số
  // học" của phiếu (Lớp 4 chỉ chọn được khi grade=LOP_4 nên không ảnh hưởng phiếu Lớp 1-3).
  "phan_so_rut_gon",
  // ================== MỞ RỘNG LỚP 4, ĐỢT 2 ==================
  // 3 dạng bài mới - xếp ngay sau "phan_so_rut_gon" (cùng mạch "phân số"/"kỹ năng số học" Lớp 4,
  // chỉ chọn được khi grade=LOP_4 nên không ảnh hưởng phiếu Lớp 1-3), "goc_nhan_biet" xếp cuối
  // cùng (mạch hình học) ngay trước "nhan_dien_hinh" - đúng thứ tự chủ đề SGK Toán 4 KNTT (biểu
  // thức chữ -> phân số -> góc).
  "bieu_thuc_chu",
  "phan_so_so_sanh",
  "goc_nhan_biet",
  "nhan_dien_hinh",
  "xem_dong_ho_gio_dung",
  "xem_dong_ho_gio_phut",
  "cac_ngay_trong_tuan",
  // ================== MỞ RỘNG LỚP 5, ĐỢT 1 ==================
  // "so_thap_phan_so_sanh" xếp trước "giai_toan" (giữ nguyên tắc "giai_toan" luôn cuối cùng, vì
  // đây là phần AI - đặt cuối để giáo viên xem hết phần code-driven trước) - chỉ chọn được khi
  // grade=LOP_5 nên không ảnh hưởng phiếu Lớp 1-4.
  "so_thap_phan_so_sanh",
  // ================== MỞ RỘNG LỚP 5, ĐỢT 2 ==================
  // "so_thap_phan_cong_tru" xếp ngay sau "so_thap_phan_so_sanh" (cùng mạch "số thập phân" - học
  // sinh so sánh trước rồi mới cộng/trừ, đúng thứ tự SGK Toán 5 KNTT), vẫn trước "giai_toan".
  "so_thap_phan_cong_tru",
  // ================== MỞ RỘNG LỚP 5, ĐỢT 3 ==================
  // "so_thap_phan_nhan"/"so_thap_phan_chia" xếp tiếp ngay sau "so_thap_phan_cong_tru" (đúng mạch
  // "4 phép tính số thập phân" của SGK: so sánh -> cộng/trừ -> nhân -> chia), vẫn trước "giai_toan".
  "so_thap_phan_nhan",
  "so_thap_phan_chia",
  // ================== MỞ RỘNG LỚP 5, ĐỢT 4 ==================
  // Xếp tiếp ngay sau "so_thap_phan_chia" (Đợt 3) - đúng mạch "số thập phân" (chia nâng cao +
  // chia có dư ôn tập), rồi tới tỉ số phần trăm, hình học, đo lường/vận tốc theo ĐÚNG thứ tự chủ
  // đề PPCT SGK Toán 5 KNTT. Vẫn xếp TRƯỚC "giai_toan" (giữ nguyên tắc AI luôn cuối cùng).
  "so_thap_phan_chia_nang_cao",
  "phep_chia_co_du",
  "ti_so_phan_tram",
  "hinh_tam_giac_hinh_thang",
  "hinh_tron",
  "the_tich_hhcn_lp",
  "doi_don_vi_the_tich",
  "dien_tich_xq_tp",
  "so_do_thoi_gian",
  "van_toc_quang_duong_thoi_gian",
  "giai_toan",
];

// ================== GIAI ĐOẠN 6 (mở rộng sang Tiếng Việt) ==================
// Thứ tự mặc định RIÊNG cho môn Tiếng Việt (4 dạng, tất cả đều cần AI) - từ dễ (nhận biết từ
// loại) đến khó hơn (đặt câu tự do, sáng tạo nhất, để cuối phiếu).
const DEFAULT_SECTION_ORDER_TIENG_VIET = ["khoanh_tu_loai", "noi_tu_nhom", "dien_tu_cho_san", "dat_cau_theo_mau"];

/**
 * TRƯỚC ĐÂY thứ tự khối bài trong phiếu LUÔN CỐ ĐỊNH (DEFAULT_SECTION_ORDER ở trên) bất kể
 * phiếu mẫu giáo viên upload có thứ tự khác - đây là 1 phần nguyên nhân "chỉ bắt chước layout/
 * màu sắc mà không bám theo đề toán mẫu trong ảnh" (phản hồi ban đầu của giáo viên). Giờ nếu
 * `sampleSpec.detectedExercises` hữu ích (xem worksheetSampleAnalyzer.js), các dạng bài VỪA
 * xuất hiện trong mẫu VỪA được giáo viên chọn (safeCounts > 0) sẽ đứng theo ĐÚNG thứ tự xuất
 * hiện trong mẫu; dạng bài nào giáo viên chọn thêm mà KHÔNG có trong mẫu thì xếp SAU CÙNG theo
 * thứ tự mặc định (không bị bỏ sót, chỉ xếp cuối).
 *
 * Áp dụng NGẦM, không cần giáo viên bấm gì thêm - giống cách sampleSpec đã ngầm ảnh hưởng layout/
 * màu sắc từ trước (pickLayoutFromSampleSpec). KHÁC với việc đổi SỐ LƯỢNG câu mỗi dạng
 * (exerciseCounts) - việc đó vẫn cần giáo viên chủ động bấm "Áp dụng cấu trúc từ phiếu mẫu" ở
 * WorksheetForm.jsx, vì ghi đè số liệu giáo viên đang chỉnh tay là hành động "nặng" hơn nhiều so
 * với chỉ đổi thứ tự hiển thị - không nên làm âm thầm.
 *
 * GIAI ĐOẠN 6: nhận thêm `subject` để chọn ĐÚNG bảng thứ tự mặc định (Toán hoặc Tiếng Việt) -
 * 2 môn có key hoàn toàn KHÔNG trùng nhau nên không có rủi ro lẫn lộn.
 */
function computeSectionOrder(safeCounts, sampleSpec, subject) {
  const defaultOrder = subject === "TIENG_VIET" ? DEFAULT_SECTION_ORDER_TIENG_VIET : DEFAULT_SECTION_ORDER;
  const selectedKeys = defaultOrder.filter((key) => safeCounts[key] > 0);
  const detectedKeys = isUsableWorksheetSampleSpec(sampleSpec)
    ? (sampleSpec?.detectedExercises || []).map((d) => d.key)
    : [];

  const fromSample = [];
  const seen = new Set();
  for (const key of detectedKeys) {
    if (selectedKeys.includes(key) && !seen.has(key)) {
      fromSample.push(key);
      seen.add(key);
    }
  }
  const remaining = selectedKeys.filter((key) => !seen.has(key));
  return [...fromSample, ...remaining];
}

/** Các dạng bài "đơn giản" (1 khối, không cần async, không cần logic đặc biệt) - tra cứu theo
 * key để dùng trong vòng lặp bên trong generateWorksheet(). "nhan_dien_hinh" (tự động kèm
 * "dem_hinh_ung_dung") và "giai_toan" (cần gọi AI bất đồng bộ + gom answerKeyText) được xử lý
 * RIÊNG trong vòng lặp chính, không nằm trong bảng này. */
function buildSimpleSection(key, { grade, safeCounts, mascotFor }) {
  switch (key) {
    case "tinh_nham":
      return {
        type: "tinh_nham",
        title: pickInstructionVariant("tinh_nham") || "Tính nhẩm.",
        mascot: mascotFor("tinh_nham"),
        items: generateTinhNham(grade, safeCounts.tinh_nham),
      };
    // ================== MỞ RỘNG LỚP 3, ĐỢT 1 ==================
    // "Nhân, chia trong bảng" - type: "tinh_nham" CHỦ Ý (không phải "nhan_chia_bang") để TÁI DÙNG
    // NGUYÊN TinhNhamSection (web)/buildTinhNhamParagraphs (Word) - đúng cách "do_dai_sap_xep"/
    // "cac_ngay_trong_tuan" đã tái dùng component khác trong file này, vì dữ liệu CÙNG khuôn
    // {operandA, operandB, operator, answer}. title/mascot vẫn lấy ĐÚNG theo key catalog riêng
    // "nhan_chia_bang" (khác câu lệnh/mascot với "tinh_nham" thật).
    case "nhan_chia_bang":
      return {
        type: "tinh_nham",
        title: pickInstructionVariant("nhan_chia_bang") || "Tính nhẩm.",
        mascot: mascotFor("nhan_chia_bang"),
        items: generateNhanChiaBang(safeCounts.nhan_chia_bang),
      };
    // GIAI ĐOẠN F: dạng bài MỚI "Tách - Gộp" (xem generateTachGop() trong worksheetSchemas.js).
    case "tach_gop":
      return {
        type: "tach_gop",
        title: pickInstructionVariant("tach_gop") || "Điền số còn thiếu vào sơ đồ tách - gộp.",
        mascot: mascotFor("tach_gop"),
        items: generateTachGop(grade, safeCounts.tach_gop),
      };
    case "dem_va_viet_so":
      return {
        type: "dem_va_viet_so",
        title: pickInstructionVariant("dem_va_viet_so") || "Đếm và viết số thích hợp vào ô trống.",
        mascot: mascotFor("dem_va_viet_so"),
        items: generateDemVaVietSo(grade, safeCounts.dem_va_viet_so),
      };
    case "so_sanh":
      return {
        type: "so_sanh",
        title: pickInstructionVariant("so_sanh") || "So sánh. Điền dấu >, <, = thích hợp.",
        mascot: mascotFor("so_sanh"),
        items: generateSoSanh(grade, safeCounts.so_sanh),
      };
    case "day_so":
      return {
        type: "day_so",
        title: pickInstructionVariant("day_so") || "Viết số thích hợp vào ô trống.",
        mascot: mascotFor("day_so"),
        items: generateDaySo(grade, safeCounts.day_so),
      };
    case "sap_xep_thu_tu": {
      const items = generateSapXepThuTu(grade, safeCounts.sap_xep_thu_tu);
      return {
        type: "sap_xep_thu_tu",
        // ================== SỬA LỖI (Phiên 14) ==================
        // TRƯỚC ĐÂY dùng thẳng pickInstructionVariant() (kho câu random, câu đầu tiên cố định
        // "...từ bé đến lớn") trong khi generateSapXepThuTu() có thể trả hướng "desc" - gây lệch
        // đề bài/bài làm. SỬA: tự dựng câu lệnh khớp ĐÚNG hướng thật đã random (items[0].direction
        // - mọi dòng trong section giờ luôn cùng 1 hướng, xem comment trong worksheetSchemas.js).
        title: items[0]?.direction === "desc" ? "Sắp xếp các số theo thứ tự từ lớn đến bé." : "Sắp xếp các số theo thứ tự từ bé đến lớn.",
        mascot: mascotFor("sap_xep_thu_tu"),
        items,
      };
    }
    case "noi_phep_tinh":
      return {
        type: "noi_phep_tinh",
        title: pickInstructionVariant("noi_phep_tinh") || "Nối phép tính với kết quả đúng.",
        mascot: mascotFor("noi_phep_tinh"),
        data: generateNoiPhepTinh(grade, safeCounts.noi_phep_tinh),
      };
    // ================== GIAI ĐOẠN 9, BƯỚC 2 (chủ đề "Độ dài"/"Thời gian", Lớp 1) ==================
    case "do_dai_so_sanh":
      return {
        type: "do_dai_so_sanh",
        title: pickInstructionVariant("do_dai_so_sanh") || "So sánh độ dài rồi điền dấu >, <, = thích hợp.",
        mascot: mascotFor("do_dai_so_sanh"),
        items: generateDoDaiSoSanh(safeCounts.do_dai_so_sanh),
      };
    case "do_dai_sap_xep":
      {
        const items = generateDoDaiSapXep(safeCounts.do_dai_sap_xep);
        return {
          type: "do_dai_sap_xep",
          // Cùng sửa lỗi như "sap_xep_thu_tu" ở trên - câu lệnh khớp đúng hướng thật đã random.
          title: items[0]?.direction === "desc" ? "Sắp xếp độ dài các băng giấy theo thứ tự từ dài đến ngắn." : "Sắp xếp độ dài các băng giấy theo thứ tự từ ngắn đến dài.",
          mascot: mascotFor("do_dai_sap_xep"),
          items,
        };
      }
    case "xem_dong_ho_gio_dung":
      return {
        type: "xem_dong_ho_gio_dung",
        title: pickInstructionVariant("xem_dong_ho_gio_dung") || "Xem đồng hồ rồi viết giờ thích hợp vào chỗ trống.",
        mascot: mascotFor("xem_dong_ho_gio_dung"),
        items: generateXemDongHoGioDung(safeCounts.xem_dong_ho_gio_dung),
      };
    // ================== MỞ RỘNG LỚP 3, ĐỢT 2 ==================
    case "xem_dong_ho_gio_phut":
      return {
        type: "xem_dong_ho_gio_phut",
        title: pickInstructionVariant("xem_dong_ho_gio_phut") || "Xem đồng hồ rồi viết giờ, phút thích hợp vào chỗ trống.",
        mascot: mascotFor("xem_dong_ho_gio_phut"),
        items: generateXemDongHoGioPhut(safeCounts.xem_dong_ho_gio_phut),
      };
    case "chu_vi_dien_tich":
      return {
        type: "chu_vi_dien_tich",
        title: pickInstructionVariant("chu_vi_dien_tich") || "Tính chu vi hoặc diện tích hình đã cho.",
        mascot: mascotFor("chu_vi_dien_tich"),
        items: generateChuViDienTich(safeCounts.chu_vi_dien_tich),
      };
    case "doi_don_vi_do":
      return {
        type: "doi_don_vi_do",
        title: pickInstructionVariant("doi_don_vi_do") || "Đổi các số đo sau.",
        mascot: mascotFor("doi_don_vi_do"),
        items: generateDoiDonVi(safeCounts.doi_don_vi_do),
      };
    case "tien_viet_nam":
      return {
        type: "tien_viet_nam",
        title: pickInstructionVariant("tien_viet_nam") || "Tính tổng số tiền.",
        mascot: mascotFor("tien_viet_nam"),
        items: generateTienVietNam(safeCounts.tien_viet_nam),
      };
    case "kha_nang_xay_ra":
      return {
        type: "kha_nang_xay_ra",
        title: pickInstructionVariant("kha_nang_xay_ra") || "Khoanh vào khả năng xảy ra đúng của mỗi sự kiện sau.",
        mascot: mascotFor("kha_nang_xay_ra"),
        items: generateKhaNangXayRa(safeCounts.kha_nang_xay_ra),
      };
    // ================== MỞ RỘNG LỚP 3, ĐỢT 3 ==================
    // Khác các case khác: generateThuThapSoLieu trả về {title, data, questions} (1 bảng số liệu
    // DUY NHẤT + nhiều câu hỏi rút ra từ bảng đó), không phải mảng "items" độc lập từng câu.
    case "thu_thap_so_lieu": {
      const survey = generateThuThapSoLieu(safeCounts.thu_thap_so_lieu);
      return {
        type: "thu_thap_so_lieu",
        title: pickInstructionVariant("thu_thap_so_lieu") || "Quan sát bảng số liệu rồi trả lời câu hỏi.",
        mascot: mascotFor("thu_thap_so_lieu"),
        surveyTitle: survey.title,
        data: survey.data,
        questions: survey.questions,
      };
    }
    case "phan_so_rut_gon":
      return {
        type: "phan_so_rut_gon",
        title: pickInstructionVariant("phan_so_rut_gon") || "Rút gọn các phân số sau.",
        mascot: mascotFor("phan_so_rut_gon"),
        items: generatePhanSoRutGon(safeCounts.phan_so_rut_gon),
      };
    // ================== MỞ RỘNG LỚP 4, ĐỢT 2 ==================
    case "bieu_thuc_chu":
      return {
        type: "bieu_thuc_chu",
        title: pickInstructionVariant("bieu_thuc_chu") || "Tính giá trị của biểu thức.",
        mascot: mascotFor("bieu_thuc_chu"),
        items: generateBieuThucChu(safeCounts.bieu_thuc_chu),
      };
    case "phan_so_so_sanh":
      return {
        type: "phan_so_so_sanh",
        title: pickInstructionVariant("phan_so_so_sanh") || "So sánh. Điền dấu >, <, = thích hợp.",
        mascot: mascotFor("phan_so_so_sanh"),
        items: generatePhanSoSoSanh(safeCounts.phan_so_so_sanh),
      };
    case "goc_nhan_biet":
      return {
        type: "goc_nhan_biet",
        title: pickInstructionVariant("goc_nhan_biet") || "Quan sát mỗi góc rồi cho biết đó là góc gì.",
        mascot: mascotFor("goc_nhan_biet"),
        items: generateGocNhanBiet(safeCounts.goc_nhan_biet),
      };
    case "so_thap_phan_so_sanh":
      return {
        type: "so_thap_phan_so_sanh",
        title: pickInstructionVariant("so_thap_phan_so_sanh") || "So sánh. Điền dấu >, <, = thích hợp.",
        mascot: mascotFor("so_thap_phan_so_sanh"),
        items: generateSoThapPhanSoSanh(safeCounts.so_thap_phan_so_sanh),
      };
    case "so_thap_phan_cong_tru":
      return {
        type: "so_thap_phan_cong_tru",
        title: pickInstructionVariant("so_thap_phan_cong_tru") || "Đặt tính rồi tính.",
        mascot: mascotFor("so_thap_phan_cong_tru"),
        items: generateSoThapPhanCongTru(safeCounts.so_thap_phan_cong_tru),
      };
    case "so_thap_phan_nhan":
      return {
        type: "so_thap_phan_nhan",
        title: pickInstructionVariant("so_thap_phan_nhan") || "Đặt tính rồi tính.",
        mascot: mascotFor("so_thap_phan_nhan"),
        items: generateSoThapPhanNhan(safeCounts.so_thap_phan_nhan),
      };
    case "so_thap_phan_chia":
      return {
        type: "so_thap_phan_chia",
        title: pickInstructionVariant("so_thap_phan_chia") || "Đặt tính rồi tính.",
        mascot: mascotFor("so_thap_phan_chia"),
        items: generateSoThapPhanChia(safeCounts.so_thap_phan_chia),
      };
    // ================== MỞ RỘNG LỚP 5, ĐỢT 4 ==================
    case "ti_so_phan_tram":
      return {
        type: "ti_so_phan_tram",
        title: pickInstructionVariant("ti_so_phan_tram") || "Giải các bài toán sau.",
        mascot: mascotFor("ti_so_phan_tram"),
        items: generateTiSoPhanTram(safeCounts.ti_so_phan_tram),
      };
    case "hinh_tam_giac_hinh_thang":
      return {
        type: "hinh_tam_giac_hinh_thang",
        title: pickInstructionVariant("hinh_tam_giac_hinh_thang") || "Giải các bài toán sau.",
        mascot: mascotFor("hinh_tam_giac_hinh_thang"),
        items: generateHinhTamGiacHinhThang(safeCounts.hinh_tam_giac_hinh_thang),
      };
    case "hinh_tron":
      return {
        type: "hinh_tron",
        title: pickInstructionVariant("hinh_tron") || "Giải các bài toán sau (lấy π ≈ 3,14).",
        mascot: mascotFor("hinh_tron"),
        items: generateHinhTron(safeCounts.hinh_tron),
      };
    case "the_tich_hhcn_lp":
      return {
        type: "the_tich_hhcn_lp",
        title: pickInstructionVariant("the_tich_hhcn_lp") || "Giải các bài toán sau.",
        mascot: mascotFor("the_tich_hhcn_lp"),
        items: generateTheTichHopLapPhuong(safeCounts.the_tich_hhcn_lp),
      };
    case "doi_don_vi_the_tich":
      return {
        type: "doi_don_vi_the_tich",
        title: pickInstructionVariant("doi_don_vi_the_tich") || "Viết số thích hợp vào chỗ trống.",
        mascot: mascotFor("doi_don_vi_the_tich"),
        items: generateDoiDonViTheTich(safeCounts.doi_don_vi_the_tich),
      };
    case "dien_tich_xq_tp":
      return {
        type: "dien_tich_xq_tp",
        title: pickInstructionVariant("dien_tich_xq_tp") || "Giải các bài toán sau.",
        mascot: mascotFor("dien_tich_xq_tp"),
        items: generateDienTichXqTp(safeCounts.dien_tich_xq_tp),
      };
    case "so_do_thoi_gian":
      return {
        type: "so_do_thoi_gian",
        title: pickInstructionVariant("so_do_thoi_gian") || "Tính.",
        mascot: mascotFor("so_do_thoi_gian"),
        items: generateSoDoThoiGian(safeCounts.so_do_thoi_gian),
      };
    case "van_toc_quang_duong_thoi_gian":
      return {
        type: "van_toc_quang_duong_thoi_gian",
        title: pickInstructionVariant("van_toc_quang_duong_thoi_gian") || "Giải các bài toán sau.",
        mascot: mascotFor("van_toc_quang_duong_thoi_gian"),
        items: generateVanTocQuangDuongThoiGian(safeCounts.van_toc_quang_duong_thoi_gian),
      };
    case "phep_chia_co_du":
      return {
        type: "phep_chia_co_du",
        title: pickInstructionVariant("phep_chia_co_du") || "Đặt tính rồi tính.",
        mascot: mascotFor("phep_chia_co_du"),
        items: generatePhepChiaCoDu(safeCounts.phep_chia_co_du),
      };
    case "so_thap_phan_chia_nang_cao":
      return {
        type: "so_thap_phan_chia_nang_cao",
        title: pickInstructionVariant("so_thap_phan_chia_nang_cao") || "Đặt tính rồi tính.",
        mascot: mascotFor("so_thap_phan_chia_nang_cao"),
        items: generateSoThapPhanChiaNangCao(safeCounts.so_thap_phan_chia_nang_cao),
      };
    case "cac_ngay_trong_tuan":
      return {
        type: "cac_ngay_trong_tuan",
        title: pickInstructionVariant("cac_ngay_trong_tuan") || "Điền tên ngày còn thiếu vào chỗ trống.",
        mascot: mascotFor("cac_ngay_trong_tuan"),
        items: generateCacNgayTrongTuan(safeCounts.cac_ngay_trong_tuan),
      };
    default:
      return null;
  }
}

/**
 * Sinh toàn bộ phiếu bài tập theo cấu hình giáo viên chọn.
 * @param config { grade, includeAnswers, exerciseCounts: { tinh_nham, dem_va_viet_so, so_sanh,
 *   day_so, sap_xep_thu_tu, noi_phep_tinh, giai_toan, nhan_dien_hinh } } - số lượng từng dạng,
 *   0 = không chọn. LƯU Ý: "dem_hinh_ung_dung" KHÔNG nằm trong exerciseCounts - đây là hoạt
 *   động tự động, luôn được thêm kèm khi nhan_dien_hinh > 0 (xem Giai đoạn 2 bên dưới).
 * @param config.layoutId  (tuỳ chọn) giáo viên tự chọn 1 layout cụ thể (xem listLayouts() trong
 *   worksheetLayoutTemplates.js). Bỏ trống -> hệ thống tự chọn ngẫu nhiên (hoặc theo sampleSpec
 *   nếu có, xem bên dưới).
 * @param config.previousLayoutId  (tuỳ chọn) layoutId của LẦN TẠO GẦN NHẤT (client tự lưu &
 *   gửi lên) - dùng để tránh random trúng lại đúng layout vừa dùng, cho cảm giác đa dạng hơn
 *   giữa các lần bấm tạo liên tiếp. Bỏ qua nếu đã chỉ định layoutId thủ công.
 * @param config.sampleSpec  (GIAI ĐOẠN 2, tuỳ chọn) spec đã phân tích từ phiếu mẫu giáo viên
 *   upload (xem worksheetSampleAnalyzer.js) - dùng để CHỌN layout gần giống phong cách phiếu
 *   mẫu (qua pickLayoutFromSampleSpec()) thay vì random hoàn toàn, VÀ (GIAI ĐOẠN 4 MỚI) để sắp
 *   xếp THỨ TỰ khối bài theo đúng mẫu (xem computeSectionOrder() ở trên). Bỏ qua layout nếu đã
 *   chỉ định layoutId.
 * @param config.referenceContext  (GIAI ĐOẠN 2, tuỳ chọn) đoạn text trích từ tài liệu tham khảo
 *   (SGK/đề cương riêng giáo viên upload) - làm ngữ cảnh chủ đề khi AI soạn "giải toán có lời văn".
 * @param config.favoriteLayoutId  (GIAI ĐOẠN 3, tuỳ chọn) layoutId giáo viên đã lưu làm yêu
 *   thích (xem teacherPreferenceStore.js) - được ưu tiên THẤP HƠN sampleSpec (nếu giáo viên vừa
 *   upload phiếu mẫu ở lần này, ý định "theo phiếu mẫu" rõ ràng hơn ý thích lưu từ trước), và
 *   CHỈ áp dụng CÓ XÁC SUẤT (xem pickLayoutWithPreference()) để không quay lại vấn đề lặp khuôn.
 * @param config.sgkVolume, config.sgkChapterId  (GIAI ĐOẠN 5, tuỳ chọn) Tập + Chương/Bài SGK giáo
 *   viên chọn (qua /api/chapters, xem WorksheetForm.jsx) - nội dung chương này được tải server-
 *   side (best-effort, xem resolveSgkChapterContext()) và ưu tiên CAO NHẤT làm ngữ cảnh chủ đề
 *   cho AI soạn "giải toán có lời văn" (cao hơn cả referenceContext từ file mẫu upload, vì đây là
 *   tín hiệu "giáo viên đang dạy đúng bài này" rõ ràng và chính thống hơn). Chỉ áp dụng cho
 *   LOP_1/LOP_2 (Mầm non không có SGK theo chương, xem WORKSHEET_GRADE_TO_SGK_GRADE).
 * @param config.subject  (GIAI ĐOẠN 6, tuỳ chọn, mặc định "TOAN") "TOAN" | "TIENG_VIET" - quyết
 *   định catalog nào được dùng (getSelectableCatalogFor), thứ tự mặc định nào áp dụng
 *   (computeSectionOrder), và môn nào khi tải chương SGK (resolveSgkChapterContext). Với
 *   "TIENG_VIET", TẤT CẢ 4 dạng bài đều cần AI (không có dạng thuần code như Toán).
 * @param config.storytellingMode  (GIAI ĐOẠN F, tuỳ chọn, mặc định false) giáo viên CHỦ ĐỘNG bật
 *   để các bài "giải toán có lời văn" (chỉ dạng này, không áp dụng dạng khác) dùng CHUNG 1 chủ
 *   đề/nhân vật xuyên suốt kiểu 1 câu chuyện nhiều tập, thay vì mỗi bài 1 chủ đề rời rạc (mặc
 *   định khi tắt). false/bỏ trống -> giữ nguyên hành vi cũ (mỗi bài 1 chủ đề ngẫu nhiên riêng).
 * @param config.storytellingTheme  (GIAI ĐOẠN F, tuỳ chọn) chủ đề/nhân vật giáo viên tự gõ khi
 *   storytellingMode=true (VD "bạn Bống đi chợ Tết cùng bà"). Bỏ trống -> hệ thống tự random 1
 *   chủ đề có sẵn (xem pickStorytellingTheme()). Bị bỏ qua nếu storytellingMode=false.
 */
export async function generateWorksheet({
  grade,
  includeAnswers = false,
  exerciseCounts,
  layoutId = null,
  previousLayoutId = null,
  sampleSpec = null,
  referenceContext = null,
  favoriteLayoutId = null,
  sgkVolume = null,
  sgkChapterId = null,
  subject = "TOAN",
  storytellingMode = false,
  storytellingTheme = null,
}) {
  if (!WORKSHEET_GRADES[grade]) throw new Error(`Khối lớp không hợp lệ: ${grade}`);

  // ================== GIAI ĐOẠN 2 (an toàn phía server) ==================
  // WorksheetForm.jsx giờ chỉ hiện đúng dạng bài phù hợp khối lớp (getSelectableCatalogFor),
  // NHƯNG đó là lọc phía CLIENT - ai gọi thẳng /api/generate-worksheet (bỏ qua form) vẫn có thể
  // gửi 1 key không hợp lệ với khối lớp (VD "noi_phep_tinh" cho MAM_NON, catalog khai báo
  // minGrade LOP_1). Lọc lại 1 lần nữa ở đây cho chắc - không tin tưởng dữ liệu từ client.
  // GIAI ĐOẠN 6: lọc theo ĐÚNG subject - key Toán và Tiếng Việt hoàn toàn không trùng tên nên
  // dù client gửi lẫn (VD subject="TOAN" nhưng lại kèm key "khoanh_tu_loai") vẫn bị loại sạch.
  const eligibleKeys = new Set(getSelectableCatalogFor(grade, subject).map((item) => item.key));
  const safeCounts = Object.fromEntries(
    Object.entries(exerciseCounts || {}).map(([key, value]) => [key, eligibleKeys.has(key) ? value : 0])
  );

  let layout;
  if (layoutId) {
    layout = getLayoutById(layoutId) || pickRandomLayout(previousLayoutId);
  } else if (isUsableWorksheetSampleSpec(sampleSpec)) {
    layout = pickLayoutFromSampleSpec(sampleSpec, previousLayoutId);
  } else if (favoriteLayoutId) {
    layout = pickLayoutWithPreference(favoriteLayoutId, previousLayoutId);
  } else {
    layout = pickRandomLayout(previousLayoutId);
  }

  // ================== GIAI ĐOẠN 5 (liên kết SGK markdown) ==================
  const warnings = [];
  const { context: sgkContext, label: sgkLabel, warning: sgkWarning } = await resolveSgkChapterContext({
    grade,
    subject,
    sgkVolume,
    sgkChapterId,
  });
  if (sgkWarning) warnings.push(sgkWarning);

  // Ngữ cảnh chủ đề cho AI (bài toán có lời văn HOẶC 4 dạng Tiếng Việt - xem GIAI ĐOẠN 6): ƯU
  // TIÊN chương SGK giáo viên vừa chọn (sgkContext - tín hiệu "đang dạy đúng bài này" rõ ràng,
  // chính thống nhất), sau đó đến đoạn text trích thô từ file mẫu upload (referenceContext,
  // chính xác nhưng có thể không phải bài đang dạy), cuối cùng mới đến themeHints do AI suy luận
  // từ ảnh/PDF scan (kém chi tiết nhất, chỉ còn hơn không có gì).
  const aiContentContext = sgkContext || referenceContext || sampleSpec?.themeHints || null;

  // GIAI ĐOẠN F (storytelling): chỉ resolve khi giáo viên chủ động bật - tính SẴN 1 lần ở đây
  // (không phải trong generateWordProblems) để nếu sau này storytelling được mở rộng sang dạng
  // bài khác (VD Tiếng Việt) thì vẫn dùng chung đúng 1 chủ đề đã chọn, không random lại mỗi nơi.
  const resolvedStorytellingTheme = storytellingMode ? pickStorytellingTheme(storytellingTheme) : null;

  // ================== GIAI ĐOẠN 4 ==================
  // Layout "adventure_map" (bản đồ phiêu lưu) được MÔ TẢ là "mascot chính dẫn dắt xuyên suốt
  // phiếu, không đổi mascot giữa chừng" (xem worksheetLayoutTemplates.js) - trước đây mô tả này
  // CHƯA thực sự được code hoá, mỗi khối vẫn random mascot độc lập như các layout khác. Giờ
  // chốt 1 "heroMascot" DUY NHẤT ngay từ đầu và dùng xuyên suốt mọi khối trong phiếu, đúng như
  // lời hứa trong mô tả layout - tạo cảm giác 1 câu chuyện liền mạch thay vì rời rạc.
  // GIAI ĐOẠN 6: key đại diện để rút mascot cũng phải theo ĐÚNG subject (key Toán không tồn tại
  // ý nghĩa gì với phiếu Tiếng Việt, dù về mặt kỹ thuật pickMascot() vẫn chạy được vì catalog là
  // danh sách chung - nhưng chọn đúng subject cho ra mascot phù hợp chủ đề hơn).
  const representativeKey = subject === "TIENG_VIET" ? "khoanh_tu_loai" : "tinh_nham";
  const heroMascot = layout.id === "adventure_map" ? pickMascot(representativeKey) : null;
  function mascotFor(key) {
    return heroMascot || pickMascot(key);
  }

  // ================== GIAI ĐOẠN 4 MỚI (content-aware theo mẫu thật) ==================
  // Xây dựng sections THEO ĐÚNG THỨ TỰ computeSectionOrder() đã tính - KHÁC bản cũ (luôn build
  // theo 1 chuỗi if cố định đúng DEFAULT_SECTION_ORDER, không thể đổi thứ tự dù có sampleSpec).
  const sections = [];
  const answerKeyParts = []; // GIAI ĐOẠN 6: gộp đáp án nhiều dạng bài AI (không chỉ giải toán như trước) vào 1 QR duy nhất

  const orderedKeys = computeSectionOrder(safeCounts, sampleSpec, subject);

  for (const key of orderedKeys) {
    if (key === "nhan_dien_hinh") {
      const shapes = generateNhanDienHinh(safeCounts.nhan_dien_hinh);
      sections.push({
        type: "nhan_dien_hinh",
        title: pickInstructionVariant("nhan_dien_hinh") || "Bé nhận biết hình và tô màu.",
        mascot: mascotFor("nhan_dien_hinh"),
        shapes,
      });

      // ================== GIAI ĐOẠN 2 (sửa bug "Nhận diện hình" đứng trơ trọi) ==================
      // TRƯỚC ĐÂY "Nhận diện hình" là dạng bài DUY NHẤT không có hoạt động ứng dụng đi kèm - chỉ
      // liệt kê hình + tô màu rồi dừng lại, đúng vấn đề giáo viên phản ánh ("chỉ có các hình đó
      // và không có gì khác"). Giờ LUÔN tự động thêm khối "Đếm hình theo yêu cầu" ngay sau, dùng
      // CHUNG danh sách `shapes` vừa sinh ở trên - KHÔNG đọc từ exerciseCounts (không phải ô chọn
      // riêng, xem catalog "dem_hinh_ung_dung" hiddenFromForm:true) nên giáo viên không cần nhớ
      // bật thêm gì, và không thể vô tình bỏ sót hoạt động ứng dụng như bản cũ.
      const demHinh = generateDemHinhUngDung(shapes, Math.min(3, shapes.length));
      sections.push({
        type: "dem_hinh_ung_dung",
        title: pickInstructionVariant("dem_hinh_ung_dung") || "Đếm xem có bao nhiêu hình mỗi loại rồi viết số vào ô trống.",
        mascot: mascotFor("dem_hinh_ung_dung"),
        data: demHinh,
      });
      continue;
    }

    if (key === "giai_toan") {
      const problems = await generateWordProblems({
        grade,
        count: safeCounts.giai_toan,
        includeAnswers,
        referenceContext: aiContentContext,
        storytellingTheme: resolvedStorytellingTheme,
      });
      sections.push({
        type: "giai_toan",
        title: pickInstructionVariant("giai_toan") || "Giải bài toán.",
        mascot: mascotFor("giai_toan"),
        items: problems,
      });

      // ================== GIAI ĐOẠN 4 (nội bộ, đã có từ trước) + GIAI ĐOẠN 6 (gộp nhiều dạng) ==
      // Đáp số các bài "giải toán có lời văn" (CHỈ dạng AI-sinh mới cần đáp án dạng câu chữ tự do
      // - các dạng bài code-sinh khác như tính nhẩm/so sánh có đáp số tính trực tiếp từ số liệu,
      // học sinh/phụ huynh tự đối chiếu dễ dàng, không cần QR) -> gộp vào answerKeyParts để mã
      // hoá chung 1 QR "chấm nhanh" (xem WorksheetPreview.jsx / worksheetExportService.js).
      if (includeAnswers && problems.some((p) => p.answer)) {
        answerKeyParts.push({
          label: "Giải toán",
          text: problems.map((p, i) => `Bài ${i + 1}: ${p.answer || "?"}`).join("\n"),
        });
      }
      continue;
    }

    // ================== GIAI ĐOẠN 6 (mở rộng sang Tiếng Việt) ==================
    // Cả 4 dạng đều cần AI (xem generateKhoanhTuLoai/generateNoiTuNhom/generateDienTuChoSan/
    // generateDatCauTheoMau ở trên) - xử lý riêng ở đây (giống "giai_toan") thay vì trong
    // buildSimpleSection() (dành cho dạng thuần code, đồng bộ).
    if (key === "khoanh_tu_loai") {
      const items = await generateKhoanhTuLoai({ grade, count: safeCounts.khoanh_tu_loai, referenceContext: aiContentContext });
      sections.push({
        type: "khoanh_tu_loai",
        title: pickInstructionVariant("khoanh_tu_loai") || "Khoanh tròn vào từ chỉ hoạt động / đặc điểm.",
        mascot: mascotFor("khoanh_tu_loai"),
        items,
      });
      if (includeAnswers && items.length) {
        answerKeyParts.push({
          label: "Khoanh từ",
          text: items.map((it, i) => `Câu ${i + 1}: ${it.targetWord}`).join("\n"),
        });
      }
      continue;
    }
    if (key === "noi_tu_nhom") {
      const data = await generateNoiTuNhom({ grade, count: safeCounts.noi_tu_nhom, referenceContext: aiContentContext });
      sections.push({
        type: "noi_tu_nhom",
        title: pickInstructionVariant("noi_tu_nhom") || "Nối từ với nhóm thích hợp.",
        mascot: mascotFor("noi_tu_nhom"),
        data,
      });
      if (includeAnswers && data.pairs.length) {
        answerKeyParts.push({
          label: "Nối từ",
          text: data.pairs.map((p, i) => `${i + 1}. ${p.left} - ${p.right}`).join("\n"),
        });
      }
      continue;
    }
    if (key === "dien_tu_cho_san") {
      const data = await generateDienTuChoSan({ grade, count: safeCounts.dien_tu_cho_san, referenceContext: aiContentContext });
      sections.push({
        type: "dien_tu_cho_san",
        title: pickInstructionVariant("dien_tu_cho_san") || "Điền từ thích hợp vào chỗ trống.",
        mascot: mascotFor("dien_tu_cho_san"),
        data,
      });
      if (includeAnswers && data.sentences.length) {
        answerKeyParts.push({
          label: "Điền từ",
          text: data.sentences.map((s, i) => `Câu ${i + 1}: ${s.answer}`).join("\n"),
        });
      }
      continue;
    }
    if (key === "dat_cau_theo_mau") {
      // Không có "đáp án" cố định - học sinh tự sáng tạo câu riêng theo mẫu, không đẩy vào
      // answerKeyParts (không có gì để đối chiếu đúng/sai tuyệt đối).
      const items = await generateDatCauTheoMau({ grade, count: safeCounts.dat_cau_theo_mau, referenceContext: aiContentContext });
      sections.push({
        type: "dat_cau_theo_mau",
        title: pickInstructionVariant("dat_cau_theo_mau") || "Đặt câu theo mẫu.",
        mascot: mascotFor("dat_cau_theo_mau"),
        items,
      });
      continue;
    }

    const section = buildSimpleSection(key, { grade, safeCounts, mascotFor });
    if (section) sections.push(section);
  }

  const answerKeyText = answerKeyParts.length
    ? answerKeyParts.map((p) => `--- ${p.label} ---\n${p.text}`).join("\n\n")
    : null;

  return {
    sections,
    layout,
    answerKeyText,
    warnings,
    sgkChapterLabel: sgkLabel,
    // GIAI ĐOẠN F: trả về chủ đề storytelling ĐÃ CHỐT (kể cả khi random) để UI có thể hiển thị
    // cho giáo viên biết phiếu đang kể chuyện theo chủ đề gì (null nếu storytellingMode tắt).
    storytellingTheme: resolvedStorytellingTheme,
  };
}

/** Danh sách dạng bài ĐÃ TRIỂN KHAI VÀ CHỌN ĐƯỢC (bỏ "planned" và "hiddenFromForm") cho 1
 * khối lớp - để form dựng động danh sách checkbox từ catalog thay vì hard-code EXERCISE_LABELS
 * như trước. GIAI ĐOẠN 2: WorksheetForm.jsx import trực tiếp getSelectableCatalogFor() từ
 * worksheetExerciseCatalog.js (module dữ liệu thuần, an toàn phía client) thay vì hàm này, vì
 * hàm này nằm trong worksheetGenerator.js - file có import geminiKeyPool.js (đọc biến môi
 * trường phía server) nên KHÔNG nên import trực tiếp từ component "use client". Giữ hàm này lại
 * để dùng phía server nếu sau này cần 1 API route liệt kê dạng bài. */
export function listAvailableExercises(grade, subject = "TOAN") {
  return getSelectableCatalogFor(grade, subject).map(({ key, label, skillGroup, source, defaultCount }) => ({
    key,
    label,
    skillGroup,
    source,
    defaultCount,
  }));
}
