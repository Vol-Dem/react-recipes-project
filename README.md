# Your Recipe Book

[Live demo — Your Recipe Book](https://yr-recipe-book--yr-recipe-book.us-central1.hosted.app/)

A recipe discovery application built with Next.js, React, and TypeScript.
Search for recipes, refine the results, explore cooking instructions, and save
favorites to a Firebase account.

Originally a client-rendered React application, the project is being modernized around the
Next.js App Router.

## Features

- Search by keyword, cuisine, diet, intolerance, and meal type, with cooking-time
  and calorie filters.
- Shareable search URLs, browser back/forward navigation, sorting, and pagination.
- Responsive list/detail views with animated transitions and loading skeletons.
- Public recipe details loaded on the server and hydrated into TanStack Query,
  with dynamic metadata and scoped error/not-found views.
- Email/password and Google sign-in, password resets, and profile editing.
- Saved favorites with optimistic updates and rollback on failed writes.
- A Firestore recipe collection as a limited fallback when the API quota is reached.

## Stack

| Area                           | Tools                                            |
| ------------------------------ | ------------------------------------------------ |
| Application                    | Next.js App Router, React, TypeScript            |
| Server data                    | TanStack Query                                   |
| Client state                   | Redux Toolkit, React Redux                       |
| Authentication and persistence | Firebase Authentication, Cloud Firestore         |
| External data                  | Spoonacular, accessed through the Next.js server |
| Request/response validation    | Zod                                              |
| Styling and motion             | SCSS Modules, Framer Motion                      |
| Tests and quality checks       | Vitest, React Testing Library, ESLint, Prettier  |

Vite is used by the test tooling, not to serve or build the application.

## Getting started

### Prerequisites

- Node.js 22.12+ within the 22.x series, or Node.js 24+, and npm. The test
  tooling has stricter Node requirements than Next.js alone.
- A Firebase project with a registered web app and Cloud Firestore.
- A Spoonacular API key for live recipe data.

### Install and run

```sh
npm ci
```

Copy [.env.example](.env.example) to `.env`, then fill in your own configuration.
For example, in PowerShell:

```powershell
Copy-Item .env.example .env
```

Do not overwrite an existing `.env` containing your configuration.

```sh
npm run dev
```

Open [localhost:3000](http://localhost:3000). Restart the development server after
changing environment variables. Rebuild when changing public configuration used
by a production build.

### Environment variables

| Variable                                   | Purpose                                                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `SPOONACULAR_API_URL`                      | `https://api.spoonacular.com`; see the [Spoonacular API documentation](https://spoonacular.com/food-api/docs). |
| `SPOONACULAR_API_KEY`                      | Server-only API credential. Never prefix this with `NEXT_PUBLIC_`.                                             |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase web-app configuration.                                                                                |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase authentication domain.                                                                                |
| `NEXT_PUBLIC_FIREBASE_DATA_BASE_URL`       | Legacy-named `databaseURL` configuration field; recipe data uses Firestore, not Realtime Database.             |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project identifier.                                                                                   |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase web-app storage configuration.                                                                        |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase web-app sender configuration.                                                                         |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase web-app identifier.                                                                                   |

Copy Firebase values from your project's web-app configuration; do not invent
values for services that are not configured. The public configuration is bundled
for the browser and is not an authorization mechanism. Keep `.env` and private
credentials out of version control. The compatibility helper in
[config/publicEnvironment.ts](config/publicEnvironment.ts) still accepts legacy
`VITE_FIREBASE_*` names, but new setups should use the names above.

### Firebase setup

1. Enable Email/Password and Google in Authentication's sign-in providers.
2. Ensure `localhost` is an authorized authentication domain for local testing.
   Newer Firebase projects may not include it automatically; see the
   [Firebase authentication FAQ](https://firebase.google.com/docs/auth/faq-and-troubleshooting).
3. Create a Cloud Firestore database and configure access rules before using it.
   Restrict each `favorites/{uid}` document to its authenticated owner and validate
   writes. Client route guards are only a UI control, not database security.
   See [Firestore rule conditions](https://firebase.google.com/docs/firestore/security/rules-conditions).
4. If using the fallback, provide recipe documents that match the existing data
   contract. Provision indexes required by the queries in your Firebase project.

Firestore data expected by the application:

| Location             | Expected data                                                                                                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `favorites/{uid}`    | `favList`: an array of numeric recipe IDs. A missing document is treated as an empty list; the first update creates it.                                                                                                      |
| `recipes/{recipeId}` | The document ID is the string recipe ID used for detail lookups. List data includes numeric `id`, `title`, `image`, `readyInMinutes`, `servings`, and `nutrition.nutrients`; details also use the fields in `RecipeDetails`. |

See [recipe types](src/features/recipes/types.ts) and
[Firestore pagination](src/features/recipes/api/recipePagination.ts) for the exact
contract. Sorting uses top-level `calories` or `readyInMinutes` fields; the default
query orders by `nutrition`. Provide those fields consistently in fallback data.
Missing image URLs are supported by the shared Image fallback.

The repository does not contain a recipe seed/import script or versioned Firestore
rules/indexes. Live setup therefore requires configuration outside this repository;
it is not a zero-configuration offline demo.

## Architecture

```text
src/
  app/                 App Router routes, layouts, providers, API routes, store
  features/
    auth/              Authentication, profile, validation, client route guards
    favorites/         Account-scoped favorites queries and mutations
    recipes/           Recipe UI, hooks, queries, server services, utilities
    search/            Search form, filters, sorting controls
    notifications/     Notification state and UI
    legal/             Terms and privacy content
  pages/               Standalone informational page components
  shared/              Reusable UI, hooks, utilities, constants, types
  styles/              Global SCSS and design variables
  assets/              Images and icons
config/                Build-time public environment compatibility
```

### Data and state ownership

- **TanStack Query** owns fetched recipes, favorite IDs, and favorite mutations.
  API and Firestore results use separate keys. Favorites keys include the user ID,
  and account changes clear the previous user's cached favorites.
- **Redux** owns the client auth snapshot/UI state, notifications, and the API
  quota flag. It does not hold recipe collections or Firestore pagination cursors.
- **The URL** owns submitted search filters. Draft form values, sorting, and page
  selection remain local. `/?query=` means an intentional empty search; `/` is
  the landing page. Recipe links preserve submitted search parameters.
- **React context** shares a list controller between the list and its detail
  route, and shares favorite state between consumers.

Browser search and bulk requests use `/api/recipes/search` and `/api/recipes/bulk`.
Client detail requests use `/api/recipes/{recipeId}`. The server validates inputs
and provider responses with Zod, keeps the Spoonacular key server-only, and returns
safe error responses.

Public detail routes and `generateMetadata` share
[loadRecipeDetails](src/features/recipes/server/loadRecipeDetails.ts) through
request-scoped React memoization. Successful data hydrates the same query key used
by the browser, avoiding an immediate duplicate browser fetch. This is not a
persistent server cache across requests. Favorites remain client-loaded until
server authentication is implemented.

### Quota fallback and current limits

- HTTP 402 activates the client quota flag and displays a notification. It is not
  a general fallback for all network or server failures.
- Firestore search fallback pages through existing saved recipes. It does **not**
  apply the Spoonacular keyword/filter search, and live results are not
  automatically written to Firestore.
- Favorites fallback selects saved recipe documents by ID. It uses one Firestore
  `in` query, so large lists are subject to the service's query limits; batching
  has not been implemented.
- Firestore cursors are SDK snapshots retained only in browser query pages. They
  must not be placed in Redux, serialized into URLs, or server-dehydrated.
- A server-detected quota failure skips a duplicate browser API attempt. Other
  server-loading failures can get one attempt through the existing client loader.
- Dynamic recipe metadata depends on the provider. While unavailable it uses a
  generic title. The temporary loading title applies after hydration; the browser
  may briefly show the URL before then.

## Commands and tests

| Command                                   | Purpose                                             |
| ----------------------------------------- | --------------------------------------------------- |
| `npm run dev`                             | Start the Next.js development server using webpack. |
| `npm run build`                           | Create a production build.                          |
| `npm start`                               | Serve the existing production build.                |
| `npm run typecheck`                       | Check TypeScript without emitting application code. |
| `npm test`                                | Start Vitest's interactive/watch workflow.          |
| `npm test -- --run`                       | Run the test suite once.                            |
| `npm run lint` / `npm run lint:fix`       | Check lint rules / apply available fixes.           |
| `npm run format:check` / `npm run format` | Check formatting / format the repository.           |

Tests are colocated with their source files and use jsdom and mocked service
calls. They do not need to spend live Spoonacular quota or write to Firestore.
The application still initializes Firebase configuration during imports, so use
a valid web-app configuration for local setup. Tests cover utilities, validation,
auth flows, query/cache behavior, hydration, fallback loading, and UI interactions;
they are not a substitute for production-browser checks.

Before committing, run typecheck, lint, tests, and a production build. For manual
checks, use `npm run build` followed by `npm start` and verify search/history,
recipe opening and sorting, auth/favorites, quota fallback, and error recovery.

JSDoc lives alongside important hooks and APIs. It describes contracts, side
effects, preconditions, and cache/lifecycle decisions; TypeScript remains the
source of truth for parameter and return types.

## Troubleshooting

- **Authentication popup/domain errors:** check enabled sign-in providers,
  authorized domains, and browser popup settings.
- **Daily API limit reached:** fallback needs an accessible, populated `recipes`
  collection. An empty collection cannot reproduce live API search results.
- **Firestore permission/index errors:** inspect the Firebase configuration,
  ownership rules, and required indexes; do not solve these by allowing all writes.
- **API configuration errors:** verify both server-only Spoonacular variables,
  the HTTPS base URL, and restart the server. Public Firebase configuration cannot
  substitute for these values.
- **Navigation seems slower in development:** test a production build separately;
  development includes on-demand compilation.

## Deployment

The application is deployed on Firebase App Hosting:
[Your Recipe Book](https://yr-recipe-book--yr-recipe-book.us-central1.hosted.app/).
It uses a server-capable Next.js runtime for dynamic routes and API handlers,
rather than a static Firebase Hosting deployment.

For your own deployment, configure server secrets and public environment values,
verify Firestore rules/indexes and auth domains, and review API abuse/quota controls.
Public Firebase configuration must be available during the build; a local `.env`
is not automatically transferred to GitHub-connected builds.
Server-side authentication remains follow-up work; client route guards are not
an authorization boundary.

Recipe data and photography are provided by
[Spoonacular](https://spoonacular.com/food-api). The detail view displays source
credits when supplied by the recipe data.
