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

/omgstack resources                             # generate resources for technology-saas
/omgstack resources healthcare                  # generate resources for healthcare
/omgstack resources all                         # generate for all 10 industries

/omgstack opportunities                         # scan today's opportunities for technology-saas
/omgstack opportunities healthcare              # scan for healthcare
/omgstack opportunities fixed                   # regenerate the evergreen fixed list only

/omgstack social                                # generate social posts from today's tech/saas briefing
/omgstack social healthcare executive           # social posts for healthcare × executive persona

/omgstack resume                                # interactive resume analyzer (paste or path)
/omgstack resume path/to/resume.txt             # analyze from file
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
| `resources` | Step RES: Resources |
| `opportunities` | Step OPP: Opportunities |
| `social` | Step SOC: Social Posts |
| `resume` | Step RUM: Resume Analyzer |

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

---

## ═══ RESOURCES ══════════════════════════════════════════════════════════════
## Step RES — Generate curated AI resources for an industry

**Args:** `resources [industry]` or `resources all`

The output is a markdown file the web app reads directly. This is the brain for the /dashboard/resources page.

### RES1 — Resolve industry

If no industry given: `technology-saas`. If `all`: loop all 10 industries.

Read `content-engine/taxonomy.md` for the industry's context, key concerns, and AI pain points.

### RES2 — Generate resources content

For the given industry, generate a comprehensive, curated resource guide with REAL people and links. Apply deep knowledge of:
- Who the actual influential practitioners and researchers are in AI × this industry
- Which publications, blogs, and newsletters cover this intersection well
- Which LinkedIn groups have active, signal-rich communities (not dead ones)
- Which Twitter/X accounts post original analysis (not reshares)

Include:
- **AI impact overview**: 1 paragraph + 5–7 specific impact bullets with numbers where possible
- **LinkedIn follows**: 4–5 practitioners with LinkedIn URLs and a specific reason why each is worth following
- **Twitter/X follows**: 3–4 accounts with handles and why they're signal not noise
- **Blogs & publications**: 4–5 sources with URLs, update cadence, and what makes each worth reading
- **LinkedIn groups**: 3–4 active groups with estimated member counts and why each is useful

Be specific. "Thought leader in AI" is not a reason. "Posts original research on clinical LLM deployment weekly, rarely reposts" is a reason.

### RES3 — Write the file

Path: `data/resources/{industryId}.md`

```markdown
---
industryId: {INDUSTRY}
generatedAt: TODAY
---

# {INDUSTRY_EMOJI} {INDUSTRY_LABEL} — AI Resources

## AI & Your Industry

{1-paragraph AI impact summary — specific, no hype}

### What's actually changing

- {specific change with numbers}
- {specific change with numbers}
- {specific change with numbers}
- {specific change with numbers}
- {specific change with numbers}

---

## Who to Follow on LinkedIn

### {Person Name} | {Title}
**Why follow:** {specific reason — what they post, how often, why it's signal}
**LinkedIn:** {url}

### {Person Name} | {Title}
...

---

## Who to Follow on X (Twitter)

### @{handle} — {Person Name}
**Why follow:** {specific reason}
**Twitter:** https://twitter.com/{handle}

...

---

## Blogs & Publications

### {Publication Name}
**Cadence:** {Daily / Weekly / Irregular}
**URL:** {url}
**Why read:** {what makes this worth reading for this industry}

...

---

## LinkedIn Groups to Join

### {Group Name}
**Members:** ~{N}
**URL:** {url}
**Why join:** {what kind of discussion happens, signal-to-noise ratio}

...
```

### RES4 — Confirm

```
✅ omgstack resources — {INDUSTRY}
   Saved    : data/resources/{industryId}.md
   Sections : AI Impact, LinkedIn Follows, X/Twitter, Blogs, Groups
   View     : http://localhost:3004/dashboard/resources
```

If `resources all`, loop RES1–RES4 for all 10 industries.

---

## ═══ OPPORTUNITIES ═══════════════════════════════════════════════════════════
## Step OPP — Scan and write daily + evergreen opportunities

**Args:** `opportunities [industry] [date]` or `opportunities fixed`

The output is a markdown file the web app reads directly. This is the brain for the /dashboard/opportunities page.

### OPP1 — Route

- `opportunities fixed` → go to OPP-FIXED: generate/update evergreen list
- `opportunities [industry]` → go to OPP-DAILY: scan today's opportunities

### OPP-FIXED — Generate evergreen opportunities

Generate a comprehensive, curated list of REAL recurring opportunities relevant to AI professionals across all industries. Include:

- **10–15 hackathons**: Lablab.ai (weekly), DevPost AI, Google Cloud, AWS, Microsoft Imagine Cup, Hugging Face, and industry-specific ones
- **10–15 conferences**: NeurIPS, ICLR, Google I/O, Microsoft Build, AWS re:Invent, Gartner IT Symposium, and industry-specific summits
- **8–10 webinars & learning**: DeepLearning.AI short courses, MIT Sloan webinar series, Gartner webinars, Google AI learning path, Microsoft AI Skills Fest
- **5–8 competitions**: Kaggle, DrivenData, AI for Good, AWS Startup Challenge
- **5–8 communities**: LangChain office hours, Hugging Face events, MLOps Community, AI Engineer Summit, Responsible AI Institute

Write each entry with: type, when, deadline (if applicable), URL, 2-sentence description, format (virtual/in-person/hybrid), cost (free/paid/varies), tags (list of industryIds or "all").

Path: `data/opportunities/fixed.md`

Format:
```markdown
---
lastUpdated: TODAY
---

# Evergreen AI Opportunities

## HACKATHONS

### {Title}
**Organizer:** {org}
**Type:** hackathon
**When:** {recurring pattern}
**Deadline:** {if applicable}
**Format:** virtual | in-person | hybrid
**Cost:** free | paid | varies
**Tags:** all | {industryId1, industryId2}
**URL:** {url}
**Description:** {2 sentences — what it is and why it matters}

---

## CONFERENCES

### {Title}
...

---

## WEBINARS & LEARNING

...

---

## COMPETITIONS

...

---

## COMMUNITY

...
```

### OPP-DAILY — Scan today's opportunities for an industry

**Args:** `opportunities [industry] [date?]`

Scan for REAL, CURRENT opportunities announced recently or with registration open NOW:
- Events in the next 60 days
- Hackathons with open submission windows
- Upcoming webinar registrations
- New competition launches

Include 6–8 entries. Only include events you are confident are real with working URLs.

Path: `data/opportunities/{date}-{industryId}.md`

Format:
```markdown
---
date: {DATE}
industryId: {INDUSTRY}
generatedAt: {ISO timestamp}
---

# {INDUSTRY_EMOJI} {INDUSTRY_LABEL} — Opportunities for {DATE}

## TODAY'S DISCOVERIES

### {Title}
**Organizer:** {org}
**Type:** hackathon | conference | webinar | competition | community
**When:** {specific date}
**Deadline:** {if applicable}
**Format:** virtual | in-person | hybrid
**Cost:** free | paid | varies
**URL:** {url}
**Description:** {2 sentences specific to why this matters for {INDUSTRY} professionals}

...
```

### OPP3 — Confirm

```
✅ omgstack opportunities — {INDUSTRY} — {DATE}
   Saved    : data/opportunities/{date}-{industryId}.md
   Found    : N opportunities
   View     : http://localhost:3004/dashboard/opportunities
```

---

## ═══ SOCIAL POSTS ════════════════════════════════════════════════════════════
## Step SOC — Generate social media posts from today's briefing

**Args:** `social [industry] [role] [goals...]`

The output is a markdown file the web app reads directly. This is the brain for the 📱 Social tab in the dashboard.

### SOC1 — Resolve persona and load briefing

Default: technology-saas × executive × stay-updated,create-content.

Build the persona key: `{industry}_{role}_{comma-sorted-goals}`.

Find the briefing:
```bash
find data/briefings/$(date +%Y-%m-%d) -name "{industry}*.md" ! -name "_raw*" | head -1
```

If no briefing exists for today: "No briefing found for {industry} today. Run `/omgstack generate {industry}` first."

Read the briefing file. Extract the top 3–5 signal titles and their `whatHappened` and `whyItMatters` fields from the YAML frontmatter.

### SOC2 — Generate platform posts

Using the signals as source material, write posts for each platform. Tailor voice, length, and format to the platform. The writer is a {ROLE} in the {INDUSTRY} industry sharing professional insights.

**LinkedIn Post** (200–300 words):
- Hook line that creates curiosity or stakes a position
- 2–3 insights drawn from today's signals, specific to the industry
- Concrete implication for practitioners
- Question that invites comments
- 3–5 hashtags at the end
- No AI writing clichés ("fascinating", "excited to share", "diving deep")

**Twitter/X Thread** (5 tweets):
- Tweet 1: Hook (under 250 chars, makes people want to read on)
- Tweets 2–4: One insight each, specific with data where possible
- Tweet 5: Takeaway + 2–3 hashtags + thread marker (🧵)

**LinkedIn Short Post** (60–80 words):
- One punchy insight from today's signals
- 1–2 sentences of "why this matters for you"
- End with a question
- Good for quick daily presence

**Newsletter Teaser** (3–4 sentences):
- Hooks the reader on what they'll learn
- Specific: "Today I cover [X], [Y], and [Z]"
- Ends with a reason to click through

### SOC3 — Write the file

Path: `data/social/{date}-{personaKey}.md`

```markdown
---
date: {DATE}
personaKey: {personaKey}
industry: {INDUSTRY}
role: {ROLE}
generatedAt: {ISO timestamp}
signalCount: N
---

# Social Posts — {INDUSTRY_EMOJI} {INDUSTRY_LABEL} — {DATE}

## LinkedIn Post

{full post content — ready to copy-paste}

---

## Twitter/X Thread

Tweet 1/5: {content}

Tweet 2/5: {content}

Tweet 3/5: {content}

Tweet 4/5: {content}

Tweet 5/5: {content}

---

## LinkedIn Short Post

{short post content}

---

## Newsletter Teaser

{teaser content}
```

### SOC4 — Confirm

```
✅ omgstack social — {INDUSTRY} × {ROLE} — {DATE}
   Signals used : N
   Platforms    : LinkedIn Post, X Thread, LinkedIn Short, Newsletter Teaser
   Saved        : data/social/{date}-{personaKey}.md
   View         : http://localhost:3004/dashboard → 📱 Social tab
```

---

## ═══ RESUME ANALYZER ══════════════════════════════════════════════════════════
## Step RUM — Analyze resume and generate skill gap report

**Args:** `resume` (interactive) or `resume path/to/resume.txt`

The output is a markdown file the web app reads directly. This is the brain for the /dashboard/resume page.

### RUM1 — Load resume text

If a file path was given: read the file.

If no path given: say "Paste your resume below, then type END on a new line:" and read until the user types `END` on its own line.

If the resume is shorter than 100 words: "Resume too short — paste more content and try again."

### RUM2 — Load user context

Read `data/users/` directory to find the most recent profile, or check `content-engine/taxonomy.md` for industry/role context.

If running interactively without a Clerk user profile, ask:
- "What industry are you in?" (show the 10 options)
- "What is your role?" (show the 10 options)

### RUM3 — Analyze

Apply deep analysis across these dimensions:

**Current state reading:**
- What AI tools, frameworks, and concepts does this person already know?
- What is their tech-adjacent experience (data, automation, analytics)?
- What level of AI fluency do they demonstrate implicitly?

**Gap analysis (4–7 gaps, critical first):**
For each gap, identify:
- The specific skill name
- Current level: none / beginner / intermediate
- Target level: intermediate / advanced / expert
- Importance: critical / high / medium
- Why this gap specifically matters for their industry × role combination
- The realistic time to close it

**Learning plan (one entry per gap):**
For each gap, provide 2–3 REAL, specific learning resources:
- DeepLearning.AI courses for practical AI skills
- Coursera/LinkedIn Learning for certifications
- Specific books (O'Reilly, Manning) with ISBN where possible
- Community/practice resources (Kaggle, GitHub projects to contribute to)
- Include URL, provider, duration, and free/paid

**AI Readiness Score:**
Rate 1–10:
- 1–3: No meaningful AI exposure, primarily traditional tools
- 4–6: Some AI awareness, using AI tools but not building with them
- 7–8: Integrating AI into workflows, some hands-on experience with models/APIs
- 9–10: AI-native practitioner, building agents or production AI systems

### RUM4 — Write the file

Path: `data/resume/{userId}-analysis.md` (use `default` if no userId known)

```markdown
---
analyzedAt: TODAY
industry: {INDUSTRY}
role: {ROLE}
aiReadinessScore: {N}
---

# AI Readiness Analysis — {ROLE_LABEL} in {INDUSTRY_LABEL}

## Your Top Priority

{One sentence: the single most important thing to learn first and why}

---

## AI Readiness Score: {N}/10

{2-sentence interpretation of the score — what it means for their career trajectory}

---

## Your Current AI Strengths

- {strength 1 — specific to what was in the resume}
- {strength 2}
- {strength 3}
- {strength 4}
- {strength 5}

---

## Skill Gaps

### 🔴 Critical: {Skill Name}
**Current level:** {none / beginner / intermediate}
**Target level:** {intermediate / advanced / expert}
**Why this matters:** {1–2 sentences specific to their industry × role}

### 🟠 High: {Skill Name}
...

### 🟡 Medium: {Skill Name}
...

---

## Learning Plan

### 1. {Skill Name} — {timeToClose}

**{Resource Title}**
- Provider: {provider}
- Type: Course / Book / Certification / Practice / Community
- Duration: {e.g. 6 hours, 4 weeks}
- Cost: Free / Paid
- URL: {url}

**{Resource 2 Title}**
...

### 2. {Skill Name} — {timeToClose}
...

---

## 90-Day Action Plan

{3–5 concrete weekly milestones the person can commit to}

Week 1–2: {specific action}
Week 3–4: {specific action}
Week 5–8: {specific action}
Week 9–12: {specific action}
```

### RUM5 — Confirm and display summary

```
✅ omgstack resume — {INDUSTRY} × {ROLE}
   AI Readiness  : {N}/10
   Skill gaps    : {N} identified ({N} critical, {N} high, {N} medium)
   Learning plan : {N} items, {total estimated time}
   Saved         : data/resume/{filename}
   View          : http://localhost:3004/dashboard/resume
```

Then display the **Top Priority**, **Score**, and **Strengths** so the user sees the key insights immediately.

Ask: "Want me to display the full skill gaps, or the learning plan?"
