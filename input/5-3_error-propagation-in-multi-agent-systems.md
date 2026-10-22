# 5.3 — Error Propagation in Multi-Agent Systems

> Domain 5: Context Management & Reliability · Tỷ trọng toàn domain: 15%
> Source lesson: https://claudecertificationguide.com/learn/5-context-management/5-3-error-propagation
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Error Propagation in Multi-Agent Systems**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Structured failure context

**Principle (EN):** Report category, attempted action, partial results and alternatives.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **report category, attempted action, partial results and alternatives**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Search subagent timed out after finding 3 of 5 papers.

**Recommended implementation:** Return partial failure with evidence and retry options.

**Incorrect shortcut / Sai lầm dễ mắc:** Return empty results as success.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Search subagent timed out after finding 3 of 5 papers".
- Decision: áp dụng nguyên tắc **Structured failure context** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Return partial failure with evidence and retry options" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Local recovery selective propagation

**Principle (EN):** Coordinator should judge partial data and targeted retry.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **coordinator should judge partial data and targeted retry**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** One of four research workers fails.

**Recommended implementation:** Continue successful branches and target missing coverage.

**Incorrect shortcut / Sai lầm dễ mắc:** Crash entire pipeline and discard work.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "One of four research workers fails".
- Decision: áp dụng nguyên tắc **Local recovery selective propagation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Continue successful branches and target missing coverage" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Empty is not access failure

**Principle (EN):** Executed query with zero matches differs from inaccessible source.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **executed query with zero matches differs from inaccessible source**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Academic API rate-limits rather than returns no articles.

**Recommended implementation:** Represent failure explicitly and retry as appropriate.

**Incorrect shortcut / Sai lầm dễ mắc:** Mark [] as successful query.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Academic API rate-limits rather than returns no articles".
- Decision: áp dụng nguyên tắc **Empty is not access failure** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Represent failure explicitly and retry as appropriate" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Coverage annotation

**Principle (EN):** Synthesized output must disclose missing evidence.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **synthesized output must disclose missing evidence**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Geothermal sources inaccessible but solar sources valid.

**Recommended implementation:** Mark geothermal coverage incomplete with reason.

**Incorrect shortcut / Sai lầm dễ mắc:** Present all categories as fully verified.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Geothermal sources inaccessible but solar sources valid".
- Decision: áp dụng nguyên tắc **Coverage annotation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Mark geothermal coverage incomplete with reason" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Search subagent timed out after finding 3 of 5 papers.

**Bad design:** Return empty results as success.

**Better design:** Return partial failure with evidence and retry options.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Search subagent timed out after finding 3 of 5 papers.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Return partial failure with evidence and retry options.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Structured failure context:** "Return empty results as success" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở structured failure context, rồi chọn "Return partial failure with evidence and retry options".

2. **Bẫy Local recovery selective propagation:** "Crash entire pipeline and discard work" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở local recovery selective propagation, rồi chọn "Continue successful branches and target missing coverage".

3. **Bẫy Empty is not access failure:** "Mark [] as successful query" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở empty is not access failure, rồi chọn "Represent failure explicitly and retry as appropriate".

4. **Bẫy Coverage annotation:** "Present all categories as fully verified" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở coverage annotation, rồi chọn "Mark geothermal coverage incomplete with reason".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Search subagent timed out after finding 3 of 5 papers**. Phương án nào phù hợp nhất?

- **A.** Return partial failure with evidence and retry options; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Return empty results as success; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Crash entire pipeline and discard work; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Mark [] as successful query; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Report category, attempted action, partial results and alternatives. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Return empty results as success" được nêu ở cơ chế Structured failure context. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Local recovery selective propagation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Empty is not access failure**, không giải quyết được yêu cầu cốt lõi "Report category, attempted action, partial results and alternatives" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Search subagent timed out after finding 3 of 5 papers", ưu tiên phân biệt `Structured failure context` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Crash entire pipeline and discard work** cho tình huống: One of four research workers fails. Cần phản biện thế nào?

- **A.** Present all categories as fully verified; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Continue successful branches and target missing coverage; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Crash entire pipeline and discard work; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Mark [] as successful query; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Coverage annotation**, không giải quyết được yêu cầu cốt lõi "Coordinator should judge partial data and targeted retry" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Coordinator should judge partial data and targeted retry. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Crash entire pipeline and discard work" được nêu ở cơ chế Local recovery selective propagation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Empty is not access failure**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "One of four research workers fails", ưu tiên phân biệt `Local recovery selective propagation` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Academic API rate-limits rather than returns no articles** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Present all categories as fully verified; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Return empty results as success; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Represent failure explicitly and retry as appropriate; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Mark [] as successful query; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Coverage annotation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Structured failure context**, không giải quyết được yêu cầu cốt lõi "Executed query with zero matches differs from inaccessible source" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Executed query with zero matches differs from inaccessible source. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Mark [] as successful query" được nêu ở cơ chế Empty is not access failure. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Academic API rate-limits rather than returns no articles", ưu tiên phân biệt `Empty is not access failure` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Geothermal sources inaccessible but solar sources valid**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Present all categories as fully verified; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Return empty results as success; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Crash entire pipeline and discard work; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Mark geothermal coverage incomplete with reason; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Present all categories as fully verified" được nêu ở cơ chế Coverage annotation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Structured failure context**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Local recovery selective propagation**, không giải quyết được yêu cầu cốt lõi "Synthesized output must disclose missing evidence" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Synthesized output must disclose missing evidence. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Geothermal sources inaccessible but solar sources valid", ưu tiên phân biệt `Coverage annotation` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Return empty results as success**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Return partial failure with evidence and retry options; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Return empty results as success; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Crash entire pipeline and discard work; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Mark [] as successful query; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Report category, attempted action, partial results and alternatives. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Return empty results as success" được nêu ở cơ chế Structured failure context. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Local recovery selective propagation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Empty is not access failure**, không giải quyết được yêu cầu cốt lõi "Report category, attempted action, partial results and alternatives" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Search subagent timed out after finding 3 of 5 papers", ưu tiên phân biệt `Structured failure context` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **One of four research workers fails**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Present all categories as fully verified; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Continue successful branches and target missing coverage; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Crash entire pipeline and discard work; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Mark [] as successful query; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Coverage annotation**, không giải quyết được yêu cầu cốt lõi "Coordinator should judge partial data and targeted retry" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Coordinator should judge partial data and targeted retry. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Crash entire pipeline and discard work" được nêu ở cơ chế Local recovery selective propagation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Empty is not access failure**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "One of four research workers fails", ưu tiên phân biệt `Local recovery selective propagation` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Academic API rate-limits rather than returns no articles**, nên chọn gì?

- **A.** Present all categories as fully verified; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Return empty results as success; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Represent failure explicitly and retry as appropriate; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Mark [] as successful query; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Coverage annotation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Structured failure context**, không giải quyết được yêu cầu cốt lõi "Executed query with zero matches differs from inaccessible source" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Executed query with zero matches differs from inaccessible source. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Mark [] as successful query" được nêu ở cơ chế Empty is not access failure. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Academic API rate-limits rather than returns no articles", ưu tiên phân biệt `Empty is not access failure` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Present all categories as fully verified**. Đánh giá chính xác nhất là gì?

- **A.** Present all categories as fully verified; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Return empty results as success; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Crash entire pipeline and discard work; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Mark geothermal coverage incomplete with reason; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Present all categories as fully verified" được nêu ở cơ chế Coverage annotation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Structured failure context**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Local recovery selective propagation**, không giải quyết được yêu cầu cốt lõi "Synthesized output must disclose missing evidence" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Synthesized output must disclose missing evidence. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Geothermal sources inaccessible but solar sources valid", ưu tiên phân biệt `Coverage annotation` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Search subagent timed out after finding 3 of 5 papers**, tiêu chí pass phù hợp là gì?

- **A.** Return partial failure with evidence and retry options; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Return empty results as success; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Crash entire pipeline and discard work; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Mark [] as successful query; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Report category, attempted action, partial results and alternatives. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Return empty results as success" được nêu ở cơ chế Structured failure context. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Local recovery selective propagation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Empty is not access failure**, không giải quyết được yêu cầu cốt lõi "Report category, attempted action, partial results and alternatives" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Search subagent timed out after finding 3 of 5 papers", ưu tiên phân biệt `Structured failure context` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **One of four research workers fails**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Present all categories as fully verified; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Continue successful branches and target missing coverage; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Crash entire pipeline and discard work; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Mark [] as successful query; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Coverage annotation**, không giải quyết được yêu cầu cốt lõi "Coordinator should judge partial data and targeted retry" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Coordinator should judge partial data and targeted retry. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Crash entire pipeline and discard work" được nêu ở cơ chế Local recovery selective propagation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Empty is not access failure**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "One of four research workers fails", ưu tiên phân biệt `Local recovery selective propagation` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Search subagent timed out after finding 3 of 5 papers".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Return partial failure with evidence and retry options.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Structured failure context:** Report category, attempted action, partial results and alternatives. ✓ Return partial failure with evidence and retry options. ✗ Return empty results as success.
- **Local recovery selective propagation:** Coordinator should judge partial data and targeted retry. ✓ Continue successful branches and target missing coverage. ✗ Crash entire pipeline and discard work.
- **Empty is not access failure:** Executed query with zero matches differs from inaccessible source. ✓ Represent failure explicitly and retry as appropriate. ✗ Mark [] as successful query.
- **Coverage annotation:** Synthesized output must disclose missing evidence. ✓ Mark geothermal coverage incomplete with reason. ✗ Present all categories as fully verified.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/5-context-management/5-3-error-propagation
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
