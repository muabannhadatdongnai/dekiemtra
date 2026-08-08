"use client";

import DocThamBlockView from "./vietnameseBlocks/DocThamBlockView";
import DocThanhTiengBlockView from "./vietnameseBlocks/DocThanhTiengBlockView";
import ChinhTaBlockView from "./vietnameseBlocks/ChinhTaBlockView";
import TapLamVanBlockView from "./vietnameseBlocks/TapLamVanBlockView";
import { listBlocks, BLOCK_KEYS } from "@/data/vietnameseExamBlocks";

/**
 * VietnameseExamPreview.jsx
 * "Người điều phối" hiển thị cho mode thứ 4 "📖 Đề Tiếng Việt Tiểu học" - đúng khuôn
 * QuestionVisual.jsx: duyệt qua danh bạ theo đúng thứ tự A. Đọc -> B. Viết, với mỗi khối ĐÃ CÓ dữ
 * liệu trong `results`, gọi đúng component hiển thị riêng của khối đó. KHÔNG biết và không cần
 * biết bên trong `results[key]` chứa gì - việc đó là trách nhiệm của từng *BlockView.jsx.
 *
 * Thêm khối mới: viết component `XxxBlockView.jsx` riêng, thêm 1 dòng vào BLOCK_VIEWS bên dưới -
 * không sửa gì khác trong file này.
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
          return <View key={blockDef.key} data={data} />;
        })}
      </div>
    </div>
  );
}
