# CURRICULUM.md — The Authoritative 43-Module Curriculum

> **This file is a faithful transcription of [`MASTER_BRIEF.md`](MASTER_BRIEF.md)
> Section 12.** The master brief is the canonical source; this document exists so
> the curriculum is readable on its own and so tooling has a stable parse target.
> The module blocks below are copied verbatim — not summarised, reordered, or
> edited. If the two ever disagree, **the master brief wins**; run
> `node tools/generate-modules.mjs --check`, which fails on any drift between
> the brief, this file, and `data/modules.js`.

---

## Rules governing this document

1. **The curriculum is fixed at 43 modules, numbered 01–43.** Never add, remove,
   merge, split, rename, renumber, or reorder a module.
2. **Module numbers are permanent identifiers.** They key site navigation,
   `localStorage` progress records, and every cross-reference in this
   repository.
3. **Module bodies are verbatim from the master brief.** Do not "improve" a
   topic list here. If a topic genuinely needs to change, change
   `MASTER_BRIEF.md` and re-transcribe, recording it in `PROJECT_STATE.md`.
4. **Emphasis notes are part of the specification.** Where the brief flags a
   module — Module 08's *extra depth*, Module 14's JVM-spec-vs-HotSpot
   distinction, Module 30's JPA-vs-Hibernate framing — those lines are
   requirements, not commentary.
5. **Topic lists are not chapter lists.** Chapter breakdown happens when a
   module is authored. A module's topics may span several chapters.
6. **Java 17+ is the baseline** (master brief §9). Any feature needing a newer
   release must name that release inline; never present a preview API as stable.
7. **Single primary ownership** (master brief §33). Each concept is taught in
   depth in exactly one module; later modules cross-link rather than re-teach.

### Learner-profile reminder (master brief §11)

The learner already knows programming, C++, DSA, and JavaScript/HTML/CSS, and is
transitioning into Java. **Do not spend learning time on what a variable, loop,
or `if` statement is.** Focus on Java-specific syntax and semantics, JVM
behaviour, the object model, memory behaviour, collections, concurrency, the
ecosystem, Java-specific pitfalls, production implications, and interview
reasoning. Compare with C++ where genuinely useful.

---

## Module index

| # | Module |
|---|---|
| 01 | Java Foundations & Execution Model |
| 02 | OOP in Java |
| 03 | Java Language Fundamentals |
| 04 | Strings, Wrappers & Object Fundamentals |
| 05 | Exception Handling |
| 06 | Generics |
| 07 | Java Collections Framework |
| 08 | Hashing & HashMap Internals |
| 09 | Functional Java & Lambda Expressions |
| 10 | Stream API |
| 11 | Optional, Date/Time & Modern Java APIs |
| 12 | Annotations, Enums & Reflection |
| 13 | Java I/O & NIO |
| 14 | JVM Memory & Garbage Collection |
| 15 | Multithreading Fundamentals |
| 16 | Concurrency & Synchronization |
| 17 | Executors & Advanced Concurrency |
| 18 | DSA Foundations in Java |
| 19 | Hashing DSA Patterns |
| 20 | Two Pointers & Sliding Window |
| 21 | Linked Lists, Stack, Queue & Deque |
| 22 | Trees, BST & Heaps |
| 23 | Graphs |
| 24 | Binary Search, Recursion & Backtracking |
| 25 | Greedy & Dynamic Programming |
| 26 | SQL Fundamentals |
| 27 | Advanced SQL & Database Concepts |
| 28 | JDBC |
| 29 | Maven & Java Project Management |
| 30 | JPA Fundamentals |
| 31 | Hibernate Internals & Advanced ORM |
| 32 | Spring Core |
| 33 | Spring Boot Fundamentals |
| 34 | Spring MVC & REST APIs |
| 35 | Spring Data JPA |
| 36 | Spring Security |
| 37 | Testing Java & Spring Applications |
| 38 | Production-Grade Spring Boot |
| 39 | Backend Architecture & Design |
| 40 | Java Full-Stack Integration |
| 41 | Debugging, Performance & Problem Solving |
| 42 | Projects & Interview Engineering |
| 43 | Final Full-Stack Capstone & Mastery Assessment |

---

# THE 43 MODULES

*Everything from here to Appendix A is transcribed verbatim from
[`MASTER_BRIEF.md`](MASTER_BRIEF.md) Section 12.*

---

## MODULE 01 — Java Foundations & Execution Model

Topics:

* Java history and philosophy
* JDK
* JRE
* JVM
* JDK vs JRE vs JVM
* Java source code
* `javac`
* bytecode
* `.class` files
* `java` command
* classpath
* JAR files
* compilation vs execution
* Java vs C++ compilation
* platform independence
* WORA
* JVM architecture
* class loading
* class loading phases
* loading
* linking
* verification
* preparation
* resolution
* initialization
* class loaders
* bootstrap/platform/application class loaders
* execution engine
* interpreter
* JIT compiler
* HotSpot
* JVM warm-up
* basic JVM command-line concepts
* `main()`
* `public static void main(String[] args)`
* command-line arguments
* `System`
* `System.out`
* `PrintStream`
* standard output
* Java naming conventions
* packages
* imports

---

## MODULE 02 — OOP in Java

Topics:

* classes
* objects
* object creation
* constructors
* constructor overloading
* `this`
* `super`
* instance variables
* instance methods
* static members
* encapsulation
* getters/setters
* inheritance
* single inheritance
* method overriding
* method overloading
* compile-time polymorphism
* runtime polymorphism
* dynamic method dispatch
* abstraction
* abstract classes
* interfaces
* default interface methods
* static interface methods
* functional interfaces
* access modifiers
* `public`
* `private`
* `protected`
* package-private
* final classes
* final methods
* final variables
* object lifecycle
* composition
* aggregation
* association
* inheritance vs composition
* Java vs C++ OOP differences

Include implementation-oriented OOP questions and progressively harder coding/design problems.

---

## MODULE 03 — Java Language Fundamentals

Topics:

* primitive types
* reference types
* variables
* constants
* literals
* type conversion
* widening
* narrowing
* casting
* operators
* expressions
* control flow
* arrays
* multidimensional arrays
* enhanced for loop
* `var`
* scope
* pass-by-value
* Java references
* primitive vs reference behavior
* null
* null-related errors
* command-line arguments
* packages and imports

Focus on Java-specific behavior rather than generic programming.

---

## MODULE 04 — Strings, Wrappers & Object Fundamentals

Topics:

* `String`
* String immutability
* String pool
* string literals
* `new String()`
* `==` vs `.equals()`
* `StringBuilder`
* `StringBuffer`
* String performance
* wrappers
* `Integer`
* `Double`
* `Character`
* `Boolean`
* autoboxing
* unboxing
* wrapper caching
* `Integer.valueOf()`
* `parseInt()`
* object equality
* `equals()`
* `hashCode()`
* `toString()`
* `Object`
* identity vs equality
* mutable vs immutable objects

---

## MODULE 05 — Exception Handling

Topics:

* exceptions
* errors
* exception hierarchy
* checked exceptions
* unchecked exceptions
* `try`
* `catch`
* `finally`
* `throw`
* `throws`
* multiple catch blocks
* multi-catch
* custom exceptions
* exception propagation
* stack traces
* try-with-resources
* `AutoCloseable`
* exception chaining
* best practices
* exception anti-patterns
* designing useful exceptions
* debugging exceptions

---

## MODULE 06 — Generics

Topics:

* generic classes
* generic methods
* generic interfaces
* type parameters
* bounded type parameters
* upper bounds
* lower bounds
* wildcards
* `?`
* `? extends`
* `? super`
* PECS
* type erasure
* generic limitations
* raw types
* generic collections
* generic API design
* common generic interview traps

---

## MODULE 07 — Java Collections Framework

Topics:

* Collection hierarchy
* `Collection`
* `List`
* `Set`
* `Queue`
* `Deque`
* `Map`
* `ArrayList`
* `LinkedList`
* `HashSet`
* `LinkedHashSet`
* `TreeSet`
* `HashMap`
* `LinkedHashMap`
* `TreeMap`
* `Hashtable`
* collection selection
* iteration
* `Iterator`
* `ListIterator`
* fail-fast behavior
* ordering
* duplicates
* null handling
* performance characteristics
* implementation differences

---

## MODULE 08 — Hashing & HashMap Internals

This module must receive **extra depth**.

Topics:

* hashing concept
* hash functions
* hash table
* buckets
* collisions
* collision resolution
* `hashCode()`
* `equals()`
* HashMap lookup
* insertion
* retrieval
* removal
* resizing
* load factor
* capacity
* rehashing
* bucket indexing
* treeification
* linked nodes
* mutable keys
* custom key objects
* HashMap complexity
* HashMap memory behavior
* HashMap vs Hashtable
* HashMap vs ConcurrentHashMap
* LinkedHashMap internals
* access order
* insertion order
* TreeMap comparison
* common HashMap mistakes
* interview implementation questions

Include diagrams and dry runs.

---

## MODULE 09 — Functional Java & Lambda Expressions

Topics:

* functional interfaces
* lambda expressions
* lambda syntax
* target typing
* method references
* constructor references
* `Predicate`
* `Function`
* `Consumer`
* `Supplier`
* `BiFunction`
* `Comparator`
* effectively final variables
* closures
* lambda limitations
* lambda vs anonymous classes

---

## MODULE 10 — Stream API

Topics:

* streams
* stream vs collection
* stream pipeline
* source
* intermediate operations
* terminal operations
* `map`
* `filter`
* `flatMap`
* `distinct`
* `sorted`
* `limit`
* `skip`
* `peek`
* `reduce`
* `collect`
* `Collectors`
* grouping
* partitioning
* joining
* counting
* min/max
* primitive streams
* lazy evaluation
* short-circuiting
* stream reuse
* parallel streams
* stream performance
* common stream mistakes

---

## MODULE 11 — Optional, Date/Time & Modern Java APIs

Topics:

* `Optional`
* `Optional.of`
* `ofNullable`
* `orElse`
* `orElseGet`
* `orElseThrow`
* proper Optional usage
* Optional anti-patterns
* `java.time`
* `LocalDate`
* `LocalTime`
* `LocalDateTime`
* `ZonedDateTime`
* `Instant`
* `Duration`
* `Period`
* formatting
* parsing
* time zones
* modern Java API design

---

## MODULE 12 — Annotations, Enums & Reflection

Topics:

* annotations
* built-in annotations
* custom annotations
* annotation retention
* annotation targets
* enums
* enum methods
* enum constructors
* enum fields
* reflection
* `Class`
* methods
* fields
* constructors
* reflection use cases
* reflection limitations
* framework usage of reflection

---

## MODULE 13 — Java I/O & NIO

Topics:

* byte streams
* character streams
* `InputStream`
* `OutputStream`
* readers
* writers
* buffering
* files
* paths
* `Path`
* `Files`
* NIO
* file operations
* serialization concepts
* deserialization concepts
* object serialization risks
* resource management

---

## MODULE 14 — JVM Memory & Garbage Collection

Topics:

* stack
* heap
* method/class metadata concepts
* objects
* references
* stack frames
* local variables
* object allocation
* garbage collection
* reachability
* GC roots
* young generation
* old generation
* minor/major concepts
* generational GC
* G1 concepts
* garbage collection pauses
* memory leaks in Java
* `OutOfMemoryError`
* `StackOverflowError`
* memory debugging concepts
* JVM memory misconceptions

Clearly distinguish JVM specification concepts from HotSpot implementation details.

---

## MODULE 15 — Multithreading Fundamentals

Topics:

* process vs thread
* creating threads
* `Thread`
* `Runnable`
* lambda-based threads
* thread lifecycle
* states
* `start()` vs `run()`
* thread scheduling
* `sleep()`
* `join()`
* interruption
* daemon threads
* race conditions
* thread safety
* shared state

---

## MODULE 16 — Concurrency & Synchronization

Topics:

* `synchronized`
* synchronized methods
* synchronized blocks
* intrinsic locks
* monitor concept
* mutual exclusion
* visibility
* atomicity
* Java Memory Model
* happens-before
* `volatile`
* atomic classes
* deadlocks
* livelocks
* starvation
* race conditions
* thread-safe design
* immutable objects

---

## MODULE 17 — Executors & Advanced Concurrency

Topics:

* Executor
* ExecutorService
* thread pools
* fixed thread pools
* cached thread pools
* scheduled executors
* Callable
* Future
* FutureTask
* CompletableFuture
* synchronization utilities
* CountDownLatch
* CyclicBarrier
* Semaphore
* concurrent collections
* ConcurrentHashMap
* BlockingQueue
* producer-consumer
* parallel task execution
* concurrency best practices

---

## MODULE 18 — DSA Foundations in Java

Focus on implementing DSA in Java rather than re-teaching generic DSA theory.

Topics:

* arrays
* strings
* frequency arrays
* prefix sums
* sorting
* Java sorting APIs
* comparators
* 2D arrays
* ArrayList
* utility classes
* complexity analysis
* Java-specific performance considerations

---

## MODULE 19 — Hashing DSA Patterns

Topics:

* HashMap problem solving
* HashSet problem solving
* frequency counting
* duplicate detection
* lookup optimization
* grouping
* prefix sum + HashMap
* two-sum pattern
* subarray sum
* frequency maps
* anagram patterns
* Java implementation pitfalls

Progress from easy → medium → difficult.

---

## MODULE 20 — Two Pointers & Sliding Window

Topics:

* two pointers
* opposite-direction pointers
* same-direction pointers
* fixed window
* variable window
* frequency maps
* shrinking windows
* expanding windows
* substring problems
* subarray problems
* common incorrect approaches
* pattern recognition

---

## MODULE 21 — Linked Lists, Stack, Queue & Deque

Topics:

* singly linked list
* doubly linked list
* node implementation
* insertion
* deletion
* reversal
* fast/slow pointers
* cycle detection
* merging
* dummy nodes
* stack
* `ArrayDeque`
* queue
* `LinkedList`
* deque
* monotonic stack
* monotonic queue

---

## MODULE 22 — Trees, BST & Heaps

Topics:

* binary trees
* traversal
* preorder
* inorder
* postorder
* level order
* recursion
* iterative traversal
* BST
* insertion
* deletion
* searching
* validation
* height
* balanced trees
* heap
* min heap
* max heap
* `PriorityQueue`
* top-K problems

---

## MODULE 23 — Graphs

Topics:

* graph representation
* adjacency list
* adjacency matrix
* BFS
* DFS
* connected components
* cycle detection
* topological sort
* shortest path concepts
* Dijkstra
* 0-1 BFS
* union-find / DSU
* graph interview patterns

---

## MODULE 24 — Binary Search, Recursion & Backtracking

Topics:

* binary search
* search space
* lower bound
* upper bound
* binary search on answer
* recursion
* recursion tree
* base cases
* backtracking
* permutations
* combinations
* subsets
* constraint-based search

---

## MODULE 25 — Greedy & Dynamic Programming

Topics:

* greedy thinking
* greedy proof intuition
* interval problems
* scheduling
* dynamic programming
* overlapping subproblems
* optimal substructure
* memoization
* tabulation
* state definition
* transitions
* 1D DP
* 2D DP
* common interview DP patterns

---

## MODULE 26 — SQL Fundamentals

Topics:

* relational databases
* tables
* rows
* columns
* primary keys
* foreign keys
* constraints
* SELECT
* WHERE
* ORDER BY
* GROUP BY
* HAVING
* aggregate functions
* INSERT
* UPDATE
* DELETE
* NULL
* joins
* subqueries
* aliases
* CASE
* views
* basic query optimization

---

## MODULE 27 — Advanced SQL & Database Concepts

Topics:

* normalization
* denormalization
* indexes
* composite indexes
* transactions
* ACID
* isolation levels
* locking concepts
* deadlocks
* constraints
* query plans
* indexing strategy
* pagination
* aggregation
* window functions
* database performance fundamentals

---

## MODULE 28 — JDBC

Topics:

* JDBC architecture
* drivers
* `Connection`
* `Statement`
* `PreparedStatement`
* `ResultSet`
* parameter binding
* SQL injection prevention
* CRUD
* transactions
* commit
* rollback
* batch operations
* connection lifecycle
* connection pooling concepts
* resource management
* JDBC vs ORM

---

## MODULE 29 — Maven & Java Project Management

Topics:

* Maven purpose
* Maven project structure
* `pom.xml`
* dependencies
* dependency scopes
* repositories
* Maven lifecycle
* phases
* goals
* plugins
* dependency management
* transitive dependencies
* version conflicts
* profiles
* multi-module Maven
* common Maven commands
* troubleshooting builds

---

## MODULE 30 — JPA Fundamentals

Topics:

* ORM
* JPA
* entity
* persistence context
* EntityManager
* entity lifecycle
* persistence states
* mappings
* primary keys
* generated IDs
* relationships
* one-to-one
* one-to-many
* many-to-one
* many-to-many
* cascading
* fetch types
* lazy loading
* eager loading

Clearly explain:

> JPA = specification
> Hibernate = implementation

---

## MODULE 31 — Hibernate Internals & Advanced ORM

Topics:

* Hibernate architecture
* Session
* persistence context
* dirty checking
* first-level cache
* second-level cache concepts
* fetching
* joins
* JPQL
* native queries
* N+1 problem
* entity graphs
* batching
* optimistic locking
* pessimistic locking
* transactions
* common Hibernate performance problems
* common mapping mistakes

---

## MODULE 32 — Spring Core

Topics:

* Spring architecture
* IoC
* Dependency Injection
* beans
* bean creation
* bean lifecycle
* bean scopes
* configuration
* component scanning
* `@Component`
* `@Service`
* `@Repository`
* `@Configuration`
* `@Bean`
* constructor injection
* setter injection
* field injection
* dependency resolution
* `@Primary`
* `@Qualifier`
* Spring container

Explain what actually happens internally.

---

## MODULE 33 — Spring Boot Fundamentals

Topics:

* Spring Boot purpose
* project structure
* starters
* auto-configuration
* application startup
* `@SpringBootApplication`
* configuration
* properties
* YAML
* profiles
* embedded server
* dependency injection
* configuration properties
* environment-specific configuration
* Actuator fundamentals

---

## MODULE 34 — Spring MVC & REST APIs

Topics:

* HTTP fundamentals
* request/response lifecycle
* Spring MVC
* controllers
* routing
* `@RequestMapping`
* GET
* POST
* PUT
* PATCH
* DELETE
* path variables
* query parameters
* request bodies
* response bodies
* JSON
* DTOs
* status codes
* REST principles
* validation
* global exception handling
* `@ControllerAdvice`
* API design

---

## MODULE 35 — Spring Data JPA

Topics:

* repositories
* `JpaRepository`
* CRUD
* derived queries
* custom queries
* JPQL
* pagination
* sorting
* specifications
* projections
* transactions
* entity relationships
* repository/service/controller separation
* common Spring Data mistakes

---

## MODULE 36 — Spring Security

Topics:

* authentication
* authorization
* security filters
* security context
* password hashing
* roles
* authorities
* sessions
* stateless authentication
* JWT
* access tokens
* refresh tokens
* endpoint security
* method security
* CORS
* CSRF
* common security mistakes
* secure API design

Do not teach insecure shortcuts as production recommendations.

---

## MODULE 37 — Testing Java & Spring Applications

Topics:

* testing fundamentals
* unit testing
* integration testing
* JUnit
* assertions
* test lifecycle
* parameterized tests
* Mockito
* mocking
* stubbing
* verification
* service testing
* controller testing
* repository testing
* Spring Boot testing
* integration tests
* test databases
* test organization
* meaningful test cases

---

## MODULE 38 — Production-Grade Spring Boot

Topics:

* application architecture
* layered architecture
* DTO/service/repository pattern
* configuration management
* logging
* error handling
* validation
* API versioning concepts
* pagination
* observability fundamentals
* Actuator
* health checks
* external configuration
* environment separation
* transaction boundaries
* performance considerations
* production debugging

---

## MODULE 39 — Backend Architecture & Design

Topics:

* request lifecycle
* layered architecture
* separation of concerns
* dependency direction
* modular design
* coupling
* cohesion
* DTOs
* domain models
* service boundaries
* transaction boundaries
* API design
* caching concepts
* database interaction
* scalability fundamentals
* concurrency considerations
* reliability fundamentals
* common backend architecture mistakes

Do not turn this into an unrelated distributed-systems course.

Only cover concepts relevant to Java backend engineering.

---

## MODULE 40 — Java Full-Stack Integration

Topics:

* browser → HTTP request
* REST API
* JSON
* controller
* service
* repository
* JPA/Hibernate
* database
* response
* frontend consumption
* `fetch()`
* asynchronous requests
* JSON parsing
* form submission
* authentication flow
* CORS
* error handling
* loading states
* API integration
* frontend/backend separation

The learning website itself remains HTML/CSS/JavaScript.

---

## MODULE 41 — Debugging, Performance & Problem Solving

Topics:

* reading stack traces
* debugging Java code
* debugging Spring applications
* common compilation errors
* runtime errors
* null-related bugs
* collection bugs
* concurrency bugs
* database issues
* ORM issues
* logging
* profiling concepts
* memory problems
* performance bottlenecks
* slow SQL
* N+1 queries
* unnecessary object creation
* inefficient collections
* systematic debugging methodology

---

## MODULE 42 — Projects & Interview Engineering

Build progressively harder projects.

### Project 1 — Core Java

Log Analyzer

### Project 2 — OOP

Hotel Reservation System

### Project 3 — Collections

Inventory Management System

### Project 4 — Multithreading

Concurrent Task Processor

### Project 5 — JDBC

Banking Database Application

### Project 6 — JPA/Hibernate

Employee Management API

### Project 7 — Spring Boot

Production-style REST API

For every project teach:

* requirements
* design
* class structure
* database design where applicable
* implementation
* testing
* debugging
* improvements
* interview questions

Do not simply dump finished source code.

---

## MODULE 43 — Final Full-Stack Capstone & Mastery Assessment

Build one complete application combining the important technologies learned throughout the curriculum.

Potentially include:

* Java
* OOP
* Collections
* SQL
* Maven
* JDBC where appropriate
* JPA
* Hibernate
* Spring
* Spring Boot
* REST
* validation
* security
* testing
* database
* frontend integration

The project must be developed incrementally rather than delivered as a giant unexplained code dump.

Include:

* architecture
* requirements
* database design
* API design
* implementation milestones
* testing
* debugging
* security considerations
* performance considerations
* production considerations
* final interview discussion
* comprehensive mastery assessment

---

# Appendix A — Primary ownership (master brief §33)

The master brief names these primary locations directly. Quoted verbatim:

> Each important concept must have one primary location.
>
> Examples:
>
> * HashMap internals → Module 08
> * Stream API → Module 10
> * JDBC → Module 28
> * JPA fundamentals → Module 30
> * Hibernate internals → Module 31
> * Spring Core → Module 32
> * Spring Boot → Module 33
>
> Later modules may use these concepts without completely re-teaching them.
>
> Cross-link to the primary chapter.

Ownership for concepts the brief does not list explicitly follows from the
module a topic appears under in Section 12.

---

# Appendix B — Provenance and realignment record

## Current status: REALIGNED AND LOCKED to the master brief — 2026-08-12

`docs/MASTER_BRIEF.md` is the **canonical source** of this curriculum. The 43
modules, their numbers, their names, and their topic lists in this file are a
verbatim transcription of that brief's Section 12.

**This supersedes the Phase 1 lock of 2026-08-12 entirely.**

### What happened, recorded so no future session has to reconstruct it

1. **Phase 1** was instructed to reproduce the master brief's 43 modules, but
   the brief was not in the repository and was not supplied to that session.
   Only two endpoints were given (Module 01 and Module 43). The 43 modules were
   therefore **authored** in Phase 1, and this appendix flagged them as awaiting
   confirmation.
2. **Phase 3** locked that authored list after the project owner confirmed it,
   still without the brief being available. A discrepancy was raised at the time
   — the Phase 3 instruction's example route `#/module/08-hashing-hashmap` did
   not match the authored Module 08 — and the owner confirmed the list anyway.
3. **The master brief was then added to the repository**, and the authored
   curriculum proved not to match it: **only 2 of 43 module names agreed**
   (Modules 01 and 43 — exactly the two endpoints Phase 1 had been given).
4. **This realignment** replaced the authored curriculum with the brief's,
   verbatim, and regenerated `data/modules.js` from it.

### Consequences

- **41 of 43 module ids changed.** No learner progress existed yet, so nothing
  was orphaned. This is precisely why the realignment had to happen before
  Phase 4 introduces `localStorage` progress keys.
- **Module numbers and names are now permanent**, keyed to the brief. Ids are
  derived from names (`docs/ARCHITECTURE.md` §5), so a rename moves an id.
- **Structural changes from the authored version include:** a dedicated
  **Module 08 — Hashing & HashMap Internals** flagged for extra depth; an
  eight-module **DSA-in-Java block (Modules 18–25)** that the authored
  curriculum lacked entirely; and **Module 42 — Projects & Interview
  Engineering** with seven named projects.

### The rule from here

Change `MASTER_BRIEF.md` first, re-transcribe into this file, then regenerate
`data/modules.js`. Never edit a module block here directly, and never hand-edit
`data/modules.js`. `node tools/generate-modules.mjs --check` verifies both hops
and exits non-zero on drift.

---

*Last updated: 2026-08-12 — realigned to `docs/MASTER_BRIEF.md`.*
