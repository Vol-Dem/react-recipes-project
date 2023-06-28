import RecipeItemList from "../components/recipe/recipe-item-list/RecipeItemList";
import classes from "./Favorites.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { collection, getFirestore, limit, where } from "firebase/firestore";
import { Outlet, useParams } from "react-router-dom";
import { getRecipes, recipeActions } from "../store/recipe";
import firebaseApp from "../config";
import { useState } from "react";

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
  const title = "Favorites";
  const emptyMessage = "Your fav list is empty";

  useEffect(() => {
    if (!favList.length) {
      return;
    }

    const favListQuery = favList.join(",");
    const requestUrl = `https://api.spoonacular.com/recipes/informationBulk?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&ids=${favListQuery}&includeNutrition=true`;
    const resultsAmount = limit(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1);
    const filter = where("id", "in", favList);
    setFilter(filter);

    dispatch(recipeActions.setTitle(title));
    dispatch(recipeActions.setEmptyMessage(emptyMessage));
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
      dispatch(recipeActions.setOrderBy([]));
      dispatch(recipeActions.resetRecipes());
    };
  }, [favList, dispatch, dailyLimitIsReached]);

  return (
    <section
      className={`${classes["section-favorites"]} ${
        recipeIsOpen ? classes["recipe-columns"] : ""
      }`}
    >
      {isAuth && <RecipeItemList firebaseRef={favRef} filter={filter} />}

      <Outlet />
    </section>
  );
};

export default Favorites;
