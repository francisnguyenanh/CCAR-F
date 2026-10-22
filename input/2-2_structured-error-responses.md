# 2.2 — Structured Error Responses

> Domain 2: Tool Design & MCP Integration · Tỷ trọng toàn domain: 18%
> Source lesson: https://claudecertificationguide.com/learn/2-tool-design-mcp/2-2-structured-error-responses
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Structured Error Responses**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Transient versus validation

**Principle (EN):** Temporary service fault retries unchanged later; validation needs corrected input.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **temporary service fault retries unchanged later; validation needs corrected input**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Order API times out versus order id lacks # prefix.

**Recommended implementation:** Retry backoff for timeout; correct ID then retry for validation.

**Incorrect shortcut / Sai lầm dễ mắc:** Blindly repeat same malformed ID.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Order API times out versus order id lacks # prefix".
- Decision: áp dụng nguyên tắc **Transient versus validation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Retry backoff for timeout; correct ID then retry for validation" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Business versus permission

**Principle (EN):** Policy denial or unauthorized identity requires alternative/escalation.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **policy denial or unauthorized identity requires alternative/escalation**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Refund exceeds threshold or role lacks finance access.

**Recommended implementation:** Escalate policy case or obtain authorized principal.

**Incorrect shortcut / Sai lầm dễ mắc:** Retry the exact same request indefinitely.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Refund exceeds threshold or role lacks finance access".
- Decision: áp dụng nguyên tắc **Business versus permission** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Escalate policy case or obtain authorized principal" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. isError and structured metadata

**Principle (EN):** Expose error type, retryability and actionable explanation in tool result.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **expose error type, retryability and actionable explanation in tool result**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Model treats Database unavailable as normal empty records.

**Recommended implementation:** Set isError true and actionable category.

**Incorrect shortcut / Sai lầm dễ mắc:** Return generic Operation failed as success.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Model treats Database unavailable as normal empty records".
- Decision: áp dụng nguyên tắc **isError and structured metadata** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Set isError true and actionable category" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Successful empty versus failed access

**Principle (EN):** Zero matches after executed query differs from failed query.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **zero matches after executed query differs from failed query**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Customer lookup returns [] but DB was reachable.

**Recommended implementation:** Mark success with resultCount=0 and no retry.

**Incorrect shortcut / Sai lầm dễ mắc:** Treat empty list as timeout.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Customer lookup returns [] but DB was reachable".
- Decision: áp dụng nguyên tắc **Successful empty versus failed access** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Mark success with resultCount=0 and no retry" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Order API times out versus order id lacks # prefix.

**Bad design:** Blindly repeat same malformed ID.

**Better design:** Retry backoff for timeout; correct ID then retry for validation.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Order API times out versus order id lacks # prefix.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Retry backoff for timeout; correct ID then retry for validation.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Transient versus validation:** "Blindly repeat same malformed ID" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở transient versus validation, rồi chọn "Retry backoff for timeout; correct ID then retry for validation".

2. **Bẫy Business versus permission:** "Retry the exact same request indefinitely" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở business versus permission, rồi chọn "Escalate policy case or obtain authorized principal".

3. **Bẫy isError and structured metadata:** "Return generic Operation failed as success" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở iserror and structured metadata, rồi chọn "Set isError true and actionable category".

4. **Bẫy Successful empty versus failed access:** "Treat empty list as timeout" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở successful empty versus failed access, rồi chọn "Mark success with resultCount=0 and no retry".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Order API times out versus order id lacks # prefix**. Phương án nào phù hợp nhất?

- **A.** Blindly repeat same malformed ID; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Retry the exact same request indefinitely; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Return generic Operation failed as success; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Retry backoff for timeout; correct ID then retry for validation; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Blindly repeat same malformed ID" được nêu ở cơ chế Transient versus validation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Business versus permission**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **isError and structured metadata**, không giải quyết được yêu cầu cốt lõi "Temporary service fault retries unchanged later; validation needs corrected input" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Temporary service fault retries unchanged later; validation needs corrected input. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Order API times out versus order id lacks # prefix", ưu tiên phân biệt `Transient versus validation` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Retry the exact same request indefinitely** cho tình huống: Refund exceeds threshold or role lacks finance access. Cần phản biện thế nào?

- **A.** Escalate policy case or obtain authorized principal; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Retry the exact same request indefinitely; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Return generic Operation failed as success; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Treat empty list as timeout; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Policy denial or unauthorized identity requires alternative/escalation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Retry the exact same request indefinitely" được nêu ở cơ chế Business versus permission. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **isError and structured metadata**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Successful empty versus failed access**, không giải quyết được yêu cầu cốt lõi "Policy denial or unauthorized identity requires alternative/escalation" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Refund exceeds threshold or role lacks finance access", ưu tiên phân biệt `Business versus permission` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Model treats Database unavailable as normal empty records** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Blindly repeat same malformed ID; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Set isError true and actionable category; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Return generic Operation failed as success; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Treat empty list as timeout; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Transient versus validation**, không giải quyết được yêu cầu cốt lõi "Expose error type, retryability and actionable explanation in tool result" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Expose error type, retryability and actionable explanation in tool result. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Return generic Operation failed as success" được nêu ở cơ chế isError and structured metadata. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Successful empty versus failed access**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Model treats Database unavailable as normal empty records", ưu tiên phân biệt `isError and structured metadata` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Customer lookup returns [] but DB was reachable**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Blindly repeat same malformed ID; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Retry the exact same request indefinitely; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Mark success with resultCount=0 and no retry; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Treat empty list as timeout; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Transient versus validation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Business versus permission**, không giải quyết được yêu cầu cốt lõi "Zero matches after executed query differs from failed query" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Zero matches after executed query differs from failed query. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Treat empty list as timeout" được nêu ở cơ chế Successful empty versus failed access. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Customer lookup returns [] but DB was reachable", ưu tiên phân biệt `Successful empty versus failed access` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Blindly repeat same malformed ID**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Blindly repeat same malformed ID; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Retry the exact same request indefinitely; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Return generic Operation failed as success; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Retry backoff for timeout; correct ID then retry for validation; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Blindly repeat same malformed ID" được nêu ở cơ chế Transient versus validation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Business versus permission**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **isError and structured metadata**, không giải quyết được yêu cầu cốt lõi "Temporary service fault retries unchanged later; validation needs corrected input" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Temporary service fault retries unchanged later; validation needs corrected input. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Order API times out versus order id lacks # prefix", ưu tiên phân biệt `Transient versus validation` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Refund exceeds threshold or role lacks finance access**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Escalate policy case or obtain authorized principal; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Retry the exact same request indefinitely; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Return generic Operation failed as success; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Treat empty list as timeout; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Policy denial or unauthorized identity requires alternative/escalation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Retry the exact same request indefinitely" được nêu ở cơ chế Business versus permission. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **isError and structured metadata**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Successful empty versus failed access**, không giải quyết được yêu cầu cốt lõi "Policy denial or unauthorized identity requires alternative/escalation" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Refund exceeds threshold or role lacks finance access", ưu tiên phân biệt `Business versus permission` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Model treats Database unavailable as normal empty records**, nên chọn gì?

- **A.** Blindly repeat same malformed ID; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Set isError true and actionable category; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Return generic Operation failed as success; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Treat empty list as timeout; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Transient versus validation**, không giải quyết được yêu cầu cốt lõi "Expose error type, retryability and actionable explanation in tool result" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Expose error type, retryability and actionable explanation in tool result. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Return generic Operation failed as success" được nêu ở cơ chế isError and structured metadata. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Successful empty versus failed access**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Model treats Database unavailable as normal empty records", ưu tiên phân biệt `isError and structured metadata` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Treat empty list as timeout**. Đánh giá chính xác nhất là gì?

- **A.** Blindly repeat same malformed ID; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Retry the exact same request indefinitely; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Mark success with resultCount=0 and no retry; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Treat empty list as timeout; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Transient versus validation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Business versus permission**, không giải quyết được yêu cầu cốt lõi "Zero matches after executed query differs from failed query" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Zero matches after executed query differs from failed query. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Treat empty list as timeout" được nêu ở cơ chế Successful empty versus failed access. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Customer lookup returns [] but DB was reachable", ưu tiên phân biệt `Successful empty versus failed access` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Order API times out versus order id lacks # prefix**, tiêu chí pass phù hợp là gì?

- **A.** Blindly repeat same malformed ID; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Retry the exact same request indefinitely; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Return generic Operation failed as success; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Retry backoff for timeout; correct ID then retry for validation; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Blindly repeat same malformed ID" được nêu ở cơ chế Transient versus validation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Business versus permission**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **isError and structured metadata**, không giải quyết được yêu cầu cốt lõi "Temporary service fault retries unchanged later; validation needs corrected input" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Temporary service fault retries unchanged later; validation needs corrected input. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Order API times out versus order id lacks # prefix", ưu tiên phân biệt `Transient versus validation` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Refund exceeds threshold or role lacks finance access**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Escalate policy case or obtain authorized principal; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Retry the exact same request indefinitely; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Return generic Operation failed as success; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Treat empty list as timeout; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Policy denial or unauthorized identity requires alternative/escalation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Retry the exact same request indefinitely" được nêu ở cơ chế Business versus permission. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **isError and structured metadata**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Successful empty versus failed access**, không giải quyết được yêu cầu cốt lõi "Policy denial or unauthorized identity requires alternative/escalation" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Refund exceeds threshold or role lacks finance access", ưu tiên phân biệt `Business versus permission` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Order API times out versus order id lacks # prefix".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Retry backoff for timeout; correct ID then retry for validation.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Transient versus validation:** Temporary service fault retries unchanged later; validation needs corrected input. ✓ Retry backoff for timeout; correct ID then retry for validation. ✗ Blindly repeat same malformed ID.
- **Business versus permission:** Policy denial or unauthorized identity requires alternative/escalation. ✓ Escalate policy case or obtain authorized principal. ✗ Retry the exact same request indefinitely.
- **isError and structured metadata:** Expose error type, retryability and actionable explanation in tool result. ✓ Set isError true and actionable category. ✗ Return generic Operation failed as success.
- **Successful empty versus failed access:** Zero matches after executed query differs from failed query. ✓ Mark success with resultCount=0 and no retry. ✗ Treat empty list as timeout.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/2-tool-design-mcp/2-2-structured-error-responses
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
