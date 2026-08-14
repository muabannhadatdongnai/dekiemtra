import { buildReportCommentPrompt, REPORT_COMMENT_MODEL } from "@/data/reportCommentPromptTemplates";
import { getReportCommentLevelConfig } from "@/data/reportCommentConfig";
import { generateContentWithFailover } from "./geminiKeyPool";

/**
 * reportCommentEngine.js
 * Lớp gọi AI DUY NHẤT cho module "Nhận xét học bạ" - đúng khuôn lessonPlanEngine.js: mỗi học
 * sinh là 1 nội dung CỤ THỂ, không cần chống trùng ý tưởng như ngân hàng câu hỏi.
 *
 * maxRetries: thử lại nếu AI trả JSON lỗi hoặc thiếu trường bắt buộc - KHÔNG throw ngay, giáo
 * viên không nên mất lượt chỉ vì 1 lần AI trả JSON hỏng (đặc biệt quan trọng ở luồng hàng loạt,
 * nơi 1 lỗi không nên làm hỏng cả danh sách - xem generateBulkReportComments()).
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function validateParsedComment(parsed, structure) {
  if (!parsed || typeof parsed !== "object") return false;
  if (!Array.isArray(parsed.monHoc)) return false;
  if (structure === "3-phan") {
    return typeof parsed.phamChat === "string" && typeof parsed.nangLuc === "string";
  }
  return typeof parsed.nhanXetChung === "string";
}

export async function generateReportCommentContent({
  cap,
  hoTen,
  lop,
  doDai,
  ghiChuPhamChat,
  ghiChuNangLuc,
  monHocList,
  nhanXetChungTho,
  previousComment,
  maxRetries = 2,
}) {
  const levelConfig = getReportCommentLevelConfig(cap);
  if (!levelConfig) {
    throw new Error(`Cấp học không hợp lệ: ${cap}`);
  }

  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const prompt = buildReportCommentPrompt({
      cap,
      hoTen,
      lop,
      doDai,
      ghiChuPhamChat,
      ghiChuNangLuc,
      monHocList,
      nhanXetChungTho,
      previousComment,
    });

    try {
      const result = await generateContentWithFailover({
        model: REPORT_COMMENT_MODEL,
        contents: prompt,
        config: { temperature: 0.6, responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(result.text);
      if (!validateParsedComment(parsed, levelConfig.structure)) {
        throw new Error("Thiếu trường bắt buộc trong JSON nhận xét trả về.");
      }
      return { comment: parsed, quotaExhausted: false };
    } catch (err) {
      lastError = err;
      if (err.allKeysExhausted) {
        return { comment: null, quotaExhausted: true, serverOverloaded: false, error: err };
      }
      // Giống lessonPlanEngine.js: phân biệt "quá tải tạm thời" (503/UNAVAILABLE) với lỗi khác -
      // chờ backoff tăng dần thay vì dội lại ngay lập tức.
      if (err.allKeysOverloaded) {
        if (attempt === maxRetries) {
          return { comment: null, quotaExhausted: false, serverOverloaded: true, error: err };
        }
        await sleep(1500 * (attempt + 1));
      }
      attempt++;
    }
  }

  throw new Error(
    `Không thể tạo nhận xét cho học sinh "${hoTen}" sau ${maxRetries + 1} lần thử. ` +
      `(Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}

/**
 * Sinh nhận xét cho NHIỀU học sinh (luồng upload hàng loạt) - gọi engine tuần tự (KHÔNG song
 * song) để tránh dồn dập vượt hạn mức key pool trong 1 lượt, đúng tinh thần "priority=generate"
 * (luồng bắt buộc phải chạy) của geminiKeyPool.js. Lỗi ở 1 học sinh KHÔNG làm hỏng cả danh sách
 * - trả về kèm lỗi riêng cho học sinh đó để giáo viên biết cần tạo lại thủ công.
 *
 * ⚠️ SỬA LỖI phát hiện khi test thực tế (upload Excel 2 học sinh): mỗi học sinh trước đây có thể
 * tốn tới `(maxRetries+1) × số key trong pool` lượt gọi khi Google đang quá tải diện rộng (VD
 * 3 × 7 = 21 lượt/học sinh) - dồn dập trong vài giây đủ để "biến" quá tải tạm thời thành lỗi hết
 * hạn mức THẬT trên nhiều key, ảnh hưởng lây sang cả các tính năng khác dùng chung pool key. Đã
 * giảm 2 lớp:
 *  (1) Ở geminiKeyPool.js: giới hạn cứng chỉ thử tối đa vài key khi lỗi là quá tải (503), không
 *      cố thử hết cả pool nữa (xem MAX_KEY_ATTEMPTS_ON_OVERLOAD).
 *  (2) Ở đây: hàng loạt dùng `maxRetries=1` (thay vì mặc định 2) - đã đủ để chịu lỗi JSON hỏng
 *      thoáng qua, không cần thử tới 3 lần cho mỗi học sinh khi làm hàng loạt; đồng thời CHỜ 1
 *      khoảng ngắn GIỮA CÁC HỌC SINH (không chỉ giữa các lần thử lại) để dàn đều tải, tránh dồn
 *      request theo cụm gây chạm giới hạn requests-per-minute của Google.
 * @param students [{ hoTen, lop, previousComment, ghiChuPhamChat, ghiChuNangLuc, monHocList, nhanXetChungTho }]
 */
export async function generateBulkReportComments({ cap, doDai, students }) {
  const results = [];
  let consecutiveOverloaded = 0;

  for (let idx = 0; idx < students.length; idx++) {
    const student = students[idx];

    // Dãn cách nhẹ giữa các học sinh (trừ học sinh đầu tiên) - tránh dồn request thành cụm.
    if (idx > 0) {
      await sleep(600);
    }

    // ⚠️ Nếu 2 học sinh liên tiếp gần nhất đều báo "quá tải" thì rất có thể Google đang nghẽn
    // diện rộng ngay lúc này - dừng SỚM cho các học sinh còn lại thay vì tiếp tục dội thêm
    // request chắc chắn sẽ thất bại, để dành quota cho lần thử lại sau của giáo viên.
    if (consecutiveOverloaded >= 2) {
      results.push({
        hoTen: student.hoTen,
        lop: student.lop,
        comment: null,
        error: "Máy chủ AI đang quá tải liên tục, đã dừng sớm để tránh lãng phí lượt gọi. Vui lòng thử lại sau ít phút.",
      });
      continue;
    }

    try {
      const { comment, quotaExhausted, serverOverloaded } = await generateReportCommentContent({
        cap,
        doDai,
        hoTen: student.hoTen,
        lop: student.lop,
        ghiChuPhamChat: student.ghiChuPhamChat,
        ghiChuNangLuc: student.ghiChuNangLuc,
        monHocList: student.monHocList,
        nhanXetChungTho: student.nhanXetChungTho,
        previousComment: student.previousComment || null,
        maxRetries: 1,
      });

      if (quotaExhausted || serverOverloaded) {
        consecutiveOverloaded = serverOverloaded ? consecutiveOverloaded + 1 : 0;
        results.push({
          hoTen: student.hoTen,
          lop: student.lop,
          comment: null,
          error: quotaExhausted
            ? "Đã hết hạn mức gọi AI hôm nay, vui lòng thử lại sau."
            : "Máy chủ AI đang quá tải, vui lòng thử lại sau ít phút.",
        });
        continue;
      }

      consecutiveOverloaded = 0;
      results.push({ hoTen: student.hoTen, lop: student.lop, comment, error: null });
    } catch (err) {
      consecutiveOverloaded = 0;
      results.push({
        hoTen: student.hoTen,
        lop: student.lop,
        comment: null,
        error: err.message || "Đã có lỗi xảy ra khi tạo nhận xét cho học sinh này.",
      });
    }
  }
  return results;
}
