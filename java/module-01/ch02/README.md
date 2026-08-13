# Module 01 · Chapter 2 — runnable sources

The programs used by [Chapter 2, *JVM Architecture & Class Loading*](../../../content/modules/module-01/01-02-jvm-architecture-class-loading.js).

Every one was compiled and run before the chapter was published, and the outputs
recorded in the chapter are the outputs these produced. If you change one,
**re-run it and update the chapter**.

## Verified on

```
javac 21.0.10
openjdk version "21.0.10" 2026-01-20
OpenJDK Runtime Environment (build 21.0.10+7-Ubuntu-124.04)
```

Compiled with `--release 17` against the Java 17 baseline (README §3).

## The files

| File | Demonstrates |
|---|---|
| `LazyLoading.java` | A class is not loaded until first active use; an unused class never loads at all |
| `Loaders.java` | The bootstrap / platform / application loaders, and the delegation chain |
| `Preparation.java` | A static field holding its prepared default while another initializer runs |
| `InitTriggers.java` | Which operations trigger initialization — and the three that do not |
| `InitFailure.java` | `ExceptionInInitializerError` on first use, `NoClassDefFoundError` forever after |
| `ForNameVsLoadClass.java` | Loading without initializing |
| `ClassLiteral.java` | `Sub.class` does not initialize; instantiating does, superclass first |
| `Tiny.java` | A minimal class to corrupt, for the verifier demonstration |
| `CorruptClass.java` | Writes a copy of a class file with one byte changed |
| `Config.java` + `UsesConfig.java` | The stale-constant trap |
| `solutions/` | Reference solutions for the chapter's exercises |

## Running them

```sh
javac --release 17 *.java

# lazy loading - NeverUsed never appears
java LazyLoading
java -verbose:class LazyLoading | grep -E 'Heavy|NeverUsed'

# the loader hierarchy
java Loaders

# preparation vs initialization, then the merged <clinit>
java Preparation
javap -c -p Counter.class

# what does and does not trigger initialization
java InitTriggers
javap -c InitTriggers.class      # note: no reference to WithConstant at all

# initialization failure, twice
java InitFailure

# the linking phases rejecting broken class files
mkdir -p broken
java CorruptClass Loaders.class broken/Loaders.class 0 0xDE   # ClassFormatError
java -cp broken Loaders
java CorruptClass Loaders.class broken/Loaders.class 7 0xFF   # UnsupportedClassVersionError
java -cp broken Loaders
java CorruptClass Tiny.class broken/Tiny.class 348 0xAC       # VerifyError
java -cp broken Tiny

# the stale constant: edit TIMEOUT to 60, then recompile ONLY Config
java UsesConfig
javac --release 17 Config.java && java UsesConfig    # still prints the old value
javac --release 17 UsesConfig.java && java UsesConfig
```

The `348` offset for `Tiny.class` is where that build put the constructor's
`return` opcode (0xB1). If you edit `Tiny.java`, find the new offset by looking
for 0xB1 in the compiled output.

Compiled output (`*.class`, `*.jar`) is gitignored.
