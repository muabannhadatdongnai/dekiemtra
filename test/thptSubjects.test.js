import { test } from "node:test";
import assert from "node:assert/strict";
import { GRADES, SUBJECTS, MODULE_KEYS, getSubjectsForGrade } from "../src/data/config.js";
import { getSubjectProfile, SUBJECT_PROFILES } from "../src/data/subjectProfiles.js";
import {
  LESSON_PLAN_GRADES,
  getCircularForGrade,
  getMinutesPerLesson,
  isPreschoolGrade,
} from "../src/data/lessonPlanTemplates.js";
import { getGradeProfile, GRADE_PROFILES } from "../src/data/gradeProfiles.js";

/**
 * thptSubjects.test.js (Phiên 33, cập nhật Phiên 38)
 * Khoá lại phần mở rộng THPT (Lớp 10-12) cho 3 luồng: Soạn Giáo án, Đề Cương Ôn Tập, Đề kiểm tra.
 * Cơ cấu chuẩn theo Thông tư 32/2018 (sửa đổi bởi Thông tư 13/2022) - 8 môn/HĐGD bắt buộc + 9 môn
 * lựa chọn = 17 môn/HĐGD hợp lệ cho mỗi khối Lớp 10-12, CỘNG THÊM 3 môn Ngoại ngữ 2 (Tiếng Trung/
 * Nhật/Pháp - Phiên 38) nằm NGOÀI cơ cấu chính thức này -> tổng 20 môn hợp lệ ở dropdown Lớp 10-12.
 */

const THPT_BAT_BUOC = [
  "Ngu_Van",
  "Toan",
  "Tieng_Anh",
  "Lich_Su",
  "Giao_Duc_The_Chat",
  "Giao_Duc_Quoc_Phong_An_Ninh",
  "Hoat_Dong_Trai_Nghiem_Huong_Nghiep",
  "Noi_Dung_Giao_Duc_Dia_Phuong",
];

const THPT_LUA_CHON = [
  "Dia_Li",
  "Giao_Duc_Kinh_Te_Va_Phap_Luat",
  "Vat_Li",
  "Hoa_Hoc",
  "Sinh_Hoc",
  "Cong_Nghe",
  "Tin_Hoc",
  "Am_Nhac",
  "My_Thuat",
];

// ⚠️ Phiên 38 - Ngoại ngữ 2 (Tiếng Trung/Nhật/Pháp, Lớp 6-12) KHÔNG nằm trong cơ cấu chính thức
// "8 bắt buộc + 9 lựa chọn" của Thông tư 32/2018/TT13-2022 (đây là môn tự chọn THÊM, ngoài khung
// 17 môn/HĐGD chính thức) - nhưng VẪN cần xuất hiện trong dropdown "Môn học" ở Lớp 10-12 (xem
// config.js). Test dưới đây trước Phiên 38 khoá cứng "đúng 17 môn" - nay cập nhật thành 17 (chính
// thức) + 3 (Ngoại ngữ 2) = 20, để không coi việc thêm Ngoại ngữ 2 là lỗi phá vỡ cơ cấu chính thức.
const NGOAI_NGU_2 = ["Tieng_Trung", "Tieng_Nhat", "Tieng_Phap"];

test("config.js: GRADES vẫn đủ 1-12 (không đổi từ trước)", () => {
  assert.deepEqual(GRADES, Array.from({ length: 12 }, (_, i) => i + 1));
});

for (const grade of [10, 11, 12]) {
  test(`config.js: Lớp ${grade} - getSubjectsForGrade(LESSON_PLAN) trả về đủ 17 môn/HĐGD chính thức (8 bắt buộc + 9 lựa chọn) + 3 môn Ngoại ngữ 2`, () => {
    const subjects = getSubjectsForGrade(grade, MODULE_KEYS.LESSON_PLAN).map((s) => s.value);
    const expected = [...THPT_BAT_BUOC, ...THPT_LUA_CHON, ...NGOAI_NGU_2];
    assert.equal(
      subjects.length,
      20,
      `Lớp ${grade} phải có đúng 20 môn/HĐGD (17 chính thức + 3 Ngoại ngữ 2), hiện có: ${subjects.join(", ")}`
    );
    for (const value of expected) {
      assert.ok(subjects.includes(value), `Thiếu môn/HĐGD phải có ở Lớp ${grade}: ${value}`);
    }
  });

  test(`config.js: Lớp ${grade} - môn "Lịch sử" (bắt buộc, Thông tư 13/2022) KHÔNG dùng lại "Lịch sử và Địa lí"`, () => {
    const subjects = getSubjectsForGrade(grade, MODULE_KEYS.LESSON_PLAN).map((s) => s.value);
    assert.ok(subjects.includes("Lich_Su"), `Lớp ${grade} phải có môn "Lich_Su" riêng`);
    assert.ok(
      !subjects.includes("Lich_Su_Dia_Li"),
      `Lớp ${grade} KHÔNG được có "Lich_Su_Dia_Li" (môn gộp chỉ dùng Tiểu học/THCS, dừng ở Lớp 9)`
    );
  });

  test(`config.js: Lớp ${grade} - các môn nhận xét-only (Thông tư 22/2021) không xuất hiện trong danh sách môn hỗ trợ Đề kiểm tra`, () => {
    const examSubjects = getSubjectsForGrade(grade, MODULE_KEYS.EXAM).map((s) => s.value);
    const nhanXetOnly = [
      "Giao_Duc_The_Chat",
      "Am_Nhac",
      "My_Thuat",
      "Hoat_Dong_Trai_Nghiem_Huong_Nghiep",
      "Noi_Dung_Giao_Duc_Dia_Phuong",
    ];
    for (const value of nhanXetOnly) {
      assert.ok(!examSubjects.includes(value), `Môn nhận xét-only "${value}" KHÔNG được hỗ trợ Đề kiểm tra ở Lớp ${grade}`);
    }
  });

  test(`config.js: Lớp ${grade} - "Giáo dục quốc phòng và an ninh" CÓ hỗ trợ Đề kiểm tra (KHÁC Giáo dục thể chất - Thông tư 22 Điều 5)`, () => {
    const examSubjects = getSubjectsForGrade(grade, MODULE_KEYS.EXAM).map((s) => s.value);
    assert.ok(
      examSubjects.includes("Giao_Duc_Quoc_Phong_An_Ninh"),
      `Lớp ${grade}: GDQP&AN phải hỗ trợ Đề kiểm tra vì môn này CÓ điểm số theo Thông tư 22, không thuộc nhóm chỉ-nhận-xét`
    );
  });

  test(`config.js: Lớp ${grade} - "Ngữ văn" chỉ hỗ trợ Soạn Giáo án + Đề Cương (KHÔNG hỗ trợ Đề kiểm tra, giống THCS)`, () => {
    const examSubjects = getSubjectsForGrade(grade, MODULE_KEYS.EXAM).map((s) => s.value);
    const lpSubjects = getSubjectsForGrade(grade, MODULE_KEYS.LESSON_PLAN).map((s) => s.value);
    assert.ok(!examSubjects.includes("Ngu_Van"), `Lớp ${grade}: Ngữ văn chưa hỗ trợ Đề kiểm tra (cần module chuyên biệt riêng)`);
    assert.ok(lpSubjects.includes("Ngu_Van"), `Lớp ${grade}: Ngữ văn vẫn phải hỗ trợ Soạn Giáo án`);
  });

  test(`subjectProfiles.js: mọi môn/HĐGD hợp lệ ở Lớp ${grade} đều có profile (expertRole + extraRules)`, () => {
    const subjects = getSubjectsForGrade(grade, MODULE_KEYS.LESSON_PLAN);
    for (const s of subjects) {
      const profile = getSubjectProfile(s.value);
      assert.ok(profile, `Thiếu subjectProfile cho "${s.value}" (Lớp ${grade})`);
      assert.ok(profile.expertRole && profile.expertRole.length > 0, `"${s.value}" thiếu expertRole`);
      assert.ok(profile.extraRules && profile.extraRules.length > 0, `"${s.value}" thiếu extraRules`);
    }
  });
}

test("lessonPlanTemplates.js: LESSON_PLAN_GRADES đã có đủ Lớp 10, 11, 12", () => {
  const values = LESSON_PLAN_GRADES.map((g) => g.value);
  for (const g of [10, 11, 12]) {
    assert.ok(values.includes(g), `LESSON_PLAN_GRADES thiếu Lớp ${g}`);
  }
});

for (const grade of [10, 11, 12]) {
  test(`lessonPlanTemplates.js: Lớp ${grade} tự động dùng CV5512 (giống THCS), 45 phút/tiết, không phải mầm non`, () => {
    assert.equal(getCircularForGrade(grade).code, "5512", `Lớp ${grade} phải dùng CV5512`);
    assert.equal(getMinutesPerLesson(grade), 45, `Lớp ${grade} phải là 45 phút/tiết`);
    assert.equal(isPreschoolGrade(grade), false, `Lớp ${grade} không phải mầm non`);
  });
}

test("gradeProfiles.js: guidance của MỌI khối KHÔNG còn nhắc chủ đề học thuật đặc thù môn Toán (tránh rò rỉ sang môn khác)", () => {
  const toanTuKhoa = [
    "đạo hàm",
    "tập hợp",
    "lượng giác",
    "vector",
    "nguyên hàm",
    "tích phân",
    "số phức",
    "giới hạn",
    "phân số",
    "bảng cửu chương",
  ];
  for (const [grade, profile] of Object.entries(GRADE_PROFILES)) {
    const guidanceLower = profile.guidance.toLowerCase();
    for (const keyword of toanTuKhoa) {
      assert.ok(
        !guidanceLower.includes(keyword),
        `gradeProfiles guidance của Lớp ${grade} vẫn còn nhắc chủ đề Toán "${keyword}" - sẽ rò rỉ sai sang mọi môn khác (Vật lí/Sinh học/Địa lí...)`
      );
    }
  }
});

test("gradeProfiles.js: getGradeProfile hoạt động đúng và an toàn cho Lớp 10-12 (family B, không cho phép visual)", () => {
  for (const grade of [10, 11, 12]) {
    const profile = getGradeProfile(grade);
    assert.equal(profile.family, "B", `Lớp ${grade} phải thuộc Họ B (text thuần)`);
    assert.equal(profile.allowVisual, false, `Lớp ${grade} không được cho phép câu hỏi trực quan`);
  }
});

test("subjectProfiles.js: profile Toán có đủ ghi chú độ sâu kiến thức riêng cho Lớp 10-12", () => {
  const toan = SUBJECT_PROFILES.Toan;
  assert.match(toan.extraRules, /Lớp 10/, "Toán thiếu ghi chú riêng Lớp 10");
  assert.match(toan.extraRules, /Lớp 11/, "Toán thiếu ghi chú riêng Lớp 11");
  assert.match(toan.extraRules, /Lớp 12/, "Toán thiếu ghi chú riêng Lớp 12");
});

test('subjectProfiles.js: "Lịch sử" (THPT) nêu rõ Thông tư 13/2022 và phân biệt với "Lịch sử và Địa lí"', () => {
  const lichSu = SUBJECT_PROFILES.Lich_Su;
  assert.match(lichSu.extraRules, /13\/2022/, 'Profile "Lich_Su" phải nhắc Thông tư 13/2022 (căn cứ Lịch sử thành môn bắt buộc)');
});

test('subjectProfiles.js: "Giáo dục quốc phòng và an ninh" nêu rõ giới hạn phạm vi (chỉ phần lý thuyết)', () => {
  const gdqp = SUBJECT_PROFILES.Giao_Duc_Quoc_Phong_An_Ninh;
  assert.match(gdqp.extraRules, /LÝ THUYẾT/, 'Profile GDQP&AN phải nêu rõ hệ thống chỉ hỗ trợ phần lý thuyết');
});
