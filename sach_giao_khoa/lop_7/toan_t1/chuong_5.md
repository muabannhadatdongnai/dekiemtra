# CHƯƠNG V: THU THẬP VÀ BIỂU DIỄN DỮ LIỆU

Chương này trang bị cho học sinh các kiến thức và kĩ năng cơ bản về thống kê, bao gồm thu thập, phân loại, đánh giá tính đại diện của dữ liệu, cách đọc, vẽ và phân tích dữ liệu trên hai loại biểu đồ rất phổ biến trong thực tế: biểu đồ hình quạt tròn và biểu đồ đoạn thẳng.

---

## BÀI 17: THU THẬP VÀ PHÂN LOẠI DỮ LIỆU

### 1. Thu thập và phân loại dữ liệu
*   **Thu thập dữ liệu:** Là quá trình thu thập thông tin về các vấn đề quan tâm thông qua nhiều phương pháp khác nhau như phỏng vấn trực tiếp, quan sát, hoặc lập bảng hỏi (phiếu khảo sát).
*   **Phân loại dữ liệu:** Dữ liệu thu thập được có thể là số hoặc không phải là số. Ta phân loại dữ liệu theo sơ đồ sau:
    *   **Dữ liệu là số (số liệu)** - còn gọi là *dữ liệu định lượng* (Ví dụ: chiều cao, nhiệt độ, số lượng học sinh).
    *   **Dữ liệu không là số** - còn gọi là *dữ liệu định tính*:
        *   *Loại không thể sắp xếp thứ tự:* Ví dụ như quốc tịch (Việt Nam, Pháp, Mỹ), tên các loài động vật, phương tiện đi lại (xe đạp, xe máy, xe buýt).
        *   *Loại có thể sắp xếp thứ tự:* Ví dụ như mức độ đồng ý (Rất đồng ý, Đồng ý, Không đồng ý, Rất không đồng ý) hoặc học lực (Xuất sắc, Tốt, Khá, Trung bình, Yếu).

*   **Ví dụ 1:**
    Bình tiến hành khảo sát các bạn trong tổ và thu được ba dãy dữ liệu sau:
    1.  Cân nặng (đơn vị kilôgam) của năm bạn: $43; 41; 48; 45; 52$ $ightarrow$ **Dữ liệu là số (số liệu)**.
    2.  Tên một số tỉnh: Ninh Bình, Hưng Yên, Bắc Ninh $ightarrow$ **Dữ liệu không là số, không thể sắp xếp thứ tự**.
    3.  Đánh giá của bốn học sinh về chất lượng bài giảng môn Toán: Tốt, Xuất sắc, Khá Tốt, Trung bình $ightarrow$ **Dữ liệu không là số, có thể sắp xếp thứ tự**.

### 2. Tính đại diện của dữ liệu
*   **Khái niệm:** Để đưa ra các kết luận hợp lí và có giá trị áp dụng thực tế, dữ liệu thu thập được phải đảm bảo **tính đại diện** cho toàn bộ đối tượng đang được quan tâm.
*   **Ví dụ 2 (Khảo sát khách hàng hãng bay):**
    Để đánh giá độ hài lòng của khách hàng trên một chuyến bay:
    *   *Cách 1:* Chỉ lấy ý kiến của 20 hành khách ở khoang hạng thương gia $ightarrow$ **Không đại diện** (vì nhóm khách hàng này có dịch vụ và trải nghiệm khác biệt so với số đông ở khoang phổ thông).
    *   *Cách 2:* Đánh số ngẫu nhiên khách hàng và chọn khảo sát các số thứ tự chia hết cho 5 ($5, 10, 15, \dots$) $ightarrow$ **Đảm bảo tính đại diện** (chọn ngẫu nhiên hệ thống từ mọi phân khúc hành khách).
*   **Ví dụ 3 (Quảng cáo thuốc trị cảm):**
    Một công ty thử nghiệm thuốc trị cảm trên 100 người bệnh tuổi từ 20 đến 30, có 95 người khỏi bệnh sau 3 ngày và quảng cáo: *"Tỉ lệ người dùng khỏi bệnh sau ba ngày đạt 95%"*. Kết luận quảng cáo này **không hợp lí** vì mẫu khảo sát bị giới hạn ở độ tuổi từ 20 đến 30 tuổi, không đảm bảo tính đại diện cho mọi đối tượng bệnh nhân ở các lứa tuổi khác (trẻ em, người cao tuổi,...).

---

## BÀI 18: BIỂU ĐỒ HÌNH QUẠT TRÒN

### 1. Đọc và mô tả biểu đồ hình quạt tròn
*   **Ý nghĩa:** Biểu đồ hình quạt tròn được sử dụng để so sánh các phần trong toàn bộ dữ liệu.
*   **Cấu tạo:** 
    *   Phần chính là một hình tròn được chia thành nhiều hình quạt (tô màu khác nhau).
    *   Mỗi hình quạt biểu diễn tỉ lệ phần trăm của một phần so với toàn bộ dữ liệu.
    *   Cả hình tròn biểu diễn toàn bộ dữ liệu, tương ứng với $100\%$.
*   **Nhận xét nhanh về diện tích quạt:**
    *   Hình quạt chiếm **một nửa hình tròn** biểu diễn tỉ lệ $50\%$.
    *   Hình quạt chiếm **một phần tư hình tròn** biểu diễn tỉ lệ $25\%$.
    *   Hai hình quạt có kích thước bằng nhau biểu diễn cùng một tỉ lệ phần trăm.

### 2. Biểu diễn dữ liệu vào biểu đồ hình quạt tròn
Khi vẽ biểu đồ hình quạt tròn có sẵn các phần chia đều nhau:
*   Nếu hình tròn được chia thành **10 phần bằng nhau**, mỗi phần nhỏ tương ứng với $10\%$.
*   Nếu hình tròn được chia thành **20 phần bằng nhau**, mỗi phần nhỏ tương ứng với $5\%$.
*   Dựa vào bảng số liệu tỉ lệ phần trăm, ta đếm số phần tương ứng để tô màu và điền thông tin chính xác.

*   **Ví dụ (Kĩ năng bơi của học sinh):**
    Khảo sát kĩ năng bơi của 500 học sinh tiểu học ở một xã: Bơi thành thạo (250 học sinh), Biết bơi nhưng chưa thành thạo (175 học sinh), Chưa biết bơi (75 học sinh).
    *   *Tính tỉ lệ phần trăm:*
        *   Tỉ lệ bơi thành thạo: $rac{250}{500} \cdot 100\% = 50\%$.
        *   Tỉ lệ biết bơi nhưng chưa thành thạo: $rac{175}{500} \cdot 100\% = 35\%$.
        *   Tỉ lệ chưa biết bơi: $rac{75}{500} \cdot 100\% = 15\%$.

### 3. Phân tích dữ liệu trong biểu đồ hình quạt tròn
*   Chúng ta phân tích số liệu phần trăm trên biểu đồ để tìm ra các xu hướng, thứ tự xếp hạng (yếu tố ảnh hưởng nhiều nhất, ít nhất) và làm các phép toán so sánh hoặc tính toán số lượng thực tế.
*   **Công thức tính số lượng thực tế từ tỉ lệ phần trăm:**
    $$	ext{Số lượng thực tế} = 	ext{Tổng số lượng} \cdot 	ext{Tỉ lệ phần trăm}$$
    *Ví dụ:* Khối 7 có 200 học sinh, tỉ lệ thích chơi thể thao là $10\%$. Dự đoán số học sinh thích chơi thể thao là: $200 \cdot 10\% = 20$ học sinh.

---

## BÀI 19: BIỂU ĐỒ ĐOẠN THẲNG

### 1. Giới thiệu biểu đồ đoạn thẳng
*   **Ý nghĩa:** Biểu đồ đoạn thẳng dùng để biểu diễn sự thay đổi của một đại lượng theo thời gian.
*   **Các thành phần chính:**
    *   **Trục ngang:** Biểu diễn các mốc thời gian.
    *   **Trục đứng:** Biểu diễn giá trị của đại lượng ta đang quan tâm.
    *   **Các điểm biểu diễn:** Mỗi điểm xác định giá trị của đại lượng tại một mốc thời gian cụ thể.
    *   **Các đoạn thẳng:** Nối các điểm biểu diễn liên tiếp với nhau.
    *   **Tiêu đề:** Nằm ở dòng trên cùng để mô tả nội dung biểu diễn của biểu đồ.

### 2. Đọc và phân tích biểu đồ đoạn thẳng
*   Biểu đồ đoạn thẳng giúp người đọc dễ dàng nhận diện **xu thế thay đổi** của đại lượng theo thời gian (tăng, giảm, hay biến động tăng giảm xen kẽ).
*   Độ dốc của đoạn thẳng thể hiện tốc độ tăng hoặc giảm: đoạn thẳng càng dốc lên chứng tỏ đại lượng tăng càng nhanh; dốc xuống càng đứng chứng tỏ đại lượng giảm càng mạnh.
*   Người ta có thể vẽ **nhiều đường biểu diễn khác nhau trên cùng một biểu đồ** (mỗi đường mang một màu sắc và kí hiệu riêng) để so sánh xu hướng biến động giữa các nhóm đối tượng.

### 3. Quy trình vẽ biểu đồ đoạn thẳng
Để vẽ biểu đồ đoạn thẳng biểu diễn một bảng số liệu, thực hiện qua 4 bước:
1.  **Bước 1:** Vẽ hệ trục tọa độ vuông góc. Trục ngang biểu diễn thời gian; trục đứng biểu diễn đại lượng quan tâm (chọn khoảng chia thích hợp sao cho bao quát được giá trị nhỏ nhất và lớn nhất của số liệu).
2.  **Bước 2:** Với mỗi mốc thời gian trên trục ngang, xác định vị trí giá trị tương ứng trên trục đứng và đánh dấu điểm biểu diễn.
3.  **Bước 3:** Dùng thước nối các điểm biểu diễn liên tiếp bằng các đoạn thẳng.
4.  **Bước 4:** Ghi tên các trục, chú thích các giá trị tại điểm mút (nếu cần), đặt tiêu đề cho biểu đồ ở phía trên.

*   **Chú ý về cách chọn trục đứng (Thử thách nhỏ):**
    Khi số liệu có giá trị lớn nhưng biên độ biến thiên nhỏ (ví dụ tuổi thọ trung bình chỉ dao động từ $67$ đến $77$ tuổi), ta **không nên bắt đầu trục đứng từ điểm 0**. Việc cắt bớt phần dưới và bắt đầu trục đứng từ $65$ hay $67$ sẽ giúp kéo dãn biên độ biểu diễn, làm các đoạn thẳng có độ dốc rõ rệt hơn, giúp người đọc dễ dàng nhận thấy sự tăng/giảm qua các năm.

---

## HƯỚNG DẪN GIẢI CHI TIẾT BÀI TẬP BÀI HỌC

### I. Bài tập Bài 17: Thu thập và phân loại dữ liệu (Trang 92)

#### Bài 5.1
*   **Đề bài:** Xác định xem dữ liệu thu được thuộc loại nào với các câu hỏi:
    a) Bạn có cho rằng đọc sách là thói quen tốt? (A. Rất đồng ý; B. Đồng ý; C. Không đồng ý; D. Rất không đồng ý).
    b) Ca sĩ Việt Nam nào bạn thích nhất?
*   **Lời giải:**
    a) Dữ liệu thu được là **dữ liệu không là số, có thể sắp xếp thứ tự** (định tính).
    b) Dữ liệu thu được là **dữ liệu không là số, không thể sắp xếp thứ tự** (định tính).

#### Bài 5.2
*   **Đề bài:** Kiểm tra ý kiến của Vuông: *"Đa phần học sinh trong trường thuận tay phải"*. Hãy đưa ra phương án thu thập dữ liệu phù hợp.
*   **Lời giải:**
    Để kiểm tra nhận định này, ta không thể hỏi tất cả học sinh trong trường nếu trường quá đông. Ta cần chọn một mẫu khảo sát có tính đại diện cao:
    *   Chọn ngẫu nhiên khoảng $5 - 10$ học sinh từ mỗi lớp của tất cả các khối học trong trường.
    *   Lập bảng hỏi hoặc quan sát trực tiếp hoạt động viết bài của các bạn được chọn để ghi nhận thông tin thuận tay trái hay thuận tay phải.
    *   Tổng hợp số liệu để tính tỉ lệ phần trăm học sinh thuận tay phải trên tổng mẫu khảo sát rồi đưa ra kết luận.

#### Bài 5.3
*   **Đề bài:** Vân muốn kiểm tra nhận định *"Học sinh nam yêu thích các chương trình thể thao hơn học sinh nữ"*. Hãy lập bảng hỏi và cách thu thập dữ liệu.
*   **Lời giải:**
    1.  *Lập bảng hỏi gồm các thông tin:*
        *   Giới tính: [ ] Nam  -  [ ] Nữ
        *   Mức độ yêu thích các chương trình thể thao: [ ] Rất thích  -  [ ] Thích  -  [ ] Bình thường  -  [ ] Không thích.
    2.  *Cách thu thập dữ liệu:* Chọn ngẫu nhiên khoảng $30$ bạn nam và $30$ bạn nữ của khối lớp 7 trong trường, phát bảng hỏi để thu thập câu trả lời. Sau đó phân tích và so sánh tỉ lệ lựa chọn "Rất thích" và "Thích" giữa hai nhóm nam và nữ.

#### Bài 5.4
*   **Đề bài:** Khảo sát sau có đảm bảo tính đại diện không?
    a) Khảo sát số ti vi trung bình của 5 000 hộ gia đình bằng cách lấy số ti vi của các hộ số 1; 11; 21; ...; 4991.
    b) Giáo viên thể dục cho câu lạc bộ bóng rổ chạy cự li 1 000 m để đánh giá thể lực toàn trường.
*   **Lời giải:**
    a) **Đảm bảo tính đại diện** vì đây là phương pháp chọn mẫu ngẫu nhiên hệ thống, đảm bảo các hộ gia đình ở các khu vực khác nhau trong khu dân cư đều có cơ hội được chọn như nhau.
    b) **Không đảm bảo tính đại diện** vì các thành viên câu lạc bộ bóng rổ thường có thể lực tốt hơn đáng kể so với mặt bằng thể lực chung của học sinh toàn trường.

#### Bài 5.5
*   **Đề bài:** Bình hỏi 50 bạn nam thấy có 30 bạn thích bóng đá và kết luận: *"Đa phần học sinh thích bóng đá"*. Hỏi có hợp lý không?
*   **Lời giải:**
    Kết luận của Bình là **không hợp lý** vì đối tượng khảo sát của Bình chỉ toàn là học sinh nam, không có học sinh nữ. Do đó, tập mẫu này không đại diện cho toàn bộ đối tượng học sinh của trường.

---

### II. Bài tập Bài 18: Biểu đồ hình quạt tròn (Trang 99)

#### Bài 5.6
*   **Đề bài:** Cho biểu đồ Hình 5.18 biểu diễn tỉ lệ số dân các châu lục tính đến 1-7-2020: Châu Á (59.52%), Châu Phi (17.21%), Châu Âu (9.61%), Châu Mỹ (13.11%), Châu Đại Dương (0.55%).
    a) Cho biết các thành phần của biểu đồ.
    b) Biểu đồ có bao nhiêu hình quạt và biểu diễn số liệu nào?
    c) Châu lục nào đông dân nhất, ít dân nhất?
    d) Tính dân số cụ thể của từng châu lục biết tổng dân số 5 châu lục là 7 773 triệu người.
*   **Lời giải:**
    a) Thành phần gồm: Tiêu đề biểu đồ (*Tỉ lệ số dân của các châu lục tính đến ngày 1-7-2020*), biểu đồ hình tròn chia thành các hình quạt kèm tỉ lệ phần trăm, và bảng chú giải các châu lục bằng màu sắc.
    b) Có 5 hình quạt tròn, biểu diễn tỉ lệ dân số các châu lục: Châu Á ($59,52\%$), Châu Phi ($17,21\%$), Châu Mỹ ($13,11\%$), Châu Âu ($9,61\%$), Châu Đại Dương ($0,55\%$).
    c) Đông dân nhất: **Châu Á**; Ít dân nhất: **Châu Đại Dương**.
    d) Dân số chi tiết (làm tròn đến hàng phần mười):
        *   Dân số Châu Á: $7\,773 \cdot 59,52\% pprox 4\,626,5$ triệu người.
        *   Dân số Châu Phi: $7\,773 \cdot 17,21\% pprox 1\,337,7$ triệu người.
        *   Dân số Châu Mỹ: $7\,773 \cdot 13,11\% pprox 1\,019,0$ triệu người.
        *   Dân số Châu Âu: $7\,773 \cdot 9,61\% pprox 747,0$ triệu người.
        *   Dân số Châu Đại Dương: $7\,773 \cdot 0,55\% pprox 42,8$ triệu người.

#### Bài 5.7
*   **Đề bài:** Hoàn thiện biểu đồ Hình 5.19 biểu diễn số bạn thích các thú nuôi: Chó (10 bạn), Mèo (20 bạn), Chim (7 bạn), Cá (3 bạn).
*   **Lời giải:**
    1.  *Tính tỉ lệ phần trăm:*
        *   Tổng số bạn khảo sát: $10 + 20 + 7 + 3 = 40$ bạn.
        *   Tỉ lệ thích Chó: $rac{10}{40} \cdot 100\% = 25\%$ (tương ứng với $rac{1}{4}$ hình tròn).
        *   Tỉ lệ thích Mèo: $rac{20}{40} \cdot 100\% = 50\%$ (tương ứng với $rac{1}{2}$ hình tròn).
        *   Tỉ lệ thích Chim: $rac{7}{40} \cdot 100\% = 17,5\%$.
        *   Tỉ lệ thích Cá: $rac{3}{40} \cdot 100\% = 7,5\%$.
    2.  *Vẽ và hoàn thiện:*
        *   Chia hình quạt lớn nhất bằng nửa hình tròn ($50\%$) tô màu biểu diễn cho **Mèo**.
        *   Chia hình quạt tiếp theo bằng một phần tư hình tròn ($25\%$) tô màu biểu diễn cho **Chó**.
        *   Phần còn lại chia thành hai hình quạt: một quạt chiếm $17,5\%$ biểu diễn cho **Chim** và quạt nhỏ nhất chiếm $7,5\%$ biểu diễn cho **Cá**.

#### Bài 5.8
*   **Đề bài:** Đội hiến máu gồm 200 tình nguyện viên có tỉ lệ nhóm máu: A (20%), B (30%), AB (10%), O (40%).
    a) Tính số người mang nhóm máu A, nhóm máu B.
    b) Tính số người mang nhóm máu A hoặc O.
*   **Lời giải:**
    a) Số người mang nhóm máu A: $200 \cdot 20\% = 40$ người.
    Số người mang nhóm máu B: $200 \cdot 30\% = 60$ người.
    b) Tỉ lệ người mang nhóm máu A hoặc O là: $20\% + 40\% = 60\%$.
    Số người mang nhóm máu A hoặc O là: $200 \cdot 60\% = 120$ người.

#### Bài 5.9
*   **Đề bài:** Từ kết quả kĩ năng bơi ở Bài 18, ước lượng trong 800 học sinh tiểu học của xã có bao nhiêu em bơi thành thạo, bao nhiêu em chưa biết bơi.
*   **Lời giải:**
    Dựa trên tỉ lệ thống kê của xã: bơi thành thạo là $50\%$ và chưa biết bơi là $15\%$.
    *   Ước lượng số học sinh bơi thành thạo: $800 \cdot 50\% = 400$ em.
    *   Ước lượng số học sinh chưa biết bơi: $800 \cdot 15\% = 120$ em.

---

### III. Bài tập Bài 19: Biểu đồ đoạn thẳng (Trang 105)

#### Bài 5.10
*   **Đề bài:** Cho biểu đồ kỉ lục thế giới chạy 100 m từ năm 1912 đến 2009.
    a) Kỉ lục đạt được năm 1991 là bao nhiêu giây?
    b) Từ năm 1912 đến 2009, kỉ lục đã giảm bao nhiêu giây?
*   **Lời giải:**
    a) Năm 1991, kỉ lục thế giới chạy 100 m đạt được là **$9,86$ giây**.
    b) Lấy kỉ lục năm 1912 trừ đi kỉ lục năm 2009: $10,6 - 9,58 = 1,02$ giây.
    Vậy kỉ lục đã giảm **$1,02$ giây**.

#### Bài 5.11
*   **Đề bài:** Cho biểu đồ Hình 5.33 biểu diễn dân số châu Phi, châu Mỹ, châu Âu.
    a) Cho biết xu hướng biến động dân số của mỗi châu lục.
    b) Châu lục nào dân số cao nhất, thấp nhất trong các năm từ 1950 đến 1980?
    c) Từ năm 1950 đến 1980, châu lục nào có số dân tăng chậm nhất?
*   **Lời giải:**
    a) Số dân của cả ba châu lục đều có xu hướng **tăng liên tục** theo thời gian.
    b) Trong giai đoạn từ 1950 đến 1980, châu lục có số dân cao nhất là **Châu Âu**; châu lục có số dân thấp nhất là **Châu Phi**.
    c) Từ năm 1950 đến 1980, số dân của **Châu Âu** tăng chậm nhất (đường biểu diễn có độ dốc thấp nhất).

#### Bài 5.12
*   **Đề bài:** Vẽ biểu đồ đoạn thẳng cho bảng nhiệt độ tại Hà Nội vào một ngày mùa thu:
    *   8h: $23^\circ	ext{C}$; 10h: $25^\circ	ext{C}$; 12h: $34^\circ	ext{C}$; 14h: $32^\circ	ext{C}$; 16h: $26^\circ	ext{C}$; 18h: $22^\circ	ext{C}$; 20h: $18^\circ	ext{C}$.
*   **Lời giải:**
    *   *Hướng dẫn vẽ:* Vẽ trục hoành biểu diễn mốc thời gian (giờ), trục tung biểu diễn nhiệt độ ($^\circ	ext{C}$, chọn khoảng từ 15 đến 35). Đánh dấu các điểm tương ứng: $(8; 23), (10; 25), (12; 34), (14; 32), (16; 26), (18; 22), (20; 18)$ rồi nối lại thành đường gãy khúc. Ghi tiêu đề biểu đồ: *"Biểu đồ sự thay đổi nhiệt độ tại Hà Nội trong một ngày mùa thu"*.

#### Bài 5.13
*   **Đề bài:** Số trận thắng của một đội bóng trong 8 năm liên tiếp từ 2013 đến 2020: $36, 42, 15, 23, 25, 35, 32, 20$.
    a) Vẽ biểu đồ đoạn thẳng.
    b) Nhận xét về xu hướng số trận thắng của đội bóng.
*   **Lời giải:**
    a) *Vẽ:* Trục ngang là các năm từ 2013 đến 2020. Trục đứng là số trận thắng. Biểu diễn các điểm mốc và nối lại.
    b) *Nhận xét:* Số trận thắng của đội bóng biến động **thất thường**, tăng giảm liên tục qua các năm chứ không có một xu thế tăng rõ rệt hay giảm rõ rệt. Đạt kỉ lục cao nhất năm 2014 ($42$ trận) và thấp nhất năm 2015 ($15$ trận).

---

### IV. Bài tập phần Luyện tập chung (Trang 107)

#### Bài 5.14
*   **Đề bài:** Xác định phương pháp thu thập dữ liệu và phân loại dữ liệu trong các trường hợp:
    a) Mức độ thường xuyên tập thể dục buổi sáng (rất thường xuyên, thường xuyên, không thường xuyên).
    b) Phương tiện giao thông các bạn trong lớp sử dụng đến trường.
*   **Lời giải:**
    a) Phương pháp thu thập: **Lập bảng hỏi (phiếu khảo sát) hoặc phỏng vấn**.
    Loại dữ liệu: **Dữ liệu không là số, có thể sắp xếp thứ tự**.
    b) Phương pháp thu thập: **Quan sát trực tiếp hoặc lập phiếu hỏi**.
    Loại dữ liệu: **Dữ liệu không là số, không thể sắp xếp thứ tự**.

#### Bài 5.15
*   **Đề bài:** Đánh giá tính đại diện của dữ liệu:
    a) Để xác định sức bật cao của học sinh khối 7, giáo viên khảo sát các bạn trong câu lạc bộ bóng rổ.
    b) Để khảo sát ý kiến của học sinh về quy định mới, trường đã chọn ngẫu nhiên một số học sinh khối 7 để phát phiếu hỏi.
*   **Lời giải:**
    a) **Không đảm bảo tính đại diện** vì các thành viên câu lạc bộ bóng rổ có thể chất, chiều cao vượt trội nên sức bật sẽ tốt hơn nhiều so với mặt bằng chung học sinh khối 7.
    b) **Không đảm bảo tính đại diện** vì khảo sát ý kiến học sinh toàn trường mà chỉ chọn ngẫu nhiên học sinh khối 7, bỏ qua khối 6, 8, 9 (những khối có thể có quan điểm khác do độ tuổi và trải nghiệm khác nhau).

#### Bài 5.16
*   **Đề bài:** Biểu đồ thể trạng học sinh THCS của một tỉnh có tỉ lệ béo phì là $15\%$. Một trường THCS có 1 500 học sinh. Hãy ước lượng số học sinh béo phì.
*   **Lời giải:**
    Ước lượng số học sinh béo phì của trường đó là:
    $$1\,500 \cdot 15\% = 225 	ext{ (học sinh)}$$

#### Bài 5.17
*   **Đề bài:** Vẽ biểu đồ đoạn thẳng biểu diễn nhiệt độ không khí trung bình Hà Nội từ 2014 đến 2019: 24.6; 25.3; 25.2; 25.1; 25.1; 25.9 ($^\circ	ext{C}$).
*   **Lời giải:**
    *   *Hướng dẫn:* Do nhiệt độ biến thiên nhỏ (từ 24.6 đến 25.9), ta chọn trục đứng bắt đầu từ giá trị $24$ đến $26.5$ để đường biểu đồ dốc rõ ràng, dễ nhìn thấy xu thế tăng nhiệt độ đột ngột vào năm 2019.

---

### V. Lời giải Bài tập cuối chương V (Trang 108 - 109)

#### Bài 5.18
*   **Đề bài:** Cho biểu đồ Hình 5.37 về mơ ước nghề nghiệp của học sinh khối 7:
    *   Nam: Bác sĩ ($33\%$), Công an ($27\%$), Giáo viên ($13\%$), Kĩ sư ($7\%$), Khác ($20\%$).
    *   Nữ: Bác sĩ ($29\%$), Công an ($8\%$), Giáo viên ($42\%$), Kĩ sư ($4\%$), Khác ($17\%$).
    a) Lập bảng thống kê ước mơ nghề nghiệp của học sinh nam, nữ.
    b) Liệt kê các nghề có tỉ lệ bạn nữ chọn cao hơn bạn nam.
    c) Khối 7 có 250 học sinh (130 nam, 120 nữ). Dự đoán số học sinh mong muốn trở thành giáo viên.
*   **Lời giải:**
    a) *Bảng thống kê:*
    | Nghề nghiệp | Tỉ lệ học sinh Nam (%) | Tỉ lệ học sinh Nữ (%) |
    | :--- | :---: | :---: |
    | Bác sĩ | 33 | 29 |
    | Công an | 27 | 8 |
    | Giáo viên | 13 | 42 |
    | Kĩ sư | 7 | 4 |
    | Khác | 20 | 17 |

    b) Nghề nghiệp có tỉ lệ bạn nữ chọn cao hơn bạn nam là: **Giáo viên** ($42\% > 13\%$).
    c) Số bạn nam ước mơ làm giáo viên: $130 \cdot 13\% = 16,9$ (bạn).
    Số bạn nữ ước mơ làm giáo viên: $120 \cdot 42\% = 50,4$ (bạn).
    Tổng số học sinh ước mơ trở thành giáo viên là: $16,9 + 50,4 = 67,3 pprox 67$ học sinh.

#### Bài 5.19
*   **Đề bài:** Cho biểu đồ GDP Việt Nam (2014-2019) và Cơ cấu đóng góp các khu vực kinh tế năm 2019.
    a) Mỗi biểu đồ cho biết thông tin gì?
    b) Năm 2019 GDP đạt bao nhiêu tỉ USD, mỗi ngành đóng góp bao nhiêu biết: Dịch vụ (45%), Nông nghiệp (5%), Công nghiệp & xây dựng (50%).
*   **Lời giải:**
    a) 
    *   Biểu đồ Hình 5.38a (Biểu đồ đoạn thẳng) cho biết: **Tổng sản phẩm quốc nội (GDP) của Việt Nam liên tục tăng qua các năm từ 2014 đến 2019 (đơn vị tỉ đô la)**.
    *   Biểu đồ Hình 5.38b (Biểu đồ hình quạt tròn) cho biết: **Tỉ lệ cơ cấu đóng góp của ba khu vực kinh tế vào GDP Việt Nam năm 2019**.
    b) Năm 2019, GDP Việt Nam đạt **$261$ tỉ USD** (theo biểu đồ đoạn thẳng).
    Số tiền đóng góp cụ thể của từng ngành kinh tế:
    *   Ngành Dịch vụ: $261 \cdot 45\% = 117,45$ tỉ USD.
    *   Ngành Nông nghiệp: $261 \cdot 5\% = 13,05$ tỉ USD.
    *   Ngành Công nghiệp và xây dựng: $261 \cdot 50\% = 130,5$ tỉ USD.

#### Bài 5.20
*   **Đề bài:** Cho biểu đồ đoạn thẳng dự báo quy mô dân số Trung Quốc và Ấn Độ đến năm 2050 (Hình 5.40).
    a) Năm 2020, số dân nước nào lớn hơn, tương ứng khoảng bao nhiêu?
    b) Khoảng năm nào dân số hai nước bằng nhau?
    c) Xác định xu hướng tăng/giảm dân số của mỗi nước trong quá khứ và tương lai.
*   **Lời giải:**
    a) Năm 2020, số dân **Trung Quốc lớn hơn** Ấn Độ. Số dân Trung Quốc là **$1,44$ tỉ người**, số dân Ấn Độ là **$1,38$ tỉ người**.
    b) Dân số hai nước sẽ bằng nhau vào **khoảng năm 2023 - 2025** (tương ứng điểm giao nhau của hai đồ thị giữa năm 2020 và 2030).
    c) Xu hướng biến động:
    *   **Trung Quốc:** Dân số tăng dần từ năm 2000 đến đỉnh khoảng năm 2030 ($1,46$ tỉ người), sau đó có xu hướng giảm liên tục cho đến năm 2050 ($1,4$ tỉ người).
    *   **Ấn Độ:** Dân số có xu hướng tăng trưởng liên tục và mạnh mẽ trong suốt giai đoạn từ năm 2000 đến năm 2050 (từ $1,06$ tỉ người lên đến $1,64$ tỉ người).

#### Bài 5.21
*   **Đề bài:** Lựa chọn loại biểu đồ phù hợp cho tình huống:
    a) Tỉ lệ đóng góp vào GDP của các thành phần kinh tế ở Việt Nam.
    b) Sự thay đổi của giá gạo xuất khẩu từ năm 2010 đến nay.
*   **Lời giải:**
    a) Chọn **Biểu đồ hình quạt tròn** vì mục tiêu là biểu diễn tỉ lệ/cơ cấu các thành phần trong một tổng thể ($100\%$).
    b) Chọn **Biểu đồ đoạn thẳng** vì mục tiêu là biểu diễn sự thay đổi của một đại lượng (giá gạo) biến động theo thời gian.
