/**
 * exercises.js — practice exercises, keyed to modules.
 *
 * ===========================================================================
 * AUTHORED PER CHAPTER, THROUGH `CONTINUE` — NEVER AHEAD OF IT
 * ===========================================================================
 * Exercises appear here only when the chapter they belong to is written
 * (master brief §36, §41). Adding them ahead of that would be fake content.
 *
 * Authored so far: Module 01 Chapter 1 (`01-01`) — six exercises across the
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
