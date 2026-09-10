import type { Metadata } from "next";
import type { RecipeDetails } from "../types";

export const buildRecipeMetadata = (recipe: RecipeDetails | null): Metadata => {
  if (!recipe) return { title: "Recipe Details" };

  const description = `Make ${recipe.title}. Ready in ${recipe.readyInMinutes} minutes, serves ${recipe.servings}. View ingredients and cooking instructions.`;
  const images = recipe.image.startsWith("https://") ? [recipe.image] : [];

  return {
    title: recipe.title,
    description,
    openGraph: { title: recipe.title, description, images, type: "website" },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title: recipe.title,
      description,
      images,
    },
  };
};
