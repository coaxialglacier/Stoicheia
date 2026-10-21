// Builds the site that GitHub Pages serves at wardensoftheswift.com, in _site/: the three pages of the star theme
// in ui-ideas/, sky.js, sky.css, heavens.js, skilltree.js, galaxy.js, aurora.js, figure-art.js, and you.js, and the three scripts
// the pages load, and the sound: sound.html, which every page moves into, sound.js, loading.js, which shows the loading view
// of sound.html until the first song has loaded, blocker.js, which shows its view in place of the pages on a phone, on a tablet,
// and in a browser that is not Chrome, and the songs. The archived pages in
// ui-ideas/archive/, the pictures in ui-ideas/art/ that library/trace.js traces, and place.js are not published.
// Run node library/build.js first, so that library-data.js has the entries of concepts/ and the ids of known.json:
//   node library/build.js && node library/site.js
// .github/workflows/pages.yml runs both on each push to main, and publishes _site/.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PAGES = path.join(ROOT, 'ui-ideas');
const OUT = path.join(ROOT, '_site');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'audio'), { recursive: true });
// index.html is Home, so the site's address with no page name opens it, and moves into sound.html.
for (const file of ['index.html', 'expand.html', 'page.html', 'sound.html', 'sky.js', 'sky.css', 'sound.js', 'loading.js', 'blocker.js', 'heavens.js', 'title.js', 'skilltree.js', 'galaxy.js', 'aurora.js', 'figure-art.js', 'library-data.js', 'library.js', 'pages.js', 'you.js', 'audio/songs.js']) {
  fs.copyFileSync(path.join(PAGES, file), path.join(OUT, file));
}
// The songs that audio/songs.js lists, from music/, which git keeps, named as sound.js asks for them, such as
// audio/starlit-hush.mp3. The site is served over https, so it needs none of the base64 copies for a file:// address.
const SONGS = vm.runInNewContext(fs.readFileSync(path.join(PAGES, 'audio', 'songs.js'), 'utf8') + '\nSONGS');
for (const song of SONGS) fs.copyFileSync(path.join(ROOT, 'music', song.source), path.join(OUT, 'audio', song.file + '.mp3'));
// Home was home.html until 2026-10-20, so a link to home.html still opens Home.
fs.copyFileSync(path.join(OUT, 'index.html'), path.join(OUT, 'home.html'));

console.log(`Wrote _site/: ${fs.readdirSync(OUT).sort().join(', ')}, and ${SONGS.length} songs in audio/.`);
