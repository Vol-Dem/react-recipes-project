import classes from "./RecipeList.module.scss";
import Card from "../../../../shared/components/ui/Card/Card";
import ErrorMessage from "../../../../shared/components/feedback/ErrorMessage/ErrorMessage";
import { motion } from "framer-motion";
import RecipeCards from "../RecipeCards/RecipeCards";
import RecipePagination from "../RecipePagination/RecipePagination";
import RecipeResultsHeader from "../RecipeResultsHeader/RecipeResultsHeader";
import {
  RECIPE_LIST_INITIAL_ANIMATION,
  RECIPE_LIST_VISIBLE_ANIMATION,
} from "../../constants/animations";
import { useRecipeListController } from "../../hooks/useRecipeListController";

const RecipeList = ({ title, firebaseRef, filter, skeletonItemsAmount }) => {
  const { actions, list } = useRecipeListController({
    firebaseRef,
    filter,
  });

  if (list.errorMessage) {
    return (
      <Card>
        <ErrorMessage>{list.errorMessage}</ErrorMessage>
      </Card>
    );
  }

  return (
    <motion.div
      initial={RECIPE_LIST_INITIAL_ANIMATION}
      animate={RECIPE_LIST_VISIBLE_ANIMATION}
      className={classes["search-result__container"]}
      data-testid="recipe-item-list"
    >
      <div
        className={`${classes["search-result"]} ${
          list.isRecipeOpen ? classes["hidden-md"] : ""
        }`}
      >
        <Card>
          {!list.hasRecipes && !list.isLoading && (
            <p className={classes["search-result__empty"]}>
              {list.emptyMessage}
            </p>
          )}

          {(list.hasRecipes || list.isLoading) && (
            <RecipeResultsHeader
              options={list.options}
              showTitle={!list.isRecipeOpen}
              title={title}
              onSort={actions.sortBySelection}
            />
          )}
          <RecipeCards
            isLoading={list.isLoading}
            isRecipeOpen={list.isRecipeOpen}
            recipes={list.recipes}
            skeletonItemsAmount={skeletonItemsAmount}
          />

          {list.hasRecipes && (
            <RecipePagination
              currentPage={list.currentPage}
              isLastPage={list.isLastPage}
              isLoading={list.isLoading}
              onNextPage={actions.goToNextPage}
              onPreviousPage={actions.goToPreviousPage}
            />
          )}
        </Card>
      </div>
    </motion.div>
  );
};
export default RecipeList;
