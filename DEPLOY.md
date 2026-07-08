# Hướng dẫn Upload GitHub & Cài đặt Vercel

## PHẦN A — Đưa code lên GitHub

### A1. Tạo repo mới cho ứng dụng (khác với repo kho kiến thức Markdown)

1. Vào https://github.com/new
2. Đặt tên, ví dụ: `ai-exam-generator-app`
3. Chọn **Private** (khuyến nghị, vì trong này có `users.json` chứa tài khoản) hoặc Public nếu bạn
   không ngại lộ danh sách username (password vẫn nằm trong code, nên **Private là an toàn hơn**).
4. KHÔNG tích "Add README" (vì bạn đã có sẵn).
5. Bấm **Create repository**.

### A2. Đẩy code từ máy bạn lên repo vừa tạo

Giải nén file `ai-exam-generator.zip`, mở Terminal tại thư mục đó rồi chạy:

```bash
cd ai-exam-generator
git init
git add .
git commit -m "Khởi tạo AI Exam Generator"
git branch -M main
git remote add origin https://github.com/<TÊN_GITHUB_CỦA_BẠN>/ai-exam-generator-app.git
git push -u origin main
```

> Nếu Git hỏi đăng nhập, dùng **Personal Access Token** (không dùng mật khẩu GitHub thường) —
> tạo tại: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.

### A3. Tạo repo kho kiến thức (RIÊNG, tách biệt với repo code)

Đây là repo thứ 2, chứa các file `.md` để AI đọc làm ngữ liệu — xem cấu trúc yêu cầu trong README
mục "Bước 2: Chuẩn bị kho kiến thức GitHub". Ví dụ đặt tên `mon-toan-sgk` (có thể để Public vì
không chứa thông tin nhạy cảm).

```bash
sach_giao_khoa/
  lop_6/
    toan_t1/chuong_1.md
    toan_t2/chuong_1.md
  lop_7/
    ...
```

Ghi nhớ tên repo dạng `username/mon-toan-sgk` — sẽ cần điền vào biến môi trường ở Vercel.

---

## PHẦN B — Triển khai lên Vercel (miễn phí)

### B1. Kết nối Vercel với GitHub

1. Vào https://vercel.com/signup → chọn **Continue with GitHub**, cấp quyền truy cập.
2. Sau khi vào Dashboard, bấm **Add New... → Project**.
3. Chọn repo `ai-exam-generator-app` bạn vừa đẩy lên → bấm **Import**.

### B2. Cấu hình biến môi trường (BẮT BUỘC trước khi Deploy)

Trong màn hình "Configure Project", mở mục **Environment Variables** và thêm từng biến:

| Key | Value | Ghi chú |
|---|---|---|
| `GEMINI_API_KEY` | (dán API key của bạn) | Dùng khi chỉ có 1 key. Lấy free tại https://aistudio.google.com/app/apikey |
| `GEMINI_API_KEYS` | `key1,key2,key3` | **Khuyến nghị**: nhiều key từ nhiều tài khoản Google khác nhau, phân tách dấu phẩy, KHÔNG khoảng trắng. Nếu đặt biến này, nó được ưu tiên dùng thay `GEMINI_API_KEY`. Hệ thống tự xoay vòng ngẫu nhiên + tự chuyển key khi 1 key hết hạn mức. |
| `GITHUB_KNOWLEDGE_REPO` | `username/mon-toan-sgk` | Repo kho kiến thức ở Phần A3 |
| `GITHUB_BRANCH` | `main` | |
| `GITHUB_TOKEN` | (tuỳ chọn) | Chỉ cần nếu repo kiến thức để Private, hoặc muốn tăng rate-limit |

Framework Preset: Vercel sẽ tự nhận diện **Next.js** — không cần chỉnh Build Command/Output Directory.

### B3. Deploy

Bấm **Deploy**. Chờ khoảng 1–2 phút, Vercel sẽ build và cấp cho bạn 1 domain dạng:
`https://ai-exam-generator-app.vercel.app`

### B4. Thêm tài khoản giáo viên

File `src/data/users.json` nằm trong code, nên **mỗi lần muốn thêm/xoá tài khoản giáo viên**, bạn
cần: sửa file này trên máy → `git commit` → `git push` → Vercel sẽ tự động deploy lại (mất ~1 phút).

```bash
git add src/data/users.json
git commit -m "Thêm tài khoản giáo viên mới"
git push
```

### B5. Cập nhật biến môi trường sau này

Nếu cần đổi `GEMINI_API_KEY` hoặc repo kiến thức: vào Vercel Dashboard → chọn project →
**Settings → Environment Variables** → sửa giá trị → **Save** → vào tab **Deployments** →
bấm **Redeploy** ở bản mới nhất (biến môi trường chỉ áp dụng cho lần deploy tiếp theo).

---

## Kiểm tra sau khi deploy

1. Mở domain Vercel → đăng nhập bằng tài khoản trong `users.json`.
2. Chọn Lớp/Tập/Chương → bấm "🚀 TẠO ĐỀ THI NGAY".
3. Nếu báo lỗi "Không thể tải tài liệu..." → kiểm tra lại `GITHUB_KNOWLEDGE_REPO` và cấu trúc
   thư mục file `.md` (mục A3).
4. Nếu báo lỗi liên quan Gemini → kiểm tra lại `GEMINI_API_KEY` còn hạn mức free hay không tại
   https://aistudio.google.com.

## Các lỗi thường gặp đã từng xảy ra (và cách phát hiện lại nếu tái diễn)

**"Chỉ tạo được 0/N câu" ở TẤT CẢ các mức độ cùng lúc:**
Đây KHÔNG phải do trùng lặp (dù thông báo có ghi vậy) — gần như chắc chắn là do model Gemini
đang dùng đã bị Google khai tử (shutdown), mọi request trả về lỗi 404 âm thầm bị bắt trong
`try/catch` và tính là "thất bại, thử lại", đến hết lượt retry thì trả về 0 câu.
→ Kiểm tra https://ai.google.dev/gemini-api/docs/deprecations, cập nhật lại giá trị `model`
trong `src/data/promptTemplates.js` (biến `DIFFICULTY_LEVELS`).

**Lỗi 404 khi liệt kê Chương/Bài học:**
Kiểm tra `GITHUB_KNOWLEDGE_REPO` CHỈ được gồm đúng `owner/repo` (2 phần), KHÔNG thêm đường dẫn
thư mục con vào biến này (thư mục con `sach_giao_khoa/...` đã được code tự động thêm sẵn).

**KHÔNG BAO GIỜ commit file `.env.local` lên Git** (kể cả repo Private) — file này chứa API
key thật. Luôn đặt key trực tiếp trong Vercel Environment Variables. Nếu lỡ commit và push lên
GitHub rồi, phải coi như key đã bị lộ: vào Google AI Studio revoke key cũ và tạo key mới ngay,
xoá file khỏi repo bằng `git rm --cached .env.local` KHÔNG đủ để bảo vệ key đã lộ (lịch sử
commit vẫn còn), chỉ ngăn được rò rỉ tiếp theo.
