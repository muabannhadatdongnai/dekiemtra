import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getActivityLabels,
  computeMultiPeriodTimeline,
  computeActivityTimeline,
} from "../src/data/lessonPlanTemplates.js";
import { buildLessonPlanPrompt } from "../src/data/lessonPlanPromptTemplates.js";
import {
  buildEnglishLessonPlanDocxBlob,
  printEnglishLessonPlan,
} from "../src/services/englishLessonPlanExportService.js";
import JSZip from "jszip";

/**
 * lessonPlanPhien36.test.js
 * Test cho các fix của Phiên 36 (xem PROJECT_SUMMARY.md):
 * a) getActivityLabels() trả về ĐÚNG NGÔN NGỮ khi truyền languageCode="en" (root cause của "hạt
 *    sạn tiếng Việt" trong tiêu đề hoạt động của giáo án môn Tiếng Anh).
 * b) buildLessonPlanPrompt() cho môn Tiếng Anh KHÔNG còn ép AI dùng tên hoạt động tiếng Việt
 *    ("Khởi động"/"Luyện tập") trong đoạn "structureRule"/"stepClarityRule" - và ép ĐÚNG nhãn STEM
 *    tiếng Anh khi tích hợp STEM bật.
 * c) englishLessonPlanExportService.js render đủ 7 tích hợp còn thiếu (Checklist NL-PC, STEM,
 *    Timeline nhiều tiết, Bài tập phân hoá, Phiếu học tập, Lời dẫn, Slide Outline).
 * d) printHtmlDocument() không còn dùng "noopener,noreferrer" (lỗi khiến window.open() luôn trả
 *    về null theo đặc tả trình duyệt, làm nút "In/Tải PDF" luôn báo lỗi popup-blocked).
 */

test("getActivityLabels: languageCode='en' -> 4 nhãn hoạt động chuẩn bằng tiếng Anh", () => {
  const labels = getActivityLabels("bai_moi", [], "en");
  assert.equal(labels.find((a) => a.key === "khoi_dong").label, "Warm-up");
  assert.equal(labels.find((a) => a.key === "kham_pha").label, "Presentation (New Knowledge)");
  assert.equal(labels.find((a) => a.key === "luyen_tap").label, "Practice");
  assert.equal(labels.find((a) => a.key === "van_dung").label, "Application");
});

test("getActivityLabels: mặc định (không truyền languageCode) vẫn trả về tiếng Việt - KHÔNG phá hành vi cũ", () => {
  const labels = getActivityLabels("bai_moi", []);
  assert.equal(labels.find((a) => a.key === "khoi_dong").label, "Khởi động");
  assert.equal(labels.find((a) => a.key === "kham_pha").label, "Khám phá (Hình thành kiến thức mới)");
});

test("getActivityLabels: languageCode='en' + STEM bật -> nhãn 'Vận dụng' bằng tiếng Anh, KHÔNG còn chuỗi tiếng Việt hardcode", () => {
  const labels = getActivityLabels("bai_moi", ["tichHopSTEM"], "en");
  const vanDung = labels.find((a) => a.key === "van_dung");
  assert.equal(vanDung.label, "[Application - STEM Integration]");
  assert.ok(!/Vận dụng|Tích hợp/.test(vanDung.label), "Không được còn chữ tiếng Việt trong nhãn STEM tiếng Anh");
});

test("getActivityLabels: languageCode='en' + loại bài Ôn tập -> nhãn 'Khám phá' đổi đúng theo loại bài, bằng tiếng Anh", () => {
  const labels = getActivityLabels("on_tap", [], "en");
  assert.equal(labels.find((a) => a.key === "kham_pha").label, "Knowledge Consolidation");
});

test("buildLessonPlanPrompt: môn Tiếng Anh -> đoạn structureRule/stepClarityRule dùng nhãn hoạt động TIẾNG ANH, không còn ép tên tiếng Việt", () => {
  const prompt = buildLessonPlanPrompt({
    subject: "Tieng_Anh",
    grade: 5,
    volume: null,
    chapterId: null,
    soTiet: 1,
    noiDungCotLoi: "Unit 5: My Neighbourhood",
    integrations: [],
    lessonType: "bai_moi",
    sourceMarkdown: null,
  });
  assert.ok(prompt.includes("Warm-up"), "Prompt phải chứa nhãn 'Warm-up' cho môn Tiếng Anh");
  assert.ok(prompt.includes("Practice"), "Prompt phải chứa nhãn 'Practice' cho môn Tiếng Anh");
  // Câu "đúng tên gọi, đúng thứ tự" KHÔNG được kèm literal "Khởi động, ..." nữa (đã thay bằng biến).
  assert.ok(
    !/PHẢI có đủ 4 hoạt động chuẩn theo Mục III của [^:]+: Khởi động,/.test(prompt),
    "KHÔNG được còn hardcode 'Khởi động,' ngay sau 'PHẢI có đủ 4 hoạt động chuẩn'"
  );
});

test("buildLessonPlanPrompt: môn Tiếng Anh + tích hợp STEM -> chỉ thị đổi tên 'ten' dùng đúng nhãn STEM tiếng Anh", () => {
  const prompt = buildLessonPlanPrompt({
    subject: "Tieng_Anh",
    grade: 5,
    volume: null,
    chapterId: null,
    soTiet: 1,
    noiDungCotLoi: "Unit 5: My Neighbourhood",
    integrations: ["tichHopSTEM"],
    lessonType: "bai_moi",
    sourceMarkdown: null,
  });
  assert.ok(
    prompt.includes('[Application - STEM Integration]'),
    "Prompt phải yêu cầu AI đặt tên hoạt động STEM bằng tiếng Anh"
  );
  assert.ok(
    !prompt.includes('"[Vận dụng - Tích hợp STEM]"'),
    "KHÔNG được còn yêu cầu literal tiếng Việt cho trường 'ten' khi môn học là ngoại ngữ"
  );
});

test("buildLessonPlanPrompt: môn Toán (không phải ngoại ngữ) vẫn giữ nguyên hành vi cũ - nhãn tiếng Việt", () => {
  const prompt = buildLessonPlanPrompt({
    subject: "Toan",
    grade: 5,
    volume: null,
    chapterId: null,
    soTiet: 1,
    noiDungCotLoi: "Phép cộng trong phạm vi 100 000",
    integrations: ["tichHopSTEM"],
    lessonType: "bai_moi",
    sourceMarkdown: null,
  });
  assert.ok(prompt.includes('"[Vận dụng - Tích hợp STEM]"'), "Môn Toán vẫn phải dùng nhãn STEM tiếng Việt như cũ");
});

test("computeMultiPeriodTimeline/computeActivityTimeline: nhận languageCode, không lỗi khi bỏ trống (mặc định 'vi')", () => {
  const periodsVi = computeMultiPeriodTimeline(2, 5, "bai_moi");
  const periodsEn = computeMultiPeriodTimeline(2, 5, "bai_moi", "en");
  assert.equal(periodsVi.length, periodsEn.length);
  assert.notEqual(periodsVi[0].segments[0].label, periodsEn[0].segments[0].label);

  const timelineEn = computeActivityTimeline(2, 5, "bai_moi", "en");
  assert.ok(timelineEn.some((t) => t.label === "Warm-up"));
});

function buildMinimalEnglishLessonPlan() {
  return {
    tenBai: "Unit 5: My Neighbourhood",
    yeuCauCanDat: { kienThuc: ["Know vocabulary about places."], nangLuc: ["Speaking skills."], phamChat: ["Respect."] },
    doDungDayHoc: { giaoVien: ["Flashcards"], hocSinh: ["Textbook"] },
    hoatDong: [
      { ten: "Warm-up", mucTieu: "Engage students.", tienTrinh: [{ hoatDongGVHS: "Greet students.", sanPhamDuKien: "Students greet back." }] },
      { ten: "Presentation", mucTieu: "New vocabulary.", tienTrinh: [{ hoatDongGVHS: "Introduce words.", sanPhamDuKien: "Students repeat." }] },
      { ten: "Practice", mucTieu: "Practice.", tienTrinh: [{ hoatDongGVHS: "Do exercise.", sanPhamDuKien: "Completed exercise." }] },
      {
        ten: "[Application - STEM Integration]",
        mucTieu: "Apply.",
        tienTrinh: [{ hoatDongGVHS: "Assign project.", sanPhamDuKien: "Project brief noted." }],
      },
    ],
    checklistNLPC: [{ tieuChi: "Cooperation", loai: "nang_luc", tot: "Active", dat: "Participates", canCoGang: "Needs prompting" }],
    stemActivity: {
      tenSanPham: "Neighbourhood Map",
      vatLieu: ["Paper", "Colors"],
      cacBuoc: ["Draw a map.", "Label places."],
      tieuChiDanhGia: ["Creativity", "Accuracy"],
    },
    baiTapPhanHoa: { hoTro: ["Match words to pictures."], datChuan: ["Fill in the blanks."], nangCao: ["Write 3 sentences."] },
    phieuHocTap: { tieuDe: "My Neighbourhood Worksheet", huongDan: "Complete individually.", baiTap: ["Draw your street."] },
    loiDan: [{ hoatDong: "Warm-up", loiDan: "Good morning class! Today we will talk about our neighbourhood." }],
    slideOutline: [{ tieuDe: "My Neighbourhood", noiDung: ["Vocabulary", "Practice"] }],
    tinNhanPhuHuynh: "Kính gửi quý phụ huynh, hôm nay con đã học về khu phố của mình.",
    goiYHocLieuHinhAnh: ["flashcard khu phố cho trẻ em, phong cách hoạt hình"],
  };
}

test("buildEnglishLessonPlanDocxBlob: render đủ 7 tích hợp còn thiếu (Checklist NL-PC, STEM, Bài tập phân hoá, Phiếu học tập, Lời dẫn, Slide Outline) bằng tiếng Anh", async () => {
  const lessonPlan = buildMinimalEnglishLessonPlan();
  const blob = await buildEnglishLessonPlanDocxBlob(lessonPlan, {
    tenBai: lessonPlan.tenBai,
    grade: 5,
    soTiet: 1,
    subjectLabelEn: "English",
  });
  const buffer = Buffer.from(await blob.arrayBuffer());
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml").async("string");

  assert.ok(xml.includes("COMPETENCY - QUALITY ASSESSMENT CHECKLIST"), "Thiếu phụ lục Checklist NL-PC tiếng Anh");
  assert.ok(xml.includes("STEM GUIDE"), "Thiếu phụ lục STEM tiếng Anh");
  assert.ok(xml.includes("DIFFERENTIATED EXERCISES"), "Thiếu phụ lục Bài tập phân hoá tiếng Anh");
  assert.ok(xml.includes("My Neighbourhood Worksheet"), "Thiếu phụ lục Phiếu học tập tiếng Anh");
  assert.ok(xml.includes("SLIDE OUTLINE"), "Thiếu phụ lục Slide Outline tiếng Anh");
  assert.ok(xml.includes("Neighbourhood Map"), "Thiếu tên sản phẩm STEM trong phụ lục");
  assert.ok(xml.includes("Tin nh") && xml.includes("phụ huynh"), "Tin nhắn phụ huynh vẫn phải giữ tiêu đề tiếng Việt");
  // Mặc định (không truyền includeTeacherScript) -> KHÔNG kèm phụ lục Lời dẫn.
  assert.ok(!xml.includes("TEACHER SCRIPT"), "Mặc định KHÔNG được kèm phụ lục Lời dẫn khi includeTeacherScript=false");
});

test("buildEnglishLessonPlanDocxBlob: includeTeacherScript=true -> có kèm phụ lục Lời dẫn (Teacher Script)", async () => {
  const lessonPlan = buildMinimalEnglishLessonPlan();
  const blob = await buildEnglishLessonPlanDocxBlob(
    lessonPlan,
    { tenBai: lessonPlan.tenBai, grade: 5, soTiet: 1, subjectLabelEn: "English" },
    { includeTeacherScript: true }
  );
  const buffer = Buffer.from(await blob.arrayBuffer());
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml").async("string");
  assert.ok(xml.includes("TEACHER SCRIPT"), "Phải kèm phụ lục Lời dẫn khi includeTeacherScript=true");
  assert.ok(xml.includes("Today we will talk about our neighbourhood"), "Thiếu nội dung lời dẫn thực tế");
});

test("printEnglishLessonPlan: gọi window.open KHÔNG kèm 'noopener'/'noreferrer' (tránh window.open() luôn trả về null)", () => {
  const originalWindow = globalThis.window;
  let capturedArgs = null;
  const fakeDoc = { open: () => {}, write: () => {}, close: () => {}, title: "" };
  const fakePrintWindow = { document: fakeDoc, focus: () => {}, print: () => {}, onload: null };
  globalThis.window = {
    open: (...args) => {
      capturedArgs = args;
      return fakePrintWindow;
    },
  };
  try {
    const lessonPlan = buildMinimalEnglishLessonPlan();
    printEnglishLessonPlan(lessonPlan, { tenBai: lessonPlan.tenBai, grade: 5, soTiet: 1, subjectLabelEn: "English" });
    assert.ok(capturedArgs, "window.open() phải được gọi");
    // Đối số thứ 3 (features) - nếu có - TUYỆT ĐỐI không được chứa "noopener" (lý do: theo đặc tả,
    // trình duyệt trả về null cho window.open() khi feature này được set, kể cả khi mở thành công).
    const features = capturedArgs[2];
    assert.ok(!features || !/noopener/.test(features), "KHÔNG được truyền 'noopener' cho window.open()");
    assert.ok(!features || !/noreferrer/.test(features), "KHÔNG được truyền 'noreferrer' cho window.open() (tự kèm noopener)");
  } finally {
    globalThis.window = originalWindow;
  }
});

test("printEnglishLessonPlan: khi window.open() trả về null -> báo lỗi rõ ràng thay vì crash mơ hồ", () => {
  const originalWindow = globalThis.window;
  globalThis.window = { open: () => null };
  try {
    const lessonPlan = buildMinimalEnglishLessonPlan();
    assert.throws(
      () => printEnglishLessonPlan(lessonPlan, { tenBai: lessonPlan.tenBai, grade: 5, soTiet: 1, subjectLabelEn: "English" }),
      /popup/i
    );
  } finally {
    globalThis.window = originalWindow;
  }
});
