import { test } from "node:test";
import assert from "node:assert/strict";
import { WORKSHEET_TOPIC_PACKAGES, getTopicPackagesFor, getTopicPackageById } from "../src/data/worksheetTopicPackages.js";
import { WORKSHEET_EXERCISE_CATALOG, isGradeInRange } from "../src/data/worksheetExerciseCatalog.js";

/**
 * worksheetTopicPackages.test.js
 * MỞ RỘNG LỚP 3, ĐỢT 3 (thêm 4 gói chủ đề Lớp 3 vào worksheetTopicPackages.js) - đảm bảo mọi
 * exerciseKeys khai báo trong gói đều là key CÓ THẬT trong catalog, đúng subject, và khối lớp
 * của gói nằm trong phạm vi minGrade/maxGrade của từng dạng bài (không khai gói cho khối lớp mà
 * dạng bài đó chưa mở tới).
 */

test("mọi exerciseKeys trong WORKSHEET_TOPIC_PACKAGES đều tồn tại trong catalog, đúng subject", () => {
  for (const pkg of WORKSHEET_TOPIC_PACKAGES) {
    for (const key of pkg.exerciseKeys) {
      const found = WORKSHEET_EXERCISE_CATALOG.find((item) => item.key === key);
      assert.ok(found, `gói "${pkg.id}" tham chiếu key không tồn tại trong catalog: ${key}`);
      assert.equal(found.subject, pkg.subject, `gói "${pkg.id}" sai subject cho key ${key}`);
    }
  }
});

test("mọi exerciseKeys trong gói đều hợp lệ với khối lớp của gói (isGradeInRange)", () => {
  for (const pkg of WORKSHEET_TOPIC_PACKAGES) {
    for (const key of pkg.exerciseKeys) {
      const found = WORKSHEET_EXERCISE_CATALOG.find((item) => item.key === key);
      assert.ok(
        isGradeInRange(pkg.grade, found.minGrade, found.maxGrade),
        `gói "${pkg.id}" (khối ${pkg.grade}) chứa key ${key} nhưng dạng bài đó chỉ áp dụng ${found.minGrade}-${found.maxGrade}`
      );
    }
  }
});

test("getTopicPackagesFor trả về đúng 4 gói cho LOP_3/TOAN", () => {
  const packages = getTopicPackagesFor("LOP_3", "TOAN");
  assert.equal(packages.length, 4);
  assert.ok(packages.every((p) => p.grade === "LOP_3" && p.subject === "TOAN"));
});

test("getTopicPackagesFor trả về [] cho tổ hợp không có gói nào (VD MAM_NON)", () => {
  const packages = getTopicPackagesFor("MAM_NON", "TOAN");
  assert.equal(packages.length, 0);
});

test("getTopicPackageById tra cứu đúng gói Lớp 3 mới thêm", () => {
  const pkg = getTopicPackageById("lop3_thong_ke_xac_suat");
  assert.ok(pkg);
  assert.deepEqual(pkg.exerciseKeys.sort(), ["kha_nang_xay_ra", "thu_thap_so_lieu"].sort());
});

test("không có id trùng lặp giữa các gói", () => {
  const ids = WORKSHEET_TOPIC_PACKAGES.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, "phát hiện id trùng lặp");
});
