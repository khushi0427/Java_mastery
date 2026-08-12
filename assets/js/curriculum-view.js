/**
 * curriculum-view.js — all 43 modules, in curriculum order.
 *
 * Route: #/curriculum
 *
 * Reads data/modules.js like every other view. The master brief defines the
 * curriculum as one ordered sequence of 43 modules with no part groupings, so
 * none are invented here.
 */

import { MODULES } from '../../data/modules.js';
import { el, replaceChildren } from './dom.js';
import { getModuleProgress } from './progress.js';

/** Learner-side labels — see progress.js on the two status axes. */
const LEARNER_LABEL = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
};

function moduleCard(module) {
  const progress = getModuleProgress(module.id);
  const statusLabel = LEARNER_LABEL[progress.learnerStatus] ?? progress.learnerStatus;
  const topicCount = module.topics.length;

  return el('li', {}, [
    el('a', { class: 'module-card', href: `#/module/${module.id}` }, [
      el('div', { class: 'module-card__head' }, [
        el('span', { class: 'module-card__number', text: module.number }),
        el('span', {
          class: `status-pill status-pill--${progress.learnerStatus.toLowerCase()}`,
          text: statusLabel,
        }),
      ]),
      el('h3', { class: 'module-card__name', text: module.name }),
      el('p', { class: 'module-card__description', text: module.description }),
      el('p', { class: 'module-card__meta', text: `${module.chapterCount} chapters · ${topicCount} topics` }),
    ]),
  ]);
}

/** Render the curriculum overview into its view container. */
export function renderCurriculum() {
  const container = document.getElementById('curriculum-body');
  if (!container) return;

  // The master brief presents the 43 modules as one ordered sequence with no
  // part/section grouping, so they render as a single ordered list rather than
  // being grouped into headings the brief does not define.
  replaceChildren(container, [
    el('p', { class: 'part__count', text: `${MODULES.length} modules, in curriculum order` }),
    el('ul', { class: 'module-cards' }, MODULES.map(moduleCard)),
  ]);
}
