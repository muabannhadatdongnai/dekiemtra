"use client";

/**
 * HelpGuideView.jsx
 * =============================================================================
 * Giao diện tab "❓ Hướng dẫn sử dụng" (mode MODES.HELP trong page.js).
 *
 * NGUYÊN TẮC: component này CHỈ LO RENDER (accordion mở/đóng từng mục, ô tìm nhanh, nút bật/tắt
 * "ghi chú kỹ thuật"). TOÀN BỘ nội dung chữ (mô tả, các bước dùng, tính năng, lưu ý, ghi chú dev)
 * đều lấy từ src/data/helpGuideContent.js - muốn sửa/thêm nội dung hướng dẫn thì sửa file dữ liệu
 * đó, KHÔNG sửa JSX trong file này (trừ khi cần đổi CÁCH HIỂN THỊ, không phải NỘI DUNG).
 *
 * Khác với 6 tab chức năng còn lại: tab này KHÔNG gọi AI, KHÔNG có Form nhập liệu, KHÔNG cần
 * layout 2 cột trái-phải, và KHÔNG tham gia in ấn (không dùng id="print-area") - vì vậy được
 * page.js render TOÀN CHIỀU RỘNG thay vì đặt trong khung <aside>/<section> như các tab khác.
 * =============================================================================
 */

import { useMemo, useState } from "react";
import {
  BookOpen,
  NotebookPen,
  PencilRuler,
  BookText,
  Compass,
  FileCheck2,
  ClipboardList,
  Settings2,
  ChevronDown,
  Search,
  Code2,
  Info,
  ListChecks,
} from "lucide-react";
import { GUIDE_SECTIONS } from "@/data/helpGuideContent";

// Ánh xạ tên icon (chuỗi, khai báo trong helpGuideContent.js) -> component icon thật của
// lucide-react. Khai báo tách riêng ở đây (thay vì import động) để không phải cài thêm gì và để
// dữ liệu (helpGuideContent.js) không phụ thuộc trực tiếp vào thư viện UI.
const ICONS = {
  BookOpen,
  NotebookPen,
  PencilRuler,
  BookText,
  Compass,
  FileCheck2,
  ClipboardList,
  Settings2,
};

function matchesQuery(section, query) {
  if (!query) return true;
  const haystack = [
    section.title,
    section.description,
    section.audienceSummary,
    ...(section.steps || []),
    ...(section.features || []).flatMap((f) => [f.name, f.detail]),
    ...(section.notes || []),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function SectionCard({ section, isOpen, onToggle, showDevNotes }) {
  const Icon = ICONS[section.icon] || Info;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Icon size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {section.emoji} {section.title}
            </p>
            <p className="text-xs text-slate-500">{section.audienceSummary}</p>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`flex-none text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-5 border-t border-slate-100 px-5 py-5">
          {section.description && (
            <p className="text-sm leading-relaxed text-slate-700">{section.description}</p>
          )}

          {section.steps?.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <ListChecks size={16} className="text-brand-600" /> Các bước sử dụng
              </p>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
                {section.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {section.features?.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800">Tính năng chi tiết</p>
              <div className="space-y-3">
                {section.features.map((feature, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-900">{feature.name}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{feature.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.notes?.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="mb-1.5 text-sm font-semibold text-amber-800">Lưu ý</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-amber-800">
                {section.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {showDevNotes && section.devNotes && (
            <div className="rounded-lg border border-slate-300 bg-slate-900 p-3 text-slate-100">
              <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-100">
                <Code2 size={15} /> Ghi chú kỹ thuật (dành cho lập trình viên/AI phiên sau)
              </p>
              <p className="mb-2 text-xs leading-relaxed text-slate-300">{section.devNotes.summary}</p>
              <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-300">
                {section.devNotes.pointers.map((p, i) => (
                  <li key={i} className="whitespace-pre-line">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HelpGuideView() {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState(() => new Set([GUIDE_SECTIONS[0]?.id]));
  const [showDevNotes, setShowDevNotes] = useState(false);

  const filtered = useMemo(
    () => GUIDE_SECTIONS.filter((s) => matchesQuery(s, query)),
    [query]
  );

  function toggle(id) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h1 className="text-lg font-semibold text-slate-900">📚 Hướng dẫn sử dụng</h1>
        <p className="mt-1 text-sm text-slate-600">
          Giải thích các chức năng và cách dùng từng công cụ trong hệ thống. Bấm vào từng mục để mở
          rộng chi tiết.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm nhanh (VD: 'lời dẫn', 'phong cách', 'gói chủ đề'...)"
              className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <label className="flex flex-none items-center gap-2 whitespace-nowrap rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showDevNotes}
              onChange={(e) => setShowDevNotes(e.target.checked)}
            />
            Hiện ghi chú kỹ thuật
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            Không tìm thấy mục nào khớp với &quot;{query}&quot;.
          </p>
        )}
        {filtered.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            isOpen={openIds.has(section.id)}
            onToggle={() => toggle(section.id)}
            showDevNotes={showDevNotes}
          />
        ))}
      </div>
    </div>
  );
}
