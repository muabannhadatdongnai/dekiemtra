# Hoạt động Thực hành Trải nghiệm - Toán 8 Tập 1

Tài liệu tổng hợp toàn bộ các chủ đề, hướng dẫn thực hành và dự án thực tế trong phần **Hoạt động thực hành trải nghiệm** của sách giáo khoa Toán 8 (Tập 1), giúp học sinh vận dụng kiến thức đại số, hình học và thống kê vào đời sống thực tiễn và công nghệ.

---

## Chủ đề 1: Công thức lãi kép và Ứng dụng Tài chính

### 1. Lý thuyết và Công thức cốt lõi
*   **Khái niệm**: Gửi tiết kiệm là hình thức khách hàng gửi một khoản tiền dành dụm vào ngân hàng nhằm tích lũy và nhận một khoản lợi nhuận định kỳ. Hình thức phổ biến nhất là **gửi tiết kiệm có kỳ hạn**.
*   **Công thức lãi kép cơ bản** (kỳ hạn năm, lãi suất $r$ không đổi mỗi năm):
    Sau $N$ năm, tổng số tiền cả vốn lẫn lãi $A$ nhận được từ số tiền gốc ban đầu $P$ là:
    $$A = P(1 + r)^N$$
*   **Công thức lãi kép tổng quát** (khi lãi suất năm $r$ được tính lãi $n$ lần trong một năm):
    Sau $N$ năm, tổng số tiền thu được $A$ là:
    $$A = P\left(1 + \frac{r}{n}\right)^{nN}$$

### 2. Dự án thực hành thực tế
*   **Dự án 1 (Khảo sát & Lập phương án tối ưu)**: Học sinh đóng vai trò nhà tư vấn tài chính để giúp đỡ gia đình lập kế hoạch gửi tiết kiệm 300 triệu đồng kỳ hạn 12 tháng.
    *   *Nhiệm vụ*: Thu thập bảng lãi suất của ít nhất 3 ngân hàng thương mại tại thời điểm hiện tại.
    *   *Tính toán*: Áp dụng công thức lãi kép để tính số tiền lãi thu được ở từng phương án sau thời gian gửi.
    *   *Kết luận*: Đưa ra tư vấn hợp lý nhất về việc chọn ngân hàng dựa trên uy tín và hiệu quả sinh lời.
*   **Dự án 2 (Kế hoạch tích lũy dài hạn)**: Phân tích bài toán tích lũy có mục tiêu (ví dụ: mua sắm thiết bị học tập, chuẩn bị học phí) với số vốn ban đầu 250 triệu đồng trong thời gian 2 năm để chọn kỳ hạn tối ưu nhất (ví dụ kỳ hạn 1 tháng, 3 tháng hay 6 tháng cộng dồn).

---

## Chủ đề 2: Thực hiện tính toán trên Đa thức với GeoGebra

### 1. Mục tiêu và Chuẩn bị
*   **Mục tiêu**: Sử dụng phần mềm hình học trực quan GeoGebra để thực hiện các phép biến đổi đại số phức tạp, rút gọn biểu thức, phân tích đa thức thành nhân tử và phép chia đa thức một cách nhanh chóng và chính xác.
*   **Cách kích hoạt**: Mở GeoGebra -> Chọn biểu tượng **Menu** -> **View (Hiển thị)** -> Chọn **CAS (Complex Adaptive System)** để kích hoạt cửa sổ tính toán đại số.

### 2. Các cú pháp và câu lệnh cốt lõi
Học sinh cần nắm vững bảng tra cứu câu lệnh (hỗ trợ cả phiên bản tiếng Anh và giao diện tiếng Việt):

| Nhiệm vụ toán học | Cú pháp Tiếng Anh | Cú pháp Tiếng Việt | Ví dụ nhập lệnh |
| :--- | :--- | :--- | :--- |
| **Cộng, trừ, nhân đa thức** | Nhập biểu thức trực tiếp | Nhập biểu thức trực tiếp | `(3x^2y + 5xy - 2)(4x + 3y)` |
| **Khai triển biểu thức** | `Expand(<Biểu thức>)` | `KhaiTriển(<Biểu thức>)` | `Expand((5x - y)^2)` |
| **Phân tích thành nhân tử** | `Factor(<Đa thức>)` | `PhânTíchRaThừaSố(<Đa thức>)` | `Factor(x^4 - 4x^3 - 7x^2 + 8x + 10)` |
| **Phân tích chứa số vô tỉ** | `IFactor(<Đa thức>)` | `ThừaSốngườiSốVôTỷ(<Đa thức>)` | `IFactor(x^2 - 5)` |
| **Tìm phần dư phép chia** | `Mod(<Đa thức bị chia>, <Đa thức chia>)` | `SoDư(<Đa thức bị chia>, <Đa thức chia>)` | `Mod(6x^2 - 3x + 5, 2x - 1)` |
| **Tìm cả thương và số dư** | `Division(<Đa thức bị chia>, <Đa thức chia>)` | `PhépChia(<Đa thức bị chia>, <Đa thức chia>)` | `Division(3x^4y - 9x^3y^2, 3x^2y)` |

---

## Chủ đề 3: Vẽ hình đơn giản với phần mềm GeoGebra

### 1. Vẽ hình chữ nhật $ABCE$ ($AB = 4\text{ cm}$, $BC = 3\text{ cm}$)
*   **Bước 1**: Vẽ đoạn thẳng $AB$ có độ dài cố định bằng $4\text{ cm}$. Sử dụng công cụ `Đường tròn khi biết tâm và bán kính` chọn tâm $A$, nhập bán kính $4$ để xác định điểm $B$.
*   **Bước 2**: Sử dụng công cụ `Đường vuông góc` vẽ đường vuông góc với $AB$ tại $B$ và $A$.
*   **Bước 3**: Dùng công cụ `Đường tròn khi biết tâm và bán kính` tại tâm $B$, nhập bán kính bằng $3$ để cắt đường vuông góc tại $C$.
*   **Bước 4**: Xác định điểm $E$ là giao điểm của đường vuông góc qua $A$ với đường song song song với $AB$ đi qua $C$. Dùng công cụ `Đa giác` nối các đỉnh lại tạo thành hình chữ nhật hoàn chỉnh.

### 2. Vẽ hình bình hành $ABCD$ ($AB = 4\text{ cm}$, $BC = 3\text{ cm}$, $\widehat{ABC} = 120^\circ$)
*   **Bước 1**: Vẽ đoạn thẳng $AB = 4\text{ cm}$.
*   **Bước 2**: Tạo góc $\widehat{ABC} = 120^\circ$ bằng công cụ `Góc với số đo cho trước`. Vẽ tia $Bx$ đi qua điểm tạo góc.
*   **Bước 3**: Dựng đường tròn tâm $B$, bán kính $3\text{ cm}$ cắt tia $Bx$ vừa tạo tại điểm $C$.
*   **Bước 4**: Dựng đường thẳng song song với $BC$ đi qua $A$ và đường thẳng song song với $AB$ đi qua $C$. Giao điểm của hai đường thẳng này chính là điểm $D$ cần tìm. Nối đa giác $ABCD$.

### 3. Vẽ hình thang cân $ADEC$ ($AD \parallel EC$, $AD = 6\text{ cm}$, $EC = 3\text{ cm}$, $AC = 2\text{ cm}$, $DE = 4\text{ cm}$)
*   **Bước 1**: Dựng đoạn thẳng nằm ngang có độ dài bằng đáy lớn trừ đáy nhỏ ($AD - EC = 3\text{ cm}$).
*   **Bước 2**: Vẽ tam giác phụ với các cạnh bên tương ứng bằng các đường tròn bán kính $2\text{ cm}$ (từ $A$) và $4\text{ cm}$ (từ điểm hiệu số) để định vị đỉnh bên.
*   **Bước 3**: Sử dụng công cụ `Đường song song` dựng đáy nhỏ song song song với đáy lớn để tìm vị trí chính xác của hai đỉnh $E, C$. Hoàn tất hình thang bằng công cụ đa giác.

---

## Chủ đề 4: Dự án Thống kê và Phân tích khí hậu Việt Nam

### 1. Mục tiêu và Chuẩn bị dữ liệu
*   **Mục tiêu**: Ứng dụng kỹ năng thu thập, phân loại, biểu diễn và phân tích số liệu thống kê (đã học ở Chương V) để nghiên cứu đặc điểm tự nhiên của Việt Nam.
*   **Chuẩn bị**: Học sinh khai thác thông tin khí tượng từ sách giáo khoa Địa lí lớp 8, trang web của Tổng cục Thống kê (`gso.gov.vn`) hoặc cơ sở dữ liệu khí hậu toàn cầu (`worlddata.info`).

### 2. Các dự án nghiên cứu cụ thể
*   **Dự án 1 (Khí hậu chung Việt Nam)**:
    *   *Thu thập số liệu*: Nhiệt độ trung bình ($^\circ\text{C}$), lượng mưa trung bình ($\text{mm}$) và độ ẩm trung bình ($\%$) của 12 tháng tại một địa phương cụ thể.
    *   *Biểu diễn*: Vẽ **Biểu đồ cột kép** (so sánh nhiệt độ và độ ẩm qua các tháng) hoặc **Biểu đồ đoạn thẳng** (thể hiện diễn biến lượng mưa theo thời gian để làm nổi bật mùa mưa và mùa khô).
*   **Dự án 2 (So sánh khí hậu miền Bắc và miền Nam)**:
    *   *Nhiệm vụ*: Thu thập bảng số liệu thời tiết của Thủ đô Hà Nội đại diện cho khí hậu miền Bắc (nhiệt đới gió mùa có mùa đông lạnh) và Thành phố Hồ Chí Minh đại diện cho khí hậu miền Nam (nhiệt đới xavan cận xích đạo hai mùa mưa - nắng).
    *   *Phân tích*: Biểu diễn số liệu nhiệt độ 12 tháng của hai thành phố trên cùng một biểu đồ đoạn thẳng để so sánh:
        *   Sự chênh lệch nhiệt độ cực đại và cực tiểu trong năm (biên độ nhiệt miền Bắc lớn hơn rất nhiều so với miền Nam).
        *   Sự khác biệt về thời điểm và lượng mưa tích lũy giữa hai vùng khí hậu.
