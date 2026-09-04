"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import RecipeDetails from "../../components/RecipeDetails/RecipeDetails";
import RecipeDetailsLoading from "../../components/RecipeDetailsLoading/RecipeDetailsLoading";
import RecipeDetailsShell from "../../components/RecipeDetailsShell/RecipeDetailsShell";
import RecipeHeader from "../../components/RecipeHeader/RecipeHeader";
import { useRecipeDetails } from "../../hooks/useRecipeDetails";
import { selectHasRecipesPerPage } from "../../store/recipesSelectors";

const RecipeDetailsPage = () => {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { recipeId } = useParams<{ recipeId: string }>() ?? { recipeId: "" };
  const { isLoading: recipeIsLoading, recipe } = useRecipeDetails(recipeId);
  const hasRecipesPerPage = useSelector(selectHasRecipesPerPage);

  const backToListHandler = () => {
    router.push(pathname.startsWith("/favorites") ? "/favorites" : "/");
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
