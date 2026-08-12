/**
 * app.js — shell bootstrap.
 *
 * The entry point loaded by index.html. It owns nothing itself; it starts the
 * shell's subsystems in a defined order and keeps that order in one readable
 * place as more are added in later phases.
 *
 * Order matters: the sidebar must exist in the DOM before the router runs, so
 * the router can mark the active link and reveal a routed-to module.
 *
 * Deliberately absent, because they belong to later phases: progress
 * persistence (Phase 4 — see progress.js, currently a stub), practice and hint
 * UI, and code execution (Phase 5).
 */

import { initNav } from './nav.js';
import { initSearch } from './search.js';
import { initSidebar } from './sidebar.js';
import { initTheme } from './theme.js';

function boot() {
  // Theme first: it only adjusts an attribute already set before paint by the
  // inline script in index.html, but doing it first keeps the order obvious.
  initTheme();
  initSidebar();
  initSearch();
  initNav();
}

/*
 * Module scripts are deferred, so the DOM is normally parsed by the time this
 * runs. The readyState check keeps that from being an assumption.
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
