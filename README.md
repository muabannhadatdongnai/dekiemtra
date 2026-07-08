# AI Exam Generator 🎓

Nền tảng tạo đề kiểm tra tự động bằng AI cho 4 môn (Toán, Tiếng Việt, Tiếng Anh, Lịch sử),
Lớp 1–12, chi phí duy trì **$0**.

## Bước 1: Cài đặt & cấu trúc thư mục

```bash
npm install
cp .env.local.example .env.local
```

Mở `.env.local` và điền:

```env
GEMINI_API_KEY=...              # ⚠️ lấy free tại https://aistudio.google.com/app/apikey
GITHUB_KNOWLEDGE_REPO=USER/REPO # ⚠️ repo chứa kho kiến thức markdown của bạn
GITHUB_BRANCH=main
GITHUB_TOKEN=                   # tuỳ chọn, tăng rate-limit khi liệt kê chương
```

```bash
npm run dev
```

Mở http://localhost:3000, đăng nhập bằng tài khoản mẫu trong `src/data/users.json`
(`gv.toan01` / `toan123`). **⚠️ Tự thêm tài khoản giáo viên thủ công vào file này.**

Cấu trúc thư mục:

```text
src/
├── components/
│   ├── Header.jsx
│   ├── LoginForm.jsx
│   ├── ExamMatrixForm.jsx     <- Thông tin chung + chọn kiến thức + ma trận stepper
│   ├── A4LivePreview.jsx      <- Khung A4 + Header chuẩn Bộ GD&ĐT
│   └── ExportActions.jsx      <- 4 Mã đề, Word, PDF
├── services/
│   ├── authService.js         <- verify server-side + session localStorage
│   ├── githubService.js       <- fetchMarkdownFromGitHub(grade, subject, volume, chapter)
│   ├── geminiEngine.js        <- routing model + 3 lớp chống trùng
│   ├── exportService.js       <- LaTeX->OMML, 4 mã đề, Word/PDF
│   └── latexUtils.js          <- tách đoạn $...$ dùng chung preview/export
├── data/
│   ├── users.json
│   └── promptTemplates.js     <- ma trận prompt + seed chống trùng
└── app/
    ├── page.js                <- Split-screen 40/60
    └── api/{login,generate,chapters}/route.js
```

## Bước 2: Chuẩn bị kho kiến thức GitHub (RAG)

Repo kiến thức (có thể **public**) phải theo đúng cấu trúc. Mỗi môn có 1 slug riêng
(tự động suy ra từ giá trị môn học, viết thường, gạch dưới):

| Môn học | Slug thư mục |
|---|---|
| Toán | `toan` |
| Tiếng Việt | `tieng_viet` |
| Tiếng Anh | `tieng_anh` |
| Lịch sử | `lich_su` |

```
sach_giao_khoa/
  lop_5/
    toan_t1/
      chuong_1.md
      chuong_2.md
    toan_t2/
      chuong_1.md
    tieng_viet_t1/
      chuong_1.md
    tieng_anh_t1/
      chuong_1.md
    lich_su_t1/
      chuong_1.md
  lop_6/
    ...
```

→ Tương ứng URL Raw: `https://raw.githubusercontent.com/USER/REPO/main/sach_giao_khoa/lop_5/toan_t2/chuong_3.md`

**Sách nâng cao (dành cho học sinh giỏi):** đặt NGUYÊN VĂN cả cuốn trong 1 file duy nhất,
KHÔNG chia theo chương, KHÔNG phụ thuộc Tập (dùng chung cả năm học):

```
sach_giao_khoa/
  lop_5/
    toan_nang_cao.md   <- nguyên cả cuốn, không tách chương
```

Khi file này tồn tại, giao diện sẽ tự hiện thêm 1 lựa chọn riêng "📘 Sách nâng cao (toàn bộ)"
bên cạnh danh sách chương thường, giáo viên có thể chọn để AI khai thác thêm nguồn nâng cao
này (đặc biệt hữu ích cho câu Vận dụng cao).

Mỗi file `.md` nên chứa định nghĩa, công thức LaTeX (`$...$`), ví dụ minh hoạ, và (nếu có)
mục "Vận dụng cao" — Gemini Pro sẽ ưu tiên khai thác mục này cho câu khó/rất khó.

## Bước 3: Luồng sử dụng

1. Đăng nhập (kiểm tra server-side qua `users.json`, trạng thái lưu ở `localStorage`,
   không dùng JWT).
2. **Cột trái (40%)**: điền thông tin chung (trường, lớp, thời gian, năm học, tên bài kiểm
   tra) → chọn Môn → Lớp → Tập → Chương (tự tải qua GitHub API) → chỉnh ma trận 4 mức độ.
3. Bấm **"🚀 TẠO ĐỀ THI NGAY"** → gọi `/api/generate`:
   - `githubService.fetchMarkdownFromGitHub` lấy nội dung các chương đã chọn.
   - `geminiEngine` gọi `gemini-3.5-flash` cho cả 4 mức độ (Google không có gói miễn phí cho
     bất kỳ model Pro nào hiện tại; 3.5 Flash được Google mô tả là "gần bằng chất lượng Pro"
     nên vẫn đủ dùng cho câu Vận dụng/Vận dụng cao mà không cần bật billing)
     song song, với `temperature: 0.75` + seed ngẫu nhiên mỗi lượt + yêu cầu random sampling
     phân vùng kiến thức → **Lớp chống trùng #1**.
   - Kết quả được hash + so khớp Jaccard similarity để loại câu trùng → **Lớp chống trùng #2 & #3**.
   - AI trả về `questions` (đề học sinh) và `teacher_rubric` (đáp án + thang điểm chi tiết).
4. **Cột phải (60%)**: xem trước khổ A4 thật, Header chuẩn Bộ GD&ĐT (bảng Điểm/Nhận xét 30%
   + thông tin bài kiểm tra 70%), công thức Toán render bằng KaTeX.
5. **"Tạo 4 Mã Đề (A, B, C, D)"**: xáo trộn câu hỏi + đáp án từ đề gốc, KHÔNG gọi lại Gemini
   → tiết kiệm chi phí AI tối đa.
6. **Tải Word (.docx)**: công thức Toán là Equation OOXML thật (LaTeX → MathML → OMML,
   chèn trực tiếp vào `document.xml`), trang "Đáp án & Thang điểm" tự ngắt sang trang riêng
   ở cuối file.
7. **In / Tải PDF**: `window.print()` trên vùng đã style `@media print` — ẩn toàn bộ UI,
   ép khổ A4, tự ngắt trang rubric.

## Câu hỏi trực quan (Tiểu học Lớp 1-5)

Hệ thống hỗ trợ 4 dạng câu hỏi trực quan đặc trưng Toán Tiểu học VN, cộng thêm khung kẻ ô nháp:

| Dạng | Ví dụ | File liên quan |
|---|---|---|
| Đặt tính rồi tính | `37 + 56` dạng cột dọc | `visualSchemas.js`, `visuals/VerticalArithmetic.jsx` |
| Cây số / tam giác quan hệ | Tam giác 3 đỉnh, 1 đỉnh ẩn | `visuals/NumberTriangle.jsx` |
| Sơ đồ đoạn thẳng (so sánh hơn-kém) | "255 bao" chia 2 phần | `visuals/BarModel.jsx` |
| Hình đếm trực quan (phân số) | Khoanh 1/4 số ngôi sao | `visuals/VisualCounting.jsx` |
| Khung kẻ ô nháp | Không gian làm bài tay | `visuals/ScratchGrid.jsx` |

**Nguyên tắc cốt lõi**: AI (Gemini) CHỈ sinh ra **số liệu** (vd 2 số cần cộng, 3 đỉnh tam giác),
KHÔNG bao giờ được yêu cầu "vẽ" hình bằng text. Hệ thống tự vẽ hình từ số liệu đó (SVG cho
preview/PDF trong `components/visuals/`, Table cho Word trong `services/visualExportBuilders.js`)
— vừa đáng tin cậy tuyệt đối, vừa không tốn thêm token đáng kể. Toàn bộ `visualData` còn được
CODE tự kiểm tra tính đúng đắn toán học (`isValidVisualData`) và tự tính đáp án chính xác
(`computeVisualAnswer`) — không bao giờ tin vào phép tính của AI cho các dạng này.

Bật/tắt qua checkbox "Cho phép câu hỏi trực quan" trong form (mặc định BẬT, phù hợp Lớp 1-5).

## Triển khai miễn phí lên Vercel

```bash
npm i -g vercel
vercel
```

Thêm các biến môi trường (`GEMINI_API_KEY`, `GITHUB_KNOWLEDGE_REPO`, `GITHUB_BRANCH`,
`GITHUB_TOKEN`) trong Vercel Dashboard → Settings → Environment Variables.

## Giới hạn & hướng nâng cấp tiếp theo

- `mathml2omml` xử lý tốt ký hiệu Toán phổ thông (phân số, căn, luỹ thừa...); ký hiệu quá
  đặc thù có thể không map 100% chính xác — hệ thống tự fallback về hiển thị `$...$` thô
  nếu convert lỗi, không làm vỡ file.
- Lớp chống trùng hash/similarity hiện chỉ hoạt động **trong 1 lần tạo đề**. Muốn chống
  trùng xuyên nhiều lần tạo đề (nhiều buổi kiểm tra khác nhau), cần lưu ngân hàng câu hỏi
  bền vững — ví dụ commit ngược danh sách câu đã tạo lên 1 file trong repo GitHub.
- `users.json` lưu password dạng plaintext, phù hợp vài chục giáo viên nội bộ. Nếu mở rộng
  quy mô, nên hash bằng bcrypt trước khi so sánh trong `verifyCredentials`.
- Đăng nhập hiện chỉ verify server-side 1 lần rồi lưu `localStorage`; API `/api/generate`
  chỉ kiểm tra `username` có tồn tại trong `users.json` (không xác thực lại password) —
  đủ dùng cho môi trường nội bộ tin cậy, không nên dùng cho hệ thống công khai nhiều người
  lạ truy cập.
