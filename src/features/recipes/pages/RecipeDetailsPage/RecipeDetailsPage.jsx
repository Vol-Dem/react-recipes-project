import classes from "./RecipeDetailsPage.module.scss";
import { useState, useEffect } from "react";
import Card from "../../../../shared/components/ui/Card/Card";
import { useThrowAsyncError } from "../../../../shared/hooks/useThrowAsyncError";
import { useGetDataFromHttp } from "../../hooks/useGetDataFromHttp";
import RecipeHeadSkeleton from "../../components/skeletons/RecipeHeadSkeleton/RecipeHeadSkeleton";
import RecipeDescriptionSkeleton from "../../components/skeletons/RecipeDescriptionSkeleton/RecipeDescriptionSkeleton";
import { useMatches, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import RecipeDetails from "../../components/RecipeDetails/RecipeDetails";
import RecipeHeader from "../../components/RecipeHeader/RecipeHeader";
import { buildRecipeDetailsUrl } from "../../api/recipeUrls";
import { fetchRecipeFromFirestore } from "../../api/recipeRepository";

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
      const url = buildRecipeDetailsUrl(recipeId);

      const getRecipe = (data) => {
        setRecipe(data);
        setRecipeIsLoading(false);
      };

      getDataFromHttp({ url: url }, getRecipe);
    } else {
      const getRecipe = async () => {
        try {
          const recipe = await fetchRecipeFromFirestore(recipeId);

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
