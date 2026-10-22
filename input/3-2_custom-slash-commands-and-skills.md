# 3.2 — Custom Slash Commands and Skills

> Domain 3: Claude Code Configuration & Workflows · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/3-claude-code-config/3-2-slash-commands-skills
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Custom Slash Commands and Skills**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Skill path versus command alias

**Principle (EN):** .claude/skills/name/SKILL.md is canonical; commands/name.md legacy alias.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **.claude/skills/name/SKILL.md is canonical; commands/name.md legacy alias**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Team creates /review workflow with supporting files.

**Recommended implementation:** Use versioned skills folder with SKILL.md.

**Incorrect shortcut / Sai lầm dễ mắc:** Keep workflow only under personal ~/.claude.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Team creates /review workflow with supporting files".
- Decision: áp dụng nguyên tắc **Skill path versus command alias** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use versioned skills folder with SKILL.md" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Forked skill context

**Principle (EN):** context: fork isolates verbose work from main context.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **context: fork isolates verbose work from main context**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Code exploration produces 50 pages of excerpts.

**Recommended implementation:** Use fork context skill and return concise findings.

**Incorrect shortcut / Sai lầm dễ mắc:** Dump every excerpt to main conversation.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Code exploration produces 50 pages of excerpts".
- Decision: áp dụng nguyên tắc **Forked skill context** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use fork context skill and return concise findings" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. allowed-tools nuance

**Principle (EN):** Skill allowed-tools preapproves those tools, not complete denylist.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **skill allowed-tools preapproves those tools, not complete denylist**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Skill allows Read and Grep but Bash exists with normal permissions.

**Recommended implementation:** Apply normal permission checks to unlisted tool.

**Incorrect shortcut / Sai lầm dễ mắc:** Claim all other tools become impossible.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Skill allows Read and Grep but Bash exists with normal permissions".
- Decision: áp dụng nguyên tắc **allowed-tools nuance** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Apply normal permission checks to unlisted tool" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Scope and discovery

**Principle (EN):** Project skills shared; description enables automatic matching.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **project skills shared; description enables automatic matching**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Teammates need same deploy checklist skill.

**Recommended implementation:** Commit project skill with clear description.

**Incorrect shortcut / Sai lầm dễ mắc:** Create private local command and expect team visibility.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Teammates need same deploy checklist skill".
- Decision: áp dụng nguyên tắc **Scope and discovery** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Commit project skill with clear description" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Team creates /review workflow with supporting files.

**Bad design:** Keep workflow only under personal ~/.claude.

**Better design:** Use versioned skills folder with SKILL.md.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Team creates /review workflow with supporting files.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Use versioned skills folder with SKILL.md.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Skill path versus command alias:** "Keep workflow only under personal ~/.claude" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở skill path versus command alias, rồi chọn "Use versioned skills folder with SKILL.md".

2. **Bẫy Forked skill context:** "Dump every excerpt to main conversation" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở forked skill context, rồi chọn "Use fork context skill and return concise findings".

3. **Bẫy allowed-tools nuance:** "Claim all other tools become impossible" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở allowed-tools nuance, rồi chọn "Apply normal permission checks to unlisted tool".

4. **Bẫy Scope and discovery:** "Create private local command and expect team visibility" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở scope and discovery, rồi chọn "Commit project skill with clear description".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Team creates /review workflow with supporting files**. Phương án nào phù hợp nhất?

- **A.** Dump every excerpt to main conversation; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Claim all other tools become impossible; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Use versioned skills folder with SKILL.md; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Keep workflow only under personal ~/.claude; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Forked skill context**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **allowed-tools nuance**, không giải quyết được yêu cầu cốt lõi ".claude/skills/name/SKILL.md is canonical; commands/name.md legacy alias" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** .claude/skills/name/SKILL.md is canonical; commands/name.md legacy alias. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Keep workflow only under personal ~/.claude" được nêu ở cơ chế Skill path versus command alias. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Team creates /review workflow with supporting files", ưu tiên phân biệt `Skill path versus command alias` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Dump every excerpt to main conversation** cho tình huống: Code exploration produces 50 pages of excerpts. Cần phản biện thế nào?

- **A.** Dump every excerpt to main conversation; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Claim all other tools become impossible; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Create private local command and expect team visibility; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use fork context skill and return concise findings; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Dump every excerpt to main conversation" được nêu ở cơ chế Forked skill context. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **allowed-tools nuance**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Scope and discovery**, không giải quyết được yêu cầu cốt lõi "context: fork isolates verbose work from main context" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** context: fork isolates verbose work from main context. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Code exploration produces 50 pages of excerpts", ưu tiên phân biệt `Forked skill context` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Skill allows Read and Grep but Bash exists with normal permissions** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Apply normal permission checks to unlisted tool; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Claim all other tools become impossible; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Create private local command and expect team visibility; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Keep workflow only under personal ~/.claude; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Skill allowed-tools preapproves those tools, not complete denylist. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Claim all other tools become impossible" được nêu ở cơ chế allowed-tools nuance. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Scope and discovery**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Skill path versus command alias**, không giải quyết được yêu cầu cốt lõi "Skill allowed-tools preapproves those tools, not complete denylist" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Skill allows Read and Grep but Bash exists with normal permissions", ưu tiên phân biệt `allowed-tools nuance` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Teammates need same deploy checklist skill**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Dump every excerpt to main conversation; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Commit project skill with clear description; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Create private local command and expect team visibility; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Keep workflow only under personal ~/.claude; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Forked skill context**, không giải quyết được yêu cầu cốt lõi "Project skills shared; description enables automatic matching" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Project skills shared; description enables automatic matching. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Create private local command and expect team visibility" được nêu ở cơ chế Scope and discovery. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Skill path versus command alias**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Teammates need same deploy checklist skill", ưu tiên phân biệt `Scope and discovery` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Keep workflow only under personal ~/.claude**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Dump every excerpt to main conversation; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Claim all other tools become impossible; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Use versioned skills folder with SKILL.md; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Keep workflow only under personal ~/.claude; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Forked skill context**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **allowed-tools nuance**, không giải quyết được yêu cầu cốt lõi ".claude/skills/name/SKILL.md is canonical; commands/name.md legacy alias" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** .claude/skills/name/SKILL.md is canonical; commands/name.md legacy alias. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Keep workflow only under personal ~/.claude" được nêu ở cơ chế Skill path versus command alias. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Team creates /review workflow with supporting files", ưu tiên phân biệt `Skill path versus command alias` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Code exploration produces 50 pages of excerpts**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Dump every excerpt to main conversation; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Claim all other tools become impossible; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Create private local command and expect team visibility; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use fork context skill and return concise findings; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Dump every excerpt to main conversation" được nêu ở cơ chế Forked skill context. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **allowed-tools nuance**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Scope and discovery**, không giải quyết được yêu cầu cốt lõi "context: fork isolates verbose work from main context" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** context: fork isolates verbose work from main context. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Code exploration produces 50 pages of excerpts", ưu tiên phân biệt `Forked skill context` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Skill allows Read and Grep but Bash exists with normal permissions**, nên chọn gì?

- **A.** Apply normal permission checks to unlisted tool; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Claim all other tools become impossible; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Create private local command and expect team visibility; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Keep workflow only under personal ~/.claude; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Skill allowed-tools preapproves those tools, not complete denylist. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Claim all other tools become impossible" được nêu ở cơ chế allowed-tools nuance. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Scope and discovery**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Skill path versus command alias**, không giải quyết được yêu cầu cốt lõi "Skill allowed-tools preapproves those tools, not complete denylist" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Skill allows Read and Grep but Bash exists with normal permissions", ưu tiên phân biệt `allowed-tools nuance` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Create private local command and expect team visibility**. Đánh giá chính xác nhất là gì?

- **A.** Dump every excerpt to main conversation; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Commit project skill with clear description; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Create private local command and expect team visibility; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Keep workflow only under personal ~/.claude; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Forked skill context**, không giải quyết được yêu cầu cốt lõi "Project skills shared; description enables automatic matching" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Project skills shared; description enables automatic matching. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Create private local command and expect team visibility" được nêu ở cơ chế Scope and discovery. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Skill path versus command alias**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Teammates need same deploy checklist skill", ưu tiên phân biệt `Scope and discovery` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Team creates /review workflow with supporting files**, tiêu chí pass phù hợp là gì?

- **A.** Dump every excerpt to main conversation; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Claim all other tools become impossible; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Use versioned skills folder with SKILL.md; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Keep workflow only under personal ~/.claude; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Forked skill context**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **allowed-tools nuance**, không giải quyết được yêu cầu cốt lõi ".claude/skills/name/SKILL.md is canonical; commands/name.md legacy alias" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** .claude/skills/name/SKILL.md is canonical; commands/name.md legacy alias. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Keep workflow only under personal ~/.claude" được nêu ở cơ chế Skill path versus command alias. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Team creates /review workflow with supporting files", ưu tiên phân biệt `Skill path versus command alias` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Code exploration produces 50 pages of excerpts**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Dump every excerpt to main conversation; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Claim all other tools become impossible; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Create private local command and expect team visibility; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use fork context skill and return concise findings; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Dump every excerpt to main conversation" được nêu ở cơ chế Forked skill context. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **allowed-tools nuance**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Scope and discovery**, không giải quyết được yêu cầu cốt lõi "context: fork isolates verbose work from main context" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** context: fork isolates verbose work from main context. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Code exploration produces 50 pages of excerpts", ưu tiên phân biệt `Forked skill context` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Team creates /review workflow with supporting files".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Use versioned skills folder with SKILL.md.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Skill path versus command alias:** .claude/skills/name/SKILL.md is canonical; commands/name.md legacy alias. ✓ Use versioned skills folder with SKILL.md. ✗ Keep workflow only under personal ~/.claude.
- **Forked skill context:** context: fork isolates verbose work from main context. ✓ Use fork context skill and return concise findings. ✗ Dump every excerpt to main conversation.
- **allowed-tools nuance:** Skill allowed-tools preapproves those tools, not complete denylist. ✓ Apply normal permission checks to unlisted tool. ✗ Claim all other tools become impossible.
- **Scope and discovery:** Project skills shared; description enables automatic matching. ✓ Commit project skill with clear description. ✗ Create private local command and expect team visibility.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/3-claude-code-config/3-2-slash-commands-skills
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
