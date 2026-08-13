/**
 * The other half of the stale-constant demonstration - Module 01, Chapter 2.
 *
 *   javac --release 17 Config.java UsesConfig.java && java UsesConfig
 *       -> timeout = 30
 *
 *   # change TIMEOUT to 60 in Config.java, then recompile ONLY Config:
 *   javac --release 17 Config.java && java UsesConfig
 *       -> timeout = 30      <- STALE. The value was inlined here at compile time.
 *
 *   javac --release 17 UsesConfig.java && java UsesConfig
 *       -> timeout = 60
 */
public class UsesConfig {
    public static void main(String[] args) {
        System.out.println("timeout = " + Config.TIMEOUT);
    }
}
