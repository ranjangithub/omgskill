# omgskill Content Engine

The content engine is the intelligence layer behind omgskill.ai. It defines how signals are curated, enriched, and personalized for each user's industry, role, and content goal combination.

## How it works

1. **Raw signals** are fetched from 30+ RSS feeds daily
2. The **base system prompt** and **daily stack generator** apply curation rules
3. **StackDNA files** combine an industry × role × goal lens for targeted enrichment
4. **Templates** define the output format for each content goal
5. The final briefing is personalized by the user's **profile** (industry + role + goals)

## Structure

```
content-engine/
├── README.md              ← This file
├── strategy.md            ← Product and curation strategy
├── taxonomy.md            ← 3-level taxonomy reference
│
├── industries/            ← Industry-specific context and signals lens
├── roles/                 ← Role-specific framing and what matters
├── goals/                 ← Content goal output instructions
├── prompts/               ← AI system prompts for generation
├── source-packs/          ← Curated RSS + source lists by industry
├── stackdna/              ← Industry × Role × Goal combination profiles
├── templates/             ← Output format templates per goal
└── examples/              ← Real briefing examples per persona
```

## Adding a new industry

1. Create `industries/<industry-id>.md`
2. Add source list to `source-packs/<industry-id>-sources.md`
3. Create StackDNA files for the most common role+goal combos

## Adding a new goal

1. Create `goals/<goal-id>.md` with output instructions
2. Add a matching template to `templates/<goal-id>-stack-template.md`
3. Update the base system prompt to include the goal in the output schema
