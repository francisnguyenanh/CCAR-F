# 2.4 — MCP Server Integration

## Tổng quan

**Model Context Protocol (MCP)** là giao thức chuẩn để Claude kết nối với hệ thống bên ngoài (Jira, GitHub, database...). Một MCP server có thể cung cấp **tools** (hành động), **resources** (dữ liệu đọc được) và **prompts**. Trong Claude Code, bạn cấu hình server qua file, và **chọn đúng phạm vi (scope) cấu hình** quyết định ai dùng được server đó.

Đề thi xoay quanh bốn quyết định: đặt cấu hình ở đâu (team hay cá nhân), xử lý bí mật thế nào, khi nào dùng resource thay vì tool, và dùng server có sẵn hay tự xây. Quy tắc nhớ nhanh: **chia sẻ qua `.mcp.json` trong repo, bí mật qua biến môi trường, dữ liệu ngữ cảnh qua resource, và ưu tiên đồ có sẵn đã được bảo trì.**

## K1. Phạm vi cấu hình MCP: team so với cá nhân

### Trọng tâm

`.mcp.json` ở gốc repo là cấu hình **dùng chung cho cả team** (đưa vào version control). Cấu hình **cá nhân** nằm ở `~/.claude.json`.

### Giải thích

Claude Code cho phép khai báo MCP server ở nhiều phạm vi:

| Phạm vi | Nơi lưu | Ai dùng |
|---|---|---|
| Project | `.mcp.json` ở gốc repo (commit được) | Cả team, ai clone repo đều có |
| User / cá nhân | `~/.claude.json` | Chỉ một người, mọi project của người đó |

Tình huống điển hình: cả team cần cùng một server Jira. Cách đúng là khai báo trong `.mcp.json` rồi commit; thành viên mới clone repo là có ngay cấu hình, không phải làm theo hướng dẫn thủ công. Nếu chỉ cấu hình trong thư mục home của một lập trình viên, những người khác không có server đó và dẫn đến "máy tôi chạy được, máy bạn thì không".

Ngược lại, server thử nghiệm cá nhân hoặc server cần thông tin riêng không nên đẩy vào repo; để ở phạm vi user.

Khi Claude Code khởi động, nó kết nối tới các server đã cấu hình và **tool của chúng xuất hiện cùng với tool built-in**, nên tên và mô tả tool MCP cũng cần chất lượng tốt như K1 của bài 2.1. Server cho team mới cấu hình trong project thường cần người dùng **phê duyệt** trước lần dùng đầu (cơ chế an toàn), điều bạn nên biết khi hướng dẫn team.

### Keyword

- `MCP (Model Context Protocol)` — giao thức chuẩn kết nối model với công cụ/dữ liệu bên ngoài
- `.mcp.json` — file cấu hình MCP cấp project, commit vào repo
- `~/.claude.json` — cấu hình cá nhân của người dùng
- `project scope` — phạm vi project, chia sẻ cho cả team
- `user scope` — phạm vi người dùng, riêng một người
- `MCP server` — tiến trình/dịch vụ cung cấp tool, resource, prompt qua MCP

### Bẫy đề thi

- ✗ Cấu hình server chung của team chỉ trong thư mục home của một người ⇒ ✓ Đặt trong `.mcp.json` ở repo và commit
- ✗ Đưa server thử nghiệm cá nhân vào `.mcp.json` cho cả team ⇒ ✓ Để ở cấu hình cá nhân
- ✗ Gửi hướng dẫn cài tay qua chat cho từng thành viên ⇒ ✓ Version-control cấu hình để mọi người đồng bộ

### Câu hỏi

#### Q1. Cả team 12 người cần dùng chung server MCP Jira với cùng cấu hình. Cách quản lý tốt nhất?
- A. Mỗi người tự thêm vào `~/.claude.json` theo hướng dẫn trên wiki
- B. Khai báo trong `.mcp.json` ở gốc repo và commit
- C. Chỉ cấu hình trên máy trưởng nhóm
- D. Dán cấu hình vào CLAUDE.md để model tự kết nối

**Đáp án:** B

**Giải thích:** `.mcp.json` ở repo là phạm vi project, ai clone cũng nhận cấu hình. A dễ lệch và tốn công. C không chia sẻ. D sai cơ chế: CLAUDE.md là hướng dẫn cho model, không phải nơi cấu hình kết nối server.

#### Q2. Một lập trình viên muốn thử một server MCP thử nghiệm chỉ cho riêng mình, không ảnh hưởng đồng đội. Nơi cấu hình phù hợp?
- A. `.mcp.json` trong repo
- B. Cấu hình cá nhân `~/.claude.json`
- C. Nhánh `main` của repo
- D. Biến trong pipeline CI

**Đáp án:** B

**Giải thích:** Phạm vi user chỉ ảnh hưởng một người. A, C đưa vào repo nên ảnh hưởng cả team. D không liên quan môi trường làm việc cục bộ.

## K2. Bí mật qua biến môi trường

### Trọng tâm

Không commit token/credential vào `.mcp.json`. Dùng **tham chiếu biến môi trường** dạng `${TOKEN}`; mỗi người cung cấp giá trị của mình.

### Giải thích

`.mcp.json` được commit nên **mọi người có quyền đọc repo đều đọc được nó**, cả lịch sử git. Nếu bạn viết token thật vào đó:

- Lộ bí mật cho cả team và bất kỳ ai truy cập repo.
- Token dùng chung làm mất khả năng truy vết (không biết ai thực hiện hành động).
- Khi xoay (rotate) token phải sửa repo và đẩy lại; lịch sử git vẫn giữ giá trị cũ.

Cách đúng: trong file chỉ ghi **placeholder** và để biến môi trường cung cấp giá trị, ví dụ:

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "some-jira-mcp-server"],
      "env": { "JIRA_TOKEN": "${JIRA_TOKEN}" }
    }
  }
}
```

Mỗi thành viên đặt `JIRA_TOKEN` trong môi trường của mình (shell profile, secrets manager, biến CI). Nhờ đó cấu hình dùng chung nhưng **thông tin xác thực riêng từng người**, đúng yêu cầu "cùng server, mỗi người token riêng".

Lưu ý: `${VAR}` chỉ là cách chèn giá trị khi chạy. Đừng thay bằng việc bỏ token vào file rồi thêm vào `.gitignore` cho cả file cấu hình chung, vì như vậy mất luôn việc chia sẻ cấu hình. Tên ví dụ trong code ở trên là minh họa.

### Keyword

- `environment variable` — biến môi trường, cách đưa giá trị bí mật vào lúc chạy
- `${VAR}` — cú pháp tham chiếu biến môi trường trong cấu hình
- `secrets manager` — kho quản lý bí mật tập trung
- `credential leakage` — rò rỉ thông tin xác thực
- `token rotation` — thay token định kỳ hoặc khi lộ
- `per-user credentials` — thông tin xác thực riêng cho từng người

### Bẫy đề thi

- ✗ Commit token thật vào `.mcp.json` cho tiện ⇒ ✓ Dùng `${TOKEN}` và đặt giá trị ở môi trường mỗi người
- ✗ Dùng một token dùng chung cho cả team ⇒ ✓ Mỗi người một token để truy vết và thu hồi riêng
- ✗ Tin rằng repo private thì commit secret an toàn ⇒ ✓ Secret không nên nằm trong source dù repo private

### Câu hỏi

#### Q1. Team chia sẻ cấu hình server MCP nhưng mỗi thành viên dùng API token cá nhân. Thiết kế đúng?
- A. Ghi token của từng người vào `.mcp.json` theo khối riêng
- B. Dùng chung một token rồi ghi thẳng vào file
- C. Dùng `${TOKEN}` trong `.mcp.json` và mỗi người đặt biến môi trường của mình
- D. Gửi token trong CLAUDE.md để model dùng

**Đáp án:** C

**Giải thích:** Cấu hình chung chứa placeholder còn giá trị nằm ở môi trường cá nhân. A, B lộ bí mật trong repo. D đưa bí mật vào ngữ cảnh model và repo.

#### Q2. Lý do chính nên tránh commit token trực tiếp vào `.mcp.json`?
- A. File sẽ chạy chậm hơn
- B. Server MCP không đọc được token ở dạng văn bản
- C. JSON không cho phép chuỗi dài
- D. Bí mật sẽ lộ cho mọi người đọc repo và tồn tại trong lịch sử git

**Đáp án:** D

**Giải thích:** Vấn đề là bảo mật và vòng đời bí mật. A, B, C là lý do kỹ thuật không đúng.

## K3. Resource so với Tool

### Trọng tâm

**Resource** cung cấp dữ liệu/ngữ cảnh để **đọc** (ví dụ database schema, tài liệu); **tool** thực thi hành động hoặc truy vấn có tham số. Dùng resource để giảm các lời gọi khám phá lặp lại.

### Giải thích

MCP phân biệt:

- **Tools**: hàm model chủ động gọi, có thể có tác dụng phụ (tạo issue, chạy query). Do model quyết định gọi.
- **Resources**: nội dung dữ liệu được server phơi bày và đánh địa chỉ bằng URI (ví dụ schema DB, danh mục tài liệu, nội dung issue), thường **do ứng dụng/người dùng chọn đưa vào ngữ cảnh**; giúp model biết "có gì" ở đó.

Tình huống: agent phải biết schema bảng trước khi viết SQL. Nếu chỉ có tool `list_tables` và `describe_table`, mỗi nhiệm vụ agent phải gọi hàng chục lần để khám phá, tốn lượt, token và dễ sai sót. Nếu server phơi bày **schema như một resource**, agent có **catalog nội dung** ngay từ đầu, giảm các lời gọi khám phá và viết truy vấn đúng hơn.

Tiêu chí chọn:

| Nhu cầu | Chọn |
|---|---|
| Biết cấu trúc/tài liệu để làm việc (đọc, ổn định) | Resource |
| Thực hiện thao tác, có tham số, có thể ghi | Tool |
| Truy vấn động theo điều kiện | Tool |

Hai thứ bổ trợ nhau: resource cho ngữ cảnh nền, tool cho hành động. Đừng ép mọi thứ thành tool chỉ vì tool quen thuộc hơn.

### Keyword

- `MCP resource` — dữ liệu đọc được do server phơi bày, định danh bằng URI
- `MCP tool` — hàm model có thể gọi để thực hiện hành động
- `content catalog` — danh mục nội dung giúp model biết có gì sẵn
- `discovery calls` — các lời gọi chỉ để khám phá cấu trúc/dữ liệu
- `URI` — địa chỉ định danh tài nguyên
- `side effect` — tác dụng phụ làm thay đổi hệ thống ngoài

### Bẫy đề thi

- ✗ Bắt agent gọi `list_tables` hàng chục lần để biết schema ⇒ ✓ Phơi bày schema như resource để có catalog sẵn
- ✗ Biến mọi hành động ghi thành resource ⇒ ✓ Hành động có tác dụng phụ thuộc về tool
- ✗ Nghĩ resource và tool là một ⇒ ✓ Resource cung cấp ngữ cảnh đọc; tool thực hiện hành động

### Câu hỏi

#### Q1. Agent viết SQL phải gọi `list_tables` và `describe_table` nhiều lần mỗi nhiệm vụ để hiểu schema, gây chậm và tốn token. Cải tiến phù hợp nhất?
- A. Tăng số vòng lặp tối đa
- B. Thêm nhiều tool khám phá hơn
- C. Phơi bày schema database thành MCP resource để agent có sẵn ngữ cảnh
- D. Viết schema vào mỗi câu hỏi của người dùng

**Đáp án:** C

**Giải thích:** Resource cung cấp catalog dữ liệu giảm khám phá lặp. A và B làm nặng thêm. D thủ công và dễ lệch.

#### Q2. Thao tác nào nên được triển khai như tool thay vì resource?
- A. Tạo issue Jira mới với tiêu đề và mô tả
- B. Danh mục tài liệu API chỉ đọc
- C. Schema của database
- D. Nội dung README của dự án

**Đáp án:** A

**Giải thích:** Tạo issue là hành động có tác dụng phụ và tham số, đặc trưng của tool. B, C, D là dữ liệu đọc ổn định, hợp với resource.

## K4. Server có sẵn so với server tự xây

### Trọng tâm

Với nhu cầu **chuẩn** (Jira, GitHub, Slack...), hãy **đánh giá server có sẵn** về bảo mật, bảo trì, chức năng trước; chỉ tự xây khi có nhu cầu đặc thù chưa ai đáp ứng.

### Giải thích

Tự xây MCP server từ đầu nghe hấp dẫn nhưng tốn chi phí lâu dài: viết, kiểm thử, xử lý xác thực, theo dõi thay đổi API của hệ thống bên kia, vá lỗi bảo mật. Với tích hợp chuẩn, thường đã có connector chính thức hoặc cộng đồng được bảo trì.

Khi đánh giá server có sẵn, kiểm tra:

- **Chức năng**: có đủ thao tác bạn cần không (tìm issue, comment, đổi trạng thái)?
- **Bảo mật**: cách xử lý xác thực, phạm vi quyền (scope) token, mã nguồn có thể rà soát, nguồn gốc đáng tin.
- **Bảo trì**: cập nhật gần đây, số người dùng, cách xử lý issue.
- **Phù hợp vận hành**: giấy phép, cách chạy, yêu cầu mạng.

Chỉ **tự xây (custom)** khi: hệ thống nội bộ không có connector; cần logic nghiệp vụ đặc thù (ví dụ gộp nhiều API nội bộ thành vài tool chất lượng cao); hoặc server có sẵn không đáp ứng yêu cầu bảo mật. Ngay cả khi tự xây, nên dùng SDK MCP chính thức thay vì tự cài giao thức, và nhớ áp dụng chất lượng description (bài 2.1) cùng lỗi có cấu trúc (bài 2.2).

Lưu ý: "có sẵn" không có nghĩa "tin tưởng mù quáng": server bên thứ ba chạy với quyền của bạn, nên cần rà soát và cấp quyền tối thiểu.

### Keyword

- `community server` — server MCP do cộng đồng/nhà cung cấp duy trì
- `custom MCP server` — server tự xây cho nhu cầu riêng
- `build vs buy` — cân nhắc tự xây hay dùng có sẵn
- `maintenance burden` — gánh nặng bảo trì lâu dài
- `token scope` — phạm vi quyền của token cấp cho server
- `MCP SDK` — bộ thư viện chính thức để xây MCP server

### Bẫy đề thi

- ✗ Có nhu cầu Jira chuẩn là tự xây MCP server ngay ⇒ ✓ Đánh giá connector có sẵn về bảo mật và bảo trì trước
- ✗ Dùng server bên thứ ba mà không kiểm tra, vì "có sẵn" ⇒ ✓ Rà soát nguồn gốc, quyền, bảo trì
- ✗ Khi tự xây thì tự cài giao thức MCP thủ công ⇒ ✓ Dùng SDK chính thức

### Câu hỏi

#### Q1. Team cần tra cứu và cập nhật issue Jira từ Claude. Đã có vài MCP server Jira được bảo trì. Bước đầu hợp lý?
- A. Tự viết MCP server từ đầu cho chắc
- B. Đánh giá các server có sẵn về chức năng, bảo mật, bảo trì; chỉ tự xây nếu không đáp ứng
- C. Dùng ngay server đầu tiên tìm được với token quyền admin
- D. Bỏ MCP, dán nội dung issue vào prompt bằng tay

**Đáp án:** B

**Giải thích:** Với nhu cầu chuẩn, đánh giá có sẵn tiết kiệm chi phí dài hạn. A tốn công không cần thiết. C bỏ qua bảo mật và quyền tối thiểu. D mất tính tự động.

#### Q2. Trường hợp nào thuyết phục nhất để tự xây MCP server?
- A. Kết nối GitHub với tính năng mà mọi server có sẵn đều hỗ trợ
- B. Tích hợp hệ thống nội bộ riêng chưa có connector, cần gộp nhiều API thành vài tool chất lượng
- C. Chỉ vì muốn thử công nghệ mới
- D. Vì không muốn đọc tài liệu của server có sẵn

**Đáp án:** B

**Giải thích:** Hệ thống nội bộ và logic đặc thù là lý do chính đáng. A đã có giải pháp. C, D không phải căn cứ kiến trúc.
