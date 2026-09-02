# CHƯƠNG II: DÃY SỐ. CẤP SỐ CỘNG VÀ CẤP SỐ NHÂN

---

## BÀI 5: DÃY SỐ

### 1. Định nghĩa dãy số
#### a. Dãy số vô hạn
- Mỗi hàm số $u$ xác định trên tập các số nguyên dương $\mathbb{N}^*$ được gọi là một **dãy số vô hạn** (gọi tắt là dãy số), kí hiệu là $u = u(n)$.
- Ta thường viết $u_n$ thay cho $u(n)$ và kí hiệu dãy số $u = u(n)$ bởi $(u_n)$, do đó dãy số $(u_n)$ được viết dưới dạng khai triển:
  $$u_1, u_2, u_3, \dots, u_n, \dots$$
- Trong đó:
  - $u_1$ là **số hạng đầu**.
  - $u_n$ là số hạng thứ $n$ và được gọi là **số hạng tổng quát** của dãy số.
- **Chú ý:** Nếu với mọi $n \in \mathbb{N}^*$, $u_n = c$ (với $c$ là hằng số) thì $(u_n)$ được gọi là **dãy số không đổi**.

#### b. Dãy số hữu hạn
- Mỗi hàm số $u$ xác định trên tập $M = \{1, 2, 3, \dots, m\}$ (với $m \in \mathbb{N}^*$) được gọi là một **dãy số hữu hạn**.
- Dạng khai triển của nó là:
  $$u_1, u_2, u_3, \dots, u_m$$
- Trong đó:
  - $u_1$ là **số hạng đầu**.
  - $u_m$ là **số hạng cuối**.

---

### 2. Các cách cho một dãy số
Thông thường, một dãy số có thể được cho bằng các cách sau:
1. **Cho bằng công thức của số hạng tổng quát $u_n$:**
   - Ví dụ: $u_n = 2n$, $u_n = \frac{(-1)^n}{n}$.
2. **Bằng phương pháp mô tả:**
   - Mô tả cách xác định các số hạng của dãy số.
   - Ví dụ: Dãy số các số nguyên tố theo thứ tự tăng dần: $2, 3, 5, 7, 11, \dots$
3. **Bằng hệ thức truy hồi:**
   - Cho số hạng đầu (hoặc một vài số hạng đầu) và công thức tính $u_n$ qua các số hạng đứng trước nó.
   - Ví dụ (Dãy Fibonacci):
     $$\begin{cases} F_1 = 1, F_2 = 1 \\ F_n = F_{n-1} + F_{n-2} \quad (n \ge 3) \end{cases}$$

---

### 3. Dãy số tăng, dãy số giảm và dãy số bị chặn
#### a. Dãy số tăng, dãy số giảm
- Dãy số $(u_n)$ được gọi là **dãy số tăng** nếu ta có $u_{n+1} > u_n$ với mọi $n \in \mathbb{N}^*$.
  - *Phương pháp xét tính tăng:* Xét hiệu $u_{n+1} - u_n > 0$.
- Dãy số $(u_n)$ được gọi là **dãy số giảm** nếu ta có $u_{n+1} < u_n$ với mọi $n \in \mathbb{N}^*$.
  - *Phương pháp xét tính giảm:* Xét hiệu $u_{n+1} - u_n < 0$.

#### b. Dãy số bị chặn
- Dãy số $(u_n)$ được gọi là **bị chặn trên** nếu tồn tại một số $M$ sao cho:
  $$u_n \le M \quad \forall n \in \mathbb{N}^*$$
- Dãy số $(u_n)$ được gọi là **bị chặn dưới** nếu tồn tại một số $m$ sao cho:
  $$u_n \ge m \quad \forall n \in \mathbb{N}^*$$
- Dãy số $(u_n)$ được gọi là **bị chặn** nếu nó vừa bị chặn trên vừa bị chặn dưới, tức là tồn tại các số $m, M$ sao cho:
  $$m \le u_n \le M \quad \forall n \in \mathbb{N}^*$$

---
---

## BÀI 6: CẤP SỐ CỘNG

### 1. Định nghĩa cấp số cộng
- **Cấp số cộng** là một dãy số (hữu hạn hoặc vô hạn), trong đó kể từ số hạng thứ hai, mỗi số hạng đều bằng số hạng đứng ngay trước nó cộng với một số không đổi $d$.
- Số $d$ được gọi là **công sai** của cấp số cộng.
- Cấp số cộng $(u_n)$ với công sai $d$ được biểu diễn bởi hệ thức truy hồi:
  $$u_n = u_{n-1} + d \quad (n \ge 2)$$
- **Chú ý:** Nếu công sai $d = 0$ thì cấp số cộng là một dãy số không đổi.

---

### 2. Số hạng tổng quát
Nếu cấp số cộng $(u_n)$ có số hạng đầu $u_1$ và công sai $d$, thì số hạng tổng quát $u_n$ của nó được xác định bởi công thức:
$$u_n = u_1 + (n - 1)d \quad (n \ge 2)$$

---

### 3. Tính chất của cấp số cộng
Trong một cấp số cộng, mỗi số hạng (trừ số hạng đầu và số hạng cuối, nếu có) đều là trung bình cộng của hai số hạng đứng kề với nó, nghĩa là:
$$u_k = \frac{u_{k-1} + u_{k+1}}{2} \quad (k \ge 2)$$

---

### 4. Tổng $n$ số hạng đầu của một cấp số cộng
Cho cấp số cộng $(u_n)$ với công sai $d$. Đặt $S_n = u_1 + u_2 + \dots + u_n$ là tổng $n$ số hạng đầu tiên của nó. Khi đó:
$$S_n = \frac{n(u_1 + u_n)}{2}$$
Hoặc biến đổi theo $u_1$ và $d$:
$$S_n = \frac{n[2u_1 + (n - 1)d]}{2}$$

---
---

## BÀI 7: CẤP SỐ NHÂN

### 1. Định nghĩa cấp số nhân
- **Cấp số nhân** là một dãy số (hữu hạn hoặc vô hạn), trong đó kể từ số hạng thứ hai, mỗi số hạng đều bằng tích của số hạng đứng ngay trước nó với một số không đổi $q$.
- Số $q$ được gọi là **công bội** của cấp số nhân.
- Cấp số nhân $(u_n)$ với công bội $q$ được biểu diễn bởi hệ thức truy hồi:
  $$u_n = u_{n-1} \cdot q \quad (n \ge 2)$$
- **Các trường hợp đặc biệt:**
  - Nếu $u_1 = 0$ thì cấp số nhân là $0, 0, 0, \dots$ (với mọi $q$).
  - Nếu $q = 0$ thì cấp số nhân là $u_1, 0, 0, \dots$
  - Nếu $q = 1$ thì cấp số nhân là $u_1, u_1, u_1, \dots$
  - Nếu $q = -1$ thì cấp số nhân là $u_1, -u_1, u_1, -u_1, \dots$

---

### 2. Số hạng tổng quát
Nếu cấp số nhân $(u_n)$ có số hạng đầu $u_1$ và công bội $q \ne 0$, thì số hạng tổng quát $u_n$ của nó được xác định bởi công thức:
$$u_n = u_1 \cdot q^{n-1} \quad (n \ge 2)$$

---

### 3. Tính chất của cấp số nhân
Trong một cấp số nhân, bình phương của mỗi số hạng (trừ số hạng đầu và số hạng cuối, nếu có) đều là tích của hai số hạng đứng kề với nó, nghĩa là:
$$u_k^2 = u_{k-1} \cdot u_{k+1} \quad (k \ge 2)$$

---

### 4. Tổng $n$ số hạng đầu của một cấp số nhân
Cho cấp số nhân $(u_n)$ với công bội $q \ne 1$. Đặt $S_n = u_1 + u_2 + \dots + u_n$ là tổng $n$ số hạng đầu tiên của nó. Khi đó:
$$S_n = \frac{u_1(1 - q^n)}{1 - q}$$

---
---

## BẢNG SO SÁNH CẤP SỐ CỘNG VÀ CẤP SỐ NHÂN

| Đặc trưng | Cấp số cộng (CSC) | Cấp số nhân (CSN) |
| :--- | :--- | :--- |
| **Định nghĩa** | $u_n = u_{n-1} + d$ | $u_n = u_{n-1} \cdot q$ |
| **Tham số đặc trưng** | Số hạng đầu $u_1$, Công sai $d$ | Số hạng đầu $u_1$, Công bội $q$ |
| **Số hạng tổng quát $u_n$** | $u_n = u_1 + (n-1)d$ | $u_n = u_1 \cdot q^{n-1}$ |
| **Tính chất trung bình** | $u_k = \frac{u_{k-1} + u_{k+1}}{2}$ | $u_k^2 = u_{k-1} \cdot u_{k+1}$ |
| **Tổng $n$ số hạng đầu $S_n$**| $S_n = \frac{n(u_1 + u_n)}{2} = \frac{n[2u_1 + (n-1)d]}{2}$ | $S_n = \frac{u_1(1-q^n)}{1-q} \quad (q \ne 1)$ |
