# CHƯƠNG I: HÀM SỐ LƯỢNG GIÁC VÀ PHƯƠNG TRÌNH LƯỢNG GIÁC

Chương này giới thiệu khái niệm góc lượng giác, giá trị lượng giác của góc lượng giác, các công thức lượng giác cơ bản, hàm số lượng giác và phương trình lượng giác cơ bản.

---

## BÀI 1: GIÁ TRỊ LƯỢNG GIÁC CỦA GÓC LƯỢNG GIÁC

### 1. Góc lượng giác
* **Khái niệm**: Cho hai tia $Ou, Ov$. Nếu tia $Om$ quay quanh gốc $O$ từ tia $Ou$ đến tia $Ov$ theo một chiều nhất định thì ta nói nó quét một **góc lượng giác** có tia đầu $Ou$, tia cuối $Ov$, kí hiệu là $(Ou, Ov)$.
* **Chiều quay**:
  * Chiều ngược chiều kim đồng hồ là **chiều dương**.
  * Chiều cùng chiều kim đồng hồ là **chiều âm**.
* **Hệ thức Chasles**: Với ba tia $Ou, Ov, Ow$ tùy ý, ta có:
  * Theo đơn vị độ: $\text{sđ}(Ou, Ov) + \text{sđ}(Ov, Ow) = \text{sđ}(Ou, Ow) + k \cdot 360^\circ \quad (k \in \mathbb{Z})$
  * Theo đơn vị radian: $\text{sđ}(Ou, Ov) + \text{sđ}(Ov, Ow) = \text{sđ}(Ou, Ow) + k \cdot 2\pi \quad (k \in \mathbb{Z})$

### 2. Đơn vị đo góc và độ dài cung tròn
* **Quan hệ giữa độ và radian**:
  $$1^\circ = \frac{\pi}{180}\text{ rad}, \quad 1\text{ rad} = \left(\frac{180}{\pi}\right)^\circ$$
* **Độ dài cung tròn**: Một cung của đường tròn bán kính $R$ và có số đo $\alpha$ radian thì có độ dài:
  $$l = R \cdot \alpha$$

### 3. Đường tròn lượng giác và Giá trị lượng giác
* **Đường tròn lượng giác**: Là đường tròn tâm tại gốc tọa độ $O$ trên mặt phẳng Oxy, bán kính bằng 1, được định hướng và lấy điểm $A(1;0)$ làm điểm gốc.
* **Giá trị lượng giác của góc lượng giác $\alpha$**:
  * $\sin\alpha = y_M$ (tung độ của điểm biểu diễn $M$ trên đường tròn lượng giác)
  * $\cos\alpha = x_M$ (hoành độ của điểm biểu diễn $M$ trên đường tròn lượng giác)
  * $\tan\alpha = \frac{\sin\alpha}{\cos\alpha}$ (xác định khi $\cos\alpha \neq 0$, tức là $\alpha \neq \frac{\pi}{2} + k\pi, k \in \mathbb{Z}$)
  * $\cot\alpha = \frac{\cos\alpha}{\sin\alpha}$ (xác định khi $\sin\alpha \neq 0$, tức là $\alpha \neq k\pi, k \in \mathbb{Z}$)

### 4. Các hệ thức lượng giác cơ bản
* $\sin^2\alpha + \cos^2\alpha = 1$
* $1 + \tan^2\alpha = \frac{1}{\cos^2\alpha} \quad \left(\alpha \neq \frac{\pi}{2} + k\pi, k \in \mathbb{Z}\right)$
* $1 + \cot^2\alpha = \frac{1}{\sin^2\alpha} \quad \left(\alpha \neq k\pi, k \in \mathbb{Z}\right)$
* $\tan\alpha \cdot \cot\alpha = 1 \quad \left(\alpha \neq k\frac{\pi}{2}, k \in \mathbb{Z}\right)$

### 5. Giá trị lượng giác của các góc có liên quan đặc biệt
* **Góc đối nhau** ($\alpha$ và $-\alpha$):
  $$\cos(-\alpha) = \cos\alpha, \quad \sin(-\alpha) = -\sin\alpha, \quad \tan(-\alpha) = -\tan\alpha, \quad \cot(-\alpha) = -\cot\alpha$$
* **Góc bù nhau** ($\alpha$ và $\pi - \alpha$):
  $$\sin(\pi - \alpha) = \sin\alpha, \quad \cos(\pi - \alpha) = -\cos\alpha, \quad \tan(\pi - \alpha) = -\tan\alpha, \quad \cot(\pi - \alpha) = -\cot\alpha$$
* **Góc phụ nhau** ($\alpha$ và $\frac{\pi}{2} - \alpha$):
  $$\sin\left(\frac{\pi}{2} - \alpha\right) = \cos\alpha, \quad \cos\left(\frac{\pi}{2} - \alpha\right) = \sin\alpha, \quad \tan\left(\frac{\pi}{2} - \alpha\right) = \cot\alpha, \quad \cot\left(\frac{\pi}{2} - \alpha\right) = \tan\alpha$$
* **Góc hơn kém $\pi$** ($\alpha$ và $\pi + \alpha$):
  $$\sin(\pi + \alpha) = -\sin\alpha, \quad \cos(\pi + \alpha) = -\cos\alpha, \quad \tan(\pi + \alpha) = \tan\alpha, \quad \cot(\pi + \alpha) = \cot\alpha$$

---

## BÀI 2: CÔNG THỨC LƯỢNG GIÁC

### 1. Công thức cộng
* $\cos(a - b) = \cos a \cos b + \sin a \sin b$
* $\cos(a + b) = \cos a \cos b - \sin a \sin b$
* $\sin(a - b) = \sin a \cos b - \cos a \sin b$
* $\sin(a + b) = \sin a \cos b + \cos a \sin b$
* $\tan(a - b) = \frac{\tan a - \tan b}{1 + \tan a \tan b}$
* $\tan(a + b) = \frac{\tan a + \tan b}{1 - \tan a \tan b}$

### 2. Công thức nhân đôi và hạ bậc
* **Nhân đôi**:
  * $\sin 2a = 2 \sin a \cos a$
  * $\cos 2a = \cos^2 a - \sin^2 a = 2\cos^2 a - 1 = 1 - 2\sin^2 a$
  * $\tan 2a = \frac{2\tan a}{1 - \tan^2 a}$
* **Hạ bậc**:
  * $\cos^2 a = \frac{1 + \cos 2a}{2}$
  * $\sin^2 a = \frac{1 - \cos 2a}{2}$

### 3. Công thức biến đổi tích thành tổng
* $\cos a \cos b = \frac{1}{2} [\cos(a - b) + \cos(a + b)]$
* $\sin a \sin b = \frac{1}{2} [\cos(a - b) - \cos(a + b)]$
* $\sin a \cos b = \frac{1}{2} [\sin(a - b) + \sin(a + b)]$

### 4. Công thức biến đổi tổng thành tích
* $\cos u + \cos v = 2 \cos\frac{u + v}{2} \cos\frac{u - v}{2}$
* $\cos u - \cos v = -2 \sin\frac{u + v}{2} \sin\frac{u - v}{2}$
* $\sin u + \sin v = 2 \sin\frac{u + v}{2} \cos\frac{u - v}{2}$
* $\sin u - \sin v = 2 \cos\frac{u + v}{2} \sin\frac{u - v}{2}$

---

## BÀI 3: HÀM SỐ LƯỢNG GIÁC

### 1. Định nghĩa và Tập xác định
* **Hàm số $y = \sin x$**: Tập xác định $D = \mathbb{R}$, tập giá trị $T = [-1; 1]$. Là hàm số lẻ, tuần hoàn với chu kì $2\pi$.
* **Hàm số $y = \cos x$**: Tập xác định $D = \mathbb{R}$, tập giá trị $T = [-1; 1]$. Là hàm số chẵn, tuần hoàn với chu kì $2\pi$.
* **Hàm số $y = \tan x$**: Tập xác định $D = \mathbb{R} \setminus \left\{\frac{\pi}{2} + k\pi, k \in \mathbb{Z}\right\}$, tập giá trị $T = \mathbb{R}$. Là hàm số lẻ, tuần hoàn với chu kì $\pi$.
* **Hàm số $y = \cot x$**: Tập xác định $D = \mathbb{R} \setminus \{k\pi, k \in \mathbb{Z}\}$, tập giá trị $T = \mathbb{R}$. Là hàm số lẻ, tuần hoàn với chu kì $\pi$.

### 2. Sự biến thiên của các hàm số lượng giác
* **Hàm số $y = \sin x$**: Đồng biến trên mỗi khoảng $\left(-\frac{\pi}{2} + k2\pi; \frac{\pi}{2} + k2\pi\right)$, nghịch biến trên mỗi khoảng $\left(\frac{\pi}{2} + k2\pi; \frac{3\pi}{2} + k2\pi\right)$ ($k \in \mathbb{Z}$).
* **Hàm số $y = \cos x$**: Đồng biến trên mỗi khoảng $(-\pi + k2\pi; k2\pi)$, nghịch biến trên mỗi khoảng $(k2\pi; \pi + k2\pi)$ ($k \in \mathbb{Z}$).
* **Hàm số $y = \tan x$**: Đồng biến trên mỗi khoảng $\left(-\frac{\pi}{2} + k\pi; \frac{\pi}{2} + k\pi\right)$ ($k \in \mathbb{Z}$).
* **Hàm số $y = \cot x$**: Nghịch biến trên mỗi khoảng $(k\pi; \pi + k\pi)$ ($k \in \mathbb{Z}$).

---

## BÀI 4: PHƯƠNG TRÌNH LƯỢNG GIÁC CƠ BẢN

### 1. Phương trình $\sin x = m$
* Vô nghiệm nếu $|m| > 1$.
* Nếu $|m| \le 1$: Có góc $\alpha$ thỏa mãn $\sin\alpha = m$.
  * Theo radian:
    $$\left[\begin{aligned} x &= \alpha + k2\pi \\ x &= \pi - \alpha + k2\pi \end{aligned}\right. \quad (k \in \mathbb{Z})$$
  * Theo độ:
    $$\left[\begin{aligned} x &= a^\circ + k360^\circ \\ x &= 180^\circ - a^\circ + k360^\circ \end{aligned}\right. \quad (k \in \mathbb{Z})$$

### 2. Phương trình $\cos x = m$
* Vô nghiệm nếu $|m| > 1$.
* Nếu $|m| \le 1$: Có góc $\alpha$ thỏa mãn $\cos\alpha = m$.
  * Theo radian:
    $$x = \pm\alpha + k2\pi \quad (k \in \mathbb{Z})$$
  * Theo độ:
    $$x = \pm a^\circ + k360^\circ \quad (k \in \mathbb{Z})$$

### 3. Phương trình $\tan x = m$
* Luôn có nghiệm với mọi $m \in \mathbb{R}$. Có góc $\alpha$ thỏa mãn $\tan\alpha = m$.
  * Theo radian:
    $$x = \alpha + k\pi \quad (k \in \mathbb{Z})$$
  * Theo độ:
    $$x = a^\circ + k180^\circ \quad (k \in \mathbb{Z})$$

### 4. Phương trình $\cot x = m$
* Luôn có nghiệm với mọi $m \in \mathbb{R}$. Có góc $\alpha$ thỏa mãn $\cot\alpha = m$.
  * Theo radian:
    $$x = \alpha + k\pi \quad (k \in \mathbb{Z})$$
  * Theo độ:
    $$x = a^\circ + k180^\circ \quad (k \in \mathbb{Z})$$