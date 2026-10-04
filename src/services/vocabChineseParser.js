/**
 * vocabChineseParser.js (Phiên 52 - tab "Soạn từ vựng", Tiếng Trung)
 * Bộ đọc Markdown SGK Tiếng Trung (Kết nối tri thức, Lớp 6-12) → nhóm TỪ VỰNG + NGỮ PHÁP cho form chọn.
 * ĐỘC LẬP với vocabEnglishParser.js (Isolation over DRY): cột khác (Chữ Hán | Pinyin | Âm Hán Việt | ...),
 * 1 file chương = 1 Chủ đề gồm NHIỀU Bài nên mỗi nhóm mang tên Bài ("Bài 1: ... - Từ vựng").
 *
 * Kết quả: {
 *   chuong: "CHỦ ĐỀ 1: CỘNG ĐỒNG CỦA CHÚNG TA (...)",
 *   vocabGroups:   [{ id, title, bai, page:"", words: [{ word, pinyin, hanViet, type, meaning, example? }] }],
 *   grammarGroups: [{ id, title, bai, page:"", rows: [{ left, right, example }] }],   // 3 cột sẵn, KHÔNG qua vocabGrammarLayout
 * }
 * Quy tắc: từ/nghĩa/pinyin lấy NGUYÊN VĂN từ Markdown, ô nào Markdown không có thì để TRỐNG (AI điền sau, tô vàng).
 * Cấu trúc lạ/không đọc được → nhóm rỗng, KHÔNG đoán.
 */

const VOCAB_HEADING = /(từ vựng|từ mới|生词|bảng từ|chuyên danh|专名|专有名词)/i;
const GRAMMAR_HEADING = /(ngữ pháp|语言点|语法|điểm ngôn ngữ|ngữ dụng|chú thích)/i;
// Mục KHÔNG phải từ vựng/ngữ pháp - chặn để bài tập/bài đọc không lọt vào nhóm
const STOP_HEADING = /(luyện tập|练习|bài khóa|课文|bài đọc|hội thoại|đọc thêm.*(?:bài|văn)|mục tiêu|trọng tâm học|tự trắc|ôn tập|复习)/i;
const BAI_HEADING = /^(?:bài|课|第)/i;

function clean(text) {
  return String(text ?? "")
    .replace(/\\\*/g, "*")
    .replace(/\*\*|__/g, "")
    .replace(/(^|[^\w*])\*(?!\s)([^*]+?)\*(?=$|[^\w*])/g, "$1$2")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const HAS_CJK = /[㐀-鿿]/;

/** "BÀI 1: TRƯỚC TÒA NHÀ (第一课: ...)" → "Bài 1: Trước tòa nhà (第一课: ...)" giữ nguyên chữ, chỉ bỏ ký hiệu markdown. */
function headingText(text) {
  return clean(text).replace(/^\s*(?:[IVX]+|\d+|[A-Za-z]|[①-⑩])[.)]\s*/, "").trim();
}

/** "BÀI 1: TÔI THÍCH XEM VIDEO (我喜欢...)" → "Bài 1" (tên nhóm hiển thị gọn; tên đầy đủ nằm ở group.bai). */
export function shortBai(bai) {
  const m = /^(?:bài|课)\s*(\d+)/i.exec(String(bai ?? "").trim());
  return m ? `Bài ${m[1]}` : String(bai ?? "").replace(/\s*[（(][^)）]*[\u3400-\u9fff][^)）]*[)）]\s*$/, "").trim();
}

/** Tên bài gọn cho ô "Bài học" ở phần đầu bản soạn: bỏ phần chú thích chữ Hán/pinyin ở cuối. */
export function baiTitleForHeader(bai) {
  return String(bai ?? "").replace(/\s*[（(][^)）]*[\u3400-\u9fff][^)）]*[)）]\s*$/, "").trim();
}

// ---------- Từ loại: chuẩn hoá viết tắt trong SGK về tên đầy đủ (giữ nguyên nếu lạ) ----------
const TYPE_MAP = {
  danh: "Danh từ", n: "Danh từ", "danh từ": "Danh từ",
  "động": "Động từ", v: "Động từ", "động từ": "Động từ",
  tính: "Tính từ", adj: "Tính từ", "tính từ": "Tính từ",
  phó: "Phó từ", adv: "Phó từ", "phó từ": "Phó từ",
  lượng: "Lượng từ", "lượng từ": "Lượng từ", số: "Số từ", "số từ": "Số từ",
  đại: "Đại từ", "đại từ": "Đại từ", giới: "Giới từ", prep: "Giới từ", "giới từ": "Giới từ",
  liên: "Liên từ", conj: "Liên từ", "liên từ": "Liên từ", trợ: "Trợ từ", "trợ từ": "Trợ từ",
  thán: "Thán từ", "thán từ": "Thán từ",
  "thành ngữ": "Thành ngữ", "cụm từ": "Cụm từ", "phương vị từ": "Phương vị từ", "động từ năng nguyện": "Động từ năng nguyện",
  "tên riêng": "Tên riêng", "chuyên danh": "Tên riêng",
};

export function normalizeChineseType(raw) {
  const t = clean(raw).replace(/[.。]$/, "");
  if (!t) return "";
  const parts = t.split(/\s*[/,;、]\s*/).filter(Boolean);
  return parts.map((p) => TYPE_MAP[p.toLowerCase()] || p).join("/");
}

// ---------- Bảng từ vựng ----------
function splitRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => clean(c));
}

function mapHeader(cells) {
  const map = {};
  cells.forEach((c, i) => {
    const h = c.toLowerCase();
    if (/(chữ hán|hán tự|汉字)/.test(h)) map.word = i;
    else if (/(hán việt)/.test(h)) map.hanViet = i;
    else if (/(phiên âm|pinyin)/.test(h)) map.pinyin = i;
    else if (/(từ loại|phân loại)/.test(h)) map.type = i;
    else if (/(nghĩa)/.test(h)) map.meaning = i;
    else if (/(ví dụ|ngữ cảnh|cụm từ)/.test(h)) map.example = i;
  });
  if (map.word === undefined || map.meaning === undefined) return null;
  Object.defineProperty(map, "_len", { value: cells.length, enumerable: false });
  return map;
}

function rowToWord(rawCells, map) {
  // Dữ liệu SGK có dòng thiếu đúng 1 ô Pinyin (VD Lớp 11 chương 3 từ 适度): chèn ô Pinyin trống để các cột sau
  // không bị lệch (pinyin để TRỐNG cho AI điền, không nhét nhầm Âm Hán Việt vào cột Pinyin).
  const cells = [...rawCells];
  if (map.pinyin !== undefined && map._len && cells.length === map._len - 1) cells.splice(map.pinyin, 0, "");
  const get = (k) => (map[k] !== undefined ? clean(cells[map[k]] ?? "") : "");
  const word = get("word");
  if (!word || !HAS_CJK.test(word)) return null; // dòng phân nhóm "**Từ vựng đọc thêm**" hoặc dòng rác
  const w = { word, pinyin: get("pinyin"), hanViet: get("hanViet"), type: normalizeChineseType(get("type")), meaning: get("meaning") };
  const ex = get("example");
  if (ex) w.example = ex;
  return w;
}

// ---------- Từ vựng dạng gạch đầu dòng ----------
// "* **高山** (*gāoshān* - n): Núi cao (高山风景 - Phong cảnh núi cao)"  |  "* **Chuyên danh (专名):** 四川 (Sìchuān): Tứ Xuyên"
const BULLET_WORD = /^\s*(?:[-*+]|\d+[.)])\s+\**([㐀-鿿][^*(（:：]*?)\**\s*[（(]\s*\*?([^*)）]+?)\*?\s*(?:[-–—]\s*([^)）]+))?[)）]\s*[:：]\s*(.+)$/;

function parseBulletWord(line) {
  const m = BULLET_WORD.exec(line);
  if (!m) return null;
  const [, word, pinyin, abbr, rest] = m;
  if (/[㐀-鿿]/.test(pinyin)) return null;
  let meaning = clean(rest);
  let example = "";
  const ex = /^(.*?)\s*[（(]([^()（）]*[㐀-鿿][^()（）]*)[)）]\s*$/.exec(meaning);
  if (ex) { meaning = clean(ex[1]); example = clean(ex[2]); }
  return { word: clean(word), pinyin: clean(pinyin), hanViet: "", type: normalizeChineseType(abbr || ""), meaning, ...(example ? { example } : {}) };
}

/** "**Chuyên danh (专名):** 四川 (Sìchuān): Tứ Xuyên" - cả dòng là 1 từ sau nhãn đậm. */
function parseLabelledWord(line) {
  const m = /^\s*(?:[-*+])\s+\*\*[^*]*\*\*\s*(.+)$/.exec(line);
  if (!m) return null;
  return parseBulletWord(`* **${m[1].replace(/^\*\*/, "")}`.replace(/^\* \*\*([^\s(（]+)\s*[（(]/, "* **$1** ("));
}

function dedupeWords(words) {
  const seen = new Set();
  const out = [];
  for (const w of words) {
    const key = `${w.word}|${w.pinyin}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(w);
  }
  return out;
}

// ---------- Ngữ pháp ----------
const EXAMPLE_LABEL = /^(?:ví dụ|例句|例|ex)(?=$|[\s:：(])/i;
const ARROW_LINE = /^(?:\$\\rightarrow\$|→|->|=>|⇒)\s*/;

function stripMath(text) {
  return String(text ?? "").replace(/\$\\rightarrow\$/g, "→").replace(/\$\\?[a-z]*\$/gi, "").replace(/\$([^$]*)\$/g, "$1");
}

function tidyExample(lines) {
  return lines.map((l) => clean(stripMath(l))).filter(Boolean).join("\n");
}

/** Chuẩn hoá nhãn như "Cách dùng 1 (Bao hàm cả hai đối tượng):" → { label, rest }. */
function splitLabel(body) {
  const b = body.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, "");
  const m = /^\*\*([^*]+?)\*\*\s*(.*)$/.exec(b) || /^\*([^*]+?)\*\s*(.*)$/.exec(b);
  if (!m) return { label: "", rest: clean(stripMath(b)) };
  const label = clean(m[1]).replace(/[:：]\s*$/, "");
  // nhãn kết thúc bằng ":" hoặc là từ khoá quen thuộc → thật sự là nhãn; ngược lại (VD "**应该** nghĩa là...") thì giữ nguyên làm nội dung
  const restRaw = m[2].replace(/^[:：]\s*/, "");
  const isLabel = /[:：]\s*$/.test(m[1]) || /^[:：]/.test(m[2]) || /^(?:cách dùng|công thức|cấu trúc|ví dụ|ý nghĩa|so sánh|lưu ý|chú ý|mở rộng|thể |kết hợp)/i.test(label);
  if (!isLabel) return { label: "", rest: clean(stripMath(b)) };
  return { label, rest: clean(stripMath(restRaw)) };
}

/** Dòng nội dung của 1 chủ điểm ngữ pháp → rows [{ left, right, example }]. */
function buildRowsFromLines(lines) {
  const rows = [];
  let current = null; // hàng đang nhận nội dung
  let lastNonExample = null;
  let inExample = false;
  let exampleHost = null;
  let pendingExample = null; // mảng dòng của 1 ví dụ đang gom (Hán + pinyin + dịch)

  const flushExample = () => {
    if (pendingExample?.length) {
      const text = tidyExample(pendingExample);
      if (text) {
        const host = exampleHost || lastNonExample;
        if (host) host.example = host.example ? `${host.example}\n${text}` : text;
        else {
          const r = { left: "Ví dụ", right: "", example: text };
          rows.push(r);
          exampleHost = r;
        }
      }
    }
    pendingExample = null;
  };

  for (const raw of lines) {
    const indent = (/^(\s*)/.exec(raw)?.[1] || "").replace(/\t/g, "  ").length;
    const body = raw.trim();
    if (!body || body === "---") { continue; }
    const isBullet = /^(?:[-*+]|\d+[.)])\s+/.test(body);
    const text = body.replace(/^(?:[-*+]|\d+[.)])\s+/, "");
    const cleaned = clean(stripMath(text));
    if (!cleaned) continue;

    // Dòng tiếp của ví dụ: pinyin trong ngoặc/nghiêng hoặc mũi tên dịch nghĩa
    if (pendingExample && (!isBullet || indent >= 4) && (ARROW_LINE.test(cleaned) || /^[（(][^㐀-鿿]*[)）]$/.test(cleaned) || (!HAS_CJK.test(cleaned) && /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü\s,.!?'’:;-]+$/i.test(cleaned)))) {
      pendingExample.push(cleaned.replace(/^(?:pinyin|phiên âm)\s*:\s*/i, "").replace(/^(?:dịch nghĩa|dịch)\s*:\s*/i, "→ "));
      continue;
    }

    // Nhãn ví dụ: "*Ví dụ:*" (có thể kèm câu sau nhãn)
    const lab = isBullet || /^\*/.test(body) ? splitLabel(body) : { label: "", rest: cleaned };

    // "*Pinyin:* ..." / "*Dịch nghĩa:* ..." (Lớp 6) là phần tiếp của ví dụ đứng ngay trước, KHÔNG phải hàng mới
    if (pendingExample && lab.label && /^(?:pinyin|phiên âm|dịch nghĩa|dịch|nghĩa)$/i.test(lab.label)) {
      pendingExample.push(/^(?:pinyin|phiên âm)$/i.test(lab.label) ? `(${lab.rest})` : `→ ${lab.rest}`);
      continue;
    }
    if (lab.label && EXAMPLE_LABEL.test(lab.label)) {
      flushExample();
      inExample = true;
      exampleHost = lastNonExample || null;
      if (lab.rest) pendingExample = [lab.rest];
      continue;
    }

    if (lab.label) {
      flushExample();
      inExample = false;
      exampleHost = null;
      const row = { left: lab.label, right: lab.rest, example: "" };
      rows.push(row);
      current = row;
      lastNonExample = row;
      continue;
    }

    // Dòng chứa chữ Hán trong ngữ cảnh ví dụ (hoặc câu Hán kèm "(dịch)") → 1 ví dụ mới
    const looksLikeExample = HAS_CJK.test(cleaned) && (inExample || /[（(][^()]*[㐀-鿿]?[^()]*[)）]\s*$/.test(cleaned));
    if (looksLikeExample && (inExample || indent >= 2 || /^[㐀-鿿]/.test(cleaned))) {
      flushExample();
      pendingExample = [cleaned];
      continue;
    }

    flushExample();
    // Gạch đầu dòng lồng sâu dưới nhãn thường → nối vào cột Giải thích của hàng hiện tại
    if (current && (indent >= 2 || !isBullet)) {
      current.right = current.right ? `${current.right}\n${cleaned}` : cleaned;
    } else {
      const row = { left: /(dùng|biểu thị|diễn tả|chỉ|dùng để)/i.test(cleaned) ? "Cách dùng" : "Nội dung", right: cleaned, example: "" };
      rows.push(row);
      current = row;
      lastNonExample = row;
      inExample = false;
    }
  }
  flushExample();
  return rows.filter((r) => r.left || r.right || r.example);
}

function mapGrammarHeader(cells) {
  const map = {};
  cells.forEach((c, i) => {
    const h = c.toLowerCase();
    if (/^(stt|số)$/.test(h)) return;
    if (/dịch/.test(h)) map.translation = i;
    else if (/(ví dụ|câu ví dụ)/.test(h)) map.example = i;
    else if (/(ý nghĩa|cách dùng|đặc điểm|giải thích)/.test(h) && map.right === undefined) map.right = i;
    else if (/(ngữ pháp|cấu trúc|điểm)/.test(h) && map.left === undefined) map.left = i;
  });
  if (map.left === undefined) {
    // "Đặc điểm so sánh | 就 | 才": bảng so sánh nhiều cột - không phải bảng ngữ pháp 3 cột
    return null;
  }
  return map;
}

function tableRowToGrammar(cells, map) {
  const get = (k) => (map[k] !== undefined ? clean(stripMath(cells[map[k]] ?? "")) : "");
  const left = get("left");
  if (!left) return null;
  let example = get("example");
  const tr = get("translation");
  if (tr) example = example ? `${example}\n→ ${tr}` : `→ ${tr}`;
  return { left, right: get("right"), example };
}

// ---------- Hàm chính ----------
export function parseChineseVocabulary(markdown) {
  const lines = String(markdown ?? "").split(/\r?\n/);
  const stack = []; // [{ level, text }]
  const vocabGroups = [];
  const grammarGroups = [];
  let chuong = "";
  let bai = "";

  let curVocab = null;
  let tableMap = null;
  let inTable = false;
  let grammarBuf = null; // { title, lines[], rows[] , key }

  const inScope = (re) => stack.some((h) => re.test(h.text));
  const stopped = () => {
    // heading sâu nhất thuộc mục chặn (bài tập, bài khóa...) và không thuộc từ vựng/ngữ pháp
    const deepest = stack[stack.length - 1];
    if (!deepest) return false;
  // "Ghép cặp từ vựng ... (Luyện tập 4)" chứa chữ "từ vựng" nhưng là BÀI TẬP → luôn chặn
  if (/(luyện tập|练习)/i.test(deepest.text)) return true;
  return STOP_HEADING.test(deepest.text) && !VOCAB_HEADING.test(deepest.text) && !GRAMMAR_HEADING.test(deepest.text);
  };

  const baiPrefix = () => (bai ? `${shortBai(bai)} - ` : "");

  function openVocab() {
    const deepest = stack[stack.length - 1];
    const label = headingText(deepest?.text || "Từ vựng");
    const g = { id: `v${vocabGroups.length + 1}`, title: `${baiPrefix()}${label}`, bai, page: "", words: [] };
    vocabGroups.push(g);
    return g;
  }

  function flushGrammar() {
    if (!grammarBuf) return;
    const rows = [...grammarBuf.rows, ...buildRowsFromLines(grammarBuf.lines)];
    if (rows.length) {
      grammarGroups.push({ id: `g${grammarGroups.length + 1}`, title: `${baiPrefix()}${grammarBuf.title}`, bai: grammarBuf.bai, page: "", rows });
    }
    grammarBuf = null;
  }

  function openGrammar() {
    flushGrammar();
    const deepest = stack[stack.length - 1];
    grammarBuf = { title: headingText(deepest?.text || "Ngữ pháp"), bai, lines: [], rows: [] };
  }

  for (const rawLine of lines) {
    const hm = /^(#{1,6})\s+(.*)$/.exec(rawLine);
    if (hm) {
      const level = hm[1].length;
      const text = hm[2].trim();
      if (level === 1 && !chuong) chuong = headingText(text);
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      stack.push({ level, text });
      const plain = clean(text);
      // File Lớp 11 "# BÀI 1: ..." nằm ở H1 (chuong cũng là tên bài); các lớp khác "## BÀI n: ..."
      if (level <= 2 && BAI_HEADING.test(plain)) bai = headingText(text);
      curVocab = null; tableMap = null; inTable = false;
      flushGrammar();
      continue;
    }

    if (stopped()) continue;
    const inVocab = inScope(VOCAB_HEADING);
    const inGrammar = !inVocab && inScope(GRAMMAR_HEADING);
    const trimmed = rawLine.trim();

    if (inVocab) {
      if (!trimmed || trimmed === "---") { inTable = false; tableMap = null; continue; }
      if (trimmed.startsWith("|")) {
        if (/^[:\-\s|]+$/.test(trimmed)) continue;
        const cells = splitRow(trimmed);
        if (!inTable) { tableMap = mapHeader(cells); inTable = true; continue; }
        if (!tableMap) continue;
        const w = rowToWord(cells, tableMap);
        if (w) { curVocab = curVocab || openVocab(); curVocab.words.push(w); }
        continue;
      }
      inTable = false; tableMap = null;
      const w = parseBulletWord(rawLine) || parseLabelledWord(rawLine);
      if (w) { curVocab = curVocab || openVocab(); curVocab.words.push(w); }
      continue;
    }

    if (inGrammar) {
      if (!trimmed || trimmed === "---") { inTable = false; tableMap = null; if (grammarBuf && trimmed === "---") flushGrammar(); continue; }
      if (trimmed.startsWith("|")) {
        if (/^[:\-\s|]+$/.test(trimmed)) continue;
        const cells = splitRow(trimmed);
        if (!inTable) {
          tableMap = mapGrammarHeader(cells);
          inTable = true;
          if (tableMap && !grammarBuf) openGrammar();
          continue;
        }
        if (!tableMap) continue;
        const r = tableRowToGrammar(cells, tableMap);
        if (r) { if (!grammarBuf) openGrammar(); grammarBuf.rows.push(r); }
        continue;
      }
      inTable = false; tableMap = null;
      if (/^>/.test(trimmed)) continue; // trích dẫn bài đọc
      if (!grammarBuf) openGrammar();
      grammarBuf.lines.push(rawLine);
    }
  }
  flushGrammar();

  return {
    chuong,
    vocabGroups: vocabGroups.map((g) => ({ ...g, words: dedupeWords(g.words) })).filter((g) => g.words.length),
    grammarGroups,
  };
}

/** Nhóm ngữ pháp (rows 3 cột sẵn) → 1 bảng cho bản soạn. Cùng khuôn với bảng tiếng Anh để xem trước/xuất dùng chung. */
let tableCounter = 0;
export const HEADERS_ZH_GRAMMAR = ["Nội dung", "Giải thích", "Ví dụ (例句)"];
export function buildChineseGrammarTables(group) {
  const title = String(group?.title ?? "").replace(/^[^:]*?\s-\s/, "").trim();
  tableCounter += 1;
  const rows = (group?.rows || []).map((r, i) => ({
    id: `gz-${Date.now().toString(36)}-${tableCounter}-${i}`,
    left: r.left || "",
    right: r.right || "",
    example: r.example || "",
  }));
  if (!rows.length) return [];
  return [{ id: `tz-${Date.now().toString(36)}-${tableCounter}`, heading: title, title: "", headers: [...HEADERS_ZH_GRAMMAR], rows }];
}
