/** Challenge solution - Module 01, Chapter 2. */
public class TriggerHarness {

    public static void main(String[] args) {
        check("read a compile-time constant", () -> use(ConstHolder.LIMIT));
        check("read a non-constant static final", () -> use(BoxedHolder.LIMIT.intValue()));
        check("declare an array type", () -> use(new ArrayOnly[2].length));
        check("read an inherited static field", () -> use(Sub.inherited.length()));
        check("call a static method", () -> { StaticMethod.ping(); return 0; });
        check("instantiate", () -> { new Instantiated(); return 0; });
    }

    static int use(int value) { return value; }

    static void check(String label, java.util.function.Supplier<Integer> action) {
        System.out.println(label + ":");
        action.get();
        System.out.println("  -> done");
    }
}

class ConstHolder     { static final int LIMIT = 10;
                        static { System.out.println("  INITIALIZED ConstHolder"); } }
class BoxedHolder     { static final Integer LIMIT = 10;
                        static { System.out.println("  INITIALIZED BoxedHolder"); } }
class ArrayOnly       { static { System.out.println("  INITIALIZED ArrayOnly"); } }
class Base            { static String inherited = "base";
                        static { System.out.println("  INITIALIZED Base"); } }
class Sub extends Base { static { System.out.println("  INITIALIZED Sub"); } }
class StaticMethod    { static void ping() { }
                        static { System.out.println("  INITIALIZED StaticMethod"); } }
class Instantiated    { static { System.out.println("  INITIALIZED Instantiated"); } }
