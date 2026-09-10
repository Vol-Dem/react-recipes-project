type Environment = Record<string, string | undefined>;

const readEnvironmentValue = (environment: Environment, name: string) =>
  environment[`NEXT_PUBLIC_${name}`] ?? environment[`VITE_${name}`];

/**
 * Exposes only the Firebase web-app configuration to Next.js and the test runner.
 * NEXT_PUBLIC_* values take precedence over legacy VITE_* names. Server-only
 * credentials must never be added to this allowlist.
 */
export const getPublicEnvironment = (
  environment: Environment = process.env,
) => ({
  NEXT_PUBLIC_FIREBASE_API_KEY: readEnvironmentValue(
    environment,
    "FIREBASE_API_KEY",
  ),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: readEnvironmentValue(
    environment,
    "FIREBASE_AUTH_DOMAIN",
  ),
  NEXT_PUBLIC_FIREBASE_DATA_BASE_URL: readEnvironmentValue(
    environment,
    "FIREBASE_DATA_BASE_URL",
  ),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: readEnvironmentValue(
    environment,
    "FIREBASE_PROJECT_ID",
  ),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: readEnvironmentValue(
    environment,
    "FIREBASE_STORAGE_BUCKET",
  ),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: readEnvironmentValue(
    environment,
    "FIREBASE_MESSAGING_SENDER_ID",
  ),
  NEXT_PUBLIC_FIREBASE_APP_ID: readEnvironmentValue(
    environment,
    "FIREBASE_APP_ID",
  ),
});
