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
 * Deliberately absent, because it belongs to a later phase: code execution
 * (Phase 5 — the Run controls in the practice shells are disabled placeholders).
 */

import { renderDashboard } from './dashboard.js';
import { initNav } from './nav.js';
import { onProgressChange } from './progress.js';
import { initSearch } from './search.js';
import { initSidebar, refreshSidebar } from './sidebar.js';
import { initTheme } from './theme.js';

function boot() {
  // Theme first: it only adjusts an attribute already set before paint by the
  // inline script in index.html, but doing it first keeps the order obvious.
  initTheme();
  initSidebar();
  initSearch();
  initNav();

  // Keep progress-dependent chrome in step when the store changes — the sidebar
  // status dots, and the dashboard when it is the visible view.
  //
  // Deliberately NOT subscribing the module view: renderModule() records a visit,
  // which writes and notifies, so re-rendering it from a notification would loop.
  onProgressChange(() => {
    refreshSidebar();
    const dashboard = document.querySelector('[data-view="dashboard"]');
    if (dashboard && !dashboard.hidden) renderDashboard();
  });
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
