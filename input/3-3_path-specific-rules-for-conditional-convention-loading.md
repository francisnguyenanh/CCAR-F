# 3.3 — Path-Specific Rules for Conditional Convention Loading

## Tổng quan

Khi dự án lớn dần, số quy ước cũng tăng: quy ước React, Terraform, SQL migration, test, controller... Nhét hết vào CLAUDE.md gốc thì mọi phiên đều phải đọc tất cả, dù hôm nay bạn chỉ sửa một component. **Path-specific rules** giải quyết việc này: mỗi quy ước là một file trong `.claude/rules/`, có frontmatter `paths` chứa glob, và chỉ được nạp khi Claude làm việc với file khớp glob.

Đề thi hỏi: dùng glob thế nào cho loại file rải rác nhiều thư mục, vì sao điều này tiết kiệm context, khi nào dùng rules thay vì CLAUDE.md lồng nhau, và giới hạn quan trọng nhất, **rule chỉ là hướng dẫn, không phải cơ chế cưỡng chế**. Quy tắc nhớ nhanh: **quy ước theo loại file → `.claude/rules/*.md` + `paths`; quy ước theo vị trí → CLAUDE.md thư mục; bất biến bắt buộc → hook/CI/test.**

## K1. Rule với frontmatter `paths` glob

### Trọng tâm

File trong `.claude/rules/*.md` có thể khai báo `paths:` là danh sách glob; rule chỉ kích hoạt khi Claude làm việc với file khớp. Một rule cho cả nhóm file rải rác, không phải copy vào từng thư mục.

### Giải thích

Cấu trúc điển hình:

```
.claude/rules/
├── testing.md        # paths: ["**/*.test.ts"]
├── terraform.md      # paths: ["infra/**/*.tf"]
└── api-errors.md     # paths: ["src/api/**/*.ts"]
```

Nội dung `testing.md`:

```markdown
---
paths:
  - "**/*.test.ts"
---
- Dùng `describe`/`it`, tên test mô tả hành vi.
- Mỗi test độc lập, không phụ thuộc thứ tự chạy.
- Mock I/O bằng `jest.mock`, không gọi mạng thật.
```

Vài điểm cơ chế cần nhớ:

- **Glob** dùng cú pháp quen thuộc: `*` khớp trong một cấp thư mục, `**` khớp qua nhiều cấp, `{a,b}` cho nhiều lựa chọn (ví dụ `"**/*.{ts,tsx}"`).
- Rule **không có** `paths` được nạp vô điều kiện như CLAUDE.md; rule **có** `paths` mới là có điều kiện.
- Rule nằm trong repo nên được commit và chia sẻ như CLAUDE.md của project; cũng có thể có rule cấp người dùng trong thư mục home cho sở thích cá nhân.
- Không cần sao chép nội dung vào mỗi thư mục: một glob phủ toàn bộ repo, kể cả file mới tạo sau này miễn là khớp mẫu.

Vì sao hay hơn "nhân bản CLAUDE.md vào từng thư mục"? Các file `*.test.ts` không nằm trong một thư mục duy nhất; nhân bản sẽ lệch theo thời gian và quên thư mục mới. Glob mô tả **loại file**, đúng với bản chất của quy ước test.

### Keyword

- `.claude/rules/` — thư mục chứa các rule Markdown theo chủ đề
- `paths` — trường frontmatter liệt kê glob xác định khi nào rule có hiệu lực
- `glob pattern` — mẫu khớp đường dẫn, ví dụ `**/*.test.ts`
- `conditional loading` — chỉ nạp hướng dẫn khi file đang làm việc khớp điều kiện
- `unconditional rule` — rule không có `paths`, luôn được nạp
- `convention` — quy ước viết code của team

### Bẫy đề thi

- ✗ Copy cùng một hướng dẫn test vào mọi thư mục có test ⇒ ✓ Một rule với `paths: ["**/*.test.ts"]`
- ✗ Nghĩ rule không có `paths` cũng chỉ nạp có điều kiện ⇒ ✓ Không có `paths` thì rule được nạp vô điều kiện
- ✗ Muốn giới hạn rule cho một nhóm file nhưng quên khai báo `paths` ⇒ ✓ Phải có `paths`, nếu không rule nạp ở mọi phiên

### Câu hỏi

#### Q1. Repo có hàng trăm file `*.test.ts` nằm trong nhiều package khác nhau. Team muốn Claude luôn dùng cùng một quy ước test khi sửa các file này, nhưng không muốn tốn context khi sửa code không phải test. Cách làm nào đúng?
- A. Viết quy ước test vào CLAUDE.md gốc cho chắc
- B. Tạo CLAUDE.md trong từng thư mục chứa test
- C. Tạo `.claude/rules/testing.md` với `paths: ["**/*.test.ts"]`
- D. Tạo skill `/test-rules` và nhắc dev gõ lệnh mỗi lần

**Đáp án:** C

**Giải thích:** Rule có `paths` glob gắn với loại file nên một file phủ mọi package và chỉ nạp khi làm việc với test. A nạp quy ước ở mọi phiên, lãng phí context. B phải nhân bản và dễ lệch. D phụ thuộc vào việc người dùng nhớ gõ lệnh.

#### Q2. Team tạo `.claude/rules/terraform.md` chứa quy ước hạ tầng nhưng không viết frontmatter `paths`. Dev frontend phàn nàn rằng quy ước Terraform vẫn chiếm context khi sửa React. Giải thích và cách sửa đúng?
- A. Rule không có `paths` được nạp vô điều kiện; thêm `paths: ["**/*.tf"]` (hoặc đường dẫn hạ tầng) để chỉ nạp khi cần
- B. Rule chỉ nạp khi file có đuôi `.md` được mở; đổi tên file rule
- C. Phải khai báo `paths` trong `settings.json` thay vì frontmatter
- D. Đây là lỗi của model; nạp lại phiên sẽ tự hết

**Đáp án:** A

**Giải thích:** Điều kiện nạp có điều kiện chính là `paths`; thiếu nó rule hoạt động như hướng dẫn luôn nạp. B, C bịa cơ chế không tồn tại. D sai vì đây là hành vi theo thiết kế, không phải lỗi ngẫu nhiên.

## K2. Tối ưu ngân sách context bằng nạp có điều kiện

### Trọng tâm

Nạp có điều kiện giúp Claude chỉ thấy quy ước liên quan tới file đang sửa. Quy ước của hạ tầng (Terraform) không nên nằm trong CLAUDE.md gốc khi bạn đang sửa React.

### Giải thích

Mỗi dòng hướng dẫn nạp vào context đều có chi phí: token, độ trễ và quan trọng hơn là **độ nhiễu**. Model có xu hướng phân tán sự chú ý khi context chứa nhiều chỉ dẫn không liên quan, và các quy tắc quan trọng dễ bị "chìm" giữa đống quy tắc khác.

Hãy hình dung CLAUDE.md gốc 800 dòng chứa quy ước cho React, Terraform, SQL, Python data pipeline, mobile. Một dev frontend chỉ sửa một nút bấm vẫn phải nạp 100% các quy ước còn lại ở mỗi phiên. Chuyển các phần chuyên biệt thành rule có `paths`:

| Công việc đang làm | Nạp |
|---|---|
| Sửa `src/components/Button.tsx` | CLAUDE.md gốc (ngắn) + rule React |
| Sửa `infra/main.tf` | CLAUDE.md gốc + rule Terraform |
| Sửa `db/migrations/*.sql` | CLAUDE.md gốc + rule SQL |

Nguyên tắc phân chia: **cái gì áp cho mọi thao tác** (lệnh build, quy ước commit, kiến trúc tổng) ở CLAUDE.md gốc; **cái gì chỉ liên quan một nhóm file** ở rule có `paths`. Bạn không cần tối ưu từng token, nhưng nên tránh để các quy ước chuyên ngành lớn nằm trong phần luôn-nạp.

Cần phân biệt với `@path` imports (bài 3.1): import giúp **tổ chức** nhưng file import vẫn nạp cùng file cha; chỉ path-specific rules mới cho **nạp có điều kiện**.

### Keyword

- `context budget` — ngân sách context; mỗi hướng dẫn nạp đều tiêu tốn một phần
- `instruction noise` — nhiễu do hướng dẫn không liên quan
- `always-loaded` — phần luôn nạp mỗi phiên (CLAUDE.md gốc, rule không có `paths`)
- `scoped rule` — rule chỉ áp cho nhóm file xác định
- `selective loading` — nạp có chọn lọc theo công việc hiện tại
- `domain-specific guidance` — hướng dẫn chuyên ngành (Terraform, SQL...)

### Bẫy đề thi

- ✗ Đưa toàn bộ hướng dẫn Terraform vào CLAUDE.md gốc "cho chắc" ⇒ ✓ Tạo rule Terraform với `paths` chỉ nạp khi làm việc với file hạ tầng
- ✗ Nghĩ `@import` của CLAUDE.md đã giúp nạp có điều kiện ⇒ ✓ Import chỉ là module hóa; nạp có điều kiện cần `paths`
- ✗ Tách rule quá vụn, chia cả quy ước chung của toàn repo thành rule theo path ⇒ ✓ Quy ước dùng cho mọi thao tác ở lại CLAUDE.md gốc

### Câu hỏi

#### Q1. CLAUDE.md gốc dài 900 dòng gồm quy ước React, Terraform, SQL và Python. Dev frontend nhận thấy Claude thỉnh thoảng áp quy ước đặt tên của Terraform vào component React. Hướng khắc phục tốt nhất?
- A. Giữ nguyên và thêm câu "đừng áp quy ước Terraform cho React"
- B. Tách quy ước theo lĩnh vực thành các rule trong `.claude/rules/` với `paths` tương ứng, giữ CLAUDE.md gốc cho nội dung chung
- C. Đổi sang model có context window lớn hơn
- D. Xoá toàn bộ quy ước Terraform khỏi repo

**Đáp án:** B

**Giải thích:** Nạp có điều kiện bỏ nhiễu tại gốc: khi sửa React, quy ước Terraform không vào context. A vẫn để nhiễu và dựa vào model tự lọc. C chỉ tăng sức chứa, không giảm nhiễu. D mất tri thức mà team cần cho việc khác.

#### Q2. Điều nào mô tả đúng sự khác nhau giữa `@path` import trong CLAUDE.md và rule có `paths`?
- A. Hai cơ chế giống hệt nhau, chỉ khác cú pháp
- B. Import nạp có điều kiện theo loại file; rule có `paths` luôn nạp
- C. Import chỉ để module hóa, file vẫn nạp cùng file cha; rule có `paths` nạp khi file đang làm việc khớp glob
- D. Rule có `paths` chỉ dùng được cho file Markdown

**Đáp án:** C

**Giải thích:** Import không thêm điều kiện nạp, trong khi `paths` chính là điều kiện. B đảo ngược hai cơ chế. A bỏ qua khác biệt chức năng. D bịa giới hạn: rule áp cho bất kỳ file nào khớp glob.

## K3. Loại file rải rác khắp repo

### Trọng tâm

Khi cùng một loại file nằm ở nhiều module (ví dụ `*.controller.ts` dưới năm module), dùng **glob rộng** như `**/*.controller.ts`; không dựa vào CLAUDE.md của một thư mục cấp cao.

### Giải thích

Cấu trúc thư mục thường theo **tính năng** (users/, orders/, billing/), mỗi nơi có controller, service, test... Quy ước lại thường theo **loại file** (mọi controller đều phải validate input, mọi test đều đặt tên theo hành vi). Hai chiều này cắt chéo nhau. CLAUDE.md lồng nhau bám theo chiều thư mục nên không biểu diễn được chiều loại-file mà không nhân bản.

Ví dụ cấu trúc:

```
src/users/users.controller.ts
src/orders/orders.controller.ts
src/billing/billing.controller.ts
src/search/search.controller.ts
src/admin/admin.controller.ts
```

Một rule duy nhất giải quyết:

```markdown
---
paths:
  - "**/*.controller.ts"
---
- Validate input bằng DTO trước khi gọi service.
- Không viết logic nghiệp vụ trong controller.
- Trả lỗi theo schema chuẩn của dự án.
```

Lợi ích: thêm module mới (`src/reports/reports.controller.ts`) là tự khớp, không phải nhớ tạo thêm file hướng dẫn. Có thể gộp nhiều mẫu trong cùng `paths`, ví dụ `["**/*.controller.ts", "**/*.resolver.ts"]`. Ngược lại, nếu quy ước **chỉ** dành riêng cho một module (ví dụ chỉ `billing/` cần quy tắc làm tròn tiền), CLAUDE.md đặt trong `billing/` hoặc glob `src/billing/**` đều hợp lý.

Cách chọn nhanh: câu hỏi "áp cho **vùng nào** của repo?" → thư mục; "áp cho **loại file nào**, ở bất cứ đâu?" → glob.

### Keyword

- `cross-cutting convention` — quy ước cắt ngang nhiều module theo loại file
- `recursive glob` — glob có `**` để khớp qua nhiều cấp thư mục
- `feature-based layout` — tổ chức thư mục theo tính năng
- `file class` — nhóm file cùng vai trò (controller, test, migration)
- `brace expansion` — cú pháp `{a,b}` gộp nhiều phần mở rộng trong một glob
- `directory-scoped vs pattern-scoped` — phạm vi theo thư mục khác phạm vi theo mẫu file

### Bẫy đề thi

- ✗ Đặt một CLAUDE.md ở thư mục `src/` rồi mong nó chỉ áp cho controller ⇒ ✓ Dùng rule `paths: ["**/*.controller.ts"]`
- ✗ Tạo file hướng dẫn riêng trong từng module chứa controller ⇒ ✓ Một rule glob phủ cả module hiện tại và module sẽ thêm
- ✗ Dùng glob khi quy ước thực chất chỉ của một module ⇒ ✓ Với quy ước theo vùng, CLAUDE.md thư mục hoặc glob giới hạn đường dẫn là đủ

### Câu hỏi

#### Q1. Mọi `*.controller.ts` ở năm module cần validate input theo cùng một cách. Tuần sau sẽ có thêm hai module nữa. Giải pháp bền nhất?
- A. Tạo CLAUDE.md trong từng thư mục module và nhớ copy khi có module mới
- B. Viết quy ước vào CLAUDE.md gốc, áp cho mọi file
- C. Dặn từng dev nhắc Claude mỗi lần sửa controller
- D. Rule trong `.claude/rules/` với `paths: ["**/*.controller.ts"]`

**Đáp án:** D

**Giải thích:** Glob tự phủ cả module mới ngay khi file khớp mẫu. A dễ quên và lệch. B nạp mọi nơi, tốn context. C không bền vững.

#### Q2. Quy tắc làm tròn tiền chỉ dành cho code trong `src/billing/`, các module khác không liên quan. Đâu là lựa chọn hợp lý nhất?
- A. CLAUDE.md gốc ghi quy tắc cho mọi phiên
- B. Đặt CLAUDE.md trong `src/billing/` (hoặc rule với `paths: ["src/billing/**"]`)
- C. Rule với `paths: ["**/*"]` để chắc chắn khớp mọi nơi
- D. Dùng hook PostToolUse để tự động viết lại mọi file

**Đáp án:** B

**Giải thích:** Phạm vi theo vùng cụ thể được biểu diễn trực tiếp bằng CLAUDE.md thư mục hoặc glob giới hạn đường dẫn. A và C áp quy tắc ra ngoài vùng cần thiết. D quá nặng tay và không liên quan việc truyền quy ước.

## K4. Rule là hướng dẫn, không phải cưỡng chế

### Trọng tâm

Rules (và CLAUDE.md) định hướng cách Claude **sinh code**, nhưng không đảm bảo điều gì. Bất biến bắt buộc (mọi SQL migration phải qua kiểm tra an toàn) cần **hook, CI hoặc test**.

### Giải thích

Rule được đưa vào context, vì vậy hiệu quả dựa trên việc model đọc, hiểu và làm theo, thường tốt nhưng không bảo đảm 100%. Nó cũng chỉ có tác dụng khi Claude tham gia; một dev sửa tay file SQL rồi push sẽ hoàn toàn không đi qua rule.

Do đó cần phân biệt hai lớp:

| Lớp | Cơ chế | Tính chất |
|---|---|---|
| Hướng dẫn | CLAUDE.md, `.claude/rules` | Xác suất, chủ yếu giúp code đúng ngay từ đầu |
| Bảo đảm | Hook (ví dụ chạy trước/sau khi sửa file), CI check, test, permissions | Tất định, chặn hoặc làm fail khi vi phạm |

Ví dụ: chính sách "mọi migration phải không chứa `DROP TABLE` mà không có xác nhận". Thực hiện đúng cách gồm hai phần bổ trợ:

1. Rule cho `db/migrations/*.sql` mô tả quy ước (đặt tên, viết migration có thể rollback) để Claude viết đúng ngay.
2. Một bước CI chạy script lint SQL, làm pipeline fail nếu vi phạm, và/hoặc một hook chặn ghi file khi script báo lỗi.

Thiết kế tốt dùng **cả hai**: rule giảm lỗi phát sinh, kiểm tra tất định đảm bảo lỗi còn sót không lọt qua. Trong đề thi, nếu câu hỏi có từ như "bắt buộc", "luôn luôn", "không được phép lọt" hoặc "audit" thì chọn phương án có cơ chế cưỡng chế (CI/hook), có thể kèm rule cho quy ước.

### Keyword

- `guidance vs enforcement` — hướng dẫn (xác suất) khác cưỡng chế (tất định)
- `PreToolUse hook` — hook chạy trước khi tool thực hiện, có thể chặn thao tác
- `PostToolUse hook` — hook chạy sau khi tool thực hiện, hay dùng để lint/format/kiểm tra
- `CI gate` — bước kiểm tra trong pipeline làm fail build khi vi phạm
- `invariant` — điều kiện bắt buộc luôn phải đúng
- `defense in depth` — nhiều lớp bảo vệ bổ trợ nhau

### Bẫy đề thi

- ✗ Dựa vào rule thụ động như cổng bảo đảm cho chính sách bắt buộc ⇒ ✓ Dùng CI/hook/test cho bất biến, rule cho quy ước
- ✗ Bỏ rule vì đã có CI ⇒ ✓ Rule giúp Claude viết đúng ngay, giảm vòng sửa; CI là lưới bảo đảm
- ✗ Nghĩ mọi thay đổi đều đi qua Claude nên rule đủ bao phủ ⇒ ✓ Sửa tay hoặc công cụ khác không đi qua rule; CI bao phủ tất cả

### Câu hỏi

#### Q1. Chính sách: mọi migration SQL phải qua kiểm tra an toàn trước khi merge. Team viết một rule `paths: ["db/migrations/**/*.sql"]` mô tả kiểm tra, nhưng vẫn có migration không an toàn lọt vào main. Cải tiến đúng nhất?
- A. Thêm một rule thứ hai nhắc lại điều tương tự
- B. Chuyển nội dung rule vào CLAUDE.md gốc để nạp luôn
- C. Giữ rule cho quy ước và thêm bước CI chạy script kiểm tra SQL, làm fail khi vi phạm (có thể kèm hook)
- D. Yêu cầu Claude "hãy luôn tự kiểm tra kỹ"

**Đáp án:** C

**Giải thích:** Điều kiện bắt buộc cần cơ chế tất định ở CI/hook; rule vẫn hữu ích để Claude viết đúng từ đầu. A, B chỉ là thêm văn bản vào context, vẫn xác suất. D là yêu cầu mơ hồ, không kiểm chứng được.

#### Q2. Một thành viên cho rằng: "Đã có rule bảo vệ thư mục `infra/`, nên không cần review hay CI cho thay đổi hạ tầng". Phản biện nào đúng nhất?
- A. Đúng, rule luôn được tuân thủ tuyệt đối
- B. Rule chỉ ảnh hưởng thao tác của Claude và mang tính hướng dẫn; thay đổi thủ công hay vi phạm vẫn lọt nếu thiếu CI/review
- C. Sai, vì rule chỉ hoạt động với file `.md`
- D. Sai, vì rule làm giảm tốc độ của Claude

**Đáp án:** B

**Giải thích:** Rule là hướng dẫn trong context của Claude, không chặn được người sửa tay và không đảm bảo tuyệt đối. A phóng đại. C bịa giới hạn. D không liên quan đến lý do cần CI.
