#!/usr/bin/env node
/**
 * generate-modules.mjs — derive data/modules.js from docs/CURRICULUM.md.
 *
 * Why this exists
 * ---------------
 * The quality bar for the metadata layer is "one source of module metadata, no
 * duplication". But docs/CURRICULUM.md is already the authoritative curriculum
 * for humans, so hand-writing the same 43 modules into a JavaScript file would
 * create a second source that silently drifts from the first.
 *
 * So: CURRICULUM.md stays authoritative, and data/modules.js is DERIVED from it
 * by this script. This resolves open question 3 in docs/ARCHITECTURE.md §16.
 *
 * This is a development tool, NOT a build step. The site runs directly from the
 * committed data/modules.js with no toolchain; you only run this when
 * CURRICULUM.md changes.
 *
 *   node tools/generate-modules.mjs           # rewrite data/modules.js
 *   node tools/generate-modules.mjs --check   # verify it is in sync, exit 1 if not
 *
 * The curriculum is LOCKED (CURRICULUM.md Appendix B). This script must never be
 * used to renumber or rename a module — module ids are permanent keys that
 * Phase 4 progress records depend on.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, 'docs/CURRICULUM.md');
const TARGET = join(ROOT, 'data/modules.js');

/* ---------------------------------------------------------------- helpers */

/** Strip inline markdown so metadata carries plain text, not markup. */
function plain(text) {
  return text
    .replace(/`([^`]+)`/g, '$1')          // code spans
    .replace(/\*\*([^*]+)\*\*/g, '$1')    // bold
    .replace(/\*([^*]+)\*/g, '$1')        // italics
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → their text
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Build a module's URL slug from its name.
 *
 * Names often carry an em-dash subtitle ("Concurrency I — Threads, Shared
 * State…"); only the part before it is used, which keeps slugs short and
 * readable. The two-digit number prefix guarantees uniqueness regardless, and
 * collisions are asserted against below.
 */
function slugify(number, name) {
  const head = name.split('—')[0];
  const body = plain(head)
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${number}-${body}`;
}

/* ------------------------------------------------------------- extraction */

const src = readFileSync(SOURCE, 'utf8');

// Part headings ("# Part I — Java Language Core (Modules 01–14)") give each
// module its presentation grouping. Parts carry no identity — see §5.
const parts = [...src.matchAll(/^# Part ([IVX]+) — (.+?) \(Modules (\d{2})–(\d{2})\)$/gm)]
  .map((m) => ({
    roman: m[1],
    name: plain(m[2]),
    from: Number(m[3]),
    to: Number(m[4]),
  }));
if (parts.length === 0) throw new Error('No Part headings found in CURRICULUM.md');

const partFor = (n) => parts.find((p) => n >= p.from && n <= p.to);

// Split the document into one chunk per module.
const headings = [...src.matchAll(/^## Module (\d{2}) — (.+)$/gm)];
if (headings.length !== 43) {
  throw new Error(`Expected 43 modules, found ${headings.length}. Refusing to generate.`);
}

const modules = headings.map((heading, i) => {
  const number = heading[1];
  const name = plain(heading[2]);
  const start = heading.index + heading[0].length;
  const end = i + 1 < headings.length ? headings[i + 1].index : src.indexOf('\n# Appendix A');
  const body = src.slice(start, end === -1 ? undefined : end);

  const field = (label) => {
    const m = body.match(new RegExp(`\\*\\*${label}\\.\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n---|$)`));
    return m ? plain(m[1]) : '';
  };

  // Prerequisites appear in three forms:
  //   "01, 02."                  → a list
  //   "None." / "None beyond …"  → empty (the none-check must run first, since
  //                                the "beyond" wording can contain numbers)
  //   "All of Modules 01–42."    → an inclusive range (Module 43 only)
  const prereqText = field('Prerequisites');
  const range = prereqText.match(/All of Modules (\d{2})[–-](\d{2})/i);
  let prerequisites;
  if (/none/i.test(prereqText)) {
    prerequisites = [];
  } else if (range) {
    const [from, to] = [Number(range[1]), Number(range[2])];
    prerequisites = Array.from({ length: to - from + 1 },
      (_, k) => String(from + k).padStart(2, '0'));
  } else {
    prerequisites = [...prereqText.matchAll(/\b(\d{2})\b/g)].map((m) => m[1]);
  }

  // Topics: "- *Group name*" followed by nested bullets at deeper indentation.
  // Nested sub-bullets are flattened into the group's item list; the grouping
  // that matters for display and search is the group level.
  //
  // Bullets in CURRICULUM.md wrap across lines for readability:
  //
  //     - `Iterable` → `Collection` → `List`, `Set`, `Queue`/`Deque`; `Map` as a
  //       separate root and why
  //
  // so a line-at-a-time match truncates the text mid-sentence. Continuation
  // lines are indented and do NOT begin with "- ", which is what separates them
  // from a nested sub-bullet; they are appended to the item being built.
  const topicBlock = body.split('**Topics**')[1]?.split('**Practice focus.**')[0] ?? '';
  const topics = [];
  let pending = null;

  const flush = () => {
    if (pending === null) return;
    const text = plain(pending).replace(/[:;,]$/, '');
    if (text && topics.length > 0) topics[topics.length - 1].items.push(text);
    pending = null;
  };

  for (const line of topicBlock.split('\n')) {
    const group = line.match(/^- \*(.+?)\*\s*$/);
    if (group) {
      flush();
      topics.push({ group: plain(group[1]), items: [] });
      continue;
    }

    const item = line.match(/^\s{2,}- (.+)$/);
    if (item) {
      flush();
      pending = item[1];
      continue;
    }

    // A continuation of the bullet currently being built.
    if (pending !== null && /^\s{3,}\S/.test(line)) {
      pending += ` ${line.trim()}`;
      continue;
    }

    // A blank line or anything else ends the current bullet.
    if (line.trim() === '') flush();
  }
  flush();

  const part = partFor(Number(number));
  return {
    number,
    id: slugify(number, name),
    name,
    part: part ? `Part ${part.roman} — ${part.name}` : null,
    partNumber: part ? parts.indexOf(part) + 1 : null,
    description: field('Purpose'),
    prerequisites,
    owns: field('Owns'),
    topics,
    // Nothing is built yet. Every module is NOT_STARTED and has no chapters;
    // these are facts about the repository, not placeholders to fill in.
    status: 'NOT_STARTED',
    chapterCount: 0,
    chapters: [],
  };
});

/* ------------------------------------------------------------ assertions */

const numbers = modules.map((m) => m.number);
const expected = Array.from({ length: 43 }, (_, i) => String(i + 1).padStart(2, '0'));
if (numbers.join() !== expected.join()) {
  throw new Error('Module numbers are not exactly 01–43 in order. Refusing to generate.');
}
const ids = new Set(modules.map((m) => m.id));
if (ids.size !== modules.length) throw new Error('Duplicate module ids generated.');
for (const m of modules) {
  if (!m.name) throw new Error(`Module ${m.number} has no name.`);
  if (!m.description) throw new Error(`Module ${m.number} has no description.`);
  if (m.topics.length === 0) throw new Error(`Module ${m.number} has no topics.`);
}

/* --------------------------------------------------------------- emitting */

const banner = `/**
 * modules.js — the module metadata layer. GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Source of truth: docs/CURRICULUM.md
 * Regenerate with: node tools/generate-modules.mjs
 * Verify in sync:  node tools/generate-modules.mjs --check
 *
 * This is the ONE place the application reads module metadata from. The sidebar,
 * the dashboard, the module overview, and the search index all consume this
 * array; nothing hardcodes a module list anywhere else.
 *
 * The curriculum is LOCKED (docs/CURRICULUM.md Appendix B). \`number\` and \`id\`
 * are permanent keys — Phase 4 progress records are keyed on \`id\`. Renaming a
 * module changes its generated id, which would orphan stored progress.
 *
 * \`status\` and \`chapterCount\` describe what actually exists in this repository.
 * All 43 modules are NOT_STARTED with 0 chapters because no chapter content has
 * been written yet. Metadata is not content.
 */

export const MODULES = `;

const out = `${banner}${JSON.stringify(modules, null, 2)};\n\nexport default MODULES;\n`;

if (process.argv.includes('--check')) {
  const current = readFileSync(TARGET, 'utf8');
  if (current !== out) {
    console.error('OUT OF SYNC: data/modules.js does not match docs/CURRICULUM.md.');
    console.error('Run: node tools/generate-modules.mjs');
    process.exit(1);
  }
  console.log('IN SYNC: data/modules.js matches docs/CURRICULUM.md.');
  process.exit(0);
}

writeFileSync(TARGET, out);
console.log(`Wrote ${TARGET}`);
console.log(`  modules:     ${modules.length}`);
console.log(`  parts:       ${parts.length}`);
console.log(`  topic groups:${modules.reduce((n, m) => n + m.topics.length, 0)}`);
console.log(`  topic items: ${modules.reduce((n, m) => n + m.topics.reduce((k, t) => k + t.items.length, 0), 0)}`);
