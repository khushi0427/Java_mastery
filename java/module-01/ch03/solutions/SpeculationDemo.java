/**
 * Medium solution - Module 01, Chapter 3.
 *
 * Makes C2 speculate that a call site is monomorphic, then breaks that
 * assumption and observes the deoptimisation.
 *
 *   javac --release 17 SpeculationDemo.java
 *   java -XX:+PrintCompilation SpeculationDemo | grep -E 'SpeculationDemo|phase'
 *   java -Xlog:deoptimization=debug SpeculationDemo | grep deoptimization
 */
public class SpeculationDemo {

    interface Handler { int handle(int x); }
    static class Fast implements Handler { public int handle(int x) { return x + 1; } }
    static class Slow implements Handler { public int handle(int x) { return x + 2; } }

    static long sink;

    static void run(Handler h, int times) {
        for (int i = 0; i < times; i++) sink += h.handle(i);
    }

    public static void main(String[] args) {
        Handler fast = new Fast();

        System.out.println("phase 1: only Fast");
        for (int i = 0; i < 200_000; i++) run(fast, 10);

        System.out.println("phase 2: Slow appears at the same call site");
        Handler slow = new Slow();
        for (int i = 0; i < 200_000; i++) run(i % 2 == 0 ? fast : slow, 10);

        System.out.println("sink " + sink);
    }
}
