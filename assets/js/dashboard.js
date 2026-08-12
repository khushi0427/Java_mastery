/**
 * dashboard.js — renders the dashboard from metadata + the progress stub.
 *
 * Every number on this screen comes from data/modules.js or assets/js/progress
 * .js. Nothing is hardcoded and nothing is invented: with no chapters written
 * and no persistence until Phase 4, the honest reading is zeros and empty
 * states, and that is what renders.
 *
 * When Phase 4 replaces the progress stub with real localStorage-backed
 * values, this file should not need to change — it already reads through the
 * same accessors.
 */

import { MODULES } from '../../data/modules.js';
import { el, replaceChildren } from './dom.js';
import {
  HAS_PERSISTENCE,
  getAssessmentProgress,
  getCurrentPosition,
  getModuleProgress,
  getOverallProgress,
  getPracticeProgress,
  getRecentChapters,
  getRecommendedNext,
} from './progress.js';

const STATUS_LABEL = {
  NOT_STARTED: 'Not started',
  FOUNDATION_ONLY: 'Foundation only',
  IN_PROGRESS: 'In progress',
  CONTENT_COMPLETE: 'Content complete',
  VERIFIED: 'Verified',
};

/** A titled dashboard card. */
function card(title, children, { wide = false } = {}) {
  return el('section', { class: `card${wide ? ' card--wide' : ''}` }, [
    el('h2', { class: 'card__title', text: title }),
    ...[].concat(children),
  ]);
}

/** The "nothing here yet" line used by several cards. */
function emptyState(text) {
  return el('p', { class: 'empty-state', text });
}

/** A labelled progress bar. Renders a real 0 rather than hiding at zero. */
function meter(percent, label) {
  return el('div', { class: 'meter', role: 'img', 'aria-label': label }, [
    el('div', { class: 'meter__track' }, [
      el('div', { class: 'meter__fill', style: `width: ${percent}%` }),
    ]),
    el('span', { class: 'meter__value', text: `${percent}%` }),
  ]);
}

/* ------------------------------------------------------------------ cards */

function overallCard() {
  const overall = getOverallProgress();

  return card('Overall progress', [
    meter(overall.percent, `Overall progress: ${overall.percent} percent`),
    el('dl', { class: 'stat-row' }, [
      el('div', { class: 'stat' }, [
        el('dt', { text: 'Chapters' }),
        el('dd', { text: `${overall.completedChapters} / ${overall.totalChapters}` }),
      ]),
      el('div', { class: 'stat' }, [
        el('dt', { text: 'Modules completed' }),
        el('dd', { text: `${overall.modulesCompleted} / ${overall.totalModules}` }),
      ]),
      el('div', { class: 'stat' }, [
        el('dt', { text: 'Modules started' }),
        el('dd', { text: String(overall.modulesStarted) }),
      ]),
    ]),
    el('p', {
      class: 'card__note',
      text: overall.totalChapters === 0
        ? 'No chapters have been written yet, so there is nothing to complete. The denominator is 0, not a placeholder.'
        : '',
    }),
  ]);
}

function positionCard() {
  const position = getCurrentPosition();

  return card('Current position', position
    ? el('p', { text: `${position.moduleNumber} — ${position.chapterTitle}` })
    : emptyState('Not started. No chapter has been opened, because none exist yet.'));
}

function recommendedCard() {
  const { module, reason } = getRecommendedNext();

  return card('Recommended next', [
    el('a', { class: 'recommend', href: `#/module/${module.id}` }, [
      el('span', { class: 'recommend__number', text: module.number }),
      el('span', { class: 'recommend__body' }, [
        el('span', { class: 'recommend__name', text: module.name }),
        el('span', { class: 'recommend__reason', text: reason }),
      ]),
    ]),
    el('p', {
      class: 'card__note',
      text: 'Module content is not written yet — this links to the module overview.',
    }),
  ]);
}

function recentCard() {
  const recent = getRecentChapters();

  return card('Recently studied', recent.length === 0
    ? emptyState('Nothing yet.')
    : el('ul', { class: 'recent-list' }, recent.map((entry) =>
      el('li', {}, [el('a', { href: entry.route, text: entry.title })]))));
}

function practiceCard() {
  const practice = getPracticeProgress();

  return card('Practice', [
    el('p', { class: 'big-stat', text: `${practice.solved} / ${practice.total}` }),
    el('p', { class: 'card__note', text: 'Practice problems arrive with module content.' }),
  ]);
}

function assessmentCard() {
  const assessment = getAssessmentProgress();

  return card('Assessments', [
    el('p', { class: 'big-stat', text: `${assessment.completed} / ${assessment.total}` }),
    el('p', { class: 'card__note', text: 'Assessment format is still an open question.' }),
  ]);
}

/** Per-module progress table — reads the same metadata the sidebar does. */
function moduleProgressCard() {
  const rows = MODULES.map((module) => {
    const progress = getModuleProgress(module.id);
    const statusLabel = STATUS_LABEL[progress.status] ?? progress.status;

    return el('li', { class: 'module-progress__row' }, [
      el('a', { class: 'module-progress__link', href: `#/module/${module.id}` }, [
        el('span', { class: 'module-progress__number', text: module.number }),
        el('span', { class: 'module-progress__name', text: module.name }),
      ]),
      el('span', {
        class: `status-pill status-pill--${progress.status.toLowerCase()}`,
        text: statusLabel,
      }),
      el('span', {
        class: 'module-progress__chapters',
        text: `${progress.completedChapters}/${progress.chapterCount}`,
      }),
    ]);
  });

  return card('Progress by module', [
    el('ul', { class: 'module-progress' }, rows),
  ], { wide: true });
}

/* ------------------------------------------------------------------ render */

/** Render the dashboard into its view container. */
export function renderDashboard() {
  const container = document.getElementById('dashboard-body');
  if (!container) return;

  replaceChildren(container, [
    HAS_PERSISTENCE ? null : el('p', { class: 'banner' }, [
      el('strong', { text: 'Foundation phase. ' }),
      'Progress tracking is not implemented yet, so every figure below reads zero. '
      + 'These are real values from an empty repository, not sample data.',
    ]),
    el('div', { class: 'card-grid' }, [
      overallCard(),
      positionCard(),
      recommendedCard(),
      recentCard(),
      practiceCard(),
      assessmentCard(),
    ]),
    moduleProgressCard(),
  ]);
}
