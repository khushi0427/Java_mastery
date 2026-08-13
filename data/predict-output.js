/**
 * predict-output.js — predict-the-output questions, keyed to modules.
 *
 * ===========================================================================
 * AUTHORED PER CHAPTER, THROUGH `CONTINUE` — NEVER AHEAD OF IT
 * ===========================================================================
 * Master brief §19 calls for roughly 5–8 of these in behaviour-heavy chapters.
 * They are authored alongside the chapter they belong to, never in advance.
 *
 * Authored so far: Module 01 Chapters 1 and 2 (`01-01`, `01-02`) — five and six
 * questions respectively. Every
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
const CHAPTER_01_02 = '01-02';

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

  /* ======================================================================
     Module 01 · Chapter 2 — JVM Architecture & Class Loading
     Every answer captured from a real run, OpenJDK 21.0.10, 2026-08-13.
     ====================================================================== */

  {
    id: '01-02-predict-lazy-interleaving',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    prompt: 'In what order do these four lines appear — and does NeverUsed print at all?',
    language: 'java',
    code: [
      'public class LazyLoading {',
      '    public static void main(String[] args) {',
      '        System.out.println("main started");',
      '        Heavy notYet;',
      '        System.out.println("declared a Heavy reference");',
      '        notYet = new Heavy();',
      '        System.out.println("created a Heavy");',
      '    }',
      '}',
      '',
      'class Heavy     { static { System.out.println("  >> Heavy static initializer ran"); } }',
      'class NeverUsed { static { System.out.println("  >> NeverUsed static initializer ran"); } }',
    ].join('\n'),
    answer: 'main started\ndeclared a Heavy reference\n  >> Heavy static initializer ran\ncreated a Heavy',
    explanation:
      'NeverUsed never prints — it is never loaded, so its static block never runs. '
      + 'More subtly, declaring the variable `Heavy notYet;` does not load Heavy either: a '
      + 'declaration is not an active use. Only `new Heavy()` is, which is why the static '
      + 'initializer appears between the second and third println rather than before them. '
      + 'Confirm with `java -verbose:class LazyLoading | grep NeverUsed` — no output.',
    isPlaceholder: false,
  },

  {
    id: '01-02-predict-preparation-default',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    prompt: 'What value does `later` have on the first line of output?',
    language: 'java',
    code: [
      'class Counter {',
      '    static int counter = report();',
      '    static int later = 99;',
      '',
      '    static int report() {',
      '        System.out.println("  initializer running; later = " + later);',
      '        return 1;',
      '    }',
      '',
      '    static {',
      '        System.out.println("  static block; counter = " + counter + ", later = " + later);',
      '    }',
      '}',
    ].join('\n'),
    answer: '  initializer running; later = 0\n  static block; counter = 1, later = 99',
    explanation:
      'Zero — and not because the memory is uninitialised. Preparation, the linking step '
      + 'before initialization, allocates every static field and sets it to its type default: '
      + '0 for int, false for boolean, null for references. Only then does initialization run '
      + '<clinit>, which the compiler builds from all static field initializers and all static '
      + 'blocks in source order. `counter` comes first, so `report()` runs while `later` still '
      + 'holds its prepared default. By the static block both fields have their real values.',
    isPlaceholder: false,
  },

  {
    id: '01-02-predict-class-literal',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    prompt: 'Does `Sub.class` initialize Sub? What is the full output?',
    language: 'java',
    code: [
      'public class ClassLiteral {',
      '    public static void main(String[] args) {',
      '        System.out.println("step 1: " + Sub.class.getSimpleName());',
      '        System.out.println("step 2:");',
      '        new Sub();',
      '    }',
      '}',
      'class Sup            { static { System.out.println("  Sup init"); } }',
      'class Sub extends Sup { static { System.out.println("  Sub init"); } }',
    ].join('\n'),
    answer: 'step 1: Sub\nstep 2:\n  Sup init\n  Sub init',
    explanation:
      'A class literal does NOT initialize the class. `Sub.class` yields the Class object '
      + 'without triggering initialization — step 1 prints alone. Instantiating does trigger '
      + 'it, and the superclass goes first: initializing a class always initializes its '
      + 'superclass first, so `Sup init` precedes `Sub init`. This is why frameworks can '
      + 'collect class literals cheaply, and why `Class.forName(name)` — which DOES initialize '
      + '— is the wrong tool for merely inspecting a class.',
    isPlaceholder: false,
  },

  {
    id: '01-02-predict-init-triggers',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    prompt: 'Which of these four classes print their INITIALIZED line?',
    language: 'java',
    code: [
      'System.out.println(ConstHolder.LIMIT);          // static final int LIMIT = 10;',
      'System.out.println(BoxedHolder.LIMIT);          // static final Integer LIMIT = 10;',
      'ArrayOnly[] a = new ArrayOnly[2];',
      'System.out.println(Sub.inherited);              // `inherited` is declared in Base',
      '',
      '// each class has: static { System.out.println("  INITIALIZED <name>"); }',
      '// and: class Sub extends Base',
    ].join('\n'),
    answer: '  INITIALIZED BoxedHolder\n  INITIALIZED Base\n\n(ConstHolder, ArrayOnly and Sub print nothing.)',
    explanation:
      'Three of the four "obvious" cases do not initialize.\n\n'
      + 'ConstHolder: `static final int LIMIT = 10` is a compile-time constant, so the compiler '
      + 'inlines 10 at the use site. Nothing at run time refers to the class. Check with javap — '
      + 'ConstHolder does not appear in the bytecode.\n\n'
      + 'BoxedHolder: `static final Integer` requires boxing, so it is NOT a constant expression. '
      + 'This is a genuine field read and it initializes.\n\n'
      + 'ArrayOnly: creating an array creates the array class, not the element class. No instance '
      + 'of ArrayOnly exists.\n\n'
      + 'Sub: a static field belongs to the class that DECLARES it. Reading `Sub.inherited` is a '
      + 'use of Base, so Base initializes and Sub does not — the case people get wrong most often.',
    isPlaceholder: false,
  },

  {
    id: '01-02-predict-init-failure-twice',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    prompt: 'Broken.use() is called twice inside a try/catch that prints the exception class. What is caught each time?',
    language: 'java',
    code: [
      'class Broken {',
      '    static final int VALUE;',
      '    static {',
      '        System.out.println("  Broken static initializer starting");',
      '        if (true) throw new IllegalStateException("configuration missing");',
      '        VALUE = 1;',
      '    }',
      '    static void use() { System.out.println("  VALUE = " + VALUE); }',
      '}',
    ].join('\n'),
    answer: 'attempt 1:\n  Broken static initializer starting\n  caught java.lang.ExceptionInInitializerError\n  caused by java.lang.IllegalStateException: configuration missing\nattempt 2:\n  caught java.lang.NoClassDefFoundError\n  caused by java.lang.ExceptionInInitializerError: Exception java.lang.IllegalStateException: configuration missing [in thread "main"]',
    explanation:
      'Two different errors for the same broken class, and the second is the dangerous one.\n\n'
      + 'First use: the initializer runs, throws, and the JVM wraps it in '
      + 'ExceptionInInitializerError with the real exception as its cause. The class is then '
      + 'marked erroneous, permanently.\n\n'
      + 'Second use: notice the missing "starting" line — the initializer does NOT run again. The '
      + 'JVM reports NoClassDefFoundError instead.\n\n'
      + 'In production you almost always see the second one, long after the first was logged and '
      + 'forgotten, which sends people to audit a classpath that was never the problem. Read the '
      + '`Caused by:` chain, and look for the FIRST failure in the logs rather than the loudest.',
    isPlaceholder: false,
  },

  {
    id: '01-02-predict-stale-constant',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    prompt: 'Config.java says `TIMEOUT = 30`. After editing it to 60 and recompiling ONLY Config.java, what does the middle command print?',
    language: 'shell',
    code: [
      'javac --release 17 Config.java UsesConfig.java && java UsesConfig',
      '',
      '# edit Config.java: TIMEOUT = 30  ->  TIMEOUT = 60',
      'javac --release 17 Config.java && java UsesConfig',
      '',
      'javac --release 17 UsesConfig.java && java UsesConfig',
    ].join('\n'),
    answer: 'timeout = 30\ntimeout = 30\ntimeout = 60',
    explanation:
      'The middle line still prints 30, even though Config.java now says 60 and was recompiled.\n\n'
      + '`public static final int TIMEOUT = 30` is a compile-time constant, so javac substituted '
      + '30 directly into UsesConfig when UsesConfig was compiled, then folded the whole '
      + 'concatenation into one string literal. At run time nothing consults Config at all — '
      + '`javap -c UsesConfig.class` shows no reference to it.\n\n'
      + 'This is a real build trap. Incremental builds that recompile only changed files hit it, '
      + 'and so does swapping one JAR in a deployment. Do a clean build when a constant changes; '
      + 'and if a value must be updatable without recompiling its users, do not make it a '
      + 'compile-time constant — a boxed type or a method call is read at run time instead.',
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
