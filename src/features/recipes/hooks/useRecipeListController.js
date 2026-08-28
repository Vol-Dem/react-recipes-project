import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
import {
  nextPage,
  prevPage,
  sortRecipes,
} from "../store/recipesThunks";

export const useRecipeListController = ({ firebaseRef, filter }) => {
  const dispatch = useDispatch();
  const { recipeId } = useParams();
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

  const sortBySelection = (event) => {
    const [sortBy, sortType] = event.target.value.split("-");

    dispatch(recipeActions.setOrderBy({ sortBy, sortType }));
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
