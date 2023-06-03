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

const RecipeItemList = ({ firebaseRef, filter }) => {
  const dispatch = useDispatch();
  const { recipeId } = useParams();
  const recipeIsOpen = !!recipeId;
  const recipesPerPage = useSelector((state) => state.recipe.recipesPerPage);
  const recipesPerPageIsEmpty = !!recipesPerPage.length;
  const currentPage = useSelector((state) => state.recipe.currentPage);
  const isLastPage = useSelector((state) => state.recipe.isLastPage);
  const recipesIsLoading = useSelector(
    (state) => state.recipe.recipesIsLoading
  );
  const title = useSelector((state) => state.recipe.title);
  const emptyMessage = useSelector((state) => state.recipe.emptyMessage);

  const recipes = recipesPerPage.map((recipe) => (
    <RecipeItem key={recipe.id} recipe={recipe} />
  ));

  const recipeSkeleton = [
    ...Array(+process.env.REACT_APP_AMOUNT_PER_PAGE).keys(),
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
    dispatch(recipeActions.setOrderBy([sortBy, sortType]));
    dispatch(sortRecipes(firebaseRef, filter));
  };

  return (
    <div className={classes["search-result__container"]}>
      <div
        className={`${classes["search-result"]} ${
          recipeIsOpen ? classes["hidden-md"] : ""
        }`}
      >
        <Card>
          {!recipesPerPageIsEmpty && !recipesIsLoading && (
            <p className={classes["search-result__empty"]}>{emptyMessage}</p>
          )}

          {recipesPerPageIsEmpty && (
            <div className={classes["search-result__head"]}>
              {!recipeIsOpen && (
                <h1 className={classes["search-result__title"]}>{title}</h1>
              )}
              <Sort onSort={sortHandler} />
            </div>
          )}
          <div
            className={`${classes["cards-container"]} ${
              recipeIsOpen ? classes["cards-container--side"] : ""
            }`}
          >
            {recipesPerPageIsEmpty && !recipesIsLoading && recipes}
            {recipesIsLoading && recipeSkeleton}
          </div>

          {recipesPerPageIsEmpty && (
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
    </div>
  );
};
export default RecipeItemList;
