/**
 * predict-shell.js — renders one predict-the-output question.
 *
 * A SHELL, not content. See data/predict-output.js for the contract and for why
 * that file holds only a placeholder.
 *
 * The answer is hidden until the learner reveals it. That is not decoration:
 * predicting BEFORE running is the step the whole methodology turns on (master
 * brief §14, §19), and an answer visible on the page removes the opportunity to
 * be wrong — which is where the learning is.
 */

import { el } from './dom.js';
import { renderCodeRunner } from './code-runner.js';

/**
 * An editable, runnable snippet (Phase 5 — the Phase 4 placeholder button is gone).
 *
 * Running is deliberately available *before* the answer is revealed. That is
 * the methodology, not a leak: predict, then run, then compare — and if the two
 * disagree, that gap is the thing worth understanding. What stays hidden is the
 * written answer and its explanation, because those remove the prediction.
 *
 * @param {string} code @param {string} language
 */
function codeBlock(code, language = 'java') {
  return renderCodeRunner({ code, language });
}

/**
 * Render one predict-the-output question.
 * @param {object} question conforming to the data/predict-output.js contract
 * @returns {HTMLElement}
 */
export function renderPrediction(question) {
  const answerId = `predict-answer-${question.id}`;

  // Built once and toggled, rather than rebuilt on reveal: a disclosure should
  // keep ONE persistent trigger whose aria-expanded tracks state. Replacing the
  // trigger would leave that state on a detached element.
  const answer = el('div', { class: 'predict__answer', id: answerId, hidden: true }, [
    el('h4', { class: 'exercise__field-label', text: 'Actual output' }),
    el('pre', { class: 'code-block__pre scroll-x' }, [el('code', { text: question.answer })]),
    question.explanation
      ? el('p', { class: 'exercise__field-text', text: question.explanation })
      : null,
  ]);

  const toggle = el('button', {
    class: 'button',
    type: 'button',
    'aria-expanded': 'false',
    'aria-controls': answerId,
    text: 'Reveal the answer',
    on: {
      click: (event) => {
        const button = event.currentTarget;
        const open = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!open));
        button.textContent = open ? 'Reveal the answer' : 'Hide the answer';
        answer.hidden = open;
      },
    },
  });

  return el('article', { class: 'predict' }, [
    question.isPlaceholder
      ? el('p', { class: 'placeholder-tag', text: 'PLACEHOLDER — demonstrates the shell, not curriculum content' })
      : null,
    el('h3', { class: 'exercise__title', text: question.prompt }),
    codeBlock(question.code, question.language),
    el('p', {
      class: 'predict__nudge',
      text: 'Write down your prediction before revealing. Being wrong here is the point.',
    }),
    el('div', { class: 'predict__answer-region' }, [toggle, answer]),
  ]);
}
