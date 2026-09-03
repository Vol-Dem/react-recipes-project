import Sort from "../../../search/components/Sort/Sort";
import classes from "./RecipeResultsHeader.module.scss";
import type { ChangeEventHandler } from "react";

interface RecipeResultsHeaderProps {
  options: string[];
  showTitle: boolean;
  title: string;
  onSort: ChangeEventHandler<HTMLSelectElement>;
}

const RecipeResultsHeader = ({
  options,
  showTitle,
  title,
  onSort,
}: RecipeResultsHeaderProps) => (
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
