# AI_INSTRUCTIONS.md — Operating Rules for Any AI Coding Agent

These instructions apply to **any** AI coding agent working on this repository —
regardless of vendor, model, tooling, or interface. They are permanent. They
apply to every session and every unit of work.

They are the agent-neutral statement of the same rules found in
[`../CLAUDE.md`](../CLAUDE.md), plus the workflow protocols. The two files do
not conflict; where `CLAUDE.md` mentions Claude Code-specific tooling, apply the
equivalent capability of whatever agent you are.

---

## 1. Repository-first workflow

**This repository is the only source of truth. Conversation history does not
exist.**

You must be able to do useful, correct work having read *nothing but this
repository*. Assume:

- You cannot see any earlier conversation, in this session or any other.
- Any prior agent's reasoning that was not written to a file is lost.
- The next agent will likewise see nothing you say in chat — only what you commit.

Therefore:

1. **Read before writing.** Every session, before your first edit, read:
   [`../README.md`](../README.md) → [`../CLAUDE.md`](../CLAUDE.md) → this file →
   [`PROJECT_STATE.md`](PROJECT_STATE.md) → [`ARCHITECTURE.md`](ARCHITECTURE.md)
   → [`CURRICULUM.md`](CURRICULUM.md).
2. **Then inspect the actual repository.** List directories, open files, check
   version control status and history. Documentation describes intent; the
   filesystem is reality.
3. **Reconcile.** When the repository and `PROJECT_STATE.md` disagree, the
   repository wins. Correct the document, and say that you corrected it.
4. **Write decisions down.** Any decision a future session needs must land in a
   file in the same unit of work that produced it. Undocumented decisions get
   silently reversed.
5. **Never write "as previously discussed."** Cite a file path instead.
6. **Ask rather than invent.** If something genuinely is not recorded anywhere,
   ask the project owner. Do not manufacture the missing information and then
   present it as established.

---

## 2. Technology restrictions

### Learning website UI — hard constraint

The learning website's UI must be **HTML + CSS + vanilla JavaScript only**.

**Forbidden for the site UI:** React, Angular, Vue, Svelte, Next.js, TypeScript,
jQuery, Tailwind, Bootstrap, any other frontend framework or component library,
and any build step — bundlers, transpilers, preprocessors, package-managed
frontend dependencies.

The site must remain openable and debuggable as plain files, indefinitely,
without a toolchain.

### The restriction is about the UI, not the curriculum

The curriculum teaches the whole Java stack without restriction — Java SE, the
JVM, Maven/Gradle, JUnit, SQL, JDBC, JPA, Hibernate, Spring Framework, Spring
Boot, Spring Data, Spring Security, Docker, and more. Never let the UI
restriction leak into curriculum decisions, and never let curriculum technology
leak into the site UI.

### Backend / proxy

No backend exists. One may be introduced **only** if genuinely required to keep
a secret key off the client for secure Java-execution API integration
(Phase 5). Never introduce server-side code for convenience, for storage, for
accounts, or for rendering.

### Java version

**Java 17 is the baseline.** Any feature requiring a newer release must be
called out explicitly and inline, naming the release. Never present a preview
API as stable. Verify version claims against current JDK documentation rather
than recalling them.

---

## 3. The 43-module constraint

[`CURRICULUM.md`](CURRICULUM.md) defines exactly **43 modules, numbered 01–43**.
The set is frozen.

**Never** add, remove, merge, split, rename, renumber, or reorder a module, and
never quietly redefine a module's scope.

Module numbers are permanent identifiers used by site navigation, by progress
records in `localStorage`, and by every cross-reference in this repository.
Changing one corrupts stored learner progress.

Topic lists *within* a module may be clarified or expanded when a real gap is
found; record any such change in `PROJECT_STATE.md`. If you believe the
curriculum has a structural defect, **report it and stop** — do not act
unilaterally.

---

## 4. Accuracy requirements — no fabrication

A confident falsehood in a learning platform is worse than an omission, because
the learner cannot detect it.

**Never invent:** Java APIs, method signatures, class or package names;
annotations and their attributes; framework behaviour (Spring bean lifecycle,
Boot auto-configuration, Security filter chains, Hibernate flushing and dirty
checking, transaction propagation); JVM behaviour (GC internals, memory layout,
JIT behaviour, classloading order, string interning); Maven or Gradle behaviour
(lifecycle phases, plugin goals, dependency resolution and scopes); benchmark
numbers or relative-performance claims; version histories or "added in Java N"
claims.

**When uncertain, verify** against current official documentation — JDK
javadoc/JLS, Spring reference documentation, Hibernate and Jakarta Persistence
documentation, Maven/Gradle documentation. If you cannot verify it, omit it, or
mark it plainly:

> *Unverified: expected behaviour, not confirmed by documentation or execution.*

**Never state a performance number you did not measure.** If you measured it,
record JDK version, hardware, warmup, and tool. Otherwise argue qualitatively
from mechanism and complexity.

---

## 5. No duplication — single primary ownership

Each concept is taught properly in **exactly one** primary module.

- Later modules **cross-link** to the owner instead of re-teaching.
- A one- or two-line pointer is fine; a second full explanation is not.
- If a concept has no owner, that is a gap — report it, do not invent a second
  home for it.

`CURRICULUM.md` records primary ownership. Check it before writing anything
that might already be taught elsewhere.

---

## 6. Practice-first methodology is mandatory

Every chapter drives this cycle:

```
Learn → Predict → Code → Compile → Run → Observe → Debug → Modify → Solve → Explain
```

Requirements:

- Explanation exists to enable practice. Practice is not an appendix.
- Examples must be **complete, compilable programs**, not fragments.
- Predict-output questions come **before** the learner runs anything.
- Hints are kept separate from solutions; solutions come after hints.
- Debugging is taught deliberately — break the code, read the real error.
- A chapter with strong prose and no runnable exercises is **incomplete**.

**Respect the learner profile** (`../README.md` §2): an experienced programmer
with C++, DSA, and JavaScript/HTML/CSS background, moving into Java. Do not
teach what a variable, loop, `if`, function, or array is. Teach the mechanism,
the delta from C++/JavaScript, the internal behaviour, and the failure modes.
Aim at interview-level reasoning and real engineering ability.

---

## 7. Chapter-by-chapter delivery

Deliver **one chapter at a time**, working these steps in order:

```
Concept → Examples → Predict-output → Guided lab → Practice → Hints →
Execution → Solutions → Interview Qs → Mistakes → Revision → Integration →
Verification → Update state → STOP
```

| Step | Requirement |
|---|---|
| Concept | Mechanism and "why", at the learner's level |
| Examples | Complete, compilable programs |
| Predict-output | Answered before running anything |
| Guided lab | Step-by-step build the learner types |
| Practice | Graded problems, solved unaided |
| Hints | Progressive, separate from solutions |
| Execution | Exact `javac`/`java`/Maven commands |
| Solutions | Full worked solutions with reasoning |
| Interview Qs | Reasoning-depth, with model answers |
| Mistakes | The specific errors this topic produces |
| Revision | Condensed recall notes |
| Integration | Cross-links to earlier modules; no re-teaching |
| Verification | Actually compile and run everything (§9) |
| Update state | `PROJECT_STATE.md` reflects new reality |
| STOP | Do not continue into the next chapter |

Never batch chapters. Never skip steps. Never reorder them.

---

## 8. `CONTINUE` behaviour

Once the foundation phases are complete, the routine working protocol is the
single word **`CONTINUE`** from the project owner. On receiving it:

1. **Read** `PROJECT_STATE.md` to determine the exact current position —
   current module, current chapter, next required task.
2. **Inspect** the repository to confirm that position is real (§1). If the
   document is stale, correct it first and say so.
3. **Consult** `CURRICULUM.md` for the topic list that the next chapter must
   cover, and check §5 so you cross-link rather than re-teach.
4. **Deliver exactly one chapter** through the §7 workflow.
5. **Verify** it (§9) — actually compile and run the code.
6. **Update** `PROJECT_STATE.md`: current module, current chapter, completed
   items, status token, verification status, next required task, and the
   `Last updated` date.
7. **Commit** the work with a descriptive message.
8. **STOP.** Report what was done, what was verified, and what was not verified
   and why. Wait for the next instruction.

One `CONTINUE` produces exactly one chapter. Never two. If the current position
is ambiguous or the state file is inconsistent with the repository, resolve the
ambiguity and report it *before* producing content.

During the foundation phases, `CONTINUE` is not in effect — those phases are
delivered on explicit, individually specified instructions, each ending in STOP.

---

## 9. Verification requirements

**Nothing is complete, tested, working, or verified unless it actually was.**

- "Compiles" means you compiled it. "Runs" means you ran it and observed real
  output. "Works" means you saw it work.
- If verification is impossible in your environment, state it explicitly:

  > **Not verified because:** no JDK is available in this environment.

  > **Not verified because:** this requires a running database.

- Never mark anything `VERIFIED` based on reading code. `VERIFIED` means executed.
- Report failures faithfully, with the real output. Never summarise a failing
  build as success.
- Never make claims about parts of the system that do not exist yet.

---

## 10. Project-state requirements

[`PROJECT_STATE.md`](PROJECT_STATE.md) must **always reflect current reality**.
It is the first thing the next agent trusts, so a stale state file is an active
hazard.

It must carry, at minimum: project phase; current module; current chapter;
completed modules; completed chapters; partially completed work; next required
task; completed website features; compiler integration status; known bugs; known
limitations; important architectural decisions; important implementation
decisions; things that must not be redone; last verification status; last
updated date (the real date).

**Existence is not completion.** A folder or file existing does not mean a
module or chapter is done. Record status with these exact tokens:

| Status | Meaning |
|---|---|
| `NOT_STARTED` | Nothing exists for it |
| `FOUNDATION_ONLY` | Structure/scaffolding/placeholders only; no real content |
| `IN_PROGRESS` | Partially built; explicitly incomplete |
| `CONTENT_COMPLETE` | All content written, not yet verified by execution |
| `VERIFIED` | Content complete **and** every example actually compiled and run |

Never use "done", "finished", or "complete" without one of these tokens.

---

## 11. Non-destructive development

- **Inspect before overwriting.** Read a file's current contents before
  replacing it. Work you did not create is not yours to discard.
- Prefer additive, targeted edits over wholesale rewrites.
- Never delete content because it is unfamiliar or because rewriting is easier.
- Never restructure directories that are not in the scope you were given.
- If a rewrite is genuinely warranted, say what you are replacing and why
  **before** doing it, and record it in `PROJECT_STATE.md`.
- Treat learner progress as data: it lives in `localStorage` keyed by
  module/chapter IDs, so changes invalidating those keys are destructive and
  need migration, not breakage.

### Version-control safety

No force-push. No history rewriting (no rebasing or amending pushed commits, no
history surgery). No destructive resets or cleans over work you did not create.
No deleting branches you did not create. Commit in coherent units with
descriptive messages. Never commit secrets, keys, or tokens. Do not open a pull
request unless explicitly asked.

---

## 12. Documentation obligations

A unit of work is not finished until documentation matches reality.

**Always update `PROJECT_STATE.md`** — every field affected, plus the real
`Last updated` date.

**Update `ARCHITECTURE.md`** when a structural decision is made, or when a
section marked *Planned* becomes implemented. Move it out of "Planned" only
when the code actually exists.

**Update `../README.md`** when the project's shape, status, phase, or workflow
changes.

**Update `CURRICULUM.md`** only for permitted topic-level clarifications —
never for structural change (§3).

Never defer documentation. "Later" is a different session with no memory of what
you did.

---

## 13. Scope discipline

- Do exactly the phase or chapter requested — nothing more.
- Do not start the next phase because the current one finished early.
- Do not build website UI, module content, or execution integration ahead of
  their phase.
- Phases 3, 4, and 6 are **not specified**. Do not invent scope for them.
- Finish by reporting what you did, what you verified, what you did not verify
  and why — then **STOP** and wait for explicit instruction.
