/**
 * When a static initializer throws, the class is marked ERRONEOUS — and every
 * later use fails differently from the first.
 * Module 01, Chapter 2.
 */
public class InitFailure {

    public static void main(String[] args) {
        for (int attempt = 1; attempt <= 2; attempt++) {
            System.out.println("attempt " + attempt + ":");
            try {
                Broken.use();
            } catch (Throwable t) {
                System.out.println("  caught " + t.getClass().getName());
                if (t.getCause() != null) {
                    System.out.println("  caused by " + t.getCause().getClass().getName()
                        + ": " + t.getCause().getMessage());
                }
            }
        }
    }
}

class Broken {
    static final int VALUE;

    static {
        System.out.println("  Broken static initializer starting");
        if (true) throw new IllegalStateException("configuration missing");
        VALUE = 1;
    }

    static void use() {
        System.out.println("  Broken.use() called, VALUE = " + VALUE);
    }
}
