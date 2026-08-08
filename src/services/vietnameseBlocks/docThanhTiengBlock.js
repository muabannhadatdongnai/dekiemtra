/**
 * docThanhTiengBlock.js
 * Khối "Đọc thành tiếng" - TĨNH, KHÔNG cần AI (giáo viên tự bốc thăm cho học sinh đọc trực tiếp
 * khi kiểm tra, không có gì để "sinh" bằng AI). File này chỉ định dạng lại input giáo viên gõ tay
 * thành 1 object hiển thị nhất quán với các khối khác - giữ interface `generate({grade, input})`
 * giống hệt khối có AI để orchestrator không cần biết khối nào có AI, khối nào không.
 *
 * TỰ CHỨA - không đụng docThamBlock.js/chinhTaBlock.js/tapLamVanBlock.js.
 */

/**
 * generateDocThanhTiengBlock({ grade, input: { tenBai, soCauHoiPhu } }) -> { tenBai, huongDan, soCauHoiPhu }
 * Không có gì để validate nghiêm ngặt (input tự do do giáo viên gõ) - chỉ đảm bảo có tên bài,
 * nếu thiếu thì báo lỗi rõ ràng thay vì xuất ra 1 khối trống vô nghĩa.
 */
export async function generateDocThanhTiengBlock({ input = {} }) {
  const { tenBai = "" } = input;

  if (!tenBai.trim()) {
    throw new Error('Chưa nhập "Tên bài tập đọc" cho khối Đọc thành tiếng.');
  }

  return {
    tenBai: tenBai.trim(),
    huongDan:
      "Học sinh bốc thăm và đọc thành tiếng một đoạn khoảng 90-100 tiếng trong bài, sau đó trả lời " +
      "1 câu hỏi ngắn về nội dung đoạn vừa đọc do giáo viên nêu trực tiếp (không in sẵn trong đề).",
  };
}
