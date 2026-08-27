import { useState } from "react";
import classes from "./SearchBox.module.scss";
import FilterIcon from "../../../../assets/icons/filter.svg?react";
import SearchIcon from "../../../../assets/icons/search.svg?react";
import Filter from "../Filter/Filter";
import Tags from "../Tags/Tags";
import { motion } from "framer-motion";
import { parseSearchFormData } from "../../utils/searchForm";

const SearchBox = ({ getFormData }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filterIsOpen, setFilterIsOpen] = useState(false);

  const searchPlaceholder = "WHAT RECIPE DO YOU WANT TO FIND?";

  const filterOpenHandler = (e) => {
    e.preventDefault();
    setFilterIsOpen((previousFilterIsOpen) => !previousFilterIsOpen);
  };

  const searchQueryHandler = (e) => {
    setSearchInput(e.target.value);
  };

  const submitFormHandler = (e) => {
    e.preventDefault();
    const formQuery = parseSearchFormData(new FormData(e.currentTarget));

    getFormData(formQuery);
    setSearchInput("");
    setFilterIsOpen(false);
  };

  const getQueryFromTag = (e) => {
    const query = e.target.dataset.query;
    const type = e.target.dataset.type;
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
          className={`${classes["search__filter"]} ${
            filterIsOpen ? classes.active : ""
          }`}
        >
          {filterIsOpen && <Filter />}
        </div>

        <input
          type="text"
          name="query"
          value={searchInput}
          onChange={searchQueryHandler}
          placeholder={searchPlaceholder}
          className={classes["search__form-input"]}
          data-testid="search-input"
        />

        <motion.button
          whileHover={{ scale: 1.1, transition: { type: "spring" } }}
          whileTap={{ scale: 0.95 }}
          type="button"
          data-testid="filter-btn"
          className={classes["search__filter-btn"]}
          onClick={filterOpenHandler}
          title="Filter"
        >
          <FilterIcon />
        </motion.button>
        <button
          type="submit"
          data-testid="search-submit"
          className={classes["search__form-btn"]}
          title="Search"
        >
          <SearchIcon />
          <span className={classes["hidden-xs"]}>Search</span>
        </button>
      </form>
      <Tags onTagClick={getQueryFromTag} />
    </div>
  );
};

export default SearchBox;
