# PROJECT_STATE.md — Authoritative Current Status

> **This file must always reflect current reality.** It is the first thing any
> agent trusts, so a stale entry here is an active hazard. Update it after every
> meaningful unit of work.
>
> **The filesystem outranks this file.** If the repository disagrees with
> anything below, the repository is correct — fix this document and say that you
> fixed it.

**Last updated:** 2026-08-13 (CONTINUE #4 — Module 01, Chapter 4 — **Module 01 complete**)

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
| **Project phase** | **CONTENT — one chapter at a time via `CONTINUE`.** Foundation complete (all 6 phases); CONTINUE #1–#4 delivered. **Module 01 is the first complete module.** |
| **Current module** | `01-java-foundations-execution-model` — **`VERIFIED`** (4 of 4 planned chapters written and verified) |
| **Current chapter** | `01-04` *Program Entry, Output, and Structure* — `VERIFIED`. All four chapters of Module 01 are `VERIFIED`. |
| **Completed modules** | **1 of 43** — Module 01 has all four planned chapters written and verified. (This is *content* status; learner completion is separate and per-browser.) |
| **Completed chapters** | 4 written and verified (`01-01` … `01-04`). No learner has completed anything — that is per-browser. |
| **Partially completed work** | none — Module 01 is complete. Modules 02–43 are `NOT_STARTED` and have no chapter plan recorded yet; each module's plan is written when its first chapter is authored. |
| **Next required task** | **Next `CONTINUE`** → begin **Module 02, `02-oop-in-java`**. No chapter plan exists for it yet: the first CONTINUE on a module reads that module's topic list in `docs/CURRICULUM.md`, decides the chapter split, records it in `PLANNED_CHAPTERS` (`data/chapters.js`), and then writes chapter `02-01` only. Confirm from the repository first; build ONE chapter; then STOP. |
| **Completed website features** | app shell; light/dark theming with persistence and no flash; responsive drawer navigation; hash routing with active state; metadata-driven sidebar listing all 43 modules; module overview and curriculum views; functional module/topic search; **real `localStorage` progress persistence**; **dashboard wired to stored progress**; **practice / progressive-hint / predict-the-output UI shells**; **editable code editor with Run, Reset and Copy**; **provider-agnostic Java execution abstraction**; **always-present local `javac`/`java` fallback derived from the actual source**; **chapter routing, rendering and per-chapter completion**; **module-local previous/next chapter navigation** |
| **Compiler integration status** | **Architecture implemented; NO online provider enabled.** Editor, `executeJava()` abstraction, Piston + Judge0 adapters, and the local `javac`/`java` fallback all exist. `provider: null` is the shipped default and a permanently supported mode. No HTTP request has ever been made to a live provider from this repository — see [Phase 5 — provider research](#phase-5--provider-research-performed-2026-08-13). |
| **Known bugs** | none |
| **Learning content** | **4 chapters** — all of Module 01 — with 24 exercises and 22 predict-the-output questions. The other 42 modules are `NOT_STARTED`. Chapters live in `data/chapters.js` + `content/`; `data/modules.js` carries no chapter fields (see ARCHITECTURE §4a). |
| **Known limitations** | see [Known limitations](#known-limitations) below |
| **Last verification status** | **2026-08-13 — 491 checks passing, 0 failing.** 38/38 Chapter 01-04, 39/39 Chapter 01-03, 38/38 Chapter 01-02, 60/60 Chapter 01-01, 53/53 Phase 6 foundation, 32/32 Phase 5, 28/28 Java source-analysis, 63/63 Phase 4, 65/65 Phase 3, 33/33 realignment, 42/42 Phase 2. **Every Java example and reference solution across all four chapters was compiled with `javac --release 17` and run on OpenJDK 21.0.10 from a clean directory**, and every recorded output is real. See [Verification](#verification-status). |
| **Last updated** | 2026-08-13 |

---

## Phase status

| Phase | Scope | Status |
|---|---|---|
| **1** | Documentation layer (`README.md`, `CLAUDE.md`, `docs/*`) | `CONTENT_COMPLETE` — see [Verification](#verification-status) |
| **2** | Website shell — HTML/CSS/JS, navigation, dark/light mode, responsive layout | `VERIFIED` — built and exercised in a real browser |
| **3** | Dashboard + 43-module metadata layer + search foundation | `VERIFIED` — built and exercised in a real browser |
| **4** | Progress tracking (localStorage) + practice / hint / predict-output UI shells | `VERIFIED` — built and exercised in a real browser |
| **5** | Java execution architecture — editor UI, execution-service abstraction, online adapter seam, local fallback | `VERIFIED` — built and exercised in a real browser; **no online provider enabled or verified** |
| **6** | Full foundation verification, documentation-truth audit, Foundation Report | `VERIFIED` — 52/52 consolidated checks; two false documentation claims found and corrected |

All six foundation phases are complete. **What comes next is not a phase** —
it is the per-chapter `CONTINUE` workflow (master brief §41). Each phase above
was specified by the project owner in due course; the scope recorded is what was
actually instructed, not inferred.

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

Verified by direct inspection on 2026-08-13 (after CONTINUE #1):

```
Java_mastery/
├── index.html                 (Phase 2 shell, extended Phase 3)
├── README.md                  (Phase 1, updated Phases 2–3)
├── CLAUDE.md                  (Phase 1)
├── assets/
│   ├── css/
│   │   ├── base.css           (Phase 2, extended Phase 3)
│   │   ├── theme.css          (Phase 2, status colours Phase 3)
│   │   └── layout.css         (Phase 2, components Phases 3/4/5)
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
│       ├── predict-shell.js   (Phase 4 — predict-the-output)
│       ├── code-runner.js     (Phase 5 — editor, output panel, local fallback)
│       ├── chapters.js        (CONTINUE #1 — the only accessor over data/chapters.js)
│       ├── chapter-view.js    (CONTINUE #1 — renders a chapter from its data)
│       └── execution/         (Phase 5 — provider-agnostic Java execution)
│           ├── config.js      (THE single config point; NO credential field)
│           ├── result.js      (STATUS, baseResult, postJson)
│           ├── service.js     (executeJava() — the one entry point)
│           ├── java-source.js (file name / run target / package from source)
│           └── providers/
│               ├── piston.js  (self-hosted Piston — never contacted a live instance)
│               └── judge0.js  (self-hosted Judge0 — never contacted a live instance)
├── content/                   (AUTHORED chapter content, no markup)
│   └── modules/module-01/
│       ├── 01-01-from-source-to-running-program.js
│       ├── 01-02-jvm-architecture-class-loading.js
│       ├── 01-03-the-execution-engine.js
│       └── 01-04-program-entry-output-and-structure.js
├── java/                      (sources actually compiled and run)
│   ├── module-01/ch01/        HelloJava, Greeter, UseGreeter + solutions/
│   ├── module-01/ch02/        10 sources incl. CorruptClass + solutions/
│   ├── module-01/ch03/        Warmup, Hello, Deoptimization + solutions/
│   └── module-01/ch04/        10 sources incl. pkgdemo/ + solutions/
├── data/
│   ├── modules.js             (GENERATED from CURRICULUM.md — no chapter fields)
│   ├── chapters.js            (CONTINUE #1 — chapter manifest + PLANNED_CHAPTERS)
│   ├── exercises.js           (Phase 4 contract; +starterCode/stdin Phase 5)
│   └── predict-output.js      (Phase 4 — contract + 1 labelled placeholder)
├── tools/
│   └── generate-modules.mjs   (dev tool, not a build step; --check guards both hops)
└── docs/
    ├── MASTER_BRIEF.md        (CANONICAL curriculum source — owner-written)
    ├── PROJECT_STATE.md       (Phase 1 — this file, updated through realignment)
    ├── ARCHITECTURE.md        (Phase 1, §11 rewritten Phase 5)
    ├── CURRICULUM.md          (REALIGNED — verbatim from MASTER_BRIEF.md §12)
    └── AI_INSTRUCTIONS.md     (Phase 1)
```

**Nothing else.** No build files, no configuration, no dependencies, no CI.
`content/` and `java/` exist now but hold exactly one chapter's worth of
material — 1 chapter of 43 modules.

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
2. **One module of 43 is written.** Module 01 is complete — four chapters,
   verified. Modules 02–43 are `NOT_STARTED` and have metadata only. Module *metadata* exists for all 43, but metadata is a coverage
   specification, not teaching. The other 42 modules are `NOT_STARTED`.

3. **Progress records position, not achievement.** Persistence is real
   (Phase 4), but with no chapters or exercises in the repository the only
   thing a learner can record is which module they opened and a manually set
   status. Every completion figure is a real zero because there is nothing to
   complete yet — not because the store does not work.
4. **Search covers modules and topics only** — the only searchable data that
   exists. The no-results state says so explicitly.
5. **Interview, Assessments, Projects, and Revision are still placeholder
   views.** Practice is no longer one — it renders working exercise, hint,
   predict-the-output and code-runner shells (Phases 4–5) over labelled
   placeholder data.
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
13. **No online code execution provider is enabled.** The architecture,
    editor, adapters and local fallback all exist, but `provider: null` ships as
    the default because no provider could be verified as free, keyless and
    browser-callable on 2026-08-13. This is a supported permanent mode, not a
    gap: every snippet carries exact local `javac` / `java` commands, and the
    platform is fully usable without a provider.

14. **Neither online adapter has ever contacted a live instance.** Both follow
    wire formats read from the providers' live documentation. The sandbox this
    was built in blocks outbound connections to those hosts, so the first run
    against a real instance is the real test.

15. **CORS is unverified for every provider**, and cannot be verified except
    from a real browser talking to a real instance.

16. **Online execution is single-file.** Multi-file and Maven-project examples
    cannot run through either adapter; the local fallback covers them.

17. **The verification suites are not committed to this repository.** Every
    figure in [Verification](#verification-status) was produced by Playwright
    suites held outside the repo in the authoring environment. A fresh session
    therefore **cannot re-run them** and must treat the recorded totals as a
    historical record, not something reproducible from a clone. Re-establishing
    them in-repo is unfinished work, deliberately not done during Phase 6
    because that phase was scoped to verification and documentation only.

18. **No automated test or CI runs on push.** There is no CI configuration in
    the repository; verification is manual and agent-driven.

19. **Chapter content is only as portable as the machine it was verified on.**
    Every transcript in Module 01 Chapters 1–4 was captured on Linux with
    OpenJDK 21.0.10. Chapter 2's loader names and Chapter 3's tiers, compiler
    output and every timing are HotSpot specifics on one shared 4 vCPU machine. Paths use `/`, and classpath examples use `:` rather than the `;`
    Windows needs. The chapter says so where it matters, but a Windows learner
    will have to translate.

20. **Search does not index chapters.** `assets/js/search.js` still covers
    modules and topics only. It was built around registered sources so a chapter
    source can be added without a rewrite, but that has not been done — searching
    for a phrase inside a chapter finds nothing today.

---

## Important implementation decisions

Made during CONTINUE #1 — Module 01 Chapter 1 (2026-08-13):

51. **Chapters are NOT generated.** `data/modules.js` no longer carries
    `chapterCount` or `chapters`, and the generator refuses to emit them. The
    curriculum specifies what a module must cover, not how it divides into
    chapters, so a generated `0` would have become false the moment a chapter
    was written. `data/chapters.js` owns chapters instead.
52. **Chapter ids are `NN-MM` and permanent**, for the same reason module ids
    are: `localStorage` progress keys on them.
53. **Chapter content loads lazily** via dynamic `import()`, with metadata
    loaded eagerly. Rendering a sidebar must not download the curriculum.
    Resolves the ARCHITECTURE §4 open question about per-chapter vs bundled.
54. **Chapter files contain no markup.** Typed sections rendered by
    `chapter-view.js`, so restyling is one change and a chapter cannot break the
    page with bad HTML.
55. **Unknown section types are skipped with a warning**, not thrown on. A
    content file written against a newer vocabulary should lose a section, not
    the page.
56. **Inline formatting is a tokenizer, not a regex.** Bold may contain code;
    code keeps asterisks literal. A regex alternation cannot express that
    one-way nesting and rendered bold-wrapped code with visible backticks.
57. **A chapter never marks its module COMPLETED**, only IN_PROGRESS — finishing
    every authored chapter is not finishing the module while chapters remain
    unwritten.
58. **Planned-but-unwritten chapters are shown**, as inert unlinked rows, so a
    module's shape is honest without implying content exists. The plan is
    recorded in `PLANNED_CHAPTERS` when the module's first chapter is authored.
59. **Chapter navigation is module-local.** "Next" stops at the module boundary
    rather than skipping the next module's overview.
60. **The code runner is Java-only.** Shell transcripts render as static
    copyable blocks — a Run button would compile them as Java, and the local
    `javac` commands would be nonsense for them.
61. **Every output in a chapter is captured from a real run.** The chapter file
    records the JDK and date, and its rendered "How this chapter was verified"
    block shows the learner what was and was not executed.
62. **The sidebar's progress note is derived from the chapter count**, not
    hardcoded — the phase labels drifted twice, and this removes that class of
    staleness for good.

Made during Phase 5 (2026-08-13):

38. **`executeJava()` never rejects.** A compiler error, a dead provider and an
    infinite loop are all *results*, because to a learner they are all just
    outcomes of pressing Run. Rejecting would push provider plumbing into every
    call site — exactly the coupling the abstraction exists to prevent.
39. **`providerUnavailable` is a field, not just a status.** The UI must be able
    to say "this is a configuration problem, not your code" without enumerating
    provider failure modes. Telling a learner their correct program failed would
    be the worst defect this platform could ship.
40. **The config file has no credential field at all.** It is served verbatim to
    every visitor, so a key placed in it is published. A keyed provider can only
    be reached by pointing `baseUrl` at the minimal proxy in ARCHITECTURE §11.7.
41. **Both adapters target self-hosted instances**, where authentication is off
    by default — so no secret exists to leak.
42. **No provider ships enabled.** Researched against live docs on 2026-08-13;
    none was verifiably free, keyless and browser-callable. `provider: null` is
    a permanently supported mode, not a placeholder awaiting completion.
43. **Judge0's `language_id` and numeric `status.id` table are deliberately not
    hardcoded.** Both differ between versions and instances; a constant would
    silently run the wrong language somewhere. The adapter reads the
    human-readable `status.description` and config carries the id.
44. **The file name is derived from the source, not assumed to be `Main.java`.**
    A public top-level type must live in a file named after it, so a fixed name
    breaks every example whose class is not `Main` — with a compiler error the
    learner did not write. Comments and string/text-block literals are stripped
    first so a `// public class Ghost` cannot win.
45. **The local `javac` / `java` panel is always present**, not gated on a
    failure. Running locally is the primary path this curriculum teaches (master
    brief §17); revealing it only when something breaks would invert that.
46. **Reset restores the starter code, never the reference solution.** Otherwise
    one keystroke becomes the answer and the hint ladder is pointless.
47. **The predict shell allows running before the answer is revealed.** Predict,
    then run, then compare — the gap between the two is the learning. What stays
    hidden is the written answer and its explanation.
48. **`starterCode` and `stdin` were added to the exercise contract additively.**
    Every Phase 4 exercise stays valid; an exercise without `starterCode` simply
    renders no editor.
49. **Execution adapters live under `assets/js/`, not `tools/`.** Phase 1 had
    reserved `tools/` for them, but they ship to the browser; `tools/` is for
    development tooling that is never served. Recorded in ARCHITECTURE §3.
50. **Tab indents in the editor, Escape releases the next Tab to navigation.**
    Tab-to-indent is expected in a code editor but would trap keyboard users;
    the escape hatch is announced in visible text under the editor.

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

### CONTINUE #4 — Module 01 Chapter 4 (performed 2026-08-13)

**38/38 browser checks passed**; all suites re-run green: **491 total, 0
failing.** This chapter completes Module 01 — the first module with every
planned chapter written and verified.

**Java verified by execution.** Every program recompiled from a clean directory
with `javac --release 17` on OpenJDK 21.0.10 and run.

| Demonstrated | Verified result |
|---|---|
| `main` forms accepted | `String[]`, `String...`, `String args[]`, and extra modifiers all launch |
| `main` forms rejected | Four failures, only **three** distinct messages — *not found*, *is not static*, *must return void*. All four **compile** |
| `strictfp` on Java 17+ | `warning: … 'strictfp' is not required` |
| `println(char[])` | prints `Java`; `int[]` and `String[]` print `[I@…` / `[L…;@…`; the same array concatenated prints `[C@…` |
| Overload resolution | `javap -c` shows `([C)V`, `(Ljava/lang/Object;)V` ×2, `(Ljava/lang/String;)V` |
| `java.lang.System` | `public static final PrintStream out;` **and** `setOut(PrintStream)` |
| `System.setOut` | works despite `final`; capture-and-restore verified |
| `PrintStream` | swallows `IOException`; `checkError()` returns the flag |
| Stream separation | `2>/dev/null` and `2>&1 >/dev/null` isolate each stream |
| Exit status | 0 returning, 3 from `System.exit(3)`, **1** from an uncaught throw (trace on stderr) |
| Package layout | `-d` builds it; a mismatched directory compiles but fails with `ClassNotFoundException` |
| Imports | **identical bytecode** across none / explicit / wildcard; sizes differ only by class-name length |
| Import ambiguity | `error: reference to List is ambiguous` — resolved by a single-type import |
| Wildcard depth | `java.util.*` does not reach `java.util.concurrent.locks` |
| Naming conventions | not enforced by `javac` at all — no error, no warning |

**A structural change this chapter forced.** Module 01 becoming complete would
have made the generated `status: 'NOT_STARTED'` in `data/modules.js` a false
claim. That field is now **removed from the generator entirely**, alongside the
chapter fields removed during CONTINUE #1, and module content status is
**derived** by `moduleContentStatus()` in `assets/js/chapters.js`:

- no chapters → `NOT_STARTED`
- some written, or a plan not yet fulfilled → `IN_PROGRESS`
- every planned chapter written and `VERIFIED` → `VERIFIED`
- every planned chapter written, not all verified → `CONTENT_COMPLETE`

The generator now refuses to emit `status`, `chapterCount` or `chapters` at all.
The principle is the one established in ARCHITECTURE §4a: **the curriculum
describes what a module must cover and knows nothing about what has been
written**, so no authored-state field may be generated from it.

**One real content bug found and fixed.** The dashboard banner still read "no
chapters, exercises, or assessments have been written yet" — false since
CONTINUE #1, and caught only because a test assertion happened to print it. It
is now derived from the chapter and exercise counts, like the sidebar footer.

**A test assertion was wrong, not the content.** The chapters' "no literal `**`
leaked" check failed on `char** argv` — correct C++ pointer syntax inside a code
span, which is exactly what code spans are for. The assertion in all four
chapter suites now measures **prose only**, with `code` and `pre` elements
stripped, which is the actual invariant. One genuine leak was fixed alongside
it: backticks in a `realError` field, which renders raw.

### CONTINUE #4 — not verified

- **Windows.** Not verified because: only Linux was available. Path separators,
  the `;` classpath separator, and console encoding all differ, and the chapter
  says so rather than implying otherwise.
- **Preview instance-`main` forms** introduced after the Java 17 baseline were
  not exercised. The chapter documents only what the baseline requires.
- **Other JVM implementations** — the launcher error wording is HotSpot's.
- **Real devices, other browsers, screen-reader narration, measured colour
  contrast** — unchanged from Phase 6.

---

### CONTINUE #3 — Module 01 Chapter 3 (performed 2026-08-13)

**39/39 browser checks passed**; all prior suites re-run green: **453 total, 0
failing.**

This is a performance-adjacent chapter, so the no-fabrication rule
(`AI_INSTRUCTIONS.md` §4) governed it more tightly than any chapter so far.
**Every timing in it was actually measured**, and each is published with the
hardware, JDK, workload and run count beside it.

**Measurement environment:** 4 vCPU Intel Xeon @2.80GHz, 16 GB, Linux
container, OpenJDK 64-Bit Server VM 21.0.10, tiered compilation at defaults.

| Measurement | Result | Method |
|---|---|---|
| Warm-up curve | batch 1 ≈10,224 us → steady ≈7,700 us | 12 batches × 20,000 calls, reproduced across 2 runs |
| Steady state, tiered (default) | 7,757 / 7,822 / 7,772 us | batch 12 of 12, 3 runs |
| Steady state, C1 only | 14,564 / 15,711 / 14,653 us — ≈1.9× slower | `-XX:TieredStopAtLevel=1` |
| Steady state, `-Xcomp` | 7,386 / 7,401 / 7,417 us — ≈0.95× | 3 runs |
| Steady state, `-Xint` | 59,406 / 56,006 / 56,205 us — ≈7.2× slower | 3 runs |
| Startup, default / `-Xint` / `-Xcomp` | ≈39 ms / ≈37 ms / ≈1,300 ms | wall clock, 5 runs each |
| Call-site shape | mono 36,511, bi 36,508, mega 74,155 us | best-of-5 after 50 warm-up rounds |

**Behaviour verified by observation, not assertion:**

- `java -version` reports the execution mode literally — `mixed mode`,
  `interpreted mode` under `-Xint`, `compiled mode` under `-Xcomp`.
- `-XX:+PrintCompilation` shows `Warmup::work` reaching tier 3, then tier 4 by
  on-stack replacement (`%`, `@ 4`), then a normal tier-4 compilation, then the
  tier-3 version `made not entrant`.
- Introducing a second implementation at a monomorphic call site retires the
  tier-4 method **immediately** after the phase marker prints, then recompiles
  it by OSR and then normally.
- `-Xlog:deoptimization=debug` names the reasons — `predicate` and
  `profile_predicate`. Plain `-Xlog:deoptimization` prints nothing; the detail
  is at debug level.
- This JVM exposes **533** `-XX` flags; `Tier3CompileThreshold=2000`,
  `Tier4CompileThreshold=15000`.

**Two honesty records kept in the chapter rather than tidied away:**

1. **A prediction that was wrong.** `-Xcomp` was expected to be *worse* in
   steady state, on the reasoning that eager compilation denies C2 profile
   data. Measured, it was ~5% *faster* for this workload. The chapter records
   the prediction, the result, and the fact that the profiling argument was not
   tested rather than restating it as established.
2. **An experiment that did not reproduce.** A planned untaken-branch
   deoptimisation demo produced **zero** deopt events across 5 runs. It was
   removed from the exercises (which need reliable outcomes) and recorded in the
   chapter as a failed experiment, because "JIT behaviour is emergent — reason,
   then check" is the more useful lesson.

**One real layout bug found and fixed.** At 360px the page overflowed by 82px.
The cause was an inline `<code>` span containing a long unbreakable identifier
(`jdk.internal.misc.Unsafe::getReferenceVolatile`) — browsers will not break on
`.` or `:`. Fixed in `base.css` with `:not(pre) > code { overflow-wrap: anywhere }`,
scoped so block code still scrolls rather than reflowing. This affected all
chapters; earlier ones simply had no identifier long enough to expose it.

**Nine assertions in `verify-ch0102.mjs` were rewritten to derive their counts**
from the data files, the same treatment applied to the other suites during
CONTINUE #2. Every chapter suite is now count-agnostic.

### CONTINUE #3 — not verified

- **Any machine but this one.** All timings are from a single shared,
  virtualised 4 vCPU container. A clean-room re-run during final verification
  produced figures 15–20% higher across the board while the **ratios held** —
  which is the chapter's own caveat demonstrated, and why only shapes are
  claimed.
- **Other JVM implementations.** Tiers, C1/C2, `-XX:+PrintCompilation`,
  `-Xlog:deoptimization` and every flag used are HotSpot specifics, not Java
  specification. The chapter says so explicitly.
- **Whether profiling earns its keep on complex code.** The `-Xcomp` result
  contradicted the prediction on a trivial workload; polymorphic,
  branch-heavy code was not tested and no claim is made.
- **Rigorous benchmarking.** Nothing here used JMH. `System.nanoTime` around a
  loop is adequate to show a 7× difference and inadequate for anything subtle;
  the chapter defers to Module 41 rather than pretending otherwise.
- **Real devices, other browsers, screen-reader narration, measured colour
  contrast** — unchanged from Phase 6.

---

### CONTINUE #2 — Module 01 Chapter 2 (performed 2026-08-13)

**38/38 browser checks passed**, and all prior suites re-run green: **414 total,
0 failing.**

**Java verified by execution.** Every program was recompiled from a clean
directory with `javac --release 17` on `javac 21.0.10` / OpenJDK 21.0.10 and run;
the outputs recorded in the chapter are the outputs observed.

| Source | Demonstrates | Verified result |
|---|---|---|
| `LazyLoading.java` | Lazy loading | `NeverUsed` never appears in `-verbose:class`; declaring a reference does not load |
| `Loaders.java` | Loader hierarchy | bootstrap `null`, `PlatformClassLoader`, `AppClassLoader`; delegation chain walks to `null` |
| `Preparation.java` | Preparation vs initialization | a field reads `0` while another initializer runs; `javap` shows one merged `<clinit>` |
| `InitTriggers.java` | Active use | constants, array creation and inherited-field access do **not** initialize; the bytecode shows no reference to the constant's class |
| `InitFailure.java` | Erroneous classes | `ExceptionInInitializerError` once, then `NoClassDefFoundError`, initializer not re-run |
| `ForNameVsLoadClass.java` | Load vs initialize | `loadClass` and 3-arg `forName(…, false, …)` do not initialize; 1-arg `forName` does |
| `ClassLiteral.java` | Class literals | `Sub.class` does not initialize; `new Sub()` initializes `Sup` then `Sub` |
| `CorruptClass.java` + `Tiny.java` | The linking phases | `ClassFormatError`, `UnsupportedClassVersionError`, and `VerifyError` with a full frame and bytecode dump |
| `Config.java` + `UsesConfig.java` | Constant inlining | source says 60, program prints 30 after a partial rebuild |
| `solutions/*.java` | Four exercise solutions | all compiled and run |

**Facts established by execution rather than asserted:**

- Reading a compile-time constant does **not** initialize its class, and
  `javap -c` shows the constant folded into a string literal with no reference
  to the class remaining.
- `static final Integer` **is** initialized — boxing makes it a non-constant.
- Creating an array of a type does not initialize that type.
- Reading an inherited static field initializes the **declaring** class only.
- A class literal (`Sub.class`) does not initialize.
- Implementing an interface initializes it **only if** the interface declares a
  default method — verified with a matched pair of interfaces.
- A simple-name forward read of a static field is a compile error
  (`illegal forward reference`); a qualified read compiles and yields the
  prepared default.
- **`UnsupportedClassVersionError` was reproduced here**, which Chapter 1 had
  recorded as not verified — corrupting the version byte produces it on a single
  JDK.
- On Java 9+, declaring a class in `java.lang` fails at **compile** time
  (`package exists in another module: java.base`), before parent delegation is
  even reached.

**One content defect found and fixed in verification.** Backticks appeared
literally in three places where the renderer intentionally does not apply inline
formatting — two Java source comments and one guided-lab `expected` string, all
rendered raw inside `<pre>`. The content was corrected (the renderer is right to
leave command and code blocks untouched), and the repository's Java sources were
edited to match so the chapter and the files it cites cannot diverge.

**Sixteen assertions across four earlier suites were rewritten to DERIVE their
counts** from `data/chapters.js`, `data/exercises.js` and `data/predict-output.js`
rather than hardcoding them. Authoring Chapter 2 broke them all at once, which
would recur on every future chapter; they now assert the relationships (written
chapters get links, planned ones do not, denominators are real) instead of
specific numbers.

### CONTINUE #2 — not verified

- **Other JVM implementations.** Not verified because: only HotSpot/OpenJDK was
  available. Class-loading behaviour is specified, but loader class names,
  `-verbose:class` output and the class-data-sharing archive are HotSpot
  specifics and the chapter labels them as such.
- **Custom class loaders** are named as Module 12's subject and not demonstrated.
- **Thread safety of `<clinit>`** is mentioned as a JVM guarantee and
  cross-linked to Module 15, but no concurrent test was written.
- **The `348` byte offset** used for the `VerifyError` demonstration is specific
  to this build of `Tiny.java`; the chapter and the source README both say how to
  find it again rather than presenting it as a constant.
- **Real devices, other browsers, screen-reader narration, measured colour
  contrast** — unchanged from Phase 6; still not verified.

---

### CONTINUE #1 — Module 01 Chapter 1 (performed 2026-08-13)

**60/60 browser checks passed** (headless Chromium over `python3 -m http.server`),
and all prior suites re-run green: **376 total, 0 failing.**

**Java verified by execution, not by reading.** Every example and every reference
solution was compiled with `javac --release 17` (the project's Java 17 baseline)
on `javac 21.0.10` / OpenJDK 21.0.10, then run, and the recorded output is the
real output:

| Source | Result |
|---|---|
| `HelloJava.java` | compiled, ran → `Hello from the JVM.` |
| `Greeter.java` + `UseGreeter.java` | compiled into separate directories; ran both with and without the full classpath |
| `Warmup.java` | compiled, ran (warm-up exercise solution) |
| `ArgReport.java` | compiled, ran with 0 and 3 arguments (easy exercise solution) |
| `ClassFileVersion.java` | compiled, ran against a `--release 17` class (major 61), a JDK 21 class (major 65), and a non-class file (challenge solution) |

Every transcript in the chapter was captured from a real command: the
`0xCAFEBABE` header bytes, `major version: 61`, the `javap -c` bytecode listing,
the `NoClassDefFoundError` / `ClassNotFoundException` pair, `no main manifest
attribute`, the generated `MANIFEST.MF`, and the filename-mismatch compiler
error.

**Two claims were corrected by execution rather than asserted.** Compiling with
plain `javac` on JDK 21 produces major version 65 while `--release 17` produces
61 — both measured, and the chapter says which is which rather than presenting
one number as universal. And the single-file source launcher does not enforce
the public-class/filename rule that `javac` does; the chapter states both
behaviours because they disagree.

**Browser checks covered:** chapter route rendering and 404 for an unknown id;
all six section types; the chapter appearing in the sidebar, the module
overview, and the dashboard denominators; planned-but-unwritten chapters
rendering as inert, unlinked rows; interview answers hidden until revealed with
`aria-expanded` tracking; the hint ladder still revealing one step at a time
with seven exercises on the page; mark-complete writing through the progress API
under module id + chapter id and moving the module to IN_PROGRESS but **not**
COMPLETED; module-local previous/next navigation; shell snippets rendering as
static blocks rather than offering to run as Java; no console errors; no
horizontal overflow at 360px.

**One real bug found and fixed during verification.** The inline formatter was a
single regex, and its alternation rendered `**` + backtick-code + `**` as bold
text containing two visible backticks. It was replaced with a hand-written
tokenizer that handles the one-way nesting (bold may contain code; code keeps
asterisks literal), and eight direct tests now cover the edge cases including
unmatched delimiters.

### CONTINUE #1 — not verified

- **Cross-platform behaviour.** Not verified because: only Linux was available.
  The chapter's portability claims are the specified behaviour of the class file
  format, and the chapter says so rather than implying they were demonstrated.
- **`UnsupportedClassVersionError` itself was not reproduced** — that needs two
  JDKs of different versions. The mechanism is explained from the measured
  version numbers instead.
- **Windows path separators** in classpath examples were not exercised.
- **Real devices, other browsers, screen-reader narration, measured colour
  contrast** — unchanged from Phase 6; still not verified, for the same reasons.

---

### Phase 6 — foundation verification (performed 2026-08-13)

A consolidated end-to-end pass against the master brief's foundation checklist
(§38), served over `python3 -m http.server` and driven in headless Chromium.
**52 passed, 0 failed, 4 not-applicable-yet.** All six phase suites were re-run
first: **262 passing, 0 failing.** Combined total **314 checks, 0 failures.**

| Checklist item (§38 + Phase 6 instruction) | Result |
|---|---|
| Navigation works; view switching; `aria-current` on the active link | PASS |
| Sidebar lists all 43 modules | PASS |
| Module expansion toggles and tracks `aria-expanded` | PASS |
| Chapter-nav foundation renders and says chapters do not exist | PASS |
| Mobile drawer: off-canvas at 375px, opens, backdrop closes it | PASS |
| No horizontal overflow at 375px and at 320px on the heaviest view | PASS |
| Dark/light toggle, persistence to `jfsm.theme` | PASS |
| Theme already applied at DOMContentLoaded (no flash); inline script in `<head>` | PASS |
| Search returns module hits and topic hits; navigates to the module | PASS |
| Search empty state and no-results state | PASS |
| Progress persists across reload | PASS |
| Progress keys use permanent module ids; record carries `schemaVersion` | PASS |
| Reset clears progress and preserves the theme | PASS |
| Corrupt `localStorage` does not throw and degrades to empty | PASS |
| Missing `localStorage` renders the dashboard cleanly | PASS |
| Solution and predict answer hidden by default | PASS |
| Hint ladder reveals one step at a time | PASS |
| Disclosure toggles expose and update `aria-expanded` | PASS |
| Editor accepts edits | PASS |
| Run routes through the abstraction and renders a typed result | PASS |
| "No provider configured" renders cleanly with no throw | PASS |
| Reset restores the starter code | PASS |
| Local `javac`/`java` fallback reachable from the practice UI | PASS |
| All 43 module routes resolve to their module | PASS |
| Module 08 is "Hashing & HashMap Internals" | PASS |
| DSA block 18–25 present and contiguous | PASS |
| Unknown route falls back to the not-found view | PASS |
| No broken internal links | PASS |
| No console errors across the whole sweep | PASS |
| Temporary dev completion control is labelled as scaffolding | PASS |
| Chapter navigation (previous/next, breadcrumbs) | NOT APPLICABLE YET — no chapters exist |
| Chapter content rendering | NOT APPLICABLE YET — no chapters exist |
| Real exercise / predict content | NOT APPLICABLE YET — only labelled placeholders, by design |
| Online execution round-trip | NOT APPLICABLE YET — no provider configured |

### Phase 6 — not verified

Carried forward honestly; none of these was tested:

- **Real devices.** Not verified because: only headless Chromium at simulated
  viewports was available. No physical phone or tablet was used.
- **Other browsers.** Not verified because: only Chromium was available. Firefox
  and Safari (and therefore WebKit-specific rendering) are untested.
- **Live provider round-trip and CORS.** Not verified because: the sandbox's
  network egress policy blocks the provider hosts, and CORS can only be
  established from a real browser origin talking to a real instance.
- **Screen-reader narration.** Not verified because: no assistive technology was
  available. ARIA attributes and semantics were asserted structurally
  (`role`, `aria-live`, `aria-expanded`, `aria-current`, accessible names), which
  is not the same as hearing a screen reader read the page.
- **Measured colour contrast.** Not verified because: no contrast measurement
  was performed. The palette was designed with contrast in mind but no ratio was
  computed against WCAG thresholds.
- **`prefers-reduced-motion` behaviour** was not exercised in this pass.
- **Keyboard-only end-to-end traversal** was not exercised in this pass beyond
  the focus and `aria-expanded` assertions.
- **Print styles** do not exist and were not tested.

---

### Phase 5 — performed 2026-08-13

Served over `python3 -m http.server` and driven with headless Chromium
(Playwright). **32/32 Phase 5 browser checks passed.**

**Editor**
- The Phase 4 `Run — Phase 5` disabled placeholder is gone from the DOM; no
  disabled Run control remains at rest.
- Three runners render on `#/practice` (exercise starter, reference solution,
  predict snippet); the editor is a real `<textarea>` and edits persist.
- `Reset` restores the starter code, **not** the reference solution.
- Output panel is `role="status" aria-live="polite"`; the editor carries an
  accessible name; the local fallback is a real `<details>` disclosure.

**Execution abstraction**
- The result carries all eleven contract fields on every path.
- No provider configured → `provider-unavailable`, `providerUnavailable: true`.
- Empty source → `invalid-input`. Oversized source → `invalid-input`.
- `executionStatus().ready` is `false` with no provider.
- A provider pointed at a dead address → `provider-unavailable` with a message
  stating the code was not run — **not** a code error. Exercised in-browser
  against a refused connection.

**Local fallback**
- Commands are derived from the editor's live contents and update as it is
  edited: renaming the public class to `Renamed` produced `javac Renamed.java`
  / `java Renamed`; a `package com.demo;` source produced `mkdir -p com/demo`
  and `java com.demo.Pkg`.

**Source analysis — verified by actually running Java**
`assets/js/execution/java-source.js` was tested with **OpenJDK 21.0.10**
(`javac 21.0.10`) present in the development environment. **28/28 checks
passed, 8 of which generated a source, named it by this logic, then really ran
`javac` and `java`** and compared stdout:

- non-`Main` public class, non-public class, two classes with `main` in the
  second, a record with `main`, a text block, stdin actually read by `Scanner`,
  a decoy `public class Ghost` inside a comment *and* a string literal, and a
  packaged source run as `java com.example.demo.Packaged`.

**Two Java facts were checked by execution rather than asserted from memory:**

| Claim | Verified result |
|---|---|
| `java Foo.java` runs a single file without `javac` (Java 11+) | **True** on JDK 21 |
| Single-file source launch requires the class name to match the file | **False** — `Mismatch.java` containing `public class TotallyDifferent` ran fine |
| `javac` requires the public class and file name to agree | **True** — `error: class TotallyDifferent is public, should be declared in a file named TotallyDifferent.java` |
| A packaged source can be launched directly as `java Pkg.java` | **True**, with no directory layout needed |

The UI text was corrected to match these results: the file-name rule is stated
as a `javac` requirement, and the single-file route is described as not
enforcing it.

**Regression**
All prior suites re-run green after the Phase 5 changes: 63/63 Phase 4, 33/33
realignment, 64/64 Phase 3, 42/42 Phase 2. `node tools/generate-modules.mjs
--check` reports the metadata chain in sync.

One Phase 4 assertion was updated rather than left failing: it asserted the Run
control was a disabled `Phase 5` placeholder, which Phase 5 deliberately
replaced. It now asserts the controls are live and no placeholder text survives.

**Presentation**
Rendered screenshots were inspected in light and dark themes and at a 360px
viewport; no horizontal page overflow, and the editor picks up dark tokens.

---

### Phase 5 — provider research (performed 2026-08-13)

Researched against the providers' **live documentation**, not training data.
This section separates what was verified from what was not, because the
distinction decides whether anything ships enabled.

#### VERIFIED from live sources

| Finding | Source |
|---|---|
| Piston's public API is **"no longer freely available to the public (as of Feb 15, 2026)"** and authorization must be requested case-by-case via Discord, granted only for non-commercial educational use | Piston readme, github.com/engineer-man/piston |
| Piston's public endpoint is rate limited to 5 requests/second; self-hosting is recommended for higher throughput | Piston readme |
| Piston `POST {base}/execute` requires `language`, `version`, `files[]`; optional `stdin`, `args`, timeouts and memory limits. Response carries `run` and (for compiled languages) `compile`, each with `stdout`, `stderr`, `code`, `signal`, `message` | Piston readme / API docs |
| Judge0 `POST /submissions` requires `source_code` and `language_id`; optional `stdin`, `expected_output`, `base64_encoded`, `wait`, and CPU/wall/memory limits. Response carries `stdout`, `stderr`, `compile_output`, `message`, `exit_code`, `exit_signal`, `time`, `memory`, `status {id, description}`, `token` | judge0/judge0 `docs/api/submissions/submissions.md` |
| Judge0 can be configured to require an API key, sent as `X-Auth-Token` on **every** request; via RapidAPI the headers are `X-RapidAPI-Key` / `X-RapidAPI-Host` | Judge0 authentication docs; RapidAPI docs |
| Judge0 hosted plans are keyed and metered (RapidAPI free Basic tier, paid tiers above it; Sulu offers a free submission allowance on signup) | RapidAPI Judge0 pricing pages |
| Wandbox has historically offered Java (OpenJDK) — permalinks exist for jdk‑9 through jdk‑22 | wandbox.org permalinks |

#### NOT VERIFIED — and why

- **No HTTP request was made to any provider.** The development sandbox's
  network egress policy denied `CONNECT` to `wandbox.org:443` and blocked
  `ce.judge0.com`, confirmed in the proxy's own failure log. **This is a
  restriction of the sandbox, not evidence about the providers.**
- **CORS behaviour is entirely unverified for every provider.** It cannot be
  verified from a sandbox in principle: it is a browser-enforced property of a
  real page origin talking to a real instance. Anyone enabling a provider must
  treat the first run **from an actual browser** as the real test.
- **Wandbox's current Java version could not be confirmed.** The permalinks
  above prove those JDKs existed at some past time; they do not prove current
  availability, and `GET /api/list.json` was unreachable. Java 17 is this
  project's baseline and could not be confirmed as offered.
- **Judge0's Java `language_id` was not determined** and is deliberately not
  hardcoded — ids differ between versions and instances. Config requires the
  operator to read `GET {baseUrl}/languages`.
- **Judge0's numeric `status.id` table was not verified**, so the adapter
  matches the human-readable `status.description` instead.
- **No claim is made that any provider's API "works."** Both adapters were
  written to documented wire formats and have never exchanged a byte with a
  live instance.

#### Decision

**Ship with no provider enabled.** `provider: null` is the default in
`assets/js/execution/config.js` and is a permanently supported mode, not a
placeholder. The platform is fully usable without one: every chapter, exercise,
hint, solution and prediction works, the editor stays editable, and every
snippet carries exact local `javac` / `java` commands.

Both adapters target a **self-hosted** instance, where authentication is off by
default — so there is no secret, and nothing secret can leak. `config.js` has
**no credential field at all**; a keyed provider can only be reached by pointing
`baseUrl` at the minimal proxy described in `docs/ARCHITECTURE.md` §11.7.

---

### Phase 5 — not verified

- **No online execution provider was exercised.** Not verified because: the
  development sandbox's egress policy blocks outbound connections to the
  provider hosts. Both adapters follow documented wire formats and have never
  contacted a live instance.
- **CORS from a browser to any provider.** Not verified because: this cannot be
  established from a sandbox at all — it is a property of a real browser origin
  talking to a real instance.
- **The Piston adapter's response handling** (compile-stage failure, `SIGKILL`
  on limits, exit codes) has never seen a real Piston response.
- **The Judge0 adapter's response handling** (compile output, time-limit
  description matching, `wait=true` behaviour, the token-only branch) has never
  seen a real Judge0 response.
- **The proxy described in ARCHITECTURE §11.7 does not exist.** Nothing needs it
  while no keyed provider is in use.
- **Multi-file and Maven-project execution** is not implemented online; both
  adapters send a single file. The local fallback covers these cases.
- **The clipboard fallback path** (`document.execCommand` in a non-secure
  context) was not exercised — the verification run was served over
  `127.0.0.1`, which is already a secure context.
- **The Blob download** was not clicked through to a saved file in the
  verification run.

---

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

## Foundation Report (master brief §40)

Recorded when the foundation completed, and kept current as chapters land.
Figures below are true as of 2026-08-13, after CONTINUE #4.

```text
Foundation complete.

Modules created:            43 (metadata only — 0 have learning content)
Website foundation:         complete
Search:                     complete (foundation — modules and topics only)
Progress tracking:          complete (foundation — per-browser localStorage)
Practice system:            complete (foundation — shells; no real content)
Java compiler integration:  complete (abstraction + local javac/java fallback;
                            online provider: NONE configured, NONE verified)
Responsive layout:          complete
Dark/light mode:            complete
Persistent documentation:   complete

Current project state:
  Phase                FOUNDATION COMPLETE; content underway via CONTINUE
  Awaiting             the next CONTINUE from the project owner
  Chapters written     4   (all of Module 01)
  Modules with content 1 of 43 - Module 01 VERIFIED, 42 NOT_STARTED
  Exercises (real)     24  (1 labelled placeholder, excluded from all counts)
  Predict questions    22  (1 labelled placeholder, excluded from all counts)
  Verification         491 checks passing, 0 failing, 2026-08-13
  Known bugs           none
  Execution provider   none configured; both adapters unproven against a live
                       instance; CORS unverified
  Next required task   CONTINUE -> Module 02 (02-oop-in-java), first chapter.
                       No chapter plan recorded yet - decide it, write it into
                       PLANNED_CHAPTERS, then author 02-01 only.

Repository tree:
  Java_mastery/
  |- index.html                      app shell; all views as static markup
  |- README.md                       project description + fresh-session entry
  |- CLAUDE.md                       permanent operating rules
  |- assets/
  |  |- css/  base.css  theme.css  layout.css
  |  \- js/   app.js dom.js theme.js nav.js sidebar.js dashboard.js
  |           curriculum-view.js module-view.js search.js
  |           storage.js progress.js
  |           practice-view.js exercise-shell.js predict-shell.js
  |           code-runner.js
  |           execution/ config.js result.js service.js java-source.js
  |                      providers/ piston.js judge0.js
  |- data/    modules.js (GENERATED)  exercises.js  predict-output.js
  |- tools/   generate-modules.mjs
  \- docs/    MASTER_BRIEF.md (CANONICAL)  PROJECT_STATE.md
              ARCHITECTURE.md  CURRICULUM.md  AI_INSTRUCTIONS.md

  Absent by design: content/, java/, chapters, build files, dependencies, CI.
```

### The 43 permanent module ids — for the record

These are **primary keys**, not labels. They key `localStorage` progress under
`jfsm.progress`, the routes (`#/module/<id>`), and every cross-reference in the
repository. Renaming or renumbering one silently destroys stored learner
progress. Verified against `data/modules.js` on 2026-08-13.

```text
01  01-java-foundations-execution-model
02  02-oop-in-java
03  03-java-language-fundamentals
04  04-strings-wrappers-object-fundamentals
05  05-exception-handling
06  06-generics
07  07-java-collections-framework
08  08-hashing-hashmap-internals
09  09-functional-java-lambda-expressions
10  10-stream-api
11  11-optional-date-time-modern-java-apis
12  12-annotations-enums-reflection
13  13-java-i-o-nio
14  14-jvm-memory-garbage-collection
15  15-multithreading-fundamentals
16  16-concurrency-synchronization
17  17-executors-advanced-concurrency
18  18-dsa-foundations-in-java
19  19-hashing-dsa-patterns
20  20-two-pointers-sliding-window
21  21-linked-lists-stack-queue-deque
22  22-trees-bst-heaps
23  23-graphs
24  24-binary-search-recursion-backtracking
25  25-greedy-dynamic-programming
26  26-sql-fundamentals
27  27-advanced-sql-database-concepts
28  28-jdbc
29  29-maven-java-project-management
30  30-jpa-fundamentals
31  31-hibernate-internals-advanced-orm
32  32-spring-core
33  33-spring-boot-fundamentals
34  34-spring-mvc-rest-apis
35  35-spring-data-jpa
36  36-spring-security
37  37-testing-java-spring-applications
38  38-production-grade-spring-boot
39  39-backend-architecture-design
40  40-java-full-stack-integration
41  41-debugging-performance-problem-solving
42  42-projects-interview-engineering
43  43-final-full-stack-capstone-mastery-assessment
```

### How a fresh session continues

**Read** `README.md` → `CLAUDE.md` → `docs/AI_INSTRUCTIONS.md` →
`docs/PROJECT_STATE.md` → `docs/ARCHITECTURE.md` → `docs/CURRICULUM.md` →
`docs/MASTER_BRIEF.md` (canonical) → **inspect the repository itself**
(`git log`, `git status`, list the directories, open the files) → wait for
**`CONTINUE`**, then build exactly one chapter — the first incomplete one,
determined from the repository and never from conversation history — verify it,
update this file, and **STOP**.

---

## Change log

| Date | Phase | Change |
|---|---|---|
| 2026-08-11 | 1 | Created the documentation layer: `README.md` (replacing the 14-byte stub), `CLAUDE.md`, `docs/PROJECT_STATE.md`, `docs/ARCHITECTURE.md`, `docs/CURRICULUM.md`, `docs/AI_INSTRUCTIONS.md`. Authored the 43-module curriculum with full topic lists. No code written; no website; no execution layer. |
| 2026-08-13 | CONTINUE #4 | Wrote **Module 01, Chapter 4 — Program Entry, Output, and Structure** (id `01-04`), **completing Module 01**: the `main` signature the launcher demands, `System`/`System.out`/`PrintStream`, standard output versus standard error, exit status, packages and layout, imports, and naming conventions. 24 sections, 7 objectives, a 6-step guided lab, 8 common mistakes, 7 interview questions, 14 revision points, 10 cross-links. Added 6 exercises and 6 predict-the-output questions; ten new Java sources in `java/module-01/ch04/`. **Removed `status` from the generated `data/modules.js`** — Module 01 completing would have made it a false claim — and added `moduleContentStatus()` deriving it from the chapters actually written; the generator now refuses all three authored-state fields. **Fixed a real content bug**: the dashboard banner still claimed no chapters had been written, and is now derived. Corrected a wrong test assertion that flagged `char** argv` inside a code span; the check now measures prose only. Verified: 38/38 chapter checks, 491 total, 0 failing; all Java recompiled from a clean directory. |
| 2026-08-13 | CONTINUE #3 | Wrote **Module 01, Chapter 3 — The Execution Engine** (id `01-03`): interpreter, tiered JIT compilation, on-stack replacement, warm-up, speculation and deoptimisation, HotSpot, and the `-X`/`-XX` option categories. 30 sections, 6 objectives, a 7-step guided lab, 7 common mistakes, 7 interview questions, 13 revision points, 7 cross-links. Added 6 exercises and 5 predict-the-output questions. Six new Java sources in `java/module-01/ch03/`. **Every timing was measured, not recalled**, and each is published with hardware, JDK, workload and run count. Two honesty records kept deliberately: a prediction about `-Xcomp` that measurement contradicted, and a planned demonstration that produced zero events and was recorded as a failed experiment rather than replaced. **One real layout bug found and fixed**: inline `<code>` spans with long unbreakable identifiers overflowed the page at 360px, fixed in `base.css` scoped to inline code only. Nine assertions in the Chapter 2 suite were rewritten to derive their counts from the data. Verified: 39/39 chapter checks, 453 total, 0 failing; all Java recompiled from a clean directory with `--release 17` on OpenJDK 21.0.10. |
| 2026-08-13 | CONTINUE #2 | Wrote **Module 01, Chapter 2 — JVM Architecture & Class Loading** (id `01-02`): the loading / linking / initialization phases, the three built-in class loaders and parent delegation, what does and does not trigger initialization, constant inlining and the stale-constant trap, and the error each phase fails with. 36 sections, 6 objectives, a 6-step guided lab, 7 common mistakes, 7 interview questions, 12 revision points, 8 cross-links. Added 6 exercises and 6 predict-the-output questions — every solution compiled and run, every answer captured from real output. Ten new Java sources in `java/module-01/ch02/` including a one-byte class-file corrupter used to make the linking phases fail on demand. Reproduced `UnsupportedClassVersionError`, which Chapter 1 had recorded as unverifiable. Verified: 38/38 chapter checks, 414 total, 0 failing; all Java recompiled from a clean directory with `--release 17` on OpenJDK 21.0.10. One content defect fixed (literal backticks in raw-rendered fields). **Sixteen assertions in earlier suites were rewritten to derive their counts from the data** rather than hardcode them, so future chapters do not break them. |
| 2026-08-13 | CONTINUE #1 | Wrote **Module 01, Chapter 1 — From Source to Running Program** (id `01-01`): the compilation and execution pipeline, JDK/JRE/JVM, `javac`, bytecode, class files, the `java` launcher, the classpath, and JAR files. 29 sections, 6 objectives, a 5-step guided lab, 6 common mistakes with real error text, 7 interview questions, 9 revision points, and 7 cross-links. Added 6 exercises across the difficulty ladder and 5 predict-the-output questions — every solution compiled and run, every answer captured from real output. Built the chapter layer to carry it: `data/chapters.js` (manifest + lazy loaders + `PLANNED_CHAPTERS`), `assets/js/chapters.js` (accessor), `assets/js/chapter-view.js` (renderer over six typed section types), the `#/chapter/<NN-MM>` route, sidebar and module chapter lists, and module-local previous/next navigation. **Removed `chapterCount`/`chapters` from the generated `data/modules.js`** — the curriculum cannot know chapter boundaries, and a generated zero would have started lying; the generator now refuses to emit them. Made the code runner Java-only so shell snippets render as static blocks. Verified: 60/60 chapter checks, 376 total across all suites, 0 failing; all Java compiled with `--release 17` and run on OpenJDK 21.0.10. One real bug found and fixed (the inline formatter mis-nested bold and code). Six superseded assertions in earlier suites updated to the new reality. |
| 2026-08-13 | 6 | Final foundation phase — verification and documentation truth only; **no code behaviour changed**. Ran a consolidated end-to-end pass against the master brief's §38 foundation checklist: 52/52 passing, 4 items not-applicable-yet, plus all six phase suites re-run at 262/262 — **314 checks, 0 failures**. Documentation-truth audit found and fixed two false claims in this file: known limitation 3 still said progress tracking was an unpersisted stub (Phase 4 replaced it), and limitation 5 still listed Practice as a placeholder view (Phases 4–5 built it). Added limitations 17–18 (verification suites are not committed to the repo; no CI). Corrected README §7's stale status line and module count, rewrote README §13 into a self-sufficient fresh-session entry point covering the CONTINUE workflow, the read order including MASTER_BRIEF.md, and the module-id convention. Updated the site's phase labels from 'Phase 5 of 6' to 'Foundation complete'. Confirmed all 43 modules are NOT_STARTED with 0 chapters and the MASTER_BRIEF → CURRICULUM → modules.js chain is in sync. State set to FOUNDATION COMPLETE, awaiting the first CONTINUE. No chapter was created. |
| 2026-08-13 | 5 | Built the Java execution architecture. Added `assets/js/execution/{config,result,service,java-source}.js` and `assets/js/execution/providers/{piston,judge0}.js` — a provider-agnostic `executeJava()` returning a typed result with every failure mode mapped, and one documented configuration point that deliberately has **no credential field**. Added `assets/js/code-runner.js`: an editable editor with Run / Reset / Copy, an output panel separating stdout, compiler diagnostics, runtime errors and provider-unavailable, and an always-present local `javac` / `java` panel whose commands are derived from the source actually in the editor. Replaced the disabled `Run — Phase 5` placeholders in both practice shells. Extended the exercise contract with `starterCode` and `stdin` (additive). **Researched providers against live docs and enabled none**: Piston's public API is no longer freely available (Feb 15 2026, per its readme) and Judge0's hosted offerings require a secret key a static site cannot hold. Verified in-browser 32/32, plus 28/28 source-analysis checks of which 8 really compiled and ran Java on OpenJDK 21.0.10; all prior suites re-run green (262 total). Corrected two Java claims by execution rather than asserting them. No provider was contacted; no CORS behaviour verified. |
| 2026-08-12 | 4 | Replaced the progress stub with real `localStorage` persistence: `assets/js/storage.js` (single storage gateway) and a rewritten `assets/js/progress.js` (single progress API, `schemaVersion: 1`, keyed on permanent module ids, defensive against corrupt/blocked/future-version storage, reset that preserves the theme). Wired real progress into the dashboard, sidebar, curriculum, and module views, with change notification. Added the practice/hint/predict-output shells (`practice-view.js`, `exercise-shell.js`, `predict-shell.js`) plus their data contracts (`data/exercises.js`, `data/predict-output.js`) holding one labelled placeholder each. Added a clearly-tagged temporary manual completion control. Verified in-browser: 63/63 Phase 4 checks and 202 total across all suites; two real bugs found and fixed. No real exercises, no chapters, no code execution. |
| 2026-08-12 | realign | Added `docs/MASTER_BRIEF.md` (verbatim, owner-supplied) as the canonical curriculum source. Rewrote `docs/CURRICULUM.md` as a byte-identical transcription of its Section 12, replacing the Phase 1 authored curriculum — only 2 of 43 names had matched. Regenerated `data/modules.js` (43 modules, 848 topics, 19 emphasis notes, 7 project subsections); 41 of 43 module ids changed. Adapted the module, curriculum, and search views to the flat topic shape. `description` derived mechanically; `prerequisites` left empty — neither invented. Verified in-browser: 33/33 realignment, 64/64 Phase 3, 42/42 Phase 2. |
| 2026-08-12 | 3 | Locked the curriculum (owner confirmation recorded in `CURRICULUM.md` Appendix B). Added the module metadata layer: `data/modules.js`, generated from `docs/CURRICULUM.md` by `tools/generate-modules.mjs`. Rebuilt the sidebar from metadata (43 modules, collapsible, empty chapter regions), added the dashboard structure reading a progress stub, the curriculum and module-overview views, and functional module/topic search. Verified in headless Chromium: 64/64 Phase 3 checks and 42/42 Phase 2 regression checks; three real bugs found and fixed. No progress persistence, practice UI, or code execution — those remain Phases 4–5. |
| 2026-08-12 | 2 | Built the website shell: `index.html` plus `assets/css/{base,theme,layout}.css` and `assets/js/{app,theme,nav}.js`. App shell layout, light/dark theming with persistence and no flash, responsive drawer navigation, and a hash-routing scaffold. Verified in headless Chromium: 42/42 checks passed; two real bugs found and fixed. Updated `docs/ARCHITECTURE.md` (§2, §3, §10, §12, §14, §15, §16) and `README.md`. No module content, search, progress tracking, or execution — those remain later phases. |
