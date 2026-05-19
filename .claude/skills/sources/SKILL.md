# omgskill Sources

Manage RSS source lists for each industry. Test feeds, add new ones, remove dead ones.

---

## How to invoke

```
/sources                         # show all source packs and their status
/sources healthcare              # show healthcare sources + test each feed
/sources add healthcare https://.. "Feed Name"   # add a new feed
/sources test https://..         # test a single feed URL
/sources clean healthcare        # remove dead feeds from a source pack
```

---

## Step 0 — Parse intent

Route to the appropriate step based on the argument pattern.

---

## Step 1 — Show all source packs

```bash
ls content-engine/source-packs/
```

For each file, print:
- Industry name
- Number of feeds listed
- Last time a briefing was generated (from `data/briefings/` timestamps)

---

## Step 2 — Test feeds for an industry

Read the source pack file for the given industry.
For each URL, run a quick fetch test:

```bash
python3 - <<'EOF'
import urllib.request, sys

urls = [line.strip()[2:] for line in open(sys.argv[1]) if line.strip().startswith("- http")]
for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "omgskill/1.0"})
        r = urllib.request.urlopen(req, timeout=6)
        size = len(r.read())
        print(f"✓  {url.split('/')[2]:<40} {size//1024}KB")
    except Exception as e:
        print(f"✗  {url.split('/')[2]:<40} {e}")
EOF
```

Report which feeds are live vs. dead.

---

## Step 3 — Add a new feed

1. Test the URL first (Step 2 single URL)
2. If it returns valid RSS (check for `<item>` or `<entry>` tags), add it
3. Determine which source pack file to update based on the industry argument
4. Append the URL under the appropriate section header
5. Confirm: "Added {url} to content-engine/source-packs/{industry}-sources.md"

---

## Step 4 — Clean dead feeds

Run Step 2 for the given industry.
Remove all URLs that failed (non-2xx, timeout, no `<item>` tags).
Print a diff of what was removed.

---

## Source pack file format

Each file in `content-engine/source-packs/` follows this format:

```markdown
---
industry: healthcare
last_tested: YYYY-MM-DD
---

# Healthcare RSS Sources

## Clinical & Health System News
- https://www.fiercehealthcare.com/rss/xml
- https://www.healthcareitnews.com/rss.xml

## Regulatory & Policy
- https://www.cms.gov/newsroom/rss

## Research & Innovation
- https://www.nejm.org/action/showFeed?type=etoc
```
