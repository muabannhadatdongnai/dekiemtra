# CHƯƠNG II: VECTƠ VÀ HỆ TRỤC TOẠ ĐỘ TRONG KHÔNG GIAN

## Bài 6. Vectơ trong không gian
### 1. Định nghĩa vectơ trong không gian
- **Vectơ trong không gian** là một đoạn thẳng có hướng.
- Kí hiệu: $\vec{AB}$ (với $A$ là điểm đầu, $B$ là điểm cuối) hoặc $\vec{a}, \vec{b}, \vec{x}, \vec{y}...$
- **Độ dài của vectơ** trong không gian là khoảng cách giữa điểm đầu và điểm cuối của vectơ đó. Kí hiệu là $|\vec{AB}|$ hoặc $|\vec{a}|$.
- **Đường thẳng** đi qua điểm đầu và điểm cuối của một vectơ được gọi là **giá của vectơ** đó.
- **Hai vectơ cùng phương** nếu giá của chúng song song hoặc trùng nhau.
- **Hai vectơ cùng hướng** hoặc **ngược hướng** nếu chúng cùng phương và có hướng cùng hoặc ngược nhau.
- **Hai vectơ bằng nhau** nếu chúng cùng hướng và có cùng độ dài. Kí hiệu $\vec{a} = \vec{b}$.
- **Vectơ-không** (kí hiệu là $\vec{0}$) là vectơ có điểm đầu và điểm cuối trùng nhau (ví dụ: $\vec{AA}, \vec{BB}$...). Quy ước vectơ-không có độ dài là 0, cùng hướng (và do đó cùng phương) với mọi vectơ.

### 2. Tổng và hiệu của hai vectơ trong không gian
- **Phép cộng vectơ**: Lấy một điểm $A$ bất kì, vẽ các vectơ $\vec{AB} = \vec{a}$, $\vec{BC} = \vec{b}$. Khi đó, vectơ $\vec{AC}$ được gọi là **tổng của hai vectơ** $\vec{a}$ và $\vec{b}$, kí hiệu là $\vec{a} + \vec{b}$.
- **Quy tắc hình bình hành**: Nếu $ABCD$ là hình bình hành thì $\vec{AB} + \vec{AD} = \vec{AC}$.
- **Quy tắc ba điểm**: Với ba điểm $A, B, C$ bất kì trong không gian, ta luôn có: $\vec{AB} + \vec{BC} = \vec{AC}$.
- **Tính chất phép cộng**:
  - Giao hoán: $\vec{a} + \vec{b} = \vec{b} + \vec{a}$
  - Kết hợp: $(\vec{a} + \vec{b}) + \vec{c} = \vec{a} + (\vec{b} + \vec{c})$
  - Cộng với vectơ-không: $\vec{a} + \vec{0} = \vec{0} + \vec{a} = \vec{a}$
- **Quy tắc hình hộp**: Cho hình hộp $ABCD.A'B'C'D'$. Khi đó, ta có:
  $$\vec{AB} + \vec{AD} + \vec{AA'} = \vec{AC'}$$
- **Hiệu của hai vectơ**: 
  - Vectơ có cùng độ dài và ngược hướng với vectơ $\vec{a}$ được gọi là **vectơ đối** của vectơ $\vec{a}$, kí hiệu là $-\vec{a}$.
  - Hiệu của hai vectơ $\vec{a}$ và $\vec{b}$ được định nghĩa là $\vec{a} - \vec{b} = \vec{a} + (-\vec{b})$.
  - Với ba điểm $O, A, B$ bất kì trong không gian, ta luôn có: $\vec{OB} - \vec{OA} = \vec{AB}$.

### 3. Tích của một số với một vectơ trong không gian
- Tích của một số thực $k \neq 0$ với một vectơ $\vec{a} \neq \vec{0}$ là một vectơ, kí hiệu là $k\vec{a}$, được xác định như sau:
  - Cùng hướng với vectơ $\vec{a}$ nếu $k > 0$; ngược hướng với vectơ $\vec{a}$ nếu $k < 0$.
  - Có độ dài bằng $|k| \cdot |\vec{a}|$.
- Quy ước: $0\vec{a} = \vec{0}$ và $k\vec{0} = \vec{0}$.
- Hai vectơ $\vec{a}$ và $\vec{b}$ ($\vec{b} \neq \vec{0}$) cùng phương khi và chỉ khi có một số thực $k$ sao cho $\vec{a} = k\vec{b}$.
- **Tính chất**: Với mọi số thực $h, k$ và mọi vectơ $\vec{a}, \vec{b}$, ta có:
  - $h(k\vec{a}) = (hk)\vec{a}$
  - $(h + k)\vec{a} = h\vec{a} + k\vec{a}$
  - $k(\vec{a} + \vec{b}) = k\vec{a} + k\vec{b}$
  - $1\vec{a} = \vec{a}$, $(-1)\vec{a} = -\vec{a}$

### 4. Tích vô hướng của hai vectơ trong không gian
- **Góc giữa hai vectơ trong không gian**:
  - Lấy một điểm $O$ bất kì và vẽ các vectơ $\vec{OA} = \vec{a}$, $\vec{OB} = \vec{b}$. Góc $\widehat{AOB}$ ($0^\circ \le \widehat{AOB} \le 180^\circ$) được gọi là **góc giữa hai vectơ $\vec{a}$ và $\vec{b}$**, kí hiệu là $(\vec{a}, \vec{b})$.
  - Quy ước: Góc giữa một vectơ bất kì và vectơ $\vec{0}$ có thể nhận một giá trị tuỳ ý từ $0^\circ$ đến $180^\circ$. Góc giữa hai vectơ cùng hướng là $0^\circ$.
  - Nếu $(\vec{a}, \vec{b}) = 90^\circ$ thì ta nói $\vec{a}$ và $\vec{b}$ vuông góc với nhau, kí hiệu $\vec{a} \perp \vec{b}$.
- **Tích vô hướng của hai vectơ trong không gian**:
  - Tích vô hướng của hai vectơ $\vec{a}$ và $\vec{b}$ khác $\vec{0}$ là một số, kí hiệu là $\vec{a} \cdot \vec{b}$, được xác định bởi công thức:
    $$\vec{a} \cdot \vec{b} = |\vec{a}| \cdot |\vec{b}| \cdot \cos(\vec{a}, \vec{b})$$
  - Quy ước: nếu $\vec{a} = \vec{0}$ hoặc $\vec{b} = \vec{0}$ thì $\vec{a} \cdot \vec{b} = 0$.
  - Lưu ý: $\vec{a}^2 = |\vec{a}|^2$.
  - Nếu $\vec{a}, \vec{b}$ là hai vectơ khác $\vec{0}$ thì $\cos(\vec{a}, \vec{b}) = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|}$.
- **Tính chất**: Tích vô hướng của hai vectơ trong không gian có các tính chất tương tự như trong mặt phẳng:
  - $\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$
  - $k(\vec{a} \cdot \vec{b}) = (k\vec{a}) \cdot \vec{b} = \vec{a} \cdot (k\vec{b})$
  - $\vec{a}(\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}$

---

## Bài 7. Hệ trục toạ độ trong không gian
### 1. Hệ trục toạ độ trong không gian
- **Hệ trục toạ độ Descartes vuông góc trong không gian** (hay gọi tắt là **hệ toạ độ $Oxyz$**) gồm ba trục toạ độ $Ox$ (trục hoành), $Oy$ (trục tung), $Oz$ (trục cao) vuông góc với nhau từng đôi một tại điểm gốc $O$.
- Gọi $\vec{i}, \vec{j}, \vec{k}$ lần lượt là các vectơ đơn vị trên các trục $Ox, Oy, Oz$. Ta có:
  - $|\vec{i}| = |\vec{j}| = |\vec{k}| = 1$
  - $\vec{i} \cdot \vec{j} = \vec{j} \cdot \vec{k} = \vec{k} \cdot \vec{i} = 0$
- Điểm $O$ gọi là **gốc toạ độ**.
- Các mặt phẳng toạ độ gồm: mặt phẳng $(Oxy)$ chứa hai trục $Ox, Oy$; mặt phẳng $(Oyz)$ chứa hai trục $Oy, Oz$; mặt phẳng $(Ozx)$ chứa hai trục $Oz, Ox$. Các mặt phẳng này đôi một vuông góc.

### 2. Toạ độ của điểm và toạ độ của vectơ trong không gian
- **Toạ độ của điểm**: 
  - Trong không gian $Oxyz$, mỗi điểm $M$ xác định duy nhất bộ ba số $(x; y; z)$ sao cho:
    $$\vec{OM} = x\vec{i} + y\vec{j} + z\vec{k}$$
  - Bộ ba số $(x; y; z)$ được gọi là **toạ độ của điểm $M$**, kí hiệu là $M(x; y; z)$ hoặc $M = (x; y; z)$.
  - Trong đó: $x$ là hoành độ, $y$ là tung độ, $z$ là cao độ của điểm $M$.
  - Đặc biệt: Gốc toạ độ có toạ độ là $O(0; 0; 0)$.
- **Hình chiếu của điểm lên các trục và mặt phẳng toạ độ**:
  Nếu điểm $M$ có toạ độ là $(x; y; z)$ thì:
  - Hình chiếu vuông góc của $M$ trên các trục $Ox, Oy, Oz$ lần lượt có toạ độ là $(x; 0; 0)$, $(0; y; 0)$, $(0; 0; z)$.
  - Hình chiếu vuông góc của $M$ trên các mặt phẳng toạ độ $(Oxy), (Oyz), (Ozx)$ lần lượt có toạ độ là $(x; y; 0)$, $(0; y; z)$, $(x; 0; z)$.
- **Toạ độ của vectơ**:
  - Trong không gian $Oxyz$, ta có toạ độ của vectơ $\vec{a}$ là bộ ba số $(x; y; z)$ sao cho:
    $$\vec{a} = x\vec{i} + y\vec{j} + z\vec{k}$$
  - Kí hiệu là $\vec{a} = (x; y; z)$ hoặc $\vec{a}(x; y; z)$.
  - Nhận xét: Toạ độ của điểm $M$ chính là toạ độ của vectơ $\vec{OM}$.
  - Các vectơ đơn vị có toạ độ là: $\vec{i} = (1; 0; 0)$, $\vec{j} = (0; 1; 0)$, $\vec{k} = (0; 0; 1)$.
- **Toạ độ của vectơ theo toạ độ hai đầu mút**:
  - Cho hai điểm $M(x_M; y_M; z_M)$ và $N(x_N; y_N; z_N)$. Khi đó:
    $$\vec{MN} = (x_N - x_M; y_N - y_M; z_N - z_M)$$

---

## Bài 8. Biểu thức toạ độ của các phép toán vectơ
Trong không gian $Oxyz$, cho hai vectơ $\vec{a} = (x; y; z)$ và $\vec{b} = (x'; y'; z')$. Ta có:

### 1. Biểu thức toạ độ của phép cộng, trừ hai vectơ và phép nhân số với vectơ
- **Phép cộng hai vectơ**:
  $$\vec{a} + \vec{b} = (x + x'; y + y'; z + z')$$
- **Phép trừ hai vectơ**:
  $$\vec{a} - \vec{b} = (x - x'; y - y'; z - z')$$
- **Phép nhân số với vectơ** (với $k$ là một số thực):
  $$k\vec{a} = (kx; ky; kz)$$
- **Vectơ đối**: $-\vec{a} = (-x; -y; -z)$
- **Hai vectơ bằng nhau**:
  $$\vec{a} = \vec{b} \Leftrightarrow \begin{cases} x = x' \\ y = y' \\ z = z' \end{cases}$$
- **Điều kiện cùng phương**:
  Vectơ $\vec{a}$ cùng phương với vectơ $\vec{b} \neq \vec{0}$ khi và chỉ khi tồn tại một số thực $k$ sao cho:
  $$\begin{cases} x = kx' \\ y = ky' \\ z = kz' \end{cases}$$

### 2. Toạ độ trung điểm đoạn thẳng và toạ độ trọng tâm tam giác
- **Toạ độ trung điểm đoạn thẳng**: Nếu $M$ là trung điểm của đoạn thẳng $AB$ với $A(x_A; y_A; z_A)$ và $B(x_B; y_B; z_B)$ thì:
  $$M\left(\frac{x_A + x_B}{2}; \frac{y_A + y_B}{2}; \frac{z_A + z_B}{2}\right)$$
- **Toạ độ trọng tâm tam giác**: Nếu $G$ là trọng tâm của tam giác $ABC$ thì:
  $$G\left(\frac{x_A + x_B + x_C}{3}; \frac{y_A + y_B + y_C}{3}; \frac{z_A + z_B + z_C}{3}\right)$$

### 3. Biểu thức toạ độ của tích vô hướng và các hệ quả
- **Tích vô hướng của hai vectơ**:
  $$\vec{a} \cdot \vec{b} = xx' + yy' + zz'$$
- **Hệ quả**:
  - **Hai vectơ vuông góc**:
    $$\vec{a} \perp \vec{b} \Leftrightarrow xx' + yy' + zz' = 0$$
  - **Độ dài của một vectơ**:
    $$|\vec{a}| = \sqrt{x^2 + y^2 + z^2}$$
  - **Khoảng cách giữa hai điểm** $A(x_A; y_A; z_A)$ và $B(x_B; y_B; z_B)$ chính là độ dài của vectơ $\vec{AB}$:
    $$AB = |\vec{AB}| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2 + (z_B - z_A)^2}$$
  - **Cosin góc giữa hai vectơ** khác $\vec{0}$:
    $$\cos(\vec{a}, \vec{b}) = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|} = \frac{xx' + yy' + zz'}{\sqrt{x^2 + y^2 + z^2} \cdot \sqrt{x'^2 + y'^2 + z'^2}}$$
