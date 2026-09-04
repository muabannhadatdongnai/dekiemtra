# CHỦ ĐỀ 6: GIẢI QUYẾT VẤN ĐỀ VỚI SỰ TRỢ GIÚP CỦA MÁY TÍNH [4]

Chủ đề này giới thiệu những khái niệm cơ bản và nền tảng của khoa học máy tính: thuật toán, các cấu trúc điều khiển (tuần tự, rẽ nhánh, lặp), và cách chuyển đổi thuật toán thành chương trình để máy tính có thể hiểu và thực thi thông qua môi trường lập trình trực quan Scratch [4, 63, 67, 71].

---

## BÀI 15: THUẬT TOÁN [63]

Sau bài học này, học sinh sẽ diễn tả được sơ lược khái niệm thuật toán, nêu được một vài ví dụ minh họa và biết cách mô tả thuật toán bằng hai phương pháp: liệt kê các bước bằng ngôn ngữ tự nhiên hoặc sơ đồ khối [63].

### 1. Khái niệm thuật toán
* **Khởi động - Trò chơi gấp hình Đông-Tây-Nam-Bắc:** Từ một tờ giấy hình vuông, học sinh thực hiện tuần tự 6 bước theo hướng dẫn để tạo thành hình gấp trò chơi [63]. Trong quy trình này:
  * Tờ giấy hình vuông ban đầu được gọi là **Đầu vào (Input)** [64].
  * Hình gấp trò chơi nhận được sau khi hoàn thành 6 bước được gọi là **Đầu ra (Output)** [64].
  * Chỉ dẫn ở mỗi bước cần phải cụ thể, rõ ràng và trình tự thực hiện các bước là vô cùng quan trọng. Nếu bỏ qua hoặc đảo lộn thứ tự các bước thì sẽ không tạo được hình gấp chính xác [64].
* **Định nghĩa thuật toán:** Thuật toán là một dãy các chỉ dẫn rõ ràng, có trình tự sao cho khi thực hiện những chỉ dẫn này, người ta giải quyết được vấn đề hoặc nhiệm vụ đã cho [64].
* **Ví dụ thực tế:** 
  * Trong cuộc sống hàng ngày: Quy trình để chế biến một món ăn (công thức nấu ăn), quy trình gấp một chiếc áo, quy trình hướng dẫn lắp ráp một đồ chơi... đều là những thuật toán [64].
  * Trong học tập: Các bước cụ thể để giải một bài toán (như tính trung bình cộng, tìm ước chung lớn nhất) chính là thuật toán [64].

### 2. Mô tả thuật toán [64, 65]
Có hai cách thông dụng nhất để mô tả thuật toán:
* **Cách 1: Liệt kê các bước bằng ngôn ngữ tự nhiên:** Sử dụng ngôn ngữ nói hoặc viết hàng ngày để liệt kê lần lượt, tuần tự các bước cần thực hiện từ đầu đến cuối [64, 65].
* **Cách 2: Sử dụng sơ đồ khối:** Biểu diễn các bước của thuật toán bằng một sơ đồ hình vẽ trực quan [64, 65]. Mỗi bước được đặt trong một hình hình học quy ước, hướng thực hiện tiếp theo được chỉ ra bằng các đường mũi tên [65].

#### Bảng quy ước các ký hiệu trong sơ đồ khối thuật toán [65]:
| Ký hiệu hình học | Ý nghĩa / Chức năng | Ví dụ áp dụng |
| :---: | :--- | :--- |
| **Hình oval (Elip)** | **Bắt đầu** hoặc **Kết thúc** thuật toán | Đặt ở đầu và cuối sơ đồ để khởi chạy hoặc dừng |
| **Hình bình hành** | **Đầu vào (Input)** hoặc **Đầu ra (Output)** | Nhập dữ liệu ban đầu hoặc xuất kết quả tính toán |
| **Hình chữ nhật** | **Bước xử lý** | Thực hiện phép tính toán, gán giá trị hoặc hành động |
| **Hình thoi** | **Bước kiểm tra điều kiện** | Đưa ra câu hỏi điều kiện để quyết định hướng đi (Đúng / Sai) |
| **Mũi tên** | **Chỉ hướng thực hiện tiếp theo** | Dẫn dắt trình tự thực thi các bước của thuật toán |

### Lời giải bài tập Luyện tập & Vận dụng (Trang 64, 65, 66)
* **Câu hỏi trắc nghiệm (Trang 64):**
  1. *Thuật toán là gì?* $\rightarrow$ Đáp án đúng: **C** (Một dãy các chỉ dẫn rõ ràng, có trình tự sao cho khi thực hiện những chỉ dẫn này người ta giải quyết được vấn đề hoặc nhiệm vụ đã cho) [64].
  2. *Chọn các câu đúng về Đầu vào và Đầu ra:* $\rightarrow$ Đáp án đúng: **B** (Thuật toán có đầu vào là các dữ liệu ban đầu) và **C** (Thuật toán có đầu ra là kết quả nhận được sau khi thực hiện các bước của thuật toán) [64].
* **Câu hỏi về sơ đồ khối (Trang 65):**
  1. *Câu nào sau đây sai khi nói về vai trò của mũi tên trong sơ đồ khối?* $\rightarrow$ Đáp án đúng: **C** (Mũi tên được sử dụng chỉ để kết nối các hình khối trong sơ đồ khối - vì mũi tên có vai trò định hướng đường đi, chỉ ra bước thực hiện tiếp theo chứ không đơn thuần là kết nối tĩnh) [65].
  2. *Hãy ghép mỗi mục ở cột bên phải với một mục phù hợp ở cột bên trái nói về sơ đồ khối:*
     * 1) Hình oval $\rightarrow$ **a)** Bắt đầu hoặc Kết thúc [65].
     * 2) Hình bình hành $\rightarrow$ **c)** Đầu vào hoặc Đầu ra [65].
     * 3) Hình chữ nhật $\rightarrow$ **d)** Bước xử lý [65].
     * 4) Mũi tên $\rightarrow$ **b)** Chỉ hướng thực hiện tiếp theo [65].
* **Bài tập Luyện tập (Trang 66):**
  1. *Hãy tìm đầu vào, đầu ra của các thuật toán sau đây:*
     * a) Thuật toán tính trung bình cộng của hai số $a, b$:
       * **Đầu vào:** Hai số $a, b$ [66].
       * **Đầu ra:** Trung bình cộng của $a$ và $b$ (bằng $(a+b)/2$) [66].
     * b) Thuật toán tìm ước chung lớn nhất của hai số tự nhiên $a$ và $b$:
       * **Đầu vào:** Hai số tự nhiên $a, b$ [66].
       * **Đầu ra:** Ước chung lớn nhất của $a$ và $b$ [66].
  2. *Phân tích sơ đồ khối Hình 6.3:*
     * Sơ đồ khối mô tả thuật toán tính tổng của hai số $a$ và $b$ hoặc tính trung bình cộng của $a, b$ (tùy thuộc vào kết quả của bước cuối). Theo các khối vẽ: nhập $a, b$ $\rightarrow$ tính $Tổng = a + b$ $\rightarrow$ thông báo kết quả [66].
     * **Đầu vào:** Hai số $a, b$ [66].
     * **Đầu ra:** Tổng của hai số $a$ và $b$ [66].
  3. *Hãy sắp xếp các phần được đánh số trong Hình 6.4 để được thuật toán tính trung bình cộng của hai số $a$ và $b$:*
     * Trình tự đúng: **3 $\rightarrow$ 1 $\rightarrow$ 2 $\rightarrow$ 4 $\rightarrow$ 5 $\rightarrow$ 6** [66].
       * Bước 3 (Bắt đầu) $\rightarrow$ Bước 1 (Nhập $a, b$) $\rightarrow$ Bước 2 (Tính $Tổng = a + b$ ) $\rightarrow$ Bước 4 (Tính $Trung bình cộng = Tổng / 2$) $\rightarrow$ Bước 5 (Thông báo $Trung bình cộng$) $\rightarrow$ Bước 6 (Kết thúc) [66].
* **Bài tập Vận dụng (Trang 66):**
  1. *Thuật toán làm kem sữa chua xoài (Hình 6.5):*
     * **Đầu vào:** Nguyên liệu gồm xoài ($250g$), sữa chua ($100g$), mật ong ($1$ thìa cà phê), dụng cụ (tô to, khuôn làm kem) [66].
     * **Đầu ra:** Kem sữa chua xoài thơm ngon [66].
     * **Sơ đồ khối thể hiện thuật toán:**
       * `[Bắt đầu]` $\rightarrow$ `[Nhập nguyên liệu: Xoài, sữa chua, mật ong...]` $\rightarrow$ `[Cho xoài vào tô và nghiền nát]` $\rightarrow$ `[Cho sữa chua và mật ong vào tô rồi trộn đều]` $\rightarrow$ `[Cho hỗn hợp vào khuôn làm kem]` $\rightarrow$ `[Đặt khuôn vào ngăn đá tủ lạnh ít nhất 4 tiếng]` $\rightarrow$ `[Lấy kem ra thưởng thức]` $\rightarrow$ `[Kết thúc]`.
  2. *Mô tả thuật toán tính điểm trung bình ba môn Toán, Ngữ văn, Ngoại ngữ:*
     * **Cách 1: Liệt kê các bước:**
       * Bước 1: Nhập điểm ba môn: Toán (T), Ngữ văn (V), Ngoại ngữ (A).
       * Bước 2: Tính tổng điểm: $Tổng = T + V + A$.
       * Bước 3: Tính điểm trung bình: $ĐTB = Tổng / 3$.
       * Bước 4: Thông báo kết quả $ĐTB$ ra màn hình.
     * **Cách 2: Sơ đồ khối:**
       * `[Bắt đầu]` $\rightarrow$ `[Nhập điểm T, V, A]` $\rightarrow$ `[Tính Tổng = T + V + A]` $\rightarrow$ `[Tính ĐTB = Tổng / 3]` $\rightarrow$ `[Thông báo ĐTB]` $\rightarrow$ `[Kết thúc]`.
  3. *Ví dụ thuật toán giải quyết một nhiệm vụ trong thực tế (Pha trà chanh gừng):*
     * **Nhiệm vụ:** Pha một cốc trà chanh gừng ấm giải cảm.
     * **Đầu vào:** Gói trà túi lọc, nước sôi, vài lát gừng tươi, nửa quả chanh, mật ong.
     * **Đầu ra:** Cốc trà chanh gừng nóng hổi.
     * **Các bước thực hiện:**
       * Bước 1: Cho túi trà và gừng tươi vào cốc.
       * Bước 2: Rót nước sôi đầy cốc và đợi khoảng 3 - 5 phút để trà ngấm chất gừng.
       * Bước 3: Vớt bỏ túi trà ra ngoài.
       * Bước 4: Thêm 1 thìa mật ong và vắt chanh vào cốc rồi khuấy đều.
       * Bước 5: Thưởng thức.

---

## BÀI 16: CÁC CẤU TRÚC ĐIỀU KHIỂN [67]

Sau bài học này, học sinh sẽ làm quen với ba cấu trúc điều khiển cơ bản được sử dụng để xây dựng mọi thuật toán: cấu trúc tuần tự, cấu trúc rẽ nhánh và cấu trúc lặp [67].

### 1. Ba cấu trúc điều khiển cơ bản
Mọi thuật toán đều có thể được mô tả bằng cách kết hợp ba cấu trúc điều khiển sau đây [67]:

* **a) Cấu trúc tuần tự (Sequential Structure):**
  * **Đặc điểm:** Các bước hoặc các lệnh trong thuật toán được thực hiện lần lượt, tuần tự theo trình tự từ trên xuống dưới, từ bắt đầu đến kết thúc [67, 68].
  * **Sơ đồ khối:** Thể hiện bằng các khối chữ nhật xử lý nối tiếp nhau bằng các mũi tên đi thẳng xuống [68].
* **b) Cấu trúc rẽ nhánh (Selection/Branching Structure):**
  * **Đặc điểm:** Tùy thuộc vào kết quả kiểm tra một điều kiện cụ thể (Đúng hay Sai) mà thuật toán sẽ quyết định thực hiện công việc này hay công việc khác [67, 68].
  * **Phân loại:**
    * **Rẽ nhánh dạng thiếu (Hình 6.7):** Nếu điều kiện Đúng thì thực hiện lệnh/công việc, nếu Sai thì bỏ qua và chuyển sang bước tiếp theo [68].
      * *Cú pháp:* "Nếu <Điều kiện> thì <Thực hiện Lệnh>" [68, 70].
    * **Rẽ nhánh dạng đủ (Hình 6.8):** Nếu điều kiện Đúng thì thực hiện Lệnh 1, ngược lại (nếu điều kiện Sai) thì thực hiện Lệnh 2 [68].
      * *Cú pháp:* "Nếu <Điều kiện> thì <Thực hiện Lệnh 1>, ngược lại <Thực hiện Lệnh 2>" [68, 70].
  * **Sơ đồ khối:** Sử dụng **hình thoi** để kiểm tra điều kiện. Có hai mũi tên đi ra tương ứng với hai nhánh **Đúng** và **Sai** [65, 68].
* **c) Cấu trúc lặp (Loop/Repetition Structure):**
  * **Đặc điểm:** Cho phép lặp đi lặp lại một hoặc một nhóm các bước công việc cho đến khi một điều kiện kết thúc lặp được thỏa mãn [69].
  * **Nguyên tắc cốt lõi:** Trong cấu trúc lặp bao giờ cũng phải có **khâu kiểm tra điều kiện** để quyết định khi nào dừng lặp (tránh vòng lặp vô hạn gây treo máy) [69].
  * **Sơ đồ khối:** Đường mũi tên quay ngược lại khối kiểm tra điều kiện ở phía trước để tạo thành một vòng khép kín (vòng lặp) [69].

### Lời giải bài tập Luyện tập & Vận dụng (Trang 68, 69, 70)
* **Câu hỏi củng cố (Trang 68):**
  1. *Em hãy kể hai công việc trong cuộc sống thực tế thực hiện tuần tự theo các bước:*
     * Ví dụ 1: Các bước đánh răng buổi sáng (Lấy bàn chải $\rightarrow$ Tra kem đánh răng $\rightarrow$ Chải răng $\rightarrow$ Súc miệng sạch).
     * Ví dụ 2: Các bước nấu cơm bằng nồi điện (Vo gạo sạch $\rightarrow$ Đong nước vừa đủ $\rightarrow$ Lau khô đáy nồi $\rightarrow$ Cắm điện và nhấn nút Cook).
  2. *Câu "Nếu trời mưa thì em không đi đá bóng" có chứa cấu trúc nào?*
     * Câu này chứa **Cấu trúc rẽ nhánh dạng thiếu** [68].
     * Sơ đồ khối: Khối hình thoi kiểm tra điều kiện `[Trời mưa?]`. Nếu **Đúng** $\rightarrow$ thực hiện khối xử lý `[Không đi đá bóng]`. Nếu **Sai** $\rightarrow$ bỏ qua và chuyển tiếp đến các hoạt động khác ở nhà.
* **Câu hỏi lặp (Trang 69):**
  1. *Em hãy kể hai công việc trong cuộc sống mà việc thực hiện gồm các bước được lặp lại nhiều lần:*
     * Ví dụ 1: Quét nhà (Hành động đưa chổi quét được lặp đi lặp lại cho đến khi cả sàn nhà sạch bóng thì dừng).
     * Ví dụ 2: Học từ vựng tiếng Anh (Đọc và viết lại từ mới nhiều lần cho đến khi thuộc lòng cách viết và nghĩa thì dừng).
  2. *Lập trình di chuyển mèo Scratch (Hình 6.10):*
     * a) Điều kiện để chú mèo dừng lại là: **Chú mèo chạm vào biên** (`touching edge`) [69].
     * b) Các bước điền vào sơ đồ khối: Khối kiểm tra điều kiện hình thoi ghi `[Chạm biên?]`. Nếu **Sai** $\rightarrow$ Thực hiện khối xử lý `[Di chuyển 10 bước]` rồi quay lại kiểm tra điều kiện. Nếu **Đúng** $\rightarrow$ `[Dừng lại]` [69].
* **Bài tập Luyện tập (Trang 70):**
  1. *Em hãy trình bày các câu sau đây dưới dạng sơ đồ khối cấu trúc rẽ nhánh:*
     * a) *Nếu có kẻ trên mạng đe dọa thì em cần nói cho cha mẹ biết:*
       * Sơ đồ khối: `[Bắt đầu]` $\rightarrow$ Điều kiện `[Có kẻ trên mạng đe dọa?]` $\rightarrow$ Nếu **Đúng** $\rightarrow$ Thực hiện `[Nói cho cha mẹ biết]` $\rightarrow$ `[Kết thúc]`. (Nhánh Sai rẽ trực tiếp sang `[Kết thúc]`) [70].
     * b) *Nếu nhận được thư điện tử có đính kèm tệp từ địa chỉ không quen biết thì em không nên mở tệp đính kèm:*
       * Sơ đồ khối: `[Bắt đầu]` $\rightarrow$ Điều kiện `[Nhận thư từ địa chỉ không quen biết có tệp đính kèm?]` $\rightarrow$ Nếu **Đúng** $\rightarrow$ Thực hiện `[Không nên mở tệp đính kèm]` $\rightarrow$ `[Kết thúc]` [70].
     * c) *Nếu có tin nhắn từ người không quen biết yêu cầu gửi thông tin cá nhân thì em không nên gửi:*
       * Sơ đồ khối: `[Bắt đầu]` $\rightarrow$ Điều kiện `[Có tin nhắn từ người lạ yêu cầu gửi thông tin cá nhân?]` $\rightarrow$ Nếu **Đúng** $\rightarrow$ Thực hiện `[Không gửi thông tin cá nhân]` $\rightarrow$ `[Kết thúc]` [70].
  2. *Trong các câu sau đây, câu nào có thể biểu diễn bằng sơ đồ khối có cấu trúc lặp?*
     * Đáp án đúng: **b)** "Nếu vẫn chưa làm hết bài tập, em phải làm bài tập đến khi nào hết." [70]. Vì hành động "làm bài tập" được lặp đi lặp lại nhiều lần cho đến khi điều kiện dừng "hết bài tập" được thỏa mãn [70].
  3. *Em hãy quan sát hai sơ đồ khối trong Hình 6.11a, Hình 6.11b và cho biết mỗi sơ đồ khối mô tả cấu trúc nào?*
     * Hình 6.11a mô tả **Cấu trúc lặp** [70]. Điều kiện kiểm tra `[Chưa trúng đích?]` dẫn đến hành động lặp `[Ném bóng vào đích]` cho đến khi bóng trúng đích mới dừng [70].
     * Hình 6.11b mô tả **Cấu trúc rẽ nhánh (dạng thiếu)** [70]. Hành động `[Ném bóng vào đích]` chỉ thực hiện một lần, sau đó dựa vào kết quả kiểm tra `[Trúng đích?]` để quyết định chuyển tiếp [70].
* **Bài tập Vận dụng (Trang 70):**
  1. *Phân tích ý kiến của bạn An về sơ đồ khối ở Hình 6.12a và 6.12b:*
     * Ý kiến của bạn An là **chính xác** [70].
     * Giải thích:
       * Ở Hình 6.12a (Cấu trúc rẽ nhánh), điều kiện kiểm tra `[Chưa hiểu bài?]` được đặt độc lập [70]. Nếu đúng thì chỉ thực hiện đúng một lần hành động `[Đọc lại sách]` rồi chuyển ngay sang `[Làm bài tập]` và kết thúc thuật toán [70].
       * Ở Hình 6.12b (Cấu trúc lặp), điều kiện kiểm tra `[Chưa hiểu bài?]` tạo thành một vòng lặp kín [70]. Cả hai hành động `[Đọc lại sách]` và `[Làm bài tập]` sẽ được lặp đi lặp lại liên tục cho đến khi hiểu bài mới thoát ra [70].
  2. *Trong trò chơi ở phần khởi động, việc tính điểm cho mỗi cặp chơi là một hoạt động lặp lại. Hãy chỉ rõ công việc được lặp lại và vẽ sơ đồ khối cấu trúc lặp của hoạt động này:*
     * Công việc lặp lại: Rút 1 phiếu câu hỏi và đọc $\rightarrow$ Nhận câu trả lời và đối chiếu $\rightarrow$ Cộng điểm nếu trả lời đúng [67, 70]. Hoạt động này lặp lại cho đến khi hết phiếu câu hỏi [67, 70].
     * Sơ đồ khối lặp: `[Kiểm tra: Còn phiếu câu hỏi?]` $\rightarrow$ Nếu Đúng $\rightarrow$ `[Rút 1 phiếu và đọc câu hỏi]` $\rightarrow$ `[Người chơi trả lời]` $\rightarrow$ `[Kiểm tra: Đúng hay Sai?]` $\rightarrow$ Nếu Đúng $\rightarrow$ `[Cộng 1 điểm]`; Nếu Sai $\rightarrow$ `[Không cộng điểm]` $\rightarrow$ Quay lại kiểm tra `[Còn phiếu câu hỏi?]`. Nếu Sai $\rightarrow$ `[Công bố kết quả]` $\rightarrow$ `[Kết thúc]`.
  3. *Mô tả việc cô giáo điểm danh:*
     * Hoạt động điểm danh kết hợp cả ba cấu trúc: **Cấu trúc lặp** (lặp lại việc gọi tên từng học sinh từ đầu đến cuối danh sách) [70]; **Cấu trúc rẽ nhánh dạng đủ** (kiểm tra nếu học sinh trả lời "Có" thì đánh dấu "Có mặt", ngược lại đánh dấu "Vắng mặt") [70].
     * Sơ đồ khối mô tả:
       * Khối lặp chính: `[Còn học sinh chưa điểm danh?]` $\rightarrow$ Nếu Đúng $\rightarrow$ `[Gọi tên học sinh tiếp theo]` $\rightarrow$ Rẽ nhánh kiểm tra: `[Học sinh trả lời \"Có\"?]` $\rightarrow$ Nhánh Đúng: `[Đánh dấu Có mặt]`; Nhánh Sai: `[Đánh dấu Vắng mặt]` $\rightarrow$ Quay lại kiểm tra `[Còn học sinh chưa điểm danh?]`. Nếu Sai $\rightarrow$ `[Kết thúc buổi điểm danh]`.

---

## BÀI 17: CHƯƠNG TRÌNH MÁY TÍNH [71]

Sau bài học này, học sinh sẽ hiểu được bản chất của một chương trình máy tính là gì, cách chuyển đổi một thuật toán đã học thành các khối lệnh lập trình để máy tính có thể hiểu và thực thi trực tiếp [71].

### 1. Chương trình máy tính là gì?
* **Bản chất:** Máy tính không tự giải quyết được vấn đề nếu không có sự chỉ dẫn của con người [71]. Để máy tính giải quyết vấn đề, ta phải mô tả thuật toán bằng một dãy các lệnh mà máy tính có thể "hiểu" và thực hiện được [71]. Dãy các lệnh đó tạo thành một **Chương trình máy tính** [71, 72].
* **Ngôn ngữ lập trình:** Là ngôn ngữ đặc biệt được dùng để viết nên các chương trình máy tính [71]. Có nhiều ngôn ngữ lập trình khác nhau như Scratch (lập trình kéo thả khối trực quan phù hợp với lứa tuổi học sinh), Python, C++, Java... [72].
* **Quy trình hoạt động:** Chương trình máy tính nhận dữ liệu **Đầu vào (Input)** $\rightarrow$ Tiến hành thực hiện tuần tự các câu lệnh để **Xử lý** dữ liệu $\rightarrow$ Trả về kết quả **Đầu ra (Output)** [72].

### 2. Thực hành: Tạo chương trình máy tính tính tiền bán thiệp chúc mừng [72, 73]
**Nhiệm vụ:** Viết chương trình tính toán số tiền lãi hoặc số tiền bị lỗ khi ba bạn An, Minh, Khoa bán thiệp chúc mừng tự làm để quyên góp từ thiện [72].
* **a) Xác định bài toán:**
  * **Đầu vào:** Số tiền bán được ($a$), số tiền mua vật liệu ban đầu ($b$) [73].
  * **Đầu ra:** Số tiền lãi thu được hoặc số tiền bị lỗ tương ứng [73].
* **b) Thiết lập thuật toán rẽ nhánh bằng sơ đồ khối (Hình 6.14) [73]:**
  * Nhập hai số $a$ và $b$ [73].
  * So sánh điều kiện: Nếu số tiền bán được $a$ lớn hơn hoặc bằng tiền vật liệu $b$ ($a \ge b$) [73]:
    * Nhánh Đúng: $Tiền lãi = a - b$. Thông báo số tiền lãi [73].
    * Nhánh Sai: $Tiền lỗ = b - a$. Thông báo số tiền bị lỗ [73].
* **c) Lập trình trên môi trường Scratch (Hình 6.14) [73]:**
  * Sử dụng sự kiện `khi nhấn vào lá cờ xanh` [73].
  * Khai báo và sử dụng lệnh hỏi `Nhập số tiền bán a:` và đặt biến $a$ bằng kết quả `trả lời` [73].
  * Khai báo và sử dụng lệnh hỏi `Nhập số tiền mua vật liệu b:` và đặt biến $b$ bằng kết quả `trả lời` [73].
  * Sử dụng cấu trúc điều khiển rẽ nhánh dạng đủ `nếu ... thì ... không thì` [73]:
    * Nếu $a \ge b$ thì đặt biến `tiền lãi` thành $a - b$, dùng khối lệnh `nói` để thông báo: `Số tiền lãi là: [tiền lãi]` [73].
    * Không thì đặt biến `tiền lỗ` thành $b - a$, dùng khối lệnh `nói` để thông báo: `Số tiền bị lỗ là: [tiền lỗ]` [73].

### Lời giải bài tập Luyện tập & Vận dụng (Trang 72, 74)
* **Câu hỏi củng cố (Trang 72):**
  * Bảng so sánh chương trình ngôn ngữ tự nhiên và chương trình Scratch tính tổng hai số $a$ và $b$:
    1. *Nhập dữ liệu đầu vào:*
       * Ngôn ngữ tự nhiên: Nhập hai số $a, b$ [72].
       * Chương trình Scratch: Dùng khối lệnh `hỏi Nhập số a: và đợi` $\rightarrow$ `đặt a là trả lời`; `hỏi Nhập số b: và đợi` $\rightarrow$ `đặt b là trả lời` [72].
    2. *Xử lý tính toán:*
       * Ngôn ngữ tự nhiên: Tính tổng $tong = a + b$ [72].
       * Chương trình Scratch: Dùng khối lệnh `đặt tong là a + b` [72].
    3. *Thông báo kết quả đầu ra:*
       * Ngôn ngữ tự nhiên: Thông báo giá trị của tong [72].
       * Chương trình Scratch: Dùng khối lệnh `nói nối Tổng a và b là: với tong trong 2 giây` [72].
* **Bài tập Luyện tập (Trang 74):**
  1. *Tìm câu sai về chương trình máy tính:* $\rightarrow$ Đáp án đúng: **C** (Máy tính có thể thực hiện các lệnh trong chương trình theo trình tự tùy ý - vì máy tính luôn thực hiện các lệnh một cách nghiêm ngặt theo trình tự tuần tự đã được lập trình sẵn trong chương trình, không thể thực hiện tùy ý) [71, 74].
  2. *Cho chương trình Scratch như ở Hình 6.15:*
     * a) Chương trình thực hiện thuật toán: **Tính điểm trung bình cộng ba môn Toán, Văn, Anh và đưa ra nhận xét khen thưởng (thưởng ngôi sao) hoặc động viên** [74].
     * b) Xác định đầu vào, đầu ra của thuật toán:
       * **Đầu vào:** Điểm ba môn học gồm điểm Toán ($a$), điểm Văn ($b$) và điểm Tiếng Anh ($c$) [74].
       * **Đầu ra:** Điểm trung bình cộng ($DTB$) và lời nhận xét hiển thị trên màn hình [74].
     * c) Cho ví dụ cụ thể giá trị dữ liệu đầu vào và cho biết kết quả đầu ra tương ứng:
       * Ví dụ: Nếu nhập điểm đầu vào: Toán = $9.0$, Văn = $8.0$, Anh = $8.5$. 
       * Điểm trung bình tính được: $DTB = (9.0 + 8.0 + 8.5) / 3 = 8.5$ [74].
       * Vì $8.5 > 8.0$, điều kiện rẽ nhánh Đúng $\rightarrow$ Kết quả đầu ra: Chú mèo nói "Bạn được thưởng ngôi sao" trong 2 giây [74].
     * d) Hãy trình bày thuật toán bằng sơ đồ khối:
       * `[Bắt đầu]` $\rightarrow$ `[Nhập điểm a, b, c]` $\rightarrow$ `[Tính DTB = (a+b+c)/3]` $\rightarrow$ Điều kiện: `[DTB > 8.0?]`
         * Nhánh Đúng $\rightarrow$ `[Nói: Bạn được thưởng ngôi sao]` $\rightarrow$ `[Kết thúc]` [74].
         * Nhánh Sai $\rightarrow$ `[Nói: Bạn cố gắng lên nhé]` $\rightarrow$ `[Kết thúc]` [74].
  3. *Cho chương trình Scratch như ở Hình 6.16:*
     * a) Chương trình thực hiện công việc: **Cho nhân vật chào người dùng, sau đó lặp lại 10 lần các hành động: di chuyển 10 bước, chơi nhạc cụ gõ trống trong 0.25 nhịp, đổi hướng di chuyển nếu chạm vào cạnh sân khấu** [69, 74].
     * b) Các cấu trúc điều khiển có được sử dụng trong chương trình không?
       * **Cấu trúc tuần tự:** Có, thực hiện lần lượt các bước: Chào người dùng `Xin chào!` $\rightarrow$ Chạy vòng lặp [74].
       * **Cấu trúc rẽ nhánh:** Có, câu lệnh `nếu chạm biên, bật lại` là cấu trúc rẽ nhánh dạng thiếu được lồng ghép bên trong vòng lặp [74].
       * **Cấu trúc lặp:** Có, câu lệnh `lặp lại 10 lần` là cấu trúc lặp với số lần biết trước [74].
* **Bài tập Vận dụng (Trang 74):**
  1. *Em hãy vẽ sơ đồ khối mô tả thuật toán tìm số lớn hơn trong hai số $a$ và $b$. Từ sơ đồ khối, hãy viết chương trình Scratch thực hiện thuật toán:*
     * **Sơ đồ khối:**
       * `[Bắt đầu]` $\rightarrow$ `[Nhập hai số a, b]` $\rightarrow$ Điều kiện `[a > b?]`
         * Nhánh Đúng $\rightarrow$ `[Thông báo: Số lớn hơn là a]` $\rightarrow$ `[Kết thúc]`.
         * Nhánh Sai $\rightarrow$ `[Thông báo: Số lớn hơn là b]` $\rightarrow$ `[Kết thúc]`.
     * **Chương trình Scratch tương ứng:**
       * `khi nhấn vào cờ xanh` $\rightarrow$ `hỏi Nhập số a: và đợi` $\rightarrow$ `đặt a là trả lời` $\rightarrow$ `hỏi Nhập số b: và đợi` $\rightarrow$ `đặt b là trả lời` $\rightarrow$ `nếu a > b thì nói kết hợp Số lớn hơn là với a; không thì nói kết hợp Số lớn hơn là với b`.
  2. *Em hãy viết chương trình Scratch thực hiện thuật toán tính trung bình cộng của ba số:*
     * **Các khối lệnh Scratch:**
       * `khi nhấn vào cờ xanh`
       * `hỏi Nhập số thứ nhất: và đợi` $\rightarrow$ `đặt x là trả lời`
       * `hỏi Nhập số thứ hai: và đợi` $\rightarrow$ `đặt y là trả lời`
       * `hỏi Nhập số thứ ba: và đợi` $\rightarrow$ `đặt z là trả lời`
       * `đặt Tổng là x + y + z`
       * `đặt TBC là Tổng / 3`
       * `nói kết hợp Trung bình cộng của ba số là: với TBC trong 2 giây`.

---

## BẢNG GIẢI THÍCH THUẬT NGỮ CHUYÊN NGÀNH (CHỦ ĐỀ 6) [75]

* **Đầu vào (Input):** Dữ liệu được đưa vào quá trình xử lý theo một thuật toán hoặc chương trình máy tính [64, 75].
* **Đầu ra (Output):** Kết quả nhận được sau khi thực hiện các bước xử lý của thuật toán hoặc chương trình máy tính [64, 75].
* **Mô tả thuật toán:** Cách thức biểu diễn các chỉ dẫn của thuật toán bằng ngôn ngữ tự nhiên hoặc sơ đồ khối để con người hiểu [64, 75].
* **Cấu trúc tuần tự:** Cấu trúc tổ chức thuật toán trong đó các bước được thực hiện lần lượt theo trình tự xuất hiện từ trên xuống dưới [67, 75].
* **Cấu trúc rẽ nhánh:** Cấu trúc tổ chức thuật toán để xác định sự thay đổi thứ tự thực hiện các câu lệnh dựa trên một điều kiện kiểm tra Đúng hay Sai [67, 75].
* **Cấu trúc lặp:** Cấu trúc tổ chức thuật toán để thực hiện lặp đi lặp lại nhiều lần các câu lệnh hoặc công việc [69, 75].
