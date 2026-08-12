# PROJECT_STATE.md — Authoritative Current Status

> **This file must always reflect current reality.** It is the first thing any
> agent trusts, so a stale entry here is an active hazard. Update it after every
> meaningful unit of work.
>
> **The filesystem outranks this file.** If the repository disagrees with
> anything below, the repository is correct — fix this document and say that you
> fixed it.

**Last updated:** 2026-08-12

---

## Status vocabulary

Used throughout this file. Never substitute vague words like "done" or
"finished".

| Status | Meaning |
|---|---|
| `NOT_STARTED` | Nothing exists for it |
| `FOUNDATION_ONLY` | Structure/scaffolding/placeholders only; no real content |
| `IN_PROGRESS` | Partially built; explicitly incomplete |
| `CONTENT_COMPLETE` | All content written, but not yet verified by execution |
| `VERIFIED` | Content complete **and** every example actually compiled and run |

---

## Core state

| Field | Value |
|---|---|
| **Project phase** | FOUNDATION (Phase 2 of 6 — Website Shell) — **complete** |
| **Current module** | none (foundation not yet complete) |
| **Current chapter** | none |
| **Completed modules** | none (0 of 43) |
| **Completed chapters** | none |
| **Partially completed work** | none — Phase 2 finished its stated scope; Phases 3–6 not started |
| **Next required task** | Phase 3 — Dashboard + 43-module metadata + search foundation |
| **Completed website features** | app shell (top bar, sidebar, content region); light/dark theming with persistence and no flash; responsive drawer navigation; hash-routing scaffold with active state |
| **Compiler integration status** | not started |
| **Known bugs** | none |
| **Known limitations** | see [Known limitations](#known-limitations) below |
| **Last verification status** | Phase 2 verified in-browser — 42/42 checks passed; see [Verification](#verification-status) |
| **Last updated** | 2026-08-12 |

---

## Phase status

| Phase | Scope | Status |
|---|---|---|
| **1** | Documentation layer (`README.md`, `CLAUDE.md`, `docs/*`) | `CONTENT_COMPLETE` — see [Verification](#verification-status) |
| **2** | Website shell — HTML/CSS/JS, navigation, dark/light mode, responsive layout | `VERIFIED` — built and exercised in a real browser |
| **3** | *Not yet specified by the project owner* | Awaiting specification |
| **4** | *Not yet specified by the project owner* | Awaiting specification |
| **5** | Compiler / code-execution integration | `NOT_STARTED` |
| **6** | *Not yet specified by the project owner* | Awaiting specification |

Phases 3, 4, and 6 have **not** been defined. No agent may invent, assume, or
act on a scope for them.

---

## Curriculum status

All 43 modules: `NOT_STARTED`. No module content, no chapters, and no Java
source files exist anywhere in this repository.

`docs/CURRICULUM.md` defines the modules and their topic lists. **Defining a
module is not the same as building it** — the curriculum document is the
specification of work not yet done.

| Modules | Status |
|---|---|
| 01–43 (all) | `NOT_STARTED` |

---

## What actually exists in this repository

Verified by direct inspection on 2026-08-12:

```
Java_mastery/
├── index.html                 (Phase 2 — app shell)
├── README.md                  (Phase 1, updated Phase 2)
├── CLAUDE.md                  (Phase 1)
├── assets/
│   ├── css/
│   │   ├── base.css           (Phase 2)
│   │   ├── theme.css          (Phase 2)
│   │   └── layout.css         (Phase 2)
│   └── js/
│       ├── app.js             (Phase 2)
│       ├── theme.js           (Phase 2)
│       └── nav.js             (Phase 2)
└── docs/
    ├── PROJECT_STATE.md       (Phase 1 — this file, updated Phase 2)
    ├── ARCHITECTURE.md        (Phase 1, updated Phase 2)
    ├── CURRICULUM.md          (Phase 1)
    └── AI_INSTRUCTIONS.md     (Phase 1)
```

**Nothing else.** No `content/`, no `java/`, no `tools/`, no module data, no
build files, no configuration, no dependencies. Directory names appearing in
`README.md` §12 and `ARCHITECTURE.md` §3 beyond the tree above are **planned
intent only**.

Before Phase 1, the repository contained a single 14-byte `README.md` holding
only the line `# Java_mastery`. That stub was replaced by the full README; no
other pre-existing content existed to preserve.

---

## Important architectural decisions

Fixed. Do not re-litigate without an explicit instruction from the project owner.
Full detail in `docs/ARCHITECTURE.md` §15.

1. **Vanilla HTML/CSS/JS only for the learning site UI** — no React, Angular,
   Vue, Svelte, TypeScript, jQuery, CSS frameworks, bundlers, or build steps.
   This restriction governs the **UI only**; the curriculum teaches the full
   Java/Spring/SQL stack without restriction.
2. **`localStorage` for progress — no backend account system**, no database, no
   server-side user state. Accepted consequence: progress is per-browser and
   per-device; mitigated by planned JSON export/import, not by a server.
3. **43 fixed modules, numbered 01–43.** Never added, removed, merged, split,
   renamed, renumbered, or reordered. Module numbers are permanent identifiers
   used by navigation, progress keys, and cross-references.
4. **Java 17 is the baseline**; any feature requiring a newer release must be
   called out explicitly and inline, naming the release.
5. **The only sanctioned server-side component** is a minimal Phase 5 proxy,
   and only if a chosen Java-execution provider requires a secret key that must
   be kept off the client.
6. **The local execution fallback must always work** — the platform stays fully
   usable with online execution disabled or unavailable.
7. **Content is data; presentation is code.**
8. **Single primary ownership** — each concept is taught in exactly one module;
   later modules cross-link rather than re-teach.
9. **Repository is the source of truth**; the filesystem outranks the docs.

---

## Known limitations

1. **The site must be served over http** (`python3 -m http.server`), not opened
   as a `file://` path — browsers block ES module scripts on `file://`, so the
   theme toggle and navigation would not run. This is a browser constraint, not
   a build step; nothing is compiled. A `<noscript>` block says so in the page.
2. **No content of any kind.** Every view is a placeholder; no module metadata,
   no chapters, no practice problems, no interview questions.
3. **The sidebar shows seven placeholder destinations, not the 43 modules.**
   The module tree is data-driven in Phase 3 and deliberately not hardcoded.
4. **Search is a disabled stub.** No index, no query handling.
5. **No progress tracking.** The only `localStorage` key in use is the theme.
6. **Without JavaScript, only the dashboard view renders** — the other views
   ship with `hidden` set. Full no-JS content was not a Phase 2 goal.

---

## Important implementation decisions

Made during Phase 2:

9.  **`index.html` sits at the repository root, assets under `assets/`** — a
    deliberate deviation from the `site/` tree sketched in Phase 1, which had
    labelled itself "intent, not commitments; Phase 2 confirms them". Root
    placement is what static hosts serve by default. Recorded in
    `docs/ARCHITECTURE.md` §3.
10. **Hash-based routing** (`#/dashboard`) — resolves open question 2 in
    `docs/ARCHITECTURE.md` §16. No server rewrite rules, works from any static
    host or subdirectory.
11. **`jfsm.` (dot) is the `localStorage` key prefix**, fixing the convention
    that Phase 1 had only illustrated as `jfsm:`. First key: `jfsm.theme`.
12. **Colour literals may appear only in `theme.css`**, which carries three
    token blocks (light, explicit dark, OS-preference dark) with identical
    20-token sets. A token added to one must be added to all.
13. **Views are static markup toggled with `hidden`**, never injected via
    `innerHTML`. Keeps content in the document and avoids an injection surface.
14. **The drawer's `visibility` uses a 0s transition, not an animated one.**
    An animated `visibility` transition still computes as `hidden` at the moment
    the open class lands, making `.focus()` fail silently — a real bug found by
    browser testing. Do not refactor it back into the `transform` transition.
15. **The theme toggle advertises its action, not its state** — moon icon and
    "Switch to dark theme" while in light mode.

Made during Phase 1:

1. **Six documentation files, flat structure** — `README.md` and `CLAUDE.md` at
   the repository root (conventional discovery locations), the four detail
   documents under `docs/`.
2. **`PROJECT_STATE.md` is the single mutable status file.** Status is never
   duplicated into other documents; they link here instead. One writer, one
   truth, no drift.
3. **Rules are intentionally duplicated** between `CLAUDE.md` and
   `docs/AI_INSTRUCTIONS.md`, so an agent reading only one still gets the
   complete rule set. This is a deliberate exception to the no-duplication rule,
   which governs curriculum content rather than governance documents.
   **Consequence: a rule change must update both files in the same unit of work.**
4. **Explicit status vocabulary adopted** (`NOT_STARTED` / `FOUNDATION_ONLY` /
   `IN_PROGRESS` / `CONTENT_COMPLETE` / `VERIFIED`) and used everywhere in place
   of prose adjectives.
5. **Naming conventions fixed early** so later phases stay consistent: module
   directories `module-NN` (zero-padded, 01–43); chapter identifiers `NN-MM`
   (module–chapter); lowercase hyphen-separated names throughout.
6. **Curriculum organised into six presentation "parts"** for navigation only.
   Parts group modules for readability; they carry no identity and no progress
   state, and they do not alter the frozen 43-module numbering.
7. **`ARCHITECTURE.md` written as a status-marked skeleton** — every section
   carries `IMPLEMENTED` / `PARTIAL` / `PLANNED` / `UNDECIDED` so no future
   agent mistakes intent for fact. Open questions are listed explicitly in §16
   rather than silently resolved.
8. **Curriculum authored in Phase 1 from the project owner's stated endpoints.**
   See [Open items](#open-items-carried-into-later-phases) item 1 — this is the
   one Phase 1 deliverable whose source needs confirmation.

---

## Things that must NOT be redone

- **The documentation structure created in Phase 1** — the six files, their
  locations, and their division of responsibility. Extend and update them; do
  not restructure, relocate, consolidate, or replace them.
- **The status vocabulary** — do not invent parallel status words.
- **The fixed architectural decisions** listed above — they are settled.
- **The 43-module set and numbering** in `docs/CURRICULUM.md` — frozen.
- **The naming conventions** (`module-NN`, chapter `NN-MM`, lowercase-hyphenated).
- **The Phase 2 shell** — `index.html` and the six files under `assets/`. Extend
  them; do not rebuild the shell, relocate it, or introduce a framework or build
  step into it.
- **The three-file CSS split** (`base` / `theme` / `layout`) and the rule that
  colour literals live only in `theme.css`.
- **The drawer `visibility` 0s-transition fix** — see implementation decision 14.

Non-destructive development applies throughout: inspect before overwriting, and
never discard work you did not create (`CLAUDE.md` §8).

---

## Verification status

### Phase 2 — performed 2026-08-12

**Method:** the site was served with `python3 -m http.server` and driven in
headless Chromium via Playwright. **42 automated checks, 42 passed, 0 failed.**
Screenshots were captured and reviewed at desktop, tablet, mobile, and 320px, in
both themes. This is execution, not code reading — hence `VERIFIED`.

| Area | Checks that passed |
|---|---|
| Load integrity | no console errors, no page exceptions, no failed requests across the entire run; all 7 files serve 200 |
| Theming | default light with no stored preference; toggle switches to dark; choice persisted to `jfsm.theme`; body background actually changes; survives reload in both directions; dark OS preference honoured when nothing is stored; **explicit light choice overrides a dark OS preference** |
| No flash | MutationObserver trace shows the only theme change is `light → dark` **before `<body>` existed**; no change after the body can paint |
| Routing | all 7 nav links swap the view and set exactly one active item; unknown route renders not-found and clears active state; bare URL falls back to dashboard; document title tracks the route |
| Desktop (1280px) | sidebar docked; hamburger, close button, and backdrop all absent from the layout |
| Mobile drawer (390px) | opens via hamburger; `aria-expanded` tracks state; backdrop appears; focus moves into the drawer; Escape closes and returns focus to the toggle; backdrop click closes; close button closes; following a link closes it and still navigates; resizing to desktop clears a stale open state |
| Overflow | no horizontal page scroll at 320, 390, 768, 1024, 1280, 1920px |
| Accessibility | first Tab reaches the skip link; `<main>` is focusable as the skip target; exactly one visible `<h1>` per view; search stub is genuinely disabled |
| Regression guard | closed backdrop does not intercept clicks on the content beneath it |
| Code hygiene | zero unused CSS classes; zero unreferenced custom properties; all three theme blocks carry identical 20-token sets |

**Two real bugs were found by this testing and fixed:**

1. The drawer's animated `visibility` transition made `.focus()` fail silently
   on open, so keyboard users never entered the drawer. Fixed with a 0s
   visibility transition (implementation decision 14).
2. Once `nav.js` removed the backdrop's `hidden` attribute, the invisible
   backdrop covered the viewport and swallowed every click. Fixed with
   `pointer-events: none` while closed.

### Phase 2 — not verified

- **Not verified because no such thing exists yet:** module content, module
  metadata, search behaviour, progress tracking, practice UI, code execution.
  Phase 2 built the shell only, and no claim is made about any of them.
- **Not verified because it is out of scope for this environment:** real mobile
  hardware, touch gestures, iOS/Android browsers, Safari, and Firefox. All
  testing was headless Chromium. Layout was exercised at mobile *viewport
  sizes*, which is not the same as testing on a device.
- **Not verified:** screen-reader announcement behaviour with an actual screen
  reader (NVDA/JAWS/VoiceOver). ARIA attributes and focus order were asserted
  programmatically; how a screen reader narrates them was not observed.
- **Not verified:** colour-contrast ratios were not measured against WCAG
  thresholds with a contrast tool.
- **No Java code was compiled or run — not verified because this phase produced
  no Java code.**

---

### Phase 1 — performed 2026-08-11

**Method:** direct filesystem inspection and content checks of the files that
phase created.

#### Verified

| Check | Result |
|---|---|
| All 6 documentation files exist | **PASS** |
| All 6 files are non-empty | **PASS** |
| `docs/CURRICULUM.md` contains exactly 43 modules, numbered 01–43, no gaps or duplicates | **PASS** |
| Every module in `docs/CURRICULUM.md` has a topic list | **PASS** |
| Module 01 is "Java Foundations & Execution Model" | **PASS** |
| Module 43 is "Final Full-Stack Capstone & Mastery Assessment" | **PASS** |
| `README.md` links to all four `docs/` files | **PASS** |
| Module names in `README.md` match `docs/CURRICULUM.md` exactly (all 43) | **PASS** |

#### Not verified

*(Accurate as of Phase 1. The website shell has since been built and verified —
see the Phase 2 section above.)*

- **The website, the compiler/execution layer, and all module content — not
  verified because: none of it existed at the time.** Phase 1 produced
  documentation only.
- **No code was compiled or executed. Not verified because: this phase produced
  no code.** No JDK usage was required or attempted.
- **Curriculum module names and topic lists have not been checked against an
  external master brief. Not verified because: no such brief exists in this
  repository or was provided to the authoring session** — see
  [Open items](#open-items-carried-into-later-phases) item 1.

---

## Open items carried into later phases

1. **Curriculum provenance — needs the project owner's confirmation.** The
   Phase 1 instruction was to reproduce the 43 modules "as specified in the
   master project brief", but that brief was not present in the repository and
   was not supplied to the authoring session; only the two endpoints were given
   (Module 01 — Java Foundations & Execution Model; Module 43 — Final
   Full-Stack Capstone & Mastery Assessment). The 43 modules and their topic
   lists were therefore **authored in Phase 1**, anchored at those endpoints,
   and are recorded as authoritative going forward. **If a canonical master
   brief exists, reconcile `docs/CURRICULUM.md` against it before Phase 2
   completes** — the module set must be settled before any content, navigation,
   or progress key depends on it. See `docs/CURRICULUM.md` § Provenance.
2. **Ten architectural open questions** are recorded in `docs/ARCHITECTURE.md`
   §16 (content format, routing, curriculum index generation, search index,
   execution provider, multi-file execution, practice checking, assessment
   format, syntax highlighting, and the unspecified phases). None may be
   resolved by silent assumption.
3. **Phases 3, 4, and 6 are unspecified** and await the project owner's
   instruction.

---

## Change log

| Date | Phase | Change |
|---|---|---|
| 2026-08-11 | 1 | Created the documentation layer: `README.md` (replacing the 14-byte stub), `CLAUDE.md`, `docs/PROJECT_STATE.md`, `docs/ARCHITECTURE.md`, `docs/CURRICULUM.md`, `docs/AI_INSTRUCTIONS.md`. Authored the 43-module curriculum with full topic lists. No code written; no website; no execution layer. |
| 2026-08-12 | 2 | Built the website shell: `index.html` plus `assets/css/{base,theme,layout}.css` and `assets/js/{app,theme,nav}.js`. App shell layout, light/dark theming with persistence and no flash, responsive drawer navigation, and a hash-routing scaffold. Verified in headless Chromium: 42/42 checks passed; two real bugs found and fixed. Updated `docs/ARCHITECTURE.md` (§2, §3, §10, §12, §14, §15, §16) and `README.md`. No module content, search, progress tracking, or execution — those remain later phases. |
