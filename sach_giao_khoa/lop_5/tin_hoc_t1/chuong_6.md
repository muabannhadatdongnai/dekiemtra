# CHỦ ĐỀ 6: GIẢI QUYẾT VẤN ĐỀ VỚI SỰ TRỢ GIÚP CỦA MÁY TÍNH

## BÀI 10: CẤU TRÚC TUẦN TỰ

### 🎯 Yêu cầu cần đạt
Sau bài học này, em sẽ:
- Nêu được ví dụ cụ thể mô tả cấu trúc tuần tự.
- Sử dụng được cấu trúc tuần tự trong một số chương trình đơn giản.

---

### 🚀 Khởi động
Trong cuộc sống và học tập hằng ngày, có rất nhiều công việc cần được thực hiện lần lượt theo từng bước theo một thứ tự nhất định. Chẳng hạn, để định dạng phông chữ và cỡ chữ trong văn bản, em cần thực hiện lần lượt các bước:
- **Bước 1:** Chọn phần văn bản cần định dạng.
- **Bước 2:** Nháy chuột vào lệnh phông chữ để chọn phông chữ (ví dụ: *Verdana*).
- **Bước 3:** Nháy chuột vào lệnh cỡ chữ và chọn cỡ chữ (ví dụ: *12*).

Việc thực hiện lần lượt từng bước theo thứ tự như vậy được gọi là thực hiện **tuần tự**. Em hãy kể thêm ba hoạt động hằng ngày của em được thực hiện một cách tuần tự nhé!

---

### 1. Cấu trúc tuần tự

#### **Hoạt động 1: Chương trình "Xin chào!"**
> *Em hãy sắp xếp các lệnh sau theo thứ tự đúng để được chương trình thực hiện ý tưởng: Nhân vật mèo xuất hiện trên sân khấu, di chuyển 100 bước và nói "Xin chào!" trong 3 giây. Mèo kêu meo và nói tiếp "Rất vui được gặp các bạn.".*
> 
> - a) Lệnh `nói [Rất vui được gặp các bạn.]`
> - b) Lệnh `phát âm thanh [Meow] đến hết`
> - c) Lệnh `di chuyển [100] bước`
> - d) Lệnh `Khi bấm vào cờ xanh` (Sự kiện bắt đầu)
> - e) Lệnh `nói [Xin chào!] trong [3] giây`

**Đáp án sắp xếp đúng:** 
Thứ tự thực hiện đúng để thể hiện ý tưởng trên là: **d -> c -> e -> b -> a**

**Khái niệm:**
- **Cấu trúc tuần tự:** Là cấu trúc mà các bước công việc được thực hiện lần lượt theo thứ tự, bước này kết thúc thì bước tiếp theo mới bắt đầu.
- **Chương trình có cấu trúc tuần tự:** Là chương trình trong đó các lệnh hoặc khối lệnh được thực hiện lần lượt từ trên xuống dưới theo thứ tự sắp xếp của chúng.

#### 📌 Hộp ghi nhớ
*   Trong cấu trúc tuần tự, các việc được thực hiện lần lượt theo thứ tự.
*   Trong chương trình có cấu trúc tuần tự, các lệnh hoặc khối lệnh được thực hiện lần lượt theo thứ tự.

#### ❓ Câu hỏi ôn tập
> *Chọn phát biểu sai:*
> 
> A. Trong cấu trúc tuần tự, các việc được thực hiện lần lượt theo thứ tự.  
> B. Trong chương trình có cấu trúc tuần tự, các lệnh được thực hiện lần lượt theo thứ tự.  
> C. Trong chương trình có cấu trúc tuần tự, các lệnh được thực hiện theo thứ tự ngẫu nhiên.  
> 
> *Đáp án đúng:* **C** (Vì trong chương trình cấu trúc tuần tự, các lệnh luôn chạy lần lượt theo thứ tự cố định, không ngẫu nhiên).

---

### 2. Thực hành tạo chương trình có cấu trúc tuần tự

#### **Nhiệm vụ 1: Tạo chương trình "Xin chào!"**
Em hãy sử dụng phần mềm Scratch để tạo chương trình điều khiển nhân vật mèo thực hiện lần lượt các hoạt động: Di chuyển 100 bước -> Nói "Xin chào!" trong 3 giây -> Kêu meo -> Nói "Rất vui được gặp các bạn.".

**Hướng dẫn:**
*   **Bước 1: Ghép khối lệnh.** Khởi động Scratch và sử dụng các khối lệnh tương ứng để ghép thành chương trình hoàn chỉnh:
    - Mèo di chuyển 100 bước: sử dụng lệnh `di chuyển [100] bước` (nhóm *Chuyển động*).
    - Mèo nói "Xin chào!": sử dụng lệnh `nói [Xin chào!] trong [3] giây` (nhóm *Hiển thị*).
    - Mèo kêu meo: sử dụng lệnh `phát âm thanh [Meow] đến hết` (nhóm *Âm thanh*).
    - Mèo nói "Rất vui được gặp các bạn.": sử dụng lệnh `nói [Rất vui được gặp các bạn.]` (nhóm *Hiển thị*).
*   **Bước 2: Chạy thử.** Nháy vào nút cờ xanh 🚩 để chạy thử chương trình và quan sát hoạt động của mèo trên sân khấu.
*   **Bước 3: Lưu tệp.** Chọn *Tệp -> Lưu về máy tính* và đặt tên tệp là `XinChao`.

#### **Nhiệm vụ 2: Tạo chương trình "Mèo di chuyển" tạo hiệu ứng hoạt hình**
Tạo chương trình điều khiển nhân vật mèo thực hiện tuần tự các hành động sau:
1. Di chuyển 10 bước.
2. Thay đổi động tác.
3. Đợi trong 1 giây.
*(Quá trình này được lặp lại tiếp thêm 2 lần nữa theo cấu trúc tuần tự để mèo đi tổng cộng 3 nhịp).*

**Hướng dẫn:**
*   **Bước 1:** Khởi động Scratch, mở một tệp chương trình mới.
*   **Bước 2:** Ghép các khối lệnh tuần tự tương ứng:
    - Di chuyển 10 bước: lệnh `di chuyển [10] bước`
    - Thay đổi động tác: lệnh `trang phục kế tiếp` (nhóm *Hiển thị*)
    - Đợi 1 giây: lệnh `đợi [1] giây` (nhóm *Điều khiển*)
*   **Bước 3:** Ghép lặp lại chuỗi 3 lệnh trên liên tiếp nhau để tạo ra khối lệnh tuần tự dài gồm 9 lệnh như Hình 74.
*   **Bước 4:** Chạy thử chương trình để quan sát chuyển động bước đi sinh động của chú mèo.
*   **Bước 5:** Lưu tệp với tên là `MeoDiChuyen`.

#### 💡 Lưu ý:
Một nhân vật trong Scratch có thể có nhiều trang phục khác nhau thể hiện các tư thế khác nhau. Khi chúng ta thay đổi liên tiếp các trang phục của nhân vật (bằng lệnh `trang phục kế tiếp`) kết hợp với việc di chuyển và dừng chờ, chúng ta sẽ tạo ra một hiệu ứng hoạt hình chuyển động rất sinh động.

---

### 📝 Luyện tập
> *Cho chương trình điều khiển nhân vật mèo như Hình 75 dưới đây:*
> 
> ```
> Khi bấm vào 🚩
> di chuyển [50] bước
> nói [Xin chào bạn!] trong [2] giây
> trang phục kế tiếp
> nói [Chúc bạn vui vẻ!]
> ```
> 
> *a) Chương trình trên có cấu trúc tuần tự hay không?*  
> *b) Nhân vật thực hiện lần lượt những hành động nào khi chạy chương trình?*  
> 
> *Đáp án:*  
> a) Chương trình trên **có cấu trúc tuần tự** vì các lệnh được thực hiện từ trên xuống dưới, lệnh trước xong mới đến lệnh sau.  
> b) Khi chạy, nhân vật sẽ thực hiện lần lượt các hành động: **Di chuyển 50 bước -> Nói "Xin chào bạn!" trong 2 giây -> Thay đổi trang phục kế tiếp -> Nói "Chúc bạn vui vẻ!"**.

---

### 🌟 Vận dụng
> **1.** *Em hãy mô tả ý tưởng một chương trình tuần tự đơn giản để nhân vật nói "Tạm biệt!" và "Hẹn gặp lại!" thay cho "Xin chào!" và "Rất vui được gặp các bạn.".*  
> **2.** *Em hãy viết chương trình trong Scratch để thực hiện ý tưởng đó.*
> 
> *Gợi ý trả lời:*
> 1. Ý tưởng: Khi nhấn cờ xanh, nhân vật sẽ di chuyển 80 bước, sau đó nói "Tạm biệt!" trong 2 giây, tiếp theo phát âm thanh ngắn và cuối cùng nói "Hẹn gặp lại!".
> 2. Chương trình lắp ghép: `Khi bấm vào 🚩 -> di chuyển [80] bước -> nói [Tạm biệt!] trong [2] giây -> nói [Hẹn gặp lại!] trong [2] giây`.

---
---

## BÀI 11: CẤU TRÚC LẶP

### 🎯 Yêu cầu cần đạt
Sau bài học này, em sẽ:
- Nêu được ví dụ cụ thể mô tả cấu trúc lặp.
- Nhận biết được lệnh lặp trong một số chương trình đơn giản.

---

### 🚀 Khởi động
Trong môn Giáo dục thể chất, em đã làm quen với các bài tập thể dục có các động tác phải thực hiện lặp đi lặp lại nhiều lần. Ví dụ, bài tập nhảy đập bóng yêu cầu em lặp lại 20 lần động tác bật nhảy kết hợp với tay đập bóng. Em hãy kể tên một số công việc hằng ngày khác của em cũng có tính chất lặp lại nhé!

---

### 1. Cấu trúc lặp

#### **Hoạt động 1: Tìm hiểu cấu trúc lặp**
> *Trong Nhiệm vụ 2 của Bài 10, em đã tạo chương trình "MeoDiChuyen" điều khiển nhân vật mèo di chuyển và thay đổi động tác (Hình 74). Trong chương trình đó, nhóm các lệnh nào được lặp lại? Lặp lại bao nhiêu lần? Làm thế nào để chương trình ngắn gọn hơn?*

**Giải thích chi tiết:**
Trong chương trình "MeoDiChuyen", nhóm 3 lệnh gồm: `di chuyển [10] bước`, `trang phục kế tiếp` và `đợi [1] giây` đã được lặp đi lặp lại **3 lần**. Việc viết lặp đi lặp lại một nhóm lệnh khiến chương trình bị dài dòng và mất thời gian soạn thảo.

Để giải quyết vấn đề này, các ngôn ngữ lập trình cung cấp **cấu trúc lặp**. 
- **Cấu trúc lặp:** Là cấu trúc mô tả các hoạt động, công việc được thực hiện lặp đi lặp lại nhiều lần.
- **Chương trình có cấu trúc lặp:** Là chương trình chứa lệnh hoặc khối lệnh được thực hiện lặp lại. Thay vì viết lại nhóm lệnh nhiều lần, ta chỉ cần bỏ nhóm lệnh đó vào trong một **lệnh lặp** và thiết lập số lần lặp. Chương trình sẽ trở nên cực kỳ ngắn gọn và dễ quản lý (Hình 77b).

#### 📌 Hộp ghi nhớ
*   Trong cấu trúc lặp, công việc được thực hiện lặp lại.
*   Trong chương trình có cấu trúc lặp, lệnh hoặc khối lệnh được thực hiện lặp lại.

---

### 2. Các lệnh lặp trong Scratch

Để điều khiển cấu trúc lặp, Scratch cung cấp cho chúng ta ba lệnh lặp chính nằm trong nhóm lệnh **Điều khiển** (Control):

| Lệnh lặp | Tên gọi | Mô tả hoạt động |
| :--- | :--- | :--- |
| `lặp lại [10]` | **Lặp với số lần biết trước** | Khối lệnh bên trong sẽ được thực hiện lặp lại đúng số lần đã được thiết lập (ví dụ: lặp lại 10 lần, 3 lần,...). |
| `liên tục` | **Lặp liên tục (không giới hạn)** | Khối lệnh bên trong sẽ được lặp đi lặp lại liên tục mãi mãi, không bao giờ tự dừng trừ khi người dùng nhấn nút dừng chương trình 🛑. |
| `lặp lại cho đến khi <điều kiện>` | **Lặp có điều kiện** | Khối lệnh bên trong sẽ liên tục được lặp lại, cho đến khi điều kiện ở ô điều kiện được thỏa mãn (đúng/True) thì vòng lặp sẽ dừng lại. |

#### ❓ Câu hỏi ôn tập
> *Để điều khiển nhân vật mèo lặp lại động tác vỗ cánh đúng 15 lần, em nên chọn loại lệnh lặp nào trong 3 loại trên?*  
> *Đáp án:* Ta chọn **Lệnh lặp với số lần biết trước** (`lặp lại [15]`).

---

### 📝 Luyện tập
> *Em hãy ghép mỗi khối lệnh lặp ở cột bên trái với ý nghĩa mô tả hoạt động tương ứng ở cột bên phải:*
> 
> | Khối lệnh lặp | Ý nghĩa hoạt động |
> | :--- | :--- |
> | **1)** Lệnh lặp `lặp lại cho đến khi <phím [khoảng trắng] được nhấn?>` chứa lệnh `trang phục kế tiếp`, `đợi [1] giây` | **a)** Nhân vật thay đổi trang phục liên tục không bao giờ dừng lại. |
> | **2)** Lệnh lặp `lặp lại [10]` chứa lệnh `trang phục kế tiếp`, `đợi [1] giây` | **b)** Nhân vật liên tục thay đổi trang phục cho đến khi người sử dụng nhấn phím khoảng trắng (phím Space) thì dừng lại. |
> | **3)** Lệnh lặp `liên tục` chứa lệnh `trang phục kế tiếp`, `đợi [1] giây` | **c)** Nhân vật lặp lại việc thay đổi trang phục đúng 10 lần rồi dừng lại. |
> 
> *Đáp án đúng:* **1 - b**, **2 - c**, **3 - a**.

---

### 🌟 Vận dụng
> *Một chú cá cảnh bơi liên tục trong bể thủy tinh tròn. Khi chú cá chạm vào thành bể thì chú tự động quay đầu bơi ngược lại. Em hãy mô tả các hoạt động của chú cá và cho biết khi lập trình, chúng ta sẽ sử dụng khối lệnh lặp nào để chương trình hoạt động đúng ý tưởng trên?*
> 
> *Trả lời:*
> - Hoạt động của chú cá: Cá di chuyển liên tục từng bước về phía trước -> Kiểm tra xem cá có chạm thành bể không -> Nếu chạm thành bể thì bật lại bơi tiếp -> Lặp lại quá trình này liên tục.
> - Khối lệnh lặp cần dùng: Sử dụng lệnh lặp **liên tục** (`liên tục`) vì hoạt động bơi của chú cá diễn ra liên tục không có điểm dừng đặt trước. Bên trong khối `liên tục`, ta sẽ ghép các lệnh: `di chuyển [5] bước`, `bật lại nếu chạm cạnh`, `đợi [0.1] giây`.

---
---

## BÀI 12: THỰC HÀNH SỬ DỤNG LỆNH LẶP

### 🎯 Yêu cầu cần đạt
Sau bài học này, em sẽ:
- Sử dụng được lệnh lặp trong một số chương trình đơn giản.
- Chạy thử và quan sát được kết quả hoạt động của chương trình.

---

### 🚀 Khởi động
Sau khi đã tìm hiểu về cấu trúc lặp, bạn Khoa nảy ra ý tưởng thiết kế một chương trình mô phỏng chú vẹt bay lượn sinh động trên nền trời xanh. Ý tưởng kịch bản như sau:
- **Nhân vật:** Chú vẹt (Parrot).
- **Sân khấu:** Chọn phông nền bầu trời (Sky) hoặc phông mặc định.
- **Hành động:** Chú vẹt liên tục vỗ cánh bay, di chuyển về phía trước, nếu gặp cạnh sân khấu thì tự động quay đầu bay tiếp để không bay mất khỏi màn hình.

Chúng ta hãy cùng giúp bạn Khoa thực hiện lập trình chương trình thú vị này qua bài thực hành dưới đây nhé!

---

### Lập trình mô phỏng chú vẹt bay

#### **Nhiệm vụ 1: Tạo khối lệnh di chuyển tuần tự cho chú vẹt**
Tạo khối lệnh cơ bản điều khiển chú vẹt thực hiện tuần tự các hành động: Di chuyển 10 bước -> Thay đổi hình dáng cánh (vỗ cánh) -> Đợi 1 giây -> Kiểm tra chạm cạnh sân khấu để bật lại.

**Hướng dẫn:**
*   **Bước 1:** Khởi động phần mềm Scratch. Nháy chuột phải vào nhân vật chú mèo mặc định và chọn *Xóa*.
*   **Bước 2:** Nháy vào biểu tượng chọn nhân vật, tìm và thêm nhân vật chú vẹt **Parrot** (trong danh mục Động vật).
*   **Bước 3:** Chuyển sang phần sân khấu, thêm phông nền bầu trời cho đẹp mắt.
*   **Bước 4:** Lắp ghép các lệnh tuần tự cho chú vẹt:
    - `di chuyển [10] bước`
    - `trang phục kế tiếp` (để tạo hiệu ứng vỗ cánh do nhân vật Parrot có sẵn 2 trang phục cánh vỗ lên và vỗ xuống).
    - `đợi [1] giây`
    - `bật lại nếu chạm cạnh` (nhóm *Chuyển động*).
*   **Bước 5:** Lưu tệp chương trình cơ sở này với tên là `HanhDongCuaVet`.

---

#### **Nhiệm vụ 2: Tạo ba chương trình lặp khác nhau cho chú vẹt**
Dựa trên khối lệnh cơ bản ở Nhiệm vụ 1, em hãy tạo ra 3 chương trình với 3 kiểu lặp khác nhau:

##### **a) Vẹt bay đúng 10 lần rồi nghỉ:**
*   **Cách làm:** Mở tệp `HanhDongCuaVet`. Kéo khối lệnh lặp `lặp lại [10]` bao quanh khối lệnh di chuyển ở Nhiệm vụ 1. 
*   **Khắc phục lỗi lộn ngược đầu:** Để tránh hiện tượng chú vẹt bị lộn ngược đầu khi chạm cạnh và quay đầu lại, em cần bổ sung thêm lệnh `đặt kiểu xoay [trái - phải]` đặt ngay phía dưới khối sự kiện `Khi bấm vào 🚩` (như Hình 80).
*   **Lưu tệp:** Lưu chương trình với tên `VetBay1`.

##### **b) Vẹt bay liên tục không ngừng:**
*   **Cách làm:** Mở tệp `HanhDongCuaVet`. Thay khối lệnh lặp bằng khối `liên tục` bao quanh toàn bộ các lệnh di chuyển của vẹt. Ghép thêm lệnh đặt kiểu xoay trái - phải tương tự câu a.
*   **Lưu tệp:** Lưu chương trình với tên `VetBay2`.

##### **c) Vẹt bay liên tục cho đến khi nháy chuột thì dừng:**
*   **Cách làm:** Mở tệp `HanhDongCuaVet`. Sử dụng khối lệnh lặp có điều kiện `lặp lại cho đến khi <ô điều kiện>`. Trong nhóm lệnh *Cảm biến*, kéo thả khối điều kiện `chuột được nhấn?` lắp vào ô điều kiện của vòng lặp. Ghép thêm lệnh đặt kiểu xoay đầu.
*   **Chạy thử:** Nhấn cờ xanh để vẹt bay liên tục trên màn hình. Khi em nhấp chuột trái vào bất kỳ vị trí nào trên sân khấu, chú vẹt sẽ dừng lại ngay lập tức.
*   **Lưu tệp:** Lưu chương trình với tên `VetBay3`.

---

### 📝 Luyện tập
> **1.** *Em hãy tạo một khối lệnh tuần tự mới cho một nhân vật bất kỳ thực hiện các hành động sau: Di chuyển 20 bước -> Thay đổi động tác -> Đợi 1 giây.*  
> **2.** *Từ khối lệnh trên, em hãy viết 3 chương trình con sử dụng các cấu trúc lặp:*  
> - *a) Lặp lại đúng 15 lần khối lệnh.*  
> - *b) Lặp liên tục không dừng.*  
> - *c) Lặp cho đến khi nhấp chuột trái.*

---

### 🌟 Vận dụng
> *Em hãy ứng dụng cấu trúc lặp với số lần biết trước trong Scratch để viết một chương trình điều khiển nhân vật vẽ một hình vuông hoàn chỉnh trên sân khấu.*  
> *(Gợi ý: Hình vuông có 4 cạnh bằng nhau và 4 góc vuông 90 độ. Hành động vẽ một cạnh rồi xoay góc 90 độ cần được lặp lại bao nhiêu lần?)*
> 
> *Trả lời:*
> Chương trình vẽ hình vuông sử dụng khối lệnh lặp như sau:
> ```
> Khi bấm vào 🚩
> Đặt bút vẽ (Sử dụng nhóm lệnh bút vẽ Extension)
> lặp lại [4]
>     di chuyển [100] bước
>     xoay [phải ↩] [90] độ
>     đợi [1] giây
> ```

---
---

## BÀI 13: CẤU TRÚC RẼ NHÁNH

### 🎯 Yêu cầu cần đạt
Sau bài học này, em sẽ:
- Nêu được ví dụ cụ thể mô tả cấu trúc rẽ nhánh.
- Sử dụng được cấu trúc rẽ nhánh trong một số chương trình đơn giản.

---

### 🚀 Khởi động
Trong cuộc sống hằng ngày, có những quyết định và hành động của chúng ta chỉ được thực hiện khi có một điều kiện cụ thể nào đó xảy ra. Ví dụ: khi chuẩn bị đi qua đường tại giao lộ có đèn tín hiệu dành cho người đi bộ:
- **Nếu** đèn tín hiệu màu xanh **thì** em được phép đi qua đường.
- **Nếu** đèn tín hiệu màu đỏ **thì** em phải dừng lại chờ trên vỉa hè.

Hành động qua đường hay dừng lại được thực hiện hay không phụ thuộc hoàn toàn vào điều kiện màu đèn tín hiệu. Cách giải quyết công việc dựa trên điều kiện như thế gọi là công việc có **cấu trúc rẽ nhánh**. Em hãy tìm thêm một ví dụ tương tự trong đời sống nhé!

---

### 1. Cấu trúc rẽ nhánh

#### **Hoạt động 1: Mèo đổi màu**
> *Bạn An thiết kế một chương trình Scratch mô phỏng hoạt động sau: Khi người dùng di chuyển con trỏ chuột chạm vào nhân vật chú mèo, chú mèo sẽ tự động thay đổi từ màu này sang màu khác. Em hãy:*
> 1. *Xác định điều kiện để chú mèo đổi màu.*
> 2. *Sử dụng mẫu câu "Nếu... thì..." để diễn đạt hoạt động của chú mèo.*

**Giải thích chi tiết:**
- Điều kiện để mèo đổi màu là: **"Con trỏ chuột chạm vào nhân vật chú mèo"**.
- Diễn đạt hoạt động của mèo bằng câu rẽ nhánh dạng thiếu: *"Nếu con trỏ chuột chạm vào chú mèo thì chú mèo đổi sang màu khác."*
- Diễn đạt hoạt động của mèo bằng câu rẽ nhánh dạng đủ: *"Nếu con trỏ chuột chạm vào chú mèo thì chú mèo đổi sang màu khác, nếu không thì chú mèo giữ nguyên (hoặc trở về) màu vàng ban đầu."*

Trong lập trình, cấu trúc rẽ nhánh được chia làm hai dạng chính:
- **Cấu trúc rẽ nhánh dạng thiếu:** Nếu *<điều kiện đúng>* thì thực hiện *<công việc>*.
- **Cấu trúc rẽ nhánh dạng đủ:** Nếu *<điều kiện đúng>* thì thực hiện *<công việc 1>*, nếu không thì (khi điều kiện sai) thực hiện *<công việc 2>*.

#### ❓ Câu hỏi ôn tập
> *Hãy sử dụng cấu trúc rẽ nhánh dạng đủ và điều kiện "đèn tín hiệu dành cho người đi bộ màu đỏ" để mô tả hoạt động của người đi bộ khi qua đường.*  
> *Đáp án:* **"Nếu đèn tín hiệu cho người đi bộ màu đỏ thì em dừng lại sát vỉa hè, nếu không thì em nhanh chóng đi qua đường trên vạch kẻ."**

---

### 2. Các lệnh rẽ nhánh trong Scratch

Để thực hiện cấu trúc rẽ nhánh, Scratch cung cấp hai lệnh chính nằm trong nhóm lệnh **Điều khiển**:

#### **a) Lệnh rẽ nhánh dạng thiếu (`nếu ... thì`):**
*   **Cú pháp:** `nếu <ô điều kiện> thì [khối lệnh thực hiện]`
*   **Ví dụ:** `nếu <đang chạm con trỏ chuột?> thì [thay đổi hiệu ứng màu một lượng 3]` (Hình 83a).
*   **Hoạt động:** Nếu điều kiện chạm con trỏ chuột là đúng, nhân vật sẽ đổi màu. Nếu điều kiện sai (không chạm), máy tính bỏ qua không làm gì cả.

#### **b) Lệnh rẽ nhánh dạng đủ (`nếu ... thì ... nếu không thì`):**
*   **Cú pháp:** `nếu <ô điều kiện> thì [khối lệnh 1] nếu không thì [khối lệnh 2]`
*   **Ví dụ:** `nếu <đang chạm con trỏ chuột?> thì [thay đổi hiệu ứng màu một lượng 3] nếu không thì [bỏ các hiệu ứng đồ họa]` (Hình 83b).
*   **Hoạt động:** Nếu chạm chuột thì mèo đổi màu, còn nếu không chạm chuột thì mèo lập tức xóa bỏ các hiệu ứng màu để trở lại màu sắc mặc định ban đầu.

#### 📌 Hộp ghi nhớ
*   Trong chương trình có cấu trúc rẽ nhánh, một lệnh hoặc khối lệnh được thực hiện hay không được thực hiện tùy thuộc vào điều kiện đúng hay sai.

---

### 3. Thực hành viết chương trình có cấu trúc rẽ nhánh

#### **Nhiệm vụ: Viết chương trình "Mèo đổi màu"**
Hãy lập trình chương trình điều khiển nhân vật chú mèo liên tục kiểm tra xem nếu chạm con trỏ chuột thì chú mèo sẽ đổi màu liên tục.

**Hướng dẫn:**
*   **Bước 1:** Khởi động Scratch.
*   **Bước 2:** Lắp ghép các khối lệnh như sau:
    - Kéo khối sự kiện `Khi bấm vào 🚩`.
    - Kéo khối lặp vô hạn `liên tục` ghép vào dưới.
    - Kéo lệnh rẽ nhánh dạng thiếu `nếu ... thì` đặt vào bên trong khối `liên tục` để chương trình kiểm tra điều kiện lặp lại mãi mãi.
    - Trong nhóm *Cảm biến*, kéo khối điều kiện hình lục giác `đang chạm con trỏ chuột?` lắp vào ô điều kiện của lệnh rẽ nhánh.
    - Trong nhóm *Hiển thị*, kéo lệnh `thay đổi hiệu ứng [màu] một lượng [3]` đặt vào bên trong thân của lệnh rẽ nhánh.
*   **Bước 3:** Chạy thử chương trình, rê chuột vào chú mèo để xem chú đổi màu lấp lánh sinh động. Rê chuột ra ngoài xem chú mèo có dừng đổi màu không.
*   **Bước 4:** Lưu tệp chương trình với tên là `MeoDoiMau`.

---

### 📝 Luyện tập
> *Em hãy quan sát khối lệnh rẽ nhánh ở Hình 85 và cho biết khối lệnh nào giúp điều khiển nhân vật thực hiện đúng ý tưởng: "Nếu mèo chạm con trỏ chuột thì đổi màu, nếu không thì mèo trở về màu vàng mặc định ban đầu"?*
> 
> *   *Khối A: sử dụng lệnh rẽ nhánh dạng thiếu.*
> *   *Khối B: sử dụng lệnh rẽ nhánh dạng đủ nhưng đổi thứ tự lệnh (nếu chạm chuột thì bỏ hiệu ứng đồ họa, ngược lại mới đổi màu).*
> *   *Khối C: sử dụng lệnh rẽ nhánh dạng đủ đúng thứ tự (nếu chạm chuột thì đổi màu, ngược lại thì bỏ hiệu ứng).*
> 
> *Đáp án đúng:* **Khối C**.

---

### 🌟 Vận dụng
> *Em hãy thực hành viết chương trình trong Scratch thể hiện ý tưởng rẽ nhánh dạng đủ ở câu hỏi Luyện tập trên. Hãy chạy thử và lưu chương trình với tên tệp là `MeoTroveMauVang`.*

---
---

## BÀI 14: SỬ DỤNG BIẾN TRONG CHƯƠNG TRÌNH

### 🎯 Yêu cầu cần đạt
Sau bài học này, em sẽ:
- Sử dụng được biến nhớ trong một số chương trình đơn giản.

---

### 🚀 Khởi động
Bạn An thiết kế một chương trình trò chuyện thân thiện trên máy tính bằng Scratch. Khi chạy chương trình, chú mèo hiện ra và đặt câu hỏi: *"Tên của bạn là gì?"* cùng một ô nhập liệu trống ở phía dưới màn hình. 
Sau khi người dùng nhập tên của mình (ví dụ nhập chữ *"Minh"*) và gõ phím **Enter**, chú mèo lập tức nói lời chào cực kỳ chính xác: *"Xin chào bạn Minh!"*. 
*Em có biết làm thế nào mà chú mèo có thể ghi nhớ được cái tên em vừa nhập để đưa vào câu chào hỏi không?*

---

### 1. Sử dụng biến "trả lời" trong Scratch

Để ghi nhớ dữ liệu người dùng nhập vào từ bàn phím, các ngôn ngữ lập trình sử dụng một công cụ lưu trữ dữ liệu gọi là **Biến** (Variable).

Trong Scratch:
*   Khi em dùng lệnh `hỏi [Tên của bạn là gì?] và đợi` (nhóm lệnh *Cảm biến*), chương trình sẽ hiển thị câu hỏi và dừng lại chờ em nhập dữ liệu từ bàn phím.
*   Dữ liệu sau khi em nhập và nhấn **Enter** sẽ được tự động lưu trữ vào một biến có sẵn của Scratch gọi là biến `trả lời` (answer).
*   Biến `trả lời` nằm trong nhóm lệnh **Cảm biến** (Sensing). Để hiển thị trực tiếp giá trị của biến này lên góc sân khấu, em chỉ cần nhấp chuột chọn vào ô kiểm vuông nhỏ ngay trước tên biến `trả lời` (Hình 87).

#### **Kết hợp chuỗi văn bản với biến:**
Để ghép lời chào tĩnh với tên chứa trong biến động, em sử dụng khối lệnh ghép chữ `kết hợp [táo] [chuối]` trong nhóm lệnh **Các phép toán** (Operators).
- *Ví dụ:* Ghép chữ `Xin chào bạn` với biến `trả lời` bằng khối lệnh: `kết hợp [Xin chào bạn ] [trả lời]`. Khi chạy, nếu biến trả lời đang giữ chữ "Minh", mèo sẽ nói câu hoàn chỉnh "Xin chào bạn Minh".

#### 📌 Hộp ghi nhớ
*   Sử dụng lệnh `hỏi ... và đợi` để nhập thông tin từ bàn phím.
*   Thông tin nhập vào từ bàn phím được tự động lưu trữ trong biến có sẵn tên là `trả lời`.

---

### 2. Tạo và sử dụng biến tự đặt

Ngoài biến có sẵn như `trả lời`, em hoàn toàn có thể tự tạo thêm các biến nhớ khác theo nhu cầu lưu trữ thông tin của riêng mình (ví dụ tạo biến lưu điểm số, biến lưu tuổi tác, biến lưu chiều dài, chiều rộng,...).

#### **Các bước tạo biến mới trong Scratch:**
- **Bước 1:** Nhấp chọn nhóm lệnh **Các biến số** (Variables) ở thanh công cụ bên trái.
- **Bước 2:** Nháy chuột chọn nút **Tạo một biến** (Make a Variable) (Hình 89).
- **Bước 3:** Nhập tên biến mới muốn đặt vào ô trống (ví dụ đặt tên là `Tuổi` hoặc `Điểm`), chọn phạm vi sử dụng rồi nhấn **OK**.
- **Bước 4:** Chọn ô kiểm trước tên biến mới tạo để hiển thị giá trị của nó lên sân khấu nếu cần.

#### **Các lệnh thao tác với biến tự tạo:**
*   `đặt [Tên biến] thành [0]`: Dùng để gán giá trị khởi đầu cho biến bằng một số hoặc một chuỗi văn bản nào đó.
*   `thay đổi [Tên biến] một lượng [1]`: Dùng để tăng giá trị hiện tại của biến lên (nếu điền số dương) hoặc giảm giá trị đi (nếu điền số âm).

#### 📌 Hộp ghi nhớ
*   Em có thể tự tạo các biến mới để lưu trữ dữ liệu khi viết chương trình.
*   Các lệnh thao tác, quản lý biến nằm trong nhóm lệnh Các biến số.

#### ❓ Câu hỏi ôn tập
> *Sau khi máy tính thực hiện tuần tự hai lệnh dưới đây, giá trị cuối cùng của biến `a` sẽ bằng bao nhiêu?*
> 
> ```
> đặt [a] thành [4]
> thay đổi [a] một lượng [2]
> ```
> 
> A. 2  
> B. 4  
> C. 5  
> D. 6  
> 
> *Đáp án đúng:* **D. 6** (Vì ban đầu đặt a bằng 4, sau đó thay đổi thêm 2 đơn vị nghĩa là thực hiện phép cộng 4 + 2 = 6).

---

### 3. Thực hành sử dụng biến trong chương trình

#### **Nhiệm vụ 1: Lập trình chương trình hội thoại "ChaoHoi"**
Tạo chương trình chú mèo chào hỏi người dùng bằng biến có sẵn `trả lời` như mô tả ở phần Khởi động.

**Hướng dẫn:**
*   **Bước 1:** Khởi động Scratch.
*   **Bước 2:** Tạo lệnh hỏi nhập tên: Kéo lệnh `hỏi [Tên của bạn là gì?] và đợi` ghép vào dưới khối sự kiện cờ xanh.
*   **Bước 3:** Ghép câu chào: Kéo lệnh `nói [] trong [2] giây`. Sau đó kéo lệnh `kết hợp [táo] [chuối]` lắp vào ô nói. Chỉnh sửa chữ "táo" thành `"Xin chào bạn "` (lưu ý gõ một dấu cách ở cuối chữ bạn). Kéo biến `trả lời` lắp thế vào vị trí chữ "chuối".
*   **Bước 4:** Chạy thử chương trình, nhập tên của em và quan sát mèo chào.
*   **Bước 5:** Lưu tệp với tên là `ChaoHoi`.

---

#### **Nhiệm vụ 2: Lập trình hỏi tuổi và hiển thị tuổi bằng biến tự tạo**
Tạo chương trình sử dụng biến tự đặt tên là `Tuổi`. Chương trình sẽ hỏi tuổi người dùng, gán giá trị đó vào biến `Tuổi` và hiển thị kết quả ra màn hình.

**Hướng dẫn:**
*   **Bước 1:** Vào nhóm *Các biến số*, nháy chọn *Tạo một biến*, đặt tên biến là `Tuổi`.
*   **Bước 2:** Kéo lệnh hỏi: `hỏi [Bạn An bao nhiêu tuổi?] và đợi`.
*   **Bước 3:** Gán giá trị người dùng vừa nhập vào biến `Tuổi` bằng lệnh: `đặt [Tuổi] thành [trả lời]`.
*   **Bước 4:** Thông báo tuổi ra màn hình bằng lệnh: `nói (kết hợp [Tuổi của bạn An là ] [Tuổi])`.
*   **Bước 5:** Chạy thử chương trình, nhập số tuổi của em và quan sát.
*   **Bước 6:** Lưu tệp với tên là `HoiTuoi`.

---

### 📝 Luyện tập
> *Em hãy mở lại tệp chương trình `HoiTuoi` vừa lưu ở trên và bổ sung các lệnh để:*  
> - *a) Tự động tăng giá trị của biến Tuổi lên thêm 2 đơn vị.*  
> - *b) Nói thông báo tuổi mới sau khi tăng lên màn hình trong 3 giây.*  
> 
> *Gợi ý đáp án:*  
> Ta lắp thêm hai khối lệnh sau vào cuối chương trình cũ:
> `thay đổi [Tuổi] một lượng [2] -> nói (kết hợp [Hai năm nữa, tuổi của An sẽ là ] [Tuổi]) trong [3] giây`.

---

### 🌟 Vận dụng
> *Em hãy thiết kế một chương trình Scratch tương tự để hỏi người dùng xem học lớp nào, sau đó đưa ra câu chào hỏi phù hợp. Ví dụ: khi nhập câu trả lời là "5A", chú mèo sẽ hiển thị câu chào: "Xin chào bạn học sinh lớp 5A!".*

---
---

## BÀI 15: SỬ DỤNG BIỂU THỨC TRONG CHƯƠNG TRÌNH

### 🎯 Yêu cầu cần đạt
Sau bài học này, em sẽ:
- Sử dụng được biểu thức trong một số chương trình đơn giản.
- Chạy thử được chương trình.

---

### 🚀 Khởi động
Giả sử em tạo một biến tên là `Cạnh` để lưu độ dài cạnh của một hình vuông. Trong Scratch cũng có các phép toán cộng (+), trừ (-), nhân (*), chia (/) tương tự như trong môn Toán học. Theo em, biểu thức nào sau đây sẽ giúp chú mèo tính nhanh chu vi của hình vuông đó?
- A. `4 + Cạnh`
- B. `4 - Cạnh`
- C. `4 * Cạnh`
- D. `4 / Cạnh`

*Đáp án đúng:* **C. 4 * Cạnh** (Chu vi hình vuông bằng độ dài một cạnh nhân với 4).

---

### 1. Biểu thức trong Scratch

Nếu biểu thức trong môn Toán học gồm các số, chữ, phép tính và dấu ngoặc, thì biểu thức trong Scratch được cấu thành từ **các con số, các biến số và các khối phép toán**.

Trong nhóm lệnh **Các phép toán** (Operators), Scratch cung cấp các khối lệnh tạo biểu thức phong phú:

#### **a) Bốn phép toán số học cơ bản:**
*   Phép cộng (+): khối `[ ] + [ ]`
*   Phép trừ (-): khối `[ ] - [ ]`
*   Phép nhân (*): khối `[ ] * [ ]`
*   Phép chia (/): khối `[ ] / [ ]`

#### **b) Ba phép so sánh (tạo biểu thức điều kiện):**
*   Phép so sánh bé hơn (<): khối `[ ] < [ ]`
*   Phép so sánh bằng (=): khối `[ ] = [ ]`
*   Phép so sánh lớn hơn (>): khối `[ ] > [ ]`
*   *Ví dụ:* Nếu biến `a` có giá trị là 15, thì biểu thức so sánh `a > 30` sẽ trả về kết quả là **sai (false)**, còn biểu thức `a < 30` trả về kết quả là **đúng (true)**.

#### **c) Một số phép toán đặc biệt khác:**
*   `lấy ngẫu nhiên [1] đến [10]`: Trả về một số tự nhiên ngẫu nhiên bất kỳ nằm trong khoảng từ 1 đến 10.
*   `[ ] chia lấy dư [ ]`: Trả về số dư của phép chia. Ví dụ: `15 chia lấy dư 4` sẽ có kết quả là **3** (vì 15 chia cho 4 được 3 và dư 3).

#### 💡 Quy tắc thực hiện biểu thức lồng nhau (không có dấu ngoặc):
Do Scratch không sử dụng hệ thống dấu ngoặc tròn `()` như toán học thông thường để thiết lập thứ tự ưu tiên, chúng ta biểu diễn thứ tự ưu tiên bằng cách **lồng các khối phép toán vào nhau**. 
Khi chương trình chạy, máy tính sẽ tự động tính toán các phép toán nằm ở **khối lồng phía trong trước, rồi mới tính đến các khối bao ngoài sau**.
- *Ví dụ:* Để biểu diễn biểu thức toán học `(7 - 5) * 8`, em kéo khối phép trừ `7 - 5` đặt lồng vào ô trống thứ nhất của khối phép nhân `* 8` (như Hình 97). Khi chạy, máy tính tính phép trừ trước `7 - 5 = 2`, sau đó thực hiện phép nhân `2 * 8 = 16`.

#### 📌 Hộp ghi nhớ
*   Scratch cung cấp các khối phép toán đa dạng giúp em dễ dàng tạo ra các biểu thức số học và biểu thức điều kiện logic.
*   Các khối lệnh phép toán nằm trong nhóm lệnh Các phép toán.

---

### 2. Thực hành lập trình sử dụng biểu thức

#### **Nhiệm vụ: Lập trình tính chu vi hình chữ nhật**
Em hãy tạo chương trình tính chu vi hình chữ nhật với độ dài hai cạnh `a` và `b` được nhập trực tiếp từ bàn phím.

**Hướng dẫn chi tiết:**
*   **Bước 1: Tạo biến.** Nhấp chọn nhóm *Các biến số*, tạo hai biến mới đặt tên lần lượt là `a` và `b` để lưu chiều dài và chiều rộng của hình chữ nhật.
*   **Bước 2: Viết khối lệnh nhập liệu từ bàn phím.**
    - Ghép sự kiện `Khi bấm vào 🚩`.
    - Lắp lệnh hỏi: `hỏi [Nhập giá trị cho biến a] và đợi`.
    - Gán giá trị: `đặt [a] thành [trả lời]`.
    - Lắp lệnh hỏi tiếp: `hỏi [Nhập giá trị cho biến b] và đợi`.
    - Gán giá trị tiếp: `đặt [b] thành [trả lời]`.
*   **Bước 3: Lắp ráp biểu thức chu vi hình chữ nhật `(a + b) * 2`.**
    - Kéo khối phép cộng `[ ] + [ ]` ra màn hình, kéo biến `a` thả vào ô bên trái, biến `b` thả vào ô bên phải để được biểu thức `a + b`.
    - Kéo khối phép nhân `[ ] * [ ]` ra màn hình, nhập số `2` vào ô bên phải.
    - Kéo cả khối phép cộng `a + b` vừa lắp đặt lồng vào ô trống bên trái của khối phép nhân. Ta được khối biểu thức lồng nhau hoàn chỉnh tính chu vi: `(a + b) * 2`.
*   **Bước 4: Tạo câu thông báo kết quả.**
    - Kéo khối ghép chữ `kết hợp [táo] [chuối]`. Sửa chữ "táo" thành `"Chu vi hình chữ nhật là: "`. Kéo cả khối biểu thức tính chu vi ở Bước 3 thả vào vị trí chữ "chuối".
    - Lồng khối ghép chữ này vào trong lệnh nói: `nói (kết hợp [Chu vi hình chữ nhật là: ] [(a + b) * 2]) trong [5] giây`.
*   **Bước 5: Chạy thử.** Nhấn nút cờ xanh, nhập thử chiều dài `a = 8`, chiều rộng `b = 5` và xem chú mèo hiển thị thông báo chu vi bằng 26.
*   **Bước 6: Lưu tệp.** Lưu tệp chương trình với tên là `HinhChuNhat`.

---

### 📝 Luyện tập
> **1.** *Em hãy viết biểu thức toán học tương ứng của các biểu thức biểu diễn trong Scratch dưới đây:*
> - a) Khối lệnh `[a] * [b]`  
> - b) Khối lệnh `([a] * [h]) / [2]`  
> - c) Khối lệnh `([r] * [r]) * [3.14]`  
> - d) Khối lệnh `(([a] + [b]) * [h]) / [2]`  
> 
> *Đáp án:*  
> - a) $a \times b$  
> - b) $\frac{a \times h}{2}$ (Công thức tính diện tích hình tam giác)  
> - c) $r \times r \times 3.14$ (Công thức tính diện tích hình tròn)  
> - d) $\frac{(a + b) \times h}{2}$ (Công thức tính diện tích hình thang)  
> 
> **2.** *Giả sử giá trị hiện tại của hai biến là a = 3 và b = 4. Khi chương trình thực hiện lệnh:*  
> `nói (kết hợp [Diện tích hình chữ nhật là ] [a * b]) trong [5] giây`  
> *thì câu thông báo nào dưới đây sẽ hiển thị trên màn hình?*  
> A. Diện tích hình chữ nhật là 3.  
> B. Diện tích hình chữ nhật là 4.  
> C. Diện tích hình chữ nhật là 7.  
> D. Diện tích hình chữ nhật là 12.  
> 
> *Đáp án đúng:* **D** (Vì giá trị biểu thức $a \times b = 3 \times 4 = 12$).

---

### 🌟 Vận dụng
> *Em hãy xây dựng một chương trình Scratch hoàn chỉnh giúp người dùng tính toán diện tích của một hình vuông với độ dài cạnh được nhập trực tiếp từ bàn phím.*  
> *(Gợi ý: Công thức tính diện tích hình vuông là Cạnh * Cạnh).*

---
---

## BÀI 16: TỪ KỊCH BẢN ĐẾN CHƯƠNG TRÌNH

### 🎯 Yêu cầu cần đạt
Sau bài học này, em sẽ:
- Hợp tác được theo nhóm để viết kịch bản và tạo chương trình thể hiện kịch bản.
- Chạy thử và sửa lỗi được chương trình.

---

### 🚀 Khởi động
Nhóm ba bạn An, Minh và Khoa cùng hợp tác thảo luận để thiết kế một trò chơi máy tính đơn giản cực kỳ thú vị mang tên **"Mèo bắt bóng"**. Ý tưởng thiết kế trò chơi như sau:
- Trò chơi gồm một con mèo và một quả bóng màu sắc sặc sỡ trên sân khấu.
- Trái bóng liên tục tự động di chuyển lướt đi khắp nơi trên sân khấu.
- Chú mèo sẽ liên tục di chuyển bám sát theo hướng con trỏ chuột của người chơi.
- Người chơi điều khiển chuột khéo léo để chú mèo chạm được vào bóng. Mỗi lần mèo chạm trúng bóng thì điểm số của người chơi được cộng thêm 1 điểm.

Để hiện thực hóa trò chơi này một cách dễ dàng và không bị nhầm lẫn, các bạn cần bắt đầu từ việc xây dựng kịch bản trò chơi. Theo em, kịch bản trò chơi cần thể hiện những nội dung gì?

---

### 1. Viết kịch bản chương trình

Trước khi bắt tay vào lắp ghép các câu lệnh lập trình phức tạp, việc mô tả chi tiết, phân chia ý tưởng thành các phần việc nhỏ một cách rõ ràng và khoa học được gọi là **viết kịch bản**. 

Một kịch bản chương trình tốt cần làm rõ và trả lời được ba câu hỏi cốt lõi sau:
1. **Chương trình gồm những nhân vật nào?**
2. **Chương trình diễn ra trong bối cảnh (sân khấu) nào?**
3. **Hành động cụ thể của từng nhân vật là gì?**

#### **Kịch bản chi tiết trò chơi "Mèo bắt bóng":**
- **Nhân vật & Sân khấu:** Gồm 2 nhân vật là Chú mèo (Cat) và Trái bóng (Beachball). Sân khấu nền trắng mặc định hoặc sân chơi thể thao tùy chọn.
- **Hành động của trái bóng:** Trái bóng liên tục di chuyển lướt từ vị trí này sang vị trí khác một cách ngẫu nhiên trên sân khấu.
- **Hành động của chú mèo:** Chú mèo liên tục di chuyển đi theo con trỏ chuột của người chơi. Đồng thời, liên tục kiểm tra nếu chạm vào trái bóng thì điểm số của người chơi tăng lên 1 điểm.

#### 📌 Hộp ghi nhớ
*   Kịch bản giúp em xác định cụ thể các công việc mà chương trình cần thực hiện. 
*   Từ kịch bản chi tiết, em sẽ dễ dàng tạo ra chương trình hoàn chỉnh thể hiện chính xác ý tưởng ban đầu.

#### ❓ Câu hỏi ôn tập
> *Em hãy ghép hành động của nhân vật ở cột bên trái với cấu trúc lập trình phù hợp ở cột bên phải:*
> 
> | Hành động của nhân vật | Cấu trúc lập trình phù hợp |
> | :--- | :--- |
> | **1)** Trái bóng liên tục di chuyển khắp sân khấu. | **a)** Cấu trúc lặp |
> | **2)** Chú mèo di chuyển liên tục theo con trỏ chuột. | **b)** Cấu trúc rẽ nhánh |
> | **3)** Nếu chú mèo chạm vào bóng thì tăng điểm lên 1. | |
> 
> *Đáp án đúng:* **1 - a**, **2 - a**, **3 - b**.

---

### 2. Thực hành lập trình và chạy thử trò chơi "Mèo bắt bóng"

#### **Nhiệm vụ 1: Lập trình trò chơi theo kịch bản**
Hãy mở Scratch và tiến hành lắp ghép chương trình thể hiện đúng kịch bản trò chơi "Mèo bắt bóng".

**Hướng dẫn:**
*   **Bước 1: Chuẩn bị nhân vật và biến số.**
    - Giữ lại nhân vật mèo mặc định. Nháy chọn thêm nhân vật quả bóng **Beachball** từ thư viện.
    - Vào nhóm *Các biến số*, nháy chọn *Tạo một biến*, đặt tên biến là `Điểm` để lưu điểm số người chơi.
*   **Bước 2: Viết chương trình cho nhân vật Trái bóng (Beachball).**
    - Chọn nhân vật Beachball ở khung quản lý nhân vật. Lắp ghép khối lệnh:
      ```
      Khi bấm vào 🚩
      liên tục
          lướt trong [1] giây tới [vị trí ngẫu nhiên ▾]
      ```
*   **Bước 3: Viết chương trình cho nhân vật Chú mèo (Cat).**
      - Chọn nhân vật Cat ở khung quản lý nhân vật. Lắp ghép khối lệnh:
      ```
      Khi bấm vào 🚩
      đặt [Điểm] thành [0]
      liên tục
          đi tới [con trỏ chuột ▾]
          nếu <đang chạm [Beachball ▾]?> thì
              thay đổi [Điểm] một lượng [1]
      ```

---

#### **Nhiệm vụ 2: Chạy thử và sửa lỗi chương trình**
Sau khi lắp ghép xong, việc chạy thử chương trình nhiều lần là bước bắt buộc để rà soát lỗi lập trình.

**Hướng dẫn:**
*   **Bước 1:** Nháy vào biểu tượng cờ xanh để bắt đầu chơi thử. Rê chuột điều khiển mèo đuổi theo trái bóng Beachball và kiểm tra xem biến `Điểm` có tự động tăng lên khi mèo chạm bóng hay không.
*   **Bước 2:** Nháy chọn nút tròn đỏ để dừng chương trình.
*   **Bước 3:** **Rà soát lỗi (Bug):** Quan sát kỹ xem có hiện tượng điểm số bị tăng lên quá nhanh hoặc không reset về 0 khi chơi lại hay không để chỉnh sửa khối lệnh cho phù hợp.
*   **Bước 4:** Chọn *Tệp -> Lưu về máy tính* để lưu trò chơi hoàn chỉnh với tên tệp là `MeoBatBong`.

#### 📌 Hộp ghi nhớ
*   Sau khi tạo chương trình, em cần chạy thử, quan sát kết quả hoạt động và tiến hành chỉnh sửa để chương trình thực hiện đúng và mượt mà theo yêu cầu kịch bản.

---

### 📝 Luyện tập
> **1.** *Kịch bản chương trình được viết ra nhằm mục đích trả lời cho những câu hỏi nào sau đây?*  
> A. Chương trình gồm những nhân vật nào?  
> B. Sân khấu bối cảnh diễn ra ở đâu?  
> C. Hành động cụ thể của từng nhân vật là gì?  
> D. Làm thế nào để bấm nút chạy thử chương trình?  
> 
> *Đáp án đúng:* **A, B, C**.
> 
> **2.** *Em hãy giải thích ngắn gọn tại sao việc chạy thử chương trình lại cực kỳ quan trọng đối với người lập trình?*  
> 
> *Trả lời:* Chạy thử chương trình giúp người lập trình kịp thời phát hiện ra các lỗi logic (nhân vật hoạt động sai kịch bản), lỗi cú pháp (lệnh không chạy) hoặc các điểm chưa mượt mà để kịp thời sửa chữa, nâng cấp chương trình hoàn thiện hơn trước khi công bố sản phẩm.

---

### 🌟 Vận dụng
> *Bạn Minh trong lúc thực hành lập trình trò chơi "Mèo bắt bóng" đã vô tình quên lắp khối lệnh `đặt [Điểm] thành [0]` ở đầu chương trình cho chú mèo (như Hình 103). Em hãy chạy thử chương trình khi thiếu lệnh đó và giải thích xem sự cố gì sẽ xảy ra khi người chơi bấm nút cờ xanh để bắt đầu một lượt chơi mới.*
> 
> *Trả lời:*
> - Sự cố xảy ra: Khi bắt đầu một lượt chơi mới (nhấn nút cờ xanh), điểm số cũ của người chơi ở lượt chơi trước đó sẽ **không được xóa đi (không reset về 0)** mà tiếp tục được tích lũy cộng dồn lên tiếp.
> - Giải thích: Do thiếu lệnh khởi tạo ban đầu `đặt [Điểm] thành [0]`, biến `Điểm` sẽ luôn giữ nguyên giá trị cuối cùng của phiên chơi trước. Điều này làm cho trò chơi hoạt động không công bằng và sai quy tắc tính điểm.
