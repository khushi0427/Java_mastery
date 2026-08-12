/**
 * search.js — client-side search over whatever data currently exists.
 *
 * Extensibility is the point of the design here. Today the only searchable
 * things in the repository are modules and their topic keywords. Chapters,
 * interview questions, practice problems, and revision notes do not exist yet —
 * so instead of indexing modules directly, the index is built from registered
 * **sources**. A later phase adds a source and gets search for free:
 *
 *   registerSearchSource('chapter', () => chapters.map(toEntry));
 *
 * Nothing else has to change: scoring, rendering, keyboard handling, and the
 * result grouping all work off the shared entry shape.
 *
 * Entry shape:
 *   { type, title, subtitle, route, keywords }
 *   type      — human label shown on the result ("Module", "Topic")
 *   title     — the main line
 *   subtitle  — context line (which module a topic belongs to, etc.)
 *   route     — hash route to navigate to on selection
 *   keywords  — extra text folded into matching but not displayed
 */

import { MODULES } from '../../data/modules.js';
import { el, replaceChildren } from './dom.js';

const MAX_RESULTS = 25;

/* ==========================================================================
   Index
   ========================================================================== */

/** @type {Array<{name: string, provider: () => Array<object>}>} */
const sources = [];

/** @type {Array<object>|null} built lazily, invalidated when a source is added */
let index = null;

/**
 * Register a searchable source. Call before `initSearch`, or at any time — the
 * index rebuilds on the next query.
 *
 * @param {string} name
 * @param {() => Array<object>} provider
 */
export function registerSearchSource(name, provider) {
  sources.push({ name, provider });
  index = null;
}

function buildIndex() {
  const entries = [];
  for (const source of sources) {
    for (const entry of source.provider()) {
      entries.push({
        ...entry,
        // Precompute the match target once, rather than per keystroke.
        haystack: [entry.title, entry.subtitle, entry.keywords]
          .filter(Boolean).join(' ').toLowerCase(),
      });
    }
  }
  return entries;
}

/* ------------------------------- built-in sources ------------------------ */

registerSearchSource('module', () =>
  MODULES.map((module) => ({
    type: 'Module',
    title: `${module.number} · ${module.name}`,
    subtitle: `Module ${Number(module.number)} of 43`,
    route: `#/module/${module.id}`,
    keywords: `${module.description} ${module.notes.join(' ')} module ${Number(module.number)}`,
    moduleNumber: module.number,
  })));

registerSearchSource('topic', () => {
  const entries = [];
  for (const module of MODULES) {
    const context = `Module ${module.number} — ${module.name}`;
    // The brief's topics are a flat keyword list per module, so each topic is a
    // single entry pointing at its module.
    for (const topic of module.topics) {
      entries.push({
        type: 'Topic',
        title: topic,
        subtitle: context,
        keywords: '',
        route: `#/module/${module.id}`,
        moduleNumber: module.number,
      });
    }
  }
  return entries;
});

/* ==========================================================================
   Query
   ========================================================================== */

/**
 * Score one entry against the query tokens.
 * Returns 0 when any token is absent — tokens are ANDed, so "virtual thread"
 * does not match an entry containing only "thread".
 */
function score(entry, query, tokens) {
  let total = 0;

  for (const token of tokens) {
    if (!entry.haystack.includes(token)) return 0;
    total += 1;
  }

  const title = entry.title.toLowerCase();
  if (title === query) total += 100;
  else if (title.startsWith(query)) total += 50;
  else if (title.includes(query)) total += 25;

  // A bare number is almost always someone jumping to a module.
  if (entry.type === 'Module') {
    total += 10;
    if (entry.moduleNumber === query.padStart(2, '0')) total += 200;
  }

  // Shorter titles are usually the more precise hit for the same match.
  total += Math.max(0, 20 - entry.title.length / 5);

  return total;
}

/**
 * Search all registered sources.
 *
 * @param {string} rawQuery
 * @param {number} [limit]
 * @returns {Array<object>} scored entries, best first
 */
export function search(rawQuery, limit = MAX_RESULTS) {
  const query = rawQuery.trim().toLowerCase();
  if (query === '') return [];

  if (index === null) index = buildIndex();

  const tokens = query.split(/\s+/).filter(Boolean);

  return index
    .map((entry) => ({ entry, value: score(entry, query, tokens) }))
    .filter((scored) => scored.value > 0)
    .sort((a, b) => b.value - a.value || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map((scored) => scored.entry);
}

/* ==========================================================================
   UI
   ========================================================================== */

let elements;
let results = [];
let activeIndex = -1;

function closeResults() {
  elements.panel.hidden = true;
  elements.input.setAttribute('aria-expanded', 'false');
  elements.input.removeAttribute('aria-activedescendant');
  activeIndex = -1;
}

function setActive(next) {
  const options = [...elements.panel.querySelectorAll('[role="option"]')];
  if (options.length === 0) return;

  activeIndex = (next + options.length) % options.length;
  for (const [i, option] of options.entries()) {
    const isActive = i === activeIndex;
    option.classList.toggle('is-active', isActive);
    option.setAttribute('aria-selected', String(isActive));
    if (isActive) {
      elements.input.setAttribute('aria-activedescendant', option.id);
      option.scrollIntoView({ block: 'nearest' });
    }
  }
}

function go(route) {
  closeResults();
  elements.input.value = '';
  window.location.hash = route;
}

function render(query) {
  if (query.trim() === '') {
    closeResults();
    replaceChildren(elements.panel, []);
    return;
  }

  results = search(query);
  activeIndex = -1;
  elements.input.removeAttribute('aria-activedescendant');

  if (results.length === 0) {
    replaceChildren(elements.panel, [
      el('p', { class: 'search-empty', text: `No matches for “${query.trim()}”.` }),
      el('p', {
        class: 'search-empty__hint',
        text: 'Search currently covers module names and topics. Chapters, practice, and interview questions are not written yet.',
      }),
    ]);
  } else {
    const list = el('ul', {
      class: 'search-results',
      id: 'search-results',
      role: 'listbox',
      'aria-label': 'Search results',
    });

    for (const [i, entry] of results.entries()) {
      list.append(
        el('li', {
          class: 'search-result',
          id: `search-result-${i}`,
          role: 'option',
          'aria-selected': 'false',
          // mousedown, not click: it fires before the input's blur handler,
          // which would otherwise close the panel out from under the pointer.
          on: { mousedown: (event) => { event.preventDefault(); go(entry.route); } },
        }, [
          el('span', { class: 'search-result__type', text: entry.type }),
          el('span', { class: 'search-result__title', text: entry.title }),
          entry.subtitle
            ? el('span', { class: 'search-result__subtitle', text: entry.subtitle })
            : null,
        ]),
      );
    }

    replaceChildren(elements.panel, [
      el('p', {
        class: 'search-count',
        text: `${results.length} result${results.length === 1 ? '' : 's'}`,
      }),
      list,
    ]);
  }

  elements.panel.hidden = false;
  elements.input.setAttribute('aria-expanded', 'true');
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    closeResults();
    return;
  }
  if (elements.panel.hidden) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setActive(activeIndex + 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    setActive(activeIndex - 1);
  } else if (event.key === 'Enter') {
    // Enter with no explicit selection takes the top hit.
    const chosen = results[activeIndex === -1 ? 0 : activeIndex];
    if (chosen) {
      event.preventDefault();
      go(chosen.route);
    }
  }
}

/** Wire up the top-bar search field. */
export function initSearch() {
  const input = document.getElementById('search-input');
  const panel = document.getElementById('search-panel');
  if (!input || !panel) {
    console.warn('search.js: search elements not found — search not initialised.');
    return;
  }

  elements = { input, panel };

  input.addEventListener('input', () => render(input.value));
  input.addEventListener('focus', () => { if (input.value.trim() !== '') render(input.value); });
  input.addEventListener('blur', () => closeResults());
  input.addEventListener('keydown', onKeydown);

  // "/" focuses search, the convention on documentation sites — but not while
  // the user is typing somewhere else.
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== input) {
      const tag = document.activeElement?.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        event.preventDefault();
        input.focus();
      }
    }
  });
}
