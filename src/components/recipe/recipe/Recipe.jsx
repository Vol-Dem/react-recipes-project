import classes from "./Recipe.module.css";
import { useState, useEffect, useContext } from "react";
import { ReactComponent as ClockIcon } from "./../../../assets/clock.svg";
import { ReactComponent as ServingsIcon } from "./../../../assets/servings.svg";
import { ReactComponent as ArrowBackIcon } from "./../../../assets/arrow-back.svg";
import Spinner from "../../ui/Spinner";
import Card from "../../ui/Card";
import ErrorContext from "../../../store/error-context";
import RecipeContext from "../../../store/recipe-context";
import ErrorMessage from "../../ui/ErrorMessage";

const Recipe = (props) => {
  const [recipe, setRecipe] = useState({});
  const [recipeIsLoading, setRecipeIsLoading] = useState(true);

  const errorCtx = useContext(ErrorContext);
  const setError = errorCtx.setErrorMessage;
  const errorMessage = errorCtx.errorMessage;

  const recipeCtx = useContext(RecipeContext);
  const recipeId = recipeCtx.recipeId;
  const closeRecipe = recipeCtx.setRecipeIsClosedHandler;

  const getRecipe = () => {
    setRecipeIsLoading(true);
    setError("");
    console.log("wtf");

    fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=5303df5a010c4a06a1d6ac24c41091f9&includeNutrition=false`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "failure")
          throw new Error(`${data.message} (${data.code})`);
        console.log(data);
        setRecipe(data);
        setRecipeIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setRecipeIsLoading(false);
      });
  };
  useEffect(getRecipe, [recipeId]);

  console.log(errorMessage);

  return (
    <Card>
      {recipeIsLoading && <Spinner />}
      {errorMessage && <ErrorMessage />}
      {errorMessage !== "" || recipeIsLoading || (
        <div className={classes.recipe}>
          <div className={classes["recipe__head"]}>
            <button
              className={classes["recipe__btn-back"]}
              onClick={closeRecipe}
            >
              <ArrowBackIcon /> Back
            </button>
            <ul className={classes["recipe__diets"]}>
              {recipe.diets?.map((diet) => (
                <li key={diet}>{diet}&nbsp;/&nbsp;</li>
              ))}
            </ul>
            <h1 className={classes["recipe__title"]}>{recipe.title}</h1>
            <div className={classes["recipe__img"]}>
              <img src={recipe.image} alt={recipe.title} />
            </div>
          </div>
          <div className={classes["recipe__description"]}>
            <div className={classes["recipe__info"]}>
              <div className={classes["recipe__param"]}>
                <ClockIcon /> {recipe.readyInMinutes} min
              </div>
              <div className={classes["recipe__param"]}>
                <ServingsIcon /> {recipe.servings} servings
              </div>
            </div>
            <div>
              <h3 className={classes["recipe__subtitle"]}>Ingridients</h3>
              <div>
                <ul className={classes["recipe__ingridients"]}>
                  {recipe.extendedIngredients?.map((ingridient) => (
                    <li key={ingridient.id}>
                      <span>{ingridient.name}</span>
                      <span
                        className={classes["recipe__ingridients-dots"]}
                      ></span>
                      <span>
                        {ingridient.amount} {ingridient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className={classes["recipe__subtitle"]}>Instructions</h3>
              <p className={classes["recipe__instructions"]}>
                {recipe.instructions?.replace(/(<([^>]+)>)/gi, "")}
              </p>
            </div>
            <div>
              <h3 className={classes["recipe__subtitle"]}>Nutrition</h3>
              <ul className={classes["recipe__nutrition"]}>
                <li key="calories">
                  <span className={classes["recipe__nutrition-amount"]}>
                    {recipe.nutrition?.nutrients
                      .find(({ name }) => name === "Calories")
                      .amount.toFixed() || "??"}
                  </span>
                  <span className={classes["recipe__nutrition-unit"]}>
                    kcal
                  </span>
                </li>
                <li key="fat">
                  <span className={classes["recipe__nutrition-amount"]}>
                    {recipe.nutrition?.nutrients
                      .find(({ name }) => name === "Fat")
                      .amount.toFixed() || "??"}
                  </span>
                  <span className={classes["recipe__nutrition-unit"]}>
                    fats
                  </span>
                </li>
                <li key="carbohydrates">
                  <span className={classes["recipe__nutrition-amount"]}>
                    {recipe.nutrition?.nutrients
                      .find(({ name }) => name === "Carbohydrates")
                      .amount.toFixed() || "??"}
                  </span>
                  <span className={classes["recipe__nutrition-unit"]}>
                    carbs
                  </span>
                </li>
                <li key="protein">
                  <span className={classes["recipe__nutrition-amount"]}>
                    {recipe.nutrition?.nutrients
                      .find(({ name }) => name === "Protein")
                      .amount.toFixed() || "??"}
                  </span>
                  <span className={classes["recipe__nutrition-unit"]}>
                    proteins
                  </span>
                </li>
              </ul>
            </div>
            <div className={classes["recipe__credits"]}>
              <p>
                Source: {recipe.creditsText} -{" "}
                <a href={recipe.sourceUrl}>{recipe.sourceName}</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Recipe;
