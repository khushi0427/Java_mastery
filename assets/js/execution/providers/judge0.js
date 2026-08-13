/**
 * judge0.js — adapter for a Judge0 instance.
 *
 * Judge0: https://github.com/judge0/judge0
 *
 * ===========================================================================
 * TARGETS A SELF-HOSTED INSTANCE. NOT A HOSTED, KEYED ONE.
 * ===========================================================================
 * Judge0's authentication documentation, read 2026-08-13, states:
 *
 *   "Administrators of Judge0 can configure Judge0 to require you to have an
 *    authentication token (a.k.a. API key)."
 *   "...provide `X-Auth-Token` header field in **every** API request."
 *
 * The hosted offerings do require such a key (`X-Auth-Token`, or
 * `X-RapidAPI-Key` via RapidAPI). This adapter deliberately has no field for
 * one. A static site cannot keep a secret: any key placed in this repository
 * or in configuration served to the browser is published to everyone who loads
 * the page. That is a hard project rule, not a preference.
 *
 * If you must use a keyed instance, put the key in a minimal server-side proxy
 * and point `judge0.baseUrl` at the proxy — the constraints for that are fixed
 * in docs/ARCHITECTURE.md §11. A self-hosted instance with authentication off
 * (the self-hosting default) needs none of this.
 *
 * ===========================================================================
 * WIRE FORMAT — verified against Judge0's docs on 2026-08-13, not from memory
 * ===========================================================================
 *   POST {baseUrl}/submissions?base64_encoded=false&wait=true
 *   request:  source_code and language_id required; stdin, expected_output,
 *             base64_encoded, wait, cpu_time_limit, wall_time_limit,
 *             memory_limit, compiler_options, command_line_arguments optional
 *   response: stdout, stderr, compile_output, message, exit_code, exit_signal,
 *             time, wall_time, memory, status {id, description}, token,
 *             created_at, finished_at
 *
 * `wait=true` asks for the result on the same request instead of returning a
 * token to poll. Some instances disable it; if yours does, this adapter needs
 * a polling branch — see NOT VERIFIED below.
 *
 * Java's `language_id` is deliberately NOT hardcoded. Ids differ between
 * Judge0 versions and between instances, so a constant here would silently run
 * the wrong language somewhere. It comes from config, where the comment tells
 * the operator to read `GET {baseUrl}/languages`.
 *
 * The numeric `status.id` table is likewise not hardcoded, for the same
 * reason; this adapter reads the human-readable `status.description` instead
 * and falls back to the exit code.
 *
 * NOT VERIFIED BY EXECUTION: no request has been made to a live Judge0
 * instance from this repository — the development sandbox blocks outbound
 * connections to it, including to ce.judge0.com. Treat the first real run
 * against your instance as the actual test.
 */

import { STATUS, baseResult, postJson } from '../result.js';

/** Does this status description denote a time limit? Compared case-insensitively. */
function isTimeLimit(description) {
  return typeof description === 'string' && /time\s*limit/i.test(description);
}

/** Does this status description denote a compilation failure? */
function isCompilationError(description) {
  return typeof description === 'string' && /compil/i.test(description);
}

export const judge0Adapter = {
  id: 'judge0',
  label: 'Judge0 (self-hosted)',

  /**
   * @param {{source: string, stdin: string, signal: AbortSignal, config: object}} args
   * @returns {Promise<object>}
   */
  async execute({ source, stdin, signal, config }) {
    const { baseUrl, languageId } = config.judge0;

    // base64_encoded=false keeps the payload readable; wait=true returns the
    // finished submission rather than a token to poll for.
    const url = `${baseUrl.replace(/\/+$/, '')}/submissions?base64_encoded=false&wait=true`;

    const posted = await postJson(
      url,
      {
        source_code: source,
        language_id: languageId,
        // Judge0 takes the source as a field, not a named file, and handles the
        // public-class filename itself — so unlike the Piston adapter this one
        // does not derive a file name.
        stdin,
      },
      signal,
    );

    if (!posted.ok) return posted.result;

    const body = posted.body;

    // An instance with `wait` disabled answers with a token and no result. Say
    // that plainly instead of rendering an empty, apparently-successful run.
    if (body && body.token && body.status === undefined && body.stdout === undefined) {
      return baseResult({
        status: STATUS.ERROR,
        message: 'This Judge0 instance returned a submission token instead of a result, '
          + 'which means it does not honour wait=true. This adapter does not poll; '
          + 'enable synchronous submissions on the instance, or add a polling branch '
          + 'to assets/js/execution/providers/judge0.js.',
        raw: body,
      });
    }

    const description = body?.status?.description ?? '';
    const compileOutput = (body?.compile_output ?? '').trim();
    const stdout = body?.stdout ?? '';
    const stderr = body?.stderr ?? '';
    const exitCode = typeof body?.exit_code === 'number' ? body.exit_code : null;

    if (compileOutput || isCompilationError(description)) {
      return baseResult({
        status: STATUS.COMPILE_ERROR,
        compileError: compileOutput
          || 'Compilation failed, but the provider returned no diagnostics.',
        exitCode,
        message: 'Compilation failed.',
        raw: body,
      });
    }

    if (isTimeLimit(description)) {
      return baseResult({
        status: STATUS.TIMEOUT,
        timedOut: true,
        stdout,
        stderr,
        exitCode,
        message: 'The program exceeded the time limit configured on that instance.',
        raw: body,
      });
    }

    // `message` carries runner-level detail (for example an internal error);
    // it is not program output and belongs in the status line, not in stdout.
    const runnerMessage = (body?.message ?? '').trim();
    const failed = (exitCode !== null && exitCode !== 0) || stderr.trim() !== '';

    return baseResult({
      status: failed ? STATUS.RUNTIME_ERROR : STATUS.SUCCESS,
      stdout,
      stderr,
      exitCode,
      message: [description || (failed ? 'The program failed.' : 'Ran successfully.'), runnerMessage]
        .filter(Boolean)
        .join(' — '),
      raw: body,
    });
  },
};

export default judge0Adapter;
