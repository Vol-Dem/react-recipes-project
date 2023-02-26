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
        <a href="/" className={classes["search__btn-filter"]}>
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
        </a>
        <button className={classes["search__btn-submit"]}>
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
        <a href="/d">Dietary</a>
        <a href="/d">Breakfast</a>
        <a href="/d"> 300KCAL</a>
      </div>
    </div>
  );
}

export default SearchBox;
