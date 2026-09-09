import { createContext, useContext } from "react";
import type { RecipeListController } from "../types";

export const RecipeListContext = createContext<RecipeListController | null>(
  null,
);

export const useRecipeList = () => {
  const controller = useContext(RecipeListContext);
  if (!controller) throw new Error("Recipe list context is required");
  return controller;
};
