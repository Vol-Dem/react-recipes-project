import { useSelector } from "react-redux";
import classes from "./Sort.module.scss";
import { selectRecipeOrderValue } from "../../../recipes/store/recipesSelectors";
import type { ChangeEventHandler } from "react";

const Sort = ({
  onSort,
}: {
  onSort: ChangeEventHandler<HTMLSelectElement>;
}) => {
  const orderBy = useSelector(selectRecipeOrderValue);

  return (
    <div className={classes["search-result__sort"]}>
      <label htmlFor="sort">Sort&nbsp;by</label>
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
