# CHƯƠNG II: PHƯƠNG TRÌNH VÀ BẤT PHƯƠNG TRÌNH BẬC NHẤT MỘT ẨN

Chương II hệ thống hóa kiến thức về phương trình quy về phương trình bậc nhất một ẩn (phương trình tích, phương trình chứa ẩn ở mẫu), các khái niệm về bất đẳng thức và bất phương trình bậc nhất một ẩn cùng các ứng dụng thực tế phong phú.

---

## BÀI 4: PHƯƠNG TRÌNH QUY VỀ PHƯƠNG TRÌNH BẬC NHẤT MỘT ẨN

### 1. Phương trình tích
* **Định nghĩa**: Phương trình tích là phương trình có dạng:
  $$(ax + b)(cx + d) = 0 \quad (a \neq 0, c \neq 0)$$
* **Cách giải**: Để giải phương trình tích, ta cho từng nhân tử bằng $0$:
  $$ax + b = 0 \quad \text{hoặc} \quad cx + d = 0$$
  Tập nghiệm của phương trình là tổng hợp tất cả các nghiệm của hai phương trình trên.

* **Ví dụ mẫu**:
  * **Ví dụ 1**: Giải phương trình $(2x + 1)(3x - 1) = 0$.
    * **Lời giải**:
      $$\begin{aligned}
      (2x + 1)(3x - 1) = 0 &\Leftrightarrow 2x + 1 = 0 \quad \text{hoặc} \quad 3x - 1 = 0 \\
      &\Leftrightarrow x = -\frac{1}{2} \quad \text{hoặc} \quad x = \frac{1}{3}
      \end{aligned}$$
      Vậy phương trình có tập nghiệm là $S = \left\{-\frac{1}{2}; \frac{1}{3}\right\}$.
  
  * **Ví dụ 2**: Giải phương trình $x^2 - x = -2x + 2$.
    * **Lời giải**:
      Đưa phương trình về dạng phương trình tích bằng cách chuyển vế và nhóm nhân tử chung:
      $$\begin{aligned}
      x^2 - x + 2x - 2 = 0 &\Leftrightarrow x(x - 1) + 2(x - 1) = 0 \\
      &\Leftrightarrow (x + 2)(x - 1) = 0
      \end{aligned}$$
      Giải hai trường hợp:
      1. $x + 2 = 0 \Leftrightarrow x = -2$.
      2. $x - 1 = 0 \Leftrightarrow x = 1$.
      Vậy tập nghiệm của phương trình là $S = \{-2; 1\}$.

---

### 2. Phương trình chứa ẩn ở mẫu
* **Điều kiện xác định (ĐKXĐ)**: Là điều kiện của ẩn để tất cả các mẫu thức trong phương trình khác $0$.
* **Quy trình giải gồm 4 bước**:
  1. **Bước 1**: Tìm điều kiện xác định (ĐKXĐ) của phương trình.
  2. **Bước 2**: Quy đồng mẫu thức hai vế của phương trình rồi khử mẫu.
  3. **Bước 3**: Giải phương trình vừa nhận được.
  4. **Bước 4 (Kết luận)**: Đối chiếu các giá trị tìm được ở Bước 3 với ĐKXĐ. Các giá trị thỏa mãn ĐKXĐ chính là nghiệm của phương trình ban đầu.

* **Ví dụ mẫu**:
  * **Ví dụ 3**: Tìm điều kiện xác định của phương trình $\frac{1}{x+1} = 1 + \frac{1}{x-2}$.
    * **Lời giải**: Phương trình có ẩn ở mẫu là $x+1$ và $x-2$. Do đó ĐKXĐ là:
      $$x+1 \neq 0 \quad \text{và} \quad x-2 \neq 0 \Leftrightarrow x \neq -1 \quad \text{và} \quad x \neq 2$$

  * **Ví dụ 4**: Giải phương trình $\frac{2}{x+1} + \frac{1}{x-2} = \frac{3}{(x+1)(x-2)}$.
    * **Lời giải**:
      * *ĐKXĐ*: $x \neq -1$ và $x \neq 2$.
      * *Quy đồng và khử mẫu*:
        $$\frac{2(x-2) + (x+1)}{(x+1)(x-2)} = \frac{3}{(x+1)(x-2)}$$
        Khử mẫu ta được:
        $$2(x-2) + x + 1 = 3$$
      * *Giải phương trình*:
        $$2x - 4 + x + 1 = 3 \Leftrightarrow 3x - 3 = 3 \Leftrightarrow 3x = 6 \Leftrightarrow x = 2$$
      * *Kết luận*: Đối chiếu với ĐKXĐ ($x \neq 2$), giá trị $x = 2$ bị loại.
        Vậy phương trình đã cho vô nghiệm.

---

## BÀI 5: BẤT ĐẦNG THỨC VÀ TÍNH CHẤT

### 1. Khái niệm Bất đẳng thức
* **Định nghĩa**: Hệ thức dạng $a > b$ (hoặc $a < b, a \ge b, a \le b$) được gọi là bất đẳng thức. Trong đó $a$ là vế trái, $b$ là vế phải.
* **Ví dụ**: Nhiệt độ $t$ ở Tokyo trên $-5^\circ\text{C}$ được viết dưới dạng bất đẳng thức là $t > -5$.

### 2. Tính chất của Bất đẳng thức
* **Tính chất bắc cầu**: 
  $$\text{Nếu } a < b \text{ và } b < c \text{ thì } a < c$$
* **Liên hệ giữa thứ tự và phép cộng**: Khi cộng cùng một số vào hai vế của bất đẳng thức, ta được bất đẳng thức mới **cùng chiều**:
  $$\text{Nếu } a < b \text{ thì } a + c < b + c$$
* **Liên hệ giữa thứ tự và phép nhân**:
  * **Nhân với số dương ($c > 0$)**: Ta được bất đẳng thức mới **cùng chiều**:
    $$\text{Nếu } a < b \text{ và } c > 0 \text{ thì } ac < bc$$
  * **Nhân với số âm ($c < 0$)**: Ta được bất đẳng thức mới **ngược chiều**:
    $$\text{Nếu } a < b \text{ và } c < 0 \text{ thì } ac > bc$$

* **Ví dụ minh họa**:
  * **Ví dụ 5**: Cho $a < b$, chứng minh $2a + 1 < 2b + 2$.
    * **Lời giải**:
      Vì $a < b$, nhân cả hai vế với số dương $2$, ta có:
      $$2a < 2b \quad (1)$$
      Cộng $1$ vào hai vế của bất đẳng thức (1):
      $$2a + 1 < 2b + 1 \quad (2)$$
      Mà ta luôn có $1 < 2 \Leftrightarrow 2b + 1 < 2b + 2 \quad (3)$.
      Từ (2) và (3), theo tính chất bắc cầu suy ra:
      $$2a + 1 < 2b + 2 \quad (\text{đpcm})$$

---

## BÀI 6: BẤT PHƯƠNG TRÌNH BẬC NHẤT MỘT ẨN

### 1. Khái niệm và Nghiệm
* **Bất phương trình bậc nhất một ẩn** là bất phương trình có dạng:
  $$ax + b < 0 \quad (\text{hoặc } ax+b>0, ax+b \le 0, ax+b \ge 0) \quad \text{với } a \neq 0$$
* **Nghiệm**: Giá trị $x_0$ là nghiệm của bất phương trình nếu thay $x = x_0$ vào bất phương trình ta được một khẳng định đúng.
* **Ví dụ**: Số $x = 3$ là nghiệm của bất phương trình $3x + 8 < 20$ vì $3(3) + 8 = 17 < 20$ (đúng).

### 2. Phương pháp giải bất phương trình bậc nhất một ẩn
Giải bất phương trình $ax + b < 0$ ($a \neq 0$):
* **Bước 1**: Chuyển hạng tử tự do sang vế phải: $ax < -b$.
* **Bước 2**: Chia cả hai vế cho hệ số $a$:
  * Nếu $a > 0$ (giữ nguyên chiều): $x < -\frac{b}{a}$.
  * Nếu $a < 0$ (đổi chiều): $x > -\frac{b}{a}$.

* **Ví dụ mẫu**:
  * **Ví dụ 6**: Giải bất phương trình $-2x - 4 > 0$.
    * **Lời giải**:
      $$-2x - 4 > 0 \Leftrightarrow -2x > 4$$
      Chia hai vế cho số âm $-2$ và đổi chiều bất phương trình:
      $$x < \frac{4}{-2} \Leftrightarrow x < -2$$
      Vậy tập nghiệm của bất phương trình là $\{x \mid x < -2\}$.

  * **Ví dụ 7**: Giải bất phương trình $2x + 5 < 3x - 4$.
    * **Lời giải**:
      $$\begin{aligned}
      2x + 5 < 3x - 4 &\Leftrightarrow 2x - 3x < -4 - 5 \\
      &\Leftrightarrow -x < -9 \\
      &\Leftrightarrow x > 9
      \end{aligned}$$
      Vậy tập nghiệm của bất phương trình là $\{x \mid x > 9\}$.

---

## BÀI TẬP CUỐI CHƯƠNG II (ĐỀ BÀI & LỜI GIẢI CHI TIẾT)

### PHẦN A: TRẮC NGHIỆM KHÁCH QUAN

**Bài 2.21**: Nghiệm của bất phương trình $-2x + 1 < 0$ là:
* A. $x < \frac{1}{2}$
* B. $x > \frac{1}{2}$
* C. $x \le \frac{1}{2}$
* D. $x \ge \frac{1}{2}$
* **Đáp án chọn**: **B**
* *Giải thích chi tiết*: $-2x + 1 < 0 \Leftrightarrow -2x < -1 \Leftrightarrow x > \frac{1}{2}$ (vì chia cho số âm $-2$ nên đổi chiều).

**Bài 2.22**: Điều kiện xác định của phương trình $\frac{x}{2x+1} + \frac{3}{x-5} = \frac{x}{(2x+1)(x-5)}$ là:
* A. $x \neq \frac{1}{2}$
* B. $x \neq -\frac{1}{2}$ và $x \neq 5$
* C. $x \neq 5$
* D. $x \neq -\frac{1}{2}$ và $x \neq 5$
* **Đáp án chọn**: **B** (hoặc D nếu hai đáp án trùng nhau trong sách)
* *Giải thích chi tiết*: Mẫu thức phải khác $0$, tức là $2x+1 \neq 0 \Leftrightarrow x \neq -\frac{1}{2}$ và $x-5 \neq 0 \Leftrightarrow x \neq 5$.

**Bài 2.23**: Phương trình $x - 1 = m + 4$ có nghiệm lớn hơn $1$ khi $m$ thỏa mãn:
* A. $m \ge -4$
* B. $m \le 4$
* C. $m > -4$
* D. $m < -4$
* **Đáp án chọn**: **C**
* *Giải thích chi tiết*: Ta giải tìm nghiệm $x$: $x - 1 = m + 4 \Leftrightarrow x = m + 5$. Để nghiệm lớn hơn $1$:
  $$x > 1 \Leftrightarrow m + 5 > 1 \Leftrightarrow m > -4$$

**Bài 2.24**: Nghiệm của bất phương trình $1 - 2x \ge 2 - x$ là:
* A. $x > \frac{1}{2}$
* B. $x < \frac{1}{2}$
* C. $x \le -1$
* D. $x \ge -1$
* **Đáp án chọn**: **C**
* *Giải thích chi tiết*:
  $$1 - 2x \ge 2 - x \Leftrightarrow -2x + x \ge 2 - 1 \Leftrightarrow -x \ge 1 \Leftrightarrow x \le -1$$

**Bài 2.25**: Cho $a > b$. Khi đó ta có:
* A. $2a > 3b$
* B. $2a > 2b + 1$
* C. $5a + 1 > 5b + 1$
* D. $-3a < -3b - 3$
* **Đáp án chọn**: **C**
* *Giải thích chi tiết*: Nhân cả hai vế của $a > b$ với số dương $5$ ta được $5a > 5b$. Cộng thêm $1$ vào hai vế ta được $5a + 1 > 5b + 1$.

---

### PHẦN B: TỰ LUẬN RÈN LUYỆN

#### 1. Dạng phương trình quy về bậc nhất một ẩn
**Bài 2.26**: Giải các phương trình sau:
* **a)** $(3x - 1)^2 - (x + 2)^2 = 0$
  * *Lời giải*: Sử dụng hằng đẳng thức hiệu hai bình phương $A^2 - B^2 = (A-B)(A+B)$:
    $$\begin{aligned}
    [(3x-1) - (x+2)][(3x-1) + (x+2)] = 0 &\Leftrightarrow (3x - 1 - x - 2)(3x - 1 + x + 2) = 0 \\
    &\Leftrightarrow (2x - 3)(4x + 1) = 0
    \end{aligned}$$
    Giải hai trường hợp:
    * $2x - 3 = 0 \Leftrightarrow x = \frac{3}{2}$
    * $4x + 1 = 0 \Leftrightarrow x = -\frac{1}{4}$
    Vậy phương trình có hai nghiệm $x = \frac{3}{2}$ và $x = -\frac{1}{4}$.

* **b)** $x(x + 1) = 2(x^2 - 1)$
  * *Lời giải*:
    $$\begin{aligned}
    x(x + 1) - 2(x^2 - 1) = 0 &\Leftrightarrow x(x + 1) - 2(x - 1)(x + 1) = 0 \\
    &\Leftrightarrow (x + 1)[x - 2(x - 1)] = 0 \\
    &\Leftrightarrow (x + 1)(x - 2x + 2) = 0 \\
    &\Leftrightarrow (x + 1)(2 - x) = 0
    \end{aligned}$$
    Giải phương trình tích ta được: $x = -1$ hoặc $x = 2$.
    Vậy tập nghiệm của phương trình là $S = \{-1; 2\}$.

**Bài 2.27**: Giải các phương trình chứa ẩn ở mẫu sau:
* **a)** $\frac{x}{x-5} - \frac{2}{x+5} = \frac{x^2}{x^2-25}$
  * *Lời giải*:
    * ĐKXĐ: $x \neq 5$ và $x \neq -5$.
    * Quy đồng mẫu thức mẫu chung là $(x-5)(x+5) = x^2-25$:
      $$\frac{x(x+5) - 2(x-5)}{(x-5)(x+5)} = \frac{x^2}{(x-5)(x+5)}$$
      Khử mẫu ta được:
      $$x^2 + 5x - 2x + 10 = x^2 \Leftrightarrow 3x + 10 = 0 \Leftrightarrow x = -\frac{10}{3}$$
      Đối chiếu ĐKXĐ: Giá trị $x = -\frac{10}{3}$ thỏa mãn.
      Vậy tập nghiệm là $S = \left\{-\frac{10}{3}\right\}$.

---

#### 2. Dạng chứng minh và giải bất phương trình bậc nhất
**Bài 2.28**: Cho $a < b$, hãy so sánh:
* **a)** $a + b + 5$ với $2b + 5$
  * *Lời giải*: Từ giả thiết $a < b$, cộng cả hai vế với $b + 5$:
    $$a + b + 5 < b + b + 5 \Leftrightarrow a + b + 5 < 2b + 5$$
* **b)** $-2a - 3$ với $-2b - 3$
  * *Lời giải*: Từ giả thiết $a < b$, nhân cả hai vế với số âm $-2$ và đổi chiều:
    $$-2a > -2b$$
    Cộng $-3$ vào hai vế ta được:
    $$-2a - 3 > -2b - 3$$

**Bài 2.29**: Giải các bất phương trình sau:
* **a)** $2x + 3(x+1) > 5x - (2x-4)$
  * *Lời giải*:
    $$\begin{aligned}
    2x + 3x + 3 > 5x - 2x + 4 &\Leftrightarrow 5x + 3 > 3x + 4 \\
    &\Leftrightarrow 5x - 3x > 4 - 3 \\
    &\Leftrightarrow 2x > 1 \\
    &\Leftrightarrow x > \frac{1}{2}$
    \end{aligned}$$
    Vậy nghiệm của bất phương trình là $x > \frac{1}{2}$.

* **b)** $(x+1)(2x-1) < 2x^2 - 4x + 1$
  * *Lời giải*:
    $$\begin{aligned}
    2x^2 - x + 2x - 1 < 2x^2 - 4x + 1 &\Leftrightarrow 2x^2 + x - 1 < 2x^2 - 4x + 1 \\
    &\Leftrightarrow x + 4x < 1 + 1 \\
    &\Leftrightarrow 5x < 2 \\
    &\Leftrightarrow x < \frac{2}{5}
    \end{aligned}$$
    Vậy nghiệm của bất phương trình là $x < \frac{2}{5}$.

---

#### 3. Ứng dụng thực tế của bất phương trình
**Bài 2.18 (Lãi suất gửi tiết kiệm)**: Một ngân hàng đang áp dụng lãi suất gửi tiết kiệm kì hạn 1 tháng là $0.4\%$/tháng. Hỏi nếu muốn có số tiền lãi hằng tháng ít nhất là 3 triệu đồng thì số tiền gửi tiết kiệm ít nhất là bao nhiêu (làm tròn đến triệu đồng)?
* *Lời giải*:
  Gọi $x$ là số tiền gửi tiết kiệm ít nhất (triệu đồng), điều kiện $x > 0$.
  Lãi suất nhận được hằng tháng là:
  $$T_{\text{lãi}} = x \cdot 0.4\% = 0.004x \quad (\text{triệu đồng})$$
  Để số tiền lãi hằng tháng ít nhất là 3 triệu đồng, ta có bất phương trình:
  $$0.004x \ge 3 \Leftrightarrow x \ge \frac{3}{0.004} \Leftrightarrow x \ge 750$$
  Vậy hành khách cần gửi ít nhất **750 triệu đồng**.

**Bài 2.19 (Tính quãng đường taxi di chuyển)**: Một hãng taxi có giá mở cửa là 15 nghìn đồng và giá 12 nghìn đồng cho mỗi kilômét tiếp theo. Hỏi với 200 nghìn đồng thì hành khách có thể di chuyển được tối đa bao nhiêu kilômét (làm tròn đến hàng đơn vị)?
* *Lời giải*:
  Gọi $d$ là tổng số kilômét hành khách di chuyển ($d \ge 1$, đơn vị: km).
  * Chi phí cho kilômét đầu tiên (giá mở cửa) là: $15$ nghìn đồng.
  * Chi phí cho $d - 1$ kilômét tiếp theo là: $12(d - 1)$ nghìn đồng.
  Tổng số tiền phải trả là:
  $$T = 15 + 12(d - 1) \quad (\text{nghìn đồng})$$
  Vì hành khách chỉ có tối đa 200 nghìn đồng, ta có bất phương trình:
  $$15 + 12(d - 1) \le 200$$
  Giải bất phương trình:
  $$12(d - 1) \le 185 \Leftrightarrow d - 1 \le \frac{185}{12} \approx 15.42 \Leftrightarrow d \le 16.42$$
  Vì quãng đường làm tròn đến hàng đơn vị, hành khách có thể di chuyển được tối đa **16 km**.
