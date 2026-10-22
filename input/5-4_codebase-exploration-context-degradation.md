# 5.4 — Codebase Exploration & Context Degradation

> Domain 5: Context Management & Reliability · Tỷ trọng toàn domain: 15%
> Source lesson: https://claudecertificationguide.com/learn/5-context-management/5-4-codebase-exploration
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Codebase Exploration & Context Degradation**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Context degradation symptoms

**Principle (EN):** Generic patterns replace previously known exact symbols as conversation grows.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **generic patterns replace previously known exact symbols as conversation grows**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Agent forgets OrderRepository.findById after long exploration.

**Recommended implementation:** Restore factual scratchpad and targeted references.

**Incorrect shortcut / Sai lầm dễ mắc:** Ask to think harder with no evidence.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Agent forgets OrderRepository.findById after long exploration".
- Decision: áp dụng nguyên tắc **Context degradation symptoms** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Restore factual scratchpad and targeted references" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. External scratchpad

**Principle (EN):** Persist classes, paths, dependency chains and findings outside context.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **persist classes, paths, dependency chains and findings outside context**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Multi-day refactor needs stable architecture notes.

**Recommended implementation:** Write structured scratchpad and reread before decisions.

**Incorrect shortcut / Sai lầm dễ mắc:** Depend on implicit memory of old tool result.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Multi-day refactor needs stable architecture notes".
- Decision: áp dụng nguyên tắc **External scratchpad** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Write structured scratchpad and reread before decisions" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Subagent isolation

**Principle (EN):** Verbose exploration in isolated agents keeps coordinator concise.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **verbose exploration in isolated agents keeps coordinator concise**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Main session overflows with grep and read outputs.

**Recommended implementation:** Delegate bounded discovery and return focused summary.

**Incorrect shortcut / Sai lầm dễ mắc:** Append all raw discovery to main session.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Main session overflows with grep and read outputs".
- Decision: áp dụng nguyên tắc **Subagent isolation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Delegate bounded discovery and return focused summary" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Compact and phase summaries

**Principle (EN):** Summarize stable findings between phases while retaining precise references.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **summarize stable findings between phases while retaining precise references**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Phase 2 agent repeats Phase 1 architectural exploration.

**Recommended implementation:** Inject phase summary with file references; use /compact as needed.

**Incorrect shortcut / Sai lầm dễ mắc:** Start agents without previous findings.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Phase 2 agent repeats Phase 1 architectural exploration".
- Decision: áp dụng nguyên tắc **Compact and phase summaries** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Inject phase summary with file references; use /compact as needed" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Agent forgets OrderRepository.findById after long exploration.

**Bad design:** Ask to think harder with no evidence.

**Better design:** Restore factual scratchpad and targeted references.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Agent forgets OrderRepository.findById after long exploration.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Restore factual scratchpad and targeted references.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Context degradation symptoms:** "Ask to think harder with no evidence" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở context degradation symptoms, rồi chọn "Restore factual scratchpad and targeted references".

2. **Bẫy External scratchpad:** "Depend on implicit memory of old tool result" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở external scratchpad, rồi chọn "Write structured scratchpad and reread before decisions".

3. **Bẫy Subagent isolation:** "Append all raw discovery to main session" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở subagent isolation, rồi chọn "Delegate bounded discovery and return focused summary".

4. **Bẫy Compact and phase summaries:** "Start agents without previous findings" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở compact and phase summaries, rồi chọn "Inject phase summary with file references; use /compact as needed".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Agent forgets OrderRepository.findById after long exploration**. Phương án nào phù hợp nhất?

- **A.** Restore factual scratchpad and targeted references; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Ask to think harder with no evidence; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Depend on implicit memory of old tool result; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Append all raw discovery to main session; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Generic patterns replace previously known exact symbols as conversation grows. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Ask to think harder with no evidence" được nêu ở cơ chế Context degradation symptoms. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **External scratchpad**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Subagent isolation**, không giải quyết được yêu cầu cốt lõi "Generic patterns replace previously known exact symbols as conversation grows" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Agent forgets OrderRepository.findById after long exploration", ưu tiên phân biệt `Context degradation symptoms` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Depend on implicit memory of old tool result** cho tình huống: Multi-day refactor needs stable architecture notes. Cần phản biện thế nào?

- **A.** Start agents without previous findings; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Write structured scratchpad and reread before decisions; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Depend on implicit memory of old tool result; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Append all raw discovery to main session; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Compact and phase summaries**, không giải quyết được yêu cầu cốt lõi "Persist classes, paths, dependency chains and findings outside context" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Persist classes, paths, dependency chains and findings outside context. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Depend on implicit memory of old tool result" được nêu ở cơ chế External scratchpad. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Subagent isolation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Multi-day refactor needs stable architecture notes", ưu tiên phân biệt `External scratchpad` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Main session overflows with grep and read outputs** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Start agents without previous findings; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Ask to think harder with no evidence; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Delegate bounded discovery and return focused summary; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Append all raw discovery to main session; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Compact and phase summaries**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Context degradation symptoms**, không giải quyết được yêu cầu cốt lõi "Verbose exploration in isolated agents keeps coordinator concise" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Verbose exploration in isolated agents keeps coordinator concise. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Append all raw discovery to main session" được nêu ở cơ chế Subagent isolation. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Main session overflows with grep and read outputs", ưu tiên phân biệt `Subagent isolation` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Phase 2 agent repeats Phase 1 architectural exploration**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Start agents without previous findings; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Ask to think harder with no evidence; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Depend on implicit memory of old tool result; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Inject phase summary with file references; use /compact as needed; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Start agents without previous findings" được nêu ở cơ chế Compact and phase summaries. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Context degradation symptoms**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **External scratchpad**, không giải quyết được yêu cầu cốt lõi "Summarize stable findings between phases while retaining precise references" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Summarize stable findings between phases while retaining precise references. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Phase 2 agent repeats Phase 1 architectural exploration", ưu tiên phân biệt `Compact and phase summaries` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Ask to think harder with no evidence**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Restore factual scratchpad and targeted references; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Ask to think harder with no evidence; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Depend on implicit memory of old tool result; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Append all raw discovery to main session; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Generic patterns replace previously known exact symbols as conversation grows. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Ask to think harder with no evidence" được nêu ở cơ chế Context degradation symptoms. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **External scratchpad**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Subagent isolation**, không giải quyết được yêu cầu cốt lõi "Generic patterns replace previously known exact symbols as conversation grows" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Agent forgets OrderRepository.findById after long exploration", ưu tiên phân biệt `Context degradation symptoms` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Multi-day refactor needs stable architecture notes**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Start agents without previous findings; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Write structured scratchpad and reread before decisions; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Depend on implicit memory of old tool result; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Append all raw discovery to main session; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Compact and phase summaries**, không giải quyết được yêu cầu cốt lõi "Persist classes, paths, dependency chains and findings outside context" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Persist classes, paths, dependency chains and findings outside context. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Depend on implicit memory of old tool result" được nêu ở cơ chế External scratchpad. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Subagent isolation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Multi-day refactor needs stable architecture notes", ưu tiên phân biệt `External scratchpad` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Main session overflows with grep and read outputs**, nên chọn gì?

- **A.** Start agents without previous findings; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Ask to think harder with no evidence; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Delegate bounded discovery and return focused summary; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Append all raw discovery to main session; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Compact and phase summaries**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Context degradation symptoms**, không giải quyết được yêu cầu cốt lõi "Verbose exploration in isolated agents keeps coordinator concise" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Verbose exploration in isolated agents keeps coordinator concise. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Append all raw discovery to main session" được nêu ở cơ chế Subagent isolation. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Main session overflows with grep and read outputs", ưu tiên phân biệt `Subagent isolation` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Start agents without previous findings**. Đánh giá chính xác nhất là gì?

- **A.** Start agents without previous findings; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Ask to think harder with no evidence; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Depend on implicit memory of old tool result; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Inject phase summary with file references; use /compact as needed; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Start agents without previous findings" được nêu ở cơ chế Compact and phase summaries. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Context degradation symptoms**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **External scratchpad**, không giải quyết được yêu cầu cốt lõi "Summarize stable findings between phases while retaining precise references" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Summarize stable findings between phases while retaining precise references. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Phase 2 agent repeats Phase 1 architectural exploration", ưu tiên phân biệt `Compact and phase summaries` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Agent forgets OrderRepository.findById after long exploration**, tiêu chí pass phù hợp là gì?

- **A.** Restore factual scratchpad and targeted references; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Ask to think harder with no evidence; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Depend on implicit memory of old tool result; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Append all raw discovery to main session; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Generic patterns replace previously known exact symbols as conversation grows. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Ask to think harder with no evidence" được nêu ở cơ chế Context degradation symptoms. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **External scratchpad**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Subagent isolation**, không giải quyết được yêu cầu cốt lõi "Generic patterns replace previously known exact symbols as conversation grows" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Agent forgets OrderRepository.findById after long exploration", ưu tiên phân biệt `Context degradation symptoms` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Multi-day refactor needs stable architecture notes**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Start agents without previous findings; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Write structured scratchpad and reread before decisions; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Depend on implicit memory of old tool result; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Append all raw discovery to main session; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Compact and phase summaries**, không giải quyết được yêu cầu cốt lõi "Persist classes, paths, dependency chains and findings outside context" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Persist classes, paths, dependency chains and findings outside context. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Depend on implicit memory of old tool result" được nêu ở cơ chế External scratchpad. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Subagent isolation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Multi-day refactor needs stable architecture notes", ưu tiên phân biệt `External scratchpad` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Agent forgets OrderRepository.findById after long exploration".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Restore factual scratchpad and targeted references.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Context degradation symptoms:** Generic patterns replace previously known exact symbols as conversation grows. ✓ Restore factual scratchpad and targeted references. ✗ Ask to think harder with no evidence.
- **External scratchpad:** Persist classes, paths, dependency chains and findings outside context. ✓ Write structured scratchpad and reread before decisions. ✗ Depend on implicit memory of old tool result.
- **Subagent isolation:** Verbose exploration in isolated agents keeps coordinator concise. ✓ Delegate bounded discovery and return focused summary. ✗ Append all raw discovery to main session.
- **Compact and phase summaries:** Summarize stable findings between phases while retaining precise references. ✓ Inject phase summary with file references; use /compact as needed. ✗ Start agents without previous findings.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/5-context-management/5-4-codebase-exploration
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
