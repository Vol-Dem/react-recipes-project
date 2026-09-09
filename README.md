# Your Recipe Book

A Next.js recipe search application with Firebase authentication, saved
favorites, filtering, sorting, pagination, and responsive recipe details.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and provide the public Firebase values and
   server-only `SPOONACULAR_API_URL` and `SPOONACULAR_API_KEY`.
3. Start the development server with `npm run dev`.
4. Open `http://localhost:3000`.

Recipe searches, bulk lookups, and details use the local `/api/recipes`
endpoints. The Next.js server validates requests and calls Spoonacular without
sending its API key to the browser. When Spoonacular returns its daily quota
status (402), the existing client-side Firestore fallback remains available.
Restart the server after changing environment variables.

## Commands

- `npm run dev` starts Next.js in development mode.
- `npm run build` creates and validates a production build.
- `npm start` serves the production build.
- `npm test -- --run` runs the test suite once.
- `npm run lint` checks JavaScript, JSX, React, Hooks, and accessibility rules.
- `npm run format:check` checks formatting.

## Deployment

The application uses dynamic Next.js routes for recipe details. Deploy it to a
server-capable Next.js platform, such as Firebase App Hosting, rather than
uploading `.next` as a static Firebase Hosting directory.
