// The library of ideas that every main page mockup shows, and the code that answers questions about it.
// In Stoicheia, this would be read from concepts/ and known.json. Here it is written out for the mockups.

const AREAS = [
  { id: 'swift', name: 'The Swift language' },
  { id: 'memory', name: 'Memory' },
  { id: 'conc', name: 'Concurrency' },
  { id: 'ui', name: 'SwiftUI' },
  { id: 'algo', name: 'Algorithms' },
];

// Each idea: its name, its area, its first fact, and the ideas it depends on.
// codeDeps, when an idea has it, lists the ideas that its first two views use. The rest of deps are used only by its In memory view.
const IDEAS = {
  fn: { name: 'Function', area: 'swift', first: 'A named block of code that takes inputs and can return a value.', deps: [] },
  opt: { name: 'Optional', area: 'swift', first: 'A value that is either a value of its type, or nil.', deps: [] },
  value: { name: 'Value type', area: 'swift', first: 'A type whose value is copied when it is assigned or passed to a function.', deps: [] },
  struct: { name: 'Structure', area: 'swift', first: 'A value type that groups stored properties under one name.', deps: ['value'] },
  protocol: { name: 'Protocol', area: 'swift', first: 'A list of requirements that a type can promise to meet.', deps: [] },
  generics: { name: 'Generics', area: 'swift', first: 'Code written once for any type that meets the given requirements.', deps: ['protocol'] },
  reference: { name: 'Reference type', area: 'swift', first: 'A type whose instance is shared: assigning it copies its address, not the instance.', deps: ['ho'] },
  class: { name: 'Class', area: 'swift', first: 'A reference type with stored properties, methods, and inheritance.', deps: ['reference'] },
  cap: { name: 'Capture', area: 'swift', first: 'A closure keeps each outside constant and variable that its body uses.', deps: [] },
  cl: { name: 'Closure', area: 'swift', first: 'A function with no name, written between braces.', deps: ['cap'] },
  clv: { name: 'Closure value', area: 'swift', first: 'Two addresses: one for the closure\'s code, and one for its context.', deps: ['cl'] },
  esc: { name: 'Escaping closure', area: 'swift', first: 'A closure that can be called after the function it was passed to has returned.', deps: ['cl', 'sf'] },

  ma: { name: 'Memory address', area: 'memory', first: 'The number that names one place in memory.', deps: [] },
  ptr: { name: 'Pointer', area: 'memory', first: 'A value that holds a memory address.', deps: [] },
  sf: { name: 'Stack frame', area: 'memory', first: 'The memory made for one function call.', deps: [] },
  ho: { name: 'Heap object', area: 'memory', first: 'Memory on the heap, found by its address.', deps: [] },
  // What it is and Parts and Steps of Captured variables use only a closure. Its In memory view also uses the three memory concepts.
  cv: { name: 'Captured variables', area: 'memory', first: 'A variable, declared outside a closure, that the closure\'s body uses.', deps: ['cl', 'sf', 'ho', 'clv'], codeDeps: ['cl'] },
  arc: { name: 'Reference counting', area: 'memory', first: 'Swift frees a heap object when nothing holds a strong reference to it.', deps: ['ho', 'reference'] },
  cycle: { name: 'Reference cycle', area: 'memory', first: 'Two objects that hold strong references to each other, so neither is freed.', deps: ['arc', 'cap'] },
  weak: { name: 'Weak reference', area: 'memory', first: 'A reference that does not keep its object, and becomes nil when the object is freed.', deps: ['arc', 'opt'] },

  async: { name: 'Async function', area: 'conc', first: 'A function that can pause while it waits, so other work can run.', deps: [] },
  task: { name: 'Task', area: 'conc', first: 'A unit of asynchronous work that runs on its own.', deps: ['cl', 'async'] },
  actor: { name: 'Actor', area: 'conc', first: 'A reference type that runs one piece of its code at a time, to protect its state.', deps: ['reference', 'task'] },
  sendable: { name: 'Sendable', area: 'conc', first: 'A type whose values can be passed safely between concurrent code.', deps: ['value', 'actor'] },
  isolation: { name: 'Isolation', area: 'conc', first: 'Which actor, if any, a piece of code belongs to.', deps: ['actor'] },

  view: { name: 'View', area: 'ui', first: 'A type that describes part of the user interface, built from its body.', deps: ['struct', 'protocol'] },
  state: { name: 'State', area: 'ui', first: 'A property that SwiftUI keeps for a view, and that redraws the view when it changes.', deps: ['view'] },
  modifier: { name: 'View modifier', area: 'ui', first: 'A method that returns a new view with one change, such as padding.', deps: ['view'] },

  linear: { name: 'Linear search', area: 'algo', first: 'Checking each element in order until the target is found.', deps: [] },
  binary: { name: 'Binary search', area: 'algo', first: 'Finding a value in a sorted array by halving the range on each pass.', deps: ['linear'] },
  recursion: { name: 'Recursion', area: 'algo', first: 'A function that calls itself, each time with a smaller problem.', deps: ['sf'] },
  insertion: { name: 'Insertion sort', area: 'algo', first: 'Sorting by putting each element into its place among the ones already sorted.', deps: [] },
  merge: { name: 'Merge sort', area: 'algo', first: 'Sorting by splitting the array in half, sorting each half, and merging them.', deps: ['recursion'] },
};

// What the reader knows: this would be known.json. The first four come from "Who we teach".
const KNOWN = new Set(['fn', 'opt', 'ma', 'ptr', 'value', 'struct', 'protocol', 'linear', 'sf', 'ho', 'cap']);
// The study the reader is in the middle of, and how far through its teaching order they are.
const STUDYING = { id: 'cv', done: 3 };
// The pages that exist for some studies in these mockups.
const STUDY_PAGE = { cv: 'graph-page.html', cl: 'parts-and-steps.html', binary: 'trace.html' };

// ---------- Questions the code answers about the library ----------

// Every idea that this one needs and the reader does not know, through the ideas those need.
function unknownNeeds(id) {
  const out = [];
  (function walk(n) { IDEAS[n].deps.forEach(d => { if (!KNOWN.has(d) && !out.includes(d)) { walk(d); out.push(d); } }); })(id);
  return out;
}
// An idea is ready when the reader knows everything it needs.
function isReady(id) { return !KNOWN.has(id) && unknownNeeds(id).length === 0; }
// The ideas that list this one in their deps.
function usedBy(id) { return Object.keys(IDEAS).filter(k => IDEAS[k].deps.includes(id)); }
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
// The number of concepts in a study: the idea itself, and every idea it needed when the study started.
// For the study in progress, the ideas already finished are known now, so they are counted back in.
function studyLength(id) { return id === STUDYING.id ? 6 : unknownNeeds(id).length + 1; }
function areaName(id) { return AREAS.find(a => a.id === id).name; }
function studyLink(id) { return STUDY_PAGE[id] || null; }

// A dot that shows an idea's state: an outline for a new idea, filled for the one being studied, grey and dashed for a known one.
function dotHTML(id) { return `<span class="sdot ${stateOf(id)}${isReady(id) ? ' ready' : ''}"></span>`; }
