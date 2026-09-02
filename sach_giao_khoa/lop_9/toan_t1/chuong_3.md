# CHƯƠNG III: CĂN BẬC HAI VÀ CĂN BẬC BA

Chương III cung cấp kiến thức toàn diện về căn bậc hai, căn thức bậc hai, các phép biến đổi căn thức bậc hai và khái niệm căn bậc ba, cùng các ứng dụng vật lý, hình học và thực tiễn phong phú.

---

## BÀI 7: CĂN BẬC HAI VÀ CĂN THỨC BẬC HAI

### 1. Căn bậc hai
* **Định nghĩa**: Căn bậc hai của một số thực không âm $a$ là số thực $x$ sao cho $x^2 = a$.
* **Tính chất**:
  * Số thực âm không có căn bậc hai.
  * Số $0$ có đúng một căn bậc hai duy nhất là chính nó: $\sqrt{0} = 0$.
  * Mỗi số thực dương $a$ có đúng hai căn bậc hai đối nhau là $\sqrt{a}$ (gọi là **căn bậc hai số học** của $a$) và $-\sqrt{a}$.
* **Cách tính bằng máy tính cầm tay (MTCT)**: Sử dụng nút căn bậc hai $\sqrt{\quad}$ trên Casio để tính giá trị gần đúng.
  * *Ví dụ*: Tính căn bậc hai của $11,1$: Bấm $\sqrt{11,1}$ được kết quả xấp xỉ $3,33$. Hai căn bậc hai của $11,1$ là $3,33$ và $-3,33$.

* **Ví dụ mẫu**:
  * **Ví dụ 1**: Tìm căn bậc hai của $121$.
    * *Lời giải*: Vì $11^2 = 121$ nên số $121$ có hai căn bậc hai đối nhau là $11$ và $-11$.

---

### 2. Căn thức bậc hai
* **Định nghĩa**: Căn thức bậc hai là biểu thức có dạng $\sqrt{A}$, trong đó $A$ là một biểu thức đại số. $A$ được gọi là biểu thức lấy căn hoặc biểu thức dưới dấu căn.
* **Điều kiện xác định**: Căn thức $\sqrt{A}$ xác định (hay có nghĩa) khi và chỉ khi biểu thức dưới dấu căn không âm:
  $$A \ge 0$$

* **Hằng đẳng thức $\sqrt{A^2} = |A|$**:
  * Với mọi số thực $a$, ta luôn có: $\sqrt{a^2} = |a|$.
  * Tổng quát:
    $$\sqrt{A^2} = |A| = \begin{cases} A & \text{nếu } A \ge 0 \\ -A & \text{nếu } A < 0 \end{cases}$$

* **Ví dụ mẫu**:
  * **Ví dụ 2**: Tìm điều kiện xác định của căn thức $\sqrt{2x+1}$.
    * *Lời giải*: Căn thức $\sqrt{2x+1}$ xác định khi và chỉ khi:
      $$2x + 1 \ge 0 \Leftrightarrow 2x \ge -1 \Leftrightarrow x \ge -\frac{1}{2}$$
  
  * **Ví dụ 3**: Rút gọn biểu thức $\sqrt{1 - 2x + x^2}$ với $x > 2$.
    * *Lời giải*: Sử dụng hằng đẳng thức đáng nhớ:
      $$\sqrt{1 - 2x + x^2} = \sqrt{(1 - x)^2} = |1 - x|$$
      Vì $x > 2$ nên $1 - x < 0$. Do đó, $|1 - x| = -(1 - x) = x - 1$.
      Vậy với $x > 2$, biểu thức rút gọn được là $x - 1$.

---

## BÀI 8: KHAI CĂN BẬC HAI VỚI PHÉP NHÂN VÀ PHÉP CHIA

### 1. Khai căn bậc hai với phép nhân
* **Định lý**: Với hai biểu thức không âm $A$ và $B$, ta có:
  $$\sqrt{A \cdot B} = \sqrt{A} \cdot \sqrt{B}$$
* **Mở rộng**: Định lý trên có thể mở rộng cho nhiều biểu thức không âm:
  $$\sqrt{A \cdot B \cdot C} = \sqrt{A} \cdot \sqrt{B} \cdot \sqrt{C} \quad (\text{với } A, B, C \ge 0)$$

* **Ví dụ mẫu**:
  * **Ví dụ 4**: Tính nhanh biểu thức $A = \sqrt{27} \cdot \sqrt{3}$.
    * *Lời giải*: Áp dụng quy tắc nhân căn thức:
      $$A = \sqrt{27 \cdot 3} = \sqrt{81} = 9$$
  
  * **Ví dụ 5**: Rút gọn biểu thức $\sqrt{5ab^3} \cdot \sqrt{5ab}$ với $a < 0, b < 0$.
    * *Lời giải*:
      $$\sqrt{5ab^3 \cdot 5ab} = \sqrt{25a^2b^4} = \sqrt{(5ab^2)^2} = |5ab^2|$$
      Vì $a < 0$ và $b^2 > 0$ (do $b < 0$), nên tích $5ab^2 < 0$. Do đó:
      $$|5ab^2| = -5ab^2$$

---

### 2. Khai căn bậc hai với phép chia
* **Định lý**: Với biểu thức $A$ không âm và biểu thức $B$ dương, ta có:
  $$\sqrt{\frac{A}{B}} = \frac{\sqrt{A}}{\sqrt{B}}$$

* **Ví dụ mẫu**:
  * **Ví dụ 6**: Rút gọn biểu thức $\sqrt{\frac{52a^3}{13a}}$ với $a > 0$.
    * *Lời giải*: Do $a > 0$, ta thực hiện chia biểu thức dưới dấu căn trước:
      $$\sqrt{\frac{52a^3}{13a}} = \sqrt{4a^2} = 2|a| = 2a \quad (\text{vì } a > 0)$$

---

## BÀI 9: BIẾN ĐỔI ĐƠN GIẢN VÀ RÚT GỌN BIỂU THỨC CHỨA CĂN THỨC BẬC HAI

### 1. Đưa thừa số ra ngoài / vào trong dấu căn
* **Đưa thừa số ra ngoài**: Với $B \ge 0$, ta có:
  $$\sqrt{A^2 \cdot B} = |A|\sqrt{B}$$
* **Đưa thừa số vào trong**:
  * Nếu $A \ge 0, B \ge 0$ thì $A\sqrt{B} = \sqrt{A^2B}$.
  * Nếu $A < 0, B \ge 0$ thì $A\sqrt{B} = -\sqrt{A^2B}$.

* **Ví dụ mẫu**:
  * **Ví dụ 7**: Đưa thừa số ra ngoài dấu căn đối với biểu thức $\sqrt{45}$.
    * *Lời giải*: Phân tích $45 = 3^2 \cdot 5$.
      $$\sqrt{45} = \sqrt{3^2 \cdot 5} = 3\sqrt{5}$$

---

### 2. Trục căn thức ở mẫu
Trục căn thức ở mẫu là phép biến đổi làm biến mất căn thức ở mẫu số của một biểu thức:
1. **Dạng đơn giản**: Với $B > 0$, ta có:
   $$\frac{A}{\sqrt{B}} = \frac{A\sqrt{B}}{B}$$
2. **Nhân với biểu thức liên hợp**:
   * Với $A \ge 0, A \neq B^2$:
     $$\frac{C}{\sqrt{A} + B} = \frac{C(\sqrt{A} - B)}{A - B^2} \quad \text{và} \quad \frac{C}{\sqrt{A} - B} = \frac{C(\sqrt{A} + B)}{A - B^2}$$
   * Với $A \ge 0, B \ge 0, A \neq B$:
     $$\frac{C}{\sqrt{A} + \sqrt{B}} = \frac{C(\sqrt{A} - \sqrt{B})}{A - B} \quad \text{và} \quad \frac{C}{\sqrt{A} - \sqrt{B}} = \frac{C(\sqrt{A} + \sqrt{B})}{A - B}$$

* **Ví dụ mẫu**:
  * **Ví dụ 8**: Trục căn thức ở mẫu của biểu thức $P = \frac{a}{3 - 2\sqrt{2}}$.
    * *Lời giải*: Nhân cả tử và mẫu với biểu thức liên hợp của mẫu là $3 + 2\sqrt{2}$:
      $$P = \frac{a(3 + 2\sqrt{2})}{(3 - 2\sqrt{2})(3 + 2\sqrt{2})} = \frac{a(3 + 2\sqrt{2})}{3^2 - (2\sqrt{2})^2} = \frac{a(3 + 2\sqrt{2})}{9 - 8} = (3 + 2\sqrt{2})a$$

---

## BÀI 10: CĂN BẬC BA VÀ CĂN THỨC BẬC BA

### 1. Căn bậc ba
* **Định nghĩa**: Căn bậc ba của một số thực $a$ là số thực $x$ sao cho $x^3 = a$.
* **Ký hiệu**: Căn bậc ba của số $a$ ký hiệu là $\sqrt[3]{a}$.
* **Nhận xét quan trọng**:
  * Mọi số thực $a$ (dương, âm, hoặc bằng 0) đều có **duy nhất một** căn bậc ba.
  * Không giống như căn bậc hai, căn bậc ba của số âm là một số âm hoàn toàn xác định.
  * Ta luôn có hệ thức:
    $$(\sqrt[3]{a})^3 = \sqrt[3]{a^3} = a$$

* **Ví dụ mẫu**:
  * **Ví dụ 9**: Tính giá trị của biểu thức $\sqrt[3]{-27}$.
    * *Lời giải*: Vì $(-3)^3 = -27$ nên $\sqrt[3]{-27} = -3$.

---

### 2. Căn thức bậc ba
* **Định nghĩa**: Căn thức bậc ba là biểu thức có dạng $\sqrt[3]{A}$, trong đó $A$ là một biểu thức đại số.
* **Tính chất**: Căn thức bậc ba luôn xác định với mọi giá trị của biến số đại số (không yêu cầu điều kiện dưới dấu căn phải không âm).
* **Công thức biến đổi**:
  $$(\sqrt[3]{A})^3 = \sqrt[3]{A^3} = A$$

---

## BÀI TẬP CUỐI CHƯƠNG III (ĐỀ BÀI & LỜI GIẢI CHI TIẾT)

### PHẦN A: TRẮC NGHIỆM KHÁCH QUAN

**Bài 3.32**: Căn bậc hai của $4$ là:
* A. $2$
* B. $-2$
* C. $2$ và $-2$
* D. $\sqrt{2}$ và $-\sqrt{2}$
* **Đáp án chọn**: **C**
* *Giải thích chi tiết*: Số thực dương $4$ có hai căn bậc hai đối nhau là $\sqrt{4} = 2$ và $-\sqrt{4} = -2$.

**Bài 3.33**: Căn bậc hai số học của $49$ là:
* A. $7$
* B. $-7$
* C. $7$ và $-7$
* D. $\sqrt{7}$ và $-\sqrt{7}$
* **Đáp án chọn**: **A**
* *Giải thích chi tiết*: Căn bậc hai số học của số thực dương $a$ là giá trị không âm $\sqrt{a}$. Vậy căn bậc hai số học của $49$ là $\sqrt{49} = 7$.

**Bài 3.34**: Rút gọn biểu thức $\sqrt[3]{(4 - \sqrt{17})^3}$ ta được:
* A. $4 + \sqrt{17}$
* B. $4 - \sqrt{17}$
* C. $\sqrt{17} - 4$
* D. $-4 - \sqrt{17}$
* **Đáp án chọn**: **B**
* *Giải thích chi tiết*: Định lý căn bậc ba chỉ ra rằng $\sqrt[3]{A^3} = A$ với mọi biểu thức $A$. Do đó:
  $$\sqrt[3]{(4 - \sqrt{17})^3} = 4 - \sqrt{17}$$

**Bài 3.35**: Độ dài đường kính (mét) của hình tròn có diện tích $4\text{ m}^2$ sau khi làm tròn kết quả đến chữ số thập phân thứ hai bằng:
* A. $2,26$
* B. $2,50$
* C. $1,13$
* D. $1,12$
* **Đáp án chọn**: **A**
* *Giải thích chi tiết*:
  Diện tích hình tròn là $S = \pi R^2 = 4 \Rightarrow R = \sqrt{\frac{4}{\pi}} \approx 1,1284\text{ (m)}$.
  Độ dài đường kính của hình tròn là:
  $$d = 2R = 2 \cdot \sqrt{\frac{4}{\pi}} \approx 2 \cdot 1,1284 \approx 2,2568\text{ (m)}$$
  Làm tròn đến chữ số thập phân thứ hai ta được $d \approx 2,26\text{ m}$.

**Bài 3.36**: Một vật rơi tự do từ độ cao $396,9\text{ m}$. Biết quãng đường chuyển động $S\text{ (mét)}$ phụ thuộc vào thời gian $t\text{ (giây)}$ bởi công thức $S = 4,9t^2$. Vật chạm đất sau:
* A. $8$ giây
* B. $5$ giây
* C. $11$ giây
* D. $9$ giây
* **Đáp án chọn**: **D**
* *Giải thích chi tiết*: Khi vật chạm đất thì quãng đường vật rơi đúng bằng độ cao ban đầu:
  $$S = 396,9 \Rightarrow 4,9t^2 = 396,9 \Leftrightarrow t^2 = \frac{396,9}{4,9} = 81$$
  Vì thời gian $t > 0$, ta có $t = \sqrt{81} = 9$ giây.

---

### PHẦN B: TỰ LUẬN RÈN LUYỆN

**Bài 3.37**: Không sử dụng máy tính cầm tay, hãy tính giá trị của biểu thức:
$$A = \sqrt{(\sqrt{3}-2)^2} + \sqrt{4(2+\\sqrt{3})^2} - \frac{1}{2-\\sqrt{3}}$$
* **Lời giải chi tiết từng bước**:
  1. **Bước 1**: Rút gọn hạng tử thứ nhất sử dụng hằng đẳng thức $\sqrt{A^2} = |A|$:
     $$\sqrt{(\sqrt{3}-2)^2} = |\sqrt{3}-2|$$
     Vì $\sqrt{3} < \sqrt{4} = 2$ nên $\sqrt{3} - 2 < 0$. Do đó:
     $$|\sqrt{3}-2| = 2 - \sqrt{3}$$
  2. **Bước 2**: Rút gọn hạng tử thứ hai:
     $$\sqrt{4(2+\sqrt{3})^2} = 2|2+\sqrt{3}|$$
     Vì $2+\sqrt{3} > 0$ nên $|2+\sqrt{3}| = 2+\sqrt{3}$. Do đó:
     $$2(2+\sqrt{3}) = 4 + 2\sqrt{3}$$
  3. **Bước 3**: Trục căn thức ở mẫu số hạng tử thứ ba bằng cách nhân liên hợp:
     $$\frac{1}{2-\sqrt{3}} = \frac{2+\sqrt{3}}{(2-\sqrt{3})(2+\sqrt{3})} = \frac{2+\sqrt{3}}{2^2 - (\sqrt{3})^2} = \frac{2+\sqrt{3}}{4-3} = 2+\sqrt{3}$$
  4. **Bước 4**: Thay thế các kết quả rút gọn vào biểu thức $A$:
     $$A = (2 - \sqrt{3}) + (4 + 2\sqrt{3}) - (2 + \sqrt{3})$$
     $$A = 2 - \sqrt{3} + 4 + 2\sqrt{3} - 2 - \sqrt{3}$$
     $$A = (2 + 4 - 2) + (-\sqrt{3} + 2\sqrt{3} - \sqrt{3}) = 4 + 0 = 4$$
  * **Kết luận**: Giá trị của biểu thức $A = 4$.

**Bài 3.38**: Cho biểu thức $A = \frac{\sqrt{x}+2}{\sqrt{x}-2} - \frac{4}{\sqrt{x}-2}$ với $x \ge 0$ và $x \neq 4$.
* **a) Rút gọn biểu thức $A$**:
  * *Lời giải*: Nhận thấy hai phân thức trong biểu thức có cùng mẫu thức là $\sqrt{x}-2$, ta tiến hành trừ các tử số:
    $$A = \frac{(\sqrt{x}+2) - 4}{\sqrt{x}-2}$$
    $$A = \frac{\sqrt{x} - 2}{\sqrt{x}-2}$$
    Vì điều kiện đề bài cho $x \neq 4 \Rightarrow \sqrt{x} \neq 2 \Rightarrow \sqrt{x} - 2 \neq 0$. Ta có thể rút gọn cả tử và mẫu cho $\sqrt{x}-2$:
    $$A = 1$$
* **b) Tính giá trị của biểu thức $A$ tại $x = 14$**:
  * *Lời giải*: Vì biểu thức $A$ sau khi rút gọn luôn bằng hằng số $1$ với mọi $x$ thỏa mãn điều kiện xác định, nên tại $x = 14$ (thỏa mãn $x \ge 0$ và $x \neq 4$), giá trị của biểu thức $A$ vẫn bằng $1$.
  * *Kết luận*: Tại $x = 14$, giá trị của $A$ là $1$.

**Bài 3.39**: Biết rằng nhiệt lượng toả ra trên dây dẫn được tính bởi công thức $Q = I^2Rt$, trong đó $Q$ là nhiệt lượng tính bằng Joule ($J$), $R$ là điện trở tính bằng Ohm ($\Omega$), $I$ là cường độ dòng điện tính bằng Ampe ($A$), $t$ là thời gian tính bằng giây ($s$). Dòng điện chạy qua một dây dẫn có điện trở $R = 10 \ \Omega$ trong thời gian $5$ giây.
* **a) Thay thế các dấu "?" trong bảng sau bằng các giá trị thích hợp**:
  * *Lời giải*: Với dữ kiện $R = 10\ \Omega$ và $t = 5\text{ s}$, công thức tính nhiệt lượng trở thành:
    $$Q = I^2 \cdot 10 \cdot 5 = 50I^2$$
    Ta tính giá trị $Q$ ứng với từng cường độ dòng điện $I$:
    * Với $I = 1\text{ A} \Rightarrow Q = 50 \cdot 1^2 = 50\text{ (J)}$.
    * Với $I = 1,5\text{ A} \Rightarrow Q = 50 \cdot (1,5)^2 = 50 \cdot 2,25 = 112,5\text{ (J)}$.
    * Với $I = 2\text{ A} \Rightarrow Q = 50 \cdot 2^2 = 50 \cdot 4 = 200\text{ (J)}$.
  
  * *Bảng kết quả hoàn thiện*:
    | $I\text{ (A)}$ | $1$ | $1,5$ | $2$ |
    | :--- | :---: | :---: | :---: |
    | **$Q\text{ (J)}$** | **$50$** | **$112,5$** | **$200$** |

* **b) Cường độ dòng điện là bao nhiêu Ampe để nhiệt lượng toả ra trên dây dẫn đạt $800\text{ J}$?**
  * *Lời giải*: Thay $Q = 800\text{ J}$ vào biểu thức $Q = 50I^2$:
    $$50I^2 = 800 \Leftrightarrow I^2 = \frac{800}{50} = 16$$
    Vì cường độ dòng điện là đại lượng không âm ($I > 0$), nên:
    $$I = \sqrt{16} = 4\text{ (A)}$$
  * *Kết luận*: Cường độ dòng điện phải bằng **$4\text{ Ampe}$** để nhiệt lượng tỏa ra đạt $800\text{ J}$.
