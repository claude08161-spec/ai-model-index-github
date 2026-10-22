/* ============================================================
   AI MODEL INDEX — dataset
   Snapshot: 2026-10-22 (sources checked 2026-10-20/21)
   How to update: edit this file only. Every section is documented.
   `null` = value not published / not measured by the source.
   ============================================================ */

window.AMI = (function () {
  "use strict";

  /* ---------- meta ---------- */
  const META = {
    title: "AI Model Index",
    tagline: "Актуальная статистика нейросетей: кто где лучше, сколько стоит и как быстро работает",
    snapshot: "2026-10-22",
    sourcesChecked: "2026-10-22",
    autoChecked: "2026-10-22T21:00",
    arenaVotes: 8900458,
    arenaModels: 417,
    trackedHere: 38,
    updateNote:
      "Релизы моделей выходят каждые 3–7 дней. Данные — снимок на дату выше; перед принятием решения сверяйте первоисточники из раздела «Источники».",
  };

  /* ---------- labs ---------- */
  const LABS = {
    Anthropic: { color: "#E08A5B", country: "US", flag: "🇺🇸" },
    OpenAI: { color: "#3B82F6", country: "US", flag: "🇺🇸" },
    Google: { color: "#22C55E", country: "US", flag: "🇺🇸" },
    Meta: { color: "#3B82F6", country: "US", flag: "🇺🇸" },
    xAI: { color: "#94A3B8", country: "US", flag: "🇺🇸" },
    DeepSeek: { color: "#8B5CF6", country: "CN", flag: "🇨🇳" },
    Alibaba: { color: "#F97316", country: "CN", flag: "🇨🇳" },
    Moonshot: { color: "#06B6D4", country: "CN", flag: "🇨🇳" },
    "Z.ai": { color: "#EF4444", country: "CN", flag: "🇨🇳" },
    Xiaomi: { color: "#F59E0B", country: "CN", flag: "🇨🇳" },
    MiniMax: { color: "#EC4899", country: "CN", flag: "🇨🇳" },
    StepFun: { color: "#14B8A6", country: "CN", flag: "🇨🇳" },
    Mistral: { color: "#F97316", country: "FR", flag: "🇫🇷" },
    Inception: { color: "#A78BFA", country: "US", flag: "🇺🇸" },
    LiquidAI: { color: "#38BDF8", country: "US", flag: "🇺🇸" },
    Celeris: { color: "#FBBF24", country: "US", flag: "🇺🇸" },
    Reflection: { color: "#818CF8", country: "US", flag: "🇺🇸" },
    NVIDIA: { color: "#84CC16", country: "US", flag: "🇺🇸" },
  };

  /* ---------- model catalogue ----------
     arena   — Elo текстового Arena (arena.ai/leaderboard/chat/text), лучшая конфигурация модели
     aa      — Artificial Analysis Intelligence Index v4.3.2 (max effort)
     bench   — сводный балл BenchLM (0–100)
     in/out/cache — $ за 1M токенов
     speed   — output tok/s, latency — секунды до первого ответа
     ctx/out — контекст и лимит выхода, в токенах
     cfg     — конфигурация, в которой снят Elo
  ------------------------------------- */
  const MODELS = [
    { id:"gemini-4-argon", name:"Gemini 4 Argon", lab:"Google", license:"closed", tier:"frontier", released:"2026-09-30", cfg:"High",
      arena:1524, arenaCi:9, votes:4900, prelim:true, aa:52.6, bench:82.93,
      b:{ gpqa:96.4, term:57.1 },
      price:{ in:2, out:10, cache:0.10 }, priceNote:"Вводная цена до 30.11.2026, затем $4 / $20",
      speed:null, latency:null, ctx:1000000, out:null, cutoff:"2026-03", multimodal:true,
      badges:["#1 Text Arena","Лидер GPQA"], url:"https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/" },

    { id:"muse-wonder-max", name:"Muse Wonder (Max)", lab:"Meta", license:"closed", tier:"frontier", released:"2026-10-12", cfg:"Max",
      arena:1510, arenaCi:9, votes:5099, aa:null, bench:71.43, b:{ term:57.1, sweM:57.5 },
      price:{ in:4, out:20, cache:0.20 }, speed:161, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["Самая быстрая среди score 70+"], url:"https://research.meta.ai/blog/muse-wonder" },

    { id:"claude-opus-5-5", name:"Claude Opus 5.5", lab:"Anthropic", license:"closed", tier:"frontier", released:"2026-09-22", cfg:"High / Max",
      arena:1509, arenaCi:7, votes:9496, aa:57.6, bench:86.69,
      b:{ term:60.0, factual:41.0, gdpval:null },
      price:{ in:4, out:20, cache:0.20 }, speed:12, latency:8.4, ctx:1000000, out:null, cutoff:"2026-06", multimodal:true,
      badges:["#1 Agents Arena","#1 WebDev Arena","#1 Intelligence Index","#1 SWE-bench Pro"],
      url:"https://www.anthropic.com/claude-opus-5-5" },

    { id:"claude-fable-5-1", name:"Claude Fable 5.1 (Max)", lab:"Anthropic", license:"closed", tier:"frontier", released:"2026-09", cfg:"Max",
      arena:1503, arenaCi:6, votes:15623, aa:54.0, bench:83.25,
      b:{ factual:67, mmluPro:91.5 },
      price:{ in:10, out:50, cache:0.25 }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["Макс. фактическая точность (67%)","#1 Writing"],
      url:"https://www.anthropic.com/claude-fable-and-mythos-5-1" },

    { id:"claude-fable-5", name:"Claude Fable 5 (High)", lab:"Anthropic", license:"closed", tier:"frontier", released:"2026-08", cfg:"High",
      arena:1504, arenaCi:4, votes:43399, aa:null, bench:81.35,
      b:{ swe:95.0, mmluPro:91.5 },
      price:{ in:10, out:50, cache:1.00 }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://www.anthropic.com/news/claude-fable-5-mythos-5" },

    { id:"claude-opus-5", name:"Claude Opus 5 (Max)", lab:"Anthropic", license:"closed", tier:"frontier", released:"2026-07", cfg:"Max",
      arena:1491, arenaCi:5, votes:33683, aa:null, bench:80.11,
      b:{ swe:96.0 },
      price:{ in:5, out:25, cache:0.50 }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["Рекорд SWE-bench Verified (96%)"],
      url:"https://www.anthropic.com/news/claude-opus-5" },

    { id:"claude-opus-4-8", name:"Claude Opus 4.8", lab:"Anthropic", license:"closed", tier:"frontier", released:"2026", cfg:"High",
      arena:1481, arenaCi:4, votes:64063, aa:null, bench:69.98,
      b:{ swe:88.6, mmluPro:91.8 },
      price:{ in:5, out:25, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["Рекорд MMLU-Pro (91.8%)"], url:"https://www.anthropic.com/news/claude-opus-4-8" },

    { id:"claude-opus-4-6", name:"Claude Opus 4.6", lab:"Anthropic", license:"closed", tier:"frontier", released:"2026", cfg:"High",
      arena:1503, arenaCi:3, votes:82619, aa:null, bench:null,
      b:{ swe:80.8, gpqa:90.5, mmluPro:82.0 },
      price:{ in:5, out:25, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://www.anthropic.com/news/claude-opus-4-6" },

    { id:"gpt-6-astra", name:"GPT-6 Astra (Max)", lab:"OpenAI", license:"closed", tier:"frontier", released:"2026-09", cfg:"Max",
      arena:1476, arenaCi:6, votes:13293, aa:53.0, bench:84.03,
      b:{ gpqa:95.8, arc2:95.0, liveReason:92.65, hle:92.7, mmmu:91.5 },
      price:{ in:10, out:50, cache:1.00 }, speed:null, latency:null, ctx:1050000, out:null, cutoff:"2026-04", multimodal:true,
      badges:["#1 ARC-AGI-2 (95%)","#1 LiveBench Reasoning"], url:"https://openai.com/index/gpt-6-astra/" },

    { id:"gpt-6-1-sol", name:"GPT-6.1 Sol (Max)", lab:"OpenAI", license:"closed", tier:"frontier", released:"2026-09-29", cfg:"Max",
      arena:1479, arenaCi:8, votes:7453, aa:51.8, bench:84.19,
      b:{ gpqa:95.4, factual:62, term:60.0 },
      price:{ in:2, out:10, cache:0.10 }, speed:null, latency:null, ctx:1050000, out:null, cutoff:"2026-04", multimodal:true,
      badges:["Самый дешёвый в топ-тире","$0.72 за задачу индекса"], url:"https://openai.com/index/introducing-gpt-6-1-sol/" },

    { id:"gpt-6-sol", name:"GPT-6 Sol", lab:"OpenAI", license:"closed", tier:"frontier", released:"2026", cfg:"Max",
      arena:null, arenaCi:null, votes:null, aa:null, bench:78.58, b:{},
      price:{ in:2, out:10, cache:0.20 }, speed:null, latency:null, ctx:1050000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://openai.com/index/gpt-6/" },

    { id:"gpt-6-luna", name:"GPT-6 Luna", lab:"OpenAI", license:"closed", tier:"budget", released:"2026", cfg:"Max",
      arena:null, arenaCi:null, votes:null, aa:38.1, bench:null,
      b:{ factual:77, omniscience:77 },
      price:{ in:0.1, out:0.5, cache:0.01 }, speed:197, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:false,
      badges:["Самый быстрый frontier-class (197 tok/s)","Дешевле всех в своём классе"], url:"https://openai.com/index/gpt-6-luna/" },

    { id:"gpt-5-6-sol", name:"GPT-5.6 Sol (xHigh)", lab:"OpenAI", license:"closed", tier:"frontier", released:"2026", cfg:"xHigh",
      arena:1484, arenaCi:4, votes:41803, aa:null, bench:75.32, b:{},
      price:{ in:4, out:20, cache:0.40 }, speed:null, latency:null, ctx:1050000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://openai.com/index/gpt-5-6/" },

    { id:"gpt-5-6-terra", name:"GPT-5.6 Terra", lab:"OpenAI", license:"closed", tier:"mid", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:70.19, b:{},
      price:{ in:2, out:12, cache:0.20 }, speed:null, latency:null, ctx:1050000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://openai.com/index/gpt-5-6/" },

    { id:"gpt-5-5", name:"GPT-5.5", lab:"OpenAI", license:"closed", tier:"frontier", released:"2026", cfg:"High",
      arena:1481, arenaCi:4, votes:69340, aa:null, bench:69.22, b:{},
      price:{ in:5, out:30, cache:0.50 }, speed:null, latency:null, ctx:1100000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://openai.com/index/introducing-gpt-5-5/" },

    { id:"gpt-5-5-pro", name:"GPT-5.5 Pro", lab:"OpenAI", license:"closed", tier:"frontier", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:73.48, b:{},
      price:{ in:30, out:180, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["Самый дорогой API ($30 / $180)"], url:"https://openai.com/index/gpt-5-5-pro/" },

    { id:"gpt-5-4", name:"GPT-5.4 (High)", lab:"OpenAI", license:"closed", tier:"mid", released:"2026", cfg:"High",
      arena:1475, arenaCi:4, votes:64755, aa:null, bench:null, b:{ gpqa:93.3 },
      price:{ in:2.50, out:15, cache:null }, speed:null, latency:null, ctx:1100000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://platform.openai.com/docs/models/gpt-5.4" },

    { id:"gpt-5-2", name:"GPT-5.2 Chat", lab:"OpenAI", license:"closed", tier:"mid", released:"2026-02-10", cfg:"—",
      arena:1475, arenaCi:4, votes:35991, aa:null, bench:null, b:{},
      price:{ in:1.75, out:14, cache:null }, speed:null, latency:null, ctx:400000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest" },

    { id:"claude-sonnet-5-5", name:"Claude Sonnet 5.5", lab:"Anthropic", license:"closed", tier:"mid", released:"2026-09-28", cfg:"xHigh / Max",
      arena:1477, arenaCi:7, votes:8126, aa:56.0, bench:82.25,
      b:{ gpqa:95.6, term:63.6, mmluPro:81.3, liveCode:56.3 },
      price:{ in:2, out:10, cache:0.10 }, speed:null, latency:null, ctx:1000000, out:null, cutoff:"2026-06", multimodal:true,
      badges:["#1 Terminal-Bench 4.0 (63.6%)","Бесплатно на claude.ai","$0.66 за задачу индекса"],
      url:"https://www.anthropic.com/claude-sonnet-5-5" },

    { id:"claude-haiku-5-5", name:"Claude Haiku 5.5", lab:"Anthropic", license:"closed", tier:"budget", released:"2026-10-07", cfg:"Max",
      arena:null, arenaCi:null, votes:null, aa:43.4, bench:null,
      b:{ factual:36, liveCode:57.2, webdev:1587 },
      price:{ in:0.10, out:0.50, cache:0.01 }, priceNote:"До 100K токенов промпта; выше — $0.50 / $2.50",
      speed:null, latency:null, ctx:1000000, out:128000, cutoff:"2026-06", multimodal:true,
      badges:["−75% к цене Haiku 4.5"], url:"https://www.anthropic.com/news/claude-haiku-5-5" },

    { id:"claude-sonnet-4-6", name:"Claude Sonnet 4.6", lab:"Anthropic", license:"closed", tier:"mid", released:"2026", cfg:"—",
      arena:1472, arenaCi:4, votes:70931, aa:null, bench:null, b:{ swe:79.6, gpqa:87.4, mmluPro:79.1 },
      price:{ in:1.50, out:7.50, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://www.anthropic.com/news/claude-sonnet-4-6" },

    { id:"claude-opus-4-5", name:"Claude Opus 4.5", lab:"Anthropic", license:"closed", tier:"frontier", released:"2025-11-01", cfg:"High",
      arena:1474, arenaCi:4, votes:37500, aa:null, bench:null, b:{ swe:80.9, mmluPro:90.0 },
      price:{ in:5, out:25, cache:0.5 }, speed:null, latency:null, ctx:200000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://www.anthropic.com/news/claude-opus-4-5" },

    { id:"grok-4-7", name:"Grok 4.7 (xHigh)", lab:"xAI", license:"closed", tier:"frontier", released:"2026-09-21", cfg:"xHigh",
      arena:null, arenaCi:null, votes:null, aa:48.0, bench:null, b:{},
      price:{ in:2, out:6, cache:0.5 }, speed:null, latency:null, ctx:500000, out:null, cutoff:null, multimodal:true,
      badges:["Минимум ограничений на контент","#1 Creativity"], url:"https://grok.com/" },

    { id:"grok-4-5", name:"Grok 4.5", lab:"xAI", license:"closed", tier:"mid", released:"2026", cfg:"—",
      arena:1448, arenaCi:null, votes:null, aa:null, bench:null, b:{ gpqa:93.4 },
      price:{ in:2, out:6, cache:0.3 }, speed:null, latency:null, ctx:500000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://docs.x.ai/developers/models" },

    { id:"grok-4-20", name:"Grok 4.20 Beta", lab:"xAI", license:"closed", tier:"mid", released:"2026-03-09", cfg:"Reasoning",
      arena:1472, arenaCi:4, votes:66403, aa:null, bench:null, b:{ swe:76.7 },
      price:{ in:1.25, out:2.50, cache:null }, speed:null, latency:null, ctx:2000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://docs.x.ai/developers/models/grok-4.20-beta-0309-reasoning" },

    { id:"gemini-3-8-flash", name:"Gemini 3.8 Flash (High)", lab:"Google", license:"closed", tier:"fast", released:"2026", cfg:"High",
      arena:1496, arenaCi:5, votes:41423, prelim:true, aa:40.9, bench:null, b:{ gpqa:95.4 },
      price:{ in:0.75, out:3.75, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["95.4% GPQA за $0.75"], url:"https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/" },

    { id:"gemini-3-7-flash", name:"Gemini 3.7 Flash (High)", lab:"Google", license:"closed", tier:"fast", released:"2026", cfg:"High",
      arena:1489, arenaCi:5, votes:29177, prelim:true, aa:null, bench:66.93, b:{ gpqa:94.8 },
      price:{ in:0.75, out:3.75, cache:null }, speed:285, latency:8.52, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/" },

    { id:"gemini-3-6-flash", name:"Gemini 3.6 Flash (High)", lab:"Google", license:"closed", tier:"fast", released:"2026", cfg:"High",
      arena:1483, arenaCi:4, votes:36079, prelim:true, aa:null, bench:null, b:{ gpqa:94.1 },
      price:{ in:0.75, out:3.75, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-6-flash-3-5-flash-lite-3-5-flash-cyber/" },

    { id:"gemini-3-5-flash", name:"Gemini 3.5 Flash (High)", lab:"Google", license:"closed", tier:"fast", released:"2026", cfg:"High",
      arena:1477, arenaCi:4, votes:48479, prelim:true, aa:null, bench:null, b:{},
      price:{ in:0.75, out:4.50, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/" },

    { id:"gemini-3-5-flash-lite", name:"Gemini 3.5 Flash-Lite", lab:"Google", license:"closed", tier:"budget", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:49.59, b:{},
      price:{ in:0.3, out:2.5, cache:0.03 }, speed:454, latency:8.16, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["454 tok/s"], url:"https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/" },

    { id:"gemini-3-1-pro", name:"Gemini 3.1 Pro", lab:"Google", license:"closed", tier:"mid", released:"2026", cfg:"Preview",
      arena:1487, arenaCi:3, votes:129523, aa:null, bench:null, b:{ gpqa:94.4 },
      price:{ in:1, out:6, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/" },

    { id:"gemini-3-pro", name:"Gemini 3 Pro", lab:"Google", license:"closed", tier:"mid", released:"2025", cfg:"—",
      arena:1485, arenaCi:4, votes:42059, aa:null, bench:null, b:{},
      price:{ in:2, out:12, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://aistudio.google.com/app/prompts/new_chat?model=gemini-3-pro-preview" },

    { id:"gemini-3-flash", name:"Gemini 3 Flash", lab:"Google", license:"closed", tier:"budget", released:"2025", cfg:"—",
      arena:1473, arenaCi:4, votes:31311, aa:null, bench:null, b:{},
      price:{ in:0.50, out:3, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://blog.google/products/gemini/gemini-3-flash" },

    { id:"muse-spark-1-3", name:"Muse Spark 1.3 (Max)", lab:"Meta", license:"closed", tier:"mid", released:"2026", cfg:"Max",
      arena:1495, arenaCi:5, votes:19323, aa:null, bench:null, b:{},
      price:{ in:1.25, out:4.25, cache:0.15 }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://developer.meta.com/ai/models/muse-spark/" },

    { id:"muse-spark-open", name:"Muse Spark Open", lab:"Meta", license:"open", tier:"open", released:"2026-10-15", cfg:"xHigh",
      arena:null, arenaCi:null, votes:null, aa:38.9, bench:null, b:{},
      price:{ in:null, out:null, cache:null }, priceNote:"Веса на Hugging Face, Meta Muse Model License",
      speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:false,
      params:"816B (42B активных)", badges:["816B MoE, открытые веса"], url:"https://ai.meta.com/blog/" },

    { id:"llama-4-scout", name:"Llama 4 Scout", lab:"Meta", license:"open", tier:"open", released:"2025", cfg:"—",
      arena:1287, arenaCi:null, votes:null, aa:null, bench:null, b:{},
      price:{ in:null, out:null, cache:null }, priceNote:"Открытые веса; бесплатно у части провайдеров",
      speed:null, latency:null, ctx:10000000, out:null, cutoff:null, multimodal:true, params:"109B",
      badges:["Рекорд контекста — 10M токенов"], url:"https://ai.meta.com/llama/" },

    { id:"qwen3-8-max", name:"Qwen3.8-Max", lab:"Alibaba", license:"closed", tier:"mid", released:"2026", cfg:"—",
      arena:1483, arenaCi:5, votes:29418, aa:46.0, bench:69.71, b:{},
      price:{ in:2, out:6, cache:0.25 }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://www.qwencloud.com/models/qwen3.8-max" },

    { id:"qwen3-7-max", name:"Qwen3.7-Max Preview", lab:"Alibaba", license:"closed", tier:"mid", released:"2026", cfg:"—",
      arena:1474, arenaCi:10, votes:3942, aa:null, bench:null, b:{ swe:80.4 },
      price:{ in:1.48, out:4.42, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:[], url:"https://chat.qwen.ai/" },

    { id:"qwen3-7-flash", name:"Qwen3.7 Flash", lab:"Alibaba", license:"closed", tier:"budget", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:null, b:{},
      price:{ in:0.03, out:0.13, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["Лучшее соотношение балл/$ (360.9)"], url:"https://www.qwencloud.com/" },

    { id:"kimi-k3", name:"Kimi K3 (Max)", lab:"Moonshot", license:"open", tier:"frontier", released:"2026", cfg:"Max",
      arena:1488, arenaCi:5, votes:34325, aa:44.0, bench:69.93, b:{ gpqa:93.5 },
      price:{ in:3, out:15, cache:0.30 }, speed:null, latency:null, ctx:1050000, out:null, cutoff:null, multimodal:true,
      badges:["Лучший открытый GPQA (93.5%)","Kimi K3 license"], url:"https://platform.kimi.ai/docs/guide/kimi-k3-quickstart" },

    { id:"glm-5-3", name:"GLM-5.3 (Max)", lab:"Z.ai", license:"open", tier:"mid", released:"2026", cfg:"Max",
      arena:1481, arenaCi:5, votes:24035, aa:45.0, bench:null, b:{},
      price:{ in:1.40, out:4.40, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["MIT"], url:"https://z.ai/blog/glm-5.3" },

    { id:"glm-5-3-flash", name:"GLM-5.3-Flash", lab:"Z.ai", license:"open", tier:"budget", released:"2026", cfg:"—",
      arena:1475, arenaCi:5, votes:36095, aa:41.8, bench:null, b:{},
      price:{ in:0.05, out:0.18, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["Самый дешёвый с Elo 1470+ ($0.05 / $0.18)","MIT"], url:"https://z.ai/blog/glm-5.3" },

    { id:"glm-5-2", name:"GLM-5.2 (Max)", lab:"Z.ai", license:"open", tier:"mid", released:"2026", cfg:"Max",
      arena:1476, arenaCi:4, votes:51221, aa:null, bench:null, b:{},
      price:{ in:1.40, out:4.40, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true,
      badges:["MIT"], url:"https://huggingface.co/zai-org/GLM-5.2" },

    { id:"deepseek-v4-1-flash", name:"DeepSeek V4.1 Flash (1017)", lab:"DeepSeek", license:"open", tier:"budget", released:"2026-10-17", cfg:"Max",
      arena:1475, arenaCi:6, votes:13444, aa:45.1, bench:null, b:{},
      price:{ in:0.30, out:1.20, cache:null }, priceNote:"Off-peak $0.15 / $0.60, peak $0.30 / $1.20",
      speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:false,
      badges:["Лучшая цена/качество среди открытых","$0.26 за задачу индекса","MIT"],
      url:"https://www.deepseek.com/en/news/deepseek-v4-1-flash/" },

    { id:"deepseek-v4-pro", name:"DeepSeek V4 Pro", lab:"DeepSeek", license:"open", tier:"mid", released:"2026-08-13", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:null, b:{ swe:80.6, mmluPro:87.5 },
      price:{ in:1.32, out:3.96, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:false,
      badges:["MIT"], url:"https://www.deepseek.com/" },

    { id:"mimo-v2-6-pro", name:"MiMo-V2.6-Pro", lab:"Xiaomi", license:"open", tier:"open", released:"2026", cfg:"—",
      arena:1480, arenaCi:9, votes:4065, aa:46.3, bench:73.66, b:{},
      price:{ in:0.43, out:0.87, cache:0 }, speed:null, latency:null, ctx:1100000, out:null, cutoff:null, multimodal:false,
      badges:["Сильнейшая открытая модель (AA 46.3)","84.7 балла на $1 вывода","MIT"], url:"https://mimo.xiaomi.com/mimo-v2-6" },

    { id:"minimax-m3", name:"MiniMax M3", lab:"MiniMax", license:"open", tier:"budget", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:null, b:{ swe:80.5 },
      price:{ in:0.30, out:1.20, cache:null }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:false,
      badges:["MiniMax Community License"], url:"https://www.minimax.io/" },

    { id:"step-5", name:"Step 5 Preview", lab:"StepFun", license:"closed", tier:"budget", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:69.67, b:{},
      price:{ in:1.00, out:2.70, cache:0.05 }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:false,
      badges:["25.8 балла на $1 вывода"], url:"https://www.stepfun.com/" },

    { id:"mistral-large-4", name:"Mistral Large 4 «Le Chonk»", lab:"Mistral", license:"open", tier:"mid", released:"2026-10-06", cfg:"Preview",
      arena:null, arenaCi:null, votes:null, aa:38.4, bench:null, b:{},
      price:{ in:1.36, out:4.18, cache:0.14 }, priceNote:"Mistral показывает вдвое меньшую цену без объяснения срока",
      speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:true, params:"1.05T (49–52B активных)",
      badges:["Крупнейшая MoE из США/Европы — 1.05T","Веса обещаны к концу октября"], url:"https://mistral.ai/news/mistral-large-4" },

    { id:"inkling", name:"Inkling", lab:"Reflection", license:"open", tier:"open", released:"2026", cfg:"xHigh",
      arena:null, arenaCi:null, votes:null, aa:26.0, bench:null, b:{ swe:77.6 },
      price:{ in:1, out:4.05, cache:0.17 }, speed:null, latency:null, ctx:1000000, out:null, cutoff:null, multimodal:false,
      badges:["Apache-2.0"], url:"https://reflection.ai/" },

    { id:"beam-1-0", name:"Beam 1.0 501B-A23B", lab:"Reflection", license:"open", tier:"open", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:25.0, bench:51.5, b:{ swe:81.6 },
      price:{ in:null, out:null, cache:null }, priceNote:"Открытые веса, Apache-2.0",
      speed:349, latency:6.53, ctx:1000000, out:null, cutoff:null, multimodal:false, params:"501B (23B активных)",
      badges:["81.6% SWE-bench Verified — рекорд среди открытых"], url:"https://reflection.ai/" },

    { id:"mercury-2-5", name:"Mercury 2.5", lab:"Inception", license:"closed", tier:"fast", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:33.94, b:{},
      price:{ in:0.2, out:0.75, cache:0.02 }, speed:781, latency:3.83, ctx:260000, out:null, cutoff:null, multimodal:false,
      badges:["781 tok/s"], url:"https://www.inceptionlabs.ai/" },

    { id:"celeris-1", name:"Celeris-1", lab:"Celeris", license:"closed", tier:"fast", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:28.36, b:{},
      price:{ in:0.04, out:0, cache:null }, speed:1521, latency:0.55, ctx:128000, out:null, cutoff:null, multimodal:false,
      badges:["Абсолютный рекорд скорости — 1521 tok/s"], url:"https://benchlm.ai/models/celeris-1" },

    { id:"lfm2-24b", name:"LFM2-24B-A2B", lab:"LiquidAI", license:"open", tier:"fast", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:null, b:{},
      price:{ in:null, out:null, cache:null }, speed:null, latency:0.42, ctx:null, out:null, cutoff:null, multimodal:false,
      params:"24B (2B активных)", badges:["Минимальная задержка — 0.42 с"], url:"https://www.liquid.ai/" },

    { id:"gpt-oss-120b", name:"GPT-OSS 120B", lab:"OpenAI", license:"open", tier:"open", released:"2025", cfg:"—",
      arena:1366, arenaCi:null, votes:null, aa:null, bench:37.27, b:{ gpqa:75.8, mmluPro:90.0 },
      price:{ in:0.15, out:0.60, cache:null }, speed:265, latency:8.34, ctx:131000, out:null, cutoff:null, multimodal:false,
      params:"117B (5.1B активных)", badges:["90.0% MMLU-Pro при $0.15 / $0.60"], url:"https://openai.com/index/introducing-gpt-oss/" },

    { id:"nemotron-3-ultra", name:"Nemotron 3 Ultra 550B", lab:"NVIDIA", license:"open", tier:"open", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:23.0, bench:null, b:{},
      price:{ in:null, out:null, cache:null }, speed:243, latency:9.18, ctx:262000, out:null, cutoff:null, multimodal:true,
      params:"550B (55B активных)", badges:["Лучшая открытая модель США по AA (23)"], url:"https://www.nvidia.com/en-us/ai/" },

    { id:"gemma-4-e4b", name:"Gemma 4 E4B", lab:"Google", license:"open", tier:"open", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:null, bench:null, b:{},
      price:{ in:0.02, out:0, cache:null }, speed:null, latency:null, ctx:131000, out:null, cutoff:null, multimodal:true,
      badges:["Дешевле всех на frontier-качестве ($0.02)"], url:"https://ai.google.dev/gemma" },

    { id:"k2-horizon", name:"K2 Horizon 375B A23B", lab:"Moonshot", license:"open", tier:"open", released:"2026", cfg:"—",
      arena:null, arenaCi:null, votes:null, aa:44.0, bench:null, b:{},
      price:{ in:0, out:0, cache:null }, priceNote:"$0 у ряда провайдеров-агрегаторов",
      speed:1097, latency:null, ctx:null, out:null, cutoff:null, multimodal:false, params:"375B (23B активных)",
      badges:["1097 tok/s и $0 — уникальный случай"], url:"https://platform.kimi.ai/" },
  ];

  /* ---------- benchmark dictionary (for headers + normalisation) ---------- */
  const BENCH = {
    swe:        { label:"SWE-bench Verified", short:"SWE-bench", unit:"%",   max:100,  desc:"500 реальных GitHub-issues: агент сам находит баг и чинит его" },
    sweM:       { label:"SWE-Marathon",       short:"SWE-M.",    unit:"%",   max:100,  desc:"Длинные многочасовые кодинг-задачи (данные Meta)" },
    term:       { label:"Terminal-Bench 4.0", short:"Terminal",  unit:"%",   max:100,  desc:"Работа в терминале: сборка, отладка, деплой" },
    gpqa:       { label:"GPQA Diamond",       short:"GPQA",      unit:"%",   max:100,  desc:"Вопросы уровня PhD по физике, химии, биологии" },
    mmluPro:    { label:"MMLU-Pro",           short:"MMLU-Pro",  unit:"%",   max:100,  desc:"Экспертные знания по 14 предметам" },
    arc2:       { label:"ARC-AGI-2",          short:"ARC-AGI-2", unit:"%",   max:100,  desc:"Абстрактные головоломки, которых не было в обучении" },
    hle:        { label:"Humanity's Last Exam", short:"HLE",     unit:"%",   max:100,  desc:"2500 вопросов на пределе человеческих знаний" },
    liveReason: { label:"LiveBench Reasoning", short:"LB Reason", unit:"pts", max:100,  desc:"Живой бенчмарк рассуждений, защищён от утечек" },
    liveCode:   { label:"LiveBench Agentic Coding", short:"LB Code", unit:"pts", max:100, desc:"Агентный кодинг на живых задачах" },
    factual:    { label:"AA Factual Accuracy", short:"Факты",    unit:"%",   max:100,  desc:"Доля фактически верных ответов (Artificial Analysis)" },
    gdpval:     { label:"GDPval-AA v2.1",     short:"GDPval",    unit:"elo", max:2000, desc:"Сравнение с людьми в 44 реальных профессиях" },
    mmmu:       { label:"MMMU",               short:"MMMU",      unit:"%",   max:100,  desc:"Мультимодальные задачи уровня колледжа: изображения, схемы, графики" },
    omniscience:{ label:"AA-Omniscience",     short:"Знания",    unit:"%",   max:100,  desc:"Доля верных ответов на вопросы о фактах; обратная сторона — частота галлюцинаций" },
    webdev:     { label:"Arena WebDev Elo",   short:"WebDev",    unit:"elo", max:2000, desc:"Рейтинг Arena по задачам веб-разработки" },
  };

  /* ---------- category winners ---------- */
  const CATEGORIES = [
    { icon:"code",       name:"Кодинг",              winner:"Claude Opus 5.5",       lab:"Anthropic", metric:"#1 Arena WebDev — 1807 Elo",       note:"Обгоняет Sonnet 5.5 на 15 пунктов в LiveBench Agentic Coding. Рекорд SWE-bench Verified держит Claude Opus 5 — 96%.", best:["Claude Opus 5.5","Claude Opus 5","Claude Fable 5"], value:{ name:"Claude Sonnet 5.5", text:"$2 / $10, #1 Terminal-Bench 4.0 (63.6%)" }, url:"https://arena.ai/leaderboard" },
    { icon:"brain",      name:"Рассуждения",         winner:"GPT-6 Astra",           lab:"OpenAI",    metric:"#1 LiveBench Reasoning — 92.65",  note:"Забрал ARC-AGI-2 (95%) у GPT-5.6 Sol через несколько дней после релиза. В индексе рассуждений LLM Stats — 57.1.", best:["GPT-6 Astra","Claude Opus 5.5","Claude Sonnet 5.5"], value:{ name:"GPT-6.1 Sol", text:"отстаёт на 0.02 пункта при $2 / $10" }, url:"https://llm-stats.com/leaderboards/best-ai-for-reasoning" },
    { icon:"atom",       name:"Наука",               winner:"Gemini 4 Argon",        lab:"Google",    metric:"GPQA Diamond — 96.4%",            note:"Лучший результат на вопросах уровня PhD. Следом GPT-6 Astra (95.8%) и Claude Sonnet 5.5 (95.6%).", best:["Gemini 4 Argon","GPT-6 Astra","Claude Sonnet 5.5"], value:{ name:"Gemini 3.8 Flash", text:"95.4% при $0.75 / $3.75" }, url:"https://id8.co.in/tools/llm-leaderboard" },
    { icon:"pen",        name:"Тексты и стиль",      winner:"Claude Fable 5.1",      lab:"Anthropic", metric:"#2 EQ-Bench, #3 LiveBench Language", note:"В топ-10 всех трёх прозаических рейтингов одновременно.", best:["Claude Fable 5.1","Claude Opus 5.5","Claude Sonnet 5.5"], value:{ name:"Claude Sonnet 5.5", text:"бесплатно на claude.ai" }, url:"https://felloai.com/best-ai-models/" },
    { icon:"sparkles",   name:"Креатив",             winner:"Grok 4.7",              lab:"xAI",       metric:"Минимум контентных ограничений",  note:"Выбор для острой и трендовой подачи: меньше всего guardrails плюс нативная интеграция с X.", best:["Grok 4.7","Claude Fable 5.1","GPT-6 Astra"], value:{ name:"Grok 4.7", text:"$2 / $6 — цена не менялась" }, url:"https://felloai.com/best-ai-models/" },
    { icon:"target",     name:"Точность фактов",     winner:"Claude Fable 5.1",      lab:"Anthropic", metric:"67% — рекорд Artificial Analysis", note:"Лучший на досках, которые меряют, как часто модель просто ошибается.", best:["Claude Fable 5.1","GPT-6.1 Sol","Claude Opus 5.5"], value:{ name:"GPT-6.1 Sol", text:"62% точности, $0.72 за задачу индекса" }, url:"https://artificialanalysis.ai/" },
    { icon:"zap",        name:"Скорость",            winner:"Celeris-1",             lab:"Celeris",   metric:"1521 tok/s, 0.55 с до ответа",    note:"Среди моделей с баллом 70+ быстрее всех Muse Wonder — 161 tok/s. Frontier-class рекорд у GPT-6 Luna — 197 tok/s (P95).", best:["Celeris-1","K2 Horizon 375B","GPT-6 Luna"], value:{ name:"GPT-6 Luna", text:"197 tok/s при $0.10 / $0.50" }, url:"https://benchlm.ai/llm-speed" },
    { icon:"coins",      name:"Цена / качество",     winner:"MiMo-V2.6-Pro",         lab:"Xiaomi",    metric:"84.7 балла на $1 вывода",         note:"Открытая модель Xiaomi за $0.43 / $0.87 даёт 73.66 балла BenchLM. Среди закрытых лучший — GPT-6.1 Sol (8.4).", best:["MiMo-V2.6-Pro","Step 5 Preview","GPT-6.1 Sol"], value:{ name:"DeepSeek V4.1 Flash", text:"$0.26 за задачу индекса" }, url:"https://benchlm.ai/llm-pricing" },
    { icon:"unlock",     name:"Открытые веса",       winner:"MiMo-V2.6-Pro",         lab:"Xiaomi",    metric:"AA Intelligence Index — 46.3",    note:"Лучшая открытая модель. За ней DeepSeek V4.1 Flash (45.1), GLM-5.3 (45.0), Kimi K3 (44.0).", best:["MiMo-V2.6-Pro","DeepSeek V4.1 Flash","GLM-5.3"], value:{ name:"GLM-5.3-Flash", text:"$0.05 / $0.18, самая маленькая для self-host" }, url:"https://llm-stats.com/leaderboards/open-llm-leaderboard" },
    { icon:"bot",        name:"AI-агенты",           winner:"Claude Opus 5.5 (Max)", lab:"Anthropic", metric:"#1 Agent Arena — 20.92% побед",     note:"Второй GPT-6 Astra (Max) — 14.70%, третья Claude Fable 5.1 (Max) — 14.17%.", best:["Claude Opus 5.5","GPT-6 Astra","Claude Fable 5.1"], value:{ name:"GPT-6.1 Sol (Max)", text:"13.55% побед всего за $0.77/задачу" }, url:"https://arena.ai/leaderboard/agent" },
    { icon:"database",   name:"Длинный контекст",    winner:"Llama 4 Scout",         lab:"Meta",      metric:"10 000 000 токенов",              note:"Открытые веса. Среди API-моделей стандарт фронта — 1M, у GPT-6 Sol и Kimi K3 — 1.05M.", best:["Llama 4 Scout","GPT-6 Astra","Grok 4.20 Beta"], value:{ name:"Llama 4 Scout", text:"бесплатно у ряда провайдеров" }, url:"https://llm-stats.com/leaderboards/best-ai-for-long-context" },
    { icon:"users",      name:"Для обычной подписки",winner:"Claude Sonnet 5.5",     lab:"Anthropic", metric:"Бесплатно на claude.ai",          note:"Дефолт ChatGPT с 7 октября — GPT-6. Но лучший бесплатный доступ к фронтиру сейчас у Sonnet 5.5.", best:["Claude Sonnet 5.5","GPT-6","Gemini 4 Argon"], value:{ name:"Claude Sonnet 5.5", text:"$0 на бесплатном тарифе" }, url:"https://felloai.com/best-ai-models/" },
  ];

  /* ---------- agent arena ---------- */
  const AGENTS = [
    { rank:1, model:"Claude Opus 5.5 (Max)",   lab:"Anthropic", win:20.92, cost:6.19 },
    { rank:2, model:"GPT-6 Astra (Max)",       lab:"OpenAI",    win:14.70, cost:4.12 },
    { rank:3, model:"Claude Fable 5.1 (Max)",  lab:"Anthropic", win:14.17, cost:null },
    { rank:4, model:"GPT-6.1 Sol (Max)",       lab:"OpenAI",    win:13.55, cost:0.77 },
    { rank:5, model:"Claude Sonnet 5.5 (Max)", lab:"Anthropic", win:12.67, cost:null },
    { rank:6, model:"Gemini 4 Argon (High)",   lab:"Google",    win:12.03, cost:null },
    { rank:7, model:"Muse Wonder Full (Max)",  lab:"Meta",      win:11.26, cost:null },
    { rank:8, model:"GPT-6 Sol (Max)",         lab:"OpenAI",    win:9.36,  cost:null },
    { rank:9, model:"Claude Fable 5 (High)",   lab:"Anthropic", win:8.31,  cost:null },
    { rank:10,model:"Claude Opus 5 (Max)",     lab:"Anthropic", win:8.09,  cost:null },
    { rank:11,model:"DeepSeek V4.1 Flash",     lab:"DeepSeek",  win:4.73,  cost:0.19 },
    { rank:"—",model:"GPT-6 Luna (Low)",       lab:"OpenAI",    win:4.59,  cost:0.01 },
    { rank:"—",model:"MiMo-V2.6-Pro",          lab:"Xiaomi",    win:3.68,  cost:0.12 },
    { rank:"—",model:"GPT-6 Luna (Max)",       lab:"OpenAI",    win:3.03,  cost:0.08 },
    { rank:"—",model:"MiMo-V2.6-Flash",        lab:"Xiaomi",    win:2.52,  cost:0.06 },
    { rank:"—",model:"GPT-6 Luna (Medium)",    lab:"OpenAI",    win:0.55,  cost:0.02 },
  ];

  /* ---------- speed & latency by provider ---------- */
  const PROVIDERS = [
    { name:"Inception",  speed:692, latency:4.7,   models:3  },
    { name:"LiquidAI",   speed:208, latency:6.7,   models:3  },
    { name:"Google",     speed:184, latency:18.0,  models:14 },
    { name:"StepFun",    speed:142, latency:18.2,  models:3  },
    { name:"Meta",       speed:126, latency:23.0,  models:8  },
    { name:"OpenAI",     speed:124, latency:46.0,  models:29 },
    { name:"xAI",        speed:98,  latency:19.6,  models:9  },
    { name:"DeepSeek",   speed:94,  latency:11.3,  models:8  },
    { name:"Mistral",    speed:93,  latency:5.5,   models:9  },
    { name:"Alibaba",    speed:84,  latency:38.0,  models:15 },
    { name:"Anthropic",  speed:78,  latency:112.8, models:16 },
    { name:"MiniMax",    speed:78,  latency:29.4,  models:5  },
    { name:"Xiaomi",     speed:71,  latency:36.3,  models:3  },
    { name:"Z.ai",       speed:64,  latency:30.7,  models:9  },
    { name:"Moonshot",   speed:51,  latency:29.8,  models:5  },
  ];

  /* ---------- news timeline ---------- */
  const TIMELINE = [
    { date:"2026-10-17", lab:"DeepSeek",  title:"DeepSeek V4.1-Flash-1017", text:"AA Intelligence Index вырос с 39.5 до 45.1 при прежних ценах ($0.15/$0.60 off-peak, $0.30/$1.20 peak). Веса на Hugging Face под MIT. 13-е место в WebDev Arena и 11-е в Agent Arena — лучшие результаты среди открытых моделей." },
    { date:"2026-10-15", lab:"Meta",      title:"Muse Spark Open — 816B MoE", text:"42B активных параметров, контекст 1M, веса под Meta Muse Model License (не open source). AA Index 38.9 — ниже MiMo-V2.6-Pro (46.3) и DeepSeek V4.1 Flash (45.1)." },
    { date:"2026-10-15", lab:"Google",    title:"Gemini 4 Argon стал публичным", text:"Открыт для Google AI Pro ($19.99/мес), Ultra и платного API как gemini-4-argon. Вводная цена $2/$10 действует до 30.11.2026, затем $4/$20. Удерживает 1-е место в Text Arena (1524–1525) и AA Index 52.6." },
    { date:"2026-10-12", lab:"Meta",      title:"Muse Wonder и Muse Wonder Full", text:"Первые модели класса выше Muse Spark, обучены в ЦОД Prometheus. Wonder Full — AA Index 55.8 (3-е место), но доступен только в подписке Muse Code ($50 и $200). Обычный Wonder — в API за $4/$20, Index 52.4. SWE-Marathon: 57.5% против 46.3% у Opus 5.5." },
    { date:"2026-10-07", lab:"Anthropic", title:"Claude Haiku 5.5", text:"$0.10 / $0.50 за 1M токенов при промпте до 100K (выше — $0.50/$2.50), кэш $0.01. AA Index 43.4 против 17 у Haiku 4.5. Контекст 1M, выход 128K, впервые у Haiku есть настройка effort. Hallucination rate 40% против 77% у GPT-6 Luna." },
    { date:"2026-10-06", lab:"Mistral",   title:"Mistral Large 4 «Le Chonk»", text:"Preview в API: 1.05T параметров MoE, 49–52B активных, читает текст и изображения. $1.36/$4.18 (страница Mistral показывает вдвое меньше без объяснений). AA Index 38.4 — лучший среди «открытых» моделей США/Европы. Веса обещаны к концу октября, лицензия не названа." },
    { date:"2026-10-06", lab:"Google",    title:"Nano Banana 2.1", text:"Заменила Nano Banana 2 в тот же день, shutdown API старой версии — 29 октября. Изображение стоит $0.0336 за 1K вместо $0.067, но входные токены подорожали втрое до $1.50/1M. 5-е место в text-to-image Arena (1328.1)." },
    { date:"2026-10-03", lab:"xAI",       title:"Grok 4.7 в Expert-режиме", text:"Доступен в приложении Grok, в API, Cursor и Grok Build. Цена не изменилась — $2/$6. Минимум контентных ограничений плюс нативная интеграция с X." },
    { date:"2026-09-30", lab:"Google",    title:"Gemini 4 Argon — закрытый запуск", text:"Сначала только для участников программы Fairwind (киберзащита). Сразу занял 1-е место Text Arena." },
    { date:"2026-09-29", lab:"OpenAI",    title:"GPT-6.1 Sol", text:"AA Index 51.8 при $2/$10 — самая дешёвая модель верхнего тира в пересчёте на задачу индекса ($0.72). Контекст 1.05M." },
    { date:"2026-09-28", lab:"Anthropic", title:"Claude Sonnet 5.5", text:"AA Index 56.0 — 2-е место среди всех моделей. $2/$10 и бесплатный доступ на claude.ai. Рекорд Terminal-Bench 4.0 — 63.6%." },
    { date:"2026-09-22", lab:"Anthropic", title:"Claude Opus 5.5", text:"AA Index 57.6 — 1-е место. Первый в Arena WebDev (1807 Elo) и в Agent Arena (20.92% побед). SWE-bench Pro 89.9%. Цена $4/$20." },
    { date:"2026-09-21", lab:"xAI",       title:"Grok 4.7 — релиз", text:"AA Index около 48. Сохранил цену $2/$6 на уровне Grok 4.5." },
    { date:"2026-09",    lab:"OpenAI",    title:"GPT-6 Sol и Luna: цены пополам", text:"OpenAI вдвое снизил тарифы API на линейку GPT-6. Sol — $2/$10, Luna — $0.10/$0.50 при 197 tok/s." },
  ];

  /* ---------- consumer subscriptions ---------- */
  const SUBSCRIPTIONS = [
    { product:"ChatGPT", vendor:"OpenAI", plans:[
      { name:"Free", price:0, note:"GPT-6 с ограничениями" },
      { name:"Plus", price:20, note:"GPT-6, расширенные лимиты" },
      { name:"Pro", price:200, note:"Максимальные лимиты, Pro-режимы" } ] },
    { product:"Claude", vendor:"Anthropic", plans:[
      { name:"Free", price:0, note:"Доступ к Sonnet 5.5 и Haiku 5.5" },
      { name:"Pro", price:20, note:"Sonnet 5.5 + Opus 5.5 с лимитами" },
      { name:"Max", price:200, note:"5× лимитов Pro" } ] },
    { product:"Gemini / Google AI", vendor:"Google", plans:[
      { name:"Free", price:0, note:"Без Gemini 4 Argon" },
      { name:"AI Plus", price:4.99, note:"400 ГБ хранилища" },
      { name:"AI Pro", price:19.99, note:"Gemini 4 Argon, 5 ТБ" },
      { name:"AI Ultra", price:99.99, note:"5× лимитов Pro, от 20 ТБ; есть тариф $199.99 за 20×" } ] },
    { product:"Grok", vendor:"xAI", plans:[
      { name:"SuperGrok", price:30, note:"Expert-режим с Grok 4.7; цена оценочная — проверьте на x.ai" } ] },
    { product:"Muse Code", vendor:"Meta", plans:[
      { name:"Standard", price:50, note:"Доступ к Muse Wonder Full" },
      { name:"Pro", price:200, note:"Расширенные лимиты Muse Wonder Full" } ] },
  ];

  /* ---------- sources ---------- */
  const SOURCES = [
    { name:"Arena (ex-LMArena)", url:"https://arena.ai/leaderboard/chat/text", what:"Text Arena Elo, 8 900 458 голосов, 417 моделей; Agent Arena; WebDev", checked:"20.10.2026" },
    { name:"BenchLM", url:"https://benchlm.ai/llm-pricing", what:"Цены API (972 модели), сводный Score, скорость и задержки, SWE-bench Verified", checked:"20.10.2026" },
    { name:"LLM Stats", url:"https://llm-stats.com/leaderboards/llm-leaderboard", what:"Индексы Reasoning / Coding / Agents / Math, GPQA, SWE-bench, HLE по категориям", checked:"21.10.2026" },
    { name:"Artificial Analysis", url:"https://artificialanalysis.ai/models", what:"Intelligence Index v4.3.2, стоимость задачи, скорость, задержка, фактическая точность", checked:"21.10.2026" },
    { name:"id8 LLM Leaderboard", url:"https://id8.co.in/tools/llm-leaderboard", what:"168 моделей: Arena Elo, GPQA Diamond, MMLU-Pro, лицензии, контекст (CC BY 4.0)", checked:"20.10.2026" },
    { name:"Fello AI", url:"https://felloai.com/best-ai-models/", what:"Победители по категориям, календарь релизов, разбор новинок октября 2026", checked:"20.10.2026" },
    { name:"models.dev (anomalyco)", url:"https://github.com/anomalyco/models.dev", what:"Машиночитаемые карточки цен и контекста по провайдерам", checked:"20.10.2026" },
    { name:"Google One — тарифы AI", url:"https://one.google.com/intl/en_us/about/google-ai-plans/", what:"Цены подписок Google AI Plus / Pro / Ultra", checked:"17.10.2026" },
  ];

  const CAVEATS = [
    "Arena Elo зависит от конфигурации: одна модель может занимать несколько строк (Max / High / xHigh, режим reasoning). Здесь каждая модель показана один раз — по лучшей конфигурации, она указана в строке.",
    "Intelligence Index (Artificial Analysis), сводный Score (BenchLM) и LLM Stats Score считают по разным наборам бенчмарков. Их нельзя складывать или сравнивать между собой напрямую.",
    "Пометка «Preliminary» у Arena — меньше 5 000 голосов, доверительный интервал шире, место может сдвинуться.",
    "Цены — каталожные, за 1M токенов, без учёта кэша, батч-скидок и off-peak тарифов. У DeepSeek, Gemini 4 Argon и Mistral Large 4 действуют временные или условные цены — они вынесены в примечание к строке.",
    "Часть бенчмарков — self-report вендоров (SWE-bench, SWE-Marathon). Независимые прогоны могут отличаться на 1–5 п.п.",
    "Скорость и задержка сильно зависят от провайдера-хостера и нагрузки. Средние по лаборатории: у Anthropic 78 tok/s при задержке 112.8 с, у Google 184 tok/s при 18 с.",
    "AA Intelligence Index для Gemini 4 Argon, Grok 4.7 и части открытых моделей указан приблизительно — точные значения опубликованы не для всех конфигураций.",
  ];

  return { META, LABS, MODELS, BENCH, CATEGORIES, AGENTS, PROVIDERS, TIMELINE, SUBSCRIPTIONS, SOURCES, CAVEATS };
})();
