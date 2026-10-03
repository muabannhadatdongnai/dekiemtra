"use client";

import { useEffect, useState } from "react";
import { Loader2, BookOpen, FilePlus2 } from "lucide-react";
import { getSubjectsForGrade, getSubjectLabel } from "@/data/config";
import { hasVocabParser } from "@/services/vocabParserRegistry";
import { buildVocabResult, EMPTY_VOCAB_RESULT, nextVocabId, stripSectionLetter } from "@/data/vocabResult";
import { buildLessonSuggestions } from "@/services/vocabLessonSuggest";
import { fetchChaptersRequest, fetchLessonsRequest, fetchVocabOutlineRequest } from "@/services/apiClient";
import { runVocabEnrich } from "@/services/vocabEnrichClient";

/**
 * VocabForm.jsx (Phiên 51 - tab "Soạn từ vựng")
 * Luồng: chọn Môn/Lớp/Tập → bấm chương SGK (đọc Markdown, KHÔNG gọi AI) → tick nhóm từ vựng/ngữ pháp của
 * tiết đang soạn → điền Tuần/Tiết/Trang → "Tạo bản soạn". Từ + nghĩa lấy nguyên văn từ Markdown; phiên
 * âm/loại từ/ví dụ thiếu do AI điền. Phiên 51d: tên bài học + số trang gợi ý từ `chuong_{n}_bai.json` (nút gợi ý).
 * Hiện chỉ Tiếng Anh có bộ đọc (vocabParserRegistry.js) - Tiếng Trung/Nhật làm ở phiên sau.
 */

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// "UNIT 2: MY HOUSE (NGÔI NHÀ CỦA TÔI)" → bỏ phần chú thích tiếng Việt trong ngoặc cuối dòng
function stripVietnameseParen(text) {
  return String(text || "").replace(/\s*\([^)]*[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ][^)]*\)\s*$/i, "").trim();
}

export default function VocabForm({ onGenerated, onPatchResult }) {
  const [grade, setGrade] = useState(6);
  const [volume, setVolume] = useState(1);
  const availableSubjects = getSubjectsForGrade(grade).filter((s) => hasVocabParser(s.value));
  const [subject, setSubject] = useState("Tieng_Anh");

  useEffect(() => {
    if (!availableSubjects.some((s) => s.value === subject)) setSubject(availableSubjects[0]?.value || "Tieng_Anh");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade]);

  const [chapters, setChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");

  const [outline, setOutline] = useState(null); // { chuong, vocabGroups, grammarGroups, supported }
  const [loadingOutlineFor, setLoadingOutlineFor] = useState(null);
  const [outlineError, setOutlineError] = useState("");
  const [pickedVocab, setPickedVocab] = useState([]);
  const [pickedGrammar, setPickedGrammar] = useState([]);
  const [lessonSuggestions, setLessonSuggestions] = useState([]); // gợi ý Bài học + Trang từ chuong_{n}_bai.json
  const [lessonIndexChecked, setLessonIndexChecked] = useState(false);

  const [tuan, setTuan] = useState("");
  const [unit, setUnit] = useState("");
  const [tiet, setTiet] = useState("");
  const [baiHoc, setBaiHoc] = useState("");
  const [trang, setTrang] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingChapters(true);
      setChaptersError("");
      try {
        const data = await fetchChaptersRequest({ grade, subject, volume });
        if (!cancelled) setChapters(data.chapters || []);
      } catch (err) {
        if (!cancelled) {
          setChaptersError(err.message);
          setChapters([]);
        }
      } finally {
        if (!cancelled) setLoadingChapters(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [grade, subject, volume]);

  async function loadChapter(chapter, label) {
    setOutlineError("");
    setError("");
    setLoadingOutlineFor(chapter);
    setLessonSuggestions([]);
    setLessonIndexChecked(false);
    // Phụ lục bài học là tính năng PHỤ: lỗi/thiếu file chỉ làm mất gợi ý, không chặn việc đọc từ vựng.
    fetchLessonsRequest({ grade, subject, volume, chapter })
      .then((d) => setLessonSuggestions(buildLessonSuggestions(d?.lessons)))
      .catch(() => setLessonSuggestions([]))
      .finally(() => setLessonIndexChecked(true));
    try {
      const data = await fetchVocabOutlineRequest({ grade, subject, volume, chapter });
      setOutline(data);
      setPickedVocab((data.vocabGroups || []).map((g) => g.id));
      setPickedGrammar((data.grammarGroups || []).map((g) => g.id));
      setUnit(stripVietnameseParen(data.chuong) || label || "");
      if (!data.supported) setOutlineError("Môn này chưa có bộ đọc từ vựng - bạn vẫn có thể tạo bản soạn trống và tự gõ.");
      else if (!data.vocabGroups?.length && !data.grammarGroups?.length) {
        setOutlineError("Chưa đọc được từ vựng/ngữ pháp trong chương này (Markdown khác định dạng quen thuộc). Bạn có thể tạo bản soạn trống và tự gõ.");
      }
    } catch (err) {
      setOutline(null);
      setOutlineError(err.message);
    } finally {
      setLoadingOutlineFor(null);
    }
  }

  function toggle(list, setList, id) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function buildMeta() {
    return { subject, subjectLabel: getSubjectLabel(subject), languageCode: "en", grade };
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const vocabGroups = (outline?.vocabGroups || []).filter((g) => pickedVocab.includes(g.id));
    const grammarGroups = (outline?.grammarGroups || []).filter((g) => pickedGrammar.includes(g.id));
    if (!vocabGroups.length && !grammarGroups.length) {
      setError("Vui lòng chọn một chương và tick ít nhất 1 nhóm từ vựng/ngữ pháp (hoặc bấm \"Tạo bản soạn trống\").");
      return;
    }
    const firstTitle = vocabGroups[0]?.title || "";
    const firstPage = vocabGroups[0]?.page || grammarGroups[0]?.page || "";
    const result = buildVocabResult({
      header: { tuan, unit, tiet, baiHoc: baiHoc || stripSectionLetter(firstTitle), trang: trang || firstPage },
      vocabGroups,
      grammarGroups,
      meta: buildMeta(),
    });
    onGenerated(result); // hiện bảng NGAY (từ + nghĩa đọc từ Markdown), phiên âm/loại từ thiếu được AI điền ở bước sau
    // Phiên 51b (Hoan góp ý): tự động bổ sung phiên âm/loại từ ngay khi tạo, không bắt bấm nút lần 2.
    runVocabEnrich({ sheetId: result.sheetId, subject, grade, words: result.words, setResult: onPatchResult });
  }

  function handleBlank() {
    onGenerated({
      ...EMPTY_VOCAB_RESULT,
      sheetId: nextVocabId("s"),
      header: { tuan, unit, tiet, baiHoc, trang },
      words: [{ id: nextVocabId("w"), word: "", ipa: "", type: "", meaning: "", example: "" }],
      meta: buildMeta(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Môn / Lớp</p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Môn học">
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
              {availableSubjects.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Lớp">
            <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className={inputClass}>
              {GRADES.map((g) => (
                <option key={g} value={g}>Lớp {g}</option>
              ))}
            </select>
          </Field>
          <Field label="Tập">
            <select value={volume} onChange={(e) => setVolume(Number(e.target.value))} className={inputClass}>
              <option value={1}>Tập 1</option>
              <option value={2}>Tập 2</option>
            </select>
          </Field>
        </div>
        <p className="text-xs text-slate-500">Hiện hỗ trợ Tiếng Anh. Tiếng Trung, Tiếng Nhật sẽ bổ sung ở phiên sau.</p>
      </div>

      <div className="space-y-2 border-b border-slate-100 pb-5">
        <p className="flex items-center gap-1 text-sm font-semibold text-slate-800">
          <BookOpen size={15} /> Chọn Unit/Chương trong SGK
        </p>
        {loadingChapters && <p className="text-xs text-slate-500">Đang tải danh sách chương...</p>}
        {chaptersError && <p className="text-xs text-red-600">{chaptersError}</p>}
        {!loadingChapters && !chaptersError && chapters.length === 0 && (
          <p className="text-xs text-slate-500">Chưa có chương nào của Môn/Lớp/Tập này trong kho SGK.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {chapters.map((c) => (
            <button
              key={c.chapter}
              type="button"
              disabled={loadingOutlineFor !== null}
              onClick={() => loadChapter(c.chapter, c.label || `Chương ${c.chapter}`)}
              className="flex items-center gap-1 rounded-full border border-brand-300 bg-brand-50 px-3 py-1 text-xs text-brand-700 transition hover:bg-brand-100 disabled:opacity-50"
              title="Đọc từ vựng + ngữ pháp từ Markdown SGK (không dùng AI)"
            >
              {loadingOutlineFor === c.chapter && <Loader2 size={12} className="animate-spin" />}
              {c.label || `Chương ${c.chapter}`}
            </button>
          ))}
        </div>
        {outlineError && <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-800">{outlineError}</p>}
      </div>

      {outline && (outline.vocabGroups?.length > 0 || outline.grammarGroups?.length > 0) && (
        <div className="space-y-3 border-b border-slate-100 pb-5">
          <p className="text-sm font-semibold text-slate-800">{stripVietnameseParen(outline.chuong) || "Nội dung chương"}</p>
          {outline.vocabGroups.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Nhóm từ vựng (tick nhóm thuộc tiết này)</p>
              <ul className="space-y-1">
                {outline.vocabGroups.map((g) => (
                  <li key={g.id}>
                    <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
                      <input type="checkbox" className="mt-1" checked={pickedVocab.includes(g.id)} onChange={() => toggle(pickedVocab, setPickedVocab, g.id)} />
                      <span>
                        {g.title} <span className="text-xs text-slate-500">({g.words.length} từ)</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {outline.grammarGroups.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Nhóm ngữ pháp</p>
              <ul className="space-y-1">
                {outline.grammarGroups.map((g) => (
                  <li key={g.id}>
                    <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
                      <input type="checkbox" className="mt-1" checked={pickedGrammar.includes(g.id)} onChange={() => toggle(pickedGrammar, setPickedGrammar, g.id)} />
                      <span>
                        {g.title} <span className="text-xs text-slate-500">({g.rows.length} dòng)</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Phần đầu bản soạn</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tuần"><input value={tuan} onChange={(e) => setTuan(e.target.value)} className={inputClass} placeholder="VD: Week 3" /></Field>
          <Field label="Tiết"><input value={tiet} onChange={(e) => setTiet(e.target.value)} className={inputClass} placeholder="VD: Period 8" /></Field>
        </div>
        <Field label="Unit"><input value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass} placeholder="VD: Unit 2: My house" /></Field>
        {lessonSuggestions.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Gợi ý Bài học &amp; Trang (từ phụ lục SGK)</p>
            <div className="flex flex-wrap gap-2">
              {lessonSuggestions.map((l) => {
                const active = baiHoc === l.baiHoc && (!l.trang || trang === l.trang);
                return (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => {
                      setBaiHoc(l.baiHoc);
                      if (l.trang) setTrang(l.trang);
                    }}
                    className={`rounded-full border px-3 py-1 text-xs transition ${active ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}
                    title={l.trang ? `Điền Bài học "${l.baiHoc}" và Trang ${l.trang}` : `Điền Bài học "${l.baiHoc}" (phụ lục chưa ghi số trang)`}
                  >
                    {l.label}{l.trang ? ` · tr. ${l.trang}` : ""}
                  </button>
                );
              })}
            </div>
            {lessonSuggestions.some((l) => !l.trang) && (
              <p className="mt-1 text-xs text-slate-500">Bài nào chưa có số trang trong phụ lục thì ô Trang SGK để bạn tự nhập.</p>
            )}
          </div>
        )}
        {outline && lessonIndexChecked && lessonSuggestions.length === 0 && (
          <p className="text-xs text-slate-500">Chương này chưa có phụ lục bài học (chuong_N_bai.json) nên chưa có gợi ý tên bài/trang - bạn gõ tay bên dưới.</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bài học"><input value={baiHoc} onChange={(e) => setBaiHoc(e.target.value)} className={inputClass} placeholder="VD: Getting started" /></Field>
          <Field label="Trang SGK"><input value={trang} onChange={(e) => setTrang(e.target.value)} className={inputClass} placeholder="VD: 16, 17" /></Field>
        </div>
      </div>

      {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700">
          Tạo bản soạn
        </button>
        <button type="button" onClick={handleBlank} className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
          <FilePlus2 size={15} /> Tạo bản soạn trống
        </button>
      </div>
    </form>
  );
}
