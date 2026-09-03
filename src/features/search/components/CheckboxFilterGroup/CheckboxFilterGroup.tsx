import Checkbox from "../../../../shared/components/ui/Checkbox/Checkbox";
import classes from "./CheckboxFilterGroup.module.scss";

interface CheckboxFilterGroupProps {
  legend: string;
  name: string;
  options: readonly string[];
}

const CheckboxFilterGroup = ({
  legend,
  name,
  options,
}: CheckboxFilterGroupProps) => (
  <fieldset className={classes["search__filter-item"]}>
    <legend className={classes["search__filter-title"]}>{legend}</legend>
    {options.map((option) => (
      <Checkbox key={option} name={name} value={option} label={option} />
    ))}
  </fieldset>
);

export default CheckboxFilterGroup;
