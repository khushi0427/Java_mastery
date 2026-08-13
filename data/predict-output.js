/**
 * predict-output.js — predict-the-output questions, keyed to modules.
 *
 * ===========================================================================
 * AUTHORED PER CHAPTER, THROUGH `CONTINUE` — NEVER AHEAD OF IT
 * ===========================================================================
 * Master brief §19 calls for roughly 5–8 of these in behaviour-heavy chapters.
 * They are authored alongside the chapter they belong to, never in advance.
 *
 * Authored so far: Module 01 Chapter 1 (`01-01`) — five questions. Every
 * `answer` below is REAL OUTPUT captured by running the command on OpenJDK
 * 21.0.10 on 2026-08-13, not output written from memory. A predict-the-output
 * question with a guessed answer would teach the wrong thing with total
 * confidence, so this rule matters more here than anywhere else in the project.
 *
 * One entry remains flagged `isPlaceholder: true` — the Phase 4 shell demo,
 * excluded from every count by `realPredictionCount()`.
 * ===========================================================================
 *
 * DATA CONTRACT (documented in docs/ARCHITECTURE.md §6)
 *
 *   id            string   unique within its module
 *   moduleId      string   PERMANENT module id from data/modules.js
 *   prompt        string   what to predict, e.g. "What does this print?"
 *   language      string   for the code label; 'java' throughout the curriculum
 *   chapterId     string   optional; PERMANENT chapter id from data/chapters.js
 *   code          string   the snippet the learner reasons about. When
 *                          `language` is not 'java' it renders as a static
 *                          block — the runner only executes Java.
 *   answer        string   the actual output — HIDDEN until revealed (§19)
 *   explanation   string   why, revealed with the answer
 *   isPlaceholder boolean  true only for demo scaffolding
 *
 * The answer must never render before the learner asks for it: predicting first
 * is the entire pedagogical point (master brief §14).
 */

// Permanent keys, written once so a typo cannot orphan a question.
const MODULE_01 = '01-java-foundations-execution-model';
const CHAPTER_01_01 = '01-01';

/** @type {Array<object>} */
export const PREDICTIONS = [
  {
    id: 'demo-placeholder-predict',
    moduleId: '01-java-foundations-execution-model',
    prompt: 'Demo placeholder — what would this print?',
    language: 'java',
    code: [
      '// Placeholder snippet. Not curriculum content.',
      '// Real predict-the-output questions are authored per module.',
      'public class Demo {',
      '    public static void main(String[] args) {',
      '        System.out.println("placeholder");',
      '    }',
      '}',
    ].join('\n'),
    answer: 'placeholder',
    explanation:
      'Placeholder explanation. It stays hidden until the learner reveals it, '
      + 'which is the behaviour this demo exists to demonstrate.',
    isPlaceholder: true,
  },

  /* ======================================================================
     Module 01 · Chapter 1 — From Source to Running Program
     Every answer captured from a real run, OpenJDK 21.0.10, 2026-08-13.
     ====================================================================== */

  {
    id: '01-01-predict-args-quoting',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    prompt: 'This program is launched as: java ArgReport "alpha beta" gamma — what does it print?',
    language: 'java',
    code: [
      'public class ArgReport {',
      '    public static void main(String[] args) {',
      '        System.out.println("Received " + args.length + " argument(s).");',
      '        for (int i = 0; i < args.length; i++) {',
      '            System.out.println("  [" + i + "] " + args[i]);',
      '        }',
      '    }',
      '}',
    ].join('\n'),
    answer: 'Received 2 argument(s).\n  [0] alpha beta\n  [1] gamma',
    explanation:
      'Two, not three. The shell — not Java — splits the command line, and quoting keeps '
      + '"alpha beta" together as a single argument. By the time your program starts, the '
      + 'splitting has already happened and args holds exactly what the shell handed over. '
      + 'Note also that args[0] is the first argument, not the program name: unlike C, there '
      + 'is no argv[0] to skip, because the class name went to the launcher rather than to you.',
    isPlaceholder: false,
  },

  {
    id: '01-01-predict-run-dot-class',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    prompt: 'Warmup.class exists in the current directory. What happens when you run this?',
    language: 'shell',
    code: 'java Warmup.class',
    answer: 'Error: Could not find or load main class Warmup.class\nCaused by: java.lang.ClassNotFoundException: Warmup.class',
    explanation:
      'The java launcher takes a CLASS name, not a file name. Given "Warmup.class" it looks for '
      + 'a class literally called class inside a package called Warmup, does not find one, and '
      + 'reports it. The fix is to drop the extension: java Warmup. This is one of the very first '
      + 'errors most people hit, and it is worth recognising instantly rather than re-reading.',
    isPlaceholder: false,
  },

  {
    id: '01-01-predict-magic-number',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    prompt: 'HelloJava.java was compiled with `javac --release 17`. What do the first eight bytes of the class file look like?',
    language: 'shell',
    code: 'od -A d -t x1 -N 8 HelloJava.class',
    answer: '0000000 ca fe ba be 00 00 00 3d\n0000008',
    explanation:
      'Every class file begins with the magic number 0xCAFEBABE — a JVM that does not see it '
      + 'rejects the file immediately. The next two bytes are the minor version (0) and the two '
      + 'after that the major version: 0x003d is 61, which is Java 17, exactly what --release 17 '
      + 'requested. Compiling the same source with plain javac on a JDK 21 gives 0x0041 (65) '
      + 'instead. This number is the whole of UnsupportedClassVersionError: the runtime refuses '
      + 'a major version higher than it understands.',
    isPlaceholder: false,
  },

  {
    id: '01-01-predict-jar-no-manifest',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    prompt: 'app.jar was built with `jar --create --file app.jar -C app . -C lib .` and contains UseGreeter.class with a valid main method. What does this print?',
    language: 'shell',
    code: 'java -jar app.jar',
    answer: 'no main manifest attribute, in app.jar',
    explanation:
      'Nothing is wrong with the archive or with the classes inside it. java -jar reads the entry '
      + 'point from Main-Class in META-INF/MANIFEST.MF, and jar did not write one because it was '
      + 'not told to. With several classes potentially carrying a main method, the launcher will '
      + 'not guess. Two fixes: rebuild with --main-class UseGreeter, or bypass the manifest '
      + 'entirely with java -cp app.jar UseGreeter, which works on this exact unmodified JAR.',
    isPlaceholder: false,
  },

  {
    id: '01-01-predict-single-file-mismatch',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    prompt: 'A file named Anything.java contains `public class Different` with a valid main method. What do these two commands do?',
    language: 'shell',
    code: 'java Anything.java\njavac Anything.java',
    answer: 'ran from source\nAnything.java:1: error: class Different is public, should be declared in a file named Different.java\npublic class Different {\n       ^\n1 error',
    explanation:
      'They disagree, and that surprises almost everyone. The single-file source launcher (Java 11 '
      + 'and later) compiles in memory and does NOT enforce the rule that a public class must live '
      + 'in a file of the same name, so the program runs. javac does enforce it and refuses. '
      + 'Both behaviours were verified here on JDK 21. The practical lesson: java Foo.java is a '
      + 'convenience for scratch programs, and code that runs that way is not guaranteed to compile '
      + 'the ordinary route — so do not use it to check that something builds.',
    isPlaceholder: false,
  },
];

/** Questions for one module. @param {string} moduleId */
export function predictionsForModule(moduleId) {
  return PREDICTIONS.filter((p) => p.moduleId === moduleId);
}

/** Questions for one chapter. @param {string} chapterId */
export function predictionsForChapter(chapterId) {
  return PREDICTIONS.filter((p) => p.chapterId === chapterId);
}

/** How many REAL questions exist — placeholders excluded. */
export function realPredictionCount() {
  return PREDICTIONS.filter((p) => !p.isPlaceholder).length;
}

export default PREDICTIONS;
