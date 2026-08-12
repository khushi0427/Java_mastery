# PROJECT_STATE.md — Authoritative Current Status

> **This file must always reflect current reality.** It is the first thing any
> agent trusts, so a stale entry here is an active hazard. Update it after every
> meaningful unit of work.
>
> **The filesystem outranks this file.** If the repository disagrees with
> anything below, the repository is correct — fix this document and say that you
> fixed it.

**Last updated:** 2026-08-12 (Phase 4 — progress tracking + practice shells)

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
| **Project phase** | FOUNDATION (Phase 4 of 6 — Progress tracking + practice/hint/predict shells) — **complete** |
| **Current module** | none (foundation not yet complete) |
| **Current chapter** | none |
| **Completed modules** | none (0 of 43) |
| **Completed chapters** | none |
| **Partially completed work** | none — Phase 4 finished its stated scope; Phases 5–6 not started |
| **Next required task** | Phase 5 — Java execution architecture (editor + execution-service abstraction + local `javac`/`java` fallback) |
| **Completed website features** | app shell; light/dark theming with persistence and no flash; responsive drawer navigation; hash routing with active state; metadata-driven sidebar listing all 43 modules; module overview and curriculum views; functional module/topic search; **real `localStorage` progress persistence**; **dashboard wired to stored progress**; **practice / progressive-hint / predict-the-output UI shells** |
| **Compiler integration status** | not started |
| **Known bugs** | none |
| **Known limitations** | see [Known limitations](#known-limitations) below |
| **Last verification status** | Phase 4 verified in-browser — 63/63 Phase 4 checks, plus 33/33 realignment, 64/64 Phase 3, 42/42 Phase 2 (202 total); see [Verification](#verification-status) |
| **Last updated** | 2026-08-12 |

---

## Phase status

| Phase | Scope | Status |
|---|---|---|
| **1** | Documentation layer (`README.md`, `CLAUDE.md`, `docs/*`) | `CONTENT_COMPLETE` — see [Verification](#verification-status) |
| **2** | Website shell — HTML/CSS/JS, navigation, dark/light mode, responsive layout | `VERIFIED` — built and exercised in a real browser |
| **3** | Dashboard + 43-module metadata layer + search foundation | `VERIFIED` — built and exercised in a real browser |
| **4** | Progress tracking (localStorage) + practice / hint / predict-output UI shells | `VERIFIED` — built and exercised in a real browser |
| **5** | Java execution architecture — editor UI, execution-service abstraction, local fallback | `NOT_STARTED` |
| **6** | *Not yet specified by the project owner* | Awaiting specification |

Phase 6 has **not** been defined. No agent may invent, assume, or act on a
scope for it. Phases 3 and 4 were specified by the project owner in due course;
their scope above is what was actually instructed, not inferred.

---

## Curriculum status

**The curriculum is REALIGNED and (re)LOCKED to `docs/MASTER_BRIEF.md` — 2026-08-12.**

`docs/MASTER_BRIEF.md` is the **canonical source** of the curriculum. It was
added to the repository after Phase 3, and the 43 modules Phase 1 had authored
turned out **not** to match it — only 2 of 43 names agreed (Modules 01 and 43,
the two endpoints Phase 1 had been given). `docs/CURRICULUM.md` was therefore
rewritten as a verbatim transcription of the brief's Section 12, and
`data/modules.js` regenerated from it.

**This supersedes the Phase 3 lock entirely.** Full history is recorded in
`docs/CURRICULUM.md` Appendix B.

### The chain of truth — do not break it

    docs/MASTER_BRIEF.md §12   canonical, owner-written
           ↓ verbatim transcription
    docs/CURRICULUM.md         readable curriculum, stable parse target
           ↓ tools/generate-modules.mjs
    data/modules.js            the single source the application reads

`node tools/generate-modules.mjs --check` verifies **both** hops and exits
non-zero on drift. Never hand-edit `data/modules.js`, and never edit a module
block in `CURRICULUM.md` — change the brief and re-transcribe.

All 43 modules: `NOT_STARTED`. Module **metadata** exists; no module content, no
chapters, and no Java source files exist. **Metadata is not content.**

### Module id convention — Phase 4 keys on this

    <number>-<name, kebab-cased>

e.g. `08-hashing-hashmap-internals`, `23-graphs`, `32-spring-core`. **41 of 43
ids changed in the realignment.** Nothing was orphaned because no progress had
been stored — which is exactly why this had to happen before Phase 4.

Ids derive from names, so **renaming a module in the brief moves its id**. If a
rename ever becomes unavoidable, pin the old id by hand in the generator.

### Two metadata fields the brief does not supply

The brief's Section 12 gives module names and topic bullets only. Neither of the
following was invented:

- **`description`** — DERIVED mechanically as `Topics include: <first five
  topics>.` Every record carries `descriptionDerived: true`. No editorial prose
  was written for 43 modules.
- **`prerequisites`** — **empty for all 43.** The brief states no per-module
  prerequisites, and inferring them from module order would be a guess. The UI
  shows "Not specified by the master brief" rather than a bare "None".

The brief's per-module emphasis IS carried, verbatim, in a `notes` field —
Module 08's extra-depth requirement, Module 14's JVM-spec-vs-HotSpot
distinction, Module 30's JPA-vs-Hibernate framing, and others. Module 42's seven
named projects are carried in `subsections`.

| Modules | Status |
|---|---|
| 01–43 (all) | `NOT_STARTED` |

---

## Progress storage — the contract Phase 5+ must not break

**Namespace:** every key carries the `jfsm.` prefix.

| Key | Contents |
|---|---|
| `jfsm.theme` | `"light"` or `"dark"` |
| `jfsm.progress` | the single aggregate progress record |

**`schemaVersion: 1`.** Bumping it requires a migration branch in
`progress.js`; wiping learner records on upgrade is not acceptable. A record
written by a **future** version is left completely untouched and treated as "no
progress this session", rather than overwritten.

**Keys inside the record are the permanent module ids** (e.g.
`08-hashing-hashmap-internals`) — never an array index or display position.

Full schema in `docs/ARCHITECTURE.md` §10.

### Two status axes — do not conflate

| Axis | Source | Values |
|---|---|---|
| Content | `data/modules.js` | `NOT_STARTED` … `VERIFIED` — what exists in the repo |
| Learner | the progress store | `NOT_STARTED` / `IN_PROGRESS` / `COMPLETED` |

### TEMPORARY SCAFFOLDING — remove when chapters land

The module page carries a **manual "mark started / in progress / completed"
control**, visibly tagged `TEMPORARY SCAFFOLDING`. It exists only because Phase 4
built persistence before any chapters or exercises existed to complete — without
it there would be no way to exercise or verify the store.

**Replace it** when chapters arrive: completion should then follow from actually
finishing chapters and exercises, via `setChapterComplete` / `setExerciseSolved`,
which already exist and are already tested.

---

## What actually exists in this repository

Verified by direct inspection on 2026-08-12:

```
Java_mastery/
├── index.html                 (Phase 2 shell, extended Phase 3)
├── README.md                  (Phase 1, updated Phases 2–3)
├── CLAUDE.md                  (Phase 1)
├── assets/
│   ├── css/
│   │   ├── base.css           (Phase 2, extended Phase 3)
│   │   ├── theme.css          (Phase 2, status colours Phase 3)
│   │   └── layout.css         (Phase 2, components Phase 3)
│   └── js/
│       ├── app.js             (Phase 2, extended Phase 3)
│       ├── theme.js           (Phase 2)
│       ├── nav.js             (Phase 2, module routes Phase 3)
│       ├── dom.js             (Phase 3)
│       ├── sidebar.js         (Phase 3)
│       ├── dashboard.js       (Phase 3)
│       ├── curriculum-view.js (Phase 3)
│       ├── module-view.js     (Phase 3)
│       ├── search.js          (Phase 3)
│       ├── storage.js         (Phase 4 — the ONLY localStorage gateway)
│       ├── progress.js        (Phase 4 — real persistence, one progress API)
│       ├── practice-view.js   (Phase 4)
│       ├── exercise-shell.js  (Phase 4 — exercise + progressive hints)
│       └── predict-shell.js   (Phase 4 — predict-the-output)
├── data/
│   ├── modules.js             (GENERATED from CURRICULUM.md — do not hand-edit)
│   ├── exercises.js           (Phase 4 — contract + 1 labelled placeholder)
│   └── predict-output.js      (Phase 4 — contract + 1 labelled placeholder)
├── tools/
│   └── generate-modules.mjs   (dev tool, not a build step; --check guards both hops)
└── docs/
    ├── MASTER_BRIEF.md        (CANONICAL curriculum source — owner-written)
    ├── PROJECT_STATE.md       (Phase 1 — this file, updated through realignment)
    ├── ARCHITECTURE.md        (Phase 1, updated through realignment)
    ├── CURRICULUM.md          (REALIGNED — verbatim from MASTER_BRIEF.md §12)
    └── AI_INSTRUCTIONS.md     (Phase 1)
```

**Nothing else.** No `content/`, no `java/`, no chapter files, no build files,
no configuration, no dependencies. Directory names appearing in `README.md` §12
and `ARCHITECTURE.md` §3 beyond the tree above are **planned intent only**.

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
2. **No learning content.** Module *metadata* exists; chapters, practice
   problems, interview questions, and code examples do not. Every module is
   `NOT_STARTED` with 0 chapters.
3. **No progress tracking.** `assets/js/progress.js` is a stub with no
   persistence; every figure it returns is a real zero. The only `localStorage`
   key in use is `jfsm.theme`. Phase 4 wires the rest.
4. **Search covers modules and topics only** — the only searchable data that
   exists. The no-results state says so explicitly.
5. **Practice, Interview, Assessments, Projects, and Revision are still
   placeholder views.**
6. **Without JavaScript the site does not navigate at all** — the sidebar and
   all view bodies are built by ES modules. Full no-JS content is not a goal.
7. **`data/modules.js` is generated.** Hand-editing it will be overwritten. Edit
   `docs/MASTER_BRIEF.md`, re-transcribe into `docs/CURRICULUM.md`, then
   regenerate. Nothing enforces this automatically — run
   `node tools/generate-modules.mjs --check`, which guards both hops.
8. **No module has prerequisites recorded**, because the master brief does not
   state any. Navigation therefore cannot gate on prerequisites.
9. **Module descriptions are mechanical topic restatements**, not written
   summaries. They read as "Topics include: …" by design.
10. **No real practice content.** `data/exercises.js` and
    `data/predict-output.js` each hold exactly ONE placeholder, labelled as such
    in the UI and excluded from every count. Phase 4 built shells, not exercises.
11. **Completion is currently manual.** The temporary scaffolding control on the
    module page is the only way to record progress, because no chapters or
    exercises exist to complete. See the scaffolding note above.
12. **Progress is per-browser.** No account system, and no export/import yet —
    clearing site data clears progress.
13. **No code execution.** Run controls in the practice shells are disabled and
    labelled "Phase 5".

---

## Important implementation decisions

Made during Phase 4 (2026-08-12):

28. **One storage gateway.** `assets/js/storage.js` is the only module that
    touches `localStorage`; `theme.js` and `progress.js` both go through it. The
    single exception is the anti-FOUC script inlined in `index.html`, which must
    run before any module loads — documented in both files.
29. **One aggregate progress record**, not a key per module. Resolves the Phase 1
    open question: one read, one write, no key scanning, no half-updated sets.
30. **Two status axes kept separate** — content status (what exists in the repo)
    vs learner status (what the learner did). Conflating them would make
    "NOT_STARTED" ambiguous. `getModuleProgress` returns both.
31. **Two percentages, both honest.** `modulePercent` over 43 modules (a real
    denominator today) and `chapterPercent` over chapters (`0 / 0`). The
    dashboard labels which is which rather than showing one number.
32. **A future-schema record is never overwritten.** If stored data claims a
    newer `schemaVersion`, this build treats the session as having no progress
    rather than destroying data a newer build owns.
33. **Reset preserves the theme.** Clearing study progress should not also flip
    the site's appearance.
34. **The module view is not subscribed to progress changes.** Rendering it
    records a visit, which writes and notifies — subscribing would loop. Only
    the sidebar and the visible dashboard re-render on change.
35. **`recordVisit` is idempotent for an unchanged position**, so re-rendering a
    page does not amplify writes.
36. **Disclosure = one persistent toggle.** Hints, solutions, and predict answers
    keep a single button whose `aria-expanded` tracks state, rather than swapping
    the trigger out — which would strand the state on a detached element.
37. **Placeholders are excluded from counts** via `realExerciseCount()` /
    `realPredictionCount()`, so demo scaffolding can never inflate progress.

Made during the curriculum realignment (2026-08-12):

23. **`docs/MASTER_BRIEF.md` is canonical; `docs/CURRICULUM.md` is a verbatim
    transcription of its Section 12.** The module blocks are byte-identical, and
    `generate-modules.mjs --check` fails if they ever diverge. This closes the
    failure mode that produced the misalignment in the first place: a curriculum
    that lived only in chat history.
24. **`description` is DERIVED, never authored** — `Topics include: <first five
    topics>.`, flagged `descriptionDerived: true`. The brief has no description
    field; writing editorial prose for 43 modules would be fabrication.
25. **`prerequisites` is empty for all 43 modules.** The brief states none, and
    module order is not evidence of a prerequisite. The UI says "Not specified by
    the master brief" rather than implying there are none.
26. **The brief's per-module emphasis is data, not decoration.** `notes` carries
    it verbatim and the module view renders it in a highlighted block, because
    lines like Module 08's "must receive extra depth" are requirements.
27. **Topics are a flat list; no part groupings are invented.** The brief
    presents 43 modules as one ordered sequence, so the curriculum view lists
    them in order rather than inventing section headings.

Made during Phase 3:

16. **`data/modules.js` is GENERATED from `docs/CURRICULUM.md`** by
    `tools/generate-modules.mjs`, rather than hand-written. Hand-copying 43
    modules into JavaScript would create a second source that drifts from the
    curriculum; generation makes divergence detectable (`--check`). This
    resolves open question 3 in `docs/ARCHITECTURE.md` §16.
17. **`tools/` now holds development tooling generally**, not only the Phase 5
    execution helpers it was originally reserved for. Both are "not shipped to
    the browser", which is the distinction that matters.
18. **Module ids are derived from names** — see the Module id convention above.
    This is the decision Phase 4 is most exposed to.
19. **Search indexes registered *sources*, not modules directly.** Adding
    chapter or practice search later means registering a source; scoring,
    rendering, and keyboard handling need no changes.
20. **All rendering goes through `assets/js/dom.js`**, which routes text through
    `textContent`. **No `innerHTML` anywhere in the codebase**, so no data value
    can be parsed as markup regardless of how trusted the source is.
21. **`[hidden] { display: none !important }` is set globally.** The UA
    stylesheet's `hidden` rule loses to any author `display` value, so flex and
    grid containers silently ignore `hidden` — a real bug found in Phase 3
    testing, and a trap for every future component.
22. **The progress stub returns real zeros, not sample data**, and the dashboard
    labels them as such. Percentages guard the 0-of-0 case rather than yielding
    `NaN`.

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
- **The Phase 3 metadata layer and the generator** — extend them; do not replace
  `data/modules.js` with a hand-maintained list, and do not hand-edit it.
- **Module ids and numbers** — permanent keys, locked with the curriculum.
- **The global `[hidden]` rule** — removing it silently breaks every disclosure.
- **The realignment to `docs/MASTER_BRIEF.md`** — the curriculum is canonical as
  transcribed. Do not "restore" the Phase 1 authored modules, and do not edit
  module blocks in `CURRICULUM.md` directly.
- **The progress storage contract** — key namespace, `schemaVersion`, and the
  permanent-id keying. Changing any of it without a migration orphans learner
  progress.
- **The single progress API and the single storage gateway.** Do not add direct
  `localStorage` access anywhere else.
- **The practice/hint/predict data contracts** — extend them additively; real
  exercises must fit them rather than the shells being rewritten per module.

Non-destructive development applies throughout: inspect before overwriting, and
never discard work you did not create (`CLAUDE.md` §8).

---

## Verification status

### Phase 4 — performed 2026-08-12

**Method:** served with `python3 -m http.server` and driven in headless Chromium.
**63 Phase 4 checks passed, 0 failed**, with all earlier suites re-run as
regressions: realignment 33/33, Phase 3 64/64, Phase 2 42/42 — **202 checks
total, all passing.**

| Area | Verified |
|---|---|
| Fresh state | a new browser reads 0%, 0/43 modules, recommends Module 01, and writes **no** progress key until something happens |
| Persistence | marking a module in progress → **survives reload**; marking complete moves overall to 2% (1 of 43); chapters stay honestly 0/0 |
| Permanent-id keying | the stored record is keyed `08-hashing-hashmap-internals`; **every key matches `^\d{2}-[a-z]`** — no index-shaped keys |
| Schema | `schemaVersion: 1` recorded; `startedAt`/`completedAt` timestamps written |
| Position & recent | visiting a module records position and recent activity, and the dashboard renders them |
| Sidebar | status dot and its screen-reader text reflect **stored** state, live-updating without a reload |
| Reset | confirm→accept clears progress, **preserves `jfsm.theme`** (verified dark stayed dark), dashboard returns to 0%, sidebar dot resets; confirm→cancel changes nothing |
| Corrupt storage | malformed JSON, a JSON scalar, `null`, wrong-shaped objects, missing `schemaVersion`, and a future `schemaVersion` **each degrade to empty state with zero console errors** |
| Future schema | a record claiming `schemaVersion: 9999` is left **byte-identical** — not clobbered |
| Storage blocked | `localStorage` throwing on access still renders all 43 modules with no errors |
| Hints | nothing visible before asking; each click reveals **exactly one** more; button advertises "hint 2 of 3"; no further button once exhausted |
| Solutions | hidden by default; one persistent toggle with `aria-expanded` flipping both ways |
| Predict-output | answer hidden by default; reveals and hides via the same toggle |
| Placeholders | both labelled `PLACEHOLDER` in the UI; practice banner states **0 real exercises** |
| Run controls | every one is `disabled` and labelled "Phase 5" |
| Exercise completion | "Mark as solved" writes through the progress API and **survives reload** |
| Regression | 43 modules, search, mobile drawer, theming, and no horizontal scroll at 320–1920px all intact |

**Two real bugs were found by this testing and fixed:** the reveal controls
replaced their own trigger, stranding `aria-expanded` on a detached element (now
one persistent toggle); and the dashboard's "current position" card reused the
`.recommend` component, making it indistinguishable from "recommended next" to
any selector (now carries a modifier class).

### Phase 4 — not verified

- **Not verified because it does not exist:** chapter content, real exercises,
  real predict-the-output questions, assessments, and code execution. The
  `setChapterComplete` and `recordAssessmentScore` paths are exercised only by
  the API, not by real content flowing through them.
- **Not verified because out of scope for this environment:** real mobile
  hardware, touch, Safari, Firefox — all testing was headless Chromium.
- **Not verified:** screen-reader narration of the hint ladder and disclosure
  toggles with an actual screen reader; measured contrast ratios for the new
  learner-status and danger colours.
- **Not verified:** `localStorage` quota-exhaustion behaviour. Writes are
  wrapped and return `false` on failure, but a genuinely full quota was not
  simulated end to end.
- **Not verified:** progress surviving a real browser restart (as opposed to a
  page reload) or behaviour across multiple tabs writing concurrently.
- **No Java code was compiled or run — not verified because none was produced.**

---

### Curriculum realignment — performed 2026-08-12

**Method:** served with `python3 -m http.server` and driven in headless
Chromium. **33 realignment checks passed, 0 failed**, plus both earlier suites
re-run as regressions: **Phase 3 at 64/64** and **Phase 2 at 42/42**.

| Area | Verified |
|---|---|
| Transcription | `CURRICULUM.md` module blocks are **byte-identical** to `MASTER_BRIEF.md` §12; all 49 brief sections (0–48) present; 43 modules numbered 01–43 |
| Metadata | exactly 43 modules; ids unique; all `NOT_STARTED`; all `chapterCount` 0; all `prerequisites` empty; all descriptions flagged derived; 848 topics with **no mid-sentence truncation** and no markdown leftovers |
| Chain integrity | `generate-modules.mjs --check` verifies **both** hops and exits non-zero on drift |
| Sidebar | 43 realigned names, matching `data/modules.js` exactly; spot-checked 08, 02, 07, 10, 18, 20, 21, 22, 23, 24, 25, 32, 42 |
| Routes | **all 43 module routes resolve**; unknown ids still 404 |
| Module 08 | renders "Hashing & HashMap Internals" with its **extra-depth requirement shown**, 31 topics, 0 chapters |
| Emphasis | Module 14's JVM-spec-vs-HotSpot and Module 30's JPA-vs-Hibernate notes render; Module 42 lists all **7 named projects** |
| Dashboard | 7 sections, 0%, 43 rows, recommends Module 01; **no non-zero percentage anywhere** |
| Search | finds `hashmap`, `sliding window`, `dijkstra`, `backtracking`; ranks Module 08 first for "08"; results labelled by source type; no-results handled; navigation works |
| Phase 2/3 behaviour | theme persistence, mobile drawer with 43 modules, drawer-closes-on-selection, no horizontal scroll at 320–1920px, no console errors |

**Two real bugs were found by this work and fixed:** the generator's block
extractor had no upper bound, so the last module swallowed the brief's Sections
13–48 (and later the curriculum's appendices) — caught by the new `--check`
guard, which correctly refused to write; and the flat topic list rendered
single-column because CSS multi-column has no effect on a flex container.

### Realignment — not verified

- **Not verified because it does not exist:** chapter content, practice,
  interview questions, execution, progress persistence.
- **Not verified because out of scope for this environment:** real mobile
  hardware, touch, Safari, Firefox — all testing was headless Chromium.
- **Not verified:** screen-reader narration; measured contrast ratios.
- **Not verified:** that the transcription matches the owner's *intent* beyond
  byte-equality with the supplied text. Fidelity to the supplied brief is
  machine-checked; whether the brief itself is what the owner wants is theirs
  to judge.
- **No Java code was compiled or run — not verified because none was produced.**

---

### Phase 3 — performed 2026-08-12

**Method:** served with `python3 -m http.server` and driven in headless Chromium
via Playwright. **64 automated checks, 64 passed, 0 failed.** The Phase 2 suite
was re-run as a regression check: **42/42 passed.** Screenshots were captured
and reviewed at desktop and mobile, in both themes.

| Area | Checks that passed |
|---|---|
| Metadata-driven sidebar | 43 modules render; numbered 01–43 in order with no gaps or duplicates; ids unique; **sidebar content matches `data/modules.js` exactly** (asserted against the data file, not a hardcoded copy); status indicator on every row with a text equivalent, not colour alone |
| Expand / collapse | chapter regions start collapsed; `aria-expanded` tracks state both ways; **empty state reads "No chapters yet"**; **zero chapter links are invented**; Curriculum section collapses and re-expands |
| Module routes | `#/module/<id>` resolves to the overview; **all 43 routes verified individually**; correct link marked `aria-current`; document title tracks the module; unknown module id falls through to not-found; Module 43 renders all 42 prerequisite links |
| Dashboard | all seven sections render; overall progress reads 0%; chapter/module stats are real zeros (`0 / 0`, `0 / 43`); practice and assessments `0 / 0`; empty states for position and recent; all 43 rows in per-module progress; recommended-next is Module 01; **no non-zero percentage appears anywhere on the page** |
| Curriculum view | 6 parts, 43 module cards, part titles from metadata |
| Search | results for `hashmap`; every result labelled with its source type; multi-word queries AND their tokens; a bare number ranks that module first; no-results state shown and explains coverage; empty query hides the panel; clicking a result navigates and clears the field; ArrowDown activates, Enter opens, Escape closes |
| Phase 2 behaviour intact | theme persistence across reload; placeholder views still route; drawer opens/closes at mobile width with all 43 modules reachable; focus moves into the drawer; choosing a module closes the drawer and routes |
| Overflow | no horizontal page scroll at 320/390/768/1024/1280/1920px across dashboard, curriculum, and module views |
| Code hygiene | zero unused CSS classes; zero undefined or unreferenced custom properties; all three theme blocks carry identical 25-token sets; `generate-modules.mjs --check` reports in sync |

**Three real bugs were found by this testing and fixed:**

1. **`hidden` was being ignored on flex containers.** `.module-list` sets
   `display: flex`, which outranks the UA stylesheet's `[hidden]` rule, so the
   Curriculum section would not collapse. Fixed globally with
   `[hidden] { display: none !important }` — it would have hit every future
   flex/grid disclosure.
2. **Topic text was silently truncated.** `CURRICULUM.md` wraps long bullets
   across lines, and the generator captured only the first line, so items ended
   mid-sentence ("…`Map` as a"). Fixed by joining continuation lines; caught by
   reading a rendered screenshot, not by an assertion.
3. **Module 43's prerequisites parsed as `["01","42"]`** instead of all 42
   modules, because "All of Modules 01–42" was read as a number list. Fixed by
   handling the range form explicitly.

### Phase 3 — not verified

- **Not verified because it does not exist:** chapter content, practice
  problems, interview questions, code execution, and progress *persistence*
  (`progress.js` is a stub by design — its zeros were verified, its future
  localStorage behaviour cannot be).
- **Not verified because it is out of scope for this environment:** real mobile
  hardware, touch gestures, iOS/Android browsers, Safari, and Firefox. All
  testing was headless Chromium at mobile viewport sizes, which is not the same
  as testing on a device.
- **Not verified:** screen-reader narration with an actual screen reader. ARIA
  attributes, roles, and focus order were asserted programmatically; how
  NVDA/JAWS/VoiceOver speak the 43-row tree and the search combobox was not
  observed.
- **Not verified:** colour-contrast ratios against WCAG thresholds, including
  the five new status colours in both themes.
- **Not verified:** search behaviour at content scale. The index holds 1,623
  entries today and is built synchronously on first query; that was fast in
  testing but was not measured, and chapter content will grow it substantially.
- **No Java code was compiled or run — not verified because this phase produced
  no Java code.**

---

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
| 2026-08-12 | 4 | Replaced the progress stub with real `localStorage` persistence: `assets/js/storage.js` (single storage gateway) and a rewritten `assets/js/progress.js` (single progress API, `schemaVersion: 1`, keyed on permanent module ids, defensive against corrupt/blocked/future-version storage, reset that preserves the theme). Wired real progress into the dashboard, sidebar, curriculum, and module views, with change notification. Added the practice/hint/predict-output shells (`practice-view.js`, `exercise-shell.js`, `predict-shell.js`) plus their data contracts (`data/exercises.js`, `data/predict-output.js`) holding one labelled placeholder each. Added a clearly-tagged temporary manual completion control. Verified in-browser: 63/63 Phase 4 checks and 202 total across all suites; two real bugs found and fixed. No real exercises, no chapters, no code execution. |
| 2026-08-12 | realign | Added `docs/MASTER_BRIEF.md` (verbatim, owner-supplied) as the canonical curriculum source. Rewrote `docs/CURRICULUM.md` as a byte-identical transcription of its Section 12, replacing the Phase 1 authored curriculum — only 2 of 43 names had matched. Regenerated `data/modules.js` (43 modules, 848 topics, 19 emphasis notes, 7 project subsections); 41 of 43 module ids changed. Adapted the module, curriculum, and search views to the flat topic shape. `description` derived mechanically; `prerequisites` left empty — neither invented. Verified in-browser: 33/33 realignment, 64/64 Phase 3, 42/42 Phase 2. |
| 2026-08-12 | 3 | Locked the curriculum (owner confirmation recorded in `CURRICULUM.md` Appendix B). Added the module metadata layer: `data/modules.js`, generated from `docs/CURRICULUM.md` by `tools/generate-modules.mjs`. Rebuilt the sidebar from metadata (43 modules, collapsible, empty chapter regions), added the dashboard structure reading a progress stub, the curriculum and module-overview views, and functional module/topic search. Verified in headless Chromium: 64/64 Phase 3 checks and 42/42 Phase 2 regression checks; three real bugs found and fixed. No progress persistence, practice UI, or code execution — those remain Phases 4–5. |
| 2026-08-12 | 2 | Built the website shell: `index.html` plus `assets/css/{base,theme,layout}.css` and `assets/js/{app,theme,nav}.js`. App shell layout, light/dark theming with persistence and no flash, responsive drawer navigation, and a hash-routing scaffold. Verified in headless Chromium: 42/42 checks passed; two real bugs found and fixed. Updated `docs/ARCHITECTURE.md` (§2, §3, §10, §12, §14, §15, §16) and `README.md`. No module content, search, progress tracking, or execution — those remain later phases. |
