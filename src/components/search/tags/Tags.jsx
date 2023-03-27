import classes from "./Tags.module.scss";
import Tag from "../../ui/Tag";

const Tags = ({ onTagClick }) => {
  return (
    <div className={classes["search__tags"]}>
      <Tag
        tagCfg={{
          dataQuery: "vegetarian",
          dataType: "diet",
          onTagClick,
        }}
      >
        Vegetarian
      </Tag>
      <Tag
        tagCfg={{
          dataQuery: "300",
          dataType: "maxCalories",
          onTagClick,
        }}
      >
        &#60;300KCAL
      </Tag>
      <Tag
        tagCfg={{
          dataQuery: "breakfast",
          dataType: "type",
          onTagClick,
        }}
      >
        Breakfast
      </Tag>
      <Tag
        tagCfg={{
          dataQuery: "15",
          dataType: "maxReadyTime",
          onTagClick,
        }}
      >
        &#60;15min
      </Tag>
      <Tag
        tagCfg={{
          dataQuery: "Gluten free",
          dataType: "diet",
          onTagClick,
        }}
      >
        Gluten free
      </Tag>
    </div>
  );
};

export default Tags;
