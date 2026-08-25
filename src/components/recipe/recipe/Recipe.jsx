import classes from "./Recipe.module.scss";
import { useState, useEffect } from "react";
import Card from "../../ui/Card";
import Nutrition from "./nutrition/Nutrition";
import Ingredients from "./ingredients/Ingredients";
import Instructions from "./instructions/Instructions";
import Credits from "./credits/Credits";
import Info from "./info/Info";
import Diets from "./diets/Diets";
import {
  FIRESTORE_COLLECTIONS,
  INCLUDE_NUTRITION,
  SPOONACULAR_API_KEY,
  SPOONACULAR_API_URL,
} from "../../../constants";
import ButtonBack from "../../ui/ButtonBack";
import { useThrowAsyncError } from "../../../hooks/useThrowAsyncError";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import firebaseApp from "../../../config";
import { useGetDataFromHttp } from "../../../hooks/useGetDataFromHttp";
import RecipeHeadSkeleton from "../../skeletons/RecipeHeadSkeleton";
import RecipeDescriptionSkeleton from "../../skeletons/RecipeDescriptionSkeleton";
import { useMatches, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import FoodImg from "../../../assets/food.svg?react";

const firestore = getFirestore(firebaseApp);

const Recipe = () => {
  const [recipe, setRecipe] = useState({});
  const [recipeIsLoading, setRecipeIsLoading] = useState(true);
  const [imgIsLoading, setImgIsLoading] = useState(true);
  const throwAsyncError = useThrowAsyncError();
  const getDataFromHttp = useGetDataFromHttp();
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const dailyLimitReached = useSelector(
    (state) => state.recipe.dailyLimitIsReached
  );
  const recipesPerPageIsEmpty = !!useSelector(
    (state) => state.recipe.recipesPerPage
  ).length;
  const nutrients = [
    { nutrient: "calories", unit: "kcal" },
    { nutrient: "fat", unit: "fat" },
    { nutrient: "carbohydrates", unit: "carbs" },
    { nutrient: "protein", unit: "prot" },
  ];
  const matches = useMatches()[1].pathname;

  const backToListHandler = () => {
    navigate(`${matches}`);
  };

  const imgloadingHandler = () => {
    setImgIsLoading(false);
  };

  useEffect(() => {
    setRecipeIsLoading(true);
    setImgIsLoading(true);
    if (!dailyLimitReached) {
      const url = `${SPOONACULAR_API_URL}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=${INCLUDE_NUTRITION}`;

      const getRecipe = (data) => {
        setRecipe(data);
        setRecipeIsLoading(false);
      };

      getDataFromHttp({ url: url }, getRecipe);
    } else {
      const getRecipe = async () => {
        try {
          const recipeRef = doc(
            firestore,
            FIRESTORE_COLLECTIONS.recipes,
            `${recipeId}`,
          );
          const recipeDoc = await getDoc(recipeRef);
          const recipe = recipeDoc.data();

          setRecipe(recipe);
          setRecipeIsLoading(false);
        } catch (error) {
          throwAsyncError(error);
        }
      };
      getRecipe();
    }
  }, [recipeId, throwAsyncError, dailyLimitReached, getDataFromHttp]);

  return (
    <>
      <Card>
        <article data-testid="recipe">
          <div className={classes["recipe__head-container"]}>
            {recipeIsLoading && <RecipeHeadSkeleton />}
            {!recipeIsLoading && (
              <div
                className={`${classes["recipe__head"]} ${classes["animation-show"]}`}
              >
                {recipesPerPageIsEmpty && (
                  <ButtonBack onClick={backToListHandler} />
                )}
                <Diets diets={recipe.diets} />
                <h1 className={classes["recipe__title"]}>{recipe.title}</h1>
                <div className={classes["recipe__img-container"]}>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className={`${classes["recipe__img"]} ${
                      imgIsLoading ? classes["recipe__img--hidden"] : ""
                    }`}
                    onLoad={imgloadingHandler}
                  />
                  {imgIsLoading && (
                    <FoodImg className={classes["default-img"]} />
                  )}
                </div>
              </div>
            )}
          </div>
          {recipeIsLoading && <RecipeDescriptionSkeleton />}
          {!recipeIsLoading && (
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
                <Nutrition nutrition={recipe.nutrition} nutrients={nutrients} />
              </section>
              <Credits
                credits={{
                  creditsText: recipe.creditsText,
                  sourceUrl: recipe.sourceUrl,
                  sourceName: recipe.sourceName,
                }}
              />
            </div>
          )}
        </article>
      </Card>
    </>
  );
};

export default Recipe;
