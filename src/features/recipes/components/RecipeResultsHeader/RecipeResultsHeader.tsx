import Sort from "../../../search/components/Sort/Sort";
import classes from "./RecipeResultsHeader.module.scss";

interface RecipeResultsHeaderProps {
  options: string[];
  showTitle: boolean;
  title: string;
  sortValue: string;
  onSort: (value: string) => void;
}

const RecipeResultsHeader = ({
  options,
  showTitle,
  title,
  sortValue,
  onSort,
}: RecipeResultsHeaderProps) => (
  <div className={classes["search-result__head"]}>
    {showTitle && (
      <h1 className={classes["search-result__title"]}>
        {title} {options.map((option) => ` | ${option}`)}
      </h1>
    )}
    <Sort value={sortValue} onSort={onSort} />
  </div>
);

export default RecipeResultsHeader;
