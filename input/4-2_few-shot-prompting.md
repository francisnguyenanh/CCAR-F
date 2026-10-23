# 4.2 — Few-Shot Prompting

## Tổng quan

**Few-shot prompting** là kỹ thuật đưa vào prompt vài cặp ví dụ đầu vào → đầu ra mong muốn để model "bắt chước" định dạng và cách ra quyết định. Khi chỉ dẫn bằng lời đã dài mà kết quả vẫn không nhất quán, ví dụ cụ thể thường hiệu quả hơn thêm đoạn mô tả trừu tượng.

Đề thi hay hỏi bốn điều: cần **bao nhiêu và loại ví dụ nào** (2-4 ví dụ nhắm đúng chỗ khó), ví dụ nên là ca **sát ranh giới** chứ không chỉ ca dễ, ví dụ giúp **trích xuất từ nhiều dạng tài liệu** (bảng lẫn văn xuôi), và **giới hạn** của few-shot: nó không thay được schema hay code kiểm tra. Quy tắc nhớ nhanh: **ví dụ dạy cách phán đoán và định dạng; schema và validator đảm bảo cấu trúc và tính đúng.**

## K1. Few-shot để đạt định dạng và phán đoán nhất quán

### Trọng tâm

Khi chỉ dẫn chi tiết vẫn cho ra định dạng không đồng đều, hãy thêm **2-4 ví dụ input-output có chủ đích**, kèm lý do quyết định, thay vì viết thêm nhiều đoạn hướng dẫn trừu tượng.

### Giải thích

Model học rất tốt từ **mẫu**. Một đoạn văn mô tả "báo cáo gồm vị trí, vấn đề, mức độ, gợi ý sửa" có thể được hiểu theo nhiều cách (thứ tự khác nhau, độ dài khác nhau, có khi thiếu trường). Một ví dụ cụ thể cho thấy chính xác định dạng đầu ra, độ chi tiết và giọng điệu, nên kết quả đồng đều hơn nhiều.

Nguyên tắc thiết kế ví dụ:

- **Số lượng vừa đủ**: thường 2-4 ví dụ là đủ. Quá nhiều tốn token và có thể khiến model bám cứng vào chi tiết bề mặt; quá ít không bao phủ được các tình huống.
- **Có chủ đích**: mỗi ví dụ dạy một điều khác nhau (định dạng, một loại trường hợp, một cách xử lý thiếu dữ liệu).
- **Kèm lý do**: ghi ngắn "vì sao chọn nhãn/hành động này". Lý do giúp model khái quát sang ca mới thay vì chỉ sao chép.
- **Đa dạng**: tránh các ví dụ giống hệt nhau về cấu trúc, nếu không model sẽ tưởng đó là mẫu bắt buộc.

```text
<example>
Input: def get(u): return db.q("SELECT * FROM t WHERE id=" + u)
Output:
  location: get()
  issue: SQL injection (nối chuỗi từ tham số u)
  severity: critical
  fix: dùng parameterized query
Reasoning: dữ liệu ngoài đi thẳng vào câu SQL.
</example>
```

Few-shot không "huấn luyện lại" model; nó chỉ định hướng trong ngữ cảnh hiện tại, nên ví dụ phải nằm trong mỗi request (hoặc phần prompt dùng chung).

### Keyword

- `few-shot prompting` — cung cấp vài ví dụ input-output trong prompt để định hướng hành vi
- `input-output example` — cặp ví dụ đầu vào và đầu ra mong muốn
- `output format consistency` — tính nhất quán của định dạng đầu ra
- `decision rationale` — lý do đi kèm ví dụ, giải thích vì sao ra quyết định đó
- `in-context learning` — học từ ví dụ ngay trong ngữ cảnh, không cập nhật trọng số
- `abstract instruction` — chỉ dẫn trừu tượng bằng lời, dễ bị hiểu khác nhau

### Bẫy đề thi

- ✗ Thêm nhiều đoạn chỉ dẫn trừu tượng để sửa định dạng không nhất quán ⇒ ✓ Thêm vài ví dụ input-output cụ thể
- ✗ Nhồi thật nhiều ví dụ cho chắc ⇒ ✓ Dùng 2-4 ví dụ có chủ đích, đa dạng
- ✗ Ví dụ chỉ có đầu ra, không nêu lý do ⇒ ✓ Kèm lý do quyết định để model khái quát

### Câu hỏi

#### Q1. Prompt dài hàng chục dòng mô tả định dạng báo cáo review, nhưng mỗi lần model xuất thứ tự trường và độ chi tiết khác nhau. Cách cải thiện hiệu quả nhất?
- A. Viết thêm vài đoạn mô tả định dạng, nhấn mạnh bằng chữ in hoa
- B. Tăng `max_tokens`
- C. Thêm 2-3 ví dụ input-output thể hiện đúng định dạng và lý do quyết định
- D. Chuyển sang model khác ở mỗi lần gọi

**Đáp án:** C

**Giải thích:** Ví dụ cụ thể cho thấy chính xác mẫu cần bắt chước. A tiếp tục dùng chỉ dẫn trừu tượng vốn đã không hiệu quả. B không liên quan định dạng. D làm hành vi thêm bất ổn.

#### Q2. Khi thiết kế few-shot cho tác vụ phân loại ticket, lựa chọn nào hợp lý nhất?
- A. 20 ví dụ gần giống nhau về cấu trúc để model thuộc lòng
- B. Một ví dụ duy nhất vì ngắn gọn
- C. Chỉ ví dụ đầu ra, bỏ phần input
- D. Khoảng 3 ví dụ đa dạng, mỗi ví dụ nhắm một kiểu trường hợp và có lý do ngắn

**Đáp án:** D

**Giải thích:** Số lượng vừa phải, đa dạng và có lý do giúp khái quát tốt. A dễ khiến model bám bề mặt và tốn token. B không đủ bao phủ. C làm mất mối liên hệ input-output.

## K2. Ví dụ ở ranh giới quyết định (ambiguous cases)

### Trọng tâm

Hãy chọn ví dụ ở **vùng mơ hồ giữa hai nhãn**, kèm giải thích vì sao chọn nhãn đó, vì ca dễ thì model đã làm đúng sẵn.

### Giải thích

Ca "rõ như ban ngày" (SQL injection là critical, đổi tên biến là minor) không cần ví dụ: model vốn đã phân loại đúng. Chỗ phán đoán dao động là ca ở **biên**, chẳng hạn *variable shadowing*: đôi khi vô hại, đôi khi che mất bug nghiêm trọng. Nếu prompt chỉ có ví dụ dễ, model vẫn không biết xử lý ca biên theo chuẩn nào, nên cùng một đoạn code lúc bị gắn critical lúc minor.

Cách làm:

1. Thu thập các ca mà reviewer người hoặc các lần chạy trước bất đồng.
2. Với mỗi ca, viết ví dụ gồm input, nhãn đúng và **một câu giải thích vì sao thuộc nhãn đó chứ không phải nhãn kề bên**.
3. Ghép các ví dụ thành cặp đối lập: hai đoạn code gần giống nhau nhưng nhãn khác nhau, kèm điểm phân biệt (ví dụ shadowing trong scope ngắn không ảnh hưởng logic → minor; shadowing làm biến ngoài không được cập nhật → major).

Giải thích đi kèm là phần giá trị nhất: nó dạy **tiêu chí phân biệt**, từ đó model áp dụng được cho ca chưa thấy. Ví dụ "happy path" chỉ củng cố điều đã biết, và còn có thể làm model nghĩ mọi thứ đều dễ.

### Keyword

- `borderline case` — ca sát ranh giới giữa hai nhãn
- `decision boundary` — ranh giới quyết định giữa các lớp phân loại
- `contrastive pair` — cặp ví dụ gần giống nhau nhưng khác nhãn để làm rõ điểm phân biệt
- `happy-path example` — ví dụ dễ, tình huống bình thường
- `variable shadowing` — biến cục bộ trùng tên làm che biến ở scope ngoài
- `disambiguation` — làm rõ, phân biệt các trường hợp mơ hồ

### Bẫy đề thi

- ✗ Chọn toàn ví dụ dễ, điển hình ⇒ ✓ Ưu tiên ca sát ranh giới mà model hay phán đoán dao động
- ✗ Đưa nhãn mà không giải thích ⇒ ✓ Kèm lý do vì sao nhãn này chứ không phải nhãn kề
- ✗ Dùng thêm chỉ dẫn "hãy phân biệt cẩn thận" ⇒ ✓ Dạy điểm phân biệt bằng cặp ví dụ đối lập

### Câu hỏi

#### Q1. Khi review, model lúc gắn "critical" lúc gắn "minor" cho các trường hợp variable shadowing. Bạn nên bổ sung gì vào prompt?
- A. Các ví dụ shadowing ở biên: một ca vô hại và một ca gây bug, mỗi ca có giải thích vì sao thuộc nhãn đó
- B. Thêm ví dụ về lỗi SQL injection rõ ràng
- C. Câu "hãy thật cẩn thận với shadowing"
- D. Giảm số mức severity xuống còn một

**Đáp án:** A

**Giải thích:** A dạy đúng ranh giới đang dao động. B là ca dễ, không giúp phân biệt shadowing. C là chỉ dẫn mơ hồ. D mất thông tin ưu tiên thay vì giải quyết sự nhất quán.

#### Q2. Trong tập ví dụ few-shot hiện có, mọi ví dụ đều là ca điển hình, vậy mà ca khó vẫn bị phân loại lung tung. Nhận định nào đúng?
- A. Cần thêm nhiều ca điển hình nữa
- B. Vấn đề do `temperature` nên không liên quan ví dụ
- C. Few-shot không thể giúp phân loại
- D. Ví dụ chưa phủ vùng biên; cần thêm ca mơ hồ kèm lý do chọn nhãn

**Đáp án:** D

**Giải thích:** Ví dụ chỉ có ca dễ thì không dạy được tiêu chí ở biên. A chỉ lặp thêm cái đã biết. B quy cho nguyên nhân không đúng. C sai vì few-shot đúng là công cụ phù hợp cho việc này.

## K3. Ví dụ cho trích xuất từ nhiều dạng tài liệu (narrative extraction)

### Trọng tâm

Nếu thông tin có thể nằm trong **bảng** hoặc trong **đoạn văn xuôi**, hãy đưa ví dụ cho cả hai dạng, để model không để `null` khi dữ kiện thực ra có trong văn bản.

### Giải thích

Khi trích xuất dữ liệu có cấu trúc (hoá đơn, hợp đồng, hồ sơ), cùng một trường có thể xuất hiện ở nhiều dạng: ô trong bảng "Due date: 2026-03-01", hoặc chìm trong câu "Thanh toán được yêu cầu trong vòng 30 ngày kể từ ngày xuất hoá đơn 1/2". Nếu ví dụ trong prompt chỉ cho thấy trường lấy từ bảng, model có xu hướng nghĩ trường chỉ tồn tại ở đó và điền `null` khi tài liệu mới viết dạng văn xuôi, mặc dù **bằng chứng có thật trong tài liệu**.

Cách xử lý: thêm một ví dụ trích xuất từ văn bản tường thuật, trong đó dữ kiện được diễn đạt gián tiếp và đầu ra cho thấy cách đọc ra giá trị (kể cả khi cần suy từ "30 ngày kể từ..."). Phân biệt rõ:

- **Có bằng chứng trong tài liệu** (kể cả dạng văn xuôi) → phải trích xuất.
- **Không có bằng chứng** → để `null`, không bịa (xem 4.3).

Few-shot ở đây dạy model **phạm vi tìm kiếm** (đọc cả đoạn văn, không chỉ bảng) chứ không dạy nó bịa. Đừng nhầm "bắt buộc tìm trong văn xuôi" với "bắt buộc phải có giá trị".

### Keyword

- `narrative extraction` — trích xuất thông tin từ văn bản tường thuật, không phải bảng
- `structured extraction` — trích xuất dữ liệu thành bản ghi có cấu trúc
- `null` — giá trị rỗng cho trường không có dữ liệu trong tài liệu
- `document format variation` — sự đa dạng về cách trình bày giữa các tài liệu
- `implicit evidence` — bằng chứng diễn đạt gián tiếp trong văn bản
- `extraction exemplar` — ví dụ mẫu cho việc trích xuất

### Bẫy đề thi

- ✗ Model trả `due_date: null` dù có câu nêu hạn thanh toán, và bạn chấp nhận đó là "đúng" ⇒ ✓ Thêm ví dụ trích xuất từ văn xuôi để model đọc ra giá trị
- ✗ Chỉ có ví dụ trích xuất từ bảng ⇒ ✓ Ví dụ nên bao phủ các dạng trình bày khác nhau
- ✗ Bắt model luôn điền giá trị cho mọi trường ⇒ ✓ Có bằng chứng thì trích, không có thì `null`

### Câu hỏi

#### Q1. Pipeline trích xuất hoá đơn trả `due_date: null` cho các hoá đơn mà hạn thanh toán chỉ xuất hiện trong một đoạn văn. Prompt hiện chỉ có ví dụ trích từ bảng. Cách sửa phù hợp nhất?
- A. Đặt `due_date` thành trường bắt buộc và để model tự đoán
- B. Thêm ví dụ few-shot trích `due_date` từ đoạn văn xuôi
- C. Tăng kích thước schema
- D. Lọc bỏ mọi hoá đơn không có bảng

**Đáp án:** B

**Giải thích:** B mở rộng phạm vi mà model biết cần tìm. A ép đoán, dễ bịa. C không liên quan tới việc nhận ra bằng chứng. D loại bỏ dữ liệu hợp lệ.

#### Q2. Với một hợp đồng thật sự không hề nhắc tới ngày giao hàng, đầu ra đúng là gì?
- A. Suy ra ngày giao từ ngày ký cộng 30 ngày
- B. `delivery_date: null`
- C. Lấy ngày hôm nay
- D. Trả lỗi và dừng toàn bộ pipeline

**Đáp án:** B

**Giải thích:** Không có bằng chứng thì `null`; few-shot về văn xuôi chỉ áp dụng khi dữ kiện có trong tài liệu. A và C là bịa giá trị. D quá mức vì thiếu một trường không làm hỏng cả tài liệu.

## K4. Few-shot không thay được schema và validator

### Trọng tâm

Mỗi loại lỗi cần cơ chế riêng: **few-shot** cho phán đoán và định dạng, **schema** cho cấu trúc JSON, **code validator** cho tính toán và quy tắc nghiệp vụ. Đừng thêm ví dụ để chữa mọi vấn đề.

### Giải thích

Few-shot tác động lên **xác suất** hành vi của model, không phải bảo đảm. Do đó:

| Vấn đề | Cơ chế phù hợp | Vì sao |
|---|---|---|
| Phân loại biên không nhất quán | Few-shot ca biên | Là vấn đề phán đoán |
| JSON sai cấu trúc, thiếu field, sai kiểu | Tool use với JSON schema (4.3) | Schema ép cấu trúc |
| Tổng tiền sai, ngày kết thúc trước ngày bắt đầu | Validator bằng code | Cần phép tính xác định |
| Dữ kiện không tồn tại trong tài liệu | Cho phép `null`/escalate | Không phải lỗi do thiếu ví dụ |

Ví dụ: parser trả JSON hỏng và tổng hoá đơn lệch. Nếu bạn cứ thêm ví dụ, có thể giảm tần suất nhưng **không bao giờ về 0**, và mỗi ví dụ mới tốn token ở mọi request. Dùng schema để định dạng luôn hợp lệ, rồi code cộng các dòng và so với total, nếu lệch thì kích hoạt vòng sửa (4.4).

Nguyên tắc chọn: nếu có thể kiểm tra **bằng thuật toán** thì để code kiểm tra; chỉ dùng few-shot cho phần cần "đánh giá".

### Keyword

- `JSON schema` — mô tả cấu trúc, kiểu dữ liệu bắt buộc của đầu ra
- `deterministic validator` — bộ kiểm tra bằng code cho kết quả xác định
- `probabilistic behavior` — hành vi mang tính xác suất, không đảm bảo tuyệt đối
- `arithmetic validation` — kiểm tra phép tính (tổng, thuế...) bằng code
- `malformed JSON` — JSON sai cú pháp hoặc sai cấu trúc
- `mechanism selection` — chọn đúng cơ chế cho từng loại lỗi

### Bẫy đề thi

- ✗ Thêm ví dụ để sửa JSON hỏng và tổng sai ⇒ ✓ Dùng schema cho cấu trúc và code validator cho phép tính
- ✗ Cho rằng nhiều ví dụ sẽ đảm bảo 100% đúng ⇒ ✓ Few-shot chỉ cải thiện xác suất, không phải bảo đảm
- ✗ Dùng validator để dạy phán đoán nghiệp vụ mơ hồ ⇒ ✓ Phán đoán biên dùng few-shot, kiểm tra xác định dùng code

### Câu hỏi

#### Q1. Hệ thống trích xuất hoá đơn thỉnh thoảng trả JSON sai cấu trúc và tổng tiền không bằng tổng các dòng. Đội đề xuất thêm 10 ví dụ vào prompt. Nhận xét đúng?
- A. Hợp lý, ví dụ luôn sửa được mọi loại lỗi
- B. Nên xoá hết ví dụ cũ
- C. Nên dùng JSON schema để ép cấu trúc và code kiểm tra tổng; few-shot không đảm bảo hai điều này
- D. Nên chuyển prompt sang tiếng Anh

**Đáp án:** C

**Giải thích:** Cấu trúc là việc của schema, phép cộng là việc của code, đều xác định được. A sai vì few-shot chỉ cải thiện xác suất. B và D không liên quan nguyên nhân.

#### Q2. Trường hợp nào sau đây phù hợp nhất để giải quyết bằng few-shot?
- A. Model ghi sai định dạng ngày so với schema
- B. Tổng thuế tính sai so với dữ liệu đầu vào
- C. Model không thống nhất khi phân loại ticket "yêu cầu tính năng" hay "báo lỗi" ở các ca mơ hồ
- D. Output thiếu trường bắt buộc

**Đáp án:** C

**Giải thích:** Đây là phán đoán ở ranh giới nên few-shot với ca biên phù hợp. A và D do schema xử lý. B do validator bằng code xử lý.
