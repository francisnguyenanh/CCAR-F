# 1.2 — Multi-Agent Orchestration

> Domain 1: Agentic Architecture & Orchestration · Tỷ trọng toàn domain: 27%
> Source lesson: https://claudecertificationguide.com/learn/1-agentic-architecture/1-2-orchestration-patterns
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Multi-Agent Orchestration**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Hub-and-spoke coordinator

**Principle (EN):** Coordinator decomposes, delegates, routes and aggregates.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **coordinator decomposes, delegates, routes and aggregates**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Two research agents need to exchange findings.

**Recommended implementation:** Route findings through coordinator with traceability.

**Incorrect shortcut / Sai lầm dễ mắc:** Allow unlogged direct agent-to-agent messages.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Two research agents need to exchange findings".
- Decision: áp dụng nguyên tắc **Hub-and-spoke coordinator** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Route findings through coordinator with traceability" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Isolated subagent context

**Principle (EN):** Subagents do not inherit coordinator history automatically.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **subagents do not inherit coordinator history automatically**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Synthesizer cannot cite findings from researcher.

**Recommended implementation:** Include evidence and provenance explicitly in delegation.

**Incorrect shortcut / Sai lầm dễ mắc:** Assume shared memory.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Synthesizer cannot cite findings from researcher".
- Decision: áp dụng nguyên tắc **Isolated subagent context** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Include evidence and provenance explicitly in delegation" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Coverage decomposition

**Principle (EN):** Scope gaps arise upstream in coordinator task breakdown.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **scope gaps arise upstream in coordinator task breakdown**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Renewable report covers solar and wind, not tidal or geothermal.

**Recommended implementation:** Revise decomposition and coverage checklist.

**Incorrect shortcut / Sai lầm dễ mắc:** Add more workers to same narrow tasks.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Renewable report covers solar and wind, not tidal or geothermal".
- Decision: áp dụng nguyên tắc **Coverage decomposition** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Revise decomposition and coverage checklist" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Dynamic selection and refinement

**Principle (EN):** Invoke only needed specialists; re-delegate unresolved scope.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **invoke only needed specialists; re-delegate unresolved scope**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Simple factual question triggers five unnecessary specialists.

**Recommended implementation:** Choose minimal subagent subset and inspect coverage.

**Incorrect shortcut / Sai lầm dễ mắc:** Always run full chain.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Simple factual question triggers five unnecessary specialists".
- Decision: áp dụng nguyên tắc **Dynamic selection and refinement** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Choose minimal subagent subset and inspect coverage" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Two research agents need to exchange findings.

**Bad design:** Allow unlogged direct agent-to-agent messages.

**Better design:** Route findings through coordinator with traceability.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Two research agents need to exchange findings.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Route findings through coordinator with traceability.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Hub-and-spoke coordinator:** "Allow unlogged direct agent-to-agent messages" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở hub-and-spoke coordinator, rồi chọn "Route findings through coordinator with traceability".

2. **Bẫy Isolated subagent context:** "Assume shared memory" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở isolated subagent context, rồi chọn "Include evidence and provenance explicitly in delegation".

3. **Bẫy Coverage decomposition:** "Add more workers to same narrow tasks" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở coverage decomposition, rồi chọn "Revise decomposition and coverage checklist".

4. **Bẫy Dynamic selection and refinement:** "Always run full chain" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở dynamic selection and refinement, rồi chọn "Choose minimal subagent subset and inspect coverage".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Two research agents need to exchange findings**. Phương án nào phù hợp nhất?

- **A.** Route findings through coordinator with traceability; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Allow unlogged direct agent-to-agent messages; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Assume shared memory; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Add more workers to same narrow tasks; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Coordinator decomposes, delegates, routes and aggregates. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Allow unlogged direct agent-to-agent messages" được nêu ở cơ chế Hub-and-spoke coordinator. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Isolated subagent context**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Coverage decomposition**, không giải quyết được yêu cầu cốt lõi "Coordinator decomposes, delegates, routes and aggregates" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Two research agents need to exchange findings", ưu tiên phân biệt `Hub-and-spoke coordinator` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Assume shared memory** cho tình huống: Synthesizer cannot cite findings from researcher. Cần phản biện thế nào?

- **A.** Always run full chain; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Include evidence and provenance explicitly in delegation; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Assume shared memory; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Add more workers to same narrow tasks; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Dynamic selection and refinement**, không giải quyết được yêu cầu cốt lõi "Subagents do not inherit coordinator history automatically" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Subagents do not inherit coordinator history automatically. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Assume shared memory" được nêu ở cơ chế Isolated subagent context. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Coverage decomposition**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Synthesizer cannot cite findings from researcher", ưu tiên phân biệt `Isolated subagent context` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Renewable report covers solar and wind, not tidal or geothermal** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Always run full chain; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Allow unlogged direct agent-to-agent messages; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Revise decomposition and coverage checklist; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Add more workers to same narrow tasks; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Dynamic selection and refinement**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Hub-and-spoke coordinator**, không giải quyết được yêu cầu cốt lõi "Scope gaps arise upstream in coordinator task breakdown" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Scope gaps arise upstream in coordinator task breakdown. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Add more workers to same narrow tasks" được nêu ở cơ chế Coverage decomposition. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Renewable report covers solar and wind, not tidal or geothermal", ưu tiên phân biệt `Coverage decomposition` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Simple factual question triggers five unnecessary specialists**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Always run full chain; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Allow unlogged direct agent-to-agent messages; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Assume shared memory; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Choose minimal subagent subset and inspect coverage; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Always run full chain" được nêu ở cơ chế Dynamic selection and refinement. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Hub-and-spoke coordinator**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Isolated subagent context**, không giải quyết được yêu cầu cốt lõi "Invoke only needed specialists; re-delegate unresolved scope" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Invoke only needed specialists; re-delegate unresolved scope. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Simple factual question triggers five unnecessary specialists", ưu tiên phân biệt `Dynamic selection and refinement` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Allow unlogged direct agent-to-agent messages**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Route findings through coordinator with traceability; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Allow unlogged direct agent-to-agent messages; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Assume shared memory; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Add more workers to same narrow tasks; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Coordinator decomposes, delegates, routes and aggregates. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Allow unlogged direct agent-to-agent messages" được nêu ở cơ chế Hub-and-spoke coordinator. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Isolated subagent context**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Coverage decomposition**, không giải quyết được yêu cầu cốt lõi "Coordinator decomposes, delegates, routes and aggregates" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Two research agents need to exchange findings", ưu tiên phân biệt `Hub-and-spoke coordinator` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Synthesizer cannot cite findings from researcher**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Always run full chain; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Include evidence and provenance explicitly in delegation; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Assume shared memory; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Add more workers to same narrow tasks; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Dynamic selection and refinement**, không giải quyết được yêu cầu cốt lõi "Subagents do not inherit coordinator history automatically" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Subagents do not inherit coordinator history automatically. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Assume shared memory" được nêu ở cơ chế Isolated subagent context. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Coverage decomposition**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Synthesizer cannot cite findings from researcher", ưu tiên phân biệt `Isolated subagent context` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Renewable report covers solar and wind, not tidal or geothermal**, nên chọn gì?

- **A.** Always run full chain; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Allow unlogged direct agent-to-agent messages; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Revise decomposition and coverage checklist; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Add more workers to same narrow tasks; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Dynamic selection and refinement**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Hub-and-spoke coordinator**, không giải quyết được yêu cầu cốt lõi "Scope gaps arise upstream in coordinator task breakdown" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Scope gaps arise upstream in coordinator task breakdown. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Add more workers to same narrow tasks" được nêu ở cơ chế Coverage decomposition. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Renewable report covers solar and wind, not tidal or geothermal", ưu tiên phân biệt `Coverage decomposition` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Always run full chain**. Đánh giá chính xác nhất là gì?

- **A.** Always run full chain; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Allow unlogged direct agent-to-agent messages; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Assume shared memory; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Choose minimal subagent subset and inspect coverage; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Always run full chain" được nêu ở cơ chế Dynamic selection and refinement. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Hub-and-spoke coordinator**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Isolated subagent context**, không giải quyết được yêu cầu cốt lõi "Invoke only needed specialists; re-delegate unresolved scope" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Invoke only needed specialists; re-delegate unresolved scope. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Simple factual question triggers five unnecessary specialists", ưu tiên phân biệt `Dynamic selection and refinement` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Two research agents need to exchange findings**, tiêu chí pass phù hợp là gì?

- **A.** Route findings through coordinator with traceability; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Allow unlogged direct agent-to-agent messages; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Assume shared memory; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Add more workers to same narrow tasks; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Coordinator decomposes, delegates, routes and aggregates. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Allow unlogged direct agent-to-agent messages" được nêu ở cơ chế Hub-and-spoke coordinator. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Isolated subagent context**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Coverage decomposition**, không giải quyết được yêu cầu cốt lõi "Coordinator decomposes, delegates, routes and aggregates" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Two research agents need to exchange findings", ưu tiên phân biệt `Hub-and-spoke coordinator` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Synthesizer cannot cite findings from researcher**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Always run full chain; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Include evidence and provenance explicitly in delegation; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Assume shared memory; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Add more workers to same narrow tasks; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Dynamic selection and refinement**, không giải quyết được yêu cầu cốt lõi "Subagents do not inherit coordinator history automatically" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Subagents do not inherit coordinator history automatically. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Assume shared memory" được nêu ở cơ chế Isolated subagent context. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Coverage decomposition**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Synthesizer cannot cite findings from researcher", ưu tiên phân biệt `Isolated subagent context` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Two research agents need to exchange findings".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Route findings through coordinator with traceability.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Hub-and-spoke coordinator:** Coordinator decomposes, delegates, routes and aggregates. ✓ Route findings through coordinator with traceability. ✗ Allow unlogged direct agent-to-agent messages.
- **Isolated subagent context:** Subagents do not inherit coordinator history automatically. ✓ Include evidence and provenance explicitly in delegation. ✗ Assume shared memory.
- **Coverage decomposition:** Scope gaps arise upstream in coordinator task breakdown. ✓ Revise decomposition and coverage checklist. ✗ Add more workers to same narrow tasks.
- **Dynamic selection and refinement:** Invoke only needed specialists; re-delegate unresolved scope. ✓ Choose minimal subagent subset and inspect coverage. ✗ Always run full chain.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-2-orchestration-patterns
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
