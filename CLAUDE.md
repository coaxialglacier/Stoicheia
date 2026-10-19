# Stoicheia

Stoicheia is a learning tool. The user names a concept they are studying. Stoicheia finds the parts the concept is made of and the concepts it depends on. It teaches each concept in up to three views: what it is, then how it works on its code, with each part labeled on the code and the steps that happen when it runs, and then how it works in memory. Each concept the user does not know is taught right before the first view that needs it.

## The name

Stoicheia, said "STOY-kay-uh", is the Greek title of Euclid's *Elements*, from about 300 BC. Aristotle defines a stoicheion as the first part a thing is made of, which cannot be split into parts of a different kind. The word comes from *stoichos*, a row. Euclid's book proves each proposition only from the propositions before it.

## How Stoicheia teaches

The user approved this philosophy on 2026-10-19. Its section "Words we use" defines the words in this file, such as concept, part, fact, step, and term.

@TEACHING-PHILOSOPHY.md

## Status

- On 2026-10-19, this folder was made, and the user approved TEACHING-PHILOSOPHY.md. Nothing else is built.
- Later on 2026-10-19, the user removed the size check, and changed atomizing to mean splitting a concept into its parts, with the steps kept apart on the running code. TEACHING-PHILOSOPHY.md was rewritten to match, and the user approved the new text on 2026-10-19.
- `ui-ideas/` holds mockups of formats, from 2026-10-19. Parts and Steps, in `ui-ideas/parts-and-steps.html`, is the approved format for a piece of code. Dependency Graph, Side by Side, Steps in Memory, and Trace are candidate formats, rebuilt from the first UI ideas A, B, C, and E. On 2026-10-19 the user decided: the Dependency Graph is the view a study is read in, and Steps in Memory is a view that a study can switch to from Parts and Steps, for the same code. Trace and Side by Side are not decided.
- The first Dependency Graph showed only part names and did not teach enough. Four variations, `graph-page.html`, `graph-pictures.html`, `graph-chapter.html`, and `graph-answer.html`, each teach every concept as a textbook page: what it is, why the named concept needs it, an example with a figure, its parts, and the main point. On 2026-10-19 the user chose Graph and Page, with the graph on the left side, so the reader always sees where the current concept sits among the concepts it needs. Every part of a lesson has its own visible "I know this". Marking a part removes it and its marks on the code. When every part of a concept is known, the concept becomes a known concept.
- Later on 2026-10-19, the user asked that a known concept stay on the dependency graph: a grey dashed box with no number, not in the teaching order, that still opens its page when clicked. The graph shows which concepts depend on which, and that is still useful for a concept the reader knows. Explanations do not change: a known part still vanishes from the page and from the code. TEACHING-PHILOSOPHY.md and `graph-page.html` were changed to match. The user approved the new text on 2026-10-19.
- Later on 2026-10-19, the user said a concept page must first say what the concept is, and chose that each concept is taught in up to three views. What it is answers four questions: what it is, what problem it solves, how it works (in short), and when you use it and when you don't. Parts and Steps shows how it works on the code, and In memory shows how it works in memory. Each view depends only on what its own sentences use, so the graph has two sections, the code and memory, and Stack frame, Heap object, and Closure value are taught after the code views of Captured variables, right before its In memory view. Capture is the last part of a closure. TEACHING-PHILOSOPHY.md was changed to match ("View", "Steps in Memory", "Depends on", and the new section "Each concept answers four questions"), and `graph-page.html` was rebuilt, with its content in `ui-ideas/study-content.js`. The user approved the new text on 2026-10-19.
- swiftc 6.2 shows that a closure written at the top level of a file does not capture a top-level constant: it reads the global directly, and has no context. So the closure example in TEACHING-PHILOSOPHY.md, where `greet` captures `greeting` at the top level, is not true at the memory level. The variations put that example inside a function, where the closure's context does hold `greeting`.
- On 2026-10-19, the user chose the plan in "The concept library" below.
- The main page is a separate page, not the Dependency Graph: a home page for all the concepts, which the user calls ideas. On 2026-10-19 the user chose the Library Map for it, because it connects ideas to each other, and removed the other three main page ideas. Four developed versions are in `ui-ideas/`: `map-focus.html`, `map-known.html`, `map-areas.html`, and `map-paths.html`, with `home-map.html` as the first version. They read the library from `home-data.js`, and `map-core.js` holds one sentence for each connection that says why one idea needs the other. On 2026-10-19 the user chose Paths, in `ui-ideas/map-paths.html`, as the main page. It opens on the study in progress and shows the path from what the reader knows to any idea they pick, in teaching order, with the reason for each connection. A concept whose views need different ideas is split on the path: Captured variables is taught as What it is and Parts and Steps after a closure, then closure value, then its In memory view. "I know this" on a step takes it off the path.
- On 2026-10-19 the user asked to explore a separate page, without changing anything else: `ui-ideas/map-expand.html`, Expand to Parts. A whole idea, such as RxSwift or Generics, is on the left. Clicking it opens the ideas it is made of in the next column to the right, and clicking those opens theirs, until the smallest parts, which cannot be split any further. Its breakdowns are in `ui-ideas/expand-data.js`. Its columns have no numbered names: the scale reads from Chunk, the whole idea, to Atom, a part that cannot be split any further, and each group is labeled "What X is made of". Each idea appears once, in the leftmost column that shows it. Every other open idea that is made of it gets a curved line back to that one pill, instead of a copy, and the pill says how many open ideas use it. Every line is curved. The whole idea starts in the vertical middle of the window. Clicking any pill, known or not, selects it, and the panel on the right stays on it, with a button "Graph and Page →" to the right of its name. The selected pill also gets an "Examine" capsule above its top right, which opens the same Graph and Page. For each concept with an entry in the concept library, the button opens its full study in `graph-page.html`, inside the study of the idea that Expand to Parts has open when that study includes it. For every other idea it opens `ui-ideas/study.html`, the Graph and Page layout built from what the idea is made of, whose other answers are not written yet. Both lead back to Expand to Parts, which keeps its place in sessionStorage. It is an idea to explore, not a decision.
- On 2026-10-19 the user made the Paths map the home page: `ui-ideas/index.html` is now the home page, and no longer a gallery of UI ideas. `map-paths.html` sends old links there. The home page shows every idea by area, and the path to the chosen idea. Clicking an idea on the map chooses it, and an "Examine" capsule pops up above its top right, to the left of its number. Clicking Examine moves that idea's capsule across the window to where Expand to Parts puts its main capsule, then opens Expand to Parts on that idea (`map-expand.html?root=<id>`), with its parts open. Expand to Parts leads back Home, and to Graph and Page through each idea's "Graph and Page →" button. So the pages go Home, then Expand to Parts, then Graph and Page, and back. The other mockups are still in `ui-ideas/`, and no page links to them.
- Later on 2026-10-19, steps 2 and 3 of the order of work were done, and the user approved the two changes to the philosophy above. The library has 27 entries in `concepts/`, written by hand: 7 concepts (function, closure, capture, captured variables, stack frame, heap object, and closure value) and the 20 parts they are made of. `node library/check.js` builds and runs each example with swiftc 6.2, and checks its SIL at -Onone, and every check passes. Home (`index.html`), Expand to Parts (`map-expand.html`), and Graph and Page (`graph-page.html` and `study.html`) now read the library from `ui-ideas/library-data.js`, which `node library/build.js` writes from `concepts/` and `known.json`. The ideas that have no entry yet are in `ui-ideas/mockup-ideas.js`, apart from the library. The other mockups still read the old data files: `home-data.js`, `expand-data.js`, `map-core.js`, `study-content.js`, and `graph-content.js`.
- The entries change two things that the mockups showed. Capture is now a part of a closure, as the philosophy says, so a closure no longer depends on capture: capture depends on a closure. And the dependencies are the ones the sentences use, so a heap object depends on a stack frame, and closure value depends on a closure, a heap object, and a stack frame. The study of Captured variables still teaches Stack frame, Heap object, and Closure value in that order, but its graph in memory is a chain, not three boxes side by side, and a line that would run behind a box curves out around it.
- Later on 2026-10-19, Async function was built out, the first concept of the concurrency area, and the user asked for a command that builds out any concept the same way: `/build-out <concept>`. The old mockup said an async function is made of a function, `await`, and a suspension point, and that a suspension point is made of a thread. The entries change three things. `async` is a part, because it is the word that makes a function async, and the mockup did not have it. A thread is not a part of a suspension point: a suspension point's sentences use the word thread, so Async function depends on Thread. And a suspension point is a part, a place in the code, while suspending is a step. Async function is made of a function, `async`, `await`, and a suspension point. Its code views depend on a function and a thread, and its In memory view also depends on a stack frame and a heap object. Its In memory view shows the async frame: the memory for one call of an async function, which swiftc makes with `swift_task_alloc`, on the heap, so that its values stay while its thread runs other code. The checker now checks facts in the IR as well as the SIL, to prove this. Thread is a concept with What it is only, and its part is the stack. `known.json` does not list Thread, so a study of Async function teaches Stack frame and Thread first.
- Later on 2026-10-19, the user asked for more width for the parts in Parts and Steps. Each part's name stays on one line, with its "I know this" at the right end of the same line. The parts column is up to 400px wide, and never narrower than its widest name. The three columns sit side by side when the lesson is at least 1120px wide. In a narrower window, the code goes on top. The page of a known concept now has "I know this" on each part too. There, a part leaves the page and the code once `known.json` lists it, and the other parts stay. The names written above the code no longer overlap: `spreadLabels` in `ui-ideas/shared.js` measures the names on each line and moves them apart, at least 8px, by as little as it can, as it does for `name:` and `"Ana"` in Function's `greet(name: "Ana")`.
- The rules are not written yet. They go in this file, written from the philosophy, at step 6 of the order of work.
- A change to how Stoicheia teaches goes into the philosophy first, and into the rules only after the user approves it.

## Decisions so far

- Stoicheia is for learning. Synapse, Engrams, and Quants are the user's review system. Do not bring review ideas, such as recall practice or review schedules, into Stoicheia unless the user chooses them.
- Stoicheia teaches concepts from Swift, iOS and Apple's other platforms, and algorithms. Every concept is explained in Swift.
- There is no size check: no limit on the depth of the dependency graph, on the number of concepts a concept uses, or on the number of its facts and steps. A concept is split until its parts cannot be split any further.
- While Stoicheia is being built, work with simple examples, such as a function and its arguments, or a closure.
- The AI and the code share the work. The AI writes JSON data: the entries of the concept library, and each study's question, the contents of its drawings, and its problems. Code does everything that can be computed from that data: the layout of each drawing, the HTML pages, and a check of every rule that can be counted, including building and running each example with swiftc. The AI never writes HTML or drawing coordinates.
- The SVG files in `drawings/` show the philosophy, and were written by hand. They are not study drawings, whose layout the code computes.
- All code is JavaScript, with Node.js for scripts, so the browser and the checker use the same layout code.
- Cortex, in `../Cortex`, is a separate project with its own copy of the philosophy. Do not change Cortex from here.

## The concept library

What the reader knows is checked by code, not decided by the AI, so each study explains only what the reader does not know yet.

- `concepts/` holds one JSON file for each concept and each part, such as `closure.json`, `parameter-list.json`, and `braces.json`. The name of the file is the id of the entry.
- Each entry holds its id, its name, its first fact, and the ids of its own parts, in teaching order. A part that cannot be split any further has an empty list of parts. A concept also has an example: its code, the part each marked piece of the code belongs to, its answers to the four questions of What it is, the steps that happen when the code runs, and the steps in memory. Each concept that an entry depends on names the views that use it, because two views of one concept can depend on different concepts.
- A part is one entry, shared by every concept that has it. A closure and a function both list `"parameter-list"`, so a parameter list is explained in one place.
- `known.json` is the list of ids that the reader knows, such as `["function", "closure"]`. An id also counts as known when a known entry is made of it, at any depth: a reader who knows closures knows capture and the braces. The list of what the reader knows shows only the ids in `known.json`.
- Two things add an id to `known.json`. Finishing a study adds the id of the concept it taught. Clicking "I know this" on a part adds the id of that part. The reader can remove an id again on the list of what they know, which is opened from the top bar and is never part of a study. The page writes `known.json` through a small local Node.js server.
- Building a study is done by code only. A Node.js script reads the entry of the concept, goes through its parts and the parts of those parts, and checks each id against `known.json`, which gives true or false for each one. A known part is not shown at all: no explanation, no name, and no mark on the code. Its name can still appear as a plain word in another part's sentences. An unknown part is explained. An unknown part that has its own parts is taught first, in teaching order. An unknown concept is taught right before the first view that needs it. The dependency graph is the one place a known concept is drawn: each concept that an unknown concept in the graph depends on is a grey dashed box, with no number.
- The AI writes an entry only when an id is not in the library yet. The checker then checks the new entry: every id it lists has an entry, and its example builds and runs with swiftc. After that the entry is kept, and no later study writes it again.
- This is how chunking works in Stoicheia. Once `closure` is in `known.json`, a bigger concept that uses closures does not explain a closure at all. "Closure" is only a word in the sentences that use it, and a grey dashed box on the graph.

### Two relations: made of, and depends on

- Made of: the entry's `parts`. A closure is made of its braces, its parameter list, `in`, its body, and capture. Expand to Parts shows this relation, from the whole idea down to parts that cannot be split any further.
- Depends on: the entry's `dependsOn`. A view depends on each concept that its sentences use, so it is taught first. Home and the dependency graph show this relation.
- The two are separate fields, and one id can be in both. Captured variables is made of a closure, and its first two views depend on a closure. Capture is a part of a closure, and capture depends on a closure, because its sentences use the closure's braces and body.

### The format of an entry

There are two kinds of entry. Code tells them apart by whether an entry has an `example`.

A part has four fields:

```json
{ "id": "parameter-list", "name": "Parameter list",
  "first": "The inputs that a function or closure takes, in parentheses, each with a name and a type.",
  "parts": ["parameter"] }
```

- `id`: lowercase words joined by hyphens, the same as the name of the file.
- `name`: the name on pills, cards, boxes, and lists.
- `first`: its first fact, in one sentence. Cards and the panel of Expand to Parts show it with no code beside it, so it names no code.
- `parts`: what it is made of, as ids, in teaching order.

A concept has those four fields, and these:

- `area`: `swift`, `memory`, `conc`, `ui`, or `algo`. The home map shows only concepts, so only a concept has an area.
- `dependsOn`: a list of `{ "id", "views", "why", "whyInExample" }`. `views` names the views whose sentences use that concept. `why` says why, in one sentence that names no code, and Home shows it on the path. `whyInExample`, when there is one, says the same reason with this concept's example code, and the page of the concept it depends on shows it beside that code.
- `example`: `code`, the lines of one Swift program that every view of the concept shows. `probes` lists values that the drawings of memory show: `{ "after": 2, "print": "count", "values": ["0"] }` means that each time line 2 runs, `count` is then 0. `sil` lists facts about memory, checked in the SIL that swiftc makes at -Onone: `{ "in": "makeCounter(step:)", "has": "alloc_box ${ var Int }, var, name \"count\"", "shows": "Line 2 keeps count in a box, which is a heap object." }`, or `lacks` in place of `has`. `ir` lists facts about memory in the same form, checked in the LLVM IR that swiftc makes at -Onone. The IR shows memory that the SIL does not, such as an async frame: `{ "in": "makeTea(cups:)", "lacks": "= alloca ", "shows": "makeTea(cups:) keeps none of its values on the thread's stack." }`. In the IR, a function is named as `swift-demangle -simplified` names it, and the top-level code of a program that uses `await` is `async_Main`. `output`, when an example has it, is what the example prints, for a concept with no steps that would say it.
- `snippets`: small programs that only one answer uses, each with its `code` and the `output` it prints.
- `views`: `what`, then `parts` and `memory` when the concept needs them.

A sentence is plain text with two marks: `` `count` `` for code, which must match code shown on the same page, and `{{Hello, Ana}}` for what a program prints. Code turns sentences into HTML. An entry holds no HTML and no coordinates.

A mark points at code: `{ "line": 3, "text": "{", "part": "braces", "label": "braces" }`. It marks the first place `text` is found on that line, or the place that `nth` gives. `part` is the entry the code belongs to, so the mark vanishes when that entry is known. `label` is written above the code. A mark with no part only labels the code, such as "an address", and never vanishes. Two marks on one line are apart, or one is inside the other.

`views.what`, What it is:

- `is`, `problem`, and `how` answer the first three questions. `when` answers the fourth, as a list of `{ "text", "snippet" }`: each snippet is shown beside its sentence. Only `is` is required, because a question that does not fit a concept is left out.
- `marks`: the marks on the example that the first answer names.
- `afterExample`: a sentence under the example that ties the first answer to the code.
- `figure`: drawings taken from steps of In memory, as `{ "panes": [{ "title": "After line 2", "step": 2 }], "caption": { "title", "text" } }`.

`views.parts`, Parts and Steps:

- `parts`: the parts it explains, each `{ "part", "name", "text" }`. Each one is in the entry's own `parts`, and its text explains the part on this example.
- `marks`: each part's marks on the code. Each mark belongs to one of the parts the view lists.
- `steps`: in the order the program runs them, each `{ "text", "line", "also", "dim", "value", "prints" }`. `line` is the line that runs. `also` lists lines it marks as well, and `dim` lines that do not run yet. Every line number in the text is one of these. `value` is a value shown beside a line, such as `{ "line": 4, "name": "count", "is": "2" }`. `prints` is what this step prints.
- `end`: `{ "kind": "answer" }` or `{ "kind": "question" }`, with its `text`. A question is the one that In memory answers.

`views.memory`, In memory:

- `question` and `answer`.
- `steps`: each with `text`, `line`, `also`, `prints`, `blocks`, and `highlight`. `blocks` is all of memory after the step. `highlight` lists the ids of the blocks that the step changes or uses.
- A block is `{ "id", "kind", "title", "fields" }`. Its `kind` is `frame` for a stack frame, `async` for the async frame of an async function, which is on the heap, `heap` for a heap object, `global` for a constant at the top level of the file, `code` for the program's code, or `removed` for a frame that is gone. A `removed` block is drawn on the stack, or on the heap when it has `"where": "heap"`, as a freed async frame does. A `global` and a `code` block have a `tag`, such as "closure value". A `code` and a `removed` block have a `text` in place of fields. A field is `[name, value]`, and its value is text, `{ "to": "box" }` for the address of another block in the same step, or `null` for no value yet.

A concept with Parts and Steps has a box at the code level of its dependency graph, for What it is and Parts and Steps, and a box at the memory level for In memory. A concept with no Parts and Steps, such as a stack frame, is about memory, so all its views share one box at the memory level.

### The files and the scripts

- `node library/build.js` checks every entry, then writes `ui-ideas/library-data.js`, which the pages load. Run it after any change to `concepts/` or `known.json`.
- `node library/check.js`, or `node library/check.js closure` for one concept, builds each example with swiftc in Swift 6 mode. It checks that the program prints what the steps of Parts and Steps and of In memory say, in order; that each value a step shows, and each probe, is the value the program has on that line; that the SIL at -Onone has or lacks what each SIL check names; that the IR at -Onone has or lacks what each IR check names; and that each snippet prints its output.
- `library/load.js` reads `concepts/` and `known.json` for both scripts.
- `ui-ideas/library.js` is used by the pages and by the scripts. It checks the entries, turns sentences and code into HTML, and builds each study and the layout of its graph.
- The check of names written as code is one of the entry checks in `library.js`, so `build.js` and `check.js` both run it. `sentencesOf` lists every sentence of a concept with the code that its page shows near it: the example; for an answer of when to use it, also the snippet beside it; and for `whyInExample`, the examples of both concepts. `findCode` looks for each name in the plain lines of that code, and finds a function name such as `makeCounter(step:)` where it is declared or called with those labels. A `why` is shown on Home, which shows no code, so it must name none. Each miss is reported with its entry, its view, and its sentence. `graph-page.html` uses the same `findCode` to mark the code that a name in a sentence points at, so it also finds a name that crosses a colored piece of a line, such as `greet(name: "Ana")`.
- `ui-ideas/pages.js` gives Home, Expand to Parts, and Graph and Page the names they read, such as `IDEAS` and `PIECES`.
- `ui-ideas/mockup-ideas.js` holds the ideas that have no entry yet, from the mockups. When an idea gets an entry, it leaves that file.
- In `.claude/launch.json`, `ui-ideas-library` serves `ui-ideas/` on port 8771.
- `node library/server.js` serves `ui-ideas/` on port 8772 (`stoicheia-server` in `.claude/launch.json`), and writes `known.json`. A page sends each change as `POST /known` with `{ "add": "braces" }` or `{ "remove": "braces" }`, and the server then runs `library/build.js`, so `library-data.js` has the same ids. A page served by a server that only serves files, such as `ui-ideas-library`, sends no changes, so "I know this" there lasts only until the page is reloaded. No page has a control yet that finishes a study.

## Order of work

1. The folder and the philosophy. Done on 2026-10-19, and approved by the user on 2026-10-19.
2. Split three simple concepts by hand into their parts and steps: a function, a closure, and capture. For each one, check that every part stops where it cannot be split any further, and that no step is mixed in with the parts. The results become the first entries of the concept library. Done on 2026-10-19, with captured variables, stack frame, heap object, and closure value too.
3. Define the JSON format of a concept library entry and of `known.json`, as "The concept library" describes. Write the entries for a function, a closure, and capture by hand, with the parts they share. Done on 2026-10-19.
4. Build the code that reads the library and `known.json` and turns a concept into pages, and the local server that writes `known.json`. Done on 2026-10-19: the code that reads the library and builds pages from it, and the server, `library/server.js`. `ui-ideas/parts-and-steps.html` shows the layout of the Parts and Steps format. Cortex's term boxes and moments, in `../Cortex/cortex.js`, may be a starting point.
5. Build the checker, including the checks of a new library entry, and the check that every name written as code in a sentence matches code shown on the same page. The checks of an entry's fields and the swiftc checks were done on 2026-10-19. The check of names written as code was done later on 2026-10-19.
6. Write the rules in this file, and a `/study` command. The command that builds out one concept, `/build-out <concept>` in `.claude/skills/build-out/SKILL.md`, was written on 2026-10-19. It is the part of `/study` that writes new entries.
