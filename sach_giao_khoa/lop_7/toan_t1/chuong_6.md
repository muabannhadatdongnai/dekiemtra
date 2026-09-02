# HOẠT ĐỘNG THỰC HÀNH TRẢI NGHIỆM

Phần này giới thiệu các hoạt động thực hành, trải nghiệm thú vị trong chương trình Toán 7 Tập 1, giúp học sinh áp dụng kiến thức hình học phẳng và thống kê vào thực tiễn thông qua các phần mềm công nghệ hiện đại như GeoGebra và Microsoft Excel.

---

## CHỦ ĐỀ 1: VẼ HÌNH ĐƠN GIẢN VỚI PHẦN MỀM GEOGEBRA

**Mục tiêu:**
*   Biết sử dụng phần mềm GeoGebra để vẽ các hình học cơ bản: hai đường thẳng song song, tia phân giác của một góc, đường trung trực của một đoạn thẳng.
*   Biết vẽ tam giác khi biết một số yếu tố về cạnh và góc.

---

### 1. Vẽ hai đường thẳng song song
*   **Bước 1:** Vẽ đường thẳng $f$ đi qua hai điểm $A, B$:
    *   Chọn công cụ `Đường thẳng qua 2 điểm` (biểu tượng đường thẳng đi qua hai điểm).
    *   Nhấp chuột chọn điểm $A$ rồi tiếp tục nhấp chuột chọn điểm $B$.
*   **Bước 2:** Vẽ điểm $C$ nằm ngoài đường thẳng $f$:
    *   Chọn công cụ `Điểm mới` (biểu tượng điểm $A$).
    *   Nhấp chuột vào một vị trí trống bất kì trên vùng làm việc để tạo điểm $C$.
*   **Bước 3:** Vẽ đường thẳng $g$ đi qua điểm $C$ và song song với đường thẳng $f$:
    *   Chọn công cụ `Đường song song` (biểu tượng hai đường thẳng song song).
    *   Nháy chuột vào điểm $C$ rồi nháy chuột vào đường thẳng $f$.
    *   Kết quả ta thu được đường thẳng $g$ song song với $f$.

**💬 Cùng suy luận:** Sau khi thực hiện Bước 3, ta thấy có duy nhất một đường thẳng $g$ song song với $f$ được hiện ra qua điểm $C$. Điều này gợi cho ta liên tưởng đến **Tiên đề Euclid về đường thẳng song song**: *"Qua một điểm ở ngoài một đường thẳng, chỉ có duy nhất một đường thẳng song song với đường thẳng đó."*

---

### 2. Vẽ tia phân giác của một góc
Để vẽ tia phân giác của góc $\widehat{BAC}$, ta thực hiện như sau:
*   **Bước 1:** Vẽ tia $AB$:
    *   Chọn công cụ `Tia đi qua 2 điểm` (biểu tượng tia từ một điểm qua điểm khác).
    *   Nháy chuột chọn điểm $A$, sau đó chọn điểm $B$.
*   **Bước 2:** Vẽ góc $\widehat{BAC}$ bằng cách vẽ thêm tia $AC$:
    *   Vẫn chọn công cụ `Tia đi qua 2 điểm`.
    *   Nháy chuột chọn điểm $A$, sau đó nháy chuột chọn một vị trí khác để tạo điểm $C$.
*   **Bước 3:** Vẽ đường phân giác của góc $\widehat{BAC}$:
    *   Chọn công cụ `Đường phân giác` (biểu tượng tia phân giác chia đôi góc).
    *   Nháy chuột lần lượt vào ba điểm theo thứ tự: $B \rightarrow A \rightarrow C$.
    *   Đường thẳng chia đôi góc xuất hiện. Phần đường thẳng nằm phía trong góc $\widehat{BAC}$ chính là **tia phân giác** của góc $\widehat{BAC}$.

---

### 3. Vẽ đường trung trực của một đoạn thẳng
Ta có thể vẽ đường trung trực của đoạn thẳng $AB$ bằng hai phương pháp trên GeoGebra:

#### Phương pháp 1: Sử dụng công cụ trực tiếp
*   **Bước 1:** Vẽ đoạn thẳng $AB$:
    *   Chọn công cụ `Đoạn thẳng` (biểu tượng đoạn thẳng nối hai điểm).
    *   Chọn điểm $A$, rồi chọn điểm $B$.
*   **Bước 2:** Vẽ đường trung trực:
    *   Chọn công cụ `Đường trung trực` (biểu tượng đường thẳng vuông góc tại trung điểm).
    *   Nháy chuột vào đoạn thẳng $AB$. Ta thu được đường thẳng $g$ là đường trung trực của đoạn thẳng $AB$.

#### Phương pháp 2: Vẽ theo định nghĩa (Dùng lập luận hình học)
*   **Bước 1:** Vẽ đoạn thẳng $AB$.
*   **Bước 2:** Xác định trung điểm $C$ của đoạn thẳng $AB$:
    *   Chọn công cụ `Trung điểm hoặc tâm`.
    *   Nháy chuột chọn đoạn thẳng $AB$. Điểm $C$ tự động xuất hiện chính giữa đoạn thẳng.
*   **Bước 3:** Vẽ đường thẳng đi qua $C$ và vuông góc với $AB$:
    *   Chọn công cụ `Đường vuông góc` (biểu tượng đường thẳng vuông góc).
    *   Nháy chuột chọn điểm $C$ rồi nháy chuột chọn đoạn thẳng $AB$. Đường thẳng $g$ xuất hiện chính là đường trung trực của đoạn thẳng $AB$.

---

### 4. Vẽ tam giác biết độ dài ba cạnh
**Bài toán:** Vẽ tam giác $ABC$ biết $AB = 4\text{ cm}$, $BC = 5\text{ cm}$, $CA = 6\text{ cm}$.
*   **Bước 1:** Vẽ đoạn thẳng $AB = 4\text{ cm}$:
    *   Chọn công cụ `Đường tròn với tâm và bán kính`.
    *   Chọn một điểm $A$ bất kì làm tâm, nhập bán kính bằng $4$.
    *   Chọn công cụ `Điểm mới` rồi nhấp chuột vào một điểm trên đường tròn vừa vẽ, đặt tên điểm đó là $B$. Đoạn thẳng nối $A$ và $B$ sẽ có độ dài đúng bằng $4\text{ cm}$.
*   **Bước 2:** Tạo điều kiện cho cạnh $BC = 5\text{ cm}$:
    *   Chọn công cụ `Đường tròn với tâm và bán kính`.
    *   Nháy chuột vào điểm $B$ (tâm), nhập bán kính bằng $5$.
*   **Bước 3:** Tạo điều kiện cho cạnh $CA = 6\text{ cm}$:
    *   Vẫn dùng công cụ `Đường tròn với tâm và bán kính`.
    *   Nháy chuột vào điểm $A$ (tâm), nhập bán kính bằng $6$.
*   **Bước 4:** Xác định giao điểm $C$:
    *   Chọn công cụ `Giao điểm của 2 đối tượng` (biểu tượng hai đường cắt nhau).
    *   Lần lượt nhấp chuột vào đường tròn tâm $B$ (bán kính $5$) and đường tròn tâm $A$ (bán kính $6$). Giao điểm được đánh dấu và đặt tên là $C$.
*   **Bước 5:** Vẽ tam giác:
    *   Chọn công cụ `Đoạn thẳng` (hoặc `Đa giác`) nối các điểm $A, B, C$ với nhau.
    *   Nhấp chuột phải vào các đường tròn phụ trợ và chọn ẩn chúng đi. Ta thu được tam giác $ABC$ cần vẽ.

**💬 Cùng suy luận:** Nếu cho trước đoạn thẳng $AB = 4\text{ cm}$ cố định, ta có thể vẽ được **hai tam giác** $ABC$ thoả mãn điều kiện (đối xứng nhau qua đường thẳng $AB$ tương ứng với hai giao điểm của hai đường tròn tâm $A$ và tâm $B$).

---

### 5. Vẽ tam giác biết độ dài hai cạnh và góc xen giữa
**Bài toán:** Vẽ tam giác $ABC$ có $AB = 6\text{ cm}$, $AC = 5\text{ cm}$, và $\widehat{BAC} = 60^\circ$.
*   **Bước 1:** Vẽ đoạn thẳng $AB = 6\text{ cm}$ tương tự như cách vẽ đoạn thẳng có độ dài cho trước ở mục 4.
*   **Bước 2:** Vẽ góc $\widehat{BAB'} = 60^\circ$:
    *   Chọn công cụ `Góc với độ lớn cho trước` (biểu tượng góc có chữ $\alpha$).
    *   Nháy chuột lần lượt chọn điểm $B$, sau đó chọn điểm $A$ (đỉnh góc). Nhập số đo góc là $60^\circ$ và chọn hướng quay là **Ngược chiều kim đồng hồ**. Điểm $B'$ xuất hiện để định hướng góc.
*   **Bước 3:** Xác định điểm $C$ cách $A$ một khoảng bằng $5\text{ cm}$ trên tia $AB'$:
    *   Dùng công cụ `Đường tròn với tâm và bán kính` có tâm tại $A$, nhập bán kính bằng $5$.
    *   Dùng công cụ `Giao điểm của 2 đối tượng` để xác định giao điểm của đường thẳng đi qua $A, B'$ với đường tròn vừa vẽ. Giao điểm đó chính là điểm $C$.
*   **Bước 4:** Chọn công cụ `Đoạn thẳng` nối $B$ với $C$ và ẩn các nét vẽ thừa. Ta thu được tam giác $ABC$ hoàn hảo.

---

### BÀI TẬP THỰC HÀNH TỰ LUYỆN
#### Bài 1 (Trang 114)
**Đề bài:** Trình bày các bước dùng phần mềm GeoGebra để vẽ tam giác $ABC$ có: $AB = 6\text{ cm}, \widehat{BAC} = 60^\circ, \widehat{ACB} = 70^\circ$.
**Lời giải:**
1.  Vẽ đoạn thẳng $AB = 6\text{ cm}$ bằng cách vẽ đường tròn tâm $A$ bán kính $6$, lấy điểm $B$ trên đường tròn.
2.  Vẽ góc $\widehat{BAB'} = 60^\circ$ bằng công cụ `Góc với độ lớn cho trước` (chọn điểm $B$, đỉnh $A$, nhập $60^\circ$, ngược chiều kim đồng hồ). Vẽ tia $Ax$ đi qua $B'$.
3.  Tính góc $\widehat{ABC}$ còn lại: Tổng ba góc trong tam giác bằng $180^\circ$, suy ra $\widehat{ABC} = 180^\circ - (60^\circ + 70^\circ) = 50^\circ$.
4.  Vẽ góc $\widehat{ABA'} = 50^\circ$ (chọn điểm $A$, đỉnh $B$, nhập $50^\circ$, chọn **Chiều kim đồng hồ**). Vẽ tia $By$ đi qua $A'$.
5.  Xác định giao điểm $C$ của hai tia $Ax$ và $By$ bằng công cụ `Giao điểm của 2 đối tượng`. Ta được tam giác $ABC$ thoả mãn đề bài.

#### Bài 2 (Trang 114)
**Đề bài:** 
a) Vẽ tam giác $ABC$ vuông tại $A$, $AB = 4\text{ cm}$, $AC = 3\text{ cm}$.
b) Dùng phần mềm để đo độ dài cạnh $BC$.
**Lời giải:**
1.  Vẽ đoạn thẳng $AB = 4\text{ cm}$.
2.  Vẽ đường thẳng vuông góc với $AB$ tại $A$ bằng công cụ `Đường vuông góc` (nhấp chọn điểm $A$ và đoạn $AB$).
3.  Vẽ đường tròn tâm $A$ bán kính $3$. Giao điểm của đường tròn này với đường vuông góc vừa vẽ ở bước 2 chính là điểm $C$ (sao cho $AC = 3\text{ cm}$).
4.  Nối $B$ với $C$ để hoàn thành tam giác vuông $ABC$.
5.  **Kết quả đo độ dài cạnh $BC$:** Sử dụng công cụ `Khoảng cách hoặc độ dài` nhấp chọn hai điểm $B$ và $C$. Kết quả hiển thị là **$5\text{ cm}$** (Phù hợp với định lí Pythagore: $BC = \sqrt{4^2 + 3^2} = \sqrt{25} = 5\text{ cm}$).

---

## CHỦ ĐỀ 2: DÂN SỐ VÀ CƠ CẤU DÂN SỐ VIỆT NAM

**Mục tiêu:**
*   Tìm hiểu số liệu dân số thực tế của Việt Nam qua các năm.
*   Biết lập bảng thống kê và vẽ biểu đồ đoạn thẳng, biểu đồ quạt tròn để mô tả cơ cấu dân số.

---

### 1. Thu thập số liệu
Thông qua việc khảo sát tại Website của **Cục Thống kê Việt Nam** (https://www.gso.gov.vn) hoặc trang thống kê thế giới **Worldometers** (https://www.worldometers.info), dữ liệu cấu trúc dân số Việt Nam năm 2020 được ghi nhận như sau:
*   **Tổng dân số năm 2020:** **$97,58$ triệu người**.
*   **Cơ cấu theo giới tính:**
    *   Nam: $49,8\%$
    *   Nữ: $50,2\%$
*   **Cơ cấu theo nơi sinh sống:**
    *   Thành thị: $36,8\%$
    *   Nông thôn: $63,2\%$

Từ các số liệu phần trăm trên, ta có bảng thống kê chi tiết số dân thực tế (đơn vị: triệu người) làm tròn đến hàng phần trăm:

| Tiêu chí phân loại | Tỉ lệ (%) | Số dân thực tế (triệu người) | Công thức tính toán |
| :--- | :---: | :---: | :--- |
| **Nam** | $49,8\%$ | **$48,59$** | $97,58 \times 49,8\% \approx 48,5948$ |
| **Nữ** | $50,2\%$ | **$48,99$** | $97,58 \times 50,2\% \approx 48,9852$ |
| **Thành thị** | $36,8\%$ | **$35,91$** | $97,58 \times 36,8\% \approx 35,9094$ |
| **Nông thôn** | $63,2\%$ | **$61,67$** | $97,58 \times 63,2\% \approx 61,6706$ |

---

### 2. Hướng dẫn thực hành vẽ biểu đồ bằng Excel

#### A. Vẽ biểu đồ hình quạt tròn bằng Excel
Áp dụng vẽ biểu đồ thị phần các hãng điện thoại tại Việt Nam (tháng 10/2020):

*   **Bảng số liệu:**
    *   Samsung: $31\%$
    *   Oppo: $18,6\%$
    *   Vsmart: $15,2\%$
    *   Apple: $10,6\%$
    *   Vivo: $9,6\%$
    *   Realme: $7,2\%$
    *   Khác: $7,8\%$

*   **Quy trình thực hiện:**
    *   **Bước 1: Nhập dữ liệu:** Mở Excel, nhập hai cột: Cột A chứa tên các hãng, cột B chứa tỉ lệ phần trăm tương ứng.
    *   **Bước 2: Vẽ biểu đồ:** Bôi đen toàn bộ vùng dữ liệu vừa nhập $\rightarrow$ Vào thẻ `Insert` trên thanh công cụ $\rightarrow$ Chọn nhóm `Pie` $\rightarrow$ Nhấp chọn `2-D Pie` (Biểu đồ quạt tròn phẳng). Một biểu đồ sơ khai sẽ lập tức xuất hiện.
    *   **Bước 3: Trang trí và hiển thị số liệu:**
        *   Nhấp chọn biểu đồ, vào thẻ `Design` hoặc `Layout`.
        *   Chọn `Chart Title` $\rightarrow$ `Above Chart` để đặt tiêu đề: *\"Thị phần các hãng điện thoại tại Việt Nam (10-2020)\"*.
        *   Chọn `Data Labels` $\rightarrow$ `Best Fit` để các con số tỉ lệ phần trăm hiển thị trực quan lên từng hình quạt màu.

---

#### B. Vẽ biểu đồ đoạn thẳng bằng Excel
Áp dụng vẽ biểu đồ chỉ số giá tiêu dùng (CPI) của Việt Nam từ tháng 3/2020 đến tháng 3/2021:

*   **Bảng số liệu:**
    *   Tháng 3/2020: $4,87\%$
    *   Tháng 5/2020: $2,40\%$
    *   Tháng 7/2020: $3,39\%$
    *   Tháng 9/2020: $2,98\%$
    *   Tháng 11/2020: $1,48\%$
    *   Tháng 1/2021: $-0,97\%$
    *   Tháng 3/2021: $1,16\%$

*   **Quy trình thực hiện:**
    *   **Bước 1: Nhập dữ liệu:** Nhập cột mốc thời gian và cột chỉ số phần trăm tương ứng vào bảng tính Excel.
    *   **Bước 2: Vẽ biểu đồ:** Bôi đen vùng số liệu $\rightarrow$ Chọn thẻ `Insert` trên thanh công cụ $\rightarrow$ Chọn nhóm biểu đồ dạng đường `Line` $\rightarrow$ Nhấp chọn `2-D Line` (Đoạn thẳng).
    *   **Bước 3: Thiết lập tiêu đề và nhãn trục:**
        *   Chọn `Chart Title` để sửa tên biểu đồ thành: *\"Chỉ số giá tiêu dùng của Việt Nam (3/2020 - 3/2021)\"*.
        *   Vào `Axis Titles` (Tiêu đề trục) $\rightarrow$ `Primary Horizontal Axis Title` đặt tên cho trục ngang là *\"Thời điểm\"* và `Primary Vertical Axis Title` đặt tên cho trục đứng là *\"Chỉ số (%)\"*.
        *   Chọn `Data Labels` để hiển thị trực tiếp các giá trị số liệu trên các điểm nút của đoạn thẳng.
