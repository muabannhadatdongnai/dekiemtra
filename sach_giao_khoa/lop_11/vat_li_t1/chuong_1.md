# CHƯƠNG I: DAO ĐỘNG

---

## BÀI 1: DAO ĐỘNG ĐIỀU HOÀ

### I. Những đặc điểm của dao động cơ
1. **Thí nghiệm**
   * Sử dụng con lắc lò xo (gồm một lò xo nhẹ một đầu cố định, một đầu gắn vật nặng) hoặc con lắc đơn (vật nặng treo vào đầu một sợi dây mảnh không dãn).
   * Khi kéo vật lệch khỏi vị trí cân bằng rồi thả ra, vật sẽ chuyển động qua lại quanh vị trí cân bằng.

2. **Dao động cơ**
   * **Định nghĩa:** Chuyển động qua lại quanh một vị trí đặc biệt gọi là **vị trí cân bằng** (thường là vị trí của vật khi đứng yên).
   * **Dao động tuần hoàn:** Là dao động cơ mà sau những khoảng thời gian bằng nhau, vật trở lại vị trí cũ theo hướng cũ (trạng thái dao động được lặp lại như cũ).
   * Dao động tuần hoàn có thể có mức độ phức tạp khác nhau. Dao động tuần hoàn đơn giản nhất là **dao động điều hoà**.

---

### II. Dao động điều hoà
1. **Định nghĩa**
   * Dao động điều hoà là dao động trong đó li độ của vật là một hàm cosin (hoặc sin) của thời gian.

2. **Phương trình dao động điều hoà**
   $$x = A \cos(\omega t + \varphi)$$

   * Trong đó:
     * $x$: **Li độ** dao động, là độ lệch của vật khỏi vị trí cân bằng (đơn vị: cm, m...).
     * $A$: **Biên độ** dao động ($A > 0$), là li độ cực đại của vật. Biên độ là một hằng số dương.
     * $\omega$: **Tần số góc** của dao động (đơn vị: rad/s), là hằng số dương giúp xác định chu kì và tần số của dao động.
     * $(\omega t + \varphi)$: **Pha của dao động** tại thời điểm $t$ (đơn vị: rad), dùng để xác định trạng thái dao động của vật tại thời điểm $t$.
     * $\varphi$: **Pha ban đầu** của dao động (đơn vị: rad) tại thời điểm $t = 0$. Pha ban đầu có giá trị nằm trong khoảng từ $-\pi$ đến $\pi$.

3. **Mối liên hệ giữa dao động điều hoà và chuyển động tròn đều**
   * Một dao động điều hoà có thể được coi là hình chiếu của một chuyển động tròn đều lên một đường thẳng nằm trong mặt phẳng quỹ đạo.
   * Điểm $M$ chuyển động tròn đều quanh tâm $O$ với tốc độ góc $\omega$. Gọi $Q$ là hình chiếu của $M$ lên trục $Ox$ trùng với một đường kính của đường tròn. Khi đó, điểm $Q$ dao động điều hoà quanh gốc $O$ với phương trình $x = A \cos(\omega t + \varphi)$ với $A = OM$.

---

## BÀI 2: MÔ TẢ DAO ĐỘNG ĐIỀU HOÀ

### I. Các đại lượng đặc trưng của dao động điều hoà
1. **Li độ ($x$)**
   * Độ dịch chuyển của vật tính từ vị trí cân bằng. Có giá trị đại số (có thể âm, dương hoặc bằng 0).

2. **Biên độ ($A$)**
   * Là giá trị li độ cực đại của vật dao động điều hoà ($A = x_{max}$). Luôn có giá trị dương.

3. **Chu kì ($T$)**
   * Là khoảng thời gian ngắn nhất để vật thực hiện được một dao động toàn phần.
   * Đơn vị: giây ($s$).

4. **Tần số ($f$)**
   * Là số dao động toàn phần mà vật thực hiện được trong một giây.
   * Công thức liên hệ: $f = \frac{1}{T}$
   * Đơn vị: héc ($Hz$) hoặc $1/s$.

5. **Tần số góc ($\omega$)**
   * Là đại lượng đặc trưng cho tốc độ biến thiên của pha dao động.
   * Công thức liên hệ:
     $$\omega = \frac{2\pi}{T} = 2\pi f$$
   * Đơn vị: radian trên giây ($rad/s$).

---

### II. Pha ban đầu và độ lệch pha
1. **Pha ban đầu ($\varphi$)**
   * Cho biết trạng thái dao động của vật ở thời điểm ban đầu ($t = 0$).
   * Cho phép xác định li độ $x$ và chiều chuyển động của vật lúc bắt đầu quan sát.

2. **Độ lệch pha giữa hai dao động**
   * Xét hai dao động điều hoà cùng tần số góc $\omega$:
     * Dao động 1: $x_1 = A_1 \cos(\omega t + \varphi_1)$
     * Dao động 2: $x_2 = A_2 \cos(\omega t + \varphi_2)$
   * **Độ lệch pha:** $\Delta \varphi = \varphi_2 - \varphi_1$
     * Nếu $\Delta \varphi > 0$: Dao động 2 **sớm pha** hơn dao động 1.
     * Nếu $\Delta \varphi < 0$: Dao động 2 **trễ pha** hơn dao động 1.
     * Nếu $\Delta \varphi = 0$: Hai dao động **cùng pha**.
     * Nếu $\Delta \varphi = \pm \pi$ (hoặc số lẻ của $\pi$): Hai dao động **ngược pha**.
     * Nếu $\Delta \varphi = \pm \frac{\pi}{2}$: Hai dao động **vuông pha**.

---

## BÀI 3: VẬN TỐC, GIA TỐC TRONG DAO ĐỘNG ĐIỀU HOÀ

### I. Vận tốc của vật dao động điều hoà
1. **Phương trình vận tốc**
   * Vận tốc là đạo hàm bậc nhất của li độ theo thời gian:
     $$v = x' = -\omega A \sin(\omega t + \varphi)$$

2. **Tính chất của vận tốc**
   * Vận tốc biến thiên điều hoà cùng chu kì, cùng tần số với li độ nhưng **sớm pha $\frac{\pi}{2}$** so với li độ.
   * Khi vật đi qua **vị trí cân bằng** ($x = 0$), vận tốc có độ lớn cực đại:
     $$|v|_{max} = \omega A$$
   * Khi vật ở **vị trí biên** ($x = \pm A$), vận tốc bằng 0:
     $$v = 0$$

3. **Công thức độc lập với thời gian giữa li độ và vận tốc**
     $$\frac{x^2}{A^2} + \frac{v^2}{\omega^2 A^2} = 1 \implies A^2 = x^2 + \frac{v^2}{\omega^2}$$

---

### II. Gia tốc của vật dao động điều hoà
1. **Phương trình gia tốc**
   * Gia tốc là đạo hàm bậc nhất của vận tốc (đạo hàm bậc hai của li độ) theo thời gian:
     $$a = v' = x'' = -\omega^2 A \cos(\omega t + \varphi)$$
   * Mối liên hệ trực tiếp giữa gia tốc và li độ:
     $$a = -\omega^2 x$$

2. **Tính chất của gia tốc**
   * Gia tốc biến thiên điều hoà cùng chu kì, cùng tần số nhưng **ngược pha** so với li độ (hoặc sớm pha $\frac{\pi}{2}$ so với vận tốc).
   * Vectơ gia tốc của vật dao động điều hoà **luôn luôn hướng về vị trí cân bằng** và có độ lớn tỉ lệ thuận với độ lớn của li độ.
   * Khi vật ở **vị trí biên** ($x = \pm A$), gia tốc có độ lớn cực đại:
     $$|a|_{max} = \omega^2 A$$
   * Khi vật ở **vị trí cân bằng** ($x = 0$), gia tốc bằng 0:
     $$a = 0$$

---

## BÀI 4: BÀI TẬP VỀ DAO ĐỘNG ĐIỀU HOÀ

### Các dạng bài tập điển hình
1. **Dạng 1: Xác định các đại lượng đặc trưng từ phương trình dao động**
   * So sánh phương trình đề bài cho với phương trình chuẩn $x = A \cos(\omega t + \varphi)$ để suy ra $A, \omega, \varphi$.
   * Tính chu kì $T = \frac{2\pi}{\omega}$, tần số $f = \frac{1}{T}$.

2. **Dạng 2: Xác định li độ, vận tốc, gia tốc tại một thời điểm $t$**
   * Thay giá trị $t$ trực tiếp vào các phương trình của $x, v, a$.

3. **Dạng 3: Sử dụng công thức độc lập thời gian**
   * Hệ thức liên hệ: $A^2 = x^2 + \frac{v^2}{\omega^2}$ hoặc $a = -\omega^2 x$.

4. **Dạng 4: Đọc đồ thị dao động điều hoà**
   * Xác định biên độ $A$ từ đỉnh đồ thị.
   * Xác định chu kì $T$ bằng khoảng thời gian giữa hai thời điểm vật lặp lại cùng trạng thái (ví dụ từ đỉnh này đến đỉnh kế tiếp).

---

## BÀI 5: ĐỘNG NĂNG. THẾ NĂNG. SỰ CHUYỂN HOÁ NĂNG LƯỢNG TRONG DAO ĐỘNG ĐIỀU HOÀ

### I. Động năng ($W_đ$)
* Động năng của vật dao động điều hoà có khối lượng $m$:
  $$W_đ = \frac{1}{2} mv^2 = \frac{1}{2} m\omega^2 A^2 \sin^2(\omega t + \varphi)$$
* Động năng cực đại tại vị trí cân bằng ($x = 0, v = \pm v_{max}$):
  $$W_{đ,max} = \frac{1}{2} m\omega^2 A^2$$
* Động năng bằng 0 tại hai biên ($x = \pm A, v = 0$).

---

### II. Thế năng ($W_t$)
* Thế năng của vật dao động điều hoà:
  $$W_t = \frac{1}{2} m\omega^2 x^2 = \frac{1}{2} m\omega^2 A^2 \cos^2(\omega t + \varphi)$$
* Thế năng cực đại tại hai biên ($x = \pm A$):
  $$W_{t,max} = \frac{1}{2} m\omega^2 A^2$$
* Thế năng bằng 0 tại vị trí cân bằng ($x = 0$).

---

### III. Cơ năng ($W$) và sự chuyển hoá năng lượng
1. **Cơ năng**
   * Cơ năng là tổng động năng và thế năng của hệ dao động:
     $$W = W_đ + W_t$$
     $$W = \frac{1}{2} mv^2 + \frac{1}{2} m\omega^2 x^2 = \frac{1}{2} m\omega^2 A^2$$
   * **Định luật bảo toàn cơ năng:** Trong quá trình dao động điều hoà (bỏ qua mọi lực ma sát, lực cản), cơ năng của hệ luôn được **bảo toàn** và tỉ lệ thuận với bình phương biên độ dao động.

2. **Sự chuyển hoá năng lượng**
   * Khi vật đi từ vị trí cân bằng ra biên: Li độ tăng $\implies$ thế năng tăng; tốc độ giảm $\implies$ động năng giảm. Động năng chuyển hoá dần thành thế năng.
   * Khi vật đi từ biên về vị trí cân bằng: Li độ giảm $\implies$ thế năng giảm; tốc độ tăng $\implies$ động năng tăng. Thế năng chuyển hoá dần thành động năng.
   * Tần số dao động của động năng và thế năng bằng **2 lần** tần số dao động điều hoà của li độ ($f' = 2f; \omega' = 2\omega$), còn chu kì bằng **một nửa** chu kì của li độ ($T' = \frac{T}{2}$).

---

### IV. Cơ năng của con lắc lò xo và con lắc đơn
1. **Con lắc lò xo**
   * Thế năng: $W_t = \frac{1}{2} kx^2$ (với $k$ là độ cứng của lò xo, liên hệ: $\omega = \sqrt{\frac{k}{m}}$).
   * Cơ năng bảo toàn: $W = \frac{1}{2} kA^2 = \text{hằng số}$.
   * Chu kì dao động: $T = 2\pi\sqrt{\frac{m}{k}}$.

2. **Con lắc đơn**
   * Thế năng tại li độ góc $\alpha$:
     $$W_t = mgl(1 - \cos\alpha)$$
     * Với góc lệch nhỏ ($\alpha \le 10^\circ \approx 0,17\text{ rad}$): $\cos\alpha \approx 1 - \frac{\alpha^2}{2} \implies W_t \approx \frac{1}{2} mgl\alpha^2$.
   * Cơ năng bảo toàn (với góc nhỏ): $W \approx \frac{1}{2} mgl\alpha_0^2 = \text{hằng số}$ (với $\alpha_0$ là biên độ góc).
   * Chu kì dao động: $T = 2\pi\sqrt{\frac{l}{g}}$.

---

## BÀI 6: DAO ĐỘNG TẮT DẦN. DAO ĐỘNG CƯỠNG BỨC. HIỆN TƯỢNG CỘNG HƯỞNG

### I. Dao động tắt dần
1. **Định nghĩa**
   * Dao động tắt dần là dao động có biên độ (và năng lượng) giảm dần theo thời gian.

2. **Nguyên nhân**
   * Do tác dụng của lực ma sát, lực cản của môi trường xung quanh hấp thụ năng lượng của hệ dao động chuyển hoá thành nhiệt năng. Lực cản càng lớn, dao động tắt dần càng nhanh.

3. **Ứng dụng và tác hại**
   * **Ứng dụng:** Bộ giảm xóc của xe máy, ô tô giúp dập tắt nhanh dao động khi xe đi qua chỗ gồ ghề; các thiết bị đóng cửa tự động.
   * **Tác hại:** Trong các máy móc cần duy trì dao động ổn định (như đồng hồ quả lắc), dao động tắt dần là có hại, cần phải cung cấp thêm năng lượng để duy trì dao động.

---

### II. Dao động cưỡng bức
1. **Định nghĩa**
   * Dao động cưỡng bức là dao động xảy ra dưới tác dụng của một ngoại lực cưỡng bức tuần hoàn biến thiên theo thời gian:
     $$F = F_0 \cos(\Omega t)$$

2. **Đặc điểm**
   * **Tần số:** Khi đã ổn định, dao động cưỡng bức có tần số bằng tần số của lực cưỡng bức bên ngoài ($f = f_{cb}$).
   * **Biên độ:** Biên độ của dao động cưỡng bức không đổi và phụ thuộc vào:
     * Biên độ $F_0$ của lực cưỡng bức (lực càng mạnh, biên độ càng lớn).
     * Lực cản của môi trường (lực cản càng nhỏ, biên độ càng lớn).
     * Độ chênh lệch giữa tần số của lực cưỡng bức $f$ và tần số dao động riêng $f_0$ của hệ. Hiệu số $|f - f_0|$ càng nhỏ thì biên độ dao động cưỡng bức càng lớn.

---

### III. Hiện tượng cộng hưởng
1. **Định nghĩa**
   * Hiện tượng cộng hưởng là hiện tượng biên độ của dao động cưỡng bức tăng đến giá trị cực đại khi tần số $f$ của lực cưỡng bức bằng tần số riêng $f_0$ của hệ dao động.
   * Điều kiện cộng hưởng:
     $$f = f_0 \quad \text{hoặc} \quad \omega = \omega_0$$

2. **Giải thích**
   * Khi tần số của lực cưỡng bức bằng tần số riêng của hệ, lực cưỡng bức sẽ liên tục truyền năng lượng cho hệ một cách nhịp nhàng và đồng pha, làm cho biên độ dao động tăng lên nhanh chóng cho đến khi đạt giá trị cực đại (cân bằng với năng lượng tiêu hao do ma sát).

3. **Tác hại và ứng dụng trong đời sống**
   * **Tác hại:** Có thể làm sập cầu, nhà cửa, công trình nếu tần số của các lực bên ngoài (gió bão, bước chân hành quân, rung động của động cơ...) trùng với tần số riêng của công trình. Ví dụ nổi tiếng là vụ sập cầu Tacoma Narrows (Mỹ).
   * **Ứng dụng:** Hộp đàn guitar, violin sử dụng hiện tượng cộng hưởng âm để tăng âm lượng của tiếng đàn; lò vi sóng sử dụng cộng hưởng của sóng điện từ với các phân tử nước để làm nóng thức ăn nhanh chóng.

---

## BÀI 7: BÀI TẬP VỀ SỰ CHUYỂN HOÁ NĂNG LƯỢNG TRONG DAO ĐỘNG ĐIỀU HOÀ

### Các dạng bài tập điển hình
1. **Dạng 1: Xác định vị trí tại đó Động năng bằng $n$ lần Thế năng ($W_đ = n W_t$)**
   * Áp dụng định luật bảo toàn cơ năng:
     $$W = W_đ + W_t = n W_t + W_t = (n+1) W_t$$
     $$\frac{1}{2} kA^2 = (n+1) \frac{1}{2} kx^2 \implies x = \pm \frac{A}{\sqrt{n+1}}$$

2. **Dạng 2: Xác định vị trí tại đó Thế năng bằng $m$ lần Động năng ($W_t = m W_đ$)**
   * Tương tự:
     $$W = W_đ + W_t = W_đ + m W_đ = (m+1) W_đ$$
     $$\frac{1}{2} m v_{max}^2 = (m+1) \frac{1}{2} m v^2 \implies v = \pm \frac{v_{max}}{\sqrt{m+1}} = \pm \frac{\omega A}{\sqrt{m+1}}$$

3. **Dạng 3: Sử dụng đồ thị năng lượng theo thời gian hoặc theo li độ**
   * Đồ thị động năng, thế năng theo li độ $x$ là các đường parabol đối xứng qua trục tung.
   * Giao điểm của hai đường parabol động năng và thế năng chính là vị trí có $W_đ = W_t$, khi đó $x = \pm \frac{A}{\sqrt{2}}$.
