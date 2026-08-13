/**
 * chapter-view.js — renders one chapter from its data.
 *
 * Content is data; presentation is code (docs/ARCHITECTURE.md §4). This module
 * is the whole presentation side: it walks the typed sections in a chapter
 * object and builds DOM. Chapter files contain no markup, so a change here
 * restyles all 43 modules at once, and a chapter cannot break the page by
 * containing bad HTML — there is no HTML in a chapter file to be bad.
 *
 * The section vocabulary is documented in data/chapters.js. Unknown section
 * types are skipped rather than thrown on: a content file written against a
 * newer vocabulary should degrade to "missing a section", not "blank page".
 *
 * NO innerHTML ANYWHERE. Inline markup is limited to `code spans` and **bold**,
 * applied by splitting the string and building text nodes — so no chapter
 * string can ever be parsed as markup (the property the project keeps
 * regardless of how trusted the data is, ARCHITECTURE §2).
 */

import { el, replaceChildren } from './dom.js';
import { chapterHref, chapterNeighbours, getChapterMeta, loadChapter } from './chapters.js';
import { isChapterComplete, setChapterComplete } from './progress.js';
import { renderCodeRunner } from './code-runner.js';
import { MODULES } from '../../data/modules.js';

/* ==========================================================================
   Inline formatting — the entire vocabulary is `code` and **bold**
   ========================================================================== */

/**
 * Turn one string into an array of nodes, honouring `code` and **bold**.
 *
 * Deliberately not a Markdown parser. Two constructs cover everything the
 * chapters need, and each extra construct is another way for content to
 * surprise the renderer.
 *
 * @param {string} text
 * @returns {Array<Node|string>}
 */
export function inline(text) {
  return parseInline(String(text ?? ''), true);
}

/**
 * The tokenizer behind `inline`.
 *
 * A single regex cannot do this correctly, because the two constructs nest one
 * way but not the other: **bold may contain `code`**, while a code span must
 * keep any asterisks inside it literal. A regex alternation picks whichever
 * branch matches first and then treats the rest as opaque text, which silently
 * rendered **`ClassNotFoundException`** as bold text containing two visible
 * backticks. So this scans character by character instead.
 *
 * Rules:
 *   - A backtick opens a code span that runs to the next backtick. Anything
 *     inside is literal, asterisks included.
 *   - `**` opens bold that runs to the next `**`, and its contents are parsed
 *     again for code spans — but not for further bold, so `****` cannot recurse.
 *   - An unmatched backtick or `**` is just text. Content should never lose
 *     characters because a delimiter was left open.
 *
 * @param {string} text
 * @param {boolean} allowBold
 * @returns {Array<Node|string>}
 */
function parseInline(text, allowBold) {
  const nodes = [];
  let buffer = '';
  let i = 0;

  const flush = () => {
    if (buffer !== '') { nodes.push(buffer); buffer = ''; }
  };

  while (i < text.length) {
    const char = text[i];

    if (char === '`') {
      const end = text.indexOf('`', i + 1);
      if (end !== -1) {
        flush();
        nodes.push(el('code', { text: text.slice(i + 1, end) }));
        i = end + 1;
        continue;
      }
    } else if (allowBold && char === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2);
      if (end !== -1) {
        flush();
        nodes.push(el('strong', {}, parseInline(text.slice(i + 2, end), false)));
        i = end + 2;
        continue;
      }
    }

    buffer += char;
    i += 1;
  }

  flush();
  return nodes;
}

/** A paragraph with inline formatting applied. */
const para = (text, className = '') =>
  el('p', className ? { class: className } : {}, inline(text));

/* ==========================================================================
   Section renderers — one per type in the vocabulary
   ========================================================================== */

function proseSection(section) {
  return el('section', { class: 'chapter-section' }, [
    section.heading ? el('h2', { class: 'chapter-section__heading' }, inline(section.heading)) : null,
    ...section.body.map((text) => para(text, 'chapter-prose')),
  ]);
}

function calloutSection(section) {
  // The tone is also stated in words, not carried by colour alone — a border
  // hue is invisible to anyone who cannot separate those hues.
  const LABEL = { note: 'Note', warning: 'Watch out', delta: 'Coming from C++' };

  return el('aside', { class: `callout callout--${section.tone ?? 'note'}` }, [
    el('p', { class: 'callout__label', text: LABEL[section.tone] ?? 'Note' }),
    section.heading ? el('h3', { class: 'callout__heading' }, inline(section.heading)) : null,
    ...section.body.map((text) => para(text, 'callout__body')),
  ]);
}

function codeSection(section) {
  return el('section', { class: 'chapter-section' }, [
    section.heading ? el('h2', { class: 'chapter-section__heading' }, inline(section.heading)) : null,
    section.filename ? el('p', { class: 'chapter-code__filename', text: section.filename }) : null,

    // A runnable editor rather than a static block: the methodology is
    // Learn → Predict → Code → Compile → Run (master brief §14), and the
    // runner carries the local javac/java commands even with no provider
    // configured (assets/js/code-runner.js).
    renderCodeRunner({ code: section.code, language: section.language ?? 'java' }),

    section.command
      ? el('div', { class: 'chapter-run' }, [
        el('h4', { class: 'chapter-run__label', text: 'Commands' }),
        el('pre', { class: 'output__pre scroll-x' }, [el('code', { text: section.command })]),
      ])
      : null,
    section.output
      ? el('div', { class: 'chapter-run' }, [
        el('h4', { class: 'chapter-run__label', text: 'Actual output' }),
        el('pre', { class: 'output__pre scroll-x' }, [el('code', { text: section.output })]),
      ])
      : null,
    section.caption ? para(section.caption, 'chapter-caption') : null,
  ]);
}

function terminalSection(section) {
  return el('section', { class: 'chapter-section' }, [
    section.heading ? el('h2', { class: 'chapter-section__heading' }, inline(section.heading)) : null,
    el('div', { class: 'terminal' }, [
      el('div', { class: 'terminal__bar' }, [el('span', { class: 'terminal__label', text: 'command' })]),
      el('pre', { class: 'terminal__pre scroll-x' }, [el('code', { text: section.command })]),
      el('div', { class: 'terminal__bar terminal__bar--out' }, [
        el('span', { class: 'terminal__label', text: 'actual output' }),
      ]),
      el('pre', { class: 'terminal__pre terminal__pre--out scroll-x' }, [
        el('code', { text: section.output }),
      ]),
    ]),
    section.caption ? para(section.caption, 'chapter-caption') : null,
  ]);
}

function tableSection(section) {
  return el('section', { class: 'chapter-section' }, [
    section.heading ? el('h2', { class: 'chapter-section__heading' }, inline(section.heading)) : null,
    // Wide tables scroll inside their own container, never the page (§14).
    el('div', { class: 'table-wrap scroll-x' }, [
      el('table', { class: 'chapter-table' }, [
        el('thead', {}, [
          el('tr', {}, section.columns.map((c) => el('th', { scope: 'col' }, inline(c)))),
        ]),
        el('tbody', {}, section.rows.map((row) => el('tr', {}, row.map((cell, index) => (
          // First cell is the row header, so screen readers can associate the
          // rest of the row with it.
          index === 0
            ? el('th', { scope: 'row' }, inline(cell))
            : el('td', {}, inline(cell))
        ))))),
      ]),
    ]),
    section.note ? para(section.note, 'chapter-caption') : null,
  ]);
}

function diagramSection(section) {
  // Built from DOM rather than an image: it stays readable at any width, in
  // both themes, and its text is selectable and searchable.
  return el('section', { class: 'chapter-section' }, [
    section.heading ? el('h2', { class: 'chapter-section__heading' }, inline(section.heading)) : null,
    el('ol', { class: 'pipeline', 'aria-label': section.alt }, section.steps.map((step, index) => (
      el('li', { class: 'pipeline__step' }, [
        el('span', { class: 'pipeline__index', text: String(index + 1) }),
        el('span', { class: 'pipeline__body' }, [
          el('span', { class: 'pipeline__label', text: step.label }),
          el('span', { class: 'pipeline__detail', text: step.detail }),
        ]),
      ])
    ))),
  ]);
}

const SECTION_RENDERERS = {
  prose: proseSection,
  callout: calloutSection,
  code: codeSection,
  terminal: terminalSection,
  table: tableSection,
  diagram: diagramSection,
};

/* ==========================================================================
   Block renderers — the parts every chapter has
   ========================================================================== */

function objectivesBlock(content) {
  return el('section', { class: 'chapter-block' }, [
    el('h2', { class: 'chapter-block__heading', text: 'What you should be able to do afterwards' }),
    el('ul', { class: 'chapter-list-plain' }, content.objectives.map((o) => el('li', {}, inline(o)))),
  ]);
}

function scopeBlock(content) {
  if (!content.topicsDeferred?.length) return null;

  // Saying what a chapter does NOT cover is as important as saying what it
  // does: a learner who expects the whole module here would otherwise think
  // the coverage was thin rather than deliberately split.
  return el('section', { class: 'chapter-block chapter-block--scope' }, [
    el('h2', { class: 'chapter-block__heading', text: 'Not in this chapter' }),
    el('ul', { class: 'chapter-list-plain' }, content.topicsDeferred.map((d) => (
      el('li', {}, [...inline(d.topic), ' — ', el('em', {}, inline(d.to))])
    ))),
  ]);
}

function guidedLabBlock(content) {
  const lab = content.guidedLab;
  if (!lab) return null;

  return el('section', { class: 'chapter-block chapter-block--lab' }, [
    el('h2', { class: 'chapter-block__heading' }, inline(lab.heading)),
    lab.intro ? para(lab.intro, 'chapter-prose') : null,
    el('ol', { class: 'lab-steps' }, lab.steps.map((step, index) => el('li', { class: 'lab-step' }, [
      el('p', { class: 'lab-step__instruction' }, [
        el('span', { class: 'lab-step__number', text: `Step ${index + 1}` }),
        ...inline(step.instruction),
      ]),
      step.command
        ? el('pre', { class: 'output__pre scroll-x' }, [el('code', { text: step.command })])
        : null,
      step.expected
        ? el('div', { class: 'lab-step__expected' }, [
          el('h4', { class: 'chapter-run__label', text: 'Expected' }),
          el('pre', { class: 'output__pre scroll-x' }, [el('code', { text: step.expected })]),
        ])
        : null,
      step.note ? para(step.note, 'chapter-caption') : null,
    ]))),
  ]);
}

function mistakesBlock(content) {
  if (!content.commonMistakes?.length) return null;

  return el('section', { class: 'chapter-block' }, [
    el('h2', { class: 'chapter-block__heading', text: 'Common mistakes' }),
    el('div', { class: 'mistake-list' }, content.commonMistakes.map((m) => (
      el('article', { class: 'mistake' }, [
        el('h3', { class: 'mistake__title' }, inline(m.mistake)),
        el('p', { class: 'mistake__field' }, [el('strong', { text: 'Why: ' }), ...inline(m.why)]),
        m.realError
          ? el('div', { class: 'mistake__error' }, [
            el('h4', { class: 'chapter-run__label', text: 'What you actually see' }),
            el('pre', { class: 'output__pre scroll-x' }, [el('code', { text: m.realError })]),
          ])
          : null,
        el('p', { class: 'mistake__field' }, [el('strong', { text: 'Fix: ' }), ...inline(m.fix)]),
      ])
    ))),
  ]);
}

function interviewBlock(content) {
  if (!content.interviewQuestions?.length) return null;

  return el('section', { class: 'chapter-block' }, [
    el('h2', { class: 'chapter-block__heading', text: 'Interview questions' }),
    para(
      'Answer each one out loud before revealing the model answer. Saying it is '
      + 'a different skill from recognising it.',
      'chapter-prose',
    ),
    el('div', { class: 'interview-list' }, content.interviewQuestions.map((q, index) => {
      const answerId = `interview-answer-${content.id}-${index}`;

      const answer = el('div', { class: 'interview__answer', id: answerId, hidden: true },
        [para(q.answer, 'chapter-prose')]);

      // One persistent toggle whose aria-expanded tracks state — replacing the
      // trigger on reveal would strand that state on a detached element.
      const toggle = el('button', {
        class: 'button button--subtle',
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': answerId,
        text: 'Show model answer',
        on: {
          click: (event) => {
            const button = event.currentTarget;
            const open = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!open));
            button.textContent = open ? 'Show model answer' : 'Hide model answer';
            answer.hidden = open;
          },
        },
      });

      return el('article', { class: 'interview' }, [
        el('p', { class: 'interview__category', text: q.category }),
        el('h3', { class: 'interview__question' }, inline(q.question)),
        toggle,
        answer,
      ]);
    })),
  ]);
}

function revisionBlock(content) {
  if (!content.revision?.length) return null;

  return el('section', { class: 'chapter-block chapter-block--revision' }, [
    el('h2', { class: 'chapter-block__heading', text: 'Revision' }),
    el('ul', { class: 'revision-list' }, content.revision.map((r) => el('li', {}, inline(r)))),
  ]);
}

function integrationBlock(content) {
  if (!content.integration?.length) return null;

  // Cross-links, never re-teaching: each concept has exactly one owning module
  // (docs/AI_INSTRUCTIONS.md §5).
  return el('section', { class: 'chapter-block' }, [
    el('h2', { class: 'chapter-block__heading', text: 'Where this connects' }),
    el('ul', { class: 'chapter-list-plain' }, content.integration.map((link) => el('li', {}, [
      link.target
        ? el('a', { href: link.target }, inline(link.text))
        : el('span', {}, inline(link.text)),
    ]))),
  ]);
}

function verificationBlock(content) {
  const v = content.verification;
  if (!v) return null;

  // Every chapter states what was actually executed and what was not. This is
  // the project's verification-honesty rule made visible to the learner rather
  // than buried in PROJECT_STATE.
  return el('section', { class: 'chapter-block chapter-block--verification' }, [
    el('h2', { class: 'chapter-block__heading', text: 'How this chapter was verified' }),
    el('dl', { class: 'verification' }, [
      el('dt', { text: 'Run on' }), el('dd', { text: v.jdk }),
      el('dt', { text: 'Date' }), el('dd', { text: v.date }),
    ]),
    para(v.note, 'chapter-prose'),
  ]);
}

/** Mark-complete control and previous/next chapter navigation. */
function chapterFooter(content) {
  const { previous, next } = chapterNeighbours(content.id);

  const button = el('button', {
    class: 'button',
    type: 'button',
    'aria-pressed': String(isChapterComplete(content.moduleId, content.id)),
  });

  const paint = () => {
    const done = isChapterComplete(content.moduleId, content.id);
    button.textContent = done ? 'Completed — click to undo' : 'Mark this chapter complete';
    button.setAttribute('aria-pressed', String(done));
    button.classList.toggle('is-active', done);
  };

  button.addEventListener('click', () => {
    setChapterComplete(content.moduleId, content.id, !isChapterComplete(content.moduleId, content.id));
    paint();
  });
  paint();

  const moduleName = MODULES.find((m) => m.id === content.moduleId)?.name ?? 'the module';

  return el('footer', { class: 'chapter-footer' }, [
    el('div', { class: 'chapter-footer__complete' }, [button]),
    el('nav', { class: 'chapter-nav', 'aria-label': 'Chapter navigation' }, [
      previous
        ? el('a', { class: 'chapter-nav__link chapter-nav__link--prev', href: chapterHref(previous.id) }, [
          el('span', { class: 'chapter-nav__dir', text: 'Previous' }),
          el('span', { class: 'chapter-nav__title', text: previous.title }),
        ])
        : el('span', { class: 'chapter-nav__placeholder' }),
      el('a', { class: 'chapter-nav__link chapter-nav__link--up', href: `#/module/${content.moduleId}` }, [
        el('span', { class: 'chapter-nav__dir', text: 'Module' }),
        el('span', { class: 'chapter-nav__title', text: moduleName }),
      ]),
      next
        ? el('a', { class: 'chapter-nav__link chapter-nav__link--next', href: chapterHref(next.id) }, [
          el('span', { class: 'chapter-nav__dir', text: 'Next' }),
          el('span', { class: 'chapter-nav__title', text: next.title }),
        ])
        : el('span', { class: 'chapter-nav__placeholder' }),
    ]),
  ]);
}

/* ==========================================================================
   Entry point
   ========================================================================== */

/**
 * Render a chapter into #chapter-body.
 *
 * Two-stage by necessity: the router needs a synchronous yes/no to decide
 * between this view and the 404 view, but the content arrives via a dynamic
 * import. `beginChapterRender` answers synchronously from the manifest and
 * kicks off the load; the body fills in when it resolves.
 *
 * @param {string} chapterId
 * @returns {boolean} false when no such chapter exists
 */
export function beginChapterRender(chapterId) {
  const container = document.getElementById('chapter-body');
  if (!container) return false;

  const meta = getChapterMeta(chapterId);
  if (!meta) return false;

  replaceChildren(container, [
    el('p', { class: 'view__eyebrow', text: `Chapter ${meta.number}` }),
    el('h1', { class: 'view__title', text: meta.title }),
    el('p', { class: 'chapter-loading', text: 'Loading chapter…' }),
  ]);

  loadChapter(chapterId).then((content) => {
    // A slow load followed by a fast navigation elsewhere must not overwrite
    // whatever the learner is now looking at.
    if (currentChapterId !== chapterId) return;

    if (!content) {
      replaceChildren(container, [
        el('h1', { class: 'view__title', text: meta.title }),
        el('p', { class: 'empty-state' }, inline(
          'This chapter’s content could not be loaded. The chapter is listed in '
          + '`data/chapters.js` but its content file did not import — see the '
          + 'browser console for the underlying error.',
        )),
      ]);
      return;
    }

    paintChapter(container, content);
  });

  return true;
}

let currentChapterId = null;

/** Tell the view which chapter is current, so a stale load discards itself. */
export function setCurrentChapter(chapterId) {
  currentChapterId = chapterId;
}

function paintChapter(container, content) {
  const module = MODULES.find((m) => m.id === content.moduleId);

  const body = content.sections
    .map((section) => {
      const render = SECTION_RENDERERS[section.type];
      // Unknown type: skip it. A content file written against a newer
      // vocabulary should lose a section, not the whole page.
      if (!render) {
        console.warn(`chapter-view.js: unknown section type "${section.type}" in ${content.id}`);
        return null;
      }
      return render(section);
    })
    .filter(Boolean);

  replaceChildren(container, [
    el('header', { class: 'chapter-header' }, [
      el('p', { class: 'view__eyebrow' }, [
        el('a', { href: `#/module/${content.moduleId}`, text: module ? `Module ${module.number} · ${module.name}` : 'Module' }),
        ` · Chapter ${content.number}`,
      ]),
      el('h1', { class: 'view__title', text: content.title }),
      content.subtitle ? para(content.subtitle, 'view__lede') : null,
    ]),

    objectivesBlock(content),
    scopeBlock(content),
    ...body,
    guidedLabBlock(content),
    mistakesBlock(content),
    interviewBlock(content),
    revisionBlock(content),
    integrationBlock(content),
    verificationBlock(content),
    chapterFooter(content),
  ].filter(Boolean));

  // Practice for this chapter lives in the Practice route, which renders from
  // data/exercises.js and data/predict-output.js. Point at it rather than
  // duplicating the shells here.
  container.append(el('section', { class: 'chapter-block' }, [
    el('h2', { class: 'chapter-block__heading', text: 'Practice' }),
    para(
      'Exercises and predict-the-output questions for this chapter live on the '
      + 'Practice page, so the hint ladder and reveal behaviour stay in one place.',
      'chapter-prose',
    ),
    el('a', { class: 'button', href: '#/practice', text: 'Go to practice' }),
  ]));
}
