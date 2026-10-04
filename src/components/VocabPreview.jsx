"use client";

import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { nextVocabId, buildVocabTitleLines } from "@/data/vocabResult";
import { buildChineseTitleLines, blankChineseWord } from "@/data/vocabChineseResult";
import { buildBlankGrammarTable } from "@/services/vocabGrammarLayout";

/**
 * VocabPreview.jsx (Phiên 51 - tab "Soạn từ vựng")
 * Bản xem trước DẠNG BẢNG SỬA ĐƯỢC TRỰC TIẾP (khác các tab khác chỉ xem): giáo viên chỉnh từ/phiên âm/
 * loại từ/nghĩa, thêm-xoá-đổi chỗ dòng, rồi mới xuất Word. Ô do AI bổ sung (aiIpa/aiType) tô vàng cho tới
 * khi giáo viên sửa ô đó. Phiên 52: Tiếng Trung (meta.languageCode === "zh") dùng bộ cột riêng (ZH_COLUMNS) và dòng tiêu đề tiếng Việt. Tab này KHÔNG dùng id="print-area" (chỉ xuất Word, giống tab Khung KHGD).
 */

const cellInput = "w-full bg-transparent px-2 py-1 text-sm outline-none focus:bg-brand-50";
const th = "border border-slate-400 bg-slate-100 px-2 py-1 text-center text-sm font-semibold";
const td = "border border-slate-400 p-0 align-middle";

// Bộ cột bảng từ vựng theo ngôn ngữ: key = trường của từ, ai = cờ "AI điền" (tô vàng), w = độ rộng %, mono = in đậm
const EN_COLUMNS = [
  { key: "word", header: "New words", w: 19, bold: true },
  { key: "ipa", header: "IPA", w: 17, center: true, ai: "aiIpa" },
  { key: "type", header: "Từ loại (P.O.S)", w: 11, center: true, ai: "aiType" },
  { key: "meaning", header: "Meaning", w: 22 },
  { key: "example", header: "Ví dụ (Example)", w: 25, ai: "aiExample" },
];
const ZH_COLUMNS = [
  { key: "word", header: "Chữ Hán", w: 14, bold: true, center: true },
  { key: "pinyin", header: "Pinyin", w: 15, center: true, ai: "aiPinyin" },
  { key: "hanViet", header: "Âm Hán Việt", w: 11, center: true, ai: "aiHanViet" },
  { key: "type", header: "Từ loại", w: 10, center: true, ai: "aiType" },
  { key: "meaning", header: "Nghĩa", w: 20 },
  { key: "example", header: "Ví dụ (例句)", w: 24, ai: "aiExample" },
];

function moveItem(list, index, delta) {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function VocabPreview({ result, onResultChange }) {
  const words = result?.words || [];
  const grammar = result?.grammar || [];
  const header = result?.header || {};
  const hasContent = words.length > 0 || grammar.length > 0 || buildVocabTitleLines(header).length > 0;

  if (!hasContent) {
    return (
      <div className="mx-auto max-w-3xl rounded-md bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Chọn Unit/Chương ở cột bên trái rồi bấm &quot;Tạo bản soạn&quot; để xem bảng từ vựng tại đây.
      </div>
    );
  }

  const update = (patch) => onResultChange({ ...result, ...patch });
  const setWord = (i, patch) => update({ words: words.map((w, idx) => (idx === i ? { ...w, ...patch } : w)) });
  const setGrammar = (i, patch) => update({ grammar: grammar.map((g, idx) => (idx === i ? { ...g, ...patch } : g)) });
  const isZh = result?.meta?.languageCode === "zh";
  const columns = isZh ? ZH_COLUMNS : EN_COLUMNS;
  const titleLines = isZh ? buildChineseTitleLines(header) : buildVocabTitleLines(header);
  const blankWord = () => (isZh ? blankChineseWord() : { id: nextVocabId("w"), word: "", ipa: "", type: "", meaning: "", example: "" });
  const aiFlags = columns.map((c) => c.ai).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-md bg-white p-6 shadow-sm" style={{ fontFamily: isZh ? '"SimSun", "Microsoft YaHei", "PingFang SC", "Times New Roman", serif' : '"Times New Roman", serif' }}>
      <div className="no-print grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          ["tuan", "Tuần"],
          ["unit", "Unit"],
          ["tiet", "Tiết"],
          ["baiHoc", "Bài học"],
          ["trang", "Trang"],
        ].map(([key, label]) => (
          <label key={key} className="text-xs text-slate-500">
            {label}
            <input
              value={header[key] || ""}
              onChange={(e) => update({ header: { ...header, [key]: e.target.value } })}
              className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-800"
            />
          </label>
        ))}
      </div>

      <div className="text-center font-bold">
        {titleLines.map((l, i) => (
          <p key={i} className={i === titleLines.length - 1 ? "text-lg" : ""}>{l}</p>
        ))}
      </div>

      <div>
        <p className="mb-1 font-bold">{isZh ? "I. Từ vựng (生词)" : "I. Vocabulary"}</p>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={th} style={{ width: isZh ? "6%" : "6%" }}>No.</th>
              {columns.map((c) => (
                <th key={c.key} className={th} style={{ width: `${c.w}%` }}>{c.header}</th>
              ))}
              <th className="no-print w-20 border-0"></th>
            </tr>
          </thead>
          <tbody>
            {words.map((w, i) => (
              <tr key={w.id}>
                <td className={`${td} bg-slate-50 px-1 text-center text-sm text-slate-600`}>{i + 1}</td>
                {columns.map((c) => {
                  const aiOn = c.ai && w[c.ai];
                  return (
                    <td key={c.key} className={`${td} ${aiOn ? "bg-amber-100" : ""}`}>
                      <input
                        value={w[c.key] || ""}
                        onChange={(e) => setWord(i, { [c.key]: e.target.value, ...(c.ai ? { [c.ai]: false } : {}) })}
                        className={`${cellInput} ${c.bold ? "font-semibold" : ""} ${c.center ? "text-center" : ""}`}
                        title={aiOn ? "AI điền - vui lòng rà lại" : ""}
                      />
                    </td>
                  );
                })}
                <td className="no-print whitespace-nowrap border-0 pl-1">
                  <button type="button" onClick={() => update({ words: moveItem(words, i, -1) })} className="text-slate-400 hover:text-slate-700" title="Lên"><ChevronUp size={14} /></button>
                  <button type="button" onClick={() => update({ words: moveItem(words, i, 1) })} className="text-slate-400 hover:text-slate-700" title="Xuống"><ChevronDown size={14} /></button>
                  <button type="button" onClick={() => update({ words: words.filter((_, idx) => idx !== i) })} className="text-slate-400 hover:text-red-600" title="Xoá dòng"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={() => update({ words: [...words, blankWord()] })}
          className="no-print mt-2 flex items-center gap-1 text-xs text-brand-700 hover:underline"
        >
          <Plus size={13} /> Thêm từ
        </button>
        {words.some((w) => aiFlags.some((f) => w[f])) && (
          <p className="no-print mt-1 text-xs text-amber-700">Ô tô vàng do AI bổ sung - vui lòng rà lại trước khi in.</p>
        )}
      </div>

      <div>
        <p className="mb-1 font-bold">{isZh ? "II. Ngữ pháp (语言点)" : "II. Grammar"}</p>
        {grammar.map((t, ti) => {
          const topicNo = grammar.slice(0, ti + 1).filter((x) => x.heading?.trim()).length;
          const setTable = (patch) => update({ grammar: grammar.map((x, idx) => (idx === ti ? { ...x, ...patch } : x)) });
          const setRow = (ri, patch) => setTable({ rows: t.rows.map((r, idx) => (idx === ri ? { ...r, ...patch } : r)) });
          return (
            <div key={t.id} className="mb-5 rounded border border-transparent hover:border-slate-200">
              <div className="no-print flex flex-wrap items-center gap-2 pb-1">
                <input
                  value={t.heading || ""}
                  onChange={(e) => setTable({ heading: e.target.value })}
                  placeholder="Tiêu đề chủ điểm / thì (VD: Thì Hiện tại đơn (The Present Simple))"
                  className="min-w-[14rem] flex-1 rounded border border-slate-300 px-2 py-1 text-sm font-semibold"
                />
                <input
                  value={t.title || ""}
                  onChange={(e) => setTable({ title: e.target.value })}
                  placeholder="Tên bảng (VD: Cấu trúc)"
                  className="w-44 rounded border border-slate-300 px-2 py-1 text-sm"
                />
                <button type="button" onClick={() => update({ grammar: moveItem(grammar, ti, -1) })} className="text-slate-400 hover:text-slate-700" title="Đưa bảng lên"><ChevronUp size={15} /></button>
                <button type="button" onClick={() => update({ grammar: moveItem(grammar, ti, 1) })} className="text-slate-400 hover:text-slate-700" title="Đưa bảng xuống"><ChevronDown size={15} /></button>
                <button type="button" onClick={() => update({ grammar: grammar.filter((_, idx) => idx !== ti) })} className="text-slate-400 hover:text-red-600" title="Xoá cả bảng"><Trash2 size={15} /></button>
              </div>
              {t.heading?.trim() && <p className="mt-1 font-bold">{topicNo}. {t.heading.trim()}</p>}
              {t.title?.trim() && <p className="mb-1 font-bold italic">{t.title.trim()}</p>}
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {t.headers.map((h, hi) => (
                      <th key={hi} className={th} style={{ width: hi === 0 ? "24%" : hi === 1 ? "46%" : "30%" }}>
                        <input
                          value={h}
                          onChange={(e) => setTable({ headers: t.headers.map((x, idx) => (idx === hi ? e.target.value : x)) })}
                          className={`${cellInput} text-center font-semibold`}
                        />
                      </th>
                    ))}
                    <th className="no-print w-20 border-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r, ri) => (
                    <tr key={r.id}>
                      <td className={td}><textarea rows={2} value={r.left} onChange={(e) => setRow(ri, { left: e.target.value })} className={`${cellInput} resize-y font-semibold`} /></td>
                      <td className={td}><textarea rows={2} value={r.right} onChange={(e) => setRow(ri, { right: e.target.value })} className={`${cellInput} resize-y`} /></td>
                      <td className={td}><textarea rows={2} value={r.example} onChange={(e) => setRow(ri, { example: e.target.value })} className={`${cellInput} resize-y`} /></td>
                      <td className="no-print whitespace-nowrap border-0 pl-1">
                        <button type="button" onClick={() => setTable({ rows: moveItem(t.rows, ri, -1) })} className="text-slate-400 hover:text-slate-700" title="Lên"><ChevronUp size={14} /></button>
                        <button type="button" onClick={() => setTable({ rows: moveItem(t.rows, ri, 1) })} className="text-slate-400 hover:text-slate-700" title="Xuống"><ChevronDown size={14} /></button>
                        <button type="button" onClick={() => setTable({ rows: t.rows.filter((_, idx) => idx !== ri) })} className="text-slate-400 hover:text-red-600" title="Xoá dòng"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={() => setTable({ rows: [...t.rows, { id: nextVocabId("g"), left: "", right: "", example: "" }] })}
                className="no-print mt-1 flex items-center gap-1 text-xs text-brand-700 hover:underline"
              >
                <Plus size={13} /> Thêm dòng
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => update({ grammar: [...grammar, buildBlankGrammarTable()] })}
          className="no-print mt-1 flex items-center gap-1 text-xs text-brand-700 hover:underline"
        >
          <Plus size={13} /> Thêm bảng ngữ pháp
        </button>
      </div>
    </div>
  );
}
