import { useState } from "react";
import classes from "./SearchBox.module.css";

function SearchBox(props) {
  // function searchSubmitHandler(e) {
  //   e.preventDefault();
  //   console.log(e.target.firstChild.value);
  // }
  return (
    <div className={classes["search-box"]}>
      <form
        id="search"
        className={`${classes.search} ${classes[props.className]}`}
        onSubmit={props.getFormData}
      >
        <select className={classes.cuisine} name="cuisine" id="">
          <option value="italian">Italian</option>
          <option value="french">French</option>
          <option value="japanese">Japanese</option>
          <option value="chinese">Chinese</option>
          <option value="korean">Korean</option>
        </select>
        <input
          type="text"
          name="query"
          value={props.searchQuery}
          onChange={props.onSearchQueryChange}
          placeholder="WHAT RECIPE DO YOU WANT TO FIND?"
          className={classes.input}
        />
        <a className={classes["search__btn-filter"]}>Y</a>
        <button className={classes["search__btn-submit"]}>Search</button>
      </form>
      <div className={classes.tags}>
        <a href="#">Dietary</a>
        <a href="#">Breakfast</a>
        <a href="#"> 300KCAL</a>
      </div>
    </div>
  );
}

export default SearchBox;
