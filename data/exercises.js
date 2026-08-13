/**
 * exercises.js — practice exercises, keyed to modules.
 *
 * ============================= EMPTY BY DESIGN =============================
 * This file contains NO real curriculum content. Phase 4 built the practice
 * shells; exercises are authored per-module through the `CONTINUE` workflow
 * (master brief §36, §41). Adding exercises here ahead of that would be fake
 * content, which the project forbids.
 *
 * The single entry below is a PLACEHOLDER whose only job is to demonstrate that
 * the shell renders and that reveal/hide works. It is flagged
 * `isPlaceholder: true`, and the UI labels it as a demo so it can never be
 * mistaken for curriculum.
 * ===========================================================================
 *
 * DATA CONTRACT (documented in docs/ARCHITECTURE.md §6)
 *
 *   id            string   unique within its module
 *   moduleId      string   PERMANENT module id from data/modules.js
 *   title         string
 *   difficulty    string   one of DIFFICULTIES below, in ladder order (§18)
 *   objective     string   what the learner should get out of it
 *   problem       string   the statement
 *   requirements  string[] what a correct solution must do
 *   constraints   string[] optional; limits on input/approach
 *   sampleInput   string   optional
 *   sampleOutput  string   optional
 *   edgeCases     string[] optional
 *   testCases     [{ input, expected }]  optional
 *   starterCode   string   optional; PHASE 5 — see below
 *   stdin         string   optional; PHASE 5 — see below
 *   hints         string[] ordered, revealed ONE AT A TIME (§20)
 *   solution      { language, code, explanation, complexity }  hidden by default
 *   isPlaceholder boolean  true only for demo scaffolding
 *
 * `solution` and every hint are hidden until the learner asks for them — the
 * master brief is explicit that solutions must not sit next to the problem.
 *
 * ---------------------------------------------------------------------------
 * PHASE 5 EXTENSION — starterCode and stdin
 * ---------------------------------------------------------------------------
 * Phase 5 added the two optional fields above. Both are additive: every
 * exercise written against the Phase 4 contract stays valid, and an exercise
 * with no `starterCode` simply renders no editor.
 *
 *   starterCode  The skeleton the learner edits — imports, a class, a `main`,
 *                and a marked gap. It is what the editor opens with and what
 *                its Reset restores. Reset must NEVER restore the reference
 *                solution: that would turn one keystroke into the answer and
 *                undo the hint ladder.
 *
 *                Name the public class something meaningful. The runner reads
 *                the source to work out the file name and the `java` target
 *                (assets/js/execution/java-source.js), so `public class
 *                WordCount` yields `javac WordCount.java` — commands that
 *                actually work when pasted.
 *
 *   stdin        Standard input to prefill, for exercises that read input.
 *                Its presence is also what makes the runner show the stdin
 *                field at all.
 *
 * Neither field enables or requires online execution. With no provider
 * configured — the default — the editor still opens, still holds edits, and
 * still shows the exact local `javac` / `java` commands.
 */

/** The difficulty ladder from master brief §18, in order. */
export const DIFFICULTIES = ['Warm-up', 'Easy', 'Applied', 'Medium', 'Challenge', 'Interview'];

/** @type {Array<object>} */
export const EXERCISES = [
  {
    id: 'demo-placeholder-exercise',
    moduleId: '01-java-foundations-execution-model',
    title: 'Demo: shell rendering check',
    difficulty: 'Warm-up',
    objective:
      'Demonstrate that the exercise shell renders every field and that hints '
      + 'and the solution stay hidden until asked for. This is scaffolding, not curriculum.',
    problem:
      'This is placeholder text standing in for a problem statement. Real exercises '
      + 'are written per module through the CONTINUE workflow; none exist yet.',
    requirements: [
      'Placeholder requirement — replaced when real exercises are authored.',
      'The shell should render this list without any exercise content existing.',
    ],
    constraints: ['Placeholder constraint.'],
    sampleInput: '(placeholder)',
    sampleOutput: '(placeholder)',
    edgeCases: ['Placeholder edge case.'],
    testCases: [],
    // Placeholder starter code. Real, compilable Java rather than prose, so the
    // Phase 5 editor and the derived local commands can be exercised — the
    // public class is deliberately NOT called Main, which is what proves the
    // file name is derived from the source instead of assumed.
    starterCode:
      'public class ShellCheck {\n'
      + '    public static void main(String[] args) {\n'
      + '        // Placeholder starter code — this is scaffolding, not an exercise.\n'
      + '        System.out.println("The editor works. Run this locally with the commands below.");\n'
      + '    }\n'
      + '}\n',
    hints: [
      'Hint 1 — a small nudge. Placeholder text.',
      'Hint 2 — the approach. Placeholder text.',
      'Hint 3 — strong guidance. Placeholder text.',
    ],
    solution: {
      language: 'java',
      // Compilable placeholder: the reference solution is rendered in a runner
      // too, so it has to be something that would actually run.
      code:
        '// Placeholder. No reference solution exists, because no exercise exists.\n'
        + 'public class ShellCheck {\n'
        + '    public static void main(String[] args) {\n'
        + '        System.out.println("The editor works. Run this locally with the commands below.");\n'
        + '    }\n'
        + '}\n',
      explanation: 'Placeholder explanation, shown only after the learner reveals it.',
      complexity: 'Not applicable to a placeholder.',
    },
    isPlaceholder: true,
  },
];

/** Exercises for one module, in ladder order. @param {string} moduleId */
export function exercisesForModule(moduleId) {
  return EXERCISES
    .filter((e) => e.moduleId === moduleId)
    .sort((a, b) => DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty));
}

/** How many REAL exercises exist — placeholders excluded, so counts stay honest. */
export function realExerciseCount() {
  return EXERCISES.filter((e) => !e.isPlaceholder).length;
}

export default EXERCISES;
