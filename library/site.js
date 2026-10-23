// Builds the site that GitHub Pages serves at wardensoftheswift.com, in _site/: the three pages of the star theme
// in ui-ideas/, sky.js, sky.css, heavens.js, skilltree.js, galaxy.js, aurora.js, figure-art.js, and you.js, and the three scripts
// the pages load, and the sound: sound.html, which every page moves into, sound.js, loading.js, which shows the loading view
// of sound.html until the first song has loaded, blocker.js, which shows its view in place of the pages on a phone, on a tablet,
// and in a browser that is not Chrome, player.js and player.css, the music player that view is on a phone or a tablet, and the
// songs, with the levels and the cover that the player shows. It also adds to the head of each page the tags that a link
// to the site shows when it is sent in a message or posted, and publishes the picture and the icons they name, which
// library/card.js draws. The archived pages in
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
for (const file of ['index.html', 'expand.html', 'page.html', 'sound.html', 'sky.js', 'sky.css', 'sound.js', 'loading.js', 'blocker.js', 'heavens.js', 'title.js', 'skilltree.js', 'galaxy.js', 'aurora.js', 'figure-art.js', 'library-data.js', 'library.js', 'pages.js', 'you.js', 'player.js', 'player.css', 'audio/songs.js', 'audio/cover.png', 'card.jpg', 'icon.png', 'apple-touch-icon.png']) {
  fs.copyFileSync(path.join(PAGES, file), path.join(OUT, file));
}
// The songs that audio/songs.js lists, from music/, which git keeps, named as sound.js asks for them, such as
// audio/starlit-hush.mp3, and each song's levels, which git keeps too, such as audio/starlit-hush.levels. The site is served
// over https, so it needs none of the base64 copies for a file:// address.
const SONGS = vm.runInNewContext(fs.readFileSync(path.join(PAGES, 'audio', 'songs.js'), 'utf8') + '\nSONGS');
for (const song of SONGS) {
  fs.copyFileSync(path.join(ROOT, 'music', song.source), path.join(OUT, 'audio', song.file + '.mp3'));
  fs.copyFileSync(path.join(PAGES, 'audio', song.file + '.levels'), path.join(OUT, 'audio', song.file + '.levels'));
}
// The tags that a link to the site shows when it is sent in a message or posted. Messages on an iPhone or a Mac, Slack,
// Discord, X, and Facebook read the Open Graph tags: the site's name, a sentence about it, and a picture, card.jpg, the night
// sky of Home, 1200 by 630 pixels, whose address must be whole. Messages also opens the page and runs its scripts, so Home moves
// into sound.html first, and every page has the same tags. An icon shows beside the name where there is no picture, on a
// phone's home screen, and in a browser's tab.
const SITE = 'https://wardensoftheswift.com/';
const ABOUT = 'A game for learning Swift and software engineering. Each idea is a star on a skill tree, taught from the smallest parts it is made of.';
const HEAD = [
  `<meta name="description" content="${ABOUT}">`,
  '<meta property="og:type" content="website">',
  '<meta property="og:site_name" content="Wardens of the Swift">',
  '<meta property="og:title" content="Wardens of the Swift">',
  `<meta property="og:description" content="${ABOUT}">`,
  `<meta property="og:image" content="${SITE}card.jpg">`,
  '<meta property="og:image:type" content="image/jpeg">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  '<meta property="og:image:alt" content="The title Wardens of the Swift over a night sky with three constellations: Architecture, Language, and Algorithms.">',
  '<meta name="twitter:card" content="summary_large_image">',
  '<link rel="icon" type="image/png" sizes="192x192" href="icon.png">',
  '<link rel="apple-touch-icon" href="apple-touch-icon.png">',
].join('\n');
for (const page of ['index.html', 'expand.html', 'page.html', 'sound.html']) {
  const file = path.join(OUT, page), html = fs.readFileSync(file, 'utf8');
  if (!html.includes('</title>')) throw new Error(`${page} has no title, after which the tags of a link go`);
  fs.writeFileSync(file, html.replace('</title>', '</title>\n' + HEAD));
}
// Home was home.html until 2026-10-20, so a link to home.html still opens Home.
fs.copyFileSync(path.join(OUT, 'index.html'), path.join(OUT, 'home.html'));

console.log(`Wrote _site/: ${fs.readdirSync(OUT).sort().join(', ')}, and ${SONGS.length} songs in audio/.`);
