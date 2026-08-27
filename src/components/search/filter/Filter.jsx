import CheckboxFilterGroup from "./CheckboxFilterGroup";
import { CHECKBOX_FILTERS } from "./filterOptions";
import NumericFilters from "./NumericFilters";

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
