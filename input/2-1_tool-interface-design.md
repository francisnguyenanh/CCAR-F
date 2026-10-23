# 2.1 — Tool Interface Design

## Tổng quan

Khi bạn đưa một danh sách tool cho Claude, **model chọn tool chủ yếu dựa vào `name`, `description` và `input_schema`**. Không có "bộ định tuyến" nào khác bên trong: nếu mô tả mơ hồ hoặc hai tool giống nhau, model sẽ chọn sai hoặc dao động. Vì vậy thiết kế giao diện tool (tool interface) là kỹ năng cốt lõi của một architect.

Đề thi thường mô tả một lỗi định tuyến (gọi nhầm tool) rồi hỏi cách sửa **rẻ nhất, đúng gốc nhất**. Quy tắc nhớ nhanh: **sửa description trước, rồi mới nghĩ đến few-shot, classifier ngoài hay thiết kế lại hệ thống**; và nhớ rằng system prompt cũng có thể làm hỏng việc chọn tool.

## K1. Description là "hợp đồng" của tool

### Trọng tâm

Description phải nói rõ tool **làm gì, nhận input gì (định dạng), khi nào dùng và khi nào không dùng**, kèm ví dụ và edge case. Đây là cơ chế chính để model chọn đúng tool.

### Giải thích

Model không nhìn thấy code của tool. Nó chỉ thấy tên, mô tả và schema. Do đó description chính là **hợp đồng** giữa bạn và model. Một description tốt thường gồm:

- **Mục đích**: tool trả về/thay đổi cái gì.
- **Input**: định danh nào được chấp nhận (ví dụ `order_id` dạng `#12345`, khác với `customer_id` dạng `C-889`), định dạng, đơn vị.
- **Ví dụ** truy vấn nên dùng tool này.
- **Edge case**: tool không làm gì, giới hạn, hành vi khi không có dữ liệu.
- **Ranh giới với tool gần giống**: "Dùng `get_order_status` khi có mã đơn; nếu chỉ có email khách thì dùng `get_customer` trước. KHÔNG dùng tool này để xem hồ sơ khách."

Ví dụ lỗi: câu "Where is my order #4412?" bị định tuyến sang `get_customer` vì description của `get_customer` chỉ ghi "Retrieves customer information" còn `get_order` ghi "Retrieves order details" — hai câu quá chung, đều có thể áp dụng. Cách sửa gọn: viết lại hai description nêu rõ **định danh đầu vào** và **khi nào dùng/không dùng**. Đây là thay đổi vài dòng, kiểm chứng được ngay.

Sai lầm kinh điển là lao ngay vào xây một **keyword classifier** bên ngoài để tiền xử lý: tốn công, giòn (brittle), phải bảo trì, và không giải quyết nguyên nhân là mô tả mơ hồ. Chỉ cân nhắc giải pháp nặng hơn khi đã làm description tốt mà vẫn sai.

### Keyword

- `tool description` — mô tả tool; nguồn thông tin chính để model chọn tool
- `input_schema` — JSON Schema khai báo tham số của tool
- `tool routing` — việc model chọn tool nào cho một yêu cầu
- `use / do-not-use guidance` — hướng dẫn khi nào dùng và khi nào không dùng tool
- `edge case` — trường hợp biên mà tool xử lý khác thường
- `keyword classifier` — bộ phân loại theo từ khóa đặt bên ngoài model; giải pháp nặng, thường không cần

### Bẫy đề thi

- ✗ Thấy gọi nhầm tool thì xây ngay classifier từ khóa bên ngoài ⇒ ✓ Làm rõ description: định danh đầu vào, khi nào dùng / không dùng
- ✗ Description một dòng "Retrieves X information" là đủ ⇒ ✓ Phải nêu input, ví dụ, edge case và ranh giới với tool gần giống
- ✗ Tin rằng model "tự hiểu" tool qua tên hàm ⇒ ✓ Model chỉ dựa vào name, description, schema

### Câu hỏi

#### Q1. Agent hỗ trợ khách hàng có hai tool `get_customer` và `get_order`. Khi khách hỏi "Đơn #4412 của tôi đang ở đâu?", agent thường gọi `get_customer`. Cả hai description chỉ là một câu chung chung. Bước đầu tiên hợp lý nhất là gì?
- A. Xây bộ phân loại từ khóa bên ngoài để quyết định tool trước khi gọi model
- B. Thêm 8 ví dụ few-shot vào system prompt
- C. Viết lại description của hai tool: nêu định danh đầu vào (mã đơn so với mã/email khách) và khi nào dùng, khi nào không
- D. Gộp hai tool thành một tool `lookup` nhận chuỗi tự do

**Đáp án:** C

**Giải thích:** Nguyên nhân gốc là mô tả mơ hồ, nên sửa mô tả là bước rẻ, trực tiếp và kiểm chứng được. A là giải pháp nặng, giòn, chưa cần. B tốn token và không xử lý ranh giới. D làm mơ hồ hơn vì mất tính cụ thể của tool.

#### Q2. Điều nào dưới đây KHÔNG nên có trong một description tool chất lượng cao?
- A. Định dạng của tham số đầu vào, kèm ví dụ giá trị hợp lệ
- B. Ranh giới với tool tương tự: khi nào nên dùng tool khác
- C. Chi tiết cài đặt nội bộ (tên bảng DB, tên hàm) mà model không cần để chọn tool
- D. Hành vi ở edge case, ví dụ trả về gì khi không tìm thấy

**Đáp án:** C

**Giải thích:** Description phục vụ việc model **chọn và gọi đúng**; chi tiết cài đặt nội bộ chỉ thêm nhiễu. A, B, D đều giúp model quyết định và điền tham số đúng.

## K2. Chẩn đoán chồng lấn (overlap) trước khi thiết kế lại

### Trọng tâm

Khi số tool còn ít và quản lý được mà chọn sai, thủ phạm thường là **hai description gần giống nhau**. Hãy viết lại ranh giới của hai tool đó trước khi làm bất cứ điều gì lớn hơn.

### Giải thích

Chẩn đoán có thứ tự, từ rẻ đến đắt:

1. **Đọc các description đã bị nhầm**, đặt cạnh nhau. Hai câu gần như đồng nghĩa là dấu hiệu rõ.
2. **Viết lại ranh giới**: nêu input khác nhau, kết quả khác nhau, và "đừng dùng khi...".
3. **Đo lại** trên các case đã sai.
4. Chỉ khi vẫn sai mới xét: đổi tên tool cho phân biệt, thêm few-shot, tách/gộp tool, hoặc giảm số tool theo vai trò (xem bài 2.3).

Ví dụ: 5 tool, trong đó `search_tickets` ("Searches tickets") và `find_cases` ("Finds support cases") thực chất khác nhau ở nguồn dữ liệu (ticket nội bộ so với case khách hàng). Chỉ cần ghi rõ nguồn, trạng thái được hỗ trợ và ví dụ, hai tool này tách bạch.

Few-shot **không phải sai**, nhưng là bước **sau**: thêm 8 ví dụ khi ranh giới chưa rõ thì tốn context, và model vẫn có thể suy luận lệch. Tương tự, "thiết kế lại cả hệ thống" khi chỉ 2/5 mô tả có vấn đề là phản ứng quá mức. Đề thi hay đặt hai cách đều khả thi, và đáp án đúng là cách **tối thiểu, trực tiếp tác động đúng nguyên nhân**.

### Keyword

- `overlapping descriptions` — mô tả chồng lấn khiến model không phân biệt được hai tool
- `ambiguity` — sự mơ hồ trong lựa chọn tool
- `boundary clarification` — làm rõ ranh giới giữa hai tool
- `minimal fix first` — nguyên tắc sửa nhỏ nhất, rẻ nhất, đúng gốc trước
- `few-shot examples` — ví dụ mẫu đưa vào prompt; hữu ích nhưng không thay thế mô tả rõ
- `tool renaming` — đổi tên tool cho dễ phân biệt

### Bẫy đề thi

- ✗ Có 2 mô tả giống nhau thì thêm ngay hàng loạt few-shot ⇒ ✓ Viết lại ranh giới hai mô tả đó trước
- ✗ Chọn sai ở 5 tool thì đòi thiết kế lại toàn bộ kiến trúc ⇒ ✓ Với số tool vừa phải, sửa mô tả là đủ
- ✗ Coi "tăng model lên bản lớn hơn" là cách sửa mô tả mơ hồ ⇒ ✓ Mô tả mơ hồ thì model nào cũng khó chọn

### Câu hỏi

#### Q1. Một agent có 5 tool; `search_tickets` và `find_cases` có description gần như giống hệt và thường bị gọi nhầm. Nhóm đề xuất bốn hướng. Hướng nào nên làm trước?
- A. Thêm 8 ví dụ few-shot cho cả 5 tool
- B. Viết lại description của hai tool đó để nêu rõ nguồn dữ liệu, input và ranh giới
- C. Thiết kế lại hệ thống thành hai agent tách biệt
- D. Thêm lớp router bằng regex trước khi gọi model

**Đáp án:** B

**Giải thích:** Vấn đề cục bộ ở hai mô tả, nên sửa đúng chỗ là rẻ và hiệu quả nhất. A tốn context và chưa chắc xử lý ranh giới. C là phản ứng quá mức. D thêm thành phần giòn, cần bảo trì.

#### Q2. Sau khi viết lại hai description rõ ràng, agent vẫn nhầm ở một nhóm nhỏ yêu cầu mơ hồ. Bước kế tiếp hợp lý nhất?
- A. Bỏ hết tool và để model trả lời bằng kiến thức riêng
- B. Xoá description và chỉ để tên tool
- C. Tăng nhiệt độ sampling để model thử đa dạng hơn
- D. Đo lại trên các case sai, rồi mới cân nhắc few-shot cho đúng nhóm yêu cầu mơ hồ hoặc đổi tên tool

**Đáp án:** D

**Giải thích:** Quy trình leo thang dần: đo, rồi dùng công cụ nặng hơn có mục tiêu. A và B làm mất thông tin. C làm hành vi kém ổn định hơn, không giúp chọn tool đúng.

## K3. Độ chi tiết của tool: tool đặc thù thay vì "tool đa năng mơ hồ"

### Trọng tâm

Các ý định (intent) khác nhau nên có **tool cụ thể, tên rõ nghĩa**; đừng nhét nhiều hành động vào một tool chung chung như `analyze_document`.

### Giải thích

Một tool "đa năng" như `analyze_document` xử lý tóm tắt, trích xuất trường, và xác minh thông tin sẽ gặp ba vấn đề:

- **Description không thể cụ thể**: để bao hết các việc, mô tả buộc phải chung chung, nên model khó biết khi nào gọi và truyền tham số gì.
- **Schema lẫn lộn**: tham số của việc này không liên quan việc kia, hoặc phải có tham số `mode` mơ hồ.
- **Khó kiểm soát và quan sát**: không thể cấp quyền, giới hạn hay log riêng cho từng loại hành động.

Cách tốt hơn là tách thành `summarize_document`, `extract_fields`, `verify_claim`, mỗi tool có input schema riêng và mô tả sắc nét.

Tuy nhiên có **hướng ngược lại** cần phân biệt (bài 2.3): nhiều thao tác **đồng nhất** chỉ khác tên phép biến đổi (ví dụ 19 phép transform dữ liệu) thì gộp thành một tool với tham số `enum` là hợp lý. Khác biệt then chốt: các phép đồng nhất có **cùng ý định và cùng hình dạng input**; còn tóm tắt/trích xuất/xác minh là **ý định khác nhau**. Nguyên tắc: tách theo **ý định**, gộp theo **tính đồng nhất**.

### Keyword

- `granularity` — mức độ chi tiết/cụ thể của tool
- `purpose-specific tool` — tool phục vụ một mục đích rõ ràng
- `generic tool` — tool chung chung gánh nhiều việc; làm mơ hồ việc chọn
- `intent` — ý định mà yêu cầu người dùng thể hiện
- `schema per action` — mỗi hành động có input schema riêng
- `single responsibility` — mỗi tool chỉ đảm nhiệm một việc

### Bẫy đề thi

- ✗ Giữ `analyze_document` làm mọi việc và "dặn trong prompt" cách dùng ⇒ ✓ Tách thành các tool có mục đích rõ ràng
- ✗ Cứ nhiều tool là tốt, chia nhỏ tối đa ⇒ ✓ Tách theo ý định khác nhau, gộp các thao tác đồng nhất bằng enum
- ✗ Dùng một tham số `mode: string` tự do để phân loại hành động ⇒ ✓ Dùng tool riêng hoặc enum có giá trị rõ ràng

### Câu hỏi

#### Q1. Một tool `analyze_document` được dùng để tóm tắt, trích xuất số hợp đồng và kiểm tra tính nhất quán, nhưng model hay gọi nó với tham số sai. Cách thiết kế tốt nhất?
- A. Thêm đoạn dài vào system prompt giải thích cách dùng
- B. Giữ nguyên tool và thêm tham số `options` kiểu chuỗi tự do
- C. Gộp thêm các tool khác vào `analyze_document` cho đủ năng lực
- D. Tách thành các tool riêng (`summarize_document`, `extract_fields`, `verify_consistency`) với schema và mô tả riêng

**Đáp án:** D

**Giải thích:** Mỗi ý định khác nhau cần mô tả và schema sắc nét. A đẩy gánh nặng sang prompt. B làm tool mơ hồ hơn. C đi ngược hướng.

#### Q2. Hệ thống có 19 phép biến đổi dữ liệu, chỉ khác nhau ở tên phép (cùng nhận một bảng, trả một bảng). Điều nào hợp lý nhất?
- A. Tạo 19 tool, mỗi tool một phép
- B. Một tool `transform_data` với tham số `transform_type` kiểu enum
- C. Tạo 19 agent riêng, mỗi agent một phép
- D. Cho model tự viết mã biến đổi mỗi lần

**Đáp án:** B

**Giải thích:** Các thao tác đồng nhất về hình dạng và ý định nên gộp bằng enum để giảm số tool hiển thị. A làm quá tải lựa chọn. C quá nặng. D mất tính xác định và an toàn.

## K4. System prompt có thể ghi đè hành vi chọn tool

### Trọng tâm

Chỉ dẫn toàn cục trong system prompt **có thể xung đột** với description tool và làm model chọn tool sai. Khi định tuyến sai kỳ lạ, hãy **audit system prompt**, đừng mặc định rằng description luôn thắng.

### Giải thích

Model đọc đồng thời system prompt, description của tool và hội thoại. Nếu system prompt có câu như "Luôn luôn gọi `get_customer` trước mọi bước xử lý đơn hàng", model sẽ làm theo câu này **kể cả khi** description của `get_order` ghi rõ "chỉ cần mã đơn". Kết quả: yêu cầu về đơn hàng bị đẩy qua tra cứu khách, trông như lỗi description nhưng thực ra là **xung đột chỉ dẫn**.

Cách chẩn đoán:

1. Đọc toàn bộ system prompt, tìm các từ tuyệt đối: "always", "never", "before any", "for every request".
2. So với description của các tool bị nhầm: có mâu thuẫn không?
3. Sửa bằng cách **làm hẹp điều kiện** ("chỉ gọi `get_customer` khi cần xác minh danh tính") hoặc xoá câu thừa, rồi kiểm tra lại.

Bài học kiến trúc: system prompt, description và schema là **một hệ thống chỉ dẫn thống nhất**; thay đổi ở một nơi có thể vô hiệu hóa nơi khác. Đừng giả định thứ tự ưu tiên "tự nhiên" nào đó, mà hãy kiểm thử. Đề thi hay dựng tình huống mà mô tả tool đã rõ nhưng hành vi vẫn sai, đáp án nằm ở system prompt có quy tắc quá rộng.

### Keyword

- `system prompt` — chỉ dẫn cấp cao cho model, ảnh hưởng toàn bộ hội thoại
- `instruction conflict` — xung đột giữa các chỉ dẫn (system prompt so với description)
- `absolute wording` — từ ngữ tuyệt đối (always/never) dễ gây hành vi ngoài ý muốn
- `prompt audit` — rà soát prompt để tìm chỉ dẫn gây lỗi
- `scoped instruction` — chỉ dẫn có điều kiện áp dụng rõ ràng
- `regression test` — kiểm thử lại sau khi sửa để chắc không hỏng chỗ khác

### Bẫy đề thi

- ✗ Cho rằng description tool luôn ghi đè system prompt ⇒ ✓ Hai nơi có thể xung đột; phải rà soát và sửa chỉ dẫn toàn cục
- ✗ Mô tả đã rõ mà vẫn sai thì đổ lỗi cho model ⇒ ✓ Kiểm tra system prompt có quy tắc quá rộng không
- ✗ Sửa bằng cách thêm nhiều chữ HOA/nhấn mạnh vào description ⇒ ✓ Gỡ xung đột tại nguồn

### Câu hỏi

#### Q1. Description của `get_order` rất rõ ràng, nhưng agent vẫn luôn gọi `get_customer` trước khi tra đơn hàng, làm chậm hệ thống. System prompt có câu "Always fetch the customer record before any order operation." Cách xử lý đúng?
- A. Viết lại description của `get_order` dài hơn
- B. Thêm few-shot về `get_order`
- C. Xây router bên ngoài bỏ qua model
- D. Sửa câu trong system prompt để chỉ áp dụng khi cần xác minh danh tính, rồi kiểm tra lại

**Đáp án:** D

**Giải thích:** Hành vi bắt nguồn từ chỉ dẫn toàn cục quá rộng. A và B không gỡ xung đột. C là giải pháp nặng không cần thiết.

#### Q2. Nhận định nào đúng về quan hệ giữa system prompt và description tool?
- A. Description luôn thắng nên system prompt không thể ảnh hưởng chọn tool
- B. Cả hai ảnh hưởng quyết định của model và có thể mâu thuẫn, nên cần kiểm tra cùng nhau
- C. System prompt chỉ ảnh hưởng giọng văn, không ảnh hưởng tool
- D. Chỉ tool đầu tiên trong danh sách chịu ảnh hưởng của system prompt

**Đáp án:** B

**Giải thích:** Model xử lý cả hai như ngữ cảnh chỉ dẫn; xung đột sẽ gây hành vi khó đoán. A, C, D mô tả cơ chế không có thật.
