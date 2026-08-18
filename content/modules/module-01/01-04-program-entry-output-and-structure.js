/**
 * Module 01, Chapter 4 — Program Entry, Output, and Structure.
 *
 * CONTENT IS DATA (docs/ARCHITECTURE.md §4a). Renderer: chapter-view.js.
 *
 * This chapter COMPLETES Module 01. Chapters 1–3 used `main`, `System.out`,
 * packages and imports as tools without teaching them; this is where they are
 * taught properly, which is why it comes last rather than first.
 *
 * ===========================================================================
 * PROVENANCE
 * ===========================================================================
 * Every output and every compiler error below was produced by running the
 * command on 2026-08-13. Nothing is recalled.
 *
 *     javac 21.0.10
 *     OpenJDK Runtime Environment (build 21.0.10+7-Ubuntu-124.04)
 *
 * Sources: `java/module-01/ch04/`, compiled with `--release 17` against the
 * Java 17 baseline (README §3). Object identity hashes in output are replaced
 * with `<hash>` because they change every run; that substitution is the only
 * edit made to any recorded output, and it is labelled where it appears.
 *
 * If you change an example, RE-RUN IT and update the recorded output.
 */

export const chapter = {
  id: '01-04',
  moduleId: '01-java-foundations-execution-model',
  number: 4,
  title: 'Program Entry, Output, and Structure',
  subtitle: 'The signature the launcher insists on, the stream you print to, and the naming rules that decide whether your class can be found at all.',

  objectives: [
    'Write every legal form of `main` and explain which parts the launcher actually requires.',
    'Diagnose the three distinct "main method" launch errors from their wording.',
    'Explain what `System.out` is — the field, its type, and why it can be replaced despite being `final`.',
    'Predict which `println` overload a call resolves to, including the `char[]` case that catches almost everyone.',
    'Use `System.out` and `System.err` deliberately, and know which one a pipe will capture.',
    'Lay out packages so the runtime can find your classes, and explain why `javac` is more forgiving than `java`.',
    'Say precisely what an import does and does not cost, and resolve an ambiguous one.',
  ],

  topicsCovered: [
    'main()', '`public static void main(String[] args)`', 'command-line arguments',
    'System', 'System.out', 'PrintStream', 'standard output',
    'Java naming conventions', 'packages', 'imports',
  ],

  topicsDeferred: [
    { topic: 'Exception handling, `throws`, try-with-resources', to: 'Module 05' },
    { topic: 'Reading input, files, character encodings, and the rest of the I/O API', to: 'Module 13' },
    { topic: 'String formatting and concatenation internals', to: 'Module 04' },
    { topic: 'Access modifiers as a design tool, and class design generally', to: 'Module 02' },
  ],

  sections: [
    {
      type: 'prose',
      heading: 'The chapter that was owed',
      body: [
        'Every example in this module has used `public static void main(String[] args)` and `System.out.println`. They were used as tools and never explained, with a promise that this chapter would explain them. This is that chapter, and it completes Module 01.',
        'Putting it last is deliberate. Explaining `main` before you know what the launcher does with a class, or `System.out` before you know what a `static final` field is prepared to, would have meant teaching the same things twice.',
      ],
    },

    {
      type: 'prose',
      heading: 'What the launcher actually demands',
      body: [
        'The `java` command looks for a very specific method. What is surprising is how much of the canonical signature is *not* required, and how precisely the launcher complains when something is wrong.',
      ],
    },

    {
      type: 'code',
      heading: 'Four entry points, all valid',
      filename: 'java/module-01/ch04/MainSignature.java',
      language: 'java',
      code: [
        'public class MainSignature {',
        '    public static void main(String[] args) { System.out.println("canonical"); }',
        '}',
        '',
        'class VarargsMain    { static public void main(String... args) { System.out.println("varargs, and reordered modifiers"); } }',
        'class CStyleMain     { public static void main(String args[]) { System.out.println("C-style array brackets"); } }',
        'class ExtraModifiers { public static final synchronized void main(String[] a) { System.out.println("extra modifiers are fine"); } }',
      ].join('\n'),
      command: 'javac --release 17 MainSignature.java\njava MainSignature\njava VarargsMain\njava CStyleMain\njava ExtraModifiers',
      output: [
        'canonical',
        'varargs, and reordered modifiers',
        'C-style array brackets',
        'extra modifiers are fine',
      ].join('\n'),
      caption: 'All four launch. `String...` works because varargs compiles to an array parameter — the launcher sees `String[]` either way. `String args[]` is the C-style declaration Java still permits. Modifier order is free, and extra modifiers are ignored. The parameter name is entirely yours: `args` is convention, not requirement.',
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'One modifier now earns a warning',
      body: [
        'Adding `strictfp` to that list compiles, but on Java 17 and later it produces:',
        '`warning: [strictfp] as of release 17, all floating-point expressions are evaluated strictly and \'strictfp\' is not required`',
        'Strict floating-point became the only behaviour in Java 17, so the keyword is now redundant. Observed on JDK 21 compiling with `--release 17`.',
      ],
    },

    {
      type: 'code',
      heading: 'Four that compile and then refuse to launch',
      filename: 'java/module-01/ch04/RejectedMains.java',
      language: 'java',
      code: [
        'class NoPublic { static  void main(String[] args) { System.out.println("x"); } }',
        'class NoStatic { public  void main(String[] args) { System.out.println("x"); } }',
        'class NotVoid  { public static int  main(String[] args) { return 0; } }',
        'class WrongArg { public static void main(int[] args)    { System.out.println("x"); } }',
      ].join('\n'),
      command: 'javac --release 17 RejectedMains.java\njava NoPublic\njava NoStatic\njava NotVoid\njava WrongArg',
      output: [
        'Error: Main method not found in class NoPublic, please define the main method as:',
        '   public static void main(String[] args)',
        '',
        'Error: Main method is not static in class NoStatic, please define the main method as:',
        '   public static void main(String[] args)',
        '',
        'Error: Main method must return a value of type void in class NotVoid, please define the main method as:',
        '   public static void main(String[] args)',
        '',
        'Error: Main method not found in class WrongArg, please define the main method as:',
        '   public static void main(String[] args)',
      ].join('\n'),
      caption: 'Every one of these **compiles cleanly**. They fail at launch, because `main` is only special to the launcher — to the compiler it is an ordinary method. Three distinct messages: *not found* when nothing matches by name and parameter type, *is not static* when a matching method exists but is an instance method, and *must return void* when it matches but returns something.',
    },

    {
      type: 'callout',
      tone: 'delta',
      heading: 'Coming from C++',
      body: [
        'C++ has `int main(int argc, char** argv)` and the return value is the exit status. Java\'s `main` returns `void`, and the exit status comes from `System.exit(n)` or from how the program ended.',
        '`args[0]` is the **first argument**, not the program name. There is no `argv[0]` to skip: the class name went to the launcher, not to your program, so a program run with no arguments receives an array of length 0 — never null.',
        'Command-line splitting is done by the shell before Java sees anything, which Chapter 1 demonstrated with quoted arguments.',
      ],
    },

    {
      type: 'terminal',
      heading: 'How a program ends, and what the shell sees',
      command: 'java ExitCode            # returns normally\njava ExitCode 3          # calls System.exit(3)\njava Throws              # throws from main',
      output: [
        'no args        -> exit 0',
        'System.exit(3) -> exit 3',
        'uncaught throw -> exit 1',
        '',
        '# and the uncaught throw wrote this to stderr, not stdout:',
        'Exception in thread "main" java.lang.IllegalStateException: boom',
        '\tat Throws.main(Throws.java:2)',
      ].join('\n'),
      caption: 'Returning from `main` gives exit status 0. `System.exit(n)` gives `n` and does not return. An uncaught exception gives **1**, and its stack trace goes to **stderr** — which matters the moment anything scripts your program. Exceptions themselves are Module 05.',
    },

    {
      type: 'prose',
      heading: '`System.out` is a field, not a language feature',
      body: [
        'It reads like syntax, but there is nothing special about it. `System` is an ordinary class in `java.lang`, and `out` is an ordinary field on it. You can ask the JDK directly.',
      ],
    },

    {
      type: 'terminal',
      heading: 'The declaration, from the JDK itself',
      command: 'javap java.lang.System',
      output: [
        'public final class java.lang.System {',
        '  public static final java.io.InputStream in;',
        '  public static final java.io.PrintStream out;',
        '  public static final java.io.PrintStream err;',
        '  public static void setOut(java.io.PrintStream);',
        '  public static void setErr(java.io.PrintStream);',
        '  ...',
      ].join('\n'),
      caption: 'Three streams — `in`, `out`, `err` — all `public static final`. And then, immediately below them, `setOut` and `setErr`. **A `final` field with a setter** is the contradiction worth noticing.',
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'How `setOut` changes a `final` field',
      body: [
        'It cannot do it in Java. `setOut` reaches the field through native code inside the JVM, below the level where `final` is enforced — the JVM is allowed to do things your code is not.',
        'It genuinely works, which the redirection example below demonstrates by capturing output into a buffer and then restoring the original stream. This is how test frameworks assert on printed output.',
        'The practical consequence: **`System.out` is not guaranteed to be the terminal.** Code that assumes it is will surprise someone eventually.',
      ],
    },

    {
      type: 'code',
      heading: 'Printing, redirecting, and the error flag',
      filename: 'java/module-01/ch04/Streams.java',
      language: 'java',
      code: [
        'PrintStream original = System.out;',
        'System.out.println("System.out is a " + original.getClass().getName());',
        '',
        '// Replace it, print into a buffer, then put it back.',
        'ByteArrayOutputStream captured = new ByteArrayOutputStream();',
        'System.setOut(new PrintStream(captured, true));',
        'System.out.println("this went into the buffer");',
        'System.setOut(original);',
        'System.out.println("captured was: " + captured.toString().trim());',
        '',
        '// PrintStream never throws IOException. It sets a flag instead.',
        'System.out.println("checkError() = " + System.out.checkError());',
      ].join('\n'),
      command: 'javac --release 17 Streams.java\njava Streams',
      output: [
        '7 System.out is a java.io.PrintStream',
        '9 captured was: 8 this went into the buffer',
        '10 checkError() = false',
      ].join('\n'),
      caption: 'The capture worked and the original was restored. The last line is the one people are caught by: **`PrintStream` swallows `IOException`.** No print method throws it; failures set an internal flag you have to ask for with `checkError()`. That is why `System.out.println` needs no `try`/`catch` while almost everything else in `java.io` does — a convenience that also means a failed write is silent unless you check.',
    },

    {
      type: 'prose',
      heading: 'Two streams, and why the difference matters',
      body: [
        '`System.out` is standard output; `System.err` is standard error. They are separate destinations, and the shell can route them independently. Writing diagnostics to `out` is a small mistake that becomes a large one the moment somebody pipes your program into another.',
      ],
    },

    {
      type: 'terminal',
      heading: 'The same program, three redirections',
      command: 'java Streams            # both\njava Streams 2>/dev/null   # stdout only\njava Streams 2>&1 >/dev/null  # stderr only',
      output: [
        '# both:',
        '1 out',
        '2 err',
        '3 out',
        '4 err',
        '',
        '# stdout only:',
        '1 out',
        '3 out',
        '',
        '# stderr only:',
        '2 err',
        '4 err',
      ].join('\n'),
      caption: 'Interleaved on a terminal, cleanly separable everywhere else. The rule of thumb: **`out` is the program\'s product, `err` is commentary about the run.** A tool whose output is meant to be consumed should keep progress messages, warnings and stack traces off `out`.',
    },

    {
      type: 'prose',
      heading: 'Which `println` did you actually call?',
      body: [
        '`PrintStream` overloads `println` for every primitive, for `String`, for `Object`, and — uniquely — for `char[]`. Overload resolution happens at compile time, and that one extra overload produces the most surprising output in the standard library.',
      ],
    },

    {
      type: 'code',
      heading: 'Four prints, three different behaviours',
      filename: 'java/module-01/ch04/CharArray.java',
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
      command: 'javac --release 17 CharArray.java\njava CharArray',
      output: [
        'Java',
        '[I@<hash>',
        '[Ljava.lang.String;@<hash>',
        'prefix [C@<hash>',
      ].join('\n'),
      caption: 'The identity hashes change every run and are shown as `<hash>`; everything else is verbatim. A `char[]` prints its **characters**. An `int[]` and a `String[]` print the default `Object.toString()` form. And the same `char[]`, concatenated into a string first, prints `[C@<hash>` — because concatenation happens before the call, so the argument is now a `String`.',
    },

    {
      type: 'terminal',
      heading: 'The bytecode settles it',
      command: 'javap -c CharArray.class | grep println',
      output: [
        'invokevirtual  // Method java/io/PrintStream.println:([C)V',
        'invokevirtual  // Method java/io/PrintStream.println:(Ljava/lang/Object;)V',
        'invokevirtual  // Method java/io/PrintStream.println:(Ljava/lang/Object;)V',
        'invokevirtual  // Method java/io/PrintStream.println:(Ljava/lang/String;)V',
      ].join('\n'),
      caption: 'Four calls, three different methods, chosen by the compiler from the static type of the argument: `println(char[])`, `println(Object)` twice, and `println(String)`. Nothing decides at run time. If you want the contents of any other array, `java.util.Arrays.toString` is the answer — Module 07.',
    },

    {
      type: 'prose',
      heading: 'Packages: names, and where the bytes must live',
      body: [
        'A package is a namespace. `package com.example.util;` at the top of a file makes every type in it fully qualified as `com.example.util.Something`, and that fully qualified name is what the runtime resolves against the classpath.',
        'Which means the **directory structure has to match** — but the two tools disagree about how strictly.',
      ],
    },

    {
      type: 'terminal',
      heading: 'Compiled with `-d`, which builds the layout for you',
      command: 'javac --release 17 -d out com/example/util/Helper.java com/example/app/App.java\nfind out -name "*.class"\njava -cp out com.example.app.App',
      output: [
        'out/com/example/app/App.class',
        'out/com/example/util/Helper.class',
        '',
        'from com.example.util',
        'this class: com.example.app.App',
        'package: com.example.app',
      ].join('\n'),
      caption: '`-d out` places each class file in a directory matching its package, which is exactly what the runtime expects to find. `getPackageName()` reports the package back to you.',
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: '`javac` is lenient here; `java` is not',
      body: [
        'Compiling `Helper.java` — which declares `package com.example.util;` — from a directory called `wrongdir` **succeeds**. `javac` writes `Helper.class` right beside the source and says nothing.',
        'Then running it fails: `Error: Could not find or load main class com.example.util.Helper`, caused by `ClassNotFoundException`.',
        'The class file is fine. It is in the wrong place. The runtime looks for `com/example/util/Helper.class` under each classpath entry, and a bare `Helper.class` is not that. **Always compile with `-d`** and let the tool build the layout.',
      ],
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'The default package',
      body: [
        'Every example in Chapters 1–3 omitted a `package` declaration, which puts the class in the **unnamed** (default) package. That is fine for a scratch file and unusable for anything else: a class in the default package **cannot be imported** by a class in a named package. There is no syntax for it.',
        'So the moment a project has more than one file that needs to see another, it needs packages. Real projects put everything in one.',
      ],
    },

    {
      type: 'prose',
      heading: 'Imports: what they actually do',
      body: [
        'An import lets you write `List` instead of `java.util.List`. That is the whole feature. It is a **compile-time abbreviation** and it has no run-time existence at all — which is easy to demonstrate rather than assert.',
      ],
    },

    {
      type: 'terminal',
      heading: 'Three files, same code, three import styles',
      command: '# NoImports.java uses fully qualified names throughout\n# WithImports.java imports java.util.List and java.util.ArrayList\n# WildcardImport.java uses import java.util.*\n\njavac --release 17 NoImports.java WithImports.java WildcardImport.java\njavap -c NoImports.class ; javap -c WithImports.class ; javap -c WildcardImport.class',
      output: [
        'NoImports vs WithImports:      IDENTICAL bytecode',
        'WithImports vs WildcardImport: IDENTICAL bytecode',
        '',
        '# class file sizes differ only by the length of the class name:',
        'NoImports        538 bytes',
        'WithImports      542 bytes',
        'WildcardImport   548 bytes',
      ].join('\n'),
      caption: 'Byte-for-byte identical instructions, after normalising the class name. The constant pool holds the fully qualified `java/util/ArrayList` in all three cases, because **the compiler always emits fully qualified names** — the import only decided what you were allowed to type.',
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: 'The wildcard-import performance myth',
      body: [
        '`import java.util.*` does **not** load every class in `java.util`, does not make your class file bigger in any way that matters, and does not slow anything down. The measurement above is the proof: identical bytecode.',
        'There is still a reason to prefer explicit imports, and it is not performance — it is **ambiguity**, which is real and shown next. Most teams use explicit imports because their IDE writes them anyway.',
      ],
    },

    {
      type: 'terminal',
      heading: 'Where wildcards actually bite',
      command: 'import java.util.*;\nimport java.awt.*;\n// ...\nList list = null;',
      output: [
        'Ambiguous.java:5: error: reference to List is ambiguous',
        '        List list = null;',
        '        ^',
        '  both class java.awt.List in java.awt and interface java.util.List in java.util match',
        '1 error',
      ].join('\n'),
      caption: 'Two wildcard imports, both offering a `List`, and the compiler refuses to guess. The fix is a **single-type import**, which always wins over any wildcard: adding `import java.util.List;` alongside both wildcards compiles and runs.',
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'A wildcard imports one package, not a tree',
      body: [
        '`import java.util.*;` gives you `java.util.List`. It does **not** give you `java.util.concurrent.locks.Lock`:',
        '`error: cannot find symbol / symbol: class Lock`',
        'Package names look hierarchical and are not. `java.util.concurrent` is a different package that merely shares a prefix, and nothing about `java.util` includes it.',
      ],
    },

    {
      type: 'code',
      heading: 'Static imports, for members rather than types',
      filename: 'java/module-01/ch04/StaticImport.java',
      language: 'java',
      code: [
        'import static java.lang.Math.max;',
        'import static java.lang.Math.PI;',
        'import static java.util.Arrays.asList;',
        '',
        'public class StaticImport {',
        '    public static void main(String[] args) {',
        '        System.out.println(max(3, 7));',
        '        System.out.printf("%.5f%n", PI);',
        '        System.out.println(asList("a", "b"));',
        '    }',
        '}',
      ].join('\n'),
      command: 'javac --release 17 StaticImport.java\njava StaticImport',
      output: '7\n3.14159\n[a, b]',
      caption: 'A static import brings a static *member* into scope, so `Math.max` becomes `max`. Used sparingly it reads well — assertion methods in tests are the classic case (Module 37). Used widely it removes the type name that told the reader where a method came from, which is why most style guides keep it to a short list.',
    },

    {
      type: 'callout',
      tone: 'note',
      heading: '`java.lang` is imported for you',
      body: [
        '`String`, `Integer`, `Math`, `System`, `Object`, `Exception` — none of them needs an import, because every compilation unit implicitly imports all of `java.lang`.',
        'That is the only package with this privilege. It is also why a class of your own called `String` is legal but a spectacularly bad idea: yours would shadow the implicit one inside its own package.',
      ],
    },

    {
      type: 'prose',
      heading: 'Naming conventions',
      body: [
        'Java has strong, near-universal naming conventions. The compiler enforces almost none of them — they are a social contract, and the only real cost of breaking them is that every reader of your code pays it.',
      ],
    },

    {
      type: 'table',
      heading: 'The conventions worth internalising',
      columns: ['Kind', 'Convention', 'Example'],
      rows: [
        ['**Package**', 'all lower case, dots, reversed domain', '`com.example.billing`'],
        ['**Class / interface / enum / record**', 'UpperCamelCase, noun', '`InvoiceService`, `Comparable`'],
        ['**Method**', 'lowerCamelCase, usually a verb', '`calculateTotal`'],
        ['**Field / local / parameter**', 'lowerCamelCase, noun', '`itemCount`'],
        ['**Constant** (`static final`)', 'UPPER_SNAKE_CASE', '`MAX_RETRIES`'],
        ['**Type parameter**', 'a single capital letter', '`T`, `E`, `K`, `V`'],
      ],
      note: 'Two are effectively enforced rather than conventional: a public type must match its file name (Chapter 1), and a package must match its directory for the runtime to find it (above). Everything else in this table compiles perfectly if you ignore it.',
    },

    {
      type: 'terminal',
      heading: 'Proof that the compiler does not care',
      command: 'public class badly_named_CLASS {\n    static int Some_Field = 1;\n    static void DoTheThing() { System.out.println("compiles fine, reads badly"); }\n    public static void main(String[] args) { DoTheThing(); }\n}',
      output: 'compiles fine, reads badly',
      caption: 'No error. No warning. Conventions are upheld by people and by tooling — linters, code review, and an IDE that will underline this — not by `javac`. Which is exactly why they have to be learned rather than discovered.',
    },
  ],

  guidedLab: {
    heading: 'Guided lab — break the entry point, then the layout',
    intro: 'Six short experiments. Each one asks you to predict before running; the errors are the content, not an obstacle to it.',
    steps: [
      {
        instruction: 'Write a class with `public static void main(String[] args)` that prints its arguments, and run it with none, then with three, then with one quoted argument containing a space.',
        command: 'javac --release 17 Args.java\njava Args\njava Args a b c\njava Args "one two" three',
        expected: '0 arguments, then 3, then 2 — the quoted pair counts as one.',
        note: 'The shell splits, not Java. `args` is never null; with no arguments its length is 0.',
      },
      {
        instruction: 'Now remove `static` from the signature. Predict what happens, then compile and run.',
        command: 'javac --release 17 Args.java\njava Args',
        expected: 'Compiles cleanly. Then: Error: Main method is not static in class Args',
        note: 'It compiled. `main` is only special to the launcher. Try also removing `public`, and changing `void` to `int`, and compare the three messages.',
      },
      {
        instruction: 'Print a `char[]` and an `int[]` with `println`, then print the same `char[]` again with a string prefix.',
        command: 'javac --release 17 Chars.java\njava Chars',
        expected: 'The characters, then something like [I@1b6d3586, then prefix [C@4554617c',
        note: 'Same array, two outputs. Confirm which overload each call chose with `javap -c`.',
      },
      {
        instruction: 'Write half your output to `System.out` and half to `System.err`, then separate them with the shell.',
        command: 'java Both 2>/dev/null\njava Both 2>&1 >/dev/null',
        expected: 'Only the out lines, then only the err lines.',
        note: 'This is why diagnostics belong on err. Anything that pipes your program will thank you.',
      },
      {
        instruction: 'Give a class `package com.example.demo;` and compile it in a directory that does not match. Then try to run it.',
        command: 'javac --release 17 Demo.java\njava -cp . com.example.demo.Demo',
        expected: 'javac succeeds. java fails with ClassNotFoundException: com.example.demo.Demo',
        note: 'Recompile with `javac --release 17 -d out Demo.java` and run `java -cp out com.example.demo.Demo`. Look at what -d built.',
      },
      {
        instruction: 'Finally, import both `java.util.*` and `java.awt.*` and declare a `List`.',
        command: 'javac --release 17 Clash.java',
        expected: 'error: reference to List is ambiguous',
        note: 'Fix it with a single-type import — which beats any wildcard — and note that this, not performance, is the real argument for explicit imports.',
      },
    ],
  },

  commonMistakes: [
    {
      mistake: 'Assuming a "main method not found" error means the file did not compile.',
      why: '`main` is ordinary to the compiler. A wrong signature compiles perfectly and fails only when the launcher looks for it.',
      realError: 'Error: Main method not found in class NoPublic, please define the main method as:\n   public static void main(String[] args)',
      fix: 'Read which of the three messages you got. *Not found* means name or parameter type; *is not static* means you dropped `static`; *must return void* means you returned something.',
    },
    {
      mistake: 'Expecting `args[0]` to be the program or class name.',
      why: 'A C habit. The class name is consumed by the launcher and never reaches your program.',
      realError: 'Typically an ArrayIndexOutOfBoundsException, or an off-by-one that silently skips the first real argument.',
      fix: '`args[0]` is the first argument. `args.length` is the count. The array is empty, never null, when no arguments are passed.',
    },
    {
      mistake: 'Printing an array with `println` and expecting to see its contents.',
      why: 'Only `char[]` has a dedicated overload. Everything else resolves to `println(Object)` and prints the default `toString()` — a type tag and an identity hash.',
      realError: '[I@1b6d3586',
      fix: '`System.out.println(Arrays.toString(array))`, or `Arrays.deepToString` for nested arrays (Module 07). And be aware that concatenating a `char[]` into a string gives you `[C@…` rather than its characters.',
    },
    {
      mistake: 'Writing progress messages, warnings and stack traces to `System.out`.',
      why: 'Standard output is the program\'s result. Mixing commentary into it corrupts anything that consumes the output.',
      realError: null,
      fix: 'Diagnostics go to `System.err`. In a real application they go to a logging framework, which is Module 38.',
    },
    {
      mistake: 'Assuming a `System.out.println` that "did nothing" must not have run.',
      why: '`PrintStream` swallows `IOException` — no print method throws. A failed write sets an internal flag instead.',
      realError: 'No error at all, which is the problem. System.out.checkError() returns true.',
      fix: 'Call `checkError()` if the write genuinely matters. If you need real error handling on a stream, do not use `PrintStream`.',
    },
    {
      mistake: 'Declaring a package but compiling from a directory that does not match it.',
      why: '`javac` allows it and writes the class file beside the source. The runtime resolves a fully qualified name to a path and will not find it there.',
      realError: 'Error: Could not find or load main class com.example.util.Helper\nCaused by: java.lang.ClassNotFoundException: com.example.util.Helper',
      fix: 'Compile with `-d <dir>` and let `javac` build the directory structure, then put that directory on the classpath.',
    },
    {
      mistake: 'Avoiding `import java.util.*` for performance reasons.',
      why: 'Imports have no run-time existence whatsoever. The bytecode is identical either way — demonstrated in this chapter by comparing compiled output.',
      realError: null,
      fix: 'Choose explicit imports for clarity and to avoid ambiguity between packages, which is a genuine problem. Never for speed.',
    },
    {
      mistake: 'Expecting `import java.util.*` to make `java.util.concurrent` classes available.',
      why: 'A wildcard imports exactly one package. Dotted names look hierarchical but package nesting is not a containment relationship.',
      realError: 'error: cannot find symbol\n  symbol:   class Lock',
      fix: 'Import each package you use. `import java.util.concurrent.locks.*;` is a separate import.',
    },
  ],

  interviewQuestions: [
    {
      category: 'Fundamental',
      question: 'Why is `main` declared `public static void main(String[] args)`?',
      answer: '`public` so the launcher can reach it from outside the class; `static` so it can be invoked without constructing an instance, since nothing has run yet to construct one; `void` because the exit status comes from `System.exit` or from how the program terminates, not from a return value; and `String[]` because the launcher passes the command-line arguments as an array. Some of it is flexible: `String...` works, since varargs compiles to an array; `String args[]` works; modifier order is free and extra modifiers such as `final` or `synchronized` are accepted; and the parameter name is arbitrary. What is not flexible is public, static, void, and a `String[]` parameter — and each of those produces a different launch error.',
    },
    {
      category: 'Tricky',
      question: 'What does `System.out.println(charArray)` print, and why is it different from every other array type?',
      answer: 'It prints the characters — `Java` for `{\'J\',\'a\',\'v\',\'a\'}` — because `PrintStream` declares a dedicated `println(char[])` overload. Every other array type resolves to `println(Object)` and prints the default `Object.toString()`: something like `[I@1b6d3586`. The sharp edge is that concatenating the same `char[]` into a string first gives `[C@…`, because concatenation calls `String.valueOf(Object)` and the argument reaching `println` is now a `String`. Same array, two completely different outputs, decided entirely at compile time by overload resolution — `javap -c` shows which method each call site chose.',
    },
    {
      category: 'Practical',
      question: 'What is the difference between `System.out` and `System.err`, and when does it matter?',
      answer: 'They are separate streams with separate destinations. On a terminal both appear interleaved, so the difference is invisible — and then it matters enormously the moment anything consumes the program\'s output. `out` is the program\'s product; `err` is commentary about the run: progress, warnings, stack traces. A shell can redirect them independently, so a tool that keeps diagnostics on `err` can be piped safely while one that mixes them into `out` corrupts its consumer. Uncaught exceptions already go to `err`, and the JVM exits with status 1. In an application both are usually replaced by a logging framework.',
    },
    {
      category: 'Advanced',
      question: '`System.out` is declared `public static final`. How does `System.setOut` work?',
      answer: 'Not through Java. `setOut` reaches the field through native code inside the JVM, below the level where `final` is enforced — the JVM may do things ordinary code may not. It genuinely works: you can install a `PrintStream` wrapping a `ByteArrayOutputStream`, capture output, and restore the original, which is how test frameworks assert on printed output. The design consequence is worth stating: **`System.out` is not guaranteed to be the terminal.** Code that assumes it is — for instance assuming writes are visible, or cheap, or ordered relative to something else — will eventually surprise someone.',
    },
    {
      category: 'Fundamental',
      question: 'Does `import java.util.*` slow a program down or make the class file bigger?',
      answer: 'No. An import is a compile-time abbreviation that lets you write a simple name instead of a fully qualified one, and it has no run-time existence at all — the compiler always emits fully qualified names into the constant pool. Compiling the same code three ways — fully qualified, explicit imports, wildcard import — produces byte-for-byte identical instructions; the class files differ only by the length of the class name. The real argument for explicit imports is ambiguity: two wildcard imports that both offer a `List` produce `error: reference to List is ambiguous`, and a single-type import is what resolves it.',
    },
    {
      category: 'Practical',
      question: 'A colleague\'s class compiles but fails at run time with `ClassNotFoundException` naming the class they just built. What would you check?',
      answer: 'Most likely a package-versus-directory mismatch. `javac` will happily compile a file declaring `package com.example.util;` from any directory and write the class file beside the source; the runtime resolves the fully qualified name to `com/example/util/Helper.class` under a classpath entry and does not find it. So: check where the class file actually is, check that the classpath root is the directory *above* the package path, and recompile with `-d` so the tool builds the layout. Worth also ruling out the two other causes of this error — a genuinely absent dependency, and a class whose initialization already failed, which Chapter 2 covers.',
    },
    {
      category: 'Scenario-based',
      question: 'You are reviewing code that puts everything in the default package. What do you say?',
      answer: 'That it will stop working as soon as the project grows. A class in the unnamed package cannot be imported by a class in a named package — there is no syntax for it — so the moment anything needs to be organised into packages, the default-package classes become unreachable from it. It also means no namespacing at all, so any two classes with the same simple name collide. Beyond that, packages are how visibility works: package-private is the default access level, and in the default package that means "visible to everything on the classpath", which is not a boundary at all. The fix is cheap early and expensive later.',
    },
  ],

  revision: [
    '`main` must be **public, static, void**, taking `String[]`. `String...` and `String args[]` both work; modifier order and the parameter name are free.',
    'A wrong `main` **compiles**. It fails at launch, with three distinct messages: *not found*, *is not static*, *must return void*.',
    '`args[0]` is the first **argument**. No `argv[0]`. The array is empty, never null.',
    'Exit status: **0** returning normally, **n** from `System.exit(n)`, **1** from an uncaught exception (whose trace goes to `stderr`).',
    '`System.out` is a `public static final PrintStream` field on `java.lang.System` — an ordinary field, not syntax.',
    '`setOut` works despite `final` because the JVM changes it natively. **Never assume `System.out` is the terminal.**',
    '`PrintStream` **swallows `IOException`**; failures set a flag you read with `checkError()`.',
    '`out` is the product, `err` is commentary. A shell separates them; a terminal does not.',
    '`println(char[])` prints characters. Every other array prints `[I@…`. Concatenating a `char[]` first gives `[C@…`.',
    'A package must match the **directory** for the runtime. `javac` is lenient about this; `java` is not. Compile with `-d`.',
    'Classes in the **default package cannot be imported** by anything in a named package.',
    'Imports are a compile-time abbreviation with **zero runtime cost** — identical bytecode, proven by comparison. Prefer explicit imports for ambiguity, not speed.',
    'A single-type import beats any wildcard. A wildcard covers **one package**, not a tree. `java.lang` is implicit.',
    'Naming conventions are enforced by people and tooling, not by `javac` — except the two that are: public type matches file name, package matches directory.',
  ],

  integration: [
    { text: 'Chapter 1 covered the launcher, the classpath, and how the shell splits command-line arguments before Java sees them.', target: '#/chapter/01-01' },
    { text: 'Chapter 2 explains why a wrong `main` still loads the class, and the other meanings of `ClassNotFoundException`.', target: '#/chapter/01-02' },
    { text: 'Chapter 3 covered what the execution engine does with `main` once the launcher finds it.', target: '#/chapter/01-03' },
    { text: 'Access modifiers as a design tool, and package-private visibility, are Module 02.', target: '#/module/02-oop-in-java' },
    { text: 'String formatting, concatenation, and why `"x" + array` behaves as it does are Module 04.', target: '#/module/04-strings-wrappers-object-fundamentals' },
    { text: 'Exceptions, `throws`, and what an uncaught exception really does are Module 05.', target: '#/module/05-exception-handling' },
    { text: '`Arrays.toString`, and collections generally, are Module 07.', target: '#/module/07-java-collections-framework' },
    { text: 'Reading input, files, and character encodings — the rest of `java.io` — are Module 13.', target: '#/module/13-java-i-o-nio' },
    { text: 'Static imports come into their own with assertion methods in tests, Module 37.', target: '#/module/37-testing-java-spring-applications' },
    { text: 'Replacing `System.out` with a logging framework is Module 38.', target: '#/module/38-production-grade-spring-boot' },
  ],

  verification: {
    jdk: 'javac 21.0.10 / OpenJDK 21.0.10 (build 21.0.10+7-Ubuntu-124.04), Linux',
    date: '2026-08-13',
    note: 'Every program was compiled with `--release 17` and run, and every output and compiler error is real. The identical-bytecode claim about imports was established by compiling three variants and comparing `javap -c` output directly. Object identity hashes are shown as `<hash>` because they change every run — that substitution is the only edit made to any recorded output. NOT verified: behaviour on Windows (path separators and console encoding differ), other JVM implementations, and the preview instance-`main` forms introduced after the Java 17 baseline — this chapter documents only what the baseline requires.',
  },
};

export default chapter;
