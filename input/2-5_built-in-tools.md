# 2.5 — Built-in Tools

> Domain 2: Tool Design & MCP Integration · Tỷ trọng toàn domain: 18%
> Source lesson: https://claudecertificationguide.com/learn/2-tool-design-mcp/2-5-built-in-tools
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Built-in Tools**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Grep versus Glob

**Principle (EN):** Grep searches contents, Glob matches file paths.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **grep searches contents, Glob matches file paths**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Find callers of deprecated function and files named *.test.ts.

**Recommended implementation:** Use Grep for caller references, Glob for test filename patterns.

**Incorrect shortcut / Sai lầm dễ mắc:** Use Glob to search function bodies.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Find callers of deprecated function and files named *.test.ts".
- Decision: áp dụng nguyên tắc **Grep versus Glob** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use Grep for caller references, Glob for test filename patterns" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Precise Edit

**Principle (EN):** Edit modifies unique anchored spans; widen anchor on ambiguity.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **edit modifies unique anchored spans; widen anchor on ambiguity**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Edit reports old_string appears twice.

**Recommended implementation:** Add unique surrounding lines or deliberate replace_all.

**Incorrect shortcut / Sai lầm dễ mắc:** Rewrite complete file immediately.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Edit reports old_string appears twice".
- Decision: áp dụng nguyên tắc **Precise Edit** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Add unique surrounding lines or deliberate replace_all" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Incremental discovery

**Principle (EN):** Search first and read justified files to protect context.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **search first and read justified files to protect context**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Repository has 200 files but bug only in checkout path.

**Recommended implementation:** Grep entry point, read relevant imports, expand iteratively.

**Incorrect shortcut / Sai lầm dễ mắc:** Read all 200 files before searching.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Repository has 200 files but bug only in checkout path".
- Decision: áp dụng nguyên tắc **Incremental discovery** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Grep entry point, read relevant imports, expand iteratively" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Indirect function usage

**Principle (EN):** Re-exports and wrapper modules require multi-hop tracing.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **re-exports and wrapper modules require multi-hop tracing**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Renamed helper is exported through index.ts.

**Recommended implementation:** Trace original plus re-export aliases and consumers.

**Incorrect shortcut / Sai lầm dễ mắc:** Single grep of original symbol suffices.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Renamed helper is exported through index.ts".
- Decision: áp dụng nguyên tắc **Indirect function usage** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Trace original plus re-export aliases and consumers" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Find callers of deprecated function and files named *.test.ts.

**Bad design:** Use Glob to search function bodies.

**Better design:** Use Grep for caller references, Glob for test filename patterns.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Find callers of deprecated function and files named *.test.ts.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Use Grep for caller references, Glob for test filename patterns.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Grep versus Glob:** "Use Glob to search function bodies" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở grep versus glob, rồi chọn "Use Grep for caller references, Glob for test filename patterns".

2. **Bẫy Precise Edit:** "Rewrite complete file immediately" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở precise edit, rồi chọn "Add unique surrounding lines or deliberate replace_all".

3. **Bẫy Incremental discovery:** "Read all 200 files before searching" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở incremental discovery, rồi chọn "Grep entry point, read relevant imports, expand iteratively".

4. **Bẫy Indirect function usage:** "Single grep of original symbol suffices" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở indirect function usage, rồi chọn "Trace original plus re-export aliases and consumers".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Find callers of deprecated function and files named *.test.ts**. Phương án nào phù hợp nhất?

- **A.** Use Glob to search function bodies; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Rewrite complete file immediately; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Read all 200 files before searching; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use Grep for caller references, Glob for test filename patterns; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Use Glob to search function bodies" được nêu ở cơ chế Grep versus Glob. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Precise Edit**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Incremental discovery**, không giải quyết được yêu cầu cốt lõi "Grep searches contents, Glob matches file paths" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Grep searches contents, Glob matches file paths. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Find callers of deprecated function and files named *.test.ts", ưu tiên phân biệt `Grep versus Glob` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Rewrite complete file immediately** cho tình huống: Edit reports old_string appears twice. Cần phản biện thế nào?

- **A.** Add unique surrounding lines or deliberate replace_all; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Rewrite complete file immediately; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Read all 200 files before searching; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Single grep of original symbol suffices; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Edit modifies unique anchored spans; widen anchor on ambiguity. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Rewrite complete file immediately" được nêu ở cơ chế Precise Edit. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Incremental discovery**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Indirect function usage**, không giải quyết được yêu cầu cốt lõi "Edit modifies unique anchored spans; widen anchor on ambiguity" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Edit reports old_string appears twice", ưu tiên phân biệt `Precise Edit` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Repository has 200 files but bug only in checkout path** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Use Glob to search function bodies; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Grep entry point, read relevant imports, expand iteratively; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Read all 200 files before searching; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Single grep of original symbol suffices; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Grep versus Glob**, không giải quyết được yêu cầu cốt lõi "Search first and read justified files to protect context" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Search first and read justified files to protect context. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Read all 200 files before searching" được nêu ở cơ chế Incremental discovery. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Indirect function usage**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Repository has 200 files but bug only in checkout path", ưu tiên phân biệt `Incremental discovery` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Renamed helper is exported through index.ts**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Use Glob to search function bodies; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Rewrite complete file immediately; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Trace original plus re-export aliases and consumers; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Single grep of original symbol suffices; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Grep versus Glob**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Precise Edit**, không giải quyết được yêu cầu cốt lõi "Re-exports and wrapper modules require multi-hop tracing" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Re-exports and wrapper modules require multi-hop tracing. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Single grep of original symbol suffices" được nêu ở cơ chế Indirect function usage. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Renamed helper is exported through index.ts", ưu tiên phân biệt `Indirect function usage` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Use Glob to search function bodies**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Use Glob to search function bodies; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Rewrite complete file immediately; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Read all 200 files before searching; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use Grep for caller references, Glob for test filename patterns; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Use Glob to search function bodies" được nêu ở cơ chế Grep versus Glob. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Precise Edit**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Incremental discovery**, không giải quyết được yêu cầu cốt lõi "Grep searches contents, Glob matches file paths" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Grep searches contents, Glob matches file paths. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Find callers of deprecated function and files named *.test.ts", ưu tiên phân biệt `Grep versus Glob` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Edit reports old_string appears twice**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Add unique surrounding lines or deliberate replace_all; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Rewrite complete file immediately; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Read all 200 files before searching; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Single grep of original symbol suffices; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Edit modifies unique anchored spans; widen anchor on ambiguity. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Rewrite complete file immediately" được nêu ở cơ chế Precise Edit. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Incremental discovery**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Indirect function usage**, không giải quyết được yêu cầu cốt lõi "Edit modifies unique anchored spans; widen anchor on ambiguity" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Edit reports old_string appears twice", ưu tiên phân biệt `Precise Edit` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Repository has 200 files but bug only in checkout path**, nên chọn gì?

- **A.** Use Glob to search function bodies; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Grep entry point, read relevant imports, expand iteratively; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Read all 200 files before searching; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Single grep of original symbol suffices; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Grep versus Glob**, không giải quyết được yêu cầu cốt lõi "Search first and read justified files to protect context" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Search first and read justified files to protect context. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Read all 200 files before searching" được nêu ở cơ chế Incremental discovery. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Indirect function usage**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Repository has 200 files but bug only in checkout path", ưu tiên phân biệt `Incremental discovery` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Single grep of original symbol suffices**. Đánh giá chính xác nhất là gì?

- **A.** Use Glob to search function bodies; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Rewrite complete file immediately; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Trace original plus re-export aliases and consumers; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Single grep of original symbol suffices; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Grep versus Glob**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Precise Edit**, không giải quyết được yêu cầu cốt lõi "Re-exports and wrapper modules require multi-hop tracing" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Re-exports and wrapper modules require multi-hop tracing. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Single grep of original symbol suffices" được nêu ở cơ chế Indirect function usage. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Renamed helper is exported through index.ts", ưu tiên phân biệt `Indirect function usage` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Find callers of deprecated function and files named *.test.ts**, tiêu chí pass phù hợp là gì?

- **A.** Use Glob to search function bodies; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Rewrite complete file immediately; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Read all 200 files before searching; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use Grep for caller references, Glob for test filename patterns; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Use Glob to search function bodies" được nêu ở cơ chế Grep versus Glob. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Precise Edit**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Incremental discovery**, không giải quyết được yêu cầu cốt lõi "Grep searches contents, Glob matches file paths" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Grep searches contents, Glob matches file paths. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Find callers of deprecated function and files named *.test.ts", ưu tiên phân biệt `Grep versus Glob` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Edit reports old_string appears twice**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Add unique surrounding lines or deliberate replace_all; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Rewrite complete file immediately; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Read all 200 files before searching; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Single grep of original symbol suffices; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Edit modifies unique anchored spans; widen anchor on ambiguity. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Rewrite complete file immediately" được nêu ở cơ chế Precise Edit. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Incremental discovery**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Indirect function usage**, không giải quyết được yêu cầu cốt lõi "Edit modifies unique anchored spans; widen anchor on ambiguity" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Edit reports old_string appears twice", ưu tiên phân biệt `Precise Edit` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Find callers of deprecated function and files named *.test.ts".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Use Grep for caller references, Glob for test filename patterns.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Grep versus Glob:** Grep searches contents, Glob matches file paths. ✓ Use Grep for caller references, Glob for test filename patterns. ✗ Use Glob to search function bodies.
- **Precise Edit:** Edit modifies unique anchored spans; widen anchor on ambiguity. ✓ Add unique surrounding lines or deliberate replace_all. ✗ Rewrite complete file immediately.
- **Incremental discovery:** Search first and read justified files to protect context. ✓ Grep entry point, read relevant imports, expand iteratively. ✗ Read all 200 files before searching.
- **Indirect function usage:** Re-exports and wrapper modules require multi-hop tracing. ✓ Trace original plus re-export aliases and consumers. ✗ Single grep of original symbol suffices.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/2-tool-design-mcp/2-5-built-in-tools
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
