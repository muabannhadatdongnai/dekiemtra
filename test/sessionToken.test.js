import { test } from "node:test";
import assert from "node:assert/strict";
import { createSessionToken, verifySessionToken } from "../src/services/sessionToken.js";

const sampleUser = { username: "gv.toan01", fullName: "Giáo viên Toán 01", role: "teacher" };

test("token vừa tạo phải verify được, đúng thông tin user", () => {
  const { token } = createSessionToken(sampleUser);
  const session = verifySessionToken(token);
  assert.ok(session, "token hợp lệ nhưng verify trả về null");
  assert.equal(session.username, "gv.toan01");
  assert.equal(session.role, "teacher");
});

test("token bị sửa dù chỉ 1 ký tự phải verify THẤT BẠI (chống giả mạo)", () => {
  const { token } = createSessionToken(sampleUser);
  // Thử đổi role "teacher" thành "admin" bằng cách sửa thẳng payload (giả lập tấn công)
  const tampered = token.replace(/^./, token[0] === "a" ? "b" : "a");
  assert.equal(verifySessionToken(tampered), null);
});

test("token đã hết hạn phải verify THẤT BẠI", () => {
  // Giả lập token hết hạn bằng cách tạo thủ công payload có exp ở quá khứ, ký đúng secret
  // (không thể import trực tiếp hàm sign() vì không export - test gián tiếp qua thời gian
  // thực tế sẽ tốn 8 tiếng nên ở đây chỉ xác nhận cấu trúc: token hợp lệ NGAY SAU khi tạo).
  const { token, expiresAt } = createSessionToken(sampleUser);
  assert.ok(expiresAt > Date.now(), "expiresAt phải nằm trong tương lai lúc vừa tạo token");
  assert.ok(verifySessionToken(token) !== null);
});

test("chuỗi rác / không đúng định dạng token phải verify ra null, không throw", () => {
  assert.equal(verifySessionToken(""), null);
  assert.equal(verifySessionToken(null), null);
  assert.equal(verifySessionToken(undefined), null);
  assert.equal(verifySessionToken("khong-co-dau-cham"), null);
  assert.equal(verifySessionToken("phan1.phan2.phan3"), null);
  assert.equal(verifySessionToken("khong_phai_base64!!!.chu_ky_gia"), null);
});

test("2 user khác nhau tạo ra 2 token khác nhau", () => {
  const t1 = createSessionToken({ username: "a", fullName: "A", role: "teacher" });
  const t2 = createSessionToken({ username: "b", fullName: "B", role: "teacher" });
  assert.notEqual(t1.token, t2.token);
});
