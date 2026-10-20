// The teaching content that every Dependency Graph variation shows, and the code that draws it.
// The concept named is Captured variables, for a reader who does not know closures.
// The memory facts were checked with swiftc 6.2 at -Onone: the closure in makeGreeter() gets a context that holds greeting,
// and makeCounter(step:) keeps count in a heap box, then prints 2 and 4.

const ROOT = 'cv';

// A part's mark on the code. fp is the part it belongs to, label is the name written above it.
const mk = (fp, text, label) => `<span class="mk" data-fp="${fp}"${label ? ` data-label="${label}"` : ''}>${text}</span>`;
const kw = t => `<span class="kw">${t}</span>`;
const str = t => `<span class="str">${t}</span>`;

const LESSONS = {
  cv: {
    name: 'Captured variables',
    first: 'How <code>count</code> still exists after <code>makeCounter(step:)</code> has returned.',
    question: 'How does <code>count</code> still exist after <code>makeCounter(step:)</code> has returned?',
    deps: ['sf', 'ho', 'clv'],
    code: [
      `${kw('func')} makeCounter(step: Int) -> () -> Int {`,
      `    ${kw('var')} ${mk('count-frame', 'count', 'declared in the call')} = 0`,
      `    ${kw('return')} {`,
      `        count += step`,
      `        ${kw('return')} count`,
      `    }`,
      `}`,
      `${kw('let')} ${mk('count-context', 'counter', 'a closure value')} = makeCounter(step: 2)`,
      `print(counter())  <span class="cm">// 2</span>`,
      `print(counter())  <span class="cm">// 4</span>`,
    ],
    figure: 'cv',
    caption: '<b>After line 8.</b> The stack frame of <code>makeCounter(step:)</code> is removed, and <code>count</code> is in a box on the heap.',
    parts: [
      { id: 'count-frame', name: 'Where <code>count</code> starts', html: '<code>count</code> is declared inside <code>makeCounter(step:)</code>, so it would be kept in that call\'s stack frame. That frame is removed when the call returns.' },
      { id: 'count-box', name: 'Where <code>count</code> is kept', html: 'The closure captures <code>count</code>, and <code>count</code> is a variable, so Swift keeps it in a box: a heap object that holds <code>count</code>. The box is not part of the stack frame, so it is not removed with it.' },
      { id: 'count-context', name: 'How the closure finds it', html: '<code>counter</code> holds a closure value. Its context holds <code>step</code> and the address of the box. The box stays, because the context holds its address. Each call of <code>counter()</code> adds 2 to the <code>count</code> in the box, so line 9 prints 2 and line 10 prints 4.' },
    ],
    key: '<code>count</code> is kept in a box on the heap, and the closure\'s context holds the address of the box.',
    links: [['steps-in-memory.html', 'Watch it step by step in Steps in Memory →']],
  },
  sf: {
    name: 'Stack frame',
    first: 'The memory made for one function call.',
    why: '<code>count</code> is declared inside <code>makeCounter(step:)</code>, so it starts in that call\'s stack frame. The question is how <code>count</code> still exists once that frame is removed.',
    deps: [],
    code: [
      `${kw('func')} double(_ ${mk('frame-values', 'n', 'parameter')}: Int) -> Int {`,
      `    ${kw('let')} ${mk('frame-values', 'result', 'local constant')} = n * 2`,
      `    ${kw('return')} result`,
      `}`,
      `${kw('let')} answer = ${mk('frame-lifetime', 'double(4)', 'the call')}`,
    ],
    figure: 'sf',
    caption: '<b>The stack frame of <code>double(4)</code></b>, while line 3 runs, and after the call returns.',
    parts: [
      { id: 'frame-values', name: 'What it holds', html: 'A stack frame holds the values of one call: its parameters and its local constants and variables. While <code>double(4)</code> runs, its frame holds <code>n</code>, which is 4, and <code>result</code>, which is 8. Each call gets its own frame, so two calls of <code>double</code> never share these values.' },
      { id: 'frame-lifetime', name: 'When it is removed', html: 'The frame is made when the call starts, and removed when the call returns. After <code>double(4)</code> returns, <code>n</code> and <code>result</code> no longer exist. Only the value the call returned, 8, is kept, in <code>answer</code>.' },
    ],
    key: 'A value in a stack frame exists only until its call returns.',
  },
  ho: {
    name: 'Heap object',
    first: 'Memory on the heap, found by its address.',
    why: '<code>count</code> has to exist after its stack frame is removed. Memory on the heap does not belong to any one call, so it can.',
    deps: [],
    code: [
      `${kw('final class')} Score {`,
      `    ${kw('var')} points = 0`,
      `}`,
      `${kw('func')} makeScore() -> Score {`,
      `    ${kw('let')} ${mk('heap-address', 'score', 'holds an address')} = ${mk('heap-object', 'Score()')}`,
      `    ${kw('return')} score`,
      `}`,
      `${kw('let')} ${mk('heap-lifetime', 'mine', 'holds the same address')} = makeScore()`,
    ],
    figure: 'ho',
    caption: '<b>A <code>Score</code> object on the heap</b>, while line 6 runs, and after <code>makeScore()</code> returns.',
    parts: [
      { id: 'heap-address', name: 'Its address', html: 'A heap object is at an address in memory. <code>score</code> does not hold the <code>Score</code> object itself: it holds the object\'s address. In the drawing, an address is a white dot, with a line to the memory it names.' },
      { id: 'heap-lifetime', name: 'How long it stays', html: 'A heap object is not removed when a call returns. It stays while something holds its address. When <code>makeScore()</code> returns, <code>score</code> is removed with its stack frame, but <code>mine</code> holds the same address, so the object stays.' },
    ],
    key: 'A stack frame is removed when its call returns. A heap object stays while something holds its address.',
  },
  clv: {
    name: 'Closure value',
    first: 'What a constant holds when it holds a closure: two addresses.',
    why: '<code>counter</code> holds a closure value. Its context is how the closure still finds <code>count</code> after <code>makeCounter(step:)</code> returns.',
    deps: ['cl'],
    code: [
      `${kw('func')} makeGreeter() -> (String) -> Void {`,
      `    ${kw('let')} greeting = ${str('"Hello"')}`,
      `    ${kw('return')} ${mk('code-pointer', '{', 'the closure\'s code starts')} (name: String) ${kw('in')}`,
      `        print(${str('"\\(greeting), \\(name)"')})`,
      `    }`,
      `}`,
      `${kw('let')} ${mk('context-pointer', 'greet', 'a closure value')} = makeGreeter()`,
    ],
    figure: 'clv',
    caption: '<b>What <code>greet</code> holds</b> after line 7: the address of the code, and the address of the context.',
    parts: [
      { id: 'code-pointer', name: 'The code pointer', html: 'The first address is the address of the closure\'s code, lines 3 to 5. Every closure made from these braces runs the same code.' },
      { id: 'context-pointer', name: 'The context pointer', html: 'The second address is the address of the closure\'s context: a heap object that holds what the closure captured. Here the context holds <code>greeting</code>, so the body still finds <code>"Hello"</code> after <code>makeGreeter()</code> has returned.' },
    ],
    key: 'A closure value is two addresses: one for its code, and one for its context.',
  },
  cl: {
    name: 'A closure',
    first: 'A function with no name, written between braces.',
    why: '<code>makeCounter(step:)</code> returns a closure, and each call of <code>counter()</code> runs that closure\'s body.',
    deps: ['cap'],
    code: [
      `${kw('let')} greet = ${mk('braces', '{', 'braces')} ${mk('params', '(name: String)', 'parameter list')} ${mk('in', 'in')}`,
      `    ${mk('body', `print(${str('"Hello, \\(name)"')})`, 'body')}`,
      `${mk('braces', '}')}`,
      `greet(${str('"Ana"')})`,
    ],
    figure: 'code',
    caption: '<b>The parts of a closure</b>, marked on the code.',
    parts: [
      { id: 'braces', name: 'The braces', html: 'The closure starts at <code>{</code> and ends at the matching <code>}</code>. It can be stored in a constant, here <code>greet</code>, and called later.' },
      { id: 'params', name: 'The parameter list', html: '<code>(name: String)</code> lists the inputs that the closure takes. <code>name</code> is a parameter, and <code>String</code> is its type.' },
      { id: 'in', name: '<code>in</code>', html: 'It ends the parameter list. The body comes after it.' },
      { id: 'body', name: 'The body', html: 'The code that runs each time the closure is called. A body can also use constants and variables from outside the braces, which is what Capture explained.' },
    ],
    key: 'A closure is a function with no name, written between braces, that can be stored and called later.',
    links: [['parts-and-steps.html', 'Open it in Parts and Steps →']],
  },
  cap: {
    name: 'Capture',
    first: 'A closure keeps each outside constant and variable that its body uses.',
    why: 'The closure that <code>makeCounter(step:)</code> returns uses <code>count</code>, which is declared outside its braces. Capture is why the closure still has <code>count</code>.',
    deps: [],
    code: [
      `${kw('func')} makeGreeter() -> (String) -> Void {`,
      `    ${kw('let')} ${mk('declared-outside', 'greeting', 'declared outside the braces')} = ${str('"Hello"')}`,
      `    ${kw('return')} { (name: String) ${kw('in')}`,
      `        print(${str('"\\(')}${mk('body-uses', 'greeting', 'used in the body')}${str('), \\(name)"')})`,
      `    }`,
      `}`,
    ],
    figure: 'code',
    arrows: [['body-uses', 'declared-outside']],
    caption: '<b>The closure on lines 3 to 5</b> uses <code>greeting</code>, which is declared on line 2, outside its braces.',
    parts: [
      { id: 'body-uses', name: 'What the body uses', html: 'The body, on line 4, uses <code>greeting</code> and <code>name</code>. <code>name</code> is the closure\'s own parameter, so it needs nothing more.' },
      { id: 'declared-outside', name: 'Where it is declared', html: '<code>greeting</code> is declared on line 2, outside the closure\'s braces. A closure captures each constant and variable from outside its braces that its body uses. So this closure captures <code>greeting</code>: it keeps it, so the body can use it each time it runs, even after <code>makeGreeter()</code> has returned.' },
    ],
    key: 'A closure keeps what its body uses from outside its braces.',
  },
};

// ---------- Which concepts a study needs, and in what order ----------

// Every concept reachable from the root through concepts the reader does not know.
function neededConcepts(known) {
  const out = [];
  (function walk(id) { if (out.includes(id)) return; out.push(id); LESSONS[id].deps.filter(d => !known.has(d)).forEach(walk); })(ROOT);
  return out;
}
// Teaching order: each concept comes after every concept it depends on.
function teachingOrder(ids) {
  const out = [];
  (function walk(id) { if (out.includes(id)) return; LESSONS[id].deps.filter(d => ids.includes(d)).forEach(walk); out.push(id); })(ROOT);
  return out;
}
// The concept that needs this one: the first concept that lists it in its deps.
function usedBy(id) { return Object.keys(LESSONS).find(k => LESSONS[k].deps.includes(id)); }

// ---------- Figures ----------

const field = (name, value, opts = {}) =>
  `<div class="mf"${opts.fp ? ` data-fp="${opts.fp}"` : ''}><span class="fn">${name}</span><span class="fv${opts.to ? ' ptr' : ''}"${opts.to ? ` data-to="${opts.to}"` : ''}>${value}</span></div>`;
const block = (kind, title, tag, fields, opts = {}) =>
  `<div class="mb ${kind}"${opts.id ? ` data-id="${opts.id}"` : ''}${opts.fp ? ` data-fp="${opts.fp}"` : ''}><div class="mh">${title}<i>${tag}</i></div>${fields}</div>`;

// The drawing of memory for each lesson. Ids in data-id are local to one figure, so a lesson can be shown twice on a page.
const FIGURES = {
  sf: () => `<div class="panes">
      <div><div class="pane-k">While line 3 runs</div>
        ${block('frame', 'double(_:)', 'stack frame', field('n', '4', { fp: 'frame-values' }) + field('result', '8', { fp: 'frame-values' }), { fp: 'frame-values' })}</div>
      <div><div class="pane-k">After double(4) returns</div>
        ${block('ghost', 'double(_:)', 'removed', '<div class="mf"><span class="fn"></span><span style="font-size:11px">n and result are gone</span></div>', { fp: 'frame-lifetime' })}
        <div style="height:10px"></div>
        ${block('plain', 'answer', 'constant', field('answer', '8'))}</div>
    </div>`,
  ho: () => `<div class="panes">
      <div><div class="pane-k">While line 6 runs</div><div class="row2">
        ${block('frame', 'makeScore()', 'stack frame', field('score', 'address', { to: 'o1', fp: 'heap-address' }))}
        ${block('heap', 'Score', 'heap object', field('points', '0'), { id: 'o1', fp: 'heap-object' })}</div></div>
      <div><div class="pane-k">After makeScore() returns</div><div class="row2">
        <div>${block('ghost', 'makeScore()', 'removed', '<div class="mf"><span class="fn"></span><span style="font-size:11px">score is gone</span></div>')}
          <div style="height:10px"></div>${block('plain', 'mine', 'constant', field('mine', 'address', { to: 'o2', fp: 'heap-lifetime' }))}</div>
        ${block('heap', 'Score', 'heap object', field('points', '0'), { id: 'o2', fp: 'heap-lifetime' })}</div></div>
    </div>`,
  clv: () => `<div class="row2">
      ${block('plain', 'greet', 'closure value', field('code', 'address', { to: 'c1', fp: 'code-pointer' }) + field('context', 'address', { to: 'x1', fp: 'context-pointer' }))}
      <div style="display:flex;flex-direction:column;gap:14px">
        ${block('plain', 'the closure\'s code', 'lines 3 to 5', '<div class="mf"><span class="fn"></span><span style="font-size:11px;font-family:var(--mono)">print(…)</span></div>', { id: 'c1', fp: 'code-pointer' })}
        ${block('heap', 'context', 'heap object', field('greeting', '"Hello"'), { id: 'x1', fp: 'context-pointer' })}</div>
    </div>`,
  cv: () => `<div class="row2">
      <div style="display:flex;flex-direction:column;gap:12px">
        ${block('ghost', 'makeCounter(step:)', 'removed', '<div class="mf"><span class="fn"></span><span style="font-size:11px">its stack frame is gone</span></div>', { fp: 'count-frame' })}
        ${block('plain', 'counter', 'closure value', field('code', 'address') + field('context', 'address', { to: 'x', fp: 'count-context' }))}</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${block('heap', 'context', 'heap object', field('step', '2') + field('count', 'address', { to: 'b', fp: 'count-context' }), { id: 'x', fp: 'count-context' })}
        ${block('heap', 'box', 'heap object', field('count', '0'), { id: 'b', fp: 'count-box' })}</div>
    </div>`,
};

function figureHTML(id) {
  const L = LESSONS[id];
  const body = L.figure === 'code' ? '' : FIGURES[L.figure]();
  return `<figure class="fig" data-fig="${id}">${body}<svg class="farrows"></svg><div class="cap">${L.caption}</div></figure>`;
}

// The arrows of each lesson: in its figure, from each address to the memory it names, and in its code, from a use to a declaration.
function drawFigure(root) {
  const line = (a, b, mx) => `<path d="M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}" fill="none" stroke="#ece6d6" stroke-width="1.3" stroke-opacity="0.8"/>`;
  const head = (b, dir) => `<path d="M${b.x + dir * 8},${b.y - 4.5} L${b.x},${b.y} L${b.x + dir * 8},${b.y + 4.5}" fill="none" stroke="#ece6d6" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>`;
  root.querySelectorAll('.lesson').forEach(lesson => {
    linkMentions(lesson);
    const fig = lesson.querySelector('.fig');
    if (fig) {
      const svg = fig.querySelector('.farrows');
      svg.innerHTML = '';
      const base = fig.getBoundingClientRect();
      // A figure can be inside a scaled element, so distances on the screen are divided by that scale.
      const k = base.width / fig.offsetWidth || 1;
      const X = v => (v - base.left) / k, Y = v => (v - base.top) / k;
      fig.querySelectorAll('[data-to]').forEach(src => {
        const t = fig.querySelector(`[data-id="${src.dataset.to}"]`);
        if (!t) return;
        const f = src.getBoundingClientRect(), r = t.getBoundingClientRect();
        const a = { x: X(f.right) - 9, y: Y(f.top + f.height / 2) };
        if (X(r.left) > a.x) {
          const b = { x: X(r.left) - 1, y: Y(r.top) + 16 };
          svg.insertAdjacentHTML('beforeend', line(a, { x: b.x - 2, y: b.y }, (a.x + b.x) / 2) + head(b, -1));
        } else {
          const b = { x: X(r.right) + 1, y: Y(r.top) + 16 };
          svg.insertAdjacentHTML('beforeend', line(a, { x: b.x + 2, y: b.y }, Math.max(a.x, b.x) + 30) + head(b, 1));
        }
      });
    }
    const code = lesson.querySelector('.l-code');
    const L = LESSONS[lesson.dataset.lesson];
    if (!code || !L.arrows) return;
    const csvg = code.querySelector('svg.farrows');
    const cr = code.getBoundingClientRect();
    const k = cr.width / code.offsetWidth || 1;
    csvg.innerHTML = L.arrows.map(([from, to]) => {
      const f = code.querySelector(`.mk[data-fp="${from}"]`).getBoundingClientRect();
      const t = code.querySelector(`.mk[data-fp="${to}"]`).getBoundingClientRect();
      const a = { x: (f.left - cr.left) / k - 3, y: (f.top + f.height / 2 - cr.top) / k };
      const b = { x: (t.left - cr.left) / k - 3, y: (t.top + t.height / 2 - cr.top) / k };
      return line(a, { x: b.x - 2, y: b.y }, Math.min(a.x, b.x) - 26) + head(b, -1);
    }).join('');
  });
}

// ---------- Every name of code in a sentence points at that code on the page ----------

// The sentences of a lesson whose code names are checked: its first fact, its reason, its parts, its main point, and its captions.
const MENTION_PLACES = '.l-first code, p.l-why code, .l-why p code, .l-parts p code, .l-key code, .cap code';

// Finds every place a name appears in the code panels given, and wraps each one so it can be marked.
// A Swift function name such as makeCounter(step:) is found by its base name followed by "(".
function wrapRefs(panels, text, key) {
  const fn = text.match(/^([A-Za-z_]\w*)\(((?:\w+:)+)\)$/);
  const needle = fn ? fn[1] + '(' : text;
  const wordStart = /^\w/.test(needle), wordEnd = /\w$/.test(needle);
  const esc = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp((wordStart ? '\\b' : '') + esc + (wordEnd ? '\\b' : ''), 'g');
  let found = 0;
  panels.forEach(panel => {
    const walker = document.createTreeWalker(panel, NodeFilter.SHOW_TEXT, { acceptNode: n =>
      n.parentElement.closest('.n') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes = []; let n;
    while ((n = walker.nextNode())) nodes.push(n);
    // A text node can hold the name more than once, so the rest of the node is searched again after each match.
    nodes.forEach(node => {
      let cur = node;
      while (cur) {
        re.lastIndex = 0;
        const m = re.exec(cur.nodeValue);
        if (!m) break;
        const len = fn ? fn[1].length : m[0].length;
        const hit = cur.splitText(m.index);
        const rest = hit.splitText(len);
        const span = document.createElement('span');
        span.className = 'ref'; span.dataset.ref = key; span.textContent = hit.nodeValue;
        hit.replaceWith(span);
        found++;
        cur = rest;
      }
    });
  });
  return found;
}

// Links each name in a lesson's sentences to the same code on the page. A name in the reason box looks first in the code shown
// beside it. A name with no code on the page is the checker's error: it is marked in red, and listed in the console.
function linkMentions(lesson) {
  // The small copies of figures inside the graph's boxes are pictures only, so they are not checked.
  if (lesson.dataset.linked || lesson.classList.contains('ti')) return;
  lesson.dataset.linked = '1';
  const mainPanels = [...lesson.querySelectorAll('.l-code .cb')];
  const wants = [...lesson.querySelectorAll(MENTION_PLACES)].map(c => {
    const why = c.closest('.l-why');
    const panels = why && why.querySelector('.why-code') ? [...why.querySelectorAll('.why-code .cb')] : null;
    return { c, text: c.textContent.trim(), scope: panels ? 'why' : 'main', panels: panels || mainPanels };
  });
  // Each name is wrapped once for each place it is looked for. Longer names are wrapped first,
  // so a name inside a longer one, such as counter inside counter(), is still found inside it.
  const keyOf = new Map();
  let next = 0;
  [...new Map(wants.map(w => [w.scope + ':' + w.text, w])).values()].sort((a, b) => b.text.length - a.text.length).forEach(w => {
    const key = 'r' + (next++);
    let found = wrapRefs(w.panels, w.text, key);
    if (!found && w.scope === 'main') found = wrapRefs([...lesson.querySelectorAll('.cb')], w.text, key);
    keyOf.set(w.scope + ':' + w.text, found ? key : null);
  });
  wants.forEach(({ c, text, scope }) => {
    const key = keyOf.get(scope + ':' + text);
    if (key) { c.classList.add('mention'); c.dataset.ref = key; }
    else { c.classList.add('unmatched'); c.title = 'No code on this page shows this'; console.warn(`Checker: "${text}" in ${lesson.dataset.lesson} names code that the page does not show.`); }
  });
}

// Pointing at a name marks its code. Clicking it brings the code into view if it is off the screen.
document.addEventListener('mouseover', e => {
  const m = e.target.closest('.mention');
  document.querySelectorAll('.ref.on').forEach(r => r.classList.remove('on'));
  if (!m) return;
  m.closest('.lesson').querySelectorAll(`.ref[data-ref="${m.dataset.ref}"]`).forEach(r => r.classList.add('on'));
});
document.addEventListener('click', e => {
  const m = e.target.closest('.mention');
  if (!m) return;
  const first = m.closest('.lesson').querySelector(`.ref[data-ref="${m.dataset.ref}"]`);
  const r = first.getBoundingClientRect();
  if (r.top < 60 || r.bottom > innerHeight) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  first.classList.add('flash'); setTimeout(() => first.classList.remove('flash'), 900);
});

// Hovering a part's explanation lights its marks on the code and in the figure, and hovering a mark lights the explanation.
function linkParts(root) {
  root.addEventListener('mouseover', e => {
    const lesson = e.target.closest('.lesson');
    if (!lesson) return;
    const p = e.target.closest('[data-part-id]') || e.target.closest('[data-fp]');
    const id = p ? (p.dataset.partId || p.dataset.fp) : null;
    lesson.querySelectorAll('.fig, .l-code').forEach(f => f.classList.toggle('focus', !!id));
    lesson.querySelectorAll('[data-fp]').forEach(m => m.classList.toggle('lit', m.dataset.fp === id));
    lesson.querySelectorAll('[data-part-id]').forEach(m => m.classList.toggle('lit', m.dataset.partId === id));
  });
  root.addEventListener('mouseout', e => {
    const lesson = e.target.closest('.lesson');
    if (!lesson || lesson.contains(e.relatedTarget)) return;
    lesson.querySelectorAll('.fig, .l-code').forEach(f => f.classList.remove('focus'));
    lesson.querySelectorAll('.lit').forEach(m => m.classList.remove('lit'));
  });
}

// Takes the parts the reader knows off the code and out of the figure: their marks and names vanish, and they no longer light up.
function applyKnownParts(root, known) {
  root.querySelectorAll('.mk[data-fp]').forEach(m => m.classList.toggle('known', known.has(m.dataset.fp)));
  root.querySelectorAll('.fig [data-fp]').forEach(m => { if (known.has(m.dataset.fp)) m.removeAttribute('data-fp'); });
}

// The name of each part, with the concept it belongs to, for the list of what the reader knows.
function partNames() {
  const out = {};
  Object.entries(LESSONS).forEach(([id, L]) => { out[id] = L.name; L.parts.forEach(p => { out[p.id] = `${p.name} <span style="color:var(--faint)">· ${L.name}</span>`; }); });
  return out;
}

// One lesson, laid out as a page of a textbook: name, first fact, why it is needed, the example, its parts, and the main point.
// opts.num is the lesson's number in teaching order, opts.know adds an "I know this" button to the concept,
// opts.knowParts adds one to each part, opts.known leaves out the parts the reader knows, and opts.compact leaves out the reason.
function lessonHTML(id, opts = {}) {
  const L = LESSONS[id];
  const user = usedBy(id);
  return `<article class="lesson" data-lesson="${id}">
    <header class="l-head">
      ${opts.num ? `<span class="l-num">${opts.num}</span>` : ''}
      <div><h2 class="l-name">${L.name}</h2><p class="l-first">${L.first}</p></div>
      ${opts.know && id !== ROOT ? `<button class="knowbtn${opts.knowParts ? ' show' : ''}" data-know="${id}">${opts.knowParts ? 'I know all of this' : 'I know this'}</button>` : ''}
    </header>
    ${L.question ? `<p class="l-why"><span>The question</span>${L.question}</p>` : ''}
    ${!opts.compact && L.why ? `<div class="l-why"><span>Why ${LESSONS[user].name.charAt(0).toLowerCase() + LESSONS[user].name.slice(1)} needs it</span><p>${L.why}</p>
      <div class="why-code"><div class="why-k">The code of ${LESSONS[ROOT].name.charAt(0).toLowerCase() + LESSONS[ROOT].name.slice(1)}, which this sentence names</div>${codeLinesHTML(LESSONS[ROOT].code)}</div></div>` : ''}
    <div class="l-ex">
      <div class="l-code">${codeLinesHTML(L.code, true)}<svg class="farrows"></svg></div>
      ${L.figure === 'code' ? `<div class="l-capcol"><div class="cap">${L.caption}</div></div>` : figureHTML(id)}
    </div>
    <div class="l-parts">${L.parts.filter(p => !(opts.known && opts.known.has(p.id))).map(p => `<section data-part-id="${p.id}">
      <div class="l-ph"><h4>${p.name}</h4>${opts.knowParts ? `<button class="pknow" data-know-part="${p.id}" data-lesson="${id}">I know this</button>` : ''}</div>
      <p>${p.html}</p></section>`).join('')}</div>
    <p class="l-key">${L.key}</p>
    ${(L.links || []).map(([href, text]) => `<a class="l-link" href="${href}">${text}</a>`).join('')}
  </article>`;
}
