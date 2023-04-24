import classes from "./Recipe.module.scss";
import { useState, useEffect, useContext } from "react";
import Spinner from "../../ui/Spinner";
import Card from "../../ui/Card";
import RecipeContext from "../../../store/recipe-context";
import Nutrition from "./nutrition/Nutrition";
import Ingridients from "./ingridients/Ingridients";
import Instructions from "./instructions/Instructions";
import Credits from "./credits/Credits";
import Info from "./info/Info";
import Diets from "./diets/Diets";
import { TIMEOUT_SEC, INCLUDE_NUTRITION } from "../../../variables/constants";
import { timeout } from "../../../variables/utils";
import ButtonBack from "../../ui/ButtonBack";
import { useThrowAsyncError } from "../../../hooks/use-throw-async-error";

const Recipe = () => {
  const [recipe, setRecipe] = useState({});
  const [recipeIsLoading, setRecipeIsLoading] = useState(true);
  const throwAsyncError = useThrowAsyncError();

  const recipeCtx = useContext(RecipeContext);
  const recipeId = recipeCtx.recipeId;
  const closeRecipe = recipeCtx.closeRecipe;

  const nutrients = ["calories", "fat", "carbohydrates", "protein"];

  useEffect(() => {
    setRecipeIsLoading(true);

    const getRecipe = async () => {
      try {
        const fetchRec = fetch(
          `${process.env.REACT_APP_SPOONACULAR_API_URL}/recipes/${recipeId}/information?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&includeNutrition=${INCLUDE_NUTRITION}`
        );
        const res = await Promise.race([fetchRec, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (data.status === "failure")
          throw new Error(`${data.message} (${data.code})`);

        console.log(data);

        setRecipe(data);
        setRecipeIsLoading(false);
      } catch (error) {
        throwAsyncError(error);
        setRecipeIsLoading(false);
      }
    };
    getRecipe();
  }, [recipeId, throwAsyncError]);

  return (
    <Card>
      {recipeIsLoading && <Spinner />}
      {recipeIsLoading || (
        <div className={classes.recipe}>
          <div className={classes["recipe__head"]}>
            <ButtonBack onClick={closeRecipe} />
            <Diets diets={recipe.diets} />
            <h1 className={classes["recipe__title"]}>{recipe.title}</h1>
            <div className={classes["recipe__img"]}>
              <img src={recipe.image} alt={recipe.title} />
            </div>
          </div>
          <div className={classes["recipe__description"]}>
            <Info
              readyInMinutes={recipe.readyInMinutes}
              servings={recipe.servings}
              recipeId={recipeId}
            />
            <div>
              <h3 className={classes["recipe__subtitle"]}>Ingridients</h3>
              <Ingridients ingridients={recipe.extendedIngredients} />
            </div>
            <div>
              <h3 className={classes["recipe__subtitle"]}>Instructions</h3>
              <Instructions instructions={recipe.instructions} />
            </div>
            <div>
              <h3 className={classes["recipe__subtitle"]}>Nutrition</h3>
              <Nutrition nutrition={recipe.nutrition} nutrients={nutrients} />
            </div>
            <Credits
              credits={{
                creditsText: recipe.creditsText,
                sourceUrl: recipe.sourceUrl,
                sourceName: recipe.sourceName,
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default Recipe;
