"use client";

import { useState } from "react";
import { FileDown, Printer, Loader2 } from "lucide-react";
import { exportToPDF } from "@/services/exportService";

/**
 * ColoringExportActions.jsx
 * - PDF: dùng LẠI window.print() có sẵn (exportToPDF trong exportService.js) - CSS @media print
 *   nhắm #print-area đã áp dụng chung cho mọi tab, không cần code riêng.
 * - PNG: dùng html2canvas chụp ĐÚNG khung .a4-page đang hiển thị trên màn hình (qua pageRef) -
 *   đảm bảo ảnh PNG tải về khớp 100% với những gì phụ huynh thấy trên preview, không cần dựng
 *   lại layout lần 2 bằng canvas thủ công.
 */
export default function ColoringExportActions({ pageRef, disabled, fileName = "trang-to-mau" }) {
  const [exportingPng, setExportingPng] = useState(false);

  async function handleDownloadPng() {
    if (!pageRef?.current) return;
    setExportingPng(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(pageRef.current, {
        scale: 3, // ~ chất lượng đủ nét để in tại nhà, không quá nặng
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileName}.png`;
      link.click();
    } catch (err) {
      console.error("[ColoringExportActions] Lỗi xuất PNG:", err);
      alert("Không thể xuất ảnh PNG, vui lòng thử lại hoặc dùng nút Tải PDF.");
    } finally {
      setExportingPng(false);
    }
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        onClick={handleDownloadPng}
        disabled={disabled || exportingPng}
        className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {exportingPng ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
        Tải ảnh PNG
      </button>
      <button
        onClick={exportToPDF}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        <Printer size={15} /> In / Tải PDF
      </button>
    </div>
  );
}
