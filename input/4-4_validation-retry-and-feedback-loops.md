# 4.4 — Validation, Retry, and Feedback Loops

> Domain 4: Prompt Engineering & Structured Output · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/4-prompt-engineering/4-4-validation-retry-loops
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Validation, Retry, and Feedback Loops**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Feedback-aware retry

**Principle (EN):** Retry with source, bad extraction and exact validation error.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **retry with source, bad extraction and exact validation error**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Line-item sum 450 while stated total 500.

**Recommended implementation:** Send all three elements to correction pass.

**Incorrect shortcut / Sai lầm dễ mắc:** Retry same prompt without error feedback.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Line-item sum 450 while stated total 500".
- Decision: áp dụng nguyên tắc **Feedback-aware retry** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Send all three elements to correction pass" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Retry effectiveness boundary

**Principle (EN):** Fix recoverable mis-extractions, not absent facts.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **fix recoverable mis-extractions, not absent facts**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Document genuinely lacks department name.

**Recommended implementation:** Return null/escalate instead of guessing.

**Incorrect shortcut / Sai lầm dễ mắc:** Retry ten times for nonexistent value.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Document genuinely lacks department name".
- Decision: áp dụng nguyên tắc **Retry effectiveness boundary** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Return null/escalate instead of guessing" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Deterministic semantic validator

**Principle (EN):** Schema-valid values still need arithmetic and business checks.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **schema-valid values still need arithmetic and business checks**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Due date earlier than issued date in extracted invoice.

**Recommended implementation:** Add typed validator and explicit failure reasons.

**Incorrect shortcut / Sai lầm dễ mắc:** Treat schema conformance as semantic proof.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Due date earlier than issued date in extracted invoice".
- Decision: áp dụng nguyên tắc **Deterministic semantic validator** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Add typed validator and explicit failure reasons" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Track disagreement patterns

**Principle (EN):** Record detected_pattern and reviewer dismissals for refinement.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **record detected_pattern and reviewer dismissals for refinement**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Many reports of benign shadowing are rejected by developers.

**Recommended implementation:** Group by pattern then improve criteria and examples.

**Incorrect shortcut / Sai lầm dễ mắc:** Hide dismissal history.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Many reports of benign shadowing are rejected by developers".
- Decision: áp dụng nguyên tắc **Track disagreement patterns** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Group by pattern then improve criteria and examples" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Line-item sum 450 while stated total 500.

**Bad design:** Retry same prompt without error feedback.

**Better design:** Send all three elements to correction pass.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Line-item sum 450 while stated total 500.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Send all three elements to correction pass.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Feedback-aware retry:** "Retry same prompt without error feedback" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở feedback-aware retry, rồi chọn "Send all three elements to correction pass".

2. **Bẫy Retry effectiveness boundary:** "Retry ten times for nonexistent value" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở retry effectiveness boundary, rồi chọn "Return null/escalate instead of guessing".

3. **Bẫy Deterministic semantic validator:** "Treat schema conformance as semantic proof" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở deterministic semantic validator, rồi chọn "Add typed validator and explicit failure reasons".

4. **Bẫy Track disagreement patterns:** "Hide dismissal history" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở track disagreement patterns, rồi chọn "Group by pattern then improve criteria and examples".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Line-item sum 450 while stated total 500**. Phương án nào phù hợp nhất?

- **A.** Treat schema conformance as semantic proof; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Send all three elements to correction pass; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Retry same prompt without error feedback; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Retry ten times for nonexistent value; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Deterministic semantic validator**, không giải quyết được yêu cầu cốt lõi "Retry with source, bad extraction and exact validation error" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Retry with source, bad extraction and exact validation error. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Retry same prompt without error feedback" được nêu ở cơ chế Feedback-aware retry. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Retry effectiveness boundary**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Line-item sum 450 while stated total 500", ưu tiên phân biệt `Feedback-aware retry` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Retry ten times for nonexistent value** cho tình huống: Document genuinely lacks department name. Cần phản biện thế nào?

- **A.** Treat schema conformance as semantic proof; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Hide dismissal history; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Return null/escalate instead of guessing; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Retry ten times for nonexistent value; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Deterministic semantic validator**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Track disagreement patterns**, không giải quyết được yêu cầu cốt lõi "Fix recoverable mis-extractions, not absent facts" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Fix recoverable mis-extractions, not absent facts. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Retry ten times for nonexistent value" được nêu ở cơ chế Retry effectiveness boundary. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Document genuinely lacks department name", ưu tiên phân biệt `Retry effectiveness boundary` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Due date earlier than issued date in extracted invoice** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Treat schema conformance as semantic proof; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Hide dismissal history; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Retry same prompt without error feedback; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Add typed validator and explicit failure reasons; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Treat schema conformance as semantic proof" được nêu ở cơ chế Deterministic semantic validator. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Track disagreement patterns**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Feedback-aware retry**, không giải quyết được yêu cầu cốt lõi "Schema-valid values still need arithmetic and business checks" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Schema-valid values still need arithmetic and business checks. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Due date earlier than issued date in extracted invoice", ưu tiên phân biệt `Deterministic semantic validator` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Many reports of benign shadowing are rejected by developers**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Group by pattern then improve criteria and examples; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Hide dismissal history; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Retry same prompt without error feedback; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Retry ten times for nonexistent value; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Record detected_pattern and reviewer dismissals for refinement. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Hide dismissal history" được nêu ở cơ chế Track disagreement patterns. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Feedback-aware retry**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Retry effectiveness boundary**, không giải quyết được yêu cầu cốt lõi "Record detected_pattern and reviewer dismissals for refinement" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Many reports of benign shadowing are rejected by developers", ưu tiên phân biệt `Track disagreement patterns` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Retry same prompt without error feedback**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Treat schema conformance as semantic proof; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Send all three elements to correction pass; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Retry same prompt without error feedback; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Retry ten times for nonexistent value; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Deterministic semantic validator**, không giải quyết được yêu cầu cốt lõi "Retry with source, bad extraction and exact validation error" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Retry with source, bad extraction and exact validation error. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Retry same prompt without error feedback" được nêu ở cơ chế Feedback-aware retry. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Retry effectiveness boundary**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Line-item sum 450 while stated total 500", ưu tiên phân biệt `Feedback-aware retry` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Document genuinely lacks department name**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Treat schema conformance as semantic proof; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Hide dismissal history; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Return null/escalate instead of guessing; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Retry ten times for nonexistent value; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Deterministic semantic validator**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Track disagreement patterns**, không giải quyết được yêu cầu cốt lõi "Fix recoverable mis-extractions, not absent facts" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Fix recoverable mis-extractions, not absent facts. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Retry ten times for nonexistent value" được nêu ở cơ chế Retry effectiveness boundary. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Document genuinely lacks department name", ưu tiên phân biệt `Retry effectiveness boundary` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Due date earlier than issued date in extracted invoice**, nên chọn gì?

- **A.** Treat schema conformance as semantic proof; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Hide dismissal history; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Retry same prompt without error feedback; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Add typed validator and explicit failure reasons; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Treat schema conformance as semantic proof" được nêu ở cơ chế Deterministic semantic validator. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Track disagreement patterns**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Feedback-aware retry**, không giải quyết được yêu cầu cốt lõi "Schema-valid values still need arithmetic and business checks" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Schema-valid values still need arithmetic and business checks. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Due date earlier than issued date in extracted invoice", ưu tiên phân biệt `Deterministic semantic validator` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Hide dismissal history**. Đánh giá chính xác nhất là gì?

- **A.** Group by pattern then improve criteria and examples; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Hide dismissal history; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Retry same prompt without error feedback; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Retry ten times for nonexistent value; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Record detected_pattern and reviewer dismissals for refinement. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Hide dismissal history" được nêu ở cơ chế Track disagreement patterns. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Feedback-aware retry**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Retry effectiveness boundary**, không giải quyết được yêu cầu cốt lõi "Record detected_pattern and reviewer dismissals for refinement" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Many reports of benign shadowing are rejected by developers", ưu tiên phân biệt `Track disagreement patterns` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Line-item sum 450 while stated total 500**, tiêu chí pass phù hợp là gì?

- **A.** Treat schema conformance as semantic proof; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Send all three elements to correction pass; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Retry same prompt without error feedback; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Retry ten times for nonexistent value; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Deterministic semantic validator**, không giải quyết được yêu cầu cốt lõi "Retry with source, bad extraction and exact validation error" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Retry with source, bad extraction and exact validation error. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Retry same prompt without error feedback" được nêu ở cơ chế Feedback-aware retry. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Retry effectiveness boundary**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Line-item sum 450 while stated total 500", ưu tiên phân biệt `Feedback-aware retry` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Document genuinely lacks department name**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Treat schema conformance as semantic proof; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Hide dismissal history; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Return null/escalate instead of guessing; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Retry ten times for nonexistent value; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Deterministic semantic validator**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Track disagreement patterns**, không giải quyết được yêu cầu cốt lõi "Fix recoverable mis-extractions, not absent facts" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Fix recoverable mis-extractions, not absent facts. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Retry ten times for nonexistent value" được nêu ở cơ chế Retry effectiveness boundary. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Document genuinely lacks department name", ưu tiên phân biệt `Retry effectiveness boundary` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Line-item sum 450 while stated total 500".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Send all three elements to correction pass.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Feedback-aware retry:** Retry with source, bad extraction and exact validation error. ✓ Send all three elements to correction pass. ✗ Retry same prompt without error feedback.
- **Retry effectiveness boundary:** Fix recoverable mis-extractions, not absent facts. ✓ Return null/escalate instead of guessing. ✗ Retry ten times for nonexistent value.
- **Deterministic semantic validator:** Schema-valid values still need arithmetic and business checks. ✓ Add typed validator and explicit failure reasons. ✗ Treat schema conformance as semantic proof.
- **Track disagreement patterns:** Record detected_pattern and reviewer dismissals for refinement. ✓ Group by pattern then improve criteria and examples. ✗ Hide dismissal history.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-4-validation-retry-loops
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
