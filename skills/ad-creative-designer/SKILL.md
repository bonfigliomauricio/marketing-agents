---
name: ad-creative-designer
description: >
  Generates static image ads end-to-end: layout JSON spec, rendered HTML
  ad file, and final PNG via Playwright screenshot. Use when user asks to
  "create an image ad", "design a static ad", "generate an Instagram ad",
  "make a YouTube thumbnail", "build a social media creative", or when a
  rendered ad PNG is needed. Outputs layout JSON, ad.html, styles.css, and
  instagram_ad.png saved to outputs/TASKNAME_DATE/ads/. Always use this
  skill when producing static ad creatives for Instagram, Facebook, or
  YouTube.
---

# Ad Creative Designer

Generates a structured layout JSON spec that the frontend CanvasRenderer reads to produce a pixel-perfect PNG ad — no image generation APIs, no GPU required.

## When to Use This Skill

- User asks to create a static image ad for Instagram, Facebook, or YouTube
- Pipeline requests an ad layout spec from the Ad Creative Designer agent
- Output will be consumed by the frontend CanvasRenderer (HTML5 Canvas → PNG export)
- User provides: product, audience, platform, style

## Step 1: Gather Inputs

Collect from user message, job payload, or `research_results.json`:

| Input | Example | Fallback |
|-------|---------|---------|
| Product | Kit Definitivo N8N | "Product" |
| Audience | Freelancers e donos de agência | "Profissionais" |
| Platform | Instagram Post | `instagram_square` |
| Style | Editorial Terroso | `modern_minimal` |

If inputs are missing, infer reasonable defaults. Also check `knowledge/brand_identity.md` for brand voice, approved CTAs, and color palette before generating.

## Step 2: Select Layout Template

Choose a template based on platform and style. Never freehand-position elements — always start from a template.

| Template | When to Use |
|----------|-------------|
| `product_focus` | Product screenshot is the hero; minimal copy |
| `split` | Left: copy block. Right: product image. |
| `centered_minimal` | Bold headline centered, no image, typographic impact |
| `lifestyle` | Full-bleed background image, short overlay copy |

## Step 3: Select Platform Format

Map platform to canvas dimensions:

| Platform | Format Slug | Width | Height |
|----------|-------------|-------|--------|
| Instagram Post | `instagram_square` | 1080 | 1080 |
| Instagram Story | `instagram_story` | 1080 | 1920 |
| Instagram Feed 4:5 | `instagram_feed` | 1080 | 1350 |
| YouTube Thumbnail | `youtube_thumbnail` | 1280 | 720 |
| Facebook Feed | `facebook_feed` | 1200 | 628 |

## CRITICAL: Output Format

Output ONLY valid JSON. No prose, no markdown fences, no explanation before or after.

Required fields at root level:
- `format` — platform format slug
- `template` — chosen layout template
- `width` — canvas width in px
- `height` — canvas height in px
- `background` — hex color or `"image"` if using a background asset

Each element in `elements[]` must include:
- `type` — one of: `headline`, `subtext`, `cta`, `image`, `badge`, `divider`
- `x`, `y` — position in pixels from top-left

Type-specific required fields:

**Text elements** (`headline`, `subtext`, `cta`):
- `text` — copy string
- `fontSize` — number in px
- `color` — hex color
- `fontFamily` — font name (Montserrat, Roboto Condensed, Inter, Playfair Display)
- `fontWeight` — `"bold"` or `"normal"`

**Image elements**:
- `src` — asset filename (e.g. `"claude_code_terminal.png"`) — relative to `/assets/`
- `width` — rendered width in px
- `height` — rendered height in px

**CTA button**:
- `text` — button label
- `bgColor` — button background hex
- `textColor` — label hex
- `paddingX`, `paddingY` — inner padding in px

## Examples

### Example 1: Instagram Square — Split Template

**User says:** "Cria um ad para o Kit Definitivo N8N no Instagram, estilo editorial terroso"

```json
{
  "format": "instagram_square",
  "template": "split",
  "width": 1080,
  "height": 1080,
  "background": "#F5F0E8",
  "elements": [
    {
      "type": "headline",
      "text": "Para de Construir do Zero",
      "x": 80,
      "y": 160,
      "fontSize": 72,
      "color": "#2C1810",
      "fontFamily": "Montserrat",
      "fontWeight": "bold"
    },
    {
      "type": "subtext",
      "text": "88 templates N8N testados em produção",
      "x": 80,
      "y": 280,
      "fontSize": 34,
      "color": "#5C4033",
      "fontFamily": "Inter",
      "fontWeight": "normal"
    },
    {
      "type": "cta",
      "text": "Copia e Cola",
      "x": 80,
      "y": 820,
      "fontSize": 32,
      "bgColor": "#2C1810",
      "textColor": "#FAF8F4",
      "paddingX": 48,
      "paddingY": 20
    },
    {
      "type": "image",
      "src": "claude_code_terminal.png",
      "x": 560,
      "y": 120,
      "width": 440,
      "height": 440
    }
  ]
}
```

### Example 2: YouTube Thumbnail — Product Focus

**User says:** "Gera thumbnail YouTube para o Mente Mestra Claude Code"

```json
{
  "format": "youtube_thumbnail",
  "template": "product_focus",
  "width": 1280,
  "height": 720,
  "background": "#1A1A2E",
  "elements": [
    {
      "type": "headline",
      "text": "Mente Mestra",
      "x": 80,
      "y": 200,
      "fontSize": 96,
      "color": "#FFFFFF",
      "fontFamily": "Montserrat",
      "fontWeight": "bold"
    },
    {
      "type": "subtext",
      "text": "Claude Code que retém contexto",
      "x": 80,
      "y": 320,
      "fontSize": 40,
      "color": "#A0A0C0",
      "fontFamily": "Inter",
      "fontWeight": "normal"
    },
    {
      "type": "image",
      "src": "claude_interface.png",
      "x": 700,
      "y": 60,
      "width": 520,
      "height": 600
    }
  ]
}
```

## Troubleshooting

### Elements appear off-canvas or overlapping

**Cause:** Positions not validated against canvas dimensions  
**Solution:** Check that `x + element_width` does not exceed `width`, and `y + element_height` does not exceed `height`.

### Generic or off-brand copy

**Cause:** `knowledge/brand_identity.md` not consulted  
**Solution:** Re-read brand identity file and regenerate with approved CTAs and color palette.

### Image `src` not resolving in renderer

**Cause:** Filename doesn't match exactly what's in `/assets/`  
**Solution:** Use only filenames documented in `assets/assets_catalog.md`. Filenames are case-sensitive.

## Step 7: HTML Ad Rendering

After generating the layout JSON, convert it into a rendered HTML advertisement.

Generate two files: `ad.html` and `styles.css`.

The HTML structure must match the selected layout template:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="ad-container">
    <div class="headline">[headline text from JSON]</div>
    <div class="subtext">[subtext text from JSON]</div>
    <img class="product" src="[image src from JSON]" />
    <button class="cta">[cta text from JSON]</button>
  </div>
</body>
</html>
```

CSS requirements — `styles.css` must enforce:

```css
body { margin: 0; padding: 0; }

.ad-container {
  width: 1080px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  /* background from JSON background field */
}
```

Typography hierarchy — font sizes must reflect the JSON `fontSize` values:
- `headline`: largest, bold, dominant
- `subtext`: secondary, lighter weight
- `cta`: button style — visually distinct with background color and padding

Position each element using `position: absolute` with `left` and `top` from the JSON `x` and `y` values.

Use the `fontFamily`, `fontWeight`, and `color` fields from each element in the JSON.

The CTA element must render as a styled button, not plain text:

```css
.cta {
  background-color: [bgColor from JSON];
  color: [textColor from JSON];
  padding: [paddingY]px [paddingX]px;
  border: none;
  cursor: pointer;
  font-family: [fontFamily];
  font-weight: bold;
}
```

For `image` elements, use the `src` filename with the path prefix `../../assets/` so the HTML loads from the project assets folder.

---

## Step 8: Playwright Screenshot Rendering

After generating `ad.html` and `styles.css`, render the ad to PNG using Playwright.

Run the following Node.js script via Bash:

```bash
node pipeline/render-ad.js [absolute_path_to_ad.html] [absolute_path_to_instagram_ad.png]
```

The `render-ad.js` script is located at `pipeline/render-ad.js` in the project root. It:
1. Launches Chromium headless
2. Sets viewport to 1080×1080
3. Loads the `ad.html` file via `file:///` URL
4. Waits for `networkidle` (images fully loaded)
5. Captures a 1080×1080 screenshot
6. Saves as PNG

If the script fails, check:
- File paths are absolute (not relative) when passed to the script
- The `ad.html` correctly references images at `../../assets/[filename]`
- Playwright is installed at `C:/dev/marketing-agents/node_modules/playwright`

---

## Step 9: Output Storage Rules

All generated files must be saved inside the project `outputs/` directory.

Determine the task folder path using:
```
outputs/[task_name]_[date]/ads/
```

Where `task_name` is the job name from the pipeline payload (or a slug derived from the product name) and `date` is today's date in `YYYYMMDD` format.

Create the folder if it does not exist:
```bash
mkdir -p outputs/[task_name]_[date]/ads/
```

Save the following files there:

| File | Description |
|------|-------------|
| `layout.json` | The design spec JSON from Steps 1–6 |
| `ad.html` | The HTML ad file from Step 7 |
| `styles.css` | The stylesheet from Step 7 |
| `instagram_ad.png` | The rendered PNG from Step 8 |

Never save generated files outside the `outputs/` directory.

---

## Quality Checklist

Before reporting completion, verify all three deliverables:

**Layout JSON:**
- [ ] JSON is valid — all brackets and quotes closed
- [ ] `format` and `template` fields are present
- [ ] `width` and `height` match the selected platform format exactly
- [ ] All text elements have `fontSize`, `color`, `fontFamily`, `fontWeight`
- [ ] All image `src` values match filenames in `assets/assets_catalog.md`
- [ ] No element extends outside the canvas bounds
- [ ] CTA copy uses approved language from `knowledge/brand_identity.md`

**HTML Rendering:**
- [ ] `ad.html` and `styles.css` generated
- [ ] `.ad-container` is exactly 1080×1080
- [ ] All element positions use `position: absolute` with `left`/`top` from JSON `x`/`y`
- [ ] CTA renders as a styled button, not plain text
- [ ] Image `src` paths use `../../assets/` prefix

**Playwright Render:**
- [ ] `render-ad.js` executed successfully
- [ ] `instagram_ad.png` exists at `outputs/[task_name]_[date]/ads/`
- [ ] No error output from the render script

**Storage:**
- [ ] All 4 files saved under `outputs/[task_name]_[date]/ads/`
- [ ] No files created outside `outputs/`
