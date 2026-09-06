import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";

import { buildChineseLessonPlanDocxBlob } from "../src/services/chineseLessonPlanExportService.js";
import { buildChineseOutlineDocxBlob } from "../src/services/chineseOutlineExportService.js";
import { buildChineseExamDocxBlob } from "../src/services/chineseExamExportService.js";

import { buildJapaneseLessonPlanDocxBlob } from "../src/services/japaneseLessonPlanExportService.js";
import { buildJapaneseOutlineDocxBlob } from "../src/services/japaneseOutlineExportService.js";
import { buildJapaneseExamDocxBlob } from "../src/services/japaneseExamExportService.js";

import { buildFrenchLessonPlanDocxBlob } from "../src/services/frenchLessonPlanExportService.js";
import { buildFrenchOutlineDocxBlob } from "../src/services/frenchOutlineExportService.js";
import { buildFrenchExamDocxBlob } from "../src/services/frenchExamExportService.js";

import { getForeignLanguageExporters } from "../src/services/foreignLanguageExportRegistry.js";
import { assertValidParagraphNesting } from "./wordSchemaAssertions.js";

/**
 * foreignLanguage2Export.test.js
 * Test cho phần xuất Word/PDF của Ngoại ngữ 2 (Tiếng Trung/Tiếng Nhật/Tiếng Pháp) - Phiên 40, đúng
 * khuôn foreignLanguageExport.test.js (bản tiếng Anh). ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY.
 *
 * Trọng tâm test:
 *  1. Cả 9 tổ hợp (3 ngôn ngữ x 3 loại tài liệu) dựng ra .docx HỢP LỆ (đúng khuôn Phiên 37 - đã
 *     từng có bug "<w:p>" lồng "<w:p>" khiến Word từ chối mở file).
 *  2. Font Đông Á (`w:eastAsia`) PHẢI xuất hiện đúng trong XML cho Tiếng Trung/Nhật ("SimSun"/
 *     "MS Mincho") - đây chính là lỗi thật đã phát hiện lúc phát triển (font shape `{ name,
 *     eastAsia }` bị docx bỏ qua eastAsia một cách âm thầm) nên PHẢI kiểm tra bằng XML thực tế,
 *     không chỉ tin code "trông có vẻ đúng".
 *  3. Registry foreignLanguageExportRegistry.js tra đúng bộ hàm theo languageCode.
 *  4. "Tin nhắn gửi phụ huynh"/"Thư ngỏ gửi Phụ huynh" vẫn giữ tiếng Việt ở cả 3 ngôn ngữ mới.
 */

async function extractDocumentXml(blob) {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.ok(zip.file("word/document.xml"), "thiếu word/document.xml - file .docx không hợp lệ");
  const xml = await zip.file("word/document.xml").async("string");
  // Áp dụng cho MỌI file .docx dựng trong test này (không chỉ trường hợp 2 cột nhiều tiết) - lớp
  // bảo vệ chung, rẻ, bắt được đúng dạng lỗi Phiên 37 ("<w:p>" lồng "<w:p>" khiến Word từ chối mở
  // file dù XML vẫn "well-formed" nên assert.ok thông thường không phát hiện ra).
  assertValidParagraphNesting(xml, "foreignLanguage2Export.test.js");
  return xml;
}

function makeLessonPlan(overrides = {}) {
  return {
    tenBai: "Bai 1",
    yeuCauCanDat: {
      kienThuc: ["Kien thuc 1"],
      nangLuc: ["Nang luc 1"],
      phamChat: ["Pham chat 1"],
    },
    doDungDayHoc: { giaoVien: ["May chieu"], hocSinh: ["Sach giao khoa"] },
    hoatDong: [
      {
        ten: "Khoi dong",
        mucTieu: "Kich hoat kien thuc",
        tienTrinh: [{ hoatDongGVHS: "Giao vien hoi hoc sinh tra loi.", sanPhamDuKien: "Cau tra loi cua hoc sinh." }],
      },
    ],
    goiYHocLieuHinhAnh: ["a classroom"],
    tinNhanPhuHuynh: "Kính gửi quý phụ huynh, hôm nay con học rất tốt ạ.",
    ...overrides,
  };
}

function makeOutline(overrides = {}) {
  return {
    tenDeCuong: "De cuong on tap",
    kienThucCotLoi: [{ tieuMuc: "Chu de 1", noiDung: "Noi dung 1" }],
    dangBai: [{ tenDang: "Dang 1", baiMauDe: "De mau", baiMauLoiGiai: "Loi giai" }],
    nganHangBaiTap: { coBan: [{ de: "De 1", dapAn: "Dap an 1" }], nangCao: [], vanDungCao: [] },
    loTrinhOnTap: [{ ngay: "Ngay 1", nhiemVu: "On tap chu de 1" }],
    thuNgoPhuHuynh: "Kính gửi quý phụ huynh, xin phối hợp giúp con ôn tập.",
    ...overrides,
  };
}

function makeExamContent(overrides = {}) {
  return {
    questions: [
      {
        content: "Cau hoi 1",
        options: ["A. mot", "B. hai"],
        correctAnswer: "A",
        chapterRef: "chuong1",
        level: "NHAN_BIET",
      },
    ],
    teacherRubric: [{ correctAnswer: "A", detailedSolution: "Giai thich chi tiet", scoringGuide: "1 diem" }],
    ...overrides,
  };
}

const LANGUAGES = [
  {
    name: "Tiếng Trung",
    eastAsiaFont: "SimSun",
    buildLessonPlan: buildChineseLessonPlanDocxBlob,
    buildOutline: buildChineseOutlineDocxBlob,
    buildExam: buildChineseExamDocxBlob,
    lessonPlanTitle: "教案",
    outlineTitle: "复习提纲",
  },
  {
    name: "Tiếng Nhật",
    eastAsiaFont: "MS Mincho",
    buildLessonPlan: buildJapaneseLessonPlanDocxBlob,
    buildOutline: buildJapaneseOutlineDocxBlob,
    buildExam: buildJapaneseExamDocxBlob,
    lessonPlanTitle: "学習指導案",
    outlineTitle: "復習まとめ",
  },
  {
    name: "Tiếng Pháp",
    eastAsiaFont: null, // Latinh - không cần eastAsia
    buildLessonPlan: buildFrenchLessonPlanDocxBlob,
    buildOutline: buildFrenchOutlineDocxBlob,
    buildExam: buildFrenchExamDocxBlob,
    lessonPlanTitle: "PLAN DE COURS",
    outlineTitle: "FICHE DE RÉVISION",
  },
];

LANGUAGES.forEach((lang) => {
  test(`${lang.name}: Kế hoạch bài dạy - dựng .docx hợp lệ, đúng tiêu đề + nội dung + giữ tiếng Việt cho tin nhắn phụ huynh`, async () => {
    const blob = await lang.buildLessonPlan(makeLessonPlan(), { grade: 6, soTiet: 1 });
    const xml = await extractDocumentXml(blob);

    assert.ok(xml.includes(lang.lessonPlanTitle), `phải có tiêu đề ${lang.lessonPlanTitle}`);
    assert.ok(xml.includes("Bai 1"), "phải chứa tên bài");
    assert.ok(xml.includes("Giao vien hoi hoc sinh"), "phải chứa nội dung tiến trình hoạt động");
    assert.ok(xml.includes("PH\u1EE4 L\u1EE4C"), "tiêu đề phụ lục tin nhắn phụ huynh phải giữ tiếng Việt");
    assert.ok(xml.includes("Kính gửi quý phụ huynh"), "nội dung tin nhắn phụ huynh phải giữ nguyên tiếng Việt");

    if (lang.eastAsiaFont) {
      assert.ok(
        xml.includes(`w:eastAsia="${lang.eastAsiaFont}"`),
        `phải gắn font eastAsia="${lang.eastAsiaFont}" cho chữ ${lang.name} (nếu không Word có thể hiện ô vuông trống)`
      );
    }
  });

  test(`${lang.name}: Kế hoạch bài dạy - KHÔNG lỗi khi thiếu field tuỳ chọn (goiYHocLieuHinhAnh)`, async () => {
    const { goiYHocLieuHinhAnh, ...withoutSuggestions } = makeLessonPlan();
    const blob = await lang.buildLessonPlan(withoutSuggestions, { grade: 6 });
    const xml = await extractDocumentXml(blob);
    assert.ok(xml.includes("Bai 1"));
  });

  test(`${lang.name}: Kế hoạch bài dạy 2 CỘT, nhiều tiết (đúng đường code từng gây lỗi "<w:p>" lồng Phiên 37) - vẫn hợp lệ`, async () => {
    const lessonPlan = makeLessonPlan({
      hoatDong: [
        {
          ten: "Hoat dong 1",
          tienTrinh: [
            { tiet: 1, hoatDongGVHS: "Buoc o tiet 1.", sanPhamDuKien: "San pham 1" },
            { tiet: 2, hoatDongGVHS: "Buoc o tiet 2 (sau ranh gioi tiet).", sanPhamDuKien: "San pham 2" },
          ],
        },
      ],
    });
    const blob = await lang.buildLessonPlan(lessonPlan, { grade: 6, soTiet: 2, columnMode: "two_column" });
    // extractDocumentXml() đã gọi assertValidParagraphNesting() bên trong - nếu
    // periodBoundaryTableRowZh/Ja/Fr lỡ truyền nguyên 1 Paragraph vào cell() thay vì mảng TextRun
    // (đúng lỗi Phiên 37), dòng dưới đây sẽ throw trước khi tới các assert.ok().
    const xml = await extractDocumentXml(blob);
    assert.ok(xml.includes("Buoc o tiet 2"), "phải chứa nội dung bước ở tiết 2 (sau ranh giới tiết)");
  });

  test(`${lang.name}: Đề Cương Ôn Tập - dựng .docx hợp lệ, đúng tiêu đề + giữ tiếng Việt cho thư ngỏ phụ huynh`, async () => {
    const blob = await lang.buildOutline(makeOutline(), { grade: 6 });
    const xml = await extractDocumentXml(blob);

    assert.ok(xml.includes(lang.outlineTitle), `phải có tiêu đề ${lang.outlineTitle}`);
    assert.ok(xml.includes("De cuong on tap"));
    assert.ok(xml.includes("Kính gửi quý phụ huynh, xin phối hợp"), "thư ngỏ phụ huynh phải giữ nguyên tiếng Việt");

    if (lang.eastAsiaFont) {
      assert.ok(xml.includes(`w:eastAsia="${lang.eastAsiaFont}"`));
    }
  });

  test(`${lang.name}: Đề Kiểm tra (includeAnswers=false) - bản Học sinh KHÔNG có lời giải`, async () => {
    const blob = await lang.buildExam({ title: "Test title" }, makeExamContent(), { includeAnswers: false });
    const xml = await extractDocumentXml(blob);
    assert.ok(xml.includes("Cau hoi 1"));
    assert.ok(!xml.includes("Giai thich chi tiet"), "bản Học sinh KHÔNG được có lời giải chi tiết");
  });

  test(`${lang.name}: Đề Kiểm tra (includeAnswers=true) - bản Giáo viên có đủ đáp án + lời giải`, async () => {
    const blob = await lang.buildExam({ title: "Test title" }, makeExamContent(), { includeAnswers: true });
    const xml = await extractDocumentXml(blob);
    assert.ok(xml.includes("Giai thich chi tiet"), "bản Giáo viên phải có lời giải chi tiết");
    assert.ok(xml.includes("1 diem"), "bản Giáo viên phải có biểu điểm");

    if (lang.eastAsiaFont) {
      assert.ok(xml.includes(`w:eastAsia="${lang.eastAsiaFont}"`));
    }
  });

  test(`${lang.name}: Đề Kiểm tra - includeMatrixAndSpec=true -> có bảng Ma trận + Bản đặc tả`, async () => {
    const blob = await lang.buildExam({ title: "Test title" }, makeExamContent(), {
      includeAnswers: false,
      chaptersInfo: [{ chapterId: "chuong1", label: "Chuong 1" }],
      typeByLevel: { NHAN_BIET: "trac_nghiem" },
      includeMatrixAndSpec: true,
    });
    const xml = await extractDocumentXml(blob);
    assert.ok(xml.includes("Chuong 1"), "phải liệt kê chương/chủ đề trong bảng ma trận/đặc tả");
  });
});

// ---------- Registry (foreignLanguageExportRegistry.js) ----------

test("getForeignLanguageExporters: tra đúng bộ hàm theo languageCode cho cả 3 loại tài liệu", () => {
  ["en", "zh", "ja", "fr"].forEach((code) => {
    ["lessonPlan", "outline", "exam"].forEach((docType) => {
      const exporters = getForeignLanguageExporters(code, docType);
      assert.ok(exporters, `phải có bộ hàm cho languageCode="${code}", docType="${docType}"`);
      assert.equal(typeof exporters.exportToWord, "function");
      assert.equal(typeof exporters.print, "function");
    });
  });
});

test("getForeignLanguageExporters: languageCode không tồn tại -> trả về null (không throw)", () => {
  assert.equal(getForeignLanguageExporters("de", "lessonPlan"), null);
  assert.equal(getForeignLanguageExporters(undefined, "lessonPlan"), null);
});

test("getForeignLanguageExporters: docType không tồn tại -> trả về null (không throw)", () => {
  assert.equal(getForeignLanguageExporters("zh", "khongTonTai"), null);
});
