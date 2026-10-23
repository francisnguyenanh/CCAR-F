# 4.6 — Multi-Instance and Multi-Pass Review

## Tổng quan

Khi cần review hoặc kiểm tra chất lượng bằng Claude ở quy mô lớn (nhiều file, nhiều thay đổi), một lần gọi duy nhất thường không đủ tốt. Bài này nói về cách tổ chức review bằng **nhiều instance độc lập** và **nhiều lượt (multi-pass)**: reviewer riêng biệt không bị "neo" bởi lập luận của bên tạo code, review từng file kỹ rồi một lượt tích hợp xuyên file, định tuyến theo confidence đã hiệu chỉnh và đối chiếu các phán quyết mâu thuẫn.

Đề thi xoay quanh việc nhận ra vì sao review trong cùng một session kém hiệu quả, vì sao nhồi hết file vào một context khổng lồ làm giảm chất lượng, và vì sao điểm confidence thô không dùng để tự động duyệt. Quy tắc nhớ nhanh: **reviewer độc lập thấy nhiều lỗi hơn; chia nhỏ rồi tích hợp; confidence phải hiệu chỉnh mới dùng được; mâu thuẫn giữa các lượt phải được hoà giải.**

## K1. Reviewer độc lập (independent review instance)

### Trọng tâm

Review trong **một invocation mới, không có ngữ cảnh lập luận của bên sinh code** hiệu quả hơn việc bảo chính session đã viết code "tự kiểm tra lại".

### Giải thích

Khi cùng một session vừa viết code vừa review, toàn bộ lập luận trước đó (vì sao chọn cách này, các giả định) vẫn nằm trong context. Model có xu hướng **tiếp nối và bảo vệ** những gì nó đã nói: nhìn lại code sẽ thấy "hợp lý" vì có sẵn lời giải thích, đó là hiệu ứng **anchoring** (neo vào lập luận cũ) cộng với thiên hướng tự khẳng định. Một đoạn code xác thực có lỗ hổng có thể được chính session tạo ra khen là đúng, nhất là khi bạn hỏi "code này đúng chứ?".

Giải pháp là một **instance review độc lập**:

- Tạo cuộc gọi/session **mới**, chỉ truyền cho nó: code cần review, yêu cầu gốc và tiêu chí review (4.1). Không truyền chuỗi lập luận của bên viết.
- Có thể dùng subagent với context riêng (xem domain 1) hoặc một request API hoàn toàn mới.
- Reviewer nhìn code như người ngoài, nên dễ phát hiện giả định sai hơn.

Lưu ý hai điều: (1) hỏi lại session cũ bằng câu "hãy xác nhận lại đây là đúng" không tạo ra độc lập, vì context cũ vẫn còn; (2) dùng **extended thinking** trong cùng session có thể tăng chất lượng suy luận nhưng không loại bỏ hiệu ứng neo từ lập luận trước đó. Độc lập được tạo bằng cách **tách context**, không phải bằng cách yêu cầu "hãy khách quan".

### Keyword

- `independent review` — review bởi instance riêng, không dùng chung ngữ cảnh với bên tạo
- `anchoring` — bị neo vào lập luận đã có trong context nên khó nhìn lại khách quan
- `self-review limitation` — hạn chế của việc tự review trong cùng session
- `fresh invocation` — lần gọi mới, context sạch
- `context isolation` — cô lập ngữ cảnh giữa các instance
- `generator vs reviewer` — tách vai trò sinh nội dung và đánh giá nội dung

### Bẫy đề thi

- ✗ Bảo session viết code "hãy xác nhận lại code này đúng" ⇒ ✓ Dùng instance mới, context sạch để review
- ✗ Dặn "hãy khách quan" trong cùng session thay cho tách context ⇒ ✓ Độc lập đến từ việc cô lập ngữ cảnh
- ✗ Truyền cả lập luận của bên viết cho reviewer ⇒ ✓ Chỉ cho code, yêu cầu và tiêu chí review

### Câu hỏi

#### Q1. Session sinh code xác thực người dùng, khi được hỏi lại "code này an toàn chứ?" đã khẳng định là an toàn, nhưng reviewer người tìm ra lỗ hổng. Cải thiện quy trình tốt nhất?
- A. Hỏi lại session đó thêm một lần nữa
- B. Thêm câu "hãy thật khách quan" vào prompt cùng session
- C. Tăng độ dài context cho session đó
- D. Chạy review bằng một instance mới, chỉ nhận code, yêu cầu và tiêu chí, không nhận lập luận của bên viết

**Đáp án:** D

**Giải thích:** D tách context nên tránh anchoring. A và B vẫn trong context cũ. C không giải quyết thiên hướng tự khẳng định.

#### Q2. Điều gì làm review bằng một instance độc lập thường hiệu quả hơn tự review trong cùng session?
- A. Instance mới dùng model mạnh hơn
- B. Instance mới không bị neo vào lập luận và giả định đã nằm trong context của bên tạo
- C. Instance mới chạy nhanh hơn
- D. Instance mới có context dài hơn

**Đáp án:** B

**Giải thích:** Lợi ích đến từ cô lập ngữ cảnh. A, C, D không phải cơ chế chính, và độc lập vẫn có hiệu quả với cùng model.

## K2. Review cục bộ theo file rồi tích hợp xuyên file (local then global)

### Trọng tâm

Chia thành **các lượt review tập trung theo file (chạy song song)**, rồi thêm **một lượt tích hợp** kiểm tra tính nhất quán giữa các file, thay vì nhồi tất cả vào một context khổng lồ.

### Giải thích

Khi cho model review 30 file trong một context rất lớn, sự chú ý bị **pha loãng**: những file đầu được xem kỹ, các file sau chỉ được lướt, và chi tiết bị bỏ sót hoặc đánh giá không đều. Làm context lớn hơn không giải quyết được; nó thường làm tình hình tệ hơn.

Mô hình hai tầng:

1. **Lượt cục bộ (per-file)**: mỗi file hoặc nhóm nhỏ được review trong instance riêng với cùng tiêu chí. Chạy song song được, mỗi instance tập trung toàn bộ sự chú ý vào ít nội dung, nên phát hiện bug cục bộ sâu hơn.
2. **Lượt tích hợp (cross-file)**: một lượt thứ hai nhận **bản tóm tắt finding và các giao diện/hợp đồng giữa module** (không nhất thiết toàn bộ source), để kiểm tra: hàm A giả định dữ liệu đã được kiểm ở B nhưng B không làm; hai module hiểu khác nhau về cùng một format; luồng dữ liệu nhạy cảm đi qua nhiều file.

```text
Pass 1 (song song): file_1 ... file_N  -> findings_i
Pass 2 (tích hợp):  [findings_1..N + interface contracts] -> cross-file issues
```

Cách này vừa **bảo đảm độ sâu cho từng file** vừa bắt được lỗi chỉ lộ ra khi nhìn nhiều file cùng lúc (lỗi mà review từng file riêng lẻ không thấy). Nó cũng khớp với kỹ thuật chia nhỏ ngữ cảnh ở domain 5.

### Keyword

- `attention dilution` — chú ý bị pha loãng khi context quá lớn
- `per-file review` — review từng file riêng với context tập trung
- `cross-file integration pass` — lượt tích hợp kiểm tra nhất quán giữa các file
- `parallel review` — chạy nhiều instance review song song
- `interface contract` — hợp đồng giao diện giữa các module (kiểu dữ liệu, giả định)
- `larger context fallacy` — ngộ nhận rằng nhồi nhiều vào context lớn hơn sẽ cải thiện kết quả

### Bẫy đề thi

- ✗ Đưa cả 30 file vào một context lớn để review một lần ⇒ ✓ Review theo file song song rồi thêm lượt tích hợp
- ✗ Chỉ review từng file riêng, không kiểm tra liên file ⇒ ✓ Thêm lượt tích hợp cho lỗi xuyên module
- ✗ Cho rằng context window lớn nghĩa là chú ý đồng đều ⇒ ✓ Chất lượng chú ý vẫn giảm khi nhồi quá nhiều

### Câu hỏi

#### Q1. Review 30 file trong một request duy nhất: các file đầu được phân tích kỹ, các file cuối chỉ nhận vài nhận xét chung chung, và có lỗi tương thích giữa module bị bỏ sót. Thiết kế tốt hơn?
- A. Dùng model có context window lớn hơn và gửi tất cả cùng lúc
- B. Chỉ review 10 file đầu
- C. Review song song từng file với tiêu chí chung, rồi một lượt tích hợp xem xét giao diện và nhất quán giữa các file
- D. Yêu cầu model "chú ý đều các file"

**Đáp án:** C

**Giải thích:** Hai tầng giải quyết cả độ sâu lẫn lỗi liên file. A không khắc phục pha loãng. B bỏ sót phần lớn code. D là chỉ dẫn mơ hồ.

#### Q2. Mục đích chính của lượt tích hợp (cross-file pass) là gì?
- A. Lặp lại review từng file lần nữa
- B. Giảm chi phí
- C. Tìm lỗi chỉ lộ ra khi nhìn quan hệ giữa các file như giả định không khớp giữa các module
- D. Thay thế hoàn toàn review từng file

**Đáp án:** C

**Giải thích:** Lượt tích hợp bổ sung cho review cục bộ, tập trung vào lỗi xuyên file. A là lặp thừa. B không phải mục đích. D sai vì cần cả hai tầng.

## K3. Hiệu chỉnh confidence và định tuyến sang người duyệt

### Trọng tâm

**Confidence thô** của model không dùng để tự động duyệt. Hãy **hiệu chỉnh bằng dữ liệu có nhãn**, rồi dùng để chuyển các ca rủi ro cao hoặc không chắc cho người xem.

### Giải thích

Giả sử review tìm ra một giả thuyết race condition và tự đánh confidence 0.9. Nếu bạn đặt quy tắc "≥ 0.9 thì tự động chấp nhận (hoặc tự động bỏ qua nếu thấp)", bạn đang tin vào một con số **chưa từng được kiểm chứng**. Confidence tự báo có thể quá tự tin: ở mức 0.9, tỉ lệ đúng thực tế có thể chỉ 60%.

Quy trình đúng:

1. Thu thập **tập kiểm chứng có nhãn** (finding và kết quả đúng/sai do người xác nhận).
2. Đo mối quan hệ giữa confidence và độ đúng thực tế, từ đó hiệu chỉnh hoặc chọn ngưỡng dựa trên dữ liệu.
3. Dùng **định tuyến theo rủi ro**: finding có confidence thấp, hoặc thuộc loại hậu quả nặng (bảo mật, mất dữ liệu), được chuyển cho người xem; finding tự tin và rủi ro thấp đi đường nhanh hơn.
4. Tiếp tục đo lại theo thời gian vì chất lượng có thể thay đổi khi đổi prompt hay model.

Phân biệt hai vai trò: **tiêu chí khách quan** quyết định cái gì là lỗi (4.1); **confidence đã hiệu chỉnh** chỉ quyết định **ai/đường nào** xử lý. Rủi ro của sai sót nên có trọng số: một finding bảo mật không chắc chắn vẫn nên được người xem dù confidence trung bình.

### Keyword

- `confidence calibration` — hiệu chỉnh confidence cho khớp với độ đúng thực tế
- `labeled validation data` — dữ liệu kiểm chứng có nhãn đúng sai
- `risk-based routing` — định tuyến theo mức rủi ro
- `human-in-the-loop` — có người tham gia duyệt ở các điểm quan trọng
- `threshold selection` — chọn ngưỡng dựa trên dữ liệu đo được
- `overconfidence` — quá tự tin so với độ đúng thật

### Bẫy đề thi

- ✗ Tự động chấp nhận mọi finding có confidence ≥ 0.9 ⇒ ✓ Hiệu chỉnh trên dữ liệu có nhãn rồi mới dùng để định tuyến
- ✗ Chỉ định tuyến theo confidence, bỏ qua mức rủi ro của loại lỗi ⇒ ✓ Kết hợp rủi ro (bảo mật, dữ liệu) với độ không chắc chắn
- ✗ Hiệu chỉnh một lần rồi dùng mãi ⇒ ✓ Đo lại khi đổi prompt, model hoặc dữ liệu

### Câu hỏi

#### Q1. Reviewer tự động đưa ra giả thuyết race condition với confidence 0.9. Quy trình hiện tại tự động chấp nhận mọi finding ≥ 0.9. Cải thiện nào đúng?
- A. Nâng ngưỡng lên 0.95 là đủ
- B. Hiệu chỉnh confidence bằng dữ liệu có nhãn và định tuyến các ca rủi ro cao hoặc không chắc cho người xem
- C. Bỏ qua mọi finding về race condition
- D. Yêu cầu model tự nói "tôi chắc chắn" thêm lần nữa

**Đáp án:** B

**Giải thích:** Phải đối chiếu confidence với kết quả thật và kết hợp rủi ro khi định tuyến. A vẫn dùng số chưa hiệu chỉnh. C bỏ mất finding có giá trị. D không thêm thông tin kiểm chứng.

#### Q2. Sau khi hiệu chỉnh, team nên dùng confidence như thế nào cho đúng?
- A. Để quyết định cái gì được tính là lỗi
- B. Để thay thế hoàn toàn người duyệt
- C. Để chọn finding nào cần người duyệt, kết hợp với mức rủi ro của loại lỗi
- D. Không dùng nữa vì không đáng tin

**Đáp án:** C

**Giải thích:** Confidence đã hiệu chỉnh phù hợp để phân luồng. A thuộc về tiêu chí khách quan. B bỏ an toàn cho các ca khó. D quá mức khi đã có hiệu chỉnh.

## K4. Đối chiếu mâu thuẫn giữa các lượt review (cross-pass adjudication)

### Trọng tâm

Khi các lượt review đưa ra phán quyết **trái ngược** cho cùng một pattern, hãy chạy bước **hoà giải (adjudication)** so sánh bằng chứng, đừng xuất bản các báo cáo mâu thuẫn một cách riêng rẽ.

### Giải thích

Review song song theo file (K2) có thể cho kết quả không đồng nhất: cùng kiểu truy vấn SQL nối chuỗi, ở file A bị gắn "critical", ở file B lại chấp nhận. Nguyên nhân có thể là sự khác nhau thực sự (file B chỉ nhận hằng số nội bộ, không phải đầu vào người dùng), hoặc chỉ là **phán đoán thiếu nhất quán**. Nếu xuất bản cả hai kết luận như hai báo cáo độc lập, người đọc bị bối rối và mất niềm tin (xem 4.1), còn lỗ hổng thật có thể bị bỏ sót.

Bước hoà giải:

1. **Phát hiện**: gom finding theo pattern/loại và so sánh phán quyết giữa các file hay các lượt.
2. **Đối chiếu bằng chứng**: một instance (hoặc người) xem lại hai trường hợp cùng lúc, hỏi "điểm khác biệt thực chất là gì (nguồn dữ liệu, phạm vi, mức hậu quả)?".
3. **Kết luận thống nhất**: hoặc áp một phán quyết cho cả hai, hoặc ghi rõ lý do vì sao hai ca khác nhau.
4. **Cải tiến tiêu chí**: nếu mâu thuẫn do prompt mơ hồ, thêm tiêu chí hoặc ví dụ ca biên (4.1, 4.2) và ghi nhận mẫu bất đồng (4.4).

Bước này thường nằm trong lượt tích hợp ở K2, vì đó là nơi nhìn được nhiều file cùng lúc. Mục tiêu: báo cáo cuối **nhất quán nội bộ** và có giải thích cho mọi khác biệt.

### Keyword

- `adjudication` — hoà giải, phân xử khi có kết luận mâu thuẫn
- `contradictory findings` — các finding mâu thuẫn nhau cho cùng một pattern
- `consistency check` — kiểm tra tính nhất quán giữa các phán quyết
- `evidence comparison` — so sánh bằng chứng giữa các trường hợp
- `reconciliation` — đối soát và thống nhất kết quả
- `judgment drift` — phán đoán lệch dần/không đồng đều giữa các lượt

### Bẫy đề thi

- ✗ Xuất bản riêng từng báo cáo dù mâu thuẫn nhau ⇒ ✓ Chạy bước hoà giải so sánh bằng chứng trước khi công bố
- ✗ Luôn chọn phán quyết nghiêm trọng hơn để an toàn ⇒ ✓ Xem xét điểm khác biệt thực chất (nguồn dữ liệu, phạm vi) rồi mới kết luận
- ✗ Coi mâu thuẫn là ngẫu nhiên, bỏ qua ⇒ ✓ Dùng mâu thuẫn làm tín hiệu để cải tiến tiêu chí và ví dụ

### Câu hỏi

#### Q1. Review song song cho thấy cùng một kiểu truy vấn SQL nối chuỗi bị gắn "critical" ở file A nhưng được chấp nhận ở file B. Bạn xử lý thế nào?
- A. Công bố cả hai kết quả riêng rẽ
- B. Chạy bước hoà giải so sánh bằng chứng hai trường hợp (nguồn dữ liệu, phạm vi), thống nhất kết luận hoặc giải thích khác biệt
- C. Luôn xoá kết luận của file B
- D. Tăng temperature và chạy lại

**Đáp án:** B

**Giải thích:** Hoà giải làm rõ điểm khác biệt thực sự và cho báo cáo nhất quán. A để mâu thuẫn tồn tại. C có thể bỏ sót trường hợp thật sự vô hại hoặc ngược lại. D thêm ngẫu nhiên.

#### Q2. Sau khi hoà giải, phát hiện hai kết luận mâu thuẫn là do tiêu chí trong prompt mơ hồ. Việc nên làm tiếp theo?
- A. Bỏ qua, vì đã có kết luận cuối
- B. Thêm tiêu chí rõ hơn và ví dụ ca biên vào prompt, rồi ghi nhận pattern để theo dõi
- C. Tắt hoàn toàn nhóm finding đó vĩnh viễn
- D. Chuyển mọi finding về lỗi mức thấp

**Đáp án:** B

**Giải thích:** Mâu thuẫn là tín hiệu cải tiến: làm rõ tiêu chí và ví dụ ở biên. A bỏ lỡ cơ hội. C và D loại bỏ giá trị thay vì sửa nguyên nhân.
