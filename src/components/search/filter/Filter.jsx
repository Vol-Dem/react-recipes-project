import classes from "./Filter.module.scss";
import Checkbox from "../../ui/Checkbox";
import Input from "../../ui/Input";

const Filter = () => {
  return (
    <>
      <fieldset className={classes["search__filter-item"]}>
        <h3 className={classes["search__filter-title"]}>Cuisine</h3>
        <Checkbox type="checkbox" name="cuisine" value="italian" />
        <Checkbox type="checkbox" name="cuisine" value="french" />
        <Checkbox type="checkbox" name="cuisine" value="japanese" />
        <Checkbox type="checkbox" name="cuisine" value="chinese" />
        <Checkbox type="checkbox" name="cuisine" value="korean" />
      </fieldset>
      <fieldset className={classes["search__filter-item"]}>
        <h3 className={classes["search__filter-title"]}>Diet</h3>
        <Checkbox type="checkbox" name="diet" value="gluten-free" />
        <Checkbox type="checkbox" name="diet" value="ketogenic" />
        <Checkbox type="checkbox" name="diet" value="vegetarian" />
        <Checkbox type="checkbox" name="diet" value="pescetarian" />
      </fieldset>
      <fieldset className={classes["search__filter-item"]}>
        <h3 className={classes["search__filter-title"]}>Intolerance</h3>
        <Checkbox type="checkbox" name="intolerance" value="gluten" />
        <Checkbox type="checkbox" name="intolerance" value="seafood" />
        <Checkbox type="checkbox" name="intolerance" value="egg" />
        <Checkbox type="checkbox" name="intolerance" value="tree-nut" />
      </fieldset>
      <fieldset className={classes["search__filter-item"]}>
        <h3 className={classes["search__filter-title"]}>Type</h3>
        <Checkbox type="checkbox" name="type" value="desert" />
        <Checkbox type="checkbox" name="type" value="salad" />
        <Checkbox type="checkbox" name="type" value="breackfast" />
        <Checkbox type="checkbox" name="type" value="soup" />
      </fieldset>
      <fieldset className={classes["search__filter-item"]}>
        <h3 className={classes["search__filter-title"]}>
          Max ready time (min.)
        </h3>
        <Input
          input={{
            type: "number",
            id: "max-ready-time",
            name: "max-ready-time",
            min: "0",
            max: "999",
          }}
        />
        <h3 className={classes["search__filter-title"]}>Calories (kcal.)</h3>
        <div className={classes["search__filter-calories"]}>
          <Input
            input={{
              type: "number",
              id: "min-calories",
              name: "min-calories",
              min: "0",
              max: "9999",
              placeholder: "min",
            }}
          />
          <Input
            input={{
              type: "number",
              id: "max-calories",
              name: "max-calories",
              min: "0",
              max: "9999",
              placeholder: "max",
            }}
          />
        </div>
      </fieldset>
    </>
  );
};

export default Filter;
