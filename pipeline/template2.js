// Just Travel Carousel — Template 2: 全屏编辑刊 (Full-Bleed Editorial)
// Faithful clone of the 漫遊之星 flash-trip look, rebranded to Just Travel, 简体中文.
// Slide types: cover | thesis | segment | recap | closing.
// Data source: template2-data.json  { destination, slides:[...] }

const GOLD = '#D9B45B';
const W = 1080, H = 1350;

// dark scrim so text reads over the full-bleed photo
const SCRIM = 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,.10) 38%, rgba(0,0,0,.55) 72%, rgba(0,0,0,.88) 100%)';

const TITLE_FF = "'WenDaoCover','SansSC','Emoji',sans-serif";
const BODY_FF = "'SansSC','Emoji',sans-serif";

function esc(s) { return String(s == null ? '' : s); }

function frame(inner, photo, extraScrim) {
  return `<section class="page" style="position:relative;width:${W}px;height:${H}px;overflow:hidden;flex:none;background:#000;font-family:${BODY_FF}">
    <img class="bg" src="${esc(photo)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" crossorigin="anonymous"/>
    <div style="position:absolute;inset:0;background:${extraScrim || SCRIM}"></div>
    ${inner}
    <div style="position:absolute;left:0;right:0;bottom:40px;text-align:center;z-index:9">
      <div style="font-family:${BODY_FF};font-size:27px;letter-spacing:5px;color:#fff;opacity:.95;font-weight:600">✦ Just&nbsp;Travel</div>
    </div>
  </section>`;
}

// { gold braces title } — WenDaoChaoHei-2, centered
function braceTitle(t, align) {
  return `<div style="font-family:${TITLE_FF};color:${GOLD};font-size:62px;line-height:1.25;font-weight:900;text-align:${align || 'center'};text-shadow:0 2px 16px rgba(0,0,0,.6);letter-spacing:1px">{ ${esc(t)} }</div>`;
}

function leadLine(t) {
  return `<div style="font-family:${BODY_FF};color:#fff;font-size:38px;font-weight:800;line-height:1.4;text-shadow:0 2px 12px rgba(0,0,0,.7);margin-top:26px">${esc(t)}</div>`;
}

function bodyBlock(lines) {
  return (lines || []).map(l =>
    `<div style="font-family:${BODY_FF};color:#fff;font-size:33px;font-weight:500;line-height:1.5;text-shadow:0 2px 10px rgba(0,0,0,.7);margin-top:20px">${esc(l)}</div>`
  ).join('');
}

// text block anchored to lower part of the slide
function lowerBlock(inner) {
  return `<div style="position:absolute;left:64px;right:64px;bottom:150px;z-index:6">${inner}</div>`;
}

function slideCover(s) {
  const inner = `<div style="position:absolute;left:64px;right:64px;bottom:150px;z-index:6">
    <div style="font-family:${TITLE_FF};font-weight:900;font-size:70px;line-height:1.28;text-shadow:0 3px 18px rgba(0,0,0,.75)">
      <div style="color:#fff">${esc(s.titleWhite)}</div>
      <div style="color:${GOLD}">${esc(s.titleGold)}</div>
    </div>
    <div style="width:150px;height:7px;background:${GOLD};border-radius:4px;margin:26px 0 22px"></div>
    <div style="font-family:${TITLE_FF};color:#fff;font-size:40px;font-weight:700;text-shadow:0 2px 12px rgba(0,0,0,.7)">${esc(s.subtitle)}</div>
  </div>`;
  return frame(inner, s.photo);
}

function slideText(s) {
  const tag = s.tag ? `${s.tag} · ` : '';
  const inner = lowerBlock(
    braceTitle(tag + s.title, 'center') +
    (s.lead ? leadLine(s.lead) : '') +
    bodyBlock(s.body)
  );
  return frame(inner, s.photo);
}

function slideRecap(s) {
  const chain = arr => (arr || []).join('  ➡️  ');
  const inner = lowerBlock(
    braceTitle(s.title, 'center') +
    `<div style="margin-top:34px">
       <div style="font-family:${BODY_FF};color:${GOLD};font-size:34px;font-weight:800;text-shadow:0 2px 10px rgba(0,0,0,.7)">DAY1</div>
       <div style="font-family:${BODY_FF};color:#fff;font-size:32px;font-weight:600;line-height:1.5;text-shadow:0 2px 10px rgba(0,0,0,.7);margin-top:6px">${esc(chain(s.day1))}</div>
       <div style="font-family:${BODY_FF};color:${GOLD};font-size:34px;font-weight:800;text-shadow:0 2px 10px rgba(0,0,0,.7);margin-top:24px">DAY2</div>
       <div style="font-family:${BODY_FF};color:#fff;font-size:32px;font-weight:600;line-height:1.5;text-shadow:0 2px 10px rgba(0,0,0,.7);margin-top:6px">${esc(chain(s.day2))}</div>
     </div>` +
    (s.tip ? `<div style="font-family:${BODY_FF};color:#fff;font-size:31px;font-weight:500;line-height:1.5;text-shadow:0 2px 10px rgba(0,0,0,.7);margin-top:30px">${esc(s.tip)}</div>` : '')
  );
  return frame(inner, s.photo);
}

function slideClosing(s) {
  const inner = lowerBlock(
    braceTitle(s.title, 'center') +
    bodyBlock(s.body) +
    (s.cta ? `<div style="font-family:${BODY_FF};color:${GOLD};font-size:34px;font-weight:800;line-height:1.5;text-shadow:0 2px 12px rgba(0,0,0,.7);margin-top:30px">${esc(s.cta)}</div>` : '')
  );
  return frame(inner, s.photo);
}

function renderSlide(s) {
  switch (s.type) {
    case 'cover': return slideCover(s);
    case 'recap': return slideRecap(s);
    case 'closing': return slideClosing(s);
    case 'thesis':
    case 'segment':
    default: return slideText(s);
  }
}

function buildHtml2({ data, fontBase, sansPath, emojiPath }) {
  const pages = (data.slides || []).map(renderSlide).join('\n');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:'WenDaoCover';src:url('${fontBase}/WenDaoChaoHei-2.ttf') format('truetype');font-weight:100 900;}
  @font-face{font-family:'SansSC';src:url('${sansPath}') format('truetype');font-weight:100 900;}
  ${emojiPath ? `@font-face{font-family:'Emoji';src:url('${emojiPath}') format('truetype');}` : ''}
  *{margin:0;padding:0;box-sizing:border-box;}
  #wrap{display:flex;flex-direction:row;}
  </style></head><body><div id="wrap">${pages}</div></body></html>`;
}

module.exports = { buildHtml2, W, H };
