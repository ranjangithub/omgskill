# omgstack

The omgskill.ai content engine CLI. Generates, displays, audits, and manages
AI intelligence briefings for all 10 industries.

No Anthropic API key needed — Claude Code does the generation.

---

## How to invoke

```
/omgstack generate                              # generate today's tech/saas briefing
/omgstack generate healthcare                   # generate for healthcare
/omgstack generate healthcare executive         # healthcare × executive role
/omgstack generate all                          # all 10 industries in sequence

/omgstack show                                  # show today's tech/saas briefing
/omgstack show healthcare                       # show today's healthcare briefing
/omgstack show healthcare 2026-05-18            # specific date
/omgstack show list                             # list all saved briefings

/omgstack backfill 7                            # last 7 days, default industry
/omgstack backfill 7 healthcare                 # last 7 days, healthcare
/omgstack backfill 2026-05-01 2026-05-18        # date range

/omgstack persona healthcare sales sell-better  # preview this persona
/omgstack persona list                          # list all personas with saved briefings
/omgstack persona compare healthcare executive healthcare sales

/omgstack sources                               # list all source packs + status
/omgstack sources healthcare                    # test healthcare feeds
/omgstack sources add healthcare https://...    # add a new feed
/omgstack sources clean healthcare              # remove dead feeds

/omgstack audit                                 # audit today's tech/saas briefing
/omgstack audit healthcare                      # audit today's healthcare briefing
/omgstack audit all                             # audit all of today's briefings
```

---

## Step 0 — Route by subcommand

Read the full argument string. The first word after `/omgstack` is the subcommand.

| First arg | Go to |
|---|---|
| `generate` or no args | Step G: Generate |
| `show` | Step S: Show |
| `backfill` | Step B: Backfill |
| `persona` | Step P: Persona |
| `sources` | Step R: Sources |
| `audit` | Step A: Audit |

Default industry (when none given): `technology-saas`
Default role: use the table in Step G

---

## ═══ GENERATE ══════════════════════════════════════════════════════════════
## Step G — Generate today's briefing

**Args:** `generate [industry] [role]` or `generate all`

### G1 — Resolve persona

Default roles and goals per industry:

| Industry | Default role | Default goals |
|---|---|---|
| technology-saas | executive | stay-updated, create-content |
| healthcare | executive | stay-updated, lead-decide |
| banking-finance | executive | stay-updated, lead-decide |
| insurance | sales | stay-updated, sell-better |
| education | executive | stay-updated, learn-faster |
| real-estate | sales | stay-updated, sell-better |
| retail-ecommerce | executive | stay-updated, lead-decide |
| manufacturing | technology | stay-updated, lead-decide |
| legal-compliance | consultant | stay-updated, create-content |
| government | executive | stay-updated, lead-decide |

If `all` is given, loop through all 10 industries. Otherwise use the given industry (and role if provided).

Read `content-engine/strategy.md` and `content-engine/taxonomy.md` for context.
Read `content-engine/industries/{industry}.md` if it exists.

### G2 — Fetch RSS articles

Run this Python script to fetch articles. Use the industry's source pack if available,
otherwise fall back to core sources.

```bash
python3 - <<'PYEOF'
import urllib.request, xml.etree.ElementTree as ET, re, sys, os, json
from datetime import datetime, timezone

INDUSTRY = sys.argv[1] if len(sys.argv) > 1 else "technology-saas"
TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%d")

def strip_html(s):
    return re.sub(r'<[^>]+>', '', s or '').replace('\n', ' ').strip()[:500]

CORE = [
    "https://www.technologyreview.com/feed/",
    "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    "https://venturebeat.com/category/ai/feed/",
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://huggingface.co/blog/feed.xml",
    "https://github.blog/feed/",
    "https://feeds.arstechnica.com/arstechnica/index",
    "https://openrss.org/openai.com/news/rss.xml",
]

INDUSTRY_EXTRA = {
    "healthcare":       ["https://www.fiercehealthcare.com/rss/xml","https://www.healthcareitnews.com/rss.xml","https://www.beckershospitalreview.com/rss/rss.html"],
    "banking-finance":  ["https://www.americanbanker.com/feed","https://feeds.bloomberg.com/technology/news.rss"],
    "insurance":        ["https://www.propertycasualty360.com/feed","https://www.insurancejournal.com/rss/"],
    "education":        ["https://www.edsurge.com/news.rss","https://edtechmagazine.com/k12/rss.xml"],
    "real-estate":      ["https://therealdeal.com/feed/","https://www.housingwire.com/feed/"],
    "retail-ecommerce": ["https://www.retaildive.com/feeds/news/","https://nrf.com/rss.xml"],
    "manufacturing":    ["https://www.industryweek.com/rss","https://www.manufacturingdive.com/feeds/news/"],
    "legal-compliance": ["https://iapp.org/feed/","https://www.jdsupra.com/post/rss.aspx?section=technology"],
    "government":       ["https://www.nextgov.com/rss/all/","https://www.fedscoop.com/feed/"],
    "technology-saas":  ["https://changelog.com/posts/feed","https://martinfowler.com/feed.atom"],
}

urls = CORE + INDUSTRY_EXTRA.get(INDUSTRY, [])
articles, failed = [], []

for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "omgstack/1.0"})
        raw = urllib.request.urlopen(req, timeout=8).read().decode("utf-8", errors="replace")
        domain = url.split("/")[2].replace("www.", "")
        items = re.findall(r'<item[^>]*>(.*?)</item>', raw, re.DOTALL)
        count = 0
        for item in items:
            t = re.search(r'<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</title>', item, re.DOTALL)
            l = re.search(r'<link[^>]*>(.*?)</link>', item, re.DOTALL)
            d = re.search(r'<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</description>', item, re.DOTALL)
            p = re.search(r'<pubDate[^>]*>(.*?)</pubDate>', item, re.DOTALL)
            if t and l:
                articles.append({"title": t.group(1).strip(), "url": l.group(1).strip(),
                                  "source": domain, "date": p.group(1).strip() if p else "",
                                  "summary": strip_html(d.group(1) if d else "")})
                count += 1
        print(f"OK  {domain:<45} {count} items")
    except Exception as e:
        failed.append(url)
        print(f"ERR {url.split('/')[2]:<45} {e}")

seen, unique = set(), []
for a in articles:
    k = a["title"].lower().strip()
    if k and k not in seen:
        seen.add(k)
        unique.append(a)

os.makedirs(f"data/briefings/{TODAY}", exist_ok=True)
out = f"data/briefings/{TODAY}/_raw_{INDUSTRY}.json"
with open(out, "w") as f:
    json.dump(unique, f, indent=2)

print(f"\nTotal: {len(unique)} unique articles | Failed: {len(failed)} feeds | Saved: {out}")
PYEOF
```

Pass the industry as the argument, e.g. `python3 - healthcare`.

After the script runs, read the saved JSON file to load all articles into your context.

### G3 — Select and enrich signals

Apply the 3-lens test to every article:
1. **Industry relevance** — does this affect {INDUSTRY} professionals?
2. **Role relevance** — does this change how a {ROLE} does their job this week?
3. **Goal alignment** — does this serve the selected content goals?

Select the **top 3 signals**. Classify each:
- **Strategic Signal** — changes strategy this quarter
- **Emerging Trend** — matters in 6–18 months
- **Tactical Update** — tool/process change, use it now
- **Governance Alert** — regulatory or compliance development
- **Hype/Noise** — attention without substance

For each signal generate ALL of these fields:

| Field | Instructions |
|---|---|
| `title` | Precise, newsworthy, under 15 words |
| `whatHappened` | 2-3 sentences, facts only, specific numbers |
| `whyItMatters` | 1-2 sentences, the implication |
| `industryImpact` | What changes in {INDUSTRY} |
| `roleImpact` | What changes for a {ROLE} |
| `myTake` | The non-obvious read — what most people are missing |
| `hook` | One sentence, LinkedIn opener, no "I", no "excited to share" |
| `contentAngle` | Post format + differentiated angle (create-content goal) |
| `salesIntel` | Buyer trigger + opener + pain point (sell-better goal) |
| `explainer` | Plain-English breakdown with analogy (learn-faster goal) |
| `executiveBrief` | Strategic risk/opportunity + 90-day action (lead-decide goal) |

Generate the briefing sections:
- `summary` — 3-5 one-sentence executive bullets
- `quickHits` — 3-5 bold-lead one-liners: **Actor action** — implication
- `contentIdeas` — 2-3 developed post angles with hook + format + why it performs
- `driveTime` — 5-min radio script, conversational, **bold** for segment headers
- `salesIntel` — buyer trigger, 2 openers, discovery question, objection handle
- `explainers` — 1-2 plain-English concept breakdowns
- `strategyBrief` — risk, opportunity, 90-day action

### G4 — Write the briefing file

Persona key format: `{industry}|{role}|{comma-sorted-goals}`
Filename: replace `|` with `_` → `{industry}_{role}_{goals}.md`
Path: `data/briefings/TODAY/{filename}`

Write the file in this exact format:

```markdown
---
date: TODAY
personaKey: "{industry}|{role}|{goals}"
articlesFetched: N
generatedAt: "ISO-8601 timestamp"
id: "TODAY-{personaKey-sanitised}"

signals:
  - number: 1
    classification: "Strategic Signal"
    title: "Title here"
    whatHappened: "..."
    whyItMatters: "..."
    industryImpact: "..."
    roleImpact: "..."
    myTake: "..."
    hook: "..."
    contentAngle: "..."
    salesIntel: "..."
    explainer: "..."
    executiveBrief: "..."
  - number: 2
    ...
  - number: 3
    ...
---

# TODAY — {personaKey}

## Summary
- Bullet one.
- Bullet two.
- Bullet three.

## Quick Hits
**Actor action** — implication. **Actor action** — implication.

## Content Ideas
**Post angle 1:** ...

**Post angle 2:** ...

## Drive Time
**Drive Time — Signal 1: Title**

[5-minute script...]

## Sales Intel
**Buyer signal:** ...

## Explainers
**What is X?** ...

## Strategy Brief
**Strategic signal:** ...

---

## Signals

### Signal 1: Title
**Strategic Signal**

**What happened:** ...

**Why it matters:** ...

**Industry impact:** ...

**Role impact:** ...

**Expert take:** ...

**Hook:** ...

**Content angle:** ...

**Sales intel:** ...

**Explainer:** ...

**Executive brief:** ...

### Signal 2: ...

### Signal 3: ...
```

### G5 — Confirm

Print:
```
✅ omgstack generate — TODAY
   Industry : {INDUSTRY} {EMOJI}
   Role     : {ROLE}
   Goals    : {GOALS}
   Articles : N fetched from X sources
   Signals  : 3 generated
   Saved    : data/briefings/TODAY/{filename}
   View     : http://localhost:3004/dashboard
```

Then display the **Summary** bullets so you see the signals immediately.

If `generate all` was given, loop G1–G5 for all 10 industries in sequence.

---

## ═══ SHOW ══════════════════════════════════════════════════════════════════
## Step S — Show a saved briefing

**Args:** `show [industry] [date]` or `show list`

### S1 — Find the file

```bash
find data/briefings -name "{INDUSTRY}_*.md" ! -name "_raw*" | sort -r | head -3
```

If `list` was given:
```bash
find data/briefings -name "*.md" ! -name "_raw*" | sort -r
```
Print as a table: Date | Industry | File.

### S2 — Display

Print each section cleanly:
1. Header (date, industry, persona)
2. Summary bullets
3. Each signal with all fields
4. Drive Time script
5. Ask: "Show Content Ideas, Sales Intel, Explainers, or Strategy Brief?"

---

## ═══ BACKFILL ══════════════════════════════════════════════════════════════
## Step B — Generate briefings for past dates

**Args:** `backfill [N | start-date] [end-date] [industry]`

### B1 — Resolve date range

- `backfill 7` → yesterday back 7 days, technology-saas
- `backfill 7 healthcare` → yesterday back 7 days, healthcare
- `backfill 2026-05-01 2026-05-18` → that range

Check which dates already have a briefing for this industry:
```bash
find data/briefings -name "{INDUSTRY}_*.md" | sort
```
Skip existing unless `--force` is passed.

### B2 — Generate each missing date

For backfill, RSS only has recent articles. Be transparent:
generate using training knowledge of events from that period,
plus any context from adjacent real briefings that exist.

Add `backfilled: true` to the frontmatter.

Follow G3–G4 for each date, using the date override instead of today.

### B3 — Summary table

```
Date         Status    Signals  File
2026-05-18   ✓ new     3        healthcare_executive_...md
2026-05-17   ✓ new     3        healthcare_executive_...md
2026-05-16   skipped   —        already exists
```

---

## ═══ PERSONA ════════════════════════════════════════════════════════════════
## Step P — Preview or manage a persona

**Args:** `persona [industry] [role] [goal]` or `persona list` or `persona compare ...`

### P1 — Preview

Read `content-engine/taxonomy.md` for industry/role/goal descriptions.
Read any matching StackDNA: `content-engine/stackdna/{industry}-{role}-{primary-goal}.md`

Print:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Persona: {INDUSTRY_LABEL} × {ROLE_LABEL} × {GOAL_LABEL}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Industry context: [from taxonomy + industry file]
What this person needs: [role-specific framing]
Signal fields shown: [list which fields are included]
Sections shown: [list which sections are included]
Persona key: {industry}|{role}|{goals}
File pattern: data/briefings/DATE/{sanitised-key}.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If a today briefing exists for this persona, show its 3-bullet summary.

### P2 — List

```bash
find data/briefings -name "*.md" ! -name "_raw*" | xargs -I{} basename {} .md | sort -u
```

### P3 — Compare

Side-by-side table of what each persona gets (same industry, different role/goals).

---

## ═══ SOURCES ════════════════════════════════════════════════════════════════
## Step R — Manage RSS feeds

**Args:** `sources [industry]` or `sources add {industry} {url}` or `sources clean {industry}`

### R1 — List all source packs

```bash
ls content-engine/source-packs/ 2>/dev/null || echo "No source packs yet — using inline defaults"
```

For each file: industry, feed count, last briefing date.

### R2 — Test feeds for an industry

```bash
python3 - <<'PYEOF'
import urllib.request, sys

industry = sys.argv[1]
try:
    lines = open(f"content-engine/source-packs/{industry}-sources.md").readlines()
    urls = [l.strip()[2:] for l in lines if l.strip().startswith("- http")]
except FileNotFoundError:
    print(f"No source pack for {industry} — using inline defaults")
    sys.exit(0)

for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "omgstack/1.0"})
        r = urllib.request.urlopen(req, timeout=6)
        size = len(r.read())
        print(f"✓  {url.split('/')[2]:<45} {size//1024}KB")
    except Exception as e:
        print(f"✗  {url.split('/')[2]:<45} {e}")
PYEOF
```

### R3 — Add a feed

Test the URL first. If valid RSS (contains `<item>` or `<entry>` tags), append to the source pack.
Create the file if it doesn't exist yet using the format below.

### R4 — Clean dead feeds

Run R2, then remove all `✗` lines from the source pack file.

**Source pack format:**
```markdown
---
industry: {industry}
last_tested: YYYY-MM-DD
---
# {Industry} RSS Sources

## Category Name
- https://feed-url-here
```

---

## ═══ AUDIT ══════════════════════════════════════════════════════════════════
## Step A — Review briefing quality

**Args:** `audit [industry] [date]` or `audit all`

### A1 — Load the briefing

Read the target `.md` file. If `all`, find all non-`_raw*` files in today's directory.

### A2 — Score each signal (5 points each)

| Check | Points | Flag |
|---|---|---|
| Classification matches the actual event | 1 | ⚠ MISCLASSIFIED |
| whatHappened has specific numbers/names | 1 | ⚠ VAGUE |
| hook doesn't start with "I" or use clichés | 1 | ✗ BAD HOOK |
| myTake is non-obvious (not a repeat of whyItMatters) | 1 | ⚠ REDUNDANT |
| executiveBrief has a concrete 90-day action | 1 | ⚠ NO ACTION |

### A3 — Score sections

- Drive Time reads as continuous prose (not bullets in disguise)
- Summary bullets are distinct signals (not two bullets on the same thing)
- Quick Hits are all one-liners

### A4 — Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Audit: {INDUSTRY} × {ROLE} — TODAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Signal 1: {title}
  Classification : ✓ / ⚠
  Facts          : ✓ / ⚠
  Hook           : ✓ / ✗
  Expert take    : ✓ / ⚠
  90-day action  : ✓ / ⚠
  Score          : N/5

Signal 2: ...
Signal 3: ...

Sections:
  Drive Time  : ✓ / ⚠
  Quick Hits  : ✓ / ⚠
  Summary     : ✓ / ⚠

Overall: N/15 — [Excellent / Good / Fix before using]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### A5 — Offer to fix

If any flags found: "Want me to fix the flagged issues and rewrite the file?"
If yes: rewrite only the flagged fields in-place. Do not regenerate the whole briefing.
