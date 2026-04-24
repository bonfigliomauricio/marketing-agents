process.env.NODE_PATH = 'C:/dev/marketing-agents/node_modules';
require('module').Module._initPaths();

require('dotenv').config();

const { Queue } = require('bullmq');
const { Redis } = require('@upstash/redis');
const path = require('path');
const fs = require('fs');

// --- Redis connection ---
const connection = {
  host: process.env.UPSTASH_REDIS_HOST || 'localhost',
  port: parseInt(process.env.UPSTASH_REDIS_PORT || '6379'),
  password: process.env.UPSTASH_REDIS_PASSWORD || undefined,
  tls: process.env.UPSTASH_REDIS_TLS === 'true' ? {} : undefined,
};

const queue = new Queue('ai-content-pipeline', { connection });

// --- Parse CLI payload ---
const args = process.argv.slice(2);
const payloadIdx = args.indexOf('--payload');
const resumeFromIdx = args.indexOf('--resume-from');

if (payloadIdx === -1) {
  // Demo payload for testing
  console.log('No --payload provided. Using demo payload.');
}

const rawPayload = payloadIdx !== -1 ? args[payloadIdx + 1] : null;
const resumeFrom = resumeFromIdx !== -1 ? args[resumeFromIdx + 1] : null;

const payload = rawPayload ? JSON.parse(rawPayload) : {
  task_name: 'demo_campaign',
  task_date: new Date().toISOString().split('T')[0],
  platform_targets: ['instagram', 'youtube'],
  skip_research: false,
  skip_image: false,
  skip_video: false,
};

// --- Validate payload ---
if (!payload.task_name || !payload.task_date) {
  console.error('Error: payload must include task_name and task_date.');
  process.exit(1);
}

// --- Validate skip_research asset folder ---
const PROJECT_ROOT = path.resolve(__dirname, '..');
if (payload.skip_research) {
  const assetFolder = path.join(PROJECT_ROOT, 'assets', payload.task_name);
  if (!fs.existsSync(assetFolder) || fs.readdirSync(assetFolder).length === 0) {
    console.error(`Pipeline blocked: skip_research is true but assets/${payload.task_name}/ is missing or empty.`);
    console.error(`Upload your source assets to that folder before running the pipeline.`);
    process.exit(1);
  }
  console.log(`✓ Source folder confirmed: assets/${payload.task_name}/`);
}

// --- Create log directory ---
const outputDir = path.join(PROJECT_ROOT, 'outputs', `${payload.task_name}_${payload.task_date}`, 'logs');
fs.mkdirSync(outputDir, { recursive: true });

// --- Define pipeline jobs ---
const PIPELINE = [
  {
    name: 'research_agent',
    group: 1,
    skip: payload.skip_research,
    dependencies: [],
  },
  {
    name: 'ad_creative_designer',
    group: 2,
    skip: payload.skip_image,
    dependencies: ['research_agent'],
  },
  {
    name: 'video_ad_specialist',
    group: 2,
    skip: payload.skip_video,
    dependencies: ['research_agent'],
  },
  {
    name: 'copywriter_agent',
    group: 2,
    skip: false,
    dependencies: ['research_agent'],
  },
  {
    name: 'distribution_agent',
    group: 3,
    skip: false,
    dependencies: ['ad_creative_designer', 'video_ad_specialist', 'copywriter_agent'],
  },
];

async function main() {
  console.log(`\nPipeline: ${payload.task_name} — ${payload.task_date}`);
  console.log('─'.repeat(55));

  const jobStatuses = {};

  for (const job of PIPELINE) {
    // Skip if before resume point
    if (resumeFrom && job.name !== resumeFrom && !jobStatuses[job.name]) {
      const prevJobs = PIPELINE.filter(j => j.group < job.group);
      const allPrevComplete = prevJobs.every(j => jobStatuses[j.name] === 'skipped' || jobStatuses[j.name] === 'complete');
      if (!allPrevComplete) continue;
    }

    if (job.skip) {
      jobStatuses[job.name] = 'skipped';
      console.log(`[✗] ${job.name.padEnd(25)} Skipped by user flag`);
      const logPath = path.join(outputDir, `${job.name}.log`);
      fs.writeFileSync(logPath, `[${new Date().toISOString()}] SKIPPED by user flag\n`);
      continue;
    }

    const jobData = {
      ...payload,
      job_name: job.name,
      output_base: path.join(PROJECT_ROOT, 'outputs', `${payload.task_name}_${payload.task_date}`),
    };

    await queue.add(job.name, jobData, {
      attempts: 2,
      backoff: { type: 'exponential', delay: 3000 },
    });

    jobStatuses[job.name] = 'queued';
    console.log(`[…] ${job.name.padEnd(25)} queued`);

    const logPath = path.join(outputDir, `${job.name}.log`);
    fs.writeFileSync(logPath, `[${new Date().toISOString()}] QUEUED\n`);
  }

  console.log('─'.repeat(55));
  console.log('Jobs enqueued. Start the worker: node pipeline/worker.js\n');

  await queue.close();
}

main().catch(err => {
  console.error('Orchestrator failed:', err.message);
  process.exit(1);
});
