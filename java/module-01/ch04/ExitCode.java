public class ExitCode {
    public static void main(String[] args) {
        System.out.println("about to exit");
        if (args.length > 0) System.exit(Integer.parseInt(args[0]));
        System.out.println("normal end");
    }
}
