# 5.2 — Escalation & Ambiguity Resolution

## Tổng quan

Một agent hỗ trợ khách hàng phải biết khi nào **tự giải quyết** và khi nào **chuyển cho con người (escalate)**. Quyết định này cần dựa trên tiêu chí rõ ràng, quan sát được, không dựa vào những tín hiệu mơ hồ như cảm xúc của khách hay "độ tự tin" model tự báo. Ngoài ra agent còn gặp các tình huống mơ hồ (nhiều tài khoản trùng tên, chính sách không đề cập) mà không được đoán bừa.

Đề thi thích đặt hai phương án "nghe hợp lý": một bên là cơ chế tinh vi (sentiment analysis, confidence score), một bên là quy tắc đơn giản (tôn trọng yêu cầu gặp người thật, hỏi thêm định danh). Quy tắc nhớ nhanh: **khách yêu cầu người thật thì chuyển ngay; chính sách im lặng thì chuyển; mơ hồ danh tính thì hỏi thêm; đừng dùng cảm xúc hay confidence làm tiêu chí duy nhất.**

## K1. Khách yêu cầu gặp người thật — escalate ngay

### Trọng tâm

Khi khách **nói rõ muốn gặp nhân viên**, agent phải chuyển ngay kèm ngữ cảnh vụ việc, không thuyết phục họ ở lại, không điều tra thêm.

### Giải thích

Yêu cầu trực tiếp "cho tôi gặp nhân viên" là tín hiệu rõ ràng nhất về điều khách muốn. Tôn trọng quyền lựa chọn này là nguyên tắc cơ bản của dịch vụ. Nếu agent cố "thử giải quyết trước", chạy phân tích cảm xúc, hoặc hỏi dồn "bạn có chắc không?", khách sẽ bực hơn và tin tưởng hệ thống ít đi.

Quy trình đúng:

1. Nhận diện yêu cầu rõ ràng (câu như "transfer me to a human", "tôi muốn nói chuyện với người thật").
2. Gọi tool/handoff `escalate_to_human` ngay.
3. Truyền theo **bản tóm tắt có cấu trúc** (customer ID, vấn đề, các bước đã làm, dữ kiện từ K1 của bài 5.1) để người nhận không phải hỏi lại từ đầu.
4. Thông báo ngắn gọn cho khách rằng đang chuyển.

Phân biệt: nếu khách chỉ **bày tỏ bực bội** nhưng không yêu cầu người thật, agent có thể thừa nhận cảm xúc và đề nghị giải quyết, và chỉ escalate nếu khách lặp lại yêu cầu hoặc vấn đề vượt thẩm quyền. Nếu khách **đã nói muốn người thật** thì không còn chỗ cho thương lượng.

Tín hiệu chuyển người xác định (explicit) luôn ưu tiên hơn tín hiệu suy đoán (implicit).

### Keyword

- `escalation` — chuyển vụ việc cho con người hoặc cấp xử lý cao hơn
- `explicit request` — yêu cầu nói rõ của khách (khác với suy đoán từ cảm xúc)
- `handoff summary` — bản tóm tắt bàn giao cho người nhận
- `escalate_to_human` — tool/handoff chuyển cuộc hội thoại cho nhân viên
- `customer autonomy` — quyền tự quyết của khách về kênh hỗ trợ

### Bẫy đề thi

- ✗ Chạy sentiment analysis trước để xem có cần chuyển không ⇒ ✓ Yêu cầu rõ ràng của khách thì chuyển ngay
- ✗ Cố thuyết phục khách thử tự phục vụ thêm một lần ⇒ ✓ Tôn trọng lựa chọn, bàn giao kèm ngữ cảnh
- ✗ Chuyển người nhưng không kèm thông tin vụ việc ⇒ ✓ Truyền bản tóm tắt có cấu trúc để khỏi hỏi lại

### Câu hỏi

#### Q1. Khách viết: "Tôi muốn nói chuyện với nhân viên thật, không phải bot." Agent vừa có thể tra cứu nhanh đơn hàng của họ. Hành động đúng?
- A. Tra cứu đơn, giải quyết xong rồi mới hỏi khách có còn cần người thật không
- B. Chạy phân tích cảm xúc để xác nhận mức độ bực bội
- C. Chuyển ngay cho nhân viên, kèm bản tóm tắt vụ việc và dữ kiện đã có
- D. Yêu cầu khách mô tả lại vấn đề cho đủ chi tiết trước khi chuyển

**Đáp án:** C

**Giải thích:** Yêu cầu trực tiếp phải được tôn trọng ngay; bàn giao kèm ngữ cảnh để người nhận tiếp tục liền mạch. A và D trì hoãn trái ý khách. B dùng tín hiệu suy đoán trong khi đã có tín hiệu rõ ràng.

#### Q2. Khách nói "Dịch vụ này tệ quá!" nhưng không yêu cầu gặp người thật, và vấn đề (theo dõi vận đơn) agent có thể giải quyết ngay. Cách xử lý phù hợp?
- A. Thừa nhận sự khó chịu, giải quyết vấn đề, và sẵn sàng chuyển nếu khách yêu cầu
- B. Tự động chuyển cho nhân viên vì cảm xúc tiêu cực
- C. Từ chối xử lý cho đến khi khách bình tĩnh
- D. Chuyển ngay vì chắc chắn khách muốn người thật

**Đáp án:** A

**Giải thích:** Bực bội không đồng nghĩa với yêu cầu chuyển người hay vấn đề không giải quyết được. Giải quyết nhanh vấn đề thường làm khách hài lòng nhất, và vẫn tôn trọng nếu họ yêu cầu về sau. B và D suy diễn từ cảm xúc. C là phản ứng không hữu ích.

## K2. Khoảng trống chính sách và vi phạm chính sách

### Trọng tâm

**Chính sách có quy định rõ** thì áp dụng theo quy định (kể cả từ chối). **Chính sách không đề cập** (policy gap) thì không tự sáng tạo quy tắc: chuyển cho người có thẩm quyền.

### Giải thích

Có hai loại tình huống dễ bị nhầm:

| Tình huống | Ví dụ | Xử lý đúng |
|---|---|---|
| Vi phạm/ngoài quy định rõ ràng | Chính sách ghi "chỉ hoàn tiền trong 30 ngày", khách yêu cầu ở ngày thứ 45 | Áp dụng quy định, giải thích, đưa phương án thay thế nếu có |
| Khoảng trống (gap) | Chính sách chỉ nói "price match với cửa hàng của chúng ta", khách yêu cầu khớp giá với đối thủ | Chuyển cho người có thẩm quyền quyết định |

Khi gặp gap, agent không có cơ sở để quyết định: nếu tự đồng ý, có thể cam kết điều công ty không cho phép; nếu tự từ chối, có thể bỏ lỡ một ngoại lệ hợp lý. Chuyển lên người có quyền (empowered human) là cách giữ nhất quán và trách nhiệm.

Với vi phạm rõ ràng, việc chuyển lên người cũng không cần thiết: quy tắc đã trả lời sẵn, và chuyển oan sẽ làm hàng đợi nhân viên đầy lên. Vì vậy agent cần **tiêu chí escalation rõ ràng trong system prompt**, kèm ví dụ few-shot cho từng loại (xem bài 4.1, 4.2), thay vì để model tự ước lượng.

### Keyword

- `policy gap` — khoảng trống chính sách: tình huống chính sách không đề cập
- `policy violation` — yêu cầu nằm ngoài quy định rõ ràng
- `empowered human` — nhân viên có thẩm quyền ra quyết định ngoại lệ
- `escalation criteria` — tiêu chí chuyển cấp, được nêu rõ trong prompt
- `consistency` — tính nhất quán khi áp dụng chính sách

### Bẫy đề thi

- ✗ Tự đặt ra quy tắc mới khi chính sách không đề cập ⇒ ✓ Chuyển cho người có thẩm quyền
- ✗ Chuyển mọi từ chối chính sách cho nhân viên ⇒ ✓ Quy định rõ thì áp dụng và giải thích, không cần chuyển
- ✗ Để model tự cảm nhận khi nào nên chuyển ⇒ ✓ Viết tiêu chí rõ và ví dụ trong system prompt

### Câu hỏi

#### Q1. Chính sách chỉ nêu "hỗ trợ khớp giá với giá của cửa hàng chúng ta". Khách yêu cầu khớp giá với một website đối thủ. Agent nên làm gì?
- A. Từ chối vì không có trong chính sách
- B. Đồng ý khớp giá để giữ khách
- C. Tính trung bình giữa giá hai bên
- D. Chuyển cho nhân viên có thẩm quyền vì đây là khoảng trống chính sách

**Đáp án:** D

**Giải thích:** Chính sách im lặng về trường hợp này, nên quyết định cần người có thẩm quyền. A có thể từ chối oan một ngoại lệ hợp lệ. B cam kết điều chưa được phép. C tự phát minh quy tắc.

#### Q2. Chính sách ghi rõ "không hoàn tiền sau 30 ngày". Khách yêu cầu hoàn tiền ở ngày 45 và không có tình huống đặc biệt nào. Cách xử lý hợp lý?
- A. Luôn chuyển cho nhân viên vì khách có thể phàn nàn
- B. Áp dụng chính sách, giải thích lý do và đưa ra lựa chọn thay thế nếu chính sách cho phép
- C. Phá lệ hoàn tiền để tránh khiếu nại
- D. Bỏ qua yêu cầu và chuyển sang chủ đề khác

**Đáp án:** B

**Giải thích:** Chính sách đã quy định rõ nên agent tự xử lý được. Chuyển tất cả mọi từ chối (A) làm tràn hàng đợi người. C vi phạm chính sách. D thiếu minh bạch và hữu ích.

## K3. Sentiment và độ tự tin không phải tiêu chí đáng tin cậy

### Trọng tâm

**Cảm xúc của khách** và **confidence score do model tự báo** đều không đo được "vấn đề có giải quyết được hay không". Dùng làm tiêu chí escalation duy nhất sẽ chuyển sai và bỏ sót.

### Giải thích

Hai ý tưởng nghe hấp dẫn nhưng có lỗi:

1. **Sentiment**: khách giận dữ có thể hỏi một câu rất đơn giản (kiểm tra vận đơn) mà agent giải quyết được trong một lượt; ngược lại khách rất lịch sự có thể gặp vấn đề vượt thẩm quyền (khiếu nại pháp lý). Cảm xúc không tương quan chắc chắn với độ khó hay thẩm quyền.
2. **Self-reported confidence** (model tự nói "tôi tự tin 90%"): đây là điểm số do model sinh ra, thường **không được hiệu chuẩn**; model có thể rất tự tin khi sai. Không thể chỉ dùng một ngưỡng như `confidence < 0.7` để quyết định chuyển người (xem thêm bài 5.5 về calibration).

Giải pháp đúng là dùng **tiêu chí quan sát được**:

- Khách yêu cầu người thật (K1).
- Vấn đề rơi vào danh mục cần thẩm quyền (hoàn tiền vượt hạn mức, khiếu nại pháp lý).
- Policy gap (K2).
- Agent **không có tiến triển** sau vài lần thử (ví dụ tool liên tục lỗi).

Cảm xúc có thể là **thông tin bổ sung** để điều chỉnh giọng điệu, nhưng không làm công tắc chuyển cấp tự động.

### Keyword

- `sentiment analysis` — phân tích cảm xúc của khách
- `self-reported confidence` — độ tự tin do chính model nêu ra
- `calibration` — mức độ khớp giữa độ tự tin và tỷ lệ đúng thực tế
- `observable criteria` — tiêu chí quan sát được, kiểm chứng được
- `resolvability` — khả năng vấn đề được giải quyết bởi agent

### Bẫy đề thi

- ✗ Escalate mọi khách có cảm xúc tiêu cực ⇒ ✓ Dựa vào yêu cầu rõ ràng, thẩm quyền, policy gap
- ✗ Dùng ngưỡng confidence do model tự báo làm quy tắc chuyển người ⇒ ✓ Dùng tiêu chí khách quan; confidence cần được hiệu chuẩn bằng dữ liệu thật
- ✗ Bỏ qua hoàn toàn cảm xúc khách ⇒ ✓ Dùng để điều chỉnh giọng điệu, không làm công tắc duy nhất

### Câu hỏi

#### Q1. Đội vận hành đề xuất: "Cứ khi nào điểm sentiment dưới ngưỡng thì chuyển nhân viên". Hệ quả có khả năng xảy ra nhất?
- A. Tỷ lệ chuyển người giảm vì cảm xúc ít khi tiêu cực
- B. Chuyển oan nhiều khách giận nhưng hỏi việc đơn giản, đồng thời bỏ sót khách lịch sự có vấn đề vượt thẩm quyền
- C. Mọi vấn đề đều được xử lý chính xác
- D. Agent không còn cần tiêu chí nào khác

**Đáp án:** B

**Giải thích:** Cảm xúc không phản ánh độ phức tạp hay thẩm quyền, nên vừa chuyển nhầm vừa bỏ sót. A và C trái với thực tế. D sai vì vẫn cần tiêu chí khách quan.

#### Q2. Agent được cấu hình tự báo confidence từ 0 đến 1 và chuyển người khi dưới 0,7. Khi kiểm tra, nhiều ca model báo 0,9 nhưng sai. Điều chỉnh nào hợp lý?
- A. Nâng ngưỡng lên 0,95 và giữ cơ chế
- B. Yêu cầu model "tự tin một cách thận trọng hơn"
- C. Dùng tiêu chí khách quan (yêu cầu người thật, danh mục cần thẩm quyền, policy gap) và đánh giá confidence bằng dữ liệu có nhãn
- D. Bỏ escalation hoàn toàn

**Đáp án:** C

**Giải thích:** Confidence tự báo chưa hiệu chuẩn nên không tin cậy làm tiêu chí duy nhất; cần tiêu chí quan sát được và kiểm tra bằng ground truth. A chỉ đổi con số trên cùng một tín hiệu kém. B là chỉ dẫn bằng prompt không sửa được độ lệch. D bỏ mất lưới an toàn.

## K4. Nhiều kết quả khớp — làm rõ danh tính, không đoán

### Trọng tâm

Khi tra cứu trả về **nhiều bản ghi khớp** (ví dụ ba khách trùng tên), phải **hỏi thêm định danh** (mã đơn, email, số điện thoại đã xác minh), không chọn theo heuristic.

### Giải thích

Tool `get_customer` theo tên có thể trả về 3 tài khoản "Nguyễn Văn An". Nếu agent chọn tài khoản hoạt động gần nhất hoặc đầu danh sách, nó có thể thao tác trên **sai người**: tiết lộ thông tin của người khác (vi phạm riêng tư) hoặc hoàn tiền nhầm tài khoản. Đây là loại lỗi rủi ro cao, hậu quả không dễ đảo ngược.

Cách xử lý:

- Phát hiện kết quả không duy nhất (số bản ghi > 1) và **dừng thao tác phá hủy/nhạy cảm**.
- Yêu cầu khách cung cấp **định danh bổ sung** mà chỉ chủ tài khoản biết: mã đơn gần đây, email đăng ký, 4 số cuối thẻ (theo quy trình xác minh của công ty).
- Chỉ tiếp tục khi chỉ còn đúng một bản ghi được xác minh.
- Không tiết lộ chi tiết của các bản ghi khác trong lúc hỏi (ví dụ không đọc ra địa chỉ của từng tài khoản).

Heuristic như "tài khoản hoạt động gần nhất" hay "khớp nhiều nhất" nghe có lý nhưng chỉ cho xác suất, trong khi thao tác tài chính cần tính chắc chắn.

### Keyword

- `disambiguation` — làm rõ khi có nhiều khả năng
- `identity verification` — xác minh danh tính khách
- `multiple matches` — nhiều bản ghi khớp truy vấn
- `heuristic selection` — chọn theo quy tắc kinh nghiệm (không chắc chắn)
- `irreversible action` — thao tác khó hoặc không thể đảo ngược

### Bẫy đề thi

- ✗ Chọn tài khoản hoạt động gần nhất khi có nhiều kết quả ⇒ ✓ Hỏi định danh bổ sung rồi mới thao tác
- ✗ Đọc ra thông tin của từng tài khoản để khách chọn ⇒ ✓ Hỏi thông tin mà chỉ chủ tài khoản biết, không lộ dữ liệu
- ✗ Coi một kết quả đầu tiên là đủ để tiếp tục ⇒ ✓ Kiểm tra số kết quả; > 1 thì phải làm rõ

### Câu hỏi

#### Q1. Tool tra cứu theo tên trả về 3 tài khoản cùng tên. Khách yêu cầu hoàn tiền. Cách xử lý đúng?
- A. Chọn tài khoản có hoạt động gần nhất
- B. Chọn tài khoản đầu tiên trong danh sách
- C. Đọc thông tin chi tiết của cả ba để khách tự chọn
- D. Yêu cầu khách cung cấp mã đơn hoặc định danh đã đăng ký rồi mới thao tác

**Đáp án:** D

**Giải thích:** Định danh bổ sung xác định đúng tài khoản mà không lộ dữ liệu. A và B là đoán, có thể hoàn tiền nhầm. C làm lộ thông tin của người khác.

#### Q2. Vì sao việc "chọn tài khoản khớp nhiều nhất" không phù hợp trong tác vụ tài chính?
- A. Vì tool tìm kiếm không hỗ trợ xếp hạng
- B. Vì nó chỉ cho xác suất, trong khi thao tác tiền cần xác minh chắc chắn
- C. Vì làm chậm hệ thống
- D. Vì model không hiểu tên riêng

**Đáp án:** B

**Giải thích:** Độ khớp chỉ là ước lượng; sai là có hậu quả tài chính và riêng tư. A, C, D là lý do không đúng và không liên quan đến nguyên tắc cần tính chắc chắn.
