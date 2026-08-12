# ARCHITECTURE.md — System Architecture

**Status of this document:** created as a skeleton in Phase 1; filled in from
what was actually built in Phase 2 (frontend, file structure, navigation,
theming, responsive) and Phase 3 (data architecture, module architecture,
search, dashboard). Many sections still describe systems that **do not exist
yet** and are marked accordingly. Real today: the documentation layer, the
website shell, and the module metadata layer with the views over it — no
learning content, no progress persistence, no code execution.

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
2. [Frontend architecture](#2-frontend-architecture) — **IMPLEMENTED** (shell only)
3. [File structure](#3-file-structure) — PARTIAL
4. [Data architecture](#4-data-architecture) — PARTIAL (module metadata built)
5. [Module & chapter architecture](#5-module--chapter-architecture) — PARTIAL (modules built, chapters not)
6. [Practice architecture](#6-practice-architecture) — PLANNED
7. [Interview-question architecture](#7-interview-question-architecture) — PLANNED
8. [Assessment architecture](#8-assessment-architecture) — PLANNED
9. [Progress system](#9-progress-system) — PLANNED (Phase 4)
10. [localStorage usage](#10-localstorage-usage) — PARTIAL (theme only)
11. [Compiler / execution abstraction](#11-compiler--execution-abstraction) — PLANNED (Phase 5)
12. [Navigation](#12-navigation) — **IMPLEMENTED** (shell only)
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

**Status: IMPLEMENTED for the application shell (Phase 2).** Layout, theming,
navigation, and routing exist and were verified in a real browser. Everything
the shell *contains* — module data, content rendering, search, progress,
practice, execution — is still PLANNED.

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
  `search.js`, `progress.js` (stub), and `dom.js` (element builder). No globals;
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

Chapter content rendering, progress persistence (§9, Phase 4), practice (§6),
execution (§11, Phase 5), syntax highlighting (§16 open question 9), and any
service worker / offline support.

---

## 3. File structure

**Status: PARTIAL.** The documentation layer exists; everything else is planned.

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
│   │   └── layout.css     ← app shell + Phase 3 components
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
│       └── progress.js    ← progress accessors (STUB until Phase 4)
├── data/
│   └── modules.js         ← GENERATED module metadata (single source)
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
confirms them" — this is that confirmation. `content/`, `java/`, and `tools/`
below are still intent.

### Planned — not yet implemented

```
Java_mastery/
├── content/               ← chapter content, once chapters are written
│   └── modules/
│       └── module-01/
│           └── chapters/
├── java/                  ← runnable Java sources, per module
│   └── module-01/
└── tools/                 ← Phase 5 adds execution adapters here
```

Note that `tools/` now exists — Phase 1 had reserved it for Phase 5 execution
helpers, and Phase 3 put the curriculum generator there first. Both belong to
"development tooling that is not shipped to the browser", so they share it.

**Naming conventions (decided now, so later phases are consistent):**

- Module directories: `module-NN` with a zero-padded two-digit number
  (`module-01` … `module-43`). The number is the permanent identifier.
- Chapter identifiers: `NN-MM` (module–chapter), e.g. `07-03`.
- Lowercase, hyphen-separated file and directory names throughout.

---

## 4. Data architecture

**Status: PARTIAL.** The module metadata layer exists (Phase 3). Chapter,
practice, and interview data do not.

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

## 5. Module & chapter architecture

**Status: PARTIAL.** The module set is fixed and documented; chapter structure
within modules is planned.

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

### Not yet decided — UNDECIDED

Chapter counts per module (determined when each module is authored, not in
advance); chapter granularity policy; whether prerequisites are enforced in
navigation or advisory only.

---

## 6. Practice architecture

**Status: PLANNED — not yet implemented.**

### Decided (from the methodology)

- Practice is **mandatory in every chapter**, not an optional appendix.
- Problems are **graded by difficulty** within a chapter.
- **Hints are progressive and stored separately from solutions**, so a hint can
  be revealed without spoiling the answer.
- **Solutions are revealed deliberately** by learner action, never shown by
  default.
- Every problem carries **expected output**, so correctness is checkable — by
  the learner locally, and by the execution layer once Phase 5 exists.
- **Predict-output questions are a distinct type** from practice problems: they
  are answered *before* running code and record prediction accuracy (§9), which
  is the primary signal of genuine understanding in this methodology.

### Not yet decided — UNDECIDED

Whether answers are auto-checked (string comparison of program output) or
self-assessed; whether starter code is provided per problem or per chapter;
spaced-repetition scheduling for revision.

---

## 7. Interview-question architecture

**Status: PLANNED — not yet implemented.**

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

**Status: PLANNED — Phase 4.** Phase 3 added `assets/js/progress.js` as a
**stub with no persistence**: every accessor returns the true current state of
an empty repository (zeros and empty arrays), and the dashboard reads through
it. The function shapes there are the contract Phase 4 must honour, so wiring
real `localStorage` should not require rewriting the dashboard.

Progress records will be keyed on module `id` from `data/modules.js` under the
`jfsm.` prefix (§10). Those ids are permanent — see §5.

### Decided (fixed architectural decisions)

- **Browser-local only.** Progress lives in `localStorage`. There is **no
  backend, no database, and no user account system.** This is a deliberate
  permanent decision, not a temporary shortcut.
- **Keyed by permanent identifiers** — module number and chapter ID (§3
  conventions). This is a primary reason the 43-module set is frozen.
- **Consequences are accepted:** progress is per-browser, per-device, and lost
  if site data is cleared. Mitigated by JSON export/import, not by a server.

### Intended tracked state

Chapter completion; module completion; practice problems attempted and solved;
predict-output accuracy; theme preference; last position (resume where you left
off); revision flags/bookmarks.

### Not yet decided — UNDECIDED

Whether completion is manual, inferred from activity, or both; granularity
(chapter-level vs section-level); export/import file format details.

---

## 10. localStorage usage

**Status: PARTIAL.** Exactly one key is in use — the theme preference, written
in Phase 2. Progress storage is still PLANNED (§9).

### In use today

| Key | Values | Written by |
|---|---|---|
| `jfsm.theme` | `"light"` \| `"dark"` | `assets/js/theme.js` |

The key is read in two places that must stay in step: `theme.js` and the inline
anti-FOUC script in `index.html`. Both treat any value other than exactly
`"light"` or `"dark"` as absent, and both wrap access in `try/catch`.

**Note:** the prefix convention is `jfsm.` (dot), not the `jfsm:` shown
illustratively in Phase 1. Phase 2 fixed the actual convention when it wrote the
first real key; all future keys use `jfsm.`.

### Decided

- **Namespaced keys.** All keys carry the `jfsm.` prefix so the project never
  collides with anything else on the same origin.
- **Versioned schema.** A stored schema version accompanies the data.
- **Non-destructive migrations.** A version bump must migrate existing progress
  forward. Wiping learner progress on upgrade is a destructive change and is
  not acceptable (`CLAUDE.md` §8).
- **Defensive reads.** All reads are wrapped: `localStorage` may be
  unavailable (private mode), full, or hold corrupted JSON. The site must
  degrade to "no saved progress" rather than break.
- **No sensitive data.** Only learning progress and preferences. No credentials,
  no personal data, no tokens.

### Not yet decided — UNDECIDED

Exact key layout (one aggregate record vs per-module records — a trade-off
between write cost and quota granularity); quota handling strategy; whether
`sessionStorage` or IndexedDB is used for anything.

---

## 11. Compiler / execution abstraction

**Status: PLANNED — not yet implemented (Phase 5).** Nothing here exists.
Everything except the two decisions below is open.

### Decided

1. **One interface, two adapters.** Chapter content is **never** coupled to a
   specific execution provider. All execution goes through a single internal
   interface with interchangeable implementations.
2. **The local fallback always exists.** Every runnable example ships with exact
   `javac` / `java` / Maven commands. The platform must be **fully usable with
   online execution disabled or unavailable** — offline, no network, no third
   party. Online execution is an enhancement, never a dependency.

### Adapters

| Adapter | Role |
|---|---|
| **Online adapter** | Sends source to a third-party Java execution service; renders `stdout`, `stderr`, exit code, and compiler diagnostics |
| **Local fallback** | Exact commands for the learner to compile and run locally; always present |

### Proxy — conditional

If the chosen provider requires a secret key, a **minimal proxy** may be
introduced for the sole purpose of keeping that key off the client. Constraints:

- **No secret may ever appear in client-side JavaScript or in this repository.**
- The proxy does nothing but forward the execution request and response.
- It must not become a general backend — no database, no accounts, no rendering.
- If no key is needed, no proxy is built.

### Not yet decided — UNDECIDED

Provider selection; request/response schema; timeout, rate-limit, and quota
handling; error and diagnostic presentation; whether stdin input is supported;
whether multi-file or Maven-project examples can run online at all (many
providers accept a single file — the local fallback covers this case regardless).

---

## 12. Navigation

**Status: IMPLEMENTED (Phase 2 shell, Phase 3 module tree).** The chapter level
does not exist because chapters do not.

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

**Status: IMPLEMENTED as structure (Phase 3); values arrive with Phase 4.**

Seven sections, each reading `data/modules.js` and the `progress.js` stub — no
duplicated module list, no hardcoded figures:

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
