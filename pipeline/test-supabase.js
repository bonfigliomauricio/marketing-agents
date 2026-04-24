require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const BUCKET = 'campaign-uploads';
const TEST_PATH = 'test/connection-check.txt';
const TEST_CONTENT = Buffer.from('deploy-club-marketing-agents supabase test ok');

async function run() {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('ERRO: SUPABASE_URL ou SUPABASE_SERVICE_KEY não configurados no .env');
    process.exit(1);
  }

  console.log(`\nSupabase URL : ${SUPABASE_URL}`);
  console.log(`Bucket       : ${BUCKET}`);
  console.log(`Arquivo test : ${TEST_PATH}\n`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // 1. Upload
  console.log('[1/3] Testando upload...');
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(TEST_PATH, TEST_CONTENT, { upsert: true, contentType: 'text/plain' });

  if (uploadError) {
    console.error(`      FALHOU: ${uploadError.message}`);
    if (uploadError.message.includes('Bucket not found')) {
      console.error('      → Bucket "campaign-uploads" não existe. Crie-o no Supabase Storage.');
    } else if (uploadError.message.includes('row-level security') || uploadError.message.includes('policy')) {
      console.error('      → Política RLS bloqueando upload. Verifique a policy INSERT para anon.');
    }
    process.exit(1);
  }
  console.log('      OK\n');

  // 2. URL pública
  console.log('[2/3] Gerando URL pública...');
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(TEST_PATH);
  console.log(`      OK — ${publicUrl}\n`);

  // 3. Remover arquivo de teste
  console.log('[3/3] Removendo arquivo de teste...');
  const { error: removeError } = await supabase.storage
    .from(BUCKET)
    .remove([TEST_PATH]);

  if (removeError) {
    console.warn(`      Aviso ao remover: ${removeError.message}`);
  } else {
    console.log('      OK\n');
  }

  console.log('Supabase configurado corretamente.');
  console.log('Bucket "campaign-uploads" pronto para receber uploads do pipeline.\n');
}

run().catch(err => {
  console.error('Erro inesperado:', err.message);
  process.exit(1);
});
