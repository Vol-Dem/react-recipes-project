import { TIMEOUT_SEC } from "../../../shared/constants/app";

/** Carries a request's HTTP status without retaining a potentially sensitive response body. */
export class RecipeHttpError extends Error {
  constructor(public readonly status: number) {
    super("Recipe request failed");
    this.name = "RecipeHttpError";
  }
}

/**
 * Fetches JSON with the shared timeout and optional caller cancellation.
 * The generic type is a compile-time contract, not runtime schema validation.
 *
 * @throws RecipeHttpError for HTTP failures, provider failure envelopes, or
 * invalid JSON. Network, timeout, and caller-abort errors propagate unchanged.
 */
export const requestRecipeJson = async <Data>(
  url: string,
  { signal, ...options }: RequestInit = {},
): Promise<Data> => {
  const timeoutSignal = AbortSignal.timeout(TIMEOUT_SEC * 1000);
  const response = await fetch(url, {
    ...options,
    signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
  });

  // Keep status codes even if an upstream error has an empty or non-JSON body.
  if (!response.ok) throw new RecipeHttpError(response.status);

  let data: unknown;
  try {
    data = await response.json();
  } catch (error) {
    if (timeoutSignal.aborted) throw timeoutSignal.reason;
    if (signal?.aborted) throw signal.reason;
    if (!(error instanceof SyntaxError)) throw error;
    throw new RecipeHttpError(502);
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "status" in data &&
    data.status === "failure"
  ) {
    const code = "code" in data ? Number(data.code) : 502;
    throw new RecipeHttpError(
      Number.isInteger(code) && code >= 400 && code <= 599 ? code : 502,
    );
  }

  return data as Data;
};
