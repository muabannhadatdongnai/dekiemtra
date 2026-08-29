import { test } from "node:test";
import assert from "node:assert/strict";
import { buildLessonPlanPrompt } from "../src/data/lessonPlanPromptTemplates.js";
import { buildLessonPlanDocxSections } from "../src/services/lessonPlanExportService.js";
import { getIntegration, INTEGRATION_KEYS } from "../src/data/lessonPlanIntegrations.js";

/**
 * lessonPlanPhien28.test.js
 * Test cho 2 chỉnh sửa PHIÊN 28 (tab Soạn Giáo Án), theo yêu cầu thực tế của giáo viên:
 * a) Quy tắc tích hợp GDQP&AN không còn ép buộc - chỉ giữ khi bài học có liên kết logic, ngược
 *    lại tự chuyển sang Đạo đức/Kỹ năng sống/Quyền Trẻ em (kèm nhãn hiển thị động).
 * b) Phụ lục "Gợi ý thiết kế Học liệu" (3 từ khoá tạo ảnh AI) tự động xuất hiện cho Lớp 1-3.
 */

// ---------- a) Quy tắc tích hợp GDQP&AN ----------

test("buildPromptFragment (TICH_HOP_GDQPAN): luôn có quy tắc điều kiện + yêu cầu trả về nhãn động", () => {
  const integration = getIntegration(INTEGRATION_KEYS.TICH_HOP_GDQPAN);
  const fragment = integration.buildPromptFragment({ grade: 5 });
  assert.match(fragment, /QUÁ CƠ BẢN/, "phải nêu rõ trường hợp bài học quá cơ bản");
  assert.match(fragment, /Giáo dục Đạo đức/);
  assert.match(fragment, /Giáo dục Kỹ năng sống/);
  assert.match(fragment, /Giáo dục Quyền Trẻ em/);
  assert.match(fragment, /"tichHopGDQPANNhan"/, "phải yêu cầu AI trả thêm field nhãn động");
});

test("buildPromptFragment (TICH_HOP_GDQPAN): CHỈ thêm ghi chú nhấn mạnh riêng khi grade <= 3", () => {
  const integration = getIntegration(INTEGRATION_KEYS.TICH_HOP_GDQPAN);
  for (const grade of [1, 2, 3]) {
    const fragment = integration.buildPromptFragment({ grade });
    assert.match(
      fragment,
      new RegExp(`Đây là bài học Lớp ${grade}`),
      `grade=${grade} phải có ghi chú nhấn mạnh riêng`
    );
  }
  for (const grade of [4, 5]) {
    const fragment = integration.buildPromptFragment({ grade });
    assert.doesNotMatch(
      fragment,
      new RegExp(`Đây là bài học Lớp ${grade}`),
      `grade=${grade} KHÔNG cần ghi chú nhấn mạnh riêng (đã đủ trưởng thành để GDQP&AN tự nhiên hơn)`
    );
  }
});

test("schemaExample (TICH_HOP_GDQPAN): chứa cả 2 field tichHopGDQPAN và tichHopGDQPANNhan", () => {
  const integration = getIntegration(INTEGRATION_KEYS.TICH_HOP_GDQPAN);
  assert.match(integration.schemaExample, /"tichHopGDQPAN"/);
  assert.match(integration.schemaExample, /"tichHopGDQPANNhan"/);
});

test("buildLessonPlanPrompt: khi bật tích hợp GDQP&AN, prompt cuối cùng vẫn giữ đủ hướng dẫn (không bị cắt mất khi ghép integrationsBlock)", () => {
  const prompt = buildLessonPlanPrompt({
    tenBai: "Bảo vệ chủ quyền biển đảo",
    grade: 5,
    subject: "lich_su_dia_ly",
    integrations: [INTEGRATION_KEYS.TICH_HOP_GDQPAN],
  });
  assert.match(prompt, /tichHopGDQPANNhan/);
  assert.match(prompt, /QUÁ CƠ BẢN/);
});

// ---------- b) Nhãn hiển thị động khi xuất Word ----------

test("buildLessonPlanDocxSections: dùng nhãn ĐỘNG (tichHopGDQPANNhan) khi AI trả về, thay vì hardcode 'Tích hợp GDQP&AN'", () => {
  const lessonPlan = {
    tenBai: "Học vần: chữ a",
    yeuCauCanDat: {},
    doDungDayHoc: {},
    hoatDong: [],
    tichHopGDQPAN: "Giáo dục các con biết chào hỏi lễ phép, giữ kỷ luật khi xếp hàng ra vào lớp.",
    tichHopGDQPANNhan: "Tích hợp Giáo dục Đạo đức",
  };
  const children = buildLessonPlanDocxSections({ lessonPlan, timeline: [], meta: { grade: 1, soTiet: 1 } });
  const texts = children.flatMap((p) => (p.root || []).flatMap((r) => r.root || []));
  const fullText = JSON.stringify(children);
  assert.match(fullText, /Tích hợp Giáo dục Đạo đức/, "phải dùng đúng nhãn động AI trả về");
  assert.doesNotMatch(
    fullText.replace("Tích hợp Giáo dục Đạo đức", ""),
    /Tích hợp GDQP&AN/,
    "KHÔNG được còn sót nhãn cứng 'Tích hợp GDQP&AN' khi đã có nhãn động khác"
  );
});

test("buildLessonPlanDocxSections: fallback về nhãn mặc định 'Tích hợp GDQP&AN' nếu AI không trả tichHopGDQPANNhan (tương thích ngược)", () => {
  const lessonPlan = {
    tenBai: "Bảo vệ chủ quyền biển đảo",
    yeuCauCanDat: {},
    doDungDayHoc: {},
    hoatDong: [],
    tichHopGDQPAN: "Giáo dục tinh thần yêu nước, ý thức bảo vệ chủ quyền biển đảo.",
    // KHÔNG có tichHopGDQPANNhan - mô phỏng phản hồi AI cũ/thiếu field.
  };
  const children = buildLessonPlanDocxSections({ lessonPlan, timeline: [], meta: { grade: 5, soTiet: 1 } });
  const fullText = JSON.stringify(children);
  assert.match(fullText, /Tích hợp GDQP&AN/, "phải fallback về nhãn mặc định");
});

// ---------- c) Phụ lục "Gợi ý thiết kế Học liệu" tự động Lớp 1-3 ----------

test("buildLessonPlanPrompt: TỰ ĐỘNG thêm hướng dẫn + schema 'goiYHocLieuHinhAnh' cho Lớp 1-3, KHÔNG cần bật tích hợp nào", () => {
  for (const grade of [1, 2, 3]) {
    const prompt = buildLessonPlanPrompt({
      tenBai: "Học vần: chữ a",
      grade,
      subject: "tieng_viet",
      integrations: [], // cố ý KHÔNG bật tích hợp nào - phải vẫn tự động có
    });
    assert.match(prompt, /GỢI Ý THIẾT KẾ HỌC LIỆU/, `grade=${grade} phải tự động có hướng dẫn`);
    assert.match(prompt, /"goiYHocLieuHinhAnh"/, `grade=${grade} phải tự động có trong schema JSON mẫu`);
  }
});

test("buildLessonPlanPrompt: KHÔNG tự động thêm 'Gợi ý thiết kế Học liệu' cho Lớp 4-5 và Mầm non", () => {
  for (const grade of [4, 5, "MAM_NON"]) {
    const prompt = buildLessonPlanPrompt({
      tenBai: grade === "MAM_NON" ? "Nhận biết con vật" : "Phân số",
      grade,
      subject: grade === "MAM_NON" ? undefined : "toan",
      integrations: [],
    });
    assert.doesNotMatch(prompt, /GỢI Ý THIẾT KẾ HỌC LIỆU/, `grade=${grade} KHÔNG được tự động thêm mục này`);
    assert.doesNotMatch(prompt, /"goiYHocLieuHinhAnh"/, `grade=${grade} KHÔNG được có field này trong schema mẫu`);
  }
});

test("buildLessonPlanDocxSections: xuất đúng phụ lục 'Gợi ý thiết kế Học liệu' khi lessonPlan có goiYHocLieuHinhAnh", () => {
  const lessonPlan = {
    tenBai: "Học vần: chữ a",
    yeuCauCanDat: {},
    doDungDayHoc: {},
    hoatDong: [],
    goiYHocLieuHinhAnh: [
      "Một quả táo hoạt hình dễ thương có chữ 'a'",
      "Một học sinh vui vẻ đang chào cô giáo",
      "Một chiếc ô tô đồ chơi màu đỏ có chữ 'a' trên thân xe",
    ],
  };
  const children = buildLessonPlanDocxSections({ lessonPlan, timeline: [], meta: { grade: 1, soTiet: 1 } });
  const fullText = JSON.stringify(children);
  assert.match(fullText, /GỢI Ý THIẾT KẾ HỌC LIỆU/);
  assert.match(fullText, /quả táo hoạt hình/);
  assert.match(fullText, /học sinh vui vẻ đang chào/);
});

test("buildLessonPlanDocxSections: KHÔNG render phụ lục Học liệu khi lessonPlan không có goiYHocLieuHinhAnh (VD Lớp 4-5)", () => {
  const lessonPlan = {
    tenBai: "Phân số",
    yeuCauCanDat: {},
    doDungDayHoc: {},
    hoatDong: [],
  };
  const children = buildLessonPlanDocxSections({ lessonPlan, timeline: [], meta: { grade: 4, soTiet: 1 } });
  const fullText = JSON.stringify(children);
  assert.doesNotMatch(fullText, /GỢI Ý THIẾT KẾ HỌC LIỆU/);
});
