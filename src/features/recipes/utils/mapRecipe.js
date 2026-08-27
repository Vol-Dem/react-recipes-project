export const mapRecipe = (recipe) => ({
  id: recipe.id,
  title: recipe.title,
  img: recipe.image,
  readyInMinutes: recipe.readyInMinutes,
  calories: recipe.nutrition.nutrients.find(
    ({ name }) => name === "Calories",
  ).amount,
  servings: recipe.servings,
});
