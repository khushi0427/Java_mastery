/**
 * nav.js — sidebar drawer behaviour and hash-based view switching.
 *
 * Two related jobs live here:
 *   1. The drawer: on narrow screens the sidebar overlays the content and needs
 *      open/close controls, a backdrop, Escape handling, and focus management.
 *   2. The router: a hash route selects which [data-view] section is visible
 *      and which nav link is marked current.
 *
 * Routes:
 *   #/dashboard, #/curriculum, #/practice, …   → a static view
 *   #/module/<id>                              → the module overview (Phase 3)
 *
 * View sections are static markup in index.html toggled with `hidden`; the
 * dashboard and module views have their bodies filled by their own modules.
 * The site must be served over http regardless — browsers block ES module
 * scripts on file:// (docs/ARCHITECTURE.md §2).
 */

import { renderCurriculum } from './curriculum-view.js';
import { renderDashboard } from './dashboard.js';
import { renderModule } from './module-view.js';
import { renderPractice } from './practice-view.js';
import { revealModule } from './sidebar.js';

/** Must match the breakpoint in assets/css/layout.css §7. */
const DESKTOP_QUERY = '(min-width: 900px)';

/** Static routes → the document title suffix shown for each. */
const ROUTES = {
  dashboard: 'Dashboard',
  curriculum: 'Curriculum',
  practice: 'Practice',
  interview: 'Interview',
  assessments: 'Assessments',
  projects: 'Projects',
  revision: 'Revision',
};

const DEFAULT_ROUTE = 'dashboard';
const NOT_FOUND_VIEW = 'not-found';
const SITE_NAME = 'Java Full-Stack Mastery';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled])';

let desktopQuery;
let elements;

/* ==========================================================================
   Drawer
   ========================================================================== */

const isDesktop = () => desktopQuery.matches;
const isOpen = () => document.body.classList.contains('nav-open');

function openDrawer() {
  if (isDesktop() || isOpen()) return;

  document.body.classList.add('nav-open');
  elements.navToggle?.setAttribute('aria-expanded', 'true');

  // Move focus into the drawer so keyboard and screen-reader users are taken
  // where the visual change happened.
  elements.sidebar.querySelector(FOCUSABLE)?.focus();
}

/**
 * @param {boolean} restoreFocus - return focus to the hamburger. Skipped when
 *   the drawer closes because the user followed a nav link, since focus should
 *   land on the new content instead.
 */
function closeDrawer(restoreFocus = true) {
  if (!isOpen()) return;

  document.body.classList.remove('nav-open');
  elements.navToggle?.setAttribute('aria-expanded', 'false');

  if (restoreFocus) elements.navToggle?.focus();
}

/** Keep Tab inside the drawer while it overlays the page. */
function trapFocus(event) {
  if (event.key !== 'Tab' || !isOpen() || isDesktop()) return;

  // Queried per keystroke rather than cached: the sidebar's focusable set
  // changes as module rows expand and collapse.
  const focusable = [...elements.sidebar.querySelectorAll(FOCUSABLE)]
    .filter((node) => node.offsetParent !== null);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function initDrawer() {
  elements.navToggle?.addEventListener('click', () => {
    isOpen() ? closeDrawer() : openDrawer();
  });

  elements.navClose?.addEventListener('click', () => closeDrawer());
  elements.backdrop?.addEventListener('click', () => closeDrawer());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDrawer();
    trapFocus(event);
  });

  // Crossing into desktop leaves the drawer state stale — clear it, and clear
  // aria-expanded too, since the hamburger is display:none at that width.
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) {
      document.body.classList.remove('nav-open');
      elements.navToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // The backdrop ships with [hidden] so it stays invisible without JavaScript.
  // With JS running, CSS owns its visibility.
  elements.backdrop?.removeAttribute('hidden');
}

/* ==========================================================================
   Router
   ========================================================================== */

/**
 * Parse the URL hash into a route.
 *
 *   ''                → { name: 'dashboard' }
 *   '#/curriculum'    → { name: 'curriculum' }
 *   '#/module/01-foo' → { name: 'module', param: '01-foo' }
 *
 * @returns {{name: string, param?: string}}
 */
function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (raw === '') return { name: DEFAULT_ROUTE };

  const [name, ...rest] = raw.split('/');
  return rest.length > 0 ? { name, param: rest.join('/') } : { name };
}

/** Mark the matching sidebar link current; clear the rest. */
function setActiveLink(routeKey) {
  for (const link of document.querySelectorAll('.nav-link, .module-link')) {
    if (routeKey !== null && link.dataset.route === routeKey) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
}

/**
 * Show the view for `route`.
 * @param {{name: string, param?: string}} route
 * @param {boolean} moveFocus - focus the content region (navigation, not load)
 */
function showRoute(route, moveFocus) {
  let viewName;
  let title;
  let activeKey = null;

  if (route.name === 'module' && route.param) {
    // Render first: an unknown module id must fall through to the 404 view
    // rather than showing an empty module page.
    if (renderModule(route.param)) {
      viewName = 'module';
      activeKey = `module/${route.param}`;
      title = document.querySelector('#module-body .view__title')?.textContent ?? 'Module';
      revealModule(route.param);
    } else {
      viewName = NOT_FOUND_VIEW;
      title = 'Not found';
    }
  } else if (Object.hasOwn(ROUTES, route.name)) {
    viewName = route.name;
    activeKey = route.name;
    title = ROUTES[route.name];
    if (route.name === 'dashboard') renderDashboard();
    if (route.name === 'curriculum') renderCurriculum();
    if (route.name === 'practice') renderPractice();
  } else {
    viewName = NOT_FOUND_VIEW;
    title = 'Not found';
  }

  for (const view of document.querySelectorAll('[data-view]')) {
    view.hidden = view.dataset.view !== viewName;
  }

  setActiveLink(activeKey);
  document.title = `${title} · ${SITE_NAME}`;

  if (moveFocus) {
    // tabindex="-1" on <main> makes this possible without adding a tab stop.
    elements.main?.focus();
    elements.main?.scrollTo?.(0, 0);
    window.scrollTo(0, 0);
  }
}

function initRouter() {
  window.addEventListener('hashchange', () => {
    showRoute(parseHash(), true);
    // On narrow screens the drawer covers the content it just navigated to.
    closeDrawer(false);
  });

  // Initial render: no focus move, so the page opens at the top as expected.
  showRoute(parseHash(), false);
}

/* ==========================================================================
   Entry point
   ========================================================================== */

export function initNav() {
  desktopQuery = window.matchMedia(DESKTOP_QUERY);

  elements = {
    sidebar: document.getElementById('sidebar'),
    navToggle: document.getElementById('nav-toggle'),
    navClose: document.getElementById('nav-close'),
    backdrop: document.getElementById('nav-backdrop'),
    main: document.getElementById('main'),
  };

  if (!elements.sidebar) {
    console.warn('nav.js: #sidebar not found — navigation not initialised.');
    return;
  }

  initDrawer();
  initRouter();
}
