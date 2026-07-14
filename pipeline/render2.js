// Template 2 renderer — Full-Bleed Editorial
// Usage: node render2.js <workdir>
// Reads ../template/template2-data.json, fonts in ../template/fonts,
// Noto Sans SC + emoji subset in <workdir>. Outputs N PNGs (1080x1350) to ../output2.

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { buildHtml2, W, H } = require('./template2.js');

const HERE = __dirname;
const WORK = process.argv[2] || '/tmp/carousel-run';

(async () => {
  const dataPath = process.argv[3] || path.join(HERE, '..', 'template', 'template2-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const fontBase = 'file://' + path.join(HERE, '..', 'template', 'fonts');
  const sansPath = 'file://' + path.join(WORK, 'NotoSansSC.sub.ttf');
  const emojiFile = path.join(WORK, 'NotoEmoji.ttf');
  const emojiPath = fs.existsSync(emojiFile) ? 'file://' + emojiFile : '';

  const html = buildHtml2({ data, fontBase, sansPath, emojiPath });
  const htmlPath = path.join(WORK, 'template2.html');
  fs.writeFileSync(htmlPath, html);

  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--font-render-hinting=none'] });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto('file://' + htmlPath);
  const imgWait = await page.evaluate(() =>
    Promise.all([...document.images].map(im => im.complete ? 1 : new Promise(res => { im.onload = () => res(1); im.onerror = () => res(0); })))
  );
  console.log('images loaded:', imgWait.filter(Boolean).length + '/' + imgWait.length);
  await page.waitForTimeout(400);

  const outDir = path.join(HERE, '..', 'output2');
  fs.mkdirSync(outDir, { recursive: true });
  const pages = await page.$$('.page');
  for (let i = 0; i < pages.length; i++) {
    const n = String(i + 1).padStart(2, '0');
    await pages[i].screenshot({ path: path.join(outDir, `slide-${n}.png`) });
    console.log('rendered slide', n);
  }
  await browser.close();
  console.log('DONE →', outDir);
})().catch(e => { console.error(e); process.exit(1); });
