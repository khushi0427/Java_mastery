/**
 * A minimal class used to demonstrate the verifier - see CorruptClass.java.
 * Module 01, Chapter 2.
 *
 *   javac --release 17 Tiny.java
 *   javap -c -p Tiny.class          # find the `return` opcode offset
 *   java CorruptClass Tiny.class broken/Tiny.class 348 0xAC
 *   java -cp broken Tiny            # VerifyError: Operand stack underflow
 *
 * The offset differs if you change this file. Find it by looking for byte 0xB1
 * (the `return` opcode) in the compiled output.
 */
public class Tiny {
    static void doNothing() { return; }

    public static void main(String[] args) {
        doNothing();
        System.out.println("ok");
    }
}
