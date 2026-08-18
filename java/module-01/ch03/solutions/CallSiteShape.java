/**
 * Challenge solution - Module 01, Chapter 3.
 *
 * How much does the SHAPE of a call site cost? One implementation
 * (monomorphic), two (bimorphic), or many (megamorphic) - same work each time.
 */
public class CallSiteShape {

    interface Op { int apply(int x); }

    static class A implements Op { public int apply(int x) { return x + 1; } }
    static class B implements Op { public int apply(int x) { return x + 2; } }
    static class C implements Op { public int apply(int x) { return x + 3; } }
    static class D implements Op { public int apply(int x) { return x + 4; } }
    static class E implements Op { public int apply(int x) { return x + 5; } }

    static long sink;

    static void drive(Op[] ops, int iterations) {
        long total = 0;
        for (int i = 0; i < iterations; i++) {
            total += ops[i % ops.length].apply(i);
        }
        sink += total;
    }

    static long timeIt(String label, Op[] ops) {
        // Warm up until the call site's shape is established and compiled.
        for (int i = 0; i < 50; i++) drive(ops, 100_000);

        long best = Long.MAX_VALUE;
        for (int round = 0; round < 5; round++) {
            long start = System.nanoTime();
            drive(ops, 20_000_000);
            best = Math.min(best, (System.nanoTime() - start) / 1_000);
        }
        System.out.printf("%-14s %,9d us (best of 5)%n", label, best);
        return best;
    }

    public static void main(String[] args) {
        Op a = new A(), b = new B(), c = new C(), d = new D(), e = new E();

        timeIt("monomorphic", new Op[] { a });
        timeIt("bimorphic",   new Op[] { a, b });
        timeIt("megamorphic", new Op[] { a, b, c, d, e });

        System.out.println("sink " + sink);
    }
}
