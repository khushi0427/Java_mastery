/**
 * result.js — the execution result type, shared by the service and its adapters.
 *
 * This is a separate module for a structural reason. The adapters need the
 * result vocabulary, and the service needs the adapters; if the vocabulary
 * lived in service.js the two would import each other. ES modules tolerate a
 * cycle like that only as long as nothing reads the binding during module
 * evaluation — a condition invisible in the source and easy to break later by
 * adding one top-level constant. Putting the shared types underneath both
 * removes the cycle rather than relying on nobody tripping over it.
 */

/**
 * Every outcome `executeJava` can report. Exhaustive — the service returns one
 * of these on every path, so a UI switch can cover all cases.
 */
export const STATUS = {
  /** Compiled, ran, exited 0. */
  SUCCESS: 'success',
  /** Compilation failed. `compileError` holds the diagnostics. */
  COMPILE_ERROR: 'compile-error',
  /** Compiled and ran, but exited non-zero or threw. */
  RUNTIME_ERROR: 'runtime-error',
  /** A deadline was hit — ours or the provider's. */
  TIMEOUT: 'timeout',
  /** No provider configured, or the configured one could not be reached. */
  PROVIDER_UNAVAILABLE: 'provider-unavailable',
  /** Refused before sending — empty or oversized source. */
  INVALID_INPUT: 'invalid-input',
  /** Anything else: a malformed response, an unexpected throw. */
  ERROR: 'error',
};

/**
 * Build a result with every field present.
 *
 * Call sites should never have to guard for `undefined`, so defaults are filled
 * in here rather than at each `return`.
 *
 * @param {object} [overrides]
 * @returns {object} ExecutionResult
 */
export function baseResult(overrides = {}) {
  return {
    status: STATUS.ERROR,
    stdout: '',
    stderr: '',
    compileError: null,
    timedOut: false,
    providerUnavailable: false,
    exitCode: null,
    message: '',
    durationMs: 0,
    provider: null,
    raw: null,
    ...overrides,
  };
}

/**
 * POST JSON with the caller's abort signal, mapping a non-2xx response to a
 * typed result so every adapter reports transport failures identically.
 *
 * @param {string} url
 * @param {object} payload
 * @param {AbortSignal} signal
 * @param {Record<string,string>} [headers]
 * @returns {Promise<{ok: true, body: object} | {ok: false, result: object}>}
 */
export async function postJson(url, payload, signal, headers = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    // Providers put the actual reason in the body; a bare status code sends the
    // operator hunting blind.
    let detail = '';
    try { detail = (await response.text()).slice(0, 500); } catch { /* unreadable body */ }

    // "You are not allowed" deserves its own wording: the fix is credentials or
    // quota, not anything about the learner's code.
    const denied = response.status === 401 || response.status === 403 || response.status === 429;

    return {
      ok: false,
      result: baseResult({
        status: STATUS.PROVIDER_UNAVAILABLE,
        providerUnavailable: true,
        message: denied
          ? `The execution provider refused the request (HTTP ${response.status}). `
            + 'That is an authorisation or rate-limit response, not a problem with your code.'
          : `The execution provider returned HTTP ${response.status}.`,
        raw: detail || null,
      }),
    };
  }

  return { ok: true, body: await response.json() };
}
