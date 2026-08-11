# PROJECT_STATE.md — Authoritative Current Status

> **This file must always reflect current reality.** It is the first thing any
> agent trusts, so a stale entry here is an active hazard. Update it after every
> meaningful unit of work.
>
> **The filesystem outranks this file.** If the repository disagrees with
> anything below, the repository is correct — fix this document and say that you
> fixed it.

**Last updated:** 2026-08-11

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
| **Project phase** | FOUNDATION (Phase 1 of 6 — Documentation) |
| **Current module** | none (foundation not yet complete) |
| **Current chapter** | none |
| **Completed modules** | none (0 of 43) |
| **Completed chapters** | none |
| **Partially completed work** | documentation layer (this phase) |
| **Next required task** | Phase 2 — Website shell (HTML/CSS/JS, nav, dark/light mode, responsive layout) |
| **Completed website features** | none yet |
| **Compiler integration status** | not started |
| **Known bugs** | none |
| **Known limitations** | no website UI exists yet |
| **Last verification status** | see [Verification](#verification-status) below |
| **Last updated** | 2026-08-11 |

---

## Phase status

| Phase | Scope | Status |
|---|---|---|
| **1** | Documentation layer (`README.md`, `CLAUDE.md`, `docs/*`) | `CONTENT_COMPLETE` — see [Verification](#verification-status) |
| **2** | Website shell — HTML/CSS/JS, navigation, dark/light mode, responsive layout | `NOT_STARTED` |
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

Verified by direct inspection on 2026-08-11:

```
Java_mastery/
├── README.md                  (Phase 1)
├── CLAUDE.md                  (Phase 1)
└── docs/
    ├── PROJECT_STATE.md       (Phase 1 — this file)
    ├── ARCHITECTURE.md        (Phase 1)
    ├── CURRICULUM.md          (Phase 1)
    └── AI_INSTRUCTIONS.md     (Phase 1)
```

**Nothing else.** No `site/`, no `content/`, no `java/`, no `tools/`, no build
files, no configuration, no code of any kind. Directory names appearing in
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

## Important implementation decisions

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

Non-destructive development applies throughout: inspect before overwriting, and
never discard work you did not create (`CLAUDE.md` §8).

---

## Verification status

**Phase 1 verification performed on 2026-08-11.** Method: direct filesystem
inspection and content checks of the files this phase created.

### Verified

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

### Not verified

- **The website, the compiler/execution layer, and all module content — not
  verified because: none of it exists.** Phase 1 produced documentation only.
  No claim is made about any of it.
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
