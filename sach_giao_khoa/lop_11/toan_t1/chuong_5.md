# CHƯƠNG V: GIỚI HẠN. HÀM SỐ LIÊN TỤC

Chương này giới thiệu các khái niệm cơ bản về giới hạn của dãy số, giới hạn của hàm số và tính liên tục của hàm số. Đây là nền tảng quan trọng của Giải tích toán học, có ứng dụng rộng rãi trong nhiều lĩnh vực khoa học và kỹ thuật [109].

---

## BÀI 15: GIỚI HẠN CỦA DÃY SỐ [85]

### 1. Giới hạn hữu hạn của dãy số
*   **Định nghĩa giới hạn $0$:** Ta nói dãy số $(u_n)$ có giới hạn là $0$ khi $n$ dần tới dương vô cực, nếu $|u_n|$ có thể nhỏ hơn một số dương bé tuỳ ý, kể từ một số hạng nào đó trở đi [86].
    *   Kí hiệu: $\lim_{n \to +\infty} u_n = 0$ hoặc $u_n \to 0$ khi $n \to +\infty$ (viết tắt là $\lim u_n = 0$) [86].
*   **Một số giới hạn cơ bản (giới hạn $0$):**
    *   $\lim_{n \to +\infty} \frac{1}{n^k} = 0$ (với $k$ là một số nguyên dương) [86].
    *   $\lim_{n \to +\infty} q^n = 0$ (với $q$ là số thực thoả mãn $|q| < 1$) [86].
    *   Nếu $|u_n| \le v_n$ với mọi $n \in \mathbb{N}^*$ và $\lim v_n = 0$ thì $\lim u_n = 0$ [86].
*   **Định nghĩa giới hạn hữu hạn $a$:** Ta nói dãy số $(u_n)$ có giới hạn hữu hạn là số thực $a$ khi $n \to +\infty$ nếu $\lim_{n \to +\infty} (u_n - a) = 0$ [86].
    *   Kí hiệu: $\lim_{n \to +\infty} u_n = a$ hoặc $u_n \to a$ khi $n \to +\infty$ [86].
*   **Một số giới hạn đặc biệt:**
    *   Nếu $u_n = c$ (với $c$ là hằng số) thì $\lim u_n = \lim c = c$ [87].

### 2. Định lí về giới hạn hữu hạn của dãy số
Giả sử $\lim u_n = a$ và $\lim v_n = b$ ($a, b \in \mathbb{R}$). Khi đó [87]:
*   **Giới hạn của tổng:** $\lim (u_n + v_n) = a + b$ [87]
*   **Giới hạn của hiệu:** $\lim (u_n - v_n) = a - b$ [87]
*   **Giới hạn của tích:** $\lim (u_n \cdot v_n) = a \cdot b$ [87]
*   **Giới hạn của thương:** $\lim \frac{u_n}{v_n} = \frac{a}{b}$ (nếu $b \ne 0$) [87]
*   **Giới hạn chứa căn thức:** Nếu $u_n \ge 0$ với mọi $n \in \mathbb{N}^*$ và $\lim u_n = a$ thì $a \ge 0$ và $\lim \sqrt{u_n} = \sqrt{a}$ [87].

### 3. Tổng của cấp số nhân lùi vô hạn
*   **Định nghĩa:** Cấp số nhân vô hạn $(u_n)$ có công bội $q$ thoả mãn $|q| < 1$ được gọi là **cấp số nhân lùi vô hạn** [88].
*   **Công thức tính tổng $S$:** Tổng của tất cả các số hạng của cấp số nhân lùi vô hạn đó được xác định bởi công thức [88]:
    $$S = u_1 + u_2 + u_3 + \dots + u_n + \dots = \frac{u_1}{1 - q}$$

### 4. Giới hạn vô cực của dãy số
*   **Giới hạn $+\infty$:** Ta nói dãy số $(u_n)$ có giới hạn là $+\infty$ khi $n \to +\infty$ nếu $u_n$ có thể lớn hơn một số dương bất kì, kể từ một số hạng nào đó trở đi [89].
    *   Kí hiệu: $\lim u_n = +\infty$ hoặc $u_n \to +\infty$ khi $n \to +\infty$ [89].
*   **Giới hạn $-\infty$:** Ta nói dãy số $(u_n)$ có giới hạn là $-\infty$ khi $n \to +\infty$ nếu $\lim (-u_n) = +\infty$ [89].
    *   Kí hiệu: $\lim u_n = -\infty$ hoặc $u_n \to -\infty$ khi $n \to +\infty$ [89].
*   **Một số giới hạn đặc biệt:**
    *   $\lim n^k = +\infty$ với $k$ là số nguyên dương [89].
    *   $\lim q^n = +\infty$ với $q > 1$ [89].
*   **Quy tắc tìm giới hạn vô cực của thương:**
    *   Nếu $\lim u_n = a$ and $\lim v_n = \pm\infty$ thì $\lim \frac{u_n}{v_n} = 0$ [90].
    *   Nếu $\lim u_n = a > 0$, $\lim v_n = 0$ và $v_n > 0$ với mọi $n$ thì $\lim \frac{u_n}{v_n} = +\infty$ [90].

---

## BÀI 16: GIỚI HẠN CỦA HÀM SỐ [92]

### 1. Giới hạn hữu hạn của hàm số tại một điểm
*   **Định nghĩa:** Cho khoảng $(a; b)$ chứa điểm $x_0$ và hàm số $y = f(x)$ xác định trên khoảng $(a; b)$, có thể trừ điểm $x_0$ [92]. Ta nói hàm số $y = f(x)$ có giới hạn hữu hạn là số $L$ khi $x$ dần tới $x_0$ nếu với dãy số $(x_n)$ bất kì thoả mãn $x_n \in (a; b)$, $x_n \ne x_0$ và $x_n \to x_0$, ta có $f(x_n) \to L$ [92].
    *   Kí hiệu: $\lim_{x \to x_0} f(x) = L$ hoặc $f(x) \to L$ khi $x \to x_0$ [92].

### 2. Định lí về giới hạn hữu hạn của hàm số
Giả sử $\lim_{x \to x_0} f(x) = L$ và $\lim_{x \to x_0} g(x) = M$ ($L, M \in \mathbb{R}$). Khi đó [93]:
*   **Tổng, hiệu, tích, thương:**
    *   $\lim_{x \to x_0} [f(x) + g(x)] = L + M$ [93]
    *   $\lim_{x \to x_0} [f(x) - g(x)] = L - M$ [93]
    *   $\lim_{x \to x_0} [f(x) \cdot g(x)] = L \cdot M$ [93]
    *   $\lim_{x \to x_0} \frac{f(x)}{g(x)} = \frac{L}{M}$ (nếu $M \ne 0$) [93]
*   **Căn thức:** Nếu $f(x) \ge 0$ và $\lim_{x \to x_0} f(x) = L$ thì $L \ge 0$ và $\lim_{x \to x_0} \sqrt{f(x)} = \sqrt{L}$ [93].
*   **Giới hạn hằng số:** $\lim_{x \to x_0} c = c$, $\lim_{x \to x_0} x = x_0$ (với $c$ là hằng số) [93].

### 3. Giới hạn một bên
*   **Giới hạn bên phải (dần tới $x_0^+$):** Cho hàm số $y = f(x)$ xác định trên khoảng $(x_0; b)$ [94]. Ta nói số $L$ là giới hạn bên phải của $f(x)$ khi $x \to x_0$ nếu với dãy số $(x_n)$ bất kì thoả mãn $x_0 < x_n < b$ và $x_n \to x_0$, ta có $f(x_n) \to L$ [94].
    *   Kí hiệu: $\lim_{x \to x_0^+} f(x) = L$ [94].
*   **Giới hạn bên trái (dần tới $x_0^-$):** Cho hàm số $y = f(x)$ xác định trên khoảng $(a; x_0)$ [94]. Ta nói số $L$ là giới hạn bên trái của $f(x)$ khi $x \to x_0$ nếu với dãy số $(x_n)$ bất kì thoả mãn $a < x_n < x_0$ và $x_n \to x_0$, ta có $f(x_n) \to L$ [94].
    *   Kí hiệu: $\lim_{x \to x_0^-} f(x) = L$ [94].
*   **Mối liên hệ giữa giới hạn hai bên và giới hạn một bên:**
    $$\lim_{x \to x_0} f(x) = L \iff \lim_{x \to x_0^+} f(x) = \lim_{x \to x_0^-} f(x) = L \quad [94]$$

### 4. Giới hạn hữu hạn của hàm số tại vô cực
*   **Định nghĩa tại $+\infty$:** Cho hàm số $y = f(x)$ xác định trên khoảng $(a; +\infty)$ [95]. Ta nói hàm số $y = f(x)$ có giới hạn hữu hạn là số $L$ khi $x \to +\infty$ nếu với dãy số $(x_n)$ bất kì thoả mãn $x_n > a$ và $x_n \to +\infty$, ta có $f(x_n) \to L$ [95].
    *   Kí hiệu: $\lim_{x \to +\infty} f(x) = L$ [95].
*   **Định nghĩa tại $-\infty$:** Cho hàm số $y = f(x)$ xác định trên khoảng $(-\infty; b)$ [95]. Ta nói hàm số $y = f(x)$ có giới hạn hữu hạn là số $L$ khi $x \to -\infty$ nếu với dãy số $(x_n)$ bất kì thoả mãn $x_n < b$ và $x_n \to -\infty$, ta có $f(x_n) \to L$ [95].
    *   Kí hiệu: $\lim_{x \to -\infty} f(x) = L$ [95].
*   **Một số giới hạn đặc biệt:**
    *   $\lim_{x \to +\infty} \frac{c}{x^k} = 0$, $\lim_{x \to -\infty} \frac{c}{x^k} = 0$ (với $c$ là hằng số, $k$ là số nguyên dương) [95].

### 5. Giới hạn vô cực của hàm số
*   **Tại một điểm:** $\lim_{x \to x_0} f(x) = +\infty$ hoặc $\lim_{x \to x_0} f(x) = -\infty$ [96]. (Định nghĩa tương tự thông qua giới hạn của dãy số) [96].
*   **Một số giới hạn đặc biệt tại vô cực:**
    *   $\lim_{x \to +\infty} x^k = +\infty$ với $k$ nguyên dương [97].
    *   $\lim_{x \to -\infty} x^k = +\infty$ nếu $k$ chẵn, và $-\infty$ nếu $k$ lẻ [97].
*   **Một số quy tắc về giới hạn vô cực:**
    *   **Tích của hai hàm số [98]:**
        | $\lim_{x \to x_0} f(x)$ | $\lim_{x \to x_0} g(x)$ | $\lim_{x \to x_0} f(x)g(x)$ |
        | :--- | :--- | :--- |
        | $L > 0$ | $+\infty$ | $+\infty$ |
        | $L > 0$ | $-\infty$ | $-\infty$ |
        | $L < 0$ | $+\infty$ | $-\infty$ |
        | $L < 0$ | $-\infty$ | $+\infty$ |
    *   **Thương $\frac{f(x)}{g(x)}$ [98]:**
        | $\lim_{x \to x_0} f(x)$ | $\lim_{x \to x_0} g(x)$ | Dấu của $g(x)$ | $\lim_{x \to x_0} \frac{f(x)}{g(x)}$ |
        | :--- | :--- | :--- | :--- |
        | $L$ | $\pm\infty$ | Tuỳ ý | $0$ |
        | $L > 0$ | $0$ | $+$ | $+\infty$ |
        | $L > 0$ | $0$ | $-$ | $-\infty$ |
        | $L < 0$ | $0$ | $+$ | $-\infty$ |
        | $L < 0$ | $0$ | $-$ | $+\infty$ |

---

## BÀI 17: HÀM SỐ LIÊN TỤC [100]

### 1. Hàm số liên tục tại một điểm
*   **Định nghĩa:** Cho hàm số $y = f(x)$ xác định trên khoảng $(a; b)$ chứa điểm $x_0$ [100]. Hàm số $y = f(x)$ được gọi là **liên tục tại điểm $x_0$** nếu:
    $$\lim_{x \to x_0} f(x) = f(x_0) \quad [100]$$
*   **Ý nghĩa hình học:** Đồ thị của hàm số liên tục tại điểm $x_0$ là một đường liền nét tại điểm có hoành độ $x_0$.
*   **Hàm số gián đoạn:** Nếu hàm số $y = f(x)$ không liên tục tại điểm $x_0$ thì ta nói $f(x)$ **gián đoạn tại điểm $x_0$** [100].

### 2. Hàm số liên tục trên một khoảng, một đoạn
*   **Trên một khoảng:** Hàm số $y = f(x)$ được gọi là liên tục trên khoảng $(a; b)$ nếu nó liên tục tại mọi điểm thuộc khoảng đó [101].
*   **Trên một đoạn:** Hàm số $y = f(x)$ được gọi là liên tục trên đoạn $[a; b]$ nếu nó liên tục trên khoảng $(a; b)$ và thoả mãn điều kiện giới hạn một bên ở hai đầu mút [101]:
    $$\lim_{x \to a^+} f(x) = f(a) \quad \text{và} \quad \lim_{x \to b^-} f(x) = f(b)$$
*   *Lưu ý:* Các khái niệm liên tục trên các nửa khoảng $[a; b)$, $(a; b]$, $[a; +\infty)$, v.v. được định nghĩa tương tự [101].

### 3. Các định lí cơ bản về hàm số liên tục
*   **Định lí 1 (Tính liên tục của các hàm sơ cấp):**
    *   Hàm số đa thức và hàm số $y = \sin x, y = \cos x$ liên tục trên toàn bộ tập số thực $\mathbb{R}$ [102].
    *   Các hàm số phân thức hữu tỉ (thương của hai đa thức), hàm số căn thức $y = \sqrt{x}$, và các hàm số lượng giác $y = \tan x, y = \cot x$ liên tục trên tập xác định của chúng [102].
*   **Định lí 2 (Tổng, hiệu, tích, thương):** Giả sử hai hàm số $y = f(x)$ và $y = g(x)$ liên tục tại điểm $x_0$. Khi đó [102]:
    *   Các hàm số $f(x) + g(x)$, $f(x) - g(x)$, $f(x) \cdot g(x)$ liên tục tại $x_0$ [102].
    *   Hàm số $\frac{f(x)}{g(x)}$ liên tục tại $x_0$ nếu $g(x_0) \ne 0$ [102].
*   **Định lí 3 (Định lí giá trị trung gian - Sự tồn tại nghiệm):**
    *   Nếu hàm số $y = f(x)$ liên tục trên đoạn $[a; b]$ và thoả mãn $f(a) \cdot f(b) < 0$, thì tồn tại ít nhất một điểm $c \in (a; b)$ sao cho [103]:
        $$f(c) = 0$$
    *   *Ý nghĩa:* Nếu đồ thị của một hàm số liên tục đi từ phía dưới trục hoành ($f(a) < 0$) lên phía trên trục hoành ($f(b) > 0$), hoặc ngược lại, thì đồ thị đó bắt buộc phải cắt trục hoành tại ít nhất một điểm nằm trong khoảng $(a; b)$ [103]. Nói cách khác, phương trình $f(x) = 0$ có ít nhất một nghiệm thực trên khoảng $(a; b)$ [103].

---

## BÀI TẬP CUỐI CHƯƠNG V [104, 105]

### 1. Trắc nghiệm tiêu biểu [104]
*   **Câu hỏi tính giới hạn:** Tìm giới hạn $\lim_{n \to +\infty} (\sqrt{n^2+1} - n)$ [104].
*   **Cấp số nhân lùi vô hạn:** Tính tổng của cấp số nhân $1 - \frac{1}{2} + \frac{1}{4} - \dots$ [104].
*   **Xét tính liên tục:** Xác định tính liên tục của hàm số $f(x) = \frac{x+1}{|x+1|}$ [104].

### 2. Tự luận tiêu biểu [105]
*   **Tìm giới hạn dãy số:** Tính $\lim \frac{n^2}{3n^2 + 7n - 2}$ [105].
*   **Chứng minh phương trình có nghiệm:** Chứng minh phương trình $x^5 + x^3 - 10 = 0$ có ít nhất một nghiệm thực trong khoảng $(0; 2)$ [103].

---

## BẢNG TỔNG HỢP CÔNG THỨC CHƯƠNG V [109]

| Khái niệm | Công thức / Nội dung chính | Điều kiện áp dụng |
| :--- | :--- | :--- |
| **Giới hạn Dãy số cơ bản** | $\lim \frac{1}{n^k} = 0$, $\lim q^n = 0$ [86] | $k \in \mathbb{N}^*$, $|q| < 1$ [86] |
| **Tổng Cấp số nhân lùi vô hạn** | $S = \frac{u_1}{1 - q}$ [88] | Cấp số nhân vô hạn có $|q| < 1$ [88] |
| **Giới hạn một bên** | $\lim_{x \to x_0} f(x) = L \iff \lim_{x \to x_0^+} f(x) = \lim_{x \to x_0^-} f(x) = L$ [94] | Tại điểm $x_0$ [94] |
| **Hàm số liên tục tại $x_0$** | $\lim_{x \to x_0} f(x) = f(x_0)$ [100] | $x_0$ thuộc Tập xác định của $f(x)$ [100] |
| **Định lí giá trị trung gian** | $f(x)$ liên tục trên $[a; b]$ và $f(a) \cdot f(b) < 0 \implies \exists c \in (a; b): f(c) = 0$ [103] | Tìm sự tồn tại nghiệm của phương trình [103] |
