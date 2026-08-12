/**
 * theme.js — light/dark theme selection and persistence.
 *
 * The theme is applied to <html> as data-theme="light|dark". The initial value
 * is set by the inline script in index.html so there is no flash of the wrong
 * theme; this module takes over afterwards for toggling and persistence.
 *
 * Keep THEME_KEY and the resolution order in sync with that inline script.
 */

import { KEY_PREFIX, readString, writeString } from './storage.js';

/** localStorage key. Namespaced with `jfsm.` — see docs/ARCHITECTURE.md §10. */
export const THEME_KEY = `${KEY_PREFIX}theme`;

const LIGHT = 'light';
const DARK = 'dark';

/**
 * Read a stored theme.
 *
 * Storage access is wrapped by storage.js. A value written by an older or
 * unrelated build is still possible, so anything that is not exactly 'light' or
 * 'dark' is treated as absent.
 *
 * @returns {'light'|'dark'|null}
 */
function readStoredTheme() {
  const stored = readString(THEME_KEY);
  return stored === LIGHT || stored === DARK ? stored : null;
}

/**
 * Persist the chosen theme.
 * @param {'light'|'dark'} theme
 */
function storeTheme(theme) {
  // Failure is non-fatal: the theme still applies for this page view, it just
  // will not survive a reload.
  writeString(THEME_KEY, theme);
}

/** @returns {'light'|'dark'} the OS-level preference, defaulting to light. */
function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
}

/** @returns {'light'|'dark'} the theme currently applied to the document. */
export function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === DARK ? DARK : LIGHT;
}

/**
 * Apply a theme to the document and update the toggle's accessible name.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  // Only write when the value actually differs. On load the inline script has
  // usually already applied the right theme, and a redundant write would
  // invalidate styles for no reason.
  if (document.documentElement.getAttribute('data-theme') !== theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    // The label describes the ACTION, matching the icon shown (see theme.css).
    toggle.setAttribute(
      'aria-label',
      theme === DARK ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }
}

/**
 * Wire up the theme toggle and start following the OS preference.
 *
 * Resolution order on load: stored choice → OS preference → light. This mirrors
 * the inline script; re-running it here costs nothing and keeps the two in step
 * if the inline script is ever changed.
 */
export function initTheme() {
  applyTheme(readStoredTheme() ?? systemTheme());

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = currentTheme() === DARK ? LIGHT : DARK;
    applyTheme(next);
    storeTheme(next);
  });

  // Follow the OS if — and only if — the user has not made an explicit choice.
  window.matchMedia?.('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      if (readStoredTheme() === null) {
        applyTheme(event.matches ? DARK : LIGHT);
      }
    });
}
