// Draws the cover of the music, ui-ideas/audio/cover.png, 512 pixels square. The music player on a phone, player.js, gives it
// to the Media Session API, so the phone's lock screen and its controls of the music show it beside the song's name.
// It is the emblem of the music panel, as the panel shows a song that plays: the ring with fine marks and four small stars, and
// in its disc of sky, 72 gold rays around a small star, longest up, down, left, and right, so they make a star with four
// points. Behind it is the night sky of the blocker view, with faint stars. It is drawn as SVG, and Google Chrome, without a
// window, turns the SVG into the PNG. Run it after changing the drawing:
//   node library/cover.js
// It looks for Chrome where macOS installs it, or at the path in the CHROME environment variable.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'ui-ideas', 'audio', 'cover.png');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SIZE = 512;

const f = n => +n.toFixed(2);
function rnd(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
const sparkle = (x, y, r) => { const k = r * .28; return `M${f(x)} ${f(y - r)}L${f(x + k)} ${f(y - k)}L${f(x + r)} ${f(y)}L${f(x + k)} ${f(y + k)}L${f(x)} ${f(y + r)}L${f(x - k)} ${f(y + k)}L${f(x - r)} ${f(y)}L${f(x - k)} ${f(y - k)}Z`; };

// The faint stars of the sky, away from the emblem's middle.
const r = rnd(7);
let stars = '';
for (let i = 0; i < 90; i++) {
  const x = r() * SIZE, y = r() * SIZE, size = .4 + Math.pow(r(), 3) * 1.4;
  if (Math.hypot(x - SIZE / 2, y - SIZE / 2) < 190) continue;
  stars += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(size)}" fill="${r() < .2 ? '#cfe0ff' : '#fff4dc'}" opacity="${f(.25 + r() * .6)}"/>`;
}

// The emblem, in the units of the panel's emblem, from -66 to 66, as sky.js draws it.
const marks = Array.from({ length: 72 }, (_, i) => {
  const a = i / 72 * Math.PI * 2, r1 = i % 6 ? 57 : 52.5;
  return `<line x1="${f(Math.cos(a) * r1)}" y1="${f(Math.sin(a) * r1)}" x2="${f(Math.cos(a) * 60)}" y2="${f(Math.sin(a) * 60)}"/>`;
}).join('');
const four = [0, 1, 2, 3].map(i => { const a = (i + .5) * Math.PI / 2; return `<path d="${sparkle(Math.cos(a) * 64, Math.sin(a) * 64, 3.4)}"/>`; }).join('');
// Each ray's length, as a song that plays draws it: low bands, up, down, left, and right, are loud, and the bands get higher and
// quieter toward the diagonals, with a little unevenness, as music has.
const rays = Array.from({ length: 72 }, (_, k) => {
  const u = (k / 72 * 4) % 1, high = u < .5 ? u * 2 : (1 - u) * 2, v = .14 + .8 * Math.pow(1 - high, 1.6) * (.86 + .14 * Math.sin(k * 2.3));
  const a = k / 72 * Math.PI * 2 - Math.PI / 2, r0 = 12, len = 1.5 + v * 30;
  return `<line x1="${f(Math.cos(a) * r0)}" y1="${f(Math.sin(a) * r0)}" x2="${f(Math.cos(a) * (r0 + len))}" y2="${f(Math.sin(a) * (r0 + len))}" stroke-opacity="${f(.22 + .78 * v)}"/>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <radialGradient id="sky" cx="50%" cy="46%" r="72%"><stop offset="0" stop-color="#0e1636"/><stop offset=".55" stop-color="#070b1c"/><stop offset="1" stop-color="#020308"/></radialGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#e6c477" stop-opacity=".2"/><stop offset=".5" stop-color="#e6c477" stop-opacity=".05"/><stop offset="1" stop-color="#e6c477" stop-opacity="0"/></radialGradient>
    <radialGradient id="violet" cx="50%" cy="100%" r="70%"><stop offset="0" stop-color="#5440aa" stop-opacity=".22"/><stop offset="1" stop-color="#5440aa" stop-opacity="0"/></radialGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#sky)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#violet)"/>
  ${stars}
  <circle cx="256" cy="256" r="236" fill="url(#glow)"/>
  <g transform="translate(256 256) scale(3.05)">
    <circle r="64" fill="none" stroke="rgba(230,196,119,.2)" stroke-width=".5" stroke-dasharray="1 3.5"/>
    <circle r="60" fill="none" stroke="rgba(230,196,119,.55)" stroke-width=".55"/>
    <g stroke="rgba(230,196,119,.5)" stroke-width=".5">${marks}</g>
    <g fill="#fbe7b0" filter="url(#soft)">${four}</g>
    <circle r="47" fill="rgba(5,7,18,.86)" stroke="rgba(230,196,119,.34)" stroke-width=".5" stroke-dasharray="2 3"/>
    <g stroke="#fbe7b0" stroke-width="1.1" stroke-linecap="round" filter="url(#soft)">${rays}</g>
    <circle r="9.5" fill="none" stroke="rgba(251,231,176,.35)" stroke-width=".7"/>
    <path d="${sparkle(0, 0, 8)}" fill="#fbe7b0" filter="url(#soft)"/>
    <circle r="1.3" fill="#fff"/>
  </g>
</svg>`;

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cover-'));
const page = path.join(dir, 'cover.html');
fs.writeFileSync(page, `<!doctype html><html><body style="margin:0;background:#020308">${svg}</body></html>`);
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${SIZE},${SIZE}`, `--screenshot=${OUT}`, `file://${page}`], { stdio: 'ignore' });
fs.rmSync(dir, { recursive: true, force: true });
console.log(`Wrote ui-ideas/audio/cover.png, ${Math.round(fs.statSync(OUT).size / 1024)} kB.`);
