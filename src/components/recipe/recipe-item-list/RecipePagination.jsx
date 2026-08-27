import ArrowLeftIcon from "../../../assets/arrow-left.svg?react";
import ArrowRightIcon from "../../../assets/arrow-right.svg?react";
import classes from "./RecipePagination.module.scss";

const RecipePagination = ({
  currentPage,
  isLastPage,
  isLoading,
  onNextPage,
  onPreviousPage,
}) => (
  <nav
    className={classes["search-result__pagination"]}
    aria-label="Recipe results pages"
  >
    {currentPage > 1 && (
      <div className={classes["search-result__btn"]}>
        <button
          disabled={isLoading}
          aria-label="Previous results page"
          onClick={onPreviousPage}
        >
          <ArrowLeftIcon />
        </button>
      </div>
    )}
    <span className={classes["search-result__page"]}>{currentPage}</span>
    {!isLastPage && (
      <div className={classes["search-result__btn"]}>
        <button
          disabled={isLoading}
          aria-label="Next results page"
          onClick={onNextPage}
        >
          <ArrowRightIcon />
        </button>
      </div>
    )}
  </nav>
);

export default RecipePagination;
