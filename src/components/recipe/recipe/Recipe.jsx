import classes from "./Recipe.module.scss";
import { useState, useEffect } from "react";
import Card from "../../ui/Card";
import Nutrition from "./nutrition/Nutrition";
import Ingridients from "./ingridients/Ingredients";
import Instructions from "./instructions/Instructions";
import Credits from "./credits/Credits";
import Info from "./info/Info";
import Diets from "./diets/Diets";
import { INCLUDE_NUTRITION } from "../../../variables/constants";
import ButtonBack from "../../ui/ButtonBack";
import { useThrowAsyncError } from "../../../hooks/use-throw-async-error";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import firebaseApp from "../../../config";
import { useGetDataFromHttp } from "../../../hooks/use-get-data-from-http";
import RecipeHeadSkeleton from "../../skeletons/RecipeHeadSkeleton";
import RecipeDescriptionSkeleton from "../../skeletons/RecipeDescriptionSkeleton";
import { useMatches, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactComponent as FoodImg } from "../../../assets/food.svg";

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
      const url = `${process.env.REACT_APP_SPOONACULAR_API_URL}/recipes/${recipeId}/information?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&includeNutrition=${INCLUDE_NUTRITION}`;

      const getRecipe = (data) => {
        setRecipe(data);
        setRecipeIsLoading(false);
      };

      getDataFromHttp({ url: url }, getRecipe);
    } else {
      const getRecipe = async () => {
        try {
          const recipeRef = doc(firestore, "recipes", `${recipeId}`);
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
        <div className={classes.recipe}>
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
              <div>
                <h3 className={classes["recipe__subtitle"]}>Ingredients</h3>
                <Ingridients ingredients={recipe.extendedIngredients} />
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
          )}
        </div>
      </Card>
    </>
  );
};

export default Recipe;
