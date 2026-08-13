/**
 * The class loader hierarchy, and parent delegation.
 * Module 01, Chapter 2.
 */
public class Loaders {

    public static void main(String[] args) {
        show("java.lang.String", String.class);
        show("java.util.ArrayList", java.util.ArrayList.class);
        show("javax.sql.DataSource", javax.sql.DataSource.class);
        show("Loaders (this class)", Loaders.class);

        System.out.println();
        System.out.println("Delegation chain from the application loader upwards:");
        ClassLoader loader = Loaders.class.getClassLoader();
        while (loader != null) {
            System.out.println("  " + loader);
            loader = loader.getParent();
        }
        System.out.println("  null  <- the bootstrap loader, not a Java object");
    }

    static void show(String label, Class<?> type) {
        ClassLoader loader = type.getClassLoader();
        System.out.printf("%-22s -> %s%n", label, loader == null ? "null (bootstrap)" : loader);
    }
}
