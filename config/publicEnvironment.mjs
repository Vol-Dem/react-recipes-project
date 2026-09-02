const readEnvironmentValue = (environment, name) =>
  environment[`NEXT_PUBLIC_${name}`] ?? environment[`VITE_${name}`];

export const getPublicEnvironment = (environment = process.env) => ({
  NEXT_PUBLIC_SPOONACULAR_API_URL: readEnvironmentValue(
    environment,
    "SPOONACULAR_API_URL",
  ),
  NEXT_PUBLIC_SPOONACULAR_API_KEY: readEnvironmentValue(
    environment,
    "SPOONACULAR_API_KEY",
  ),
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
