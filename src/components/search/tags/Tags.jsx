import classes from "./Tags.module.scss";
import Tag from "../../ui/Tag";

const QUICK_FILTERS = [
  { label: "Vegetarian", query: "vegetarian", type: "diet" },
  { label: "<300KCAL", query: "300", type: "maxCalories" },
  { label: "Breakfast", query: "breakfast", type: "type" },
  { label: "<15min", query: "15", type: "maxReadyTime" },
  { label: "Gluten free", query: "Gluten free", type: "diet" },
];

const Tags = ({ onTagClick }) => {
  return (
    <div
      className={classes["search__tags"]}
      role="group"
      aria-label="Quick recipe filters"
    >
      {QUICK_FILTERS.map(({ label, query, type }) => (
        <Tag key={`${type}-${query}`} query={query} type={type} onClick={onTagClick}>
          {label}
        </Tag>
      ))}
    </div>
  );
};

export default Tags;
