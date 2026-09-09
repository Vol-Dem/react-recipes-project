import { z } from "zod";
import type { RecipeApiItem, RecipeDetails } from "../types";

export const recipeIdSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .refine((value) => Number.isSafeInteger(Number(value)));

const numericFilter = (max: number) =>
  z
    .string()
    .refine(
      (value) =>
        value === "" || (/^\d+(\.\d+)?$/.test(value) && Number(value) <= max),
    )
    .optional();

const textFilter = z.string().max(500).optional();

export const recipeSearchSchema = z
  .strictObject({
    query: textFilter,
    cuisine: textFilter,
    diet: textFilter,
    intolerance: textFilter,
    type: textFilter,
    maxReadyTime: numericFilter(999),
    minCalories: numericFilter(9999),
    maxCalories: numericFilter(9999),
  })
  .refine(
    ({ minCalories, maxCalories }) =>
      !minCalories ||
      !maxCalories ||
      Number(minCalories) <= Number(maxCalories),
  );

export const favoriteRecipesSchema = z.strictObject({
  ids: z
    .string()
    .transform((value) => value.split(","))
    .pipe(z.array(recipeIdSchema).nonempty()),
});

const nutrientSchema = z.object({
  name: z.string(),
  amount: z.number(),
  unit: z.string().optional(),
});
const nutritionSchema = z.object({ nutrients: z.array(nutrientSchema) });

export const recipeItemSchema: z.ZodType<RecipeApiItem> = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  image: z
    .string()
    .nullish()
    .transform((value) => value ?? ""),
  readyInMinutes: z.number(),
  servings: z.number(),
  nutrition: nutritionSchema,
});

export const recipeSearchResponseSchema = z.object({
  results: z.array(recipeItemSchema),
});
export const favoriteRecipesResponseSchema = z.array(recipeItemSchema);

const optionalText = z
  .string()
  .nullish()
  .transform((value) => value ?? "");

export const recipeDetailsSchema: z.ZodType<RecipeDetails> = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  image: optionalText,
  diets: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
  readyInMinutes: z.number(),
  servings: z.number(),
  extendedIngredients: z
    .array(
      z.object({
        id: z
          .number()
          .nullish()
          .transform((value) => value ?? 0),
        name: z.string(),
        amount: z.number(),
        unit: optionalText,
      }),
    )
    .nullish()
    .transform((value) => value ?? []),
  instructions: optionalText,
  // Details currently request includeNutrition=false; retain the "??" UI.
  nutrition: nutritionSchema
    .nullish()
    .transform((value) => value ?? { nutrients: [] }),
  creditsText: optionalText,
  sourceName: optionalText,
  sourceUrl: optionalText,
});
