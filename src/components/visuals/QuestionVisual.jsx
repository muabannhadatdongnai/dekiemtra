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
 * Nếu không có visualType, trả về null (câu hỏi text thường, không đổi gì).
 * Nếu question.needsScratchSpace, luôn thêm khung kẻ ô nháp bên dưới (độc lập với visualType).
 */
export default function QuestionVisual({ question }) {
  const { visualType, visualData, needsScratchSpace } = question;

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

  if (!visual && !needsScratchSpace) return null;

  return (
    <div className="no-print-break">
      {visual}
      {needsScratchSpace && <ScratchGrid />}
    </div>
  );
}
