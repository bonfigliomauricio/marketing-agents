---
name: orchestrator
description: >
  Runs the full AI content marketing pipeline from a single Job Payload JSON.
  Use when user says "run the pipeline", "start a campaign run", "execute the
  full pipeline", "run all agents", "start the content pipeline", or provides
  a JSON payload with task_name and task_date. Validates the payload, enqueues
  all agent jobs via BullMQ, enforces dependency order, handles skip flags,
  and tracks job status through to the Distribution Agent. Do NOT use for
  running individual agents in isolation — invoke those skills directly instead.
---

# Orchestrator

Receives a Job Payload and runs the full AI content marketing pipeline as a single coordinated workflow — research, creatives, copy, and distribution — with dependency enforcement, skip flag support, and job tracking.

## When to Use This Skill

- User submits a Job Payload JSON with `task_name` and `task_date`
- User says "run the pipeline", "start a campaign run", or "execute all agents"
- Full pipeline coordination is needed, not a single agent
- Do NOT use to run individual agents — invoke `marketing-research-agent`, `ad-creative-designer`, `video-ad-specialist`, `copywriter-agent`, or `distribution-agent` directly for single-agent tasks

## Pipeline Architecture

```
Job Payload
     ↓
Orchestrator (this skill)
     ↓
[1] Marketing Research Agent        ← first, or skip if source_folder exists
     ↓
[2a] Ad Creative Designer  ─┐
[2b] Video Ad Specialist   ─┼── run in parallel after research
[2c] Copywriter Agent      ─┘
     ↓
[3] Distribution Agent              ← last, after all outputs ready
```

Jobs 2a, 2b, and 2c run in parallel. Each can be skipped independently via flags.

## Step 1: Validate the Job Payload

Accept the payload in this format:

```json
{
  "task_name": "deploy_club_campaign",
  "task_date": "2026-04-20",
  "source_folder": "assets/deploy_club_campaign",
  "platform_targets": ["instagram", "youtube"],
  "skip_research": false,
  "skip_image": false,
  "skip_video": false
}
```

Validate required fields:

| Field | Required | Validation |
|-------|----------|-----------|
| `task_name` | Yes | Non-empty string, no spaces (use underscores) |
| `task_date` | Yes | Format `YYYY-MM-DD` |
| `platform_targets` | Yes | Array with at least one of: `instagram`, `youtube`, `threads` |
| `skip_research` | No | Defaults to `false` |
| `skip_image` | No | Defaults to `false` |
| `skip_video` | No | Defaults to `false` |

If `task_name` or `task_date` is missing, stop and ask the user to provide them before proceeding.

## Step 2: Validate Skip Conditions

Before enqueuing any jobs, validate skip dependencies.

### If skip_research is true:

Check that `assets/<task_name>/` exists and is not empty:

```bash
ls assets/<task_name>/
```

If the folder does not exist or is empty, **block the pipeline** and return:

```
Pipeline blocked: skip_research is true but assets/<task_name>/ is missing or empty.
Upload your source assets to that folder before running the pipeline.
```

If the folder exists, proceed with research skipped.

### If skip_image is true:
Mark Ad Creative Designer job as `complete` with note `"Skipped by user flag"`. No output generated for this job.

### If skip_video is true:
Mark Video Ad Specialist job as `complete` with note `"Skipped by user flag"`. No output generated for this job.

## Step 3: Enqueue Jobs via BullMQ

Run the orchestrator pipeline script:

```bash
node pipeline/orchestrator.js --payload '<json_payload_string>'
```

The script (`pipeline/orchestrator.js`) enqueues jobs into the BullMQ queue `ai-content-pipeline` backed by Upstash Redis.

Job dependency order enforced by the script:

| Job | Depends On | Parallel Group |
|-----|-----------|----------------|
| `research_agent` | — (first) | Group 1 |
| `ad_creative_designer` | `research_agent` | Group 2 |
| `video_ad_specialist` | `research_agent` | Group 2 |
| `copywriter_agent` | `research_agent` | Group 2 |
| `distribution_agent` | All Group 2 jobs | Group 3 |

Then start the BullMQ worker in a separate terminal:

```bash
node pipeline/worker.js
```

The worker processes jobs from the queue and invokes each agent skill in order.

## Step 4: Track Job Status

Log the status of each job as it progresses. Each job uses this schema:

```json
{
  "job_name": "video_ad_specialist",
  "status": "queued | running | complete | failed",
  "dependencies": ["research_agent"],
  "output_path": "outputs/deploy_club_campaign_2026-04-20/video/",
  "notes": ""
}
```

Save job logs to:

```
outputs/<task_name>_<task_date>/logs/<job_name>.log
```

Print a live status table as jobs complete:

```
Pipeline Status — deploy_club_campaign — 2026-04-20
────────────────────────────────────────────────────
[✓] research_agent          complete
[✓] ad_creative_designer    complete
[→] video_ad_specialist     running
[→] copywriter_agent        running
[…] distribution_agent      queued
```

## Step 5: Handle Job Failures

If any Group 1 or Group 2 job fails:

1. Log the error to `outputs/<task_name>_<task_date>/logs/<job_name>.log`
2. Stop dependent downstream jobs (do not run Distribution Agent if upstream jobs failed)
3. Report to the user:

```
Pipeline error: <job_name> failed.
Error: <error message>
Downstream jobs paused: <list of blocked jobs>
Fix the issue and re-run with: node pipeline/orchestrator.js --payload '<payload>' --resume-from <job_name>
```

Distribution Agent runs only if all Group 2 jobs are `complete` (or `skipped`).

## Step 6: Report Pipeline Completion

When all jobs are `complete` (or `skipped`), print the final summary:

```
Pipeline Complete — deploy_club_campaign — 2026-04-20
──────────────────────────────────────────────────────
[✓] research_agent          outputs/deploy_club_campaign_2026-04-20/research_results.json
[✓] ad_creative_designer    outputs/deploy_club_campaign_2026-04-20/ads/instagram_ad.png
[✗] video_ad_specialist     Skipped by user flag
[✓] copywriter_agent        outputs/deploy_club_campaign_2026-04-20/copy/
[✓] distribution_agent      outputs/deploy_club_campaign_2026-04-20/Publish deploy_club_campaign 2026-04-20.md

Ready to publish: reference the Publish MD file to trigger posting.
```

Surface the Publish MD file path so the user can confirm distribution.

## Examples

### Example 1: Full pipeline run

**User says:** "Run the pipeline" and provides:
```json
{
  "task_name": "deploy_club_campaign",
  "task_date": "2026-04-20",
  "platform_targets": ["instagram", "youtube"],
  "skip_research": false,
  "skip_image": false,
  "skip_video": false
}
```

**Actions:** Validate payload → enqueue all 5 jobs → start worker → track status → report completion with Publish MD path.

### Example 2: Skip research, skip video

**User says:** "Run with existing assets, skip research and video"
```json
{
  "task_name": "deploy_club_campaign",
  "task_date": "2026-04-20",
  "platform_targets": ["instagram"],
  "skip_research": true,
  "skip_video": true
}
```

**Actions:** Validate `assets/deploy_club_campaign/` exists → enqueue research as skipped → enqueue ad_creative_designer, copywriter_agent (parallel) → video_ad_specialist marked complete/skipped → enqueue distribution_agent → report.

## Troubleshooting

### Worker not processing jobs

**Cause:** `pipeline/worker.js` not running  
**Solution:** Open a separate terminal and run `node pipeline/worker.js`. The orchestrator enqueues; the worker processes.

### Pipeline blocked on skip_research

**Cause:** `assets/<task_name>/` folder missing  
**Solution:** Create the folder and upload source assets (images, brand files) before re-running.

### Jobs stuck in `queued` state

**Cause:** Redis/Upstash connection failed  
**Solution:** Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set in `.env`. Test with: `node -e "require('./pipeline/test-redis.js')"`

### Distribution Agent not running

**Cause:** One or more Group 2 jobs failed  
**Solution:** Check logs at `outputs/<task_name>_<task_date>/logs/`. Fix the failing agent and re-run from that step.

## Quality Checklist

- [ ] Payload validated — `task_name`, `task_date`, `platform_targets` present
- [ ] Skip conditions validated before enqueuing
- [ ] `assets/<task_name>/` confirmed if `skip_research: true`
- [ ] All jobs enqueued in correct dependency order
- [ ] Worker started and processing
- [ ] Job logs created for each agent at `outputs/<task_name>_<task_date>/logs/`
- [ ] Distribution Agent ran last, after all Group 2 jobs complete or skipped
- [ ] Publish MD file path surfaced to user in final report
- [ ] No automatic publishing — only advisory output until user confirms
