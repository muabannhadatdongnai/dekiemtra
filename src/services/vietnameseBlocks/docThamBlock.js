import { generateContentWithFailover } from "../geminiKeyPool";

/**
 * docThamBlock.js
 * Khối "Đọc thầm" trong mode "📖 Đề Tiếng Việt Tiểu học" - TỰ CHỨA toàn bộ logic của chính nó
 * (prompt, gọi AI, parse/validate JSON trả về), đúng nguyên tắc "mỗi khối 1 file độc lập" đã chốt.
 * Sửa lỗi khối này (VD: câu hỏi không bám sát đoạn văn) chỉ cần sửa đúng file này - không đụng
 * chinhTaBlock.js/tapLamVanBlock.js sau này.
 *
 * KHÔNG dùng chung buildExamPrompt()/buildLessonPlanPrompt() của 2 luồng kia dù cùng gọi
 * generateContentWithFailover() - schema JSON đầu ra hoàn toàn khác (ngữ liệu + câu hỏi đọc hiểu,
 * không phải câu hỏi thi rời rạc hay giáo án).
 */

const DOC_THAM_MODEL = "gemini-3.5-flash"; // đồng bộ FREE_TIER_MODEL/LESSON_PLAN_MODEL

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildDocThamReferenceBlock(referenceContext) {
  return referenceContext
    ? `\n\nTÀI LIỆU THAM KHẢO (trích từ SGK, chỉ để LẤY CẢM HỨNG về từ vựng/chủ đề - TUYỆT ĐỐI KHÔNG
chép lại nguyên văn bất kỳ câu/đoạn nào từ tài liệu này, vẫn phải TỰ VIẾT MỚI HOÀN TOÀN):\n\n${referenceContext}`
    : "";
}

export function buildDocThamPrompt({ grade, chuDe, soCauHoi, referenceContext = null }) {
  const count = Math.min(10, Math.max(7, Number(soCauHoi) || 8));

  return `
BẠN LÀ MỘT GIÁO VIÊN TIẾNG VIỆT TIỂU HỌC GIÀU KINH NGHIỆM, CHUYÊN RA ĐỀ PHẦN "ĐỌC THẦM".

NHIỆM VỤ: Tự viết MỚI 1 đoạn văn xuôi hoặc 1 bài thơ ngắn (ngữ liệu Đọc thầm) phù hợp học sinh
Lớp ${grade}, sau đó soạn ĐÚNG ${count} câu hỏi đọc hiểu BÁM SÁT ngữ liệu vừa viết.

${
  chuDe && chuDe.trim()
    ? `CHỦ ĐỀ/NỘI DUNG GIÁO VIÊN YÊU CẦU: "${chuDe.trim()}"`
    : `Tự chọn 1 chủ đề gần gũi, phù hợp lứa tuổi Tiểu học (gia đình, trường lớp, thiên nhiên, quê
hương, bạn bè, lòng nhân ái...).`
}

QUY TẮC BẮT BUỘC:
- Ngữ liệu dài khoảng 120-220 chữ (Lớp 1-2 lấy mức ngắn hơn trong khoảng này, Lớp 4-5 lấy mức dài
  hơn), trong sáng, phù hợp thuần phong mỹ tục Việt Nam - TỰ VIẾT MỚI HOÀN TOÀN, KHÔNG chép lại
  nguyên văn bất kỳ tác phẩm đã xuất bản nào (tránh vi phạm bản quyền).
- ĐÚNG ${count} câu hỏi, trải đều 3 mức độ: nhận biết (nhớ chi tiết có trong bài), thông hiểu (hiểu
  ý nghĩa/tình cảm/thông điệp), vận dụng (liên hệ bản thân, rút ra bài học) - không dồn hết câu hỏi
  vào 1 mức độ duy nhất.
- Đa số câu hỏi ở dạng trắc nghiệm 4 lựa chọn (A/B/C/D, mỗi lựa chọn bắt đầu đúng bằng ký tự đó);
  có thể xen 1-2 câu tự luận ngắn ở mức vận dụng (không cần lựa chọn, chỉ cần gợi ý đáp án).
- Câu trắc nghiệm: "dapAn" CHỈ ghi đúng 1 chữ cái hoa (A/B/C/D). Câu tự luận: "loai" = "tu_luan",
  "luaChon" = mảng rỗng [], "dapAn" là gợi ý đáp án ngắn gọn (không cần đúng từng chữ với bài làm
  học sinh, chỉ là hướng dẫn chấm cho giáo viên).
- Đầu ra CHỈ trả về JSON hợp lệ theo đúng schema bên dưới, không kèm giải thích, không markdown
  code fence, không thêm trường nào khác ngoài schema.${buildDocThamReferenceBlock(referenceContext)}

Hãy trả về JSON theo đúng schema sau:
{
  "nguLieu": { "tieuDe": "...", "theLoai": "van_xuoi" hoặc "tho", "noiDung": "..." },
  "cauHoi": [
    { "cauHoi": "...", "loai": "trac_nghiem", "luaChon": ["A. ...", "B. ...", "C. ...", "D. ..."], "dapAn": "A" }
  ]
}
`.trim();
}

/**
 * Validate tối thiểu để đảm bảo giáo viên không nhận về dữ liệu rỗng/thiếu, KHÔNG validate quá
 * chặt (VD không ép đúng số câu hỏi tuyệt đối) - AI đôi khi lệch 1 câu so với yêu cầu, chặn cứng
 * sẽ khiến giáo viên mất lượt tạo chỉ vì lệch nhẹ không ảnh hưởng chất lượng đề.
 */
function isValidDocThamResult(parsed) {
  return (
    parsed &&
    parsed.nguLieu &&
    typeof parsed.nguLieu.noiDung === "string" &&
    parsed.nguLieu.noiDung.trim().length > 0 &&
    Array.isArray(parsed.cauHoi) &&
    parsed.cauHoi.length > 0
  );
}

/**
 * generateDocThamBlock({ grade, input: { chuDe, soCauHoi, referenceContext } }) -> { nguLieu, cauHoi }
 * `referenceContext` (PHIÊN 30, tuỳ chọn) - đoạn markdown chương SGK Tiếng Việt thật do giáo viên
 * chọn ở VietnameseExamForm.jsx (liên kết qua sgkVolume/sgkChapterId, resolve ở
 * vietnameseExamOrchestrator.js) - chỉ dùng làm CẢM HỨNG từ vựng/chủ đề cho AI tự viết ngữ liệu
 * MỚI, KHÔNG dùng để chép nguyên văn (xem buildDocThamReferenceBlock() ở trên) - giữ đúng nguyên
 * tắc chống vi phạm bản quyền đã áp dụng cho referenceContext bên worksheetGenerator.js.
 * Ném lỗi có gắn cờ `quotaExhausted`/`serverOverloaded` để orchestrator phân biệt được nguyên
 * nhân (giống geminiEngine.js/lessonPlanEngine.js) - KHÔNG để lọt lỗi JSON thô lên giao diện.
 */
export async function generateDocThamBlock({ grade, input = {} }) {
  const { chuDe = "", soCauHoi = 8, referenceContext = null } = input;
  const maxRetries = 2;
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const prompt = buildDocThamPrompt({ grade, chuDe, soCauHoi, referenceContext });
    try {
      const result = await generateContentWithFailover({
        model: DOC_THAM_MODEL,
        contents: prompt,
        config: { temperature: 0.7, responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(result.text);
      if (!isValidDocThamResult(parsed)) {
        throw new Error("Thiếu ngữ liệu hoặc câu hỏi trong JSON trả về.");
      }
      return parsed;
    } catch (err) {
      lastError = err;
      if (err.allKeysExhausted) {
        const quotaError = new Error(`Hết hạn mức Gemini cho khối "Đọc thầm" (${err.message}).`);
        quotaError.quotaExhausted = true;
        throw quotaError;
      }
      if (err.allKeysOverloaded) {
        if (attempt === maxRetries) {
          const overloadError = new Error(
            `Máy chủ Gemini đang quá tải tạm thời khi tạo khối "Đọc thầm" (${err.message}).`
          );
          overloadError.serverOverloaded = true;
          throw overloadError;
        }
        await sleep(1500 * (attempt + 1));
      }
      attempt++;
    }
  }

  throw new Error(
    `Không thể tạo khối "Đọc thầm" sau ${maxRetries + 1} lần thử. ` +
      `(Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}
