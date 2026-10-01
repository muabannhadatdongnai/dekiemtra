import { test } from "node:test";
import assert from "node:assert/strict";
import { Packer } from "docx";
import JSZip from "jszip";
import {
  parseEnglishVocabulary,
  parseVocabLine,
  normalizeWordType,
} from "../src/services/vocabEnglishParser.js";
import { sanitizeIpa, mergeEnrichment } from "../src/services/vocabEngine.js";
import { buildVocabResult, buildVocabTitleLines } from "../src/data/vocabResult.js";
import { buildVocabDocument } from "../src/services/vocabExportService.js";
import { buildVocabEnrichPrompt } from "../src/services/vocabPromptTemplates.js";
import { hasVocabParser, parseVocabularyByLanguage } from "../src/services/vocabParserRegistry.js";

/**
 * vocabEnglish.test.js (Phiên 51 - tab "Soạn từ vựng")
 * Fixture mô phỏng các KIỂU trình bày thật trong Markdown SGK Tiếng Anh (đã khảo sát Lớp 1-12):
 * danh sách `**word** (n): nghĩa`, có/không IPA, bảng nhiều cột, dòng backtick, nhãn in đậm Tiểu học.
 * ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY (dùng thật docx + jszip). Chạy: node --test test/vocabEnglish.test.js
 */

const MD_LIST = `# UNIT 2: MY HOUSE (NGÔI NHÀ CỦA TÔI)

## II. CHI TIẾT

### 2. Từ vựng (Vocabulary)
#### A. Loại hình nhà ở (Types of House)
* **town house** (n): nhà phố [14]
* **flat** (n): căn hộ chung cư
* **hall** (n) \`/hɔːl/\`: sảnh lớn
#### B. Từ vựng bổ sung (Glossary)
* **between** (pre): ở giữa
* **Household chores** (n.phr) \`/ˈhaʊshəʊld tʃɔːz/\`: Công việc nhà

### 4. Ngữ pháp (Grammar)
#### A. Giới từ chỉ vị trí
* **in (trong)**: in the kitchen (trong bếp).
* **on (trên)**: on the wall
  * Ví dụ: on the table
`;

const MD_TABLE = `# UNIT 9: ENGLISH IN THE WORLD

### Bảng từ vựng
| STT | Từ vựng | Phát âm | Từ loại | Nghĩa tiếng Việt | Ví dụ |
|:---|:---|:---|:---|:---|:---|
| 22 | **standard** | /ˈstændəd/ | *n* | chuẩn mực, tiêu chuẩn | The **standards** of English. |
| 23 | **translate** | /trænzˈleɪt/ | *v* | dịch, biên dịch | How many books? |
`;

const MD_PRIMARY = `# TIẾNG ANH 4

## Tổng quan
* **Từ vựng (Vocabulary):**
  * *Britain* (Nước Anh), *Viet Nam* (Việt Nam), *America* (Nước Mỹ)
* **Ngữ âm (Phonics):**
  * Phân biệt âm **-a** /ə/
`;

test("parseVocabLine: nhiều kiểu dòng từ vựng (IPA/loại từ/ngoặc nghĩa)", () => {
  assert.deepEqual(parseVocabLine("* **town house** (n): nhà phố [14]"), { word: "town house", ipa: "", type: "n", meaning: "nhà phố" });
  assert.deepEqual(parseVocabLine("- `attend` (v) /əˈtend/: đi học."), { word: "attend", ipa: "/əˈtend/", type: "v", meaning: "đi học" });
  assert.deepEqual(parseVocabLine("* **lake** `/leɪk/` (danh từ): hồ nước"), { word: "lake", ipa: "/leɪk/", type: "n", meaning: "hồ nước" });
  assert.deepEqual(parseVocabLine("* **teddy bear**: con gấu bông"), { word: "teddy bear", ipa: "", type: "", meaning: "con gấu bông" });
  assert.deepEqual(parseVocabLine("* **doing DIY (do-it-yourself):** tự làm đồ thủ công"), {
    word: "doing DIY (do-it-yourself)", ipa: "", type: "", meaning: "tự làm đồ thủ công",
  });
});

test("parseVocabLine: bỏ qua dòng bài tập nối, hội thoại, nhãn - KHÔNG đoán", () => {
  assert.equal(parseVocabLine("1. **doing puzzles** -> *improve memory* (cải thiện trí nhớ)"), null);
  assert.equal(parseVocabLine("* **Mai:** Ms Hoa, what is **ecotourism**?"), null);
  assert.equal(parseVocabLine("* **Âm /h/:**"), null);
  assert.equal(parseVocabLine("Chỉ là một đoạn văn bình thường."), null);
});

test("normalizeWordType: chuẩn hoá viết tắt/tiếng Việt, từ lạ trả rỗng", () => {
  assert.equal(normalizeWordType("pre"), "prep");
  assert.equal(normalizeWordType("n.phr"), "np");
  assert.equal(normalizeWordType("danh từ"), "n");
  assert.equal(normalizeWordType("tính từ"), "adj");
  assert.equal(normalizeWordType("*n*"), "n");
  assert.equal(normalizeWordType("mì ống, mì sợi"), "");
  assert.equal(normalizeWordType(""), "");
});

test("parseEnglishVocabulary: danh sách theo nhóm A/B, IPA/loại từ lấy từ Markdown, ngữ pháp thành dòng", () => {
  const r = parseEnglishVocabulary(MD_LIST);
  assert.match(r.chuong, /UNIT 2: MY HOUSE/);
  assert.equal(r.vocabGroups.length, 2);
  assert.match(r.vocabGroups[0].title, /Loại hình nhà ở/);
  assert.deepEqual(r.vocabGroups[0].words.map((w) => w.word), ["town house", "flat", "hall"]);
  assert.equal(r.vocabGroups[0].words[2].ipa, "/hɔːl/");
  assert.equal(r.vocabGroups[0].words[0].ipa, "", "Markdown không có IPA → để trống cho AI bổ sung, KHÔNG tự bịa");
  assert.equal(r.vocabGroups[1].words[0].type, "prep");
  assert.equal(r.vocabGroups[1].words[1].type, "np");
  assert.equal(r.grammarGroups.length, 1);
  assert.equal(r.grammarGroups[0].rows[0].left, "in (trong)");
  assert.match(r.grammarGroups[0].rows[1].right, /on the wall|Ví dụ: on the table/);
});

test("parseEnglishVocabulary: bảng nhiều cột (map cột theo tiêu đề, bỏ cột STT)", () => {
  const r = parseEnglishVocabulary(MD_TABLE);
  const words = r.vocabGroups.flatMap((g) => g.words);
  assert.equal(words.length, 2);
  assert.deepEqual(words[0], { word: "standard", ipa: "/ˈstændəd/", type: "n", meaning: "chuẩn mực, tiêu chuẩn", example: "The standards of English." });
});

test("parseEnglishVocabulary: Tiểu học - nhãn in đậm + danh sách inline, không lẫn mục Ngữ âm", () => {
  const r = parseEnglishVocabulary(MD_PRIMARY);
  assert.equal(r.vocabGroups.length, 1);
  assert.deepEqual(r.vocabGroups[0].words.map((w) => w.word), ["Britain", "Viet Nam", "America"]);
  assert.equal(r.vocabGroups[0].words[1].meaning, "Việt Nam");
});

test("parseEnglishVocabulary: Markdown rỗng/lạ → kết quả rỗng, không ném lỗi", () => {
  assert.deepEqual(parseEnglishVocabulary("").vocabGroups, []);
  assert.deepEqual(parseEnglishVocabulary("# Không có gì\n\nChỉ có văn bản.").grammarGroups, []);
});

test("registry: chỉ Tiếng Anh có bộ đọc ở Phiên 51", () => {
  assert.equal(hasVocabParser("Tieng_Anh"), true);
  assert.equal(hasVocabParser("Tieng_Trung"), false);
  assert.equal(parseVocabularyByLanguage("Tieng_Trung", MD_LIST), null);
});

test("sanitizeIpa: chuẩn hoá & loại IPA không hợp lệ", () => {
  assert.equal(sanitizeIpa("kɪtʃən"), "/kɪtʃən/");
  assert.equal(sanitizeIpa("/ˈkɪtʃ.ən/"), "/ˈkɪtʃ.ən/");
  assert.equal(sanitizeIpa("phòng bếp"), "");
  assert.equal(sanitizeIpa(""), "");
  assert.equal(sanitizeIpa("/a1/"), "");
});

test("mergeEnrichment: CHỈ điền ô trống, KHÔNG ghi đè giá trị Markdown, đánh dấu aiIpa/aiType", () => {
  const words = [
    { id: "a", word: "hall", ipa: "/hɔːl/", type: "", meaning: "sảnh" },
    { id: "b", word: "kitchen", ipa: "", type: "", meaning: "phòng bếp" },
    { id: "c", word: "flat", ipa: "", type: "n", meaning: "căn hộ" },
  ];
  const ai = [
    { id: "a", ipa: "/SAI/", type: "n" },
    { id: "b", ipa: "/ˈkɪtʃ.ən/", type: "noun" },
    { id: "c", ipa: "/flæt/", type: "v" },
    { id: "zzz", ipa: "/x/", type: "n" },
  ];
  const out = mergeEnrichment(words, ai);
  assert.equal(out[0].ipa, "/hɔːl/", "giữ IPA từ Markdown");
  assert.equal(out[0].type, "n");
  assert.equal(out[0].aiType, true);
  assert.notEqual(out[0].aiIpa, true);
  assert.equal(out[1].ipa, "/ˈkɪtʃ.ən/");
  assert.equal(out[1].type, "n");
  assert.equal(out[2].type, "n", "giữ loại từ từ Markdown");
  assert.equal(out[2].ipa, "/flæt/");
  assert.equal(out.length, 3);
});

test("buildVocabEnrichPrompt: chỉ yêu cầu trường thiếu, cấm đổi từ/nghĩa", () => {
  const p = buildVocabEnrichPrompt({ items: [{ id: "1", word: "kitchen", meaning: "phòng bếp", needIpa: true, needType: false }] });
  assert.match(p, /"need":"ipa"/);
  assert.match(p, /KHÔNG đổi/);
});

test("buildVocabResult: gộp nhóm đã chọn, loại từ trùng, sinh id", () => {
  const parsed = parseEnglishVocabulary(MD_LIST);
  const result = buildVocabResult({
    header: { tuan: "Week 3", unit: "Unit 2: My house", tiet: "Period 8", baiHoc: "Getting started", trang: "16, 17" },
    vocabGroups: [parsed.vocabGroups[0], parsed.vocabGroups[0]],
    grammarGroups: parsed.grammarGroups,
    meta: { grade: 6 },
  });
  assert.equal(result.words.length, 3);
  assert.ok(result.words.every((w) => w.id));
  assert.equal(result.grammar.length, 2);
  assert.deepEqual(buildVocabTitleLines(result.header), ["WEEK 3", "UNIT 2: MY HOUSE", "PERIOD 8: GETTING STARTED (PAGE 16, 17)"]);
});

test("buildVocabDocument: sinh Word hợp lệ, A4 dọc, có bảng từ vựng + ngữ pháp", async () => {
  const doc = buildVocabDocument({
    header: { tuan: "Week 3", unit: "Unit 2: My house", tiet: "Period 8", baiHoc: "Getting started", trang: "16, 17" },
    words: [
      { id: "1", word: "air conditioner", ipa: "/ˈeə(r) kənˈdɪʃ.ən.ər/", type: "n", meaning: "điều hoà nhiệt độ" },
      { id: "2", word: "apartment = flat", ipa: "/əˈpɑːt.mənt/ /flæt/", type: "n", meaning: "căn hộ" },
    ],
    grammar: [{ id: "g", left: "There is a/an/one", right: "có | Ví dụ: There is a lamp." }],
  });
  const buf = await Packer.toBuffer(doc);
  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file("word/document.xml").async("string");
  assert.match(xml, /WEEK 3/);
  assert.match(xml, /A\. Vocabulary/);
  assert.match(xml, /B\. Grammar/);
  assert.match(xml, /air conditioner/);
  assert.match(xml, /\(n\)/);
  assert.match(xml, /<w:pgSz[^>]*w:w="1190[56]"/, "khổ A4 dọc");
  assert.doesNotMatch(xml, /<w:p>\s*<w:p>/, "không lồng <w:p> trong <w:p> (bug Phiên 37)");
});

test("buildVocabDocument: không có ngữ pháp thì không in mục B", async () => {
  const doc = buildVocabDocument({ header: {}, words: [{ id: "1", word: "a", ipa: "", type: "", meaning: "b" }], grammar: [] });
  const zip = await JSZip.loadAsync(await Packer.toBuffer(doc));
  const xml = await zip.file("word/document.xml").async("string");
  assert.doesNotMatch(xml, /B\. Grammar/);
});
