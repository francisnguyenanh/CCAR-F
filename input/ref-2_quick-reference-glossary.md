# D2 — Quick Reference & Glossary

> Domain 2 · Tool Design & MCP Integration · 18% đề thi. Trang tra cứu nhanh: keyword giữ nguyên tiếng Anh, phần giải nghĩa bằng tiếng Việt.

## Quick Reference

### Tool Description Design

Tool description là **cơ chế chính** để Claude chọn tool nào cần gọi. Nó quan trọng hơn tên tool.

**Một tool description nên có:**

- Tool làm gì (một câu)
- Định dạng input mong đợi và ràng buộc
- Nó trả về gì (hình dạng của response)
- Điều kiện biên (nó **không** làm gì)
- Ví dụ truy vấn sẽ kích hoạt tool này

**Đếm số tool trước khi chọn cách sửa.** Chọn nhầm tool có hai nguyên nhân khác nhau và cách sửa ngược nhau:

| Bộ tool là… | Cách sửa |
|---|---|
| Đủ ít để suy luận, nhưng hai tool đọc giống nhau | Làm rõ description (TS 2.1) |
| Nhiều công việc khác nhau (query, transform, export) | Chia theo vai trò thành các agent tập trung (TS 2.3) |
| Các biến thể của một công việc, cùng một hình dạng | Gộp thành một tool có tham số (TS 2.3) |

Description là cách sửa đầu tiên **chỉ khi** bộ tool đã ở kích thước làm việc được. Với bộ tool lớn (ví dụ guide: 18 so với 4–5), độ chính xác chọn tool giảm chỉ vì độ phức tạp quyết định, và viết lại 22 description vẫn không chạm tới nguyên nhân. **Current state (6/10/2026):** tài liệu tool search của Anthropic đặt ngưỡng ở 30–50 tool; khi thi hãy trả lời theo số liệu của guide. Few-shot **không** phải bước được công nhận để sửa chọn nhầm tool — các câu luyện tập của domain này không bao giờ dùng nó làm đáp án.

### Schema Design Rules

- **Giữ mỗi agent ở tập tool nhỏ, tập trung theo vai trò.** Guide đối chiếu 4–5 tool với 18 để cho thấy độ tin cậy giảm khi tập tool lớn lên.
- Dùng **tên tham số mô tả rõ**: `customer_email` thay vì `email`, `order_date_range` thay vì `range`.
- Chỉ đánh dấu `required` khi thật sự bắt buộc. Tham số tuỳ chọn có giá trị mặc định giúp giảm ma sát.
- Dùng kiểu `enum` cho lựa chọn có ràng buộc — hướng dẫn model tốt hơn chuỗi tự do.
- **Chẩn đoán trước khi sửa.** Bộ tool nhỏ có hai tool giống nhau là vấn đề description. Bộ tool quá lớn là vấn đề phân phối (distribution), và description tốt đến đâu cũng không cứu được.

### tool_choice Modes

| Mode | Hành vi | Dùng khi |
|---|---|---|
| `auto` | Model tự quyết có gọi tool hay không | Mặc định cho đa số agentic loop |
| `any` | Model phải gọi ít nhất một tool (tự chọn tool nào) | Cần structured output đảm bảo khi input có thể khớp một trong nhiều schema |
| `tool` (forced) | Model phải gọi một tool cụ thể có tên | Cần đảm bảo tuân thủ schema cho một cấu trúc đã biết |

**Điểm thi chính:** dùng `tool_choice: { type: "tool", name: "extract_data" }` khi bạn cần **một cấu trúc cụ thể** mọi lần. Khi chưa biết loại tài liệu và có thể áp dụng một trong nhiều schema trích xuất, `tool_choice: "any"` vẫn đảm bảo structured output và để model chọn đúng tool.

`auto` là mặc định đúng cho agentic loop — model cần tự do quyết định lúc nào gọi tool và lúc nào trả lời bằng text.

**Current state (6/10/2026):** Claude Opus 5.5, Sonnet 5.5, Fable 5.1 và Mythos 5.1 từ chối `any` và `tool` với lỗi 400, và extended thinking thủ công từ chối cả hai trên mọi model. Tài liệu chỉ sang `auto` kết hợp strict tool use. Khi thi hãy trả lời `any` và forced selection.

### MCP Architecture

**Mô hình ba lớp:** Host ⊃ Client ↔ Server (ứng dụng host chứa client; client kết nối tới server).

| Lớp | Vai trò | Ví dụ |
|---|---|---|
| Host | Ứng dụng quản lý vòng đời client | Claude Desktop, IDE extension |
| Client | Bộ kết nối nằm trong host, kết nối tới một server và định tuyến tool call | Instance client mà ứng dụng desktop tạo cho mỗi server |
| Server | Expose tools, resources, prompts | Database connector, file system server |

**Protocol:** JSON-RPC 2.0 qua stdio hoặc streamable HTTP.

**File cấu hình:**

- `.mcp.json` ở thư mục gốc project — MCP server cấp project (chia sẻ với team)
- `~/.claude.json` — MCP server cá nhân/toàn cục (không commit)

**Quy tắc chính:** dùng MCP server của cộng đồng trước. Chỉ tự xây server khi không có server cộng đồng nào đáp ứng yêu cầu.

### Tool Error Handling

**Structured error metadata** (mẫu được thi). Đây là **quy ước cấp ứng dụng nằm trong nội dung result**, không thuộc envelope MCP — `CallToolResult` của giao thức chỉ định nghĩa `content`, `structuredContent` và `isError`:

```json
{
  "errorCategory": "transient" | "validation" | "business" | "permission",
  "isRetryable": true | false,
  "description": "Rate limit hit; retry after 5 seconds"
}
```

Bốn danh mục:

- **transient** (timeout, dịch vụ không khả dụng — `isRetryable: true`, gửi lại y nguyên)
- **validation** (input không hợp lệ — `false`, sửa input rồi gọi mới)
- **business** (vi phạm chính sách — `false`, đi đường thay thế)
- **permission** (thiếu quyền — `false`, escalate lên principal có quyền)

Chỉ transient mới retry được: cờ này hỏi liệu gửi lại **chính lời gọi này** có thành công không, còn mọi loại khác cần thay đổi điều gì đó trước. "Not found" cố ý không có trong danh sách: truy vấn không tìm thấy gì là **valid empty result**, không phải lỗi.

**Phân biệt then chốt:**

- **Access failure** (lỗi auth, network timeout) → retry hoặc escalate. Có gì đó đã sai.
- **Valid empty result** (tìm kiếm trả 0 kết quả) → chấp nhận. Việc không có dữ liệu CHÍNH LÀ câu trả lời.

Không bao giờ coi valid empty result là lỗi. Không bao giờ nuốt im lặng một access failure.

### Tool Selection in Claude Code

| Tool | Mục đích | Dùng khi |
|---|---|---|
| Grep | Tìm nội dung file theo pattern | Tìm pattern code, chuỗi xuất hiện |
| Glob | Tìm file theo pattern tên/đường dẫn | Tìm file theo đuôi hoặc quy ước đặt tên |
| Read | Đọc một file cụ thể | Biết chính xác đường dẫn file |
| Write | Ghi toàn bộ file | Tạo file, hoặc thay thế cả file |
| Edit | Sửa nội dung file | Thay đổi có chủ đích trên file hiện có |
| Bash | Chạy lệnh shell | Build, test, git, mọi thứ các tool trên không đảm nhiệm |

**Nguyên tắc chọn:** dùng tool cụ thể nhất. Grep để tìm nội dung, Glob để tìm file, Read cho file đã biết. Tránh Bash cho việc mà tool chuyên dụng làm tốt hơn.

**Khi Edit thất bại vì khớp không duy nhất:** guide nêu **Read + Write** là phương án dự phòng được thi — đọc toàn bộ file rồi ghi lại bản hoàn chỉnh đã sửa.

**Current state (6/10/2026):** tài liệu tool hiện hành mô tả cách Claude cung cấp chuỗi neo dài hơn với đủ ngữ cảnh xung quanh để xác định một vị trí, hoặc đặt `replace_all: true`. Khi thi hãy trả lời Read + Write; vẫn nên nhận ra cách mở rộng neo và `replace_all` trong Claude Code.

### Decision Rules for the Exam

| Nếu đề nói… | Đáp án nhiều khả năng là… |
|---|---|
| "Claude keeps picking the wrong tool" (bộ tool nhỏ) | Cải thiện tool description |
| "Claude keeps picking the wrong tool" (20+ tool) | Chia theo vai trò hoặc gộp — không phải sửa description |
| "guaranteed structured output" | Forced `tool_choice` cho một schema đã biết; `tool_choice: any` cho nhiều schema |
| "model should decide which tool" | `tool_choice: auto` |
| "must call a tool but can choose which" | `tool_choice: any` |
| "search returned no results" | Valid empty result — chấp nhận |
| "API returned 401/timeout" | Access failure — retry hoặc escalate |
| "too many tools, selection errors" | Chia thành agent theo vai trò, hoặc gộp các biến thể của một công việc |
| "need a custom MCP server" | Kiểm tra server cộng đồng trước |
| "project-wide MCP config" | `.mcp.json` ở thư mục gốc project |
| "personal MCP config" | `~/.claude.json` |

### Common Exam Traps

| Bẫy | Đáp án đúng |
|---|---|
| "Cải thiện cả 22 tool description để sửa chọn nhầm" | Sai — với bộ tool lớn như 22, vấn đề là độ phức tạp quyết định, không phải cách viết |
| "Thêm few-shot để sửa chọn nhầm tool" | Sai — không phải cách sửa được công nhận; sửa description hoặc phân phối |
| "`tool_choice: any` đảm bảo một tool cụ thể" | Sai — `any` ép gọi *một* tool, không phải tool *cụ thể* |
| "MCP server kết nối trực tiếp với nhau" | Sai — mọi giao tiếp đi qua client/host |
| "Kết quả tìm kiếm rỗng nghĩa là tool hỏng" | Sai — không có dữ liệu là một kết quả hợp lệ |
| "Trả chuỗi lỗi chung chung từ tool" | Sai — trả structured metadata (category, retryable, gợi ý) |
| "Xây custom MCP server cho các tích hợp phổ biến" | Sai — kiểm tra server cộng đồng trước |
| "Tên tool là tín hiệu chọn tool chính" | Sai — tool description mới là tín hiệu chính |

## Glossary

### Tool Schema

Định nghĩa JSON Schema mô tả tên, mục đích và tham số đầu vào mong đợi của một tool. Claude dùng schema để hiểu tool làm gì và gọi đúng cách. Schema tốt có description rõ, kiểu có ràng buộc và giá trị mặc định hợp lý.

**Ngữ cảnh thi:** kiểm tra best practice thiết kế schema — tên mô tả rõ, mô tả tham số chi tiết, field required so với optional, và ràng buộc `enum`. Biết rằng description tốt hơn dẫn đến Claude chọn tool tốt hơn. *Xem thêm: 2.1 Tool Interface Design*

### MCP Server

Tiến trình expose tools, resources và prompts cho các MCP client qua Model Context Protocol. MCP server đăng ký khả năng của mình và xử lý các tool call đến. Server có thể chạy cục bộ (cùng máy) hoặc từ xa (qua mạng).

**Ngữ cảnh thi:** phân biệt MCP server với tool definition thông thường truyền trực tiếp qua API. Hiểu MCP server expose những gì (tools, resources, prompts) và giao tiếp với client thế nào. *Xem thêm: 2.4 MCP Server Integration*

### MCP Client

Thành phần kết nối tới một hoặc nhiều MCP server, khám phá khả năng của chúng và chuyển tool call từ Claude tới server phù hợp. Trong Claude Code, MCP client được tích hợp sẵn. Trong ứng dụng tuỳ biến, bạn hiện thực client bằng MCP SDK.

**Ngữ cảnh thi:** câu hỏi có thể hỏi trách nhiệm của client: capability discovery, quản lý transport và định tuyến tool call đúng server. Biết client xử lý nhiều server có tên tool trùng nhau thế nào. *Xem thêm: 2.4 MCP Server Integration*

### MCP Transport

Lớp giao tiếp giữa MCP client và server. Hai transport chuẩn: **stdio** (qua standard input/output, dùng cho tiến trình cục bộ) và **streamable HTTP** (qua HTTP kèm server-sent events, dùng cho server từ xa). Transport được cấu hình khi kết nối client với server.

**Ngữ cảnh thi:** biết dùng transport nào trong tình huống nào. stdio đơn giản hơn cho tool cục bộ; streamable HTTP cần thiết cho server từ xa hoặc dùng chung. Đề có thể hỏi chọn transport cho kịch bản triển khai cụ thể. *Xem thêm: 2.4 MCP Server Integration*

### JSON Schema

Đặc tả dùng để định nghĩa cấu trúc tham số đầu vào của tool trong Claude API. `input_schema` của mỗi tool là một object JSON Schema chỉ rõ kiểu thuộc tính, field bắt buộc, enum và description. Claude dùng schema này để sinh input hợp lệ cho tool call.

**Ngữ cảnh thi:** cần đọc và viết JSON Schema thành thạo. Bẫy thường gặp: nhầm `required` (một mảng ở cấp object) với thuộc tính của từng property, và quên rằng `additionalProperties: false` ngăn các field ngoài dự kiến. *Xem thêm: 2.1 Tool Interface Design*

### Tool Selection

Quá trình Claude quyết định gọi tool nào dựa trên yêu cầu của người dùng và các tool schema khả dụng. Claude đánh giá tên và description của tool để tìm cái khớp nhất. Khi có nhiều tool, description rõ ràng và khác biệt trở nên then chốt để chọn đúng.

**Ngữ cảnh thi:** kiểm tra các chiến lược cải thiện độ chính xác chọn tool: đặt tên mô tả rõ, description không chồng lấn, và giảm số tool trình bày cùng lúc. Biết khái niệm lọc hoặc routing tool để thu hẹp tool khả dụng. *Xem thêm: 2.3 Tool Distribution & Tool Choice*

### Tool Routing

Kỹ thuật điều hướng tool call tới đúng handler khi có nhiều tool hoặc MCP server. Routing có thể diễn ra ở cấp ứng dụng (lọc tool nào Claude thấy theo ngữ cảnh) hoặc cấp model (Claude chọn trong các tool khả dụng). Routing cấp ứng dụng giảm mơ hồ và tăng độ chính xác chọn tool.

**Ngữ cảnh thi:** biết khác biệt giữa để Claude chọn từ tất cả tool và lọc trước theo loại request. Đừng dùng một lớp routing để sửa bộ tool lớn — đề đánh dấu đó là sai. Bộ tool quá lớn là vấn đề phân phối: chia thành agent theo vai trò, hoặc gộp các biến thể của một công việc thành một tool có tham số. *Xem thêm: 2.3 Tool Distribution & Tool Choice*

### Resources (MCP)

Nguồn dữ liệu **chỉ đọc** do MCP server expose. Khác với tool (thực hiện hành động), resource cung cấp thông tin ngữ cảnh có thể nạp vào context của Claude. Ví dụ: nội dung file, bản ghi database, tài liệu. Resource được định danh bằng URI và client có thể liệt kê và đọc.

**Ngữ cảnh thi:** hiểu khác biệt giữa MCP resource và tool. Resource để đọc dữ liệu, tool để thực hiện hành động. Đề có thể hỏi khi nào dùng resource thay vì tool để lấy dữ liệu. *Xem thêm: 2.4 MCP Server Integration*

### Prompts (MCP)

Các template prompt tái sử dụng do MCP server expose. Đó là chuỗi message dựng sẵn mà client lấy về để tương tác với Claude theo cách chuẩn hoá. Prompt có thể có tham số để tuỳ biến template lúc chạy.

**Ngữ cảnh thi:** khái niệm ít được thi hơn, nhưng cần biết MCP server có thể expose prompts cùng với tools và resources. Hiểu ba loại capability: tools, resources và prompts. *Xem thêm: 2.4 MCP Server Integration*

### Tool Error Handling

Chiến lược xử lý lỗi khi tool call trả về lỗi hoặc kết quả bất ngờ. Best practice là trả `is_error: true` trong `tool_result` kèm thông báo lỗi mô tả rõ, để Claude tự quyết cách khắc phục. Không bao giờ nuốt lỗi trong im lặng — Claude cần biết điều gì sai để điều chỉnh cách tiếp cận.

**Ngữ cảnh thi:** kiểm tra mẫu báo lỗi. Biết rằng `is_error: true` trong `tool_result` báo cho Claude biết lời gọi thất bại, và thông báo lỗi nên đủ hành động được để Claude retry hoặc đổi hướng. *Xem thêm: 2.2 Structured Error Responses*
