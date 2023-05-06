import classes from "./RecipeHeadSkeleton.module.scss";
import Skeleton from "./Skeleton";

const RecipeHeadSkeleton = () => {
  return (
    <div className={`${classes["recipe__head"]} ${classes["animation-show"]}`}>
      <div className={classes["recipe__diets"]}>
        <Skeleton classNames="text width-50" />
      </div>
      <div>
        <Skeleton classNames="title width-100" />
        <Skeleton classNames="title width-80" />
        <Skeleton classNames="title width-50" />
        <Skeleton classNames="title width-40" />
      </div>
      <div className={classes["recipe__img"]}>
        <Skeleton classNames="img" />
      </div>
    </div>
  );
};

export default RecipeHeadSkeleton;
