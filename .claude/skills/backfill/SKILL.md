# omgskill Backfill

Generate briefings for past dates. Useful for seeding the archive before launch,
or filling gaps from days when generation failed.

---

## How to invoke

```
/backfill 7                      # generate the last 7 days for default persona
/backfill 7 healthcare           # last 7 days for healthcare
/backfill 2026-05-01 2026-05-18  # date range for default persona
/backfill 2026-05-18 healthcare  # specific date + industry
```

---

## Step 0 — Parse arguments

Resolve the date range and industry from the arguments.

- Single number N → last N days from yesterday, default industry = technology-saas
- Single number N + industry → last N days, that industry
- Two dates → that range
- Single date + industry → just that one date

---

## Step 1 — Check what already exists

```bash
find data/briefings -name "{INDUSTRY}_*.md" | sort
```

List which dates are already covered. Skip those — don't regenerate existing briefings
unless the user explicitly passes `--force`.

---

## Step 2 — Generate each missing date

For each missing date in the range:

1. Note: RSS feeds only contain the last 24–72 hours of articles. For backfill,
   you will not have the actual articles from that date. Be transparent about this.
   Generate based on your training knowledge of what was happening in that industry
   during that week, plus any context clues from adjacent briefings that do exist.

2. Generate the briefing following the same format as `/generate` Step 3–4,
   but use the date override instead of today.

3. Add a frontmatter note: `backfilled: true` so it's distinguishable from
   live-fetched briefings.

---

## Step 3 — Confirm

Print a table of what was generated vs. skipped (already existed):

```
Date         Status    File
2026-05-18   ✓ new     healthcare_executive_...md
2026-05-17   ✓ new     healthcare_executive_...md
2026-05-16   skipped   already exists
```
