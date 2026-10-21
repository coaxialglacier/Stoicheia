// The loading view of sound.html. When the site opens, its first song takes a few seconds to load. So sound.html shows this
// view over the page in its iframe, and the reader goes into the page only after the song has loaded and played for 5 seconds.
// The user asked for it on 2026-10-21.
//
// While the song loads, the stars are found. In the middle of the window is the ring of an astrolabe, with fine marks, and an
// arc inside it that fills as the stars are found. The alidade, the line of an astrolabe that is turned to point at a star,
// goes twice around the ring, and each star appears when the alidade passes it, with a small flash: the brightest fifth of the
// stars the first time around, and the rest the second time. A ring closes on each of the brightest as it is found. As the last,
// faintest stars appear, the faint glow of the Milky Way comes up. The number inside the ring counts the stars found.
// The alidade starts slowly, speeds up, and slows to a stop at the top of the ring, over at least 5 seconds. It never gets ahead
// of the song: until the song has loaded, it goes no further than 80% of the way. When it stops, every star is found.
// A browser lets a page start sound only after the reader clicks or presses a key on it, so when it has not let sound.html start
// sound yet, the view then asks the reader to click. Then the song starts, the ring opens out and fades, and the title, Wardens of the Swift, comes in, with the
// song's name under it. When the song has played for 5 seconds, the stars stretch away from the middle, as in a move between
// pages, the view fades, and the page in the iframe arrives.
// With all sound off, or the music's volume at 0, there is no song to wait for: the stars are found in about 6 seconds, and the
// title shows for 3.5 seconds.
// sound.html calls ready() when the page in the iframe has loaded, and the view waits for that too. onLift is called when the
// view starts to fade, which is when the page should arrive.

const Loading = (() => {
  const box = document.getElementById('loading');
  const canvas = document.getElementById('ldSky'), g = canvas.getContext('2d');
  const countEl = box.querySelector('.ld-count'), headEl = box.querySelector('.ld-head span'), askEl = box.querySelector('.ld-ask');
  const titleEl = box.querySelector('.ld-title'), wtEl = titleEl.querySelector('svg'), songEl = titleEl.querySelector('.ysong');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  const clamp = t => Math.max(0, Math.min(1, t));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const api = { onLift: null, up: () => !lifted, ready: () => { pageReady = true; } };

  // The song to wait for. There is none with all sound off, with the music's volume at 0, or with no songs.
  const music = typeof SONGS !== 'undefined' && SONGS.length > 0 && Sound.settings.on && Sound.settings.musicVol > 0;
  // The first song waits until the stars are found, so that it starts with the title.
  const release = Sound.hold();

  // ---------- The stars ----------
  // The colors of real stars, as [r, g, b], and how often each is picked: blue-white, white, yellow-white, orange, and red.
  const COLORS = [[[200, 218, 255], .2], [[244, 242, 255], .46], [[255, 240, 214], .2], [[255, 210, 160], .11], [[255, 178, 140], .03]];
  // Each star has its place as a share of the window's width (u) and height (v), and its brightness L, from 0 to 1. Most stars
  // are faint, and a few are bright. The stars are sorted from the brightest, and i is a star's place in that order. at is the
  // time it was found, or 0. byColor holds the stars of each color, so the canvas changes its color only five times a frame.
  // There is one star for every 2600 square pixels of the window, from 220 to 800 stars: about 500 in a window 1440 by 900.
  // The user found twice as many cluttered.
  const stars = [];
  const n = Math.round(Math.max(220, Math.min(800, innerWidth * innerHeight / 2600)));
  for (let i = 0; i < n; i++) {
    let c = 0;
    for (let u = Math.random(); c < COLORS.length - 1 && (u -= COLORS[c][1]) > 0;) c++;
    stars.push({ u: Math.random(), v: Math.random(), L: Math.pow(Math.random(), 4.5), c, p: Math.random() * TAU, w: .5 + Math.random(), at: 0 });
  }
  // TURNS is how many times the alidade goes around. turn is the time around that finds a star: the first for the brightest
  // fifth, and the second for the rest.
  const TURNS = 2;
  stars.sort((a, b) => b.L - a.L).forEach((s, i) => { s.i = i; s.turn = i < n * .2 ? 0 : 1; });
  const byColor = COLORS.map((x, c) => stars.filter(s => s.c === c));
  // The brightest 8 stars have four thin rays, and a ring closes on each of the brightest 16 when it is found.
  const RAYS = 8, LOCKS = 16;

  // A star drawn as a small glow: a white core in its color, fading out.
  const sprites = COLORS.map(([[r, gg, b]]) => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, '#fff'); gr.addColorStop(.13, `rgba(${r},${gg},${b},.9)`); gr.addColorStop(.32, `rgba(${r},${gg},${b},.2)`); gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    return c;
  });
  // A ray: thin, bright in the middle, and fading to nothing at both ends.
  const raySprites = COLORS.map(([[r, gg, b]]) => {
    const c = document.createElement('canvas'); c.width = 128; c.height = 8;
    const x = c.getContext('2d'), along = x.createLinearGradient(0, 0, 128, 0), across = x.createLinearGradient(0, 0, 0, 8);
    along.addColorStop(0, `rgba(${r},${gg},${b},0)`); along.addColorStop(.5, `rgba(${r},${gg},${b},.95)`); along.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    x.fillStyle = along; x.fillRect(0, 0, 128, 8);
    across.addColorStop(0, 'rgba(0,0,0,0)'); across.addColorStop(.5, '#000'); across.addColorStop(1, 'rgba(0,0,0,0)');
    x.globalCompositeOperation = 'destination-in'; x.fillStyle = across; x.fillRect(0, 0, 128, 8);
    return c;
  });

  // ---------- Layout ----------
  // The ring is in the middle of the window, a little above its middle, with a radius of 17% of the window's shorter side, from
  // 96 to 150 pixels. A star's when is how far the finding has gone, from 0 to 1, when the alidade passes it on the time around
  // that finds it, and queue holds the stars not found yet in that order. bg is the sky behind the stars, and band is the
  // Milky Way.
  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 120, queue = [], next = 0, bg = null, band = null, tw = 0, th = 0;
  function layout() {
    W = innerWidth; H = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    cx = W / 2; cy = H * .46; R = Math.round(Math.max(96, Math.min(150, Math.min(W, H) * .17)));
    // The title is up to 760 pixels wide, and no taller than 34% of the window.
    const [, , bw, bh] = Title.box;
    tw = Math.min(760, W < 700 ? W - 32 : W * .6, H * .34 * bw / bh); th = tw * bh / bw;
    Object.entries({ '--cy': cy, '--R': R, '--tw': tw, '--th': th }).forEach(([k, v]) => box.style.setProperty(k, v.toFixed(1) + 'px'));
    for (const s of stars) {
      s.x = s.u * W; s.y = s.v * H; s.r = .4 + 1.6 * Math.pow(s.L, .8); s.a = .22 + .78 * Math.sqrt(s.L);
      // The star's angle clockwise from the top of the ring, as a share of a whole turn.
      const a = ((Math.atan2(s.y - cy, s.x - cx) + Math.PI / 2) / TAU % 1 + 1) % 1;
      s.when = (a + s.turn) / TURNS;
    }
    queue = stars.filter(s => !s.at).sort((p, q) => p.when - q.when); next = 0;
    bg = sky(); band = milkyWay();
  }
  // The night sky: deep blue in the middle, nearly black at the edges.
  function sky() {
    const c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height;
    const x = c.getContext('2d'), gr = x.createRadialGradient(cx * dpr, cy * dpr, 0, cx * dpr, cy * dpr, Math.hypot(W, H) * .62 * dpr);
    gr.addColorStop(0, '#0b1230'); gr.addColorStop(.45, '#060918'); gr.addColorStop(1, '#020308');
    x.fillStyle = gr; x.fillRect(0, 0, c.width, c.height);
    return c;
  }
  // The Milky Way, drawn once at half the window's resolution: a pale band from the lower left to the upper right, made of soft
  // clouds of light and a grain of stars too faint to see one by one, with a dark lane of dust along it.
  function milkyWay() {
    const k = .5, c = document.createElement('canvas'); c.width = Math.ceil(W * k); c.height = Math.ceil(H * k);
    const x = c.getContext('2d');
    x.scale(k, k);
    const x0 = -.1 * W, y0 = H, x1 = 1.1 * W, y1 = .18 * H, len = Math.hypot(x1 - x0, y1 - y0), T = Math.max(W, H) * .15;
    x.translate((x0 + x1) / 2, (y0 + y1) / 2); x.rotate(Math.atan2(y1 - y0, x1 - x0));
    const across = x.createLinearGradient(0, -T, 0, T);
    [[0, 'rgba(120,140,210,0)'], [.3, 'rgba(120,140,210,.05)'], [.5, 'rgba(226,218,200,.11)'], [.7, 'rgba(120,140,210,.05)'], [1, 'rgba(120,140,210,0)']].forEach(([o, col]) => across.addColorStop(o, col));
    x.fillStyle = across; x.fillRect(-len / 2, -T, len, T * 2);
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    const blob = (bx, by, r, col) => { const gr = x.createRadialGradient(bx, by, 0, bx, by, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(bx - r, by - r, r * 2, r * 2); };
    for (let i = 0; i < 46; i++) blob((Math.random() - .5) * len, gauss() * T * .45, T * (.18 + Math.random() * .4), 'rgba(232,224,210,.05)');
    for (let i = 0; i < 1600; i++) {
      x.fillStyle = `rgba(236,236,255,${(.08 + Math.random() * .3).toFixed(2)})`;
      x.fillRect((Math.random() - .5) * len, gauss() * T * .6, 1.2, 1.2);
    }
    x.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 60; i++) blob((Math.random() - .5) * len, T * .07 + gauss() * T * .08, T * (.06 + Math.random() * .12), 'rgba(0,0,0,.55)');
    return c;
  }

  // ---------- What happens, in order ----------
  // state is finding, found, asking, starting, titled, or leaving, and since is when it started. f is how far the finding has
  // gone, from 0 to 1, and fv is how fast it goes, in shares of the whole finding each second. FIND is the shortest time the
  // finding takes, in milliseconds, and SPRING sets how closely f follows its aim.
  const t0 = performance.now(), FIND = 5000, SPRING = 3.5;
  let state = 'finding', since = t0, f = 0, fv = 0, found = 0;
  let foundAt = null, titledAt = null, songFrom = 0, pageReady = false, lifted = false, arrived = false, running = true, last = t0;
  function to(next, now) { state = next; since = now; }

  function step(now, dt) {
    if (state === 'finding') {
      // The aim of f follows a smooth curve from 0 to 1 over FIND milliseconds, which starts slowly, speeds up, and slows to a
      // stop. Until the song has loaded, the aim is at most 80% of how much of it has come. f moves toward its aim as a spring
      // that does not swing past it, so it eases in and out even when the song finishes loading late. It never goes back.
      const l = music ? Sound.loading() : { done: true }, p = clamp((now - t0) / FIND);
      const aim = Math.min(p * p * (3 - 2 * p), l.done ? 1 : .8 * l.part);
      fv = Math.max(0, fv + (SPRING * SPRING * (aim - f) - 2 * SPRING * fv) * dt);
      f = Math.min(1, f + fv * dt);
      if (aim === 1 && f > .998) { f = 1; fv = 0; }
      // The alidade finds each star it passes on that star's time around.
      while (next < queue.length && queue[next].when <= f) { queue[next++].at = now; found++; }
      if (f === 1 && found === stars.length) {
        to('found', now); foundAt = now;
        headEl.textContent = 'The stars are found';
        // When the browser does not let the song play yet, the song gets its address now, so that the reader's click can start it.
        if (music && Sound.state() !== 'running') { release(); to('asking', now); askEl.classList.add('on'); box.classList.add('asking'); }
      }
    }
    // When the browser lets the song play, the view says the stars are found for 0.7 seconds, and then the song starts.
    if (state === 'found' && now - since > 700) { release(); to('starting', now); }
    // The song starts. The title comes in when it plays, or after 3 seconds if it does not, such as when the browser still
    // does not let it play.
    if (state === 'starting') {
      const heard = Sound.listen(0);
      if (!music || (heard.playing && heard.at > .02) || now - since > 3000) {
        to('titled', now); titledAt = now;
        const playing = music && heard.playing;
        songFrom = playing ? heard.at : 0;
        songEl.textContent = playing ? heard.title : '';
        titleEl.classList.toggle('quiet', !playing);
        wtEl.setAttribute('viewBox', Title.box.join(' '));
        wtEl.innerHTML = `<g class="wt">${Title.svg()}</g>`;
        box.classList.add('opened'); titleEl.classList.add('on');
      }
    }
    // The song plays for 5 seconds, measured on the song, so a pause, such as in a hidden tab, does not count. With no song, the
    // title shows for 3.5 seconds. Either way it shows for at least 3.5 seconds, and the page in the iframe must have loaded.
    if (state === 'titled') {
      const heard = Sound.listen(0), t = now - since;
      const enough = songFrom || (music && heard.playing) ? heard.at - songFrom >= 5 : t >= (music ? 5000 : 3500);
      if (pageReady && ((enough && t >= 3500) || t > 12000)) {
        to('leaving', now);
        titleEl.classList.add('leave');
        Sound.leave(.5, 1);
      }
    }
    // Leaving: the stars stretch away from the middle for 0.8 seconds. After 0.64 seconds the view starts to fade and the page
    // arrives, and the sound of arriving plays when it does, as a move between pages plays it.
    if (state === 'leaving') {
      const t = now - since;
      if (t > 640 && !lifted) { lifted = true; box.classList.add('lift'); if (api.onLift) api.onLift(); }
      if (t > 900 && !arrived) { arrived = true; Sound.arrive(.5, 1); }
      if (t > 1700) finish();
    }
  }

  // ---------- Drawing ----------
  function frame(now) {
    if (!running) return;
    const dt = Math.min(.05, (now - last) / 1000);
    last = now;
    step(now, dt);
    if (!running) return;
    draw(now);
    const text = found.toLocaleString('en-US');
    if (countEl.textContent !== text) countEl.textContent = text;
    requestAnimationFrame(frame);
  }

  function draw(now) {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    g.drawImage(bg, 0, 0, W, H);
    const mw = clamp((f - .4) / .6);
    if (mw > 0) { g.globalAlpha = mw * mw * .9; g.drawImage(band, 0, 0, W, H); g.globalAlpha = 1; }
    const leaving = state === 'leaving' ? clamp((now - since) / 800) : 0;
    // While the title shows, a soft pool of darker sky lies behind it, so the stars do not show through its letters.
    if (titledAt) {
      const k = ease(clamp((now - titledAt) / 1600)) * (1 - leaving);
      g.save(); g.translate(cx, cy); g.scale(1, .55);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, tw * .62);
      gr.addColorStop(0, `rgba(3,4,12,${(.55 * k).toFixed(3)})`); gr.addColorStop(1, 'rgba(3,4,12,0)');
      g.fillStyle = gr; g.fillRect(-tw, -tw, tw * 2, tw * 2); g.restore();
    }
    drawStars(now, leaving);
    drawRing(now);
    if (leaving) {
      const a = Math.sin(leaving * Math.PI) * .7, gr = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .45);
      gr.addColorStop(0, `rgba(255,246,220,${a.toFixed(3)})`); gr.addColorStop(.4, `rgba(230,196,119,${(a * .3).toFixed(3)})`); gr.addColorStop(1, 'rgba(230,196,119,0)');
      g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }
  }

  // Each found star appears in 0.09 seconds, flashes brighter and larger, and settles over about half a second. The brighter stars
  // twinkle a little. Leaving, each star is drawn as a line that stretches away from the middle.
  function drawStars(now, leaving) {
    const stretch = leaving * leaving * .8;
    g.globalCompositeOperation = 'lighter';
    byColor.forEach((list, c) => {
      const [r, gg, b] = COLORS[c][0];
      g.fillStyle = g.strokeStyle = `rgb(${r},${gg},${b})`;
      for (const s of list) {
        if (!s.at) continue;
        const age = now - s.at, flash = still ? 0 : Math.exp(-age / 200);
        const twinkle = 1 + .12 * Math.sqrt(s.L) * Math.sin(now * .001 * s.w * 2 + s.p);
        const a = Math.min(1, s.a * twinkle * clamp(age / (still ? 600 : 90)) * (1 + 1.6 * flash)), rad = s.r * (1 + 1.3 * flash);
        g.globalAlpha = a;
        if (stretch) {
          g.lineWidth = rad * .9; g.lineCap = 'round'; g.globalAlpha = Math.min(1, a * (1 + leaving));
          g.beginPath(); g.moveTo(s.x, s.y); g.lineTo(s.x + (s.x - cx) * stretch, s.y + (s.y - cy) * stretch); g.stroke();
        } else if (rad < 1.1) g.fillRect(s.x - rad, s.y - rad, rad * 2, rad * 2);
        else g.drawImage(sprites[c], s.x - rad * 3.5, s.y - rad * 3.5, rad * 7, rad * 7);
        if (s.i < RAYS && !stretch) {
          const len = (4 + 13 * s.L) * twinkle * (1 + flash);
          g.globalAlpha = a * .55;
          g.drawImage(raySprites[c], s.x - len, s.y - 1.5, len * 2, 3);
          g.save(); g.translate(s.x, s.y); g.rotate(Math.PI / 2); g.drawImage(raySprites[c], -len, -1.5, len * 2, 3); g.restore();
        }
      }
    });
    // A gold ring with four marks closes on each of the brightest stars as it is found, turning an eighth of a turn.
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    if (still || leaving) return;
    g.lineWidth = .8;
    for (let i = 0; i < LOCKS; i++) {
      const s = stars[i], q = s.at ? (now - s.at) / 700 : 1;
      if (q >= 1) continue;
      const rr = 4 + 15 * (1 - q) * (1 - q), turn = q * Math.PI / 4;
      g.strokeStyle = `rgba(243,220,159,${(.75 * (1 - q)).toFixed(3)})`;
      g.beginPath(); g.arc(s.x, s.y, rr, 0, TAU);
      for (let k = 0; k < 4; k++) {
        const an = turn + k * Math.PI / 2;
        g.moveTo(s.x + Math.cos(an) * (rr + 2), s.y + Math.sin(an) * (rr + 2)); g.lineTo(s.x + Math.cos(an) * (rr + 6), s.y + Math.sin(an) * (rr + 6));
      }
      g.stroke();
    }
  }

  // The astrolabe. A dark disc of sky inside the ring keeps the stars from showing through the count. Outside the ring, the
  // alidade turns, with a faint fan of light behind it that is brighter the faster it turns, and a small diamond on the ring
  // where it points. The ring has 72 marks, a longer one every 30 degrees, and turns once every 200 seconds. Inside it, the arc
  // fills as the stars are found, with a bright star at its end. When the stars are found, a ring of light spreads out from it. When the title comes in, the ring opens out
  // and fades.
  function drawRing(now) {
    const open = titledAt ? ease(clamp((now - titledAt) / 1100)) : 0;
    if (open >= 1) return;
    const alpha = 1 - open, scale = 1 + .45 * open, r = R * scale, gold = a => `rgba(230,196,119,${(a * alpha).toFixed(3)})`;
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    const disc = g.createRadialGradient(cx, cy, 0, cx, cy, r * 1.2);
    disc.addColorStop(0, `rgba(3,4,12,${(.8 * alpha).toFixed(3)})`); disc.addColorStop(.7, `rgba(3,4,12,${(.72 * alpha).toFixed(3)})`); disc.addColorStop(1, 'rgba(3,4,12,0)');
    g.fillStyle = disc; g.beginPath(); g.arc(cx, cy, r * 1.2, 0, TAU); g.fill();

    // The alidade, which comes to rest at the top of the ring when the stars are found, and fades over the next 0.9 seconds.
    const seen = foundAt ? clamp(1 - (now - foundAt) / 900) : 1;
    if (seen > 0 && !still) {
      const th = -Math.PI / 2 + TAU * TURNS * f, far = Math.hypot(W, H), from = r + 22, trail = .6, speed = clamp(fv * TAU * TURNS / 3.5);
      if (g.createConicGradient && speed > .01) {
        const fan = g.createConicGradient(th - trail, cx, cy);
        fan.addColorStop(0, 'rgba(230,196,119,0)'); fan.addColorStop(trail / TAU, `rgba(230,196,119,${(.05 * speed * seen).toFixed(3)})`); fan.addColorStop(trail / TAU + .0005, 'rgba(230,196,119,0)');
        g.fillStyle = fan; g.beginPath(); g.arc(cx, cy, far, 0, TAU); g.arc(cx, cy, from, 0, TAU, true); g.fill();
      }
      const ux = Math.cos(th), uy = Math.sin(th), line = g.createLinearGradient(cx + ux * from, cy + uy * from, cx + ux * far * .7, cy + uy * far * .7);
      line.addColorStop(0, `rgba(251,231,176,${(.6 * seen).toFixed(3)})`); line.addColorStop(1, 'rgba(251,231,176,0)');
      g.strokeStyle = line; g.lineWidth = 1; g.beginPath(); g.moveTo(cx + ux * from, cy + uy * from); g.lineTo(cx + ux * far, cy + uy * far); g.stroke();
      const dx = cx + ux * (r + 22), dy = cy + uy * (r + 22), px = -uy, py = ux;
      g.fillStyle = `rgba(251,231,176,${(.9 * seen).toFixed(3)})`;
      g.beginPath(); g.moveTo(dx + ux * 5, dy + uy * 5); g.lineTo(dx + px * 2.6, dy + py * 2.6); g.lineTo(dx - ux * 5, dy - uy * 5); g.lineTo(dx - px * 2.6, dy - py * 2.6); g.fill();
    }

    g.lineWidth = 1;
    [[r, .45], [r - 9 * scale, .13], [r + 16 * scale, .12]].forEach(([rr, a]) => { g.strokeStyle = gold(a); g.beginPath(); g.arc(cx, cy, rr, 0, TAU); g.stroke(); });
    const turn = still ? 0 : now / 1000 * TAU / 200;
    [[false, .26], [true, .55]].forEach(([long, a]) => {
      g.strokeStyle = gold(a); g.beginPath();
      for (let i = 0; i < 72; i++) {
        if ((i % 6 === 0) !== long) continue;
        const an = turn + i / 72 * TAU, c = Math.cos(an), s = Math.sin(an), out = r + 3 + (long ? 10 : 5) * scale;
        g.moveTo(cx + c * (r + 3), cy + s * (r + 3)); g.lineTo(cx + c * out, cy + s * out);
      }
      g.stroke();
    });

    // The arc of how far the finding has gone, from the top, clockwise.
    const ar = r - 9 * scale, a0 = -Math.PI / 2, a1 = a0 + f * TAU, pulse = foundAt ? clamp(1 - (now - foundAt) / 1300) : 0;
    g.save();
    g.shadowColor = 'rgba(230,196,119,.9)'; g.shadowBlur = 10 + 14 * pulse;
    g.strokeStyle = `rgba(251,231,176,${((.85 + .15 * pulse) * alpha).toFixed(3)})`; g.lineWidth = 1.6 + pulse;
    g.beginPath(); g.arc(cx, cy, ar, a0, a1); g.stroke();
    if (f > 0 && f < 1) {
      const hx = cx + Math.cos(a1) * ar, hy = cy + Math.sin(a1) * ar;
      g.fillStyle = `rgba(255,250,235,${alpha.toFixed(3)})`; g.beginPath(); g.arc(hx, hy, 1.8, 0, TAU); g.fill();
      g.lineWidth = .8; g.beginPath(); g.moveTo(hx - 6, hy); g.lineTo(hx + 6, hy); g.moveTo(hx, hy - 6); g.lineTo(hx, hy + 6); g.stroke();
    }
    g.restore();
    // When the stars are found, a ring of light spreads out from the ring and fades over 1.3 seconds.
    if (pulse > 0 && !still) {
      const q = 1 - pulse;
      g.strokeStyle = gold(.7 * pulse); g.lineWidth = 1.4;
      g.beginPath(); g.arc(cx, cy, r * (1 + .7 * ease(q)), 0, TAU); g.stroke();
    }
  }

  // ---------- The reader ----------
  // A click, a tap, or a key lets the song start. A click while the stars are still being found lets it start too, and then the
  // view does not ask. Command-R, Control-R, and F5 reload, as sound.html says, and keys that only change other keys do nothing.
  function wake(e) {
    if (lifted) return;
    if (e.type === 'keydown' && (e.metaKey || e.ctrlKey || e.altKey || e.key === 'F5' || ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key))) return;
    Sound.start();
    if (state === 'asking') { askEl.classList.remove('on'); box.classList.remove('asking'); to('starting', performance.now()); }
  }
  const EVENTS = ['pointerdown', 'pointerup', 'keydown'];
  EVENTS.forEach(ev => addEventListener(ev, wake, true));

  function finish() {
    running = false;
    EVENTS.forEach(ev => removeEventListener(ev, wake, true));
    removeEventListener('resize', layout);
    box.remove();
  }

  addEventListener('resize', layout);
  layout();
  requestAnimationFrame(frame);
  return api;
})();
