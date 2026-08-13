/**
 * module-view.js — the module overview, rendered from metadata.
 *
 * Route: #/module/<id>, e.g. #/module/01-java-foundations-execution-model
 *
 * This shows what a module WILL cover, drawn from docs/CURRICULUM.md via
 * data/modules.js. It is a coverage list, not taught content — the distinction
 * matters, and the page says so rather than letting a long topic list imply
 * that the module has been written.
 */

import { MODULES } from '../../data/modules.js';
import { PLANNED_CHAPTERS } from '../../data/chapters.js';
import { chapterHref, chaptersForModule } from './chapters.js';
import { el, replaceChildren } from './dom.js';
import { LEARNER_STATUS, getModuleProgress, isChapterComplete, recordVisit, setModuleStatus } from './progress.js';

/** Learner-side labels — see progress.js on the two status axes. */
const LEARNER_LABEL = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
};

/** Content-side labels — what exists in the repository, from data/modules.js. */
const CONTENT_LABEL = {
  NOT_STARTED: 'Not written',
  FOUNDATION_ONLY: 'Foundation only',
  IN_PROGRESS: 'Being written',
  CONTENT_COMPLETE: 'Written, unverified',
  VERIFIED: 'Written and verified',
};

/** @param {string} id @returns {object|undefined} */
export function findModule(id) {
  return MODULES.find((m) => m.id === id);
}

function prerequisiteList(module) {
  if (module.prerequisites.length === 0) {
    // The master brief's Section 12 states no per-module prerequisites, and they
    // are deliberately not inferred from module order. See data/modules.js.
    return el('p', {
      class: 'module-meta__value module-meta__value--muted',
      text: 'Not specified by the master brief',
    });
  }

  const links = [];
  for (const [i, number] of module.prerequisites.entries()) {
    const prereq = MODULES.find((m) => m.number === number);
    if (!prereq) continue;
    if (i > 0) links.push(', ');
    links.push(el('a', {
      href: `#/module/${prereq.id}`,
      text: prereq.number,
      title: prereq.name,
    }));
  }
  return el('p', { class: 'module-meta__value' }, links);
}

function topicSection(module) {
  return el('section', { class: 'module-section' }, [
    el('h2', { class: 'module-section__title', text: 'Topics this module will cover' }),
    el('p', { class: 'module-section__note' }, [
      'The coverage specification from ',
      el('code', { text: 'docs/MASTER_BRIEF.md' }),
      ' \u00a7 12 — what the module must teach when it is written. It is not the lesson itself.',
    ]),
    el('ul', { class: 'topic-list topic-list--flat' },
      module.topics.map((topic) => el('li', { text: topic }))),
  ]);
}

/**
 * Sub-sections the brief attaches to a module. Only Module 42 uses these today
 * (its seven named projects), so the section is omitted entirely when empty.
 */
function subsectionSection(module) {
  if (module.subsections.length === 0) return null;

  return el('section', { class: 'module-section' }, [
    el('h2', { class: 'module-section__title', text: 'Projects' }),
    el('ol', { class: 'subsection-list' }, module.subsections.map((sub) =>
      el('li', { class: 'subsection' }, [
        el('span', { class: 'subsection__heading', text: sub.heading }),
        sub.text ? el('span', { class: 'subsection__text', text: sub.text }) : null,
      ]))),
  ]);
}

/**
 * Emphasis the master brief attaches to this module — e.g. Module 08's extra
 * depth requirement. These are requirements, so they are shown, not hidden.
 */
function notesSection(module) {
  if (module.notes.length === 0) return null;

  return el('section', { class: 'module-note' }, [
    el('h2', { class: 'module-note__title', text: 'From the master brief' }),
    el('ul', { class: 'module-note__list' },
      module.notes.map((note) => el('li', { text: note }))),
  ]);
}

/**
 * ============================ TEMPORARY SCAFFOLDING ============================
 * A manual "mark this module started/complete" control.
 *
 * It exists ONLY because Phase 4 built progress persistence before any chapters
 * or exercises exist to complete — without it there would be no way to exercise
 * or verify the store. It is deliberately conspicuous rather than tucked away,
 * so it cannot quietly become a feature.
 *
 * REPLACE THIS when chapters land: completion should then follow from actually
 * finishing chapters and exercises, via setChapterComplete / setExerciseSolved.
 * Recorded as temporary in docs/PROJECT_STATE.md.
 * ==============================================================================
 */
function devProgressControl(module, progress) {
  const button = (label, status, current) => el('button', {
    class: `button button--subtle${current === status ? ' is-active' : ''}`,
    type: 'button',
    'aria-pressed': String(current === status),
    text: label,
    dataset: { devStatus: status },
    on: {
      click: () => {
        setModuleStatus(module.id, status);
        // Re-render this view so the badge and control reflect the new state.
        renderModule(module.id);
      },
    },
  });

  const current = progress.learnerStatus;

  return el('section', { class: 'dev-control' }, [
    el('p', { class: 'dev-control__tag', text: 'TEMPORARY SCAFFOLDING' }),
    el('h2', { class: 'dev-control__title', text: 'Mark your progress manually' }),
    el('p', { class: 'dev-control__note' }, [
      'No chapters or exercises exist yet, so there is nothing to complete '
      + 'normally. These buttons write to the same progress store real completion '
      + 'will use, so persistence can be verified now. They are removed once '
      + 'chapters land.',
    ]),
    el('div', { class: 'dev-control__buttons' }, [
      button('Not started', LEARNER_STATUS.NOT_STARTED, current),
      button('In progress', LEARNER_STATUS.IN_PROGRESS, current),
      button('Completed', LEARNER_STATUS.COMPLETED, current),
    ]),
    progress.startedAt
      ? el('p', { class: 'dev-control__stamp', text: `Started ${new Date(progress.startedAt).toLocaleString()}` })
      : null,
    progress.completedAt
      ? el('p', { class: 'dev-control__stamp', text: `Completed ${new Date(progress.completedAt).toLocaleString()}` })
      : null,
  ]);
}

function chapterSection(module) {
  const chapters = chaptersForModule(module.id);
  const planned = PLANNED_CHAPTERS[module.id] ?? [];

  // Chapters that are planned but not written are listed as such, greyed and
  // unlinked. Showing them keeps the module's shape honest — the learner can
  // see this chapter is one of four, not the whole module — while never
  // implying content exists. Modules with no plan recorded show nothing extra.
  const unwritten = planned.filter((p) => !chapters.some((c) => c.id === p.id));

  return el('section', { class: 'module-section' }, [
    el('h2', { class: 'module-section__title', text: 'Chapters' }),

    chapters.length === 0
      ? el('p', { class: 'empty-state', text: 'No chapters yet. This module has not been written.' })
      : el('ul', { class: 'chapter-list' }, chapters.map((chapter) => el('li', { class: 'chapter-row' }, [
        el('a', { class: 'chapter-row__link', href: chapterHref(chapter.id) }, [
          el('span', { class: 'chapter-row__number', text: String(chapter.number) }),
          el('span', { class: 'chapter-row__body' }, [
            el('span', { class: 'chapter-row__title', text: chapter.title }),
            el('span', { class: 'chapter-row__summary', text: chapter.summary }),
          ]),
        ]),
        isChapterComplete(module.id, chapter.id)
          ? el('span', { class: 'chapter-row__done', text: 'Completed' })
          : null,
      ]))),

    unwritten.length > 0
      ? el('ul', { class: 'chapter-list chapter-list--planned' }, unwritten.map((p) => el('li', {
        class: 'chapter-row chapter-row--planned',
      }, [
        el('span', { class: 'chapter-row__number', text: String(p.number) }),
        el('span', { class: 'chapter-row__body' }, [
          el('span', { class: 'chapter-row__title', text: p.title }),
          el('span', { class: 'chapter-row__summary', text: 'Planned — not written yet' }),
        ]),
      ]))) : null,
  ]);
}

/**
 * Render a module overview.
 *
 * @param {string} id
 * @returns {boolean} false when the id matches no module, so the router can 404
 */
export function renderModule(id) {
  const container = document.getElementById('module-body');
  if (!container) return false;

  const module = findModule(id);
  if (!module) return false;

  // Visiting a module is the trackable event that exists today, so it drives
  // "current position" and "recently visited" on the dashboard.
  recordVisit(module.id);

  const progress = getModuleProgress(module.id);
  const learnerLabel = LEARNER_LABEL[progress.learnerStatus] ?? progress.learnerStatus;
  const contentLabel = CONTENT_LABEL[progress.contentStatus] ?? progress.contentStatus;
  const topicCount = module.topics.length;

  replaceChildren(container, [
    el('header', { class: 'module-header' }, [
      el('p', { class: 'view__eyebrow', text: `Module ${module.number} of 43` }),
      el('h1', { class: 'view__title' }, [
        el('span', { class: 'module-header__number', text: module.number }),
        module.name,
      ]),
      el('p', { class: 'view__lede', text: module.description }),
      el('div', { class: 'module-badges' }, [
        el('span', {
          class: `status-pill status-pill--${progress.learnerStatus.toLowerCase()}`,
          text: learnerLabel,
          title: 'Your progress',
        }),
        el('span', { class: 'badge', text: contentLabel, title: 'What exists in the repository' }),
        el('span', { class: 'badge', text: `${chaptersForModule(module.id).length} chapters` }),
        el('span', { class: 'badge', text: `${topicCount} topics` }),
      ]),
    ]),

    el('div', { class: 'module-meta' }, [
      el('div', {}, [
        el('h2', { class: 'module-meta__label', text: 'Prerequisites' }),
        prerequisiteList(module),
      ]),
      el('div', {}, [
        el('h2', { class: 'module-meta__label', text: 'Position' }),
        el('p', { class: 'module-meta__value', text: `Module ${module.number} in curriculum order` }),
      ]),
    ]),

    devProgressControl(module, progress),
    notesSection(module),
    chapterSection(module),
    subsectionSection(module),
    topicSection(module),
  ]);

  return true;
}
