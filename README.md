# Your Recipe Book

A Next.js recipe search application with Firebase authentication, saved
favorites, filtering, sorting, pagination, and responsive recipe details.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and provide the required public Firebase and
   Spoonacular values.
3. Start the development server with `npm run dev`.
4. Open `http://localhost:3000`.

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
