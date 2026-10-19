// Stoicheia's concept library: the code that reads the entries of concepts/ and the ids of known.json, checks them,
// turns their sentences and code into HTML, and answers what the pages ask about them.
// The same file runs in the browser, where library-data.js gives it the entries, and in Node.js, where library/load.js does.

const Library = (() => {
  const AREAS = [
    { id: 'swift', name: 'The Swift language' },
    { id: 'memory', name: 'Memory' },
    { id: 'conc', name: 'Concurrency' },
    { id: 'ui', name: 'SwiftUI' },
    { id: 'algo', name: 'Algorithms' },
  ];
  const VIEW_ORDER = ['what', 'parts', 'memory'];
  const VIEW_NAMES = { what: 'What it is', parts: 'Parts and Steps', memory: 'In memory' };
  // The four questions of What it is, in the order a page answers them, with the field of the entry that answers each.
  const QUESTIONS = [
    ['is', 'What is it?'],
    ['problem', 'What problem does it solve?'],
    ['how', 'How does it work?'],
    ['when', 'When do you use it, and when don\'t you?'],
  ];
  const BLOCK_KINDS = ['frame', 'async', 'heap', 'global', 'code', 'removed'];

  // ---------- Sentences ----------

  const escapeHTML = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // A sentence in an entry is plain text with two marks: `name` for code, and {{text}} for what a program prints.
  const textHTML = s => escapeHTML(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\{\{(.+?)\}\}/g, '<samp>$1</samp>');
  // The code that a sentence names, in the order it names it.
  const codeNames = s => [...String(s).matchAll(/`([^`]+)`/g)].map(m => m[1]);

  // ---------- Swift code ----------

  const KEYWORDS = new Set(['func', 'let', 'var', 'return', 'in', 'final', 'class', 'struct', 'enum', 'case', 'if', 'else', 'for',
    'while', 'guard', 'switch', 'default', 'import', 'true', 'false', 'nil', 'self', 'init', 'deinit', 'private', 'static', 'throws',
    'try', 'await', 'async', 'protocol', 'weak', 'some', 'any', 'inout']);

  // The end of a string literal that starts at index i, just after its closing quote.
  // An interpolation, \( ... ), can hold parentheses of its own.
  function stringEnd(line, i) {
    let j = i + 1;
    while (j < line.length) {
      if (line[j] === '\\' && line[j + 1] === '(') {
        let depth = 1;
        j += 2;
        while (j < line.length && depth) { if (line[j] === '(') depth++; else if (line[j] === ')') depth--; j++; }
        continue;
      }
      if (line[j] === '\\') { j += 2; continue; }
      if (line[j] === '"') return j + 1;
      j++;
    }
    return line.length;
  }
  // The colored pieces of one line of Swift: keywords, string literals, and a comment at the end.
  function tokens(line) {
    const out = [];
    let i = 0;
    while (i < line.length) {
      const c = line[i];
      if (c === '/' && line[i + 1] === '/') { out.push({ from: i, to: line.length, cls: 'cm' }); break; }
      if (c === '"') { const end = stringEnd(line, i); out.push({ from: i, to: end, cls: 'str' }); i = end; continue; }
      if (/[A-Za-z_]/.test(c)) {
        let j = i + 1;
        while (j < line.length && /\w/.test(line[j])) j++;
        if (KEYWORDS.has(line.slice(i, j))) out.push({ from: i, to: j, cls: 'kw' });
        i = j;
        continue;
      }
      i++;
    }
    return out;
  }

  // A search for a piece of code as it is written, as a whole word when it starts or ends with a letter.
  const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordRegExp = text => new RegExp((/^\w/.test(text) ? '\\b' : '') + escapeRegExp(text) + (/\w$/.test(text) ? '\\b' : ''), 'g');

  // Where a mark is on its line: the nth time its text appears there, as a whole word when it starts or ends with a letter.
  function findMark(code, mark) {
    const line = code[mark.line - 1];
    if (typeof line !== 'string' || !mark.text) return null;
    const re = wordRegExp(mark.text);
    let hit, n = 0;
    while ((hit = re.exec(line))) if (++n === (mark.nth || 1)) return { from: hit.index, to: hit.index + mark.text.length };
    return null;
  }

  // The argument labels between the parentheses that start at index i, just after "(". A declaration such as
  // (of prices: [Int]) has the label "of", a call such as (step: 2) has "step", and an argument with no label, such as (4), has "_".
  // Returns null when the parentheses do not close.
  function labelsAt(text, i) {
    const args = [];
    let depth = 0, from = i;
    for (let j = i; j < text.length; j++) {
      const c = text[j];
      if (c === '"') { j = stringEnd(text, j) - 1; continue; }
      if ('([{'.includes(c)) depth++;
      else if (')]}'.includes(c)) {
        if (depth === 0) {
          if (c !== ')') return null;
          args.push(text.slice(from, j));
          if (args.length === 1 && !args[0].trim()) return [];
          return args.map(a => { const m = a.match(/^\s*(\w+)\s+\w+\s*:/) || a.match(/^\s*(\w+)\s*:/); return m ? m[1] : '_'; });
        }
        depth--;
      } else if (c === ',' && depth === 0) { args.push(text.slice(from, j)); from = j + 1; }
    }
    return null;
  }

  // Every place in a piece of code where a sentence's name of code is, as a list of { line, from, to }, in the plain text of the lines.
  // A name is found as it is written, as a whole word when it starts or ends with a letter, the same as a mark.
  // A Swift function name with argument labels, such as makeCounter(step:), is found where the function is declared or called
  // with those labels, such as makeCounter(step: Int) or makeCounter(step: 2). The place is its base name, makeCounter.
  function findCode(code, name) {
    const text = code.join('\n'), starts = [0];
    code.forEach(l => starts.push(starts[starts.length - 1] + l.length + 1));
    const place = (from, length) => {
      let k = 0;
      while (starts[k + 1] <= from) k++;
      return { line: k + 1, from: from - starts[k], to: from - starts[k] + length };
    };
    const fn = name.match(/^([A-Za-z_]\w*)\(((?:\w+:)+)\)$/);
    const re = fn ? new RegExp(`\\b${fn[1]}(?:<[^<>]*>)?\\(`, 'g') : wordRegExp(name);
    const out = [];
    let hit;
    while ((hit = re.exec(text))) {
      if (!fn) { out.push(place(hit.index, name.length)); continue; }
      const labels = labelsAt(text, hit.index + hit[0].length);
      if (labels && labels.map(l => l + ':').join('') === fn[2]) out.push(place(hit.index, fn[1].length));
    }
    return out;
  }

  // One line of code as HTML, with its colors and its marks. Two marks on a line are either apart, or one is inside the other.
  function lineHTML(line, marks) {
    const toks = tokens(line);
    const cuts = new Set([0, line.length]);
    toks.forEach(t => { cuts.add(t.from); cuts.add(t.to); });
    marks.forEach(m => { cuts.add(m.from); cuts.add(m.to); });
    const points = [...cuts].sort((a, b) => a - b);
    const sorted = marks.slice().sort((a, b) => a.from - b.from || b.to - a.to);
    const open = [];
    let html = '';
    for (let k = 0; k < points.length - 1; k++) {
      const a = points[k], b = points[k + 1];
      while (open.length && open[open.length - 1].to <= a) { html += '</span>'; open.pop(); }
      sorted.filter(m => m.from === a).forEach(m => {
        html += `<span class="mk" data-part="${escapeHTML(m.part)}"${m.label ? ` data-label="${escapeHTML(m.label)}"` : ''}>`;
        open.push(m);
      });
      const t = toks.find(t => t.from <= a && b <= t.to);
      const text = escapeHTML(line.slice(a, b));
      html += t ? `<span class="${t.cls}">${text}</span>` : text;
    }
    while (open.length) { html += '</span>'; open.pop(); }
    return html;
  }
  // Every line of a piece of code as HTML. A mark with no part only labels the code: it gets an id of its own,
  // which no entry has, so it never counts as known.
  function codeHTML(code, marks = []) {
    const placed = marks.map((m, i) => ({ ...m, ...findMark(code, m), part: m.part || `label-${i}` }));
    return code.map((line, k) => lineHTML(line, placed.filter(m => m.line === k + 1 && m.to !== undefined)));
  }

  // ---------- The sentences of a concept, and the code beside each one ----------

  // Every sentence of a concept that a page shows, with where it is and the code that its page shows near it.
  // Each name a sentence writes as code must be in that code, so the reader can see the code it names.
  // Most sentences are beside the concept's example. An answer of when to use it can have a snippet beside it too.
  // whyInExample is shown on What it is of the concept it depends on, beside this concept's example, and that page shows its own example as well.
  // why is shown on Home, which shows no code.
  function sentencesOf(e, entries) {
    const V = e.views || {}, out = [];
    const example = { name: 'the example', code: e.example.code };
    const add = (where, text, places = [example]) => { if (typeof text === 'string') out.push({ where, text, places }); };
    if (V.what) {
      const W = V.what;
      add(`What it is, "${QUESTIONS[0][1]}"`, W.is);
      add('What it is, the sentence under the example', W.afterExample);
      add(`What it is, "${QUESTIONS[1][1]}"`, W.problem);
      add(`What it is, "${QUESTIONS[2][1]}"`, W.how);
      (W.when || []).forEach((w, i) => {
        const sn = w.snippet && (e.snippets || {})[w.snippet];
        add(`What it is, "${QUESTIONS[3][1]}", answer ${i + 1}`, w.text, sn && Array.isArray(sn.code) ? [example, { name: `snippet "${w.snippet}"`, code: sn.code }] : [example]);
      });
      if (W.figure && W.figure.caption) {
        add('What it is, the title of the figure', W.figure.caption.title);
        add('What it is, the caption of the figure', W.figure.caption.text);
      }
    }
    if (V.parts) {
      (V.parts.parts || []).forEach((p, i) => { add(`Parts and Steps, the name of part ${i + 1}`, p.name); add(`Parts and Steps, part ${i + 1}`, p.text); });
      (V.parts.steps || []).forEach((s, i) => add(`Parts and Steps, step ${i + 1}`, s.text));
      if (V.parts.end) add('Parts and Steps, its end', V.parts.end.text);
    }
    if (V.memory) {
      add('In memory, its question', V.memory.question);
      (V.memory.steps || []).forEach((s, i) => add(`In memory, step ${i + 1}`, s.text));
      add('In memory, its answer', V.memory.answer);
    }
    (Array.isArray(e.dependsOn) ? e.dependsOn : []).forEach(d => {
      add(`Home, its reason for depending on "${d.id}"`, d.why, []);
      const other = entries[d.id];
      add(`What it is of "${d.id}", why ${e.id} needs it`, d.whyInExample, other && other.example && Array.isArray(other.example.code)
        ? [{ name: `the example of ${e.id}`, code: e.example.code }, { name: `the example of ${d.id}`, code: other.example.code }]
        : [{ name: `the example of ${e.id}`, code: e.example.code }]);
    });
    return out;
  }

  // ---------- Checks of the entries ----------

  // Everything about the entries that can be checked without building their code. Each problem is one sentence.
  // library/check.js builds and runs the code with swiftc.
  function checkLibrary(entries, known) {
    const problems = [];
    const say = (id, text) => problems.push(`${id}: ${text}`);
    const has = id => Object.prototype.hasOwnProperty.call(entries, id);
    const isList = x => Array.isArray(x);

    for (const [id, e] of Object.entries(entries)) {
      if (e.id !== id) say(id, `its id is "${e.id}", but its file is named ${id}.json`);
      if (!/^[a-z][a-z0-9-]*$/.test(id)) say(id, 'an id is lowercase words joined by hyphens');
      if (!e.name) say(id, 'it has no name');
      if (!e.first) say(id, 'it has no first fact');
      if (/[`{}]/.test(e.first || '')) say(id, 'its first fact names code, but cards show it with no code beside it');
      if (!isList(e.parts)) say(id, 'parts must be a list, empty for a part that cannot be split');
      else e.parts.forEach(p => { if (!has(p)) say(id, `it is made of "${p}", which has no entry`); if (p === id) say(id, 'it is made of itself'); });

      const deps = e.dependsOn || [];
      if (!isList(deps)) { say(id, 'dependsOn must be a list'); continue; }
      if (!e.example) {
        if (e.views) say(id, 'it has views, but no example for them to show');
        if (deps.length) say(id, 'it has no views, so nothing in it can depend on another concept');
        if (e.area) say(id, 'only a concept with an example is on the home map, so only it has an area');
        continue;
      }

      // A concept: an example, an area, and its views.
      if (!AREAS.some(a => a.id === e.area)) say(id, `its area "${e.area}" is not one of ${AREAS.map(a => a.id).join(', ')}`);
      const code = e.example.code;
      if (!isList(code) || !code.length) { say(id, 'its example has no code'); continue; }
      const views = e.views || {};
      const viewIds = Object.keys(views);
      viewIds.forEach(v => { if (!VIEW_ORDER.includes(v)) say(id, `"${v}" is not a view; the views are ${VIEW_ORDER.join(', ')}`); });
      if (!views.what) say(id, 'every concept starts with its view What it is');
      deps.forEach(d => {
        if (!has(d.id)) return say(id, `it depends on "${d.id}", which has no entry`);
        if (!entries[d.id].example) say(id, `it depends on "${d.id}", which is a part, not a concept`);
        if (!d.why) say(id, `its dependency on "${d.id}" has no reason`);
        if (!isList(d.views) || !d.views.length) say(id, `its dependency on "${d.id}" names no view`);
        else d.views.forEach(v => { if (!views[v]) say(id, `its dependency on "${d.id}" names the view "${v}", which it does not have`); });
      });
      if (new Set(deps.map(d => d.id)).size !== deps.length) say(id, 'it lists the same dependency twice');

      const lineOk = n => Number.isInteger(n) && n >= 1 && n <= code.length;
      const memSteps = views.memory ? views.memory.steps || [] : [];
      // Marks: each one is found on its line, and two marks on a line are apart or one inside the other.
      const checkMarks = (marks, where, partsListed) => {
        const placed = [];
        (marks || []).forEach((m, i) => {
          const at = findMark(code, m);
          if (!lineOk(m.line) || !at) return say(id, `${where}: mark ${i + 1}, "${m.text}", is not on line ${m.line}`);
          if (m.part && !has(m.part)) say(id, `${where}: mark ${i + 1} belongs to "${m.part}", which has no entry`);
          if (partsListed && !partsListed.includes(m.part)) say(id, `${where}: mark ${i + 1}, "${m.text}", belongs to "${m.part}", which the view does not list`);
          placed.push({ line: m.line, ...at, i });
        });
        placed.forEach(a => placed.forEach(b => {
          if (a.i < b.i && a.line === b.line && a.from < b.to && b.from < a.to && !(a.from <= b.from && b.to <= a.to) && !(b.from <= a.from && a.to <= b.to))
            say(id, `${where}: marks ${a.i + 1} and ${b.i + 1} overlap without one being inside the other`);
        }));
      };
      // A step says which line runs. Every line number its sentence names is that line, or one it also marks.
      const checkLines = (s, where) => {
        if (!lineOk(s.line)) say(id, `${where}: line ${s.line} is not in the example`);
        [...(s.also || []), ...(s.dim || [])].forEach(n => { if (!lineOk(n)) say(id, `${where}: line ${n} is not in the example`); });
        const named = [...String(s.text).matchAll(/\blines? (\d+)/gi)].map(m => +m[1]);
        named.forEach(n => { if (n !== s.line && !(s.also || []).includes(n) && !(s.dim || []).includes(n)) say(id, `${where}: its sentence names line ${n}, which the step does not mark`); });
      };

      if (views.what) {
        const W = views.what;
        if (!W.is) say(id, 'What it is does not say what it is');
        checkMarks(W.marks, 'What it is');
        (W.when || []).forEach((w, i) => { if (w.snippet && !(e.snippets || {})[w.snippet]) say(id, `answer ${i + 1} of when to use it shows the snippet "${w.snippet}", which does not exist`); });
        if (W.figure) {
          if (!views.memory) say(id, 'its figure shows steps in memory, but it has no In memory view');
          (W.figure.panes || []).forEach(p => { if (!memSteps[p.step - 1]) say(id, `its figure shows memory step ${p.step}, which does not exist`); });
        }
      }
      if (views.parts) {
        const P = views.parts;
        const listed = (P.parts || []).map(p => p.part);
        listed.forEach(p => { if (!e.parts.includes(p)) say(id, `Parts and Steps explains "${p}", which is not one of its parts`); });
        checkMarks(P.marks, 'Parts and Steps', listed);
        if (!(P.steps || []).length) say(id, 'Parts and Steps has no steps');
        (P.steps || []).forEach((s, i) => {
          checkLines(s, `Parts and Steps, step ${i + 1}`);
          if (s.value && (!lineOk(s.value.line) || !s.value.name || s.value.is === undefined)) say(id, `Parts and Steps, step ${i + 1}: its value needs a line, a name, and what it is`);
        });
        if (!P.end || !['answer', 'question'].includes(P.end.kind)) say(id, 'Parts and Steps ends with an answer or a question');
      }
      if (views.memory) {
        if (!memSteps.length) say(id, 'In memory has no steps');
        memSteps.forEach((s, i) => {
          const where = `In memory, step ${i + 1}`;
          checkLines(s, where);
          const ids = (s.blocks || []).map(b => b.id);
          if (new Set(ids).size !== ids.length) say(id, `${where}: two blocks have the same id`);
          (s.blocks || []).forEach(b => {
            if (!BLOCK_KINDS.includes(b.kind)) say(id, `${where}: block "${b.id}" is a "${b.kind}", which is not one of ${BLOCK_KINDS.join(', ')}`);
            if (['frame', 'async', 'heap', 'global'].includes(b.kind) && !isList(b.fields)) say(id, `${where}: block "${b.id}" has no fields`);
            if (b.where !== undefined && (b.kind !== 'removed' || !['stack', 'heap'].includes(b.where))) say(id, `${where}: block "${b.id}" has a where, which only a removed block has, as stack or heap`);
            if (['code', 'removed'].includes(b.kind) && !b.text) say(id, `${where}: block "${b.id}" has no text`);
            if (['global', 'code'].includes(b.kind) && !b.tag) say(id, `${where}: block "${b.id}" needs a tag that says what it is`);
            (b.fields || []).forEach(([, v]) => { if (v && v.to && !ids.includes(v.to)) say(id, `${where}: block "${b.id}" holds the address of "${v.to}", which the step does not show`); });
          });
          (s.highlight || []).forEach(h => { if (!ids.includes(h)) say(id, `${where}: it highlights "${h}", which the step does not show`); });
        });
      }
      Object.entries(e.snippets || {}).forEach(([n, sn]) => { if (!isList(sn.code) || !isList(sn.output)) say(id, `snippet "${n}" needs code and the output it prints`); });
      sentencesOf(e, entries).forEach(s => codeNames(s.text).map(n => n.trim()).forEach(n => {
        if (!s.places.length) say(id, `${s.where}: it names \`${n}\`, but that page shows it with no code beside it. The sentence: ${s.text}`);
        else if (!s.places.some(p => findCode(p.code, n).length)) say(id, `${s.where}: it names \`${n}\`, which is not in ${s.places.map(p => p.name).join(' or ')}. The sentence: ${s.text}`);
      }));
    }

    // Neither relation may go round in a circle: nothing is made of itself, and nothing depends on itself, at any depth.
    const cycle = (next, what) => {
      const state = {};
      const visit = (id, path) => {
        if (state[id] === 'done') return;
        if (state[id] === 'open') { say(id, `${what} goes round in a circle: ${[...path, id].join(' → ')}`); return; }
        state[id] = 'open';
        next(id).filter(has).forEach(n => visit(n, [...path, id]));
        state[id] = 'done';
      };
      Object.keys(entries).forEach(id => visit(id, []));
    };
    cycle(id => entries[id].parts || [], 'made of');
    cycle(id => (entries[id].dependsOn || []).map(d => d.id), 'depends on');
    (known || []).forEach(k => { if (!has(k)) say('known.json', `"${k}" has no entry`); });
    return problems;
  }

  // ---------- What the reader knows ----------

  // The ids of known.json, as a set. An id also counts as known when a known idea is made of it, at any depth:
  // a reader who knows closures knows each part of a closure. Listing and removing work on known.json's own ids only.
  class KnownIds {
    constructor(ids, partsOf) { this.ids = new Set(ids); this.partsOf = partsOf; this.implied = null; }
    has(id) {
      if (!this.implied) {
        this.implied = new Set();
        const walk = x => { if (this.implied.has(x)) return; this.implied.add(x); (this.partsOf(x) || []).forEach(walk); };
        this.ids.forEach(walk);
      }
      return this.implied.has(id);
    }
    add(id) { this.ids.add(id); this.implied = null; return this; }
    delete(id) { const out = this.ids.delete(id); this.implied = null; return out; }
    get size() { return this.ids.size; }
    [Symbol.iterator]() { return this.ids[Symbol.iterator](); }
  }

  // ---------- The library the pages read ----------

  // Opens the library: the entries and known.json, from library-data.js.
  function openLibrary(data) {
    const entries = data.entries;
    // One record for every idea a page can show. An idea with an area is on the home map.
    const ideas = {};
    Object.values(entries).forEach(e => {
      ideas[e.id] = { id: e.id, name: e.name, first: e.first, area: e.area || null, of: e.parts, deps: (e.dependsOn || []).map(d => d.id), entry: e };
    });
    const known = new KnownIds(data.known, id => ideas[id] ? ideas[id].of : []);

    const entryOf = id => entries[id] || null;
    const dep = (id, needed) => { const e = entryOf(id); return e ? (e.dependsOn || []).find(d => d.id === needed) : null; };
    // Why an idea needs an idea it depends on, in one sentence that names no code.
    const why = (id, needed) => { const d = dep(id, needed); return d ? d.why : ''; };
    // The ideas that the first two views of an idea use. Only a concept with its own In memory view splits its study this way.
    const codeDeps = id => {
      const e = entryOf(id);
      if (!e || !e.views || !e.views.memory || !e.views.parts) return null;
      return e.dependsOn.filter(d => d.views.some(v => v !== 'memory')).map(d => d.id);
    };
    const hasStudy = id => !!(entryOf(id) && entryOf(id).example);
    const names = Object.fromEntries(Object.values(ideas).map(i => [i.id, i.name]));

    return { entries, ideas, known, names, why, codeDeps, hasStudy, entryOf, dep, study: root => studyModel(entries, root) };
  }

  // ---------- A study, for Graph and Page ----------

  // The views of a concept, split by level. A concept with Parts and Steps has a box at the code level, for What it is and Parts and Steps,
  // and a box at the memory level for In memory. A concept with no Parts and Steps, such as a stack frame, is about memory, so all its views share one box there.
  function boxesOf(e) {
    const views = VIEW_ORDER.filter(v => e.views && e.views[v]);
    if (views.includes('parts') || !views.includes('memory')) {
      const out = [{ id: e.id, section: 'code', views: views.filter(v => v !== 'memory') }];
      if (views.includes('memory')) out.push({ id: `${e.id}@memory`, section: 'memory', views: ['memory'] });
      return out;
    }
    return [{ id: e.id, section: 'memory', views }];
  }

  // Everything Graph and Page needs for the study of one concept: its sections, a box for each concept at each level,
  // and each concept's views as HTML. A box needs the boxes of the concepts that its views depend on.
  function studyModel(entries, rootId) {
    const BOXES = {}, CONCEPTS = {};
    const boxIds = {};
    (function add(id) {
      if (boxIds[id]) return;
      const e = entries[id];
      boxIds[id] = boxesOf(e).map(b => { BOXES[b.id] = { concept: id, section: b.section, views: b.views, needs: [] }; return b.id; });
      (e.dependsOn || []).forEach(d => add(d.id));
    })(rootId);
    Object.values(BOXES).forEach(B => {
      const e = entries[B.concept];
      (e.dependsOn || []).filter(d => d.views.some(v => B.views.includes(v))).forEach(d => {
        // A view at one level that depends on a concept uses that concept's box at the same level, if it has one.
        const own = boxIds[d.id].find(b => BOXES[b].section === B.section) || boxIds[d.id][0];
        if (!B.needs.includes(own)) B.needs.push(own);
      });
    });
    const sections = [
      { id: 'code', name: 'The code', note: 'what it is, and what it does' },
      { id: 'memory', name: 'In memory', note: 'how it works in memory' },
    ].map(s => ({ ...s, root: boxIds[rootId].find(b => BOXES[b].section === s.id) || null }));
    Object.keys(boxIds).forEach(id => { CONCEPTS[id] = conceptModel(entries, entries[id], entries[rootId]); });
    return { STUDY: { root: rootId, sections }, BOXES, CONCEPTS };
  }

  // A block of memory, as the drawings of Graph and Page take it.
  function blockModel(b) {
    const fields = (b.fields || []).map(([n, v]) => [n, v === null ? { none: 'no value yet' } : v]);
    switch (b.kind) {
      case 'frame': return { id: b.id, area: 'stack', kind: 'frame', title: b.title, tag: 'stack frame', fields };
      // An async frame is the memory made for one call of an async function. It holds what a stack frame holds, but it is on the heap.
      case 'async': return { id: b.id, area: 'heap', kind: 'frame', title: b.title, tag: 'async frame', fields };
      case 'heap': return { id: b.id, area: 'heap', kind: 'heap', title: b.title, tag: 'heap object', fields };
      case 'global': return { id: b.id, area: 'top', kind: 'plain', title: b.title, tag: b.tag, fields };
      case 'code': return { id: b.id, area: 'code', kind: 'plain', title: b.title, tag: b.tag, note: escapeHTML(b.text), mono: true };
      // A removed block is drawn where its memory was: on the stack, or on the heap for an async frame that is freed.
      default: return { id: b.id, area: b.where === 'heap' ? 'heap' : 'stack', kind: 'ghost', title: b.title, tag: 'removed', note: escapeHTML(b.text) };
    }
  }
  // What has been printed by each step: everything the steps up to it printed.
  function withOutput(steps) {
    let printed = [];
    return steps.map(s => { printed = printed.concat(s.prints || []); return printed.slice(); });
  }

  // One concept's views, as HTML. root is the concept the study is of: a concept that it depends on says why, beside the root's code.
  function conceptModel(entries, e, root) {
    const V = e.views || {}, code = e.example.code;
    const C = { name: e.name, code: codeHTML(code) };
    if (V.memory) {
      const outs = withOutput(V.memory.steps);
      C.memory = {
        question: textHTML(V.memory.question),
        steps: V.memory.steps.map((s, i) => ({ html: textHTML(s.text), lines: [s.line], also: s.also || [], out: outs[i], blocks: s.blocks.map(blockModel), changed: s.highlight || [] })),
        answer: textHTML(V.memory.answer),
      };
    }
    if (V.what) {
      const W = V.what;
      const reason = root && root.id !== e.id ? (root.dependsOn || []).find(d => d.id === e.id) : null;
      C.what = {
        code: codeHTML(code, W.marks),
        is: textHTML(W.is),
        isAfter: W.afterExample ? textHTML(W.afterExample) : null,
        problem: W.problem ? textHTML(W.problem) : null,
        how: W.how ? textHTML(W.how) : null,
        when: W.when ? W.when.map(w => ({ html: textHTML(w.text), code: w.snippet ? codeHTML(e.snippets[w.snippet].code) : null })) : null,
        figure: W.figure ? {
          panes: W.figure.panes.map(p => [p.title, C.memory.steps[p.step - 1]]),
          caption: `<b>${textHTML(W.figure.caption.title)}</b> ${textHTML(W.figure.caption.text)}`,
        } : null,
        here: reason && reason.whyInExample ? textHTML(reason.whyInExample) : null,
      };
    }
    if (V.parts) {
      const P = V.parts, outs = withOutput(P.steps);
      C.parts = {
        code: codeHTML(code, P.marks),
        list: P.parts.map(p => ({ id: p.part, name: textHTML(p.name), html: textHTML(p.text) })),
        steps: P.steps.map((s, i) => ({ html: textHTML(s.text), line: s.line, also: s.also, dim: s.dim, value: s.value ? [s.value.line, `${s.value.name} = ${s.value.is}`] : null, out: outs[i] })),
        end: { kind: P.end.kind, title: P.end.kind === 'question' ? 'The question for In memory' : 'So', html: textHTML(P.end.text) },
      };
    }
    return C;
  }

  // ---------- The graph of a study ----------

  // Which boxes the graph shows, in which section and row, and the order they are taught in. isKnown says whether a concept is known.
  // Each section shows the box of the root at its level, and every box it needs, down to the known boxes. A known box's own needs are not shown.
  // A known box can be drawn in more than one section, so a box never needs a known box in another section. Such a copy has its own id.
  function layoutGraph(model, isKnown) {
    const { STUDY, BOXES } = model;
    const known = b => isKnown(BOXES[b].concept);
    const placed = { code: [], memory: [] }, edges = [];
    const copyIn = (b, s) => {
      const id = `${b}~${s}`;
      if (!BOXES[id]) BOXES[id] = { ...BOXES[b], section: s, copyOf: b };
      return id;
    };
    function visit(b, s) {
      if (placed[s].includes(b)) return;
      placed[s].push(b);
      if (known(b)) return;
      BOXES[b].needs.forEach(n => {
        let to = n;
        if (BOXES[n].section !== s && known(n)) to = copyIn(n, s);
        edges.push({ from: b, to });
        visit(to, BOXES[to].section);
      });
    }
    STUDY.sections.forEach(s => { if (s.root) visit(s.root, s.id); });
    // Teaching order: the code first, then memory. A box comes after every box it needs, and known boxes are not taught.
    const order = [];
    (function walk(list) {
      list.forEach(b => { if (order.includes(b) || known(b)) return; walk(BOXES[b].needs); order.push(b); });
    })(STUDY.sections.map(s => s.root).filter(Boolean));
    // Rows: a box is one row below the lowest box in its section that needs it.
    const sections = STUDY.sections.filter(s => placed[s.id].length).map(s => {
      const ids = placed[s.id], row = {};
      const inside = edges.filter(e => ids.includes(e.from) && ids.includes(e.to));
      const rowOf = b => {
        if (row[b] !== undefined) return row[b];
        row[b] = 0;
        const from = inside.filter(e => e.to === b).map(e => rowOf(e.from) + 1);
        return (row[b] = from.length ? Math.max(...from) : 0);
      };
      ids.forEach(rowOf);
      const rows = [];
      ids.forEach(b => (rows[row[b]] = rows[row[b]] || []).push(b));
      return { ...s, boxes: ids, rows: rows.filter(Boolean) };
    });
    return { sections, edges, order };
  }

  return { AREAS, VIEW_ORDER, VIEW_NAMES, QUESTIONS, escapeHTML, textHTML, codeNames, tokens, findMark, findCode, codeHTML, sentencesOf, checkLibrary, KnownIds, openLibrary, layoutGraph };
})();

if (typeof module === 'object' && module.exports) module.exports = Library;
