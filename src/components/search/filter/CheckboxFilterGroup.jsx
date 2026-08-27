import Checkbox from "../../ui/Checkbox";
import classes from "./CheckboxFilterGroup.module.scss";

const CheckboxFilterGroup = ({ legend, name, options }) => (
  <fieldset className={classes["search__filter-item"]}>
    <legend className={classes["search__filter-title"]}>{legend}</legend>
    {options.map((option) => (
      <Checkbox key={option} name={name} value={option} label={option} />
    ))}
  </fieldset>
);

export default CheckboxFilterGroup;
