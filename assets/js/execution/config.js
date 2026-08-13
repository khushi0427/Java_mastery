/**
 * config.js — THE single place where Java execution is configured.
 *
 * Nothing else in the codebase decides which provider runs code. Chapter
 * content, the practice shells, and the editor all call `executeJava()` from
 * ./service.js and never learn which provider answered (docs/ARCHITECTURE.md
 * §11, decision 1: "Chapter content is never coupled to a specific execution
 * provider").
 *
 * ===========================================================================
 * DEFAULT: NO PROVIDER. The platform is fully usable this way.
 * ===========================================================================
 * `provider: null` is not a stub awaiting completion — it is a supported,
 * permanent operating mode. With no provider configured:
 *
 *   - every chapter, exercise, hint, solution, and predict-the-output
 *     question works exactly as it does with one;
 *   - the editor stays editable and the code stays copyable;
 *   - the Run control reports "no execution provider configured" and points
 *     the learner at the local `javac` / `java` commands, which need nothing
 *     but a JDK.
 *
 * ARCHITECTURE §11, decision 2: "Online execution is an enhancement, never a
 * dependency." Do not add code anywhere that assumes a provider exists.
 *
 * ===========================================================================
 * WHY NO PUBLIC PROVIDER IS PRECONFIGURED
 * ===========================================================================
 * Researched 2026-08-13 against the providers' own live documentation. Full
 * findings, quotes, and sources are in docs/PROJECT_STATE.md under "Phase 5 —
 * provider research". In short:
 *
 *   - Piston's public API at emkc.org is, in its own readme's words, "no
 *     longer freely available to the public (as of Feb 15, 2026)" and now
 *     requires case-by-case authorization. A learning platform cannot depend
 *     on it.
 *   - Judge0's hosted offerings authenticate with a secret key
 *     (`X-Auth-Token` / `X-RapidAPI-Key`). A static site cannot hold a secret;
 *     putting one in this file would publish it to every visitor.
 *   - No keyless, browser-callable (CORS-enabled) Java service could be
 *     verified to this project's standard at that date.
 *
 * So the repository ships honest and unconfigured rather than shipping a
 * provider that might be broken, metered, or leaking a key. Two supported
 * ways to turn execution on are below.
 *
 * ===========================================================================
 * HOW TO ENABLE EXECUTION
 * ===========================================================================
 *
 * OPTION A — self-host a runner (recommended; no secret exists to leak)
 * --------------------------------------------------------------------
 * Both adapters target a self-hosted instance with authentication disabled,
 * which is the normal self-hosting default. Nothing secret is involved, so
 * nothing secret reaches the browser.
 *
 *   Piston (https://github.com/engineer-man/piston — self-hosting is
 *   documented in its readme):
 *
 *     provider: 'piston',
 *     piston: {
 *       baseUrl: 'http://localhost:2000/api/v2',
 *       // Piston's execute endpoint requires an explicit runtime version.
 *       // List what your instance actually has:  GET {baseUrl}/runtimes
 *       version: '<paste the java version your instance reports>',
 *     },
 *
 *   Judge0 (https://github.com/judge0/judge0):
 *
 *     provider: 'judge0',
 *     judge0: {
 *       baseUrl: 'http://localhost:2358',
 *       // Language ids differ between Judge0 versions and instances, so this
 *       // is deliberately NOT hardcoded. Read yours:  GET {baseUrl}/languages
 *       languageId: <the numeric id your instance reports for Java>,
 *     },
 *
 * OPTION B — a minimal proxy, only if a provider requires a secret
 * ---------------------------------------------------------------
 * ARCHITECTURE §11 already fixed the constraints: the proxy forwards the
 * execution request and response and does nothing else — no database, no
 * accounts, no rendering — and **no secret may ever appear in client-side
 * JavaScript or in this repository**. The key lives in the proxy's
 * environment. Point `baseUrl` at the proxy; the browser never sees the key,
 * and this file stays safe to publish.
 *
 * ===========================================================================
 * SECURITY RULE FOR THIS FILE
 * ===========================================================================
 * This file is served verbatim to every visitor. There is deliberately no
 * field for an API key, token, password, or any other credential — adding one
 * would publish it. If a provider needs a secret, that is precisely the case
 * Option B exists for. Never add a secret here.
 */

/**
 * @typedef {object} ExecutionConfig
 * @property {'piston'|'judge0'|null} provider  null = execution disabled (default)
 * @property {number} timeoutMs   client-side deadline for the whole request
 * @property {number} maxSourceBytes  refuse to send absurdly large sources
 * @property {{baseUrl: string, version: string}} piston
 * @property {{baseUrl: string, languageId: number|null}} judge0
 */

/** @type {ExecutionConfig} */
export const EXECUTION_CONFIG = {
  // null → no provider. See "DEFAULT: NO PROVIDER" above. This is a supported
  // permanent state, not an unfinished one.
  provider: null,

  // Client-side deadline. Independent of any limit the provider enforces: if
  // the provider hangs or the network stalls, the UI must still come back.
  timeoutMs: 15000,

  // A guard against pasting a whole project into the editor and sending it.
  maxSourceBytes: 64 * 1024,

  piston: {
    baseUrl: 'http://localhost:2000/api/v2',
    // No default: Piston's execute endpoint requires a concrete version string
    // and inventing one would be a fabricated claim about someone's instance.
    version: '',
  },

  judge0: {
    baseUrl: 'http://localhost:2358',
    // No default: ids are instance-specific. GET {baseUrl}/languages
    languageId: null,
  },
};

/** True when a provider is configured. Everything else must degrade cleanly. */
export function isExecutionConfigured(config = EXECUTION_CONFIG) {
  return config.provider !== null && config.provider !== undefined;
}

/**
 * Why execution is off, in words a learner can act on. Returns null when the
 * configuration is usable.
 *
 * This exists so the UI never says a flat "unavailable" when the real problem
 * is a half-finished config — a missing `version` is a different fix from a
 * missing provider.
 *
 * @returns {string|null}
 */
export function describeConfigProblem(config = EXECUTION_CONFIG) {
  if (!isExecutionConfigured(config)) {
    return 'No execution provider is configured. This is the default: the '
      + 'platform is designed to work without one. You can run every example '
      + 'locally with a JDK — the exact commands are below.';
  }

  if (config.provider === 'piston') {
    if (!config.piston?.baseUrl) return 'The Piston provider is selected but piston.baseUrl is empty in assets/js/execution/config.js.';
    if (!config.piston?.version) {
      return 'The Piston provider is selected but piston.version is empty in '
        + 'assets/js/execution/config.js. Piston requires an explicit runtime '
        + 'version — list your instance\'s runtimes with GET '
        + `${config.piston.baseUrl}/runtimes and copy the Java version string.`;
    }
    return null;
  }

  if (config.provider === 'judge0') {
    if (!config.judge0?.baseUrl) return 'The Judge0 provider is selected but judge0.baseUrl is empty in assets/js/execution/config.js.';
    if (typeof config.judge0?.languageId !== 'number') {
      return 'The Judge0 provider is selected but judge0.languageId is not set '
        + 'in assets/js/execution/config.js. Language ids differ between Judge0 '
        + `instances — read yours with GET ${config.judge0.baseUrl}/languages `
        + 'and copy the numeric id for Java.';
    }
    return null;
  }

  return `Unknown provider "${config.provider}" in assets/js/execution/config.js. `
    + 'Supported values are "piston", "judge0", or null.';
}

export default EXECUTION_CONFIG;
