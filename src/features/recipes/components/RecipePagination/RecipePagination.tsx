import ArrowLeftIcon from "../../../../assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "../../../../assets/icons/arrow-right.svg?react";
import classes from "./RecipePagination.module.scss";

interface RecipePaginationProps {
  currentPage: number;
  isLastPage: boolean;
  isLoading: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const RecipePagination = ({
  currentPage,
  isLastPage,
  isLoading,
  onNextPage,
  onPreviousPage,
}: RecipePaginationProps) => (
  <nav
    className={classes["search-result__pagination"]}
    aria-label="Recipe results pages"
  >
    {currentPage > 1 && (
      <div className={classes["search-result__btn"]}>
        <button
          type="button"
          disabled={isLoading}
          aria-label="Previous results page"
          onClick={onPreviousPage}
        >
          <ArrowLeftIcon aria-hidden="true" focusable="false" />
        </button>
      </div>
    )}
    <span className={classes["search-result__page"]}>{currentPage}</span>
    {!isLastPage && (
      <div className={classes["search-result__btn"]}>
        <button
          type="button"
          disabled={isLoading}
          aria-label="Next results page"
          onClick={onNextPage}
        >
          <ArrowRightIcon aria-hidden="true" focusable="false" />
        </button>
      </div>
    )}
  </nav>
);

export default RecipePagination;
