/**
 * Module 01, Chapter 1 — From Source to Running Program.
 *
 * CONTENT IS DATA (docs/ARCHITECTURE.md §4). This file holds no markup and no
 * presentation decisions; assets/js/chapter-view.js renders it. See
 * data/chapters.js for the chapter data contract and the section vocabulary.
 *
 * ===========================================================================
 * PROVENANCE OF EVERY OUTPUT IN THIS FILE
 * ===========================================================================
 * Every `output` and `realError` string below was produced by actually running
 * the command on 2026-08-13, not written from memory. The environment:
 *
 *     javac 21.0.10
 *     openjdk version "21.0.10" 2026-01-20
 *     OpenJDK Runtime Environment (build 21.0.10+7-Ubuntu-124.04)
 *     OpenJDK 64-Bit Server VM (build 21.0.10+7-Ubuntu-124.04, mixed mode, sharing)
 *
 * Sources live in `java/module-01/ch01/` and compile with `--release 17`,
 * because Java 17 is this project's baseline (README §3) while the JDK
 * available here is 21. Where a number depends on that choice — the class file
 * major version especially — the text says so.
 *
 * If you change an example, RE-RUN IT and update the recorded output. An
 * output that drifts from its program is worse than no output at all.
 */

export const chapter = {
  id: '01-01',
  moduleId: '01-java-foundations-execution-model',
  number: 1,
  title: 'From Source to Running Program',
  subtitle: 'What `javac` actually produces, what `java` actually consumes, and why the two are separate.',

  objectives: [
    'Explain what the JDK, the JRE, and the JVM each are, and which one you are using when.',
    'Trace a program from `.java` through `javac` to `.class` bytecode and into a running JVM.',
    'Read a class file’s magic number and version, and say what they mean.',
    'Say precisely how Java’s compilation model differs from C++’s, and what "platform independent" does and does not claim.',
    'Use the classpath deliberately, and diagnose `ClassNotFoundException` and `NoClassDefFoundError` from the difference between them.',
    'Package classes into a JAR and explain why `java -jar` needs a manifest entry that `java -cp` does not.',
  ],

  // Exact strings from docs/CURRICULUM.md, Module 01. This chapter owns these.
  topicsCovered: [
    'Java history and philosophy',
    'JDK', 'JRE', 'JVM', 'JDK vs JRE vs JVM',
    'Java source code', '`javac`', 'bytecode', '`.class` files', '`java` command',
    'classpath', 'JAR files',
    'compilation vs execution', 'Java vs C++ compilation',
    'platform independence', 'WORA',
  ],

  // Stated openly so nobody mistakes this chapter for the whole module.
  topicsDeferred: [
    { topic: 'JVM architecture, class loading and its phases, class loaders', to: 'Module 01, Chapter 2' },
    { topic: 'Execution engine, interpreter, JIT, HotSpot, JVM warm-up', to: 'Module 01, Chapter 3' },
    { topic: '`main()`, command-line arguments, `System.out`, `PrintStream`, packages, imports, naming conventions', to: 'Module 01, Chapter 4' },
  ],

  sections: [
    {
      type: 'prose',
      heading: 'What this chapter is really about',
      body: [
        'You already know how to compile a program. In C++ you run a compiler, get a binary, and execute it. Java splits that in half, and the split is the single most important thing to understand about the platform — nearly every "why does Java do that?" question in later modules traces back to it.',
        'The short version: `javac` does not produce a program your operating system can run. It produces an instruction stream for an abstract machine that does not exist in hardware. A second program, `java`, is that machine. Everything else in this chapter follows from taking that seriously.',
      ],
    },

    {
      type: 'callout',
      tone: 'delta',
      heading: 'Coming from C++',
      body: [
        'In C++, `g++ main.cpp` gives you an executable containing machine code for one CPU architecture and one operating system ABI. Running it on a different platform means recompiling from source.',
        'In Java, `javac Main.java` gives you a `.class` file containing *bytecode* — instructions for the JVM, not for your CPU. The same `.class` file is what runs everywhere. The recompilation step moves from your machine to the end user’s, and it happens automatically, at run time, inside the JVM.',
      ],
    },

    {
      type: 'prose',
      heading: 'Why Java was built this way',
      body: [
        'Java came out of Sun Microsystems in the early 1990s, originally aimed at consumer devices, and was publicly released in 1995. The design problem was distribution: shipping software to many different devices meant either maintaining a build per target or finding another way.',
        'The answer was to define a machine in software — a specification any vendor could implement — and compile to that instead. That decision bought portability, and it also bought something less obvious: because the JVM is present at run time and watching the program execute, it can make decisions a static compiler cannot. That is where garbage collection and just-in-time optimisation come from, both covered later (Module 14 for memory and GC; Module 01 Chapter 3 for the JIT).',
        'The cost is the one you would expect: a program cannot start running until a JVM is there to run it, and the JVM needs time to warm up before it performs well.',
      ],
    },

    {
      type: 'table',
      heading: 'JDK, JRE, JVM — three things people routinely confuse',
      columns: ['Term', 'What it is', 'What it contains', 'You need it when'],
      rows: [
        ['**JVM**', 'The abstract machine specification, and any implementation of it', 'Class loader, execution engine (interpreter + JIT), memory management', 'Always — it is what actually runs your code'],
        ['**JRE**', 'Java Runtime Environment: a JVM plus the standard class library', 'JVM + `java.lang`, `java.util`, `java.io`, …', 'You only need to *run* Java programs'],
        ['**JDK**', 'Java Development Kit: a JRE plus the development tools', 'JRE + `javac`, `javap`, `jar`, `jdb`, …', 'You need to *compile* Java programs'],
      ],
      note: 'The containment is strictly nested: JDK ⊃ JRE ⊃ JVM. If you have a JDK you have everything. Since JDK 11, Oracle and most distributions stopped shipping a standalone JRE download — you take the JDK and, if you need a trimmed runtime, build one with `jlink`. Nothing in this curriculum needs a separate JRE.',
    },

    {
      type: 'prose',
      heading: 'The pipeline, concretely',
      body: [
        'Two commands, two entirely different jobs. `javac` is a compiler: source in, bytecode out, then it exits. `java` is a launcher: it starts a JVM, loads your class, and runs it. Neither knows about the other; the `.class` file is the only thing they share.',
      ],
    },

    {
      type: 'diagram',
      heading: 'Source to execution',
      alt: 'HelloJava.java is compiled by javac into HelloJava.class containing bytecode, which the java launcher loads into a JVM, which executes it.',
      steps: [
        { label: 'HelloJava.java', detail: 'Source you write — text' },
        { label: 'javac', detail: 'Compiler. Checks syntax and types; emits bytecode' },
        { label: 'HelloJava.class', detail: 'Bytecode for the JVM — NOT machine code' },
        { label: 'java', detail: 'Launcher. Starts a JVM, loads the class, calls main' },
        { label: 'Running program', detail: 'JVM interprets, then JIT-compiles hot paths to native code' },
      ],
    },

    {
      type: 'code',
      heading: 'The smallest complete program',
      filename: 'java/module-01/ch01/HelloJava.java',
      language: 'java',
      code: [
        '/**',
        ' * The smallest complete Java program — Module 01, Chapter 1.',
        ' */',
        'public class HelloJava {',
        '    public static void main(String[] args) {',
        '        System.out.println("Hello from the JVM.");',
        '    }',
        '}',
      ].join('\n'),
      caption: 'Every example in this curriculum is a complete, compilable program rather than a fragment — you should always be able to copy it, compile it, and run it. `main`, `String[] args`, and `System.out` are used here as tools; Chapter 4 of this module teaches them properly.',
      command: 'javac --release 17 HelloJava.java\njava HelloJava',
      output: 'Hello from the JVM.',
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'Why `--release 17` in these commands',
      body: [
        'This project targets **Java 17** as its baseline (README §3), but the JDK used to verify these examples is **21**. `--release 17` tells `javac` to produce class files that a Java 17 JVM can load and to compile against the Java 17 API, so an example cannot silently depend on something newer.',
        'Plain `javac HelloJava.java` works exactly the same way for learning purposes — it just targets whatever JDK you have installed. Both forms are shown honestly rather than pretending the verification environment was 17.',
      ],
    },

    {
      type: 'prose',
      heading: 'What is actually inside a `.class` file',
      body: [
        'A class file is a binary format, not text, and it is worth looking at directly once — after that you will never wonder whether "bytecode" is a metaphor.',
        'The first four bytes of every class file are the same, and they are a joke that shipped: `0xCAFEBABE`. The next four are the format version.',
      ],
    },

    {
      type: 'terminal',
      heading: 'The first eight bytes',
      command: 'od -A d -t x1 -N 8 HelloJava.class',
      output: '0000000 ca fe ba be 00 00 00 3d\n0000008',
      caption: '`ca fe ba be` is the magic number that identifies the file as a class file — a JVM that does not see it refuses the file immediately. Then `00 00` is the minor version and `00 3d` is the major version. `0x3d` is 61 decimal.',
    },

    {
      type: 'terminal',
      heading: 'The same thing, readably',
      command: 'javap -verbose HelloJava.class | grep -E "major|minor"',
      output: '  minor version: 0\n  major version: 61',
      caption: 'Major version 61 corresponds to Java 17 — which is exactly what `--release 17` asked for. Compiling the identical source with plain `javac` on this JDK 21 instead produces **major version 65**. Both numbers were measured, not recalled. The general scheme in the JVM specification is that the major version is the Java release number plus 44.',
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: 'The error this explains',
      body: [
        '`UnsupportedClassVersionError` is this number and nothing more: you compiled with a newer JDK than the JVM you are running on, so the JVM sees a major version it does not understand and refuses to load the class. The fix is either a newer runtime or `--release` set to the version you actually need to support.',
        'This is also why "it compiles on my machine" and "it runs on the server" are separate claims in Java.',
      ],
    },

    {
      type: 'terminal',
      heading: 'The bytecode itself',
      command: 'javap -c HelloJava.class',
      output: [
        'Compiled from "HelloJava.java"',
        'public class HelloJava {',
        '  public HelloJava();',
        '    Code:',
        '       0: aload_0',
        '       1: invokespecial #1                  // Method java/lang/Object."<init>":()V',
        '       4: return',
        '',
        '  public static void main(java.lang.String[]);',
        '    Code:',
        '       0: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;',
        '       3: ldc           #13                 // String Hello from the JVM.',
        '       5: invokevirtual #15                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V',
        '       8: return',
        '}',
      ].join('\n'),
      caption: 'This is a stack machine, not a register machine: `getstatic` pushes `System.out` onto the operand stack, `ldc` pushes the string constant, and `invokevirtual` consumes both to make the call. You are not expected to write bytecode — you are expected to know that this layer exists, because stack traces, debuggers, and profilers all speak it.',
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'Notice what you did not write',
      body: [
        'The listing contains `public HelloJava();` — a no-argument constructor. There is none in the source. `javac` inserts a default constructor when a class declares none, and the bytecode is where you can see it happen rather than take it on faith.',
        'Constructors are Module 02’s subject; the point here is only that the `.class` file is not a transcription of your source. The compiler adds, removes, and rewrites.',
      ],
    },

    {
      type: 'prose',
      heading: 'Platform independence — and what it does not mean',
      body: [
        '"Write once, run anywhere" (WORA) is a claim about the *bytecode*, not about your program. The `.class` file is genuinely portable: the format is specified, and any conforming JVM on any operating system loads the identical bytes.',
        'What is not portable is everything your program does outside the language: file path separators, line endings, character encodings, available fonts, case-sensitive versus case-insensitive filesystems, thread scheduling, and anything you shell out to. A Java program that hardcodes `C:\\\\temp\\\\out.txt` is exactly as unportable as a C++ one.',
        'So the accurate statement is: *the compilation artefact* is platform independent, and the JVM is the per-platform part that someone else already ported. That is a large win, and it is not the same as your application being portable.',
      ],
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: 'Not verified here',
      body: [
        'Every command in this chapter was run on Linux with OpenJDK 21. **Cross-platform execution of the same `.class` file was not verified** — no Windows or macOS machine was available. The portability claim above is the specified behaviour of the class file format, not something this chapter demonstrated by running it in two places.',
      ],
    },

    {
      type: 'prose',
      heading: 'The classpath: how the JVM finds classes',
      body: [
        'Your program is not one class, and the JVM does not scan your disk. The **classpath** is the ordered list of places it looks for class files: directories, JAR files, or both, separated by `:` on Linux and macOS and `;` on Windows.',
        'Getting this wrong is the single most common way a beginner’s Java program fails to start, and the two errors it produces are not the same error — the difference tells you when the class went missing.',
      ],
    },

    {
      type: 'code',
      heading: 'Two classes, deliberately kept apart',
      filename: 'java/module-01/ch01/Greeter.java',
      language: 'java',
      code: [
        'public class Greeter {',
        '    public static String greet(String who) {',
        '        return "Hello, " + who + "!";',
        '    }',
        '}',
      ].join('\n'),
      caption: 'Compiled into one directory…',
    },

    {
      type: 'code',
      heading: '…and its caller compiled into another',
      filename: 'java/module-01/ch01/UseGreeter.java',
      language: 'java',
      code: [
        'public class UseGreeter {',
        '    public static void main(String[] args) {',
        '        String who = args.length > 0 ? args[0] : "world";',
        '        System.out.println(Greeter.greet(who));',
        '    }',
        '}',
      ].join('\n'),
      command: 'javac --release 17 -d /tmp/cpdemo/lib Greeter.java\njavac --release 17 -cp /tmp/cpdemo/lib -d /tmp/cpdemo/app UseGreeter.java',
      caption: '`-d` chooses the output directory; `-cp` tells the compiler where to find classes it needs. After this, `Greeter.class` is in `lib/` and `UseGreeter.class` is in `app/`.',
    },

    {
      type: 'terminal',
      heading: 'Run it with the wrong classpath',
      command: 'java -cp /tmp/cpdemo/app UseGreeter',
      output: [
        'Exception in thread "main" java.lang.NoClassDefFoundError: Greeter',
        '\tat UseGreeter.main(UseGreeter.java:8)',
        'Caused by: java.lang.ClassNotFoundException: Greeter',
        '\tat java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:641)',
      ].join('\n'),
      caption: 'Read that stack trace carefully — it contains both errors, and their relationship is the lesson.',
    },

    {
      type: 'callout',
      tone: 'note',
      heading: '`NoClassDefFoundError` vs `ClassNotFoundException` — a standard interview question',
      body: [
        '**`ClassNotFoundException`** is a checked exception thrown when something *asked for a class by name* and the class loader could not find it on the classpath. It is the direct "I looked, it is not there" failure.',
        '**`NoClassDefFoundError`** is an `Error`, thrown when the class *was present when this code was compiled* but is missing or unloadable now. `UseGreeter` compiled fine — `Greeter` was on the compile classpath — so the JVM expects it to exist at run time and fails hard when it does not.',
        'The `Caused by:` chain above shows exactly this: the lookup failed with `ClassNotFoundException`, and because the reference was compiled in, that surfaced as `NoClassDefFoundError`. In one sentence: **`ClassNotFoundException` means somebody asked for it; `NoClassDefFoundError` means somebody depended on it.**',
      ],
    },

    {
      type: 'terminal',
      heading: 'Run it with the right classpath',
      command: 'java -cp /tmp/cpdemo/app:/tmp/cpdemo/lib UseGreeter\njava -cp /tmp/cpdemo/app:/tmp/cpdemo/lib UseGreeter Ada',
      output: 'Hello, world!\nHello, Ada!',
      caption: 'Both directories on the classpath, and the program runs. The second invocation passes a command-line argument — Chapter 4 covers `args` properly.',
    },

    {
      type: 'prose',
      heading: 'JAR files: a classpath entry you can hand to someone',
      body: [
        'A JAR is a ZIP archive of class files plus a `META-INF/MANIFEST.MF` describing it. That is genuinely all it is — you can unzip one. Its purpose is distribution: one file instead of a directory tree, and one classpath entry instead of many.',
      ],
    },

    {
      type: 'terminal',
      heading: 'Package it, then try to run it',
      command: 'jar --create --file app.jar -C app . -C lib .\njar --list --file app.jar\njava -jar app.jar',
      output: [
        'META-INF/',
        'META-INF/MANIFEST.MF',
        'UseGreeter.class',
        'Greeter.class',
        '',
        'no main manifest attribute, in app.jar',
      ].join('\n'),
      caption: 'The JAR is built and contains both classes — but `java -jar` fails. This is one of the most common "my JAR does not work" reports, and the message says exactly what is wrong if you know what a manifest attribute is.',
    },

    {
      type: 'terminal',
      heading: 'The same JAR works as a classpath entry',
      command: 'java -cp app.jar UseGreeter',
      output: 'Hello, world!',
      caption: 'Nothing is wrong with the archive. `java -cp` was told which class to run, on the command line. `java -jar` was not — and it refuses to guess.',
    },

    {
      type: 'terminal',
      heading: 'Give the manifest a `Main-Class`',
      command: 'jar --create --file runnable.jar --main-class UseGreeter -C app . -C lib .\njava -jar runnable.jar\njava -jar runnable.jar Grace',
      output: 'Hello, world!\nHello, Grace!',
      caption: 'Now `java -jar` knows where to start.',
    },

    {
      type: 'terminal',
      heading: 'What that actually wrote',
      command: 'jar --extract --file runnable.jar META-INF/MANIFEST.MF && cat META-INF/MANIFEST.MF',
      output: 'Manifest-Version: 1.0\nCreated-By: 21.0.10 (Ubuntu)\nMain-Class: UseGreeter',
      caption: 'Three lines of text. `Main-Class` is the entire difference between the two JARs.',
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: '`java -jar` ignores `-cp`',
      body: [
        'When you use `java -jar`, the classpath comes from the JAR’s manifest (`Class-Path`), and any `-cp` on the command line is **ignored**. Mixing the two is a common source of confusion: the flag is accepted and then quietly has no effect.',
        'Dependency management at real scale is Maven’s job — Module 29.',
      ],
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'A shortcut worth knowing',
      body: [
        'Since Java 11 you can run a single source file directly, with no separate compile step: `java HelloJava.java`. The JVM compiles it in memory and runs it. This was verified here on JDK 21.',
        'Interestingly, that route does **not** enforce the "public class must match the file name" rule that `javac` does — a file named `Mismatch.java` containing `public class TotallyDifferent` runs fine this way, and fails under `javac`. It is a convenience for scratch programs, not a replacement for compilation.',
      ],
    },
  ],

  guidedLab: {
    heading: 'Guided lab — break it, read the error, fix it',
    intro: 'Type these yourself rather than copying. The goal is not the working program at the end; it is recognising each failure by sight, because you will meet all four in your first week of Java.',
    steps: [
      {
        instruction: 'Create `Lab.java` containing a `public class Lab` with a `main` that prints `Lab step 1`. Compile and run it.',
        command: 'javac Lab.java\njava Lab',
        expected: 'Lab step 1',
        note: 'Baseline. If this does not work, nothing after it will.',
      },
      {
        instruction: 'Now rename the *file* to `Broken.java` without changing the class name, and compile.',
        command: 'mv Lab.java Broken.java\njavac Broken.java',
        expected: 'Broken.java:1: error: class Lab is public, should be declared in a file named Lab.java\npublic class Lab {\n       ^\n1 error',
        note: 'A public class must live in a file named after it. Rename the file back before continuing.',
      },
      {
        instruction: 'With `Lab.class` built, try to run it by its file name instead of its class name.',
        command: 'java Lab.class',
        expected: 'Error: Could not find or load main class Lab.class\nCaused by: java.lang.ClassNotFoundException: Lab.class',
        note: '`java` takes a *class* name, not a file name. It dutifully looked for a class called `Lab.class` and did not find one.',
      },
      {
        instruction: 'Change directory somewhere else and run it again, without setting a classpath.',
        command: 'cd /tmp && java Lab',
        expected: 'Error: Could not find or load main class Lab\nCaused by: java.lang.ClassNotFoundException: Lab',
        note: 'The default classpath is the current directory. Move away and the class disappears. Fix it with `java -cp <dir> Lab`.',
      },
      {
        instruction: 'Finally, look at what you built.',
        command: 'javap -c Lab.class',
        expected: 'A listing showing a default constructor you never wrote, plus the bytecode for main.',
        note: 'Compare it against the `HelloJava` listing earlier in this chapter.',
      },
    ],
  },

  commonMistakes: [
    {
      mistake: 'Running `java Main.class` instead of `java Main`.',
      why: 'The `java` launcher takes a fully qualified *class* name and resolves it against the classpath. `Main.class` is read as a class named `class` inside a package named `Main`.',
      realError: 'Error: Could not find or load main class Main.class\nCaused by: java.lang.ClassNotFoundException: Main.class',
      fix: 'Drop the extension: `java Main`.',
    },
    {
      mistake: 'Naming the file differently from the public class.',
      why: 'The language requires a public top-level type to be declared in a file of the same name. `javac` enforces it before it looks at anything else.',
      realError: 'Wrong.java:1: error: class Right is public, should be declared in a file named Right.java',
      fix: 'Rename the file to match the class, or drop `public` from the class.',
    },
    {
      mistake: 'Assuming the classpath includes subdirectories, or that it defaults to "everything nearby".',
      why: 'The classpath is an explicit, ordered list. Its default is the current directory only — not its children, and not where the source happened to be.',
      realError: 'Exception in thread "main" java.lang.NoClassDefFoundError: Greeter',
      fix: 'Pass every directory and JAR you need: `java -cp app:lib UseGreeter`.',
    },
    {
      mistake: 'Expecting `java -jar` to work on any JAR containing a `main` method.',
      why: '`java -jar` reads the entry point from the manifest’s `Main-Class`. Without it the launcher has no idea which class to start, and there may be many candidates.',
      realError: 'no main manifest attribute, in app.jar',
      fix: 'Build with `--main-class`, or run it as a classpath entry: `java -cp app.jar UseGreeter`.',
    },
    {
      mistake: 'Passing `-cp` alongside `-jar` and expecting it to add dependencies.',
      why: 'With `-jar`, the launcher takes the classpath from the manifest and ignores `-cp` entirely. The flag is accepted, which makes the failure look mysterious.',
      realError: 'Typically a NoClassDefFoundError for a class you believe you put on the classpath.',
      fix: 'Use `java -cp <jar>:<deps> <MainClass>`, or declare `Class-Path` in the manifest. At real scale, use Maven (Module 29).',
    },
    {
      mistake: 'Treating "platform independent" as "my application is portable".',
      why: 'Portability is a property of the class file format. Your file paths, encodings, and line endings are yours.',
      realError: null,
      fix: 'Keep platform assumptions out of code — Module 13 covers `Path` and the I/O APIs that do this properly.',
    },
  ],

  interviewQuestions: [
    {
      category: 'Fundamental',
      question: 'What is the difference between the JDK, the JRE, and the JVM?',
      answer: 'The JVM is the abstract machine that executes bytecode — a specification with multiple implementations. The JRE is a JVM plus the standard class library, which is everything needed to *run* a Java program. The JDK is the JRE plus development tools (`javac`, `javap`, `jar`, `jdb`), which is what you need to *compile*. They nest: JDK ⊃ JRE ⊃ JVM. Since JDK 11 a standalone JRE is generally not distributed separately; you take the JDK and use `jlink` if you need a smaller runtime.',
    },
    {
      category: 'Fundamental',
      question: 'Is Java compiled or interpreted?',
      answer: 'Both, at different stages. `javac` compiles source to bytecode ahead of time — that is a real compilation with full type checking. At run time the JVM initially interprets the bytecode, then the JIT compiler compiles frequently executed paths to native machine code while the program runs. So it is compiled to bytecode statically and compiled to machine code dynamically, with interpretation covering the gap. Answering just "compiled" or just "interpreted" misses the design.',
    },
    {
      category: 'Tricky',
      question: 'What is the difference between `ClassNotFoundException` and `NoClassDefFoundError`?',
      answer: '`ClassNotFoundException` is a checked exception raised when code explicitly asks for a class by name — typically `Class.forName` or a class loader call — and it is not on the classpath. `NoClassDefFoundError` is an `Error` raised when a class that was present at compile time is absent or unloadable at run time; the reference was compiled in, so the JVM expected it. A useful shorthand: the exception means somebody *asked* for the class, the error means somebody *depended* on it. They often appear together, with the exception as the `Caused by:` of the error.',
    },
    {
      category: 'Practical',
      question: 'A colleague says their JAR "does not run" and shows you `no main manifest attribute`. What is wrong and what are the fixes?',
      answer: 'They used `java -jar`, and the JAR’s `META-INF/MANIFEST.MF` has no `Main-Class` entry, so the launcher does not know where to start. Nothing is wrong with the classes themselves. Two fixes: rebuild the JAR with an entry point (`jar --create --file app.jar --main-class com.example.Main …`, or the equivalent Maven configuration), or bypass the manifest entirely and run it as a classpath entry: `java -cp app.jar com.example.Main`. Worth adding: `-cp` is ignored when `-jar` is used, so adding dependencies that way will not work.',
    },
    {
      category: 'Advanced',
      question: 'You compiled on a newer JDK and get `UnsupportedClassVersionError` on the server. Explain the mechanism and the correct fix.',
      answer: 'Every class file records a major version in its header — 61 for Java 17, 65 for Java 21. A JVM refuses to load a class file whose major version is higher than it supports, because it may contain constructs it cannot verify. So the deployment JVM is older than the compiling JDK. The correct fix is `javac --release <target>`, which both targets the older class file version *and* compiles against that release’s API, so you cannot accidentally call a method that does not exist on the target. The older `-source`/`-target` pair only sets versions and will happily let you link against newer APIs, producing a `NoSuchMethodError` at run time instead. Alternatively, upgrade the runtime.',
    },
    {
      category: 'Scenario-based',
      question: 'What does "write once, run anywhere" actually guarantee, and where does it break down?',
      answer: 'It guarantees that the compilation artefact — the bytecode in a `.class` file — is portable: the format is specified, and any conforming JVM loads the same bytes on any platform. What it does not guarantee is that your *application* is portable. File path separators, line endings, default character encodings, filesystem case sensitivity, available fonts, thread scheduling, and anything invoked through the shell are all platform-dependent. The JVM is the piece somebody else ported for you; platform assumptions you write into your own code are still yours to fix.',
    },
    {
      category: 'Debugging',
      question: 'A program compiles cleanly but fails at startup with `NoClassDefFoundError` for a class you can see in your source tree. How do you diagnose it?',
      answer: 'Compilation and execution use separate classpaths, and only the compile one was right. Check what `-cp` the run actually used — the class may be in the source tree but not in the output directory or JAR that the launcher searches. Confirm the class file exists where you think (`jar --list`, or look in the output directory), check for a package mismatch putting it under an unexpected path, and if `-jar` is in play remember that `-cp` is ignored. Read the `Caused by:` chain: a `ClassNotFoundException` underneath confirms it is a lookup failure rather than a static initialiser that threw, which produces the same error class for a different reason.',
    },
  ],

  revision: [
    '`javac` produces bytecode for the JVM; `java` starts a JVM and runs it. They are separate programs sharing only the `.class` file.',
    'JDK ⊃ JRE ⊃ JVM. Compile with the JDK, run with any of them.',
    'Every class file starts `0xCAFEBABE`, followed by minor and major version. Major = Java release + 44: **61 = Java 17**, **65 = Java 21** (both measured here).',
    '`UnsupportedClassVersionError` means the class file is newer than the JVM. Fix with `--release`, not `-source`/`-target`.',
    'WORA is a claim about the bytecode, not about your application’s platform assumptions.',
    'The classpath is an explicit ordered list of directories and JARs, defaulting to the current directory only.',
    '`ClassNotFoundException` = somebody asked for it. `NoClassDefFoundError` = somebody depended on it.',
    'A JAR is a ZIP plus a manifest. `java -jar` needs `Main-Class`; `java -cp` does not. `-cp` is ignored when `-jar` is used.',
    '`java Foo.java` runs a single source file directly since Java 11 — handy for scratch work, not a build system.',
  ],

  integration: [
    { text: 'Class loading, its phases, and the class loader hierarchy are the next chapter of this module.', target: '#/module/01-java-foundations-execution-model' },
    { text: 'The interpreter, the JIT compiler, HotSpot, and JVM warm-up are Chapter 3 of this module.', target: '#/module/01-java-foundations-execution-model' },
    { text: '`main`, `String[] args`, `System.out` and `PrintStream`, packages and imports are Chapter 4 of this module — used as tools here, taught there.', target: '#/module/01-java-foundations-execution-model' },
    { text: 'Constructors, including the default constructor visible in the bytecode above, belong to Module 02.', target: '#/module/02-oop-in-java' },
    { text: 'JVM memory layout and garbage collection — the other thing having a runtime buys you — are Module 14.', target: '#/module/14-jvm-memory-garbage-collection' },
    { text: 'Dependency and build management, which is how real projects handle the classpath, is Module 29.', target: '#/module/29-maven-java-project-management' },
    { text: 'Platform-independent file handling with `Path` and the I/O APIs is Module 13.', target: '#/module/13-java-i-o-nio' },
  ],

  verification: {
    jdk: 'javac 21.0.10 / OpenJDK 21.0.10 (build 21.0.10+7-Ubuntu-124.04), Linux',
    date: '2026-08-13',
    note: 'Every command and every output in this chapter was executed on that JDK and its real output recorded. Examples compile with `--release 17` against the Java 17 baseline. Cross-platform execution, Windows path separators, and `UnsupportedClassVersionError` itself were NOT reproduced here — only one platform and one JDK were available.',
  },
};

export default chapter;
