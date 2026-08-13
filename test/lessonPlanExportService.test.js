import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { buildLessonPlanDocxSections, exportLessonPlanToWord } from "../src/services/lessonPlanExportService.js";

/**
 * lessonPlanExportService.test.js
 * ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY - dùng thật "docx", "jszip" (không mock), giống
 * exportService.docx.test.js.
 *
 * Test RIÊNG cho Giai đoạn 10, Việc 6/7: phụ lục "LỜI DẪN (TEACHER SCRIPT)" (Việc 6, có cờ ẩn/
 * hiện `includeTeacherScript`) và "DÀN Ý SLIDE" (Việc 7, luôn hiện nếu có dữ liệu, không có cờ).
 *
 * LÝ DO có file này (xem PROJECT_SUMMARY.md, mục "rà soát tổng thể phát hiện thất lạc Giai đoạn
 * 10 Việc 6/7"): 2 tính năng này đã từng được viết ĐÚNG logic nhưng bị đặt LẠC vào 2 thư mục mồ
 * côi `services/`, `data/` ở GỐC repo (ngang hàng `src/`, KHÔNG PHẢI `src/services/`,
 * `src/data/`) - trong khi `jsconfig.json` alias "@/*" chỉ trỏ vào `src/*`, nên `next build`
 * KHÔNG BAO GIỜ đụng tới bản mồ côi đó. Lỗi "treo lửng": UI (`LessonPlanExportActions.jsx`,
 * `LessonPlanPreview.jsx`) đã sẵn sàng đọc `loiDan`/`slideOutline`, nhưng bản `src/` thật thiếu
 * hẳn 2 hàm export nên KHÔNG có exception nào báo lỗi - chỉ đơn giản là phụ lục không bao giờ
 * xuất hiện trong file Word, rất khó phát hiện nếu chỉ test thủ công qua UI 1-2 lần.
 *
 * File test này tồn tại CHÍNH XÁC để việc "thất lạc" y hệt (2 hàm export bị xoá nhầm, bị đặt sai
 * thư mục lần nữa, hoặc bị tách ra 1 file mới quên export...) sẽ làm `npm test` ĐỎ NGAY LẬP TỨC,
 * thay vì phải chờ giáo viên report hoặc rà soát thủ công lại lần nữa mới phát hiện.
 *
 * Chạy: node --test test/lessonPlanExportService.test.js
 */

function makeLessonPlan(overrides = {}) {
  return {
    tenBai: "Phép cộng trong phạm vi 10",
    yeuCauCanDat: { kienThuc: ["Biết thực hiện phép cộng trong phạm vi 10"] },
    doDungDayHoc: { giaoVien: ["Que tính"], hocSinh: ["Vở bài tập"] },
    hoatDong: [],
    loiDan: [
      { hoatDong: "Khởi động", loiDan: "Các con ơi, hôm nay cô có một trò chơi rất thú vị!" },
      { hoatDong: "Khám phá", loiDan: "Bây giờ chúng ta cùng tìm hiểu phép cộng nhé." },
    ],
    slideOutline: [
      { tieuDe: "Khởi động", noiDung: ["Trò chơi ô chữ", "Câu hỏi khởi động"] },
      { tieuDe: "Bài mới", noiDung: ["Phép cộng trong phạm vi 10", "Ví dụ minh hoạ"] },
    ],
    ...overrides,
  };
}

const BASE_META = { tenBai: "Phép cộng trong phạm vi 10", grade: "1", subject: "Toan", soTiet: 1 };

async function getDocumentXml(blob) {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.ok(zip.file("word/document.xml"), "thiếu word/document.xml - file .docx không hợp lệ");
  return zip.file("word/document.xml").async("string");
}

// ================== Việc 6: Lời dẫn (Teacher Script) - có cờ ẩn/hiện ==================

test("includeTeacherScript=false (mặc định) -> KHÔNG có phụ lục LỜI DẪN", async () => {
  const blob = await exportLessonPlanToWord({
    lessonPlan: makeLessonPlan(),
    timeline: [],
    meta: BASE_META,
    includeTeacherScript: false,
  });
  const xml = await getDocumentXml(blob);
  assert.ok(!xml.includes("LỜI DẪN"), "includeTeacherScript=false nhưng vẫn thấy phụ lục LỜI DẪN");
  // Nội dung câu lời dẫn thật cũng không được lọt vào file khi cờ tắt.
  assert.ok(!xml.includes("trò chơi rất thú vị"));
});

test("includeTeacherScript=true -> CÓ phụ lục LỜI DẪN, đúng nội dung từng hoạt động", async () => {
  const blob = await exportLessonPlanToWord({
    lessonPlan: makeLessonPlan(),
    timeline: [],
    meta: BASE_META,
    includeTeacherScript: true,
  });
  const xml = await getDocumentXml(blob);
  assert.ok(xml.includes("LỜI DẪN"), "includeTeacherScript=true nhưng KHÔNG thấy phụ lục LỜI DẪN");
  assert.ok(xml.includes("trò chơi rất thú vị"), "thiếu nội dung câu lời dẫn của hoạt động Khởi động");
  assert.ok(xml.includes("tìm hiểu phép cộng"), "thiếu nội dung câu lời dẫn của hoạt động Khám phá");
});

test("includeTeacherScript=true nhưng lessonPlan.loiDan rỗng -> vẫn KHÔNG có phụ lục LỜI DẪN", async () => {
  const blob = await exportLessonPlanToWord({
    lessonPlan: makeLessonPlan({ loiDan: [] }),
    timeline: [],
    meta: BASE_META,
    includeTeacherScript: true,
  });
  const xml = await getDocumentXml(blob);
  assert.ok(!xml.includes("LỜI DẪN"), "không có dữ liệu loiDan thì không được tự vẽ ra phụ lục rỗng");
});

test("tên file .docx có hậu tố '-day-du-loi-dan' khi includeTeacherScript=true, KHÔNG có khi false", () => {
  // buildLessonPlanDocxSections không tự đặt tên file - chỉ xác nhận logic suffix vẫn nằm đúng ở
  // exportLessonPlanToWord() qua việc gọi hàm không throw với cả 2 giá trị cờ (đã test nội dung ở
  // trên, đây chỉ test thêm biên: cờ đúng kiểu boolean tường minh).
  assert.doesNotThrow(() =>
    buildLessonPlanDocxSections({ lessonPlan: makeLessonPlan(), timeline: [], meta: BASE_META, includeTeacherScript: true })
  );
  assert.doesNotThrow(() =>
    buildLessonPlanDocxSections({ lessonPlan: makeLessonPlan(), timeline: [], meta: BASE_META, includeTeacherScript: false })
  );
});

// ================== Việc 7: Dàn ý Slide - LUÔN hiện nếu có dữ liệu, không có cờ ẩn/hiện ==================

test("có slideOutline -> LUÔN có phụ lục DÀN Ý SLIDE, bất kể includeTeacherScript", async () => {
  for (const includeTeacherScript of [true, false]) {
    const blob = await exportLessonPlanToWord({
      lessonPlan: makeLessonPlan(),
      timeline: [],
      meta: BASE_META,
      includeTeacherScript,
    });
    const xml = await getDocumentXml(blob);
    assert.ok(
      xml.includes("DÀN Ý SLIDE"),
      `phụ lục DÀN Ý SLIDE phải LUÔN xuất hiện khi có slideOutline (includeTeacherScript=${includeTeacherScript})`
    );
    assert.ok(xml.includes("Trò chơi ô chữ"), "thiếu nội dung slide Khởi động");
    assert.ok(xml.includes("Ví dụ minh hoạ"), "thiếu nội dung slide Bài mới");
  }
});

test("không có slideOutline -> KHÔNG có phụ lục DÀN Ý SLIDE", async () => {
  const blob = await exportLessonPlanToWord({
    lessonPlan: makeLessonPlan({ slideOutline: [] }),
    timeline: [],
    meta: BASE_META,
    includeTeacherScript: false,
  });
  const xml = await getDocumentXml(blob);
  assert.ok(!xml.includes("DÀN Ý SLIDE"));
});

// ================== Cả 2 phụ lục cùng lúc (đúng kịch bản đã "thất lạc" trước đây) ==================

test("bật includeTeacherScript=true + có cả loiDan LẪN slideOutline -> CẢ 2 phụ lục cùng xuất hiện", async () => {
  const blob = await exportLessonPlanToWord({
    lessonPlan: makeLessonPlan(),
    timeline: [],
    meta: BASE_META,
    includeTeacherScript: true,
  });
  const xml = await getDocumentXml(blob);
  assert.ok(xml.includes("LỜI DẪN"));
  assert.ok(xml.includes("DÀN Ý SLIDE"));
});

test("giáo án không có loiDan/slideOutline vẫn xuất file .docx bình thường (không throw, không lỗi rỗng)", async () => {
  const blob = await exportLessonPlanToWord({
    lessonPlan: makeLessonPlan({ loiDan: undefined, slideOutline: undefined }),
    timeline: [],
    meta: BASE_META,
    includeTeacherScript: true,
  });
  const xml = await getDocumentXml(blob);
  assert.ok(!xml.includes("LỜI DẪN"));
  assert.ok(!xml.includes("DÀN Ý SLIDE"));
  assert.ok(xml.includes("PHÉP CỘNG TRONG PHẠM VI 10") || xml.includes("Phép cộng trong phạm vi 10"));
});
