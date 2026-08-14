"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Zap, RefreshCw } from "lucide-react";
import { fetchUsageSummaryRequest } from "@/services/apiClient";

/**
 * UsageWidget.jsx
 * Hiển thị mức dùng Gemini API HÔM NAY cho giáo viên/admin - trả lời "hôm nay đã dùng bao
 * nhiêu, có bị hết hạn mức lần nào chưa" TRƯỚC KHI nó chặn hẳn 1 lượt tạo đề quan trọng.
 *
 * ⚠️ CHỦ Ý không hiển thị "còn lại bao nhiêu %" so với hạn mức Google (không có con số đáng
 * tin cậy để so sánh - xem giải thích trong geminiUsageTracker.js). Chỉ hiển thị số liệu THẬT:
 * tổng lượt gọi + số lần bị từ chối do hết hạn mức - đủ để giáo viên/admin nhận biết xu hướng
 * và biết CHẮC khi nào cần thêm key mới, không dựa vào ước tính có thể sai.
 */
export default function UsageWidget() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsageSummaryRequest();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading && !summary) {
    return (
      <div className="no-print rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-400">
        Đang tải mức dùng Gemini hôm nay...
      </div>
    );
  }

  if (error || summary?.unavailable) {
    return (
      <div className="no-print rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-400">
        Chưa có dữ liệu thống kê mức dùng Gemini hôm nay.
      </div>
    );
  }

  if (!summary) return null;

  const hasQuotaErrors = summary.quotaErrors > 0;
  const perKeyEntries = Object.entries(summary.perKey || {});

  return (
    <div
      className={`no-print rounded-lg border p-3 text-xs ${
        hasQuotaErrors ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          {hasQuotaErrors ? (
            <AlertTriangle size={14} className="text-amber-600" />
          ) : (
            <Zap size={14} className="text-brand-600" />
          )}
          Mức dùng Gemini hôm nay
        </div>
        <button
          type="button"
          onClick={load}
          title="Làm mới"
          className="text-slate-400 transition hover:text-slate-600"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      <p className="mt-1.5 text-slate-600">
        <span className="font-semibold text-slate-900">{summary.total}</span> lượt gọi ·{" "}
        {summary.configuredKeyCount} key đang cấu hình
      </p>

      {perKeyEntries.length > 1 && (
        <ul className="mt-1 space-y-0.5 text-slate-500">
          {perKeyEntries.map(([key, count]) => (
            <li key={key}>
              Key {key}: {count} lượt
            </li>
          ))}
        </ul>
      )}

      {hasQuotaErrors && (
        <p className="mt-1.5 font-medium text-amber-800">
          ⚠️ Có {summary.quotaErrors} lần bị từ chối do hết hạn mức hôm nay. Nếu việc tạo đề bị
          gián đoạn, hãy thử lại sau hoặc thêm API key mới vào GEMINI_API_KEYS.
        </p>
      )}

      <p className="mt-1.5 text-slate-400">
        Lưu ý: số "lượt gọi" tính CẢ những lần thử lại tự động khi máy chủ AI quá tải (kể cả thất
        bại), dùng chung cho mọi tính năng - không phải riêng 1 lượt tạo là 1 lượt gọi.
      </p>
    </div>
  );
}
