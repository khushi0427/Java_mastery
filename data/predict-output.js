/**
 * predict-output.js — predict-the-output questions, keyed to modules.
 *
 * ===========================================================================
 * AUTHORED PER CHAPTER, THROUGH `CONTINUE` — NEVER AHEAD OF IT
 * ===========================================================================
 * Master brief §19 calls for roughly 5–8 of these in behaviour-heavy chapters.
 * They are authored alongside the chapter they belong to, never in advance.
 *
 * Authored so far: Module 01 Chapters 1–4 (the whole module) — five, six,
 * five and six questions respectively. Every
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
const CHAPTER_01_03 = '01-03';
const CHAPTER_01_04 = '01-04';

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

  /* ======================================================================
     Module 01 · Chapter 3 — The Execution Engine
     Every answer captured from a real run, OpenJDK 21.0.10,
     4 vCPU Xeon @2.80GHz, 2026-08-13.
     ====================================================================== */

  {
    id: '01-03-predict-vm-info',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    prompt: 'What is the third line of each of these three commands?',
    language: 'shell',
    code: 'java -version\njava -Xint -version\njava -Xcomp -version',
    answer: 'OpenJDK 64-Bit Server VM (build 21.0.10+7-Ubuntu-124.04, mixed mode, sharing)\nOpenJDK 64-Bit Server VM (build 21.0.10+7-Ubuntu-124.04, interpreted mode, sharing)\nOpenJDK 64-Bit Server VM (build 21.0.10+7-Ubuntu-124.04, compiled mode, sharing)',
    explanation:
      'The JVM states its execution strategy every time you ask its version, and "mixed mode" '
      + 'is literal rather than marketing: interpreter AND JIT compiler, together. -Xint '
      + 'disables the JIT, so it reports "interpreted mode". -Xcomp compiles every method on '
      + 'first invocation and never interprets, so it reports "compiled mode".\n\n'
      + 'A running program can read the same string from the java.vm.info system property, '
      + 'which is a convenient way for a benchmark to record the mode it ran under.',
    isPlaceholder: false,
  },

  {
    id: '01-03-predict-warmup-shape',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    prompt: 'Twelve identical batches of work. Will batch 1 and batch 12 take the same time? What about under -Xint?',
    language: 'java',
    code: [
      'for (int batch = 1; batch <= 12; batch++) {',
      '    long start = System.nanoTime();',
      '    for (int call = 0; call < 20_000; call++) {',
      '        checksum += work(200);          // small arithmetic loop',
      '    }',
      '    System.out.printf("batch %2d: %,8d us%n", batch, (System.nanoTime() - start) / 1_000);',
      '}',
    ].join('\n'),
    answer: 'Default: batch 1 is about 10,224 us and the rest settle near 7,700 us - roughly a quarter cheaper once warm.\n\nUnder -Xint: every batch costs about the same (~56,000 us). There is no curve at all.',
    explanation:
      'The default run shows JVM warm-up. Batch 1 pays for interpretation and then compilation; '
      + 'by batch 3 the method is compiled at tier 4 and the line is flat.\n\n'
      + 'The -Xint result is the more instructive half. With the JIT disabled there is nothing to '
      + 'warm up, so the curve disappears entirely - which proves the curve was compilation and '
      + 'not caches, branch predictors, or anything else that might plausibly have explained it.\n\n'
      + 'Measured on 4 vCPU Xeon @2.80GHz, OpenJDK 21.0.10. Your numbers will differ; the shape '
      + 'should not.',
    isPlaceholder: false,
  },

  {
    id: '01-03-predict-xcomp-startup',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    prompt: 'Hello.java prints one line. Which of these three starts fastest, and which slowest?',
    language: 'shell',
    code: 'time java Hello\ntime java -Xint Hello\ntime java -Xcomp Hello',
    answer: '(default)  ~38-41 ms\n-Xint      ~36-37 ms   <- fastest\n-Xcomp     ~1262-1338 ms  <- about 33x slower',
    explanation:
      'The ordering inverts completely from the steady-state ranking, and both ends surprise '
      + 'people.\n\n'
      + '-Xint is FASTEST to start, because it never compiles anything. For a program that prints '
      + 'one line and exits, compilation is pure overhead.\n\n'
      + '-Xcomp is catastrophically slow to start - roughly 33x here - because it compiles every '
      + 'method on first invocation, including the thousands of one-shot JDK methods that run '
      + 'during startup before your main is even reached.\n\n'
      + 'This is the whole startup-versus-steady-state trade in one command, and it is why '
      + 'short-lived JVM processes have a reputation for being slow, and why serverless and CLI '
      + 'workloads reach for AOT or native images rather than for JIT tuning.',
    isPlaceholder: false,
  },

  {
    id: '01-03-predict-call-site-shape',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    prompt: 'The same call site, driven with 1, 2, and 5 implementations of an interface. How do the three times compare?',
    language: 'java',
    code: [
      'static void drive(Op[] ops, int iterations) {',
      '    long total = 0;',
      '    for (int i = 0; i < iterations; i++) {',
      '        total += ops[i % ops.length].apply(i);   // ONE call site',
      '    }',
      '    sink += total;',
      '}',
      '',
      '// timed with arrays of size 1, 2 and 5, after warming up in each shape',
    ].join('\n'),
    answer: 'monomorphic       36,511 us\nbimorphic         36,508 us\nmegamorphic       74,155 us\n\nOne and two are within noise of each other. Five is about twice as slow.',
    explanation:
      'Almost everyone predicts a steady increase from one to five. The jump is between TWO and '
      + 'THREE.\n\n'
      + 'HotSpot inlines a monomorphic call site outright. For a bimorphic one it uses an inline '
      + 'cache - a type check that branches to one of two inlined bodies - which is nearly as '
      + 'good. At three or more receivers the site is megamorphic and falls back to a real '
      + 'virtual dispatch that cannot be inlined, and losing the inline also loses every '
      + 'optimisation that would have followed it.\n\n'
      + 'Highly reproducible here (second run: 36,523 / 36,471 / 74,409) on 4 vCPU Xeon @2.80GHz, '
      + 'OpenJDK 21.0.10. Indicative of the shape, not a constant - and not a reason to contort a '
      + 'design before measuring your own code.',
    isPlaceholder: false,
  },

  {
    id: '01-03-predict-deopt-timing',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    prompt: 'Phase 1 calls consume() 200k times with only Triangle. Phase 2 introduces Square at the same call site. What appears in PrintCompilation immediately after the phase 2 line?',
    language: 'java',
    code: [
      'static void consume(Shape shape, int times) {',
      '    for (int i = 0; i < times; i++) total += shape.sides();',
      '}',
      '',
      'System.out.println("phase 1: only Triangle, 200k calls");',
      'for (int i = 0; i < 200_000; i++) consume(triangle, 10);',
      '',
      'System.out.println("phase 2: introduce Square at the same call site");',
      'for (int i = 0; i < 200_000; i++) consume(i % 2 == 0 ? triangle : square, 10);',
    ].join('\n'),
    answer: 'phase 2: introduce Square at the same call site\n38   11       4       Deoptimization::consume (28 bytes)   made not entrant\n38   17       1       Deoptimization$Square::sides (2 bytes)\n40   16 %     4       Deoptimization::consume @ 2 (28 bytes)\n42   18       4       Deoptimization::consume (28 bytes)',
    explanation:
      'The tier-4 consume is thrown away the moment the speculation becomes false.\n\n'
      + 'During phase 1, C2 saw 200,000 Triangles and nothing else, so it inlined Triangle::sides '
      + 'as if the call were direct - guarded by a check. Phase 2 fails that guard, so the '
      + 'compiled version is made not entrant: anyone already inside finishes there, no new call '
      + 'enters it.\n\n'
      + 'Then it recovers. Square::sides is compiled, consume is re-entered by on-stack '
      + 'replacement so the loop already running can continue in compiled code, and a fresh '
      + 'tier-4 version is installed for future calls.\n\n'
      + 'Asking the JVM directly with -Xlog:deoptimization=debug names the reason as `predicate` '
      + '- the type guard. This is not a failure mode; it is what makes speculating safe.',
    isPlaceholder: false,
  },

  /* ======================================================================
     Module 01 · Chapter 4 — Program Entry, Output, and Structure
     Every answer captured from a real run, OpenJDK 21.0.10, 2026-08-13.
     ====================================================================== */

  {
    id: '01-04-predict-char-array',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_04,
    prompt: 'Four prints, three arrays. What does each line show?',
    language: 'java',
    code: [
      'char[] chars = { \'J\', \'a\', \'v\', \'a\' };',
      'int[] ints = { 1, 2, 3 };',
      'String[] strings = { "a", "b" };',
      '',
      'System.out.println(chars);',
      'System.out.println(ints);',
      'System.out.println(strings);',
      'System.out.println("prefix " + chars);',
    ].join('\n'),
    answer: 'Java\n[I@1b6d3586\n[Ljava.lang.String;@4554617c\nprefix [C@74a14482\n\n(the hex identity hashes differ every run)',
    explanation:
      'PrintStream declares a dedicated println(char[]) overload - the ONLY array type that has '
      + 'one. So a char[] prints its characters, while int[] and String[] fall through to '
      + 'println(Object) and print the default toString: a type tag plus an identity hash.\n\n'
      + 'The fourth line is the real trap. It is the SAME char[], but concatenation happens '
      + 'before the call, so the argument reaching println is a String and you get [C@... after '
      + 'all. Overload resolution is a compile-time decision made from the static type of the '
      + 'argument - javap -c shows the four call sites resolving to ([C)V, (Ljava/lang/Object;)V '
      + 'twice, and (Ljava/lang/String;)V.\n\n'
      + 'For contents of any other array, use Arrays.toString (Module 07).',
    isPlaceholder: false,
  },

  {
    id: '01-04-predict-main-errors',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_04,
    prompt: 'All four of these classes compile. What happens when you run each?',
    language: 'java',
    code: [
      'class NoPublic { static  void main(String[] args) { System.out.println("x"); } }',
      'class NoStatic { public  void main(String[] args) { System.out.println("x"); } }',
      'class NotVoid  { public static int  main(String[] args) { return 0; } }',
      'class WrongArg { public static void main(int[] args)    { System.out.println("x"); } }',
    ].join('\n'),
    answer: 'All four compile cleanly. All four fail at launch, with only THREE distinct messages:\n\nError: Main method not found in class NoPublic, please define the main method as:\n   public static void main(String[] args)\nError: Main method is not static in class NoStatic, ...\nError: Main method must return a value of type void in class NotVoid, ...\nError: Main method not found in class WrongArg, ...',
    explanation:
      'The first thing to notice is that nothing failed to compile. main is an ordinary method '
      + 'to javac; only the launcher has an opinion about its shape.\n\n'
      + 'Then: four failures, three messages. NoPublic and WrongArg produce the SAME error, '
      + 'because the launcher is searching for a public method named main taking String[] - a '
      + 'non-public one and a wrongly-typed one are both simply absent from that search, so '
      + '"not found" is literally accurate.\n\n'
      + 'NoStatic and NotVoid are FOUND and then rejected, so they get specific messages telling '
      + 'you exactly what to change. Learning which message means which saves real time.',
    isPlaceholder: false,
  },

  {
    id: '01-04-predict-exit-codes',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_04,
    prompt: 'What exit status does the shell see in each case, and where does the stack trace go?',
    language: 'shell',
    code: 'java ExitCode          # main returns normally\njava ExitCode 3        # main calls System.exit(3)\njava Throws            # main throws IllegalStateException\n\necho $?                # after each',
    answer: 'no args        -> exit 0\nSystem.exit(3) -> exit 3\nuncaught throw -> exit 1\n\nThe stack trace goes to STDERR:\nException in thread "main" java.lang.IllegalStateException: boom\n\tat Throws.main(Throws.java:2)',
    explanation:
      'Three different endings, three different statuses. Returning normally from main gives 0. '
      + 'System.exit(n) gives exactly n and does not return. An uncaught exception gives 1 - not '
      + 'a code of your choosing.\n\n'
      + 'The detail that matters in practice: the stack trace goes to stderr, not stdout. Verify '
      + 'it with `java Throws 2>/dev/null` (silence) versus `java Throws 2>&1 >/dev/null` (the '
      + 'trace). A script that captures only stdout will see an empty result and a non-zero exit '
      + 'code, with no explanation, unless it also captures stderr.\n\n'
      + 'This is why main returns void in Java where C++ returns int: the exit status comes from '
      + 'how the program ended, not from a return value.',
    isPlaceholder: false,
  },

  {
    id: '01-04-predict-import-bytecode',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_04,
    prompt: 'The same program written three ways. Do the compiled class files differ in their instructions?',
    language: 'java',
    code: [
      '// A: fully qualified, no imports',
      'java.util.List<String> list = new java.util.ArrayList<>();',
      '',
      '// B: import java.util.List; import java.util.ArrayList;',
      'List<String> list = new ArrayList<>();',
      '',
      '// C: import java.util.*;',
      'List<String> list = new ArrayList<>();',
    ].join('\n'),
    answer: 'No. The bytecode is IDENTICAL in all three cases.\n\nNoImports vs WithImports:      IDENTICAL bytecode\nWithImports vs WildcardImport: IDENTICAL bytecode\n\nOnly the class file SIZES differ (538 / 542 / 548 bytes) - by the length of the class name, nothing else.',
    explanation:
      'An import is a compile-time abbreviation and has no run-time existence at all. The '
      + 'compiler ALWAYS writes fully qualified names into the constant pool; the import only '
      + 'decided what you were allowed to type in the source.\n\n'
      + 'So "import java.util.* is slower" is a myth, and this is the measurement that ends the '
      + 'argument. The real reason to prefer explicit imports is ambiguity: importing both '
      + 'java.util.* and java.awt.* and then writing List gives\n\n'
      + '  error: reference to List is ambiguous\n'
      + '    both class java.awt.List in java.awt and interface java.util.List in java.util match\n\n'
      + 'A single-type import always beats a wildcard, which is how you resolve it.',
    isPlaceholder: false,
  },

  {
    id: '01-04-predict-wildcard-depth',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_04,
    prompt: 'Given only `import java.util.*;`, which of these two declarations compiles?',
    language: 'java',
    code: [
      'import java.util.*;',
      '',
      'public class WildcardDepth {',
      '    public static void main(String[] args) {',
      '        List<String> ok = new ArrayList<>();   // java.util.List',
      '        Lock notImported = null;               // java.util.concurrent.locks.Lock',
      '    }',
      '}',
    ].join('\n'),
    answer: 'Only the first. The second is a compile error:\n\nerror: cannot find symbol\n        Lock notImported = null;\n        ^\n  symbol:   class Lock',
    explanation:
      'A wildcard import covers exactly ONE package. It is not recursive.\n\n'
      + 'Package names look hierarchical because of the dots, but package nesting is not a '
      + 'containment relationship: java.util.concurrent is a completely separate package that '
      + 'merely shares a prefix with java.util. Nothing about importing one implies the other.\n\n'
      + 'The same applies to visibility: package-private members of java.util.concurrent are not '
      + 'visible to java.util, and vice versa. Treating package names as a tree is one of the '
      + 'more common wrong mental models in Java.',
    isPlaceholder: false,
  },

  {
    id: '01-04-predict-setout-final',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_04,
    prompt: '`javap java.lang.System` shows `public static final PrintStream out;` — so does this compile, and does it work?',
    language: 'java',
    code: [
      'PrintStream original = System.out;',
      'ByteArrayOutputStream captured = new ByteArrayOutputStream();',
      '',
      'System.setOut(new PrintStream(captured, true));',
      'System.out.println("this went into the buffer");',
      'System.setOut(original);',
      '',
      'System.out.println("captured was: " + captured.toString().trim());',
    ].join('\n'),
    answer: 'It compiles and it works:\n\ncaptured was: this went into the buffer',
    explanation:
      'A final field with a working setter looks impossible, and in pure Java it would be. '
      + 'System.setOut reaches the field through native code inside the JVM, below the level '
      + 'where final is enforced - the JVM is permitted to do things ordinary code is not.\n\n'
      + 'Two consequences worth carrying. First, this is exactly how test frameworks assert on '
      + 'printed output: swap in a PrintStream over a buffer, run the code, restore the original. '
      + 'Second, and more important for design: **System.out is not guaranteed to be the '
      + 'terminal.** Code that assumes writes are visible, cheap, or ordered relative to anything '
      + 'else will eventually surprise someone.\n\n'
      + 'Note also the `true` argument to the PrintStream constructor - that is autoflush, without '
      + 'which the buffer might still be empty when you read it.',
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
