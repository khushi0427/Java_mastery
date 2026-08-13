/**
 * What actually triggers class initialization, and what only looks like it does.
 * Module 01, Chapter 2.
 */
public class InitTriggers {

    public static void main(String[] args) {
        System.out.println("1. read a compile-time constant:");
        System.out.println("   value = " + WithConstant.CONSTANT);

        System.out.println("2. read a static final that is NOT a compile-time constant:");
        System.out.println("   value = " + WithComputed.COMPUTED);

        System.out.println("3. create an array of a type:");
        Sleeper[] array = new Sleeper[3];
        System.out.println("   array length = " + array.length);

        System.out.println("4. read a static field the SUBCLASS inherited:");
        System.out.println("   value = " + Child.parentField);

        System.out.println("5. instantiate the subclass:");
        new Child();
    }
}

class WithConstant {
    static final int CONSTANT = 42;
    static { System.out.println("   >> WithConstant initialized"); }
}

class WithComputed {
    static final Integer COMPUTED = Integer.valueOf(42);
    static { System.out.println("   >> WithComputed initialized"); }
}

class Sleeper {
    static { System.out.println("   >> Sleeper initialized"); }
}

class Parent {
    static String parentField = "from Parent";
    static { System.out.println("   >> Parent initialized"); }
}

class Child extends Parent {
    static { System.out.println("   >> Child initialized"); }
}
