/**
 * Preparation gives static fields their DEFAULT values.
 * Initialization runs the initializers, in textual order.
 * Module 01, Chapter 2.
 */
public class Preparation {
    public static void main(String[] args) {
        System.out.println("counter is now " + Counter.counter);
    }
}

class Counter {
    // Runs during INITIALIZATION and reads later, which preparation has
    // already set to its default.
    static int counter = report();

    static int later = 99;

    static int report() {
        System.out.println("  initializer running; later = " + later);
        return 1;
    }

    static {
        System.out.println("  static block; counter = " + counter + ", later = " + later);
    }
}
