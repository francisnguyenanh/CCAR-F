# 1.1 — Agentic Loops

> Domain 1: Agentic Architecture & Orchestration · Tỷ trọng toàn domain: 27%
> Source lesson: https://claudecertificationguide.com/learn/1-agentic-architecture/1-1-agentic-loops
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Agentic Loops**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. stop_reason is control signal

**Principle (EN):** Check response.stop_reason, not prose or first content block.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **check response.stop_reason, not prose or first content block**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** A service agent replies with explanation plus lookup_order tool_use.

**Recommended implementation:** Continue calling tool and return tool_result to messages.

**Incorrect shortcut / Sai lầm dễ mắc:** Treat any text block as completion.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "A service agent replies with explanation plus lookup_order tool_use".
- Decision: áp dụng nguyên tắc **stop_reason is control signal** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Continue calling tool and return tool_result to messages" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Tool history preservation

**Principle (EN):** Append assistant tool_use plus matching user tool_result; carry conversation forward.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **append assistant tool_use plus matching user tool_result; carry conversation forward**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** A lookup succeeds but agent repeats the lookup on the next turn.

**Recommended implementation:** Preserve tool IDs and result in message history.

**Incorrect shortcut / Sai lầm dễ mắc:** Send only the last user question.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "A lookup succeeds but agent repeats the lookup on the next turn".
- Decision: áp dụng nguyên tắc **Tool history preservation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Preserve tool IDs and result in message history" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Safety iteration caps

**Principle (EN):** Stop on end_turn; caps merely prevent runaway loops.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **stop on end_turn; caps merely prevent runaway loops**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** A research agent legitimately needs 12 searches while limit is 10.

**Recommended implementation:** Use stop_reason to terminate, plus cap as safety bound.

**Incorrect shortcut / Sai lầm dễ mắc:** Declare completion at iteration ten.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "A research agent legitimately needs 12 searches while limit is 10".
- Decision: áp dụng nguyên tắc **Safety iteration caps** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use stop_reason to terminate, plus cap as safety bound" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Nonstandard stop reasons

**Principle (EN):** Handle pause_turn, max_tokens and refusal separately instead of assuming tool_use.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **handle pause_turn, max_tokens and refusal separately instead of assuming tool_use**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Response is truncated by max_tokens.

**Recommended implementation:** Detect truncation and safely continue or report incomplete response.

**Incorrect shortcut / Sai lầm dễ mắc:** Attempt to run an imaginary tool.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Response is truncated by max_tokens".
- Decision: áp dụng nguyên tắc **Nonstandard stop reasons** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Detect truncation and safely continue or report incomplete response" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** A service agent replies with explanation plus lookup_order tool_use.

**Bad design:** Treat any text block as completion.

**Better design:** Continue calling tool and return tool_result to messages.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : A service agent replies with explanation plus lookup_order tool_use.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Continue calling tool and return tool_result to messages.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy stop_reason is control signal:** "Treat any text block as completion" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở stop_reason is control signal, rồi chọn "Continue calling tool and return tool_result to messages".

2. **Bẫy Tool history preservation:** "Send only the last user question" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở tool history preservation, rồi chọn "Preserve tool IDs and result in message history".

3. **Bẫy Safety iteration caps:** "Declare completion at iteration ten" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở safety iteration caps, rồi chọn "Use stop_reason to terminate, plus cap as safety bound".

4. **Bẫy Nonstandard stop reasons:** "Attempt to run an imaginary tool" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở nonstandard stop reasons, rồi chọn "Detect truncation and safely continue or report incomplete response".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **A service agent replies with explanation plus lookup_order tool_use**. Phương án nào phù hợp nhất?

- **A.** Continue calling tool and return tool_result to messages; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Treat any text block as completion; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Send only the last user question; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Declare completion at iteration ten; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Check response.stop_reason, not prose or first content block. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Treat any text block as completion" được nêu ở cơ chế stop_reason is control signal. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Tool history preservation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Safety iteration caps**, không giải quyết được yêu cầu cốt lõi "Check response.stop_reason, not prose or first content block" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "A service agent replies with explanation plus lookup_order tool_use", ưu tiên phân biệt `stop_reason is control signal` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Send only the last user question** cho tình huống: A lookup succeeds but agent repeats the lookup on the next turn. Cần phản biện thế nào?

- **A.** Attempt to run an imaginary tool; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Preserve tool IDs and result in message history; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Send only the last user question; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Declare completion at iteration ten; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Nonstandard stop reasons**, không giải quyết được yêu cầu cốt lõi "Append assistant tool_use plus matching user tool_result; carry conversation forward" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Append assistant tool_use plus matching user tool_result; carry conversation forward. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Send only the last user question" được nêu ở cơ chế Tool history preservation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Safety iteration caps**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "A lookup succeeds but agent repeats the lookup on the next turn", ưu tiên phân biệt `Tool history preservation` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **A research agent legitimately needs 12 searches while limit is 10** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Attempt to run an imaginary tool; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Treat any text block as completion; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Use stop_reason to terminate, plus cap as safety bound; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Declare completion at iteration ten; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Nonstandard stop reasons**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **stop_reason is control signal**, không giải quyết được yêu cầu cốt lõi "Stop on end_turn; caps merely prevent runaway loops" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Stop on end_turn; caps merely prevent runaway loops. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Declare completion at iteration ten" được nêu ở cơ chế Safety iteration caps. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "A research agent legitimately needs 12 searches while limit is 10", ưu tiên phân biệt `Safety iteration caps` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Response is truncated by max_tokens**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Attempt to run an imaginary tool; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Treat any text block as completion; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Send only the last user question; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Detect truncation and safely continue or report incomplete response; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Attempt to run an imaginary tool" được nêu ở cơ chế Nonstandard stop reasons. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **stop_reason is control signal**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Tool history preservation**, không giải quyết được yêu cầu cốt lõi "Handle pause_turn, max_tokens and refusal separately instead of assuming tool_use" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Handle pause_turn, max_tokens and refusal separately instead of assuming tool_use. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Response is truncated by max_tokens", ưu tiên phân biệt `Nonstandard stop reasons` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Treat any text block as completion**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Continue calling tool and return tool_result to messages; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Treat any text block as completion; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Send only the last user question; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Declare completion at iteration ten; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Check response.stop_reason, not prose or first content block. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Treat any text block as completion" được nêu ở cơ chế stop_reason is control signal. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Tool history preservation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Safety iteration caps**, không giải quyết được yêu cầu cốt lõi "Check response.stop_reason, not prose or first content block" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "A service agent replies with explanation plus lookup_order tool_use", ưu tiên phân biệt `stop_reason is control signal` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **A lookup succeeds but agent repeats the lookup on the next turn**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Attempt to run an imaginary tool; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Preserve tool IDs and result in message history; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Send only the last user question; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Declare completion at iteration ten; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Nonstandard stop reasons**, không giải quyết được yêu cầu cốt lõi "Append assistant tool_use plus matching user tool_result; carry conversation forward" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Append assistant tool_use plus matching user tool_result; carry conversation forward. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Send only the last user question" được nêu ở cơ chế Tool history preservation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Safety iteration caps**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "A lookup succeeds but agent repeats the lookup on the next turn", ưu tiên phân biệt `Tool history preservation` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **A research agent legitimately needs 12 searches while limit is 10**, nên chọn gì?

- **A.** Attempt to run an imaginary tool; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Treat any text block as completion; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Use stop_reason to terminate, plus cap as safety bound; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Declare completion at iteration ten; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Nonstandard stop reasons**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **stop_reason is control signal**, không giải quyết được yêu cầu cốt lõi "Stop on end_turn; caps merely prevent runaway loops" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Stop on end_turn; caps merely prevent runaway loops. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Declare completion at iteration ten" được nêu ở cơ chế Safety iteration caps. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "A research agent legitimately needs 12 searches while limit is 10", ưu tiên phân biệt `Safety iteration caps` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Attempt to run an imaginary tool**. Đánh giá chính xác nhất là gì?

- **A.** Attempt to run an imaginary tool; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Treat any text block as completion; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Send only the last user question; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Detect truncation and safely continue or report incomplete response; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Attempt to run an imaginary tool" được nêu ở cơ chế Nonstandard stop reasons. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **stop_reason is control signal**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Tool history preservation**, không giải quyết được yêu cầu cốt lõi "Handle pause_turn, max_tokens and refusal separately instead of assuming tool_use" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Handle pause_turn, max_tokens and refusal separately instead of assuming tool_use. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Response is truncated by max_tokens", ưu tiên phân biệt `Nonstandard stop reasons` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **A service agent replies with explanation plus lookup_order tool_use**, tiêu chí pass phù hợp là gì?

- **A.** Continue calling tool and return tool_result to messages; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Treat any text block as completion; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Send only the last user question; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Declare completion at iteration ten; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Check response.stop_reason, not prose or first content block. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Treat any text block as completion" được nêu ở cơ chế stop_reason is control signal. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Tool history preservation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Safety iteration caps**, không giải quyết được yêu cầu cốt lõi "Check response.stop_reason, not prose or first content block" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "A service agent replies with explanation plus lookup_order tool_use", ưu tiên phân biệt `stop_reason is control signal` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **A lookup succeeds but agent repeats the lookup on the next turn**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Attempt to run an imaginary tool; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Preserve tool IDs and result in message history; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Send only the last user question; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Declare completion at iteration ten; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Nonstandard stop reasons**, không giải quyết được yêu cầu cốt lõi "Append assistant tool_use plus matching user tool_result; carry conversation forward" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Append assistant tool_use plus matching user tool_result; carry conversation forward. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Send only the last user question" được nêu ở cơ chế Tool history preservation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Safety iteration caps**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "A lookup succeeds but agent repeats the lookup on the next turn", ưu tiên phân biệt `Tool history preservation` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "A service agent replies with explanation plus lookup_order tool_use".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Continue calling tool and return tool_result to messages.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **stop_reason is control signal:** Check response.stop_reason, not prose or first content block. ✓ Continue calling tool and return tool_result to messages. ✗ Treat any text block as completion.
- **Tool history preservation:** Append assistant tool_use plus matching user tool_result; carry conversation forward. ✓ Preserve tool IDs and result in message history. ✗ Send only the last user question.
- **Safety iteration caps:** Stop on end_turn; caps merely prevent runaway loops. ✓ Use stop_reason to terminate, plus cap as safety bound. ✗ Declare completion at iteration ten.
- **Nonstandard stop reasons:** Handle pause_turn, max_tokens and refusal separately instead of assuming tool_use. ✓ Detect truncation and safely continue or report incomplete response. ✗ Attempt to run an imaginary tool.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-1-agentic-loops
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
