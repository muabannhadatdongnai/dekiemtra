/**
 * latexUtils.js
 * Tách một chuỗi nội dung câu hỏi (có thể chứa LaTeX) thành các đoạn:
 *   { type: "text", content: string }
 *   { type: "math", content: string, display: boolean }
 * Hỗ trợ cú pháp: $$...$$ (display / khối) và $...$ (inline).
 * Dùng chung cho A4LivePreview (render bằng KaTeX) và exportService (render bằng OMML trong Word).
 */
export function parseLatexSegments(text = "") {
  const segments = [];
  // $$...$$ trước (display), sau đó $...$ (inline), không khớp \$ đã escape
  const regex = /\$\$([^$]+?)\$\$|\$([^$]+?)\$/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined) {
      segments.push({ type: "math", content: match[1].trim(), display: true });
    } else {
      segments.push({ type: "math", content: match[2].trim(), display: false });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return segments.length ? segments : [{ type: "text", content: text }];
}
