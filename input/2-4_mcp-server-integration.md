# 2.4 — MCP Server Integration

> Domain 2: Tool Design & MCP Integration · Tỷ trọng toàn domain: 18%
> Source lesson: https://claudecertificationguide.com/learn/2-tool-design-mcp/2-4-mcp-server-integration
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **MCP Server Integration**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Shared configuration scope

**Principle (EN):** Repository .mcp.json is team-wide, ~/.claude.json personal.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **repository .mcp.json is team-wide, ~/.claude.json personal**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** All teammates need same Jira MCP server.

**Recommended implementation:** Commit .mcp.json with environment placeholders.

**Incorrect shortcut / Sai lầm dễ mắc:** Store team setup only in one developer home dir.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "All teammates need same Jira MCP server".
- Decision: áp dụng nguyên tắc **Shared configuration scope** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Commit .mcp.json with environment placeholders" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Secrets via environment variables

**Principle (EN):** Reference ${TOKEN} rather than commit raw credentials.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **reference ${TOKEN} rather than commit raw credentials**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Team shares server settings but each member uses own token.

**Recommended implementation:** Use env interpolation and secrets manager.

**Incorrect shortcut / Sai lầm dễ mắc:** Commit token literal into repository.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Team shares server settings but each member uses own token".
- Decision: áp dụng nguyên tắc **Secrets via environment variables** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use env interpolation and secrets manager" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. MCP resources versus tools

**Principle (EN):** Resources expose readable context; tools invoke capabilities.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **resources expose readable context; tools invoke capabilities**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Agent must know database schema before building query.

**Recommended implementation:** Expose schema resource to reduce discovery calls.

**Incorrect shortcut / Sai lầm dễ mắc:** Force endless list_tables tool calls.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Agent must know database schema before building query".
- Decision: áp dụng nguyên tắc **MCP resources versus tools** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Expose schema resource to reduce discovery calls" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Community versus custom server

**Principle (EN):** Evaluate maintained standard integration before writing custom.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **evaluate maintained standard integration before writing custom**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Standard Jira lookup requirement appears.

**Recommended implementation:** Evaluate existing connector/security/maintenance first.

**Incorrect shortcut / Sai lầm dễ mắc:** Build custom MCP from zero automatically.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Standard Jira lookup requirement appears".
- Decision: áp dụng nguyên tắc **Community versus custom server** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Evaluate existing connector/security/maintenance first" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** All teammates need same Jira MCP server.

**Bad design:** Store team setup only in one developer home dir.

**Better design:** Commit .mcp.json with environment placeholders.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : All teammates need same Jira MCP server.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Commit .mcp.json with environment placeholders.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Shared configuration scope:** "Store team setup only in one developer home dir" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở shared configuration scope, rồi chọn "Commit .mcp.json with environment placeholders".

2. **Bẫy Secrets via environment variables:** "Commit token literal into repository" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở secrets via environment variables, rồi chọn "Use env interpolation and secrets manager".

3. **Bẫy MCP resources versus tools:** "Force endless list_tables tool calls" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở mcp resources versus tools, rồi chọn "Expose schema resource to reduce discovery calls".

4. **Bẫy Community versus custom server:** "Build custom MCP from zero automatically" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở community versus custom server, rồi chọn "Evaluate existing connector/security/maintenance first".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **All teammates need same Jira MCP server**. Phương án nào phù hợp nhất?

- **A.** Store team setup only in one developer home dir; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Commit token literal into repository; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Force endless list_tables tool calls; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Commit .mcp.json with environment placeholders; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Store team setup only in one developer home dir" được nêu ở cơ chế Shared configuration scope. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Secrets via environment variables**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **MCP resources versus tools**, không giải quyết được yêu cầu cốt lõi "Repository .mcp.json is team-wide, ~/.claude.json personal" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Repository .mcp.json is team-wide, ~/.claude.json personal. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "All teammates need same Jira MCP server", ưu tiên phân biệt `Shared configuration scope` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Commit token literal into repository** cho tình huống: Team shares server settings but each member uses own token. Cần phản biện thế nào?

- **A.** Use env interpolation and secrets manager; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Commit token literal into repository; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Force endless list_tables tool calls; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Build custom MCP from zero automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Reference ${TOKEN} rather than commit raw credentials. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Commit token literal into repository" được nêu ở cơ chế Secrets via environment variables. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **MCP resources versus tools**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Community versus custom server**, không giải quyết được yêu cầu cốt lõi "Reference ${TOKEN} rather than commit raw credentials" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Team shares server settings but each member uses own token", ưu tiên phân biệt `Secrets via environment variables` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Agent must know database schema before building query** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Store team setup only in one developer home dir; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Expose schema resource to reduce discovery calls; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Force endless list_tables tool calls; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Build custom MCP from zero automatically; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Shared configuration scope**, không giải quyết được yêu cầu cốt lõi "Resources expose readable context; tools invoke capabilities" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Resources expose readable context; tools invoke capabilities. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Force endless list_tables tool calls" được nêu ở cơ chế MCP resources versus tools. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Community versus custom server**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Agent must know database schema before building query", ưu tiên phân biệt `MCP resources versus tools` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Standard Jira lookup requirement appears**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Store team setup only in one developer home dir; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Commit token literal into repository; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Evaluate existing connector/security/maintenance first; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Build custom MCP from zero automatically; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Shared configuration scope**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Secrets via environment variables**, không giải quyết được yêu cầu cốt lõi "Evaluate maintained standard integration before writing custom" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Evaluate maintained standard integration before writing custom. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Build custom MCP from zero automatically" được nêu ở cơ chế Community versus custom server. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Standard Jira lookup requirement appears", ưu tiên phân biệt `Community versus custom server` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Store team setup only in one developer home dir**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Store team setup only in one developer home dir; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Commit token literal into repository; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Force endless list_tables tool calls; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Commit .mcp.json with environment placeholders; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Store team setup only in one developer home dir" được nêu ở cơ chế Shared configuration scope. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Secrets via environment variables**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **MCP resources versus tools**, không giải quyết được yêu cầu cốt lõi "Repository .mcp.json is team-wide, ~/.claude.json personal" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Repository .mcp.json is team-wide, ~/.claude.json personal. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "All teammates need same Jira MCP server", ưu tiên phân biệt `Shared configuration scope` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Team shares server settings but each member uses own token**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Use env interpolation and secrets manager; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Commit token literal into repository; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Force endless list_tables tool calls; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Build custom MCP from zero automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Reference ${TOKEN} rather than commit raw credentials. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Commit token literal into repository" được nêu ở cơ chế Secrets via environment variables. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **MCP resources versus tools**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Community versus custom server**, không giải quyết được yêu cầu cốt lõi "Reference ${TOKEN} rather than commit raw credentials" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Team shares server settings but each member uses own token", ưu tiên phân biệt `Secrets via environment variables` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Agent must know database schema before building query**, nên chọn gì?

- **A.** Store team setup only in one developer home dir; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Expose schema resource to reduce discovery calls; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Force endless list_tables tool calls; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Build custom MCP from zero automatically; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Shared configuration scope**, không giải quyết được yêu cầu cốt lõi "Resources expose readable context; tools invoke capabilities" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Resources expose readable context; tools invoke capabilities. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Force endless list_tables tool calls" được nêu ở cơ chế MCP resources versus tools. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Community versus custom server**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Agent must know database schema before building query", ưu tiên phân biệt `MCP resources versus tools` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Build custom MCP from zero automatically**. Đánh giá chính xác nhất là gì?

- **A.** Store team setup only in one developer home dir; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Commit token literal into repository; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Evaluate existing connector/security/maintenance first; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Build custom MCP from zero automatically; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Shared configuration scope**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Secrets via environment variables**, không giải quyết được yêu cầu cốt lõi "Evaluate maintained standard integration before writing custom" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Evaluate maintained standard integration before writing custom. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Build custom MCP from zero automatically" được nêu ở cơ chế Community versus custom server. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Standard Jira lookup requirement appears", ưu tiên phân biệt `Community versus custom server` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **All teammates need same Jira MCP server**, tiêu chí pass phù hợp là gì?

- **A.** Store team setup only in one developer home dir; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Commit token literal into repository; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Force endless list_tables tool calls; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Commit .mcp.json with environment placeholders; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Store team setup only in one developer home dir" được nêu ở cơ chế Shared configuration scope. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Secrets via environment variables**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **MCP resources versus tools**, không giải quyết được yêu cầu cốt lõi "Repository .mcp.json is team-wide, ~/.claude.json personal" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Repository .mcp.json is team-wide, ~/.claude.json personal. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "All teammates need same Jira MCP server", ưu tiên phân biệt `Shared configuration scope` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Team shares server settings but each member uses own token**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Use env interpolation and secrets manager; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Commit token literal into repository; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Force endless list_tables tool calls; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Build custom MCP from zero automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Reference ${TOKEN} rather than commit raw credentials. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Commit token literal into repository" được nêu ở cơ chế Secrets via environment variables. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **MCP resources versus tools**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Community versus custom server**, không giải quyết được yêu cầu cốt lõi "Reference ${TOKEN} rather than commit raw credentials" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Team shares server settings but each member uses own token", ưu tiên phân biệt `Secrets via environment variables` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "All teammates need same Jira MCP server".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Commit .mcp.json with environment placeholders.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Shared configuration scope:** Repository .mcp.json is team-wide, ~/.claude.json personal. ✓ Commit .mcp.json with environment placeholders. ✗ Store team setup only in one developer home dir.
- **Secrets via environment variables:** Reference ${TOKEN} rather than commit raw credentials. ✓ Use env interpolation and secrets manager. ✗ Commit token literal into repository.
- **MCP resources versus tools:** Resources expose readable context; tools invoke capabilities. ✓ Expose schema resource to reduce discovery calls. ✗ Force endless list_tables tool calls.
- **Community versus custom server:** Evaluate maintained standard integration before writing custom. ✓ Evaluate existing connector/security/maintenance first. ✗ Build custom MCP from zero automatically.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/2-tool-design-mcp/2-4-mcp-server-integration
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
