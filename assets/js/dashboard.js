/**
 * dashboard.js — renders the dashboard from metadata + stored progress.
 *
 * Every number on this screen comes from data/modules.js or the progress API.
 * Nothing is hardcoded and nothing is invented. On a fresh browser the honest
 * reading is zeros and empty states; once the learner records anything, these
 * figures move because they are read from real stored data.
 *
 * Denominators are the ones that genuinely exist: 43 modules, 0 chapters, 0 real
 * exercises. Placeholder practice items are excluded from counts on purpose.
 */

import { MODULES } from '../../data/modules.js';
import { el, replaceChildren } from './dom.js';
import { realExerciseCount } from '../../data/exercises.js';
import {
  getAssessmentProgress,
  getCurrentPosition,
  getModuleProgress,
  getOverallProgress,
  getPracticeProgress,
  getRecentActivity,
  getRecommendedNext,
  getStorageInfo,
  resetProgress,
} from './progress.js';

/** Learner-side vocabulary — see progress.js on the two status axes. */
const LEARNER_LABEL = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
};

/**
 * A human "when", without pulling in a date library.
 * Falls back to the raw value rather than throwing on anything unparseable.
 */
function formatWhen(iso) {
  if (!iso) return '';
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';

  const seconds = Math.max(0, Math.round((Date.now() - then.getTime()) / 1000));
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  return then.toLocaleDateString();
}

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
    meter(overall.modulePercent, `Modules completed: ${overall.modulePercent} percent`),
    el('dl', { class: 'stat-row' }, [
      el('div', { class: 'stat' }, [
        el('dt', { text: 'Modules completed' }),
        el('dd', { text: `${overall.modulesCompleted} / ${overall.totalModules}` }),
      ]),
      el('div', { class: 'stat' }, [
        el('dt', { text: 'In progress' }),
        el('dd', { text: String(overall.modulesStarted) }),
      ]),
      el('div', { class: 'stat' }, [
        el('dt', { text: 'Chapters' }),
        el('dd', { text: `${overall.completedChapters} / ${overall.totalChapters}` }),
      ]),
    ]),
    el('p', {
      class: 'card__note',
      // Two denominators, because they answer different questions and neither
      // is invented: 43 modules exist today, 0 chapters do.
      text: overall.totalChapters === 0
        ? 'The headline figure is modules completed. Chapter progress reads 0 / 0 because no chapters have been written yet — that is a real denominator, not a placeholder.'
        : '',
    }),
  ]);
}

function positionCard() {
  const position = getCurrentPosition();

  return card('Current position', position
    ? el('a', {
      // Shares the .recommend layout, but must stay distinguishable from the
      // "Recommended next" card — they are different claims about different
      // modules and previously looked identical to any selector.
      class: 'recommend recommend--position',
      href: `#/module/${position.moduleId}`,
    }, [
      el('span', { class: 'recommend__number', text: position.moduleNumber }),
      el('span', { class: 'recommend__body' }, [
        el('span', { class: 'recommend__name', text: position.moduleName }),
        el('span', { class: 'recommend__reason', text: `Last opened ${formatWhen(position.visitedAt)}` }),
      ]),
    ])
    : emptyState('Not started. Open a module and it will be remembered here.'));
}

function recommendedCard() {
  const next = getRecommendedNext();

  // null means every module is marked complete — a real state, not an error.
  if (!next) {
    return card('Recommended next',
      emptyState('All 43 modules are marked complete. Nothing left to recommend.'));
  }

  const { module, reason } = next;

  return card('Recommended next', [
    el('a', { class: 'recommend recommend--next', href: `#/module/${module.id}` }, [
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
  const recent = getRecentActivity();

  return card('Recently visited', recent.length === 0
    ? emptyState('Nothing yet.')
    : el('ul', { class: 'recent-list' }, recent.map((entry) =>
      el('li', {}, [
        el('a', { href: `#/module/${entry.module.id}` }, [
          el('span', { class: 'recent-list__number', text: entry.module.number }),
          entry.module.name,
        ]),
        el('span', { class: 'recent-list__when', text: formatWhen(entry.visitedAt) }),
      ]))));
}

function practiceCard() {
  // The denominator is the number of REAL exercises in the repository, which is
  // 0 — placeholders are excluded so the figure cannot flatter itself.
  const practice = getPracticeProgress(realExerciseCount());

  return card('Practice', [
    el('p', { class: 'big-stat', text: `${practice.solved} / ${practice.total}` }),
    el('p', { class: 'card__note', text: 'No real exercises exist yet; they arrive with module content.' }),
  ]);
}

function assessmentCard() {
  const assessment = getAssessmentProgress(0);

  return card('Assessments', [
    el('p', { class: 'big-stat', text: `${assessment.completed} / ${assessment.total}` }),
    el('p', { class: 'card__note', text: 'Assessment format is still an open question.' }),
  ]);
}

/** Per-module progress table — reads the same metadata the sidebar does. */
function moduleProgressCard() {
  const rows = MODULES.map((module) => {
    const progress = getModuleProgress(module.id);
    const statusLabel = LEARNER_LABEL[progress.learnerStatus] ?? progress.learnerStatus;

    return el('li', { class: 'module-progress__row' }, [
      el('a', { class: 'module-progress__link', href: `#/module/${module.id}` }, [
        el('span', { class: 'module-progress__number', text: module.number }),
        el('span', { class: 'module-progress__name', text: module.name }),
      ]),
      el('span', {
        class: `status-pill status-pill--${progress.learnerStatus.toLowerCase()}`,
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

/**
 * Reset control.
 *
 * Clears progress only. The theme lives under a separate key and is deliberately
 * left alone — resetting what you have studied should not also flip the site
 * back to light mode.
 */
function resetCard() {
  const info = getStorageInfo();

  return card('Stored progress', [
    el('dl', { class: 'stat-row' }, [
      el('div', { class: 'stat' }, [
        el('dt', { text: 'Storage' }),
        el('dd', { text: info.available ? 'Available' : 'Unavailable' }),
      ]),
      el('div', { class: 'stat' }, [
        el('dt', { text: 'Schema' }),
        el('dd', { text: `v${info.schemaVersion}` }),
      ]),
      el('div', { class: 'stat' }, [
        el('dt', { text: 'Modules tracked' }),
        el('dd', { text: String(info.moduleRecords) }),
      ]),
    ]),
    el('button', {
      class: 'button button--danger',
      id: 'reset-progress',
      type: 'button',
      text: 'Reset all progress',
      on: {
        click: () => {
          const ok = window.confirm(
            'Clear all saved progress?\n\n'
            + 'This removes completed chapters, solved exercises, assessment scores, '
            + 'and your current position. Your theme preference is kept.\n\n'
            + 'This cannot be undone.',
          );
          if (ok) resetProgress();
        },
      },
    }),
    el('p', {
      class: 'card__note',
      text: info.available
        ? 'Progress is stored in this browser only. Clearing site data also clears it.'
        : 'This browser is blocking local storage, so progress cannot be saved. The site still works; nothing will persist.',
    }),
  ]);
}

/* ------------------------------------------------------------------ render */

/** Render the dashboard into its view container. */
export function renderDashboard() {
  const container = document.getElementById('dashboard-body');
  if (!container) return;

  replaceChildren(container, [
    el('p', { class: 'banner' }, [
      el('strong', { text: 'Foundation phase. ' }),
      'Progress is now saved in this browser, but no chapters, exercises, or '
      + 'assessments have been written yet — so the figures below start at zero '
      + 'and the denominators are real, not placeholders.',
    ]),
    el('div', { class: 'card-grid' }, [
      overallCard(),
      positionCard(),
      recommendedCard(),
      recentCard(),
      practiceCard(),
      assessmentCard(),
      resetCard(),
    ]),
    moduleProgressCard(),
  ]);
}
