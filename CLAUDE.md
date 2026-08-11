# CLAUDE.md — Permanent Operating Rules for Claude Code

These rules govern this repository **permanently**, across every session, for
every phase, for every chapter. They are not suggestions and they do not expire.

If you are an AI agent other than Claude Code, read
[`docs/AI_INSTRUCTIONS.md`](docs/AI_INSTRUCTIONS.md) instead — it contains the
same substance in agent-neutral form. If you are Claude Code, read this file
**and** `docs/AI_INSTRUCTIONS.md`; they do not conflict.

---

## 0. Required reading, every session

Before your first edit in any session, read:

1. [`README.md`](README.md)
2. This file
3. [`docs/AI_INSTRUCTIONS.md`](docs/AI_INSTRUCTIONS.md)
4. [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md)
5. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
6. [`docs/CURRICULUM.md`](docs/CURRICULUM.md)

Then inspect the working tree itself (`git status`, `git log --oneline`, list
the directories, open the files you intend to touch). Reading the docs is not a
substitute for looking at the repository.

Do not skip this because the task "looks small". A small task performed against
stale assumptions is how this project gets corrupted.

---

## 1. Repository-first workflow — never assume conversation history

**Assume every session starts with zero memory.** You have no access to what
was discussed, decided, or promised previously except through files committed
to this repository.

Consequences you must honour:

- Never write "as we discussed", "as previously decided", or "continuing from
  before". If it matters, it is in the repository — cite the file.
- Every decision you make that a future session needs must be **written into
  the repository** in the same unit of work that made it. An undocumented
  decision is a decision that will be silently reversed later.
- If a needed piece of information is genuinely absent from the repository, ask
  the project owner. Do not reconstruct it from guesswork and present the guess
  as established fact.
- When you record something you inferred rather than something you were told,
  label it as such in the file.

---

## 2. Read the docs before making changes — every session

`docs/PROJECT_STATE.md` is the entry point for "what is actually done". Treat
it as a claim to be verified, not as ground truth: **the filesystem outranks the
documentation.** If they disagree, the repository is correct — fix the document,
and say in your reply that you corrected it and why.

---

## 3. The 43-module curriculum is fixed

`docs/CURRICULUM.md` defines exactly 43 modules, numbered 01–43.

**You must not:**

- add a module
- remove a module
- merge two modules
- split a module
- rename a module
- renumber any module
- change the ordering
- silently reinterpret a module's scope to cover something it does not

Module numbers are permanent identifiers. They key the website's navigation,
the progress records in `localStorage`, and every cross-reference in this
repository. Changing one breaks stored learner progress.

Topic lists inside a module may be **clarified or expanded** when a genuine gap
is found — but the module's identity, number, name, and scope stay put, and any
such change must be recorded in `docs/PROJECT_STATE.md` under implementation
decisions. If you believe the curriculum has a structural problem, **say so and
stop** — propose it to the project owner; do not fix it unilaterally.

---

## 4. No fabrication — accuracy is non-negotiable

This is a learning platform. A confident falsehood here is worse than an
omission, because the learner has no way to detect it.

**Never invent:**

- Java APIs, method signatures, class names, or package names
- annotations (Java, Spring, Jakarta, JPA, JUnit, Mockito, Lombok, …) or their
  attributes
- framework behaviour — Spring bean lifecycle details, Spring Boot
  auto-configuration behaviour, Spring Security filter ordering, Hibernate
  flush/dirty-checking semantics, transaction propagation effects
- JVM behaviour — GC algorithm details, memory layout, JIT optimisations,
  classloading order, `String` interning specifics
- Maven or Gradle behaviour — lifecycle phases, plugin goals, dependency
  resolution and scope rules
- benchmark results, performance numbers, or "X is N× faster" claims
- version histories, JEP numbers, or "this was added in Java N" claims

**When uncertain, verify against current official documentation** (JDK
javadoc/JLS, Spring reference docs, Hibernate/Jakarta Persistence docs, Maven
docs). If it cannot be verified, either omit it or mark it explicitly:

> *Unverified: this reflects expected behaviour but was not confirmed against
> documentation or by execution. Verify before relying on it.*

**Version claims need care.** Java 17 is the baseline (see `README.md` §3). If a
feature needs a newer release, say which release and say it inline. Never
present a preview API as stable. If you are unsure whether a feature is final or
preview in a given release, check — do not guess.

**Benchmarks are earned, not asserted.** Never state a performance figure you
did not actually measure. If you did measure it, record how (hardware, JDK
version, warmup, tool). Otherwise speak qualitatively about algorithmic
complexity and mechanism, not numbers.

---

## 5. No duplication — one primary location per concept

Every concept has **exactly one primary module** that owns it — the place where
it is taught properly, in depth, once.

- Later modules that touch the concept **cross-link** to the owning module
  ("`HashMap` internals are covered in Module 12; here we only use them").
- Later modules must **not re-teach** the concept from scratch.
- If a concept appears to have no owner, that is a curriculum gap — report it,
  do not quietly create a second home for it.
- Recap is allowed only as a one- or two-line pointer, never as a re-explanation.

`docs/CURRICULUM.md` records primary ownership per module. Consult it before
writing anything that feels like it might already be taught elsewhere.

---

## 6. Practice-first methodology is mandatory

The methodology in `README.md` §5 —
**Learn → Predict → Code → Compile → Run → Observe → Debug → Modify → Solve →
Explain** — is a requirement, not a template to aspire to.

- Explanation exists to enable practice; practice is not an appendix.
- Every chapter needs runnable, complete programs — not fragments — plus
  predict-output questions, a guided lab, unaided practice problems, hints kept
  separate from solutions, and worked solutions.
- A chapter with excellent prose and no working exercises is **incomplete**.
- Respect the learner profile in `README.md` §2: do not teach variables, loops,
  `if` statements, functions, or basic arrays. Teach the mechanism, the delta
  from C++/JavaScript, and the failure modes.

Chapters are delivered through the full workflow in `README.md` §6, in order,
one chapter at a time, ending in **STOP**.

---

## 7. Existence is not completion

**A folder or file existing does NOT mean a module or chapter is done.**
Scaffolding is not progress. Never infer status from the filesystem's shape;
infer it only from the files' actual contents, and record it with this
vocabulary:

| Status | Meaning |
|---|---|
| `NOT_STARTED` | Nothing exists for it |
| `FOUNDATION_ONLY` | Structure/scaffolding/placeholders only; no real content |
| `IN_PROGRESS` | Partially built; explicitly incomplete |
| `CONTENT_COMPLETE` | All content written, but not yet verified by execution |
| `VERIFIED` | Content complete **and** every example actually compiled and run |

Use these exact tokens in `docs/PROJECT_STATE.md`. Never write "done",
"finished", or "complete" without one of them. Never promote a status without
doing the work that the higher status asserts.

---

## 8. Non-destructive development

- **Inspect before you overwrite.** Read a file's current contents before
  writing over it. If it contains work you did not create, do not replace it —
  understand it, then extend or amend it.
- Prefer additive and targeted edits over wholesale rewrites.
- Never delete content because it is unfamiliar or because rewriting is easier.
- Never delete or restructure directories that are not yours to restructure.
- If a rewrite is genuinely warranted, say what you are replacing and why
  **before** doing it, and record the decision in `docs/PROJECT_STATE.md`.
- Learner progress lives in `localStorage` keyed by module/chapter IDs; changes
  that would invalidate stored progress are destructive too, and need the same
  care.

---

## 9. Documentation must be updated after every meaningful unit of work

A unit of work is not finished until the documentation matches reality.

**Always update `docs/PROJECT_STATE.md`** — phase, current module, current
chapter, completed items, partial work, next required task, known bugs, known
limitations, decisions made, verification status, and the `Last updated` date
(use the actual date).

**Also update** when relevant: `docs/ARCHITECTURE.md` when a structural decision
is made or a "Planned" section becomes real; `README.md` when the project's
shape, status, or workflow changes; `docs/CURRICULUM.md` only for permitted
topic clarifications, never structural change.

Do not leave documentation updates "for later". Later is a different session
with no memory of what you did.

---

## 10. Never claim testing or verification that did not happen

- Say "compiles" only if you compiled it. Say "runs" only if you ran it and
  observed the output. Say "works" only if you saw it work.
- If you could not verify something, state it explicitly and completely:

  > **Not verified because:** no JDK is available in this environment.

  > **Not verified because:** this requires a running PostgreSQL instance.

  > **Not verified because:** this phase produced documentation only; there is
  > nothing executable to run.

- Never mark a chapter or module `VERIFIED` on the strength of a code reading.
  `VERIFIED` means it was executed.
- Report failures faithfully. If tests fail, show the output and say so. A
  passing-looking summary over a failing build is a serious defect in this
  project.
- Do not claim anything about parts of the system that do not exist yet.

---

## 11. Git safety

- **Work on the designated branch** for the task. Create it locally if needed.
- **Never force-push** (`--force`, `--force-with-lease`) except in the single
  narrow case the task instructions explicitly sanction.
- **Never rewrite history** — no `rebase` of pushed commits, no `commit
  --amend` on pushed commits, no `filter-branch`, no history surgery.
- **Never run destructive resets** — no `git reset --hard`, no `git clean -fd`,
  no `git checkout -- .` over uncommitted work you did not create.
- **Never delete branches** you did not create, and never delete remote
  branches.
- Commit in coherent units with descriptive messages that say what changed and
  why.
- Push with `git push -u origin <branch-name>`. On network failure, retry with
  exponential backoff (2s, 4s, 8s, 16s).
- **Do not open a pull request** unless explicitly asked to.
- Never commit secrets, API keys, or tokens. The Phase 5 execution proxy, if it
  ever exists, keeps its key in the environment — never in the repository and
  never in client-side JavaScript.

---

## 12. Scope discipline and stopping

- Do exactly the phase or chapter requested. Nothing more.
- Do not start the next phase because the current one finished early.
- Do not build website UI, module content, or execution integration ahead of
  their phase.
- Phases 3, 4, and 6 have not been specified. Do not invent scope for them.
- End every unit of work by reporting what you did, what you verified, what you
  did **not** verify and why — then **STOP** and wait for explicit instruction.

---

## 13. Communication standards

- Be direct and factual. No inflated claims about completeness or quality.
- Distinguish clearly between what exists, what is planned, and what is assumed.
- Surface problems early — a curriculum gap, an unverifiable claim, an
  architectural conflict — rather than papering over them.
- When you correct an earlier error, correct it plainly and move on.
