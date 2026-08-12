/**
 * progress.js — learner progress, persisted in `localStorage`.
 *
 * This is the ONLY progress API. Every view reads and writes through it; no
 * view touches storage directly. Phase 3 shipped this file as a stub returning
 * zeros; Phase 4 made it real, keeping the same function shapes so the views
 * did not have to be rewritten around it.
 *
 * ============================ TWO STATUS AXES ============================
 * These are different things and must not be conflated:
 *
 *   CONTENT status  — what exists in this repository, from data/modules.js.
 *                     Vocabulary: NOT_STARTED / FOUNDATION_ONLY / IN_PROGRESS /
 *                     CONTENT_COMPLETE / VERIFIED. All 43 are NOT_STARTED,
 *                     because no chapter content has been written.
 *   LEARNER status  — what the learner has done, from this store.
 *                     Vocabulary: NOT_STARTED / IN_PROGRESS / COMPLETED.
 *
 * A module can be CONTENT `NOT_STARTED` and LEARNER `IN_PROGRESS` — that just
 * means the learner marked an unwritten module as started. `getModuleProgress`
 * returns both, named distinctly.
 * =========================================================================
 *
 * Keys are the PERMANENT module ids from data/modules.js (e.g.
 * `08-hashing-hashmap-internals`), never an array index or display position —
 * the curriculum is locked to docs/MASTER_BRIEF.md precisely so these ids are
 * stable. See docs/CURRICULUM.md Appendix B.
 *
 * Storage shape is documented in docs/ARCHITECTURE.md §10.
 */

import { MODULES } from '../../data/modules.js';
import { KEY_PREFIX, isAvailable, readJSON, remove, writeJSON } from './storage.js';

/** Single aggregate record. One read, one write, no key scanning. */
export const PROGRESS_KEY = `${KEY_PREFIX}progress`;

/**
 * Bump when the stored shape changes, and add a migration below. Never reuse a
 * version number, and never silently discard a learner's records.
 */
export const SCHEMA_VERSION = 1;

/** Learner-side status vocabulary — distinct from the content vocabulary. */
export const LEARNER_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

/** How many recent visits to retain. */
const RECENT_LIMIT = 8;

/** True now that persistence is real — the UI uses this to stop disclaiming. */
export const HAS_PERSISTENCE = true;

/* ==========================================================================
   State
   ========================================================================== */

/** @returns {object} a valid, empty record */
function emptyState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: null,
    modules: {},      // moduleId -> { status, startedAt, completedAt, chapters, exercises }
    assessments: {},  // assessmentId -> { score, max, takenAt }
    position: null,   // { moduleId, chapterId, visitedAt }
    recent: [],       // [{ moduleId, chapterId, visitedAt }] most recent first
  };
}

/**
 * Migrate a stored record forward.
 *
 * Only version 1 exists, so there is nothing to migrate yet. The branch is here
 * so the next schema change has an obvious home and cannot be "solved" by
 * wiping the record — discarding learner progress on upgrade is a destructive
 * change this project does not accept (CLAUDE.md §8).
 *
 * @returns {object|null} migrated state, or null if unrecognisable
 */
function migrate(stored) {
  if (!stored || typeof stored !== 'object') return null;

  const version = Number(stored.schemaVersion);
  if (!Number.isInteger(version) || version < 1) return null;

  // A record written by a FUTURE version cannot be understood. Do not touch it:
  // treat this session as having no progress rather than overwriting and
  // destroying data a newer build owns.
  if (version > SCHEMA_VERSION) return null;

  // if (version === 1) { ...transform to 2...; }

  return stored;
}

/** Coerce a loaded record into something every accessor can rely on. */
function normalise(stored) {
  const base = emptyState();
  if (!stored) return base;

  return {
    ...base,
    ...stored,
    schemaVersion: SCHEMA_VERSION,
    modules: stored.modules && typeof stored.modules === 'object' ? stored.modules : {},
    assessments: stored.assessments && typeof stored.assessments === 'object' ? stored.assessments : {},
    recent: Array.isArray(stored.recent) ? stored.recent : [],
    position: stored.position && typeof stored.position === 'object' ? stored.position : null,
  };
}

/** @type {object|null} in-memory cache; storage is read once per page view */
let state = null;

function load() {
  if (state === null) {
    state = normalise(migrate(readJSON(PROGRESS_KEY, null)));
  }
  return state;
}

/* ==========================================================================
   Change notification
   ========================================================================== */

const listeners = new Set();

/**
 * Subscribe to progress changes so a view can re-render itself.
 * @param {() => void} listener
 * @returns {() => void} unsubscribe
 */
export function onProgressChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist() {
  state.updatedAt = new Date().toISOString();
  writeJSON(PROGRESS_KEY, state);
  for (const listener of listeners) listener();
}

/** Get (creating if needed) the record for one module. */
function moduleRecord(moduleId) {
  const current = load();
  if (!current.modules[moduleId]) {
    current.modules[moduleId] = {
      status: LEARNER_STATUS.NOT_STARTED,
      startedAt: null,
      completedAt: null,
      chapters: {},
      exercises: {},
    };
  }
  const record = current.modules[moduleId];
  if (!record.chapters || typeof record.chapters !== 'object') record.chapters = {};
  if (!record.exercises || typeof record.exercises !== 'object') record.exercises = {};
  return record;
}

/** Guard against writing progress for an id that is not in the curriculum. */
function isKnownModule(moduleId) {
  return MODULES.some((m) => m.id === moduleId);
}

/* ==========================================================================
   Writes
   ========================================================================== */

/**
 * Set a module's learner status directly.
 * @param {string} moduleId permanent id from data/modules.js
 * @param {'NOT_STARTED'|'IN_PROGRESS'|'COMPLETED'} status
 * @returns {boolean} false when the id is unknown
 */
export function setModuleStatus(moduleId, status) {
  if (!isKnownModule(moduleId)) {
    console.warn(`progress.js: unknown module id "${moduleId}" — ignoring.`);
    return false;
  }
  if (!Object.hasOwn(LEARNER_STATUS, status)) return false;

  const record = moduleRecord(moduleId);
  const now = new Date().toISOString();

  record.status = status;
  if (status === LEARNER_STATUS.NOT_STARTED) {
    record.startedAt = null;
    record.completedAt = null;
  } else {
    record.startedAt ??= now;
    record.completedAt = status === LEARNER_STATUS.COMPLETED ? now : null;
  }

  persist();
  return true;
}

/**
 * Mark a chapter complete or not.
 *
 * No chapters exist yet, so nothing calls this in Phase 4 — it is the path real
 * completion will take once chapters land, and it is exercised by the tests.
 *
 * @param {string} moduleId
 * @param {string} chapterId
 * @param {boolean} [complete]
 */
export function setChapterComplete(moduleId, chapterId, complete = true) {
  if (!isKnownModule(moduleId)) return false;

  const record = moduleRecord(moduleId);
  if (complete) {
    record.chapters[chapterId] = { completedAt: new Date().toISOString() };
    if (record.status === LEARNER_STATUS.NOT_STARTED) {
      record.status = LEARNER_STATUS.IN_PROGRESS;
      record.startedAt ??= new Date().toISOString();
    }
  } else {
    delete record.chapters[chapterId];
  }

  persist();
  return true;
}

/** Flip a chapter's completion. @returns {boolean} its new state */
export function toggleChapterComplete(moduleId, chapterId) {
  const done = Boolean(moduleRecord(moduleId).chapters[chapterId]);
  setChapterComplete(moduleId, chapterId, !done);
  return !done;
}

/**
 * Record that an exercise was solved.
 *
 * This is the plumbing the practice shells call. No real exercises exist yet
 * (Phase 4 ships shells only), but the demo placeholder exercises the path.
 *
 * @param {string} moduleId
 * @param {string} exerciseId
 * @param {boolean} [solved]
 */
export function setExerciseSolved(moduleId, exerciseId, solved = true) {
  if (!isKnownModule(moduleId)) return false;

  const record = moduleRecord(moduleId);
  if (solved) {
    record.exercises[exerciseId] = { solvedAt: new Date().toISOString() };
  } else {
    delete record.exercises[exerciseId];
  }

  persist();
  return true;
}

/** @param {string} moduleId @param {string} exerciseId */
export function isExerciseSolved(moduleId, exerciseId) {
  return Boolean(load().modules[moduleId]?.exercises?.[exerciseId]);
}

/**
 * Record an assessment result.
 * @param {string} assessmentId
 * @param {number} score
 * @param {number} max
 */
export function recordAssessmentScore(assessmentId, score, max) {
  const current = load();
  current.assessments[assessmentId] = {
    score: Number(score) || 0,
    max: Number(max) || 0,
    takenAt: new Date().toISOString(),
  };
  persist();
  return true;
}

/**
 * Record that the learner visited something — drives "current position" and
 * "recently studied".
 *
 * @param {string} moduleId
 * @param {string|null} [chapterId]
 */
export function recordVisit(moduleId, chapterId = null) {
  if (!isKnownModule(moduleId)) return false;

  const current = load();

  // renderModule() calls this on every render, so skip the write when the
  // position is unchanged. Without this, simply re-rendering a page would
  // persist and notify on every keystroke-sized interaction.
  if (current.position?.moduleId === moduleId && current.position?.chapterId === chapterId) {
    return true;
  }

  const visitedAt = new Date().toISOString();
  current.position = { moduleId, chapterId, visitedAt };

  // Most recent first, de-duplicated on module+chapter, capped.
  current.recent = [
    { moduleId, chapterId, visitedAt },
    ...current.recent.filter((v) => !(v.moduleId === moduleId && v.chapterId === chapterId)),
  ].slice(0, RECENT_LIMIT);

  persist();
  return true;
}

/**
 * Clear ALL progress.
 *
 * Deliberately removes only the progress record. The theme preference lives
 * under a separate key and is NOT touched — resetting what you have studied
 * should not also flip the site back to light mode.
 */
export function resetProgress() {
  remove(PROGRESS_KEY);
  state = emptyState();
  for (const listener of listeners) listener();
  return true;
}

/* ==========================================================================
   Reads and rollups
   ========================================================================== */

function percentOf(done, total) {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

/**
 * Progress for one module.
 *
 * @param {string} moduleId
 * @returns {{
 *   contentStatus: string, learnerStatus: string,
 *   completedChapters: number, chapterCount: number, percent: number,
 *   solvedExercises: number, startedAt: string|null, completedAt: string|null,
 *   status: string
 * }|null}
 */
export function getModuleProgress(moduleId) {
  const module = MODULES.find((m) => m.id === moduleId);
  if (!module) return null;

  const record = load().modules[moduleId];
  const completedChapters = record ? Object.keys(record.chapters ?? {}).length : 0;
  const learnerStatus = record?.status ?? LEARNER_STATUS.NOT_STARTED;

  return {
    // What exists in the repository (data/modules.js).
    contentStatus: module.status,
    // What the learner has done (this store).
    learnerStatus,
    completedChapters,
    chapterCount: module.chapterCount,
    // 0 chapters means there is genuinely nothing to complete; a module the
    // learner marked COMPLETED reads 100 because that reflects a real action.
    percent: module.chapterCount > 0
      ? percentOf(completedChapters, module.chapterCount)
      : (learnerStatus === LEARNER_STATUS.COMPLETED ? 100 : 0),
    solvedExercises: record ? Object.keys(record.exercises ?? {}).length : 0,
    startedAt: record?.startedAt ?? null,
    completedAt: record?.completedAt ?? null,

    /** @deprecated Ambiguous. Kept so existing callers keep working; prefer
     *  `learnerStatus` (what the learner did) or `contentStatus` (what exists). */
    status: learnerStatus,
  };
}

/**
 * Curriculum-wide rollup.
 *
 * Two percentages, because they answer different questions and neither is
 * invented: `modulePercent` over the 43 modules (a denominator that exists
 * today), and `chapterPercent` over chapters (0/0 while none are written).
 */
export function getOverallProgress() {
  const current = load();
  let modulesCompleted = 0;
  let modulesStarted = 0;
  let completedChapters = 0;
  let solvedExercises = 0;

  for (const module of MODULES) {
    const record = current.modules[module.id];
    if (!record) continue;
    if (record.status === LEARNER_STATUS.COMPLETED) modulesCompleted += 1;
    if (record.status === LEARNER_STATUS.IN_PROGRESS) modulesStarted += 1;
    completedChapters += Object.keys(record.chapters ?? {}).length;
    solvedExercises += Object.keys(record.exercises ?? {}).length;
  }

  const totalChapters = MODULES.reduce((n, m) => n + m.chapterCount, 0);

  return {
    modulesCompleted,
    modulesStarted,
    totalModules: MODULES.length,
    modulePercent: percentOf(modulesCompleted, MODULES.length),
    completedChapters,
    totalChapters,
    chapterPercent: percentOf(completedChapters, totalChapters),
    solvedExercises,
  };
}

/**
 * Where the learner is.
 * @returns {{moduleId, moduleName, moduleNumber, chapterId, visitedAt}|null}
 */
export function getCurrentPosition() {
  const position = load().position;
  if (!position) return null;

  const module = MODULES.find((m) => m.id === position.moduleId);
  if (!module) return null; // stale id, e.g. from before the curriculum realignment

  return {
    moduleId: module.id,
    moduleName: module.name,
    moduleNumber: module.number,
    chapterId: position.chapterId ?? null,
    visitedAt: position.visitedAt,
  };
}

/**
 * Recently visited modules, most recent first.
 *
 * Named for chapters in the master brief (§24), but chapters do not exist yet,
 * so module visits are what there is to report. Entries whose module id is no
 * longer in the curriculum are dropped rather than shown as broken links.
 */
export function getRecentActivity(limit = 5) {
  return load().recent
    .map((visit) => {
      const module = MODULES.find((m) => m.id === visit.moduleId);
      return module ? { module, chapterId: visit.chapterId, visitedAt: visit.visitedAt } : null;
    })
    .filter(Boolean)
    .slice(0, limit);
}

/** @deprecated Phase 3 name. Use `getRecentActivity`. */
export const getRecentChapters = getRecentActivity;

/**
 * The next module to work on: the first in curriculum order the learner has not
 * completed. Module 01 when nothing has been done.
 *
 * @returns {{module: object, reason: string}|null} null once all 43 are complete
 */
export function getRecommendedNext() {
  const current = load();

  const inProgress = MODULES.find(
    (m) => current.modules[m.id]?.status === LEARNER_STATUS.IN_PROGRESS,
  );
  if (inProgress) return { module: inProgress, reason: 'In progress' };

  const next = MODULES.find(
    (m) => current.modules[m.id]?.status !== LEARNER_STATUS.COMPLETED,
  );
  if (!next) return null;

  return {
    module: next,
    reason: next === MODULES[0] ? 'Start of the curriculum' : 'Next incomplete module',
  };
}

/**
 * Practice rollup.
 * The denominator is the number of exercises that actually exist — 0 today,
 * since Phase 4 ships shells rather than exercises.
 * @param {number} [totalExercises]
 */
export function getPracticeProgress(totalExercises = 0) {
  const { solvedExercises } = getOverallProgress();
  return {
    solved: solvedExercises,
    total: totalExercises,
    percent: percentOf(solvedExercises, totalExercises),
  };
}

/** Assessment rollup. No assessments exist yet, so the denominator is 0. */
export function getAssessmentProgress(totalAssessments = 0) {
  const taken = Object.keys(load().assessments).length;
  return {
    completed: taken,
    total: totalAssessments,
    percent: percentOf(taken, totalAssessments),
  };
}

/** Diagnostics for the reset UI and the test suite. */
export function getStorageInfo() {
  const current = load();
  return {
    available: isAvailable,
    key: PROGRESS_KEY,
    schemaVersion: current.schemaVersion,
    updatedAt: current.updatedAt,
    moduleRecords: Object.keys(current.modules).length,
  };
}

/** Test seam: drop the in-memory cache so the next read re-reads storage. */
export function __reloadFromStorage() {
  state = null;
  return load();
}
