// import { useState } from "react";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import classes from "./SearchBox.module.css";
import Tag from "../ui/Tag";

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
      query: formData.get("query"),
      cuisine: formData.getAll("cuisine").toString(),
      diet: formData.getAll("diet").toString(),
      intolerance: formData.getAll("intolerance").toString(),
      type: formData.getAll("type").toString(),
      maxReadyTime: formData.get("max-ready-time") || "",
      minCalories: formData.get("min-calories") || "",
      maxCalories: formData.get("max-calories") || "",
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
            />
          </svg>
        </span>
        <button type="submit" className={classes["search__btn-submit"]}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>

          <span>Search</span>
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
