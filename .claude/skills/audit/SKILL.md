# omgskill Audit

Review a generated briefing for quality: signal accuracy, classification correctness,
hook quality, and whether the content-goal enrichments are genuinely useful.

Catches: hallucinations, weak hooks, misclassified signals, thin explainers.

---

## How to invoke

```
/audit                           # audit today's technology-saas briefing
/audit healthcare                # audit today's healthcare briefing
/audit healthcare 2026-05-18     # audit a specific date
/audit all                       # audit all of today's briefings, score each
```

---

## Step 0 — Load the briefing

Read the target `.md` file from `data/briefings/`.
If auditing `all`, find all non-`_raw*` files in today's directory.

---

## Step 1 — Signal quality review

For each signal, evaluate:

**Classification accuracy**
- Does the event actually match the classification label?
- "Strategic Signal" should change strategy this quarter. "Emerging Trend" = 6–18 months out.
- Flag: `⚠ MISCLASSIFIED` if wrong

**Factual confidence**
- Does the whatHappened contain specific, verifiable claims (numbers, names, dates)?
- Flag: `⚠ VAGUE` if it reads like a summary without facts
- Flag: `⚠ CHECK FACTS` if the numbers seem implausible

**Hook quality**
- Does the hook start with "I"? → Flag: `✗ STARTS WITH I`
- Does it use "excited to share", "hot take", "unpopular opinion"? → Flag: `✗ CLICHE`
- Is it a complete, punchy sentence that would stop a scroll? → Score: ✓ / ✗

**Expert take**
- Does it say something non-obvious? Or just rephrase whyItMatters?
- Flag: `⚠ REDUNDANT` if it repeats the same point as whyItMatters

---

## Step 2 — Content-goal enrichment review

For each goal-specific field (contentAngle, salesIntel, explainer, executiveBrief):

**contentAngle**: Is it a specific post format + differentiated angle? Or generic advice?
**salesIntel**: Does it name a specific title, a specific opener, a specific pain point?
**explainer**: Does it include an analogy? Is it genuinely plain-English?
**executiveBrief**: Does it include a concrete 90-day action? Or just repeat the signal?

---

## Step 3 — Sections review

**Drive Time**: Does it read as a continuous 5-minute radio segment? Or a bullet list in disguise?
**Quick Hits**: Are they genuinely quick (one line) or padded?
**Summary**: Do the 3-5 bullets each name a distinct signal? Or are two bullets about the same thing?

---

## Step 4 — Score and report

Print a structured report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Audit: healthcare × executive — 2026-05-19
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Signal 1: FDA AI Prior Authorization
  Classification : ✓ Strategic Signal (correct)
  Facts          : ✓ specific (14 days → 6 hours, 78% of transactions)
  Hook           : ✓ punchy, no clichés
  Expert take    : ✓ non-obvious (audit trail requirement is the real risk)
  Executive brief: ✓ has 90-day action
  Score          : 5/5

Signal 2: Epic Ambient Documentation
  Classification : ✓ Emerging Trend
  Facts          : ✓ 1M encounters, 120+ health systems
  Hook           : ⚠ WEAK — "1 million patient encounters" doesn't stop a scroll
  Expert take    : ✓ non-obvious (CMIO adoption is the bottleneck)
  Executive brief: ✓ concrete action
  Score          : 4/5

Signal 3: ...

Sections:
  Drive Time     : ✓ reads like radio
  Quick Hits     : ✓ all one-line
  Summary        : ✓ 3 distinct signals

Overall: 13/15 — Good. Fix Signal 2 hook before this goes live.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 5 — Offer to fix issues

If any flags or weak scores were found:
"Want me to fix the flagged issues and rewrite the file?"

If yes, rewrite only the flagged fields in place — don't regenerate the whole briefing.
