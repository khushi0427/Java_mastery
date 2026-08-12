/**
 * app.js — shell bootstrap.
 *
 * The entry point loaded by index.html. It owns nothing itself; it starts the
 * shell's subsystems in a defined order and keeps that order in one readable
 * place as more are added in later phases.
 *
 * Deliberately absent, because they belong to later phases: content loading,
 * module metadata, search, progress tracking, and code execution.
 */

import { initTheme } from './theme.js';
import { initNav } from './nav.js';

function boot() {
  // Theme first: it only adjusts an attribute already set before paint by the
  // inline script in index.html, but doing it first keeps the order obvious.
  initTheme();
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
