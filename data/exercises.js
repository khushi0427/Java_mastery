/**
 * exercises.js — practice exercises, keyed to modules.
 *
 * ===========================================================================
 * AUTHORED PER CHAPTER, THROUGH `CONTINUE` — NEVER AHEAD OF IT
 * ===========================================================================
 * Exercises appear here only when the chapter they belong to is written
 * (master brief §36, §41). Adding them ahead of that would be fake content.
 *
 * Authored so far: Module 01 Chapters 1–3 — six exercises each, across the
 * difficulty ladder. Every reference solution below was ACTUALLY COMPILED AND
 * RUN on OpenJDK 21.0.10 with `--release 17` on 2026-08-13; the recorded
 * `sampleOutput` is real output, not expected output. Sources live in
 * `java/module-01/ch01/solutions/`.
 *
 * One entry remains flagged `isPlaceholder: true`. It is the Phase 4 shell
 * demo, kept because it is what the UI's placeholder labelling is verified
 * against, and it is excluded from every count by `realExerciseCount()`.
 * ===========================================================================
 *
 * DATA CONTRACT (documented in docs/ARCHITECTURE.md §6)
 *
 *   id            string   unique within its module
 *   moduleId      string   PERMANENT module id from data/modules.js
 *   chapterId     string   optional; PERMANENT chapter id from data/chapters.js
 *                          (e.g. '01-01'). Added when Module 01 Chapter 1 was
 *                          authored, so practice can be filtered per chapter.
 *   title         string
 *   difficulty    string   one of DIFFICULTIES below, in ladder order (§18)
 *   objective     string   what the learner should get out of it
 *   problem       string   the statement
 *   requirements  string[] what a correct solution must do
 *   constraints   string[] optional; limits on input/approach
 *   sampleInput   string   optional
 *   sampleOutput  string   optional
 *   edgeCases     string[] optional
 *   testCases     [{ input, expected }]  optional
 *   starterCode   string   optional; PHASE 5 — see below
 *   stdin         string   optional; PHASE 5 — see below
 *   hints         string[] ordered, revealed ONE AT A TIME (§20)
 *   solution      { language, code, explanation, complexity }  hidden by default
 *   isPlaceholder boolean  true only for demo scaffolding
 *
 * `solution` and every hint are hidden until the learner asks for them — the
 * master brief is explicit that solutions must not sit next to the problem.
 *
 * ---------------------------------------------------------------------------
 * PHASE 5 EXTENSION — starterCode and stdin
 * ---------------------------------------------------------------------------
 * Phase 5 added the two optional fields above. Both are additive: every
 * exercise written against the Phase 4 contract stays valid, and an exercise
 * with no `starterCode` simply renders no editor.
 *
 *   starterCode  The skeleton the learner edits — imports, a class, a `main`,
 *                and a marked gap. It is what the editor opens with and what
 *                its Reset restores. Reset must NEVER restore the reference
 *                solution: that would turn one keystroke into the answer and
 *                undo the hint ladder.
 *
 *                Name the public class something meaningful. The runner reads
 *                the source to work out the file name and the `java` target
 *                (assets/js/execution/java-source.js), so `public class
 *                WordCount` yields `javac WordCount.java` — commands that
 *                actually work when pasted.
 *
 *   stdin        Standard input to prefill, for exercises that read input.
 *                Its presence is also what makes the runner show the stdin
 *                field at all.
 *
 * Neither field enables or requires online execution. With no provider
 * configured — the default — the editor still opens, still holds edits, and
 * still shows the exact local `javac` / `java` commands.
 */

/** The difficulty ladder from master brief §18, in order. */
export const DIFFICULTIES = ['Warm-up', 'Easy', 'Applied', 'Medium', 'Challenge', 'Interview'];

// Permanent keys, written once so a typo cannot silently orphan an exercise
// from its module or chapter.
const MODULE_01 = '01-java-foundations-execution-model';
const CHAPTER_01_01 = '01-01';
const CHAPTER_01_02 = '01-02';
const CHAPTER_01_03 = '01-03';

/** @type {Array<object>} */
export const EXERCISES = [
  {
    id: 'demo-placeholder-exercise',
    moduleId: '01-java-foundations-execution-model',
    title: 'Demo: shell rendering check',
    difficulty: 'Warm-up',
    objective:
      'Demonstrate that the exercise shell renders every field and that hints '
      + 'and the solution stay hidden until asked for. This is scaffolding, not curriculum.',
    problem:
      'This is placeholder text standing in for a problem statement. Real exercises '
      + 'are written per module through the CONTINUE workflow; none exist yet.',
    requirements: [
      'Placeholder requirement — replaced when real exercises are authored.',
      'The shell should render this list without any exercise content existing.',
    ],
    constraints: ['Placeholder constraint.'],
    sampleInput: '(placeholder)',
    sampleOutput: '(placeholder)',
    edgeCases: ['Placeholder edge case.'],
    testCases: [],
    // Placeholder starter code. Real, compilable Java rather than prose, so the
    // Phase 5 editor and the derived local commands can be exercised — the
    // public class is deliberately NOT called Main, which is what proves the
    // file name is derived from the source instead of assumed.
    starterCode:
      'public class ShellCheck {\n'
      + '    public static void main(String[] args) {\n'
      + '        // Placeholder starter code — this is scaffolding, not an exercise.\n'
      + '        System.out.println("The editor works. Run this locally with the commands below.");\n'
      + '    }\n'
      + '}\n',
    hints: [
      'Hint 1 — a small nudge. Placeholder text.',
      'Hint 2 — the approach. Placeholder text.',
      'Hint 3 — strong guidance. Placeholder text.',
    ],
    solution: {
      language: 'java',
      // Compilable placeholder: the reference solution is rendered in a runner
      // too, so it has to be something that would actually run.
      code:
        '// Placeholder. No reference solution exists, because no exercise exists.\n'
        + 'public class ShellCheck {\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("The editor works. Run this locally with the commands below.");\n'
        + '    }\n'
        + '}\n',
      explanation: 'Placeholder explanation, shown only after the learner reveals it.',
      complexity: 'Not applicable to a placeholder.',
    },
    isPlaceholder: true,
  },

  /* ======================================================================
     Module 01 · Chapter 1 — From Source to Running Program
     Solutions verified by execution on OpenJDK 21.0.10, --release 17,
     2026-08-13. Sources: java/module-01/ch01/solutions/
     ====================================================================== */

  {
    id: '01-01-warmup-first-program',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    title: 'Compile and run your first program',
    difficulty: 'Warm-up',
    objective:
      'Complete the compile-then-run cycle by hand once, so the two steps stay '
      + 'distinct in your head for the rest of the curriculum.',
    problem:
      'Write a complete Java program in a file named Warmup.java that prints exactly '
      + 'three lines naming the artefact at each stage of the pipeline: the source '
      + 'file, the bytecode file, and what actually executes it. Compile it with javac '
      + 'and run it with java.',
    requirements: [
      'The file must be named Warmup.java and declare `public class Warmup`.',
      'Print exactly the three lines shown in the sample output, in that order.',
      'Compile with `javac Warmup.java`, then run with `java Warmup`.',
    ],
    constraints: ['No libraries beyond `java.lang`, which is imported implicitly.'],
    sampleInput: '',
    sampleOutput: 'Source: Warmup.java\nBytecode: Warmup.class\nRuntime: the JVM',
    edgeCases: [
      'Running `java Warmup.class` instead of `java Warmup` — try it and read the error.',
    ],
    testCases: [{ input: '', expected: 'Source: Warmup.java\nBytecode: Warmup.class\nRuntime: the JVM' }],
    starterCode:
      'public class Warmup {\n'
      + '    public static void main(String[] args) {\n'
      + '        // Print the three pipeline stages, one per line.\n'
      + '    }\n'
      + '}\n',
    hints: [
      'Every line comes from a separate `System.out.println` call.',
      'The class name and the file name must match, because the class is public.',
      'The three values are the .java file, the .class file, and the JVM — in that order.',
    ],
    solution: {
      language: 'java',
      code:
        'public class Warmup {\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("Source: Warmup.java");\n'
        + '        System.out.println("Bytecode: Warmup.class");\n'
        + '        System.out.println("Runtime: the JVM");\n'
        + '    }\n'
        + '}\n',
      explanation:
        'Nothing subtle here — the exercise exists so you perform `javac` and `java` as two '
        + 'separate acts. `javac` produced Warmup.class and exited; `java` then started a JVM '
        + 'and asked it to load a class called Warmup. Neither command knew about the other.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-01-easy-command-line-arguments',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    title: 'Report the arguments you were launched with',
    difficulty: 'Easy',
    objective:
      'See that everything after the class name on the `java` command line arrives '
      + 'as `String[] args`, and that zero arguments is a normal case rather than an error.',
    problem:
      'Write ArgReport.java. It should report how many command-line arguments it received, '
      + 'then print each one on its own line prefixed with its index in square brackets. '
      + 'Run it with no arguments and then with three.',
    requirements: [
      'Print `Received N argument(s).` where N is the count.',
      'Then print each argument as `  [i] value`, indented by two spaces.',
      'With no arguments, print only the count line — do not crash and do not print an empty list header.',
    ],
    constraints: ['Use a plain indexed loop; `args` is an ordinary array.'],
    sampleInput: 'java ArgReport alpha beta gamma',
    sampleOutput: 'Received 3 argument(s).\n  [0] alpha\n  [1] beta\n  [2] gamma',
    edgeCases: [
      'No arguments at all — `args.length` is 0, and `args` itself is never null.',
      'An argument containing a space must be quoted in the shell, or it arrives as two arguments.',
    ],
    testCases: [
      { input: 'java ArgReport', expected: 'Received 0 argument(s).' },
      { input: 'java ArgReport alpha beta gamma', expected: 'Received 3 argument(s).\n  [0] alpha\n  [1] beta\n  [2] gamma' },
    ],
    starterCode:
      'public class ArgReport {\n'
      + '    public static void main(String[] args) {\n'
      + '        // Report the count, then each argument with its index.\n'
      + '    }\n'
      + '}\n',
    hints: [
      'The count is `args.length`. Unlike C, the program name is NOT element 0.',
      'A standard `for (int i = 0; i < args.length; i++)` gives you both index and value.',
      'When the length is 0 the loop body simply never runs — you do not need a special case.',
    ],
    solution: {
      language: 'java',
      code:
        'public class ArgReport {\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("Received " + args.length + " argument(s).");\n'
        + '        for (int i = 0; i < args.length; i++) {\n'
        + '            System.out.println("  [" + i + "] " + args[i]);\n'
        + '        }\n'
        + '    }\n'
        + '}\n',
      explanation:
        'The single thing worth carrying away, if you come from C or C++: `args[0]` is the first '
        + 'ARGUMENT, not the program name. Java passes the class name to the launcher, not to your '
        + 'program, so there is no `argv[0]` to skip. `args` is also never null — a program launched '
        + 'with no arguments receives an empty array, so `args.length` is always safe to read.',
      complexity: 'O(n) in the number of arguments.',
    },
  },

  {
    id: '01-01-applied-classpath',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    title: 'Split two classes across directories and make the classpath work',
    difficulty: 'Applied',
    objective:
      'Control `-d` and `-cp` deliberately, and produce NoClassDefFoundError on purpose so '
      + 'you recognise it later.',
    problem:
      'Write two classes: `Greeter`, with a static method `greet(String)` returning '
      + '"Hello, <name>!", and `UseGreeter`, whose `main` prints `Greeter.greet(...)` using '
      + 'the first command-line argument, or "world" if there is none. Compile Greeter into '
      + 'a directory `lib/` and UseGreeter into a separate directory `app/`. Then run the '
      + 'program TWICE: once with only `app/` on the classpath, and once with both.',
    requirements: [
      'Use `javac -d <dir>` to choose each output directory.',
      'UseGreeter must compile against Greeter using `-cp lib`.',
      'Record the exact error from the run with the incomplete classpath.',
      'The successful run must print `Hello, world!` and, with an argument, `Hello, Ada!`.',
    ],
    constraints: [
      'Do not put both classes in the same directory — the point is that they are apart.',
      'Classpath entries are separated by `:` on Linux/macOS and `;` on Windows.',
    ],
    sampleInput: 'java -cp app:lib UseGreeter Ada',
    sampleOutput: 'Hello, Ada!',
    edgeCases: [
      'Running with only `app` on the classpath — compiles fine, fails at run time.',
      'Forgetting `-cp lib` at COMPILE time gives a different error: `cannot find symbol`.',
    ],
    testCases: [
      { input: 'java -cp app:lib UseGreeter', expected: 'Hello, world!' },
      { input: 'java -cp app:lib UseGreeter Ada', expected: 'Hello, Ada!' },
    ],
    starterCode:
      '// Two files. Compile them into DIFFERENT directories.\n'
      + '//   javac --release 17 -d lib Greeter.java\n'
      + '//   javac --release 17 -cp lib -d app UseGreeter.java\n'
      + '//   java -cp app UseGreeter        <- read this failure\n'
      + '//   java -cp app:lib UseGreeter    <- then this success\n'
      + '\n'
      + 'public class UseGreeter {\n'
      + '    public static void main(String[] args) {\n'
      + '        // Use args[0] when present, otherwise "world".\n'
      + '    }\n'
      + '}\n',
    hints: [
      'The compile classpath and the run classpath are separate. Getting one right says nothing about the other.',
      '`String who = args.length > 0 ? args[0] : "world";` handles the default in one line.',
      'The failing run produces NoClassDefFoundError with a ClassNotFoundException as its `Caused by:` — the class existed when you compiled, so the JVM expected it.',
    ],
    solution: {
      language: 'java',
      code:
        '// ---------- Greeter.java (compile into lib/) ----------\n'
        + 'public class Greeter {\n'
        + '    public static String greet(String who) {\n'
        + '        return "Hello, " + who + "!";\n'
        + '    }\n'
        + '}\n'
        + '\n'
        + '// ---------- UseGreeter.java (compile into app/) ----------\n'
        + 'public class UseGreeter {\n'
        + '    public static void main(String[] args) {\n'
        + '        String who = args.length > 0 ? args[0] : "world";\n'
        + '        System.out.println(Greeter.greet(who));\n'
        + '    }\n'
        + '}\n',
      explanation:
        'The run with the incomplete classpath produces exactly this, which was captured from a '
        + 'real run:\n\n'
        + 'Exception in thread "main" java.lang.NoClassDefFoundError: Greeter\n'
        + '\tat UseGreeter.main(UseGreeter.java:8)\n'
        + 'Caused by: java.lang.ClassNotFoundException: Greeter\n\n'
        + 'Read the pair. The class loader looked for Greeter and did not find it — that is the '
        + 'ClassNotFoundException. Because UseGreeter had been COMPILED against Greeter, the JVM '
        + 'was entitled to expect it, and an unmet compiled-in dependency is an Error, not an '
        + 'exception. That is the distinction interviewers are testing when they ask about these two.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-01-medium-runnable-jar',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    title: 'Package it as a JAR that `java -jar` will actually run',
    difficulty: 'Medium',
    objective:
      'Learn what a JAR is, why `no main manifest attribute` happens, and the two different '
      + 'ways to run code that lives in one.',
    problem:
      'Using the classes from the previous exercise, build a JAR containing both. First build '
      + 'it WITHOUT an entry point and try `java -jar`. Then run the same JAR successfully '
      + 'without rebuilding it. Finally rebuild it WITH an entry point so `java -jar` works, '
      + 'and inspect the manifest to see what changed.',
    requirements: [
      'Build with `jar --create --file app.jar -C app . -C lib .`',
      'Attempt `java -jar app.jar` and record the exact message.',
      'Run the same unmodified JAR successfully using the classpath form.',
      'Rebuild with `--main-class` and confirm `java -jar` now works, with and without an argument.',
      'Print the generated manifest and identify the one line that made the difference.',
    ],
    constraints: ['Do not unpack and re-zip the JAR by hand — use the `jar` tool.'],
    sampleInput: 'java -jar runnable.jar Grace',
    sampleOutput: 'Hello, Grace!',
    edgeCases: [
      'Passing `-cp` alongside `-jar` — the flag is accepted and then ignored.',
      'A JAR with several classes containing `main` — the launcher cannot guess, which is why the manifest exists.',
    ],
    testCases: [
      { input: 'java -jar app.jar', expected: 'no main manifest attribute, in app.jar' },
      { input: 'java -cp app.jar UseGreeter', expected: 'Hello, world!' },
      { input: 'java -jar runnable.jar Grace', expected: 'Hello, Grace!' },
    ],
    hints: [
      'A JAR is a ZIP with a META-INF/MANIFEST.MF inside. `jar --list --file app.jar` shows you.',
      'A JAR is just a classpath entry, so `java -cp app.jar <ClassName>` works on any JAR.',
      '`jar --create --file runnable.jar --main-class UseGreeter …` writes the Main-Class line for you.',
    ],
    solution: {
      language: 'java',
      code:
        '// This exercise is about commands rather than source. The verified sequence:\n'
        + '//\n'
        + '//   jar --create --file app.jar -C app . -C lib .\n'
        + '//   java -jar app.jar\n'
        + '//       -> no main manifest attribute, in app.jar\n'
        + '//\n'
        + '//   java -cp app.jar UseGreeter\n'
        + '//       -> Hello, world!\n'
        + '//\n'
        + '//   jar --create --file runnable.jar --main-class UseGreeter -C app . -C lib .\n'
        + '//   java -jar runnable.jar\n'
        + '//       -> Hello, world!\n'
        + '//   java -jar runnable.jar Grace\n'
        + '//       -> Hello, Grace!\n'
        + '//\n'
        + '//   jar --extract --file runnable.jar META-INF/MANIFEST.MF\n'
        + '//   cat META-INF/MANIFEST.MF\n'
        + '//       Manifest-Version: 1.0\n'
        + '//       Created-By: 21.0.10 (Ubuntu)\n'
        + '//       Main-Class: UseGreeter\n'
        + 'public class JarNotes {\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("See the commands above — this exercise is run from the shell.");\n'
        + '    }\n'
        + '}\n',
      explanation:
        'The two JARs contain identical classes. The only difference is one line of text in the '
        + 'manifest: `Main-Class: UseGreeter`. `java -jar` reads it to decide where to start and '
        + 'refuses to guess without it; `java -cp` never needed it because you named the class '
        + 'yourself. Worth remembering for later: when you use `-jar`, the classpath comes from '
        + 'the manifest and any `-cp` on the command line is ignored entirely — which makes '
        + '"I added the dependency to the classpath and it still fails" a very common confusion. '
        + 'Real projects let Maven (Module 29) generate all of this.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-01-challenge-read-class-version',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    title: 'Read a class file’s magic number and version yourself',
    difficulty: 'Challenge',
    objective:
      'Turn `UnsupportedClassVersionError` from a mysterious failure into a number you can '
      + 'read off the file, using nothing but the standard library.',
    problem:
      'Write ClassFileVersion.java. It takes one command-line argument — a path to a .class '
      + 'file — and prints the file’s magic number, minor version, and major version, together '
      + 'with the Java release the major version corresponds to. If the magic number is not '
      + '0xCAFEBABE, say so and stop rather than printing nonsense.',
    requirements: [
      'Read the first four bytes as a big-endian int and compare against 0xCAFEBABE.',
      'Then read two unsigned 16-bit values: minor version, then major version.',
      'Report the Java release as `major - 44`.',
      'Print a usage message to stderr and exit non-zero if the argument is missing.',
      'Close the stream deterministically.',
    ],
    constraints: [
      'Standard library only.',
      'Do not read the whole file into memory — you need eight bytes.',
    ],
    sampleInput: 'java ClassFileVersion ClassFileVersion.class',
    sampleOutput: 'magic:  0xCAFEBABE\nminor:  0\nmajor:  61 (Java 17)',
    edgeCases: [
      'A .java file passed by mistake — the magic check catches it.',
      'A file shorter than eight bytes — DataInputStream throws EOFException.',
      'The same source compiled by a different JDK reports a different major version.',
    ],
    testCases: [
      { input: 'a class compiled with --release 17', expected: 'major:  61 (Java 17)' },
      { input: 'a class compiled with plain javac on JDK 21', expected: 'major:  65 (Java 21)' },
    ],
    starterCode:
      'import java.io.DataInputStream;\n'
      + 'import java.io.IOException;\n'
      + 'import java.io.InputStream;\n'
      + 'import java.nio.file.Files;\n'
      + 'import java.nio.file.Path;\n'
      + '\n'
      + 'public class ClassFileVersion {\n'
      + '    public static void main(String[] args) throws IOException {\n'
      + '        // 1. Validate the argument.\n'
      + '        // 2. Open the file and read an int — check it against 0xCAFEBABE.\n'
      + '        // 3. Read minor and major as unsigned shorts.\n'
      + '        // 4. Report the release as major - 44.\n'
      + '    }\n'
      + '}\n',
    hints: [
      '`DataInputStream` gives you `readInt()` and `readUnsignedShort()`, both big-endian — which is what the class file format uses.',
      'Wrap the stream in try-with-resources so it closes even when a read throws.',
      '`System.out.printf("0x%08X%n", magic)` formats the magic number the way tools display it. `%n` rather than \\n gives you the platform line separator.',
    ],
    solution: {
      language: 'java',
      code:
        'import java.io.DataInputStream;\n'
        + 'import java.io.IOException;\n'
        + 'import java.io.InputStream;\n'
        + 'import java.nio.file.Files;\n'
        + 'import java.nio.file.Path;\n'
        + '\n'
        + 'public class ClassFileVersion {\n'
        + '\n'
        + '    public static void main(String[] args) throws IOException {\n'
        + '        if (args.length != 1) {\n'
        + '            System.err.println("Usage: java ClassFileVersion <path-to-.class>");\n'
        + '            System.exit(1);\n'
        + '        }\n'
        + '\n'
        + '        Path path = Path.of(args[0]);\n'
        + '        try (InputStream raw = Files.newInputStream(path);\n'
        + '             DataInputStream in = new DataInputStream(raw)) {\n'
        + '\n'
        + '            int magic = in.readInt();\n'
        + '            if (magic != 0xCAFEBABE) {\n'
        + '                System.out.printf("Not a class file: magic was 0x%08X%n", magic);\n'
        + '                return;\n'
        + '            }\n'
        + '\n'
        + '            int minor = in.readUnsignedShort();\n'
        + '            int major = in.readUnsignedShort();\n'
        + '\n'
        + '            System.out.printf("magic:  0x%08X%n", magic);\n'
        + '            System.out.printf("minor:  %d%n", minor);\n'
        + '            System.out.printf("major:  %d (Java %d)%n", major, major - 44);\n'
        + '        }\n'
        + '    }\n'
        + '}\n',
      explanation:
        'Verified output on its own class file compiled with `--release 17`:\n\n'
        + 'magic:  0xCAFEBABE\nminor:  0\nmajor:  61 (Java 17)\n\n'
        + 'and on a class compiled by plain `javac` on this JDK 21:\n\n'
        + 'magic:  0xCAFEBABE\nminor:  0\nmajor:  65 (Java 21)\n\n'
        + 'Pointed at its own SOURCE file it prints `Not a class file: magic was 0x696D706F` — '
        + 'those four bytes are the ASCII for "impo", the beginning of `import`, which is a neat '
        + 'demonstration that a magic number is just the first few bytes read as a number.\n\n'
        + '`DataInputStream` is the right tool because the class file format is big-endian and so '
        + 'are its `readInt` and `readUnsignedShort`. Try-with-resources closes both streams in '
        + 'reverse order even if a read throws. Exception handling proper is Module 05; '
        + 'try-with-resources and the I/O types are Module 13.',
      complexity: 'O(1) — eight bytes are read regardless of file size.',
    },
  },

  {
    id: '01-01-interview-explain-pipeline',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_01,
    title: 'Explain the pipeline to an interviewer, then prove it',
    difficulty: 'Interview',
    objective:
      'Produce the spoken answer AND a demonstration, which is what distinguishes a candidate '
      + 'who has read about this from one who has done it.',
    problem:
      'Without notes, answer out loud: "Walk me through what happens between saving a .java '
      + 'file and seeing output in the terminal, and tell me where Java differs from C++." '
      + 'Then back it up at a terminal: show the artefact each stage produces, prove the .class '
      + 'file is not native code, and demonstrate one failure whose cause is the compile-time / '
      + 'run-time split.',
    requirements: [
      'Name the artefact produced by each stage and which tool produced it.',
      'State clearly what "platform independent" applies to — and what it does not.',
      'Demonstrate the class file header rather than asserting it.',
      'Produce one failure that only occurs because compilation and execution are separate, and explain the error.',
      'Say where the JIT fits, without overclaiming — it is covered properly in Chapter 3.',
    ],
    constraints: ['Everything must be demonstrated with tools in the JDK. No third-party utilities.'],
    sampleInput: '',
    sampleOutput: 'A spoken answer plus a terminal session. There is no single correct transcript.',
    edgeCases: [
      'Being asked "so is Java compiled or interpreted?" — the honest answer is both, at different stages.',
      'Being asked whether the JVM is the same thing as the JRE.',
    ],
    testCases: [],
    hints: [
      'Structure the spoken answer as: javac → .class (bytecode) → java starts a JVM → class loading → interpret, then JIT-compile hot paths.',
      'For the proof, `od -A d -t x1 -N 8 X.class` and `javap -c X.class` are the two commands that show bytecode is real.',
      'The easiest compile/run-split failure to stage is a missing classpath entry: compiles cleanly, then NoClassDefFoundError.',
    ],
    solution: {
      language: 'java',
      code:
        '// Model demonstration sequence — all verified in this chapter.\n'
        + '//\n'
        + '//  1. javac --release 17 HelloJava.java      -> produces HelloJava.class\n'
        + '//  2. od -A d -t x1 -N 8 HelloJava.class     -> ca fe ba be 00 00 00 3d\n'
        + '//  3. javap -verbose HelloJava.class         -> major version: 61   (Java 17)\n'
        + '//  4. javap -c HelloJava.class               -> real bytecode, plus a default\n'
        + '//                                               constructor you never wrote\n'
        + '//  5. java -cp app UseGreeter                -> NoClassDefFoundError: Greeter\n'
        + '//     java -cp app:lib UseGreeter            -> Hello, world!\n'
        + 'public class InterviewNotes {\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("Say it out loud, then run the five commands above.");\n'
        + '    }\n'
        + '}\n',
      explanation:
        'A model answer: "`javac` compiles source to bytecode — a real compilation with full type '
        + 'checking — and emits a .class file. That file is not machine code; its first four bytes '
        + 'are 0xCAFEBABE and its header records a version number. The `java` launcher then starts '
        + 'a JVM, which loads and verifies the class, and begins interpreting the bytecode, with '
        + 'the JIT compiling frequently executed paths to native code as the program runs. So Java '
        + 'is compiled twice: statically to bytecode, dynamically to machine code.\n\n'
        + 'The C++ difference is where the target is chosen. `g++` picks a CPU and ABI at build '
        + 'time, so the binary is tied to a platform. `javac` targets an abstract machine, so the '
        + 'artefact is portable and the per-platform part is the JVM — which somebody else already '
        + 'ported. What that does NOT give you is a portable application: file separators, '
        + 'encodings, and line endings are still yours to get right.\n\n'
        + 'A candidate who then shows the CAFEBABE header, the bytecode listing, and a staged '
        + 'NoClassDefFoundError has demonstrated the whole model in about ninety seconds.',
      complexity: 'Not applicable.',
    },
  },

  /* ======================================================================
     Module 01 · Chapter 2 — JVM Architecture & Class Loading
     Solutions verified by execution on OpenJDK 21.0.10, --release 17,
     2026-08-13. Sources: java/module-01/ch02/solutions/
     ====================================================================== */

  {
    id: '01-02-warmup-lazy-loading',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    title: 'Prove that an unused class is never loaded',
    difficulty: 'Warm-up',
    objective:
      'See lazy loading for yourself, so "the JVM loads classes on demand" stops being '
      + 'a slogan and becomes something you have observed.',
    problem:
      'Write LazyProof.java containing a public class with main, plus two package-private '
      + 'classes: Used, whose static block prints a marker, and Unused, whose static block '
      + 'prints a different marker. Touch Used and never touch Unused. Run it, then confirm '
      + 'with the JVM that Unused was never loaded at all.',
    requirements: [
      'Both Used and Unused must have static initializers that print something distinctive.',
      'main must read a static field of Used, and must not mention Unused.',
      'Confirm with `java -verbose:class LazyProof | grep Unused` that nothing is reported.',
    ],
    constraints: ['One file. Only the public class may be public.'],
    sampleInput: '',
    sampleOutput: 'before touching anything\n  >> Used initialized\nUsed.NAME = used\ndone - Unused was never loaded',
    edgeCases: [
      'Merely declaring a variable of type Unused does not load it either — try adding one.',
      'Unused.class exists on disk. Compilation and loading are unrelated.',
    ],
    testCases: [{ input: 'java -verbose:class LazyProof | grep Unused', expected: '(no output)' }],
    starterCode:
      'public class LazyProof {\n'
      + '    public static void main(String[] args) {\n'
      + '        // Touch Used. Never mention Unused.\n'
      + '    }\n'
      + '}\n'
      + '\n'
      + 'class Used {\n'
      + '    // a static field and a static initializer that prints\n'
      + '}\n'
      + '\n'
      + 'class Unused {\n'
      + '    // a static initializer that prints - it must never run\n'
      + '}\n',
    hints: [
      'Reading a non-constant static field counts as active use. Reading a `static final int` would NOT.',
      'Make the field `static final String NAME = makeName();` — computed, so it is not a compile-time constant.',
      '`java -verbose:class` prints one line per class loaded. Pipe it through grep.',
    ],
    solution: {
      language: 'java',
      code:
        'public class LazyProof {\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("before touching anything");\n'
        + '        System.out.println("Used.NAME = " + Used.NAME);\n'
        + '        System.out.println("done - Unused was never loaded");\n'
        + '    }\n'
        + '}\n'
        + '\n'
        + 'class Used {\n'
        + '    static final String NAME = makeName();\n'
        + '    static { System.out.println("  >> Used initialized"); }\n'
        + '    static String makeName() { return "used"; }\n'
        + '}\n'
        + '\n'
        + 'class Unused {\n'
        + '    static { System.out.println("  >> Unused initialized"); }\n'
        + '}\n',
      explanation:
        'Verified output:\n\n'
        + 'before touching anything\n  >> Used initialized\nUsed.NAME = used\n'
        + 'done - Unused was never loaded\n\n'
        + 'Note that NAME is deliberately computed by a method call. Had it been '
        + '`static final String NAME = "used";` it would be a compile-time constant, inlined '
        + 'into main, and Used would never have been initialized either — the exercise would '
        + 'have quietly proved the opposite of what it intended.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-02-easy-init-order',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    title: 'Observe a field between preparation and initialization',
    difficulty: 'Easy',
    objective:
      'Catch a static field holding its prepared default, and see that static blocks and '
      + 'field initializers are one merged sequence.',
    problem:
      'Write a class whose static members, in source order, are: a field initialized by a '
      + 'method call that prints; a static block that prints what it can see and then assigns '
      + 'to a field declared BELOW it; that second field; a third field computed from the '
      + 'first two; and a final static block that prints the result. Predict the output before '
      + 'running it.',
    requirements: [
      'The first static block must read the not-yet-declared field and print its value.',
      'Predict the full output on paper first, then run it.',
      'Explain why the value you saw is what it is.',
    ],
    constraints: [
      'A simple-name read of a field declared below is an illegal forward reference and will '
      + 'not compile — you will need a qualified name.',
    ],
    sampleInput: '',
    sampleOutput: '  initializing first to 1\n  static block A sees first=1 second=0\n  static block B sees result=21\nresult = 21',
    edgeCases: [
      'Try the simple-name read and read the compiler error.',
      'Move the second field above the block and watch the output change.',
    ],
    testCases: [{ input: 'java InitOrder', expected: 'result = 21' }],
    starterCode:
      'public class InitOrder {\n'
      + '    public static void main(String[] args) {\n'
      + '        System.out.println("result = " + Ordered.result);\n'
      + '    }\n'
      + '}\n'
      + '\n'
      + 'class Ordered {\n'
      + '    // 1. a field initialized by a printing method\n'
      + '    // 2. a static block that reads the field declared below, then writes to it\n'
      + '    // 3. that field\n'
      + '    // 4. result, computed from the two\n'
      + '    // 5. a static block printing result\n'
      + '}\n',
    hints: [
      'Preparation sets every static field to its default before ANY initializer runs. For an int that is 0.',
      'The compiler merges all static field initializers and all static blocks into one <clinit> method, in source order.',
      'Reading `second` by simple name from above its declaration will not compile. Write `Ordered.second`.',
    ],
    solution: {
      language: 'java',
      code:
        'class Ordered {\n'
        + '    static int first = report("first", 1);\n'
        + '\n'
        + '    static {\n'
        + '        // A simple-name read here is an "illegal forward reference".\n'
        + '        // A qualified read is allowed and sees the prepared default.\n'
        + '        System.out.println("  static block A sees first=" + first\n'
        + '            + " second=" + Ordered.second);\n'
        + '        second = 20;   // writing to it is fine\n'
        + '    }\n'
        + '\n'
        + '    static int second;\n'
        + '    static int result = first + second;\n'
        + '\n'
        + '    static {\n'
        + '        System.out.println("  static block B sees result=" + result);\n'
        + '    }\n'
        + '\n'
        + '    static int report(String label, int value) {\n'
        + '        System.out.println("  initializing " + label + " to " + value);\n'
        + '        return value;\n'
        + '    }\n'
        + '}\n',
      explanation:
        'Verified output:\n\n'
        + '  initializing first to 1\n  static block A sees first=1 second=0\n'
        + '  static block B sees result=21\nresult = 21\n\n'
        + '`second=0` is the whole point: preparation had already allocated the field and set it '
        + 'to the int default, but its declaration line had not been reached, so no initializer '
        + 'had run for it. The block then writes 20, the `result` initializer runs next and '
        + 'computes 1 + 20 = 21, and block B sees it.\n\n'
        + 'Using the simple name instead produces `error: illegal forward reference` — the '
        + 'compiler blocks the accidental case while leaving the deliberate qualified read '
        + 'available. Both behaviours were verified.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-02-applied-loader-report',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    title: 'Report which loader loaded what, and walk the chain',
    difficulty: 'Applied',
    objective:
      'Identify the three built-in loaders in a running JVM, and produce output that is '
      + 'stable enough to compare between runs.',
    problem:
      'Write LoaderReport.java. For a list of class names covering a java.base class, a JDK '
      + 'module class outside java.base, and your own class, report which loader defined each. '
      + 'Then walk the delegation chain upwards from your own loader to the bootstrap loader, '
      + 'indenting each level. Load the classes WITHOUT initializing them.',
    requirements: [
      'Include at least one bootstrap class, one platform class, and your own class.',
      'Print `bootstrap (null)` rather than the literal `null`.',
      'Walk the chain with getParent() until it returns null.',
      'Output must be reproducible run to run — strip the identity hash from loader names.',
      'Use a form of Class.forName that does not initialize.',
    ],
    constraints: ['Standard library only.'],
    sampleInput: '',
    sampleOutput: 'java.lang.Object       bootstrap (null)\njava.util.HashMap      bootstrap (null)\njavax.sql.DataSource   ClassLoaders$PlatformClassLoader\nLoaderReport           ClassLoaders$AppClassLoader',
    edgeCases: [
      'getClassLoader() returns null for bootstrap classes — that is not an error.',
      'A loader toString() contains an identity hash that changes every run.',
    ],
    testCases: [{ input: 'java LoaderReport', expected: 'ends with a chain from AppClassLoader to bootstrap (null)' }],
    starterCode:
      'public class LoaderReport {\n'
      + '    public static void main(String[] args) throws Exception {\n'
      + '        // 1. report the defining loader of several classes\n'
      + '        // 2. walk the delegation chain upwards, indenting\n'
      + '    }\n'
      + '}\n',
    hints: [
      '`Class.forName(name, false, loader)` loads without initializing. The boolean IS the initialize flag.',
      '`type.getClassLoader()` returns null for anything the bootstrap loader defined.',
      'Take `loader.getClass().getName()` and cut everything before the last dot — that drops the identity hash entirely.',
    ],
    solution: {
      language: 'java',
      code:
        'public class LoaderReport {\n'
        + '\n'
        + '    public static void main(String[] args) throws Exception {\n'
        + '        String[] names = {\n'
        + '            "java.lang.Object",\n'
        + '            "java.util.HashMap",\n'
        + '            "javax.sql.DataSource",\n'
        + '            "LoaderReport",\n'
        + '        };\n'
        + '\n'
        + '        for (String name : names) {\n'
        + '            Class<?> type = Class.forName(name, false, LoaderReport.class.getClassLoader());\n'
        + '            ClassLoader loader = type.getClassLoader();\n'
        + '            System.out.printf("%-22s %s%n", name,\n'
        + '                loader == null ? "bootstrap (null)" : simpleName(loader));\n'
        + '        }\n'
        + '\n'
        + '        System.out.println();\n'
        + '        System.out.println("delegation chain upwards from this class:");\n'
        + '        int depth = 0;\n'
        + '        for (ClassLoader l = LoaderReport.class.getClassLoader(); l != null; l = l.getParent()) {\n'
        + '            System.out.println("  ".repeat(++depth) + simpleName(l));\n'
        + '        }\n'
        + '        System.out.println("  ".repeat(++depth) + "bootstrap (null)");\n'
        + '    }\n'
        + '\n'
        + '    /** The identity hash in a loader toString changes every run, so drop it. */\n'
        + '    static String simpleName(ClassLoader loader) {\n'
        + '        String name = loader.getClass().getName();\n'
        + '        return name.substring(name.lastIndexOf(\'.\') + 1);\n'
        + '    }\n'
        + '}\n',
      explanation:
        'Verified output:\n\n'
        + 'java.lang.Object       bootstrap (null)\n'
        + 'java.util.HashMap      bootstrap (null)\n'
        + 'javax.sql.DataSource   ClassLoaders$PlatformClassLoader\n'
        + 'LoaderReport           ClassLoaders$AppClassLoader\n\n'
        + 'delegation chain upwards from this class:\n'
        + '  ClassLoaders$AppClassLoader\n'
        + '    ClassLoaders$PlatformClassLoader\n'
        + '      bootstrap (null)\n\n'
        + 'Two details matter. The three-argument forName with `false` avoids initializing the '
        + 'classes you are only inspecting — the one-argument form would have run their static '
        + 'blocks. And stripping the package from the loader class name removes the identity '
        + 'hash, so two runs produce identical output and the result can be diffed.',
      complexity: 'O(n) in the number of class names.',
    },
  },

  {
    id: '01-02-medium-stale-constant',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    title: 'Reproduce the stale constant, then fix it',
    difficulty: 'Medium',
    objective:
      'Cause a program to print a value its own source no longer contains, and understand '
      + 'the build failure well enough to recognise it in a real codebase.',
    problem:
      'Write Config.java with `public static final int TIMEOUT = 30;` and UsesConfig.java that '
      + 'prints it. Compile both and run. Then change TIMEOUT to 60, recompile ONLY Config, and '
      + 'run again. Explain what you see, prove it with javap, then change the design so the '
      + 'same edit cannot go stale.',
    requirements: [
      'Show the three runs: both compiled, only Config recompiled, then both recompiled.',
      'Use javap on UsesConfig to show where the value actually lives.',
      'Produce a version where recompiling only Config DOES change the output, and explain what you changed.',
    ],
    constraints: ['No build tool — plain javac, so the partial rebuild is explicit.'],
    sampleInput: '',
    sampleOutput: 'timeout = 30\ntimeout = 30      <- Config says 60\ntimeout = 60',
    edgeCases: [
      'The same trap applies to String constants, and to any static final primitive with a constant initializer.',
      'Replacing a JAR in a deployment is the same partial rebuild, at a larger scale.',
    ],
    testCases: [
      { input: 'javac Config.java UsesConfig.java && java UsesConfig', expected: 'timeout = 30' },
      { input: 'edit to 60; javac Config.java && java UsesConfig', expected: 'timeout = 30' },
      { input: 'javac UsesConfig.java && java UsesConfig', expected: 'timeout = 60' },
    ],
    hints: [
      'A static final field of a primitive or String type with a CONSTANT initializer is a compile-time constant.',
      'Run `javap -c UsesConfig.class` and look for whether Config is referenced at all.',
      'A field whose value is not a compile-time constant is read at run time. `static final Integer`, or a method call, both qualify.',
    ],
    solution: {
      language: 'java',
      code:
        '// STALE VERSION - the value is inlined into every caller\n'
        + 'public class Config {\n'
        + '    public static final int TIMEOUT = 30;\n'
        + '}\n'
        + '\n'
        + '// FIXED - not a compile-time constant, so it is read at run time\n'
        + 'class ConfigFixed {\n'
        + '    public static final Integer TIMEOUT = 30;      // boxed: not a constant\n'
        + '    // or\n'
        + '    public static int timeout() { return 30; }     // a call is never inlined this way\n'
        + '}\n',
      explanation:
        'Verified sequence:\n\n'
        + 'timeout = 30      (both compiled)\n'
        + 'timeout = 30      (Config now says 60, but UsesConfig was not recompiled)\n'
        + 'timeout = 60      (after recompiling UsesConfig)\n\n'
        + '`javap -c UsesConfig.class` shows the cause: there is no reference to Config in the '
        + 'bytecode at all. The compiler substituted 30 at the use site and then folded the whole '
        + 'concatenation into a single string literal, so at run time nothing consults Config.\n\n'
        + 'The fix is to stop it being a compile-time constant. `static final Integer` is not one, '
        + 'because the initializer requires boxing; nor is anything computed by a method call. Both '
        + 'are then genuine field reads or invocations at run time, so recompiling only Config is '
        + 'enough. The cost is that you lose constant folding, which for a configuration value is '
        + 'no cost at all.\n\n'
        + 'In practice: do a clean build whenever a constant changes, and reserve `static final int` '
        + 'for values that are genuinely fixed forever, like array sizes and bit masks.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-02-challenge-trigger-harness',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    title: 'Build a harness that classifies initialization triggers',
    difficulty: 'Challenge',
    objective:
      'Turn the JLS rules on active use into something you have tested, rather than something '
      + 'you have read.',
    problem:
      'Write TriggerHarness.java that exercises six operations, each against its own otherwise '
      + 'unused class, and reports whether the class was initialized: reading a compile-time '
      + 'constant, reading a non-constant static final, creating an array of the type, reading '
      + 'a static field inherited from a superclass, calling a static method, and instantiating. '
      + 'Each class announces its own initialization.',
    requirements: [
      'Six distinct classes, so one initialization cannot be mistaken for another.',
      'Each prints a distinctive marker from its static block.',
      'Label each operation before performing it, so the output reads as a table.',
      'Predict all six results before running.',
    ],
    constraints: [
      'No reflection — the point is what ordinary code does.',
      'Each class must be used by exactly one operation.',
    ],
    sampleInput: '',
    sampleOutput: 'read a compile-time constant:\n  -> done\nread a non-constant static final:\n  INITIALIZED BoxedHolder\n  -> done\ndeclare an array type:\n  -> done\nread an inherited static field:\n  INITIALIZED Base\n  -> done\ncall a static method:\n  INITIALIZED StaticMethod\n  -> done\ninstantiate:\n  INITIALIZED Instantiated\n  -> done',
    edgeCases: [
      'The inherited-field case initializes the SUPERCLASS only — the subclass stays untouched.',
      'The array case creates the array class but not the element class.',
    ],
    testCases: [{ input: 'java TriggerHarness', expected: 'exactly four INITIALIZED lines, from BoxedHolder, Base, StaticMethod and Instantiated' }],
    starterCode:
      'public class TriggerHarness {\n'
      + '    public static void main(String[] args) {\n'
      + '        // six labelled operations, each against its own class\n'
      + '    }\n'
      + '}\n'
      + '\n'
      + '// ConstHolder, BoxedHolder, ArrayOnly, Base, Sub extends Base,\n'
      + '// StaticMethod, Instantiated - each with a printing static block\n',
    hints: [
      'Make the constant `static final int LIMIT = 10;` and the non-constant `static final Integer LIMIT = 10;` — the boxing is what makes the difference.',
      'For the inherited case, declare the field in Base and read it through Sub.',
      'A `Supplier<Integer>` per operation keeps main readable and forces each action to actually be evaluated.',
    ],
    solution: {
      language: 'java',
      code:
        'public class TriggerHarness {\n'
        + '\n'
        + '    public static void main(String[] args) {\n'
        + '        check("read a compile-time constant", () -> use(ConstHolder.LIMIT));\n'
        + '        check("read a non-constant static final", () -> use(BoxedHolder.LIMIT.intValue()));\n'
        + '        check("declare an array type", () -> use(new ArrayOnly[2].length));\n'
        + '        check("read an inherited static field", () -> use(Sub.inherited.length()));\n'
        + '        check("call a static method", () -> { StaticMethod.ping(); return 0; });\n'
        + '        check("instantiate", () -> { new Instantiated(); return 0; });\n'
        + '    }\n'
        + '\n'
        + '    static int use(int value) { return value; }\n'
        + '\n'
        + '    static void check(String label, java.util.function.Supplier<Integer> action) {\n'
        + '        System.out.println(label + ":");\n'
        + '        action.get();\n'
        + '        System.out.println("  -> done");\n'
        + '    }\n'
        + '}\n'
        + '\n'
        + 'class ConstHolder     { static final int LIMIT = 10;\n'
        + '                        static { System.out.println("  INITIALIZED ConstHolder"); } }\n'
        + 'class BoxedHolder     { static final Integer LIMIT = 10;\n'
        + '                        static { System.out.println("  INITIALIZED BoxedHolder"); } }\n'
        + 'class ArrayOnly       { static { System.out.println("  INITIALIZED ArrayOnly"); } }\n'
        + 'class Base            { static String inherited = "base";\n'
        + '                        static { System.out.println("  INITIALIZED Base"); } }\n'
        + 'class Sub extends Base { static { System.out.println("  INITIALIZED Sub"); } }\n'
        + 'class StaticMethod    { static void ping() { }\n'
        + '                        static { System.out.println("  INITIALIZED StaticMethod"); } }\n'
        + 'class Instantiated    { static { System.out.println("  INITIALIZED Instantiated"); } }\n',
      explanation:
        'Verified: exactly four of the six operations initialize anything.\n\n'
        + 'NOT initialized: ConstHolder (the constant was inlined at compile time, so nothing '
        + 'refers to the class at run time), ArrayOnly (creating an array creates the array class, '
        + 'not the element class), and Sub (reading a field declared in Base is a use of Base).\n\n'
        + 'Initialized: BoxedHolder (boxing means the initializer is not a constant expression, so '
        + 'this is a real field read), Base, StaticMethod, and Instantiated.\n\n'
        + 'The Sub/Base result is the one most people get wrong. A static field belongs to the class '
        + 'that DECLARES it; inheriting a name does not make reading it a use of the subclass.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-02-interview-diagnose-phases',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_02,
    title: 'Diagnose five failures by the phase they came from',
    difficulty: 'Interview',
    objective:
      'Be able to hear an error name and say immediately how far the JVM got — which is what '
      + 'turns a vague "classpath problem" into a specific next step.',
    problem:
      'Without notes, for each of ClassFormatError, UnsupportedClassVersionError, VerifyError, '
      + 'NoSuchMethodError and ExceptionInInitializerError: name the phase it comes from, say '
      + 'what it tells you, and give the first thing you would check. Then reproduce at least '
      + 'three of them at a terminal.',
    requirements: [
      'Map each error to loading, verification, resolution or initialization.',
      'Explain why NoClassDefFoundError can mean two entirely different things.',
      'Reproduce at least three, using CorruptClass.java for the ones that need a broken class file.',
      'Say what -verbose:class would tell you in each case.',
    ],
    constraints: ['JDK tools only.'],
    sampleInput: '',
    sampleOutput: 'A spoken answer plus a terminal session. There is no single correct transcript.',
    edgeCases: [
      'Being asked "is NoClassDefFoundError a missing class?" — sometimes, and sometimes the exact opposite.',
      'Being asked why verification exists when javac already type-checked.',
    ],
    testCases: [],
    hints: [
      'Group them by phase first: loading (ClassFormatError, UnsupportedClassVersionError), verification (VerifyError), resolution (NoSuchMethodError, NoSuchFieldError), initialization (ExceptionInInitializerError).',
      'All of them except ExceptionInInitializerError are about the class file or the environment. That one is about YOUR code throwing.',
      'For the reproductions, offset 0 breaks the magic number and offset 7 the major version.',
    ],
    solution: {
      language: 'java',
      code:
        '// Verified reproduction sequence - all captured in this chapter.\n'
        + '//\n'
        + '//  LOADING\n'
        + '//    java CorruptClass Loaders.class broken/Loaders.class 0 0xDE\n'
        + '//    java -cp broken Loaders\n'
        + '//      -> ClassFormatError: Incompatible magic value 3741235902\n'
        + '//\n'
        + '//    java CorruptClass Loaders.class broken/Loaders.class 7 0xFF\n'
        + '//    java -cp broken Loaders\n'
        + '//      -> UnsupportedClassVersionError: ... class file version 255.0 ...\n'
        + '//         this version of the Java Runtime only recognizes ... up to 65.0\n'
        + '//\n'
        + '//  VERIFICATION\n'
        + '//    java CorruptClass Tiny.class broken/Tiny.class 348 0xAC\n'
        + '//    java -cp broken Tiny\n'
        + '//      -> VerifyError: Operand stack underflow, with frame and bytecode dump\n'
        + '//\n'
        + '//  INITIALIZATION\n'
        + '//    java InitFailure\n'
        + '//      -> ExceptionInInitializerError, then NoClassDefFoundError on reuse\n'
        + 'public class DiagnosisNotes {\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("Say it out loud, then run the sequence above.");\n'
        + '    }\n'
        + '}\n',
      explanation:
        'A model answer, phase by phase.\n\n'
        + '**ClassFormatError** - loading. The bytes are not a well-formed class file; the magic '
        + 'number or structure is wrong. Check whether the file was truncated, corrupted in '
        + 'transit, or is not actually a class file.\n\n'
        + '**UnsupportedClassVersionError** - loading. The file is well-formed but its major '
        + 'version is higher than this JVM supports; the message names both numbers. Check the '
        + 'build JDK against the runtime JDK, and use --release rather than -source/-target.\n\n'
        + '**VerifyError** - verification. The bytecode is structurally valid but not type-safe or '
        + 'stack-safe. In practice this means generated or transformed bytecode, a broken agent, or '
        + 'a corrupted file - not something javac produces.\n\n'
        + '**NoSuchMethodError** - resolution, and it is an Error rather than an exception because '
        + 'the reference was compiled in. Because resolution may be lazy, it can surface long after '
        + 'startup, the first time that call site executes. Check for a library version mismatch '
        + 'between compile and run.\n\n'
        + '**ExceptionInInitializerError** - initialization. Your static initializer threw. The '
        + 'cause is attached; read it. The class is then permanently marked erroneous.\n\n'
        + '**And NoClassDefFoundError sits across two of these.** It means either "a compiled-in '
        + 'dependency is absent" (a loading failure) or "this class already failed to initialize" '
        + '(the aftermath of the previous entry). The Caused by chain distinguishes them in one '
        + 'line, and getting this wrong sends people to audit a classpath that was never the '
        + 'problem.\n\n'
        + '-verbose:class helps in every case: it shows whether the class was loaded at all and '
        + 'from which source, which settles "is it on the classpath?" and "which copy won?" '
        + 'immediately.',
      complexity: 'Not applicable.',
    },
  },

  /* ======================================================================
     Module 01 · Chapter 3 — The Execution Engine
     Solutions verified by execution on OpenJDK 21.0.10, --release 17,
     4 vCPU Xeon @2.80GHz, 2026-08-13. Sources: java/module-01/ch03/solutions/
     Timings are ONE machine, ONE workload - indicative shapes, not benchmarks.
     ====================================================================== */

  {
    id: '01-03-warmup-observe-warmup',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    title: 'Watch a JVM warm up',
    difficulty: 'Warm-up',
    objective:
      'See with your own timings that the same work costs less after the JVM has been '
      + 'running it for a while, so "warm-up" stops being an abstraction.',
    problem:
      'Write a program with a small method doing arithmetic in a loop. Call it 20,000 times '
      + 'per batch, for 12 batches, timing each batch and printing the result. Consume the '
      + 'result so the compiler cannot delete the work. Run it and describe the curve.',
    requirements: [
      'The unit of work must be small and called many times, not one huge loop.',
      'Time each batch with System.nanoTime and report microseconds.',
      'Accumulate and print a checksum, so the computation cannot be optimised away.',
      'Say which batch the curve flattens at.',
    ],
    constraints: ['No libraries. System.nanoTime only.'],
    sampleInput: '',
    sampleOutput: 'batch  1:   10,224 us\nbatch  2:    8,046 us\nbatch  3:    7,984 us\n...\nbatch 12:    7,725 us',
    edgeCases: [
      'Drop the checksum and the loop may be deleted entirely, making every batch near-zero.',
      'Use one giant loop instead of many calls and on-stack replacement flattens the curve almost immediately.',
    ],
    testCases: [{ input: 'java Warmup', expected: 'batch 1 clearly slower than the steady state' }],
    starterCode:
      'public class Warmup {\n'
      + '    static long work(int n) {\n'
      + '        // small arithmetic loop, returning a value\n'
      + '        return 0;\n'
      + '    }\n'
      + '\n'
      + '    public static void main(String[] args) {\n'
      + '        // 12 batches of 20,000 calls, timing each batch\n'
      + '        // print a checksum at the end\n'
      + '    }\n'
      + '}\n',
    hints: [
      'System.nanoTime() around the batch, divided by 1_000, gives microseconds.',
      'If every batch prints a near-zero time, the JIT deleted your loop. Accumulate the result into a variable you print.',
      'The compiler needs a few thousand invocations before it acts - that is why the batch size matters.',
    ],
    solution: {
      language: 'java',
      code:
        'public class Warmup {\n'
        + '\n'
        + '    static long work(int n) {\n'
        + '        long total = 0;\n'
        + '        for (int i = 1; i <= n; i++) {\n'
        + '            total += (i % 7) * (i % 13);\n'
        + '        }\n'
        + '        return total;\n'
        + '    }\n'
        + '\n'
        + '    public static void main(String[] args) {\n'
        + '        int batches = args.length > 0 ? Integer.parseInt(args[0]) : 12;\n'
        + '        int callsPerBatch = 20_000;\n'
        + '        int workSize = 200;\n'
        + '\n'
        + '        long checksum = 0;\n'
        + '        for (int batch = 1; batch <= batches; batch++) {\n'
        + '            long start = System.nanoTime();\n'
        + '            for (int call = 0; call < callsPerBatch; call++) {\n'
        + '                checksum += work(workSize);\n'
        + '            }\n'
        + '            long micros = (System.nanoTime() - start) / 1_000;\n'
        + '            System.out.printf("batch %2d: %,8d us%n", batch, micros);\n'
        + '        }\n'
        + '        System.out.println("checksum " + checksum);\n'
        + '    }\n'
        + '}\n',
      explanation:
        'Measured on 4 vCPU Xeon @2.80GHz, OpenJDK 21.0.10: batch 1 at 10,224 us, settling to '
        + 'about 7,700 us by batch 3 - roughly a quarter cheaper once warm. A second run '
        + 'reproduced the same shape.\n\n'
        + 'Your absolute numbers will differ and that does not matter. What should match is the '
        + 'shape: an expensive first batch, a short transition, then a flat line.\n\n'
        + 'The checksum is not decoration. Without something consuming the result, the JIT can '
        + 'prove the loop has no effect and remove it, and you end up timing an empty loop and '
        + 'concluding arithmetic is free.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-03-easy-execution-modes',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    title: 'Compare the execution modes, and report your method',
    difficulty: 'Easy',
    objective:
      'Quantify what the JIT is worth on your machine, and practise stating a measurement '
      + 'together with the conditions that make it meaningful.',
    problem:
      'Extend your warm-up program to also print the JVM execution mode it is running under, '
      + 'read from a system property. Run it under the default, -Xint, -Xcomp and '
      + '-XX:TieredStopAtLevel=1, and produce a small table of steady-state times. Write down '
      + 'the machine, the JDK, and the method alongside the numbers.',
    requirements: [
      'Print java.vm.name and java.vm.info at startup.',
      'Report the best of several rounds rather than a single timing.',
      'Run all four modes and tabulate the steady-state figure.',
      'State hardware, JDK version, workload and number of runs with the table.',
      'Write one sentence on why these numbers must not be quoted as general Java performance.',
    ],
    constraints: ['Standard library only.'],
    sampleInput: '',
    sampleOutput: 'java.vm.info    mixed mode, sharing\nbest of 8 rounds: 7,688 us',
    edgeCases: [
      '-Xcomp takes noticeably longer to START even though its steady state is fine.',
      'A shared or virtualised machine adds noise; run each mode more than once.',
    ],
    testCases: [
      { input: 'java ModeReport', expected: 'java.vm.info = mixed mode' },
      { input: 'java -Xint ModeReport', expected: 'java.vm.info = interpreted mode' },
    ],
    starterCode:
      'public class ModeReport {\n'
      + '    public static void main(String[] args) {\n'
      + '        // print java.vm.name / java.vm.info / java.vm.version\n'
      + '        // then time a fixed workload, best of N rounds\n'
      + '    }\n'
      + '}\n',
    hints: [
      'System.getProperty("java.vm.info") returns the same string java -version prints on its third line.',
      'Best-of-N is a reasonable quick estimate because noise only ever makes a run slower, never faster.',
      'Run each mode at least three times. If the spread between runs is bigger than the difference between modes, you have measured noise.',
    ],
    solution: {
      language: 'java',
      code:
        'public class ModeReport {\n'
        + '\n'
        + '    static long work(int n) {\n'
        + '        long total = 0;\n'
        + '        for (int i = 1; i <= n; i++) total += (i % 7) * (i % 13);\n'
        + '        return total;\n'
        + '    }\n'
        + '\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("java.vm.name    " + System.getProperty("java.vm.name"));\n'
        + '        System.out.println("java.vm.info    " + System.getProperty("java.vm.info"));\n'
        + '        System.out.println("java.vm.version " + System.getProperty("java.vm.version"));\n'
        + '\n'
        + '        long sink = 0;\n'
        + '        long best = Long.MAX_VALUE;\n'
        + '        for (int round = 0; round < 8; round++) {\n'
        + '            long start = System.nanoTime();\n'
        + '            for (int call = 0; call < 20_000; call++) sink += work(200);\n'
        + '            best = Math.min(best, (System.nanoTime() - start) / 1_000);\n'
        + '        }\n'
        + '        System.out.printf("best of 8 rounds: %,d us%n", best);\n'
        + '        System.out.println("sink " + sink);\n'
        + '    }\n'
        + '}\n',
      explanation:
        'Measured 2026-08-13 on 4 vCPU Intel Xeon @2.80GHz, 16 GB, Linux container, OpenJDK '
        + '21.0.10; steady state is batch 12 of 12, three runs per mode:\n\n'
        + '  default (tiered C1+C2)        7,757 / 7,822 / 7,772 us\n'
        + '  -XX:TieredStopAtLevel=1      14,564 / 15,711 / 14,653 us   about 1.9x slower\n'
        + '  -Xcomp                        7,386 / 7,401 / 7,417 us     about 0.95x\n'
        + '  -Xint                        59,406 / 56,006 / 56,205 us   about 7.2x slower\n\n'
        + 'The sentence that matters: this is one tight-integer-arithmetic workload on one '
        + 'shared virtual machine, which is close to the best case for a JIT. Code dominated by '
        + 'memory access, allocation or I/O would look nothing like this, and the ratios do not '
        + 'transfer to another machine, JDK or program. Quote the conditions or do not quote the '
        + 'number.\n\n'
        + 'Note also that -Xcomp came out marginally FASTER in steady state here, which is not '
        + 'the textbook expectation. See the chapter - the prediction was wrong and is recorded '
        + 'as such.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-03-applied-read-printcompilation',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    title: 'Read PrintCompilation and narrate what the JIT did',
    difficulty: 'Applied',
    objective:
      'Turn a wall of compiler output into a sentence about what happened to one method.',
    problem:
      'Run your warm-up program under -XX:+PrintCompilation, filter to your own methods, and '
      + 'write a short narration of the life of the hot method: which tiers it reached, in what '
      + 'order, where on-stack replacement occurred, and which compiled version was retired. '
      + 'Then find a method that reached tier 1 and only tier 1, and explain why.',
    requirements: [
      'Filter the output to your own class so the JDK noise is gone.',
      'Identify each column: time, id, flags, tier, method, size.',
      'Point to the % line and say what bytecode index it re-entered at.',
      'Point to the made not entrant line and say what it means.',
      'Find a tier-1-only method somewhere in the unfiltered output and explain the decision.',
    ],
    constraints: ['No profiler - only PrintCompilation.'],
    sampleInput: '',
    sampleOutput: '32    8       3       Warmup::work (30 bytes)\n32    9 %     4       Warmup::work @ 4 (30 bytes)\n33   10       4       Warmup::work (30 bytes)\n35    8       3       Warmup::work (30 bytes)   made not entrant',
    edgeCases: [
      'With too few batches the method never reaches tier 4 - raise the count.',
      'Tier numbers are HotSpot-specific and are not part of the Java specification.',
    ],
    testCases: [{ input: 'java -XX:+PrintCompilation Warmup 4 | grep Warmup::', expected: 'tier 3, then a % tier 4, then tier 4, then made not entrant' }],
    hints: [
      'grep for your class name followed by :: to drop everything from the JDK.',
      'The % flag is on-stack replacement and the @ N that follows the method name is the bytecode index.',
      'A one-line accessor has nothing for C2 to improve, so profiling it would cost more than it could ever save.',
    ],
    solution: {
      language: 'java',
      code:
        '// This exercise is about reading output. The verified sequence for Warmup::work:\n'
        + '//\n'
        + '//   32    8       3       Warmup::work (30 bytes)\n'
        + '//   32    9 %     4       Warmup::work @ 4 (30 bytes)\n'
        + '//   33   10       4       Warmup::work (30 bytes)\n'
        + '//   35    8       3       Warmup::work (30 bytes)   made not entrant\n'
        + '//\n'
        + '// and, from the unfiltered output of any run, a tier 0 native method:\n'
        + '//   26    3     n 0       jdk.internal.misc.Unsafe::getReferenceVolatile (native)\n'
        + 'public class NarrationNotes {\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("Read the four lines above and narrate them.");\n'
        + '    }\n'
        + '}\n',
      explanation:
        'A model narration:\n\n'
        + '"At 32 ms, work was compiled by C1 at tier 3 - native code that still collects profile '
        + 'data. In the same millisecond it was compiled again at tier 4 by C2, and the % flag '
        + 'says this was an on-stack replacement entering at bytecode index 4: the loop was '
        + 'already running, so rather than wait for the next call the JVM swapped the executing '
        + 'frame into the compiled version. At 33 ms a normal tier-4 compilation was installed for '
        + 'future invocations. At 35 ms the tier-3 version was made not entrant - anyone already '
        + 'inside it finishes there, but no new call will enter it."\n\n'
        + 'The columns are: milliseconds since VM start, compilation id, flags, tier, method, '
        + 'bytecode size.\n\n'
        + 'For the tier-1 question: methods that reach tier 1 and stop are ones C1 can compile '
        + 'and C2 could not meaningfully improve - trivial getters and one-line natives. '
        + 'Profiling them would cost more than the optimisation could ever return, so the JVM '
        + 'compiles them once without profiling and leaves them alone.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-03-medium-force-deoptimization',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    title: 'Force a deoptimisation and get the JVM to name the reason',
    difficulty: 'Medium',
    objective:
      'Make the JIT speculate, break the speculation deliberately, and confirm the discard '
      + 'from two independent sources rather than inferring it.',
    problem:
      'Write a program with one interface, two implementations, and a single call site. Run '
      + 'phase 1 with only the first implementation, long enough to be compiled at tier 4. Then '
      + 'run phase 2 introducing the second implementation at the same call site. Print a marker '
      + 'between phases. Show the compiled method being discarded, and get the JVM to state why.',
    requirements: [
      'Exactly one call site, reached with different concrete types in the two phases.',
      'Print a phase marker so the compilation output can be lined up against it.',
      'Show the made not entrant line arriving immediately after the phase 2 marker.',
      'Obtain the deoptimisation reason from the JVM, not from your own inference.',
    ],
    constraints: ['No reflection or agents - ordinary code and JVM flags only.'],
    sampleInput: '',
    sampleOutput: 'phase 2: Slow appears at the same call site\n38   11       4       Deoptimization::consume (28 bytes)   made not entrant',
    edgeCases: [
      'Plain -Xlog:deoptimization prints nothing; the reasons are at debug level.',
      'The exact count of deopt events varies between runs even though the reasons are stable.',
    ],
    testCases: [
      { input: 'java -XX:+PrintCompilation SpeculationDemo | grep -E "Speculation|phase"', expected: 'made not entrant right after the phase 2 marker' },
      { input: 'java -Xlog:deoptimization=debug SpeculationDemo | grep run', expected: 'a line naming reason `predicate`' },
    ],
    starterCode:
      'public class SpeculationDemo {\n'
      + '    interface Handler { int handle(int x); }\n'
      + '    // two implementations\n'
      + '\n'
      + '    static void run(Handler h, int times) {\n'
      + '        // the single call site\n'
      + '    }\n'
      + '\n'
      + '    public static void main(String[] args) {\n'
      + '        // phase 1: one implementation, ~200k calls\n'
      + '        // phase 2: both implementations, same call site\n'
      + '    }\n'
      + '}\n',
    hints: [
      'Phase 1 needs enough calls to reach tier 4 - a few hundred thousand is ample.',
      'Alternate the two implementations in phase 2 so the call site genuinely becomes bimorphic.',
      '-Xlog:deoptimization on its own is silent. Add =debug.',
    ],
    solution: {
      language: 'java',
      code:
        'public class SpeculationDemo {\n'
        + '\n'
        + '    interface Handler { int handle(int x); }\n'
        + '    static class Fast implements Handler { public int handle(int x) { return x + 1; } }\n'
        + '    static class Slow implements Handler { public int handle(int x) { return x + 2; } }\n'
        + '\n'
        + '    static long sink;\n'
        + '\n'
        + '    static void run(Handler h, int times) {\n'
        + '        for (int i = 0; i < times; i++) sink += h.handle(i);\n'
        + '    }\n'
        + '\n'
        + '    public static void main(String[] args) {\n'
        + '        Handler fast = new Fast();\n'
        + '\n'
        + '        System.out.println("phase 1: only Fast");\n'
        + '        for (int i = 0; i < 200_000; i++) run(fast, 10);\n'
        + '\n'
        + '        System.out.println("phase 2: Slow appears at the same call site");\n'
        + '        Handler slow = new Slow();\n'
        + '        for (int i = 0; i < 200_000; i++) run(i % 2 == 0 ? fast : slow, 10);\n'
        + '\n'
        + '        System.out.println("sink " + sink);\n'
        + '    }\n'
        + '}\n',
      explanation:
        'Two independent confirmations, both verified.\n\n'
        + 'PrintCompilation shows the tier-4 method retired immediately after the phase 2 marker '
        + 'prints, then recompiled - first by on-stack replacement so the loop already running can '
        + 'continue, then normally for future calls.\n\n'
        + '-Xlog:deoptimization=debug names the reason:\n\n'
        + '  ... level=4 ...run(...)V trap_bci=4 predicate maybe_recompile\n'
        + '  ... osr level=4 ...run(...)V trap_bci=2 osr_bci=2 profile_predicate maybe_recompile\n\n'
        + '`predicate` is the guard C2 inserted around its assumption that the receiver was always '
        + 'Fast; `profile_predicate` is the equivalent for the on-stack-replaced version. Across '
        + 'three runs the reasons were identical every time, although the number of events varied - '
        + 'so assert the reasons, not the counts.\n\n'
        + 'Worth noticing: plain -Xlog:deoptimization prints nothing at all. Discovering that the '
        + 'detail lives at debug level is part of learning to interrogate the JVM.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-03-challenge-call-site-shape',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    title: 'Measure what a call site’s shape costs',
    difficulty: 'Challenge',
    objective:
      'Predict, then measure, how the number of implementations at one call site affects its '
      + 'cost - and discover that the answer is not a straight line.',
    problem:
      'Write a harness that drives the same call site with one, two, and five implementations '
      + 'of an interface, doing identical work in each case. Warm up properly, then time each '
      + 'shape. Predict the results before running. Explain the shape you actually get.',
    requirements: [
      'One driving method, called with arrays of 1, 2 and 5 implementations.',
      'Warm up each shape before timing it.',
      'Report best-of-N rather than a single run.',
      'Consume the result so nothing can be optimised away.',
      'Write your prediction down before running, then explain the difference.',
    ],
    constraints: ['Standard library only. No JMH - that is Module 41.'],
    sampleInput: '',
    sampleOutput: 'monomorphic       36,511 us (best of 5)\nbimorphic         36,508 us (best of 5)\nmegamorphic       74,155 us (best of 5)',
    edgeCases: [
      'Warming up with one shape and timing another measures the transition, not the shape.',
      'The array indexing is identical in all three cases, so it cancels out of the comparison.',
    ],
    testCases: [{ input: 'java CallSiteShape', expected: 'monomorphic and bimorphic within noise of each other; megamorphic roughly 2x' }],
    starterCode:
      'public class CallSiteShape {\n'
      + '    interface Op { int apply(int x); }\n'
      + '    // five implementations\n'
      + '\n'
      + '    static void drive(Op[] ops, int iterations) {\n'
      + '        // one call site, cycling through the array\n'
      + '    }\n'
      + '\n'
      + '    public static void main(String[] args) {\n'
      + '        // time arrays of size 1, 2 and 5\n'
      + '    }\n'
      + '}\n',
    hints: [
      'Cycle with ops[i % ops.length] so the same call site sees each implementation in turn.',
      'Warm up each shape with tens of rounds before timing, so the call site is compiled in that shape.',
      'Most people predict a steady increase from one to five. Look carefully at where the jump actually is.',
    ],
    solution: {
      language: 'java',
      code:
        'public class CallSiteShape {\n'
        + '\n'
        + '    interface Op { int apply(int x); }\n'
        + '\n'
        + '    static class A implements Op { public int apply(int x) { return x + 1; } }\n'
        + '    static class B implements Op { public int apply(int x) { return x + 2; } }\n'
        + '    static class C implements Op { public int apply(int x) { return x + 3; } }\n'
        + '    static class D implements Op { public int apply(int x) { return x + 4; } }\n'
        + '    static class E implements Op { public int apply(int x) { return x + 5; } }\n'
        + '\n'
        + '    static long sink;\n'
        + '\n'
        + '    static void drive(Op[] ops, int iterations) {\n'
        + '        long total = 0;\n'
        + '        for (int i = 0; i < iterations; i++) {\n'
        + '            total += ops[i % ops.length].apply(i);\n'
        + '        }\n'
        + '        sink += total;\n'
        + '    }\n'
        + '\n'
        + '    static long timeIt(String label, Op[] ops) {\n'
        + '        for (int i = 0; i < 50; i++) drive(ops, 100_000);   // warm up in THIS shape\n'
        + '\n'
        + '        long best = Long.MAX_VALUE;\n'
        + '        for (int round = 0; round < 5; round++) {\n'
        + '            long start = System.nanoTime();\n'
        + '            drive(ops, 20_000_000);\n'
        + '            best = Math.min(best, (System.nanoTime() - start) / 1_000);\n'
        + '        }\n'
        + '        System.out.printf("%-14s %,9d us (best of 5)%n", label, best);\n'
        + '        return best;\n'
        + '    }\n'
        + '\n'
        + '    public static void main(String[] args) {\n'
        + '        Op a = new A(), b = new B(), c = new C(), d = new D(), e = new E();\n'
        + '        timeIt("monomorphic", new Op[] { a });\n'
        + '        timeIt("bimorphic",   new Op[] { a, b });\n'
        + '        timeIt("megamorphic", new Op[] { a, b, c, d, e });\n'
        + '        System.out.println("sink " + sink);\n'
        + '    }\n'
        + '}\n',
      explanation:
        'Measured on 4 vCPU Xeon @2.80GHz, OpenJDK 21.0.10, and highly reproducible across runs:\n\n'
        + '  monomorphic   36,511 us   (second run 36,523)\n'
        + '  bimorphic     36,508 us   (second run 36,471)\n'
        + '  megamorphic   74,155 us   (second run 74,409)\n\n'
        + 'The jump is not between one and two - those are within noise of each other. It is '
        + 'between two and three.\n\n'
        + 'HotSpot inlines a monomorphic call site outright. For a bimorphic one it uses an inline '
        + 'cache that checks which of two types arrived and branches to the right inlined body, '
        + 'which is nearly as good. At three or more receivers the site becomes megamorphic and '
        + 'falls back to a genuine virtual dispatch that cannot be inlined - and losing the inline '
        + 'also loses every optimisation that would have followed it.\n\n'
        + 'Practical consequence: an interface with two implementations behaves very differently '
        + 'from one with five at the same hot call site. That is worth knowing and NOT worth '
        + 'designing around prematurely - measure your own code before contorting it. One machine, '
        + 'one workload; the ratio is indicative, not a constant.',
      complexity: 'Not applicable.',
    },
  },

  {
    id: '01-03-interview-explain-jit',
    moduleId: MODULE_01,
    chapterId: CHAPTER_01_03,
    title: 'Explain adaptive optimisation, and defend a number',
    difficulty: 'Interview',
    objective:
      'Give the spoken answer, then survive the follow-up that most candidates fail: '
      + '"where did that number come from?"',
    problem:
      'Without notes, answer: "Walk me through what the JVM does with your bytecode at run '
      + 'time, and explain why it is faster than interpreting but slower to start than a native '
      + 'binary." Then be ready for: "You said the JIT gives roughly a sevenfold speedup - on '
      + 'what?" Demonstrate at least two of your claims at a terminal.',
    requirements: [
      'Cover interpretation, profiling, tiered compilation, OSR, and deoptimisation.',
      'Explain the startup versus steady-state trade-off in both directions.',
      'State any number together with the hardware, JDK, workload and method behind it.',
      'Say explicitly which parts are HotSpot behaviour rather than Java specification.',
      'Demonstrate at least two claims live.',
    ],
    constraints: ['JDK tools only.'],
    sampleInput: '',
    sampleOutput: 'A spoken answer plus a terminal session. There is no single correct transcript.',
    edgeCases: [
      'Being asked "so should we use -Xcomp?" - the honest answer needs the startup measurement.',
      'Being asked whether this is true of all JVMs. It is not.',
    ],
    testCases: [],
    hints: [
      'Structure it as: interpret to start fast, profile while running, compile the hot parts, speculate using the profile, deoptimise when the speculation breaks.',
      'The two easiest live demonstrations are the warm-up curve and PrintCompilation on a hot method.',
      'For the number question, the only good answer names the conditions. "About seven times, on tight integer arithmetic, on a 4 vCPU Xeon running OpenJDK 21, comparing -Xint to the default" is defensible. "About seven times" alone is not.',
    ],
    solution: {
      language: 'java',
      code:
        '// Verified demonstration sequence - all captured in this chapter.\n'
        + '//\n'
        + '//   java -version                       -> "mixed mode": interpreter AND compiler\n'
        + '//   java Warmup                         -> batch 1 ~10,224us settling to ~7,700us\n'
        + '//   java -XX:+PrintCompilation Warmup 4 | grep Warmup::\n'
        + '//                                       -> tier 3, then % tier 4 (OSR), then tier 4,\n'
        + '//                                          then tier 3 made not entrant\n'
        + '//   java -Xint Warmup                   -> ~56,000us steady, no warm-up curve\n'
        + '//   time java -Xcomp Hello              -> ~1,300ms vs ~39ms default\n'
        + '//   java -Xlog:deoptimization=debug Deoptimization | grep consume\n'
        + '//                                       -> reason: predicate\n'
        + 'public class InterviewNotes {\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("Say it out loud, then run two of the commands above.");\n'
        + '    }\n'
        + '}\n',
      explanation:
        'A model answer:\n\n'
        + '"The JVM starts by interpreting bytecode, so the program runs immediately with no '
        + 'compilation cost. While interpreting it profiles - counting invocations, branch '
        + 'outcomes, and which concrete types arrive at each call site. Once a method is clearly '
        + 'hot, C1 compiles it quickly into native code that keeps profiling, and once it is very '
        + 'hot C2 compiles it again using that profile, aggressively. If a method is stuck in a '
        + 'long loop rather than being called repeatedly, on-stack replacement compiles it and '
        + 'swaps the running frame over mid-loop.\n\n'
        + 'It beats interpretation because it ends up executing native code. It beats an '
        + 'ahead-of-time compiler in some ways because it optimises with evidence - it can inline '
        + 'a virtual call it has only ever seen resolve one way, which a static compiler cannot '
        + 'safely do. Those assumptions are guarded, and when one fails the JVM deoptimises: '
        + 'discards the code, returns to the interpreter, recompiles.\n\n'
        + 'It is slower to start because all of that is work done at run time, and because most '
        + 'methods run once and compiling them buys nothing. That is the whole trade."\n\n'
        + 'AND THE FOLLOW-UP. If asked to defend a number, the answer must carry its conditions: '
        + '"About 7x, comparing -Xint to the default on a tight integer-arithmetic loop, on a '
        + '4 vCPU Xeon at 2.80GHz running OpenJDK 21.0.10, steady state after warm-up, three runs "'
        + 'per mode. It is close to the best case for a JIT and it would not transfer to '
        + 'allocation-heavy or I/O-bound code. For anything real I would use JMH."\n\n'
        + 'A candidate who volunteers the conditions before being asked has demonstrated the thing '
        + 'the question is actually testing.',
      complexity: 'Not applicable.',
    },
  },
];

/** Exercises for one module, in ladder order. @param {string} moduleId */
export function exercisesForModule(moduleId) {
  return EXERCISES
    .filter((e) => e.moduleId === moduleId)
    .sort((a, b) => DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty));
}

/** Exercises for one chapter, in ladder order. @param {string} chapterId */
export function exercisesForChapter(chapterId) {
  return EXERCISES
    .filter((e) => e.chapterId === chapterId)
    .sort((a, b) => DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty));
}

/** How many REAL exercises exist — placeholders excluded, so counts stay honest. */
export function realExerciseCount() {
  return EXERCISES.filter((e) => !e.isPlaceholder).length;
}

export default EXERCISES;
