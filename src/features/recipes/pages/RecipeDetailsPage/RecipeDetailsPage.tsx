"use client";

import { useParams, useRouter } from "next/navigation";
import RecipeDetails from "../../components/RecipeDetails/RecipeDetails";
import RecipeDetailsLoading from "../../components/RecipeDetailsLoading/RecipeDetailsLoading";
import RecipeDetailsShell from "../../components/RecipeDetailsShell/RecipeDetailsShell";
import RecipeHeader from "../../components/RecipeHeader/RecipeHeader";
import { useRecipeDetails } from "../../hooks/useRecipeDetails";
import { useRecipeList } from "../../context/RecipeListContext";

interface RecipeDetailsPageProps {
  initialApiLimitReached?: boolean;
}

const RecipeDetailsPage = ({
  initialApiLimitReached = false,
}: RecipeDetailsPageProps) => {
  const router = useRouter();
  const { recipeId } = useParams<{ recipeId: string }>() ?? { recipeId: "" };
  const { isLoading: recipeIsLoading, recipe } = useRecipeDetails(
    recipeId,
    initialApiLimitReached,
  );
  const {
    listHref,
    list: { hasRecipes: hasRecipesPerPage },
  } = useRecipeList();

  const backToListHandler = () => {
    router.push(listHref, { scroll: false });
  };

  if (recipeIsLoading || !recipe) {
    return <RecipeDetailsLoading />;
  }

  return (
    <RecipeDetailsShell
      header={
        <RecipeHeader
          diets={recipe.diets}
          image={recipe.image}
          showBackButton={hasRecipesPerPage}
          title={recipe.title}
          onBack={backToListHandler}
        />
      }
    >
      <RecipeDetails recipe={recipe} recipeId={recipeId} />
    </RecipeDetailsShell>
  );
};

export default RecipeDetailsPage;
