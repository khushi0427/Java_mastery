import java.io.PrintStream;

public class Streams {
    public static void main(String[] args) throws Exception {
        System.out.println("1 out");
        System.err.println("2 err");
        System.out.println("3 out");
        System.err.println("4 err");

        System.out.print("5 no newline -> ");
        System.out.println();

        System.out.printf("6 printf %s %d%n", "formatted", 42);

        // System.out is a public static final field of type PrintStream.
        PrintStream original = System.out;
        System.out.println("7 System.out is a " + original.getClass().getName());

        // It can be replaced.
        java.io.ByteArrayOutputStream captured = new java.io.ByteArrayOutputStream();
        System.setOut(new PrintStream(captured, true));
        System.out.println("8 this went into the buffer");
        System.setOut(original);
        System.out.println("9 captured was: " + captured.toString().trim());

        // PrintStream never throws IOException - it sets a flag instead.
        System.out.println("10 checkError() = " + System.out.checkError());
    }
}
