"use client";

import { useState, useRef } from "react";
import { Loader2, Sparkles, Upload, ImagePlus, X } from "lucide-react";
import { generateColoringPageRequest } from "@/services/apiClient";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

export const DEFAULT_COLORING_TITLE = "Tô Màu Thật Vui";
export const DEFAULT_COLORING_SUBTITLE = "Con hãy tô màu thật vui và đẹp nhé!";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function ColoringPageForm({ onGenerated }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState(DEFAULT_COLORING_TITLE);
  const [subtitle, setSubtitle] = useState(DEFAULT_COLORING_SUBTITLE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Vui lòng chọn 1 file ảnh (jpg, png...).");
      return;
    }
    if (selected.size > MAX_IMAGE_BYTES) {
      setError("Ảnh quá lớn (tối đa 5MB). Vui lòng chọn ảnh nhỏ hơn.");
      return;
    }

    setError("");
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function handleRemoveImage() {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!file) {
      setError("Vui lòng chọn 1 ảnh (nhân vật hoặc ảnh gia đình) trước.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await generateColoringPageRequest({ image: file });
      onGenerated({
        lineArtImage: data.lineArtImage,
        originalImage: data.originalImage,
        palette: data.palette,
        title: title.trim() || DEFAULT_COLORING_TITLE,
        subtitle: subtitle.trim() || DEFAULT_COLORING_SUBTITLE,
      });
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">1. Chọn ảnh (nhân vật hoặc ảnh gia đình)</p>

        {!previewUrl ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-slate-500 transition hover:border-brand-400 hover:bg-brand-50"
          >
            <ImagePlus size={28} />
            <span className="text-sm">Bấm để chọn ảnh (JPG, PNG - tối đa 5MB)</span>
          </button>
        ) : (
          <div className="relative w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Ảnh đã chọn" className="max-h-56 rounded-lg border border-slate-200 object-contain" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-slate-500 shadow ring-1 ring-slate-200 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">2. Tiêu đề tập tô màu</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={DEFAULT_COLORING_TITLE}
          className={inputClass}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">3. Lời nhắn nhỏ cho bé</p>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder={DEFAULT_COLORING_SUBTITLE}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-slate-400">Để trống sẽ dùng nội dung mặc định ở trên.</p>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !file}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Đang vẽ tranh tô màu...
          </>
        ) : (
          <>
            <Sparkles size={16} /> Tạo tranh tô màu
          </>
        )}
      </button>

      {loading && (
        <p className="text-center text-xs text-slate-400">
          Có thể mất 10-30 giây tuỳ tình trạng máy chủ Google, vui lòng chờ chút nhé.
        </p>
      )}
    </div>
  );
}
