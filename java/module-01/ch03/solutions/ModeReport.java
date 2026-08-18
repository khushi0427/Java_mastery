/**
 * Easy solution - Module 01, Chapter 3.
 *
 * Reports the execution mode the JVM is actually running in, from inside the
 * program, and times a fixed workload so the three modes can be compared.
 *
 *   java ModeReport
 *   java -Xint ModeReport
 *   java -Xcomp ModeReport
 *   java -XX:TieredStopAtLevel=1 ModeReport
 */
public class ModeReport {

    static long work(int n) {
        long total = 0;
        for (int i = 1; i <= n; i++) total += (i % 7) * (i % 13);
        return total;
    }

    public static void main(String[] args) {
        System.out.println("java.vm.name    " + System.getProperty("java.vm.name"));
        System.out.println("java.vm.info    " + System.getProperty("java.vm.info"));
        System.out.println("java.vm.version " + System.getProperty("java.vm.version"));

        long sink = 0;
        long best = Long.MAX_VALUE;
        for (int round = 0; round < 8; round++) {
            long start = System.nanoTime();
            for (int call = 0; call < 20_000; call++) sink += work(200);
            best = Math.min(best, (System.nanoTime() - start) / 1_000);
        }
        System.out.printf("best of 8 rounds: %,d us%n", best);
        System.out.println("sink " + sink);
    }
}
