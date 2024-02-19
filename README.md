# Your Recipe Book

"Your Recipe Book" is an interactive web application designed to easily search for recipes and compile a selection of your favorite dishes. The project is developed using React, Redux Toolkit, React Router, Firebase Auth, Firestore, Spoonacular API.

The app uses an external API with a daily limit to get information about recipes. When the daily limit is reached, the application will automatically switch to receiving information from the backup database. The search result will always be the same (at least for now), but all other functions will continue to work normally. Recipes already added to favorites will be displayed in the favorites list only if their copy is present in the backup database.
A tooltip will inform the user about switching to a backup source.
