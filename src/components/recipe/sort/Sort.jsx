import classes from "./Sort.module.scss";

const Sort = ({ onSort }) => {
  return (
    <div className={classes["search-result__sort"]}>
      <span>Sort&nbsp;by</span>
      <select
        className={classes["search-result__select"]}
        name="sort"
        id="sort"
        onChange={onSort}
      >
        <option value="calories-asc">Calories &uarr;</option>
        <option value="calories-desc">Calories &darr;</option>
        <option value="time-asc">Time &uarr;</option>
        <option value="time-desc">Time &darr;</option>
      </select>
    </div>
  );
};

export default Sort;
