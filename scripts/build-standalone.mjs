/* Builds standalone.html — a single self-contained copy of the site
   (CSS + data + JS inlined). Use it for sharing, embedding or offline use;
   index.html + data.js + app.js + styles.css remain the maintainable source.

   Usage:  node scripts/build-standalone.mjs            */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

let html = read('index.html');
const css = read('styles.css');
const data = read('data.js');
const app = read('app.js');

const stamp = new Date().toISOString().slice(0, 10);
const block =
  '<style>\n' + css + '\n</style>\n' +
  '<script>\n' + data + '\n</script>\n' +
  '<script>\n' + app + '\n</script>\n';

html = html
  .replace('<link rel="stylesheet" href="styles.css">', '<!-- styles, data and app are inlined by scripts/build-standalone.mjs on ' + stamp + ' -->')
  /* replacement must be a function: `$$` in the payload would otherwise be
     interpreted as a replacement pattern and collapsed to `$` */
  .replace('<script src="data.js"></script>\n<script src="app.js"></script>', () => block);

if (html.includes('src="data.js"') || html.includes('href="styles.css"')) {
  console.error('build-standalone: source markers not found, index.html layout changed?');
  process.exit(1);
}

fs.writeFileSync(path.join(root, 'standalone.html'), html);
console.log('standalone.html written (' + (html.length / 1024).toFixed(0) + ' KB), build ' + stamp);
