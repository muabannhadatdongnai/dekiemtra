/**
 * xmlEscapeUtils.js
 * ⚠️ TÁCH RIÊNG khỏi exportService.js CÓ CHỦ ĐÍCH: đây là đoạn logic đã gây lỗi WORD HỎNG FILE
 * 2 LẦN LIÊN TIẾP (xem PROJECT_SUMMARY.md mục 5) - lần đầu do quên escape lại XML, lần hai do
 * regex khớp NHẦM thẻ `<m:type .../>` với `<m:t>`. Vì đây là logic nhỏ, thuần (không phụ
 * thuộc "docx"/"temml"/"mathml2omml"), tách ra module riêng giúp:
 *   1. Test được BẰNG NODE THUẦN, không cần cài bất kỳ package nào (chạy được cả khi
 *      `node_modules` chưa có, hoặc trong CI tối giản) - xem test/xmlEscapeUtils.test.js.
 *   2. Không ai vô tình sửa lại đúng chỗ này khi sửa các phần khác của exportService.js.
 *
 * Sửa hàm này = BẮT BUỘC chạy `npm test` với CẢ 2 trường hợp cùng lúc (phân số LẪN bất đẳng
 * thức) trước khi coi là xong - đây chính xác là kịch bản đã lọt bug trước đây.
 */

/**
 * Thư viện `mathml2omml` giải mã ĐÚNG các entity MathML như &lt;/&gt;/&amp; thành ký tự thật
 * (<, >, &) nhưng lại QUÊN escape lại khi xuất ra chuỗi XML OMML - khiến công thức chứa bất
 * đẳng thức (<, >) hoặc dấu & tạo ra XML KHÔNG HỢP LỆ, phá hỏng toàn bộ file .docx.
 *
 * Hàm này escape lại ĐÚNG các ký tự đặc biệt, nhưng CHỈ trong phần nội dung text bên trong
 * thẻ <m:t>...</m:t> - không đụng đến cấu trúc thẻ XML khác.
 *
 * @param {string} ommlString - chuỗi XML OMML thô (đầu ra của mathml2omml)
 * @returns {string} chuỗi XML OMML đã escape lại đúng, an toàn để chèn vào document.xml
 */
export function escapeMathTextNodes(ommlString) {
  // ⚠️ QUAN TRỌNG: "(?:\s[^>]*)?" đảm bảo chỉ khớp ĐÚNG thẻ <m:t> (text node), KHÔNG khớp
  // nhầm các thẻ khác có tên bắt đầu bằng "m:t" như <m:type .../> (dấu phân số) - lỗi cũ khiến
  // <m:type m:val="bar"/> bị coi nhầm là thẻ mở <m:t...>, làm hỏng toàn bộ cấu trúc XML phía
  // sau. Nếu regex này bị sửa lại mà thiếu ranh giới rõ ràng sau "m:t", bug sẽ tái phát.
  return ommlString.replace(/(<m:t(?:\s[^>]*)?>)([\s\S]*?)(<\/m:t>)/g, (match, openTag, content, closeTag) => {
    const escaped = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return openTag + escaped + closeTag;
  });
}
