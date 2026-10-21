// The view that sound.html shows, in place of the pages, on a phone, on a tablet, and in a browser that is not Google Chrome.
// The user asked on 2026-10-21 that Wardens of the Swift open only on a computer, with a large screen, a keyboard, and a mouse
// or a trackpad, and only in Chrome, the browser it is built and tested in. So on any other device or browser, sound.html loads
// no page in its iframe, shows no loading view, and plays no sound. It shows only this view: the title, an emblem, a sentence
// that says what the reader needs, the site's address, and a button that shares or copies the link, so the reader can open it
// where it works. A phone or a tablet is told to use a computer, and a computer in another browser is told to use Chrome.
// sound.html loads this script in its head, before anything else draws, so the loading view never shows there.
// Blocker.on is true when the view shows, and loading.js and sound.html read it. Blocker.why is 'device' or 'browser'. The view
// is built when the page has loaded, because it uses Title from title.js. Behind it is the Milky Way of galaxy.js, which this
// script loads only here.

const Blocker = (() => {
  const ua = navigator.userAgent || '', brands = (navigator.userAgentData && navigator.userAgentData.brands) || null;
  // A phone or a tablet is a device whose browser says it is mobile; whose browser names an iPhone, an iPad, an iPod, an
  // Android device, or another mobile system; an iPad that asks for the desktop site, which names a Mac, though no Mac has a
  // touch screen; or a device whose main input is touch, with no pointer that can hover. A laptop with a touch screen has a
  // trackpad as its main input, so it is not one.
  const handheld = !!(navigator.userAgentData && navigator.userAgentData.mobile)
    || /iPhone|iPad|iPod|Android|Mobi|Silk|Kindle|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
    || matchMedia('(pointer: coarse) and (hover: none)').matches;
  // Chrome names itself in navigator.userAgentData.brands as "Google Chrome". Edge, Brave, Opera, and other browsers made from
  // Chromium name themselves there instead. A browser without userAgentData, such as Safari or Firefox, or Chrome on a page
  // that is not secure, is Chrome when its user agent names Chrome, its vendor is Google, and it names no other browser made
  // from Chromium. Brave's user agent is the same as Chrome's, so navigator.brave tells it apart.
  // The browser pane of the Claude app is Chromium, as Chrome is, and draws the pages as Chrome does. It is let through too,
  // so that Claude can check the pages while they are built. Its user agent names Claude.
  const claude = /\bClaude\/\d/.test(ua);
  const chrome = claude || (brands
    ? brands.some(b => b.brand === 'Google Chrome')
    : /\bChrome\/\d/.test(ua) && navigator.vendor === 'Google Inc.' && !navigator.brave
      && !/\b(Edg|EdgA|OPR|Opera|Vivaldi|YaBrowser|SamsungBrowser|Electron)\//.test(ua));
  const why = handheld ? 'device' : chrome ? null : 'browser';
  if (!why) return { on: false, why };
  // The class blocked on the root element hides the iframe and the loading view, and shows this view, from the first paint.
  document.documentElement.classList.add('blocked');

  // What the view says, for each reason. get is a link to download Chrome.
  const SAYS = {
    device: { head: 'Made for a computer', text: 'Wardens of the Swift needs a large screen, a keyboard, and a mouse or a trackpad. Open it in Google Chrome on a computer to begin.', get: false },
    browser: { head: 'Made for Chrome', text: 'Wardens of the Swift is built and tested in Google Chrome, and opens only there. Open this address in Chrome to begin.', get: true },
  }[why];

  // The emblem: the turning ring of the panels' emblems, around a disc of sky. On a phone or a tablet, the disc shows a computer
  // as a fine gold outline: a screen with a small constellation on it, and a stand. In another browser, it shows the window of a
  // browser: a bar at its top with three dots and a field for the address, and the same constellation in the window. Each has a
  // small star at its top right, as the icons of the header have.
  const f = n => +n.toFixed(2);
  const sparkle = (x, y, r) => `M${f(x)} ${f(y - r)}L${f(x + r * .24)} ${f(y - r * .24)}L${f(x + r)} ${f(y)}L${f(x + r * .24)} ${f(y + r * .24)}L${f(x)} ${f(y + r)}L${f(x - r * .24)} ${f(y + r * .24)}L${f(x - r)} ${f(y)}L${f(x - r * .24)} ${f(y - r * .24)}Z`;
  const marks = Array.from({ length: 72 }, (_, i) => {
    const a = i / 72 * Math.PI * 2, r1 = i % 6 ? 57 : 52.5;
    return `<line x1="${f(Math.cos(a) * r1)}" y1="${f(Math.sin(a) * r1)}" x2="${f(Math.cos(a) * 60)}" y2="${f(Math.sin(a) * 60)}"/>`;
  }).join('');
  const four = [0, 1, 2, 3].map(i => { const a = (i + .5) * Math.PI / 2; return `<path d="${sparkle(Math.cos(a) * 64, Math.sin(a) * 64, 3.4)}"/>`; }).join('');
  // The stars of the constellation, as [x, y, size], and the lines between them, as pairs of stars. They are uneven, as real
  // stars are. dy moves them down into the window of the browser, under its bar.
  const STARS = [[-15, -8, 2.6], [-6, -14.5, 3.4], [4, -6, 2.4], [14.5, -12, 3], [8, 3.5, 2]];
  const EDGES = [[0, 1], [1, 2], [2, 3], [2, 4]];
  const DRAWING = {
    device: { dy: 0, star: [30.5, -27], art: `<rect class="bk-draw" x="-27" y="-23" width="54" height="35" rx="3.2" pathLength="1"/>
      <rect class="bk-glass" x="-23.5" y="-19.5" width="47" height="28" rx="1.6"/>
      <path class="bk-draw" d="M-4.5 12L-6.5 20.5M4.5 12L6.5 20.5M-15 21.5Q0 19.2 15 21.5" pathLength="1"/>` },
    browser: { dy: 6.5, star: [31.5, -24], art: `<rect class="bk-draw" x="-28" y="-20" width="56" height="40" rx="3.5" pathLength="1"/>
      <path class="bk-draw" d="M-28 -11.5H28" pathLength="1"/>
      <rect class="bk-glass" x="-25" y="-8.5" width="50" height="25.5" rx="1.4"/>
      <circle class="bk-dot" cx="-23" cy="-15.7" r="1.2"/><circle class="bk-dot" cx="-19" cy="-15.7" r="1.2"/><circle class="bk-dot" cx="-15" cy="-15.7" r="1.2"/>
      <rect class="bk-bar" x="-9" y="-17.9" width="32" height="4.4" rx="2.2"/>` },
  }[why];
  const at = ([x, y, r]) => [x, y + DRAWING.dy, r];
  const EMBLEM = `<svg viewBox="-66 -66 132 132" aria-hidden="true">
    <g class="bk-ring"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="180s" repeatCount="indefinite"/>
      <circle r="64" class="bk-dots"/><circle r="60" class="bk-rim"/><g class="bk-marks">${marks}</g></g>
    <g class="bk-four"><animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="240s" repeatCount="indefinite"/>${four}</g>
    <circle r="47" class="bk-disc"/>
    <g class="bk-pc">${DRAWING.art}
      ${EDGES.map(([a, b], i) => { const [x1, y1] = at(STARS[a]), [x2, y2] = at(STARS[b]); return `<path class="bk-line" style="--i:${i}" d="M${x1} ${y1}L${x2} ${y2}" pathLength="1"/>`; }).join('')}
      ${STARS.map((s, i) => { const [x, y, r] = at(s); return `<path class="bk-star" style="--i:${i}" d="${sparkle(x, y, r)}"/>`; }).join('')}
      <path class="bk-star" style="--i:5" d="${sparkle(...DRAWING.star, 3.2)}"/>
    </g></svg>`;

  // The link that the button shares or copies. A reader who opened a link to Expand to Parts or to Graph and Page gets that
  // link, and any other reader gets the site's address.
  const asked = new URLSearchParams(location.search).get('page');
  const link = new URL(asked && /^(expand|page)\.html\?[^#]*$/.test(asked) ? asked : '.', location.href).href;

  function build() {
    const box = document.getElementById('blocker');
    const svg = box.querySelector('.bk-title svg');
    svg.setAttribute('viewBox', Title.box.join(' '));
    svg.innerHTML = Title.svg();
    box.querySelector('.bk-emblem').innerHTML = EMBLEM;
    box.querySelector('.ytitle span').textContent = SAYS.head;
    box.querySelector('.bk-text').textContent = SAYS.text;
    box.querySelector('.bk-address').textContent = location.host || 'wardensoftheswift.com';
    if (!SAYS.get) box.querySelector('.bk-get').remove();
    // On a phone or a tablet, the button opens the device's own way to share the link, such as AirDrop, Messages, or Mail, so
    // the reader can send it to their computer. On a computer, it copies the link, to paste into Chrome. A browser that can do
    // neither shows no button, and a click on the address selects it.
    const btn = box.querySelector('.ybtn'), word = btn.querySelector('span');
    const share = why === 'device' && navigator.share;
    if (share) word.textContent = 'Share the link';
    else if (navigator.clipboard) word.textContent = 'Copy the link';
    else btn.remove();
    btn.addEventListener('click', async () => {
      try {
        if (share) await navigator.share({ title: 'Wardens of the Swift', url: link });
        else { await navigator.clipboard.writeText(link); word.textContent = 'Link copied'; setTimeout(() => { word.textContent = 'Copy the link'; }, 2400); }
      } catch (e) {}
    });
    // The Milky Way, as the skill tree shows it, drawn once for each size of the window. Without WebGL, the view keeps the
    // dark sky of its own background.
    const s = document.createElement('script');
    s.src = 'galaxy.js';
    s.onload = () => {
      if (!Galaxy.ok) return;
      const fit = () => { Galaxy.size(0, 0); Galaxy.view(0, 0, 0); };
      fit(); Galaxy.show(true);
      addEventListener('resize', fit);
    };
    document.head.appendChild(s);
  }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', build); else build();
  return { on: true, why };
})();
