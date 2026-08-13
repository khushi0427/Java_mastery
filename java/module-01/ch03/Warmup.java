/**
 * The same work, repeated. The JVM gets faster at it as it runs.
 * Module 01, Chapter 3.
 *
 * The unit of work is deliberately SMALL and called MANY times, so the method
 * is compiled because of its invocation count rather than being replaced
 * mid-loop on its first call.
 *
 *   javac --release 17 Warmup.java
 *   java Warmup                 # interpreter + JIT (the default)
 *   java -Xint Warmup           # interpreter only
 *   java -XX:TieredStopAtLevel=1 Warmup   # C1 only, no C2
 */
public class Warmup {

    static long work(int n) {
        long total = 0;
        for (int i = 1; i <= n; i++) {
            total += (i % 7) * (i % 13);
        }
        return total;
    }

    public static void main(String[] args) {
        int batches = args.length > 0 ? Integer.parseInt(args[0]) : 12;
        int callsPerBatch = 20_000;
        int workSize = 200;

        long checksum = 0;
        for (int batch = 1; batch <= batches; batch++) {
            long start = System.nanoTime();
            for (int call = 0; call < callsPerBatch; call++) {
                checksum += work(workSize);
            }
            long micros = (System.nanoTime() - start) / 1_000;
            System.out.printf("batch %2d: %,8d us%n", batch, micros);
        }
        System.out.println("checksum " + checksum);
    }
}
