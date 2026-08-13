/**
 * Loading a class and initializing it are different operations.
 * Module 01, Chapter 2.
 */
public class ForNameVsLoadClass {

    public static void main(String[] args) throws Exception {
        ClassLoader loader = ForNameVsLoadClass.class.getClassLoader();

        System.out.println("1. loader.loadClass(\"Alpha\") - loads, does not initialize");
        Class<?> alpha = loader.loadClass("Alpha");
        System.out.println("   loaded: " + alpha.getName());

        System.out.println("2. Class.forName(\"Beta\") - loads AND initializes");
        Class<?> beta = Class.forName("Beta");
        System.out.println("   loaded: " + beta.getName());

        System.out.println("3. Class.forName(\"Gamma\", false, loader) - initialize = false");
        Class<?> gamma = Class.forName("Gamma", false, loader);
        System.out.println("   loaded: " + gamma.getName());

        System.out.println("4. now touch Alpha for real");
        Alpha.ping();
    }
}

class Alpha { static { System.out.println("   >> Alpha initialized"); } static void ping() { } }
class Beta  { static { System.out.println("   >> Beta initialized"); } }
class Gamma { static { System.out.println("   >> Gamma initialized"); } }
