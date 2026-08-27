import Credits from "../Credits/Credits";
import Info from "../Info/Info";
import Ingredients from "../Ingredients/Ingredients";
import Instructions from "../Instructions/Instructions";
import Nutrition from "../Nutrition/Nutrition";
import classes from "./RecipeDetails.module.scss";

const NUTRIENTS = [
  { nutrient: "calories", unit: "kcal" },
  { nutrient: "fat", unit: "fat" },
  { nutrient: "carbohydrates", unit: "carbs" },
  { nutrient: "protein", unit: "prot" },
];

const RecipeDetails = ({ recipe, recipeId }) => (
  <div
    className={`${classes["recipe__description"]} ${classes["animation-show"]}`}
  >
    <Info
      readyInMinutes={recipe.readyInMinutes}
      servings={recipe.servings}
      recipeId={recipeId}
    />
    <section>
      <h2 className={classes["recipe__subtitle"]}>Ingredients</h2>
      <Ingredients ingredients={recipe.extendedIngredients} />
    </section>
    <section>
      <h2 className={classes["recipe__subtitle"]}>Instructions</h2>
      <Instructions instructions={recipe.instructions} />
    </section>
    <section>
      <h2 className={classes["recipe__subtitle"]}>Nutrition</h2>
      <Nutrition nutrition={recipe.nutrition} nutrients={NUTRIENTS} />
    </section>
    <Credits
      text={recipe.creditsText}
      sourceName={recipe.sourceName}
      sourceUrl={recipe.sourceUrl}
    />
  </div>
);

export default RecipeDetails;
