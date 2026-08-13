# Module 01 · Chapter 3 — runnable sources

The programs used by [Chapter 3, *The Execution Engine*](../../../content/modules/module-01/01-03-the-execution-engine.js).

**Every timing in that chapter was actually measured with these programs.** If you
change one, re-measure and update the chapter — and read the warning below first.

## Measured on

```
4 vCPU Intel(R) Xeon(R) @ 2.80GHz, 16 GB RAM, Linux container
javac 21.0.10
OpenJDK 64-Bit Server VM (build 21.0.10+7-Ubuntu-124.04, mixed mode, sharing)
TieredCompilation=true, TieredStopAtLevel=4 (defaults)
```

Compiled with `--release 17` against the Java 17 baseline (README §3).

## A warning about the numbers

These are **one workload on one machine** in a shared virtualised environment.
They show the *shape* of a difference and nothing more. Re-running them here on
a later occasion produced absolute figures 15–20% higher across the board while
the ratios held — which is exactly the point.

**Never quote these figures as Java performance.** Real measurement means JMH,
which is Module 41.

## The files

| File | Demonstrates |
|---|---|
| `Warmup.java` | The warm-up curve; the workload behind every steady-state figure |
| `Hello.java` | A near-empty program, for measuring startup |
| `Deoptimization.java` | C2 speculating on a monomorphic call site, then discarding it |
| `solutions/ModeReport.java` | Reading `java.vm.info` at run time; timing under each mode |
| `solutions/SpeculationDemo.java` | The learner's own version of the deoptimisation demo |
| `solutions/CallSiteShape.java` | Monomorphic vs bimorphic vs megamorphic call sites |

## Running them

```sh
javac --release 17 *.java solutions/*.java

# the warm-up curve
java Warmup

# watch the compiler work: tier 3, then % (OSR) tier 4, then made not entrant
java -XX:+PrintCompilation Warmup 4 | grep 'Warmup::'

# the execution modes, steady state
java Warmup                        # tiered C1+C2 (default)
java -XX:TieredStopAtLevel=1 Warmup   # C1 only
java -Xcomp Warmup                 # compile everything
java -Xint Warmup                  # interpreter only

# the same three modes, but startup instead of steady state - the order inverts
time java Hello
time java -Xint Hello
time java -Xcomp Hello

# speculation and its undoing
java -XX:+PrintCompilation Deoptimization | grep -E 'Deoptimization|phase'
java -Xlog:deoptimization=debug Deoptimization | grep consume
#   note: plain -Xlog:deoptimization prints NOTHING. The reasons are at debug level.

# call-site shape
java -cp solutions CallSiteShape

# what the JVM has decided for itself
java -XX:+PrintFlagsFinal -version | grep -E 'TieredCompilation |Tier[34]CompileThreshold'
```

Compiled output (`*.class`) is gitignored.
