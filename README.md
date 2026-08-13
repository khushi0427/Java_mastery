# Java Full-Stack Mastery

A self-hosted, browser-based learning platform for reaching genuine
engineering-level mastery of Java and the Java full-stack ecosystem — built as a
static website (HTML + CSS + vanilla JavaScript) backed by a fixed 43-module
curriculum.

> **Repository root:** this project lives in the repository `Java_mastery`
> (GitHub: `khushi0427/java_mastery`). The project is referred to as
> *java-fullstack-mastery* in planning documents; the on-disk directory name is
> `Java_mastery`. They are the same thing.

---

## Read this first (humans and AI agents alike)

**This repository is the single source of truth.** No part of this project may
depend on chat history, prior sessions, or undocumented context. If it is not
written down in this repository, it does not exist.

If you are an AI agent picking this project up, read in this order **before
changing anything**:

1. `README.md` — this file (what the project is)
2. [`CLAUDE.md`](CLAUDE.md) — permanent operating rules for Claude Code
3. [`docs/AI_INSTRUCTIONS.md`](docs/AI_INSTRUCTIONS.md) — the same rules,
   written for any AI coding agent
4. [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) — what is actually done
   right now
5. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the system is/will be
   built
6. [`docs/CURRICULUM.md`](docs/CURRICULUM.md) — the 43-module curriculum with
   full topic lists, transcribed verbatim from the master brief
7. [`docs/MASTER_BRIEF.md`](docs/MASTER_BRIEF.md) — **the canonical project
   brief**, written by the project owner. Its Section 12 is the authoritative
   curriculum; `CURRICULUM.md` is a transcription of it

Then **inspect the actual repository** (`git status`, list the directories, open
the files) and reconcile what you see against `docs/PROJECT_STATE.md`. The
filesystem outranks the documentation; if they disagree, fix the documentation.

---

## Current project status

| | |
|---|---|
| **Phase** | FOUNDATION — Phase 5 of 6 (Java execution architecture) complete |
| **What exists** | Documentation, the website shell, and the module metadata layer |
| **Website** | Shell + 43-module navigation, dashboard, module overviews, search. No learning content |
| **Module content** | Metadata only — no chapters, exercises, or examples exist |
| **Progress tracking** | Working — saved in this browser under `jfsm.progress` |
| **Code execution / compiler** | Architecture built; **no online provider enabled**. The editor, the `executeJava()` abstraction, two adapters, and the local `javac`/`java` fallback all exist. Running code locally with a JDK needs nothing else. |
| **Modules completed** | 0 of 43 |

The site navigates all 43 modules **as defined by
[`docs/MASTER_BRIEF.md`](docs/MASTER_BRIEF.md)**, shows what each will cover, and
searches module names and topics. **There is no learning content** — every module is
`NOT_STARTED` with zero chapters, and the practice components are shells holding
one labelled placeholder each. Progress you record is saved in this browser. See
[`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) for the authoritative status.

### Running it

```bash
python3 -m http.server 8000    # from the repository root
# then open http://localhost:8000
```

**It must be served over http.** Opening `index.html` as a `file://` path
renders the page but leaves the JavaScript inert — browsers block ES module
scripts on `file://`. Nothing is compiled either way; there is no build step.

---

## 1. Purpose and goals

The goal is **deep internal understanding and real engineering ability**, not
syntax familiarity and not memorised definitions.

Concretely, the platform exists to produce a learner who can:

- Explain *why* Java behaves the way it does — the execution model, the memory
  model, the object model, the collection internals, the framework mechanics —
  not merely *what* the syntax is.
- Predict the output and the failure modes of unfamiliar Java code before
  running it, and explain the prediction.
- Design, build, test, secure, and deploy a complete full-stack application:
  relational database → JPA/Hibernate persistence → Spring Boot service layer →
  REST API → browser client.
- Answer interview questions at reasoning depth ("what happens under the hood
  when…", "why would this design fail under load…") rather than recall depth.
- Debug real problems: N+1 queries, race conditions, memory leaks, transaction
  boundary bugs, classloading errors, misconfigured beans.

**Non-goals.** This is not a beginner programming course, not a certification
cram guide, and not a syntax reference. It does not aim to cover every library
in the ecosystem — it aims for mastery of a deliberately chosen spine.

---

## 2. Learner profile

The curriculum is written for **one specific learner**, and every design
decision follows from this profile:

- **Already a programmer.** Not learning to program — learning Java.
- **Knows C++.** Comfortable with types, pointers/references, memory layout,
  RAII, manual resource thinking, compilation units.
- **Has DSA experience.** Arrays, lists, maps, trees, graphs, complexity
  analysis are already understood as *concepts*; what is new is Java's
  *implementation* of them.
- **Knows JavaScript, HTML, and CSS.** Comfortable in the browser, with the
  DOM, with `fetch`, with asynchronous programming in the JS sense.
- **Transitioning into Java** as a primary language.
- **Wants deep internal understanding**, not definitions.
- **Wants interview-level reasoning** and real engineering ability.

### What this means for content

**Do not spend time teaching what a variable is, what a loop is, what an
`if` statement is, what a function is, or what an array is.** These are known.

Instead, for every such topic, teach the *delta and the depth*:

| Instead of teaching… | Teach… |
|---|---|
| "A variable stores a value" | Stack vs heap placement, reference semantics vs C++ pointer semantics, why Java has no `&`/`*`, what `final` actually guarantees |
| "A loop repeats code" | Enhanced-`for` desugaring, iterator invalidation and `ConcurrentModificationException`, why `for` over `LinkedList` by index is quadratic |
| "An `if` statement branches" | Short-circuit evaluation and its interaction with side effects, `switch` expressions vs statements, pattern matching, branch-prediction-relevant JIT behaviour |
| "A function is reusable code" | Pass-by-value of references, overload resolution rules, dynamic dispatch and the vtable analogy, why static methods do not dispatch |
| "An array holds elements" | Array covariance and `ArrayStoreException`, why generics are invariant instead, memory layout vs C++ arrays, `System.arraycopy` |

Prior C++ and JavaScript knowledge should be used **as leverage and as a
contrast surface** — "in C++ this is X, in Java it is Y, and here is why the
designers chose Y" is a first-class teaching device throughout.

---

## 3. Technology restrictions

### Learning website UI — hard restriction

The learning website's user interface must be built with **HTML + CSS +
vanilla JavaScript only**.

**Not permitted for the site UI:** React, Angular, Vue, Svelte, Next.js,
TypeScript, jQuery, Tailwind, Bootstrap, or any other frontend framework,
build step, transpiler, or bundler.

Rationale: the platform must remain readable, debuggable, and runnable from a
plain static file server — permanently, with zero toolchain rot, by a single
learner maintaining it alone. (One caveat found in practice: because the site
uses ES modules, browsers require it to be *served* rather than opened as a
`file://` path. Nothing is compiled either way — see
[Running it](#running-it).)

### This restriction applies to the UI only

The **curriculum content** teaches the full Java ecosystem without restriction:
Java SE, the JVM, Maven/Gradle, JUnit, SQL, JDBC, JPA, Hibernate, Spring
Framework, Spring Boot, Spring Data, Spring Security, Docker, and so on. The
"no frameworks" rule governs *how the teaching website is built*, never *what
the curriculum covers*.

### Backend / proxy

A small backend or proxy service may be introduced **later, and only if
genuinely required** — realistically, only to hold a secret API key for secure
server-side integration with a Java-execution service (Phase 5). It must not be
introduced for convenience, for a database, for user accounts, or for
server-side rendering. See §8.

### Java version

**Java 17 is the baseline.** All curriculum code must compile and run on
Java 17 unless the topic is explicitly about a newer feature.

Where a language or API feature requires a version newer than 17, the content
**must call this out explicitly and inline**, e.g.:

> *Requires Java 21+ — virtual threads (JEP 444) were finalised in Java 21 and
> are not available on Java 17.*

Features known to require newer versions include (verify against current JDK
documentation before teaching — see §11):

- **Java 21+** — virtual threads, sequenced collections, record patterns,
  pattern matching for `switch` (finalised)
- **Preview features** — structured concurrency and similar APIs remain in
  preview across several releases; never present a preview API as stable, and
  verify its current status against the JDK documentation for the release being
  taught rather than assuming.

---

## 4. The 43-module curriculum

The curriculum is **fixed at 43 modules**. Modules must never be added,
removed, merged, split, renumbered, or renamed. Module numbers are permanent
identifiers used by the website, the progress system, and every cross-reference
in this repository.

Full topic lists live in **[`docs/CURRICULUM.md`](docs/CURRICULUM.md)**, which
transcribes **[`docs/MASTER_BRIEF.md`](docs/MASTER_BRIEF.md)** §12 verbatim —
the brief is canonical. The list below is the index only.

| # | Module |
|---|---|
| 01 | Java Foundations & Execution Model |
| 02 | OOP in Java |
| 03 | Java Language Fundamentals |
| 04 | Strings, Wrappers & Object Fundamentals |
| 05 | Exception Handling |
| 06 | Generics |
| 07 | Java Collections Framework |
| 08 | Hashing & HashMap Internals |
| 09 | Functional Java & Lambda Expressions |
| 10 | Stream API |
| 11 | Optional, Date/Time & Modern Java APIs |
| 12 | Annotations, Enums & Reflection |
| 13 | Java I/O & NIO |
| 14 | JVM Memory & Garbage Collection |
| 15 | Multithreading Fundamentals |
| 16 | Concurrency & Synchronization |
| 17 | Executors & Advanced Concurrency |
| 18 | DSA Foundations in Java |
| 19 | Hashing DSA Patterns |
| 20 | Two Pointers & Sliding Window |
| 21 | Linked Lists, Stack, Queue & Deque |
| 22 | Trees, BST & Heaps |
| 23 | Graphs |
| 24 | Binary Search, Recursion & Backtracking |
| 25 | Greedy & Dynamic Programming |
| 26 | SQL Fundamentals |
| 27 | Advanced SQL & Database Concepts |
| 28 | JDBC |
| 29 | Maven & Java Project Management |
| 30 | JPA Fundamentals |
| 31 | Hibernate Internals & Advanced ORM |
| 32 | Spring Core |
| 33 | Spring Boot Fundamentals |
| 34 | Spring MVC & REST APIs |
| 35 | Spring Data JPA |
| 36 | Spring Security |
| 37 | Testing Java & Spring Applications |
| 38 | Production-Grade Spring Boot |
| 39 | Backend Architecture & Design |
| 40 | Java Full-Stack Integration |
| 41 | Debugging, Performance & Problem Solving |
| 42 | Projects & Interview Engineering |
| 43 | Final Full-Stack Capstone & Mastery Assessment |

---

## 5. Learning methodology

Every chapter drives the learner through the same ten-step cycle. This is
**mandatory, not optional** — content that only explains, without making the
learner predict and build, does not satisfy this project's definition of a
finished chapter.

```
Learn → Predict → Code → Compile → Run → Observe → Debug → Modify → Solve → Explain
```

| Step | What it means |
|---|---|
| **Learn** | Read the concept, including the internal mechanism — not just the API surface |
| **Predict** | State what given code will output *before* running it, in writing |
| **Code** | Type the code by hand. Never copy-paste; typing surfaces compiler errors that teach |
| **Compile** | Compile it and read the compiler's actual messages |
| **Run** | Execute it and capture the real output |
| **Observe** | Compare real output against the prediction; a mismatch is the lesson |
| **Debug** | Deliberately break it, then diagnose the failure from the error/stack trace |
| **Modify** | Change the code to answer "what if…" questions |
| **Solve** | Complete practice problems unaided |
| **Explain** | Articulate the mechanism aloud/in writing as if to an interviewer |

**Practice-first.** Explanation exists to enable practice; practice is not an
optional appendix to explanation. A chapter without working, runnable exercises
is incomplete regardless of prose quality.

---

## 6. Chapter delivery workflow

Once the foundation phases are complete, each chapter is produced by working
through these steps **in order**, and then stopping:

```
Concept
  → Examples
    → Predict-output questions
      → Guided lab
        → Practice problems
          → Hints
            → Execution instructions
              → Solutions
                → Interview questions
                  → Common mistakes
                    → Revision notes
                      → Integration with previous modules
                        → Verification
                          → Update docs/PROJECT_STATE.md
                            → STOP
```

| Step | Requirement |
|---|---|
| **Concept** | The mechanism and the "why", pitched at the learner profile in §2 |
| **Examples** | Complete, compilable programs — not fragments |
| **Predict-output** | Questions the learner answers *before* running anything |
| **Guided lab** | A step-by-step build the learner types out |
| **Practice** | Problems of graded difficulty, solved unaided |
| **Hints** | Progressive nudges, kept separate from solutions |
| **Execution** | Exact commands to compile and run (`javac`/`java`/Maven) |
| **Solutions** | Full worked solutions with reasoning, after the hints |
| **Interview Qs** | Reasoning-depth questions with model answers |
| **Mistakes** | The specific errors this topic produces, and how to recognise them |
| **Revision** | Condensed recall notes for later review |
| **Integration** | Explicit links back to earlier modules; no re-teaching |
| **Verification** | Actually compile and run everything — see §10 |
| **Update state** | `docs/PROJECT_STATE.md` reflects the new reality |
| **STOP** | Do not roll on into the next chapter |

**`CONTINUE` workflow.** Once the foundation is complete, the normal working
protocol is: the learner says `CONTINUE`, and the agent (a) reads
`docs/PROJECT_STATE.md` to find the current position, (b) delivers exactly the
next chapter through the workflow above, (c) updates `docs/PROJECT_STATE.md`,
and (d) stops. One `CONTINUE`, one chapter. Never batch chapters.

---

## 7. Website architecture summary

> **Status: the shell is built (Phase 2). Everything it will contain is not.**

**Built and verified:**

- **Stack:** static HTML + CSS + vanilla JavaScript (three ES modules). No
  framework, no bundler, no transpiler, no build step, no dependencies.
- **Delivery:** static files served by any static file server (see
  [Running it](#running-it)). No server-side rendering.
- **Shell:** fixed top bar, sidebar navigation, and a content region, with
  seven placeholder destinations. Hash-based routing (`#/curriculum`).
- **Theming:** light and dark, user-toggled, persisted in `localStorage` under
  `jfsm.theme`, defaulting to `prefers-color-scheme`, with no flash of the
  wrong theme on load.
- **Layout:** responsive — the sidebar docks beside the content at ≥900px and
  becomes an overlay drawer below that. Verified with no horizontal scrolling
  from 320px to 1920px.
- **Accessibility:** semantic landmarks, skip link, keyboard navigability,
  visible focus states, `aria-expanded` / `aria-current`, a focus trap in the
  drawer, and `prefers-reduced-motion` support.

- **Module metadata:** `data/modules.js` is the single source of module data —
  generated from `docs/CURRICULUM.md`, which is itself a verbatim transcription
  of `docs/MASTER_BRIEF.md` §12. Never hand-maintained at either hop. The sidebar,
  dashboard, curriculum view, module overview, and search all read from it.
- **Search:** client-side, no library, over module names, descriptions, and
  topic keywords. Built from registered *sources* so chapters and practice can
  be added later without a rewrite.
- **Progress tracking:** persisted in `localStorage` under `jfsm.progress`
  (`schemaVersion: 1`), keyed on permanent module ids, behind a single API in
  `assets/js/progress.js`. Reset clears progress but keeps your theme.
- **Practice shells:** exercise, progressive-hint (one at a time), and
  predict-the-output components, rendering from documented data contracts. They
  currently hold one labelled placeholder each — real exercises are authored per
  module.

**Still to come:**

- **Chapter content** as structured data rendered by a small vanilla-JS
  renderer, keeping content and presentation separable.
- **Navigation depth:** module → chapter drill-down, breadcrumbs, previous/next
  chapter, resume-where-you-left-off.
- **Code blocks:** syntax highlighting. Copy-to-clipboard and the run
  affordance arrived in Phase 5.

Detail, decisions, and open questions:
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 8. Compiler / code-execution architecture summary

> **Status: built in Phase 5, shipping with NO online provider enabled.**
> That is a deliberate, supported end state — not an unfinished one.
> Full detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) §11.

Everything that runs code calls one function — `executeJava()` in
`assets/js/execution/service.js` — so no chapter content is ever coupled to a
specific execution provider. It always resolves, never throws, and reports one
of: `success`, `compile-error`, `runtime-error`, `timeout`,
`provider-unavailable`, `invalid-input`, `error`.

- **Local fallback (always available, and the primary path).** Every snippet
  renders the exact `javac` / `java` commands for *that* source — the real file
  name, the real class, the real package — with copy and download buttons. This
  needs nothing but a JDK: no provider, no network, no third party.
- **Online adapters (optional, none enabled).** Adapters for self-hosted
  [Piston](https://github.com/engineer-man/piston) and
  [Judge0](https://github.com/judge0/judge0) exist behind
  `assets/js/execution/config.js`, which ships as `provider: null`.

**Why nothing is preconfigured.** Providers were researched against their live
documentation on 2026-08-13. Piston's public API is, per its own readme, *"no
longer freely available to the public (as of Feb 15, 2026)"*; Judge0's hosted
offerings authenticate with a secret key, and a static site cannot hold a
secret. No keyless, browser-callable Java service could be verified. So the
repository ships honest and unconfigured rather than shipping something broken,
metered, or leaking a key.

**Neither adapter has ever contacted a live instance**, and CORS is unverified
for every provider — it can only be established from a real browser talking to a
real instance. Treat the first run against your own instance as the real test.

**The security rule is absolute.** `config.js` has no field for a key, token, or
password, because it is served verbatim to every visitor. If a provider needs a
secret, it goes in a minimal proxy that forwards the request and nothing else —
the one and only sanctioned reason for server-side code in this project — and
`baseUrl` points at that proxy.

**The platform is fully usable with no provider connected.** Every chapter,
exercise, hint, solution, and predict-the-output question works; the editor
stays editable; the local commands are always there.

## 9. Progress tracking

- Progress lives in the browser's **`localStorage`**. There is **no backend, no
  database, and no user account system**, by design.
- Tracked per learner: chapter completion, module completion, practice problems
  attempted/solved, predict-output accuracy, theme preference, last position
  ("resume where you left off"), and revision flags.
- Storage is versioned and namespaced so the schema can evolve without
  destroying existing progress; migrations must be non-destructive.
- Export/import of progress as a JSON file is planned, since `localStorage` is
  per-browser and clearable.
- Because module numbers are permanent identifiers, progress records key off
  module/chapter IDs — this is one of the reasons the 43-module list is frozen.

Schema detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 10. Development workflow

### Foundation phases (now)

The project is being built in **6 foundation phases**. The specified phases are:

| Phase | Scope | Status |
|---|---|---|
| **1** | Documentation layer (README, CLAUDE.md, `docs/*`) | Complete |
| **2** | Website shell — HTML/CSS/JS, navigation, dark/light mode, responsive layout | Complete and verified |
| **3** | Dashboard + 43-module metadata layer + search foundation | Complete and verified |
| **4** | Progress tracking (localStorage) + practice / hint / predict-output UI shells | Complete and verified |
| **5** | Java execution architecture — editor, execution-service abstraction, online adapter seam, local fallback | Complete and verified; **no online provider enabled** |
| **6** | *Not yet specified by the project owner* | Awaiting specification |

Phase 6 has **not** been defined. No agent may invent, assume, or act on a
scope for it; wait for an explicit instruction. Each phase is
delivered on explicit instruction only, and each ends with a STOP.

### After the foundation

Once all six foundation phases are complete, work switches to the per-chapter
`CONTINUE` workflow described in §6 — one chapter per `CONTINUE`, with
`docs/PROJECT_STATE.md` updated every time.

---

## 11. Verification requirements

**Nothing is marked complete, tested, working, or verified unless it actually
was.** This rule is absolute and applies to every agent and every phase.

- Code is "compiles" only after it was actually compiled, and "runs" only after
  it was actually run and its real output observed.
- If something cannot be verified in the current environment, say so explicitly
  in this form: **"Not verified because: …"** — never silently imply success.
- A file existing is not evidence that the work is done. Directory structure is
  not progress.
- **No fabrication.** Never invent APIs, annotations, framework behaviour, JVM
  behaviour, Maven behaviour, benchmark numbers, or version histories. Verify
  against current official documentation when uncertain; if it cannot be
  verified, do not present it as fact.
- Status is recorded with an explicit vocabulary, never with vague words:

| Status | Meaning |
|---|---|
| `NOT_STARTED` | Nothing exists |
| `FOUNDATION_ONLY` | Structure/scaffolding exists; no real content |
| `IN_PROGRESS` | Partially built; explicitly incomplete |
| `CONTENT_COMPLETE` | All content written, but not yet verified |
| `VERIFIED` | Content complete **and** every example actually compiled and run |

---

## 12. Project folder structure

Everything that actually exists today (Phases 1–2):

```
Java_mastery/
├── index.html                 ← the app shell
├── README.md                  ← this file
├── CLAUDE.md                  ← permanent rules for Claude Code
├── assets/
│   ├── css/
│   │   ├── base.css           ← reset, non-colour tokens, typography, focus
│   │   ├── theme.css          ← the complete colour system, light + dark
│   │   └── layout.css         ← topbar, sidebar, drawer, content
│   └── js/
│       ├── app.js             ← bootstrap / entry point
│       ├── dom.js             ← element builder (no innerHTML)
│       ├── theme.js           ← theme resolution, toggle, persistence
│       ├── nav.js             ← drawer behaviour + hash router
│       ├── sidebar.js         ← 43-module tree, built from metadata
│       ├── dashboard.js       ← dashboard cards
│       ├── curriculum-view.js ← all modules, grouped by part
│       ├── module-view.js     ← module overview
│       ├── search.js          ← search index + UI
│       ├── storage.js         ← the only localStorage gateway
│       ├── progress.js        ← the only progress API
│       ├── practice-view.js   ← practice route
│       ├── exercise-shell.js  ← exercise + progressive hints
│       └── predict-shell.js   ← predict-the-output
├── data/
│   ├── modules.js             ← GENERATED module metadata — do not hand-edit
│   ├── exercises.js           ← exercise contract (1 placeholder)
│   └── predict-output.js      ← predict contract (1 placeholder)
├── tools/
│   └── generate-modules.mjs   ← regenerates data/modules.js from CURRICULUM.md
└── docs/
    ├── MASTER_BRIEF.md        ← CANONICAL curriculum source (owner-written)
    ├── PROJECT_STATE.md       ← authoritative current status
    ├── ARCHITECTURE.md        ← system design (partly built, partly planned)
    ├── CURRICULUM.md          ← the 43 modules, full topic lists
    └── AI_INSTRUCTIONS.md     ← rules for any AI agent
```

Planned (later phases — **none of this exists yet**; treat as intent, and
reconcile with `docs/ARCHITECTURE.md` before creating any of it):

```
Java_mastery/
├── content/                   ← chapter content, once chapters are written
│   └── modules/
│       └── module-01/
└── java/                      ← runnable Java sources, per module
    └── module-01/
```

---

## 13. How another AI agent continues this project

1. **Read, in order:** `README.md` → [`CLAUDE.md`](CLAUDE.md) →
   [`docs/AI_INSTRUCTIONS.md`](docs/AI_INSTRUCTIONS.md) →
   [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) →
   [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) →
   [`docs/CURRICULUM.md`](docs/CURRICULUM.md).
2. **Inspect the actual repository** before changing anything — list the
   directories, read the files that exist, run `git log` and `git status`.
   Never assume a file's contents from its name.
3. **Reconcile.** If the repository and `docs/PROJECT_STATE.md` disagree, the
   repository is right; correct the document and say that you did.
4. **Assume no conversation history.** Everything needed is in these files. If
   something genuinely is not written down, ask — do not invent it.
5. **Do only the phase or chapter you were asked for**, then update
   `docs/PROJECT_STATE.md` and **stop**.
6. **Never** add/remove/merge/rename modules, never overwrite without
   inspecting first, never force-push or rewrite history, and never claim
   verification that did not happen.
