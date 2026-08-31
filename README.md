# Đề Kiểm Tra (dekiemtra)

Trợ lý sư phạm toàn diện, **miễn phí**, chạy bằng AI, dành cho giáo viên Tiểu học Việt Nam (Mầm
non – Lớp 5), bám sát bộ sách giáo khoa **Kết nối tri thức với cuộc sống**. Mục tiêu vận hành:
chi phí **$0** (Vercel + Upstash Redis free tier + AI backbone Gemini qua pool nhiều API key).

> Tài liệu này mô tả TÍNH NĂNG hiện có. Muốn biết việc gì đang dở dang / cần quyết định, xem
> [`NEXT_STEPS.md`](./NEXT_STEPS.md). Muốn xem lịch sử phát triển chi tiết theo từng phiên, xem
> [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md).

## Các tab / mô-đun

| # | Tab | Khối lớp | Mô tả |
|---|-----|----------|-------|
| 1 | 📘 Soạn Giáo án | Mầm non – Lớp 5 | Sinh giáo án đầy đủ Mục I-IV theo đúng khuôn Thông tư/Công văn hiện hành, hỗ trợ upload giáo án mẫu (Word/PDF/ảnh) để "bám sát mẫu" hoặc "kết hợp mẫu + SGK", gợi ý Tên bài + tự điền Nội dung cốt lõi theo Sách giáo viên (cần dữ liệu GitHub, xem `NEXT_STEPS.md`), 8 "tích hợp" tuỳ chọn kiểu plugin (Mindmap/Infographic, Củng cố, Phiếu học tập, Tin nhắn Zalo phụ huynh, tích hợp GDQP&AN thông minh không ép buộc, gợi ý thiết kế học liệu hình ảnh cho Lớp 1-3...), 3 phong cách soạn (preset + tự do), checklist đánh giá Năng lực-Phẩm chất, cơ chế chống trùng lặp giữa các lần soạn liên tiếp. |
| 2 | 🧮 Phiếu Bài Tập | Mầm non – Lớp 5 | Sinh phiếu bài tập Toán + Tiếng Việt bằng generator thuần code (không cần AI cho phần số liệu) theo đúng catalog dạng bài từng khối, xuất Word + xem trước web, chế độ in Màu/Đen trắng. Toán Lớp 3-5 đã đủ catalog theo đúng SGK KNTT (12-14 dạng bài/khối); Tiếng Việt hiện chủ yếu ở Lớp 1 (đang giới hạn 1 dạng bài AI-sinh sau khi phát hiện lỗi vượt cấp, xem `NEXT_STEPS.md`). |
| 3 | 📖 Đề Tiếng Việt Tiểu học | Lớp 1-5 | Đề kiểm tra Tiếng Việt riêng (không dùng khuôn Ma trận đề chung vì cấu trúc khác hẳn): 4 khối Đọc thành tiếng / Đọc thầm / Chính tả / Tập làm văn, có liên kết SGK Tiếng Việt thật (gợi ý Tên bài + trích ngữ liệu chương làm ngữ cảnh cho AI, KHÔNG tự điền nguyên văn Chính tả để tránh vi phạm bản quyền/bịa nội dung). |
| 4 | 📝 Đề Cương Ôn Tập | Lớp 1-5 | Sinh đề cương ôn tập theo chương/chủ đề đã chọn, dùng chung kho kiến thức GitHub + `subjectProfiles.js` với 2 tab kia. |
| 5 | 🧾 Tạo Đề Kiểm Tra | Lớp 1-5 | Đề kiểm tra theo ma trận (số câu/mức độ nhận thức mỗi chương), tính điểm tự động không lỗi làm tròn âm (đã sửa), xuất Word + PDF (`window.print()`). |
| 6 | 💬 Nhận Xét Học Bạ | Lớp 1-5 | Sinh nhận xét học bạ theo học sinh, lưu lịch sử theo học kỳ qua Upstash Redis. |
| 7 | 📚 Hướng dẫn sử dụng | - | Tab tĩnh hướng dẫn thao tác cho giáo viên. |

**Chưa kích hoạt** (đã code đủ 4 tầng nhưng chưa nối vào `page.js`, đang chờ Hoan quyết định giữ
hay xoá): Tô màu (Coloring Page) — xem mục 🔴 trong `NEXT_STEPS.md`.

## Môn học & khối lớp hỗ trợ (tab Soạn Giáo án / Đề Cương Ôn Tập / Tạo Đề Kiểm Tra)

3 tab trên dùng chung 1 danh sách môn (`src/data/config.js`), tự lọc đúng môn theo khối lớp đang
chọn (không cho chọn nhầm môn không tồn tại ở khối đó), theo đúng Thông tư 32/2018/TT-BGDĐT:

| Môn | Khối dạy |
|-----|----------|
| Tiếng Việt | 1-5 |
| Toán | 1-5 |
| Đạo đức | 1-5 |
| Tiếng Anh | 1-5 |
| Tự nhiên và Xã hội | 1-3 |
| Lịch sử và Địa lí | 4-5 |
| Khoa học | 4-5 |
| Tin học | 3-5 |
| Công nghệ | 3-5 |
| Lịch sử *(bậc THCS/THPT)* | 6-12 |

Mỗi môn có 1 profile riêng (`src/data/subjectProfiles.js`) định nghĩa vai trò AI + quy tắc nội
dung riêng (VD Đạo đức ưu tiên tình huống ứng xử thay vì học thuộc định nghĩa; Khoa học không mở
rộng sang kiến thức THCS; Lịch sử và Địa lí tách rõ 2 phân môn không trộn lẫn).

Cố ý **chưa** thêm Giáo dục thể chất/Âm nhạc/Mĩ thuật/Hoạt động trải nghiệm — các môn này đánh giá
bằng nhận xét (không có kiểm tra định kỳ theo ma trận đề) và cấu trúc giáo án khác hẳn dạng
chương-bài SGK hiện dùng.

## Kiến trúc & quy ước quan trọng

- **Isolation over DRY**: mỗi tính năng/dạng bài/khối lớp có code/data riêng, chấp nhận trùng lặp
  để dễ sửa lỗi độc lập, không sợ sửa chỗ này vỡ chỗ khác.
- **4 tầng bắt buộc** cho mỗi dạng bài Phiếu Bài Tập mới: catalog (`worksheetExerciseCatalog.js`)
  → generator (`worksheetSchemas.js`/`worksheetGenerator.js`) → preview web
  (`WorksheetPreview.jsx`) → xuất Word (`worksheetExportService.js`). Thiếu 1 tầng = chưa xong.
- **Chính xác chương trình là điều kiện KHÔNG được đánh đổi**: không suy đoán kiến thức SGK, luôn
  tra cứu/xác nhận trước khi code (VD: quy tắc Lớp 5 KHÔNG dùng hình trụ/hình cầu tính diện
  tích-thể tích; Lớp 4 nhận diện góc chỉ bằng ê-ke, không dùng số đo độ; Khoa học chỉ tồn tại từ
  Lớp 4).
- **Chống bịa/vi phạm bản quyền SGK**: AI không được tự sinh nguyên văn ngữ liệu SGK (VD khối
  Chính tả) — chỉ gợi nhớ bằng mô tả ngắn, giáo viên tự gõ nguyên văn.
- **Ký tự Unicode hiếm không đáng tin trong Word**: mọi hình vẽ minh hoạ (line-art, thanh đo, biểu
  đồ, hình khối) xuất bằng ẢNH PNG (SVG→PNG rasterize 1 lần, nhúng `ImageRun`), không dùng ký tự
  Unicode lặp lại vì phụ thuộc font máy người dùng (từng gây lỗi thật, xem Phiên 24 trong
  `PROJECT_SUMMARY.md`).
- **Grep trước khi giả định phạm vi**: luôn xác nhận số file/chỗ dùng thật qua code trước khi sửa
  hoặc xoá, không suy đoán từ tài liệu cũ (tài liệu có thể đã lệch so với code thật).

## Cấu trúc thư mục (rút gọn)

```
src/
├── app/
│   ├── page.js                      # điều phối 7 tab, chỉ 1 tab mount tại 1 thời điểm
│   └── api/{login,chapters,lessons,generate,generate-worksheet,generate-lesson-plan,
│            generate-vietnamese-exam,generate-outline,usage,
│            analyze-sample,analyze-worksheet-sample,analyze-lesson-plan-sample,...}/route.js
├── components/
│   ├── ExamMatrixForm.jsx / A4LivePreview.jsx / ExportActions.jsx        (Tạo Đề Kiểm Tra)
│   ├── WorksheetForm.jsx / WorksheetPreview.jsx                          (Phiếu Bài Tập)
│   ├── LessonPlanForm.jsx / LessonPlanPreview.jsx                        (Soạn Giáo án)
│   ├── VietnameseExamForm.jsx / VietnameseExamPreview.jsx / vietnameseBlocks/*  (Đề Tiếng Việt)
│   ├── OutlineForm.jsx / OutlinePreview.jsx                              (Đề Cương Ôn Tập)
│   ├── ReportCommentForm.jsx / ReportCommentPreview.jsx                  (Nhận Xét Học Bạ)
│   └── visuals/{...}                                                    (icon/hình minh hoạ dùng chung)
├── services/
│   ├── githubService.js             # đọc chương/bài SGK từ kho GitHub kiến thức (SGK thật)
│   ├── geminiEngine.js / geminiKeyPool.js / geminiUsageTracker.js
│   ├── worksheetGenerator.js / worksheetExportService.js
│   ├── lessonPlanOrchestrator.js / lessonPlanExportService.js
│   ├── upstashClient.js             # Redis: session counter, lịch sử học bạ, rate limit
│   └── ...
└── data/
    ├── config.js                    # SUBJECTS/GRADES dùng chung 3 tab (nguồn xác thực duy nhất)
    ├── subjectProfiles.js           # vai trò AI + quy tắc riêng theo môn
    ├── gradeProfiles.js             # đặc điểm nhận thức theo khối lớp
    ├── worksheetExerciseCatalog.js / worksheetSchemas.js / worksheetTopicPackages.js
    ├── lessonPlanTemplates.js / lessonPlanBlueprint.js / lessonPlanPromptTemplates.js
    ├── outlineBlueprint.js / outlinePromptTemplates.js
    ├── examBlueprint.js / promptTemplates.js
    └── ...
```

## Công nghệ

- **Next.js 14** (App Router), deploy **Vercel**.
- **AI backbone**: Gemini (`@google/genai`) qua pool nhiều API key để né rate-limit free tier.
- **Upstash Redis**: đếm phiên online ẩn danh, lịch sử nhận xét học bạ, rate-limit theo giáo viên.
- **docx** (thư viện `docx`), **JSZip** (kiểm tra file `.docx` trong test), SVG rasterize sang PNG
  cho mọi hình minh hoạ trong Word.
- **Kho kiến thức GitHub riêng** (biến môi trường `GITHUB_KNOWLEDGE_REPO`): chứa nội dung SGK thật
  theo cấu trúc `sach_giao_khoa/lop_{khối}/{môn}_t{tập}/chuong_{n}.md` (+ `chuong_{n}_bai.json`
  tuỳ chọn cho gợi ý theo Bài) — dữ liệu này do Hoan tự quản lý, KHÔNG nằm trong repo code.

## Chạy dự án

```bash
npm install
npm run dev          # http://localhost:3000
npm run build         # build production
npm test              # chạy toàn bộ test (node --test)
npm run test:word-compat   # kiểm tra Word thật bằng LibreOffice headless (cần cài soffice/pdfinfo)
```

Cần file `.env.local` (xem `.env.local.example`) với các biến API key Gemini, `GITHUB_KNOWLEDGE_REPO`,
Upstash Redis, v.v.

## Giới hạn / lưu ý đã biết

- Lỗ hổng bảo mật gói `xlsx` (Prototype Pollution/ReDoS) — nhà phát hành chưa có bản vá, KHÔNG mở
  tính năng nhập Excel cho người dùng ẩn danh/công khai cho tới khi có bản vá.
- `npm run test:word-compat` dùng LibreOffice làm proxy kiểm tra `.docx` hợp lệ — KHÔNG thay thế
  hoàn toàn việc mở bằng Microsoft Word thật, đặc biệt sau khi đổi bố cục lớn.
- Nhiều tính năng gợi ý theo SGK (Bài học, ngữ liệu Tiếng Việt, chương các môn mới Đạo đức/Khoa
  học/Tự nhiên và Xã hội/Lịch sử và Địa lí/Tin học/Công nghệ) phụ thuộc dữ liệu thật trong kho
  GitHub kiến thức — thiếu dữ liệu thì dropdown liên quan rỗng (hành vi an toàn có chủ đích, không
  phải lỗi).

## Tài liệu liên quan

- [`NEXT_STEPS.md`](./NEXT_STEPS.md) — việc đang dở dang, cần quyết định, nguyên tắc sư phạm bắt
  buộc phải nhớ khi code tiếp.
- [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md) — lịch sử phát triển rút gọn theo từng phiên, tra
  cứu khi cần biết "tại sao code lại làm thế này".
