/**
 * sidebar.js — builds the navigation tree from module metadata.
 *
 * Phase 2's sidebar was a hardcoded placeholder list. This replaces it with a
 * tree built entirely from data/modules.js: the seven top-level destinations,
 * plus a collapsible Curriculum section containing all 43 modules, each of
 * which discloses its own (currently empty) chapter region.
 *
 * The module list is never hardcoded here — if it disagrees with
 * docs/CURRICULUM.md, the generator is what is wrong (tools/generate-modules.mjs).
 */

import { MODULES } from '../../data/modules.js';
import { el, svg } from './dom.js';
import { getModuleProgress } from './progress.js';

/** Top-level destinations. Routes match the view names in index.html. */
const PRIMARY_NAV = [
  { group: 'Learn', items: [
    { route: 'dashboard', label: 'Dashboard' },
    { route: 'curriculum', label: 'Curriculum', isCurriculum: true },
    { route: 'practice', label: 'Practice' },
  ] },
  { group: 'Prepare', items: [
    { route: 'interview', label: 'Interview' },
    { route: 'assessments', label: 'Assessments' },
  ] },
  { group: 'Build & Review', items: [
    { route: 'projects', label: 'Projects' },
    { route: 'revision', label: 'Revision' },
  ] },
];

/** Human labels for the status vocabulary (docs/PROJECT_STATE.md). */
const STATUS_LABEL = {
  NOT_STARTED: 'Not started',
  FOUNDATION_ONLY: 'Foundation only',
  IN_PROGRESS: 'In progress',
  CONTENT_COMPLETE: 'Content complete',
  VERIFIED: 'Verified',
};

/* ------------------------------------------------------------------ module */

/**
 * One module row: a link to the module overview, plus a disclosure button that
 * reveals the chapter region for that module.
 */
function moduleItem(module) {
  const chaptersId = `chapters-${module.id}`;
  const progress = getModuleProgress(module.id);
  const statusLabel = STATUS_LABEL[progress.status] ?? progress.status;

  const chapters = el('div', {
    class: 'module-chapters',
    id: chaptersId,
    hidden: true,
  }, [
    // chapterCount is genuinely 0 — say so rather than rendering fake links.
    module.chapterCount === 0
      ? el('p', { class: 'module-chapters__empty', text: 'No chapters yet' })
      : el('ul', { class: 'module-chapters__list' }),
  ]);

  const toggle = el('button', {
    class: 'module-row__toggle',
    type: 'button',
    'aria-expanded': 'false',
    'aria-controls': chaptersId,
    // The module name gives the button an unambiguous accessible name; without
    // it every one of the 43 toggles would just be called "expand".
    'aria-label': `Show chapters for module ${module.number}, ${module.name}`,
    on: {
      click: (event) => {
        const button = event.currentTarget;
        const open = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!open));
        chapters.hidden = open;
      },
    },
  }, [
    svg('svg', { class: 'icon icon--chevron', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, [
      svg('path', { d: 'M9 6l6 6-6 6' }),
    ]),
  ]);

  return el('li', { class: 'module-item' }, [
    el('div', { class: 'module-row' }, [
      toggle,
      el('a', {
        class: 'module-link',
        href: `#/module/${module.id}`,
        // The name is visually truncated at this width; the accessible name is
        // still complete, but pointer users need the tooltip to read it.
        title: `${module.number} — ${module.name}`,
        dataset: { moduleId: module.id, route: `module/${module.id}` },
      }, [
        el('span', { class: 'module-link__number', text: module.number }),
        el('span', { class: 'module-link__name', text: module.name }),
        el('span', {
          class: `status-dot status-dot--${progress.status.toLowerCase()}`,
          title: statusLabel,
          'aria-hidden': 'true',
        }),
        el('span', { class: 'visually-hidden', text: `— ${statusLabel}` }),
      ]),
    ]),
    chapters,
  ]);
}

/* ----------------------------------------------------------------- section */

/** The Curriculum disclosure containing all 43 modules. */
function curriculumSection() {
  const listId = 'curriculum-modules';

  const list = el('ul', { class: 'module-list', id: listId },
    MODULES.map(moduleItem));

  const toggle = el('button', {
    class: 'curriculum-toggle',
    type: 'button',
    'aria-expanded': 'true',
    'aria-controls': listId,
  }, [
    el('span', { text: `All ${MODULES.length} modules` }),
    el('span', { class: 'curriculum-toggle__hint', text: 'Chapters arrive in a later phase' }),
  ]);

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    list.hidden = open;
  });

  return el('div', { class: 'curriculum-section' }, [toggle, list]);
}

/* ------------------------------------------------------------------- build */

/** Render the whole sidebar into its container. */
export function initSidebar() {
  const container = document.getElementById('sidebar-nav');
  if (!container) {
    console.warn('sidebar.js: #sidebar-nav not found — sidebar not built.');
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const section of PRIMARY_NAV) {
    const labelId = `nav-group-${section.group.toLowerCase().replace(/[^a-z]+/g, '-')}`;
    fragment.append(
      el('p', { class: 'sidebar__group-label', id: labelId, text: section.group }),
    );

    const list = el('ul', { class: 'nav-list', 'aria-labelledby': labelId });
    for (const item of section.items) {
      list.append(
        el('li', {}, [
          el('a', {
            class: 'nav-link',
            href: `#/${item.route}`,
            dataset: { route: item.route },
            text: item.label,
          }),
          // The 43 modules hang off Curriculum rather than sitting at top level.
          item.isCurriculum ? curriculumSection() : null,
        ]),
      );
    }
    fragment.append(list);
  }

  container.replaceChildren(fragment);
}

/**
 * Open the Curriculum section and the containing module row so a routed-to
 * module is visible in the tree rather than hidden inside a collapsed section.
 *
 * @param {string} moduleId
 */
export function revealModule(moduleId) {
  const link = document.querySelector(`.module-link[data-module-id="${CSS.escape(moduleId)}"]`);
  if (!link) return;

  const curriculumToggle = document.querySelector('.curriculum-toggle');
  const list = document.getElementById('curriculum-modules');
  if (curriculumToggle && list?.hidden) {
    curriculumToggle.setAttribute('aria-expanded', 'true');
    list.hidden = false;
  }

  link.scrollIntoView({ block: 'nearest' });
}
