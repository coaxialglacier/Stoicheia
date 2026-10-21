// The constellation theme, shared by its three pages: the star field, shooting stars, the move from one page to the next,
// the hover card, and helpers that draw stars and lines in SVG. Each page loads it after its own markup.

const Sky = (() => {
  // ---------- sound.html ----------
  // A full page load stops every sound, so the sound plays in sound.html, which stays open and shows these pages in an iframe.
  // A page opened on its own, such as index.html opened as a file or the site's address, moves into sound.html, whose address
  // then names it, as sound.html?page=index.html.
  const shell = window.parent !== window ? window.parent : null;
  const here = () => (location.pathname.split('/').pop() || 'index.html') + location.search;
  if (!shell) location.replace('sound.html?page=' + encodeURIComponent(here()));
  // A page asks sound.html for each sound with a message, such as { sound: 'go', url, x }, and sound.html plays it. x is where
  // the move starts, from 0 at the left edge of the window to 1 at the right. A message works where a call would not: a
  // browser treats each page opened as a file as its own origin, and does not let one such page read or call another.
  function tell(sound, data) { if (shell) shell.postMessage({ sound, ...data }, '*'); }
  tell('here', { page: here(), title: document.title });
  // A browser lets sound.html start sound only after the reader clicks or presses a key, and a click in this page counts.
  for (const ev of ['pointerdown', 'keydown']) addEventListener(ev, () => tell('start'), true);
  // Chrome keeps its permission to play sound through a reload that the page starts, and not through one that the browser
  // starts. So Command-R, Control-R, and F5 ask sound.html to reload itself, and the new song starts without another click.
  addEventListener('keydown', e => {
    if (shell && (e.key === 'F5' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'r'))) { e.preventDefault(); tell('reload'); }
  });

  const dpr = devicePixelRatio || 1;
  const canvas = document.getElementById('sky'), ctx = canvas.getContext('2d');
  const stage = document.getElementById('stage');
  let W = 0, H = 0, stars = [];
  // Three layers of stars. A nearer layer moves more when the mouse moves, which makes the sky look deep.
  const LAYERS = [{ depth: .25, n: 380, size: [.3, .7] }, { depth: .6, n: 160, size: [.5, 1.1] }, { depth: 1, n: 46, size: [1, 2] }];
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  let panX = 0, panTarget = 0;
  let shooting = null, nextShot = performance.now() + 2500;
  // A move between pages: stars stretch away from (ox, oy) when leaving, and pull back in when arriving.
  let warp = null;
  // While quiet is true, the stars show only while they stretch in a move, and fade out as the move ends, because the page draws
  // its own sky. The skill tree inside a constellation of Home draws the Milky Way. Shooting stars still cross the sky.
  let quiet = false;

  function rnd(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
  function init() {
    W = canvas.width = innerWidth * dpr; H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
    const r = rnd(29); stars = [];
    LAYERS.forEach(L => {
      for (let i = 0; i < L.n; i++) {
        const h = r();
        stars.push({ x: (r() * 1.1 - .05) * W, y: (r() * 1.1 - .05) * H, s: (L.size[0] + r() * (L.size[1] - L.size[0])) * dpr, d: L.depth,
          a: .25 + r() * .6, p: r() * 6.3, v: .4 + r() * 1.5, c: h < .14 ? '170,205,255' : h < .22 ? '255,226,180' : '236,236,255' });
      }
    });
  }
  addEventListener('mousemove', e => { mouse.x = e.clientX - innerWidth / 2; mouse.y = e.clientY - innerHeight / 2; });

  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    mouse.sx += (mouse.x - mouse.sx) * .04; mouse.sy += (mouse.y - mouse.sy) * .04;
    panX += (panTarget - panX) * .045;
    let k = 0, ox = W / 2, oy = H / 2;
    if (warp) {
      const p = Math.min(1, (t - warp.t0) / warp.dur);
      k = warp.out ? Math.pow(p, 2.2) * 2.4 : Math.pow(1 - p, 2) * 1.4;
      ox = warp.x * dpr; oy = warp.y * dpr;
      if (p >= 1 && !warp.out) warp = null;
    }
    const shown = quiet ? Math.min(1, k * 2.2) : 1;
    if (shown > .01) for (const s of stars) {
      const a = s.a * shown * (.6 + .4 * Math.sin(s.p + t * .001 * s.v));
      const x = (((s.x - mouse.sx * s.d * .035 * dpr + panX * s.d * dpr) % W) + W) % W, y = s.y - mouse.sy * s.d * .035 * dpr;
      if (k > .01) {
        const dx = (x - ox) * k * s.d, dy = (y - oy) * k * s.d;
        ctx.strokeStyle = `rgba(${s.c},${Math.min(1, a * 1.6)})`; ctx.lineWidth = s.s * 1.2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y + dy); ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${s.c},${a})`; ctx.beginPath(); ctx.arc(x, y, s.s, 0, 7); ctx.fill();
        if (s.s > 1.5 * dpr) { ctx.fillStyle = `rgba(${s.c},${a * .13})`; ctx.beginPath(); ctx.arc(x, y, s.s * 5, 0, 7); ctx.fill(); }
      }
    }
    // Now and then a shooting star crosses the sky.
    if (!shooting && t > nextShot) {
      const r = Math.random;
      shooting = { x: (.15 + r() * .7) * W, y: r() * .35 * H, vx: (r() < .5 ? -1 : 1) * (5 + r() * 3) * dpr, vy: (2.4 + r() * 1.6) * dpr, life: 0 };
    }
    if (shooting) {
      const s = shooting; s.life++; s.x += s.vx; s.y += s.vy;
      const tail = 18, a = Math.sin(Math.min(1, s.life / 55) * Math.PI);
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * tail, s.y - s.vy * tail);
      g.addColorStop(0, `rgba(255,248,225,${a})`); g.addColorStop(1, 'rgba(255,248,225,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.4 * dpr; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * tail, s.y - s.vy * tail); ctx.stroke();
      if (s.life > 55) { shooting = null; nextShot = t + 5000 + Math.random() * 7000; }
    }
    requestAnimationFrame(frame);
  }
  addEventListener('resize', init); init(); requestAnimationFrame(frame);

  // Arriving: the page settles in from a little smaller and brighter, and the stars pull back in, toward the point the reader
  // left the last page from. The stars start where the last page left them: the same mouse offset and the same pan.
  // A page opened directly, with no page before it, arrives at the middle of the window.
  if (stage) {
    let from = null;
    try { from = JSON.parse(sessionStorage.getItem('skyFrom')); sessionStorage.removeItem('skyFrom'); } catch (e) {}
    if (!from || Date.now() - from.at > 5000) from = { x: innerWidth / 2, y: innerHeight / 2, mx: 0, my: 0, pan: 0 };
    mouse.x = mouse.sx = from.mx; mouse.y = mouse.sy = from.my; panX = panTarget = from.pan;
    stage.style.transformOrigin = `${from.x}px ${from.y}px`;
    stage.classList.add('arriving');
    warp = { out: false, t0: performance.now(), dur: 900, x: from.x, y: from.y };
    requestAnimationFrame(() => requestAnimationFrame(() => { stage.classList.add('arrived'); stage.classList.remove('arriving'); }));
  }
  // Leaving for another page, from the point (x, y): the page grows toward that point and fades, and the stars stretch away from it.
  // The next page reads that point, so its stars pull in toward the same place on the screen.
  function go(url, x = innerWidth / 2, y = innerHeight / 2) {
    tell('go', { url, x: x / innerWidth });
    stage.classList.remove('arrived');
    stage.style.transformOrigin = `${x}px ${y}px`;
    const flash = document.getElementById('flash');
    if (flash) { flash.style.setProperty('--fx', x + 'px'); flash.style.setProperty('--fy', y + 'px'); flash.classList.add('on'); }
    warp = { out: true, t0: performance.now(), dur: 800, x, y };
    stage.classList.add('leaving');
    try { sessionStorage.setItem('skyFrom', JSON.stringify({ x, y, mx: mouse.sx, my: mouse.sy, pan: panX, at: Date.now() })); } catch (e) {}
    setTimeout(() => { location.href = url; }, 820);
  }
  // A move inside one page, from the point (x, y), such as into a constellation on Home and back out: the stars stretch away
  // from that point and the light flashes there, then change() runs, and the stars pull back in toward the same point.
  // dir is 1 for a move to something deeper and -1 for a move back, so that sound.html can play the move in its direction.
  // sound.html plays the leaving sound at the click, and the arriving sound when the new view comes in, and its address then
  // names the new view, which change() puts in this page's address.
  function travel(x, y, change, dir = 1) {
    tell('travel', { x: x / innerWidth, dir });
    const flash = document.getElementById('flash');
    if (flash) { flash.style.setProperty('--fx', x + 'px'); flash.style.setProperty('--fy', y + 'px'); flash.classList.add('on'); }
    warp = { out: true, t0: performance.now(), dur: 760, x, y };
    setTimeout(() => {
      change();
      tell('traveled', { x: x / innerWidth, dir, page: here() });
      if (flash) flash.classList.remove('on');
      warp = { out: false, t0: performance.now(), dur: 1000, x, y };
    }, 780);
  }

  // ---------- The hover card ----------
  const card = document.getElementById('card');
  function show(info, x, y) {
    if (!card) return;
    card.innerHTML = `<div class="n">${info.name}</div><div class="f">${info.first}</div>` + (info.note ? `<div class="s ${info.tone || ''}">${info.note}</div>` : '');
    const w = 300, h = card.offsetHeight || 120;
    const left = Math.max(12, Math.min(innerWidth - w - 12, x - w / 2));
    const top = y > innerHeight * .55 ? y - h - 28 : y + 30;
    card.style.left = left + 'px'; card.style.top = top + 'px';
    card.classList.add('on');
  }
  function hide() { if (card) card.classList.remove('on'); }

  // ---------- The Examine tag ----------
  // After the pointer rests on the selected star for a moment, a small "Examine" tag comes out of the pointer, joined to it by a
  // thin line, and follows it while it stays on that star. It says what a second click on the star does.
  const hint = (() => {
    let box = null, timer = null, x = 0, y = 0;
    const place = () => { if (box) { box.style.left = x + 'px'; box.style.top = y + 'px'; } };
    return {
      arm(px, py, text = '✦ Examine') {
        x = px; y = py; clearTimeout(timer);
        timer = setTimeout(() => {
          if (!box) { box = document.createElement('div'); box.id = 'ctag'; document.body.appendChild(box); }
          box.innerHTML = `<div class="t"><span class="hex gold"><span>${text}</span></span></div>`;
          place(); requestAnimationFrame(() => box.classList.add('on'));
        }, 450);
      },
      move(px, py) { x = px; y = py; place(); },
      cancel() { clearTimeout(timer); if (box) box.classList.remove('on'); },
    };
  })();

  // ---------- SVG helpers ----------
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, a, parent) { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (parent) parent.appendChild(e); return e; }
  // Filters and gradients go in one <defs> for each SVG.
  function defsFor(svg) {
    const defs = el('defs', {}, svg);
    const soft = el('filter', { id: 'soft', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs); el('feGaussianBlur', { stdDeviation: 1.2 }, soft);
    const glow = el('filter', { id: 'glow', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs); el('feGaussianBlur', { stdDeviation: 3.2 }, glow);
    let gid = 0;
    return {
      defs,
      halo(color, strength) {
        const id = 'h' + color.slice(1) + String(strength).replace('.', '_');
        if (!defs.querySelector('#' + id)) {
          const g = el('radialGradient', { id }, defs);
          el('stop', { offset: 0, 'stop-color': color, 'stop-opacity': Math.min(1, .7 * strength) }, g);
          el('stop', { offset: .3, 'stop-color': color, 'stop-opacity': .22 * strength }, g);
          el('stop', { offset: 1, 'stop-color': color, 'stop-opacity': 0 }, g);
        }
        return `url(#${id})`;
      },
      line(x1, y1, x2, y2, c1, c2) {
        const id = 'lg' + (gid++);
        const g = el('linearGradient', { id, gradientUnits: 'userSpaceOnUse', x1, y1, x2, y2 }, defs);
        el('stop', { offset: 0, 'stop-color': c1 }, g); el('stop', { offset: 1, 'stop-color': c2 }, g);
        return `url(#${id})`;
      },
    };
  }
  // One star at (x, y) inside g. A known idea is a grey dashed ring. flare draws the four thin rays of a bright star.
  function star(g, d, s) {
    const o = el('g', { class: 'ig' }, g);
    if (s.known) {
      el('circle', { r: s.r * 2.4, fill: d.halo('#8d92a8', .45) }, o);
      el('circle', { r: s.r * 1.15, fill: 'none', stroke: '#8d92a8', 'stroke-dasharray': '2 2.6', 'stroke-width': 1, opacity: .9 }, o);
      el('circle', { r: s.r * .3, fill: '#a3a8bd', opacity: .85 }, o);
      return o;
    }
    el('circle', { r: s.r * 4.3, fill: d.halo(s.color, s.strength || 1), class: 'halo', style: `animation-delay:${(-Math.random() * 4).toFixed(2)}s` }, o);
    if (s.flare) {
      const L = s.r * s.flare, w = s.r * .16;
      el('path', { d: `M${-L} 0L0 ${-w}L${L} 0L0 ${w}ZM0 ${-L}L${w} 0L0 ${L}L${-w} 0Z`, fill: '#fffbea', opacity: s.flareOpacity || .5, filter: 'url(#soft)' }, o);
    }
    el('circle', { r: s.r, fill: 'none', stroke: s.ring || s.color, 'stroke-width': s.ringWidth || .8, opacity: s.dim ? .35 : .75 }, o);
    el('circle', { r: s.r * (s.dim ? .38 : .5), fill: s.dim ? '#ddd3ff' : '#fff' }, o);
    return o;
  }
  // A ring that grows and fades at (x, y): a star lighting up, or turning into a known star.
  function burst(svg, x, y, color, r = 10) {
    const c = el('circle', { cx: x, cy: y, r, fill: 'none', stroke: color, 'stroke-width': 2, class: 'burst', 'pointer-events': 'none' }, svg);
    const c2 = el('circle', { cx: x, cy: y, r: r * .6, fill: color, opacity: .5, class: 'burst', style: 'animation-duration:.6s', 'pointer-events': 'none' }, svg);
    setTimeout(() => { c.remove(); c2.remove(); }, 1100);
  }
  // Wraps text into lines of at most max characters.
  function wrap(text, max) {
    const lines = [];
    text.split(' ').forEach(w => { const l = lines[lines.length - 1]; if (l && (l + ' ' + w).length <= max) lines[lines.length - 1] = l + ' ' + w; else lines.push(w); });
    return lines;
  }
  // A sentence from the library as HTML: `code` and {{what a program prints}}.
  function sentence(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\{\{([^}]+)\}\}/g, '<span class="out">$1</span>');
  }

  // A star with four points, at (x, y), whose points reach r from its middle, as an SVG path.
  const sparkle = (x, y, r) => { const k = r * .28; return `M${x} ${y - r}L${x + k} ${y - k}L${x + r} ${y}L${x + k} ${y + k}L${x} ${y + r}L${x - k} ${y + k}L${x - r} ${y}L${x - k} ${y - k}Z`; };

  // ---------- Panels under the icons of the header ----------
  // A panel opens under an icon at the right end of the header: the music under the harp, and the reader's account under the
  // user icon, from you.js. Only one panel is open at a time. A click outside a panel and its icon closes it, and so does Escape.
  // sky.css draws each panel and what is in it. Its edge is drawn here, in SVG, because the edge follows the panel's size: a fine
  // gold line with a fainter line just inside it, a star on the top edge, a small diamond on each side, level with the panel's
  // title, and one at the bottom.
  const panels = [];
  function panel(id, icon) {
    const box = document.createElement('div'), svg = el('svg', { class: 'yedge' }, box), body = document.createElement('div');
    box.id = id; box.className = 'ypanel'; body.className = 'ybody'; box.appendChild(body);
    (stage || document.body).appendChild(box);
    const defs = el('defs', {}, svg);
    const gold = el('linearGradient', { id: id + 'Gold', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    [[0, 'rgba(251,231,176,.95)'], [.4, 'rgba(230,196,119,.55)'], [1, 'rgba(230,196,119,.22)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, gold));
    const halo = el('radialGradient', { id: id + 'Halo' }, defs);
    [[0, .7], [.35, .2], [1, 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': '#e6c477', 'stop-opacity': a }, halo));
    const lines = [1, -1].flatMap(side => [
      { side, inset: .5, r: 21.5, gap: 13, el: el('path', { class: 'line', pathLength: 1, stroke: `url(#${id}Gold)`, 'stroke-width': 1 }, svg) },
      { side, inset: 5.5, r: 16.5, gap: 18, el: el('path', { class: 'line inner', pathLength: 1, stroke: `url(#${id}Gold)`, 'stroke-width': .8, opacity: .38 }, svg) }]);
    const diamond = (cls, s) => el('path', { class: cls, d: `M0 ${-s}L${s} 0L0 ${s}L${-s} 0Z`, fill: '#0b0f22', stroke: '#e6c477', 'stroke-width': 1 }, svg);
    const sides = [diamond('yside', 3.6), diamond('yside', 3.6)], end = diamond('yend', 4.4);
    const crown = el('g', {}, svg), star = el('g', { class: 'ig ycrown' }, crown);
    el('circle', { r: 17, fill: `url(#${id}Halo)`, class: 'halo' }, star);
    el('path', { d: sparkle(0, 0, 9), fill: '#fbe7b0' }, star);
    el('circle', { r: 1.6, fill: '#fff' }, star);
    // Half of one line runs from beside the top star, round one top corner, down one side, and round one bottom corner to the
    // middle. The side diamonds are level with the panel's title, with the reader's name in the account panel, or with the
    // song's name in the music panel.
    function place() {
      const w = box.offsetWidth, h = box.offsetHeight;
      if (!w) return;
      svg.setAttribute('width', w); svg.setAttribute('height', h);
      lines.forEach(({ side, inset, r, gap, el: path }) => {
        const m = w / 2, x = side > 0 ? w - inset : inset, t = inset, b = h - inset, sweep = side > 0 ? 1 : 0;
        path.setAttribute('d', `M${m + side * gap} ${t}H${x - side * r}A${r} ${r} 0 0 ${sweep} ${x} ${t + r}V${b - r}A${r} ${r} 0 0 ${sweep} ${x - side * r} ${b}H${m + side * 6}`);
      });
      const title = body.querySelector('.ytitle, .yname, .ysong'), y = title ? title.offsetTop + title.offsetHeight / 2 - body.scrollTop : h / 2;
      sides[0].setAttribute('transform', `translate(.5 ${y})`); sides[1].setAttribute('transform', `translate(${w - .5} ${y})`);
      end.setAttribute('transform', `translate(${w / 2} ${h - .5})`);
      crown.setAttribute('transform', `translate(${w / 2} .5)`);
    }
    new ResizeObserver(place).observe(box);
    let closing = 0, tween = 0;
    const p = {
      box, body, icon, shown: false, onHide: null,
      // Opens the panel, or changes what an open panel shows, with what write puts in its body. What it shows rises in one part
      // after another. Opening draws the edge, and changing what an open panel shows changes its height smoothly.
      show(write) {
        const was = p.shown, from = was ? body.offsetHeight : 0;
        panels.forEach(q => { if (q !== p) q.hide(); });
        p.shown = true; icon.classList.add('on'); icon.setAttribute('aria-expanded', 'true');
        clearTimeout(closing); box.classList.remove('closing');
        clearTimeout(tween); body.style.height = '';
        // The panel's right edge is under the right end of its icon, and the panel stays 14 pixels inside the window.
        const r = icon.getBoundingClientRect(), w = Math.min(336, innerWidth - 28);
        box.style.right = Math.max(14, Math.min(innerWidth - r.right - 18, innerWidth - w - 14)) + 'px';
        write(body);
        [...body.children].forEach((c, i) => { c.style.animationDelay = (was ? 60 : 160) + i * 45 + 'ms'; });
        if (!was) {
          box.classList.remove('opening'); box.classList.add('on'); place();
          void box.offsetWidth; box.classList.add('opening');
        } else {
          const to = body.offsetHeight;
          body.style.height = from + 'px'; void body.offsetHeight; body.style.height = to + 'px';
          tween = setTimeout(() => { body.style.height = ''; }, 460);
          place();
        }
      },
      hide() {
        if (!p.shown) return;
        p.shown = false; icon.classList.remove('on'); icon.setAttribute('aria-expanded', 'false');
        box.classList.add('closing');
        clearTimeout(closing); closing = setTimeout(() => box.classList.remove('on', 'closing', 'opening'), 200);
        if (p.onHide) p.onHide();
      },
      place,
    };
    panels.push(p);
    return p;
  }
  document.addEventListener('pointerdown', e => panels.forEach(p => { if (!p.box.contains(e.target) && !p.icon.contains(e.target)) p.hide(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') panels.forEach(p => p.hide()); });
  // True while a panel shows, and while it fades out after closing.
  const panelShown = () => panels.some(p => p.box.classList.contains('on'));

  // The emblem at the top of a panel: a ring with fine marks that turns slowly, four small stars on the outer ring that turn the
  // other way, and a small disc of sky inside, 94 pixels across. It returns the group that the disc's picture goes in. The ids
  // of its gradients start with prefix, such as youStarHalo, which a star in the disc is drawn with.
  function emblem(box, prefix) {
    const s = el('svg', { viewBox: '-66 -66 132 132' }, box);
    const defs = el('defs', {}, s);
    const halo = el('radialGradient', { id: prefix + 'StarHalo' }, defs);
    [[0, .8], [.3, .24], [1, 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': '#e6c477', 'stop-opacity': a }, halo));
    const flash = el('radialGradient', { id: prefix + 'Flash' }, defs);
    [[0, .6], [.6, .16], [1, 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': '#fbe7b0', 'stop-opacity': a }, flash));
    const ring = el('g', {}, s);
    el('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0', to: '360', dur: '180s', repeatCount: 'indefinite' }, ring);
    el('circle', { r: 64, fill: 'none', stroke: 'rgba(230,196,119,.16)', 'stroke-dasharray': '1 3.5' }, ring);
    el('circle', { r: 60, fill: 'none', stroke: 'rgba(230,196,119,.45)' }, ring);
    for (let i = 0; i < 72; i++) {
      const a = i / 72 * Math.PI * 2, r1 = i % 6 ? 57 : 52.5;
      el('line', { x1: Math.cos(a) * r1, y1: Math.sin(a) * r1, x2: Math.cos(a) * 60, y2: Math.sin(a) * 60, stroke: 'rgba(230,196,119,.42)', 'stroke-width': .6 }, ring);
    }
    const marks = el('g', {}, s);
    el('animateTransform', { attributeName: 'transform', type: 'rotate', from: '360', to: '0', dur: '240s', repeatCount: 'indefinite' }, marks);
    for (let i = 0; i < 4; i++) { const a = (i + .5) * Math.PI / 2; el('path', { d: sparkle(Math.cos(a) * 64, Math.sin(a) * 64, 3.4), fill: '#fbe7b0' }, marks); }
    el('circle', { r: 47, fill: 'rgba(5,7,18,.82)', stroke: 'rgba(230,196,119,.3)', 'stroke-dasharray': '2 3' }, s);
    el('circle', { r: 47, fill: `url(#${prefix}Flash)`, class: 'yflash' }, s);
    return el('g', { class: 'yfig' }, s);
  }

  function pan(px) { panTarget += px; }

  // ---------- Sound ----------
  // The sound settings are kept in localStorage, under the key that sound.js reads. Each change is kept there, and sent to
  // sound.html, which applies it at once. SOUND_DEFAULTS are the same as the defaults in sound.js.
  const SOUND_KEY = 'stoicheiaSound', SOUND_DEFAULTS = { musicVol: .5, moveVol: .7, on: true };
  const settings = { ...SOUND_DEFAULTS };
  try { Object.assign(settings, JSON.parse(localStorage.getItem(SOUND_KEY))); } catch (e) {}
  const sound = {
    settings: () => settings,
    choose(k, v) {
      settings[k] = v;
      try { localStorage.setItem(SOUND_KEY, JSON.stringify(settings)); } catch (e) {}
      tell('choose', { k, v });
      if (k === 'on') showSound();
    },
    // Plays the sound of a page arriving, from x, so the reader hears the sound effects at their volume.
    hear(x = .5) { tell('hear', { x }); },
  };
  // The harp at the right end of the header is an Irish harp: a soundbox that slants down to the right, a neck along the top in
  // the shape of an S, a pillar that bows out on the right with a curl at its top, five strings from the neck down to the
  // soundbox, and a small star at its top left. Clicking it opens the music panel under it. With all sound off, the root element
  // has the class sound-off, which greys the harp and darkens its strings, and dims the volumes in the panels.
  const HARP_STRINGS = ['M-6.2 -7.7V-4.4', 'M-4 -8.3V-1.1', 'M-1.8 -7.5V2.1', 'M.4 -6.2V5.3', 'M2.6 -6V8.6'];
  const HARP = `<svg width="26" height="26" viewBox="-12 -12 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g class="frame" stroke="#e6c477" stroke-width="1.2">
      <path d="M-8 -6.4L3.5 10.5Q2.7 12.1 1.3 11.8L-9.3 -5.6Q-9 -6.7 -8 -6.4Z"/>
      <path d="M-8 -6.4C-6.4 -9.6 -3.6 -9.8 -1.4 -8.1C.8 -6.4 3.6 -6.4 5.6 -8.7C6.4 -9.7 6.9 -10.6 7.6 -11"/>
      <path d="M7.6 -11C12.2 -4.6 11 5 3.5 10.5"/>
      <path d="M7.6 -11C8.6 -12 10.4 -11.4 10 -10.1C9.7 -9.3 8.8 -9.4 8.8 -10.1"/></g>
    ${HARP_STRINGS.map((d, i) => `<path class="str" style="--i:${i}" d="${d}"/>`).join('')}
    <path class="hstar" d="M-10 -12L-9.5 -10.4L-7.9 -9.9L-9.5 -9.4L-10 -7.8L-10.5 -9.4L-12.1 -9.9L-10.5 -10.4Z" fill="#fbe7b0"/></svg>`;
  const harp = document.getElementById('harp');
  function showSound() {
    const on = sound.settings().on;
    document.documentElement.classList.toggle('sound-off', !on);
    if (harp) harp.title = on ? 'Music' : 'Music · all sound is off';
    const turn = music && music.body.querySelector('.ysound');
    if (turn) { turn.classList.toggle('off', !on); turn.setAttribute('aria-checked', on); turn.lastChild.textContent = on ? 'Sound on' : 'Sound off'; }
  }

  // ---------- The music panel ----------
  // Clicking the harp opens a panel under it. It shows the song that plays, with a picture of the music in the emblem's disc,
  // the song's name and its number, a bar of where the song is with its time and its length, and the music's volume, from 0 to
  // 100. At its bottom, a capsule turns all sound on or off, music and sound effects together. While the panel is open, the page
  // watches the song: sound.html sends it, once a frame, what plays, as { song }.
  const music = harp && panel('musicPanel', harp);
  let song = null;
  addEventListener('message', e => { if (shell && e.source === shell && e.data && e.data.song) song = e.data.song; });
  const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function showMusic() {
    music.show(body => {
      body.className = 'ybody yv-music';
      const v = settings.musicVol;
      body.innerHTML = `<div class="yemblem ymusic"></div><div class="ynow"><i></i><span>Now playing</span></div>
        <div class="ysong">${song ? song.title : '&nbsp;'}</div>
        <div class="yprog"><div class="ybar"><i></i></div><div class="ytimes"><span>0:00</span><span>0:00</span></div></div>
        <label class="yvol"><div class="ytop"><span>MUSIC</span><b>${Math.round(v * 100)}</b></div>
          <span class="yrange"><input type="range" min="0" max="1" step="0.01" value="${v}" style="--p:${v}" aria-label="Music volume"></span></label>
        <div class="ytools"><a class="ysettings ysound" role="switch"><i>✦</i><span></span></a></div>`;
      const art = body.firstElementChild;
      emblem(art, 'music');
      art.appendChild(document.createElement('canvas'));
      const range = body.querySelector('input');
      range.addEventListener('input', () => {
        range.style.setProperty('--p', range.value);
        range.closest('.yvol').querySelector('b').textContent = Math.round(range.value * 100);
        sound.choose('musicVol', +range.value);
      });
      // Turning sound on strums the harp's strings, one after another.
      body.querySelector('.ysound').onclick = () => {
        const on = !settings.on;
        sound.choose('on', on);
        harp.classList.remove('strum');
        if (on) { void harp.offsetWidth; harp.classList.add('strum'); }
      };
    });
    showSound();
    tell('watch', { on: true }); requestAnimationFrame(drawMusic);
  }
  if (music) music.onHide = () => tell('watch', { on: false });

  // The picture of the music: 72 fine rays around a small star, in the disc of the emblem. Each ray shows one band of the
  // song's frequencies. The low bands, which are the loudest, point up, down, left, and right, and the bands get higher toward
  // the four diagonals, so the rays make a star with four points, as the stars of the theme have. A ray is as long as its band
  // is loud, and grows quickly and shrinks slowly. The small star grows with the low notes. The picture follows the music's
  // volume. With the song stopped, the rays lie short and still, and with all sound off they are also grey.
  const RAYS = 72, rays = new Float32Array(RAYS);
  let shown = -1;
  function drawMusic(now) {
    if (!music.shown) return;
    requestAnimationFrame(drawMusic);
    const body = music.body, canvas = body.querySelector('.ymusic canvas');
    if (!canvas) return;
    const S = 94, d = devicePixelRatio || 1, g = canvas.getContext('2d');
    if (canvas.width !== S * d) canvas.width = canvas.height = S * d;
    const on = settings.on, live = !!song && song.playing && on, gain = .35 + .65 * Math.sqrt(settings.musicVol);
    const levels = (song && song.levels) || [], n = levels.length;
    for (let k = 0; k < RAYS; k++) {
      const u = (k / RAYS * 4) % 1, high = u < .5 ? u * 2 : (1 - u) * 2, band = Math.round(high * (n - 1));
      // High bands are quieter than low ones, so each band is raised a little more the higher it is.
      const target = live && n ? Math.min(1, levels[band] * (1 + high * .7)) * gain : 0;
      rays[k] += (target - rays[k]) * (target > rays[k] ? .5 : .09);
    }
    const low = (rays[0] + rays[RAYS / 4] + rays[RAYS / 2] + rays[RAYS * 3 / 4]) / 4;
    const color = on ? '251,231,176' : '126,124,144';
    g.setTransform(d, 0, 0, d, S / 2 * d, S / 2 * d);
    g.clearRect(-S / 2, -S / 2, S, S);
    g.lineCap = 'round'; g.lineWidth = 1.1; g.shadowColor = on ? 'rgba(230,196,119,.8)' : 'transparent'; g.shadowBlur = 6;
    for (let k = 0; k < RAYS; k++) {
      const a = k / RAYS * Math.PI * 2 - Math.PI / 2, still = .9 + .5 * Math.sin(now / 1100 + k * .45);
      const r0 = 12, len = 1.5 + rays[k] * 30 + (live ? 0 : still);
      g.strokeStyle = `rgba(${color},${(.22 + .78 * rays[k]).toFixed(3)})`;
      g.beginPath(); g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a) * (r0 + len), Math.sin(a) * (r0 + len)); g.stroke();
    }
    g.strokeStyle = `rgba(${color},.35)`; g.lineWidth = .7;
    g.beginPath(); g.arc(0, 0, 9.5, 0, Math.PI * 2); g.stroke();
    g.fillStyle = on ? '#fbe7b0' : '#8d8b9e'; g.fill(new Path2D(sparkle(0, 0, 4.5 + low * 5)));
    g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 1.2, 0, Math.PI * 2); g.fill();
    // The song's name, its number, where it is, and its length. Text changes only when it is different.
    if (!song) return;
    const write = (el, text) => { if (el.textContent !== text) el.textContent = text; };
    write(body.querySelector('.ysong'), song.title);
    write(body.querySelector('.ynow span'), song.of > 1 ? `Now playing · ${song.number} of ${song.of}` : 'Now playing');
    body.querySelector('.ynow').classList.toggle('live', live);
    body.querySelector('.yprog i').style.width = (song.length ? song.at / song.length * 100 : 0).toFixed(2) + '%';
    const second = Math.floor(song.at);
    if (second !== shown) {
      shown = second;
      const [at, length] = body.querySelectorAll('.ytimes span');
      at.textContent = clock(song.at); length.textContent = clock(song.length);
    }
  }
  if (harp) {
    harp.innerHTML = HARP;
    harp.setAttribute('role', 'button'); harp.setAttribute('aria-label', 'Music'); harp.setAttribute('aria-expanded', 'false');
    harp.onclick = () => { if (music.shown) music.hide(); else { shown = -1; showMusic(); } };
  }
  showSound();

  return { go, travel, show, hide, hint, pan, el, defsFor, star, burst, wrap, sentence, sparkle, panel, panelShown, emblem, sound, quiet: on => { quiet = on; } };
})();
