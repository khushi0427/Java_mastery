/**
 * predict-output.js — predict-the-output questions, keyed to modules.
 *
 * ============================= EMPTY BY DESIGN =============================
 * No real questions exist. Master brief §19 calls for roughly 5–8 of these in
 * behaviour-heavy chapters (OOP, strings, wrappers, `==` vs `.equals()`,
 * inheritance, static, exceptions, collections, HashMap, streams, lambdas,
 * threading, JVM behaviour) — but they are authored per module through the
 * CONTINUE workflow, alongside the chapter they belong to.
 *
 * The single entry below is a PLACEHOLDER demonstrating that the shell renders
 * and that the answer stays hidden until revealed. It is flagged
 * `isPlaceholder: true` and labelled as a demo in the UI.
 * ===========================================================================
 *
 * DATA CONTRACT (documented in docs/ARCHITECTURE.md §6)
 *
 *   id            string   unique within its module
 *   moduleId      string   PERMANENT module id from data/modules.js
 *   prompt        string   what to predict, e.g. "What does this print?"
 *   language      string   for the code label; 'java' throughout the curriculum
 *   code          string   the snippet the learner reasons about
 *   answer        string   the actual output — HIDDEN until revealed (§19)
 *   explanation   string   why, revealed with the answer
 *   isPlaceholder boolean  true only for demo scaffolding
 *
 * The answer must never render before the learner asks for it: predicting first
 * is the entire pedagogical point (master brief §14).
 */

/** @type {Array<object>} */
export const PREDICTIONS = [
  {
    id: 'demo-placeholder-predict',
    moduleId: '01-java-foundations-execution-model',
    prompt: 'Demo placeholder — what would this print?',
    language: 'java',
    code: [
      '// Placeholder snippet. Not curriculum content.',
      '// Real predict-the-output questions are authored per module.',
      'public class Demo {',
      '    public static void main(String[] args) {',
      '        System.out.println("placeholder");',
      '    }',
      '}',
    ].join('\n'),
    answer: 'placeholder',
    explanation:
      'Placeholder explanation. It stays hidden until the learner reveals it, '
      + 'which is the behaviour this demo exists to demonstrate.',
    isPlaceholder: true,
  },
];

/** Questions for one module. @param {string} moduleId */
export function predictionsForModule(moduleId) {
  return PREDICTIONS.filter((p) => p.moduleId === moduleId);
}

/** How many REAL questions exist — placeholders excluded. */
export function realPredictionCount() {
  return PREDICTIONS.filter((p) => !p.isPlaceholder).length;
}

export default PREDICTIONS;
