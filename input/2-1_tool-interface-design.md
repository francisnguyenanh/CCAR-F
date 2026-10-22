# 2.1 — Tool Interface Design

> Domain 2: Tool Design & MCP Integration · Tỷ trọng toàn domain: 18%
> Source lesson: https://claudecertificationguide.com/learn/2-tool-design-mcp/2-1-tool-schema-design
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Tool Interface Design**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Tool description contract

**Principle (EN):** Describe purpose, inputs, examples, edge cases, and competing-tool boundaries.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **describe purpose, inputs, examples, edge cases, and competing-tool boundaries**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Order query incorrectly routes to customer profile lookup.

**Recommended implementation:** Clarify input identifiers and use / do-not-use instructions.

**Incorrect shortcut / Sai lầm dễ mắc:** Immediately build external keyword classifier.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Order query incorrectly routes to customer profile lookup".
- Decision: áp dụng nguyên tắc **Tool description contract** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Clarify input identifiers and use / do-not-use instructions" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Overlap diagnosis

**Principle (EN):** Weak descriptions cause ambiguity when tool count manageable.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **weak descriptions cause ambiguity when tool count manageable**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Five tools with two nearly identical descriptions.

**Recommended implementation:** Rewrite the two boundaries before redesign.

**Incorrect shortcut / Sai lầm dễ mắc:** Add eight few-shot examples first.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Five tools with two nearly identical descriptions".
- Decision: áp dụng nguyên tắc **Overlap diagnosis** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Rewrite the two boundaries before redesign" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Specific action granularity

**Principle (EN):** Different intents deserve purpose-specific tools.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **different intents deserve purpose-specific tools**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Generic analyze_document handles summary, extraction and verification.

**Recommended implementation:** Split into narrow explicit operations.

**Incorrect shortcut / Sai lầm dễ mắc:** Keep all actions hidden inside vague analyze_document.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Generic analyze_document handles summary, extraction and verification".
- Decision: áp dụng nguyên tắc **Specific action granularity** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Split into narrow explicit operations" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. System prompt interference

**Principle (EN):** Global system wording may override tool disambiguation.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **global system wording may override tool disambiguation**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** System says always fetch customer before any order step.

**Recommended implementation:** Audit and repair conflicting global instructions.

**Incorrect shortcut / Sai lầm dễ mắc:** Assume descriptions overrule system prompt automatically.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "System says always fetch customer before any order step".
- Decision: áp dụng nguyên tắc **System prompt interference** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Audit and repair conflicting global instructions" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Order query incorrectly routes to customer profile lookup.

**Bad design:** Immediately build external keyword classifier.

**Better design:** Clarify input identifiers and use / do-not-use instructions.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Order query incorrectly routes to customer profile lookup.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Clarify input identifiers and use / do-not-use instructions.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Tool description contract:** "Immediately build external keyword classifier" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở tool description contract, rồi chọn "Clarify input identifiers and use / do-not-use instructions".

2. **Bẫy Overlap diagnosis:** "Add eight few-shot examples first" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở overlap diagnosis, rồi chọn "Rewrite the two boundaries before redesign".

3. **Bẫy Specific action granularity:** "Keep all actions hidden inside vague analyze_document" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở specific action granularity, rồi chọn "Split into narrow explicit operations".

4. **Bẫy System prompt interference:** "Assume descriptions overrule system prompt automatically" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở system prompt interference, rồi chọn "Audit and repair conflicting global instructions".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Order query incorrectly routes to customer profile lookup**. Phương án nào phù hợp nhất?

- **A.** Immediately build external keyword classifier; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Add eight few-shot examples first; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Keep all actions hidden inside vague analyze_document; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Clarify input identifiers and use / do-not-use instructions; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Immediately build external keyword classifier" được nêu ở cơ chế Tool description contract. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Overlap diagnosis**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Specific action granularity**, không giải quyết được yêu cầu cốt lõi "Describe purpose, inputs, examples, edge cases, and competing-tool boundaries" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Describe purpose, inputs, examples, edge cases, and competing-tool boundaries. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Order query incorrectly routes to customer profile lookup", ưu tiên phân biệt `Tool description contract` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Add eight few-shot examples first** cho tình huống: Five tools with two nearly identical descriptions. Cần phản biện thế nào?

- **A.** Rewrite the two boundaries before redesign; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Add eight few-shot examples first; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Keep all actions hidden inside vague analyze_document; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Assume descriptions overrule system prompt automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Weak descriptions cause ambiguity when tool count manageable. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Add eight few-shot examples first" được nêu ở cơ chế Overlap diagnosis. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Specific action granularity**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **System prompt interference**, không giải quyết được yêu cầu cốt lõi "Weak descriptions cause ambiguity when tool count manageable" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Five tools with two nearly identical descriptions", ưu tiên phân biệt `Overlap diagnosis` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Generic analyze_document handles summary, extraction and verification** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Immediately build external keyword classifier; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Split into narrow explicit operations; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Keep all actions hidden inside vague analyze_document; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Assume descriptions overrule system prompt automatically; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Tool description contract**, không giải quyết được yêu cầu cốt lõi "Different intents deserve purpose-specific tools" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Different intents deserve purpose-specific tools. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Keep all actions hidden inside vague analyze_document" được nêu ở cơ chế Specific action granularity. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **System prompt interference**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Generic analyze_document handles summary, extraction and verification", ưu tiên phân biệt `Specific action granularity` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **System says always fetch customer before any order step**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Immediately build external keyword classifier; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Add eight few-shot examples first; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Audit and repair conflicting global instructions; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Assume descriptions overrule system prompt automatically; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Tool description contract**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Overlap diagnosis**, không giải quyết được yêu cầu cốt lõi "Global system wording may override tool disambiguation" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Global system wording may override tool disambiguation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Assume descriptions overrule system prompt automatically" được nêu ở cơ chế System prompt interference. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "System says always fetch customer before any order step", ưu tiên phân biệt `System prompt interference` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Immediately build external keyword classifier**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Immediately build external keyword classifier; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Add eight few-shot examples first; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Keep all actions hidden inside vague analyze_document; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Clarify input identifiers and use / do-not-use instructions; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Immediately build external keyword classifier" được nêu ở cơ chế Tool description contract. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Overlap diagnosis**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Specific action granularity**, không giải quyết được yêu cầu cốt lõi "Describe purpose, inputs, examples, edge cases, and competing-tool boundaries" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Describe purpose, inputs, examples, edge cases, and competing-tool boundaries. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Order query incorrectly routes to customer profile lookup", ưu tiên phân biệt `Tool description contract` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Five tools with two nearly identical descriptions**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Rewrite the two boundaries before redesign; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Add eight few-shot examples first; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Keep all actions hidden inside vague analyze_document; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Assume descriptions overrule system prompt automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Weak descriptions cause ambiguity when tool count manageable. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Add eight few-shot examples first" được nêu ở cơ chế Overlap diagnosis. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Specific action granularity**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **System prompt interference**, không giải quyết được yêu cầu cốt lõi "Weak descriptions cause ambiguity when tool count manageable" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Five tools with two nearly identical descriptions", ưu tiên phân biệt `Overlap diagnosis` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Generic analyze_document handles summary, extraction and verification**, nên chọn gì?

- **A.** Immediately build external keyword classifier; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Split into narrow explicit operations; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Keep all actions hidden inside vague analyze_document; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Assume descriptions overrule system prompt automatically; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Tool description contract**, không giải quyết được yêu cầu cốt lõi "Different intents deserve purpose-specific tools" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Different intents deserve purpose-specific tools. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Keep all actions hidden inside vague analyze_document" được nêu ở cơ chế Specific action granularity. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **System prompt interference**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Generic analyze_document handles summary, extraction and verification", ưu tiên phân biệt `Specific action granularity` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Assume descriptions overrule system prompt automatically**. Đánh giá chính xác nhất là gì?

- **A.** Immediately build external keyword classifier; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Add eight few-shot examples first; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Audit and repair conflicting global instructions; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Assume descriptions overrule system prompt automatically; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Tool description contract**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Overlap diagnosis**, không giải quyết được yêu cầu cốt lõi "Global system wording may override tool disambiguation" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Global system wording may override tool disambiguation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Assume descriptions overrule system prompt automatically" được nêu ở cơ chế System prompt interference. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "System says always fetch customer before any order step", ưu tiên phân biệt `System prompt interference` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Order query incorrectly routes to customer profile lookup**, tiêu chí pass phù hợp là gì?

- **A.** Immediately build external keyword classifier; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Add eight few-shot examples first; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Keep all actions hidden inside vague analyze_document; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Clarify input identifiers and use / do-not-use instructions; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Immediately build external keyword classifier" được nêu ở cơ chế Tool description contract. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Overlap diagnosis**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Specific action granularity**, không giải quyết được yêu cầu cốt lõi "Describe purpose, inputs, examples, edge cases, and competing-tool boundaries" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Describe purpose, inputs, examples, edge cases, and competing-tool boundaries. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Order query incorrectly routes to customer profile lookup", ưu tiên phân biệt `Tool description contract` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Five tools with two nearly identical descriptions**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Rewrite the two boundaries before redesign; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Add eight few-shot examples first; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Keep all actions hidden inside vague analyze_document; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Assume descriptions overrule system prompt automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Weak descriptions cause ambiguity when tool count manageable. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Add eight few-shot examples first" được nêu ở cơ chế Overlap diagnosis. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Specific action granularity**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **System prompt interference**, không giải quyết được yêu cầu cốt lõi "Weak descriptions cause ambiguity when tool count manageable" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Five tools with two nearly identical descriptions", ưu tiên phân biệt `Overlap diagnosis` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Order query incorrectly routes to customer profile lookup".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Clarify input identifiers and use / do-not-use instructions.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Tool description contract:** Describe purpose, inputs, examples, edge cases, and competing-tool boundaries. ✓ Clarify input identifiers and use / do-not-use instructions. ✗ Immediately build external keyword classifier.
- **Overlap diagnosis:** Weak descriptions cause ambiguity when tool count manageable. ✓ Rewrite the two boundaries before redesign. ✗ Add eight few-shot examples first.
- **Specific action granularity:** Different intents deserve purpose-specific tools. ✓ Split into narrow explicit operations. ✗ Keep all actions hidden inside vague analyze_document.
- **System prompt interference:** Global system wording may override tool disambiguation. ✓ Audit and repair conflicting global instructions. ✗ Assume descriptions overrule system prompt automatically.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/2-tool-design-mcp/2-1-tool-schema-design
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
