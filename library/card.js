// Draws the picture that a link to the site shows when it is sent in a message or posted, ui-ideas/card.jpg, 1200 by 630
// pixels, and the site's icons, ui-ideas/apple-touch-icon.png, 180 pixels square, and ui-ideas/icon.png, 192 pixels square.
// The user asked on 2026-10-23 that a link to wardensoftheswift.com, sent in Messages, show more than its name and address.
// Messages, and most apps that show a link, read the page's Open Graph tags, which library/site.js adds to each page of the
// site: its name, a sentence about it, and this picture.
// The picture is the night sky of Home, as a reader sees it: the title and the three constellations, without the top bar.
// Google Chrome, run without a window, opens Home in a window 1440 by 756 pixels, the same shape as the picture, waits for the
// sky to come down into place, and saves it at 1200 by 630. Home is opened inside a frame of a small page of this script's
// own, so it does not move into sound.html, and so no loading view and no music come first. A small server of this script
// serves ui-ideas/ for it. The icons are the cover of the music, ui-ideas/audio/cover.png, which library/cover.js draws, made
// smaller with sips, which macOS has. Run it after changing how the night sky looks, or the cover:
//   node library/card.js
// It looks for Chrome where macOS installs it, or at the path in the CHROME environment variable.

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PAGES = path.join(ROOT, 'ui-ideas');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const W = 1200, H = 630, LAYOUT = 1440;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const FRAME = '<!doctype html><html><body style="margin:0;background:#05070f"><iframe src="index.html" style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe></body></html>';
const wait = ms => new Promise(done => setTimeout(done, ms));

async function main() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (rel === '/card-frame.html') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(FRAME); }
    const file = path.join(PAGES, rel === '/' ? 'index.html' : rel);
    if (!file.startsWith(PAGES + path.sep)) { res.writeHead(404); return res.end(); }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  const site = `http://127.0.0.1:${server.address().port}`;

  // Chrome writes the port of its DevTools Protocol into DevToolsActivePort in its profile folder. SwiftShader draws WebGL,
  // for the nebula, on the processor, since Chrome without a window has no graphics card.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'card-'));
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--hide-scrollbars', '--mute-audio',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
  try {
    const portFile = path.join(dir, 'DevToolsActivePort');
    for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await wait(100);
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
    await new Promise((done, fail) => { ws.onopen = done; ws.onerror = fail; });
    let id = 0;
    const calls = {};
    ws.onmessage = e => { const m = JSON.parse(e.data); if (calls[m.id]) { calls[m.id](m); delete calls[m.id]; } };
    const send = (method, params = {}) => new Promise((done, fail) => {
      calls[++id] = m => m.error ? fail(new Error(`${method}: ${m.error.message}`)) : done(m.result);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Emulation.setDeviceMetricsOverride', { width: LAYOUT, height: Math.round(LAYOUT * H / W), deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `${site}/card-frame.html` });
    // Home arrives 1.5 seconds after it opens, when no sound.html answers it, and its sky comes down over 3.2 seconds, while
    // its names and drawings fade in. The picture is taken once every animation that has an end has ended, and at most after
    // 40 seconds. SwiftShader is slow, so this can take longer than in a browser with a graphics card.
    await wait(5000);
    const busy = `(() => { const d = document.querySelector('iframe').contentDocument; return d.getAnimations().filter(a => a.playState === 'running' && isFinite(a.effect.getComputedTiming().endTime)).length; })()`;
    for (let t = 0; t < 35000 && (await send('Runtime.evaluate', { expression: busy, returnByValue: true })).result.value; t += 500) await wait(500);
    await wait(2000);
    // The picture is the same for everyone who gets the link, so it leaves out what this computer's reader knows: under each
    // constellation's name, the number of ideas known, the bar, and the study in progress. The areas of each constellation stay.
    const HIDE = 'header,.con-skill,.con-count,.con-study,.lay.label path,.lay.label rect{display:none!important}';
    await send('Runtime.evaluate', { expression: `(() => { const d = document.querySelector('iframe').contentDocument; const s = d.createElement('style'); s.textContent = ${JSON.stringify(HIDE)}; d.head.appendChild(s); })()` });
    await wait(1200);
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: LAYOUT, height: Math.round(LAYOUT * H / W), scale: W / LAYOUT } });
    fs.writeFileSync(path.join(PAGES, 'card.jpg'), Buffer.from(shot.data, 'base64'));
    ws.close();
  } finally {
    // Chrome writes to its profile folder until it has exited, so the folder is removed after that.
    const exited = new Promise(done => chrome.exitCode !== null ? done() : chrome.once('exit', done));
    chrome.kill();
    await exited;
    server.close();
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }

  const cover = path.join(PAGES, 'audio', 'cover.png');
  for (const [name, size] of [['apple-touch-icon.png', 180], ['icon.png', 192]]) {
    execFileSync('sips', ['-z', String(size), String(size), cover, '--out', path.join(PAGES, name)], { stdio: 'ignore' });
  }
  const kb = f => Math.round(fs.statSync(path.join(PAGES, f)).size / 1024);
  console.log(`Wrote ui-ideas/card.jpg, ${kb('card.jpg')} kB, ui-ideas/apple-touch-icon.png, ${kb('apple-touch-icon.png')} kB, and ui-ideas/icon.png, ${kb('icon.png')} kB.`);
}

main().catch(err => { console.error(err); process.exit(1); });
