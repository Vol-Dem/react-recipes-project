import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
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
          <ChevronLeftIcon aria-hidden="true" focusable="false" />
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
          <ChevronRightIcon aria-hidden="true" focusable="false" />
        </button>
      </div>
    )}
  </nav>
);

export default RecipePagination;
