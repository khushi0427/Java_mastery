# Module 01 · Chapter 1 — runnable sources

The programs used by [Chapter 1, *From Source to Running Program*](../../../content/modules/module-01/01-01-from-source-to-running-program.js).

Every one of these was compiled and run before the chapter was published, and
the outputs recorded in the chapter are the outputs these produced. If you
change one, **re-run it and update the chapter**, because a transcript that has
drifted from its program is worse than no transcript at all.

## Verified on

```
javac 21.0.10
openjdk version "21.0.10" 2026-01-20
OpenJDK Runtime Environment (build 21.0.10+7-Ubuntu-124.04)
```

Compiled with `--release 17`, because Java 17 is this project's baseline
(README §3) while the JDK used here is 21.

## The files

| File | Used for |
|---|---|
| `HelloJava.java` | The minimal complete program; the `javac` → `.class` → `java` walkthrough, the `0xCAFEBABE` header, and the `javap -c` bytecode listing |
| `Greeter.java` | A second class, compiled into a separate directory so the classpath has something real to find |
| `UseGreeter.java` | Calls `Greeter`; used to produce `NoClassDefFoundError` deliberately, and for the JAR examples |
| `solutions/Warmup.java` | Warm-up exercise reference solution |
| `solutions/ArgReport.java` | Easy exercise reference solution |
| `solutions/ClassFileVersion.java` | Challenge exercise reference solution — reads a class file header |

## Running them

```sh
# The pipeline walkthrough
javac --release 17 HelloJava.java
java HelloJava
javap -c HelloJava.class

# The classpath demonstration — note the two output directories
javac --release 17 -d lib Greeter.java
javac --release 17 -cp lib -d app UseGreeter.java
java -cp app UseGreeter          # fails: NoClassDefFoundError, on purpose
java -cp app:lib UseGreeter      # works

# The JAR demonstration
jar --create --file app.jar -C app . -C lib .
java -jar app.jar                # fails: no main manifest attribute
java -cp app.jar UseGreeter      # same archive, works
jar --create --file runnable.jar --main-class UseGreeter -C app . -C lib .
java -jar runnable.jar

# The challenge solution, pointed at anything
javac --release 17 solutions/ClassFileVersion.java
java -cp solutions ClassFileVersion HelloJava.class
```

Compiled output (`*.class`, `*.jar`) is gitignored — sources are committed,
build artefacts are not.
