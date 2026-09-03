import { notificationActions } from "../../notifications/store/notificationSlice";
import { fetchRecipesFromApi } from "../api/recipeApi";
import {
  createNextPageRequest,
  createPreviousPageRequest,
  createRecipeResultsLimit,
  fetchRecipesFromFirestore,
  getRecipesCollection,
} from "../api/recipeRepository";
import { RECIPE_DAILY_LIMIT_NOTIFICATION } from "../constants/messages";
import { mapRecipe } from "../utils/mapRecipe";
import {
  getRecipeErrorMessage,
  isRecipeApiLimitError,
} from "../utils/recipeErrors";
import { selectRecipeState } from "./recipesSelectors";
import { recipeActions } from "./recipesSlice";
import type { AppThunk } from "../../../app/store";
import type {
  CollectionReference,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import type { RecipeApiItem, RecipeFilter } from "../types";

interface GetRecipesRequest {
  requestUrl?: string;
  firebaseRef?: CollectionReference<DocumentData>;
  filter?: RecipeFilter;
  position?: QueryConstraint;
  resultsAmount?: QueryConstraint;
}

export const getRecipes = ({
  requestUrl,
  firebaseRef,
  filter,
  position,
  resultsAmount,
}: GetRecipesRequest): AppThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    const { dailyLimitIsReached } = selectRecipeState(getState());

    if (dailyLimitIsReached) {
      dispatch(recipeActions.setIsLastPage(false));
    }
    dispatch(recipeActions.setRecipesIsLoading(true));

    try {
      let recipesData: RecipeApiItem[];

      if (!dailyLimitIsReached) {
        if (!requestUrl) {
          throw new Error("A recipe API URL is required");
        }

        const searchResult = await fetchRecipesFromApi(requestUrl);
        recipesData = Array.isArray(searchResult)
          ? searchResult
          : searchResult.results;
      } else {
        const { sortBy, sortType } = selectRecipeState(getState()).orderBy;
        const firestoreResult = await fetchRecipesFromFirestore({
          queryParameters: [
            firebaseRef ?? getRecipesCollection(),
            filter,
            resultsAmount,
          ],
          position,
          sortBy,
          sortType,
        });

        dispatch(recipeActions.setIsLastPage(firestoreResult.isLastPage));
        recipesData = firestoreResult.recipes;
      }

      const recipes = recipesData.map(mapRecipe);

      dispatch(recipeActions.setSearchResult(recipes));
      dispatch(recipeActions.setRecipesIsLoading(false));
    } catch (error) {
      if (isRecipeApiLimitError(error)) {
        dispatch(recipeActions.setDailyLimitIsReached());
        dispatch(
          notificationActions.showNotification(RECIPE_DAILY_LIMIT_NOTIFICATION),
        );
        await dispatch(
          getRecipes({
            requestUrl,
            firebaseRef,
            filter,
            position,
            resultsAmount,
          }),
        );
        return;
      }

      dispatch(recipeActions.setErrorMessage(getRecipeErrorMessage(error)));
      dispatch(recipeActions.setRecipesIsLoading(false));
    }
  };
};

export const nextPage = (
  firebaseRef: CollectionReference<DocumentData>,
  filter?: RecipeFilter,
): AppThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    const { currentPage, dailyLimitIsReached } = selectRecipeState(getState());

    dispatch(recipeActions.setCurrentPage(currentPage + 1));

    if (!dailyLimitIsReached) {
      return;
    }

    const { position, resultsAmount } = createNextPageRequest();
    dispatch(getRecipes({ firebaseRef, filter, resultsAmount, position }));
  };
};

export const prevPage = (
  firebaseRef: CollectionReference<DocumentData>,
  filter?: RecipeFilter,
): AppThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    const { currentPage, dailyLimitIsReached } = selectRecipeState(getState());

    dispatch(recipeActions.setCurrentPage(currentPage - 1));

    if (!dailyLimitIsReached) {
      return;
    }

    const { position, resultsAmount } = createPreviousPageRequest();
    dispatch(getRecipes({ firebaseRef, filter, resultsAmount, position }));
  };
};

export const sortRecipes = (
  firebaseRef: CollectionReference<DocumentData>,
  filter?: RecipeFilter,
): AppThunk => {
  return (dispatch, getState) => {
    dispatch(recipeActions.setCurrentPage(1));

    const { dailyLimitIsReached } = selectRecipeState(getState());

    if (!dailyLimitIsReached) {
      return;
    }

    dispatch(
      getRecipes({
        firebaseRef,
        filter,
        resultsAmount: createRecipeResultsLimit(),
      }),
    );
  };
};
