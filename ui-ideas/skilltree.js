// The skill tree inside a constellation of Home. Each area of the constellation is one branch, from left to right, in the
// order CONSTELLATIONS gives. Each idea climbs from the ground at the bottom: the ideas that need nothing stand on it, and an
// idea's tier is the longest chain of needs below it, counted inside the constellation. So the higher an idea is, the more
// ideas it needs first.
// A line joins an idea to each idea it needs, except a need that one of its other needs already needs, so each line is one
// step up the tree. An idea the reader knows is gold. An idea whose needs the reader all knows is ready to learn. Every other
// idea is locked, with a lock on it, until the reader knows what it needs. A planned idea, from planned.json, has no entry yet.
// index.html loads it after pages.js. It reads IDEAS, PLANNED, KNOWN, and STUDYING, and calls back when an idea is chosen.

const SkillTree = (() => {
  const { el } = Sky;
  const box = document.getElementById('tree'), inner = document.getElementById('treeIn');
  // The color of each branch. Gold is kept for what the reader knows, in every branch.
  const COLOR = { ui: '#ff9ec7', swift: '#8ec5ff', memory: '#7fe8d2', conc: '#c3b0ff', algo: '#ffadd2' };
  // Sizes, in the units of the tree's drawing. SLOT is the room for one idea in a tier of a branch.
  const SLOT = 96, GUT = 64, SIDE = 116, TIER = 150, TOP = 262, GROUND = 400, BRANCH = 176;
  const RADIUS = { known: 13, ready: 13, locked: 12, studying: 16, planned: 8 };
  const ROMAN = n => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'][n] || String(n);
  const hash = text => { let h = 2166136261; for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return ((h >>> 0) % 10000) / 10000; };
  const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const api = { onSelect: null, onExamine: null, afterDraw: null };
  let M = null, L = null, svg = null, sel = null, scale = 1, view = null;

  // ---------- The tree of one constellation ----------
  // Every concept in the constellation's areas, and every planned idea in them, with its tier, the needs a line is drawn to,
  // and the ideas that need it.
  function model(con) {
    const C = CONSTELLATIONS.find(c => c.id === con);
    const ids = C.areas.flatMap(a => [...areaOrder(a), ...Object.keys(PLANNED).filter(id => PLANNED[id].area === a)]);
    const inTree = new Set(ids), nodes = {}, tier = {};
    ids.forEach(id => { const I = IDEAS[id] || PLANNED[id]; nodes[id] = { id, name: I.name, area: I.area, first: I.first, needs: needsOf(id) }; });
    const tierOf = id => tier[id] !== undefined ? tier[id] : (tier[id] = Math.max(-1, ...nodes[id].needs.filter(n => inTree.has(n)).map(tierOf)) + 1);
    const reaches = (from, to, seen = new Set()) => needsOf(from).some(n => n === to || (!seen.has(n) && (seen.add(n), reaches(n, to, seen))));
    ids.forEach(id => {
      const N = nodes[id];
      N.tier = tierOf(id);
      N.lines = N.needs.filter(n => inTree.has(n) && !N.needs.some(m => m !== n && reaches(m, n)));
    });
    ids.forEach(id => { nodes[id].leads = ids.filter(k => nodes[k].lines.includes(id)); });
    return { C, ids, nodes, T: Math.max(0, ...ids.map(id => tier[id])) };
  }

  // Where each idea goes. Each branch is as wide as its fullest tier. Inside a tier, each idea moves toward the ideas it is
  // joined to, a few times up the tree and down again, so that few lines cross. Ideas side by side in a tier are set a little
  // higher and lower in turn, so that their names never meet.
  function layout() {
    const branches = M.C.areas.map(a => ({ id: a, ids: M.ids.filter(id => M.nodes[id].area === a) }));
    let x = SIDE;
    branches.forEach(b => {
      const per = {};
      b.ids.forEach(id => { per[M.nodes[id].tier] = (per[M.nodes[id].tier] || 0) + 1; });
      b.slots = Math.max(1, ...Object.values(per));
      b.x0 = x; b.w = Math.max(BRANCH, b.slots * SLOT); b.cx = x + b.w / 2; x += b.w + GUT;
    });
    const W = x - GUT + SIDE, yOf = t => TOP + (M.T - t) * TIER, H = yOf(0) + GROUND;
    const rows = [];
    branches.forEach(b => { for (let t = 0; t <= M.T; t++) { const list = b.ids.filter(id => M.nodes[id].tier === t); if (list.length) rows.push({ b, t, list }); } });
    const X = {};
    const pack = (row, want) => {
      const { b, list } = row, lo = b.x0 + SLOT / 2, hi = b.x0 + b.w - SLOT / 2;
      list.sort((p, q) => want[p] - want[q] || (p < q ? -1 : 1));
      const xs = list.map(id => want[id]);
      for (let i = 1; i < xs.length; i++) xs[i] = Math.max(xs[i], xs[i - 1] + SLOT);
      // Ideas that want to be wider apart than their branch is are spread evenly across it.
      if (xs.length > 1 && xs[xs.length - 1] - xs[0] > hi - lo) { list.forEach((id, i) => { X[id] = lo + i * (hi - lo) / (list.length - 1); }); return; }
      const shift = list.reduce((s, id, i) => s + want[id] - xs[i], 0) / xs.length;
      const d = Math.min(Math.max(xs[0] + shift, lo), hi - (xs[xs.length - 1] - xs[0])) - xs[0];
      list.forEach((id, i) => { X[id] = xs[i] + d; });
    };
    rows.forEach(r => { const want = {}; r.list.forEach((id, i) => { want[id] = r.b.cx + (i - (r.list.length - 1) / 2) * SLOT; }); pack(r, want); });
    const mean = list => list.reduce((s, id) => s + X[id], 0) / list.length;
    for (let k = 0; k < 8; k++) {
      const up = k % 2 === 0;
      [...rows].sort((p, q) => up ? p.t - q.t : q.t - p.t).forEach(r => {
        const want = {};
        r.list.forEach(id => { const near = up ? M.nodes[id].lines : M.nodes[id].leads; want[id] = near.length ? .7 * mean(near) + .3 * X[id] : X[id]; });
        pack(r, want);
      });
    }
    const P = {};
    rows.forEach(r => r.list.forEach((id, i) => {
      const lift = r.list.length > 1 ? (i % 2 ? -24 : 16) : 0;
      P[id] = { x: X[id] + (hash(id + 'x') - .5) * 12, y: yOf(r.t) + lift + (hash(id + 'y') - .5) * 12 };
    }));
    return { branches, P, W, H, yOf };
  }

  // ---------- Where the reader stands ----------
  function stateOf(id) { return skillState(id); }
  const unknownNeedsOf = id => needsOf(id).filter(n => !KNOWN.has(n));
  // The path to an idea: each idea the reader must learn first, in teaching order, then the idea itself. A concept follows
  // its study, whose path can teach the concept's first views before the ideas only its In memory view needs.
  function pathOf(id) {
    if (!id || KNOWN.has(id)) return { steps: [], nums: {}, ids: new Set() };
    let steps;
    if (IDEAS[id]) steps = studyPath(id);
    else {
      const out = [];
      (function walk(list) { list.forEach(n => { if (KNOWN.has(n) || out.includes(n)) return; walk(needsOf(n)); out.push(n); }); })(needsOf(id));
      steps = [...out.map(n => ({ id: n, view: 'all' })), { id, view: 'all' }];
    }
    const nums = {};
    steps.forEach((s, i) => { (nums[s.id] = nums[s.id] || []).push(ROMAN(i + 1)); });
    return { steps, nums, ids: new Set(steps.map(s => s.id)) };
  }

  // ---------- Drawing ----------
  // The name of an idea in lines of at most 17 letters, and where the socket under it is: the small diamond that the lines
  // from the ideas it needs come up to.
  const nameLines = N => Sky.wrap(N.name.toUpperCase(), 17);
  const socketY = (N, st) => RADIUS[st] + 17 + (nameLines(N).length - 1) * 14 + (st === 'studying' ? 25 : 11);

  // con is the constellation. With intro, the tree lights up from the ground to the top. learned is an idea the reader has just
  // marked as known, and unlocked lists the ideas that are ready because of it: their locks open.
  function draw(con, o = {}) {
    if (!view || view !== con) sel = null;
    view = con; M = model(con);
    inner.innerHTML = '';
    box.classList.toggle('intro', !!o.intro);
    if (!M.ids.length) { emptyTree(); return; }
    L = layout();
    const bw = box.clientWidth, bh = box.clientHeight;
    scale = Math.min(1.1, Math.max(.8, (bw - 24) / L.W));
    const W = Math.max(L.W, bw / scale), H = Math.max(L.H, bh / scale), ox = (W - L.W) / 2, oy = H - L.H;
    L.ox = ox; L.oy = oy; L.fullW = W; L.fullH = H;
    inner.style.width = W * scale + 'px'; inner.style.height = H * scale + 'px';
    box.style.overflowX = W * scale > bw + 1 ? 'auto' : 'hidden';
    const gl = typeof Aurora !== 'undefined' && Aurora.ok;
    if (!gl) aurora(o.intro);
    svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W * scale, height: H * scale, class: 'tsvg' }, inner);
    const d = Sky.defsFor(svg);
    const bloom = el('filter', { id: 'bloom', x: '-50%', y: '-50%', width: '200%', height: '200%' }, d.defs);
    el('feGaussianBlur', { stdDeviation: 6 }, bloom);
    ground(d, W, H, oy, o.intro, 'back');
    const g = el('g', { transform: `translate(${ox} ${oy})` }, svg);
    rail(g, d, o.intro);
    const pools = el('g', { class: 'pools' }, g), edges = el('g', { class: 'edges' }, g), nodes = el('g', { class: 'nodes' }, g);
    el('g', { class: 'marks' }, g);
    el('g', { class: 'fx' }, g);
    M.ids.forEach(id => M.nodes[id].lines.forEach(n => edge(edges, d, n, id, o)));
    M.ids.forEach(id => node(nodes, d, id, o));
    // Behind each idea and its name, a light shadow. With WebGL, aurora.js draws each one as an uneven cloud of dust, in the
    // same picture as the aurora, behind the tree's drawing. Without it, each is a soft oval here.
    const shadows = M.ids.map(shadowOf);
    if (gl) Aurora.paint(inner, { ...auroraInfo(), shadows }, o.intro);
    else {
      const pool = el('radialGradient', { id: 'pool' }, d.defs);
      [[0, .4], [.45, .3], [.75, .12], [1, 0]].forEach(([at, a]) => el('stop', { offset: at, 'stop-color': '#03050c', 'stop-opacity': a }, pool));
      shadows.forEach((s, i) => {
        const e = el('ellipse', { cx: s.x, cy: s.y, rx: s.rx, ry: s.ry, fill: 'url(#pool)', class: o.intro ? 'fade' : '' }, pools);
        if (o.intro) e.style.animationDelay = 300 + M.nodes[M.ids[i]].tier * 230 + 'ms';
      });
    }
    ground(d, W, H, oy, o.intro, 'front');
    focus(sel, false);
    if (api.afterDraw) api.afterDraw();
  }

  // A constellation with no ideas yet: only its ground, and a line that says so.
  function emptyTree() {
    const bw = box.clientWidth, bh = box.clientHeight;
    scale = 1; L = null;
    inner.style.width = bw + 'px'; inner.style.height = bh + 'px';
    svg = el('svg', { viewBox: `0 0 ${bw} ${bh}`, width: bw, height: bh, class: 'tsvg' }, inner);
    const d = Sky.defsFor(svg);
    ground(d, bw, bh, bh - 300, box.classList.contains('intro'), 'back');
    ground(d, bw, bh, bh - 300, box.classList.contains('intro'), 'front', true);
    el('text', { x: bw / 2, y: bh * .4, 'text-anchor': 'middle', class: 'empty fade' }, svg).textContent = `No ideas are in ${M.C.name} yet.`;
  }

  // Without WebGL, the aurora over each branch: thin rays of the branch's color that rise from the ground and fade toward the top of the
  // branch, drawn once on a canvas, which sways and brightens slowly. It stays dim, so the ideas are always brighter.
  function aurora(intro) {
    L.branches.forEach((b, i) => {
      const top = Math.min(...b.ids.map(id => L.P[id].y)) - 150, base = L.yOf(0) + 120;
      const x0 = b.x0 - 50, w = b.w + 100, h = base - top;
      const c = document.createElement('canvas'), k = Math.min(1.5, devicePixelRatio || 1);
      c.className = 'aurora';
      Object.assign(c.style, { left: (x0 + L.ox) * scale + 'px', top: (top + L.oy) * scale + 'px', width: w * scale + 'px', height: h * scale + 'px',
        animationDuration: `${intro ? 2.4 : 0}s, ${13 + i * 3.7}s`, animationDelay: `${.3 + i * .15}s, ${-i * 4.3}s` });
      c.width = Math.round(w * scale * k); c.height = Math.round(h * scale * k);
      inner.appendChild(c);
      const g = c.getContext('2d'), cw = c.width, ch = c.height, [R, G, B] = rgb(COLOR[b.id] || '#c3b0ff'), r = rnd(1 + Math.floor(hash(b.id) * 9e6));
      let glow = g.createRadialGradient(cw / 2, ch, 0, cw / 2, ch, cw * .62);
      glow.addColorStop(0, `rgba(${R},${G},${B},.13)`); glow.addColorStop(1, `rgba(${R},${G},${B},0)`);
      g.fillStyle = glow; g.fillRect(0, 0, cw, ch);
      // The lower edge of the rays waves across the branch, as the lower edge of a real aurora does.
      const phase = r() * 6.3;
      for (let n = 0; n < 190; n++) {
        const u = (r() + r() + r()) / 3, x = u * cw, wave = (Math.sin(u * 7.5 + phase) * .5 + .5) * ch * .14;
        const y0 = ch - ch * .04 - wave, len = ch * (.22 + r() * r() * .78), a = .015 + r() * .05, lw = (1 + r() * 4.5) * k;
        const lg = g.createLinearGradient(0, y0, 0, y0 - len);
        lg.addColorStop(0, `rgba(${R},${G},${B},0)`); lg.addColorStop(.06, `rgba(${R},${G},${B},${a * 1.6})`);
        lg.addColorStop(.35, `rgba(${R},${G},${B},${a})`); lg.addColorStop(1, `rgba(${R},${G},${B},0)`);
        g.fillStyle = lg; g.fillRect(x - lw / 2, y0 - len, lw, len);
      }
    });
  }

  // The ground: three ridges of mountains, the farthest lit along its top in the constellation's color, and on the nearest, the
  // name of each branch with how many of its ideas the reader knows. 'back' draws the far ridge, behind the tree; 'front'
  // draws the two near ridges and the names.
  // The ground reaches EDGE past both sides of the tree, so that it still fills the window when the tree moves aside for the
  // panel of the chosen idea.
  const EDGE = 600;
  function ridge(seed, W, base, amp, rough) {
    const r = rnd(seed), n = 256, ys = new Array(n + 1);
    ys[0] = base - r() * amp * .6; ys[n] = base - r() * amp * .6;
    for (let step = n, s = amp * 1.4; step > 1; step /= 2, s *= rough)
      for (let i = step / 2; i < n; i += step) ys[i] = (ys[i - step / 2] + ys[i + step / 2]) / 2 + (r() - .5) * s;
    return ys.map((y, i) => [-EDGE + i / n * (W + 2 * EDGE), y]);
  }
  const ridgePath = (pts, H) => `M${pts[0][0]} ${H}` + pts.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join('') + `L${pts[pts.length - 1][0]} ${H}Z`;
  function ground(d, W, H, oy, intro, layer, bare) {
    const base = (L ? L.yOf(0) : H - oy - 270) + oy;
    const g = el('g', { class: 'ground ' + layer + (intro ? ' rise' : '') }, svg);
    if (layer === 'back') {
      const haze = el('linearGradient', { id: 'gHaze', x1: 0, y1: 0, x2: 0, y2: 1 }, d.defs);
      [[0, 'rgba(70,60,150,0)'], [.55, 'rgba(70,60,150,.12)'], [1, 'rgba(20,20,60,0)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, haze));
      el('rect', { x: -EDGE, y: base + 10, width: W + 2 * EDGE, height: 170, fill: 'url(#gHaze)' }, g);
      const far = ridge(7, W, base + 175, 300, .56);
      const fill = el('linearGradient', { id: 'gFar', x1: 0, y1: 0, x2: 0, y2: 1 }, d.defs);
      [[0, '#141a3c'], [.35, '#0a0e24'], [1, '#05070f']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, fill));
      el('path', { d: ridgePath(far, H), fill: 'url(#gFar)' }, g);
      const rim = el('linearGradient', { id: 'gRim', x1: 0, y1: 0, x2: 1, y2: 0 }, d.defs);
      [[0, 'rgba(195,176,255,0)'], [.3, 'rgba(195,176,255,.42)'], [.7, 'rgba(142,197,255,.42)'], [1, 'rgba(142,197,255,0)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, rim));
      const top = 'M' + far.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');
      el('path', { d: top, fill: 'none', stroke: 'url(#gRim)', 'stroke-width': 7, opacity: .22, filter: 'url(#bloom)' }, g);
      el('path', { d: top, fill: 'none', stroke: 'url(#gRim)', 'stroke-width': 1 }, g);
      return;
    }
    const mid = ridge(19, W, base + 205, 110, .5), near = ridge(31, W, base + 236, 56, .48);
    el('path', { d: ridgePath(mid, H), fill: '#070a19' }, g);
    const mist = el('linearGradient', { id: 'gMist', x1: 0, y1: 0, x2: 0, y2: 1 }, d.defs);
    [[0, 'rgba(60,70,140,.10)'], [1, 'rgba(60,70,140,0)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, mist));
    el('rect', { x: -EDGE, y: base + 190, width: W + 2 * EDGE, height: 70, fill: 'url(#gMist)' }, g);
    el('path', { d: ridgePath(near, H), fill: '#03050c' }, g);
    if (bare || !L) return;
    // Under each branch: its name, how many of its ideas the reader knows, and a bar between two slanted ends.
    L.branches.forEach((b, i) => {
      const cx = b.cx + L.ox, y = base + 266, ideas = b.ids.filter(id => IDEAS[id]), known = ideas.filter(id => KNOWN.has(id)).length, planned = b.ids.length - ideas.length;
      const t = el('g', { class: 'bname' + (intro ? ' fade' : ''), style: intro ? `animation-delay:${600 + i * 140}ms` : '' }, g);
      // Over the name, a small star in the branch's color, between two fine lines that fade out.
      const sy = y - 26, glow = el('linearGradient', { id: 'bl' + b.id, gradientUnits: 'userSpaceOnUse', x1: cx - 70, y1: 0, x2: cx + 70, y2: 0 }, d.defs);
      [[0, 0], [.5, .7], [1, 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': COLOR[b.id], 'stop-opacity': a }, glow));
      el('line', { x1: cx - 70, y1: sy, x2: cx + 70, y2: sy, stroke: `url(#bl${b.id})`, 'stroke-width': .8 }, t);
      el('circle', { cx, cy: sy, r: 9, fill: d.halo(COLOR[b.id], .9) }, t);
      el('path', { d: `M${cx} ${sy - 6}L${cx + 1.4} ${sy - 1.4}L${cx + 6} ${sy}L${cx + 1.4} ${sy + 1.4}L${cx} ${sy + 6}L${cx - 1.4} ${sy + 1.4}L${cx - 6} ${sy}L${cx - 1.4} ${sy - 1.4}Z`, fill: '#fff8ea' }, t);
      el('text', { x: cx, y, 'text-anchor': 'middle', class: 'bn' }, t).textContent = areaName(b.id).toUpperCase();
      const bw2 = 132, f = ideas.length ? known / ideas.length : 0, by = y + 15;
      el('path', { d: `M${cx - bw2 / 2 + 4} ${by}H${cx + bw2 / 2}L${cx + bw2 / 2 - 4} ${by + 5}H${cx - bw2 / 2}Z`, fill: 'rgba(5,7,16,.8)', stroke: 'rgba(230,196,119,.38)', 'stroke-width': .8 }, t);
      if (f) el('path', { d: `M${cx - bw2 / 2 + 5} ${by + 1}H${cx - bw2 / 2 + 5 + (bw2 - 10) * f}L${cx - bw2 / 2 + 2 + (bw2 - 10) * f} ${by + 4}H${cx - bw2 / 2 + 2}Z`, fill: COLOR[b.id] }, t);
      el('text', { x: cx, y: by + 22, 'text-anchor': 'middle', class: 'bcount' }, t).textContent =
        (ideas.length ? `${known} of ${ideas.length} known` : 'No ideas yet') + (planned ? ` · ${planned} planned` : '');
    });
  }

  // The rail at the left: one diamond for each tier, numbered from 1 at the bottom, from simple at the ground to complex at
  // the top. It is gold up to the highest tier that has an idea the reader knows.
  function rail(g, d, intro) {
    const x = 74, top = L.yOf(M.T), bot = L.yOf(0);
    const r = el('g', { class: 'rail' + (intro ? ' fade' : '') }, g);
    const grad = el('linearGradient', { id: 'railFade', gradientUnits: 'userSpaceOnUse', x1: 0, y1: top - 60, x2: 0, y2: bot + 40 }, d.defs);
    [[0, 'rgba(230,196,119,0)'], [.12, 'rgba(230,196,119,.3)'], [.9, 'rgba(230,196,119,.3)'], [1, 'rgba(230,196,119,0)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, grad));
    el('line', { x1: x, y1: top - 60, x2: x, y2: bot + 40, stroke: 'url(#railFade)', 'stroke-width': 1 }, r);
    const reach = Math.max(-1, ...M.ids.filter(id => KNOWN.has(id)).map(id => M.nodes[id].tier));
    if (reach >= 0) el('line', { x1: x, y1: L.yOf(reach), x2: x, y2: bot + 26, stroke: '#e6c477', 'stroke-width': 1.6, class: 'reach', filter: 'url(#soft)' }, r);
    for (let t = 0; t <= M.T; t++) {
      const y = L.yOf(t), lit = t <= reach;
      el('line', { x1: x + 16, y1: y, x2: L.W - SIDE + 50, y2: y, stroke: 'rgba(150,170,255,.06)', 'stroke-dasharray': '1 8' }, r);
      el('path', { d: `M${x} ${y - 5}L${x + 5} ${y}L${x} ${y + 5}L${x - 5} ${y}Z`, fill: lit ? '#e6c477' : '#0b0f22', stroke: lit ? '#fbe7b0' : 'rgba(230,196,119,.45)', 'stroke-width': .9 }, r);
      el('text', { x: x - 16, y: y + 4, 'text-anchor': 'end', class: 'tnum' + (lit ? ' lit' : '') }, r).textContent = t + 1;
    }
    el('text', { x, y: top - 74, 'text-anchor': 'middle', class: 'tword' }, r).textContent = 'COMPLEX';
    el('path', { d: `M${x} ${top - 66}l-3.5 6h7z`, fill: 'rgba(230,196,119,.6)' }, r);
    el('text', { x, y: bot + 58, 'text-anchor': 'middle', class: 'tword' }, r).textContent = 'SIMPLE';
  }

  // One line from a need, lower in the tree, up to the socket under the idea that needs it.
  // lit: both are known. feed: the need is known, and the idea is ready, so light runs up the line into it. half: the need is
  // known, but the idea still needs something else. dark: the need is not known yet. plan: one of the two is planned.
  function kindOf(a, b) {
    if (PLANNED[a] || PLANNED[b]) return 'plan';
    if (!KNOWN.has(a)) return 'dark';
    if (KNOWN.has(b)) return 'lit';
    return isReady(b) ? 'feed' : 'half';
  }
  function edge(g, d, a, b, o) {
    const p = L.P[a], q = L.P[b], sa = stateOf(a), sb = stateOf(b), k = kindOf(a, b);
    const x1 = p.x, y1 = p.y - RADIUS[sa] - 6, x2 = q.x, y2 = q.y + socketY(M.nodes[b], sb);
    const dy = y1 - y2, c1 = dy * (.4 + hash(a + b) * .22), c2 = dy * (.36 + hash(b + a) * .22);
    const dd = `M${x1.toFixed(1)} ${y1.toFixed(1)}C${x1.toFixed(1)} ${(y1 - c1).toFixed(1)} ${x2.toFixed(1)} ${(y2 + c2).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    const e = el('g', { class: `edge k-${k}`, 'data-a': a, 'data-b': b }, g);
    const draws = o.intro || (o.learned === a && k !== 'dark');
    const at = o.intro ? 500 + M.nodes[a].tier * 230 + 260 : 250;
    const stroke = k === 'lit' ? d.line(x1, y1, x2, y2, '#e6c477', '#fbe7b0') : k === 'feed' ? d.line(x1, y1, x2, y2, '#e6c477', COLOR[M.nodes[b].area])
      : k === 'half' ? 'rgba(230,196,119,.5)' : k === 'plan' ? 'rgba(150,160,215,.3)' : 'rgba(160,170,225,.42)';
    // A dark edge on each side of the line, so that it reads over the stars of the galaxy.
    const casing = el('path', { d: dd, fill: 'none', stroke: '#03050c', 'stroke-opacity': .6, 'stroke-width': k === 'plan' ? 3 : 4, class: 'casing' }, e);
    if (draws && k !== 'plan') { casing.setAttribute('pathLength', 1); casing.classList.add('draw'); casing.style.animationDelay = at + 'ms'; }
    if (k === 'lit' || k === 'feed') el('path', { d: dd, fill: 'none', stroke: '#e6c477', 'stroke-width': 5, opacity: k === 'lit' ? .2 : .12, filter: 'url(#glow)', class: 'under' }, e);
    const line = el('path', { d: dd, fill: 'none', stroke, 'stroke-width': k === 'lit' ? 1.5 : k === 'feed' ? 1.3 : 1, class: 'line' }, e);
    if (k === 'plan') line.setAttribute('stroke-dasharray', '2 4');
    else if (draws) { line.setAttribute('pathLength', 1); line.classList.add('draw'); line.style.animationDelay = at + 'ms'; }
    // Light runs up a line into an idea that is ready to learn, and up every line of the path to the chosen idea.
    const flow = el('path', { d: dd, fill: 'none', stroke: '#fffbe8', 'stroke-width': 2, 'stroke-linecap': 'round', class: 'travel flow' + (k === 'feed' ? ' on' : '') + (draws ? ' late' : '') }, e);
    if (draws) flow.style.setProperty('--late', at + 700 + 'ms');
  }

  // One idea: a star, its name under it, and the socket under its name. Its look says where the reader stands with it.
  function node(g, d, id, o) {
    const N = M.nodes[id], st = stateOf(id), p = L.P[id], r = RADIUS[st], c = COLOR[N.area];
    const n = el('g', { class: `node s-${st}`, 'data-id': id, transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})` }, g);
    const body = el('g', { class: 'body' }, n);
    const art = el('g', { class: 'art' + (o.intro ? ' ignite' : '') + (o.learned === id ? ' learned' : '') }, body);
    if (o.intro) art.style.animationDelay = 380 + N.tier * 230 + hash(id) * 160 + 'ms';
    const sparkle = (R, w) => `M0 ${-R}L${w} ${-w}L${R} 0L${w} ${w}L0 ${R}L${-w} ${w}L${-R} 0L${-w} ${-w}Z`;
    if (st === 'known') {
      el('circle', { r: r * 3.8, fill: d.halo('#e6c477', 1), class: 'halo' }, art);
      el('path', { d: `M${-r * 2.9} 0L0 -1.1L${r * 2.9} 0L0 1.1ZM0 ${-r * 2.9}L1.1 0L0 ${r * 2.9}L-1.1 0Z`, fill: '#fffbea', opacity: .75, filter: 'url(#soft)', class: 'rays' }, art);
      el('circle', { r: r + 4, fill: 'none', stroke: 'rgba(230,196,119,.35)', 'stroke-width': .8 }, art);
      el('circle', { r, fill: 'rgba(42,32,10,.9)', stroke: '#e6c477', 'stroke-width': 1.4 }, art);
      el('path', { d: sparkle(r * .72, r * .2), fill: '#fff3cf' }, art);
      el('circle', { r: 2.2, fill: '#fff' }, art);
    } else if (st === 'ready') {
      el('circle', { r: r * 3.4, fill: d.halo(c, .9), class: 'pulse' }, art);
      const spin = el('g', { class: 'spin' }, art);
      el('circle', { r: r + 6, fill: 'none', stroke: c, 'stroke-width': .9, 'stroke-dasharray': '1.5 4.2', opacity: .85 }, spin);
      el('circle', { r, fill: 'rgba(6,9,22,.92)', stroke: c, 'stroke-width': 1.5 }, art);
      el('path', { d: `M${-r * 1.9} 0L0 -.8L${r * 1.9} 0L0 .8ZM0 ${-r * 1.9}L.8 0L0 ${r * 1.9}L-.8 0Z`, fill: '#fff', opacity: .7 }, art);
      el('circle', { r: 4.2, fill: '#fff' }, art);
      if (o.unlocked && o.unlocked.includes(id)) { art.classList.add('unlocking'); lock(el('g', { class: 'lockfx' }, body)); }
    } else if (st === 'locked') {
      el('circle', { r: r + 3, fill: d.halo('#8d92a8', .25) }, art);
      el('circle', { r, fill: '#080b18', stroke: 'rgba(170,170,205,.32)', 'stroke-width': 1 }, art);
      lock(el('g', { class: 'lock' }, art));
    } else if (st === 'studying') {
      el('circle', { r: r * 3.6, fill: d.halo('#e6c477', 1.1), class: 'halo' }, art);
      const turn = el('g', { class: 'turn' }, art);
      el('circle', { r: r + 9, fill: 'none', stroke: 'rgba(230,196,119,.3)' }, turn);
      for (let i = 0; i < 48; i++) {
        const a = i / 48 * Math.PI * 2, r2 = r + (i % 4 ? 12 : 15);
        el('line', { x1: Math.cos(a) * (r + 9), y1: Math.sin(a) * (r + 9), x2: Math.cos(a) * r2, y2: Math.sin(a) * r2, stroke: 'rgba(230,196,119,.5)', 'stroke-width': .7 }, turn);
      }
      el('circle', { r, fill: 'rgba(30,24,10,.92)', stroke: 'rgba(230,196,119,.45)', 'stroke-width': 1.2 }, art);
      const done = STUDYING.done / Math.max(1, studyLength(id));
      el('circle', { r, fill: 'none', stroke: '#fbe7b0', 'stroke-width': 2.4, pathLength: 1, 'stroke-dasharray': `${done} 1`, transform: 'rotate(-90)', 'stroke-linecap': 'round' }, art);
      el('path', { d: sparkle(r * .8, r * .2), fill: '#fbe7b0' }, art);
      el('circle', { r: 2.4, fill: '#fff' }, art);
    } else {
      el('circle', { r: r * 2.6, fill: d.halo('#c8c8ec', .22) }, art);
      el('circle', { r, fill: 'rgba(6,9,22,.7)', stroke: 'rgba(205,205,240,.55)', 'stroke-width': 1, 'stroke-dasharray': '1.6 2.4' }, art);
      el('circle', { r: 1.6, fill: 'rgba(230,230,255,.65)' }, art);
    }
    // The name, and under it the socket that lines come up to. The study in progress says how far the reader is.
    const lines = nameLines(N), t = el('text', { class: 'name' + (o.intro ? ' fade' : ''), 'text-anchor': 'middle', y: r + 17 }, n);
    if (o.intro) t.style.animationDelay = 520 + N.tier * 230 + 'ms';
    lines.forEach((line, i) => { el('tspan', { x: 0, dy: i ? 14 : 0 }, t).textContent = line; });
    if (st === 'studying') {
      const s = el('text', { class: 'sub', 'text-anchor': 'middle', y: r + 17 + lines.length * 14 + 2 }, n);
      s.textContent = `STUDYING · ${STUDYING.done} OF ${studyLength(id)}`;
    }
    if (N.lines.length) {
      const sy = socketY(N, st), on = st !== 'planned' && N.needs.every(x => KNOWN.has(x));
      el('path', { d: `M0 ${sy - 3.5}L3.5 ${sy}L0 ${sy + 3.5}L-3.5 ${sy}Z`, class: 'socket', fill: on ? c : '#0b0f22', stroke: on ? c : st === 'planned' ? 'rgba(150,160,215,.3)' : 'rgba(170,170,205,.45)', 'stroke-width': .8 }, n);
    }
    el('rect', { x: -SLOT / 2 + 10, y: -r - 14, width: SLOT - 20, height: socketY(N, st) + r + 20, fill: 'transparent', class: 'hit' }, n);
  }

  // Where the shadow behind an idea and its name goes: around its star and name, and as wide as the name. The shadow is light,
  // so the aurora and the galaxy still show through it, and the name, with its own dark outline, is easy to read over them.
  function shadowOf(id) {
    const N = M.nodes[id], st = stateOf(id), p = L.P[id], r = RADIUS[st];
    let w = 0;
    svg.querySelectorAll(`.node[data-id="${id}"] .name tspan`).forEach(t => { w = Math.max(w, t.getComputedTextLength()); });
    if (!w) w = Math.max(...nameLines(N).map(line => line.length)) * 9;
    const top = -r - 18, bottom = socketY(N, st) + 8;
    return { x: p.x, y: p.y + (top + bottom) / 2, rx: Math.max(56, w / 2 + 32), ry: (bottom - top) / 2 + 26 };
  }

  // A lock as on an old door: a tall arched shackle over a body shaped like a shield, with a keyhole and two rivets.
  function lock(g) {
    el('path', { d: 'M-3.4 -1.6V-4.4A3.4 3.4 0 0 1 3.4 -4.4V-1.6', fill: 'none', stroke: '#9c97b4', 'stroke-width': 1.4, class: 'shackle' }, g);
    el('path', { d: 'M-5.4 -1.8H5.4V2.2C5.4 5.2 2.7 7.1 0 8.3C-2.7 7.1 -5.4 5.2 -5.4 2.2Z', fill: '#1b1c2c', stroke: '#9c97b4', 'stroke-width': .9 }, g);
    el('circle', { cx: 0, cy: 1.3, r: 1.25, fill: '#04050b' }, g);
    el('path', { d: 'M-.7 2L.7 2L1.1 4.9L-1.1 4.9Z', fill: '#04050b' }, g);
    [-3.6, 3.6].forEach(x => el('circle', { cx: x, cy: .1, r: .5, fill: '#9c97b4' }, g));
  }

  // ---------- The chosen idea, and the path to it ----------
  // Choosing an idea shows the path to it: every idea on it is numbered in teaching order, light runs up each line of the
  // path, and the rest of the tree dims. The ideas the reader knows that the path starts from stay bright.
  function focus(id, tell = true) {
    if (!svg || !L) return;
    sel = id && M.nodes[id] ? id : null;
    // Everything the chosen idea stands on, down to the ground: the ideas the reader still has to learn, which are on its path,
    // and the ideas the reader knows, which stay bright too. Every line between them lights, so a known idea, such as a
    // closure, still shows the line down to the function it is built on.
    const P = pathOf(sel), below = new Set();
    (function walk(i) { needsOf(i).forEach(n => { if (M.nodes[n] && !below.has(n)) { below.add(n); walk(n); } }); })(sel);
    const lineage = new Set([...below, ...(sel ? [sel] : [])]);
    svg.classList.toggle('focus', !!sel);
    svg.querySelectorAll('.node').forEach(n => {
      const i = n.dataset.id;
      n.classList.toggle('chosen', i === sel);
      n.classList.toggle('onpath', P.ids.has(i));
      n.classList.toggle('start', below.has(i) && !P.ids.has(i));
    });
    svg.querySelectorAll('.edge').forEach(e => e.classList.toggle('onpath', lineage.has(e.dataset.b) && below.has(e.dataset.a)));
    const marks = svg.querySelector('.marks'); marks.innerHTML = '';
    if (sel) {
      const p = L.P[sel], r = RADIUS[stateOf(sel)];
      const ring = el('g', { transform: `translate(${p.x} ${p.y})`, class: 'selring' }, marks), spin = el('g', { class: 'spinslow' }, ring);
      el('circle', { r: r + 22, fill: 'none', stroke: 'rgba(230,196,119,.3)' }, spin);
      el('circle', { r: r + 32, fill: 'none', stroke: 'rgba(230,196,119,.14)', 'stroke-dasharray': '2 5' }, spin);
      for (let i = 0; i < 60; i++) {
        const a = i / 60 * Math.PI * 2, r1 = r + 22, r2 = r + (i % 5 ? 26 : 30);
        el('line', { x1: Math.cos(a) * r1, y1: Math.sin(a) * r1, x2: Math.cos(a) * r2, y2: Math.sin(a) * r2, stroke: 'rgba(230,196,119,.4)', 'stroke-width': .7 }, spin);
      }
      // The number of each idea on the path, in a diamond to the upper left of its star.
      for (const nid in P.nums) {
        if (!L.P[nid] || KNOWN.has(nid)) continue;
        const q = L.P[nid], rr = RADIUS[stateOf(nid)], text = P.nums[nid].join(' · '), w = Math.max(24, text.length * 7.6 + 12);
        const b = el('g', { transform: `translate(${q.x - rr - 10 - w / 2} ${q.y - rr - 8})`, class: 'num fade' }, marks);
        el('path', { d: `M${-w / 2} 0L${-w / 2 + 7} -9H${w / 2 - 7}L${w / 2} 0L${w / 2 - 7} 9H${-w / 2 + 7}Z`, fill: 'rgba(8,10,24,.92)', stroke: 'rgba(230,196,119,.7)', 'stroke-width': .8 }, b);
        el('text', { y: 3.8, 'text-anchor': 'middle' }, b).textContent = text;
      }
    }
    if (tell && api.onSelect) api.onSelect(sel, P);
  }
  // Chooses an idea, and scrolls the tree so that it is in view.
  function select(id, scroll = true) {
    focus(id);
    if (!scroll || !sel) return;
    const n = svg.querySelector(`.node[data-id="${sel}"]`).getBoundingClientRect(), b = box.getBoundingClientRect();
    if (n.top < b.top + 170 || n.bottom > b.bottom - 120) box.scrollBy({ top: n.top + n.height / 2 - (b.top + b.height * .55), behavior: 'smooth' });
  }

  // ---------- Learning an idea ----------
  // "I know this": the idea turns gold with a burst of light, the lines from it light up, and each idea that is ready because
  // of it opens its lock. saveKnown writes the change, as on every page. It returns the ideas that are ready because of it.
  function learn(id) {
    const before = new Set(M.ids.filter(i => !PLANNED[i] && isReady(i)));
    const at = where(id);
    KNOWN.add(id); saveKnown({ add: id });
    const unlocked = M.ids.filter(i => !PLANNED[i] && isReady(i) && !before.has(i) && i !== id);
    const keep = box.scrollTop;
    draw(view, { learned: id, unlocked });
    box.scrollTop = keep;
    const p = L.P[id], fx = svg.querySelector('.fx');
    if (p) { Sky.burst(fx, p.x, p.y, '#fbe7b0', 18); setTimeout(() => Sky.burst(fx, p.x, p.y, '#e6c477', 30), 160); }
    unlocked.forEach((u, i) => setTimeout(() => { const q = L.P[u]; if (q) Sky.burst(fx, q.x, q.y, COLOR[M.nodes[u].area], 16); }, 900 + i * 220));
    Sky.sound.hear(at ? at.x / innerWidth : .5);
    focus(sel);
    return unlocked;
  }

  // Where an idea's star is on the screen.
  function where(id) {
    const n = svg && svg.querySelector(`.node[data-id="${id}"] .art`);
    if (!n) return null;
    const b = n.getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }

  // ---------- The pointer ----------
  // Pointing at an idea shows its card and lights the lines up to it from the ideas it needs. Clicking an idea chooses it, and
  // clicking the chosen idea again examines it, unless it is locked or planned. Dragging the sky scrolls the tree.
  const card = id => {
    const st = stateOf(id), N = M.nodes[id], miss = unknownNeedsOf(id).map(n => (IDEAS[n] || PLANNED[n]).name);
    const note = { known: 'Known', ready: 'Ready to learn', studying: stateText(id), planned: 'Planned · not in the library yet',
      locked: `Locked · learn ${miss.length > 2 ? miss.slice(0, -1).join(', ') + ', and ' + miss[miss.length - 1] : miss.join(' and ')} first` }[st];
    return { name: N.name, first: Library.escapeHTML(N.first), note, tone: st === 'known' ? 'known' : st === 'ready' ? 'ready' : '' };
  };
  let hovered = null, drag = null, armed = null;
  box.addEventListener('pointerover', e => {
    const n = e.target.closest('.node'); if (!n || n.dataset.id === hovered) return;
    hovered = n.dataset.id;
    svg.querySelectorAll('.edge').forEach(x => x.classList.toggle('hot', x.dataset.b === hovered));
    n.classList.add('hover');
    const p = where(hovered);
    if (hovered !== sel) Sky.show(card(hovered), p.x, p.y);
  });
  box.addEventListener('pointerout', e => {
    const n = e.target.closest('.node'); if (!n) return;
    if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.node') === n) return;
    n.classList.remove('hover'); hovered = null; Sky.hide();
    svg.querySelectorAll('.edge.hot').forEach(x => x.classList.remove('hot'));
  });
  box.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    drag = { y: e.clientY, x: e.clientX, top: box.scrollTop, left: box.scrollLeft, moved: false };
  });
  addEventListener('pointermove', e => {
    if (drag && (drag.moved || Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5)) {
      drag.moved = true; box.classList.add('dragging');
      box.scrollTop = drag.top - (e.clientY - drag.y); box.scrollLeft = drag.left - (e.clientX - drag.x);
    }
    const n = e.target.closest && e.target.closest('.node'), on = n && n.dataset.id === sel && examinable(sel);
    if (on && armed !== sel) { armed = sel; Sky.hint.arm(e.clientX, e.clientY); }
    else if (on) Sky.hint.move(e.clientX, e.clientY);
    else if (armed) { armed = null; Sky.hint.cancel(); }
  });
  addEventListener('pointerup', () => { setTimeout(() => { drag = null; box.classList.remove('dragging'); }, 0); });
  const examinable = id => ['known', 'ready', 'studying'].includes(stateOf(id));
  box.addEventListener('click', e => {
    if (drag && drag.moved) return;
    const n = e.target.closest('.node');
    if (!n) { if (sel) focus(null); return; }
    const id = n.dataset.id;
    Sky.hint.cancel(); armed = null;
    if (id !== sel) { Sky.hide(); select(id, false); return; }
    if (examinable(id)) { const p = where(id); if (api.onExamine) api.onExamine(id, p.x, p.y); }
    else if (stateOf(id) === 'locked') { const l = n.querySelector('.lock'); l.classList.remove('rattle'); void l.getBoundingClientRect(); l.classList.add('rattle'); }
  });

  // Where each branch is, for aurora.js: the size of the tree's drawing in its own units, its scale, where its ideas start, and
  // for each branch its middle, half its width, the top of its aurora, the line its curtains rise from, and the share of its
  // ideas the reader knows.
  function auroraInfo() {
    const base = L.yOf(0) + 60;
    return { W: L.fullW, H: L.fullH, scale, ox: L.ox, oy: L.oy, branches: L.branches.filter(b => b.ids.length).map(b => {
      const ideas = b.ids.filter(id => IDEAS[id]);
      return { id: b.id, cx: b.cx, half: b.w / 2, top: Math.min(...b.ids.map(id => L.P[id].y)) - 170, base,
        known: ideas.length ? ideas.filter(id => KNOWN.has(id)).length / ideas.length : 0 };
    }) };
  }

  return Object.assign(api, { draw, select, focus, learn, pathOf, stateOf, where, COLOR,
    selected: () => sel, model: () => M, has: id => !!(M && M.nodes[id]), node: id => M && M.nodes[id], redraw: () => { if (view) { const k = box.scrollTop; draw(view); box.scrollTop = k; } } });
})();
