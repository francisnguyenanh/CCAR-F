# 4.2 — Few-Shot Prompting

> Domain 4: Prompt Engineering & Structured Output · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/4-prompt-engineering/4-2-few-shot-prompting
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Few-Shot Prompting**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Few-shot for consistency

**Principle (EN):** Use 2–4 targeted input-output examples with decision rationale.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **use 2–4 targeted input-output examples with decision rationale**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Detailed instructions still produce inconsistent report formats.

**Recommended implementation:** Demonstrate target formats and reasoning.

**Incorrect shortcut / Sai lầm dễ mắc:** Add several paragraphs of abstract instruction.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Detailed instructions still produce inconsistent report formats".
- Decision: áp dụng nguyên tắc **Few-shot for consistency** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Demonstrate target formats and reasoning" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Ambiguous classification examples

**Principle (EN):** Teach distinctions at decision boundaries rather than easy cases.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **teach distinctions at decision boundaries rather than easy cases**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Variable shadowing judged critical or minor inconsistently.

**Recommended implementation:** Provide borderline examples with explanation.

**Incorrect shortcut / Sai lầm dễ mắc:** Give only trivial happy-path examples.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Variable shadowing judged critical or minor inconsistently".
- Decision: áp dụng nguyên tắc **Ambiguous classification examples** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Provide borderline examples with explanation" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Narrative extraction coverage

**Principle (EN):** Show extraction from structured tables and prose.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **show extraction from structured tables and prose**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Invoice has due date only in paragraph.

**Recommended implementation:** Add few-shot narrative extraction exemplar.

**Incorrect shortcut / Sai lầm dễ mắc:** Set due_date to null despite explicit evidence.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Invoice has due date only in paragraph".
- Decision: áp dụng nguyên tắc **Narrative extraction coverage** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Add few-shot narrative extraction exemplar" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Choose different mechanism for different failure

**Principle (EN):** Few-shot not substitute for schema or arithmetic validation.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **few-shot not substitute for schema or arithmetic validation**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Parser produces malformed JSON and incorrect totals.

**Recommended implementation:** Use schema for structure and code validator for totals.

**Incorrect shortcut / Sai lầm dễ mắc:** Keep adding examples to fix every issue.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Parser produces malformed JSON and incorrect totals".
- Decision: áp dụng nguyên tắc **Choose different mechanism for different failure** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use schema for structure and code validator for totals" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Detailed instructions still produce inconsistent report formats.

**Bad design:** Add several paragraphs of abstract instruction.

**Better design:** Demonstrate target formats and reasoning.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Detailed instructions still produce inconsistent report formats.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Demonstrate target formats and reasoning.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Few-shot for consistency:** "Add several paragraphs of abstract instruction" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở few-shot for consistency, rồi chọn "Demonstrate target formats and reasoning".

2. **Bẫy Ambiguous classification examples:** "Give only trivial happy-path examples" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở ambiguous classification examples, rồi chọn "Provide borderline examples with explanation".

3. **Bẫy Narrative extraction coverage:** "Set due_date to null despite explicit evidence" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở narrative extraction coverage, rồi chọn "Add few-shot narrative extraction exemplar".

4. **Bẫy Choose different mechanism for different failure:** "Keep adding examples to fix every issue" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở choose different mechanism for different failure, rồi chọn "Use schema for structure and code validator for totals".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Detailed instructions still produce inconsistent report formats**. Phương án nào phù hợp nhất?

- **A.** Set due_date to null despite explicit evidence; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Demonstrate target formats and reasoning; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Add several paragraphs of abstract instruction; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Give only trivial happy-path examples; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Narrative extraction coverage**, không giải quyết được yêu cầu cốt lõi "Use 2–4 targeted input-output examples with decision rationale" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Use 2–4 targeted input-output examples with decision rationale. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Add several paragraphs of abstract instruction" được nêu ở cơ chế Few-shot for consistency. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Ambiguous classification examples**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Detailed instructions still produce inconsistent report formats", ưu tiên phân biệt `Few-shot for consistency` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Give only trivial happy-path examples** cho tình huống: Variable shadowing judged critical or minor inconsistently. Cần phản biện thế nào?

- **A.** Set due_date to null despite explicit evidence; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Keep adding examples to fix every issue; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Provide borderline examples with explanation; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Give only trivial happy-path examples; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Narrative extraction coverage**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Choose different mechanism for different failure**, không giải quyết được yêu cầu cốt lõi "Teach distinctions at decision boundaries rather than easy cases" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Teach distinctions at decision boundaries rather than easy cases. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Give only trivial happy-path examples" được nêu ở cơ chế Ambiguous classification examples. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Variable shadowing judged critical or minor inconsistently", ưu tiên phân biệt `Ambiguous classification examples` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Invoice has due date only in paragraph** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Set due_date to null despite explicit evidence; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Keep adding examples to fix every issue; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Add several paragraphs of abstract instruction; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Add few-shot narrative extraction exemplar; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Set due_date to null despite explicit evidence" được nêu ở cơ chế Narrative extraction coverage. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Choose different mechanism for different failure**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Few-shot for consistency**, không giải quyết được yêu cầu cốt lõi "Show extraction from structured tables and prose" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Show extraction from structured tables and prose. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Invoice has due date only in paragraph", ưu tiên phân biệt `Narrative extraction coverage` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Parser produces malformed JSON and incorrect totals**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Use schema for structure and code validator for totals; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Keep adding examples to fix every issue; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Add several paragraphs of abstract instruction; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Give only trivial happy-path examples; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Few-shot not substitute for schema or arithmetic validation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Keep adding examples to fix every issue" được nêu ở cơ chế Choose different mechanism for different failure. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Few-shot for consistency**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Ambiguous classification examples**, không giải quyết được yêu cầu cốt lõi "Few-shot not substitute for schema or arithmetic validation" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Parser produces malformed JSON and incorrect totals", ưu tiên phân biệt `Choose different mechanism for different failure` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Add several paragraphs of abstract instruction**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Set due_date to null despite explicit evidence; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Demonstrate target formats and reasoning; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Add several paragraphs of abstract instruction; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Give only trivial happy-path examples; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Narrative extraction coverage**, không giải quyết được yêu cầu cốt lõi "Use 2–4 targeted input-output examples with decision rationale" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Use 2–4 targeted input-output examples with decision rationale. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Add several paragraphs of abstract instruction" được nêu ở cơ chế Few-shot for consistency. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Ambiguous classification examples**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Detailed instructions still produce inconsistent report formats", ưu tiên phân biệt `Few-shot for consistency` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Variable shadowing judged critical or minor inconsistently**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Set due_date to null despite explicit evidence; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Keep adding examples to fix every issue; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Provide borderline examples with explanation; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Give only trivial happy-path examples; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Narrative extraction coverage**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Choose different mechanism for different failure**, không giải quyết được yêu cầu cốt lõi "Teach distinctions at decision boundaries rather than easy cases" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Teach distinctions at decision boundaries rather than easy cases. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Give only trivial happy-path examples" được nêu ở cơ chế Ambiguous classification examples. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Variable shadowing judged critical or minor inconsistently", ưu tiên phân biệt `Ambiguous classification examples` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Invoice has due date only in paragraph**, nên chọn gì?

- **A.** Set due_date to null despite explicit evidence; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Keep adding examples to fix every issue; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Add several paragraphs of abstract instruction; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Add few-shot narrative extraction exemplar; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Set due_date to null despite explicit evidence" được nêu ở cơ chế Narrative extraction coverage. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Choose different mechanism for different failure**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Few-shot for consistency**, không giải quyết được yêu cầu cốt lõi "Show extraction from structured tables and prose" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Show extraction from structured tables and prose. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Invoice has due date only in paragraph", ưu tiên phân biệt `Narrative extraction coverage` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Keep adding examples to fix every issue**. Đánh giá chính xác nhất là gì?

- **A.** Use schema for structure and code validator for totals; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Keep adding examples to fix every issue; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Add several paragraphs of abstract instruction; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Give only trivial happy-path examples; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Few-shot not substitute for schema or arithmetic validation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Keep adding examples to fix every issue" được nêu ở cơ chế Choose different mechanism for different failure. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Few-shot for consistency**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Ambiguous classification examples**, không giải quyết được yêu cầu cốt lõi "Few-shot not substitute for schema or arithmetic validation" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Parser produces malformed JSON and incorrect totals", ưu tiên phân biệt `Choose different mechanism for different failure` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Detailed instructions still produce inconsistent report formats**, tiêu chí pass phù hợp là gì?

- **A.** Set due_date to null despite explicit evidence; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Demonstrate target formats and reasoning; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Add several paragraphs of abstract instruction; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Give only trivial happy-path examples; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Narrative extraction coverage**, không giải quyết được yêu cầu cốt lõi "Use 2–4 targeted input-output examples with decision rationale" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Use 2–4 targeted input-output examples with decision rationale. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Add several paragraphs of abstract instruction" được nêu ở cơ chế Few-shot for consistency. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Ambiguous classification examples**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Detailed instructions still produce inconsistent report formats", ưu tiên phân biệt `Few-shot for consistency` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Variable shadowing judged critical or minor inconsistently**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Set due_date to null despite explicit evidence; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Keep adding examples to fix every issue; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Provide borderline examples with explanation; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Give only trivial happy-path examples; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Narrative extraction coverage**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Choose different mechanism for different failure**, không giải quyết được yêu cầu cốt lõi "Teach distinctions at decision boundaries rather than easy cases" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Teach distinctions at decision boundaries rather than easy cases. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Give only trivial happy-path examples" được nêu ở cơ chế Ambiguous classification examples. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Variable shadowing judged critical or minor inconsistently", ưu tiên phân biệt `Ambiguous classification examples` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Detailed instructions still produce inconsistent report formats".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Demonstrate target formats and reasoning.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Few-shot for consistency:** Use 2–4 targeted input-output examples with decision rationale. ✓ Demonstrate target formats and reasoning. ✗ Add several paragraphs of abstract instruction.
- **Ambiguous classification examples:** Teach distinctions at decision boundaries rather than easy cases. ✓ Provide borderline examples with explanation. ✗ Give only trivial happy-path examples.
- **Narrative extraction coverage:** Show extraction from structured tables and prose. ✓ Add few-shot narrative extraction exemplar. ✗ Set due_date to null despite explicit evidence.
- **Choose different mechanism for different failure:** Few-shot not substitute for schema or arithmetic validation. ✓ Use schema for structure and code validator for totals. ✗ Keep adding examples to fix every issue.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-2-few-shot-prompting
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
