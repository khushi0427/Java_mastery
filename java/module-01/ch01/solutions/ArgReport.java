public class ArgReport {
    public static void main(String[] args) {
        System.out.println("Received " + args.length + " argument(s).");
        for (int i = 0; i < args.length; i++) {
            System.out.println("  [" + i + "] " + args[i]);
        }
    }
}
