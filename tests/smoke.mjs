/* Smoke test: loads the site in jsdom over real HTTP and exercises the UI.
   Needs jsdom:  npm i jsdom --no-save   (run from the project root)
   Then:         python3 -m http.server 8931 &   &&   node tests/smoke.mjs      */
import { JSDOM, VirtualConsole } from 'jsdom';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const PORT = process.env.PORT || 8931;
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + (e.stack || e.message)));
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

const dom = await JSDOM.fromURL('http://127.0.0.1:' + PORT + '/index.html', {
  runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(win) {
    if (typeof win.matchMedia !== 'function') {
      win.matchMedia = q => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null });
    }
  },
});
const w = dom.window, d = w.document;
w.addEventListener('error', e => errors.push('window.error: ' + (e.error?.stack || e.message)));
await new Promise(r => w.addEventListener('load', r, { once: true }));
await new Promise(r => setTimeout(r, 400));

const q = s => d.querySelectorAll(s).length;
const counts = {
  headers: q('.hdr'), kpi: q('.kpi'), categories: q('.cat'),
  tableRows: q('#tbl tbody tr'), tableCols: q('#tbl thead th'),
  scatterPoints: q('#scatter circle.pt'),
  arenaBars: q('#arenaChart .hbar-row'), benchRects: q('#benchChart rect'),
  compareCards: q('#cmpCards .cmp-card'), radarPaths: q('#cmpRadar path'),
  calcRows: q('#calc .cost-row'), agentRows: q('#agentChart .hbar-row'),
  providerBars: q('#provChart .hbar-tr'), timeline: q('.tl-item'),
  subscriptions: q('.sub'), sources: q('.src-i'), caveats: q('.cav li'),
  icons: q('svg[aria-hidden="true"]'),
  emptyIcons: [...d.querySelectorAll('svg')].filter(s => !s.children.length).length,
  navLinks: q('.nav a'),
  gpt55ProVisible: [...d.querySelectorAll('#tbl .mname a')].some(a => a.textContent === 'GPT-5.5 Pro'),
};

const click = n => n.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const setSel = (n, v) => { n.value = v; n.dispatchEvent(new w.Event('change', { bubbles: true })); };
const inter = [];
const thByText = t => [...d.querySelectorAll('#tbl thead th')].find(x => x.textContent.trim().startsWith(t));

click(thByText('Смеш.').querySelector('button'));
inter.push({ t: 'sort blended asc', first: d.querySelector('#tbl tbody tr .mname a')?.textContent, ariaSort: thByText('Смеш.')?.getAttribute('aria-sort') });
click(thByText('Смеш.').querySelector('button'));
inter.push({ t: 'sort blended desc', first: d.querySelector('#tbl tbody tr .mname a')?.textContent });
click(thByText('Arena').querySelector('button'));
inter.push({ t: 'sort arena desc', first: d.querySelector('#tbl tbody tr .mname a')?.textContent });

const inp = d.querySelector('#q');
inp.value = 'gemini'; inp.dispatchEvent(new w.Event('input', { bubbles: true }));
await new Promise(r => setTimeout(r, 220));
inter.push({ t: 'search gemini', rows: q('#tbl tbody tr') });
click(d.querySelector('.search .clr')); await new Promise(r => setTimeout(r, 220));
inter.push({ t: 'search cleared', rows: q('#tbl tbody tr') });

setSel(d.querySelector('#licSel'), 'open'); inter.push({ t: 'license=open', rows: q('#tbl tbody tr') });
setSel(d.querySelector('#ctxSel'), '1m'); inter.push({ t: '+ctx>=1M', rows: q('#tbl tbody tr') });
setSel(d.querySelector('#labSel'), 'Anthropic'); inter.push({ t: '+lab=Anthropic (empty expected)', rows: q('#tbl tbody tr') });
click(d.querySelector('#resetBtn')); inter.push({ t: 'reset', rows: q('#tbl tbody tr') });
click([...d.querySelectorAll('#tierChips .chip')].find(c => c.dataset.tier === 'budget'));
inter.push({ t: 'tier=budget', rows: q('#tbl tbody tr') });
click(d.querySelector('#resetBtn'));
const pr = d.querySelector('#priceR'); pr.value = '1'; pr.dispatchEvent(new w.Event('input', { bubbles: true }));
inter.push({ t: 'price<=1', rows: q('#tbl tbody tr'), label: d.querySelector('#priceV').textContent });
click(d.querySelector('#resetBtn'));

const cb = [...d.querySelectorAll('#tbl tbody tr .cbx')];
const before = q('#cmpCards .cmp-card');
const checkedOne = cb.find(c => c.checked);
checkedOne.checked = false; checkedOne.dispatchEvent(new w.Event('change', { bubbles: true }));
inter.push({ t: 'uncheck model', before, after: q('#cmpCards .cmp-card'), bar: d.querySelector('#cmpBar b')?.textContent, summary: d.querySelector('#cmpSummary').textContent.slice(0, 110) });
const unchecked = cb.filter(c => !c.checked)[0];
unchecked.checked = true; unchecked.dispatchEvent(new w.Event('change', { bubbles: true }));
inter.push({ t: 're-check model', cards: q('#cmpCards .cmp-card') });
[5, 6, 7].forEach(i => { cb[i].checked = true; cb[i].dispatchEvent(new w.Event('change', { bubbles: true })); });
inter.push({ t: 'compare at cap', cards: q('#cmpCards .cmp-card'), bar: d.querySelector('#cmpBar b')?.textContent, radarPaths: q('#cmpRadar path') });
click(d.querySelector('#scatter circle.pt'));
inter.push({ t: 'scatter click respects cap', cards: q('#cmpCards .cmp-card') });

[...d.querySelectorAll('#benchmarks .seg button')].forEach(b => click(b));
inter.push({ t: 'bench sweep', rects: q('#benchChart rect') });
click([...d.querySelectorAll('#benchmarks .seg button')][0]);
const seg1 = d.querySelectorAll('.panel-hd .seg')[0];
[...seg1.querySelectorAll('button')].forEach(b => click(b));
inter.push({ t: 'arena/aa toggle', bars: q('#arenaChart .hbar-row') });
click([...seg1.querySelectorAll('button')][0]);

const rr = d.querySelectorAll('#calc input[type=range]');
rr[0].value = '500'; rr[0].dispatchEvent(new w.Event('input', { bubbles: true }));
rr[2].value = '90'; rr[2].dispatchEvent(new w.Event('input', { bubbles: true }));
inter.push({ t: 'calculator', top3: [...d.querySelectorAll('#calc .cost-row')].slice(1, 4).map(x => x.textContent.replace(/\s+/g, ' ').trim()), labels: [...d.querySelectorAll('#calc .rv')].map(x => x.textContent.trim()) });

click(d.querySelector('#themeBtn'));
inter.push({ t: 'theme', theme: d.documentElement.getAttribute('data-theme'), stored: (() => { try { return w.localStorage.getItem('ami-theme'); } catch (e) { return 'n/a'; } })() });
click(d.querySelector('#themeBtn'));

inter.push({
  t: 'a11y',
  unlabeledButtons: [...d.querySelectorAll('button')].filter(b => !b.textContent.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title')).length,
  regionLabel: d.querySelector('.table-scroll')?.getAttribute('aria-label')?.slice(0, 30),
  sortedHeaders: q('#tbl thead th[aria-sort]'),
  checkboxesLabeled: [...d.querySelectorAll('.cbx')].every(c => c.getAttribute('aria-label')),
  focusableChartPoints: q('#scatter circle.pt[tabindex="0"]'),
  skipLink: !!d.querySelector('.skip'),
  bodyPadTop: w.getComputedStyle(d.body).paddingTop,
  lang: d.documentElement.lang,
});

console.log(JSON.stringify({ counts, inter, errors }, null, 1));
w.close(); process.exit(errors.length ? 1 : 0);
