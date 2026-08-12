/**
 * modules.js — the module metadata layer. GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Source of truth: docs/CURRICULUM.md
 * Regenerate with: node tools/generate-modules.mjs
 * Verify in sync:  node tools/generate-modules.mjs --check
 *
 * This is the ONE place the application reads module metadata from. The sidebar,
 * the dashboard, the module overview, and the search index all consume this
 * array; nothing hardcodes a module list anywhere else.
 *
 * The curriculum is LOCKED (docs/CURRICULUM.md Appendix B). `number` and `id`
 * are permanent keys — Phase 4 progress records are keyed on `id`. Renaming a
 * module changes its generated id, which would orphan stored progress.
 *
 * `status` and `chapterCount` describe what actually exists in this repository.
 * All 43 modules are NOT_STARTED with 0 chapters because no chapter content has
 * been written yet. Metadata is not content.
 */

export const MODULES = [
  {
    "number": "01",
    "id": "01-java-foundations-execution-model",
    "name": "Java Foundations & Execution Model",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "Establish how Java actually executes, so every later module rests on a correct mental model rather than on analogy to C++.",
    "prerequisites": [],
    "owns": "The compile→bytecode→JVM pipeline; the JDK/JRE/JVM distinction; the source-file and package model; program entry and lifecycle; the toolchain.",
    "topics": [
      {
        "group": "The execution pipeline",
        "items": [
          "Source (.java) → javac → bytecode (.class) → JVM → interpretation and JIT compilation to native code",
          "Why Java is \"compiled and interpreted\" — and why that phrasing is imprecise",
          "Contrast with C++: no preprocessor, no linker, no object files, no header/implementation split, no undefined behaviour by design",
          "Platform independence: what the bytecode contract actually guarantees, and what it does not (native libraries, filesystem semantics, default charset)"
        ]
      },
      {
        "group": "Platform anatomy",
        "items": [
          "JDK vs JRE vs JVM; what each contains and which you need when",
          "JVM implementations exist beyond HotSpot; specification vs implementation",
          "Java release cadence, LTS releases, and why this project baselines on 17",
          "Reading the JLS and the javadoc as primary sources (project rule: verify, never assume — AI_INSTRUCTIONS.md §4)"
        ]
      },
      {
        "group": "Program structure",
        "items": [
          "The class as the unit of compilation; one public type per file; file/type name correspondence",
          "Packages: declaration, directory correspondence, naming conventions, the unnamed package and why it is avoided",
          "import, wildcard imports, static imports, fully qualified names, name shadowing",
          "The classpath: what it is, how the JVM resolves types with it, common failures (NoClassDefFoundError vs ClassNotFoundException)"
        ]
      },
      {
        "group": "Entry and lifecycle",
        "items": [
          "public static void main(String[] args) — why each modifier is required",
          "Command-line arguments; exit codes; System.exit and its interaction with finally-blocks and shutdown hooks",
          "Program termination: normal exit, uncaught exception, non-daemon threads",
          "[Java 21+ / preview] simplified source files and instance main methods — verify preview status for the target release before teaching"
        ]
      },
      {
        "group": "Toolchain in practice",
        "items": [
          "javac and java invocation; -d, -cp, -source/-target/--release",
          "Single-file source execution (java Hello.java) and its limits",
          "jshell for experimentation",
          "javap for reading the compiled shape of a class (used far more in Modules 05, 11, and 16)",
          "Reading compiler errors and stack traces as first-class skills"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "02",
    "id": "02-types-operators-control-flow-method-semantics",
    "name": "Types, Operators, Control Flow & Method Semantics",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "Cover exactly the delta from C++/JavaScript — the places where familiar syntax hides different semantics. This module does not teach what a variable, loop, or if is.",
    "prerequisites": [
      "01"
    ],
    "owns": "Primitive/reference type semantics; numeric behaviour; parameter passing; overload resolution; Java's control-flow constructs.",
    "topics": [
      {
        "group": "The type system's two halves",
        "items": [
          "Primitives vs reference types; why Java has both and what that costs",
          "Exact sizes and ranges of the eight primitives — fixed by the JLS, unlike C++",
          "Reference variables vs C++ pointers and C++ references: no arithmetic, no dereference operator, no null-reference-vs-null-pointer distinction",
          "Default values of fields vs the definite-assignment rule for locals",
          "Stack vs heap placement of locals, fields, and objects (full treatment: 15)"
        ]
      },
      {
        "group": "Numeric semantics",
        "items": [
          "Integer overflow wraps silently and is defined behaviour; Math.addExact and friends",
          "Integer division and remainder, including negative operands",
          "Floating point: IEEE-754, == on double, NaN comparisons, -0.0, accumulation error; when BigDecimal is required and why double money is a bug",
          "char is an unsigned 16-bit UTF-16 code unit, not a byte (see 03)",
          "Widening vs narrowing; implicit promotion in expressions; explicit casts and silent truncation",
          "Bitwise operators; >> vs >>> (no unsigned type in Java, unlike C++)"
        ]
      },
      {
        "group": "Wrappers and boxing",
        "items": [
          "Wrapper classes; autoboxing and unboxing; where the compiler inserts them",
          "Integer cache semantics and why == on boxed values is a classic bug",
          "NullPointerException from unboxing a null",
          "Boxing cost in loops and collections; primitive specialisations as the fix"
        ]
      },
      {
        "group": "Declarations",
        "items": [
          "final locals, parameters, and fields — what final does and does not guarantee (contrast C++ const: no deep immutability, no const-correctness)",
          "var local-variable type inference: where it is allowed, what it infers, and readability guidance",
          "Scope, shadowing, and the absence of C++-style block-level redeclaration"
        ]
      },
      {
        "group": "Control flow, Java-specific",
        "items": [
          "Enhanced for and its desugaring over arrays vs Iterable",
          "Labelled break/continue",
          "switch statements: fall-through, String switch, and what may be a label",
          "switch expressions with arrow form and yield; exhaustiveness",
          "Ternary operator pitfalls with mixed numeric/boxed operands",
          "No goto, no operator overloading, no default parameter values — and the idioms Java uses instead"
        ]
      },
      {
        "group": "Methods",
        "items": [
          "Java is strictly pass-by-value — including for references. Why \"objects are passed by reference\" is wrong, and how to demonstrate it",
          "Overloading and the three-phase overload-resolution algorithm; interaction with boxing and varargs; why ambiguity errors occur",
          "Varargs: array under the hood, heap-pollution warnings, the ambiguity traps",
          "static vs instance methods; why static does not participate in dynamic dispatch (dispatch itself: 05)",
          "Recursion and stack depth; StackOverflowError; no tail-call elimination"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "03",
    "id": "03-arrays-strings-text-processing",
    "name": "Arrays, Strings & Text Processing",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "Java's array and text model differs sharply from C++'s, and text handling is a permanent source of production bugs.",
    "prerequisites": [
      "01",
      "02"
    ],
    "owns": "Array semantics; String and its immutability; the string pool; StringBuilder; character encoding; regex; formatting.",
    "topics": [
      {
        "group": "Arrays",
        "items": [
          "Arrays as objects: length is a field, not a method; arrays have a runtime class and inherit from Object",
          "Declaration, allocation, default initialisation, array literals",
          "Multi-dimensional arrays are arrays of arrays — jagged, not contiguous; contrast with C++ 2-D layout and the cache implications",
          "Array covariance (Object[] o = new String[1]) and ArrayStoreException — the historical reason, and why generics chose invariance instead (11)",
          "java.util.Arrays: toString, deepToString, equals, deepEquals, sort, binarySearch, fill, copyOf, asList and its fixed-size trap",
          "System.arraycopy and copy performance",
          "Arrays vs ArrayList: when the raw array still wins (12)"
        ]
      },
      {
        "group": "String",
        "items": [
          "Immutability: what it buys (safe sharing, hashing, thread safety) and costs",
          "The string constant pool; compile-time constant folding; intern(); == vs equals and why this is the most common Java bug",
          "Internal representation is an implementation detail that has changed across releases — teach the contract, and verify implementation claims against the JDK docs for the release in question rather than asserting them",
          "Core API: length, charAt, substring, indexOf, split, join, replace, strip vs trim, isBlank, repeat, chars, lines, formatted",
          "Text blocks (\"\"\") — incidental whitespace stripping, escapes",
          "String concatenation in loops: why it is quadratic, and what the compiler does and does not optimise"
        ]
      },
      {
        "group": "Mutable text",
        "items": [
          "StringBuilder vs StringBuffer — the synchronisation difference and why StringBuffer is almost always the wrong choice",
          "Capacity, growth, and pre-sizing",
          "Building large text efficiently"
        ]
      },
      {
        "group": "Characters and encoding",
        "items": [
          "Unicode, code points vs code units; UTF-16 in the JVM; surrogate pairs",
          "Why String.length() is not \"number of characters\" for astral-plane text",
          "Character utilities; codePoints()",
          "Charset, encode/decode, getBytes(Charset); always specify the charset — platform-default dependence is a portability bug (I/O detail: 21)"
        ]
      },
      {
        "group": "Regular expressions",
        "items": [
          "Pattern and Matcher; compile once, reuse",
          "Groups, named groups, quantifiers, greedy vs reluctant vs possessive",
          "Backtracking and catastrophic backtracking as a real availability risk",
          "String.matches/replaceAll/split and their hidden compilation cost"
        ]
      },
      {
        "group": "Formatting and parsing",
        "items": [
          "String.format / printf conversions and flags",
          "Parsing numbers: Integer.parseInt vs valueOf, NumberFormatException",
          "Locale sensitivity in formatting (full treatment: 22)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "04",
    "id": "04-classes-objects-object-lifecycle",
    "name": "Classes, Objects & Object Lifecycle",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "How Java constructs, initialises, and disposes of objects — the initialisation order in particular, which is a frequent source of subtle bugs.",
    "prerequisites": [
      "01",
      "02"
    ],
    "owns": "Class and object anatomy; constructors; initialisation order; this; static members; object destruction semantics.",
    "topics": [
      {
        "group": "Anatomy",
        "items": [
          "Fields, methods, constructors, initialiser blocks, nested types",
          "Access modifiers: public, protected, package-private (the default — note there is no keyword), private; package-private has no C++ analogue",
          "Encapsulation as a design obligation, not a syntax exercise",
          "Object identity vs equality vs sameness (contract detail: 07)"
        ]
      },
      {
        "group": "Construction",
        "items": [
          "Constructors: no return type, overloading, the implicit no-arg constructor and when it disappears",
          "this(...) constructor chaining; super(...) and its mandatory-first rule",
          "Telescoping-constructor problem; static factory methods and their advantages; the builder pattern (full treatment: 26)",
          "Constructors that throw; partially constructed objects; why calling an overridable method from a constructor is dangerous (dispatch: 05)"
        ]
      },
      {
        "group": "Initialisation order — exactly",
        "items": [
          "Static: static fields and static initialiser blocks, in textual order, at class initialisation time (trigger conditions: 16)",
          "Instance: field initialisers and instance initialiser blocks, in textual order, after super() returns and before the constructor body",
          "The full ordering across a superclass/subclass pair — a standard interview trace",
          "Reading uninitialised (default-valued) fields during construction"
        ]
      },
      {
        "group": "static",
        "items": [
          "Static fields as per-class state; static methods; static nested types (13)",
          "When static is appropriate and when it is a global-variable smell",
          "Static utility classes and private constructors",
          "Contrast with C++ statics and with JavaScript's prototype/class model"
        ]
      },
      {
        "group": "Lifecycle and destruction",
        "items": [
          "Object creation on the heap; reference assignment; reachability",
          "There is no destructor. Contrast with C++ RAII and deterministic destruction — this is a major mental-model shift for a C++ programmer",
          "finalize() is deprecated for removal and must never be used; why it was a mistake",
          "Cleanup is explicit: AutoCloseable and try-with-resources (10) — the closest Java gets to RAII",
          "Garbage collection eligibility from the language perspective; the collector itself is Module 15"
        ]
      },
      {
        "group": "Object",
        "items": [
          "The universal superclass and its methods; overview here, contracts in 07",
          "getClass() and the runtime type (reflection: 16)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "05",
    "id": "05-inheritance-polymorphism-dynamic-dispatch",
    "name": "Inheritance, Polymorphism & Dynamic Dispatch",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "Java's dispatch rules and their precise boundaries — where polymorphism applies, and the several places it deliberately does not.",
    "prerequisites": [
      "04"
    ],
    "owns": "Single inheritance; overriding; virtual dispatch; hiding vs overriding; super; final; casting and instanceof.",
    "topics": [
      {
        "group": "Inheritance model",
        "items": [
          "Single implementation inheritance; no multiple inheritance of state — contrast C++ and the diamond problem; interfaces as the alternative (06)",
          "extends; the implicit Object superclass; constructor chaining upward",
          "protected semantics and its package interaction (a genuine surprise for C++ programmers)",
          "Inheritance vs composition — inheritance is the exception (design: 26, 27)"
        ]
      },
      {
        "group": "Overriding",
        "items": [
          "Rules: signature, covariant return types, access may widen but not narrow, checked exceptions may narrow but not widen",
          "@Override — why it is mandatory in this curriculum",
          "All non-private, non-static, non-final methods are virtual by default — the inverse of C++, where virtual is opt-in",
          "final methods and final classes; why String is final",
          "private methods are not inherited and not overridable"
        ]
      },
      {
        "group": "Dispatch mechanics",
        "items": [
          "Dynamic (runtime) dispatch on the object's runtime type; the vtable analogy and where it breaks down",
          "Static binding for: static methods (hiding, not overriding), fields (field hiding/shadowing), private methods, and overload selection",
          "Overload resolution is compile-time on the static type; override selection is runtime on the dynamic type — the classic combined trap",
          "super.method() and non-virtual invocation",
          "Why fields are never polymorphic"
        ]
      },
      {
        "group": "Types at runtime",
        "items": [
          "Upcasting (implicit) vs downcasting (explicit) and ClassCastException",
          "instanceof, and pattern matching for instanceof (if (o instanceof String s)) — available on the Java 17 baseline",
          "getClass() vs instanceof — and their consequences for equals (07)",
          "Liskov substitution as a practical constraint, not a slogan"
        ]
      },
      {
        "group": "Abstraction",
        "items": [
          "abstract classes and methods; when an abstract class beats an interface",
          "Template-method structure as the canonical use (pattern detail: 26)",
          "Fragile base class problem; designing for inheritance or forbidding it (document-or-final)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "06",
    "id": "06-interfaces-abstraction-composition",
    "name": "Interfaces, Abstraction & Composition",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "Interfaces are Java's primary abstraction mechanism and the foundation of every framework in Part VI.",
    "prerequisites": [
      "05"
    ],
    "owns": "Interface semantics; default/static/private interface methods; multiple inheritance of type; programming to interfaces; composition.",
    "topics": [
      {
        "group": "Interface fundamentals",
        "items": [
          "Interfaces as pure type contracts; implicitly public abstract methods",
          "Implicitly public static final fields — and why constant interfaces are an anti-pattern",
          "Multiple inheritance of type without inheritance of state",
          "Interface vs abstract class: a decision checklist, not a slogan",
          "Marker interfaces; contrast with annotations (16)"
        ]
      },
      {
        "group": "Modern interface members",
        "items": [
          "default methods — the motivation (evolving Collection without breaking implementors), and the risks",
          "Diamond resolution rules for conflicting defaults; the explicit Interface.super.method() disambiguation",
          "Class wins over interface: the \"class always beats default\" rule",
          "static interface methods — not inherited, called on the interface",
          "private interface methods for shared default-method internals"
        ]
      },
      {
        "group": "Functional interfaces (introduced here, developed in 13)",
        "items": [
          "The single-abstract-method shape; @FunctionalInterface",
          "Why lambdas require this shape; how default/static members do not count"
        ]
      },
      {
        "group": "Design with interfaces",
        "items": [
          "Program to the interface, not the implementation — with the concrete Java payoff (List vs ArrayList in signatures)",
          "Interface segregation in practice; narrow role interfaces",
          "Dependency inversion as the mechanism the entire Spring container exploits (33)",
          "Interfaces as seams for testing and for test doubles (25)"
        ]
      },
      {
        "group": "Composition over inheritance",
        "items": [
          "Delegation; wrapper/decorator structure; forwarding classes",
          "Composition's advantages: no fragile base class, runtime flexibility, multiple behaviours",
          "The verbosity cost, and Java's idioms for reducing it",
          "Comparison with C++ multiple inheritance and with JavaScript mixins"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "07",
    "id": "07-object-contracts",
    "name": "Object Contracts — equals, hashCode, toString & Ordering",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "These contracts are enforced by the collections framework, not by the compiler — violating them produces silent, hard-to-find data loss.",
    "prerequisites": [
      "05",
      "06"
    ],
    "owns": "equals/hashCode contracts; toString; Comparable/Comparator; clone and copying.",
    "topics": [
      {
        "group": "equals",
        "items": [
          "The five-part contract: reflexive, symmetric, transitive, consistent, and x.equals(null) == false",
          "Correct implementation recipe, step by step",
          "instanceof vs getClass() and the symmetry problem when a subclass adds state — why there is no fully satisfying fix, and the composition workaround",
          "Mutable fields in equals and the \"object lost inside a HashSet\" failure",
          "equals on floating-point and array fields; Objects.equals, Arrays.equals, Arrays.deepEquals"
        ]
      },
      {
        "group": "hashCode",
        "items": [
          "The contract: equal objects must have equal hash codes; unequal objects may collide",
          "Why overriding equals without hashCode breaks HashMap/HashSet — demonstrated, not asserted",
          "Writing a good hash: Objects.hash (and its varargs allocation cost) vs a hand-rolled 31-multiplier; caching for immutable types",
          "Distribution quality and its effect on bucket behaviour (internals: 12)",
          "Identity hash code; why default hashCode is not the memory address in any guaranteed sense"
        ]
      },
      {
        "group": "toString",
        "items": [
          "Its real purpose: diagnostics and logs",
          "What must never appear in it (secrets, credentials, unbounded collections)",
          "Lazy/expensive toString in logging paths"
        ]
      },
      {
        "group": "Ordering",
        "items": [
          "Comparable<T> and natural ordering; the contract and its sign semantics",
          "Consistency with equals — and the concrete misbehaviour in TreeSet and TreeMap when it is violated",
          "Comparator<T>: comparing, thenComparing, reversed, nullsFirst, nullsLast, and the primitive-specialised key extractors",
          "The subtraction-comparator overflow bug; Integer.compare as the fix",
          "Total order requirements; IllegalArgumentException: Comparison method violates its general contract! and what causes it",
          "Stable vs unstable sorting in the JDK's sort implementations"
        ]
      },
      {
        "group": "Copying",
        "items": [
          "Cloneable and Object.clone() — the broken design, the shallow-copy default, and why this curriculum teaches it mainly so it can be avoided",
          "Copy constructors and static copy factories as the preferred idiom",
          "Shallow vs deep copy; defensive copying at API boundaries (08)",
          "Serialization-based copying and why it is a poor tool (21)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "08",
    "id": "08-immutability-records-data-oriented-design",
    "name": "Immutability, Records & Data-Oriented Design",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "Immutability is the cheapest correctness and concurrency tool Java offers, and records make it idiomatic.",
    "prerequisites": [
      "04",
      "07"
    ],
    "owns": "Immutable class construction; defensive copying; record; value-oriented modelling.",
    "topics": [
      {
        "group": "Building immutable classes",
        "items": [
          "The five rules: no setters, all fields private final, class final (or constructors private), defensive copies in, defensive copies out",
          "Why final on a reference field does not make the referent immutable",
          "Deep vs shallow immutability; immutable collections (List.of, Map.of, Collections.unmodifiable, List.copyOf) and the difference between unmodifiable view and immutable copy*",
          "Benefits: inherently thread-safe, safely shareable, safely hashable, easier to reason about, cacheable",
          "Costs: allocation pressure, copy-on-write update patterns; withers",
          "Declaration; the implicitly generated canonical constructor, accessors, equals, hashCode, and toString",
          "Compact canonical constructors for validation and normalisation",
          "Explicit canonical constructors; additional constructors; static factories",
          "Restrictions: implicitly final, cannot extend, no additional instance fields",
          "Records still need defensive copying for mutable components — the generated accessor returns the reference as-is",
          "Records may implement interfaces; static members and instance methods are allowed",
          "Records as DTOs, as value objects, and as local aggregates; local records",
          "When a record is the wrong choice (identity-bearing entities — see 31)"
        ]
      },
      {
        "group": "Data-oriented design in Java",
        "items": [
          "Modelling data as immutable values plus behaviour, contrasted with state-mutating OO",
          "Records + sealed types + pattern matching as Java's algebraic-data-type approach (09)",
          "Value semantics vs reference semantics; comparison with C++ value types",
          "Awareness note: value-type work (Project Valhalla) is not part of the Java 17 baseline and must not be presented as available"
        ]
      },
      {
        "group": "Practical immutability",
        "items": [
          "Immutable domain models and how they simplify concurrency (17)",
          "Builders for immutable objects with many fields (26)",
          "Immutability at API boundaries; returning copies vs unmodifiable views",
          "java.time as a well-designed immutable API to study (22)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "09",
    "id": "09-enums-sealed-types-pattern-matching",
    "name": "Enums, Sealed Types & Pattern Matching",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "Java's tools for closed sets of alternatives, and the modern pattern-matching syntax that consumes them exhaustively.",
    "prerequisites": [
      "06",
      "08"
    ],
    "owns": "enum; sealed hierarchies; pattern matching; exhaustiveness.",
    "topics": [
      {
        "group": "Enums",
        "items": [
          "Enums are full classes: fields, constructors, methods, interfaces",
          "Constant-specific class bodies (per-constant behaviour overrides)",
          "values(), valueOf, name(), ordinal() — and why persisting ordinal() is a bug waiting for the next reordering",
          "Enums are singletons per constant; identity comparison with == is correct and preferred",
          "EnumSet and EnumMap — their bit-vector/array implementations and why they outperform the general-purpose collections (12)",
          "switch over enums; exhaustiveness and the default-case dilemma",
          "The enum-singleton idiom; enums as strategy holders; enums as state machines",
          "Contrast with C++ enum/enum class and JavaScript's absence of enums",
          "sealed classes and interfaces with permits; final, sealed, and non-sealed subtypes",
          "Same-module/same-package constraints on permitted subtypes",
          "What sealing buys: a closed hierarchy the compiler can reason about",
          "Sealed interface + records = algebraic data types in Java",
          "When to seal and when an open hierarchy is right"
        ]
      },
      {
        "group": "Pattern matching",
        "items": [
          "Type patterns with instanceof (baseline Java 17), including flow scoping of the pattern variable",
          "[Java 21+] Pattern matching for switch — finalised in Java 21; call it out explicitly and do not use it in baseline-17 examples without saying so",
          "[Java 21+] Record patterns and nested destructuring",
          "Guarded patterns (when clauses); pattern dominance and ordering errors",
          "Exhaustiveness over sealed hierarchies, and why it eliminates the default case",
          "null handling in pattern switch — explicitly, since it differs from classic switch",
          "Visitor-pattern replacement; when patterns beat polymorphism and when polymorphism still wins (26)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "10",
    "id": "10-exceptions-errors-resource-management",
    "name": "Exceptions, Errors & Resource Management",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "Java's checked-exception model has no C++ or JavaScript analogue, and resource management without destructors requires a specific discipline.",
    "prerequisites": [
      "04",
      "05"
    ],
    "owns": "The Throwable hierarchy; checked vs unchecked; try/catch/finally; try-with-resources; AutoCloseable; exception design.",
    "topics": [
      {
        "group": "The hierarchy",
        "items": [
          "Throwable → Error, Exception, RuntimeException",
          "Error — OutOfMemoryError, StackOverflowError, NoClassDefFoundError: why you do not catch them",
          "Checked vs unchecked: the compiler-enforced distinction, unique to Java",
          "The catch-or-declare rule; throws clauses and how they constrain overriding (05)"
        ]
      },
      {
        "group": "Mechanics",
        "items": [
          "try/catch/finally; multi-catch (|); catch ordering and reachability errors",
          "finally semantics: when it runs, when it does not (System.exit, JVM kill), and how a return/throw inside finally silently swallows the original outcome",
          "Stack unwinding; fillInStackTrace cost; reading a stack trace properly",
          "Exception chaining — initCause, cause-taking constructors, and Caused by: in the printed trace",
          "Suppressed exceptions and where they come from",
          "Rethrowing; more-precise rethrow; wrapping checked into unchecked"
        ]
      },
      {
        "group": "Resource management",
        "items": [
          "try-with-resources — the closest thing Java has to RAII; contrast with C++ destructors and with finally",
          "AutoCloseable vs Closeable; implementing close() correctly",
          "Multiple resources: closing order, and suppressed exceptions when both the body and close() throw",
          "Effectively-final resource variables in the resource header",
          "Why finally { close(); } is subtly wrong, demonstrated"
        ]
      },
      {
        "group": "Designing with exceptions",
        "items": [
          "Checked vs unchecked: the actual decision criterion (can the caller reasonably recover?), and the honest state of the industry debate — present both sides, including why many modern frameworks favour unchecked",
          "Custom exception design: naming, hierarchy, carrying diagnostic state",
          "Never swallow: empty catch blocks, catch (Exception e) {}, e.printStackTrace() as an anti-pattern",
          "Exceptions are not control flow — and the performance argument for that",
          "Fail fast; precondition checking; Objects.requireNonNull; IllegalArgumentException vs IllegalStateException",
          "Exceptions across API boundaries; translating persistence exceptions (Spring's translation layer: 36)",
          "Null handling as an exception-adjacent concern; Optional is Module 14"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "11",
    "id": "11-generics-type-erasure",
    "name": "Generics & Type Erasure",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "Generics are compile-time only, and nearly every confusing generic error traces back to erasure.",
    "prerequisites": [
      "05",
      "06"
    ],
    "owns": "Generic types and methods; bounds; wildcards; erasure; variance.",
    "topics": [
      {
        "group": "Fundamentals",
        "items": [
          "Generic classes, interfaces, and methods; type-parameter naming conventions",
          "Type-parameter scope; generic constructors",
          "Contrast with C++ templates: templates instantiate per type at compile time (code bloat, full specialisation); Java erases to a single class. No template metaprogramming, no specialisation, no template<int N>",
          "Contrast with TypeScript generics (also erased, but with structural typing)"
        ]
      },
      {
        "group": "Type erasure — the central mechanism",
        "items": [
          "What the compiler emits: erasure to the bound (Object when unbounded)",
          "Synthetic bridge methods and why they exist; observing them with javap",
          "Consequences, each demonstrated",
          "no new T(), no new T[]",
          "no instanceof List<String>",
          "List<String> and List<Integer> share one runtime class",
          "overloads that differ only by type argument do not compile",
          "no primitives as type arguments (hence boxing — 02)",
          "static members cannot use the class's type parameters",
          "Reifiable vs non-reifiable types; unchecked warnings; @SuppressWarnings used narrowly and justifiably",
          "Heap pollution; generic varargs; @SafeVarargs",
          "Raw types: legacy interop, what they disable, and why they are never acceptable in new code"
        ]
      },
      {
        "group": "Bounds and variance",
        "items": [
          "Upper bounds (extends), multiple bounds, recursive bounds (<T extends Comparable<T>>)",
          "Generics are invariant — List<String> is not a List<Object> — and why that is the correct choice given array covariance's failure (03)",
          "Wildcards: ?, ? extends T, ? super T",
          "PECS — Producer Extends, Consumer Super — derived, not memorised",
          "Why you cannot add to a List<? extends T>",
          "Wildcard capture and the capture-helper idiom",
          "Unbounded wildcard vs raw type vs Object"
        ]
      },
      {
        "group": "Practical generic API design",
        "items": [
          "When to make an API generic and when it is over-engineering",
          "Generic methods vs generic types",
          "Type tokens (Class<T>) and the super-type-token idiom (16, 23)",
          "Reading real generic signatures in the JDK (Collections, Comparator.comparing, Stream)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "12",
    "id": "12-collections-framework-internal-data-structures",
    "name": "Collections Framework & Internal Data Structures",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "The learner already knows the data structures from DSA; this module is about the JDK's implementations, their contracts, and their real costs.",
    "prerequisites": [
      "07",
      "11"
    ],
    "owns": "The collections hierarchy; List/Set/Map/Queue implementations and internals; iteration; Collections utilities.",
    "topics": [
      {
        "group": "The hierarchy",
        "items": [
          "Iterable → Collection → List, Set, Queue/Deque; Map as a separate root and why",
          "Interface-vs-implementation discipline in declarations (06)",
          "Optional operations and UnsupportedOperationException — a design wart worth discussing honestly",
          "[Java 21+] sequenced collections (SequencedCollection, SequencedSet, SequencedMap) — not on the 17 baseline; mark explicitly"
        ]
      },
      {
        "group": "List",
        "items": [
          "ArrayList: backing array, capacity vs size, growth policy, amortised append, ensureCapacity, trimToSize",
          "LinkedList: doubly-linked nodes, why indexed access is O(n), per-node memory overhead, and why it is almost never the right choice in practice",
          "Why ArrayList usually beats LinkedList even for middle insertion — cache locality vs asymptotics, argued from mechanism",
          "Arrays.asList (fixed-size view), List.of (immutable), Collections .unmodifiableList (view) — three different things"
        ]
      },
      {
        "group": "Map",
        "items": [
          "HashMap internals: buckets, hash() spreading, index derivation, load factor, resize/rehash, treeification of long collision chains, and the null key/value policy",
          "Why key mutation after insertion loses the entry (07)",
          "LinkedHashMap: insertion vs access order; building an LRU cache with removeEldestEntry",
          "TreeMap: red-black tree, NavigableMap operations (floorKey, ceilingKey, headMap, tailMap, subMap), comparator vs natural ordering",
          "Hashtable — legacy, why it is not used",
          "IdentityHashMap, WeakHashMap and reference semantics (15), EnumMap"
        ]
      },
      {
        "group": "Set",
        "items": [
          "HashSet (a HashMap under the hood), LinkedHashSet, TreeSet/ NavigableSet, EnumSet",
          "Set operations and the contract obligations they impose on elements"
        ]
      },
      {
        "group": "Queue and Deque",
        "items": [
          "ArrayDeque — the preferred stack and queue; why the legacy Stack (and Vector) should not be used",
          "PriorityQueue: binary heap, no ordering guarantee on iteration, peek/ poll costs",
          "Blocking queues are Module 19"
        ]
      },
      {
        "group": "Iteration and mutation",
        "items": [
          "Iterator, ListIterator, the enhanced-for desugaring",
          "Fail-fast iteration, modCount, and ConcurrentModificationException — including the single-threaded case",
          "Safe removal: Iterator.remove, removeIf, or a copy",
          "Fail-safe/weakly-consistent iteration in concurrent collections (19)"
        ]
      },
      {
        "group": "Utilities and choosing",
        "items": [
          "Collections: sort, binarySearch, reverse, shuffle, frequency, emptyList, singletonList, nCopies, the unmodifiable views, and the synchronized wrappers (and why they are not enough — 19)",
          "Sizing and load factor as a real tuning decision",
          "A decision framework: ordering needs, null policy, duplicate policy, access pattern, mutation frequency, thread safety, memory",
          "Memory overhead per element, honestly qualified — no invented numbers"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "13",
    "id": "13-nested-classes-lambdas-functional-interfaces",
    "name": "Nested Classes, Lambdas & Functional Interfaces",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "How Java represents behaviour as a value — the mechanism behind every callback, stream operation, and Spring configuration lambda.",
    "prerequisites": [
      "06",
      "11"
    ],
    "owns": "Nested/inner/local/anonymous classes; lambdas; method references; the java.util.function catalogue; closures and capture.",
    "topics": [
      {
        "group": "Nested types",
        "items": [
          "Static nested classes — no outer instance, the default choice",
          "Inner (non-static) classes — the hidden reference to the enclosing instance, Outer.this, outer.new Inner(), and the memory-leak risk of that hidden reference",
          "Local classes — declared inside a method, scoped to it",
          "Anonymous classes — the pre-lambda idiom; still required when you need state or multiple methods",
          "Why nested classes exist: scoping, encapsulation, and cohesion",
          "Compiled output (Outer$Inner, Outer$1) — observable with javap (16)"
        ]
      },
      {
        "group": "Capture rules",
        "items": [
          "Effectively final capture of locals; why Java captures by value while C++ lambdas let you choose, and why JavaScript closures behave differently",
          "Capturing this: an anonymous class captures its own this; a lambda does not have its own this — it captures the enclosing one",
          "The mutable-counter workaround (array/AtomicInteger) and why it is usually a design smell"
        ]
      },
      {
        "group": "Lambdas",
        "items": [
          "Syntax forms; inferred parameter types; expression vs block bodies",
          "Lambdas require a functional interface target type — there is no standalone function type in Java",
          "Target typing and how the same lambda takes different types by context",
          "Lambdas are not syntactic sugar for anonymous classes — they compile via invokedynamic and a bootstrap mechanism, not to a new class file per lambda. Teach the observable consequences (this binding, no .class file per lambda) and verify implementation details against current documentation rather than asserting them (16, 20)",
          "Serialization and debugging characteristics of lambdas; stack traces"
        ]
      },
      {
        "group": "Method references",
        "items": [
          "The four forms: static, bound instance, unbound instance (String::length), and constructor (ArrayList::new)",
          "Ambiguity between bound and unbound forms",
          "When a method reference is clearer than a lambda, and when it is not"
        ]
      },
      {
        "group": "The java.util.function catalogue",
        "items": [
          "Function, BiFunction, UnaryOperator, BinaryOperator",
          "Predicate, BiPredicate; Consumer, BiConsumer; Supplier",
          "Primitive specialisations (IntFunction, ToIntFunction, IntPredicate, …) and the boxing cost they exist to avoid (02)",
          "Composition: andThen, compose, negate, and, or",
          "Writing your own functional interface, and when the JDK already has it",
          "Checked exceptions in lambdas — the real pain point, and the wrapper idioms used to cope (10)"
        ]
      },
      {
        "group": "Functional style in Java, honestly",
        "items": [
          "Where it improves code and where it obscures it",
          "Debuggability and stack-trace quality as real trade-offs",
          "Java is not a functional language; use functional constructs where they earn their place"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "14",
    "id": "14-streams-optional-functional-data-processing",
    "name": "Streams, Optional & Functional Data Processing",
    "part": "Part I — Java Language Core",
    "partNumber": 1,
    "description": "The Streams API is ubiquitous in modern Java, routinely misused, and a reliable source of subtle performance and correctness bugs.",
    "prerequisites": [
      "12",
      "13"
    ],
    "owns": "Stream and its pipeline semantics; collectors; primitive streams; Optional.",
    "topics": [
      {
        "group": "Pipeline model",
        "items": [
          "Source → intermediate operations → terminal operation",
          "Laziness: intermediate ops build a pipeline and do nothing until a terminal op runs — demonstrate with peek",
          "Single-use: a stream cannot be consumed twice (IllegalStateException)",
          "Short-circuiting operations and infinite streams",
          "Streams are not collections — no storage, no indexing, no reuse",
          "Stateless vs stateful operations and why sorted/distinct need buffering"
        ]
      },
      {
        "group": "Creating streams",
        "items": [
          "Collection.stream(), Arrays.stream, Stream.of, Stream.iterate, Stream.generate, IntStream.range/rangeClosed, Files.lines (and closing it — 21), String.chars, Random.ints"
        ]
      },
      {
        "group": "Intermediate operations",
        "items": [
          "filter, map, flatMap, mapMulti (verify availability for the target release), distinct, sorted, limit, skip, peek, takeWhile, dropWhile",
          "flatMap for nested structures — the most commonly misunderstood operation",
          "Ordering guarantees and encounter order; when sorted is wasted work"
        ]
      },
      {
        "group": "Terminal operations",
        "items": [
          "forEach vs forEachOrdered; collect; reduce; count; min/max; anyMatch/allMatch/noneMatch; findFirst/findAny; toArray; toList (verify release availability vs collect(Collectors.toList()))",
          "reduce in all three forms; identity, associativity, and why violating them breaks parallel results"
        ]
      },
      {
        "group": "Collectors",
        "items": [
          "toList, toSet, toMap (and its duplicate-key IllegalStateException), toUnmodifiableList",
          "joining, counting, summingInt, averagingDouble, summarizingInt",
          "groupingBy with downstream collectors; multi-level grouping; partitioningBy",
          "mapping, filtering, flatMapping, collectingAndThen, reducing",
          "Writing a custom Collector: supplier, accumulator, combiner, finisher, characteristics"
        ]
      },
      {
        "group": "Primitive streams",
        "items": [
          "IntStream, LongStream, DoubleStream; boxing/unboxing between them",
          "sum, average, summaryStatistics; OptionalInt and friends",
          "mapToInt/mapToObj/boxed"
        ]
      },
      {
        "group": "Parallel streams — with the warnings up front",
        "items": [
          "parallelStream()/parallel(); the common ForkJoinPool and its shared, global nature",
          "When parallelism helps (large, CPU-bound, splittable, side-effect-free) and when it hurts (small workloads, I/O-bound work, LinkedList sources, contended shared state)",
          "Ordering, findAny vs findFirst, and non-deterministic results",
          "Never mutate shared state in a stream; Collectors vs manual accumulation",
          "Blocking work in the common pool starving unrelated code (17, 18)"
        ]
      },
      {
        "group": "Optional",
        "items": [
          "Its actual purpose: an explicit return-type signal of possible absence",
          "of, ofNullable, empty; map, flatMap, filter, or, ifPresent, ifPresentOrElse, orElse vs orElseGet (eager vs lazy — a real bug source), orElseThrow, stream",
          "Anti-patterns: Optional fields, Optional parameters, Optional in collections, calling get() unguarded, isPresent()/get() chains",
          "Optional is not null safety; it is a documented API contract",
          "Serialization concerns; Optional and JPA/Jackson interplay (23, 36)"
        ]
      },
      {
        "group": "Streams in practice",
        "items": [
          "Readability: when a loop is genuinely better",
          "Debugging pipelines; the stack-trace problem",
          "Performance intuitions, argued mechanically — never quote benchmark numbers that were not measured (20)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "15",
    "id": "15-jvm-architecture-memory-areas-garbage-collection",
    "name": "JVM Architecture, Memory Areas & Garbage Collection",
    "part": "Part II — JVM Internals, Concurrency & Performance",
    "partNumber": 2,
    "description": "The mental model that explains memory behaviour, performance, and the failure modes a C++ programmer will otherwise misdiagnose.",
    "prerequisites": [
      "01",
      "04",
      "12"
    ],
    "owns": "JVM runtime memory areas; object allocation; garbage collection; reference types; memory diagnostics.",
    "topics": [
      {
        "group": "Runtime data areas",
        "items": [
          "Heap; thread stacks and frames; the method area / metaspace; the runtime constant pool; PC registers; native method stacks",
          "Which areas are per-thread and which are shared — the foundation for Module 17",
          "Metaspace vs the pre-Java-8 permanent generation; metaspace exhaustion",
          "Stack frames: local variable array, operand stack, frame data; StackOverflowError and -Xss"
        ]
      },
      {
        "group": "Object allocation and layout",
        "items": [
          "Allocation on the heap; thread-local allocation buffers (TLABs)",
          "Object header, field alignment/padding, and reference size — describe the shape and note it is implementation-specific; use a tool to inspect rather than asserting numbers",
          "Escape analysis and scalar replacement — real optimisations, but never guaranteed; do not promise \"the JVM will stack-allocate this\"",
          "Contrast with C++: no new/delete pairing, no placement new, no manual layout control"
        ]
      },
      {
        "group": "Garbage collection",
        "items": [
          "Reachability and GC roots; why reference counting is not used (cycles)",
          "Mark-sweep, mark-compact, copying collection",
          "Generational hypothesis: young (eden + survivor spaces) and old generation; minor vs major/full collections; promotion and tenuring",
          "Stop-the-world pauses; concurrent and incremental collection strategies",
          "Collectors available in modern JDKs — Serial, Parallel, G1, ZGC, Shenandoah (availability, defaults, and behaviour vary by release and vendor: verify against the JDK documentation for the release being taught)",
          "The throughput vs latency vs footprint trade-off",
          "Basic tuning knobs (-Xms, -Xmx, collector selection) and the discipline of measuring before tuning (20)"
        ]
      },
      {
        "group": "Reference types",
        "items": [
          "Strong, soft, weak, and phantom references; ReferenceQueue",
          "WeakHashMap and cache-shaped use cases (12)",
          "Cleaner as the sanctioned replacement for finalisation (04)"
        ]
      },
      {
        "group": "Memory problems",
        "items": [
          "OutOfMemoryError variants and what each actually indicates",
          "Memory leaks in a GC'd language: static collections, unremoved listeners, ThreadLocal misuse, classloader leaks, inner-class outer references (13)",
          "Heap dumps and analysis; jmap, jcmd, jstat, and heap-analysis tooling",
          "Off-heap memory: direct ByteBuffer (21); note that the Foreign Function & Memory API is beyond the Java 17 baseline — verify status before use"
        ]
      },
      {
        "group": "Execution engine",
        "items": [
          "Interpretation, tiered compilation, C1/C2, the code cache",
          "JIT optimisations: inlining, loop optimisation, deoptimisation",
          "Warm-up and why naive microbenchmarks lie (20)",
          "Class data sharing (CDS) at a conceptual level"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "16",
    "id": "16-class-loading-reflection-annotations-bytecode",
    "name": "Class Loading, Reflection, Annotations & Bytecode",
    "part": "Part II — JVM Internals, Concurrency & Performance",
    "partNumber": 2,
    "description": "The machinery every framework in Part VI is built on. Without this, Spring is magic; with it, Spring is mechanical.",
    "prerequisites": [
      "05",
      "11",
      "15"
    ],
    "owns": "The class-loading subsystem; reflection; annotations; bytecode literacy; dynamic proxies.",
    "topics": [
      {
        "group": "Class loading",
        "items": [
          "The three phases: loading, linking (verification, preparation, resolution), initialisation",
          "Exactly when a class is initialised — and the trace-the-output puzzles that follow (04)",
          "The classloader hierarchy (bootstrap, platform, application) and the parent-delegation model",
          "Custom classloaders: why frameworks and app servers write them",
          "Class identity = fully qualified name + defining classloader; the \"ClassCastException between two identical-looking classes\" problem",
          "NoClassDefFoundError vs ClassNotFoundException, properly explained (01)",
          "Classloader leaks and why they retain metaspace (15)",
          "Class unloading conditions"
        ]
      },
      {
        "group": "Reflection",
        "items": [
          "Class<?>: obtaining it three ways; Class literals vs getClass() vs Class.forName",
          "Inspecting fields, methods, constructors, modifiers, annotations",
          "Instantiating and invoking reflectively; setAccessible and the strong encapsulation restrictions introduced by the module system (24)",
          "Generic type information at runtime: what survives erasure (11), and the super-type-token idiom",
          "Costs: performance, loss of compile-time safety, refactoring hazard",
          "When reflection is legitimate (frameworks, serialization, tooling) and when it is abuse"
        ]
      },
      {
        "group": "Annotations",
        "items": [
          "Declaring annotations; elements, defaults, value() shorthand",
          "@Retention (SOURCE/CLASS/RUNTIME) — the single most important knob, and why RUNTIME is what frameworks need",
          "@Target, @Inherited, @Documented, @Repeatable",
          "Reading annotations reflectively — build a tiny annotation-driven feature to demystify Spring's @Component scanning (33)",
          "Built-in annotations: @Override, @Deprecated, @SuppressWarnings, @FunctionalInterface, @SafeVarargs",
          "Annotation processing at compile time (conceptual overview; note where Lombok and similar tools sit and the trade-offs of using them)"
        ]
      },
      {
        "group": "Bytecode literacy",
        "items": [
          "Reading javap -c output well enough to answer real questions",
          "The stack-based instruction model; the constant pool",
          "The five invocation instructions — invokevirtual, invokestatic, invokespecial, invokeinterface, invokedynamic — mapped back to the dispatch rules of Module 05 and the lambda mechanism of Module 13",
          "Seeing erasure, bridge methods, and synthetic members in compiled output (11)",
          "Seeing what string concatenation and autoboxing actually compile to (02, 03)"
        ]
      },
      {
        "group": "Dynamic proxies and instrumentation",
        "items": [
          "java.lang.reflect.Proxy and InvocationHandler; building an interception proxy by hand — this is the concrete mechanism behind Spring AOP (34)",
          "Interface proxies vs subclass proxies (CGLIB-style), and the consequences for final methods and self-invocation (34)",
          "MethodHandles and VarHandles (conceptual introduction)",
          "Bytecode manipulation libraries and Java agents — awareness level only"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "17",
    "id": "17-concurrency-i",
    "name": "Concurrency I — Threads, Shared State & the Java Memory Model",
    "part": "Part II — JVM Internals, Concurrency & Performance",
    "partNumber": 2,
    "description": "The foundations of correct concurrent Java. The Java Memory Model is the hardest and most interview-critical topic in the language.",
    "prerequisites": [
      "04",
      "12",
      "15"
    ],
    "owns": "Threads; shared mutable state; the JMM; synchronized; volatile; thread-safety design.",
    "topics": [
      {
        "group": "Threads",
        "items": [
          "Creating threads: Thread subclass vs Runnable vs (from 18) executors — and why raw Thread management is discouraged in application code",
          "Thread lifecycle states and Thread.State",
          "start() vs run() — the classic mistake, demonstrated",
          "join, sleep, interrupt; interruption is cooperative, and the InterruptedException handling rules (never swallow it; restore the flag)",
          "Daemon vs non-daemon threads and JVM shutdown (01)",
          "Thread priorities as a hint the scheduler may ignore",
          "UncaughtExceptionHandler; what happens to an exception in a thread",
          "Each thread has its own stack, all share the heap (15)"
        ]
      },
      {
        "group": "Why concurrency is hard",
        "items": [
          "Race conditions — check-then-act, read-modify-write; the non-atomicity of i++ shown in bytecode (16)",
          "Atomicity, visibility, and ordering as three distinct problems; most developers only know about the first",
          "Non-atomic 64-bit reads/writes for non-volatile long/double — a real JLS-permitted behaviour",
          "Compiler, JIT, and CPU reorderings; per-core caches; why \"it worked on my machine\" is meaningless here"
        ]
      },
      {
        "group": "The Java Memory Model",
        "items": [
          "What the JMM is: a specification of visibility and ordering guarantees, not a description of hardware",
          "Happens-before — the central relation, taught properly",
          "program order within a thread",
          "monitor lock release → subsequent acquire",
          "volatile write → subsequent volatile read",
          "Thread.start() → everything in the started thread",
          "everything in a thread → another thread's successful join()",
          "transitivity",
          "Safe publication and the ways to achieve it",
          "Data races and why \"benign race\" is nearly always wrong",
          "final field semantics and the guarantee they give to immutable objects (08) — the reason immutability is a concurrency tool"
        ]
      },
      {
        "group": "synchronized",
        "items": [
          "Intrinsic locks/monitors; every object has one",
          "Synchronized methods vs blocks; the implicit lock object in each case",
          "Static synchronized methods lock the Class object",
          "Reentrancy",
          "Lock granularity; the \"synchronize on a private final lock object\" idiom; why locking on this or on a String literal is dangerous",
          "Deadlock: the four conditions, a reproducible example, consistent lock ordering as the fix, and detection with thread dumps",
          "Livelock and starvation",
          "wait/notify/notifyAll: the mandatory while-loop guard, why if is wrong (spurious wakeups), and why notifyAll is usually correct"
        ]
      },
      {
        "group": "volatile",
        "items": [
          "What it guarantees: visibility and ordering — not atomicity",
          "Where it is sufficient (flags, safe publication of immutable objects, double-checked locking done correctly) and where it is not (counters)",
          "The broken double-checked-locking idiom and its correct volatile form"
        ]
      },
      {
        "group": "Designing for thread safety",
        "items": [
          "Confinement (thread confinement, stack confinement, ThreadLocal — and ThreadLocal leaks in pooled threads: 15)",
          "Immutability as the strongest strategy (08)",
          "Guarded state with documented locking policies",
          "Documenting thread safety as part of the API contract",
          "Thread dumps: taking one, reading it, and finding a deadlock in it"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "18",
    "id": "18-concurrency-ii",
    "name": "Concurrency II — Executors, Futures & Asynchronous Composition",
    "part": "Part II — JVM Internals, Concurrency & Performance",
    "partNumber": 2,
    "description": "The abstractions real applications use — thread pools and composable asynchronous results — plus the failure modes that make them dangerous.",
    "prerequisites": [
      "17"
    ],
    "owns": "The executor framework; thread pools; Future/CompletableFuture; fork/join; async design.",
    "topics": [
      {
        "group": "The executor framework",
        "items": [
          "Executor, ExecutorService, ScheduledExecutorService",
          "Why pooling: thread creation cost, unbounded thread creation as an availability risk",
          "Executors factory methods — newFixedThreadPool, newCachedThreadPool, newSingleThreadExecutor, newScheduledThreadPool, newWorkStealingPool — and why production code usually configures ThreadPoolExecutor directly instead (unbounded queues and unbounded thread counts are the trap)",
          "ThreadPoolExecutor parameters in full: core/max pool size, keep-alive, work queue choice, thread factory, rejection policy — and how they interact (the non-obvious \"queue fills before max threads are created\" behaviour)",
          "Bounded vs unbounded queues; backpressure; rejection handlers",
          "Lifecycle: shutdown vs shutdownNow, awaitTermination, and why an un-shutdown pool keeps the JVM alive (01)",
          "Naming threads for debuggability; custom ThreadFactory"
        ]
      },
      {
        "group": "Tasks and results",
        "items": [
          "Runnable vs Callable; submit vs execute and the swallowed exception difference — a genuinely important production trap",
          "Future: get, blocking, timeouts, cancel and its cooperative nature, isDone/isCancelled",
          "ExecutionException unwrapping",
          "invokeAll, invokeAny",
          "Limitations of Future that motivated CompletableFuture"
        ]
      },
      {
        "group": "CompletableFuture",
        "items": [
          "Creation: completedFuture, supplyAsync, runAsync, manual completion",
          "Composition: thenApply, thenAccept, thenRun, thenCompose (flatMap) vs thenCombine, allOf, anyOf",
          "The *Async variants and which thread actually runs each stage — the most commonly misunderstood part",
          "Executor selection; the default common ForkJoinPool and why passing an explicit executor is usually right",
          "Error handling: exceptionally, handle, whenComplete; how exceptions propagate through a chain",
          "Timeouts (orTimeout, completeOnTimeout)",
          "Comparison with JavaScript Promises and async/await — a useful bridge for this learner, including where the analogy breaks (no single-threaded event loop; Java stages run on real threads)"
        ]
      },
      {
        "group": "Fork/join",
        "items": [
          "The framework, RecursiveTask/RecursiveAction, and work stealing",
          "The common pool — shared, sized from available processors, and used by parallel streams (14); why blocking in it is harmful",
          "Threshold tuning and when recursion decomposition pays off"
        ]
      },
      {
        "group": "Async design concerns",
        "items": [
          "Never block a pool thread on another task in the same pool (self-deadlock)",
          "Thread-pool sizing reasoning for CPU-bound vs I/O-bound work — as a model to reason with, then measured, never a memorised formula",
          "Context propagation across threads (ThreadLocal, MDC-style logging context) and why it silently breaks in async code",
          "Testing asynchronous code deterministically (25)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "19",
    "id": "19-concurrency-iii",
    "name": "Concurrency III — Concurrent Collections, Locks & Virtual Threads",
    "part": "Part II — JVM Internals, Concurrency & Performance",
    "partNumber": 2,
    "description": "The high-level concurrency toolkit — the classes that let you avoid writing lock code by hand — and the modern threading model.",
    "prerequisites": [
      "17",
      "18"
    ],
    "owns": "java.util.concurrent collections; atomics; explicit locks; synchronizers; virtual threads.",
    "topics": [
      {
        "group": "Concurrent collections",
        "items": [
          "Why Collections.synchronizedMap is insufficient: compound operations are still racy, and the single lock destroys throughput (12)",
          "ConcurrentHashMap: internal partitioning/CAS-based updates, weakly consistent iteration (no ConcurrentModificationException), the atomic compound operations (putIfAbsent, compute, computeIfAbsent, merge), the null-key/value prohibition and why, and size() being an estimate under concurrency",
          "CopyOnWriteArrayList/CopyOnWriteArraySet — read-dominant workloads only, and the snapshot-iteration semantics",
          "ConcurrentSkipListMap/ConcurrentSkipListSet — sorted and concurrent",
          "Blocking queues: ArrayBlockingQueue, LinkedBlockingQueue, SynchronousQueue, PriorityBlockingQueue, DelayQueue; put/take vs offer/poll with timeouts; the producer–consumer pattern done properly; bounded queues as backpressure (18)",
          "TransferQueue, ConcurrentLinkedQueue, and non-blocking algorithms at an awareness level"
        ]
      },
      {
        "group": "Atomics",
        "items": [
          "AtomicInteger, AtomicLong, AtomicBoolean, AtomicReference",
          "Compare-and-swap and the hardware primitive behind it; the retry loop",
          "getAndUpdate, updateAndGet, accumulateAndGet, compareAndSet",
          "The ABA problem and AtomicStampedReference",
          "LongAdder/LongAccumulator — striping for high contention, and the trade-off versus AtomicLong",
          "Atomic field updaters and VarHandle at an awareness level (16)"
        ]
      },
      {
        "group": "Explicit locks",
        "items": [
          "Lock/ReentrantLock vs synchronized: what you gain (tryLock, timed and interruptible acquisition, fairness, multiple conditions) and what you pay (manual unlock in finally — a real leak source)",
          "ReadWriteLock/ReentrantReadWriteLock; when read-heavy access justifies it",
          "StampedLock and optimistic reads (awareness level; the non-reentrancy trap)",
          "Condition — the await/signal analogue of wait/notify, with multiple wait sets",
          "AbstractQueuedSynchronizer at a conceptual level: the foundation under these classes"
        ]
      },
      {
        "group": "Synchronizers",
        "items": [
          "CountDownLatch (one-shot), CyclicBarrier (reusable), and how they differ",
          "Semaphore for bounded resource permits",
          "Phaser and Exchanger at an awareness level"
        ]
      },
      {
        "group": "Virtual threads [Java 21+ — not on the Java 17 baseline; mark clearly]",
        "items": [
          "Platform threads vs virtual threads; the carrier-thread model; mounting and unmounting",
          "What problem they solve: blocking I/O with thread-per-request without the thread cost — and why asynchronous callback style becomes less necessary",
          "Creating them; Executors.newVirtualThreadPerTaskExecutor",
          "Pinning (e.g. inside synchronized blocks) and why ReentrantLock may be preferred in code that must scale on virtual threads — verify current behaviour against the JDK documentation for the release in use, since this area has evolved",
          "Why pooling virtual threads is an anti-pattern",
          "ThreadLocal implications at very high thread counts",
          "[preview] structured concurrency — a preview API across several releases; present it as preview, verify its status for the target release, and never present it as stable"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "20",
    "id": "20-performance-engineering-profiling-benchmarking",
    "name": "Performance Engineering, Profiling & Benchmarking",
    "part": "Part II — JVM Internals, Concurrency & Performance",
    "partNumber": 2,
    "description": "Replace performance folklore with measurement. This module exists partly to enforce the project's no-fabricated-numbers rule.",
    "prerequisites": [
      "12",
      "15",
      "17"
    ],
    "owns": "Measurement methodology; profiling tools; benchmarking; JVM tuning; optimisation discipline.",
    "topics": [
      {
        "group": "Methodology first",
        "items": [
          "Measure, do not guess; optimise the measured bottleneck, not the suspected one",
          "Latency vs throughput vs footprint; percentiles (p50/p95/p99) versus averages, and why averages hide the problem",
          "Establishing a baseline; changing one variable at a time",
          "Never quote a performance number you did not measure — and when you do measure, record JDK version, hardware, warm-up, and tool (AI_INSTRUCTIONS.md §4)"
        ]
      },
      {
        "group": "Why naive Java benchmarks are wrong",
        "items": [
          "JIT warm-up and tiered compilation (15)",
          "Dead-code elimination of results you never use",
          "Constant folding of loop-invariant inputs",
          "On-stack replacement; profile pollution; deoptimisation",
          "GC interference and allocation effects between runs",
          "System.nanoTime vs currentTimeMillis and their resolutions"
        ]
      },
      {
        "group": "Benchmarking properly",
        "items": [
          "JMH — why a harness is required rather than optional",
          "Benchmark modes, warm-up and measurement iterations, forks",
          "Blackhole consumption and state objects",
          "Reading JMH output including error margins; distrusting a result with wide variance",
          "Microbenchmarks vs macro/application benchmarks, and when a microbenchmark is answering the wrong question entirely"
        ]
      },
      {
        "group": "Profiling",
        "items": [
          "Sampling vs instrumenting profilers and the bias of each",
          "CPU profiling, allocation profiling, lock-contention profiling",
          "Flame graphs and how to read one",
          "JDK tooling: JFR (Java Flight Recorder), JDK Mission Control, jcmd, jstack, jstat, jmap",
          "Heap analysis for leaks (15)",
          "Profiling in production: overhead, sampling rates, and safety"
        ]
      },
      {
        "group": "Common Java performance issues",
        "items": [
          "Excessive allocation and GC pressure; object churn in hot loops",
          "Boxing in hot paths (02) and primitive-specialised alternatives",
          "String concatenation and regex compilation in loops (03)",
          "Wrong collection choice; missing pre-sizing; poor hash distribution (07, 12)",
          "Lock contention and false sharing (17, 19)",
          "N+1 query patterns — the dominant real-world full-stack performance bug (32)",
          "I/O without buffering (21)",
          "Logging cost in hot paths; guarded and parameterised logging"
        ]
      },
      {
        "group": "JVM tuning",
        "items": [
          "Heap sizing; collector selection and the trade-offs (15)",
          "Reading GC logs and identifying pause problems",
          "Container-aware JVM behaviour: CPU and memory limits, and why an unaware JVM misbehaves in a container (42)",
          "The tuning discipline: measure → hypothesise → change one thing → re-measure"
        ]
      },
      {
        "group": "Optimisation judgement",
        "items": [
          "Algorithmic complexity first — the learner's DSA background is the strongest lever here",
          "Readability vs speed; when the optimisation is not worth it",
          "Premature optimisation, stated precisely rather than as a slogan"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "21",
    "id": "21-files-i-o-nio-2-serialization",
    "name": "Files, I/O, NIO.2 & Serialization",
    "part": "Part III — Platform, I/O & Tooling",
    "partNumber": 3,
    "description": "Reading and writing data correctly — with the right abstraction, the right charset, and no leaked resources.",
    "prerequisites": [
      "03",
      "10",
      "14"
    ],
    "owns": "Streams and readers/writers; NIO.2 file APIs; buffers and channels; serialization.",
    "topics": [
      {
        "group": "The two I/O families",
        "items": [
          "Byte streams (InputStream/OutputStream) vs character streams (Reader/Writer) — choosing correctly is the first decision",
          "The decorator design of java.io (a live example of the pattern — 26): BufferedInputStream, DataInputStream, InputStreamReader",
          "Buffering matters enormously; demonstrate unbuffered vs buffered cost",
          "InputStreamReader/OutputStreamWriter as the byte↔char bridge, and always specifying the Charset — never relying on the platform default (03); note that the default-charset behaviour changed across releases, so verify for the target release",
          "System.in/out/err; redirecting them; Console",
          "Closing correctly with try-with-resources; the wrapping/closing-order subtleties (10)"
        ]
      },
      {
        "group": "NIO.2 (java.nio.file)",
        "items": [
          "Path and Paths/Path.of; Path vs the legacy File, and why Path wins",
          "Files utilities: exists, createDirectories, copy, move, delete, deleteIfExists, size, readAllBytes, readString, writeString, readAllLines, newBufferedReader/newBufferedWriter",
          "Streaming files: Files.lines, Files.walk, Files.find, Files.list — all of which must be closed (a classic leak: they are Streams over open handles — 14)",
          "DirectoryStream, glob patterns, PathMatcher",
          "File attributes, permissions (POSIX vs DOS views), symbolic links",
          "WatchService for change notification",
          "Temporary files and directories; atomic move; StandardCopyOption and StandardOpenOption",
          "FileSystem and FileSystems (including zip filesystems)"
        ]
      },
      {
        "group": "Buffers and channels",
        "items": [
          "ByteBuffer: capacity/position/limit/mark, flip, clear, rewind, compact — the state machine that causes most NIO bugs",
          "Heap vs direct buffers; off-heap memory and its GC implications (15)",
          "FileChannel; memory-mapped files (MappedByteBuffer) and their caveats",
          "Blocking vs non-blocking channels; Selector and multiplexed I/O at a conceptual level, and how virtual threads change the calculus (19)",
          "Endianness in buffers (a genuine surprise for a C++ programmer used to native order)"
        ]
      },
      {
        "group": "Serialization",
        "items": [
          "Serializable, serialVersionUID, transient, and the default mechanism",
          "Externalizable; writeObject/readObject hooks; readResolve/ writeReplace",
          "Java serialization is dangerous: deserialization of untrusted data is a remote-code-execution class of vulnerability; the platform has added filtering mechanisms — teach the risk and the mitigation, and verify the current API surface against JDK documentation",
          "Why modern systems use JSON or another explicit format instead (23)",
          "Versioning and compatibility problems in practice"
        ]
      },
      {
        "group": "Practical I/O",
        "items": [
          "Reading large files without exhausting memory",
          "Line-by-line vs bulk reading; chunked processing",
          "CSV and fixed-width parsing by hand (to understand the problem before reaching for a library)",
          "Resource-safety patterns; the leaked-file-descriptor failure mode"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "22",
    "id": "22-date-time-formatting-internationalization",
    "name": "Date, Time, Formatting & Internationalization",
    "part": "Part III — Platform, I/O & Tooling",
    "partNumber": 3,
    "description": "java.time is both a critical practical API and the best-designed immutable API in the JDK — worth studying as a design specimen.",
    "prerequisites": [
      "08"
    ],
    "owns": "java.time; time zones; formatting/parsing; locales; i18n.",
    "topics": [
      {
        "group": "Why the legacy API failed",
        "items": [
          "Date, Calendar, SimpleDateFormat: mutable, not thread-safe, zero-based months, poor separation of concepts",
          "SimpleDateFormat as a shared static field — a real production bug pattern",
          "Interop: converting legacy types to java.time at system boundaries"
        ]
      },
      {
        "group": "The core types",
        "items": [
          "LocalDate, LocalTime, LocalDateTime — no zone, no instant",
          "Instant — a point on the timeline in UTC",
          "ZonedDateTime, OffsetDateTime, ZoneId, ZoneOffset",
          "Duration (time-based) vs Period (date-based) — and why they are distinct",
          "Year, YearMonth, MonthDay, DayOfWeek, Month",
          "Choosing the right type as a design decision — the most common source of date bugs is picking the wrong one"
        ]
      },
      {
        "group": "Working with time",
        "items": [
          "Immutability and the fluent plus/minus/with API (08)",
          "TemporalAdjusters (first day of month, next Monday, …)",
          "Comparison: isBefore, isAfter, isEqual; ChronoUnit.between",
          "Clock — and why injecting a Clock is what makes time-dependent code testable (25)"
        ]
      },
      {
        "group": "Time zones and correctness",
        "items": [
          "The IANA tz database; zone rules changing over time; JDK tzdata updates",
          "Daylight saving transitions: gaps and overlaps, and what the API does at each; ZonedDateTime resolution rules",
          "Store in UTC, display in local time — the standard rule and its exceptions (future local appointments are the classic counter-example)",
          "Leap seconds and what Java does about them",
          "Persisting temporal values in a database and the column-type choices (28, 31)"
        ]
      },
      {
        "group": "Formatting and parsing",
        "items": [
          "DateTimeFormatter: predefined formatters, patterns, localised styles",
          "ISO-8601 as the interchange default (and the JSON default — 23)",
          "Thread safety of DateTimeFormatter (unlike SimpleDateFormat)",
          "Parsing failures: DateTimeParseException; strict vs lenient resolution"
        ]
      },
      {
        "group": "Internationalization",
        "items": [
          "Locale: language, region, variant; the default locale as a portability hazard",
          "ResourceBundle and message externalisation; property-file encoding",
          "NumberFormat, DecimalFormat, currency formatting",
          "Message formatting with MessageFormat, plurals, and argument ordering",
          "Collation and locale-sensitive sorting (Collator) — and why String.compareTo is not a human-correct ordering (07)",
          "Locale-sensitive case conversion (the Turkish dotless-i problem)",
          "Right-to-left and bidirectional text at an awareness level"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "23",
    "id": "23-networking-http-clients-json-processing",
    "name": "Networking, HTTP Clients & JSON Processing",
    "part": "Part III — Platform, I/O & Tooling",
    "partNumber": 3,
    "description": "How a Java application talks to the rest of the world — the client side of the full stack, and the data format that binds it together.",
    "prerequisites": [
      "10",
      "18",
      "21"
    ],
    "owns": "TCP/socket basics in Java; the HTTP client; JSON binding; URL/URI handling.",
    "topics": [
      {
        "group": "Networking fundamentals in Java",
        "items": [
          "InetAddress, hostnames, DNS resolution and its caching behaviour",
          "Socket/ServerSocket: a minimal TCP client and server, to make HTTP concrete rather than magical",
          "DatagramSocket at an awareness level",
          "Blocking socket I/O, timeouts (connect vs read), and why a missing timeout is an availability bug",
          "Thread-per-connection versus non-blocking versus virtual threads (19)",
          "TLS at a working level: HttpsURLConnection/SSLContext, truststores, certificate validation, and why disabling verification is never the fix"
        ]
      },
      {
        "group": "HTTP as a protocol",
        "items": [
          "Request/response anatomy; methods, status codes, headers, bodies",
          "Idempotency and safety of methods — the basis for REST design (37)",
          "Content negotiation; Content-Type and Accept",
          "Connection reuse/keep-alive; HTTP/2 multiplexing at a conceptual level",
          "Cookies, redirects, and caching headers",
          "The learner's JavaScript fetch experience is the bridge here — make the correspondence explicit",
          "HttpClient, HttpRequest, HttpResponse; the builder APIs",
          "Synchronous send vs asynchronous sendAsync returning CompletableFuture (18)",
          "BodyPublishers and BodyHandlers; streaming bodies",
          "Timeouts, redirect policy, authenticators, proxies",
          "Client reuse — creating one per request is a resource bug",
          "The legacy HttpURLConnection, and why it is not used in new code",
          "Awareness of common third-party clients and where Spring's RestClient/ WebClient fit (37, 40)"
        ]
      },
      {
        "group": "URLs and URIs",
        "items": [
          "URI vs URL and the surprising URL.equals DNS behaviour",
          "Percent-encoding; building query strings safely; encoding pitfalls"
        ]
      },
      {
        "group": "JSON",
        "items": [
          "The JSON data model and its mismatches with Java's type system",
          "Jackson: ObjectMapper, readValue/writeValue, trees (JsonNode) vs data binding",
          "Annotations: @JsonProperty, @JsonIgnore, @JsonInclude, @JsonFormat, @JsonCreator, @JsonAlias, @JsonPropertyOrder",
          "Deserializing generic types with TypeReference — the erasure consequence made concrete (11)",
          "Records and JSON binding; immutable object construction; constructor binding",
          "Optional and java.time support modules; ISO-8601 defaults (14, 22)",
          "Custom serializers/deserializers; polymorphic typing and why unrestricted polymorphic deserialization is a security risk",
          "Failure behaviour: unknown properties, null handling, coercion — configured deliberately, not by accident",
          "ObjectMapper thread safety and reuse; the cost of constructing one",
          "Awareness of alternatives (Gson, JSON-B) and of streaming parsing for very large documents"
        ]
      },
      {
        "group": "Resilience for network calls",
        "items": [
          "Timeouts everywhere; retries with backoff and jitter; idempotency as the precondition for safe retries",
          "Circuit-breaker thinking at a conceptual level",
          "Distinguishing connection failures, read timeouts, and application errors"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "24",
    "id": "24-build-systems-dependency-management-packaging",
    "name": "Build Systems, Dependency Management & Packaging",
    "part": "Part III — Platform, I/O & Tooling",
    "partNumber": 3,
    "description": "Real Java is not compiled by hand. This module makes the build comprehensible rather than copied.",
    "prerequisites": [
      "01",
      "16"
    ],
    "owns": "Maven; Gradle (working literacy); dependency resolution; packaging; JPMS.",
    "topics": [
      {
        "group": "Why a build tool",
        "items": [
          "What javac on the command line cannot scale to: dependencies, multi-module projects, test phases, packaging, reproducibility",
          "Convention over configuration"
        ]
      },
      {
        "group": "Maven",
        "items": [
          "The POM: coordinates (groupId/artifactId/version), packaging, properties",
          "The build lifecycle: the default lifecycle's phases in order, plus the clean and site lifecycles; phases vs goals; what mvn package actually runs. Verify phase/goal details against Maven documentation rather than reciting from memory (AI_INSTRUCTIONS.md §4)",
          "Plugins and goal bindings; maven-compiler-plugin and --release; maven-surefire-plugin (unit) vs maven-failsafe-plugin (integration)",
          "Dependency scopes: compile, provided, runtime, test, system, import — and what each means at compile time versus runtime",
          "Transitive dependencies and the nearest-definition mediation rule; mvn dependency:tree; exclusions; dependencyManagement and BOMs (the mechanism behind Spring Boot's dependency management — 35)",
          "Version conflicts and the diagnosis workflow — a very common real problem",
          "Multi-module (aggregator/reactor) builds; parent POMs; inheritance vs aggregation",
          "Profiles and environment-specific builds",
          "The local repository, remote repositories, SNAPSHOT vs release versions",
          "Reproducibility, offline builds, and the Maven wrapper"
        ]
      },
      {
        "group": "Gradle — working literacy",
        "items": [
          "Why Gradle exists; declarative-with-code build scripts; Groovy vs Kotlin DSL",
          "Configurations (implementation vs api vs compileOnly vs runtimeOnly vs testImplementation) mapped onto Maven scopes",
          "The task graph; incremental builds and the build cache",
          "Reading a Gradle build well enough to work in a Gradle project — this curriculum builds primarily with Maven, and says so"
        ]
      },
      {
        "group": "Packaging and running",
        "items": [
          "JAR structure; the manifest; Main-Class; executable JARs",
          "The \"fat/uber JAR\" problem and the approaches to it; how Spring Boot's executable JAR layout differs from a shaded JAR (35)",
          "WAR files and traditional servlet-container deployment (context, not practice)",
          "jlink custom runtime images and jpackage at an awareness level",
          "Reproducible builds and build metadata"
        ]
      },
      {
        "group": "Java Platform Module System",
        "items": [
          "module-info.java: requires, exports, opens, provides/uses",
          "The module path vs the classpath; automatic and unnamed modules",
          "Strong encapsulation and its concrete effect on reflection — --add-opens, --add-exports, and the InaccessibleObjectException a framework can hit (16)",
          "Split packages",
          "An honest assessment of JPMS adoption in the ecosystem, without overstating or dismissing it"
        ]
      },
      {
        "group": "Dependency hygiene",
        "items": [
          "Choosing dependencies deliberately; transitive weight; supply-chain risk",
          "Vulnerability scanning as part of the build",
          "Keeping versions current; the cost of falling behind"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "25",
    "id": "25-testing-with-junit-5-mockito-test-design",
    "name": "Testing with JUnit 5, Mockito & Test Design",
    "part": "Part III — Platform, I/O & Tooling",
    "partNumber": 3,
    "description": "Testing is a core engineering skill, taught before Spring so it can be used throughout the rest of the curriculum.",
    "prerequisites": [
      "06",
      "10",
      "13"
    ],
    "owns": "JUnit 5; assertions; test doubles and Mockito; test design and quality.",
    "topics": [
      {
        "group": "Why and what to test",
        "items": [
          "The value proposition stated honestly: regression safety, design pressure, documentation",
          "The test pyramid, and the common inversion of it (many slow integration tests, few unit tests)",
          "What is worth testing and what is not; testing behaviour rather than implementation"
        ]
      },
      {
        "group": "JUnit 5",
        "items": [
          "Architecture: Platform, Jupiter, Vintage — and why it matters for tooling",
          "@Test; lifecycle @BeforeEach/@AfterEach/@BeforeAll/@AfterAll",
          "Test instance lifecycle (per-method by default) and @TestInstance",
          "@DisplayName, @Nested, @Tag, @Disabled",
          "Assertions: assertEquals, assertThrows, assertAll, assertTimeout, and the delta-based assertion for floating point (02)",
          "Assumptions vs assertions — skipping versus failing",
          "Parameterized tests: @ValueSource, @CsvSource, @MethodSource, @EnumSource, @ArgumentsSource, and custom argument converters",
          "@RepeatedTest; dynamic tests with @TestFactory",
          "Extensions (@ExtendWith) and the extension model that replaced JUnit 4 runners/rules; @TempDir",
          "Test ordering and why depending on it is a design smell",
          "Migrating from JUnit 4 (annotation and assertion differences)"
        ]
      },
      {
        "group": "Assertion libraries",
        "items": [
          "AssertJ fluent assertions and why they read better for collections and objects; soft assertions",
          "Custom assertions for domain types"
        ]
      },
      {
        "group": "Test doubles",
        "items": [
          "The taxonomy: dummy, stub, spy, mock, fake — used precisely, since the terms are routinely conflated",
          "When a hand-written fake beats a mock"
        ]
      },
      {
        "group": "Mockito",
        "items": [
          "mock, @Mock, @InjectMocks, MockitoExtension",
          "Stubbing: when/thenReturn, thenThrow, thenAnswer, consecutive stubs",
          "Verification: verify, times, never, atLeast, inOrder, verifyNoMoreInteractions",
          "Argument matchers and the \"all-or-nothing matcher\" rule; ArgumentCaptor",
          "Spies and partial mocks; doReturn vs when on a spy",
          "Mocking statics and constructors — possible, and usually a design signal",
          "Strict stubs and unnecessary-stubbing failures",
          "Over-mocking: tests that assert their own implementation and break on every refactor"
        ]
      },
      {
        "group": "Test design and quality",
        "items": [
          "Arrange–Act–Assert; one logical assertion per test",
          "Naming that states the behaviour under test",
          "Deterministic tests: no wall-clock dependence (inject Clock — 22), no randomness without a seed, no network, no ordering dependence",
          "Testing exceptions and error paths (10)",
          "Testing concurrent code: the flakiness problem, avoiding sleep, latches, and repeated-execution strategies (17, 18)",
          "Test data builders and object mothers",
          "Coverage as a diagnostic, never a target; why 100% coverage proves little",
          "Mutation testing as a stronger signal (awareness level)",
          "TDD: the red-green-refactor loop, presented with its real trade-offs rather than as dogma",
          "Fixing flaky tests instead of retrying them",
          "Running tests in the build: Surefire vs Failsafe, and fast feedback (24)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "26",
    "id": "26-design-patterns-solid-in-idiomatic-java",
    "name": "Design Patterns & SOLID in Idiomatic Java",
    "part": "Part IV — Design & Architecture",
    "partNumber": 4,
    "description": "Patterns as they actually appear in the JDK and in Spring — not as a catalogue to memorise. Every pattern here is taught against real library code the learner will meet in Part VI.",
    "prerequisites": [
      "05",
      "06",
      "13"
    ],
    "owns": "SOLID; GoF patterns in Java; pattern selection judgement.",
    "topics": [
      {
        "group": "SOLID, precisely",
        "items": [
          "Single responsibility — \"one reason to change\", and why the common reading of it is too vague to use",
          "Open/closed — via interfaces and composition, with a concrete refactor",
          "Liskov substitution — the contract view (preconditions, postconditions, invariants); the square/rectangle example and why it is really about contracts, not shapes (05)",
          "Interface segregation — role interfaces; the fat-interface smell (06)",
          "Dependency inversion — depend on abstractions; this is exactly the principle the Spring container mechanises (33)",
          "Where SOLID is over-applied, and the cost of interface-per-class"
        ]
      },
      {
        "group": "Creational patterns",
        "items": [
          "Singleton — enum singleton, holder idiom, the broken double-checked locking and its correct volatile form (17), and why singletons are a testability problem that DI solves better (33)",
          "Factory method and abstract factory; static factory methods as the everyday Java form (04)",
          "Builder — for many-parameter and immutable objects (08); JDK and library examples",
          "Prototype — and its relationship to the Cloneable mess (07)",
          "Object pooling and when it is justified (connection pools — 30)"
        ]
      },
      {
        "group": "Structural patterns",
        "items": [
          "Adapter — bridging incompatible interfaces",
          "Decorator — java.io is a decorator system, studied directly (21)",
          "Proxy — java.lang.reflect.Proxy, and the mechanism behind Spring AOP and transactional proxies (16, 34, 36)",
          "Facade — service layers as facades (27)",
          "Composite — tree structures; the DOM as the learner's existing example",
          "Flyweight — Integer cache and string interning as JDK instances (02, 03)",
          "Bridge — separating abstraction from implementation (JDBC drivers — 30)"
        ]
      },
      {
        "group": "Behavioural patterns",
        "items": [
          "Strategy — the most useful pattern in modern Java; a lambda often is the strategy (13); Comparator as the canonical example (07)",
          "Template method — abstract classes; Spring's *Template classes are named after it (30, 36)",
          "Observer — listeners; Spring application events (34)",
          "Chain of responsibility — servlet filters and the Spring Security filter chain (39)",
          "Command — Runnable/Callable as commands (18)",
          "Iterator — already in the language (12)",
          "State — enums with per-constant behaviour (09)",
          "Visitor — and how sealed types plus pattern matching supersede much of it (09)",
          "Memento, mediator, interpreter at an awareness level"
        ]
      },
      {
        "group": "Modern Java's effect on patterns",
        "items": [
          "Lambdas collapse strategy, command, and many callbacks into functions",
          "Records and sealed types change how variant data is modelled (08, 09)",
          "Which patterns are workarounds for missing language features and which are genuinely structural"
        ]
      },
      {
        "group": "Judgement",
        "items": [
          "Pattern overuse as a real and common failure; naming things \"…Factory\" is not design",
          "Choosing the simplest structure that works; refactoring toward a pattern when the need appears, rather than designing to one up front",
          "Anti-patterns: god object, anaemic domain model (revisited in 27), service locator vs dependency injection, premature abstraction"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "27",
    "id": "27-application-architecture-clean-code-domain-modeling",
    "name": "Application Architecture, Clean Code & Domain Modeling",
    "part": "Part IV — Design & Architecture",
    "partNumber": 4,
    "description": "Structure at the application level — the decisions that determine whether a codebase stays workable, and the vocabulary needed for the Spring modules that follow.",
    "prerequisites": [
      "26"
    ],
    "owns": "Layering; domain modelling; package structure; clean-code practice; API design; logging.",
    "topics": [
      {
        "group": "Layered architecture",
        "items": [
          "The conventional layers — presentation (controller), application/service, domain, persistence (repository) — and the responsibility of each",
          "Dependency direction and why it must point inward",
          "DTOs vs domain entities vs persistence entities: why conflating them causes lazy-loading leaks, serialization surprises, and coupled APIs (31, 32, 37)",
          "Mapping between layers: by hand, or with a mapper; the trade-off",
          "Where validation belongs (and why it usually belongs in more than one place — 38)",
          "Where transactions belong — the service layer, and why (30, 36)"
        ]
      },
      {
        "group": "Alternative architectures",
        "items": [
          "Hexagonal / ports and adapters; clean architecture; onion architecture — their shared core idea and their differences, stated plainly",
          "Package-by-layer vs package-by-feature, with the honest trade-offs",
          "Modular monolith as the sane default; when service extraction is justified",
          "Distributed systems fundamentals at the level needed to make that call: network partition, latency, partial failure, eventual consistency, the cost of a network hop where a method call used to be (42)"
        ]
      },
      {
        "group": "Domain modelling",
        "items": [
          "Entities (identity) vs value objects (equality by value — 07, 08)",
          "Aggregates and consistency boundaries",
          "Repositories as a domain concept, distinct from the persistence framework that implements them (36)",
          "Domain services vs application services",
          "Anaemic domain model — the debate presented fairly, including why the anaemic style dominates Spring codebases in practice",
          "Ubiquitous language; naming as design work",
          "Invariants enforced in constructors; making illegal states unrepresentable (08, 09)"
        ]
      },
      {
        "group": "Clean code in practice",
        "items": [
          "Naming; function size and single level of abstraction; parameter counts",
          "Comments that explain why, not what; the comment that duplicates the code as a maintenance liability",
          "Guard clauses over deep nesting; early return",
          "Null-handling strategy at boundaries; Optional used correctly (14)",
          "Command–query separation",
          "Code smells and the corresponding refactorings; refactoring safely behind tests (25)",
          "Cyclomatic complexity, coupling, and cohesion as diagnostics",
          "Honest framing: \"clean code\" contains genuine consensus and genuine controversy — teach the reasoning, flag the disputed parts, and do not present style preference as fact"
        ]
      },
      {
        "group": "API design (in-process)",
        "items": [
          "Designing for the caller; minimal surface area; naming consistency",
          "Fail fast; precondition validation; Objects.requireNonNull (10)",
          "Immutable parameters and return values; defensive copying (08)",
          "Documenting contracts with Javadoc: @param, @return, @throws, and documenting thread-safety and nullability",
          "Deprecation and evolution; backward compatibility as a real constraint"
        ]
      },
      {
        "group": "Logging and diagnosability",
        "items": [
          "The facade/implementation split (SLF4J plus a backend such as Logback); why the facade exists",
          "Levels used meaningfully; parameterised logging (log.debug(\"x={}\", x)) and why string concatenation in a log call is wasteful",
          "Structured logging; correlation/trace IDs; MDC and its breakage in async code (18)",
          "Never log secrets, credentials, tokens, or personal data (07 — toString discipline; 39 — security)",
          "Logging versus exception handling: log once, at the right boundary"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "28",
    "id": "28-relational-database-design-sql-foundations",
    "name": "Relational Database Design & SQL Foundations",
    "part": "Part V — Data & Persistence",
    "partNumber": 5,
    "description": "Persistence is where most full-stack performance and correctness problems live. SQL is taught before JPA deliberately, so the ORM never becomes magic.",
    "prerequisites": [],
    "owns": "The relational model; schema design; normalisation; DDL; core DML; constraints; transactions (conceptual).",
    "topics": [
      {
        "group": "The relational model",
        "items": [
          "Relations, tuples, attributes; the set-based mindset versus the imperative loop-based mindset the learner arrives with — this shift is the module's central goal",
          "Primary keys, candidate keys, composite keys, foreign keys",
          "Natural vs surrogate keys — the real trade-offs",
          "NULL semantics and three-valued logic: NULL = NULL is not true; IS NULL; NULLs in aggregates, in NOT IN, and in unique constraints",
          "Data types: integer/numeric/decimal, character types, boolean, temporal types, UUID, JSON columns; why money is DECIMAL, never floating point (02)",
          "Storing temporal values correctly; timezone-aware versus naive columns (22)"
        ]
      },
      {
        "group": "Schema design",
        "items": [
          "Normalisation through 1NF, 2NF, 3NF, and BCNF — derived from the anomalies they prevent, not memorised as definitions",
          "Deliberate denormalisation and when it is justified",
          "One-to-one, one-to-many, and many-to-many modelling; join/junction tables",
          "Modelling inheritance in a relational schema — single table, table per type, table per concrete class — and their trade-offs (this returns as the JPA inheritance strategies in 31)",
          "Soft deletes, audit columns, and optimistic-locking version columns (32)",
          "Schema evolution and migration thinking (tooling: 36)"
        ]
      },
      {
        "group": "DDL",
        "items": [
          "CREATE/ALTER/DROP for tables, columns, and constraints",
          "Constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT",
          "Referential-integrity actions: ON DELETE/ON UPDATE CASCADE, RESTRICT, SET NULL — and why cascading deletes surprise people",
          "Identity/sequence/auto-increment columns and their portability differences",
          "Why constraints belong in the database and not only in application code"
        ]
      },
      {
        "group": "Core DML",
        "items": [
          "SELECT, WHERE, ORDER BY, DISTINCT, LIMIT/OFFSET (and the portability differences between dialects)",
          "INSERT (including multi-row and INSERT … SELECT), UPDATE, DELETE",
          "Logical order of evaluation (FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT) and why it explains so many errors, such as aliases being unusable in WHERE",
          "Operators: comparison, BETWEEN, IN, LIKE, pattern matching, CASE",
          "COALESCE, NULLIF, and null-safe comparison"
        ]
      },
      {
        "group": "Transactions, conceptually",
        "items": [
          "ACID, each property explained with a failure it prevents",
          "BEGIN/COMMIT/ROLLBACK",
          "Isolation levels and the anomalies they permit — dirty read, non-repeatable read, phantom read — as a table the learner can reason from",
          "Locking basics: shared vs exclusive, row vs table",
          "Deadlocks in the database and how they surface to the application",
          "Note that isolation-level defaults and implementations differ by database — verify per engine rather than assuming (mechanics in 30)"
        ]
      },
      {
        "group": "Working environment",
        "items": [
          "Choosing an engine for the curriculum (PostgreSQL as the reference, with H2 for tests); the discipline of noting dialect-specific behaviour",
          "Client tooling; reading a schema; psql-style exploration"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "29",
    "id": "29-advanced-sql",
    "name": "Advanced SQL — Joins, Aggregation, Window Functions & Query Tuning",
    "part": "Part V — Data & Persistence",
    "partNumber": 5,
    "description": "The querying and performance depth that separates someone who \"knows SQL\" from someone who can diagnose a slow production query.",
    "prerequisites": [
      "28"
    ],
    "owns": "Joins; aggregation; subqueries and CTEs; window functions; indexing; execution plans.",
    "topics": [
      {
        "group": "Joins",
        "items": [
          "INNER, LEFT/RIGHT/FULL OUTER, CROSS, self-joins",
          "NATURAL JOIN and USING — and why explicit ON is safer",
          "Join conditions in ON versus WHERE for outer joins — a semantic difference that silently converts an outer join to an inner one",
          "Multi-table joins; join order versus the optimiser's freedom to reorder",
          "Accidental row multiplication when joining one-to-many, and why it corrupts aggregates — the root cause of many \"wrong total\" bugs",
          "Anti-joins and semi-joins; NOT EXISTS versus NOT IN with NULLs (28)",
          "Join algorithms — nested loop, hash join, merge join — and the conditions that favour each"
        ]
      },
      {
        "group": "Aggregation",
        "items": [
          "COUNT (and COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col)), SUM, AVG, MIN, MAX",
          "GROUP BY semantics and grouping-column rules",
          "HAVING versus WHERE — filtering before versus after aggregation",
          "NULL behaviour in aggregates",
          "GROUPING SETS, ROLLUP, CUBE (dialect-dependent — verify per engine)",
          "String and array aggregation (dialect-specific)"
        ]
      },
      {
        "group": "Subqueries and CTEs",
        "items": [
          "Scalar, row, and table subqueries",
          "Correlated subqueries and their cost model",
          "EXISTS versus IN versus a join — and when they are and are not equivalent",
          "Derived tables",
          "Common table expressions (WITH) for readability; materialisation behaviour differs by engine",
          "Recursive CTEs for hierarchies and graphs — where the learner's DSA background pays off directly"
        ]
      },
      {
        "group": "Window functions",
        "items": [
          "OVER (PARTITION BY … ORDER BY …) and how windows differ from GROUP BY",
          "Ranking: ROW_NUMBER, RANK, DENSE_RANK, NTILE",
          "Offset: LAG, LEAD, FIRST_VALUE, LAST_VALUE",
          "Aggregates as window functions; running totals and moving averages",
          "Frame clauses (ROWS vs RANGE) and the default frame surprise",
          "Deduplication and top-N-per-group as canonical window-function solutions"
        ]
      },
      {
        "group": "Set operations",
        "items": [
          "UNION vs UNION ALL (and the deduplication cost), INTERSECT, EXCEPT"
        ]
      },
      {
        "group": "Indexing",
        "items": [
          "B-tree structure and why it supports range queries and ordering",
          "Clustered vs non-clustered indexes; heap versus index-organised storage",
          "Composite indexes and column order; the leftmost-prefix rule",
          "Covering indexes and index-only scans",
          "Unique, partial/filtered, expression/functional indexes; hash, GIN/GiST-style indexes (engine-specific — verify)",
          "Why an index is not used: functions applied to the indexed column, leading wildcards, implicit type conversion, low selectivity",
          "The write cost of indexes; over-indexing as a real problem",
          "Index maintenance, bloat, and statistics"
        ]
      },
      {
        "group": "Execution plans and tuning",
        "items": [
          "EXPLAIN and EXPLAIN ANALYZE; estimated versus actual rows",
          "Reading scan nodes (sequential, index, index-only, bitmap), join nodes, and sort/aggregate nodes",
          "Cost estimation and the role of statistics; stale statistics as a cause of bad plans",
          "Identifying the actual bottleneck rather than the biggest number",
          "A tuning workflow: reproduce → measure → plan → change one thing → re-measure (20)",
          "LIMIT/OFFSET pagination degradation at depth, and keyset (seek) pagination as the fix — directly relevant to API design (38)",
          "Query anti-patterns: SELECT *, N+1 at the SQL level, per-row functions, implicit conversions, over-fetching"
        ]
      },
      {
        "group": "Beyond queries",
        "items": [
          "Views and materialised views",
          "Stored procedures and functions — capabilities and the maintainability argument against overusing them",
          "Triggers and why they surprise application developers",
          "Bulk operations and batching (30)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "30",
    "id": "30-jdbc-connection-pooling-transaction-management",
    "name": "JDBC, Connection Pooling & Transaction Management",
    "part": "Part V — Data & Persistence",
    "partNumber": 5,
    "description": "The layer JPA sits on. Everything Hibernate does eventually becomes JDBC, and debugging persistence problems requires seeing that.",
    "prerequisites": [
      "10",
      "21",
      "28"
    ],
    "owns": "The JDBC API; statements and result sets; connection pooling; transaction control in Java; batching.",
    "topics": [
      {
        "group": "JDBC architecture",
        "items": [
          "The API/driver split as a bridge pattern (26); driver types; auto-loading via the service-provider mechanism (24)",
          "DriverManager versus DataSource — and why DataSource is what applications use",
          "JDBC URLs and connection properties"
        ]
      },
      {
        "group": "Core API",
        "items": [
          "Connection, Statement, PreparedStatement, CallableStatement, ResultSet",
          "PreparedStatement always: SQL injection prevention and server-side plan reuse. Demonstrate an injection against a Statement, then close it — teaching the vulnerability so it is understood and never written",
          "Parameter binding, types, and null binding",
          "ResultSet navigation, type mapping, wasNull, and the getter pitfalls",
          "Generated keys retrieval",
          "SQLException: SQLState, vendor codes, chained exceptions, and why raw SQLException should not leak into upper layers (10, 27)",
          "Resource management: Connection, Statement, and ResultSet all must be closed; try-with-resources; the leaked-connection failure mode that takes down an application under load (10)",
          "DatabaseMetaData and ResultSetMetaData"
        ]
      },
      {
        "group": "Transactions in Java",
        "items": [
          "Auto-commit — on by default, and why that is a trap",
          "Explicit commit/rollback; savepoints and partial rollback",
          "Setting the isolation level from JDBC; the defaults vary by database (28) — verify per engine",
          "Transaction scope and duration; why a long transaction holds locks and connections and harms concurrency",
          "Pessimistic locking (SELECT … FOR UPDATE) versus optimistic locking with a version column (32)",
          "Handling deadlocks and serialisation failures; safe retry (23 — retry with backoff, and idempotency as its precondition)",
          "Distributed transactions and two-phase commit — awareness level, plus an honest note on why they are usually avoided"
        ]
      },
      {
        "group": "Connection pooling",
        "items": [
          "Why connections are expensive; what pooling actually reuses",
          "HikariCP as the reference implementation: pool size, connection timeout, idle timeout, max lifetime, leak detection",
          "Pool sizing reasoning — bigger is not better; the pool interacts with database limits and with thread pools (18)",
          "Pool exhaustion: how it presents, how to diagnose it, and its usual cause (leaked or long-held connections)",
          "Connection validation and recovery from database restarts"
        ]
      },
      {
        "group": "Batching and bulk work",
        "items": [
          "addBatch/executeBatch; batch size; when batching helps and when it does not",
          "Round-trip cost as the dominant factor in bulk work",
          "Streaming large result sets; fetch size and why a default fetch can load a whole table into memory"
        ]
      },
      {
        "group": "Above raw JDBC",
        "items": [
          "JdbcTemplate as a template-method wrapper that removes the boilerplate and the resource-leak risk (26, 36)",
          "Row mappers; SimpleJdbcInsert; named parameters",
          "When plain SQL beats an ORM — reporting, bulk operations, complex queries (a decision revisited in 31–32)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "31",
    "id": "31-jpa-hibernate-i",
    "name": "JPA & Hibernate I — Entities, Mapping & the Persistence Context",
    "part": "Part V — Data & Persistence",
    "partNumber": 5,
    "description": "ORM as a mechanism rather than magic. The persistence context is the single most misunderstood object in enterprise Java.",
    "prerequisites": [
      "07",
      "28",
      "30"
    ],
    "owns": "JPA entity mapping; the persistence context; entity lifecycle; JPQL; identifier strategies.",
    "topics": [
      {
        "group": "ORM fundamentals",
        "items": [
          "The object–relational impedance mismatch, stated concretely: identity, inheritance, associations, granularity, navigation",
          "JPA (the specification) versus Hibernate (an implementation); note that Jakarta Persistence uses the jakarta.persistence namespace in the versions used with Spring Boot 3 — verify namespace and version against the actual project dependencies (24, 35)",
          "What an ORM does for you, and what it makes harder"
        ]
      },
      {
        "group": "Entity mapping",
        "items": [
          "@Entity, @Table, the no-arg constructor requirement, why entities must not be final, and why a record cannot be an entity (08)",
          "@Id and identifier generation: IDENTITY, SEQUENCE, TABLE, AUTO — and the practical differences, including how IDENTITY defeats JDBC batch inserts (30)",
          "Natural versus surrogate identifiers in the mapping (28)",
          "@Column attributes; @Basic; @Transient; field versus property access and why mixing them causes surprises",
          "@Enumerated — ORDINAL is a bug waiting to happen; use STRING (09)",
          "@Lob, @Version (32), temporal mapping with java.time types (22)",
          "@Embeddable/@Embedded for value objects (08, 27); @EmbeddedId and composite keys with @IdClass",
          "Attribute converters (AttributeConverter) for custom types",
          "Inheritance strategies: SINGLE_TABLE, JOINED, TABLE_PER_CLASS, @MappedSuperclass — mapped back to the relational modelling choices of Module 28, with their query costs"
        ]
      },
      {
        "group": "The persistence context",
        "items": [
          "EntityManager, EntityManagerFactory, persistence unit",
          "The persistence context as a first-level cache and an identity map — guaranteeing that one entity instance represents one row within a context",
          "Entity lifecycle states: transient/new, managed/persistent, detached, removed — and every transition between them",
          "persist, merge (and why merge is not update — it returns a managed copy), remove, find, getReference (lazy proxy), detach, clear, refresh",
          "Automatic dirty checking: changing a managed entity's field persists without any save call — the single biggest conceptual leap, and the source of both convenience and surprise",
          "Flush: when it happens (commit, before query execution, explicit), FlushModeType, and why flush order is not statement order",
          "The write-behind queue and how it batches statements",
          "LazyInitializationException — its exact cause (a detached proxy), and the ways to avoid it, including why \"open session in view\" is a workaround with real costs (32, 37)",
          "Persistence context scope: transaction-scoped versus extended"
        ]
      },
      {
        "group": "Relationships",
        "items": [
          "@OneToOne, @OneToMany, @ManyToOne, @ManyToMany",
          "Owning side versus inverse side and mappedBy — getting this wrong produces phantom updates or lost associations",
          "Bidirectional consistency and the helper-method idiom",
          "@JoinColumn, @JoinTable",
          "FetchType.LAZY versus EAGER, and why eager is almost always wrong (defaults differ by relationship type — verify)",
          "Cascade types and orphanRemoval; the danger of CascadeType.REMOVE",
          "Why @ManyToMany is usually better modelled as an explicit join entity",
          "Collection mapping: List versus Set versus Map, and the effect of entity equals/hashCode on Set behaviour",
          "Why the default implementations break across the transient→managed transition when the ID is generated",
          "The standard approaches and their trade-offs; using a business key where one exists (07)"
        ]
      },
      {
        "group": "Querying",
        "items": [
          "JPQL: entity-oriented queries, SELECT, joins, JOIN FETCH, parameters, projections into DTOs with constructor expressions",
          "Named queries; dynamic queries",
          "The Criteria API and the metamodel — type-safe but verbose; when it is worth it",
          "Native queries and mapping their results",
          "Pagination in JPA and the \"pagination with a fetch join\" in-memory trap"
        ]
      },
      {
        "group": "Configuration",
        "items": [
          "persistence.xml versus Spring Boot's auto-configuration (35)",
          "Dialects; hibernate.ddl-auto and why update must never be used against a production database (migrations belong in a migration tool — 36)",
          "Logging generated SQL, with bind parameters, as a debugging necessity"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "32",
    "id": "32-jpa-hibernate-ii",
    "name": "JPA & Hibernate II — Relationships, Fetching, Caching & Performance",
    "part": "Part V — Data & Persistence",
    "partNumber": 5,
    "description": "Where ORM projects actually fail. The N+1 problem alone accounts for an enormous share of real full-stack performance defects.",
    "prerequisites": [
      "31"
    ],
    "owns": "Fetching strategies; the N+1 problem; caching layers; locking; batching; ORM performance diagnosis.",
    "topics": [
      {
        "group": "The N+1 select problem",
        "items": [
          "Exactly how it arises from lazy associations in a loop",
          "Detecting it: SQL logging, statement counting, query assertions in tests (41), and application monitoring (42)",
          "Fixes, with the trade-offs of each",
          "JOIN FETCH in JPQL",
          "entity graphs (@NamedEntityGraph, @EntityGraph)",
          "batch fetching (@BatchSize)",
          "subselect fetching",
          "DTO projections that avoid loading entities at all",
          "The JOIN FETCH + pagination trap — Hibernate falling back to in-memory pagination, and why that is dangerous on large data sets",
          "The MultipleBagFetchException when fetching two collections, and the standard remedies",
          "Cartesian products from multiple fetch joins, and the row multiplication behind them (29)"
        ]
      },
      {
        "group": "Fetching strategy design",
        "items": [
          "Lazy by default, fetch what the use case needs, per query",
          "Fetch plans belong to the query, not to the mapping — the central lesson",
          "Projections: interface-based and class-based DTO projections; selecting only required columns",
          "Read-only queries and why they let Hibernate skip dirty-check bookkeeping",
          "@Transactional(readOnly = true) and what it actually does (36)",
          "Streaming and scrolling large result sets without exhausting the heap; EntityManager.clear() in batch loops"
        ]
      },
      {
        "group": "Caching",
        "items": [
          "First-level cache — the persistence context; per-transaction; always on (31)",
          "Second-level cache — per session factory, shared across transactions; providers; region configuration; entity, collection, and query caches",
          "Cache concurrency strategies (read-only, read-write, nonstrict-read-write, transactional) and when each is safe",
          "The query cache and why it is easy to misuse (it caches identifiers, and depends on the second-level cache to be useful)",
          "Cache invalidation, staleness, and correctness in a clustered deployment",
          "When not to cache; measuring first (20)",
          "Application-level caching as an alternative (40)"
        ]
      },
      {
        "group": "Locking and concurrency",
        "items": [
          "Optimistic locking with @Version; OptimisticLockException; how it surfaces to the user and how to recover",
          "Pessimistic locking modes (PESSIMISTIC_READ, PESSIMISTIC_WRITE, PESSIMISTIC_FORCE_INCREMENT), lock timeouts, and deadlock risk (30)",
          "Lost-update scenarios and choosing a strategy deliberately",
          "Long conversations and detached-entity update patterns"
        ]
      },
      {
        "group": "Write performance",
        "items": [
          "JDBC batch settings for inserts and updates; why IDENTITY generation prevents batching and what to use instead (30, 31)",
          "order_inserts/order_updates; insert ordering across entity types",
          "Bulk update and delete via JPQL — and the fact that they bypass the persistence context, leaving it stale",
          "When to drop to native SQL or JdbcTemplate for bulk work (30)",
          "The clear-and-flush pattern for large batch jobs"
        ]
      },
      {
        "group": "Diagnosis workflow",
        "items": [
          "Turning on SQL logging with parameters; statement counting per request",
          "Hibernate statistics; slow-query logging",
          "Correlating ORM behaviour with database execution plans (29)",
          "A checklist for \"the page is slow\": statement count, fetch strategy, indexes, transaction duration, connection-pool wait",
          "Knowing when the ORM is the wrong tool for a given operation"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "33",
    "id": "33-spring-framework-core",
    "name": "Spring Framework Core — IoC Container, Beans & Dependency Injection",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "Spring's container, explained as the mechanical consequence of Modules 06, 16, and 26 — reflection plus annotations plus dependency inversion. No magic is permitted in this module.",
    "prerequisites": [
      "06",
      "16",
      "26"
    ],
    "owns": "Inversion of control; the ApplicationContext; bean definition; dependency injection; bean scopes.",
    "topics": [
      {
        "group": "Inversion of control",
        "items": [
          "The problem: new inside a class hard-wires its collaborators and destroys testability",
          "IoC as the inversion of who constructs and wires (26 — dependency inversion)",
          "DI versus the service-locator alternative, compared honestly",
          "What the container actually is: a registry that reads metadata, instantiates via reflection, and injects — connect this directly to the miniature DI container built in Module 16"
        ]
      },
      {
        "group": "Container and configuration",
        "items": [
          "BeanFactory versus ApplicationContext and what the latter adds",
          "Configuration styles: annotation-based with @Configuration/@Bean, component scanning, and XML (legacy — recognition only)",
          "@Component and its stereotypes @Service, @Repository, @Controller; what each conveys, and that @Repository also enables exception translation (36)",
          "@ComponentScan and base packages; how scanning finds candidates",
          "@Import; configuration class composition",
          "@Configuration proxying versus \"lite\" @Bean mode, and the inter-bean method-call behaviour that follows from it"
        ]
      },
      {
        "group": "Dependency injection",
        "items": [
          "Constructor injection as the default — required dependencies, immutable fields, testable without the container, and it makes circular dependencies fail loudly",
          "Setter injection for genuinely optional dependencies",
          "Field injection and why this curriculum rejects it — untestable without reflection, hides dependency count, cannot be final",
          "Single-constructor implicit injection (no @Autowired needed)",
          "Ambiguity resolution: @Qualifier, @Primary, bean naming, injection by type versus by name",
          "Injecting collections and maps of beans — a genuinely useful strategy mechanism (26)",
          "@Value, property placeholders, SpEL basics (34)",
          "ObjectProvider and lazy injection for optional or deferred dependencies",
          "Circular dependencies: why they happen, why constructor injection surfaces them, and why the fix is a design change rather than @Lazy"
        ]
      },
      {
        "group": "Bean lifecycle",
        "items": [
          "Definition → instantiation → population → aware callbacks → BeanPostProcessor before-init → init callbacks → post-init (where proxies are created) → ready → destruction callbacks",
          "@PostConstruct/@PreDestroy, InitializingBean/DisposableBean, @Bean(initMethod, destroyMethod) — and which to prefer",
          "BeanPostProcessor and BeanFactoryPostProcessor — the extension points that make AOP, @Value resolution, and much of Spring Boot work (34)",
          "Aware interfaces and why depending on them couples you to the container",
          "Why the proxy is created after initialisation, and how that explains the self-invocation problem (34, 36)"
        ]
      },
      {
        "group": "Scopes",
        "items": [
          "singleton (the default — one per container, not one per JVM) and prototype",
          "Web scopes: request, session, application, websocket",
          "Injecting a shorter-lived bean into a longer-lived one, and scoped proxies as the fix",
          "Singleton beans must be stateless or thread-safe — the concurrency obligation most Spring developers never think about (17)",
          "Eager versus lazy initialisation and the startup-time trade-off"
        ]
      },
      {
        "group": "Container behaviour in practice",
        "items": [
          "Reading a Spring startup failure and finding the actual bean problem",
          "NoSuchBeanDefinitionException, NoUniqueBeanDefinitionException, UnsatisfiedDependencyException — diagnosing each",
          "Inspecting the beans a context actually created"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "34",
    "id": "34-spring-aop-configuration-profiles-application-context-lifecycle",
    "name": "Spring AOP, Configuration, Profiles & Application Context Lifecycle",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "The cross-cutting machinery — proxies, configuration, events — that @Transactional, @Cacheable, @Async, and Spring Security all rely on.",
    "prerequisites": [
      "33"
    ],
    "owns": "Spring AOP and proxying; external configuration; profiles; SpEL; application events; context lifecycle.",
    "topics": [
      {
        "group": "Aspect-oriented programming",
        "items": [
          "Cross-cutting concerns and why they resist ordinary modularisation",
          "Vocabulary used precisely: aspect, join point, pointcut, advice, weaving, target, proxy",
          "Spring AOP is proxy-based, not full AspectJ weaving — and the consequences of that choice",
          "Advice types: @Before, @After, @AfterReturning, @AfterThrowing, @Around; ProceedingJoinPoint",
          "Pointcut expressions: execution, within, @annotation, bean, and combining them; named pointcuts",
          "Aspect ordering with @Order and why it matters when transactions and security both apply",
          "JDK dynamic proxies versus CGLIB subclass proxies — interface-based versus class-based, and the consequences: final classes and methods cannot be proxied, and proxies must be injected as the right type (16)",
          "The self-invocation problem — an internal this.method() call bypasses the proxy, so @Transactional, @Cacheable, and @Async silently do nothing. This is one of the highest-value facts in the whole Spring section; teach the cause and every standard workaround",
          "Writing a custom aspect (auditing, timing, retry) and knowing when an aspect is the wrong tool"
        ]
      },
      {
        "group": "External configuration",
        "items": [
          "application.properties versus application.yml; syntax and structure",
          "@Value versus @ConfigurationProperties — and why type-safe binding with validation is preferred for anything non-trivial (35)",
          "Environment and PropertySource; property sources and their precedence order (verify the exact ordering against the Spring Boot reference documentation rather than reciting it)",
          "Externalised configuration: environment variables, command-line arguments, config files outside the JAR",
          "Relaxed binding of property names",
          "Configuration validation and failing fast at startup",
          "Never commit secrets — configuration must read them from the environment or a secret store (39, 42)"
        ]
      },
      {
        "group": "Profiles",
        "items": [
          "@Profile on beans and configuration classes",
          "Activating profiles; profile-specific property files; profile groups",
          "dev/test/prod separation done properly; the danger of profile-conditional business logic",
          "@Conditional and the condition mechanism that underlies Boot's auto-configuration (35)"
        ]
      },
      {
        "group": "Spring Expression Language",
        "items": [
          "Syntax; property and bean references; operators; collection selection and projection",
          "Where SpEL appears (@Value, security expressions, caching keys)",
          "The readability and safety argument for keeping SpEL simple"
        ]
      },
      {
        "group": "Application events",
        "items": [
          "ApplicationEvent and ApplicationEventPublisher; publishing custom events",
          "@EventListener; conditional listeners; ordering",
          "Synchronous by default; @Async listeners and their error-handling implications (40)",
          "@TransactionalEventListener and its phases — publishing after commit, a genuinely important pattern (36)",
          "Events for decoupling within a modular monolith, and their limits (27)"
        ]
      },
      {
        "group": "Context lifecycle",
        "items": [
          "Refresh phases; SmartLifecycle; startup ordering",
          "Built-in lifecycle events (ApplicationStartedEvent, ApplicationReadyEvent, and others — verify names against the reference docs)",
          "Graceful shutdown, shutdown hooks, and in-flight request draining (42)",
          "Startup performance and why context creation time matters in tests (41)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "35",
    "id": "35-spring-boot",
    "name": "Spring Boot — Auto-Configuration, Starters & Application Structure",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "Spring Boot is the conventions and wiring layer over Spring. This module makes the conventions visible so they are usable rather than mysterious.",
    "prerequisites": [
      "24",
      "33",
      "34"
    ],
    "owns": "Boot's auto-configuration mechanism; starters; application structure; Boot configuration and packaging.",
    "topics": [
      {
        "group": "What Boot is and is not",
        "items": [
          "Boot is opinionated configuration plus an embedded server plus dependency management — not a separate framework from Spring",
          "The problems it removed: XML configuration, dependency version alignment, deployment descriptors, external servlet containers",
          "Boot 3 requires Java 17+ and uses the jakarta.* namespace — verify versions against the project's actual dependencies (24, 31)"
        ]
      },
      {
        "group": "Project setup",
        "items": [
          "Spring Initializr; project layout; the @SpringBootApplication entry point and the three annotations it composes",
          "Component-scanning implications of the main class's package — the \"my bean is not found\" problem",
          "SpringApplication.run and what happens during startup",
          "The parent POM/BOM and starter dependencies; dependency version management (24)"
        ]
      },
      {
        "group": "Auto-configuration — the mechanism",
        "items": [
          "How auto-configuration classes are discovered (the registration file under META-INF; note that the mechanism changed between Boot 2 and Boot 3 — verify for the version in use)",
          "@Conditional family: @ConditionalOnClass, @ConditionalOnMissingBean, @ConditionalOnProperty, @ConditionalOnBean, and others (34)",
          "Why \"your bean wins\": @ConditionalOnMissingBean backs off when you define your own",
          "Ordering and @AutoConfigureAfter/@AutoConfigureBefore",
          "The auto-configuration report (--debug or the actuator endpoint) as the tool for answering \"why is this bean here\" — teach reading it, because it converts magic into a traceable decision",
          "Excluding auto-configuration deliberately",
          "Writing a small custom auto-configuration and starter, to close the loop"
        ]
      },
      {
        "group": "Configuration in Boot",
        "items": [
          "application.properties/.yml, profile-specific files, and the config-tree conventions",
          "@ConfigurationProperties with constructor binding and validation (34)",
          "Common property groups: server, datasource, JPA/Hibernate, logging, management — look them up rather than recalling them",
          "Configuration precedence in Boot; overriding for tests and for deployment"
        ]
      },
      {
        "group": "Application structure",
        "items": [
          "Package-by-feature versus package-by-layer in a Boot codebase (27)",
          "Where controllers, services, repositories, DTOs, mappers, configuration, and exceptions live",
          "Keeping the domain free of framework annotations where practical, and the pragmatic compromises",
          "Multi-module Boot projects (24)"
        ]
      },
      {
        "group": "Runtime",
        "items": [
          "Embedded servers (Tomcat by default; Jetty and Undertow as alternatives) and how to swap them",
          "The embedded-server threading model, and how virtual threads change it — verify support for the Boot version in use (19)",
          "The executable JAR layout and its nested-JAR classloading; why it differs from a shaded JAR (24)",
          "CommandLineRunner/ApplicationRunner; non-web applications",
          "spring-boot-devtools, restart behaviour, and why it is development-only",
          "Logging configuration; the default logging setup and how to change it (27)",
          "Startup time and lazy initialisation as a trade-off",
          "Awareness: GraalVM native images and AOT processing — note the constraints (reflection, proxies) and verify status for the Boot version before teaching"
        ]
      },
      {
        "group": "Diagnosing Boot",
        "items": [
          "Reading Boot's startup failure analysis output",
          "\"Why is this bean configured this way\" as a repeatable investigation"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "36",
    "id": "36-spring-data-jpa",
    "name": "Spring Data JPA — Repositories, Queries, Projections & Migrations",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "The data-access layer as it is actually written in Spring — with enough visibility into the generated SQL that Module 32's lessons still apply.",
    "prerequisites": [
      "30",
      "31",
      "32",
      "35"
    ],
    "owns": "Spring Data repositories; query derivation; Spring transaction management; schema migrations; auditing.",
    "topics": [
      {
        "group": "Repository abstraction",
        "items": [
          "Repository, CrudRepository, ListCrudRepository, PagingAndSortingRepository, JpaRepository — what each adds",
          "How the implementation is created: a dynamic proxy over your interface (16, 34) — so this is mechanism, not magic",
          "@Repository and persistence-exception translation into Spring's DataAccessException hierarchy — and why an unchecked, technology-neutral hierarchy was chosen (10, 27)",
          "Custom repository implementations and the fragment/composition mechanism",
          "save semantics: it is persist-or-merge, and the \"why did my save issue a SELECT\" question (31)",
          "getReferenceById versus findById"
        ]
      },
      {
        "group": "Query methods",
        "items": [
          "Derived queries from method names: subject keywords, predicate keywords, And/Or, Between, LessThan, Like, In, IgnoreCase, OrderBy",
          "Where derivation stops being readable and a @Query is better",
          "@Query with JPQL and with nativeQuery = true",
          "Named parameters versus positional; SpEL in queries (34)",
          "@Modifying queries, clearAutomatically/flushAutomatically, and the stale-persistence-context trap (32)",
          "Query by Example; Specifications and the Criteria API behind them (31); Querydsl at an awareness level",
          "Streaming results, Slice versus Page (and the count-query cost of Page), and keyset pagination when OFFSET degrades (29)",
          "Sort and dynamic sorting; the injection risk of unvalidated sort fields passed from a client (38)"
        ]
      },
      {
        "group": "Projections",
        "items": [
          "Interface-based (closed and open) projections; class-based DTO projections; dynamic projections",
          "Selecting only the needed columns as the primary defence against over-fetching (32)"
        ]
      },
      {
        "group": "Transaction management",
        "items": [
          "@Transactional: declarative transactions implemented by a proxy (34)",
          "Propagation — REQUIRED, REQUIRES_NEW, SUPPORTS, MANDATORY, NOT_SUPPORTED, NEVER, NESTED — with the behaviour of each",
          "Isolation levels from Spring, mapped onto the database's actual behaviour (28, 30)",
          "Rollback rules: unchecked exceptions roll back by default, checked exceptions do not — a defaults difference that causes real data bugs (10); rollbackFor/noRollbackFor",
          "readOnly = true and what it actually does at the Hibernate and JDBC levels (32)",
          "Timeouts; transaction boundaries at the service layer (27)",
          "@Transactional traps: self-invocation (34), private/final methods, calling from the same class, applying it to a controller, and swallowing an exception after the transaction is already marked rollback-only",
          "TransactionTemplate for programmatic control",
          "TransactionSynchronizationManager and after-commit hooks (34)",
          "Transactions with @Async and with new threads — and why they do not propagate (40)"
        ]
      },
      {
        "group": "Schema migrations",
        "items": [
          "Why hibernate.ddl-auto is not a migration strategy (31)",
          "Flyway and Liquibase: versioned migrations, checksums, baselining, repeatable migrations",
          "Writing backward-compatible migrations for zero-downtime deploys (expand/contract) — the practical pattern (42)",
          "Migrations in tests and in CI (41)",
          "Seed and reference data"
        ]
      },
      {
        "group": "Auditing and multi-datasource",
        "items": [
          "@CreatedDate, @LastModifiedDate, @CreatedBy, @LastModifiedBy, @EnableJpaAuditing",
          "Hibernate Envers at an awareness level",
          "Multiple data sources and the configuration that requires",
          "Read/write splitting at an awareness level"
        ]
      },
      {
        "group": "Awareness of alternatives",
        "items": [
          "Spring Data JDBC and its simpler aggregate model; JdbcTemplate for SQL-first work (30); reactive data access is noted as out of scope for this curriculum"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "37",
    "id": "37-rest-api-development-with-spring-web-mvc",
    "name": "REST API Development with Spring Web MVC",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "The server side of the full stack — and the first point where the learner's browser/JavaScript experience connects to the Java backend.",
    "prerequisites": [
      "23",
      "27",
      "35"
    ],
    "owns": "Spring MVC request handling; REST design; serialization at the boundary; CORS; the browser-to-API connection.",
    "topics": [
      {
        "group": "Servlet and MVC foundations",
        "items": [
          "The servlet model; DispatcherServlet as the front controller (26)",
          "Request processing: handler mapping → handler adapter → argument resolution → handler invocation → return-value handling → message conversion → response",
          "Filters versus interceptors versus AOP — three interception layers, and the right one for each job (34, 39)",
          "Thread-per-request and the request lifecycle; request-scoped beans (33)",
          "@Controller versus @RestController"
        ]
      },
      {
        "group": "REST design",
        "items": [
          "Resources, URIs, and representations; nouns not verbs",
          "HTTP methods and their safety and idempotency properties, and why that determines retry behaviour (23)",
          "Status codes used correctly: 200/201/204, 400/401/403/404/409/422, 429, 5xx — with the semantics of each",
          "Location headers on creation; ETag/If-None-Match conditional requests; caching headers",
          "Richardson maturity model and HATEOAS — presented with an honest assessment of how much of it real APIs adopt",
          "Resource modelling, nesting depth, and collection design"
        ]
      },
      {
        "group": "Request handling",
        "items": [
          "@GetMapping/@PostMapping/@PutMapping/@PatchMapping/@DeleteMapping; @RequestMapping attributes; consumes/produces",
          "@PathVariable, @RequestParam (required, defaults, Optional), @RequestBody, @RequestHeader, @CookieValue, @ModelAttribute",
          "ResponseEntity for full control over status and headers",
          "@ResponseStatus",
          "File upload with MultipartFile; streaming downloads and large responses (21)",
          "HttpServletRequest/HttpServletResponse when you genuinely need them",
          "PATCH semantics and the partial-update problem (including the null-versus-absent ambiguity)"
        ]
      },
      {
        "group": "Serialization at the boundary",
        "items": [
          "HttpMessageConverter; Jackson integration in Boot (23)",
          "DTOs at the API boundary, never entities — the reasons stated concretely: lazy-loading serialization failures, over-exposure of internal fields, mass assignment, and coupling the API to the schema (27, 31)",
          "Mapping between DTOs and entities; hand-written mappers versus MapStruct",
          "Jackson configuration in Boot: naming strategy, null inclusion, date format (22), unknown-property handling",
          "Serializing records; immutable request/response objects (08)",
          "API versioning strategies (URI, header, media type) and their trade-offs"
        ]
      },
      {
        "group": "Cross-origin and the browser",
        "items": [
          "CORS explained properly: the same-origin policy, simple versus preflight requests, Origin, Access-Control-Allow-* headers, credentials, and why a wildcard origin with credentials is rejected",
          "Configuring CORS in Spring (@CrossOrigin, global configuration) and the interaction with Spring Security's filter chain (39)",
          "Connecting the vanilla-JS frontend to the API with fetch — the concrete full-stack link, respecting this project's no-framework UI restriction",
          "Content negotiation; JSON as the default",
          "Serving static content from a Boot application"
        ]
      },
      {
        "group": "Other response modes",
        "items": [
          "Server-sent events and long-lived responses at an awareness level",
          "Asynchronous MVC (Callable, DeferredResult) and where it helps (18)",
          "A brief, honest positioning of WebFlux — what it is, when it is chosen, and why this curriculum stays with the servlet stack"
        ]
      },
      {
        "group": "Documentation",
        "items": [
          "OpenAPI/Swagger generation; keeping documentation honest and generated rather than hand-maintained (38)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "38",
    "id": "38-api-contracts",
    "name": "API Contracts — Validation, Error Handling, Versioning & Documentation",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "The difference between an endpoint that works and an API that can be depended on by a client.",
    "prerequisites": [
      "37"
    ],
    "owns": "Bean Validation; API error contracts; exception translation to HTTP; pagination/filtering contracts; API documentation.",
    "topics": [
      {
        "group": "Bean Validation",
        "items": [
          "The Jakarta Validation specification and Hibernate Validator as the implementation (verify the namespace for the Boot version in use — 35)",
          "Built-in constraints: @NotNull, @NotEmpty, @NotBlank (and their exact differences), @Size, @Min/@Max, @Positive, @Email, @Pattern, @Past/@Future",
          "@Valid versus @Validated; validating request bodies, path variables, and request parameters",
          "Nested and cascading validation of object graphs",
          "Validation groups for create-versus-update differences",
          "Custom constraints: annotation plus ConstraintValidator; cross-field validation at the class level",
          "Where validation belongs: request DTO, domain invariant, and database constraint — all three, for different reasons (27, 28)",
          "Validating configuration properties at startup (34)"
        ]
      },
      {
        "group": "Error handling",
        "items": [
          "A consistent machine-readable error contract, decided once and applied everywhere; RFC 7807 application/problem+json as the standard shape, and Spring's ProblemDetail support (verify availability for the Spring version in use)",
          "@ExceptionHandler at the controller level",
          "@RestControllerAdvice for global handling; ordering of advices",
          "Handling framework exceptions: validation failures, unreadable message body, method-not-supported, media-type-not-supported, missing parameter, type mismatch, and the fallback handler",
          "Mapping domain exceptions to status codes at the boundary — and keeping HTTP concerns out of the service layer (10, 27)",
          "Never leak stack traces, SQL, or internal class names to clients; including a correlation ID instead so the log can be found (27)",
          "Field-level validation errors returned in a structured, client-usable form",
          "Error handling and Spring Security's separate filter-level errors (39)",
          "Logging errors once, at the right boundary, with the right level (27)"
        ]
      },
      {
        "group": "Collection contracts",
        "items": [
          "Pagination: page/size versus cursor/keyset; response envelope design; total counts and their cost (29, 36)",
          "Sorting and filtering parameters; validating sort fields against an allowlist rather than passing client input to the query layer (36)",
          "Consistent ordering as a correctness requirement for pagination",
          "Partial responses and field selection at an awareness level"
        ]
      },
      {
        "group": "Contract evolution",
        "items": [
          "Backward-compatible versus breaking changes, enumerated concretely",
          "Versioning strategies revisited with a recommendation (37)",
          "Deprecation signalling and client migration",
          "Tolerant-reader design on the client side"
        ]
      },
      {
        "group": "Documentation",
        "items": [
          "OpenAPI specification structure",
          "Springdoc-style generation from annotations; documenting schemas, responses, and error shapes",
          "Keeping documentation truthful — generated from code, verified against it, never hand-maintained beside it (this project's accuracy rule applied to APIs)",
          "Contract-first versus code-first, compared honestly",
          "Examples and consumer-facing usability"
        ]
      },
      {
        "group": "Adjacent concerns",
        "items": [
          "Idempotency keys for safe retries of non-idempotent operations (23)",
          "Rate limiting and the 429 contract; Retry-After",
          "Request size limits and timeouts as availability protections",
          "Input sanitisation versus output encoding, and where each belongs (39)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "39",
    "id": "39-spring-security",
    "name": "Spring Security — Authentication, Authorization, JWT & OAuth2",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "Security is not a feature that is added later. This module covers the filter chain properly, because most Spring Security confusion is really confusion about ordering.",
    "prerequisites": [
      "34",
      "37",
      "38"
    ],
    "owns": "The security filter chain; authentication and authorization; password handling; JWT; OAuth2/OIDC; web vulnerabilities.",
    "topics": [
      {
        "group": "Architecture",
        "items": [
          "The SecurityFilterChain and the servlet filter chain it plugs into (37); filter ordering as the key to understanding behaviour",
          "Core types: SecurityContext and SecurityContextHolder, Authentication, AuthenticationManager, AuthenticationProvider, UserDetails/UserDetailsService, GrantedAuthority",
          "SecurityContextHolder is ThreadLocal-based — and therefore does not propagate to @Async or other threads without explicit help (17, 18, 40)",
          "Configuration in Spring Security 6 style: a SecurityFilterChain bean and the lambda DSL (the older WebSecurityConfigurerAdapter was removed — verify the API against the version in use; this area changes between major versions)",
          "Multiple filter chains with securityMatcher for different URL groups"
        ]
      },
      {
        "group": "Authentication",
        "items": [
          "Form login, HTTP Basic, and their appropriate uses",
          "UserDetailsService and loading users from a database (36)",
          "Password storage: PasswordEncoder, BCrypt/Argon2-family adaptive hashing, salting, work factor, and why fast hashes and plain storage are unacceptable. Verify current algorithm recommendations against Spring Security documentation and current guidance rather than asserting a default",
          "DelegatingPasswordEncoder and encoded-password prefixes for migration",
          "Custom AuthenticationProvider",
          "Authentication events and failure handling; lockout considerations",
          "Session management: fixation protection, concurrency control, timeouts",
          "Stateless versus stateful authentication — the actual trade-offs, argued rather than assumed"
        ]
      },
      {
        "group": "Authorization",
        "items": [
          "URL-based rules: requestMatchers, permitAll, authenticated, hasRole/hasAuthority — and the ROLE_ prefix convention that trips everyone",
          "Rule ordering is significant — first match wins",
          "Method security: @PreAuthorize, @PostAuthorize, @PreFilter, @PostFilter, @Secured; enabling it; the SpEL expressions available (34)",
          "Method security is proxy-based, so self-invocation bypasses it (34)",
          "Ownership checks and domain-object security; the \"can this user edit this record\" problem that URL rules cannot express",
          "Role-based versus permission/authority-based models, and why roles alone stop scaling"
        ]
      },
      {
        "group": "JWT and token authentication",
        "items": [
          "JWT structure: header, payload, signature; base64url encoding — and that the payload is encoded, not encrypted",
          "Signing: HMAC versus RSA/ECDSA; key management; the alg: none and algorithm-confusion vulnerability class",
          "Claims: registered claims, expiry, issuer, audience, and validating all of them",
          "Access tokens versus refresh tokens; rotation; the revocation problem that statelessness creates, and the mitigations",
          "Where a browser client stores a token: localStorage versus sessionStorage versus an HttpOnly cookie — XSS and CSRF exposure compared honestly, so the Module 43 capstone makes a defensible choice",
          "Implementing JWT authentication with Spring Security's resource-server support; custom filters when genuinely required"
        ]
      },
      {
        "group": "OAuth2 and OpenID Connect",
        "items": [
          "Roles: resource owner, client, authorization server, resource server",
          "Authorization Code flow with PKCE as the current standard for browser and native clients; why the implicit flow is deprecated; client credentials for machine-to-machine",
          "OIDC versus OAuth2: authentication versus authorization, and the ID token",
          "Spring Security's oauth2Login and oauth2ResourceServer support",
          "Scopes and their mapping to authorities",
          "Token introspection versus local JWT validation; JWKS and key rotation"
        ]
      },
      {
        "group": "Web vulnerabilities",
        "items": [
          "CSRF: the mechanism, Spring's protection, why it is enabled by default, when a stateless token API can disable it, and why \"disable CSRF\" is not a default answer",
          "XSS: stored, reflected, and DOM-based; output encoding as the primary defence; Content-Security-Policy; and the direct relevance to the vanilla-JS client rendering API data (43)",
          "SQL injection — closed at the JDBC/JPA layer with parameter binding (30, 31), including the JPQL and native-query cases",
          "Security headers: CSP, HSTS, X-Content-Type-Options, frame options, referrer policy",
          "Mass assignment, and why DTOs prevent it (37)",
          "Insecure direct object references and the ownership-check requirement",
          "Sensitive data in logs, errors, and toString (07, 27, 38)",
          "Secrets in configuration — environment and secret stores, never the repository (34, 42)",
          "Dependency vulnerabilities and scanning (24)",
          "The OWASP Top 10 as a checklist to work through, verified against the current published list rather than recalled"
        ]
      },
      {
        "group": "Testing security",
        "items": [
          "@WithMockUser, @WithUserDetails, security-aware MockMvc testing (41)",
          "Testing that authorization actually denies — the negative case that is usually missing"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "40",
    "id": "40-asynchronous-processing-caching-scheduling-messaging",
    "name": "Asynchronous Processing, Caching, Scheduling & Messaging",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "Work that does not happen inside a request — the mechanisms that keep an API responsive, plus the distributed-systems reasoning they require.",
    "prerequisites": [
      "18",
      "19",
      "34",
      "36"
    ],
    "owns": "Spring @Async; scheduling; Spring caching abstraction; messaging and event-driven integration.",
    "topics": [
      {
        "group": "Asynchronous execution in Spring",
        "items": [
          "@EnableAsync and @Async; return types (void, Future, CompletableFuture) and what each gives you (18)",
          "Configuring the executor explicitly — the default is not a production choice; TaskExecutor, ThreadPoolTaskExecutor, queue capacity and rejection (18)",
          "@Async is proxy-based: self-invocation does nothing, and the method must be public (34)",
          "Exception handling in @Async: void methods swallow exceptions unless an AsyncUncaughtExceptionHandler is configured",
          "Context propagation failures: the security context (39), the transaction (36), and the logging MDC (27) do not propagate to async threads automatically — the mechanisms for propagating each",
          "Async plus transactions: why @Async on a transactional method is a common bug",
          "Virtual threads and Spring's task execution — verify support for the Boot version in use (19)"
        ]
      },
      {
        "group": "Scheduling",
        "items": [
          "@EnableScheduling and @Scheduled with fixedRate, fixedDelay, initialDelay, and cron expressions (including the Spring cron field layout, which differs from Unix cron — verify)",
          "fixedRate versus fixedDelay and overlapping executions",
          "The single-threaded default scheduler and why one slow job blocks the rest",
          "Scheduling in a multi-instance deployment: the same job running on every node, and the standard remedies (leader election, distributed locks such as ShedLock, or an external scheduler) — a real operational problem (42)",
          "Time zones in scheduling (22); missed executions after downtime",
          "Testing scheduled logic by extracting it from the schedule trigger (41)"
        ]
      },
      {
        "group": "Caching",
        "items": [
          "Spring's cache abstraction and its provider independence",
          "@EnableCaching, @Cacheable, @CachePut, @CacheEvict, @Caching, @CacheConfig",
          "Key generation and custom key generators; SpEL keys and their pitfalls (34)",
          "Proxy-based, therefore self-invocation bypasses it (34)",
          "sync = true and the cache-stampede problem",
          "Conditional caching (condition, unless); caching null",
          "Providers: simple/concurrent map, Caffeine (local), Redis (distributed) — and the operational differences between local and distributed caching",
          "Cache invalidation strategies: TTL, write-through, explicit eviction, and the correctness risks of each",
          "Local caches in a multi-instance deployment and the staleness that follows",
          "Relationship to the Hibernate second-level cache — do not cache the same data at three layers without deciding why (32)",
          "Measuring hit rates before and after; never caching on assumption (20)"
        ]
      },
      {
        "group": "Messaging",
        "items": [
          "Why messaging: decoupling, load levelling, resilience, and asynchronous workflows (27)",
          "Queues versus topics; point-to-point versus publish/subscribe",
          "Broker options at a working level of understanding: RabbitMQ (AMQP) and Kafka (log-based) — their different models, and Spring's support for each. Verify API details against current Spring documentation before teaching specifics",
          "Producing and consuming with Spring's messaging abstractions; listener containers; concurrency; acknowledgement modes",
          "Delivery semantics: at-most-once, at-least-once, and why exactly-once is a much stronger claim than it sounds; idempotent consumers as the practical requirement (23)",
          "Ordering guarantees and partitioning",
          "Retries, dead-letter queues, and poison messages",
          "The dual-write problem — writing to the database and publishing a message are not atomic — and the transactional-outbox pattern; the after-commit event listener as the simpler in-process version (34)",
          "Message schema evolution and consumer compatibility (38)",
          "Spring application events versus a real broker: in-process versus cross-process, and when the boundary is crossed (34)"
        ]
      },
      {
        "group": "Resilience",
        "items": [
          "Timeouts, retries with backoff and jitter, circuit breakers, bulkheads, and graceful degradation (23)",
          "Where each belongs, and the failure modes they do not fix"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "41",
    "id": "41-testing-spring-boot-applications",
    "name": "Testing Spring Boot Applications — Slices, MockMvc & Testcontainers",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "Testing a framework application without the tests becoming slower and more fragile than the code they protect.",
    "prerequisites": [
      "25",
      "36",
      "37",
      "38",
      "39"
    ],
    "owns": "Spring test context; test slices; MockMvc; Testcontainers; integration-test strategy.",
    "topics": [
      {
        "group": "The Spring test context",
        "items": [
          "@SpringBootTest and what it actually starts; webEnvironment options (MOCK, RANDOM_PORT, DEFINED_PORT, NONE)",
          "Context caching — the single most important performance fact about Spring tests: contexts are cached and reused across test classes, and every unique configuration creates a new one",
          "What evicts or fragments the cache (@MockBean/mock bean definitions, @TestPropertySource, @ActiveProfiles, @DirtiesContext) and how to keep the number of distinct contexts small",
          "@DirtiesContext and its real cost",
          "Test configuration: @TestConfiguration, @Import, overriding beans",
          "Not everything needs Spring — plain unit tests with constructor injection are faster and better for logic (25, 33)"
        ]
      },
      {
        "group": "Test slices",
        "items": [
          "@WebMvcTest — controllers, converters, advice, and security filters only",
          "@DataJpaTest — repositories with a transactional, rolled-back test context, and its default in-memory-database behaviour and how to disable it",
          "@JdbcTest, @JsonTest, @RestClientTest, and other slices",
          "What each slice includes and excludes, and why \"my bean is not found\" in a slice is expected rather than broken",
          "Mocking collaborators in slices: @MockBean (and its newer replacement in recent Spring versions — verify which applies to the version in use)"
        ]
      },
      {
        "group": "Web-layer testing",
        "items": [
          "MockMvc: perform, request builders, result matchers, andExpect, andDo(print())",
          "MockMvcTester/fluent alternatives where available — verify for the version",
          "JSON assertions with JSONPath; JSON comparison strategies",
          "Testing status codes, headers, and error contracts (38)",
          "Testing validation failures and the resulting response shape",
          "Security in tests: @WithMockUser, @WithUserDetails, testing that unauthorised access is actually denied (39)",
          "TestRestTemplate/WebTestClient for full-stack tests over a real port",
          "Testing file upload and download (37)"
        ]
      },
      {
        "group": "Persistence testing",
        "items": [
          "@DataJpaTest semantics: transactional and rolled back by default, and why that hides flush-related bugs unless you flush explicitly (31)",
          "TestEntityManager",
          "In-memory database versus the real engine — H2 accepts SQL PostgreSQL rejects, and hides dialect-specific behaviour; state the trade-off plainly",
          "Testcontainers: running the real database in a container for tests; lifecycle, reuse, and startup cost; @ServiceConnection-style wiring — verify the API for the Boot version in use",
          "Test data setup: SQL scripts, builders, fixtures; keeping tests independent",
          "Testing migrations (36)",
          "Asserting query counts to catch N+1 regressions in tests — the practical defence for Module 32's lessons"
        ]
      },
      {
        "group": "Integration and beyond",
        "items": [
          "What \"integration test\" means here, and the boundary each test covers",
          "Mocking external HTTP services: WireMock/MockWebServer-style servers versus @MockBean on a client (23)",
          "Contract testing at an awareness level",
          "Testing asynchronous and scheduled code deterministically — Awaitility-style polling instead of sleep; extracting the logic from the trigger (40)",
          "Testing messaging with embedded or containerised brokers (40)",
          "End-to-end browser testing at an awareness level; keeping it thin"
        ]
      },
      {
        "group": "Test strategy and speed",
        "items": [
          "How many tests at each level, and why an inverted pyramid hurts (25)",
          "Keeping the suite fast: fewer contexts, fewer containers, parallelism where safe",
          "Separating unit and integration runs in the build (Surefire/Failsafe — 24)",
          "Test isolation, shared state, and ordering independence",
          "Flaky tests as defects to fix, never to retry away",
          "CI considerations: reproducibility, containers in CI, resource limits"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "42",
    "id": "42-production-readiness",
    "name": "Production Readiness — Observability, Containers & Deployment",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "Everything between \"it works on my machine\" and \"it runs reliably for users\" — the operational half of engineering ability.",
    "prerequisites": [
      "20",
      "35",
      "39",
      "40"
    ],
    "owns": "Actuator; metrics, logging, and tracing; containerisation; configuration and secrets in deployment; release strategy; operational readiness.",
    "topics": [
      {
        "group": "Spring Boot Actuator",
        "items": [
          "What Actuator provides and how endpoints are exposed and secured",
          "health — liveness versus readiness, custom HealthIndicators, and the difference that matters to an orchestrator",
          "info, metrics, env, loggers (changing log level at runtime), httpexchanges, threaddump, heapdump, mappings, configprops, and the auto-configuration report (35)",
          "Actuator endpoints must be secured — several expose sensitive information; expose deliberately, never by default (39)",
          "Verify the endpoint list and defaults against the Boot version's documentation rather than recalling them"
        ]
      },
      {
        "group": "Metrics",
        "items": [
          "Micrometer as the facade; meter types — counter, gauge, timer, distribution summary — and choosing correctly",
          "Tags/dimensions and cardinality explosion as a real operational failure",
          "Custom application metrics; @Timed",
          "JVM metrics: memory, GC, threads, class loading (15)",
          "HTTP, datasource/connection-pool, and cache metrics (30, 40)",
          "The RED and USE method framings for choosing what to measure",
          "Dashboards and alerting on symptoms rather than causes",
          "Percentiles versus averages, again, in the operational context (20)"
        ]
      },
      {
        "group": "Logging in production",
        "items": [
          "Structured/JSON logging for machine consumption (27)",
          "Correlation IDs across requests; propagation through async boundaries (40)",
          "Log levels in production; dynamic level changes via Actuator",
          "Log aggregation at a conceptual level; retention and cost",
          "Never log secrets or personal data (39); scrubbing and review"
        ]
      },
      {
        "group": "Tracing",
        "items": [
          "Distributed tracing concepts: trace, span, context propagation",
          "Micrometer Tracing/OpenTelemetry at a working level — verify the current integration for the Boot version in use, as this area has changed",
          "Sampling and overhead",
          "Correlating traces, logs, and metrics when diagnosing an incident"
        ]
      },
      {
        "group": "Containerisation",
        "items": [
          "Docker fundamentals: images, layers, containers, registries",
          "Writing a good Dockerfile for a Java application: base image choice, layered JARs for build-cache efficiency, multi-stage builds, non-root user, minimal image contents",
          "Buildpacks and Spring Boot's image-building support as an alternative (24)",
          "Container-aware JVM behaviour: CPU and memory limits, heap sizing inside a container, and why an unaware JVM misbehaves (15, 20)",
          "Image size, startup time, and security scanning of images",
          "docker compose for local development dependencies (database, broker)",
          "Kubernetes at an awareness level: deployments, services, config maps, secrets, probes mapped to Actuator health groups — enough to deploy, not a Kubernetes course"
        ]
      },
      {
        "group": "Configuration and secrets in deployment",
        "items": [
          "Environment-specific configuration without rebuilding the artifact (34)",
          "Secrets from the environment or a secret manager — never in the image, the repository, or the configuration files (39)",
          "The twelve-factor principles that actually apply, assessed rather than recited",
          "Feature flags at an awareness level"
        ]
      },
      {
        "group": "Release and operations",
        "items": [
          "CI/CD pipeline shape: build → test → package → scan → deploy",
          "Deployment strategies: rolling, blue/green, canary — and what each requires of the application",
          "Zero-downtime database migrations — expand/contract, and application compatibility with both schema versions during a rollout (36)",
          "Graceful shutdown and in-flight request draining (34)",
          "Health checks, readiness gating, and startup probes",
          "Backward compatibility across instances during a rolling deploy",
          "Rollback planning; what is and is not reversible (a migration usually is not)",
          "Capacity, load testing, and performance regression testing (20)",
          "Incident response basics: what to look at first, and how the observability stack answers it",
          "On-call reality: runbooks, alert fatigue, and actionable alerts"
        ]
      },
      {
        "group": "Distributed-system awareness",
        "items": [
          "Multiple instances: statelessness, sticky sessions, and shared caches (40)",
          "Idempotency and retries across service boundaries (23, 40)",
          "Where a monolith should stay a monolith (27)"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  },
  {
    "number": "43",
    "id": "43-final-full-stack-capstone-mastery-assessment",
    "name": "Final Full-Stack Capstone & Mastery Assessment",
    "part": "Part VI — Spring, Spring Boot & Full-Stack Delivery",
    "partNumber": 6,
    "description": "Integrate the entire curriculum into one production-shaped application, built and defended by the learner. This module is where knowledge becomes demonstrated engineering ability.",
    "prerequisites": [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42"
    ],
    "owns": "End-to-end integration; the capstone project; the terminal mastery assessment.",
    "topics": [
      {
        "group": "Scope of the capstone",
        "items": [
          "A single non-trivial application with a real domain, real relationships, and real constraints — not a to-do list",
          "Requirements: a relational schema with meaningful relationships, authentication and authorization, full CRUD plus non-trivial queries, pagination and filtering, validation and a consistent error contract, background or scheduled work, caching where measurement justifies it, tests at every level, containerised deployment, and observability",
          "A browser client built with HTML + CSS + vanilla JavaScript only — the project's UI restriction applies to the capstone exactly as it does to the learning site (../README.md §3)",
          "Explicitly out of scope: frontend frameworks, and any technology not covered by the curriculum unless the learner justifies it in the design document"
        ]
      },
      {
        "group": "Design phase",
        "items": [
          "Requirements and use cases written before code",
          "Domain model: entities, value objects, aggregates, invariants (27)",
          "Relational schema design, normalisation decisions, and index plan (28, 29)",
          "API design: resources, methods, status codes, error contract, pagination, versioning (37, 38)",
          "Architecture: layering, package structure, and where each responsibility lives (27)",
          "Security design: authentication mechanism, authorization model, token storage decision with its trade-offs stated explicitly (39)",
          "A written design document, because defending decisions is part of mastery"
        ]
      },
      {
        "group": "Build phase",
        "items": [
          "Project and build setup, dependencies, and profiles (24, 34, 35)",
          "Migrations from the first commit — never ddl-auto (36)",
          "Persistence layer with fetch strategies chosen per use case, and query counts watched (31, 32)",
          "Service layer with correct transaction boundaries (36)",
          "REST layer with DTOs, validation, and the global error contract (37, 38)",
          "Security: filter chain, password handling, method security, ownership checks (39)",
          "Asynchronous and scheduled work, with context propagation handled (40)",
          "Caching added only where a measurement justified it (20, 40)",
          "Frontend: vanilla JS client consuming the API with fetch — auth flow, token handling, CORS, rendering with correct output escaping (XSS — 39), error display driven by the API's error contract (38), loading and failure states, responsive layout",
          "Tests: unit, slices, and integration with Testcontainers, including negative security tests and an N+1 regression guard (25, 41)",
          "Observability: Actuator, metrics, structured logging, correlation IDs (42)",
          "Containerisation and a deployment runbook (42)"
        ]
      },
      {
        "group": "Verification phase",
        "items": [
          "Everything is actually run and observed — this is the project's verification rule applied to the learner's own work (AI_INSTRUCTIONS.md §9)",
          "Test suite green, with the output shown rather than asserted",
          "Query-count and performance checks on the main flows (20, 32)",
          "A security self-review against the OWASP Top 10, verified against the current published list (39)",
          "Load testing the critical path and reading the results honestly (20)",
          "A written record of what was measured and what was not verified, and why"
        ]
      },
      {
        "group": "Mastery assessment",
        "items": [
          "Code defence: explain any line of the capstone and why it is that way",
          "Mechanism questions drawn across the whole curriculum: execution model, memory, concurrency, collections, ORM behaviour, framework internals",
          "Debugging under observation: diagnose a deliberately introduced bug — an N+1, a race condition, a transaction boundary error, a proxy self-invocation failure, a missing index",
          "Design defence: justify the architecture, and articulate what you would change at ten times the load",
          "Trade-off articulation: for each significant decision, the alternative considered and the reason it was rejected",
          "Gap identification: an honest list of what is still not understood — which, in the spirit of this project, is a passing answer, not a failing one",
          "Mapping the assessment back to the module list, so a weak area points at a specific module to revisit"
        ]
      },
      {
        "group": "After the capstone",
        "items": [
          "Reading real open-source Java as the next step",
          "Keeping current: release notes, deprecations, and ecosystem change",
          "The habit this curriculum is really teaching: verify, measure, and never assert what has not been checked"
        ]
      }
    ],
    "status": "NOT_STARTED",
    "chapterCount": 0,
    "chapters": []
  }
];

export default MODULES;
