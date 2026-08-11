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
6. [`docs/CURRICULUM.md`](docs/CURRICULUM.md) — the authoritative 43-module
   curriculum with full topic lists

Then **inspect the actual repository** (`git status`, list the directories, open
the files) and reconcile what you see against `docs/PROJECT_STATE.md`. The
filesystem outranks the documentation; if they disagree, fix the documentation.

---

## Current project status

| | |
|---|---|
| **Phase** | FOUNDATION — Phase 1 of 6 (Documentation layer) |
| **What exists** | This documentation layer only |
| **Website** | Does not exist yet (Phase 2) |
| **Module content** | Does not exist yet |
| **Code execution / compiler** | Does not exist yet (Phase 5) |
| **Modules completed** | 0 of 43 |

Nothing beyond the six documentation files has been built. Any claim to the
contrary is wrong. See [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) for the
authoritative status.

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

Rationale: the platform must remain readable, debuggable, and runnable by
opening a file — permanently, with zero toolchain rot, by a single learner
maintaining it alone.

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

Full topic lists for each module live in
**[`docs/CURRICULUM.md`](docs/CURRICULUM.md)** — that file is authoritative for
what each module must eventually cover. The list below is the index only.

### Part I — Java Language Core (01–14)

| # | Module |
|---|---|
| 01 | Java Foundations & Execution Model |
| 02 | Types, Operators, Control Flow & Method Semantics |
| 03 | Arrays, Strings & Text Processing |
| 04 | Classes, Objects & Object Lifecycle |
| 05 | Inheritance, Polymorphism & Dynamic Dispatch |
| 06 | Interfaces, Abstraction & Composition |
| 07 | Object Contracts — equals, hashCode, toString & Ordering |
| 08 | Immutability, Records & Data-Oriented Design |
| 09 | Enums, Sealed Types & Pattern Matching |
| 10 | Exceptions, Errors & Resource Management |
| 11 | Generics & Type Erasure |
| 12 | Collections Framework & Internal Data Structures |
| 13 | Nested Classes, Lambdas & Functional Interfaces |
| 14 | Streams, Optional & Functional Data Processing |

### Part II — JVM Internals, Concurrency & Performance (15–20)

| # | Module |
|---|---|
| 15 | JVM Architecture, Memory Areas & Garbage Collection |
| 16 | Class Loading, Reflection, Annotations & Bytecode |
| 17 | Concurrency I — Threads, Shared State & the Java Memory Model |
| 18 | Concurrency II — Executors, Futures & Asynchronous Composition |
| 19 | Concurrency III — Concurrent Collections, Locks & Virtual Threads |
| 20 | Performance Engineering, Profiling & Benchmarking |

### Part III — Platform, I/O & Tooling (21–25)

| # | Module |
|---|---|
| 21 | Files, I/O, NIO.2 & Serialization |
| 22 | Date, Time, Formatting & Internationalization |
| 23 | Networking, HTTP Clients & JSON Processing |
| 24 | Build Systems, Dependency Management & Packaging |
| 25 | Testing with JUnit 5, Mockito & Test Design |

### Part IV — Design & Architecture (26–27)

| # | Module |
|---|---|
| 26 | Design Patterns & SOLID in Idiomatic Java |
| 27 | Application Architecture, Clean Code & Domain Modeling |

### Part V — Data & Persistence (28–32)

| # | Module |
|---|---|
| 28 | Relational Database Design & SQL Foundations |
| 29 | Advanced SQL — Joins, Aggregation, Window Functions & Query Tuning |
| 30 | JDBC, Connection Pooling & Transaction Management |
| 31 | JPA & Hibernate I — Entities, Mapping & the Persistence Context |
| 32 | JPA & Hibernate II — Relationships, Fetching, Caching & Performance |

### Part VI — Spring, Spring Boot & Full-Stack Delivery (33–43)

| # | Module |
|---|---|
| 33 | Spring Framework Core — IoC Container, Beans & Dependency Injection |
| 34 | Spring AOP, Configuration, Profiles & Application Context Lifecycle |
| 35 | Spring Boot — Auto-Configuration, Starters & Application Structure |
| 36 | Spring Data JPA — Repositories, Queries, Projections & Migrations |
| 37 | REST API Development with Spring Web MVC |
| 38 | API Contracts — Validation, Error Handling, Versioning & Documentation |
| 39 | Spring Security — Authentication, Authorization, JWT & OAuth2 |
| 40 | Asynchronous Processing, Caching, Scheduling & Messaging |
| 41 | Testing Spring Boot Applications — Slices, MockMvc & Testcontainers |
| 42 | Production Readiness — Observability, Containers & Deployment |
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

> **Status: planned. No website code exists yet — this is Phase 2.**

- **Stack:** static HTML + CSS + vanilla JavaScript (ES modules). No framework,
  no bundler, no transpiler, no build step.
- **Delivery:** static files, openable directly or served by any static file
  server. No server-side rendering.
- **Shell:** persistent navigation across the 43 modules, module → chapter
  drill-down, breadcrumb, and previous/next chapter navigation.
- **Theming:** dark and light modes, user-toggled, preference persisted in
  `localStorage`, honouring `prefers-color-scheme` as the initial default.
- **Layout:** responsive — usable on a phone, comfortable on a laptop,
  wide-screen-aware. CSS Grid/Flexbox, relative units, no fixed pixel layouts.
- **Content model:** chapter content is data (structured files) rendered by a
  small vanilla-JS renderer, so content and presentation stay separable.
- **Search:** client-side index over modules, chapters, and topics.
- **Code blocks:** syntax-highlighted (own lightweight highlighter or a single
  dependency-free script), copy-to-clipboard, and — from Phase 5 — a run
  affordance.
- **Accessibility:** semantic HTML, keyboard navigability, visible focus
  states, adequate contrast in both themes.

Detail and open questions: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 8. Compiler / code-execution architecture summary

> **Status: planned and pending. Nothing is built. This is Phase 5.**
> Nothing about execution should be treated as decided beyond the shape below.

The intent is an **abstraction layer with two interchangeable adapters**, so
that no chapter content is ever coupled to a specific execution provider:

- **Online adapter (primary).** The browser sends source to a third-party Java
  execution API and renders `stdout`, `stderr`, exit code, and compilation
  diagnostics. If the chosen provider requires a secret key, a **minimal
  proxy** may be introduced solely to keep that key off the client — this is
  the one and only sanctioned reason for server-side code in this project.
- **Local fallback (always available).** Every runnable example ships with the
  exact `javac` / `java` / Maven commands so the learner can run it locally with
  no network and no third party. The platform must remain fully usable with the
  online adapter switched off or unavailable.

Constraints already decided: a single execution interface both adapters
implement; no provider-specific code in chapter content; graceful degradation
to the local fallback; no secret key ever embedded in client-side JavaScript.

Provider selection, request/response schema, rate limiting, and timeout
behaviour are **not yet decided** and must not be assumed.

---

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
| **1** | Documentation layer (README, CLAUDE.md, `docs/*`) | **In progress — this phase** |
| **2** | Website shell — HTML/CSS/JS, navigation, dark/light mode, responsive layout | Not started |
| **3** | *Not yet specified by the project owner* | Awaiting specification |
| **4** | *Not yet specified by the project owner* | Awaiting specification |
| **5** | Compiler / code-execution integration | Not started |
| **6** | *Not yet specified by the project owner* | Awaiting specification |

Phases 3, 4, and 6 have **not** been defined. No agent may invent, assume, or
act on a scope for them; wait for an explicit instruction. Each phase is
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

Current (Phase 1 — everything that actually exists today):

```
Java_mastery/
├── README.md                  ← this file
├── CLAUDE.md                  ← permanent rules for Claude Code
└── docs/
    ├── PROJECT_STATE.md       ← authoritative current status
    ├── ARCHITECTURE.md        ← system design (mostly planned)
    ├── CURRICULUM.md          ← the 43 modules, full topic lists
    └── AI_INSTRUCTIONS.md     ← rules for any AI agent
```

Planned (later phases — **none of this exists yet**; treat as intent, and
reconcile with `docs/ARCHITECTURE.md` before creating any of it):

```
Java_mastery/
├── site/                      ← Phase 2: the learning website
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── pages/
├── content/                   ← module & chapter content as data
│   └── modules/
│       └── module-01/
├── java/                      ← runnable Java sources, per module
│   └── module-01/
└── tools/                     ← Phase 5: execution adapters / helpers
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
