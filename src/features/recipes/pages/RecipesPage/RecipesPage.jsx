import classes from "./RecipesPage.module.scss";
import SearchBox from "../../../search/components/SearchBox/SearchBox";
import Logo from "../../../../app/layout/Logo/Logo";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../../../../shared/constants";
import { lazy } from "react";
import { Suspense } from "react";
import Spinner from "../../../../shared/components/ui/Spinner/Spinner";
import { Outlet, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ErrorMessage from "../../../../shared/components/feedback/ErrorMessage/ErrorMessage";
import Card from "../../../../shared/components/ui/Card/Card";
import { AnimatePresence, motion } from "framer-motion";
import { useRecipeSearch } from "../../hooks/useRecipeSearch";

const RecipeList = lazy(() =>
  import("../../components/RecipeList/RecipeList")
);

const RecipesPage = () => {
  const { recipeReference, searchTitle, submitSearch } = useRecipeSearch();
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
        <SearchBox getFormData={submitSearch} />
      </section>
      {errorMessage && (
        <Card>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </Card>
      )}
      <section className={contentSectionClassName}>
        {shouldShowRecipeList && (
          <Suspense fallback={<Spinner />}>
            <RecipeList
              title={searchTitle}
              firebaseRef={recipeReference}
            />
          </Suspense>
        )}

        <Outlet />
      </section>
    </motion.div>
  );
};

export default RecipesPage;
