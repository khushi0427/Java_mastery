/** Easy solution - Module 01, Chapter 2. */
public class InitOrder {
    public static void main(String[] args) {
        System.out.println("result = " + Ordered.result);
    }
}

class Ordered {
    static int first = report("first", 1);

    static {
        // `second` is declared BELOW. A simple-name read here is an "illegal
        // forward reference" and will not compile; a qualified read is allowed
        // and sees the default value that preparation installed.
        System.out.println("  static block A sees first=" + first
            + " second=" + Ordered.second);
        second = 20;   // writing to it is fine
    }

    static int second;
    static int result = first + second;

    static {
        System.out.println("  static block B sees result=" + result);
    }

    static int report(String label, int value) {
        System.out.println("  initializing " + label + " to " + value);
        return value;
    }
}
