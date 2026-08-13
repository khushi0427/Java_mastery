# MASTER PROMPT — JAVA FULL-STACK MASTERY LEARNING PLATFORM

You are working inside an existing repository named:

`java-fullstack-mastery/`

Your task is to transform this repository into a **complete, professional Java Full-Stack learning platform**.

The final product should be a **single integrated browser-based study website** containing a structured, deep, practical Java Full-Stack curriculum, interactive practice, Java coding execution where technically possible, interview preparation, assessments, projects, revision material, and progress tracking.

The learner is already a programmer and is transitioning from C++/other programming experience into the Java ecosystem.

The objective is:

> Build deep understanding of Java and the Java Full-Stack ecosystem so the learner can write, execute, debug, explain, design, and defend professional Java applications rather than merely memorize definitions.

---

# 0. MOST IMPORTANT RULE — THE REPOSITORY IS THE SOURCE OF TRUTH

This project must NOT depend on previous chat history.

The user may:

* close the current Claude Code session
* start a new Claude Code session
* use a different Claude model
* use another AI coding agent
* return days or weeks later
* continue from a different computer/session

Therefore, **all important project context must be persisted inside the repository.**

The repository itself is the source of truth.

Never assume that previous conversation history is available.

Never assume that previous AI decisions are remembered.

Before making changes in ANY session, inspect the repository and read the persistent project documentation described below.

---

# 1. REQUIRED PERSISTENT PROJECT DOCUMENTATION

Maintain these files throughout the project:

```text
README.md
CLAUDE.md
docs/
├── PROJECT_STATE.md
├── ARCHITECTURE.md
├── CURRICULUM.md
└── AI_INSTRUCTIONS.md
```

If some of these files do not exist, create them during the initial foundation phase.

---

## 1.1 README.md

`README.md` must be sufficiently complete that **a completely new human or AI agent can understand the project without access to this conversation.**

It must contain:

* project purpose
* project goals
* learner profile
* technology restrictions
* Java version
* complete 43-module curriculum
* learning methodology
* practice methodology
* website architecture
* project structure
* compiler/execution architecture
* local Java execution instructions
* progress-tracking behavior
* development workflow
* chapter delivery workflow
* `CONTINUE` behavior
* verification requirements
* important permanent rules
* current project status
* how another AI can continue the project
* link/reference to `CLAUDE.md`
* link/reference to `docs/PROJECT_STATE.md`
* link/reference to `docs/ARCHITECTURE.md`
* link/reference to `docs/CURRICULUM.md`
* link/reference to `docs/AI_INSTRUCTIONS.md`

The README should not merely describe the website.

It must also provide enough information for another AI to understand **how this project is supposed to be developed.**

---

# 2. AI SESSION INITIALIZATION RULE

At the beginning of EVERY AI/development session, before modifying anything:

### Step 1

Read:

```text
README.md
CLAUDE.md
docs/AI_INSTRUCTIONS.md
docs/PROJECT_STATE.md
docs/ARCHITECTURE.md
docs/CURRICULUM.md
```

If any file does not exist yet, create it if this is the initial foundation phase.

### Step 2

Inspect the actual repository structure.

### Step 3

Inspect the relevant existing implementation files.

### Step 4

Determine:

* what has already been completed
* what is partially complete
* what is broken
* what the next incomplete task/chapter is

### Step 5

Do NOT recreate completed work.

### Step 6

Do NOT overwrite useful existing work blindly.

### Step 7

Do NOT infer project state solely from conversation history.

### Step 8

If documentation and implementation disagree, investigate the actual repository before making changes.

The repository and its persistent state files take precedence over assumptions from previous conversations.

---

# 3. PROJECT STATE MANAGEMENT

Maintain:

```text
docs/PROJECT_STATE.md
```

This file must always describe the current state of the project.

It should contain at minimum:

```text
Project phase
Current module
Current chapter
Completed modules
Completed chapters
Partially completed work
Next required task
Completed website features
Compiler integration status
Known bugs
Known limitations
Important architectural decisions
Important implementation decisions
Things that must NOT be redone
Last verification status
Last updated date
```

After every meaningful development unit:

1. update `PROJECT_STATE.md`
2. update relevant documentation
3. ensure the repository reflects the documented state

Never falsely mark content as complete.

Creating a module folder or placeholder does NOT mean the module is complete.

---

# 4. AI_INSTRUCTIONS.md

Create:

```text
docs/AI_INSTRUCTIONS.md
```

This must contain the permanent instructions required for **any AI coding agent** working on the project.

It must explain:

* repository-first workflow
* no reliance on conversation history
* technology restrictions
* 43-module constraint
* accuracy requirements
* no hallucination
* no unnecessary technologies
* no curriculum duplication
* practice-first methodology
* compiler requirements
* local fallback
* testing requirements
* chapter-by-chapter workflow
* `CONTINUE` behavior
* project-state requirements
* non-destructive development
* documentation requirements

This file should be written generically enough that an AI other than Claude can understand it.

---

# 5. CLAUDE.md

Create/update:

```text
CLAUDE.md
```

This is the Claude Code-specific development instruction file.

It should contain the important permanent rules from this prompt.

Claude must treat it as persistent project instructions.

Do not rely on this conversation being available in future sessions.

---

# 6. ARCHITECTURE.md

Maintain:

```text
docs/ARCHITECTURE.md
```

Document:

* frontend architecture
* file structure
* data architecture
* module/chapter architecture
* practice architecture
* interview-question architecture
* assessment architecture
* progress system
* localStorage usage
* compiler/execution abstraction
* online execution adapter
* local fallback
* navigation
* search
* responsive behavior
* important design decisions

If architecture changes later, update this file.

---

# 7. CURRICULUM.md

Maintain:

```text
docs/CURRICULUM.md
```

This must contain the authoritative 43-module curriculum.

The curriculum must contain **exactly these 43 modules**.

Do not randomly create, remove, rename, merge, or split modules.

Avoid unnecessary duplication.

---

# 8. NON-NEGOTIABLE PRINCIPLES

## 8.1 One learning platform

The final repository must function as **one integrated study website**.

It must provide:

* Dashboard
* 43-module curriculum
* Chapter navigation
* Search
* Practice
* Interactive coding where possible
* Interview questions
* Assessments
* Revision
* Projects
* Progress tracking
* Dark/light mode

Do not create a collection of disconnected documentation pages.

---

## 8.2 Website technology

The study website UI must use:

* HTML
* CSS
* Vanilla JavaScript

Do NOT use:

* React
* Angular
* Vue
* TypeScript
* frontend frameworks
* unnecessary Node.js application infrastructure

This restriction applies to the **learning website UI**.

It does NOT prevent the curriculum from teaching:

* Java
* Spring
* Spring Boot
* SQL
* Maven
* JPA
* Hibernate
* REST
* JDBC
* JavaScript
* etc.

A small backend/proxy may be introduced **only if genuinely required for secure Java execution API integration**.

Do not introduce a backend merely because it is convenient.

---

# 9. JAVA VERSION

Use:

> Java 17+

unless a specific topic explicitly requires discussion of another Java version.

When discussing newer Java features, clearly identify the relevant Java version.

Do not silently teach a Java feature that is unavailable in Java 17 as though it were part of Java 17.

---

# 10. ACCURACY OVER VOLUME

Never add content merely to make the curriculum appear larger.

Do not:

* invent APIs
* invent annotations
* invent framework behavior
* invent JVM behavior
* invent Maven behavior
* invent configuration properties
* invent compiler APIs
* invent interview requirements
* make unsupported performance claims
* fabricate documentation
* fabricate benchmark results

When something depends on implementation details, distinguish between:

* Java Language Specification
* JVM Specification
* Java standard-library behavior
* framework behavior
* implementation-specific behavior
* HotSpot-specific behavior

When external verification is necessary:

* use authoritative documentation
* verify current API behavior
* verify current free compiler-service availability
* verify current framework behavior
* never guess

If something cannot be verified, do not present it as fact.

---

# 11. LEARNER PROFILE

Assume the learner:

* already knows programming fundamentals
* knows C++
* has previous DSA experience
* knows JavaScript
* has HTML/CSS knowledge
* understands basic web concepts
* is transitioning into Java
* wants strong Java fundamentals
* wants to understand Java internally
* wants interview-level understanding
* wants practical engineering ability

Do NOT waste substantial learning time teaching:

* what a variable is
* what a loop is
* what an if statement is
* basic generic programming concepts

Focus on:

* Java-specific syntax
* Java semantics
* JVM behavior
* Java object model
* memory behavior
* Java collections
* Java concurrency
* Java ecosystem
* Java-specific pitfalls
* production implications
* interview reasoning

Where genuinely useful, compare Java with C++.

---

# 12. EXACT 43-MODULE CURRICULUM

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

# 13. CONTENT STRUCTURE FOR CHAPTERS

Every substantive chapter should use an appropriate subset of:

1. What is it?
2. Why does it exist?
3. Mental model
4. How it works
5. Java syntax
6. Simple example
7. Practical example
8. Internal behavior
9. Common mistakes
10. Java vs C++ where useful
11. Performance where relevant
12. Edge cases
13. Production considerations
14. Interview questions
15. Practice
16. Revision

Do NOT mechanically include every section for trivial concepts.

---

# 14. PRACTICE-FIRST LEARNING

The platform must follow:

```text
Learn
 ↓
Predict
 ↓
Code
 ↓
Compile
 ↓
Run
 ↓
Observe
 ↓
Debug
 ↓
Modify
 ↓
Solve
 ↓
Explain
```

Practice must be an integral part of the website.

Do not build a documentation-only website.

---

# 15. JAVA CODE EXECUTION

Provide an interactive Java coding environment wherever technically possible.

Desired flow:

```text
Problem
   ↓
Code Editor
   ↓
Run
   ↓
Java Compilation
   ↓
Program Execution
   ↓
Output
```

The learner should be able to:

* edit Java code
* run code
* see stdout
* see compilation errors
* see runtime errors
* reset starter code

---

# 16. FREE JAVA COMPILER API

If technically feasible, integrate a **currently available free Java compilation/execution API**.

Rules:

* Never invent an API.
* Never assume an API is permanently free.
* Check current documentation before integration.
* Verify Java support.
* Verify request/response format.
* Verify current pricing/free-tier status.
* Verify CORS behavior.
* Respect rate limits.
* Respect terms of service.
* Never hardcode secret API keys.
* Never expose secret credentials in frontend JavaScript.
* Isolate the integration behind an execution-service abstraction.
* Make the provider replaceable.

If a backend proxy is required for:

* CORS
* credential protection
* API security

then implement the smallest appropriate architecture.

Do not add unnecessary backend infrastructure.

If no reliable free API is currently suitable:

* do NOT fake one
* build the editor UI
* build the execution-service abstraction
* build the unavailable-provider fallback state
* document local execution
* document where a future provider can be connected

The learning platform must remain fully usable without the third-party API.

---

# 17. LOCAL JAVA EXECUTION FALLBACK

Always provide local execution instructions:

```text
Save / Copy Code
       ↓
javac Main.java
       ↓
java Main
```

Explain:

* installing Java 17+
* checking `java -version`
* checking `javac -version`
* compiling
* running
* common errors

Do not make online execution a hard dependency for learning.

---

# 18. PRACTICE QUESTIONS

Every substantive chapter should contain progressive exercises:

```text
Warm-up
 ↓
Easy
 ↓
Applied
 ↓
Medium
 ↓
Challenge
 ↓
Interview-style
```

Prefer approximately 4–8 exercises depending on chapter size.

Each exercise should include:

* title
* difficulty
* objective
* problem statement
* requirements
* constraints where relevant
* sample input
* sample output
* edge cases
* test cases
* hints
* reference solution
* explanation
* complexity analysis where relevant

Do not reveal solutions by default.

---

# 19. PREDICT-THE-OUTPUT

For behavior-heavy Java chapters, include approximately 5–8 predict-the-output questions where appropriate.

Especially:

* OOP
* strings
* wrappers
* `==` vs `.equals()`
* inheritance
* overriding
* static
* constructors
* exceptions
* collections
* HashMap
* streams
* lambdas
* multithreading
* synchronization
* JVM behavior

Answers should be hidden/revealed after the learner attempts them.

---

# 20. HINT SYSTEM

Use:

```text
Hint 1 → Small nudge
Hint 2 → Approach
Hint 3 → Strong guidance
Solution → Complete implementation
```

Solutions should not appear next to the problem by default.

---

# 21. INTERVIEW PREPARATION

Integrate interview questions into relevant chapters.

Categories:

* Fundamental
* Practical
* Advanced
* Tricky
* Scenario-based
* Coding
* Debugging
* Production

For important questions:

```text
Question

What is being tested?

How should you think about it?

Strong answer

Common weak answer

Why the weak answer is incomplete

Likely follow-up

"But why?"
```

Do not teach memorized scripts.

Teach the underlying reasoning.

---

# 22. DSA REQUIREMENTS

The learner already has DSA experience.

Therefore DSA should focus on:

* Java implementation
* Java collections
* Java syntax
* performance
* interview patterns
* Java-specific implementation mistakes
* clean Java solutions

For algorithmic solutions include:

```text
Approach
Time Complexity
Space Complexity
Java Implementation
Dry Run
Edge Cases
Common Mistakes
```

---

# 23. WEBSITE STRUCTURE

Use a maintainable architecture similar to:

```text
java-fullstack-mastery/
│
├── index.html
│
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
│
├── data/
│   ├── modules.js
│   ├── chapters.js
│   ├── questions.js
│   ├── exercises.js
│   └── assessments.js
│
├── modules/
│   ├── 01-java-foundations/
│   ├── 02-oop/
│   ├── ...
│   └── 43-final-capstone/
│
├── practice/
├── interview/
├── assessments/
├── projects/
├── revision/
│
├── docs/
│   ├── PROJECT_STATE.md
│   ├── ARCHITECTURE.md
│   ├── CURRICULUM.md
│   └── AI_INSTRUCTIONS.md
│
├── README.md
└── CLAUDE.md
```

You may improve the exact implementation if there is a clearly better architecture.

Do not sacrifice maintainability merely to follow this exact tree.

---

# 24. DASHBOARD

Show:

* overall progress
* module progress
* current learning position
* recently studied chapters
* recommended next chapter
* practice progress
* assessment progress

---

# 25. SIDEBAR

Support:

* module expansion
* chapter navigation
* active chapter highlighting
* progress indicators
* mobile drawer

---

# 26. SEARCH

Search across:

* module titles
* chapter titles
* concepts
* interview questions
* practice questions
* revision content

Search results must identify where the result came from and provide navigation.

Use Vanilla JavaScript.

---

# 27. PROGRESS TRACKING

Use `localStorage` for:

* completed chapters
* completed exercises
* assessment scores
* current position
* theme preference

Do not require a backend account system.

Progress must persist between browser sessions.

---

# 28. DARK/LIGHT MODE

Support:

* light mode
* dark mode

Persist the user's preference with `localStorage`.

---

# 29. RESPONSIVE DESIGN

Support:

* desktop
* laptop
* tablet
* mobile

Do not treat mobile support as an afterthought.

---

# 30. CODE PRESENTATION

Important Java code blocks should support:

* syntax highlighting
* copy button
* language label
* expected output where relevant
* explanation

Where possible, allow code to be transferred directly into the practice editor.

---

# 31. VISUAL LEARNING

Use diagrams only when they improve understanding.

Useful visualizations include:

* JVM architecture
* HashMap buckets
* object references
* inheritance
* stack/heap
* thread states
* Spring request flow
* Spring dependency injection
* Hibernate persistence context
* database relationships
* HTTP request lifecycle

Avoid decorative diagrams that provide no educational value.

---

# 32. QUALITY CONTROL

Before adding content ask:

### Is it relevant?

If not, remove it.

### Is it already taught elsewhere?

If yes, link to the primary location instead of duplicating it.

### Is it in the correct progression?

If not, reorganize appropriately.

### Is it too shallow?

Expand it.

### Is it unnecessarily advanced?

Move it later.

### Is it merely a buzzword?

Teach the underlying concept or remove it.

---

# 33. NO DUPLICATION

Each important concept must have one primary location.

Examples:

* HashMap internals → Module 08
* Stream API → Module 10
* JDBC → Module 28
* JPA fundamentals → Module 30
* Hibernate internals → Module 31
* Spring Core → Module 32
* Spring Boot → Module 33

Later modules may use these concepts without completely re-teaching them.

Cross-link to the primary chapter.

---

# 34. PROJECTS

Projects must increase in complexity.

Do not dump finished source code.

Use:

```text
Requirements
 ↓
Design
 ↓
Class/Component Structure
 ↓
Implementation
 ↓
Testing
 ↓
Debugging
 ↓
Improvement
 ↓
Interview Discussion
```

The learner should build projects progressively.

---

# 35. FINAL WEBSITE EXPERIENCE

The website should feel like:

> A personal Java Full-Stack engineering university.

It should NOT feel like:

* a Markdown repository
* random notes
* copied documentation
* definitions-only material
* giant code dumps

The learner should be able to:

```text
Learn a concept
      ↓
Understand why it exists
      ↓
See how it works
      ↓
Predict behavior
      ↓
Write code
      ↓
Compile it
      ↓
Run it
      ↓
Debug it
      ↓
Solve exercises
      ↓
Answer interview questions
      ↓
Use it in a project
      ↓
Revise it
```

---

# 36. DELIVERY STRATEGY

The final repository must contain all 43 modules.

However, do NOT generate all learning content in one step.

There are two states.

## Initial implementation

Create:

* website shell
* dashboard
* navigation
* 43-module structure
* module metadata
* search foundation
* progress system
* practice system foundation
* compiler integration architecture
* README
* CLAUDE.md
* AI_INSTRUCTIONS.md
* PROJECT_STATE.md
* ARCHITECTURE.md
* CURRICULUM.md

Modules may contain metadata/placeholders at this stage.

Do not create fake educational content.

---

## Progressive implementation

When the user explicitly says:

`CONTINUE`

build the next incomplete chapter in sequence.

---

# 37. FIRST TASK — FOUNDATION ONLY

Do ONLY the following initially.

## Step 1 — Inspect the existing repository

Inspect:

* existing files
* existing folders
* existing website
* existing learning material
* existing frontend
* existing configuration
* package/build files
* existing Git state/history where useful

Do NOT blindly delete or overwrite useful work.

First understand what already exists.

---

## Step 2 — Build the website foundation

Create/update:

* `index.html`
* CSS
* Vanilla JavaScript
* navigation
* dashboard
* responsive layout
* dark/light mode
* search foundation
* progress tracking foundation
* 43-module metadata
* module navigation
* chapter navigation foundation
* practice UI foundation
* compiler/editor UI foundation

---

## Step 3 — Build persistent documentation

Create/update:

```text
README.md
CLAUDE.md
docs/PROJECT_STATE.md
docs/ARCHITECTURE.md
docs/CURRICULUM.md
docs/AI_INSTRUCTIONS.md
```

Make sure the README contains enough information for another AI to continue the project without access to this conversation.

---

## Step 4 — Add Java execution architecture

Create the abstraction:

```text
Code Editor
     ↓
Run
     ↓
Java Execution Service
     ↓
Online Execution Adapter
     ↓
Output
```

with:

```text
Local Java Execution
```

as fallback.

Do not invent or fake an API.

If a reliable free API is currently available and appropriate, verify its documentation and integrate it appropriately.

If no reliable free API is suitable:

* do not fabricate one
* implement the adapter interface
* implement graceful unavailable-provider handling
* implement the local fallback
* document how a provider can later be connected

---

## Step 5 — Create all 43 module entries

Create metadata for all 43:

```text
Module Number
Module Name
Description
Topics
Status
Progress
Chapter count
```

Do NOT create fake chapter content.

A module existing in the filesystem does not mean it is complete.

---

# 38. VERIFICATION OF FOUNDATION

Actually test the website.

Verify:

* navigation works
* sidebar works
* module expansion works
* chapter navigation foundation works
* mobile layout works
* dark/light mode works
* search works
* progress tracking works
* localStorage persistence works
* module navigation works
* practice UI works
* editor UI works
* compiler UI gracefully handles unavailable APIs
* no broken internal links
* no obvious console errors
* no obvious layout problems

If possible, use a browser/dev-server workflow to visually inspect the website rather than relying only on static code inspection.

Do not claim something was tested if it was not actually tested.

---

# 39. INITIAL FOUNDATION STOP CONDITION

After completing the foundation:

1. Update `PROJECT_STATE.md`.
2. Update README if necessary.
3. Update architecture documentation if necessary.
4. Verify the repository.
5. STOP.

Do NOT:

* create Chapter 1
* create full learning content
* automatically continue
* create fake exercises
* fill modules with placeholder educational text presented as real content

The user must explicitly say:

`CONTINUE`

before educational chapter implementation begins.

---

# 40. FOUNDATION REPORT

After the foundation is complete, report approximately:

```text
Foundation complete.

Modules created: 43
Website foundation: complete
Search: complete/foundation
Progress tracking: complete/foundation
Practice system: complete/foundation
Java compiler integration: complete/fallback
Responsive layout: complete
Dark/light mode: complete
Persistent documentation: complete

Current project state:
...

Repository tree:
...
```

Then STOP.

---

# 41. CONTINUE WORKFLOW

When the user says:

`CONTINUE`

do the following:

1. Read `README.md`.
2. Read `CLAUDE.md`.
3. Read `docs/AI_INSTRUCTIONS.md`.
4. Read `docs/PROJECT_STATE.md`.
5. Read relevant architecture/curriculum documentation.
6. Inspect the repository.
7. Determine the first incomplete chapter.
8. Build ONLY that chapter.
9. Integrate it into the website.
10. Verify it.
11. Update `PROJECT_STATE.md`.
12. Update relevant documentation.
13. STOP.

Never determine the next chapter solely from conversation history.

The repository state determines what comes next.

---

# 42. CHAPTER DELIVERY WORKFLOW

For each chapter:

```text
Chapter
 ↓
Concept material
 ↓
Examples
 ↓
Predict-the-output
 ↓
Guided lab
 ↓
Practice problems
 ↓
Hints
 ↓
Interactive execution where applicable
 ↓
Solutions
 ↓
Interview questions
 ↓
Common mistakes
 ↓
Revision
 ↓
Website integration
 ↓
Verification
 ↓
Update project state
 ↓
STOP
```

Do not automatically proceed to another chapter.

Wait for the next `CONTINUE`.

---

# 43. CHAPTER QUALITY STANDARD

Before marking a chapter complete, verify:

* explanations are technically accurate
* Java code compiles
* examples have correct output
* practice questions are solvable
* solutions are correct
* complexity analysis is correct
* no duplicated material
* interview questions match the chapter
* navigation works
* code blocks render correctly
* compiler integration works where applicable
* mobile presentation is usable
* interactive elements work
* no obvious console errors

Never knowingly leave broken Java code in the learning material.

---

# 44. VERIFICATION HONESTY

Never say:

> "tested successfully"

unless you actually tested it.

Never say:

> "API works"

unless you actually verified it.

Never say:

> "Java code compiles"

unless the code was actually compiled or otherwise rigorously verified.

If something could not be tested because the required environment/service is unavailable, explicitly state:

```text
Not verified because: ...
```

---

# 45. GIT SAFETY

Do not perform destructive Git operations.

Never:

* force push
* rewrite history
* delete useful existing work without inspection
* reset the repository destructively
* overwrite unrelated user work

Commits may be made after meaningful completed units if appropriate.

Git is secondary to the quality of the learning platform.

---

# 46. IMPORTANT STATE RULE

A module/chapter can have states such as:

```text
NOT_STARTED
FOUNDATION_ONLY
IN_PROGRESS
CONTENT_COMPLETE
VERIFIED
```

Do not treat:

```text
folder exists
```

as:

```text
chapter complete
```

Only mark a chapter as `VERIFIED` after its content and implementation have been checked according to the quality standard.

---

# 47. FINAL SUCCESS CRITERIA

The final website should allow the learner to progress through:

```text
Java Foundations
        ↓
OOP
        ↓
Core Java
        ↓
Collections
        ↓
Hashing
        ↓
Functional Java
        ↓
Streams
        ↓
JVM
        ↓
Multithreading
        ↓
Concurrency
        ↓
DSA in Java
        ↓
SQL
        ↓
JDBC
        ↓
Maven
        ↓
JPA
        ↓
Hibernate
        ↓
Spring
        ↓
Spring Boot
        ↓
REST APIs
        ↓
Spring Data
        ↓
Spring Security
        ↓
Testing
        ↓
Production Backend
        ↓
Full-Stack Integration
        ↓
Projects
        ↓
Final Capstone
        ↓
Interview Mastery
```

The learner should genuinely understand the technologies rather than merely recognize their names.

The final standard is:

> **The learner should be able to write, execute, debug, explain, design, and defend Java Full-Stack solutions in a professional/interview environment.**

---

# 48. FINAL INSTRUCTION

Start NOW with:

1. repository inspection
2. website foundation
3. 43-module metadata
4. compiler/execution architecture
5. persistent project documentation
6. verification

Do NOT create Chapter 1.

Do NOT generate full learning content.

Do NOT continue beyond the foundation.

After completing the foundation, update the persistent project state and STOP.

Wait for the user's explicit:

`CONTINUE`

before building Chapter 1.
