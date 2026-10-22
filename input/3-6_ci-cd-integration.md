# 3.6 — CI/CD Integration

> Domain 3: Claude Code Configuration & Workflows · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/3-claude-code-config/3-6-cicd-integration
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **CI/CD Integration**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Noninteractive print -p

**Principle (EN):** claude -p runs without waiting for terminal input.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **claude -p runs without waiting for terminal input**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** CI job hangs waiting for user interaction.

**Recommended implementation:** Run claude -p with prompt.

**Incorrect shortcut / Sai lầm dễ mắc:** Set fabricated CLAUDE_HEADLESS flag.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "CI job hangs waiting for user interaction".
- Decision: áp dụng nguyên tắc **Noninteractive print -p** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Run claude -p with prompt" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Machine-readable result

**Principle (EN):** --output-format json plus --json-schema; structured_output inside envelope.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **--output-format json plus --json-schema; structured_output inside envelope**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** CI needs file, line, severity for review comment.

**Recommended implementation:** Emit validated structured_output and parse envelope.

**Incorrect shortcut / Sai lầm dễ mắc:** Parse arbitrary natural language stdout.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "CI needs file, line, severity for review comment".
- Decision: áp dụng nguyên tắc **Machine-readable result** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Emit validated structured_output and parse envelope" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Independent generation and review

**Principle (EN):** Separate invocation avoids same-context confirmation bias.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **separate invocation avoids same-context confirmation bias**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Claude writes code then self-reviews in same session.

**Recommended implementation:** Create fresh reviewer process with code diff and criteria.

**Incorrect shortcut / Sai lầm dễ mắc:** Ask same session to double-check itself.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Claude writes code then self-reviews in same session".
- Decision: áp dụng nguyên tắc **Independent generation and review** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Create fresh reviewer process with code diff and criteria" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Scope least privilege in automation

**Principle (EN):** CI credential and permissions must match limited review role.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **cI credential and permissions must match limited review role**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Automated PR reviewer requests production deploy credential.

**Recommended implementation:** Use read-only scope and explicit approval for writes.

**Incorrect shortcut / Sai lầm dễ mắc:** Grant all repository and deployment permissions.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Automated PR reviewer requests production deploy credential".
- Decision: áp dụng nguyên tắc **Scope least privilege in automation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use read-only scope and explicit approval for writes" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** CI job hangs waiting for user interaction.

**Bad design:** Set fabricated CLAUDE_HEADLESS flag.

**Better design:** Run claude -p with prompt.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : CI job hangs waiting for user interaction.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Run claude -p with prompt.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Noninteractive print -p:** "Set fabricated CLAUDE_HEADLESS flag" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở noninteractive print -p, rồi chọn "Run claude -p with prompt".

2. **Bẫy Machine-readable result:** "Parse arbitrary natural language stdout" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở machine-readable result, rồi chọn "Emit validated structured_output and parse envelope".

3. **Bẫy Independent generation and review:** "Ask same session to double-check itself" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở independent generation and review, rồi chọn "Create fresh reviewer process with code diff and criteria".

4. **Bẫy Scope least privilege in automation:** "Grant all repository and deployment permissions" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở scope least privilege in automation, rồi chọn "Use read-only scope and explicit approval for writes".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **CI job hangs waiting for user interaction**. Phương án nào phù hợp nhất?

- **A.** Parse arbitrary natural language stdout; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Ask same session to double-check itself; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Run claude -p with prompt; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Set fabricated CLAUDE_HEADLESS flag; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Machine-readable result**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Independent generation and review**, không giải quyết được yêu cầu cốt lõi "claude -p runs without waiting for terminal input" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** claude -p runs without waiting for terminal input. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Set fabricated CLAUDE_HEADLESS flag" được nêu ở cơ chế Noninteractive print -p. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "CI job hangs waiting for user interaction", ưu tiên phân biệt `Noninteractive print -p` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Parse arbitrary natural language stdout** cho tình huống: CI needs file, line, severity for review comment. Cần phản biện thế nào?

- **A.** Parse arbitrary natural language stdout; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Ask same session to double-check itself; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Grant all repository and deployment permissions; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Emit validated structured_output and parse envelope; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Parse arbitrary natural language stdout" được nêu ở cơ chế Machine-readable result. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Independent generation and review**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Scope least privilege in automation**, không giải quyết được yêu cầu cốt lõi "--output-format json plus --json-schema; structured_output inside envelope" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** --output-format json plus --json-schema; structured_output inside envelope. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "CI needs file, line, severity for review comment", ưu tiên phân biệt `Machine-readable result` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Claude writes code then self-reviews in same session** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Create fresh reviewer process with code diff and criteria; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Ask same session to double-check itself; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Grant all repository and deployment permissions; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Set fabricated CLAUDE_HEADLESS flag; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Separate invocation avoids same-context confirmation bias. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Ask same session to double-check itself" được nêu ở cơ chế Independent generation and review. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Scope least privilege in automation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Noninteractive print -p**, không giải quyết được yêu cầu cốt lõi "Separate invocation avoids same-context confirmation bias" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Claude writes code then self-reviews in same session", ưu tiên phân biệt `Independent generation and review` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Automated PR reviewer requests production deploy credential**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Parse arbitrary natural language stdout; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Use read-only scope and explicit approval for writes; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Grant all repository and deployment permissions; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Set fabricated CLAUDE_HEADLESS flag; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Machine-readable result**, không giải quyết được yêu cầu cốt lõi "CI credential and permissions must match limited review role" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** CI credential and permissions must match limited review role. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Grant all repository and deployment permissions" được nêu ở cơ chế Scope least privilege in automation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Noninteractive print -p**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Automated PR reviewer requests production deploy credential", ưu tiên phân biệt `Scope least privilege in automation` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Set fabricated CLAUDE_HEADLESS flag**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Parse arbitrary natural language stdout; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Ask same session to double-check itself; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Run claude -p with prompt; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Set fabricated CLAUDE_HEADLESS flag; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Machine-readable result**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Independent generation and review**, không giải quyết được yêu cầu cốt lõi "claude -p runs without waiting for terminal input" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** claude -p runs without waiting for terminal input. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Set fabricated CLAUDE_HEADLESS flag" được nêu ở cơ chế Noninteractive print -p. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "CI job hangs waiting for user interaction", ưu tiên phân biệt `Noninteractive print -p` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **CI needs file, line, severity for review comment**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Parse arbitrary natural language stdout; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Ask same session to double-check itself; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Grant all repository and deployment permissions; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Emit validated structured_output and parse envelope; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Parse arbitrary natural language stdout" được nêu ở cơ chế Machine-readable result. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Independent generation and review**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Scope least privilege in automation**, không giải quyết được yêu cầu cốt lõi "--output-format json plus --json-schema; structured_output inside envelope" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** --output-format json plus --json-schema; structured_output inside envelope. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "CI needs file, line, severity for review comment", ưu tiên phân biệt `Machine-readable result` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Claude writes code then self-reviews in same session**, nên chọn gì?

- **A.** Create fresh reviewer process with code diff and criteria; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Ask same session to double-check itself; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Grant all repository and deployment permissions; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Set fabricated CLAUDE_HEADLESS flag; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Separate invocation avoids same-context confirmation bias. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Ask same session to double-check itself" được nêu ở cơ chế Independent generation and review. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Scope least privilege in automation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Noninteractive print -p**, không giải quyết được yêu cầu cốt lõi "Separate invocation avoids same-context confirmation bias" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Claude writes code then self-reviews in same session", ưu tiên phân biệt `Independent generation and review` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Grant all repository and deployment permissions**. Đánh giá chính xác nhất là gì?

- **A.** Parse arbitrary natural language stdout; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Use read-only scope and explicit approval for writes; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Grant all repository and deployment permissions; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Set fabricated CLAUDE_HEADLESS flag; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Machine-readable result**, không giải quyết được yêu cầu cốt lõi "CI credential and permissions must match limited review role" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** CI credential and permissions must match limited review role. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Grant all repository and deployment permissions" được nêu ở cơ chế Scope least privilege in automation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Noninteractive print -p**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Automated PR reviewer requests production deploy credential", ưu tiên phân biệt `Scope least privilege in automation` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **CI job hangs waiting for user interaction**, tiêu chí pass phù hợp là gì?

- **A.** Parse arbitrary natural language stdout; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Ask same session to double-check itself; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Run claude -p with prompt; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Set fabricated CLAUDE_HEADLESS flag; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Machine-readable result**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Independent generation and review**, không giải quyết được yêu cầu cốt lõi "claude -p runs without waiting for terminal input" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** claude -p runs without waiting for terminal input. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Set fabricated CLAUDE_HEADLESS flag" được nêu ở cơ chế Noninteractive print -p. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "CI job hangs waiting for user interaction", ưu tiên phân biệt `Noninteractive print -p` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **CI needs file, line, severity for review comment**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Parse arbitrary natural language stdout; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Ask same session to double-check itself; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Grant all repository and deployment permissions; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Emit validated structured_output and parse envelope; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Parse arbitrary natural language stdout" được nêu ở cơ chế Machine-readable result. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Independent generation and review**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Scope least privilege in automation**, không giải quyết được yêu cầu cốt lõi "--output-format json plus --json-schema; structured_output inside envelope" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** --output-format json plus --json-schema; structured_output inside envelope. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "CI needs file, line, severity for review comment", ưu tiên phân biệt `Machine-readable result` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "CI job hangs waiting for user interaction".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Run claude -p with prompt.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Noninteractive print -p:** claude -p runs without waiting for terminal input. ✓ Run claude -p with prompt. ✗ Set fabricated CLAUDE_HEADLESS flag.
- **Machine-readable result:** --output-format json plus --json-schema; structured_output inside envelope. ✓ Emit validated structured_output and parse envelope. ✗ Parse arbitrary natural language stdout.
- **Independent generation and review:** Separate invocation avoids same-context confirmation bias. ✓ Create fresh reviewer process with code diff and criteria. ✗ Ask same session to double-check itself.
- **Scope least privilege in automation:** CI credential and permissions must match limited review role. ✓ Use read-only scope and explicit approval for writes. ✗ Grant all repository and deployment permissions.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/3-claude-code-config/3-6-cicd-integration
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
