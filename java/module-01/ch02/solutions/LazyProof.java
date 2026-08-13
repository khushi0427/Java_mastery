/** Warm-up solution - Module 01, Chapter 2. */
public class LazyProof {
    public static void main(String[] args) {
        System.out.println("before touching anything");
        System.out.println("Used.NAME = " + Used.NAME);
        System.out.println("done - Unused was never loaded");
    }
}

class Used {
    static final String NAME = makeName();
    static { System.out.println("  >> Used initialized"); }
    static String makeName() { return "used"; }
}

class Unused {
    static { System.out.println("  >> Unused initialized"); }
}
