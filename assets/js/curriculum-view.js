/**
 * curriculum-view.js — the full curriculum, grouped by part.
 *
 * Route: #/curriculum
 *
 * Reads data/modules.js like every other view. Parts are a presentation
 * grouping only — they carry no identity and no progress state
 * (docs/ARCHITECTURE.md §5), which is why modules are keyed by number here and
 * parts are just headings.
 */

import { MODULES } from '../../data/modules.js';
import { el, replaceChildren } from './dom.js';
import { getModuleProgress } from './progress.js';

const STATUS_LABEL = {
  NOT_STARTED: 'Not started',
  FOUNDATION_ONLY: 'Foundation only',
  IN_PROGRESS: 'In progress',
  CONTENT_COMPLETE: 'Content complete',
  VERIFIED: 'Verified',
};

function moduleCard(module) {
  const progress = getModuleProgress(module.id);
  const statusLabel = STATUS_LABEL[progress.status] ?? progress.status;
  const topicCount = module.topics.reduce((n, g) => n + g.items.length, 0);

  return el('li', {}, [
    el('a', { class: 'module-card', href: `#/module/${module.id}` }, [
      el('div', { class: 'module-card__head' }, [
        el('span', { class: 'module-card__number', text: module.number }),
        el('span', {
          class: `status-pill status-pill--${progress.status.toLowerCase()}`,
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

  // Preserve curriculum order; group consecutive modules under their part.
  const parts = [];
  for (const module of MODULES) {
    const last = parts[parts.length - 1];
    if (!last || last.name !== module.part) {
      parts.push({ name: module.part, modules: [module] });
    } else {
      last.modules.push(module);
    }
  }

  replaceChildren(container, parts.map((part) =>
    el('section', { class: 'part' }, [
      el('h2', { class: 'part__title', text: part.name ?? 'Modules' }),
      el('p', {
        class: 'part__count',
        text: `Modules ${part.modules[0].number}–${part.modules[part.modules.length - 1].number}`,
      }),
      el('ul', { class: 'module-cards' }, part.modules.map(moduleCard)),
    ])));
}
