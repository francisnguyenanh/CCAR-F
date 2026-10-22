# 4.1 — System Prompts with Explicit Criteria

> Domain 4: Prompt Engineering & Structured Output · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/4-prompt-engineering/4-1-system-prompts
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **System Prompts with Explicit Criteria**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Explicit categorical standards

**Principle (EN):** Define precisely report/skip categories rather than be conservative.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **define precisely report/skip categories rather than be conservative**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Reviewer flags style preferences as critical defects.

**Recommended implementation:** State bugs/security report; style skip; concrete triggers.

**Incorrect shortcut / Sai lầm dễ mắc:** Use only high-confidence issues.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Reviewer flags style preferences as critical defects".
- Decision: áp dụng nguyên tắc **Explicit categorical standards** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "State bugs/security report; style skip; concrete triggers" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. False positive trust

**Principle (EN):** Poor category precision can erode trust across all categories.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **poor category precision can erode trust across all categories**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Documentation mismatch false alarms bury true security alerts.

**Recommended implementation:** Temporarily disable noisy class and refine criteria.

**Incorrect shortcut / Sai lầm dễ mắc:** Keep noisy findings live for completeness.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Documentation mismatch false alarms bury true security alerts".
- Decision: áp dụng nguyên tắc **False positive trust** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Temporarily disable noisy class and refine criteria" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Severity examples

**Principle (EN):** Labeled snippets calibrate categorical judgement better than abstract prose.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **labeled snippets calibrate categorical judgement better than abstract prose**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Critical versus minor severity varies between runs.

**Recommended implementation:** Provide concrete code cases for each severity level.

**Incorrect shortcut / Sai lầm dễ mắc:** Define severe as very important only.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Critical versus minor severity varies between runs".
- Decision: áp dụng nguyên tắc **Severity examples** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Provide concrete code cases for each severity level" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Confidence versus criteria

**Principle (EN):** Uncalibrated self-confidence cannot replace objective finding criteria.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **uncalibrated self-confidence cannot replace objective finding criteria**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Model confidently reports benign variable naming issue as security.

**Recommended implementation:** Define error taxonomy and use confidence only for routing after calibration.

**Incorrect shortcut / Sai lầm dễ mắc:** Threshold 0.9 and trust result.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Model confidently reports benign variable naming issue as security".
- Decision: áp dụng nguyên tắc **Confidence versus criteria** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Define error taxonomy and use confidence only for routing after calibration" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Reviewer flags style preferences as critical defects.

**Bad design:** Use only high-confidence issues.

**Better design:** State bugs/security report; style skip; concrete triggers.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Reviewer flags style preferences as critical defects.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : State bugs/security report; style skip; concrete triggers.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Explicit categorical standards:** "Use only high-confidence issues" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở explicit categorical standards, rồi chọn "State bugs/security report; style skip; concrete triggers".

2. **Bẫy False positive trust:** "Keep noisy findings live for completeness" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở false positive trust, rồi chọn "Temporarily disable noisy class and refine criteria".

3. **Bẫy Severity examples:** "Define severe as very important only" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở severity examples, rồi chọn "Provide concrete code cases for each severity level".

4. **Bẫy Confidence versus criteria:** "Threshold 0.9 and trust result" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở confidence versus criteria, rồi chọn "Define error taxonomy and use confidence only for routing after calibration".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Reviewer flags style preferences as critical defects**. Phương án nào phù hợp nhất?

- **A.** Define severe as very important only; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** State bugs/security report; style skip; concrete triggers; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Use only high-confidence issues; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Keep noisy findings live for completeness; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Severity examples**, không giải quyết được yêu cầu cốt lõi "Define precisely report/skip categories rather than be conservative" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Define precisely report/skip categories rather than be conservative. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Use only high-confidence issues" được nêu ở cơ chế Explicit categorical standards. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **False positive trust**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Reviewer flags style preferences as critical defects", ưu tiên phân biệt `Explicit categorical standards` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Keep noisy findings live for completeness** cho tình huống: Documentation mismatch false alarms bury true security alerts. Cần phản biện thế nào?

- **A.** Define severe as very important only; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Threshold 0.9 and trust result; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Temporarily disable noisy class and refine criteria; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Keep noisy findings live for completeness; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Severity examples**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Confidence versus criteria**, không giải quyết được yêu cầu cốt lõi "Poor category precision can erode trust across all categories" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Poor category precision can erode trust across all categories. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Keep noisy findings live for completeness" được nêu ở cơ chế False positive trust. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Documentation mismatch false alarms bury true security alerts", ưu tiên phân biệt `False positive trust` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Critical versus minor severity varies between runs** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Define severe as very important only; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Threshold 0.9 and trust result; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Use only high-confidence issues; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Provide concrete code cases for each severity level; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Define severe as very important only" được nêu ở cơ chế Severity examples. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Confidence versus criteria**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Explicit categorical standards**, không giải quyết được yêu cầu cốt lõi "Labeled snippets calibrate categorical judgement better than abstract prose" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Labeled snippets calibrate categorical judgement better than abstract prose. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Critical versus minor severity varies between runs", ưu tiên phân biệt `Severity examples` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Model confidently reports benign variable naming issue as security**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Define error taxonomy and use confidence only for routing after calibration; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Threshold 0.9 and trust result; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Use only high-confidence issues; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Keep noisy findings live for completeness; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Uncalibrated self-confidence cannot replace objective finding criteria. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Threshold 0.9 and trust result" được nêu ở cơ chế Confidence versus criteria. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Explicit categorical standards**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **False positive trust**, không giải quyết được yêu cầu cốt lõi "Uncalibrated self-confidence cannot replace objective finding criteria" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Model confidently reports benign variable naming issue as security", ưu tiên phân biệt `Confidence versus criteria` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Use only high-confidence issues**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Define severe as very important only; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** State bugs/security report; style skip; concrete triggers; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Use only high-confidence issues; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Keep noisy findings live for completeness; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Severity examples**, không giải quyết được yêu cầu cốt lõi "Define precisely report/skip categories rather than be conservative" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Define precisely report/skip categories rather than be conservative. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Use only high-confidence issues" được nêu ở cơ chế Explicit categorical standards. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **False positive trust**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Reviewer flags style preferences as critical defects", ưu tiên phân biệt `Explicit categorical standards` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Documentation mismatch false alarms bury true security alerts**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Define severe as very important only; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Threshold 0.9 and trust result; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Temporarily disable noisy class and refine criteria; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Keep noisy findings live for completeness; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Severity examples**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Confidence versus criteria**, không giải quyết được yêu cầu cốt lõi "Poor category precision can erode trust across all categories" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Poor category precision can erode trust across all categories. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Keep noisy findings live for completeness" được nêu ở cơ chế False positive trust. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Documentation mismatch false alarms bury true security alerts", ưu tiên phân biệt `False positive trust` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Critical versus minor severity varies between runs**, nên chọn gì?

- **A.** Define severe as very important only; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Threshold 0.9 and trust result; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Use only high-confidence issues; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Provide concrete code cases for each severity level; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Define severe as very important only" được nêu ở cơ chế Severity examples. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Confidence versus criteria**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Explicit categorical standards**, không giải quyết được yêu cầu cốt lõi "Labeled snippets calibrate categorical judgement better than abstract prose" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Labeled snippets calibrate categorical judgement better than abstract prose. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Critical versus minor severity varies between runs", ưu tiên phân biệt `Severity examples` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Threshold 0.9 and trust result**. Đánh giá chính xác nhất là gì?

- **A.** Define error taxonomy and use confidence only for routing after calibration; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Threshold 0.9 and trust result; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Use only high-confidence issues; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Keep noisy findings live for completeness; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Uncalibrated self-confidence cannot replace objective finding criteria. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Threshold 0.9 and trust result" được nêu ở cơ chế Confidence versus criteria. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Explicit categorical standards**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **False positive trust**, không giải quyết được yêu cầu cốt lõi "Uncalibrated self-confidence cannot replace objective finding criteria" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Model confidently reports benign variable naming issue as security", ưu tiên phân biệt `Confidence versus criteria` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Reviewer flags style preferences as critical defects**, tiêu chí pass phù hợp là gì?

- **A.** Define severe as very important only; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** State bugs/security report; style skip; concrete triggers; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Use only high-confidence issues; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Keep noisy findings live for completeness; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Severity examples**, không giải quyết được yêu cầu cốt lõi "Define precisely report/skip categories rather than be conservative" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Define precisely report/skip categories rather than be conservative. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Use only high-confidence issues" được nêu ở cơ chế Explicit categorical standards. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **False positive trust**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Reviewer flags style preferences as critical defects", ưu tiên phân biệt `Explicit categorical standards` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Documentation mismatch false alarms bury true security alerts**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Define severe as very important only; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Threshold 0.9 and trust result; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Temporarily disable noisy class and refine criteria; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Keep noisy findings live for completeness; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Severity examples**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Confidence versus criteria**, không giải quyết được yêu cầu cốt lõi "Poor category precision can erode trust across all categories" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Poor category precision can erode trust across all categories. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Keep noisy findings live for completeness" được nêu ở cơ chế False positive trust. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Documentation mismatch false alarms bury true security alerts", ưu tiên phân biệt `False positive trust` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Reviewer flags style preferences as critical defects".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: State bugs/security report; style skip; concrete triggers.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Explicit categorical standards:** Define precisely report/skip categories rather than be conservative. ✓ State bugs/security report; style skip; concrete triggers. ✗ Use only high-confidence issues.
- **False positive trust:** Poor category precision can erode trust across all categories. ✓ Temporarily disable noisy class and refine criteria. ✗ Keep noisy findings live for completeness.
- **Severity examples:** Labeled snippets calibrate categorical judgement better than abstract prose. ✓ Provide concrete code cases for each severity level. ✗ Define severe as very important only.
- **Confidence versus criteria:** Uncalibrated self-confidence cannot replace objective finding criteria. ✓ Define error taxonomy and use confidence only for routing after calibration. ✗ Threshold 0.9 and trust result.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-1-system-prompts
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
