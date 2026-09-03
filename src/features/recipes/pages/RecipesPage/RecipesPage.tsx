"use client";

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
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import ErrorMessage from "../../../../shared/components/feedback/ErrorMessage/ErrorMessage";
import Card from "../../../../shared/components/ui/Card/Card";
import { AnimatePresence, motion } from "framer-motion";
import { useRecipeSearch } from "../../hooks/useRecipeSearch";
import {
  selectHasRecipesPerPage,
  selectRecipeEmptyMessage,
  selectRecipeErrorMessage,
  selectRecipeIsLoading,
} from "../../store/recipesSelectors";
import type { PropsWithChildren } from "react";

const RecipeList = lazy(() => import("../../components/RecipeList/RecipeList"));

const RecipesPage = ({ children }: PropsWithChildren) => {
  const { recipeReference, searchTitle, submitSearch } = useRecipeSearch();
  const { recipeId } = useParams<{ recipeId?: string }>() ?? {};
  const recipeIsOpen = !!recipeId;
  const errorMessage = useSelector(selectRecipeErrorMessage);
  const emptyMessage = useSelector(selectRecipeEmptyMessage);
  const recipesIsLoading = useSelector(selectRecipeIsLoading);
  const hasRecipesPerPage = useSelector(selectHasRecipesPerPage);
  const shouldShowLogo =
    !hasRecipesPerPage &&
    !recipesIsLoading &&
    !recipeIsOpen &&
    !errorMessage &&
    !emptyMessage;
  const shouldShowRecipeList =
    recipesIsLoading || hasRecipesPerPage || emptyMessage;
  const searchSectionClassName = `${classes["section-search"]} ${
    hasRecipesPerPage || recipesIsLoading || recipeIsOpen ? classes.mt0 : ""
  }`;
  const contentSectionClassName = `${classes["section-content"]} ${
    recipeIsOpen && hasRecipesPerPage ? classes["recipe-columns"] : ""
  }`;

  return (
    <motion.div
      initial={ANIMATION_SLIDE_IN_INITIAL}
      animate={ANIMATION_SLIDE_IN}
    >
      <section data-testid="section-search" className={searchSectionClassName}>
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
            <RecipeList title={searchTitle} firebaseRef={recipeReference} />
          </Suspense>
        )}

        {children}
      </section>
    </motion.div>
  );
};

export default RecipesPage;
