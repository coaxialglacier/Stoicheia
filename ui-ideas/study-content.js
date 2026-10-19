// The study of Captured variables, laid out as views, for Graph and Page.
// Each concept has up to three views: What it is, Parts and Steps, and In memory.
// Every example here was built and run with swiftc 6.2 in Swift 6 mode, and prints what its comments and steps say.
// The memory facts were checked against swiftc's SIL at -Onone: makeCounter(step:) keeps count in a box made by alloc_box,
// and its closure's context is made from the box and step. The closure in makeGreeter() gets a context made from greeting.
// Score() makes its object through an allocating init, on the heap. double(_:) makes nothing on the heap.

// A part's mark on the code. part is the id of the part it belongs to, and label is the name written above it.
const mk = (part, text, label) => `<span class="mk" data-part="${part}"${label ? ` data-label="${label}"` : ''}>${text}</span>`;
const kw = t => `<span class="kw">${t}</span>`;
const str = t => `<span class="str">${t}</span>`;
const cm = t => `<span class="cm">${t}</span>`;

const VIEW_NAMES = { what: 'What it is', parts: 'Parts and Steps', memory: 'In memory' };
const VIEW_ORDER = ['what', 'parts', 'memory'];

// The four questions of What it is, in the order a page answers them.
const QUESTIONS = [
  ['is', 'What is it?'],
  ['problem', 'What problem does it solve?'],
  ['how', 'How does it work?'],
  ['when', 'When do you use it, and when don\'t you?'],
];

// The graph has one section for each level, from the top. Each section has a root box.
const STUDY = {
  root: 'cv',
  sections: [
    { id: 'code', name: 'The code', note: 'what it is, and what it does', root: 'cv' },
    { id: 'memory', name: 'In memory', note: 'how it works in memory', root: 'cv-mem' },
  ],
};

// Each box is one concept at one level. needs lists the boxes that its views use, in the same section.
const BOXES = {
  'cv': { concept: 'cv', section: 'code', views: ['what', 'parts'], needs: ['cl'] },
  'cl': { concept: 'cl', section: 'code', views: ['what', 'parts'], needs: [] },
  'cv-mem': { concept: 'cv', section: 'memory', views: ['memory'], needs: ['sf', 'ho', 'clv'] },
  'sf': { concept: 'sf', section: 'memory', views: ['what', 'memory'], needs: [] },
  'ho': { concept: 'ho', section: 'memory', views: ['what', 'memory'], needs: [] },
  'clv': { concept: 'clv', section: 'memory', views: ['what', 'memory'], needs: [] },
};

// ---------- Memory, for the drawings ----------

// A block of memory in a drawing. Its area is the stack, the heap, the top level of the file, or the program's code.
// Each field is [name, value]. A value is text, to(id) for an address with a line to the block it names, or NONE.
const NONE = { none: 'no value yet' };
const to = id => ({ to: id });
const frame = (id, title, fields) => ({ id, area: 'stack', kind: 'frame', title, tag: 'stack frame', fields });
const heapObj = (id, title, fields) => ({ id, area: 'heap', kind: 'heap', title, tag: 'heap object', fields });
const topConst = (id, title, tag, fields) => ({ id, area: 'top', kind: 'plain', title, tag, fields });
const codeBlock = (id, title, tag, text) => ({ id, area: 'code', kind: 'plain', title, tag, note: text, mono: true });
const removed = (id, title, note) => ({ id, area: 'stack', kind: 'ghost', title, tag: 'removed', note });

// ---------- The code of each concept, used in all of its views ----------

const CODE = {
  cv: [
    `${kw('func')} makeCounter(${mk('step', 'step', 'parameter')}: Int) -> () -> Int {`,
    `    ${kw('var')} ${mk('count-var', 'count', 'declared outside the closure')} = 0`,
    `    ${kw('return')} ${mk('closure', '{', 'the closure')}`,
    `        ${mk('count-use', 'count', 'used in the body')} += ${mk('step', 'step')}`,
    `        ${kw('return')} ${mk('count-use', 'count')}`,
    `    ${mk('closure', '}')}`,
    `}`,
    `${kw('let')} counter = makeCounter(step: 2)`,
    `print(counter())  ${cm('// 2')}`,
    `print(counter())  ${cm('// 4')}`,
  ],
  cl: [
    `${kw('func')} sayHello() {`,
    `    ${kw('let')} ${mk('capture', 'greeting', 'declared outside the braces')} = ${str('"Hello"')}`,
    `    ${kw('let')} greet = ${mk('braces', '{', 'braces')} ${mk('params', '(name: String)', 'parameter list')} ${mk('in', kw('in'))}`,
    `        ${mk('body', `print(${str(`"\\(${mk('capture', 'greeting', 'used in the body')}), \\(name)"`)})`, 'body')}`,
    `    ${mk('braces', '}')}`,
    `    greet(${str('"Ana"')})`,
    `    greet(${str('"Bo"')})`,
    `}`,
    `sayHello()`,
  ],
  sf: [
    `${kw('func')} double(_ ${mk('n', 'n', 'parameter')}: Int) -> Int {`,
    `    ${kw('let')} ${mk('result', 'result', 'local constant')} = n * 2`,
    `    ${kw('return')} result`,
    `}`,
    `${kw('let')} answer = ${mk('call', 'double(4)', 'the call')}`,
  ],
  ho: [
    `${kw('final class')} Score {`,
    `    ${kw('var')} points = 0`,
    `}`,
    `${kw('func')} makeScore() -> Score {`,
    `    ${kw('let')} ${mk('score', 'score', 'an address')} = ${mk('obj', 'Score()', 'a heap object')}`,
    `    ${kw('return')} score`,
    `}`,
    `${kw('let')} ${mk('mine', 'mine', 'the same address')} = makeScore()`,
  ],
  clv: [
    `${kw('func')} makeGreeter() -> (String) -> Void {`,
    `    ${kw('let')} greeting = ${str('"Hello"')}`,
    `    ${kw('return')} ${mk('code', '{', 'the closure\'s code')} (name: String) ${kw('in')}`,
    `        print(${str('"\\(greeting), \\(name)"')})`,
    `    }`,
    `}`,
    `${kw('let')} ${mk('greet', 'greet', 'a closure value')} = makeGreeter()`,
    `greet(${str('"Ana"')})`,
  ],
};

// Small examples that only one answer uses.
const SNIPPETS = {
  total: [
    `${kw('func')} total(of prices: [Int]) -> Int {`,
    `    ${kw('var')} sum = 0`,
    `    prices.forEach { sum += $0 }`,
    `    ${kw('return')} sum`,
    `}`,
    `print(total(of: [3, 4]))  ${cm('// 7')}`,
  ],
  copy: [
    `${kw('func')} showCopy() {`,
    `    ${kw('var')} count = 0`,
    `    ${kw('let')} show = { [count] ${kw('in')} print(count) }`,
    `    count = 5`,
    `    show()  ${cm('// 0')}`,
    `}`,
    `showCopy()`,
  ],
  map: [
    `${kw('let')} doubled = [1, 2, 3].map { (n: Int) ${kw('in')} n * 2 }`,
    `print(doubled)  ${cm('// [2, 4, 6]')}`,
  ],
};

// ---------- The memory steps of each concept ----------

// The memory of Captured variables, step by step. The closure's code is in the program from the start.
const CV_CODE_BLOCK = codeBlock('code', 'the closure\'s code', 'lines 3 to 6', 'count += step …');
const CV_BOX = n => heapObj('box', 'box', [['count', String(n)]]);
const CV_CTX = heapObj('ctx', 'context', [['step', '2'], ['count', to('box')]]);
const CV_COUNTER = topConst('counter', 'counter', 'closure value', [['code', to('code')], ['context', to('ctx')]]);
const CV_GONE = removed('mc', 'makeCounter(step:)', 'its frame is gone');
const CV_STEPS = [
  { html: 'Line 8 calls <code>makeCounter(step: 2)</code>. A stack frame is made for the call, and <code>step</code> in it is 2.',
    lines: [8], blocks: [frame('mc', 'makeCounter(step:)', [['step', '2']]), CV_CODE_BLOCK], changed: ['mc'] },
  { html: 'Line 2 makes <code>count</code>. The closure captures <code>count</code> and changes it, so Swift keeps <code>count</code> in a box: a heap object. The box holds 0, and the frame holds the address of the box.',
    lines: [2], blocks: [frame('mc', 'makeCounter(step:)', [['step', '2'], ['count', to('box')]]), CV_BOX(0), CV_CODE_BLOCK], changed: ['box'] },
  { html: 'Line 3 makes the closure. Its context is made on the heap. The context holds <code>step</code>, which is 2, and the address of the box.',
    lines: [3], also: [4, 5, 6], blocks: [frame('mc', 'makeCounter(step:)', [['step', '2'], ['count', to('box')]]), CV_BOX(0), CV_CTX, CV_CODE_BLOCK], changed: ['ctx'] },
  { html: 'Line 3 returns the closure, and the frame of <code>makeCounter(step:)</code> is removed. Line 8 stores the closure value in <code>counter</code>: the address of its code, and the address of its context. The box stays, because the context holds its address.',
    lines: [8], blocks: [CV_GONE, CV_COUNTER, CV_BOX(0), CV_CTX, CV_CODE_BLOCK], changed: ['counter'] },
  { html: 'Line 9 calls <code>counter()</code>. The body uses the context to find the box, and adds <code>step</code> to the <code>count</code> in it, so the box holds 2. Line 9 prints 2.',
    lines: [9], also: [4, 5], out: ['2'], blocks: [CV_GONE, CV_COUNTER, CV_BOX(2), CV_CTX, CV_CODE_BLOCK], changed: ['box'] },
  { html: 'Line 10 calls <code>counter()</code> again. The box holds 4, and line 10 prints 4.',
    lines: [10], also: [4, 5], out: ['2', '4'], blocks: [CV_GONE, CV_COUNTER, CV_BOX(4), CV_CTX, CV_CODE_BLOCK], changed: ['box'] },
];

const SF_STEPS = [
  { html: 'Line 5 calls <code>double(4)</code>. A stack frame is made for the call, and <code>n</code> in it is 4.',
    lines: [5], blocks: [frame('d', 'double(_:)', [['n', '4']])], changed: ['d'] },
  { html: 'Line 2 sets <code>result</code> to 8, in the same frame.',
    lines: [2], blocks: [frame('d', 'double(_:)', [['n', '4'], ['result', '8']])], changed: ['d'] },
  { html: 'Line 3 returns <code>result</code>, and the frame is removed. <code>n</code> and <code>result</code> no longer exist.',
    lines: [3], blocks: [removed('d', 'double(_:)', 'n and result are gone')], changed: [] },
  { html: 'Line 5 stores the returned 8 in <code>answer</code>.',
    lines: [5], blocks: [removed('d', 'double(_:)', 'n and result are gone'), topConst('answer', 'answer', 'constant', [['answer', '8']])], changed: ['answer'] },
];

const HO_OBJ = heapObj('obj', 'Score', [['points', '0']]);
const HO_STEPS = [
  { html: 'Line 8 calls <code>makeScore()</code>. A stack frame is made for the call. <code>score</code> has no value yet.',
    lines: [8], blocks: [frame('ms', 'makeScore()', [['score', NONE]])], changed: ['ms'] },
  { html: 'Line 5 makes a <code>Score</code> object on the heap, with <code>points</code> set to 0. <code>score</code>, in the frame, holds its address.',
    lines: [5], also: [2], blocks: [frame('ms', 'makeScore()', [['score', to('obj')]]), HO_OBJ], changed: ['obj'] },
  { html: 'Line 6 returns <code>score</code>, and the frame is removed, so <code>score</code> no longer exists. Line 8 stores the returned address in <code>mine</code>. The object stays, because <code>mine</code> holds its address.',
    lines: [6], also: [8], blocks: [removed('ms', 'makeScore()', 'score is gone'), topConst('mine', 'mine', 'constant', [['mine', to('obj')]]), HO_OBJ], changed: ['mine'] },
];

const CLV_CODE_BLOCK = codeBlock('code', 'the closure\'s code', 'lines 3 to 5', 'print(…)');
const CLV_CTX = heapObj('ctx', 'context', [['greeting', '"Hello"']]);
const CLV_GREET = topConst('greet', 'greet', 'closure value', [['code', to('code')], ['context', to('ctx')]]);
const CLV_GONE = removed('mg', 'makeGreeter()', 'its frame is gone');
const CLV_STEPS = [
  { html: 'Line 7 calls <code>makeGreeter()</code>. A stack frame is made for the call.',
    lines: [7], blocks: [frame('mg', 'makeGreeter()', [['greeting', NONE]]), CLV_CODE_BLOCK], changed: ['mg'] },
  { html: 'Line 2 sets <code>greeting</code> to <code>"Hello"</code>, in the frame.',
    lines: [2], blocks: [frame('mg', 'makeGreeter()', [['greeting', '"Hello"']]), CLV_CODE_BLOCK], changed: ['mg'] },
  { html: 'Line 3 makes the closure. Its context is made on the heap, and holds <code>greeting</code>.',
    lines: [3], also: [4, 5], blocks: [frame('mg', 'makeGreeter()', [['greeting', '"Hello"']]), CLV_CTX, CLV_CODE_BLOCK], changed: ['ctx'] },
  { html: 'Line 3 returns the closure, and the frame is removed. Line 7 stores the closure value in <code>greet</code>: the address of the closure\'s code, and the address of its context.',
    lines: [7], blocks: [CLV_GONE, CLV_GREET, CLV_CTX, CLV_CODE_BLOCK], changed: ['greet'] },
  { html: 'Line 8 calls <code>greet</code> with <code>"Ana"</code>. The code at the first address runs, with the context at the second address, so the body finds <code>greeting</code> and prints <samp>Hello, Ana</samp>.',
    lines: [8], also: [4], out: ['Hello, Ana'], blocks: [CLV_GONE, CLV_GREET, CLV_CTX, CLV_CODE_BLOCK], changed: ['ctx', 'code'] },
];

// ---------- The concepts ----------

const CONCEPTS = {
  cv: {
    name: 'Captured variables',
    code: CODE.cv,
    what: {
      is: 'A captured variable is a variable, declared outside a closure, that the closure\'s body uses. The closure uses that same variable, not a copy of it.',
      marks: ['count-var', 'count-use'],
      isAfter: '<code>count</code> is declared inside <code>makeCounter(step:)</code>, outside the closure\'s braces, and the closure\'s body uses it. So <code>count</code> is a captured variable.',
      problem: 'A closure sometimes needs to keep a value between its calls. <code>counter()</code> has to keep how far it has counted. A captured variable does this without a global variable or a class.',
      how: 'The closure keeps <code>count</code> itself, so every call of <code>counter()</code> changes the same <code>count</code>. The first call makes it 2, and the second makes it 4. This still works after <code>makeCounter(step:)</code> has returned, because the closure still has <code>count</code>.',
      when: [
        { html: 'Use one when a closure has to keep or change a value between calls, or change a value that the code around it reads afterward:', code: SNIPPETS.total },
        { html: 'Don\'t use one when the closure should see the value as it was when the closure was made. Instead, put the name in a capture list: names in square brackets at the start of the closure, such as <code>[count]</code>. The closure then gets its own copy:', code: SNIPPETS.copy },
      ],
    },
    parts: {
      list: [
        { id: 'count-var', name: 'The variable <code>count</code>', html: '<code>count</code> is a variable declared on line 2, inside <code>makeCounter(step:)</code> but outside the closure\'s braces.' },
        { id: 'closure', name: 'The closure, lines 3 to 6', html: '<code>makeCounter(step:)</code> returns this closure. It takes no parameters and returns an <code>Int</code>, as <code>() -> Int</code> on line 1 says.' },
        { id: 'count-use', name: 'Where the body uses it', html: 'The body changes <code>count</code> on line 4, and returns it on line 5. These uses are what make <code>count</code> a captured variable.' },
        { id: 'step', name: '<code>step</code>, captured too', html: 'The body also uses <code>step</code>, the parameter on line 1. <code>step</code> is captured too, but a parameter is a constant, so the body only reads it.' },
      ],
      steps: [
        { html: 'Line 8 calls <code>makeCounter(step: 2)</code>, so <code>step</code> is 2.', line: 8 },
        { html: 'Line 2 sets <code>count</code> to 0.', line: 2 },
        { html: 'Line 3 returns the closure, and the call of <code>makeCounter(step:)</code> ends. The closure\'s body does not run.', line: 3, dim: [4, 5] },
        { html: 'Line 8 stores the closure in <code>counter</code>.', line: 8 },
        { html: 'Line 9 calls <code>counter()</code>. The body adds <code>step</code> to <code>count</code>, so <code>count</code> is 2, and returns it. Line 9 prints 2.', line: 9, also: [4, 5], value: [4, 'count = 2'], out: ['2'] },
        { html: 'Line 10 calls <code>counter()</code> again. <code>count</code> is still 2 from the last call, so it becomes 4, and line 10 prints 4.', line: 10, also: [4, 5], value: [4, 'count = 4'], out: ['2', '4'] },
      ],
      // The page adds which number In memory has, and which concepts it uses first, because those depend on what the reader knows.
      end: { kind: 'question', title: 'The question for In memory',
        html: '<code>makeCounter(step:)</code> returned at step 3, but <code>count</code> still exists, and each call of <code>counter()</code> changes it. Where is <code>count</code> kept?' },
    },
    memory: {
      question: '<code>makeCounter(step:)</code> has returned, so its stack frame is gone. Where is <code>count</code> kept?',
      steps: CV_STEPS,
      answer: '<code>count</code> is kept in a box on the heap, and the closure\'s context holds the address of the box.',
    },
  },

  cl: {
    name: 'A closure',
    code: CODE.cl,
    what: {
      is: 'A closure is a function with no name, written between braces. It can be stored in a constant, such as <code>greet</code>, and called later.',
      marks: ['braces'],
      problem: 'Some code is not run where it is written. It is handed to other code, which runs it later, or many times. A closure lets you write that code right where it is handed over, without naming a separate function.',
      how: 'Writing a closure does not run its body. It makes a value, which <code>greet</code> holds, and the body runs each time that value is called: line 6 runs it once, and line 7 runs it again.',
      when: [
        { html: 'Use one when you hand code to a function that runs it, such as <code>map</code>, which runs the closure once for each item:', code: SNIPPETS.map },
        { html: 'Don\'t use one when the code is a job of its own, which other code calls by its name. Then write a function with <code>func</code>, as <code>sayHello()</code> is.' },
      ],
      here: '<code>makeCounter(step:)</code> returns a closure, and each call of <code>counter()</code> runs that closure\'s body.',
    },
    parts: {
      list: [
        { id: 'braces', name: 'The braces, <code>{</code> and <code>}</code>', html: 'The closure starts at <code>{</code> on line 3 and ends at the matching <code>}</code> on line 5. Everything between them belongs to the closure.' },
        { id: 'params', name: 'The parameter list, <code>(name: String)</code>', html: 'The inputs that the closure takes. <code>name</code> is a parameter, and <code>String</code> is its type.' },
        { id: 'in', name: '<code>in</code>', html: 'It ends the parameter list. The body comes after it.' },
        { id: 'body', name: 'The body', html: 'The code that runs each time the closure is called. Here it prints a greeting.' },
        { id: 'capture', name: 'Capture, the last part', html: 'The body uses <code>greeting</code>, which is declared on line 2, outside the braces. A closure captures each constant and variable from outside its braces that its body uses: it keeps <code>greeting</code>, so the body can use it each time it runs.' },
      ],
      steps: [
        { html: 'Line 9 calls <code>sayHello()</code>.', line: 9 },
        { html: 'Line 2 sets <code>greeting</code> to <code>"Hello"</code>.', line: 2 },
        { html: 'Line 3 stores the closure in <code>greet</code>. The body, on line 4, does not run.', line: 3, dim: [4] },
        { html: 'Line 6 calls <code>greet</code> with the argument <code>"Ana"</code>. The body runs with <code>name</code> set to <code>"Ana"</code>, and prints <samp>Hello, Ana</samp>.', line: 6, also: [4], value: [4, 'name = "Ana"'], out: ['Hello, Ana'] },
        { html: 'Line 7 calls <code>greet</code> with <code>"Bo"</code>, and the body prints <samp>Hello, Bo</samp>.', line: 7, also: [4], value: [4, 'name = "Bo"'], out: ['Hello, Ana', 'Hello, Bo'] },
      ],
      end: { kind: 'answer', title: 'So',
        html: '<code>greet</code> holds the closure: its code, and the <code>greeting</code> that it captured. The body runs each time <code>greet</code> is called, not where it is written.' },
    },
  },

  sf: {
    name: 'Stack frame',
    code: CODE.sf,
    what: {
      is: 'A stack frame is the memory made for one call of a function. It holds that call\'s parameters, and its local constants and variables.',
      marks: ['n', 'result', 'call'],
      figure: { panes: [['After line 2', SF_STEPS[1]], ['After double(4) returns', SF_STEPS[3]]],
        caption: '<b>The stack frame of <code>double(4)</code></b>, while the call runs, and after it returns.' },
      isAfter: 'While <code>double(4)</code> runs, its frame holds <code>n</code>, which is 4, and <code>result</code>, which is 8.',
      problem: 'Each call of a function needs its own place for its parameters and local values, so that two calls never change each other\'s values.',
      how: 'The frame is made when the call starts, and removed when the call returns. After <code>double(4)</code> returns, <code>n</code> and <code>result</code> no longer exist. Only the returned value, 8, is kept, in <code>answer</code>.',
      here: '<code>count</code> is declared inside <code>makeCounter(step:)</code>, but it still exists after that call\'s frame is removed. So <code>count</code> cannot be kept in the frame.',
    },
    memory: {
      question: 'Where are <code>n</code> and <code>result</code> while <code>double(4)</code> runs, and what happens to them when it returns?',
      steps: SF_STEPS,
      answer: 'A value in a stack frame exists only until its call returns.',
    },
  },

  ho: {
    name: 'Heap object',
    code: CODE.ho,
    what: {
      is: 'The heap is memory that does not belong to any one call, so it is not removed when a call returns. A heap object is one piece of the heap, made while the program runs, and found by its address.',
      marks: ['score', 'obj', 'mine'],
      figure: { panes: [['After line 5', HO_STEPS[1]], ['After makeScore() returns', HO_STEPS[2]]],
        caption: '<b>A <code>Score</code> object on the heap</b>, while <code>makeScore()</code> runs, and after it returns.' },
      isAfter: '<code>Score()</code> on line 5 makes a heap object. <code>score</code> does not hold the object itself: it holds the object\'s address.',
      problem: 'Some values must stay after the call that made them returns, and be used from more than one place. A stack frame cannot keep them, because it is removed when its call returns.',
      how: 'A heap object stays while something holds its address. When <code>makeScore()</code> returns, <code>score</code> is removed with its frame, but <code>mine</code> holds the same address, so the object stays.',
      here: '<code>count</code> has to stay after <code>makeCounter(step:)</code> returns, and a stack frame cannot keep it. A heap object can.',
    },
    memory: {
      question: '<code>score</code> is removed when <code>makeScore()</code> returns. What happens to the <code>Score</code> object?',
      steps: HO_STEPS,
      answer: 'The object stays, because <code>mine</code> holds its address. A heap object stays while something holds its address.',
    },
  },

  clv: {
    name: 'Closure value',
    code: CODE.clv,
    what: {
      is: 'A closure value is what a constant holds when it holds a closure: two addresses. The first is the address of the closure\'s code. The second is the address of the closure\'s context: a heap object that holds what the closure captured.',
      marks: ['code', 'greet'],
      figure: { panes: [['After line 7', CLV_STEPS[3]]],
        caption: '<b>What <code>greet</code> holds</b>: the address of the closure\'s code, and the address of its context.' },
      problem: 'A closure can be called after the function that made it has returned, from any code that has the closure. So its code and what it captured must stay together, in one value that a constant can hold.',
      how: 'Calling <code>greet</code> runs the code at the first address, and passes it the context at the second address. That is how the body finds <code>greeting</code> after <code>makeGreeter()</code> has returned.',
      here: '<code>counter</code> holds a closure value. Its context is where the closure finds <code>count</code> after <code>makeCounter(step:)</code> returns.',
    },
    memory: {
      question: 'How does the body find <code>greeting</code> after <code>makeGreeter()</code> has returned?',
      steps: CLV_STEPS,
      answer: 'The context is a heap object, so it stays after <code>makeGreeter()</code> returns, and <code>greet</code> holds its address.',
    },
  },
};
