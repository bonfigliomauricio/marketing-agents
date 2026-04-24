require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const TASK_NAME = 'deploy_club_campaign';
const TASK_DATE = '2026-04-24';
const OUTPUT_BASE = path.join(__dirname, '..', 'outputs', `${TASK_NAME}_${TASK_DATE}`);
const BUCKET = 'campaign-uploads';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const FILES = [
  { local: path.join(OUTPUT_BASE, 'ads', 'instagram_ad.png'), remote: `${TASK_NAME}/${TASK_DATE}/instagram_ad.png`, key: 'instagram_ad' },
  { local: path.join(OUTPUT_BASE, 'ads', 'ad.html'),          remote: `${TASK_NAME}/${TASK_DATE}/ad.html`,           key: 'ad_html' },
  { local: path.join(OUTPUT_BASE, 'video', 'ad_scenes.json'), remote: `${TASK_NAME}/${TASK_DATE}/ad_scenes.json`,    key: 'video_scenes' },
];

async function upload() {
  const urls = {};

  for (const file of FILES) {
    if (!fs.existsSync(file.local)) {
      console.warn(`  Skipped (not found): ${file.local}`);
      continue;
    }

    const buffer = fs.readFileSync(file.local);
    const contentType = file.local.endsWith('.png') ? 'image/png'
      : file.local.endsWith('.html') ? 'text/html'
      : 'application/json';

    process.stdout.write(`  Uploading ${path.basename(file.local)}... `);
    const { error } = await supabase.storage.from(BUCKET).upload(file.remote, buffer, { upsert: true, contentType });

    if (error) {
      console.error(`FALHOU: ${error.message}`);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(file.remote);
    urls[file.key] = publicUrl;
    console.log(`OK`);
    console.log(`    → ${publicUrl}`);
  }

  fs.writeFileSync(path.join(OUTPUT_BASE, 'media_urls.json'), JSON.stringify(urls, null, 2));
  console.log(`\n  Saved: outputs/${TASK_NAME}_${TASK_DATE}/media_urls.json`);
  return urls;
}

upload().catch(err => { console.error(err.message); process.exit(1); });
