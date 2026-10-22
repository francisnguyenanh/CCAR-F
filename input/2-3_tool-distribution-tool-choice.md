# 2.3 — Tool Distribution & Tool Choice

> Domain 2: Tool Design & MCP Integration · Tỷ trọng toàn domain: 18%
> Source lesson: https://claudecertificationguide.com/learn/2-tool-design-mcp/2-3-tool-distribution-choice
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Tool Distribution & Tool Choice**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Tool overload

**Principle (EN):** Many exposed tools degrade model selection; restrict by agent role.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **many exposed tools degrade model selection; restrict by agent role**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Coordinator directly sees 22 unrelated operations.

**Recommended implementation:** Split roles and constrain visible tool lists.

**Incorrect shortcut / Sai lầm dễ mắc:** Move same 22 tools across two MCP servers.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Coordinator directly sees 22 unrelated operations".
- Decision: áp dụng nguyên tắc **Tool overload** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Split roles and constrain visible tool lists" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Consolidate homogeneous operations

**Principle (EN):** Numerous near-identical transformations can become enum driven function.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **numerous near-identical transformations can become enum driven function**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** 19 transforms differ only by operation name.

**Recommended implementation:** Use one transform_data tool with transform_type enum.

**Incorrect shortcut / Sai lầm dễ mắc:** Create 19 separate agent roles.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "19 transforms differ only by operation name".
- Decision: áp dụng nguyên tắc **Consolidate homogeneous operations** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use one transform_data tool with transform_type enum" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. tool_choice semantics

**Principle (EN):** auto optional tool, any mandatory unspecified tool, named tool forced.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **auto optional tool, any mandatory unspecified tool, named tool forced**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Document schema type unknown yet must extract structured object.

**Recommended implementation:** Use any across candidate extractors.

**Incorrect shortcut / Sai lầm dễ mắc:** Use auto and assume tool will run.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Document schema type unknown yet must extract structured object".
- Decision: áp dụng nguyên tắc **tool_choice semantics** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use any across candidate extractors" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Scoped cross-role capabilities

**Principle (EN):** Offer small safe direct lookup for common verification, escalate hard cases.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **offer small safe direct lookup for common verification, escalate hard cases**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Synthesis needs cheap direct factual checks frequently.

**Recommended implementation:** Expose narrow verify_fact and route complex work centrally.

**Incorrect shortcut / Sai lầm dễ mắc:** Give unrestricted search and delete access.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Synthesis needs cheap direct factual checks frequently".
- Decision: áp dụng nguyên tắc **Scoped cross-role capabilities** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Expose narrow verify_fact and route complex work centrally" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Coordinator directly sees 22 unrelated operations.

**Bad design:** Move same 22 tools across two MCP servers.

**Better design:** Split roles and constrain visible tool lists.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Coordinator directly sees 22 unrelated operations.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Split roles and constrain visible tool lists.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Tool overload:** "Move same 22 tools across two MCP servers" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở tool overload, rồi chọn "Split roles and constrain visible tool lists".

2. **Bẫy Consolidate homogeneous operations:** "Create 19 separate agent roles" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở consolidate homogeneous operations, rồi chọn "Use one transform_data tool with transform_type enum".

3. **Bẫy tool_choice semantics:** "Use auto and assume tool will run" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở tool_choice semantics, rồi chọn "Use any across candidate extractors".

4. **Bẫy Scoped cross-role capabilities:** "Give unrestricted search and delete access" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở scoped cross-role capabilities, rồi chọn "Expose narrow verify_fact and route complex work centrally".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Coordinator directly sees 22 unrelated operations**. Phương án nào phù hợp nhất?

- **A.** Move same 22 tools across two MCP servers; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Create 19 separate agent roles; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Use auto and assume tool will run; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Split roles and constrain visible tool lists; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Move same 22 tools across two MCP servers" được nêu ở cơ chế Tool overload. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Consolidate homogeneous operations**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **tool_choice semantics**, không giải quyết được yêu cầu cốt lõi "Many exposed tools degrade model selection; restrict by agent role" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Many exposed tools degrade model selection; restrict by agent role. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Coordinator directly sees 22 unrelated operations", ưu tiên phân biệt `Tool overload` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Create 19 separate agent roles** cho tình huống: 19 transforms differ only by operation name. Cần phản biện thế nào?

- **A.** Use one transform_data tool with transform_type enum; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Create 19 separate agent roles; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Use auto and assume tool will run; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Give unrestricted search and delete access; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Numerous near-identical transformations can become enum driven function. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Create 19 separate agent roles" được nêu ở cơ chế Consolidate homogeneous operations. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **tool_choice semantics**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Scoped cross-role capabilities**, không giải quyết được yêu cầu cốt lõi "Numerous near-identical transformations can become enum driven function" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "19 transforms differ only by operation name", ưu tiên phân biệt `Consolidate homogeneous operations` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Document schema type unknown yet must extract structured object** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Move same 22 tools across two MCP servers; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Use any across candidate extractors; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Use auto and assume tool will run; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Give unrestricted search and delete access; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Tool overload**, không giải quyết được yêu cầu cốt lõi "auto optional tool, any mandatory unspecified tool, named tool forced" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** auto optional tool, any mandatory unspecified tool, named tool forced. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Use auto and assume tool will run" được nêu ở cơ chế tool_choice semantics. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Scoped cross-role capabilities**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Document schema type unknown yet must extract structured object", ưu tiên phân biệt `tool_choice semantics` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Synthesis needs cheap direct factual checks frequently**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Move same 22 tools across two MCP servers; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Create 19 separate agent roles; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Expose narrow verify_fact and route complex work centrally; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Give unrestricted search and delete access; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Tool overload**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Consolidate homogeneous operations**, không giải quyết được yêu cầu cốt lõi "Offer small safe direct lookup for common verification, escalate hard cases" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Offer small safe direct lookup for common verification, escalate hard cases. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Give unrestricted search and delete access" được nêu ở cơ chế Scoped cross-role capabilities. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Synthesis needs cheap direct factual checks frequently", ưu tiên phân biệt `Scoped cross-role capabilities` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Move same 22 tools across two MCP servers**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Move same 22 tools across two MCP servers; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Create 19 separate agent roles; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Use auto and assume tool will run; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Split roles and constrain visible tool lists; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Move same 22 tools across two MCP servers" được nêu ở cơ chế Tool overload. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Consolidate homogeneous operations**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **tool_choice semantics**, không giải quyết được yêu cầu cốt lõi "Many exposed tools degrade model selection; restrict by agent role" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Many exposed tools degrade model selection; restrict by agent role. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Coordinator directly sees 22 unrelated operations", ưu tiên phân biệt `Tool overload` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **19 transforms differ only by operation name**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Use one transform_data tool with transform_type enum; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Create 19 separate agent roles; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Use auto and assume tool will run; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Give unrestricted search and delete access; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Numerous near-identical transformations can become enum driven function. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Create 19 separate agent roles" được nêu ở cơ chế Consolidate homogeneous operations. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **tool_choice semantics**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Scoped cross-role capabilities**, không giải quyết được yêu cầu cốt lõi "Numerous near-identical transformations can become enum driven function" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "19 transforms differ only by operation name", ưu tiên phân biệt `Consolidate homogeneous operations` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Document schema type unknown yet must extract structured object**, nên chọn gì?

- **A.** Move same 22 tools across two MCP servers; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Use any across candidate extractors; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Use auto and assume tool will run; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Give unrestricted search and delete access; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Tool overload**, không giải quyết được yêu cầu cốt lõi "auto optional tool, any mandatory unspecified tool, named tool forced" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** auto optional tool, any mandatory unspecified tool, named tool forced. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Use auto and assume tool will run" được nêu ở cơ chế tool_choice semantics. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Scoped cross-role capabilities**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Document schema type unknown yet must extract structured object", ưu tiên phân biệt `tool_choice semantics` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Give unrestricted search and delete access**. Đánh giá chính xác nhất là gì?

- **A.** Move same 22 tools across two MCP servers; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Create 19 separate agent roles; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Expose narrow verify_fact and route complex work centrally; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Give unrestricted search and delete access; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Tool overload**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Consolidate homogeneous operations**, không giải quyết được yêu cầu cốt lõi "Offer small safe direct lookup for common verification, escalate hard cases" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Offer small safe direct lookup for common verification, escalate hard cases. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Give unrestricted search and delete access" được nêu ở cơ chế Scoped cross-role capabilities. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Synthesis needs cheap direct factual checks frequently", ưu tiên phân biệt `Scoped cross-role capabilities` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Coordinator directly sees 22 unrelated operations**, tiêu chí pass phù hợp là gì?

- **A.** Move same 22 tools across two MCP servers; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Create 19 separate agent roles; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Use auto and assume tool will run; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Split roles and constrain visible tool lists; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Move same 22 tools across two MCP servers" được nêu ở cơ chế Tool overload. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Consolidate homogeneous operations**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **tool_choice semantics**, không giải quyết được yêu cầu cốt lõi "Many exposed tools degrade model selection; restrict by agent role" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Many exposed tools degrade model selection; restrict by agent role. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Coordinator directly sees 22 unrelated operations", ưu tiên phân biệt `Tool overload` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **19 transforms differ only by operation name**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Use one transform_data tool with transform_type enum; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Create 19 separate agent roles; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Use auto and assume tool will run; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Give unrestricted search and delete access; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Numerous near-identical transformations can become enum driven function. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Create 19 separate agent roles" được nêu ở cơ chế Consolidate homogeneous operations. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **tool_choice semantics**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Scoped cross-role capabilities**, không giải quyết được yêu cầu cốt lõi "Numerous near-identical transformations can become enum driven function" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "19 transforms differ only by operation name", ưu tiên phân biệt `Consolidate homogeneous operations` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Coordinator directly sees 22 unrelated operations".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Split roles and constrain visible tool lists.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Tool overload:** Many exposed tools degrade model selection; restrict by agent role. ✓ Split roles and constrain visible tool lists. ✗ Move same 22 tools across two MCP servers.
- **Consolidate homogeneous operations:** Numerous near-identical transformations can become enum driven function. ✓ Use one transform_data tool with transform_type enum. ✗ Create 19 separate agent roles.
- **tool_choice semantics:** auto optional tool, any mandatory unspecified tool, named tool forced. ✓ Use any across candidate extractors. ✗ Use auto and assume tool will run.
- **Scoped cross-role capabilities:** Offer small safe direct lookup for common verification, escalate hard cases. ✓ Expose narrow verify_fact and route complex work centrally. ✗ Give unrestricted search and delete access.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/2-tool-design-mcp/2-3-tool-distribution-choice
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
