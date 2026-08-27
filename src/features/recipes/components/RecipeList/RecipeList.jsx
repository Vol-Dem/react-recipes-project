import classes from "./RecipeList.module.scss";
import Card from "../../../../shared/components/ui/Card/Card";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  nextPage,
  prevPage,
  recipeActions,
  sortRecipes,
} from "../../store/recipesSlice";
import ErrorMessage from "../../../../shared/components/feedback/ErrorMessage/ErrorMessage";
import { motion } from "framer-motion";
import RecipeCards from "../RecipeCards/RecipeCards";
import RecipePagination from "../RecipePagination/RecipePagination";
import RecipeResultsHeader from "../RecipeResultsHeader/RecipeResultsHeader";

const RecipeList = ({
  title,
  firebaseRef,
  filter,
  skeletonItemsAmount,
}) => {
  const dispatch = useDispatch();
  const { recipeId } = useParams();
  const recipeIsOpen = !!recipeId;
  const recipesPerPage = useSelector((state) => state.recipe.recipesPerPage);
  const recipesPerPageIsNotEmpty = !!recipesPerPage.length;
  const currentPage = useSelector((state) => state.recipe.currentPage);
  const isLastPage = useSelector((state) => state.recipe.isLastPage);
  const recipesIsLoading = useSelector(
    (state) => state.recipe.recipesIsLoading
  );
  const options = useSelector((state) => state.recipe.options);
  const emptyMessage = useSelector((state) => state.recipe.emptyMessage);
  const errorMessage = useSelector((state) => state.recipe.errorMessage);

  const nextPageHandler = () => {
    dispatch(nextPage(firebaseRef, filter));
  };

  const prevPageHandler = () => {
    dispatch(prevPage(firebaseRef, filter));
  };

  const sortHandler = (e) => {
    const sort = e.target.value;
    const [sortBy, sortType] = sort.split("-");
    dispatch(recipeActions.setOrderBy({ sortBy, sortType }));
    dispatch(sortRecipes(firebaseRef, filter));
  };

  if (errorMessage) {
    return (
      <Card>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      className={classes["search-result__container"]}
      data-testid="recipe-item-list"
    >
      <div
        className={`${classes["search-result"]} ${
          recipeIsOpen ? classes["hidden-md"] : ""
        }`}
      >
        <Card>
          {!recipesPerPageIsNotEmpty && !recipesIsLoading && (
            <p className={classes["search-result__empty"]}>{emptyMessage}</p>
          )}

          {(recipesPerPageIsNotEmpty || recipesIsLoading) && (
            <RecipeResultsHeader
              options={options}
              showTitle={!recipeIsOpen}
              title={title}
              onSort={sortHandler}
            />
          )}
          <RecipeCards
            isLoading={recipesIsLoading}
            isRecipeOpen={recipeIsOpen}
            recipes={recipesPerPage}
            skeletonItemsAmount={skeletonItemsAmount}
          />

          {recipesPerPageIsNotEmpty && (
            <RecipePagination
              currentPage={currentPage}
              isLastPage={isLastPage}
              isLoading={recipesIsLoading}
              onNextPage={nextPageHandler}
              onPreviousPage={prevPageHandler}
            />
          )}
        </Card>
      </div>
    </motion.div>
  );
};
export default RecipeList;
