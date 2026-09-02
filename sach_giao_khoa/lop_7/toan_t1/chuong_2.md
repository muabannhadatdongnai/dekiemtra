# CHƯƠNG II: SỐ THỰC

## BÀI 5: LÀM QUEN VỚI SỐ THẬP PHÂN VÔ HẠN TUẦN HOÀN

### 1. Số thập phân vô hạn tuần hoàn
* **Khái niệm:** Khi thực hiện phép chia các số nguyên (như $5$ chia cho $18$ hoặc $17$ chia cho $11$), phép chia có thể kéo dài vô hạn và các chữ số ở phần thập phân bắt đầu lặp lại theo một chu kỳ nhất định.
* **Ví dụ:**
  * $\frac{5}{18} = 0,2777...$ Chữ số $7$ được lặp lại mãi mãi. Ta viết gọn là $0,2(7)$. Số này được gọi là số thập phân vô hạn tuần hoàn với **chu kỳ** là $7$.
  * $\frac{17}{11} = 1,545454...$ Cặp chữ số $54$ được lặp lại tuần hoàn. Ta viết gọn là $1,(54)$. Số này có chu kỳ là $54$.
  * $-1,545454... = -1,(54)$ có chu kỳ là $54$.
* **Số thập phân hữu hạn:** Là các số thập phân có phần thập phân tận cùng (chấm dứt), ví dụ như $0,8$; $1,25$; $-6,725$.

### 2. Làm tròn số thập phân căn cứ vào độ chính xác cho trước
* **Mục đích:** Để làm tròn một số thập phân đến một hàng nào đó sao cho sai số không vượt quá một mức độ cho trước (độ chính xác d).
* **Quy tắc mối liên hệ giữa hàng làm tròn và độ chính xác:**
  | Hàng làm tròn | Độ chính xác tương ứng ($d$) |
  | :--- | :--- |
  | Trăm | $50$ |
  | Chục | $5$ |
  | Đơn vị | $0,5$ |
  | Phần mười | $0,05$ |
  | Phần trăm | $0,005$ |
  | Phần nghìn | $0,0005$ |

* **Ví dụ:**
  * Làm tròn số $12\,591,27$ với độ chính xác $50$: Ta làm tròn đến hàng trăm $\rightarrow 12\,600$.
  * Làm tròn số $12\,591,27$ với độ chính xác $0,05$: Ta làm tròn đến hàng phần mười $\rightarrow 12\,591,3$.
  * Làm tròn số $3,14159...$ với độ chính xác $0,005$: Ta làm tròn đến hàng phần trăm $\rightarrow 3,14$.

---

## BÀI 6: SỐ VÔ TỈ. CĂN BẬC HAI SỐ HỌC

### 1. Số vô tỉ
* **Định nghĩa:** Số vô tỉ là số viết được dưới dạng số thập phân vô hạn không tuần hoàn.
* **Kí hiệu:** Tập hợp các số vô tỉ được kí hiệu là $\mathbb{I}$.
* **Ví dụ thực tế:** 
  * Độ dài cạnh của một hình vuông có diện tích bằng $2\text{ dm}^2$ là số $x$ thỏa mãn $x^2 = 2$. Người ta chứng minh được $x = 1,41421356...$ là một số thập phân vô hạn không tuần hoàn (số vô tỉ).
  * Số $\pi = 3,14159265...$ biểu diễn tỉ số giữa chu vi và đường kính của đường tròn là số vô tỉ.

### 2. Căn bậc hai số học
* **Định nghĩa:** Căn bậc hai số học của một số $a$ không âm, kí hiệu là $\sqrt{a}$, là số $x$ không âm sao cho $x^2 = a$.
  $$\text{Với } a \geq 0: \sqrt{a} = x \Leftrightarrow x \geq 0 \text{ và } x^2 = a$$
* **Ví dụ:**
  * $\sqrt{100} = 10$ vì $10^2 = 100$ và $10 > 0$.
  * $\sqrt{191^2} = 191$ vì $191 > 0$.
  * $\sqrt{21,5^2} = 21,5$.
  * Không tồn tại căn bậc hai số học của số âm (ví dụ: $\sqrt{-4}$ không xác định trong tập số thực).

### 3. Tính căn bậc hai số học bằng máy tính cầm tay
* Để tính căn bậc hai số học của một số không âm bằng máy tính cầm tay, ta sử dụng phím dấu căn $\sqrt{\quad}$.
* **Ví dụ:** 
  * Để tính $\sqrt{91}$, ta ấn các phím: `[√] [9] [1] [=]`. Máy tính hiển thị kết quả gần đúng là $9,539392014...$
  * Làm tròn đến hàng phần mười (độ chính xác $0,05$): $\sqrt{91} \approx 9,5$.

---

## BÀI 7: TẬP HỢP CÁC SỐ THỰC

### 1. Khái niệm số thực và trục số thực
* **Khái niệm:** Số hữu tỉ và số vô tỉ được gọi chung là số thực.
* **Kí hiệu:** Tập hợp các số thực được kí hiệu là $\mathbb{R}$.
  $$\mathbb{R} = \mathbb{Q} \cup \mathbb{I}$$
* **Số đối:** Mỗi số thực $a$ đều có một số đối kí hiệu là $-a$. Tổng của hai số thực đối nhau luôn bằng $0$.
* **Phép toán:** Trong tập hợp số thực $\mathbb{R}$, ta cũng định nghĩa các phép toán cộng, trừ, nhân, chia, lũy thừa với các tính chất tương tự như trong tập hợp số hữu tỉ $\mathbb{Q}$.
* **Trục số thực:** 
  * Mỗi số thực được biểu diễn bởi một điểm trên trục số. 
  * Ngược lại, mỗi điểm trên trục số đều biểu diễn một số thực. 
  * Các số thực lấp đầy trục số, do đó trục số biểu diễn số thực được gọi là **trục số thực**.

### 2. Thứ tự trong tập hợp các số thực
* **So sánh hai số thực:** Ta so sánh hai số thực bằng cách viết chúng dưới dạng số thập phân (hữu hạn hoặc vô hạn).
  * *Ví dụ:* So sánh $0,24(7)$ và $0,2382...$: Ta có $0,2477... > 0,2382...$ nên $0,24(7) > 0,2382...$
  * So sánh căn bậc hai: Với hai số dương $a$ và $b$, nếu $a < b$ thì $\sqrt{a} < \sqrt{b}$.
    * *Ví dụ:* So sánh $\sqrt{2}$ và $\sqrt{5}$: Vì $2 < 5$ nên $\sqrt{2} < \sqrt{5}$.

### 3. Giá trị tuyệt đối của một số thực
* **Định nghĩa:** Khoảng cách từ điểm $a$ trên trục số đến gốc $0$ là giá trị tuyệt đối của số thực $a$, kí hiệu là $|a|$.
* **Quy tắc xác định:**
  $$|a| = \begin{cases} a & \text{khi } a > 0 \\ -a & \text{khi } a < 0 \\ 0 & \text{khi } a = 0 \end{cases}$$
* **Nhận xét:**
  * Giá trị tuyệt đối của một số thực luôn là một số không âm: $|a| \geq 0$ với mọi $a \in \mathbb{R}$.
  * Hai số đối nhau có giá trị tuyệt đối bằng nhau: $|a| = |-a|$.
* **Ví dụ:**
  * $|-1,25| = 1,25$
  * $|\sqrt{2}| = \sqrt{2}$
  * $|-\sqrt{5}| = \sqrt{5}$

---

## LUYỆN TẬP CHUNG (Bổ trợ kiến thức)

### Công thức bổ sung đặc biệt:
Với mọi số thực $a$, ta luôn có:
$$\sqrt{a^2} = |a|$$
* Nếu $a \geq 0$ thì $\sqrt{a^2} = a$.
* Nếu $a < 0$ thì $\sqrt{a^2} = -a$.
* **Ví dụ:** $\sqrt{(-3)^2} = |-3| = 3$.

---

## BÀI TẬP CUỐI CHƯƠNG II (DẠNG TOÁN TIÊU BIỂU)

### Dạng 1: Làm tròn số và ước lượng kết quả
* **Bài toán:** Sử dụng máy tính cầm tay làm tròn các số sau đến chữ số thập phân thứ nhất: $a = \sqrt{2}$, $b = \sqrt{5}$.
* **Lời giải:**
  * Sử dụng máy tính cầm tay:
    * $a = \sqrt{2} \approx 1,4142... \rightarrow$ Làm tròn đến chữ số thập phân thứ nhất: $a \approx 1,4$.
    * $b = \sqrt{5} \approx 2,2360... \rightarrow$ Làm tròn đến chữ số thập phân thứ nhất: $b \approx 2,2$.
  * Tổng hai số nhận được sau khi làm tròn: $1,4 + 2,2 = 3,6$.

### Dạng 2: Viết số dưới dạng thập phân vô hạn tuần hoàn
* **Bài toán:** Chia một sợi dây đồng dài $10\text{ m}$ thành $7$ đoạn bằng nhau. Tính độ dài mỗi đoạn dây nhận được và viết kết quả dưới dạng số thập phân vô hạn tuần hoàn.
* **Lời giải:**
  * Độ dài mỗi đoạn dây là phép chia: $10 : 7 = \frac{10}{7}\text{ m}$.
  * Thực hiện phép chia: $10 : 7 = 1,428571428571...$
  * Viết gọn dưới dạng chu kỳ tuần hoàn: $1,(428571)\text{ m}$ (chu kỳ gồm $6$ chữ số là $428571$).

### Dạng 3: So sánh số thực và giá trị tuyệt đối
* **Bài toán:** Cho hai số thực $a = -1,25$ và $b = -2,3$. So sánh: $a$ và $b$; $|a|$ và $|b|$.
* **Lời giải:**
  * So sánh $a$ và $b$: Vì $1,25 < 2,3$ nên $-1,25 > -2,3$. Vậy $a > b$.
  * Tính giá trị tuyệt đối:
    * $|a| = |-1,25| = 1,25$
    * $|b| = |-2,3| = 2,3$
  * So sánh giá trị tuyệt đối: Vì $1,25 < 2,3$ nên $|a| < |b|$.
  * *Nhận xét:* Trong hai số âm, số nào có giá trị tuyệt đối lớn hơn thì số đó nhỏ hơn.
