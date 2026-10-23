# 5.5 — Human Review & Confidence Calibration

## Tổng quan

Khi Claude trích xuất dữ liệu hàng loạt (hóa đơn, hợp đồng, biểu mẫu), không thể để mọi kết quả đi thẳng vào hệ thống mà cũng không thể cho người duyệt từng mục. Bài toán là **thiết kế quy trình duyệt của con người** dựa trên số liệu đáng tin: duyệt cái gì, bao nhiêu, theo thứ tự nào, và khi nào được phép tự động hóa.

Đề thi nhắm vào bốn sai lầm: tin vào **độ chính xác tổng hợp** che khuất nhóm yếu, chỉ duyệt các mục model báo **độ tự tin thấp**, coi điểm tự tin là **xác suất đúng thật**, và duyệt đều theo thứ tự đến trước. Quy tắc nhớ nhanh: **đo theo từng phân đoạn, lấy mẫu phân tầng cả mục tự tin cao, hiệu chuẩn bằng nhãn thật, xếp ưu tiên theo rủi ro.**

## K1. Đánh giá theo phân đoạn, không chỉ độ chính xác tổng

### Trọng tâm

Độ chính xác tổng (ví dụ 97%) có thể che giấu một **phân đoạn kém** (tài liệu viết tay, ngôn ngữ khác). Phải đo **theo loại tài liệu và theo trường**.

### Giải thích

Giả sử 95% khối lượng là hóa đơn đánh máy rõ nét (độ chính xác 99%) và 5% là hóa đơn quét/viết tay (độ chính xác 60%). Độ chính xác tổng khoảng 97%, trông rất tốt, nhưng nhóm viết tay sai gần nửa số lần. Nếu quyết định tự động hóa dựa trên con số tổng, sẽ có lỗi hệ thống tập trung ở đúng nhóm đó, thường là nhóm có hậu quả lớn hoặc khách hàng quan trọng.

Cách đánh giá đúng:

- Chia theo **document type**, **ngôn ngữ**, **nguồn/định dạng**, **chất lượng quét**.
- Đo theo **từng trường** (field-level): tổng tiền, ngày, mã số có thể có độ chính xác khác nhau, trường rủi ro cao cần chuẩn cao hơn.
- Đặt **ngưỡng cho từng phân đoạn**: cho phép tự động hóa với phân đoạn đạt chuẩn, giữ duyệt người với phân đoạn chưa đạt.
- Theo dõi theo thời gian: một phân đoạn có thể xấu đi khi xuất hiện mẫu mới.

Nguyên lý thống kê: số trung bình có thể che giấu phương sai giữa các nhóm con (giống nghịch lý Simpson). Quyết định tự động hóa phải dựa trên **hiệu năng của phân đoạn có rủi ro nhất**, không phải trung bình.

### Keyword

- `aggregate accuracy` — độ chính xác tổng hợp trên toàn bộ dữ liệu
- `segment-level evaluation` — đánh giá theo từng phân đoạn
- `field-level accuracy` — độ chính xác theo từng trường dữ liệu
- `document type` — loại tài liệu (đánh máy, viết tay, quét...)
- `automation threshold` — ngưỡng cho phép tự động hóa

### Bẫy đề thi

- ✗ Độ chính xác tổng 97% nghĩa là tự động duyệt tất cả ⇒ ✓ Kiểm tra từng phân đoạn và trường trước khi tự động hóa
- ✗ Dùng một ngưỡng chung cho mọi loại tài liệu ⇒ ✓ Ngưỡng theo phân đoạn và mức rủi ro
- ✗ Chỉ đo độ chính xác ở mức toàn bộ tài liệu ⇒ ✓ Đo theo trường quan trọng (tổng tiền, ngày, mã)

### Câu hỏi

#### Q1. Hệ thống trích xuất hóa đơn đạt 97% tổng thể, ban quản lý muốn bỏ duyệt thủ công. Dữ liệu cho thấy 5% hóa đơn viết tay có độ chính xác thấp. Quyết định hợp lý?
- A. Bỏ duyệt vì 97% đã cao
- B. Chỉ bỏ duyệt cho phân đoạn đạt chuẩn, giữ duyệt người cho hóa đơn viết tay
- C. Duyệt đều 100% mọi hóa đơn mãi mãi
- D. Chờ đến khi độ chính xác tổng đạt 100%

**Đáp án:** B

**Giải thích:** Quyết định tự động hóa theo phân đoạn: nhóm tốt được tự động, nhóm yếu giữ người. A bỏ qua nhóm yếu. C lãng phí nguồn lực. D không thực tế.

#### Q2. Vì sao cần đo độ chính xác theo từng trường chứ không chỉ theo từng tài liệu?
- A. Vì trường nào cũng có cùng mức độ chính xác
- B. Vì tài liệu không thể chia thành trường
- C. Để giảm chi phí gọi API
- D. Vì một số trường (tổng tiền, mã số) có thể kém hơn và mức rủi ro cao hơn các trường khác

**Đáp án:** D

**Giải thích:** Chất lượng và hậu quả sai khác nhau theo trường, nên cần tiêu chuẩn riêng. A, B sai về sự thật. C không phải mục đích.

## K2. Lấy mẫu phân tầng, kể cả mục tự tin cao

### Trọng tâm

Phải **lấy mẫu ngẫu nhiên có phân tầng** để người duyệt kiểm tra mọi nhóm, **gồm cả kết quả model tự tin cao**; không chỉ duyệt mục "tự tin thấp".

### Giải thích

Nếu chỉ duyệt các mục model báo tự tin thấp, bạn không bao giờ phát hiện được trường hợp **sai mà vẫn tự tin** (confidently wrong): ví dụ bố cục hóa đơn mới khiến model đọc nhầm cột tổng tiền nhưng vẫn tự tin 0,97. Lỗi này lọt hoàn toàn vào hệ thống và không có tín hiệu cảnh báo.

**Stratified sampling** nghĩa là chia dữ liệu thành các tầng (strata) theo phân đoạn và dải tự tin (cao, vừa, thấp), rồi lấy mẫu ngẫu nhiên trong từng tầng:

| Tầng | Mục đích lấy mẫu |
|---|---|
| Tự tin thấp | Bắt lỗi dự đoán được, huấn luyện lại quy tắc |
| Tự tin cao | Phát hiện lỗi tự tin sai, bố cục mới, drift |
| Phân đoạn mới/hiếm | Phát hiện sớm nhóm hoạt động kém |

Kết quả mẫu cho ra **ước lượng tỷ lệ lỗi theo từng tầng**, cơ sở để điều chỉnh ngưỡng tự động hóa. Việc lấy mẫu phải là **ngẫu nhiên** trong tầng (không chọn tay), để ước lượng không bị lệch.

Lưu ý liên quan: lấy mẫu liên tục (không chỉ lúc triển khai) giúp phát hiện **model/data drift** khi định dạng đầu vào đổi.

### Keyword

- `stratified sampling` — lấy mẫu phân tầng theo nhóm
- `confidently wrong` — sai nhưng vẫn báo tự tin cao
- `drift` — phân phối dữ liệu thay đổi theo thời gian làm giảm chất lượng
- `random audit` — kiểm tra ngẫu nhiên để ước lượng không thiên lệch
- `confidence band` — dải điểm tự tin (cao, vừa, thấp)

### Bẫy đề thi

- ✗ Chỉ duyệt các mục model báo tự tin thấp ⇒ ✓ Lấy mẫu ngẫu nhiên từ mọi tầng, kể cả tự tin cao
- ✗ Chọn tay các mẫu "trông đáng ngờ" để kiểm ⇒ ✓ Lấy mẫu ngẫu nhiên trong từng tầng để ước lượng không lệch
- ✗ Kiểm tra một lần lúc triển khai là đủ ⇒ ✓ Lấy mẫu liên tục để phát hiện drift

### Câu hỏi

#### Q1. Nhà cung cấp đổi bố cục hóa đơn; model vẫn báo tự tin cao nhưng đọc sai tổng tiền. Quy trình chỉ duyệt mục tự tin thấp không phát hiện được. Cải tiến đúng?
- A. Hạ ngưỡng tự tin xuống còn 0,5 để duyệt ít hơn
- B. Thêm lời nhắc "hãy cẩn thận hơn" vào prompt trích xuất
- C. Bỏ duyệt hoàn toàn vì model đã tự tin
- D. Thêm lấy mẫu ngẫu nhiên phân tầng trên cả kết quả tự tin cao, theo từng loại bố cục

**Đáp án:** D

**Giải thích:** Chỉ lấy mẫu ở tầng tự tin cao mới bắt được lỗi tự tin sai và bố cục mới. A làm tình trạng tệ hơn. B không tạo tín hiệu phát hiện lỗi. C loại bỏ lưới an toàn.

#### Q2. Điểm khác biệt chính giữa lấy mẫu ngẫu nhiên phân tầng và chọn tay các mẫu đáng ngờ là gì?
- A. Chọn tay luôn nhanh hơn và chính xác hơn
- B. Lấy mẫu ngẫu nhiên trong từng tầng cho ước lượng tỷ lệ lỗi không thiên lệch của tầng đó
- C. Hai cách như nhau về mặt thống kê
- D. Lấy mẫu ngẫu nhiên chỉ dùng cho dữ liệu nhỏ

**Đáp án:** B

**Giải thích:** Tính ngẫu nhiên đảm bảo mẫu đại diện cho tầng. Chọn tay (A, C) gây thiên lệch. D sai: phương pháp áp dụng cho mọi quy mô.

## K3. Hiệu chuẩn độ tự tin bằng dữ liệu có nhãn

### Trọng tâm

Điểm tự tin do model đưa ra **không phải xác suất đúng thực tế**. Phải **hiệu chuẩn (calibrate)** ngưỡng bằng tập dữ liệu có nhãn (ground truth) giữ riêng.

### Giải thích

Model nói "0,95" không có nghĩa là 95% trường hợp như vậy là đúng. Khi so với nhãn thật, có thể chỉ 82% đúng (**overconfident**), hoặc ngược lại. Mức độ khớp giữa điểm tự tin và tỷ lệ đúng thực tế gọi là **calibration**.

Cách hiệu chuẩn:

1. Chuẩn bị tập **held-out có nhãn** đại diện cho dữ liệu thực (gồm cả các phân đoạn khó, K1).
2. Chạy model, thu điểm tự tin cho từng trường.
3. Chia theo dải điểm và tính **tỷ lệ đúng thực** của từng dải (có thể vẽ reliability diagram).
4. Chọn **ngưỡng tự động duyệt** sao cho đạt tỷ lệ lỗi chấp nhận được **theo dữ liệu thực nghiệm**, ví dụ "dải ≥ 0,97 mới đạt 99% đúng".
5. Kiểm tra lại định kỳ vì model và dữ liệu đổi.

Cần dùng dữ liệu **held-out** (không dùng để chỉnh prompt) để tránh ước lượng quá lạc quan. Với trường hợp điểm tự tin do chính LLM tự nêu bằng văn bản, độ lệch thường lớn; nên kết hợp tín hiệu khác (kiểm tra ràng buộc, đồng thuận nhiều lần chạy, kiểm tra chéo trường) khi đánh giá.

Tóm lại: ngưỡng là **tham số rút ra từ đo đạc**, không phải con số chọn theo cảm giác.

### Keyword

- `calibration` — hiệu chuẩn: điểm tự tin khớp tỷ lệ đúng thực tế
- `ground truth` — nhãn đúng do con người xác nhận
- `held-out set` — tập dữ liệu giữ riêng để đánh giá không thiên lệch
- `overconfidence` — tự tin quá mức so với độ chính xác thực
- `reliability diagram` — biểu đồ so sánh độ tự tin với tỷ lệ đúng thực

### Bẫy đề thi

- ✗ Coi điểm 0,95 là 95% khả năng đúng ⇒ ✓ Đo tỷ lệ đúng thực tế trên dữ liệu có nhãn rồi mới đặt ngưỡng
- ✗ Chọn ngưỡng theo cảm giác (0,9 trông ổn) ⇒ ✓ Chọn ngưỡng từ đo đạc trên tập held-out
- ✗ Hiệu chuẩn một lần rồi dùng mãi ⇒ ✓ Kiểm tra lại định kỳ vì dữ liệu và model thay đổi

### Câu hỏi

#### Q1. Model báo tự tin 0,95 cho các trường số tiền, nhưng đối chiếu nhãn thật chỉ 82% đúng. Hành động đúng?
- A. Giữ ngưỡng vì 0,95 đã cao
- B. Hiệu chuẩn lại: đo tỷ lệ đúng theo dải điểm trên tập có nhãn và đặt ngưỡng dựa trên đó
- C. Nhân điểm tự tin với 0,82 cho mọi trường hợp
- D. Hỏi lại model xem nó có chắc không

**Đáp án:** B

**Giải thích:** Hiệu chuẩn dựa trên ground truth cho ngưỡng có ý nghĩa thực nghiệm. A bỏ qua độ lệch. C là sửa tùy tiện một hệ số. D vẫn dựa vào tự đánh giá không đáng tin.

#### Q2. Vì sao cần tập held-out khi hiệu chuẩn ngưỡng?
- A. Để model học thuộc nhãn
- B. Vì tập này luôn nhỏ nên chạy nhanh
- C. Để tránh ước lượng lạc quan do đã dùng cùng dữ liệu chỉnh prompt
- D. Vì ngưỡng không cần dữ liệu

**Đáp án:** C

**Giải thích:** Dữ liệu đã dùng để tinh chỉnh sẽ cho kết quả đẹp hơn thực tế. A sai mục đích. B không phải lý do. D mâu thuẫn với nguyên tắc hiệu chuẩn.

## K4. Xếp hàng duyệt theo bất định và rủi ro

### Trọng tâm

Nguồn lực duyệt có hạn: **ưu tiên** mục bất định, mâu thuẫn, thuộc phân đoạn yếu hoặc có tác động lớn, thay vì duyệt FIFO hoặc đồng đều.

### Giải thích

Số người duyệt hữu hạn, nên thứ tự duyệt quyết định giá trị nhận được. Duyệt theo thứ tự đến trước (FIFO) hay duyệt đều mọi mục coi trọng mục rủi ro thấp ngang mục rủi ro cao.

Điểm ưu tiên có thể kết hợp các yếu tố:

- **Bất định**: điểm tự tin thấp (đã hiệu chuẩn, K3), hai lần chạy cho kết quả khác nhau.
- **Mâu thuẫn**: trường vi phạm ràng buộc (tổng chi tiết không khớp tổng cộng, ngày trong tương lai).
- **Phân đoạn yếu**: loại tài liệu có tỷ lệ lỗi cao (K1).
- **Tác động**: giá trị tiền lớn, trường nhạy cảm, khách quan trọng.
- **Mới/lạ**: bố cục chưa gặp.

Triển khai đơn giản: tính điểm rủi ro cho từng mục, sắp xếp hàng đợi giảm dần, phân bổ người duyệt từ đầu hàng. Vẫn giữ một phần **lấy mẫu ngẫu nhiên** (K2) để không chỉ nhìn vào thứ model đã nghi ngờ.

Phản hồi từ người duyệt (sửa gì, vì sao) nên quay lại làm **dữ liệu có nhãn mới** để cải tiến hiệu chuẩn và prompt, tạo vòng lặp cải thiện liên tục.

### Keyword

- `review queue` — hàng đợi các mục chờ người duyệt
- `risk-based prioritization` — ưu tiên theo mức rủi ro
- `FIFO` — vào trước ra trước, không xét độ ưu tiên
- `constraint violation` — vi phạm ràng buộc dữ liệu (tổng không khớp...)
- `feedback loop` — phản hồi của người duyệt quay lại cải tiến hệ thống

### Bẫy đề thi

- ✗ Duyệt tuần tự theo thứ tự đến ⇒ ✓ Ưu tiên theo bất định, mâu thuẫn và tác động
- ✗ Chỉ ưu tiên theo điểm tự tin, bỏ qua giá trị tiền ⇒ ✓ Kết hợp nhiều yếu tố rủi ro
- ✗ Bỏ lấy mẫu ngẫu nhiên khi đã có hàng đợi ưu tiên ⇒ ✓ Vẫn giữ mẫu ngẫu nhiên để bắt lỗi tự tin sai

### Câu hỏi

#### Q1. Chỉ có 3 người duyệt cho hàng nghìn hóa đơn mỗi ngày. Cách phân bổ hiệu quả nhất?
- A. Duyệt theo thứ tự nhận được
- B. Chia đều số hóa đơn, duyệt ngẫu nhiên hoàn toàn
- C. Ưu tiên mục bất định, vi phạm ràng buộc, phân đoạn yếu và giá trị lớn, kèm một phần mẫu ngẫu nhiên
- D. Chỉ duyệt hóa đơn giá trị thấp để làm nhanh

**Đáp án:** C

**Giải thích:** Tập trung nguồn lực vào rủi ro cao nhất, giữ mẫu ngẫu nhiên để phát hiện lỗi ẩn. A và B không tính rủi ro. D ngược logic.

#### Q2. Một hóa đơn có tổng chi tiết không khớp tổng cộng nhưng điểm tự tin 0,96. Nên xử lý thế nào trong hàng đợi?
- A. Tự động duyệt vì điểm tự tin cao
- B. Đẩy lên đầu hàng đợi duyệt vì vi phạm ràng buộc
- C. Xóa hóa đơn khỏi hệ thống
- D. Chờ đến cuối ngày mới xem

**Đáp án:** B

**Giải thích:** Mâu thuẫn dữ liệu là tín hiệu lỗi khách quan, mạnh hơn điểm tự tin chưa chắc đã chuẩn. A phớt lờ mâu thuẫn. C mất dữ liệu. D bỏ lỡ mục rủi ro cao.
