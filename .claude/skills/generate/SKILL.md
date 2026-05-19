# omgskill Generate

Generates today's AI intelligence briefing for a specific industry × role × content goals persona.
Fetches from 30+ RSS sources, curates using the content engine, writes a markdown briefing file.

No external API key needed — Claude Code does the generation.

---

## How to invoke

```
/generate                              # generate technology-saas (default)
/generate healthcare                   # generate for healthcare industry
/generate healthcare executive         # healthcare × executive role
/generate banking-finance sales        # banking × sales role
/generate all                          # generate all 10 industry defaults
```

---

## Step 0 — Parse arguments

Read the arguments:
- No args → industry = `technology-saas`, role = `executive`
- One arg (industry) → use that industry, role = `executive`
- Two args (industry role) → use both
- `all` → generate all 10 industries in sequence (see Step 5)

Note today's date as TODAY in YYYY-MM-DD format.

---

## Step 1 — Load persona context

Read the matching industry file from `content-engine/industries/` if it exists.
Read `content-engine/strategy.md` for curation principles.
Read `content-engine/taxonomy.md` for the industry/role/goal reference.

Industry → default role → default content goals:
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

If a role was passed as an argument, use it. Otherwise use the default for the industry.
Content goals always use the defaults from the table above.

---

## Step 2 — Fetch RSS articles

Run this Python script to fetch articles from the sources relevant to this industry.
The sources file is `content-engine/source-packs/{industry}-sources.md` if it exists,
otherwise fall back to `content-engine/source-packs/core-sources.md`.

If neither file exists, use the inline core URLs below.

```bash
python3 - <<'EOF'
import urllib.request, xml.etree.ElementTree as ET, re, sys, os, json
from datetime import datetime, timedelta, timezone

INDUSTRY = sys.argv[1] if len(sys.argv) > 1 else "technology-saas"
TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%d")

def strip_html(s):
    return re.sub(r'<[^>]+>', '', s or '').replace('\n', ' ').strip()[:500]

# Core AI sources (always included)
CORE_URLS = [
    "https://www.technologyreview.com/feed/",
    "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    "https://venturebeat.com/category/ai/feed/",
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://huggingface.co/blog/feed.xml",
    "https://github.blog/feed/",
    "https://feeds.arstechnica.com/arstechnica/index",
    "https://openrss.org/openai.com/news/rss.xml",
]

# Industry-specific sources
INDUSTRY_URLS = {
    "healthcare":        ["https://www.fiercehealthcare.com/rss/xml", "https://www.healthcareitnews.com/rss.xml", "https://www.beckershospitalreview.com/rss/rss.html"],
    "banking-finance":   ["https://www.americanbanker.com/feed", "https://feeds.bloomberg.com/technology/news.rss"],
    "insurance":         ["https://www.propertycasualty360.com/feed", "https://www.insurancejournal.com/rss/"],
    "education":         ["https://www.edsurge.com/news.rss", "https://edtechmagazine.com/k12/rss.xml"],
    "real-estate":       ["https://therealdeal.com/feed/", "https://www.housingwire.com/feed/"],
    "retail-ecommerce":  ["https://www.retaildive.com/feeds/news/", "https://nrf.com/rss.xml"],
    "manufacturing":     ["https://www.industryweek.com/rss", "https://www.manufacturingdive.com/feeds/news/"],
    "legal-compliance":  ["https://iapp.org/feed/", "https://www.jdsupra.com/post/rss.aspx?section=technology"],
    "government":        ["https://www.nextgov.com/rss/all/", "https://www.fedscoop.com/feed/"],
    "technology-saas":   ["https://changelog.com/posts/feed", "https://martinfowler.com/feed.atom"],
}

urls = CORE_URLS + INDUSTRY_URLS.get(INDUSTRY, [])

articles = []
failed = []

for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "omgskill-crawler/1.0"})
        raw = urllib.request.urlopen(req, timeout=8).read().decode("utf-8", errors="replace")
        domain = url.split("/")[2].replace("www.", "")
        items = re.findall(r'<item[^>]*>(.*?)</item>', raw, re.DOTALL)
        for item in items:
            title = re.search(r'<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</title>', item, re.DOTALL)
            link  = re.search(r'<link[^>]*>(.*?)</link>', item, re.DOTALL)
            desc  = re.search(r'<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</description>', item, re.DOTALL)
            date  = re.search(r'<pubDate[^>]*>(.*?)</pubDate>', item, re.DOTALL)
            if title and link:
                articles.append({
                    "title":   title.group(1).strip(),
                    "url":     link.group(1).strip(),
                    "source":  domain,
                    "date":    date.group(1).strip() if date else "",
                    "summary": strip_html(desc.group(1) if desc else ""),
                })
        print(f"OK  {domain} ({len(items)} items)")
    except Exception as e:
        failed.append(url)
        print(f"ERR {url.split('/')[2]} — {e}")

# Deduplicate by title
seen, unique = set(), []
for a in articles:
    k = a["title"].lower().strip()
    if k and k not in seen:
        seen.add(k)
        unique.append(a)

# Save raw fetch
os.makedirs(f"data/briefings/{TODAY}", exist_ok=True)
raw_path = f"data/briefings/{TODAY}/_raw_{INDUSTRY}.json"
with open(raw_path, "w") as f:
    json.dump(unique, f, indent=2)

print(f"\nFetched: {len(unique)} unique articles | Failed: {len(failed)} | Saved: {raw_path}")
EOF
```

Run with the target industry as argument, e.g.:
```bash
python3 ... healthcare
```

After the script runs, read the saved JSON file to load articles into context.

---

## Step 3 — Curate and generate the briefing

You now have the articles in context. Apply the strategy from `content-engine/strategy.md`:

**Apply the 3-lens test** for every article:
1. Industry relevance — is this happening in the {INDUSTRY} world?
2. Role relevance — does this change how a {ROLE} does their job this week?
3. Goal alignment — does this give the user what their content goals need?

Only keep articles that pass all 3 lenses. Classify each as:
- **Strategic Signal** — changes strategy this quarter
- **Emerging Trend** — will matter in 6–18 months
- **Tactical Update** — tool/process change, use it now
- **Governance Alert** — regulatory or compliance development
- **Hype/Noise** — lots of attention, little substance

Select the **top 3 signals** (or up to 10 if generating all signals).

For each signal, generate:
- `title` — precise, under 15 words
- `whatHappened` — 2-3 sentences, facts only
- `whyItMatters` — 1-2 sentences, the implication
- `industryImpact` — what changes in this industry
- `roleImpact` — what changes for this role
- `myTake` — the non-obvious read, what most people miss
- `hook` — one sentence ready to paste as a LinkedIn opener (no "I", no "excited to share")
- `contentAngle` — post angle and format (for create-content goal)
- `salesIntel` — buyer trigger, opener, pain point (for sell-better goal)
- `explainer` — plain-English breakdown with analogy (for learn-faster goal)
- `executiveBrief` — strategic risk/opportunity + 90-day action (for lead-decide goal)

Generate the briefing sections:
- `summary` — 3-5 one-sentence executive bullets
- `quickHits` — 3-5 bold-lead one-liners (**Actor action** — implication)
- `contentIdeas` — 2-3 developed post angles
- `driveTime` — 5-min radio-style script, conversational, **bold** for segment headers
- `salesIntel` — buyer intel synthesis: trigger, 2 openers, discovery question, objection handle
- `explainers` — 1-2 plain-English concept breakdowns
- `strategyBrief` — risk, opportunity, 90-day action

---

## Step 4 — Write the briefing file

Build the persona key: `{industry}|{role}|{sorted-goals}`
Example: `healthcare|executive|lead-decide,stay-updated`

Sanitise for filename: replace `|` with `_`, commas stay.
Example filename: `healthcare_executive_lead-decide,stay-updated.md`

Write to `data/briefings/TODAY/{filename}` using this exact format:

```markdown
---
date: TODAY
personaKey: "{industry}|{role}|{goals}"
articlesFetched: N
generatedAt: "ISO timestamp"
id: "TODAY-{personaKey}"

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

## Drive Time
**Drive Time — Signal 1: Title**

Opening hook...

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

---

## Step 5 — Generate all industries (when `all` argument passed)

Run Steps 2–4 for each industry in sequence:
1. technology-saas
2. healthcare
3. banking-finance
4. insurance
5. education
6. real-estate
7. retail-ecommerce
8. manufacturing
9. legal-compliance
10. government

Print a summary after each one. Total runtime is roughly 10–15 minutes.

---

## Step 6 — Confirm and summarise

After writing, print:

```
✅ omgskill briefing — TODAY complete
   Industry    : {INDUSTRY}
   Role        : {ROLE}
   Goals       : {GOALS}
   Articles    : N fetched
   Signals     : 3 generated
   Saved to    : data/briefings/TODAY/{filename}
   View at     : http://localhost:3004/dashboard
```

Then display the **Summary** section so you see the key signals immediately.
