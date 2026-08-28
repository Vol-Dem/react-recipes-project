import RecipeList from "../../../recipes/components/RecipeList/RecipeList";
import classes from "./FavoritesPage.module.scss";
import { Outlet, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../../../../shared/constants";
import { useFavoriteRecipes } from "../../hooks/useFavoriteRecipes";
import { usePageSetup } from "../../../../shared/hooks/usePageSetup";

const FavoritesPage = ({ title }) => {
  usePageSetup(title);

  const {
    favoriteIds,
    favoritesReference,
    filter,
    isAuthenticated,
  } = useFavoriteRecipes();
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

      <Outlet />
    </motion.div>
  );
};

export default FavoritesPage;
