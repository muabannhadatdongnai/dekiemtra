"use client";

import { FileDown, Printer } from "lucide-react";
import { exportWorksheetBothVersions } from "@/services/worksheetExportService";
import { exportToPDF } from "@/services/exportService";

/**
 * WorksheetExportActions.jsx
 * Tương tự ExportActions.jsx (đề kiểm tra) nhưng đơn giản hơn: Phiếu bài tập LUÔN có đáp án
 * tin cậy cho các dạng bài sinh bằng code (tinh_nham, so_sanh, day_so...) bất kể giáo viên có
 * bật "Kèm đáp số" lúc tạo hay không (chỉ dạng "giải toán có lời văn" phụ thuộc tuỳ chọn đó) -
 * nên LUÔN xuất đồng thời 2 file (Học sinh + Giáo viên), không cần điều kiện như bên đề kiểm tra.
 *
 * ================== "TỐI ƯU IN ĐEN TRẮNG" (Phiên 23, phản hồi giáo viên dùng in dịch vụ photocopy) ==================
 * Checkbox `bwMode` là 1 CÔNG TẮC HIỂN THỊ/XUẤT FILE thuần tuý (không phải tuỳ chọn lúc TẠO phiếu
 * ở WorksheetForm.jsx) - đặt CẠNH nút xuất vì đây đúng lúc giáo viên cần quyết định "bản sắp in
 * này có cần tối ưu mực đen trắng hay không", có thể bật/tắt qua lại nhiều lần để so sánh ngay
 * trên bản xem trước (khi bật, `onToggleBwMode` báo lên page.js để re-render WorksheetPreview với
 * `bwMode`) mà KHÔNG cần tạo lại phiếu bài tập. Ảnh hưởng đồng thời cả 3 hình thức xuất: web xem
 * trước, "Tải Word" (đọc `bwMode` prop để truyền vào exportWorksheetBothVersions), và "In/Tải PDF"
 * (dùng browser in nguyên trạng bản xem trước, nên tự động thừa hưởng bwMode qua WorksheetPreview,
 * không cần xử lý gì thêm ở đây).
 */
export default function WorksheetExportActions({ worksheet, meta, bwMode = false, onToggleBwMode }) {
  const disabled = !worksheet?.sections?.length;

  function handleWord() {
    exportWorksheetBothVersions({ worksheet, meta, bwMode });
  }

  return (
    <div className="no-print space-y-2">
      <label className="flex w-fit items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={bwMode}
          onChange={(e) => onToggleBwMode?.(e.target.checked)}
        />
        🖨️ Tối ưu in đen trắng (tiết kiệm mực photocopy)
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleWord}
          disabled={disabled}
          className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          <FileDown size={15} />
          Tải Word (2 file: Học sinh + Giáo viên)
        </button>
        <button
          onClick={exportToPDF}
          disabled={disabled}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <Printer size={15} /> In / Tải PDF
        </button>
      </div>
    </div>
  );
}
