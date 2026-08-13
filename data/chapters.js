/**
 * chapters.js — the manifest of authored chapters.
 *
 * ===========================================================================
 * WHY THIS IS SEPARATE FROM data/modules.js
 * ===========================================================================
 * `data/modules.js` is GENERATED from `docs/CURRICULUM.md`, which is itself a
 * verbatim transcription of `docs/MASTER_BRIEF.md` §12. The brief specifies
 * *what each module must cover*; it says nothing about how that coverage is
 * split into chapters, because chapter boundaries are an authoring decision
 * made when a module is written (docs/ARCHITECTURE.md §5).
 *
 * So chapters cannot come from the generator, and a generated
 * `chapterCount: 0` would start lying the moment a chapter was authored. This
 * file is the source instead:
 *
 *     docs/MASTER_BRIEF.md  →  docs/CURRICULUM.md  →  data/modules.js
 *          (canonical)           (transcription)        (GENERATED: what
 *                                                        must be covered)
 *
 *     data/chapters.js  →  content/modules/…       (AUTHORED: what has
 *          (this file)       (chapter content)      actually been written)
 *
 * Read them through `assets/js/chapters.js`, which is the only module the UI
 * uses. Nothing else should import this file directly.
 *
 * ===========================================================================
 * LOADING STRATEGY — resolves an ARCHITECTURE §4 open question
 * ===========================================================================
 * Chapter *metadata* (id, title, summary) is static and tiny, so it lives here
 * and loads with the app — the sidebar and module pages need it immediately.
 *
 * Chapter *content* is large and is fetched with a dynamic `import()` only when
 * the learner opens that chapter. With 43 modules eventually holding several
 * chapters each, eagerly importing every chapter would mean downloading the
 * whole curriculum to render a sidebar. Dynamic import needs no bundler and no
 * build step, so it costs nothing against the project's constraints.
 *
 * ===========================================================================
 * DATA CONTRACT
 * ===========================================================================
 * Manifest entry (this file):
 *
 *   id          string   PERMANENT key, `NN-MM` (module–chapter), e.g. '01-01'.
 *                        Progress records key on it — never renumber a chapter.
 *   moduleId    string   PERMANENT module id from data/modules.js
 *   number      number   position within the module, 1-based
 *   title       string
 *   summary     string   one line, shown in lists
 *   status      string   one of the five status tokens (docs/PROJECT_STATE.md)
 *   load        function () => Promise<{chapter}>  dynamic import of the content
 *
 * Chapter content (content/modules/…):
 *
 *   id, moduleId, number, title, subtitle
 *   objectives      string[]
 *   topicsCovered   string[]  exact topic strings from CURRICULUM.md
 *   topicsDeferred  [{ topic, to }]      what this chapter deliberately omits
 *   sections        [ …typed sections… ] the body — see the vocabulary below
 *   guidedLab       { heading, intro, steps: [{ instruction, command, expected, note }] }
 *   commonMistakes  [{ mistake, why, realError, fix }]
 *   interviewQuestions [{ category, question, answer }]
 *   revision        string[]
 *   integration     [{ text, target }]   cross-links; never re-teaching
 *   verification    { jdk, date, note }  what was actually run, and what was not
 *
 * SECTION VOCABULARY — assets/js/chapter-view.js renders exactly these types,
 * and ignores anything it does not recognise rather than throwing:
 *
 *   prose     { heading, body: string[] }
 *   callout   { tone: 'note'|'warning'|'delta', heading, body: string[] }
 *   code      { heading, filename, language, code, caption?, command?, output? }
 *   terminal  { heading, command, output, caption? }
 *   table     { heading, columns: string[], rows: string[][], note? }
 *   diagram   { heading, alt, steps: [{ label, detail }] }
 *
 * Inline `backticks` in any string are rendered as code spans, and **double
 * asterisks** as bold. That is the entire inline vocabulary — deliberately
 * tiny, and applied by building DOM nodes, never by assigning innerHTML.
 */

/** @type {Array<object>} */
export const CHAPTERS = [
  {
    id: '01-01',
    moduleId: '01-java-foundations-execution-model',
    number: 1,
    title: 'From Source to Running Program',
    summary:
      'The compilation and execution pipeline: JDK/JRE/JVM, javac, bytecode, '
      + 'class files, the java launcher, the classpath, and JAR files.',
    status: 'VERIFIED',
    load: () => import('../content/modules/module-01/01-01-from-source-to-running-program.js'),
  },
];

/**
 * The planned chapter breakdown for Module 01, recorded so the next session
 * knows where Chapter 1 stops and what Chapter 2 begins.
 *
 * These are NOT chapters — nothing has been written for them and they must not
 * appear in the UI as if they had. They are the authoring plan, kept here
 * because a future session with no conversation history needs it and would
 * otherwise have to re-derive the split from the topic list.
 *
 * Module 01's 45 curriculum topics divide into four chapters. Chapters 2–4 are
 * NOT_STARTED. Later modules will record their own plans the same way when
 * they are authored — no plan is invented ahead of the module being written.
 */
export const PLANNED_CHAPTERS = {
  '01-java-foundations-execution-model': [
    { number: 1, id: '01-01', title: 'From Source to Running Program', status: 'VERIFIED' },
    {
      number: 2,
      id: '01-02',
      title: 'JVM Architecture & Class Loading',
      status: 'NOT_STARTED',
      topics: ['JVM architecture', 'class loading', 'class loading phases', 'loading',
        'linking', 'verification', 'preparation', 'resolution', 'initialization',
        'class loaders', 'bootstrap/platform/application class loaders'],
    },
    {
      number: 3,
      id: '01-03',
      title: 'The Execution Engine',
      status: 'NOT_STARTED',
      topics: ['execution engine', 'interpreter', 'JIT compiler', 'HotSpot',
        'JVM warm-up', 'basic JVM command-line concepts'],
    },
    {
      number: 4,
      id: '01-04',
      title: 'Program Entry, Output, and Structure',
      status: 'NOT_STARTED',
      topics: ['main()', 'public static void main(String[] args)',
        'command-line arguments', 'System', 'System.out', 'PrintStream',
        'standard output', 'Java naming conventions', 'packages', 'imports'],
    },
  ],
};

export default CHAPTERS;
