import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import classes from "./SearchBox.module.scss";
import FilterIcon from "../../../../assets/icons/filter.svg?react";
import SearchIcon from "../../../../assets/icons/search.svg?react";
import Filter from "../Filter/Filter";
import Tags from "../Tags/Tags";
import { motion } from "framer-motion";
import { parseSearchFormData } from "../../utils/searchForm";
import {
  BUTTON_HOVER_ANIMATION,
  BUTTON_TAP_ANIMATION,
} from "../../../../shared/constants";
import type { SearchFilters } from "../../../recipes/types";

interface SearchBoxProps {
  getFormData: (filters: SearchFilters) => void;
}

const SearchBox = ({ getFormData }: SearchBoxProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [filterIsOpen, setFilterIsOpen] = useState(false);

  const searchPlaceholder = "WHAT RECIPE DO YOU WANT TO FIND?";

  const filterOpenHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilterIsOpen((previousFilterIsOpen) => !previousFilterIsOpen);
  };

  const searchQueryHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formQuery = parseSearchFormData(new FormData(e.currentTarget));

    getFormData(formQuery);
    setSearchInput("");
    setFilterIsOpen(false);
  };

  const getQueryFromTag = (e: MouseEvent<HTMLButtonElement>) => {
    const query = e.currentTarget.dataset.query;
    const type = e.currentTarget.dataset.type;

    if (!query || !type) return;

    getFormData({ [type]: query });
  };

  return (
    <div className={classes.search}>
      <form
        id="search"
        className={classes["search__form"]}
        onSubmit={submitFormHandler}
      >
        <div
          id="search-filters"
          className={`${classes["search__filter"]} ${
            filterIsOpen ? classes.active : ""
          }`}
        >
          {filterIsOpen && <Filter />}
        </div>

        <input
          type="text"
          name="query"
          aria-label="Search recipes"
          value={searchInput}
          onChange={searchQueryHandler}
          placeholder={searchPlaceholder}
          className={classes["search__form-input"]}
          data-testid="search-input"
        />

        <motion.button
          whileHover={BUTTON_HOVER_ANIMATION}
          whileTap={BUTTON_TAP_ANIMATION}
          type="button"
          data-testid="filter-btn"
          className={classes["search__filter-btn"]}
          onClick={filterOpenHandler}
          aria-label={
            filterIsOpen ? "Hide search filters" : "Show search filters"
          }
          aria-expanded={filterIsOpen}
          aria-controls="search-filters"
        >
          <FilterIcon aria-hidden="true" focusable="false" />
        </motion.button>
        <button
          type="submit"
          data-testid="search-submit"
          className={classes["search__form-btn"]}
          aria-label="Search recipes"
        >
          <SearchIcon aria-hidden="true" focusable="false" />
          <span className={classes["hidden-xs"]}>Search</span>
        </button>
      </form>
      <Tags onTagClick={getQueryFromTag} />
    </div>
  );
};

export default SearchBox;
