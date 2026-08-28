import classes from "./RecipeDetailsPage.module.scss";
import Card from "../../../../shared/components/ui/Card/Card";
import RecipeHeadSkeleton from "../../components/skeletons/RecipeHeadSkeleton/RecipeHeadSkeleton";
import RecipeDescriptionSkeleton from "../../components/skeletons/RecipeDescriptionSkeleton/RecipeDescriptionSkeleton";
import { useMatches, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import RecipeDetails from "../../components/RecipeDetails/RecipeDetails";
import RecipeHeader from "../../components/RecipeHeader/RecipeHeader";
import { useRecipeDetails } from "../../hooks/useRecipeDetails";
import { selectHasRecipesPerPage } from "../../store/recipesSelectors";

const RecipeDetailsPage = () => {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const { isLoading: recipeIsLoading, recipe } = useRecipeDetails(recipeId);
  const hasRecipesPerPage = useSelector(selectHasRecipesPerPage);
  const matches = useMatches()[1].pathname;

  const backToListHandler = () => {
    navigate(`${matches}`);
  };

  return (
    <Card>
      <article data-testid="recipe">
        <div className={classes["recipe__head-container"]}>
          {recipeIsLoading && <RecipeHeadSkeleton />}
          {!recipeIsLoading && (
            <RecipeHeader
              diets={recipe.diets}
              image={recipe.image}
              showBackButton={hasRecipesPerPage}
              title={recipe.title}
              onBack={backToListHandler}
            />
          )}
        </div>
        {recipeIsLoading && <RecipeDescriptionSkeleton />}
        {!recipeIsLoading && (
          <RecipeDetails recipe={recipe} recipeId={recipeId} />
        )}
      </article>
    </Card>
  );
};

export default RecipeDetailsPage;
