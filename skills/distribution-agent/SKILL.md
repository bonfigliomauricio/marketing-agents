---
name: distribution-agent
description: >
  Uploads campaign media to Supabase, assembles publish-ready metadata from
  research and copy outputs, generates scheduling recommendations, and writes
  a Publish advisory MD file. Use when user asks to "distribute the campaign",
  "upload media to Supabase", "prepare posts for publishing", "generate the
  publish file", "schedule the campaign", or when a pipeline run needs its
  final distribution step. Reads from outputs/TASKNAME_DATE/ and saves
  media_urls.json and a Publish MD file there. ONLY executes real API posting
  when the user explicitly references the generated Publish MD file by name.
  Do NOT post to Instagram or YouTube without that explicit user confirmation.
---

# Distribution Agent

Hosts campaign media on Supabase, assembles platform metadata from upstream agent outputs, generates a scheduling advisory, and gates real publishing behind explicit user confirmation via the Publish MD file.

## When to Use This Skill

- Pipeline has completed Research, Creative, and Copy steps and needs distribution
- User asks to "distribute the campaign", "upload to Supabase", "generate the publish file"
- User explicitly references `Publish <task_name> <date>.md` to trigger actual posting
- Do NOT use for generating copy or creative assets — use `copywriter-agent` and `ad-creative-designer` instead

## CRITICAL: Publishing Gate

Real API posting to Instagram or YouTube happens **only** when the user references the Publish MD file explicitly in their message, e.g.:

> "Execute Publish deploy_club_campaign 2026-03-31.md"

All other steps in this skill are preparation only. Never post without this explicit confirmation.

## Step 1: Load Upstream Outputs

Locate and read all outputs from the current campaign run:

```
outputs/<task_name>_<date>/
  research_results.json        ← from Marketing Research Agent
  copy/
    instagram_caption.txt      ← from Copywriter Agent
    threads_post.txt           ← from Copywriter Agent
    youtube_metadata.json      ← from Copywriter Agent
  ads/
    instagram_ad.png           ← from Ad Creative Designer
    ad.html
  video/
    ad.mp4 (or scene JSON)     ← from Video Ad Specialist
```

Also read:
- `knowledge/brand_identity.md` — brand voice, approved CTAs
- `knowledge/platform_guidelines.md` — per-platform posting rules

Extract from `research_results.json`:
- `market_trends` — for scheduling timing notes
- `keywords` — for YouTube tag validation
- `content_angles` — for confirming metadata alignment

## Step 2: Upload Media to Supabase

Upload all media files from `outputs/<task_name>_<date>/` to the Supabase bucket `campaign-uploads`.

Use the Supabase JS client at `C:/dev/marketing-agents/node_modules/@supabase/supabase-js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const filePath = `${task_name}/${date}/${filename}`;
const { data, error } = await supabase.storage
  .from('campaign-uploads')
  .upload(filePath, fileBuffer, { upsert: true });

const { data: { publicUrl } } = supabase.storage
  .from('campaign-uploads')
  .getPublicUrl(filePath);
```

Upload rules:
- Use path format `<task_name>/<date>/<filename>` inside the bucket — ensures uniqueness per task
- Upload all files: `instagram_ad.png`, `ad.mp4` (if exists), `ad.html`
- Collect all public URLs after upload

Save collected URLs as `outputs/<task_name>_<date>/media_urls.json`:

```json
{
  "instagram_ad": "https://<project>.supabase.co/storage/v1/object/public/campaign-uploads/...",
  "video": "https://...",
  "ad_html": "https://..."
}
```

If Supabase credentials are not configured (`SUPABASE_URL` missing), log a warning and continue with local file paths as placeholder URLs — do not block the rest of the pipeline.

## Step 3: Assemble Platform Metadata

Build final publish metadata per platform by combining copy outputs and media URLs.

**Instagram:**
```json
{
  "image_url": "<from media_urls.json>",
  "caption": "<full text from copy/instagram_caption.txt>",
  "scheduled_time": "<recommended time — see Step 4>"
}
```

**YouTube:**
```json
{
  "video_url": "<from media_urls.json>",
  "title": "<from copy/youtube_metadata.json title>",
  "description": "<from copy/youtube_metadata.json description>",
  "tags": ["<from copy/youtube_metadata.json tags>"],
  "scheduled_time": "<recommended time — see Step 4>"
}
```

**Threads:**
```json
{
  "text": "<full text from copy/threads_post.txt>",
  "scheduled_time": "<recommended time — see Step 4>"
}
```

## Step 4: Generate Scheduling Recommendations

Using insights from `research_results.json` → `market_trends` and `knowledge/platform_guidelines.md`, recommend posting times.

Default schedule template (adjust based on research findings):

| Platform | Recommended Window | Rationale |
|----------|-------------------|-----------|
| Instagram | Terça–Sexta, 18h–20h | Peak engagement for Brazilian audiences |
| YouTube | Quarta–Quinta, 19h–21h | Search volume peaks mid-week evenings |
| Threads | Qualquer dia, 12h–13h ou 19h–20h | Short-form lunch and evening browsing |

If `market_trends` from research contains specific timing data, override these defaults.

## Step 5: Write the Publish MD File

Generate the advisory file at:

```
outputs/<task_name>_<date>/Publish <task_name> <date>.md
```

Structure:

```markdown
# Publish Advisory: <task_name> — <date>

## Status
READY FOR REVIEW — Awaiting explicit publish confirmation.

## Media URLs
| File | URL |
|------|-----|
| instagram_ad.png | <url> |
| video | <url> |

## Instagram
**Caption:**
<full caption text>

**Scheduled Time:** <recommendation>

## YouTube
**Title:** <title>
**Description:** <description>
**Tags:** <comma-separated tags>
**Scheduled Time:** <recommendation>

## Threads
**Post:**
<full threads text>

**Scheduled Time:** <recommendation>

## Scheduling Notes
<2–3 sentences from research trends explaining why these times were chosen>

## To Publish
To execute real posting, reference this file explicitly:
"Execute Publish <task_name> <date>.md"

Instagram and YouTube APIs will be called only after that confirmation.
Threads has no public API — copy the post text above and post manually.
```

## Step 6: Execute Posting (Gated — Requires Explicit Confirmation)

This step runs **only** when the user explicitly references the Publish MD file.

### Instagram via Graph API

```javascript
// Step 1 — Create media container
POST https://graph.facebook.com/v19.0/<ig_user_id>/media
  image_url: <supabase public URL>
  caption: <caption text>
  access_token: process.env.INSTAGRAM_ACCESS_TOKEN

// Step 2 — Publish container
POST https://graph.facebook.com/v19.0/<ig_user_id>/media_publish
  creation_id: <id from step 1>
  access_token: process.env.INSTAGRAM_ACCESS_TOKEN
```

### YouTube via Data API

```javascript
// Requires OAuth — if YOUTUBE_REFRESH_TOKEN is not set, log advisory and skip
POST https://www.googleapis.com/upload/youtube/v3/videos
  Authorization: Bearer <refreshed access token>
  part: snippet,status
  body: { title, description, tags, privacyStatus: "public" }
```

If `YOUTUBE_REFRESH_TOKEN` is not configured: log `"YouTube OAuth not configured — skipping video upload. Post manually using metadata in Publish MD."` and continue.

### Threads

Threads has no public posting API. Include the post text in the Publish MD file and note it requires manual posting.

## Troubleshooting

### Supabase upload fails with 403

**Cause:** Bucket `campaign-uploads` does not exist or RLS policy blocks anon key  
**Solution:** Create the bucket in Supabase dashboard with public read access; verify `SUPABASE_ANON_KEY` has storage write permission.

### Instagram API returns `OAuthException`

**Cause:** `INSTAGRAM_ACCESS_TOKEN` expired (tokens expire every 60 days)  
**Solution:** Refresh via Facebook token debugger; update `.env` file.

### Publish MD file not found when user tries to confirm

**Cause:** Step 5 output saved to wrong path  
**Solution:** File must be exactly at `outputs/<task_name>_<date>/Publish <task_name> <date>.md` — check for date format mismatch (must be `YYYY-MM-DD`).

## Quality Checklist

**Before generating Publish MD:**
- [ ] All upstream output files located in `outputs/<task_name>_<date>/`
- [ ] `research_results.json` read for scheduling context
- [ ] `knowledge/platform_guidelines.md` read for posting rules
- [ ] All media files uploaded to Supabase with valid public URLs
- [ ] `media_urls.json` saved with all URLs populated
- [ ] Platform metadata assembled for Instagram, YouTube, Threads

**Publish MD file:**
- [ ] Saved at `outputs/<task_name>_<date>/Publish <task_name> <date>.md`
- [ ] Contains all 3 platform metadata blocks
- [ ] Scheduling recommendations present with rationale
- [ ] "To Publish" instruction block included
- [ ] Threads noted as manual-only

**On posting (only after user confirmation):**
- [ ] Instagram Graph API called in 2-step flow (create → publish)
- [ ] YouTube skipped gracefully if OAuth not configured
- [ ] Post results logged to `outputs/<task_name>_<date>/logs/distribution_agent.log`
