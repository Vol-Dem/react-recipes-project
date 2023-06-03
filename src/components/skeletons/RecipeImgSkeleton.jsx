import React from "react";
import Skeleton from "./Skeleton";
import classes from "./RecipeImgSkeleton.module.scss";

const RecipeImgSkeleton = () => {
  return (
    <div className={classes["recipe__img"]}>
      <Skeleton classNames="img" />
    </div>
  );
};

export default RecipeImgSkeleton;
