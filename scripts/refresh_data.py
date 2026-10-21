#!/usr/bin/env python3
"""AI Model Index — auto-refresh of prices and context windows.

What is automated (stable, machine-readable sources):
  P1  models.dev   first-party TOML cards  -> price in/out/cache  (authoritative)
  P2  OpenRouter   /api/v1/models          -> context, price cross-check
  P3  BenchLM      public pricing CSV      -> price cross-check, open/closed flag

What stays MANUAL (editorial or scrape-only, see README):
  Arena Elo, AA Intelligence Index, benchmark scores, category winners,
  timeline, notes, badges.

Safety gates:
  * values outside sane ranges are rejected;
  * a price is accepted from models.dev alone (first-party card) or when
    two secondary sources agree within 5%;
  * unknown models are NEVER added to data.js — they go to data-candidates.md;
  * default mode is dry-run; --apply rewrites data.js.

Usage:
  python3 scripts/refresh_data.py            # dry run, prints a report
  python3 scripts/refresh_data.py --apply    # rewrite data.js + report file
"""
import io
import json
import re
import sys
import tarfile
import urllib.request
from datetime import date, datetime, timezone

import os as _os
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
DATA_JS = ROOT + "/data.js"
REPORTS = ROOT + "/reports"
UA = {"User-Agent": "ai-model-index-refresh/1.0 (contact: site owner)"}

PRICE_RANGE = (0.0, 500.0)
CTX_RANGE = (1024, 20_000_000)


def get(url, timeout=60):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout).read()


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


SUFFIXES = ("max", "high", "xhigh", "medium", "low", "preview", "chat", "reasoning", "beta")


def strip_cfg(slug):
    s = norm(slug)
    for suf in SUFFIXES:
        if s.endswith(suf) and len(s) > len(suf) + 3:
            s = s[: -len(suf)]
    return s


# explicit aliases for ids whose source slug differs structurally
ALIASES = {
    "muse-wonder-max": ["meta/muse-wonder"],
    "muse-spark-1-3": ["meta/muse-spark"],
    "grok-4-20": ["x-ai/grok-4-20-beta", "xai/grok-4-20-beta"],
    "deepseek-v4-1-flash": ["deepseek/deepseek-v4-1-flash"],
    "llama-4-scout": ["meta/llama-4-scout"],
    "k2-horizon": ["moonshotai/k2-horizon", "ifm/k2-horizon"],
}


# ---------------------------------------------------------------- sources
def load_models_dev():
    """{normalized_base_slug: {in,out,cache, first_party:bool, providers:n}}"""
    tf = tarfile.open(fileobj=io.BytesIO(get("https://github.com/anomalyco/models.dev/archive/refs/heads/dev.tar.gz")))
    out = {}
    for member in tf.getmembers():
        if not member.name.endswith(".toml") or "/providers/" not in member.name:
            continue
        provider = member.name.split("/providers/")[1].split("/")[0]
        try:
            import tomllib
            t = tomllib.load(tf.extractfile(member))
        except Exception:
            continue
        base = t.get("base_model", "")
        if not base:
            continue
        cost = t.get("cost", {}).get("text", {})
        inp = cost.get("input", {}).get("price")
        outp = cost.get("output", {}).get("price")
        cache = cost.get("input", {}).get("cache")
        if isinstance(cache, dict):
            cache = min([v for v in cache.values() if isinstance(v, (int, float))] or [None] )
        if not isinstance(inp, (int, float)) or not isinstance(outp, (int, float)):
            continue
        slug = norm(base.split("/")[-1])
        first = base.split("/")[0].lower() == provider.lower()
        cur = out.setdefault(slug, {"in": [], "out": [], "cache": [], "first": None})
        if first:
            cur["first"] = {"in": float(inp), "out": float(outp), "cache": float(cache) if isinstance(cache, (int, float)) else None}
        else:
            cur["in"].append(float(inp)); cur["out"].append(float(outp))
            if isinstance(cache, (int, float)):
                cur["cache"].append(float(cache))
    return out


def load_openrouter():
    d = json.loads(get("https://openrouter.ai/api/v1/models"))
    out = {}
    for m in d.get("data", []):
        p = m.get("pricing") or {}
        try:
            pin, pout = float(p.get("prompt", 0)) * 1e6, float(p.get("completion", 0)) * 1e6
        except (TypeError, ValueError):
            continue
        slug = norm(m["id"].split("/")[-1])
        out.setdefault(slug, []).append({
            "in": pin, "out": pout, "ctx": m.get("context_length"),
            "created": m.get("created"), "full": m["id"],
        })
    return out


def load_benchlm():
    import csv
    rows = csv.DictReader(io.StringIO(get("https://benchlm.ai/api/data/pricing?format=csv").decode()))
    out = {}
    for r in rows:
        try:
            pin, pout = float(r["inputPrice"]), float(r["outputPrice"])
        except (KeyError, TypeError, ValueError):
            continue
        ctx = parse_ctx(r.get("contextWindow", ""))
        out.setdefault(norm(r["model"]), {"in": pin, "out": pout, "ctx": ctx, "open": r.get("sourceType") == "Open Weight"})
    return out


def parse_ctx(s):
    if not s:
        return None
    m = re.match(r"([\d.]+)\s*([KM])?", str(s).strip(), re.I)
    if not m:
        return None
    v = float(m.group(1))
    return int(v * (1e6 if (m.group(2) or "").upper() == "M" else 1e3 if (m.group(2) or "").upper() == "K" else 1))


def clean(v):
    """catalog prices have at most 2 decimals; 1.19516 means a converted/reseller card"""
    return v is not None and abs(v - round(v, 2)) < 1e-9


WARN = []


def load_safe(fn, label, fallback):
    """source down or rate-limited (BenchLM free tier: 250 reads/mo) -> degrade, never die"""
    try:
        return fn()
    except Exception as e:
        WARN.append("%s unavailable: %s" % (label, e))
        return fallback


def median(xs):
    xs = sorted(xs)
    return xs[len(xs) // 2] if xs else None


def close(a, b, tol=0.05):
    if a is None or b is None:
        return False
    if a == b == 0:
        return True
    return abs(a - b) <= tol * max(a, b, 1e-9)


# ---------------------------------------------------------------- data.js surgery
BLOCK_RE = re.compile(r'\{ id:"(?P<id>[^"]+)"(?P<body>.*?)(?=\n    \{ id:"|\Z)', re.S)
PRICE_RE = re.compile(r"price:\{ in:(?P<in>[\d.]+|null), out:(?P<out>[\d.]+|null), cache:(?P<cache>[\d.]+|null) \}")
CTX_RE = re.compile(r"\bctx:(?P<v>\d+|null)")


def fmt(v):
    if v is None:
        return "null"
    return str(int(v)) if float(v) == int(v) else ("%.3f" % v).rstrip("0")


def main():
    apply = "--apply" in sys.argv
    src = get if True else None
    print("Fetching models.dev ...")
    mdev = load_safe(load_models_dev, "models.dev", {})
    print("Fetching OpenRouter ...")
    ort = load_safe(load_openrouter, "openrouter", {})
    print("Fetching BenchLM csv ...")
    blm = load_safe(load_benchlm, "benchlm", {})
    print("Sources: models.dev %d slugs, openrouter %d slugs, benchlm %d names" % (len(mdev), len(ort), len(blm)))

    raw = open(DATA_JS, encoding="utf-8").read()
    changes, notes, missing = [], [], []
    known = set()

    def new_block(m):
        mid, body = m.group("id"), m.group("body")
        known.add(mid)
        cands = ALIASES.get(mid, [])
        slugs = [norm(mid), strip_cfg(mid)] + [norm(c.split("/")[-1]) for c in cands] + [strip_cfg(c) for c in cands]

        # ---- models.dev (authoritative when first-party card exists)
        md = None
        for s in slugs:
            if s in mdev:
                rec = mdev[s]
                md = rec["first"] or ({"in": median(rec["in"]), "out": median(rec["out"]), "cache": median(rec["cache"])} if rec["in"] else None)
                if md:
                    md = dict(md, first_party=rec["first"] is not None, providers=len(rec["in"]) + (1 if rec["first"] else 0))
                break
        # ---- openrouter
        orow = None
        for s in slugs:
            if s in ort:
                best = sorted(ort[s], key=lambda r: r.get("created") or 0)[-1]
                orow = best
                break
        # ---- benchlm (by display-name normalisation, fuzzy)
        brow = blm.get(norm(mid.replace("-", " "))) or blm.get(norm(mid))

        pm = PRICE_RE.search(body)
        old = {k: (None if pm.group(k) == "null" else float(pm.group(k))) for k in ("in", "out", "cache")} if pm else None
        cm = CTX_RE.search(body)
        old_ctx = None if cm.group("v") == "null" else int(cm.group("v"))

        new = dict(old) if old else {"in": None, "out": None, "cache": None}
        srcs = []
        if md and md.get("first_party") and clean(md["in"]) and clean(md["out"]):
            new.update({"in": md["in"], "out": md["out"]})
            if md["cache"] is not None and clean(md["cache"]):
                new["cache"] = md["cache"]
            srcs.append("models.dev(first-party)")
        elif orow and brow and close(orow["in"], brow["in"]) and close(orow["out"], brow["out"]) \
                and clean(orow["in"]) and clean(orow["out"]):
            new.update({"in": orow["in"], "out": orow["out"]})
            srcs.append("openrouter+benchlm agree")
        elif md and md["in"] is not None and old and old["in"] is not None \
                and not close(md["in"], old["in"], tol=0.10):
            notes.append("%s: price drift suspected (models.dev median %s/%s vs current %s/%s) — left for manual check"
                         % (mid, md["in"], md["out"], old["in"], old["out"]))

        new_ctx, ctx_src = old_ctx, None
        for cand, sname in ((orow and orow.get("ctx"), "openrouter"), (brow and brow.get("ctx"), "benchlm")):
            if not cand or not (CTX_RANGE[0] <= cand <= CTX_RANGE[1]):
                continue
            if old_ctx is None:
                new_ctx, ctx_src = cand, sname          # first known value
            elif cand > old_ctx * 1.05:
                new_ctx, ctx_src = cand, sname          # real upgrade only, never downgrade
            break

        # ---- gates
        for k in ("in", "out", "cache"):
            if new[k] is not None and not (PRICE_RANGE[0] <= new[k] <= PRICE_RANGE[1]):
                notes.append("%s: rejected %s=%s (out of range)" % (mid, k, new[k]))
                new[k] = old[k] if old else None
        changed_price = bool(old) and any(abs((new[k] or 0) - (old[k] or 0)) > 1e-9 for k in ("in", "out", "cache"))
        changed_ctx = new_ctx != old_ctx

        if not md and not orow and not brow:
            missing.append(mid)
        body2 = body
        if changed_price and pm:
            repl = "price:{ in:%s, out:%s, cache:%s }" % (fmt(new["in"]), fmt(new["out"]), fmt(new["cache"]))
            body2 = body2[: pm.start()] + repl + body2[pm.end():]
            changes.append((mid, "price $/1M (in/out/cache)",
                            "%s/%s/%s" % (old["in"], old["out"], old["cache"]),
                            "%s/%s/%s" % (new["in"], new["out"], new["cache"]),
                            ",".join(srcs) or "single-source"))
        if changed_ctx:
            cm2 = CTX_RE.search(body2)   # re-search: body2 may have shifted after the price splice
            if cm2:
                body2 = body2[: cm2.start()] + "ctx:%s" % (new_ctx if new_ctx is not None else "null") + body2[cm2.end():]
            changes.append((mid, "context", old_ctx, new_ctx, ctx_src or "-"))
        return "{ id:" + '"' + mid + '"' + body2

    out = BLOCK_RE.sub(new_block, raw)

    # ---- candidates: first-party cards we do not track yet
    have = {norm(i) for i in known} | {strip_cfg(i) for i in known}
    cands = []
    for slug, rec in mdev.items():
        if slug in have or strip_cfg(slug) in have or not rec["first"]:
            continue
        cands.append((slug, rec["first"]))
    cands.sort()

    # ---- report
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    run_at = now.strftime("%H:%M")
    stamp = today + "T" + run_at[:2] + ":00"
    lines = ["# Auto-refresh report %s, run at %s UTC" % (today, run_at), "",
             "Sources: models.dev (first-party TOML), OpenRouter API, BenchLM pricing CSV.",
             "Mode: %s" % ("APPLY" if apply else "dry-run"),
             "Warnings: %s" % ("; ".join(WARN) if WARN else "none"), "",
             "## Changed (%d)" % len(changes), "",
             "| model | field | was | now | source |", "|---|---|---|---|---|"]
    lines += ["| %s | %s | %s | %s | %s |" % c for c in changes] or ["| - | - | - | - | - |"]
    lines += ["", "## Not found in any source (%d) — left untouched" % len(missing), ""]
    lines += ["- `%s`" % m for m in missing] or ["- none"]
    lines += ["", "## Notes", ""] + ["- %s" % n for n in notes] + ["",
             "## New first-party models not tracked yet (%d) — manual review needed" % len(cands), ""]
    lines += ["- `%s` — $%s / $%s per 1M" % (s, c["in"], c["out"]) for s, c in cands[:40]]
    report = "\n".join(lines) + "\n"

    print(report[:4000])
    import os
    os.makedirs(REPORTS, exist_ok=True)
    open(REPORTS + "/refresh-%s.md" % today, "w", encoding="utf-8").write(report)
    open(ROOT + "/data-candidates.md", "w", encoding="utf-8").write(
        "# Candidates for manual addition (generated %s)\n\n" % today + "\n".join(
            "- `%s` — $%s / $%s per 1M" % (s, c["in"], c["out"]) for s, c in cands) + "\n")
    # freshness stamps: autoChecked moves on EVERY applied run (visible proof of
    # life on the site); snapshot/sourcesChecked move only when data actually changed
    out = re.sub(r'autoChecked: "[^"]*"', 'autoChecked: "%s"' % stamp, out)
    if apply and changes:
        out = re.sub(r'snapshot: "\d{4}-\d{2}-\d{2}"', 'snapshot: "%s"' % today, out)
        out = re.sub(r'sourcesChecked: "\d{4}-\d{2}-\d{2}"', 'sourcesChecked: "%s"' % today, out)
    if apply and out != raw:
        open(DATA_JS, "w", encoding="utf-8").write(out)
        print("\nAPPLIED: data.js rewritten (%d changes)" % len(changes))
    elif apply:
        print("\nAPPLY: nothing to change")
    else:
        print("\ndry-run: data.js untouched (pass --apply to write)")


if __name__ == "__main__":
    main()
