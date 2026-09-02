# CHƯƠNG II: BẤT PHƯƠNG TRÌNH VÀ HỆ BẤT PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN

Các bất phương trình bậc nhất hai ẩn và hệ bất phương trình bậc nhất hai ẩn xuất hiện trong nhiều bài toán kinh tế, như là những ràng buộc trong các bài toán sản xuất, bài toán phân phối hàng hoá,... Chương này cung cấp cách biểu diễn miền nghiệm của các bất phương trình và hệ bất phương trình bậc nhất hai ẩn trên mặt phẳng toạ độ [21].

---

## BÀI 3: BẤT PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN

### 1. Bất phương trình bậc nhất hai ẩn
*   **Định nghĩa**: Bất phương trình bậc nhất hai ẩn $x, y$ có dạng tổng quát là [22]:
    $$ax + by \le c \quad (\text{hoặc } ax + by \ge c, \; ax + by < c, \; ax + by > c)$$
    trong đó $a, b, c$ là những số thực đã cho, $a$ và $b$ không đồng thời bằng $0$, $x$ và $y$ là các ẩn số [22].
*   **Nghiệm**: Cặp số $(x_0; y_0)$ được gọi là một **nghiệm** của bất phương trình bậc nhất hai ẩn $ax + by \le c$ nếu bất đẳng thức $ax_0 + by_0 \le c$ đúng [22].
    *   Tương tự cho các bất phương trình dạng $ax+by \ge c$, $ax+by < c$, $ax+by > c$ [22].
*   *Ví dụ*:
    *   $2x + 3y < 1$ là một bất phương trình bậc nhất hai ẩn [22].
    *   $2x^2 + 3y < 1$ không phải là bất phương trình bậc nhất hai ẩn vì có chứa $x^2$ [22].
    *   Cặp số $(3; 4)$ là một nghiệm của $x + 2y > 5$ vì $3 + 2 \cdot 4 = 11 > 5$ (đúng) [22].
    *   Cặp số $(0; -1)$ không phải là nghiệm của $x + 2y > 5$ vì $0 + 2 \cdot (-1) = -2 > 5$ (sai) [22].
*   *Nhận xét*: Bất phương trình bậc nhất hai ẩn luôn có vô số nghiệm [22].

---

### 2. Biểu diễn miền nghiệm của bất phương trình bậc nhất hai ẩn trên mặt phẳng toạ độ
*   **Định nghĩa miền nghiệm**: Trong mặt phẳng toạ độ Oxy, tập hợp các điểm có toạ độ là nghiệm của bất phương trình $ax + by \le c$ được gọi là **miền nghiệm** của bất phương trình đó [23].
*   **Quy luật hình học**: Đường thẳng $d: ax + by = c$ chia mặt phẳng toạ độ Oxy thành hai nửa mặt phẳng bờ $d$ [23]:
    *   Một nửa mặt phẳng (không kể bờ $d$) gồm các điểm có toạ độ $(x; y)$ thoả mãn $ax + by > c$ [23].
    *   Nửa mặt phẳng còn lại (không kể bờ $d$) gồm các điểm có toạ độ $(x; y)$ thoả mãn $ax + by < c$ [23].
    *   Đường thẳng $d$ gồm các điểm có toạ độ $(x; y)$ thoả mãn $ax + by = c$ [23].

#### **Cách biểu diễn miền nghiệm của bất phương trình $ax + by \le c$**:
1.  **Bước 1**: Vẽ đường thẳng $d: ax + by = c$ trên mặt phẳng toạ độ Oxy [24].
2.  **Bước 2**: Lấy một điểm $M_0(x_0; y_0)$ không thuộc $d$ [24].
    *   *Mẹo*: Nếu $c \ne 0$, ta thường chọn gốc toạ độ $O(0; 0)$ để việc tính toán dễ dàng nhất [24].
    *   Nếu $c = 0$, ta thường chọn điểm $M_0(1; 0)$ hoặc $M_0(0; 1)$ [24].
3.  **Bước 3**: Tính $ax_0 + by_0$ và so sánh với $c$ [24]:
    *   Nếu $ax_0 + by_0 < c$ thì nửa mặt phẳng bờ $d$ chứa điểm $M_0$ là miền nghiệm của $ax + by \le c$ (kể cả bờ $d$) [24].
    *   Nếu $ax_0 + by_0 > c$ thì nửa mặt phẳng bờ $d$ không chứa điểm $M_0$ là miền nghiệm của $ax + by \le c$ (kể cả bờ $d$) [24].
4.  **Bước 4**: Gạch bỏ phần mặt phẳng không phải là miền nghiệm [23, 24].

*Lưu ý*: Với bất phương trình dạng $ax + by < c$ hoặc $ax + by > c$, ta thực hiện tương tự nhưng miền nghiệm không kể bờ $d$ (biểu diễn đường thẳng $d$ bằng **nét đứt**) [24].

---
---

## BÀI 4: HỆ BẤT PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN

### 1. Hệ bất phương trình bậc nhất hai ẩn
*   **Định nghĩa**: Hệ bất phương trình bậc nhất hai ẩn là một hệ gồm hai hay nhiều bất phương trình bậc nhất hai ẩn [25].
*   **Nghiệm**: Cặp số $(x_0; y_0)$ là nghiệm của một hệ bất phương trình bậc nhất hai ẩn khi $(x_0; y_0)$ đồng thời là nghiệm của tất cả các bất phương trình trong hệ đó [25].
*   *Ví dụ*: Hệ bất phương trình:
    $$\begin{cases} x \ge 0 \\ y \ge 0 \\ x + y \le 150 \end{cases}$$
    Cặp số $(x; y) = (0; 0)$ là một nghiệm của hệ này vì nó thoả mãn cả ba bất phương trình của hệ [26].

---

### 2. Biểu diễn miền nghiệm của hệ bất phương trình bậc nhất hai ẩn trên mặt phẳng toạ độ
*   **Định nghĩa**: Trong mặt phẳng toạ độ, miền nghiệm của hệ bất phương trình bậc nhất hai ẩn là phần mặt phẳng chứa các điểm thoả mãn đồng thời tất cả các bất phương trình trong hệ (tức là **giao của các miền nghiệm** của từng bất phương trình trong hệ) [26].

#### **Cách xác định miền nghiệm của một hệ**:
1.  Trên cùng một mặt phẳng toạ độ, xác định miền nghiệm của mỗi bất phương trình bậc nhất hai ẩn trong hệ và gạch bỏ miền còn lại [27].
2.  Miền không bị gạch là miền nghiệm của hệ bất phương trình đã cho [27].
*   *Ví dụ*: Miền nghiệm của hệ $\begin{cases} x \ge 0 \\ y \ge 0 \\ x + y \le 150 \end{cases}$ là miền tam giác $OAB$ (kể cả biên, ngoại trừ một số trường hợp cụ thể có nét đứt) [26, 27].

---

### 3. Ứng dụng của hệ bất phương trình bậc nhất hai ẩn (Bài toán tối ưu hoá)
Hệ bất phương trình bậc nhất hai ẩn thường được sử dụng để giải quyết các bài toán tối ưu hoá trong thực tế (lập kế hoạch sản xuất, kinh doanh, dinh dưỡng...) [21, 28].

*   **Giá trị lớn nhất và nhỏ nhất của biểu thức bậc nhất**:
    Cho biểu thức $F(x; y) = ax + by$ với $(x; y)$ là các điểm nằm trong miền đa giác $A_1A_2...A_n$ [28].
    *   *Định lí*: Giá trị lớn nhất (hoặc nhỏ nhất) của biểu thức $F(x; y) = ax + by$ đạt được tại một trong các đỉnh của đa giác đó [28].
*   **Các bước giải bài toán tối ưu hóa**:
    *   **Bước 1**: Thiết lập hệ bất phương trình bậc nhất hai ẩn biểu diễn các điều kiện ràng buộc thực tế và biểu thức $F(x; y) = ax + by$ cần tối ưu (ví dụ: lợi nhuận tối đa hoặc chi phí tối thiểu) [28].
    *   **Bước 2**: Xác định miền nghiệm của hệ bất phương trình này (thường là một miền đa giác $A_1A_2...A_n$) [28].
    *   **Bước 3**: Tìm toạ độ các đỉnh $A_1, A_2, ..., A_n$ của đa giác [28].
    *   **Bước 4**: Tính giá trị của biểu thức $F(x; y)$ tại tất cả các đỉnh này [28].
    *   **Bước 5**: So sánh các giá trị vừa tính để tìm ra giá trị lớn nhất hoặc nhỏ nhất và đưa ra kết luận kinh tế/thực tế [28].

---
---

## BÀI TẬP CUỐI CHƯƠNG II

### A - TRẮC NGHIỆM
Các câu hỏi trắc nghiệm cuối chương tập trung vào [30]:
*   Nhận diện bất phương trình/hệ bất phương trình bậc nhất hai ẩn (Loại trừ các phương trình bậc hai hoặc chứa tích ẩn $xy$) [30].
*   Xác định cặp số là nghiệm hoặc không là nghiệm của bất phương trình/hệ bất phương trình [30].
*   Xác định miền nghiệm tương ứng từ hình vẽ biểu diễn cho trước [30].

### B - TỰ LUẬN
Các bài tập tự luận yêu cầu [31, 32]:
*   Biểu diễn miền nghiệm của các bất phương trình và hệ bất phương trình bậc nhất hai ẩn trên hệ trục toạ độ Oxy [31].
*   Tìm giá trị lớn nhất, giá trị nhỏ nhất của biểu thức trên một miền nghiệm cho trước [31].
*   Giải quyết bài toán thực tế phức tạp:
    *   *Bài toán tài chính & đầu tư*: Phân bổ vốn đầu tư vào các loại trái phiếu khác nhau với lãi suất và mức độ rủi ro khác nhau sao cho lợi nhuận thu được sau một năm là lớn nhất [31, 32].
    *   *Bài toán quảng cáo*: Thiết lập thời gian quảng cáo trên đài phát thanh và truyền hình với chi phí định trước sao cho tiếp cận được số lượng khán giả tối đa [32].
    *   *Bài toán sản xuất*: Tính toán số lượng máy móc thiết bị cần nhập khẩu (ví dụ máy điều hoà hai chiều và một chiều) thoả mãn nhu cầu thị trường và giới hạn nguồn vốn để đạt lợi nhuận lớn nhất [28, 29].
    *   *Bài toán dinh dưỡng*: Xác định khối lượng thực phẩm cần mua hằng ngày để đảm bảo cung cấp đủ lượng protein và lipid cần thiết với chi phí tối thiểu [29].
