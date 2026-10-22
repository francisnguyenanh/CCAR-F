# 3.4 — Plan Mode vs Direct Execution

> Domain 3: Claude Code Configuration & Workflows · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/3-claude-code-config/3-4-plan-mode-execution
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Plan Mode vs Direct Execution**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Plan for ambiguity and breadth

**Principle (EN):** Architecture, multiple viable designs or extensive files warrant planning.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **architecture, multiple viable designs or extensive files warrant planning**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Refactor services spanning 40 modules.

**Recommended implementation:** Explore dependencies, compare options and plan before write.

**Incorrect shortcut / Sai lầm dễ mắc:** Begin editing random files immediately.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Refactor services spanning 40 modules".
- Decision: áp dụng nguyên tắc **Plan for ambiguity and breadth** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Explore dependencies, compare options and plan before write" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Execute for well-defined changes

**Principle (EN):** One known fix in known location can be done directly.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **one known fix in known location can be done directly**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Null guard required in known function.

**Recommended implementation:** Apply precise change and test.

**Incorrect shortcut / Sai lầm dễ mắc:** Create lengthy architecture study.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Null guard required in known function".
- Decision: áp dụng nguyên tắc **Execute for well-defined changes** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Apply precise change and test" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Plan then execute

**Principle (EN):** Use read-only planning then controlled implementation.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **use read-only planning then controlled implementation**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Library migration requires strategy then many file edits.

**Recommended implementation:** Plan pattern then execute reviewed steps.

**Incorrect shortcut / Sai lầm dễ mắc:** Stay in plan mode forever.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Library migration requires strategy then many file edits".
- Decision: áp dụng nguyên tắc **Plan then execute** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Plan pattern then execute reviewed steps" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Explore subagent isolation

**Principle (EN):** Delegate verbose discovery and return summary.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **delegate verbose discovery and return summary**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Investigating unknown dependency tree would pollute primary context.

**Recommended implementation:** Use Explore subagent for search and concise handoff.

**Incorrect shortcut / Sai lầm dễ mắc:** Paste all thousands of found lines into main context.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Investigating unknown dependency tree would pollute primary context".
- Decision: áp dụng nguyên tắc **Explore subagent isolation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use Explore subagent for search and concise handoff" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Refactor services spanning 40 modules.

**Bad design:** Begin editing random files immediately.

**Better design:** Explore dependencies, compare options and plan before write.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Refactor services spanning 40 modules.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Explore dependencies, compare options and plan before write.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Plan for ambiguity and breadth:** "Begin editing random files immediately" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở plan for ambiguity and breadth, rồi chọn "Explore dependencies, compare options and plan before write".

2. **Bẫy Execute for well-defined changes:** "Create lengthy architecture study" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở execute for well-defined changes, rồi chọn "Apply precise change and test".

3. **Bẫy Plan then execute:** "Stay in plan mode forever" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở plan then execute, rồi chọn "Plan pattern then execute reviewed steps".

4. **Bẫy Explore subagent isolation:** "Paste all thousands of found lines into main context" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở explore subagent isolation, rồi chọn "Use Explore subagent for search and concise handoff".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Refactor services spanning 40 modules**. Phương án nào phù hợp nhất?

- **A.** Create lengthy architecture study; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Stay in plan mode forever; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Explore dependencies, compare options and plan before write; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Begin editing random files immediately; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Execute for well-defined changes**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Plan then execute**, không giải quyết được yêu cầu cốt lõi "Architecture, multiple viable designs or extensive files warrant planning" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Architecture, multiple viable designs or extensive files warrant planning. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Begin editing random files immediately" được nêu ở cơ chế Plan for ambiguity and breadth. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Refactor services spanning 40 modules", ưu tiên phân biệt `Plan for ambiguity and breadth` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Create lengthy architecture study** cho tình huống: Null guard required in known function. Cần phản biện thế nào?

- **A.** Create lengthy architecture study; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Stay in plan mode forever; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Paste all thousands of found lines into main context; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Apply precise change and test; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Create lengthy architecture study" được nêu ở cơ chế Execute for well-defined changes. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Plan then execute**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Explore subagent isolation**, không giải quyết được yêu cầu cốt lõi "One known fix in known location can be done directly" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** One known fix in known location can be done directly. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Null guard required in known function", ưu tiên phân biệt `Execute for well-defined changes` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Library migration requires strategy then many file edits** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Plan pattern then execute reviewed steps; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Stay in plan mode forever; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Paste all thousands of found lines into main context; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Begin editing random files immediately; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Use read-only planning then controlled implementation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Stay in plan mode forever" được nêu ở cơ chế Plan then execute. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Explore subagent isolation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Plan for ambiguity and breadth**, không giải quyết được yêu cầu cốt lõi "Use read-only planning then controlled implementation" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Library migration requires strategy then many file edits", ưu tiên phân biệt `Plan then execute` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Investigating unknown dependency tree would pollute primary context**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Create lengthy architecture study; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Use Explore subagent for search and concise handoff; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Paste all thousands of found lines into main context; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Begin editing random files immediately; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Execute for well-defined changes**, không giải quyết được yêu cầu cốt lõi "Delegate verbose discovery and return summary" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Delegate verbose discovery and return summary. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Paste all thousands of found lines into main context" được nêu ở cơ chế Explore subagent isolation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Plan for ambiguity and breadth**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Investigating unknown dependency tree would pollute primary context", ưu tiên phân biệt `Explore subagent isolation` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Begin editing random files immediately**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Create lengthy architecture study; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Stay in plan mode forever; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Explore dependencies, compare options and plan before write; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Begin editing random files immediately; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Execute for well-defined changes**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Plan then execute**, không giải quyết được yêu cầu cốt lõi "Architecture, multiple viable designs or extensive files warrant planning" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Architecture, multiple viable designs or extensive files warrant planning. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Begin editing random files immediately" được nêu ở cơ chế Plan for ambiguity and breadth. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Refactor services spanning 40 modules", ưu tiên phân biệt `Plan for ambiguity and breadth` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Null guard required in known function**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Create lengthy architecture study; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Stay in plan mode forever; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Paste all thousands of found lines into main context; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Apply precise change and test; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Create lengthy architecture study" được nêu ở cơ chế Execute for well-defined changes. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Plan then execute**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Explore subagent isolation**, không giải quyết được yêu cầu cốt lõi "One known fix in known location can be done directly" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** One known fix in known location can be done directly. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Null guard required in known function", ưu tiên phân biệt `Execute for well-defined changes` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Library migration requires strategy then many file edits**, nên chọn gì?

- **A.** Plan pattern then execute reviewed steps; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Stay in plan mode forever; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Paste all thousands of found lines into main context; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Begin editing random files immediately; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Use read-only planning then controlled implementation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Stay in plan mode forever" được nêu ở cơ chế Plan then execute. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Explore subagent isolation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Plan for ambiguity and breadth**, không giải quyết được yêu cầu cốt lõi "Use read-only planning then controlled implementation" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Library migration requires strategy then many file edits", ưu tiên phân biệt `Plan then execute` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Paste all thousands of found lines into main context**. Đánh giá chính xác nhất là gì?

- **A.** Create lengthy architecture study; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Use Explore subagent for search and concise handoff; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Paste all thousands of found lines into main context; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Begin editing random files immediately; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Execute for well-defined changes**, không giải quyết được yêu cầu cốt lõi "Delegate verbose discovery and return summary" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Delegate verbose discovery and return summary. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Paste all thousands of found lines into main context" được nêu ở cơ chế Explore subagent isolation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Plan for ambiguity and breadth**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Investigating unknown dependency tree would pollute primary context", ưu tiên phân biệt `Explore subagent isolation` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Refactor services spanning 40 modules**, tiêu chí pass phù hợp là gì?

- **A.** Create lengthy architecture study; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Stay in plan mode forever; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Explore dependencies, compare options and plan before write; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Begin editing random files immediately; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Execute for well-defined changes**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Plan then execute**, không giải quyết được yêu cầu cốt lõi "Architecture, multiple viable designs or extensive files warrant planning" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Architecture, multiple viable designs or extensive files warrant planning. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Begin editing random files immediately" được nêu ở cơ chế Plan for ambiguity and breadth. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Refactor services spanning 40 modules", ưu tiên phân biệt `Plan for ambiguity and breadth` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Null guard required in known function**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Create lengthy architecture study; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Stay in plan mode forever; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Paste all thousands of found lines into main context; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Apply precise change and test; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Create lengthy architecture study" được nêu ở cơ chế Execute for well-defined changes. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Plan then execute**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Explore subagent isolation**, không giải quyết được yêu cầu cốt lõi "One known fix in known location can be done directly" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** One known fix in known location can be done directly. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Null guard required in known function", ưu tiên phân biệt `Execute for well-defined changes` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Refactor services spanning 40 modules".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Explore dependencies, compare options and plan before write.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Plan for ambiguity and breadth:** Architecture, multiple viable designs or extensive files warrant planning. ✓ Explore dependencies, compare options and plan before write. ✗ Begin editing random files immediately.
- **Execute for well-defined changes:** One known fix in known location can be done directly. ✓ Apply precise change and test. ✗ Create lengthy architecture study.
- **Plan then execute:** Use read-only planning then controlled implementation. ✓ Plan pattern then execute reviewed steps. ✗ Stay in plan mode forever.
- **Explore subagent isolation:** Delegate verbose discovery and return summary. ✓ Use Explore subagent for search and concise handoff. ✗ Paste all thousands of found lines into main context.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/3-claude-code-config/3-4-plan-mode-execution
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
