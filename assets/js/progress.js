/**
 * progress.js — progress access. **STUB — Phase 3.**
 *
 * =========================================================================
 * THIS MODULE DELIBERATELY HAS NO PERSISTENCE.
 *
 * Phase 4 wires these functions to `localStorage`. Until then every one of
 * them reports the true current state of the repository: nothing has been
 * studied, because no chapter content exists to study. The zeros below are
 * facts, not placeholders — do not "fill them in" with sample data.
 *
 * The shapes returned here are the contract Phase 4 must honour, so the
 * dashboard does not need rewriting when real persistence arrives.
 * =========================================================================
 *
 * Phase 4 note: progress records will be keyed on module `id` from
 * data/modules.js (e.g. "01-java-foundations-execution-model") under the
 * `jfsm.` localStorage prefix. Those ids are permanent — see
 * docs/CURRICULUM.md Appendix B.
 */

import { MODULES } from '../../data/modules.js';

/** Percentage helper that survives the 0-of-0 case rather than yielding NaN. */
function percent(done, total) {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

/**
 * Progress for one module.
 * @param {string} moduleId
 * @returns {{status: string, completedChapters: number, chapterCount: number, percent: number}|null}
 */
export function getModuleProgress(moduleId) {
  const module = MODULES.find((m) => m.id === moduleId);
  if (!module) return null;

  return {
    // Status comes from the metadata layer, which reports what exists in the
    // repository. Phase 4 adds learner-driven state on top of it.
    status: module.status,
    completedChapters: 0,
    chapterCount: module.chapterCount,
    percent: percent(0, module.chapterCount),
  };
}

/**
 * Progress across the whole curriculum.
 * @returns {{completedChapters: number, totalChapters: number, percent: number,
 *            modulesCompleted: number, modulesStarted: number, totalModules: number}}
 */
export function getOverallProgress() {
  const totalChapters = MODULES.reduce((sum, m) => sum + m.chapterCount, 0);

  return {
    completedChapters: 0,
    totalChapters,
    percent: percent(0, totalChapters),
    modulesCompleted: 0,
    modulesStarted: 0,
    totalModules: MODULES.length,
  };
}

/**
 * Where the learner currently is.
 * @returns {null} always, in Phase 3 — nothing has been started.
 */
export function getCurrentPosition() {
  return null;
}

/**
 * Recently studied chapters, most recent first.
 * @returns {Array} always empty in Phase 3.
 */
export function getRecentChapters() {
  return [];
}

/**
 * The module to suggest next.
 *
 * With no progress recorded, the sensible entry point is the first module in
 * curriculum order. Phase 4 replaces this with "first incomplete module".
 *
 * @returns {{module: object, reason: string}}
 */
export function getRecommendedNext() {
  return {
    module: MODULES[0],
    reason: 'Start of the curriculum',
  };
}

/**
 * Practice problems attempted/solved.
 * @returns {{solved: number, total: number, percent: number}}
 */
export function getPracticeProgress() {
  // No practice problems exist yet, so the denominator is genuinely 0.
  return { solved: 0, total: 0, percent: percent(0, 0) };
}

/**
 * Assessments completed.
 * @returns {{completed: number, total: number, percent: number}}
 */
export function getAssessmentProgress() {
  return { completed: 0, total: 0, percent: percent(0, 0) };
}

/** True once Phase 4 provides real persistence. Lets the UI label itself honestly. */
export const HAS_PERSISTENCE = false;
