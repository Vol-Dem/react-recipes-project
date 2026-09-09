import {
  SEARCH_FILTER_KEYS,
  INVALID_SEARCH_MESSAGE,
} from "../constants/search";
import { recipeSearchSchema } from "../schemas/recipeSearchSchema";
import type { SearchFilters } from "../types";

type SearchParameters = Pick<URLSearchParams, "has" | "get">;

export const parseRecipeSearchParams = (
  params: SearchParameters | null,
): {
  filters: SearchFilters | null;
  errorMessage: string;
} => {
  if (!params || !SEARCH_FILTER_KEYS.some((key) => params.has(key))) {
    return { filters: null, errorMessage: "" };
  }
  const values = Object.fromEntries(
    SEARCH_FILTER_KEYS.filter((key) => params.has(key)).map((key) => [
      key,
      params.get(key),
    ]),
  );
  const result = recipeSearchSchema.safeParse(values);
  return result.success
    ? { filters: result.data, errorMessage: "" }
    : { filters: null, errorMessage: INVALID_SEARCH_MESSAGE };
};

export const buildRecipeSearchHref = (filters: SearchFilters) => {
  // An empty query marks an intentional unfiltered search, unlike the landing page.
  const params = new URLSearchParams({ query: filters.query ?? "" });
  for (const key of SEARCH_FILTER_KEYS) {
    const value = filters[key];
    if (value) params.set(key, value);
  }
  return `/?${params}`;
};

export const buildRecipeDetailsHref = (
  id: string | number,
  listHref: string,
) => {
  const [path, params] = listHref.split("?");
  const base = path === "/favorites" ? "/favorites/recipe" : "/recipe";
  return `${base}/${encodeURIComponent(id)}${params ? `?${params}` : ""}`;
};
