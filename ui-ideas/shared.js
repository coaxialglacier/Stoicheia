// Stoicheia formats: the helpers that every mockup shares.

const ICONS = {
  // A concept is made of its own parts, so its icon is two stacked squares.
  concept: '<svg class="ico" viewBox="0 0 10 10"><rect x="3" y="0.8" width="6.2" height="6.2" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="0.8" y="3" width="6.2" height="6.2" rx="1.2" fill="currentColor"/></svg>',
};

const KIND_COLOR = { fact: '#5dcaa5', step: '#f0997b', concept: '#afa9ec', known: '#8d8a81' };

// Draws a curve from point a to point b, in a gradient from color ca to color cb.
// opts: horizontal (the curve leaves and enters sideways), animate (the curve is drawn in), travel (seconds for a dot to move along it),
// op (opacity), dash, width.
let gradId = 0;
function curve(svg, a, b, ca, cb, opts = {}) {
  const ns = 'http://www.w3.org/2000/svg';
  const id = 'g' + (gradId++);
  const g = document.createElementNS(ns, 'linearGradient');
  g.setAttribute('id', id); g.setAttribute('gradientUnits', 'userSpaceOnUse');
  g.setAttribute('x1', a.x); g.setAttribute('y1', a.y); g.setAttribute('x2', b.x); g.setAttribute('y2', b.y);
  g.innerHTML = `<stop offset="0" stop-color="${ca}" stop-opacity="${opts.op ?? 0.75}"/><stop offset="1" stop-color="${cb}" stop-opacity="${opts.op ?? 0.75}"/>`;
  svg.appendChild(g);
  const p = document.createElementNS(ns, 'path');
  const d = opts.horizontal
    ? `M${a.x},${a.y} C${(a.x + b.x) / 2},${a.y} ${(a.x + b.x) / 2},${b.y} ${b.x},${b.y}`
    : `M${a.x},${a.y} C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y}`;
  p.setAttribute('d', d);
  p.setAttribute('class', 'edge');
  p.setAttribute('stroke', `url(#${id})`);
  if (opts.dash) p.setAttribute('stroke-dasharray', opts.dash);
  if (opts.width) p.setAttribute('stroke-width', opts.width);
  svg.appendChild(p);
  if (opts.animate) {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    p.classList.add('draw');
  }
  if (opts.travel) {
    // A small dot moves along the curve, from a to b.
    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('r', '2.6'); dot.setAttribute('fill', cb);
    dot.innerHTML = `<animateMotion dur="${opts.travel}s" repeatCount="indefinite" path="${d}"/>`;
    svg.appendChild(dot);
  }
  return p;
}

// Builds the code panel from a list of lines of HTML. Each line gets its number.
function codeLinesHTML(lines, tall) {
  return `<div class="cb${tall ? ' tall' : ''}">` + lines.map((l, i) => `<div class="cl" data-ln="${i + 1}"><span class="n">${i + 1}</span><span class="s">${l}</span></div>`).join('') + '</div>';
}

// Each part's name is written above its mark, centered on it. Two marks close together on one line, such as name: and "Ana"
// in greet(name: "Ana"), can have names wider than the marks, and the names then overlap. This moves the names on each line
// of the code in root sideways, so that at least gap pixels separate each name from the next, and the names move as little as they can:
// the sum of the squares of the moves is the smallest it can be. It measures the names, so it runs after the code is on the page,
// and again when the size of the code changes. A name that is hidden, such as the name of a known part, takes no room.
function spreadLabels(root, gap = 8) {
  root.querySelectorAll('.cl').forEach(line => {
    const marks = [...line.querySelectorAll('.mk[data-label]')];
    // Every name gets its own --dx, so that a mark inside another mark does not take the outer mark's move.
    marks.forEach(m => m.style.setProperty('--dx', '0px'));
    const names = marks.map(m => {
      const s = getComputedStyle(m, '::before'), w = parseFloat(s.width);
      if (s.display === 'none' || !w) return null;
      const shift = s.transform === 'none' ? 0 : new DOMMatrix(s.transform).m41;
      return { m, left: m.getBoundingClientRect().left + parseFloat(s.left) + shift, w };
    }).filter(Boolean).sort((a, b) => a.left - b.left);
    if (names.length < 2) return;
    // A name must start at least n.before pixels after the first name starts: the widths of the names before it, and a gap after each one.
    // So each name's start, less n.before, must not go down from one name to the next. Names that break that rule are joined into one group,
    // and every name in a group gets the mean of the group's wanted starts. This gives the smallest moves.
    let before = 0;
    const groups = [];
    const mean = g => g.sum / g.count;
    names.forEach(n => {
      n.before = before;
      before += n.w + gap;
      groups.push({ sum: n.left - n.before, count: 1 });
      while (groups.length > 1 && mean(groups[groups.length - 2]) > mean(groups[groups.length - 1])) {
        const last = groups.pop();
        groups[groups.length - 1].sum += last.sum;
        groups[groups.length - 1].count += last.count;
      }
    });
    let i = 0;
    groups.forEach(g => {
      for (let k = 0; k < g.count; k++, i++) {
        const n = names[i];
        n.m.style.setProperty('--dx', `${(mean(g) + n.before - n.left).toFixed(1)}px`);
      }
    });
  });
}

// The list of what the reader knows. In Stoicheia this list is known.json.
// names maps each id to the name shown in the list. onChange runs after an id is added or removed.
// save, when a page passes it, is called with each change, { add: id } or { remove: id }, so that the page can write it to known.json.
function knownList(names, known, onChange, save) {
  const top = document.querySelector('.top');
  top.insertAdjacentHTML('beforeend', '<button class="btn" id="knownBtn">What I know</button>');
  document.body.insertAdjacentHTML('beforeend', '<div class="klist" id="klist" hidden></div>');
  const panel = document.getElementById('klist');
  document.getElementById('knownBtn').onclick = () => { panel.hidden = !panel.hidden; };
  function render() {
    const ids = [...known];
    panel.innerHTML = '<div class="kk">What I know</div>' + (ids.length
      ? ids.map(id => `<div class="row"><span>${names[id]}</span><button class="btn" data-unknow="${id}">Remove</button></div>`).join('')
      : '<div class="none">Nothing yet. In Stoicheia, this list is known.json.</div>');
  }
  panel.addEventListener('click', e => {
    const b = e.target.closest('[data-unknow]');
    if (b) { known.delete(b.dataset.unknow); render(); onChange(); if (save) save({ remove: b.dataset.unknow }); }
  });
  render();
  return { add(id) { known.add(id); render(); onChange(); if (save) save({ add: id }); }, render };
}

// Each mockup's note can be closed with its × button.
document.addEventListener('DOMContentLoaded', () => {
  const note = document.querySelector('.note');
  if (!note) return;
  note.insertAdjacentHTML('afterbegin', '<button class="x" title="Close" aria-label="Close">×</button>');
  note.querySelector('.x').onclick = () => note.classList.add('closed');
});

// The index page shows each mockup in a small frame with "?preview" in its address. The note is hidden there.
if (location.search.includes('preview')) document.documentElement.classList.add('preview');
