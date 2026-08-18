/**
 * chapters.js — the only way the UI reads chapter data.
 *
 * `data/chapters.js` is the manifest; this module is the accessor over it, in
 * the same relationship `progress.js` has to `storage.js`. Views ask questions
 * here ("how many chapters does this module have?", "give me chapter 01-01")
 * rather than importing the manifest and filtering it themselves, so the
 * shape of the manifest stays changeable.
 *
 * Chapter *content* is loaded lazily — see `loadChapter`. Metadata is not.
 */

import { CHAPTERS, PLANNED_CHAPTERS } from '../../data/chapters.js';

/** Chapter metadata for one module, in chapter order. @param {string} moduleId */
export function chaptersForModule(moduleId) {
  return CHAPTERS
    .filter((c) => c.moduleId === moduleId)
    .sort((a, b) => a.number - b.number);
}

/** How many chapters a module has authored. @param {string} moduleId */
export function chapterCountForModule(moduleId) {
  return chaptersForModule(moduleId).length;
}

/** Every authored chapter, across all modules. */
export function allChapters() {
  return [...CHAPTERS].sort((a, b) => a.id.localeCompare(b.id));
}

/** Total authored chapters — the real denominator for progress. */
export function totalChapterCount() {
  return CHAPTERS.length;
}

/**
 * A module's CONTENT status, derived from the chapters actually written.
 *
 * `data/modules.js` deliberately does not carry this. It is generated from the
 * curriculum, which describes what a module must cover and knows nothing about
 * what has been authored — so a generated `NOT_STARTED` would have become a
 * false claim the moment a module was finished. Same reasoning as the chapter
 * fields (docs/ARCHITECTURE.md §4a).
 *
 * The mapping, using the project's status vocabulary:
 *
 *   no chapters written                            → NOT_STARTED
 *   some written, or some written but not verified → IN_PROGRESS
 *   every planned chapter written and VERIFIED     → VERIFIED
 *   every planned chapter written, not all verified→ CONTENT_COMPLETE
 *
 * A module with no recorded plan is judged only on what exists: any chapter at
 * all makes it IN_PROGRESS, because without a plan we cannot know it is done.
 *
 * @param {string} moduleId
 * @returns {string} one of the five status tokens
 */
export function moduleContentStatus(moduleId) {
  const written = chaptersForModule(moduleId);
  if (written.length === 0) return 'NOT_STARTED';

  const planned = PLANNED_CHAPTERS[moduleId] ?? [];
  // No plan recorded: we know chapters exist, but not whether they are all of
  // them. IN_PROGRESS is the honest answer.
  if (planned.length === 0 || written.length < planned.length) return 'IN_PROGRESS';

  return written.every((c) => c.status === 'VERIFIED') ? 'VERIFIED' : 'CONTENT_COMPLETE';
}

/** Metadata for one chapter, or null. @param {string} chapterId e.g. '01-01' */
export function getChapterMeta(chapterId) {
  return CHAPTERS.find((c) => c.id === chapterId) ?? null;
}

/** Does this chapter exist? Synchronous, so routing can 404 without awaiting. */
export function chapterExists(chapterId) {
  return CHAPTERS.some((c) => c.id === chapterId);
}

/**
 * The chapter before and after this one, within the same module.
 *
 * Module-local rather than global: "next" crossing a module boundary would
 * skip the module overview, which is where prerequisites and scope live.
 *
 * @returns {{previous: object|null, next: object|null}}
 */
export function chapterNeighbours(chapterId) {
  const chapter = getChapterMeta(chapterId);
  if (!chapter) return { previous: null, next: null };

  const siblings = chaptersForModule(chapter.moduleId);
  const index = siblings.findIndex((c) => c.id === chapterId);

  return {
    previous: index > 0 ? siblings[index - 1] : null,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
  };
}

// Content is cached after its first load: re-opening a chapter, or navigating
// away and back, should not re-fetch it. The module graph would dedupe the
// import anyway, but caching the resolved object keeps callers synchronous-ish
// and makes the intent explicit.
const contentCache = new Map();

/**
 * Load a chapter's content.
 *
 * @param {string} chapterId
 * @returns {Promise<object|null>} the chapter content, or null if unknown or
 *   the import failed. Never throws — a failed content load must degrade to a
 *   message in the view, not a broken page.
 */
export async function loadChapter(chapterId) {
  if (contentCache.has(chapterId)) return contentCache.get(chapterId);

  const meta = getChapterMeta(chapterId);
  if (!meta) return null;

  try {
    const module = await meta.load();
    const content = module.chapter ?? module.default ?? null;
    if (content) contentCache.set(chapterId, content);
    return content;
  } catch (error) {
    // A missing or malformed content file is a repository problem, not a
    // learner problem. Log it for whoever is developing, and let the view say
    // so plainly rather than rendering half a page.
    console.error(`chapters.js: failed to load chapter ${chapterId}`, error);
    return null;
  }
}

/** The route for a chapter. One definition, so links and the router agree. */
export function chapterHref(chapterId) {
  return `#/chapter/${chapterId}`;
}
