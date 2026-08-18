/**
 * The forms of main() the launcher accepts. Module 01, Chapter 4.
 *
 * All four of these are valid entry points. Compile each and run it.
 */
public class MainSignature {
    public static void main(String[] args) { System.out.println("canonical"); }
}

class VarargsMain    { static public void main(String... args) { System.out.println("varargs, and reordered modifiers"); } }
class CStyleMain     { public static void main(String args[]) { System.out.println("C-style array brackets"); } }
class ExtraModifiers { public static final synchronized void main(String[] a) { System.out.println("extra modifiers are fine"); } }
