public class ClassLiteral {
    public static void main(String[] args) {
        System.out.println("step 1: " + Sub.class.getSimpleName());
        System.out.println("step 2:");
        new Sub();
    }
}
class Sup { static { System.out.println("  Sup init"); } }
class Sub extends Sup { static { System.out.println("  Sub init"); } }
