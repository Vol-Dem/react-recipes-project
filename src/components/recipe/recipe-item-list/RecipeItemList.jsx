import classes from "./RecipeItemList.module.scss";
import { useState, useEffect, useContext } from "react";
import Card from "../../ui/Card";
import RecipeItem from "../recipe-item/RecipeItem";
import Sort from "../sort/Sort";
import RecipeContext from "../../../store/recipe-context";
import Spinner from "../../ui/Spinner";
import { ReactComponent as ArrowLeftIcon } from "./../../../assets/arrow-left.svg";
import { ReactComponent as ArrowRightIcon } from "./../../../assets/arrow-right.svg";

function RecipeItemList({
  data,
  title,
  query,
  epmtyMessage,
  nextPage,
  prevPage,
  isLastPage,
  currentPage,
  recipesIsLoading,
}) {
  const [sortedRecipes, setSortedRecipes] = useState([]);

  const recipeCtx = useContext(RecipeContext);
  const recipeIsOpen = recipeCtx.recipeIsOpen;

  const searchResult = data;
  const sectionTitle = title || query || "Search results";

  const sortHandler = (e) => {
    if (!searchResult.length) {
      return;
    }

    const sort = e ? e.target.value : "calories-asc";
    const [sortBy, sortType] = sort.split("-");

    const res = searchResult.slice().sort((a, b) => {
      if (sortType === "asc") {
        return a[sortBy] - b[sortBy];
      }
      if (sortType === "desc") {
        return b[sortBy] - a[sortBy];
      }
      return true;
    });

    setSortedRecipes(res);
  };

  useEffect(sortHandler, [searchResult]);

  return (
    <div
      className={`${classes["search-result"]} ${
        recipeIsOpen ? classes["hidden-md"] : ""
      }`}
    >
      <Card>
        {recipesIsLoading && <Spinner />}
        {searchResult.length === 0 && !recipesIsLoading && (
          <p className={classes["search-result__empty"]}>{epmtyMessage}</p>
        )}
        {searchResult.length !== 0 && (
          <>
            <div className={classes["search-result__head"]}>
              {!recipeIsOpen && (
                <h1 className={classes["search-result__title"]}>
                  {sectionTitle}
                </h1>
              )}
              <Sort onSort={sortHandler} />
            </div>
            <div
              className={`${classes["cards-container"]} ${
                recipeIsOpen ? classes["cards-container--side"] : ""
              }`}
            >
              {sortedRecipes.map((recipe) => (
                <RecipeItem key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
        {!recipesIsLoading && searchResult.length !== 0 && (
          <div className={classes["search-result__pagination"]}>
            {currentPage > 1 && (
              <div className={classes["search-result__btn"]}>
                <button onClick={prevPage}>
                  <ArrowLeftIcon />
                </button>
              </div>
            )}
            <span className={classes["search-result__page"]}>
              {currentPage}
            </span>
            {!isLastPage && (
              <div className={classes["search-result__btn"]}>
                <button onClick={nextPage}>
                  <ArrowRightIcon />
                </button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default RecipeItemList;
