---
name: copywriter-agent
description: >
  Generates platform-native marketing copy for Threads, Instagram, and YouTube
  aligned with brand voice and campaign research. Use when user asks to "write
  copy", "generate captions", "write a Threads post", "create Instagram caption",
  "write YouTube title and description", "generate social media copy", or when
  the pipeline needs copy after research is complete. Reads brand guidelines
  from knowledge/ and research from outputs/. Saves threads_post.txt,
  instagram_caption.txt, and youtube_metadata.json to outputs/TASKNAME_DATE/copy/.
  Do NOT use for video scripts or ad image copy — use video-ad-specialist or
  ad-creative-designer instead.
---

# Copywriter Agent

Transforms campaign research into platform-native marketing copy for Threads, Instagram, and YouTube — brand-aligned, campaign-consistent, never generic.

## When to Use This Skill

- Pipeline needs copy after Marketing Research Agent has run
- User asks to write Threads post, Instagram caption, or YouTube metadata for a campaign
- Copy must be consistent with a specific campaign angle from research output
- Do NOT use for video scene scripts (use `video-ad-specialist`) or ad image text (use `ad-creative-designer`)

## Step 1: Load Brand Context

Before writing a single word, read these files:

```
knowledge/brand_identity.md      ← brand voice, approved CTAs, emojis, tone
knowledge/product_campaign.md    ← product features, selling points, campaign angles
knowledge/platform_guidelines.md ← per-platform formatting rules and constraints
```

If any file is missing, infer brand voice from previous outputs in `outputs/` rather than guessing generically.

Brand guidelines override any default copy instincts. If a CTA is not on the approved list, don't use it.

## Step 2: Load Research Output

If a campaign run exists, load:

```
outputs/[task_name]_[date]/research_results.json
```

Extract and note these fields for use in Steps 3–5:

| Field | Used For |
|-------|---------|
| `content_angles` | Select the single campaign angle |
| `ad_hooks` | Threads opening line, Instagram hook |
| `keywords` | YouTube title optimization, description, tags |
| `audience_pain_points` | Instagram middle copy, YouTube description context |
| `hashtags` | Instagram hashtags (filter to 3–5 most relevant) |

If no research output exists, proceed with brand files only and note the limitation.

## Step 3: Select a Single Campaign Angle

Choose **one** angle from `content_angles` in the research output. This angle must stay consistent across all three platforms — do not switch angles between Threads, Instagram, and YouTube.

Document the chosen angle before generating any copy:

```
Campaign Angle: [selected angle]
Reason: [why this angle fits the product and audience]
```

## Step 4: Generate Platform Copy

Generate copy for all three platforms in sequence. Never copy-paste the same text between platforms.

---

### Threads Post

Rules from `knowledge/platform_guidelines.md`:
- Short form: 1–2 short paragraphs
- Tone: conversational, provocative, direct
- Maximum 500 characters
- 0–1 emoji maximum
- No hashtags
- Opening line must be a pattern interrupt from `ad_hooks`

```
[Threads post text here]
```

---

### Instagram Caption

Rules from `knowledge/platform_guidelines.md`:
- Structure: Hook + Benefit + CTA
- Tone: editorial with a direct CTA challenge
- Maximum 2 emojis
- 3–5 hashtags at the end (from `hashtags` in research)
- CTA must use approved language from `knowledge/brand_identity.md`

```
[Instagram caption here]

#hashtag1 #hashtag2 #hashtag3
```

---

### YouTube Metadata

Rules from `knowledge/platform_guidelines.md`:
- Title: 60–70 characters, SEO-optimized, includes primary keyword from `keywords`
- Description: 150–200 words, includes 3–5 keywords naturally, ends with CTA
- Tags: 8–12 tags, mix of broad and specific, drawn from `keywords`

```json
{
  "title": "",
  "description": "",
  "tags": []
}
```

## Step 5: Save Output Files

Create the copy output folder:

```bash
mkdir -p outputs/[task_name]_[date]/copy/
```

Save:

| File | Content |
|------|---------|
| `threads_post.txt` | Plain text Threads post |
| `instagram_caption.txt` | Plain text caption with hashtags |
| `youtube_metadata.json` | JSON with title, description, tags |

## Examples

### Example: Deploy Club Campaign

**Campaign angle selected:** "Para de construir do zero"

**Threads:**
```
Você ainda monta automação do zero em cada cliente?

88 templates N8N testados em produção. O mesmo sistema que cobro R$7.500 pra implementar — por R$47.
```

**Instagram:**
```
Para de construir automação do zero.

88 templates N8N que já rodaram em produção real.
O mesmo sistema que cobro R$7.500 pra implementar — direto no seu Claude Code.

Copia e cola. Funciona. 🔁

#N8N #AutomaçãoDeAgência #ClaudeCode #FreelancerDigital #Automação
```

**YouTube:**
```json
{
  "title": "88 Templates N8N Prontos para Agências — Para de Construir do Zero",
  "description": "Se você ainda monta automação N8N do zero pra cada cliente, esse vídeo muda isso...",
  "tags": ["N8N templates", "automação agência", "Claude Code", "N8N português", "automação freelancer"]
}
```

## Troubleshooting

### Copy sounds generic or off-brand

**Cause:** `knowledge/brand_identity.md` not loaded before generating  
**Solution:** Re-read brand identity file; rewrite using approved CTAs and tone descriptors verbatim.

### Threads and Instagram copy are too similar

**Cause:** Same hook used on both platforms  
**Solution:** Threads uses a blunt one-liner from `ad_hooks`; Instagram uses a narrative hook + benefit structure. Rewrite from scratch for each.

### YouTube tags returning 0 views or misaligned

**Cause:** Tags drawn from generic knowledge rather than `keywords` from research  
**Solution:** Use only keywords from `research_results.json` → `keywords` field; add 2–3 long-tail variants.

## Quality Checklist

- [ ] `knowledge/brand_identity.md` read before generating
- [ ] `knowledge/platform_guidelines.md` read before generating
- [ ] `research_results.json` loaded (if available)
- [ ] Single campaign angle selected and documented
- [ ] Threads post: max 500 chars, conversational, pattern-interrupt opening
- [ ] Instagram: hook + benefit + CTA structure, 3–5 hashtags, max 2 emojis
- [ ] YouTube title: 60–70 chars with primary keyword
- [ ] YouTube metadata saved as valid JSON
- [ ] Copy is distinct across all 3 platforms — no copy-paste
- [ ] CTA uses approved language from brand identity
- [ ] All 3 files saved under `outputs/[task_name]_[date]/copy/`
