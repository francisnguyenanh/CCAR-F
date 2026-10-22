# 5.6 — Information Provenance & Multi-Source Synthesis

> Domain 5: Context Management & Reliability · Tỷ trọng toàn domain: 15%
> Source lesson: https://claudecertificationguide.com/learn/5-context-management/5-6-information-provenance
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Information Provenance & Multi-Source Synthesis**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Claim-source mappings

**Principle (EN):** Each claim includes URL, document, excerpt and publication date.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **each claim includes URL, document, excerpt and publication date**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Report merges three reports and loses source references.

**Recommended implementation:** Preserve structured mapping through synthesis.

**Incorrect shortcut / Sai lầm dễ mắc:** Output citations only in initial researcher notes.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Report merges three reports and loses source references".
- Decision: áp dụng nguyên tắc **Claim-source mappings** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Preserve structured mapping through synthesis" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Conflicting credible sources

**Principle (EN):** Report differing estimates with provenance rather than arbitrary selection.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **report differing estimates with provenance rather than arbitrary selection**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Two studies give growth 12% and 8%.

**Recommended implementation:** Present both with methods and date caveat.

**Incorrect shortcut / Sai lầm dễ mắc:** Average into 10% without justification.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Two studies give growth 12% and 8%".
- Decision: áp dụng nguyên tắc **Conflicting credible sources** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Present both with methods and date caveat" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Temporal comparability

**Principle (EN):** Different dates and observation periods may explain difference.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **different dates and observation periods may explain difference**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** One report measures 2022, another 2024.

**Recommended implementation:** Normalize or explicitly annotate periods before labeling conflict.

**Incorrect shortcut / Sai lầm dễ mắc:** Call all unequal numbers contradictory.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "One report measures 2022, another 2024".
- Decision: áp dụng nguyên tắc **Temporal comparability** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Normalize or explicitly annotate periods before labeling conflict" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Purpose-fit presentation

**Principle (EN):** Select tables for numerical contrasts, prose for nuance with citations.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **select tables for numerical contrasts, prose for nuance with citations**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Multiple sources compare estimates and qualitative methodology.

**Recommended implementation:** Use comparison table and narrative explanation.

**Incorrect shortcut / Sai lầm dễ mắc:** Flatten all evidence into unsourced single paragraph.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Multiple sources compare estimates and qualitative methodology".
- Decision: áp dụng nguyên tắc **Purpose-fit presentation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use comparison table and narrative explanation" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Report merges three reports and loses source references.

**Bad design:** Output citations only in initial researcher notes.

**Better design:** Preserve structured mapping through synthesis.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Report merges three reports and loses source references.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Preserve structured mapping through synthesis.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Claim-source mappings:** "Output citations only in initial researcher notes" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở claim-source mappings, rồi chọn "Preserve structured mapping through synthesis".

2. **Bẫy Conflicting credible sources:** "Average into 10% without justification" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở conflicting credible sources, rồi chọn "Present both with methods and date caveat".

3. **Bẫy Temporal comparability:** "Call all unequal numbers contradictory" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở temporal comparability, rồi chọn "Normalize or explicitly annotate periods before labeling conflict".

4. **Bẫy Purpose-fit presentation:** "Flatten all evidence into unsourced single paragraph" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở purpose-fit presentation, rồi chọn "Use comparison table and narrative explanation".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Report merges three reports and loses source references**. Phương án nào phù hợp nhất?

- **A.** Preserve structured mapping through synthesis; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Output citations only in initial researcher notes; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Average into 10% without justification; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Call all unequal numbers contradictory; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Each claim includes URL, document, excerpt and publication date. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Output citations only in initial researcher notes" được nêu ở cơ chế Claim-source mappings. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Conflicting credible sources**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Temporal comparability**, không giải quyết được yêu cầu cốt lõi "Each claim includes URL, document, excerpt and publication date" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Report merges three reports and loses source references", ưu tiên phân biệt `Claim-source mappings` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Average into 10% without justification** cho tình huống: Two studies give growth 12% and 8%. Cần phản biện thế nào?

- **A.** Flatten all evidence into unsourced single paragraph; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Present both with methods and date caveat; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Average into 10% without justification; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Call all unequal numbers contradictory; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Purpose-fit presentation**, không giải quyết được yêu cầu cốt lõi "Report differing estimates with provenance rather than arbitrary selection" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Report differing estimates with provenance rather than arbitrary selection. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Average into 10% without justification" được nêu ở cơ chế Conflicting credible sources. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Temporal comparability**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Two studies give growth 12% and 8%", ưu tiên phân biệt `Conflicting credible sources` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **One report measures 2022, another 2024** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Flatten all evidence into unsourced single paragraph; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Output citations only in initial researcher notes; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Normalize or explicitly annotate periods before labeling conflict; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Call all unequal numbers contradictory; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Purpose-fit presentation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Claim-source mappings**, không giải quyết được yêu cầu cốt lõi "Different dates and observation periods may explain difference" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Different dates and observation periods may explain difference. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Call all unequal numbers contradictory" được nêu ở cơ chế Temporal comparability. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "One report measures 2022, another 2024", ưu tiên phân biệt `Temporal comparability` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Multiple sources compare estimates and qualitative methodology**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Flatten all evidence into unsourced single paragraph; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Output citations only in initial researcher notes; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Average into 10% without justification; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use comparison table and narrative explanation; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Flatten all evidence into unsourced single paragraph" được nêu ở cơ chế Purpose-fit presentation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Claim-source mappings**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Conflicting credible sources**, không giải quyết được yêu cầu cốt lõi "Select tables for numerical contrasts, prose for nuance with citations" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Select tables for numerical contrasts, prose for nuance with citations. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Multiple sources compare estimates and qualitative methodology", ưu tiên phân biệt `Purpose-fit presentation` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Output citations only in initial researcher notes**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Preserve structured mapping through synthesis; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Output citations only in initial researcher notes; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Average into 10% without justification; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Call all unequal numbers contradictory; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Each claim includes URL, document, excerpt and publication date. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Output citations only in initial researcher notes" được nêu ở cơ chế Claim-source mappings. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Conflicting credible sources**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Temporal comparability**, không giải quyết được yêu cầu cốt lõi "Each claim includes URL, document, excerpt and publication date" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Report merges three reports and loses source references", ưu tiên phân biệt `Claim-source mappings` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Two studies give growth 12% and 8%**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Flatten all evidence into unsourced single paragraph; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Present both with methods and date caveat; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Average into 10% without justification; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Call all unequal numbers contradictory; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Purpose-fit presentation**, không giải quyết được yêu cầu cốt lõi "Report differing estimates with provenance rather than arbitrary selection" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Report differing estimates with provenance rather than arbitrary selection. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Average into 10% without justification" được nêu ở cơ chế Conflicting credible sources. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Temporal comparability**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Two studies give growth 12% and 8%", ưu tiên phân biệt `Conflicting credible sources` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **One report measures 2022, another 2024**, nên chọn gì?

- **A.** Flatten all evidence into unsourced single paragraph; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Output citations only in initial researcher notes; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Normalize or explicitly annotate periods before labeling conflict; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Call all unequal numbers contradictory; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Purpose-fit presentation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Claim-source mappings**, không giải quyết được yêu cầu cốt lõi "Different dates and observation periods may explain difference" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Different dates and observation periods may explain difference. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Call all unequal numbers contradictory" được nêu ở cơ chế Temporal comparability. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "One report measures 2022, another 2024", ưu tiên phân biệt `Temporal comparability` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Flatten all evidence into unsourced single paragraph**. Đánh giá chính xác nhất là gì?

- **A.** Flatten all evidence into unsourced single paragraph; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Output citations only in initial researcher notes; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Average into 10% without justification; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use comparison table and narrative explanation; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Flatten all evidence into unsourced single paragraph" được nêu ở cơ chế Purpose-fit presentation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Claim-source mappings**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Conflicting credible sources**, không giải quyết được yêu cầu cốt lõi "Select tables for numerical contrasts, prose for nuance with citations" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Select tables for numerical contrasts, prose for nuance with citations. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Multiple sources compare estimates and qualitative methodology", ưu tiên phân biệt `Purpose-fit presentation` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Report merges three reports and loses source references**, tiêu chí pass phù hợp là gì?

- **A.** Preserve structured mapping through synthesis; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Output citations only in initial researcher notes; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Average into 10% without justification; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Call all unequal numbers contradictory; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Each claim includes URL, document, excerpt and publication date. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Output citations only in initial researcher notes" được nêu ở cơ chế Claim-source mappings. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Conflicting credible sources**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Temporal comparability**, không giải quyết được yêu cầu cốt lõi "Each claim includes URL, document, excerpt and publication date" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Report merges three reports and loses source references", ưu tiên phân biệt `Claim-source mappings` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Two studies give growth 12% and 8%**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Flatten all evidence into unsourced single paragraph; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Present both with methods and date caveat; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Average into 10% without justification; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Call all unequal numbers contradictory; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Purpose-fit presentation**, không giải quyết được yêu cầu cốt lõi "Report differing estimates with provenance rather than arbitrary selection" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Report differing estimates with provenance rather than arbitrary selection. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Average into 10% without justification" được nêu ở cơ chế Conflicting credible sources. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Temporal comparability**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Two studies give growth 12% and 8%", ưu tiên phân biệt `Conflicting credible sources` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Report merges three reports and loses source references".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Preserve structured mapping through synthesis.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Claim-source mappings:** Each claim includes URL, document, excerpt and publication date. ✓ Preserve structured mapping through synthesis. ✗ Output citations only in initial researcher notes.
- **Conflicting credible sources:** Report differing estimates with provenance rather than arbitrary selection. ✓ Present both with methods and date caveat. ✗ Average into 10% without justification.
- **Temporal comparability:** Different dates and observation periods may explain difference. ✓ Normalize or explicitly annotate periods before labeling conflict. ✗ Call all unequal numbers contradictory.
- **Purpose-fit presentation:** Select tables for numerical contrasts, prose for nuance with citations. ✓ Use comparison table and narrative explanation. ✗ Flatten all evidence into unsourced single paragraph.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/5-context-management/5-6-information-provenance
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
