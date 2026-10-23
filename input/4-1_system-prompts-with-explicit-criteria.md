# 4.1 — System Prompts with Explicit Criteria

## Tổng quan

Bài này nói về cách viết **system prompt** cho các tác vụ đánh giá (code review, kiểm tra tài liệu, phân loại) sao cho kết quả **chính xác, nhất quán và đáng tin**. Điểm cốt lõi: thay vì dặn model những câu mơ hồ như "hãy cẩn thận", "chỉ báo lỗi quan trọng", bạn phải định nghĩa **tiêu chí cụ thể**: loại vấn đề nào phải báo, loại nào phải bỏ qua, mức độ nghiêm trọng được hiểu thế nào kèm ví dụ code.

Trong đề thi, các câu hỏi thường mô tả một hệ thống review bị nhiễu (quá nhiều false positive, mức severity lung tung) rồi hỏi cách sửa. Đáp án đúng gần như luôn là **tiêu chí rõ ràng + ví dụ gắn nhãn**; còn các phương án "bảo model tự tin hơn", "đặt ngưỡng confidence", "giữ hết finding cho đầy đủ" thường là bẫy. Quy tắc nhớ nhanh: **tiêu chí tường minh thắng chỉ dẫn mơ hồ; độ chính xác của từng loại finding quyết định niềm tin của người dùng.**

## K1. Tiêu chí phân loại tường minh (explicit categorical criteria)

### Trọng tâm

Hãy nêu rõ trong prompt **loại nào phải báo (report)** và **loại nào phải bỏ qua (skip)**, kèm điều kiện kích hoạt cụ thể, thay vì dặn chung chung kiểu "thận trọng" hay "chỉ báo khi chắc chắn".

### Giải thích

Model không biết chuẩn của team bạn nếu bạn không nói. Khi prompt chỉ có "review code and flag important issues", model phải tự đoán "important" là gì: có lúc nó coi tên biến chưa đẹp là lỗi nghiêm trọng, có lúc bỏ sót lỗ hổng thật. Hướng dẫn mơ hồ như "be conservative" hoặc "only report high-confidence issues" **không thay đổi định nghĩa** của vấn đề, nó chỉ làm model e dè một cách ngẫu nhiên: giảm cả finding sai lẫn finding đúng.

Cách làm đúng là viết thành các **danh mục có điều kiện**:

```text
REPORT (luôn báo):
- Bug logic gây sai kết quả hoặc crash (null deref, off-by-one, race condition rõ ràng)
- Lỗ hổng bảo mật: SQL injection, secret hard-code, thiếu kiểm tra quyền

SKIP (không báo):
- Sở thích style/format (đặt tên, thụt lề, thứ tự import) đã có linter lo
- Pattern cục bộ chấp nhận được trong codebase này (ví dụ: dùng print trong script nội bộ)
```

Mỗi mục nên có **trigger cụ thể** (điều gì khiến bạn gắn nhãn đó) để hai lần chạy khác nhau cho cùng quyết định. Tiêu chí tường minh còn giúp bạn debug: khi kết quả sai, bạn biết sửa dòng nào trong prompt, còn "hãy cẩn thận hơn" thì không có gì để sửa.

Lưu ý: đây là chỉ dẫn "mềm" qua prompt. Nếu cần đảm bảo **tuyệt đối** (ví dụ phải có trường nào đó), dùng schema hoặc validator (xem 4.3, 4.4); prompt tiêu chí dùng để nâng chất lượng phán đoán.

### Keyword

- `explicit criteria` — tiêu chí tường minh, định nghĩa rõ cái gì phải báo, cái gì bỏ qua
- `report/skip categories` — các nhóm vấn đề cần báo và cần bỏ qua
- `concrete trigger` — điều kiện kích hoạt cụ thể cho một loại finding
- `vague instruction` — chỉ dẫn mơ hồ ("be careful", "be conservative")
- `system prompt` — prompt hệ thống, nơi đặt vai trò, tiêu chí và quy tắc làm việc cho model
- `style preference` — sở thích về phong cách code, thường không đáng báo là lỗi

### Bẫy đề thi

- ✗ Thêm câu "chỉ báo những vấn đề có độ tin cậy cao" để giảm nhiễu ⇒ ✓ Định nghĩa rõ danh mục report/skip với trigger cụ thể
- ✗ Viết "be conservative" và coi như đã hướng dẫn xong ⇒ ✓ Chỉ dẫn mơ hồ không đổi được ranh giới; cần tiêu chí đo được
- ✗ Dùng một đoạn văn dài mô tả mong muốn chung ⇒ ✓ Liệt kê danh mục và điều kiện cụ thể dễ kiểm chứng

### Câu hỏi

#### Q1. Một công cụ review code tự động liên tục gắn nhãn "critical" cho các góp ý về đặt tên biến và thụt lề, khiến developer phớt lờ toàn bộ báo cáo. Cách cải thiện hiệu quả nhất trong system prompt là gì?
- A. Thêm câu "hãy thận trọng và chỉ báo khi thật sự chắc chắn"
- B. Liệt kê rõ nhóm phải báo (bug logic, lỗ hổng bảo mật) và nhóm phải bỏ qua (style, format), kèm điều kiện cụ thể
- C. Yêu cầu model viết ngắn hơn để giảm số finding
- D. Tăng temperature để kết quả đa dạng hơn

**Đáp án:** B

**Giải thích:** B định nghĩa lại ranh giới của vấn đề một cách đo được. A chỉ làm model e dè ngẫu nhiên, vẫn không biết style là gì để bỏ qua. C giảm độ dài chứ không đổi tiêu chí. D làm kết quả kém ổn định hơn, ngược với mục tiêu.

#### Q2. Team muốn model chỉ báo lỗ hổng bảo mật và bug thực sự, còn các pattern đã được linter xử lý thì bỏ qua. Prompt nào phù hợp nhất?
- A. "Review the code and report anything you think is wrong."
- B. "Be extremely careful and thorough in your review."
- C. "Only report issues you are highly confident about."
- D. "Report: logic bugs and security vulnerabilities (e.g. unsanitized SQL, hard-coded secrets). Skip: naming, formatting, import order."

**Đáp án:** D

**Giải thích:** D có cả danh mục báo, danh mục bỏ qua và ví dụ trigger. A, B quá chung chung nên model tự định nghĩa "wrong" hoặc "thorough". C dựa vào độ tự tin chủ quan của model, không xác định loại finding nào đáng báo.

## K2. Độ chính xác từng nhóm và niềm tin của người dùng (false positive trust)

### Trọng tâm

Một nhóm finding có tỉ lệ false positive cao sẽ **làm mất niềm tin vào cả những nhóm khác**; hãy tạm tắt nhóm nhiễu và tinh chỉnh tiêu chí thay vì giữ chúng "cho đủ".

### Giải thích

Người dùng không đánh giá từng finding riêng lẻ, họ đánh giá **cả công cụ**. Nếu 70% cảnh báo "tài liệu không khớp code" là báo động giả, developer sẽ học cách bỏ qua báo cáo, và rồi cũng bỏ qua cảnh báo bảo mật thật nằm lẫn trong đó. Đây là hiệu ứng "alert fatigue": chi phí của false positive không chỉ là thời gian xem xét, mà là **suy giảm độ tin cậy toàn hệ thống**.

Cách xử lý có kỷ luật:

1. Đo precision theo **từng category** (không chỉ trung bình toàn bộ): mỗi nhóm bao nhiêu finding được chấp nhận, bao nhiêu bị bác.
2. Với nhóm có precision thấp: **tạm tắt** (hoặc hạ xuống chế độ không chặn) trong lúc cải thiện tiêu chí và ví dụ.
3. Bật lại khi precision đạt ngưỡng chấp nhận được.

Lý do không nên "giữ để đầy đủ": tính đầy đủ chỉ có giá trị khi người đọc còn tin báo cáo. Một báo cáo ngắn mà 90% đúng có ích hơn báo cáo dài mà người ta ngừng đọc. Cũng đừng nhầm với việc bỏ hẳn nhóm vĩnh viễn: tắt tạm là biện pháp bảo vệ niềm tin trong khi sửa, và nhóm bị tắt vẫn quay lại khi đã được hiệu chỉnh.

### Keyword

- `false positive` — báo động giả: finding bị báo nhưng thực ra không phải vấn đề
- `precision per category` — độ chính xác tính riêng cho từng nhóm finding
- `alert fatigue` — mệt mỏi cảnh báo: người dùng bỏ qua mọi cảnh báo vì quá nhiều nhiễu
- `trust erosion` — niềm tin bị xói mòn do kết quả sai lặp lại
- `temporarily disable` — tạm tắt một nhóm nhiễu trong lúc tinh chỉnh
- `refine criteria` — tinh chỉnh tiêu chí để nhóm đó chính xác hơn

### Bẫy đề thi

- ✗ Giữ mọi finding bật để báo cáo "đầy đủ" ⇒ ✓ Tạm tắt nhóm nhiễu, tinh chỉnh rồi bật lại
- ✗ Chỉ nhìn precision trung bình toàn hệ thống ⇒ ✓ Đo theo từng category để thấy nhóm nào gây nhiễu
- ✗ Cho rằng false positive chỉ tốn thời gian xem xét ⇒ ✓ Nó còn làm mất niềm tin vào cả nhóm finding chính xác

### Câu hỏi

#### Q1. Công cụ review báo rất nhiều cảnh báo "docstring không khớp code", phần lớn là báo động giả. Developer bắt đầu bỏ qua cả báo cáo, kể cả cảnh báo SQL injection thật. Bước xử lý hợp lý nhất?
- A. Giữ nguyên tất cả cảnh báo để không bỏ sót điều gì
- B. Tắt vĩnh viễn toàn bộ công cụ review
- C. Chuyển toàn bộ cảnh báo sang một file riêng, không ai đọc
- D. Tạm tắt nhóm "docstring mismatch", tinh chỉnh tiêu chí và ví dụ của nhóm đó, rồi bật lại khi precision đủ tốt

**Đáp án:** D

**Giải thích:** D bảo vệ niềm tin vào nhóm cảnh báo bảo mật trong lúc sửa nhóm nhiễu. A để alert fatigue tiếp diễn. B bỏ luôn giá trị của công cụ. C thực chất là loại bỏ cảnh báo mà không sửa nguyên nhân.

#### Q2. Báo cáo thống kê: precision trung bình toàn hệ thống là 75%. Làm sao để biết nên can thiệp vào đâu?
- A. Tính precision riêng cho từng category finding để tìm nhóm có tỉ lệ bị bác cao
- B. Lấy trung bình mới sau mỗi tuần
- C. Hỏi model "bạn có chắc không?" cho từng finding
- D. Giảm số category xuống còn một

**Đáp án:** A

**Giải thích:** Trung bình che khuất việc một nhóm rất kém kéo tụt niềm tin chung; phải tách theo category. B không thêm thông tin. C dựa vào tự đánh giá của model (xem K4). D vứt bỏ phân loại hữu ích.

## K3. Ví dụ mức độ nghiêm trọng (severity calibration bằng ví dụ)

### Trọng tâm

Định nghĩa mức severity bằng **đoạn code ví dụ có gắn nhãn** cho từng mức, không bằng mô tả trừu tượng như "critical là rất quan trọng".

### Giải thích

Từ như "critical", "major", "minor" không có nghĩa tuyệt đối. Nếu bạn chỉ viết "critical = very important", model sẽ suy diễn khác nhau mỗi lần: một lần coi thiếu null-check là critical, lần khác coi là minor. Kết quả là severity **không ổn định giữa các lần chạy**, rất khó để sắp xếp ưu tiên hoặc đặt chính sách (ví dụ "critical thì chặn merge").

Cách khắc phục là đưa **ví dụ cụ thể cho từng mức**, mỗi ví dụ là một snippet và nhãn mong muốn kèm lý do ngắn:

```text
CRITICAL — dữ liệu người dùng bị lộ hoặc bị sửa trái phép
  query = "SELECT * FROM users WHERE id = " + request.args["id"]
MAJOR — sai logic nhưng không lộ dữ liệu
  if retries > MAX: return   # nên là >=, bỏ sót lần retry cuối
MINOR — khó đọc hoặc lệch quy ước, không ảnh hưởng hành vi
  tmp = compute(x)           # tên biến mơ hồ
```

Ví dụ hoạt động như "điểm neo" cho phán đoán: khi gặp code mới, model so khớp với snippet gần nhất. Hai điều nên nhớ: (1) chọn ví dụ đại diện cho **ranh giới** giữa các mức, không chỉ ca dễ; (2) ví dụ bổ sung cho tiêu chí chữ chứ không thay thế. Kỹ thuật few-shot nói chung được đào sâu ở 4.2.

### Keyword

- `severity level` — mức độ nghiêm trọng (critical/major/minor)
- `labeled example` — ví dụ có gắn nhãn kết quả mong muốn
- `calibration` — hiệu chỉnh để phán đoán nhất quán theo chuẩn mong muốn
- `inconsistent severity` — severity thay đổi giữa các lần chạy với cùng đầu vào
- `anchor example` — ví dụ làm điểm neo để model so khớp
- `abstract definition` — định nghĩa trừu tượng, khó áp dụng nhất quán

### Bẫy đề thi

- ✗ Định nghĩa "critical = rất quan trọng" ⇒ ✓ Cho snippet cụ thể ứng với từng mức severity
- ✗ Chỉ đưa ví dụ rõ ràng, dễ ⇒ ✓ Bao gồm cả ca sát ranh giới giữa hai mức
- ✗ Dùng ví dụ để thay hoàn toàn tiêu chí chữ ⇒ ✓ Kết hợp tiêu chí viết rõ và ví dụ minh hoạ

### Câu hỏi

#### Q1. Cùng một đoạn code thiếu kiểm tra null, lần chạy này model gắn "critical", lần sau gắn "minor". Cách sửa tốt nhất?
- A. Đặt temperature về 0 và coi như xong
- B. Bảo model "hãy nhất quán"
- C. Thêm vào prompt các snippet mẫu cho từng mức severity kèm nhãn và lý do
- D. Chạy review ba lần rồi lấy mức cao nhất

**Đáp án:** C

**Giải thích:** Vấn đề là định nghĩa mức chưa được neo bằng ví dụ; C giải quyết gốc rễ. A giảm ngẫu nhiên nhưng không cho model biết chuẩn đúng. B là chỉ dẫn mơ hồ. D làm đội severity lên và tốn chi phí.

#### Q2. Bạn viết ví dụ severity cho prompt. Lựa chọn nào hiệu quả nhất?
- A. Chỉ ví dụ cực kỳ rõ ràng, mỗi mức một cái
- B. Nhiều ví dụ cho mỗi mức, gồm cả ca sát ranh giới, kèm lý do ngắn
- C. Một đoạn mô tả bằng lời dài hơn, không dùng code
- D. Ví dụ không cần nhãn, model tự suy ra

**Đáp án:** B

**Giải thích:** Các ca sát ranh giới là nơi model dễ phán đoán lệch nhất, và lý do giúp nó khái quát hoá. A bỏ qua vùng khó. C quay lại định nghĩa trừu tượng. D mất tác dụng neo vì không có nhãn.

## K4. Tự tin của model không thay thế tiêu chí khách quan (confidence vs criteria)

### Trọng tâm

Điểm confidence tự báo của model **chưa hiệu chỉnh thì không đáng tin**; phải có phân loại lỗi khách quan, và chỉ dùng confidence (sau khi hiệu chỉnh) để **định tuyến**, ví dụ chuyển người xem.

### Giải thích

Model có thể trả lời rất tự tin về một kết luận sai, chẳng hạn khẳng định chắc chắn rằng một tên biến xấu là "lỗ hổng bảo mật" với confidence 0.95. Con số tự báo này **không phải xác suất đã kiểm chứng**: nó chưa được so với nhãn thật nên 0.9 có thể ứng với độ đúng thực tế chỉ 60%. Vì vậy đặt quy tắc "confidence >= 0.9 thì tin" là lấy một đại lượng không đáng tin làm cổng quyết định.

Cách đúng gồm hai lớp:

- **Tiêu chí khách quan**: xây taxonomy lỗi rõ ràng (K1), để việc có phải lỗi bảo mật hay không phụ thuộc vào đặc điểm code, không phụ thuộc cảm giác của model.
- **Confidence để định tuyến**: sau khi đã **hiệu chỉnh trên dữ liệu có nhãn** (so confidence với kết quả đúng/sai thật), có thể dùng để quyết định finding nào cần người duyệt. Khi đó confidence thấp thì chuyển người, không phải để loại bỏ hay tự động chấp nhận.

Tóm lại thứ tự ưu tiên: tiêu chí quyết định "là gì", dữ liệu có nhãn kiểm chứng "đúng bao nhiêu", còn confidence chỉ là tín hiệu phụ cho việc phân luồng. Chủ đề hiệu chỉnh và định tuyến người duyệt được mở rộng ở 4.6 và domain 5.

### Keyword

- `self-reported confidence` — độ tự tin do chính model tự báo cáo
- `calibrated confidence` — confidence đã được đối chiếu với kết quả thật để phản ánh đúng xác suất
- `labeled validation set` — tập dữ liệu có nhãn đúng dùng để kiểm chứng và hiệu chỉnh
- `error taxonomy` — bảng phân loại lỗi có định nghĩa khách quan
- `confidence routing` — dùng confidence để quyết định luồng xử lý (tự động hay người duyệt)
- `confident but wrong` — sai nhưng nói rất tự tin

### Bẫy đề thi

- ✗ Đặt ngưỡng confidence 0.9 rồi tin mọi kết quả vượt ngưỡng ⇒ ✓ Hiệu chỉnh trên dữ liệu có nhãn trước khi dùng confidence để định tuyến
- ✗ Dùng confidence thay cho định nghĩa lỗi ⇒ ✓ Dựa vào taxonomy khách quan; confidence chỉ là tín hiệu phụ
- ✗ Coi confidence cao nghĩa là finding đúng ⇒ ✓ Model có thể sai mà vẫn rất tự tin

### Câu hỏi

#### Q1. Model báo "SECURITY: biến `usrNm` đặt tên khó hiểu" với confidence 0.95. Đồng nghiệp đề xuất đặt ngưỡng 0.9 để tự động chấp nhận các finding. Đánh giá nào đúng?
- A. Hợp lý vì 0.95 vượt ngưỡng
- B. Không đáng tin: confidence chưa hiệu chỉnh không thay được tiêu chí; cần taxonomy lỗi rõ ràng và kiểm chứng trên dữ liệu có nhãn
- C. Nên nâng ngưỡng lên 0.99 là đủ
- D. Nên bỏ hết finding bảo mật

**Đáp án:** B

**Giải thích:** Con số 0.95 là tự báo, chưa đối chiếu nhãn thật, và finding này sai về loại. C chỉ dời ngưỡng, vẫn dựa vào số chưa hiệu chỉnh. A lặp lại lỗi. D bỏ mất cả những finding đúng.

#### Q2. Khi nào dùng confidence của model để chuyển một finding cho người duyệt là hợp lý?
- A. Ngay từ đầu, dùng giá trị thô của model
- B. Chỉ khi model viết "I am sure" trong câu trả lời
- C. Khi confidence đã được hiệu chỉnh bằng dữ liệu có nhãn và dùng để chọn các ca cần người xem
- D. Không bao giờ vì confidence luôn vô dụng

**Đáp án:** C

**Giải thích:** Sau hiệu chỉnh, confidence phản ánh khá đúng khả năng sai và phù hợp để phân luồng. A dùng giá trị chưa kiểm chứng. B là suy đoán qua văn bản. D phủ nhận quá mức: nó hữu ích khi đã hiệu chỉnh và chỉ dùng cho định tuyến.
