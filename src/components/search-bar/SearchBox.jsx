// import { useState } from "react";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import classes from "./SearchBox.module.css";
import Tag from "../ui/Tag";
import { ReactComponent as FilterIcon } from "./../../assets/filter.svg";
import { ReactComponent as SearchIcon } from "./../../assets/search.svg";
function SearchBox(props) {
  // function searchSubmitHandler(e) {
  //   e.preventDefault();
  //   console.log(e.target.firstChild.value);
  // }
  const getQueryFromForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // e.target.reset();

    const formQuery = {
      query: formData
        .get("query")
        .replace(/<[^>]*>|[^a-zA-Z0-9,;\-.!?<> ]/g, "")
        .toLowerCase()
        .trim(),
      cuisine: formData.getAll("cuisine").toString(),
      diet: formData.getAll("diet").toString(),
      intolerance: formData.getAll("intolerance").toString(),
      type: formData.getAll("type").toString(),
      maxReadyTime:
        formData.get("max-ready-time")?.replace(/[^0-9 ]/g, "") || "",
      minCalories: formData.get("min-calories")?.replace(/[^0-9 ]/g, "") || "",
      maxCalories: formData.get("max-calories")?.replace(/[^0-9 ]/g, "") || "",
    };
    props.getFormData(formQuery);
  };

  const getQueryFromTag = (e) => {
    const query = e.target.dataset.query;
    const type = e.target.dataset.type;
    props.getFormData({ [type]: query });
  };

  return (
    <div className={classes["search-box"]}>
      <form
        id="search"
        className={`${classes.search} ${classes[props.className]}`}
        onSubmit={getQueryFromForm}
      >
        <div
          className={`${classes.filter} ${props.filterState && classes.active}`}
        >
          {props.filterState && (
            <>
              <fieldset className={classes["filter-element"]}>
                <h3>Cuisine</h3>
                <Checkbox type="checkbox" name="cuisine" value="italian" />
                <Checkbox type="checkbox" name="cuisine" value="french" />
                <Checkbox type="checkbox" name="cuisine" value="japanese" />
                <Checkbox type="checkbox" name="cuisine" value="chinese" />
                <Checkbox type="checkbox" name="cuisine" value="korean" />
              </fieldset>
              <fieldset className={classes["filter-element"]}>
                <h3>Diet</h3>
                <Checkbox type="checkbox" name="diet" value="gluten-free" />
                <Checkbox type="checkbox" name="diet" value="ketogenic" />
                <Checkbox type="checkbox" name="diet" value="vegetarian" />
                <Checkbox type="checkbox" name="diet" value="pescetarian" />
              </fieldset>
              <fieldset className={classes["filter-element"]}>
                <h3>Intolerance</h3>
                <Checkbox type="checkbox" name="intolerance" value="gluten" />
                <Checkbox type="checkbox" name="intolerance" value="seafood" />
                <Checkbox type="checkbox" name="intolerance" value="egg" />
                <Checkbox type="checkbox" name="intolerance" value="tree-nut" />
              </fieldset>
              <fieldset className={classes["filter-element"]}>
                <h3>Type</h3>
                <Checkbox type="checkbox" name="type" value="desert" />
                <Checkbox type="checkbox" name="type" value="salad" />
                <Checkbox type="checkbox" name="type" value="breackfast" />
                <Checkbox type="checkbox" name="type" value="soup" />
              </fieldset>
              <fieldset className={classes["filter-element"]}>
                <h3>Max ready time (min.)</h3>
                <Input
                  input={{
                    type: "number",
                    id: "max-ready-time",
                    name: "max-ready-time",
                    min: "0",
                    max: "999",
                  }}
                />
                <h3>Calories (kcal.)</h3>
                <div className={classes.calories}>
                  <Input
                    input={{
                      type: "number",
                      id: "min-calories",
                      name: "min-calories",
                      min: "0",
                      max: "9999",
                      placeholder: "min",
                    }}
                  />
                  <Input
                    input={{
                      type: "number",
                      id: "max-calories",
                      name: "max-calories",
                      min: "0",
                      max: "9999",
                      placeholder: "max",
                    }}
                  />
                </div>
              </fieldset>
            </>
          )}
        </div>

        <input
          type="text"
          name="query"
          value={props.searchInput}
          onChange={props.onSearchQueryChange}
          placeholder="WHAT RECIPE DO YOU WANT TO FIND?"
          className={classes.input}
        />
        <span
          className={classes["search__btn-filter"]}
          onClick={props.onFilterChange}
        >
          <FilterIcon />
        </span>
        <button type="submit" className={classes["search__btn-submit"]}>
          <SearchIcon />
          <span className={classes["search__btn-submit--text"]}>Search</span>
        </button>
      </form>
      <div className={classes.tags}>
        <Tag
          dataQuery="vegetarian"
          dataType="diet"
          onTagClick={getQueryFromTag}
        >
          Vegetarian
        </Tag>
        <Tag
          dataQuery="300"
          dataType="maxCalories"
          onTagClick={getQueryFromTag}
        >
          &#60;300KCAL
        </Tag>
        <Tag dataQuery="breakfast" dataType="type" onTagClick={getQueryFromTag}>
          Breakfast
        </Tag>
        <Tag
          dataQuery="15"
          dataType="maxReadyTime"
          onTagClick={getQueryFromTag}
        >
          &#60;15min
        </Tag>
        <Tag
          dataQuery="Gluten free"
          dataType="diet"
          onTagClick={getQueryFromTag}
        >
          Gluten free
        </Tag>
      </div>
    </div>
  );
}

export default SearchBox;
