import "server-only";
import { z } from "zod";
import {
  INCLUDE_NUTRITION,
  INCLUDE_SEARCH_NUTRITION,
  RESULT_NUM,
} from "../../../shared/constants/app";
import { RecipeHttpError, requestRecipeJson } from "../api/requestRecipeJson";
import {
  favoriteRecipesResponseSchema,
  favoriteRecipesSchema,
  recipeDetailsSchema,
  recipeIdSchema,
  recipeSearchResponseSchema,
  recipeSearchSchema,
} from "./recipeSchemas";

const environmentSchema = z.object({
  url: z.url({ protocol: /^https$/ }),
  key: z.string().min(1),
});

const requestSpoonacular = async <Data>(
  path: string,
  parameters: Record<string, string | number | boolean>,
  schema: z.ZodType<Data>,
) => {
  const environment = environmentSchema.safeParse({
    url: process.env.SPOONACULAR_API_URL,
    key: process.env.SPOONACULAR_API_KEY,
  });
  if (!environment.success) throw new RecipeHttpError(500);

  const url = new URL(`${environment.data.url.replace(/\/$/, "")}${path}`);
  url.searchParams.set("apiKey", environment.data.key);
  for (const [name, value] of Object.entries(parameters)) {
    url.searchParams.set(name, String(value));
  }

  const data = await requestRecipeJson<unknown>(url.toString(), {
    cache: "no-store",
    redirect: "error",
  });
  const result = schema.safeParse(data);
  // Provider schema failures are upstream errors, not invalid user input.
  if (!result.success) throw new RecipeHttpError(502);
  return result.data;
};

export const searchRecipes = (input: unknown) => {
  const { intolerance, ...filters } = recipeSearchSchema.parse(input);
  const parameters: Record<string, string | number | boolean> = {
    number: RESULT_NUM,
    addRecipeNutrition: INCLUDE_SEARCH_NUTRITION,
  };
  for (const [name, value] of Object.entries(filters)) {
    if (value) parameters[name] = value;
  }
  if (intolerance) parameters.intolerances = intolerance;

  return requestSpoonacular(
    "/recipes/complexSearch",
    parameters,
    recipeSearchResponseSchema,
  );
};

export const getFavoriteRecipes = (input: unknown) => {
  const { ids } = favoriteRecipesSchema.parse(input);
  return requestSpoonacular(
    "/recipes/informationBulk",
    {
      ids: ids.join(","),
      includeNutrition: INCLUDE_SEARCH_NUTRITION,
    },
    favoriteRecipesResponseSchema,
  );
};

export const getRecipeDetails = (recipeId: string) => {
  const id = recipeIdSchema.parse(recipeId);
  return requestSpoonacular(
    `/recipes/${id}/information`,
    {
      includeNutrition: INCLUDE_NUTRITION,
    },
    recipeDetailsSchema,
  );
};
