import classes from "./RecipesPage.module.scss";
import SearchBox from "../../../search/components/SearchBox/SearchBox";
import Logo from "../../../../app/layout/Logo/Logo";
import { useEffect, useState } from "react";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../../../../shared/constants";
import { lazy } from "react";
import { Suspense } from "react";
import Spinner from "../../../../shared/components/ui/Spinner/Spinner";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { recipeActions, getRecipes } from "../../store/recipesSlice";
import ErrorMessage from "../../../../shared/components/feedback/ErrorMessage/ErrorMessage";
import Card from "../../../../shared/components/ui/Card/Card";
import { AnimatePresence, motion } from "framer-motion";
import { buildRecipeSearchUrl } from "../../api/recipeUrls";
import {
  createRecipeResultsLimit,
  getRecipesCollection,
} from "../../api/recipeRepository";

const RecipeList = lazy(() =>
  import("../../components/RecipeList/RecipeList")
);

const recipeRef = getRecipesCollection();

const RecipesPage = () => {
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
  const shouldShowLogo =
    recipesPerPageIsEmpty &&
    !recipesIsLoading &&
    !recipeIsOpen &&
    !errorMessage &&
    !emptyMessage;
  const shouldShowRecipeList =
    recipesIsLoading || !recipesPerPageIsEmpty || emptyMessage;
  const searchSectionClassName = `${classes["section-search"]} ${
    !recipesPerPageIsEmpty || recipesIsLoading || recipeIsOpen
      ? classes.mt0
      : ""
  }`;
  const contentSectionClassName = `${classes["section-content"]} ${
    recipeIsOpen && !recipesPerPageIsEmpty ? classes["recipe-columns"] : ""
  }`;

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

    const requestUrl = buildRecipeSearchUrl(data);

    const searchTitle = query || "Search result";
    const emptyMessage = `No results for "${query}". Try checking your spelling`;
    const resultsAmount = createRecipeResultsLimit();

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
        className={searchSectionClassName}
      >
        <AnimatePresence>{shouldShowLogo && <Logo />}</AnimatePresence>
        <SearchBox getFormData={getFormDataHandler} />
      </section>
      {errorMessage && (
        <Card>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </Card>
      )}
      <section className={contentSectionClassName}>
        {shouldShowRecipeList && (
          <Suspense fallback={<Spinner />}>
            <RecipeList title={title} firebaseRef={recipeRef} />
          </Suspense>
        )}

        <Outlet />
      </section>
    </motion.div>
  );
};

export default RecipesPage;
