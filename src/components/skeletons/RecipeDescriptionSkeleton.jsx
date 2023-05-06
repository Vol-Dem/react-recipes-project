import classes from "./RecipeDescriptionSkeleton.module.scss";
import Skeleton from "./Skeleton";

const RecipeDescriptionSkeleton = () => {
  return (
    <div className={classes["recipe__description"]}>
      <Skeleton classNames="text width-20" />
      <div>
        <h3 className={classes["recipe__subtitle"]}>Ingridients</h3>
        <Skeleton classNames="text width-100" />
        <Skeleton classNames="text width-100" />
        <Skeleton classNames="text width-100" />
        <Skeleton classNames="text width-100" />
      </div>
      <div>
        <h3 className={classes["recipe__subtitle"]}>Instructions</h3>
        <Skeleton classNames="text width-100" />
        <Skeleton classNames="text width-80" />
        <Skeleton classNames="text width-100" />
        <Skeleton classNames="text width-80" />
        <Skeleton classNames="text width-50" />
      </div>
      <div>
        <h3 className={classes["recipe__subtitle"]}>Nutrition</h3>
        <div className={classes.nutrition}>
          <Skeleton classNames="circle" />
          <Skeleton classNames="circle" />
          <Skeleton classNames="circle" />
          <Skeleton classNames="circle" />
        </div>
      </div>
    </div>
  );
};

export default RecipeDescriptionSkeleton;
