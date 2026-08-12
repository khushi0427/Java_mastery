/**
 * nav.js — sidebar drawer behaviour and hash-based view switching.
 *
 * Two related jobs live here:
 *   1. The drawer: on narrow screens the sidebar overlays the content and needs
 *      open/close controls, a backdrop, Escape handling, and focus management.
 *   2. The router: a hash route (#/curriculum) selects which [data-view]
 *      section is visible and which nav link is marked current.
 *
 * The views themselves are static markup in index.html and are toggled with the
 * `hidden` property rather than injected by JavaScript. That keeps content in
 * the document rather than in a template string, but note the limit: the
 * non-default views ship with `hidden` set, so without this module only the
 * dashboard is visible. Full content without JavaScript is not a goal here —
 * the site must be served over http regardless, because browsers block ES
 * module scripts on file:// (docs/ARCHITECTURE.md §2).
 *
 * Phase 3 note: when views gain real content and data loading, the router
 * belongs in its own module. It is here now because the shell's routing is a
 * dozen lines and a separate file would be ceremony.
 */

/** Must match the breakpoint in assets/css/layout.css §7. */
const DESKTOP_QUERY = '(min-width: 900px)';

/** Route → the document title suffix shown for it. */
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

  const focusable = [...elements.sidebar.querySelectorAll(FOCUSABLE)];
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
 * Read the route from the URL hash.
 * `#/curriculum` → 'curriculum'. Empty or bare `#` → the default route.
 * Anything unrecognised is returned as-is so the caller can 404 it.
 *
 * @returns {string}
 */
function routeFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  return raw === '' ? DEFAULT_ROUTE : raw;
}

/**
 * Show the view for `route` and mark the matching nav link current.
 * @param {string} route
 * @param {boolean} moveFocus - focus the content region (navigation, not load)
 */
function showRoute(route, moveFocus) {
  const known = Object.hasOwn(ROUTES, route);
  const viewName = known ? route : NOT_FOUND_VIEW;

  for (const view of elements.views) {
    view.hidden = view.dataset.view !== viewName;
  }

  for (const link of elements.navLinks) {
    if (known && link.dataset.route === route) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }

  document.title = known ? `${ROUTES[route]} · ${SITE_NAME}` : `Not found · ${SITE_NAME}`;

  if (moveFocus) {
    // tabindex="-1" on <main> makes this possible without adding a tab stop.
    elements.main?.focus();
  }
}

function initRouter() {
  window.addEventListener('hashchange', () => {
    showRoute(routeFromHash(), true);
    // On narrow screens the drawer covers the content it just navigated to.
    closeDrawer(false);
  });

  // Initial render: no focus move, so the page opens at the top as expected.
  showRoute(routeFromHash(), false);
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
    navLinks: document.querySelectorAll('.nav-link'),
    views: document.querySelectorAll('[data-view]'),
  };

  if (!elements.sidebar) {
    console.warn('nav.js: #sidebar not found — navigation not initialised.');
    return;
  }

  initDrawer();
  initRouter();
}
