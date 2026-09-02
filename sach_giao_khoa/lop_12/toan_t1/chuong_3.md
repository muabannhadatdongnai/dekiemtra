# CHƯƠNG III: CÁC SỐ ĐẶC TRƯNG ĐO MỨC ĐỘ PHÂN TÁN CỦA MẪU SỐ LIỆU GHÉP NHÓM [75]

## Bài 9. Khoảng biến thiên và khoảng tứ phân vị [75]
### 1. Khoảng biến thiên
- **Khái niệm**: Khoảng biến thiên của mẫu số liệu ghép nhóm là hiệu số giữa đầu mút phải của nhóm cuối cùng và đầu mút trái của nhóm đầu tiên [76].
- **Công thức**: Cho mẫu số liệu ghép nhóm gồm các nhóm liên tiếp $[a_1; a_2), [a_2; a_3), \dots, [a_k; a_{k+1})$. Khoảng biến thiên của mẫu số liệu ghép nhóm, kí hiệu là $R$, được xác định bởi công thức [76]:
  $$R = a_{k+1} - a_1$$
- **Ý nghĩa**: Khoảng biến thiên của mẫu số liệu ghép nhóm xấp xỉ cho khoảng biến thiên của mẫu số liệu gốc [76]. Nó được dùng để đo mức độ phân tán của mẫu số liệu ghép nhóm. Khoảng biến thiên càng lớn thì mẫu số liệu càng phân tán [76].

### 2. Khoảng tứ phân vị
- **Định nghĩa**: Khoảng tứ phân vị của mẫu số liệu ghép nhóm, kí hiệu là $\Delta_Q$, là hiệu số giữa tứ phân vị thứ ba $Q_3$ và tứ phân vị thứ nhất $Q_1$, tức là [77]:
  $$\Delta_Q = Q_3 - Q_1$$
- **Ý nghĩa**:
  - Khoảng tứ phân vị của mẫu số liệu ghép nhóm xấp xỉ cho khoảng tứ phân vị của mẫu số liệu gốc và được dùng để đo mức độ phân tán của mẫu số liệu [77].
  - Khoảng tứ phân vị càng lớn thì mẫu số liệu càng phân tán [77].
  - Do khoảng tứ phân vị chỉ phụ thuộc vào nửa giữa của mẫu số liệu nên nó không bị ảnh hưởng bởi các giá trị bất thường (outliers) có trong mẫu số liệu [77].
- **Công thức tính tứ phân vị thứ $r$ ($Q_r$)** (với $r \in \{1, 2, 3\}$) [77]:
  Để tính tứ phân vị thứ $r$ của mẫu số liệu ghép nhóm có cỡ mẫu $n = m_1 + m_2 + \dots + m_k$, ta thực hiện theo các bước sau [77]:
  - Giả sử $[a_p; a_{p+1})$ là nhóm chứa tứ phân vị thứ $r$ (tức là nhóm đầu tiên có tần số tích lũy cộng dồn lớn hơn hoặc bằng $\frac{r \cdot n}{4}$) [77].
  - Khi đó, giá trị tứ phân vị thứ $r$ được tính theo công thức [77]:
    $$Q_r = a_p + \frac{\frac{r \cdot n}{4} - (m_1 + m_2 + \dots + m_{p-1})}{m_p}(a_{p+1} - a_p)$$

---

## Bài 10. Phương sai và độ lệch chuẩn [80]
### 1. Phương sai
- **Công thức**: Phương sai của mẫu số liệu ghép nhóm, kí hiệu là $s^2$, là đại lượng được tính theo công thức [80]:
  $$s^2 = \frac{m_1(x_1 - \bar{x})^2 + m_2(x_2 - \bar{x})^2 + \dots + m_k(x_k - \bar{x})^2}{n}$$
  Trong đó:
  - $n = m_1 + m_2 + \dots + m_k$ là cỡ mẫu [80].
  - $x_i = \frac{a_i + a_{i+1}}{2}$ là giá trị đại diện cho nhóm $[a_i; a_{i+1})$ với $i = 1, 2, \dots, k$ [80].
  - $\bar{x}$ là số trung bình của mẫu số liệu ghép nhóm, được tính bởi công thức [80]:
    $$\bar{x} = \frac{m_1x_1 + m_2x_2 + \dots + m_kx_k}{n}$$
- **Công thức tính nhanh phương sai** [80]:
  $$s^2 = \frac{1}{n}(m_1x_1^2 + m_2x_2^2 + \dots + m_kx_k^2) - (\bar{x})^2$$
- **Lưu ý**: Ngoài ra, người ta còn dùng đại lượng phương sai hiệu chỉnh (kí hiệu là $\hat{s}^2$) để đo mức độ phân tán của mẫu số liệu ghép nhóm [81]:
  $$\hat{s}^2 = \frac{m_1(x_1 - \bar{x})^2 + m_2(x_2 - \bar{x})^2 + \dots + m_k(x_k - \bar{x})^2}{n-1}$$

### 2. Độ lệch chuẩn
- **Công thức**: Độ lệch chuẩn là căn bậc hai số học của phương sai, kí hiệu là $s$ (hoặc $\hat{s}$ nếu sử dụng phương sai hiệu chỉnh) [80, 81]:
  $$s = \sqrt{s^2}$$
- **Ý nghĩa**:
  - Phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm là các xấp xỉ cho phương sai và độ lệch chuẩn của mẫu số liệu gốc [81].
  - Chúng được dùng để đo mức độ phân tán của các số liệu trong mẫu số liệu ghép nhóm xung quanh số trung bình của mẫu số liệu đó [81].
  - Phương sai và độ lệch chuẩn càng lớn thì mẫu số liệu càng phân tán [81].

### 3. Hệ số biến thiên (Hỗ trợ so sánh bổ sung)
- Khi hai mẫu số liệu ghép nhóm có đơn vị đo khác nhau hoặc có giá trị trung bình khác nhau rất nhiều, để so sánh độ phân tán của chúng, người ta dùng **hệ số biến thiên**, kí hiệu là $CV$ [83]:
  $$CV = \frac{s}{\bar{x}}$$
  (trong đó $s$ là độ lệch chuẩn và $\bar{x}$ là số trung bình của mẫu số liệu) [83].
