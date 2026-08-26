import classes from "./Tags.module.scss";
import Tag from "../../ui/Tag";

const Tags = ({ onTagClick }) => {
  return (
    <div
      className={classes["search__tags"]}
      role="group"
      aria-label="Quick recipe filters"
    >
      <Tag query="vegetarian" type="diet" onClick={onTagClick}>
        Vegetarian
      </Tag>
      <Tag query="300" type="maxCalories" onClick={onTagClick}>
        &#60;300KCAL
      </Tag>
      <Tag query="breakfast" type="type" onClick={onTagClick}>
        Breakfast
      </Tag>
      <Tag query="15" type="maxReadyTime" onClick={onTagClick}>
        &#60;15min
      </Tag>
      <Tag query="Gluten free" type="diet" onClick={onTagClick}>
        Gluten free
      </Tag>
    </div>
  );
};

export default Tags;
