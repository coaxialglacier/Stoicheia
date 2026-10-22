// Reads SwiftUI Quest, an eight-week SwiftUI course at swiftui.touchideation.com, into JSON, so that its concepts and examples
// can later become ideas on the SwiftUI branch of the skill tree:
//   node library/quest.js            reads the pages already saved in sources/swiftui-quest/html/
//   node library/quest.js --fetch    downloads the pages first, then reads them
// The course is 62 static pages: the course page, swiftui-quest.html, with its 13 parts and 61 lessons; one page for each of
// its 56 days, day-01.html to day-56.html; and 5 cheat sheets, such as sheet-keypaths.html. Every reader gets the same pages:
// signing in only saves the reader's progress.
// It writes two files into sources/swiftui-quest/:
// - quest.json, everything the pages teach: the parts, the lessons, and for each day and each sheet, its steps, with their
//   prose, code, console output, and screenshots, its flash cards, its edge cases, its interview problem, and its reading.
// - concepts.json, an index for the skill tree: each lesson, with the topics of its flash cards and the ids of its cards, edge
//   cases, and problem in quest.json, and each topic, with the cards and lessons that have it.
// Every step, sheet section, flash card, edge case, and interview problem has implementation: true or false, which says whether
// it is an implementation detail. sources/swiftui-quest/implementation.json lists the ids that are, and says what counts as one.
// Text is plain, with code in backticks, as `@State`, as the sentences of an entry are. A screenshot is its address on the site,
// not a copy. Every id is the page's name, a #, and the id on the page, such as day-11#d11-c1, because the pages reuse ids.
// It uses no packages: a small parser below reads the HTML, which the site generates, so every tag it opens is closed.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://swiftui.touchideation.com/';
const OUT = path.join(ROOT, 'sources', 'swiftui-quest'), HTML = path.join(OUT, 'html');
const DAYS = Array.from({ length: 56 }, (_, i) => 'day-' + String(i + 1).padStart(2, '0'));
const SHEETS = ['sheet-expansions', 'sheet-foreach', 'sheet-keypaths', 'sheet-ownership', 'sheet-result-builders'];
const PAGES = ['swiftui-quest', ...DAYS, ...SHEETS];

// The HTML parser. A node is { tag, attrs, kids }, and a piece of text is a string.
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style']);
const ENTITIES = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'", nbsp: ' ' };

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1))
      : ENTITIES[e.toLowerCase()] ?? all);
}

function attrsOf(text) {
  const attrs = {};
  for (const m of text.matchAll(/([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))
    attrs[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  return attrs;
}

function parse(html) {
  const root = { tag: '#root', attrs: {}, kids: [] }, stack = [root];
  const re = /<!--[\s\S]*?-->|<![^>]*>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|[^<]+|</g;
  let m;
  while ((m = re.exec(html))) {
    const top = stack[stack.length - 1];
    if (m[1]) {
      const i = stack.map(n => n.tag).lastIndexOf(m[1].toLowerCase());
      if (i > 0) stack.length = i;
    } else if (m[2]) {
      const node = { tag: m[2].toLowerCase(), attrs: attrsOf(m[3]), kids: [] };
      top.kids.push(node);
      if (RAW.has(node.tag)) {
        const end = html.toLowerCase().indexOf('</' + node.tag, re.lastIndex);
        re.lastIndex = end < 0 ? html.length : html.indexOf('>', end) + 1;
      } else if (!VOID.has(node.tag) && !/\/\s*$/.test(m[3])) stack.push(node);
    } else if (!m[0].startsWith('<!')) top.kids.push(decode(m[0]));
  }
  return root;
}

// Finding nodes. A selector is a tag, a class, or both, as 'details.card', '.front', or 'h2'.
function matches(n, sel) {
  if (typeof n === 'string') return false;
  const [tag, ...classes] = sel.split('.');
  const own = (n.attrs.class || '').split(/\s+/);
  return (!tag || n.tag === tag) && classes.every(c => own.includes(c));
}
function all(n, sel, out = []) {
  for (const k of n.kids || []) if (typeof k !== 'string') { if (matches(k, sel)) out.push(k); all(k, sel, out); }
  return out;
}
function first(n, sel) { return n && all(n, sel)[0]; }
function elements(n) { return n.kids.filter(k => typeof k !== 'string'); }

// Text. raw keeps every character, for code. prose turns inline HTML into one line of plain text, with code in backticks.
function raw(n) { return typeof n === 'string' ? n : n.kids.map(raw).join(''); }
function inline(n) {
  if (typeof n === 'string') return n;
  if (n.tag === 'br') return '\n';
  if (n.tag === 'code') return '`' + raw(n) + '`';
  if (['button', 'img', 'svg', 'figure'].includes(n.tag) || matches(n, '.device')) return '';
  return n.kids.map(inline).join('');
}
function prose(n) {
  if (!n) return '';
  return (Array.isArray(n) ? n.map(inline).join('') : inline(n)).replace(/[ \t\r\n ]+/g, ' ').trim();
}
function links(n) {
  return all(n, 'a').filter(a => /^https?:/.test(a.attrs.href || '')).map(a => ({ title: prose(a), url: a.attrs.href }));
}
function absolute(src) { return new URL(src, SITE).href; }

// Blocks: what a part of a page shows, in order. Each block is one of
//   { type: 'text', text }                   a paragraph, or the words of a list item
//   { type: 'heading', text }
//   { type: 'label', text }                  the words over the output or screenshot that follows, as "Run the app (⌘R):"
//   { type: 'code', code, kind, where }      kind is 'swift', 'err' for a compiler message, 'quote' for code quoted from a
//                                            source, or 'sil'; where is the file and place it goes, as "Add to Styles.swift"
//   { type: 'output', text }                 what the console showed
//   { type: 'image', src, caption, device }  a screenshot
//   { type: 'table', rows }
//   { type: 'list', ordered, items }         each item is a list of blocks
//   { type: 'note', label, blocks }
//   { type: 'source', text, links }          where an answer comes from
//   { type: 'answer', blocks }               what "Show the answer" opens
const INLINE = new Set(['a', 'b', 'i', 'em', 'strong', 'code', 'span', 'small', 'sup', 'sub', 'kbd', 'br', 'abbr', 'mark', 'q', 's', 'u']);
const SKIP = new Set(['button', 'nav', 'script', 'style', 'svg', 'colgroup', 'summary']);

function blocks(n, out = []) {
  let run = [], where = null;
  const flush = () => { const text = prose(run); if (text) out.push({ type: 'text', text }); run = []; };
  for (const k of n.kids) {
    const images = typeof k === 'string' ? [] : all(k, 'img');
    if (typeof k === 'string' || (INLINE.has(k.tag) && !matches(k, 'span.label') && !images.length)) { run.push(k); continue; }
    flush();
    // A picture inside a link, as each picture that a day gives to download is.
    if (INLINE.has(k.tag) && images.length) {
      for (const img of images) out.push({ type: 'image', src: absolute(img.attrs.src), alt: img.attrs.alt || '', caption: prose(k) });
      continue;
    }
    if (SKIP.has(k.tag) || matches(k, 'div.sno') || matches(k, 'div.console-bar')) continue;
    if (matches(k, 'div.where')) where = prose(k);
    else if (k.tag === 'pre') {
      const kind = (k.attrs.class || '').split(/\s+/).find(c => ['err', 'quote', 'sil'].includes(c))
        || (matches(k, '.console-out') ? 'output' : 'swift');
      if (kind === 'output') out.push({ type: 'output', text: raw(k).replace(/\n$/, '') });
      else out.push({ type: 'code', code: raw(k).replace(/\n$/, ''), kind, ...(where ? { where } : {}) });
      where = null;
    } else if (/^h[1-6]$/.test(k.tag)) out.push({ type: 'heading', text: prose(k) });
    else if (k.tag === 'p') {
      if (matches(k, 'p.outlabel')) out.push({ type: 'label', text: prose(k) });
      else if (matches(k, 'p.src')) out.push({ type: 'source', text: prose(k), links: links(k) });
      else { const text = prose(k); if (text) out.push({ type: 'text', text }); }
    } else if (k.tag === 'ul' || k.tag === 'ol')
      out.push({ type: 'list', ordered: k.tag === 'ol', items: elements(k).filter(li => li.tag === 'li').map(li => blocks(li)) });
    else if (k.tag === 'figure') {
      for (const img of all(k, 'img')) {
        const cap = first(k, 'figcaption'), device = first(k, '.device');
        out.push({ type: 'image', src: absolute(img.attrs.src), alt: img.attrs.alt || '', caption: prose(cap),
          ...(device ? { device: prose(device) } : {}) });
      }
    } else if (k.tag === 'table')
      out.push({ type: 'table', rows: all(k, 'tr').map(tr => elements(tr).filter(c => c.tag === 'td' || c.tag === 'th').map(prose)) });
    else if (matches(k, 'div.note')) {
      const label = first(k, 'span.label');
      out.push({ type: 'note', label: prose(label), blocks: blocks({ kids: k.kids.filter(c => c !== label) }) });
    } else if (matches(k, 'details.seal')) out.push({ type: 'answer', blocks: blocks(k) });
    else if (matches(k, 'span.label')) out.push({ type: 'heading', text: prose(k) });
    else blocks(k, out);
  }
  flush();
  return out;
}

// Each lesson's number and title, from a line such as "Lesson 11: View modifiers, and why their order matters".
function lessonsIn(text) {
  return [...text.matchAll(/Lesson (\d+): (.*?)(?= · Lesson \d+:|$)/g)].map(m => ({ number: +m[1], title: m[2].trim() }));
}

// The parts of a day page or a sheet that every such page has.
function readPage(name, doc) {
  const head = first(doc, 'header.dayhead'), sheet = first(doc, 'div.sheet');
  const page = { id: name, url: SITE + name + '.html', title: prose(first(head, 'h1')), sub: prose(first(head, 'p.sub')) };
  const crumbs = prose(first(doc, 'div.crumbs .dim') || first(doc, 'span.dim'));
  if (crumbs) page.crumbs = crumbs;
  page.intro = {};
  for (const p of all(first(doc, 'div.intro') || { kids: [] }, 'p')) {
    const label = first(p, 'span.label');
    if (label) page.intro[prose(label)] = prose(p.kids.filter(k => k !== label));
    else page.intro.text = (page.intro.text ? page.intro.text + '\n' : '') + prose(p);
  }
  page.steps = all(doc, 'section.step').map(s => {
    const b = blocks(s), title = prose(first(s, 'h2'));
    if (b[0] && b[0].type === 'heading' && b[0].text === title) b.shift();
    // A section of a sheet says which day teaches it, as "5 · from day 4".
    const label = prose(first(s, 'div.sno')), from = label.match(/from day (\d+)/);
    return { id: name + '#' + s.attrs.id, label, ...(from ? { fromDay: +from[1] } : {}), title, blocks: b };
  });
  // The two days of mock interviews have no steps, only what to do, in one section.
  const plan = first(doc, 'section.lesson');
  if (plan) page.plan = blocks(plan);
  // What comes after the steps and before the flash cards, each under its own heading, such as "What you built today" and
  // "The finished project".
  page.closing = [];
  let heading = null;
  for (const k of elements(sheet)) {
    if (matches(k, 'div.cards-head') || matches(k, 'div.edges-head') || matches(k, 'div.exam')) break;
    if (k.tag === 'h2') page.closing.push(heading = { heading: prose(k), blocks: [] });
    else if (heading) blocks({ kids: [k] }, heading.blocks);
  }
  page.cards = all(doc, 'details.card').map(c => {
    const tag = prose(first(c, '.tag')), [kindName, ...topic] = tag.split(' · ');
    return { id: name + '#' + c.attrs.id, kind: matches(c, '.trick') ? 'trick' : 'syntax', kindName, topic: topic.join(' · '),
      front: prose(first(c, '.front')), back: blocks(first(c, '.back')) };
  });
  page.edges = [];
  let lesson = null;
  for (const k of all(doc, 'div.edges').flatMap(elements)) {
    if (matches(k, 'h3.edge-lesson')) lesson = lessonsIn(prose(k))[0] || { title: prose(k) };
    else if (matches(k, 'section.edge')) {
      // Its label, as "Lesson 11 · question 1 of 10 · what a modifier returns", names its lesson on every page, and only a
      // day with two lessons has a heading for each.
      const label = prose(first(k, 'div.edge-no')), seal = first(k, 'details.seal');
      const named = label.match(/^Lesson (\d+)/);
      if (named) lesson = { number: +named[1] };
      const question = blocks({ kids: k.kids.filter(c => c !== seal && !matches(c, 'div.edge-no')) });
      page.edges.push({ id: name + '#' + k.attrs.id, ...(lesson && lesson.number ? { lesson: lesson.number } : {}), label,
        topic: label.split(' · ').slice(2).join(' · '), question, answer: seal ? blocks(seal) : [] });
    }
  }
  const exam = first(doc, 'div.exam');
  if (exam) {
    const inner = first(exam, 'div.in'), seal = first(exam, 'details.seal'), src = elements(inner).find(k => matches(k, 'p.src'));
    // What the problem gives, such as the code with the bug, is in the problem before its answer.
    const given = blocks({ kids: inner.kids.filter(k => typeof k === 'string'
      || !['div.exam-no', 'h2', 'p.ask', 'p.src', 'details.seal', 'button'].some(sel => matches(k, sel))) });
    page.problem = { id: name + '#' + exam.attrs.id, kind: prose(first(exam, '.exam-kind')), label: prose(first(exam, '.exam-no')),
      title: prose(first(exam, 'h2')), ask: prose(first(exam, 'p.ask')), given,
      ...(src ? { source: { text: prose(src), links: links(src) } } : {}), answer: seal ? blocks(seal) : [] };
  }
  page.reading = all(doc, 'ul.reslist').flatMap(links);
  return page;
}

// The course page: its parts, and the days and lessons of each part.
// The section of cheat sheets is a part too, with no days, and its sheets are read from their own pages.
function readCourse(doc) {
  return all(doc, 'section.part').filter(s => all(s, 'div.day').some(d => d.attrs['data-day'])).map(s => {
    const meta = {};
    for (const p of all(first(s, 'div.part-meta') || { kids: [] }, 'p')) {
      const label = first(p, 'span.label');
      if (label) meta[prose(label)] = prose(p.kids.filter(k => k !== label));
    }
    const no = prose(first(s, 'div.part-no'));
    return {
      id: s.attrs.id, label: no, number: +(no.match(/^Part (\d+)/) || [])[1] || null, title: prose(first(s, 'h2')),
      intro: prose(first(s, 'p.part-intro')), youBuild: meta['You build'] || '', youCanExplain: meta['You can explain'] || '',
      days: all(s, 'div.day').filter(d => d.attrs['data-day']).map(d => ({
        day: +d.attrs['data-day'], title: d.attrs['data-title'], page: d.attrs['data-href'].replace(/\.html$/, ''),
        lessons: (d.attrs['data-lessons'] || '').split(',').filter(Boolean).map(Number),
        texts: all(first(d, 'div.what'), 'p').map(prose),
      })),
    };
  });
}

async function fetchPages() {
  fs.mkdirSync(HTML, { recursive: true });
  for (const name of PAGES) {
    const res = await fetch(SITE + name + '.html');
    if (!res.ok) throw new Error(name + '.html: ' + res.status);
    fs.writeFileSync(path.join(HTML, name + '.html'), await res.text());
  }
  console.log('Downloaded ' + PAGES.length + ' pages into ' + path.relative(ROOT, HTML));
}

async function main() {
  if (process.argv.includes('--fetch')) await fetchPages();
  const read = name => parse(fs.readFileSync(path.join(HTML, name + '.html'), 'utf8'));

  const parts = readCourse(read('swiftui-quest'));
  const days = DAYS.map(name => readPage(name, read(name)));
  const sheets = SHEETS.map(name => readPage(name, read(name)));

  // Which pieces are implementation details. An id in the list that no page has any more is reported, so that the list is
  // checked again after the pages change.
  const marked = new Set(JSON.parse(fs.readFileSync(path.join(OUT, 'implementation.json'), 'utf8')).ids);
  const pieces = [...days, ...sheets].flatMap(p => [...p.steps, ...p.cards, ...p.edges, ...(p.problem ? [p.problem] : [])]);
  for (const piece of pieces) piece.implementation = marked.has(piece.id);
  const found = new Set(pieces.map(piece => piece.id));
  for (const id of marked) if (!found.has(id)) console.log('implementation.json names ' + id + ', which no page has');

  // Each lesson: its title from the day page's subtitle, and its summary from the course page, where it is the words after
  // the title, as "Lesson 8: Text, images, and SF Symbols. Showing text, pictures, and icons, ...".
  const lessons = [];
  for (const part of parts) for (const d of part.days) {
    const day = days[d.day - 1], titles = lessonsIn(day.sub);
    for (const number of d.lessons) {
      const title = (titles.find(t => t.number === number) || {}).title || '';
      const text = d.texts.find(t => t.startsWith('Lesson ' + number + ':')) || '';
      const rest = text.slice(('Lesson ' + number + ': ').length);
      const summary = rest.startsWith(title) ? rest.slice(title.length).replace(/^[.:]\s*/, '') : rest;
      lessons.push({ number, title, summary, part: part.number, partTitle: part.title, day: d.day, page: day.id, url: day.url });
    }
  }

  const quest = {
    source: SITE + 'swiftui-quest.html', read: new Date().toISOString().slice(0, 10),
    about: 'SwiftUI Quest: 61 lessons in 13 parts over 56 days, for a UIKit engineer, current to Xcode 27, iOS 27 and Swift 6.4.',
    parts: parts.map(({ days: ds, ...p }) => ({ ...p, days: ds.map(({ texts, ...d }) => d) })),
    lessons, days, sheets,
  };

  // The index for the skill tree. A day with two lessons does not say which of them each card belongs to, so a card on such a
  // day lists both lessons. Its edge cases do say, under a heading for each lesson.
  const topics = new Map();
  const topic = name => topics.get(name) || topics.set(name, { name, syntax: 0, trick: 0, cards: [], lessons: new Set(), pages: new Set() }).get(name);
  for (const page of [...days, ...sheets]) {
    const its = lessons.filter(l => l.page === page.id).map(l => l.number);
    for (const c of page.cards) {
      const t = topic(c.topic);
      t[c.kind]++; t.cards.push(c.id); t.pages.add(page.id); its.forEach(n => t.lessons.add(n));
    }
  }
  const concepts = {
    source: quest.source, read: quest.read,
    lessons: lessons.map(l => {
      const day = days[l.day - 1], shared = lessons.filter(o => o.day === l.day && o.number !== l.number).map(o => o.number);
      const edges = day.edges.filter(e => e.lesson === l.number || (!e.lesson && !shared.length));
      return {
        id: 'lesson-' + l.number, ...l, ...(shared.length ? { sharesDayWith: shared } : {}),
        youWillBuild: day.intro['You will build'] || '', why: day.intro.Why || '',
        steps: day.steps.map(s => s.title),
        topics: [...new Set(day.cards.map(c => c.topic))],
        cards: day.cards.map(c => c.id), edges: edges.map(e => e.id),
        ...(day.problem ? { problem: day.problem.id } : {}),
        examples: day.steps.reduce((n, s) => n + s.blocks.filter(b => b.type === 'code' && b.kind === 'swift').length, 0)
          + day.cards.filter(c => c.back.some(b => b.type === 'code')).length,
      };
    }),
    topics: [...topics.values()].sort((a, b) => a.name.localeCompare(b.name))
      .map(t => ({ ...t, lessons: [...t.lessons].sort((a, b) => a - b), pages: [...t.pages] })),
    sheets: sheets.map(s => ({ id: s.id, title: s.title, sub: s.sub, sections: s.steps.map(x => x.title),
      topics: [...new Set(s.cards.map(c => c.topic))], cards: s.cards.map(c => c.id) })),
    problems: days.filter(d => d.problem).map(d => ({ id: d.problem.id, title: d.problem.title, label: d.problem.label, ask: d.problem.ask })),
  };

  fs.writeFileSync(path.join(OUT, 'quest.json'), JSON.stringify(quest, null, 1) + '\n');
  fs.writeFileSync(path.join(OUT, 'concepts.json'), JSON.stringify(concepts, null, 1) + '\n');

  const count = (list, f) => list.reduce((n, x) => n + f(x), 0);
  const code = b => b.type === 'code' ? 1 : (b.items ? count(b.items.flat(), code) : 0) + (b.blocks ? count(b.blocks, code) : 0);
  const pages = [...days, ...sheets];
  console.log(`${parts.length} parts, ${lessons.length} lessons, ${days.length} days, ${sheets.length} sheets`);
  console.log(`${count(pages, p => p.steps.length)} steps, ${count(pages, p => p.cards.length)} flash cards in ${topics.size} topics, `
    + `${count(pages, p => p.edges.length)} edge cases, ${count(days, d => d.problem ? 1 : 0)} interview problems`);
  console.log(`${count(pages, p => count(p.steps, s => count(s.blocks, code)) + count(p.cards, c => count(c.back, code))
    + count(p.edges, e => count(e.question, code) + count(e.answer, code)) + (p.problem ? count(p.problem.given, code) + count(p.problem.answer, code) : 0))} code blocks`);
  console.log('Wrote ' + path.relative(ROOT, path.join(OUT, 'quest.json')) + ' and ' + path.relative(ROOT, path.join(OUT, 'concepts.json')));
}

main().catch(e => { console.error(e); process.exit(1); });
