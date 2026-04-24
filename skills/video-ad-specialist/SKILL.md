---
name: video-ad-specialist
description: >
  Converts marketing intent into structured short-form video ad scenes optimized
  for social media platforms. Use when user asks to "create a video ad", "generate
  video scenes", "build a short-form ad", "make a Reels ad", "create a YouTube
  Short ad", or when a video ad JSON output is needed for Remotion rendering.
  Outputs Remotion-compatible JSON with composition, style, duration, platform,
  and scenes. Always use this skill when producing video ad content for
  Instagram Reels, YouTube Shorts, or TikTok.
---

# Video Ad Specialist

Converts marketing intent into structured short-form video ad scene JSON, ready for Remotion rendering.

## When to Use This Skill

- User asks to create a video ad for Instagram Reels, YouTube Shorts, or TikTok
- User needs scene structure for a short-form social media ad
- Pipeline requests a video ad JSON from the Video Ad Specialist agent
- Output will be consumed by the Remotion rendering skill

## Step 1: Gather Inputs

Collect the following from context or user message:

| Input | Source | Fallback |
|-------|--------|---------|
| Product | User message or `research_results.json` | "Product" |
| Target Audience | User message or research output | "Freelancers e donos de agência" |
| Platform | User message or `platform_targets` in job payload | `instagram_reels` |
| Campaign Goal | User message or research brief | "Converter em compra" |

If any input is missing, infer a reasonable default. Do not ask the user for missing fields unless the product name is completely unknown.

Also check `knowledge/brand_identity.md` and `knowledge/product_campaign.md` for brand voice, approved CTAs, and product selling points before generating.

## Step 2: Select Ad Strategy

Choose the strategy that best fits the product, audience, and campaign goal:

| Strategy | When to Use |
|----------|-------------|
| `product_showcase` | Highlighting features or a new launch |
| `problem_solution` | Audience has a clear pain point to resolve |
| `testimonial` | Social proof is the strongest conversion lever |
| `limited_offer` | Urgency or scarcity-driven campaign |
| `lifestyle` | Aspiration or identity-based positioning |
| `meme_style` | Viral or humor-driven awareness content |

The selected strategy determines narrative structure, pacing, and scene ordering.

## Step 3: Build Scene Sequence

Map the strategy to a scene sequence using platform timing constraints.

**Instagram Reels — Hook-driven, fast pacing:**
```
Hook (~2s) → Product (~5s) → Benefit (~3s) → CTA (~2s)
Total: 10–12 seconds
```

**YouTube Shorts — Narrative arc, slightly longer:**
```
Hook (~3s) → Problem (~3s) → Solution (~5s) → CTA (~3s)
Total: 12–15 seconds
```

Each scene must have:
- `type` — one of: `hook`, `problem`, `product`, `benefit`, `testimonial`, `offer`, `cta`
- `text` — the on-screen copy for that scene (concise, punchy)

Optional scene properties:
- `visual` — reference to a visual asset filename or description
- `transition` — e.g. `"fade"`, `"slide"`, `"cut"`
- `animation` — e.g. `"zoom_in"`, `"bounce"`, `"typewriter"`

## CRITICAL: Output Format

The output MUST be valid JSON only — no prose, no markdown fences, no explanation text before or after the JSON block.

Required fields:

```json
{
  "composition": "AdVideo",
  "props": {
    "style": "<strategy>",
    "duration": <total_seconds_as_integer>,
    "platform": "<platform_slug>",
    "scenes": [
      { "type": "<scene_type>", "text": "<on_screen_copy>" }
    ]
  }
}
```

Platform slugs: `instagram_reels`, `youtube_shorts`, `tiktok`

## Examples

### Example 1: Instagram Reels — Product Showcase

**User says:** "Cria um video ad para o Kit Definitivo N8N para Instagram Reels"

**Output:**
```json
{
  "composition": "AdVideo",
  "props": {
    "style": "product_showcase",
    "duration": 12,
    "platform": "instagram_reels",
    "scenes": [
      { "type": "hook", "text": "Você ainda constrói automações do zero?" },
      { "type": "product", "text": "88 templates N8N testados em produção" },
      { "type": "benefit", "text": "O mesmo sistema que vendo por R$7.500" },
      { "type": "cta", "text": "Copia e cola. Link na bio." }
    ]
  }
}
```

### Example 2: YouTube Shorts — Problem/Solution

**User says:** "Gera um ad para YouTube Shorts para o Mente Mestra Claude Code"

**Output:**
```json
{
  "composition": "AdVideo",
  "props": {
    "style": "problem_solution",
    "duration": 14,
    "platform": "youtube_shorts",
    "scenes": [
      { "type": "hook", "text": "Quanto tempo você gasta explicando o mesmo pro Claude?" },
      { "type": "problem", "text": "Sem sistema, cada conversa começa do zero." },
      { "type": "product", "text": "Mente Mestra: o método de agentes que retêm contexto." },
      { "type": "benefit", "text": "Configure uma vez. Funciona pra sempre." },
      { "type": "cta", "text": "Acessa o link e começa hoje." }
    ]
  }
}
```

## Troubleshooting

### Output rejected by Remotion renderer

**Cause:** Missing required fields or invalid JSON  
**Solution:** Confirm `composition`, `props.style`, `props.duration`, `props.platform`, and `props.scenes` are all present. Validate JSON syntax before outputting.

### Scenes feel generic or off-brand

**Cause:** `knowledge/brand_identity.md` and `knowledge/product_campaign.md` not consulted  
**Solution:** Re-read both files and regenerate with brand voice and approved CTAs applied.

### Duration seems wrong

**Cause:** Scene count doesn't match platform timing  
**Solution:** Sum individual scene durations. Instagram Reels: 10–12s. YouTube Shorts: 12–15s. Adjust scene count or text density accordingly.

## Quality Checklist

Before outputting, verify:

- [ ] JSON is valid and contains all required fields
- [ ] `platform` slug matches one of: `instagram_reels`, `youtube_shorts`, `tiktok`
- [ ] Scene `type` values are from the approved list
- [ ] `duration` matches the sum of individual scene timings
- [ ] Copy uses brand voice from `knowledge/brand_identity.md`
- [ ] Hook is attention-grabbing within the first 2–3 seconds
- [ ] CTA matches approved language from brand identity
- [ ] Output is JSON only — no surrounding prose or markdown
