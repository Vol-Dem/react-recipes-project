import classes from "./Sort.module.css";

const Sort = (props) => {
  return (
    <div className={classes["search-head__sort"]}>
      <span>Sort by</span>
      <select
        className={classes["search-head__sort--select"]}
        name="sort"
        id="sort"
        onChange={props.onSort}
      >
        <option value="calories-asc">Calories up</option>
        <option value="calories-desc">Calories down</option>
        <option value="time-asc">Time up</option>
        <option value="time-desc">Time down</option>
      </select>
    </div>
  );
};

export default Sort;
