import Sort from "../sort/Sort";
import classes from "./RecipeResultsHeader.module.scss";

const RecipeResultsHeader = ({ options, showTitle, title, onSort }) => (
  <div className={classes["search-result__head"]}>
    {showTitle && (
      <h1 className={classes["search-result__title"]}>
        {title} {options.map((option) => ` | ${option}`)}
      </h1>
    )}
    <Sort onSort={onSort} />
  </div>
);

export default RecipeResultsHeader;
