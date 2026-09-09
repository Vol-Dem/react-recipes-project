import { useState, type ChangeEvent } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { buildRecipeSearchUrl } from "../api/recipeUrls";
import {
  fallbackRecipeSearchQueryOptions,
  recipeSearchQueryOptions,
} from "../queries/recipeSearchQuery";
import { selectRecipeDailyLimitIsReached } from "../store/recipesSelectors";
import { getRecipeErrorMessage } from "../utils/recipeErrors";
import { paginateRecipes } from "../utils/paginateRecipes";
import { sortRecipeCollection } from "../utils/sortRecipes";
import { useRecipeApiFallback } from "./useRecipeApiFallback";
import type {
  RecipeListController,
  RecipeSort,
  RecipeSortDirection,
  RecipeSortKey,
  SearchFilters,
} from "../types";

export const useRecipeSearch = () => {
  const [filters, setFilters] = useState<SearchFilters | null>(null);
  const [order, setOrder] = useState<RecipeSort>({});
  const dailyLimitIsReached = useSelector(selectRecipeDailyLimitIsReached);
  const [pagination, setPagination] = useState({
    fallback: dailyLimitIsReached,
    page: 1,
  });
  // Switching data sources starts at page one, not at an API-only page number.
  const currentPage =
    pagination.fallback === dailyLimitIsReached ? pagination.page : 1;
  const router = useRouter();
  const { recipeId } = useParams<{ recipeId?: string }>() ?? {};
  const requestUrl = buildRecipeSearchUrl(filters ?? {});
  const hasSearch = filters !== null;
  const apiQuery = useQuery({
    ...recipeSearchQueryOptions(requestUrl),
    enabled: hasSearch && !dailyLimitIsReached,
  });
  const fallbackQuery = useInfiniteQuery({
    ...fallbackRecipeSearchQueryOptions(requestUrl, order),
    enabled: hasSearch && dailyLimitIsReached,
  });
  const shouldUseFallback = useRecipeApiFallback(
    hasSearch ? apiQuery.error : null,
  );
  const activeQuery = dailyLimitIsReached ? fallbackQuery : apiQuery;
  const isLoading =
    hasSearch &&
    (activeQuery.isPending || activeQuery.isFetching || shouldUseFallback);
  const errorMessage =
    hasSearch && activeQuery.error && !shouldUseFallback
      ? getRecipeErrorMessage(activeQuery.error)
      : "";

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
  const recipes = hasSearch ? (page?.recipes ?? []) : [];
  const isLastPage = page?.isLastPage ?? true;
  const setPage = (page: number) =>
    setPagination({ fallback: dailyLimitIsReached, page });

  const submitSearch = (searchFilters: SearchFilters) => {
    // A repeated failed search is the existing retry interaction.
    if (
      buildRecipeSearchUrl(searchFilters) === requestUrl &&
      activeQuery.isError
    ) {
      if (!dailyLimitIsReached || !order.sortBy) void activeQuery.refetch();
    }
    setFilters(searchFilters);
    setOrder({});
    setPage(1);
    router.push("/");
  };

  const goToNextPage = () => {
    if (isLoading || isLastPage) return;
    setPage(currentPage + 1);
    if (
      dailyLimitIsReached &&
      currentPage >= (fallbackQuery.data?.pages.length ?? 0)
    ) {
      void fallbackQuery.fetchNextPage();
    }
  };

  const goToPreviousPage = () => {
    if (!isLoading && currentPage > 1) setPage(currentPage - 1);
  };

  const sortBySelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortType] = event.target.value.split("-");
    setOrder(
      sortBy && sortType
        ? {
            sortBy: sortBy as RecipeSortKey,
            sortType: sortType as RecipeSortDirection,
          }
        : {},
    );
    setPage(1);
  };

  const controller: RecipeListController = {
    actions: { goToNextPage, goToPreviousPage, sortBySelection },
    list: {
      currentPage,
      emptyMessage:
        hasSearch && !isLoading && !errorMessage && !recipes.length
          ? `No results for "${filters.query ?? ""}". Try checking your spelling`
          : "",
      errorMessage,
      hasRecipes: recipes.length > 0,
      isLastPage,
      isLoading,
      isRecipeOpen: Boolean(recipeId),
      options: [
        filters?.cuisine,
        filters?.diet,
        filters?.intolerance,
        filters?.type,
      ].filter((option): option is string => Boolean(option)),
      recipes,
      sortValue:
        order.sortBy && order.sortType
          ? `${order.sortBy}-${order.sortType}`
          : "-",
    },
  };

  return {
    controller,
    searchTitle: filters?.query || "Search result",
    submitSearch,
  };
};
