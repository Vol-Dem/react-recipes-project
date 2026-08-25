import classes from "./Homepage.module.scss";
import SearchBox from "../components/search/SearchBox";
import Logo from "../components/layout/logo/Logo";
import { useEffect, useState } from "react";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
  FIRESTORE_COLLECTIONS,
  INCLUDE_SEARCH_NUTRITION,
  RESULT_NUM,
  RECIPES_PER_PAGE,
  SPOONACULAR_API_KEY,
  SPOONACULAR_API_URL,
} from "../constants";
import { lazy } from "react";
import { Suspense } from "react";
import Spinner from "../components/ui/Spinner";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { recipeActions, getRecipes } from "../store/recipe";
import { collection, getFirestore, limit } from "firebase/firestore";
import firebaseApp from "../config";
import ErrorMessage from "../components/ui/ErrorMessage";
import Card from "../components/ui/Card";
import { AnimatePresence, motion } from "framer-motion";

const RecipeItemList = lazy(() =>
  import("../components/recipe/recipe-item-list/RecipeItemList")
);

const firestore = getFirestore(firebaseApp);
const recipeRef = collection(firestore, FIRESTORE_COLLECTIONS.recipes);

const Homepage = () => {
  const [title, setTitle] = useState("Search result");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { recipeId } = useParams();
  const recipeIsOpen = !!recipeId;
  const errorMessage = useSelector((state) => state.recipe.errorMessage);
  const emptyMessage = useSelector((state) => state.recipe.emptyMessage);
  const recipesIsLoading = useSelector(
    (state) => state.recipe.recipesIsLoading
  );
  const recipesPerPageIsEmpty = !useSelector(
    (state) => state.recipe.recipesPerPage
  ).length;

  /**
   * Creates a request URL from form data, dispatches actions to fetch recipes, and redirects to `/`.
   * @param {Object} data - Form data for fetch request
   */
  const getFormDataHandler = (data) => {
    const query = data.query || "";
    const cuisine = data.cuisine || "";
    const diet = data.diet || "";
    const intolerance = data.intolerance || "";
    const type = data.type || "";
    const maxReadyTime = data.maxReadyTime || "";
    const minCalories = data.minCalories || "";
    const maxCalories = data.maxCalories || "";

    const requestUrl = `${SPOONACULAR_API_URL}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${query}&cuisine=${cuisine}&diet=${diet}&intolerances=${intolerance}&type=${type}${
      maxReadyTime && `&maxReadyTime=${maxReadyTime}`
    }${minCalories && `&minCalories=${minCalories}`}${
      maxCalories && `&maxCalories=${maxCalories}`
    }&number=${RESULT_NUM}&addRecipeNutrition=${INCLUDE_SEARCH_NUTRITION}`;

    const searchTitle = query || "Search result";
    const emptyMessage = `No results for "${query}". Try checking your spelling`;
    const resultsAmount = limit(RECIPES_PER_PAGE + 1);

    setTitle(searchTitle);
    dispatch(
      recipeActions.setOptions(
        [cuisine, diet, intolerance, type].filter(Boolean)
      )
    );
    dispatch(recipeActions.setEmptyMessage(emptyMessage));
    dispatch(recipeActions.setOrderBy([]));
    dispatch(recipeActions.setCurrentPage(1));
    dispatch(getRecipes({ requestUrl, firebaseRef: recipeRef, resultsAmount }));
    navigate("/");
  };

  useEffect(() => {
    return () => {
      // Reset the current recipe data and sort order when the component unmounts.
      dispatch(recipeActions.resetRecipes());
      dispatch(recipeActions.setOrderBy([]));
      dispatch(recipeActions.setErrorMessage(""));
      dispatch(recipeActions.setEmptyMessage(""));
      dispatch(recipeActions.setOptions([]));
    };
  }, [dispatch]);

  return (
    <motion.div
      initial={ANIMATION_SLIDE_IN_INITIAL}
      animate={ANIMATION_SLIDE_IN}
    >
      <section
        data-testid="section-search"
        className={`${classes["section-search"]} ${
          !recipesPerPageIsEmpty || recipesIsLoading || recipeIsOpen
            ? classes.mt0
            : ""
        }`}
      >
        <AnimatePresence>
          {recipesPerPageIsEmpty &&
            !recipesIsLoading &&
            !recipeIsOpen &&
            !errorMessage &&
            !emptyMessage && <Logo />}
        </AnimatePresence>
        <SearchBox getFormData={getFormDataHandler} />
      </section>
      {errorMessage && (
        <Card>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </Card>
      )}
      <section
        className={`${classes["section-content"]} ${
          recipeIsOpen && !recipesPerPageIsEmpty
            ? classes["recipe-columns"]
            : ""
        }`}
      >
        {(recipesIsLoading || !recipesPerPageIsEmpty || emptyMessage) && (
          <Suspense fallback={<Spinner />}>
            <RecipeItemList title={title} firebaseRef={recipeRef} />
          </Suspense>
        )}

        <Outlet />
      </section>
    </motion.div>
  );
};

export default Homepage;
