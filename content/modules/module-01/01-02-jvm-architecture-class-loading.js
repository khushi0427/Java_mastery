/**
 * Module 01, Chapter 2 — JVM Architecture & Class Loading.
 *
 * CONTENT IS DATA (docs/ARCHITECTURE.md §4a). No markup here; the renderer is
 * assets/js/chapter-view.js. Section vocabulary: data/chapters.js.
 *
 * ===========================================================================
 * PROVENANCE OF EVERY OUTPUT IN THIS FILE
 * ===========================================================================
 * Every `output` and `realError` below was produced by running the command on
 * 2026-08-13. Nothing is remembered or reconstructed.
 *
 *     javac 21.0.10
 *     openjdk version "21.0.10" 2026-01-20
 *     OpenJDK Runtime Environment (build 21.0.10+7-Ubuntu-124.04)
 *     OpenJDK 64-Bit Server VM (build 21.0.10+7-Ubuntu-124.04, mixed mode, sharing)
 *
 * Sources are in `java/module-01/ch02/`, compiled with `--release 17` against
 * the Java 17 baseline (README §3).
 *
 * Two outputs are environment-dependent and are labelled as such in the text:
 * class-loader `toString()` values contain an identity hash that changes every
 * run, and `-verbose:class` timestamps vary.
 *
 * If you change an example, RE-RUN IT and update the recorded output.
 */

export const chapter = {
  id: '01-02',
  moduleId: '01-java-foundations-execution-model',
  number: 2,
  title: 'JVM Architecture & Class Loading',
  subtitle: 'What happens between `java Main` and your first line of code running — and why so many production failures live in that gap.',

  objectives: [
    'Name the JVM’s major subsystems and say which one is responsible for what.',
    'Walk a class through loading, linking (verification, preparation, resolution) and initialization, and say what each phase can fail with.',
    'Predict whether a given operation triggers class initialization — including the cases that look like they should and do not.',
    'Explain why a `static final` constant can go stale, and recognise the build failure it causes.',
    'Identify which class loader loaded a class, and describe parent delegation and what it protects against.',
    'Diagnose `ExceptionInInitializerError`, `NoClassDefFoundError`, `VerifyError`, `ClassFormatError` and `UnsupportedClassVersionError` from what each one tells you about the phase it came from.',
  ],

  topicsCovered: [
    'JVM architecture',
    'class loading', 'class loading phases',
    'loading', 'linking', 'verification', 'preparation', 'resolution', 'initialization',
    'class loaders', 'bootstrap/platform/application class loaders',
  ],

  topicsDeferred: [
    { topic: 'Execution engine, interpreter, JIT compiler, HotSpot, JVM warm-up', to: 'Module 01, Chapter 3' },
    { topic: '`main()`, command-line arguments, `System.out`, `PrintStream`, packages, imports, naming conventions', to: 'Module 01, Chapter 4' },
    { topic: 'Heap, stack, metaspace layout and garbage collection', to: 'Module 14' },
    { topic: 'Custom class loaders and reflection', to: 'Module 12' },
  ],

  sections: [
    {
      type: 'prose',
      heading: 'The gap this chapter fills',
      body: [
        'Chapter 1 ended with `java HelloJava` producing output. It skipped over everything between the launcher starting and `main` running — which is where a surprising share of real Java problems live.',
        'A class does not simply appear in memory. It is **found**, **checked**, **prepared**, **wired up**, and finally **initialized**, in that order, and each step can fail in its own way with its own error type. Learn the phases and those errors stop being a random collection of names: each one tells you exactly how far the JVM got before it gave up.',
      ],
    },

    {
      type: 'callout',
      tone: 'delta',
      heading: 'Coming from C++',
      body: [
        'C++ resolves symbols at **link time**, before the program exists. By the time you run a binary, every call site has an address, and a missing symbol was a build error.',
        'Java resolves at **run time**, per class, lazily. The JVM finds and links each class the first time it is genuinely needed. That is what makes plugins, dependency injection, and hot reloading possible — and it is also why a Java program can compile perfectly, start fine, and then fail twenty minutes in when it first touches a class that is not there.',
        'There is no equivalent of a static-link step that proves everything is present. The classpath is checked as you go.',
      ],
    },

    {
      type: 'diagram',
      heading: 'The JVM’s subsystems',
      alt: 'The JVM consists of a class loader subsystem, runtime data areas, an execution engine, and a native interface.',
      steps: [
        { label: 'Class loader subsystem', detail: 'Finds, links and initializes classes — this chapter' },
        { label: 'Runtime data areas', detail: 'Heap, stacks, metaspace, PC registers — Module 14' },
        { label: 'Execution engine', detail: 'Interpreter, JIT compiler, GC — Chapter 3 and Module 14' },
        { label: 'Native interface', detail: 'JNI, and the native libraries the JVM itself uses' },
      ],
    },

    {
      type: 'prose',
      heading: 'Three phases, five steps',
      body: [
        'The Java Virtual Machine Specification divides bringing a class into use into **loading**, **linking**, and **initialization**. Linking has three sub-steps of its own, which is where the familiar five-step list comes from.',
        'The order matters and is guaranteed where it is observable. What is *not* guaranteed is exactly when each step happens: an implementation may load and link early, as long as initialization still happens at the right moment and any error is still reported at the point where the class is first actively used.',
      ],
    },

    {
      type: 'diagram',
      heading: 'From class file to usable class',
      alt: 'Loading, then linking which comprises verification, preparation and resolution, then initialization.',
      steps: [
        { label: 'Loading', detail: 'Find the bytes, parse them, create the Class object' },
        { label: 'Verification', detail: 'Prove the bytecode is well-formed and type-safe' },
        { label: 'Preparation', detail: 'Allocate static fields, set them to DEFAULT values' },
        { label: 'Resolution', detail: 'Turn symbolic references into direct ones (may be lazy)' },
        { label: 'Initialization', detail: 'Run static initializers — your code, finally' },
      ],
    },

    {
      type: 'prose',
      heading: 'Nothing loads until it has to',
      body: [
        'Class loading is lazy. A class the program never actively uses is never loaded at all — the bytes are not read, and its static initializer never runs. This is easy to prove rather than take on trust.',
      ],
    },

    {
      type: 'code',
      heading: 'Three classes, one of them never touched',
      filename: 'java/module-01/ch02/LazyLoading.java',
      language: 'java',
      code: [
        'public class LazyLoading {',
        '',
        '    public static void main(String[] args) {',
        '        System.out.println("main started");',
        '',
        '        // Declaring a reference does NOT load the class.',
        '        Heavy notYet;',
        '        System.out.println("declared a Heavy reference");',
        '',
        '        // This does.',
        '        notYet = new Heavy();',
        '        System.out.println("created a Heavy");',
        '    }',
        '}',
        '',
        'class Heavy {',
        '    static { System.out.println("  >> Heavy static initializer ran"); }',
        '}',
        '',
        'class NeverUsed {',
        '    static { System.out.println("  >> NeverUsed static initializer ran"); }',
        '}',
      ].join('\n'),
      command: 'javac --release 17 LazyLoading.java\njava LazyLoading',
      output: [
        'main started',
        'declared a Heavy reference',
        '  >> Heavy static initializer ran',
        'created a Heavy',
      ].join('\n'),
      caption: 'Two things to notice. `NeverUsed` never prints — it was never loaded. And declaring a `Heavy` variable did not load `Heavy` either; only `new Heavy()` did, which is why the static initializer prints *between* the two other lines rather than before them.',
    },

    {
      type: 'terminal',
      heading: 'Confirming it at the JVM level',
      command: 'java -verbose:class LazyLoading | grep -E "\\[class,load\\] (Heavy|NeverUsed|LazyLoading) "',
      output: [
        '[0.055s][info][class,load] LazyLoading source: file:/…/java/module-01/ch02/',
        '[0.056s][info][class,load] Heavy source: file:/…/java/module-01/ch02/',
      ].join('\n'),
      caption: '`-verbose:class` reports every class the JVM loads. `NeverUsed` is absent — not skipped, not deferred, simply never read from disk. (Timestamps vary between runs, and the paths are shortened here.)',
    },

    {
      type: 'prose',
      heading: 'Loading: who finds the bytes',
      body: [
        'Loading is the step that turns a name like `java.util.HashMap` into bytes and then into a `Class` object. **Which loader does it matters**, because a class’s identity in the JVM is its name *plus* its defining loader — the same bytes loaded by two different loaders produce two incompatible types.',
        'Java has three built-in loaders in a parent-child chain.',
      ],
    },

    {
      type: 'table',
      heading: 'The three built-in class loaders',
      columns: ['Loader', 'Loads', 'Written in', '`getClassLoader()` returns'],
      rows: [
        ['**Bootstrap**', 'Core platform classes — `java.lang`, `java.util`, and the rest of `java.base`', 'Native code, part of the JVM', '`null` — it is not a Java object'],
        ['**Platform**', 'The rest of the JDK’s modules, e.g. `java.sql`, `java.xml`', 'Java', 'A `PlatformClassLoader`'],
        ['**Application**', 'Your classes, and anything else on the classpath', 'Java', 'An `AppClassLoader`'],
      ],
      note: 'A `null` return from `getClassLoader()` does not mean "no loader" — it means the bootstrap loader, which has no Java representation to hand back. This trips people up in code that checks the loader and assumes `null` is an error.',
    },

    {
      type: 'code',
      heading: 'Asking each class who loaded it',
      filename: 'java/module-01/ch02/Loaders.java',
      language: 'java',
      code: [
        'public class Loaders {',
        '',
        '    public static void main(String[] args) {',
        '        show("java.lang.String", String.class);',
        '        show("java.util.ArrayList", java.util.ArrayList.class);',
        '        show("javax.sql.DataSource", javax.sql.DataSource.class);',
        '        show("Loaders (this class)", Loaders.class);',
        '',
        '        System.out.println();',
        '        System.out.println("Delegation chain from the application loader upwards:");',
        '        ClassLoader loader = Loaders.class.getClassLoader();',
        '        while (loader != null) {',
        '            System.out.println("  " + loader);',
        '            loader = loader.getParent();',
        '        }',
        '        System.out.println("  null  <- the bootstrap loader, not a Java object");',
        '    }',
        '',
        '    static void show(String label, Class<?> type) {',
        '        ClassLoader loader = type.getClassLoader();',
        '        System.out.printf("%-22s -> %s%n", label, loader == null ? "null (bootstrap)" : loader);',
        '    }',
        '}',
      ].join('\n'),
      command: 'javac --release 17 Loaders.java\njava Loaders',
      output: [
        'java.lang.String       -> null (bootstrap)',
        'java.util.ArrayList    -> null (bootstrap)',
        'javax.sql.DataSource   -> jdk.internal.loader.ClassLoaders$PlatformClassLoader@6e0be858',
        'Loaders (this class)   -> jdk.internal.loader.ClassLoaders$AppClassLoader@639fee48',
        '',
        'Delegation chain from the application loader upwards:',
        '  jdk.internal.loader.ClassLoaders$AppClassLoader@639fee48',
        '  jdk.internal.loader.ClassLoaders$PlatformClassLoader@6e0be858',
        '  null  <- the bootstrap loader, not a Java object',
      ].join('\n'),
      caption: 'The `@6e0be858` suffixes are identity hashes and differ on every run — do not expect to reproduce those digits. Everything else is stable: three tiers, and `getParent()` walking up to `null`.',
    },

    {
      type: 'terminal',
      heading: 'Where the JVM says each one came from',
      command: 'java -verbose:class Loaders | grep -E "(java\\.lang\\.String|java\\.util\\.ArrayList|javax\\.sql\\.DataSource|Loaders) "',
      output: [
        'java.lang.String source: shared objects file',
        'java.util.ArrayList source: shared objects file',
        'Loaders source: file:/…/java/module-01/ch02/',
        'javax.sql.DataSource source: jrt:/java.sql',
      ].join('\n'),
      caption: 'Three different sources, matching the three loaders. `shared objects file` is the class data sharing archive the JVM ships with, `jrt:/java.sql` is the module image inside the JDK, and the plain `file:` path is your classpath.',
    },

    {
      type: 'prose',
      heading: 'Parent delegation',
      body: [
        'When a loader is asked for a class, it does not look for it itself first. It **asks its parent**, which asks its parent, up to the bootstrap loader. Only if every ancestor fails does the loader try its own sources.',
        'The consequence is that core classes always win. You cannot put your own `java.lang.String` on the classpath and have it used, because the application loader will have delegated to the bootstrap loader, which will have found the real one first. That is a security property, not a convenience: without it, any JAR on the classpath could replace `String`.',
      ],
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'On Java 9+, you are stopped even earlier',
      body: [
        'The textbook demonstration of delegation is to write your own `java.lang.String` and watch it be ignored. On a modern JDK you cannot get that far — the module system rejects it at **compile** time:',
        '`error: package exists in another module: java.base`',
        'So there are now two independent defences: modules stop you declaring the package at all, and delegation would stop the class being used even if you did. Verified on JDK 21.',
      ],
    },

    {
      type: 'prose',
      heading: 'Linking, step 1: verification',
      body: [
        'Once the bytes are loaded, the JVM proves they are safe to run *before* running any of them. Verification checks that the class file is well-formed, that the bytecode does not underflow or overflow the operand stack, that types match at every instruction, that jumps land on real instruction boundaries, and that access rules are respected.',
        'This is why Java can safely run code it did not compile. It is also a real cost at startup — the JVM is doing genuine analysis on every method it links.',
        'The easiest way to see verification working is to hand the JVM a class file that is deliberately wrong.',
      ],
    },

    {
      type: 'code',
      heading: 'A one-byte corrupter, so the failures are reproducible',
      filename: 'java/module-01/ch02/CorruptClass.java',
      language: 'java',
      code: [
        'import java.nio.file.Files;',
        'import java.nio.file.Path;',
        '',
        'public class CorruptClass {',
        '',
        '    public static void main(String[] args) throws Exception {',
        '        if (args.length != 4) {',
        '            System.err.println("Usage: java CorruptClass <in.class> <out.class> <offset> <byte>");',
        '            System.exit(1);',
        '        }',
        '',
        '        byte[] bytes = Files.readAllBytes(Path.of(args[0]));',
        '        int offset = Integer.decode(args[2]);',
        '        int value = Integer.decode(args[3]);',
        '',
        '        System.out.printf("offset %d: 0x%02X -> 0x%02X%n", offset, bytes[offset] & 0xFF, value);',
        '        bytes[offset] = (byte) value;',
        '',
        '        Files.write(Path.of(args[1]), bytes);',
        '        System.out.println("wrote " + args[1]);',
        '    }',
        '}',
      ].join('\n'),
      caption: 'The smallest thing that works. File I/O properly is Module 13; this only needs to read bytes, change one, and write them back.',
    },

    {
      type: 'terminal',
      heading: 'Break the magic number — rejected at loading',
      command: 'java CorruptClass Loaders.class broken/Loaders.class 0 0xDE\njava -cp broken Loaders',
      output: [
        'offset 0: 0xCA -> 0xDE',
        'wrote broken/Loaders.class',
        '',
        'Error: LinkageError occurred while loading main class Loaders',
        '\tjava.lang.ClassFormatError: Incompatible magic value 3741235902 in class file Loaders',
      ].join('\n'),
      caption: '`ClassFormatError` — the file is not a class file at all. Chapter 1 showed those first four bytes as `ca fe ba be`; this is what happens when they are not.',
    },

    {
      type: 'terminal',
      heading: 'Claim a future version — rejected too',
      command: 'java CorruptClass Loaders.class broken/Loaders.class 7 0xFF\njava -cp broken Loaders',
      output: [
        'Error: LinkageError occurred while loading main class Loaders',
        '\tjava.lang.UnsupportedClassVersionError: Loaders has been compiled by a more recent'
        + ' version of the Java Runtime (class file version 255.0), this version of the Java'
        + ' Runtime only recognizes class file versions up to 65.0',
      ].join('\n'),
      caption: 'Chapter 1 explained this error from the version number in the header but could not reproduce it, because that would need two JDKs. Corrupting the version byte produces it on one. Note the runtime naming its own ceiling: **65.0**, which is Java 21 — the JDK these examples were verified on.',
    },

    {
      type: 'terminal',
      heading: 'Break the bytecode — rejected by the verifier',
      command: '# change a return opcode (0xB1) into an ireturn (0xAC) in a void method\njava CorruptClass Tiny.class broken/Tiny.class 348 0xAC\njava -cp broken Tiny',
      output: [
        'Error: Unable to initialize main class Tiny',
        'Caused by: java.lang.VerifyError: Operand stack underflow',
        'Exception Details:',
        '  Location:',
        '    Tiny.<init>()V @4: ireturn',
        '  Reason:',
        '    Attempt to pop empty stack.',
        '  Current Frame:',
        '    bci: @4',
        '    flags: { }',
        '    locals: { \'Tiny\' }',
        '    stack: { }',
        '  Bytecode:',
        '    0000000: 2ab7 0001 ac',
      ].join('\n'),
      caption: 'This is the verifier doing its job, and the report is remarkably detailed: the method, the instruction offset, the reason, the state of the frame, and the raw bytes. `2a b7 0001 ac` is `aload_0`, `invokespecial #1`, `ireturn` — a constructor trying to return an int. **The class never ran.** Verification happens before initialization, so the failure arrives before any of your code does.',
    },

    {
      type: 'prose',
      heading: 'Linking, step 2: preparation',
      body: [
        'Preparation allocates memory for static fields and sets them to their **default** values — `0`, `0L`, `false`, `\\u0000`, `null`. It does **not** run any initializer you wrote. That happens later, during initialization.',
        'This distinction is invisible most of the time and then suddenly is not, because a static initializer can observe a field that has been prepared but not yet initialized.',
      ],
    },

    {
      type: 'code',
      heading: 'Catching a field between preparation and initialization',
      filename: 'java/module-01/ch02/Preparation.java',
      language: 'java',
      code: [
        'class Counter {',
        '    // Runs during INITIALIZATION and reads later, which preparation has',
        '    // already set to its default.',
        '    static int counter = report();',
        '',
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
      command: 'javac --release 17 Preparation.java\njava Preparation',
      output: [
        '  initializer running; later = 0',
        '  static block; counter = 1, later = 99',
        'counter is now 1',
      ].join('\n'),
      caption: '`later = 0` on the first line. Not because it is uninitialized memory — because preparation deliberately set it to the `int` default, and `later`’s own initializer has not run yet. By the static block, both have their real values.',
    },

    {
      type: 'terminal',
      heading: 'What the compiler actually generated',
      command: 'javap -c -p Counter.class',
      output: [
        '  static {};',
        '    Code:',
        '       0: invokestatic  #29                 // Method report:()I',
        '       3: putstatic     #33                 // Field counter:I',
        '       6: bipush        99',
        '       8: putstatic     #13                 // Field later:I',
        '      11: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;',
        '      14: getstatic     #33                 // Field counter:I',
        '      17: getstatic     #13                 // Field later:I',
        '      20: invokedynamic #36,  0             // InvokeDynamic #1:makeConcatWithConstants:(II)Ljava/lang/String;',
        '      25: invokevirtual #23                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V',
        '      28: return',
      ].join('\n'),
      caption: 'There is no "static block" construct at the bytecode level. The compiler merged **every** static field initializer and **every** static block into one method called `<clinit>`, in the order they appear in the source. That single fact explains all of Java’s static initialization ordering rules — including the next one.',
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: 'Illegal forward reference',
      body: [
        'Because `<clinit>` runs top to bottom, reading a static field *declared below* the current point by its simple name is a compile error, not a runtime surprise:',
        '`error: illegal forward reference`',
        'Writing to it is allowed, and so is reading it through a **qualified** name — `Ordered.second` compiles and yields the prepared default. The compiler is preventing the accidental case while leaving the deliberate one available. Verified both ways.',
      ],
    },

    {
      type: 'prose',
      heading: 'Linking, step 3: resolution',
      body: [
        'Compiled bytecode refers to other classes, methods and fields **symbolically** — by name and descriptor, as you saw in the `javap` output above where every call is a `#` index into the constant pool. Resolution replaces those symbolic references with direct ones.',
        'The specification deliberately allows this to be **lazy**: a reference may be resolved the first time the instruction executes rather than when the class is linked. That is why a program can run for a long time and only then throw `NoSuchMethodError` — the call site had never been reached before, so its reference had never been resolved.',
        'It is also why "it compiled" and "it links at run time" are separate claims in Java. Compile against one version of a library, run against another with a method removed, and the mismatch is found at the moment that call site first executes.',
      ],
    },

    {
      type: 'prose',
      heading: 'Initialization: when your code finally runs',
      body: [
        'Initialization runs `<clinit>` — static field initializers and static blocks. The specification is precise about when this happens, and the rules are worth knowing exactly, because several plausible-looking operations do **not** trigger it.',
        'A class is initialized on first *active use*: creating an instance, invoking a static method, reading or assigning a non-constant static field, reflection that asks for initialization, or initializing a subclass (which initializes its superclass first).',
      ],
    },

    {
      type: 'code',
      heading: 'Five operations, only some of which initialize',
      filename: 'java/module-01/ch02/InitTriggers.java',
      language: 'java',
      code: [
        'class WithConstant {',
        '    static final int CONSTANT = 42;',
        '    static { System.out.println("   >> WithConstant initialized"); }',
        '}',
        '',
        'class WithComputed {',
        '    static final Integer COMPUTED = Integer.valueOf(42);',
        '    static { System.out.println("   >> WithComputed initialized"); }',
        '}',
        '',
        'class Sleeper {',
        '    static { System.out.println("   >> Sleeper initialized"); }',
        '}',
        '',
        'class Parent {',
        '    static String parentField = "from Parent";',
        '    static { System.out.println("   >> Parent initialized"); }',
        '}',
        '',
        'class Child extends Parent {',
        '    static { System.out.println("   >> Child initialized"); }',
        '}',
      ].join('\n'),
      command: 'javac --release 17 InitTriggers.java\njava InitTriggers',
      output: [
        '1. read a compile-time constant:',
        '   value = 42',
        '2. read a static final that is NOT a compile-time constant:',
        '   >> WithComputed initialized',
        '   value = 42',
        '3. create an array of a type:',
        '   array length = 3',
        '4. read a static field the SUBCLASS inherited:',
        '   >> Parent initialized',
        '   value = from Parent',
        '5. instantiate the subclass:',
        '   >> Child initialized',
      ].join('\n'),
      caption: 'Four results worth memorising. **(1)** Reading a compile-time constant did not initialize the class at all. **(3)** Creating an array of a type does not initialize that type — the array class is created, the element class is not. **(4)** Reading an inherited static field initialized `Parent` but **not** `Child`: a static field belongs to the class that declares it. **(5)** Only instantiating `Child` initialized `Child`.',
    },

    {
      type: 'terminal',
      heading: 'Why case 1 behaves that way',
      command: 'javap -c InitTriggers.class',
      output: [
        '       8: getstatic     #7    // Field java/lang/System.out:Ljava/io/PrintStream;',
        '      11: ldc           #23   // String    value = 42',
        '      13: invokevirtual #15   // Method java/io/PrintStream.println:(Ljava/lang/String;)V',
      ].join('\n'),
      caption: 'There is no reference to `WithConstant` anywhere in this bytecode. A `static final` field with a constant initializer of a primitive or `String` type is a **compile-time constant**: the compiler substitutes its value at every use site, then folds the whole concatenation into the single literal `"   value = 42"`. At run time there is nothing left to trigger initialization, because there is nothing left pointing at the class.',
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: 'The stale constant — a real build trap',
      body: [
        'Constant inlining has a consequence that bites teams regularly: **changing a constant and recompiling only its own file leaves every other class holding the old value.**',
        'The value is not read from `Config` at run time. It was copied into the caller’s bytecode when the caller was compiled, so the caller has to be recompiled too.',
      ],
    },

    {
      type: 'terminal',
      heading: 'Reproducing it',
      command: [
        '# Config.java has: public static final int TIMEOUT = 30;',
        'javac --release 17 Config.java UsesConfig.java && java UsesConfig',
        '',
        '# change TIMEOUT to 60, then recompile ONLY Config',
        'javac --release 17 Config.java && java UsesConfig',
        '',
        '# now recompile the caller too',
        'javac --release 17 UsesConfig.java && java UsesConfig',
      ].join('\n'),
      output: [
        'timeout = 30',
        'timeout = 30      <- Config says 60, but UsesConfig was not recompiled',
        'timeout = 60',
      ].join('\n'),
      caption: 'The middle line is the trap: the source says 60 and the program prints 30. Incremental builds that only recompile changed files hit this, and so does replacing one JAR in a deployment. `javap` on the caller shows why — the string was already folded to `timeout = 60` once recompiled, and to `timeout = 30` before. If a constant must be changeable without recompiling its users, do not make it a compile-time constant: a `static final Integer`, or a value read through a method, is resolved at run time instead.',
    },

    {
      type: 'prose',
      heading: 'When initialization fails',
      body: [
        'A static initializer is code, and code can throw. The JVM’s handling of that is specified precisely and catches people out, because **the first failure and every subsequent one look completely different**.',
      ],
    },

    {
      type: 'code',
      heading: 'Using a class whose initializer throws — twice',
      filename: 'java/module-01/ch02/InitFailure.java',
      language: 'java',
      code: [
        'class Broken {',
        '    static final int VALUE;',
        '',
        '    static {',
        '        System.out.println("  Broken static initializer starting");',
        '        if (true) throw new IllegalStateException("configuration missing");',
        '        VALUE = 1;',
        '    }',
        '',
        '    static void use() {',
        '        System.out.println("  Broken.use() called, VALUE = " + VALUE);',
        '    }',
        '}',
      ].join('\n'),
      command: 'javac --release 17 InitFailure.java\njava InitFailure',
      output: [
        'attempt 1:',
        '  Broken static initializer starting',
        '  caught java.lang.ExceptionInInitializerError',
        '  caused by java.lang.IllegalStateException: configuration missing',
        'attempt 2:',
        '  caught java.lang.NoClassDefFoundError',
        '  caused by java.lang.ExceptionInInitializerError: Exception'
        + ' java.lang.IllegalStateException: configuration missing [in thread "main"]',
      ].join('\n'),
      caption: 'On the first use the initializer runs, throws, and the JVM wraps it in `ExceptionInInitializerError` — the original exception is right there as the cause. The class is then marked **erroneous**, permanently. On the second use the initializer does **not** run again (notice the missing "starting" line), and the JVM reports `NoClassDefFoundError` instead.',
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: '`NoClassDefFoundError` means two different things',
      body: [
        'Chapter 1 met this error as "a class that was present at compile time is missing at run time". Here it means something else entirely: **the class is present, but its initialization already failed.**',
        'That is why chasing a `NoClassDefFoundError` by checking the classpath sometimes leads nowhere. If it is the second kind, the real cause was an `ExceptionInInitializerError` that happened earlier — possibly in a different thread, possibly logged and swallowed, and the stack trace you are holding is from long after the damage.',
        '**Always read the `Caused by:` chain, and look for the first failure in the logs, not the loudest one.** In a static-heavy codebase — configuration singletons, driver registration, logging setup — this is a routine debugging pattern rather than an exotic one.',
      ],
    },

    {
      type: 'prose',
      heading: 'Loading without initializing',
      body: [
        'Because loading and initialization are separate, you can do one without the other. Frameworks that scan the classpath rely on this: they want to *look at* classes without running anyone’s static initializers.',
      ],
    },

    {
      type: 'code',
      heading: 'Three ways to get a `Class` object, two behaviours',
      filename: 'java/module-01/ch02/ForNameVsLoadClass.java',
      language: 'java',
      code: [
        'ClassLoader loader = ForNameVsLoadClass.class.getClassLoader();',
        '',
        '// loads, does NOT initialize',
        'Class<?> alpha = loader.loadClass("Alpha");',
        '',
        '// loads AND initializes',
        'Class<?> beta = Class.forName("Beta");',
        '',
        '// loads, does NOT initialize - the boolean is the initialize flag',
        'Class<?> gamma = Class.forName("Gamma", false, loader);',
      ].join('\n'),
      command: 'javac --release 17 ForNameVsLoadClass.java\njava ForNameVsLoadClass',
      output: [
        '1. loader.loadClass("Alpha") - loads, does not initialize',
        '   loaded: Alpha',
        '2. Class.forName("Beta") - loads AND initializes',
        '   >> Beta initialized',
        '   loaded: Beta',
        '3. Class.forName("Gamma", false, loader) - initialize = false',
        '   loaded: Gamma',
        '4. now touch Alpha for real',
        '   >> Alpha initialized',
      ].join('\n'),
      caption: 'The single-argument `Class.forName` initializes; `ClassLoader.loadClass` and the three-argument `forName` with `initialize = false` do not. Step 4 shows `Alpha` was genuinely only loaded — its initializer ran later, when the class was actually used. This is exactly the distinction the old JDBC idiom `Class.forName("com.mysql.jdbc.Driver")` depended on: the point was never the `Class` object, it was the side effect of running the driver’s static block.',
    },
  ],

  guidedLab: {
    heading: 'Guided lab — watch the phases happen',
    intro: 'Type these rather than copying. Each step makes one phase visible; the value is in seeing the boundary between them, not in the finished program.',
    steps: [
      {
        instruction: 'Create `Lab.java` with a `main` that prints `start`, and a second class `Later` whose static block prints `Later initialized`. Do not use `Later` at all. Run it.',
        command: 'javac --release 17 Lab.java\njava Lab',
        expected: 'start',
        note: '`Later` is compiled — `Later.class` exists on disk — but never loaded. Compilation and loading are unrelated.',
      },
      {
        instruction: 'Confirm that at the JVM level.',
        command: 'java -verbose:class Lab | grep Later',
        expected: '(no output)',
        note: 'Nothing. Now add `new Later();` to `main`, recompile, and run the same grep — the line appears.',
      },
      {
        instruction: 'Add a static field `static int n = report();` above the static block, where `report()` prints the current value of a field declared *below* it. Use a qualified name for the read.',
        command: 'javac --release 17 Lab.java\njava Lab',
        expected: 'The field declared below prints as 0.',
        note: 'That zero is preparation. Try changing the qualified read to a simple name and recompile — `error: illegal forward reference`.',
      },
      {
        instruction: 'Look at what the compiler built from your static field and static block.',
        command: 'javap -c -p Later.class',
        expected: 'A single static {} method containing both, in source order.',
        note: 'There is no separate "static block" at the bytecode level — only `<clinit>`.',
      },
      {
        instruction: 'Make the static block throw, then call something on `Later` twice inside a try/catch that prints the exception class each time.',
        command: 'javac --release 17 Lab.java\njava Lab',
        expected: 'First: java.lang.ExceptionInInitializerError\nSecond: java.lang.NoClassDefFoundError',
        note: 'Two different errors for the same broken class. The second is the one you will meet in production, long after the first was swallowed.',
      },
      {
        instruction: 'Finally, break the class file and watch linking reject it.',
        command: 'javac --release 17 CorruptClass.java\njava CorruptClass Lab.class broken/Lab.class 0 0xDE\njava -cp broken Lab',
        expected: 'java.lang.ClassFormatError: Incompatible magic value …',
        note: 'Try offset 7 with `0xFF` for `UnsupportedClassVersionError`. Both are `LinkageError`s — failures of loading and linking, before any of your code runs.',
      },
    ],
  },

  commonMistakes: [
    {
      mistake: 'Assuming a `NoClassDefFoundError` means the class is missing from the classpath.',
      why: 'It has two causes. One is a compiled-in dependency that is absent (Chapter 1). The other is a class that is present but whose initialization already failed — the JVM marks it erroneous and reports this on every later use.',
      realError: 'java.lang.NoClassDefFoundError: Broken\nCaused by: java.lang.ExceptionInInitializerError: Exception java.lang.IllegalStateException: configuration missing',
      fix: 'Read the `Caused by:` chain. If it names `ExceptionInInitializerError`, the classpath is fine — find the first failure in the logs, which is the real one.',
    },
    {
      mistake: 'Changing a `public static final int` and recompiling only the file it lives in.',
      why: 'A `static final` primitive or `String` with a constant initializer is inlined into every caller at compile time. The callers hold copies, and nothing reads the field at run time.',
      realError: 'No error at all — the program silently uses the old value. That is what makes it dangerous.',
      fix: 'Do a clean build when a constant changes. If a value must be updatable without recompiling users, do not make it a compile-time constant — use a non-constant type or a method.',
    },
    {
      mistake: 'Expecting `getClassLoader()` to be non-null for every class.',
      why: 'Bootstrap-loaded classes return `null`, because the bootstrap loader is native and has no Java object to return. `String.class.getClassLoader()` is `null`.',
      realError: 'Typically a NullPointerException in code that assumed a loader was always available.',
      fix: 'Treat `null` as "the bootstrap loader", not as an error. Fall back to `ClassLoader.getSystemClassLoader()` when you need a real object.',
    },
    {
      mistake: 'Assuming `new Foo[10]` initializes `Foo`.',
      why: 'Creating an array creates the array class, not the element class. No instance of `Foo` exists yet, so there is no active use of it.',
      realError: null,
      fix: 'If you need the static initializer to have run, force it — instantiate one, touch a non-constant static member, or call `Class.forName`.',
    },
    {
      mistake: 'Expecting a subclass to be initialized when you read a static field it inherited.',
      why: 'Static fields belong to the class that declares them. Reading `Child.parentField` is a use of `Parent`, so `Parent` is initialized and `Child` is not.',
      realError: null,
      fix: 'Do not rely on a subclass’s static block running as a side effect of inherited-field access. If order matters, make the dependency explicit.',
    },
    {
      mistake: 'Using `Class.forName(name)` when you only wanted to inspect a class.',
      why: 'The one-argument form initializes it, running arbitrary code from a class you may only have wanted to look at. Classpath scanners that get this wrong can trigger half an application at startup.',
      realError: null,
      fix: 'Use `Class.forName(name, false, loader)` or `loader.loadClass(name)` when you do not want initialization.',
    },
    {
      mistake: 'Reading a `static` field declared further down the file from inside a static block.',
      why: '`<clinit>` runs in source order, so the compiler forbids the simple-name read outright rather than letting you observe a default value by accident.',
      realError: 'Fwd.java:2: error: illegal forward reference',
      fix: 'Move the declaration above the block, or use a qualified name (`Fwd.later`) if you genuinely want the prepared default.',
    },
  ],

  interviewQuestions: [
    {
      category: 'Fundamental',
      question: 'Walk me through the class loading phases.',
      answer: 'Loading, linking, initialization — and linking has three sub-steps. **Loading** finds the bytes for a named class and creates the `Class` object; which loader does this is part of the class’s identity. **Verification** proves the bytecode is well-formed and type-safe: no operand stack underflow, no jumps into the middle of an instruction, no access violations. **Preparation** allocates static fields and sets them to default values — `0`, `false`, `null` — without running any initializer. **Resolution** replaces symbolic references to other classes, methods and fields with direct ones, and the specification permits this to be lazy, which is why `NoSuchMethodError` can appear long after startup. **Initialization** runs `<clinit>`, which the compiler builds from all static field initializers and static blocks in source order. Each phase has its own failure mode, and knowing which error came from which phase tells you how far the JVM got.',
    },
    {
      category: 'Tricky',
      question: 'Does reading `SomeClass.CONSTANT` initialize `SomeClass`?',
      answer: 'It depends entirely on whether it is a compile-time constant. If it is `static final` of a primitive or `String` type with a constant initializer, then no — the compiler inlines the value into the caller, and at run time there is no reference to the class left, so nothing triggers initialization. If it is `static final` but computed, or of any other type such as `Integer`, then it is not a compile-time constant, the read is a genuine field access, and the class is initialized. You can verify which case you have with `javap -c` on the caller: if the class does not appear, it was inlined. This is also the mechanism behind stale constants after a partial rebuild.',
    },
    {
      category: 'Practical',
      question: 'A service throws `NoClassDefFoundError` for a class you can see in the JAR. What is happening?',
      answer: 'Almost certainly its initialization failed earlier. When a static initializer throws, the JVM wraps it in `ExceptionInInitializerError`, marks the class erroneous, and never runs the initializer again — every later use gets `NoClassDefFoundError` instead. The class is present; it is unusable. The fix is to find the *first* failure, which is often much earlier in the logs and may be in another thread. Typical causes are configuration read in a static block, a missing environment variable, or a resource that is not on the classpath at runtime. It is worth checking the classpath too, because the same error name covers the genuinely-missing case, but the `Caused by:` chain distinguishes them immediately.',
    },
    {
      category: 'Advanced',
      question: 'What is parent delegation and what would break without it?',
      answer: 'When a class loader is asked for a class it delegates to its parent first, up the chain to the bootstrap loader, and only searches its own sources if every ancestor fails. Two things depend on this. **Type safety**: a class’s identity is its name plus its defining loader, so without delegation the same class could be loaded twice by different loaders and produce a `ClassCastException` between two apparently identical types. **Security**: core classes always resolve to the real ones, so a JAR on the classpath cannot substitute its own `java.lang.String`. On Java 9 and later the module system adds a second, earlier barrier — declaring a class in `java.lang` fails at compile time with "package exists in another module: java.base". Custom loaders that break delegation deliberately — application servers isolating deployments, OSGi — do so knowing they are taking on the type-identity problem.',
    },
    {
      category: 'Advanced',
      question: 'Why does Java verify bytecode at all, given `javac` already type-checked the source?',
      answer: 'Because the JVM does not trust that the bytecode came from `javac`. A class file can be hand-written, generated at run time, transformed by an agent, downloaded, or corrupted. Verification is what allows the JVM to execute code of unknown provenance without the runtime itself being subvertible — it proves the operand stack is consistent at every instruction, that types match, that jumps land on real boundaries, and that access rules hold. Without it, malformed bytecode could corrupt JVM memory rather than merely failing. You can see it working by patching a byte in a class file: changing a void method’s `return` to `ireturn` yields `VerifyError: Operand stack underflow` complete with the frame state and raw bytes, and the class never runs.',
    },
    {
      category: 'Scenario-based',
      question: 'A framework needs to scan thousands of classes for an annotation without side effects. What must it be careful about?',
      answer: 'It must load without initializing. `Class.forName(name)` — the one-argument form — initializes, which runs arbitrary static blocks in every class it touches; on a large classpath that can start database pools, spawn threads, or throw from code the scan had no business executing. The three-argument `Class.forName(name, false, loader)` and `ClassLoader.loadClass(name)` both load without initializing, which is what a scanner wants. Better still, many frameworks avoid loading altogether and read the class files directly with a bytecode library, since annotations are visible in the constant pool without involving the JVM’s loader at all.',
    },
    {
      category: 'Debugging',
      question: 'How would you find out whether a class is being loaded at all, and from where?',
      answer: '`java -verbose:class` logs every class the JVM loads along with its source, which answers both questions at once and is often faster than reasoning about the classpath. It distinguishes `shared objects file` (the class data sharing archive), `jrt:/<module>` (inside the JDK image), and a plain `file:` or `jar:` URL (your classpath) — so it also tells you *which* loader was responsible. If a class you expect never appears, it is not being used at all, which usually means the code path you think is running is not. If it appears from an unexpected JAR, you have a classpath ordering problem, and the delegation model tells you the first match on the chain wins.',
    },
  ],

  revision: [
    'Three phases: **loading**, **linking** (verification → preparation → resolution), **initialization**.',
    'Loading is **lazy** — an unused class is never read from disk. `-verbose:class` proves it.',
    'Three loaders: bootstrap (native, returns `null`), platform, application. Parent delegation means core classes always win.',
    '**Verification** proves the bytecode is safe; patching a byte yields `VerifyError` with a full frame dump. It runs *before* any of your code.',
    '**Preparation** sets static fields to defaults (`0`, `false`, `null`). Initializers have not run yet.',
    '**Resolution** may be lazy — which is why `NoSuchMethodError` can appear long after startup.',
    '**Initialization** runs `<clinit>`: all static field initializers and static blocks merged in source order.',
    'Triggers: `new`, static method call, non-constant static field access, subclass initialization (parent first). **Not** triggers: compile-time constants, array creation, inherited static field access (initializes the declarer only).',
    'A compile-time constant is **inlined into callers**. Change it and recompile only its own file, and everyone else keeps the old value.',
    'Initializer throws → `ExceptionInInitializerError` once, then `NoClassDefFoundError` forever. Read the `Caused by:` chain.',
    '`Class.forName(n)` initializes; `Class.forName(n, false, loader)` and `loader.loadClass(n)` do not.',
    'Errors by phase: `ClassFormatError` and `UnsupportedClassVersionError` (loading), `VerifyError` (verification), `NoSuchMethodError`/`NoSuchFieldError` (resolution), `ExceptionInInitializerError` (initialization).',
  ],

  integration: [
    { text: 'Chapter 1 covered the class file format, the magic number, and the version header this chapter breaks on purpose.', target: '#/chapter/01-01' },
    { text: 'Chapter 1 also met `NoClassDefFoundError` in its other sense — a compiled-in dependency missing at run time. The two causes are worth holding side by side.', target: '#/chapter/01-01' },
    { text: 'The execution engine, the interpreter, the JIT and JVM warm-up are the next chapter of this module.', target: '#/module/01-java-foundations-execution-model' },
    { text: 'Static and instance initialization order, constructors, and inheritance are Module 02.', target: '#/module/02-oop-in-java' },
    { text: 'Reflection, `Class` objects, and custom class loaders are Module 12.', target: '#/module/12-annotations-enums-reflection' },
    { text: 'Heap, stack and metaspace — where loaded classes and their statics actually live — are Module 14.', target: '#/module/14-jvm-memory-garbage-collection' },
    { text: 'Thread safety of initialization, and why the JVM guarantees `<clinit>` runs once, connects to Module 15.', target: '#/module/15-multithreading-fundamentals' },
    { text: 'Dependency versions and the resolution failures they cause at run time are Module 29.', target: '#/module/29-maven-java-project-management' },
  ],

  verification: {
    jdk: 'javac 21.0.10 / OpenJDK 21.0.10 (build 21.0.10+7-Ubuntu-124.04), Linux',
    date: '2026-08-13',
    note: 'Every program and every command in this chapter was executed on that JDK and its real output recorded, including the deliberately corrupted class files. Examples compile with `--release 17`. Two outputs vary by environment and are labelled inline: class-loader `toString()` identity hashes, and `-verbose:class` timestamps and absolute paths. NOT verified here: behaviour on other JVM implementations, custom class loaders, and the class-data-sharing archive’s contents on other platforms.',
  },
};

export default chapter;
