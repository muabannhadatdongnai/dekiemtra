import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { Document, Packer } from "docx";
import {
  computeActivityTimeline,
  computeMultiPeriodTimeline,
  getActivityLabels,
} from "../src/data/lessonPlanTemplates.js";
import { buildLessonPlanPrompt } from "../src/data/lessonPlanPromptTemplates.js";
import { buildLessonPlanDocxSections } from "../src/services/lessonPlanExportService.js";

/**
 * lessonPlanFixes.test.js
 * Test tự động cho 4 vấn đề giáo viên phản ánh (xem PROJECT_SUMMARY.md):
 * a) tổng thời lượng các hoạt động lệch với số phút khai báo + thiếu ranh giới giữa các tiết
 * b) tên hoạt động "Khám phá" chưa đúng bản chất cho bài ôn tập
 * c) hoạt động "Khởi động" quá dài
 * d) thiếu nội dung cụ thể của "Phiếu học tập" đính kèm
 */

test("computeActivityTimeline: TỔNG số phút LUÔN khớp chính xác số tiết x số phút/tiết (sửa lỗi 79 != 80)", () => {
  // Đây CHÍNH XÁC là trường hợp giáo viên báo lỗi: Lớp 5 (40 phút/tiết) x 2 tiết = 80 phút,
  // nhưng bản cũ (Math.round độc lập từng hoạt động) cho ra 11+34+23+11 = 79.
  for (const [soTiet, grade] of [[2, 5], [1, 1], [3, 3], [4, 2], [1, "MAM_NON"]]) {
    const timeline = computeActivityTimeline(soTiet, grade);
    const sum = timeline.reduce((s, a) => s + a.minutes, 0);
    const expectedPerPeriod = grade === "MAM_NON" ? 30 : grade === 1 || grade === 2 ? 35 : 40;
    assert.equal(sum, expectedPerPeriod * soTiet, `soTiet=${soTiet}, grade=${grade}: tổng phải khớp chính xác`);
  }
});

test("computeMultiPeriodTimeline: MỖI TIẾT tự đủ đúng số phút/tiết, và Khởi động không vượt trần hợp lý", () => {
  const periods = computeMultiPeriodTimeline(3, 5, "bai_moi"); // Lớp 5 = 40 phút/tiết
  assert.equal(periods.length, 3, "phải có đúng 3 tiết");
  for (const p of periods) {
    const sum = p.segments.reduce((s, s2) => s + s2.minutes, 0);
    assert.equal(sum, 40, `Tiết ${p.period} phải tự đủ đúng 40 phút`);
    const khoiDong = p.segments.find((s) => s.key === "khoi_dong");
    assert.ok(khoiDong.minutes <= 7, `Khởi động Tiết ${p.period} không được vượt quá 7 phút (thực tế: ${khoiDong.minutes})`);
  }
  // Chỉ tiết đầu có "Khám phá", chỉ tiết cuối có "Vận dụng" - đúng tinh thần giáo viên đề xuất.
  assert.ok(periods[0].segments.some((s) => s.key === "kham_pha"), "Tiết 1 phải có hoạt động hình thành/hệ thống hoá kiến thức");
  assert.ok(!periods[1].segments.some((s) => s.key === "kham_pha"), "Tiết giữa KHÔNG nên có Khám phá");
  assert.ok(periods[2].segments.some((s) => s.key === "van_dung"), "Chỉ tiết CUỐI mới có Vận dụng");
  assert.ok(!periods[0].segments.some((s) => s.key === "van_dung"), "Tiết 1 KHÔNG nên có Vận dụng");
  // Tiết 2, 3 phải là "Khởi động lại" (không lặp y hệt khởi động chính của Tiết 1).
  assert.equal(periods[1].segments.find((s) => s.key === "khoi_dong").label, "Khởi động lại");
  assert.equal(periods[0].segments.find((s) => s.key === "khoi_dong").label, "Khởi động");
});

test("computeMultiPeriodTimeline: soTiet=1 vẫn hoạt động bình thường (không có ranh giới thừa)", () => {
  const periods = computeMultiPeriodTimeline(1, 3, "bai_moi");
  assert.equal(periods.length, 1);
  assert.equal(periods[0].segments.reduce((s, a) => s + a.minutes, 0), 40);
});

test('getActivityLabels: "loại bài" ôn tập đổi tên hoạt động Khám phá, bài mới thì giữ nguyên', () => {
  const baiMoi = getActivityLabels("bai_moi");
  const onTap = getActivityLabels("on_tap");
  assert.equal(baiMoi.find((a) => a.key === "kham_pha").label, "Khám phá (Hình thành kiến thức mới)");
  assert.equal(onTap.find((a) => a.key === "kham_pha").label, "Hệ thống hoá kiến thức");
  // Các hoạt động còn lại không đổi tên theo lessonType.
  assert.equal(baiMoi.find((a) => a.key === "khoi_dong").label, onTap.find((a) => a.key === "khoi_dong").label);
});

test("buildLessonPlanPrompt: bài nhiều tiết PHẢI yêu cầu AI gắn trường \"tiet\" và có hướng dẫn ranh giới tiết", () => {
  const prompt = buildLessonPlanPrompt({
    tenBai: "Test",
    grade: 5,
    subject: "Toan",
    soTiet: 2,
    noiDungCotLoi: "abc",
    lessonType: "on_tap",
  });
  assert.match(prompt, /"tiet"/, "prompt phải yêu cầu trường tiet khi có từ 2 tiết trở lên");
  assert.match(prompt, /RANH GIỚI GIỮA CÁC TIẾT/);
  assert.match(prompt, /Hệ thống hoá kiến thức/, "phải dùng tên hoạt động theo lessonType=on_tap");
  assert.doesNotMatch(prompt, /"ten": "Khám phá \(Hình thành kiến thức mới\)"/, "KHÔNG được còn tên 'Khám phá' cứng khi đã đổi lessonType");
});

test("buildLessonPlanPrompt: bài 1 tiết KHÔNG yêu cầu trường tiet (không tạo phức tạp thừa)", () => {
  const prompt = buildLessonPlanPrompt({
    tenBai: "Test",
    grade: 3,
    subject: "Toan",
    soTiet: 1,
    noiDungCotLoi: "abc",
  });
  assert.doesNotMatch(prompt, /RANH GIỚI GIỮA CÁC TIẾT/);
});

test('buildLessonPlanPrompt: KHÔNG được sót "$" hoặc "~" trong QUY TẮC BẮT BUỘC dù môn Toán', () => {
  const prompt = buildLessonPlanPrompt({
    tenBai: "Test",
    grade: 5,
    subject: "Toan",
    soTiet: 1,
    noiDungCotLoi: "abc",
  });
  assert.match(prompt, /TUYỆT ĐỐI KHÔNG dùng cú pháp LaTeX/);
});

test("buildLessonPlanDocxSections: docx nhiều tiết CÓ ranh giới 'Hết Tiết', KHÔNG còn ký tự \\n thô, có phần Phiếu học tập", async () => {
  const lessonPlan = {
    tenBai: "Ôn tập số tự nhiên",
    yeuCauCanDat: { kienThuc: ["a"], nangLuc: ["b"], phamChat: ["c"] },
    doDungDayHoc: { giaoVien: ["Máy chiếu"], hocSinh: ["SGK"] },
    hoatDong: [
      {
        ten: "Khởi động",
        mucTieu: "Tạo hứng thú",
        tienTrinh: [
          { tiet: 1, hoatDongGVHS: "GV tổ chức trò chơi.\n- Chia nhóm\n- Phát thẻ", sanPhamDuKien: "HS hào hứng" },
          { tiet: 2, hoatDongGVHS: "GV cho HS khởi động lại nhanh", sanPhamDuKien: "HS nhớ lại bài cũ" },
        ],
      },
      {
        ten: "Hệ thống hoá kiến thức",
        mucTieu: "Ôn kiến thức",
        tienTrinh: [{ tiet: 1, hoatDongGVHS: "GV hệ thống hoá", sanPhamDuKien: "HS nắm lại" }],
      },
      {
        ten: "Luyện tập",
        mucTieu: "Củng cố",
        tienTrinh: [
          { tiet: 1, hoatDongGVHS: "Bài 1, 2", sanPhamDuKien: "HS làm đúng" },
          { tiet: 2, hoatDongGVHS: "Bài 3, 4", sanPhamDuKien: "HS làm đúng" },
        ],
      },
      {
        ten: "Vận dụng",
        mucTieu: "Vận dụng thực tế",
        tienTrinh: [{ tiet: 2, hoatDongGVHS: "HS vận dụng vào thực tế", sanPhamDuKien: "HS hoàn thành" }],
      },
    ],
    phieuHocTap: {
      tieuDe: "Phiếu học tập số 1",
      huongDan: "Em hãy hoàn thành các bài tập sau",
      baiTap: ["Viết số 504842", "So sánh 504842 và 504824"],
    },
  };
  const meta = { tenBai: "Ôn tập số tự nhiên", grade: 5, subject: "Toan", soTiet: 2, columnMode: "one_column", lessonType: "on_tap" };

  const children = buildLessonPlanDocxSections({ lessonPlan, timeline: [], meta });
  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);

  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file("word/document.xml").async("string");

  assert.match(xml, /Hết Tiết 1/, "phải có ranh giới hết Tiết 1 trong file Word");
  assert.match(xml, /PHỤ LỤC: Phiếu học tập số 1/, "phải có phụ lục Phiếu học tập trong file Word");
  assert.ok(!xml.includes("\\n"), "KHÔNG được còn ký tự \\n thô trong XML (phải là <w:br/> thật)");
  assert.match(xml, /<w:br\/>/, "phải có ít nhất 1 <w:br/> thật cho nội dung nhiều dòng");
  assert.match(xml, /Bước 1:/);
  assert.match(xml, /Bước 2:/);
});

test("buildLessonPlanDocxSections: bài 1 tiết KHÔNG chèn ranh giới 'Hết Tiết' thừa", async () => {
  const lessonPlan = {
    tenBai: "Bài test 1 tiết",
    yeuCauCanDat: {},
    doDungDayHoc: {},
    hoatDong: [
      { ten: "Khởi động", tienTrinh: [{ tiet: 1, hoatDongGVHS: "A", sanPhamDuKien: "B" }] },
      { ten: "Khám phá", tienTrinh: [{ tiet: 1, hoatDongGVHS: "A", sanPhamDuKien: "B" }] },
    ],
  };
  const meta = { grade: 3, soTiet: 1, columnMode: "one_column" };
  const children = buildLessonPlanDocxSections({ lessonPlan, timeline: [], meta });
  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);
  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file("word/document.xml").async("string");
  assert.ok(!xml.includes("Hết Tiết"), "bài 1 tiết không được có ranh giới tiết");
});
