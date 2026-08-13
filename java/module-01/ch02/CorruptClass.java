/**
 * Writes a copy of a .class file with one byte changed, so the linking phases
 * can be observed rejecting it. Module 01, Chapter 2.
 *
 *   javac --release 17 CorruptClass.java
 *   java CorruptClass Loaders.class BadMagic.class 0 0xDE
 *
 * File I/O proper is Module 13; this is deliberately the smallest thing that
 * works.
 */
import java.nio.file.Files;
import java.nio.file.Path;

public class CorruptClass {

    public static void main(String[] args) throws Exception {
        if (args.length != 4) {
            System.err.println("Usage: java CorruptClass <in.class> <out.class> <offset> <byte>");
            System.exit(1);
        }

        byte[] bytes = Files.readAllBytes(Path.of(args[0]));
        int offset = Integer.decode(args[2]);
        int value = Integer.decode(args[3]);

        System.out.printf("offset %d: 0x%02X -> 0x%02X%n", offset, bytes[offset] & 0xFF, value);
        bytes[offset] = (byte) value;

        Files.write(Path.of(args[1]), bytes);
        System.out.println("wrote " + args[1]);
    }
}
