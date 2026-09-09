import { z } from "zod";

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
