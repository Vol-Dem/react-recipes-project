import { useState, type ChangeEvent } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { MESSAGE_EMPTY_FAVORITES } from "../../../shared/constants";
import {
  selectAuthIsLoggedIn,
  selectAuthUserId,
} from "../../auth/store/authSelectors";
import { selectRecipeDailyLimitIsReached } from "../../recipes/store/recipesSelectors";
import { useRecipeApiFallback } from "../../recipes/hooks/useRecipeApiFallback";
import { paginateRecipes } from "../../recipes/utils/paginateRecipes";
import { sortRecipeCollection } from "../../recipes/utils/sortRecipes";
import { getRecipeErrorMessage } from "../../recipes/utils/recipeErrors";
import {
  favoriteRecipesQueryOptions,
  fallbackFavoriteRecipesQueryOptions,
} from "../queries/favoriteRecipesQuery";
import { useFavorites } from "../context/FavoritesContext";
import type {
  RecipeListController,
  RecipeSort,
  RecipeSortKey,
  RecipeSortDirection,
} from "../../recipes/types";

/**
 * Builds the favorites list controller from shared membership and source-specific queries.
 * API results sort/page locally; Firestore results use cursor pages. Account,
 * membership, or source changes reset the displayed sort and page defaults.
 */
export const useFavoriteRecipes = () => {
  const isAuthenticated = useSelector(selectAuthIsLoggedIn);
  const userId = useSelector(selectAuthUserId);
  const {
    favoriteIds,
    isLoading: idsIsLoading,
    errorMessage: idsError,
  } = useFavorites();
  const dailyLimitIsReached = useSelector(selectRecipeDailyLimitIsReached);
  const { recipeId } = useParams<{ recipeId?: string }>() ?? {};
  const identity = JSON.stringify([userId, favoriteIds, dailyLimitIsReached]);
  const [view, setView] = useState({
    identity,
    page: 1,
    order: {} as RecipeSort,
  });
  // Account, membership, and source changes each start a new list.
  const currentPage = view.identity === identity ? view.page : 1;
  const order = view.identity === identity ? view.order : {};
  const enabled = isAuthenticated && Boolean(userId) && favoriteIds.length > 0;
  const apiQuery = useQuery({
    ...favoriteRecipesQueryOptions(userId, favoriteIds),
    enabled: enabled && !dailyLimitIsReached,
  });
  const fallbackQuery = useInfiniteQuery({
    ...fallbackFavoriteRecipesQueryOptions(userId, favoriteIds, order),
    enabled: enabled && dailyLimitIsReached,
  });
  const shouldUseFallback = useRecipeApiFallback(
    enabled ? apiQuery.error : null,
  );
  const activeQuery = dailyLimitIsReached ? fallbackQuery : apiQuery;
  const isLoading =
    idsIsLoading ||
    (enabled &&
      (activeQuery.isPending || activeQuery.isFetching || shouldUseFallback));
  const errorMessage =
    idsError ||
    (enabled && activeQuery.error && !shouldUseFallback
      ? getRecipeErrorMessage(activeQuery.error)
      : "");
  const apiRecipes = apiQuery.data ?? [];
  const sortedRecipes =
    order.sortBy && order.sortType
      ? sortRecipeCollection(apiRecipes, {
          sortBy: order.sortBy,
          sortType: order.sortType,
        })
      : apiRecipes;
  const page = dailyLimitIsReached
    ? fallbackQuery.data?.pages[currentPage - 1]
    : paginateRecipes(sortedRecipes, currentPage);
  const recipes = enabled ? (page?.recipes ?? []) : [];
  const isLastPage = page?.isLastPage ?? true;
  const setPage = (page: number) => setView({ identity, page, order });

  const goToNextPage = () => {
    if (!enabled || isLoading || isLastPage) return;
    setPage(currentPage + 1);
    if (
      dailyLimitIsReached &&
      currentPage >= (fallbackQuery.data?.pages.length ?? 0)
    ) {
      void fallbackQuery.fetchNextPage();
    }
  };
  const goToPreviousPage = () => {
    if (enabled && !isLoading && currentPage > 1) setPage(currentPage - 1);
  };
  const sortBySelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortType] = event.target.value.split("-");
    setView({
      identity,
      page: 1,
      order:
        sortBy && sortType
          ? {
              sortBy: sortBy as RecipeSortKey,
              sortType: sortType as RecipeSortDirection,
            }
          : {},
    });
  };

  const controller: RecipeListController = {
    listHref: "/favorites",
    actions: { goToNextPage, goToPreviousPage, sortBySelection },
    list: {
      currentPage,
      emptyMessage:
        !isLoading && !errorMessage && !recipes.length
          ? MESSAGE_EMPTY_FAVORITES
          : "",
      errorMessage,
      hasRecipes: recipes.length > 0,
      isLastPage,
      isLoading,
      isRecipeOpen: Boolean(recipeId),
      options: [],
      recipes,
      sortValue:
        order.sortBy && order.sortType
          ? `${order.sortBy}-${order.sortType}`
          : "-",
    },
  };

  return { favoriteIds, controller, isAuthenticated };
};
