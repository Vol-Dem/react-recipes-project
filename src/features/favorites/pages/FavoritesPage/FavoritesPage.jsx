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

const FavoritesPage = ({ children }) => {
  const { favoriteIds, favoritesReference, filter, isAuthenticated } =
    useFavoriteRecipes();
  const { recipeId } = useParams();
  const recipeIsOpen = !!recipeId;

  return (
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
          firebaseRef={favoritesReference}
          filter={filter}
          skeletonItemsAmount={favoriteIds.length}
        />
      )}

      {children}
    </motion.div>
  );
};

export default FavoritesPage;
