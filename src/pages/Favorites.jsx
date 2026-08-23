import RecipeItemList from "../components/recipe/recipe-item-list/RecipeItemList";
import classes from "./Favorites.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { collection, getFirestore, limit, where } from "firebase/firestore";
import { Outlet, useParams } from "react-router-dom";
import { getRecipes, recipeActions } from "../store/recipe";
import firebaseApp from "../config";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ANIMATIONS_FM_SLIDEIN,
  ANIMATIONS_FM_SLIDEIN_INITIAL,
  MESSAGE_EMPTY_FAV,
} from "../variables/constants";

const firestore = getFirestore(firebaseApp);
const favRef = collection(firestore, "recipes");

const Favorites = () => {
  const [filter, setFilter] = useState();
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const favList = useSelector((state) => state.fav.favList);

  const dailyLimitIsReached = useSelector(
    (state) => state.recipe.dailyLimitIsReached
  );
  const { recipeId } = useParams();
  const recipeIsOpen = !!recipeId;
  const dispatch = useDispatch();
  // const title = "Favorites";

  //Load user favorites
  useEffect(() => {
    if (!favList.length) {
      dispatch(recipeActions.setEmptyMessage(MESSAGE_EMPTY_FAV));
      return;
    }

    dispatch(recipeActions.setEmptyMessage(""));
    const favListQuery = favList.join(",");
    const requestUrl = `https://api.spoonacular.com/recipes/informationBulk?apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}&ids=${favListQuery}&includeNutrition=true`;
    const resultsAmount = limit(+import.meta.env.VITE_AMOUNT_PER_PAGE + 1);
    const filter = where("id", "in", favList);
    setFilter(filter);

    // dispatch(recipeActions.setTitle(title));
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
      //Reset current recipes data and sort order when component is unmounted
      dispatch(recipeActions.setOrderBy([]));
      dispatch(recipeActions.resetRecipes());
      dispatch(recipeActions.setEmptyMessage(""));
    };
  }, [favList, dispatch, dailyLimitIsReached]);

  return (
    <motion.div
      initial={ANIMATIONS_FM_SLIDEIN_INITIAL}
      animate={ANIMATIONS_FM_SLIDEIN}
      className={`${classes["section-favorites"]} ${
        recipeIsOpen ? classes["recipe-columns"] : ""
      }`}
    >
      {isAuth && (
        <RecipeItemList
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

export default Favorites;
