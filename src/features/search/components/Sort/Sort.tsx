import classes from "./Sort.module.scss";
import Select from "../../../../shared/components/ui/Select/Select";
import { SORT_OPTIONS } from "../../constants/sortOptions";

const Sort = ({
  onSort,
  value,
}: {
  onSort: (value: string) => void;
  value: string;
}) => (
  <div className={classes["search-result__sort"]}>
    <Select
      label="Sort by"
      name="sort"
      options={SORT_OPTIONS}
      value={value}
      onChange={onSort}
    />
  </div>
);

export default Sort;
