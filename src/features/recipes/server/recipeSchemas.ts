import { z } from "zod";
import type { RecipeApiItem, RecipeDetails } from "../types";

export const recipeIdSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .refine((value) => Number.isSafeInteger(Number(value)));

export { recipeSearchSchema } from "../schemas/recipeSearchSchema";

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
