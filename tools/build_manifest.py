#!/usr/bin/env python3
"""Tạo manifest cho trang tĩnh (GitHub Pages không liệt kê được thư mục).

Chạy lại mỗi khi thêm/sửa bài học trong input/ hoặc đề trong question/:
    python3 tools/build_manifest.py
"""
import glob
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT = os.path.join(ROOT, "input")
QUESTION = os.path.join(ROOT, "question")

DOMAINS = [
    {"id": 1, "name": "Agentic Architecture & Orchestration", "weight": 27},
    {"id": 2, "name": "Tool Design & MCP Integration", "weight": 18},
    {"id": 3, "name": "Claude Code Configuration & Workflows", "weight": 20},
    {"id": 4, "name": "Prompt Engineering & Structured Output", "weight": 20},
    {"id": 5, "name": "Context Management & Reliability", "weight": 15},
]


def build_lessons():
    lessons = []
    for path in sorted(glob.glob(os.path.join(INPUT, "*.md"))):
        name = os.path.basename(path)
        with open(path, encoding="utf-8") as f:
            first = f.readline().strip()
        m = re.match(r"#\s*(\d+)\.(\d+)\s*[—-]\s*(.+)", first)
        if not m:
            continue
        lessons.append({
            "id": os.path.splitext(name)[0],
            "file": name,
            "domain": int(m.group(1)),
            "code": f"{m.group(1)}.{m.group(2)}",
            "title": m.group(3).strip(),
        })
    lessons.sort(key=lambda l: tuple(int(x) for x in l["code"].split(".")))
    out = {"domains": DOMAINS, "lessons": lessons}
    with open(os.path.join(INPUT, "index.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"input/index.json: {len(lessons)} lessons")


def build_exams():
    exams = []
    for path in sorted(glob.glob(os.path.join(QUESTION, "mock-*.json"))):
        try:
            with open(path, encoding="utf-8") as f:
                d = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            print(f"  skip {os.path.basename(path)}: {e}")
            continue
        exams.append({
            "examId": d["examId"],
            "title": d["title"],
            "file": os.path.basename(path),
            "totalQuestions": len(d["questions"]),
            "durationMinutes": d.get("durationMinutes", 120),
            "scenarios": [s["title"] for s in d.get("scenarios", [])],
        })
    out = {"passingScore": 720, "scoreScale": 1000, "domains": DOMAINS, "exams": exams}
    with open(os.path.join(QUESTION, "index.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"question/index.json: {len(exams)} exams")


def build_bundle():
    """Gói mọi file dữ liệu vào assets/data.js để trang chạy được cả khi mở bằng file://."""
    files = {}
    for folder, pattern in (("input", "*.md"), ("input", "index.json"), ("question", "*.json")):
        for path in sorted(glob.glob(os.path.join(ROOT, folder, pattern))):
            with open(path, encoding="utf-8") as f:
                files[f"{folder}/{os.path.basename(path)}"] = f.read()
    with open(os.path.join(ROOT, "assets", "data.js"), "w", encoding="utf-8") as f:
        f.write("window.CCARF_FILES = ")
        json.dump(files, f, ensure_ascii=False)
        f.write(";\n")
    print(f"assets/data.js: {len(files)} files")


if __name__ == "__main__":
    build_lessons()
    build_exams()
    build_bundle()
