# CHƯƠNG I. ỨNG DỤNG ĐẠO HÀM ĐỂ KHẢO SÁT VÀ VẼ ĐỒ THỊ HÀM SỐ

## MỤC LỤC CHƯƠNG I [4]
1. **Bài 1. Tính đơn điệu và cực trị của hàm số** (Trang 5)
2. **Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số** (Trang 15)
3. **Bài 3. Đường tiệm cận của đồ thị hàm số** (Trang 20)
4. **Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số** (Trang 26)
5. **Bài 5. Ứng dụng đạo hàm để giải quyết một số vấn đề liên quan đến thực tiễn** (Trang 33)

---

## BÀI 1. TÍNH ĐƠN ĐIỆU VÀ CỰC TRỊ CỦA HÀM SỐ

### I. Tính đơn điệu của hàm số
#### 1. Định nghĩa [6]
Cho hàm số $y = f(x)$ xác định trên khoảng $K$.
- Hàm số $y = f(x)$ được gọi là **đồng biến** trên $K$ nếu $\forall x_1, x_2 \in K$, $x_1 < x_2 \Rightarrow f(x_1) < f(x_2)$. (Đồ thị đi lên từ trái sang phải [6]).
- Hàm số $y = f(x)$ được gọi là **nghịch biến** trên $K$ nếu $\forall x_1, x_2 \in K$, $x_1 < x_2 \Rightarrow f(x_1) > f(x_2)$. (Đồ thị đi xuống từ trái sang phải [6]).

Hàm số đồng biến hoặc nghịch biến trên $K$ được gọi chung là **đơn điệu** trên $K$ [6].

#### 2. Mối quan hệ giữa tính đơn điệu và dấu của đạo hàm [7]
Cho hàm số $y = f(x)$ có đạo hàm trên khoảng $K$.
- Nếu $f'(x) > 0$ với mọi $x \in K$ thì hàm số $f(x)$ **đồng biến** trên khoảng $K$ [7].
- Nếu $f'(x) < 0$ với mọi $x \in K$ thì hàm số $f(x)$ **nghịch biến** trên khoảng $K$ [7].

*Chú ý:*
Nếu $f'(x) \ge 0$ (hoặc $f'(x) \le 0$) với mọi $x \in K$ và $f'(x) = 0$ chỉ tại một số hữu hạn điểm thì hàm số đồng biến (hoặc nghịch biến) trên khoảng $K$ [7].

#### 3. Quy tắc xét tính đơn điệu của hàm số [8]
1. Tìm tập xác định của hàm số [8].
2. Tính đạo hàm $f'(x)$. Tìm các điểm $x_i$ ($i = 1, 2, \dots$) tại đó đạo hàm $f'(x) = 0$ hoặc không xác định [8].
3. Sắp xếp các điểm $x_i$ theo thứ tự tăng dần và lập bảng biến thiên của hàm số [8].
4. Nêu kết luận về khoảng đồng biến, nghịch biến của hàm số [8].

---

### II. Cực trị của hàm số
#### 1. Khái niệm cực đại, cực tiểu [9]
Cho hàm số $y = f(x)$ xác định và liên tục trên khoảng $(a;b)$ chứa điểm $x_0$.
- Nếu tồn tại một khoảng $(x_0 - h; x_0 + h) \subset (a;b)$ ($h > 0$) sao cho $f(x) < f(x_0)$ với mọi $x \in (x_0 - h; x_0 + h)$ và $x \neq x_0$, thì $x_0$ được gọi là **điểm cực đại** của hàm số, và $f(x_0)$ là **giá trị cực đại** (hoặc cực đại) của hàm số, kí hiệu là $y_{CĐ}$ hoặc $f_{CĐ}$ [9].
- Nếu tồn tại một khoảng $(x_0 - h; x_0 + h) \subset (a;b)$ ($h > 0$) sao cho $f(x) > f(x_0)$ với mọi $x \in (x_0 - h; x_0 + h)$ and $x \neq x_0$, thì $x_0$ được gọi là **điểm cực tiểu** của hàm số, và $f(x_0)$ là **giá trị cực tiểu** (hoặc cực tiểu) của hàm số, kí hiệu là $y_{CT}$ hoặc $f_{CT}$ [9].

Các điểm cực đại và cực tiểu được gọi chung là **điểm cực trị** của hàm số; giá trị cực đại và cực tiểu được gọi chung là **cực trị** của hàm số [9].

#### 2. Điều kiện đủ để hàm số có cực trị [10, 11]
Cho hàm số $y = f(x)$ liên tục trên khoảng $(a;b)$ chứa điểm $x_0$ và có đạo hàm trên các khoảng $(a;x_0)$ và $(x_0;b)$ [10].
- Nếu $f'(x) < 0$ trên $(a; x_0)$ và $f'(x) > 0$ trên $(x_0; b)$ thì $x_0$ là một **điểm cực tiểu** [10]. (Đạo hàm đổi dấu từ âm sang dương khi qua $x_0$ [11]).
- Nếu $f'(x) > 0$ trên $(a; x_0)$ và $f'(x) < 0$ trên $(x_0; b)$ thì $x_0$ là một **điểm cực đại** [10]. (Đạo hàm đổi dấu từ dương sang âm khi qua $x_0$ [11]).

*Chú ý:* Nếu $f'(x_0) = 0$ nhưng không đổi dấu khi qua $x_0$ thì $x_0$ không phải là điểm cực trị của hàm số [11].

---

## BÀI 2. GIÁ TRỊ LỚN NHẤT VÀ GIÁ TRỊ NHỎ NHẤT CỦA HÀM SỐ

### I. Định nghĩa [15]
Cho hàm số $y = f(x)$ xác định trên tập $D$.
- Số $M$ được gọi là **giá trị lớn nhất** của hàm số $y = f(x)$ trên tập $D$ nếu $f(x) \le M$ với mọi $x \in D$ và tồn tại $x_0 \in D$ sao cho $f(x_0) = M$ [15]. Kí hiệu: $M = \max_{x \in D} f(x)$ [15].
- Số $m$ được gọi là **giá trị nhỏ nhất** của hàm số $y = f(x)$ trên tập $D$ nếu $f(x) \ge m$ với mọi $x \in D$ và tồn tại $x_0 \in D$ sao cho $f(x_0) = m$ [15]. Kí hiệu: $m = \min_{x \in D} f(x)$ [15].

### II. Cách tìm giá trị lớn nhất, giá trị nhỏ nhất của hàm số liên tục trên một đoạn [17, 18]
Để tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $y = f(x)$ liên tục trên đoạn $[a;b]$:
1. Tìm các điểm $x_1, x_2, \dots, x_n \in (a; b)$ tại đó $f'(x) = 0$ hoặc không tồn tại [18].
2. Tính các giá trị $f(x_1), f(x_2), \dots, f(x_n)$, $f(a)$ và $f(b)$ [18].
3. Tìm số lớn nhất $M$ và số nhỏ nhất $m$ trong các số trên [18]. Ta có:
   $$M = \max_{[a;b]} f(x); \quad m = \min_{[a;b]} f(x)$$ [18].

---

## BÀI 3. ĐƯỜNG TIỆM CẬN CỦA ĐỒ THỊ HÀM SỐ

### I. Đường tiệm cận ngang [20]
Đường thẳng $y = y_0$ được gọi là **đường tiệm cận ngang** (gọi tắt là tiệm cận ngang) của đồ thị hàm số $y = f(x)$ nếu:
$$\lim_{x \to +\infty} f(x) = y_0 \quad \text{hoặc} \quad \lim_{x \to -\infty} f(x) = y_0$$ [20].

### II. Đường tiệm cận đứng [21]
Đường thẳng $x = x_0$ được gọi là **đường tiệm cận đứng** (gọi tắt là tiệm cận đứng) của đồ thị hàm số $y = f(x)$ nếu ít nhất một trong các điều kiện sau được thỏa mãn:
$$\lim_{x \to x_0^+} f(x) = +\infty, \quad \lim_{x \to x_0^-} f(x) = +\infty, \quad \lim_{x \to x_0^+} f(x) = -\infty, \quad \lim_{x \to x_0^-} f(x) = -\infty$$ [21].

### III. Đường tiệm cận xiên [23, 24]
Đường thẳng $y = ax + b$ ($a \neq 0$) được gọi là **đường tiệm cận xiên** (gọi tắt là tiệm cận xiên) của đồ thị hàm số $y = f(x)$ nếu:
$$\lim_{x \to +\infty} [f(x) - (ax + b)] = 0 \quad \text{hoặc} \quad \lim_{x \to -\infty} [f(x) - (ax + b)] = 0$$ [23].

#### Công thức tìm các hệ số $a$ và $b$ [24]:
$$a = \lim_{x \to \pm\infty} \frac{f(x)}{x}$$
$$b = \lim_{x \to \pm\infty} [f(x) - ax]$$
(Nếu giới hạn tồn tại và $a \neq 0$ [24]).

---

## BÀI 4. KHẢO SÁT SỰ BIẾN THIÊN VÀ VẼ ĐỒ THỊ CỦA HÀM SỐ

### Sơ đồ khảo sát hàm số [26]
Để khảo sát sự biến thiên và vẽ đồ thị của hàm số $y = f(x)$, ta thực hiện theo các bước sau:

1. **Tìm tập xác định** của hàm số [26].
2. **Khảo sát sự biến thiên của hàm số** [26]:
   - Tính đạo hàm $f'(x)$. Tìm các điểm tại đó $f'(x) = 0$ hoặc đạo hàm không tồn tại [26].
   - Xét dấu đạo hàm $f'(x)$ để chỉ ra các khoảng đơn điệu và cực trị của hàm số [26].
   - Tìm các giới hạn tại vô cực, giới hạn vô cực và tìm các đường tiệm cận của đồ thị hàm số (nếu có) [26].
   - Lập bảng biến thiên của hàm số [26].
3. **Vẽ đồ thị của hàm số** [26]:
   - Xác định các điểm đặc biệt của đồ thị (giao điểm với các trục tọa độ, các điểm cực trị,...) [27].
   - Vẽ các đường tiệm cận (nếu có) [31].
   - Vẽ đồ thị hàm số dựa vào bảng biến thiên và các điểm đã xác định [26].

### Các dạng đồ thị hàm số thường gặp [27, 28, 30]
1. **Hàm số đa thức bậc ba:** $y = ax^3 + bx^2 + cx + d$ ($a \neq 0$) [27].
2. **Hàm số phân thức hữu tỉ đơn giản:**
   - Hàm số bậc nhất trên bậc nhất: $y = \frac{ax + b}{cx + d}$ ($c \neq 0, ad - bc \neq 0$) [28].
   - Hàm số bậc hai trên bậc nhất: $y = \frac{ax^2 + bx + c}{px + q}$ ($a \neq 0, p \neq 0$, đa thức tử không chia hết cho đa thức mẫu) [30].

---

## BÀI 5. ỨNG DỤNG ĐẠO HÀM ĐỂ GIẢI QUYẾT MỘT SỐ VẤN ĐỀ THỰC TIỄN

### I. Tốc độ thay đổi của một đại lượng [33]
Nếu đại lượng $y$ là một hàm số của đại lượng $x$ ($y = f(x)$), thì tỉ số $\frac{\Delta y}{\Delta x} = \frac{f(x_2) - f(x_1)}{x_2 - x_1}$ là tốc độ thay đổi trung bình của $y$ đối với $x$ trên đoạn $[x_1; x_2]$ [33].
Tốc độ thay đổi tức thời của $y$ đối với $x$ tại điểm $x_1$ là:
$$\lim_{\Delta x \to 0} \frac{\Delta y}{\Delta x} = f'(x_1)$$ [33].

*Ứng dụng trong Vật lí, Hóa học và Kinh tế:*
- Tốc độ tức thời của chuyển động $s(t)$ tại thời điểm $t$ là vận tốc $v(t) = s'(t)$ [33].
- Gia tốc tức thời của chuyển động $s(t)$ tại thời điểm $t$ là gia tốc $a(t) = v'(t) = s''(t)$ [33].
- Chi phí biên $C'(x)$ là chi phí để sản xuất thêm 1 đơn vị hàng hóa tiếp theo [34, 35].
- Doanh thu biên $R'(x)$ và lợi nhuận biên $P'(x)$ [38].

### II. Các bài toán tối ưu hóa đơn giản [36]
Quy trình giải một bài toán tối ưu hóa:
- **Bước 1.** Xác định đại lượng $Q$ mà ta cần làm cho giá trị của đại lượng ấy lớn nhất hoặc nhỏ nhất và biểu diễn nó qua các đại lượng khác trong bài toán [36].
- **Bước 2.** Chọn một đại lượng thích hợp nào đó, kí hiệu là $x$, và biểu diễn các đại lượng khác ở Bước 1 theo $x$. Khi đó, đại lượng $Q$ sẽ là hàm số của một biến $x$: $Q = Q(x)$. Tìm tập xác định của hàm số $Q = Q(x)$ [37].
- **Bước 3.** Tìm giá trị lớn nhất hoặc giá trị nhỏ nhất của hàm số $Q = Q(x)$ bằng các phương pháp đã biết và kết luận [37].
