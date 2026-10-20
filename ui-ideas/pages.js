// What Home, Expand to Parts, and Graph and Page read. It opens the concept library from library-data.js,
// and gives the pages the names they use, such as IDEAS, PIECES, and KNOWN.
// Load it after shared.js, library-data.js, and library.js.

const LIB = Library.openLibrary(LIBRARY);
const AREAS = Library.AREAS;
// What the reader knows: the ids of known.json. An id is also known when a known idea is made of it.
const KNOWN = LIB.known;
const KNOWN_PIECES = LIB.known;
// The study the reader is in the middle of, and how many of its concepts they have finished.
// Nothing records the progress of a study yet, so it is fixed here.
const STUDYING = { id: 'captured-variables', done: 1 };
const NAMES = LIB.names;

// The ideas on the home map: every idea with an area, with the ideas it depends on.
// codeDeps, when an idea has it, lists the ideas that its first two views use. The rest of deps are used only by its In memory view.
const IDEAS = Object.fromEntries(Object.values(LIB.ideas).filter(i => i.area).map(i => {
  const code = LIB.codeDeps(i.id);
  return [i.id, { name: i.name, area: i.area, first: i.first, deps: i.deps, ...(code ? { codeDeps: code } : {}) }];
}));
// Every idea, and what it is made of, for Expand to Parts. An idea with an empty list cannot be split any further.
const PIECES = Object.fromEntries(Object.values(LIB.ideas).map(i => [i.id, { name: i.name, first: i.first, of: i.of }]));
// Every concept in the library, each after the concepts it depends on.
const TEACHING_ORDER = (() => {
  const out = [];
  (function visit(ids) { ids.forEach(id => { if (out.includes(id)) return; visit(IDEAS[id].deps); out.push(id); }); })(Object.keys(IDEAS));
  return out;
})();
// The whole ideas that Expand to Parts offers to start from: each concept that no other idea is made of, in teaching order.
const ROOTS = TEACHING_ORDER.filter(id => !Object.values(PIECES).some(p => p.of.includes(id)));

// ---------- Questions the code answers about the library ----------

// Every idea that this one needs and the reader does not know, through the ideas those need.
function unknownNeeds(id) {
  const out = [];
  (function walk(n) { IDEAS[n].deps.forEach(d => { if (!KNOWN.has(d) && !out.includes(d)) { walk(d); out.push(d); } }); })(id);
  return out;
}
// An idea is ready when the reader knows everything it needs.
function isReady(id) { return !KNOWN.has(id) && unknownNeeds(id).length === 0; }
// The longest chain of deps below an idea: 0 for an idea that needs nothing.
function level(id) { const d = IDEAS[id].deps; return d.length ? 1 + Math.max(...d.map(level)) : 0; }
// The ideas of one area, in teaching order: each after the ideas it needs.
function areaOrder(area) {
  const ids = Object.keys(IDEAS).filter(k => IDEAS[k].area === area);
  const out = [];
  (function visit(list) { list.forEach(id => { if (out.includes(id)) return; visit(IDEAS[id].deps.filter(d => ids.includes(d))); out.push(id); }); })(ids);
  return out;
}
function stateOf(id) { return KNOWN.has(id) ? 'known' : STUDYING.id === id ? 'studying' : 'new'; }
function stateText(id) {
  if (KNOWN.has(id)) return 'Known';
  if (STUDYING.id === id) return `Studying · ${STUDYING.done} of ${studyLength(id)}`;
  const n = unknownNeeds(id).length;
  return n ? `Needs ${n} first` : 'Ready';
}
// The number of concepts in a study: the idea itself, and every idea on its path.
function studyLength(id) { return new Set(studyPath(id).map(s => s.id)).size; }
function areaName(id) { return AREAS.find(a => a.id === id).name; }
// Why an idea needs an idea it depends on, in one sentence.
function why(idea, needed) { return LIB.why(idea, needed); }

// A dot that shows an idea's state: an outline for a new idea, filled for the one being studied, grey and dashed for a known one.
function dotHTML(id) { return `<span class="sdot ${stateOf(id)}${isReady(id) ? ' ready' : ''}"></span>`; }

// ---------- The map on the home page ----------

// The positions of every idea on a map: one region for each area, and inside it,
// each idea in a column to the right of the ideas it needs. An area with no ideas yet has no region.
function mapLayout(origin, col = 200, row = 50) {
  const pos = {}, regions = {};
  AREAS.filter(a => areaOrder(a.id).length).forEach(a => {
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
// Where each area's region starts. Memory starts to the right of the widest region in the row above it.
const MAP_ORIGIN = (() => {
  const width = area => { const ids = areaOrder(area); return ids.length ? (new Set(ids.map(level)).size - 1) * 200 + 160 + 48 : 0; };
  const height = area => { const ids = areaOrder(area); const per = {}; ids.forEach(id => per[level(id)] = (per[level(id)] || 0) + 1); return 46 + Math.max(0, ...Object.values(per)) * 50 + 22; };
  const top = 40, gap = 40;
  const second = top + Math.max(height('swift'), height('memory')) + gap;
  const third = second + Math.max(height('conc'), height('ui')) + gap;
  return { swift: [40, top], memory: [40 + width('swift') + gap, top], conc: [40, second], ui: [40 + width('conc') + gap, second], algo: [40, third] };
})();

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

// ---------- Where each study opens ----------

// Every concept that a concept's study teaches or shows: the ideas it depends on, at any depth.
function studyIncludes(root, id) {
  const seen = new Set();
  (function walk(x) { if (seen.has(x)) return; seen.add(x); (LIB.entryOf(x).dependsOn || []).forEach(d => walk(d.id)); })(root);
  return seen.has(id);
}
// Where the study of an idea opens. A concept with an example has its full study in Graph and Page. When it is part of the study
// of the idea that Expand to Parts has open, it opens inside that study. Every other idea opens in study.html,
// the Graph and Page layout built from what the idea is made of.
function studyHref(id, root, from) {
  const back = from ? `&from=${from}` : '';
  if (!LIB.hasStudy(id)) return `study.html?idea=${id}${root ? `&root=${root}` : ''}${back}`;
  const inside = root && root !== id && LIB.hasStudy(root) && studyIncludes(root, id);
  return `graph-page.html?root=${inside ? root : id}${inside ? `&show=${id}` : ''}${back}`;
}
// Starting a study from the home page. Every idea on the home map is a concept, so each one has a full study in Graph and Page.
function startStudy(id) { location.href = studyHref(id); }

// ---------- Writing what the reader knows ----------

// library/server.js serves these pages and writes known.json. Each id the reader marks as known, and each id they remove
// in What I know, is sent to it, so the change is still there after a reload.
// A server that only serves files, such as python3 -m http.server or GitHub Pages, cannot write known.json. There each change
// is kept in this browser's localStorage instead, as the ids added to known.json's list and the ids removed from it.
// They are applied to known.json's ids each time a page opens, so an id added to known.json later still reaches this browser.
// Each origin has its own localStorage, so a page that library/server.js serves never reads them.
const BROWSER_KNOWN = 'stoicheiaKnown';
function browserChanges() {
  try {
    const c = JSON.parse(localStorage.getItem(BROWSER_KNOWN));
    if (c && Array.isArray(c.add) && Array.isArray(c.remove)) return c;
  } catch (e) {}
  return { add: [], remove: [] };
}
(() => {
  const c = browserChanges();
  c.add.forEach(id => { if (LIB.ideas[id]) KNOWN.add(id); });
  c.remove.forEach(id => KNOWN.delete(id));
})();
// An id is in at most one of the two lists: the last change made to it.
function keepInBrowser(change) {
  const c = browserChanges(), id = change.add || change.remove;
  c.add = c.add.filter(x => x !== id); c.remove = c.remove.filter(x => x !== id);
  (change.add ? c.add : c.remove).push(id);
  try { localStorage.setItem(BROWSER_KNOWN, JSON.stringify(c)); } catch (e) {}
}
let serverWrites = null;
let saving = Promise.resolve();
function saveKnown(change) {
  // library/server.js sends the header X-Stoicheia-Writes with every file. A HEAD request asks for this page's headers only,
  // and every server answers it, so no request fails on a server that cannot write. Its body is empty, and is read anyway:
  // the browser marks a request whose body is never read as stopped before it finished.
  serverWrites = serverWrites || (/^https?:$/.test(location.protocol)
    ? fetch(location.pathname, { method: 'HEAD', cache: 'no-store' })
      .then(r => r.arrayBuffer().then(() => r.headers.get('X-Stoicheia-Writes') === 'known.json'), () => false)
    : Promise.resolve(false));
  // The changes are sent one at a time, in the order the reader made them, so known.json ends with the last one.
  saving = saving.then(() => serverWrites).then(writes => {
    if (!writes) return keepInBrowser(change);
    return fetch('/known', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(change) })
      .then(r => r.json().then(out => { if (!r.ok) console.warn(`known.json was not changed: ${out.problems.join(' ')}`); }));
  }).catch(err => console.warn(`known.json was not changed: ${err.message}`));
}
