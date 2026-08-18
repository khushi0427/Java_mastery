/**
 * Module 01, Chapter 3 — The Execution Engine.
 *
 * CONTENT IS DATA (docs/ARCHITECTURE.md §4a). Renderer: chapter-view.js.
 *
 * ===========================================================================
 * PROVENANCE — READ THIS BEFORE CHANGING ANY NUMBER
 * ===========================================================================
 * This is a performance-adjacent chapter, so the project's no-fabrication rule
 * (docs/AI_INSTRUCTIONS.md §4) bites hardest here. EVERY timing below was
 * actually measured on 2026-08-13. None is recalled, estimated, or rounded to
 * look tidy.
 *
 * Measurement environment, stated wherever a number appears:
 *
 *     4 vCPU Intel(R) Xeon(R) @ 2.80GHz, 16 GB RAM, Linux container
 *     javac 21.0.10
 *     OpenJDK 64-Bit Server VM (build 21.0.10+7-Ubuntu-124.04, mixed mode, sharing)
 *     TieredCompilation=true, TieredStopAtLevel=4 (defaults)
 *
 * Method: the workload in java/module-01/ch03/Warmup.java, 12 batches of
 * 20,000 calls each; the reported figure is the last batch (steady state), and
 * each mode was run 3 times so the spread is visible. Startup figures are
 * wall-clock around `java Hello`, 5 runs.
 *
 * These are ONE workload on ONE machine in a shared virtualised environment.
 * They are presented as such in the text and must never be restated as general
 * claims about Java performance. Real benchmarking needs JMH — Module 41.
 *
 * If you change a program, RE-MEASURE. A stale number here is worse than none.
 */

export const chapter = {
  id: '01-03',
  moduleId: '01-java-foundations-execution-model',
  number: 3,
  title: 'The Execution Engine',
  subtitle: 'How the JVM runs bytecode: interpret first, profile while running, compile what matters, and undo it when the assumptions break.',

  objectives: [
    'Describe what the execution engine does after class loading hands it a linked class.',
    'Explain tiered compilation, and read `-XX:+PrintCompilation` output well enough to say which tier a method reached.',
    'Recognise on-stack replacement, and say why a long-running loop does not have to wait for its method to be called again.',
    'Explain why the JVM speculates, what deoptimisation is, and how to observe both.',
    'Describe the startup-versus-steady-state trade-off, and predict which way `-Xint` and `-Xcomp` move each.',
    'Navigate `-X` and `-XX` options, read a flag’s current value, and treat both as unstable interfaces.',
  ],

  topicsCovered: [
    'execution engine', 'interpreter', 'JIT compiler', 'HotSpot',
    'JVM warm-up', 'basic JVM command-line concepts',
  ],

  topicsDeferred: [
    { topic: '`main()`, command-line arguments, `System.out`, `PrintStream`, packages, imports, naming conventions', to: 'Module 01, Chapter 4' },
    { topic: 'Garbage collection, heap and metaspace — the other half of the runtime', to: 'Module 14' },
    { topic: 'Rigorous benchmarking with JMH, profilers, and diagnosing real performance problems', to: 'Module 41' },
    { topic: 'Threads, and why compilation happens on background threads', to: 'Module 15' },
  ],

  sections: [
    {
      type: 'prose',
      heading: 'Where this picks up',
      body: [
        'Chapter 2 left a class loaded, verified, prepared, resolved and initialized. The execution engine is what does something with it.',
        'The interesting part is that it does not pick one strategy. It **interprets** bytecode immediately so the program starts fast, **watches** which code actually runs hot, **compiles** that code to native instructions in the background, and **throws the compiled code away** when an assumption it made turns out to be wrong. All four happen while your program is running.',
      ],
    },

    {
      type: 'callout',
      tone: 'delta',
      heading: 'Coming from C++',
      body: [
        'A C++ compiler optimises once, ahead of time, knowing nothing about the input your program will actually see. It must be conservative: any virtual call could go anywhere, any branch could go either way.',
        'The JVM optimises *late*, with evidence. By the time it compiles a method it has counted how often each branch was taken and which concrete types arrived at each call site, so it can inline a virtual call as if it were direct — and simply undo that if a new type shows up later.',
        'That is the trade this chapter is about. You pay at startup and gain in steady state, and you get optimisations an ahead-of-time compiler cannot safely make.',
      ],
    },

    {
      type: 'diagram',
      heading: 'What happens to a hot method',
      alt: 'Bytecode is interpreted, profiled, compiled by C1 with profiling, then by C2, and may be deoptimised back to the interpreter.',
      steps: [
        { label: 'Interpret', detail: 'Runs immediately, no compilation cost — tier 0' },
        { label: 'Profile', detail: 'Count invocations, branches, and receiver types' },
        { label: 'C1 compile', detail: 'Fast compile, moderate code, keeps profiling — tier 3' },
        { label: 'C2 compile', detail: 'Slow compile, aggressive optimisation — tier 4' },
        { label: 'Deoptimise', detail: 'An assumption broke: discard and fall back' },
      ],
    },

    {
      type: 'prose',
      heading: '"Mixed mode" is not marketing',
      body: [
        'The JVM tells you which strategy it is using, every time you ask its version. That third line is worth reading rather than skipping.',
      ],
    },

    {
      type: 'terminal',
      heading: 'The same JVM, three modes',
      command: 'java -version\njava -Xint -version\njava -Xcomp -version',
      output: [
        'OpenJDK 64-Bit Server VM (build 21.0.10+7-Ubuntu-124.04, mixed mode, sharing)',
        'OpenJDK 64-Bit Server VM (build 21.0.10+7-Ubuntu-124.04, interpreted mode, sharing)',
        'OpenJDK 64-Bit Server VM (build 21.0.10+7-Ubuntu-124.04, compiled mode, sharing)',
      ].join('\n'),
      caption: '**mixed mode** is the default and means exactly what it says: interpreter *and* compiler. `-Xint` disables the JIT entirely; `-Xcomp` compiles every method on first invocation and never interprets. A program can read the same string at run time from the `java.vm.info` system property, which is how the exercise solutions report their own mode.',
    },

    {
      type: 'prose',
      heading: 'The interpreter',
      body: [
        'The interpreter executes bytecode instruction by instruction. It is the only part that can start instantly, because it needs no preparation — and it is where every method begins its life, no matter how hot it eventually becomes.',
        'It is also slow, in the way any interpreter is slow: decoding each instruction and dispatching to its implementation costs far more than the operation itself. How much slower is measurable rather than a matter of opinion, and it is measured further down.',
      ],
    },

    {
      type: 'prose',
      heading: 'Tiered compilation',
      body: [
        'HotSpot ships **two** just-in-time compilers, not one, because the ideal compiler for a method you have run 2,000 times is not the ideal compiler for one you have run 2,000,000 times.',
        '**C1** compiles quickly and produces decent code. **C2** compiles slowly and produces excellent code. Tiered compilation uses both: C1 gets a method running natively soon, and while it does so it keeps collecting profile data, which C2 then uses to optimise aggressively.',
      ],
    },

    {
      type: 'table',
      heading: 'The tiers, as reported by `-XX:+PrintCompilation`',
      columns: ['Tier', 'Compiler', 'Profiling', 'Typical role'],
      rows: [
        ['**0**', 'Interpreter', 'Yes', 'Where every method starts'],
        ['**1**', 'C1', 'None', 'Trivial methods C2 could not improve — compiled and left alone'],
        ['**2**', 'C1', 'Limited', 'Used when the C2 queue is long'],
        ['**3**', 'C1', 'Full', 'The common C1 tier: running natively while still profiling'],
        ['**4**', 'C2', 'None', 'Fully optimised, using the profile gathered at tier 3'],
      ],
      note: 'A method does not have to visit every tier. A one-line getter often goes straight to tier 1, because there is nothing for C2 to gain and profiling it would cost more than it saves.',
    },

    {
      type: 'code',
      heading: 'A workload built to be compiled',
      filename: 'java/module-01/ch03/Warmup.java',
      language: 'java',
      code: [
        'public class Warmup {',
        '',
        '    static long work(int n) {',
        '        long total = 0;',
        '        for (int i = 1; i <= n; i++) {',
        '            total += (i % 7) * (i % 13);',
        '        }',
        '        return total;',
        '    }',
        '',
        '    public static void main(String[] args) {',
        '        int batches = args.length > 0 ? Integer.parseInt(args[0]) : 12;',
        '        int callsPerBatch = 20_000;',
        '        int workSize = 200;',
        '',
        '        long checksum = 0;',
        '        for (int batch = 1; batch <= batches; batch++) {',
        '            long start = System.nanoTime();',
        '            for (int call = 0; call < callsPerBatch; call++) {',
        '                checksum += work(workSize);',
        '            }',
        '            long micros = (System.nanoTime() - start) / 1_000;',
        '            System.out.printf("batch %2d: %,8d us%n", batch, micros);',
        '        }',
        '        System.out.println("checksum " + checksum);',
        '    }',
        '}',
      ].join('\n'),
      caption: 'The unit of work is deliberately **small and called many times**, so `work` is compiled because its invocation count crosses a threshold rather than because one enormous loop got replaced mid-flight. The checksum is printed so the compiler cannot prove the work is dead and delete it — an easy way to accidentally measure nothing at all.',
    },

    {
      type: 'terminal',
      heading: 'Watching it get compiled',
      command: 'java -XX:+PrintCompilation Warmup 4 | grep "Warmup::"',
      output: [
        '32    8       3       Warmup::work (30 bytes)',
        '32    9 %     4       Warmup::work @ 4 (30 bytes)',
        '33   10       4       Warmup::work (30 bytes)',
        '35    8       3       Warmup::work (30 bytes)   made not entrant',
        '86  127 %     3       Warmup::main @ 45 (127 bytes)',
        '87  128       3       Warmup::main (127 bytes)',
      ].join('\n'),
      caption: 'Four lines tell the whole story for `work`. It is compiled at **tier 3** (C1 with profiling). Almost immediately it is compiled at **tier 4** (C2) — the `%` marks an on-stack replacement, and `@ 4` is the bytecode index it re-entered at. Then a normal tier-4 compilation is installed for future calls. Finally the tier-3 version is **made not entrant**: still running for anyone inside it, but no new call will use it.',
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'Reading `-XX:+PrintCompilation`',
      body: [
        'The columns are: **milliseconds since VM start**, a **compilation id**, **flags**, the **tier**, the **method**, and its **bytecode size**.',
        'The flags are the interesting part. `%` means on-stack replacement. `n` means a native method — you will see `jdk.internal.misc.Unsafe::getReferenceVolatile` early in any run, at tier 0. `s` means synchronized, `!` means the method has exception handlers.',
        'Trailing text matters too: **`made not entrant`** retires a compiled version so no new invocation enters it, and `made zombie` means it is no longer reachable at all and can be reclaimed.',
      ],
    },

    {
      type: 'prose',
      heading: 'On-stack replacement',
      body: [
        'Compilation is normally triggered by *calling* a method enough times, and the new code is used by the *next* call. That rule has an obvious hole: a method entered once that then loops ten million times would never be compiled, because it is never called again.',
        'On-stack replacement closes it. The JVM compiles the method while it is still executing and swaps the running frame over to the compiled version mid-loop, resuming at the same bytecode index. That is what `%` and `@ 4` mean above.',
        'It also explains a common surprise when benchmarking by hand: a loop written directly in `main` gets fast partway through its *first* iteration, so a naive "time the first run" measurement captures a transition rather than either steady state.',
      ],
    },

    {
      type: 'prose',
      heading: 'Warm-up, measured',
      body: [
        'Because compilation happens while the program runs, the same work costs different amounts at different times. This is JVM warm-up, and it is the reason "how fast is this code?" is not a well-formed question until you say *when*.',
      ],
    },

    {
      type: 'terminal',
      heading: 'The same batch of work, twelve times',
      command: 'java Warmup',
      output: [
        'batch  1:   10,224 us',
        'batch  2:    8,046 us',
        'batch  3:    7,984 us',
        'batch  4:    7,806 us',
        'batch  5:    7,598 us',
        'batch  6:    7,640 us',
        'batch  7:    7,876 us',
        'batch  8:    7,767 us',
        'batch  9:    7,769 us',
        'batch 10:    7,693 us',
        'batch 11:    7,786 us',
        'batch 12:    7,725 us',
        'checksum 856080000',
      ].join('\n'),
      caption: 'Batch 1 costs about a quarter more than the steady state, and the curve flattens by batch 3. A second run reproduced the same shape (10,339 then settling near 7,700). Measured on 4 vCPU Xeon @2.80GHz, OpenJDK 21.0.10 — the *shape* is the lesson, not the digits.',
    },

    {
      type: 'prose',
      heading: 'How much is the JIT actually worth?',
      body: [
        'The honest way to answer is to turn it off and measure. Below is the same workload under four execution modes, three runs each, reporting the final batch — steady state, after warm-up.',
      ],
    },

    {
      type: 'table',
      heading: 'Steady-state cost by execution mode',
      columns: ['Mode', 'Run 1', 'Run 2', 'Run 3', 'Relative to default'],
      rows: [
        ['**default** (tiered C1+C2)', '7,757 us', '7,822 us', '7,772 us', '1.0×'],
        ['`-XX:TieredStopAtLevel=1` (C1 only)', '14,564 us', '15,711 us', '14,653 us', '≈1.9× slower'],
        ['`-Xcomp` (compile everything)', '7,386 us', '7,401 us', '7,417 us', '≈0.95× — marginally faster'],
        ['`-Xint` (interpreter only)', '59,406 us', '56,006 us', '56,205 us', '≈7.2× slower'],
      ],
      note: 'Measured 2026-08-13 on 4 vCPU Intel Xeon @2.80GHz, 16 GB, Linux container, OpenJDK 21.0.10, using `java/module-01/ch03/Warmup.java`, batch 12 of 12, three runs per mode.',
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: 'What these numbers are, and what they are not',
      body: [
        'They are **one workload on one machine**, in a shared virtualised environment, timed with `System.nanoTime` around a loop. That is enough to show the *shape* of the difference — interpretation is far slower than compiled code, and C2 is meaningfully better than C1 — and nothing more.',
        'They are **not** a benchmark of Java, and the ratios do not transfer. This workload is tight integer arithmetic, which is close to the best case for a JIT. Code dominated by memory access, I/O, or allocation would look completely different.',
        '**Never quote a performance number you did not measure**, and never generalise one you did. Rigorous measurement means JMH, which handles warm-up, dead-code elimination and statistics properly — that is Module 41’s subject.',
      ],
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'A prediction that was wrong',
      body: [
        'Before measuring, the expectation recorded for `-Xcomp` was that its steady state would be **worse** than the default, on the reasoning that compiling everything on first invocation gives C2 no profile data to work with.',
        'That is not what happened. `-Xcomp` came out ~5% *faster* in steady state for this workload — plausibly because the method is simple enough that profile-guided optimisation has little to add, while skipping tier-3 profiling removes overhead.',
        'The prediction is left here rather than quietly deleted, because it is the point: **measure, then claim.** For code with polymorphic call sites and unpredictable branches the profiling almost certainly does earn its keep, but that was not tested here and so is not asserted.',
      ],
    },

    {
      type: 'prose',
      heading: 'The trade-off runs the other way at startup',
      body: [
        'If compiling is so much faster, why not compile everything immediately? Because most methods run once. Compiling them costs time and buys nothing — and the JVM has thousands of such methods to get through before your `main` even begins.',
      ],
    },

    {
      type: 'terminal',
      heading: 'Time to run a program that prints one line',
      command: '# 5 runs each, wall clock, of: java Hello\n#   (default) / -Xint / -Xcomp',
      output: [
        '(default: mixed)       ms: 41 40 38 38 39',
        '-Xint                  ms: 37 37 37 36 36',
        '-Xcomp                 ms: 1301 1262 1313 1273 1338',
      ].join('\n'),
      caption: 'The ordering inverts completely. `-Xint` is *slightly faster to start* than the default, because it never compiles anything. `-Xcomp` is roughly **33× slower to start**, because it compiles every method it touches — including all the one-shot JDK startup code. Same machine and JDK as above.',
    },

    {
      type: 'callout',
      tone: 'note',
      heading: 'Why this matters outside a chapter exercise',
      body: [
        'This is the whole reason short-lived JVM processes have a reputation for being slow, and why serverless and CLI workloads are the ones that reach for AOT compilation or a native image: they never live long enough to reach the steady state the JIT is optimising for.',
        'It is also why a long-running server is usually measured *after* a warm-up period, and why the first requests after a deploy are slower than the rest.',
      ],
    },

    {
      type: 'prose',
      heading: 'Speculation, and undoing it',
      body: [
        'The JIT’s biggest wins come from assuming things the profile says are true but the language does not guarantee: that a call site only ever sees one type, that a branch is never taken, that a value is never null.',
        'Assuming lets C2 inline a virtual call into straight-line code. But the assumption may fail later — a new subclass loads, an unusual input arrives — so every speculation is guarded, and when a guard fails the JVM **deoptimises**: it discards the compiled code, resumes in the interpreter, and recompiles with what it now knows.',
      ],
    },

    {
      type: 'code',
      heading: 'Breaking a speculation on purpose',
      filename: 'java/module-01/ch03/Deoptimization.java',
      language: 'java',
      code: [
        'public class Deoptimization {',
        '',
        '    interface Shape { int sides(); }',
        '    static class Triangle implements Shape { public int sides() { return 3; } }',
        '    static class Square   implements Shape { public int sides() { return 4; } }',
        '',
        '    static long total;',
        '',
        '    /** One call site. For a long time it only ever sees Triangle. */',
        '    static void consume(Shape shape, int times) {',
        '        for (int i = 0; i < times; i++) {',
        '            total += shape.sides();',
        '        }',
        '    }',
        '',
        '    public static void main(String[] args) {',
        '        Shape triangle = new Triangle();',
        '',
        '        System.out.println("phase 1: only Triangle, 200k calls");',
        '        for (int i = 0; i < 200_000; i++) {',
        '            consume(triangle, 10);',
        '        }',
        '',
        '        System.out.println("phase 2: introduce Square at the same call site");',
        '        Shape square = new Square();',
        '        for (int i = 0; i < 200_000; i++) {',
        '            consume(i % 2 == 0 ? triangle : square, 10);',
        '        }',
        '',
        '        System.out.println("total " + total);',
        '    }',
        '}',
      ].join('\n'),
      caption: 'Phase 1 gives C2 200,000 reasons to believe `shape` is always a `Triangle`. Phase 2 makes that false, at the same call site, at a moment we can see in the output.',
    },

    {
      type: 'terminal',
      heading: 'The discard happens exactly at the phase boundary',
      command: 'java -XX:+PrintCompilation Deoptimization | grep -E "Deoptimization|phase"',
      output: [
        'phase 1: only Triangle, 200k calls',
        '33    9       1       Deoptimization$Triangle::sides (2 bytes)',
        '33   10       3       Deoptimization::consume (28 bytes)',
        '33   11       4       Deoptimization::consume (28 bytes)',
        '35   10       3       Deoptimization::consume (28 bytes)   made not entrant',
        'phase 2: introduce Square at the same call site',
        '38   11       4       Deoptimization::consume (28 bytes)   made not entrant',
        '38   17       1       Deoptimization$Square::sides (2 bytes)',
        '40   16 %     4       Deoptimization::consume @ 2 (28 bytes)',
        '42   18       4       Deoptimization::consume (28 bytes)',
      ].join('\n'),
      caption: 'Read it against the phase markers. During phase 1, `consume` reaches tier 4 with `Triangle::sides` inlined. The first line after phase 2 begins is the tier-4 `consume` being **made not entrant** — the speculation is now false, so the optimised code is retired. `Square::sides` is compiled, and `consume` is recompiled: first by on-stack replacement so the loop already running can continue, then normally.',
    },

    {
      type: 'terminal',
      heading: 'And the JVM will name the reason',
      command: 'java -Xlog:deoptimization=debug Deoptimization | grep consume',
      output: [
        '[debug][deoptimization] cid=11     level=4 Deoptimization.consume(LDeoptimization$Shape;I)V'
        + ' trap_bci=4 predicate maybe_recompile',
        '[debug][deoptimization] cid=18 osr level=4 Deoptimization.consume(LDeoptimization$Shape;I)V'
        + ' trap_bci=2 osr_bci=2 profile_predicate maybe_recompile',
      ].join('\n'),
      caption: '`predicate` is the guard C2 inserted around its type assumption; `profile_predicate` is the same idea for the on-stack-replaced version. `maybe_recompile` is the JVM’s decision about what to do next. Across five runs the *reasons* were identical every time, though the exact number of events varied — addresses and timings are omitted here because they change every run.',
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: 'A second experiment that did not work — and why it is here',
      body: [
        'A natural companion demonstration is the **untaken branch**: give a method a branch that never runs during warm-up, let C2 prune it, then take it. That should deoptimise with reason `unstable_if`.',
        'It was written and run, and **it did not deoptimise at all** — zero events across five runs. The method was small enough that the pruned path was cheap to keep, so no guard was needed. The `unstable_if` events that *do* appear in the run above come from `main`, not from the method that was supposed to demonstrate it.',
        'The failed experiment is recorded rather than replaced with a tidier one because it is the most useful thing in this chapter: **JIT behaviour is emergent and version-specific.** Reason about it, then check. Never write "the JIT will…" in a design document without having looked.',
      ],
    },

    {
      type: 'prose',
      heading: 'HotSpot',
      body: [
        '"HotSpot" is the name of the JVM implementation itself — the one in OpenJDK and in almost every distribution you are likely to use — and it is named for exactly the behaviour above: it finds the hot spots and spends its optimisation budget there.',
        'It matters to say the name out loud because **most of this chapter is HotSpot behaviour, not Java behaviour**. The specification requires bytecode to be executed correctly; it says nothing about tiers, C1 and C2, `-XX:+PrintCompilation`, or the log lines above. A different JVM may organise all of it differently and still be perfectly conformant.',
      ],
    },

    {
      type: 'prose',
      heading: 'JVM command-line options',
      body: [
        'The flags used throughout this chapter fall into three categories, and knowing which is which tells you how much you can rely on them.',
      ],
    },

    {
      type: 'table',
      heading: 'The three categories',
      columns: ['Form', 'Meaning', 'Stability', 'Examples'],
      rows: [
        ['`-…`', 'Standard options', 'Specified — every conforming JVM has them', '`-classpath`, `-version`, `-D`'],
        ['`-X…`', 'Non-standard', 'Common but not specified; may change between releases', '`-Xint`, `-Xcomp`, `-Xmx`, `-Xss`'],
        ['`-XX:…`', 'Advanced / implementation', 'No stability guarantee whatsoever', '`-XX:+PrintCompilation`, `-XX:TieredStopAtLevel`'],
      ],
      note: '`-XX:+Flag` turns a boolean on, `-XX:-Flag` turns it off, and `-XX:Flag=value` sets a value. `java -X` lists the non-standard options with descriptions.',
    },

    {
      type: 'terminal',
      heading: 'Asking the JVM what it has decided',
      command: 'java -XX:+PrintFlagsFinal -version | grep -E "TieredCompilation |Tier[34]CompileThreshold"',
      output: [
        'intx Tier3CompileThreshold                    = 2000        {product} {default}',
        'intx Tier4CompileThreshold                    = 15000       {product} {default}',
        'bool TieredCompilation                        = true     {pd product} {default}',
      ].join('\n'),
      caption: '`-XX:+PrintFlagsFinal` prints every flag with its *effective* value and where that value came from — `{default}`, `{ergonomic}` (the JVM chose it based on the machine), or `{command line}`. This JVM reports **533** such flags. The trailing origin is the useful part: it tells you whether a value is one you set, one the JVM inferred from the hardware, or a built-in default.',
    },

    {
      type: 'callout',
      tone: 'warning',
      heading: 'Treat `-XX` flags as diagnostics, not configuration',
      body: [
        'They are excellent for understanding what the JVM is doing, which is how this chapter used them. They are a poor place to keep production settings: they are undocumented, they change between releases, and a flag that helped on one JDK can be removed or inverted in the next.',
        '`-Xint` and `-Xcomp` in particular are teaching and debugging tools. Neither belongs in a deployment.',
      ],
    },
  ],

  guidedLab: {
    heading: 'Guided lab — make the compiler show its work',
    intro: 'Each step produces evidence rather than a number to trust. Run them in order; the last one deliberately asks you to predict before measuring.',
    steps: [
      {
        instruction: 'Compile the chapter workload and run it with no flags. Note where the curve flattens.',
        command: 'javac --release 17 Warmup.java\njava Warmup',
        expected: 'Batch 1 noticeably slower than the rest; flat from about batch 3.',
        note: 'Your numbers will differ from the chapter’s. The shape is what should match.',
      },
      {
        instruction: 'Watch the compilation happen.',
        command: 'java -XX:+PrintCompilation Warmup 4 | grep "Warmup::"',
        expected: 'work compiled at tier 3, then tier 4 with a % (on-stack replacement), then the tier-3 version made not entrant.',
        note: 'If you do not see tier 4, the workload finished before C2 caught up — raise the batch count.',
      },
      {
        instruction: 'Turn the JIT off entirely and re-run.',
        command: 'java -Xint Warmup',
        expected: 'Every batch slow, and no warm-up curve at all — there is nothing to warm up.',
        note: 'The flat line is the point: warm-up is a property of compilation, not of caches.',
      },
      {
        instruction: 'Now compile everything eagerly, and time the two things separately.',
        command: 'java -Xcomp Warmup\ntime java -Xcomp Hello\ntime java Hello',
        expected: 'Steady state similar to the default; startup dramatically worse.',
        note: 'This is the trade-off in one command. Write down which direction each moved before you look.',
      },
      {
        instruction: 'Break a speculation and watch the compiled code get discarded.',
        command: 'javac --release 17 Deoptimization.java\njava -XX:+PrintCompilation Deoptimization | grep -E "Deoptimization|phase"',
        expected: 'consume made not entrant immediately after the phase 2 line.',
        note: 'Line up the compilation output against the phase markers — the discard is not a coincidence of timing.',
      },
      {
        instruction: 'Ask the JVM why.',
        command: 'java -Xlog:deoptimization=debug Deoptimization | grep consume',
        expected: 'Lines naming a reason: predicate, and profile_predicate for the OSR version.',
        note: 'Note that plain -Xlog:deoptimization prints nothing — the reasons are at debug level. Finding that out is part of the exercise.',
      },
      {
        instruction: 'Finally, predict and then measure: does a call site with five implementations cost more than one with a single implementation? Write your prediction down first.',
        command: 'javac --release 17 solutions/CallSiteShape.java\njava -cp solutions CallSiteShape',
        expected: 'monomorphic and bimorphic near-identical; megamorphic roughly twice as slow.',
        note: 'Most people predict a steady increase from one to five. The jump is between two and three, which is the shape of HotSpot’s inline cache.',
      },
    ],
  },

  commonMistakes: [
    {
      mistake: 'Timing a Java operation once and reporting the result.',
      why: 'The first execution includes interpretation, compilation, and possibly class loading. You have measured the transition, not the code.',
      realError: null,
      fix: 'Warm up first, then measure repeatedly and report the distribution. For anything that matters, use JMH — Module 41.',
    },
    {
      mistake: 'Writing a microbenchmark whose result is never used.',
      why: 'If nothing consumes the value, the JIT can prove the computation is dead and remove it. You then measure an empty loop and conclude the operation is free.',
      realError: null,
      fix: 'Consume the result — print it, accumulate it into a field, or use a JMH `Blackhole`. The chapter workload prints a checksum for exactly this reason.',
    },
    {
      mistake: 'Quoting a performance ratio from a blog post or from memory.',
      why: 'JIT behaviour depends on the JDK version, the hardware, the workload shape, and what else the process is doing. Ratios do not transfer between any of those.',
      realError: null,
      fix: 'Measure on your own workload and your own hardware, and state the conditions alongside the number — as this chapter does.',
    },
    {
      mistake: 'Putting `-Xcomp` in production to "avoid warm-up".',
      why: 'It compiles every method on first invocation, including thousands that run once during startup. Measured here: about 33× slower to start, for no steady-state gain worth having.',
      realError: null,
      fix: 'If startup dominates, that is an argument for AOT or a native image, not for -Xcomp. If steady state dominates, the default tiered behaviour is already the right answer.',
    },
    {
      mistake: 'Assuming `-XX` flags are a stable configuration interface.',
      why: 'They are implementation options with no compatibility guarantee. Flags are added, removed and inverted between releases.',
      realError: null,
      fix: 'Use them to diagnose. Keep production behaviour to standard options and documented settings, and re-validate any -XX flag on every JDK upgrade.',
    },
    {
      mistake: 'Reading `made not entrant` as an error.',
      why: 'It is routine. It means a compiled version has been retired — usually because a better one exists, or because a speculation was invalidated. Healthy JVMs do it constantly.',
      realError: null,
      fix: 'Treat it as information. Only a *continuous* cycle of compile-and-discard for the same method suggests a real problem, and that needs a profiler rather than PrintCompilation.',
    },
    {
      mistake: 'Describing HotSpot behaviour as "how Java works".',
      why: 'Tiers, C1/C2, OSR and these flags are HotSpot implementation details. The specification requires correct execution of bytecode and says nothing about any of it.',
      realError: null,
      fix: 'Say "HotSpot" when you mean HotSpot. It is accurate, and it prevents surprise when someone runs your code on a different JVM.',
    },
  ],

  interviewQuestions: [
    {
      category: 'Fundamental',
      question: 'Is Java interpreted or compiled?',
      answer: 'Both, at two different points. `javac` compiles source to bytecode ahead of time, with full type checking. At run time HotSpot *interprets* that bytecode initially so the program starts immediately, profiles it while it runs, and *compiles* the hot parts to native code in the background. The JVM reports this itself: `java -version` says "mixed mode", and `-Xint` and `-Xcomp` change it to "interpreted mode" and "compiled mode". So Java is compiled twice — statically to bytecode, dynamically to machine code — with interpretation covering the gap.',
    },
    {
      category: 'Fundamental',
      question: 'What is tiered compilation and why does HotSpot ship two compilers?',
      answer: 'Because the right compiler for a method you have run 2,000 times is not the right one for a method you have run 2,000,000 times. C1 compiles quickly and produces reasonable code; C2 compiles slowly and produces much better code. Tiered compilation runs both: a hot method is first compiled by C1 at tier 3, which keeps collecting profile data while already running natively, and once it is clearly hot C2 compiles it at tier 4 using that profile. Trivial methods may stop at tier 1 — C1 without profiling — because there is nothing for C2 to gain and profiling would cost more than it saves. You can see the tiers in the fourth column of `-XX:+PrintCompilation`.',
    },
    {
      category: 'Advanced',
      question: 'What is on-stack replacement and what problem does it solve?',
      answer: 'Compilation is normally triggered by invocation counts, and the compiled code is used by the next call. A method entered once that then loops millions of times would never benefit, because it is never called again. On-stack replacement compiles the method while it is executing and transfers the running frame into the compiled version at the same bytecode index. `-XX:+PrintCompilation` marks it with `%` and shows the entry point, for example `Warmup::work @ 4`. Practically it is why a long loop written directly in `main` speeds up partway through its first pass — which is a common way hand-rolled benchmarks accidentally measure a transition instead of a steady state.',
    },
    {
      category: 'Advanced',
      question: 'What is deoptimisation and why would a JVM throw away code it just compiled?',
      answer: 'Because the biggest optimisations rest on assumptions the language does not guarantee — that a call site only ever sees one receiver type, that a branch is never taken. Assuming lets C2 inline a virtual call into straight-line code, which enables everything downstream. Each assumption is guarded, and when a guard fails the JVM discards the compiled code, resumes in the interpreter, and recompiles with better information. You can watch it: introduce a second implementation at a previously monomorphic call site and `-XX:+PrintCompilation` shows the tier-4 method `made not entrant` at exactly that moment, while `-Xlog:deoptimization=debug` names the reason — `predicate` for the type guard. It is not a failure mode; it is what makes speculation safe.',
    },
    {
      category: 'Practical',
      question: 'A service is slow for the first minute after every deploy, then fine. What is happening and what would you do?',
      answer: 'Almost certainly warm-up: classes are still being loaded and linked, and the hot paths have not been compiled yet, so early requests run interpreted or in C1 code. Confirm rather than assume — `-XX:+PrintCompilation` or a profiler will show compilation activity concentrated in that window, and class loading shows in `-verbose:class`. Mitigations depend on the constraint: route traffic gradually so warm-up happens before full load, exercise the hot paths at startup, or extend health checks past the warm-up window. If the process is genuinely short-lived, that is an argument for AOT or a native image instead. What not to do is reach for `-Xcomp`: it compiles everything eagerly and, measured here, made startup roughly 33× worse.',
    },
    {
      category: 'Tricky',
      question: 'Does a call site with five possible implementations cost more than one with a single implementation?',
      answer: 'Yes, but not gradually — the jump is between two and three. HotSpot inlines a monomorphic call site directly, and handles a bimorphic one with an inline cache that is still effectively inlined. At three or more receivers the site becomes megamorphic and falls back to a real virtual dispatch that cannot be inlined, which also blocks every optimisation that inlining would have enabled downstream. Measured on this chapter’s workload, monomorphic and bimorphic were within noise of each other (about 36,500 microseconds) while megamorphic was roughly twice as slow (about 74,200) — one machine, one workload, so treat the ratio as indicative rather than a constant.',
    },
    {
      category: 'Scenario-based',
      question: 'Someone proposes adding `-XX:TieredStopAtLevel=1` in production to reduce CPU. How do you respond?',
      answer: 'It is a real trade, not nonsense: stopping at C1 removes C2 compilation work, which reduces CPU spent compiling and shortens time-to-reasonable-performance. It is sometimes used for short-lived processes and build tooling. But it caps steady-state performance at C1 code — measured on this chapter’s workload, roughly 1.9× slower than full tiered. So the question is whether the process lives long enough to reach steady state. I would ask what problem we are solving, measure both configurations on our actual workload rather than a microbenchmark, and note that `-XX` flags carry no stability guarantee and must be re-validated on every JDK upgrade.',
    },
  ],

  revision: [
    'The execution engine **interprets, profiles, compiles, and deoptimises** — all while the program runs.',
    '`java -version` reports the mode literally: **mixed mode** by default, `interpreted mode` under `-Xint`, `compiled mode` under `-Xcomp`.',
    'HotSpot ships **two** JITs. C1 is fast to compile; C2 produces better code. Tiered compilation uses both.',
    'Tiers: **0** interpreter, **1** C1 no profiling, **2** C1 limited, **3** C1 full profiling, **4** C2. Not every method visits every tier.',
    '`-XX:+PrintCompilation` columns: time, id, flags, tier, method, size. `%` = on-stack replacement, `n` = native, `made not entrant` = retired.',
    '**On-stack replacement** compiles a method while it runs and swaps the frame mid-loop — how long loops get fast without being called again.',
    '**Warm-up** is the cost of that: the same work is slower early. Measured here, batch 1 was ~25% slower than steady state.',
    'Measured on one machine, one workload: C1-only ≈1.9× slower than tiered, interpreter ≈7.2× slower. **Ratios do not transfer.**',
    'The trade-off inverts at startup: `-Xcomp` was ≈33× slower to start. Compiling code that runs once is pure cost.',
    '**Deoptimisation** discards compiled code when a speculation fails. Observe it with `-XX:+PrintCompilation`; get the reason from `-Xlog:deoptimization=debug`.',
    'Call sites: monomorphic and bimorphic inline; **megamorphic (3+) does not** — measured ≈2× slower here.',
    'Options: `-` standard and specified, `-X` non-standard, `-XX` implementation-specific with **no stability guarantee**. Diagnostics, not configuration.',
    'Nearly all of this is **HotSpot**, not the Java specification. Say which you mean.',
  ],

  integration: [
    { text: 'Chapter 1 introduced the JVM as the thing that consumes bytecode; this chapter is what it does with it.', target: '#/chapter/01-01' },
    { text: 'Chapter 2 covered loading, linking and initialization — everything that happens before the execution engine sees a class.', target: '#/chapter/01-02' },
    { text: '`main`, `System.out` and program structure — used throughout this chapter as tools — are the next chapter of this module.', target: '#/module/01-java-foundations-execution-model' },
    { text: 'The heap, metaspace, and garbage collection — the other half of the runtime, and where compiled code lives — are Module 14.', target: '#/module/14-jvm-memory-garbage-collection' },
    { text: 'Rigorous benchmarking with JMH, profilers, and diagnosing real performance problems are Module 41. Nothing in this chapter is a substitute.', target: '#/module/41-debugging-performance-problem-solving' },
    { text: 'Compilation happens on background threads; concurrency itself is Module 15.', target: '#/module/15-multithreading-fundamentals' },
    { text: 'Virtual dispatch, which the megamorphic measurement is really about, is Module 02.', target: '#/module/02-oop-in-java' },
  ],

  verification: {
    jdk: 'javac 21.0.10 / OpenJDK 64-Bit Server VM 21.0.10+7-Ubuntu-124.04, 4 vCPU Intel Xeon @2.80GHz, 16 GB, Linux container',
    date: '2026-08-13',
    note: 'Every program was compiled with `--release 17` and run, and every transcript is real output. **Every timing was actually measured** — steady-state figures are batch 12 of 12 with 3 runs per mode; startup figures are wall clock over 5 runs; the call-site measurement is best-of-5 after 50 warm-up rounds. These are ONE workload on ONE machine in a shared virtualised environment and are presented as indicative shapes, never as benchmarks of Java. NOT verified: other JVM implementations (all tier, flag and log behaviour here is HotSpot-specific), other hardware, and the effect of profiling on complex polymorphic code — the `-Xcomp` steady-state result contradicted the prediction and the chapter says so rather than generalising. One planned demonstration (untaken-branch deoptimisation) did not reproduce and is recorded as a failed experiment rather than removed.',
  },
};

export default chapter;
