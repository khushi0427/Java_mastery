/**
 * code-runner.js — the editable code block: editor, Run, output, local fallback.
 *
 * Replaces the disabled "Run — Phase 5" placeholder the Phase 4 shells carried.
 *
 * It talks to ./execution/service.js and nothing else. It does not know which
 * provider exists, whether one exists, or how any of them answer — it switches
 * on the STATUS of the returned result. That is what keeps chapter content
 * uncoupled from execution (docs/ARCHITECTURE.md §11).
 *
 * ===========================================================================
 * THE LOCAL FALLBACK IS NOT AN ERROR STATE
 * ===========================================================================
 * The `javac` / `java` commands are rendered for every snippet, always, whether
 * or not a provider is configured and whether or not a run succeeded. Running
 * code on your own machine is the *primary* path this curriculum teaches
 * (master brief §17); online execution is a convenience layered on top. Showing
 * the commands only when something breaks would invert that, and would teach
 * the learner that the local toolchain is a consolation prize.
 *
 * The commands are derived from the source actually in the editor — the real
 * file name, the real class, the real package — so they work when pasted,
 * rather than being a generic `javac Main.java` that fails on any example whose
 * public class is not called `Main`.
 */

import { el, replaceChildren } from './dom.js';
import { executeJava, executionStatus } from './execution/service.js';
import { STATUS } from './execution/result.js';
import { describeSource } from './execution/java-source.js';

let runnerSequence = 0;

/**
 * Copy text to the clipboard, reporting truthfully whether it worked.
 *
 * The async Clipboard API needs a secure context. A site served over plain
 * http from anything other than localhost does not have one, and that is a
 * perfectly normal way to run this project — so there is a fallback, and if
 * both fail the button says so instead of silently doing nothing.
 *
 * @returns {Promise<boolean>}
 */
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through to the legacy path */ }

  // document.execCommand is deprecated, but in a non-secure context it is the
  // only thing available. Guarded and best-effort.
  try {
    const scratch = document.createElement('textarea');
    scratch.value = text;
    scratch.setAttribute('readonly', '');
    scratch.style.position = 'fixed';
    scratch.style.opacity = '0';
    document.body.append(scratch);
    scratch.select();
    const done = document.execCommand('copy');
    scratch.remove();
    return done;
  } catch {
    return false;
  }
}

/** Flash a transient label on a button, then restore it. */
function flash(button, text) {
  const original = button.dataset.label ?? button.textContent;
  button.dataset.label = original;
  button.textContent = text;
  window.setTimeout(() => { button.textContent = button.dataset.label ?? original; }, 1600);
}

/** A labelled stream of output. Omitted entirely when the stream is empty. */
function streamBlock(label, text, modifier) {
  if (!text || text.trim() === '') return null;
  return el('div', { class: `output__stream output__stream--${modifier}` }, [
    el('h5', { class: 'output__stream-label', text: label }),
    el('pre', { class: 'output__pre scroll-x' }, [el('code', { text })]),
  ]);
}

/**
 * The `javac` / `java` commands for this exact source.
 *
 * A packaged example needs a directory that matches its package and a fully
 * qualified name on the `java` command line; an unpackaged one does not. Both
 * are handled, because handing over commands that fail is worse than handing
 * over none.
 */
function localCommands(source) {
  const { fileName, runTarget, packageName } = describeSource(source);

  if (packageName) {
    const dir = packageName.replace(/\./g, '/');
    return [
      `mkdir -p ${dir}`,
      `# save the editor's contents as ${dir}/${fileName}`,
      `javac ${dir}/${fileName}`,
      `java ${runTarget}`,
    ].join('\n');
  }

  return [
    `# save the editor's contents as ${fileName}`,
    `javac ${fileName}`,
    `java ${runTarget}`,
  ].join('\n');
}

/**
 * The local-fallback panel: exact commands, a copy button, and a download.
 *
 * Rebuilt whenever the editor changes, so renaming the public class updates the
 * commands rather than leaving stale ones that no longer compile.
 */
function localFallbackPanel(getSource) {
  const body = el('div', { class: 'local-run__body' });

  const render = () => {
    const source = getSource();
    const { fileName, packageName } = describeSource(source);
    const commands = localCommands(source);

    const copyButton = el('button', {
      class: 'button button--subtle',
      type: 'button',
      text: 'Copy commands',
      on: {
        click: async (event) => {
          const done = await copyText(commands);
          flash(event.currentTarget, done ? 'Copied' : 'Copy failed — select manually');
        },
      },
    });

    const downloadButton = el('button', {
      class: 'button button--subtle',
      type: 'button',
      text: `Download ${fileName}`,
      on: {
        click: () => {
          const url = URL.createObjectURL(new Blob([source], { type: 'text/x-java-source' }));
          const link = el('a', { href: url, download: fileName });
          document.body.append(link);
          link.click();
          link.remove();
          // Revoke on the next turn: revoking synchronously can cancel the
          // download the click just started.
          window.setTimeout(() => URL.revokeObjectURL(url), 0);
        },
      },
    });

    replaceChildren(body, [
      el('p', { class: 'local-run__lede' }, [
        'This needs nothing but a JDK — no provider, no network. ',
        el('strong', { text: 'This is the primary way to run everything in this curriculum.' }),
      ]),
      el('pre', { class: 'output__pre scroll-x' }, [el('code', { text: commands })]),
      // Both notes describe the javac path shown above, then the shortcut.
      // The distinction is real and easy to get wrong: `javac` enforces the
      // file-name rule, the single-file source launcher does not.
      packageName
        ? el('p', {
          class: 'local-run__note',
          text: `This example declares "package ${packageName}", so for the javac route the `
            + 'file has to sit in a matching directory and is run by its fully qualified '
            + `name. Alternatively, "java ${fileName}" runs it straight from source with no `
            + 'directories and no compile step — the shortcut works on packaged files too.',
        })
        : el('p', {
          class: 'local-run__note',
          text: `For the javac route the file must be named ${fileName}: javac requires a public `
            + `class and its file to agree. Alternatively, "java ${fileName}" runs it straight `
            + 'from source with no compile step (Java 11 and later) — and that route does not '
            + 'enforce the name, so it works whatever you call the file.',
        }),
      el('div', { class: 'local-run__actions' }, [copyButton, downloadButton]),
    ]);
  };

  render();

  const details = el('details', { class: 'local-run' }, [
    el('summary', { class: 'local-run__summary', text: 'Run this on your own machine' }),
    body,
  ]);

  return { element: details, refresh: render };
}

/**
 * A read-only code block with a copy button. Used for anything that is not
 * Java, where "Run" and the local `javac` commands would both be wrong.
 */
function staticCodeBlock(code, language) {
  return el('div', { class: 'code-block' }, [
    el('div', { class: 'code-block__bar' }, [
      el('span', { class: 'code-block__lang', text: language }),
      el('span', { class: 'runner__spacer' }),
      el('button', {
        class: 'button button--subtle code-block__action',
        type: 'button',
        text: 'Copy',
        on: {
          click: async (event) => {
            const done = await copyText(code);
            flash(event.currentTarget, done ? 'Copied' : 'Copy failed');
          },
        },
      }),
    ]),
    el('pre', { class: 'code-block__pre scroll-x' }, [el('code', { text: code })]),
  ]);
}

/**
 * Build an editable, runnable code block.
 *
 * @param {object} options
 * @param {string} options.code           the source to show (also the reset target
 *                                        unless `starterCode` is given)
 * @param {string} [options.language]     label only; execution is Java-only
 * @param {string} [options.starterCode]  what "Reset" restores, when it differs
 * @param {string} [options.stdin]        prefilled standard input
 * @param {boolean} [options.allowStdin]  show the stdin field
 * @returns {HTMLElement}
 */
export function renderCodeRunner({
  code,
  language = 'java',
  starterCode,
  stdin = '',
  allowStdin = false,
  runnable,
} = {}) {
  // Execution is Java-only. A shell transcript or a snippet in another language
  // gets a plain, copyable block instead of a Run button that would compile it
  // as Java and report a baffling error, and instead of local javac commands
  // that make no sense for it.
  const canRun = runnable ?? (language === 'java');
  if (!canRun) return staticCodeBlock(code, language);

  const uid = `runner-${++runnerSequence}`;
  const initial = typeof starterCode === 'string' ? starterCode : code;
  const source = typeof code === 'string' ? code : '';

  const editor = el('textarea', {
    class: 'runner__editor scroll-x',
    id: `${uid}-editor`,
    spellcheck: 'false',
    autocapitalize: 'off',
    autocomplete: 'off',
    autocorrect: 'off',
    'aria-label': `Editable ${language} source`,
    rows: String(Math.min(Math.max(source.split('\n').length + 1, 6), 28)),
  });
  editor.value = source;

  // Tab indents rather than moving focus — expected in a code editor, but it
  // would trap keyboard users, so Escape releases the next Tab to navigation.
  // Announced in the hint under the editor, since an invisible escape hatch is
  // no escape hatch.
  let escapeArmed = false;
  editor.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { escapeArmed = true; return; }

    if (event.key === 'Tab' && !escapeArmed) {
      event.preventDefault();
      const { selectionStart, selectionEnd, value } = editor;
      editor.value = `${value.slice(0, selectionStart)}    ${value.slice(selectionEnd)}`;
      editor.selectionStart = selectionEnd + 4 - (selectionEnd - selectionStart);
      editor.selectionEnd = editor.selectionStart;
      return;
    }

    escapeArmed = false;
  });

  const stdinField = el('textarea', {
    class: 'runner__stdin',
    id: `${uid}-stdin`,
    rows: '3',
    spellcheck: 'false',
    'aria-label': 'Standard input for the program',
  });
  stdinField.value = stdin;

  const output = el('div', {
    class: 'output',
    id: `${uid}-output`,
    // Results arrive after an async round trip, so a screen reader needs to be
    // told. `polite` rather than `assertive`: it should not interrupt.
    role: 'status',
    'aria-live': 'polite',
  });

  const { ready, reason, provider } = executionStatus();

  const showIdle = () => {
    replaceChildren(output, [
      el('p', { class: 'output__idle', text: ready
        ? `Ready. Code runs through the configured provider (${provider}).`
        : 'No execution provider is configured, so Run will explain that rather '
          + 'than running. The local commands below work regardless.' }),
    ]);
  };

  /** Render one ExecutionResult. Every STATUS is handled explicitly. */
  const showResult = (result) => {
    const children = [];

    const headline = {
      [STATUS.SUCCESS]: { text: 'Ran successfully', tone: 'ok' },
      [STATUS.COMPILE_ERROR]: { text: 'Compilation failed', tone: 'bad' },
      [STATUS.RUNTIME_ERROR]: { text: 'Runtime error', tone: 'bad' },
      [STATUS.TIMEOUT]: { text: 'Timed out', tone: 'warn' },
      [STATUS.PROVIDER_UNAVAILABLE]: { text: 'Not run — no provider', tone: 'info' },
      [STATUS.INVALID_INPUT]: { text: 'Not run', tone: 'info' },
      [STATUS.ERROR]: { text: 'Execution problem', tone: 'warn' },
    }[result.status] ?? { text: 'Unknown result', tone: 'warn' };

    children.push(el('div', { class: `output__headline output__headline--${headline.tone}` }, [
      el('span', { class: 'output__status', text: headline.text }),
      result.exitCode !== null
        ? el('span', { class: 'output__meta', text: `exit ${result.exitCode}` })
        : null,
      result.durationMs
        ? el('span', { class: 'output__meta', text: `${result.durationMs} ms` })
        : null,
    ]));

    // The provider being absent or broken is never the learner's fault, and the
    // panel says so in as many words rather than leaving them to wonder.
    if (result.providerUnavailable) {
      children.push(el('p', { class: 'output__explain', text: result.message }));
      children.push(el('p', {
        class: 'output__explain output__explain--strong',
        text: 'Your code was not run, and nothing about this reflects on your code. '
          + 'Use the local commands below — they are the primary path anyway.',
      }));
    } else if (result.message) {
      children.push(el('p', { class: 'output__explain', text: result.message }));
    }

    // Compiler diagnostics are kept apart from program output. Merging them
    // would hide a compiler error inside a runtime one.
    children.push(streamBlock('Compiler errors', result.compileError, 'compile'));
    children.push(streamBlock('Output (stdout)', result.stdout, 'stdout'));
    children.push(streamBlock('Errors (stderr)', result.stderr, 'stderr'));

    if (result.status === STATUS.SUCCESS && !result.stdout.trim()) {
      children.push(el('p', {
        class: 'output__explain',
        text: 'The program ran and exited 0 without printing anything.',
      }));
    }

    replaceChildren(output, children.filter(Boolean));
  };

  const runButton = el('button', {
    class: 'button button--primary code-block__action',
    type: 'button',
    'aria-controls': `${uid}-output`,
    text: 'Run',
    title: ready
      ? 'Run this code through the configured execution provider'
      : 'No execution provider is configured — this will explain what to do',
  });

  runButton.addEventListener('click', async () => {
    runButton.disabled = true;
    runButton.textContent = 'Running…';
    replaceChildren(output, [el('p', { class: 'output__idle', text: 'Running…' })]);

    try {
      showResult(await executeJava({
        source: editor.value,
        stdin: allowStdin ? stdinField.value : '',
      }));
    } finally {
      runButton.disabled = false;
      runButton.textContent = 'Run';
    }
  });

  const resetButton = el('button', {
    class: 'button button--subtle code-block__action',
    type: 'button',
    text: 'Reset',
    title: 'Restore the original code, discarding your edits',
    on: {
      click: () => {
        editor.value = initial;
        fallback.refresh();
        showIdle();
        editor.focus();
      },
    },
  });

  const copyButton = el('button', {
    class: 'button button--subtle code-block__action',
    type: 'button',
    text: 'Copy',
    title: 'Copy the code as it currently stands',
    on: {
      click: async (event) => {
        const done = await copyText(editor.value);
        flash(event.currentTarget, done ? 'Copied' : 'Copy failed');
      },
    },
  });

  const fallback = localFallbackPanel(() => editor.value);

  // Keep the local commands in step with the editor: edit the class name and
  // the commands must follow, or they stop compiling.
  editor.addEventListener('input', () => fallback.refresh());

  showIdle();

  return el('div', { class: 'code-block runner' }, [
    el('div', { class: 'code-block__bar' }, [
      el('span', { class: 'code-block__lang', text: language }),
      el('span', { class: 'runner__spacer' }),
      copyButton,
      resetButton,
      runButton,
    ]),

    editor,
    el('p', {
      class: 'runner__hint',
      text: 'Editable. Tab indents; press Escape then Tab to move on to the next control.',
    }),

    allowStdin
      ? el('div', { class: 'runner__stdin-region' }, [
        el('label', { class: 'runner__stdin-label', for: `${uid}-stdin`, text: 'Standard input' }),
        stdinField,
      ])
      : null,

    output,
    fallback.element,
  ]);
}

export default renderCodeRunner;
