# AI Exam Generator — Tóm tắt dự án (bản cập nhật sau khi LÀM Bước 1/3 - Tầng A: sửa nhanh
# module "📝 Phiếu bài tập" theo đúng kế hoạch đã thống nhất ở giai đoạn 9)

> ⚠️ Bản này thay thế mọi bản `PROJECT_SUMMARY.md` cũ hơn (kể cả bản đóng gói sẵn trong
> `ai-exam-generator-giaidoan9.zip` trước khi làm Bước 1). Dùng bản này làm nguồn tin cậy khi mở
> chat mới.

## 0.-1. MỚI NHẤT (giai đoạn 9, Bước 1/3 — Tầng A) — ĐÃ SỬA 5 việc "sửa nhanh, không đổi kiến
## trúc" theo đúng thứ tự đã thống nhất ở mục 0.5 (đọc lại phần LỊCH SỬ mục 0 bên dưới để hiểu bối
## cảnh ĐÁNH GIÁ dẫn tới các việc này). Bước 2 (catalog theo chủ đề SGK) và Bước 3 (Tiếng Việt)
## CHƯA làm - xem "Việc CHƯA làm" bên dưới.

### 1. Sửa vỡ layout 2 cột (`WorksheetPreview.jsx`)
Thay CSS `column-count: 2` (kiểu "đổ chữ như báo", có thể cắt ngang giữa 1 khối bài tập) bằng chia
**2 cột thật**: `worksheet.sections` được tách thành 2 mảng con (`splitIntoTwoColumns()` - nửa đầu
cột trái, nửa sau cột phải, kiểu đọc báo truyền thống) và render bằng 2 `<div>` flex riêng biệt -
mỗi `ExerciseBox` giờ LUÔN nằm trọn vẹn trong đúng 1 cột, không thể bị cắt ngang như bug cũ (đúng
hiện tượng ảnh giáo viên gửi: khối "Nhận diện hình" tràn ra ngoài mép phải khung A4). Tách phần
render 1 `ExerciseBox` thành component `RenderedExerciseBox` dùng chung cho cả 2 nhánh (1 cột/2
cột) để không lặp code.

### 2. Mở rộng kho hình (mục 7 "Nhận diện hình" / mục 8 "Đếm hình") — sửa lỗi luôn lặp y hệt
**Gốc rễ đã xác nhận ở giai đoạn 9**: kho `SHAPES` cũ có ĐÚNG 6 phần tử, trùng khớp `defaultCount`
mặc định (cũng 6) → `slice(0, 6)` trên mảng 6 phần tử luôn lấy hết cả mảng, random chỉ đảo thứ tự
chứ không đổi nội dung.
- `src/data/worksheetSchemas.js`: `SHAPES` mở rộng 6 → **14** (thêm: Hình thoi, Hình ê-líp, Hình
  ngũ giác, Hình lục giác, Hình bán nguyệt, Hình thang, Hình mũi tên, Hình đám mây).
- `src/data/worksheetExerciseCatalog.js`: `defaultCount` của `nhan_dien_hinh` đổi 6 → **5** (nhỏ
  hơn hẳn kích thước kho mới) - đảm bảo LUÔN có hình "vắng mặt" mỗi lần tạo phiếu, tạo khác biệt
  thật thay vì chỉ đảo thứ tự. `generateNhanDienHinh()` vẫn giữ `Math.min(count, SHAPES.length)`
  để an toàn tuyệt đối dù giáo viên tự gõ số lớn hơn kho.
- `generateDemHinhUngDung()` (mục 8): thêm cơ chế trộn **1-2 hình gây nhiễu** (khoảng 50% số lần
  tạo phiếu) vào khay đếm, lấy từ phần kho KHÔNG nằm trong danh sách mục 7 - hình nhiễu CHỈ xuất
  hiện trong khay, KHÔNG có câu hỏi "Có bao nhiêu Hình X?" tương ứng - giúp học sinh phải thực sự
  phân biệt hình đúng thay vì đếm máy móc mọi thứ trong khay.
- `ShapeIcon` (`WorksheetPreview.jsx`, web) và `SHAPE_GLYPHS` (`worksheetExportService.js`, Word)
  đều đã thêm đủ 8 hình mới (SVG path cho web, glyph Unicode cho Word: ◇ ⬭ ⬠ ⬡ ◠ ⏢ ➤ ☁).

### 3. Mở rộng kho icon đếm số (mục 2 "Đếm và viết số")
`ICONS` trong `worksheetSchemas.js` mở rộng 7 → **16** (thêm 🐟🎈🍭🚀🐢🧸🍪🌸🐝), export ra
`AVAILABLE_ICONS` giữ nguyên tên cũ (không phá vỡ chỗ dùng khác nếu có).

### 4. Sửa bài toán có lời văn (mục 9) bị "công thức hoá" (mô-típ thỏ+cà rốt+gà lặp lại)
`worksheetGenerator.js` thêm `WORD_PROBLEM_THEME_BANK` (24 tổ hợp nhân vật+bối cảnh đa dạng: con
vật, con người, đồ vật, bối cảnh khác nhau - không chỉ động vật nông trại). **CODE (không phải
AI) chọn ngẫu nhiên** đúng N chủ đề PHÂN BIỆT (hàm `pickWordProblemThemes()`, export để test được)
TRƯỚC khi gọi AI - đảm bảo phân bố đều, không lệ thuộc "thói quen" của AI khi tự chọn. Prompt
(`buildWordProblemPrompt()`, cũng export để test) giờ liệt kê ĐÚNG danh sách chủ đề đã chọn sẵn
theo thứ tự, yêu cầu AI **BẮT BUỘC** viết bài toán thứ i theo đúng chủ đề thứ i (không đổi chéo,
không tự ý thay chủ đề khác), kèm câu nhắc rõ tránh quay lại mô-típ thỏ ăn cà rốt/gà con nếu chủ
đề không yêu cầu.

### 5. Sửa hành vi "phiếu mẫu tham khảo" — tự động áp dụng cấu trúc mẫu, không còn chờ bấm nút phụ
**Gốc rễ đã xác nhận ở giai đoạn 9**: `detectedExercises` đã có sẵn nhưng TRƯỚC ĐÂY giáo viên phải
tự bấm 1 nút phụ "Áp dụng cấu trúc từ phiếu mẫu" - quên bấm thì phiếu vẫn sinh theo cấu hình mặc
định cũ, không liên quan gì mẫu vừa tải lên.
- Tách logic thuần (không đụng React state) ra module mới **`src/services/worksheetSampleStructureUtils.js`**
  (`defaultCountsFor()`, `applyDetectedExercisesToCounts()`) - để có thể tự verify bằng script gọi
  hàm trực tiếp (file `WorksheetForm.jsx` có cú pháp JSX, không import thẳng vào Node script được).
- `WorksheetForm.jsx`: ngay sau khi phân tích phiếu mẫu xong (`handleSampleFileChange`), nếu
  `sampleSpec.detectedExercises.length > 0` → **tự động áp dụng NGAY** (ghi đè hẳn `exerciseCounts`,
  KHÔNG cộng dồn), đồng thời lưu snapshot `exerciseCounts` TRƯỚC đó vào `preSampleExerciseCounts`
  để có thể đảo lại chính xác.
- UI hiện banner rõ ràng: "✅ Đã áp dụng cấu trúc từ phiếu mẫu (N dạng bài)" kèm nút "Dùng cấu hình
  mặc định thay vào đó" (gọi `revertToDefaultStructure()` - đảo lại đúng snapshot, hoặc
  `defaultCountsFor()` nếu không có snapshot). Nếu giáo viên đã đảo lại nhưng đổi ý, có nút "Áp
  dụng lại cấu trúc từ phiếu mẫu" (`reapplySampleStructure()`) để bật lại.
- Bỏ chọn file mẫu (`clearSample()`) → nếu vừa tự động áp dụng cấu trúc mẫu, tự đảo lại đúng
  `exerciseCounts` trước đó, tránh giáo viên bối rối vì số liệu trên form không còn liên quan gì
  đến file vừa bỏ.
- **LƯU Ý**: hành vi cũ "thứ tự khối bài tự động theo mẫu NGẦM" (`computeSectionOrder()` trong
  `worksheetGenerator.js`) giữ nguyên KHÔNG đổi - việc sửa lần này chỉ liên quan đến SỐ LƯỢNG câu
  mỗi dạng bài (`exerciseCounts`), là phần trước đây cần bấm nút phụ.

### Đã tự xác minh thật (không chỉ đọc code) cho cả 5 việc trên
- `npm run build` (Next.js 14.2.35): build sạch, không lỗi type/lint, route mới không ảnh hưởng.
- `npm test`: vẫn **47/47 pass** - không có test cũ nào bị hỏng bởi các thay đổi lần này.
- Viết 5 script riêng, gọi hàm trực tiếp qua `node --import ./test/register-loader.mjs` (không
  chỉ đọc code), đã chạy PASS rồi mới báo hoàn thành:
  1. `generateNhanDienHinh(5)` gọi 200 lần → **191/200 tổ hợp hình KHÁC NHAU** (trước đây luôn ra
     đúng 1 tổ hợp duy nhất - đảo thứ tự); `generateNhanDienHinh(999)` (vượt kho) trả đúng 14, an
     toàn không lỗi. `generateDemHinhUngDung()` gọi 200 lần → **94/200 lần có hình nhiễu** (~50%,
     đúng thiết kế), và xác nhận CHẶT: không có câu hỏi nào hỏi về hình KHÔNG nằm trong mục 7.
  2. `AVAILABLE_ICONS.length = 16`; gọi `generateDemVaVietSo()` 100 lần → 16/16 icon khác nhau đều
     xuất hiện (đúng toàn bộ kho được dùng tới, không icon nào "chết").
  3. `pickWordProblemThemes(5)` → 5 chủ đề phân biệt; gọi 50 lần → 21 giá trị "chủ đề đầu tiên"
     khác nhau (đủ ngẫu nhiên, không lặp lại 1 bộ cố định); `pickWordProblemThemes(30)` (> kích
     thước kho 24) vẫn trả đúng 30, không lỗi. `buildWordProblemPrompt()` với 3 chủ đề mẫu → xác
     nhận prompt CHỨA ĐỦ cả 3 chủ đề, CÓ câu lệnh "BẮT BUỘC"/"KHÔNG được đổi chéo", CÓ nhắc tránh
     mô-típ "thỏ ăn cà rốt"; gọi với `themes=[]` không crash.
  4. `applyDetectedExercisesToCounts()`: ghi đè đúng số lượng theo spec mẫu (VD tinh_nham=8,
     so_sanh=3), CÁC dạng bài không có trong mẫu tự động về 0 (xác nhận ghi đè hoàn toàn, không
     cộng dồn); key lạ trong spec bị bỏ qua an toàn không lỗi; `spec=null` → tất cả về 0 không
     throw; `defaultCountsFor()` khớp đúng `defaultCount` khai báo trong catalog.
  5. Gọi thẳng `generateWorksheet()` với `layoutId: "classic_2col_dotted"` (columns=2), đủ các
     dạng bài code-sinh (không gọi AI, tránh phụ thuộc `GEMINI_API_KEYS` không có trong sandbox) →
     xác nhận `layout.columns === 2`; mô phỏng lại đúng `splitIntoTwoColumns()` trên kết quả thật
     → **không mất/lặp mục nào** giữa 2 cột (tổng khớp, index không trùng); `dem_hinh_ung_dung`
     vẫn đứng ngay sau `nhan_dien_hinh` (hành vi cũ giữ nguyên); `nhan_dien_hinh` sinh ra đúng 5
     hình (không phải 14 - xác nhận defaultCount mới có hiệu lực thật, không chỉ khai báo suông).

### Việc CHƯA làm — cần làm ở phiên tiếp theo
1. **Chưa xem bằng mắt trên trình duyệt thật** - đặc biệt layout 2 cột mới (khác cơ chế multi-
   column cũ, cần xác nhận cảm giác thị giác/căn chỉnh chiều cao 2 cột không đều nhau có ổn không)
   và banner mới "Đã áp dụng cấu trúc từ phiếu mẫu" (vị trí, không bị rối với các banner khác).
2. **Chưa gọi Gemini THẬT** cho bài toán có lời văn (mục 9) - sandbox không có `GEMINI_API_KEYS`.
   Cần bạn tự chạy `npm run dev` với key thật, tạo nhiều phiếu liên tiếp có "Giải toán có lời văn",
   kiểm tra AI có thực sự TUÂN THỦ đúng chủ đề đã ép theo `themeListBlock` hay vẫn "lách" quay về
   mô-típ quen thuộc bất chấp chỉ dẫn (tỉ lệ tuân thủ thực tế qua nhiều lần sinh, không thể biết
   chắc chỉ bằng đọc prompt).
3. **Chưa test thật với 1 phiếu mẫu ảnh/PDF thật** cho luồng tự động áp dụng cấu trúc (mục 5) -
   script verify chỉ test hàm logic thuần với spec giả lập, chưa xác nhận toàn bộ luồng thật từ
   upload file → gọi AI phân tích (`analyzeWorksheetSampleRequest`) → nhận `detectedExercises` →
   tự động áp dụng → hiển thị banner đúng trên UI thật.
4. Chưa viết test tự động (`node --test`) riêng cho 5 việc sửa lần này vào bộ `test/*.test.js` -
   mới verify bằng 5 script gọi hàm thủ công trong phiên làm việc (đã xoá sau khi verify xong,
   không nằm trong repo) - nếu muốn các thay đổi này được bảo vệ khỏi hồi quy về sau, cần viết lại
   thành test chính thức.
5. **Bước 2 (Tầng B - catalog theo chủ đề SGK cho Toán) và Bước 3 (áp dụng cho Tiếng Việt) CHƯA
   làm** - đây là việc kiến trúc lớn hơn nhiều so với Bước 1, cần thống nhất riêng danh sách chủ đề
   ưu tiên theo đúng thứ tự SGK Lớp 1/Lớp 2 hiện hành trước khi bắt tay code (xem lại mục 0.5 bên
   dưới - phần "Bước 2"/"Bước 3" - để nhớ đúng kế hoạch đã thống nhất với giáo viên).
6. `.gitignore` - vẫn cần bạn tự xác nhận đã có trên máy/repo GitHub thật hay chưa (nhắc lại từ
   nhiều phiên trước, vẫn ưu tiên cao nếu chưa làm).

---

## 0. LỊCH SỬ (giai đoạn 9, phần ĐÁNH GIÁ ban đầu) — ĐÁNH GIÁ (chưa code lúc đó) module "📝 Phiếu
## bài tập" sau khi giáo viên test thật + gửi PDF phiếu đã tạo + 1 phiếu mẫu tham khảo ngoài đời
## (cô Hồng Đây, lớp 2) — TOÀN BỘ nội dung mục 0.x bên dưới đây là NGUYÊN VĂN đánh giá gốc (giữ lại
## để hiểu bối cảnh/gốc rễ từng lỗi) - phần ĐÃ SỬA thật cho Bước 1 nằm ở mục "0.-1." phía trên.


**⚠️ QUAN TRỌNG: phiên này CHỈ ĐÁNH GIÁ, CHƯA SỬA CODE GÌ.** Mọi phát hiện dưới đây đã được xác
minh bằng cách đọc trực tiếp code liên quan (không đoán) + đối chiếu với 3 file PDF thật giáo
viên gửi (`toan_1.pdf`, `toan_2.pdf`, `toan_3.pdf`) và 2 ảnh chụp UI/phiếu mẫu tham khảo. Việc
SỬA sẽ làm ở phiên tiếp theo, theo đúng trình tự đã thống nhất ở mục 0.5 bên dưới.

### 0.1. Lỗi 1 — Mục "Nhận diện hình" (mục 7) và "Đếm hình" (mục 8) LUÔN lặp lại y hệt
**Xác nhận bằng cách đọc code, không phải suy đoán xác suất:**
```js
// src/data/worksheetSchemas.js
const SHAPES = ["Hình tròn","Hình vuông","Hình tam giác","Hình chữ nhật","Hình ngôi sao","Hình trái tim"]; // ĐÚNG 6 hình
export function generateNhanDienHinh(count = 6) {
  return [...SHAPES].sort(() => Math.random() - 0.5).slice(0, count); // count mặc định = 6 = toàn bộ kho
}
```
Kho hình có ĐÚNG 6 phần tử, `count` mặc định cũng là 6 → `slice(0, 6)` trên mảng 6 phần tử luôn
lấy hết cả mảng. Random ở đây chỉ đảo THỨ TỰ, không đảo NỘI DUNG — với thiết lập mặc định, mục 7
không có khả năng ra hình khác. Đối chiếu 3 PDF: cả 3 phiếu đều hiện đúng 6/6 hình (Tròn, Vuông,
Tam giác, Chữ nhật, Ngôi sao, Trái tim), chỉ khác thứ tự + màu viền theo theme phiếu — khớp 100%
với nguyên nhân code trên.

Mục 8 (`generateDemHinhUngDung`) nhận `shapes` CHÍNH LÀ output của mục 7 làm input → khay hình
mục 8 cũng luôn gồm y hệt 6 hình đó, chỉ số lượng mỗi loại (2-5) và câu hỏi là random.

### 0.2. Lỗi 2 — Bài toán có lời văn (mục 9) bị "công thức hoá" ngữ cảnh (AI, không phải kho cố định)
Đối chiếu 3 PDF, mô-típ **thỏ + cà rốt + gà** lặp lại xuyên suốt cả 3 phiếu (thỏ ăn cà rốt / thỏ
nâu ăn cà rốt / thỏ bố nhổ cà rốt; gà con chạy chuồng / trứng gà / gà). AI có "vùng an toàn" từ
vựng hẹp khi tự sáng tác ngữ cảnh cho mầm non/lớp 1 — khó sửa bằng cách mở mảng đơn giản như lỗi
1, cần ép AI bốc ngẫu nhiên từ 1 "ngân hàng chủ đề/nhân vật/đơn vị đếm" đa dạng trước khi viết đề.

### 0.3. Lỗi 3 — Phiếu mẫu tham khảo: chỉ lấy style, bỏ qua cấu trúc bài tập mẫu (đã có hạ tầng,
### nhưng KÍCH HOẠT SAI CÁCH)
Hệ thống ĐÃ CÓ `detectedExercises` (đọc từ mẫu: dạng bài nào + số lượng khoảng bao nhiêu câu, key
thật khớp `worksheetExerciseCatalog.js`) nhưng **không tự áp dụng** — giáo viên phải tự bấm nút
phụ "Áp dụng cấu trúc từ phiếu mẫu" (`WorksheetForm.jsx` dòng ~297-499); nếu quên bấm, phiếu vẫn
sinh theo `exerciseCounts` mặc định cũ (khởi tạo sẵn cho Lớp 1/Toán), không liên quan gì đến mẫu
vừa tải lên. Đây đúng là điều giáo viên phản ánh "hệ thống phớt lờ mẫu tôi đưa vào" — gốc rễ là
hành vi kích hoạt (default = im lặng chờ bấm) sai, không phải thiếu tính năng.

### 0.4. Lỗi 4 (MỚI phát hiện qua ảnh UI) — Vỡ layout khi bật 2 cột
**Xác nhận qua đọc code:** `WorksheetPreview.jsx` dùng CSS `column-count: 2` (kiểu "đổ chữ như
báo") để chia 2 cột khi `layout.columns === 2`:
```js
style={ layout.columns === 2 ? { columnCount: 2, columnGap: 22 } : undefined }
```
`column-count` không đảm bảo 1 khối HTML giữ nguyên hình dạng — khi cột báo cắt ngang qua giữa
khối "Nhận diện hình"/"Đếm hình" (chứa nhiều icon SVG nhỏ xếp `flex-wrap`), khối bị tràn ra ngoài
biên cột/khỏi trang. Ảnh giáo viên gửi cho thấy đúng hiện tượng này: hộp mục 6 tràn hẳn ra ngoài
mép phải khung A4. Đã kiểm tra CSS `.a4-page` (padding/kích thước 210mm) hoàn toàn đúng chuẩn —
cảm giác "không full khổ giấy A4" giáo viên nói CHỈ LÀ HỆ QUẢ THỊ GIÁC của lỗi tràn cột này, không
phải lỗi khổ giấy thật. Hướng sửa: thay `column-count` bằng CSS Grid 2 cột thật
(`grid-template-columns: 1fr 1fr`) để mỗi ô luôn là 1 khối trọn vẹn, không bị cắt ngang.

### 0.5. Phát hiện QUAN TRỌNG NHẤT (kiến trúc, không phải bug nhỏ) — catalog "kỹ năng chung" ≠
### nhu cầu thật "bám sát chủ đề/bài học SGK theo từng thời điểm năm học"
Giáo viên gửi 1 phiếu mẫu tham khảo thật đang dùng ngoài đời ("Đổi đơn vị đo độ dài" - lớp 2, cô
Hồng Đây): toàn bộ 5 mục trong phiếu (điền số đổi đơn vị m/dm/cm, so sánh, sắp xếp, giải toán,
nối) đều xoay quanh ĐÚNG 1 chủ đề SGK cụ thể, kèm khung "Ghi nhớ" công thức. Đối chiếu hệ thống
hiện tại:
- Ô "Bài/Chương SGK (tuỳ chọn)" đã tồn tại trong `WorksheetForm.jsx` nhưng **chỉ ảnh hưởng ngữ
  cảnh của riêng mục "Giải toán có lời văn"** (xem `worksheetGenerator.js: resolveSgkChapterContext`)
  — 8/9 dạng bài còn lại (Tính nhẩm, So sánh, Dãy số, Sắp xếp, Nối phép tính, Nhận diện hình...)
  là catalog KỸ NĂNG CHUNG cố định, hoàn toàn không đổi dù chọn chương/bài nào.
- **Phần "📖 Đề Tiếng Việt Tiểu học" cũng bị đúng vấn đề tương tự** (giáo viên xác nhận, đã kiểm
  tra: `VietnameseExamForm.jsx` không có bất kỳ ô chọn SGK/chương/bài nào) — 4 khối (Đọc thành
  tiếng/Đọc thầm/Chính tả/Tập làm văn) sinh theo khối lớp chung chung, không bám theo tiến độ dạy
  thực tế (bài/chủ điểm cụ thể trong SGK Tiếng Việt).

**Kết luận đã thống nhất với giáo viên**: đây LÀ vấn đề kiến trúc thật (giáo viên đồng ý), không
phải thiếu đa dạng ngẫu nhiên. Kiến trúc hiện tại dừng ở tầng "luyện kỹ năng nền tảng" (hợp Mầm
non/đầu Lớp 1), chưa theo kịp mạch nội dung SGK Lớp 1-2 thật (đo lường đơn vị, tiền Việt Nam, thời
gian, hình học có số đo, và bên Tiếng Việt là các chủ điểm/bài đọc cụ thể theo từng tuần/chương).

### QUY TRÌNH THỰC HIỆN Ở PHIÊN TIẾP THEO (đã thống nhất với giáo viên, làm theo đúng thứ tự,
### KHÔNG nhảy cóc — mỗi bước xong mới sang bước sau, có xác nhận lại trước khi đi tiếp)

**Bước 1 — Tầng A: sửa nhanh, không đổi kiến trúc (làm trước, để có bản dùng được ngay)**
1. Sửa lỗi vỡ layout 2 cột: đổi `column-count` → CSS Grid 2 cột thật trong `WorksheetPreview.jsx`.
2. Mở rộng kho hình (Toán, mục 7/8): 6 → ~14-16 hình (thêm SVG: thoi, ê-líp, ngũ giác, lục giác,
   bán nguyệt, hình thang, mũi tên, đám mây...); đổi mặc định chỉ chọn 4-5/kho lớn (không phải
   toàn bộ kho) để đảm bảo luôn có phần hình "vắng mặt" tạo khác biệt thật giữa các lần tạo; khay
   đếm (mục 8) thỉnh thoảng trộn thêm 1-2 hình gây nhiễu ngoài danh sách mục 7.
3. Mở rộng kho icon đếm số (mục 2, hiện chỉ 7 icon cố định).
4. Sửa bài toán có lời văn (mục 9): xây "ngân hàng chủ đề/nhân vật/đơn vị đếm" đa dạng, ép AI bốc
   ngẫu nhiên 1 tổ hợp trước khi viết đề, tránh AI tự co về thỏ/cà rốt/gà.
5. Sửa hành vi phiếu mẫu tham khảo: tự động áp dụng `detectedExercises` NGAY sau khi phân tích
   xong (không chờ bấm nút phụ), ghi đè hẳn `exerciseCounts` mặc định cũ (không cộng dồn); hiện
   banner rõ ràng "Đã áp dụng cấu trúc từ phiếu mẫu (N dạng bài)" kèm nút "Dùng cấu hình mặc định
   thay vào đó" để đảo lại nếu giáo viên muốn.
6. Sau khi xong: tự verify bằng script gọi hàm thủ công (như các phiên trước) + báo cáo lại trước
   khi sang Bước 2.

**Bước 2 — Tầng B: mở rộng catalog "Phiếu bài tập" theo CHỦ ĐỀ SGK (việc lớn, kiến trúc mới)**
- Thêm nhóm "dạng bài theo chủ đề" mới cho môn Toán, đi theo tiến độ SGK Lớp 1-2 thật, ví dụ: Đo
  lường (đổi đơn vị độ dài m/dm/cm, khối lượng kg/g, dung tích l/ml), Tiền Việt Nam (đọc/đổi mệnh
  giá, tính tiền mua-bán đơn giản), Thời gian (xem đồng hồ, ngày-tháng, thứ trong tuần), Hình học
  có số đo (chu vi hình đơn giản). Mỗi chủ đề là 1 "gói" gồm nhiều dạng bài nhỏ xoay quanh nó
  (giống đúng cấu trúc phiếu mẫu cô Hồng Đây), thay vì giáo viên tự chọn rời rạc từng kỹ năng.
- Ô "Bài/Chương SGK" hiện có sẽ thực sự điều khiển catalog nào hiện ra (không chỉ ảnh hưởng riêng
  mục giải toán như hiện tại).
- Trước khi code Bước 2: cần thống nhất RIÊNG 1 danh sách chủ đề ưu tiên theo đúng thứ tự SGK
  Lớp 1/Lớp 2 hiện hành (Kết nối tri thức / Cánh diều / Chân trời sáng tạo - tuỳ bộ sách giáo viên
  đang dùng) trước khi bắt tay viết generator cho từng chủ đề.

**Bước 3 — Áp dụng cùng logic "bám sát chủ đề SGK" cho phần "📖 Đề Tiếng Việt Tiểu học"**
- Giáo viên xác nhận phần này cũng thiếu liên kết SGK/chương/bài y hệt Toán.
- Làm SAU Bước 2 (Toán) để tái dùng lại đúng khuôn kiến trúc đã kiểm chứng, tránh làm 2 lần theo
  2 cách khác nhau. Cụ thể hoá danh sách chủ điểm/bài đọc theo SGK Tiếng Việt sẽ bàn ở phiên riêng
  khi tới bước này.

**Lưu ý xuyên suốt**: mỗi bước nhỏ trong Bước 1 sau khi sửa xong đều cần tự verify bằng script gọi
hàm trực tiếp (không chỉ đọc code) trước khi báo hoàn thành — đúng tinh thần đã áp dụng nhất quán
ở các giai đoạn trước với module giáo án.

---

## 0.6. LỊCH SỬ — giai đoạn 8: sửa 5 phản ánh giáo viên sau khi DẠY THỬ giáo án AI sinh ra
Bối cảnh: khác các phiên trước (giáo viên test tay, nhìn giao diện), lần này giáo viên đã ĐEM GIÁO
ÁN RA DẠY THỬ THẬT và phản hồi rất cụ thể theo từng phần I/II/III/IV. Tóm tắt 5 vấn đề + cách sửa:

**a) Lỗi cộng sai thời lượng + gộp nhiều tiết thành 1 mạch (ĐÃ SỬA - lỗi nghiêm trọng nhất)**
Xác nhận đúng: bài 2 tiết x 40 phút = 80 phút, nhưng `computeActivityTimeline()` cũ dùng
`Math.round()` ĐỘC LẬP cho từng hoạt động (11.43→11, 34.28→34, 22.86→23, 11.43→11) → tổng 79, lệch
1 phút. Đã viết lại bằng thuật toán "largest remainder" (`distributeMinutesExact()` trong
`lessonPlanTemplates.js`) - tổng LUÔN khớp chính xác. Đồng thời thêm `computeMultiPeriodTimeline()`:
tính phân bổ RIÊNG cho TỪNG TIẾT (mỗi tiết tự đủ đúng số phút/tiết), theo đúng tinh thần giáo viên
đề xuất (Tiết 1: Khởi động + Khám phá/Hệ thống hoá + Luyện tập phần đầu; Tiết cuối: Khởi động lại
ngắn + Luyện tập phần sau + Vận dụng). AI được yêu cầu gắn trường `"tiet"` cho mỗi bước trong
`tienTrinh`; `LessonPlanPreview.jsx`/`lessonPlanExportService.js` THUẦN CODE chèn vạch "── Hết Tiết
N (nghỉ giải lao) — Chuyển sang Tiết N+1 ──" ngay tại điểm "tiet" tăng lên, cả trên web lẫn file
Word xuất ra - giáo viên giờ nhìn thấy rõ điểm dừng để chèn giải lao giữa các tiết.

**b) Tên hoạt động "Khám phá" chưa đúng bản chất với bài Ôn tập (ĐÃ SỬA)**
Thêm `LESSON_TYPES` (Bài mới / Ôn tập-Luyện tập / Thực hành-Trải nghiệm) trong
`lessonPlanTemplates.js` + `getActivityLabels(lessonType)`. Khi chọn "Ôn tập", hoạt động thứ 2 tự
đổi tên thành "Hệ thống hoá kiến thức" (không còn cứng "Khám phá" cho MỌI bài như trước) - và
prompt nhắc rõ AI KHÔNG được viết giọng "khám phá điều mới lạ" cho bài ôn tập. Đã nối UI chọn "Loại
bài" trong `LessonPlanForm.jsx` (ẩn với Mầm non) xuyên suốt blueprint → route → orchestrator →
engine → prompt.

**c) Khởi động quá dài (11 phút) + Tích hợp Năng lực số thiếu khả thi (ĐÃ SỬA)**
Hệ quả trực tiếp của lỗi (a): `computeMultiPeriodTimeline()` áp trần 7 phút (tiết đầu) / 6 phút
(tiết sau) cho MỖI LẦN xuất hiện của "Khởi động" (không phụ thuộc tổng số tiết như thuật toán cũ) -
phần dư dồn sang Luyện tập/Khám phá, tổng vẫn khớp chính xác. Đồng thời sửa hướng dẫn "Tích hợp
NLS" trong `lessonPlanIntegrations.js`: MẶC ĐỊNH thiết kế theo hướng giáo viên trình chiếu/thao tác
trên 1 máy chiếu chung, KHÔNG mặc định mỗi học sinh có máy tính bảng riêng tại lớp (trừ khi rõ ràng
học ở phòng Tin học) - hoặc chuyển thành nhiệm vụ Vận dụng làm ở nhà cùng phụ huynh.

**d) Thiếu nội dung cụ thể của "Phiếu học tập" đính kèm (ĐÃ SỬA)**
Thêm integration mới `phieuHocTap` (bật MẶC ĐỊNH cho user mới) trong `lessonPlanIntegrations.js`:
AI soạn CỤ THỂ 4-8 bài tập/câu hỏi (đổi số liệu/ngữ cảnh so với ví dụ đã dùng trên lớp, không lặp
lại y hệt), trả về `phieuHocTap: { tieuDe, huongDan, baiTap: [...] }`. Hiển thị thành phụ lục có
dòng kẻ chấm để học sinh viết trực tiếp (web: `PhieuHocTapBlock` trong `LessonPlanPreview.jsx`; Word:
phần "PHỤ LỤC: ..." ngắt trang riêng trong `lessonPlanExportService.js`) - giáo viên photo dùng
ngay, không cần tự soạn thêm.

### Đã tự xác minh thật (không chỉ đọc code)
- `npm run build` (Next.js 14.2.35): build sạch, không lỗi type/lint.
- `npm test`: **47/47 pass** (38 test cũ không hỏng + 9 test MỚI viết riêng cho phiên này trong
  `test/lessonPlanFixes.test.js` - đã đưa vào bộ chạy lại được mỗi lần `npm test`, khác các phiên
  trước chỉ verify bằng script gọi hàm thủ công một lần).
- Test mới bao phủ: (1) tổng `computeActivityTimeline()` khớp chính xác nhiều tổ hợp
  tiết/khối lớp; (2) mỗi tiết trong `computeMultiPeriodTimeline()` tự đủ đúng phút, Khởi động không
  vượt trần, chỉ tiết đầu có Khám phá/chỉ tiết cuối có Vận dụng, tiết sau là "Khởi động lại"; (3)
  `getActivityLabels()` đổi tên đúng theo lessonType; (4) `buildLessonPlanPrompt()` có/không có
  hướng dẫn ranh giới tiết đúng theo soTiet, tên hoạt động đúng theo lessonType, vẫn giữ quy tắc cấm
  LaTeX; (5) `buildLessonPlanDocxSections()` sinh file `.docx` THẬT (giải nén bằng JSZip, soi XML)
  có vạch "Hết Tiết 1", có phụ lục "PHỤ LỤC: Phiếu học tập số 1", không còn `\n` thô (có `<w:br/>`
  thật), và bài 1 tiết thì KHÔNG có vạch ranh giới thừa.

### Việc CHƯA làm — cần bạn tự làm ở phiên tiếp theo hoặc khi có API key thật
1. **Chưa gọi Gemini THẬT** với "Loại bài"/nhiều tiết/Phiếu học tập - sandbox không có
   `GEMINI_API_KEYS`. Cần bạn tự chạy `npm run dev` với key thật, thử bài "Ôn tập số tự nhiên" 2
   tiết, kiểm tra: (a) AI có thực sự gắn đúng trường `"tiet"` cho các bước hay bỏ qua yêu cầu (đã
   có cảnh báo tự động trong `lessonPlanOrchestrator.js` nếu AI bỏ qua, nhưng cần xem tỉ lệ tuân
   thủ thực tế qua nhiều lần sinh); (b) nội dung "Khởi động lại" ở tiết 2 có thực sự ngắn gọn/khác
   khởi động chính không; (c) nội dung Phiếu học tập có bám sát bài học và KHÔNG trùng y hệt ví dụ
   đã dùng ở Luyện tập không.
2. Chưa xem bằng mắt trên trình duyệt thật - form giờ có thêm ô "Loại bài" và mặc định bật thêm
   tích hợp "Phiếu học tập", cần xác nhận giao diện/luồng chọn không bị rối.
3. Ranh giới "Hết Tiết" hiện được chèn dựa vào trường `"tiet"` AI tự gắn theo từng BƯỚC trong TỪNG
   HOẠT ĐỘNG riêng lẻ (không phải sắp xếp lại toàn bộ tài liệu theo trình tự thời gian thực tế giữa
   4 khối hoạt động) - đây là lựa chọn có chủ đích để giữ đúng cấu trúc 4 mục I/II/III/IV chuẩn
   CV2345 mà Ban Giám hiệu quen thuộc, thay vì đảo lộn thành "Tiết 1 / Tiết 2" ở cấp cao nhất. Nếu
   giáo viên phản hồi vẫn muốn cấu trúc theo tiết ở cấp cao nhất (khác chuẩn CV2345), đây là điểm
   cần bàn lại kiến trúc, không phải sửa nhỏ.
4. `.gitignore` - vẫn cần bạn tự xác nhận đã có trên máy/repo GitHub thật hay chưa (nhắc lại từ các
   phiên trước, vẫn ưu tiên cao nếu chưa làm).

---

## 1. Tổng quan
Next.js 14 (App Router) app tạo đề kiểm tra + phiếu bài tập + giáo án bằng AI cho giáo viên Việt
Nam, mục tiêu chi phí vận hành **$0**. Deploy Vercel. AI backbone: Gemini (`gemini-3.5-flash`, SDK
`@google/genai`) qua pool nhiều API key.

**4 mode trong `page.js`**, chỉ 1 mount tại 1 thời điểm (dùng chung `id="print-area"`):
1. **📝 Đề kiểm tra** (Lớp 1-12) — luồng gốc, đầy đủ nhất, ổn định nhất.
2. **🧮 Phiếu bài tập** (Mầm non - Lớp 2) — sinh số liệu chủ yếu thuần code, không cần AI.
3. **📘 Soạn giáo án** (Mầm non - Lớp 5) — 8 "tích hợp" tuỳ chọn kiểu plugin
   (`lessonPlanIntegrations.js`) + giờ có thêm **giáo án mẫu** (xem mục 3 bên dưới).
4. **📖 Đề Tiếng Việt Tiểu học** (Lớp 1-5) — 4 khối A. Đọc thành tiếng / A. Đọc thầm / B. Chính tả /
   B. Tập làm văn, đủ 4/4 khối đã implement (xem mục 4).

## 2. Cấu trúc thư mục (đã cập nhật với các file MỚI của phiên làm việc này)
```
src/
├── app/{page.js, api/{login,chapters,generate,generate-worksheet,generate-lesson-plan,
│        generate-vietnamese-exam,usage,analyze-sample,analyze-worksheet-sample,
│        analyze-lesson-plan-sample [MỚI],worksheet-preference}}
├── components/{Header,LoginForm,UsageWidget,ExamMatrixForm,A4LivePreview,ExportActions,
│        WorksheetForm,WorksheetPreview,WorksheetExportActions,
│        LessonPlanForm (sửa),LessonPlanPreview (sửa),LessonPlanExportActions,
│        VietnameseExamForm,VietnameseExamPreview,vietnameseBlocks/*,
│        visuals/{VerticalArithmetic,NumberTriangle,BarModel,VisualCounting,ScratchGrid,QuestionVisual}}
├── services/{apiClient (sửa),authService,apiAuth,sessionToken,passwordUtils,loginRateLimiter,
│        githubService,geminiEngine,geminiKeyPool,geminiUsageTracker,examOrchestrator,
│        exportService,visualExportBuilders,specificationBuilder,specificationExportBuilders,
│        xmlEscapeUtils,latexUtils,worksheetGenerator,worksheetExportService,
│        worksheetSampleAnalyzer,worksheetSampleCache,worksheetSampleStructureUtils [MỚI - GĐ9
│        Bước 1],sampleExamAnalyzer,sampleExamCache,
│        teacherPreferenceStore,questionBankStore,upstashClient,
│        lessonPlanEngine (sửa),lessonPlanOrchestrator (sửa),lessonPlanExportService (sửa),
│        lessonPlanSampleAnalyzer [MỚI],lessonPlanSampleCache [MỚI],
│        fileTextExtractors,scoringUtils(không dùng),
│        vietnameseExamOrchestrator,vietnameseBlocks/*}
└── data/{config,constants,gradeProfiles,subjectProfiles,promptTemplates,visualSchemas,
        sampleExamSchema,worksheetSampleSchema,worksheetSchemas,worksheetExerciseCatalog,
        worksheetLayoutTemplates,lessonPlanBlueprint (sửa),lessonPlanResult,
        lessonPlanTemplates,lessonPlanPromptTemplates (sửa),lessonPlanIntegrations (sửa),
        lessonPlanSampleSchema [MỚI],examBlueprint,examResult,vietnameseExamBlocks,
        vietnameseExamBlueprint,vietnameseExamResult,users.json}
```

## 3. ✅ MỚI (phiên này) — 4 vấn đề module "Soạn giáo án" giáo viên phản ánh sau khi test thực tế

Bối cảnh: giáo viên test tay và gửi 2 ảnh chụp - ảnh 1 cho thấy cú pháp LaTeX kiểu `$504~842$`
in thô ra giáo án (đáng lẽ phải hiện là "504 842"); ảnh 2 là ảnh mẫu tham khảo cấu trúc giáo án
chuẩn (mục a) Mục tiêu, b) Nội dung..., có Bước 1/Bước 2 rõ ràng) để đối chiếu.

### 3.1. Lỗi `$...$` và `~` in thô ra giáo án — ĐÃ SỬA
**Nguyên nhân xác nhận qua đọc code**: `subjectProfiles.js` có `extraRules` cho môn Toán yêu cầu
"công thức phải viết bằng LaTeX `$...$`" - quy tắc này viết RIÊNG cho luồng ra ĐỀ KIỂM TRA (nơi
CÓ pipeline `latexUtils.js` + KaTeX/OMML để render LaTeX thành công thức đẹp). Nhưng
`lessonPlanPromptTemplates.js` lại TÁI DÙNG NGUYÊN VẸN `extraRules` này cho giáo án, trong khi
`LessonPlanPreview.jsx`/`lessonPlanExportService.js` **không hề có pipeline đọc LaTeX** (đã ghi rõ
trong comment cũ: "giáo án hiếm khi có công thức phức tạp, không cần pipeline LaTeX->OMML") - kết
quả: AI vẫn viết số theo "thói quen" LaTeX (`$504~842$`), bị in thô ra vì không ai "dịch" nó.

**Đã sửa** trong `lessonPlanPromptTemplates.js`: thêm quy tắc bắt buộc cấm tuyệt đối `$`, `$$`,
dấu ngã `~` trong giáo án, yêu cầu viết số bằng ký hiệu thông thường; đồng thời ghi chú rõ ràng
ngay trước đoạn `subjectProfile.extraRules` để AI hiểu phần "phải dùng LaTeX" trong đó KHÔNG áp
dụng cho giáo án (chỉ áp dụng quy tắc nội dung/số liệu khác của môn học).

### 3.2. InfoGraphic/Mindmap "không hoạt động" — ĐÃ SỬA (tăng độ tin cậy)
**Nguyên nhân xác nhận qua đọc code**: field `"mindmap"` (và các field tích hợp khác như
`tichHopNLS`, `cungCoQuestions`...) TRƯỚC ĐÂY chỉ được MÔ TẢ BẰNG LỜI trong đoạn hướng dẫn tích
hợp (`buildIntegrationsPromptBlock`), KHÔNG xuất hiện trong VÍ DỤ JSON SCHEMA CHÍNH gửi cho AI -
mô hình ngôn ngữ thường "neo" hành vi theo ví dụ cụ thể tốt hơn nhiều so với mô tả bằng lời, nên
hay quên trả field này dù đã đọc đúng yêu cầu ở trên. Code hiển thị (`MindmapBlock` trong
`LessonPlanPreview.jsx`) hoàn toàn không có bug - vấn đề nằm ở việc AI không trả field, không phải
lỗi render.

**Đã sửa**: thêm thuộc tính `schemaExample` cho từng tích hợp trong `lessonPlanIntegrations.js`
(mindmap, cungCoQuestions, tichHopNLS, tichHopGDQPAN, tichHopHSKT), và hàm mới
`collectIntegrationSchemaExamples()` nối các đoạn ví dụ này TRỰC TIẾP vào object JSON mẫu trong
`buildLessonPlanPrompt()` - giờ AI luôn thấy hình dạng dữ liệu cụ thể (không chỉ đọc mô tả), kèm
câu nhấn mạnh "BẮT BUỘC phải có trường mindmap - đây KHÔNG phải trường tuỳ chọn".

### 3.3. Mục III chưa rõ ràng Bước 1/Bước 2/a)/b) — ĐÃ SỬA
- Đánh số **"Bước N:"** trước mỗi bước trong `tienTrinh` giờ làm **THUẦN CODE** (không phụ thuộc
  AI viết đúng hay không) ở cả `LessonPlanPreview.jsx` (màn hình xem trước) và
  `lessonPlanExportService.js` (file Word xuất ra) - đảm bảo LUÔN nhất quán, không phụ thuộc AI.
- Thêm quy tắc `stepClarityRule` trong prompt: yêu cầu AI tách rõ NHIỀU BƯỚC cho mỗi hoạt động
  (gợi ý tinh thần 4 bước quen thuộc: Giao nhiệm vụ / Thực hiện nhiệm vụ / Báo cáo-thảo luận /
  Kết luận-nhận định, không bắt buộc đủ 4 bước với hoạt động ngắn), và trong nội dung mỗi bước nếu
  có nhiều ý/thao tác thì viết gạch đầu dòng "- " xuống dòng riêng thay vì dồn thành 1 đoạn dài.
- Xử lý xuống dòng đúng cách ở CẢ 2 nơi: `white-space: pre-line` cho web preview,
  `TextRun({ break: 1 })` thật cho Word (KHÔNG in ký tự `\n` thô ra file - đã tự kiểm tra bằng
  cách giải nén `.docx` thật, xác nhận có `<w:br/>` thật, không còn chuỗi `\n` nào trong XML).

### 3.4. Upload giáo án mẫu (Word/PDF/ảnh), 2 chế độ "Bám sát mẫu" / "Kết hợp mẫu + SGK" — ĐÃ XONG
Tái dùng ĐÚNG khuôn đã có (`sampleExamAnalyzer.js` bên đề kiểm tra, `worksheetSampleAnalyzer.js`
bên phiếu bài tập, `fileTextExtractors.js` dùng chung cho cả 3 luồng):

- **`src/data/lessonPlanSampleSchema.js`** — spec CHỈ mô tả CẤU TRÚC/CÁCH TRÌNH BÀY (thứ tự đề
  mục, kiểu đánh số bước - đóng gói thành 1 trong 4 giá trị enum, có dùng bảng 2 cột hay không,
  thông tin đầu trang, ghi chú trình bày khác) - TUYỆT ĐỐI KHÔNG lưu nội dung bài học cụ thể của
  mẫu (dù rủi ro bản quyền thấp hơn đề mẫu NXB vì đây thường là mẫu trường/tổ chuyên môn, vẫn giữ
  nguyên tắc an toàn: mẫu chỉ định hình HÌNH THỨC, nội dung bài mới do AI tự soạn theo SGK/nội
  dung cốt lõi). `sanitizeLessonPlanSampleSpec()` không bao giờ throw, luôn trả object hợp lệ.
- **`src/services/lessonPlanSampleAnalyzer.js`** — đọc file mẫu, gọi Gemini ĐÚNG 1 LẦN
  (`priority="analyze"`), dùng `fileTextExtractors.js` để trích text thô TRƯỚC (docx/pdf không
  scan - miễn phí, không tốn AI), chỉ chuyển sang vision (ảnh/PDF scan) khi cần. Trả thêm
  `referenceText` (đoạn trích thô, giới hạn 3000 ký tự) để dùng làm ngữ cảnh văn phong khi ở chế
  độ "Bám sát mẫu".
- **`src/services/lessonPlanSampleCache.js`** — cache trong bộ nhớ theo (username + hash file),
  TTL 24h, y hệt kiến trúc `sampleExamCache.js` (best-effort, không sống qua cold start Vercel).
- **`src/app/api/analyze-lesson-plan-sample/route.js`** — route riêng, kiểm tra cache trước khi
  gọi AI, cùng khuôn `/api/analyze-sample`.
- **`lessonPlanPromptTemplates.js`**: thêm `buildLessonPlanPrompt({ sampleMode, sampleSpec,
  sampleReferenceText })` + hàm `buildLessonPlanSampleGuidance()` mới. 2 chế độ:
  - `"theo_mau"`: ưu tiên bám sát CÁCH TRÌNH BÀY của mẫu hơn khung mặc định (vẫn giữ đủ yêu cầu
    chuyên môn), có kèm đoạn trích văn phong tham khảo (chỉ để cảm nhận cách hành văn, cấm chép
    nguyên văn).
  - `"ket_hop"`: áp dụng cách trình bày của mẫu NHƯNG vẫn giữ đủ khung mục I-IV chuẩn + vẫn ưu
    tiên bám sát SGK cho nội dung (mẫu chỉ ảnh hưởng hình thức) - KHÔNG kèm đoạn trích văn phong.
  - `"theo_chuong"` (mặc định): không dùng mẫu, hành vi giữ nguyên như trước (đã tự xác nhận
    `buildLessonPlanPrompt()` không có sampleMode trả về prompt giống hệt bản cũ).
- **`lessonPlanEngine.js` → `lessonPlanOrchestrator.js` → `lessonPlanBlueprint.js` → route →
  `LessonPlanForm.jsx`**: nối xuyên suốt cả chuỗi, cùng pattern `sampleMode`/`sampleExamSpec` bên
  `examOrchestrator.js` - kể cả cơ chế fallback an toàn: nếu chọn chế độ dùng mẫu nhưng spec không
  đủ dùng (`isUsableLessonPlanSampleSpec()` trả false), tự động chuyển về "theo_chuong" kèm cảnh
  báo, KHÔNG chặn đứng cả lượt soạn giáo án.
- **`apiClient.js`**: thêm `analyzeLessonPlanSampleRequest()`.
- **`LessonPlanForm.jsx`**: thêm UI chọn 3 chế độ (mirror UI "Đề mẫu" của `ExamMatrixForm.jsx`) +
  upload file + hiển thị kết quả phân tích (đề mục, ghi chú trình bày) + chặn submit sớm ở client
  nếu chưa phân tích xong.

### Đã tự xác minh thật cho CẢ 4 việc (không chỉ đọc code)
- `npm run build` (Next.js 14.2.35): build sạch, route `/api/analyze-lesson-plan-sample` được
  nhận diện đúng trong danh sách route.
- `npm test`: vẫn **38/38 pass** - không có test cũ nào bị hỏng.
- Gọi thẳng `buildLessonPlanPrompt()` qua loader hook (`test/register-loader.mjs`) với nhiều tổ
  hợp tham số → xác nhận: (1) có dòng cấm LaTeX rõ ràng cho MỌI môn kể cả Toán; (2) `"mindmap":` và
  `"cungCoQuestions":` xuất hiện thật trong ví dụ JSON khi bật tích hợp tương ứng; (3) có nhắc quy
  tắc đánh số bước tự động; (4) chế độ `"theo_mau"` có đủ đoạn mô tả đề mục + đoạn trích văn phong,
  chế độ `"ket_hop"` có mô tả đề mục nhưng KHÔNG có đoạn trích văn phong (đúng thiết kế) + vẫn nhắc
  giữ khung mục chuẩn; (5) không truyền `sampleMode` → prompt không có đoạn "CÁCH TRÌNH BÀY GIÁO ÁN
  MẪU" (đúng hành vi cũ, không đổi).
- Gọi thẳng `buildLessonPlanDocxSections()` với dữ liệu mẫu có bước chứa nhiều dòng (`\n`) + có
  mindmap → giải nén `.docx` thật, soi `word/document.xml` → xác nhận CÓ THẬT: "Bước 1:", "Bước 2:"
  đứng trước đúng nội dung, xuống dòng bằng `<w:br/>` THẬT (đếm được 2 thẻ `<w:br/>`, 0 ký tự `\n`
  thô còn sót trong XML), và mục "Sơ đồ tư duy" hiển thị đúng.
- Gọi thẳng `sanitizeLessonPlanSampleSpec()` với input rác (`null`, field sai kiểu, enum bịa) →
  xác nhận không throw, luôn trả object hợp lệ theo đúng shape rỗng an toàn.
- Gọi thẳng `getCachedLessonPlanSampleSpec()`/`setCachedLessonPlanSampleSpec()` → xác nhận cache
  hit đúng sau khi set, và cách ly đúng theo username (2 "giáo viên" khác nhau dùng cùng 1 file
  mẫu không bị lẫn cache của nhau).

### Việc CHƯA làm — cần bạn tự làm ở phiên tiếp theo hoặc khi có API key thật
1. **Chưa gọi Gemini THẬT** cho toàn bộ luồng giáo án (kể cả trước phiên này) lẫn phần phân tích
   giáo án mẫu mới - sandbox không có `GEMINI_API_KEYS` và mạng bị giới hạn domain. Cần bạn tự
   chạy `npm run dev` với API key thật, thử soạn giáo án môn Toán (kiểm tra hết hẳn `$`/`~`), bật
   tích hợp Mindmap nhiều lần liên tiếp xem tỉ lệ AI trả về field này có cải thiện rõ rệt không, và
   thử cả 2 chế độ "Bám sát mẫu"/"Kết hợp mẫu + SGK" với 1 giáo án mẫu thật (docx/pdf/ảnh) để đánh
   giá AI có bắt chước đúng cấu trúc mẫu hay không.
2. Chưa xem bằng mắt trên trình duyệt thật - form giờ dài hơn (thêm khối "Giáo án mẫu"), cần xác
   nhận giao diện không bị rối, đặc biệt là khi vừa bật nhiều "Tuỳ chọn nâng cao" vừa bật "Giáo án
   mẫu" cùng lúc.
3. Mindmap hiện hiển thị dạng khối chữ nhật đơn giản (không phải sơ đồ cây/hình ảnh thật) - nếu
   giáo viên muốn hình ảnh trực quan hơn (dạng cây phân nhánh thật) thì đây là việc làm thêm sau,
   coi như đã tách bạch rõ 2 vấn đề khác nhau: "AI không trả dữ liệu" (đã sửa) vs "cách hiển thị dữ
   liệu" (vẫn ở dạng đơn giản, có thể nâng cấp sau nếu cần).
4. Chưa viết test tự động (`node --test`) riêng cho 4 việc sửa lần này - mới verify bằng script gọi
   hàm thủ công trong phiên làm việc, chưa có trong bộ `test/*.test.js` chạy lại được mỗi lần
   `npm test` sau này.
5. `.gitignore` (đã tạo ở phiên trước) - vẫn cần bạn tự xác nhận file này có tồn tại trên máy/repo
   GitHub thật hay không, đây vẫn là việc ưu tiên cao nếu chưa làm.

---

## 4. Mode "📖 Đề Tiếng Việt Tiểu học": đủ 4/4 khối, CHƯA test Gemini thật
*(Không đổi so với bản trước - xem lại lịch sử trò chuyện nếu cần chi tiết đầy đủ. Tóm tắt: cấu
trúc "danh bạ khối" (`vietnameseExamBlocks.js`) + "người điều phối" (`vietnameseExamOrchestrator.js`
+ `VietnameseExamPreview.jsx` + `vietnameseExamExportService.js`), mỗi khối tự chứa trong
`services/vietnameseBlocks/` + `components/vietnameseBlocks/`. Đủ 4 khối: Đọc thành tiếng (tĩnh),
Đọc thầm (AI), Chính tả (tĩnh - CỐ Ý không AI vì lý do bản quyền/mục đích bài tập), Tập làm văn
(AI nhẹ, chỉ đề bài + dàn ý, không sinh bài văn mẫu hoàn chỉnh). Đã tự verify bằng script gọi hàm
trực tiếp (không chỉ đọc code) nhưng CHƯA gọi Gemini thật cho 2 khối cần AI - vẫn là việc ưu tiên
cao nhất cần làm khi có API key thật.)*

## 5. Vấn đề kiến trúc đang chờ xử lý — VẪN CÒN NGUYÊN
`allowVisual` trong `gradeProfiles.js` vẫn chỉ gate theo khối lớp (không xét môn học) - dùng ở
đúng 1 chỗ (`examOrchestrator.js`) - chưa ai sửa, vẫn là quyết định cần chốt nếu muốn mở rộng thêm.

---

## Quy trình khi mở chat mới
1. Upload lại zip code mới nhất (sandbox reset giữa các phiên) + file `PROJECT_SUMMARY.md` này.
2. Nói rõ đang muốn tiếp tục việc gì (VD: "đã test Gemini thật với giáo án mẫu, ổn rồi, làm tiếp
   [việc X]" hoặc "review lại lần nữa" hoặc "viết test tự động cho phần giáo án mẫu").
3. Sau khi hoàn thành, yêu cầu cập nhật lại chính `PROJECT_SUMMARY.md` trước khi đóng gói zip mới.
