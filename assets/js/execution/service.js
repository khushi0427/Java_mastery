/**
 * service.js — the one entry point for running Java. Provider-agnostic.
 *
 * Everything that wants to run code calls `executeJava()`. Nothing else in the
 * codebase imports an adapter, names a provider, or touches `fetch`. Swapping
 * Piston for Judge0 for a future service is an edit to ./config.js and nothing
 * else (docs/ARCHITECTURE.md §11, decision 1).
 *
 * ===========================================================================
 * THE RESULT CONTRACT
 * ===========================================================================
 * Every call resolves to an ExecutionResult (./result.js). `executeJava` does
 * not throw for execution problems — a compiler error, a dead provider, and a
 * program that loops forever are all *results*, because to a learner they are
 * all just outcomes of pressing Run. Rejecting would push provider plumbing
 * into every call site, which is the coupling this module exists to prevent.
 *
 *   status              one of STATUS — the single field to switch on
 *   stdout              program output, '' when there is none
 *   stderr              program error stream, '' when there is none
 *   compileError        compiler diagnostics, or null when compilation succeeded
 *   timedOut            true when a deadline was hit (ours or the provider's)
 *   providerUnavailable true when no provider ran the code at all
 *   exitCode            exit code when the provider reports one, else null
 *   message             one human-readable line; always safe to show
 *   durationMs          wall time this client observed
 *   provider            which adapter answered, or null
 *   raw                 the provider's untouched response, for debugging
 *
 * `providerUnavailable` is deliberately separate from `status`. The UI must be
 * able to say "this is a configuration problem, not your code" without
 * enumerating provider failure modes — telling a learner their correct program
 * failed would be the worst bug this platform could have.
 */

import { EXECUTION_CONFIG, describeConfigProblem, isExecutionConfigured } from './config.js';
import { STATUS, baseResult } from './result.js';
import { pistonAdapter } from './providers/piston.js';
import { judge0Adapter } from './providers/judge0.js';

export { STATUS, baseResult };

const ADAPTERS = {
  piston: pistonAdapter,
  judge0: judge0Adapter,
};

/**
 * Which providers this build knows how to talk to, for the UI to describe.
 * @returns {Array<{id: string, label: string}>}
 */
export function availableProviders() {
  return Object.values(ADAPTERS).map((a) => ({ id: a.id, label: a.label }));
}

/**
 * Is execution usable right now, and if not, why?
 *
 * Cheap and synchronous — configuration only, never the network — so the UI can
 * call it during render and label the Run control honestly before anyone clicks.
 *
 * @returns {{ready: boolean, reason: string|null, provider: string|null}}
 */
export function executionStatus(config = EXECUTION_CONFIG) {
  const problem = describeConfigProblem(config);
  return {
    ready: problem === null,
    reason: problem,
    provider: isExecutionConfigured(config) ? config.provider : null,
  };
}

/**
 * Run Java source.
 *
 * @param {{source: string, stdin?: string}} request
 * @param {object} [config] injectable for tests; defaults to EXECUTION_CONFIG
 * @returns {Promise<object>} an ExecutionResult — never rejects
 */
export async function executeJava({ source, stdin = '' }, config = EXECUTION_CONFIG) {
  const started = Date.now();
  const since = () => Date.now() - started;

  if (typeof source !== 'string' || source.trim() === '') {
    return baseResult({
      status: STATUS.INVALID_INPUT,
      message: 'There is no code to run.',
      durationMs: since(),
    });
  }

  // Byte length, not string length — a source of mostly non-ASCII characters is
  // larger on the wire than `source.length` suggests.
  const byteLength = new TextEncoder().encode(source).length;
  if (byteLength > config.maxSourceBytes) {
    return baseResult({
      status: STATUS.INVALID_INPUT,
      message: `This source is ${Math.round(byteLength / 1024)} KB, over the `
        + `${Math.round(config.maxSourceBytes / 1024)} KB limit set in `
        + 'assets/js/execution/config.js.',
      durationMs: since(),
    });
  }

  const { ready, reason } = executionStatus(config);
  if (!ready) {
    return baseResult({
      status: STATUS.PROVIDER_UNAVAILABLE,
      providerUnavailable: true,
      message: reason,
      durationMs: since(),
      provider: config.provider ?? null,
    });
  }

  const adapter = ADAPTERS[config.provider];
  if (!adapter) {
    return baseResult({
      status: STATUS.PROVIDER_UNAVAILABLE,
      providerUnavailable: true,
      message: `No adapter is registered for provider "${config.provider}".`,
      durationMs: since(),
    });
  }

  // Our own deadline, independent of whatever the provider promises. If the
  // provider hangs or the connection stalls, the UI still gets an answer.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const result = await adapter.execute({ source, stdin, signal: controller.signal, config });
    return baseResult({ ...result, provider: adapter.id, durationMs: since() });
  } catch (error) {
    return baseResult({
      ...classifyThrow(error, config),
      provider: adapter.id,
      durationMs: since(),
      raw: { name: error?.name ?? null, message: error?.message ?? String(error) },
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Turn a thrown error into a typed result.
 *
 * `fetch` reports a blocked CORS preflight, a DNS failure, a refused
 * connection, and a mixed-content block as the *same* opaque `TypeError` — the
 * browser withholds the difference from script deliberately. Rather than guess
 * one cause and mislead the operator, the message lists what it can actually
 * be. All of them are provider or configuration problems; none is the
 * learner's code, and the message says so.
 */
function classifyThrow(error, config) {
  if (error?.name === 'AbortError') {
    return {
      status: STATUS.TIMEOUT,
      timedOut: true,
      message: `The execution provider did not respond within ${Math.round(config.timeoutMs / 1000)}s. `
        + 'Your program may be looping forever, or the provider may be unreachable.',
    };
  }

  if (error instanceof TypeError) {
    return {
      status: STATUS.PROVIDER_UNAVAILABLE,
      providerUnavailable: true,
      message: 'Could not reach the execution provider. The browser reports network '
        + 'failures and blocked cross-origin requests identically, so this is one of: '
        + 'the provider is not running, its address in assets/js/execution/config.js is '
        + 'wrong, it does not send CORS headers permitting this page\'s origin, or the '
        + 'page is HTTPS and the provider is plain HTTP. Your code was not run.',
    };
  }

  return {
    status: STATUS.ERROR,
    message: `The execution provider returned something unusable: ${error?.message ?? error}`,
  };
}
