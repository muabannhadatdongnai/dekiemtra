/**
 * wordSchemaAssertions.js
 * Tiện ích test DÙNG CHUNG để phát hiện lớp lỗi "Word experienced an error trying to open the
 * file" gây ra bởi cấu trúc XML VI PHẠM SCHEMA OOXML nhưng vẫn "well-formed" (thẻ mở/đóng khớp
 * nhau đầy đủ) - ví dụ điển hình: một `<w:p>` (paragraph) chứa NGUYÊN 1 `<w:p>` khác lồng bên
 * trong (`<w:p><w:p>...</w:p></w:p>`), điều mà CT_P trong lược đồ WordprocessingML KHÔNG cho phép.
 *
 * BỐI CẢNH (Phiên 37): file Word xuất ra tab Soạn Giáo Án tiếng Anh (bài dạy nhiều tiết, ranh
 * giới "Hết Tiết" trong bảng 2 cột) bị lỗi kiểu này - `cell()` (foreignLanguageDocBuilder.js) LUÔN
 * tự bọc `opts.children` trong 1 `Paragraph`, nhưng `periodBoundaryTableRowEn()`
 * (englishLessonPlanExportService.js) lại truyền THẲNG một `new Paragraph({...})` làm
 * `opts.children` thay vì mảng TextRun -> sinh `<w:p><w:p>...`.
 *
 * ⚠️ Test cũ (`npm test`) chỉ giải nén .docx bằng JSZip rồi kiểm tra `xml.includes(...)` chuỗi con,
 * KHÔNG kiểm tra cấu trúc lồng nhau -> hoàn toàn bỏ lọt lỗi này (kể cả `ElementTree`/`python-docx`/
 * LibreOffice - dùng ở `test:word-compat` - cũng khoan dung với lỗi này, chỉ MS Word thật mới từ
 * chối mở file). Hàm ở đây lấp đúng khoảng trống đó bằng cách tự dò cây thẻ XML (không cần schema
 * XSD đầy đủ, không cần mạng/Word thật) và báo lỗi CHÍNH XÁC phần tử nào bị lồng sai.
 */

// Các phần tử KHÔNG BAO GIỜ được xuất hiện là hậu duệ (trực tiếp hoặc gián tiếp, trước khi phần tử
// mở nó tự đóng) của MỘT phần tử "w:p" khác - đúng nội dung cho phép của CT_P (paragraph) trong
// lược đồ WordprocessingML: paragraph không được chứa paragraph con, và không được chứa trực tiếp
// bảng (w:tbl không nằm trong danh sách con hợp lệ của CT_P).
const FORBIDDEN_INSIDE_PARAGRAPH = new Set(["w:p", "w:tbl"]);

/**
 * Trả về mảng lỗi (rỗng nếu hợp lệ) mô tả các vi phạm lồng thẻ "w:p chứa w:p/w:tbl" tìm thấy
 * trong 1 chuỗi document.xml (hoặc header/footer/footnotes.xml...) thật.
 */
export function findInvalidParagraphNesting(xml) {
  const errors = [];
  // Bắt MỌI thẻ w:xxx - phân biệt thẻ ĐÓNG (</w:xxx>) và thẻ TỰ ĐÓNG (<w:xxx .../>) để không đẩy
  // nhầm vào ngăn xếp (self-closing không cần theo dõi độ lồng).
  const tagRe = /<(\/)?([a-zA-Z][\w.]*:[a-zA-Z][\w.]*)\b([^>]*?)(\/)?>/g;
  const stack = []; // mỗi phần tử: { name, openIndex }
  let match;
  while ((match = tagRe.exec(xml)) !== null) {
    const [, isClosing, tagName, , isSelfClosing] = match;
    if (isSelfClosing) continue; // <w:br/>, <w:tab/>... không có nội dung con, bỏ qua an toàn
    if (isClosing) {
      // Đóng đúng thẻ gần nhất cùng tên trên đỉnh ngăn xếp (XML well-formed nên luôn khớp đỉnh).
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name === tagName) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    // Thẻ MỞ (không tự đóng): nếu là w:p/w:tbl và đang có SẴN 1 "w:p" chưa đóng trong ngăn xếp
    // (ở BẤT KỲ độ sâu nào phía trên) -> vi phạm CT_P.
    if (FORBIDDEN_INSIDE_PARAGRAPH.has(tagName)) {
      const ancestorParagraphDepth = stack.findIndex((f) => f.name === "w:p");
      if (ancestorParagraphDepth !== -1) {
        const context = xml.slice(Math.max(0, match.index - 60), match.index + 80);
        errors.push(
          `Phần tử "${tagName}" bị lồng bên trong "w:p" chưa đóng (vi phạm schema CT_P - paragraph ` +
            `không được chứa paragraph/bảng con) tại vị trí ~${match.index}. Ngữ cảnh: ...${context}...`
        );
      }
    }
    stack.push({ name: tagName, openIndex: match.index });
  }
  return errors;
}

/**
 * Assert tiện dụng - ném lỗi rõ ràng (liệt kê hết vi phạm tìm được) nếu XML có lồng thẻ sai.
 * Dùng trong test: `assertValidParagraphNesting(xml)` ngay sau khi đọc `word/document.xml` từ
 * JSZip, cho MỌI file .docx được build ra trong test - lớp bảo vệ chung, không phụ thuộc tính
 * năng cụ thể nào.
 */
export function assertValidParagraphNesting(xml, label = "document.xml") {
  const errors = findInvalidParagraphNesting(xml);
  if (errors.length) {
    throw new Error(
      `[${label}] Phát hiện ${errors.length} vi phạm lồng thẻ OOXML sẽ khiến MS Word từ chối mở ` +
        `file ("Word experienced an error trying to open the file") dù XML vẫn "well-formed":\n` +
        errors.join("\n")
    );
  }
}
