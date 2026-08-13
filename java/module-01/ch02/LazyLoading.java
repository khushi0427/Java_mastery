/**
 * A class is not loaded until it is first actively used.
 * Module 01, Chapter 2.
 *
 *   javac --release 17 LazyLoading.java
 *   java -verbose:class LazyLoading | grep -E 'Heavy|Never'
 */
public class LazyLoading {

    public static void main(String[] args) {
        System.out.println("main started");

        // Declaring a reference does NOT load the class.
        Heavy notYet;
        System.out.println("declared a Heavy reference");

        // This does.
        notYet = new Heavy();
        System.out.println("created a Heavy");
    }
}

class Heavy {
    static { System.out.println("  >> Heavy static initializer ran"); }
}

class NeverUsed {
    static { System.out.println("  >> NeverUsed static initializer ran"); }
}
