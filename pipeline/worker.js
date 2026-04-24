process.env.NODE_PATH = 'C:/dev/marketing-agents/node_modules';
require('module').Module._initPaths();

require('dotenv').config();

const { Worker } = require('bullmq');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const NODE = '"C:/Program Files/nodejs/node.exe"';

const connection = {
  host: process.env.UPSTASH_REDIS_HOST || 'localhost',
  port: parseInt(process.env.UPSTASH_REDIS_PORT || '6379'),
  password: process.env.UPSTASH_REDIS_PASSWORD || undefined,
  tls: process.env.UPSTASH_REDIS_TLS === 'true' ? {} : undefined,
};

function log(outputBase, jobName, message) {
  const logDir = path.join(outputBase, 'logs');
  fs.mkdirSync(logDir, { recursive: true });
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(path.join(logDir, `${jobName}.log`), line);
  console.log(`[${jobName}] ${message}`);
}

const handlers = {
  research_agent: async (job) => {
    const { task_name, task_date, output_base } = job.data;
    const queries = [
      `tendências mercado ${task_name.replace(/_/g, ' ')} 2025`,
      `concorrentes mensagem marketing ${task_name.replace(/_/g, ' ')}`,
      `dores da audiência ${task_name.replace(/_/g, ' ')}`,
      `conteúdo viral hooks ${task_name.replace(/_/g, ' ')}`,
      `palavras-chave SEO ${task_name.replace(/_/g, ' ')} YouTube Instagram`,
    ];

    const results = {};
    for (let i = 0; i < queries.length; i++) {
      log(output_base, 'research_agent', `Search ${i + 1}/5: ${queries[i]}`);
      const out = execSync(
        `${NODE} "${path.join(PROJECT_ROOT, 'pipeline/tavily-search.js')}" --query "${queries[i]}" --max_results 5`,
        { env: process.env, encoding: 'utf8' }
      );
      results[`search_${i + 1}`] = JSON.parse(out);
    }

    fs.mkdirSync(output_base, { recursive: true });
    fs.writeFileSync(
      path.join(output_base, 'research_results.json'),
      JSON.stringify(results, null, 2)
    );
    log(output_base, 'research_agent', `Saved research_results.json`);
  },

  ad_creative_designer: async (job) => {
    const { output_base } = job.data;
    const adsDir = path.join(output_base, 'ads');
    fs.mkdirSync(adsDir, { recursive: true });
    log(output_base, 'ad_creative_designer', 'Ad Creative Designer — awaiting Claude agent execution');
    // Claude agent generates layout.json, ad.html, styles.css, then calls render-ad.js
  },

  video_ad_specialist: async (job) => {
    const { output_base } = job.data;
    const videoDir = path.join(output_base, 'video');
    fs.mkdirSync(videoDir, { recursive: true });
    log(output_base, 'video_ad_specialist', 'Video Ad Specialist — awaiting Claude agent execution');
  },

  copywriter_agent: async (job) => {
    const { output_base } = job.data;
    const copyDir = path.join(output_base, 'copy');
    fs.mkdirSync(copyDir, { recursive: true });
    log(output_base, 'copywriter_agent', 'Copywriter Agent — awaiting Claude agent execution');
  },

  distribution_agent: async (job) => {
    const { output_base } = job.data;
    log(output_base, 'distribution_agent', 'Distribution Agent — awaiting Claude agent execution');
  },
};

const worker = new Worker(
  'ai-content-pipeline',
  async (job) => {
    const handler = handlers[job.name];
    if (!handler) {
      throw new Error(`No handler for job: ${job.name}`);
    }
    console.log(`\n[→] Starting: ${job.name}`);
    await handler(job);
    console.log(`[✓] Complete: ${job.name}`);
  },
  { connection, concurrency: 3 }
);

worker.on('completed', (job) => {
  console.log(`[✓] ${job.name} complete`);
});

worker.on('failed', (job, err) => {
  console.error(`[✗] ${job.name} failed: ${err.message}`);
  if (job?.data?.output_base) {
    log(job.data.output_base, job.name, `FAILED: ${err.message}`);
  }
});

console.log('Worker started — listening for jobs on ai-content-pipeline...');
console.log('Press Ctrl+C to stop.\n');
