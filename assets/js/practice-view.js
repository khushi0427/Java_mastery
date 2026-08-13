/**
 * practice-view.js — the Practice route (#/practice).
 *
 * Composes the exercise and predict-the-output shells. It renders whatever is in
 * data/exercises.js and data/predict-output.js — which today is one placeholder
 * each, present only to prove the components work.
 *
 * When real exercises are authored per module through CONTINUE, they appear here
 * with no change to this file.
 */

import { DIFFICULTIES, EXERCISES, realExerciseCount } from '../../data/exercises.js';
import { PREDICTIONS, realPredictionCount } from '../../data/predict-output.js';
import { el, replaceChildren } from './dom.js';
import { renderExercise } from './exercise-shell.js';
import { renderPrediction } from './predict-shell.js';

/** Honest banner: say plainly that these are shells with no content behind them. */
function statusBanner() {
  const realExercises = realExerciseCount();
  const realPredictions = realPredictionCount();

  return el('p', { class: 'banner' }, [
    el('strong', { text: 'Practice shells, no content yet. ' }),
    `There are ${realExercises} real exercises and ${realPredictions} real `
    + 'predict-the-output questions in the repository. The items below are '
    + 'placeholders that exist to demonstrate the components render and that '
    + 'hints and answers stay hidden until asked for. Real practice is written '
    + 'per module, alongside the chapter it belongs to.',
  ]);
}

function section(title, description, items, renderItem) {
  return el('section', { class: 'practice-section' }, [
    el('h2', { class: 'module-section__title', text: title }),
    el('p', { class: 'module-section__note', text: description }),
    items.length === 0
      ? el('p', { class: 'empty-state', text: 'Nothing here yet.' })
      : el('div', { class: 'practice-list' }, items.map(renderItem)),
  ]);
}

/** Render the Practice view into its container. */
export function renderPractice() {
  const container = document.getElementById('practice-body');
  if (!container) return;

  replaceChildren(container, [
    statusBanner(),

    section(
      'Exercises',
      `Rendered from the exercise contract: title, difficulty, objective, problem, `
      + `requirements, constraints, samples, edge cases, progressive hints, and a `
      + `reference solution. Difficulty ladder: ${DIFFICULTIES.join(' → ')}.`,
      EXERCISES,
      renderExercise,
    ),

    section(
      'Predict the output',
      'A snippet and a prompt. The answer stays hidden until revealed, because '
      + 'predicting before running is the point.',
      PREDICTIONS,
      renderPrediction,
    ),
  ]);
}
