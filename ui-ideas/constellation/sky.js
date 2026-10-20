// The constellation theme, shared by the three mockups: the star field, shooting stars, the move from one page to the next,
// the hover card, and helpers that draw stars and lines in SVG. Each page loads it after its own markup.

const Sky = (() => {
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
    for (const s of stars) {
      const a = s.a * (.6 + .4 * Math.sin(s.p + t * .001 * s.v));
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
    stage.classList.remove('arrived');
    stage.style.transformOrigin = `${x}px ${y}px`;
    const flash = document.getElementById('flash');
    if (flash) { flash.style.setProperty('--fx', x + 'px'); flash.style.setProperty('--fy', y + 'px'); flash.classList.add('on'); }
    warp = { out: true, t0: performance.now(), dur: 800, x, y };
    stage.classList.add('leaving');
    try { sessionStorage.setItem('skyFrom', JSON.stringify({ x, y, mx: mouse.sx, my: mouse.sy, pan: panX, at: Date.now() })); } catch (e) {}
    setTimeout(() => { location.href = url; }, 820);
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

  function pan(px) { panTarget += px; }

  return { go, show, hide, hint, pan, el, defsFor, star, burst, wrap, sentence };
})();
