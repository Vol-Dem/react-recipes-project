import type { QueryConstraint } from "firebase/firestore";

export interface Nutrient {
  name: string;
  amount: number;
  unit?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeSummary {
  id: number;
  title: string;
  img: string;
  readyInMinutes: number;
  calories: number;
  servings: number;
}

export interface RecipeDetails {
  id?: number;
  title: string;
  image: string;
  diets: string[];
  readyInMinutes: number;
  servings: number;
  extendedIngredients: Ingredient[];
  instructions: string;
  nutrition: { nutrients: Nutrient[] };
  creditsText: string;
  sourceName: string;
  sourceUrl: string;
}

export interface RecipeApiItem {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  nutrition: { nutrients: Nutrient[] };
}

export interface RecipeSearchResponse {
  results: RecipeApiItem[];
}

export type RecipeApiResponse = RecipeSearchResponse | RecipeApiItem[];

export interface SearchFilters {
  query?: string;
  cuisine?: string;
  diet?: string;
  intolerance?: string;
  type?: string;
  maxReadyTime?: string;
  minCalories?: string;
  maxCalories?: string;
}

export type RecipeSortKey = "calories" | "readyInMinutes";
export type RecipeSortDirection = "asc" | "desc";

export interface RecipeSort {
  sortBy?: RecipeSortKey;
  sortType?: RecipeSortDirection;
}

export interface RecipeState {
  searchResult: RecipeSummary[];
  orderBy: RecipeSort;
  recipesIsLoading: boolean;
  currentPage: number;
  isLastPage: boolean;
  dailyLimitIsReached: boolean;
  title: string;
  options: string[];
  emptyMessage: string;
  errorMessage: string;
}

export type RecipeFilter = QueryConstraint | undefined;
