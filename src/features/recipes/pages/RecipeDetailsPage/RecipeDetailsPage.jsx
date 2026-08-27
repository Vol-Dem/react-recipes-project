import classes from "./RecipeDetailsPage.module.scss";
import { useState, useEffect } from "react";
import Card from "../../../../shared/components/ui/Card/Card";
import {
  FIRESTORE_COLLECTIONS,
  INCLUDE_NUTRITION,
  SPOONACULAR_API_KEY,
  SPOONACULAR_API_URL,
} from "../../../../shared/constants";
import { useThrowAsyncError } from "../../../../shared/hooks/useThrowAsyncError";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import firebaseApp from "../../../../config/firebase";
import { useGetDataFromHttp } from "../../hooks/useGetDataFromHttp";
import RecipeHeadSkeleton from "../../components/skeletons/RecipeHeadSkeleton/RecipeHeadSkeleton";
import RecipeDescriptionSkeleton from "../../components/skeletons/RecipeDescriptionSkeleton/RecipeDescriptionSkeleton";
import { useMatches, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import RecipeDetails from "../../components/RecipeDetails/RecipeDetails";
import RecipeHeader from "../../components/RecipeHeader/RecipeHeader";

const firestore = getFirestore(firebaseApp);

const RecipeDetailsPage = () => {
  const [recipe, setRecipe] = useState({});
  const [recipeIsLoading, setRecipeIsLoading] = useState(true);
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
  const matches = useMatches()[1].pathname;

  const backToListHandler = () => {
    navigate(`${matches}`);
  };

  useEffect(() => {
    setRecipeIsLoading(true);
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
    <Card>
        <article data-testid="recipe">
          <div className={classes["recipe__head-container"]}>
            {recipeIsLoading && <RecipeHeadSkeleton />}
            {!recipeIsLoading && (
              <RecipeHeader
                diets={recipe.diets}
                image={recipe.image}
                showBackButton={recipesPerPageIsEmpty}
                title={recipe.title}
                onBack={backToListHandler}
              />
            )}
          </div>
          {recipeIsLoading && <RecipeDescriptionSkeleton />}
          {!recipeIsLoading && <RecipeDetails recipe={recipe} recipeId={recipeId} />}
        </article>
    </Card>
  );
};

export default RecipeDetailsPage;
