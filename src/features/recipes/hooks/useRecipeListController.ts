import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  selectHasRecipesPerPage,
  selectRecipeCurrentPage,
  selectRecipeEmptyMessage,
  selectRecipeErrorMessage,
  selectRecipeIsLastPage,
  selectRecipeIsLoading,
  selectRecipeOptions,
  selectRecipesPerPage,
} from "../store/recipesSelectors";
import { recipeActions } from "../store/recipesSlice";
import { nextPage, prevPage, sortRecipes } from "../store/recipesThunks";
import type { AppDispatch } from "../../../app/store";
import type { ChangeEvent } from "react";
import type { CollectionReference, DocumentData } from "firebase/firestore";
import type {
  RecipeFilter,
  RecipeSortDirection,
  RecipeSortKey,
} from "../types";

interface RecipeListControllerOptions {
  firebaseRef: CollectionReference<DocumentData>;
  filter?: RecipeFilter;
}

export const useRecipeListController = ({
  firebaseRef,
  filter,
}: RecipeListControllerOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  const { recipeId } = useParams<{ recipeId?: string }>() ?? {};
  const recipes = useSelector(selectRecipesPerPage);
  const hasRecipes = useSelector(selectHasRecipesPerPage);
  const currentPage = useSelector(selectRecipeCurrentPage);
  const isLastPage = useSelector(selectRecipeIsLastPage);
  const isLoading = useSelector(selectRecipeIsLoading);
  const options = useSelector(selectRecipeOptions);
  const emptyMessage = useSelector(selectRecipeEmptyMessage);
  const errorMessage = useSelector(selectRecipeErrorMessage);

  const goToNextPage = () => {
    dispatch(nextPage(firebaseRef, filter));
  };

  const goToPreviousPage = () => {
    dispatch(prevPage(firebaseRef, filter));
  };

  const sortBySelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortType] = event.target.value.split("-");

    dispatch(
      recipeActions.setOrderBy({
        sortBy: sortBy as RecipeSortKey,
        sortType: sortType as RecipeSortDirection,
      }),
    );
    dispatch(sortRecipes(firebaseRef, filter));
  };

  return {
    actions: {
      goToNextPage,
      goToPreviousPage,
      sortBySelection,
    },
    list: {
      currentPage,
      emptyMessage,
      errorMessage,
      hasRecipes,
      isLastPage,
      isLoading,
      isRecipeOpen: Boolean(recipeId),
      options,
      recipes,
    },
  };
};
