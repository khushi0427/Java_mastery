/**
 * The JIT speculates on what it has seen, then undoes that when reality changes.
 * Module 01, Chapter 3.
 *
 *   javac --release 17 Deoptimization.java
 *   java -XX:+PrintCompilation Deoptimization | grep -E 'Deoptimization|made not entrant'
 */
public class Deoptimization {

    interface Shape { int sides(); }
    static class Triangle implements Shape { public int sides() { return 3; } }
    static class Square   implements Shape { public int sides() { return 4; } }

    static long total;

    /** One call site. For a long time it only ever sees Triangle. */
    static void consume(Shape shape, int times) {
        for (int i = 0; i < times; i++) {
            total += shape.sides();
        }
    }

    public static void main(String[] args) {
        Shape triangle = new Triangle();

        System.out.println("phase 1: only Triangle, 200k calls");
        for (int i = 0; i < 200_000; i++) {
            consume(triangle, 10);
        }

        System.out.println("phase 2: introduce Square at the same call site");
        Shape square = new Square();
        for (int i = 0; i < 200_000; i++) {
            consume(i % 2 == 0 ? triangle : square, 10);
        }

        System.out.println("total " + total);
    }
}
