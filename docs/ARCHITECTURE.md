# ARCHITECTURE.md — System Architecture

**Status of this document:** created as a skeleton in Phase 1; the frontend,
file structure, navigation, theming, and responsive sections were filled in from
what was actually built in Phase 2. Many sections still describe systems that
**do not exist yet** and are marked accordingly. Real today: the documentation
layer and the website shell — nothing else.

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
4. [Data architecture](#4-data-architecture) — PLANNED (Phase 3)
5. [Module & chapter architecture](#5-module--chapter-architecture) — PARTIAL
6. [Practice architecture](#6-practice-architecture) — PLANNED
7. [Interview-question architecture](#7-interview-question-architecture) — PLANNED
8. [Assessment architecture](#8-assessment-architecture) — PLANNED
9. [Progress system](#9-progress-system) — PLANNED (Phase 3)
10. [localStorage usage](#10-localstorage-usage) — PARTIAL (theme only)
11. [Compiler / execution abstraction](#11-compiler--execution-abstraction) — PLANNED (Phase 5)
12. [Navigation](#12-navigation) — **IMPLEMENTED** (shell only)
13. [Search](#13-search) — PLANNED (Phase 3)
14. [Responsive behaviour](#14-responsive-behaviour) — **IMPLEMENTED**
15. [Cross-cutting decisions already fixed](#15-cross-cutting-decisions-already-fixed)
16. [Open questions](#16-open-questions)

---

## 1. Documentation layer

**Status: IMPLEMENTED (Phase 1).** This is the only part of the system that
currently exists.

### Purpose

Make the repository self-describing, so that any human or AI agent can
reconstruct full project understanding from files alone, with zero conversation
history. See [`AI_INSTRUCTIONS.md`](AI_INSTRUCTIONS.md) §1.

### Components

| File | Role | Change frequency |
|---|---|---|
| `README.md` | Complete project description; entry point for humans and agents | Rarely — when project shape/status changes |
| `CLAUDE.md` | Permanent operating rules for Claude Code | Rarely — rules are meant to be stable |
| `docs/AI_INSTRUCTIONS.md` | Same rules, agent-neutral, plus workflow protocols | Rarely |
| `docs/PROJECT_STATE.md` | Authoritative current status | **Every unit of work** |
| `docs/ARCHITECTURE.md` | This file — system design | When a structural decision is made |
| `docs/CURRICULUM.md` | The 43 modules and their full topic lists | Topic clarification only; never structural |

### Design decisions (fixed in Phase 1)

1. **Six files, flat structure.** `README.md` and `CLAUDE.md` at the root
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

- **ES modules** (`<script type="module">`), three of them, each with one job:
  `app.js` (bootstrap), `theme.js` (theme state), `nav.js` (drawer + router).
  No globals; modules communicate by import, not by shared window state.
- **Three stylesheets** with a strict division of responsibility:
  `base.css` (reset, non-colour tokens, typography, focus primitives),
  `theme.css` (the entire colour system — and nothing else),
  `layout.css` (app-shell structure and breakpoints).
  *Rule: no colour literal may appear outside `theme.css`.*
- **Views are static markup**, toggled with the `hidden` property rather than
  injected as template strings. Content lives in the document, and no phase of
  this project needs `innerHTML` to render a view.
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

Content rendering from data (Phase 3), search (§13), progress (§9), practice
(§6), execution (§11), syntax highlighting (§16 open question 9), and any
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
│   │   └── layout.css     ← app shell: topbar, sidebar, drawer, content
│   └── js/
│       ├── app.js         ← bootstrap / entry point
│       ├── theme.js       ← theme resolution, toggle, persistence
│       └── nav.js         ← drawer behaviour + hash router
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
├── content/               ← module & chapter content (Phase 3+)
│   └── modules/
│       └── module-01/
│           ├── module.json      ← module metadata & chapter index
│           └── chapters/        ← per-chapter content
├── java/                  ← runnable Java sources, per module
│   └── module-01/
└── tools/                 ← Phase 5: execution adapters/helpers
```

**Naming conventions (decided now, so later phases are consistent):**

- Module directories: `module-NN` with a zero-padded two-digit number
  (`module-01` … `module-43`). The number is the permanent identifier.
- Chapter identifiers: `NN-MM` (module–chapter), e.g. `07-03`.
- Lowercase, hyphen-separated file and directory names throughout.

---

## 4. Data architecture

**Status: PLANNED — not yet implemented.**

### Principle (decided)

**Content is data; presentation is code.** Chapter content is stored in
structured files and rendered by the site, rather than hand-written as page
markup. This keeps the 43 modules uniform, makes search indexable, makes
progress trackable per section, and lets presentation change without rewriting
content.

### Intended data objects

| Object | Holds |
|---|---|
| **Curriculum index** | The 43 modules: number, name, part, prerequisites, chapter list |
| **Module** | Metadata, learning outcomes, chapter index, cross-links to other modules |
| **Chapter** | The 15 workflow sections (concept, examples, predict-output, lab, practice, hints, execution, solutions, interview Qs, mistakes, revision, integration) |
| **Code example** | Source, language, filename, expected output, runnable flag, required Java version |
| **Practice problem** | Prompt, difficulty, starter code, hints (ordered), solution, expected output |
| **Interview question** | Question, model answer, depth level, related module numbers |
| **Progress record** | Per-learner state (browser-local only — see §9, §10) |

### Not yet decided — UNDECIDED

Serialization format (JSON vs Markdown-with-front-matter vs a hybrid); whether
content loads per chapter or as bundles; whether the curriculum index is
generated from `CURRICULUM.md` or maintained separately (it must not diverge
from it either way).

---

## 5. Module & chapter architecture

**Status: PARTIAL.** The module set is fixed and documented; chapter structure
within modules is planned.

### Decided

- **Exactly 43 modules, numbered 01–43, frozen.** See
  [`CURRICULUM.md`](CURRICULUM.md). Modules are never added, removed, merged,
  split, renamed, renumbered, or reordered.
- **Module numbers are permanent identifiers** — used by navigation, progress
  keys, and cross-references. This is *why* the set is frozen: renumbering
  invalidates stored learner progress.
- **Modules are grouped into six parts** for navigation only. Parts are a
  presentation grouping; they carry no identity and no progress state.
- **Each module is split into chapters**; the chapter is the unit of delivery
  and the unit of progress.
- **Every chapter follows the 15-step delivery workflow** (`README.md` §6). The
  chapter data model mirrors those steps one-to-one (§4).
- **Single primary ownership.** Each concept is taught in exactly one module;
  others cross-link. `CURRICULUM.md` records ownership per module.

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

**Status: PLANNED — not yet implemented.**

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

**Status: IMPLEMENTED for the shell (Phase 2).** The chrome and the routing
mechanism exist; the module/chapter tree that will fill the sidebar does not.

### As built

- **Persistent shell**: a fixed top bar plus a sidebar, on a single page.
- **Sidebar** carries seven placeholder destinations in three groups — Learn
  (Dashboard, Curriculum, Practice), Prepare (Interview, Assessments), and
  Build & Review (Projects, Revision). **The 43 modules are deliberately not
  hardcoded**; that tree is data-driven in Phase 3.
- **Routing is hash-based** — `#/dashboard`, `#/curriculum`, … — resolving
  §16 open question 2 (see below). A bare URL falls back to `#/dashboard`; an
  unrecognised route renders a "not found" view and clears the active state.
- **Active state** is expressed with `aria-current="page"`, and the CSS
  highlight keys off that attribute, so the accessible name and the visible
  highlight cannot disagree.
- **Document title** updates per route (`Curriculum · Java Full-Stack Mastery`).
- **Focus management**: navigating moves focus to `<main>` (which carries
  `tabindex="-1"`) so keyboard users land in the new content; opening the drawer
  moves focus into it and traps Tab there; closing returns focus to the toggle.
- **Escape** closes the drawer.

### Still PLANNED

Three-level drill-down (part → module → chapter), breadcrumbs, previous/next
chapter controls crossing module boundaries, resume-where-you-left-off (§9), and
progress indication in the module list. Whether prerequisites gate navigation or
merely advise remains UNDECIDED.

---

## 13. Search

**Status: PLANNED — not yet implemented.**

### Intended

- **Client-side only** — consistent with "no backend". No search server.
- Indexes module names, chapter titles, topics, and concept keywords.
- Results grouped by module, showing module number and chapter.
- Keyboard-accessible, with a keyboard shortcut to focus the field.

### Not yet decided — UNDECIDED

Whether the index is prebuilt (committed) or built at runtime; whether full
chapter body text is indexed or only titles/topics/keywords (a size vs
usefulness trade-off); fuzzy matching and ranking strategy.

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
3. **Curriculum index** — generated from `CURRICULUM.md` or maintained
   separately (and if separate, how is divergence prevented)? (§4)
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
