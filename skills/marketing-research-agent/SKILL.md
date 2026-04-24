---
name: marketing-research-agent
description: >
  Conducts structured market intelligence research using Tavily web search
  and outputs machine-readable JSON consumed by downstream agents. Use when
  user asks to "research a niche", "run market research", "generate campaign
  intelligence", "find marketing angles", "research competitors", or when a
  campaign pipeline needs a research foundation. Outputs research_results.json,
  research_brief.md, and interactive_report.html saved to
  outputs/TASKNAME_DATE/. Always use this skill before generating ad creatives,
  video ads, or copy for a new campaign.
---

# Marketing Research Agent

Conducts 5 targeted Tavily web searches and synthesizes findings into structured marketing intelligence — JSON, Markdown brief, and interactive HTML report — ready for downstream creative agents to consume directly.

## When to Use This Skill

- User asks to research a niche, market, or product before creating content
- Pipeline starts a new campaign run and research hasn't been done yet
- User says "research [topic]", "find marketing angles for [product]", "analyze competitors for [niche]"
- Downstream agents (Ad Creative Designer, Video Ad Specialist, Copywriter) need a research foundation

## Step 1: Gather Inputs

Collect from user message or job payload:

| Input | Example | Fallback |
|-------|---------|---------|
| Niche / Topic | "Automação com N8N para agências" | Required — ask user |
| Brand | Deploy Club | From `knowledge/brand_identity.md` |
| Campaign Goal | Converter em compra | "Aumentar awareness" |
| Target Audience | Freelancers e donos de agência | From `knowledge/product_campaign.md` |

Also read `knowledge/brand_identity.md` and `knowledge/product_campaign.md` before running searches — they provide product context that makes search queries more targeted.

## Step 2: Run 5 Tavily Searches

Run exactly 5 searches using the Tavily AI SDK via the Node.js script at `pipeline/tavily-search.js`:

```bash
node pipeline/tavily-search.js --query "[query]" --topic "general" --max_results 5
```

Use these 5 search angles — adapt queries to the specific niche:

| Search # | Angle | Example Query |
|----------|-------|---------------|
| 1 | Market trends | "tendências automação N8N agências 2025" |
| 2 | Competitor messaging | "melhores ferramentas automação para agências concorrentes" |
| 3 | Audience pain points | "problemas mais comuns donos de agência automação" |
| 4 | Viral hooks & content angles | "conteúdo viral automação no-code criadores brasileiros" |
| 5 | Keyword & topic clusters | "palavras-chave SEO automação N8N YouTube Instagram" |

Save raw results from each search before synthesizing.

## Step 3: Synthesize Into Intelligence Categories

After all 5 searches complete, organize findings into these structured fields:

```json
{
  "research_meta": {
    "niche": "",
    "brand": "",
    "campaign_goal": "",
    "date": "",
    "searches_run": 5
  },
  "market_trends": [],
  "competitor_messaging": [],
  "audience_pain_points": [],
  "content_topics": [],
  "content_angles": [],
  "ad_hooks": [],
  "keywords": [],
  "video_concepts": [],
  "hashtags": []
}
```

Each array should contain 3–6 concise string items. Prioritize specificity over quantity — actionable insights only, no generic filler.

## Step 4: Generate 3 Deliverables

### Deliverable 1 — research_results.json

Machine-readable structured data using the schema from Step 3. This is the primary output consumed by all downstream agents.

### Deliverable 2 — research_brief.md

Human-readable Markdown report. Structure:

```markdown
# Research Brief: [Niche] — [Date]

## Executive Summary
[2–3 sentences on the most important finding]

## Market Trends
[Bullet list from market_trends]

## Competitor Messaging Patterns
[Bullet list from competitor_messaging]

## Audience Pain Points
[Bullet list from audience_pain_points]

## Recommended Campaign Angles
[Numbered list from content_angles — most actionable first]

## Ad Hooks to Test
[Bullet list from ad_hooks]

## Keywords & Topics
[Bullet list from keywords]

## Video Concepts
[Numbered list from video_concepts]
```

### Deliverable 3 — interactive_report.html

Interactive dashboard with Chart.js. Include:
- Bar chart of top keywords by estimated search volume (inferred from research)
- Horizontal bar chart of top content angles scored by estimated viral potential (1–10)
- Styled cards for each pain point
- Brand colors from `knowledge/brand_identity.md`

## Step 5: Save Output Files

Create the task output folder:

```bash
mkdir -p outputs/[task_name]_[date]/
```

Where `task_name` is a slug of the niche/campaign name and `date` is `YYYYMMDD`.

Save:

| File | Path |
|------|------|
| `research_results.json` | `outputs/[task_name]_[date]/research_results.json` |
| `research_brief.md` | `outputs/[task_name]_[date]/research_brief.md` |
| `interactive_report.html` | `outputs/[task_name]_[date]/interactive_report.html` |

Never save files outside `outputs/`.

## Troubleshooting

### Tavily search returns empty results

**Cause:** Query too specific or in wrong language for the topic  
**Solution:** Broaden the query; try English if Portuguese returns nothing; reduce `max_results` to 3.

### research_results.json consumed by downstream agent but fields are empty

**Cause:** Synthesis step skipped or arrays left empty  
**Solution:** Every array in the schema must have at least 3 items. If a search angle returned nothing useful, synthesize from other search results rather than leaving it empty.

### interactive_report.html Chart.js charts not rendering

**Cause:** CDN script blocked or data arrays malformed  
**Solution:** Use `https://cdn.jsdelivr.net/npm/chart.js` and verify all `data.labels` and `data.datasets[0].data` arrays have matching lengths.

## Quality Checklist

- [ ] All 5 Tavily searches executed
- [ ] `research_results.json` valid JSON with all 9 category arrays populated (3+ items each)
- [ ] `research_brief.md` contains all 7 sections
- [ ] `interactive_report.html` renders without JS errors
- [ ] All 3 files saved under `outputs/[task_name]_[date]/`
- [ ] `content_angles`, `ad_hooks`, and `keywords` fields are specific to the niche — not generic marketing advice
