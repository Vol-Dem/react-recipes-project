import { useState } from "react";
import classes from "./SearchBox.module.scss";
import { ReactComponent as FilterIcon } from "./../../assets/filter.svg";
import { ReactComponent as SearchIcon } from "./../../assets/search.svg";
import Filter from "./filter/Filter";
import Tags from "./tags/Tags";

function SearchBox({ getFormData }) {
  const [searchInput, setSearchInput] = useState("");
  const [filterIsOpen, setFilterIsOpen] = useState(false);

  const searchPlaceholder = "WHAT RECIPE DO YOU WANT TO FIND?";

  const filterOpenHandler = (e) => {
    e.preventDefault();
    setFilterIsOpen((prevfilterIsOpen) => !prevfilterIsOpen);
  };

  const searchQueryHandler = (e) => {
    setSearchInput(e.target.value);
  };

  const getQueryFromForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const query = formData
      .get("query")
      .replace(/<[^>]*>|[^a-zA-Z0-9,;\-.!?<> ]/g, "")
      .toLowerCase()
      .trim();
    const cuisine = formData.getAll("cuisine").toString();
    const diet = formData.getAll("diet").toString();
    const intolerance = formData.getAll("intolerance").toString();
    const type = formData.getAll("type").toString();
    const maxReadyTime =
      formData.get("max-ready-time")?.replace(/[^0-9 ]/g, "") || "";
    const minCalories =
      formData.get("min-calories")?.replace(/[^0-9 ]/g, "") || "";
    const maxCalories =
      formData.get("max-calories")?.replace(/[^0-9 ]/g, "") || "";

    const formQuery = {
      query,
      cuisine,
      diet,
      intolerance,
      type,
      maxReadyTime,
      minCalories,
      maxCalories,
    };
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
        onSubmit={getQueryFromForm}
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
        />

        <button
          type="button"
          className={classes["search__filter-btn"]}
          onClick={filterOpenHandler}
        >
          <FilterIcon />
        </button>
        <button type="submit" className={classes["search__form-btn"]}>
          <SearchIcon />
          <span className={classes["hidden-xs"]}>Search</span>
        </button>
      </form>
      <Tags onTagClick={getQueryFromTag} />
    </div>
  );
}

export default SearchBox;
