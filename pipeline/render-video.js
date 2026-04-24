process.env.NODE_PATH = 'C:/dev/marketing-agents/node_modules';
require('module').Module._initPaths();

const path = require('path');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');

const BROWSER_EXECUTABLE = 'C:/Users/Mauricio/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENTRY_POINT = path.join(PROJECT_ROOT, 'remotion', 'src', 'index.js');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'outputs', 'remotion_test_video');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'foccusbr_ad.mp4');

async function main() {
  console.log('Bundling Remotion composition...');
  const bundled = await bundle({
    entryPoint: ENTRY_POINT,
    publicDir: path.join(PROJECT_ROOT, 'assets'),
    webpackOverride: (config) => config,
  });

  console.log('Selecting composition FoccusBRVideo...');
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'FoccusBRVideo',
    inputProps: {},
    browserExecutable: BROWSER_EXECUTABLE,
  });

  console.log(`Rendering ${composition.durationInFrames} frames at ${composition.fps}fps...`);
  console.log(`Output: ${OUTPUT_FILE}`);

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: OUTPUT_FILE,
    inputProps: {},
    browserExecutable: BROWSER_EXECUTABLE,
    onProgress: ({ progress }) => {
      process.stdout.write(`\rProgress: ${Math.round(progress * 100)}%`);
    },
  });

  console.log('\nRender complete!');
  console.log(`Video saved to: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Render failed:', err.message);
  process.exit(1);
});
