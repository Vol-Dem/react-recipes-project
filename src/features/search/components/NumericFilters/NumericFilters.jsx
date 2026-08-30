import Input from "../../../../shared/components/ui/Input/Input";
import classes from "./NumericFilters.module.scss";

const NumericFilters = () => (
  <fieldset className={classes["search__filter-item"]}>
    <label htmlFor="max-ready-time" className={classes["search__filter-title"]}>
      Max ready time (min.)
    </label>
    <Input
      id="max-ready-time"
      name="max-ready-time"
      type="number"
      min="0"
      max="999"
    />
    <label htmlFor="min-calories" className={classes["search__filter-title"]}>
      Calories (kcal.)
    </label>
    <div className={classes["search__filter-calories"]}>
      <Input
        id="min-calories"
        name="min-calories"
        type="number"
        min="0"
        max="9999"
        placeholder="min"
      />
      <Input
        id="max-calories"
        name="max-calories"
        type="number"
        min="0"
        max="9999"
        placeholder="max"
      />
    </div>
  </fieldset>
);

export default NumericFilters;
