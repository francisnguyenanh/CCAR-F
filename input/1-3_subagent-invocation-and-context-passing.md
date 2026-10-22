# 1.3 — Subagent Invocation and Context Passing

> Domain 1: Agentic Architecture & Orchestration · Tỷ trọng toàn domain: 27%
> Source lesson: https://claudecertificationguide.com/learn/1-agentic-architecture/1-3-subagent-invocation-context
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Subagent Invocation and Context Passing**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Task/Agent spawning permission

**Principle (EN):** Coordinator needs Task or Agent in allowedTools for spawning.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **coordinator needs Task or Agent in allowedTools for spawning**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Defined subagent never launches.

**Recommended implementation:** Enable Agent/Task on coordinator and define agent role.

**Incorrect shortcut / Sai lầm dễ mắc:** Only improve descriptive prompt.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Defined subagent never launches".
- Decision: áp dụng nguyên tắc **Task/Agent spawning permission** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Enable Agent/Task on coordinator and define agent role" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Structured evidence handoff

**Principle (EN):** Pass claim plus URL, document title, page and confidence.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **pass claim plus URL, document title, page and confidence**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Synthesis returns correct facts without citations.

**Recommended implementation:** Keep source metadata with each finding.

**Incorrect shortcut / Sai lầm dễ mắc:** Pass only polished prose.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Synthesis returns correct facts without citations".
- Decision: áp dụng nguyên tắc **Structured evidence handoff** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Keep source metadata with each finding" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Parallel independent delegation

**Principle (EN):** Multiple independent Agent calls can execute concurrently.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **multiple independent Agent calls can execute concurrently**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Search and local document analysis have no dependency.

**Recommended implementation:** Dispatch both concurrently and merge after completion.

**Incorrect shortcut / Sai lầm dễ mắc:** Wait for search before starting independent analysis.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Search and local document analysis have no dependency".
- Decision: áp dụng nguyên tắc **Parallel independent delegation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Dispatch both concurrently and merge after completion" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Fork versus resume

**Principle (EN):** Fork branches common baseline, resume continues same history.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **fork branches common baseline, resume continues same history**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Team compares two refactor approaches after initial audit.

**Recommended implementation:** Fork independent branches.

**Incorrect shortcut / Sai lầm dễ mắc:** Resume one session and mix both experiments.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Team compares two refactor approaches after initial audit".
- Decision: áp dụng nguyên tắc **Fork versus resume** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Fork independent branches" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Defined subagent never launches.

**Bad design:** Only improve descriptive prompt.

**Better design:** Enable Agent/Task on coordinator and define agent role.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Defined subagent never launches.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Enable Agent/Task on coordinator and define agent role.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Task/Agent spawning permission:** "Only improve descriptive prompt" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở task/agent spawning permission, rồi chọn "Enable Agent/Task on coordinator and define agent role".

2. **Bẫy Structured evidence handoff:** "Pass only polished prose" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở structured evidence handoff, rồi chọn "Keep source metadata with each finding".

3. **Bẫy Parallel independent delegation:** "Wait for search before starting independent analysis" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở parallel independent delegation, rồi chọn "Dispatch both concurrently and merge after completion".

4. **Bẫy Fork versus resume:** "Resume one session and mix both experiments" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở fork versus resume, rồi chọn "Fork independent branches".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Defined subagent never launches**. Phương án nào phù hợp nhất?

- **A.** Enable Agent/Task on coordinator and define agent role; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Only improve descriptive prompt; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Pass only polished prose; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Wait for search before starting independent analysis; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Coordinator needs Task or Agent in allowedTools for spawning. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Only improve descriptive prompt" được nêu ở cơ chế Task/Agent spawning permission. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Structured evidence handoff**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Parallel independent delegation**, không giải quyết được yêu cầu cốt lõi "Coordinator needs Task or Agent in allowedTools for spawning" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Defined subagent never launches", ưu tiên phân biệt `Task/Agent spawning permission` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Pass only polished prose** cho tình huống: Synthesis returns correct facts without citations. Cần phản biện thế nào?

- **A.** Resume one session and mix both experiments; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Keep source metadata with each finding; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Pass only polished prose; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Wait for search before starting independent analysis; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Fork versus resume**, không giải quyết được yêu cầu cốt lõi "Pass claim plus URL, document title, page and confidence" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Pass claim plus URL, document title, page and confidence. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Pass only polished prose" được nêu ở cơ chế Structured evidence handoff. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Parallel independent delegation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Synthesis returns correct facts without citations", ưu tiên phân biệt `Structured evidence handoff` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Search and local document analysis have no dependency** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Resume one session and mix both experiments; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Only improve descriptive prompt; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Dispatch both concurrently and merge after completion; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Wait for search before starting independent analysis; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Fork versus resume**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Task/Agent spawning permission**, không giải quyết được yêu cầu cốt lõi "Multiple independent Agent calls can execute concurrently" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Multiple independent Agent calls can execute concurrently. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Wait for search before starting independent analysis" được nêu ở cơ chế Parallel independent delegation. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Search and local document analysis have no dependency", ưu tiên phân biệt `Parallel independent delegation` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Team compares two refactor approaches after initial audit**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Resume one session and mix both experiments; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Only improve descriptive prompt; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Pass only polished prose; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Fork independent branches; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Resume one session and mix both experiments" được nêu ở cơ chế Fork versus resume. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Task/Agent spawning permission**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Structured evidence handoff**, không giải quyết được yêu cầu cốt lõi "Fork branches common baseline, resume continues same history" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Fork branches common baseline, resume continues same history. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Team compares two refactor approaches after initial audit", ưu tiên phân biệt `Fork versus resume` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Only improve descriptive prompt**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Enable Agent/Task on coordinator and define agent role; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Only improve descriptive prompt; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Pass only polished prose; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Wait for search before starting independent analysis; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Coordinator needs Task or Agent in allowedTools for spawning. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Only improve descriptive prompt" được nêu ở cơ chế Task/Agent spawning permission. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Structured evidence handoff**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Parallel independent delegation**, không giải quyết được yêu cầu cốt lõi "Coordinator needs Task or Agent in allowedTools for spawning" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Defined subagent never launches", ưu tiên phân biệt `Task/Agent spawning permission` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Synthesis returns correct facts without citations**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Resume one session and mix both experiments; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Keep source metadata with each finding; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Pass only polished prose; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Wait for search before starting independent analysis; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Fork versus resume**, không giải quyết được yêu cầu cốt lõi "Pass claim plus URL, document title, page and confidence" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Pass claim plus URL, document title, page and confidence. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Pass only polished prose" được nêu ở cơ chế Structured evidence handoff. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Parallel independent delegation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Synthesis returns correct facts without citations", ưu tiên phân biệt `Structured evidence handoff` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Search and local document analysis have no dependency**, nên chọn gì?

- **A.** Resume one session and mix both experiments; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Only improve descriptive prompt; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Dispatch both concurrently and merge after completion; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Wait for search before starting independent analysis; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Fork versus resume**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Task/Agent spawning permission**, không giải quyết được yêu cầu cốt lõi "Multiple independent Agent calls can execute concurrently" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Multiple independent Agent calls can execute concurrently. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Wait for search before starting independent analysis" được nêu ở cơ chế Parallel independent delegation. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Search and local document analysis have no dependency", ưu tiên phân biệt `Parallel independent delegation` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Resume one session and mix both experiments**. Đánh giá chính xác nhất là gì?

- **A.** Resume one session and mix both experiments; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Only improve descriptive prompt; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Pass only polished prose; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Fork independent branches; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Resume one session and mix both experiments" được nêu ở cơ chế Fork versus resume. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Task/Agent spawning permission**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Structured evidence handoff**, không giải quyết được yêu cầu cốt lõi "Fork branches common baseline, resume continues same history" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Fork branches common baseline, resume continues same history. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Team compares two refactor approaches after initial audit", ưu tiên phân biệt `Fork versus resume` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Defined subagent never launches**, tiêu chí pass phù hợp là gì?

- **A.** Enable Agent/Task on coordinator and define agent role; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Only improve descriptive prompt; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Pass only polished prose; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Wait for search before starting independent analysis; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Coordinator needs Task or Agent in allowedTools for spawning. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Only improve descriptive prompt" được nêu ở cơ chế Task/Agent spawning permission. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Structured evidence handoff**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Parallel independent delegation**, không giải quyết được yêu cầu cốt lõi "Coordinator needs Task or Agent in allowedTools for spawning" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Defined subagent never launches", ưu tiên phân biệt `Task/Agent spawning permission` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Synthesis returns correct facts without citations**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Resume one session and mix both experiments; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Keep source metadata with each finding; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Pass only polished prose; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Wait for search before starting independent analysis; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Fork versus resume**, không giải quyết được yêu cầu cốt lõi "Pass claim plus URL, document title, page and confidence" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Pass claim plus URL, document title, page and confidence. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Pass only polished prose" được nêu ở cơ chế Structured evidence handoff. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Parallel independent delegation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Synthesis returns correct facts without citations", ưu tiên phân biệt `Structured evidence handoff` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Defined subagent never launches".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Enable Agent/Task on coordinator and define agent role.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Task/Agent spawning permission:** Coordinator needs Task or Agent in allowedTools for spawning. ✓ Enable Agent/Task on coordinator and define agent role. ✗ Only improve descriptive prompt.
- **Structured evidence handoff:** Pass claim plus URL, document title, page and confidence. ✓ Keep source metadata with each finding. ✗ Pass only polished prose.
- **Parallel independent delegation:** Multiple independent Agent calls can execute concurrently. ✓ Dispatch both concurrently and merge after completion. ✗ Wait for search before starting independent analysis.
- **Fork versus resume:** Fork branches common baseline, resume continues same history. ✓ Fork independent branches. ✗ Resume one session and mix both experiments.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-3-subagent-invocation-context
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
