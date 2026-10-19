// What every Library Map variation shares: the reason behind each connection, and the cards and panels that show an idea.
// It reads the library from home-data.js.

// Why each idea needs each idea it depends on, keyed "idea>needed idea". Each sentence says what the connection is.
const WHY = {
  'struct>value': 'A structure is a value type, so its values are copied when they are assigned.',
  'generics>protocol': 'Generic code states what it needs from a type as protocols that the type conforms to.',
  'reference>ho': 'An instance of a reference type is a heap object, and a constant holds its address.',
  'class>reference': 'A class is a reference type.',
  'cl>cap': 'A closure\'s body can use constants and variables from outside its braces, and the closure captures them.',
  'clv>cl': 'A closure value is what a constant holds when it holds a closure.',
  'esc>cl': 'An escaping closure is a closure.',
  'esc>sf': 'It is called after the stack frame of the function it was passed to has been removed.',
  'cv>cl': 'A captured variable is a variable that a closure\'s body uses.',
  'cv>sf': 'A captured variable is declared in a stack frame, which is removed when its call returns.',
  'cv>ho': 'Swift keeps a captured variable in a box, and the box is a heap object.',
  'cv>clv': 'The context of the closure value holds the address of that box.',
  'arc>ho': 'Reference counting counts the strong references to each heap object.',
  'arc>reference': 'Assigning an instance of a reference type adds one strong reference to it.',
  'cycle>arc': 'In a cycle, each object\'s count of strong references never reaches zero, so neither is freed.',
  'cycle>cap': 'A common cycle is a closure stored in a property of an object, that captures that same object.',
  'weak>arc': 'A weak reference is not counted as a strong reference, so it does not keep its object.',
  'weak>opt': 'A weak reference is an optional, because it becomes nil when its object is freed.',
  'task>cl': 'A task runs the closure you pass to it, as in Task { }.',
  'task>async': 'The closure of a task can call async functions, with await.',
  'actor>reference': 'An actor is a reference type.',
  'actor>task': 'Code outside an actor calls into it with await, from asynchronous code such as a task.',
  'sendable>value': 'A value type whose stored properties are all Sendable can be Sendable, because each copy is separate.',
  'sendable>actor': 'Values passed into and out of an actor have to be Sendable.',
  'isolation>actor': 'The methods and properties of an actor are isolated to that actor.',
  'view>struct': 'A SwiftUI view is usually a structure.',
  'view>protocol': 'A view is a type that conforms to the View protocol.',
  'state>view': 'State is a property of a view.',
  'modifier>view': 'A modifier is a method that you call on a view.',
  'binary>linear': 'Binary search finds the same answer as linear search, but checks far fewer elements.',
  'recursion>sf': 'Each call of a recursive function gets its own stack frame.',
  'merge>recursion': 'Merge sort sorts each half by calling itself.',
};
function why(idea, needed) { return WHY[`${idea}>${needed}`] || ''; }

// Everything an idea needs, at every distance: the ideas it lists, the ideas those list, and so on.
function allNeeds(id) {
  const out = [];
  (function walk(n) { IDEAS[n].deps.forEach(d => { if (!out.includes(d)) { walk(d); out.push(d); } }); })(id);
  return out;
}
// How many ideas the reader still has to learn before this one: 0 for an idea that is ready.
function distance(id) { return KNOWN.has(id) ? -1 : unknownNeeds(id).length; }

function stateClass(id) { return KNOWN.has(id) ? 'known' : STUDYING.id === id ? 'studying' : isReady(id) ? 'ready' : 'new'; }

// A card for one idea: its name, its first fact, and what state it is in.
function ideaCard(id, opts = {}) {
  const I = IDEAS[id];
  return `<div class="icard ${stateClass(id)}${opts.small ? ' small' : ''}" data-id="${id}">
    <div class="ic-top">${dotHTML(id)}<span class="ic-name">${I.name}</span>${opts.badge ? `<span class="ic-badge">${opts.badge}</span>` : ''}</div>
    ${opts.small ? '' : `<div class="ic-first">${I.first}</div>`}
    ${opts.reason ? `<div class="ic-why"><span>${opts.reasonLabel || 'Why'}</span>${opts.reason}</div>` : ''}
    ${opts.noState ? '' : `<div class="ic-state">${opts.small ? '' : stateText(id)}</div>`}
  </div>`;
}

// The panel for one idea: what it is, every idea it needs with the reason, every idea that uses it with the reason, and how to start.
function ideaPanel(id) {
  const I = IDEAS[id];
  const needs = I.deps, leads = usedBy(id), unknown = unknownNeeds(id);
  const row = (n, text) => `<div class="ip-row" data-go="${n}">${dotHTML(n)}<div><div class="ip-n">${IDEAS[n].name}${KNOWN.has(n) ? ' <span class="ip-k">known</span>' : ''}</div><div class="ip-w">${text}</div></div></div>`;
  let start = '';
  if (!KNOWN.has(id)) {
    start = unknown.length
      ? `<p class="ip-plan">The study teaches ${unknown.length === 1 ? 'one idea' : unknown.length + ' ideas'} first: ${unknown.map(n => `<b>${IDEAS[n].name}</b>`).join(', then ')}. Then ${I.name}.</p>`
      : `<p class="ip-plan">You know everything it needs, so the study starts with ${I.name} itself.</p>`;
    start += `<button class="btn primary" data-start="${id}">${STUDYING.id === id ? 'Continue the study' : 'Start the study'} →</button>`;
  }
  return `<div class="ip-area">${areaName(I.area)} · ${stateText(id)}</div>
    <h2 class="ip-name">${I.name}</h2><p class="ip-first">${I.first}</p>
    <div class="ip-k2">It needs</div>${needs.length ? needs.map(n => row(n, why(id, n))).join('') : '<p class="ip-none">Nothing else. It can be learned on its own.</p>'}
    <div class="ip-k2">It leads to</div>${leads.length ? leads.map(n => row(n, why(n, id))).join('') : '<p class="ip-none">No idea in the library uses it yet.</p>'}
    ${start}`;
}

// Starting a study goes to its mockup, if one exists.
function startStudy(id, button) {
  const l = studyLink(id);
  if (l) location.href = l; else if (button) button.textContent = 'No mockup of this study exists yet';
}

// The positions of every idea on a map: one region for each area, and inside it,
// each idea in a column to the right of the ideas it needs.
function mapLayout(origin, col = 200, row = 50) {
  const pos = {}, regions = {};
  AREAS.forEach(a => {
    const ids = areaOrder(a.id);
    const levels = [...new Set(ids.map(level))].sort((x, y) => x - y);
    const rows = {};
    ids.forEach(id => {
      const c = levels.indexOf(level(id));
      rows[c] = rows[c] || 0;
      pos[id] = { x: origin[a.id][0] + 24 + c * col, y: origin[a.id][1] + 46 + rows[c] * row };
      rows[c]++;
    });
    const xs = ids.map(id => pos[id].x), ys = ids.map(id => pos[id].y);
    regions[a.id] = { x: origin[a.id][0], y: origin[a.id][1], w: Math.max(...xs) + 160 + 24 - origin[a.id][0], h: Math.max(...ys) + 34 + 22 - origin[a.id][1] };
  });
  return { pos, regions };
}
const MAP_ORIGIN = { swift: [40, 40], memory: [720, 40], conc: [40, 440], ui: [900, 440], algo: [40, 650] };

// The path a study takes to an idea: every idea it needs that the reader does not know, in teaching order, then the idea itself.
// An idea with codeDeps is split into its views: the ideas its first two views use come first, then those two views,
// then the ideas only its In memory view uses, then In memory. Each step is { id, view }, where view is 'all', 'code', or 'memory'.
function studyPath(goal) {
  if (KNOWN.has(goal)) return [];
  const needsOf = (list, skip) => {
    const out = [];
    (function walk(ids) { ids.forEach(d => { if (KNOWN.has(d) || out.includes(d) || skip.includes(d)) return; walk(IDEAS[d].deps); out.push(d); }); })(list);
    return out;
  };
  const I = IDEAS[goal];
  if (!I.codeDeps) return [...needsOf(I.deps, []).map(id => ({ id, view: 'all' })), { id: goal, view: 'all' }];
  const code = needsOf(I.codeDeps, []);
  const memory = needsOf(I.deps.filter(d => !I.codeDeps.includes(d)), code);
  return [...code.map(id => ({ id, view: 'all' })), { id: goal, view: 'code' }, ...memory.map(id => ({ id, view: 'all' })), { id: goal, view: 'memory' }];
}
const VIEW_LABEL = { all: '', code: 'What it is, and Parts and Steps', memory: 'In memory' };
