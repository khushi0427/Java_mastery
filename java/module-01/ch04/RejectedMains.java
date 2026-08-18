/**
 * The forms the launcher REJECTS, and the three distinct errors they produce.
 * Module 01, Chapter 4.
 *
 * Each compiles cleanly. All four failures happen at launch, not at compile
 * time - the launcher is the thing with an opinion about main's signature.
 *
 *   javac --release 17 RejectedMains.java
 *   java NoPublic ; java NoStatic ; java NotVoid ; java WrongArg
 */
public class RejectedMains {
    public static void main(String[] args) {
        System.out.println("Run NoPublic, NoStatic, NotVoid or WrongArg instead.");
    }
}

class NoPublic { static  void main(String[] args) { System.out.println("x"); } }
class NoStatic { public  void main(String[] args) { System.out.println("x"); } }
class NotVoid  { public static int  main(String[] args) { return 0; } }
class WrongArg { public static void main(int[] args)    { System.out.println("x"); } }
