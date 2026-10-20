---
name: build-out
description: Build out one Stoicheia concept from start to finish. Check what the concept is really made of and what it depends on, test every fact with swiftc, write its entries in concepts/, and run the checker. Use when the user says "build out <concept>" or types /build-out <concept>.
argument-hint: <concept, such as "async function" or task>
---

# Build out a concept

The user names a concept: $ARGUMENTS

Building out a concept means writing the information side of it: what it is really made of, what it depends on, the example, the facts and steps of each view, and the checks that prove them. The pages are built from that data by code. Never write HTML or drawing coordinates for a concept.

Read these first, every time. They are the rules this work follows:

- `TEACHING-PHILOSOPHY.md`, all of it.
- `CLAUDE.md`, the section "The concept library", which gives the format of an entry.
- Two finished concepts, as models: `concepts/captured-variables.json`, which has all three views, and `concepts/async-function.json`, which checks memory facts in the IR.

## 1. See what is there now

- List `concepts/`. If the concept or any of its parts already has an entry, read it. An entry that exists is not written again. Change one only to fix something that is wrong, and say so in the report.
- Read `known.json`. A known concept is not taught, so it changes what the study shows, but not what the entries say.
- Find every place that already names the concept or its parts, such as the old mockup data in `ui-ideas/expand-data.js` and `ui-ideas/home-data.js`. These are guesses from the first mockups, not facts. They are what step 2 checks.

## 2. Find out what the concept really is

Do this before writing any entry. Every claim needs a source that can show it is true.

- The language: The Swift Programming Language, the Swift Evolution proposal that added the feature, and Apple's documentation. Fetch the pages. Do not work from memory.
- The compiler: write small programs in the scratchpad directory, and build each one with the checker's settings: `swiftc -swift-version 6 -Onone -module-name Example main.swift`.
  - Build the wrong forms too, to learn the rules. For example, a call without `await` shows the exact error, which says what the rule is.
  - `-emit-sil` shows what the compiler makes: boxes, heap objects, captures, executor hops.
  - `-emit-ir` shows memory that the SIL does not, such as async frames (`swift_task_alloc`, `%name.debug` in a `.Frame` type) and values on the thread's stack (`= alloca`). Compare the concept with a plain version of the same code, to see what the concept changes.
  - `xcrun swift-demangle -simplified <name>` turns a mangled name into one such as `makeTea(cups:)`.
- The runtime: for a fact about memory that the IR only names, such as where `swift_task_alloc` gets its memory, read the Swift source on GitHub, at the release that matches `swiftc --version`.
- For SwiftUI, UIKit, and Apple's other frameworks, whose source is not public: state only what running code shows, or what Apple's documentation says.
- A behavior that depends on a build setting, such as Swift 6.2's default actor isolation or Approachable Concurrency, is not stated as a fact of the language. Choose an example whose behavior is the same under every setting, or say which setting it needs.

## 3. Check the breakdown

Answer each question in the report, with the reason.

- **Made of.** For each part on the old list: is it a piece of the concept, or something that the concept's sentences use? A piece goes in `parts`. Something its sentences use is a dependency, in `dependsOn`. Old mockups mixed these up: they said a suspension point was made of a thread, but a suspension point only uses the word thread.
- **Missing parts.** Look at the example code. Every piece of syntax that the concept adds is a part. The old list for an async function had no `async`, which is the keyword that makes a function async.
- **Split far enough.** Keep splitting each part until it cannot be split any further. A part explained by one fact is a term, with an empty list of parts.
- **A part inside a part.** When one part's code holds another part's code, the inner part is a part of the outer one, not a part beside it. `<T: Comparable>` holds `T` and `: Comparable`, so a type parameter and a type constraint are parts of a generic parameter clause, as a parameter is a part of a parameter list. Listed side by side, the outer part's sentences have to use the inner parts' names before they are taught.
- **A part that works as a known part does.** When a part works the same way as a part the reader already knows, its first fact says so, in literal words. A type parameter is a parameter that gets a type, not a value, and a type argument is the type that it gets, as an argument is the value that a parameter gets.
- **Facts and steps apart.** A part is a fact: true at every moment, with nothing happening. Something that happens while the program runs is a step, and goes in the steps, not the parts. A suspension point is a part, a place in the code. Suspending is a step.
- **Teaching order.** Each part can use only the parts before it. When two parts seem to need each other, write the first one so that it does not use the second.
- **Views.** Which views does the concept need: What it is, Parts and Steps, In memory? For each view, which concepts do its own sentences use? Those are its dependencies, view by view.
- **Dependencies.** Every concept in `dependsOn` must be an entry with an example. If one is missing, it is built out too, first, by these same steps. The checker refuses a circle of dependencies, even one that goes through different views.

## 4. Write the entries

- One JSON file in `concepts/` for the concept, and one for each new part, as "The format of an entry" in `CLAUDE.md` says.
- One example for every view of the concept: a few lines, everyday names, whole numbers, real values, and output that is the same on every run.
- Every sentence names code only if that code is on the same page: the example, or the snippet beside an answer of when to use it. A first fact names no code.
- Every value and every printed line that a step states is checked by the checker. Each value that a drawing of memory shows needs a probe. Each fact about memory needs a `sil` or an `ir` check, whose `shows` says the fact in plain words.
- Plain, literal words, and no analogies or metaphors.
- Start each sentence with words, not with code. Write "The parameters `a` and `b` have the type `T`", not "`_ a: T` and `_ b: T` use it as a type". A part's text does not start by repeating the code in the part's name. Name only the code that a sentence needs, because the example is beside it.
- When Parts and Steps explains a part that is made of parts, such as a generic parameter clause, the outer part's text says only what the whole part does, in a few sentences. Each inner part is explained under it, in the outer part's own `parts`, with its own name, text, and marks, as "The format of an entry" in `CLAUDE.md` says.
- Each piece of code is named by the term that Swift's documentation uses for it. `func`, `in`, `return`, `async`, and `await` are keywords, not words. `->` is the return arrow. `name:` in a call is an argument label. A closure written between braces is a closure expression. A function without `async` is a synchronous function. Check a term in The Swift Programming Language, whose source is at github.com/swiftlang/swift-book, before using it.
- A sentence that says what is true in general, such as a first fact, is true in every case, not only in the example. A closure captures a constant or variable from the function around it, not one at the top level of a file, so a first fact says "from the function around it", not "from outside its braces".
- No sentence says that a call or a use "chooses" something that no code writes. Say who works it out, when, and from what: swiftc works out the type argument of `largest(3, 8)` when it builds the program, from the types around the call. A part that the code never writes, such as the type argument of a function, says so, and is marked on the code it is worked out from.

## 5. Check it

```bash
node library/check.js <id>
```

```bash
node library/build.js
```

Fix every problem until both pass. Then make sure each `ir` or `sil` check could fail. The check that a function keeps nothing on the thread's stack, for example, was tried on a plain function, which does keep its values there. Then run `node library/check.js` with no id, so the whole library still passes.

## 6. Look at the pages

Start the `stoicheia-server` configuration in `.claude/launch.json`. Open Home, Expand to Parts on the concept (`map-expand.html?root=<id>`), and Graph and Page (`graph-page.html?root=<id>`). Step through every view. Read the console for the names-in-sentences check, which `graph-page.html` writes there.

## 7. Report to the user

- The breakdown before and after: what was right, what was missing, and what was in the wrong relation, each with its reason.
- Each fact about memory or the compiler, and what proves it.
- Anything that could not be checked, and anything left out on purpose.
- Every decision the user still has to make, together in one list, each with a suggestion.
- Add a line to "Status" in `CLAUDE.md` that says what was built, with the date.
