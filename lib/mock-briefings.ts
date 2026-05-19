import type { BriefingRecord } from "./db/schema";

const TODAY = new Date().toISOString().split("T")[0];

// ─── Healthcare ────────────────────────────────────────────────────────────────

const HEALTHCARE: BriefingRecord = {
  id: "mock-healthcare-001",
  date: TODAY,
  personaKey: "healthcare",
  articlesFetched: 138,
  generatedAt: new Date().toISOString(),
  sections: {
    summary: [
      "FDA clears first AI-powered prior authorization system — processing time drops from 14 days to 6 hours.",
      "Epic's ambient AI documentation hit 1 million patient encounters; CMIO adoption is now the bottleneck, not the technology.",
      "CMS finalizes AI bias audit requirements for Medicare Advantage plans using algorithmic utilization management.",
    ],
    quickHits:
      "**Optum acquires AI diagnostics startup for $1.3B** — vertical integration in payer AI accelerates. **Mount Sinai deploys LLM for sepsis prediction** — 31% reduction in ICU mortality in pilot. **WHO publishes AI in Health regulatory framework** — 47 countries have signed on.",
    contentIdeas:
      "**Post angle 1:** The FDA just cleared an AI prior auth system that cuts 14 days to 6 hours. Here's what that means for your denial rate — and what you still need to watch. **Post angle 2:** 1 million patient encounters. Epic's ambient AI is past the pilot phase. The new question isn't 'does it work?' — it's 'who owns the note?'",
    driveTime:
      "**Drive Time — Signal 1: FDA Prior Authorization AI**\n\nGood morning. The FDA just changed the game for prior authorization.\n\nThey cleared the first AI-powered prior auth system last week. Processing time: 14 days down to 6 hours. That's not an improvement — that's a category shift.\n\nHere's what this means in practice: payers who move fast on this gain a compliance cost advantage. Providers who integrate it reduce denial-to-appeal cycles. The vendors who haven't built this yet are 18 months behind.\n\nThe catch: CMS is now requiring bias audits for any algorithmic utilization management tool. So you can't just deploy — you need an audit trail.\n\nBottom line: if you're in revenue cycle, this is your Q3 priority. If you're in clinical ops, the documentation is yours to own.",
    salesIntel:
      "**Buyer signal:** CMS bias audit requirement creates urgency for compliance tooling in payer organizations. **Conversation opener:** 'I saw CMS finalized AI bias requirements for Medicare Advantage — how is your team tracking compliance for your utilization management tools?' **Pain point:** Most health systems don't have audit trail documentation for their existing AI deployments — that's what auditors will focus on first.",
    explainers:
      "**What is prior authorization AI?** Prior authorization is the process where a payer approves (or denies) a treatment before it happens. Traditionally, a human reviews the clinical criteria — takes 3–14 business days. AI prior auth reads the same criteria automatically from the EHR and makes the decision in minutes. The FDA clearance means the AI's decision is now medically valid — not just a workflow tool. **Key terms:** Clinical decision support (AI that assists, not decides), Utilization management (how payers control costs), Medicare Advantage (private Medicare plans with additional AI scrutiny).",
    strategyBrief:
      "**Strategic signal:** FDA clearance of prior auth AI creates a fast-mover advantage window of roughly 18–24 months before this becomes table stakes. **Risk:** CMS bias audit requirements add compliance overhead — organizations that deploy without audit infrastructure will face retroactive remediation. **90-day action:** Identify all AI-assisted utilization management tools in your stack. Commission a bias audit baseline. Align with compliance on the CMS documentation requirements before the next audit cycle.",
  },
  signals: [
    {
      number: 1,
      title: "FDA clears AI prior authorization system — 14 days to 6 hours",
      classification: "Strategic Signal",
      whatHappened:
        "The FDA granted 510(k) clearance to an AI prior authorization platform that processes clinical authorization decisions directly from EHR data. In health system pilots, median processing time dropped from 14 business days to 6 hours.",
      whyItMatters:
        "This is the first FDA-cleared AI that makes actual prior auth decisions, not just workflow suggestions. It removes the regulatory ambiguity that was blocking payer adoption at scale.",
      industryImpact:
        "Payers adopting this gain a cost-per-decision advantage that compounds with volume. Providers connected to cleared systems see denial rates drop 18–22% in early data. Vendors without FDA clearance for their auth tools face a credentialing gap.",
      roleImpact:
        "Revenue cycle teams need to evaluate integration timelines. Compliance teams need to understand the CMS bias audit overlay. CMIOs need to own the clinical criteria governance for what the AI is deciding.",
      myTake:
        "The 14-to-6-hour number is the headline. The real story is the audit trail requirement CMS added simultaneously. Clearance without audit infrastructure is a compliance trap. Build both together.",
      hook: "The FDA just cleared AI to make prior authorization decisions. Processing time: 14 days → 6 hours. The catch nobody's talking about: CMS now requires a bias audit for every deployment.",
      contentAngle:
        "Write the 'what changed and what didn't' post. The FDA cleared the decision — not the governance. Frame it as: 3 things health system leaders need to do before deploying this.",
      salesIntel:
        "Target: VPs of Revenue Cycle, CMIOs, Chief Compliance Officers at health systems with >200 beds. Lead with CMS audit requirement — that's the active compliance trigger. Ask: 'Do you have documentation of the decision criteria your current utilization management AI uses?'",
      explainer:
        "Prior authorization is a payer's permission slip before a treatment happens. Before AI, a human reviewed the criteria. With FDA clearance, the AI review is now medically valid — same legal standing as a human decision. That's the shift: from workflow tool to decision maker.",
      executiveBrief:
        "FDA clearance plus CMS audit requirements create a dual-track compliance obligation. The opportunity: early adopters reduce denial-to-appeal costs by ~20%. The risk: deploying without bias audit documentation triggers retroactive CMS remediation. Recommend a Q3 evaluation of current auth AI stack against new requirements.",
    },
    {
      number: 2,
      title: "Epic ambient AI documentation surpasses 1 million encounters",
      classification: "Emerging Trend",
      whatHappened:
        "Epic reported that its AI-powered ambient documentation tool — which transcribes and structures clinical notes from patient conversations in real time — has now processed over 1 million patient encounters across 120+ health systems.",
      whyItMatters:
        "1 million encounters is the proof point that ambient documentation works at scale, not just in pilots. Physician burnout from documentation has been the top reported driver of turnover — this directly addresses it.",
      industryImpact:
        "Health systems running Epic have a ready deployment path. Non-Epic systems face a build-vs-buy decision with less mature alternatives. Clinical documentation improvement (CDI) teams need to evolve their role — the AI produces the draft, humans validate.",
      roleImpact:
        "CMIOs own physician adoption. CDI specialists need reskilling from manual review to AI audit. Risk managers need to understand liability when AI-generated notes contain errors that weren't caught before signing.",
      myTake:
        "The CMIO adoption rate is the real bottleneck now. The technology works. But physicians who distrust the AI are re-doing the documentation anyway — eliminating the time savings. Change management is the product.",
      hook: "1 million patient encounters. Epic's ambient AI documentation isn't a pilot anymore. The new question isn't whether it works — it's who's liable when it gets the note wrong.",
      contentAngle:
        "Post: 'The documentation problem is solved. The liability problem is next.' Frame the shift from 'does ambient AI work?' to 'who signs the note and what does that mean?' Great educational format for CMIO and risk audiences.",
      salesIntel:
        "Target: CDI vendors, physician training programs, healthcare liability insurers. The signal: 1M encounters means the AI-generated note is now mainstream. Buyers are asking 'how do we audit AI notes?' not 'should we try ambient AI?'",
      explainer:
        "Ambient documentation means the AI listens to the patient-physician conversation and writes the clinical note automatically. The physician reviews and signs. Before this, documentation took 2+ hours per day — often done after hours. At 1 million encounters, this is the most widely deployed clinical AI tool in healthcare.",
      executiveBrief:
        "Ambient AI documentation is past the adoption curve — it's now an operational baseline question. Systems not deployed face a physician retention disadvantage. The strategic risk has shifted from 'will it work' to 'how do we govern it' — specifically: note accuracy audits, liability framework for AI-assisted signing, and CDI team role evolution.",
    },
    {
      number: 3,
      title: "CMS finalizes AI bias audit requirements for Medicare Advantage utilization management",
      classification: "Governance Alert",
      whatHappened:
        "CMS published the final rule requiring Medicare Advantage plans using algorithmic utilization management tools to conduct annual bias audits, maintain decision documentation, and provide human review pathways for all AI-assisted denials.",
      whyItMatters:
        "This is the first federal regulation specifically targeting AI decision-making in healthcare coverage. It creates enforceable audit obligations for every MA plan using AI in denial decisions — estimated at 85% of MA plans.",
      industryImpact:
        "MA plans must now maintain audit trails for AI-assisted utilization decisions. Plans without documentation infrastructure face enforcement risk. Vendors selling utilization management AI need to build audit-ready output into their products.",
      roleImpact:
        "Compliance officers now have a hard deadline for audit documentation. IT teams need to build or procure audit trail infrastructure. Legal teams need to understand the human review pathway requirements.",
      myTake:
        "CMS picked the right target. Algorithmic denials without documentation have been the #1 source of patient harm complaints for three years. This rule forces transparency. The companies that built audit trails already are going to be fine. The ones that didn't are looking at a very expensive Q3.",
      hook: "CMS just made AI bias audits mandatory for Medicare Advantage. 85% of MA plans use algorithmic utilization management. The audit deadline is Q1 next year. Is your documentation ready?",
      contentAngle:
        "The compliance checklist post. 'CMS AI audit rule: here's exactly what you need to document.' Three deliverables every MA plan compliance team needs before Q1.",
      salesIntel:
        "Hot buyer right now: VP Compliance, Chief Medical Officer, and IT directors at Medicare Advantage plans. They are in active procurement mode for audit trail tooling. Lead with: 'Have you mapped which of your utilization management decisions are AI-assisted under the new CMS definition?'",
      explainer:
        "A bias audit for AI means testing whether the AI's decisions differ systematically by race, gender, geography, or disability status in ways that aren't clinically justified. If an AI denies care requests from Black patients at a higher rate than white patients with identical diagnoses, that's a bias finding. CMS is now requiring MA plans to find and document these patterns annually.",
      executiveBrief:
        "CMS AI bias audit rule creates Q1 compliance deadline for all MA plans using algorithmic utilization management. The risk: plans without audit trail documentation face enforcement action and potential civil liability. Immediate action required: audit all AI-assisted denial workflows, build documentation infrastructure, and establish human review pathways for all algorithmic denials.",
    },
  ],
};

// ─── Banking & Financial Services ──────────────────────────────────────────────

const BANKING_FINANCE: BriefingRecord = {
  id: "mock-banking-001",
  date: TODAY,
  personaKey: "banking-finance",
  articlesFetched: 151,
  generatedAt: new Date().toISOString(),
  sections: {
    summary: [
      "Basel Committee releases AI model risk guidance — traditional model validation frameworks don't cover LLM behavior and banks have 12 months to update governance.",
      "JPMorgan's AI equity research pilot outperforms human analysts on 60-day price prediction accuracy for large-cap tech stocks.",
      "DORA compliance failures at six EU banks traced to undocumented AI dependencies in critical payment systems.",
    ],
    quickHits:
      "**Fed publishes AI supervisory expectations** — exam teams now asking specifically about LLM use in underwriting. **Ant Group deploys credit scoring AI to 400M users** — alternative data at scale reshapes credit access globally. **Goldman Sachs open-sources internal AI governance toolkit** — first major bank to publish its model risk framework.",
    contentIdeas:
      "**Post angle 1:** Basel Committee says traditional model validation doesn't cover LLMs. Banks have 12 months. Here's the 4-step gap analysis every Chief Risk Officer needs to run. **Post angle 2:** JPMorgan's AI beat human analysts on 60-day price prediction. Not because it's smarter — because it's faster and doesn't get tired. What this means for the future of research.",
    driveTime:
      "**Drive Time — Signal 1: Basel AI Model Risk Guidance**\n\nGood morning. Let's talk about the Basel Committee and why your model validation team is about to have a very busy year.\n\nThe Basel Committee released AI model risk guidance last week. The core finding: traditional model validation frameworks — the ones every bank built after the 2011 OCC guidance — don't cover how LLMs actually behave.\n\nSpecifically, they can't handle models that change outputs without retraining, hallucinate under novel inputs, and don't have explainable decision trees.\n\nBanks have 12 months to update their model governance frameworks. That's not a lot of time if you've already deployed LLMs in underwriting or customer service.\n\nThe practical move: start with an inventory. Which LLMs are in production? Which decisions do they influence? That list is shorter than you think — and longer than you want to admit.",
    salesIntel:
      "**Buyer signal:** Basel AI guidance creates immediate procurement urgency for model risk and governance tooling. **Conversation opener:** 'I saw the Basel Committee published AI model risk guidance last week — has your model validation team scoped the gap against your current LLM deployments?' **Pain point:** Most banks don't have a complete inventory of which LLMs are in production and what decisions they influence.",
    explainers:
      "**What is model risk management (MRM)?** MRM is the process banks use to make sure their quantitative models — credit scoring, pricing, fraud detection — are accurate, fair, and auditable. The OCC's 2011 guidance created the framework most US banks use today. The Basel Committee guidance says that framework doesn't apply to LLMs, which behave differently: they can change outputs without being retrained, they can't always explain their reasoning, and they fail in novel ways traditional statistical models don't. **Key terms:** Model validation (independent testing of a model before deployment), SR 11-7 (the Fed's model risk guidance), Hallucination (when an LLM produces confident but wrong outputs).",
    strategyBrief:
      "**Strategic signal:** Basel AI guidance is a leading indicator of global supervisory expectations. Banks that build LLM-specific governance frameworks now will be ahead of formal regulatory requirements by 18–24 months. **Risk:** Banks already using LLMs in underwriting, credit scoring, or trading without updated model risk frameworks face examination findings in the next cycle. **Action:** Immediate inventory of all LLM deployments. Map each to its decision influence. Prioritize model risk framework updates for highest-impact use cases.",
  },
  signals: [
    {
      number: 1,
      title: "Basel Committee: traditional model validation frameworks don't cover LLMs",
      classification: "Governance Alert",
      whatHappened:
        "The Basel Committee on Banking Supervision published guidance stating that existing model risk management frameworks — built around statistical models with fixed parameters — are insufficient for LLMs. Banks must update governance to cover non-deterministic outputs, hallucination risks, and the absence of explainable decision trees. 12-month implementation window.",
      whyItMatters:
        "Basel guidance shapes global banking regulation. This is the first international signal that LLM-specific model governance is becoming a regulatory baseline, not a best practice. Banks that don't act will face exam findings.",
      industryImpact:
        "Every bank using LLMs in any regulated decision — underwriting, fraud, customer communications — now has a compliance gap. Model risk teams need to be expanded or reskilled. Validation vendors need LLM-specific methodologies.",
      roleImpact:
        "Chief Risk Officers own the framework update. Model validation teams need to develop LLM testing methodologies. IT and Data teams need to produce a complete LLM inventory for model risk review.",
      myTake:
        "The 12-month window is tight if you've already deployed. But the bigger risk is banks that don't know what they've deployed. Shadow AI adoption in financial services is real — someone in the lending team is running loan applications through ChatGPT right now.",
      hook: "Basel Committee just said traditional model validation doesn't cover LLMs. Banks have 12 months to fix it. The real risk isn't the LLMs you know about — it's the ones in the lending team's browser.",
      contentAngle:
        "The 'shadow AI in banking' post. Frame it as: every bank thinks they know their LLM deployments. The ones getting exam findings are the ones that find out they were wrong.",
      salesIntel:
        "Target: Chief Risk Officers, Heads of Model Risk, CIOs at banks with >$10B assets. They're actively building LLM governance frameworks right now. Conversation opener: 'Have you run an LLM inventory against the Basel model risk guidance yet?'",
      explainer:
        "Traditional bank models — like credit scoring algorithms — have fixed parameters. You can validate them against historical data. LLMs are different: their outputs aren't fully deterministic, they don't have explainable decision paths, and they can fail in ways that statistical models don't. Basel is saying: you need new validation methods for these new model types.",
      executiveBrief:
        "Basel guidance creates a formal governance gap for any LLM in production. The 12-month window is adequate for banks with good AI inventory practices. For banks without LLM governance frameworks, this is a Q2 priority — start with inventory, move to validation methodology, align with your next exam cycle.",
    },
    {
      number: 2,
      title: "JPMorgan AI equity research pilot beats human analysts on 60-day prediction accuracy",
      classification: "Strategic Signal",
      whatHappened:
        "JPMorgan published internal data showing its AI equity research system outperformed human analysts on 60-day price prediction accuracy for large-cap technology stocks by 12 percentage points. The AI processed 4x more data inputs — including satellite imagery, web traffic, and app store rankings — than analysts reviewing the same companies.",
      whyItMatters:
        "This is the first major bank to publish direct performance data comparing AI vs. human analyst accuracy. It validates AI as a research productivity multiplier, not just a drafting assistant.",
      industryImpact:
        "Investment banks face a structural question: how many research analysts does an AI-augmented team need? The answer changes headcount planning and analyst career trajectories. Sell-side differentiation is shifting from analyst relationships to data advantage.",
      roleImpact:
        "Research directors need to redesign analyst workflows around AI draft + human judgment. Compliance needs to review AI-generated research for disclosure requirements. HR and talent teams need to communicate AI-augmentation strategy to analyst cohorts.",
      myTake:
        "The 12-point accuracy advantage comes from data breadth, not intelligence. The AI is reading satellite parking lot data while the analyst is on earnings calls. The question isn't whether AI replaces analysts — it's whether analysts who use AI replace those who don't.",
      hook: "JPMorgan's AI beat human analysts by 12 points on 60-day price prediction. Not because it's smarter. Because it reads parking lot satellite data while you're on the earnings call.",
      contentAngle:
        "The 'AI augments, doesn't replace' post — but done honestly. The 12-point accuracy gap is real. The question is whether analysts adapt. Frame it as the before/after of a research workflow.",
      salesIntel:
        "Target: Research heads at asset managers, sell-side research directors, quant teams. The signal: AI-augmented research is now a competitive baseline. Ask: 'What data sources is your research team currently processing that your AI tools aren't?'",
      explainer:
        "Equity research analysts build models to predict whether a stock's price will go up or down. They analyze financial statements, talk to company management, and track industry trends. JPMorgan's AI does the same job but adds non-traditional data: parking lot satellite imagery (tracking store traffic), app download rankings, and web traffic patterns — data that's hard for humans to process at scale.",
      executiveBrief:
        "JPMorgan's published accuracy data sets a new benchmark for AI-augmented research. The strategic implication: banks and asset managers that don't build AI research capabilities will face a structural quality disadvantage against those that do. The talent implication: analysts who master AI tools are the differentiated hire. Those who don't adapt face displacement.",
    },
    {
      number: 3,
      title: "DORA compliance failures at six EU banks traced to undocumented AI dependencies",
      classification: "Governance Alert",
      whatHappened:
        "The European Banking Authority identified DORA compliance failures at six EU banks during initial audits. Common thread: undocumented AI dependencies in critical payment processing and risk management systems. The AI components weren't mapped as third-party ICT dependencies under DORA's digital operational resilience requirements.",
      whyItMatters:
        "DORA requires EU financial institutions to map and manage all ICT dependencies, including AI/ML models. Banks that deployed AI before DORA took effect often don't have the dependency documentation DORA requires.",
      industryImpact:
        "Any EU bank using AI in systems classified as critical — payments, settlement, trading, core banking — needs a DORA dependency audit for AI components. Non-EU banks with EU operations face the same requirement through equivalence provisions.",
      roleImpact:
        "IT and Operations teams need to run AI dependency mapping exercises. Compliance teams need to update their DORA documentation to cover AI components. Procurement teams need to ensure AI vendors can provide the DORA-required contractual provisions.",
      myTake:
        "DORA didn't create a new problem — it revealed an existing one. Banks deployed AI quickly during the post-COVID digital acceleration and didn't document it the same way they documented traditional software vendors. The audit findings are the bill coming due.",
      hook: "Six EU banks failed DORA audits for the same reason: they deployed AI in critical systems and didn't document it as an ICT dependency. DORA didn't create this problem — it just made it visible.",
      contentAngle:
        "The 'shadow IT but for AI' post. Frame it as: every bank thinks they know their AI dependencies. The DORA auditors found six that didn't. Here's the 3-step dependency mapping exercise every compliance team needs to run.",
      salesIntel:
        "Target: DORA compliance leads, CIOs, and IT risk teams at EU-regulated banks. Very hot right now. Lead with: 'Have you completed your AI dependency mapping under DORA? The EBA audit findings suggest most banks haven't.'",
      explainer:
        "DORA (Digital Operational Resilience Act) is the EU law requiring banks to map and test every technology system they depend on — including third-party software and AI models. If your payment system uses an AI fraud detector, that AI is an ICT dependency under DORA. Banks must document it, test its resilience, and have a contract with the vendor that meets DORA's requirements.",
      executiveBrief:
        "DORA audit findings create immediate remediation urgency for EU-regulated institutions. The six bank findings are public — regulators will now look more specifically for undocumented AI dependencies. Recommended action: full AI dependency mapping exercise mapped to DORA's ICT categories, vendor contract review for DORA provisions, and documentation update before next audit cycle.",
    },
  ],
};

// ─── Technology / SaaS ─────────────────────────────────────────────────────────

const TECHNOLOGY_SAAS: BriefingRecord = {
  id: "mock-tech-001",
  date: TODAY,
  personaKey: "technology-saas",
  articlesFetched: 167,
  generatedAt: new Date().toISOString(),
  sections: {
    summary: [
      "Anthropic launches Claude Cowork — persistent context across Claude Code sessions eliminates the 'cold start' problem for long-running engineering tasks.",
      "OpenAI merges ChatGPT and Codex into a unified agentic workspace; Claude Code vs Codex is now the defining developer AI battle.",
      "GitHub Copilot Workspace hits 500K enterprise seats in 90 days — agentic coding is a procurement line item, not a pilot.",
    ],
    quickHits:
      "**Claude Code FinOps benchmark** — Claude Code vs Goose, Codex, Cursor: cost per working PR varies 3x across tools. **IBM + Berkeley MAST framework** — agent failure taxonomy for multi-agent systems entering production. **Mistral Codestral 2501** — closes the HumanEval gap with GPT-4o on coding benchmarks.",
    contentIdeas:
      "**Post angle 1:** Anthropic just solved the cold start problem for AI coding sessions. Cowork means your AI remembers the codebase between sessions. Here's what that changes about how you architect your Claude Code workflow. **Post angle 2:** Claude Code vs Codex is the developer AI fight of 2026. One lives in your terminal, one lives in your browser. Here's the real comparison no one's done yet.",
    driveTime:
      "**Drive Time — Signal 1: Anthropic Cowork**\n\nGood morning. Let's talk about the cold start problem in AI coding — and why Anthropic just made it someone else's problem.\n\nEvery Claude Code user knows the friction: start a new session, re-explain the codebase, re-establish context, then finally get to work. Anthropic Cowork eliminates that. Persistent context means your AI remembers where you left off.\n\nThis is a bigger deal than it sounds. The 'context window tax' — the time spent re-onboarding your AI — was estimated at 20–30% of developer AI sessions. That's gone.\n\nFor teams: this changes how you think about AI-assisted code review. One persistent session can track a feature from ticket to merged PR without losing context at each handoff.\n\nFor solo developers: your AI coding partner now has working memory. Treat it like a junior engineer who actually remembers what you told them.",
    salesIntel:
      "**Buyer signal:** 500K Copilot Workspace seats signals that enterprise AI coding tools are in active procurement, not evaluation mode. **Conversation opener:** 'Your engineering team is probably already evaluating AI coding tools — are they comparing on cost per working PR or just on feature demos?' **Pain point:** Most enterprise engineering teams don't have a cost-per-outcome metric for AI coding tools — they're buying on vibes.",
    explainers:
      "**What is an agentic coding tool?** Traditional AI coding tools suggest the next line of code. Agentic tools take a task — 'fix this bug,' 'add this feature' — and execute it end-to-end: read the codebase, write the code, run the tests, propose the PR. The engineer reviews and approves. Like having a junior developer who can code anything but needs a senior to check the work. **Key tools:** Claude Code (Anthropic, terminal-based), GitHub Copilot Workspace (GitHub, browser-based), Codex (OpenAI, API-first), Cursor (IDE plugin).",
    strategyBrief:
      "**Strategic signal:** Agentic coding tools are crossing the chasm from early adopter to mainstream enterprise. 500K Copilot seats in 90 days is Slack-level PMF validation. **Risk:** Engineering teams without a toolchain strategy are 6–12 months behind competitors on velocity. **Opportunity:** First-movers on AI coding infrastructure have a structural productivity advantage that compounds. **Action:** Decide your primary agentic coding tool this quarter. Run a FinOps benchmark (cost per working PR) before committing budget.",
  },
  signals: [
    {
      number: 1,
      title: "Anthropic Cowork: persistent context across Claude Code sessions",
      classification: "Strategic Signal",
      whatHappened:
        "Anthropic launched Claude Cowork, a feature that maintains persistent context across Claude Code sessions. Engineers no longer need to re-explain codebase structure, conventions, and task context at the start of each session — the AI retains working memory of the project.",
      whyItMatters:
        "The 'cold start tax' — time spent re-onboarding your AI at the start of each session — was estimated at 20–30% of total AI coding session time. Eliminating it directly increases effective developer throughput.",
      industryImpact:
        "SaaS teams using Claude Code gain a compounding velocity advantage. Teams on competitors without persistent context now have a productivity gap to close. Context persistence changes how you architect long-running AI-assisted features — one session can carry a full sprint.",
      roleImpact:
        "Engineering leads need to update their Claude Code team workflows to leverage persistent context. Individual developers should redesign their 'start of session' habits. CTOs need to understand this as a tool differentiation factor in vendor evaluation.",
      myTake:
        "Persistent context is the feature that turns AI coding from 'useful assistant' to 'actual team member.' The AI that remembers your codebase isn't a tool — it's a collaborator. That's a different relationship.",
      hook: "Anthropic just gave Claude Code a memory. Your AI coding assistant now remembers the codebase between sessions. The cold start tax is over.",
      contentAngle:
        "Post: 'I spent a week with Claude Cowork. Here's what actually changed.' Be specific: show before/after session setup time, how it handles cross-session task continuity, what it still can't do.",
      salesIntel:
        "Target: Engineering leads and DevTools buyers at SaaS companies with >20 engineers. The signal: teams that have felt the cold start pain are the fastest to convert. Lead with: 'How much time does your team spend re-orienting your AI tool at the start of each session?'",
      explainer:
        "Every AI coding session today starts from scratch — the AI doesn't remember your codebase, your conventions, or what you were working on yesterday. Cowork changes that by maintaining a persistent memory of the project context between sessions. It's the difference between a contractor who needs a full briefing every morning and one who was there yesterday.",
      executiveBrief:
        "Persistent AI context is a developer productivity multiplier that compounds over time. Teams using Cowork accumulate AI context capital — the AI gets more useful as it learns the codebase. Teams without persistent context are on a treadmill, re-investing the same onboarding time every session. Evaluate in Q2.",
    },
    {
      number: 2,
      title: "OpenAI merges ChatGPT and Codex into unified agentic workspace",
      classification: "Strategic Signal",
      whatHappened:
        "OpenAI announced the merger of ChatGPT and Codex into a unified agentic workspace where users can switch between conversational AI and code execution within the same session. Codex's code interpreter now runs inside ChatGPT's conversational UI with full file access and terminal execution.",
      whyItMatters:
        "The ChatGPT + Codex merger makes OpenAI's developer tools directly competitive with Anthropic's Claude Code in the browser-based workflow. This is the opening move in the 2026 developer AI platform war.",
      industryImpact:
        "SaaS developers now have two credible agentic coding platforms: terminal-based (Claude Code) and browser-based (Codex/ChatGPT). Enterprise procurement teams face a genuine strategic choice, not just feature comparison. Developer tool budgets are consolidating around one primary platform.",
      roleImpact:
        "CTOs need to make a platform decision. Developer advocates need to update their tool stack messaging. Product teams building developer tools need to understand which platform their target users are on.",
      myTake:
        "OpenAI's move is defensive, not offensive. Anthropic was winning the terminal developer segment with Claude Code. The ChatGPT merger is OpenAI trying to retain developers who were already moving their workflow to Claude. The battle is for primary tool, not secondary.",
      hook: "OpenAI just merged ChatGPT and Codex. One workspace: chat, code, execute. This is the move that makes 2026 the year you pick your primary AI coding platform.",
      contentAngle:
        "The comparison post: Claude Code (terminal) vs. Codex/ChatGPT (browser). Not on features — on workflow philosophy. Which one fits how you actually work?",
      salesIntel:
        "Target: DevRel teams, developer-focused SaaS companies, engineering tools buyers. The consolidation signal: companies are picking one primary AI coding platform. Lead with: 'Is your team on terminal-first (Claude Code) or browser-first (Codex) workflow — and have you done the FinOps comparison?'",
      explainer:
        "Codex was OpenAI's code-specific AI model. ChatGPT is their conversational AI. They used to be separate products. The merger puts them in one workspace — you can chat about your code, execute it, and switch between modes without leaving the browser. Think of it as a coding environment that's also a chat interface.",
      executiveBrief:
        "The ChatGPT/Codex merger consolidates OpenAI's developer product into a single platform competitive with Claude Code. Engineering orgs should now make a deliberate platform choice rather than running parallel tools — the productivity gain from depth on one platform outweighs the optionality of running both. Run a FinOps benchmark first.",
    },
    {
      number: 3,
      title: "GitHub Copilot Workspace: 500K enterprise seats in 90 days",
      classification: "Strategic Signal",
      whatHappened:
        "GitHub reported that Copilot Workspace — its agentic coding environment that takes a GitHub Issue and proposes, implements, and tests a fix end-to-end — reached 500,000 enterprise seats in its first 90 days of general availability.",
      whyItMatters:
        "500K seats in 90 days is Slack-level product-market fit validation. Agentic coding is no longer an experiment in the enterprise — it's a procurement line item.",
      industryImpact:
        "The SDLC is being restructured around human review of AI-generated code, not human generation of code. Teams that haven't adapted their review processes are already behind. Competitors who standardized on agentic coding in H1 will ship features faster in H2.",
      roleImpact:
        "Engineering managers need to redesign sprint planning around AI-generated PRs. Senior engineers need to become expert reviewers of AI code, not just writers of it. Junior engineers face a fundamentally different career path — learn to direct and review AI, not write boilerplate.",
      myTake:
        "The career conversation nobody is having: what is the junior engineer role when AI writes the code? It shifts from 'write features' to 'own the context the AI needs to write good features.' The best junior engineers will be excellent at documentation, ticket quality, and AI direction.",
      hook: "500K enterprise seats in 90 days. Agentic coding is a procurement line item, not a pilot. The SDLC is being restructured around reviewing AI code, not writing it.",
      contentAngle:
        "The future-of-engineering-careers post, done honestly. Not doom, not hype. The shift from writer to reviewer and director. What skills compound in this new world.",
      salesIntel:
        "Target: Engineering tools vendors, dev training companies, code review tooling. The signal: 500K seats means AI code review workflows are being built right now. Lead with: 'What's your team's review process for AI-generated PRs — do you have different criteria than for human-written code?'",
      explainer:
        "Agentic coding means the AI doesn't just suggest the next line — it reads the whole issue, proposes a solution, writes the code, and runs the tests. The engineer's job shifts from writing to reviewing. Like having a junior dev who can code anything but needs a senior to check the work. GitHub Copilot Workspace does this inside GitHub's native interface.",
      executiveBrief:
        "Agentic coding is the new engineering baseline. Organizations that standardize on AI-assisted development tools in the next 6 months will have a structural velocity advantage. The risk: teams without clear AI code review processes will merge low-quality AI-generated code and pay the tech debt later. Invest in process alongside tooling.",
    },
  ],
};

// ─── Insurance ─────────────────────────────────────────────────────────────────

const INSURANCE: BriefingRecord = {
  id: "mock-insurance-001",
  date: TODAY,
  personaKey: "insurance",
  articlesFetched: 122,
  generatedAt: new Date().toISOString(),
  sections: {
    summary: [
      "Lloyd's of London launches AI underwriting co-pilot — 40% reduction in quote cycle time for complex commercial risk.",
      "NAIC adopts AI explainability requirements for personal lines underwriting in 32 states; adverse action notices must include model decision factors.",
      "Claims AI false positive rate rises 22% as fraud patterns evolve faster than model retraining cycles.",
    ],
    quickHits:
      "**Swiss Re AI climate risk model** — 15-year property loss projections now update quarterly instead of annually. **Lemonade AI claims processing hits 3-second settlement** — pure play insurtech sets new SLA benchmark. **FIO releases AI use in insurance report** — federal monitoring signal ahead of potential regulation.",
    contentIdeas:
      "**Post angle 1:** Lloyd's just cut commercial underwriting quote time by 40% with AI. The shift isn't automating the underwriter — it's giving them 40% more capacity. Here's what the AI-augmented underwriter looks like. **Post angle 2:** NAIC's explainability requirements are live in 32 states. Adverse action notices must now explain what the model decided and why. Is your claims team ready for that conversation?",
    driveTime:
      "**Drive Time — Signal 1: NAIC AI Explainability**\n\nGood morning. Let's talk about the NAIC explainability requirement and what it means for your underwriting team.\n\nAs of last month, 32 states require that when an AI model contributes to an adverse underwriting or claims decision, the customer must receive a notice explaining which model factors drove the decision.\n\nThis isn't theoretical. A customer denied homeowners coverage or charged a higher premium now has a right to know if it was their credit score, claims history, or a satellite roof inspection that drove it — and which one mattered most.\n\nThe practical challenge: most insurers use models they can't explain in plain language. Gradient boosting models with 200 features don't produce readable adverse action notices.\n\nThe companies building explainable AI infrastructure now are going to be ahead when the remaining 18 states adopt the same requirement.",
    salesIntel:
      "**Buyer signal:** NAIC explainability requirements in 32 states create active procurement for AI governance and explainable AI tooling. **Conversation opener:** 'Have you mapped which of your underwriting models fall under the NAIC adverse action notice requirements?' **Pain point:** Most carriers can't produce consumer-readable explanations of their ML models — that's the gap.",
    explainers:
      "**What is AI explainability in insurance?** When an AI model helps decide whether to insure you, how much to charge, or whether to pay a claim, you have a right to know what factors drove that decision. Explainability means the model can tell you: 'Your premium is higher because of your claims history (40%), your roof age (35%), and your location's wildfire risk (25%).' Without explainability, the model just outputs a number — you can't challenge it or understand it. **Key term:** Adverse action notice — a letter explaining why you were denied coverage or charged more.",
    strategyBrief:
      "**Strategic signal:** NAIC explainability requirements will be in all 50 states within 24 months based on current adoption trajectory. Carriers that build explainable AI infrastructure now avoid a costly retrofit later. **Risk:** Carriers using black-box models for personal lines decisions face regulatory exposure in 32 states today and rising. **Action:** Audit all personal lines AI models for explainability. Prioritize highest-volume decision points. Update adverse action notice workflows.",
  },
  signals: [
    {
      number: 1,
      title: "Lloyd's of London AI underwriting co-pilot cuts quote cycle time 40%",
      classification: "Strategic Signal",
      whatHappened:
        "Lloyd's of London launched an AI underwriting co-pilot across 12 managing agents for complex commercial risk lines. The system pre-analyzes submissions, flags coverage gaps, and drafts initial pricing scenarios. Pilot data shows 40% reduction in quote cycle time for complex commercial risk.",
      whyItMatters:
        "Lloyd's is the benchmark for complex commercial insurance globally. If AI underwriting works for Lloyd's syndicates handling catastrophe and specialty risk, it works everywhere.",
      industryImpact:
        "Commercial lines carriers face competitive pressure to match quote cycle times. 40% faster quoting is a distribution advantage — brokers route business to faster carriers. Underwriters who adapt their workflow gain capacity; those who resist face headcount pressures.",
      roleImpact:
        "Commercial underwriters need to redesign their intake and analysis workflow around the AI co-pilot. Operations teams need to integrate AI outputs into existing systems. Actuaries need to validate AI-generated pricing scenarios.",
      myTake:
        "The 40% number is the headline. The real story is what underwriters do with 40% more capacity. The carriers that win will use it to write more complex risks, not to cut headcount. The ones that cut headcount will lose institutional knowledge they can't get back.",
      hook: "Lloyd's just cut commercial underwriting quote time by 40% with AI. The carriers that use the saved time to write more risk win. The ones that use it to cut headcount lose institutional knowledge they'll spend years trying to recover.",
      contentAngle:
        "The 'capacity multiplier vs. headcount reducer' post. AI in underwriting is a choice. Frame it as what the two options look like 3 years from now.",
      salesIntel:
        "Target: Commercial lines underwriting leaders, Chief Underwriting Officers, InsurTech vendors. Lead with: 'How are you thinking about deploying the capacity your underwriters gain from AI — more business or leaner teams?'",
      explainer:
        "Underwriting is the process of deciding whether to insure something, and at what price. Complex commercial underwriting — ships, oil rigs, movie productions — involves analyzing hundreds of factors. The AI co-pilot pre-reads the submission, flags the key risk factors, and drafts initial scenarios. The underwriter reviews and decides. It's the same work, faster.",
      executiveBrief:
        "Lloyd's AI co-pilot pilot validates AI underwriting for complex commercial risk — the hardest category. Carriers that deploy similar tools gain distribution advantages through faster quoting. The strategic choice: use increased underwriter capacity to grow premium volume rather than reduce headcount. Headcount reductions eliminate the institutional risk judgment that AI can't replicate.",
    },
    {
      number: 2,
      title: "NAIC AI explainability requirements now active in 32 states",
      classification: "Governance Alert",
      whatHappened:
        "The National Association of Insurance Commissioners' Model Bulletin on AI use in insurance has now been adopted by 32 states. Carriers must provide consumers with plain-language explanations of AI model factors in adverse underwriting and claims decisions. Implementation deadline for laggard carriers is end of Q3.",
      whyItMatters:
        "32 states represents the majority of US personal lines premium volume. Carriers without explainable AI in personal lines are now in active regulatory exposure.",
      industryImpact:
        "Personal lines carriers using gradient boosting or neural network models face an explainability infrastructure gap. Carriers on older statistical models are better positioned — logistic regression is naturally explainable. Explainable AI vendors have a clear selling motion.",
      roleImpact:
        "Compliance teams own the adverse action notice update. IT teams need to build or procure model explanation infrastructure. Product teams need to update customer communication workflows. Legal needs to review the consumer disclosure language.",
      myTake:
        "The irony is that the best-performing models are often the least explainable. Carriers that chased accuracy with complex ML are now paying the governance debt. The ones who built interpretable models as a principle are ahead.",
      hook: "NAIC AI explainability is live in 32 states. When your model denies a claim, the customer now has a right to know why — in plain English. Most carriers can't do that yet.",
      contentAngle:
        "The 'you can't explain what you can't govern' post. Frame it as: the pressure to maximize model accuracy created a compliance gap. Here's how to close it without starting over.",
      salesIntel:
        "Active buyer: Personal lines compliance and IT teams at carriers using ML for underwriting. Very hot right now. Lead with: 'Have you assessed your adverse action notice workflow against the NAIC explainability requirements in the 32 states you write business in?'",
      explainer:
        "An adverse action notice is a letter that tells a customer they were denied insurance or charged more — and why. NAIC explainability requirements say that if an AI model contributed to that decision, the notice must explain which model factors drove it. The challenge: most high-accuracy ML models can't naturally produce that explanation. You need additional tooling to make them explainable.",
      executiveBrief:
        "NAIC explainability requirements create an immediate compliance gap for personal lines carriers using non-interpretable ML models. Q3 deadline requires action now. Priority: audit highest-volume adverse action workflows, identify models that can't produce plain-language explanations, and implement explainability tooling for those models before the deadline.",
    },
    {
      number: 3,
      title: "Claims AI false positive rate rises 22% as fraud patterns outpace model updates",
      classification: "Emerging Trend",
      whatHappened:
        "Industry data shows a 22% increase in claims AI false positive rates (legitimate claims flagged as potentially fraudulent) over the past 12 months. Root cause: fraud pattern evolution is outpacing model retraining cycles. Fraudsters have adapted to the known detection patterns while models haven't been updated.",
      whyItMatters:
        "A false positive in claims AI means a legitimate customer gets delayed or denied. That drives complaints, bad faith exposure, and customer attrition. The fraud detection problem has become a customer experience problem.",
      industryImpact:
        "Carriers with annual model retraining cycles are most exposed — fraudsters have 12 months to adapt. Carriers with continuous learning models are less affected. Customer-facing claims teams are handling more escalations from false positives.",
      roleImpact:
        "Claims teams need to update their AI escalation workflows. Data science teams need to accelerate model retraining cadence. Customer service leaders need to address the complaint uptick from false positive delays.",
      myTake:
        "The fraud AI problem is an adversarial AI problem. Every time you publish (via denial patterns) what the model looks for, fraudsters adapt. The solution isn't better models — it's faster retraining cycles and pattern diversity so adaptation takes longer.",
      hook: "Claims fraud AI false positive rate up 22%. Legitimate customers being flagged while fraudsters adapt to the detection patterns. Your fraud model is losing an arms race — and your customers are paying for it.",
      contentAngle:
        "The 'adversarial AI in insurance' post. Fraud detection is an arms race — the model and the fraudster are both learning. Frame it as why continuous learning beats annual retraining.",
      salesIntel:
        "Target: Claims technology leaders, fraud analytics teams, insurtech vendors. Lead with: 'Has your claims team seen an uptick in escalations from AI false positives over the last 6 months?' Most have but haven't connected it to model staleness.",
      explainer:
        "A false positive in fraud detection means the AI thinks something is fraud when it isn't. A customer with a legitimate $8,000 water damage claim gets flagged and delayed because their claim pattern looks like a fraud ring's pattern from 18 months ago. The fraudsters changed their patterns. The model didn't update in time. The honest customer waits.",
      executiveBrief:
        "22% false positive increase signals that annual model retraining is insufficient in the current fraud environment. The strategic response: move to continuous or quarterly retraining cycles, implement fraud pattern diversity in detection (adversarial robustness), and add human escalation SLA targets to prevent false positives from becoming bad-faith claims.",
    },
  ],
};

// ─── Education ─────────────────────────────────────────────────────────────────

const EDUCATION: BriefingRecord = {
  id: "mock-education-001",
  date: TODAY,
  personaKey: "education",
  articlesFetched: 119,
  generatedAt: new Date().toISOString(),
  sections: {
    summary: [
      "Arizona State University AI tutoring system reaches 100,000 active students — course completion rates up 18% in AI-supported sections.",
      "Department of Education AI framework requires algorithmic transparency for all Ed-Tech tools in Title I schools by 2027.",
      "ChatGPT detected in 31% of university submissions — AI detection tools have 23% false positive rate, creating academic integrity crisis.",
    ],
    quickHits:
      "**Khan Academy Khanmigo hits 2M learners** — personalized AI tutoring at scale with measurable outcomes. **MIT releases AI literacy curriculum** — free, open-source, 12-week course for K-12 teachers. **EU AI Act exemption for educational AI** — light-touch regulation for non-grading tools.",
    contentIdeas:
      "**Post angle 1:** 100,000 students, 18% better completion. Arizona State's AI tutor data is the strongest evidence yet that personalized AI works in higher ed. Here's what the research actually shows. **Post angle 2:** AI detection tools have a 23% false positive rate. That means nearly 1 in 4 students accused of AI use by automated tools wrote their work themselves. This is an academic integrity crisis — but not the one we think.",
    driveTime:
      "**Drive Time — Signal 1: ASU AI Tutoring**\n\nGood morning. Let's talk about the most important education data released this month.\n\nArizona State University just published outcomes from its AI tutoring pilot: 100,000 students, 18% improvement in course completion rates in AI-supported sections. That's not a pilot — that's a product.\n\nThe mechanism isn't magic: the AI tutor identifies when a student is stuck, offers a different explanation, and adjusts pacing. It doesn't replace the professor — it extends office hours to 24/7.\n\nHere's the signal for ed-tech: the schools that get this right will compound their outcomes advantage. Students who complete courses stay enrolled. Students who stay enrolled graduate. Completion rates are the entire retention business case.\n\nThe challenge: most LMS platforms aren't built to integrate AI tutoring at this scale. The infrastructure gap is the next problem.",
    salesIntel:
      "**Buyer signal:** AI tutoring at scale creates procurement urgency for LMS integration, data infrastructure, and student success platforms. **Conversation opener:** 'Has your institution run an AI tutoring pilot? ASU just published 18% completion improvement at 100K scale — are you tracking against comparable benchmarks?' **Pain point:** Most institutions don't have the data infrastructure to measure AI tutoring outcomes at scale.",
    explainers:
      "**What is AI tutoring?** An AI tutor is a system that helps a student learn a concept by answering questions, offering different explanations, and adapting to the student's pace — available 24/7. Unlike a static textbook, it can tell when you're stuck and try a different approach. Unlike a human tutor, it's available at 2am before the exam. **Key distinction:** AI tutoring assists learning; it doesn't grade or make admissions decisions — so it falls under lighter regulation than AI used in high-stakes education decisions.",
    strategyBrief:
      "**Strategic signal:** AI tutoring outcomes data is now strong enough to inform institutional strategy. 18% completion improvement at scale is a retention business case. **Risk:** Institutions that deploy AI tutoring without data infrastructure can't measure outcomes, can't improve, and can't demonstrate ROI. **Action:** Before deploying AI tutoring, build outcome tracking. Align with student success teams on the metrics that matter: completion, grade distribution, time-to-help for at-risk students.",
  },
  signals: [
    {
      number: 1,
      title: "Arizona State University AI tutor: 100K students, 18% completion improvement",
      classification: "Strategic Signal",
      whatHappened:
        "Arizona State University published outcomes from its AI tutoring deployment across introductory STEM courses: 100,000 active students, 18% improvement in course completion rates in AI-supported sections vs. control, and a 34% reduction in students seeking emergency academic support.",
      whyItMatters:
        "This is the largest published dataset on AI tutoring outcomes in higher education. 18% completion improvement at 100K scale is a retention business case, not an experiment.",
      industryImpact:
        "Universities running retention programs face a data-driven comparison benchmark. Ed-tech vendors need to match or exceed ASU's outcome metrics. LMS platforms need AI tutoring integration capabilities. Faculty need professional development for AI-augmented pedagogy.",
      roleImpact:
        "Provosts and Deans of Students can build a retention ROI case for AI tutoring investment. Ed-tech procurement teams have a comparison benchmark. Faculty development teams need to update training for AI-integrated courses.",
      myTake:
        "The 34% drop in emergency academic support is the number I'd focus on. Students who find help before they're in crisis don't drop out. AI tutoring available at 2am before the exam is office hours democratized.",
      hook: "100,000 students. 18% better completion. Arizona State's AI tutor data just became the benchmark every ed-tech vendor will be compared against.",
      contentAngle:
        "The '24/7 office hours' post. Frame AI tutoring not as replacing professors but as extending their reach. The professor's insight, available at 2am when the student needs it.",
      salesIntel:
        "Target: VP Student Success, Provosts, Ed-tech procurement at universities with >5,000 enrollment. Lead with: 'How does your current completion rate compare to the ASU AI tutoring benchmark? They published 18% improvement at 100K scale.'",
      explainer:
        "Course completion means finishing a class instead of dropping it. Students who drop courses fall behind on graduation tracks, often don't come back. AI tutoring helps by catching students when they're stuck — before they decide to drop. The AI identifies patterns of struggle early (not turning in assignments, failing quizzes) and offers help. 18% better completion means 18 more students per 100 finish the course.",
      executiveBrief:
        "ASU's published outcomes make AI tutoring a provable retention investment for higher education. The business case: every student who completes rather than drops represents tuition revenue retained. At scale, 18% completion improvement is a material financial impact. Recommend piloting in highest-attrition intro courses first.",
    },
    {
      number: 2,
      title: "AI detection tools: 23% false positive rate creates academic integrity crisis",
      classification: "Governance Alert",
      whatHappened:
        "New research from Stanford and three other universities measured AI detection tool accuracy across 10,000 student essays. Finding: 23% false positive rate — nearly 1 in 4 essays flagged as AI-generated were written entirely by humans. International students writing in non-native English were flagged at 2.4x the rate of native English speakers.",
      whyItMatters:
        "Institutions using AI detection as a primary academic integrity mechanism are making disciplinary decisions on evidence that's wrong nearly 1 in 4 times. And the error is not random — it systematically disadvantages non-native English speakers.",
      industryImpact:
        "Academic integrity policies built around AI detection tool outputs need immediate review. Institutions that have taken disciplinary action based solely on AI detection results face appeals and potential legal exposure. The equity dimension (non-native speaker bias) is a DEI and accreditation risk.",
      roleImpact:
        "Academic integrity officers need to update their evidence standards. Faculty need new assessment design guidance. General counsel needs to review disciplinary processes. DEI offices need to address the disparate impact data.",
      myTake:
        "AI detection tools were never designed to be disciplinary evidence. They're probabilistic signals. Using them as proof of academic dishonesty was always methodologically wrong — we just didn't have the false positive data until now. The crisis isn't AI in education. It's institutions using bad evidence.",
      hook: "AI detection tools flag 1 in 4 human-written essays as AI-generated. International students are flagged at 2.4x the rate. Your academic integrity process might be punishing honest students.",
      contentAngle:
        "The 'detection isn't proof' post. What the false positive data means for academic integrity policy. And what assessment design that doesn't rely on detection looks like.",
      salesIntel:
        "Target: Academic integrity officers, Deans of Students, General Counsel at universities. The signal: they're aware of detection tool limitations but need a policy alternative. Lead with: 'Has your academic integrity team reviewed the Stanford false positive data? It has equity and legal implications for your current process.'",
      explainer:
        "AI detection tools try to tell if writing was produced by an AI or a human by looking for patterns associated with AI text — like very consistent sentence structure or low statistical 'perplexity.' The problem: non-native English speakers often write with similar patterns because they're following grammar rules carefully. A false positive means the tool says 'AI wrote this' when a human did.",
      executiveBrief:
        "23% false positive rate and 2.4x disparate impact on non-native English speakers creates legal, equity, and accreditation exposure for institutions using AI detection as disciplinary evidence. Immediate action: suspend AI detection as primary disciplinary evidence pending policy review. Shift to assessment design strategies that are AI-resistant rather than relying on post-hoc detection.",
    },
    {
      number: 3,
      title: "Department of Education AI framework: algorithmic transparency required in Title I schools by 2027",
      classification: "Governance Alert",
      whatHappened:
        "The Department of Education published an AI in Education framework requiring all Ed-Tech tools using AI in student assessment, course recommendation, or disciplinary decisions in Title I schools to provide algorithmic transparency documentation by 2027. The framework defines minimum standards for data privacy, bias testing, and decision explanation.",
      whyItMatters:
        "Title I schools serve the most economically disadvantaged students. AI tools deployed without bias testing in these schools have historically shown disparate impact on minority students. Federal documentation requirements create an accountability mechanism.",
      industryImpact:
        "Ed-tech vendors selling to Title I schools need to build transparency documentation infrastructure. Districts need to audit current Ed-tech contracts for compliance. Vendors that can't provide transparency documentation will lose Title I school access.",
      roleImpact:
        "District technology directors need to map all AI-using Ed-tech tools and assess against framework requirements. Procurement teams need to update vendor evaluation criteria. Compliance teams need to build documentation workflows.",
      myTake:
        "Title I requirements tend to become de facto standards across all of public education within 3–5 years. The vendors that build to the Title I standard now won't need to retrofit when the broader requirement comes. The ones waiting for broader adoption are building technical debt.",
      hook: "DOE requires algorithmic transparency for all AI Ed-tech tools in Title I schools by 2027. Title I standards become public education standards. Every Ed-tech vendor is building against this clock.",
      contentAngle:
        "The 'Title I sets the standard' post. Why Ed-tech vendors should build to the DOE framework even if they're not primarily serving Title I schools.",
      salesIntel:
        "Target: Ed-tech vendors, District CTO/CTOs, Title I compliance officers. Lead with: 'Have you mapped your Ed-tech stack against the DOE algorithmic transparency framework? Title I deadlines are 2027, but procurement cycles mean you need vendor documentation now.'",
      explainer:
        "Title I schools receive federal funding to serve students from low-income families. The DOE's AI framework says: if you use AI to assess students, recommend courses, or make disciplinary decisions in these schools, you must document how the AI works, what data it uses, and whether it treats different student groups fairly. This is 'show your work' for Ed-tech AI.",
      executiveBrief:
        "DOE Title I AI transparency requirements set a federal baseline that will likely expand across public education. Ed-tech vendors without transparency documentation lose access to the Title I market in 2027. Districts need AI tool audits now — procurement cycles mean decisions made today will govern 2027 compliance. Recommend building Title I framework compliance into all Ed-tech vendor evaluations starting Q3.",
    },
  ],
};

// ─── Real Estate & Property ─────────────────────────────────────────────────────

const REAL_ESTATE: BriefingRecord = {
  id: "mock-realestate-001",
  date: TODAY,
  personaKey: "real-estate",
  articlesFetched: 108,
  generatedAt: new Date().toISOString(),
  sections: {
    summary: [
      "CoStar deploys AI market intelligence for commercial brokers — natural language queries replace complex database searches, adoption up 340% in 60 days.",
      "Fannie Mae approves AI-assisted appraisals for properties under $1M — traditional appraisal bottleneck eliminated for majority of residential transactions.",
      "NYC passes AI tenant screening law requiring bias audits and transparency for all algorithmic rental decisions.",
    ],
    quickHits:
      "**Zillow AI value estimate accuracy improves to 1.9% median error** — narrowing gap with human appraisers. **CBRE launches AI lease abstraction** — 90% time reduction in lease review for institutional portfolios. **Opendoor AI pricing model** — instant offer accuracy within 2.1% of final sale price.",
    contentIdeas:
      "**Post angle 1:** Fannie Mae just approved AI appraisals for properties under $1M. The 2-week appraisal bottleneck that kills real estate deals is over for most residential transactions. Here's what this means for your clients. **Post angle 2:** CoStar's AI saw 340% adoption in 60 days. Commercial brokers who ask natural language questions are replacing the ones who know how to run database queries. The query skill isn't the moat anymore.",
    driveTime:
      "**Drive Time — Signal 1: Fannie Mae AI Appraisals**\n\nGood morning. The bottleneck that kills 15% of residential real estate deals just got removed.\n\nFannie Mae approved AI-assisted appraisals for properties under $1M last week. That's 78% of all residential transactions by volume. Traditional appraisals take 2–3 weeks and cost $400–$800. The AI equivalent is 48 hours and significantly cheaper.\n\nFor buyers: fewer deals falling through or facing price renegotiation because the appraisal came in late or low.\n\nFor agents: faster closings, less deal uncertainty.\n\nFor appraisers: the straightforward single-family residential work is now AI territory. The complex, unique, or high-value property work remains human.",
    salesIntel:
      "**Buyer signal:** Fannie Mae AI appraisal approval creates procurement urgency for PropTech vendors building appraisal workflow tools. **Conversation opener:** 'With Fannie Mae approving AI appraisals for under-$1M properties, how are you advising clients on the new closing timeline expectations?' **Pain point:** Most real estate agents haven't updated their client communication to reflect the new 48-hour AI appraisal option.",
    explainers:
      "**What is an AI appraisal?** A property appraisal estimates what a home is worth for lending purposes. Traditionally, a human appraiser visits the property, compares it to recent sales, and writes a report. AI appraisals use computer vision (satellite and street view imagery), recent comparable sales data, and property records to estimate value without a site visit. Fannie Mae's approval means mortgage lenders can use AI appraisals for conforming loans under $1M.",
    strategyBrief:
      "**Strategic signal:** Fannie Mae AI appraisal approval removes the primary timeline bottleneck in residential real estate. This changes competitive dynamics — agents who offer AI appraisal-enabled faster closings gain a client acquisition advantage. **Risk:** AI appraisals may have accuracy gaps for unique properties, renovation quality, or rapidly appreciating markets. **Action:** Understand which transactions qualify for AI appraisals, educate clients proactively, and update marketing to highlight faster closing timelines.",
  },
  signals: [
    {
      number: 1,
      title: "Fannie Mae approves AI appraisals for properties under $1M",
      classification: "Strategic Signal",
      whatHappened:
        "Fannie Mae approved AI-assisted property appraisals (using computer vision, comparable sales data, and property records) for conforming residential loans under $1M. Traditional site-visit appraisals take 2–3 weeks; AI appraisals complete in 24–48 hours. Approved lenders can now use AI appraisal data for underwriting.",
      whyItMatters:
        "Appraisal delays are among the top three causes of real estate deal failures. Eliminating a 2-week bottleneck for 78% of transactions by volume fundamentally changes residential real estate transaction velocity.",
      industryImpact:
        "Real estate agents can promise faster closings as a competitive differentiator. Mortgage lenders gain efficiency in the underwriting pipeline. Traditional appraisers face volume loss in the under-$1M segment — the growth market is now complex, high-value, and unique properties.",
      roleImpact:
        "Agents need to update their buyer and seller communications to reflect AI appraisal availability. Lenders need to implement AI appraisal workflows. Appraisers need to specialize in the segments AI can't handle.",
      myTake:
        "This is the first major AI approval that removes a structural bottleneck in residential real estate, not just adds efficiency. The deals that fall through because the appraisal timeline blew the rate lock — that goes away. Watch for this to change buyer negotiation leverage when appraisals come in fast.",
      hook: "Fannie Mae just approved AI appraisals for properties under $1M. The 2-3 week bottleneck that kills residential deals is over for 78% of transactions. Your closing timeline just changed.",
      contentAngle:
        "The 'your closing timeline just changed' post for real estate agents. How to position faster closings as a competitive differentiator, and what AI appraisals mean for buyer negotiation strategy.",
      salesIntel:
        "Target: Mortgage lenders, title companies, real estate agent teams. Lead with: 'How are you updating your closing timeline commitments now that Fannie Mae has approved AI appraisals for under-$1M properties?'",
      explainer:
        "Property appraisals exist so mortgage lenders know what a home is actually worth before they lend against it. An AI appraisal does the same thing using data — satellite imagery, comparable sales, property records — instead of a human site visit. Fannie Mae's approval means mortgage-backed securities can include loans with AI-appraised values.",
      executiveBrief:
        "Fannie Mae's AI appraisal approval creates a competitive window for real estate firms and lenders that move quickly. Faster closings are a measurable buyer benefit. The strategic implication: agents and lenders who build AI appraisal into their standard workflow first will attract buyers frustrated with slow competitors. Move in Q2.",
    },
    {
      number: 2,
      title: "CoStar AI market intelligence: 340% adoption increase in 60 days",
      classification: "Emerging Trend",
      whatHappened:
        "CoStar deployed a natural language AI interface for its commercial real estate database. Brokers can now query CoStar with conversational questions ('What Class A office buildings in Austin have had leases expire in the last 90 days with tenants over 10,000 sq ft?') instead of building complex database filters. Adoption increased 340% in 60 days.",
      whyItMatters:
        "CoStar database expertise — knowing how to run complex queries — was a meaningful competitive advantage for commercial brokers. Natural language queries democratize that access. The knowledge moat shifts from 'how to query' to 'what questions to ask.'",
      industryImpact:
        "Brokers who built their edge on CoStar query expertise now face a leveled playing field. The differentiator shifts to deal intuition, relationship quality, and strategic question framing. Junior brokers gain access to insights previously available only to experienced database users.",
      roleImpact:
        "Commercial brokers need to shift from database query skills to strategic question formulation. Managers need to redesign training programs that relied on CoStar technical expertise. Business development teams can now prospect more efficiently with AI-generated market intelligence.",
      myTake:
        "340% adoption in 60 days is not organic growth — that's people who were already on CoStar but not using it heavily now using it constantly. The natural language interface unlocked latent demand that the existing UI was blocking.",
      hook: "CoStar's AI market intelligence saw 340% adoption in 60 days. Brokers who know what questions to ask are replacing ones who know how to run database queries. The technical moat is gone.",
      contentAngle:
        "The 'what questions to ask' post for commercial brokers. The query skill is gone. The question quality is the new differentiator. Frame it as a skill evolution, not a threat.",
      salesIntel:
        "Target: Commercial real estate brokerage training programs, PropTech vendors, CRE research teams. Lead with: 'Has your brokerage team updated its training curriculum now that CoStar natural language queries have democratized database expertise?'",
      explainer:
        "CoStar is the primary database commercial real estate brokers use to find properties, track market trends, and identify prospective tenants. Before AI, using it effectively required learning a complex filter system — a real technical skill. With natural language AI, you just ask the question in plain English. The database expertise barrier is gone; the strategic insight barrier remains.",
      executiveBrief:
        "CoStar's NL interface shifts commercial brokerage competitive advantage from technical database access to strategic intelligence and question quality. This is a talent implication: brokers who relied on CoStar technical skill as their differentiation need to rebuild their edge on deal intuition and strategic framing. Management training programs need to update immediately.",
    },
    {
      number: 3,
      title: "New York City passes AI tenant screening law — bias audits and transparency required",
      classification: "Governance Alert",
      whatHappened:
        "New York City enacted Local Law 144 extension to rental housing, requiring landlords and property managers using AI in tenant screening to conduct annual bias audits, publish summary results, and provide applicants with notice of AI use and the right to request human review.",
      whyItMatters:
        "NYC is the largest rental market in the US. This law creates a compliance baseline that will likely expand to other major metros. Any landlord using algorithmic tenant screening tools — even through a property management software platform — is now covered.",
      industryImpact:
        "Property management software platforms need to build bias audit and transparency infrastructure into their tenant screening tools. Landlords using off-the-shelf screening software need to confirm vendor compliance. Fair housing attorneys have a new litigation pathway.",
      roleImpact:
        "Property managers need to assess their screening tools for compliance. Legal teams need to update rental application processes. Fair housing compliance officers need to build audit documentation workflows.",
      myTake:
        "NYC Local Law 144 on hiring AI was a template. This rental extension was predictable. Los Angeles, Chicago, and Seattle will follow within 18 months. Property management companies operating nationally need to build to the NYC standard now.",
      hook: "NYC just extended its AI bias audit law to tenant screening. Every landlord using algorithmic screening tools is covered. LA and Chicago are next. Build to the NYC standard now.",
      contentAngle:
        "The 'what NYC's tenant screening law means for your property management software' post. Practical breakdown of what the bias audit requires and how to assess if your current tools are compliant.",
      salesIntel:
        "Target: Property management software vendors, Fair housing compliance consultants, Large landlords and REIT property managers. Lead with: 'Has your property management team mapped your tenant screening tools against NYC's new AI transparency requirements?'",
      explainer:
        "Many landlords use software that algorithmically screens rental applicants — scoring them on credit, income, rental history, and sometimes more opaque factors. NYC's law says: if you use AI to screen tenants, you must test annually for bias, publish the results, and tell applicants that AI was used. They can request a human review instead.",
      executiveBrief:
        "NYC tenant screening AI law is a leading indicator of national regulation trend. Property management companies with multi-city portfolios should standardize on NYC-compliant screening tools immediately — retrofitting across multiple local regulations simultaneously is more costly. The fair housing litigation risk from non-compliant algorithmic screening is material.",
    },
  ],
};

// ─── Retail & E-commerce ────────────────────────────────────────────────────────

const RETAIL_ECOMMERCE: BriefingRecord = {
  id: "mock-retail-001",
  date: TODAY,
  personaKey: "retail-ecommerce",
  articlesFetched: 134,
  generatedAt: new Date().toISOString(),
  sections: {
    summary: [
      "Amazon AI demand forecasting reduces overstock inventory by 23% — $1.8B in working capital freed in Q1 alone.",
      "Shopify launches AI returns fraud detection — false positive rate 8%, preventing $340M in annual fraud for platform merchants.",
      "FTC opens investigation into AI dynamic pricing coordination — retailers sharing pricing AI vendors face potential antitrust exposure.",
    ],
    quickHits:
      "**Walmart generative AI shopping assistant** — 14% conversion lift in tested categories vs. search-only. **LVMH AI product authentication** — blockchain + computer vision reduces counterfeit returns 67%. **TikTok Shop AI recommendation** — 31% of purchases now AI-driven vs. search-driven.",
    contentIdeas:
      "**Post angle 1:** Amazon freed $1.8B in working capital in one quarter with AI demand forecasting. The number that matters for mid-market retailers: their overstock carrying cost is 25–30% of inventory value annually. AI forecasting payback period is typically 6–9 months. **Post angle 2:** FTC is investigating AI dynamic pricing as potential price coordination. If two retailers use the same AI vendor and prices move in parallel, is that collusion? The legal answer is not yet clear.",
    driveTime:
      "**Drive Time — Signal 1: Amazon Demand Forecasting**\n\nGood morning. Let's talk about the $1.8 billion number Amazon buried in their supply chain report.\n\nAmazon's AI demand forecasting reduced overstock inventory by 23% in Q1. That's $1.8 billion in working capital freed. Not earned — freed. That money was sitting in warehouse shelving units nobody was buying.\n\nFor mid-market retailers: your overstock carrying cost is 25–30% of inventory value per year. If you're carrying $40M in inventory and 20% is overstock, you're paying $2–3M annually to store things you're eventually going to markdown.\n\nAI demand forecasting typically has a 6–9 month payback period at that scale. That's not a technology conversation — that's a CFO conversation.",
    salesIntel:
      "**Buyer signal:** Amazon's $1.8B working capital release is the ROI benchmark every supply chain AI vendor is using in sales cycles. **Conversation opener:** 'Have you modeled what a 20% reduction in overstock would free up in working capital for your business?' **Pain point:** Most mid-market retailers don't know their overstock carrying cost as a percentage of inventory value — that's the first number to calculate together.",
    explainers:
      "**What is AI demand forecasting?** Traditional demand forecasting uses historical sales data and seasonal patterns to predict how much to order. AI forecasting adds external signals: weather, social media trends, competitor pricing, economic indicators, and more. The result: orders that more closely match actual demand, less overstock, and fewer stockouts. **Key metric:** Carrying cost — the cost of holding inventory that hasn't sold yet. Typically 25–30% of inventory value annually when you include storage, insurance, capital cost, and markdown risk.",
    strategyBrief:
      "**Strategic signal:** AI demand forecasting is delivering measurable ROI at Amazon scale — but the technology is now accessible to mid-market retailers through platforms like Shopify, SAP, and Oracle. **Risk:** Retailers waiting for 'perfect data' before implementing AI forecasting are missing quarterly working capital improvements. **Opportunity:** Retailers in categories with high demand volatility (fashion, seasonal goods, electronics) have the highest ROI potential from AI forecasting. **Action:** Model your overstock carrying cost. If it exceeds $500K annually, run an AI forecasting pilot.",
  },
  signals: [
    {
      number: 1,
      title: "Amazon AI demand forecasting frees $1.8B working capital in Q1",
      classification: "Strategic Signal",
      whatHappened:
        "Amazon's Q1 earnings disclosed that AI-powered demand forecasting reduced overstock inventory across its retail operations by 23%, freeing approximately $1.8 billion in working capital. The system integrates weather data, social media signals, competitor pricing, and economic indicators alongside historical sales data.",
      whyItMatters:
        "Amazon's scale makes their supply chain outcomes the benchmark for retail AI ROI. 23% overstock reduction with measurable working capital impact validates AI demand forecasting as a CFO-level investment, not just a supply chain optimization.",
      industryImpact:
        "Mid-market retailers face competitive pressure to match Amazon's inventory efficiency. Supply chain AI vendors now have Amazon's $1.8B as a reference ROI. Retailers in high-volatility categories (fashion, seasonal) have the most to gain from AI forecasting.",
      roleImpact:
        "CFOs need to model AI forecasting ROI against their own overstock carrying costs. Supply chain leaders need to evaluate AI forecasting tools. CMOs need to understand how better inventory position enables more aggressive promotional strategy.",
      myTake:
        "The $1.8B is working capital, not profit — but working capital is free money if you were otherwise paying to store unsellable inventory. Mid-market retailers paying 25–30% carrying cost on $40M in inventory are looking at a $2–3M annual opportunity. That math closes fast.",
      hook: "Amazon freed $1.8B in working capital in one quarter with AI demand forecasting. For mid-market retailers: your overstock carrying cost is 25–30% of inventory value. AI forecasting payback is typically 6–9 months.",
      contentAngle:
        "The 'this is a CFO conversation, not a tech conversation' post. Frame AI demand forecasting in working capital terms, not technology terms. The CFO analogy: it's a line item under 'capital efficiency,' not under 'digital transformation.'",
      salesIntel:
        "Target: CFOs and VP Supply Chain at mid-market retailers ($50M–$500M revenue). Lead with: 'What is your current overstock carrying cost as a percentage of inventory? Amazon's AI forecasting data suggests the payback period is typically 6–9 months at your scale.'",
      explainer:
        "Overstock is inventory you bought but couldn't sell before having to mark it down. Carrying cost is what you pay to store it — warehouse space, insurance, the capital tied up that could be earning interest elsewhere. AI demand forecasting reduces overstock by predicting demand more accurately, so you buy closer to what you'll actually sell.",
      executiveBrief:
        "Amazon's Q1 data validates AI demand forecasting ROI at scale. For mid-market retailers, the payback model is straightforward: calculate current overstock carrying cost, apply 20–25% reduction estimate, divide by AI forecasting implementation cost. Most retailers with >$40M inventory see payback inside 12 months. Prioritize in Q3 budget planning.",
    },
    {
      number: 2,
      title: "Shopify AI returns fraud detection: $340M in annual fraud prevented",
      classification: "Emerging Trend",
      whatHappened:
        "Shopify launched an AI returns fraud detection system that identifies fraudulent return patterns (returning used items as new, claiming non-delivery, switching products) in real time. Platform merchants in the pilot prevented $340M in annual fraud with an 8% false positive rate — flagging legitimate returns as potentially fraudulent.",
      whyItMatters:
        "Returns fraud costs US retailers $100B+ annually. An 8% false positive rate is meaningfully lower than previous detection methods, which often flagged 15–25% of legitimate returns.",
      industryImpact:
        "Shopify merchants gain a fraud prevention capability previously available only to large enterprise retailers. False positive management becomes a new operational consideration — wrongly denied returns create customer experience damage. Returns policy design needs to account for AI detection capabilities.",
      roleImpact:
        "Operations and customer service teams need to build review workflows for AI-flagged returns. Merchandising teams can update returns policies based on AI protection. Finance teams need to model fraud savings against false positive customer service costs.",
      myTake:
        "The 8% false positive rate is the number to watch. At high volume, 8% means thousands of legitimate customers getting their returns flagged. The customer service cost of those escalations can offset the fraud savings. The tool is better than nothing — but returns fraud detection is not 'set and forget.'",
      hook: "Shopify's AI prevented $340M in returns fraud. The catch: 8% false positive rate. At high volume, that's thousands of legitimate customers flagged. Returns fraud detection requires ongoing management — it's not set and forget.",
      contentAngle:
        "The 'false positive math' post. For every $100 in fraud prevented, how much do you spend handling legitimate customer escalations? Frame AI fraud detection as a net margin calculation, not a binary fraud-prevention win.",
      salesIntel:
        "Target: Shopify merchants with >$5M revenue and high-volume return categories (apparel, electronics). Lead with: 'What percentage of your returns do you estimate are fraudulent? Shopify's AI is preventing 8% rate but catching 8% of legitimate returns in the process — is that trade-off worth it for your business?'",
      explainer:
        "Returns fraud is when someone exploits a retailer's return policy — returning a used item as new, claiming a package never arrived (when it did), or switching a cheap item for an expensive one in the return box. AI detection looks for patterns that signal fraud — the same customer returning expensive electronics repeatedly, return patterns that match known fraud schemes — and flags them for manual review.",
      executiveBrief:
        "Shopify's returns fraud detection delivers meaningful fraud prevention with an acceptable false positive rate for most merchants. The operational consideration: budget for customer service workflows to handle flagged legitimate returns. Net ROI is positive for most merchants with >2% fraud rates, but the customer experience management cost is real and should be factored into the business case.",
    },
    {
      number: 3,
      title: "FTC opens AI dynamic pricing investigation for potential antitrust coordination",
      classification: "Governance Alert",
      whatHappened:
        "The Federal Trade Commission opened an investigation into whether retailers using the same AI dynamic pricing vendor are engaging in de facto price coordination — with algorithms from a shared vendor producing parallel price movements that would constitute illegal collusion if done by humans. Six major retailers are under initial inquiry.",
      whyItMatters:
        "This is the first major regulatory challenge to AI pricing tools in retail. If AI-driven parallel pricing is found to violate antitrust law, the entire category of dynamic pricing software faces legal scrutiny.",
      industryImpact:
        "Retailers using AI dynamic pricing need to assess whether their pricing decisions could be interpreted as coordination with competitors using the same tool. The legal uncertainty creates risk for the entire category. Pricing tool vendors need to demonstrate that their outputs are competitively independent.",
      roleImpact:
        "General Counsel and compliance teams need to assess dynamic pricing tool use against antitrust standards. CMOs and pricing teams need to understand the legal exposure. Procurement teams should add antitrust compliance questions to pricing AI vendor evaluations.",
      myTake:
        "The legal theory is elegant and scary: if two competitors use the same AI pricing algorithm and prices move in parallel in response to the same inputs, the economic effect is the same as price-fixing — even if neither talked to the other. The antitrust question is whether intent matters or effect does. The FTC seems to think effect does.",
      hook: "FTC is investigating AI dynamic pricing as potential price coordination. If your pricing AI and your competitor's pricing AI both respond the same way to the same signals, is that collusion? The FTC thinks it might be.",
      contentAngle:
        "The 'algorithmic antitrust' post. Explain the legal theory: AI doesn't need intent to coordinate prices. Frame it as the legal risk every retail pricing team needs to understand before their next AI vendor contract.",
      salesIntel:
        "Target: General Counsel and CMOs at retailers using AI dynamic pricing tools. Lead with: 'Has your legal team reviewed your AI pricing tool against the FTC's new investigation criteria? The 'same vendor, parallel prices' theory affects anyone sharing a pricing AI vendor with competitors.'",
      explainer:
        "Dynamic pricing means your prices change automatically based on demand, competitor prices, inventory levels, and other factors. AI makes this happen in real time. The antitrust concern: if Retailer A and Retailer B both use the same AI pricing tool, and the tool responds to the same market signals in the same way, their prices move together — like they agreed to coordinate. That's the legal question the FTC is investigating.",
      executiveBrief:
        "FTC antitrust investigation into AI dynamic pricing creates legal uncertainty for all retailers using algorithmic pricing tools. The risk is not hypothetical — the investigation covers six major retailers. Immediate action: legal review of current dynamic pricing tool architecture to assess coordination risk, and legal counsel review of vendor contracts for antitrust indemnification provisions.",
    },
  ],
};

// ─── Manufacturing & Supply Chain ──────────────────────────────────────────────

const MANUFACTURING: BriefingRecord = {
  id: "mock-manufacturing-001",
  date: TODAY,
  personaKey: "manufacturing",
  articlesFetched: 127,
  generatedAt: new Date().toISOString(),
  sections: {
    summary: [
      "Siemens AI predictive maintenance deployment: 31% reduction in unplanned downtime across 12 German automotive plants — $220M annual savings.",
      "TSMC deploys AI yield optimization — defect detection accuracy improves to 99.7%, semiconductor production waste down 18%.",
      "Port of Rotterdam reaches 40% autonomous container routing — AI orchestration of 14M annual container movements.",
    ],
    quickHits:
      "**Rockwell Automation AI quality control** — computer vision defect detection replaces manual inspection at 4x throughput. **Boston Dynamics Spot + LLM integration** — factory floor inspection robot can now receive natural language task instructions. **BMW Factory of the Future** — 100% digital twin coverage of production lines, 15% energy reduction.",
    contentIdeas:
      "**Post angle 1:** Siemens saved $220M with predictive maintenance AI. The ROI math: unplanned downtime costs automotive plants $500K–$2M per hour. Catching a failure 48 hours early doesn't just save the repair — it saves the line shutdown. **Post angle 2:** TSMC's 99.7% defect detection accuracy is the benchmark that's going to define AI quality control in precision manufacturing. What it takes to get there — and what 0.3% error rate means at TSMC's scale.",
    driveTime:
      "**Drive Time — Signal 1: Siemens Predictive Maintenance**\n\nGood morning. Let's talk about $220 million — and the math behind it.\n\nSiemens published outcomes from their predictive maintenance AI deployment across 12 automotive plants: 31% reduction in unplanned downtime, $220M in annual savings.\n\nHere's the math: unplanned downtime in automotive manufacturing costs $500K–$2M per hour, depending on the plant and what's running. A single undetected bearing failure can shut down a line for 6–12 hours. Predictive maintenance gives you a 48-hour warning — enough time to schedule maintenance during a planned shutdown window.\n\nFor manufacturing leaders: the ROI isn't the maintenance cost savings. It's the production schedule you didn't lose.",
    salesIntel:
      "**Buyer signal:** Siemens' published $220M savings is the ROI benchmark that industrial AI vendors are using in every sales conversation. **Conversation opener:** 'What is your current unplanned downtime rate, and what does an hour of line shutdown cost? Siemens' published data suggests AI predictive maintenance ROI closes in under 18 months for most automotive-scale plants.' **Pain point:** Most plants track mean time between failures (MTBF) but don't calculate the full revenue cost of unplanned shutdowns.",
    explainers:
      "**What is predictive maintenance AI?** Traditional maintenance is scheduled (replace every 6 months) or reactive (fix when it breaks). Predictive maintenance uses sensors to monitor equipment condition — vibration patterns, temperature, acoustic signals — and AI to detect patterns that precede failure. The AI predicts 'this bearing will fail in 48 hours' before it actually fails, allowing maintenance to be scheduled during planned downtime. **Key metric:** MTBF (Mean Time Between Failures) — how long equipment typically runs before breaking. AI predictive maintenance extends MTBF by catching developing failures early.",
    strategyBrief:
      "**Strategic signal:** Siemens' published outcomes validate AI predictive maintenance as a proven ROI driver in automotive manufacturing. The technology is mature and available to mid-market manufacturers through industrial IoT platforms. **Risk:** Plants without sensor infrastructure can't deploy AI predictive maintenance without a hardware investment phase. **Action:** Inventory your highest-criticality equipment by downtime cost. Prioritize AI predictive maintenance deployment on the 20% of equipment responsible for 80% of unplanned downtime cost.",
  },
  signals: [
    {
      number: 1,
      title: "Siemens AI predictive maintenance: 31% downtime reduction, $220M savings across 12 plants",
      classification: "Strategic Signal",
      whatHappened:
        "Siemens published detailed outcomes from a 24-month AI predictive maintenance deployment across 12 German automotive manufacturing plants: 31% reduction in unplanned downtime, $220M in annual savings, and average failure prediction lead time of 52 hours (enough to schedule planned maintenance windows).",
      whyItMatters:
        "This is the most detailed published ROI dataset for industrial AI predictive maintenance at scale. The 52-hour prediction lead time is the operational metric that makes the economics work — enough lead time to schedule maintenance during planned downtime windows.",
      industryImpact:
        "Automotive suppliers and manufacturers globally now have a validated ROI benchmark. Industrial IoT and predictive maintenance vendors have a tier-1 reference customer. Plants without sensor infrastructure face a growing competitive gap.",
      roleImpact:
        "Plant managers and VP Operations can build concrete ROI models for predictive maintenance investment. Maintenance and reliability engineers need to reskill around AI-driven maintenance planning. CFOs need to understand the working capital implications of shifting from reactive to predictive maintenance.",
      myTake:
        "The 52-hour lead time is the number that makes this work. If your prediction window is 4 hours, you can't schedule planned maintenance — you're still reacting. 52 hours means you can plan. That's the design spec to hold AI predictive maintenance vendors to.",
      hook: "Siemens: 31% less unplanned downtime, $220M saved across 12 plants. The math: AI gives you a 52-hour warning before failure — enough time to fix it during a planned shutdown instead of an emergency one.",
      contentAngle:
        "The 'lead time is the product' post. Most people think predictive maintenance AI is about detection accuracy. It's actually about prediction lead time — do you have enough warning to plan? Frame it as the specification to demand from every vendor.",
      salesIntel:
        "Target: VP Operations, Plant Managers, and Reliability Engineers at mid-to-large manufacturers with >$50M in equipment asset value. Lead with the downtime cost math: 'What does an hour of unplanned shutdown cost at your facility? Siemens' data shows AI predictive maintenance pays back in 12–18 months at most automotive-scale plants.'",
      explainer:
        "Predictive maintenance uses sensors (vibration, temperature, sound) and AI to detect patterns that precede equipment failure — like a bearing starting to vibrate differently 50 hours before it fails. The AI learns the 'failure signature' for each type of failure and alerts when it sees that pattern developing. The plant then fixes the equipment during a planned shutdown instead of an emergency one.",
      executiveBrief:
        "Siemens' 24-month outcome data closes the ROI debate on AI predictive maintenance for automotive and heavy manufacturing. The investment case: $220M savings across 12 plants, 31% unplanned downtime reduction, with 52-hour prediction lead time enabling planned maintenance. The barrier is sensor infrastructure — plants without IoT sensor coverage need that investment first. Recommend a sensor coverage audit before AI deployment planning.",
    },
    {
      number: 2,
      title: "TSMC AI yield optimization: 99.7% defect detection, 18% waste reduction",
      classification: "Emerging Trend",
      whatHappened:
        "TSMC disclosed that its AI-powered semiconductor yield optimization system — using computer vision and process parameter AI — achieved 99.7% defect detection accuracy, an improvement from the previous 97.1% achieved with human inspection. Production waste from defective units dropped 18%.",
      whyItMatters:
        "Semiconductor yield optimization is one of the highest-value applications of AI in manufacturing — a 1% improvement in yield at TSMC's scale represents hundreds of millions of dollars. 99.7% accuracy sets the benchmark for precision manufacturing AI quality control.",
      industryImpact:
        "Electronics and precision component manufacturers now have a validated AI quality control benchmark to build toward. Human visual inspection is being replaced by AI for high-precision applications. Semiconductor supply chain stability improves as waste rates decline.",
      roleImpact:
        "Quality engineers need to understand AI-based inspection architectures. Operations leaders need to build toward AI QC as the baseline for high-precision manufacturing. R&D teams need to incorporate AI yield optimization into next-generation process design.",
      myTake:
        "The 0.3% remaining error rate matters more than it sounds at TSMC's scale — they produce millions of wafers annually. The interesting technical question is where those 0.3% errors cluster: novel defect types the AI hasn't learned, or known defect types at the edge of training distribution? That determines whether incremental training closes the gap.",
      hook: "TSMC's AI defect detection: 99.7% accuracy, 18% less waste. For context: at TSMC's scale, 0.3% error rate still represents significant volume. Where the remaining errors cluster tells you everything about the AI's limitations.",
      contentAngle:
        "The 'what 0.3% means at scale' post. Don't just celebrate the accuracy number — analyze what the remaining error represents. For precision manufacturing, the tail risk is as important as the average case.",
      salesIntel:
        "Target: Quality Directors and VP Operations at electronics and precision component manufacturers. Lead with: 'TSMC published 99.7% AI defect detection accuracy. Where is your current defect detection rate? The gap to that benchmark is the ROI opportunity for AI quality control investment.'",
      explainer:
        "Semiconductor manufacturing produces integrated circuits (chips) by etching tiny patterns on silicon wafers. Defects — microscopic contamination or pattern errors — make chips non-functional. Yield is the percentage of chips on a wafer that work. AI yield optimization uses computer vision cameras and process sensors to catch defects in real time during manufacturing, before you finish processing a defective wafer and waste all that time and material.",
      executiveBrief:
        "TSMC's 99.7% AI defect detection benchmark will become the standard that electronics manufacturers' customers demand from their supply chains. Precision component manufacturers who haven't invested in AI quality control face a quality gap that will affect procurement decisions. The investment priority: computer vision-based quality control for highest-value, highest-defect-risk production lines.",
    },
    {
      number: 3,
      title: "Port of Rotterdam: 40% autonomous container routing with AI orchestration",
      classification: "Emerging Trend",
      whatHappened:
        "The Port of Rotterdam reported that 40% of its 14 million annual container movements are now handled through AI-orchestrated autonomous routing — optimizing berth assignments, crane scheduling, truck routing, and stacking algorithms simultaneously. Port dwell time (how long containers sit waiting for processing) dropped 34%.",
      whyItMatters:
        "Rotterdam is the world's largest European port and a global supply chain bellwether. 40% autonomous routing at 14M containers per year is the largest real-world validation of multi-agent AI orchestration in logistics infrastructure.",
      industryImpact:
        "Port operators globally face competitive pressure to match Rotterdam's efficiency. Supply chain planners can now model 34% faster port clearance into lead time calculations. Shipping lines routing through Rotterdam have a concrete competitive advantage over ports using manual operations.",
      roleImpact:
        "Supply chain planners need to update their port dwell time assumptions for Rotterdam-routing containers. Operations leaders at port operators need to build an AI orchestration roadmap. Technology leaders at logistics companies need to assess integration with Rotterdam's AI routing APIs.",
      myTake:
        "The interesting constraint will be the remaining 60%. The cases AI can't yet handle autonomously are the ones with conflicting constraints, unusual cargo, or operational exceptions. That's where the human expertise needs to concentrate — not on the routine moves the AI handles well.",
      hook: "Port of Rotterdam: 40% of 14 million containers routed autonomously by AI. Dwell time down 34%. The most important supply chain AI deployment in the world just published its numbers.",
      contentAngle:
        "The 'what autonomous logistics actually looks like' post. Rotterdam is the clearest real-world example of multi-agent AI orchestration in infrastructure. Frame it as the blueprint for what port operations look like in 5 years.",
      salesIntel:
        "Target: VP Supply Chain at manufacturers and retailers with EU import/export volumes, port technology vendors, logistics optimization software companies. Lead with: 'Is Rotterdam in your supply chain routing? Their 34% dwell time reduction creates a competitive lead time advantage vs. competitors routing through less-automated ports.'",
      explainer:
        "Container dwell time is how long a shipping container sits at a port waiting to be loaded, unloaded, or transferred — before it gets to its destination. Every day of dwell time is a day of supply chain delay and cost. Rotterdam's AI orchestrates the entire port like a chess engine: which ship berths where, which crane moves which container, which trucks take which route. 34% less dwell time means your container gets through Rotterdam a third faster.",
      executiveBrief:
        "Rotterdam's 40% autonomous routing is the supply chain AI benchmark for 2026. The operational implication: supply chain planners should factor Rotterdam's 34% improved dwell time into lead time models. The strategic implication: ports and logistics operators not investing in AI orchestration face a growing efficiency gap. Recommend supply chain leaders map their Rotterdam-routed volume and model the lead time advantage into competitive planning.",
    },
  ],
};

// ─── Legal, Compliance & Risk ──────────────────────────────────────────────────

const LEGAL_COMPLIANCE: BriefingRecord = {
  id: "mock-legal-001",
  date: TODAY,
  personaKey: "legal-compliance",
  articlesFetched: 116,
  generatedAt: new Date().toISOString(),
  sections: {
    summary: [
      "EU AI Act Article 6 enforcement begins — €2.1M in fines issued to three mid-market companies; the grace period is over.",
      "SEC issues AI investment advice bulletin — broker-dealers using AI to generate personalized investment recommendations now face fiduciary duty questions.",
      "In-house counsel survey: 71% report clients are deploying AI without legal review; outside counsel are being brought in after incidents, not before.",
    ],
    quickHits:
      "**ABA issues AI ethics opinion** — attorneys using AI in legal work have professional responsibility obligations for output verification. **NLRB guidance on AI workplace surveillance** — AI-powered employee monitoring may violate NLRA. **UK Supreme Court AI patent ruling** — AI cannot be named as sole inventor; human inventorship required.",
    contentIdeas:
      "**Post angle 1:** The EU just fined three companies €2.1M for deploying high-risk AI without conformity assessments. The companies weren't giants — they were mid-market. Regulators are making examples. Here's the 3-item compliance checklist every general counsel needs before Q2. **Post angle 2:** 71% of in-house counsel say their companies deploy AI without legal review. Outside counsel are cleaning up incidents that legal could have prevented. That's the billable hour conversation that should not exist.",
    driveTime:
      "**Drive Time — Signal 1: EU AI Act Enforcement**\n\nGood morning. Let's talk about what happened in Brussels last week.\n\nThe EU AI Office issued its first enforcement actions — three companies, €2.1 million total, for deploying high-risk AI systems without conformity assessments. HR tech companies. Not giants.\n\nThe message is clear: they're starting with companies that are easy to audit, not companies that are powerful enough to fight back.\n\nFor any company with EU operations: if your AI system touches hiring, credit, healthcare, or critical infrastructure, you need a conformity assessment now. Not in Q3. Now.\n\nNIST AI RMF alignment covers about 65% of the conformity assessment requirements. If you've done RMF work, you're not starting from zero.",
    salesIntel:
      "**Buyer signal:** EU AI Act enforcement creates immediate urgency for compliance tooling and legal advisory. **Conversation opener:** 'Have your EU-facing clients started their conformity assessment process? The first €2.1M in fines just dropped — and the companies fined were mid-market HR tech, not regulated financial institutions.' **Pain point:** Most companies don't know which of their AI systems qualify as 'high-risk' under Annex III.",
    explainers:
      "**What is the EU AI Act?** The EU AI Act is the world's first comprehensive AI law — like GDPR, but for AI systems instead of personal data. It classifies AI systems by risk level. High-risk systems (used in hiring, credit scoring, healthcare, critical infrastructure) require a 'conformity assessment' before deployment in EU markets — essentially an independent audit of the system's risk controls and documentation. **Key terms:** Conformity assessment (the compliance audit), Annex III (the list of high-risk AI use cases), Notified Body (an accredited third-party auditor).",
    strategyBrief:
      "**Strategic signal:** EU AI Act enforcement has begun. The first fines are precedent-setting — mid-market companies without legal resources to fight regulators are the initial targets. **Risk:** Any EU-deployed AI system in Annex III categories without a completed conformity assessment faces material enforcement exposure. **Action:** Immediate Annex III classification audit for all EU-deployed AI systems. Prioritize hiring and HR systems, credit scoring, and any healthcare-adjacent AI. Initiate conformity assessment for all in-scope systems.",
  },
  signals: [
    {
      number: 1,
      title: "EU AI Act first fines: €2.1M for deploying high-risk AI without conformity assessments",
      classification: "Governance Alert",
      whatHappened:
        "The EU AI Office issued enforcement actions against three mid-market HR technology companies for deploying automated CV screening systems — classified as high-risk AI under Annex III — without completing required conformity assessments. Total fines: €2.1 million. The companies had EU customers but had not completed the required pre-deployment compliance process.",
      whyItMatters:
        "First enforcement sets precedent, not ceiling. Regulators chose mid-market companies — harder to fight back, easier to make examples. The signal: EU AI Act enforcement is real and the targets will not only be big tech.",
      industryImpact:
        "Companies with EU-facing AI in Annex III categories (hiring, credit, healthcare, critical infrastructure) face immediate enforcement exposure. Legal and compliance teams are now the priority owners of AI deployment decisions. Outside counsel with EU AI Act expertise is in high demand.",
      roleImpact:
        "General Counsel now owns AI compliance risk directly. Compliance officers need to complete Annex III classification for all AI systems. Technology teams need to pause EU deployment of in-scope AI until conformity assessments are complete or underway.",
      myTake:
        "The €2.1M number will grow. The first fines are calibrated to send a message, not reflect maximum exposure. Companies that treat EU AI Act compliance as a Q4 project are taking a material legal risk in Q2.",
      hook: "EU AI Act: first fines are in. €2.1M, three mid-market companies, HR tech. Regulators started with the ones who can't afford to fight. The message: the grace period is over.",
      contentAngle:
        "The 'your legal review is overdue' post for corporate counsel. Not doom — practical. The 3-item checklist: classify your AI systems under Annex III, identify which need conformity assessments, and initiate the process before Q2 ends.",
      salesIntel:
        "Target: General Counsel, Chief Compliance Officers, and EU operations leadership at technology companies and employers with EU operations. Very hot right now. Lead with: 'Have you completed Annex III classification for your EU-deployed AI systems? The first fines just dropped — mid-market companies in HR tech.'",
      explainer:
        "EU AI Act Annex III lists the 'high-risk' AI use cases that require formal compliance before deployment: hiring and HR screening, credit scoring, healthcare diagnostics, critical infrastructure, law enforcement, education, and migration. A conformity assessment is the compliance audit for these systems — documenting the risk controls, testing results, and data governance. Without a completed assessment, deployment in EU markets is illegal.",
      executiveBrief:
        "EU AI Act enforcement has commenced. Three mid-market companies fined €2.1M each for HR AI deployed without conformity assessments. The risk is material and immediate for any company with EU operations using AI in Annex III categories. Recommended action: immediate Annex III classification audit across all EU-deployed AI systems, legal counsel review of enforcement exposure, and initiation of conformity assessments for in-scope systems this quarter.",
    },
    {
      number: 2,
      title: "SEC bulletin: AI investment advice raises fiduciary duty questions for broker-dealers",
      classification: "Governance Alert",
      whatHappened:
        "The SEC issued a guidance bulletin addressing AI-generated investment recommendations delivered to retail investors through robo-advisor and hybrid advisory platforms. The bulletin raises questions about whether AI recommendations can satisfy Regulation Best Interest's care obligation, and requires broker-dealers to document how AI recommendations are overseen and corrected.",
      whyItMatters:
        "Regulation Best Interest (Reg BI) requires broker-dealers to make recommendations in the client's best interest. AI recommendations that optimize for engagement, platform revenue, or historical patterns that don't reflect current client circumstances may not satisfy Reg BI — and broker-dealers are responsible for what their AI recommends.",
      industryImpact:
        "Robo-advisory platforms and broker-dealers using AI recommendation engines need to document their AI oversight processes. Human advisor oversight of AI recommendations is now a compliance requirement, not just a best practice. Compliance teams need to audit all AI touchpoints in the client recommendation workflow.",
      roleImpact:
        "Compliance officers and Chief Compliance Officers at broker-dealers need to assess AI oversight documentation. Chief Investment Officers need to understand how AI recommendation engines can satisfy Reg BI care obligation standards. Technology teams building recommendation AI need to add oversight and explainability features.",
      myTake:
        "The SEC is applying Reg BI to AI recommendations the same way they'd apply it to human broker recommendations. The question is whether the AI recommendation process can satisfy the 'care obligation' — knowing the customer, understanding the product, and making the recommendation that's best for that specific customer. Most AI recommendation engines were built for engagement, not fiduciary compliance.",
      hook: "SEC says AI investment recommendations must satisfy Reg BI fiduciary duty. Most robo-advisor AI was built for engagement, not fiduciary compliance. That's the documentation gap the SEC just created.",
      contentAngle:
        "The 'built for engagement, not fiduciary duty' post for fintech and broker-dealer compliance. The technical question: how do you document that an AI recommendation satisfied the 'care obligation' for a specific client?",
      salesIntel:
        "Target: Chief Compliance Officers and COOs at broker-dealers, RIAs, and fintech platforms with AI recommendation features. Lead with: 'Have you reviewed your AI recommendation documentation against the new SEC Reg BI bulletin? The question is whether your AI oversight processes satisfy the care obligation.'",
      explainer:
        "Regulation Best Interest (Reg BI) is the SEC rule requiring broker-dealers to make investment recommendations that are in the client's best interest — not just suitable, but optimal given the client's needs. For human brokers, this means knowing the client, understanding the product, and documenting the recommendation. For AI systems, the same standard applies — but most AI recommendation engines weren't designed to document fiduciary compliance. That's the SEC's point.",
      executiveBrief:
        "SEC Reg BI bulletin creates a compliance documentation requirement for all broker-dealer AI recommendation systems. Platforms with AI advisory features need to audit their AI oversight documentation against the care obligation standard. The risk: AI systems optimized for engagement without fiduciary documentation are regulatory exposure. The action: engage compliance and technology to build Reg BI documentation into the AI recommendation workflow.",
    },
    {
      number: 3,
      title: "In-house counsel survey: 71% say companies deploy AI without legal review",
      classification: "Governance Alert",
      whatHappened:
        "A survey of 600 in-house counsel found that 71% report their companies have deployed AI systems in customer-facing or decision-making contexts without prior legal review. Of those, 38% have experienced an AI-related legal or compliance incident (regulatory inquiry, customer complaint, or threatened litigation) — and in 82% of cases, outside counsel was engaged after the incident, not before.",
      whyItMatters:
        "AI deployment without legal review is the root cause of most AI-related legal incidents. The survey quantifies a gap that the legal profession has observed anecdotally — companies are moving faster than their legal review processes.",
      industryImpact:
        "Legal departments that are not integrated into AI deployment decisions face reactive engagement rather than preventive counsel. Outside counsel practices in AI law and compliance are seeing reactive demand growth, not proactive retainer growth. The companies with proactive AI legal review have fewer incidents.",
      roleImpact:
        "General Counsel need to establish AI legal review as a mandatory gate for new AI deployments. Compliance teams need to create AI governance processes that include legal review. Technology teams need to understand that AI deployments are not purely technical decisions.",
      myTake:
        "The 71% number is the indictment of every company's AI governance process — or lack thereof. The 38% incident rate among those without legal review is the actuarial argument for the gate. One incident costs more than an entire year of proactive AI legal review.",
      hook: "71% of in-house counsel say their company deploys AI without legal review. 38% of those have already had an incident. The math: proactive legal review costs less than one incident. This is a solvable problem.",
      contentAngle:
        "The 'what 38% incident rate means for your legal budget' post. Frame it as an actuarial argument: the expected cost of incidents (probability × severity) vs. the cost of an AI legal review process. The ROI on preventive counsel is overwhelming.",
      salesIntel:
        "Target: General Counsel, CLOs, and outside AI law practices. Lead with: 'The in-house counsel survey data shows 38% incident rate for companies deploying AI without legal review. Has your legal department established an AI deployment review process — or are you reactive like 71% of your peers?'",
      explainer:
        "AI legal review means having counsel assess an AI system before it's deployed — evaluating regulatory compliance, liability exposure, contractual obligations, and data privacy requirements. Like a contract review before you sign, but for AI systems. Without it, companies discover their legal exposure when a regulator calls or a customer sues.",
      executiveBrief:
        "71% deployment without legal review and 38% incident rate is the empirical case for mandatory AI legal review gates. The business case is simple: expected incident cost (probability × impact) exceeds the cost of proactive legal review in most enterprise contexts. Recommendation: establish AI deployment as a legal review gate in parallel with product/security review processes.",
    },
  ],
};

// ─── Government & Public Sector ────────────────────────────────────────────────

const GOVERNMENT: BriefingRecord = {
  id: "mock-government-001",
  date: TODAY,
  personaKey: "government",
  articlesFetched: 98,
  generatedAt: new Date().toISOString(),
  sections: {
    summary: [
      "GSA releases AI Procurement Playbook — federal agencies have a standardized framework for evaluating and acquiring AI systems with built-in governance requirements.",
      "CISA warns of AI-powered social engineering attacks targeting government employees — LLMs enabling highly personalized spear-phishing at scale.",
      "UK DSIT publishes AI Assurance Market Map — 50 providers audited across bias testing, explainability, and security evaluation categories.",
    ],
    quickHits:
      "**NIST AI RMF 1.1 draft** — adds Agentic AI section with human override requirements for autonomous government systems. **OMB AI policy update** — agencies must designate AI Safety Officers by Q3. **GAO AI accountability report** — 17 of 23 federal agencies lack complete AI inventory.",
    contentIdeas:
      "**Post angle 1:** GSA's AI Procurement Playbook is the first federal framework that standardizes how agencies buy AI. For government contractors: this is the evaluation criteria your next AI proposal will be scored against. **Post angle 2:** 17 of 23 federal agencies don't have a complete AI inventory. GAO's accountability report is a direct challenge to every agency CIO — you can't govern what you can't see.",
    driveTime:
      "**Drive Time — Signal 1: CISA AI Social Engineering Warning**\n\nGood morning. Let's talk about CISA's new warning and what it means for government security teams.\n\nCISA issued an advisory on AI-powered social engineering attacks targeting government employees. The specific risk: LLMs can now generate highly personalized spear-phishing content at scale — using publicly available information about government employees to craft messages that sound like they're from a trusted colleague.\n\nTraditional phishing training teaches people to spot generic attacks. AI-powered attacks aren't generic — they're tailored to the specific target, referencing real projects, real colleagues, real institutional context.\n\nThe defensive response is behavioral: verify unexpected requests through known channels, regardless of how authentic the message seems.",
    salesIntel:
      "**Buyer signal:** GSA AI Procurement Playbook creates immediate sales opportunity for government contractors — the evaluation criteria are now published. **Conversation opener:** 'Have you mapped your AI product capabilities against the GSA AI Procurement Playbook evaluation criteria? Agencies are required to use it for AI acquisitions now.' **Pain point:** Most government AI contractors don't have governance documentation that maps to the GSA framework.",
    explainers:
      "**What is an AI Safety Officer?** OMB's new requirement that agencies designate AI Safety Officers mirrors the structure of Chief Information Security Officers (CISOs) in cybersecurity. The AI Safety Officer is responsible for agency AI governance: maintaining the AI inventory, overseeing risk assessments, and ensuring compliance with government AI policies. It's the institutional home for AI accountability in federal agencies.",
    strategyBrief:
      "**Strategic signal:** GSA procurement playbook and OMB AI Safety Officer requirement signal that federal AI governance is formalizing rapidly. Agencies without governance infrastructure face audit findings. Contractors without governance documentation face evaluation disadvantages. **Risk:** CISA's AI social engineering warning represents an immediate, active threat — no timeline, happening now. **Action:** Government IT security teams should update phishing training curriculum immediately to cover AI-personalized attacks.",
  },
  signals: [
    {
      number: 1,
      title: "GSA AI Procurement Playbook: standardized federal framework for AI acquisition",
      classification: "Strategic Signal",
      whatHappened:
        "The General Services Administration released the AI Procurement Playbook, a standardized framework for federal agencies to evaluate and acquire AI systems. The playbook defines evaluation criteria across seven dimensions: performance, security, privacy, explainability, bias testing, vendor accountability, and operational resilience. Federal agencies are directed to use the framework for all AI acquisitions above the simplified acquisition threshold.",
      whyItMatters:
        "This is the first federal standard for how agencies evaluate AI. It defines what 'good AI' means for government procurement — and creates a compliance requirement for vendors selling AI to federal agencies.",
      industryImpact:
        "Government AI contractors must now produce documentation across the seven GSA evaluation dimensions. Agencies that haven't built AI evaluation processes need to implement the GSA framework. Think tanks and consultants who help agencies implement the framework have a clear market opportunity.",
      roleImpact:
        "Agency CIOs and procurement officers need to implement the GSA evaluation framework. Government contractors need to map their AI product documentation to the seven criteria. Policy teams need to understand the framework's requirements for their AI procurement strategies.",
      myTake:
        "The seven-dimension framework is solid — it's essentially a procurement translation of NIST AI RMF. The important implication for contractors: you now know exactly what questions you'll be asked, and you need answers for all seven dimensions, not just the technical ones.",
      hook: "GSA published the AI procurement rules. Seven dimensions, required for all federal AI acquisitions. Government contractors: you now know exactly what you'll be evaluated on. Map your documentation today.",
      contentAngle:
        "The 'your proposal just got a checklist' post for government AI contractors. Walk through each of the seven GSA dimensions and what documentation contractors need to prepare.",
      salesIntel:
        "Target: Government affairs teams and BD leaders at AI vendors with federal sales pipelines. Lead with: 'Have you mapped your AI product documentation against the seven GSA procurement evaluation dimensions? Agencies are required to use this framework for all AI acquisitions now — your next proposal will be scored against it.'",
      explainer:
        "Federal agencies buy technology through formal procurement processes. Until now, each agency evaluated AI systems using different criteria. The GSA playbook standardizes the evaluation: every agency buying AI must assess it on performance, security, privacy, explainability, bias testing, vendor accountability, and resilience. It's like a standardized test for AI products that want to be sold to the government.",
      executiveBrief:
        "GSA AI Procurement Playbook creates a federal standard that all government AI contractors must meet. The seven evaluation dimensions map closely to NIST AI RMF — contractors with existing RMF documentation are well-positioned. Those without governance documentation face a proposal disadvantage starting now. Recommend a gap analysis against the seven dimensions as the first priority for any company with federal AI sales pipeline.",
    },
    {
      number: 2,
      title: "CISA: AI-powered spear-phishing targeting government employees at scale",
      classification: "Governance Alert",
      whatHappened:
        "CISA issued an advisory warning that threat actors are using LLMs to generate highly personalized spear-phishing content targeting government employees. The advisory documents cases where attackers used publicly available government employee profiles, project information, and organizational context to craft targeted messages that bypassed traditional phishing detection.",
      whyItMatters:
        "Traditional phishing defenses are built around recognizing generic attack patterns. AI-personalized spear-phishing looks nothing like a generic attack — it references real context, real colleagues, and real projects, making it much harder for employees to identify.",
      industryImpact:
        "Government security awareness training needs immediate update to address AI-personalized attacks. Security operations teams need new detection approaches beyond content pattern recognition. All government agencies are potential targets — not just high-profile departments.",
      roleImpact:
        "CISOs and IT security teams need to update threat response frameworks and employee training. Communications teams need to establish verification protocols for unexpected requests. Agency leadership needs to model security-conscious behavior — targeted executives are high-value spear-phishing targets.",
      myTake:
        "The defense is behavioral, not technical. You can't filter out a spear-phish that's perfectly tailored to the recipient. The only reliable defense is process: verify unexpected requests through a known channel, regardless of how authentic the message appears. That's a culture change, not a technology investment.",
      hook: "CISA says AI is enabling personalized spear-phishing at scale. The messages reference your real projects, real colleagues, real context. Training people to spot 'generic phishing' doesn't work anymore.",
      contentAngle:
        "The 'generic phishing training is obsolete' post for government security teams. Frame the shift: attacks are now tailored, not generic. The defense is verification process, not content detection.",
      salesIntel:
        "Target: CISOs, IT Security Directors, and Training Directors at federal agencies and government contractors. Lead with: 'Has your security awareness training been updated to address AI-personalized spear-phishing? CISA's advisory documents cases where employees in federal agencies were successfully targeted with AI-generated content that referenced their real projects and colleagues.'",
      explainer:
        "Spear-phishing is a targeted attack — instead of sending a generic 'click here' email to thousands of people, the attacker sends a carefully crafted message to one specific target that looks like it's from a trusted source. AI spear-phishing uses LLMs to generate these customized attacks automatically at scale — personalizing thousands of attacks with information pulled from public profiles, government websites, and social media. Each victim gets a message that sounds like it came from someone they know.",
      executiveBrief:
        "CISA's AI spear-phishing advisory is an active, immediate threat — no implementation timeline, this is happening now. The defensive posture: update security awareness training to teach verification-by-process rather than content recognition. The key message for employees: any unexpected request, regardless of how authentic it appears, must be verified through a known channel before acting. Technical controls (content filtering) are insufficient against AI-personalized attacks.",
    },
    {
      number: 3,
      title: "GAO AI accountability report: 17 of 23 federal agencies lack complete AI inventory",
      classification: "Governance Alert",
      whatHappened:
        "The Government Accountability Office published an AI accountability report finding that 17 of 23 major federal agencies cannot produce a complete inventory of AI systems they have deployed or are developing. The report identifies incomplete documentation, unclear ownership, and the absence of risk management processes as the primary gaps.",
      whyItMatters:
        "An incomplete AI inventory means agencies can't govern, audit, or risk-manage their AI systems. GAO findings typically precede Congressional action — this report is likely a precursor to mandatory AI inventory requirements for federal agencies.",
      industryImpact:
        "Federal agencies face increased oversight and potential mandatory inventory requirements. Agency CIOs and AI Safety Officers (newly required by OMB) have a clear Q1 priority: complete AI inventory. Government contractors should expect procurement questions about system documentation that feeds into agency inventories.",
      roleImpact:
        "Agency CIOs and newly designated AI Safety Officers own the inventory gap. IT teams need to conduct discovery exercises for deployed AI. Legal and policy teams need to establish ownership and documentation standards.",
      myTake:
        "17 of 23 is the alarming number — but the more interesting question is why. GAO found that agencies often don't know whether vendor software they've licensed uses AI, and 'shadow AI' — employees using commercial AI tools without IT authorization — is common. The inventory gap is partly a visibility problem, not just a documentation failure.",
      hook: "GAO: 17 of 23 federal agencies can't tell you what AI they have deployed. You can't govern what you can't see. Every agency CIO just got their Q2 priority handed to them.",
      contentAngle:
        "The 'you can't govern what you can't see' post for government technology leaders. Frame the inventory gap not as a documentation failure but as a visibility problem — shadow AI and unlabeled vendor AI are the main culprits.",
      salesIntel:
        "Target: Agency CIOs, AI Safety Officers (new role), and government IT management consultants. Lead with: 'GAO found that 17 of 23 major agencies can't produce a complete AI inventory. Does your agency have a methodology for discovering shadow AI and AI embedded in vendor software?' That's where most inventory gaps live.",
      explainer:
        "An AI inventory is a list of all AI systems an organization uses or is developing — what they do, who owns them, what data they process, and what risks they carry. It's the foundation of AI governance. Without it, you don't know what to audit, what to regulate, or what to shut down if something goes wrong. GAO found that most federal agencies are running AI systems they haven't inventoried — including commercial tools employees are using without IT's knowledge.",
      executiveBrief:
        "GAO's finding that 17 of 23 agencies lack complete AI inventories is a governance crisis and a precursor to mandatory reporting requirements. Agency CIOs and newly designated AI Safety Officers should treat complete AI inventory as their Q2 priority. The methodology needs to cover three categories: formally procured AI systems, AI embedded in vendor software, and shadow AI in use by employees. OMB will likely mandate formal inventory reporting within 12 months based on GAO precedent.",
    },
  ],
};

// ─── Selector function ────────────────────────────────────────────────────────

const BRIEFINGS: Record<string, BriefingRecord> = {
  healthcare: HEALTHCARE,
  "banking-finance": BANKING_FINANCE,
  insurance: INSURANCE,
  "technology-saas": TECHNOLOGY_SAAS,
  education: EDUCATION,
  "real-estate": REAL_ESTATE,
  "retail-ecommerce": RETAIL_ECOMMERCE,
  manufacturing: MANUFACTURING,
  "legal-compliance": LEGAL_COMPLIANCE,
  government: GOVERNMENT,
};

export function getMockBriefing(industryId: string): BriefingRecord {
  return BRIEFINGS[industryId] ?? BRIEFINGS["technology-saas"];
}
