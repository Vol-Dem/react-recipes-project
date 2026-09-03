import CheckboxFilterGroup from "../CheckboxFilterGroup/CheckboxFilterGroup";
import { CHECKBOX_FILTERS } from "../../constants/filterOptions";
import NumericFilters from "../NumericFilters/NumericFilters";

const Filter = () => {
  return (
    <>
      {CHECKBOX_FILTERS.map(({ legend, name, options }) => (
        <CheckboxFilterGroup
          key={name}
          legend={legend}
          name={name}
          options={options}
        />
      ))}
      <NumericFilters />
    </>
  );
};

export default Filter;
