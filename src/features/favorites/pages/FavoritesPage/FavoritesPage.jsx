import RecipeList from "../../../recipes/components/RecipeList/RecipeList";
import classes from "./FavoritesPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { collection, getFirestore, limit, where } from "firebase/firestore";
import { Outlet, useParams } from "react-router-dom";
import { getRecipes, recipeActions } from "../../../recipes/store/recipesSlice";
import firebaseApp from "../../../../config/firebase";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
  FIRESTORE_COLLECTIONS,
  MESSAGE_EMPTY_FAVORITES,
  RECIPES_PER_PAGE,
} from "../../../../shared/constants";
import { buildFavoriteRecipesUrl } from "../../../recipes/api/recipeUrls";

const firestore = getFirestore(firebaseApp);
const favRef = collection(firestore, FIRESTORE_COLLECTIONS.recipes);

const FavoritesPage = () => {
  const [filter, setFilter] = useState();
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const favList = useSelector((state) => state.fav.favList);

  const dailyLimitIsReached = useSelector(
    (state) => state.recipe.dailyLimitIsReached
  );
  const { recipeId } = useParams();
  const recipeIsOpen = !!recipeId;
  const dispatch = useDispatch();

  // Load the user's favorites.
  useEffect(() => {
    if (!favList.length) {
      dispatch(recipeActions.setEmptyMessage(MESSAGE_EMPTY_FAVORITES));
      return;
    }

    dispatch(recipeActions.setEmptyMessage(""));
    const requestUrl = buildFavoriteRecipesUrl(favList);
    const resultsAmount = limit(RECIPES_PER_PAGE + 1);
    const filter = where("id", "in", favList);
    setFilter(filter);

    dispatch(recipeActions.setCurrentPage(1));
    dispatch(
      getRecipes({
        requestUrl,
        firebaseRef: favRef,
        filter,
        resultsAmount,
      })
    );

    return () => {
      // Reset the current recipe data and sort order when the component unmounts.
      dispatch(recipeActions.setOrderBy([]));
      dispatch(recipeActions.resetRecipes());
      dispatch(recipeActions.setEmptyMessage(""));
    };
  }, [favList, dispatch, dailyLimitIsReached]);

  return (
    <motion.div
      initial={ANIMATION_SLIDE_IN_INITIAL}
      animate={ANIMATION_SLIDE_IN}
      className={`${classes["section-favorites"]} ${
        recipeIsOpen ? classes["recipe-columns"] : ""
      }`}
    >
      {isAuth && (
        <RecipeList
          title="Favorites"
          firebaseRef={favRef}
          filter={filter}
          skeletonItemsAmount={favList?.length}
        />
      )}

      <Outlet />
    </motion.div>
  );
};

export default FavoritesPage;
