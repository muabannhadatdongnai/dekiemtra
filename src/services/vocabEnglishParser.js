/**
 * vocabEnglishParser.js (Phiên 51 - tab "Soạn từ vựng", Tiếng Anh)
 * Bóc tách TỪ VỰNG + NGỮ PHÁP từ Markdown SGK Tiếng Anh (Global Success / Friends Plus...) cho tab
 * "Soạn từ vựng". Đúng nguyên tắc "Isolation over DRY": mỗi ngôn ngữ 1 bộ đọc riêng (Tiếng Trung/Nhật
 * làm ở phiên sau với file riêng), KHÔNG dùng chung.
 *
 * ⚠️ NGUYÊN TẮC CỐT LÕI (Hoan chốt): TỪ + NGHĨA lấy THẲNG từ Markdown, KHÔNG để AI sinh. IPA/loại từ
 * có trong Markdown thì lấy luôn; chỗ nào Markdown thiếu mới để AI bổ sung (xem vocabEngine.js) và
 * đánh dấu để giáo viên rà lại.
 *
 * Markdown SGK Tiếng Anh có NHIỀU kiểu trình bày khác nhau theo Lớp/Chương (đã khảo sát ~2.500 dòng
 * từ vựng của Lớp 1-12): bảng (cột khác nhau tuỳ file), `* **word** (n): nghĩa`, `* **word** /ipa/: nghĩa`,
 * `- \`word\` (v) /ipa/: nghĩa`, `* *word* /ipa/ (nghĩa)`, `- **word:** nghĩa`... nên bộ đọc là chuỗi
 * quy tắc dung sai: dòng nào không nhận ra thì BỎ QUA (không đoán), giáo viên tự thêm tay trên giao diện.
 */

const VOCAB_HEADING = /(từ vựng|vocabulary|glossary|từ mới|new words)/i;
const GRAMMAR_HEADING = /(ngữ pháp|grammar)/i;
// Nhãn tiêu đề CHỈ là chữ "Từ vựng" (không mang tên nhóm cụ thể) → khi đặt tên nhóm thì lấy tiêu đề cha.
const PURE_VOCAB_LABEL = /^(?:[\dA-Z]+[.)]\s*)?(?:📖\s*)?(?:từ vựng|vocabulary|glossary|từ mới|new words)(?:\s*[&/-]\s*[^()]*)?(?:\s*\([^)]*\))?\s*:?$/i;

const CITATION = /\s*\[\d+(?:[\s,]*\d+)*\]/g;

const TYPE_MAP = {
  n: "n", noun: "n", "danh từ": "n", "danh từ số nhiều": "n (pl)", "danh từ số ít": "n",
  v: "v", verb: "v", "động từ": "v",
  adj: "adj", adjective: "adj", "tính từ": "adj",
  adv: "adv", adverb: "adv", "trạng từ": "adv",
  prep: "prep", pre: "prep", preposition: "prep", "giới từ": "prep",
  conj: "conj", conjunction: "conj", "liên từ": "conj",
  pron: "pron", pronoun: "pron", "đại từ": "pron",
  det: "det", "từ hạn định": "det",
  exclam: "exclam", interj: "exclam", "thán từ": "exclam",
  np: "np", nphr: "np", nphrase: "np", "cụm danh từ": "np",
  vp: "vp", vphr: "vp", pv: "phr v",
  idiom: "idiom", "thành ngữ": "idiom",
  phr: "phr", "phr v": "phr v", "phr.v": "phr v", "phrasal verb": "phr v", "cụm động từ": "phr v",
  "tên riêng": "proper n", "v/adj": "v/adj", "n/v": "n/v", "adj/adv": "adj/adv", "n/adj": "n/adj",
};

export function normalizeWordType(raw) {
  if (raw == null) return "";
  const t = String(raw).replace(/[*_`()]/g, "").replace(/\s+/g, " ").trim().toLowerCase().replace(/\.$/, "");
  if (!t) return "";
  const dotless = t.replace(/[.\s]/g, "");
  if (TYPE_MAP[t]) return TYPE_MAP[t];
  if (TYPE_MAP[dotless]) return TYPE_MAP[dotless];
  if (/^[a-z]{1,5}(?:\/[a-z]{1,5})*$/.test(t)) return t; // "n/v", "adj"...
  return "";
}

/** Làm sạch 1 chuỗi Markdown inline: bỏ trích dẫn [14], **, *, `, dấu chấm cuối. */
function clean(text) {
  return String(text ?? "")
    .replace(CITATION, "")
    .replace(/\$\\?\\?rightarrow\$/g, "→")
    .replace(/[`*]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const IPA_IN_TEXT = /(?<![\w/])\/([^\s/][^/]{0,58}?)\/(?![\w/])/;
const VI_DIACRITICS = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

function extractIpa(text) {
  const m = IPA_IN_TEXT.exec(text);
  if (!m) return { ipa: "", rest: text };
  const inner = m[1].trim();
  // Loại trừ "and/or", "he/she"... (không thể là IPA vì có dấu cách rồi chữ thường tiếng Việt, hoặc dấu tiếng Việt)
  if (VI_DIACRITICS.test(inner) || /^\d+$/.test(inner)) return { ipa: "", rest: text };
  return { ipa: `/${inner}/`, rest: (text.slice(0, m.index) + " " + text.slice(m.index + m[0].length)).replace(/\s+/g, " ").trim() };
}

function looksLikeExerciseOrSentence(word) {
  if (!word) return true;
  if (/_{2,}|\.{3,}|…|\?|!/.test(word)) return true;
  if (!/[A-Za-z]/.test(word)) return true;
  if (VI_DIACRITICS.test(word)) return true;
  const words = word.trim().split(/\s+/);
  return words.length > 6;
}

/**
 * Bóc 1 dòng danh sách → { word, ipa, type, meaning } | null.
 * Hỗ trợ: **word** / `word` / *word* ở đầu dòng, `(type)` và `/ipa/` theo thứ tự bất kỳ, sau đó
 * `: nghĩa` hoặc `(nghĩa)`.
 */
export function parseVocabLine(rawLine) {
  let line = String(rawLine ?? "").replace(CITATION, "").trim();
  line = line.replace(/^(?:[-*+]\s+|\d+[.)]\s+)/, "").trim();
  if (!line || line === "---") return null;
  if (/(->|➔|→|\\rightarrow)/.test(line)) return null; // bài tập nối, không phải mục từ

  let word = "";
  let rest = "";
  let m;
  if ((m = /^\*\*(.+?):\*\*\s*(.*)$/.exec(line))) {
    // **word:** nghĩa
    word = m[1]; rest = m[2];
  } else if ((m = /^\*\*(.+?)\*\*\s*(.*)$/.exec(line))) {
    word = m[1]; rest = m[2];
  } else if ((m = /^`([^`]+)`\s*(.*)$/.exec(line))) {
    word = m[1]; rest = m[2];
  } else if ((m = /^\*([^*]+)\*\s*(.*)$/.exec(line))) {
    word = m[1]; rest = m[2];
  } else {
    return null;
  }
  word = clean(word).replace(/^[a-z]\)\s*/i, "");
  if (looksLikeExerciseOrSentence(word)) return null;
  // Tiêu đề phụ dạng "**Mai:** lời thoại" hoặc nhãn "Âm /h/:" → word có "/" IPA hoặc rest là câu dài tiếng Anh
  if (/^\/.+\/$/.test(word)) return null;

  rest = rest.replace(/^:\s*/, "").trim();

  let type = "";
  let ipa = "";
  // Thử lặp: (type) /ipa/ hoặc /ipa/ (type) ở đầu phần còn lại
  for (let i = 0; i < 3; i += 1) {
    const before = rest;
    const mt = /^\(([^)]{1,30})\)\s*/.exec(rest);
    if (mt && !type) {
      const nt = normalizeWordType(mt[1].replace(/[:：].*$/, ""));
      if (nt) { type = nt; rest = rest.slice(mt[0].length).trim(); }
      else if (/^(?:động từ|danh từ|tính từ|trạng từ|giới từ)\s*[:：]/i.test(mt[1])) {
        // (động từ: sở hữu) kiểu cũ - lấy loại từ, phần sau dấu : là nghĩa
        const parts = mt[1].split(/[:：]/);
        type = normalizeWordType(parts[0]);
        rest = (parts.slice(1).join(":").trim() + " " + rest.slice(mt[0].length)).trim();
      }
    }
    const mi = /^`?(\/[^/]+\/)`?\s*/.exec(rest);
    if (mi && !ipa) {
      const e = extractIpa(mi[1]);
      if (e.ipa) { ipa = e.ipa; rest = rest.slice(mi[0].length).trim(); }
    }
    if (rest === before) break;
  }
  rest = rest.replace(/^[:：-]\s*/, "").trim();

  let meaning = clean(rest);
  // `*định nghĩa tiếng Anh* (nghĩa tiếng Việt)` → lấy phần trong ngoặc cuối
  const mDef = /^\*[^*]+\*\s*\((.+)\)\s*$/.exec(rest.replace(/`/g, ""));
  if (mDef) meaning = clean(mDef[1]);
  else if (/^\((.+)\)$/.test(meaning)) meaning = meaning.replace(/^\(|\)$/g, "").trim();
  meaning = meaning.replace(/[.;]\s*$/, "").trim();

  // Dòng không có gì ngoài tên in đậm (VD nhãn "**Phát âm**") → bỏ
  if (!meaning && !ipa && !type) return null;
  // Nghĩa phải có chữ tiếng Việt hoặc ít nhất là chữ; loại trừ dòng hội thoại dài toàn tiếng Anh
  // Lời thoại/câu tiếng Anh lọt vào (VD "**Mai:** Ms Hoa, what is ecotourism?"): nghĩa không có chữ có dấu tiếng Việt
  // mà lại là câu hỏi/câu cảm thán hoặc dài từ 5 từ → không phải mục từ.
  if (meaning && !VI_DIACRITICS.test(meaning) && (/[?!]/.test(meaning) || meaning.split(" ").length >= 5)) return null;

  return { word, ipa, type, meaning };
}

/** Dòng liệt kê nhiều mục trên 1 dòng: `*Britain* (Nước Anh), *Viet Nam* (Việt Nam)` → nhiều mục từ. */
export function parseInlineVocabList(rawLine) {
  const text = String(rawLine ?? "").replace(CITATION, "");
  const out = [];
  const re = /\*{1,2}([^*]+?)\*{1,2}\s*\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text))) {
    const word = clean(m[1]).replace(/^[a-z]\)\s*/i, "");
    const meaning = clean(m[2]);
    if (!looksLikeExerciseOrSentence(word) && meaning) out.push({ word, ipa: "", type: "", meaning });
  }
  return out.length >= 2 ? out : [];
}

/** Gộp các mục trùng từ (không phân biệt hoa/thường) trong 1 nhóm: giữ lần đầu, bổ sung trường còn trống. */
function dedupeWords(words) {
  const byKey = new Map();
  for (const w of words) {
    const key = w.word.toLowerCase();
    const cur = byKey.get(key);
    if (!cur) { byKey.set(key, { ...w }); continue; }
    for (const f of ["ipa", "type", "meaning", "example"]) if (!cur[f] && w[f]) cur[f] = w[f];
  }
  return [...byKey.values()];
}

// ---------- Bảng ----------
const COLUMN_RULES = [
  ["ipa", /(phát âm|phiên âm|ipa|pronunciation|transcription)/i],
  ["type", /(từ loại|loại từ|part of speech|^type$|^pos$)/i],
  ["example", /(ví dụ|example|ngữ cảnh|context)/i],
  ["meaning", /(nghĩa|meaning|dịch)/i],
  ["word", /(từ vựng|từ mới|^word|^vocabulary|new words|^từ$|english)/i],
];

function splitRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

function mapHeader(cells) {
  const map = {};
  cells.forEach((c, idx) => {
    const text = clean(c);
    for (const [key, re] of COLUMN_RULES) {
      if (re.test(text) && map[key] === undefined) { map[key] = idx; break; }
    }
  });
  return map.word !== undefined && map.meaning !== undefined ? map : null;
}

function rowToWord(cells, map) {
  const word = clean(cells[map.word] ?? "");
  if (looksLikeExerciseOrSentence(word)) return null;
  const meaning = clean(cells[map.meaning] ?? "");
  if (!meaning) return null;
  const ipa = map.ipa !== undefined ? extractIpa(clean(cells[map.ipa] ?? "")).ipa || (clean(cells[map.ipa] ?? "").match(/^\/.+\/$/) ? clean(cells[map.ipa]) : "") : "";
  const type = map.type !== undefined ? normalizeWordType(cells[map.type]) : "";
  const example = map.example !== undefined ? clean(cells[map.example] ?? "") : "";
  return { word, ipa, type, meaning, ...(example ? { example } : {}) };
}

// ---------- Ngữ pháp ----------
function splitGrammarLine(text) {
  const t = clean(text);
  // "Cấu trúc: giải thích" - tách ở dấu : đầu tiên nếu vế trái ngắn
  const idx = t.indexOf(":");
  if (idx > 0 && idx <= 60) return { left: t.slice(0, idx).trim(), right: t.slice(idx + 1).trim() };
  return { left: t, right: "" };
}

// ---------- Hàm chính ----------
function pageOf(text) {
  const m = /(?:trang|page|tr\.)\s*([\d]+(?:\s*(?:&|,|-|–|và)\s*\d+)*)/i.exec(text);
  return m ? m[1].replace(/\s*(?:&|và)\s*/g, ", ").replace(/\s+/g, " ").trim() : "";
}

function headingTitle(text) {
  return clean(text).replace(/\s*[-–]\s*(?:trang|page)\s*[\d\s&,\-–và]+$/i, "").replace(/^\d+\.\s*/, "").trim();
}

/**
 * parseEnglishVocabulary(markdown) → {
 *   chuong: "UNIT 1: MY NEW SCHOOL...",
 *   vocabGroups:   [{ id, title, page, words: [{ word, ipa, type, meaning, example? }] }],
 *   grammarGroups: [{ id, title, page, rows: [{ left, right }] }],
 * }
 * Mỗi nhóm = 1 mục từ vựng/ngữ pháp trong Markdown (VD "Getting Started", "A. Đồ dùng học tập") để
 * giáo viên chọn nhóm nào đưa vào bản soạn của 1 tiết.
 */
export function parseEnglishVocabulary(markdown) {
  const lines = String(markdown ?? "").split(/\r?\n/);
  const stack = []; // [{ level, text }]
  const vocabGroups = [];
  const grammarGroups = [];
  let chuong = "";
  let curVocab = null;
  let curGrammar = null;
  let tableMap = null;
  let inTable = false;
  let lastGrammarRow = null;
  let labelScope = null; // { indent, group } - nhãn in đậm "**Từ vựng (Vocabulary):**" không phải tiêu đề (Tiểu học)

  const inScope = (re) => stack.some((h) => re.test(h.text));

  function groupTitleFor(re) {
    // Tên nhóm: tiêu đề sâu nhất KHÔNG chỉ là nhãn "Từ vựng"; gộp với tiêu đề cha (bài) nếu cần.
    const chain = stack.filter((h) => h.level >= 2);
    const deepest = chain[chain.length - 1];
    if (!deepest) return "Từ vựng";
    const label = clean(deepest.text);
    if (re === VOCAB_HEADING && PURE_VOCAB_LABEL.test(label) && chain.length >= 2) {
      return headingTitle(chain[chain.length - 2].text);
    }
    return headingTitle(label);
  }

  function pageFromStack() {
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      const p = pageOf(stack[i].text);
      if (p) return p;
    }
    return "";
  }

  function openVocabGroup() {
    const title = groupTitleFor(VOCAB_HEADING) || "Từ vựng";
    // Mỗi tiêu đề sâu nhất khác nhau = nhóm riêng; cùng tiêu đề thì gộp tiếp vào nhóm trước.
    const last = vocabGroups[vocabGroups.length - 1];
    if (last && last.title === title && last._stackKey === stack.map((h) => h.text).join("|")) return last;
    const g = { id: `v${vocabGroups.length + 1}`, title, page: pageFromStack(), words: [], _stackKey: stack.map((h) => h.text).join("|") };
    vocabGroups.push(g);
    return g;
  }

  function openGrammarGroup() {
    const title = groupTitleFor(GRAMMAR_HEADING) || "Ngữ pháp";
    const g = { id: `g${grammarGroups.length + 1}`, title, page: pageFromStack(), rows: [], _stackKey: stack.map((h) => h.text).join("|") };
    grammarGroups.push(g);
    return g;
  }

  for (const rawLine of lines) {
    const hm = /^(#{1,6})\s+(.*)$/.exec(rawLine);
    if (hm) {
      const level = hm[1].length;
      const text = hm[2].trim();
      if (level === 1 && !chuong) chuong = clean(text);
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      stack.push({ level, text });
      curVocab = null; curGrammar = null; tableMap = null; inTable = false; lastGrammarRow = null; labelScope = null;
      continue;
    }

    const inVocab = inScope(VOCAB_HEADING);
    const inGrammar = !inVocab && inScope(GRAMMAR_HEADING);

    // Nhãn in đậm KHÔNG phải tiêu đề (Tiểu học): "* **Từ vựng (Vocabulary):** ..." rồi các bullet con thụt lề.
    if (!inVocab && !inGrammar) {
      const bullet = /^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/.exec(rawLine);
      if (!bullet) continue;
      const indent = bullet[1].length;
      const lm = /^\*\*([^*]*(?:từ vựng|vocabulary)[^*]*)\*\*\s*(.*)$/i.exec(bullet[2].replace(CITATION, ""));
      if (lm && !/(ngữ âm|phonics|phát âm)/i.test(lm[1])) {
        const label = headingTitle(lm[1].replace(/[:：]\s*$/, ""));
        const g = { id: `v${vocabGroups.length + 1}`, title: label || "Từ vựng", page: pageFromStack(), words: [], _stackKey: `label|${vocabGroups.length}` };
        vocabGroups.push(g);
        labelScope = { indent, group: g };
        const inline = parseInlineVocabList(lm[2]);
        if (inline.length) g.words.push(...inline);
        continue;
      }
      if (labelScope) {
        if (indent <= labelScope.indent) { labelScope = null; continue; }
        const one = parseVocabLine(rawLine);
        const list = parseInlineVocabList(rawLine);
        if (list.length) labelScope.group.words.push(...list);
        else if (one) labelScope.group.words.push(one);
      }
      continue;
    }
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed === "---") { inTable = false; tableMap = null; continue; }

    if (inVocab) {
      if (trimmed.startsWith("|")) {
        const cells = splitRow(trimmed);
        if (/^[:\-\s|]+$/.test(trimmed)) continue; // dòng kẻ |:---|
        if (!inTable) {
          tableMap = mapHeader(cells);
          inTable = true;
          continue;
        }
        if (!tableMap) continue;
        const w = rowToWord(cells, tableMap);
        if (w) { curVocab = curVocab || openVocabGroup(); curVocab.words.push(w); }
        continue;
      }
      inTable = false; tableMap = null;
      if (/^\s*(?:[-*+]|\d+[.)])\s/.test(rawLine)) {
        const w = parseVocabLine(rawLine);
        if (w) { curVocab = curVocab || openVocabGroup(); curVocab.words.push(w); }
      }
      continue;
    }

    // Ngữ pháp: mỗi bullet cấp 1 = 1 dòng; bullet lồng bên trong nối vào vế phải của dòng trước
    const bm = /^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/.exec(rawLine);
    if (bm) {
      const indent = bm[1].length;
      const body = bm[2];
      curGrammar = curGrammar || openGrammarGroup();
      if (indent >= 2 && lastGrammarRow) {
        const extra = clean(body);
        if (extra) lastGrammarRow.right = lastGrammarRow.right ? `${lastGrammarRow.right} | ${extra}` : extra;
      } else {
        const row = splitGrammarLine(body);
        if (row.left) { curGrammar.rows.push(row); lastGrammarRow = row; }
      }
    } else if (curGrammar && lastGrammarRow && trimmed.startsWith("*")) {
      lastGrammarRow.right = (lastGrammarRow.right + " " + clean(trimmed)).trim();
    }
  }

  const strip = ({ _stackKey, ...g }) => g;
  return {
    chuong,
    vocabGroups: vocabGroups.map((g) => ({ ...g, words: dedupeWords(g.words) })).filter((g) => g.words.length).map(strip),
    grammarGroups: grammarGroups.filter((g) => g.rows.length).map(strip),
  };
}
