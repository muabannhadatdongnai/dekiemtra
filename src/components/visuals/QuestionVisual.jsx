"use client";

import VerticalArithmetic from "./VerticalArithmetic";
import NumberTriangle from "./NumberTriangle";
import BarModel from "./BarModel";
import VisualCounting from "./VisualCounting";
import ScratchGrid from "./ScratchGrid";
import { VISUAL_TYPES } from "@/data/visualSchemas";

/**
 * QuestionVisual.jsx
 * Dispatcher: đọc question.visualType + question.visualData và render đúng component minh hoạ.
 * Nếu không có visualType, trả về null phần hình vẽ (câu hỏi text thường, không đổi gì).
 *
 * ⚠️ KHUNG KẺ Ô NHÁP: KHÔNG dựa vào AI tự quyết định "needsScratchSpace" nữa (không đáng tin cậy -
 * AI hay quên gắn cờ này cho câu tự luận lý thuyết/giải thích, khiến học sinh không có chỗ viết
 * bài). Thay vào đó, hệ thống TỰ ĐỘNG thêm khung nháp cho MỌI câu tự luận, trừ trường hợp câu đã
 * có sẵn chỗ tính toán riêng (vertical_arithmetic đã có hàng trống để đặt tính).
 */
export default function QuestionVisual({ question }) {
  const { visualType, visualData, needsScratchSpace, type } = question;

  let visual = null;
  if (visualType && visualData) {
    switch (visualType) {
      case VISUAL_TYPES.VERTICAL_ARITHMETIC:
        visual = <VerticalArithmetic {...visualData} />;
        break;
      case VISUAL_TYPES.NUMBER_TRIANGLE:
        visual = <NumberTriangle {...visualData} />;
        break;
      case VISUAL_TYPES.BAR_MODEL:
        visual = <BarModel {...visualData} />;
        break;
      case VISUAL_TYPES.VISUAL_COUNTING:
        visual = <VisualCounting {...visualData} />;
        break;
      default:
        visual = null;
    }
  }

  const autoScratchForEssay = type === "tu_luan" && visualType !== VISUAL_TYPES.VERTICAL_ARITHMETIC;
  const showScratch = needsScratchSpace || autoScratchForEssay;

  if (!visual && !showScratch) return null;

  return (
    <div className="no-print-break">
      {visual}
      {showScratch && <ScratchGrid />}
    </div>
  );
}
