# omgskill Persona

Design, review, and test a persona combination before generating briefings for it.
Helps you understand what a user with a specific profile will see.

---

## How to invoke

```
/persona healthcare sales sell-better     # preview what this persona sees
/persona list                             # list all persona combos that have briefings
/persona compare healthcare executive healthcare sales   # compare two personas
/persona add banking-finance product create-content      # add a new persona to the generation defaults
```

---

## Step 0 — Parse intent

- `list` → list all persona keys found in `data/briefings/`
- `compare` → run Step 3
- `add` → run Step 4
- Otherwise → run Steps 1–2 (preview)

---

## Step 1 — Load persona definition

Read `content-engine/taxonomy.md` to look up:
- The industry label and key focus areas
- The role label and what they need from a briefing
- The content goal(s) and what gets delivered

Read any StackDNA file that matches: `content-engine/stackdna/{industry}-{role}-{primary-goal}.md`

---

## Step 2 — Preview what this persona sees

Print a structured preview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Persona: Healthcare × Sales × Sell Better
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Industry context: [2-3 sentences from content-engine/industries/healthcare.md]

What this person needs:
  - Buying triggers from healthcare AI news
  - Conversation starters referencing recent developments
  - Pain points surfaced by new regulations or technology shifts

What they see in each signal:
  ✓ What happened (core)
  ✓ Why it matters (core)
  ✓ Industry impact (core)
  ✓ Role impact (core)
  ✓ Expert take (core)
  ✓ Hook — LinkedIn opener (core)
  ✓ Sales intel — buyer trigger + opener (sell-better)

What they see in sections:
  ✓ Summary (stay-updated)
  ✓ Quick Hits (stay-updated)
  ✓ Sales Intel section (sell-better)
  ✓ Drive Time (always)
  ✗ Content Ideas (not selected)
  ✗ Explainers (not selected)
  ✗ Strategy Brief (not selected)

Persona key: healthcare|sales|sell-better,stay-updated
File pattern: data/briefings/DATE/healthcare_sales_sell-better,stay-updated.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If a briefing for today already exists for this persona, show a 3-bullet preview of the signals.

---

## Step 3 — Compare two personas

Show a side-by-side table of what each persona gets:
- Same signals (same industry), different role/goal enrichment
- Highlight the fields that differ

---

## Step 4 — Add a persona to generation defaults

When the user runs `/persona add {industry} {role} {goals}`:

1. Show the persona preview (Step 2)
2. Confirm: "Add this to the nightly generation list?"
3. If confirmed, append to `.claude/skills/generate/SKILL.md` in the defaults table
   and note that `/generate all` will now include it
