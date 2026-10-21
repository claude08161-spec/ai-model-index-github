/* ============================================================
   AI MODEL INDEX — app
   Vanilla JS, no dependencies. Charts are hand-drawn SVG.
   ============================================================ */
(function () {
  "use strict";

  const D = window.AMI;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const el = (tag, attrs, kids) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    (kids || []).forEach(c => c && n.appendChild(c));
    return n;
  };
  const svgEl = (tag, attrs) => {
    const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    return n;
  };
  /* feature guards: the page must not die in a sandboxed iframe or on file:// */
  const REDUCED = (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) || false;
  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { } },
  };

  /* ---------------- icons (Lucide, ISC license) ----------------
     Compact source: one array of "<tag> <attr>=<value> ..." strings per icon.
     Values are unquoted and may contain spaces, so attrs are tokenised by
     scanning for the next ` name=` boundary rather than split on whitespace. */
  const P = {
    search:["circle cx=11 cy=11 r=8","path d=m21 21-4.3-4.3"],
    x:["path d=M18 6 6 18","path d=m6 6 12 12"],
    sun:["circle cx=12 cy=12 r=4","path d=M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"],
    moon:["path d=M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"],
    trophy:["path d=M6 9H4.5a2.5 2.5 0 0 1 0-5H6","path d=M18 9h1.5a2.5 2.5 0 0 0 0-5H18","path d=M4 22h16","path d=M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22","path d=M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22","path d=M18 2H6v7a6 6 0 0 0 12 0V2Z"],
    layers:["path d=m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z","path d=m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65","path d=m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"],
    columns:["rect width=18 height=18 x=3 y=3 rx=2","path d=M12 3v18"],
    chart:["path d=M3 3v16a2 2 0 0 0 2 2h16","path d=M18 17V9","path d=M13 17V5","path d=M8 17v-3"],
    scale:["path d=m16 16 3-8 3 8c-.6.6-1.6 1-3 1s-2.4-.4-3-1","path d=m2 16 3-8 3 8c-.6.6-1.6 1-3 1s-2.4-.4-3-1","path d=M7 21h10","path d=M12 3v18","path d=M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"],
    calc:["rect width=16 height=20 x=4 y=2 rx=2","line x1=8 x2=16 y1=6 y2=6","line x1=16 x2=16 y1=14 y2=18","path d=M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"],
    clock:["circle cx=12 cy=12 r=10","polyline points=12 6 12 12 16 14"],
    book:["path d=M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    code:["polyline points=16 18 22 12 16 6","polyline points=8 6 2 12 8 18"],
    brain:["path d=M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z","path d=M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"],
    atom:["circle cx=12 cy=12 r=1","path d=M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z","path d=M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"],
    pen:["path d=M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z","path d=m15 5 4 4"],
    sparkles:["path d=M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z","path d=M20 3v4M22 5h-4"],
    target:["circle cx=12 cy=12 r=10","circle cx=12 cy=12 r=6","circle cx=12 cy=12 r=2"],
    zap:["path d=M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"],
    coins:["circle cx=8 cy=8 r=6","path d=M18.09 10.37A6 6 0 1 1 10.34 18","path d=M7 6h1v4","path d=m16.71 13.88.7.71-2.82 2.82"],
    unlock:["rect width=18 height=11 x=3 y=11 rx=2","path d=M7 11V7a5 5 0 0 1 9.9-1"],
    bot:["path d=M12 8V4H8","rect width=16 height=12 x=4 y=8 rx=2","path d=M2 14h2M20 14h2M15 13v2M9 13v2"],
    database:["ellipse cx=12 cy=5 rx=9 ry=3","path d=M3 5V19A9 3 0 0 0 21 19V5","path d=M3 12A9 3 0 0 0 21 12"],
    users:["path d=M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","circle cx=9 cy=7 r=4","path d=M22 21v-2a4 4 0 0 0-3-3.87","path d=M16 3.13a4 4 0 0 1 0 7.75"],
    arrowUp:["path d=m5 12 7-7 7 7","path d=M12 19V5"],
    arrowDown:["path d=M12 5v14","path d=m19 12-7 7-7-7"],
    arrowRight:["path d=M5 12h14","path d=m12 5 7 7-7 7"],
    info:["circle cx=12 cy=12 r=10","path d=M12 16v-4M12 8h.01"],
    alert:["path d=m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3","path d=M12 9v4M12 17h.01"],
    filter:["polygon points=22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"],
    external:["path d=M15 3h6v6","path d=M10 14 21 3","path d=M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"],
    activity:["path d=M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"],
    gauge:["path d=m12 14 4-4","path d=M3.34 19a10 10 0 1 1 17.32 0"],
    wallet:["path d=M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1","path d=M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"],
    trending:["polyline points=22 7 13.5 15.5 8.5 10.5 2 17","polyline points=16 7 22 7 22 13"],
    ruler:["path d=M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z","path d=m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"],
    check:["path d=M20 6 9 17l-5-5"],
    git:["circle cx=12 cy=12 r=3","path d=M12 3v6M12 15v6"],
  };
  const ATTR_START = /\s[A-Za-z][A-Za-z0-9:-]*=/;
  const q = v => '"' + String(v).trim().replace(/"/g, "&quot;") + '"';
  /* "<tag> k=v k=v ..." -> '<tag k="v" .../>'  (values are unquoted, may hold spaces) */
  function toMarkup(part) {
    const sp = part.indexOf(" ");
    if (sp < 0) return "<" + part + "/>";
    const tag = part.slice(0, sp);
    let rest = part.slice(sp + 1), out = "";
    while (rest.length) {
      const eq = rest.indexOf("=");
      if (eq < 0) break;
      const key = rest.slice(0, eq).trim();
      const after = rest.slice(eq + 1);
      const m = ATTR_START.exec(after);
      const val = m ? after.slice(0, m.index) : after;
      out += " " + key + "=" + q(val);
      if (!m) break;
      rest = after.slice(m.index + 1);
    }
    return "<" + tag + out + "/>";
  }
  function icon(name, size) {
    const parts = P[name] || P.info;
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      parts.map(toMarkup).join("") + "</svg>";
  }

  /* ---------------- formatters ---------------- */
  const nf = (v, d) => v === null || v === undefined || isNaN(v) ? "—" :
    v.toLocaleString("ru-RU", { minimumFractionDigits: d || 0, maximumFractionDigits: d === undefined ? 0 : d });
  const usd = v => {
    if (v === null || v === undefined) return null;
    if (v === 0) return "$0";
    return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: v < 0.1 ? 3 : 2 });
  };
  const tok = n => {
    if (n === null || n === undefined) return "—";
    if (n >= 1e6) { const v = n / 1e6; return (v % 1 ? v.toFixed(2).replace(".", ",") : nf(v)) + "M"; }
    if (n >= 1e3) return nf(n / 1e3) + "K";
    return nf(n);
  };
  const dt = iso => {
    if (!iso) return "—";
    const p = iso.split("-");
    const M = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];
    if (p.length === 3) return +p[2] + " " + M[+p[1] - 1] + " " + p[0];
    if (p.length === 2) return M[+p[1] - 1] + " " + p[0];
    return iso;
  };
  const labColor = l => (D.LABS[l] && D.LABS[l].color) || "#64748B";
  const stampFmt = iso => {
    if (!iso) return "—";
    const i = iso.indexOf("T");
    return i < 0 ? dt(iso) : dt(iso.slice(0, i)) + ", " + iso.slice(i + 1, i + 6) + " UTC";
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- derived ---------------- */
  const blended = m => (m.price.in === null && m.price.out === null) ? null
    : (m.price.in || 0) * 0.75 + (m.price.out || 0) * 0.25;
  const isNew = m => {
    if (!m.released || m.released.length < 7) return false;
    return m.released >= "2026-09-20";
  };
  const byId = {};
  D.MODELS.forEach(m => {
    m.blended = blended(m);
    m.new = isNew(m);
    byId[m.id] = m;
  });
  const intel = m => m.aa !== null ? m.aa : (m.bench !== null ? m.bench * (57.6 / 86.69) : null);
  const intelIsAA = m => m.aa !== null;

  /* ---------------- state ---------------- */
  const state = {
    q: "", labs: new Set(), license: "all", tier: "all", ctx: "any", maxPrice: 70,
    sort: { key: "arena", dir: "desc" },
    compare: new Set(["claude-opus-5-5", "gpt-6-1-sol", "gemini-4-argon"]),
    radarMetric: "arena", benchMetric: "multi",
    calc: { inTok: 50, outTok: 15, cache: 40 },
    theme: "light",
  };
  const savedTheme = store.get("ami-theme"); if (savedTheme === "light" || savedTheme === "dark") state.theme = savedTheme;

  /* ---------------- tooltip ---------------- */
  const tip = el("div", { class: "tip", role: "status", "aria-live": "polite" });
  document.body.appendChild(tip);
  function showTip(html, ev) {
    tip.innerHTML = html; tip.classList.add("on");
    moveTip(ev);
  }
  function moveTip(ev) {
    if (!ev) return;
    const pad = 14, r = tip.getBoundingClientRect();
    let x = ev.clientX + pad, y = ev.clientY + pad;
    if (x + r.width > innerWidth - 8) x = ev.clientX - r.width - pad;
    if (y + r.height > innerHeight - 8) y = ev.clientY - r.height - pad;
    tip.style.left = Math.max(8, x) + "px"; tip.style.top = Math.max(8, y) + "px";
  }
  function hideTip() { tip.classList.remove("on"); }

  /* ---------------- theme ---------------- */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    const b = $("#themeBtn");
    if (b) {
      b.innerHTML = icon(state.theme === "dark" ? "sun" : "moon", 16);
      b.setAttribute("aria-label", state.theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему");
      b.setAttribute("title", state.theme === "dark" ? "Светлая тема" : "Тёмная тема");
    }
    store.set("ami-theme", state.theme);
  }

  /* ---------------- header ---------------- */
  function buildHeader() {
    const nav = [
      ["#winners", "Кто где лучше"], ["#leaderboard", "Рейтинг"], ["#price-perf", "Цена/качество"],
      ["#benchmarks", "Бенчмарки"], ["#compare", "Сравнение"], ["#calc", "Калькулятор"],
      ["#agents", "Агенты"], ["#news", "Хронология"], ["#plans", "Подписки"], ["#sources", "Источники"],
    ];
    const h = el("header", { class: "hdr" }, [
      el("div", { class: "wrap hdr-in" }, [
        el("a", { class: "brand", href: "#top" }, [
          el("span", { html: icon("activity", 18) }),
          el("span", { text: "AI Model Index" }),
          el("span", { class: "dot", "aria-hidden": "true" }),
        ]),
        el("nav", { class: "nav", "aria-label": "Разделы" },
          nav.map(([href, label]) => el("a", { href, text: label }))),
        el("div", { class: "hdr-actions" }, [
          el("span", { class: "stamp" }, [
            el("span", { class: "pulse", "aria-hidden": "true" }),
            el("span", { html: "данные: <b class='num'>" + dt(D.META.snapshot) + "</b>" }),
          ]),
          el("button", { id: "themeBtn", class: "btn btn-icon", type: "button", "aria-label": "Переключить тему" }),
        ]),
      ]),
    ]);
    document.body.prepend(h);
    $("#themeBtn").addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark"; applyTheme();
    });
  }

  /* ---------------- hero + KPI ---------------- */
  function buildHero() {
    const withArena = D.MODELS.filter(m => m.arena !== null).sort((a, b) => b.arena - a.arena);
    const withAA = D.MODELS.filter(m => m.aa !== null).sort((a, b) => b.aa - a.aa);
    const fastest = D.MODELS.filter(m => m.speed !== null).sort((a, b) => b.speed - a.speed);
    const bigCtx = D.MODELS.filter(m => m.ctx !== null).sort((a, b) => b.ctx - a.ctx);
    const cheap = D.MODELS.filter(m => m.blended !== null && m.blended > 0).sort((a, b) => a.blended - b.blended);
    const open = D.MODELS.filter(m => m.license === "open");
    const newest = D.MODELS.filter(m => m.new);

    const kpis = [
      { c: "layers", k: "Моделей в каталоге", v: D.MODELS.length, s: "из " + nf(D.META.arenaModels) + " в Arena · " + nf(D.META.arenaVotes) + " голосов", col: "var(--color-primary)" },
      { c: "trophy", k: "Лидер Text Arena", v: withArena[0].arena, s: withArena[0].name + " · ±" + withArena[0].arenaCi, col: "var(--color-accent)" },
      { c: "brain", k: "Intelligence Index", v: withAA[0].aa.toFixed(1), s: withAA[0].name + " · следом " + withAA[1].name + " (" + withAA[1].aa.toFixed(1) + ")", col: "var(--color-secondary)" },
      { c: "zap", k: "Максимум скорости", v: nf(fastest[0].speed) + " t/s", s: fastest[0].name + " · " + fastest[0].latency + " с до ответа", col: "#F59E0B" },
      { c: "database", k: "Наибольший контекст", v: tok(bigCtx[0].ctx), s: bigCtx[0].name + " · " + bigCtx[0].lab, col: "#8B5CF6" },
      { c: "coins", k: "Разброс цен API", v: usd(cheap[0].blended) + " → " + usd(Math.max(...D.MODELS.map(m => m.blended || 0))), s: "смешанная цена за 1M токенов (75/25)", col: "var(--color-success)" },
    ];

    const hero = el("section", { class: "hero", id: "top" }, [
      el("div", { class: "wrap hero-in" }, [
        el("span", { class: "eyebrow", html: icon("clock", 12) + " снимок данных · " + dt(D.META.snapshot) + " · обновлено вручную" }),
        el("h1", { text: "Все нейросети в одном дашборде" }),
        el("p", { class: "lede", html: "Кто где сильнее, сколько стоит миллион токенов, как быстро отвечает и какой у него контекст. " +
          "Данные собраны из <b>Text Arena</b> (" + nf(D.META.arenaVotes) + " голосов), <b>Artificial Analysis</b>, <b>BenchLM</b>, <b>LLM Stats</b> и <b>id8</b>. " +
          "Проверено " + dt(D.META.sourcesChecked) + "." }),
        el("div", { class: "kpis" }, kpis.map((k, i) => el("article", { class: "kpi rise", style: "--kc:" + k.col + ";transition-delay:" + (REDUCED ? 0 : i * 40) + "ms" }, [
          el("div", { class: "kpi-k", html: icon(k.c, 13) + "<span>" + k.k + "</span>" }),
          el("div", { class: "kpi-v num", text: k.v }),
          el("div", { class: "kpi-s", text: k.s }),
        ]))),
        el("div", { class: "chips", style: "margin-top:12px" }, [
          chipStat("Новых за месяц", newest.length, "layers"),
          chipStat("С открытыми весами", open.length, "unlock"),
          chipStat("Дешевле $1 за 1M", D.MODELS.filter(m => m.blended !== null && m.blended < 1).length, "coins"),
          chipStat("Контекст ≥ 1M", D.MODELS.filter(m => m.ctx >= 1000000).length, "database"),
          chipStat("Цены авто-проверены", stampFmt(D.META.autoChecked || D.META.snapshot), "git"),
        ]),
      ]),
    ]);
    $("#app").appendChild(hero);
    function chipStat(label, value, ic) {
      return el("span", { class: "chip", style: "cursor:default" }, [
        el("span", { html: icon(ic, 12) }),
        el("span", { text: label }),
        el("b", { class: "num", text: value, style: "font-family:var(--font-data)" }),
      ]);
    }
  }

  /* ---------------- category winners ---------------- */
  function buildWinners() {
    const s = el("section", { class: "sec", id: "winners" }, [
      el("div", { class: "wrap" }, [
        el("div", { class: "sec-hd" }, [
          el("h2", { html: icon("trophy", 18) + "<span>Кто где лучше</span>" }),
          el("p", { class: "hint", text: "Победители октября 2026 по 12 задачам — и лучший вариант по соотношению цена/качество в каждой. Клик по карточке открывает первоисточник." }),
        ]),
        el("div", { class: "cats" }, D.CATEGORIES.map((c, i) => {
          const card = el("article", {
            class: "cat rise", tabindex: "0", role: "link",
            style: "transition-delay:" + (REDUCED ? 0 : (i % 4) * 45) + "ms",
            "aria-label": c.name + ": лидер " + c.winner + ". Открыть источник",
          }, [
            el("div", { class: "cat-top" }, [
              el("span", { class: "cat-ico", html: icon(c.icon, 15) }),
              el("span", { class: "cat-name", text: c.name }),
              el("span", { class: "cat-lab", text: c.lab }),
            ]),
            el("div", { class: "cat-win", text: c.winner }),
            el("div", { class: "cat-metric", text: c.metric }),
            el("p", { class: "cat-note", text: c.note }),
            el("div", { class: "cat-val", html: "<b>" + esc(c.value.name) + "</b><span>" + esc(c.value.text) + "</span>" }),
            el("span", { class: "cat-more", html: icon("external", 14) }),
          ]);
          const go = () => window.open(c.url, "_blank", "noopener");
          card.addEventListener("click", go);
          card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
          return card;
        })),
      ]),
    ]);
    $("#app").appendChild(s);
  }

  /* ---------------- leaderboard table ---------------- */
  const COLS = [
    { k: "rank", label: "#", cls: "c", sortable: false },
    { k: "name", label: "Модель", sortable: true, w: "min-width:230px" },
    { k: "arena", label: "Arena Elo", num: true, sortable: true, hint: "Рейтинг Arena по слепым человеческим голосам" },
    { k: "aa", label: "AA Index", num: true, sortable: true, hint: "Artificial Analysis Intelligence Index v4.3.2" },
    { k: "bench", label: "BenchLM", num: true, sortable: true, hint: "Сводный балл BenchLM, 0–100" },
    { k: "swe", label: "SWE-b", num: true, sortable: true, hint: "SWE-bench Verified, %" },
    { k: "gpqa", label: "GPQA", num: true, sortable: true, hint: "GPQA Diamond, %" },
    { k: "price", label: "$/1M вх · вых", num: true, sortable: true, hint: "Цена за миллион токенов" },
    { k: "blended", label: "Смеш.", num: true, sortable: true, hint: "0,75 × вход + 0,25 × выход" },
    { k: "speed", label: "tok/s", num: true, sortable: true },
    { k: "latency", label: "Задержка", num: true, sortable: true, hint: "Секунд до первого ответа" },
    { k: "ctx", label: "Контекст", num: true, sortable: true },
    { k: "lic", label: "Веса", cls: "c", sortable: true },
    { k: "cmp", label: "", cls: "c plain", sortable: false },
  ];
  const sortVal = (m, k) => {
    switch (k) {
      case "name": return m.name.toLowerCase();
      case "arena": return m.arena; case "aa": return m.aa; case "bench": return m.bench;
      case "swe": return m.b.swe === undefined ? null : m.b.swe;
      case "gpqa": return m.b.gpqa === undefined ? null : m.b.gpqa;
      case "price": return m.price.in; case "blended": return m.blended;
      case "speed": return m.speed; case "latency": return m.latency; case "ctx": return m.ctx;
      case "lic": return m.license;
      default: return null;
    }
  };
  const priceAsc = { blended: 1, price: 1, latency: 1 };

  function passesFilters(m) {
    if (state.q) {
      const q = state.q.toLowerCase();
      const hay = (m.name + " " + m.lab + " " + (m.params || "") + " " + (m.badges || []).join(" ")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (state.labs.size && !state.labs.has(m.lab)) return false;
    if (state.license !== "all" && m.license !== state.license) return false;
    if (state.tier !== "all" && m.tier !== state.tier) return false;
    if (state.ctx === "1m" && !(m.ctx >= 1000000)) return false;
    if (state.ctx === "200k" && !(m.ctx >= 200000)) return false;
    if (m.blended !== null && m.blended > state.maxPrice) return false;
    return true;
  }

  function currentRows() {
    const rows = D.MODELS.filter(passesFilters);
    const { key, dir } = state.sort;
    rows.sort((a, b) => {
      let va = sortVal(a, key), vb = sortVal(b, key);
      const na = va === null || va === undefined, nb = vb === null || vb === undefined;
      if (na && nb) return a.name.localeCompare(b.name);
      if (na) return 1; if (nb) return -1;
      if (typeof va === "string") return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return dir === "asc" ? va - vb : vb - va;
    });
    return rows;
  }

  function scoreCell(v, max, cls, digits) {
    if (v === null || v === undefined) return el("span", { class: "na", text: "—" });
    return el("span", { class: "score" }, [
      el("span", { class: "bar " + (cls || "") }, [el("i", { style: "width:" + Math.max(3, Math.min(100, (v / max) * 100)) + "%" })]),
      el("b", { text: digits ? v.toFixed(digits).replace(".", ",") : nf(v) }),
    ]);
  }

  function buildTable() {
    const s = el("section", { class: "sec", id: "leaderboard" }, [el("div", { class: "wrap" }, [])]);
    const wrap = s.firstChild;
    wrap.appendChild(el("div", { class: "sec-hd" }, [
      el("h2", { html: icon("layers", 18) + "<span>Сводный рейтинг</span>" }),
      el("p", { class: "hint", text: "Сортируйте по любому столбцу, фильтруйте по лаборатории и цене, отмечайте галочкой для сравнения. Прочерк — значение не опубликовано или не измерено." }),
    ]));

    /* toolbar */
    const labsInData = Array.from(new Set(D.MODELS.map(m => m.lab))).sort();
    const searchBox = el("div", { class: "search" }, [
      el("span", { html: icon("search", 15) }),
      el("input", { id: "q", type: "search", placeholder: "Поиск: модель, лаборатория, бейдж…", "aria-label": "Поиск по моделям", autocomplete: "off" }),
      el("button", { class: "clr", type: "button", "aria-label": "Очистить поиск", html: icon("x", 14) }),
    ]);
    const labSel = el("select", { class: "ctl", id: "labSel", "aria-label": "Лаборатория" },
      [el("option", { value: "", text: "Все лаборатории" })].concat(labsInData.map(l => el("option", { value: l, text: l }))));
    const licSel = el("select", { class: "ctl", id: "licSel", "aria-label": "Тип весов" }, [
      el("option", { value: "all", text: "Любые веса" }),
      el("option", { value: "closed", text: "Закрытые (API)" }),
      el("option", { value: "open", text: "Открытые веса" }),
    ]);
    const ctxSel = el("select", { class: "ctl", id: "ctxSel", "aria-label": "Контекст" }, [
      el("option", { value: "any", text: "Любой контекст" }),
      el("option", { value: "200k", text: "200K+" }),
      el("option", { value: "1m", text: "1M+" }),
    ]);
    const priceWrap = el("label", { class: "chip", style: "gap:7px;cursor:default" }, [
      el("span", { html: icon("wallet", 12) }),
      el("span", { text: "≤" }),
      el("input", { id: "priceR", class: "ctl", type: "range", min: "0", max: "70", step: "1", value: "70", style: "width:96px;height:20px;padding:0;border:0;background:transparent", "aria-label": "Максимальная смешанная цена за 1M токенов" }),
      el("b", { id: "priceV", class: "num", text: "любая" }),
    ]);

    const toolbar = el("div", { class: "toolbar", role: "group", "aria-label": "Фильтры рейтинга" }, [
      searchBox, labSel, licSel, ctxSel, priceWrap,
      el("div", { class: "chips", id: "tierChips" }, [
        tierChip("all", "Все классы"), tierChip("frontier", "Frontier"), tierChip("mid", "Средний"),
        tierChip("fast", "Быстрые"), tierChip("budget", "Бюджет"), tierChip("open", "Открытые"),
      ]),
      el("button", { class: "btn btn-sm", id: "resetBtn", type: "button", html: icon("x", 12) + "<span>Сбросить</span>" }),
    ]);
    function tierChip(v, label) {
      const b = el("button", { class: "chip", type: "button", "data-tier": v, "aria-pressed": v === "all", text: label });
      b.addEventListener("click", () => {
        state.tier = v;
        $$("#tierChips .chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.tier === v));
        render();
      });
      return b;
    }

    const cmpBar = el("div", { class: "cmp-bar", id: "cmpBar", hidden: true });
    const scroll = el("div", { class: "table-scroll", tabindex: "0", role: "region", "aria-label": "Таблица моделей, прокручивается по горизонтали" });
    const table = el("table", { id: "tbl" });
    scroll.appendChild(table);
    const foot = el("div", { class: "tbl-foot card", id: "tblFoot", style: "border-radius:0 0 var(--radius) var(--radius);border-top:0" });

    wrap.appendChild(toolbar); wrap.appendChild(cmpBar); wrap.appendChild(scroll); wrap.appendChild(foot);
    $("#app").appendChild(s);

    /* events */
    let qt;
    $("#q", searchBox).addEventListener("input", e => {
      clearTimeout(qt); const v = e.target.value;
      searchBox.classList.toggle("has-val", !!v);
      qt = setTimeout(() => { state.q = v.trim(); render(); }, 130);
    });
    $(".clr", searchBox).addEventListener("click", () => { $("#q", searchBox).value = ""; state.q = ""; searchBox.classList.remove("has-val"); render(); $("#q", searchBox).focus(); });
    labSel.addEventListener("change", e => { state.labs = e.target.value ? new Set([e.target.value]) : new Set(); render(); });
    licSel.addEventListener("change", e => { state.license = e.target.value; render(); });
    ctxSel.addEventListener("change", e => { state.ctx = e.target.value; render(); });
    $("#priceR").addEventListener("input", e => { state.maxPrice = +e.target.value; $("#priceV").textContent = e.target.value >= 70 ? "любая" : usd(+e.target.value); render(); });
    $("#resetBtn").addEventListener("click", () => {
      Object.assign(state, { q: "", labs: new Set(), license: "all", tier: "all", ctx: "any", maxPrice: 70, sort: { key: "arena", dir: "desc" } });
      $("#q", searchBox).value = ""; searchBox.classList.remove("has-val");
      labSel.value = ""; licSel.value = "all"; ctxSel.value = "any"; $("#priceR").value = 70; $("#priceV").textContent = "любая";
      $$("#tierChips .chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.tier === "all"));
      render();
    });

    /* head */
    function head() {
      const tr = el("tr");
      COLS.forEach(c => {
        const sorted = state.sort.key === c.k;
        const th = el("th", {
          class: (c.num ? "num-c " : "") + (c.cls || ""), scope: "col",
          "aria-sort": sorted ? (state.sort.dir === "asc" ? "ascending" : "descending") : null,
          style: c.w || null, title: c.hint || null,
        });
        if (c.sortable) {
          const b = el("button", { class: "thbtn", type: "button" }, [
            el("span", { text: c.label }),
            el("span", { class: "ar", html: icon(sorted && state.sort.dir === "asc" ? "arrowUp" : "arrowDown", 11) }),
          ]);
          b.addEventListener("click", () => {
            if (state.sort.key === c.k) state.sort.dir = state.sort.dir === "asc" ? "desc" : "asc";
            else state.sort = { key: c.k, dir: (c.k === "name" || c.k === "lic") ? "asc" : (priceAsc[c.k] ? "asc" : "desc") };
            render();
          });
          th.appendChild(b);
        } else th.appendChild(el("span", { style: "display:block;padding:0 8px", text: c.label }));
        tr.appendChild(th);
      });
      return el("thead", {}, [tr]);
    }

    /* body */
    function body(rows) {
      const max = {
        arena: 1550, aa: 60, bench: 90, swe: 100, gpqa: 100,
        speed: Math.max(...D.MODELS.map(m => m.speed || 0)), ctx: Math.max(...D.MODELS.map(m => m.ctx || 0)),
      };
      const best = {
        arena: top1("arena"), aa: top1("aa"), bench: top1("bench"), swe: top1("swe"), gpqa: top1("gpqa"),
        blended: top1("blended", true), speed: top1("speed"), latency: top1("latency", true), ctx: top1("ctx"),
      };
      function top1(k, asc) {
        let b = null, bv = null;
        D.MODELS.forEach(m => {
          const v = k === "blended" ? m.blended : k === "swe" ? (m.b.swe === undefined ? null : m.b.swe) : k === "gpqa" ? (m.b.gpqa === undefined ? null : m.b.gpqa) : m[k];
          if (v === null || v === undefined || v === 0) return;
          if (bv === null || (asc ? v < bv : v > bv)) { bv = v; b = m.id; }
        });
        return b;
      }
      const tb = el("tbody");
      rows.forEach((m, i) => {
        const lc = labColor(m.lab);
        const tr = el("tr", { class: state.compare.has(m.id) ? "sel" : null });

        tr.appendChild(el("td", { class: "rank c" + (i < 3 && state.sort.key === "arena" ? " top" : ""), text: i + 1 }));

        /* model */
        const nameRow = el("div", { class: "mname" }, [
          el("a", { href: m.url, target: "_blank", rel: "noopener noreferrer", text: m.name }),
          m.new ? el("span", { class: "pill new", text: "NEW" }) : null,
          m.prelim ? el("span", { class: "pill pre", title: "Мало голосов — место предварительное", text: "prelim" }) : null,
        ]);
        const subRow = el("div", { class: "msub" }, [
          el("span", { class: "pill lab", style: "--lab:" + lc, text: m.lab }),
          el("span", { text: "cfg " + m.cfg }),
          m.params ? el("span", { text: m.params }) : null,
        ]);
        tr.appendChild(el("td", {}, [el("div", { class: "mcell" }, [
          el("span", { class: "lchip", style: "background:" + lc, "aria-hidden": "true" }),
          el("div", {}, [nameRow, subRow]),
        ])]));

        tr.appendChild(cellNum(scoreCell(m.arena, max.arena, "acc"), m.arena !== null ? (m.arena + " ±" + m.arenaCi) : null, best.arena === m.id));
        tr.appendChild(cellNum(scoreCell(m.aa, max.aa, "", 1), null, best.aa === m.id));
        tr.appendChild(cellNum(scoreCell(m.bench, max.bench, "suc", 2), null, best.bench === m.id));
        tr.appendChild(cellNum(bVal(m, "swe") === null ? el("span", { class: "na", text: "—" }) : el("span", { class: "num", text: bVal(m, "swe").toFixed(1).replace(".", ",") + "%" }), null, best.swe === m.id));
        tr.appendChild(cellNum(bVal(m, "gpqa") === null ? el("span", { class: "na", text: "—" }) : el("span", { class: "num", text: bVal(m, "gpqa").toFixed(1).replace(".", ",") + "%" }), null, best.gpqa === m.id));

        /* price */
        const pr = el("td", { class: "r " + (best.blended === m.id ? "best-cell" : "") });
        if (m.price.in === null && m.price.out === null) pr.appendChild(el("span", { class: "na", title: m.priceNote || "Цена не опубликована", text: "self-host" }));
        else {
          pr.appendChild(el("span", {
            class: "price", title: (m.priceNote || "") + (m.price.cache !== null && m.price.cache !== undefined ? " · кэш " + usd(m.price.cache) : ""),
            html: "<span class='din'>" + (m.price.in === null ? "—" : usd(m.price.in)) + "</span> · <span class='dout'>" + (m.price.out === null ? "—" : usd(m.price.out)) + "</span>",
          }));
        }
        tr.appendChild(pr);

        tr.appendChild(cellNum(m.blended === null ? el("span", { class: "na", text: "—" }) : el("span", { class: "blended", text: usd(m.blended) }), null, false));
        tr.appendChild(cellNum(m.speed === null ? el("span", { class: "na", text: "—" }) : el("span", { class: "num", text: nf(m.speed) }), null, best.speed === m.id));
        tr.appendChild(cellNum(m.latency === null ? el("span", { class: "na", text: "—" }) : el("span", { class: "num", text: m.latency.toFixed(2).replace(".", ",") + " с" }), null, best.latency === m.id));
        tr.appendChild(cellNum(m.ctx === null ? el("span", { class: "na", text: "—" }) : el("span", { class: "num", text: tok(m.ctx) }), null, best.ctx === m.id));
        tr.appendChild(el("td", { class: "c" }, [el("span", {
          class: "pill " + m.license, text: m.license === "open" ? "open" : "API",
          title: m.license === "open" ? "Открытые веса" : "Только API",
        })]));

        const cb = el("input", { class: "cbx", type: "checkbox", "aria-label": "Сравнить " + m.name, checked: state.compare.has(m.id) });
        cb.addEventListener("change", () => toggleCompare(m.id, cb.checked));
        tr.appendChild(el("td", { class: "c" }, [cb]));

        /* row tooltip */
        tr.addEventListener("mouseenter", ev => showTip(rowTip(m), ev));
        tr.addEventListener("mousemove", moveTip);
        tr.addEventListener("mouseleave", hideTip);
        tr.addEventListener("focusin", ev => showTip(rowTip(m), ev));
        tr.addEventListener("focusout", hideTip);
        tb.appendChild(tr);
      });
      return tb;
      function cellNum(node, title, isBest) {
        return el("td", { class: "r" + (isBest ? " best-cell" : ""), title: title || null }, [node]);
      }
    }
    const bVal = (m, k) => (m.b && m.b[k] !== undefined ? m.b[k] : null);

    function rowTip(m) {
      const rows = [];
      const push = (k, v) => { if (v !== null && v !== undefined && v !== "") rows.push('<div class="row"><span>' + k + '</span><b>' + v + "</b></div>"); };
      push("Arena Elo", m.arena ? m.arena + " ±" + m.arenaCi + " · " + nf(m.votes) + " гол." : null);
      push("AA Index", m.aa !== null ? m.aa.toFixed(1) : null);
      push("BenchLM", m.bench !== null ? m.bench.toFixed(2) : null);
      Object.keys(m.b || {}).forEach(k => { const b = D.BENCH[k]; if (b) push(b.short, m.b[k] + (b.unit === "%" ? "%" : "")); });
      push("Кэш", m.price.cache !== null && m.price.cache !== undefined ? usd(m.price.cache) + "/1M" : null);
      push("Релиз", dt(m.released));
      push("Кат-офф знаний", m.cutoff ? dt(m.cutoff) : null);
      push("Мультимодальность", m.multimodal ? "да" : "нет");
      return '<b style="display:block;margin-bottom:4px">' + esc(m.name) + " · " + esc(m.lab) + "</b>" + rows.join("") +
        ((m.badges || []).length ? '<div style="margin-top:5px;border-top:1px solid rgba(255,255,255,.18);padding-top:5px">' + m.badges.map(esc).join(" · ") + "</div>" : "") +
        (m.priceNote ? '<div style="margin-top:4px;opacity:.8">' + esc(m.priceNote) + "</div>" : "");
    }

    /* compare bar */
    function renderCmpBar() {
      cmpBar.innerHTML = "";
      if (!state.compare.size) { cmpBar.hidden = true; return; }
      cmpBar.hidden = false;
      cmpBar.appendChild(el("span", { html: icon("columns", 13) }));
      cmpBar.appendChild(el("b", { text: "Сравнение: " + state.compare.size + "/4" }));
      const tags = el("div", { class: "cmp-tags" });
      state.compare.forEach(id => {
        const m = byId[id]; if (!m) return;
        const btn = el("button", { type: "button", "aria-label": "Убрать " + m.name + " из сравнения", html: icon("x", 11) });
        btn.addEventListener("click", () => toggleCompare(id, false));
        tags.appendChild(el("span", { class: "cmp-tag" }, [el("span", { style: "color:" + labColor(m.lab), text: m.name }), btn]));
      });
      cmpBar.appendChild(tags);
      const go = el("a", { class: "btn btn-sm btn-primary", href: "#compare", html: icon("arrowRight", 12) + "<span>Открыть сравнение</span>" });
      cmpBar.appendChild(go);
      const clr = el("button", { class: "btn btn-sm", type: "button", text: "Очистить" });
      clr.addEventListener("click", () => { state.compare.clear(); render(); renderCompare(); });
      cmpBar.appendChild(clr);
    }

    window.__amiToggleCompare = function (id, on) {
      if (on) { if (state.compare.size >= 4) { flash("В сравнении максимум 4 модели"); return; } state.compare.add(id); }
      else state.compare.delete(id);
      render(); renderCompare();
    };
    function toggleCompare(id, on) { window.__amiToggleCompare(id, on); }

    /* render */
    function render() {
      const rows = currentRows();
      table.innerHTML = "";
      table.appendChild(head());
      table.appendChild(body(rows));
      foot.innerHTML = "";
      foot.appendChild(el("span", { html: icon("info", 12) }));
      foot.appendChild(el("span", { text: "Показано " + rows.length + " из " + D.MODELS.length + " моделей." }));
      foot.appendChild(el("span", { class: "muted", text: "Сортировка: " + colLabel(state.sort.key) + " · " + (state.sort.dir === "asc" ? "по возрастанию" : "по убыванию") }));
      foot.appendChild(el("span", { class: "muted", style: "margin-left:auto", text: "Жёлтая метка слева — лучшее значение в столбце · фильтр цены отсекает модели дороже заданного порога" }));
      renderCmpBar();
    }
    function colLabel(k) { const c = COLS.find(x => x.k === k); return c ? c.label : k; }

    s.__render = render;
    window.__amiTableRender = render;
    render();
  }

  function flash(msg) {
    const n = el("div", {
      style: "position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:90;background:var(--color-foreground);color:var(--color-background);padding:9px 14px;border-radius:8px;font-size:12px;box-shadow:var(--shadow-lg)",
      text: msg, role: "status",
    });
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2200);
  }

  /* ---------------- charts ---------------- */
  function axisTicks(min, max, n) {
    const step = Math.max(1, Math.round((max - min) / n));
    const out = []; for (let t = Math.ceil(min); t <= max; t += step) out.push(t); return out;
  }

  function chartPricePerf(host) {
    const W = 720, H = 400, m = { l: 44, r: 16, t: 16, b: 40 };
    const pts = D.MODELS.filter(x => x.blended !== null && x.blended > 0 && intel(x) !== null)
      .map(x => ({ m: x, x: x.blended, y: intel(x) }))
      .sort((a, b) => a.x - b.x);
    const xmin = 0.02, xmax = Math.max(...pts.map(p => p.x)) * 1.15;
    const ymin = Math.floor(Math.min(...pts.map(p => p.y)) / 5) * 5 - 2;
    const ymax = Math.ceil(Math.max(...pts.map(p => p.y)) / 5) * 5 + 2;
    const X = v => m.l + ((Math.log10(Math.max(v, xmin)) - Math.log10(xmin)) / (Math.log10(xmax) - Math.log10(xmin))) * (W - m.l - m.r);
    const Y = v => H - m.b - ((v - ymin) / (ymax - ymin)) * (H - m.t - m.b);

    /* pareto: cheapest for a given score */
    const pareto = []; let bestY = -1;
    pts.forEach(p => { if (p.y > bestY) { bestY = p.y; pareto.push(p); } });

    const svg = svgEl("svg", { class: "chart", viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Диаграмма: цена за миллион токенов против качества модели" });
    /* grid + y axis */
    axisTicks(ymin, ymax, 5).forEach(t => {
      svg.appendChild(svgEl("line", { class: "ax-grid", x1: m.l, x2: W - m.r, y1: Y(t), y2: Y(t) }));
      const tx = svgEl("text", { class: "ax-txt", x: m.l - 7, y: Y(t) + 3.5, "text-anchor": "end" }); tx.textContent = Math.round(t); svg.appendChild(tx);
    });
    /* x ticks (log) */
    [0.05, 0.1, 0.5, 1, 5, 10, 30, 60].filter(v => v >= xmin && v <= xmax).forEach(t => {
      svg.appendChild(svgEl("line", { class: "ax-grid", x1: X(t), x2: X(t), y1: m.t, y2: H - m.b }));
      const tx = svgEl("text", { class: "ax-txt", x: X(t), y: H - m.b + 15, "text-anchor": "middle" });
      tx.textContent = "$" + (t < 1 ? t.toFixed(2) : t); svg.appendChild(tx);
    });
    svg.appendChild(svgEl("line", { class: "ax-line", x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b }));
    svg.appendChild(svgEl("line", { class: "ax-line", x1: m.l, x2: m.l, y1: m.t, y2: H - m.b }));
    const xl = svgEl("text", { class: "ax-txt", x: (W + m.l) / 2, y: H - 6, "text-anchor": "middle" });
    xl.textContent = "Смешанная цена за 1M токенов, $ (лог. шкала) →"; svg.appendChild(xl);
    const yl = svgEl("text", { class: "ax-txt", x: 12, y: m.t + 4, transform: "rotate(-90 12 " + (m.t + 4) + ")", "text-anchor": "end" });
    yl.textContent = "Качество ↑"; svg.appendChild(yl);

    /* pareto line */
    if (pareto.length > 1) {
      let d = "";
      pareto.forEach((p, i) => {
        const x = X(p.x), y = Y(p.y);
        if (i === 0) d += "M" + x + " " + y;
        else { d += " L" + x + " " + Y(pareto[i - 1].y) + " L" + x + " " + y; }
      });
      d += " L" + X(xmax) + " " + Y(pareto[pareto.length - 1].y);
      svg.appendChild(svgEl("path", { d, fill: "none", stroke: "var(--color-success)", "stroke-width": 1.6, "stroke-dasharray": "5 4", opacity: .85 }));
    }

    /* points */
    const g = svgEl("g");
    pts.forEach(p => {
      const isP = pareto.includes(p);
      const c = svgEl("circle", {
        class: "pt", cx: X(p.x), cy: Y(p.y), r: isP ? 6 : 4.5, tabindex: "0", role: "button",
        fill: p.m.license === "open" ? "var(--color-success)" : "var(--color-primary)",
        stroke: "var(--color-card)", "stroke-width": 1.5,
        "aria-label": p.m.name + ": " + usd(p.x) + " за 1M токенов, качество " + p.y.toFixed(1),
      });
      const html = '<b>' + esc(p.m.name) + "</b><div class='row'><span>цена 1M (смеш.)</span><b>" + usd(p.x) + "</b></div>" +
        '<div class="row"><span>' + (intelIsAA(p.m) ? "AA Index" : "BenchLM→AA") + "</span><b>" + p.y.toFixed(1) + (intelIsAA(p.m) ? "" : "*") + "</b></div>" +
        '<div class="row"><span>веса</span><b>' + (p.m.license === "open" ? "открытые" : "API") + "</b></div>" +
        (isP ? "<div style='margin-top:4px;color:#34D399'>Парето-оптимальна</div>" : "");
      c.addEventListener("mouseenter", ev => showTip(html, ev));
      c.addEventListener("mousemove", moveTip); c.addEventListener("mouseleave", hideTip);
      c.addEventListener("focus", ev => showTip(html, { clientX: ev.target.getBoundingClientRect().x + 10, clientY: ev.target.getBoundingClientRect().y }));
      c.addEventListener("blur", hideTip);
      c.addEventListener("click", () => { window.__amiToggleCompare(p.m.id, !state.compare.has(p.m.id)); });
      g.appendChild(c);
      if (isP || p.y === Math.max(...pts.map(q => q.y))) {
        const t = svgEl("text", { class: "ax-txt", x: X(p.x), y: Y(p.y) - 10, "text-anchor": "middle", fill: "var(--color-foreground)", "font-weight": "600" });
        t.textContent = p.m.name.length > 20 ? p.m.name.slice(0, 19) + "…" : p.m.name;
        svg.appendChild(t);
      }
    });
    svg.appendChild(g);
    host.innerHTML = ""; host.appendChild(svg);
    const note = host.parentNode.querySelector(".panel-note");
    if (note) note.innerHTML = icon("info", 12) + " Клик по точке — добавить модель в сравнение. Звёздочка (*) — качество пересчитано из балла BenchLM, так как AA Index для модели не опубликован. Зелёная пунктирная линия — Парето-фронт: дешевле при том же качестве не бывает.";
  }

  function chartArena(host, metric) {
    metric = metric || "arena";
    const key = metric === "arena" ? "arena" : metric;
    const rows = D.MODELS.filter(m => (key === "arena" ? m.arena : m.aa) !== null)
      .map(m => ({ m, v: key === "arena" ? m.arena : m.aa }))
      .sort((a, b) => b.v - a.v).slice(0, 15);
    const isElo = key === "arena";
    const lo = isElo ? Math.min(...rows.map(r => r.v)) - 8 : 0;
    const hi = Math.max(...rows.map(r => r.v)) + (isElo ? 4 : 2);
    host.innerHTML = "";
    rows.forEach((r, i) => {
      const w = Math.max(2, ((r.v - lo) / (hi - lo)) * 100);
      const row = el("div", { class: "hbar-row rise", style: "transition-delay:" + (REDUCED ? 0 : i * 22) + "ms" }, [
        el("span", { class: "hbar-lab", title: r.m.name + " · " + r.m.lab, html: '<span style="color:' + labColor(r.m.lab) + '">●</span> ' + esc(r.m.name) }),
        el("span", { class: "hbar-tr" }, [el("i", { style: "width:" + w + "%;background:" + (i < 3 ? "var(--color-accent)" : "var(--color-secondary)") })]),
        el("span", { class: "hbar-val", text: isElo ? r.v : r.v.toFixed(1) }),
      ]);
      host.appendChild(row);
    });
  }

  function chartBench(host, mode) {
    host.innerHTML = "";
    const keys = mode === "multi" ? ["swe", "term", "gpqa", "arc2", "mmluPro", "factual"] : [mode];
    const keysOk = keys.filter(k => D.MODELS.some(m => m.b[k] !== undefined));
    /* pick models that have at least one of the metrics, sorted by count desc then value */
    const cand = D.MODELS.filter(m => keysOk.some(k => m.b[k] !== undefined))
      .map(m => ({ m, n: keysOk.filter(k => m.b[k] !== undefined).length, mx: Math.max(...keysOk.map(k => m.b[k] === undefined ? 0 : m.b[k])) }))
      .sort((a, b) => b.n - a.n || b.mx - a.mx).slice(0, 8);
    if (!cand.length) { host.appendChild(el("p", { class: "muted", text: "Нет данных по этому бенчмарку." })); return; }

    const W = 720, rowH = 15, gapG = 16, m = { l: 148, r: 54, t: 26, b: 8 };
    const barH = keysOk.length > 1 ? 8 : 13;
    const H = m.t + m.b + cand.length * (keysOk.length * (barH + 3) + gapG);
    const svg = svgEl("svg", { class: "chart", viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Бенчмарки по моделям" });
    const palette = ["var(--color-primary)", "var(--color-accent)", "var(--color-secondary)", "var(--color-success)", "#8B5CF6", "#EC4899"];

    /* legend */
    keysOk.forEach((k, i) => {
      const x = m.l + i * 104;
      svg.appendChild(svgEl("rect", { x, y: 6, width: 9, height: 9, rx: 2, fill: palette[i] }));
      const t = svgEl("text", { class: "ax-txt", x: x + 13, y: 14.5 }); t.textContent = D.BENCH[k].short; svg.appendChild(t);
    });
    /* x scale: percent of 100 (or elo) */
    const maxV = Math.max(...cand.flatMap(c => keysOk.map(k => c.m.b[k] === undefined ? 0 : c.m.b[k])));
    const sc = v => m.l + (v / Math.max(maxV * 1.06, 1)) * (W - m.l - m.r);
    [0, 25, 50, 75, 100].filter(v => v <= maxV * 1.06).forEach(v => {
      svg.appendChild(svgEl("line", { class: "ax-grid", x1: sc(v), x2: sc(v), y1: m.t - 4, y2: H - m.b }));
      const t = svgEl("text", { class: "ax-txt", x: sc(v), y: H - m.b + 11, "text-anchor": "middle" }); t.textContent = v; svg.appendChild(t);
    });

    cand.forEach((c, gi) => {
      const y0 = m.t + gi * (keysOk.length * (barH + 3) + gapG);
      const lab = svgEl("text", { class: "ax-txt", x: m.l - 10, y: y0 + (keysOk.length * (barH + 3)) / 2 + 3, "text-anchor": "end", fill: "var(--color-foreground)", "font-weight": "600" });
      lab.textContent = c.m.name.length > 24 ? c.m.name.slice(0, 23) + "…" : c.m.name;
      svg.appendChild(lab);
      const dot = svgEl("circle", { cx: 8, cy: y0 + (keysOk.length * (barH + 3)) / 2, r: 3.5, fill: labColor(c.m.lab) });
      svg.appendChild(dot);
      keysOk.forEach((k, ki) => {
        const v = c.m.b[k];
        const y = y0 + ki * (barH + 3);
        svg.appendChild(svgEl("rect", { x: m.l, y, width: W - m.l - m.r, height: barH, rx: 3, fill: "var(--chart-track)", opacity: .55 }));
        if (v === undefined) return; /* empty track = benchmark not published for this model */
        const r = svgEl("rect", { x: m.l, y, width: Math.max(2, sc(v) - m.l), height: barH, rx: 3, fill: palette[ki] });
        const tt = "<b>" + esc(c.m.name) + "</b><div class='row'><span>" + D.BENCH[k].label + "</span><b>" + v + (D.BENCH[k].unit === "%" ? "%" : "") + "</b></div><div style='opacity:.8;margin-top:3px'>" + D.BENCH[k].desc + "</div>";
        r.addEventListener("mouseenter", ev => showTip(tt, ev)); r.addEventListener("mousemove", moveTip); r.addEventListener("mouseleave", hideTip);
        svg.appendChild(r);
        const vt = svgEl("text", { class: "ax-txt", x: W - m.r + 6, y: y + barH - 2, fill: "var(--color-foreground)", "font-weight": "600" });
        vt.textContent = v % 1 ? v.toFixed(1) : v; svg.appendChild(vt);
      });
    });
    host.appendChild(svg);
  }

  function chartRadar(host, ids) {
    host.innerHTML = "";
    const AX = [
      { k: "arena", label: "Arena Elo", get: m => m.arena, max: 1550, min: 1250 },
      { k: "aa", label: "Интеллект (AA)", get: m => intel(m), max: 60, min: 20 },
      { k: "swe", label: "Кодинг (SWE)", get: m => m.b.swe, max: 100, min: 70 },
      { k: "gpqa", label: "Наука (GPQA)", get: m => m.b.gpqa, max: 100, min: 65 },
      { k: "fact", label: "Точность фактов", get: m => m.b.factual, max: 100, min: 0 },
      { k: "value", label: "Выгода (1/цена)", get: m => m.blended ? 6 / m.blended : null, max: 12, min: 0 },
      { k: "speed", label: "Скорость", get: m => m.speed, max: 250, min: 0 },
      { k: "ctx", label: "Контекст", get: m => m.ctx ? m.ctx / 1e6 : null, max: 2, min: 0 },
    ];
    const ms = ids.map(id => byId[id]).filter(Boolean);
    if (ms.length < 2) { host.appendChild(el("p", { class: "cmp-empty", text: "Выберите от 2 до 4 моделей в таблице выше — лепестковая диаграмма построится автоматически." })); return; }
    const axes = AX.filter(a => ms.some(m => a.get(m) !== null && a.get(m) !== undefined));
    const W = 460, H = 380, cx = W / 2, cy = H / 2 + 6, R = 122;
    const svg = svgEl("svg", { class: "chart", viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Лепестковая диаграмма выбранных моделей" });
    const ang = i => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    const norm = (a, m) => {
      const v = a.get(m); if (v === null || v === undefined) return 0;
      return Math.max(0, Math.min(1, (v - a.min) / (a.max - a.min)));
    };
    const pt = (i, r) => [cx + Math.cos(ang(i)) * R * r, cy + Math.sin(ang(i)) * R * r];

    [0.25, 0.5, 0.75, 1].forEach(r => {
      const d = axes.map((_, i) => { const [x, y] = pt(i, r); return (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }).join(" ") + " Z";
      svg.appendChild(svgEl("path", { d, fill: "none", stroke: "var(--color-border)", "stroke-width": 1 }));
    });
    axes.forEach((a, i) => {
      const [x, y] = pt(i, 1);
      svg.appendChild(svgEl("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: "var(--color-border)", "stroke-width": 1 }));
      const [lx, ly] = pt(i, 1.17);
      const anchor = Math.abs(lx - cx) < 12 ? "middle" : lx > cx ? "start" : "end";
      const t = svgEl("text", { class: "ax-txt", x: lx, y: ly + 3, "text-anchor": anchor, fill: "var(--color-muted-foreground)", "font-size": "10" });
      t.textContent = a.label; svg.appendChild(t);
    });
    const pal = ["var(--color-primary)", "var(--color-accent)", "var(--color-success)", "#8B5CF6"];
    ms.forEach((m, mi) => {
      const d = axes.map((a, i) => { const [x, y] = pt(i, Math.max(0.02, norm(a, m))); return (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }).join(" ") + " Z";
      const p = svgEl("path", { d, fill: pal[mi], "fill-opacity": .16, stroke: pal[mi], "stroke-width": 2, "stroke-linejoin": "round" });
      p.addEventListener("mouseenter", ev => showTip("<b>" + esc(m.name) + "</b><div style='opacity:.8'>" + esc(m.lab) + "</div>", ev));
      p.addEventListener("mousemove", moveTip); p.addEventListener("mouseleave", hideTip);
      svg.appendChild(p);
      axes.forEach((a, i) => {
        const v = a.get(m); if (v === null || v === undefined) return;
        const [x, y] = pt(i, Math.max(0.02, norm(a, m)));
        const c = svgEl("circle", { cx: x, cy: y, r: 3, fill: pal[mi], stroke: "var(--color-card)", "stroke-width": 1.2 });
        svg.appendChild(c);
      });
    });
    host.appendChild(svg);
    host.appendChild(el("div", { class: "legend" }, ms.map((m, i) => el("span", { html: '<i style="background:' + pal[i] + '"></i>' + esc(m.name) }))));
    host.appendChild(el("p", { class: "muted", style: "font-size:11px;padding:0 12px 10px;line-height:1.5", text: "Оси нормированы к своим диапазонам: Arena Elo 1250–1550, AA Index 20–60, бенчмарки 0–100%, выгода = 6 ÷ смешанная цена. Нулевой лепесток — данных нет. Точные значения — в таблице и в карточках сравнения ниже." }));
  }

  /* ---------------- compare section ---------------- */
  const CMP_ROWS = [
    { k: "arena", label: "Arena Elo (текст)", get: m => m.arena, fmt: v => nf(v), hi: 1, hint: "Слепые человеческие голоса" },
    { k: "aa", label: "AA Intelligence Index", get: m => m.aa, fmt: v => v.toFixed(1), hi: 1 },
    { k: "bench", label: "Сводный балл BenchLM", get: m => m.bench, fmt: v => v.toFixed(2), hi: 1 },
    { k: "swe", label: "SWE-bench Verified", get: m => m.b.swe, fmt: v => v.toFixed(1) + "%", hi: 1 },
    { k: "term", label: "Terminal-Bench 4.0", get: m => m.b.term, fmt: v => v.toFixed(1) + "%", hi: 1 },
    { k: "gpqa", label: "GPQA Diamond", get: m => m.b.gpqa, fmt: v => v.toFixed(1) + "%", hi: 1 },
    { k: "arc2", label: "ARC-AGI-2", get: m => m.b.arc2, fmt: v => v.toFixed(1) + "%", hi: 1 },
    { k: "hle", label: "Humanity's Last Exam", get: m => m.b.hle, fmt: v => v.toFixed(1) + "%", hi: 1 },
    { k: "mmlu", label: "MMLU-Pro", get: m => m.b.mmluPro, fmt: v => v.toFixed(1) + "%", hi: 1 },
    { k: "fact", label: "Точность фактов (AA)", get: m => m.b.factual, fmt: v => v.toFixed(0) + "%", hi: 1 },
    { k: "in", label: "Цена входа, $/1M", get: m => m.price.in, fmt: usd, hi: -1 },
    { k: "out", label: "Цена выхода, $/1M", get: m => m.price.out, fmt: usd, hi: -1 },
    { k: "cache", label: "Кэш-чтение, $/1M", get: m => m.price.cache, fmt: usd, hi: -1 },
    { k: "blended", label: "Смешанная цена", get: m => m.blended, fmt: usd, hi: -1 },
    { k: "speed", label: "Скорость вывода, tok/s", get: m => m.speed, fmt: v => nf(v), hi: 1 },
    { k: "lat", label: "Задержка до ответа, с", get: m => m.latency, fmt: v => v.toFixed(2).replace(".", ","), hi: -1 },
    { k: "ctx", label: "Контекст", get: m => m.ctx, fmt: tok, hi: 1 },
    { k: "out2", label: "Лимит выхода", get: m => m.out, fmt: tok, hi: 1 },
    { k: "rel", label: "Релиз", get: m => m.released, fmt: dt, hi: 0, str: 1 },
    { k: "cut", label: "Кат-офф знаний", get: m => m.cutoff, fmt: dt, hi: 0, str: 1 },
    { k: "lic", label: "Веса", get: m => m.license === "open" ? 1 : 0, fmt: (v, m) => m.license === "open" ? "открытые" : "только API", hi: 0 },
    { k: "mm", label: "Мультимодальность", get: m => m.multimodal ? 1 : 0, fmt: (v, m) => m.multimodal ? "да" : "нет", hi: 0 },
  ];

  function renderCompare() {
    const host = $("#cmpCards"); if (!host) return;
    const ids = Array.from(state.compare);
    const ms = ids.map(id => byId[id]).filter(Boolean);
    host.innerHTML = "";
    $("#cmpRadar") && chartRadar($("#cmpRadar"), ids);
    if (!ms.length) {
      host.appendChild(el("div", { class: "cmp-empty card", html: icon("columns", 22) + "<p style='margin-top:8px'>Отметьте модели галочкой в таблице «Сводный рейтинг» — до четырёх штук.</p>" }));
      $("#cmpSummary") && ($("#cmpSummary").textContent = "");
      return;
    }
    host.style.gridTemplateColumns = "repeat(" + Math.min(4, ms.length) + ",minmax(0,1fr))";
    const winners = {};
    CMP_ROWS.forEach(r => {
      if (!r.hi) return;
      let bv = null, bid = null;
      ms.forEach(m => { const v = r.get(m); if (v === null || v === undefined) return; if (bv === null || (r.hi > 0 ? v > bv : v < bv)) { bv = v; bid = m.id; } });
      if (ms.filter(m => r.get(m) === bv).length === 1) winners[r.k] = bid;
    });
    ms.forEach(m => {
      const lc = labColor(m.lab);
      const card = el("article", { class: "cmp-card rise in" }, [
        el("div", { class: "cmp-hd" }, [
          el("span", { class: "lchip", style: "background:" + lc }),
          el("div", {}, [
            el("div", { class: "nm", html: '<a href="' + m.url + '" target="_blank" rel="noopener noreferrer">' + esc(m.name) + "</a>" }),
            el("div", { class: "lb", text: m.lab + " · " + m.cfg + (m.new ? " · NEW" : "") }),
          ]),
        ]),
        el("div", { class: "cmp-rows" }, CMP_ROWS.filter(r => {
          const v = r.get(m); return v !== null && v !== undefined && v !== "";
        }).map(r => {
          const v = r.get(m);
          const isWin = winners[r.k] === m.id;
          return el("div", { class: "cmp-r", title: r.hint || null }, [
            el("span", { class: "k", text: r.label }),
            el("span", { class: "v " + (isWin ? "win" : ""), html: (isWin ? icon("check", 11) + " " : "") + esc(r.fmt(v, m)) }),
          ]);
        })),
        (m.badges && m.badges.length) ? el("div", { style: "padding:8px 12px;border-top:1px solid var(--color-border);background:var(--surface-2);display:flex;flex-wrap:wrap;gap:4px" },
          m.badges.map(b => el("span", { class: "pill new", text: b }))) : null,
        m.priceNote ? el("div", { style: "padding:8px 12px;font-size:11px;color:var(--color-muted-foreground);border-top:1px solid var(--color-border)", text: m.priceNote }) : null,
      ]);
      host.appendChild(card);
    });
    const sum = $("#cmpSummary");
    if (sum) {
      const cheapest = ms.slice().sort((a, b) => (a.blended === null ? 1e9 : a.blended) - (b.blended === null ? 1e9 : b.blended))[0];
      const smartest = ms.slice().sort((a, b) => (intel(b) || 0) - (intel(a) || 0))[0];
      const parts = [];
      if (smartest) parts.push("По качеству впереди " + smartest.name + (smartest.aa !== null ? " (AA Index " + smartest.aa.toFixed(1) + ")" : ""));
      if (cheapest && cheapest.blended !== null) parts.push("дешевле всех " + cheapest.name + " — " + usd(cheapest.blended) + " за 1M смешанных токенов");
      const w = {};
      CMP_ROWS.forEach(r => { if (winners[r.k]) { const m = byId[winners[r.k]]; w[m.name] = (w[m.name] || 0) + 1; } });
      const lead = Object.entries(w).sort((a, b) => b[1] - a[1])[0];
      if (lead) parts.push("больше всего первых мест у " + lead[0] + " (" + lead[1] + ")");
      sum.textContent = parts.join(", ") + ".";
    }
  }
  window.__amiRenderCompare = renderCompare;

  /* ---------------- calculator ---------------- */
  function buildCalc() {
    const s = el("section", { class: "sec", id: "calc" }, [el("div", { class: "wrap" }, [])]);
    const w = s.firstChild;
    w.appendChild(el("div", { class: "sec-hd" }, [
      el("h2", { html: icon("calc", 18) + "<span>Калькулятор стоимости</span>" }),
      el("p", { class: "hint", text: "Задайте месячный объём токенов — таблица пересчитает стоимость для всех моделей с опубликованной ценой. Учтён кэш-хит: попадание в кэш обычно дешевле в 10–20 раз." }),
    ]));
    const card = el("div", { class: "panel calc", style: "padding:12px" });
    const ctl = el("div", {});
    const out = el("div", { class: "card", style: "overflow:hidden" });
    card.appendChild(ctl); card.appendChild(out); w.appendChild(card); $("#app").appendChild(s);

    const f = (label, node) => el("div", { class: "field" }, [el("label", {}, [el("span", { text: label })]), node]);
    const inR = el("input", { type: "range", min: "1", max: "2000", step: "1", value: state.calc.inTok });
    const outR = el("input", { type: "range", min: "0", max: "1000", step: "1", value: state.calc.outTok });
    const cacheR = el("input", { type: "range", min: "0", max: "95", step: "5", value: state.calc.cache });
    const inV = el("span", { class: "rv" }); const outV = el("span", { class: "rv" }); const cacheV = el("span", { class: "rv" });
    ctl.appendChild(f("Входных токенов в месяц (млн)", el("div", {}, [inR, inV])));
    ctl.appendChild(f("Выходных токенов в месяц (млн)", el("div", {}, [outR, outV])));
    ctl.appendChild(f("Доля попаданий в кэш, %", el("div", {}, [cacheR, cacheV])));
    ctl.appendChild(el("div", { class: "panel-note", style: "border:1px solid var(--color-border);border-radius:var(--radius)", html: icon("info", 12) + " Формула: вход × (1 − кэш) + вход × кэш × цена_кэша + выход. Если цена кэша не опубликована, считается без скидки." }));

    function calc() {
      const I = +inR.value, O = +outR.value, C = +cacheR.value / 100;
      inV.textContent = " " + nf(I) + "M"; outV.textContent = " " + nf(O) + "M"; cacheV.textContent = " " + Math.round(C * 100) + "%";
      const rows = D.MODELS.filter(m => m.price.in !== null || m.price.out !== null).map(m => {
        const cin = m.price.in || 0, cout = m.price.out || 0;
        const cc = m.price.cache === null || m.price.cache === undefined ? cin : m.price.cache;
        const cost = I * (cin * (1 - C) + cc * C) + O * cout;
        return { m, cost };
      }).sort((a, b) => a.cost - b.cost);
      out.innerHTML = "";
      out.appendChild(el("div", { class: "cost-row head" }, [
        el("span", { text: "Модель" }), el("span", { class: "v", text: "В месяц" }), el("span", { class: "v", text: "Отн. минимума" }),
      ]));
      const min = rows.length ? rows[0].cost : 1;
      rows.slice(0, 22).forEach((r, i) => {
        out.appendChild(el("div", { class: "cost-row" + (i === 0 ? " hi" : "") }, [
          el("span", { html: '<span style="color:' + labColor(r.m.lab) + '">●</span> <b>' + esc(r.m.name) + '</b> <span class="muted" style="font-size:11px">' + esc(r.m.lab) + "</span>" }),
          el("span", { class: "v", text: money(r.cost) }),
          el("span", { class: "v muted", text: i === 0 ? "минимум" : "×" + (r.cost / (min || 1)).toFixed(r.cost / (min || 1) < 10 ? 1 : 0) }),
        ]));
      });
      if (rows.length > 22) out.appendChild(el("div", { class: "panel-note", text: "Показаны 22 самые дешёвые из " + rows.length + " моделей с опубликованной ценой." }));
    }
    function money(v) {
      if (v >= 1e6) return "$" + (v / 1e6).toFixed(2) + "M";
      if (v >= 1000) return "$" + nf(Math.round(v));
      if (v >= 1) return "$" + v.toFixed(2);
      return "$" + v.toFixed(3);
    }
    [inR, outR, cacheR].forEach(r => r.addEventListener("input", calc));
    calc();
  }

  /* ---------------- agents + speed ---------------- */
  function buildAgents() {
    const s = el("section", { class: "sec", id: "agents" }, [el("div", { class: "wrap" }, [])]);
    const w = s.firstChild;
    w.appendChild(el("div", { class: "sec-hd" }, [
      el("h2", { html: icon("bot", 18) + "<span>Агенты и инфраструктура</span>" }),
      el("p", { class: "hint", text: "Agent Arena меряет не ответы, а выполненные задачи в реальном окружении, и считает стоимость одной задачи. Рядом — средняя скорость и задержка по лабораториям." }),
    ]));
    const g = el("div", { class: "g2" });
    const p1 = panel("bot", "Agent Arena: доля побед и цена задачи", "right", el("div", { id: "agentChart", class: "panel-bd" }),
      el("div", { class: "panel-note", html: icon("info", 12) + " Строки без места в топ-10 показаны для Парето-фронта по цене. GPT-6 Luna (Low) стоит $0.01 за задачу и выигрывает 4.59% — дёшево, но потолок низкий." }));
    const p2 = panel("gauge", "Скорость и задержка по лабораториям", "right", el("div", { id: "provChart", class: "panel-bd" }),
      el("div", { class: "panel-note", html: icon("info", 12) + " Средние по всем моделям лаборатории. Задержка — секунды до первого ответа. Разрыв между Anthropic (112.8 с) и Google (18 с) объясняется режимом глубокого рассуждения." }));
    g.appendChild(p1); g.appendChild(p2); w.appendChild(g); $("#app").appendChild(s);

    /* agents */
    const host = $("#agentChart");
    const maxWin = Math.max(...D.AGENTS.map(a => a.win));
    D.AGENTS.forEach((a, i) => {
      host.appendChild(el("div", { class: "hbar-row rise", style: "grid-template-columns:190px 1fr 108px;transition-delay:" + (REDUCED ? 0 : i * 20) + "ms" }, [
        el("span", { class: "hbar-lab", html: (typeof a.rank === "number" ? '<b class="num" style="color:var(--color-muted-foreground)">' + a.rank + '.</b> ' : "") + '<span style="color:' + labColor(a.lab) + '">●</span> ' + esc(a.model) }),
        el("span", { class: "hbar-tr" }, [el("i", { style: "width:" + ((a.win / maxWin) * 100).toFixed(1) + "%;background:" + (a.rank <= 3 ? "var(--color-accent)" : "var(--color-secondary)") })]),
        el("span", { class: "hbar-val", html: a.win.toFixed(2) + "% " + (a.cost !== null ? '<span class="muted" style="font-weight:400">· ' + usd(a.cost) + "</span>" : "") }),
      ]));
    });

    /* providers */
    const ph = $("#provChart");
    const maxS = Math.max(...D.PROVIDERS.map(p => p.speed));
    const maxL = Math.max(...D.PROVIDERS.map(p => p.latency));
    D.PROVIDERS.forEach((p, i) => {
      const box = el("div", { class: "rise", style: "padding:5px 0;transition-delay:" + (REDUCED ? 0 : i * 18) + "ms" }, [
        el("div", { style: "display:flex;gap:6px;align-items:baseline;font-size:11px;margin-bottom:3px" }, [
          el("b", { text: p.name }),
          el("span", { class: "muted num", text: p.models + " модалей" }),
          el("span", { class: "num", style: "margin-left:auto", html: '<b>' + nf(p.speed) + '</b> tok/s' }),
          el("span", { class: "num muted", text: p.latency.toFixed(1).replace(".", ",") + " с" }),
        ]),
        el("div", { class: "hbar-tr", style: "height:6px" }, [el("i", { style: "width:" + ((p.speed / maxS) * 100).toFixed(1) + "%;background:var(--color-secondary)" })]),
        el("div", { class: "hbar-tr", style: "height:6px;margin-top:2px" }, [el("i", { style: "width:" + ((p.latency / maxL) * 100).toFixed(1) + "%;background:var(--color-destructive);opacity:.75" })]),
      ]);
      ph.appendChild(box);
    });
    ph.appendChild(el("div", { class: "legend" }, [
      el("span", { html: '<i style="background:var(--color-secondary)"></i>скорость вывода, tok/s (больше — лучше)' }),
      el("span", { html: '<i style="background:var(--color-destructive)"></i>задержка до первого ответа, с (меньше — лучше)' }),
    ]));
  }

  function panel(ic, title, side, body, note) {
    return el("div", { class: "panel rise" }, [
      el("div", { class: "panel-hd" }, [el("h3", { html: icon(ic, 16) + "<span>" + title + "</span>" }), side ? el("div", { class: "right", id: "ph-" + ic }) : null]),
      body, note || null,
    ]);
  }

  /* ---------------- benchmarks section ---------------- */
  function buildBenchmarks() {
    const s = el("section", { class: "sec", id: "benchmarks" }, [el("div", { class: "wrap" }, [])]);
    const w = s.firstChild;
    w.appendChild(el("div", { class: "sec-hd" }, [
      el("h2", { html: icon("chart", 18) + "<span>Бенчмарки и рейтинги</span>" }),
      el("p", { class: "hint", text: "Разные доски меряют разное: Arena — человеческие предпочтения, SWE-bench — реальные правки в репозиториях, GPQA — науку уровня PhD, AA Factual — как часто модель ошибается." }),
    ]));

    const g1 = el("div", { class: "g2" });
    const arenaPanel = panel("trophy", "Топ-15 по качеству", null, el("div", { id: "arenaChart", class: "panel-bd" }), null);
    const seg1 = el("div", { class: "seg" }, [
      segBtn("arena", "Arena Elo", true), segBtn("aa", "AA Index", false),
    ]);
    $(".panel-hd", arenaPanel).appendChild(el("div", { class: "right" }, [seg1]));
    arenaPanel.appendChild(el("div", { class: "panel-note", html: icon("info", 12) + " Arena Elo — по " + nf(D.META.arenaVotes) + " слепым голосам; шкала обрезана снизу, чтобы различия были видны. AA Intelligence Index v4.3.2 собирают из 10 независимых прогонов." }));
    const benchPanel = panel("activity", "Бенчмарки", null, el("div", { id: "benchChart", class: "panel-bd" }), null);
    const seg2 = el("div", { class: "seg" }, [
      segBtn("multi", "Все", true), segBtn("swe", "SWE-bench", false), segBtn("gpqa", "GPQA", false),
      segBtn("term", "Terminal", false), segBtn("factual", "Факты", false),
    ]);
    $(".panel-hd", benchPanel).appendChild(el("div", { class: "right" }, [seg2]));
    benchPanel.appendChild(el("div", { class: "panel-note", html: icon("info", 12) + " Показаны 8 моделей с наибольшим покрытием бенчмарков. пустая дорожка — лаборатория результат не публиковала, а независимого прогона нет." }));
    g1.appendChild(arenaPanel); g1.appendChild(benchPanel);
    w.appendChild(g1);

    function segBtn(v, label, on) {
      const b = el("button", { type: "button", "aria-pressed": on ? "true" : "false", text: label });
      b.addEventListener("click", () => {
        $$("button", b.parentNode).forEach(x => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        if (b.parentNode === seg1) chartArena($("#arenaChart"), v);
        else chartBench($("#benchChart"), v);
      });
      return b;
    }
    $("#app").appendChild(s);
    chartArena($("#arenaChart"), "arena");
    chartBench($("#benchChart"), "multi");
  }

  /* ---------------- price/perf section ---------------- */
  function buildPricePerf() {
    const s = el("section", { class: "sec", id: "price-perf" }, [el("div", { class: "wrap" }, [])]);
    const w = s.firstChild;
    w.appendChild(el("div", { class: "sec-hd" }, [
      el("h2", { html: icon("scale", 18) + "<span>Цена против качества</span>" }),
      el("p", { class: "hint", text: "Главный график для выбора модели: левее и выше — выгоднее. Точки над зелёной пунктирной линией образуют Парето-фронт." }),
    ]));
    const p = panel("trending", "Смешанная цена за 1M токенов × качество", null, el("div", { id: "scatter", class: "panel-bd" }), el("div", { class: "panel-note" }));
    p.appendChild(el("div", { class: "legend" }, [
      el("span", { html: '<i style="background:var(--color-primary)"></i>закрытая модель (API)' }),
      el("span", { html: '<i style="background:var(--color-success)"></i>открытые веса' }),
      el("span", { html: '<i style="background:transparent;border-top:2px dashed var(--color-success);height:0"></i>Парето-фронт' }),
      el("span", { text: "крупная точка — на фронте" }),
    ]));
    w.appendChild(p);
    const g = el("div", { class: "g3", style: "margin-top:8px" });
    g.appendChild(statCard("wallet", "Самый дешёвый API", "Celeris-1", "$0.04 вход / $0 вывод за 1M", "Но качество 28.4 балла BenchLM — годится только на массовую классификацию."));
    g.appendChild(statCard("coins", "Лучшая выгода (открытые)", "MiMo-V2.6-Pro", "84.7 балла на $1 вывода", "Xiaomi, $0.43 / $0.87, AA Index 46.3 — сильнейшая открытая модель."));
    g.appendChild(statCard("trophy", "Лучшая выгода (закрытые)", "GPT-6.1 Sol", "8.4 балла на $1 вывода", "AA Index 51.8 при $2 / $10 — самая дешёвая модель верхнего тира."));
    w.appendChild(g);
    $("#app").appendChild(s);
    chartPricePerf($("#scatter"));
  }
  function statCard(ic, k, v, m, note) {
    return el("div", { class: "panel rise" }, [
      el("div", { class: "panel-bd" }, [
        el("div", { class: "kpi-k", html: icon(ic, 13) + "<span>" + k + "</span>" }),
        el("div", { style: "font-size:17px;font-weight:600;margin-top:6px;letter-spacing:-.02em", text: v }),
        el("div", { class: "num", style: "font-family:var(--font-data);font-size:12px;color:var(--color-accent);margin-top:2px", text: m }),
        el("p", { class: "muted", style: "font-size:11px;margin-top:6px;line-height:1.5", text: note }),
      ]),
    ]);
  }

  /* ---------------- compare section shell ---------------- */
  function buildCompare() {
    const s = el("section", { class: "sec", id: "compare" }, [el("div", { class: "wrap" }, [])]);
    const w = s.firstChild;
    w.appendChild(el("div", { class: "sec-hd" }, [
      el("h2", { html: icon("columns", 18) + "<span>Сравнение моделей</span>" }),
      el("p", { class: "hint", text: "До четырёх моделей. Галочки ставятся в таблице «Сводный рейтинг» или кликом по точке на графике цены." }),
    ]));
    const g = el("div", { class: "g2" });
    const radarPanel = panel("target", "Профиль возможностей", null, el("div", { id: "cmpRadar", class: "panel-bd" }), null);
    const cardsPanel = el("div", { class: "panel rise" }, [
      el("div", { class: "panel-hd" }, [el("h3", { html: icon("columns", 16) + "<span>Показатели" })]),
      el("div", { class: "panel-bd" }, [el("p", { id: "cmpSummary", class: "muted", style: "font-size:12px;margin-bottom:10px" })]),
      el("div", { id: "cmpCards", class: "cmp-grid", style: "padding:0 12px 12px" }),
    ]);
    g.appendChild(radarPanel); g.appendChild(cardsPanel);
    w.appendChild(g); $("#app").appendChild(s);
    renderCompare();
  }

  /* ---------------- timeline ---------------- */
  function buildNews() {
    const s = el("section", { class: "sec", id: "news" }, [el("div", { class: "wrap" }, [])]);
    const w = s.firstChild;
    w.appendChild(el("div", { class: "sec-hd" }, [
      el("h2", { html: icon("clock", 18) + "<span>Хронология релизов</span>" }),
      el("p", { class: "hint", text: "Что вышло и что изменилось в цифрах — сентябрь и октябрь 2026." }),
    ]));
    const tl = el("div", { class: "tl" });
    D.TIMELINE.forEach((t, i) => {
      tl.appendChild(el("article", { class: "tl-item rise", style: "--lc:" + labColor(t.lab) + ";transition-delay:" + (REDUCED ? 0 : Math.min(i, 8) * 30) + "ms" }, [
        el("div", { class: "tl-d", html: "<b>" + dt(t.date) + "</b><span class='pill lab' style='--lab:" + labColor(t.lab) + "'>" + esc(t.lab) + "</span>" }),
        el("h3", { class: "tl-t", text: t.title }),
        el("p", { class: "tl-x", text: t.text }),
      ]));
    });
    w.appendChild(tl); $("#app").appendChild(s);
  }

  /* ---------------- subscriptions ---------------- */
  function buildPlans() {
    const s = el("section", { class: "sec", id: "plans" }, [el("div", { class: "wrap" }, [])]);
    const w = s.firstChild;
    w.appendChild(el("div", { class: "sec-hd" }, [
      el("h2", { html: icon("wallet", 18) + "<span>Подписки для людей, а не для API</span>" }),
      el("p", { class: "hint", text: "Если модель нужна в чате, а не в коде — платят за подписку. Цены в долларах в месяц." }),
    ]));
    const g = el("div", { class: "sub-grid" });
    D.SUBSCRIPTIONS.forEach((sb, i) => {
      const card = el("div", { class: "sub rise", style: "transition-delay:" + (REDUCED ? 0 : i * 40) + "ms" }, [
        el("div", { class: "sub-hd" }, [
          el("div", { class: "p", text: sb.product }),
          el("div", { class: "v", text: sb.vendor }),
        ]),
      ]);
      sb.plans.forEach(p => {
        card.appendChild(el("div", { class: "sub-plan" + (p.price === 0 ? " free" : "") }, [
          el("div", { style: "min-width:0" }, [
            el("div", { class: "n", text: p.name }),
            el("div", { class: "nt", text: p.note }),
          ]),
          el("div", { class: "pr", text: p.price === 0 ? "бесплатно" : "$" + p.price }),
        ]));
      });
      g.appendChild(card);
    });
    w.appendChild(g);
    w.appendChild(el("div", { class: "panel-note card", style: "margin-top:8px;border-radius:var(--radius)", html: icon("alert", 12) + " Цены подписок меняются реже цен API, но тариф Grok и лимиты Muse Code указаны оценочно — перед оплатой сверяйте страницу провайдера." }));
    $("#app").appendChild(s);
  }

  /* ---------------- sources ---------------- */
  function buildSources() {
    const s = el("section", { class: "sec", id: "sources" }, [el("div", { class: "wrap" }, [])]);
    const w = s.firstChild;
    w.appendChild(el("div", { class: "sec-hd" }, [
      el("h2", { html: icon("book", 18) + "<span>Источники и методика</span>" }),
      el("p", { class: "hint", text: "Каждое число на сайте взято из одного из этих источников. Дата проверки указана в карточке." }),
    ]));
    const g = el("div", { class: "src" });
    D.SOURCES.forEach(src => {
      g.appendChild(el("a", { class: "src-i rise", href: src.url, target: "_blank", rel: "noopener noreferrer", style: "display:block;text-decoration:none;color:inherit" }, [
        el("div", { class: "t", html: icon("external", 13) + "<span>" + esc(src.name) + "</span>" }),
        el("div", { class: "w", text: src.what }),
        el("div", { class: "d", text: "проверено " + src.checked }),
      ]));
    });
    w.appendChild(g);
    w.appendChild(el("div", { class: "panel rise", style: "margin-top:8px" }, [
      el("div", { class: "panel-hd" }, [el("h3", { html: icon("alert", 16) + "<span>Как читать эти цифры</span>" })]),
      el("div", { class: "panel-bd" }, [el("ul", { class: "cav" }, D.CAVEATS.map(c => el("li", { html: icon("info", 14) + "<span>" + esc(c) + "</span>" })))]),
    ]));
    w.appendChild(el("div", { class: "panel rise", style: "margin-top:8px" }, [
      el("div", { class: "panel-hd" }, [el("h3", { html: icon("git", 16) + "<span>Как обновлять данные</span>" })]),
      el("div", { class: "panel-bd" }, [
        el("p", { class: "muted", style: "font-size:12px;line-height:1.6", html: "Весь сайт читает один файл — <code class='mono' style='color:var(--color-primary)'>data.js</code>. Достаточно заменить значения в массивах <code class='mono'>MODELS</code>, <code class='mono'>CATEGORIES</code>, <code class='mono'>TIMELINE</code> и дату в <code class='mono'>META</code>. Пересчёт мест, Парето-фронта, лучших значений и калькулятора происходит автоматически." }),
        el("div", { class: "chips", style: "margin-top:10px" }, [
          el("a", { class: "chip", href: "https://arena.ai/leaderboard/chat/text", target: "_blank", rel: "noopener noreferrer", html: icon("trophy", 12) + "<span>Arena Elo</span>" }),
          el("a", { class: "chip", href: "https://benchlm.ai/llm-pricing", target: "_blank", rel: "noopener noreferrer", html: icon("wallet", 12) + "<span>Цены API</span>" }),
          el("a", { class: "chip", href: "https://artificialanalysis.ai/models", target: "_blank", rel: "noopener noreferrer", html: icon("brain", 12) + "<span>Intelligence Index</span>" }),
          el("a", { class: "chip", href: "https://benchlm.ai/llm-speed", target: "_blank", rel: "noopener noreferrer", html: icon("zap", 12) + "<span>Скорость</span>" }),
        ]),
      ]),
    ]));
    $("#app").appendChild(s);
  }

  /* ---------------- footer ---------------- */
  function buildFooter() {
    const f = el("footer", { class: "ft" }, [el("div", { class: "wrap ft-in" }, [
      el("span", { html: icon("activity", 13) + " <b>AI Model Index</b>" }),
      el("span", { text: "Снимок данных: " + dt(D.META.snapshot) + " · " + D.MODELS.length + " моделей · " + D.CATEGORIES.length + " категорий · авто-проверка цен: " + stampFmt(D.META.autoChecked || D.META.snapshot) }),
      el("span", { class: "sp muted", text: D.META.updateNote }),
    ])]);
    document.body.appendChild(f);
  }

  /* ---------------- reveal + scrollspy ---------------- */
  function observe() {
    const items = $$(".rise");
    if (REDUCED || !("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in")); return; }
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .05 });
    items.forEach(i => io.observe(i));
  }
  function scrollspy() {
    const links = $$(".nav a");
    const secs = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
    if (!secs.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id ? "true" : "false"));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    secs.forEach(s => io.observe(s));
  }

  /* ---------------- boot ---------------- */
  function boot() {
    const app = el("div", { id: "app" });
    document.body.appendChild(app);
    document.body.prepend(el("a", { class: "skip", href: "#leaderboard", text: "Перейти к рейтингу моделей" }));
    buildHeader(); applyTheme();
    buildHero(); buildWinners(); buildTable(); buildPricePerf(); buildBenchmarks(); buildCompare(); buildCalc(); buildAgents(); buildNews(); buildPlans(); buildSources();
    buildFooter();
    observe(); scrollspy();
    /* keep table + compare in sync when toggled from charts */
    const origToggle = window.__amiToggleCompare;
    window.__amiToggleCompare = function (id, on) {
      origToggle(id, on); renderCompare();
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
