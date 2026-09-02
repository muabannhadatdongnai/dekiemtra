# CHƯƠNG IV: VECTƠ

Chương này cung cấp các khái niệm nền tảng về vectơ, các phép toán trên vectơ trong mặt phẳng và hệ tọa độ, giúp học sinh giải quyết các bài toán hình học và các ứng dụng thực tế trong vật lí [45, 46].

---

## BÀI 7: CÁC KHÁI NIỆM MỞ ĐẦU

### 1. Định nghĩa vectơ và độ dài của vectơ

*   **Định nghĩa**: **Vectơ** là một đoạn thẳng có hướng, nghĩa là trong hai điểm mút của đoạn thẳng đã chỉ rõ điểm đầu và điểm cuối [46].
    *   Vectơ có điểm đầu là $A$ và điểm cuối là $B$ được kí hiệu là $\overrightarrow{AB}$ (đọc là "vectơ AB") [46].
    *   Vectơ còn có thể kí hiệu ngắn gọn là $\vec{a}, \vec{b}, \vec{x}, \vec{y}, ...$ [46].
*   **Độ dài của vectơ**: Là khoảng cách giữa điểm đầu và điểm cuối của vectơ đó [46].
    *   Độ dài của vectơ $\overrightarrow{AB}$ được kí hiệu là $|\overrightarrow{AB}|$, nghĩa là $|\overrightarrow{AB}| = AB$ [46].
    *   Độ dài của vectơ $\vec{a}$ được kí hiệu là $|\vec{a}|$ [46].

### 2. Hai vectơ cùng phương, cùng hướng, bằng nhau

#### a) Giá và phương của vectơ
*   **Giá của vectơ**: Đường thẳng đi qua điểm đầu và điểm cuối của một vectơ được gọi là **giá** của vectơ đó [47].
*   **Vectơ cùng phương**: Hai vectơ được gọi là **cùng phương** nếu giá của chúng song song hoặc trùng nhau [47].
    *   *Hệ quả*: Hai vectơ cùng phương chỉ có thể **cùng hướng** hoặc **ngược hướng** [47].

#### b) Hai vectơ bằng nhau
*   **Định nghĩa**: Hai vectơ $\vec{a}$ và $\vec{b}$ được gọi là **bằng nhau** nếu chúng có cùng độ dài và cùng hướng. Kí hiệu là $\vec{a} = \vec{b}$ [47].
*   *Lưu ý*: Khi cho trước một điểm $O$ và một vectơ $\vec{a}$, luôn có duy nhất một điểm $A$ sao cho $\overrightarrow{OA} = \vec{a}$ [47].

#### c) Vectơ-không
*   **Định nghĩa**: Vectơ-không là vectơ có điểm đầu và điểm cuối trùng nhau [47]. Kí hiệu là $\vec{0}$ (ví dụ: $\overrightarrow{AA}, \overrightarrow{BB}, ...$) [47, 48].
*   **Tính chất**:
    *   Độ dài của vectơ-không bằng 0, tức là $|\vec{0}| = 0$ [47].
    *   Quy ước: Vectơ $\vec{0}$ cùng phương và cùng hướng với mọi vectơ [47, 48].

---

## BÀI 8: TỔNG VÀ HIỆU CỦA HAI VECTƠ

### 1. Tổng của hai vectơ

*   **Định nghĩa**: Cho hai vectơ $\vec{a}$ và $\vec{b}$. Lấy một điểm $A$ tùy ý, vẽ $\overrightarrow{AB} = \vec{a}$ và $\overrightarrow{BC} = \vec{b}$. Vectơ $\overrightarrow{AC}$ được gọi là **tổng** của hai vectơ $\vec{a}$ và $\vec{b}$. Kí hiệu là $\vec{a} + \vec{b}$ [51].
*   **Quy tắc ba điểm**: Với ba điểm $A, B, C$ bất kì, ta luôn có:
    $$\overrightarrow{AB} + \overrightarrow{BC} = \overrightarrow{AC}$$ [51, 52]
*   **Quy tắc hình bình hành**: Nếu $ABCD$ là một hình bình hành, ta luôn có:
    $$\overrightarrow{AB} + \overrightarrow{AD} = \overrightarrow{AC}$$ [51, 52]
*   **Tính chất của phép cộng vectơ**: Với ba vectơ $\vec{a}, \vec{b}, \vec{c}$ tùy ý, ta có:
    *   Tính chất giao hoán: $\vec{a} + \vec{b} = \vec{b} + \vec{a}$ [51, 52].
    *   Tính chất kết hợp: $(\vec{a} + \vec{b}) + \vec{c} = \vec{a} + (\vec{b} + \vec{c})$ [51, 52].
    *   Cộng với vectơ-không: $\vec{a} + \vec{0} = \vec{0} + \vec{a} = \vec{a}$ [51, 52].

### 2. Hiệu của hai vectơ

*   **Vectơ đối**: Vectơ có cùng độ dài nhưng ngược hướng với vectơ $\vec{a}$ được gọi là **vectơ đối** của $\vec{a}$, kí hiệu là $-\vec{a}$ [51, 52].
    *   $\vec{a} + (-\vec{a}) = \vec{0}$ [52].
    *   Vectơ đối của $\vec{0}$ là chính nó, tức là $-\vec{0} = \vec{0}$ [52].
*   **Phép trừ vectơ**: Hiệu của hai vectơ $\vec{a}$ và $\vec{b}$ là tổng của $\vec{a}$ với vectơ đối của $\vec{b}$:
    $$\vec{a} - \vec{b} = \vec{a} + (-\vec{b})$$ [52]
*   **Quy tắc hiệu (Quy tắc ba điểm đối với phép trừ)**: Với ba điểm $O, A, B$ bất kì, ta luôn có:
    $$\overrightarrow{AB} = \overrightarrow{OB} - \overrightarrow{OA}$$ [52]

### 3. Tính chất trung điểm và trọng tâm

*   **Tính chất trung điểm**: Điểm $I$ là trung điểm của đoạn thẳng $AB$ khi và chỉ khi:
    $$\overrightarrow{IA} + \overrightarrow{IB} = \vec{0}$$ [52]
*   **Tính chất trọng tâm**: Điểm $G$ là trọng tâm của tam giác $ABC$ khi và chỉ khi:
    $$\overrightarrow{GA} + \overrightarrow{GB} + \overrightarrow{GC} = \vec{0}$$ [52]

---

## BÀI 9: TÍCH CỦA MỘT VECTƠ VỚI MỘT SỐ

### 1. Định nghĩa và tính chất

*   **Định nghĩa**: Tích của một vectơ $\vec{a} \neq \vec{0}$ với một số thực $k \neq 0$ là một vectơ, kí hiệu là $k\vec{a}$, được xác định như sau [55]:
    *   Độ dài: $|k\vec{a}| = |k| \cdot |\vec{a}|$ [55].
    *   Hướng: Cùng hướng với $\vec{a}$ nếu $k > 0$, ngược hướng với $\vec{a}$ nếu $k < 0$ [55].
    *   *Quy ước*: $k\vec{0} = \vec{0}$ và $0\vec{a} = \vec{0}$ [55].
*   **Các tính chất**: Với các số thực $k, t$ và các vectơ $\vec{a}, \vec{b}$ bất kì, ta có [56, 57]:
    *   $k(\vec{a} + \vec{b}) = k\vec{a} + k\vec{b}$
    *   $(k + t)\vec{a} = k\vec{a} + t\vec{a}$
    *   $(kt)\vec{a} = k(t\vec{a})$
    *   $1\vec{a} = \vec{a}$ và $(-1)\vec{a} = -\vec{a}$

### 2. Các hệ thức vectơ quan trọng

*   **Hệ thức trung điểm**: Với $I$ là trung điểm của $AB$, mọi điểm $O$ bất kì đều thỏa mãn:
    $$\overrightarrow{OA} + \overrightarrow{OB} = 2\overrightarrow{OI}$$ [56, 57]
*   **Hệ thức trọng tâm**: Với $G$ là trọng tâm của tam giác $ABC$, mọi điểm $O$ bất kì đều thỏa mãn:
    $$\overrightarrow{OA} + \overrightarrow{OB} + \overrightarrow{OC} = 3\overrightarrow{OG}$$ [57]

### 3. Điều kiện cùng phương và phân tích vectơ

*   **Điều kiện cùng phương**: Hai vectơ $\vec{a}$ và $\vec{b}$ (với $\vec{a} \neq \vec{0}$) cùng phương khi và chỉ khi tồn tại một số thực $k$ duy nhất sao cho $\vec{b} = k\vec{a}$ [55, 56].
*   **Ba điểm thẳng hàng**: Ba điểm phân biệt $A, B, C$ thẳng hàng khi và chỉ khi có số thực $k \neq 0$ sao cho:
    $$\overrightarrow{AB} = k\overrightarrow{AC}$$ [56]
*   **Phân tích (biểu diễn) một vectơ theo hai vectơ không cùng phương**: Cho hai vectơ không cùng phương $\vec{a}$ và $\vec{b}$. Mọi vectơ $\vec{u}$ luôn có thể biểu diễn duy nhất dưới dạng:
    $$\vec{u} = x\vec{a} + y\vec{b}$$
    trong đó $x, y$ là các số thực duy nhất [56, 57].

---

## BÀI 10: VECTƠ TRONG MẶT PHẲNG TỌA ĐỘ

### 1. Hệ trục tọa độ và tọa độ của vectơ

*   **Hệ trục tọa độ $Oxy$**: Gồm hai trục tọa độ vuông góc $Ox$ (trục hoành) và $Oy$ (trục tung) chung gốc $O$ [60].
    *   Các vectơ đơn vị tương ứng trên các trục là $\vec{i}$ và $\vec{j}$ vuông góc với nhau và có độ dài bằng 1 ($|\vec{i}| = |\vec{j}| = 1$) [60].
*   **Tọa độ của vectơ**: Với mỗi vectơ $\vec{u}$ trên mặt phẳng tọa độ, tồn tại duy nhất cặp số $(x; y)$ sao cho:
    $$\vec{u} = x\vec{i} + y\vec{j}$$
    Cặp số $(x; y)$ được gọi là **tọa độ** của vectơ $\vec{u}$, kí hiệu là $\vec{u} = (x; y)$ hoặc $\vec{u}(x; y)$ [60, 61].
    *   $x$ được gọi là **hoành độ**, $y$ được gọi là **tung độ** của vectơ $\vec{u}$ [60, 61].
*   **Độ dài của vectơ**: Nếu $\vec{u} = (x; y)$ thì độ dài của $\vec{u}$ là:
    $$|\vec{u}| = \sqrt{x^2 + y^2}$$ [61]
*   **Hai vectơ bằng nhau**: Cho $\vec{u} = (x; y)$ và $\vec{v} = (x'; y')$, ta có:
    $$\vec{u} = \vec{v} \Leftrightarrow \begin{cases} x = x' \\ y = y' \end{cases}$$ [60, 61]

### 2. Tọa độ của điểm và liên hệ vectơ

*   **Tọa độ điểm**: Tọa độ của điểm $M$ chính là tọa độ của vectơ $\overrightarrow{OM}$ [60, 61]. Kí hiệu $M(x_M; y_M) \Leftrightarrow \overrightarrow{OM} = (x_M; y_M)$ [60, 61].
*   **Tọa độ của vectơ $\overrightarrow{AB}$**: Cho hai điểm $A(x_A; y_A)$ và $B(x_B; y_B)$, ta có:
    $$\overrightarrow{AB} = (x_B - x_A; y_B - y_A)$$ [61, 62]
*   **Khoảng cách giữa hai điểm (Độ dài đoạn thẳng)**:
    $$AB = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$$ [62]

### 3. Biểu thức tọa độ của các phép toán vectơ

Cho hai vectơ $\vec{u} = (x; y)$, $\vec{v} = (x'; y')$ và số thực $k$, ta có [61]:
*   $\vec{u} + \vec{v} = (x + x'; y + y')$
*   $\vec{u} - \vec{v} = (x - x'; y - y')$
*   $k\vec{u} = (kx; ky)$
*   **Điều kiện cùng phương**: Vectơ $\vec{v}(x'; y')$ cùng phương với $\vec{u}(x; y) \neq \vec{0}$ khi và chỉ khi tồn tại số thực $k$ sao cho $x' = kx$ và $y' = ky$ [61].
    *(Nếu $x \neq 0, y \neq 0$ thì hai vectơ cùng phương khi và chỉ khi $\frac{x'}{x} = \frac{y'}{y}$)*.

### 4. Tọa độ trung điểm và trọng tâm

*   **Trung điểm $I$ của đoạn thẳng $AB$**:
    $$x_I = \frac{x_A + x_B}{2}, \quad y_I = \frac{y_A + y_B}{2}$$ [63]
*   **Trọng tâm $G$ của tam giác $ABC$**:
    $$x_G = \frac{x_A + x_B + x_C}{3}, \quad y_G = \frac{y_A + y_B + y_C}{3}$$ [63]

---

## BÀI 11: TÍCH VÔ HƯỚNG CỦA HAI VECTƠ

### 1. Góc giữa hai vectơ

*   **Định nghĩa**: Cho hai vectơ $\vec{u}$ và $\vec{v}$ khác $\vec{0}$. Từ một điểm $A$ tùy ý, vẽ $\overrightarrow{AB} = \vec{u}$ và $\overrightarrow{AC} = \vec{v}$. Góc $\widehat{BAC}$ (với $0^\circ \le \widehat{BAC} \le 180^\circ$) được gọi là **góc giữa hai vectơ** $\vec{u}$ và $\vec{v}$, kí hiệu là $(\vec{u}, \vec{v})$ [65, 66].
*   **Các trường hợp đặc biệt**:
    *   Nếu $(\vec{u}, \vec{v}) = 90^\circ$, ta nói hai vectơ vuông góc với nhau. Kí hiệu $\vec{u} \perp \vec{v}$ [66].
    *   Nếu $\vec{u}$ và $\vec{v}$ cùng hướng thì $(\vec{u}, \vec{v}) = 0^\circ$ [66].
    *   Nếu $\vec{u}$ and $\vec{v}$ ngược hướng thì $(\vec{u}, \vec{v}) = 180^\circ$ [66].

### 2. Tích vô hướng của hai vectơ

*   **Định nghĩa**: Tích vô hướng của hai vectơ $\vec{u}$ và $\vec{v}$ khác $\vec{0}$ là một **số** thực, kí hiệu là $\vec{u} \cdot \vec{v}$ (hoặc viết đơn giản là $\vec{u}\vec{v}$), được xác định bởi công thức [66]:
    $$\vec{u} \cdot \vec{v} = |\vec{u}| \cdot |\vec{v}| \cdot \cos(\vec{u}, \vec{v})$$
*   *Quy ước*: Nếu ít nhất một trong hai vectơ là $\vec{0}$ thì $\vec{u} \cdot \vec{v} = 0$ [66].
*   **Bình phương vô hướng**: Tích vô hướng của vectơ $\vec{u}$ với chính nó $\vec{u} \cdot \vec{u}$ được kí hiệu là $\vec{u}^2$ (gọi là bình phương vô hướng) [66]. Ta có:
    $$\vec{u}^2 = |\vec{u}|^2 \implies |\vec{u}| = \sqrt{\vec{u}^2}$$ [66]
*   **Điều kiện vuông góc**: Với hai vectơ khác $\vec{0}$ [66]:
    $$\vec{u} \perp \vec{v} \Leftrightarrow \vec{u} \cdot \vec{v} = 0$$
*   **Các tính chất**: Với ba vectơ $\vec{u}, \vec{v}, \vec{w}$ bất kì và số thực $k$, ta có [67, 68]:
    *   $\vec{u} \cdot \vec{v} = \vec{v} \cdot \vec{u}$ (giao hoán)
    *   $\vec{u} \cdot (\vec{v} + \vec{w}) = \vec{u} \cdot \vec{v} + \vec{u} \cdot \vec{w}$ (phân phối)
    *   $(k\vec{u}) \cdot \vec{v} = k(\vec{u} \cdot \vec{v}) = \vec{u} \cdot (k\vec{v})$
*   **Hệ quả (Các hằng đẳng thức đáng nhớ)**:
    *   $(\vec{u} + \vec{v})^2 = \vec{u}^2 + 2\vec{u}\vec{v} + \vec{v}^2$ [68]
    *   $(\vec{u} - \vec{v})^2 = \vec{u}^2 - 2\vec{u}\vec{v} + \vec{v}^2$ [68]
    *   $(\vec{u} - \vec{v})(\vec{u} + \vec{v}) = \vec{u}^2 - \vec{v}^2$ [68]

### 3. Biểu thức tọa độ của tích vô hướng

Cho hai vectơ $\vec{u} = (x; y)$ và $\vec{v} = (x'; y')$, ta có [67, 68]:
*   **Công thức tích vô hướng**:
    $$\vec{u} \cdot \vec{v} = xx' + yy'$$
*   **Tính vuông góc**:
    $$\vec{u} \perp \vec{v} \Leftrightarrow xx' + yy' = 0$$
*   **Góc giữa hai vectơ (Tính cosin)**:
    $$\cos(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{|\vec{u}| \cdot |\vec{v}|} = \frac{xx' + yy'}{\sqrt{x^2 + y^2} \cdot \sqrt{x'^2 + y'^2}} \quad (\vec{u}, \vec{v} \neq \vec{0})$$

---

## BÀI TẬP ÔN TẬP CUỐI CHƯƠNG IV

### 1. Câu hỏi trắc nghiệm minh họa tiêu biểu

*   **Câu 1 (Cùng phương)**: Cặp vectơ nào sau đây cùng phương? [71]
    *   A. $\vec{u} = (2;3)$ và $\vec{v} = (\frac{1}{2}; 6)$.
    *   B. $\vec{a} = (\sqrt{2}; 6)$ và $\vec{b} = (1; 3\vec{2})$.
    *   *Đáp án*: **B** (vì $\vec{a} = \sqrt{2} \vec{b}$).
*   **Câu 2 (Vuông góc)**: Cặp vectơ nào vuông góc với nhau? [71]
    *   A. $\vec{a} = (1;-1)$ và $\vec{b} = (-1;1)$.
    *   B. $\vec{z} = (a; b)$ và $\vec{t} = (-b; a)$.
    *   *Đáp án*: **B** (vì $\vec{z} \cdot \vec{t} = a(-b) + ba = 0$).
*   **Câu 3 (Độ dài bằng 1)**: Vectơ nào sau đây là vectơ đơn vị (độ dài bằng 1)? [71]
    *   A. $\vec{a} = (1;1)$.
    *   B. $\vec{d} = \left(\frac{1}{\sqrt{2}}; \frac{-1}{\sqrt{2}}\right)$.
    *   *Đáp án*: **B** (vì $|\vec{d}| = \sqrt{(\frac{1}{\sqrt{2}})^2 + (\frac{-1}{\sqrt{2}})^2} = 1$).
*   **Câu 4 (Tính góc)**: Góc giữa hai vectơ $\vec{a} = (1;-1)$ và $\vec{b} = (-2;0)$ là bao nhiêu? [71]
    *   A. $45^\circ$.
    *   B. $135^\circ$.
    *   *Đáp án*: **B** (vì $\cos(\vec{a}, \vec{b}) = \frac{1(-2) + (-1)0}{\sqrt{2}\sqrt{4}} = -\frac{1}{\sqrt{2}} \implies 135^\circ$).

### 2. Các dạng toán tự luận trọng tâm

*   **Dạng 1: Chứng minh đẳng thức vectơ**
    *   *Ví dụ*: Cho hình bình hành $ABCD$. Chứng minh với mọi điểm $M$, ta có:
        $$\overrightarrow{MA} + \overrightarrow{MC} = \overrightarrow{MB} + \overrightarrow{MD}$$ [71]
        *Giải*: Biến đổi đẳng thức về dạng hiệu: $\overrightarrow{MA} - \overrightarrow{MB} = \overrightarrow{MD} - \overrightarrow{MC} \Leftrightarrow \overrightarrow{BA} = \overrightarrow{CD}$ (đúng vì $ABCD$ là hình bình hành).
*   **Dạng 2: Phân tích vectơ**
    *   *Ví dụ*: Trên cạnh $BC$ của tam giác $ABC$ lấy điểm $M$ sao cho $MB = 3MC$. Biểu thị vectơ $\overrightarrow{AM}$ theo $\overrightarrow{AB}$ và $\overrightarrow{AC}$ [71].
        *Giải*: Ta có $MB = 3MC \implies \overrightarrow{BM} = \frac{3}{4}\overrightarrow{BC}$.
        Do đó: $\overrightarrow{AM} = \overrightarrow{AB} + \overrightarrow{BM} = \overrightarrow{AB} + \frac{3}{4}\overrightarrow{BC} = \overrightarrow{AB} + \frac{3}{4}(\overrightarrow{AC} - \overrightarrow{AB}) = \frac{1}{4}\overrightarrow{AB} + \frac{3}{4}\overrightarrow{AC}$.
*   **Dạng 3: Bài toán tọa độ tổng hợp trong Oxy**
    *   *Ví dụ*: Trong mặt phẳng $Oxy$, cho $A(2;1), B(-2;5), C(-5;2)$ [71, 72].
        a) Tính tọa độ các vectơ $\overrightarrow{BA}$ và $\overrightarrow{BC}$ [71].
        b) Chứng minh $A, B, C$ là ba đỉnh của một tam giác vuông [71].
        c) Tìm tọa độ điểm $D$ sao cho tứ giác $BCAD$ là một hình bình hành [71].
        *Giải*:
        a) $\overrightarrow{BA} = (4; -4)$, $\overrightarrow{BC} = (-3; -3)$.
        b) $\overrightarrow{BA} \cdot \overrightarrow{BC} = 4(-3) + (-4)(-3) = -12 + 12 = 0 \implies BA \perp BC \implies \Delta ABC$ vuông tại $B$.
        c) $BCAD$ is a parallelogram when $\overrightarrow{AD} = \overrightarrow{BC} \Leftrightarrow (x_D - 2; y_D - 1) = (-3; -3) \implies D(-1; -2)$.
