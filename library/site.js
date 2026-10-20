// Builds the site that GitHub Pages serves at stoicheia.jacklewissimmons.com, in _site/: the three pages of the star theme
// in ui-ideas/constellation/, sky.js and sky.css, and the three scripts the pages load from ui-ideas/.
// Run node library/build.js first, so that library-data.js has the entries of concepts/ and the ids of known.json:
//   node library/build.js && node library/site.js
// .github/workflows/pages.yml runs both on each push to main, and publishes _site/.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const STAR = path.join(ROOT, 'ui-ideas', 'constellation');
const OUT = path.join(ROOT, '_site');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
// On the site, the pages are in the same folder as the scripts, so each page loads ../library.js as library.js.
for (const page of ['home.html', 'expand.html', 'page.html']) {
  const html = fs.readFileSync(path.join(STAR, page), 'utf8').replace(/src="\.\.\//g, 'src="');
  fs.writeFileSync(path.join(OUT, page), html);
}
// The site's address with no page name opens Home.
fs.copyFileSync(path.join(OUT, 'home.html'), path.join(OUT, 'index.html'));
for (const file of ['sky.js', 'sky.css']) fs.copyFileSync(path.join(STAR, file), path.join(OUT, file));
for (const file of ['library-data.js', 'library.js', 'pages.js']) fs.copyFileSync(path.join(ROOT, 'ui-ideas', file), path.join(OUT, file));

console.log(`Wrote _site/: ${fs.readdirSync(OUT).sort().join(', ')}.`);
