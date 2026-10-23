#!/usr/bin/env python3
"""Kiểm tra bài học trong input/ theo định dạng mới.

    python tools/validate_lessons.py                 # tất cả bài
    python tools/validate_lessons.py 1-2 1-3         # theo prefix tên file
"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUBS = ["Trọng tâm", "Giải thích", "Keyword", "Bẫy đề thi", "Câu hỏi"]


def check(path):
    errs = []
    t = open(path, encoding="utf-8").read().replace("\r\n", "\n")
    # che dòng trong code fence để "## ..." trong code không bị coi là heading
    t = re.sub(r"```.*?```", lambda m: m.group(0).replace("\n", "\n\u0001"), t, flags=re.S)
    if not re.match(r"# \d+\.\d+ — .+", t):
        errs.append("dòng 1 phải là '# N.M — Tiêu đề'")
    blocks = re.split(r"^## ", t, flags=re.M)[1:]
    heads = [b.split("\n")[0].strip() for b in blocks]
    if not heads or not heads[0].startswith("Tổng quan"):
        errs.append("thiếu '## Tổng quan' ở đầu")
    extra = [h for h in heads if not (h.startswith("Tổng quan") or re.match(r"K\d+\.", h))]
    if extra:
        errs.append(f"không dùng mục ngoài Tổng quan và K1..Kn (bỏ: {extra})")
    ks = [b for b in blocks if re.match(r"K\d+\.", b)]
    if not 3 <= len(ks) <= 6:
        errs.append(f"cần 3–6 mục K, đang có {len(ks)}")
    for n, b in enumerate(ks, 1):
        name = b.split("\n")[0].strip()
        if not name.startswith(f"K{n}."):
            errs.append(f"{name}: đánh số K phải liên tục (mong K{n})")
        subs = {}
        for s in re.split(r"^### ", b, flags=re.M)[1:]:
            subs[s.split("\n")[0].strip()] = s.split("\n", 1)[1] if "\n" in s else ""
        if list(subs) != SUBS:
            errs.append(f"{name}: các mục ### phải đúng thứ tự {SUBS}, đang có {list(subs)}")
            continue
        if len(subs["Giải thích"].split()) < 90:
            errs.append(f"{name}: phần Giải thích quá ngắn (<90 từ)")
        kw = [l for l in subs["Keyword"].split("\n") if l.startswith("- ")]
        if len(kw) < 4 or any(" — " not in l for l in kw):
            errs.append(f"{name}: Keyword cần ≥4 dòng dạng '- term — nghĩa tiếng Việt'")
        tr = [l for l in subs["Bẫy đề thi"].split("\n") if l.startswith("- ")]
        if len(tr) < 2 or any("⇒" not in l for l in tr):
            errs.append(f"{name}: Bẫy đề thi cần ≥2 dòng dạng '- ✗ sai ⇒ ✓ đúng'")
        qs = re.split(r"^#### ", subs["Câu hỏi"], flags=re.M)[1:]
        if len(qs) < 2:
            errs.append(f"{name}: cần ≥2 câu hỏi")
        for q in qs:
            qn = q.split("\n")[0][:20]
            opts = re.findall(r"^- ([A-D])\. .+$", q, flags=re.M)
            ans = re.search(r"\*\*Đáp án:\*\* ([A-D])\s*$", q, flags=re.M)
            if opts != list("ABCD"):
                errs.append(f"{name} {qn}: cần đúng 4 lựa chọn A–D, mỗi dòng '- A. ...'")
            if not ans:
                errs.append(f"{name} {qn}: thiếu '**Đáp án:** X'")
            if "**Giải thích:**" not in q:
                errs.append(f"{name} {qn}: thiếu '**Giải thích:**'")
    return errs


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    prefixes = sys.argv[1:]
    files = sorted(glob.glob(os.path.join(ROOT, "input", "*.md")))
    if prefixes:
        files = [f for f in files if any(os.path.basename(f).startswith(p) for p in prefixes)]
    bad = 0
    for f in files:
        errs = check(f)
        print(("FAIL " if errs else "OK   ") + os.path.basename(f))
        for e in errs:
            print("   -", e)
        bad += bool(errs)
    print(f"{len(files) - bad}/{len(files)} đạt")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
