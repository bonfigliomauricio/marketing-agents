const { chromium } = require('playwright');
const path = require('path');

async function renderAd(htmlPath, outputPath, width = 1080, height = 1080) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: outputPath, clip: { x: 0, y: 0, width, height } });
  await browser.close();
  console.log(`Rendered: ${outputPath}`);
}

// CLI usage: node render-ad.js <input.html> <output.png>
if (require.main === module) {
  const [, , inputHtml, outputPng] = process.argv;
  if (!inputHtml || !outputPng) {
    console.error('Usage: node render-ad.js <input.html> <output.png>');
    process.exit(1);
  }
  renderAd(path.resolve(inputHtml), path.resolve(outputPng))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { renderAd };
