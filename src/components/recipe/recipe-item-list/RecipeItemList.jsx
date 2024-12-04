import classes from "./RecipeItemList.module.scss";
import Card from "../../ui/Card";
import RecipeItem from "../recipe-item/RecipeItem";
import Sort from "../sort/Sort";
import { ReactComponent as ArrowLeftIcon } from "./../../../assets/arrow-left.svg";
import { ReactComponent as ArrowRightIcon } from "./../../../assets/arrow-right.svg";
import RecipeItemSkeleton from "../../skeletons/RecipeItemSkeleton";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  nextPage,
  prevPage,
  recipeActions,
  sortRecipes,
} from "../../../store/recipe";
import ErrorMessage from "../../ui/ErrorMessage";
import { motion } from "framer-motion";

const RecipeItemList = ({ firebaseRef, filter, skeletonItemsAmount }) => {
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
  const title = useSelector((state) => state.recipe.title);
  const options = useSelector((state) => state.recipe.options);
  const emptyMessage = useSelector((state) => state.recipe.emptyMessage);
  const errorMessage = useSelector((state) => state.recipe.errorMessage);

  const recipes = recipesPerPage.map((recipe) => (
    <RecipeItem key={recipe.id} recipe={recipe} />
  ));

  const recipeSkeleton = [
    ...Array(
      skeletonItemsAmount || +process.env.REACT_APP_AMOUNT_PER_PAGE
    ).keys(),
  ].map((i) => <RecipeItemSkeleton key={i} />);

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
      // transition={{ duration: 0.3 }}
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
            <div className={classes["search-result__head"]}>
              {!recipeIsOpen && (
                <h1 className={classes["search-result__title"]}>
                  {title} {options.map((option) => ` | ${option}`)}
                </h1>
              )}
              <Sort onSort={sortHandler} />
            </div>
          )}
          <motion.ul
            variants={{ visible: { transition: { staggerChildren: 0.5 } } }}
            className={`${classes["cards-container"]} ${
              recipeIsOpen ? classes["cards-container--side"] : ""
            }`}
          >
            {recipesPerPageIsNotEmpty && !recipesIsLoading && recipes}
            {recipesIsLoading && recipeSkeleton}
          </motion.ul>

          {recipesPerPageIsNotEmpty && (
            <div className={classes["search-result__pagination"]}>
              {currentPage > 1 && (
                <div className={classes["search-result__btn"]}>
                  <button onClick={prevPageHandler} disabled={recipesIsLoading}>
                    <ArrowLeftIcon />
                  </button>
                </div>
              )}
              <span className={classes["search-result__page"]}>
                {currentPage}
              </span>
              {!isLastPage && (
                <div className={classes["search-result__btn"]}>
                  <button onClick={nextPageHandler} disabled={recipesIsLoading}>
                    <ArrowRightIcon />
                  </button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
};
export default RecipeItemList;
