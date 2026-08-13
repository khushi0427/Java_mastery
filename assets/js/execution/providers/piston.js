/**
 * piston.js — adapter for a Piston instance.
 *
 * Piston: https://github.com/engineer-man/piston
 *
 * ===========================================================================
 * TARGETS A SELF-HOSTED INSTANCE. NOT THE PUBLIC emkc.org API.
 * ===========================================================================
 * Piston's own readme, read 2026-08-13, states:
 *
 *   "The Piston API is no longer freely available to the public (as of Feb 15,
 *    2026). To obtain authorization, please reach out to EngineerMan on
 *    Discord after reading below and determining that you may qualify."
 *
 * So the public endpoint is not something this project may point learners at
 * by default. Self-hosting is the supported path here: it needs no key, so
 * there is no secret to leak, and CORS and limits are the operator's to set.
 *
 * ===========================================================================
 * WIRE FORMAT — verified against the readme on 2026-08-13, not from memory
 * ===========================================================================
 *   POST {baseUrl}/execute
 *   request:  language, version, files[] are required; stdin, args,
 *             compile_timeout, run_timeout, compile_memory_limit,
 *             run_memory_limit are optional
 *   response: `run`, and `compile` when the language has a compile step; each
 *             carries stdout, stderr, code, signal, message, status,
 *             cpu_time, wall_time, memory
 *
 * NOT VERIFIED BY EXECUTION: no request has been made to a live Piston
 * instance from this repository — the development sandbox blocks outbound
 * connections to it. The shapes below follow the documentation above; treat
 * the first real run against your instance as the actual test.
 */

import { STATUS, baseResult, postJson } from '../result.js';
import { deriveFileName } from '../java-source.js';

/**
 * Piston reports both compiler and runtime output; concatenating them would
 * bury a compiler error under a runtime one. Kept separate all the way to the UI.
 */
export const pistonAdapter = {
  id: 'piston',
  label: 'Piston (self-hosted)',

  /**
   * @param {{source: string, stdin: string, signal: AbortSignal, config: object}} args
   * @returns {Promise<object>}
   */
  async execute({ source, stdin, signal, config }) {
    const { baseUrl, version } = config.piston;

    const posted = await postJson(
      `${baseUrl.replace(/\/+$/, '')}/execute`,
      {
        language: 'java',
        version,
        // The file name must match the public class or javac rejects it before
        // the learner's code is even considered. See ../java-source.js.
        files: [{ name: deriveFileName(source), content: source }],
        stdin,
      },
      signal,
    );

    if (!posted.ok) return posted.result;

    const body = posted.body;
    const compile = body?.compile ?? null;
    const run = body?.run ?? null;

    // A compile stage that exited non-zero means nothing ran. Report the
    // diagnostics and stop — there is no runtime outcome to describe.
    if (compile && compile.code !== 0) {
      return baseResult({
        status: STATUS.COMPILE_ERROR,
        compileError: (compile.stderr || compile.output || compile.stdout || '').trim()
          || 'Compilation failed, but the provider returned no diagnostics.',
        exitCode: compile.code ?? null,
        message: 'Compilation failed.',
        raw: body,
      });
    }

    if (!run) {
      return baseResult({
        status: STATUS.ERROR,
        message: 'Piston returned no `run` stage in its response.',
        raw: body,
      });
    }

    const stdout = run.stdout ?? '';
    const stderr = run.stderr ?? '';

    // Piston kills a process that exceeds its limits. A signal rather than an
    // exit code is the visible symptom. SIGKILL follows from either the run
    // timeout or the memory limit, and the response does not say which, so
    // neither does this message.
    if (run.signal) {
      const killed = run.signal === 'SIGKILL';
      return baseResult({
        status: killed ? STATUS.TIMEOUT : STATUS.RUNTIME_ERROR,
        timedOut: killed,
        stdout,
        stderr,
        exitCode: run.code ?? null,
        message: killed
          ? 'The program was killed by the runner — it exceeded either the time '
            + 'limit or the memory limit configured on that instance.'
          : `The program was terminated by ${run.signal}.`,
        raw: body,
      });
    }

    const exitCode = run.code ?? 0;
    return baseResult({
      status: exitCode === 0 ? STATUS.SUCCESS : STATUS.RUNTIME_ERROR,
      stdout,
      stderr,
      exitCode,
      message: exitCode === 0 ? 'Ran successfully.' : `Exited with code ${exitCode}.`,
      raw: body,
    });
  },
};

export default pistonAdapter;
