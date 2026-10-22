# 1.5 — Agent SDK Hooks

> Domain 1: Agentic Architecture & Orchestration · Tỷ trọng toàn domain: 27%
> Source lesson: https://claudecertificationguide.com/learn/1-agentic-architecture/1-5-agent-sdk-hooks
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Agent SDK Hooks**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. PreToolUse policy gate

**Principle (EN):** Intercept action BEFORE tool executes.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **intercept action BEFORE tool executes**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Refund above company threshold is requested.

**Recommended implementation:** Block before refund API executes and request human approval.

**Incorrect shortcut / Sai lầm dễ mắc:** Try undo after successful refund.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Refund above company threshold is requested".
- Decision: áp dụng nguyên tắc **PreToolUse policy gate** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Block before refund API executes and request human approval" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. PostToolUse normalization

**Principle (EN):** Normalize outputs AFTER execution BEFORE model sees them.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **normalize outputs AFTER execution BEFORE model sees them**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Three tools return different timestamp and status formats.

**Recommended implementation:** Standardize via PostToolUse transformer.

**Incorrect shortcut / Sai lầm dễ mắc:** Ask model to guess date formats each time.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Three tools return different timestamp and status formats".
- Decision: áp dụng nguyên tắc **PostToolUse normalization** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Standardize via PostToolUse transformer" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Prompt versus hook reliability

**Principle (EN):** Business-invariant safety must not depend on probabilistic obedience.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **business-invariant safety must not depend on probabilistic obedience**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Agent may skip AML verification under unusual phrasing.

**Recommended implementation:** Require server check or PreToolUse gate.

**Incorrect shortcut / Sai lầm dễ mắc:** Add stronger English warnings only.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Agent may skip AML verification under unusual phrasing".
- Decision: áp dụng nguyên tắc **Prompt versus hook reliability** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Require server check or PreToolUse gate" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Hook placement

**Principle (EN):** A post-execution hook cannot prevent a completed side effect.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **a post-execution hook cannot prevent a completed side effect**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Team attaches PostToolUse to transfer_funds to block bad transfer.

**Recommended implementation:** Move check to PreToolUse or backend authorization.

**Incorrect shortcut / Sai lầm dễ mắc:** Rely on PostToolUse to cancel historical transaction.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Team attaches PostToolUse to transfer_funds to block bad transfer".
- Decision: áp dụng nguyên tắc **Hook placement** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Move check to PreToolUse or backend authorization" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Refund above company threshold is requested.

**Bad design:** Try undo after successful refund.

**Better design:** Block before refund API executes and request human approval.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Refund above company threshold is requested.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Block before refund API executes and request human approval.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy PreToolUse policy gate:** "Try undo after successful refund" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở pretooluse policy gate, rồi chọn "Block before refund API executes and request human approval".

2. **Bẫy PostToolUse normalization:** "Ask model to guess date formats each time" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở posttooluse normalization, rồi chọn "Standardize via PostToolUse transformer".

3. **Bẫy Prompt versus hook reliability:** "Add stronger English warnings only" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở prompt versus hook reliability, rồi chọn "Require server check or PreToolUse gate".

4. **Bẫy Hook placement:** "Rely on PostToolUse to cancel historical transaction" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở hook placement, rồi chọn "Move check to PreToolUse or backend authorization".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Refund above company threshold is requested**. Phương án nào phù hợp nhất?

- **A.** Block before refund API executes and request human approval; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Try undo after successful refund; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Ask model to guess date formats each time; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Add stronger English warnings only; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Intercept action BEFORE tool executes. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Try undo after successful refund" được nêu ở cơ chế PreToolUse policy gate. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **PostToolUse normalization**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Prompt versus hook reliability**, không giải quyết được yêu cầu cốt lõi "Intercept action BEFORE tool executes" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Refund above company threshold is requested", ưu tiên phân biệt `PreToolUse policy gate` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Ask model to guess date formats each time** cho tình huống: Three tools return different timestamp and status formats. Cần phản biện thế nào?

- **A.** Rely on PostToolUse to cancel historical transaction; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Standardize via PostToolUse transformer; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Ask model to guess date formats each time; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Add stronger English warnings only; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Hook placement**, không giải quyết được yêu cầu cốt lõi "Normalize outputs AFTER execution BEFORE model sees them" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Normalize outputs AFTER execution BEFORE model sees them. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Ask model to guess date formats each time" được nêu ở cơ chế PostToolUse normalization. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Prompt versus hook reliability**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Three tools return different timestamp and status formats", ưu tiên phân biệt `PostToolUse normalization` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Agent may skip AML verification under unusual phrasing** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Rely on PostToolUse to cancel historical transaction; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Try undo after successful refund; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Require server check or PreToolUse gate; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Add stronger English warnings only; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Hook placement**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **PreToolUse policy gate**, không giải quyết được yêu cầu cốt lõi "Business-invariant safety must not depend on probabilistic obedience" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Business-invariant safety must not depend on probabilistic obedience. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Add stronger English warnings only" được nêu ở cơ chế Prompt versus hook reliability. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Agent may skip AML verification under unusual phrasing", ưu tiên phân biệt `Prompt versus hook reliability` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Team attaches PostToolUse to transfer_funds to block bad transfer**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Rely on PostToolUse to cancel historical transaction; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Try undo after successful refund; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Ask model to guess date formats each time; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Move check to PreToolUse or backend authorization; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Rely on PostToolUse to cancel historical transaction" được nêu ở cơ chế Hook placement. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **PreToolUse policy gate**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **PostToolUse normalization**, không giải quyết được yêu cầu cốt lõi "A post-execution hook cannot prevent a completed side effect" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** A post-execution hook cannot prevent a completed side effect. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Team attaches PostToolUse to transfer_funds to block bad transfer", ưu tiên phân biệt `Hook placement` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Try undo after successful refund**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Block before refund API executes and request human approval; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Try undo after successful refund; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Ask model to guess date formats each time; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Add stronger English warnings only; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Intercept action BEFORE tool executes. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Try undo after successful refund" được nêu ở cơ chế PreToolUse policy gate. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **PostToolUse normalization**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Prompt versus hook reliability**, không giải quyết được yêu cầu cốt lõi "Intercept action BEFORE tool executes" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Refund above company threshold is requested", ưu tiên phân biệt `PreToolUse policy gate` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Three tools return different timestamp and status formats**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Rely on PostToolUse to cancel historical transaction; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Standardize via PostToolUse transformer; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Ask model to guess date formats each time; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Add stronger English warnings only; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Hook placement**, không giải quyết được yêu cầu cốt lõi "Normalize outputs AFTER execution BEFORE model sees them" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Normalize outputs AFTER execution BEFORE model sees them. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Ask model to guess date formats each time" được nêu ở cơ chế PostToolUse normalization. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Prompt versus hook reliability**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Three tools return different timestamp and status formats", ưu tiên phân biệt `PostToolUse normalization` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Agent may skip AML verification under unusual phrasing**, nên chọn gì?

- **A.** Rely on PostToolUse to cancel historical transaction; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Try undo after successful refund; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Require server check or PreToolUse gate; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Add stronger English warnings only; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Hook placement**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **PreToolUse policy gate**, không giải quyết được yêu cầu cốt lõi "Business-invariant safety must not depend on probabilistic obedience" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Business-invariant safety must not depend on probabilistic obedience. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Add stronger English warnings only" được nêu ở cơ chế Prompt versus hook reliability. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Agent may skip AML verification under unusual phrasing", ưu tiên phân biệt `Prompt versus hook reliability` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Rely on PostToolUse to cancel historical transaction**. Đánh giá chính xác nhất là gì?

- **A.** Rely on PostToolUse to cancel historical transaction; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Try undo after successful refund; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Ask model to guess date formats each time; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Move check to PreToolUse or backend authorization; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Rely on PostToolUse to cancel historical transaction" được nêu ở cơ chế Hook placement. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **PreToolUse policy gate**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **PostToolUse normalization**, không giải quyết được yêu cầu cốt lõi "A post-execution hook cannot prevent a completed side effect" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** A post-execution hook cannot prevent a completed side effect. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Team attaches PostToolUse to transfer_funds to block bad transfer", ưu tiên phân biệt `Hook placement` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Refund above company threshold is requested**, tiêu chí pass phù hợp là gì?

- **A.** Block before refund API executes and request human approval; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Try undo after successful refund; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Ask model to guess date formats each time; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Add stronger English warnings only; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Intercept action BEFORE tool executes. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Try undo after successful refund" được nêu ở cơ chế PreToolUse policy gate. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **PostToolUse normalization**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Prompt versus hook reliability**, không giải quyết được yêu cầu cốt lõi "Intercept action BEFORE tool executes" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Refund above company threshold is requested", ưu tiên phân biệt `PreToolUse policy gate` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Three tools return different timestamp and status formats**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Rely on PostToolUse to cancel historical transaction; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Standardize via PostToolUse transformer; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Ask model to guess date formats each time; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Add stronger English warnings only; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Hook placement**, không giải quyết được yêu cầu cốt lõi "Normalize outputs AFTER execution BEFORE model sees them" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Normalize outputs AFTER execution BEFORE model sees them. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Ask model to guess date formats each time" được nêu ở cơ chế PostToolUse normalization. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Prompt versus hook reliability**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Three tools return different timestamp and status formats", ưu tiên phân biệt `PostToolUse normalization` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Refund above company threshold is requested".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Block before refund API executes and request human approval.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **PreToolUse policy gate:** Intercept action BEFORE tool executes. ✓ Block before refund API executes and request human approval. ✗ Try undo after successful refund.
- **PostToolUse normalization:** Normalize outputs AFTER execution BEFORE model sees them. ✓ Standardize via PostToolUse transformer. ✗ Ask model to guess date formats each time.
- **Prompt versus hook reliability:** Business-invariant safety must not depend on probabilistic obedience. ✓ Require server check or PreToolUse gate. ✗ Add stronger English warnings only.
- **Hook placement:** A post-execution hook cannot prevent a completed side effect. ✓ Move check to PreToolUse or backend authorization. ✗ Rely on PostToolUse to cancel historical transaction.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-5-agent-sdk-hooks
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
