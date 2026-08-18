# Module 01 · Chapter 4 — runnable sources

The programs used by [Chapter 4, *Program Entry, Output, and Structure*](../../../content/modules/module-01/01-04-program-entry-output-and-structure.js),
which completes Module 01.

Every output and every compiler error in that chapter came from running these.
If you change one, re-run it and update the chapter.

## Verified on

```
javac 21.0.10
OpenJDK Runtime Environment (build 21.0.10+7-Ubuntu-124.04)
```

Compiled with `--release 17` against the Java 17 baseline (README §3).

## The files

| File | Demonstrates |
|---|---|
| `MainSignature.java` | Four `main` forms the launcher accepts — including `String...` and `String args[]` |
| `RejectedMains.java` | Four it rejects, producing only **three** distinct errors. All compile |
| `CharArray.java` | `println(char[])` prints characters; every other array prints `[I@…` |
| `Streams.java` | `out` vs `err`, `System.setOut` on a `final` field, and `checkError()` |
| `ExitCode.java` / `Throws.java` | Exit status 0, n, and 1 — and where the stack trace goes |
| `NoImports.java`, `WithImports.java`, `WildcardImport.java` | Same program, three import styles, identical bytecode |
| `StaticImport.java` | `import static` for members rather than types |
| `pkgdemo/` | Two packages, `-d`, and what happens when the layout is wrong |

## Running them

```sh
javac --release 17 *.java

# what the launcher accepts, and what it does not
java MainSignature ; java VarargsMain ; java CStyleMain ; java ExtraModifiers
java NoPublic ; java NoStatic ; java NotVoid ; java WrongArg

# the println overload surprise, and the proof
java CharArray
javap -c CharArray.class | grep println

# out vs err - the difference only appears when you redirect
java Streams
java Streams 2>/dev/null        # stdout only
java Streams 2>&1 >/dev/null    # stderr only

# how a program ends
java ExitCode    ; echo "exit $?"
java ExitCode 3  ; echo "exit $?"
java Throws      ; echo "exit $?"

# System.out is an ordinary field - and it has a setter
javap java.lang.System | head -6

# imports cost nothing: compare the compiled output
javac --release 17 NoImports.java WithImports.java WildcardImport.java
javap -c NoImports.class ; javap -c WithImports.class ; javap -c WildcardImport.class

# packages: build the layout with -d, then run against it
javac --release 17 -d out pkgdemo/com/example/util/Helper.java pkgdemo/com/example/app/App.java
find out -name '*.class'
java -cp out com.example.app.App
```

To reproduce the package failure, copy `pkgdemo/com/example/util/Helper.java`
into a flat directory and compile it there *without* `-d`. It compiles; then
`java -cp . com.example.util.Helper` fails with `ClassNotFoundException`,
because the class file is not at `com/example/util/Helper.class`.

Compiled output (`*.class`) is gitignored.
