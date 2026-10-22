# 3.3 — Path-Specific Rules for Conditional Convention Loading

> Domain 3: Claude Code Configuration & Workflows · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/3-claude-code-config/3-3-path-specific-rules
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Path-Specific Rules for Conditional Convention Loading**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. paths glob frontmatter

**Principle (EN):** Rules in .claude/rules/*.md activate for matching paths.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **rules in .claude/rules/*.md activate for matching paths**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** All *.test.ts across many folders need same convention.

**Recommended implementation:** Use paths: ["**/*.test.ts"].

**Incorrect shortcut / Sai lầm dễ mắc:** Copy instructions into every folder.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "All *.test.ts across many folders need same convention".
- Decision: áp dụng nguyên tắc **paths glob frontmatter** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use paths: ["**/*.test.ts"]" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Context budget optimization

**Principle (EN):** Conditional rules avoid loading irrelevant guidelines.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **conditional rules avoid loading irrelevant guidelines**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** React edits need no Terraform standards.

**Recommended implementation:** Load Terraform guidance only on matching paths.

**Incorrect shortcut / Sai lầm dễ mắc:** Put all Terraform guidance in root CLAUDE.md.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "React edits need no Terraform standards".
- Decision: áp dụng nguyên tắc **Context budget optimization** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Load Terraform guidance only on matching paths" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Cross-folder file classes

**Principle (EN):** Glob can match dispersed files across entire repository.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **glob can match dispersed files across entire repository**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Controller files occur under five distinct modules.

**Recommended implementation:** Use **/*.controller.ts or relevant patterns.

**Incorrect shortcut / Sai lầm dễ mắc:** Depend on one top-level directory CLAUDE.md.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Controller files occur under five distinct modules".
- Decision: áp dụng nguyên tắc **Cross-folder file classes** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use **/*.controller.ts or relevant patterns" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Rule versus enforcement

**Principle (EN):** Rules guide generation; invariant checks need hooks/settings/tests.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **rules guide generation; invariant checks need hooks/settings/tests**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** All SQL migrations must pass a safety check.

**Recommended implementation:** Use CI/hook for mandatory policy plus rules for conventions.

**Incorrect shortcut / Sai lầm dễ mắc:** Trust passive rules as guaranteed authorization gate.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "All SQL migrations must pass a safety check".
- Decision: áp dụng nguyên tắc **Rule versus enforcement** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use CI/hook for mandatory policy plus rules for conventions" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** All *.test.ts across many folders need same convention.

**Bad design:** Copy instructions into every folder.

**Better design:** Use paths: ["**/*.test.ts"].

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : All *.test.ts across many folders need same convention.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Use paths: ["**/*.test.ts"].
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy paths glob frontmatter:** "Copy instructions into every folder" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở paths glob frontmatter, rồi chọn "Use paths: ["**/*.test.ts"]".

2. **Bẫy Context budget optimization:** "Put all Terraform guidance in root CLAUDE.md" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở context budget optimization, rồi chọn "Load Terraform guidance only on matching paths".

3. **Bẫy Cross-folder file classes:** "Depend on one top-level directory CLAUDE.md" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở cross-folder file classes, rồi chọn "Use **/*.controller.ts or relevant patterns".

4. **Bẫy Rule versus enforcement:** "Trust passive rules as guaranteed authorization gate" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở rule versus enforcement, rồi chọn "Use CI/hook for mandatory policy plus rules for conventions".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **All *.test.ts across many folders need same convention**. Phương án nào phù hợp nhất?

- **A.** Put all Terraform guidance in root CLAUDE.md; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Depend on one top-level directory CLAUDE.md; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Use paths: ["**/*.test.ts"]; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Copy instructions into every folder; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Context budget optimization**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Cross-folder file classes**, không giải quyết được yêu cầu cốt lõi "Rules in .claude/rules/*.md activate for matching paths" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Rules in .claude/rules/*.md activate for matching paths. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Copy instructions into every folder" được nêu ở cơ chế paths glob frontmatter. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "All *.test.ts across many folders need same convention", ưu tiên phân biệt `paths glob frontmatter` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Put all Terraform guidance in root CLAUDE.md** cho tình huống: React edits need no Terraform standards. Cần phản biện thế nào?

- **A.** Put all Terraform guidance in root CLAUDE.md; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Depend on one top-level directory CLAUDE.md; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Trust passive rules as guaranteed authorization gate; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Load Terraform guidance only on matching paths; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Put all Terraform guidance in root CLAUDE.md" được nêu ở cơ chế Context budget optimization. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Cross-folder file classes**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Rule versus enforcement**, không giải quyết được yêu cầu cốt lõi "Conditional rules avoid loading irrelevant guidelines" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Conditional rules avoid loading irrelevant guidelines. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "React edits need no Terraform standards", ưu tiên phân biệt `Context budget optimization` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Controller files occur under five distinct modules** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Use **/*.controller.ts or relevant patterns; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Depend on one top-level directory CLAUDE.md; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Trust passive rules as guaranteed authorization gate; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Copy instructions into every folder; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Glob can match dispersed files across entire repository. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Depend on one top-level directory CLAUDE.md" được nêu ở cơ chế Cross-folder file classes. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Rule versus enforcement**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **paths glob frontmatter**, không giải quyết được yêu cầu cốt lõi "Glob can match dispersed files across entire repository" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Controller files occur under five distinct modules", ưu tiên phân biệt `Cross-folder file classes` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **All SQL migrations must pass a safety check**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Put all Terraform guidance in root CLAUDE.md; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Use CI/hook for mandatory policy plus rules for conventions; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Trust passive rules as guaranteed authorization gate; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Copy instructions into every folder; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Context budget optimization**, không giải quyết được yêu cầu cốt lõi "Rules guide generation; invariant checks need hooks/settings/tests" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Rules guide generation; invariant checks need hooks/settings/tests. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Trust passive rules as guaranteed authorization gate" được nêu ở cơ chế Rule versus enforcement. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **paths glob frontmatter**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "All SQL migrations must pass a safety check", ưu tiên phân biệt `Rule versus enforcement` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Copy instructions into every folder**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Put all Terraform guidance in root CLAUDE.md; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Depend on one top-level directory CLAUDE.md; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Use paths: ["**/*.test.ts"]; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Copy instructions into every folder; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Context budget optimization**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Cross-folder file classes**, không giải quyết được yêu cầu cốt lõi "Rules in .claude/rules/*.md activate for matching paths" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Rules in .claude/rules/*.md activate for matching paths. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Copy instructions into every folder" được nêu ở cơ chế paths glob frontmatter. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "All *.test.ts across many folders need same convention", ưu tiên phân biệt `paths glob frontmatter` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **React edits need no Terraform standards**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Put all Terraform guidance in root CLAUDE.md; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Depend on one top-level directory CLAUDE.md; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Trust passive rules as guaranteed authorization gate; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Load Terraform guidance only on matching paths; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Put all Terraform guidance in root CLAUDE.md" được nêu ở cơ chế Context budget optimization. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Cross-folder file classes**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Rule versus enforcement**, không giải quyết được yêu cầu cốt lõi "Conditional rules avoid loading irrelevant guidelines" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Conditional rules avoid loading irrelevant guidelines. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "React edits need no Terraform standards", ưu tiên phân biệt `Context budget optimization` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Controller files occur under five distinct modules**, nên chọn gì?

- **A.** Use **/*.controller.ts or relevant patterns; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Depend on one top-level directory CLAUDE.md; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Trust passive rules as guaranteed authorization gate; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Copy instructions into every folder; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Glob can match dispersed files across entire repository. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Depend on one top-level directory CLAUDE.md" được nêu ở cơ chế Cross-folder file classes. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Rule versus enforcement**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **paths glob frontmatter**, không giải quyết được yêu cầu cốt lõi "Glob can match dispersed files across entire repository" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Controller files occur under five distinct modules", ưu tiên phân biệt `Cross-folder file classes` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Trust passive rules as guaranteed authorization gate**. Đánh giá chính xác nhất là gì?

- **A.** Put all Terraform guidance in root CLAUDE.md; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Use CI/hook for mandatory policy plus rules for conventions; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Trust passive rules as guaranteed authorization gate; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Copy instructions into every folder; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Context budget optimization**, không giải quyết được yêu cầu cốt lõi "Rules guide generation; invariant checks need hooks/settings/tests" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Rules guide generation; invariant checks need hooks/settings/tests. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Trust passive rules as guaranteed authorization gate" được nêu ở cơ chế Rule versus enforcement. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **paths glob frontmatter**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "All SQL migrations must pass a safety check", ưu tiên phân biệt `Rule versus enforcement` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **All *.test.ts across many folders need same convention**, tiêu chí pass phù hợp là gì?

- **A.** Put all Terraform guidance in root CLAUDE.md; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Depend on one top-level directory CLAUDE.md; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Use paths: ["**/*.test.ts"]; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Copy instructions into every folder; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Context budget optimization**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Cross-folder file classes**, không giải quyết được yêu cầu cốt lõi "Rules in .claude/rules/*.md activate for matching paths" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Rules in .claude/rules/*.md activate for matching paths. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Copy instructions into every folder" được nêu ở cơ chế paths glob frontmatter. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "All *.test.ts across many folders need same convention", ưu tiên phân biệt `paths glob frontmatter` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **React edits need no Terraform standards**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Put all Terraform guidance in root CLAUDE.md; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Depend on one top-level directory CLAUDE.md; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Trust passive rules as guaranteed authorization gate; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Load Terraform guidance only on matching paths; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Put all Terraform guidance in root CLAUDE.md" được nêu ở cơ chế Context budget optimization. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Cross-folder file classes**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Rule versus enforcement**, không giải quyết được yêu cầu cốt lõi "Conditional rules avoid loading irrelevant guidelines" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Conditional rules avoid loading irrelevant guidelines. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "React edits need no Terraform standards", ưu tiên phân biệt `Context budget optimization` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "All *.test.ts across many folders need same convention".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Use paths: ["**/*.test.ts"].
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **paths glob frontmatter:** Rules in .claude/rules/*.md activate for matching paths. ✓ Use paths: ["**/*.test.ts"]. ✗ Copy instructions into every folder.
- **Context budget optimization:** Conditional rules avoid loading irrelevant guidelines. ✓ Load Terraform guidance only on matching paths. ✗ Put all Terraform guidance in root CLAUDE.md.
- **Cross-folder file classes:** Glob can match dispersed files across entire repository. ✓ Use **/*.controller.ts or relevant patterns. ✗ Depend on one top-level directory CLAUDE.md.
- **Rule versus enforcement:** Rules guide generation; invariant checks need hooks/settings/tests. ✓ Use CI/hook for mandatory policy plus rules for conventions. ✗ Trust passive rules as guaranteed authorization gate.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/3-claude-code-config/3-3-path-specific-rules
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
