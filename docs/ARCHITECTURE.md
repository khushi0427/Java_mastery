# ARCHITECTURE.md — System Architecture

**Status of this document:** created as a skeleton in Phase 1 and filled in from
what was actually built — Phase 2 (frontend, file structure, navigation,
theming, responsive), Phase 3 (data architecture, module architecture, search,
dashboard), Phase 4 (progress system, localStorage schema, practice/hint/
predict-output shells), Phase 5 (compiler/execution abstraction) and Phase 6
(foundation verification and documentation audit). Sections that still describe
systems which **do not exist yet** are marked accordingly. Real today: the
documentation layer, the website shell, the module metadata layer, persisted
progress, the practice shells, the execution abstraction with its local
`javac`/`java` fallback, and the chapter content layer — **3 chapters written of
43 modules, and no online execution provider enabled**.

**Reading rule:** a section marked *Planned — not yet implemented* is **intent,
not fact**. Do not cite it as a description of existing behaviour, and do not
assume its details are settled unless the section says they are decided. When a
section becomes real, move it out of *Planned* — and only then.

**Status legend used throughout:**

| Marker | Meaning |
|---|---|
| **IMPLEMENTED** | Exists in the repository now and was verified |
| **PARTIAL** | Some of it exists; the section says exactly which parts |
| **PLANNED** | Nothing exists; this is intent for a named future phase |
| **UNDECIDED** | Not yet designed; must not be assumed |

---

## Table of contents

1. [Documentation layer](#1-documentation-layer) — **IMPLEMENTED**
2. [Frontend architecture](#2-frontend-architecture) — **IMPLEMENTED**
3. [File structure](#3-file-structure) — PARTIAL
4. [Data architecture](#4-data-architecture) — **IMPLEMENTED** (module metadata + chapter content)
4a. [Chapter content architecture](#4a-chapter-content-architecture) — **IMPLEMENTED**
5. [Module & chapter architecture](#5-module--chapter-architecture) — **IMPLEMENTED** (3 of many chapters written)
6. [Practice architecture](#6-practice-architecture) — **IMPLEMENTED** (shells + Module 01 Ch.1–3 content)
7. [Interview-question architecture](#7-interview-question-architecture) — PARTIAL (in-chapter; no standalone bank)
8. [Assessment architecture](#8-assessment-architecture) — PLANNED
9. [Progress system](#9-progress-system) — **IMPLEMENTED**
10. [localStorage usage](#10-localstorage-usage) — **IMPLEMENTED** (theme + progress)
11. [Compiler / execution abstraction](#11-compiler--execution-abstraction) — **IMPLEMENTED** (Phase 5; no provider enabled)
12. [Navigation](#12-navigation) — **IMPLEMENTED** (module and chapter level)
13. [Search](#13-search) — **IMPLEMENTED** (modules + topics)
14. [Responsive behaviour](#14-responsive-behaviour) — **IMPLEMENTED**
15. [Cross-cutting decisions already fixed](#15-cross-cutting-decisions-already-fixed)
16. [Open questions](#16-open-questions)

---

## 1. Documentation layer

**Status: IMPLEMENTED (Phase 1), maintained since.**

### Purpose

Make the repository self-describing, so that any human or AI agent can
reconstruct full project understanding from files alone, with zero conversation
history. See [`AI_INSTRUCTIONS.md`](AI_INSTRUCTIONS.md) §1.

### Components

| File | Role | Change frequency |
|---|---|---|
| `docs/MASTER_BRIEF.md` | **Canonical project brief and curriculum**, written by the project owner | Only by the owner |
| `README.md` | Complete project description; entry point for humans and agents | Rarely — when project shape/status changes |
| `CLAUDE.md` | Permanent operating rules for Claude Code | Rarely — rules are meant to be stable |
| `docs/AI_INSTRUCTIONS.md` | Same rules, agent-neutral, plus workflow protocols | Rarely |
| `docs/PROJECT_STATE.md` | Authoritative current status | **Every unit of work** |
| `docs/ARCHITECTURE.md` | This file — system design | When a structural decision is made |
| `docs/CURRICULUM.md` | The 43 modules, transcribed verbatim from `MASTER_BRIEF.md` §12 | Only by re-transcription after the brief changes |

### Design decisions (fixed in Phase 1)

1. **Seven files, flat structure.** `README.md` and `CLAUDE.md` at the root
   (conventional discovery locations); the four detail documents under `docs/`.
   No deeper nesting — discoverability beats taxonomy at this size.
2. **`PROJECT_STATE.md` is the single mutable status file.** Status is not
   duplicated across documents; other files link to it. One writer, one truth,
   no drift between copies.
3. **The filesystem outranks the documentation.** When they disagree, the
   repository is right and the document gets corrected. This is stated in every
   rules file so no agent can miss it.
4. **Rules are duplicated deliberately** between `CLAUDE.md` and
   `AI_INSTRUCTIONS.md`. This is the one sanctioned exception to the
   no-duplication rule (§5 of the rules files), which governs *curriculum
   content*, not governance documents: an agent that reads only one of the two
   must still receive the complete rule set. When a rule changes, **both files
   must be updated in the same unit of work.**
5. **Explicit status vocabulary** (`NOT_STARTED` / `FOUNDATION_ONLY` /
   `IN_PROGRESS` / `CONTENT_COMPLETE` / `VERIFIED`) replaces prose adjectives
   everywhere, so "done" can never be ambiguous.

---

## 2. Frontend architecture

**Status: IMPLEMENTED (Phase 2 shell; Phases 3–5 filled it in).** Layout,
theming, navigation, routing, module data, search, progress, the practice
shells, and the execution abstraction all exist and were verified in a real
browser, along with the chapter content layer and its renderer. What remains
is simply the writing: 3 chapters exist of 43 modules.

### Fixed constraints (decided, not negotiable)

- **HTML + CSS + vanilla JavaScript only.** No React/Angular/Vue/Svelte, no
  TypeScript, no jQuery, no CSS framework, no bundler, transpiler, preprocessor,
  or package-managed frontend dependency.
- **No build step.** What is in the repository is what runs in the browser.
- **Static delivery.** No server-side rendering; no application server.

### As built

- **ES modules** (`<script type="module">`), each with one job — `app.js`
  (bootstrap), `theme.js` (theme state), `nav.js` (drawer + router),
  `sidebar.js`, `dashboard.js`, `curriculum-view.js`, `module-view.js`,
  `search.js`, `practice-view.js`, `exercise-shell.js`, `predict-shell.js`,
  `progress.js`, `storage.js`, `code-runner.js`, the `execution/` modules,
  `chapters.js`, `chapter-view.js`, and `dom.js` (element builder). No globals;
  modules communicate by import, not by shared window state.
- **Three stylesheets** with a strict division of responsibility:
  `base.css` (reset, non-colour tokens, typography, focus primitives),
  `theme.css` (the entire colour system — and nothing else),
  `layout.css` (app-shell structure and breakpoints).
  *Rule: no colour literal may appear outside `theme.css`.*
- **Views are static markup**, toggled with the `hidden` property. View
  *bodies* that render from data are built with `assets/js/dom.js`, which routes
  all text through `textContent`. **No `innerHTML` anywhere**, so no data value
  can ever be parsed as markup — kept regardless of how trusted the current data
  happens to be.
- **`[hidden] { display: none !important }`** in `base.css`. The UA stylesheet's
  `hidden` rule loses to any author `display` value, so a flex or grid container
  silently ignores `hidden` — a real bug found in Phase 3 testing.
- **Semantic landmarks**: `<header>`, `<nav aria-label="Main">`, `<main>`, a
  skip link, `aria-expanded` on the drawer toggle, `aria-current="page"` for the
  active nav item, and a focus trap while the drawer overlays the page.
- **`prefers-reduced-motion`** is honoured by zeroing the motion tokens.

### Serving requirement — a real constraint, discovered by testing

**The site must be served over http**, e.g. `python3 -m http.server`. Opening
`index.html` as a `file://` path renders the page and its styles, but browsers
block ES module scripts on `file://` under CORS policy, so the theme toggle and
navigation do not run. A `<noscript>` block states this in the page itself.

This is a browser constraint, not a build step — there is still nothing to
compile. If double-click-to-open is ever required, the fix is to convert the
three modules to classic `<script defer>` files; that trade was considered and
declined in Phase 2 because module scoping matters more as the codebase grows.

### Still PLANNED

Chapter content rendering, real exercises and questions to fill the §6 shells,
execution (§11, Phase 5), syntax highlighting (§16 open question 9), and any
service worker / offline support.

---

## 3. File structure

**Status: PARTIAL.** The documentation layer and the whole website foundation
exist (Phases 1–5). What remains planned is content: `content/` and `java/`
below hold nothing, because no chapter has been written.

### Actual, today

```
Java_mastery/
├── index.html             ← the app shell (Phase 2)
├── README.md
├── CLAUDE.md
├── assets/
│   ├── css/
│   │   ├── base.css       ← reset, non-colour tokens, typography, focus
│   │   ├── theme.css      ← the complete colour system, light + dark
│   │   └── layout.css     ← app shell + Phase 3/4/5 components
│   └── js/
│       ├── app.js         ← bootstrap / entry point
│       ├── dom.js         ← element builder (no innerHTML)
│       ├── theme.js       ← theme resolution, toggle, persistence
│       ├── nav.js         ← drawer behaviour + hash router
│       ├── sidebar.js     ← module tree, built from metadata
│       ├── dashboard.js   ← dashboard cards
│       ├── curriculum-view.js ← all 43 modules, grouped by part
│       ├── module-view.js ← module overview
│       ├── search.js      ← source-based search index + UI
│       ├── storage.js     ← the ONLY module touching localStorage (Phase 4)
│       ├── progress.js    ← the ONLY progress API (Phase 4)
│       ├── practice-view.js   ← the #/practice route (Phase 4)
│       ├── exercise-shell.js  ← one exercise, hints, solution (Phase 4)
│       ├── predict-shell.js   ← one predict-the-output question (Phase 4)
│       ├── code-runner.js ← editor + output + local fallback (Phase 5)
│       ├── chapters.js    ← the only accessor over data/chapters.js
│       ├── chapter-view.js ← renders a chapter from its data
│       └── execution/     ← Java execution, provider-agnostic (Phase 5)
│           ├── config.js  ← THE single config point; no credential field
│           ├── result.js  ← STATUS, baseResult, postJson
│           ├── service.js ← executeJava(), the one entry point
│           ├── java-source.js ← file name / run target / package from source
│           └── providers/
│               ├── piston.js  ← self-hosted Piston adapter
│               └── judge0.js  ← self-hosted Judge0 adapter
├── content/               ← AUTHORED chapter content, no markup
│   └── modules/module-01/
│       ├── 01-01-from-source-to-running-program.js
│       ├── 01-02-jvm-architecture-class-loading.js
│       └── 01-03-the-execution-engine.js
├── data/
│   ├── modules.js         ← GENERATED module metadata (no chapter fields)
│   ├── chapters.js        ← chapter manifest + lazy loaders + PLANNED_CHAPTERS
│   ├── exercises.js       ← exercise contract (Phase 4; +starterCode Phase 5)
│   └── predict-output.js  ← predict-the-output contract (Phase 4)
├── java/                  ← runnable sources, actually compiled and run
│   ├── module-01/ch01/
│   ├── module-01/ch02/
│   └── module-01/ch03/
├── tools/
│   └── generate-modules.mjs ← derives data/modules.js from CURRICULUM.md
└── docs/
    ├── PROJECT_STATE.md
    ├── ARCHITECTURE.md
    ├── CURRICULUM.md
    └── AI_INSTRUCTIONS.md
```

#### Deviation from the Phase 1 plan — recorded deliberately

Phase 1 sketched a `site/` directory containing `index.html`, `css/`, and `js/`.
**Phase 2 placed `index.html` at the repository root with assets under
`assets/`** instead. Reasons:

1. A root `index.html` is what static hosts serve by default (GitHub Pages, and
   `python3 -m http.server` from the repository root), with no extra path.
2. It removes one level of nesting for the only entry point the project has.

The Phase 1 text explicitly labelled that tree "intent, not commitments; Phase 2
confirms them" — this is that confirmation.

### Directories once planned, now real

Both `content/` and `java/` now exist — created when Module 01 Chapter 1 was
authored. The final naming differs slightly from the Phase 1 sketch: chapter
files sit directly under `content/modules/module-NN/` rather than in a nested
`chapters/` directory, since there is nothing else in a module directory to
disambiguate them from.

Nothing is currently planned-but-absent at the directory level.

Note that `tools/` now exists — Phase 1 had reserved it for Phase 5 execution
helpers, and Phase 3 put the curriculum generator there first.

**Phase 5 did not use `tools/` for its adapters after all.** The execution
adapters ship *to the browser*, so they belong under `assets/js/execution/`
with the rest of the client code; `tools/` is for development tooling that is
never served. The Phase 1 expectation is superseded, and this note records it
rather than leaving the two documents disagreeing.

**Naming conventions (decided now, so later phases are consistent):**

- Module directories: `module-NN` with a zero-padded two-digit number
  (`module-01` … `module-43`). The number is the permanent identifier.
- Chapter identifiers: `NN-MM` (module–chapter), e.g. `07-03`.
- Lowercase, hyphen-separated file and directory names throughout.

---

## 4. Data architecture

**Status: IMPLEMENTED.** The module metadata layer exists (Phase 3), the
practice contracts exist (Phase 4), and the chapter content layer exists as of
Module 01 Chapter 1. Interview questions live inside chapter content rather
than in a separate file — see §4a.

### Principle (decided)

**Content is data; presentation is code.** Chapter content is stored in
structured files and rendered by the site, rather than hand-written as page
markup. This keeps the 43 modules uniform, makes search indexable, makes
progress trackable per section, and lets presentation change without rewriting
content.

### The metadata layer, as built

`data/modules.js` is an ES module exporting a `MODULES` array — **the single
source of module metadata for the application.** The sidebar, dashboard,
curriculum view, module overview, and search index all read from it, and
nothing hardcodes a module list anywhere else.

Per module:

| Field | Meaning |
|---|---|
| `number` | `"01"`–`"43"`, matching `CURRICULUM.md`. **Permanent key.** |
| `id` | URL slug, e.g. `12-collections-framework-internal-data-structures`. **Permanent key** — Phase 4 progress records are keyed on it |
| `name` | Module name, verbatim from `CURRICULUM.md` |
| `notes` | The brief's per-module emphasis, verbatim — requirements, not commentary |
| `subsections` | Named sub-parts (only Module 42's seven projects today) |
| `description` | DERIVED from the first five topics; never authored |
| `prerequisites` | Empty for all 43 — the brief specifies none |
| `topics` | Flat `string[]` — the coverage specification, **not** taught content |
| `status` | One of the five status tokens. All 43 are `NOT_STARTED` |
| `chapterCount` / `chapters` | `0` and `[]` — no chapter content exists |

### Generated, not hand-maintained — resolves open question 3

**`docs/MASTER_BRIEF.md` is canonical**, `docs/CURRICULUM.md` is a verbatim
transcription of its Section 12, and `data/modules.js` is generated from that.
Hand-copying 43 modules at either hop would create a source that drifts, so
`tools/generate-modules.mjs` owns both and `--check` guards both:

```bash
node tools/generate-modules.mjs           # regenerate after editing CURRICULUM.md
node tools/generate-modules.mjs --check   # verify in sync; exits 1 if not
```

This is a **development tool, not a build step** — the site runs directly from
the committed `data/modules.js` with no toolchain. The generator refuses to emit
unless the curriculum is byte-identical to the brief's Section 12 **and** it
finds exactly 43 modules numbered 01–43 with unique ids, a name, and topics.

#### Two fields the brief does not supply

The brief gives module names and topic bullets only. Neither of these is
invented:

- **`description`** — derived mechanically as `Topics include: <first five
  topics>.`, flagged `descriptionDerived: true`.
- **`prerequisites`** — **empty for all 43 modules.** The brief states none;
  module order is not evidence of a prerequisite.

Conversely, the brief's per-module emphasis **is** carried: `notes` holds it
verbatim (Module 08's extra depth, Module 14's JVM-spec-vs-HotSpot distinction,
Module 30's JPA-vs-Hibernate framing), and `subsections` holds Module 42's seven
named projects. Those lines are requirements, and the module view renders them.

### Still PLANNED

| Object | Phase |
|---|---|
| **Chapter** | The 15 workflow sections (concept, examples, predict-output, lab, practice, hints, execution, solutions, interview Qs, mistakes, revision, integration) |
| **Code example** | Source, filename, expected output, runnable flag, required Java version |
| **Practice problem** | Prompt, difficulty, starter code, ordered hints, solution, expected output |
| **Interview question** | Question, model answer, depth, related modules |
| **Progress record** | Per-learner state — Phase 4 (§9, §10) |

### Not yet decided — UNDECIDED

Serialization format for *chapter* content (JSON vs Markdown-with-front-matter
vs hybrid); whether chapter content loads per chapter or in bundles. The module
metadata question is settled above.

---

## 4a. Chapter content architecture

**Status: IMPLEMENTED (Module 01 Chapters 1–3).**

### Two sources, deliberately separate

```
docs/MASTER_BRIEF.md  →  docs/CURRICULUM.md  →  data/modules.js
     (canonical)            (transcription)      (GENERATED: what must be covered)

data/chapters.js      →  content/modules/…
     (manifest)            (AUTHORED: what has actually been written)
```

The generator emits **no chapter field at all**. It cannot: the curriculum says
what a module must cover, not how that coverage divides into chapters, and a
generated `chapterCount: 0` would start lying the moment a chapter was authored.
So `data/chapters.js` owns chapters, and `assets/js/chapters.js` is the only
accessor the UI uses.

*(This replaced the Phase 3 arrangement, where `data/modules.js` carried
`chapterCount: 0` and `chapters: []`. Those fields are gone, and the generator
now refuses to emit them.)*

### Loading — resolves the Phase 3 open question

Chapter **metadata** (id, title, summary) is static and small, so it ships with
the app; the sidebar and module pages need it immediately. Chapter **content**
is fetched with a dynamic `import()` only when the learner opens that chapter.
Eagerly importing every chapter would eventually mean downloading the whole
curriculum to render a sidebar. Dynamic import needs no bundler, so this costs
nothing against the no-build-step constraint.

### Content is data; presentation is code

A chapter file contains **no markup**. It is an object with typed sections, and
`assets/js/chapter-view.js` renders them. Consequences worth keeping:

- restyling all 43 modules is one change to the renderer;
- a chapter cannot break the page with malformed HTML, because it contains none;
- search can index chapters later without parsing anything.

The section vocabulary is `prose`, `callout`, `code`, `terminal`, `table`,
`diagram`, documented in `data/chapters.js`. **Unknown section types are skipped
with a console warning** rather than throwing, so a content file written against
a newer vocabulary loses a section instead of the whole page.

### Inline formatting is a tokenizer, not a regex

Chapter strings support exactly two constructs: `` `code` `` and `**bold**`,
applied by building text nodes — never `innerHTML`. It is a hand-written scanner
rather than a regex because the two nest one way only: **bold may contain
`code`**, while a code span must keep asterisks literal. A regex alternation
picks one branch and treats the rest as opaque, which rendered
`**`ClassNotFoundException`**` as bold text with two visible backticks. Caught in
browser verification, and there are now direct tests for the nesting cases.

---

## 5. Module & chapter architecture

**Status: IMPLEMENTED.** The module set is fixed and documented, and the
chapter layer is built and in use — 3 chapters written of 43 modules.

### Decided

- **Exactly 43 modules, numbered 01–43, frozen.** See
  [`CURRICULUM.md`](CURRICULUM.md). Modules are never added, removed, merged,
  split, renamed, renumbered, or reordered.
- **REALIGNED and (re)LOCKED to `docs/MASTER_BRIEF.md` on 2026-08-12.** The
  Phase 3 lock was superseded: the brief arrived after Phase 3 and the authored
  curriculum matched it on only 2 of 43 names. `CURRICULUM.md` Appendix B
  records the full history.
- **Module numbers are permanent identifiers** — used by navigation, progress
  keys, and cross-references. This is *why* the set is frozen: renumbering
  invalidates stored learner progress.
- **Module ids are derived from names**, so names are locked too. The id is
  `<number>-<kebab-cased name>`, e.g. `08-hashing-hashmap-internals`. Renaming a module changes its id and orphans any progress
  stored against it. If a rename ever becomes unavoidable, pin the old id by
  hand rather than letting the generator move it.
- **Modules are grouped into six parts** for navigation only. Parts are a
  presentation grouping; they carry no identity and no progress state.
- **Each module is split into chapters**; the chapter is the unit of delivery
  and the unit of progress.
- **Every chapter follows the 15-step delivery workflow** (`README.md` §6). The
  chapter data model mirrors those steps one-to-one (§4).
- **Single primary ownership.** Each concept is taught in exactly one module;
  others cross-link. `CURRICULUM.md` records ownership per module.

### As built

Module metadata is rendered in three places, all reading `data/modules.js`:

- **Sidebar** — all 43 modules under a collapsible Curriculum section, each row
  carrying a status dot and its own disclosure for chapters.
- **Curriculum view** (`#/curriculum`) — 43 module cards in curriculum order.
  The brief defines no part groupings, so none are invented.
- **Module overview** (`#/module/<id>`) — description, status, prerequisites,
  the brief's emphasis notes, the empty chapter region, any subsections
  (Module 42's projects), and the flat topic list.

The module overview labels its topic list as *the coverage specification*, not
as taught content, so a long list never implies the module has been written.

### Decided when Module 01 Chapter 1 was authored

- **Chapter ids are `NN-MM`** (module–chapter), e.g. `01-01`. **Permanent
  keys** — `localStorage` progress records key on them, so a chapter is never
  renumbered for the same reason a module is never renumbered.
- **Chapter boundaries are an authoring decision, not a curriculum one.** The
  brief specifies what a module must COVER; how that splits into chapters is
  decided when the module is written. This is why chapters are not generated —
  see §4a.
- **The plan for a module's remaining chapters is recorded** in
  `PLANNED_CHAPTERS` (`data/chapters.js`) at the moment its first chapter is
  authored, so the next session does not have to re-derive the split from the
  topic list. Planned chapters render in the module overview as visibly inert,
  unlinked rows — the module's shape stays honest without implying content
  exists.
- **A chapter never marks its module COMPLETED.** Completing every *authored*
  chapter is not the same as finishing the module while chapters remain
  unwritten, so `setChapterComplete` moves a module to IN_PROGRESS and no
  further.
- **Chapter navigation is module-local.** "Next" does not cross into the next
  module, because the module overview is where scope and prerequisites live.

### Still UNDECIDED

Chapter counts for modules 02–43 (decided as each is authored); whether
prerequisites are enforced in navigation or advisory only.

---

## 6. Practice architecture

**Status: IMPLEMENTED (Phase 4 shells; content from Module 01 Chapters 1–3).**
Eighteen exercises and sixteen predict-the-output questions exist, covering the
three chapters written so far. Every reference solution was compiled and run before it
was recorded, and every predict-the-output answer is captured real output.

The shells were built and verified in Phase 4 against one labelled placeholder
each; those placeholders remain, because they are what the UI's
placeholder-labelling behaviour is verified against, and `realExerciseCount()`
excludes them from every count. Further exercises are authored per chapter
through `CONTINUE`, never ahead of it.

### Exercise contract (`data/exercises.js`)

| Field | Type | Notes |
|---|---|---|
| `id` | string | unique within its module |
| `moduleId` | string | **permanent** id from `data/modules.js` |
| `title`, `objective`, `problem` | string | |
| `difficulty` | string | ladder: Warm-up → Easy → Applied → Medium → Challenge → Interview (§18) |
| `requirements`, `constraints`, `edgeCases` | string[] | optional; omitted fields render nothing |
| `sampleInput`, `sampleOutput` | string | optional |
| `testCases` | `[{ input, expected }]` | optional |
| `hints` | string[] | ordered; revealed **one at a time** |
| `solution` | `{ language, code, explanation, complexity }` | hidden by default |
| `isPlaceholder` | boolean | true only for demo scaffolding; excluded from counts |

### Predict-the-output contract (`data/predict-output.js`)

`{ id, moduleId, prompt, language, code, answer, explanation, isPlaceholder }` —
`answer` is hidden until revealed (§19).

### Rules enforced structurally, not by convention

- **Hints reveal one at a time.** The button for hint *n+1* does not exist until
  hint *n* is revealed, so "reveal everything" is never one click away (§20).
- **Solutions and answers are hidden by default**, behind a single persistent
  toggle whose `aria-expanded` tracks state. Replacing the trigger on reveal
  would strand that state on a detached element.
- **Placeholders are labelled in the UI** and excluded from every count, so demo
  scaffolding can never inflate progress or be mistaken for curriculum.
- **Completion flows through the progress API** (§9) — `setExerciseSolved` — so
  solving an exercise counts the moment real exercises exist.
- **Run controls are disabled**, labelled "Phase 5". A Run button that looked
  live would be a lie about what the platform can currently do.

### Still PLANNED

Real exercises and questions; auto-checking answers against expected output
(still UNDECIDED — it may remain self-assessed); spaced-repetition revision.

## 7. Interview-question architecture

**Status: PARTIAL.** Interview questions exist *inside* chapter content — seven
across Module 01 Chapters 1–3 (seven each), with a category, a reasoning-depth model answer,
and a reveal that keeps the answer hidden until asked for. What does NOT exist
is a standalone cross-module question bank or the `#/interview` view, which
remains a placeholder. The decisions below still stand.

### Decided

- Every chapter includes interview questions at **reasoning depth** — "what
  happens under the hood when…", "why would this fail under load…" — not recall
  depth ("what is polymorphism").
- Each question has a **model answer** that explains mechanism, not just the
  conclusion.
- Questions are **tagged with related module numbers** so a cross-module
  interview drill can be assembled later.

### Not yet decided — UNDECIDED

Depth-level taxonomy; whether a cross-module drill/random-question mode is
built; whether answers are self-rated and that rating stored.

---

## 8. Assessment architecture

**Status: PLANNED — not yet implemented.**

### Decided

- Assessment is **evidence-based**, matching the project's verification ethic: a
  module counts as mastered on demonstrated work (predictions correct, practice
  solved, code run), not on a self-declared checkbox.
- **Module 43 is the capstone and mastery assessment** — the terminal
  integrative assessment for the whole curriculum.

### Not yet decided — UNDECIDED

Per-module assessment format; scoring/thresholds; whether checkpoint assessments
exist at part boundaries; whether assessment results are exportable.

---

## 9. Progress system

**Status: IMPLEMENTED (Phase 4).** Progress is persisted in `localStorage`
through `assets/js/progress.js`, which is the **only** progress API — no view
touches storage directly, and no view keeps its own copy of progress state.

### Two status axes — do not conflate them

| Axis | Source | Vocabulary |
|---|---|---|
| **Content status** | `data/modules.js` | `NOT_STARTED` / `FOUNDATION_ONLY` / `IN_PROGRESS` / `CONTENT_COMPLETE` / `VERIFIED` — what exists in the repository |
| **Learner status** | the progress store | `NOT_STARTED` / `IN_PROGRESS` / `COMPLETED` — what the learner has done |

A module can be content-`NOT_STARTED` and learner-`IN_PROGRESS` at once.
`getModuleProgress()` returns both, named distinctly; the ambiguous `status`
field is retained only as a deprecated alias.

### Keys

Progress is keyed on the **permanent module ids** from `data/modules.js` (e.g.
`08-hashing-hashmap-internals`), never on array index or display order. This is
why the curriculum is locked to `MASTER_BRIEF.md` (§5).

### API

| Group | Functions |
|---|---|
| Reads | `getModuleProgress`, `getOverallProgress`, `getCurrentPosition`, `getRecentActivity`, `getRecommendedNext`, `getPracticeProgress`, `getAssessmentProgress`, `isExerciseSolved`, `getStorageInfo` |
| Writes | `setModuleStatus`, `setChapterComplete`, `toggleChapterComplete`, `setExerciseSolved`, `recordAssessmentScore`, `recordVisit`, `resetProgress` |
| Events | `onProgressChange(listener)` → unsubscribe |

Writes validate the module id against the curriculum and ignore unknown ids, so
a stale link cannot inject junk records.

### Two percentages, because they answer different questions

`modulePercent` is completed modules over 43 — a denominator that exists today.
`chapterPercent` is completed chapters over total chapters, which is `0 / 0`
until chapters are written. Neither is invented, and the dashboard says which is
which rather than showing one number and hoping.

### Reset

`resetProgress()` removes the progress record only. **The theme key is
deliberately untouched** — clearing what you have studied should not also flip
the site back to light mode. The UI gates it behind a confirm.

### Change notification

Views subscribe via `onProgressChange`. `app.js` refreshes the sidebar and, when
visible, the dashboard. The module view is deliberately **not** subscribed:
rendering it records a visit, which writes and notifies, so re-rendering from a
notification would loop.

### Still PLANNED

Export/import of progress as JSON (§9 of `README.md`); chapter- and
exercise-level completion driven by real content rather than the temporary
manual control (§6).

## 10. localStorage usage

**Status: IMPLEMENTED (Phase 4).**

### Keys in use

| Key | Shape | Written by |
|---|---|---|
| `jfsm.theme` | `"light"` \| `"dark"` | `assets/js/theme.js` |
| `jfsm.progress` | JSON record, below | `assets/js/progress.js` |

All keys carry the `jfsm.` prefix. **One aggregate record** holds all progress
rather than a key per module — this resolves the Phase 1 open question. One read
and one write, no key scanning, and no possibility of a half-updated set of keys.
The dataset is small (43 modules), so the write cost is irrelevant.

### Schema — `jfsm.progress`, `schemaVersion: 1`

```json
{
  "schemaVersion": 1,
  "updatedAt": "2026-08-12T12:00:00.000Z",
  "modules": {
    "08-hashing-hashmap-internals": {
      "status": "IN_PROGRESS",
      "startedAt": "2026-08-12T11:00:00.000Z",
      "completedAt": null,
      "chapters":  { "<chapterId>":  { "completedAt": "…" } },
      "exercises": { "<exerciseId>": { "solvedAt": "…" } }
    }
  },
  "assessments": { "<assessmentId>": { "score": 0, "max": 0, "takenAt": "…" } },
  "position": { "moduleId": "…", "chapterId": null, "visitedAt": "…" },
  "recent":   [ { "moduleId": "…", "chapterId": null, "visitedAt": "…" } ]
}
```

`recent` is capped at 8 entries, most recent first, de-duplicated on
module+chapter.

### Versioning and migration

`SCHEMA_VERSION` is exported from `progress.js`. Bumping it requires adding a
migration branch in `migrate()` — **never** wiping the record. Two cases are
handled explicitly:

- **Unrecognisable or older record** → migrated forward, or treated as empty.
- **A record from a FUTURE version** → left **completely untouched** and treated
  as "no progress this session". Overwriting data a newer build owns would
  destroy it; refusing to read it only costs one session.

### Defensive access

All storage goes through `assets/js/storage.js`, the single place that touches
`localStorage`. It survives: storage being unavailable entirely (private mode,
blocked cookies), quota-exceeded writes, malformed JSON, JSON scalars, and
foreign objects. Every path degrades to "no saved data" rather than throwing.

**One sanctioned exception:** the anti-FOUC script inlined in `index.html` reads
`jfsm.theme` directly, because it must run before any module loads. Keep the two
in step.

## 11. Compiler / execution abstraction

**Status: IMPLEMENTED (Phase 5), shipping with NO provider enabled.** The
editor, the abstraction, both online adapters, and the local fallback exist.
No online provider is configured or verified working — that is a deliberate,
supported end state, not an unfinished one. See §11.6.

### 11.1 The decisions this phase inherited — both kept

1. **One interface, many adapters.** Chapter content is never coupled to a
   specific execution provider. Everything calls `executeJava()` in
   `assets/js/execution/service.js`; nothing else imports an adapter, names a
   provider, or calls `fetch`.
2. **The local fallback always exists.** Every runnable snippet renders exact
   `javac` / `java` commands, always — not only when something fails. The
   platform is **fully usable with no provider connected**.

### 11.2 File layout

| File | Role |
|---|---|
| `assets/js/execution/config.js` | **The single configuration point.** Chooses the provider, or `null` for none. Deliberately has no field for a secret. |
| `assets/js/execution/result.js` | `STATUS`, `baseResult()`, `postJson()` — the shared result vocabulary. Separate from `service.js` so the service and its adapters do not import each other. |
| `assets/js/execution/service.js` | `executeJava()`, `executionStatus()`. Validation, deadline, adapter dispatch, error classification. |
| `assets/js/execution/java-source.js` | Derives the file name, run target, and package from the source. |
| `assets/js/execution/providers/piston.js` | Adapter for a self-hosted Piston instance. |
| `assets/js/execution/providers/judge0.js` | Adapter for a self-hosted Judge0 instance. |
| `assets/js/code-runner.js` | The UI: editor, Run/Reset/Copy, output panel, local-fallback panel. |

### 11.3 The result contract — DECIDED

`executeJava({ source, stdin })` resolves to an `ExecutionResult` and **never
rejects**. A compiler error, a dead provider, and an infinite loop are all
*results*, because to a learner they are all just outcomes of pressing Run;
rejecting would push provider plumbing into every call site.

| Field | Meaning |
|---|---|
| `status` | One of `success`, `compile-error`, `runtime-error`, `timeout`, `provider-unavailable`, `invalid-input`, `error`. Exhaustive. |
| `stdout` / `stderr` | Program streams, `''` when empty |
| `compileError` | Compiler diagnostics, or `null` |
| `timedOut` | A deadline was hit — ours or the provider's |
| `providerUnavailable` | No provider ran the code at all |
| `exitCode` | When the provider reports one, else `null` |
| `message` | One human-readable line, always safe to show |
| `durationMs`, `provider`, `raw` | Client-observed wall time, which adapter answered, untouched provider response |

`providerUnavailable` is deliberately **separate from `status`** so the UI can
say "this is a configuration problem, not your code" without enumerating
provider failure modes. Telling a learner their correct program failed would be
the worst defect this platform could ship, so the output panel states in words
that the code was not run and that nothing about the failure reflects on it.

### 11.4 Failure modes — DECIDED

| Condition | Result |
|---|---|
| No provider configured | `provider-unavailable`, with the configuration reason |
| Provider selected but incompletely configured | `provider-unavailable`, naming the missing field |
| Empty or oversized source | `invalid-input`, refused before sending |
| Client deadline exceeded (`timeoutMs`) | `timeout`, `timedOut: true` |
| Provider reports a time limit | `timeout` |
| Compile stage failed | `compile-error`, diagnostics in `compileError` |
| Ran, exited non-zero | `runtime-error` |
| HTTP 401 / 403 / 429 | `provider-unavailable`, described as authorisation/rate-limit |
| Network failure, DNS, refused connection, blocked CORS, mixed content | `provider-unavailable` |

The browser reports that last row's cases as one indistinguishable `TypeError`
by design, so the message lists the possibilities rather than guessing one and
misleading the operator. All of them are provider problems; none is the code.

### 11.5 Source analysis — DECIDED

`java-source.js` derives the file name from the source rather than assuming
`Main.java`. A public top-level type must live in a file named after it, so a
fixed name breaks every example whose class is not `Main` — with a compiler
error the learner did not write. It strips comments and string/text-block
literals first, so a `// public class Ghost` cannot win.

It also yields the `main`-bearing class and any `package`, so the fallback panel
emits commands that work for packaged sources instead of ones that fail.

**Verified by execution** against OpenJDK 21.0.10 — sources were generated,
named by this logic, then actually compiled and run. See PROJECT_STATE.

### 11.6 Provider status — NONE ENABLED, and why

Researched 2026-08-13 against each provider's live documentation. Findings and
sources are recorded in `docs/PROJECT_STATE.md`; the short version:

- **Piston's public API at emkc.org** is, per its own readme, *"no longer
  freely available to the public (as of Feb 15, 2026)"* and requires
  case-by-case authorization. Not something to point learners at.
- **Judge0's hosted offerings** authenticate with a secret (`X-Auth-Token` /
  `X-RapidAPI-Key`). A static site cannot hold a secret.
- No keyless, browser-callable Java service could be verified to this project's
  standard on that date.

So `provider: null` ships as the default and is a **permanent supported mode**,
not a placeholder. Both adapters are written to wire formats read from the
providers' live docs, and both target a **self-hosted** instance, where
authentication is off by default and no secret exists to leak.

**NOT VERIFIED BY EXECUTION:** no HTTP request has been made to any live Piston
or Judge0 instance from this repository. The development sandbox blocks
outbound connections to those hosts, so the adapters' wire formats follow
documentation, not an observed round trip. **CORS behaviour in particular
cannot be verified from a sandbox at all** — it is a browser-enforced property
of a real page origin talking to a real instance. Anyone enabling a provider
should treat the first run from an actual browser as the real test.

### 11.7 Proxy — still conditional, still unbuilt

Unchanged and deliberately not built, because nothing needs it yet. If a
provider requires a secret, a minimal proxy may hold it, under the original
constraints:

- **No secret may ever appear in client-side JavaScript or in this repository.**
- The proxy forwards the execution request and response and nothing else.
- It must not become a general backend — no database, no accounts, no rendering.
- If no key is needed, no proxy is built.

`config.js` has no credential field at all, so the only way to use a keyed
provider is to point `baseUrl` at such a proxy.

### 11.8 Still open — UNDECIDED

Whether multi-file or Maven-project examples can run online (both adapters send
a single file; the local fallback covers this regardless); whether to add
polling for Judge0 instances that do not honour `wait=true`; whether runs should
be recorded in progress; rate-limit and quota presentation once a real provider
is in use.

---

## 12. Navigation

**Status: IMPLEMENTED (Phase 2 shell, Phase 3 module tree, chapter level with
Module 01 Chapters 1–3).** Chapter routes, sidebar chapter links, module chapter
lists, and previous/module/next chapter navigation all exist. Chapter
navigation is **module-local**: "next" stops at the module boundary rather than
skipping the next module's overview, where scope and prerequisites live.

### As built

- **Persistent shell**: a fixed top bar plus a sidebar, on a single page.
- **Sidebar** carries seven destinations in three groups — Learn (Dashboard,
  Curriculum, Practice), Prepare (Interview, Assessments), and Build & Review
  (Projects, Revision) — and, under Curriculum, **all 43 modules built from
  `data/modules.js`** (§4). Nothing about the module list is hardcoded in the
  sidebar.
- **Two levels of disclosure**: the Curriculum section collapses as a whole, and
  each module row has its own chevron revealing that module's chapter region.
  Both use `<button aria-expanded aria-controls>`; each module toggle carries an
  `aria-label` naming its module, so 43 toggles are not all called "expand".
- **Empty chapter regions say "No chapters yet"** rather than rendering
  placeholder links. `chapterCount` is genuinely 0.
- **Routing is hash-based** — `#/dashboard`, `#/curriculum`, `#/module/<id>` —
  resolving §16 open question 2 (see below). A bare URL falls back to
  `#/dashboard`; an unrecognised route *or an unknown module id* renders the
  "not found" view and clears the active state.
- **Routing to a module reveals it** in the tree (expanding the Curriculum
  section and scrolling the row into view) so the sidebar reflects the location.
- **Active state** is expressed with `aria-current="page"`, and the CSS
  highlight keys off that attribute, so the accessible name and the visible
  highlight cannot disagree.
- **Document title** updates per route (`Curriculum · Java Full-Stack Mastery`).
- **Focus management**: navigating moves focus to `<main>` (which carries
  `tabindex="-1"`) so keyboard users land in the new content; opening the drawer
  moves focus into it and traps Tab there; closing returns focus to the toggle.
- **Escape** closes the drawer.

### Still PLANNED

The chapter level of the tree, breadcrumbs, previous/next chapter controls
crossing module boundaries, resume-where-you-left-off (§9), and real progress
indication in the module list — the sidebar currently shows module *status*
(all `NOT_STARTED`), not learner progress. Whether prerequisites gate navigation
or merely advise remains UNDECIDED.

---

## 12a. Dashboard

**Status: IMPLEMENTED (Phase 3 structure, Phase 4 real values).**

Seven sections, each reading `data/modules.js` and the real progress API in
`assets/js/progress.js` — no duplicated module list, no hardcoded figures. The
figures below are what an untouched browser shows; they are real zeros, not
placeholders, because no chapters or exercises exist yet:

| Section | Current state |
|---|---|
| Overall progress | 0%, 0/0 chapters, 0/43 modules |
| Current position | "Not started" |
| Recommended next | Module 01, as the curriculum entry point |
| Recently studied | "Nothing yet" |
| Practice | 0 / 0 |
| Assessments | 0 / 0 |
| Progress by module | All 43, each `Not started`, 0/0 chapters |

A banner states plainly that progress tracking is not implemented and the zeros
are real values from an empty repository. Percentages guard the 0-of-0 case
rather than rendering `NaN`.

---

## 13. Search

**Status: IMPLEMENTED over the data that exists (Phase 3).** Modules and topics
are searchable. Chapters, practice, interview questions, and revision notes are
not — because they do not exist.

### Source-based design — the part that matters

The index is **not** built from modules directly. It is built from registered
*sources*, each a function returning entries in a shared shape:

```js
registerSearchSource('chapter', () => chapters.map(toEntry));
```

Adding chapter or practice search in a later phase means registering a source.
Scoring, rendering, keyboard handling, result grouping, and the empty and
no-results states all work off the shared entry shape and need no changes.

Entry shape: `{ type, title, subtitle, route, keywords }` — `type` is the
human-facing source label shown on each result ("Module", "Topic").

### As built

- **Client-side only**, no library, no index file. The index is built lazily on
  first query and invalidated when a source registers.
- Two sources today: **Module** (number, name, description, ownership) and
  **Topic** (both group headings and individual topic items) — 43 + 250 + 1330
  entries.
- **Scoring**: query tokens are ANDed, so `virtual threads` will not match an
  entry containing only "thread". Exact title, prefix, and substring matches
  score in that order; a bare number ranks the matching module first (`12` →
  Module 12); shorter titles win ties as the more precise hit.
- **Every result is labelled with its source type** and navigates to the
  relevant module route on selection.
- **Keyboard**: `/` focuses the field, ↑/↓ move through results, Enter opens the
  active one (or the top hit), Escape closes. `role="combobox"` on the input
  with `aria-activedescendant` tracking the active option.
- **Empty query** hides the panel; **no results** explains what search currently
  covers, so a miss is not mistaken for a broken feature.

### Not yet decided — UNDECIDED

Whether full chapter body text gets indexed once chapters exist (a size vs
usefulness trade-off); fuzzy matching; whether the index should be prebuilt and
committed if it grows large enough to matter.

---

## 14. Responsive behaviour and theming

**Status: IMPLEMENTED (Phase 2).**

### Breakpoints as built

| Width | Behaviour |
|---|---|
| **≥ 900px** | Sidebar docked beside the content, sticky and independently scrollable. The hamburger, drawer close button, and backdrop are `display: none`, so they leave the accessibility tree entirely rather than sitting there inert. |
| **< 900px** | Sidebar becomes an overlay drawer: off-canvas by default, slid in over a dimmed backdrop, dismissible by backdrop click, close button, Escape, or following a link. |
| **≤ 560px** | Brand wordmark hides so the search field keeps usable width; heading scale and panel padding step down. |

Verified with no horizontal page scroll at 320, 390, 768, 1024, 1280, and
1920px. Layout uses Flexbox and Grid with relative units throughout.

**Drawer visibility detail worth preserving:** the closed drawer uses
`visibility: hidden` to keep its links out of the tab order, switched with a
**0s** transition (delayed on close, immediate on open) rather than an animated
one. An animated `visibility` transition still computes as `hidden` at the
instant the open class lands, which makes `.focus()` fail silently. This was a
real bug caught by browser testing in Phase 2 — do not "tidy" it back into the
`transform` transition.

### Theming as built

- **Three-block token system** in `theme.css`: the complete light palette on
  `:root`; a dark override on `:root[data-theme="dark"]`; and the same dark
  values under `@media (prefers-color-scheme: dark)` guarded by
  `:root:not([data-theme="light"])`, so an explicit light choice always beats a
  dark OS setting. All three blocks carry identical token sets (20 each) — a
  token added to one must be added to all.
- **Resolution order**: stored choice → `prefers-color-scheme` → light.
- **No flash of wrong theme**: a synchronous inline script in `<head>` applies
  the resolved theme before `<body>` exists. Verified by MutationObserver trace,
  not by eye.
- `color-scheme` is set per theme so native controls and scrollbars match.
- The toggle's icon and `aria-label` describe the **action** (moon + "Switch to
  dark theme" while light), not the current state.

### Still PLANNED

Code blocks scrolling within their own container — the decision stands, but the
rule arrives with the content it applies to. Typography scale may be revisited
when real content exists.

---

## 15. Cross-cutting decisions already fixed

These are settled and must not be re-litigated without an explicit instruction
from the project owner:

| # | Decision | Where it binds |
|---|---|---|
| 1 | Site UI is **HTML + CSS + vanilla JS only** — no frameworks, no build step | §2, §12–14 |
| 2 | **No backend, no database, no accounts**; progress is `localStorage` only | §9, §10 |
| 3 | The one permitted server-side component is a **minimal Phase 5 proxy**, only to hide an execution API key | §11 |
| 4 | **43 modules, numbered 01–43, frozen** | §5, `CURRICULUM.md` |
| 5 | Module numbers are **permanent identifiers**; progress keys off them | §3, §5, §9 |
| 6 | **Java 17 baseline**; newer-version features called out explicitly inline | `CURRICULUM.md`, all content |
| 7 | **Content is data, presentation is code** | §4 |
| 8 | **Single primary ownership** of each concept; others cross-link | §5 |
| 9 | **Local execution fallback always works**, with or without a network | §11 |
| 10 | **Repository is the source of truth**; the filesystem outranks the docs | §1 |
| 11 | **Hash-based routing** (`#/route`) — resolved in Phase 2 | §12, §16 |
| 12 | **`index.html` at the repository root**, assets under `assets/` | §3 |
| 13 | **`jfsm.` prefix** for every `localStorage` key | §10 |
| 14 | **Colour literals live only in `theme.css`**; all three theme blocks carry identical token sets | §2, §14 |
| 15 | **The site is served over http**, not opened as `file://` (ES modules) | §2 |
| 16 | **`data/modules.js` is the single source of module metadata**, generated from `CURRICULUM.md`, which is verbatim from `MASTER_BRIEF.md` §12 | §4 |
| 20 | **`docs/MASTER_BRIEF.md` is the canonical curriculum**; the chain is brief → curriculum → metadata, and `--check` guards both hops | §4, §5 |
| 21 | **Nothing the brief does not supply is invented** — `description` is derived, `prerequisites` is empty | §4 |
| 22 | **One progress API** (`progress.js`); one storage gateway (`storage.js`). No view touches `localStorage` | §9, §10 |
| 23 | **Progress is keyed on permanent module ids**, never index or order | §9 |
| 24 | **Progress storage is versioned**; a future-version record is left untouched rather than overwritten | §10 |
| 25 | **Reset clears progress but preserves the theme** | §9 |
| 26 | **Hints reveal one at a time; solutions and answers hidden by default** | §6 |
| 17 | **Module ids are permanent keys** derived from names; Phase 4 progress keys on them | §5 |
| 18 | **Search indexes registered sources**, so new content types need no rewrite | §13 |
| 19 | **No `innerHTML`** — all rendering goes through `assets/js/dom.js` and `textContent` | §2 |

---

## 16. Open questions

Carried forward for later phases. None of these may be silently resolved by
assumption — resolve them explicitly, record the resolution here and in
`PROJECT_STATE.md`.

1. **Content format** — JSON, Markdown with front-matter, or hybrid? (§4)
2. ~~**Routing** — hash-based, History API, or one HTML file per chapter?~~
   **RESOLVED in Phase 2: hash-based routing** (`#/dashboard`). Chosen because
   it needs no server rewrite rules, works from any static host and any
   subdirectory, and keeps deep links working without configuration. The cost —
   hash URLs are less tidy, and the fragment is unavailable for in-page anchors
   — is accepted. Revisit only if chapter deep-linking demands real paths. (§12)
3. ~~**Curriculum index** — generated from `CURRICULUM.md` or maintained
   separately?~~ **RESOLVED in Phase 3: generated.** `data/modules.js` is
   derived from `docs/CURRICULUM.md` by `tools/generate-modules.mjs`, with a
   `--check` mode that fails when the two diverge. Divergence is therefore
   detectable rather than merely discouraged. (§4)
4. **Search index** — prebuilt and committed, or built at runtime? Body text or
   titles only? (§13)
5. **Execution provider** — which service, and does it require a key (and hence
   a proxy)? (§11)
6. **Multi-file execution** — can online execution handle multi-file or Maven
   examples, or is local-only accepted for those? (§11)
7. **Practice checking** — auto-checked against expected output, or
   self-assessed? (§6)
8. **Assessment format** — per-module assessments, part checkpoints, or capstone
   only? (§8)
9. **Syntax highlighting** — hand-rolled, or a single dependency-free script
   (and does vendoring one violate the spirit of the no-dependency rule)? (§2)
10. **Phases 3, 4, and 6** — scope is **not specified** by the project owner and
    must not be invented. (`README.md` §10)
