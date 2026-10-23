/* CCAR-F Study Hub — static SPA (GitHub Pages friendly). */
(() => {
  "use strict";

  const PASS = 720;
  const SCALE = 1000;
  const SEC_PER_Q = 120; // đề thật: 60 câu / 120 phút
  const FRACTIONS = [
    { k: 6, label: "1/6" }, { k: 5, label: "1/5" }, { k: 4, label: "1/4" },
    { k: 3, label: "1/3" }, { k: 2, label: "1/2" }, { k: 1, label: "Full" },
  ];
  const DOMAIN_COLORS = ["", "var(--d1)", "var(--d2)", "var(--d3)", "var(--d4)", "var(--d5)"];

  const $ = (sel, root = document) => root.querySelector(sel);
  const main = $("#main");
  const sidebar = $("#sidebar");
  const layout = $("#layout");

  /* ---------- storage (an toàn khi bị chặn) ---------- */
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem("ccarf." + key); return v == null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("ccarf." + key, JSON.stringify(value)); } catch { /* ignore */ }
    },
    del(key) { try { localStorage.removeItem("ccarf." + key); } catch { /* ignore */ } },
  };

  /* ---------- data ---------- */
  const cache = new Map();
  async function fetchText(url) {
    if (cache.has(url)) return cache.get(url);
    const bundled = window.CCARF_FILES?.[decodeURIComponent(url)];
    if (bundled != null) { cache.set(url, bundled); return bundled; }
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const text = await res.text();
    cache.set(url, text);
    return text;
  }
  const fetchJSON = async (url) => JSON.parse(await fetchText(url));

  let lessonIndex = null; // {domains, lessons}
  let examIndex = null;   // {exams, domains}
  async function loadLessonIndex() {
    if (!lessonIndex) lessonIndex = await fetchJSON("input/index.json");
    return lessonIndex;
  }
  async function loadExamIndex() {
    if (!examIndex) {
      try { examIndex = await fetchJSON("question/index.json"); }
      catch { examIndex = { exams: [] }; }
    }
    return examIndex;
  }
  const loadExam = (file) => fetchJSON("question/" + file);

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fmtTime = (sec) => {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const mm = String(m).padStart(2, "0"), ss = String(s).padStart(2, "0");
    return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  };
  const fmtDate = (ts) => new Date(ts).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
  const domainName = (id) => (lessonIndex?.domains || examIndex?.domains || []).find((d) => d.id === id)?.name || `Domain ${id}`;

  // Định dạng nhẹ cho text câu hỏi: escape HTML, hỗ trợ ```code```, `code`, **bold**, xuống dòng.
  function fmt(text) {
    const blocks = [];
    let s = String(text ?? "").replace(/```[a-zA-Z0-9_-]*\n?([\s\S]*?)```/g, (_, code) => {
      blocks.push(`<pre><code>${esc(code.replace(/\n$/, ""))}</code></pre>`);
      return `\u0000${blocks.length - 1}\u0000`;
    });
    s = esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    s = s.split(/\n{2,}/).map((p) => {
      const t = p.trim();
      if (/^\u0000\d+\u0000$/.test(t)) return t;
      return `<p>${t.replace(/\n/g, "<br>")}</p>`;
    }).join("");
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[+i]);
  }
  const fmtInline = (text) => fmt(text).replace(/^<p>([\s\S]*)<\/p>$/, "$1");

  function setMode(mode, withSidebar) {
    document.querySelectorAll(".modes a").forEach((a) => a.classList.toggle("active", a.dataset.mode === mode));
    layout.classList.toggle("no-sidebar", !withSidebar);
    layout.classList.remove("drawer-open");
  }

  /* ---------- theme & drawer ---------- */
  const applyTheme = (t) => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; };
  applyTheme(store.get("theme", null));
  $("#themeBtn").addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme
      || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    applyTheme(next); store.set("theme", next);
  });
  $("#menuBtn").addEventListener("click", () => layout.classList.toggle("drawer-open"));
  $("#scrim").addEventListener("click", () => layout.classList.remove("drawer-open"));

  /* =====================================================================
   * 1. HỌC LÝ THUYẾT
   * ===================================================================*/
  function renderSidebar(activeId, toc) {
    const { domains, lessons } = lessonIndex;
    const done = new Set(store.get("done", []));
    const collapsed = new Set(store.get("collapsed", []));
    const q = (store.get("search", "") || "").toLowerCase();
    const pct = Math.round((done.size / lessons.length) * 100);

    let html = `<input class="side-search" id="sideSearch" type="search" placeholder="Tìm bài học…" value="${esc(q)}">
      <div class="side-progress">Đã học ${done.size}/${lessons.length} bài (${pct}%)<div class="bar"><i style="width:${pct}%"></i></div></div>`;
    for (const d of domains) {
      const items = lessons.filter((l) => l.domain === d.id && (!q || (l.code + " " + l.title).toLowerCase().includes(q)));
      if (!items.length) continue;
      const isCollapsed = collapsed.has(d.id) && !q && !items.some((l) => l.id === activeId);
      html += `<div class="domain-group${isCollapsed ? " collapsed" : ""}" data-domain="${d.id}">
        <button class="domain-head" data-toggle="${d.id}">
          <svg class="chev" width="12" height="12" viewBox="0 0 12 12"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
          <span class="dot" style="background:${DOMAIN_COLORS[d.id]}"></span>
          <span>D${d.id}. ${esc(d.name)}</span><span class="w">${d.weight}%</span>
        </button><ul class="lesson-list">`;
      for (const l of items) {
        html += `<li><a class="lesson-link${l.id === activeId ? " active" : ""}" href="#/learn/${l.id}">
          <span class="code">${l.code}</span><span>${esc(l.title)}</span>${done.has(l.id) ? '<span class="done">✓</span>' : ""}</a>`;
        if (l.id === activeId && toc?.length) {
          html += `<ul class="toc">${toc.map((t) => `<li><a href="#" data-scroll="${t.id}">${esc(t.text)}</a></li>`).join("")}</ul>`;
        }
        html += `</li>`;
      }
      html += `</ul></div>`;
    }
    sidebar.innerHTML = html;

    const search = $("#sideSearch");
    search.addEventListener("input", () => {
      store.set("search", search.value);
      const pos = search.selectionStart;
      renderSidebar(activeId, toc);
      const s2 = $("#sideSearch"); s2.focus(); s2.setSelectionRange(pos, pos);
    });
    sidebar.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => {
      const id = +b.dataset.toggle;
      const set = new Set(store.get("collapsed", []));
      set.has(id) ? set.delete(id) : set.add(id);
      store.set("collapsed", [...set]);
      b.parentElement.classList.toggle("collapsed");
    }));
    sidebar.querySelectorAll("[data-scroll]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(a.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
      layout.classList.remove("drawer-open");
    }));
    sidebar.querySelectorAll(".lesson-link").forEach((a) => a.addEventListener("click", () => layout.classList.remove("drawer-open")));
  }

  // Gom các node từ `start` tới heading kế tiếp (cùng cấp hoặc cao hơn) vào wrapper.
  function wrapUntil(start, stopTags, wrapper) {
    start.before(wrapper);
    let n = start;
    while (n && !(n !== start && n.nodeType === 1 && stopTags.includes(n.tagName))) {
      const next = n.nextSibling;
      wrapper.appendChild(n);
      n = next;
    }
    return wrapper;
  }

  function enhanceLesson(root) {
    const toc = [];
    root.querySelectorAll("h2, h3").forEach((h) => { h.id = slug(h.textContent).slice(0, 60) || "s"; });
    root.querySelectorAll("h2").forEach((h) => toc.push({ id: h.id, text: h.textContent.replace(/\s*\/.*$/, "") }));

    for (const h2 of [...root.querySelectorAll("h2")]) {
      const title = h2.textContent.toLowerCase();
      const h3s = [];
      for (let n = h2.nextElementSibling; n && n.tagName !== "H2"; n = n.nextElementSibling) if (n.tagName === "H3") h3s.push(n);

      if (/^2\./.test(title)) {
        h3s.forEach((h3) => wrapUntil(h3, ["H2", "H3"], Object.assign(document.createElement("div"), { className: "concept-card" })));
      }

      if (title.includes("practice")) {
        h3s.forEach((h3) => {
          const card = wrapUntil(h3, ["H2", "H3"], Object.assign(document.createElement("div"), { className: "practice-q" }));
          const ansP = [...card.children].find((el) => el.tagName === "P" && /^Đáp án/i.test(el.textContent.trim()));
          if (!ansP) return;
          const answer = (ansP.textContent.match(/Đáp án:\s*([A-D])/) || [])[1];
          const details = document.createElement("details");
          details.innerHTML = "<summary>Xem đáp án &amp; giải thích</summary>";
          ansP.before(details);
          let n = ansP;
          while (n) { const next = n.nextSibling; details.appendChild(n); n = next; }
          const opts = card.querySelector(":scope > ul");
          if (!opts || !answer) return;
          opts.querySelectorAll(":scope > li").forEach((li) => {
            const key = (li.textContent.trim().match(/^([A-D])\./) || [])[1];
            li.addEventListener("click", () => {
              opts.querySelectorAll("li").forEach((x) => x.classList.remove("picked-ok", "picked-bad", "is-answer"));
              li.classList.add(key === answer ? "picked-ok" : "picked-bad");
              if (key !== answer) [...opts.children].find((x) => x.textContent.trim().startsWith(answer + "."))?.classList.add("is-answer");
              details.open = true;
            });
          });
        });
      }
    }
    return toc;
  }

  /* ---------- Render bài học (định dạng: Tổng quan → K1..Kn → Tóm tắt) ---------- */
  // Inline: escape + `code`, **bold**.
  // Tách code span trước để `**/*.ts` không bị hiểu nhầm là bold.
  const inl = (s) => esc(s).split(/(`[^`]+`)/).map((t, i) => (i % 2 ? `<code>${t.slice(1, -1)}</code>` : t.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>"))).join("");
  const md2 = (s) => marked.parse(String(s ?? "").trim());
  const bullets = (text) => String(text ?? "").split("\n").filter((l) => /^\s*-\s+/.test(l)).map((l) => l.replace(/^\s*-\s+/, "").trim());

  function renderQuestions(text, md2) {
    return String(text ?? "").split(/^#### /m).slice(1).map((q, i) => {
      const first = q.search(/^- [A-D]\.\s/m);
      const stem = q.slice(0, first < 0 ? q.length : first).replace(/^Q\d+\.\s*/, "");
      const opts = [...q.matchAll(/^- ([A-D])\.\s*(.+)$/gm)];
      const answer = (q.match(/\*\*Đáp án:\*\*\s*([A-D])/) || [])[1] || "";
      const exp = (q.match(/\*\*Giải thích:\*\*\s*([\s\S]*)$/) || [])[1] || "";
      return `<div class="practice-q" data-answer="${answer}">
        <div class="qstem"><span class="num">Câu ${i + 1}</span>${md2(stem)}</div>
        <ul class="opts-list">${opts.map((o) => `<li data-k="${o[1]}"><span class="k">${o[1]}</span><span>${inl(o[2])}</span></li>`).join("")}</ul>
        <details><summary>Xem đáp án &amp; giải thích</summary>
          <p class="ans">Đáp án đúng: <b>${answer}</b></p>${md2(exp)}</details></div>`;
    }).join("");
  }

  // Che nội dung trong ``` ``` để dòng bắt đầu bằng "#" trong code không bị tách nhầm thành heading.
  const maskFences = (md, fences) => md.replace(/```[\s\S]*?```/g, (m) => `\u0001${fences.push(m) - 1}\u0001`);
  const unmask = (s, fences) => s.replace(/\u0001(\d+)\u0001/g, (_, i) => fences[+i]);

  function renderLesson(rawMd) {
    const fences = [];
    const md = maskFences(rawMd.replace(/\r\n?/g, "\n"), fences);
    const md2 = (s) => marked.parse(unmask(String(s ?? "").trim(), fences));
    const titleM = md.match(/^#\s*(\d+\.\d+)\s*[—-]\s*(.+)/m);
    const blocks = md.split(/^## /m).slice(1);
    if (!titleM || !blocks.some((b) => /^K\d+\./.test(b))) return null; // bài chưa theo định dạng mới → dùng marked
    const toc = [];
    let html = `<h1><span class="code-tag">${esc(titleM[1])}</span>${esc(titleM[2].trim())}</h1>`;

    for (const b of blocks) {
      const nl = b.indexOf("\n");
      const heading = b.slice(0, nl).trim(), body = b.slice(nl + 1);
      const km = heading.match(/^(K\d+)\.\s*(.+)/);
      if (km) {
        const id = km[1].toLowerCase();
        toc.push({ id, text: `${km[1]}. ${km[2]}` });
        const subs = {};
        body.split(/^### /m).slice(1).forEach((x) => { const k = x.indexOf("\n"); subs[x.slice(0, k).trim().toLowerCase()] = x.slice(k + 1).trim(); });
        const kw = bullets(subs["keyword"]).map((l) => {
          const [term, ...rest] = l.split(/\s+[—–]\s+/);
          return `<tr><th>${esc(term.replace(/`/g, ""))}</th><td>${inl(rest.join(" — "))}</td></tr>`;
        }).join("");
        const traps = bullets(subs["bẫy đề thi"]).map((l) => {
          const [bad, good] = l.split("⇒");
          return good
            ? `<li class="trap"><div class="do-dont"><div class="dont"><span class="lbl">✗ Dễ nhầm</span>${inl(bad.replace(/^✗\s*/, ""))}</div><div class="do"><span class="lbl">✓ Đúng</span>${inl(good.replace(/^\s*✓\s*/, ""))}</div></div></li>`
            : `<li class="trap">${inl(l)}</li>`;
        }).join("");
        html += `<section class="ls k-card" id="${id}">
          <h2><span class="num">${km[1]}</span>${esc(km[2])}</h2>
          ${subs["trọng tâm"] ? `<div class="focus"><span class="lbl">Kiến thức trọng tâm</span>${md2(subs["trọng tâm"])}</div>` : ""}
          ${subs["giải thích"] ? `<div class="k-sec"><h3>Giải thích chi tiết</h3>${md2(subs["giải thích"])}</div>` : ""}
          ${kw ? `<div class="k-sec"><h3>Keyword</h3><div class="table-wrap"><table class="kw"><tbody>${kw}</tbody></table></div></div>` : ""}
          ${traps ? `<div class="k-sec"><h3>Bẫy đề thi</h3><ul class="traps">${traps}</ul></div>` : ""}
          ${subs["câu hỏi"] ? `<div class="k-sec"><h3>Câu hỏi luyện tập</h3>${renderQuestions(subs["câu hỏi"], md2)}</div>` : ""}
        </section>`;
      } else if (/^Tổng quan/i.test(heading)) {
        html += `<section class="ls" id="overview"><div class="callout">${md2(body)}</div></section>`;
      }
    }
    return { html, toc };
  }

  function bindPractice(root) {
    root.querySelectorAll(".practice-q").forEach((card) => {
      const answer = card.dataset.answer;
      const details = card.querySelector("details");
      const items = [...card.querySelectorAll(".opts-list li")];
      items.forEach((li) => li.addEventListener("click", () => {
        items.forEach((x) => x.classList.remove("picked-ok", "picked-bad", "is-answer"));
        li.classList.add(li.dataset.k === answer ? "picked-ok" : "picked-bad");
        if (li.dataset.k !== answer) items.find((x) => x.dataset.k === answer)?.classList.add("is-answer");
        details.open = true;
      }));
    });
  }

  async function showLesson(id) {
    setMode("learn", true);
    await loadLessonIndex();
    const { lessons } = lessonIndex;
    const lesson = lessons.find((l) => l.id === id) || lessons.find((l) => l.id === store.get("lastLesson")) || lessons[0];
    if (lesson.id !== id) { location.replace("#/learn/" + lesson.id); return; }
    store.set("lastLesson", lesson.id);
    renderSidebar(lesson.id);
    main.innerHTML = `<div class="loading">Đang tải bài học…</div>`;

    let md;
    try { md = await fetchText("input/" + encodeURIComponent(lesson.file)); }
    catch (e) { main.innerHTML = `<div class="empty">Không tải được bài học (${esc(e.message)}).</div>`; return; }

    const idx = lessons.indexOf(lesson);
    const prev = lessons[idx - 1], next = lessons[idx + 1];
    const done = new Set(store.get("done", []));
    const d = lessonIndex.domains.find((x) => x.id === lesson.domain);
    const rendered = window.marked ? renderLesson(md) : null;

    main.innerHTML = `<div class="container">
      <div class="lesson-meta">
        <span class="chip dom" style="background:${DOMAIN_COLORS[lesson.domain]}">Domain ${lesson.domain} · ${d?.weight ?? ""}%</span>
        <span class="chip">${esc(d?.name || "")}</span>
      </div>
      <article class="prose" id="lessonBody">${rendered ? rendered.html : window.marked ? marked.parse(md) : `<pre>${esc(md)}</pre>`}</article>
      <div class="btn-row" style="margin-top:28px">
        <button class="btn ${done.has(lesson.id) ? "" : "primary"}" id="doneBtn">${done.has(lesson.id) ? "✓ Đã học — bỏ đánh dấu" : "Đánh dấu đã học"}</button>
        <a class="btn" href="#/mock">Luyện đề →</a>
      </div>
      <nav class="lesson-nav">
        ${prev ? `<a href="#/learn/${prev.id}"><small>← Bài trước</small>${prev.code} ${esc(prev.title)}</a>` : "<span></span>"}
        ${next ? `<a class="next" href="#/learn/${next.id}"><small>Bài tiếp →</small>${next.code} ${esc(next.title)}</a>` : "<span></span>"}
      </nav></div>`;

    let toc;
    if (rendered) { bindPractice($("#lessonBody")); toc = rendered.toc; }
    else toc = enhanceLesson($("#lessonBody"));
    renderSidebar(lesson.id, toc);
    $("#doneBtn").addEventListener("click", () => {
      const s = new Set(store.get("done", []));
      s.has(lesson.id) ? s.delete(lesson.id) : s.add(lesson.id);
      store.set("done", [...s]);
      showLesson(lesson.id);
    });
    window.scrollTo(0, 0);
  }

  /* =====================================================================
   * 2. LUYỆN ĐỀ
   * ===================================================================*/
  // Chia đề thành k phần, mỗi phần giữ tỷ trọng domain (round-robin theo domain).
  function partition(questions, k) {
    const sorted = [...questions].sort((a, b) => a.domain - b.domain || a.number - b.number);
    const parts = Array.from({ length: k }, () => []);
    sorted.forEach((q, i) => parts[i % k].push(q));
    return parts.map((p) => p.sort((a, b) => a.number - b.number));
  }

  const attempts = () => store.get("attempts", []);
  const scaled = (correct, total) => (total ? Math.round((correct / total) * SCALE) : 0);

  async function showMockSetup() {
    setMode("mock", false);
    main.innerHTML = `<div class="loading">Đang tải danh sách đề…</div>`;
    await Promise.all([loadExamIndex(), loadLessonIndex().catch(() => null)]);
    const exams = examIndex.exams || [];
    const hist = attempts();
    const session = store.get("session", null);
    const cfg = store.get("setup", { file: exams[0]?.file, k: 1, part: 1 });
    if (!exams.some((e) => e.file === cfg.file)) cfg.file = exams[0]?.file;

    const render = () => {
      const exam = exams.find((e) => e.file === cfg.file);
      const total = exam?.totalQuestions || 60;
      const k = cfg.k, part = Math.min(cfg.part, k);
      const n = Math.floor(total / k) + (part - 1 < total % k ? 1 : 0);
      const doneParts = new Set(hist.filter((a) => a.file === cfg.file && a.k === k).map((a) => a.part));

      main.innerHTML = `<div class="container">
        <h1 class="page-title">Luyện đề mock</h1>
        <p class="page-sub">Mô phỏng đề thật: 60 câu · 120 phút · đạt ${PASS}/${SCALE}. Chọn một phần đề nếu bạn chỉ có ít thời gian — mỗi phần vẫn giữ đúng tỷ trọng các domain.</p>
        ${session ? `<div class="resume-box"><div><b>Bài đang làm dở:</b> ${esc(session.title)} — ${esc(session.partLabel)}<br>
          <small>Đã trả lời ${Object.keys(session.answers).length}/${session.qids.length} · còn ${fmtTime((session.endsAt - Date.now()) / 1000)}</small></div>
          <div class="btn-row"><a class="btn primary" href="#/exam">Tiếp tục</a><button class="btn" id="dropSession">Huỷ bài</button></div></div>` : ""}
        ${exams.length ? `<div class="exam-grid">${exams.map((e) => {
          const mine = hist.filter((a) => a.file === e.file);
          const best = mine.length ? Math.max(...mine.map((a) => a.score)) : null;
          return `<button class="exam-card${e.file === cfg.file ? " selected" : ""}" data-file="${esc(e.file)}">
            <h3>${esc(e.title)}</h3>
            <div class="meta">${e.totalQuestions} câu · ${e.durationMinutes} phút</div>
            <div class="meta">${esc((e.scenarios || []).join(" · "))}</div>
            <div class="best">${best == null ? '<span style="color:var(--muted)">Chưa làm</span>' : `${mine.length} lần · cao nhất <span class="${best >= PASS ? "pass" : "fail"}">${best}</span>`}</div>
          </button>`;
        }).join("")}</div>` : `<div class="empty">Chưa có đề nào trong <code>question/index.json</code>. Chạy <code>python3 tools/build_manifest.py</code>.</div>`}
        ${exam ? `<div class="panel">
          <h2>Thiết lập: ${esc(exam.title)}</h2>
          <div class="field-label">Lượng đề muốn làm</div>
          <div class="seg" id="fracSeg">${FRACTIONS.map((f) => {
            const fn = Math.round(total / f.k);
            return `<button data-k="${f.k}" class="${f.k === k ? "active" : ""}">${f.label}<small>~${fn} câu · ${Math.round((fn * SEC_PER_Q) / 60)}′</small></button>`;
          }).join("")}</div>
          ${k > 1 ? `<div class="field-label">Chọn phần (làm lần lượt các phần để phủ hết đề)</div>
            <div class="seg" id="partSeg">${Array.from({ length: k }, (_, i) => `<button data-part="${i + 1}" class="${i + 1 === part ? "active" : ""}">Phần ${i + 1}${doneParts.has(i + 1) ? " ✓" : ""}</button>`).join("")}</div>` : ""}
          <div class="summary-line">
            <div><b>${n}</b>câu hỏi</div>
            <div><b>${fmtTime(n * SEC_PER_Q)}</b>thời gian</div>
            <div><b>${PASS}</b>điểm đạt</div>
          </div>
          <button class="btn primary" id="startBtn">Bắt đầu làm bài</button>
        </div>` : ""}
        ${hist.length ? `<div class="panel"><h2>Lịch sử làm bài</h2><div class="history-wrap"><table class="history">
          <thead><tr><th>Thời gian</th><th>Đề</th><th>Phần</th><th>Đúng</th><th>Điểm</th><th></th></tr></thead><tbody>
          ${hist.slice().reverse().map((a) => `<tr><td>${fmtDate(a.finishedAt)}</td><td>${esc(a.title)}</td><td>${esc(a.partLabel)}</td>
            <td>${a.correct}/${a.total}</td><td class="${a.score >= PASS ? "pass" : "fail"}">${a.score}</td>
            <td><a href="#/result/${a.id}">Xem</a></td></tr>`).join("")}
          </tbody></table></div>
          <div class="btn-row" style="margin-top:12px"><button class="btn ghost" id="clearHist">Xoá lịch sử</button></div></div>` : ""}
      </div>`;

      main.querySelectorAll(".exam-card").forEach((b) => b.addEventListener("click", () => { cfg.file = b.dataset.file; cfg.part = 1; store.set("setup", cfg); render(); }));
      main.querySelectorAll("#fracSeg button").forEach((b) => b.addEventListener("click", () => { cfg.k = +b.dataset.k; cfg.part = 1; store.set("setup", cfg); render(); }));
      main.querySelectorAll("#partSeg button").forEach((b) => b.addEventListener("click", () => { cfg.part = +b.dataset.part; store.set("setup", cfg); render(); }));
      $("#dropSession")?.addEventListener("click", () => { if (confirm("Huỷ bài đang làm dở?")) { store.del("session"); showMockSetup(); } });
      $("#clearHist")?.addEventListener("click", () => { if (confirm("Xoá toàn bộ lịch sử làm bài?")) { store.del("attempts"); showMockSetup(); } });
      $("#startBtn")?.addEventListener("click", async () => {
        if (session && !confirm("Bạn đang có bài làm dở. Bắt đầu bài mới sẽ huỷ bài đó. Tiếp tục?")) return;
        const data = await loadExam(exam.file);
        const qs = partition(data.questions, k)[part - 1];
        startSession({
          file: exam.file, examId: data.examId, title: data.title, k, part,
          partLabel: k === 1 ? "Full đề" : `${FRACTIONS.find((f) => f.k === k).label} · Phần ${part}`,
          qids: qs.map((q) => q.id),
        });
      });
    };
    render();
  }

  function startSession(base) {
    const durationSec = base.qids.length * SEC_PER_Q;
    store.set("session", { ...base, answers: {}, flags: {}, current: 0, startedAt: Date.now(), durationSec, endsAt: Date.now() + durationSec * 1000 });
    location.hash = "#/exam";
  }

  let timerHandle = null;
  let keyHandler = null;
  function stopExamListeners() {
    clearInterval(timerHandle); timerHandle = null;
    if (keyHandler) document.removeEventListener("keydown", keyHandler);
    keyHandler = null;
  }

  async function showExam() {
    setMode("mock", false);
    const session = store.get("session", null);
    if (!session) { location.replace("#/mock"); return; }
    main.innerHTML = `<div class="loading">Đang tải đề…</div>`;
    const data = await loadExam(session.file);
    const byId = new Map(data.questions.map((q) => [q.id, q]));
    const qs = session.qids.map((id) => byId.get(id)).filter(Boolean);
    const scen = new Map((data.scenarios || []).map((s) => [s.id, s]));
    const save = () => store.set("session", session);

    const submit = (auto) => {
      stopExamListeners();
      const answers = session.answers;
      const correct = qs.filter((q) => answers[q.id] === q.answer).length;
      const attempt = {
        id: Date.now().toString(36), file: session.file, examId: session.examId, title: session.title,
        k: session.k, part: session.part, partLabel: session.partLabel, qids: session.qids,
        answers, flags: session.flags, correct, total: qs.length, score: scaled(correct, qs.length),
        startedAt: session.startedAt, finishedAt: Date.now(),
        usedSec: Math.min(session.durationSec, Math.round((Date.now() - session.startedAt) / 1000)), auto: !!auto,
      };
      const all = attempts(); all.push(attempt);
      store.set("attempts", all.slice(-100));
      store.del("session");
      location.hash = "#/result/" + attempt.id;
    };

    if (Date.now() >= session.endsAt) { submit(true); return; }

    const render = () => {
      const i = session.current;
      const q = qs[i];
      const s = scen.get(q.scenarioId);
      const answered = Object.keys(session.answers).length;
      main.innerHTML = `<div class="container">
        <div class="exam-bar">
          <span class="timer" id="timer">${fmtTime((session.endsAt - Date.now()) / 1000)}</span>
          <span class="progress">${esc(session.title)} · ${esc(session.partLabel)}<br>Đã trả lời ${answered}/${qs.length}</span>
          <button class="btn primary" id="submitBtn">Nộp bài</button>
        </div>
        ${s ? `<div class="scenario-box"><b>Scenario: ${esc(s.title)}</b>${esc(s.description)}</div>` : ""}
        <div class="qcard">
          <div class="qhead"><span class="qnum">Câu ${i + 1}/${qs.length}</span></div>
          <div class="qtext">${fmt(q.question)}</div>
          <div class="opts">${q.options.map((o) => `<button class="opt${session.answers[q.id] === o.key ? " sel" : ""}" data-key="${o.key}">
            <span class="k">${o.key}</span><span>${fmtInline(o.text)}</span></button>`).join("")}</div>
          <div class="qfoot">
            <button class="btn" id="prevBtn" ${i === 0 ? "disabled" : ""}>← Trước</button>
            <button class="btn flag${session.flags[q.id] ? " on" : ""}" id="flagBtn">⚑ ${session.flags[q.id] ? "Đã gắn cờ" : "Gắn cờ xem lại"}</button>
            <button class="btn" id="nextBtn" ${i === qs.length - 1 ? "disabled" : ""}>Sau →</button>
          </div>
        </div>
        <div class="navgrid">${qs.map((x, j) => `<button data-go="${j}" class="${session.answers[x.id] ? "answered" : ""}${j === i ? " current" : ""}${session.flags[x.id] ? " flagged" : ""}">${j + 1}</button>`).join("")}</div>
        <div class="legend"><span>Phím tắt: A–D hoặc 1–4 chọn đáp án · ←/→ chuyển câu · F gắn cờ</span></div>
      </div>`;

      main.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => choose(b.dataset.key)));
      main.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => go(+b.dataset.go)));
      $("#prevBtn").addEventListener("click", () => go(i - 1));
      $("#nextBtn").addEventListener("click", () => go(i + 1));
      $("#flagBtn").addEventListener("click", toggleFlag);
      $("#submitBtn").addEventListener("click", () => {
        const left = qs.length - Object.keys(session.answers).length;
        const flagged = Object.values(session.flags).filter(Boolean).length;
        let msg = "Nộp bài và xem kết quả?";
        if (left) msg = `Còn ${left} câu chưa trả lời. ` + msg;
        if (flagged) msg = `Có ${flagged} câu đang gắn cờ. ` + msg;
        if (confirm(msg)) submit(false);
      });
    };
    const go = (j) => { if (j < 0 || j >= qs.length) return; session.current = j; save(); render(); window.scrollTo(0, 0); };
    const choose = (key) => { const q = qs[session.current]; session.answers[q.id] = key; save(); render(); };
    const toggleFlag = () => { const q = qs[session.current]; session.flags[q.id] = !session.flags[q.id]; save(); render(); };

    stopExamListeners();
    keyHandler = (e) => {
      if (e.target.closest("input, textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toUpperCase();
      if ("ABCD".includes(k) && k.length === 1) choose(k);
      else if ("1234".includes(k) && k.length === 1) choose("ABCD"[+k - 1]);
      else if (e.key === "ArrowRight") go(session.current + 1);
      else if (e.key === "ArrowLeft") go(session.current - 1);
      else if (k === "F") toggleFlag();
    };
    document.addEventListener("keydown", keyHandler);
    timerHandle = setInterval(() => {
      const left = (session.endsAt - Date.now()) / 1000;
      const t = $("#timer");
      if (t) { t.textContent = fmtTime(left); t.classList.toggle("low", left < 300); }
      if (left <= 0) { alert("Hết giờ! Bài làm được nộp tự động."); submit(true); }
    }, 1000);
    render();
  }

  async function showResult(id) {
    setMode("mock", false);
    const a = attempts().find((x) => x.id === id);
    if (!a) { main.innerHTML = `<div class="empty">Không tìm thấy kết quả. <a href="#/mock">Về trang luyện đề</a></div>`; return; }
    main.innerHTML = `<div class="loading">Đang chấm bài…</div>`;
    const [data] = await Promise.all([loadExam(a.file), loadLessonIndex().catch(() => null)]);
    const byId = new Map(data.questions.map((q) => [q.id, q]));
    const qs = a.qids.map((x) => byId.get(x)).filter(Boolean);
    const lessonTitle = new Map((lessonIndex?.lessons || []).map((l) => [l.id, `${l.code} ${l.title}`]));
    const statusOf = (q) => (!a.answers[q.id] ? "skip" : a.answers[q.id] === q.answer ? "ok" : "bad");
    const pass = a.score >= PASS;

    const dom = {};
    qs.forEach((q) => { const d = (dom[q.domain] ||= { ok: 0, n: 0 }); d.n++; if (statusOf(q) === "ok") d.ok++; });
    const wrongIds = qs.filter((q) => statusOf(q) !== "ok").map((q) => q.id);
    const counts = { ok: 0, bad: 0, skip: 0 };
    qs.forEach((q) => counts[statusOf(q)]++);
    const pct = Math.round((a.correct / a.total) * 100);
    const ringColor = pass ? "var(--ok)" : "var(--bad)";
    let filter = "all";

    const reviewHTML = () => qs.map((q, j) => {
      const st = statusOf(q);
      const flagged = a.flags?.[q.id];
      if (filter === "bad" && st !== "bad") return "";
      if (filter === "skip" && st !== "skip") return "";
      if (filter === "ok" && st !== "ok") return "";
      if (filter === "flag" && !flagged) return "";
      const mine = a.answers[q.id];
      const oe = q.optionExplanations || {};
      return `<div class="review-item" id="rv-${j}"><div class="qcard">
        <div class="qhead"><span class="qnum">Câu ${j + 1}</span>
          <span class="status-tag ${st}">${st === "ok" ? "Đúng" : st === "bad" ? "Sai" : "Bỏ trống"}</span>
          ${flagged ? '<span class="chip">⚑ gắn cờ</span>' : ""}
          <span class="chip" style="color:${DOMAIN_COLORS[q.domain]}">D${q.domain} · ${esc(q.taskStatement || "")}</span>
          ${q.difficulty ? `<span class="chip">${esc(q.difficulty)}</span>` : ""}</div>
        <div class="qtext">${fmt(q.question)}</div>
        <div class="opts">${q.options.map((o) => {
          const cls = o.key === q.answer ? "correct" : o.key === mine ? "wrong" : "";
          const tag = o.key === q.answer ? " ✓ Đáp án đúng" : o.key === mine ? " ✗ Bạn chọn" : "";
          return `<div class="opt ${cls}"><span class="k">${o.key}</span><div><div>${fmtInline(o.text)}<b>${tag}</b></div>
            ${oe[o.key] ? `<div class="opt-expl">${fmtInline(oe[o.key])}</div>` : ""}</div></div>`;
        }).join("")}</div>
        <div class="explain"><b>Giải thích:</b> ${fmtInline(q.explanation || "")}
          ${q.keyTakeaway ? `<div class="take">💡 ${fmtInline(q.keyTakeaway)}</div>` : ""}
          ${q.lesson ? `<div style="margin-top:6px"><a href="#/learn/${esc(q.lesson)}">Ôn lại bài ${esc(lessonTitle.get(q.lesson) || q.lesson)}${q.concept ? " — " + esc(q.concept) : ""} →</a></div>` : ""}
        </div></div></div>`;
    }).join("") || `<div class="empty">Không có câu nào.</div>`;

    const render = () => {
      main.innerHTML = `<div class="container">
        <div class="panel" style="margin-top:0">
          <div class="score-hero">
            <div class="score-ring" style="background:conic-gradient(${ringColor} ${a.score / 10}%, var(--surface-2) 0)"><div><b>${a.score}</b><small>/ ${SCALE}</small></div></div>
            <div>
              <p class="verdict ${pass ? "pass" : "fail"}">${pass ? "ĐẠT" : "CHƯA ĐẠT"} <small style="color:var(--muted);font-weight:500;font-size:14px">(ngưỡng ${PASS})</small></p>
              <div>${esc(a.title)} · ${esc(a.partLabel)}</div>
              <div style="color:var(--muted);font-size:14px">Đúng ${a.correct}/${a.total} (${pct}%) · Sai ${counts.bad} · Bỏ trống ${counts.skip} · Thời gian ${fmtTime(a.usedSec)}${a.auto ? " (hết giờ)" : ""}</div>
              <div class="btn-row" style="margin-top:12px">
                ${wrongIds.length ? `<button class="btn primary" id="retryWrong">Làm lại ${wrongIds.length} câu sai</button>` : ""}
                <button class="btn" id="retryAll">Làm lại phần này</button>
                <a class="btn ghost" href="#/mock">Chọn đề khác</a>
              </div>
            </div>
          </div>
          <div class="field-label" style="margin-top:22px">Kết quả theo domain</div>
          <div class="dom-rows">${Object.keys(dom).sort().map((d) => {
            const r = dom[d], p = Math.round((r.ok / r.n) * 100);
            return `<div class="dom-row"><span>D${d}. ${esc(domainName(+d))}</span><span class="pct">${r.ok}/${r.n} · ${p}%</span>
              <div class="bar"><i style="width:${p}%;background:${DOMAIN_COLORS[d]}"></i></div></div>`;
          }).join("")}</div>
          <div class="navgrid">${qs.map((q, j) => `<button data-jump="${j}" class="r-${statusOf(q)}">${j + 1}</button>`).join("")}</div>
          <div class="legend"><span style="color:var(--ok)">■ Đúng</span><span style="color:var(--bad)">■ Sai</span><span>□ Bỏ trống</span></div>
        </div>
        <div class="filters seg">
          ${[["all", `Tất cả (${qs.length})`], ["bad", `Sai (${counts.bad})`], ["skip", `Bỏ trống (${counts.skip})`], ["ok", `Đúng (${counts.ok})`], ["flag", "Đã gắn cờ"]]
            .map(([k, l]) => `<button data-filter="${k}" class="${filter === k ? "active" : ""}">${l}</button>`).join("")}
        </div>
        <div id="review">${reviewHTML()}</div>
      </div>`;

      main.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => { filter = b.dataset.filter; render(); }));
      main.querySelectorAll("[data-jump]").forEach((b) => b.addEventListener("click", () => {
        if (filter !== "all") { filter = "all"; render(); }
        document.getElementById("rv-" + b.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }));
      $("#retryAll").addEventListener("click", () => startSession({ file: a.file, examId: a.examId, title: a.title, k: a.k, part: a.part, partLabel: a.partLabel, qids: a.qids }));
      $("#retryWrong")?.addEventListener("click", () => startSession({ file: a.file, examId: a.examId, title: a.title, k: a.k, part: a.part, partLabel: `Ôn ${wrongIds.length} câu sai`, qids: wrongIds }));
    };
    render();
    window.scrollTo(0, 0);
  }

  /* ---------- router ---------- */
  async function route() {
    const [, mode, arg] = (location.hash || "#/learn").split("/");
    if (mode !== "exam") stopExamListeners();
    try {
      if (mode === "mock") await showMockSetup();
      else if (mode === "exam") await showExam();
      else if (mode === "result") await showResult(arg);
      else await showLesson(arg && decodeURIComponent(arg));
    } catch (e) {
      console.error(e);
      main.innerHTML = `<div class="empty">Có lỗi khi tải dữ liệu: ${esc(e.message)}<br><small>Nếu mở trực tiếp bằng file://, hãy chạy <code>python3 -m http.server</code> trong thư mục dự án.</small></div>`;
    }
  }
  window.addEventListener("hashchange", route);
  route();
})();
