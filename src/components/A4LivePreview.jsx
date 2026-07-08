"use client";

import katex from "katex";
import { parseLatexSegments } from "@/services/latexUtils";
import QuestionVisual from "./visuals/QuestionVisual";

/**
 * Render 1 chuỗi nội dung (có thể chứa $...$ hoặc $$...$$) thành React node,
 * dùng KaTeX để hiển thị công thức Toán học trực quan trong khung xem trước A4.
 */
function RichMathText({ text }) {
  const segments = parseLatexSegments(text || "");

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "text") return <span key={i}>{seg.content}</span>;

        let html;
        try {
          html = katex.renderToString(seg.content, {
            displayMode: seg.display,
            throwOnError: false,
            output: "html",
          });
        } catch {
          html = `<span class="text-red-600">$${seg.content}$</span>`;
        }

        const Tag = seg.display ? "div" : "span";
        return <Tag key={i} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </>
  );
}

/**
 * Header chuẩn form Bộ GD&ĐT: 2 bảng
 *  - Bảng trái (30%): ô "Điểm" và ô "Nhận xét của giáo viên"
 *  - Bảng phải (70%): Tên bài kiểm tra, Năm học, Môn - Lớp, Thời gian làm bài
 */
function ExamHeaderTable({ meta }) {
  return (
    <table className="gdt-header-table" cellSpacing="0" cellPadding="0">
      <tbody>
        <tr>
          <td className="gdt-col-left">
            <div className="gdt-score-box">
              <span className="gdt-cell-label">Điểm</span>
            </div>
            <div className="gdt-remark-box">
              <span className="gdt-cell-label">Nhận xét của giáo viên</span>
            </div>
          </td>
          <td className="gdt-col-right">
            <p className="gdt-exam-title">{meta?.title || "PHIẾU KIỂM TRA"}</p>
            <p className="gdt-exam-sub">Năm học: {meta?.academicYear || "................."}</p>
            <p className="gdt-exam-sub">
              Môn: {meta?.subject || "Toán"} &nbsp;-&nbsp; Lớp {meta?.grade || "..."} &nbsp;-&nbsp; Mã đề: {meta?.examCode}
            </p>
            <p className="gdt-exam-sub">Thời gian làm bài: {meta?.duration || "45 phút"}</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function StudentInfoLine({ meta }) {
  return (
    <p className="gdt-student-line">
      Họ và tên: <span className="gdt-dots gdt-dots-name">&nbsp;</span>
      &nbsp;&nbsp;Lớp: <span className="gdt-dots gdt-dots-short">{meta?.className || "\u00A0"}</span>
      &nbsp;&nbsp;Trường: <span className="gdt-dots gdt-dots-long">{meta?.schoolName || "\u00A0"}</span>
    </p>
  );
}

function QuestionBlock({ question, index }) {
  return (
    <div className="exam-question">
      <p>
        <span className="q-index">Câu {index + 1}:</span> <RichMathText text={question.content} />
      </p>
      <QuestionVisual question={question} />
      {question.options?.length > 0 && (
        <ul className="exam-options">
          {question.options.map((opt, j) => (
            <li key={j}>
              <RichMathText text={opt} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RubricPage({ teacherRubric, questions }) {
  if (!teacherRubric?.length) return null;
  const idToIndex = new Map(questions.map((q, i) => [q.id, i + 1]));

  return (
    <div className="a4-page page-break-before">
      <h2 className="text-center text-base font-bold uppercase">Đáp án &amp; Lời giải</h2>
      <p className="mb-4 text-center text-xs italic text-slate-500">Dành cho giáo viên - không phát cho học sinh</p>

      {teacherRubric.map((r, i) => (
        <div className="exam-question" key={r.questionId || i}>
          <p>
            <span className="q-index">Câu {idToIndex.get(r.questionId) ?? "?"}</span> — Đáp án:{" "}
            <strong>{r.correctAnswer}</strong>
          </p>
          {r.detailedSolution && (
            <p className="ml-4 text-[0.95em]">
              <RichMathText text={r.detailedSolution} />
            </p>
          )}
          {r.scoringGuide && (
            <p className="ml-4 text-[0.9em] italic text-slate-600">Thang điểm: {r.scoringGuide}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function A4LivePreview({ examMeta, questions, teacherRubric = [] }) {
  if (!questions?.length) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-400">
        Đề thi sẽ hiển thị xem trước tại đây sau khi tạo.
      </div>
    );
  }

  const tracNghiem = questions.filter((q) => q.type !== "tu_luan");
  const tuLuan = questions.filter((q) => q.type === "tu_luan");

  return (
    <div id="print-area">
      <div className="a4-page">
        <ExamHeaderTable meta={examMeta} />
        <StudentInfoLine meta={examMeta} />

        {tracNghiem.length > 0 && (
          <>
            <h3 className="gdt-section-title">I. TRẮC NGHIỆM</h3>
            {tracNghiem.map((q, i) => (
              <QuestionBlock key={q.id || i} question={q} index={i} />
            ))}
          </>
        )}

        {tuLuan.length > 0 && (
          <>
            <h3 className="gdt-section-title">II. TỰ LUẬN</h3>
            {tuLuan.map((q, i) => (
              <QuestionBlock key={q.id || i} question={q} index={tracNghiem.length + i} />
            ))}
          </>
        )}
      </div>

      <RubricPage teacherRubric={teacherRubric} questions={questions} />
    </div>
  );
}
