import static java.lang.Math.max;
import static java.lang.Math.PI;
import static java.util.Arrays.asList;
public class StaticImport {
    public static void main(String[] args) {
        System.out.println(max(3, 7));
        System.out.printf("%.5f%n", PI);
        System.out.println(asList("a", "b"));
    }
}
