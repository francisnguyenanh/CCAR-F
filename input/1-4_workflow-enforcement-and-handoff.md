# 1.4 — Workflow Enforcement and Handoff

> Domain 1: Agentic Architecture & Orchestration · Tỷ trọng toàn domain: 27%
> Source lesson: https://claudecertificationguide.com/learn/1-agentic-architecture/1-4-workflow-enforcement-handoff
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Workflow Enforcement and Handoff**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Deterministic prerequisites

**Principle (EN):** High-risk business operations need code-level gates.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **high-risk business operations need code-level gates**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** AI tries refund before verified identity.

**Recommended implementation:** Reject refund tool execution until verified session identity exists.

**Incorrect shortcut / Sai lầm dễ mắc:** Put ALWAYS verify in system prompt alone.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "AI tries refund before verified identity".
- Decision: áp dụng nguyên tắc **Deterministic prerequisites** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Reject refund tool execution until verified session identity exists" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Risk-based control choice

**Principle (EN):** Money, security and regulation use programmatic enforcement; style may use prompts.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **money, security and regulation use programmatic enforcement; style may use prompts**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Workflow has strict AML rule and flexible email tone.

**Recommended implementation:** Enforce AML in backend, tone in prompt.

**Incorrect shortcut / Sai lầm dễ mắc:** Use prompt for both.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Workflow has strict AML rule and flexible email tone".
- Decision: áp dụng nguyên tắc **Risk-based control choice** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Enforce AML in backend, tone in prompt" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Subagent lifecycle

**Principle (EN):** SubagentStart observes; SubagentStop can block completion; PreToolUse on Agent intercepts spawn.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **subagentStart observes; SubagentStop can block completion; PreToolUse on Agent intercepts spawn**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Need reject invocation missing mandatory tenant identifier.

**Recommended implementation:** Block Agent call with PreToolUse before spawn.

**Incorrect shortcut / Sai lầm dễ mắc:** Expect SubagentStart to cancel spawn.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Need reject invocation missing mandatory tenant identifier".
- Decision: áp dụng nguyên tắc **Subagent lifecycle** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Block Agent call with PreToolUse before spawn" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Multi-concern handling

**Principle (EN):** Decompose issue, preserve each status and handoff context.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **decompose issue, preserve each status and handoff context**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** User asks refund, address change and points balance.

**Recommended implementation:** Track distinct requests with own prerequisites and outcomes.

**Incorrect shortcut / Sai lầm dễ mắc:** Treat all concerns as one unresolved blob.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "User asks refund, address change and points balance".
- Decision: áp dụng nguyên tắc **Multi-concern handling** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Track distinct requests with own prerequisites and outcomes" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** AI tries refund before verified identity.

**Bad design:** Put ALWAYS verify in system prompt alone.

**Better design:** Reject refund tool execution until verified session identity exists.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : AI tries refund before verified identity.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Reject refund tool execution until verified session identity exists.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Deterministic prerequisites:** "Put ALWAYS verify in system prompt alone" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở deterministic prerequisites, rồi chọn "Reject refund tool execution until verified session identity exists".

2. **Bẫy Risk-based control choice:** "Use prompt for both" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở risk-based control choice, rồi chọn "Enforce AML in backend, tone in prompt".

3. **Bẫy Subagent lifecycle:** "Expect SubagentStart to cancel spawn" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở subagent lifecycle, rồi chọn "Block Agent call with PreToolUse before spawn".

4. **Bẫy Multi-concern handling:** "Treat all concerns as one unresolved blob" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở multi-concern handling, rồi chọn "Track distinct requests with own prerequisites and outcomes".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **AI tries refund before verified identity**. Phương án nào phù hợp nhất?

- **A.** Reject refund tool execution until verified session identity exists; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Put ALWAYS verify in system prompt alone; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Use prompt for both; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Expect SubagentStart to cancel spawn; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** High-risk business operations need code-level gates. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Put ALWAYS verify in system prompt alone" được nêu ở cơ chế Deterministic prerequisites. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Risk-based control choice**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Subagent lifecycle**, không giải quyết được yêu cầu cốt lõi "High-risk business operations need code-level gates" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "AI tries refund before verified identity", ưu tiên phân biệt `Deterministic prerequisites` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Use prompt for both** cho tình huống: Workflow has strict AML rule and flexible email tone. Cần phản biện thế nào?

- **A.** Treat all concerns as one unresolved blob; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Enforce AML in backend, tone in prompt; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Use prompt for both; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Expect SubagentStart to cancel spawn; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Multi-concern handling**, không giải quyết được yêu cầu cốt lõi "Money, security and regulation use programmatic enforcement; style may use prompts" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Money, security and regulation use programmatic enforcement; style may use prompts. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Use prompt for both" được nêu ở cơ chế Risk-based control choice. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Subagent lifecycle**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Workflow has strict AML rule and flexible email tone", ưu tiên phân biệt `Risk-based control choice` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Need reject invocation missing mandatory tenant identifier** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Treat all concerns as one unresolved blob; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Put ALWAYS verify in system prompt alone; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Block Agent call with PreToolUse before spawn; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Expect SubagentStart to cancel spawn; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Multi-concern handling**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Deterministic prerequisites**, không giải quyết được yêu cầu cốt lõi "SubagentStart observes; SubagentStop can block completion; PreToolUse on Agent intercepts spawn" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** SubagentStart observes; SubagentStop can block completion; PreToolUse on Agent intercepts spawn. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Expect SubagentStart to cancel spawn" được nêu ở cơ chế Subagent lifecycle. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Need reject invocation missing mandatory tenant identifier", ưu tiên phân biệt `Subagent lifecycle` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **User asks refund, address change and points balance**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Treat all concerns as one unresolved blob; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Put ALWAYS verify in system prompt alone; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Use prompt for both; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Track distinct requests with own prerequisites and outcomes; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Treat all concerns as one unresolved blob" được nêu ở cơ chế Multi-concern handling. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Deterministic prerequisites**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Risk-based control choice**, không giải quyết được yêu cầu cốt lõi "Decompose issue, preserve each status and handoff context" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Decompose issue, preserve each status and handoff context. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "User asks refund, address change and points balance", ưu tiên phân biệt `Multi-concern handling` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Put ALWAYS verify in system prompt alone**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Reject refund tool execution until verified session identity exists; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Put ALWAYS verify in system prompt alone; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Use prompt for both; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Expect SubagentStart to cancel spawn; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** High-risk business operations need code-level gates. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Put ALWAYS verify in system prompt alone" được nêu ở cơ chế Deterministic prerequisites. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Risk-based control choice**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Subagent lifecycle**, không giải quyết được yêu cầu cốt lõi "High-risk business operations need code-level gates" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "AI tries refund before verified identity", ưu tiên phân biệt `Deterministic prerequisites` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Workflow has strict AML rule and flexible email tone**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Treat all concerns as one unresolved blob; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Enforce AML in backend, tone in prompt; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Use prompt for both; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Expect SubagentStart to cancel spawn; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Multi-concern handling**, không giải quyết được yêu cầu cốt lõi "Money, security and regulation use programmatic enforcement; style may use prompts" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Money, security and regulation use programmatic enforcement; style may use prompts. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Use prompt for both" được nêu ở cơ chế Risk-based control choice. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Subagent lifecycle**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Workflow has strict AML rule and flexible email tone", ưu tiên phân biệt `Risk-based control choice` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Need reject invocation missing mandatory tenant identifier**, nên chọn gì?

- **A.** Treat all concerns as one unresolved blob; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Put ALWAYS verify in system prompt alone; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Block Agent call with PreToolUse before spawn; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Expect SubagentStart to cancel spawn; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Multi-concern handling**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Deterministic prerequisites**, không giải quyết được yêu cầu cốt lõi "SubagentStart observes; SubagentStop can block completion; PreToolUse on Agent intercepts spawn" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** SubagentStart observes; SubagentStop can block completion; PreToolUse on Agent intercepts spawn. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Expect SubagentStart to cancel spawn" được nêu ở cơ chế Subagent lifecycle. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Need reject invocation missing mandatory tenant identifier", ưu tiên phân biệt `Subagent lifecycle` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Treat all concerns as one unresolved blob**. Đánh giá chính xác nhất là gì?

- **A.** Treat all concerns as one unresolved blob; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Put ALWAYS verify in system prompt alone; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Use prompt for both; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Track distinct requests with own prerequisites and outcomes; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Treat all concerns as one unresolved blob" được nêu ở cơ chế Multi-concern handling. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Deterministic prerequisites**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Risk-based control choice**, không giải quyết được yêu cầu cốt lõi "Decompose issue, preserve each status and handoff context" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Decompose issue, preserve each status and handoff context. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "User asks refund, address change and points balance", ưu tiên phân biệt `Multi-concern handling` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **AI tries refund before verified identity**, tiêu chí pass phù hợp là gì?

- **A.** Reject refund tool execution until verified session identity exists; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Put ALWAYS verify in system prompt alone; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Use prompt for both; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Expect SubagentStart to cancel spawn; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** High-risk business operations need code-level gates. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Put ALWAYS verify in system prompt alone" được nêu ở cơ chế Deterministic prerequisites. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Risk-based control choice**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Subagent lifecycle**, không giải quyết được yêu cầu cốt lõi "High-risk business operations need code-level gates" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "AI tries refund before verified identity", ưu tiên phân biệt `Deterministic prerequisites` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Workflow has strict AML rule and flexible email tone**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Treat all concerns as one unresolved blob; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Enforce AML in backend, tone in prompt; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Use prompt for both; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Expect SubagentStart to cancel spawn; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Multi-concern handling**, không giải quyết được yêu cầu cốt lõi "Money, security and regulation use programmatic enforcement; style may use prompts" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Money, security and regulation use programmatic enforcement; style may use prompts. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Use prompt for both" được nêu ở cơ chế Risk-based control choice. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Subagent lifecycle**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Workflow has strict AML rule and flexible email tone", ưu tiên phân biệt `Risk-based control choice` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "AI tries refund before verified identity".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Reject refund tool execution until verified session identity exists.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Deterministic prerequisites:** High-risk business operations need code-level gates. ✓ Reject refund tool execution until verified session identity exists. ✗ Put ALWAYS verify in system prompt alone.
- **Risk-based control choice:** Money, security and regulation use programmatic enforcement; style may use prompts. ✓ Enforce AML in backend, tone in prompt. ✗ Use prompt for both.
- **Subagent lifecycle:** SubagentStart observes; SubagentStop can block completion; PreToolUse on Agent intercepts spawn. ✓ Block Agent call with PreToolUse before spawn. ✗ Expect SubagentStart to cancel spawn.
- **Multi-concern handling:** Decompose issue, preserve each status and handoff context. ✓ Track distinct requests with own prerequisites and outcomes. ✗ Treat all concerns as one unresolved blob.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-4-workflow-enforcement-handoff
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
