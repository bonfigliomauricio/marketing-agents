/**
 * Local pipeline runner — no Redis/BullMQ required.
 * Runs all agents sequentially, creates full folder structure,
 * and executes the Research Agent via Tavily.
 *
 * Usage:
 *   node pipeline/run-local.js
 *   node pipeline/run-local.js --task-name "foccusbr_test" --topic "plataforma elevatória tesoura"
 */

process.env.NODE_PATH = 'C:/dev/marketing-agents/node_modules';
require('module').Module._initPaths();
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const { execSync, spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const NODE = `"C:/Program Files/nodejs/node.exe"`;

// --- CLI args ---
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };

const TASK_NAME  = get('--task-name') || 'foccusbr_test';
const TASK_DATE  = get('--task-date') || new Date().toISOString().split('T')[0];
const TOPIC      = get('--topic')     || 'plataforma elevatória tesoura elétrica locação Piracicaba';
const SKIP_RES   = args.includes('--skip-research');
const SKIP_IMG   = args.includes('--skip-image');
const SKIP_VID   = args.includes('--skip-video');

const BASE = path.join(PROJECT_ROOT, 'outputs', `${TASK_NAME}_${TASK_DATE}`);

// --- Helpers ---
function mkdir(p) { fs.mkdirSync(p, { recursive: true }); }

function log(agent, msg, status = 'info') {
  const icons = { info: '  ', ok: '✓', skip: '✗', run: '→', err: '✗' };
  const icon = icons[status] || '  ';
  const line = `[${new Date().toISOString()}] ${msg}`;
  const logPath = path.join(BASE, 'logs', `${agent}.log`);
  mkdir(path.join(BASE, 'logs'));
  fs.appendFileSync(logPath, line + '\n');
  console.log(`[${icon}] ${agent.padEnd(24)} ${msg}`);
}

function writeJSON(filePath, data) {
  mkdir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function writeTxt(filePath, content) {
  mkdir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

// ─────────────────────────────────────────────
// STEP 0 — Create folder structure
// ─────────────────────────────────────────────
function createFolders() {
  ['', 'ads', 'video', 'copy', 'logs'].forEach(sub => mkdir(path.join(BASE, sub)));
  console.log(`\nPipeline: ${TASK_NAME} — ${TASK_DATE}`);
  console.log(`Output:   ${BASE}`);
  console.log('─'.repeat(55));
}

// ─────────────────────────────────────────────
// AGENT 1 — Marketing Research Agent
// ─────────────────────────────────────────────
function runResearch() {
  if (SKIP_RES) { log('research_agent', 'Skipped by flag', 'skip'); return null; }

  log('research_agent', 'Running 5 Tavily searches...', 'run');

  const queries = [
    `tendências ${TOPIC} 2025`,
    `concorrentes locação ${TOPIC}`,
    `dores clientes ${TOPIC} gestores obras`,
    `conteúdo viral hooks ${TOPIC} redes sociais`,
    `palavras-chave SEO ${TOPIC} YouTube Instagram`,
  ];

  const allResults = {};
  const synthesis = {
    research_meta: { niche: TOPIC, task_name: TASK_NAME, date: TASK_DATE, searches_run: 5 },
    market_trends: [],
    competitor_messaging: [],
    audience_pain_points: [],
    content_topics: [],
    content_angles: [],
    ad_hooks: [],
    keywords: [],
    video_concepts: [],
    hashtags: [],
  };

  for (let i = 0; i < queries.length; i++) {
    log('research_agent', `Search ${i + 1}/5: ${queries[i].substring(0, 50)}...`);
    try {
      const proc = spawnSync(
        'C:/Program Files/nodejs/node.exe',
        [path.join(PROJECT_ROOT, 'pipeline/tavily-search.js'), '--query', queries[i], '--max_results', '5'],
        { env: process.env, encoding: 'utf8', timeout: 15000 }
      );
      if (proc.status !== 0) throw new Error(proc.stderr || 'non-zero exit');
      const result = JSON.parse(proc.stdout);
      allResults[`search_${i + 1}`] = result;

      // Extract snippets into synthesis fields
      const snippets = (result.results || []).map(r => r.content || r.title).filter(Boolean);
      if (i === 0) synthesis.market_trends.push(...snippets.slice(0, 3));
      if (i === 1) synthesis.competitor_messaging.push(...snippets.slice(0, 3));
      if (i === 2) synthesis.audience_pain_points.push(...snippets.slice(0, 3));
      if (i === 3) synthesis.ad_hooks.push(...snippets.slice(0, 3));
      if (i === 4) synthesis.keywords.push(...snippets.slice(0, 3));

    } catch (err) {
      log('research_agent', `Search ${i + 1} failed: ${err.message}`, 'err');
    }
  }

  // Add synthesized fields
  synthesis.content_topics = [`Locação de tesoura elétrica ${TOPIC}`, 'Segurança no trabalho em altura', 'Disponibilidade imediata de equipamentos'];
  synthesis.content_angles = ['Disponibilidade imediata sem burocracia', 'Segurança comprovada vs andaime improvisado', '21 anos de mercado — experiência que protege'];
  synthesis.video_concepts = ['Hook: Você ainda usa andaime?', 'Linha de 22 tesouras no galpão', 'Operador trabalhando com segurança em 14m'];
  synthesis.hashtags = ['#PlataformaElevatória', '#TesouraElétrica', '#TrabalhoEmAltura', '#FoccusBR', '#Piracicaba'];

  writeJSON(path.join(BASE, 'research_results.json'), synthesis);
  writeJSON(path.join(BASE, 'research_raw.json'), allResults);
  log('research_agent', 'research_results.json saved', 'ok');
  return synthesis;
}

// ─────────────────────────────────────────────
// AGENT 2 — Ad Creative Designer (placeholder)
// ─────────────────────────────────────────────
function runAdCreative(research) {
  if (SKIP_IMG) { log('ad_creative_designer', 'Skipped by flag', 'skip'); return; }
  log('ad_creative_designer', 'Generating layout spec...', 'run');

  const layout = {
    format: 'instagram_square',
    template: 'split',
    width: 1080, height: 1080,
    background: '#1A1A1A',
    elements: [
      { type: 'headline', text: 'Plataforma Segura.', x: 80, y: 160, fontSize: 120, color: '#FFFFFF', fontFamily: 'Montserrat', fontWeight: 'bold' },
      { type: 'subtext',  text: 'Tesoura elétrica 6–14m. Disponível agora.', x: 80, y: 310, fontSize: 44, color: '#E85A00', fontFamily: 'Inter', fontWeight: 'normal' },
      { type: 'cta',      text: 'Consulte o Estoque', x: 80, y: 880, fontSize: 36, bgColor: '#E85A00', textColor: '#FFFFFF', paddingX: 48, paddingY: 20 },
      { type: 'image',    src: 'tesoura_logo_frontal.jpg', x: 560, y: 120, width: 460, height: 460 },
    ],
  };

  writeJSON(path.join(BASE, 'ads', 'layout.json'), layout);
  log('ad_creative_designer', 'layout.json saved', 'ok');
  log('ad_creative_designer', 'Run ad-creative-designer skill to generate ad.html + instagram_ad.png');
}

// ─────────────────────────────────────────────
// AGENT 3 — Video Ad Specialist (placeholder)
// ─────────────────────────────────────────────
function runVideoAd(research) {
  if (SKIP_VID) { log('video_ad_specialist', 'Skipped by flag', 'skip'); return; }
  log('video_ad_specialist', 'Generating scene JSON...', 'run');

  const scenes = {
    composition: 'AdVideo',
    props: {
      style: 'problem_solution',
      duration: 15,
      platform: 'instagram_reels',
      scenes: [
        { type: 'hook',    text: 'Trabalho em altura sem plataforma segura?' },
        { type: 'problem', text: 'Andaime improvisado. Risco. Improdutividade.' },
        { type: 'product', text: 'FoccusBR. 22 tesouras elétricas. Disponíveis agora.' },
        { type: 'benefit', text: '6 a 14m · Elétrica · Piracicaba e Região' },
        { type: 'cta',     text: 'Consulte o Estoque.' },
      ],
    },
  };

  writeJSON(path.join(BASE, 'video', 'scene_spec.json'), scenes);
  log('video_ad_specialist', 'scene_spec.json saved', 'ok');
  log('video_ad_specialist', 'Run video-ad-specialist skill + Remotion to render final video');
}

// ─────────────────────────────────────────────
// AGENT 4 — Copywriter Agent
// ─────────────────────────────────────────────
function runCopywriter(research) {
  log('copywriter_agent', 'Generating platform copy...', 'run');

  const angle = research?.content_angles?.[0] || 'Disponibilidade imediata sem burocracia';

  const threads = `Você ainda perde tempo com andaime improvisado em obra?

FoccusBR tem 22 tesouras elétricas de 6 a 14m disponíveis agora — sem burocracia, com entrega em Piracicaba e região. 21 anos de mercado. Estoque próprio.`;

  const instagram = `Trabalho em altura com segurança real. 🏗️

Chega de andaime improvisado. A FoccusBR tem tesouras elétricas de 6 a 14 metros disponíveis para locação imediata em Piracicaba e região.

✅ 22 equipamentos em estoque
✅ Uso interno e externo
✅ 21 anos de mercado

Consulte disponibilidade agora — link na bio.

#PlataformaElevatória #TesouraElétrica #TrabalhoEmAltura #FoccusBR #Piracicaba`;

  const youtube = {
    title: 'Plataforma Elevatória Tesoura Elétrica para Locação em Piracicaba | FoccusBR',
    description: `A FoccusBR oferece locação de plataformas elevatórias tesoura elétrica de 6 a 14 metros para obras, indústrias e construtoras em Piracicaba e região.\n\n✅ 22 equipamentos disponíveis\n✅ Modelos 6m, 8m, 10m, 12m e 14m\n✅ Elétrica — uso interno e externo\n✅ Entrega e retirada na região\n✅ 21 anos de mercado\n\nConsulte disponibilidade: [seu contato aqui]\n\n#PlataformaElevatória #TesouraElétrica #Piracicaba #FoccusBR`,
    tags: ['plataforma elevatória', 'tesoura elétrica', 'locação piracicaba', 'trabalho em altura', 'FoccusBR', 'plataforma elevatória locação', 'scissor lift brasil', 'equipamento construção'],
  };

  writeTxt(path.join(BASE, 'copy', 'threads_post.txt'), threads);
  writeTxt(path.join(BASE, 'copy', 'instagram_caption.txt'), instagram);
  writeJSON(path.join(BASE, 'copy', 'youtube_metadata.json'), youtube);
  log('copywriter_agent', 'threads_post.txt saved', 'ok');
  log('copywriter_agent', 'instagram_caption.txt saved', 'ok');
  log('copywriter_agent', 'youtube_metadata.json saved', 'ok');
}

// ─────────────────────────────────────────────
// AGENT 5 — Distribution Agent (advisory only)
// ─────────────────────────────────────────────
function runDistribution() {
  log('distribution_agent', 'Generating Publish advisory...', 'run');

  const publishFile = `# Publish Advisory: ${TASK_NAME} — ${TASK_DATE}

## Status
READY FOR REVIEW — Awaiting explicit publish confirmation.

## Media Files
| File | Path |
|------|------|
| instagram_ad.png | outputs/${TASK_NAME}_${TASK_DATE}/ads/instagram_ad.png |
| scene_spec.json  | outputs/${TASK_NAME}_${TASK_DATE}/video/scene_spec.json  |

## Instagram
**Caption:**
$(cat outputs/${TASK_NAME}_${TASK_DATE}/copy/instagram_caption.txt)

**Scheduled Time:** Terça–Sexta, 18h–20h (horário de Brasília)

## YouTube
See: outputs/${TASK_NAME}_${TASK_DATE}/copy/youtube_metadata.json
**Scheduled Time:** Quarta–Quinta, 19h–21h

## Threads
See: outputs/${TASK_NAME}_${TASK_DATE}/copy/threads_post.txt
**Posting:** Manual — Threads has no public API.

## Scheduling Notes
Based on research trends for plataformas elevatórias: engagement peaks mid-week evenings with construction/industrial audiences in Brazil.

## To Publish
To execute real API posting, reference this file explicitly:
"Execute Publish ${TASK_NAME} ${TASK_DATE}.md"
`;

  writeTxt(path.join(BASE, `Publish ${TASK_NAME} ${TASK_DATE}.md`), publishFile);
  log('distribution_agent', `Publish ${TASK_NAME} ${TASK_DATE}.md saved`, 'ok');
}

// ─────────────────────────────────────────────
// MAIN — run all agents
// ─────────────────────────────────────────────
async function main() {
  createFolders();

  const research = runResearch();
  runAdCreative(research);
  runVideoAd(research);
  runCopywriter(research);
  runDistribution();

  console.log('\n' + '─'.repeat(55));
  console.log('Pipeline complete!\n');
  console.log(`Output folder: outputs/${TASK_NAME}_${TASK_DATE}/`);
  console.log(`Publish file:  outputs/${TASK_NAME}_${TASK_DATE}/Publish ${TASK_NAME} ${TASK_DATE}.md`);
  console.log('\nNext: open the Publish MD file to review and confirm distribution.');
}

main().catch(err => {
  console.error('\nPipeline error:', err.message);
  process.exit(1);
});
