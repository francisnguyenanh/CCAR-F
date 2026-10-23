# 3.1 — CLAUDE.md Hierarchy, Scoping, and Modular Organisation

## Tổng quan

**CLAUDE.md** là file Markdown mà Claude Code tự đọc vào context ở đầu phiên để biết quy ước, lệnh build/test và kiến trúc của dự án. Điểm khó không nằm ở việc viết file, mà ở việc **đặt đúng chỗ (scope)**: cá nhân hay cả team, toàn repo hay riêng một module, một file lớn hay nhiều file nhỏ được import.

Đề thi thường cho một tình huống (đồng đội không thấy quy ước, quy tắc của module này bị áp sang module khác, file CLAUDE.md phình to, hai file mâu thuẫn nhau) rồi hỏi nên đặt/sửa ở đâu. Quy tắc nhớ nhanh: **quy ước của team → CLAUDE.md của project được commit; quy ước riêng một thư mục → CLAUDE.md lồng trong thư mục đó; file quá dài → chia bằng `@path`; yêu cầu bắt buộc → không dựa vào CLAUDE.md mà dùng settings/hook.**

## K1. Các tầng CLAUDE.md: cá nhân và project

### Trọng tâm

`~/.claude/CLAUDE.md` là tầng **cá nhân** (chỉ máy bạn); `CLAUDE.md` ở gốc repo hoặc `.claude/CLAUDE.md` là tầng **project** được commit để cả team dùng chung. Quy ước của team phải nằm ở tầng project.

### Giải thích

Claude Code nạp nhiều file hướng dẫn theo từng tầng, mỗi tầng có phạm vi và người thấy khác nhau:

| Vị trí | Phạm vi | Chia sẻ qua git? |
|---|---|---|
| Managed policy (do tổ chức/IT triển khai) | Mọi người dùng trên máy | Không, do IT quản lý |
| `~/.claude/CLAUDE.md` | Mọi dự án của riêng bạn | Không |
| `./CLAUDE.md` hoặc `./.claude/CLAUDE.md` | Cả project | **Có**, nếu commit |
| `./CLAUDE.local.md` | Sở thích cá nhân trong một project | Không (thường đưa vào `.gitignore`) |

Lý do thiết kế: một số hướng dẫn mang tính cá nhân (ví dụ "trả lời tôi bằng tiếng Việt", editor ưa thích), một số là hợp đồng của nhóm (quy ước đặt tên test, lệnh chạy lint, cấu trúc thư mục). Nếu hợp đồng của nhóm chỉ nằm ở `~/.claude/CLAUDE.md` của một người thì **chỉ người đó** được Claude làm theo; đồng đội clone repo về sẽ nhận code do Claude sinh ra theo quy ước khác, và CI/PR review sẽ phát hiện sai lệch. Ngược lại, commit CLAUDE.md vào repo thì mỗi người clone về là có cùng hướng dẫn, được review như code và có lịch sử thay đổi.

Ví dụ: team muốn mọi unit test dùng Jest, đặt tên `*.test.ts`, mock bằng `jest.mock`. Cách đúng là thêm mục "Testing conventions" vào CLAUDE.md gốc repo rồi commit. Lệnh `/init` có thể sinh bản nháp CLAUDE.md từ việc phân tích codebase, bạn chỉnh lại rồi commit.

Lưu ý bản chất: nội dung CLAUDE.md được nạp như **context** (hướng dẫn mà model cố gắng làm theo), không phải cấu hình được cưỡng chế. Vì vậy nên viết cụ thể, kiểm chứng được ("dùng `pnpm test`" tốt hơn "test cẩn thận").

### Keyword

- `~/.claude/CLAUDE.md` — file hướng dẫn cấp người dùng, áp cho mọi dự án của riêng bạn
- `project CLAUDE.md` — CLAUDE.md ở gốc repo hoặc `.claude/`, commit để chia sẻ cho team
- `CLAUDE.local.md` — hướng dẫn cá nhân riêng một project, không commit
- `/init` — lệnh sinh bản nháp CLAUDE.md từ codebase
- `shared conventions` — quy ước dùng chung của nhóm, cần version-control cùng code
- `memory file` — cách gọi các file CLAUDE.md được nạp vào context mỗi phiên

### Bẫy đề thi

- ✗ Đặt quy ước của team trong `~/.claude/CLAUDE.md` của một người ⇒ ✓ Đặt ở CLAUDE.md của project và commit vào repo
- ✗ Nghĩ rằng đồng đội tự "thừa hưởng" file home của bạn khi clone repo ⇒ ✓ File ở thư mục home chỉ có hiệu lực trên máy của chính bạn
- ✗ Coi CLAUDE.md là cơ chế bắt buộc như cấu hình ⇒ ✓ Nó là context hướng dẫn; muốn cưỡng chế phải dùng settings/hook (xem K3)

### Câu hỏi

#### Q1. Một team 8 người muốn mọi test do Claude Code sinh ra đều theo cùng quy ước (Jest, đặt tên `*.test.ts`). Tech lead đã ghi quy ước này vào `~/.claude/CLAUDE.md` trên máy mình, nhưng PR của các thành viên khác vẫn sai quy ước. Cách sửa đúng là gì?
- A. Gửi file `~/.claude/CLAUDE.md` của tech lead qua chat để mỗi người chép vào thư mục home của mình
- B. Chuyển quy ước vào CLAUDE.md ở gốc repo (hoặc `.claude/CLAUDE.md`) và commit
- C. Đặt quy ước vào `CLAUDE.local.md` của tech lead rồi push lên repo
- D. Thêm quy ước vào prompt đầu tiên mỗi khi ai đó mở phiên Claude Code

**Đáp án:** B

**Giải thích:** CLAUDE.md của project được commit là cách chuẩn để chia sẻ hướng dẫn: ai clone repo cũng có cùng nội dung, và nó được review/version cùng code. A thủ công, dễ lệch phiên bản và không đi theo repo. C sai vì `CLAUDE.local.md` được thiết kế cho sở thích cá nhân, thường nằm trong `.gitignore`. D phụ thuộc vào việc mỗi người nhớ gõ lại, không bền vững.

#### Q2. Bạn muốn Claude luôn trả lời bằng tiếng Việt khi làm việc với bạn trên mọi dự án, nhưng không muốn ép đồng đội làm theo. Nên đặt chỉ dẫn ở đâu?
- A. CLAUDE.md ở gốc repo, commit vào nhánh chính
- B. `.claude/CLAUDE.md` của từng repo, rồi commit
- C. Trong code comment ở đầu mỗi file nguồn
- D. `~/.claude/CLAUDE.md` của bạn

**Đáp án:** D

**Giải thích:** Đây là sở thích cá nhân áp cho mọi dự án của riêng bạn, đúng vai trò của file cấp người dùng trong thư mục home. A và B sẽ áp chỉ dẫn lên toàn team vì được commit. C không phải nơi Claude Code nạp hướng dẫn và làm bẩn code.

## K2. CLAUDE.md theo thư mục (directory-specific)

### Trọng tâm

CLAUDE.md đặt trong một thư mục con chỉ phục vụ **cây thư mục đó**. Quy tắc riêng của module nên nằm trong CLAUDE.md của module, không nhân bản lên gốc repo.

### Giải thích

Trong monorepo, các phần của hệ thống thường có quy ước khác nhau: module `api/` yêu cầu mọi lỗi trả về theo một schema và log có correlation ID; module `frontend/` lại quan tâm đến accessibility và cách đặt tên component. Nếu nhét tất cả vào CLAUDE.md gốc, mọi phiên đều nạp cả hai bộ quy tắc, tốn context và có nguy cơ model áp quy ước của API vào code frontend.

Cơ chế nạp: khi bạn khởi động Claude Code, nó nạp CLAUDE.md từ thư mục làm việc hiện tại **và các thư mục cha** (đi lên tới gốc). Còn CLAUDE.md nằm trong **thư mục con** thì được nạp **theo nhu cầu**, khi Claude đọc/làm việc với file thuộc cây thư mục đó. Nhờ vậy:

- `packages/api/CLAUDE.md` chỉ "kích hoạt" khi Claude đụng đến `packages/api/**`.
- `packages/web/CLAUDE.md` tương tự cho frontend.
- CLAUDE.md gốc chứa những gì áp cho toàn repo (lệnh build, quy ước commit, kiến trúc tổng thể).

Ví dụ cấu trúc:

```
repo/
├── CLAUDE.md                 # quy ước chung toàn repo
├── packages/
│   ├── api/CLAUDE.md         # chuẩn xử lý lỗi, logging cho API
│   └── web/CLAUDE.md         # quy ước component, a11y
```

So với `.claude/rules` có `paths` (bài 3.3): CLAUDE.md theo thư mục gắn với **vị trí** (một cây thư mục), còn path-specific rules gắn với **mẫu file** (glob) có thể rải rác nhiều thư mục. Khi tiêu chí là "mọi file `*.test.ts` ở khắp nơi" thì glob phù hợp hơn; khi tiêu chí là "riêng module api" thì CLAUDE.md lồng nhau là đủ.

### Keyword

- `nested CLAUDE.md` — CLAUDE.md đặt trong thư mục con, chỉ áp cho cây thư mục đó
- `monorepo` — một repo chứa nhiều package/module với quy ước khác nhau
- `on-demand loading` — nạp khi cần: file con chỉ vào context khi Claude làm việc trong thư mục đó
- `parent directory walk` — việc nạp CLAUDE.md từ thư mục hiện tại đi lên các thư mục cha
- `context budget` — ngân sách context; càng nạp nhiều hướng dẫn thừa càng tốn
- `scoping` — giới hạn phạm vi áp dụng của một hướng dẫn

### Bẫy đề thi

- ✗ Lặp quy tắc của API vào CLAUDE.md gốc để áp cho mọi package ⇒ ✓ Đặt CLAUDE.md riêng trong thư mục của module đó
- ✗ Tạo CLAUDE.md ở thư mục con và mong nó luôn được nạp cho mọi tác vụ trong repo ⇒ ✓ Nó chỉ áp cho công việc trong cây thư mục đó
- ✗ Dùng CLAUDE.md lồng nhau cho loại file rải rác khắp repo ⇒ ✓ Dùng `.claude/rules` với `paths` glob (bài 3.3)

### Câu hỏi

#### Q1. Monorepo có `packages/api` (yêu cầu mọi lỗi theo schema thống nhất) và `packages/web` (React). Claude liên tục áp quy ước xử lý lỗi của API vào code React. Hiện toàn bộ quy ước nằm trong một CLAUDE.md gốc dài. Cách khắc phục phù hợp nhất?
- A. Giữ nguyên file gốc nhưng thêm câu "chỉ áp dụng quy ước lỗi cho API, không cho web" in đậm
- B. Chuyển quy ước lỗi của API sang `packages/api/CLAUDE.md`, giữ ở gốc chỉ phần chung
- C. Copy quy ước API vào CLAUDE.md của mọi package để model luôn nhìn thấy
- D. Xoá hẳn quy ước API khỏi repo và nhắc lại bằng tay mỗi lần làm việc với API

**Đáp án:** B

**Giải thích:** CLAUDE.md theo thư mục đặt quy tắc đúng phạm vi và chỉ nạp khi làm việc trong cây thư mục đó, giảm nhiễu cho frontend. A vẫn nạp mọi thứ vào mọi phiên và dựa vào model tự phân biệt. C làm tệ hơn: nhân bản và đưa quy ước API vào web. D bỏ mất tri thức dùng chung.

#### Q2. Một repo có quy ước test riêng cho `*.test.ts` nằm rải rác ở bảy module khác nhau. Một kỹ sư đề xuất tạo CLAUDE.md trong từng thư mục module. Nhận xét nào đúng nhất?
- A. Hợp lý, vì CLAUDE.md lồng nhau là cách duy nhất để giới hạn phạm vi
- B. Sai, vì CLAUDE.md con không bao giờ được nạp
- C. Chỉ cần một CLAUDE.md gốc, vì Claude tự suy ra quy ước từ tên file
- D. Kém tối ưu, vì tiêu chí là loại file rải rác; path-specific rule với glob `**/*.test.ts` phù hợp hơn

**Đáp án:** D

**Giải thích:** CLAUDE.md lồng nhau gắn với vị trí thư mục nên phải nhân bản bảy lần. Rule có `paths` glob gắn với mẫu file nên một file phủ cả bảy module. A sai vì còn lựa chọn rule. B sai vì file con được nạp theo nhu cầu. C không đáng tin vì model không tự biết quy ước riêng của team.

## K3. Không có precedence đảm bảo giữa các file

### Trọng tâm

Các file CLAUDE.md được nạp **cộng dồn vào context**; không có cơ chế "file cụ thể hơn luôn thắng". Khi hai file mâu thuẫn, hành vi không xác định, nên phải **gỡ mâu thuẫn**, và yêu cầu bắt buộc phải **cưỡng chế bằng settings/hook**.

### Giải thích

Nhiều người suy diễn CLAUDE.md giống CSS hay cấu hình phân cấp: file gần hơn ghi đè file xa hơn. Thực tế, tất cả nội dung được nối vào context như văn bản để model đọc. Model sẽ cố dung hòa các chỉ dẫn, nhưng khi hai chỉ dẫn đối lập (ví dụ file người dùng nói "luôn tạo PR draft", file repo nói "không bao giờ mở PR, chỉ push nhánh") thì không có quy tắc tất định nào quyết định bên thắng. Kết quả có thể khác nhau giữa các lần chạy.

Hệ quả thực hành:

1. **Rà soát mâu thuẫn**: định kỳ đọc các tầng CLAUDE.md (user, project, thư mục con) để đảm bảo không đối nghịch; dùng `/memory` để xem file nào đang được nạp.
2. **Phân vai rõ**: mỗi quy tắc có một "nhà" duy nhất, tránh lặp ở nhiều tầng với biến thể khác nhau.
3. **Cưỡng chế cái bắt buộc ở lớp khác**: nếu một điều kiện phải luôn đúng (không được sửa thư mục `migrations/` đã ship, không được chạy lệnh nguy hiểm), đừng trông vào văn bản trong CLAUDE.md. Dùng `permissions` trong settings (allow/deny), **hook** (ví dụ PreToolUse chặn lệnh), hoặc kiểm tra trong CI.

Nguyên lý chung của kỳ thi: hướng dẫn trong prompt/context là **xác suất**; cơ chế ở lớp code/cấu hình mới là **đảm bảo**. Nếu đề nhấn mạnh "phải luôn", "không bao giờ", "tuân thủ bắt buộc" thì đáp án thường là hook/settings/CI chứ không phải viết rõ hơn trong CLAUDE.md.

### Keyword

- `no deterministic precedence` — không có thứ tự ưu tiên xác định giữa các file CLAUDE.md
- `concatenation` — các file được nối vào context, không ghi đè nhau
- `conflicting instructions` — chỉ dẫn mâu thuẫn giữa các tầng
- `hook` — đoạn lệnh chạy ở điểm cố định của vòng đời, dùng để cưỡng chế chính sách
- `permissions deny` — quy tắc trong settings để chặn tool/lệnh một cách chắc chắn
- `/memory` — lệnh xem và sửa các file memory (CLAUDE.md) đang được nạp
- `enforcement` — cưỡng chế bằng cơ chế, khác với "hướng dẫn" bằng lời

### Bẫy đề thi

- ✗ Giả định file CLAUDE.md gần nhất/cụ thể nhất luôn ghi đè file khác ⇒ ✓ Không có override tất định; hãy gỡ mâu thuẫn
- ✗ Thêm "IMPORTANT, NEVER..." in hoa vào CLAUDE.md để đảm bảo tuân thủ ⇒ ✓ Dùng hook/settings/CI cho yêu cầu bắt buộc
- ✗ Để cả file user và file repo cùng quy định một việc theo hai cách ⇒ ✓ Mỗi quy tắc có một nơi duy nhất

### Câu hỏi

#### Q1. File `~/.claude/CLAUDE.md` của một dev ghi "luôn tạo commit message tiếng Việt", còn CLAUDE.md của repo ghi "commit message bắt buộc tiếng Anh, theo Conventional Commits". Dev này báo Claude lúc viết tiếng Việt lúc tiếng Anh. Giải thích và cách xử lý nào đúng?
- A. Bug ngẫu nhiên của model; tăng nhiệt độ sampling xuống 0 sẽ sửa
- B. File ở home luôn thắng nên Claude phải luôn viết tiếng Việt; chỉ cần khởi động lại
- C. Hai chỉ dẫn mâu thuẫn được nối vào context và không có precedence xác định; cần xoá mâu thuẫn, và nếu bắt buộc thì kiểm tra bằng hook/CI
- D. File repo luôn thắng vì cụ thể hơn; mâu thuẫn không bao giờ gây vấn đề

**Đáp án:** C

**Giải thích:** CLAUDE.md không có cơ chế ghi đè tất định, nên chỉ dẫn đối nghịch cho kết quả không ổn định. Cách đúng là loại bỏ mâu thuẫn và, vì quy ước commit là bắt buộc, thêm kiểm tra bằng hook (ví dụ commit-msg) hoặc CI. A sai vì vấn đề nằm ở nội dung mâu thuẫn. B và D đều khẳng định một thứ tự ưu tiên không được đảm bảo.

#### Q2. Policy công ty: Claude Code tuyệt đối không được sửa thư mục `db/migrations/` đã release. Hiện policy chỉ được viết trong CLAUDE.md và thỉnh thoảng bị vi phạm. Thay đổi nào đáng tin cậy nhất?
- A. Viết lại câu cấm bằng chữ in hoa và lặp ở ba file CLAUDE.md
- B. Thêm hook PreToolUse/quy tắc deny trong settings chặn chỉnh sửa vào đường dẫn đó
- C. Thêm ví dụ về việc không sửa migrations vào CLAUDE.md
- D. Nhắc Claude "hãy cẩn thận" ở đầu mỗi phiên làm việc

**Đáp án:** B

**Giải thích:** Yêu cầu "tuyệt đối" cần cơ chế cưỡng chế ở lớp cấu hình/code: hook hoặc permissions deny sẽ chặn tool call bất kể model "nghĩ" gì. A, C, D đều chỉ là thêm văn bản vào context, vẫn mang tính xác suất, và việc lặp ở nhiều file còn có thể gây thêm mâu thuẫn.

## K4. Chia nhỏ CLAUDE.md bằng `@path` imports

### Trọng tâm

Khi CLAUDE.md phình to, hãy tách thành các file Markdown tập trung rồi tham chiếu bằng cú pháp **`@path/to/file.md`**. Không có từ khóa `@import`.

### Giải thích

CLAUDE.md dài hàng trăm dòng gây hai vấn đề: khó bảo trì (nhiều người sửa cùng file, dễ mâu thuẫn) và tốn context vì mọi thứ nạp ở đầu mỗi phiên, kể cả phần ít liên quan. Giải pháp của Claude Code là **import**: trong CLAUDE.md viết một dòng bắt đầu bằng `@` theo sau là đường dẫn, và nội dung file đó được đưa vào cùng context.

```markdown
# Project guide
Xem tổng quan kiến trúc: @docs/architecture.md
Quy ước test: @docs/standards/testing.md
Quy ước Git: @docs/standards/git-workflow.md
Sở thích cá nhân của tôi: @~/.claude/my-project-preferences.md
```

Điểm cần nhớ:

- Cú pháp là `@đường/dẫn`; đường dẫn tương đối được tính **so với file chứa lệnh import**, và cũng có thể trỏ đến thư mục home (`@~/...`).
- Import có thể lồng nhau nhưng độ sâu có giới hạn (vài tầng), nên đừng thiết kế chuỗi import quá dài.
- Mục tiêu chính là **tổ chức module hóa và tái sử dụng** (một file chuẩn dùng cho nhiều dự án, hoặc để từng nhóm sở hữu một file). Import không phải cơ chế "nạp có điều kiện": file được import vẫn vào context khi file cha được nạp. Nếu muốn chỉ nạp khi chạm tới một loại file nhất định, dùng path-specific rules (bài 3.3).
- Không tồn tại `@import file.md`, `#include` hay `import:` trong CLAUDE.md; các đáp án dạng này trong đề là cú pháp bịa.

Quy trình hợp lý: giữ CLAUDE.md gốc ngắn (lệnh thường dùng, mục lục), đẩy chi tiết vào file con theo chủ đề; mỗi chủ đề một file để review và sở hữu rõ ràng.

### Keyword

- `@path import` — cú pháp `@đường/dẫn` trong CLAUDE.md để đưa nội dung file khác vào context
- `modular organisation` — tổ chức module hóa hướng dẫn thành nhiều file nhỏ
- `relative path resolution` — đường dẫn import tính từ vị trí file chứa dòng import
- `import depth limit` — giới hạn số tầng import lồng nhau
- `single source of truth` — một nguồn chuẩn duy nhất cho mỗi quy tắc
- `fictional @import` — từ khóa không tồn tại, hay xuất hiện làm đáp án nhiễu

### Bẫy đề thi

- ✗ Viết `@import docs/testing.md` hoặc `#include` ⇒ ✓ Dùng `@docs/testing.md`
- ✗ Nghĩ import chỉ nạp file khi cần ⇒ ✓ File import vào context cùng file cha; muốn nạp theo loại file dùng `paths` rules
- ✗ Giải quyết CLAUDE.md quá dài bằng cách cắt bỏ quy ước ⇒ ✓ Tách thành các file tập trung và import

### Câu hỏi

#### Q1. CLAUDE.md gốc đã lên 600 dòng gồm kiến trúc, quy ước test, quy ước Git, hướng dẫn deploy; nhiều người sửa gây xung đột merge. Cách tổ chức lại tốt nhất?
- A. Đổi tên thành `CLAUDE_FULL.md` để Claude đọc chậm hơn
- B. Xoá các phần ít dùng và nhớ trong đầu
- C. Tách mỗi chủ đề thành file riêng trong `docs/` và tham chiếu bằng `@docs/<file>.md` từ CLAUDE.md ngắn gọn
- D. Dùng cú pháp `@import docs/testing.md` để tải mô-đun

**Đáp án:** C

**Giải thích:** Tách theo chủ đề và dùng `@path` giúp mỗi file có chủ sở hữu, giảm xung đột merge và dễ bảo trì. A không giải quyết gì. B làm mất tri thức của team. D dùng từ khóa không tồn tại; cú pháp đúng chỉ là `@đường/dẫn`.

#### Q2. Một dev nói: "Tôi import `@docs/terraform.md` vào CLAUDE.md, vậy nó chỉ được nạp khi Claude sửa file `.tf`, đúng không?" Câu trả lời chính xác?
- A. Đúng, import luôn có điều kiện theo loại file
- B. Sai; file import vào context cùng CLAUDE.md. Muốn nạp có điều kiện theo file thì dùng `.claude/rules` với `paths`
- C. Đúng, nhưng chỉ khi file có đuôi `.md`
- D. Sai; import chỉ hoạt động nếu dùng đường dẫn tuyệt đối

**Đáp án:** B

**Giải thích:** `@path` phục vụ module hóa/tái sử dụng chứ không thêm điều kiện. Điều kiện theo loại file là vai trò của path-specific rules. A và C gán cho import một khả năng nó không có. D bịa ra một ràng buộc; đường dẫn tương đối (so với file chứa import) vẫn dùng được.
