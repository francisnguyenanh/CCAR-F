# 2.3 — Tool Distribution & Tool Choice

## Tổng quan

Có hai câu hỏi thiết kế khác nhau nhưng thường đi cùng nhau: **mỗi agent nên nhìn thấy những tool nào** (phân phối tool) và **model bị buộc hay được tự do gọi tool** (tham số `tool_choice`). Cả hai đều ảnh hưởng độ tin cậy: quá nhiều tool khiến model chọn kém; `tool_choice` sai khiến tool không chạy khi cần, hoặc chạy khi không cần.

Quy tắc nhớ nhanh: **ít tool, đúng vai trò cho từng agent; và chọn `tool_choice` theo mức độ bắt buộc: `auto` (tùy chọn), `any` (bắt buộc dùng một tool, model chọn), tool cụ thể (ép đúng tool đó).**

## K1. Quá tải tool (tool overload) và giới hạn theo vai trò

### Trọng tâm

Càng nhiều tool không liên quan hiển thị cho một agent, độ chính xác chọn tool càng giảm. Cách sửa là **chia vai trò và giới hạn danh sách tool của từng agent**, không phải dời tool sang chỗ khác.

### Giải thích

Mỗi tool bạn khai báo chiếm token trong context và là một lựa chọn model phải cân nhắc. Với khoảng vài tool, model chọn rất tốt; khi lên hàng chục tool thuộc nhiều lĩnh vực (ví dụ coordinator thấy cùng lúc 22 thao tác: tìm kiếm, ghi DB, gửi email, xử lý file...), tỷ lệ gọi nhầm tool tăng, đặc biệt khi các mô tả gần giống nhau.

Hướng giải quyết trong hệ thống multi-agent:

- **Chia theo vai trò**: coordinator chỉ có tool điều phối (giao việc cho subagent); subagent tìm kiếm chỉ có tool tìm kiếm; subagent ghi dữ liệu chỉ có tool ghi.
- **Giới hạn danh sách tool hiển thị** cho từng agent (ví dụ cấu hình danh sách tool được phép của subagent).
- Lợi ích phụ: **nguyên tắc đặc quyền tối thiểu** (least privilege): subagent chỉ đọc không thể vô tình xóa dữ liệu.

Một sai lầm phổ biến là "chia 22 tool thành hai MCP server". MCP server chỉ là **cách đóng gói và kết nối** tool; nếu cùng một agent vẫn thấy cả 22 tool thì quá tải vẫn còn nguyên. Vấn đề là **tập tool agent nhìn thấy**, không phải tool đến từ đâu.

Ngược lại, đừng đi quá đà: mỗi vai trò phải có đủ tool để hoàn thành công việc của nó, nếu không phải vòng qua coordinator quá nhiều (xem K4).

### Keyword

- `tool overload` — quá nhiều tool khiến model chọn kém
- `role-based tool scoping` — giới hạn tool theo vai trò agent
- `least privilege` — đặc quyền tối thiểu: chỉ cấp quyền cần thiết
- `coordinator` — agent điều phối, giao việc cho subagent
- `subagent` — agent con làm một phần việc chuyên biệt
- `allowed tools` — danh sách tool được phép dùng của một agent

### Bẫy đề thi

- ✗ Chia 22 tool sang hai MCP server là hết quá tải ⇒ ✓ Phải giảm tập tool mà mỗi agent nhìn thấy, theo vai trò
- ✗ Cho coordinator mọi tool để "linh hoạt" ⇒ ✓ Coordinator chỉ giữ tool điều phối; việc chuyên môn giao subagent
- ✗ Dặn trong prompt "chỉ dùng 5 tool trong số 22" ⇒ ✓ Giới hạn ở cấu hình, không chỉ ở lời nhắc

### Câu hỏi

#### Q1. Coordinator của hệ thống nghiên cứu hiển thị trực tiếp 22 tool không liên quan (tìm kiếm, ghi DB, gửi email...) và hay chọn nhầm. Thiết kế nào tốt nhất?
- A. Chuyển 22 tool sang hai MCP server khác nhau nhưng vẫn kết nối cho coordinator
- B. Thêm đoạn prompt dài hướng dẫn chọn tool
- C. Tạo thêm 22 agent mỗi agent một tool
- D. Chia vai trò: mỗi subagent chỉ thấy nhóm tool liên quan, coordinator chỉ có tool điều phối

**Đáp án:** D

**Giải thích:** Giảm tập tool hiển thị theo vai trò xử lý đúng nguyên nhân. A không đổi số tool coordinator thấy. B vẫn để model đối mặt 22 lựa chọn. C quá mức và phức tạp.

#### Q2. Lợi ích bổ sung nào của việc giới hạn tool theo vai trò?
- A. Giảm số lượng token output
- B. Tăng nhiệt độ sampling hiệu quả hơn
- C. Subagent chỉ đọc không thể gọi tool ghi/xóa, tuân theo đặc quyền tối thiểu
- D. Cho phép bỏ description của tool

**Đáp án:** C

**Giải thích:** Giới hạn tool vừa cải thiện chọn lựa vừa giảm rủi ro hành động ngoài ý muốn. A, B, D không liên quan.

## K2. Gộp các thao tác đồng nhất bằng enum

### Trọng tâm

Nhiều thao tác **gần giống hệt, chỉ khác tên phép** nên gộp thành **một tool với tham số `enum`**, thay vì nhân bản tool hay nhân bản agent.

### Giải thích

Giả sử có 19 phép biến đổi dữ liệu: `to_csv`, `to_json`, `dedupe`, `normalize_dates`,... Cùng nhận dữ liệu vào và trả dữ liệu ra. Nếu khai báo 19 tool, model phải đọc 19 description gần giống nhau, vừa tốn token vừa dễ nhầm.

Cách gọn hơn:

```json
{
  "name": "transform_data",
  "description": "Apply a named transformation to a dataset.",
  "input_schema": {
    "type": "object",
    "properties": {
      "dataset_id": {"type": "string"},
      "transform_type": {
        "type": "string",
        "enum": ["to_csv", "to_json", "dedupe", "normalize_dates"]
      }
    },
    "required": ["dataset_id", "transform_type"]
  }
}
```

`enum` giới hạn giá trị hợp lệ (schema chặn giá trị lạ), còn description giải thích từng giá trị. Số tool hiển thị giảm mạnh, mà năng lực không đổi.

Điều kiện áp dụng: các thao tác **cùng ý định và cùng hình dạng input/output**. Nếu chúng khác nhau về bản chất (đọc so với ghi, quyền khác nhau, schema khác nhau), thì gộp sẽ tạo "tool đa năng mơ hồ" (xem bài 2.1) và mất khả năng cấp quyền riêng. Cũng đừng giải quyết bằng cách tạo 19 agent: agent là đơn vị nặng (có context, vòng lặp riêng), không dùng để thay cho một tham số.

### Keyword

- `enum` — tập giá trị hữu hạn cho một tham số trong JSON Schema
- `consolidation` — gộp nhiều tool tương tự thành một
- `homogeneous operations` — các thao tác đồng nhất về ý định và hình dạng
- `transform_type` — ví dụ tham số enum chọn phép biến đổi
- `schema validation` — kiểm tra giá trị đầu vào theo schema
- `agent proliferation` — nhân bản agent không cần thiết

### Bẫy đề thi

- ✗ 19 phép gần giống nhau thì tạo 19 agent ⇒ ✓ Một tool với tham số enum
- ✗ Gộp mọi thao tác, kể cả đọc lẫn xóa, vào một tool ⇒ ✓ Chỉ gộp thao tác đồng nhất; khác quyền/ý định thì tách
- ✗ Để `transform_type` là chuỗi tự do ⇒ ✓ Dùng enum để giới hạn giá trị hợp lệ

### Câu hỏi

#### Q1. Hệ thống ETL có 19 tool biến đổi dữ liệu, chỉ khác tên phép và cùng input/output. Model thường chọn sai. Giải pháp phù hợp nhất?
- A. Một tool `transform_data` với tham số `transform_type` kiểu enum
- B. Giữ nguyên 19 tool và thêm few-shot
- C. Tạo 19 subagent độc lập
- D. Cho model viết script riêng mỗi lần

**Đáp án:** A

**Giải thích:** Thao tác đồng nhất nên gộp bằng enum, giảm số lựa chọn mà vẫn giữ tính xác định. B vẫn nhiều tool. C quá nặng. D mất tính kiểm soát.

#### Q2. Điều kiện nào KHÔNG phù hợp để gộp hai tool thành một tool dùng enum?
- A. Cùng ý định và cùng hình dạng input
- B. Khác nhau chỉ ở tên phép biến đổi
- C. Cùng mức quyền truy cập
- D. Một tool chỉ đọc, tool kia xóa dữ liệu và cần quyền riêng

**Đáp án:** D

**Giải thích:** Khác biệt quyền và hậu quả cần tách để kiểm soát và mô tả rõ. A, B, C là điều kiện thuận lợi để gộp.

## K3. Ngữ nghĩa của `tool_choice`

### Trọng tâm

`tool_choice` điều khiển mức bắt buộc gọi tool: **`auto`** (model tự quyết, có thể không gọi), **`any`** (phải gọi một trong các tool, model chọn tool nào), **tool cụ thể** (`{"type": "tool", "name": ...}`, ép gọi đúng tool đó). Ngoài ra có **`none`** (không gọi tool).

### Giải thích

| Giá trị | Hành vi | Dùng khi |
|---|---|---|
| `auto` (mặc định) | Model tự quyết có gọi tool hay trả lời bằng văn bản | Trợ lý hội thoại chung |
| `any` | Bắt buộc gọi **một** tool, model chọn trong danh sách | Cần output có cấu trúc nhưng chưa biết loại nào |
| `tool` + `name` | Bắt buộc gọi **đúng tool** được chỉ định | Luôn cần một bước cố định (ví dụ trích xuất theo một schema) |
| `none` | Không được gọi tool | Muốn chỉ văn bản dù tool vẫn khai báo |

Ví dụ: bạn nhận tài liệu chưa rõ loại (hóa đơn, hợp đồng, biên lai) và cần trích xuất thành đối tượng có cấu trúc. Có ba tool trích xuất `extract_invoice`, `extract_contract`, `extract_receipt`. Với `auto`, đôi khi model trả lời bằng văn bản tự do, bạn không có object. Với tool cụ thể, bạn ép sai loại khi tài liệu là hợp đồng. Giải pháp đúng là **`any`**: chắc chắn có một lần gọi tool trích xuất, model tự chọn tool phù hợp loại tài liệu.

Chi tiết cần nhớ: khi dùng `any` hoặc tool cụ thể, response có `tool_use` ngay từ đầu, model **không viết đoạn giải thích trước** như ở `auto`. Ngoài ra, `tool_choice` thường dùng để ép đầu ra có cấu trúc (xem bài 4.3), và việc ép tool không thay đổi việc bạn vẫn phải chạy tool và trả `tool_result` nếu muốn vòng lặp tiếp tục.

### Keyword

- `tool_choice` — tham số điều khiển việc model có/bắt buộc gọi tool
- `auto` — model tự quyết định gọi tool hay không
- `any` — bắt buộc gọi một tool bất kỳ trong danh sách
- `forced tool` — ép gọi đúng tool chỉ định bằng `{"type": "tool", "name": ...}`
- `none` — cấm gọi tool
- `structured output` — đầu ra có cấu trúc, thường đạt qua tool use

### Bẫy đề thi

- ✗ Dùng `auto` và cho rằng tool chắc chắn được gọi ⇒ ✓ `auto` có thể trả văn bản; cần chắc chắn thì dùng `any` hoặc ép tool
- ✗ Ép một tool cụ thể khi chưa biết loại tài liệu ⇒ ✓ Dùng `any` để model chọn trong các tool ứng viên
- ✗ Nghĩ `any` nghĩa là "gọi mọi tool" ⇒ ✓ `any` = bắt buộc gọi một tool, model chọn

### Câu hỏi

#### Q1. Pipeline nhận tài liệu loại chưa biết (hóa đơn, hợp đồng, biên lai) và luôn phải trả về một đối tượng trích xuất có cấu trúc, mỗi loại có tool riêng. Thiết lập `tool_choice` nào hợp lý nhất?
- A. `auto`
- B. `any`
- C. Ép cố định `extract_invoice`
- D. `none`

**Đáp án:** B

**Giải thích:** `any` đảm bảo luôn có lời gọi tool trích xuất và để model chọn tool đúng loại. `auto` có thể trả văn bản thuần. C ép sai với tài liệu không phải hóa đơn. D cấm gọi tool.

#### Q2. Một bước cố định của workflow luôn phải chạy `extract_metadata` ngay đầu mỗi tài liệu trước mọi bước khác. Cách đảm bảo xác định nhất?
- A. Dặn trong prompt "hãy luôn gọi extract_metadata trước"
- B. Dùng `tool_choice: auto` và hy vọng
- C. Ép `tool_choice` vào đúng `extract_metadata` ở lượt đầu rồi chuyển sang chế độ thường cho các lượt sau
- D. Dùng `none` ở lượt đầu

**Đáp án:** C

**Giải thích:** Ép tool cụ thể cho đảm bảo mang tính cấu hình, không phụ thuộc xác suất. A và B không đảm bảo. D cấm gọi tool.

## K4. Khả năng chéo vai trò có phạm vi hẹp (scoped cross-role tools)

### Trọng tâm

Khi một agent thường xuyên cần một việc nhỏ, rẻ, an toàn (ví dụ xác minh một sự kiện), hãy cấp cho nó **một tool hẹp** như `verify_fact`; việc phức tạp vẫn chuyển qua coordinator. **Đừng** cấp quyền rộng không giới hạn.

### Giải thích

Giới hạn tool theo vai trò (K1) có nhược điểm: nếu subagent tổng hợp (synthesis) cần xác minh nhanh một con số khoảng chục lần mỗi nhiệm vụ mà luôn phải quay lại coordinator, thì:

- Tăng số vòng giao tiếp và độ trễ.
- Coordinator bị tắc nghẽn bởi các yêu cầu tầm thường.

Giải pháp cân bằng là **tool chéo vai trò có phạm vi hẹp**:

- `verify_fact(claim)`: chỉ đọc, kết quả nhỏ, rủi ro thấp, dùng cho **trường hợp 80% thường gặp**.
- Các trường hợp khó (cần nghiên cứu sâu, nhiều nguồn) vẫn **giao lại coordinator** để điều phối subagent tìm kiếm.

Điều không nên làm: đưa cho subagent tổng hợp bộ tìm kiếm web đầy đủ và quyền ghi/xóa "cho tiện". Điều này phá vỡ chia vai trò, tăng bề mặt rủi ro và quay lại tình trạng quá tải tool.

Nguyên tắc thiết kế: **cấp đúng khả năng nhỏ nhất đủ giải quyết nhu cầu phổ biến**, và có đường leo thang cho phần còn lại.

### Keyword

- `scoped tool` — tool có phạm vi quyền/hành vi hẹp
- `verify_fact` — ví dụ tool xác minh sự kiện chỉ đọc, nhẹ
- `cross-role capability` — khả năng dùng chung giữa các vai trò
- `synthesis agent` — agent tổng hợp kết quả từ nhiều nguồn
- `escalation path` — đường chuyển lên vai trò mạnh hơn cho trường hợp khó
- `round trip` — một vòng đi–về giữa các agent, tốn độ trễ

### Bẫy đề thi

- ✗ Cho subagent toàn bộ tool tìm kiếm và xóa để khỏi phải quay lại coordinator ⇒ ✓ Chỉ cấp tool hẹp, chỉ đọc cho nhu cầu phổ biến
- ✗ Mọi xác minh nhỏ đều phải qua coordinator ⇒ ✓ Việc đơn giản xử lý trực tiếp bằng tool hẹp; việc phức tạp mới chuyển lên
- ✗ Coi tool hẹp là phá nguyên tắc giới hạn vai trò ⇒ ✓ Đó là ngoại lệ có kiểm soát nhằm giảm round trip

### Câu hỏi

#### Q1. Agent tổng hợp thường phải xác minh các số liệu đơn giản, mỗi lần đều qua coordinator làm hệ thống chậm. Cách tiếp cận tốt nhất?
- A. Cấp cho agent tổng hợp công cụ tìm kiếm web đầy đủ cùng quyền ghi
- B. Giữ nguyên, chậm là chấp nhận được
- C. Cấp tool hẹp, chỉ đọc `verify_fact` cho việc phổ biến, các việc phức tạp vẫn chuyển qua coordinator
- D. Bỏ bước xác minh

**Đáp án:** C

**Giải thích:** Tool hẹp giảm round trip mà vẫn giữ rủi ro thấp; case khó vẫn có đường leo thang. A phá phân quyền. B bỏ qua vấn đề. D hạ chất lượng.

#### Q2. Khi cấp tool chéo vai trò cho một subagent, tiêu chí nào quan trọng nhất?
- A. Tool càng mạnh càng tốt
- B. Phạm vi hẹp, ít rủi ro, phục vụ nhu cầu phổ biến và có đường leo thang
- C. Tool phải giống hệt tool của coordinator
- D. Tool chỉ ghi, không đọc

**Đáp án:** B

**Giải thích:** Mục tiêu là giảm độ trễ mà không phá đặc quyền tối thiểu. A, C đi ngược nguyên tắc. D không liên quan nhu cầu xác minh.
