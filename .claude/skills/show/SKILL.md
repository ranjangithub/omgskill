# omgskill Show

Display a saved briefing in a readable format. No generation — reads from existing files.

---

## How to invoke

```
/show                           # show today's technology-saas briefing
/show healthcare                # show today's healthcare briefing
/show healthcare 2026-05-18     # show a specific date
/show list                      # list all available briefings
```

---

## Step 0 — Parse arguments

- No args → industry = `technology-saas`, date = today
- One arg that looks like an industry → industry = arg, date = today
- `list` → run Step 3 (list all briefings), stop
- Two args → industry = arg1, date = arg2

---

## Step 1 — Find the file

Today's date = TODAY (YYYY-MM-DD).

The briefing files live in `data/briefings/{date}/`.
The filename pattern is `{industry}_*.md` — find the first match for the requested industry.

```bash
find data/briefings/{DATE} -name "{INDUSTRY}_*.md" 2>/dev/null | head -1
```

If no file found for today, check the most recent available date:
```bash
ls data/briefings/ | sort -r | head -5
```

---

## Step 2 — Display the briefing

Read the file and display it section by section in this order:

1. **Header** — date, industry, persona key, articles fetched
2. **Summary** — the 3-5 bullet executive summary
3. **Signals** — each signal with all fields, formatted cleanly
4. **Quick Hits** — the quick-hit strip
5. **Drive Time** — the full script (if present)
6. Ask: "Want me to show Content Ideas, Sales Intel, Explainers, or Strategy Brief?"

---

## Step 3 — List all briefings

```bash
find data/briefings -name "*.md" ! -name "_raw*" | sort -r
```

Print as a clean table:
```
Date         Industry           File
2026-05-19   technology-saas    technology-saas_executive_...md
2026-05-19   healthcare         healthcare_executive_...md
2026-05-18   technology-saas    technology-saas_executive_...md
```
