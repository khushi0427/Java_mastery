/**
 * exercise-shell.js — renders one exercise from the data contract.
 *
 * A SHELL, not content. It knows how to display an exercise and how to gate the
 * hints and solution; it contains no exercises itself. See data/exercises.js for
 * the contract and for why that file is empty.
 *
 * Two rules from the master brief are enforced structurally rather than by
 * convention, because they are the pedagogical point:
 *
 *   §20 — hints reveal ONE AT A TIME. Hint 2's button does not exist until
 *         Hint 1 has been revealed, so "just look at all the hints" is not a
 *         single click away.
 *   §18 — the solution is hidden by default and never visible beside the
 *         problem. One persistent toggle controls it, with aria-expanded
 *         tracking state.
 *
 * Completion routes through the Phase 4 progress API, so solving an exercise
 * counts once real exercises exist.
 */

import { el, replaceChildren } from './dom.js';
import { isExerciseSolved, setExerciseSolved } from './progress.js';

/** A titled block, omitted entirely when it has nothing to show. */
function field(label, value) {
  if (value === null || value === undefined || value === '') return null;

  return el('div', { class: 'exercise__field' }, [
    el('h4', { class: 'exercise__field-label', text: label }),
    Array.isArray(value)
      ? el('ul', { class: 'exercise__list' }, value.map((v) => el('li', { text: v })))
      : el('p', { class: 'exercise__field-text', text: value }),
  ]);
}

/** A labelled code block. Wide code scrolls inside itself, never the page. */
function codeBlock(code, language = 'java') {
  return el('div', { class: 'code-block' }, [
    el('div', { class: 'code-block__bar' }, [
      el('span', { class: 'code-block__lang', text: language }),
      el('button', {
        class: 'code-block__action',
        type: 'button',
        // Phase 5 owns execution. A disabled control is honest; a fake Run
        // button that appears to work would not be.
        disabled: true,
        title: 'Running code arrives in Phase 5',
        text: 'Run — Phase 5',
      }),
    ]),
    el('pre', { class: 'code-block__pre scroll-x' }, [el('code', { text: code })]),
  ]);
}

/**
 * Progressive hints: Hint 1 → Hint 2 → Hint 3 → Solution.
 *
 * Revealed strictly in order. The "next hint" button is re-rendered each time so
 * only the next step is ever offered.
 */
function hintLadder(exercise) {
  const revealed = [];
  const container = el('div', { class: 'hints' });

  const render = () => {
    const children = [
      el('h4', { class: 'exercise__field-label', text: `Hints (${revealed.length} of ${exercise.hints.length} revealed)` }),
    ];

    for (const [i, text] of revealed.entries()) {
      children.push(el('div', { class: 'hint' }, [
        el('span', { class: 'hint__number', text: `Hint ${i + 1}` }),
        el('span', { class: 'hint__text', text }),
      ]));
    }

    if (revealed.length < exercise.hints.length) {
      children.push(el('button', {
        class: 'button button--subtle',
        type: 'button',
        'aria-expanded': 'false',
        text: revealed.length === 0
          ? 'Show a hint'
          : `Show hint ${revealed.length + 1} of ${exercise.hints.length}`,
        on: {
          click: () => {
            revealed.push(exercise.hints[revealed.length]);
            render();
          },
        },
      }));
    } else {
      children.push(el('p', { class: 'hints__exhausted', text: 'All hints revealed.' }));
    }

    replaceChildren(container, children);
  };

  render();
  return container;
}

/**
 * The solution.
 *
 * Hidden by default and toggled by ONE persistent button whose aria-expanded
 * tracks state — replacing the trigger on reveal would strand that state on a
 * detached element.
 */
function solutionBlock(exercise) {
  const bodyId = `solution-${exercise.moduleId}-${exercise.id}`;

  const body = el('div', { class: 'solution__body', id: bodyId, hidden: true }, [
    el('h4', { class: 'exercise__field-label', text: 'Reference solution' }),
    codeBlock(exercise.solution.code, exercise.solution.language),
    field('Explanation', exercise.solution.explanation),
    field('Complexity', exercise.solution.complexity),
  ]);

  const toggle = el('button', {
    class: 'button',
    type: 'button',
    'aria-expanded': 'false',
    'aria-controls': bodyId,
    text: 'Reveal solution',
    on: {
      click: (event) => {
        const button = event.currentTarget;
        const open = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!open));
        button.textContent = open ? 'Reveal solution' : 'Hide solution';
        body.hidden = open;
      },
    },
  });

  return el('div', { class: 'solution' }, [toggle, body]);
}

/**
 * Render one exercise.
 * @param {object} exercise conforming to the data/exercises.js contract
 * @returns {HTMLElement}
 */
export function renderExercise(exercise) {
  const solvedInitially = isExerciseSolved(exercise.moduleId, exercise.id);

  const solvedToggle = el('button', {
    class: 'button button--subtle exercise__solved',
    type: 'button',
    'aria-pressed': String(solvedInitially),
    text: solvedInitially ? 'Solved ✓' : 'Mark as solved',
    on: {
      click: (event) => {
        const button = event.currentTarget;
        const next = button.getAttribute('aria-pressed') !== 'true';
        // Completion goes through the progress API — never straight to storage.
        setExerciseSolved(exercise.moduleId, exercise.id, next);
        button.setAttribute('aria-pressed', String(next));
        button.textContent = next ? 'Solved ✓' : 'Mark as solved';
      },
    },
  });

  return el('article', { class: 'exercise' }, [
    exercise.isPlaceholder
      ? el('p', { class: 'placeholder-tag', text: 'PLACEHOLDER — demonstrates the shell, not curriculum content' })
      : null,

    el('header', { class: 'exercise__header' }, [
      el('h3', { class: 'exercise__title', text: exercise.title }),
      el('span', { class: 'badge badge--difficulty', text: exercise.difficulty }),
    ]),

    field('Objective', exercise.objective),
    field('Problem', exercise.problem),
    field('Requirements', exercise.requirements),
    field('Constraints', exercise.constraints),

    exercise.sampleInput || exercise.sampleOutput
      ? el('div', { class: 'exercise__samples' }, [
        field('Sample input', exercise.sampleInput),
        field('Sample output', exercise.sampleOutput),
      ])
      : null,

    field('Edge cases', exercise.edgeCases),

    exercise.hints?.length ? hintLadder(exercise) : null,
    exercise.solution ? solutionBlock(exercise) : null,

    el('div', { class: 'exercise__footer' }, [solvedToggle]),
  ]);
}
