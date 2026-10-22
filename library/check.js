// Checks the concept library with swiftc, in Swift 6 mode:
//   node library/check.js            every concept
//   node library/check.js closure    one concept, by its id
//
// First it runs the checks of ui-ideas/library.js on every entry, with no build, and stops if any fails. One of them checks that
// every name a sentence writes as code is in the code that its page shows near that sentence.
//
// Then, for each concept with an example, it checks that:
// - the example builds, and prints exactly what the steps of Parts and Steps and of In memory say it prints, in order,
//   and what its output says, when it has one;
// - each value a step shows, such as count = 2, is the value the program has there. The checker adds a print after that line
//   (before it, when the line returns), runs the program, and compares. The example's probes are checked the same way.
//   They hold the values that the drawings of memory show;
// - the SIL that swiftc makes at -Onone has, or lacks, the text that each of the example's SIL checks names;
// - the LLVM IR that swiftc makes at -Onone has, or lacks, the text that each of the example's IR checks names;
// - each snippet builds, and prints its output. A snippet with "app": true is a file of an app, such as one with @main before
//   a type that conforms to App: it is built as an app's file is, with -parse-as-library, and not run, because running it would
//   start the app. Its output is an empty list.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { loadLibrary } = require('./load.js');

const SWIFTC = ['-swift-version', '6', '-Onone', '-module-name', 'Example'];
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'stoicheia-check-'));
let jobs = 0;

const run = (cmd, args, opts = {}) => new Promise(resolve => {
  execFile(cmd, args, { maxBuffer: 64 * 1024 * 1024, timeout: 120000, ...opts }, (err, stdout, stderr) => resolve({ ok: !err, stdout, stderr, err }));
});
// Builds a program and runs it. Returns the lines it printed, or the compiler's error. An app's file is only built.
async function buildAndRun(lines, app = false) {
  const dir = path.join(work, String(jobs++));
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'main.swift'), lines.join('\n') + '\n');
  const built = await run('swiftc', [...SWIFTC, ...(app ? ['-parse-as-library'] : []), 'main.swift', '-o', 'program'], { cwd: dir });
  if (!built.ok) return { error: built.stderr.trim() };
  if (app) return { output: [] };
  const ran = await run(path.join(dir, 'program'), [], { cwd: dir });
  if (!ran.ok) return { error: `it stopped with an error: ${ran.stderr.trim() || ran.err.message}` };
  return { output: ran.stdout.replace(/\n$/, '').split('\n').filter((l, i, all) => all.length > 1 || l !== '') };
}
// The SIL of a program, split into its functions. Each function is found by the comment above it, such as // makeCounter(step:).
async function silFunctions(lines) {
  const dir = path.join(work, String(jobs++));
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'main.swift'), lines.join('\n') + '\n');
  const built = await run('swiftc', [...SWIFTC, '-emit-sil', 'main.swift', '-o', 'main.sil'], { cwd: dir });
  if (!built.ok) return { error: built.stderr.trim() };
  const sil = fs.readFileSync(path.join(dir, 'main.sil'), 'utf8').split('\n');
  const fns = {};
  sil.forEach((line, i) => {
    if (!line.startsWith('sil ') || !line.endsWith('{')) return;
    // Above the function: its name, then a line that says how it is isolated.
    let k = i - 1;
    while (k >= 0 && sil[k].startsWith('// Isolation')) k--;
    const name = k >= 0 && sil[k].startsWith('// ') ? sil[k].slice(3) : null;
    const end = sil.findIndex((l, j) => j > i && l.startsWith('} // end sil function'));
    if (name) fns[name] = sil.slice(i, end + 1).join('\n');
  });
  return { fns };
}
// The LLVM IR of a program, split into its functions. Each function is found by its name as swift-demangle -simplified writes it,
// such as makeTea(cups:). swiftc splits an async function into pieces at the places where it can suspend, and every piece has the
// same simplified name, so the pieces are joined into one function. The top-level code of a program that uses await is async_Main,
// and its pieces, such as async_MainTQ0_, are joined into it too.
async function irFunctions(lines) {
  const dir = path.join(work, String(jobs++));
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'main.swift'), lines.join('\n') + '\n');
  const built = await run('swiftc', [...SWIFTC, '-emit-ir', 'main.swift', '-o', 'main.ll'], { cwd: dir });
  if (!built.ok) return { error: built.stderr.trim() };
  const ir = fs.readFileSync(path.join(dir, 'main.ll'), 'utf8').split('\n');
  const pieces = [];
  ir.forEach((line, i) => {
    const m = line.match(/^define [^@]*@("?)([^"(]+)\1\(/);
    if (!m) return;
    const end = ir.findIndex((l, j) => j > i && l === '}');
    pieces.push({ mangled: m[2], text: ir.slice(i, end + 1).join('\n') });
  });
  const names = [...new Set(pieces.map(p => p.mangled))];
  const demangled = await run('xcrun', ['swift-demangle', '-simplified', ...names]);
  if (!demangled.ok) return { error: `swift-demangle did not run: ${demangled.stderr.trim()}` };
  const simple = {};
  demangled.stdout.split('\n').forEach(l => { const [from, to] = l.split(' ---> '); if (to !== undefined) simple[from] = to; });
  const fns = {};
  pieces.forEach(p => {
    const name = p.mangled.startsWith('$s') ? simple[p.mangled] || p.mangled : p.mangled.replace(/T[QY]\d+_$/, '');
    fns[name] = fns[name] ? `${fns[name]}\n${p.text}` : p.text;
  });
  return { fns };
}

const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const unquote = v => /^".*"$/.test(v) ? v.slice(1, -1) : v;
const show = list => list.length ? list.map(l => JSON.stringify(l)).join(', ') : 'nothing';

async function checkEntry(e) {
  const results = [];
  const pass = text => results.push({ ok: true, text });
  const fail = text => results.push({ ok: false, text });
  const code = e.example.code;
  const V = e.views || {};

  // The program prints what the steps say, in order.
  const said = [];
  // A concept with no steps, such as one with only What it is, can say what its example prints in example.output.
  if (e.example.output) said.push(['its example', e.example.output]);
  if (V.parts) said.push(['Parts and Steps', V.parts.steps.flatMap(s => s.prints || [])]);
  if (V.memory) said.push(['In memory', V.memory.steps.flatMap(s => s.prints || [])]);
  const ran = await buildAndRun(code);
  if (ran.error) fail(`the example does not build or run: ${ran.error}`);
  else said.forEach(([view, lines]) => same(ran.output, lines)
    ? pass(`it prints ${show(lines)}, as ${view === 'its example' ? 'its example says' : `the steps of ${view} say`}`)
    : fail(`${view === 'its example' ? 'its example says' : `the steps of ${view} say`} it prints ${show(lines)}, but it prints ${show(ran.output)}`));

  // Each value a step shows, and each probe, is the value the program has there.
  const probes = [];
  (V.parts ? V.parts.steps : []).forEach((s, i) => {
    if (!s.value) return;
    let p = probes.find(q => q.line === s.value.line && q.print === s.value.name && q.from === 'steps');
    if (!p) probes.push(p = { line: s.value.line, print: s.value.name, values: [], from: 'steps', where: [] });
    p.values.push(unquote(String(s.value.is)));
    p.where.push(i + 1);
  });
  (e.example.probes || []).forEach(q => probes.push({ line: q.after, print: q.print, values: q.values.map(String), from: 'probes' }));
  if (probes.length && !ran.error) {
    const out = [];
    code.forEach((line, i) => {
      const indent = line.match(/^\s*/)[0];
      const here = probes.map((p, k) => [p, k]).filter(([p]) => p.line === i + 1);
      const returns = /^return\b/.test(line.trim());
      const prints = here.map(([p, k]) => `${returns ? indent : indent + (line.trim().endsWith('{') ? '    ' : '')}print("⟦probe ${k}⟧", ${p.print})`);
      if (returns) out.push(...prints, line); else out.push(line, ...prints);
    });
    const got = await buildAndRun(out);
    if (got.error) fail(`the program with its probes does not build: ${got.error}`);
    else probes.forEach((p, k) => {
      const seen = got.output.filter(l => l.startsWith(`⟦probe ${k}⟧ `)).map(l => l.slice(`⟦probe ${k}⟧ `.length));
      const what = p.from === 'steps' ? `${p.where.length === 1 ? 'step' : 'steps'} ${p.where.join(' and ')} ${p.where.length === 1 ? 'shows' : 'show'} ${p.print}` : `the drawings show ${p.print}`;
      same(seen, p.values)
        ? pass(`${what} on line ${p.line} as ${show(p.values)}, and the program has ${show(seen)}`)
        : fail(`${what} on line ${p.line} as ${show(p.values)}, but the program has ${show(seen)}`);
    });
  }

  // The SIL has, or lacks, what each check names.
  if ((e.example.sil || []).length) {
    const sil = await silFunctions(code);
    if (sil.error) fail(`swiftc could not make its SIL: ${sil.error}`);
    else e.example.sil.forEach(c => {
      const body = sil.fns[c.in];
      if (!body) return fail(`the SIL has no function "${c.in}"; it has ${Object.keys(sil.fns).filter(n => !n.includes('.') || n.startsWith('Score')).join(', ')}`);
      if (c.has !== undefined) body.includes(c.has) ? pass(`${c.shows} (SIL of ${c.in} has ${c.has})`) : fail(`${c.shows} — but the SIL of ${c.in} does not have ${c.has}`);
      if (c.lacks !== undefined) !body.includes(c.lacks) ? pass(`${c.shows} (SIL of ${c.in} has no ${c.lacks})`) : fail(`${c.shows} — but the SIL of ${c.in} has ${c.lacks}`);
    });
  }

  // The IR has, or lacks, what each check names. The IR shows memory that the SIL does not, such as the async frame of an async function.
  if ((e.example.ir || []).length) {
    const ir = await irFunctions(code);
    if (ir.error) fail(`swiftc could not make its IR: ${ir.error}`);
    else e.example.ir.forEach(c => {
      const body = ir.fns[c.in];
      if (!body) return fail(`the IR has no function "${c.in}"; it has ${Object.keys(ir.fns).filter(n => !/[.<]/.test(n) && !n.startsWith('$')).join(', ')}`);
      if (c.has !== undefined) body.includes(c.has) ? pass(`${c.shows} (IR of ${c.in} has ${c.has})`) : fail(`${c.shows} — but the IR of ${c.in} does not have ${c.has}`);
      if (c.lacks !== undefined) !body.includes(c.lacks) ? pass(`${c.shows} (IR of ${c.in} has no ${c.lacks})`) : fail(`${c.shows} — but the IR of ${c.in} has ${c.lacks}`);
    });
  }

  // Each snippet prints its output.
  for (const [name, sn] of Object.entries(e.snippets || {})) {
    const got = await buildAndRun(sn.code, sn.app === true);
    if (got.error) fail(`snippet "${name}" does not build${sn.app ? ' as a file of an app' : ' or run'}: ${got.error}`);
    else if (sn.app) same(sn.output, []) ? pass(`snippet "${name}" builds as a file of an app`) : fail(`snippet "${name}" is a file of an app, which is not run, so its output must be empty`);
    else same(got.output, sn.output) ? pass(`snippet "${name}" prints ${show(sn.output)}`) : fail(`snippet "${name}" should print ${show(sn.output)}, but prints ${show(got.output)}`);
  }
  return results;
}

(async () => {
  const { entries, problems } = loadLibrary();
  if (problems.length) {
    console.error('The entries have problems that come before any build:');
    problems.forEach(p => console.error(`  ✗ ${p}`));
    process.exit(1);
  }
  const only = process.argv[2];
  const concepts = Object.values(entries).filter(e => e.example && (!only || e.id === only));
  if (only && !concepts.length) { console.error(`There is no concept "${only}" with an example.`); process.exit(1); }
  const version = await run('swiftc', ['--version']);
  console.log(`Checking ${concepts.length} ${concepts.length === 1 ? 'concept' : 'concepts'} with ${(version.stdout || version.stderr).split('\n').find(l => l.includes('Swift version')) || 'swiftc'}\n`);
  const all = await Promise.all(concepts.map(checkEntry));
  let failed = 0;
  concepts.forEach((e, i) => {
    console.log(e.id);
    all[i].forEach(r => { if (!r.ok) failed++; console.log(`  ${r.ok ? '✓' : '✗'} ${r.text}`); });
  });
  fs.rmSync(work, { recursive: true, force: true });
  console.log(failed ? `\n${failed} ${failed === 1 ? 'check failed' : 'checks failed'}.` : '\nEvery check passed.');
  process.exit(failed ? 1 : 0);
})();
