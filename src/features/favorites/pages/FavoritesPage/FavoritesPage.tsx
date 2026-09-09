"use client";

import RecipeList from "../../../recipes/components/RecipeList/RecipeList";
import classes from "./FavoritesPage.module.scss";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../../../../shared/constants";
import { useFavoriteRecipes } from "../../hooks/useFavoriteRecipes";
import { useRecipeListController } from "../../../recipes/hooks/useRecipeListController";
import { RecipeListContext } from "../../../recipes/context/RecipeListContext";
import type { PropsWithChildren } from "react";

const FavoritesPage = ({ children }: PropsWithChildren) => {
  const { favoriteIds, favoritesReference, filter, isAuthenticated } =
    useFavoriteRecipes();
  const controller = useRecipeListController({
    firebaseRef: favoritesReference,
    filter,
  });
  const { recipeId } = useParams<{ recipeId?: string }>() ?? {};
  const recipeIsOpen = !!recipeId;

  return (
    <RecipeListContext value={controller}>
      <motion.div
        initial={ANIMATION_SLIDE_IN_INITIAL}
        animate={ANIMATION_SLIDE_IN}
        className={`${classes["section-favorites"]} ${
          recipeIsOpen ? classes["recipe-columns"] : ""
        }`}
      >
        {isAuthenticated && (
          <RecipeList
            title="Favorites"
            skeletonItemsAmount={favoriteIds.length}
          />
        )}

        {children}
      </motion.div>
    </RecipeListContext>
  );
};

export default FavoritesPage;
