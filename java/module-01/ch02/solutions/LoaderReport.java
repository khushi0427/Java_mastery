/** Applied solution - Module 01, Chapter 2. */
public class LoaderReport {

    public static void main(String[] args) throws Exception {
        String[] names = {
            "java.lang.Object",
            "java.util.HashMap",
            "javax.sql.DataSource",
            "LoaderReport",
        };

        for (String name : names) {
            Class<?> type = Class.forName(name, false, LoaderReport.class.getClassLoader());
            ClassLoader loader = type.getClassLoader();
            System.out.printf("%-22s %s%n", name,
                loader == null ? "bootstrap (null)" : simpleName(loader));
        }

        System.out.println();
        System.out.println("delegation chain upwards from this class:");
        int depth = 0;
        for (ClassLoader l = LoaderReport.class.getClassLoader(); l != null; l = l.getParent()) {
            System.out.println("  ".repeat(++depth) + simpleName(l));
        }
        System.out.println("  ".repeat(++depth) + "bootstrap (null)");
    }

    /** The identity hash in a loader's toString changes every run, so drop it. */
    static String simpleName(ClassLoader loader) {
        String name = loader.getClass().getName();
        return name.substring(name.lastIndexOf('.') + 1);
    }
}
