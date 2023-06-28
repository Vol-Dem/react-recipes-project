import { useSelector } from "react-redux";
import classes from "./Sort.module.scss";

const Sort = ({ onSort }) => {
  const orderBy = Object.values(
    useSelector((state) => state.recipe.orderBy)
  ).join("-");

  return (
    <div className={classes["search-result__sort"]}>
      <span>Sort&nbsp;by</span>
      <select
        className={classes["search-result__select"]}
        name="sort"
        id="sort"
        value={orderBy}
        onChange={onSort}
      >
        <option value="-">-</option>
        <option value="calories-asc">Calories &uarr;</option>
        <option value="calories-desc">Calories &darr;</option>
        <option value="readyInMinutes-asc">Time &uarr;</option>
        <option value="readyInMinutes-desc">Time &darr;</option>
      </select>
    </div>
  );
};

export default Sort;
