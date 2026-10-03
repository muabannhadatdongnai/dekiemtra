/**
 * vocabGrammarLayout.js (Phiên 51c - tab "Soạn từ vựng")
 * Biến các nhóm ngữ pháp bóc từ Markdown ({ title, rows:[{left,right}] }) thành các BẢNG 3 CỘT rõ ràng như mẫu
 * giáo viên (Hoan gửi): tiêu đề chủ điểm ("1. Thì Hiện tại đơn (The Present Simple)") → tên bảng con ("Cấu trúc")
 * → bảng [Nội dung | Giải thích | Example]. Hàm thuần (không đụng mạng/DOM) để test được.
 *
 *   table = { id, heading, title, headers: [h1, h2, h3], rows: [{ id, left, right, example }] }
 *   - heading: tiêu đề chủ điểm (chỉ bảng ĐẦU của mỗi chủ điểm có; số thứ tự 1., 2. gắn lúc hiển thị)
 *   - title:   tên bảng con (VD "Cấu trúc"), có thể rỗng
 */

// id riêng (không import từ vocabResult.js để tránh vòng phụ thuộc: vocabResult.js gọi hàm của file này)
let idCounter = 0;
function nextVocabId(prefix) {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-L${idCounter}`;
}

export const HEADERS_PLAIN = ["Content", "Explanation", "Example"];
export const HEADERS_SENTENCE_TYPE = ["Sentence type", "Structure", "Example"];

const EX_LABEL = /^Ex(?:\s*\d+)?\s*:\s*/i;
const SENTENCE_TYPE_LEFT = /(khẳng định|phủ định|nghi vấn|câu hỏi|yes\s*\/\s*no|wh-|positive|negative|question|affirmative)/i;
const GENERIC_TOPIC = /^(?:ngữ pháp|grammar|language focus)(?:\s*[&/-]\s*[^()]*)?(?:\s*\([^)]*\))?$/i;

/** "A. Thì Hiện tại đơn (The Present Simple)" → "Thì Hiện tại đơn (The Present Simple)"; nhãn chung "Ngữ pháp" → "". */
export function cleanTopicTitle(title) {
  const t = String(title ?? "").trim().replace(/^(?:[A-Z]|[IVX]+|\d+)[.)]\s+/, "").replace(/^\d+\.\s*/, "").trim();
  return GENERIC_TOPIC.test(t) ? "" : t;
}

function splitSegments(text) {
  return String(text ?? "").split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
}

/** Tách ví dụ nằm trong ngoặc "(Ex: We always look smart)" ra khỏi phần giải thích. */
export function extractInlineExamples(text) {
  const examples = [];
  const rest = String(text ?? "").replace(/\s*\(\s*Ex(?:\s*\d+)?\s*:\s*([^)]*)\)/gi, (m, e) => {
    if (e.trim()) examples.push(e.trim());
    return "";
  });
  return { text: rest.replace(/\s+/g, " ").trim(), examples };
}

function isLabelSegment(seg) {
  return /^[^:|]{1,40}:$/.test(seg) && !EX_LABEL.test(seg);
}

function newRow(left = "", right = "", example = "") {
  return { id: nextVocabId("g"), left, right, example };
}

/** 1 dòng {left,right} thô → các dòng 3 cột. Trả { rows, structured } (structured = dòng chứa Khẳng định/Phủ định/...). */
function splitRow(row) {
  const segs = splitSegments(row.right);
  const labelCount = segs.filter(isLabelSegment).length;

  if (labelCount >= 2) {
    const out = [];
    let cur = null;
    for (const seg of segs) {
      if (isLabelSegment(seg)) {
        if (cur) out.push(cur);
        cur = newRow(seg.replace(/:$/, "").trim(), "", "");
      } else if (EX_LABEL.test(seg)) {
        if (!cur) cur = newRow("", "", "");
        cur.example = cur.example ? `${cur.example}\n${seg.replace(EX_LABEL, "")}` : seg.replace(EX_LABEL, "");
      } else {
        if (!cur) cur = newRow("", "", "");
        cur.right = cur.right ? `${cur.right}\n${seg}` : seg;
      }
    }
    if (cur) out.push(cur);
    return { rows: out, structured: true };
  }

  const explanation = [];
  const examples = [];
  for (const seg of segs) {
    if (EX_LABEL.test(seg)) examples.push(seg.replace(EX_LABEL, ""));
    else {
      const { text, examples: inline } = extractInlineExamples(seg);
      if (text) explanation.push(text);
      examples.push(...inline);
    }
  }
  let left = row.left;
  // Dòng chỉ có 1 câu dài ở cột trái (không có vế phải) là câu giải thích, không phải nhãn → chuyển sang cột Giải thích.
  if (!explanation.length && !examples.length && left.split(/\s+/).length >= 6) {
    explanation.push(left);
    left = "";
  }
  return { rows: [newRow(left, explanation.join("\n"), examples.join("\n"))], structured: false };
}

function headersFor(rows) {
  if (!rows.length) return [...HEADERS_PLAIN];
  const sentenceTypeRows = rows.filter((r) => SENTENCE_TYPE_LEFT.test(r.left)).length;
  return sentenceTypeRows * 2 >= rows.length ? [...HEADERS_SENTENCE_TYPE] : [...HEADERS_PLAIN];
}

function makeTable({ heading = "", title = "", rows, structured = false }) {
  return {
    id: nextVocabId("t"),
    heading,
    title,
    headers: structured ? [...HEADERS_SENTENCE_TYPE] : headersFor(rows),
    rows,
  };
}

/** Nhóm ngữ pháp (1 chủ điểm) → danh sách bảng. Dòng có Khẳng định/Phủ định/Nghi vấn thành bảng con riêng. */
export function buildGrammarTables(group) {
  const tables = [];
  let heading = cleanTopicTitle(group?.title);
  let plain = [];

  const flushPlain = () => {
    if (!plain.length) return;
    tables.push(makeTable({ heading, rows: plain }));
    heading = "";
    plain = [];
  };

  for (const raw of group?.rows || []) {
    const { rows, structured } = splitRow(raw);
    if (structured) {
      flushPlain();
      tables.push(makeTable({ heading, title: raw.left, rows, structured: true }));
      heading = "";
    } else {
      plain.push(...rows);
    }
  }
  flushPlain();

  // Chủ điểm chỉ có tiêu đề mà không có bảng nào (hiếm) → không in gì.
  return tables;
}

export function buildBlankGrammarTable() {
  return makeTable({ rows: [newRow()] });
}
