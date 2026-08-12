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
import { el, replaceChildren } from './dom.js';
import { getModuleProgress } from './progress.js';

const STATUS_LABEL = {
  NOT_STARTED: 'Not started',
  FOUNDATION_ONLY: 'Foundation only',
  IN_PROGRESS: 'In progress',
  CONTENT_COMPLETE: 'Content complete',
  VERIFIED: 'Verified',
};

/** @param {string} id @returns {object|undefined} */
export function findModule(id) {
  return MODULES.find((m) => m.id === id);
}

function prerequisiteList(module) {
  if (module.prerequisites.length === 0) {
    return el('p', { class: 'module-meta__value', text: 'None' });
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
  const groups = module.topics.map((group) =>
    el('div', { class: 'topic-group' }, [
      el('h3', { class: 'topic-group__title', text: group.group }),
      group.items.length > 0
        ? el('ul', { class: 'topic-list' },
          group.items.map((item) => el('li', { text: item })))
        : null,
    ]));

  return el('section', { class: 'module-section' }, [
    el('h2', { class: 'module-section__title', text: 'Topics this module will cover' }),
    el('p', { class: 'module-section__note' }, [
      'This is the coverage specification from ',
      el('code', { text: 'docs/CURRICULUM.md' }),
      ' — what the module must teach when it is written. It is not the lesson itself.',
    ]),
    el('div', { class: 'topic-groups' }, groups),
  ]);
}

function chapterSection(module) {
  return el('section', { class: 'module-section' }, [
    el('h2', { class: 'module-section__title', text: 'Chapters' }),
    module.chapterCount === 0
      ? el('p', { class: 'empty-state', text: 'No chapters yet. This module has not been written.' })
      : el('ul', { class: 'chapter-list' }),
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

  const progress = getModuleProgress(module.id);
  const statusLabel = STATUS_LABEL[progress.status] ?? progress.status;
  const topicCount = module.topics.reduce((n, g) => n + g.items.length, 0);

  replaceChildren(container, [
    el('header', { class: 'module-header' }, [
      el('p', { class: 'view__eyebrow', text: module.part ?? 'Curriculum' }),
      el('h1', { class: 'view__title' }, [
        el('span', { class: 'module-header__number', text: module.number }),
        module.name,
      ]),
      el('p', { class: 'view__lede', text: module.description }),
      el('div', { class: 'module-badges' }, [
        el('span', {
          class: `status-pill status-pill--${progress.status.toLowerCase()}`,
          text: statusLabel,
        }),
        el('span', { class: 'badge', text: `${module.chapterCount} chapters` }),
        el('span', { class: 'badge', text: `${module.topics.length} topic groups` }),
        el('span', { class: 'badge', text: `${topicCount} topics` }),
      ]),
    ]),

    el('div', { class: 'module-meta' }, [
      el('div', {}, [
        el('h2', { class: 'module-meta__label', text: 'Prerequisites' }),
        prerequisiteList(module),
      ]),
      el('div', {}, [
        el('h2', { class: 'module-meta__label', text: 'Primary ownership' }),
        el('p', { class: 'module-meta__value', text: module.owns || '—' }),
      ]),
    ]),

    chapterSection(module),
    topicSection(module),
  ]);

  return true;
}
