"use client";

import DocThamBlockView from "./vietnameseBlocks/DocThamBlockView";
import DocThanhTiengBlockView from "./vietnameseBlocks/DocThanhTiengBlockView";
import ChinhTaBlockView from "./vietnameseBlocks/ChinhTaBlockView";
import TapLamVanBlockView from "./vietnameseBlocks/TapLamVanBlockView";
import { listBlocks, BLOCK_KEYS } from "@/data/vietnameseExamBlocks";

/**
 * VietnameseExamPreview.jsx
 * "Người điều phối" hiển thị cho mode thứ 4 "📖 Đề Tiếng Việt Tiểu học" - đúng khuôn
 * QuestionVisual.jsx: duyệt qua danh bạ theo đúng thứ tự I. Đọc -> II. Viết, với mỗi khối ĐÃ CÓ dữ
 * liệu trong `results`, gọi đúng component hiển thị riêng của khối đó. KHÔNG biết và không cần
 * biết bên trong `results[key]` chứa gì - việc đó là trách nhiệm của từng *BlockView.jsx.
 *
 * Thêm khối mới: viết component `XxxBlockView.jsx` riêng, thêm 1 dòng vào BLOCK_VIEWS bên dưới -
 * không sửa gì khác trong file này.
 *
 * ================== FIX (đánh số đề - xem comment đầy đủ trong vietnameseExamBlocks.js) ==================
 * File này (người điều phối, DUY NHẤT biết toàn bộ danh sách khối) giờ chịu trách nhiệm in tiêu đề
 * lớn `sectionLabel` ("I. KIỂM TRA ĐỌC"/"II. KIỂM TRA VIẾT") ĐÚNG MỘT LẦN mỗi khi `sectionKey` đổi
 * giữa 2 khối liên tiếp CÓ dữ liệu (bỏ qua khối không được chọn/lỗi) - so vì để từng *BlockView.jsx
 * tự đoán, tránh lặp "A."/"B." như bug cũ. `subLabel` ("1. Đọc thành tiếng", "2. Đọc hiểu"...) vẫn
 * do từng khối tự hiển thị, chỉ khác là LẤY từ danh bạ (props) thay vì hard-code chuỗi trong từng
 * *BlockView.jsx.
 */
const BLOCK_VIEWS = {
  [BLOCK_KEYS.DOC_THAM]: DocThamBlockView,
  [BLOCK_KEYS.DOC_THANH_TIENG]: DocThanhTiengBlockView,
  [BLOCK_KEYS.CHINH_TA]: ChinhTaBlockView,
  [BLOCK_KEYS.TAP_LAM_VAN]: TapLamVanBlockView,
};

export default function VietnameseExamPreview({ results, meta }) {
  const hasAnyResult = results && Object.keys(results).length > 0;

  if (!hasAnyResult) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
        Chưa có dữ liệu. Vui lòng điền thông tin bên trái.
      </div>
    );
  }

  let lastSectionKey = null;

  return (
    <div id="print-area">
      <div className="a4-page">
        <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 16, textTransform: "uppercase" }}>
          ĐỀ KIỂM TRA MÔN TIẾNG VIỆT
        </h1>
        <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 12 }}>
          Lớp {meta?.grade}
          {meta?.examCode ? ` — Mã đề: ${meta.examCode}` : ""}
        </p>

        {listBlocks().map((blockDef) => {
          const data = results[blockDef.key];
          const View = BLOCK_VIEWS[blockDef.key];
          if (!data || !View) return null;

          const showSectionHeader = blockDef.sectionKey !== lastSectionKey;
          const isFirstSection = lastSectionKey === null;
          lastSectionKey = blockDef.sectionKey;

          return (
            <div key={blockDef.key}>
              {showSectionHeader && (
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    margin: isFirstSection ? "8px 0 4px" : "16px 0 4px",
                    textTransform: "uppercase",
                    borderTop: isFirstSection ? "none" : "1px solid #cbd5e1",
                    paddingTop: isFirstSection ? 0 : 10,
                  }}
                >
                  {blockDef.sectionLabel}
                </h2>
              )}
              <View data={data} subLabel={blockDef.subLabel} grade={meta?.grade} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
