# 5.1 — Context Window Management

> Domain 5: Context Management & Reliability · Tỷ trọng toàn domain: 15%
> Source lesson: https://claudecertificationguide.com/learn/5-context-management/5-1-context-window-management
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Context Window Management**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Persistent case facts

**Principle (EN):** Do not summarize away transaction identifiers, amounts and dates.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **do not summarize away transaction identifiers, amounts and dates**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Summary loses refund 247.83 and order #8891.

**Recommended implementation:** Keep immutable structured caseFactsBlock across turns.

**Incorrect shortcut / Sai lầm dễ mắc:** Trust generic summary customer wants refund.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Summary loses refund 247.83 and order #8891".
- Decision: áp dụng nguyên tắc **Persistent case facts** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Keep immutable structured caseFactsBlock across turns" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Lost in the middle

**Principle (EN):** Place key findings first with headings and organized detail.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **place key findings first with headings and organized detail**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Critical safety caveat buried amid 70 pages.

**Recommended implementation:** Front-load concise findings and section anchors.

**Incorrect shortcut / Sai lầm dễ mắc:** Simply add more middle paragraphs.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Critical safety caveat buried amid 70 pages".
- Decision: áp dụng nguyên tắc **Lost in the middle** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Front-load concise findings and section anchors" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Tool result trimming

**Principle (EN):** Keep fields necessary for current task rather than every backend field.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **keep fields necessary for current task rather than every backend field**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Order tool returns 40 fields but refund requires five.

**Recommended implementation:** Prune irrelevant fields preserving essential provenance.

**Incorrect shortcut / Sai lầm dễ mắc:** Accumulate entire raw outputs forever.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Order tool returns 40 fields but refund requires five".
- Decision: áp dụng nguyên tắc **Tool result trimming** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Prune irrelevant fields preserving essential provenance" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Separate issues as structured records

**Principle (EN):** Multi-concern cases need separate durable item facts.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **multi-concern cases need separate durable item facts**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Customer requests return and shipping correction in one thread.

**Recommended implementation:** Track two issue records with own statuses and identifiers.

**Incorrect shortcut / Sai lầm dễ mắc:** Summarize both as customer has a problem.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Customer requests return and shipping correction in one thread".
- Decision: áp dụng nguyên tắc **Separate issues as structured records** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Track two issue records with own statuses and identifiers" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Summary loses refund 247.83 and order #8891.

**Bad design:** Trust generic summary customer wants refund.

**Better design:** Keep immutable structured caseFactsBlock across turns.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Summary loses refund 247.83 and order #8891.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Keep immutable structured caseFactsBlock across turns.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Persistent case facts:** "Trust generic summary customer wants refund" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở persistent case facts, rồi chọn "Keep immutable structured caseFactsBlock across turns".

2. **Bẫy Lost in the middle:** "Simply add more middle paragraphs" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở lost in the middle, rồi chọn "Front-load concise findings and section anchors".

3. **Bẫy Tool result trimming:** "Accumulate entire raw outputs forever" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở tool result trimming, rồi chọn "Prune irrelevant fields preserving essential provenance".

4. **Bẫy Separate issues as structured records:** "Summarize both as customer has a problem" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở separate issues as structured records, rồi chọn "Track two issue records with own statuses and identifiers".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Summary loses refund 247.83 and order #8891**. Phương án nào phù hợp nhất?

- **A.** Keep immutable structured caseFactsBlock across turns; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Trust generic summary customer wants refund; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Simply add more middle paragraphs; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Accumulate entire raw outputs forever; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Do not summarize away transaction identifiers, amounts and dates. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Trust generic summary customer wants refund" được nêu ở cơ chế Persistent case facts. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Lost in the middle**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Tool result trimming**, không giải quyết được yêu cầu cốt lõi "Do not summarize away transaction identifiers, amounts and dates" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Summary loses refund 247.83 and order #8891", ưu tiên phân biệt `Persistent case facts` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Simply add more middle paragraphs** cho tình huống: Critical safety caveat buried amid 70 pages. Cần phản biện thế nào?

- **A.** Summarize both as customer has a problem; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Front-load concise findings and section anchors; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Simply add more middle paragraphs; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Accumulate entire raw outputs forever; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Separate issues as structured records**, không giải quyết được yêu cầu cốt lõi "Place key findings first with headings and organized detail" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Place key findings first with headings and organized detail. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Simply add more middle paragraphs" được nêu ở cơ chế Lost in the middle. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Tool result trimming**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Critical safety caveat buried amid 70 pages", ưu tiên phân biệt `Lost in the middle` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Order tool returns 40 fields but refund requires five** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Summarize both as customer has a problem; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Trust generic summary customer wants refund; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Prune irrelevant fields preserving essential provenance; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Accumulate entire raw outputs forever; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Separate issues as structured records**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Persistent case facts**, không giải quyết được yêu cầu cốt lõi "Keep fields necessary for current task rather than every backend field" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Keep fields necessary for current task rather than every backend field. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Accumulate entire raw outputs forever" được nêu ở cơ chế Tool result trimming. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Order tool returns 40 fields but refund requires five", ưu tiên phân biệt `Tool result trimming` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Customer requests return and shipping correction in one thread**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Summarize both as customer has a problem; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Trust generic summary customer wants refund; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Simply add more middle paragraphs; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Track two issue records with own statuses and identifiers; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Summarize both as customer has a problem" được nêu ở cơ chế Separate issues as structured records. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Persistent case facts**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Lost in the middle**, không giải quyết được yêu cầu cốt lõi "Multi-concern cases need separate durable item facts" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Multi-concern cases need separate durable item facts. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Customer requests return and shipping correction in one thread", ưu tiên phân biệt `Separate issues as structured records` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Trust generic summary customer wants refund**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Keep immutable structured caseFactsBlock across turns; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Trust generic summary customer wants refund; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Simply add more middle paragraphs; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Accumulate entire raw outputs forever; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Do not summarize away transaction identifiers, amounts and dates. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Trust generic summary customer wants refund" được nêu ở cơ chế Persistent case facts. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Lost in the middle**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Tool result trimming**, không giải quyết được yêu cầu cốt lõi "Do not summarize away transaction identifiers, amounts and dates" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Summary loses refund 247.83 and order #8891", ưu tiên phân biệt `Persistent case facts` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Critical safety caveat buried amid 70 pages**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Summarize both as customer has a problem; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Front-load concise findings and section anchors; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Simply add more middle paragraphs; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Accumulate entire raw outputs forever; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Separate issues as structured records**, không giải quyết được yêu cầu cốt lõi "Place key findings first with headings and organized detail" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Place key findings first with headings and organized detail. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Simply add more middle paragraphs" được nêu ở cơ chế Lost in the middle. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Tool result trimming**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Critical safety caveat buried amid 70 pages", ưu tiên phân biệt `Lost in the middle` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Order tool returns 40 fields but refund requires five**, nên chọn gì?

- **A.** Summarize both as customer has a problem; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Trust generic summary customer wants refund; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Prune irrelevant fields preserving essential provenance; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Accumulate entire raw outputs forever; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Separate issues as structured records**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Persistent case facts**, không giải quyết được yêu cầu cốt lõi "Keep fields necessary for current task rather than every backend field" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Keep fields necessary for current task rather than every backend field. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Accumulate entire raw outputs forever" được nêu ở cơ chế Tool result trimming. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Order tool returns 40 fields but refund requires five", ưu tiên phân biệt `Tool result trimming` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Summarize both as customer has a problem**. Đánh giá chính xác nhất là gì?

- **A.** Summarize both as customer has a problem; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Trust generic summary customer wants refund; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Simply add more middle paragraphs; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Track two issue records with own statuses and identifiers; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Summarize both as customer has a problem" được nêu ở cơ chế Separate issues as structured records. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Persistent case facts**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Lost in the middle**, không giải quyết được yêu cầu cốt lõi "Multi-concern cases need separate durable item facts" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Multi-concern cases need separate durable item facts. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Customer requests return and shipping correction in one thread", ưu tiên phân biệt `Separate issues as structured records` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Summary loses refund 247.83 and order #8891**, tiêu chí pass phù hợp là gì?

- **A.** Keep immutable structured caseFactsBlock across turns; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Trust generic summary customer wants refund; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Simply add more middle paragraphs; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Accumulate entire raw outputs forever; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Do not summarize away transaction identifiers, amounts and dates. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Trust generic summary customer wants refund" được nêu ở cơ chế Persistent case facts. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Lost in the middle**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Tool result trimming**, không giải quyết được yêu cầu cốt lõi "Do not summarize away transaction identifiers, amounts and dates" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Summary loses refund 247.83 and order #8891", ưu tiên phân biệt `Persistent case facts` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Critical safety caveat buried amid 70 pages**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Summarize both as customer has a problem; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Front-load concise findings and section anchors; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Simply add more middle paragraphs; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Accumulate entire raw outputs forever; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Separate issues as structured records**, không giải quyết được yêu cầu cốt lõi "Place key findings first with headings and organized detail" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Place key findings first with headings and organized detail. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Simply add more middle paragraphs" được nêu ở cơ chế Lost in the middle. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Tool result trimming**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Critical safety caveat buried amid 70 pages", ưu tiên phân biệt `Lost in the middle` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Summary loses refund 247.83 and order #8891".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Keep immutable structured caseFactsBlock across turns.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Persistent case facts:** Do not summarize away transaction identifiers, amounts and dates. ✓ Keep immutable structured caseFactsBlock across turns. ✗ Trust generic summary customer wants refund.
- **Lost in the middle:** Place key findings first with headings and organized detail. ✓ Front-load concise findings and section anchors. ✗ Simply add more middle paragraphs.
- **Tool result trimming:** Keep fields necessary for current task rather than every backend field. ✓ Prune irrelevant fields preserving essential provenance. ✗ Accumulate entire raw outputs forever.
- **Separate issues as structured records:** Multi-concern cases need separate durable item facts. ✓ Track two issue records with own statuses and identifiers. ✗ Summarize both as customer has a problem.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/5-context-management/5-1-context-window-management
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
