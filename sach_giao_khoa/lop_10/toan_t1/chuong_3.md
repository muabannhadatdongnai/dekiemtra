# CHƯƠNG III: HỆ THỨC LƯỢNG TRONG TAM GIÁC

Chương này mở rộng khái niệm tỉ số lượng giác của một góc nhọn đã học ở lớp 9 sang các góc bất kì từ $0^\circ$ đến $180^\circ$ và giới thiệu các hệ thức lượng cơ bản trong tam giác, bao gồm định lí côsin, định lí sin, và các công thức tính diện tích tam giác để ứng dụng vào giải tam giác và đo đạc thực tế [32, 37].

---

## BÀI 5: GIÁ TRỊ LƯỢNG GIÁC CỦA MỘT GÓC TỪ $0^\circ$ ĐẾN $180^\circ$

### 1. Định nghĩa giá trị lượng giác
*   **Nửa đường tròn đơn vị**: Trong mặt phẳng toạ độ $Oxy$, nửa đường tròn tâm $O$, bán kính $R = 1$ nằm phía trên trục hoành (kể cả hai điểm trên trục hoành) được gọi là **nửa đường tròn đơn vị** [33].
*   Với mỗi góc $\alpha$ ($0^\circ \le \alpha \le 180^\circ$), có duy nhất điểm $M(x_0; y_0)$ trên nửa đường tròn đơn vị sao cho $\widehat{xOM} = \alpha$ [33]. Khi đó:
    *   **sin** của góc $\alpha$ là tung độ $y_0$ của điểm $M$, kí hiệu là $\sin \alpha$ [33].
    *   **côsin** (cos) của góc $\alpha$ là hoành độ $x_0$ của điểm $M$, kí hiệu là $\cos \alpha$ [33].
    *   **tang** (tan) của góc $\alpha$ là $\frac{y_0}{x_0}$ (với $\alpha \neq 90^\circ$ hay $x_0 \neq 0$), kí hiệu là $\tan \alpha = \frac{\sin \alpha}{\cos \alpha}$ [33].
    *   **côtang** (cot) của góc $\alpha$ là $\frac{x_0}{y_0}$ (với $\alpha \neq 0^\circ$ và $\alpha \neq 180^\circ$ hay $y_0 \neq 0$), kí hiệu là $\cot \alpha = \frac{\cos \alpha}{\sin \alpha}$ [33].

*   **Bảng giá trị lượng giác của một số góc đặc biệt**:

| $\alpha$ | $0^\circ$ | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ | $180^\circ$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$\sin \alpha$** | $0$ | $\frac{1}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{3}}{2}$ | $1$ | $0$ |
| **$\cos \alpha$** | $1$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{1}{2}$ | $0$ | $-1$ |
| **$\tan \alpha$** | $0$ | $\frac{\sqrt{3}}{3}$ | $1$ | $\sqrt{3}$ | $||$ | $0$ |
| **$\cot \alpha$** | $||$ | $\sqrt{3}$ | $1$ | $\frac{\sqrt{3}}{3}$ | $0$ | $||$ |

*(Kí hiệu $||$ chỉ giá trị lượng giác tương ứng không xác định)* [33]

---

### 2. Mối quan hệ giữa các giá trị lượng giác của hai góc bù nhau
Với mọi góc $\alpha$ thoả mãn $0^\circ \le \alpha \le 180^\circ$, ta luôn có:
*   $\sin(180^\circ - \alpha) = \sin \alpha$ [35]
*   $\cos(180^\circ - \alpha) = -\cos \alpha$ [35]
*   $\tan(180^\circ - \alpha) = -\tan \alpha$ ($\alpha \neq 90^\circ$) [35]
*   $\cot(180^\circ - \alpha) = -\cot \alpha$ ($0^\circ < \alpha < 180^\circ$) [35]

*Ý nghĩa hình học*: Hai góc bù nhau có sin bằng nhau; có côsin, tang, côtang đối nhau [35].

---

### 3. Các hệ thức lượng giác cơ bản
*   $\sin^2 \alpha + \cos^2 \alpha = 1$ ($0^\circ \le \alpha \le 180^\circ$) [36]
*   $1 + \tan^2 \alpha = \frac{1}{\cos^2 \alpha}$ ($\alpha \neq 90^\circ$) [36]
*   $1 + \cot^2 \alpha = \frac{1}{\sin^2 \alpha}$ ($0^\circ < \alpha < 180^\circ$) [36]
*   $\tan \alpha \cdot \cot \alpha = 1$ ($\alpha \notin \{0^\circ; 90^\circ; 180^\circ\}$) [33]

---
---

## BÀI 6: HỆ THỨC LƯỢNG TRONG TAM GIÁC

Kí hiệu đối với tam giác $ABC$:
*   $A, B, C$ là các góc của tam giác tại các đỉnh tương ứng [37].
*   $a, b, c$ tương ứng là độ dài của các cạnh đối diện với đỉnh $A, B, C$ [37].
*   $h_a, h_b, h_c$ lần lượt là độ dài đường cao kẻ từ các đỉnh $A, B, C$.
*   $p$ là nửa chu vi của tam giác ($p = \frac{a+b+c}{2}$) [37, 40].
*   $S$ là diện tích tam giác [37].
*   $R$ và $r$ tương ứng là bán kính đường tròn ngoại tiếp và nội tiếp tam giác [37].

### 1. Định lí côsin
Trong tam giác $ABC$:
$$a^2 = b^2 + c^2 - 2bc \cos A$$ [38]
$$b^2 = a^2 + c^2 - 2ac \cos B$$ [38]
$$c^2 = a^2 + b^2 - 2ab \cos C$$ [38]

*   **Hệ quả (Công thức tính góc)**:
    $$\cos A = \frac{b^2 + c^2 - a^2}{2bc}$$ [38]
    $$\cos B = \frac{a^2 + c^2 - b^2}{2ac}$$ [38]
    $$\cos C = \frac{a^2 + b^2 - c^2}{2ab}$$ [38]

---

### 2. Định lí sin
Trong tam giác $ABC$:
$$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R$$ [38]

---

### 3. Công thức tính diện tích tam giác
Diện tích $S$ của tam giác $ABC$ được tính theo các công thức sau:
1.  **Công thức đường cao cơ bản**:
    $$S = \frac{1}{2} a h_a = \frac{1}{2} b h_b = \frac{1}{2} c h_c$$ [40]
2.  **Công thức tích hai cạnh và sin của góc xen giữa**:
    $$S = \frac{1}{2} bc \sin A = \frac{1}{2} ca \sin B = \frac{1}{2} ab \sin C$$ [40]
3.  **Công thức liên quan đến bán kính đường tròn ngoại tiếp**:
    $$S = \frac{abc}{4R}$$ [40]
4.  **Công thức liên quan đến bán kính đường tròn nội tiếp**:
    $$S = pr$$  (với $p = \frac{a+b+c}{2}$) [40]
5.  **Công thức Heron**:
    $$S = \sqrt{p(p-a)(p-b)(p-c)}$$ [40]

---

### 4. Giải tam giác và ứng dụng thực tế
*   **Giải tam giác**: Là tìm độ dài các cạnh và số đo các góc còn lại của tam giác khi biết một số yếu tố cho trước [39].
*   **Các trường hợp giải tam giác cơ bản**:
    *   Biết hai cạnh và góc xen giữa (Sử dụng định lí côsin để tìm cạnh thứ ba, sau đó tìm các góc còn lại) [39].
    *   Biết ba cạnh (Sử dụng hệ quả định lí côsin để tính các góc) [39].
    *   Biết một cạnh và hai góc kề (Sử dụng định lí sin) [39].
*   **Ứng dụng thực tế**: Sử dụng các định lí và hệ thức lượng để tính khoảng cách giữa hai điểm không thể tới trực tiếp (ví dụ: tính khoảng cách từ vị trí $A$ trên bờ đến chân tháp $C$ trên đảo nhỏ giữa hồ Hoàn Kiếm, chiều cao của một toà nhà, hay khoảng cách giữa hai đỉnh núi) [37, 39, 40].

---
---

## BÀI TẬP CUỐI CHƯƠNG III

### 1. Câu hỏi trắc nghiệm minh hoạ
*   **Ví dụ 1**: Cho tam giác $ABC$ có $\widehat{B} = 135^\circ$. Khi đó diện tích tam giác tính theo công thức nào? Đáp án đúng là $S = \frac{\sqrt{2}}{4}ac$ (do $S = \frac{1}{2}ac\sin 135^\circ = \frac{\sqrt{2}}{4}ac$) [43].
*   **Ví dụ 2**: Công thức liên quan diện tích và bán kính ngoại tiếp: $S = \frac{abc}{4R}$ hoặc $R = \frac{abc}{4S}$ [43].

### 2. Bài tập tự luận luyện tập
*   **Bài tập tính toán biểu thức lượng giác**: Tính giá trị biểu thức không dùng máy tính:
    *   $M = \sin 45^\circ \cdot \cos 45^\circ + \sin 30^\circ$ [43].
    *   $N = \sin 60^\circ \cdot \cos 30^\circ + \frac{1}{2} \sin 45^\circ \cdot \cos 45^\circ$ [43].
*   **Bài tập giải tam giác**: Cho tam giác $ABC$ có $\widehat{B} = 60^\circ, \widehat{C} = 45^\circ, AC = 10$. Tính các cạnh còn lại, bán kính $R, r$ và diện tích $S$ [43].
*   **Bài tập chứng minh hệ thức lượng**:
    *   Chứng minh hệ thức trung tuyến: $MA^2 = \frac{2(AB^2 + AC^2) - BC^2}{4}$ với $M$ là trung điểm của $BC$ [43].
    *   Chứng minh tính chất góc dựa trên độ dài cạnh:
        *   Nếu góc $A$ nhọn thì $b^2 + c^2 > a^2$ [43].
        *   Nếu góc $A$ tù thì $b^2 + c^2 < a^2$ [43].
        *   Nếu góc $A$ vuông thì $b^2 + c^2 = a^2$ [43].
