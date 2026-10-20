// Builds the site that GitHub Pages serves at stoicheia.jacklewissimmons.com, in _site/: the three pages of the star theme
// in ui-ideas/, sky.js and sky.css, and the three scripts the pages load. The archived pages in ui-ideas/archive/ are not published.
// Run node library/build.js first, so that library-data.js has the entries of concepts/ and the ids of known.json:
//   node library/build.js && node library/site.js
// .github/workflows/pages.yml runs both on each push to main, and publishes _site/.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES = path.join(ROOT, 'ui-ideas');
const OUT = path.join(ROOT, '_site');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
// index.html is Home, so the site's address with no page name opens it.
for (const file of ['index.html', 'expand.html', 'page.html', 'sky.js', 'sky.css', 'library-data.js', 'library.js', 'pages.js']) {
  fs.copyFileSync(path.join(PAGES, file), path.join(OUT, file));
}
// Home was home.html until 2026-10-20, so a link to home.html still opens Home.
fs.copyFileSync(path.join(OUT, 'index.html'), path.join(OUT, 'home.html'));

console.log(`Wrote _site/: ${fs.readdirSync(OUT).sort().join(', ')}.`);
