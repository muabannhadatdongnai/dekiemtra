/**
 * chinhTaBlock.js
 * Khối "Chính tả" - TĨNH, KHÔNG cần AI. Cố ý KHÔNG dùng AI để "viết lại" đoạn chính tả: nội dung
 * chính tả phải trích ĐÚNG NGUYÊN VĂN 1 đoạn có sẵn trong SGK (đây là mục đích của bài chính tả -
 * kiểm tra nghe/nhớ đúng chữ), nên giáo viên PHẢI tự gõ/dán đoạn văn thật từ SGK vào, hệ thống chỉ
 * định dạng lại để hiển thị/xuất Word - không tự sinh nội dung để tránh cả 2 rủi ro: (1) AI bịa ra
 * đoạn văn không khớp SGK thật khiến bài chính tả sai mục đích, (2) AI tái tạo lại văn bản có bản
 * quyền của NXB Giáo dục.
 *
 * TỰ CHỨA - không đụng docThamBlock.js/docThanhTiengBlock.js/tapLamVanBlock.js.
 */

export async function generateChinhTaBlock({ input = {} }) {
  const { tenBai = "", noiDung = "", kieuBai = "nghe_viet" } = input;

  if (!tenBai.trim()) {
    throw new Error('Chưa nhập "Tên bài/đoạn chính tả" cho khối Chính tả.');
  }
  if (!noiDung.trim()) {
    throw new Error('Chưa nhập "Nội dung đoạn chính tả" cho khối Chính tả (trích nguyên văn từ SGK).');
  }

  return {
    tenBai: tenBai.trim(),
    noiDung: noiDung.trim(),
    kieuBai, // "nghe_viet" | "nho_viet"
  };
}
