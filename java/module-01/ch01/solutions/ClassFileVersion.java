import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Reads a .class file header and reports its magic number and version.
 * Challenge solution — Module 01, Chapter 1.
 */
public class ClassFileVersion {

    public static void main(String[] args) throws IOException {
        if (args.length != 1) {
            System.err.println("Usage: java ClassFileVersion <path-to-.class>");
            System.exit(1);
        }

        Path path = Path.of(args[0]);
        try (InputStream raw = Files.newInputStream(path);
             DataInputStream in = new DataInputStream(raw)) {

            int magic = in.readInt();
            if (magic != 0xCAFEBABE) {
                System.out.printf("Not a class file: magic was 0x%08X%n", magic);
                return;
            }

            int minor = in.readUnsignedShort();
            int major = in.readUnsignedShort();

            System.out.printf("magic:  0x%08X%n", magic);
            System.out.printf("minor:  %d%n", minor);
            System.out.printf("major:  %d (Java %d)%n", major, major - 44);
        }
    }
}
