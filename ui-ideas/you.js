// The user icon, in the far top-right corner of every page of the star theme, and its panel: logging in, and the reader's level
// and skills. Each page loads it after pages.js, and its header ends with <a class="you" id="you">, after the harp.
// There are no accounts yet. Logging in keeps only the name the reader types, in this browser's localStorage, and sends it
// nowhere. Logged in, the panel shows the reader's level and one skill for each constellation, as Skyrim shows its skills.
// Every number in it is a count from the library: the level is how many ideas the reader knows, a skill is how many ideas of
// that constellation they know, and the ideas ready to learn are the ideas whose needs they all know.
// At the bottom of the panel, logged in or out, is Settings, which shows one volume for the music and one for the sound effects.
// sky.js draws the panel's edge and its emblem, and opens and closes it.

const You = (() => {
  const { el, sparkle } = Sky;
  const USER_KEY = 'stoicheiaUser', you = document.getElementById('you');
  // A fine gold outline of a person, with a small star beside it. Logged in, its head is filled with gold.
  you.innerHTML = `<svg width="26" height="26" viewBox="-12 -12 24 24" fill="none" stroke="#e6c477" stroke-width="1.2" stroke-linecap="round">
    <circle class="head" cx="-1" cy="-3.6" r="3.6"/>
    <path d="M-8.5 9.5C-8.5 4.6 -5.2 1.8 -1 1.8C3.2 1.8 6.5 4.6 6.5 9.5"/>
    <path d="M8.5 -10L9.1 -8.1L11 -7.5L9.1 -6.9L8.5 -5L7.9 -6.9L6 -7.5L7.9 -8.1Z" fill="#fbe7b0" stroke="none"/>
  </svg>`;
  you.setAttribute('role', 'button'); you.setAttribute('aria-expanded', 'false');
  const pane = Sky.panel('youPanel', you), youBody = pane.body;
  // A number from 0 to 1 that is always the same for the same text, so each star of a name is in the same place on every load.
  function hash(text) { let h = 2166136261; for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return ((h >>> 0) % 10000) / 10000; }
  function savedUser() {
    try { const u = JSON.parse(localStorage.getItem(USER_KEY)); return u && typeof u.name === 'string' && u.name.trim() ? { name: u.name.trim() } : null; } catch (e) { return null; }
  }
  let user = savedUser(), youView = null, logging = false;
  you.classList.toggle('in', !!user);
  pane.onHide = () => { youView = null; };

  // Logged out, the disc of the emblem shows the outline of a person with a small star, as the icon in the top bar does.
  function drawPerson(fig) {
    const g = el('g', { transform: 'scale(3) translate(-1.3 .3)', fill: 'none', stroke: 'rgba(230,196,119,.75)', 'stroke-width': .4, 'stroke-linecap': 'round' }, fig);
    el('circle', { cx: -1, cy: -3.6, r: 3.6 }, g);
    el('path', { d: 'M-8.5 9.5C-8.5 4.6 -5.2 1.8 -1 1.8C3.2 1.8 6.5 4.6 6.5 9.5' }, g);
    el('path', { d: sparkle(8.5, -7.5, 2.6), fill: '#fbe7b0', stroke: 'none', class: 'halo' }, g);
  }
  // The stars of a name: one star for each letter, in the order the letters are typed. Each star's place comes only from the
  // text up to its letter, so typing one more letter adds one star and leaves the stars before it where they were. Each star is
  // 11 to 19 units from the star before it, inside the disc, as far as it can be from the other stars, and its line crosses no
  // other line when it can.
  function nameStars(name) {
    const stars = [];
    const side = (p, q, r) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
    const crosses = (a, b, c, d) => side(a, b, c) !== side(a, b, d) && side(c, d, a) !== side(c, d, b);
    let text = '';
    for (const ch of name) {
      text += ch;
      if (!/\p{L}/u.test(ch)) continue;
      const r = .9 + hash(text + '·r') * .8;
      if (!stars.length) { stars.push({ x: 0, y: 0, r: 1.9, bend: 0 }); continue; }
      const last = stars[stars.length - 1];
      let best = null;
      for (let k = 0; k < 16; k++) {
        const a = hash(text + '·a' + k) * Math.PI * 2, step = 11 + hash(text + '·s' + k) * 8;
        const p = { x: last.x + Math.cos(a) * step, y: last.y + Math.sin(a) * step };
        if (Math.hypot(p.x, p.y) > 34) continue;
        const room = Math.min(...stars.map(q => Math.hypot(p.x - q.x, p.y - q.y)));
        const cross = stars.slice(1, -1).some((q, i) => crosses(stars[i], q, last, p));
        const score = room - (cross ? 60 : 0);
        if (!best || score > best.score) best = { ...p, score };
      }
      // When every place is outside the disc, the star goes toward the middle.
      if (!best) { const t = 14 / Math.hypot(last.x, last.y); best = { x: last.x * (1 - t), y: last.y * (1 - t) }; }
      stars.push({ x: best.x, y: best.y, r, bend: (hash(text + '·b') - .5) * .5 });
    }
    return stars;
  }
  // Draws the stars of a name in the disc, and moves the figure to stay in the middle of it. The stars from fresh on are new:
  // each one lights up, and the line to it draws itself. With step, they light up one after another, step milliseconds apart;
  // without it, together. With no letters, a faint point marks the middle, where the first star appears.
  function drawName(fig, name, fresh = 0, step = 0) {
    const stars = nameStars(name);
    fig.textContent = '';
    if (!stars.length) {
      fig.style.transform = 'translate(0px,0px)';
      el('circle', { r: 2.6, fill: 'none', stroke: 'rgba(230,196,119,.7)', 'stroke-width': .6, 'stroke-dasharray': '1.2 1.5', class: 'yseed' }, fig);
      el('circle', { r: .9, fill: '#fbe7b0', class: 'yseed' }, fig);
      return stars;
    }
    const xs = stars.map(p => p.x), ys = stars.map(p => p.y);
    fig.style.transform = `translate(${-(Math.min(...xs) + Math.max(...xs)) / 2}px,${-(Math.min(...ys) + Math.max(...ys)) / 2}px)`;
    // Typing, a new star lights up when the line to it has nearly reached it.
    const at = step ? { star: i => 150 + (i - fresh) * step, line: i => 150 + (i - 1 - fresh) * step, length: step } : { star: i => i ? 220 : 0, line: () => 0, length: 320 };
    stars.forEach((p, i) => {
      if (!i) return;
      const q = stars[i - 1], dx = p.x - q.x, dy = p.y - q.y;
      const line = el('path', { d: `M${q.x} ${q.y}Q${(q.x + p.x) / 2 - dy * p.bend} ${(q.y + p.y) / 2 + dx * p.bend} ${p.x} ${p.y}`, pathLength: 1, class: 'yline' + (i >= fresh ? ' fresh' : '') }, fig);
      if (i >= fresh) { line.style.animationDelay = at.line(i) + 'ms'; line.style.animationDuration = at.length + 'ms'; }
    });
    stars.forEach((p, i) => {
      const s = el('g', { class: 'ig ystar' + (i >= fresh ? ' fresh' : '') }, el('g', { transform: `translate(${p.x} ${p.y})` }, fig));
      if (i >= fresh) s.style.animationDelay = at.star(i) + 'ms';
      el('circle', { r: p.r * 5, fill: 'url(#youStarHalo)', class: 'halo', style: `animation-delay:${(-hash(name + i) * 4).toFixed(2)}s` }, s);
      if (!i) el('path', { d: sparkle(0, 0, p.r * 3.6), fill: '#fffbea', opacity: .8 }, s);
      el('circle', { r: p.r, fill: '#fffaf0' }, s);
    });
    return stars;
  }

  // view is 'out' to offer logging in, 'form' for the login form, 'in' for the level and skills, 'settings' for the two volumes,
  // or null to close the panel. After logging in, lit is true: the stars of the name are already lit, so they do not light up again.
  function showYou(view, lit = false) {
    youView = view;
    you.classList.toggle('in', !!user);
    if (!view) { pane.hide(); return; }
    const bar = (n, of) => `<div class="ybar"><i style="width:${of ? (n / of * 100).toFixed(1) : 0}%"></i></div>`;
    const button = (act, cls = '') => `<button class="ybtn ${cls}" data-act="${act}"><i>✦</i>Log in<i>✦</i></button>`;
    const tools = () => `<div class="ytools"><a class="ysettings" data-act="settings"><i>✧</i>Settings</a></div>`;
    let rest;
    if (view === 'out') rest = `<div class="ytitle"><span>Your account</span></div>
      <p class="ylead">You are not logged in.</p><div>${button('form')}</div>${tools()}`;
    else if (view === 'form') rest = `<div class="ytitle"><span>Log in</span></div>
      <label class="ycart"><i class="l"></i><i class="r"></i><span class="yfield"><input id="yName" placeholder="Your name" maxlength="24" autocomplete="nickname" spellcheck="false"></span></label>
      <p class="yhint">Each letter you type adds a star above.</p>
      <div>${button('login', 'dim')}</div><a class="yquiet" data-act="out">Cancel</a>
      <p class="ynote">Stoicheia has no accounts yet. Your name is kept in this browser only, and is sent nowhere.</p>`;
    else if (view === 'settings') {
      // The music's volume is the volume now, which a song's volume preset can make lower than the reader's.
      const s = { ...Sky.sound.settings(), musicVol: Sky.sound.musicVolume() };
      rest = `<div class="ytitle"><span>Settings</span></div>` +
        [['musicVol', 'Music'], ['moveVol', 'Sound effects']].map(([k, name]) => `<label class="yvol"><div class="ytop"><span>${name.toUpperCase()}</span><b>${Math.round(s[k] * 100)}</b></div>
          <span class="yrange"><input type="range" data-vol="${k}" min="0" max="1" step="0.01" value="${s[k]}" style="--p:${s[k]}" aria-label="${name}"></span></label>`).join('') +
        `<a class="yquiet" data-act="back">Back</a>`;
    } else {
      const all = Object.keys(IDEAS), known = all.filter(id => KNOWN.has(id)).length, ready = all.filter(isReady).length;
      rest = `<div class="yname">${Library.escapeHTML(user.name)}</div>
        <div class="ylevel"><span class="caps">Level</span><b>${known}</b></div>${bar(known, all.length)}
        <div class="ysmall">${known} of ${all.length} ideas known</div>
        <div class="rule">✦</div><div class="caps ygold">Skills</div>` +
        constellationInfo().map(c => `<div class="yskill" data-go="${c.id}"><div class="ytop"><span>${c.name.toUpperCase()}</span><b>${c.known}</b></div>${bar(c.known, c.ideas)}
          <div class="ysmall">${c.ideas ? `${c.known} of ${c.ideas} ideas known` : 'No ideas yet'}</div></div>`).join('') +
        `<div class="rule">✦</div><div class="yperk"><span>Ideas ready to learn</span><b>${ready}</b></div>
        ${tools()}<div class="yfoot"><a data-act="logout">Log out</a></div>`;
    }
    pane.show(body => {
      body.className = 'ybody yv-' + view;
      // Right after logging in, the emblem stays where it is, with its stars lit, and only what is under it changes.
      // Settings has no emblem: it shows only the two volumes.
      let box = lit && body.querySelector('.yemblem'), fig;
      if (box) {
        [...body.children].forEach(c => { if (c !== box) c.remove(); });
        box.classList.remove('sealed'); box.classList.add('still');
        box.insertAdjacentHTML('afterend', rest);
        fig = box.querySelector('.yfig');
      } else if (view === 'settings') body.innerHTML = rest;
      else {
        body.innerHTML = `<div class="yemblem"></div>${rest}`;
        box = body.firstElementChild; fig = Sky.emblem(box, 'you');
      }
      if (view === 'out') drawPerson(fig);
      else if (view === 'in') { if (!lit) drawName(fig, user.name, 0, 110); }
      else if (view === 'settings') {
        // Moving a volume changes the sound at once. With all sound off, both volumes are dim, and can still be moved. Letting
        // go of the volume of the sound effects plays the sound of a page arriving, at the new volume.
        body.querySelectorAll('[data-vol]').forEach(r => r.addEventListener('input', () => {
          r.style.setProperty('--p', r.value);
          r.closest('.yvol').querySelector('b').textContent = Math.round(r.value * 100);
          Sky.sound.choose(r.dataset.vol, +r.value);
        }));
        body.querySelector('[data-vol="moveVol"]').addEventListener('change', () => Sky.sound.hear());
      } else {
        const input = body.querySelector('#yName'), go = body.querySelector('[data-act="login"]');
        let shown = 0;
        drawName(fig, '');
        input.addEventListener('input', () => {
          input.style.fontSize = '';
          for (let size = 17; input.scrollWidth > input.clientWidth && size > 12; size -= .5) input.style.fontSize = size - .5 + 'px';
          const n = nameStars(input.value).length;
          drawName(fig, input.value, n > shown ? shown : Infinity);
          shown = n;
          go.classList.toggle('dim', !input.value.trim());
        });
        input.addEventListener('keydown', e => { if (e.key === 'Enter') logIn(); });
      }
    });
    if (view === 'form') document.getElementById('yName').focus();
  }
  // Logging in lights every star of the name at once, then the panel shows the reader's level and skills, under the same stars.
  function logIn() {
    const input = document.getElementById('yName'), name = input.value.trim();
    if (logging) return;
    if (!name) {
      const cart = input.closest('.ycart');
      cart.classList.remove('nudge'); void cart.offsetWidth; cart.classList.add('nudge');
      input.focus(); return;
    }
    logging = true;
    user = { name };
    try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch (e) {}
    you.classList.add('in');
    const box = youBody.querySelector('.yemblem'), fig = box.querySelector('.yfig');
    box.classList.add('sealed');
    nameStars(name).forEach((p, i) => setTimeout(() => Sky.burst(fig, p.x, p.y, '#fbe7b0', 3), i * 35));
    setTimeout(() => { logging = false; if (youView === 'form') showYou('in', true); }, 750);
  }

  // Clicking a skill goes into its constellation on Home. Home sets onSkill, so that it goes there without a page load.
  const api = { onSkill: id => Sky.go(`index.html?constellation=${id}`) };
  youBody.addEventListener('click', e => {
    const act = e.target.closest('[data-act]'), go = e.target.closest('[data-go]');
    if (act) {
      const a = act.dataset.act;
      if (a === 'form' || a === 'out' || a === 'settings') showYou(a);
      if (a === 'back') showYou(user ? 'in' : 'out');
      if (a === 'login') logIn();
      if (a === 'logout') { user = null; try { localStorage.removeItem(USER_KEY); } catch (err) {} showYou('out'); }
    } else if (go) { showYou(null); api.onSkill(go.dataset.go); }
  });
  // Clicking the icon opens its panel, or closes it. sky.js closes it on a click outside the icon and the panel, and on Escape.
  you.onclick = () => showYou(youView ? null : user ? 'in' : 'out');
  return api;
})();
