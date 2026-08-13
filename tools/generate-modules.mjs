#!/usr/bin/env node
/**
 * generate-modules.mjs — derive data/modules.js from docs/CURRICULUM.md.
 *
 * The chain of truth
 * ------------------
 *   docs/MASTER_BRIEF.md §12   ← canonical, written by the project owner
 *          ↓ verbatim transcription
 *   docs/CURRICULUM.md         ← readable curriculum, stable parse target
 *          ↓ this script
 *   data/modules.js            ← the single source the application reads
 *
 * Nothing downstream may be hand-edited. `--check` verifies BOTH hops and exits
 * non-zero on drift, because drift between the brief and the curriculum is
 * exactly the failure this project already suffered once.
 *
 *   node tools/generate-modules.mjs           # rewrite data/modules.js
 *   node tools/generate-modules.mjs --check   # verify in sync, exit 1 if not
 *
 * This is a development tool, NOT a build step. The site runs directly from the
 * committed data/modules.js with no toolchain.
 *
 * Format parsed (the master brief's, transcribed into CURRICULUM.md):
 *
 *     ## MODULE 08 — Hashing & HashMap Internals
 *
 *     This module must receive **extra depth**.      ← a note
 *
 *     Topics:
 *
 *     * hashing concept                              ← a topic
 *     * hash functions
 *
 *     Include diagrams and dry runs.                 ← a note
 *
 * Note that the brief carries NO per-module description or prerequisite fields.
 * See `description` and `prerequisites` below — neither is invented here.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRIEF = join(ROOT, 'docs/MASTER_BRIEF.md');
const SOURCE = join(ROOT, 'docs/CURRICULUM.md');
const TARGET = join(ROOT, 'data/modules.js');

const EXPECTED_COUNT = 43;

/* ---------------------------------------------------------------- helpers */

/** Strip inline markdown so metadata carries plain text, not markup. */
function plain(text) {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Build a module's URL slug from its number and name.
 *
 * PERMANENT KEYS: Phase 4 progress records are keyed on these ids. Renaming a
 * module in the master brief moves its id and orphans stored progress. If a
 * rename ever becomes unavoidable, pin the old id here by hand.
 */
function slugify(number, name) {
  const body = plain(name)
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${number}-${body}`;
}

/**
 * Split a document into module blocks keyed by number.
 * Used for both CURRICULUM.md and MASTER_BRIEF.md so the two can be compared.
 */
function extractModuleBlocks(text) {
  const heads = [...text.matchAll(/^## MODULE (\d{2}) — (.+)$/gm)];
  return heads.map((h, i) => {
    const end = i + 1 < heads.length ? heads[i + 1].index : undefined;
    let block = text.slice(h.index, end);

    // The LAST module has no following module heading, so the slice would run to
    // end of file — swallowing the brief's Sections 13-48, or the curriculum's
    // appendices. Cut at the next document-level "# " heading; module bodies only
    // ever use "##" and "###", so this can never truncate real module content.
    const boundary = block.search(/\n# [^\n]/);
    if (boundary !== -1) block = block.slice(0, boundary);

    // Drop a trailing horizontal rule and whitespace so blocks compare cleanly.
    block = block.replace(/\n+---\s*$/, '').trimEnd();
    return { number: h[1], name: h[2].trim(), block };
  });
}

/* ------------------------------------------------------------- extraction */

function parseModules(text) {
  const blocks = extractModuleBlocks(text);
  if (blocks.length !== EXPECTED_COUNT) {
    throw new Error(`Expected ${EXPECTED_COUNT} modules, found ${blocks.length}. Refusing to generate.`);
  }

  return blocks.map(({ number, name, block }) => {
    // Everything after the heading line.
    const body = block.split('\n').slice(1).join('\n');

    const topics = [];
    const notes = [];
    const subsections = [];
    let currentSub = null;

    for (const raw of body.split('\n')) {
      const line = raw.trim();
      if (line === '') continue;

      // "### Project 1 — Core Java" (Module 42 uses these)
      const sub = line.match(/^###\s+(.+)$/);
      if (sub) {
        currentSub = { heading: plain(sub[1]), text: '' };
        subsections.push(currentSub);
        continue;
      }

      // "* topic"
      const bullet = line.match(/^\*\s+(.+)$/);
      if (bullet) {
        topics.push(plain(bullet[1]));
        continue;
      }

      // Lead-ins like "Topics:" carry no information once bullets are parsed.
      if (/^(Topics|Include|Potentially include|For every project teach):$/i.test(line)) continue;

      // Blockquote lines ("> JPA = specification") are emphasis, kept as notes.
      const text = plain(line.replace(/^>\s?/, ''));
      if (!text) continue;

      if (currentSub && currentSub.text === '') currentSub.text = text;
      else notes.push(text);
    }

    return {
      number,
      id: slugify(number, name),
      name: plain(name),

      // DERIVED, not authored. The master brief provides no description field,
      // and inventing editorial prose for 43 modules would be fabrication. This
      // is a mechanical restatement of the module's own first topics.
      description: topics.length
        ? `Topics include: ${topics.slice(0, 5).join(', ')}.`
        : '',
      descriptionDerived: true,

      // The master brief's Section 12 does not state per-module prerequisites.
      // Left empty deliberately rather than inferred from module order.
      prerequisites: [],

      // Emphasis the brief attaches to a module — e.g. Module 08's extra-depth
      // requirement, Module 14's JVM-spec-vs-HotSpot distinction, Module 30's
      // JPA=specification / Hibernate=implementation framing. These are
      // requirements, so they are carried into the metadata verbatim.
      notes,
      subsections,
      topics,

      // Facts about the repository, not placeholders: no chapter content exists.
      status: 'NOT_STARTED',
      chapterCount: 0,
      chapters: [],
    };
  });
}

/* ------------------------------------------------------------ assertions */

function assertValid(modules) {
  const numbers = modules.map((m) => m.number);
  const expected = Array.from({ length: EXPECTED_COUNT }, (_, i) => String(i + 1).padStart(2, '0'));
  if (numbers.join() !== expected.join()) {
    throw new Error('Module numbers are not exactly 01–43 in order. Refusing to generate.');
  }
  if (new Set(modules.map((m) => m.id)).size !== modules.length) {
    throw new Error('Duplicate module ids generated.');
  }
  for (const m of modules) {
    if (!m.name) throw new Error(`Module ${m.number} has no name.`);
    if (m.topics.length === 0) throw new Error(`Module ${m.number} has no topics.`);
    if (m.status !== 'NOT_STARTED') throw new Error(`Module ${m.number} status must be NOT_STARTED.`);
    if (m.chapterCount !== 0) throw new Error(`Module ${m.number} chapterCount must be 0.`);
  }
}

/**
 * Isolate Section 12 of the master brief.
 *
 * Necessary because the brief continues into Sections 13–48 after the last
 * module, and an unbounded slice would make Module 43's block swallow the rest
 * of the document.
 */
function briefSection12(text) {
  const after = text.split('# 12. EXACT 43-MODULE CURRICULUM')[1];
  if (after === undefined) throw new Error('MASTER_BRIEF.md has no Section 12 heading.');
  const section = after.split('\n# 13. CONTENT STRUCTURE')[0];
  const start = section.indexOf('## MODULE 01 —');
  if (start === -1) throw new Error('MASTER_BRIEF.md Section 12 has no Module 01 heading.');
  return section.slice(start);
}

/** Verify CURRICULUM.md's module blocks are still verbatim from the brief. */
function assertTranscriptionFaithful() {
  const brief = extractModuleBlocks(briefSection12(readFileSync(BRIEF, 'utf8')));
  const curr = extractModuleBlocks(readFileSync(SOURCE, 'utf8'));

  if (brief.length !== curr.length) {
    return `MASTER_BRIEF.md has ${brief.length} modules, CURRICULUM.md has ${curr.length}.`;
  }
  for (let i = 0; i < brief.length; i += 1) {
    if (brief[i].number !== curr[i].number) {
      return `Module order differs at position ${i + 1}: brief ${brief[i].number}, curriculum ${curr[i].number}.`;
    }
    if (brief[i].block !== curr[i].block) {
      return `Module ${brief[i].number} in CURRICULUM.md is not verbatim from MASTER_BRIEF.md.`;
    }
  }
  return null;
}

/* --------------------------------------------------------------- emitting */

function render(modules) {
  const banner = `/**
 * modules.js — the module metadata layer. GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Canonical source: docs/MASTER_BRIEF.md §12
 * Transcribed into: docs/CURRICULUM.md
 * Generated by:     node tools/generate-modules.mjs
 * Verify in sync:   node tools/generate-modules.mjs --check
 *
 * This is the ONE place the application reads module metadata from. The sidebar,
 * dashboard, curriculum view, module overview, and search index all consume this
 * array; nothing hardcodes a module list anywhere else.
 *
 * \`number\` and \`id\` are PERMANENT KEYS — Phase 4 progress records are keyed on
 * \`id\`. Renaming a module in the master brief changes its generated id.
 *
 * Two fields deserve explicit note, because the master brief does not supply them:
 *
 *   description  — DERIVED mechanically from each module's own first five topics,
 *                  not authored. \`descriptionDerived: true\` marks this. The brief
 *                  has no description field and inventing prose would be
 *                  fabrication.
 *   prerequisites — EMPTY for every module. The brief's Section 12 states no
 *                  per-module prerequisites, and inferring them from module order
 *                  would be a guess.
 *
 * \`notes\` carries the brief's per-module emphasis verbatim (Module 08's extra
 * depth, Module 14's JVM-spec-vs-HotSpot distinction, Module 30's JPA-vs-Hibernate
 * framing). Those are requirements, not commentary.
 *
 * \`status\` and \`chapterCount\` describe what actually exists in this repository:
 * all 43 modules are NOT_STARTED with 0 chapters. Metadata is not content.
 */

export const MODULES = `;

  return `${banner}${JSON.stringify(modules, null, 2)};\n\nexport default MODULES;\n`;
}

/* ------------------------------------------------------------------- main */

const drift = assertTranscriptionFaithful();
if (drift) {
  console.error(`TRANSCRIPTION DRIFT: ${drift}`);
  console.error('docs/CURRICULUM.md must be a verbatim copy of MASTER_BRIEF.md §12.');
  process.exit(1);
}

const modules = parseModules(readFileSync(SOURCE, 'utf8'));
assertValid(modules);
const out = render(modules);

if (process.argv.includes('--check')) {
  const current = readFileSync(TARGET, 'utf8');
  if (current !== out) {
    console.error('OUT OF SYNC: data/modules.js does not match docs/CURRICULUM.md.');
    console.error('Run: node tools/generate-modules.mjs');
    process.exit(1);
  }
  console.log('IN SYNC: MASTER_BRIEF.md → CURRICULUM.md → data/modules.js.');
  process.exit(0);
}

writeFileSync(TARGET, out);
console.log(`Wrote ${TARGET}`);
console.log(`  modules:     ${modules.length}`);
console.log(`  topics:      ${modules.reduce((n, m) => n + m.topics.length, 0)}`);
console.log(`  notes:       ${modules.reduce((n, m) => n + m.notes.length, 0)}`);
console.log(`  subsections: ${modules.reduce((n, m) => n + m.subsections.length, 0)}`);
