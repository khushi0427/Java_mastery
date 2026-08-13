/**
 * Uses Greeter, which lives in a different directory — so this program only
 * runs when the classpath includes that directory. Module 01, Chapter 1.
 */
public class UseGreeter {
    public static void main(String[] args) {
        String who = args.length > 0 ? args[0] : "world";
        System.out.println(Greeter.greet(who));
    }
}
