/**
 * storage.js — the only place that touches `localStorage`.
 *
 * Everything the site persists goes through here, so the defensive handling
 * lives in one place rather than being repeated at every call site:
 *
 *   - `localStorage` can throw on access entirely (private browsing, blocked
 *     cookies, some embedded webviews).
 *   - It can throw on write (quota exceeded).
 *   - It can hold corrupt or foreign JSON written by an older build, a browser
 *     extension, or another app on the same origin.
 *
 * In all of those cases the site must degrade to "no saved data" rather than
 * break, so every function here returns a fallback instead of propagating.
 *
 * ONE DELIBERATE EXCEPTION: the anti-FOUC script inlined in index.html reads
 * `jfsm.theme` directly. It has to run before any module loads, so it cannot
 * import this file. Keep the two in step.
 */

/** Every key this project writes carries this prefix. See docs/ARCHITECTURE.md §10. */
export const KEY_PREFIX = 'jfsm.';

/**
 * Is `localStorage` usable at all? Probed once, by actually writing — merely
 * checking `typeof localStorage` is not enough, since access itself can throw.
 */
export const isAvailable = (() => {
  try {
    const probe = `${KEY_PREFIX}__probe__`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
})();

/**
 * Read and parse a JSON value.
 * @param {string} key full key, including the prefix
 * @param {unknown} fallback returned when absent, unreadable, or malformed
 */
export function readJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;

    const parsed = JSON.parse(raw);
    // A valid-JSON scalar (`"x"`, `7`, `null`) is not a record — treat foreign
    // or corrupt values as absent rather than letting them through.
    if (parsed === null || typeof parsed !== 'object') return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

/**
 * Serialise and store a value.
 * @returns {boolean} whether the write actually succeeded
 */
export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Quota exceeded or storage unavailable. The caller's in-memory state stays
    // correct for this page view; it just will not survive a reload.
    return false;
  }
}

/** Read a plain string value. */
export function readString(key, fallback = null) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

/** Write a plain string value. @returns {boolean} success */
export function writeString(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Remove a single key. */
export function remove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
