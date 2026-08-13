/**
 * java-source.js — the small amount of Java the runner has to understand.
 *
 * Execution providers take a *file name*, not just a blob of source, and the
 * JLS constrains what that name may be: a public top-level type must live in a
 * file named after it (JLS §7.6). Send `Main.java` containing
 * `public class Puzzle` and every provider returns the same compiler error —
 * one the learner did not write and cannot debug, because the file name is
 * ours, not theirs.
 *
 * So the file name is derived from the source. This module does that, plus the
 * two related questions the local-fallback panel needs answered: which class
 * gets run, and whether a `package` declaration changes the commands.
 *
 * This is deliberately a lexical scan, not a parser. It is accurate for the
 * shapes teaching examples actually take and degrades to the conventional
 * `Main.java` when it is unsure, which is the safe direction to be wrong in.
 */

/**
 * Blank out comments and string/char literals, preserving length and newlines.
 *
 * Without this, `// public class Ghost` or `"public class Ghost"` in a string
 * would win the search — the exact false positive a naive regex makes, and one
 * that would produce a wrong file name from correct code.
 *
 * @param {string} source
 * @returns {string} same length as `source`, with those regions replaced by spaces
 */
export function stripCommentsAndLiterals(source) {
  const out = source.split('');
  const n = source.length;
  let i = 0;

  // Replace source[i] with a space unless it is a newline, so that line/column
  // relationships in the blanked copy still match the original.
  const blank = (at) => {
    if (out[at] !== '\n') out[at] = ' ';
  };

  while (i < n) {
    const c = source[i];
    const next = source[i + 1];

    if (c === '/' && next === '/') {
      while (i < n && source[i] !== '\n') blank(i++);
      continue;
    }

    if (c === '/' && next === '*') {
      blank(i++);
      blank(i++);
      while (i < n && !(source[i] === '*' && source[i + 1] === '/')) blank(i++);
      if (i < n) { blank(i++); blank(i++); }
      continue;
    }

    // Text blocks (""" ... """), standard since Java 15. Checked before the
    // ordinary string case, which would otherwise close on the second quote.
    if (c === '"' && next === '"' && source[i + 2] === '"') {
      blank(i++); blank(i++); blank(i++);
      while (i < n && !(source[i] === '"' && source[i + 1] === '"' && source[i + 2] === '"')) {
        if (source[i] === '\\') blank(i++);
        if (i < n) blank(i++);
      }
      if (i < n) { blank(i++); blank(i++); blank(i++); }
      continue;
    }

    if (c === '"' || c === "'") {
      const quote = c;
      blank(i++);
      while (i < n && source[i] !== quote) {
        if (source[i] === '\\') blank(i++); // skip the escaped char with it
        if (i < n) blank(i++);
      }
      if (i < n) blank(i++);
      continue;
    }

    i += 1;
  }

  return out.join('');
}

/** Modifiers that may sit between `public` and the type keyword. */
const TYPE_KEYWORDS = 'class|interface|enum|record|@interface';
const INTERLEAVED = '(?:final\\s+|abstract\\s+|static\\s+|strictfp\\s+|sealed\\s+|non-sealed\\s+)*';

/**
 * The name of the public top-level type, if the source declares one.
 *
 * Returns null when there is none — which is legal Java, and means any file
 * name compiles.
 *
 * @param {string} source
 * @returns {string|null}
 */
export function findPublicTypeName(source) {
  const scrubbed = stripCommentsAndLiterals(source);
  const pattern = new RegExp(
    `(?:^|[;{}\\s])public\\s+${INTERLEAVED}(?:${TYPE_KEYWORDS})\\s+([A-Za-z_$][A-Za-z0-9_$]*)`,
  );
  const match = scrubbed.match(pattern);
  return match ? match[1] : null;
}

/**
 * The class the learner most likely wants run: the one declaring `main`.
 *
 * Falls back to the public type, then to `Main`. Used for the `java <Class>`
 * command in the local-fallback panel, where naming the wrong class sends the
 * learner chasing a "main method not found" error that is our fault.
 *
 * @param {string} source
 * @returns {string}
 */
export function findMainClassName(source) {
  const scrubbed = stripCommentsAndLiterals(source);

  // Walk type declarations and pick the one whose body contains a main method.
  // `String[] args` and `String... args` are both spellings of the same thing.
  const decl = new RegExp(
    `(?:^|[;{}\\s])(?:public\\s+|private\\s+|protected\\s+)?${INTERLEAVED}`
    + `(?:${TYPE_KEYWORDS})\\s+([A-Za-z_$][A-Za-z0-9_$]*)`,
    'g',
  );
  const mainSig = /\bstatic\s+void\s+main\s*\(\s*(?:final\s+)?String\s*(?:\[\s*\]|\.\.\.)\s*[A-Za-z_$]/;

  const declarations = [...scrubbed.matchAll(decl)];
  for (const [index, match] of declarations.entries()) {
    const start = match.index;
    const end = index + 1 < declarations.length ? declarations[index + 1].index : scrubbed.length;
    if (mainSig.test(scrubbed.slice(start, end))) return match[1];
  }

  return findPublicTypeName(source) ?? 'Main';
}

/**
 * The `package` declaration, if any.
 *
 * A packaged example cannot be compiled with a bare `javac Main.java` in the
 * current directory and then run as `java Main` — the runtime needs the fully
 * qualified name. The fallback panel says so rather than handing over commands
 * that fail.
 *
 * @param {string} source
 * @returns {string|null}
 */
export function findPackageName(source) {
  const match = stripCommentsAndLiterals(source).match(
    /(?:^|\n)\s*package\s+([A-Za-z_$][A-Za-z0-9_$]*(?:\s*\.\s*[A-Za-z_$][A-Za-z0-9_$]*)*)\s*;/,
  );
  return match ? match[1].replace(/\s+/g, '') : null;
}

/**
 * The file name this source must be saved as.
 *
 * @param {string} source
 * @returns {string} e.g. "Main.java"
 */
export function deriveFileName(source) {
  return `${findPublicTypeName(source) ?? findMainClassName(source)}.java`;
}

/**
 * Everything the local-fallback panel needs, in one call.
 *
 * @param {string} source
 * @returns {{fileName: string, className: string, packageName: string|null, runTarget: string}}
 */
export function describeSource(source) {
  const className = findMainClassName(source);
  const packageName = findPackageName(source);

  return {
    fileName: deriveFileName(source),
    className,
    packageName,
    // `java` takes the binary name, which includes the package.
    runTarget: packageName ? `${packageName}.${className}` : className,
  };
}
