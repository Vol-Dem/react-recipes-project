import classes from "./Filter.module.scss";
import Checkbox from "../../ui/Checkbox";
import Input from "../../ui/Input";

const Filter = () => {
  return (
    <>
      <fieldset className={classes["search__filter-item"]}>
        <legend className={classes["search__filter-title"]}>Cuisine</legend>
        <Checkbox
          type="checkbox"
          name="cuisine"
          value="italian"
          label="italian"
        />
        <Checkbox
          type="checkbox"
          name="cuisine"
          value="french"
          label="french"
        />
        <Checkbox
          type="checkbox"
          name="cuisine"
          value="japanese"
          label="japanese"
        />
        <Checkbox
          type="checkbox"
          name="cuisine"
          value="chinese"
          label="chinese"
        />
        <Checkbox
          type="checkbox"
          name="cuisine"
          value="korean"
          label="korean"
        />
      </fieldset>
      <fieldset className={classes["search__filter-item"]}>
        <legend className={classes["search__filter-title"]}>Diet</legend>
        <Checkbox
          type="checkbox"
          name="diet"
          value="gluten-free"
          label="gluten-free"
        />
        <Checkbox
          type="checkbox"
          name="diet"
          value="ketogenic"
          label="ketogenic"
        />
        <Checkbox
          type="checkbox"
          name="diet"
          value="vegetarian"
          label="vegetarian"
        />
        <Checkbox
          type="checkbox"
          name="diet"
          value="pescetarian"
          label="pescetarian"
        />
      </fieldset>
      <fieldset className={classes["search__filter-item"]}>
        <legend className={classes["search__filter-title"]}>Intolerance</legend>
        <Checkbox
          type="checkbox"
          name="intolerance"
          value="gluten"
          label="gluten"
        />
        <Checkbox
          type="checkbox"
          name="intolerance"
          value="seafood"
          label="seafood"
        />
        <Checkbox type="checkbox" name="intolerance" value="egg" label="egg" />
        <Checkbox
          type="checkbox"
          name="intolerance"
          value="tree-nut"
          label="tree-nut"
        />
      </fieldset>
      <fieldset className={classes["search__filter-item"]}>
        <legend className={classes["search__filter-title"]}>Type</legend>
        <Checkbox type="checkbox" name="type" value="desert" label="desert" />
        <Checkbox type="checkbox" name="type" value="salad" label="salad" />
        <Checkbox
          type="checkbox"
          name="type"
          value="breackfast"
          label="breackfast"
        />
        <Checkbox type="checkbox" name="type" value="soup" label="soup" />
      </fieldset>
      <fieldset className={classes["search__filter-item"]}>
        <label
          htmlFor="max-ready-time"
          className={classes["search__filter-title"]}
        >
          Max ready time (min.)
        </label>
        <Input
          input={{
            type: "number",
            id: "max-ready-time",
            name: "max-ready-time",
            min: "0",
            max: "999",
          }}
        />
        <label
          htmlFor="min-calories"
          className={classes["search__filter-title"]}
        >
          Calories (kcal.)
        </label>
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
