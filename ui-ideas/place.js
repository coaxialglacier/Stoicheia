// Places the stars of one figure of Home's night sky over its emblem. Home loads this script when its address has ?place=<id>,
// such as index.html?place=algorithms. The sky is drawn as Home draws it, and the figures keep still. library/site.js does not
// publish this script.
//
// Click the sky to add a star, and drag a star to move it, or move the chosen star with the arrow keys. 1 to 4 set the size of
// the chosen star, where 1 is the brightest. Shift-click a second star to join it to the chosen star with a line, or to remove
// the line between them. Every line is straight. Delete removes the chosen star and its lines. ⌘Z undoes. Every
// change is kept in localStorage under stoicheiaPlace:<id>. Copy code puts the figure's stars and edges on the clipboard, written
// as FIGURES in heavens.js has them.

(() => {
  const id = new URLSearchParams(location.search).get('place'), F = Heavens.figures[id];
  if (!F) return;
  const { el } = Sky, KEY = 'stoicheiaPlace:' + id, heavens = document.getElementById('heavens');
  const n2 = v => Math.round(v * 1000) / 1000;
  const copyOf = f => JSON.parse(JSON.stringify({ stars: f.stars, edges: f.edges }));
  const original = copyOf(F);
  let fig = read() || copyOf(original);
  let chosen = null, drag = null, numbers = true, pending = false;
  const history = [];

  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
  function keep() { try { localStorage.setItem(KEY, JSON.stringify(fig)); } catch {} }
  function push() { history.push(JSON.stringify(fig)); if (history.length > 200) history.shift(); }
  function undo() { if (!history.length) return; fig = JSON.parse(history.pop()); chosen = null; apply(); }

  // Gives FIGURES the figure as it is now, and draws it again, at most once each frame.
  function apply() {
    F.stars = fig.stars; F.edges = fig.edges;
    keep(); panel.update();
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; Heavens.redrawFigure(id); marks(); });
  }

  // ---------- Where a pointer is, in the figure's box from -1 to 1 ----------
  const spot = () => Heavens.spotOf(id);
  const inFigure = e => { const s = spot(); return [(e.clientX - s.x) / s.S, (e.clientY - s.y) / s.S]; };
  const onScreen = ([x, y]) => { const s = spot(); return [s.x + x * s.S, s.y + y * s.S]; };

  // ---------- A ring to grab each star by, with its number ----------
  const over = el('svg', { id: 'placing' }, heavens);
  over.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;cursor:crosshair';
  function marks() {
    if (!spot()) return;
    over.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
    over.innerHTML = '';
    fig.stars.forEach((st, i) => {
      const [x, y] = onScreen(st), g = el('g', { 'data-star': i, transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` }, over);
      g.style.cursor = 'grab';
      el('circle', { r: 13, fill: 'transparent' }, g);
      if (i === chosen) el('circle', { r: 12, fill: 'none', stroke: '#fbe7b0', 'stroke-width': 1.2, 'stroke-dasharray': '3 3' }, g);
      if (numbers) {
        const t = el('text', { x: 10, y: -10, fill: '#fbe7b0', 'font-family': 'Jost, sans-serif', 'font-size': 10.5, 'paint-order': 'stroke', stroke: '#05070f', 'stroke-width': 3, opacity: .85, 'pointer-events': 'none' }, g);
        t.textContent = i;
      }
    });
  }

  // ---------- Pointing and dragging ----------
  over.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const p = inFigure(e), hit = e.target.closest('[data-star]');
    if (!hit) { push(); fig.stars.push([n2(p[0]), n2(p[1]), 3]); chosen = fig.stars.length - 1; apply(); return; }
    const i = +hit.dataset.star;
    if (e.shiftKey && chosen != null && chosen !== i) { push(); join(chosen, i); apply(); return; }
    chosen = i; push(); drag = { i, moved: false };
    marks(); panel.update();
    over.setPointerCapture(e.pointerId);
  });
  over.addEventListener('pointermove', e => {
    if (!drag) return;
    const p = inFigure(e);
    drag.moved = true;
    fig.stars[drag.i][0] = n2(p[0]); fig.stars[drag.i][1] = n2(p[1]);
    apply();
  });
  over.addEventListener('pointerup', () => { if (drag && !drag.moved) history.pop(); drag = null; });

  // Joins two stars with a line, or removes the line between them.
  function join(a, b) {
    const i = fig.edges.findIndex(([p, q]) => (p === a && q === b) || (p === b && q === a));
    if (i >= 0) fig.edges.splice(i, 1);
    else fig.edges.push([a, b]);
  }
  // Removes a star and its lines. The stars after it move down one place in the list, so the lines are renumbered.
  function remove(i) {
    fig.edges = fig.edges.filter(([a, b]) => a !== i && b !== i).map(([a, b]) => [a > i ? a - 1 : a, b > i ? b - 1 : b]);
    fig.stars.splice(i, 1);
  }

  // ---------- Keys ----------
  addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    const k = e.key;
    if ((e.metaKey || e.ctrlKey) && k.toLowerCase() === 'z') { undo(); e.preventDefault(); }
    else if (/^[1-4]$/.test(k) && chosen != null) { push(); fig.stars[chosen][2] = +k; apply(); }
    else if ((k === 'Delete' || k === 'Backspace') && chosen != null) { push(); remove(chosen); chosen = null; apply(); e.preventDefault(); }
    else if (k.startsWith('Arrow') && chosen != null) {
      push();
      const step = e.shiftKey ? .02 : .005, st = fig.stars[chosen];
      if (k === 'ArrowLeft') st[0] = n2(st[0] - step); if (k === 'ArrowRight') st[0] = n2(st[0] + step);
      if (k === 'ArrowUp') st[1] = n2(st[1] - step); if (k === 'ArrowDown') st[1] = n2(st[1] + step);
      apply(); e.preventDefault();
    }
    else if (k === 'Escape') { chosen = null; marks(); panel.update(); }
  });

  // ---------- The code for heavens.js ----------
  function code() {
    return `      stars: [${fig.stars.map(([x, y, m]) => `[${n2(x)}, ${n2(y)}, ${m}]`).join(', ')}],\n`
      + `      edges: [${fig.edges.map(([a, b]) => `[${a}, ${b}]`).join(', ')}],`;
  }

  // ---------- The panel ----------
  const panel = (() => {
    const style = document.createElement('style');
    style.textContent = `
#placer{position:fixed;left:18px;top:74px;z-index:5;width:286px;padding:16px 18px 14px;background:rgba(7,9,22,.86);border:1px solid var(--goldDim);border-radius:3px;
  font-family:Jost,sans-serif;font-size:12.5px;color:var(--ink2);backdrop-filter:blur(6px);overflow:hidden}
#placer h2{margin:0 0 12px;font-family:Cinzel;font-weight:500;font-size:14px;letter-spacing:.24em;color:var(--gold2)}
#placer h2 small{font-size:11px;letter-spacing:.18em;color:var(--gold)}
#placer .row{display:flex;gap:8px;margin:0 0 10px}
#placer button{flex:1;padding:6px 8px;background:#0c1129;border:1px solid var(--goldDim);border-radius:2px;color:var(--gold2);font:inherit;font-size:11px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}
#placer button:hover{border-color:var(--gold);background:#141a3a}
#placer label{display:flex;align-items:center;gap:8px;margin:0 0 7px}
#placer .status{margin:0 0 10px;color:var(--ink3);font-size:11.5px;line-height:1.4}
#placer .chosen{margin:8px 0;color:var(--ink);min-height:17px}
#placer ul{margin:6px 0 12px;padding:0 0 0 14px;line-height:1.5;font-size:11.5px;color:var(--ink3)}
#placer kbd{font:inherit;color:var(--ink2)}
#placer textarea{display:block;width:100%;height:110px;box-sizing:border-box;margin:0;padding:6px;resize:none;background:#0c1129;border:1px solid var(--goldDim);border-radius:2px;
  color:var(--ink);font:11px/1.45 'JetBrains Mono',monospace;scrollbar-width:none}
#placer textarea::-webkit-scrollbar{display:none}
#placer textarea[hidden]{display:none}`;
    document.head.appendChild(style);
    const box = document.createElement('div');
    box.id = 'placer';
    const name = id[0].toUpperCase() + id.slice(1);
    box.innerHTML = `<h2>Place the stars <small>· ${name}</small></h2>
<label><input type="checkbox" data-numbers checked> Show star numbers</label>
<p class="chosen"></p>
<ul>
<li>Click the sky to add a star. Drag a star to move it, or move the chosen star with the arrow keys.</li>
<li><kbd>1</kbd> to <kbd>4</kbd>: size of the chosen star. 1 is the brightest.</li>
<li>Shift-click a second star: join it to the chosen star, or remove the line between them.</li>
<li><kbd>Delete</kbd>: remove the chosen star. <kbd>⌘Z</kbd>: undo.</li>
</ul>
<p class="status"></p>
<div class="row"><button data-copy>Copy code</button><button data-reset>Reset</button></div>
<textarea readonly spellcheck="false" hidden></textarea>`;
    document.body.appendChild(box);
    const $ = s => box.querySelector(s);
    $('[data-numbers]').addEventListener('change', e => { numbers = e.target.checked; marks(); });
    // Copies the code. When the browser does not allow the clipboard, the code is copied from a text box instead, and when that
    // fails too, the text box stays open with the code chosen, to copy by hand.
    const text = $('textarea');
    $('[data-copy]').addEventListener('click', async () => {
      const done = 'Copied. Paste it into FIGURES.' + id + ' in heavens.js, in place of its stars and edges.';
      text.value = code();
      try { await navigator.clipboard.writeText(text.value); text.hidden = true; panel.status(done); return; } catch {}
      text.hidden = false; text.focus(); text.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch {}
      if (copied) { text.hidden = true; panel.status(done); } else panel.status('The browser did not allow copying. The code is chosen in the box below: copy it with ⌘C.');
    });
    $('[data-reset]').addEventListener('click', () => { push(); fig = copyOf(original); chosen = null; apply(); panel.status('Back to the stars in heavens.js.'); });
    return {
      status(t) { $('.status').textContent = t; },
      update() {
        const st = chosen != null && fig.stars[chosen];
        $('.chosen').textContent = st ? `Star ${chosen}: at ${st[0]}, ${st[1]}, size ${st[2]}` : `${fig.stars.length} stars, ${fig.edges.length} lines`;
      },
    };
  })();

  // ---------- Start ----------
  Heavens.hold(true);
  Heavens.afterDraw = marks;
  addEventListener('resize', marks);
  apply();
})();
